/**
 * Harsh Maurya | Digital Architect Portfolio
 * Modern Web Motion, Procedural Canvas, Web Audio Synthesizer & Interactive CLI HUD
 */

// ===== 1. Native Web Audio API Sound Synthesizer =====
class WebAudioFx {
  constructor() {
    this.ctx = null;
    this.enabled = localStorage.getItem('portfolio_audio_fx') === 'true';
  }

  init() {
    if (!this.ctx && typeof (window.AudioContext || window.webkitAudioContext) !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggle() {
    this.init();
    this.enabled = !this.enabled;
    localStorage.setItem('portfolio_audio_fx', this.enabled ? 'true' : 'false');
    this.updateButtonUI();
    if (this.enabled) {
      this.playBoot();
    }
    return this.enabled;
  }

  updateButtonUI() {
    const btn = document.getElementById('audioToggleBtn');
    if (!btn) return;
    if (this.enabled) {
      btn.innerHTML = '<i class="fas fa-volume-up"></i> <span>FX: ON</span>';
      btn.style.borderColor = 'var(--accent)';
      btn.style.color = 'var(--accent)';
    } else {
      btn.innerHTML = '<i class="fas fa-volume-mute"></i> <span>FX: OFF</span>';
      btn.style.borderColor = 'var(--border-subtle)';
      btn.style.color = 'var(--text-muted)';
    }
  }

  playClick() {
    if (!this.enabled || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1400, this.ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch (_) {}
  }

  playKeypress() {
    if (!this.enabled || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600 + Math.random() * 200, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.03, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.03);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.03);
    } catch (_) {}
  }

  playBoot() {
    if (!this.enabled || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      [440, 660, 880].forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.06);
        gain.gain.setValueAtTime(0.05, now + i * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.12);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + i * 0.06);
        osc.stop(now + i * 0.06 + 0.12);
      });
    } catch (_) {}
  }
}

const sfx = new WebAudioFx();

// ===== 2. High-Performance Procedural Canvas (Neural Mesh) =====
class NeuralMeshCanvas {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.nodes = [];
    this.nodeCount = window.innerWidth < 768 ? 35 : 70;
    this.maxDistance = 140;
    this.mouse = { x: -1000, y: -1000 };
    this.rafId = null;

    this.resize();
    this.initNodes();
    this.bindEvents();
    this.animate();
  }

  resize() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
  }

  initNodes() {
    this.nodes = [];
    for (let i = 0; i < this.nodeCount; i++) {
      this.nodes.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 1.6 + 1.2,
      });
    }
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      this.resize();
      this.initNodes();
    });

    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
      this.mouse.x = -1000;
      this.mouse.y = -1000;
    });
  }

  animate() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    this.ctx.clearRect(0, 0, this.width, this.height);

    for (let i = 0; i < this.nodes.length; i++) {
      const node = this.nodes[i];
      node.x += node.vx;
      node.y += node.vy;

      if (node.x < 0 || node.x > this.width) node.vx *= -1;
      if (node.y < 0 || node.y > this.height) node.vy *= -1;

      // Mouse interactive deflection
      const dx = this.mouse.x - node.x;
      const dy = this.mouse.y - node.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120 && dist > 0) {
        const force = (120 - dist) / 120;
        node.x -= (dx / dist) * force * 1.5;
        node.y -= (dy / dist) * force * 1.5;
      }

      // Draw node
      this.ctx.beginPath();
      this.ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = 'rgba(0, 240, 255, 0.45)';
      this.ctx.fill();

      // Connect near nodes
      for (let j = i + 1; j < this.nodes.length; j++) {
        const other = this.nodes[j];
        const dxx = node.x - other.x;
        const dyy = node.y - other.y;
        const d = Math.sqrt(dxx * dxx + dyy * dyy);

        if (d < this.maxDistance) {
          const alpha = (1 - d / this.maxDistance) * 0.16;
          this.ctx.beginPath();
          this.ctx.moveTo(node.x, node.y);
          this.ctx.lineTo(other.x, other.y);
          this.ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
          this.ctx.lineWidth = 0.8;
          this.ctx.stroke();
        }
      }
    }

    this.rafId = requestAnimationFrame(() => this.animate());
  }
}

// ===== 3. Custom Glowing Cursor =====
const setupCursor = () => {
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');
  if (!cursor || !follower) return;

  let mouseX = -100;
  let mouseY = -100;
  let followerX = -100;
  let followerY = -100;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
  });

  const renderFollower = () => {
    followerX += (mouseX - followerX) * 0.18;
    followerY += (mouseY - followerY) * 0.18;
    follower.style.left = followerX + 'px';
    follower.style.top = followerY + 'px';
    requestAnimationFrame(renderFollower);
  };
  requestAnimationFrame(renderFollower);

  const hoverTargets = document.querySelectorAll('a, button, .bento-item, .glass-card, .project-card, .cert-card, .contact-item, .filter-btn, .terminal-chip');
  hoverTargets.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      follower.classList.add('cursor-hover');
      sfx.playClick();
    });
    el.addEventListener('mouseleave', () => {
      follower.classList.remove('cursor-hover');
    });
  });
};

