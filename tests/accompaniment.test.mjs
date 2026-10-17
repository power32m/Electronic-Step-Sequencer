import test from 'node:test';
import assert from 'node:assert/strict';
import {preset,copy,resizePhrase,validate,inScale} from '../src/project.js';
import {generateAccompaniment} from '../src/accompaniment.js';

test('random accompaniment covers 1–32 bars and preserves lead, harmony and settings',()=>{
 for(const bars of [1,4,17,32]){
  const p=preset('空白工程');resizePhrase(p,bars);p.harmonyPlan.locked.fill(true);p.key=7;p.scale='minor';p.bpm=124;
  p.tracks[4].steps[0]={on:true,note:67,length:2,velocity:.8};
  const before=copy(p);generateAccompaniment(p);
  assert.deepEqual(p.tracks[4],before.tracks[4]);assert.deepEqual(p.progression,before.progression);
  for(const key of ['phraseBars','bars','key','scale','bpm','swing','master','cutoff','display'])assert.deepEqual(p[key],before[key]);
  for(let bar=0;bar<bars;bar++)for(const ti of [0,1,2,3,5])assert(p.tracks[ti].steps.slice(bar*16,bar*16+16).some(s=>s.on));
  for(const ti of [3,5])for(const [i,s] of p.tracks[ti].steps.entries())if(s.on){assert(inScale(p,s.note));assert(i+s.length<=bars*16);}
  assert.deepEqual(validate(p),p);
 }
});

test('successive clicks cycle through seven different rhythm families',()=>{
 const p=preset('空白工程'),styles=new Set(),patterns=new Set();
 for(let i=0;i<7;i++){styles.add(generateAccompaniment(p));patterns.add(JSON.stringify(p.tracks[0].steps.map(s=>s.on)));}
 assert.equal(styles.size,7);assert.equal(patterns.size,7);
});

test('classic scores cannot be overwritten by random accompaniment',()=>{
 const p=preset(),before=copy(p);assert.throws(()=>generateAccompaniment(p),/空白工程/);assert.deepEqual(p,before);
});

test('explicit styles remain selected, vary within the family and survive saving',()=>{
 for(const [style,name] of [['pop','流行'],['rock','摇滚'],['funk','放克'],['dance','电子舞曲'],['hiphop','嘻哈'],['latin','拉丁'],['chip','FC 芯片']]){
  const p=preset('空白工程');p.accompanimentStyle=style;
  assert.equal(generateAccompaniment(p),name);const first=copy(p.tracks);
  assert.equal(generateAccompaniment(p),name);assert.notDeepEqual(p.tracks,first);
  assert.equal(validate(p).accompanimentStyle,style);
  if(style==='chip'){assert.equal(p.tracks[3].sound,'triangle');assert.equal(p.tracks[5].sound,'pulse');}
 }
 const old=preset('空白工程');delete old.accompanimentStyle;assert.equal(validate(old).accompanimentStyle,'auto');
 const p=preset('空白工程'),before=copy(p);assert.throws(()=>generateAccompaniment(p,'unknown'));assert.deepEqual(p,before);
 p.accompanimentStyle='unknown';assert.throws(()=>validate(p));
});
