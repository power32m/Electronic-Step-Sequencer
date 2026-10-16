// A step can contain several independently timed MIDI notes (e.g. triplets).
export const stepEvents = s => s.on ? [s,...(s.extra??[])] : [];
export const editEvent = (s,index=0) => index ? s.extra?.[index-1]??s : s;
export function removeEvent(s,index=0){
 if(index){s.extra.splice(index-1,1);if(!s.extra.length)delete s.extra;}
 else if(s.extra?.length){const [first,...rest]=s.extra;Object.assign(s,first);if(rest.length)s.extra=rest;else delete s.extra;}
 else s.on=false;
}
