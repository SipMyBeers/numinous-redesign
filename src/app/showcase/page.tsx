"use client";

import { useEffect, useRef, useState } from "react";

export default function ShowcasePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState("Initializing...");

  useEffect(() => {
    const nav = document.querySelector("nav")?.parentElement;
    const footer = document.querySelector("footer");
    if (nav) nav.style.display = "none";
    if (footer) footer.style.display = "none";

    const canvas = canvasRef.current;
    if (!canvas) { setStatus("No canvas"); return; }

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const gl = canvas.getContext("webgl") as WebGLRenderingContext | null;
    if (!gl) { setStatus("No WebGL"); return; }

    const vsrc = "attribute vec2 a;void main(){gl_Position=vec4(a,0,1);}";
    const fsrc = "precision mediump float;uniform float t;uniform vec2 r;void main(){vec2 uv=gl_FragCoord.xy/r;vec3 c=vec3(uv.x,0.3+0.3*sin(t),uv.y);gl_FragColor=vec4(c,1.0);}";

    function mkShader(src: string, type: number) {
      const s = gl!.createShader(type)!;
      gl!.shaderSource(s, src);
      gl!.compileShader(s);
      if (!gl!.getShaderParameter(s, gl!.COMPILE_STATUS)) {
        setStatus("SHADER: " + gl!.getShaderInfoLog(s));
        return null;
      }
      return s;
    }

    const vs = mkShader(vsrc, gl.VERTEX_SHADER);
    const fs = mkShader(fsrc, gl.FRAGMENT_SHADER);
    if (!vs || !fs) return;

    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      setStatus("LINK: " + gl.getProgramInfoLog(prog));
      return;
    }
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,1]), gl.STATIC_DRAW);
    const a = gl.getAttribLocation(prog, "a");
    gl.enableVertexAttribArray(a);
    gl.vertexAttribPointer(a, 2, gl.FLOAT, false, 0, 0);
    gl.viewport(0, 0, canvas.width, canvas.height);

    const ut = gl.getUniformLocation(prog, "t");
    const ur = gl.getUniformLocation(prog, "r");

    setStatus("Rendering...");
    let dead = false;
    const start = Date.now();

    function loop() {
      if (dead) return;
      gl!.uniform1f(ut, (Date.now() - start) / 1000);
      gl!.uniform2f(ur, canvas!.width, canvas!.height);
      gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4);
      requestAnimationFrame(loop);
    }
    loop();

    const onResize = () => {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
      gl!.viewport(0, 0, canvas!.width, canvas!.height);
    };
    window.addEventListener("resize", onResize);

    return () => {
      dead = true;
      window.removeEventListener("resize", onResize);
      if (nav) nav.style.display = "";
      if (footer) footer.style.display = "";
    };
  }, []);

  return (
    <div style={{ margin: 0, padding: 0, width: "100vw", height: "100vh", overflow: "hidden", position: "relative", zIndex: 100 }}>
      <p style={{
        position: "absolute", top: 20, left: 20, zIndex: 999,
        color: "lime", fontSize: 24, fontFamily: "monospace",
        background: "rgba(0,0,0,0.9)", padding: "10px 20px",
      }}>
        {status}
      </p>
      <canvas
        ref={canvasRef}
        style={{ display: "block", width: "100vw", height: "100vh" }}
      />
    </div>
  );
}
