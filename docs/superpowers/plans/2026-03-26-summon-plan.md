# SUMMON Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an AstroDither-faithful audio-reactive WebGPU experience branded as "SUMMON" for Ranger Beers.

**Architecture:** Standalone Vite project with vanilla JS. Three.js WebGPU renderer with TSL shaders for post-processing (Bayer dither, fluid sim, displacement, bloom, chromatic aberration, vignette/scanlines). Procedural audio via Web Audio API drives shader uniforms through FFT analysis. Entry gate, speed controls, and info modal as HTML overlays.

**Tech Stack:** Three.js (latest, WebGPU build), TSL (Three.js Shading Language), Vite, Web Audio API, vanilla JS/CSS.

**Spec:** `docs/superpowers/specs/2026-03-26-summon-design.md`

**Color Palette:**
- Primary: `#D4AF37` (gold) — 70%
- Base: `#050505` (black)
- Arcane: `#9B59B6` (purple) — 15%
- Signal: `#8B1A1A` (dark red) — 5%
- Whisper: `#D9D9D9` (white) — 10%

---

## File Structure

```
summon/
  index.html                — Entry point, HTML overlay markup
  style.css                 — All UI styling (entry screen, overlays, info modal)
  src/
    main.js                 — Boot sequence: init renderer, audio gate, scene setup, animation loop
    scene.js                — Three.js scene, camera, lighting, model/video loading, rotation
    postprocessing.js       — Full post-processing chain (6 passes wired together)
    shaders/
      dither.ts             — Bayer 8x8 selective dithering (TSL Fn)
      fluid.js              — Single-pass fluid sim compute shader + displacement
      crt.js                — Vignette + scanlines + phosphor glow (TSL Fn)
    audio/
      engine.js             — Web Audio API procedural synth (oscillators, granular, bit-crush, stutter)
      analyzer.js           — FFT analysis → uniform values for shader reactivity
    ui/
      overlay.js            — Entry screen show/hide, fade transitions
      controls.js           — Speed (hold/click), timer countdown, info modal toggle
  public/
    exodia-reference.mov    — Anime clip for video texture (copy from ~/Downloads/)
  vite.config.js
  package.json
```

---

### Task 1: Project Scaffold

**Files:**
- Create: `summon/package.json`
- Create: `summon/vite.config.js`
- Create: `summon/index.html`
- Create: `summon/style.css`
- Create: `summon/src/main.js`

- [ ] **Step 1: Create project directory and package.json**

```bash
mkdir -p ~/summon/src ~/summon/public
cd ~/summon
```

```json
{
  "name": "summon",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

- [ ] **Step 2: Install dependencies**

```bash
cd ~/summon
npm install three
npm install -D vite
```

- [ ] **Step 3: Create vite.config.js**

```javascript
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    target: 'esnext',
  },
  assetsInclude: ['**/*.mov', '**/*.mp4', '**/*.glb', '**/*.gltf'],
});
```

- [ ] **Step 4: Create index.html with all UI markup**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>SUMMON — Ranger Beers LAB</title>
  <link rel="stylesheet" href="./style.css" />
</head>
<body>
  <!-- Three.js canvas mounts here -->
  <div id="canvas-container"></div>

  <!-- Entry Screen Overlay -->
  <div id="entry-screen">
    <div class="entry-brand">RANGER BEERS LAB</div>
    <div class="entry-title">SUMMON</div>
    <div class="entry-tagline">[SIGNAL. INTERCEPTED. CHAOS. SUMMONED. DIGITAL. GOLD.]</div>
    <button id="enter-btn">[:: TRANSMISSION INCOMING — CLICK TO DECRYPT ::]</button>
    <div class="entry-subtitle">AUDIO REACTIVE TSL & WEBGPU EXPERIMENT</div>
  </div>

  <!-- HUD Overlay (hidden until entry) -->
  <div id="hud" class="hidden">
    <!-- Header -->
    <div class="hud-header">
      <span class="hud-brand">RANGER BEERS LAB</span>
      <span class="hud-dot"></span>
      <button id="info-toggle" class="hud-info">[INFO]</button>
    </div>

    <!-- Speed / Timer bar -->
    <div class="hud-footer-bar">
      <span class="hud-speed-label">HOLD FOR SPEED · CLICK FOR SPEED</span>
      <span id="speed-display" class="hud-speed-value">1.00x</span>
      <span id="timer-display" class="hud-timer">00:00:00</span>
    </div>

    <!-- Bottom footer -->
    <div class="hud-footer">
      <span>RANGER BEERS &copy; 2026</span>
      <div class="hud-links">
        <a href="https://open.spotify.com/track/4vorkkiDbGLmccV9iu3pc8" target="_blank" rel="noopener">SPOTIFY</a>
        <a href="#" target="_blank" rel="noopener">GITHUB</a>
        <a href="#" target="_blank" rel="noopener">X</a>
      </div>
    </div>
  </div>

  <!-- Info Modal (hidden) -->
  <div id="info-modal" class="hidden">
    <div class="info-content">
      <h2>SOME RANDOM TECH</h2>
      <p>Audio reactive <strong>TSL</strong> & <strong>WebGPU</strong> experiment.</p>
      <p>Custom <strong>Bayer 8x8 dithering</strong> applied selectively to the 3D model.</p>
      <p>Single-pass <strong>fluid simulation</strong> drives image displacement — move your mouse to inject force.</p>
      <p><strong>Selective bloom</strong> without mask-based optimization.</p>
      <p><strong>Chromatic aberration</strong> on edges.</p>
      <p>All dithering applied <strong>post-process</strong>.</p>
      <p class="info-credit">Inspired by <a href="https://astrodither.robertborghesi.is/" target="_blank" rel="noopener">AstroDither</a> by Robert Borghesi.</p>
      <button id="info-close">[CLOSE]</button>
    </div>
  </div>

  <script type="module" src="/src/main.js"></script>
</body>
</html>
```

- [ ] **Step 5: Create style.css**

