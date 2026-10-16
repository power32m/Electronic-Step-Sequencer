import {scaleNote,nearestPitch} from './project.js';

// Each family has two arrangements; repeated generation stays in the selected style.
const grooves=[
 {id:'pop',name:'流行',patterns:[
  [[0,6,8,10],[4,12],[0,2,4,6,8,10,12,14],[0,6,8,14],[0,8]],
  [[0,7,8,14],[4,12],[0,2,4,6,8,10,12,14],[0,4,7,8,12],[0,6,12]]]},
 {id:'rock',name:'摇滚',patterns:[
  [[0,2,8,10],[4,12],[0,2,4,6,8,10,12,14],[0,2,4,6,8,10,12,14],[0,4,8,12]],
  [[0,3,6,8,11],[4,12],[0,2,4,6,8,10,12,14],[0,3,4,8,11,12,14],[0,6,8,14]]]},
 {id:'funk',name:'放克',patterns:[
  [[0,3,7,10],[4,12],[0,2,3,6,8,10,11,14],[0,3,6,10,14],[2,7,10,14]],
  [[0,6,9,14],[4,12],[0,2,5,6,8,10,13,14],[0,3,6,9,12,14],[3,6,11,14]]]},
 {id:'dance',name:'电子舞曲',patterns:[
  [[0,4,8,12],[4,12],[2,6,10,14],[0,2,4,6,8,10,12,14],[2,6,10,14]],
  [[0,4,8,12],[4,12],[2,6,10,14,15],[2,6,10,14],[0,3,6,8,11,14]]]},
 {id:'hiphop',name:'嘻哈',patterns:[
  [[0,7,11],[8],[0,2,4,6,8,10,12,14,15],[0,7,11],[0,10]],
  [[0,3,10,14],[8],[0,2,4,6,7,8,10,12,14],[0,3,10,14],[0,6,12]]]},
 {id:'latin',name:'拉丁',patterns:[
  [[0,6,10],[4,12],[0,2,4,6,8,10,12,14],[0,6,8,14],[0,3,6,10,13]],
  [[0,7,10,14],[4,11],[0,2,4,6,8,10,12,14],[0,6,10,14],[0,3,7,10,14]]]},
 {id:'chip',name:'FC 芯片',patterns:[
  [[0,6,8,14],[4,12],[0,2,4,6,8,10,12,14],[0,2,4,6,8,10,12,14],[0,4,8,12]],
  [[0,3,8,11],[4,12],[0,2,4,6,8,10,12,14,15],[0,3,4,7,8,11,12,15],[0,3,6,8,11,14]]]}
];

// Generate a whole accompaniment while preserving the lead, harmony and mixer.
export function generateAccompaniment(p,style=p.accompanimentStyle??'auto'){
 if(p.source)throw Error('请先新建空白工程，再生成随机伴奏。');
 if(style!=='auto'&&!grooves.some(g=>g.id===style))throw Error('不支持的伴奏风格。');
 p.accompanimentStyle=style;
 p.seed=(p.seed+7919)%2147483647;
 let state=p.seed>>>0;
 const random=()=>{state=(Math.imul(state,1664525)+1013904223)>>>0;return state/4294967296;};
 const turn=Math.floor(p.seed/7919),family=style==='auto'?grooves[turn%grooves.length]:grooves.find(g=>g.id===style);
 const [kick,snare,hat,bass,chord]=family.patterns[turn%family.patterns.length];
 const groove={kick,snare,hat,bass,chord},count=p.phraseBars*16;
 for(const ti of [0,1,2,3,5])p.tracks[ti].steps=Array.from({length:count},()=>({on:false,note:ti===3?36:ti===5?48:42,velocity:.76,length:1}));
 p.tracks[3].mode='single';p.tracks[5].mode='triad';
 p.tracks[3].sound=family.id==='chip'?'triangle':'bass';
 p.tracks[5].sound={pop:'keys',rock:'pluck',funk:'keys',dance:'pluck',hiphop:'pad',latin:'keys',chip:'pulse'}[family.id];
 function put(ti,index,note,length,velocity){
  p.tracks[ti].steps[index]={on:true,note,length:Math.min(length,count-index),velocity:Math.max(.15,Math.min(1,velocity))};
 }
 for(let bar=0;bar<p.phraseBars;bar++){
  const base=bar*16,degree=p.progression[bar];
  for(const [ti,positions,note,level] of [[0,groove.kick,36,.85],[1,groove.snare,38,.69],[2,groove.hat,42,.44]])
   for(const i of positions)put(ti,base+i,note,1,level+(random()-.5)*.14-(ti===2&&i%4!==0?.09:0));
  // A short fill marks each four-bar phrase without breaking the chosen groove.
  if((bar+1)%4===0){put(1,base+14,38,1,.48+random()*.12);put(2,base+15,42,1,.4);}
  const bass=groove.bass;
  bass.forEach((i,j)=>{
   const interval=j===0?0:random()<.55?0:random()<.5?4:2;
   const note=nearestPitch(p,scaleNote(p,degree+interval,36),28,55,true);
   put(3,base+i,note,Math.max(.5,(bass[j+1]??16)-i-.25),.7+random()*.14);
  });
  groove.chord.forEach((i,j)=>{
   const note=nearestPitch(p,scaleNote(p,degree,48),45,64,true);
   const gap=(groove.chord[j+1]??16)-i;
   put(5,base+i,note,Math.max(.5,gap*(groove.chord.length>2?.6:.85)),.5+random()*.16);
  });
 }
 return family.name;
}
