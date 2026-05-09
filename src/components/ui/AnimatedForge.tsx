"use client";

import { useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

// WebGL shader that distorts the image to simulate flowing lava and moving chains
const VS = `attribute vec2 a_pos; varying vec2 v_uv;
void main(){v_uv=vec2(a_pos.x*0.5+0.5, 1.0-(a_pos.y*0.5+0.5)); gl_Position=vec4(a_pos,0.0,1.0);}`;

const FS = `
precision mediump float;
varying vec2 v_uv;
uniform sampler2D u_tex;
uniform float u_time;
uniform float u_scroll;

vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec2 mod289(vec2 x){return x-floor(x*(1.0/289.0))*289.0;}
vec3 permute(vec3 x){return mod289(((x*34.0)+1.0)*x);}
float snoise(vec2 v){
  const vec4 C=vec4(0.211324865405187,0.366025403784439,-0.577350269189626,0.024390243902439);
  vec2 i=floor(v+dot(v,C.yy));
  vec2 x0=v-i+dot(i,C.xx);
  vec2 i1=(x0.x>x0.y)?vec2(1.0,0.0):vec2(0.0,1.0);
  vec4 x12=x0.xyxy+C.xxzz; x12.xy-=i1;
  i=mod289(i);
  vec3 p=permute(permute(i.y+vec3(0.0,i1.y,1.0))+i.x+vec3(0.0,i1.x,1.0));
  vec3 m=max(0.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.0);
  m=m*m;m=m*m;
  vec3 x=2.0*fract(p*C.www)-1.0;
  vec3 h=abs(x)-0.5;
  vec3 ox=floor(x+0.5);
  vec3 a0=x-ox;
  m*=1.79284291400159-0.85373472095314*(a0*a0+h*h);
  vec3 g;
  g.x=a0.x*x0.x+h.x*x0.y;
  g.yz=a0.yz*x12.xz+h.yz*x12.yw;
  return 130.0*dot(m,g);
}

void main(){
  vec2 uv=v_uv;
  float t=u_time;

  // ── Sample original pixel to detect bright (lava) regions ──
  vec4 origColor=texture2D(u_tex,uv);
  float brightness=dot(origColor.rgb,vec3(0.299,0.587,0.114));
  float warmth=origColor.r-origColor.b; // positive = warm/orange/lava

  // ── Lava flow distortion ──
  // Only distort warm bright areas (molten metal)
  float lavaMask=smoothstep(0.3,0.7,warmth)*smoothstep(0.25,0.5,brightness);

  // Flow noise — moves downward and slightly sideways (pour direction)
  float n1=snoise(uv*4.0+vec2(t*0.15,-t*0.4))*0.012;
  float n2=snoise(uv*6.0+vec2(-t*0.1,-t*0.6))*0.008;
  float n3=snoise(uv*2.5+vec2(t*0.08,-t*0.25))*0.015;

  // Apply distortion only to lava areas
  vec2 lavaOffset=vec2(n1+n2, n2+n3)*lavaMask;
  uv+=lavaOffset;

  // ── Chain/metal sway ──
  // Subtle horizontal oscillation for dark metallic areas (chains, structure)
  float metalMask=(1.0-lavaMask)*smoothstep(0.05,0.2,brightness)*smoothstep(0.15,0.0,warmth);
  float chainSway=sin(uv.y*12.0+t*1.5)*0.002*metalMask;
  uv.x+=chainSway;

  // ── Heat shimmer above lava ──
  // Detect areas just above bright lava regions
  float heatSample=texture2D(u_tex,uv+vec2(0.0,0.05)).r;
  float heatMask=smoothstep(0.3,0.6,heatSample)*smoothstep(0.4,0.2,brightness);
  float shimmer=snoise(uv*8.0+vec2(t*0.3,t*0.5))*0.004*heatMask;
  uv+=shimmer;

  // ── Zoom with scroll ──
  float zoom=1.0+u_scroll*0.6;
  uv=(uv-0.5)/zoom+0.5;
  // Slight vertical pan as we zoom
  uv.y+=u_scroll*0.08;

  // Sample with distortion applied
  vec4 col=texture2D(u_tex,uv);

  // ── Lava glow pulse ──
  float pulse=0.5+0.5*sin(t*2.0+snoise(uv*3.0)*2.0);
  float glowAmount=lavaMask*pulse*0.15;
  col.rgb+=vec3(glowAmount*1.0,glowAmount*0.5,glowAmount*0.05);

  // ── Weld flash ──
  // Blue-white flash near the welder (right side, mid height)
  vec2 weldPos=vec2(0.72,0.38);
  float weldDist=length(uv-weldPos);
  float weldFlash=smoothstep(0.12,0.0,weldDist);
  float weldPulse=pow(0.5+0.5*sin(t*8.0+sin(t*13.0)*2.0),4.0);
  col.rgb+=vec3(0.3,0.5,0.8)*weldFlash*weldPulse*0.6;
  // Spark scatter near weld
  float sparkNoise=snoise(uv*30.0+vec2(t*5.0,t*3.0));
  float sparkMask=smoothstep(0.15,0.0,weldDist)*step(0.6,sparkNoise);
  col.rgb+=vec3(0.6,0.8,1.0)*sparkMask*0.4;

  // ── Subtle vignette ──
  float vig=1.0-dot(uv-0.5,uv-0.5)*0.8;
  col.rgb*=vig;

  gl_FragColor=col;
}
`;

export default function AnimatedForge() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollRef = useRef(0);

  // Track scroll for passing to shader
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scrollRef.current = max > 0 ? window.scrollY / max : 0;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null;
    if (!gl) return;

    let W: number, H: number;
    let dead = false;

    function resize() {
      W = canvas!.width = window.innerWidth;
      H = canvas!.height = window.innerHeight;
      gl!.viewport(0, 0, W, H);
    }
    resize();
    window.addEventListener("resize", resize);

    // Compile shaders
    function compile(src: string, type: number) {
      const s = gl!.createShader(type)!;
      gl!.shaderSource(s, src);
      gl!.compileShader(s);
      if (!gl!.getShaderParameter(s, gl!.COMPILE_STATUS)) {
        console.error(gl!.getShaderInfoLog(s));
      }
      return s;
    }

    const vs = compile(VS, gl.VERTEX_SHADER);
    const fs = compile(FS, gl.FRAGMENT_SHADER);
    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    gl.useProgram(prog);

    // Full-screen quad
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,1]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, "u_time");
    const uScroll = gl.getUniformLocation(prog, "u_scroll");
    const uTex = gl.getUniformLocation(prog, "u_tex");

    // Load image as texture
    const texture = gl.createTexture();
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      gl!.bindTexture(gl!.TEXTURE_2D, texture);
      gl!.texImage2D(gl!.TEXTURE_2D, 0, gl!.RGBA, gl!.RGBA, gl!.UNSIGNED_BYTE, img);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_S, gl!.CLAMP_TO_EDGE);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_T, gl!.CLAMP_TO_EDGE);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MIN_FILTER, gl!.LINEAR);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MAG_FILTER, gl!.LINEAR);
    };
    img.src = "/images/services/forge-bg.png";

    const start = Date.now();

    function render() {
      if (dead) return;
      const t = (Date.now() - start) / 1000;
      gl!.activeTexture(gl!.TEXTURE0);
      gl!.bindTexture(gl!.TEXTURE_2D, texture);
      gl!.uniform1i(uTex, 0);
      gl!.uniform1f(uTime, t);
      gl!.uniform1f(uScroll, scrollRef.current);
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
    <div className="fixed inset-0 z-0 overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full block" />

      {/* Ember particles rising from pour */}
      {[...Array(25)].map((_, i) => {
        const startX = 20 + Math.random() * 30;
        const color = i % 3 === 0 ? "#ffffff" : i % 2 === 0 ? "#ffaa00" : "#ff6b35";
        return (
          <motion.div
            key={`ember-${i}`}
            animate={{
              y: [0, -250 - Math.random() * 350],
              x: [(Math.random() - 0.5) * 30, (Math.random() - 0.5) * 100],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeOut",
            }}
            className="absolute rounded-full pointer-events-none"
            style={{
              top: `${30 + Math.random() * 35}%`,
              left: `${startX}%`,
              width: 2 + Math.random() * 2,
              height: 2 + Math.random() * 2,
              background: color,
              boxShadow: `0 0 4px 1px ${color}80`,
            }}
          />
        );
      })}

      {/* Readability overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-numinous-black/40 via-numinous-black/30 to-numinous-black/70 pointer-events-none" />
    </div>
  );
}
