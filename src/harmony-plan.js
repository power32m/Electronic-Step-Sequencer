import {scaleNote,triadNotes} from './project.js';

// Diatonic loop grammars. Each phrase is chosen as a unit, never bar by bar.
const GRAMMARS={
 pop:[[0,4,5,3],[0,5,1,4],[5,3,0,4],[0,2,3,4],[3,4,2,5],[0,3,5,4]],
 rock:[[0,3,0,4],[0,5,3,4],[5,3,4,0],[0,0,3,4],[0,4,3,3],[5,4,3,4]],
 funk:[[0,0,3,4],[1,1,4,4],[0,3,0,4],[5,5,1,4],[0,1,3,4],[1,4,0,0]],
 dance:[[5,3,0,4],[0,4,5,3],[0,5,3,4],[5,4,3,4],[3,0,4,5],[0,3,5,4]],
 hiphop:[[5,3,1,4],[1,4,0,5],[0,2,5,3],[5,1,3,4],[0,5,3,3],[3,2,1,4]],
 latin:[[1,4,0,5],[0,5,1,4],[0,3,1,4],[5,1,4,0],[3,4,0,5],[0,2,1,4]],
 chip:[[0,5,3,4],[5,3,4,0],[0,3,1,4],[0,2,3,4],[5,4,3,4],[1,4,0,5]]
};
const pc=n=>(n%12+12)%12;
export function harmonyFit(p,progression,active){
 let score=0;
 for(let bar=0;bar<p.phraseBars;bar++){
  const tones=triadNotes(p,scaleNote(p,progression[bar],48)).map(pc);
  for(let i=0;i<16;i++)for(const note of active[bar*16+i]){
   const weight=i%4===0?2:1,n=pc(note);
   score+=tones.includes(n)?weight:tones.some(t=>Math.min(pc(n-t),pc(t-n))===1)?-.7*weight:0;
  }
 }
 return score/Math.max(1,p.phraseBars);
}
export function chooseProgression(p,style,context,r){
 const grammar=GRAMMARS[style.id],options=[];
 for(const phrase of grammar){
  const response=grammar[Math.floor(r()*grammar.length)];
  const progression=Array.from({length:p.phraseBars},(_,bar)=>p.harmonyPlan?.locked[bar]!==false?p.progression[bar]:(Math.floor(bar/4)%2?response:phrase)[bar%4]);
  const signature=progression.join(''),history=p.harmonyPlan?.history??[];
  const recency=history.lastIndexOf(signature),immediate=signature===p.progression.join('');
  options.push({progression,score:harmonyFit(p,progression,context.active)+(r()-.5)*2-(recency<0?0:2+recency)-(immediate?12:0)});
 }
 return options.sort((a,b)=>b.score-a.score)[0].progression;
}
// Choose a close-position inversion with smooth voice movement and room for lead.
export function chordVoicing(p,degree,previous,ceiling,r){
 const pcs=triadNotes(p,scaleNote(p,degree,48)).map(pc),options=[];
 for(let bass=45;bass<=64;bass++){
  if(!pcs.includes(pc(bass)))continue;
  const notes=[];for(let n=bass;n<bass+12;n++)if(pcs.includes(pc(n)))notes.push(n);
  if(notes.length!==3||notes[2]>ceiling)continue;
  const movement=previous?notes.reduce((s,n,i)=>s+Math.abs(n-previous[i]),0):Math.abs(bass-(48+Math.floor(r()*9)));
  options.push({notes,score:movement+r()*2});
 }
 return options.sort((a,b)=>a.score-b.score)[0]?.notes??triadNotes(p,scaleNote(p,degree,48));
}
