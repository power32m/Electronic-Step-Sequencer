import {copy,names,noteName,eventNotes,inScale,nearestPitch} from './project.js';
export function createPiano(host,api){
 host.innerHTML=`<div class="piano-heading"><div><span class="eyebrow">PIANO ROLL / 音符编辑</span><strong id="piano-title">主旋律</strong></div><p>点击空白处写音符 · 拖动移调/换位置 · 拖动右端改变音长 · 右键删除</p></div><div class="piano-ruler"><span>音高</span><div>${Array.from({length:16},(_,i)=>`<b>${i+1}</b>`).join('')}</div></div><div class="piano-scroll"><div class="piano-body"><div class="piano-keys"></div><div class="piano-grid" role="grid" aria-label="钢琴卷帘"><div class="piano-rows"></div><div class="piano-notes"></div><div class="piano-playhead"></div></div></div></div><div class="piano-foot">和弦轨的三个音共同移动，拖动任一音即可调整和弦根音；跨小节音符显示为延续。</div>`;
 const scroll=host.querySelector('.piano-scroll'),grid=host.querySelector('.piano-grid'),keys=host.querySelector('.piano-keys'),rows=host.querySelector('.piano-rows'),layer=host.querySelector('.piano-notes'),head=host.querySelector('.piano-playhead');
 let ti=4,bar=0,low=48,high=84,lastRange='',selected={track:4,step:0},drag=null;
 const rowHeight=16;
 const point=e=>{const r=grid.getBoundingClientRect();return {step:Math.max(0,Math.min(15,Math.floor((e.clientX-r.left)/r.width*16))),pitch:Math.max(low,Math.min(high,high-Math.floor((e.clientY-r.top)/rowHeight)))};};
 function choose(index){selected={track:ti,step:index};api.select(ti,index);}
 grid.addEventListener('pointerdown',e=>{
  if(e.button!==0)return;e.preventDefault();grid.focus();
  const el=e.target.closest('.roll-note'),p=api.get();
  if(el){const index=+el.dataset.index;choose(index);drag={index,x:e.clientX,y:e.clientY,pitch:+el.dataset.pitch,resize:!!e.target.closest('.roll-handle'),steps:copy(p.tracks[ti].steps),begun:false};grid.setPointerCapture(e.pointerId);}
  else {const pt=point(e),index=bar*16+pt.step,note=nearestPitch(p,pt.pitch,24,84);choose(index);api.change(q=>q.tracks[ti].steps[index]={on:true,note,velocity:.8,length:ti===5?4:1.8});api.preview(note,api.get().tracks[ti].steps[index],ti);}
 });
 grid.addEventListener('pointermove',e=>{
  if(!drag)return;const rect=grid.getBoundingClientRect(),dx=e.clientX-drag.x,dy=e.clientY-drag.y;
  if(!drag.begun&&Math.hypot(dx,dy)<3)return;
  if(!drag.begun){api.begin();drag.begun=true;}
  const original=drag.steps[drag.index],move=Math.round(dx/rect.width*16),pitchDelta=-Math.round(dy/rowHeight);
  const index=drag.resize?drag.index:Math.max(0,Math.min(drag.steps.length-1,drag.index+move));
  selected={track:ti,step:index};api.select(ti,index,false);
  api.change(p=>{const steps=copy(drag.steps);if(drag.resize){steps[index].length=Math.max(.25,Math.min(32,Math.round((original.length+dx/rect.width*16)*4)/4));}
   else{steps[drag.index].on=false;steps[index]={...copy(original),note:nearestPitch(p,original.note+pitchDelta,24,84),on:true};}p.tracks[ti].steps=steps;},false);
 });
 function release(){drag=null;}
 grid.addEventListener('pointerup',release);grid.addEventListener('pointercancel',release);grid.addEventListener('lostpointercapture',release);
 grid.addEventListener('contextmenu',e=>{e.preventDefault();const el=e.target.closest('.roll-note');if(!el)return;const index=+el.dataset.index;choose(index);api.change(p=>p.tracks[ti].steps[index].on=false);});
 grid.addEventListener('keydown',e=>{if(['Delete','Backspace'].includes(e.key)){e.preventDefault();api.change(p=>p.tracks[ti].steps[selected.step].on=false);}});
 grid.tabIndex=0;
 return {
  render(track,measure,selection,current){
   ti=track;bar=measure;selected=selection;host.hidden=track<3;if(track<3)return;
   low=track===3?24:48;high=track===3?60:84;
   const range=low+':'+high,p=api.get();
   host.querySelector('.piano-foot').textContent=track===5&&p.tracks[5].mode==='single'?'本轨为独立副旋律，每个音符可单独编辑。':'和弦轨的三个音共同移动；跨小节音符显示为延续。';
   host.querySelector('#piano-title').textContent=(track===5&&p.tracks[5].mode==='single'?'副旋律':names[track])+' · 第 '+(bar+1)+' 小节';
   if(range!==lastRange){lastRange=range;grid.style.height=((high-low+1)*rowHeight)+'px';keys.innerHTML=Array.from({length:high-low+1},(_,i)=>{const n=high-i;return `<div class="${[1,3,6,8,10].includes(n%12)?'black-key':'white-key'}">${noteName(n)}</div>`;}).join('');scroll.scrollTop=track===3?140:176;}
   rows.innerHTML=Array.from({length:high-low+1},(_,i)=>`<div class="piano-row ${inScale(p,high-i)?'in-scale':'outside-scale'}" style="height:${rowHeight}px"></div>`).join('');
   const from=bar*16,to=from+16;let html='';
   p.tracks[ti].steps.forEach((s,index)=>{if(!s.on||index>=to||index+s.length<=from)return;const start=Math.max(index,from)-from,width=Math.min(index+s.length,to)-Math.max(index,from);
    eventNotes(p,ti,s).forEach((pitch,tone)=>{if(pitch<low||pitch>high)return;const selectedClass=selection.track===ti&&selection.step===index?' selected':'';html+=`<div role="button" tabindex="0" aria-label="${names[ti]}第${Math.floor(index/16)+1}小节第${index%16+1}步 ${noteName(pitch)} 音长${s.length}步" class="roll-note${selectedClass}${tone?' chord-tone':''}${index<from?' carry':''}" data-index="${index}" data-pitch="${pitch}" style="left:${start/16*100}%;width:calc(${width/16*100}% - 2px);top:${(high-pitch)*rowHeight+1}px"><span>${index<from?'← ':''}${noteName(pitch)}</span><i class="roll-handle" title="拖动调整音长"></i></div>`;});
   });layer.innerHTML=html;this.setPlayhead(current,bar);
  },
  setPlayhead(current,measure=bar){const local=current-measure*16;head.hidden=local<0||local>15;head.style.left=(local/16*100)+'%';}
 };
}
