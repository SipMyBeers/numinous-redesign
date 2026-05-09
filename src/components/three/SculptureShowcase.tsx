"use client";

import { useRef, useState, useEffect, useCallback } from "react";

/* ═══════════════════════════════════════════════
   RAW WebGL Showcase — no Three.js, no CSP issues
   Audio-reactive dithered fluid with sculpture silhouettes
   ═══════════════════════════════════════════════ */

// ── Audio Analyzer ──
class AudioAnalyzer {
  ctx: AudioContext | null = null;
  analyser: AnalyserNode | null = null;
  data = new Uint8Array(128);

  init(el: HTMLAudioElement) {
    if (this.ctx) return;
    this.ctx = new AudioContext();
    this.analyser = this.ctx.createAnalyser();
    this.analyser.fftSize = 256;
    this.analyser.smoothingTimeConstant = 0.85;
    const src = this.ctx.createMediaElementSource(el);
    src.connect(this.analyser);
    this.analyser.connect(this.ctx.destination);
    this.data = new Uint8Array(this.analyser.frequencyBinCount);
  }

  update() { this.analyser?.getByteFrequencyData(this.data); }

  getBass() {
    let s = 0; for (let i = 0; i < 8; i++) s += this.data[i]; return s / (8 * 255);
  }
  getMid() {
    let s = 0; for (let i = 8; i < 40; i++) s += this.data[i]; return s / (32 * 255);
  }
  getHigh() {
    let s = 0; for (let i = 40; i < 80; i++) s += this.data[i]; return s / (40 * 255);
  }
}

// ── Vertex shader (fullscreen quad) ──
const VS = `attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }`;

