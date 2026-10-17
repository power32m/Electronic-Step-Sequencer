import test from 'node:test';
import assert from 'node:assert/strict';
import {ScopeTrace} from '../src/scope-trace.js';
const tone=(phase=0,level=.2)=>Float32Array.from({length:2048},(_,i)=>Math.sin(i*Math.PI*2/101.3+phase)*level);
const rms=a=>Math.sqrt(a.reduce((s,x)=>s+x*x,0)/a.length);
test('scope stabilizes shifted periodic audio without modifying input or losing volume changes',()=>{
 const scope=new ScopeTrace(),samples=tone(),before=samples.slice();
 const first=scope.update(samples,'live').slice();assert.deepEqual(samples,before);
 const shifted=scope.update(tone(2.13),'live');
 assert(rms(shifted.map((v,i)=>v-first[i]))<.002);
 for(let i=0;i<5;i++)scope.update(tone(2.13,.05),'live');
 assert(rms(scope.values)<rms(first)*.3);
});
test('scope gently rounds pulse edges; pause freezes and silence/stop clears without a lingering trace',()=>{
 const scope=new ScopeTrace(),pulse=Float32Array.from({length:2048},(_,i)=>i%101<50?.2:-.2);
 const values=scope.update(pulse,'live');assert(values.some(v=>Math.abs(v)>.01&&Math.abs(v)<.19));
 const frozen=values.slice();assert.deepEqual(scope.update(tone(1),'paused'),frozen);
 assert(scope.update(new Float32Array(2048),'live').every(v=>v===0));
 scope.update(tone(),'live');assert(scope.update(tone(),'idle').every(v=>v===0));
});