// ===== 4. Interactive CLI HUD Terminal =====
const setupTerminal = () => {
  const input = document.getElementById('terminalInput');
  const output = document.getElementById('terminalOutput');
  const chips = document.querySelectorAll('.terminal-chip');
  if (!input || !output) return;

  const sanitize = (str) => {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  };

  const executeCommand = (rawCmd) => {
    const cmd = rawCmd.trim().toLowerCase();
    sfx.playKeypress();

    let reply = '';
    switch (cmd) {
      case 'help':
        reply = `Available commands:
  • projects  - List all flagship projects & systems
  • skills    - Display architectural & deep-tech stack
  • contact   - Reveal direct communication endpoints
  • status    - Display real-time system diagnostics
  • whoami    - Profile identity
  • clear     - Clear terminal buffer`;
        break;

      case 'projects':
        reply = `[FLAGSHIP DEPLOYMENTS & ACTIVE SYSTEMS (7)]:
  1. BUDDY (Autonomous Local AI Study Platform) - FastAPI + Three.js + Ollama
  2. FormattingBuddy (PWA Document Intake & WASM OCR) - Zero-Backend AES-GCM
  3. Typing Buddy (Offline Windows Typing Assistant) - Harper Engine + Hinglish
  4. SwasthLink (Virtual Queue & ABDM Protocol) - Mobile Scan & Share
  5. GraphRAG Engine (Local Intelligence Pipeline) - NetworkX Louvain + Ollama
  6. Stone Paper Scissor 3.0 (Interactive Web Game) - 100dvh + Web Audio
  7. Snake Water Gun (Classic Strategy Game Engine) - Client-side Round Arbiter
Type 'repos' to inspect all 10 repositories on GitHub.`;
        break;

      case 'repos':
        reply = `[GITHUB CODEBASE DIRECTORY (10 PUBLIC REPOSITORIES)]:
  • buddy-ai-study-platform   - Local RAG, 3D Neural Cortex (6GB VRAM)
  • formattingbuddy           - Modern PWA, WASM OCR, In-Memory Cryptography
  • typing-buddy              - Windows Daemon, Harper Engine, Zero Telemetry
  • Swast-.link-              - SwasthLink Virtual Queue & ABDM/UPI Simulation
  • graphrag-ollama           - Multi-Document Knowledge Graph RAG Traversal
  • stone-paper-scissor       - Responsive 100dvh Browser Game & Audio Engine
  • snake-water-gun           - Traditional Indian Variant Casual Web Game
  • harsh-maurya-portfolio    - Digital Architect Engineering Showcase
  • SSP-game                  - Interactive Game Logic Prototype
  • anniversary-website       - Archive
Profile: https://github.com/harshverse-svg?tab=repositories`;
        break;

      case 'skills':
        reply = `[CORE TECHNICAL STACK]:
  • Languages: Python, C / C++, JavaScript, HTML/CSS
  • AI & LLMs: Local LLMs (Ollama, Gemma, Qwen2.5), GraphRAG, Vector RAG
  • Infrastructure: Git, GitHub CLI, PowerShell, Linux, FastAPI, Streamlit
  • Deep-Tech: Neuromorphic Computing, Knowledge Graphs, 3D GLSL`;
        break;

      case 'contact':
        reply = `[COMMUNICATION ENDPOINTS]:
  • Email: harshmauryamau@gmail.com
  • Phone: +91 95697 59599
  • GitHub: https://github.com/harshverse-svg
  • LinkedIn: https://www.linkedin.com/in/harsh-maurya-baa534400
  • Location: Meerut, Uttar Pradesh, India`;
        break;

      case 'status':
        reply = `[SYSTEM TELEMETRY]:
  • Core: ONLINE (HTTP 200)
  • Time: ${new Date().toISOString()}
  • Platform: ${navigator.platform || 'x86_64'}
  • Audio FX: ${sfx.enabled ? 'ACTIVE' : 'MUTED'}
  • Security: CSP Hardened, Strict Sanitization Enforced`;
        break;

      case 'whoami':
        reply = `Harsh Maurya — Computer Science Engineer & Digital Architect.
Focused on building hyper-local solutions, privacy-first offline utilities, and local AI.`;
        break;

      case 'clear':
        output.textContent = '';
        input.value = '';
        return;

      case '':
        return;

      default:
        reply = `Command not recognized: "${sanitize(cmd)}". Type "help" for active command matrix.`;
    }

    const entry = document.createElement('div');
    entry.style.marginBottom = '0.75rem';
    entry.innerHTML = `<span style="color:var(--accent)">visitor@hm-arch:~$</span> ${sanitize(rawCmd)}\n${reply}`;
    output.appendChild(entry);
    output.scrollTop = output.scrollHeight;
    input.value = '';
  };

  input.addEventListener('keydown', (e) => {
    sfx.playKeypress();
    if (e.key === 'Enter') {
      executeCommand(input.value);
    }
  });

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const cmd = chip.getAttribute('data-cmd');
      if (cmd) {
        executeCommand(cmd);
      }
    });
  });
};

