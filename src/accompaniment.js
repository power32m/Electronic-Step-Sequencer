import {scaleNote,nearestPitch} from './project.js';

const grooves=[
 {name:'流行律动',kick:[0,6,8,10],snare:[4,12],hat:[0,2,4,6,8,10,12,14],bass:[0,6,8,14],chord:[0,8]},
 {name:'切分放克',kick:[0,3,7,10],snare:[4,12],hat:[0,2,3,6,8,10,11,14],bass:[0,3,6,10,14],chord:[2,7,10,14]},
 {name:'四拍舞曲',kick:[0,4,8,12],snare:[4,12],hat:[2,6,10,14],bass:[0,2,4,6,8,10,12,14],chord:[2,6,10,14]},
 {name:'半拍节奏',kick:[0,7,11],snare:[8],hat:[0,2,4,6,8,10,12,14,15],bass:[0,7,11],chord:[0,10]},
 {name:'轻盈切分',kick:[0,6,10],snare:[4,12],hat:[0,2,4,6,8,10,12,14],bass:[0,6,8,14],chord:[0,3,6,10,13]}
];

// Generate a whole accompaniment while preserving the lead, harmony and mixer.
export function generateAccompaniment(p){
 if(p.source)throw Error('请先新建空白工程，再生成随机伴奏。');
 p.seed=(p.seed+7919)%2147483647;
 let state=p.seed>>>0;
 const random=()=>{state=(Math.imul(state,1664525)+1013904223)>>>0;return state/4294967296;};
 const groove=grooves[Math.floor(p.seed/7919)%grooves.length],count=p.phraseBars*16;
 for(const ti of [0,1,2,3,5])p.tracks[ti].steps=Array.from({length:count},()=>({on:false,note:ti===3?36:ti===5?48:42,velocity:.76,length:1}));
 p.tracks[3].mode='single';p.tracks[5].mode='triad';
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
 return groove.name;
}
