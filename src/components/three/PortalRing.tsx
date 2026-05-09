"use client";

import { useRef, Suspense, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import * as THREE from "three";

function SparkRing({ speed, radius, color, width }: { speed: number; radius: number; color: string; width: number }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (!ref.current) return;
    ref.current.rotation.z += speed;
  });

  return (
    <mesh ref={ref}>
      <torusGeometry args={[radius, width, 32, 128]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={1.5}
        transparent
        opacity={0.9}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function PortalEffect({ spinSpeed }: { spinSpeed: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const baseSpeed = useRef(0);

  useFrame(() => {
    if (!groupRef.current) return;
    baseSpeed.current += spinSpeed;
    groupRef.current.rotation.z = baseSpeed.current;
  });

  // Spark particles on the ring
  const sparkPositions = useMemo(() => {
    const pos = new Float32Array(60 * 3);
    for (let i = 0; i < 60; i++) {
      const angle = (i / 60) * Math.PI * 2;
      const r = 2.2 + (Math.random() - 0.5) * 0.4;
      pos[i * 3] = Math.cos(angle) * r;
      pos[i * 3 + 1] = Math.sin(angle) * r;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.3;
    }
    return pos;
  }, []);

  return (
    <group ref={groupRef}>
      {/* Main glowing rings */}
      <SparkRing speed={0} radius={2.2} color="#e8a832" width={0.06} />
      <SparkRing speed={0} radius={2.1} color="#e8d44d" width={0.03} />
      <SparkRing speed={0} radius={2.35} color="#d4881a" width={0.025} />

      {/* Inner glow */}
      <SparkRing speed={0} radius={1.9} color="#e8a832" width={0.015} />

      {/* Sparks along the ring */}
      <Sparkles
        count={80}
        scale={5}
        size={3}
        speed={2}
        color="#e8d44d"
        opacity={0.8}
      />
    </group>
  );
}

interface PortalRingProps {
  spinSpeed: number;
}

export default function PortalRing({ spinSpeed }: PortalRingProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
      style={{ background: "transparent" }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.1} />
        <pointLight position={[0, 0, 3]} intensity={2} color="#e8a832" />
        <PortalEffect spinSpeed={spinSpeed} />
      </Suspense>
    </Canvas>
  );
}
