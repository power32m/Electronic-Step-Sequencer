import {audible,eventNotes} from './project.js';
import {stepEvents} from './events.js';
export const KEYBOARD_LAYERS=[{track:4,label:'主旋律',english:'LEAD',color:0xe76338},{track:5,label:'副旋律 / 和弦',english:'HARMONY',color:0x739780},{track:3,label:'贝斯',english:'BASS',color:0x698fa8}];
export const isBlackKey=note=>[1,3,6,8,10].includes(note%12);
export function keyboardRange(p,ti){
 const notes=p.tracks[ti].steps.flatMap(step=>stepEvents(step).flatMap(event=>eventNotes(p,ti,event)));
 const low=notes.length?Math.min(...notes):(ti===3?24:ti===5?48:60),high=notes.length?Math.max(...notes):low+24;
 const min=Math.floor(low/12)*12,max=Math.max(min+24,Math.ceil(high/12)*12);
 return {min,max};
}
export function activeKeyboardNotes(p,ti,position){
 const active=new Set(),track=p.tracks[ti];if(position<0||!audible(p,track))return active;
 const index=Math.floor(position),fraction=position-index;
 for(let back=0;back<=32;back++)for(const event of stepEvents(track.steps[((index-back)%track.steps.length+track.steps.length)%track.steps.length])){
  const age=back+fraction-(event.offset??0);if(age>=0&&age<event.length)eventNotes(p,ti,event).forEach(note=>active.add(note));
 }
 return active;
}
