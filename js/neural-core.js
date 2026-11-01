/**
 * Harsh Maurya | Digital Architect Portfolio
 * Procedural 3D Synaptic Core & Neural Graph Engine
 * High-performance, zero-asset, hardware-adaptive WebGL/Canvas3D visualization
 */

class ProceduralNeuralCore {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    if (!this.ctx) return;

    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.width = 160;
    this.height = 160;
    this.rotationX = 0;
    this.rotationY = 0;
    this.targetRotationX = 0;
    this.targetRotationY = 0;
    this.rafId = null;
    this.isVisible = true;

    // Generate 3D Geodesic / Icosahedron Vertices Procedurally
    this.vertices = [];
    this.edges = [];
    this.initGeometry();
    this.resize();
    this.bindEvents();

    if (window.hmPortalActive) {
      window.addEventListener('hm:portal-dismissed', () => {
        if (!this.rafId && this.isVisible) this.animate();
      }, { once: true });
    } else {
      this.animate();
    }
  }

  initGeometry() {
    // Golden ratio for icosahedral symmetry
    const phi = (1 + Math.sqrt(5)) / 2;
    const base = [
      [-1, phi, 0], [1, phi, 0], [-1, -phi, 0], [1, -phi, 0],
      [0, -1, phi], [0, 1, phi], [0, -1, -phi], [0, 1, -phi],
      [phi, 0, -1], [phi, 0, 1], [-phi, 0, -1], [-phi, 0, 1]
    ];

    // Normalize to unit sphere radius ~54px
    const radius = 48;
    this.vertices = base.map(([x, y, z]) => {
      const len = Math.sqrt(x * x + y * y + z * z);
      return {
        x: (x / len) * radius,
        y: (y / len) * radius,
        z: (z / len) * radius,
        pulse: Math.random() * Math.PI * 2,
      };
    });

    // Compute edges based on icosahedron vertex distance
    this.edges = [];
    for (let i = 0; i < this.vertices.length; i++) {
      for (let j = i + 1; j < this.vertices.length; j++) {
        const v1 = this.vertices[i];
        const v2 = this.vertices[j];
        const dist = Math.hypot(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z);
        if (dist < radius * 1.2) {
          this.edges.push([i, j]);
        }
      }
    }
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    this.width = rect.width || 160;
    this.height = rect.height || 160;
    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    this.ctx.scale(this.dpr, this.dpr);
  }

  bindEvents() {
    window.addEventListener('resize', () => this.resize());

    // Mouse influence
    window.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (window.innerWidth / 2);
      const dy = (e.clientY - cy) / (window.innerHeight / 2);
      this.targetRotationY = dx * 1.2;
      this.targetRotationX = -dy * 1.2;
    });

    // Pause when off-screen
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          this.isVisible = entry.isIntersecting;
          if (this.isVisible && !this.rafId) {
            this.animate();
          }
        });
      }, { threshold: 0.1 });
      observer.observe(this.canvas);
    }

    // Pause when document hidden
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.isVisible = false;
      } else {
        this.isVisible = true;
        if (!this.rafId) this.animate();
      }
    });
  }

  project(x, y, z) {
    const fov = 180;
    const distance = 160;
    const factor = fov / (distance + z);
    return {
      x: x * factor + this.width / 2,
      y: y * factor + this.height / 2,
      scale: factor,
    };
  }

  animate() {
    if (!this.isVisible) {
      this.rafId = null;
      return;
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.renderFrame(0, 0);
      return;
    }

    // Smooth inertia lerping
    this.rotationX += (this.targetRotationX - this.rotationX) * 0.05 + 0.003;
    this.rotationY += (this.targetRotationY - this.rotationY) * 0.05 + 0.007;

    this.renderFrame(this.rotationX, this.rotationY);
    this.rafId = requestAnimationFrame(() => this.animate());
  }

  renderFrame(rotX, rotY) {
    this.ctx.clearRect(0, 0, this.width, this.height);

    const cosX = Math.cos(rotX);
    const sinX = Math.sin(rotX);
    const cosY = Math.cos(rotY);
    const sinY = Math.sin(rotY);

    // Transform and project vertices
    const projected = this.vertices.map((v) => {
      // Rotate around Y
      let x1 = v.x * cosY + v.z * sinY;
      let y1 = v.y;
      let z1 = -v.x * sinY + v.z * cosY;

      // Rotate around X
      let x2 = x1;
      let y2 = y1 * cosX - z1 * sinX;
      let z2 = y1 * sinX + z1 * cosX;

      return {
        proj: this.project(x2, y2, z2),
        z: z2,
        orig: v,
      };
    });

    // Draw central glowing singularity core
    const grad = this.ctx.createRadialGradient(
      this.width / 2, this.height / 2, 2,
      this.width / 2, this.height / 2, 28
    );
    grad.addColorStop(0, 'rgba(0, 240, 255, 0.35)');
    grad.addColorStop(0.5, 'rgba(16, 185, 129, 0.12)');
    grad.addColorStop(1, 'transparent');
    this.ctx.fillStyle = grad;
    this.ctx.beginPath();
    this.ctx.arc(this.width / 2, this.height / 2, 28, 0, Math.PI * 2);
    this.ctx.fill();

    // Render edges with depth cues
    this.edges.forEach(([i, j]) => {
      const p1 = projected[i];
      const p2 = projected[j];
      const avgZ = (p1.z + p2.z) / 2;
      const alpha = Math.max(0.08, Math.min(0.48, 0.28 + avgZ * 0.005));

      this.ctx.beginPath();
      this.ctx.moveTo(p1.proj.x, p1.proj.y);
      this.ctx.lineTo(p2.proj.x, p2.proj.y);
      this.ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
      this.ctx.lineWidth = Math.max(0.5, 1.1 + avgZ * 0.01);
      this.ctx.stroke();
    });

    // Render vertices as glowing synaptic nodes
    projected.forEach((p) => {
      const radius = Math.max(1.4, 2.6 + p.z * 0.03);
      const alpha = Math.max(0.3, Math.min(0.95, 0.65 + p.z * 0.008));

      this.ctx.beginPath();
      this.ctx.arc(p.proj.x, p.proj.y, radius, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(0, 240, 255, ${alpha})`;
      this.ctx.shadowColor = '#00f0ff';
      this.ctx.shadowBlur = radius * 3;
      this.ctx.fill();
      this.ctx.shadowBlur = 0;
    });
  }
}

// Global initialization
if (typeof window !== 'undefined') {
  window.ProceduralNeuralCore = ProceduralNeuralCore;
}
