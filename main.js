// ==========================================================================
// HEADER Y FOOTER — inyección directa (sin Vite, sin imports)
// ==========================================================================
const HEADER_HTML = `<nav>
    <a href="index.html" class="logo">Alex Firvida</a>
    <button class="nav-toggle" aria-label="Abrir menú" aria-expanded="false">
        <span></span><span></span><span></span>
    </button>
    <ul class="nav-links">
        <li><a href="index.html">Inicio</a></li>
        <li><a href="formacion.html">Formación</a></li>
        <li><a href="quien-soy.html">Quién soy</a></li>
        <li><a href="habilidades.html">Habilidades</a></li>
        <li><a href="proyectos.html">Proyectos</a></li>
        <li><a href="aspiraciones.html">Aspiraciones</a></li>
        <li><a href="contacto.html" class="nav-cta">Contacto</a></li>
    </ul>
    <div class="nav-overlay"></div>
</nav>`;

const FOOTER_HTML = `<div class="footer-inner">
    <div class="footer-columns">
        <div class="footer-col-left">
            <a href="index.html" class="footer-logo">Alex Firvida</a>
            <nav class="footer-nav">
                <a href="formacion.html">Formación</a>
                <a href="quien-soy.html">Quién soy</a>
                <a href="habilidades.html">Habilidades</a>
                <a href="proyectos.html">Proyectos</a>
                <a href="aspiraciones.html">Aspiraciones</a>
                <a href="contacto.html">Contacto</a>
            </nav>
        </div>
        <div class="footer-col-right">
            <h4 class="footer-heading">Contacto Directo</h4>
            <div class="footer-contact">
                <a href="tel:+34658733616" class="contact-link">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                    +34 658 73 36 16
                </a>
                <a href="mailto:a.firvidahd@gmail.com" class="contact-link">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                    a.firvidahd@gmail.com
                </a>
            </div>
        </div>
    </div>
    <div class="footer-bottom">
        <p class="footer-copy">&copy; 2026 Alex Firvida — Todos los derechos reservados</p>
    </div>
</div>`;

// Inyectar
const headerSlot = document.getElementById('global-header');
const footerSlot  = document.getElementById('global-footer');
if (headerSlot) headerSlot.innerHTML = HEADER_HTML;
if (footerSlot)  footerSlot.innerHTML = FOOTER_HTML;

// Inicializar todo
initHamburger();
actualizarMenuActivo();
initScrollAnimations();
initSlider();
initFormacionFilters();
initPageTransitions();


// ==========================================================================
// MENÚ HAMBURGUESA
// ==========================================================================
function initHamburger() {
    const toggle   = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    const overlay  = document.querySelector('.nav-overlay');
    if (!toggle || !navLinks) return;

    const openMenu = () => {
        toggle.classList.add('abierto');
        navLinks.classList.add('abierto');
        if (overlay) overlay.classList.add('abierto');
        document.body.style.overflow = 'hidden';
        toggle.setAttribute('aria-expanded', 'true');
    };
    const closeMenu = () => {
        toggle.classList.remove('abierto');
        navLinks.classList.remove('abierto');
        if (overlay) overlay.classList.remove('abierto');
        document.body.style.overflow = '';
        toggle.setAttribute('aria-expanded', 'false');
    };

    toggle.addEventListener('click', () => toggle.classList.contains('abierto') ? closeMenu() : openMenu());
    if (overlay) overlay.addEventListener('click', closeMenu);
    navLinks.querySelectorAll('a').forEach(l => l.addEventListener('click', closeMenu));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
    window.addEventListener('resize', () => { if (window.innerWidth > 900) closeMenu(); });
}


// ==========================================================================
// SCROLL REVEAL
// ==========================================================================
function initScrollAnimations() {
    const elementos = document.querySelectorAll('.introduccion, .scroll-anim, .habilidades-home');
    if (!elementos.length) return;
    const obs = new IntersectionObserver((entries, o) => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-visible'); o.unobserve(e.target); } });
    }, { threshold: 0.15 });
    elementos.forEach(el => obs.observe(el));
}


// ==========================================================================
// CARRUSEL
// ==========================================================================
function initSlider() {
    const slides = document.querySelectorAll('.slide');
    const dots   = document.querySelectorAll('.dot');
    if (!slides.length) return;
    let current = 0, timer;

    const go = i => {
        slides.forEach(s => s.classList.remove('activa'));
        dots.forEach(d => d.classList.remove('activo'));
        slides[i].classList.add('activa');
        if (dots[i]) dots[i].classList.add('activo');
        current = i;
    };
    dots.forEach((d, i) => d.addEventListener('click', () => { go(i); clearInterval(timer); timer = setInterval(() => go((current + 1) % slides.length), 6000); }));
    timer = setInterval(() => go((current + 1) % slides.length), 6000);
}


// ==========================================================================
// FILTROS FORMACIÓN
// ==========================================================================
function initFormacionFilters() {
    const btns = document.querySelectorAll('.filtro-btn');
    const items = document.querySelectorAll('.tl-item');
    if (!btns.length || !items.length) return;
    btns.forEach(b => b.addEventListener('click', () => {
        btns.forEach(x => x.classList.remove('activo'));
        b.classList.add('activo');
        const f = b.dataset.filtro;
        items.forEach(t => t.classList.toggle('oculto', f !== 'todo' && t.dataset.categoria !== f));
    }));
}


// ==========================================================================
// MENÚ ACTIVO
// ==========================================================================
function actualizarMenuActivo() {
    const ruta = window.location.pathname;
    document.querySelectorAll('header a').forEach(a => {
        a.classList.remove('activo');
        const href = a.getAttribute('href');
        if (!href) return;
        const esInicio = ruta.endsWith('/') || ruta.endsWith('index.html');
        if (esInicio && (href === 'index.html' || href === '/' || href === './')) a.classList.add('activo');
        else if (!esInicio && href !== 'index.html' && ruta.includes(href)) a.classList.add('activo');
    });
}


// ==========================================================================
// TRANSICIONES DE PÁGINA
// ==========================================================================
function initPageTransitions() {
    const main = document.querySelector('main');
    if (!main) return;
    requestAnimationFrame(() => main.classList.add('contenido-cargado'));

    document.addEventListener('click', e => {
        const a = e.target.closest('a');
        if (!a) return;
        const href = a.getAttribute('href');
        if (!href || a.target === '_blank' || href.startsWith('#') ||
            href.startsWith('mailto:') || href.startsWith('tel:') ||
            href.startsWith('http') || href.startsWith('//') ||
            e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

        e.preventDefault();
        document.querySelectorAll('header a').forEach(x => x.classList.remove('activo'));
        if (a.closest('header')) a.classList.add('activo');
        main.classList.remove('contenido-cargado');
        main.classList.add('contenido-saliendo');
        setTimeout(() => { window.location.href = href; }, 300);
    });
}