// ===== 5. Project Filtering Matrix =====
const setupProjectFilters = () => {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  if (!filterBtns.length || !projectCards.length) return;

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      sfx.playClick();
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const category = card.getAttribute('data-category') || '';
        if (filter === 'all' || category.includes(filter)) {
          card.style.display = 'block';
          card.classList.add('is-visible');
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
};

// ===== 6. One-Click Copy Clone Command =====
const setupCopyClone = () => {
  const copyBtns = document.querySelectorAll('.copy-clone-btn');
  copyBtns.forEach((btn) => {
    btn.addEventListener('click', async () => {
      const repoUrl = btn.getAttribute('data-repo');
      const tooltip = btn.querySelector('.copy-tooltip');
      if (!repoUrl) return;

      const cloneCmd = `git clone ${repoUrl}.git`;
      try {
        await navigator.clipboard.writeText(cloneCmd);
        sfx.playClick();
        if (tooltip) {
          tooltip.textContent = 'Copied!';
          tooltip.classList.add('show');
          setTimeout(() => tooltip.classList.remove('show'), 2000);
        }
      } catch (_) {
        if (tooltip) {
          tooltip.textContent = 'Select manually';
          tooltip.classList.add('show');
          setTimeout(() => tooltip.classList.remove('show'), 2000);
        }
      }
    });
  });
};

// ===== 7. Dynamic Telemetry Typing for System Badge =====
const setupTypewriter = () => {
  const sysInitElem = document.getElementById('type-sys-init');
  if (!sysInitElem) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    sysInitElem.textContent = '> sys.init("harsh_maurya")';
    return;
  }

  const telemetryLines = [
    '> sys.init("harsh_maurya")',
    '> kernel.status("all_systems_operational")',
    '> local_ai.core("rtx_6gb_vram_active")',
    '> architecture.mode("privacy_first_offline")',
    '> research.focus("graphrag_and_neuromorphic")'
  ];

  let lineIdx = 0;
  let charIdx = 0;
  let isDeleting = false;

  const tick = () => {
    const currentLine = telemetryLines[lineIdx];

    if (!isDeleting) {
      charIdx++;
      sysInitElem.innerHTML = currentLine.substring(0, charIdx) + '<span class="cursor-blink">_</span>';

      if (charIdx === currentLine.length) {
        isDeleting = true;
        setTimeout(tick, 2200); // Pause on complete string
        return;
      }
      setTimeout(tick, 45);
    } else {
      charIdx--;
      sysInitElem.innerHTML = currentLine.substring(0, charIdx) + '<span class="cursor-blink">_</span>';

      if (charIdx === 2) { // Keep "> " prefix
        isDeleting = false;
        lineIdx = (lineIdx + 1) % telemetryLines.length;
        setTimeout(tick, 350);
        return;
      }
      setTimeout(tick, 25);
    }
  };

  tick();
};

