// Intersection Observer for Scroll Animations
document.addEventListener("DOMContentLoaded", () => {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.05
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, observerOptions);

    const elementsToAnimate = document.querySelectorAll(
        '.animate-on-scroll, .section-title, .bento-item, .glass-card, .project-card, .cert-card, .approach-item, .about-card, .resume-banner, .terminal-hud-wrap'
    );
    
    elementsToAnimate.forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });
});
