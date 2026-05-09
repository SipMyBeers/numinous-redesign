"use client";

import { useRef, Suspense, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sparkles } from "@react-three/drei";
import * as THREE from "three";

function MoltenCore() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.1;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.2;
  });

  return (
    <Float speed={0.8} floatIntensity={0.2}>
      <mesh ref={ref} position={[4, -2, -5]} scale={2}>
        <icosahedronGeometry args={[1, 4]} />
        <MeshDistortMaterial
          color="#ff4500"
          emissive="#ff2200"
          emissiveIntensity={0.4}
          roughness={0.3}
          metalness={0.8}
          distort={0.4}
          speed={1.5}
          transparent
          opacity={0.5}
        />
      </mesh>
    </Float>
  );
}

function Anvil() {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.03;
  });

  return (
    <group ref={ref} position={[-5, 1, -6]}>
      <mesh>
        <boxGeometry args={[1.5, 0.4, 0.8]} />
        <meshStandardMaterial color="#333" metalness={1} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[1, 0.4, 0.6]} />
        <meshStandardMaterial color="#444" metalness={1} roughness={0.15} />
      </mesh>
    </group>
  );
}

function EmberRain() {
  const count = 100;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 15;
    }
    return pos;
  }, []);

  const ref = useRef<THREE.Points>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.01;
    const positions = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      positions[i * 3 + 1] += 0.01;
      if (positions[i * 3 + 1] > 10) positions[i * 3 + 1] = -10;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.04} color="#ff6b35" transparent opacity={0.5} sizeAttenuation />
    </points>
  );
}

export default function ForgeScene() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
      >
        <Suspense fallback={null}>
          <fog attach="fog" args={["#0a0505", 6, 20]} />
          <ambientLight intensity={0.1} />
          <pointLight position={[4, -2, -3]} intensity={1.5} color="#ff4500" distance={15} />
          <pointLight position={[-3, 3, 2]} intensity={0.4} color="#ff8c00" />

          <MoltenCore />
          <Anvil />
          <EmberRain />
          <Sparkles count={80} scale={15} size={1.5} speed={0.5} color="#ff6b35" opacity={0.3} />
        </Suspense>
      </Canvas>
    </div>
  );
}
