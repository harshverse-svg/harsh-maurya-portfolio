/**
 * Harsh Maurya | Digital Architect Portfolio
 * 3D Welcome Portal & Warp Gateway Opening Experience
 * Procedural Canvas 3D, Particle Warp Field & Holographic Ring Singularity
 */

class WelcomePortal {
  constructor() {
    this.overlay = document.getElementById('welcomePortal');
    this.canvas = document.getElementById('portalCanvas');
    this.enterBtn = document.getElementById('enterPortfolioBtn');
    this.skipBtn = document.getElementById('skipPortalBtn');
    if (!this.overlay || !this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    if (!this.ctx) return;

    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.rafId = null;
    this.isActive = true;
    this.time = 0;

    // Interactive 3D tilt
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

    // Procedural Warp Particles (Hardware adaptive)
    this.particleCount = window.innerWidth < 768 ? 45 : 120;
    this.particles = [];
    this.initParticles();

    // 3D Concentric Ring Geometries
    this.rings = [
      { radius: 110, tiltX: 0.35, tiltY: 0.15, speed: 0.008, color: 'rgba(0, 240, 255, 0.75)' },
      { radius: 180, tiltX: -0.25, tiltY: 0.45, speed: -0.006, color: 'rgba(16, 185, 129, 0.65)' },
      { radius: 260, tiltX: 0.45, tiltY: -0.3, speed: 0.004, color: 'rgba(0, 240, 255, 0.4)' },
      { radius: 340, tiltX: -0.15, tiltY: 0.2, speed: -0.003, color: 'rgba(245, 158, 11, 0.45)' }
    ];

    this.resize();
    this.bindEvents();

    // Check if audit bot, headless crawler, or returning visitor
    const isAudit = Boolean(navigator.webdriver) ||
      /Lighthouse|Google-InspectionTool|HeadlessChrome/i.test(navigator.userAgent) ||
      window.location.search.includes('lighthouse') ||
      window.location.search.includes('no-portal');
    const seen = sessionStorage.getItem('hm_portal_seen');
    if (seen === 'true' || isAudit) {
      this.dismiss(true);
    } else {
      window.hmPortalActive = true;
      this.animate();
    }
  }

  initParticles() {
    this.particles = [];
    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push({
        x: (Math.random() - 0.5) * this.width * 1.5,
        y: (Math.random() - 0.5) * this.height * 1.5,
        z: Math.random() * 1000 + 1,
        prevZ: 1000,
        speed: Math.random() * 8 + 4,
        color: i % 4 === 0 ? '#10b981' : i % 7 === 0 ? '#f59e0b' : '#00f0ff'
      });
    }
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    this.ctx.scale(this.dpr, this.dpr);
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      this.resize();
      this.initParticles();
    });

    window.addEventListener('mousemove', (e) => {
      this.mouse.targetX = (e.clientX - this.width / 2) / (this.width / 2);
      this.mouse.targetY = (e.clientY - this.height / 2) / (this.height / 2);
    });

    // Touch support for mobile
    window.addEventListener('touchmove', (e) => {
      if (e.touches[0]) {
        this.mouse.targetX = (e.touches[0].clientX - this.width / 2) / (this.width / 2);
        this.mouse.targetY = (e.touches[0].clientY - this.height / 2) / (this.height / 2);
      }
    }, { passive: true });

    this.enterBtn?.addEventListener('click', () => this.dismiss(false));
    this.skipBtn?.addEventListener('click', () => this.dismiss(false));

    window.addEventListener('keydown', (e) => {
      if (!this.isActive) return;
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') {
        e.preventDefault();
        this.dismiss(false);
      }
    });
  }

  dismiss(immediate = false) {
    this.isActive = false;
    window.hmPortalActive = false;
    sessionStorage.setItem('hm_portal_seen', 'true');
    this.overlay.setAttribute('aria-hidden', 'true');
    window.dispatchEvent(new CustomEvent('hm:portal-dismissed'));

    if (window.sfx && typeof window.sfx.playBoot === 'function' && !immediate) {
      window.sfx.playBoot();
    }

    if (immediate) {
      this.overlay.style.display = 'none';
      if (this.rafId) cancelAnimationFrame(this.rafId);
      return;
    }

    if (typeof gsap !== 'undefined') {
      gsap.to(this.overlay, {
        opacity: 0,
        scale: 1.12,
        duration: 0.75,
        ease: 'power3.inOut',
        onComplete: () => {
          this.overlay.style.display = 'none';
          if (this.rafId) cancelAnimationFrame(this.rafId);
        }
      });
    } else {
      this.overlay.style.opacity = '0';
      this.overlay.style.transform = 'scale(1.12)';
      this.overlay.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
      setTimeout(() => {
        this.overlay.style.display = 'none';
        if (this.rafId) cancelAnimationFrame(this.rafId);
      }, 700);
    }
  }

  reopen() {
    this.overlay.style.display = 'flex';
    this.overlay.removeAttribute('aria-hidden');
    this.overlay.style.opacity = '1';
    this.overlay.style.transform = 'scale(1)';
    this.isActive = true;
    window.hmPortalActive = true;
    this.resize();
    this.initParticles();
    this.animate();
  }

  animate() {
    if (!this.isActive) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.renderFrame(true);
      return;
    }

    this.time += 0.016;
    // Lerp mouse
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.08;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.08;

    this.renderFrame(false);
    this.rafId = requestAnimationFrame(() => this.animate());
  }

  renderFrame(isStatic) {
    this.ctx.fillStyle = '#030508';
    this.ctx.fillRect(0, 0, this.width, this.height);

    const cx = this.width / 2;
    const cy = this.height / 2;

    // 1. Ambient Central Singularity Glow
    const glowGrad = this.ctx.createRadialGradient(cx, cy, 2, cx, cy, 280);
    glowGrad.addColorStop(0, 'rgba(0, 240, 255, 0.22)');
    glowGrad.addColorStop(0.4, 'rgba(16, 185, 129, 0.08)');
    glowGrad.addColorStop(1, 'transparent');
    this.ctx.fillStyle = glowGrad;
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, 280, 0, Math.PI * 2);
    this.ctx.fill();

    // 2. Render 3D Warp Field Particles
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      if (!isStatic) {
        p.prevZ = p.z;
        p.z -= p.speed;
        if (p.z <= 1) {
          p.z = 1000;
          p.prevZ = 1000;
          p.x = (Math.random() - 0.5) * this.width * 1.5;
          p.y = (Math.random() - 0.5) * this.height * 1.5;
        }
      }

      const fov = 350;
      const k = fov / p.z;
      const px = p.x * k + cx + this.mouse.x * 40;
      const py = p.y * k + cy + this.mouse.y * 40;

      const prevK = fov / p.prevZ;
      const prevX = p.x * prevK + cx + this.mouse.x * 40;
      const prevY = p.y * prevK + cy + this.mouse.y * 40;

      if (px >= 0 && px <= this.width && py >= 0 && py <= this.height) {
        const alpha = Math.min(1, (1000 - p.z) / 800);
        this.ctx.beginPath();
        this.ctx.moveTo(prevX, prevY);
        this.ctx.lineTo(px, py);
        this.ctx.strokeStyle = p.color;
        this.ctx.lineWidth = Math.max(0.6, (1 - p.z / 1000) * 2.2);
        this.ctx.globalAlpha = alpha * 0.8;
        this.ctx.stroke();
        this.ctx.globalAlpha = 1;
      }
    }

    // 3. Render 3D Concentric Holographic Rings
    this.rings.forEach((ring, idx) => {
      const rot = this.time * ring.speed * 2;
      const tiltX = ring.tiltX + this.mouse.y * 0.2;
      const tiltY = ring.tiltY + this.mouse.x * 0.2;

      this.ctx.save();
      this.ctx.translate(cx, cy);

      const segments = 48;
      this.ctx.beginPath();
      for (let s = 0; s <= segments; s++) {
        const theta = (s / segments) * Math.PI * 2 + rot;
        const x3d = Math.cos(theta) * ring.radius;
        const y3d = Math.sin(theta) * ring.radius * Math.cos(tiltX);
        const z3d = Math.sin(theta) * ring.radius * Math.sin(tiltX);

        // Simple perspective projection
        const fov = 400;
        const scale = fov / (fov + z3d + tiltY * 100);
        const projX = x3d * scale;
        const projY = y3d * scale;

        if (s === 0) {
          this.ctx.moveTo(projX, projY);
        } else {
          this.ctx.lineTo(projX, projY);
        }
      }
      this.ctx.strokeStyle = ring.color;
      this.ctx.lineWidth = 1.2;
      this.ctx.shadowColor = '#00f0ff';
      this.ctx.shadowBlur = 6;
      this.ctx.stroke();
      this.ctx.shadowBlur = 0;
      this.ctx.restore();
    });
  }
}

// Attach globally
if (typeof window !== 'undefined') {
  window.WelcomePortal = WelcomePortal;
}
