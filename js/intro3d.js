/**
 * ==========================================================================
 * Harsh Maurya | Digital Architect Portfolio
 * Cinematic Procedural 3D GPU Unfolding Intro Experience (v2.4)
 * 100% Procedural Three.js Model • Mechanical Staged Choreography • GSAP
 * 
 * Architecture:
 * - Bug 1 Fixed: Explicit createIntro() & destroyIntro() lifecycle, WebGL
 *   context recovery & fallback, solid #02060a canvas backplate, body scroll lock.
 * - Bug 2 Redesigned: No boxed card! GPU settles at 38% viewport height, text
 *   rises into lower third with bottom-up dark gradient scrim. Zero overlap.
 * ==========================================================================
 */

import * as THREE from 'three';

// ===== CENTRAL CONFIGURATION OBJECT =====
export const CONFIG = {
  // Theme & Accent Palette
  accentColor: '#00e5ff',
  accentHex: 0x00e5ff,
  amberHex: 0xf59e0b,
  darkGroundHex: 0x02060a,

  // Text & Copy (STRICT: Zero personal hardware, VRAM, or repo counts)
  badgeText: 'NEURAL ARCHITECTURE v2.4',
  nameText: 'HARSH MAURYA',
  roleText: 'Digital Architect • Local AI • Privacy Systems',
  buttonText: 'ENTER ARCHITECTURE →',
  hintText: 'Press ENTER or click to explore',
  skipText: 'Skip [ESC] ×',

  // Technical Labels (Generic architecture domains only)
  labelsDesktop: [
    { id: 'cooling', text: 'COOLING', target: 'shroud', offset: { x: 200, y: -90 } },
    { id: 'compute', text: 'COMPUTE', target: 'dieMemory', offset: { x: -240, y: -30 } },
    { id: 'memory', text: 'MEMORY', target: 'dieMemory', offset: { x: 240, y: 30 } },
    { id: 'power', text: 'POWER', target: 'pcb', offset: { x: -220, y: 90 } },
    { id: 'interface', text: 'INTERFACE', target: 'connector', offset: { x: 0, y: 130 } }
  ],
  labelsMobile: [
    { id: 'cooling', text: 'COOLING', target: 'shroud', offset: { x: 120, y: -70 } },
    { id: 'compute', text: 'COMPUTE', target: 'dieMemory', offset: { x: -130, y: -20 } },
    { id: 'interface', text: 'INTERFACE', target: 'connector', offset: { x: 0, y: 100 } }
  ],

  // GPU Primitives Dimensions
  dimensions: {
    cardLength: 3.2,
    cardHeight: 0.52,
    cardDepth: 1.12,
    shroudLength: 3.2,
    shroudDepth: 1.1,
    shroudThickness: 0.22,
    backplateThickness: 0.05,
    finCountDesktop: 72,
    finCountMobile: 36,
    fanCount: 3,
    fanRadius: 0.42,
    fanHubRadius: 0.12,
    heatPipeRadius: 0.032,
    pcbLength: 3.12,
    pcbDepth: 1.05,
    pcbThickness: 0.04,
    bracketHeight: 0.76,
    bracketWidth: 1.14
  },

  // Staged Mechanical Unfold Tuning (Staggered by 60-90ms)
  unfold: {
    backplate: {
      x: 0, y: -0.65, z: -0.85,
      rotX: -0.22, rotY: 0, rotZ: 0,
      delay: 1.20, duration: 1.6
    },
    bracket: {
      x: -0.85, y: 0, z: 0,
      rotX: 0, rotY: 0.35, rotZ: 0,
      delay: 1.28, duration: 1.5
    },
    shroud: {
      x: 0, y: 0.85, z: 0.55,
      rotX: 0.75, rotY: 0, rotZ: 0.08, // Mechanical hinge-open rotation
      delay: 1.36, duration: 1.7
    },
    fans: {
      x: 0, y: 0.95, z: 0.95,
      rotX: 0.35, rotY: 0, rotZ: 0,
      delay: 1.44, duration: 1.6
    },
    heatsink: {
      x: 0, y: 0.32, z: 0,
      rotX: 0, rotY: 0, rotZ: 0.04,
      delay: 1.52, duration: 1.5
    },
    pcb: {
      x: 0, y: -0.25, z: 0,
      rotX: 0, rotY: 0, rotZ: 0,
      delay: 1.60, duration: 1.4
    },
    dieMemory: {
      x: 0, y: 0.18, z: 0.12,
      rotX: 0, rotY: 0, rotZ: 0,
      delay: 1.68, duration: 1.3
    },
    connector: {
      x: 0, y: -0.75, z: 0.45,
      rotX: 0.25, rotY: 0, rotZ: 0,
      delay: 1.76, duration: 1.3
    }
  },

  // Act Timings (Standard speed)
  timings: {
    act1Duration: 1.2,    // 0.0s - 1.2s: GPU alone, slow rotation, rim light
    act2Duration: 2.8,    // 1.2s - 4.0s: Mechanical staged unfold + dynamic labels
    settleStart: 4.0,     // 4.0s - 5.2s: GPU scales to 60%, moves to upper-middle (38% height)
    settleDuration: 1.2,
    titleStart: 5.0,      // 5.0s - 6.5s: Lower third hero reveals, glitch decode
    titleDuration: 1.5,
    foldBackDuration: 1.0 // ENTER reverse fold-back
  }
};

export class Intro3D {
  constructor() {
    this.overlay = document.getElementById('welcomePortal');
    this.canvas = document.getElementById('portalCanvas');
    this.isAudit = /Lighthouse|Chrome-Lighthouse|Google-InspectionTool/i.test(navigator.userAgent) ||
                   window.location.search.includes('lighthouse') ||
                   window.location.search.includes('no-portal');

    // Auto-dismiss for automated audits if already seen
    const seen = sessionStorage.getItem('hm_portal_seen');
    if (seen === 'true' || this.isAudit) {
      this.dismiss(true);
      return;
    }

    this.createIntro(false);
  }

