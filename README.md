# Anoop Puthan Veettil - SRE Portfolio Dashboard

An ultra-premium, interactive single-page personal website for Anoop Puthan Veettil, Senior Site Reliability Engineer at Apple Inc. The application features a high-tech **SRE Operations Dashboard** and a **live command console** parser, letting visitors query Anoop's 20-year cloud infrastructure career, managed Petabyte scales, and DevOps expertise.

---

## 🚀 Premium Features

### 1. **Live Operational Dashboard Header**
- Real-time simulated SRE telemetry showing Anoop's engineering benchmarks:
  - Pulses a **health indicator** showing nominal uptime metrics.
  - Showcases **3.5 Petabytes** of active search data managed (Apache Solr).
  - Integrates direct SLO targets, active microservices nodes, and pager duty counts.

### 2. **Synthesized SRE Terminal (Retro CLI)**
- A fully functional `zsh`-style shell console emulator built inside the sidebar:
  - Type `help` to list core system capabilities and custom resume hooks.
  - Supports command prompts: `about`, `skills`, `experience`, `uptime`, `linkedin`, `email`, `clear`, and `sudo`.
  - Built-in **Mechanical Keyboard Synthesizer** using the native browser **Web Audio API**—generating programmatic, mechanical keypress spring clicks on-the-fly (no external audio assets required, instantly loading, and toggleable).

### 3. **SVG & CSS-Animated Topology Map**
- Custom network node layout visually representing Anoop's SRE DRI responsibilities (Places, Base Map, Solr Clusters, and CI/CD Pipeling).
- Interactive hover effects showing system performance details and highlighting corresponding skill matrix blocks.
- Pulsing network traffic packets flow along SVG connectors via GPU-accelerated keyframe strokes.

### 4. **Modern CSS Layered Architecture**
- Organized using modern CSS specifications:
  - `@layer reset, base, theme, components, utilities;` for robust, standard-based specificity.
  - Native light/dark theme color bindings via `light-dark()` on properties.
  - High-performance visual layers featuring glassmorphism (`backdrop-filter`) and ambient background mesh overlays.
  - Fluid typography scale powered by CSS `clamp()`.

---

## 🛠️ Architecture & Setup

The site is built with Zero Bloat to guarantee 100% Core Web Vitals (Largest Contentful Paint & Interaction to Next Paint):
- **Core Structure**: HTML5 (`index.html`) using clean semantic layouts.
- **Styling**: Vanilla CSS (`index.css`) with standard responsive CSS variables and grid. No heavy Tailwind dependencies or frameworks.
- **Interactivity**: Lightweight Vanilla JavaScript (`index.js`).

### How to Run Locally

You can serve this static site instantly using any local server utility. Here are three standard methods:

#### Method A: Python HTTP Server (Recommended)
Navigate to the root workspace directory and run:
```bash
python3 -m http.server 8000
```
Then, open `http://localhost:8000` in your web browser.

#### Method B: Node `serve` Utility
If you have Node/NPM installed, run:
```bash
npx serve
```
Then, open the designated local port.

#### Method C: Double-Click File
Since it is a 100% native client-side application, you can also double-click on `index.html` to open and inspect the rendering directly inside any modern web browser!

---

## 📁 Repository Directory
```
/Users/aveettil/antigravity_projects/
├── index.html          # Core single-page semantic structure
├── index.css           # Layered styles, glassmorphism filters, and animations
├── index.js            # SRE terminal parser, synthesizer, and highlights
└── README.md           # Deployment & architectural documentation
```
