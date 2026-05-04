// ═══ ANIMATED BACKGROUND CANVAS ═══
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let W, H, particles = [];

function resize(){
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

class Particle{
  constructor(){this.reset()}
  reset(){
    this.x = Math.random()*W;
    this.y = Math.random()*H;
    this.r = Math.random()*2+.5;
    this.vx = (Math.random()-.5)*.3;
    this.vy = (Math.random()-.5)*.3;
    this.life = Math.random();
    this.maxLife = Math.random()*200+100;
    this.hue = Math.random()<.5 ? 330 : 270; // pink or purple
  }
  update(){
    this.x += this.vx; this.y += this.vy; this.life++;
    if(this.life>this.maxLife||this.x<0||this.x>W||this.y<0||this.y>H) this.reset();
  }
  draw(){
    const alpha = Math.sin((this.life/this.maxLife)*Math.PI)*.4;
    ctx.beginPath();
    ctx.arc(this.x,this.y,this.r,0,Math.PI*2);
    ctx.fillStyle = `hsla(${this.hue},80%,65%,${alpha})`;
    ctx.fill();
  }
}

for(let i=0;i<80;i++) particles.push(new Particle());

// Draw connecting lines between nearby particles
function drawLines(){
  for(let i=0;i<particles.length;i++){
    for(let j=i+1;j<particles.length;j++){
      const dx=particles[i].x-particles[j].x;
      const dy=particles[i].y-particles[j].y;
      const d=Math.sqrt(dx*dx+dy*dy);
      if(d<120){
        const alpha=(1-d/120)*.08;
        ctx.beginPath();
        ctx.moveTo(particles[i].x,particles[i].y);
        ctx.lineTo(particles[j].x,particles[j].y);
        ctx.strokeStyle=`rgba(238,42,123,${alpha})`;
        ctx.lineWidth=.5;
        ctx.stroke();
      }
    }
  }
}

function animate(){
  ctx.clearRect(0,0,W,H);
  drawLines();
  particles.forEach(p=>{p.update();p.draw()});
  requestAnimationFrame(animate);
}
animate();

// ═══ CURSOR ═══
const cur = document.getElementById('cur');
const trail = document.getElementById('cur-trail');
if(cur && window.matchMedia('(hover: hover)').matches){
  let mx=W/2,my=H/2,tx=mx,ty=my;
  document.addEventListener('mousemove',e=>{
    mx=e.clientX; my=e.clientY;
    cur.style.left=mx+'px'; cur.style.top=my+'px';
  });
  (function loop(){
    tx+=(mx-tx)*.12; ty+=(my-ty)*.12;
    trail.style.left=tx+'px'; trail.style.top=ty+'px';
    requestAnimationFrame(loop);
  })();
}

// ═══ NAV ═══
window.addEventListener('scroll',()=>{
  document.getElementById('nav').classList.toggle('sc',scrollY>50);
});

// ═══ BURGER ═══
const burger=document.getElementById('burger');
const navLinks=document.getElementById('nav-links');
burger.addEventListener('click',()=>{
  burger.classList.toggle('open');
  navLinks.classList.toggle('open');
  document.body.style.overflow=navLinks.classList.contains('open')?'hidden':'';
});
navLinks.querySelectorAll('a').forEach(l=>{
  l.addEventListener('click',()=>{
    burger.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.style.overflow='';
  });
});

// ═══ 3D CARD TILT ═══
const card3d = document.getElementById('card3d');
if(card3d){
  const hero = document.querySelector('.hero');
  hero.addEventListener('mousemove',e=>{
    const rect = card3d.getBoundingClientRect();
    const cx = rect.left + rect.width/2;
    const cy = rect.top + rect.height/2;
    const rx = ((e.clientY-cy)/rect.height)*18;
    const ry = -((e.clientX-cx)/rect.width)*18;
    card3d.style.transform=`perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.03)`;
  });
  hero.addEventListener('mouseleave',()=>{
    card3d.style.transform='perspective(800px) rotateX(0) rotateY(0) scale(1)';
  });
}

// ═══ SCROLL REVEAL ═══
const obs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){e.target.classList.add('in');obs.unobserve(e.target)}
  });
},{threshold:.1});
document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));

// ═══ WEB3FORMS CONTACT ═══
const form=document.getElementById('contact-form');
if(form){
  form.addEventListener('submit',async e=>{
    e.preventDefault();
    const btn=document.getElementById('submit-btn');
    const label=btn.querySelector('.btn-label');
    const sending=btn.querySelector('.btn-sending');
    const success=document.getElementById('form-success');
    const error=document.getElementById('form-error');
    success.classList.remove('show');
    error.classList.remove('show');
    btn.disabled=true;
    label.style.display='none';
    sending.style.display='inline';
    try{
      const res=await fetch('https://api.web3forms.com/submit',{
        method:'POST',
        headers:{'Content-Type':'application/json','Accept':'application/json'},
        body:JSON.stringify({
          access_key:'fed59db1-9658-4596-a9d4-7a11e1466552',
          subject:'New enquiry — Marketing by Shahid',
          name:form.querySelector('[name="name"]').value,
          email:form.querySelector('[name="email"]').value,
          service:form.querySelector('[name="service"]').value,
          message:form.querySelector('[name="message"]').value,
        })
      });
      const data=await res.json();
      if(data.success){success.classList.add('show');form.reset();}
      else{error.classList.add('show');}
    }catch{error.classList.add('show');}
    finally{
      btn.disabled=false;
      label.style.display='inline';
      sending.style.display='none';
    }
  });
}