// ── Fragment shader — dithered fluid with audio reactivity ──
const FS = `
precision highp float;
uniform float u_time;
uniform float u_bass;
uniform float u_mid;
uniform float u_high;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform int u_sculpture;

// Simplex-like noise
vec3 mod289(vec3 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865, 0.366025403, -0.577350269, 0.024390243);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m; m = m*m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284 - 0.85373 * (a0*a0 + h*h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

// Bayer 4x4 dither
float bayer4(vec2 p) {
  vec2 bp = mod(floor(p), 4.0);
  int x = int(bp.x);
  int y = int(bp.y);
  int idx = x + y * 4;
  // Inline 4x4 Bayer matrix
  if (idx==0) return 0.0/16.0;  if (idx==1) return 8.0/16.0;
  if (idx==2) return 2.0/16.0;  if (idx==3) return 10.0/16.0;
  if (idx==4) return 12.0/16.0; if (idx==5) return 4.0/16.0;
  if (idx==6) return 14.0/16.0; if (idx==7) return 6.0/16.0;
  if (idx==8) return 3.0/16.0;  if (idx==9) return 11.0/16.0;
  if (idx==10) return 1.0/16.0; if (idx==11) return 9.0/16.0;
  if (idx==12) return 15.0/16.0;if (idx==13) return 7.0/16.0;
  if (idx==14) return 13.0/16.0;
  return 5.0/16.0;
}

// Sculpt SDF shapes (abstract silhouettes of sculptures)
float sculptSDF(vec2 p, int id) {
  float d = 1e9;
  if (id == 0) { // Gilly — creature shape
    d = length(p - vec2(0.0, 0.1)) - 0.35;
    d = min(d, length(p - vec2(-0.2, -0.25)) - 0.12); // leg
    d = min(d, length(p - vec2(0.2, -0.25)) - 0.12);
    d = min(d, length(p - vec2(0.0, 0.4)) - 0.15); // head
    float neck = abs(p.x) - 0.05 + p.y * 0.1;
    d = min(d, max(neck, abs(p.y - 0.3) - 0.12));
  } else if (id == 1) { // Female Twin — figure
    d = length(p * vec2(1.0, 0.6)) - 0.3;
    d = min(d, length(p - vec2(0.0, 0.35)) - 0.12);
    d = min(d, abs(p.x) - 0.03 + abs(p.y + 0.2) * 0.15);
  } else if (id == 2) { // The Portal — arch
    float outer = length(p) - 0.4;
    float inner = length(p) - 0.3;
    d = max(outer, -inner);
    d = max(d, -p.y - 0.05);
  } else if (id == 3) { // Echeveria — flower
    float a = atan(p.y, p.x);
    float r = length(p);
    float petals = 0.25 + 0.1 * sin(a * 5.0 + u_time);
    d = r - petals;
  } else if (id == 4) { // Divi — fountain
    d = abs(p.x) - 0.15 + p.y * 0.15;
    d = max(d, -p.y - 0.4);
    d = min(d, length(p - vec2(0.0, 0.4)) - 0.08);
    float spray = length(p - vec2(sin(u_time*3.0)*0.05, 0.5)) - 0.04;
    d = min(d, spray);
  } else if (id == 5) { // Fata — spinning fire
    float a = atan(p.y, p.x) + u_time * 1.5;
    float r = length(p);
    d = r - (0.25 + 0.1 * sin(a * 3.0) + 0.05 * sin(a * 7.0 + u_time * 3.0));
  } else if (id == 6) { // Le Attrata — abstract
    d = max(abs(p.x) - 0.3, abs(p.y) - 0.35);
    float hole1 = length(p - vec2(0.1, 0.1)) - 0.1;
    float hole2 = length(p - vec2(-0.1, -0.1)) - 0.08;
    d = max(d, -hole1);
    d = max(d, -hole2);
  } else { // Springwater — flow
    float wave = sin(p.y * 8.0 + u_time * 2.0) * 0.05;
    d = abs(p.x + wave) - 0.12;
    d = max(d, abs(p.y) - 0.4);
    float drop = length(p - vec2(wave, -0.45 + mod(u_time * 0.5, 0.9))) - 0.03;
    d = min(d, drop);
  }
  return d;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  vec2 p = (gl_FragCoord.xy - u_resolution * 0.5) / min(u_resolution.x, u_resolution.y);

  float t = u_time;
  float bass = u_bass;
  float mid = u_mid;
  float high = u_high;

  // Mouse influence
  vec2 mouse = u_mouse * 2.0 - 1.0;
  mouse.y *= -1.0;

  // ── Fluid layer ──
  vec2 fluidUV = p * 2.0;
  float flow1 = snoise(fluidUV + vec2(t * 0.3, t * 0.2) + mouse * 0.3);
  float flow2 = snoise(fluidUV * 1.5 - vec2(t * 0.2, t * 0.15) + bass * 0.5);
  float flow3 = snoise(fluidUV * 3.0 + vec2(flow1, flow2) * 0.5 + high * 0.3);
  float fluid = (flow1 + flow2 * 0.5 + flow3 * 0.25) / 1.75;
  fluid = fluid * 0.5 + 0.5; // 0-1

  // Audio energy pumps the fluid
  fluid += bass * 0.3;
  fluid *= 1.0 + mid * 0.4;

  // ── Sculpture silhouette ──
  vec2 sp = p - mouse * 0.1;
  float sculptDist = sculptSDF(sp, u_sculpture);
  float sculptMask = smoothstep(0.02, -0.02, sculptDist);
  float sculptEdge = smoothstep(0.04, 0.0, abs(sculptDist));

  // ── Color palette — shifts with audio ──
  vec3 col1 = vec3(0.06, 0.06, 0.08); // deep black
  vec3 col2 = vec3(0.95 + bass * 0.3, 0.42 + mid * 0.2, 0.21 + high * 0.1); // ember
  vec3 col3 = vec3(0.29 + high * 0.2, 0.62 + bass * 0.15, 0.75); // cyan
  vec3 col4 = vec3(0.66, 0.33 + mid * 0.3, 0.97); // purple

  // Mix colors based on fluid + position
  vec3 color = col1;
  color = mix(color, col2, smoothstep(0.3, 0.7, fluid) * 0.7);
  color = mix(color, col3, smoothstep(0.5, 0.9, fluid + snoise(p * 4.0 + t * 0.1)) * 0.4);
  color = mix(color, col4, smoothstep(0.6, 1.0, fluid * (1.0 + bass)) * 0.3);

  // Sculpture — bright metallic with fluid reflection
  vec3 sculptColor = vec3(0.8 + fluid * 0.2) * (1.0 + bass * 0.5);
  sculptColor = mix(sculptColor, col2, 0.2 + bass * 0.3);
  color = mix(color, sculptColor, sculptMask);

  // Edge glow
  color += col2 * sculptEdge * (0.5 + bass * 2.0);

  // ── Chromatic aberration ──
  float aberr = 0.003 + bass * 0.012;
  vec2 dir = p;
  float rd = length(dir);
  // We simulate it by shifting the color channels
  color.r *= 1.0 + aberr * rd * 10.0;
  color.b *= 1.0 - aberr * rd * 5.0;

  // ── Bayer dither ──
  float ditherScale = 2.0 + mid * 3.0;
  float dith = bayer4(gl_FragCoord.xy / ditherScale);
  float luma = dot(color, vec3(0.299, 0.587, 0.114));
  float ditherStrength = 0.35 + bass * 0.25;
  vec3 dithered = color * step(dith * ditherStrength, luma + 0.1);
  color = mix(color, dithered, 0.45 + mid * 0.3);

  // ── Bloom (fake) — add glow to bright areas ──
  float bloom = max(0.0, luma - 0.6) * (2.0 + bass * 4.0);
  color += col2 * bloom * 0.3;
  color += col3 * bloom * 0.15;

  // ── Scanlines ──
  float scan = sin(gl_FragCoord.y * 1.5 + t * 2.0) * 0.02;
  color += scan;

  // ── Film grain ──
  float grain = (fract(sin(dot(uv * (t + 1.0), vec2(12.9898, 78.233))) * 43758.5453) - 0.5) * 0.05;
  color += grain;

  // ── Vignette ──
  float vig = 1.0 - rd * (1.0 + bass * 0.4);
  color *= max(vig, 0.0);

  gl_FragColor = vec4(max(color, 0.0), 1.0);
}`;

