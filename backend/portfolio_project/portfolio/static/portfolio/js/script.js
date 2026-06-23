/* ── Theme ── */
const body = document.body;
const themeBtn = document.getElementById('themeBtn');
// Always start in light mode — no localStorage
body.className = 'light';
themeBtn.addEventListener('click', () => {
  body.className = body.className === 'dark' ? 'light' : 'dark';
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
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nl");

window.addEventListener("scroll", () => {

  let current = "";

  sections.forEach(section => {

    const sectionTop = section.offsetTop - 140;
    const sectionHeight = section.offsetHeight;

    if (window.scrollY >= sectionTop &&
        window.scrollY < sectionTop + sectionHeight) {

      current = section.getAttribute("id");
    }
  });

  navLinks.forEach(link => {
    link.classList.remove("active");

    if (link.dataset.s === current) {
      link.classList.add("active");
    }
  });

});

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

/* ══════════════════════════════════════
   AI CHATBOT - Add this to END of script.js
══════════════════════════════════════ */
/* ══════════════════════════════════════
   AI CHATBOT
══════════════════════════════════════ */

document.addEventListener("DOMContentLoaded", function () {

  const widget = document.getElementById("chatWidget");
  const toggle = document.getElementById("chatToggle");
  const closeBtn = document.getElementById("chatCloseBtn");
  const messages = document.getElementById("chatMessages");
  const input = document.getElementById("chatInput");
  const sendBtn = document.getElementById("chatSend");

  if (!widget || !toggle || !closeBtn || !messages || !input || !sendBtn) {
    console.error("Chatbot elements not found");
    return;
  }

  function openChat() {
    widget.classList.add("open");
    input.focus();
  }

  function closeChat() {
    widget.classList.remove("open");
  }

  toggle.addEventListener("click", function () {
    widget.classList.toggle("open");
  });

  closeBtn.addEventListener("click", closeChat);

  function addMessage(text, role) {
    const msg = document.createElement("div");
    msg.className = `chat-msg ${role}`;

    msg.innerHTML = `
      <div class="msg-avatar">${role === "bot" ? "🤖" : "👤"}</div>
      <div class="msg-bubble">${text}</div>
    `;

    messages.appendChild(msg);
    messages.scrollTop = messages.scrollHeight;
  }

  async function sendMessage(text) {
    const trimmed = text.trim();

    if (!trimmed) return;

    input.value = "";
    addMessage(trimmed, "user");

    try {

      const res = await fetch("https://YOUR_BACKEND_URL/api/chat/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: trimmed
        })
      });

      const data = await res.json();

      addMessage(
        data.reply || "Sorry, I couldn't generate a response.",
        "bot"
      );

    } catch (e) {
      addMessage("Connection error.", "bot");
      console.error(e);
    }
  }

  sendBtn.addEventListener("click", () => {
    sendMessage(input.value);
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage(input.value);
    }
  });

  window.sendQuick = function (text) {
    openChat();
    sendMessage(text);
  };

});