"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, MeshTransmissionMaterial, Sparkles, Environment } from "@react-three/drei";
import * as THREE from "three";
import { Suspense } from "react";

/* ============================================================
   THE PORTAL — Concentric rotating rings with fire glow
   ============================================================ */
function PortalScene() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.z = state.clock.elapsedTime * 0.2;
  });

  return (
    <>
      <group ref={groupRef}>
        {[1.2, 1.6, 2.0, 2.4].map((r, i) => (
          <mesh key={i} rotation={[Math.PI / 2 + i * 0.15, i * 0.3, 0]}>
            <torusGeometry args={[r, 0.04, 32, 64]} />
            <meshStandardMaterial
              color="#c0c0c0"
              metalness={1}
              roughness={0.05}
              emissive="#ff4500"
              emissiveIntensity={0.15 + i * 0.05}
            />
          </mesh>
        ))}
      </group>
      <pointLight position={[0, 0, 0]} intensity={2} color="#ff6b35" distance={5} />
      <Sparkles count={40} scale={4} size={2} speed={0.5} color="#ff6b35" opacity={0.5} />
    </>
  );
}

/* ============================================================
   FEMALE TWIN — Mirrored distorted spheres
   ============================================================ */
function FemaleTwinScene() {
  const leftRef = useRef<THREE.Mesh>(null);
  const rightRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (leftRef.current) {
      leftRef.current.rotation.y = t * 0.3;
      leftRef.current.rotation.x = Math.sin(t * 0.2) * 0.1;
    }
    if (rightRef.current) {
      rightRef.current.rotation.y = -t * 0.3;
      rightRef.current.rotation.x = Math.sin(t * 0.2 + Math.PI) * 0.1;
    }
  });

  return (
    <>
      <Float speed={1.5} floatIntensity={0.3}>
        <mesh ref={leftRef} position={[-0.7, 0, 0]} scale={0.9}>
          <icosahedronGeometry args={[1, 4]} />
          <MeshDistortMaterial
            color="#d0d0d0"
            metalness={1}
            roughness={0.05}
            distort={0.25}
            speed={2}
          />
        </mesh>
      </Float>
      <Float speed={1.5} floatIntensity={0.3}>
        <mesh ref={rightRef} position={[0.7, 0, 0]} scale={0.9}>
          <icosahedronGeometry args={[1, 4]} />
          <MeshDistortMaterial
            color="#d0d0d0"
            metalness={1}
            roughness={0.05}
            distort={0.25}
            speed={2}
          />
        </mesh>
      </Float>
      <Sparkles count={20} scale={4} size={1.5} speed={0.3} color="#aaccff" opacity={0.3} />
    </>
  );
}

/* ============================================================
   ECHEVERIA — Blooming spiral petals (succulent-inspired)
   ============================================================ */
function EcheveriaScene() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.15;
  });

  const petals = useMemo(() => {
    const items = [];
    const count = 24;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 * 3; // spiral
      const radius = 0.3 + (i / count) * 1.5;
      const y = -0.5 + (i / count) * 0.8;
      const scale = 0.15 + (i / count) * 0.25;
      items.push({ angle, radius, y, scale, index: i });
    }
    return items;
  }, []);

  const colors = ["#b87333", "#cd7f32", "#d4a843", "#c0c0c0"];

  return (
    <>
      <group ref={groupRef}>
        {petals.map((p) => (
          <mesh
            key={p.index}
            position={[
              Math.cos(p.angle) * p.radius,
              p.y,
              Math.sin(p.angle) * p.radius,
            ]}
            rotation={[0.3, p.angle, Math.PI * 0.15]}
            scale={p.scale}
          >
            <sphereGeometry args={[1, 8, 6, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
            <meshStandardMaterial
              color={colors[p.index % colors.length]}
              metalness={0.9}
              roughness={0.15}
              side={THREE.DoubleSide}
            />
          </mesh>
        ))}
      </group>
      <pointLight position={[0, -2, 0]} intensity={1} color="#ff4500" distance={5} />
      <Sparkles count={30} scale={4} size={1.5} speed={0.4} color="#ff6b35" opacity={0.4} />
    </>
  );
}

/* ============================================================
   GILLY — Organic creature, distorted blob with spines
   ============================================================ */
function GillyScene() {
  const bodyRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!bodyRef.current) return;
    bodyRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    bodyRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
  });

  return (
    <>
      <Float speed={1} floatIntensity={0.4}>
        <mesh ref={bodyRef} scale={1.3}>
          <icosahedronGeometry args={[1, 3]} />
          <MeshDistortMaterial
            color="#708090"
            metalness={0.95}
            roughness={0.1}
            distort={0.45}
            speed={1.5}
          />
        </mesh>
        {/* Spines */}
        {[...Array(8)].map((_, i) => {
          const theta = (i / 8) * Math.PI * 2;
          return (
            <mesh
              key={i}
              position={[Math.cos(theta) * 1.1, Math.sin(theta) * 0.8, Math.sin(theta * 2) * 0.5]}
              rotation={[0, theta, Math.PI * 0.4]}
              scale={[0.03, 0.4, 0.03]}
            >
              <cylinderGeometry args={[0.5, 0, 1, 6]} />
              <meshStandardMaterial color="#505050" metalness={1} roughness={0.1} />
            </mesh>
          );
        })}
      </Float>
    </>
  );
}

