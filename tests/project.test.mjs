import test from 'node:test';
import assert from 'node:assert/strict';
import {preset,PRESETS,validate,copy,eventNotes,stepDuration,generateMelody} from '../src/project.js';
import {bossScore} from '../src/boss-score.js';

test('Boss案例完整保留24小节、150BPM和1598事件',()=>{
 const p=preset();assert.equal(p.phraseBars,24);assert.equal(p.bpm,150);assert.equal(p.bars,24);assert.equal(p.swing,0);assert(!p.scaleLock);
 assert(p.tracks.every(t=>t.steps.length===384));assert.equal(bossScore.flat().length,1598);
 for(const ti of [3,4,5])assert.deepEqual(p.tracks[ti].steps.flatMap((s,i)=>s.on?[[i,s.length,s.note,s.velocity]]:[]),bossScore[ti]);
 for(const ti of [0,1,2])assert.deepEqual(p.tracks[ti].steps.flatMap((s,i)=>s.on?s.hits.map((n,j)=>[i,s.hitLengths[j],n,s.velocity]):[]),bossScore[ti]);
});

test('完整乐句38.4秒，最后一小节保留',()=>{
 const p=preset();assert(Math.abs(p.tracks[0].steps.reduce((v,_,i)=>v+stepDuration(p,i),0)-38.4)<1e-9);
 assert(p.tracks[4].steps.slice(368).some(s=>s.on));
});

for(const name of PRESETS)test('工程往返：'+name,()=>assert.deepEqual(validate(preset(name)),preset(name)));

test('副旋律单音与普通预设三和弦各自保持',()=>{
 const p=preset();assert.equal(p.tracks[5].mode,'single');assert.equal(eventNotes(p,5,p.tracks[5].steps[0]).length,1);
 const q=preset('空白工程');assert.equal(eventNotes(q,5,q.tracks[5].steps[0]).length,3);
});

test('生成不截断24小节，也不修改其他声部',()=>{
 const p=preset(),before=copy(p.tracks.filter((_,i)=>i!==4));generateMelody(p);
 assert.equal(p.tracks[4].steps.length,384);assert.deepEqual(p.tracks.filter((_,i)=>i!==4),before);validate(p);
});

test('拒绝错误音高、长度、声部与乐句结构',()=>{
 for(const mutate of [p=>p.phraseBars=0,p=>p.tracks.pop(),p=>p.tracks[4].steps[0].note=999,p=>p.tracks[5].steps[0].length=99,p=>p.tracks[0].steps[0].hits=[999]]){
  const p=preset();mutate(p);assert.throws(()=>validate(p));
 }
});

import {classicScores} from '../src/classic-scores.js';
import {stepEvents,removeEvent} from '../src/events.js';
import {resizePhrase} from '../src/project.js';
for(const score of classicScores)test('Complete MIDI events preserved: '+score.id,()=>{
 const p=preset(score.name);assert.equal(p.phraseBars,score.phraseBars);assert.equal(p.bars,score.phraseBars);assert.equal(p.bpm,score.bpm);assert(!p.scaleLock);
 for(let ti=0;ti<6;ti++){
 const actual=p.tracks[ti].steps.flatMap((s,i)=>stepEvents(s).map(e=>[+(i+(e.offset??0)).toFixed(6),e.length,e.note,e.velocity]));
 assert.deepEqual(actual,score.score[ti]);assert(actual.every(e=>e[0]<score.phraseBars*16&&e[0]+e[1]<=score.phraseBars*16+.000001));
 }
 assert.deepEqual(validate(p),p);
});
test('Blank project can grow to 32 bars, preserving edits; invalid sizes rejected',()=>{
 const p=preset('空白工程');assert.equal(p.phraseBars,4);assert(p.tracks.every(t=>t.steps.every(s=>!s.on)));
 p.tracks[4].steps[0].on=true;const first=copy(p.tracks[4].steps[0]);resizePhrase(p,32);assert.equal(p.tracks[4].steps.length,512);assert.deepEqual(p.tracks[4].steps[0],first);validate(p);
 resizePhrase(p,1);assert.equal(p.tracks[4].steps.length,16);validate(p);
 for(const n of [0,33,1.5,NaN])assert.throws(()=>resizePhrase(p,n));
 for(const n of [0,33]){const q=preset();q.phraseBars=n;assert.throws(()=>validate(q));}
});
test('Removed presets are absent; blank project is a separate action',()=>{
 assert.equal(PRESETS.length,5);for(const n of ['日光旋律','夜航微光','轻快漫步','空白工程'])assert(!PRESETS.includes(n));
});
test('Deleting one triplet preserves the neighboring notes',()=>{
 const s={on:true,note:60,length:1,velocity:.8,offset:0,extra:[{note:62,length:.3,velocity:.7,offset:.333},{note:64,length:.3,velocity:.7,offset:.667}]};
 removeEvent(s,1);assert.equal(s.extra.length,1);assert.equal(s.extra[0].note,64);removeEvent(s);assert.equal(s.note,64);assert(!s.extra);removeEvent(s);assert(!s.on);
});

test('removed appearance controls reset legacy settings without changing music',()=>{
 const p=preset();p.display.explode=85;p.display.xray=70;p.display.color='石板蓝';p.display.top=true;
 const restored=validate(p);assert.equal(restored.display.explode,0);assert.equal(restored.display.xray,0);assert.equal(restored.display.color,'柿橙');assert(restored.display.top);assert.deepEqual(restored.tracks,p.tracks);
});

import {projectBarLimit,upgradeClassicExcerpt} from '../src/project.js';
test('complete arrangements match original MIDI event totals and include final sections',()=>{
 const counts={'super-c':2756,'double-dragon-2':2654,jackal:1956,castlevania:1692};
 for(const data of classicScores){const p=preset(data.name);assert.equal(data.score.flat().length,counts[data.id]);assert(data.score.flat().some(e=>e[0]>=512));assert.equal(projectBarLimit(p),data.phraseBars);assert.throws(()=>resizePhrase(p,data.phraseBars+1));assert(JSON.stringify(p,null,2).length<4*1024*1024);}
});
function oldExcerpt(name){const p=preset(name),full=copy(p);delete p.classicVersion;resizePhrase(p,32);p.tracks.forEach((t,ti)=>t.steps.forEach((s,i)=>stepEvents(s).forEach((e,j)=>e.length=Math.min(stepEvents(full.tracks[ti].steps[i])[j].length,512-i-(e.offset??0)))));return p;}
test('untouched old excerpts are upgraded; edited notes are preserved',()=>{
 for(const data of classicScores){
  const p=oldExcerpt(data.name);p.master=.6;assert(upgradeClassicExcerpt(p));assert.equal(p.phraseBars,data.phraseBars);assert.equal(p.bars,data.phraseBars);assert.equal(p.master,.6);assert.deepEqual(validate(p),p);
  const edited=oldExcerpt(data.name);const s=edited.tracks[4].steps.find(s=>s.on);s.note=s.note===96?95:s.note+1;const before=copy(edited);assert(!upgradeClassicExcerpt(edited));assert.deepEqual(edited,before);
 }
});

test('intentionally shortened full arrangements are never auto-expanded',()=>{const p=preset(classicScores[0].name);resizePhrase(p,32);assert.equal(validate(p).classicVersion,2);assert(!upgradeClassicExcerpt(p));assert.equal(p.phraseBars,32);});
