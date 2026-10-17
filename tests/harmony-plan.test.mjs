import test from 'node:test';
import assert from 'node:assert/strict';
import {preset,validate,copy,setHarmony,resizePhrase,scaleNote,triadNotes,transposeProject,inScale} from '../src/project.js';
import {generateAccompaniment} from '../src/accompaniment.js';
import {chordVoicing,harmonyFit} from '../src/harmony-plan.js';
import {stepEvents} from '../src/events.js';
import {activeKeyboardNotes} from '../src/keyboards.js';
const styles=['pop','rock','funk','dance','hiphop','latin','chip'];
test('each style produces at least four harmonic loops over ten clicks; recent loops are avoided',()=>{
 for(const style of styles){const p=preset('空白工程'),seen=new Set();let previous='';
  for(let i=0;i<10;i++){generateAccompaniment(p,style);const signature=p.progression.join('');assert.notEqual(signature,previous,style);seen.add(signature);previous=signature;assert(p.harmonyPlan.history.length<=6);}
  assert(seen.size>=4,style);
 }
});
test('manual bar choices survive generation, resize and round trip while unlocked bars vary',()=>{
 const p=preset('空白工程');setHarmony(p,1,2);resizePhrase(p,8);const seen=new Set();
 for(let i=0;i<10;i++){generateAccompaniment(p,'pop');assert.equal(p.progression[1],2);seen.add(p.progression.join(''));assert.deepEqual(validate(p),p);}
 assert(seen.size>3);assert(p.harmonyPlan.locked[1]);assert(!p.harmonyPlan.locked[7]);
});
test('old saved projects retain their harmony; malformed generator metadata is rejected',()=>{
 const old=preset('空白工程');delete old.harmonyPlan;const p=validate(old),before=copy(p.progression);generateAccompaniment(p,'latin');assert.deepEqual(p.progression,before);
 for(const value of [null,{}, {locked:[false],history:[],voiced:true},{locked:Array(4).fill(false),history:['secret'],voiced:true}])assert.throws(()=>validate({...old,harmonyPlan:value}));
});
test('voicings are actual chord tones, include inversions and minimize voice movement',()=>{
 const p=preset('空白工程');let previous=null,inversions=0;
 for(const d of [0,5,3,4,0,1,4,0]){const notes=chordVoicing(p,d,previous,72,()=>.4),pcs=triadNotes(p,scaleNote(p,d,48)).map(n=>n%12);
  assert.equal(notes.length,3);assert.equal(new Set(notes.map(n=>n%12)).size,3);assert(notes.every(n=>pcs.includes(n%12)));if(notes[0]%12!==pcs[0])inversions++;
  if(previous)assert(notes.reduce((sum,n,i)=>sum+Math.abs(n-previous[i]),0)<=12);previous=notes;
 }assert(inversions>=2);
});
test('sustained melody influences harmony scores and generated notes transpose and edit together',()=>{
 const p=preset('空白工程'),active=Array.from({length:64},()=>[60,64,67]);
 assert(harmonyFit(p,[0,0,0,0],active)>harmonyFit(p,[1,1,1,1],active));
 for(let i=0;i<4;i++)p.tracks[4].steps[i*16]={on:true,note:64,length:16,velocity:.7};
 generateAccompaniment(p,'hiphop');const lead=copy(p.tracks[4]);setHarmony(p,0,3);assert.deepEqual(p.tracks[4],lead);
 const pcs=triadNotes(p,scaleNote(p,3,48)).map(n=>n%12);assert(p.tracks[5].steps.slice(0,16).flatMap(stepEvents).every(e=>pcs.includes(e.note%12)));
 transposeProject(p,7,'minor');assert(p.tracks[5].steps.flatMap(stepEvents).every(e=>inScale(p,e.note)));assert.deepEqual(validate(p),p);
 const index=p.tracks[5].steps.findIndex(s=>s.on&&s.extra?.length);
 assert(index>=0);const sounding=activeKeyboardNotes(p,5,index+.1);
 for(const event of stepEvents(p.tracks[5].steps[index]))assert(sounding.has(event.note));
});
