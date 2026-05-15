// Intersection Observer for Scroll Animations
document.addEventListener("DOMContentLoaded", () => {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Optional: Unobserve after animating once
                // observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    // Add .animate-on-scroll class to sections/elements you want to animate
    const elementsToAnimate = document.querySelectorAll('.section-title, .bento-item, .glass-card, .project-card, .cert-card, .approach-item, .about-card, .resume-banner');
    
    elementsToAnimate.forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });
});
