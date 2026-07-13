// ===== Abogados Cuenca — interacciones =====

const header = document.getElementById('header');
const nav = document.getElementById('nav');
const navToggle = document.getElementById('navToggle');
const navLinks = [...document.querySelectorAll('.nav-link')];
const pages = [...document.querySelectorAll('.page')];
const PAGES = pages.map(p => p.dataset.page);
const HOME = 'inicio';

// ===== Navegación por pestañas =====
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.12 });

function showPage(name) {
  const target = PAGES.includes(name) ? name : HOME;

  pages.forEach(page => {
    const active = page.dataset.page === target;
    page.classList.toggle('active', active);

    if (active) {
      // reinicia la animación de entrada en cada visita a la pestaña
      page.querySelectorAll('.reveal').forEach(el => {
        el.classList.remove('visible');
        revealObserver.observe(el);
      });
    }
  });

  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${target}`);
  });

  window.scrollTo(0, 0);
}

function routeFromHash() {
  showPage((location.hash || '').replace('#', '') || HOME);
}

window.addEventListener('hashchange', routeFromHash);

// Cualquier enlace interno (#seccion) cambia de pestaña
document.addEventListener('click', e => {
  const link = e.target.closest('a[href^="#"]');
  if (!link) return;
  const name = link.getAttribute('href').slice(1);
  if (!PAGES.includes(name)) return;

  e.preventDefault();
  nav.classList.remove('open');
  if (location.hash.slice(1) === name) showPage(name);
  else location.hash = name;
});

// ===== Elementos con animación de entrada =====
document
  .querySelectorAll('.section-head, .card, .col-media, .col-text, .cta-inner, .mv-card, .value, .why, .grid-list')
  .forEach(el => el.classList.add('reveal'));

// ===== Header sólido al hacer scroll =====
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// ===== Menú móvil =====
navToggle.addEventListener('click', () => nav.classList.toggle('open'));

// ===== Formulario → WhatsApp =====
const WHATSAPP = '593987246498';
document.getElementById('contactForm').addEventListener('submit', e => {
  e.preventDefault();
  const data = new FormData(e.target);
  const texto =
    `Hola Dr. Luis Mora, soy ${data.get('nombre')}.\n` +
    `Teléfono: ${data.get('telefono')}\n` +
    `Área: ${data.get('servicio')}\n` +
    `Mensaje: ${data.get('mensaje') || 'Quisiera una consulta.'}`;
  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(texto)}`, '_blank');
});

// ===== Año en el footer =====
document.getElementById('year').textContent = new Date().getFullYear();

// ===== Arranque =====
routeFromHash();