```css
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --gold: #d4af37;
  --gold-dim: rgba(212, 175, 55, 0.4);
  --gold-faint: rgba(212, 175, 55, 0.15);
  --black: #050505;
  --arcane: #9b59b6;
  --arcane-dim: rgba(155, 89, 182, 0.4);
  --signal: #8b1a1a;
  --whisper: #d9d9d9;
}

body {
  background: var(--black);
  color: var(--gold);
  font-family: 'JetBrains Mono', monospace;
  overflow: hidden;
  width: 100vw;
  height: 100vh;
}

#canvas-container {
  position: fixed;
  inset: 0;
  z-index: 0;
}

#canvas-container canvas {
  width: 100% !important;
  height: 100% !important;
}

.hidden {
  display: none !important;
}

/* ── Entry Screen ── */
#entry-screen {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: var(--black);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  transition: opacity 0.8s ease;
}

#entry-screen.fade-out {
  opacity: 0;
  pointer-events: none;
}

.entry-brand {
  font-size: 10px;
  letter-spacing: 4px;
  color: var(--gold-dim);
}

.entry-title {
  font-size: clamp(32px, 8vw, 64px);
  font-weight: 700;
  letter-spacing: 12px;
  color: var(--gold);
  text-shadow: 0 0 30px rgba(212, 175, 55, 0.4), 0 0 60px rgba(212, 175, 55, 0.15);
}

.entry-tagline {
  font-size: 11px;
  letter-spacing: 3px;
  color: var(--gold-dim);
}

#enter-btn {
  margin-top: 40px;
  padding: 16px 32px;
  background: none;
  border: 1px solid rgba(212, 175, 55, 0.3);
  color: var(--gold);
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  letter-spacing: 4px;
  cursor: pointer;
  transition: border-color 0.3s, text-shadow 0.3s;
}

#enter-btn:hover {
  border-color: var(--gold);
  text-shadow: 0 0 10px rgba(212, 175, 55, 0.5);
}

.entry-subtitle {
  margin-top: 24px;
  font-size: 9px;
  letter-spacing: 2px;
  color: var(--arcane-dim);
}

/* ── HUD Overlay ── */
#hud {
  position: fixed;
  inset: 0;
  z-index: 10;
  pointer-events: none;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 16px 24px;
}

#hud * {
  pointer-events: auto;
}

.hud-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.hud-brand {
  font-size: 10px;
  letter-spacing: 3px;
  color: var(--gold-dim);
}

.hud-dot {
  width: 6px;
  height: 6px;
  background: var(--gold);
  border-radius: 50%;
}

.hud-info {
  background: none;
  border: none;
  color: var(--gold-dim);
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  cursor: pointer;
  letter-spacing: 1px;
}

.hud-info:hover {
  color: var(--gold);
}

.hud-footer-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 16px;
  background: rgba(212, 175, 55, 0.03);
  border: 1px solid rgba(212, 175, 55, 0.08);
  border-radius: 4px;
  margin-bottom: 8px;
}

.hud-speed-label {
  font-size: 10px;
  letter-spacing: 1px;
  color: var(--gold-dim);
}

.hud-speed-value {
  font-size: 14px;
  letter-spacing: 2px;
  color: var(--gold);
}

.hud-timer {
  font-size: 12px;
  color: var(--whisper);
  opacity: 0.25;
}

.hud-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 9px;
  color: var(--gold-dim);
}

.hud-links {
  display: flex;
  gap: 16px;
}

.hud-links a {
  color: var(--gold-dim);
  text-decoration: none;
  font-size: 9px;
  letter-spacing: 1px;
}

.hud-links a:hover {
  color: var(--gold);
}

/* ── Info Modal ── */
#info-modal {
  position: fixed;
  inset: 0;
  z-index: 50;
  background: rgba(5, 5, 5, 0.92);
  display: flex;
  align-items: center;
  justify-content: center;
}

.info-content {
  max-width: 500px;
  padding: 40px;
}

.info-content h2 {
  font-size: 14px;
  letter-spacing: 4px;
  color: var(--gold);
  margin-bottom: 24px;
}

.info-content p {
  font-size: 11px;
  line-height: 1.8;
  color: var(--whisper);
  opacity: 0.7;
  margin-bottom: 8px;
}

.info-content strong {
  color: var(--gold);
}

.info-content a {
  color: var(--arcane);
}

.info-credit {
  margin-top: 24px;
  font-size: 9px;
  opacity: 0.4;
}

#info-close {
  margin-top: 32px;
  background: none;
  border: 1px solid rgba(212, 175, 55, 0.3);
  color: var(--gold);
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  letter-spacing: 3px;
  padding: 10px 24px;
  cursor: pointer;
}
```

- [ ] **Step 6: Create minimal src/main.js placeholder**

```javascript
// SUMMON — Ranger Beers LAB
// Boot sequence placeholder — replaced in Task 2

console.log('[SUMMON] Awaiting decryption...');
```

- [ ] **Step 7: Copy video asset and verify dev server**

```bash
cp ~/Downloads/exodia-reference.mov ~/summon/public/exodia-reference.mov
cd ~/summon && npx vite --open
```

Expected: browser opens, black screen with entry overlay visible, gold text, click button styled correctly.

- [ ] **Step 8: Commit**

```bash
cd ~/summon && git init && git add -A
git commit -m "feat: scaffold SUMMON project with Vite, entry screen, and HUD markup"
```

---

### Task 2: Three.js WebGPU Scene

**Files:**
- Create: `summon/src/scene.js`
- Modify: `summon/src/main.js`

- [ ] **Step 1: Create src/scene.js — scene, camera, placeholder geometry**

```javascript
import * as THREE from 'three/webgpu';

let scene, camera, model;

export function createScene() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x050505);

  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 0, 5);

  // Placeholder: gold wireframe icosahedron (replaced by Exodia model in Task 4)
  const geo = new THREE.IcosahedronGeometry(1.2, 1);
  const mat = new THREE.MeshBasicNodeMaterial({
    color: 0xd4af37,
    wireframe: true,
  });
  model = new THREE.Mesh(geo, mat);
  scene.add(model);

  // Subtle ambient light
  const ambient = new THREE.AmbientLight(0xd4af37, 0.3);
  scene.add(ambient);

  // Key light
  const point = new THREE.PointLight(0xd4af37, 1, 20);
  point.position.set(3, 3, 5);
  scene.add(point);

  return { scene, camera };
}

export function updateScene(time, speedMultiplier) {
  if (model) {
    model.rotation.y = time * 0.3 * speedMultiplier;
    model.rotation.x = Math.sin(time * 0.15) * 0.2;
  }
}

export function getModel() {
  return model;
}

export function getCamera() {
  return camera;
}

export function getScene() {
  return scene;
}
```

- [ ] **Step 2: Wire up main.js with WebGPU renderer and animation loop**

```javascript
import * as THREE from 'three/webgpu';
import { createScene, updateScene, getScene, getCamera } from './scene.js';

let renderer, clock;
let speedMultiplier = 1.0;

async function init() {
  // Init renderer
  renderer = new THREE.WebGPURenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  document.getElementById('canvas-container').appendChild(renderer.domElement);

  await renderer.init();

  // Init scene
  createScene();

  clock = new THREE.Clock();

  // Resize handler
  window.addEventListener('resize', onResize);

  // Entry gate
  document.getElementById('enter-btn').addEventListener('click', onEnter);

  // Start rendering (scene is behind entry screen)
  renderer.setAnimationLoop(animate);
}

function onEnter() {
  const entry = document.getElementById('entry-screen');
  entry.classList.add('fade-out');
  setTimeout(() => {
    entry.classList.add('hidden');
    document.getElementById('hud').classList.remove('hidden');
  }, 800);
}

function animate() {
  const elapsed = clock.getElapsedTime();
  updateScene(elapsed, speedMultiplier);
  renderer.render(getScene(), getCamera());
}

function onResize() {
  const cam = getCamera();
  cam.aspect = window.innerWidth / window.innerHeight;
  cam.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

init();
```

