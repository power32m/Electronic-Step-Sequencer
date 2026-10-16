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
