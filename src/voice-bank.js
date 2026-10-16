import {eventNotes} from './project.js';

export function voiceSpec(p,ti,s,index,rate){
 const seed=p.seed+ti*167+index*31,notes=eventNotes(p,ti,s),sound=p.tracks[ti].sound;
 // Velocity is applied by a GainNode, allowing notes with different dynamics to share PCM.
 const step={note:s.note,length:s.length,velocity:1,...(s.hits?{hits:s.hits}:{})};
 return {key:JSON.stringify([rate,ti,sound,p.bpm,s.length,notes,ti<3?seed:0]),rate,ti,step,bpm:p.bpm,seed,sound,notes};
}

export class VoiceBank{
 constructor(){this.cache=new Map();this.inflight=new Map();this.pending=new Map();this.bytes=0;this.id=0;}
 ensure(){
  if(this.closed)throw new DOMException('已取消','AbortError');
  if(this.error)throw this.error;
  if(this.worker)return;
  this.worker=new Worker(new URL('./synth-worker.js',import.meta.url),{type:'module'});
  this.worker.onmessage=({data})=>{const request=this.pending.get(data.id);if(!request)return;this.pending.delete(data.id);data.error?request.reject(Error(data.error)):request.resolve(data.samples);};
  this.worker.onerror=event=>{this.error=Error(event.message||'声音准备失败');for(const request of this.pending.values())request.reject(this.error);this.pending.clear();};
 }
 get(ctx,p,ti,s,index){
  this.ensure();const spec=voiceSpec(p,ti,s,index,ctx.sampleRate),key=spec.key;
  if(this.cache.has(key)){const value=this.cache.get(key);this.cache.delete(key);this.cache.set(key,value);return Promise.resolve(value);}
  if(this.inflight.has(key))return this.inflight.get(key);
  const id=++this.id,promise=new Promise((resolve,reject)=>{this.pending.set(id,{resolve,reject});this.worker.postMessage({...spec,id});}).then(samples=>{
   if(this.closed)throw new DOMException('已取消','AbortError');
   const buffer=ctx.createBuffer(1,samples.length,ctx.sampleRate);buffer.copyToChannel(samples,0);
   const bytes=samples.byteLength;
   while(this.bytes+bytes>48*1024*1024&&this.cache.size){const oldest=this.cache.keys().next().value;this.bytes-=this.cache.get(oldest).length*4;this.cache.delete(oldest);}
   this.cache.set(key,buffer);this.bytes+=bytes;return buffer;
  }).finally(()=>this.inflight.delete(key));
  this.inflight.set(key,promise);return promise;
 }
 close(){this.closed=true;this.worker?.terminate();for(const request of this.pending.values())request.reject(new DOMException('已取消','AbortError'));this.pending.clear();this.cache.clear();this.bytes=0;}
}