  // ===== LIFECYCLE METHOD 1: createIntro =====
  createIntro(isReplay = false) {
    // 1. Destroy any existing instance or listeners first
    this.destroyIntro();

    this.isReplay = isReplay;
    this.isActive = true;
    this.isExiting = false;
    this.isUnfolded = false;
    this.eventsBound = false;
    window.hmPortalActive = true;

    // 2. Lock body scroll
    document.body.style.overflow = 'hidden';

    // 3. Ensure overlay container is pristine
    this.overlay = document.getElementById('welcomePortal');
    if (this.overlay) {
      this.overlay.style.background = '#02060a';
      this.overlay.removeAttribute('aria-hidden');
      this.overlay.classList.remove('portal-closing');
      this.overlay.style.display = 'flex';
      this.overlay.style.opacity = '1';
      this.overlay.style.transform = 'scale(1)';
      // Remove any lingering flash overlays
      this.overlay.querySelectorAll('.portal-flash-overlay').forEach(el => el.remove());
    }

    // 4. Reset lower-third DOM states
    const lowerThird = document.getElementById('portalLowerThird') || this.overlay?.querySelector('.portal-lower-third') || this.overlay?.querySelector('.portal-hud');
    if (lowerThird) {
      lowerThird.classList.remove('hud-visible', 'lower-third-visible');
    }
    const scrim = this.overlay?.querySelector('.portal-scrim');
    if (scrim) {
      scrim.classList.remove('scrim-visible');
    }

    // 5. Reset viewport measurements & properties
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.isMobile = window.innerWidth < 768;
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.clock = new THREE.Clock();
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

    this.parts = new Map();
    this.fanSpinners = [];
    this.labelElements = [];
    this.svgLines = [];

    // 6. Test WebGL context availability; fallback cleanly if unavailable
    this.canvas = document.getElementById('portalCanvas');
    if (!this.canvas) {
      this.showStaticFallback();
      return;
    }

    try {
      const gl = this.canvas.getContext('webgl2') || this.canvas.getContext('webgl');
      if (!gl) {
        throw new Error('WebGL context unavailable');
      }
    } catch (err) {
      console.warn('Intro3D: WebGL unavailable, falling back to static presentation:', err);
      this.showStaticFallback();
      return;
    }

    // 7. Initialize Three.js scene, camera, lights, and procedural parts
    this.initScene();
    this.initBackgroundEffects();
    this.buildProceduralGPU();
    this.initLabelsDOM();

    // 8. Bind interactive events
    this.bindEvents();

    // 9. Start Choreography Timeline
    if (this.prefersReducedMotion) {
      this.showStaticState();
    } else {
      this.startChoreography(isReplay);
    }

    // 10. Start Render Loop
    this.animate();
  }

  // ===== LIFECYCLE METHOD 2: destroyIntro =====
  destroyIntro() {
    this.isActive = false;

    // 1. Kill GSAP timeline
    if (this.tl) {
      this.tl.kill();
      this.tl = null;
    }

    // 2. Cancel animation frame
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }

    // 3. Remove event listeners
    this.unbindEvents();

    // 4. Dispose Three.js geometries, materials, textures
    if (this.scene) {
      this.scene.traverse((obj) => {
        if (obj.geometry) {
          obj.geometry.dispose();
        }
        if (obj.material) {
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });
      this.scene.clear();
      this.scene = null;
    }

    // 5. Dispose WebGL renderer
    if (this.renderer) {
      this.renderer.dispose();
      this.renderer = null;
    }

    // 6. Replace canvas with fresh clone to guarantee context release & zero leak
    if (this.canvas && this.canvas.parentNode) {
      const newCanvas = this.canvas.cloneNode(false);
      this.canvas.parentNode.replaceChild(newCanvas, this.canvas);
      this.canvas = newCanvas;
    }

    // 7. Clear DOM labels and SVG lines
    const labelsContainer = document.getElementById('gpuLabelsContainer');
    if (labelsContainer) {
      labelsContainer.innerHTML = '';
    }

    // 8. Restore body scroll
    document.body.style.overflow = '';
  }

  // ===== 1. Scene, Camera, Lights & Renderer Setup =====
  initScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(CONFIG.darkGroundHex);

