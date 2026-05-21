// 1. Estilos globales y de componentes
import './style.css'; 
import './components/header/header.css';
import './components/footer/footer.css';

// 2. Importación de HTML en bruto
import headerHtml from './components/header/header.html?raw';
import footerHtml from './components/footer/footer.html?raw';

// 3. Inyección directa e inmediata
// Como es un módulo de Vite, el DOM ya está disponible aquí mismo.
const headerSlot = document.getElementById('global-header');
const footerSlot = document.getElementById('global-footer');

if (headerSlot) {
    headerSlot.innerHTML = headerHtml;
    initHamburger(); // Inicializa el menú hamburguesa tras inyectar el header
}

if (footerSlot) {
    footerSlot.innerHTML = footerHtml;
}

// ==========================================================================
// INICIALIZACIÓN DEL MENÚ HAMBURGUESA
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
// SISTEMA DE ANIMACIONES AL HACER SCROLL (INTERSECTION OBSERVER)
// ==========================================================================

// 1. Configuramos el "radar" del navegador
const observerOptions = {
    root: null,         // Usa la ventana gráfica (viewport)
    rootMargin: '0px',  // Sin márgenes extra
    threshold: 0.3      // Se dispara cuando el 30% de la sección es visible
};

// 2. Creamos el observador
const scrollObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        // Si el elemento entra en la pantalla...
        if (entry.isIntersecting) {
            // Le añadimos la clase que dispara el CSS
            entry.target.classList.add('is-visible');
            
            // Opcional: Dejamos de observarlo para que la animación solo ocurra la primera vez
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// 3. Le decimos al observador a qué elementos debe vigilar
// En este caso, vigilamos la sección de introducción
const seccionIntroduccion = document.querySelector('.introduccion');

if (seccionIntroduccion) {
    scrollObserver.observe(seccionIntroduccion);
}

// 3. Le decimos al observador a qué elementos debe vigilar
// Vigilamos la intro (que tiene su propia lógica de CSS) y todos los elementos .scroll-anim
const elementosAObservar = document.querySelectorAll('.introduccion, .scroll-anim, .habilidades-home');

elementosAObservar.forEach(elemento => {
    scrollObserver.observe(elemento);
});


// ==========================================================================
// SISTEMA DEL CARRUSEL "QUIÉN SOY"
// ==========================================================================
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
let currentSlide = 0;
let slideInterval;

function initSlider() {
    if (slides.length === 0) return;

    // Función para cambiar de diapositiva
    const goToSlide = (index) => {
        // Quitamos la clase activa a todos
        slides.forEach(slide => slide.classList.remove('activa'));
        dots.forEach(dot => dot.classList.remove('activo'));

        // Se la ponemos al actual
        slides[index].classList.add('activa');
        dots[index].classList.add('activo');
        currentSlide = index;
    };

    // Eventos click para los puntos
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToSlide(index);
            resetInterval(); // Reinicia el temporizador si el usuario hace clic
        });
    });

    // Función de autoplay
    const nextSlide = () => {
        let next = (currentSlide + 1) % slides.length;
        goToSlide(next);
    };

    // Control del temporizador (cambia cada 6 segundos)
    const startInterval = () => {
        slideInterval = setInterval(nextSlide, 6000);
    };

    const resetInterval = () => {
        clearInterval(slideInterval);
        startInterval();
    };

    // Iniciar
    startInterval();
}


// Ejecutamos el slider
initSlider();


// ==========================================================================
// SISTEMA DE ANIMACIONES AL HACER SCROLL (ENCAPSULADO)
// ==========================================================================
function initScrollAnimations() {
    const elementosAObservar = document.querySelectorAll('.introduccion, .scroll-anim');
    
    // Si no hay elementos para animar en esta página, salimos sin hacer nada
    if (elementosAObservar.length === 0) return;

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Animación única
            }
        });
    }, observerOptions);

    // Activamos el radar para cada elemento encontrado
    elementosAObservar.forEach(elemento => {
        scrollObserver.observe(elemento);
    });
}

// Comprobación de seguridad para ejecutar las animaciones inmediatamente si el DOM ya está listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrollAnimations);
} else {
    initScrollAnimations();
}

