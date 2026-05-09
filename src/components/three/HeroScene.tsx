"use client";

import { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sparkles } from "@react-three/drei";
import * as THREE from "three";

function GlowSphere() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.12;
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.08) * 0.1;
  });

  return (
    <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.3}>
      <mesh ref={meshRef} scale={2.5} position={[0, 0, 0]}>
        <icosahedronGeometry args={[1, 4]} />
        <MeshDistortMaterial
          color="#7ec8e3"
          emissive="#4a9ebe"
          emissiveIntensity={0.5}
          roughness={0.15}
          metalness={0.8}
          distort={0.35}
          speed={1.8}
          transparent
          opacity={0.85}
        />
      </mesh>
    </Float>
  );
}

function SteelRings() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.z = state.clock.elapsedTime * 0.04;
    groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.06) * 0.15;
  });

  return (
    <group ref={groupRef}>
      {[3.5, 4.2, 5].map((radius, i) => (
        <mesh key={i} rotation={[Math.PI / 2 + i * 0.3, i * 0.5, 0]}>
          <torusGeometry args={[radius, 0.015, 8, 64]} />
          <meshStandardMaterial
            color="#d4c86a"
            metalness={1}
            roughness={0.1}
            transparent
            opacity={0.25 - i * 0.06}
          />
        </mesh>
      ))}
    </group>
  );
}

function Scene() {
  return (
    <>
      <fog attach="fog" args={["#0a0a0a", 8, 25]} />
      <ambientLight intensity={0.25} />
      <pointLight position={[4, 4, 4]} intensity={1.2} color="#7ec8e3" />
      <pointLight position={[-4, -2, 3]} intensity={0.6} color="#e8d44d" />
      <pointLight position={[0, 0, 5]} intensity={0.4} color="#aaddff" />
      <GlowSphere />
      <SteelRings />
      <Sparkles
        count={150}
        scale={12}
        size={1.2}
        speed={0.25}
        color="#e8d44d"
        opacity={0.25}
      />
    </>
  );
}

// Exported scene content for use in external Canvas
export function HeroBlobScene() {
  return <Scene />;
}

export default function HeroScene() {
  return (
    <div className="absolute inset-0 z-0 flex items-center justify-center">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
        fallback={<div className="w-full h-full bg-numinous-black" />}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}
