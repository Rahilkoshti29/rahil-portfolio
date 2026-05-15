/* ══════════════════════════════════════
   THEME
══════════════════════════════════════ */
const body = document.body;
const themeBtn = document.getElementById('themeBtn');

body.className = localStorage.getItem('theme') || 'dark';

themeBtn.addEventListener('click', () => {
  body.className = body.className === 'dark' ? 'light' : 'dark';
  localStorage.setItem('theme', body.className);
});


/* ══════════════════════════════════════
   NAVBAR SCROLL
══════════════════════════════════════ */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 55);
});


/* ══════════════════════════════════════
   MOBILE MENU
══════════════════════════════════════ */
const burger = document.getElementById('burger');
const navPill = document.getElementById('navPill');
const navLinks = document.querySelectorAll('.nl');

/* Open / Close Menu */
burger.addEventListener('click', (e) => {
  e.stopPropagation();
  navPill.classList.toggle('open');

  /* Prevent body scroll when menu open */
  if (navPill.classList.contains('open')) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
});

/* Close menu when clicking nav link */
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    navPill.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* Close menu when clicking outside */
document.addEventListener('click', (e) => {
  if (
    navPill.classList.contains('open') &&
    !navPill.contains(e.target) &&
    !burger.contains(e.target)
  ) {
    navPill.classList.remove('open');
    document.body.style.overflow = '';
  }
});

/* Close menu on resize */
window.addEventListener('resize', () => {
  if (window.innerWidth > 1100) {
    navPill.classList.remove('open');
    document.body.style.overflow = '';
  }
});


/* ══════════════════════════════════════
   ACTIVE NAV ON SCROLL
══════════════════════════════════════ */
const sections = document.querySelectorAll('section[id]');

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {

      if (entry.isIntersecting) {

        navLinks.forEach(link => {
          link.classList.remove('active');
        });

        const activeLink = document.querySelector(
          `.nl[data-s="${entry.target.id}"]`
        );

        if (activeLink) {
          activeLink.classList.add('active');
        }
      }
    });
  },
  {
    threshold: 0.35
  }
);

sections.forEach(section => {
  observer.observe(section);
});


/* ══════════════════════════════════════
   TYPED TEXT
══════════════════════════════════════ */
const words = [
  'App Developer',
  'Flutter Developer',
  'Full Stack Enthusiast',
  'Problem Solver'
];

let wi = 0;
let ci = 0;
let del = false;

const typedEl = document.getElementById('typed');

function typeEffect() {

  const currentWord = words[wi];

  if (!del) {

    typedEl.textContent = currentWord.slice(0, ++ci);

    if (ci === currentWord.length) {
      del = true;
      setTimeout(typeEffect, 1800);
      return;
    }

  } else {

    typedEl.textContent = currentWord.slice(0, --ci);

    if (ci === 0) {
      del = false;
      wi = (wi + 1) % words.length;
    }
  }

  setTimeout(typeEffect, del ? 55 : 95);
}

typeEffect();


/* ══════════════════════════════════════
   SCROLL REVEAL
══════════════════════════════════════ */
const reveals = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(
  entries => {

    entries.forEach(entry => {

      if (entry.isIntersecting) {

        entry.target.classList.add('vis');
        revealObserver.unobserve(entry.target);
      }
    });

  },
  {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  }
);

reveals.forEach(item => {
  revealObserver.observe(item);
});


/* ══════════════════════════════════════
   CONTACT FORM
══════════════════════════════════════ */
const form = document.getElementById('contactForm');
const sendBtn = document.getElementById('sendBtn');
const fb = document.getElementById('formFb');

form.addEventListener('submit', async (e) => {

  e.preventDefault();

  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const message = form.message.value.trim();

  if (!name || !email || !message) {

    fb.textContent = '⚠ Please fill in all fields.';
    fb.className = 'form-fb err';

    return;
  }

  sendBtn.textContent = 'Sending...';
  sendBtn.disabled = true;

  try {

    const res = await fetch('/api/contact/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name,
        email,
        message
      })
    });

    const data = await res.json();

    if (res.ok && data.success) {

      fb.textContent = '✅ Message sent! I’ll get back to you soon.';
      fb.className = 'form-fb ok';

      form.reset();

    } else {

      throw new Error(data.error || 'Error');
    }

  } catch (err) {

    fb.textContent =
      '❌ Could not send. Email me: rahilkoshti296@gmail.com';

    fb.className = 'form-fb err';
  }

  sendBtn.textContent = 'SEND MESSAGE';
  sendBtn.disabled = false;
});