"use client";

import { useRef, useEffect } from "react";

const VS = `attribute vec2 a_pos; void main(){gl_Position=vec4(a_pos,0.0,1.0);}`;

const FS = `
precision highp float;
uniform float u_time;
uniform float u_zoom;
uniform float u_opacity;
uniform vec2 u_resolution;

// Triangle edge distance using dot products (no branching)
float triDist(vec2 p, float size) {
  float k = 1.732050808; // sqrt(3)
  p.y += size * 0.57735; // offset so triangle is centered
  // Three edges
  float d1 = -p.y;
  float d2 = 0.5 * (k * p.x - p.y);
  float d3 = 0.5 * (-k * p.x - p.y);
  float inside = max(max(d1, d2), d3) - size * 0.5;
  return inside;
}

void main() {
  vec2 uv = (gl_FragCoord.xy - u_resolution * 0.5) / min(u_resolution.x, u_resolution.y);
  float t = u_time;

  // Exponential zoom driven by scroll
  float zoom = exp(u_zoom * 5.0);

  vec2 p = uv * zoom;

  // Gentle rotation with zoom
  float angle = u_zoom * 0.8 + t * 0.1;
  float ca = cos(angle);
  float sa = sin(angle);
  p = vec2(ca * p.x - sa * p.y, sa * p.x + ca * p.y);

  // Infinite repetition via log-polar coordinates
  float r = length(p);
  float a = atan(p.y, p.x);

  // Layer spacing in log space
  float spacing = 0.7;
  float logR = log(r + 0.0001);
  float layerPhase = mod(logR, spacing) / spacing; // 0-1 within each layer
  float layerIdx = floor(logR / spacing);

  // Reconstruct position within the layer
  float layerR = exp(layerPhase * spacing) * 0.5;
  float layerAngle = a + layerIdx * 0.2; // slight twist per layer
  vec2 lp = vec2(cos(layerAngle), sin(layerAngle)) * layerR;

  // Triangle distance
  float d = triDist(lp, 0.35);

  // Edge lines
  float edgeWidth = 0.008 + 0.004 * (1.0 - layerPhase);
  float edge = smoothstep(edgeWidth, 0.0, abs(d));

  // Glow around edges
  float glow = smoothstep(0.05, 0.0, abs(d)) * 0.4;

  // Color cycling per layer
  float hue = layerIdx * 0.3 + t * 0.2;
  vec3 c1 = vec3(0.3, 0.6, 1.0);  // blue
  vec3 c2 = vec3(0.6, 0.3, 1.0);  // purple
  vec3 c3 = vec3(0.8, 0.8, 1.0);  // white-blue
  vec3 edgeColor = mix(c1, c2, sin(hue) * 0.5 + 0.5);
  edgeColor = mix(edgeColor, c3, sin(hue * 1.5 + 1.0) * 0.3 + 0.2);

  // Depth fade — deeper layers slightly dimmer
  float depthFade = 1.0 / (1.0 + abs(logR) * 0.08);

  // Build final color
  vec3 col = vec3(0.0);
  col += edgeColor * edge * depthFade;
  col += edgeColor * glow * depthFade * 0.5;

  // Center glow
  float centerGlow = smoothstep(0.4, 0.0, length(uv)) * 0.04;
  col += vec3(0.3, 0.5, 1.0) * centerGlow;

  // Apply opacity
  float alpha = (edge + glow * 0.5) * u_opacity * depthFade;
  col *= u_opacity;

  gl_FragColor = vec4(col, alpha);
}
`;

interface Props {
  zoom: number;
  opacity: number;
}

export default function TriangleFractal({ zoom, opacity }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const propsRef = useRef({ zoom: 0, opacity: 0 });
  propsRef.current = { zoom, opacity };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = (canvas.getContext("webgl", { alpha: true, premultipliedAlpha: false }) ||
      canvas.getContext("experimental-webgl", { alpha: true, premultipliedAlpha: false })) as WebGLRenderingContext | null;
    if (!gl) return;

    let dead = false;

    function resize() {
      canvas!.width = canvas!.clientWidth;
      canvas!.height = canvas!.clientHeight;
      gl!.viewport(0, 0, canvas!.width, canvas!.height);
    }
    resize();
    window.addEventListener("resize", resize);

    function compile(src: string, type: number) {
      const s = gl!.createShader(type)!;
      gl!.shaderSource(s, src);
      gl!.compileShader(s);
      if (!gl!.getShaderParameter(s, gl!.COMPILE_STATUS)) {
        console.error("Shader compile error:", gl!.getShaderInfoLog(s));
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
      console.error("Program link error:", gl.getProgramInfoLog(prog));
    }
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,1]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

    const uTime = gl.getUniformLocation(prog, "u_time");
    const uZoom = gl.getUniformLocation(prog, "u_zoom");
    const uOpacity = gl.getUniformLocation(prog, "u_opacity");
    const uRes = gl.getUniformLocation(prog, "u_resolution");

    const start = Date.now();

    function render() {
      if (dead) return;
      const t = (Date.now() - start) / 1000;
      gl!.clearColor(0, 0, 0, 0);
      gl!.clear(gl!.COLOR_BUFFER_BIT);
      gl!.uniform1f(uTime, t);
      gl!.uniform1f(uZoom, propsRef.current.zoom);
      gl!.uniform1f(uOpacity, propsRef.current.opacity);
      gl!.uniform2f(uRes, canvas!.width, canvas!.height);
      gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4);
      requestAnimationFrame(render);
    }
    render();

    return () => {
      dead = true;
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full absolute inset-0"
      style={{ pointerEvents: "none" }}
    />
  );
}
