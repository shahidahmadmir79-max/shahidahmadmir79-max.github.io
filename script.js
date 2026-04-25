// CURSOR
const cur = document.getElementById('cur');
const ring = document.getElementById('cur-ring');
if (cur && window.matchMedia('(hover: hover)').matches) {
  let mx = window.innerWidth/2, my = window.innerHeight/2, rx = mx, ry = my;
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cur.style.left = mx+'px'; cur.style.top = my+'px';
  });
  (function loop(){
    rx += (mx-rx)*.1; ry += (my-ry)*.1;
    ring.style.left = rx+'px'; ring.style.top = ry+'px';
    requestAnimationFrame(loop);
  })();
  document.querySelectorAll('a, button, .svc-card, .sk-block, .exp-item').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cur-big'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cur-big'));
  });
}

// NAV SCROLL
window.addEventListener('scroll', () => {
  document.getElementById('nav').classList.toggle('sc', scrollY > 50);
});

// MOBILE BURGER
const burger = document.getElementById('burger');
const navLinks = document.getElementById('nav-links');
burger.addEventListener('click', () => {
  burger.classList.toggle('open');
  navLinks.classList.toggle('open');
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    burger.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// SCROLL REVEAL
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

// CONTACT FORM
const form = document.getElementById('contact-form');
if (form) {
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = document.getElementById('submit-btn');
    const label = btn.querySelector('.btn-label');
    const sending = btn.querySelector('.btn-sending');
    const success = document.getElementById('form-success');
    const error = document.getElementById('form-error');
    success.classList.remove('show');
    error.classList.remove('show');
    btn.disabled = true;
    label.style.display = 'none';
    sending.style.display = 'inline';
    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) { success.classList.add('show'); form.reset(); }
      else { error.classList.add('show'); }
    } catch { error.classList.add('show'); }
    finally {
      btn.disabled = false;
      label.style.display = 'inline';
      sending.style.display = 'none';
    }
  });
}
