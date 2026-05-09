"use client";

import { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sparkles } from "@react-three/drei";
import * as THREE from "three";

function FloatingGem({ position, color, speed }: { position: [number, number, number]; color: string; speed: number }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * speed;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * speed * 0.5) * 0.3;
  });

  return (
    <Float speed={1} rotationIntensity={0.2} floatIntensity={0.5}>
      <mesh ref={ref} position={position} scale={0.6}>
        <octahedronGeometry args={[1, 0]} />
        <MeshDistortMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.2}
          metalness={0.95}
          roughness={0.05}
          distort={0.15}
          speed={1.5}
          transparent
          opacity={0.6}
        />
      </mesh>
    </Float>
  );
}

function Scene() {
  return (
    <>
      <fog attach="fog" args={["#0a0a0a", 8, 20]} />
      <ambientLight intensity={0.15} />
      <pointLight position={[5, 5, 5]} intensity={0.8} color="#ff6b35" />
      <pointLight position={[-5, -3, 3]} intensity={0.3} color="#b87333" />
      <FloatingGem position={[-5, 3, -3]} color="#ff6b35" speed={0.2} />
      <FloatingGem position={[5, -2, -4]} color="#b87333" speed={0.15} />
      <FloatingGem position={[0, 4, -5]} color="#d4a843" speed={0.1} />
      <Sparkles count={60} scale={20} size={1} speed={0.2} color="#ff6b35" opacity={0.15} />
    </>
  );
}

export default function PortfolioScene() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 45 }}
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
