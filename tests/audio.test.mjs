import test from 'node:test';
import assert from 'node:assert/strict';
import {preset} from '../src/project.js';
import {voiceSpec} from '../src/voice-bank.js';

test('voice cache shares PCM across dynamics but distinguishes pitch, tempo and sample rate',()=>{
 const p=preset(),s={note:64,length:1.8,velocity:.4};
 const a=voiceSpec(p,4,s,0,48000);
 assert.equal(a.key,voiceSpec(p,4,{...s,velocity:.9},1,48000).key);
 assert.equal(a.step.velocity,1);
 assert.notEqual(a.key,voiceSpec(p,4,{...s,note:65},0,48000).key);
 assert.notEqual(a.key,voiceSpec({...p,bpm:160},4,s,0,48000).key);
 assert.notEqual(a.key,voiceSpec(p,4,s,0,44100).key);
});

test('percussion cache preserves open hats and deterministic noise variation',()=>{
 const p=preset(),s={note:42,length:1,velocity:.6,hits:[42]};
 const a=voiceSpec(p,2,s,0,44100);
 assert.notEqual(a.key,voiceSpec(p,2,{...s,hits:[46]},0,44100).key);
 assert.notEqual(a.key,voiceSpec(p,2,s,1,44100).key);
 assert.deepEqual(a.step.hits,[42]);
});
