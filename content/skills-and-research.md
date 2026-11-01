# Skills, Architecture & Literature Tracker

## 1. Concrete Technical Stack (Contextualized)

| Layer | Technologies | What Was Built & Measured |
| :--- | :--- | :--- |
| **Languages** | Python 3.10+, C / C++, Modern ES6+ JavaScript, HTML5/CSS3 | Windows background daemons (`pynput`), high-throughput API endpoints (FastAPI), client-side PWA document engines, and modular simulation scripts. |
| **Local AI & RAG** | Ollama, Gemma (4-bit), Qwen2.5-Coder, NetworkX Louvain | Deployed local LLMs with memory caps on 6GB VRAM; engineered GraphRAG pipeline for multi-document entity-relationship extraction. |
| **Frontend & WebGL** | Vanilla JavaScript, Three.js, WebGL GLSL Shaders, Web Audio API | Built interactive 3D procedural neural shaders reflecting model inference load; synthesized real-time micro-sound haptic audio without audio asset downloads. |
| **Infrastructure & CLI** | Git, GitHub Actions, PowerShell, Bash, Streamlit, Linux | Authored automated CI/CD test workflows; authored one-click Windows launchers; built rapid data prototypes in Streamlit. |

---

## 2. Advanced Skills (Ground Truth)

### A. Local RAG & Vector Intelligence
- **What Was Built:** 100% on-device embedding and retrieval pipeline in BUDDY and GraphRAG.
- **Concrete Learning:** Overcame context window bottlenecks of standard LLMs by implementing chunking strategies, cosine similarity retrieval, and in-memory vector index caches without external cloud API dependencies.

### B. Graph-Based Knowledge Retrieval
- **What Was Built:** Entity-relation knowledge graph generator using NetworkX.
- **Concrete Learning:** Applied Louvain community detection to group interconnected entities across technical documents, preserving multi-hop relationships that standard vector embedding similarity searches miss.

### C. Quantized Local Model Deployment
- **What Was Built:** Production inference setups with Ollama on consumer hardware.
- **Concrete Learning:** Measured token throughput and VRAM allocation across 4-bit and 8-bit quantized models (`gemma4:e4b`, `qwen2.5-coder`), isolating inference boundaries to prevent GPU out-of-memory (OOM) faults on a 6GB VRAM budget.

### D. Privacy-Centric Client Computing
- **What Was Built:** WebAssembly OCR, AES-GCM client cryptography, and OS keystroke listeners.
- **Concrete Learning:** Engineered zero-telemetry architectures where computation happens strictly inside the client's browser memory (FormattingBuddy) or OS background thread (Typing Buddy).

---

## 3. Currently Reading & Research Interests (Ground Truth Literature)

An honest, open exploration of cross-disciplinary physics and computational paradigms:

### 1. Neuromorphic Computing & Spiking Architectures
- **Why I Am Reading This:** Standard deep learning architectures rely on power-hungry, matrix-dense von Neumann processors. I am studying event-driven, biological neural computation where information is encoded in spike timing, drastically slashing energy consumption.
- **Primary Literature:**
  - Schuman et al., *"A Survey of Neuromorphic Computing and Neural Networks in Hardware"*, [arXiv:1705.06963](https://arxiv.org/abs/1705.06963) (Oak Ridge National Laboratory).
  - *"A Bibliometric Review of Neuromorphic Computing and Spiking Neural Networks"*, [arXiv:2304.06897](https://arxiv.org/abs/2304.06897).

### 2. Floquet Engineering (Non-Equilibrium Quantum Materials)
- **Why I Am Reading This:** Floquet engineering uses periodic optical or electromagnetic driving fields to dynamically alter material band structures and synthesize artificial topological states that do not exist at thermal equilibrium.
- **Primary Literature:**
  - Takashi Oka & Sota Kitamura, *"Floquet Engineering of Quantum Materials"*, [arXiv:1804.03212](https://arxiv.org/abs/1804.03212) (Annual Review of Condensed Matter Physics).
  - M. S. Rudner & N. H. Lindner, *"The Floquet Engineer's Handbook"*, [arXiv:2003.08252](https://arxiv.org/abs/2003.08252) (Nature Reviews Physics).

### 3. Cosmic-Ray Muon Tomography (Muography)
- **Why I Am Reading This:** Natural atmospheric muons created by cosmic rays penetrate meters of dense material. I am exploring image reconstruction algorithms—specifically Multiple Coulomb Scattering (MCS) trajectory estimation (Point of Closest Approach / PoCA) and radiographic inversion.
- **Primary Literature:**
  - Lorenzo Bonechi, Raffaello D'Alessandro, Andrea Giammanco, *"Atmospheric muons as an imaging tool"*, [arXiv:1906.03934](https://arxiv.org/abs/1906.03934) (Reviews in Physics).
  - *"A Cosmic Muon Tomography System with Machine Learning based Momentum Measurement"*, [arXiv:2608.23141](https://arxiv.org/abs/2608.23141).