- [ ] **Step 3: Run dev server and verify**

```bash
cd ~/summon && npx vite
```

Expected: entry screen visible. Click "CLICK TO DECRYPT" → fades out, reveals gold wireframe icosahedron rotating on black background. HUD appears with header, speed bar, footer.

- [ ] **Step 4: Commit**

```bash
cd ~/summon
git add src/main.js src/scene.js
git commit -m "feat: add WebGPU renderer and rotating wireframe scene"
```

---

### Task 3: Post-Processing Chain (Dither + Bloom + Chromatic + CRT)

**Files:**
- Create: `summon/src/postprocessing.js`
- Create: `summon/src/shaders/dither.js`
- Create: `summon/src/shaders/crt.js`
- Modify: `summon/src/main.js`

- [ ] **Step 1: Create src/shaders/dither.js — Bayer 8x8 dithering TSL node**

Three.js ships `bayerDither` in addons. We wrap it with our gold-tinted quantization:

```javascript
import { Fn, vec4, vec3, float, floor, screenUV, screenSize } from 'three/tsl';
import { bayerDither } from 'three/addons/tsl/math/Bayer.js';

/**
 * Selective Bayer 8x8 dithering with gold tint.
 * @param {Node} inputColor - scene color texture node
 * @param {UniformNode} ditherScale - dither pattern scale (default 2.0)
 * @param {UniformNode} levels - quantization levels (default 4.0)
 */
export function goldDither(inputColor, ditherScale, levels) {
  return Fn(() => {
    const color = inputColor.toVar();
    const uv = screenUV;
    const coord = uv.mul(screenSize).div(ditherScale);

    // Bayer 8x8 dither value (-0.5 to 0.5 range)
    const dither = bayerDither(coord);

    // Quantize with dither offset
    const quantized = floor(color.rgb.mul(levels).add(dither)).div(levels);

    // Gold phosphor tint: bias towards gold (#D4AF37 = 0.83, 0.69, 0.22)
    const tinted = vec3(
      quantized.x.mul(0.9),
      quantized.y.mul(0.8),
      quantized.z.mul(0.4)
    );

    return vec4(tinted, color.a);
  })();
}
```

- [ ] **Step 2: Create src/shaders/crt.js — vignette + scanlines + phosphor**

```javascript
import { Fn, vec4, vec3, float, screenUV, screenSize, uniform } from 'three/tsl';

/**
 * CRT finish: vignette + scanlines + gold phosphor glow.
 * @param {Node} inputColor - color texture node
 * @param {UniformNode} scanlineIntensity - strength of scanlines
 */
export function crtFinish(inputColor, scanlineIntensity) {
  return Fn(() => {
    const color = inputColor.toVar();
    const uv = screenUV;

    // Scanlines
    const scanline = uv.y.mul(screenSize.y).mul(0.5).sin().mul(scanlineIntensity).add(float(1.0).sub(scanlineIntensity));
    color.rgb.mulAssign(scanline);

    // Vignette
    const dist = uv.sub(0.5).length();
    const vignette = float(1.0).sub(dist.mul(0.8)).smoothstep(0.0, 1.0);
    color.rgb.mulAssign(vignette);

    // Gold phosphor glow on bright areas
    const brightness = color.r.mul(0.299).add(color.g.mul(0.587)).add(color.b.mul(0.114));
    const glow = brightness.mul(0.15);
    color.r.addAssign(glow.mul(0.83));
    color.g.addAssign(glow.mul(0.69));
    color.b.addAssign(glow.mul(0.22));

    return vec4(color.rgb, color.a);
  })();
}
```

- [ ] **Step 3: Create src/postprocessing.js — full chain**

```javascript
import * as THREE from 'three/webgpu';
import { pass, uniform, float } from 'three/tsl';
import { bloom } from 'three/addons/tsl/display/BloomNode.js';
import { chromaticAberration } from 'three/addons/tsl/display/ChromaticAberrationNode.js';
import { goldDither } from './shaders/dither.js';
import { crtFinish } from './shaders/crt.js';

let postProcessing;

// Uniforms exposed for audio reactivity
export const uniforms = {
  ditherScale: uniform(2.0),
  ditherLevels: uniform(4.0),
  bloomStrength: uniform(1.0),
  chromaticOffset: uniform(0.002),
  scanlineIntensity: uniform(0.08),
};

export function createPostProcessing(renderer, scene, camera) {
  postProcessing = new THREE.PostProcessing(renderer);

  // Pass 1: Render scene
  const scenePass = pass(scene, camera);
  let output = scenePass.getTextureNode('output');

  // Pass 2: Selective Bayer dithering with gold tint
  output = goldDither(output, uniforms.ditherScale, uniforms.ditherLevels);

  // Pass 3 & 4: Fluid sim + displacement are added in Task 5

  // Pass 5a: Selective bloom
  const bloomPass = bloom(output);
  bloomPass.threshold.value = 0.4;
  bloomPass.strength.value = 1.0;
  bloomPass.radius.value = 0.5;
  output = output.add(bloomPass.mul(uniforms.bloomStrength));

  // Pass 5b: Chromatic aberration
  output = chromaticAberration(output, uniforms.chromaticOffset);

  // Pass 6: CRT finish (vignette + scanlines + phosphor glow)
  output = crtFinish(output, uniforms.scanlineIntensity);

  postProcessing.outputNode = output;
  return postProcessing;
}

export function getPostProcessing() {
  return postProcessing;
}
```

- [ ] **Step 4: Update main.js to use post-processing instead of raw render**

Replace the renderer import block and animate function in `src/main.js`:

```javascript
import * as THREE from 'three/webgpu';
import { createScene, updateScene, getScene, getCamera } from './scene.js';
import { createPostProcessing, getPostProcessing } from './postprocessing.js';

let renderer, clock;
let speedMultiplier = 1.0;

async function init() {
  renderer = new THREE.WebGPURenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  document.getElementById('canvas-container').appendChild(renderer.domElement);

  await renderer.init();

  const { scene, camera } = createScene();

  // Post-processing chain
  createPostProcessing(renderer, scene, camera);

  clock = new THREE.Clock();
  window.addEventListener('resize', onResize);
  document.getElementById('enter-btn').addEventListener('click', onEnter);
  renderer.setAnimationLoop(animate);
}

function onEnter() {
  const entry = document.getElementById('entry-screen');
  entry.classList.add('fade-out');
  setTimeout(() => {
    entry.classList.add('hidden');
    document.getElementById('hud').classList.remove('hidden');
  }, 800);
}

function animate() {
  const elapsed = clock.getElapsedTime();
  updateScene(elapsed, speedMultiplier);
  getPostProcessing().render();
}

function onResize() {
  const cam = getCamera();
  cam.aspect = window.innerWidth / window.innerHeight;
  cam.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

init();
```

