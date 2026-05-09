"use client";

import { useRef, Suspense, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

// ─── Scroll tracker ──────────────────────────────────────────────
function useScrollProgress() {
  const ref = useRef(0);
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      ref.current = max > 0 ? window.scrollY / max : 0;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return ref;
}

// ─── Crucible (the forge pot) ────────────────────────────────────
function Crucible({ scroll }: { scroll: React.MutableRefObject<number> }) {
  const groupRef = useRef<THREE.Group>(null);
  const pourRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (!groupRef.current) return;
    const t = scroll.current;

    // Tilt the crucible as user scrolls (0 → 45 degrees)
    const tiltAngle = Math.min(t * 3, 1) * 0.75; // max ~43 degrees
    groupRef.current.rotation.z = tiltAngle;

    // Pour stream visibility based on tilt
    if (pourRef.current) {
      const pourOpacity = Math.max(0, (tiltAngle - 0.15) / 0.6);
      (pourRef.current.material as THREE.MeshStandardMaterial).opacity = pourOpacity;
      pourRef.current.scale.y = 0.5 + pourOpacity * 2;
    }
  });

  return (
    <group ref={groupRef} position={[2.5, 2, -3]}>
      {/* Crucible body */}
      <mesh>
        <cylinderGeometry args={[0.6, 0.4, 1.2, 16, 1, true]} />
        <meshStandardMaterial
          color="#3a3a3a"
          metalness={0.9}
          roughness={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Rim glow */}
      <mesh position={[0, 0.6, 0]}>
        <torusGeometry args={[0.6, 0.06, 8, 32]} />
        <meshStandardMaterial
          color="#ff6b35"
          emissive="#ff4500"
          emissiveIntensity={0.5}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      {/* Molten metal inside */}
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.55, 0.55, 0.15, 16]} />
        <meshStandardMaterial
          color="#ff8c00"
          emissive="#ff4500"
          emissiveIntensity={1.5}
          roughness={0.1}
        />
      </mesh>
      {/* Pour stream */}
      <mesh ref={pourRef} position={[0.7, -0.5, 0]} rotation={[0, 0, -0.3]}>
        <cylinderGeometry args={[0.08, 0.04, 2, 8]} />
        <meshStandardMaterial
          color="#ffaa00"
          emissive="#ff6b35"
          emissiveIntensity={2}
          transparent
          opacity={0}
          roughness={0.1}
        />
      </mesh>
    </group>
  );
}

// ─── Anvil ───────────────────────────────────────────────────────
function Anvil() {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
  });

  return (
    <group ref={ref} position={[-2, -2, -4]}>
      <mesh>
        <boxGeometry args={[1.8, 0.4, 0.9]} />
        <meshStandardMaterial color="#2a2a2a" metalness={1} roughness={0.15} />
      </mesh>
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[1.2, 0.4, 0.7]} />
        <meshStandardMaterial color="#333" metalness={1} roughness={0.12} />
      </mesh>
      <mesh position={[0.8, 0.2, 0]} rotation={[0, 0, 0.3]}>
        <boxGeometry args={[0.6, 0.15, 0.5]} />
        <meshStandardMaterial color="#3a3a3a" metalness={0.9} roughness={0.2} />
      </mesh>
    </group>
  );
}

// ─── Molten pool (where pour lands) ──────────────────────────────
function MoltenPool({ scroll }: { scroll: React.MutableRefObject<number> }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (!ref.current) return;
    const t = scroll.current;
    const poolSize = Math.max(0, (t * 3 - 0.5) * 0.8);
    ref.current.scale.set(1 + poolSize, 1, 1 + poolSize);
    (ref.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
      0.5 + poolSize * 2;
  });

  return (
    <mesh ref={ref} position={[1, -2.8, -2.5]} rotation={[-Math.PI / 2, 0, 0]}>
      <circleGeometry args={[0.5, 32]} />
      <meshStandardMaterial
        color="#ff6b35"
        emissive="#ff4500"
        emissiveIntensity={0.5}
        transparent
        opacity={0.8}
        roughness={0.1}
      />
    </mesh>
  );
}

