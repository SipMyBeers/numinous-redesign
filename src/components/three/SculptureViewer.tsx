"use client";

import { Suspense, useRef, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment, ContactShadows, Center } from "@react-three/drei";
import * as THREE from "three";

function SculptureModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.15;
  });

  useEffect(() => {
    // Override all materials to metallic steel
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        // Keep vertex colors if they exist, but enhance material
        const hasVertexColors = child.geometry.attributes.color !== undefined;

        child.material = new THREE.MeshPhysicalMaterial({
          vertexColors: hasVertexColors,
          color: hasVertexColors ? 0xffffff : 0xb0b0b0,
          metalness: 0.85,
          roughness: 0.15,
          clearcoat: 0.3,
          clearcoatRoughness: 0.2,
          envMapIntensity: 1.5,
          side: THREE.DoubleSide,
        });

        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [scene]);

  return (
    <Center>
      <group ref={groupRef}>
        <primitive object={scene.clone()} scale={2} />
      </group>
    </Center>
  );
}

function LoadingFallback() {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = state.clock.elapsedTime;
  });
  return (
    <mesh ref={meshRef}>
      <torusGeometry args={[0.4, 0.05, 16, 32]} />
      <meshStandardMaterial color="#ff6b35" emissive="#ff6b35" emissiveIntensity={0.5} />
    </mesh>
  );
}

function CameraSetup() {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(0, 0.8, 3.5);
    camera.lookAt(0, 0, 0);
  }, [camera]);
  return null;
}

interface SculptureViewerProps {
  modelUrl: string;
  className?: string;
}

export default function SculptureViewer({ modelUrl, className = "" }: SculptureViewerProps) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-numinous-charcoal text-white/30 text-sm ${className}`}>
        3D model unavailable
      </div>
    );
  }

  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        shadows
        camera={{ position: [0, 0.8, 3.5], fov: 40 }}
        gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.2 }}
        dpr={[1, 2]}
        onError={() => setError(true)}
      >
        <CameraSetup />
        <color attach="background" args={["#1a1a1a"]} />
        <fog attach="fog" args={["#1a1a1a", 6, 12]} />

        {/* Lighting rig */}
        <ambientLight intensity={0.3} />
        <directionalLight
          position={[5, 8, 5]}
          intensity={1.5}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <pointLight position={[-3, 3, -2]} intensity={0.6} color="#ff6b35" />
        <pointLight position={[3, -1, 3]} intensity={0.3} color="#4488ff" />

        {/* Rim light for edge definition */}
        <spotLight
          position={[-5, 3, -5]}
          intensity={0.8}
          angle={0.5}
          penumbra={1}
          color="#ffffff"
        />

        <Suspense fallback={<LoadingFallback />}>
          <SculptureModel url={modelUrl} />
          <Environment preset="studio" />
          <ContactShadows
            position={[0, -1.5, 0]}
            opacity={0.5}
            scale={8}
            blur={2.5}
            far={4}
          />
        </Suspense>

        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={1.5}
          maxDistance={6}
          minPolarAngle={Math.PI * 0.2}
          maxPolarAngle={Math.PI * 0.8}
          autoRotate={false}
          dampingFactor={0.05}
          enableDamping
        />
      </Canvas>

      {/* Interaction hint */}
      <div className="absolute bottom-3 left-0 right-0 text-center">
        <p className="text-[10px] tracking-widest uppercase text-white/20">
          Drag to rotate &middot; Scroll to zoom
        </p>
      </div>
    </div>
  );
}
