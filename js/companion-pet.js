/**
 * Harsh Maurya | Digital Architect Portfolio
 * "Spark" — Autonomous 3D Neural Companion & Guide
 * Procedural 3D Droid Rendering, Emotion Visor, Voice Lines & Quick Navigation
 */

class NeuralCompanionPet {
  constructor() {
    this.container = document.getElementById('companionPet');
    this.canvas = document.getElementById('petCanvas');
    this.bubble = document.getElementById('petBubble');
    this.bubbleText = document.getElementById('petBubbleText');
    this.minimizeBtn = document.getElementById('petMinimizeBtn');
    this.closeBubbleBtn = document.getElementById('petCloseBubbleBtn');
    if (!this.container || !this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    if (!this.ctx) return;

    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.size = 80;
    this.time = 0;
    this.rafId = null;
    this.isMinimized = localStorage.getItem('hm_pet_minimized') === 'true';

    // Companion State
    this.mood = 'NEUTRAL'; // NEUTRAL, HAPPY, SCANNING, BLINK
    this.blinkTimer = 0;
    this.scanOffset = 0;
    this.dialogueIndex = 0;
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

    // Dialogue Matrix
    this.dialogues = [
      {
        text: "👋 Hi! I'm <strong>Spark</strong>, Harsh's autonomous AI companion. I run 100% on local code with zero cloud telemetry!",
        actionLabel: "Explore Systems (7)",
        actionTarget: "#projects"
      },
      {
        text: "⚡ <strong>6GB Hardware Bound:</strong> Harsh engineered BUDDY and GraphRAG to run on consumer RTX 3060 GPUs using Ollama 4-bit quantizations.",
        actionLabel: "Inspect GraphRAG",
        actionTarget: "#projects"
      },
      {
        text: "📜 <strong>New Credentials:</strong> Harsh just earned 2 NPTEL certifications from IIT Bombay (Networking Elite) & IIT Kharagpur (Problem Solving in C)!",
        actionLabel: "View 09 Certifications",
        actionTarget: "#certs"
      },
      {
        text: "🏥 <strong>SwasthLink Architecture:</strong> Check out the simulated ABDM & UPI OpenAPI 3.1 specification for outpatient hospital queues.",
        actionLabel: "Open Case Study",
        actionTarget: "#projects"
      },
      {
        text: "🧠 <strong>Literature Grounding:</strong> Harsh studies verified arXiv preprints in Neuromorphic Computing, Floquet Engineering, and Muon Tomography.",
        actionLabel: "Visit Technical Lab",
        actionTarget: "#lab"
      }
    ];

    this.initCanvas();
    this.bindEvents();
    this.updateMinimizedUI();
    // On mobile screens, start with speech bubble closed so page content is never obstructed
    if (window.innerWidth < 768) {
      this.bubble?.classList.add('bubble-hidden');
    } else {
      this.showNextDialogue();
    }

    if (window.hmPortalActive) {
      window.addEventListener('hm:portal-dismissed', () => {
        if (!this.rafId) this.animate();
      }, { once: true });
    } else {
      this.animate();
    }
  }

  initCanvas() {
    this.canvas.width = this.size * this.dpr;
    this.canvas.height = this.size * this.dpr;
    this.canvas.style.width = `${this.size}px`;
    this.canvas.style.height = `${this.size}px`;
    this.ctx.scale(this.dpr, this.dpr);
  }

  bindEvents() {
    // Mouse tracking for companion head tilt
    window.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      this.mouse.targetX = Math.max(-1, Math.min(1, (e.clientX - cx) / 250));
      this.mouse.targetY = Math.max(-1, Math.min(1, (e.clientY - cy) / 250));
    });

    // Tap/Click on Spark
    this.canvas.addEventListener('click', () => {
      this.playChirp();
      this.mood = 'HAPPY';
      setTimeout(() => { this.mood = 'NEUTRAL'; }, 1800);
      this.showNextDialogue();
    });

