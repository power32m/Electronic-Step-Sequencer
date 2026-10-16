import {stepEvents} from './events.js';
import {copy,stepDuration,audible,eventNotes} from './project.js';
const TAU=Math.PI*2;
export function voice(ctx,type,step,tempo,seed,sound,notes=[step.note]) {
 const gate=60/tempo/4*step.length;
 const release=type===5&&sound==='pad'?.68:sound==='pulse'||sound==='triangle'?.012:sound==='keys'?.28:sound==='pluck'?.22:type>=3?.16:0;
 const duration=type<3?(type===2&&step.hits?.some(n=>n===46||n===49)?.48:[.48,.25,.13][type]):gate+release;
 const b=ctx.createBuffer(1,Math.ceil(ctx.sampleRate*duration),ctx.sampleRate),a=b.getChannelData(0);
 let phase=0,state=seed||1;
 const frequencies=notes.map(n=>440*2**((n-69)/12));
 for(let i=0;i<a.length;i++){
  const t=i/ctx.sampleRate;let v=0;
  if(type<3){state=(Math.imul(state,1664525)+1013904223)>>>0;const noise=state/2147483648-1;
   if(type===0){phase+=TAU*(46+130*Math.exp(-t*38))/ctx.sampleRate;v=Math.sin(phase)*Math.exp(-t*10)+noise*Math.exp(-t*140)*.12;}
   else if(type===1)v=(noise*.75*Math.exp(-t*22)+(Math.sin(TAU*185*t)+Math.sin(TAU*330*t))*.13*Math.exp(-t*28))*(1-Math.exp(-t*1100));
   else {v=0;for(const hit of step.hits??[step.note>=35?step.note:42])v+=noise*Math.exp(-t*(hit===49?9:hit===46?14:48))*.35*(1-Math.exp(-t*2400));}
  }else{
   const attack=['pulse','triangle'].includes(sound)?.001:sound==='pad'?.075:sound==='keys'?.004:sound==='pluck'?.002:.012;
   const envelope=(1-Math.exp(-t/attack))*Math.min(1,Math.max(0,(duration-t)/Math.max(.015,release)));
   for(const f of frequencies){const x=TAU*f*t;let tone;
    if(sound==='pulse'){tone=0;for(let h=1;h<=51&&f*h<ctx.sampleRate*.45;h+=2)tone+=Math.sin(x*h)/h;tone*=.48;}
    else if(sound==='triangle'){tone=0;for(let h=1;h<=31&&f*h<ctx.sampleRate*.45;h+=2)tone+=Math.sin(x*h)*(h%4===1?1:-1)/(h*h);tone*=.8;}
    else if(sound==='keys')tone=(Math.sin(x+.38*Math.sin(x*3)*Math.exp(-t*9))*.62+Math.sin(x*2)*.16*Math.exp(-t*2.5)+Math.sin(x*4)*.055*Math.exp(-t*12))*(.2+.8*Math.exp(-t*2));
    else if(sound==='pluck'){tone=0;for(let h=1;h<=7;h++){if(f*h>=ctx.sampleRate*.45)break;tone+=Math.sin(x*h)/h**1.5*Math.exp(-t*(2.5+h*.65));}tone*=.7;}
    else if(sound==='pad')tone=(Math.sin(x)*.5+Math.sin(x*1.002)*.22+Math.sin(x*.998)*.22+Math.sin(x*2)*.06)*(.8+.2*Math.sin(TAU*.3*t));
    else if(sound==='sub')tone=Math.sin(x)*.82+Math.sin(x*2)*.1;
    else if(sound==='bass')tone=(Math.sin(x)*.62+Math.sin(x*2)*.18+Math.sin(x*3)*.09)*(.4+.6*Math.exp(-t*2.8));
    else tone=Math.sin(x)*.57+Math.sin(x*2)*.13+Math.sin(x*3)*.07;
    v+=tone*envelope/frequencies.length;
   }
  }
  a[i]=v*step.velocity;
 }
 return b;
}
function chain(ctx,p){
 const filter=ctx.createBiquadFilter();filter.type='lowpass';filter.frequency.value=p.cutoff;filter.Q.value=.7;
 const gain=ctx.createGain();gain.gain.value=p.master*.42;
 const limiter=ctx.createWaveShaper();limiter.curve=Float32Array.from({length:8193},(_,i)=>.95*Math.tanh((i/8192*2-1)/.95));limiter.oversample='2x';
 const delay=ctx.createDelay(1),feedback=ctx.createGain(),wet=ctx.createGain();delay.delayTime.value=.22;feedback.gain.value=.18;wet.gain.value=p.source?0:.13;
 delay.connect(feedback);feedback.connect(delay);delay.connect(wet);wet.connect(filter);
 filter.connect(gain);gain.connect(limiter);limiter.connect(ctx.destination);
 return {filter,gain,limiter,delay,feedback,wet,dispose(){for(const n of [filter,gain,limiter,delay,feedback,wet])n.disconnect();}};
}
function fire(ctx,bus,p,ti,s,time,stepIndex,sources,cache){
 const track=p.tracks[ti],notes=eventNotes(p,ti,s),key=[ti,track.sound,p.bpm,s.velocity,s.length,notes.join(','),ti<3?p.seed+stepIndex:0].join('|');
 let buffer=cache?.get(key);
 if(!buffer){buffer=voice(ctx,ti,s,p.bpm,p.seed+ti*167+stepIndex*31,track.sound,notes);if(cache){if(cache.size>=256)cache.clear();cache.set(key,buffer);}}
 const src=ctx.createBufferSource();src.buffer=buffer;
 const gain=ctx.createGain(),pan=ctx.createStereoPanner();gain.gain.value=track.volume;pan.pan.value=[0,-.08,.2,0,-.08,.12][ti];
 src.connect(gain);gain.connect(pan);pan.connect(bus.filter);if(ti>=4)pan.connect(bus.delay);
 src.start(time);sources?.add(src);src.onended=()=>{sources?.delete(src);src.disconnect();gain.disconnect();pan.disconnect();};return src;
}
export class Engine {
 constructor(getProject,onStep,onState){this.get=getProject;this.onStep=onStep;this.onState=onState;this.sources=new Set();this.queue=[];this.buffers=new Map();this.playing=false;this.step=-1;this.count=0;}
 async ready(){if(!this.ctx)this.ctx=new AudioContext({latencyHint:'interactive'});await this.ctx.resume();}
 async start(){if(this.playing||this.starting)return;this.starting=true;try{await this.ready();if(this.cancelStart)return;this.bus=chain(this.ctx,this.get());this.next=this.ctx.currentTime+.12;this.index=0;this.queue=[];this.playing=true;this.onState(true);this.worker=new Worker(new URL('./ticker.js',import.meta.url),{type:'module'});this.worker.onmessage=()=>this.tick();this.worker.postMessage('start');this.tick();this.visual=requestAnimationFrame(()=>this.draw());}catch(e){this.stop();throw e;}finally{this.starting=false;this.cancelStart=false;}}
 tick(){if(!this.playing)return;const p=this.get();if(this.next<this.ctx.currentTime-.1)this.next=this.ctx.currentTime+.025;while(this.next<this.ctx.currentTime+.18){const i=this.index%p.tracks[0].steps.length;for(let t=0;t<p.tracks.length;t++){const s=p.tracks[t].steps[i];if(audible(p,p.tracks[t]))for(const e of stepEvents(s))fire(this.ctx,this.bus,p,t,e,this.next+(e.offset??0)*stepDuration(p,i),i,this.sources,this.buffers);}this.queue.push({time:this.next,step:i});this.next+=stepDuration(p,i);this.index++;this.count++;if(this.queue.length>32)this.queue.splice(0,this.queue.length-32);}}
 draw(){if(!this.playing)return;let latest=null;while(this.queue.length&&this.queue[0].time<=this.ctx.currentTime)latest=this.queue.shift().step;if(latest!==null){this.step=latest;this.onStep(latest);}this.visual=requestAnimationFrame(()=>this.draw());}
 update(){if(this.bus&&this.ctx){const p=this.get();this.bus.filter.frequency.setTargetAtTime(p.cutoff,this.ctx.currentTime,.025);this.bus.gain.gain.setTargetAtTime(p.master*.42,this.ctx.currentTime,.02);}}
 stop(){this.cancelStart=this.starting;this.playing=false;this.worker?.terminate();cancelAnimationFrame(this.visual);if(this.bus){const bus=this.bus;this.bus=null;bus.gain.gain.cancelScheduledValues(this.ctx.currentTime);bus.gain.gain.setTargetAtTime(0,this.ctx.currentTime,.006);for(const s of this.sources){try{s.stop(this.ctx.currentTime+.035);}catch{}}setTimeout(()=>bus.dispose(),90);}this.queue=[];this.step=-1;this.onStep(-1);this.onState(false);}
 async preview(note,params={},ti=4){await this.ready();const p=copy(this.get()),bus=chain(this.ctx,p);const s={note,velocity:params.velocity??.8,length:params.length??2};fire(this.ctx,bus,p,ti,s,this.ctx.currentTime,0,this.sources);const duration=(60/p.bpm/4*s.length+.9)*1000;setTimeout(()=>bus.dispose(),Math.ceil(duration));}
}
export async function renderWav(project){
 const p=copy(project),duration=p.bars*240/p.bpm,tail=1.8,ctx=new OfflineAudioContext(2,Math.ceil((duration+tail)*44100),44100),bus=chain(ctx,p);
 let time=0;const buffers=new Map();
 for(let b=0;b<p.bars;b++){
  for(let i=0;i<16;i++){const index=(b%p.phraseBars)*16+i,remaining=p.bars*16-(b*16+i);for(let t=0;t<p.tracks.length;t++){const s=p.tracks[t].steps[index];if(audible(p,p.tracks[t]))for(const e of stepEvents(s))fire(ctx,bus,p,t,{...e,length:Math.min(e.length,remaining-(e.offset??0))},time+(e.offset??0)*stepDuration(p,index),index,undefined,buffers);}time+=stepDuration(p,index);}
  if(b%2===1)await new Promise(resolve=>setTimeout(resolve,0));
 }
 const audio=await ctx.startRendering(),n=audio.length,buf=new ArrayBuffer(44+n*4),v=new DataView(buf);
 const str=(off,s)=>[...s].forEach((c,i)=>v.setUint8(off+i,c.charCodeAt(0)));
 str(0,'RIFF');v.setUint32(4,36+n*4,true);str(8,'WAVE');str(12,'fmt ');v.setUint32(16,16,true);v.setUint16(20,1,true);v.setUint16(22,2,true);v.setUint32(24,44100,true);v.setUint32(28,176400,true);v.setUint16(32,4,true);v.setUint16(34,16,true);str(36,'data');v.setUint32(40,n*4,true);
 let peak=0,nonfinite=0,energy=0;
 const left=audio.getChannelData(0),right=audio.getChannelData(1);
 for(let i=0;i<n;i++)for(let c=0;c<2;c++){const x=(c?right:left)[i];peak=Math.max(peak,Math.abs(x));energy+=x*x;if(!Number.isFinite(x))nonfinite++;v.setInt16(44+(i*2+c)*2,Math.round(Math.max(-1,Math.min(1,x))*32767),true);}
 bus.dispose();return {blob:new Blob([buf],{type:'audio/wav'}),stats:{sampleRate:44100,channels:2,seconds:n/44100,peak,rms:Math.sqrt(energy/(n*2)),nonfinite,bars:p.bars,scoreBars:p.phraseBars,voices:6}};
}