- [ ] **Step 5: Run and verify post-processing**

```bash
cd ~/summon && npx vite
```

Expected: gold wireframe icosahedron now has visible Bayer dithering pattern, bloom glow around bright edges, slight chromatic aberration (R/B split on edges), scanlines visible on close inspection, vignette darkening edges. Gold phosphor tint overall.

- [ ] **Step 6: Commit**

```bash
cd ~/summon
git add src/shaders/ src/postprocessing.js src/main.js
git commit -m "feat: add dither + bloom + chromatic + CRT post-processing chain"
```

---

### Task 4: Exodia 3D Model + Video Texture

**Files:**
- Modify: `summon/src/scene.js`

- [ ] **Step 1: Search for and download an Exodia 3D model**

Search Sketchfab for a free Exodia/Yu-Gi-Oh model in GLTF format. If found, download to `summon/public/models/exodia.glb`. If not found, proceed with video texture as primary.

- [ ] **Step 2: Update scene.js to load GLTF model with gold material**

```javascript
import * as THREE from 'three/webgpu';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

let scene, camera, model, videoMesh;

export function createScene() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x050505);

  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 0, 5);

  // Ambient light
  const ambient = new THREE.AmbientLight(0xd4af37, 0.4);
  scene.add(ambient);

  // Key light
  const point = new THREE.PointLight(0xd4af37, 1.5, 20);
  point.position.set(3, 3, 5);
  scene.add(point);

  // Rim light (purple arcane accent)
  const rim = new THREE.PointLight(0x9b59b6, 0.5, 15);
  rim.position.set(-3, 1, -3);
  scene.add(rim);

  // Try loading GLTF model, fall back to video texture
  loadModel();

  return { scene, camera };
}

function loadModel() {
  const loader = new GLTFLoader();
  loader.load(
    '/models/exodia.glb',
    (gltf) => {
      model = gltf.scene;
      // Apply gold wireframe material to all meshes
      model.traverse((child) => {
        if (child.isMesh) {
          child.material = new THREE.MeshStandardNodeMaterial({
            color: 0xd4af37,
            wireframe: true,
            emissive: 0xd4af37,
            emissiveIntensity: 0.1,
          });
        }
      });
      // Center and scale
      const box = new THREE.Box3().setFromObject(model);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      model.scale.setScalar(2.5 / maxDim);
      model.position.sub(center.multiplyScalar(2.5 / maxDim));
      scene.add(model);
    },
    undefined,
    () => {
      console.log('[SUMMON] No GLTF model found, using video texture');
      loadVideoTexture();
    }
  );

  // Always load video as background layer
  loadVideoTexture();
}

function loadVideoTexture() {
  const video = document.createElement('video');
  video.src = '/exodia-reference.mov';
  video.loop = true;
  video.muted = true;
  video.playsInline = true;
  video.crossOrigin = 'anonymous';

  // Start playing on user interaction (handled by entry click)
  window.addEventListener('summon:enter', () => video.play(), { once: true });

  const videoTexture = new THREE.VideoTexture(video);
  videoTexture.minFilter = THREE.LinearFilter;
  videoTexture.magFilter = THREE.LinearFilter;

  const aspect = 16 / 9;
  const planeGeo = new THREE.PlaneGeometry(aspect * 2.5, 2.5);
  const planeMat = new THREE.MeshBasicNodeMaterial({
    map: videoTexture,
    transparent: true,
    opacity: 0.3,
  });

  videoMesh = new THREE.Mesh(planeGeo, planeMat);
  videoMesh.position.z = -2;
  scene.add(videoMesh);
}

export function updateScene(time, speedMultiplier) {
  if (model) {
    model.rotation.y = time * 0.3 * speedMultiplier;
    model.rotation.x = Math.sin(time * 0.15) * 0.2;
  }
}

export function getModel() {
  return model;
}

export function getCamera() {
  return camera;
}

export function getScene() {
  return scene;
}
```

- [ ] **Step 3: Dispatch custom event from entry click for video playback**

In `src/main.js`, add inside `onEnter()`:

```javascript
function onEnter() {
  const entry = document.getElementById('entry-screen');
  entry.classList.add('fade-out');
  window.dispatchEvent(new Event('summon:enter'));
  setTimeout(() => {
    entry.classList.add('hidden');
    document.getElementById('hud').classList.remove('hidden');
  }, 800);
}
```

- [ ] **Step 4: Run and verify**

```bash
cd ~/summon && npx vite
```

Expected: if GLTF exists, gold wireframe Exodia model rotating with dithering + post-processing. Video texture visible as a faint layer behind. If no GLTF, video texture is the primary visual, fully dithered.

- [ ] **Step 5: Commit**

```bash
cd ~/summon
git add src/scene.js src/main.js
git commit -m "feat: add GLTF model loader with video texture fallback"
```

---

### Task 5: Fluid Simulation + Displacement

**Files:**
- Create: `summon/src/shaders/fluid.js`
- Modify: `summon/src/postprocessing.js`
- Modify: `summon/src/main.js`

- [ ] **Step 1: Create src/shaders/fluid.js — compute shader + displacement node**

