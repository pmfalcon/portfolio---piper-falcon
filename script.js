/* =========================================================
   BOOT SEQUENCE
========================================================= */
const bootScreen = document.getElementById('boot-screen');
const skipBtn = document.getElementById('skip-boot');

function endBoot(){
  bootScreen.classList.add('hidden');
  document.body.style.overflow = 'auto';
}
setTimeout(endBoot, 5600);
skipBtn.addEventListener('click', endBoot);
document.body.style.overflow = 'hidden';


/* =========================================================
   HUD CLOCK + FAKE SIGNAL
========================================================= */
const clockEl = document.getElementById('clock');
const footerClockEl = document.getElementById('footer-clock');
const sigEl = document.getElementById('sig');

function updateClock(){
  const now = new Date();
  const str = now.toTimeString().slice(0,8);
  clockEl.textContent = str;
  footerClockEl.textContent = 'LOCAL_TIME :: ' + str;
}
updateClock();
setInterval(updateClock, 1000);

setInterval(() => {
  sigEl.textContent = 78 + Math.floor(Math.random() * 15);
}, 2200);


/* =========================================================
   CUSTOM CURSOR
========================================================= */
const cursorDot = document.querySelector('.cursor-dot');
const cursorRing = document.querySelector('.cursor-ring');
let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

window.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorDot.style.left = mouseX + 'px';
  cursorDot.style.top = mouseY + 'px';
});

function animateRing(){
  ringX += (mouseX - ringX) * 0.18;
  ringY += (mouseY - ringY) * 0.18;
  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top = ringY + 'px';
  requestAnimationFrame(animateRing);
}
animateRing();

document.querySelectorAll('[data-hover]').forEach(el => {
  el.addEventListener('mouseenter', () => cursorRing.classList.add('active'));
  el.addEventListener('mouseleave', () => cursorRing.classList.remove('active'));
});


/* =========================================================
   NAV BURGER (MOBILE)
========================================================= */
const burger = document.getElementById('nav-burger');
const navLinks = document.querySelector('.nav-links');
burger.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => navLinks.classList.remove('open'))
);


/* =========================================================
   PROJECT DATA — EDIT THIS ARRAY WITH YOUR OWN WORK
========================================================= */
const projects = [
  {
    id: 1,
    title: 'CHROMA_FIELD',
    year: '2025',
    category: 'INSTALLATION',
    client: 'Museo de Arte Moderno',
    tool: 'TouchDesigner + Kinect',
    type: 'Interactive installation',
    tags: ['GENERATIVE', 'REAL-TIME', 'SENSOR'],
    desc: 'A room-scale particle field that reshapes itself around visitors in real time, driven by depth-sensor input and a custom GLSL flow-field shader. Exhibited for three months as part of a group show on perception and presence.'
  },
  {
    id: 2,
    title: 'NO_JARDIN',
    year: '2024',
    category: 'PROJECTION_MAPPING',
    client: 'Banco de la República',
    tool: 'Notch + Resolume',
    type: 'Public art / projection',
    tags: ['MAPPING', 'BOTANICAL', 'PUBLIC_ART'],
    desc: 'A projection-mapped botanical dreamscape wrapped around a historic courtyard facade, blending hand-painted textures with generative growth simulations that responded to the evening wind data in real time.'
  },
  {
    id: 3,
    title: 'CYBERDOLLS',
    year: '2024',
    category: 'REAL-TIME_3D',
    client: 'Self-directed',
    tool: 'Blender + Unreal Engine 5',
    type: '3D character series',
    tags: ['3D_MODELING', 'RIGGING', 'REAL-TIME'],
    desc: 'A series of six fully rigged synthetic performers, built for real-time rendering and motion capture. Explores identity and artifice through a low-poly, high-chrome aesthetic rendered live at 60fps.'
  },
  {
    id: 4,
    title: 'MOLAS_360',
    year: '2023',
    category: 'INSTALLATION',
    client: 'Volarte Foundation',
    tool: 'TouchDesigner + LED',
    type: '360° LED installation',
    tags: ['LED', 'PATTERN', 'CULTURE'],
    desc: 'A full-surround LED environment translating traditional Guna mola textile patterns into generative, ever-shifting light compositions — a dialogue between ancestral craft and computational color theory.'
  },
  {
    id: 5,
    title: 'GHOST_SIGNAL',
    year: '2023',
    category: 'AUDIO_VISUAL',
    client: 'Festival Estéreo Picnic',
    tool: 'TouchDesigner + Ableton',
    type: 'Live AV performance',
    tags: ['AUDIO-REACTIVE', 'LIVE', 'GLSL'],
    desc: 'A 40-minute audio-reactive visual set built from custom GLSL shaders, performed live alongside a modular synth set. Every frame generated in real time — nothing pre-rendered.'
  },
  {
    id: 6,
    title: 'SYNTH_TERRAIN',
    year: '2022',
    category: 'GENERATIVE_ART',
    client: 'Self-directed',
    tool: 'Three.js + WebGL',
    type: 'Web-based generative art',
    tags: ['WEBGL', 'PROCEDURAL', 'BROWSER'],
    desc: 'A browser-based procedural landscape generator — the same dithered isometric terrain technique used in the background of this very site, extended into an explorable infinite world.'
  }
];