/* ============================================================
   LE ATTRATA — Three moth-wing flame forms
   ============================================================ */
function LeAttrataScene() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.15;
  });

  return (
    <>
      <group ref={groupRef}>
        {[0, 1, 2].map((i) => {
          const angle = (i / 3) * Math.PI * 2;
          return (
            <Float key={i} speed={2} floatIntensity={0.2} rotationIntensity={0.3}>
              <mesh
                position={[Math.cos(angle) * 1, 0, Math.sin(angle) * 1]}
                rotation={[0, -angle + Math.PI, 0]}
              >
                <torusGeometry args={[0.6, 0.15, 16, 32, Math.PI]} />
                <meshStandardMaterial
                  color="#c0c0c0"
                  metalness={1}
                  roughness={0.05}
                  emissive="#ff4500"
                  emissiveIntensity={0.3}
                />
              </mesh>
            </Float>
          );
        })}
      </group>
      <pointLight position={[0, 0, 0]} intensity={3} color="#ff6b35" distance={4} />
      <Sparkles count={50} scale={3} size={2} speed={0.8} color="#ff6b35" opacity={0.6} />
    </>
  );
}

/* ============================================================
   DIVI — Commanding totemic form
   ============================================================ */
function DiviScene() {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.2;
  });

  return (
    <>
      <group ref={ref}>
        {/* Stacked geometric forms */}
        {[
          { y: -1, s: [0.8, 0.3, 0.8], g: "cylinder" },
          { y: -0.4, s: [0.6, 0.5, 0.6], g: "cylinder" },
          { y: 0.3, s: [0.7, 0.4, 0.7], g: "octahedron" },
          { y: 1, s: [0.4, 0.4, 0.4], g: "icosahedron" },
          { y: 1.6, s: [0.2, 0.3, 0.2], g: "cone" },
        ].map((part, i) => (
          <mesh key={i} position={[0, part.y, 0]} scale={part.s as [number, number, number]}>
            {part.g === "cylinder" && <cylinderGeometry args={[1, 1, 1, 8]} />}
            {part.g === "octahedron" && <octahedronGeometry args={[1, 0]} />}
            {part.g === "icosahedron" && <icosahedronGeometry args={[1, 1]} />}
            {part.g === "cone" && <cylinderGeometry args={[0, 1, 1, 6]} />}
            <meshStandardMaterial
              color={i % 2 === 0 ? "#808080" : "#a0a0a0"}
              metalness={1}
              roughness={0.1}
            />
          </mesh>
        ))}
      </group>
      <Sparkles count={15} scale={3} size={1} speed={0.2} color="#d4a843" opacity={0.3} />
    </>
  );
}

/* ============================================================
   SPRINGWATER — Flowing liquid metal ribbons
   ============================================================ */
function SpringwaterScene() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
  });

  return (
    <>
      <group ref={groupRef}>
        {[0, 1, 2, 3, 4].map((i) => (
          <Float key={i} speed={1 + i * 0.3} floatIntensity={0.3} rotationIntensity={0.1}>
            <mesh
              position={[
                Math.sin(i * 1.2) * 0.6,
                -1 + i * 0.5,
                Math.cos(i * 1.2) * 0.6,
              ]}
              rotation={[i * 0.3, i * 0.5, i * 0.2]}
            >
              <torusGeometry args={[0.5 + i * 0.1, 0.06, 16, 32, Math.PI * 1.5]} />
              <meshStandardMaterial
                color="#b0c4de"
                metalness={1}
                roughness={0.02}
                emissive="#4488cc"
                emissiveIntensity={0.1}
              />
            </mesh>
          </Float>
        ))}
      </group>
      <Sparkles count={30} scale={4} size={1} speed={0.3} color="#88bbee" opacity={0.3} />
    </>
  );
}