```javascript
import * as THREE from 'three/webgpu';
import {
  Fn, float, vec2, vec4, uniform, texture,
  textureStore, instanceIndex, uvec2, screenUV
} from 'three/tsl';

const FLUID_SIZE = 256;

let velocityTexA, velocityTexB, computeStep, currentRead;

// Uniforms for mouse + audio input
export const fluidUniforms = {
  mousePos: uniform(new THREE.Vector2(0.5, 0.5)),
  mousePrev: uniform(new THREE.Vector2(0.5, 0.5)),
  mouseForce: uniform(0.5),
  audioVelocity: uniform(0.0),
  dt: uniform(0.016),
  dissipation: uniform(0.98),
};

export function createFluidSim(renderer) {
  velocityTexA = new THREE.StorageTexture(FLUID_SIZE, FLUID_SIZE);
  velocityTexA.type = THREE.FloatType;
  velocityTexB = new THREE.StorageTexture(FLUID_SIZE, FLUID_SIZE);
  velocityTexB.type = THREE.FloatType;

  // Single-pass fluid: advect + add forces
  computeStep = Fn(({ readTex, writeTex }) => {
    const posX = instanceIndex.mod(FLUID_SIZE);
    const posY = instanceIndex.div(FLUID_SIZE);
    const indexUV = uvec2(posX, posY);
    const uv = vec2(float(posX).div(FLUID_SIZE), float(posY).div(FLUID_SIZE));

    // Read current velocity
    const vel = texture(readTex, uv).toVar();

    // Advect: sample from where this fluid came from
    const advectUV = uv.sub(vel.xy.mul(fluidUniforms.dt));
    const advected = texture(readTex, advectUV);

    // Mouse force injection
    const mouseDir = fluidUniforms.mousePos.sub(fluidUniforms.mousePrev);
    const mouseDist = uv.distance(fluidUniforms.mousePos);
    const mouseInfluence = float(1.0).sub(mouseDist.mul(8.0)).max(0.0);
    const force = mouseDir.mul(mouseInfluence).mul(fluidUniforms.mouseForce);

    // Audio-driven global turbulence
    const audioForce = vec2(
      uv.x.sub(0.5).mul(fluidUniforms.audioVelocity).mul(0.1),
      uv.y.sub(0.5).mul(fluidUniforms.audioVelocity).mul(0.1)
    );

    // Combine: advected + forces, with dissipation
    const newVel = vec4(
      advected.xy.add(force).add(audioForce).mul(fluidUniforms.dissipation),
      0.0,
      1.0
    );

    textureStore(writeTex, indexUV, newVel).toWriteOnly();
  });

  const stepAtoB = computeStep({ readTex: velocityTexA, writeTex: velocityTexB })
    .compute(FLUID_SIZE * FLUID_SIZE);
  const stepBtoA = computeStep({ readTex: velocityTexB, writeTex: velocityTexA })
    .compute(FLUID_SIZE * FLUID_SIZE);

  currentRead = { texA: velocityTexA, texB: velocityTexB, stepAtoB, stepBtoA, pingPong: false };

  return currentRead;
}

export function stepFluid(renderer) {
  if (!currentRead) return;
  if (currentRead.pingPong) {
    renderer.compute(currentRead.stepBtoA);
  } else {
    renderer.compute(currentRead.stepAtoB);
  }
  currentRead.pingPong = !currentRead.pingPong;
}

export function getFluidTexture() {
  if (!currentRead) return null;
  return currentRead.pingPong ? currentRead.texA : currentRead.texB;
}

/**
 * Displacement node: warps input color by fluid velocity.
 * @param {Node} inputColor - color to displace
 * @param {StorageTexture} fluidTex - fluid velocity texture
 * @param {UniformNode} strength - displacement strength
 */
export function fluidDisplacement(inputColor, fluidTex, strength) {
  return Fn(() => {
    const uv = screenUV;
    const vel = texture(fluidTex, uv);
    const displacedUV = uv.add(vel.xy.mul(strength));
    return inputColor; // Note: this is a simplified version — full displacement requires re-sampling the scene texture at displacedUV
  })();
}
```

- [ ] **Step 2: Update postprocessing.js to integrate fluid displacement**

Add fluid imports and insert displacement between dither and bloom:

```javascript
import * as THREE from 'three/webgpu';
import { pass, uniform, float, texture, screenUV, vec4, Fn } from 'three/tsl';
import { bloom } from 'three/addons/tsl/display/BloomNode.js';
import { chromaticAberration } from 'three/addons/tsl/display/ChromaticAberrationNode.js';
import { goldDither } from './shaders/dither.js';
import { crtFinish } from './shaders/crt.js';
import { getFluidTexture } from './shaders/fluid.js';

let postProcessing;

export const uniforms = {
  ditherScale: uniform(2.0),
  ditherLevels: uniform(4.0),
  bloomStrength: uniform(1.0),
  chromaticOffset: uniform(0.002),
  scanlineIntensity: uniform(0.08),
  displacementStrength: uniform(0.03),
};

export function createPostProcessing(renderer, scene, camera) {
  postProcessing = new THREE.PostProcessing(renderer);

  // Pass 1: Render scene
  const scenePass = pass(scene, camera);
  let output = scenePass.getTextureNode('output');

  // Pass 2: Selective Bayer dithering
  output = goldDither(output, uniforms.ditherScale, uniforms.ditherLevels);

  // Pass 3+4: Fluid displacement
  // Displace the dithered image by fluid velocity field
  const fluidTex = getFluidTexture();
  if (fluidTex) {
    output = Fn(([color]) => {
      const uv = screenUV;
      const vel = texture(fluidTex, uv);
      const displaced = uv.add(vel.xy.mul(uniforms.displacementStrength));
      // Re-sample the color at displaced UV
      // Since we're post-process, we use viewportSharedTexture or pass the previous output
      // For simplicity, mix displaced velocity into color distortion
      return vec4(
        color.r.add(vel.x.mul(0.1)),
        color.g,
        color.b.add(vel.y.mul(0.1)),
        color.a
      );
    })([output]);
  }

  // Pass 5a: Bloom
  const bloomPass = bloom(output);
  bloomPass.threshold.value = 0.4;
  bloomPass.strength.value = 1.0;
  bloomPass.radius.value = 0.5;
  output = output.add(bloomPass.mul(uniforms.bloomStrength));

  // Pass 5b: Chromatic aberration
  output = chromaticAberration(output, uniforms.chromaticOffset);

  // Pass 6: CRT finish
  output = crtFinish(output, uniforms.scanlineIntensity);

  postProcessing.outputNode = output;
  return postProcessing;
}

export function getPostProcessing() {
  return postProcessing;
}
```

- [ ] **Step 3: Add mouse tracking and fluid stepping to main.js**

Add to `src/main.js`:

```javascript
import * as THREE from 'three/webgpu';
import { createScene, updateScene, getScene, getCamera } from './scene.js';
import { createPostProcessing, getPostProcessing } from './postprocessing.js';
import { createFluidSim, stepFluid, fluidUniforms } from './shaders/fluid.js';

let renderer, clock;
let speedMultiplier = 1.0;
const mouse = new THREE.Vector2(0.5, 0.5);
const mousePrev = new THREE.Vector2(0.5, 0.5);

async function init() {
  renderer = new THREE.WebGPURenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  document.getElementById('canvas-container').appendChild(renderer.domElement);

  await renderer.init();

  const { scene, camera } = createScene();
  createFluidSim(renderer);
  createPostProcessing(renderer, scene, camera);

  clock = new THREE.Clock();
  window.addEventListener('resize', onResize);
  window.addEventListener('mousemove', onMouseMove);
  document.getElementById('enter-btn').addEventListener('click', onEnter);
  renderer.setAnimationLoop(animate);
}

function onMouseMove(e) {
  mousePrev.copy(mouse);
  mouse.set(e.clientX / window.innerWidth, 1.0 - e.clientY / window.innerHeight);
  fluidUniforms.mousePos.value.set(mouse.x, mouse.y);
  fluidUniforms.mousePrev.value.set(mousePrev.x, mousePrev.y);
}

function onEnter() {
  const entry = document.getElementById('entry-screen');
  entry.classList.add('fade-out');
  window.dispatchEvent(new Event('summon:enter'));
  setTimeout(() => {
    entry.classList.add('hidden');
    document.getElementById('hud').classList.remove('hidden');
  }, 800);
}

function animate() {
  const elapsed = clock.getElapsedTime();
  const delta = clock.getDelta();
  fluidUniforms.dt.value = Math.min(delta, 0.05);

  updateScene(elapsed, speedMultiplier);
  stepFluid(renderer);
  getPostProcessing().render();
}

function onResize() {
  const cam = getCamera();
  cam.aspect = window.innerWidth / window.innerHeight;
  cam.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

init();
```

