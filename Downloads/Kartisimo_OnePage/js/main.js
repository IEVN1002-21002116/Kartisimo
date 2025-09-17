document.addEventListener('DOMContentLoaded', () => {

    /* ==================== LÓGICA DEL MENÚ DE NAVEGACIÓN ==================== */
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');
    const navClose = document.getElementById('nav-close');

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.add('show-menu');
        });
    }

    if (navClose) {
        navClose.addEventListener('click', () => {
            navMenu.classList.remove('show-menu');
        });
    }

    document.querySelectorAll('.nav__link').forEach(link =>
        link.addEventListener('click', () => {
            if (navMenu) navMenu.classList.remove('show-menu');
        })
    );

    /* ==================== MOSTRAR BOTÓN "SCROLL UP" ==================== */
    const scrollUp = () => {
        const btn = document.getElementById('scroll-up');
        if (btn) {
            if (window.scrollY >= 350) btn.classList.add('show-scroll');
            else btn.classList.remove('show-scroll');
        }
    };
    window.addEventListener('scroll', scrollUp);

    /* ==================== ENLACE ACTIVO EN MENÚ SEGÚN SECCIÓN VISIBLE ==================== */
    const sections = document.querySelectorAll('section[id]');
    const scrollActive = () => {
        const scrollY = window.scrollY;
        sections.forEach(sec => {
            const top = sec.offsetTop - 58;
            const height = sec.offsetHeight;
            const id = sec.getAttribute('id');
            const link = document.querySelector(`.nav__menu a[href*="${id}"]`);

            if (link) {
                if (scrollY > top && scrollY <= top + height) {
                    link.classList.add('active-link');
                } else {
                    link.classList.remove('active-link');
                }
            }
        });
    };
    window.addEventListener('scroll', scrollActive);

    /* ==================== SLIDER PREMIUM CON GSAP (SECCIÓN HERO) ==================== */
    const homeSection = document.getElementById('home');
    if (homeSection && homeSection.classList.contains('slider-container')) {
        const slides = homeSection.querySelectorAll(".slide");
        const indicatorsContainer = homeSection.querySelector(".slide-indicators");
        let currentSlide = 0;
        let isAnimating = false;
        let autoplayInterval = null;
        const AUTOPLAY_DURATION = 4000; // 7 segundos

        // Inicia el autoplay
        function startAutoplay() {
            clearInterval(autoplayInterval); // Limpia cualquier intervalo anterior
            autoplayInterval = setInterval(() => {
                const nextSlide = (currentSlide + 1) % slides.length;
                goToSlide(nextSlide);
            }, AUTOPLAY_DURATION);
        }

        // Detiene el autoplay
        function stopAutoplay() {
            clearInterval(autoplayInterval);
        }

        function initSlider() {
            slides.forEach((slide, index) => {
                const indicator = document.createElement("div");
                indicator.classList.add("indicator");
                indicator.textContent = `0${index + 1}`;
                indicator.setAttribute("data-slide", index);
                if (index === 0) indicator.classList.add("active");
                indicatorsContainer.appendChild(indicator);

                const bgUrl = slide.getAttribute('data-bg');
                gsap.set(slide, { backgroundImage: `url(${bgUrl})` });
            });

            gsap.set(slides, { autoAlpha: 0 });
            gsap.set(slides[0], { autoAlpha: 1 });
            gsap.from(slides[0], { scale: 1.1, duration: 1, ease: "power2.out" });

            gsap.from(slides[0].querySelectorAll(".slide-content > *"), {
                y: 50,
                opacity: 0,
                duration: 1,
                stagger: 0.1,
                ease: "power2.out",
                delay: 0.5
            });

            const uiElements = ['.left-nav', '.right-nav'];
            gsap.from(uiElements, {
                y: -30,
                opacity: 0,
                duration: 1,
                stagger: 0.1,
                ease: "power2.out"
            });
            
            startAutoplay(); // Inicia el autoplay al cargar
        }

        function goToSlide(slideNumber) {
            if (isAnimating || slideNumber === currentSlide) return;
            isAnimating = true;

            const outgoingSlide = slides[currentSlide];
            const incomingSlide = slides[slideNumber];

            document.querySelector('.indicator.active').classList.remove('active');
            document.querySelector(`.indicator[data-slide="${slideNumber}"]`).classList.add('active');

            const tl = gsap.timeline({
                onComplete: () => {
                    isAnimating = false;
                }
            });

            tl.to(outgoingSlide.querySelectorAll(".slide-content > *"), {
                y: -50,
                opacity: 0,
                duration: 0.8,
                stagger: 0.05,
                ease: "power2.in"
            })
            .to(outgoingSlide, { 
                scale: 1.1, 
                autoAlpha: 0, 
                duration: 1.2, 
                ease: "power2.inOut"
            }, "-=0.5")
            .set(incomingSlide, { autoAlpha: 1 })
            .from(incomingSlide, {
                scale: 1.1,
                duration: 1.2,
                ease: "power2.out"
            }, "-=1.2")
            // **LA CORRECCIÓN ESTÁ AQUÍ**
            // Usamos fromTo para asegurar que la animación siempre vaya de invisible a visible.
            .fromTo(incomingSlide.querySelectorAll(".slide-content > *"), 
            { // From
                y: 50,
                opacity: 0,
            },
            { // To
                y: 0,
                opacity: 1,
                duration: 1,
                stagger: 0.1,
                ease: "power2.out"
            }, "-=0.8");

            currentSlide = slideNumber;
        }

        indicatorsContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('indicator')) {
                stopAutoplay(); // Detiene el autoplay en la interacción manual
                const slideIndex = parseInt(e.target.getAttribute('data-slide'));
                goToSlide(slideIndex);
                startAutoplay(); // Reinicia el temporizador después de la navegación manual
            }
        });
        
        initSlider();
    }

    /* ==================== ANIMACIONES CON SCROLLREVEAL ==================== */
    if (typeof ScrollReveal !== 'undefined') {
        const sr = ScrollReveal({
            distance: '40px',
            duration: 700,
            easing: 'cubic-bezier(.22,.95,.36,1)',
            reset: false,
            viewOffset: { top: 60, right: 0, bottom: 60, left: 0 }
        });

        sr.reveal('.section__title', { origin: 'bottom', interval: 80, delay: 120 });
        sr.reveal('.about__data, .about__video', { origin: 'left', distance: '30px', delay: 140 });
        sr.reveal('.models__card', { origin: 'bottom', interval: 120, delay: 160 });
        sr.reveal('.info__group', { origin: 'bottom', interval: 120, delay: 200 });
        sr.reveal('.footer__container', { origin: 'bottom', delay: 220 });
    }

    /* ==================== ANIMACIONES CON INTERSECTIONOBSERVER ==================== */
    const observerOptions = { threshold: 0.12 };
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.models__card, .info__group').forEach(el => revealObserver.observe(el));

    const footer = document.querySelector('.footer');
    if (footer) {
        const footObs = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) footer.classList.add('is-visible');
            });
        }, { threshold: 0.05 });
        footObs.observe(footer);
    }
});

