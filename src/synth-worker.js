import {voice} from './voice.js';

self.onmessage=({data})=>{
 try{
  const ctx={sampleRate:data.rate,createBuffer(_channels,length){const samples=new Float32Array(length);return {getChannelData:()=>samples};}};
  const samples=voice(ctx,data.ti,data.step,data.bpm,data.seed,data.sound,data.notes).getChannelData(0);
  self.postMessage({id:data.id,samples},[samples.buffer]);
 }catch(error){self.postMessage({id:data.id,error:error.message});}
};
