"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

function Model({ url, autoRotate = true }: { url: string; autoRotate?: boolean }) {
  const { scene } = useGLTF(url);
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!ref.current || !autoRotate) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.3;
  });

  return (
    <group ref={ref}>
      <primitive
        object={scene.clone()}
        scale={2}
        position={[0, -0.5, 0]}
      />
    </group>
  );
}

function LoadingSpinner() {
  return (
    <mesh>
      <torusGeometry args={[0.5, 0.05, 16, 32]} />
      <meshStandardMaterial color="#ff6b35" emissive="#ff6b35" emissiveIntensity={0.5} />
    </mesh>
  );
}

interface ModelViewerProps {
  modelUrl: string;
  className?: string;
  autoRotate?: boolean;
}

export default function ModelViewer({ modelUrl, className = "", autoRotate = true }: ModelViewerProps) {
  return (
    <div className={`w-full aspect-square ${className}`}>
      <Canvas
        camera={{ position: [0, 0.5, 3], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={1} color="#fff5ee" />
        <pointLight position={[-3, 2, -3]} intensity={0.5} color="#ff6b35" />

        <Suspense fallback={<LoadingSpinner />}>
          <Model url={modelUrl} autoRotate={autoRotate} />
          <Environment preset="studio" />
          <ContactShadows
            position={[0, -1.2, 0]}
            opacity={0.4}
            scale={5}
            blur={2}
          />
        </Suspense>

        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={1.5}
          maxDistance={6}
          autoRotate={false}
        />
      </Canvas>
    </div>
  );
}