// ==========================================================================
// SISTEMA DE FILTRADO PARA LA PÁGINA DE FORMACIÓN
// ==========================================================================
function initFormacionFilters() {
    const botonesFiltro = document.querySelectorAll('.filtro-btn');
    const tarjetasTimeline = document.querySelectorAll('.tl-item');

    if (botonesFiltro.length === 0 || tarjetasTimeline.length === 0) return;

    botonesFiltro.forEach(boton => {
        boton.addEventListener('click', () => {
            // 1. Cambiar estado activo en los botones
            botonesFiltro.forEach(btn => btn.classList.remove('activo'));
            boton.classList.add('activo');

            // 2. Filtrar las tarjetas con animación
            const filtroSeleccionado = boton.getAttribute('data-filtro');

            tarjetasTimeline.forEach(tarjeta => {
                const categoriaTarjeta = tarjeta.getAttribute('data-categoria');

                if (filtroSeleccionado === 'todo' || categoriaTarjeta === filtroSeleccionado) {
                    tarjeta.classList.remove('oculto');
                } else {
                    tarjeta.classList.add('oculto');
                }
            });
        });
    });
}

// Lo lanzamos de manera segura al cargar el DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFormacionFilters);
} else {
    initFormacionFilters();
}

// ==========================================================================
// SISTEMA DE NAVEGACIÓN INTELIGENTE (RESALTADO ACTIVO)
// ==========================================================================
function actualizarMenuActivo() {
    // 1. Obtenemos la ruta actual (ej: /formacion.html)
    const rutaActual = window.location.pathname;
    
    // 2. Seleccionamos todos los enlaces dentro del header
    const enlacesMenu = document.querySelectorAll('header a');
    
    if (enlacesMenu.length === 0) return;

    // 3. Limpiamos cualquier clase 'activo' que venga por defecto
    enlacesMenu.forEach(enlace => enlace.classList.remove('activo'));

    // 4. Comprobamos la página y asignamos la clase
    enlacesMenu.forEach(enlace => {
        const href = enlace.getAttribute('href');
        if (!href) return;

        // Si estamos en la raíz o index.html
        if (rutaActual.endsWith('/') || rutaActual.endsWith('index.html')) {
            if (href === 'index.html' || href === './' || href === '/') {
                enlace.classList.add('activo');
            }
        } 
        // Si la URL actual contiene el href de este enlace (ej. formacion.html)
        else if (rutaActual.includes(href)) {
            enlace.classList.add('activo');
        }
    });
}

// Ejecutamos la función inmediatamente ahora que el header ha sido inyectado
actualizarMenuActivo();

// ============================================================================
// TRANSICIÓN FLUIDA DE CONTENIDO (ESTRUCTURA FIJA)
// ============================================================================
function initPageTransitions() {
    const mainContenido = document.querySelector('main');
    if (!mainContenido) return;

    // 1. ENTRADA: Desvanecer solo el main hacia adentro
    requestAnimationFrame(() => {
        mainContenido.classList.add('contenido-cargado');
    });

    // 2. SALIDA: Interceptar clics en los enlaces
    document.addEventListener('click', (e) => {
        const enlace = e.target.closest('a');
        if (!enlace) return;

        const href = enlace.getAttribute('href');
        const target = enlace.getAttribute('target');

        // Filtros de seguridad habituales
        if (
            target === '_blank' || 
            !href || 
            href.startsWith('#') || 
            href.startsWith('mailto:') || 
            href.startsWith('tel:') ||
            e.metaKey || e.ctrlKey
        ) {
            return; 
        }

        e.preventDefault();
        
        // A) Cambiamos el estado activo del menú de forma instantánea para dar feedback táctil
        const enlacesMenu = document.querySelectorAll('header a');
        enlacesMenu.forEach(btn => btn.classList.remove('activo'));
        if (enlace.closest('header')) {
            enlace.classList.add('activo');
        }

        // B) Desvanecemos SOLO el contenido central hacia la oscuridad
        mainContenido.classList.remove('contenido-cargado');
        mainContenido.classList.add('contenido-saliendo');

        // C) Viajamos a la siguiente subpágina tras la animación (300ms)
        setTimeout(() => {
            window.location.href = href;
        }, 300);
    });
}

// Inicialización
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPageTransitions);
} else {
    initPageTransitions();
}
