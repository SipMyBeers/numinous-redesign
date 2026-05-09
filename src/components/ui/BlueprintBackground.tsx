"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

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
  float aspect=u_resolution.x/u_resolution.y;
  float t=u_time*0.1;

  // Base dark cool tone
  vec3 col=vec3(0.015,0.025,0.05);

  // Grid
  vec2 gridUV=uv*vec2(aspect,1.0);
  float gridSize=0.05;
  float fineGrid=0.0125;

  // Major grid lines
  vec2 g1=abs(fract(gridUV/gridSize+0.5)-0.5)*gridSize;
  float majorLine=1.0-smoothstep(0.0,0.001,min(g1.x,g1.y));
  col+=vec3(0.05,0.12,0.25)*majorLine*0.25;

  // Minor grid lines
  vec2 g2=abs(fract(gridUV/fineGrid+0.5)-0.5)*fineGrid;
  float minorLine=1.0-smoothstep(0.0,0.0006,min(g2.x,g2.y));
  col+=vec3(0.03,0.08,0.18)*minorLine*0.1;

  // Data flow lines — horizontal pulses
  float flowY=fract(uv.y*3.0-t*0.4);
  float flow=smoothstep(0.49,0.5,flowY)*smoothstep(0.51,0.5,flowY);
  float flowMask=smoothstep(0.0,0.3,snoise(vec2(uv.x*5.0,t*0.5))+0.3);
  col+=vec3(0.1,0.3,0.6)*flow*flowMask*0.15;

  // Vertical data streams
  float flowX=fract(uv.x*aspect*4.0+t*0.3);
  float vflow=smoothstep(0.49,0.5,flowX)*smoothstep(0.51,0.5,flowX);
  float vflowMask=smoothstep(0.0,0.3,snoise(vec2(uv.y*4.0,t*0.3))+0.2);
  col+=vec3(0.06,0.15,0.35)*vflow*vflowMask*0.1;

  // Organic noise — subtle energy field
  float n1=snoise(uv*3.0+vec2(t*0.2,t*0.15));
  float n2=snoise(uv*5.0+vec2(-t*0.1,t*0.25));
  float energy=smoothstep(0.35,0.42,abs(n1+n2*0.5));
  col+=vec3(0.08,0.2,0.5)*energy*0.08;

  // Scan pulse — sweeping horizontal highlight
  float scan=smoothstep(0.0,0.08,abs(uv.y-fract(t*0.15)));
  scan=1.0-scan;
  col+=vec3(0.05,0.15,0.35)*scan*0.12;

  // Node hotspots — bright points at grid intersections
  for(int i=0;i<6;i++){
    float fi=float(i);
    vec2 nodePos=vec2(
      0.15+fi*0.14+sin(t+fi)*0.03,
      0.2+mod(fi*0.17,0.6)+cos(t*0.7+fi*1.3)*0.04
    );
    float d=length(uv-nodePos);
    float glow=smoothstep(0.06,0.0,d);
    float pulse=0.5+0.5*sin(t*2.0+fi*1.5);
    col+=vec3(0.15,0.4,0.9)*glow*pulse*0.4;
    // Ring around node
    float ring=smoothstep(0.002,0.0,abs(d-0.04-pulse*0.01));
    col+=vec3(0.1,0.25,0.6)*ring*0.3;
  }

  // Vignette
  float vig=1.0-dot(uv-0.5,uv-0.5)*0.9;
  col*=vig;

  // Corner brackets — technical frame
  float edgeDist=min(min(uv.x,1.0-uv.x),min(uv.y,1.0-uv.y));
  float bracket=smoothstep(0.002,0.0,abs(edgeDist-0.03))*step(min(uv.x,uv.y),0.1)*step(min(1.0-uv.x,1.0-uv.y),1.0);
  col+=vec3(0.06,0.15,0.3)*bracket*0.5;

  gl_FragColor=vec4(col,1.0);
}
`;

export default function BlueprintBackground() {
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
      gl!.shaderSource(s, src); gl!.compileShader(s);
      if (!gl!.getShaderParameter(s, gl!.COMPILE_STATUS)) console.error(gl!.getShaderInfoLog(s));
      return s;
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

      {/* Floating data particles */}
      {[...Array(30)].map((_, i) => {
        const isActive = i < 10;
        const color = isActive ? "#60b5ff" : i % 2 === 0 ? "#a855f7" : "#3b82f6";
        return (
          <motion.div
            key={`bp-${i}`}
            animate={{
              y: [0, (Math.random() - 0.5) * 300],
              x: [0, (Math.random() - 0.5) * 200],
              opacity: [0, isActive ? 0.6 : 0.15, 0],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 4 + Math.random() * 8,
              repeat: Infinity,
              delay: Math.random() * 10,
              ease: "easeInOut",
            }}
            className="absolute rounded-full"
            style={{
              top: `${10 + Math.random() * 80}%`,
              left: `${5 + Math.random() * 90}%`,
              width: isActive ? 3 : 2,
              height: isActive ? 3 : 2,
              background: color,
              boxShadow: isActive ? `0 0 8px ${color}80` : "none",
            }}
          />
        );
      })}

      {/* Animated connection lines */}
      <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
        {[...Array(8)].map((_, i) => (
          <motion.line
            key={`conn-${i}`}
            x1={`${10 + i * 12}%`} y1={`${20 + (i % 3) * 25}%`}
            x2={`${22 + i * 10}%`} y2={`${35 + (i % 4) * 18}%`}
            stroke="#60b5ff"
            strokeWidth="0.5"
            animate={{ opacity: [0.1, 0.5, 0.1] }}
            transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: i * 0.8 }}
          />
        ))}
      </svg>
    </div>
  );
}
