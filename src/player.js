// Keep the expanded player's space in the document when its sticky UI compacts.
// Otherwise scroll anchoring can move the sentinel back across the threshold,
// repeatedly toggling the compact state while the user is no longer scrolling.
export function createStickyPlayer(frame,bar,anchor){
 let lastWidth=0;
 function reserveHeight(){
  const compact=bar.classList.contains('is-stuck');
  const width=frame.getBoundingClientRect().width;
  if(compact&&width===lastWidth)return;
  lastWidth=width;
  if(compact)bar.classList.remove('is-stuck');
  frame.style.height=bar.getBoundingClientRect().height+'px';
  if(compact)bar.classList.add('is-stuck');
 }
 reserveHeight();
 const sizeObserver=new ResizeObserver(reserveHeight);
 sizeObserver.observe(frame);sizeObserver.observe(bar);
 const scrollObserver=new IntersectionObserver(([entry])=>{
  bar.classList.toggle('is-stuck',!entry.isIntersecting&&entry.boundingClientRect.top<0);
 });
 scrollObserver.observe(anchor);
}
