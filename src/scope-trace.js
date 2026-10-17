// Display-only processing. Never write back into the audio analyser's samples.
export class ScopeTrace {
 constructor(){this.values=new Float32Array(256);this.ready=false;}
 update(samples,state,dt=1/30){
  if(state==='paused')return this.values;
  let energy=0;for(const v of samples)energy+=v*v;
  if(state==='idle'||energy/samples.length<1e-10){this.values.fill(0);this.ready=false;return this.values;}
  const count=this.values.length,span=1024,read=(start,i)=>{
   const at=start+i*span/(count-1),k=Math.floor(at),t=at-k;
   return samples[k]*(1-t)+samples[k+1]*t;
  };
  let trigger=0,best=-Infinity;
  // Fractional rising crossings avoid whole-sample jitter. Correlation selects
  // the crossing that best matches the preceding trace in a mixed arrangement.
  for(let k=1;k<512;k++)if(samples[k-1]<=0&&samples[k]>0){
   const start=k-1-samples[k-1]/(samples[k]-samples[k-1]);
   let dot=0,power=0;
   for(let i=0;i<count;i+=8){const v=read(start,i);dot+=v*this.values[i];power+=v*v;}
   const score=this.ready?dot/Math.sqrt(power+1e-15):-start;
   if(score>best){best=score;trigger=start;}
  }
  const alpha=this.ready?1-Math.exp(-Math.min(.1,Math.max(0,dt))/.025):1;
  for(let i=0;i<count;i++){
   const previous=read(trigger,Math.max(0,i-1)),current=read(trigger,i),next=read(trigger,Math.min(count-1,i+1));
   const value=previous*.2+current*.6+next*.2;
   this.values[i]+=(value-this.values[i])*alpha;
  }
  this.ready=true;return this.values;
 }
}
