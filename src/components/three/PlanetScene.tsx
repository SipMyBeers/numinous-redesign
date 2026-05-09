"use client";

import { useRef, Suspense, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Sparkles } from "@react-three/drei";
import * as THREE from "three";

function Planet({
  position,
  size,
  color,
  emissive,
  ringColor,
  speed,
  hasRing,
}: {
  position: [number, number, number];
  size: number;
  color: string;
  emissive: string;
  ringColor?: string;
  speed: number;
  hasRing?: boolean;
}) {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * speed;
  });

  return (
    <Float speed={0.5} floatIntensity={0.3} rotationIntensity={0.1}>
      <group ref={ref} position={position}>
        <mesh>
          <sphereGeometry args={[size, 32, 32]} />
          <meshStandardMaterial
            color={color}
            emissive={emissive}
            emissiveIntensity={0.15}
            roughness={0.7}
            metalness={0.3}
          />
        </mesh>
        {/* Atmosphere glow */}
        <mesh scale={1.05}>
          <sphereGeometry args={[size, 32, 32]} />
          <meshStandardMaterial
            color={emissive}
            emissive={emissive}
            emissiveIntensity={0.3}
            transparent
            opacity={0.1}
            side={THREE.BackSide}
          />
        </mesh>
        {hasRing && ringColor && (
          <mesh rotation={[Math.PI * 0.4, 0.2, 0]}>
            <torusGeometry args={[size * 1.6, size * 0.08, 2, 64]} />
            <meshStandardMaterial
              color={ringColor}
              emissive={ringColor}
              emissiveIntensity={0.2}
              transparent
              opacity={0.5}
              side={THREE.DoubleSide}
            />
          </mesh>
        )}
      </group>
    </Float>
  );
}

function StarField() {
  const count = 300;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 50;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 50;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 50;
    }
    return pos;
  }, []);

  const ref = useRef<THREE.Points>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.005;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#ffffff" transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

// Shooting stars — bright streaks across the sky
function ShootingStars() {
  const count = 6;
  const ref = useRef<THREE.Group>(null);
  const starsData = useMemo(() => {
    return Array.from({ length: count }, () => ({
      speed: 8 + Math.random() * 12,
      y: (Math.random() - 0.5) * 15,
      z: -5 - Math.random() * 10,
      delay: Math.random() * 10,
      length: 0.8 + Math.random() * 1.5,
    }));
  }, []);

  const positionsRef = useRef(starsData.map(() => -25 - Math.random() * 20));

  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.children.forEach((child, i) => {
      const d = starsData[i];
      positionsRef.current[i] += d.speed * delta;
      if (positionsRef.current[i] > 25) {
        positionsRef.current[i] = -25 - Math.random() * 15;
      }
      child.position.x = positionsRef.current[i];
      child.position.y = d.y;
      child.position.z = d.z;
    });
  });

  return (
    <group ref={ref}>
      {starsData.map((d, i) => (
        <mesh key={i} rotation={[0, 0, -0.15]}>
          <planeGeometry args={[d.length, 0.02]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
        </mesh>
      ))}
    </group>
  );
}

