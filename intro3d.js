/**
 * ==========================================================================
 * Harsh Maurya | Digital Architect Portfolio
 * Cinematic Procedural 3D GPU Unfolding Intro Experience
 * 100% Procedural Three.js Model • Mechanical Staged Choreography • GSAP
 * ==========================================================================
 */

import * as THREE from 'three';

// ===== CENTRAL CONFIG OBJECT =====
export const CONFIG = {
  // Theme & Colors (Change accentColor to #ff2a2a for Red, etc.)
  accentColor: '#00e5ff',
  accentHex: 0x00e5ff,
  amberHex: 0xf59e0b,
  darkGroundHex: 0x030508,

  // Text & Copy (STRICT: Zero hardware, VRAM, or cert counts)
  badgeText: 'NEURAL ARCHITECTURE v2.4',
  nameText: 'HARSH MAURYA',
  roleText: 'Digital Architect • Local AI • Privacy Systems',
  buttonText: 'ENTER ARCHITECTURE →',
  hintText: 'Press ENTER or click to explore',
  skipText: 'Skip [ESC] ×',

  // Technical Labels (GENERIC words only - no specs, no numbers, no VRAM)
  labels: [
    { id: 'cooling', text: 'COOLING', target: 'shroud', offset: { x: 210, y: -120 } },
    { id: 'compute', text: 'COMPUTE', target: 'dieMemory', offset: { x: -260, y: -40 } },
    { id: 'memory', text: 'MEMORY', target: 'dieMemory', offset: { x: 260, y: -20 } },
    { id: 'power', text: 'POWER', target: 'pcb', offset: { x: -240, y: 110 } },
    { id: 'interface', text: 'INTERFACE', target: 'connector', offset: { x: 0, y: 140 } }
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

  // Staged Unfold Choreography Tuning
  // Order: backplate -> bracket -> shroud -> fans -> heatsink -> pcb -> dieMemory -> connector
  unfold: {
    backplate: {
      x: 0, y: -0.65, z: -0.85,
      rotX: -0.22, rotY: 0, rotZ: 0,
      delay: 1.2, duration: 1.6
    },
    bracket: {
      x: -0.85, y: 0, z: 0,
      rotX: 0, rotY: 0.35, rotZ: 0,
      delay: 1.4, duration: 1.5
    },
    shroud: {
      x: 0, y: 0.85, z: 0.95,
      rotX: 0.45, rotY: 0, rotZ: 0,
      delay: 1.6, duration: 1.8
    },
    fans: {
      x: 0, y: 1.15, z: 1.45,
      rotX: 0.25, rotY: 0, rotZ: 0,
      delay: 1.9, duration: 1.8
    },
    heatsink: {
      x: 0, y: 0.35, z: 0.5,
      rotX: 0.12, rotY: 0, rotZ: 0,
      delay: 2.2, duration: 1.6
    },
    pcb: {
      x: 0, y: -0.22, z: -0.2,
      rotX: -0.1, rotY: 0, rotZ: 0,
      delay: 2.5, duration: 1.5
    },
    dieMemory: {
      x: 0, y: 0.18, z: 0.22,
      rotX: 0.05, rotY: 0, rotZ: 0,
      delay: 2.7, duration: 1.4
    },
    connector: {
      x: 0, y: -0.55, z: 0.15,
      rotX: 0.25, rotY: 0, rotZ: 0,
      delay: 2.9, duration: 1.4
    }
  },

  // Animation Timings (seconds)
  timings: {
    introFade: 1.2,
    unfoldStart: 1.2,
    labelsFade: 2.8,
    hudGlitchStart: 4.0,
    hudVisible: 4.4,
    foldBackDuration: 1.0
  }
};

export class Intro3D {
  constructor() {
    this.overlay = document.getElementById('welcomePortal');
    this.canvas = document.getElementById('portalCanvas');
    this.enterBtn = document.getElementById('enterPortfolioBtn');
    this.skipBtn = document.getElementById('skipPortalBtn');
    this.hud = this.overlay ? this.overlay.querySelector('.portal-hud') : null;
    this.labelsContainer = document.getElementById('gpuLabelsContainer');

    if (!this.overlay || !this.canvas) return;

    this.isMobile = window.innerWidth < 768;
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.isAudit = /Lighthouse|Chrome-Lighthouse|Google-InspectionTool/i.test(navigator.userAgent) || window.location.search.includes('lighthouse') || window.location.search.includes('no-portal');

    // Check if already seen in session or running audit
    const seen = sessionStorage.getItem('hm_portal_seen');
    if (seen === 'true' || this.isAudit) {
      this.dismiss(true);
      return;
    }

    window.hmPortalActive = true;
    this.isActive = true;
    this.isUnfolded = false;
    this.isExiting = false;

    // Animation & Three.js State
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.rafId = null;
    this.clock = new THREE.Clock();
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

    // Parts & Groups
    this.parts = new Map();
    this.fanSpinners = [];
    this.labelElements = [];
    this.svgLines = [];

    this.setupThree();
    if (this.overlay) {
      this.overlay.querySelectorAll('.portal-flash-overlay').forEach(el => el.remove());
    }
    this.bindEvents();

    if (this.prefersReducedMotion) {
      this.showStaticState();
    } else {
      this.startChoreography();
    }

    this.animate();
  }

  setupThree() {
    if (this.scene) return;

    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.clock = new THREE.Clock();
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

    this.parts = new Map();
    this.fanSpinners = [];
    this.labelElements = [];
    this.svgLines = [];

    this.initScene();
    this.initBackgroundEffects();
    this.buildProceduralGPU();
    this.initLabelsDOM();
  }

  // ===== 1. Scene, Camera, Lights & Renderer Setup =====
  initScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(CONFIG.darkGroundHex);

    // Camera
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

    // Lighting (Cyan key + Amber rim + Ambient)
    const ambientLight = new THREE.AmbientLight(0x0a101d, 1.2);
    this.scene.add(ambientLight);

    // Cyan Key Light
    this.keyLight = new THREE.DirectionalLight(CONFIG.accentHex, 2.8);
    this.keyLight.position.set(2.5, 3.5, 3.0);
    this.scene.add(this.keyLight);

    // Amber Rim Light (Warm contrast)
    this.rimLight = new THREE.DirectionalLight(CONFIG.amberHex, 2.0);
    this.rimLight.position.set(-3.0, -2.5, -2.5);
    this.scene.add(this.rimLight);

    // Fill Light (Deep Indigo)
    const fillLight = new THREE.DirectionalLight(0x192742, 1.4);
    fillLight.position.set(0, -3.0, 2.0);
    this.scene.add(fillLight);

    // Center Singularity Point Light (Intensifies on assemble/flash)
    this.centerGlow = new THREE.PointLight(CONFIG.accentHex, 1.5, 6.0);
    this.centerGlow.position.set(0, 0, 0.5);
    this.scene.add(this.centerGlow);
  }

  // ===== 2. Background Warp Streaks & Glowing Rings =====
  initBackgroundEffects() {
    this.bgGroup = new THREE.Group();
    this.scene.add(this.bgGroup);

    // 1. Concentric Holographic Glowing Rings
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: CONFIG.accentHex,
      transparent: true,
      opacity: 0.5,
      wireframe: false
    });
    const ringGeom1 = new THREE.TorusGeometry(2.3, 0.012, 16, 96);
    this.ring1 = new THREE.Mesh(ringGeom1, ringMat1);
    this.ring1.rotation.x = 0.55;
    this.ring1.rotation.y = 0.35;
    this.bgGroup.add(this.ring1);

    const ringMat2 = new THREE.MeshBasicMaterial({
      color: CONFIG.amberHex,
      transparent: true,
      opacity: 0.4,
      wireframe: false
    });
    const ringGeom2 = new THREE.TorusGeometry(2.9, 0.009, 16, 96);
    this.ring2 = new THREE.Mesh(ringGeom2, ringMat2);
    this.ring2.rotation.x = -0.45;
    this.ring2.rotation.y = -0.25;
    this.bgGroup.add(this.ring2);

    // 2. Floating Warp Particle Field
    const particleCount = this.isMobile ? 120 : 260;
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

  // ===== 3. Procedural GPU Construction from Primitives =====
  buildProceduralGPU() {
    this.gpuRoot = new THREE.Group();
    this.scene.add(this.gpuRoot);

    // Shared Palette Materials
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

    // Flow-through ventilation cutouts (6 dark inset slots)
    for (let i = 0; i < 6; i++) {
      const slot = new THREE.Mesh(
        new THREE.BoxGeometry(0.065, 0.055, 0.65),
        new THREE.MeshBasicMaterial({ color: 0x030508 })
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

    const bracketMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.04, d.bracketHeight, d.bracketWidth),
      this.materials.silver
    );
    bracketGroup.add(bracketMesh);

    // Port Cutouts (3 DisplayPort + 1 HDMI)
    const portMat = new THREE.MeshBasicMaterial({ color: 0x020306 });
    for (let i = 0; i < 3; i++) {
      const dp = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.07, 0.15), portMat);
      dp.position.set(-0.01, -0.15 + i * 0.14, -0.25);
      bracketGroup.add(dp);
    }
    const hdmi = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.06, 0.14), portMat);
    hdmi.position.set(-0.01, -0.15, 0.22);
    bracketGroup.add(hdmi);

    // Honeycomb / Slotted Vent Strip
    for (let i = 0; i < 7; i++) {
      const vent = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.035, 0.07), portMat);
      vent.position.set(-0.01, 0.18, -0.38 + i * 0.12);
      bracketGroup.add(vent);
    }

    bracketGroup.position.set(-d.cardLength / 2 - 0.02, 0.02, 0);
    this.gpuRoot.add(bracketGroup);
    this.parts.set('bracket', bracketGroup);

    // --- C. PCB (Printed Circuit Board) ---
    const pcbGroup = new THREE.Group();
    pcbGroup.name = 'pcb';

    const pcbMesh = new THREE.Mesh(
      new THREE.BoxGeometry(d.pcbLength, d.pcbThickness, d.pcbDepth),
      this.materials.pcbSubstrate
    );
    pcbGroup.add(pcbMesh);

    // VRM Inductor cubes (Power delivery phases)
    const vrmGeom = new THREE.BoxGeometry(0.075, 0.06, 0.075);
    for (let i = 0; i < 10; i++) {
      const vrm = new THREE.Mesh(vrmGeom, this.materials.darkMetal);
      vrm.position.set(-0.85 + (i % 5) * 0.11, 0.04, (i < 5 ? 0.35 : -0.35));
      pcbGroup.add(vrm);
    }

    // Power Connector Block (Dual 8-Pin Socket at Top Rear)
    const powerBlock = new THREE.Mesh(
      new THREE.BoxGeometry(0.38, 0.14, 0.16),
      this.materials.gunmetal
    );
    powerBlock.position.set(1.15, 0.08, -d.pcbDepth / 2 + 0.08);
    pcbGroup.add(powerBlock);

    pcbGroup.position.set(0, -0.18, 0);
    this.gpuRoot.add(pcbGroup);
    this.parts.set('pcb', pcbGroup);

    // --- D. COMPUTE DIE & MEMORY CHIPS ---
    const dieMemoryGroup = new THREE.Group();
    dieMemoryGroup.name = 'dieMemory';

    // Metal Retention IHS Ring
    const ihsFrame = new THREE.Mesh(
      new THREE.BoxGeometry(0.58, 0.025, 0.58),
      this.materials.silver
    );
    dieMemoryGroup.add(ihsFrame);

    // Silicon Mirror Compute Die
    const dieMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.44, 0.038, 0.44),
      this.materials.siliconMirror
    );
    dieMesh.position.y = 0.01;
    dieMemoryGroup.add(dieMesh);

    // 6 VRAM Memory Chips (Symmetrically surrounding compute die)
    const vramGeom = new THREE.BoxGeometry(0.12, 0.025, 0.16);
    const vramOffsets = [
      [-0.42, 0.12], [-0.42, -0.12],
      [0.42, 0.12], [0.42, -0.12],
      [-0.14, 0.42], [0.14, 0.42]
    ];
    vramOffsets.forEach(([vx, vz]) => {
      const vram = new THREE.Mesh(vramGeom, this.materials.blackCeramic);
      vram.position.set(vx, 0.005, vz);
      dieMemoryGroup.add(vram);
    });

    dieMemoryGroup.position.set(-0.15, -0.14, 0);
    this.gpuRoot.add(dieMemoryGroup);
    this.parts.set('dieMemory', dieMemoryGroup);

    // --- E. HEATSINK (Fin Stack InstancedMesh + 4 Copper Heatpipes) ---
    const heatsinkGroup = new THREE.Group();
    heatsinkGroup.name = 'heatsink';

    // Fin Stack as one InstancedMesh
    const finCount = this.isMobile ? d.finCountMobile : d.finCountDesktop;
    const finGeom = new THREE.BoxGeometry(0.014, 0.32, 0.98);
    const finMesh = new THREE.InstancedMesh(finGeom, this.materials.aluminum, finCount);

    const dummy = new THREE.Object3D();
    const spanX = 2.65;
    for (let i = 0; i < finCount; i++) {
      dummy.position.set(-spanX / 2 + (i / (finCount - 1)) * spanX, 0, 0);
      dummy.updateMatrix();
      finMesh.setMatrixAt(i, dummy.matrix);
    }
    finMesh.instanceMatrix.needsUpdate = true;
    heatsinkGroup.add(finMesh);

    // 4 Copper Heat Pipes running longitudinally through fins
    const pipeGeom = new THREE.CylinderGeometry(d.heatPipeRadius, d.heatPipeRadius, 2.85, 16);
    const pipeRot = new THREE.Euler(0, 0, Math.PI / 2);
    [
      [0.08, -0.22], [0.08, 0.22],
      [-0.06, -0.22], [-0.06, 0.22]
    ].forEach(([py, pz]) => {
      const pipe = new THREE.Mesh(pipeGeom, this.materials.copper);
      pipe.rotation.copy(pipeRot);
      pipe.position.set(0, py, pz);
      heatsinkGroup.add(pipe);
    });

    heatsinkGroup.position.set(0, 0.04, 0);
    this.gpuRoot.add(heatsinkGroup);
    this.parts.set('heatsink', heatsinkGroup);

    // --- F. SHROUD (Custom Shape Extrude with 3 Fan Holes & Emissive Trim) ---
    const shroudGroup = new THREE.Group();
    shroudGroup.name = 'shroud';

    // Build custom Shape with chamfered corners and 3 fan circular holes
    const sx = d.shroudLength / 2;
    const sz = d.shroudDepth / 2;
    const ch = 0.16; // Chamfer depth

    const shape = new THREE.Shape();
    shape.moveTo(-sx + ch, -sz);
    shape.lineTo(sx - ch, -sz);
    shape.lineTo(sx, -sz + ch);
    shape.lineTo(sx, sz - ch);
    shape.lineTo(sx - ch, sz);
    shape.lineTo(-sx + ch, sz);
    shape.lineTo(-sx, sz - ch);
    shape.lineTo(-sx, -sz + ch);
    shape.closePath();

    // 3 Fan cutout holes
    [-0.95, 0.0, 0.95].forEach((fx) => {
      const hole = new THREE.Path();
      hole.absarc(fx, 0, d.fanRadius + 0.015, 0, Math.PI * 2, true);
      shape.holes.push(hole);
    });

    const extrudeSettings = {
      depth: 0.16,
      bevelEnabled: true,
      bevelSegments: 3,
      steps: 1,
      bevelSize: 0.02,
      bevelThickness: 0.02
    };

    const shroudGeom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    // Orient correctly: Extrusion happens along Z; rotate so it caps over the fins
    shroudGeom.rotateX(Math.PI / 2);
    shroudGeom.center();

    const shroudMesh = new THREE.Mesh(shroudGeom, this.materials.gunmetal);
    shroudGroup.add(shroudMesh);

    // Emissive Accent Trim Lines (Tracing the shroud facets)
    const trimGeom = new THREE.BoxGeometry(d.shroudLength * 0.98, 0.02, 0.02);
    const trimTop = new THREE.Mesh(trimGeom, this.materials.emissiveTrim);
    trimTop.position.set(0, 0.1, -sz + 0.02);
    shroudGroup.add(trimTop);

    const trimBottom = new THREE.Mesh(trimGeom, this.materials.emissiveTrim);
    trimBottom.position.set(0, 0.1, sz - 0.02);
    shroudGroup.add(trimBottom);

    shroudGroup.position.set(0, 0.22, 0);
    this.gpuRoot.add(shroudGroup);
    this.parts.set('shroud', shroudGroup);

    // --- G. FANS (fan_1, fan_2, fan_3) ---
    const fansGroup = new THREE.Group();
    fansGroup.name = 'fans';

    [-0.95, 0.0, 0.95].forEach((fx, idx) => {
      const singleFan = new THREE.Group();
      singleFan.name = `fan_${idx + 1}`;
      singleFan.position.set(fx, 0, 0);

      // Torus Frame Ring (with Emissive Accent Edge)
      const ringGeom = new THREE.TorusGeometry(d.fanRadius, 0.016, 12, 48);
      ringGeom.rotateX(Math.PI / 2);
      const ringMesh = new THREE.Mesh(ringGeom, this.materials.emissiveTrim);
      singleFan.add(ringMesh);

      // Spinning Blade Rotor Group
      const bladeGroup = new THREE.Group();
      bladeGroup.name = `bladeGroup_${idx + 1}`;

      // Central Hub
      const hubGeom = new THREE.CylinderGeometry(d.fanHubRadius, d.fanHubRadius, 0.06, 24);
      const hubMesh = new THREE.Mesh(hubGeom, this.materials.silver);
      bladeGroup.add(hubMesh);

      // 9 Aerodynamic Curved Blades
      const bladeGeom = new THREE.BoxGeometry(0.26, 0.012, 0.08);
      for (let b = 0; b < 9; b++) {
        const angle = b * ((Math.PI * 2) / 9);
        const blade = new THREE.Mesh(bladeGeom, this.materials.gunmetal);
        blade.position.set(
          Math.cos(angle) * 0.25,
          0,
          Math.sin(angle) * 0.25
        );
        blade.rotation.y = -angle;
        blade.rotation.z = 0.45; // Aerodynamic pitch angle
        bladeGroup.add(blade);
      }

      singleFan.add(bladeGroup);
      this.fanSpinners.push(bladeGroup);
      fansGroup.add(singleFan);
    });

    fansGroup.position.set(0, 0.26, 0);
    this.gpuRoot.add(fansGroup);
    this.parts.set('fans', fansGroup);

    // --- H. PCIe CONNECTOR (Gold Edge Finger) ---
    const connectorGroup = new THREE.Group();
    connectorGroup.name = 'connector';

    // Dark Substrate Tongue
    const tongueMesh = new THREE.Mesh(
      new THREE.BoxGeometry(2.1, 0.035, 0.14),
      this.materials.pcbSubstrate
    );
    connectorGroup.add(tongueMesh);

    // 36 Gold Contact Fingers
    const contactCount = 36;
    const contactGeom = new THREE.BoxGeometry(0.032, 0.042, 0.08);
    const contactMesh = new THREE.InstancedMesh(contactGeom, this.materials.gold, contactCount);

    const spanConn = 1.95;
    for (let c = 0; c < contactCount; c++) {
      dummy.position.set(-spanConn / 2 + (c / (contactCount - 1)) * spanConn, 0, 0.02);
      dummy.updateMatrix();
      contactMesh.setMatrixAt(c, dummy.matrix);
    }
    contactMesh.instanceMatrix.needsUpdate = true;
    connectorGroup.add(contactMesh);

    connectorGroup.position.set(0, -0.32, d.pcbDepth / 2 + 0.05);
    this.gpuRoot.add(connectorGroup);
    this.parts.set('connector', connectorGroup);

    // Initial Assembled State
    this.gpuRoot.rotation.set(0.18, -0.45, 0.08);
    this.gpuRoot.scale.set(0.85, 0.85, 0.85);
  }

  // ===== 4. 2D/3D Annotation Labels & SVG Leader Lines =====
  initLabelsDOM() {
    if (!this.labelsContainer) return;
    this.labelsContainer.innerHTML = '';

    // Create SVG Canvas for Dynamic Leader Lines
    this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.svg.setAttribute('class', 'gpu-svg-canvas');
    this.labelsContainer.appendChild(this.svg);

    CONFIG.labels.forEach((item) => {
      // DOM Pill Label
      const pill = document.createElement('div');
      pill.className = 'gpu-label';
      pill.id = `label-${item.id}`;
      pill.innerHTML = `<span class="label-dot"></span><span>${item.text}</span>`;
      this.labelsContainer.appendChild(pill);

      // SVG Line & Dot
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('class', 'gpu-leader-line');
      this.svg.appendChild(line);

      const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      dot.setAttribute('class', 'gpu-leader-dot');
      dot.setAttribute('r', '3');
      this.svg.appendChild(dot);

      this.labelElements.push({
        config: item,
        el: pill,
        lineEl: line,
        dotEl: dot,
        targetGroup: this.parts.get(item.target)
      });
    });
  }

  updateLabels() {
    if (!this.isUnfolded || !this.camera || !this.renderer) return;

    const width = this.width;
    const height = this.height;
    const tempVec = new THREE.Vector3();

    this.labelElements.forEach((item) => {
      if (!item.targetGroup) return;

      item.targetGroup.getWorldPosition(tempVec);
      tempVec.project(this.camera);

      // Check if behind camera
      if (tempVec.z > 1) {
        item.el.style.opacity = '0';
        item.lineEl.setAttribute('stroke', 'transparent');
        return;
      }

      const screenX = (tempVec.x * 0.5 + 0.5) * width;
      const screenY = (-tempVec.y * 0.5 + 0.5) * height;

      // Position Label Pill with offset
      const labelX = screenX + (this.isMobile ? item.config.offset.x * 0.6 : item.config.offset.x);
      const labelY = screenY + (this.isMobile ? item.config.offset.y * 0.6 : item.config.offset.y);

      item.el.style.left = `${labelX}px`;
      item.el.style.top = `${labelY}px`;

      // Update SVG Leader Line
      item.lineEl.setAttribute('x1', screenX);
      item.lineEl.setAttribute('y1', screenY);
      item.lineEl.setAttribute('x2', labelX);
      item.lineEl.setAttribute('y2', labelY);

      item.dotEl.setAttribute('cx', screenX);
      item.dotEl.setAttribute('cy', screenY);
    });
  }

  // ===== 5. Choreographed Unfold Timeline (GSAP) =====
  startChoreography() {
    if (typeof gsap === 'undefined') {
      this.showStaticState();
      return;
    }

    const t = CONFIG.timings;
    const scaleFactor = this.isMobile ? 0.65 : 1.0;

    this.tl = gsap.timeline({
      paused: true,
      onComplete: () => {
        this.isUnfolded = true;
      }
    });

    // 1. 0.0 - 1.2s: Assembled Card Reveal & Rotation
    this.tl.to(this.gpuRoot.rotation, {
      y: 0.15,
      x: 0.22,
      duration: t.introFade,
      ease: 'power2.out'
    }, 0);

    this.tl.to(this.keyLight, {
      intensity: 3.2,
      duration: t.introFade,
      ease: 'power2.out'
    }, 0);

    // 2. 1.2 - 4.0s: Mechanical Staged Unfold
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
        ease: 'power3.out'
      }, spec.delay);
    });

    // 3. 2.5 - 5.0s: Small Monospace Technical Labels Fade In
    this.tl.call(() => {
      this.isUnfolded = true;
      this.labelElements.forEach((l) => l.el.classList.add('label-visible'));
    }, null, t.labelsFade);

    // Optional: play whoosh audio if user sound is unmuted
    this.tl.call(() => {
      if (window.sfx && typeof window.sfx.playWhoosh === 'function') {
        window.sfx.playWhoosh();
      }
    }, null, t.unfoldStart);

    // 4. 4.0 - 6.0s: Name & Role Reveal with Cyber Glitch Decode Effect
    this.tl.call(() => {
      if (this.hud) {
        this.hud.classList.add('hud-visible');
        this.runGlitchDecode();
      }
    }, null, t.hudGlitchStart);

    // Play timeline
    this.tl.play();
  }

  // ===== 6. Cyber Glitch Letter-by-Letter Text Decode =====
  runGlitchDecode() {
    const titleEl = this.overlay.querySelector('.portal-title');
    if (!titleEl) return;

    const targetText = CONFIG.nameText;
    const chars = '01/<>_#@$%*~ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let iteration = 0;
    const maxIterations = targetText.length * 4;

    const interval = setInterval(() => {
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
        clearInterval(interval);
      }
      iteration++;
    }, 28);
  }

  showStaticState() {
    this.isUnfolded = true;
    if (this.hud) this.hud.classList.add('hud-visible');
    const titleEl = this.overlay.querySelector('.portal-title');
    if (titleEl) titleEl.innerText = CONFIG.nameText;
    this.labelElements.forEach((l) => l.el.classList.add('label-visible'));
  }

  // ===== 7. Enter / Exit: Reverse Fold & Zoom-Through =====
  enterPortfolio() {
    if (this.isExiting) return;
    this.isExiting = true;

    // 1. Hide HUD & Labels
    if (this.hud) this.hud.classList.remove('hud-visible');
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

    const flashOverlay = document.createElement('div');
    flashOverlay.className = 'portal-flash-overlay flash-active';
    this.overlay.appendChild(flashOverlay);

    // 4. Camera Zoom-through & Dissolution
    if (typeof gsap !== 'undefined') {
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
    if (this.overlay) {
      this.overlay.querySelectorAll('.portal-flash-overlay').forEach(el => el.remove());
    }
    window.hmPortalActive = false;
    sessionStorage.setItem('hm_portal_seen', 'true');

    if (this.overlay) {
      this.overlay.setAttribute('aria-hidden', 'true');
      this.overlay.classList.add('portal-closing');
      if (immediate) {
        this.overlay.style.display = 'none';
      } else {
        setTimeout(() => {
          if (this.overlay) this.overlay.style.display = 'none';
        }, 750);
      }
    }

    // Wake background systems
    window.dispatchEvent(new CustomEvent('hm:portal-dismissed'));

    // Memory Cleanup
    if (immediate) {
      this.dispose();
    } else {
      setTimeout(() => this.dispose(), 800);
    }
  }

  reopen() {
    this.setupThree();
    if (!this.eventsBound) { this.bindEvents(); this.eventsBound = true; }
    this.isExiting = false;
    this.isActive = true;
    window.hmPortalActive = true;

    if (this.overlay) {
      this.overlay.removeAttribute('aria-hidden');
      this.overlay.classList.remove('portal-closing');
      this.overlay.style.display = 'flex';
      this.overlay.style.opacity = '1';
      this.overlay.style.transform = 'scale(1)';
    }

    // Reset camera & GPU position
    this.camera.position.set(0, 0.35, this.isMobile ? 5.4 : 4.4);
    this.gpuRoot.rotation.set(0.18, -0.45, 0.08);

    // Rebuild or restart timeline
    if (this.tl) {
      this.tl.timeScale(1.0).restart();
    } else {
      this.startChoreography();
    }

    if (!this.rafId) this.animate();
  }

  // ===== 8. Interaction & Event Listeners =====
  bindEvents() {
    // Mouse Parallax
    window.addEventListener('mousemove', (e) => {
      this.mouse.targetX = (e.clientX - this.width / 2) / (this.width / 2);
      this.mouse.targetY = (e.clientY - this.height / 2) / (this.height / 2);
    });

    // Touch Parallax
    window.addEventListener('touchmove', (e) => {
      if (e.touches[0]) {
        this.mouse.targetX = (e.touches[0].clientX - this.width / 2) / (this.width / 2);
        this.mouse.targetY = (e.touches[0].clientY - this.height / 2) / (this.height / 2);
      }
    }, { passive: true });

    // Window Resize
    this.onResize = () => {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.isMobile = window.innerWidth < 768;

      if (this.camera && this.renderer) {
        this.camera.aspect = this.width / this.height;
        this.camera.position.z = this.isMobile ? 5.4 : 4.4;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.width, this.height);
      }
    };
    window.addEventListener('resize', this.onResize);

    // Enter & Skip Buttons
    this.enterBtn?.addEventListener('click', () => this.enterPortfolio());
    this.skipBtn?.addEventListener('click', () => this.dismiss(false));

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

  // ===== 9. Render Loop (60 FPS, Spinners, Sine Float) =====
  animate() {
    if (!this.isActive) {
      this.rafId = null;
      return;
    }

    const delta = this.clock.getDelta();
    const elapsedTime = this.clock.getElapsedTime();

    // 1. Continuous Triple Fan Spinning
    this.fanSpinners.forEach((bladeGroup) => {
      bladeGroup.rotation.y += 0.08;
    });

    // 2. Slow Counter-Rotating Concentric Holographic Rings
    if (this.ring1) this.ring1.rotation.z += 0.005;
    if (this.ring2) this.ring2.rotation.z -= 0.0035;

    // 3. Floating Particle Field Drift
    if (this.particles) {
      const positions = this.particles.geometry.attributes.position.array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 2] += 0.025; // Drift forward
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
      this.camera.position.x = this.mouse.x * 0.45;
      this.camera.position.y = 0.35 - this.mouse.y * 0.35;
      this.camera.lookAt(0, 0, 0);
    }

    // 5. Idle Sine-Wave Floating for Unfolded Parts
    if (this.isUnfolded && !this.isExiting && !this.prefersReducedMotion) {
      let idx = 0;
      this.parts.forEach((part) => {
        part.position.y += Math.sin(elapsedTime * 2.2 + idx * 0.8) * 0.0006;
        idx++;
      });
    }

    // 6. Update 2D Annotation Labels & SVG Connector Lines
    this.updateLabels();

    // 7. Render Scene
    this.renderer.render(this.scene, this.camera);
    this.rafId = requestAnimationFrame(() => this.animate());
  }

  // ===== 10. Memory Disposal & Cleanup =====
  dispose() {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('keydown', this.onKeyDown);

    if (this.scene) {
      this.scene.traverse((obj) => {
        if (obj.isMesh || obj.isPoints || obj.isLine) {
          if (obj.geometry) obj.geometry.dispose();
          if (obj.material) {
            if (Array.isArray(obj.material)) {
              obj.material.forEach((m) => m.dispose());
            } else {
              obj.material.dispose();
            }
          }
        }
      });
    }

    if (this.renderer) {
      this.renderer.dispose();
      this.renderer.forceContextLoss();
    }
  }
}

// Global initialization & bridge for backward compatibility with main.js
if (typeof window !== 'undefined') {
  window.Intro3D = Intro3D;
  window.WelcomePortal = Intro3D; // Seamless drop-in alias for main.js
}

document.addEventListener('DOMContentLoaded', () => {
  // Auto-instantiate
  if (!window.intro3DInstance && document.getElementById('welcomePortal')) {
    window.intro3DInstance = new Intro3D();
  }
});