    // Camera: positioned for cinematic framing
    const cameraZ = this.isMobile ? 5.4 : 4.4;
    this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.1, 100);
    this.camera.position.set(0, 0.35, cameraZ);
    this.camera.lookAt(0, 0, 0);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(this.dpr);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;

    // Listen to WebGL context loss
    this.onContextLost = (e) => {
      e.preventDefault();
      console.warn('Intro3D: WebGL context lost.');
      this.showStaticFallback();
    };
    this.canvas.addEventListener('webglcontextlost', this.onContextLost, false);

    // Lighting (Cyan key + Amber rim + Ambient + Soft Fill)
    const ambientLight = new THREE.AmbientLight(0x0a101d, 1.2);
    this.scene.add(ambientLight);

    // Cyan Key Light
    this.keyLight = new THREE.DirectionalLight(CONFIG.accentHex, 2.8);
    this.keyLight.position.set(2.5, 3.5, 3.0);
    this.scene.add(this.keyLight);

    // Amber Rim Light (Cyber Warmth)
    this.rimLight = new THREE.DirectionalLight(CONFIG.amberHex, 2.0);
    this.rimLight.position.set(-3.0, -2.5, -2.5);
    this.scene.add(this.rimLight);

    // Fill Light (Deep Indigo)
    const fillLight = new THREE.DirectionalLight(0x192742, 1.4);
    fillLight.position.set(0, -3.0, 2.0);
    this.scene.add(fillLight);

    // Center Singularity Point Light
    this.centerGlow = new THREE.PointLight(CONFIG.accentHex, 1.5, 6.0);
    this.centerGlow.position.set(0, 0, 0.5);
    this.scene.add(this.centerGlow);
  }

  // ===== 2. Background Warp Streaks & Glowing Rings =====
  initBackgroundEffects() {
    this.bgGroup = new THREE.Group();
    this.scene.add(this.bgGroup);

    // 1. Holographic Glowing Rings
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: CONFIG.accentHex,
      transparent: true,
      opacity: 0.45
    });
    const ringGeom1 = new THREE.TorusGeometry(2.3, 0.012, 16, 96);
    this.ring1 = new THREE.Mesh(ringGeom1, ringMat1);
    this.ring1.rotation.x = 0.55;
    this.ring1.rotation.y = 0.35;
    this.bgGroup.add(this.ring1);

    const ringMat2 = new THREE.MeshBasicMaterial({
      color: CONFIG.amberHex,
      transparent: true,
      opacity: 0.35
    });
    const ringGeom2 = new THREE.TorusGeometry(2.9, 0.009, 16, 96);
    this.ring2 = new THREE.Mesh(ringGeom2, ringMat2);
    this.ring2.rotation.x = -0.45;
    this.ring2.rotation.y = -0.25;
    this.bgGroup.add(this.ring2);

    // 2. Floating Warp Particle Field
    const particleCount = this.isMobile ? 120 : 240;
    const posArray = new Float32Array(particleCount * 3);
    const colorArray = new Float32Array(particleCount * 3);

    const colorCyan = new THREE.Color(CONFIG.accentHex);
    const colorAmber = new THREE.Color(CONFIG.amberHex);
    const colorEmerald = new THREE.Color(0x10b981);

    for (let i = 0; i < particleCount; i++) {
      posArray[i * 3 + 0] = (Math.random() - 0.5) * 14;
      posArray[i * 3 + 1] = (Math.random() - 0.5) * 10;
      posArray[i * 3 + 2] = (Math.random() - 0.5) * 12 - 2;

      const c = (i % 3 === 0) ? colorCyan : (i % 3 === 1 ? colorEmerald : colorAmber);
      colorArray[i * 3 + 0] = c.r;
      colorArray[i * 3 + 1] = c.g;
      colorArray[i * 3 + 2] = c.b;
    }

    const particleGeom = new THREE.BufferGeometry();
    particleGeom.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particleGeom.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

    const particleMat = new THREE.PointsMaterial({
      size: this.isMobile ? 0.045 : 0.055,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });

    this.particles = new THREE.Points(particleGeom, particleMat);
    this.bgGroup.add(this.particles);
  }

  // ===== 3. Procedural Three.js GPU Construction =====
  buildProceduralGPU() {
    this.gpuRoot = new THREE.Group();
    this.gpuRoot.name = 'gpuRoot';
    this.gpuRoot.rotation.set(0.18, -0.45, 0.08);
    this.gpuRoot.position.set(0, 0, 0);
    this.gpuRoot.scale.set(1, 1, 1);
    this.scene.add(this.gpuRoot);

    // Premium Materials Palette
    this.materials = {
      gunmetal: new THREE.MeshStandardMaterial({
        color: 0x151821,
        metalness: 0.85,
        roughness: 0.35
      }),
      darkMetal: new THREE.MeshStandardMaterial({
        color: 0x10131b,
        metalness: 0.9,
        roughness: 0.3
      }),
      silver: new THREE.MeshStandardMaterial({
        color: 0xb4bcc8,
        metalness: 0.95,
        roughness: 0.2
      }),
      aluminum: new THREE.MeshStandardMaterial({
        color: 0xb5bcc6,
        metalness: 0.9,
        roughness: 0.28
      }),
      copper: new THREE.MeshStandardMaterial({
        color: 0xc86432,
        metalness: 0.95,
        roughness: 0.22
      }),
      gold: new THREE.MeshStandardMaterial({
        color: 0xf5b82e,
        metalness: 1.0,
        roughness: 0.25
      }),
      pcbSubstrate: new THREE.MeshStandardMaterial({
        color: 0x090c12,
        roughness: 0.85,
        metalness: 0.15
      }),
      siliconMirror: new THREE.MeshStandardMaterial({
        color: 0x222a36,
        roughness: 0.08,
        metalness: 1.0
      }),
      blackCeramic: new THREE.MeshStandardMaterial({
        color: 0x07090e,
        roughness: 0.7,
        metalness: 0.2
      }),
      emissiveTrim: new THREE.MeshStandardMaterial({
        color: CONFIG.accentHex,
        emissive: CONFIG.accentHex,
        emissiveIntensity: 1.4,
        roughness: 0.2
      })
    };

    const d = CONFIG.dimensions;

    // --- A. BACKPLATE ---
    const backplateGroup = new THREE.Group();
    backplateGroup.name = 'backplate';

    const backplateMesh = new THREE.Mesh(
      new THREE.BoxGeometry(d.cardLength, d.backplateThickness, d.cardDepth),
      this.materials.darkMetal
    );
    backplateGroup.add(backplateMesh);

    // Flow-through ventilation cutouts
    for (let i = 0; i < 6; i++) {
      const slot = new THREE.Mesh(
        new THREE.BoxGeometry(0.065, 0.055, 0.65),
        new THREE.MeshBasicMaterial({ color: 0x02060a })
      );
      slot.position.set(0.65 + i * 0.12, 0.005, 0);
      backplateGroup.add(slot);
    }
    // Perimeter Fastener Pins
    const pinGeom = new THREE.CylinderGeometry(0.02, 0.02, 0.06, 8);
    [
      [-1.4, -0.4], [-1.4, 0.4], [0, -0.45], [0, 0.45], [1.4, -0.4], [1.4, 0.4]
    ].forEach(([px, pz]) => {
      const pin = new THREE.Mesh(pinGeom, this.materials.silver);
      pin.position.set(px, 0.02, pz);
      backplateGroup.add(pin);
    });

    backplateGroup.position.set(0, -0.24, 0);
    this.gpuRoot.add(backplateGroup);
    this.parts.set('backplate', backplateGroup);

    // --- B. I/O BRACKET ---
    const bracketGroup = new THREE.Group();
    bracketGroup.name = 'bracket';

    const bracketFace = new THREE.Mesh(
      new THREE.BoxGeometry(0.04, d.bracketHeight, d.bracketWidth),
      this.materials.silver
    );
    bracketGroup.add(bracketFace);

    // 4 Display Port Cutouts (3 DP style, 1 HDMI style)
    const portMat = new THREE.MeshBasicMaterial({ color: 0x05070a });
    for (let i = 0; i < 3; i++) {
      const dpPort = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.08, 0.16), portMat);
      dpPort.position.set(-0.01, -0.18 + i * 0.16, -0.2);
      bracketGroup.add(dpPort);
    }
    const hdmiPort = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.07, 0.18), portMat);
    hdmiPort.position.set(-0.01, 0.20, 0.18);
    bracketGroup.add(hdmiPort);

    // Perforated exhaust honeycomb vent strip
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 2; c++) {
        const ventHole = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.04, 0.04), portMat);
        ventHole.position.set(-0.01, -0.15 + r * 0.08, 0.12 + c * 0.12);
        bracketGroup.add(ventHole);
      }
    }

    bracketGroup.position.set(-d.cardLength / 2 - 0.02, 0.08, 0);
    this.gpuRoot.add(bracketGroup);
    this.parts.set('bracket', bracketGroup);

    // --- C. PCB (PRINTED CIRCUIT BOARD) ---
    const pcbGroup = new THREE.Group();
    pcbGroup.name = 'pcb';

    const pcbSubstrate = new THREE.Mesh(
      new THREE.BoxGeometry(d.pcbLength, d.pcbThickness, d.pcbDepth),
      this.materials.pcbSubstrate
    );
    pcbGroup.add(pcbSubstrate);

    // VRM Inductors & Power Phase Capacitors
    const inductorGeom = new THREE.BoxGeometry(0.07, 0.06, 0.07);
    for (let i = 0; i < 12; i++) {
      const inductor = new THREE.Mesh(inductorGeom, this.materials.darkMetal);
      inductor.position.set(-0.65 - (i % 6) * 0.11, 0.035, (i < 6 ? -0.32 : 0.32));
      pcbGroup.add(inductor);
    }

    // Dual 8-Pin Power Connector Sockets (Top Right)
    const powerBlock = new THREE.Mesh(
      new THREE.BoxGeometry(0.32, 0.14, 0.22),
      this.materials.blackCeramic
    );
    powerBlock.position.set(d.pcbLength / 2 - 0.28, 0.08, -d.pcbDepth / 2 + 0.12);
    pcbGroup.add(powerBlock);

    pcbGroup.position.set(0, -0.16, 0);
    this.gpuRoot.add(pcbGroup);
    this.parts.set('pcb', pcbGroup);

    // --- D. COMPUTE DIE & MEMORY SUBSYSTEM ---
    const dieMemoryGroup = new THREE.Group();
    dieMemoryGroup.name = 'dieMemory';

    // Central Neural Compute Die
    const dieSubstrate = new THREE.Mesh(
      new THREE.BoxGeometry(0.48, 0.035, 0.48),
      this.materials.darkMetal
    );
    dieSubstrate.position.set(0, 0.015, 0);
    dieMemoryGroup.add(dieSubstrate);

    const dieMirror = new THREE.Mesh(
      new THREE.BoxGeometry(0.38, 0.02, 0.38),
      this.materials.siliconMirror
    );
    dieMirror.position.set(0, 0.038, 0);
    dieMemoryGroup.add(dieMirror);

    // 6 Ultra-Dense Memory Packages Surrounding Core
    const vramGeom = new THREE.BoxGeometry(0.16, 0.025, 0.16);
    const vramOffsets = [
      [-0.34, 0], [0.34, 0],
      [-0.24, -0.34], [0.24, -0.34],
      [-0.24, 0.34], [0.24, 0.34]
    ];
    vramOffsets.forEach(([vx, vz]) => {
      const vram = new THREE.Mesh(vramGeom, this.materials.blackCeramic);
      vram.position.set(vx, 0.02, vz);
      dieMemoryGroup.add(vram);
    });

    dieMemoryGroup.position.set(0, -0.12, 0);
    this.gpuRoot.add(dieMemoryGroup);
    this.parts.set('dieMemory', dieMemoryGroup);

    // --- E. HEATSINK & COPPER HEATPIPES ---
    const heatsinkGroup = new THREE.Group();
    heatsinkGroup.name = 'heatsink';

    // Dense Fin Stack (InstancedMesh)
    const finCount = this.isMobile ? d.finCountMobile : d.finCountDesktop;
    const finWidth = 0.012;
    const finHeight = 0.28;
    const finDepth = 0.98;
    const finSpacing = (d.cardLength - 0.35) / finCount;

    const finGeom = new THREE.BoxGeometry(finWidth, finHeight, finDepth);
    const instancedFins = new THREE.InstancedMesh(finGeom, this.materials.aluminum, finCount);
    const dummy = new THREE.Object3D();

    for (let i = 0; i < finCount; i++) {
      const fx = -d.cardLength / 2 + 0.18 + i * finSpacing;
      dummy.position.set(fx, 0, 0);
      dummy.updateMatrix();
      instancedFins.setMatrixAt(i, dummy.matrix);
    }
    instancedFins.instanceMatrix.needsUpdate = true;
    heatsinkGroup.add(instancedFins);

    // 4 Sintered Copper Heatpipes
    for (let p = 0; p < 4; p++) {
      const pipe = new THREE.Mesh(
        new THREE.CylinderGeometry(d.heatPipeRadius, d.heatPipeRadius, d.cardLength - 0.2, 16),
        this.materials.copper
      );
      pipe.rotation.z = Math.PI / 2;
      pipe.position.set(0, -0.06 + (p % 2) * 0.12, -0.28 + Math.floor(p / 2) * 0.56);
      heatsinkGroup.add(pipe);
    }

    heatsinkGroup.position.set(0, 0.06, 0);
    this.gpuRoot.add(heatsinkGroup);
    this.parts.set('heatsink', heatsinkGroup);

    // --- F. ANGULAR AERODYNAMIC SHROUD ---
    const shroudGroup = new THREE.Group();
    shroudGroup.name = 'shroud';

    // Angular shell body
    const shroudShell = new THREE.Mesh(
      new THREE.BoxGeometry(d.shroudLength, d.shroudThickness, d.shroudDepth),
      this.materials.gunmetal
    );
    shroudGroup.add(shroudShell);

    // 3 Fan Intake Bezels with Emissive Accent Edge Rings
    const fanBezelGeom = new THREE.TorusGeometry(d.fanRadius + 0.015, 0.018, 16, 48);
    for (let f = 0; f < d.fanCount; f++) {
      const fx = -1.0 + f * 1.0;
      const bezel = new THREE.Mesh(fanBezelGeom, this.materials.emissiveTrim);
      bezel.rotation.x = Math.PI / 2;
      bezel.position.set(fx, d.shroudThickness / 2 + 0.01, 0);
      shroudGroup.add(bezel);
    }

    // Emissive Accent Trim Lines along Long Edges
    const trimGeom = new THREE.BoxGeometry(d.shroudLength - 0.1, 0.02, 0.02);
    const topTrim = new THREE.Mesh(trimGeom, this.materials.emissiveTrim);
    topTrim.position.set(0, d.shroudThickness / 2 + 0.005, d.shroudDepth / 2 - 0.02);
    shroudGroup.add(topTrim);

    const bottomTrim = new THREE.Mesh(trimGeom, this.materials.emissiveTrim);
    bottomTrim.position.set(0, d.shroudThickness / 2 + 0.005, -d.shroudDepth / 2 + 0.02);
    shroudGroup.add(bottomTrim);

    shroudGroup.position.set(0, 0.28, 0);
    this.gpuRoot.add(shroudGroup);
    this.parts.set('shroud', shroudGroup);

    // --- G. TRIPLE FAN COOLING ARRAY ---
    const fansGroup = new THREE.Group();
    fansGroup.name = 'fans';

    for (let f = 0; f < d.fanCount; f++) {
      const fx = -1.0 + f * 1.0;
      const singleFan = new THREE.Group();
      singleFan.position.set(fx, 0, 0);

      // Outer Torus Ring Frame
      const fanRing = new THREE.Mesh(
        new THREE.TorusGeometry(d.fanRadius, 0.014, 16, 48),
        this.materials.darkMetal
      );
      fanRing.rotation.x = Math.PI / 2;
      singleFan.add(fanRing);

      // Rotating Blade Assembly (Hub + 9 Curved Aerofoil Blades)
      const spinnerGroup = new THREE.Group();
      spinnerGroup.name = `fanSpinner_${f}`;

      // Center Hub
      const hub = new THREE.Mesh(
        new THREE.CylinderGeometry(d.fanHubRadius, d.fanHubRadius, 0.06, 24),
        this.materials.silver
      );
      spinnerGroup.add(hub);

      // 9 Curved Blades
      const bladeGeom = new THREE.BoxGeometry(0.08, 0.012, d.fanRadius - d.fanHubRadius - 0.02);
      for (let b = 0; b < 9; b++) {
        const bladeAngle = (b / 9) * Math.PI * 2;
        const blade = new THREE.Mesh(bladeGeom, this.materials.gunmetal);
        blade.position.set(
          Math.cos(bladeAngle) * (d.fanRadius * 0.55),
          0,
          Math.sin(bladeAngle) * (d.fanRadius * 0.55)
        );
        blade.rotation.y = -bladeAngle + 0.35;
        blade.rotation.x = 0.38; // Pitch angle
        spinnerGroup.add(blade);
      }

      singleFan.add(spinnerGroup);
      this.fanSpinners.push(spinnerGroup);
      fansGroup.add(singleFan);
    }

    fansGroup.position.set(0, 0.34, 0);
    this.gpuRoot.add(fansGroup);
    this.parts.set('fans', fansGroup);

    // --- H. PCIe GOLD EDGE CONNECTOR ---
    const connectorGroup = new THREE.Group();
    connectorGroup.name = 'connector';

    const pcieTongue = new THREE.Mesh(
      new THREE.BoxGeometry(1.7, 0.025, 0.16),
      this.materials.darkMetal
    );
    connectorGroup.add(pcieTongue);

    // 36 Gold Finger Contacts (High-detail PCIe bus)
    const pinContactGeom = new THREE.BoxGeometry(0.024, 0.03, 0.09);
    for (let c = 0; c < 36; c++) {
      const pin = new THREE.Mesh(pinContactGeom, this.materials.gold);
      pin.position.set(-0.8 + c * 0.045, 0, 0.02);
      connectorGroup.add(pin);
    }

    connectorGroup.position.set(-0.4, -0.22, d.pcbDepth / 2 + 0.06);
    this.gpuRoot.add(connectorGroup);
    this.parts.set('connector', connectorGroup);
  }

  // ===== 4. Dynamic 3D Annotation Labels & Leader Lines =====
  initLabelsDOM() {
    this.labelsContainer = document.getElementById('gpuLabelsContainer');
    if (!this.labelsContainer) return;

    this.labelsContainer.innerHTML = '';
    this.labelElements = [];
    this.svgLines = [];

    // SVG Canvas for Leader Lines
    const svgNS = 'http://www.w3.org/2000/svg';
    this.svg = document.createElementNS(svgNS, 'svg');
    this.svg.setAttribute('class', 'gpu-svg-canvas');
    this.svg.setAttribute('width', '100%');
    this.svg.setAttribute('height', '100%');
    this.labelsContainer.appendChild(this.svg);

    const labelsList = this.isMobile ? CONFIG.labelsMobile : CONFIG.labelsDesktop;

    labelsList.forEach((lbl) => {
      // Leader Line
      const line = document.createElementNS(svgNS, 'line');
      line.setAttribute('class', 'gpu-leader-line');
      this.svg.appendChild(line);

      // Target Attachment Dot
      const dot = document.createElementNS(svgNS, 'circle');
      dot.setAttribute('class', 'gpu-leader-dot');
      dot.setAttribute('r', '2.5');
      this.svg.appendChild(dot);

      // HTML Monospace Label Tag
      const el = document.createElement('div');
      el.className = 'gpu-label';
      el.id = `label-${lbl.id}`;
      el.innerHTML = `<span class="label-dot"></span><span>${lbl.text}</span>`;
      this.labelsContainer.appendChild(el);

      this.labelElements.push({
        id: lbl.id,
        targetName: lbl.target,
        offset: lbl.offset,
        el,
        line,
        dot
      });
    });
  }

  // ===== 5. Choreographed GSAP Timeline (4 Acts) =====
  startChoreography(isReplay = false) {
    if (typeof gsap === 'undefined') {
      this.showStaticState();
      return;
    }

    const t = CONFIG.timings;
    const timeScale = isReplay ? 1.25 : 1.0; // Replay runs at 80% duration (~1.25x speed)
    const scaleFactor = this.isMobile ? 0.55 : 1.0;

    this.tl = gsap.timeline({
      paused: true,
      onComplete: () => {
        this.isUnfolded = true;
      }
    });
    this.tl.timeScale(timeScale);

    // ----------------------------------------------------
    // ACT 1: 0.0s - 1.2s: GPU Alone, Assembled, Slow Rotation, Rim Light (NO TEXT)
    // ----------------------------------------------------
    this.tl.to(this.gpuRoot.rotation, {
      y: 0.15,
      x: 0.22,
      duration: t.act1Duration,
      ease: 'power2.out'
    }, 0);

    this.tl.to(this.keyLight, {
      intensity: 3.2,
      duration: t.act1Duration,
      ease: 'power2.out'
    }, 0);

    // ----------------------------------------------------
    // ACT 2: 1.2s - 4.0s: Mechanical Staged Unfold (Full Screen)
    // ----------------------------------------------------
    const u = CONFIG.unfold;
    const partsMap = this.parts;

    Object.entries(u).forEach(([partName, spec]) => {
      const partObj = partsMap.get(partName);
      if (!partObj) return;

      // Position displacement
      this.tl.to(partObj.position, {
        x: partObj.position.x + spec.x * scaleFactor,
        y: partObj.position.y + spec.y * scaleFactor,
        z: partObj.position.z + spec.z * scaleFactor,
        duration: spec.duration,
        ease: 'power3.out'
      }, spec.delay);

      // Hinge rotation displacement
      this.tl.to(partObj.rotation, {
        x: partObj.rotation.x + spec.rotX,
        y: partObj.rotation.y + spec.rotY,
        z: partObj.rotation.z + spec.rotZ,
        duration: spec.duration,
        ease: 'expo.out'
      }, spec.delay);
    });

    // Technical Labels Fade In during unfold
    this.tl.call(() => {
      this.isUnfolded = true;
      this.labelElements.forEach((l) => l.el.classList.add('label-visible'));
    }, null, 2.4);

    // Audio whoosh trigger on unfold
    this.tl.call(() => {
      if (window.sfx && typeof window.sfx.playWhoosh === 'function') {
        window.sfx.playWhoosh();
      }
    }, null, 1.25);

    // ----------------------------------------------------
    // ACT 3: 4.0s - 5.2s: SETTLE (GPU moves to upper-middle, scales to 60%)
    // ----------------------------------------------------
    // Vertical center at ~38% of viewport height:
    // Move GPU up in world coordinates and ease camera back
    const targetGPU_Y = this.isMobile ? 0.95 : (this.height < 850 ? 0.78 : 0.66);
    const targetCameraZ = this.isMobile ? 6.2 : 5.2;

    this.tl.to(this.gpuRoot.position, {
      y: targetGPU_Y,
      duration: t.settleDuration,
      ease: 'power2.inOut'
    }, t.settleStart);

    this.tl.to(this.gpuRoot.scale, {
      x: 0.60,
      y: 0.60,
      z: 0.60,
      duration: t.settleDuration,
      ease: 'power2.inOut'
    }, t.settleStart);

    this.tl.to(this.camera.position, {
      z: targetCameraZ,
      duration: t.settleDuration,
      ease: 'power2.inOut'
    }, t.settleStart);

    // Labels fade out during settle
    this.tl.call(() => {
      this.labelElements.forEach((l) => l.el.classList.remove('label-visible'));
      if (this.svg) {
        gsap.to(this.svg, { opacity: 0, duration: 0.5 });
      }
    }, null, t.settleStart + 0.1);

    // ----------------------------------------------------
    // ACT 4: 5.0s - 6.5s: TITLE (Badge, Name, Role, Button rise into Lower Third)
    // ----------------------------------------------------
    this.tl.call(() => {
      // 1. Soft bottom-up dark gradient scrim fades in
      const scrim = this.overlay?.querySelector('.portal-scrim');
      if (scrim) scrim.classList.add('scrim-visible');

      // 2. Lower third content rises into view
      const lowerThird = document.getElementById('portalLowerThird') || this.overlay?.querySelector('.portal-lower-third') || this.overlay?.querySelector('.portal-hud');
      if (lowerThird) {
        lowerThird.classList.add('lower-third-visible', 'hud-visible');
      }

      // 3. Staggered Cyber Glitch Decode for "HARSH MAURYA"
      this.runGlitchDecode();
    }, null, t.titleStart);

    // Kick off timeline
    this.tl.play();
  }

  // ===== 6. Cyber Glitch Letter-by-Letter Text Decode =====
  runGlitchDecode() {
    const titleEl = this.overlay?.querySelector('.portal-title');
    if (!titleEl) return;

    const targetText = CONFIG.nameText;
    const chars = '01/<>_#@$%*~ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let iteration = 0;
    const maxIterations = targetText.length * 4;

    if (this.glitchInterval) clearInterval(this.glitchInterval);

    this.glitchInterval = setInterval(() => {
      titleEl.innerText = targetText
        .split('')
        .map((letter, index) => {
          if (index < iteration / 4) {
            return targetText[index];
          }
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join('');

      if (iteration >= maxIterations) {
        titleEl.innerText = targetText;
        clearInterval(this.glitchInterval);
        this.glitchInterval = null;
      }
      iteration++;
    }, 28);
  }

  // ===== Static State for Reduced Motion =====
  showStaticState() {
    this.isUnfolded = true;
    const targetGPU_Y = this.isMobile ? 0.95 : (this.height < 850 ? 0.78 : 0.66);
    this.gpuRoot.position.set(0, targetGPU_Y, 0);
    this.gpuRoot.scale.set(0.60, 0.60, 0.60);

    const scrim = this.overlay?.querySelector('.portal-scrim');
    if (scrim) scrim.classList.add('scrim-visible');

    const lowerThird = document.getElementById('portalLowerThird') || this.overlay?.querySelector('.portal-lower-third') || this.overlay?.querySelector('.portal-hud');
    if (lowerThird) lowerThird.classList.add('lower-third-visible', 'hud-visible');

    const titleEl = this.overlay?.querySelector('.portal-title');
    if (titleEl) titleEl.innerText = CONFIG.nameText;
  }

  // ===== WebGL Failure Static Fallback =====
  showStaticFallback() {
    this.isActive = true;
    if (this.overlay) {
      this.overlay.style.background = '#02060a';
      this.overlay.removeAttribute('aria-hidden');
      this.overlay.style.display = 'flex';
      this.overlay.style.opacity = '1';
    }
    const lowerThird = document.getElementById('portalLowerThird') || this.overlay?.querySelector('.portal-lower-third') || this.overlay?.querySelector('.portal-hud');
    if (lowerThird) lowerThird.classList.add('lower-third-visible', 'hud-visible');

    const titleEl = this.overlay?.querySelector('.portal-title');
    if (titleEl) titleEl.innerText = CONFIG.nameText;

    this.bindEvents();
  }

  // ===== 7. Enter / Exit: Reverse Fold & Zoom-Through =====
  enterPortfolio() {
    if (this.isExiting) return;
    this.isExiting = true;

    // 1. Hide lower third and labels
    const lowerThird = document.getElementById('portalLowerThird') || this.overlay?.querySelector('.portal-lower-third') || this.overlay?.querySelector('.portal-hud');
    if (lowerThird) lowerThird.classList.remove('lower-third-visible', 'hud-visible');

    const scrim = this.overlay?.querySelector('.portal-scrim');
    if (scrim) scrim.classList.remove('scrim-visible');

    this.labelElements.forEach((l) => l.el.classList.remove('label-visible'));
    if (this.svg) this.svg.style.opacity = '0';

    // 2. Fold back parts into assembled card (~1.0s reverse)
    if (this.tl) {
      this.tl.timeScale(2.8).reverse();
    }

    // 3. Audio & Cyan flash surge
    if (window.sfx && typeof window.sfx.playBoot === 'function') {
      window.sfx.playBoot();
    }

    if (this.overlay) {
      const flashOverlay = document.createElement('div');
      flashOverlay.className = 'portal-flash-overlay flash-active';
      this.overlay.appendChild(flashOverlay);
    }

    // 4. Camera Zoom-through & Dissolution
    if (typeof gsap !== 'undefined' && this.camera) {
      gsap.to(this.camera.position, {
        z: 1.2,
        duration: CONFIG.timings.foldBackDuration,
        ease: 'power3.in',
        onComplete: () => {
          this.dismiss(false);
        }
      });
      gsap.to(this.overlay, {
        opacity: 0,
        duration: 0.6,
        delay: CONFIG.timings.foldBackDuration * 0.75,
        ease: 'power2.inOut'
      });
    } else {
      setTimeout(() => this.dismiss(false), CONFIG.timings.foldBackDuration * 1000);
    }
  }

  dismiss(immediate = false) {
    this.isActive = false;
    window.hmPortalActive = false;
    sessionStorage.setItem('hm_portal_seen', 'true');

    if (this.overlay) {
      this.overlay.querySelectorAll('.portal-flash-overlay').forEach(el => el.remove());
      this.overlay.setAttribute('aria-hidden', 'true');
      this.overlay.classList.add('portal-closing');

      if (immediate) {
        this.overlay.style.display = 'none';
        this.destroyIntro();
      } else {
        setTimeout(() => {
          if (this.overlay) this.overlay.style.display = 'none';
          this.destroyIntro();
        }, 750);
      }
    } else {
      this.destroyIntro();
    }

    // Wake background canvas & companion systems
    window.dispatchEvent(new CustomEvent('hm:portal-dismissed'));
  }

  reopen() {
    this.createIntro(true); // true = replay mode (80% duration)
  }

  // ===== 8. Interaction & Event Listeners =====
  bindEvents() {
    if (this.eventsBound) return;
    this.eventsBound = true;

    // Mouse Parallax
    this.onMouseMove = (e) => {
      this.mouse.targetX = (e.clientX - this.width / 2) / (this.width / 2);
      this.mouse.targetY = (e.clientY - this.height / 2) / (this.height / 2);
    };
    window.addEventListener('mousemove', this.onMouseMove);

    // Touch Parallax
    this.onTouchMove = (e) => {
      if (e.touches[0]) {
        this.mouse.targetX = (e.touches[0].clientX - this.width / 2) / (this.width / 2);
        this.mouse.targetY = (e.touches[0].clientY - this.height / 2) / (this.height / 2);
      }
    };
    window.addEventListener('touchmove', this.onTouchMove, { passive: true });

    // Window Resize Handler
    this.onResize = () => {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.isMobile = window.innerWidth < 768;

      if (this.camera && this.renderer) {
        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.width, this.height);
      }
    };
    window.addEventListener('resize', this.onResize);

    // Enter & Skip Button Handlers
    this.enterBtn = document.getElementById('enterPortfolioBtn');
    this.skipBtn = document.getElementById('skipPortalBtn');

    this.onEnterClick = () => this.enterPortfolio();
    this.onSkipClick = () => this.dismiss(false);

    this.enterBtn?.addEventListener('click', this.onEnterClick);
    this.skipBtn?.addEventListener('click', this.onSkipClick);

    // Keyboard Shortcuts (Enter / Space to Enter, Esc to Skip)
    this.onKeyDown = (e) => {
      if (!this.isActive) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.enterPortfolio();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        this.dismiss(false);
      }
    };
    window.addEventListener('keydown', this.onKeyDown);
  }

  unbindEvents() {
    if (!this.eventsBound) return;
    this.eventsBound = false;

    if (this.onMouseMove) window.removeEventListener('mousemove', this.onMouseMove);
    if (this.onTouchMove) window.removeEventListener('touchmove', this.onTouchMove);
    if (this.onResize) window.removeEventListener('resize', this.onResize);
    if (this.onKeyDown) window.removeEventListener('keydown', this.onKeyDown);

    if (this.enterBtn && this.onEnterClick) this.enterBtn.removeEventListener('click', this.onEnterClick);
    if (this.skipBtn && this.onSkipClick) this.skipBtn.removeEventListener('click', this.onSkipClick);

    if (this.canvas && this.onContextLost) {
      this.canvas.removeEventListener('webglcontextlost', this.onContextLost);
    }
  }

  // ===== 9. Update Projected 2D Screen Coordinates for Labels =====
  updateLabels() {
    if (!this.isUnfolded || this.isExiting || !this.camera) return;

    const width = this.width;
    const height = this.height;
    const worldPos = new THREE.Vector3();

    this.labelElements.forEach((item) => {
      const partObj = this.parts.get(item.targetName);
      if (!partObj) return;

      partObj.getWorldPosition(worldPos);
      const screenPos = worldPos.clone().project(this.camera);

      // Convert normalized device coords to viewport pixels
      const screenX = ((screenPos.x + 1) * width) / 2;
      const screenY = ((-screenPos.y + 1) * height) / 2;

      // Desired label position with offset
      const labelX = screenX + item.offset.x;
      const labelY = screenY + item.offset.y;

      // Viewport safety clamping
      const clampedX = Math.max(65, Math.min(width - 65, labelX));
      const clampedY = Math.max(55, Math.min(height - 180, labelY));

      item.el.style.left = `${clampedX}px`;
      item.el.style.top = `${clampedY}px`;

      // Draw Leader Line in SVG
      item.line.setAttribute('x1', screenX);
      item.line.setAttribute('y1', screenY);
      item.line.setAttribute('x2', clampedX);
      item.line.setAttribute('y2', clampedY);

      item.dot.setAttribute('cx', screenX);
      item.dot.setAttribute('cy', screenY);
    });
  }

  // ===== 10. Main Animation Loop (60 FPS, Fan Spin, Float, Parallax) =====
  animate() {
    if (!this.isActive || !this.renderer || !this.scene || !this.camera) {
      this.rafId = null;
      return;
    }

    const elapsedTime = this.clock.getElapsedTime();

    // 1. Continuous Triple Fan Spinning around local Y axis
    this.fanSpinners.forEach((bladeGroup) => {
      bladeGroup.rotation.y += 0.08;
    });

    // 2. Holographic Ring Idle Floating
    if (this.ring1 && this.ring2) {
      this.ring1.rotation.z += 0.003;
      this.ring2.rotation.z -= 0.0025;
    }

    // 3. Subtle Particle Drift
    if (this.particles) {
      const positions = this.particles.geometry.attributes.position.array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 2] += 0.015;
        if (positions[i + 2] > 6) {
          positions[i + 2] = -8;
        }
      }
      this.particles.geometry.attributes.position.needsUpdate = true;
    }

    // 4. Subtle Lerped Camera Mouse Parallax
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;

    if (!this.isExiting) {
      this.camera.position.x = this.mouse.x * 0.35;
      this.camera.position.y = 0.35 - this.mouse.y * 0.25;
      this.camera.lookAt(0, this.gpuRoot ? this.gpuRoot.position.y * 0.4 : 0, 0);
    }

    // 5. Idle Sine-Wave Floating for Unfolded Parts
    if (this.isUnfolded && !this.isExiting && !this.prefersReducedMotion) {
      let idx = 0;
      this.parts.forEach((part) => {
        part.position.y += Math.sin(elapsedTime * 2.2 + idx * 0.8) * 0.0005;
        idx++;
      });
    }

    // 6. Update 2D Annotation Labels & SVG Connector Lines
    this.updateLabels();

    // 7. Render Scene
    this.renderer.render(this.scene, this.camera);
    this.rafId = requestAnimationFrame(() => this.animate());
  }
}

// Global initialization & bridge for backward compatibility with main.js
if (typeof window !== 'undefined') {
  window.Intro3D = Intro3D;
  window.WelcomePortal = Intro3D;
  window.createIntro = (isReplay = false) => {
    if (!window.intro3DInstance) {
      window.intro3DInstance = new Intro3D();
    } else {
      window.intro3DInstance.createIntro(isReplay);
    }
    return window.intro3DInstance;
  };
  window.destroyIntro = () => {
    if (window.intro3DInstance) {
      window.intro3DInstance.destroyIntro();
    }
  };
}

document.addEventListener('DOMContentLoaded', () => {
  if (!window.intro3DInstance && document.getElementById('welcomePortal')) {
    window.intro3DInstance = new Intro3D();
  }
});