const worksGrid = document.getElementById('works-grid');

projects.forEach(p => {
  const card = document.createElement('article');
  card.className = 'work-card';
  card.setAttribute('data-hover', '');
  card.innerHTML = `
    <div class="work-card-top">
      <span>${p.year}</span>
      <span>${p.category}</span>
    </div>
    <h3>${p.title}</h3>
    <p>${p.type}</p>
    <div class="work-card-tags">
      ${p.tags.map(t => `<span>${t}</span>`).join('')}
    </div>
  `;
  card.addEventListener('click', () => openModal(p));

  // subtle mouse-tilt parallax
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(600px) rotateX(${y * -6}deg) rotateY(${x * 6}deg) translateZ(4px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(600px) rotateX(0) rotateY(0)';
  });

  worksGrid.appendChild(card);
});


/* =========================================================
   PROJECT MODAL
========================================================= */
const modal = document.getElementById('project-modal');

function openModal(p){
  document.getElementById('modal-year').textContent = p.year;
  document.getElementById('modal-category').textContent = p.category;
  document.getElementById('modal-title').textContent = p.title;
  document.getElementById('modal-client').textContent = p.client;
  document.getElementById('modal-tool').textContent = p.tool;
  document.getElementById('modal-type').textContent = p.type;
  document.getElementById('modal-desc').textContent = p.desc;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModal(){
  modal.classList.remove('open');
  document.body.style.overflow = 'auto';
}
document.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', closeModal));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });


/* =========================================================
   CONTACT FORM (front-end only — wire up to your backend/
   form service of choice, e.g. Formspree, Netlify Forms, etc.)
========================================================= */
const form = document.getElementById('contact-form');
const formResponse = document.getElementById('form-response');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  formResponse.textContent = '> transmitting...';
  setTimeout(() => {
    formResponse.textContent = '> message received. status: 200_OK. I will reply soon.';
    form.reset();
  }, 900);
});


/* =========================================================
   STAT COUNT-UP ON SCROLL
========================================================= */
const stats = document.querySelectorAll('.stat-num');
const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting){
      const el = entry.target;
      const target = parseInt(el.getAttribute('data-count'), 10);
      let current = 0;
      const step = Math.max(1, Math.round(target / 40));
      const tick = () => {
        current += step;
        if (current >= target){ el.textContent = target; return; }
        el.textContent = current;
        requestAnimationFrame(tick);
      };
      tick();
      statObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });
stats.forEach(el => statObserver.observe(el));


/* =========================================================
   BACKGROUND: ANIMATED ISOMETRIC DOT TERRAIN
========================================================= */
const canvas = document.getElementById('terrain');
const ctx = canvas.getContext('2d');
let W, H, t = 0;

function resize(){
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

const COLS = 40;
const ROWS = 22;
const SPACING = 34;

function noise2D(x, y, t){
  return (
    Math.sin(x * 0.15 + t) * Math.cos(y * 0.15 + t * 0.6) +
    Math.sin((x + y) * 0.08 - t * 0.4)
  ) * 0.5;
}

function drawTerrain(){
  ctx.clearRect(0, 0, W, H);
  const originX = W / 2;
  const originY = H * 0.32;

  for (let row = 0; row < ROWS; row++){
    for (let col = 0; col < COLS; col++){
      const gx = col - COLS / 2;
      const gy = row - ROWS / 2;

      const elevation = noise2D(gx, gy, t) * 26;

      // isometric projection
      const screenX = originX + (gx - gy) * (SPACING * 0.86);
      const screenY = originY + (gx + gy) * (SPACING * 0.43) - elevation;

      if (screenX < -40 || screenX > W + 40 || screenY < -40 || screenY > H + 40) continue;

      const alpha = 0.15 + Math.max(0, (elevation + 26) / 52) * 0.45;
      const size = 1 + Math.max(0, (elevation + 26) / 52) * 1.6;

      ctx.beginPath();
      ctx.fillStyle = `rgba(255,176,0,${alpha.toFixed(2)})`;
      ctx.arc(screenX, screenY, size, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  t += 0.006;
  requestAnimationFrame(drawTerrain);
}
drawTerrain();