/* ============================================================
   FATA — Spinning fire vortex
   ============================================================ */
function FataScene() {
  const vortexRef = useRef<THREE.Group>(null);
  const innerRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (vortexRef.current) vortexRef.current.rotation.y = t * 0.8;
    if (innerRef.current) innerRef.current.rotation.y = -t * 1.2;
  });

  return (
    <>
      <group ref={vortexRef}>
        {[...Array(12)].map((_, i) => {
          const angle = (i / 12) * Math.PI * 2;
          const y = -1 + (i / 12) * 2;
          const radius = 0.8 + Math.sin(i * 0.5) * 0.3;
          return (
            <mesh
              key={i}
              position={[Math.cos(angle) * radius, y, Math.sin(angle) * radius]}
              scale={[0.08, 0.3 + i * 0.02, 0.08]}
            >
              <cylinderGeometry args={[0.5, 0, 1, 4]} />
              <meshStandardMaterial
                color={i < 6 ? "#ff4500" : "#ff6b35"}
                emissive={i < 6 ? "#ff4500" : "#ff6b35"}
                emissiveIntensity={0.8}
                transparent
                opacity={0.7 + (i / 12) * 0.3}
              />
            </mesh>
          );
        })}
      </group>
      <mesh ref={innerRef} scale={0.4}>
        <icosahedronGeometry args={[1, 2]} />
        <meshStandardMaterial
          color="#333"
          metalness={1}
          roughness={0.1}
        />
      </mesh>
      <pointLight position={[0, 0, 0]} intensity={3} color="#ff4500" distance={5} />
      <Sparkles count={60} scale={3} size={3} speed={1} color="#ff6b35" opacity={0.7} />
    </>
  );
}

/* ============================================================
   ET — Twin portal beacons
   ============================================================ */
function ETScene() {
  const leftRef = useRef<THREE.Group>(null);
  const rightRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (leftRef.current) leftRef.current.rotation.y = t * 0.3;
    if (rightRef.current) rightRef.current.rotation.y = -t * 0.3;
  });

  return (
    <>
      {[-1, 1].map((side, idx) => (
        <group key={idx} ref={idx === 0 ? leftRef : rightRef} position={[side * 0.8, 0, 0]}>
          <mesh>
            <cylinderGeometry args={[0.05, 0.05, 2.5, 8]} />
            <meshStandardMaterial color="#808080" metalness={1} roughness={0.1} />
          </mesh>
          <mesh position={[0, 1.4, 0]}>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshStandardMaterial
              color="#ff6b35"
              emissive="#ff4500"
              emissiveIntensity={0.8}
            />
          </mesh>
        </group>
      ))}
      <mesh position={[0, 0.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.8, 0.03, 16, 32]} />
        <meshStandardMaterial color="#c0c0c0" metalness={1} roughness={0.05} />
      </mesh>
      <Sparkles count={30} scale={3} size={1.5} speed={0.4} color="#ff6b35" opacity={0.4} />
    </>
  );
}

/* ============================================================
   SCENE WRAPPER — Shared canvas setup
   ============================================================ */
const sceneMap: Record<string, React.FC> = {
  "the-portal": PortalScene,
  "female-twin": FemaleTwinScene,
  et: ETScene,
  gilly: GillyScene,
  "le-attrata": LeAttrataScene,
  divi: DiviScene,
  springwater: SpringwaterScene,
  echeveria: EcheveriaScene,
  fata: FataScene,
};

interface SculptureVisualProps {
  sculptureId: string;
  className?: string;
}

export default function SculptureVisual({ sculptureId, className = "" }: SculptureVisualProps) {
  const SceneComponent = sceneMap[sculptureId];
  if (!SceneComponent) return null;

  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        camera={{ position: [0, 0.5, 4], fov: 40 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[3, 5, 3]} intensity={0.8} />
        <Suspense fallback={null}>
          <SceneComponent />
          <Environment preset="studio" />
        </Suspense>
      </Canvas>
    </div>
  );
}