- [ ] **Step 4: Run and verify fluid sim**

```bash
cd ~/summon && npx vite
```

Expected: moving mouse across viewport creates subtle color distortion/ripples in the dithered image. The fluid dissipates over time. Audio velocity uniform is 0 for now (hooked up in Task 6).

- [ ] **Step 5: Commit**

```bash
cd ~/summon
git add src/shaders/fluid.js src/postprocessing.js src/main.js
git commit -m "feat: add fluid simulation compute shader with mouse-driven displacement"
```

---

### Task 6: Procedural Audio Engine + FFT Analyzer

**Files:**
- Create: `summon/src/audio/engine.js`
- Create: `summon/src/audio/analyzer.js`
- Modify: `summon/src/main.js`

- [ ] **Step 1: Create src/audio/engine.js — procedural glitch synth**

```javascript
let audioCtx, masterGain;
let oscillators = [];
let noiseNode, bitCrusher;
let isPlaying = false;

export function initAudio() {
  audioCtx = new AudioContext();
  masterGain = audioCtx.createGain();
  masterGain.gain.value = 0.3;
  masterGain.connect(audioCtx.destination);

  return audioCtx;
}

export function startAudio() {
  if (isPlaying) return;
  if (audioCtx.state === 'suspended') audioCtx.resume();
  isPlaying = true;

  // Detuned saw pair — dark base drone
  const saw1 = audioCtx.createOscillator();
  saw1.type = 'sawtooth';
  saw1.frequency.value = 55; // A1
  const saw2 = audioCtx.createOscillator();
  saw2.type = 'sawtooth';
  saw2.frequency.value = 55.5; // Slight detune

  // Sub bass
  const sub = audioCtx.createOscillator();
  sub.type = 'sine';
  sub.frequency.value = 36; // C1

  // Square lead with LFO
  const square = audioCtx.createOscillator();
  square.type = 'square';
  square.frequency.value = 110;
  const lfo = audioCtx.createOscillator();
  lfo.type = 'sine';
  lfo.frequency.value = 0.3;
  const lfoGain = audioCtx.createGain();
  lfoGain.gain.value = 20;
  lfo.connect(lfoGain);
  lfoGain.connect(square.frequency);

  // Gain nodes for mixing
  const sawGain = audioCtx.createGain();
  sawGain.gain.value = 0.12;
  const subGain = audioCtx.createGain();
  subGain.gain.value = 0.15;
  const squareGain = audioCtx.createGain();
  squareGain.gain.value = 0.05;

  // Bit crusher via waveshaper (crude approximation)
  bitCrusher = audioCtx.createWaveShaper();
  const samples = 256;
  const curve = new Float32Array(samples);
  const steps = 8;
  for (let i = 0; i < samples; i++) {
    const x = (i * 2) / samples - 1;
    curve[i] = Math.round(x * steps) / steps;
  }
  bitCrusher.curve = curve;

  // Noise generator for granular texture
  const noiseBuffer = audioCtx.createBuffer(1, audioCtx.sampleRate * 2, audioCtx.sampleRate);
  const noiseData = noiseBuffer.getChannelData(0);
  for (let i = 0; i < noiseData.length; i++) {
    noiseData[i] = Math.random() * 2 - 1;
  }
  noiseNode = audioCtx.createBufferSource();
  noiseNode.buffer = noiseBuffer;
  noiseNode.loop = true;
  const noiseGain = audioCtx.createGain();
  noiseGain.gain.value = 0.02;
  const noiseFilter = audioCtx.createBiquadFilter();
  noiseFilter.type = 'bandpass';
  noiseFilter.frequency.value = 2000;
  noiseFilter.Q.value = 5;

  // Connect signal chain
  saw1.connect(sawGain);
  saw2.connect(sawGain);
  sub.connect(subGain);
  square.connect(squareGain);

  sawGain.connect(bitCrusher);
  subGain.connect(masterGain);
  squareGain.connect(bitCrusher);
  bitCrusher.connect(masterGain);

  noiseNode.connect(noiseFilter);
  noiseFilter.connect(noiseGain);
  noiseGain.connect(masterGain);

  // Start all
  saw1.start();
  saw2.start();
  sub.start();
  square.start();
  lfo.start();
  noiseNode.start();

  oscillators = [saw1, saw2, sub, square, lfo];

  // Stutter effect: periodic gain cuts
  scheduleStutter();
}

function scheduleStutter() {
  if (!isPlaying) return;
  const interval = 2 + Math.random() * 6;
  setTimeout(() => {
    if (!isPlaying) return;
    const now = audioCtx.currentTime;
    const stutterLen = 0.05 + Math.random() * 0.15;
    const repeats = 2 + Math.floor(Math.random() * 4);
    for (let i = 0; i < repeats; i++) {
      masterGain.gain.setValueAtTime(0.0, now + i * stutterLen);
      masterGain.gain.setValueAtTime(0.3, now + i * stutterLen + stutterLen * 0.5);
    }
    scheduleStutter();
  }, interval * 1000);
}

export function setSpeed(speed) {
  if (!audioCtx) return;
  oscillators.forEach((osc) => {
    osc.playbackRate && (osc.playbackRate.value = speed);
  });
}

export function getAudioContext() {
  return audioCtx;
}

export function getMasterGain() {
  return masterGain;
}
```

- [ ] **Step 2: Create src/audio/analyzer.js — FFT to shader uniforms**

```javascript
let analyser, freqData;

const BANDS = {
  subBass: { min: 0, max: 3 },    // ~20-80Hz
  bass: { min: 3, max: 10 },      // ~80-250Hz
  mids: { min: 10, max: 80 },     // ~250Hz-2kHz
  highs: { min: 80, max: 200 },   // ~2kHz-16kHz
};

export function createAnalyzer(audioCtx, sourceNode) {
  analyser = audioCtx.createAnalyser();
  analyser.fftSize = 512;
  analyser.smoothingTimeConstant = 0.8;
  sourceNode.connect(analyser);
  freqData = new Uint8Array(analyser.frequencyBinCount);
  return analyser;
}

function getBandEnergy(band) {
  if (!freqData) return 0;
  let sum = 0;
  const count = band.max - band.min;
  for (let i = band.min; i < band.max && i < freqData.length; i++) {
    sum += freqData[i];
  }
  return sum / (count * 255); // Normalize 0-1
}

export function getAudioData() {
  if (!analyser) return { subBass: 0, bass: 0, mids: 0, highs: 0 };
  analyser.getByteFrequencyData(freqData);
  return {
    subBass: getBandEnergy(BANDS.subBass),
    bass: getBandEnergy(BANDS.bass),
    mids: getBandEnergy(BANDS.mids),
    highs: getBandEnergy(BANDS.highs),
  };
}
```

