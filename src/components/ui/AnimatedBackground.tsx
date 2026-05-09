"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

// WebGL molten particle field — like standing inside the forge looking up
const VS = `attribute vec2 a_pos; varying vec2 v_uv;
void main(){v_uv=a_pos*0.5+0.5; gl_Position=vec4(a_pos,0.0,1.0);}`;

const FS = `
precision mediump float;
uniform float u_time;
uniform vec2 u_resolution;

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
  vec2 uv=gl_FragCoord.xy/u_resolution;
  float t=u_time*0.08;

  vec2 p=uv*2.5;
  float warp=snoise(p*0.6+t*0.3)*0.4;
  p+=warp;

  float n1=snoise(p+vec2(t*0.15,t*0.1));
  float n2=snoise(p*1.8+vec2(-t*0.1,t*0.2));
  float n3=snoise(p*0.6+vec2(t*0.08,-t*0.15));

  // Warm dark palette — forge interior
  vec3 cDeep=vec3(0.03,0.015,0.01);
  vec3 cEmber=vec3(0.35,0.12,0.02);
  vec3 cGlow=vec3(0.6,0.25,0.05);
  vec3 cSteel=vec3(0.08,0.08,0.1);

  vec3 col=mix(cDeep,cSteel,smoothstep(-0.3,0.5,n3)*0.3);
  col=mix(col,cEmber,smoothstep(-0.2,0.6,n1)*0.2);

  // Hot veins through the darkness
  float vein1=smoothstep(0.4,0.44,abs(n1+n2*0.5));
  float vein2=smoothstep(0.36,0.41,abs(n2+n3*0.5));
  col=mix(col,cGlow,vein1*0.35);
  col=mix(col,cEmber*1.5,vein2*0.2);

  // Bottom forge glow
  float forgeGlow=smoothstep(0.5,-0.1,uv.y)*0.08;
  col+=vec3(0.4,0.15,0.03)*forgeGlow;

  col*=0.35;

  // Vignette
  float vig=1.0-dot(uv-0.5,uv-0.5)*0.8;
  col*=vig;

  gl_FragColor=vec4(col,1.0);
}
`;

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null;
    if (!gl) return;

    let W: number, H: number, dead = false;

    function resize() {
      W = canvas!.width = window.innerWidth;
      H = canvas!.height = window.innerHeight;
      gl!.viewport(0, 0, W, H);
    }
    resize();
    window.addEventListener("resize", resize);

    function compile(src: string, type: number) {
      const s = gl!.createShader(type)!;
      gl!.shaderSource(s, src); gl!.compileShader(s); return s;
    }
    const vs = compile(VS, gl.VERTEX_SHADER);
    const fs = compile(FS, gl.FRAGMENT_SHADER);
    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs); gl.attachShader(prog, fs);
    gl.linkProgram(prog); gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,1]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, "u_time");
    const uRes = gl.getUniformLocation(prog, "u_resolution");
    const start = Date.now();

    function render() {
      if (dead) return;
      gl!.uniform1f(uTime, (Date.now() - start) / 1000);
      gl!.uniform2f(uRes, W, H);
      gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4);
      requestAnimationFrame(render);
    }
    render();
    return () => { dead = true; window.removeEventListener("resize", resize); };
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full block" />

      {/* Floating metallic particles */}
      {[...Array(50)].map((_, i) => {
        const isHot = i < 15;
        const color = isHot
          ? ["#ff6b35", "#ffaa00", "#ff8c00", "#ffffff"][i % 4]
          : ["#52525b", "#71717a", "#a1a1aa"][i % 3];
        const size = isHot ? 2 + Math.random() * 3 : 1 + Math.random() * 2;
        return (
          <motion.div
            key={`p-${i}`}
            animate={{
              y: [0, -200 - Math.random() * 400],
              x: [(Math.random() - 0.5) * 40, (Math.random() - 0.5) * 120],
              opacity: [0, isHot ? 0.7 : 0.2, 0],
              rotate: [0, Math.random() * 360],
            }}
            transition={{
              duration: 5 + Math.random() * 10,
              repeat: Infinity,
              delay: Math.random() * 12,
              ease: "easeOut",
            }}
            className="absolute"
            style={{
              bottom: `${Math.random() * 60}%`,
              left: `${5 + Math.random() * 90}%`,
              width: size,
              height: size,
              background: color,
              boxShadow: isHot ? `0 0 ${size * 3}px ${color}80` : "none",
              borderRadius: Math.random() > 0.5 ? "50%" : "1px",
            }}
          />
        );
      })}
    </div>
  );
}