// UFO — small saucer with scan beam, orbits through open space avoiding planets
function UFO() {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    // Figure-8 path through open space (avoids planets at [6,3], [-5,-1], [3,-4], [-2,4])
    const angle = t * 0.15;
    ref.current.position.x = Math.sin(angle) * 4 + Math.cos(angle * 0.7) * 2;
    ref.current.position.y = Math.cos(angle * 0.6) * 2 - 0.5;
    ref.current.position.z = -2 + Math.sin(angle * 0.4) * 1.5;
    // Face direction of travel
    ref.current.rotation.y = angle + Math.PI / 2;
    ref.current.rotation.z = Math.sin(angle) * 0.08;
  });

  return (
    <group ref={ref}>
      {/* Saucer body */}
      <mesh>
        <cylinderGeometry args={[0.3, 0.5, 0.1, 16]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Dome */}
      <mesh position={[0, 0.08, 0]}>
        <sphereGeometry args={[0.2, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial
          color="#4a9ebe"
          emissive="#4a9ebe"
          emissiveIntensity={0.5}
          transparent
          opacity={0.6}
        />
      </mesh>
      {/* Ring lights */}
      <mesh position={[0, -0.02, 0]}>
        <torusGeometry args={[0.45, 0.015, 4, 16]} />
        <meshStandardMaterial
          color="#60b5ff"
          emissive="#60b5ff"
          emissiveIntensity={1}
        />
      </mesh>
      {/* Scan beam */}
      <mesh position={[0, -0.6, 0]}>
        <coneGeometry args={[0.8, 1.2, 16, 1, true]} />
        <meshStandardMaterial
          color="#4a9ebe"
          emissive="#4a9ebe"
          emissiveIntensity={0.3}
          transparent
          opacity={0.08}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

// Orbital ring — holographic orbit paths around planets
function OrbitalRing({ center, radius, color, speed }: { center: [number, number, number]; radius: number; color: string; speed: number }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.x = Math.PI * 0.45 + Math.sin(state.clock.elapsedTime * speed) * 0.1;
    ref.current.rotation.z = state.clock.elapsedTime * speed * 0.3;
  });

  return (
    <mesh ref={ref} position={center}>
      <torusGeometry args={[radius, 0.01, 4, 64]} />
      <meshBasicMaterial color={color} transparent opacity={0.3} />
    </mesh>
  );
}

function Nebula() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.z = state.clock.elapsedTime * 0.01;
  });

  return (
    <mesh ref={ref} position={[0, 0, -15]}>
      <planeGeometry args={[40, 40]} />
      <meshBasicMaterial color="#1a0a2e" transparent opacity={0.3} />
    </mesh>
  );
}

function ScrollZoom() {
  const { camera } = useThree();
  const scrollRef = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      scrollRef.current = maxScroll > 0 ? window.scrollY / maxScroll : 0;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useFrame(() => {
    const t = scrollRef.current;
    // Zoom from z=12 down to z=4 as user scrolls
    camera.position.z = 12 - t * 8;
  });

  return null;
}

export default function PlanetScene() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 12], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
      >
        <Suspense fallback={null}>
          <fog attach="fog" args={["#050510", 10, 35]} />
          <ambientLight intensity={0.2} />
          <directionalLight position={[5, 3, 5]} intensity={0.8} color="#fff5ee" />
          <pointLight position={[-8, 4, -5]} intensity={0.6} color="#4a9ebe" />
          <pointLight position={[8, -3, 3]} intensity={0.5} color="#a855f7" />
          <pointLight position={[0, 0, 3]} intensity={0.3} color="#60b5ff" />

          {/* Large planet — top right, with rings */}
          <Planet
            position={[6, 3, -5]}
            size={2.5}
            color="#2a1a4a"
            emissive="#6b3fa0"
            ringColor="#a855f7"
            speed={0.05}
            hasRing
          />

          {/* Medium planet — left side */}
          <Planet
            position={[-5, -1, -3]}
            size={1.5}
            color="#1a3a4a"
            emissive="#4a9ebe"
            speed={0.08}
          />

          {/* Small planet — bottom right, reddish */}
          <Planet
            position={[3, -4, -6]}
            size={0.8}
            color="#4a2a1a"
            emissive="#e8a832"
            speed={0.12}
          />

          {/* Tiny moon */}
          <Planet
            position={[-2, 4, -8]}
            size={0.4}
            color="#3a3a3a"
            emissive="#666"
            speed={0.15}
          />

          <StarField />
          <Nebula />
          <ScrollZoom />
          <ShootingStars />
          <UFO />

          {/* Orbital rings around planets */}
          <OrbitalRing center={[6, 3, -5]} radius={4} color="#a855f7" speed={0.08} />
          <OrbitalRing center={[-5, -1, -3]} radius={2.5} color="#4a9ebe" speed={0.12} />
          <OrbitalRing center={[6, 3, -5]} radius={5} color="#6b3fa0" speed={-0.05} />

          <Sparkles count={80} scale={25} size={1.2} speed={0.15} color="#ffffff" opacity={0.3} />
        </Suspense>
      </Canvas>
    </div>
  );
}
