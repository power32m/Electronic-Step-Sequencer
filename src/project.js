import {GROOVE_STYLES} from './groove-styles.js';
import {classicScores} from './classic-scores.js';
import {stepEvents} from './events.js';
import {bossScore} from './boss-score.js';
export const STORE = 'op16-project-v3';
export const PREVIOUS_STORE = 'op16-project-v2';
export const LEGACY_STORE = 'op16-project-v1';
export const STEPS = 64;
export const names = ['底鼓','军鼓','踩镲','贝斯','主旋律','和弦'];
export const PRESETS = ['赤影战士 · Boss 战',...classicScores.map(s=>s.name)];
export const ROOTS = ['C','C♯','D','D♯','E','F','F♯','G','G♯','A','A♯','B'];
export const SCALES = {major:[0,2,4,5,7,9,11],minor:[0,2,3,5,7,8,10]};
export const SOUNDS = [ [['kick','底鼓']], [['snare','军鼓']], [['hat','踩镲']], [['bass','模拟贝斯'],['sub','圆润低音'],['triangle','FC三角波']], [['keys','电钢琴'],['pluck','拨弦'],['lead','柔和合成音'],['pulse','FC方波']], [['pad','柔和铺底'],['keys','电钢琴'],['pluck','拨弦'],['pulse','FC方波']] ];
export const copy = x => structuredClone(x);
export const noteName = n => ROOTS[((n%12)+12)%12]+(Math.floor(n/12)-1);
export const stepDuration = (p,i) => 60/p.bpm/4*(1+(i%2===0?1:-1)*p.swing/100);
export const audible = (p,t) => !t.mute && (!p.tracks.some(x=>x.solo)||t.solo);
export const inScale = (p,n) => SCALES[p.scale].includes(((n-p.key)%12+12)%12);
export function scaleNote(p,degree,base=0) {return base+p.key+Math.floor(degree/7)*12+SCALES[p.scale][((degree%7)+7)%7];}
export function nearestPitch(p,n,low=24,high=96,lock=p.scaleLock) {
 let best=low,distance=Infinity;
 for(let k=low;k<=high;k++){if(lock&&!inScale(p,k))continue;const gap=Math.abs(k-n);if(gap<distance){distance=gap;best=k;}}
 return best;
}
function degreeOf(p,n){const oct=Math.floor((n-p.key)/12);let best=oct*7,gap=Infinity;for(let d=oct*7-1;d<=oct*7+7;d++){const g=Math.abs(scaleNote(p,d)-n);if(g<gap){gap=g;best=d;}}return best;}
export function triadNotes(p,root){const d=degreeOf(p,root),ref=scaleNote(p,d);return [root,root+scaleNote(p,d+2)-ref,root+scaleNote(p,d+4)-ref];}
export const eventNotes = (p,ti,s) => s.hits??(ti===5&&p.tracks[ti].mode!=='single'?triadNotes(p,s.note):[s.note]);
export function chordName(p,degree){const root=scaleNote(p,degree,48),n=triadNotes(p,root);return ROOTS[root%12]+(n[2]-root===6?'dim':n[1]-root===3?'m':'');}
export function transposeProject(p,key,scale){const old={key:p.key,scale:p.scale};const edits=p.tracks.slice(3).flatMap(t=>t.steps.flatMap(s=>[s,...(s.extra??[])].map(e=>[e,degreeOf(old,e.note)])));p.key=key;p.scale=scale;for(const [e,d] of edits)e.note=nearestPitch(p,scaleNote(p,d),24,96,true);}
function melodyPitch(p,n){while(n>84)n-=12;while(n<60)n+=12;return nearestPitch(p,n,60,84,true);}
const blankStep=(note=60)=>({on:false,velocity:.76,note,length:2});
function blankProject(name){return {version:3,phraseBars:4,accompanimentStyle:'auto',name,bpm:96,swing:6,cutoff:10000,master:.75,bars:4,seed:4827,key:0,scale:'major',scaleLock:true,progression:[0,5,3,4],display:{explode:0,xray:0,color:'柿橙',top:false,auto:false,labels:false,keyboardTrack:4,keyboardOctave:3},tracks:names.map((name,i)=>({name,mode:i===5?'triad':'single',sound:['kick','snare','hat','bass','keys','pad'][i],volume:[.7,.45,.25,.52,.76,.34][i],mute:false,solo:false,steps:Array.from({length:STEPS},()=>blankStep(i===3?36:i===5?48:64))}))};}
function registerRoot(p,d,low,high){let n=scaleNote(p,d,36);while(n>high)n-=12;while(n<low)n+=12;return n;}
export function setHarmony(p,bar,degree){const prev=p.progression[bar],delta=registerRoot(p,degree,28,43)-registerRoot(p,prev,28,43);p.progression[bar]=degree;for(let i=bar*16;i<bar*16+16;i++){p.tracks[3].steps[i].note=nearestPitch(p,p.tracks[3].steps[i].note+delta,24,55,true);p.tracks[5].steps[i].note=registerRoot(p,degree,45,59);}}
export function preset(name=PRESETS[0]){
 if(name==='空白工程')return blankProject(name);
 const classic=classicScores.find(s=>s.name===name);
 if(classic)return classicPreset(classic);
 return bossPreset(blankProject(PRESETS[0]));
}
export function resizePhrase(p,bars){
 if(!Number.isInteger(bars)||bars<1||bars>32)throw Error('工程小节数须为1–32。');
 for(const [i,t] of p.tracks.entries())t.steps=Array.from({length:bars*16},(_,j)=>t.steps[j]??blankStep(i===3?36:60));
 for(const t of p.tracks)for(const [j,s] of t.steps.entries())for(const e of [s,...(s.extra??[])])e.length=Math.max(.1,Math.min(e.length,bars*16-j-(e.offset??0)));
 p.progression=Array.from({length:bars},(_,i)=>p.progression[i]??0);p.phraseBars=bars;p.bars=bars;
}
function classicPreset(data){
 const p=blankProject(data.name);resizePhrase(p,32);p.source='classic-'+data.id;p.bpm=data.bpm;p.swing=0;p.scaleLock=false;p.cutoff=14500;p.master=.8;
 p.tracks.forEach((t,i)=>{t.mode='single';t.sound=i<3?['kick','snare','hat'][i]:i===3?'triangle':'pulse';t.volume=[.5,.3,.18,.58,.62,.4][i];
  for(const [start,length,note,velocity] of data.score[i]){
   const index=Math.floor(start+1e-7),event={offset:Math.max(0,start-index),length,note,velocity},s=t.steps[index];
   if(s.on)(s.extra??=[]).push(event);else Object.assign(s,event,{on:true});
  }
 });return p;
}
function randomSource(seed){let s=seed>>>0;return ()=>{s=(Math.imul(s,1664525)+1013904223)>>>0;return s/4294967296;};}
export function generateMelody(p,variation=false){p.seed=(p.seed+7919)%2147483647;const r=randomSource(p.seed),t=p.tracks[4];if(variation&&t.steps.some(s=>s.on)){t.steps.forEach((s,i)=>{if(s.on&&i%16!==0&&r()<.38){s.note=melodyPitch(p,scaleNote(p,degreeOf(p,s.note)+(r()<.5?-1:1)));s.velocity=Math.max(.48,Math.min(.94,s.velocity+(r()-.5)*.15));}});}else{t.steps=Array.from({length:p.tracks[4].steps.length},()=>blankStep(64));const pos=r()>.5?[0,3,4,8,11,12,14]:[0,2,6,8,10,12],motif=pos.map(()=>Math.floor(r()*5));for(let bar=0;bar<p.phraseBars;bar++)pos.forEach((i,j)=>{let d=p.progression[bar]+(i%4===0?[0,2,4][motif[j]%3]:motif[j]);if(bar===2&&j%2)d++;t.steps[bar*16+i]={on:true,note:melodyPitch(p,scaleNote(p,d,60)),velocity:i===0?.88:.67+r()*.16,length:Math.max(.7,(pos[j+1]??16)-i-.25)};});}const end=t.steps.length-4;t.steps[end]={on:true,note:melodyPitch(p,scaleNote(p,p.progression.at(-1),60)),length:3.8,velocity:.8};for(let i=end+1;i<t.steps.length;i++)t.steps[i].on=false;}
function common(p){if(!p||typeof p!=='object'||typeof p.name!=='string'||p.name.length>80)throw Error('工程名称或文件结构不正确。');for(const [k,min,max] of [['bpm',40,240],['swing',0,65],['cutoff',120,16000],['master',0,1],['bars',1,32],['seed',0,2147483647]])if(typeof p[k]!=='number'||!Number.isFinite(p[k])||p[k]<min||p[k]>max)throw Error('工程参数不合法：'+k);if(!Number.isInteger(p.bars)||!Number.isInteger(p.seed))throw Error('小节数与随机种子必须为整数。');const d=p.display;if(!d||!['柿橙','赭黄','鼠尾草','石板蓝'].includes(d.color)||['top','auto','labels'].some(k=>typeof d[k]!=='boolean'))throw Error('展示设置不合法。');for(const k of ['explode','xray'])if(!Number.isFinite(d[k])||d[k]<0||d[k]>100)throw Error('展示程度不合法。');}
export function validate(input){const p=copy(input);common(p);const legacy=p.version===1;if(!legacy&&![2,3].includes(p.version))throw Error('不支持该工程版本。');const phraseBars=p.version===3?p.phraseBars:4;if(!Number.isInteger(phraseBars)||phraseBars<1||phraseBars>32)throw Error('乐句小节数不合法。');const count=legacy?4:6,length=legacy?16:phraseBars*16;if(!Array.isArray(p.tracks)||p.tracks.length!==count)throw Error('工程声部数量不正确。');p.tracks.forEach((t,i)=>{if(!t||!Number.isFinite(t.volume)||t.volume<0||t.volume>1||typeof t.mute!=='boolean'||typeof t.solo!=='boolean'||!Array.isArray(t.steps)||t.steps.length!==length)throw Error('音轨数据不完整。');if(t.mode!==undefined&&!['single','triad'].includes(t.mode))throw Error('声部模式不合法。');if(!legacy&&!SOUNDS[i].some(([key])=>key===t.sound))throw Error('音色不受支持。');t.steps.forEach(s=>{if(!s||typeof s.on!=='boolean'||!Number.isFinite(s.velocity)||s.velocity<.001||s.velocity>1||!Number.isInteger(s.note)||s.note<24||s.note>(legacy?72:96)||!Number.isFinite(s.length)||s.length<.001||s.length>(legacy?2:32))throw Error('步骤音符不合法。');
if(s.offset!==undefined&&(!Number.isFinite(s.offset)||s.offset<0||s.offset>=1))throw Error('音符时序不合法。');
if(s.extra!==undefined&&(!Array.isArray(s.extra)||s.extra.length>16||s.extra.some(e=>!e||!Number.isFinite(e.offset)||e.offset<0||e.offset>=1||!Number.isInteger(e.note)||e.note<24||e.note>96||!Number.isFinite(e.velocity)||e.velocity<.001||e.velocity>1||!Number.isFinite(e.length)||e.length<.001||e.length>32)))throw Error('连奏音符不合法。');if(s.hitLengths!==undefined&&(!s.hits||!Array.isArray(s.hitLengths)||s.hitLengths.length!==s.hits.length||s.hitLengths.some(v=>!Number.isFinite(v)||v<.1||v>32)))throw Error('鼓组时值不合法。');if(s.hits!==undefined&&(i>2||!Array.isArray(s.hits)||s.hits.length>8||!s.hits.length||s.hits.some(n=>!Number.isInteger(n)||n<35||n>81)))throw Error('鼓组音符不合法。');});});const clean=blankProject(p.name);if(p.accompanimentStyle!==undefined){if(!GROOVE_STYLES.some(([id])=>id===p.accompanimentStyle))throw Error('伴奏风格不合法。');clean.accompanimentStyle=p.accompanimentStyle;}clean.phraseBars=phraseBars;for(const k of ['name','bpm','swing','cutoff','master','bars','seed'])clean[k]=p[k];for(const k of ['explode','xray','color','top','auto','labels'])clean.display[k]=p.display[k];if(legacy){clean.scale='minor';clean.scaleLock=false;clean.display.keyboardTrack=3;clean.display.keyboardOctave=0;}else{if(!Number.isInteger(p.key)||p.key<0||p.key>11||!Object.hasOwn(SCALES,p.scale)||typeof p.scaleLock!=='boolean'||!Array.isArray(p.progression)||p.progression.length!==phraseBars||p.progression.some(d=>!Number.isInteger(d)||d<0||d>6))throw Error('调性或和弦级数不合法。');for(const k of ['key','scale','scaleLock','progression'])clean[k]=copy(p[k]);if(![3,4,5].includes(p.display.keyboardTrack)||!Number.isInteger(p.display.keyboardOctave)||p.display.keyboardOctave<0||p.display.keyboardOctave>4)throw Error('键盘试听设置不合法。');clean.display.keyboardTrack=p.display.keyboardTrack;clean.display.keyboardOctave=p.display.keyboardOctave;}p.tracks.forEach((t,i)=>{clean.tracks[i]={name:names[i],mode:t.mode??(i===5?'triad':'single'),sound:legacy?clean.tracks[i].sound:t.sound,volume:t.volume,mute:t.mute,solo:t.solo,steps:Array.from({length:phraseBars*16},(_,j)=>{const s=t.steps[legacy?j%16:j];return {on:s.on,note:s.note,velocity:s.velocity,length:s.length,...(s.offset!==undefined?{offset:s.offset}:{}),...(s.extra?{extra:copy(s.extra)}:{}),...(s.hits?{hits:copy(s.hits),...(s.hitLengths?{hitLengths:copy(s.hitLengths)}:{})}:{})};})};});if(p.source==='boss-midi-herr-dethnout-2017'||classicScores.some(s=>'classic-'+s.id===p.source))clean.source=p.source;return clean;}
function bossPreset(p){
 p.name=PRESETS[0];p.source='boss-midi-herr-dethnout-2017';p.bpm=150;p.swing=0;p.phraseBars=24;p.bars=24;p.key=11;p.scale='minor';p.scaleLock=false;p.cutoff=14500;p.master=.8;p.progression=Array(24).fill(0);
 p.tracks.forEach((t,ti)=>{t.steps=Array.from({length:384},()=>blankStep(ti===3?35:60));t.mode='single';t.volume=[.55,.32,.2,.65,.65,.48][ti];if(ti>=3)t.sound=ti===3?'triangle':'pulse';
  for(const [index,length,note,velocity] of bossScore[ti]){const prev=t.steps[index];if(ti<3&&prev.on){prev.hits.push(note);prev.hitLengths.push(length);}else t.steps[index]={on:true,note,velocity,length,...(ti<3?{hits:[note],hitLengths:[length]}:{})};}
 });return p;
}
export let loadNotice='';
export function load(){try{const value=localStorage.getItem(STORE);if(value)return validate(JSON.parse(value));if(localStorage.getItem(PREVIOUS_STORE)||localStorage.getItem(LEGACY_STORE))loadNotice='已载入新的 Boss 战初始案例，旧版自动保存仍保留，可点击恢复。';}catch{loadNotice='自动保存读取失败，已保留恢复副本并载入 Boss 战案例。';try{localStorage.setItem(STORE+'-recovery-'+Date.now(),localStorage.getItem(STORE)||'');}catch{}}return preset();}

export const keyboardBase=p=>24+p.display.keyboardOctave*12+(p.source==='boss-midi-herr-dethnout-2017'?({4:-1,5:4}[p.display.keyboardTrack]??0):0);
