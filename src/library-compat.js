// Retired examples stay importable as personal projects, without reappearing in the menu.
export const legacyClassicLimits={'classic-super-c':74,'classic-double-dragon-2':44,'classic-river-city-ransom':88,'classic-jackal':35};
export const legacyPresetNames={'赤影战士 · Boss 战':'赤影战士','恶魔城 · Vampire Killer':'恶魔城','超级马里奥 · 地面主题':'超级马里奥','赤色要塞 · 第一关':'赤色要塞'};

// Only move an unchanged old Jackal score. A user's edited timing is never rewritten.
export function trimUntouchedJackal(p,data,events){
 if(p.source!=='classic-jackal'||!data?.introTrimSteps||p.phraseBars!==data.previousPhraseBars)return false;
 const shift=data.introTrimSteps;
 for(let ti=0;ti<6;ti++){
  const actual=p.tracks[ti].steps.flatMap((s,i)=>events(s).map(e=>[i+(e.offset??0),e.length,e.note,e.velocity]));
  const expected=data.score[ti];
  if(actual.length!==expected.length||actual.some((e,i)=>e.some((v,j)=>Math.abs(v-(expected[i][j]+(j===0?shift:0)))>1e-5)))return false;
 }
 p.tracks.forEach((track,ti)=>{
  track.steps=Array.from({length:data.phraseBars*16},(_,i)=>({on:false,note:ti===3?36:i<64?(ti===5?48:64):60,velocity:.76,length:Math.min(2,data.phraseBars*16-i)}));
  for(const [start,length,note,velocity] of data.score[ti]){
   const index=Math.floor(start+1e-7),event={offset:Math.max(0,start-index),length,note,velocity},step=track.steps[index];
   if(step.on)(step.extra??=[]).push(event);else Object.assign(step,event,{on:true});
  }
 });
 if(p.bars===p.phraseBars)p.bars=data.phraseBars;
 if(p.harmonyPlan)p.harmonyPlan.locked=p.harmonyPlan.locked.slice(0,data.phraseBars);p.phraseBars=data.phraseBars;p.progression=p.progression.slice(0,data.phraseBars);return true;
}