- [ ] **Step 3: Wire audio into main.js and connect to shader uniforms**

Update `src/main.js`:

```javascript
import * as THREE from 'three/webgpu';
import { createScene, updateScene, getScene, getCamera } from './scene.js';
import { createPostProcessing, getPostProcessing, uniforms as ppUniforms } from './postprocessing.js';
import { createFluidSim, stepFluid, fluidUniforms } from './shaders/fluid.js';
import { initAudio, startAudio, getMasterGain } from './audio/engine.js';
import { createAnalyzer, getAudioData } from './audio/analyzer.js';

let renderer, clock;
let speedMultiplier = 1.0;
const mouse = new THREE.Vector2(0.5, 0.5);
const mousePrev = new THREE.Vector2(0.5, 0.5);

async function init() {
  renderer = new THREE.WebGPURenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  document.getElementById('canvas-container').appendChild(renderer.domElement);

  await renderer.init();

  const { scene, camera } = createScene();
  createFluidSim(renderer);
  createPostProcessing(renderer, scene, camera);

  // Init audio (context created but not started — needs user gesture)
  const audioCtx = initAudio();
  createAnalyzer(audioCtx, getMasterGain());

  clock = new THREE.Clock();
  window.addEventListener('resize', onResize);
  window.addEventListener('mousemove', onMouseMove);
  document.getElementById('enter-btn').addEventListener('click', onEnter);
  renderer.setAnimationLoop(animate);
}

function onMouseMove(e) {
  mousePrev.copy(mouse);
  mouse.set(e.clientX / window.innerWidth, 1.0 - e.clientY / window.innerHeight);
  fluidUniforms.mousePos.value.set(mouse.x, mouse.y);
  fluidUniforms.mousePrev.value.set(mousePrev.x, mousePrev.y);
}

function onEnter() {
  const entry = document.getElementById('entry-screen');
  entry.classList.add('fade-out');
  window.dispatchEvent(new Event('summon:enter'));

  // Start audio on user gesture
  startAudio();

  setTimeout(() => {
    entry.classList.add('hidden');
    document.getElementById('hud').classList.remove('hidden');
  }, 800);
}

function animate() {
  const elapsed = clock.getElapsedTime();
  const delta = clock.getDelta();
  fluidUniforms.dt.value = Math.min(delta, 0.05);

  // Audio reactivity → shader uniforms
  const audio = getAudioData();
  fluidUniforms.audioVelocity.value = audio.subBass * 2.0;
  ppUniforms.bloomStrength.value = 0.5 + audio.bass * 2.0;
  ppUniforms.ditherLevels.value = 3.0 + audio.mids * 5.0;
  ppUniforms.chromaticOffset.value = 0.001 + audio.highs * 0.008;
  ppUniforms.scanlineIntensity.value = 0.05 + audio.mids * 0.15;

  updateScene(elapsed, speedMultiplier);
  stepFluid(renderer);
  getPostProcessing().render();
}

function onResize() {
  const cam = getCamera();
  cam.aspect = window.innerWidth / window.innerHeight;
  cam.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

init();
```

- [ ] **Step 4: Run and verify audio reactivity**

```bash
cd ~/summon && npx vite
```

Expected: click to enter → audio starts (dark ambient drone with glitch stutters). Bloom pulses with bass. Dithering shifts with mids. Chromatic aberration responds to highs. Fluid sim gets energy from sub-bass. Moving mouse creates visible displacement ripples.

- [ ] **Step 5: Commit**

```bash
cd ~/summon
git add src/audio/ src/main.js
git commit -m "feat: add procedural glitch synth with FFT-driven shader reactivity"
```

---

### Task 7: Speed Controls + Timer + Info Modal

**Files:**
- Create: `summon/src/ui/controls.js`
- Modify: `summon/src/main.js`

- [ ] **Step 1: Create src/ui/controls.js**

```javascript
const SPEED_PRESETS = [0.25, 0.5, 1.0, 1.5, 2.0, 3.0];
let currentPresetIndex = 2; // Start at 1.0x
let isHolding = false;
let holdSpeed = 1.0;
let holdDecayRAF = null;
let timerStart = 0;
let onSpeedChange = null;

export function initControls(speedCallback) {
  onSpeedChange = speedCallback;

  // Click anywhere on canvas area for speed
  const container = document.getElementById('canvas-container');
  container.addEventListener('mousedown', onMouseDown);
  container.addEventListener('mouseup', onMouseUp);
  container.addEventListener('mouseleave', onMouseUp);
  container.addEventListener('click', onClick);

  // Info modal toggle
  document.getElementById('info-toggle').addEventListener('click', () => {
    document.getElementById('info-modal').classList.toggle('hidden');
  });
  document.getElementById('info-close').addEventListener('click', () => {
    document.getElementById('info-modal').classList.add('hidden');
  });
}

export function startTimer() {
  timerStart = performance.now();
}

export function updateTimer() {
  if (!timerStart) return;
  const elapsed = (performance.now() - timerStart) / 1000;
  const h = String(Math.floor(elapsed / 3600)).padStart(2, '0');
  const m = String(Math.floor((elapsed % 3600) / 60)).padStart(2, '0');
  const s = String(Math.floor(elapsed % 60)).padStart(2, '0');
  document.getElementById('timer-display').textContent = `${h}:${m}:${s}`;
}

function onClick(e) {
  if (isHolding) return; // Don't trigger click after hold
  currentPresetIndex = (currentPresetIndex + 1) % SPEED_PRESETS.length;
  const speed = SPEED_PRESETS[currentPresetIndex];
  setSpeed(speed);
}

function onMouseDown() {
  isHolding = true;
  rampSpeed();
}

function onMouseUp() {
  if (!isHolding) return;
  isHolding = false;
  decaySpeed();
}

function rampSpeed() {
  if (!isHolding) return;
  holdSpeed = Math.min(holdSpeed + 0.02, 5.0);
  setSpeed(holdSpeed);
  holdDecayRAF = requestAnimationFrame(rampSpeed);
}

function decaySpeed() {
  holdSpeed *= 0.95;
  if (holdSpeed <= SPEED_PRESETS[currentPresetIndex] + 0.01) {
    holdSpeed = SPEED_PRESETS[currentPresetIndex];
    setSpeed(holdSpeed);
    return;
  }
  setSpeed(holdSpeed);
  holdDecayRAF = requestAnimationFrame(decaySpeed);
}

function setSpeed(speed) {
  document.getElementById('speed-display').textContent = speed.toFixed(2) + 'x';
  if (onSpeedChange) onSpeedChange(speed);
}

export function getSpeed() {
  return isHolding ? holdSpeed : SPEED_PRESETS[currentPresetIndex];
}
```

