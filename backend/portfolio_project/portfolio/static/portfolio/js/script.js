/* ── Theme ── */
const body = document.body;
const themeBtn = document.getElementById('themeBtn');
body.className = localStorage.getItem('theme') || 'light';
themeBtn.addEventListener('click', () => {
  body.className = body.className === 'dark' ? 'light' : 'dark';
  localStorage.setItem('theme', body.className);
});

/* ── Navbar scroll ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 55);
});

/* ── Hamburger ── */
const burger = document.getElementById('burger');
const navPill = document.getElementById('navPill');
const closeNav = document.getElementById('closeNav');
burger.addEventListener('click', () => navPill.classList.toggle('open'));
if(closeNav) closeNav.addEventListener('click', () => navPill.classList.remove('open'));
navPill.querySelectorAll('.nl').forEach(a => a.addEventListener('click', () => navPill.classList.remove('open')));

/* ── Active nav on scroll ── */
const secs = document.querySelectorAll('section[id]');
const nls  = document.querySelectorAll('.nl');
new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      nls.forEach(a => a.classList.remove('active'));
      const a = document.querySelector(`.nl[data-s="${e.target.id}"]`);
      if (a) a.classList.add('active');
    }
  });
}, { threshold: 0.35 }).observe && secs.forEach(s =>
  new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      nls.forEach(a => a.classList.remove('active'));
      const a = document.querySelector(`.nl[data-s="${s.id}"]`);
      if (a) a.classList.add('active');
    }
  }, { threshold: 0.35 }).observe(s)
);

/* ── Typed text ── */
const words = ['App Developer', 'Flutter Developer', 'Full Stack Enthusiast', 'Problem Solver'];
let wi = 0, ci = 0, del = false;
const el = document.getElementById('typed');
function type() {
  const w = words[wi];
  if (!del) {
    el.textContent = w.slice(0, ++ci);
    if (ci === w.length) { del = true; setTimeout(type, 1800); return; }
  } else {
    el.textContent = w.slice(0, --ci);
    if (ci === 0) { del = false; wi = (wi + 1) % words.length; }
  }
  setTimeout(type, del ? 55 : 95);
}
type();

/* ── Scroll reveal ── */
const revels = document.querySelectorAll('.reveal');
const ro = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('vis'); ro.unobserve(e.target); }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
revels.forEach(r => ro.observe(r));

/* ── Contact form ── */
const form = document.getElementById('contactForm');
const sendBtn = document.getElementById('sendBtn');
const fb = document.getElementById('formFb');

form.addEventListener('submit', async e => {
  e.preventDefault();
  const name    = form.name.value.trim();
  const email   = form.email.value.trim();
  const message = form.message.value.trim();
  if (!name || !email || !message) {
    fb.textContent = '⚠ Please fill in all fields.';
    fb.className = 'form-fb err'; return;
  }
  sendBtn.textContent = 'Sending…'; sendBtn.disabled = true;
  try {
    const res  = await fetch('/api/contact/', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, message })
    });
    const data = await res.json();
    if (res.ok && data.success) {
      fb.textContent = '✅ Message sent! I\'ll get back to you soon.';
      fb.className = 'form-fb ok'; form.reset();
    } else throw new Error(data.error || 'Error');
  } catch {
    fb.textContent = '❌ Could not send. Email me: rahilkoshti296@gmail.com';
    fb.className = 'form-fb err';
  }
  sendBtn.textContent = 'SEND MESSAGE'; sendBtn.disabled = false;
});