// ─── Welding sparks ──────────────────────────────────────────────
function WeldingSparks({ scroll }: { scroll: React.MutableRefObject<number> }) {
  const count = 200;
  const ref = useRef<THREE.Points>(null);
  const velocities = useRef<Float32Array>(null);

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      pos[i * 3] = 0;
      pos[i * 3 + 1] = 0;
      pos[i * 3 + 2] = 0;

      // Random velocities — spray pattern
      const angle = Math.random() * Math.PI * 2;
      const upward = 0.5 + Math.random() * 2;
      const spread = 0.5 + Math.random() * 1.5;
      vel[i * 3] = Math.cos(angle) * spread;
      vel[i * 3 + 1] = upward;
      vel[i * 3 + 2] = Math.sin(angle) * spread * 0.5;

      // Orange to yellow to white gradient
      const heat = Math.random();
      col[i * 3] = 1;
      col[i * 3 + 1] = 0.4 + heat * 0.5;
      col[i * 3 + 2] = heat * 0.3;
    }

    velocities.current = vel;
    return [pos, col];
  }, []);

  const originRef = useRef({ x: -1, y: -1.2, z: -3 });
  const timeRef = useRef<Float32Array>(new Float32Array(count));

  useFrame((state, delta) => {
    if (!ref.current || !velocities.current) return;
    const t = scroll.current;
    const posArr = ref.current.geometry.attributes.position
      .array as Float32Array;
    const vel = velocities.current;
    const times = timeRef.current;

    // Spark intensity increases with scroll
    const intensity = Math.min(1, t * 2.5);

    // Move the weld point as scroll progresses
    originRef.current.x = -1 + t * 2;
    originRef.current.y = -1.2 + Math.sin(t * 10) * 0.3;

    for (let i = 0; i < count; i++) {
      times[i] += delta * (2 + Math.random());

      if (times[i] > 1 || posArr[i * 3 + 1] < -4) {
        // Reset spark to weld origin
        posArr[i * 3] = originRef.current.x + (Math.random() - 0.5) * 0.2;
        posArr[i * 3 + 1] = originRef.current.y;
        posArr[i * 3 + 2] = originRef.current.z + (Math.random() - 0.5) * 0.2;
        times[i] = 0;
      } else {
        // Apply velocity + gravity
        posArr[i * 3] += vel[i * 3] * delta * intensity * 2;
        posArr[i * 3 + 1] +=
          vel[i * 3 + 1] * delta * intensity * 2 - delta * 3; // gravity
        posArr[i * 3 + 2] += vel[i * 3 + 2] * delta * intensity;
      }
    }

    ref.current.geometry.attributes.position.needsUpdate = true;

    // Fade sparks based on scroll
    (ref.current.material as THREE.PointsMaterial).opacity = 0.3 + intensity * 0.7;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        vertexColors
        transparent
        opacity={0.3}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// ─── Ambient embers ──────────────────────────────────────────────
function Embers() {
  const count = 60;
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10 - 5;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.008;
    const posArr = ref.current.geometry.attributes.position
      .array as Float32Array;
    for (let i = 0; i < count; i++) {
      posArr[i * 3 + 1] += 0.008;
      if (posArr[i * 3 + 1] > 8) posArr[i * 3 + 1] = -8;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#ff6b35"
        transparent
        opacity={0.4}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// ─── Scroll-driven camera ────────────────────────────────────────
function ScrollCamera({ scroll }: { scroll: React.MutableRefObject<number> }) {
  const { camera } = useThree();

  useFrame(() => {
    const t = scroll.current;
    // Pan camera down and closer as user scrolls
    camera.position.y = 1 - t * 4;
    camera.position.z = 8 - t * 2;
    camera.lookAt(0, -1 + t * -1, -3);
  });

  return null;
}

// ─── Main scene ──────────────────────────────────────────────────
export default function ForgeBackground() {
  const scroll = useScrollProgress();

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 1, 8], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
      >
        <Suspense fallback={null}>
          <fog attach="fog" args={["#0a0505", 5, 18]} />

          {/* Forge lighting */}
          <ambientLight intensity={0.08} />
          <pointLight
            position={[2.5, 1, -2]}
            intensity={2}
            color="#ff4500"
            distance={12}
          />
          <pointLight
            position={[-1, -1.5, -2]}
            intensity={1.5}
            color="#ffaa00"
            distance={10}
          />
          <pointLight
            position={[0, 3, 0]}
            intensity={0.3}
            color="#ff8c00"
            distance={15}
          />
          {/* Weld flash light */}
          <pointLight
            position={[-1, -1, -3]}
            intensity={3}
            color="#ffffff"
            distance={4}
          />

          <ScrollCamera scroll={scroll} />
          <Crucible scroll={scroll} />
          <Anvil />
          <MoltenPool scroll={scroll} />
          <WeldingSparks scroll={scroll} />
          <Embers />
        </Suspense>
      </Canvas>
    </div>
  );
}
