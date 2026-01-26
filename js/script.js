document.addEventListener('DOMContentLoaded', () => {

    /* -------------------------------------------------------------------------- */
    /*                               Mobile Navigation                             */
    /* -------------------------------------------------------------------------- */
    const navToggle = document.querySelector('.nav-toggle');
    const nav = document.querySelector('.nav');
    const navLinks = document.querySelectorAll('.nav__link');

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            nav.classList.toggle('nav--open');
            navToggle.classList.toggle('active');

            // Basic styles for mobile menu when open
            if (nav.classList.contains('nav--open')) {
                Object.assign(nav.style, {
                    display: 'block',
                    position: 'absolute',
                    top: '100%',
                    left: '0',
                    width: '100%',
                    background: 'var(--color-bg-primary)',
                    padding: '2rem',
                    boxShadow: '0 10px 20px rgba(0,0,0,0.05)',
                    textAlign: 'center'
                });

                // Stack items
                document.querySelector('.nav__list').style.display = 'flex';
                document.querySelector('.nav__list').style.flexDirection = 'column';
                document.querySelector('.nav__list').style.gap = '2rem';

            } else {
                // Reset styles
                nav.style = '';
                document.querySelector('.nav__list').style = '';
            }
        });
    }

    // Close mobile menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (nav.classList.contains('nav--open')) {
                navToggle.click(); // Trigger close
            }
        });
    });


    /* -------------------------------------------------------------------------- */
    /*                               Smooth Scroll                                 */
    /* -------------------------------------------------------------------------- */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            e.preventDefault();
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                // Offset for fixed header
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });


    /* -------------------------------------------------------------------------- */
    /*                               Scroll Animations                             */
    /* -------------------------------------------------------------------------- */
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.fade-in-up');
    animatedElements.forEach(el => observer.observe(el));


    /* -------------------------------------------------------------------------- */
    /*                               Contact Form AJAX                             */
    /* -------------------------------------------------------------------------- */
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', async function (event) {
            event.preventDefault();

            const form = event.target;
            const data = new FormData(form);
            const action = form.action;

            if (action.includes('YOUR_FORMSPREE_ID')) {
                formStatus.textContent = "Veuillez configurer votre ID Formspree dans le code HTML (action='...').";
                formStatus.className = 'form-status error';
                formStatus.style.display = 'block';
                return;
            }

            formStatus.textContent = "Envoi en cours...";
            formStatus.className = 'form-status';
            formStatus.style.display = 'block';

            try {
                const response = await fetch(action, {
                    method: form.method,
                    body: data,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    formStatus.textContent = "Merci ! Votre message a bien été envoyé.";
                    formStatus.className = 'form-status success';
                    form.reset();
                } else {
                    const jsonData = await response.json();
                    if (Object.hasOwn(jsonData, 'errors')) {
                        formStatus.textContent = jsonData["errors"].map(error => error["message"]).join(", ");
                    } else {
                        formStatus.textContent = "Oups ! Une erreur s'est produite lors de l'envoi.";
                    }
                    formStatus.className = 'form-status error';
                }
            } catch (error) {
                formStatus.textContent = "Oups ! Une erreur s'est produite. Vérifiez votre connexion.";
                formStatus.className = 'form-status error';
            }
        });
    }

});