const sculptures = [
  "Gilly", "Female Twin", "The Portal", "Echeveria",
  "Divi", "Fata", "Le Attrata", "Springwater",
];

export default function SculptureShowcase() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [idx, setIdx] = useState(0);
  const [entered, setEntered] = useState(false);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const analyzerRef = useRef(new AudioAnalyzer());
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const glRef = useRef<{ gl: WebGLRenderingContext; prog: WebGLProgram; uniforms: Record<string, WebGLUniformLocation | null> } | null>(null);
  const frameRef = useRef(0);
  const idxRef = useRef(0);
  idxRef.current = idx;

  // ── Init WebGL ──
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", { alpha: false, antialias: false }) as WebGLRenderingContext | null;
    if (!gl) { console.error("No WebGL"); return; }

    // Compile shaders
    function compile(src: string, type: number) {
      const s = gl!.createShader(type)!;
      gl!.shaderSource(s, src);
      gl!.compileShader(s);
      if (!gl!.getShaderParameter(s, gl!.COMPILE_STATUS)) {
        console.error("Shader:", gl!.getShaderInfoLog(s));
      }
      return s;
    }

    const vs = compile(VS, gl.VERTEX_SHADER);
    const fs = compile(FS, gl.FRAGMENT_SHADER);
    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error("Link:", gl.getProgramInfoLog(prog));
    }
    gl.useProgram(prog);

    // Fullscreen quad
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,1]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uniforms: Record<string, WebGLUniformLocation | null> = {
      u_time: gl.getUniformLocation(prog, "u_time"),
      u_bass: gl.getUniformLocation(prog, "u_bass"),
      u_mid: gl.getUniformLocation(prog, "u_mid"),
      u_high: gl.getUniformLocation(prog, "u_high"),
      u_resolution: gl.getUniformLocation(prog, "u_resolution"),
      u_mouse: gl.getUniformLocation(prog, "u_mouse"),
      u_sculpture: gl.getUniformLocation(prog, "u_sculpture"),
    };

    glRef.current = { gl, prog, uniforms };

    // Resize
    function resize() {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
      gl!.viewport(0, 0, canvas!.width, canvas!.height);
    }
    resize();
    window.addEventListener("resize", resize);

    // Mouse
    function onMouse(e: MouseEvent) {
      mouseRef.current = { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight };
    }
    window.addEventListener("mousemove", onMouse);

    // Render loop
    const start = Date.now();
    let dead = false;

    function render() {
      if (dead) return;
      const t = (Date.now() - start) / 1000;
      const a = analyzerRef.current;
      a.update();

      gl!.uniform1f(uniforms.u_time, t);
      gl!.uniform1f(uniforms.u_bass, a.getBass());
      gl!.uniform1f(uniforms.u_mid, a.getMid());
      gl!.uniform1f(uniforms.u_high, a.getHigh());
      gl!.uniform2f(uniforms.u_resolution, canvas!.width, canvas!.height);
      gl!.uniform2f(uniforms.u_mouse, mouseRef.current.x, mouseRef.current.y);
      gl!.uniform1i(uniforms.u_sculpture, idxRef.current);

      gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4);
      frameRef.current = requestAnimationFrame(render);
    }
    render();

    return () => {
      dead = true;
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
    };
  }, []);

  const enter = useCallback(() => {
    setEntered(true);
    const el = audioRef.current;
    if (el) {
      analyzerRef.current.init(el);
      el.play().catch(() => {});
      setPlaying(true);
    }
  }, []);

  const togglePlay = useCallback(() => {
    const el = audioRef.current;
    if (!el) return;
    if (el.paused) { el.play(); setPlaying(true); }
    else { el.pause(); setPlaying(false); }
  }, []);

  const next = useCallback(() => setIdx(i => (i + 1) % sculptures.length), []);
  const prev = useCallback(() => setIdx(i => (i - 1 + sculptures.length) % sculptures.length), []);

  useEffect(() => {
    if (!entered) return;
    const h = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "d") next();
      if (e.key === "ArrowLeft" || e.key === "a") prev();
      if (e.key === " ") { e.preventDefault(); togglePlay(); }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [entered, next, prev, togglePlay]);

  return (
    <div className="relative w-screen h-screen bg-[#080808] overflow-hidden cursor-crosshair">
      <audio ref={audioRef} loop crossOrigin="anonymous" preload="auto" src="/audio/showcase-track.mp3" />

      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Entry screen */}
      {!entered && (
        <div className="absolute inset-0 z-50 bg-[#080808]/90 backdrop-blur-sm flex items-center justify-center cursor-pointer" onClick={enter}>
          <div className="text-center">
            <p className="text-[10px] tracking-[0.5em] uppercase text-numinous-ember mb-6">Numinous Designs</p>
            <p className="text-3xl sm:text-5xl md:text-6xl font-heading font-bold mb-8">
              Interactive <span className="text-gradient">Showcase</span>
            </p>
            <div className="inline-flex items-center gap-3 border border-white/20 px-8 py-4 hover:border-numinous-ember transition-colors duration-300">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-numinous-ember"><polygon points="5,3 19,12 5,21" /></svg>
              <span className="text-xs tracking-[0.3em] uppercase">Click to Enter + Enable Audio</span>
            </div>
            <p className="text-[9px] text-white/20 mt-6 tracking-widest uppercase">
              Music by <a href="https://www.thugshells.ca/" target="_blank" rel="noopener noreferrer" className="text-numinous-ember/50 hover:text-numinous-ember transition-colors">Thugshells</a>
            </p>
          </div>
        </div>
      )}

      {/* UI */}
      {entered && (
        <div className="absolute inset-0 pointer-events-none z-10">
          <div className="absolute top-8 left-8 md:top-12 md:left-12">
            <p className="text-[10px] tracking-[0.5em] uppercase text-numinous-ember mb-1">Numinous Designs</p>
            <p className="text-[9px] tracking-[0.3em] uppercase text-white/30">Interactive Showcase</p>
          </div>

          <div className="absolute top-8 right-8 md:top-12 md:right-12 text-right pointer-events-auto">
            <p className="text-xs tracking-widest text-white/30 font-mono mb-3">
              {String(idx + 1).padStart(2, "0")} / {String(sculptures.length).padStart(2, "0")}
            </p>
            <a href="/portfolio" className="text-[10px] tracking-[0.3em] uppercase text-white/30 hover:text-numinous-ember transition-colors">Portfolio →</a>
          </div>

          <div className="absolute bottom-28 left-8 md:left-12">
            <p className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-heading font-bold leading-[0.9]">{sculptures[idx]}</p>
            <p className="text-[10px] tracking-[0.3em] uppercase text-white/20 mt-3">Move mouse · Arrows to browse · Space to pause</p>
          </div>

          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 pointer-events-auto">
            <button onClick={togglePlay} className="flex items-center gap-3 border border-white/10 px-5 py-2 hover:border-numinous-ember/50 transition-colors rounded-full bg-black/30 backdrop-blur-sm">
              {playing
                ? <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 text-numinous-ember"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
                : <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 text-numinous-ember"><polygon points="5,3 19,12 5,21" /></svg>}
              <span className="text-[9px] tracking-[0.3em] uppercase text-white/50">{playing ? "Thugshells — Breakbeat Mix" : "Play"}</span>
            </button>
          </div>

          <div className="absolute bottom-12 right-8 md:right-12 flex items-center gap-3 pointer-events-auto">
            <button onClick={prev} className="w-10 h-10 border border-white/15 rounded-full flex items-center justify-center hover:border-numinous-ember transition-all">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button onClick={next} className="w-10 h-10 border border-white/15 rounded-full flex items-center justify-center hover:border-numinous-ember transition-all">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>

          <div className="absolute bottom-24 left-8 md:left-12 pointer-events-auto">
            <div className="flex gap-1.5">
              {sculptures.map((s, i) => (
                <button key={s} onClick={() => setIdx(i)} className={`h-1.5 rounded-full transition-all duration-300 ${i === idx ? "bg-numinous-ember w-5" : "bg-white/15 hover:bg-white/30 w-1.5"}`} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
