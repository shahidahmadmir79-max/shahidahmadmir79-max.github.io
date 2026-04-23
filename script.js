const cur=document.getElementById('cur'),ring=document.getElementById('cur-ring');
let mx=window.innerWidth/2,my=window.innerHeight/2,rx=mx,ry=my;
document.addEventListener('mousemove',e=>{
  mx=e.clientX;my=e.clientY;
  cur.style.left=mx+'px';cur.style.top=my+'px';
});
(function loop(){
  rx+=(mx-rx)*.09;ry+=(my-ry)*.09;
  ring.style.left=rx+'px';ring.style.top=ry+'px';
  requestAnimationFrame(loop);
})();
document.querySelectorAll('a,button,.sr').forEach(el=>{
  el.addEventListener('mouseenter',()=>document.body.classList.add('cur-big'));
  el.addEventListener('mouseleave',()=>document.body.classList.remove('cur-big'));
});
window.addEventListener('scroll',()=>document.getElementById('nav').classList.toggle('sc',scrollY>50));
const obs=new IntersectionObserver(e=>e.forEach(x=>{if(x.isIntersecting){x.target.classList.add('in');obs.unobserve(x.target)}}),{threshold:.1});
document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));