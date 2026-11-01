/**
 * Harsh Maurya | Digital Architect Portfolio
 * Modern Web Motion & Interaction Architecture
 * GSAP + ScrollTrigger + Lenis Unified RAF Synchronization
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Reduced-Motion Guardrail (Strict Accessibility)
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    document.querySelectorAll('.animate-on-scroll').forEach((el) => {
      el.classList.add('is-visible');
    });
    return;
  }

  // 2. Hardware-Accelerated Spotlight Card Hover Effect
  const initSpotlightCards = () => {
    const cards = document.querySelectorAll('.spotlight-card, .project-card, .bento-item');
    cards.forEach((card) => {
      card.classList.add('spotlight-card');
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      });
    });
  };
  initSpotlightCards();

  // 3. Lenis Smooth Scrolling & GSAP ScrollTrigger Unified RAF
  const hasGSAP = typeof gsap !== 'undefined';
  const hasScrollTrigger = typeof ScrollTrigger !== 'undefined';
  const hasLenis = typeof Lenis !== 'undefined';

  if (hasGSAP && hasScrollTrigger) {
    document.documentElement.classList.add('gsap-active');
    gsap.registerPlugin(ScrollTrigger);

    let lenis = null;
    if (hasLenis) {
      lenis = new Lenis({
        duration: 1.1,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 1.4,
      });

      window.lenis = lenis;

      // Synchronize Lenis with ScrollTrigger
      lenis.on('scroll', ScrollTrigger.update);

      // Unified GSAP Ticker
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);

      // Smooth in-page anchor links with header offset
      document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', (e) => {
          const href = anchor.getAttribute('href');
          if (!href || href === '#' || !href.startsWith('#')) return;
          const target = document.querySelector(href);
          if (target) {
            e.preventDefault();
            lenis.scrollTo(target, { offset: -70, duration: 1.1 });
          }
        });
      });
    }

    // 4. Staggered Hero Reveal (Completes under 1.1s total)
    const heroTl = gsap.timeline({
      defaults: { ease: 'power3.out' },
      onComplete: () => {
        gsap.set(
          '.hero-avatar-wrap, .telemetry-pill, .hero-title, .hero-subtitle, .hero-actions .btn-primary, .hero-actions .btn-secondary, .hero-actions .btn-outline, .terminal-hud-wrap',
          { clearProps: 'all' }
        );
      },
    });

    heroTl
      .from('.hero-avatar-wrap', { opacity: 0, scale: 0.92, duration: 0.35 })
      .from('.telemetry-pill', { opacity: 0, y: -8, duration: 0.25 }, '-=0.15')
      .from('.hero-title', { opacity: 0, y: 14, duration: 0.4 }, '-=0.15')
      .from('.hero-subtitle', { opacity: 0, y: 10, duration: 0.3 }, '-=0.2')
      .from(
        '.hero-actions .btn-primary, .hero-actions .btn-secondary, .hero-actions .btn-outline',
        {
          opacity: 0,
          y: 8,
          stagger: 0.06,
          duration: 0.3,
        },
        '-=0.15'
      )
      .from('.terminal-hud-wrap', { opacity: 0, y: 18, duration: 0.35 }, '-=0.15');

    // 5. Subtle Section Entrance Reveals (Once per section)
    gsap.utils.toArray('.section').forEach((section) => {
      const head = section.querySelector('.section-head');
      if (head) {
        gsap.from(head, {
          scrollTrigger: {
            trigger: section,
            start: 'top 85%',
            once: true,
          },
          opacity: 0,
          y: 18,
          duration: 0.45,
          ease: 'power2.out',
          clearProps: 'all',
        });
      }
    });

    // 6. Bento Grid Stagger
    const bentoGrid = document.querySelector('.bento-grid');
    if (bentoGrid) {
      gsap.from('.bento-item', {
        scrollTrigger: {
          trigger: bentoGrid,
          start: 'top 80%',
          once: true,
        },
        opacity: 0,
        y: 14,
        stagger: 0.05,
        duration: 0.4,
        ease: 'power2.out',
        clearProps: 'all',
      });
    }

    // 7. Project Cards Glide-In
    gsap.utils.toArray('.project-card').forEach((card) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          once: true,
        },
        opacity: 0,
        y: 20,
        duration: 0.5,
        ease: 'power2.out',
        clearProps: 'all',
      });
    });

    // 8. Credentials Ribbon Stagger
    const certsRibbon = document.querySelector('.certs-ribbon');
    if (certsRibbon) {
      gsap.from('.cert-strip-item', {
        scrollTrigger: {
          trigger: certsRibbon,
          start: 'top 85%',
          once: true,
        },
        opacity: 0,
        y: 12,
        stagger: 0.04,
        duration: 0.35,
        ease: 'power2.out',
        clearProps: 'all',
      });
    }

    // Mark all elements as visible for CSS compatibility
    document.querySelectorAll('.animate-on-scroll').forEach((el) => {
      el.classList.add('is-visible');
    });
  } else {
    // Graceful Fallback: IntersectionObserver
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.05,
    };

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach((el) => {
      observer.observe(el);
    });
  }
});
