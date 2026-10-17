import {chooseProgression,chordVoicing,harmonyFit} from './harmony-plan.js';
import {scaleNote,nearestPitch,triadNotes} from './project.js';
import {stepEvents} from './events.js';
import {ACCOMPANIMENT_STYLES} from './accompaniment-styles.js';

const PARTS=[0,1,2,3,5],clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const sorted=values=>[...new Set(values)].sort((a,b)=>a-b);
function randomSource(seed){let state=seed>>>0;return ()=>{state=(Math.imul(state,1664525)+1013904223)>>>0;return state/4294967296;};}
const pick=(values,r)=>values[Math.floor(r()*values.length)];
function sample(values,count,r){const pool=[...values],out=[];while(pool.length&&out.length<count)out.push(pool.splice(Math.floor(r()*pool.length),1)[0]);return out;}
function melodyContext(p){
 const bars=Array.from({length:p.phraseBars},()=>({attacks:[],pitches:[],busy:0})),active=Array.from({length:p.phraseBars*16},()=>[]);
 p.tracks[4].steps.forEach((s,index)=>{for(const event of stepEvents(s)){
  const start=index+(event.offset??0),bar=bars[Math.floor(start/16)];
  const notes=p.tracks[4].mode==='triad'?triadNotes(p,event.note):[event.note];
  bar.attacks.push(start%16);bar.pitches.push(...notes);
  for(let i=Math.floor(start);i<Math.min(active.length,Math.ceil(start+event.length));i++)active[i].push(...notes);
 }});
 for(const bar of bars)bar.busy=clamp(bar.attacks.length/10,0,1);
 return {bars,active};
}
function theme(style,r){
 const kick=sorted([...style.kick,...sample(style.extra,style.extras[0]+Math.floor(r()*(style.extras[1]-style.extras[0]+1)),r)]);
 return {kick,snare:[...style.snare],hat:[...pick(style.hats,r)],bass:[...pick(style.bass,r)],chord:[...pick(style.chords,r)],bassFigure:sample([0,2,4,7],4,r)};
}
function register(p,degree,low,high,previous){
 const pc=((scaleNote(p,degree)%12)+12)%12,notes=[];
 for(let note=low;note<=high;note++)if(note%12===pc)notes.push(note);
 return notes.sort((a,b)=>Math.abs(a-previous)-Math.abs(b-previous))[0]??nearestPitch(p,scaleNote(p,degree,36),low,high,true);
}
function evolve(positions,anchors,extras,r,amount){
 const keep=positions.filter(i=>anchors.includes(i)||r()>amount*.36);
 if(r()<amount&&extras.length)keep.push(pick(extras,r));
 return sorted([...anchors,...keep]);
}
function candidate(p,style,context,seed){
 const r=randomSource(seed),count=p.phraseBars*16;
 const tracks=p.tracks.map((t,ti)=>PARTS.includes(ti)?{...t,steps:Array.from({length:count},()=>({on:false,note:ti===3?36:ti===5?48:42,velocity:.76,length:1}))}:t);
 tracks[3].mode='single';tracks[5].mode='single';
 tracks[3].sound=style.id==='chip'?'triangle':'bass';tracks[5].sound=style.sound;
 const themes=[theme(style,r),theme(style,r)],energy=.88+r()*.24;
 let bassPrevious=36+p.key,chordPrevious=null;
 const articulation=style.id==='chip'?'arp':pick(style.id==='hiphop'?['block','pad']:style.id==='funk'||style.id==='rock'?['block','split']:['block','split','arp'],r);
 const put=(ti,index,note,length,velocity)=>{tracks[ti].steps[index]={on:true,note,length:clamp(length,.25,count-index),velocity:clamp(velocity,.15,.98)};};
 for(let bar=0;bar<p.phraseBars;bar++){
  const base=bar*16,degree=p.progression[bar],lead=context.bars[bar],motif=themes[bar%2];
  const phraseEnd=(bar+1)%4===0,section=Math.floor(bar/8)%4;
  const development=p.phraseBars<8?1:section===0?.86:section===1?1.05:section===2?.76:1.12;
  const level=energy*development,variation=bar%4===0?.16:bar%4===2?.28:.52;
  const kick=evolve(motif.kick,style.kick,style.extra,r,variation);
  let snare=[...motif.snare];
  let hat=evolve(motif.hat,style.id==='dance'?[2,6,10,14]:[0,8],[1,3,7,11,15],r,style.ornament*level);
  if(level<.85)hat=hat.filter((i,j)=>j%2===0||i%4===0||style.id==='dance'&&i%4===2);
  if(r()<style.ornament*.6)snare.push(pick(style.ghost,r));
  // Fills vary and are reserved for phrase boundaries. Genre anchors survive.
  if(phraseEnd&&(bar%8===7||r()<.72)){
   snare.push(...pick([[14,15],[13,14,15],[12,14],[10,13,15]],r));hat.push(15);
  }
  for(const i of kick)put(0,base+i,36,1,(i%8===0?.88:.74)*level+(r()-.5)*.1);
  for(const i of sorted(snare))put(1,base+i,38,1,(style.snare.includes(i)?.76:.35+r()*.13)*level);
  for(const i of sorted(hat)){
   const open=i%4===2&&r()<(style.id==='dance'?.28:.07);
   put(2,base+i,open?46:42,1,(i%4===0?.47:i%2===0?.36:.25)*level+(r()-.5)*.08);
   if(open)tracks[2].steps[base+i].hits=[46];
  }
  // A repeated two-bar bass figure grows responses and follows kick accents.
  let bass=[...motif.bass];
  if(r()<.55)bass.push(pick(kick,r));
  if(bar%2===1&&r()<.55)bass.push(pick([6,10,14],r));
  bass=sorted(bass).filter((i,j)=>j===0||(level>=.85||j%2===0)).slice(0,9);
  bass.forEach((i,j)=>{
   const strong=i%8===0||j===0;
   let interval=strong?0:motif.bassFigure[(j+Math.floor(bar/4))%motif.bassFigure.length];
   if(!strong&&bar%2===1&&r()<.35)interval=4;
   if(i>=14&&lead.busy<.5&&r()<.35)interval=p.progression[(bar+1)%p.phraseBars]-degree+(r()<.5?-1:1);
   const note=register(p,degree+interval,28,55,bassPrevious),gap=(bass[j+1]??16)-i;
   put(3,base+i,note,Math.max(.4,gap*style.bassGate),(.66+(kick.includes(i)?.1:0)+(r()-.5)*.09)*level);
   bassPrevious=note;
  });
  // Leave rhythmic space for busy leads; explicit notes preserve inversions.
  let chord=[...motif.chord];
  if(style.id!=='chip'&&lead.busy>.4)chord=chord.filter((i,j)=>j===0||!lead.attacks.some(a=>Math.abs(a-i)<1.5));
  if(lead.busy>.7)chord=chord.filter((i,j)=>j===0||j%2===0);
  if(bar%2===1&&lead.busy<.4&&r()<.6)chord.push(pick(style.id==='chip'?[3,7,11,15]:[6,10,14],r));
  chord=sorted(chord).filter((i,j)=>j===0||(level>=.85||j%2===0));
  const median=lead.pitches.length?[...lead.pitches].sort((a,b)=>a-b)[Math.floor(lead.pitches.length/2)]:76;
  const voicing=chordVoicing(p,degree,chordPrevious,clamp(median-2,60,76),r);chordPrevious=voicing;
  chord.forEach((i,j)=>{
   const gap=(chord[j+1]??16)-i;
   const notes=articulation==='arp'?[voicing[j%3]]:articulation==='split'?(j%2?voicing.slice(1):[voicing[0]]):voicing;
   const note=notes[0];
   const length=gap*(articulation==='pad'?.95:style.gate);
   put(5,base+i,note,Math.max(.4,length),(.55+(r()-.5)*.1)*level*(1-lead.busy*.3)/Math.sqrt(notes.length));
   const event=tracks[5].steps[base+i];if(notes.length>1)event.extra=notes.slice(1).map(note=>({note,offset:0,length:event.length,velocity:event.velocity}));
  });
 }
 return tracks;
}
// Rank coordination, register movement, lead clashes and similarity to the
// previous accompaniment. Heuristic scores cannot guarantee musical quality.
function quality(p,tracks,context){
 let score=0,matches=0,total=0,lastBass=null;
 for(let bar=0;bar<p.phraseBars;bar++){
  const base=bar*16,counts=PARTS.map(t=>tracks[t].steps.slice(base,base+16).filter(s=>s.on).length);
  if(counts.some(n=>n===0)||counts[0]+counts[1]+counts[2]>28)return -Infinity;
  score+=3;score-=Math.max(0,counts[0]+counts[1]+counts[2]-23)*.6;
  const lead=context.bars[bar];let soundingChord=[],chordEnd=base;
  for(let i=0;i<16;i++){
   const bass=tracks[3].steps[base+i],chord=tracks[5].steps[base+i];
   if(bass.on){if(tracks[0].steps[base+i].on)score+=.35;if(lastBass!==null)score-=Math.max(0,Math.abs(bass.note-lastBass)-7)*.14;lastBass=bass.note;}
   if(chord.on){
    if(lead.busy>.4&&lead.attacks.some(a=>Math.abs(a-i)<1))score-=.7*lead.busy;
    soundingChord=stepEvents(chord).map(e=>e.note);chordEnd=base+i+chord.length;
   }
   if(base+i<chordEnd)for(const n of context.active[base+i])if(soundingChord.some(v=>Math.abs(v-n)===1))score-=.2;
   for(const ti of PARTS){const s=tracks[ti].steps[base+i],old=p.tracks[ti].steps[base+i];if(s.on||old.on){total++;if(s.on===old.on&&(!s.on||s.note===old.note))matches++;}}
  }
 }
 if(total)score-=p.phraseBars*8*(matches/total)**3;
 // A looping phrase should re-enter without a large bass leap.
 const bassNotes=tracks[3].steps.filter(s=>s.on);
 if(bassNotes.length>1)score-=Math.max(0,Math.abs(bassNotes.at(-1).note-bassNotes[0].note)-7)*.2;
 return score;
}
export function generateAccompaniment(p,style=p.accompanimentStyle??'auto'){
 if(p.source)throw Error('请先新建空白工程，再生成随机伴奏。');
 if(style!=='auto'&&!ACCOMPANIMENT_STYLES.some(s=>s.id===style))throw Error('不支持的伴奏风格。');
 const seed=(p.seed+7919)%2147483647,turn=Math.floor(seed/7919);
 const family=style==='auto'?ACCOMPANIMENT_STYLES[turn%ACCOMPANIMENT_STYLES.length]:ACCOMPANIMENT_STYLES.find(s=>s.id===style);
 const context=melodyContext(p);let best,bestProgression,bestScore=-Infinity;
 for(let i=0;i<6;i++){
  const candidateSeed=(seed^Math.imul(i+1,0x9e3779b1))>>>0;
  const progression=chooseProgression(p,family,context,randomSource(candidateSeed));
  const arranged={...p,progression},tracks=candidate(arranged,family,context,candidateSeed);
  const repeated=p.harmonyPlan?.history.includes(progression.join(''));
  const score=quality(arranged,tracks,context)+harmonyFit(p,progression,context.active)-(repeated?8:0);
  if(score>bestScore){bestScore=score;best=tracks;bestProgression=progression;}
 }
 if(!best)throw Error('本次编配未通过检查，请再试一次。');
 // Commit atomically after a complete candidate has passed generation/ranking.
 for(const ti of PARTS)p.tracks[ti]=best[ti];
 p.progression=bestProgression;
 p.harmonyPlan={locked:p.harmonyPlan?.locked??Array(p.phraseBars).fill(true),history:[...(p.harmonyPlan?.history??[]),bestProgression.join('')].slice(-6),voiced:true};
 p.seed=seed;p.accompanimentStyle=style;
 return family.name;
}
