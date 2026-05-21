// 1. Estilos globales y de componentes
import './style.css'; 
import './components/header/header.css';
import './components/footer/footer.css';

// 2. Importación de HTML en bruto
import headerHtml from './components/header/header.html?raw';
import footerHtml from './components/footer/footer.html?raw';

// 3. Inyección directa e inmediata
const headerSlot = document.getElementById('global-header');
const footerSlot = document.getElementById('global-footer');

if (headerSlot) {
    headerSlot.innerHTML = headerHtml;
    initHamburger();
    actualizarMenuActivo();
}

if (footerSlot) {
    footerSlot.innerHTML = footerHtml;
}

// Inicializar el resto de sistemas
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

    toggle.addEventListener('click', () => {
        toggle.classList.contains('abierto') ? closeMenu() : openMenu();
    });

    if (overlay) overlay.addEventListener('click', closeMenu);
    navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
    window.addEventListener('resize', () => { if (window.innerWidth > 900) closeMenu(); });
}


// ==========================================================================
// SCROLL REVEAL (INTERSECTION OBSERVER)
// ==========================================================================
function initScrollAnimations() {
    const elementos = document.querySelectorAll('.introduccion, .scroll-anim, .habilidades-home');
    if (elementos.length === 0) return;

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                obs.unobserve(entry.target);
            }
        });
    }, { root: null, rootMargin: '0px', threshold: 0.15 });

    elementos.forEach(el => observer.observe(el));
}


// ==========================================================================
// CARRUSEL "QUIÉN SOY"
// ==========================================================================
function initSlider() {
    const slides = document.querySelectorAll('.slide');
    const dots   = document.querySelectorAll('.dot');
    if (slides.length === 0) return;

    let currentSlide = 0;
    let slideInterval;

    const goToSlide = (index) => {
        slides.forEach(s => s.classList.remove('activa'));
        dots.forEach(d => d.classList.remove('activo'));
        slides[index].classList.add('activa');
        if (dots[index]) dots[index].classList.add('activo');
        currentSlide = index;
    };

    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            goToSlide(i);
            clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, 6000);
        });
    });

    const nextSlide = () => goToSlide((currentSlide + 1) % slides.length);

    slideInterval = setInterval(nextSlide, 6000);
}


// ==========================================================================
// FILTROS DE FORMACIÓN
// ==========================================================================
function initFormacionFilters() {
    const botones  = document.querySelectorAll('.filtro-btn');
    const tarjetas = document.querySelectorAll('.tl-item');
    if (botones.length === 0 || tarjetas.length === 0) return;

    botones.forEach(boton => {
        boton.addEventListener('click', () => {
            botones.forEach(b => b.classList.remove('activo'));
            boton.classList.add('activo');

            const filtro = boton.getAttribute('data-filtro');
            tarjetas.forEach(t => {
                const cat = t.getAttribute('data-categoria');
                t.classList.toggle('oculto', filtro !== 'todo' && cat !== filtro);
            });
        });
    });
}


// ==========================================================================
// NAVEGACIÓN ACTIVA
// ==========================================================================
function actualizarMenuActivo() {
    const rutaActual  = window.location.pathname;
    const enlaces     = document.querySelectorAll('header a');
    if (enlaces.length === 0) return;

    enlaces.forEach(enlace => enlace.classList.remove('activo'));

    enlaces.forEach(enlace => {
        const href = enlace.getAttribute('href');
        if (!href) return;

        const esInicio = rutaActual.endsWith('/') || rutaActual.endsWith('index.html');
        if (esInicio && (href === 'index.html' || href === './' || href === '/')) {
            enlace.classList.add('activo');
        } else if (!esInicio && href !== 'index.html' && rutaActual.includes(href)) {
            enlace.classList.add('activo');
        }
    });
}


// ==========================================================================
// TRANSICIONES DE PÁGINA
// ==========================================================================
function initPageTransitions() {
    const main = document.querySelector('main');
    if (!main) return;

    // Entrada suave al cargar
    requestAnimationFrame(() => main.classList.add('contenido-cargado'));

    document.addEventListener('click', (e) => {
        const enlace = e.target.closest('a');
        if (!enlace) return;

        const href   = enlace.getAttribute('href');
        const target = enlace.getAttribute('target');

        // Dejar pasar: sin href, externa, ancla, protocolo especial, o tecla modificadora
        if (
            !href ||
            target === '_blank' ||
            href.startsWith('#') ||
            href.startsWith('mailto:') ||
            href.startsWith('tel:') ||
            href.startsWith('http://') ||
            href.startsWith('https://') ||
            href.startsWith('//') ||
            e.metaKey || e.ctrlKey || e.shiftKey || e.altKey
        ) return;

        e.preventDefault();

        // Feedback visual en el menú
        document.querySelectorAll('header a').forEach(a => a.classList.remove('activo'));
        if (enlace.closest('header')) enlace.classList.add('activo');

        // Desvanecer contenido y navegar
        main.classList.remove('contenido-cargado');
        main.classList.add('contenido-saliendo');

        setTimeout(() => { window.location.href = href; }, 300);
    });
}
