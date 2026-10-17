import {stepEvents} from '../src/events.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import {preset,resizePhrase,copy,validate,inScale,scaleNote,triadNotes,setHarmony} from '../src/project.js';
import {generateAccompaniment} from '../src/accompaniment.js';
import {ACCOMPANIMENT_STYLES} from '../src/accompaniment-styles.js';
const parts=[0,1,2,3,5],pc=n=>(n%12+12)%12;
const fingerprint=p=>JSON.stringify(parts.map(t=>p.tracks[t].steps.map((s,i)=>s.on?[i,s.note,+s.length.toFixed(2)]:null).filter(Boolean)));
const count=(p,track)=>p.tracks[track].steps.filter(s=>s.on).length;
test('style anchors, tonal roots, registers and note boundaries survive many seeds and lengths',()=>{
 for(const style of ACCOMPANIMENT_STYLES)for(const bars of [1,4,8,17,32])for(const key of [0,5,11]){
  const p=preset('空白工程');resizePhrase(p,bars);p.key=key;p.scale=key===5?'minor':'major';p.seed=1709+key*271+bars;
  generateAccompaniment(p,style.id);assert.deepEqual(validate(p),p);
  for(let bar=0;bar<bars;bar++){
   const base=bar*16,root=pc(scaleNote(p,p.progression[bar]));
   for(const i of style.kick)assert(p.tracks[0].steps[base+i].on,style.id+' kick '+i);
   for(const i of style.snare)assert(p.tracks[1].steps[base+i].on,style.id+' snare '+i);
   for(const t of parts)assert(p.tracks[t].steps.slice(base,base+16).some(s=>s.on));
   const bass=p.tracks[3].steps.slice(base,base+16).find(s=>s.on);assert.equal(pc(bass.note),root);
   const chordPcs=triadNotes(p,scaleNote(p,p.progression[bar],48)).map(pc);
   for(const ti of [3,5])p.tracks[ti].steps.slice(base,base+16).forEach((s,i)=>{if(s.on){assert(inScale(p,s.note));assert(s.length>0&&s.length<=16-i);assert(s.note>=(ti===3?28:45)&&s.note<=(ti===3?55:79));assert(s.velocity>0&&s.velocity<=1);if(ti===5)assert(stepEvents(s).every(e=>chordPcs.includes(pc(e.note))&&e.length<=16-i&&inScale(p,e.note)));}});
  }
 }
});
test('ten successive arrangements per style differ beyond velocity, with reproducible seeds',()=>{
 for(const style of ACCOMPANIMENT_STYLES){
  const p=preset('空白工程'),prints=new Set();resizePhrase(p,8);
  for(let i=0;i<10;i++){const twin=copy(p);generateAccompaniment(p,style.id);generateAccompaniment(twin,style.id);assert.deepEqual(p,twin);prints.add(fingerprint(p));}
  assert.equal(prints.size,10,style.id);
 }
});
test('lead notes including held and timed events, harmony, tempo and all mixer settings remain unchanged',()=>{
 for(const style of ACCOMPANIMENT_STYLES){
  const p=preset('空白工程');resizePhrase(p,8);p.harmonyPlan.locked.fill(true);p.bpm=133;p.swing=19;p.master=.62;p.cutoff=7600;
  p.tracks[4].steps[0]={on:true,note:64,velocity:.72,length:20,extra:[{note:67,velocity:.6,length:1,offset:.5}]};
  p.tracks.forEach((t,i)=>{t.volume=.2+i*.1;t.mute=i===1;t.solo=i===4;});
  const before=copy(p);generateAccompaniment(p,style.id);
  assert.deepEqual(p.tracks[4],before.tracks[4]);
  for(const key of ['bpm','swing','master','cutoff','key','scale','scaleLock','progression','display','phraseBars','bars'])assert.deepEqual(p[key],before[key]);
  for(let i=0;i<6;i++)for(const key of ['volume','mute','solo'])assert.equal(p.tracks[i][key],before.tracks[i][key]);
 }
});
test('dense written melody reduces chord attacks and accompaniment strength',()=>{
 for(const style of ACCOMPANIMENT_STYLES){
  let sparseCount=0,denseCount=0,sparseLevel=0,denseLevel=0;
  for(let seed=1;seed<=8;seed++){
   const sparse=preset('空白工程');resizePhrase(sparse,8);sparse.seed=seed*947;
   const dense=copy(sparse);dense.tracks[4].steps.forEach((s,i)=>Object.assign(s,{on:true,note:[60,62,64,67][i%4],length:.7}));
   generateAccompaniment(sparse,style.id);generateAccompaniment(dense,style.id);
   sparseCount+=count(sparse,5);denseCount+=count(dense,5);
   sparseLevel+=sparse.tracks[5].steps.reduce((s,n)=>s+(n.on?n.velocity:0),0)/count(sparse,5);
   denseLevel+=dense.tracks[5].steps.reduce((s,n)=>s+(n.on?n.velocity:0),0)/count(dense,5);
  }
  assert(denseCount<sparseCount*.8,style.id+' density');assert(denseLevel<sparseLevel*.9,style.id+' strength');
 }
});
test('long arrangements develop energy, vary bar rhythms and keep loop tails active and bounded',()=>{
 for(const style of ACCOMPANIMENT_STYLES){
  const p=preset('空白工程');resizePhrase(p,32);generateAccompaniment(p,style.id);
  const level=from=>Array.from({length:8},(_,b)=>p.tracks[0].steps[(from+b)*16].velocity).reduce((a,b)=>a+b)/8;
  assert(level(16)<level(8),style.id+' breakdown');assert(level(24)>level(16),style.id+' lift');
  const rhythms=new Set(Array.from({length:32},(_,b)=>JSON.stringify(parts.map(t=>p.tracks[t].steps.slice(b*16,b*16+16).map(s=>s.on)))));
  assert(rhythms.size>=8,style.id+' bar variety');
  assert(p.tracks[5].steps.slice(-8).some(s=>s.on));
  p.tracks[5].steps.forEach((s,i)=>{for(const e of stepEvents(s))assert(i+e.length<=p.phraseBars*16);});
 }
});
test('generated harmony stores explicit notes for all styles and FC remains monophonic',()=>{
 for(const style of ACCOMPANIMENT_STYLES){const p=preset('空白工程');generateAccompaniment(p,style.id);assert.equal(p.tracks[5].mode,'single');assert(p.harmonyPlan.voiced);if(style.id==='chip'){assert.equal(p.tracks[3].sound,'triangle');assert.equal(p.tracks[5].sound,'pulse');assert(new Set(p.tracks[5].steps.filter(s=>s.on).map(s=>s.note)).size>=3);}}
});
test('editing the harmony keeps generated FC arpeggio intervals and rhythm',()=>{
 const p=preset('空白工程');generateAccompaniment(p,'chip');
 const before=p.tracks[5].steps.slice(0,16).map(s=>({...s}));setHarmony(p,0,3);
 assert(new Set(p.tracks[5].steps.slice(0,16).filter(s=>s.on).map(s=>s.note)).size>=3);
 p.tracks[5].steps.slice(0,16).forEach((s,i)=>{assert.equal(s.on,before[i].on);assert.equal(s.length,before[i].length);assert.equal(s.velocity,before[i].velocity);assert(inScale(p,s.note));});
 assert.deepEqual(validate(p),p);
});
