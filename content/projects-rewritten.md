# Flagship Projects: Problem-Decision-Result Matrix

Every project copy below is strictly formatted following the **Problem ➔ Decision ➔ Result** framework (3–4 sentences, high-density, zero buzzword filler).

---

### 1. BUDDY — Autonomous Local AI Study Platform
- **Role:** Architect & Lead Developer
- **Stack:** Python 3.10+, FastAPI, Three.js, WebGL/GLSL, Ollama (`gemma4:e4b`), NetworkX
- **Status:** Active Open Source | Optimized for 6GB VRAM RTX 3050
- **Problem:** Cloud-hosted AI study companions require expensive monthly subscriptions and compromise user privacy by streaming sensitive student notes and proprietary PDFs to remote servers.
- **Decision:** Architected a 100% local, single-origin platform combining a high-throughput FastAPI backend with an interactive Three.js GLSL neural core, using quantized local Ollama models and vector RAG bound strictly within 6GB VRAM.
- **Result:** Delivered an offline study workspace featuring automated chapter synthesis, physics-driven concept graphs, and an adaptive quiz arena with zero data leakage and zero cloud API latency.
- **Links:** [Source Code](https://github.com/harshverse-svg/buddy-ai-study-platform)

---

### 2. FormattingBuddy — Zero-Backend PWA Document Engine
- **Role:** Solo Architect & Developer
- **Stack:** Modern JavaScript (ES6+), Progressive Web App (PWA), WebAssembly (WASM) OCR, Web Crypto API
- **Status:** Production PWA | Verified 100% Offline
- **Problem:** Document formatting and PDF conversion tools often gate basic exports behind subscriptions, impose harsh file-size caps, or store confidential documents on unverified cloud databases.
- **Decision:** Built a serverless, static Progressive Web App using client-side WebAssembly OCR and the native Web Crypto API (PBKDF2/AES-GCM) to parse multi-format inputs (PDF, DOCX, PPTX, XLSX, Images up to 20 MB) directly in-memory.
- **Result:** Created an installable, zero-backend utility that compiles unstructured files into publication-ready manuals, formatted tables, and multi-format exports (PDF, HTML, DOCX, Markdown, ZIP) with complete zero-server data security.
- **Links:** [Live Demo](https://harshverse-svg.github.io/formattingbuddy/) | [Source Code](https://github.com/harshverse-svg/formattingbuddy)

---

### 3. Typing Buddy — Offline Windows Typing Assistant
- **Role:** Solo Developer & Maintainer
- **Stack:** Python, Windows 10/11 API, `pynput`, Harper Grammar Engine, Local SQLite
- **Status:** Active Release (v1.x) | Zero-Telemetry Windows Utility
- **Problem:** Standard AI writing assistants and autocompletion tools continuously send background keystrokes to remote servers, introducing severe security risks for credentials and personal writing.
- **Decision:** Engineered a lightweight, 100% offline background assistant for Windows using `pynput` for OS-level event listening, the local Harper grammar engine for typo correction, and a custom-curated Hinglish + English vocabulary dictionary.
- **Result:** Released a low-latency, system-wide productivity daemon that provides instant autocomplete suggestions across IDEs and word processors with zero network requests and an ultra-low memory footprint.
- **Links:** [Product Site](https://harshverse-svg.github.io/typing-buddy/) | [Releases](https://github.com/harshverse-svg/typing-buddy/releases/latest) | [Source Code](https://github.com/harshverse-svg/typing-buddy)

---

### 4. SwasthLink (formerly QueueKhatam) — Virtual Healthcare Queue
- **Role:** Lead Developer & System Architect
- **Stack:** Python, Streamlit, REST APIs, Simulated ABDM Framework, Simulated UPI
- **Status:** Functional Web Prototype & Strategy Roadmap
- **Problem:** Patients at independent clinics and district hospitals in Indian Tier 2/3 cities face 3 to 4-hour physical waiting lines ("4 AM queue reality") due to the total absence of digital scheduling.
- **Decision:** Developed a mobile-first "Scan & Share" virtual queue management system simulating Ayushman Bharat Digital Mission (ABDM) profile fetching and QR-based token distribution without requiring an app download.
- **Result:** Prototyped a complete patient intake flow that reduces clinic check-in friction from hours to minutes, accompanied by a 4-phase rollout roadmap addressing clinic monetization and patient adoption.
- **Links:** [Live Demo](https://harshverse-svg.github.io/Swast-.link-/) | [Case Study](queuekhatam-research.html) | [Source Code](https://github.com/harshverse-svg/Swast-.link-)

---

### 5. GraphRAG Engine — Local Knowledge Retrieval Pipeline
- **Role:** Lead Developer & Pipeline Architect
- **Stack:** Python, Ollama (Qwen2.5 / Gemma), Streamlit, NetworkX, Louvain Community Detection
- **Status:** Turnkey Local Pipeline | Windows One-Click
- **Problem:** Standard vector-based RAG matches text chunks by isolated semantic similarity, frequently losing multi-hop relationships and causing hallucinations during cross-document synthesis.
- **Decision:** Implemented a local Graph-based RAG pipeline swapping proprietary cloud APIs for Ollama-hosted models and applying NetworkX Louvain community detection to cluster concept hierarchies into an entity knowledge graph.
- **Result:** Built a reproducible local intelligence pipeline and Streamlit dashboard that maps and traverses entity connections prior to generating answers, packaged with a one-click Windows setup launcher.
- **Links:** [Case Study & Docs](graphrag-readme.html) | [Source Code](https://github.com/harshverse-svg/graphrag-ollama)

---

### 6. Stone Paper Scissor 3.0 — Interactive Web Game Engine
- **Role:** Solo Developer
- **Stack:** JavaScript, HTML5/CSS3, Web Audio API, LocalStorage State Management
- **Status:** Live Web Game | Mobile-First (100dvh)
- **Problem:** Casual browser games frequently depend on bloated external gaming frameworks, intrusive ad networks, and clunky mobile viewport scaling.
- **Decision:** Built a clean, dependency-free browser game using native DOM manipulation, dynamic `100dvh` viewport units, a custom Web Audio API sound synthesizer, and client-side adaptive AI curves (Random, Adaptive, Predictive).
- **Result:** Delivered an immersive, zero-dependency browser game featuring an achievement vault, real-time ELO rating system, and fluid tactile audio feedback that feels native on mobile screens.
- **Links:** [Live Demo](https://harshverse-svg.github.io/stone-paper-scissor/) | [Source Code](https://github.com/harshverse-svg/stone-paper-scissor)


---

### 7. Snake Water Gun — Classic Strategy Game Engine
- **Role:** Solo Developer
- **Stack:** HTML5, CSS3, Vanilla JavaScript, Audio Synthesis
- **Status:** Open Source Web Game | Responsive Browser Engine
- **Problem:** Browser micro-games often rely on heavy external dependencies and fail to provide responsive layouts or audio feedback across low-end mobile devices.
- **Decision:** Built a standalone, zero-framework implementation of the traditional Indian game variant (Snake drinks Water, Water douses Gun, Gun shoots Snake) with modular round management, dynamic score tracking, and local sound FX.
- **Result:** Delivered a fast-loading, responsive casual game engine running entirely client-side with zero network latency.
- **Links:** [Live Demo](https://harshverse-svg.github.io/snake-water-gun/) | [Source Code](https://github.com/harshverse-svg/snake-water-gun)
