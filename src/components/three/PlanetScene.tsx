"use client";

import { useRef, Suspense, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Sparkles, Stars } from "@react-three/drei";
import * as THREE from "three";

/* Soft fresnel atmosphere shell — gives planets a real rim-lit halo
   instead of a flat scaled sphere. Additive, draws only at the silhouette. */
function Atmosphere({
  size,
  color,
  power = 2.6,
  intensity = 1.35,
}: {
  size: number;
  color: string;
  power?: number;
  intensity?: number;
}) {
  const uniforms = useMemo(
    () => ({
      uColor: { value: new THREE.Color(color) },
      uPower: { value: power },
      uIntensity: { value: intensity },
    }),
    [color, power, intensity]
  );

  return (
    <mesh scale={1.16}>
      <sphereGeometry args={[size, 64, 64]} />
      <shaderMaterial
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        side={THREE.BackSide}
        uniforms={uniforms}
        vertexShader={`
          varying vec3 vN;
          varying vec3 vV;
          void main() {
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            vN = normalize(normalMatrix * normal);
            vV = normalize(-mv.xyz);
            gl_Position = projectionMatrix * mv;
          }
        `}
        fragmentShader={`
          uniform vec3 uColor;
          uniform float uPower;
          uniform float uIntensity;
          varying vec3 vN;
          varying vec3 vV;
          void main() {
            float f = pow(1.0 - abs(dot(vN, vV)), uPower);
            gl_FragColor = vec4(uColor, f * uIntensity);
          }
        `}
      />
    </mesh>
  );
}

function Planet({
  position,
  size,
  color,
  emissive,
  atmosphere,
  speed,
  emissiveIntensity = 0.12,
}: {
  position: [number, number, number];
  size: number;
  color: string;
  emissive: string;
  atmosphere: string;
  speed: number;
  emissiveIntensity?: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ref.current) ref.current.rotation.y = state.clock.elapsedTime * speed;
  });

  return (
    <Float speed={0.4} floatIntensity={0.22} rotationIntensity={0.06}>
      <group position={position}>
        <mesh ref={ref}>
          <sphereGeometry args={[size, 64, 64]} />
          <meshStandardMaterial
            color={color}
            emissive={emissive}
            emissiveIntensity={emissiveIntensity}
            roughness={0.85}
            metalness={0.15}
          />
        </mesh>
        <Atmosphere size={size} color={atmosphere} />
      </group>
    </Float>
  );
}

/* Soft volumetric haze — large, dim additive billboards for nebula depth.
   Replaces the old flat purple plane. */
function NebulaGlow({
  position,
  scale,
  color,
}: {
  position: [number, number, number];
  scale: number;
  color: string;
}) {
  const uniforms = useMemo(
    () => ({ uColor: { value: new THREE.Color(color) } }),
    [color]
  );
  return (
    <mesh position={position} scale={scale}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={uniforms}
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform vec3 uColor;
          varying vec2 vUv;
          void main() {
            float d = distance(vUv, vec2(0.5));
            float a = smoothstep(0.5, 0.0, d);
            gl_FragColor = vec4(uColor, a * 0.10);
          }
        `}
      />
    </mesh>
  );
}

/* Combined camera rig: gentle scroll dolly + subtle mouse parallax,
   both lerped so motion always feels smooth and intentional. */
function CameraRig() {
  const { camera } = useThree();
  const scroll = useRef(0);
  const mouse = useRef({ x: 0, y: 0, tx: 0, ty: 0 });

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scroll.current = max > 0 ? window.scrollY / max : 0;
    };
    const onMove = (e: PointerEvent) => {
      mouse.current.tx = e.clientX / window.innerWidth - 0.5;
      mouse.current.ty = e.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  useFrame(() => {
    const m = mouse.current;
    m.x += (m.tx - m.x) * 0.04;
    m.y += (m.ty - m.y) * 0.04;
    const targetZ = 12 - scroll.current * 6.5;
    camera.position.z += (targetZ - camera.position.z) * 0.06;
    camera.position.x += (m.x * 1.1 - camera.position.x) * 0.05;
    camera.position.y += (-m.y * 0.7 - camera.position.y) * 0.05;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

export default function PlanetScene() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 12], fov: 50 }}
        gl={{ antialias: true }}
        dpr={[1, 1.5]}
      >
        <Suspense fallback={null}>
          {/* Opaque space background — required for the postprocessing color
              pipeline to encode sRGB correctly (a transparent canvas breaks it
              and crushes the whole scene dark). */}
          <color attach="background" args={["#04060e"]} />
          <fog attach="fog" args={["#04060e", 12, 36]} />

          {/* Lighting — dramatic: warm key creates a visible lit side, cool
              fill, white rim, low ambient so planets read as lit bodies. */}
          <ambientLight intensity={0.45} color="#33405f" />
          <directionalLight position={[7, 4, 5]} intensity={1.7} color="#ffe9d6" />
          <directionalLight position={[-7, 2, -4]} intensity={0.6} color="#4f7ac0" />
          <directionalLight position={[0, -4, -5]} intensity={0.5} color="#ffffff" />
          <pointLight position={[-5, -1, 2]} intensity={0.9} color="#e0a45c" distance={18} />

          {/* Nebula haze for depth (cool blue + faint ember) */}
          <NebulaGlow position={[7, 4, -16]} scale={26} color="#2a3f6b" />
          <NebulaGlow position={[-8, -3, -18]} scale={30} color="#6b3a1f" />

          {/* Starfield */}
          <Stars
            radius={90}
            depth={50}
            count={4500}
            factor={3.5}
            saturation={0}
            fade
            speed={0.4}
          />

          {/* Hero planet — large, luminous slate blue, top right */}
          <Planet
            position={[6, 2.6, -5]}
            size={2.5}
            color="#46598c"
            emissive="#34589e"
            atmosphere="#8fb4f0"
            speed={0.04}
            emissiveIntensity={0.6}
          />

          {/* Accent planet — warm ember, ties to the studio's fire work */}
          <Planet
            position={[-5, -1.2, -3]}
            size={1.5}
            color="#7a4828"
            emissive="#bd5a1e"
            atmosphere="#ffb066"
            speed={0.07}
            emissiveIntensity={0.7}
          />

          {/* Distant moon — dim, cold */}
          <Planet
            position={[-2.5, 4, -9]}
            size={0.55}
            color="#6a7290"
            emissive="#49527a"
            atmosphere="#9aa6cc"
            speed={0.1}
            emissiveIntensity={0.5}
          />

          <Sparkles count={50} scale={22} size={1.1} speed={0.12} color="#fff3e2" opacity={0.25} />

          <CameraRig />
        </Suspense>
      </Canvas>

      {/* Cinematic finish via CSS (reliable across GPUs, unlike the WebGL
          post-processing composer which crushed this scene's color):
          subtle film grain + a soft vignette so the artwork stays the hero. */}
      <div
        className="absolute inset-0 mix-blend-overlay"
        style={{
          opacity: 0.05,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundSize: "180px 180px",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 42%, transparent 52%, rgba(2,4,10,0.55) 100%)",
        }}
      />
    </div>
  );
}
