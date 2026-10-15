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
 const q=preset('日光旋律');assert.equal(eventNotes(q,5,q.tracks[5].steps[0]).length,3);
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