// ===== 8. Scroll Progress, Smart Auto-Hide Navbar & Active Indicator =====
const setupScrollProgress = () => {
  const progressBar = document.getElementById('scrollProgress');
  const navbar = document.getElementById('navbar');
  const sections = document.querySelectorAll('section[id], header[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  let lastScrollY = window.scrollY;

  window.addEventListener('scroll', () => {
    const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    if (progressBar && height > 0) {
      progressBar.style.width = (winScroll / height) * 100 + '%';
    }

    // 1. Compact Navbar when scrolling
    if (winScroll > 30) {
      navbar?.classList.add('nav-scrolled');
    } else {
      navbar?.classList.remove('nav-scrolled');
    }

    // 2. Smart Auto-Hide Navbar on scroll down, reveal on scroll up
    const isMobileOpen = document.getElementById('navLinks')?.classList.contains('mobile-open');
    if (winScroll > 120 && winScroll > lastScrollY && !isMobileOpen) {
      navbar?.classList.add('nav-hidden');
    } else {
      navbar?.classList.remove('nav-hidden');
    }
    lastScrollY = winScroll;

    // Active Section Spy
    let current = '';
    sections.forEach((sec) => {
      const top = sec.offsetTop - 120;
      if (winScroll >= top) {
        current = sec.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
};

// ===== 9. Mobile Menu Toggle =====
const setupMobileNav = () => {
  const toggle = document.getElementById('mobileToggle') || document.getElementById('mobileNavToggle');
  const navLinks = document.getElementById('navLinks');
  if (!toggle || !navLinks) return;

  toggle.addEventListener('click', () => {
    sfx.playClick();
    navLinks.classList.toggle('mobile-open');
    const isOpen = navLinks.classList.contains('mobile-open');
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('mobile-open');
    });
  });
};

// ===== 10. YouTube Facade (Zero-Blocking Performance) =====
const setupYouTubeFacade = () => {
  const facade = document.getElementById('youtubeFacade');
  if (!facade) return;

  facade.addEventListener('click', () => {
    const videoId = facade.getAttribute('data-video') || 'o81KExZbok0';
    facade.innerHTML = `
      <iframe width="100%" height="100%" src="https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1"
        title="Going deep into LLMs - Harsh Maurya" frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen style="border: none; width: 100%; height: 100%; min-height: 280px;"></iframe>
    `;
    facade.style.cursor = 'default';
  });
};

// ===== 11. Universal Modal Dialog (Certificates & Architecture) =====
const setupModal = () => {
  const modal = document.getElementById('universalModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalImg = document.getElementById('modalImg');
  const modalBody = document.getElementById('modalBody');
  const closeBtn = document.getElementById('modalCloseBtn');
  if (!modal) return;

  const closeModal = () => {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    // Restore default modal body if needed
    if (!modalImg.parentElement) {
      modalBody.innerHTML = '<img src="" alt="Preview" id="modalImg" class="modal-img-preview" />';
    }
  };

  closeBtn?.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
  });

  document.querySelectorAll('.open-modal-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const img = btn.getAttribute('data-img');
      const title = btn.getAttribute('data-title');
      const target = btn.getAttribute('data-target');

      if (img) {
        modalTitle.textContent = title || 'Credential Verification';
        const imgEl = document.getElementById('modalImg');
        if (imgEl) {
          imgEl.src = img;
          imgEl.style.display = 'block';
        }
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
      } else if (target === 'graphrag-modal') {
        modalTitle.textContent = 'GraphRAG Engine Architecture';
        modalBody.innerHTML = `
          <div style="font-family: var(--font-mono); color: var(--ink-muted); line-height: 1.8; margin-top: 1rem;">
            <p style="color: var(--accent); margin-bottom: 0.75rem;">// Local Graph Traversal Flow</p>
            <ol style="padding-left: 1.5rem; display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.9rem;">
              <li><strong>Raw Text Ingestion:</strong> Chunk documents with 500-token overlap bounds.</li>
              <li><strong>Local LLM Extraction:</strong> Ollama (Qwen2.5/Gemma) extracts (entity, relation, entity) triplets.</li>
              <li><strong>Louvain Clustering:</strong> NetworkX groups dense subgraphs into conceptual communities.</li>
              <li><strong>Hierarchical Summary:</strong> Model synthesizes high-level themes per cluster.</li>
              <li><strong>Hybrid Traversal:</strong> User query traverses graph communities before falling back to local vector similarity.</li>
            </ol>
            <div style="margin-top: 1.5rem; display: flex; gap: 1rem; flex-wrap: wrap;">
              <a href="graphrag-readme.html" class="btn-primary" style="display: inline-block;">Read Full Documentation</a>
              <a href="https://github.com/harshverse-svg/graphrag-ollama" target="_blank" rel="noopener noreferrer" class="btn-outline" style="display: inline-block;">Source Code</a>
            </div>
          </div>
        `;
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
      }
    });
  });
};

// ===== Initializer =====
document.addEventListener('DOMContentLoaded', () => {
  new NeuralMeshCanvas('bg-canvas');
  setupCursor();
  setupTerminal();
  setupProjectFilters();
  setupCopyClone();
  setupTypewriter();
  setupScrollProgress();
  setupMobileNav();
  setupYouTubeFacade();
  setupModal();

  // Audio Toggle Button
  const audioBtn = document.getElementById('audioToggleBtn');
  if (audioBtn) {
    sfx.updateButtonUI();
    audioBtn.addEventListener('click', () => {
      sfx.toggle();
    });
  }

  // Tilt Initialization
  if (typeof VanillaTilt !== 'undefined') {
    VanillaTilt.init(document.querySelectorAll('.project-card, .cert-card, .bento-item, .glass-card, .approach-item, .about-card'), {
      max: 4,
      speed: 400,
      glare: true,
      'max-glare': 0.08,
      perspective: 1000,
    });
  }

  // Developer Greeting
  console.log('%c> sys.init("harsh_maurya")', 'color: #00f0ff; font-family: monospace; font-size: 16px; font-weight: bold;');
  console.log('%c> Status: All systems nominal. Architecture-first portfolio online.', 'color: #10b981; font-family: monospace; font-size: 12px;');
});