    // Minimize Toggle
    this.minimizeBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleMinimize();
    });

    // Close speech bubble
    this.closeBubbleBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.bubble?.classList.add('bubble-hidden');
    });

    // Quick action in bubble
    const actionBtn = document.getElementById('petActionBtn');
    actionBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = actionBtn.getAttribute('data-target');
      if (targetId && window.lenis) {
        const target = document.querySelector(targetId);
        if (target) window.lenis.scrollTo(target, { offset: -70 });
      } else if (targetId) {
        document.querySelector(targetId)?.scrollIntoView({ behavior: 'smooth' });
      }
      this.playChirp();
    });
  }

  toggleMinimize() {
    this.isMinimized = !this.isMinimized;
    localStorage.setItem('hm_pet_minimized', this.isMinimized ? 'true' : 'false');
    this.updateMinimizedUI();
    this.playChirp();
  }

  updateMinimizedUI() {
    if (this.isMinimized) {
      this.container.classList.add('pet-minimized');
      this.bubble?.classList.add('bubble-hidden');
    } else {
      this.container.classList.remove('pet-minimized');
      this.bubble?.classList.remove('bubble-hidden');
    }
  }

  showNextDialogue() {
    if (this.isMinimized) return;
    const item = this.dialogues[this.dialogueIndex];
    this.dialogueIndex = (this.dialogueIndex + 1) % this.dialogues.length;

    if (this.bubbleText) {
      this.bubbleText.innerHTML = item.text;
    }
    const actionBtn = document.getElementById('petActionBtn');
    if (actionBtn) {
      actionBtn.textContent = item.actionLabel;
      actionBtn.setAttribute('data-target', item.actionTarget);
    }
    this.bubble?.classList.remove('bubble-hidden');
  }

  playChirp() {
    if (!window.sfx || !window.sfx.enabled || !window.sfx.ctx) return;
    try {
      const ctx = window.sfx.ctx;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const now = ctx.currentTime;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1100, now);
      osc.frequency.exponentialRampToValueAtTime(1760, now + 0.08);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
    } catch (_) {}
  }

  animate() {
    this.time += 0.035;

    // Head tilt lerp
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.1;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.1;

    // Random blink timer
    this.blinkTimer++;
    if (this.blinkTimer > 180 && Math.random() < 0.04) {
      this.mood = 'BLINK';
      setTimeout(() => {
        if (this.mood === 'BLINK') this.mood = 'NEUTRAL';
      }, 160);
      this.blinkTimer = 0;
    }

    this.render();
    this.rafId = requestAnimationFrame(() => this.animate());
  }

  render() {
    this.ctx.clearRect(0, 0, this.size, this.size);

    const cx = this.size / 2;
    // Smooth sine wave levitation
    const cy = this.size / 2 + Math.sin(this.time) * 4;

    // 1. Bottom Quantum Thruster Glow Ring
    const thrusterGrad = this.ctx.createRadialGradient(cx, cy + 24, 1, cx, cy + 24, 16);
    thrusterGrad.addColorStop(0, 'rgba(0, 240, 255, 0.6)');
    thrusterGrad.addColorStop(0.5, 'rgba(16, 185, 129, 0.25)');
    thrusterGrad.addColorStop(1, 'transparent');
    this.ctx.fillStyle = thrusterGrad;
    this.ctx.beginPath();
    this.ctx.ellipse(cx, cy + 24, 14, 5, 0, 0, Math.PI * 2);
    this.ctx.fill();

    // 2. Procedural Orbiting 3D Halo Ring
    this.ctx.save();
    this.ctx.translate(cx, cy);
    this.ctx.rotate(this.mouse.x * 0.25);
    this.ctx.beginPath();
    this.ctx.ellipse(0, 0, 32, 10 + this.mouse.y * 4, this.time * 0.5, 0, Math.PI * 2);
    this.ctx.strokeStyle = 'rgba(0, 240, 255, 0.55)';
    this.ctx.lineWidth = 1.2;
    this.ctx.shadowColor = '#00f0ff';
    this.ctx.shadowBlur = 5;
    this.ctx.stroke();
    this.ctx.shadowBlur = 0;
    this.ctx.restore();

    // 3. Main Robotic Droid Sphere Head
    const headGrad = this.ctx.createRadialGradient(
      cx - 6 + this.mouse.x * 4, cy - 8 + this.mouse.y * 4, 3,
      cx, cy, 22
    );
    headGrad.addColorStop(0, '#1a2333');
    headGrad.addColorStop(0.7, '#0d131f');
    headGrad.addColorStop(1, '#05080e');

    this.ctx.beginPath();
    this.ctx.arc(cx, cy, 21, 0, Math.PI * 2);
    this.ctx.fillStyle = headGrad;
    this.ctx.fill();

    // Chassis Rim Highlight
    this.ctx.strokeStyle = 'rgba(0, 240, 255, 0.4)';
    this.ctx.lineWidth = 1.2;
    this.ctx.stroke();

    // 4. Holographic Visor Screen (Pill Shape)
    const visorX = cx - 13 + this.mouse.x * 5;
    const visorY = cy - 4 + this.mouse.y * 4;
    this.ctx.fillStyle = '#020408';
    this.ctx.beginPath();
    this.ctx.roundRect(visorX, visorY, 26, 11, 5);
    this.ctx.fill();
    this.ctx.strokeStyle = 'rgba(0, 240, 255, 0.3)';
    this.ctx.lineWidth = 0.8;
    this.ctx.stroke();

    // 5. Visor Emotion Rendering
    const eyeY = visorY + 5.5;
    const leftEyeX = visorX + 7;
    const rightEyeX = visorX + 19;

    this.ctx.fillStyle = '#00f0ff';
    this.ctx.strokeStyle = '#00f0ff';
    this.ctx.shadowColor = '#00f0ff';
    this.ctx.shadowBlur = 6;

    if (this.mood === 'HAPPY') {
      // Smiling Arches: ^ ^
      this.ctx.lineWidth = 1.6;
      [leftEyeX, rightEyeX].forEach((ex) => {
        this.ctx.beginPath();
        this.ctx.arc(ex, eyeY + 1.5, 3.2, Math.PI, Math.PI * 2);
        this.ctx.stroke();
      });
    } else if (this.mood === 'BLINK') {
      // Blinking Flat Lines: - -
      this.ctx.lineWidth = 1.6;
      [leftEyeX, rightEyeX].forEach((ex) => {
        this.ctx.beginPath();
        this.ctx.moveTo(ex - 3, eyeY);
        this.ctx.lineTo(ex + 3, eyeY);
        this.ctx.stroke();
      });
    } else {
      // Neutral Glowing Circular Eyes: • •
      [leftEyeX, rightEyeX].forEach((ex) => {
        this.ctx.beginPath();
        this.ctx.arc(ex, eyeY, 2.5, 0, Math.PI * 2);
        this.ctx.fill();
      });
    }
    this.ctx.shadowBlur = 0;
  }
}

// Attach globally
if (typeof window !== 'undefined') {
  window.NeuralCompanionPet = NeuralCompanionPet;
}
