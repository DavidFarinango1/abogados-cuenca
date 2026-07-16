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

// ===== La portada reutiliza los bloques de Valores y Servicios =====
// Se clonan desde su pestaña para no duplicar el contenido en el HTML.
const CLONES = {
  valores: '[data-page="valores"] .values',
  servicios: '[data-page="servicios"] .cards',
};
Object.entries(CLONES).forEach(([nombre, selector]) => {
  const destino = document.querySelector(`[data-clone="${nombre}"]`);
  const origen = document.querySelector(selector);
  if (!destino || !origen) return;

  const copia = origen.cloneNode(true);

  // En la portada las tarjetas de servicios van solo con la foto y el nombre del área:
  // el listado de cada área se muestra en la pestaña Servicios.
  if (nombre === 'servicios') {
    copia.classList.add('cards-compact');
    copia.querySelectorAll('.card-list').forEach(lista => lista.remove());
  }

  destino.appendChild(copia);
});

// ===== Elementos con animación de entrada =====
document
  .querySelectorAll('.section-head, .card, .col-media, .col-text, .cta-inner, .mv-card, .value, .why, .grid-list, .quick-card, .gallery-grid')
  .forEach(el => el.classList.add('reveal'));

// ===== Header sólido al hacer scroll =====
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// ===== Menú móvil =====
navToggle.addEventListener('click', () => nav.classList.toggle('open'));

// ===== Formulario → correo (FormSubmit) =====
// El envío lo hace el propio <form> por POST; aquí solo damos feedback al usuario.
const contactForm = document.getElementById('contactForm');
contactForm.addEventListener('submit', () => {
  const boton = contactForm.querySelector('button[type="submit"]');
  boton.disabled = true;
  boton.textContent = 'Enviando…';
});

// ===== Año en el footer =====
document.getElementById('year').textContent = new Date().getFullYear();

// ===== Arranque =====
routeFromHash();
