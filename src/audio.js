import {stepEvents} from './events.js';
import {copy,stepDuration,audible} from './project.js';
import {VoiceBank} from './voice-bank.js';
export {voice} from './voice.js';
function chain(ctx,p,monitor=false){
 const filter=ctx.createBiquadFilter();filter.type='lowpass';filter.frequency.value=p.cutoff;filter.Q.value=.7;
 const gain=ctx.createGain();gain.gain.value=p.master*.42;
 const limiter=ctx.createWaveShaper();limiter.curve=Float32Array.from({length:8193},(_,i)=>.95*Math.tanh((i/8192*2-1)/.95));limiter.oversample='2x';
 const delay=ctx.createDelay(1),feedback=ctx.createGain(),wet=ctx.createGain();delay.delayTime.value=.22;feedback.gain.value=.18;wet.gain.value=p.source?0:.13;
 delay.connect(feedback);feedback.connect(delay);delay.connect(wet);wet.connect(filter);
 filter.connect(gain);gain.connect(limiter);limiter.connect(ctx.destination);
 const analyser=monitor?ctx.createAnalyser():null;
 if(analyser){analyser.fftSize=2048;analyser.smoothingTimeConstant=0;limiter.connect(analyser);}
 return {filter,gain,limiter,delay,feedback,wet,analyser,dispose(){for(const n of [filter,gain,limiter,delay,feedback,wet,analyser])n?.disconnect();}};
}
function fireBuffer(ctx,bus,p,ti,s,time,sources,buffer){
 const track=p.tracks[ti],src=ctx.createBufferSource();src.buffer=buffer;
 const gain=ctx.createGain(),pan=ctx.createStereoPanner();gain.gain.value=track.volume*s.velocity;pan.pan.value=[0,-.08,.2,0,-.08,.12][ti];
 src.connect(gain);gain.connect(pan);pan.connect(bus.filter);if(ti>=4)pan.connect(bus.delay);
 src.start(time);sources?.add(src);src.onended=()=>{sources?.delete(src);src.disconnect();gain.disconnect();pan.disconnect();};return src;
}
async function prepareStep(bank,ctx,p,index){
 const work=[];
 for(let ti=0;ti<p.tracks.length;ti++)if(audible(p,p.tracks[ti]))for(const event of stepEvents(p.tracks[ti].steps[index])){
  const step={...event};work.push(bank.get(ctx,p,ti,step,index).then(buffer=>({ti,step,buffer})));
 }
 return Promise.all(work);
}
export class Engine {
 constructor(getProject,onStep,onState){this.get=getProject;this.onStep=onStep;this.onState=onState;this.sources=new Set();this.queue=[];this.bank=new VoiceBank();this.buffers=this.bank.cache;this.playing=false;this.paused=false;this.position=0;this.step=-1;this.count=0;this.session=0;}
 get state(){return this.starting?'preparing':this.playing?'playing':this.paused?'paused':'stopped';}
 emit(){this.onState(this.playing,this.state);}
 async ready(){if(!this.ctx)this.ctx=new AudioContext({latencyHint:'interactive'});await this.pausePromise;await this.ctx.resume();}
 clock(){this.worker?.terminate();this.worker=new Worker(new URL('./ticker.js',import.meta.url),{type:'module'});this.worker.onmessage=()=>{void this.tick();};this.worker.postMessage('start');this.visual=requestAnimationFrame(()=>this.draw());}
 async start(from){
  if(this.playing||this.starting)return;
  const token=this.session;this.starting=true;this.emit();
  try{
   await this.ready();if(token!==this.session)return;
   if(this.paused&&this.bus&&from===undefined){this.paused=false;this.playing=true;this.starting=false;this.emit();this.clock();void this.tick();return;}
   const p=this.get(),length=p.tracks[0].steps.length,index=Math.max(0,Math.min(length-1,Math.floor(from??this.position)));
   const prepared=await prepareStep(this.bank,this.ctx,p,index);if(token!==this.session)return;
   this.bus=chain(this.ctx,p,true);this.next=this.ctx.currentTime+.12;this.index=index;this.queue=[];this.paused=false;this.playing=true;this.starting=false;
   this.schedule(p,index,prepared);this.emit();this.clock();void this.tick();
  }catch(error){if(token===this.session)this.stop();throw error;}finally{if(token===this.session){this.starting=false;this.emit();}}
 }
 schedule(p,index,prepared){
  if(this.next<this.ctx.currentTime+.01)this.next=this.ctx.currentTime+.025;
  for(const {ti,step,buffer} of prepared)fireBuffer(this.ctx,this.bus,p,ti,step,this.next+(step.offset??0)*stepDuration(p,index),this.sources,buffer);
  this.queue.push({time:this.next,step:index});if(this.queue.length>64)this.queue.splice(0,this.queue.length-64);this.next+=stepDuration(p,index);this.index++;this.count++;
 }
 async tick(){
  if(!this.playing||this.busy)return;const token=this.session;this.busy=true;
  try{
   const horizon=this.ctx.currentTime+.45;
   while(this.playing&&token===this.session&&this.next<horizon){
    const p=this.get(),index=this.index%p.tracks[0].steps.length,prepared=await prepareStep(this.bank,this.ctx,p,index);
    if(!this.playing||token!==this.session)return;this.schedule(p,index,prepared);
   }
  }catch(error){if(token===this.session){this.lastError=error;this.stop();this.onState(false,'error',error);}}finally{this.busy=false;}
 }
 draw(){if(!this.playing)return;let latest=null;while(this.queue.length&&this.queue[0].time<=this.ctx.currentTime)latest=this.queue.shift().step;if(latest!==null){this.position=latest;this.step=latest;this.onStep(latest);}this.visual=requestAnimationFrame(()=>this.draw());}
 async pause(){
  if(!this.playing)return;this.playing=false;this.paused=true;this.worker?.terminate();cancelAnimationFrame(this.visual);this.emit();
  this.pausePromise=this.ctx.suspend();await this.pausePromise;
 }
 async seek(index){const running=this.playing;this.stop();this.position=Math.max(0,Math.min(this.get().tracks[0].steps.length-1,Math.floor(index)));this.step=this.position;this.onStep(this.position);if(running)await this.start(this.position);}
 update(){if(this.bus&&this.ctx){const p=this.get();this.bus.filter.frequency.setTargetAtTime(p.cutoff,this.ctx.currentTime,.025);this.bus.gain.gain.setTargetAtTime(p.master*.42,this.ctx.currentTime,.02);}}
 readWaveform(target){
  const preview=this.scopePreview;
  if(preview&&performance.now()<preview.until&&!this.playing){preview.bus.analyser.getFloatTimeDomainData(target);return 'live';}
  if(this.playing&&this.bus?.analyser){this.bus.analyser.getFloatTimeDomainData(target);return 'live';}
  if(this.paused&&this.bus?.analyser){this.bus.analyser.getFloatTimeDomainData(target);return 'paused';}
  target.fill(0);return 'idle';
 }
 stop(){
  this.session++;this.starting=false;this.playing=false;this.paused=false;this.worker?.terminate();cancelAnimationFrame(this.visual);
  if(this.bus){const bus=this.bus;this.bus=null;bus.gain.gain.cancelScheduledValues(this.ctx.currentTime);bus.gain.gain.setTargetAtTime(0,this.ctx.currentTime,.006);for(const source of this.sources){try{source.stop(this.ctx.currentTime+.035);}catch{}}this.sources.clear();setTimeout(()=>bus.dispose(),90);}
  this.queue=[];this.position=0;this.step=-1;this.onStep(-1);this.emit();
 }
 async preview(note,params={},ti=4){let ctx;if(this.paused){ctx=this.previewCtx??=new AudioContext({latencyHint:'interactive'});await ctx.resume();}else{await this.ready();ctx=this.ctx;}const p=copy(this.get()),s={note,velocity:params.velocity??.8,length:params.length??2},buffer=await this.bank.get(ctx,p,ti,s,0),bus=chain(ctx,p,true);const scope={bus,until:performance.now()+(buffer.duration+.9)*1000};this.scopePreview=scope;fireBuffer(ctx,bus,p,ti,s,ctx.currentTime+.01,undefined,buffer);setTimeout(()=>{if(this.scopePreview===scope)this.scopePreview=null;bus.dispose();},Math.ceil((buffer.duration+.9)*1000));}
}
export async function renderWav(project,{signal,onProgress=()=>{}}={}){
 const p=copy(project),duration=p.bars*240/p.bpm,tail=1.8,ctx=new OfflineAudioContext(2,Math.ceil((duration+tail)*44100),44100),bus=chain(ctx,p),bank=new VoiceBank();
 const abort=()=>{if(signal?.aborted)throw new DOMException('已取消导出','AbortError');};
 const cancel=()=>bank.close();signal?.addEventListener('abort',cancel,{once:true});let timer;
 try{
  abort();let time=0;
  for(let b=0;b<p.bars;b++){
   for(let i=0;i<16;i++){
    abort();const index=(b%p.phraseBars)*16+i,remaining=p.bars*16-(b*16+i);
    const prepared=await prepareStep(bank,ctx,p,index);abort();
    for(const {ti,step,buffer} of prepared){
     const trimmed={...step,length:Math.min(step.length,remaining-(step.offset??0))};
     const actual=trimmed.length===step.length?buffer:await bank.get(ctx,p,ti,trimmed,index);abort();
     fireBuffer(ctx,bus,p,ti,trimmed,time+(step.offset??0)*stepDuration(p,index),undefined,actual);
    }
    time+=stepDuration(p,index);
   }
   onProgress({percent:(b+1)/p.bars*70,message:'准备声部 '+(b+1)+' / '+p.bars+' 小节'});
  }
  abort();onProgress({percent:70,message:'合成立体声音频'});abort();
  timer=setInterval(()=>onProgress({percent:70+Math.min(1,ctx.currentTime/(duration+tail))*20,message:'合成立体声音频'}),100);
  const audio=await new Promise((resolve,reject)=>{
   const cancelRender=()=>reject(new DOMException('已取消导出','AbortError'));
   signal?.addEventListener('abort',cancelRender,{once:true});
   ctx.startRendering().then(resolve,reject).finally(()=>signal?.removeEventListener('abort',cancelRender));
  });
  clearInterval(timer);abort();
  const n=audio.length,buf=new ArrayBuffer(44+n*4),v=new DataView(buf),str=(off,s)=>[...s].forEach((c,i)=>v.setUint8(off+i,c.charCodeAt(0)));
  str(0,'RIFF');v.setUint32(4,36+n*4,true);str(8,'WAVE');str(12,'fmt ');v.setUint32(16,16,true);v.setUint16(20,1,true);v.setUint16(22,2,true);v.setUint32(24,44100,true);v.setUint32(28,176400,true);v.setUint16(32,4,true);v.setUint16(34,16,true);str(36,'data');v.setUint32(40,n*4,true);
  let peak=0,nonfinite=0,energy=0;const left=audio.getChannelData(0),right=audio.getChannelData(1);
  for(let start=0;start<n;start+=32768){
   abort();for(let i=start;i<Math.min(n,start+32768);i++)for(let c=0;c<2;c++){const x=(c?right:left)[i];peak=Math.max(peak,Math.abs(x));energy+=x*x;if(!Number.isFinite(x))nonfinite++;v.setInt16(44+(i*2+c)*2,Math.round(Math.max(-1,Math.min(1,x))*32767),true);}
   onProgress({percent:90+Math.min(1,(start+32768)/n)*10,message:'写入 WAV 文件'});await new Promise(resolve=>setTimeout(resolve,0));
  }
  abort();return {blob:new Blob([buf],{type:'audio/wav'}),stats:{sampleRate:44100,channels:2,seconds:n/44100,peak,rms:Math.sqrt(energy/(n*2)),nonfinite,bars:p.bars,scoreBars:p.phraseBars,voices:6}};
 }finally{clearInterval(timer);signal?.removeEventListener('abort',cancel);bank.close();bus.dispose();}
}
