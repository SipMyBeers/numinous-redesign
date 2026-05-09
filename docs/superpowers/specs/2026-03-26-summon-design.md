# SUMMON — Design Spec

**AstroDither-faithful audio-reactive WebGPU experience with Ranger Beers identity.**

Standalone single-page site. Vite for dev, static build output. No framework — pure Three.js + WebGPU + TSL.

## Identity

- **Name**: SUMMON
- **Brand**: Ranger Beers LAB
- **Tagline**: `[SIGNAL. INTERCEPTED. CHAOS. SUMMONED. DIGITAL. GOLD.]`
- **Centerpiece**: Exodia (3D model or dithered anime video texture)
- **Reference**: https://astrodither.robertborghesi.is/

## Color Palette

| Role | Hex | Usage | Presence |
|------|-----|-------|----------|
| Primary | #D4AF37 | Text, UI chrome, wireframes, glow, dither tint | 70% |
| Base | #050505 | Background, negative space | — |
| Arcane | #9B59B6 | Audio-reactive elements, eye motifs, mystical glow | 15% |
| Signal | #8B1A1A | REC indicator, subtle underlines, danger states | 5% |
| Whisper | #D9D9D9 | Timer, secondary text, quiet info | 10% |

Inspiration: US Army Ranger tab (gold-on-black dominance), Exodia the Forbidden One (ornamental gold, arcane purple).

## Architecture

```
summon/
  index.html
  src/
    main.js              — Boot sequence, audio init, scene setup
    scene.js             — Three.js scene, camera, model/video loading
    shaders/
      dither.js          — Bayer 8x8 selective dithering (TSL, model-masked)
      fluid.js           — Single-pass fluid simulation compute shader
      displacement.js    — Fluid output → image displacement
      bloom.js           — Selective bloom
      chromatic.js       — Chromatic aberration
      vignette.js        — CRT vignette + scanlines + phosphor glow
    audio/
      engine.js          — Web Audio API procedural synth
      analyzer.js        — FFT analysis → shader uniforms
    ui/
      overlay.js         — Entry screen, speed controls, timer, info modal
      footer.js          — Social links, credits, Spotify embed
    models/              — GLTF assets / video textures
  public/
    exodia-reference.mov — Anime clip (dithered video texture source)
  vite.config.js
  package.json
```

## Entry Screen

Full black void. Centered layout:

1. "RANGER BEERS LAB" — small, muted gold, top
2. "SUMMON" — large bold gold, glowing, center
3. Tagline — muted gold, below title
4. `[:: TRANSMISSION INCOMING — CLICK TO DECRYPT ::]` — bordered gold button
5. "AUDIO REACTIVE TSL & WEBGPU EXPERIMENT" — small muted purple, bottom

On click: audio engine boots, entry screen fades out, main experience fades in.

## Main Experience

### Viewport

Full-screen Three.js canvas. Exodia as centerpiece — slowly rotating, audio-reactive scale pulses. Ornamental gold corner brackets frame the viewport (Exodia-inspired).

### 3D Content

**Priority 1 — 3D model**: Source a free Exodia GLTF/OBJ model (Sketchfab, etc.). Render with gold wireframe or toon material. This is the primary centerpiece.

**Priority 2 — Video texture layer**: The anime clip (`exodia-reference.mov`, 82MB, saved at `~/Downloads/exodia-reference.mov`) is used as a secondary texture source. Mapped to a plane behind or overlaid on the 3D model. Full dither pipeline applies. Can serve as the sole centerpiece if no 3D model is found.

**Both should be implemented** — the video texture adds depth even when the 3D model is present.

**MCP integration (future)**: Blender MCP server can generate alternative grease pencil wireframe models (geometric Exodia approximation, sacred geometry, eye motifs) that can be swapped in. Not part of the initial build.

### Shader Pipeline (6 passes, AstroDither-faithful)

1. **Render Pass** — Scene with Exodia model or video texture plane
2. **Selective Dither** — Bayer 8x8 matrix quantization applied via model depth/stencil mask. Gold-tinted color quantization (4 levels). Dithering is stronger on the model, lighter or absent on background.
3. **Fluid Simulation** — Single-pass compute shader. Mouse position injects directional force. Audio amplitude drives global velocity. Outputs a velocity/pressure field texture.
4. **Displacement** — Fluid sim output texture displaces the rendered image. Creates organic warping/ripple effect across the viewport.
5. **Bloom + Chromatic Aberration** — Selective bloom on bright gold areas. Red/blue channel offset (chromatic aberration) on edges. Bloom radius modulated by audio bass frequency.
6. **Vignette + Scanlines + Phosphor Glow** — CRT-style darkened edges. Horizontal scanlines at configurable intensity. Gold phosphor glow tint on bright regions.

### Audio Engine

Procedural glitchy/experimental synthesizer (inspired by Daedelus/edIT style):

- **Oscillators**: Detuned saw/square pairs, slow LFO modulation
- **Granular layer**: Micro-grains of noise with randomized pitch/pan
- **Bit-crush**: Variable bit-depth reduction on the master output
- **Stutter**: Randomized buffer-repeat glitch effects
- **Envelope**: Slow evolving ambient base with occasional rhythmic bursts

FFT analyzer maps frequency bands to shader uniforms:
- Sub-bass (20-80Hz) → fluid velocity multiplier
- Bass (80-250Hz) → bloom radius
- Mids (250Hz-2kHz) → dither intensity / quantization levels
- Highs (2kHz-16kHz) → chromatic aberration offset

### Interactivity

- **Mouse position** → force injection into fluid sim → displacement ripples follow cursor
- **Click** → increment speed multiplier (cycles through preset values)
- **Hold** → continuous speed ramp up while held, decays on release
- **Speed multiplier** → controls model rotation speed + audio playback rate + fluid sim timestep

### UI Overlay

All monospace, gold on transparent. Minimal footprint over the 3D viewport.

- **Header bar**: "RANGER BEERS LAB" (left) · gold dot indicator (center) · [INFO] toggle (right)
- **Speed control bar** (bottom area): "HOLD FOR SPEED · CLICK FOR SPEED" (left) · `1.00x` multiplier (center) · `HH:MM:SS` countdown timer (right)
- **Footer**: "RANGER BEERS © 2026" (left) · SPOTIFY / GITHUB / X links (right)
- **Info modal**: Toggles via [INFO]. Contains tech breakdown of the shader pipeline, credits, inspiration attribution to AstroDither/Robert Borghesi.

### Spotify Integration

Spotify embed link in footer for the Daedelus track. Not the audio source — just a reference link. The site's audio is fully procedural.

## Tech Stack

- **Three.js** (latest) — 3D rendering
- **WebGPU** — GPU compute (fluid sim)
- **TSL** (Three.js Shading Language) — Custom shaders
- **Web Audio API** — Procedural synthesis + FFT analysis
- **Vite** — Dev server + static build
- **No framework** — Vanilla JS, no React/Vue/etc.

## Deployment

Static build → deploy to Netlify, Vercel, or GitHub Pages. Single `dist/` folder output.

## Future Extensions

- Swap 3D models via Blender MCP server (grease pencil wireframes, alternative shapes)
- Add as `/summon` route in numinous-redesign
- Evolve into product landing page by adding content sections below the experience
- Multiple audio presets / user-selectable synth modes
