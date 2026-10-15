let timer;onmessage=e=>{if(e.data==='start'){clearInterval(timer);timer=setInterval(()=>postMessage('tick'),25);}else clearInterval(timer);};