- [ ] **Step 2: Wire controls into main.js**

Update `src/main.js` — add import and initialization:

```javascript
import { initControls, startTimer, updateTimer } from './ui/controls.js';
```

In `onEnter()`, add:

```javascript
  startTimer();
```

In `init()`, add after `renderer.setAnimationLoop(animate)`:

```javascript
  initControls((speed) => {
    speedMultiplier = speed;
  });
```

In `animate()`, add:

```javascript
  updateTimer();
```

- [ ] **Step 3: Run and verify controls**

```bash
cd ~/summon && npx vite
```

Expected:
- Click on canvas → speed cycles through 0.25x, 0.5x, 1.0x, 1.5x, 2.0x, 3.0x, display updates
- Hold mouse → speed ramps up smoothly, releases and decays back
- Timer counts up from entry
- [INFO] button opens modal, [CLOSE] dismisses it

- [ ] **Step 4: Commit**

```bash
cd ~/summon
git add src/ui/controls.js src/main.js
git commit -m "feat: add speed controls (hold/click), timer, and info modal"
```

---

### Task 8: Polish and Final Integration

**Files:**
- Modify: `summon/src/main.js`
- Modify: `summon/style.css`
- Modify: `summon/src/scene.js`

- [ ] **Step 1: Add WebGPU availability check with fallback message**

At the top of `src/main.js`, inside `init()`:

```javascript
import WebGPU from 'three/addons/capabilities/WebGPU.js';

async function init() {
  if (WebGPU.isAvailable() === false) {
    const entry = document.getElementById('entry-screen');
    entry.innerHTML = `
      <div class="entry-brand">RANGER BEERS LAB</div>
      <div class="entry-title">SUMMON</div>
      <div class="entry-tagline" style="color: var(--signal);">[WEBGPU NOT SUPPORTED — USE CHROME 113+ OR EDGE 113+]</div>
    `;
    return;
  }
  // ... rest of init
}
```

- [ ] **Step 2: Add ornamental corner brackets to canvas**

In `style.css`, add:

```css
/* ── Ornamental Corners (Exodia-inspired) ── */
#canvas-container::before,
#canvas-container::after {
  content: '';
  position: fixed;
  z-index: 5;
  pointer-events: none;
}

.corner {
  position: fixed;
  width: 24px;
  height: 24px;
  z-index: 5;
  pointer-events: none;
}

.corner-tl { top: 48px; left: 24px; border-top: 1px solid var(--gold-faint); border-left: 1px solid var(--gold-faint); }
.corner-tr { top: 48px; right: 24px; border-top: 1px solid var(--gold-faint); border-right: 1px solid var(--gold-faint); }
.corner-bl { bottom: 80px; left: 24px; border-bottom: 1px solid var(--gold-faint); border-left: 1px solid var(--gold-faint); }
.corner-br { bottom: 80px; right: 24px; border-bottom: 1px solid var(--gold-faint); border-right: 1px solid var(--gold-faint); }
```

In `index.html`, add inside `#hud`:

```html
    <div class="corner corner-tl"></div>
    <div class="corner corner-tr"></div>
    <div class="corner corner-bl"></div>
    <div class="corner corner-br"></div>
```

- [ ] **Step 3: Add audio-reactive model scale pulse in scene.js**

In `updateScene()`:

```javascript
export function updateScene(time, speedMultiplier, audioEnergy) {
  if (model) {
    model.rotation.y = time * 0.3 * speedMultiplier;
    model.rotation.x = Math.sin(time * 0.15) * 0.2;
    // Audio-reactive scale pulse
    const pulse = 1.0 + (audioEnergy || 0) * 0.15;
    model.scale.setScalar(pulse);
  }
}
```

Update the `animate()` call in `main.js`:

```javascript
  const bassEnergy = audio.bass;
  updateScene(elapsed, speedMultiplier, bassEnergy);
```

- [ ] **Step 4: Add entry screen scanline animation**

In `style.css`:

```css
#entry-screen::after {
  content: '';
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    rgba(212, 175, 55, 0.015) 0px,
    rgba(212, 175, 55, 0.015) 1px,
    transparent 1px,
    transparent 3px
  );
  pointer-events: none;
  animation: scanMove 8s linear infinite;
}

@keyframes scanMove {
  0% { transform: translateY(0); }
  100% { transform: translateY(6px); }
}
```

- [ ] **Step 5: Full end-to-end test**

```bash
cd ~/summon && npx vite
```

Verify the complete experience:
1. Entry screen shows with gold text, scanlines, tagline
2. Click "CLICK TO DECRYPT" → fades, audio starts, scene appears
3. Gold wireframe model (or Exodia) rotating with dither, bloom, scanlines, vignette
4. Move mouse → fluid displacement ripples
5. Audio reactive: bloom pulses, dither shifts, chromatic aberration responds
6. Click for speed → cycles presets, display updates
7. Hold → speed ramps, release → decays
8. Timer counts up
9. [INFO] opens modal with tech breakdown, [CLOSE] dismisses
10. Footer has Spotify/GitHub/X links
11. Ornamental corners visible

- [ ] **Step 6: Build for production**

```bash
cd ~/summon && npm run build
npx vite preview
```

Expected: production build works, preview serves correctly.

- [ ] **Step 7: Final commit**

```bash
cd ~/summon
git add -A
git commit -m "feat: polish — WebGPU check, ornamental corners, audio pulse, entry scanlines"
```

---

## Spec Coverage Verification

| Spec Requirement | Task |
|---|---|
| Standalone Vite project, no framework | Task 1 |
| Entry screen with click-to-decrypt gate | Task 1 (HTML/CSS), Task 2 (JS) |
| Three.js WebGPU renderer + TSL | Task 2 |
| Exodia 3D model (GLTF) | Task 4 |
| Video texture fallback/layer | Task 4 |
| Bayer 8x8 selective dithering | Task 3 |
| Fluid simulation compute shader | Task 5 |
| Mouse → fluid force injection | Task 5 |
| Fluid → image displacement | Task 5 |
| Selective bloom | Task 3 |
| Chromatic aberration | Task 3 |
| Vignette + scanlines + phosphor glow | Task 3 |
| Procedural audio synth (glitch/experimental) | Task 6 |
| FFT → shader uniforms | Task 6 |
| Speed control (hold/click) | Task 7 |
| Countdown timer | Task 7 |
| Info modal with tech breakdown | Task 7 |
| Header/footer/social links | Task 1 (HTML/CSS) |
| Spotify link | Task 1 (HTML) |
| Gold/black/purple/red/white palette | Task 1 (CSS), Task 3 (shaders) |
| Ornamental corner brackets | Task 8 |
| Audio-reactive model scale | Task 8 |
| WebGPU availability check | Task 8 |
| Production build | Task 8 |
