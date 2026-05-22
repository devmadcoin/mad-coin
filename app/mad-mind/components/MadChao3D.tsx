"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sparkles } from "@react-three/drei";
import * as THREE from "three";

/* ═══════════════════════════════════════════════════════════
   MAD CHAO 3D v5 — Based on Actual Chao Reference
   Anatomy: teardrop head (pointed top), inset ring eyes,
   single sphere halo, smaller body, big mitten hands/feet.
   ═══════════════════════════════════════════════════════════ */

const RED = "#E02020";
const DARK_RED = "#B01010";
const FLAME_CORE = "#FF6B00";
const FLAME_TIP = "#FFC107";
const CREAM = "#FFF8F0";
const BLACK = "#0a0a0a";

/* ─── Head — Teardrop/egg shape, pointed top ─── */
function Head() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (meshRef.current) {
      const breathe = 1 + Math.sin(t * 1.5) * 0.005;
      meshRef.current.scale.set(breathe, breathe, breathe);
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0.45, 0]} castShadow scale={[1, 1.25, 0.9]}>
      <sphereGeometry args={[0.42, 24, 24]} />
      <meshStandardMaterial
        color={RED}
        roughness={0.2}
        metalness={0.02}
      />
    </mesh>
  );
}

/* ─── Top Point — Single spike on head ─── */
function HeadPoint() {
  return (
    <mesh position={[0, 0.92, -0.05]} rotation={[0.1, 0, 0]}>
      <coneGeometry args={[0.12, 0.22, 6]} />
      <meshStandardMaterial color={FLAME_CORE} flatShading roughness={0.3} />
    </mesh>
  );
}

/* ─── Halo — Single floating sphere (like real Chao) ─── */
function Halo() {
  const haloRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (haloRef.current) {
      haloRef.current.position.y = 1.2 + Math.sin(t * 1.2) * 0.06;
      haloRef.current.rotation.y = t * 0.4;
    }
  });

  return (
    <group ref={haloRef} position={[0, 1.2, 0]}>
      <mesh>
        <sphereGeometry args={[0.12, 12, 12]} />
        <meshStandardMaterial
          color={FLAME_TIP}
          emissive={FLAME_CORE}
          emissiveIntensity={1.5}
          roughness={0.2}
        />
      </mesh>
      {/* Glow ring around it */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.16, 0.02, 6, 16]} />
        <meshStandardMaterial
          color={FLAME_TIP}
          emissive={FLAME_TIP}
          emissiveIntensity={1}
          transparent
          opacity={0.5}
        />
      </mesh>
      <pointLight color={FLAME_CORE} intensity={0.8} distance={3} />
    </group>
  );
}

/* ─── Face — Inset eyes with white ring outline ─── */
function Face() {
  return (
    <group position={[0, 0.45, 0.32]}>
      {/* Left eye — white ring sclera (flat, inset) */}
      <mesh position={[-0.16, 0.02, 0]}>
        <sphereGeometry args={[0.14, 16, 16]} />
        <meshStandardMaterial color={CREAM} roughness={0.2} />
      </mesh>
      {/* Right eye sclera */}
      <mesh position={[0.16, 0.02, 0]}>
        <sphereGeometry args={[0.14, 16, 16]} />
        <meshStandardMaterial color={CREAM} roughness={0.2} />
      </mesh>

      {/* Left pupil — flat dark circle */}
      <mesh position={[-0.16, 0.02, 0.1]}>
        <sphereGeometry args={[0.09, 12, 12]} />
        <meshStandardMaterial color={BLACK} roughness={0.1} />
      </mesh>
      {/* Right pupil */}
      <mesh position={[0.16, 0.02, 0.1]}>
        <sphereGeometry args={[0.09, 12, 12]} />
        <meshStandardMaterial color={BLACK} roughness={0.1} />
      </mesh>

      {/* Highlight dots */}
      <mesh position={[-0.13, 0.06, 0.17]}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshStandardMaterial color={CREAM} emissive={CREAM} emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[0.19, 0.06, 0.17]}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshStandardMaterial color={CREAM} emissive={CREAM} emissiveIntensity={0.3} />
      </mesh>

      {/* Tiny cat mouth */}
      <mesh position={[0, -0.14, 0.05]} rotation={[0.1, 0, 0]}>
        <boxGeometry args={[0.035, 0.02, 0.015]} />
        <meshStandardMaterial color={DARK_RED} />
      </mesh>

      {/* Cheek blush */}
      <mesh position={[-0.3, -0.06, 0.12]}>
        <sphereGeometry args={[0.055, 8, 8]} />
        <meshStandardMaterial color="#FF9999" transparent opacity={0.35} />
      </mesh>
      <mesh position={[0.3, -0.06, 0.12]}>
        <sphereGeometry args={[0.055, 8, 8]} />
        <meshStandardMaterial color="#FF9999" transparent opacity={0.35} />
      </mesh>
    </group>
  );
}

/* ─── Body — Smaller round belly below head ─── */
function Body() {
  return (
    <mesh position={[0, 0.05, 0]} castShadow>
      <sphereGeometry args={[0.32, 20, 20]} />
      <meshStandardMaterial color={RED} roughness={0.25} metalness={0.02} />
    </mesh>
  );
}

/* ─── Arms — Big rounded mitten hands (like real Chao) ─── */
function Arms() {
  return (
    <group>
      {/* Left arm */}
      <mesh position={[-0.3, 0.08, 0.12]} rotation={[0.3, 0, 0.4]}>
        <capsuleGeometry args={[0.09, 0.2, 4, 8]} />
        <meshStandardMaterial color={RED} roughness={0.25} />
      </mesh>
      {/* Left hand — big rounded mitten */}
      <mesh position={[-0.36, -0.02, 0.2]}>
        <sphereGeometry args={[0.12, 12, 12]} />
        <meshStandardMaterial color={DARK_RED} roughness={0.3} />
      </mesh>

      {/* Right arm */}
      <mesh position={[0.3, 0.08, 0.12]} rotation={[0.3, 0, -0.4]}>
        <capsuleGeometry args={[0.09, 0.2, 4, 8]} />
        <meshStandardMaterial color={RED} roughness={0.25} />
      </mesh>
      {/* Right hand */}
      <mesh position={[0.36, -0.02, 0.2]}>
        <sphereGeometry args={[0.12, 12, 12]} />
        <meshStandardMaterial color={DARK_RED} roughness={0.3} />
      </mesh>
    </group>
  );
}

/* ─── Feet — Big rounded nubs, sitting pose ─── */
function Feet() {
  return (
    <group>
      {/* Left foot */}
      <mesh position={[-0.18, -0.22, 0.15]}>
        <sphereGeometry args={[0.12, 12, 12]} />
        <meshStandardMaterial color={DARK_RED} roughness={0.3} />
      </mesh>
      {/* Right foot */}
      <mesh position={[0.18, -0.22, 0.15]}>
        <sphereGeometry args={[0.12, 12, 12]} />
        <meshStandardMaterial color={DARK_RED} roughness={0.3} />
      </mesh>
    </group>
  );
}

/* ─── Wings — Butterfly-like, visible from front ─── */
function Wings() {
  const leftWing = useRef<THREE.Mesh>(null);
  const rightWing = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (leftWing.current) {
      leftWing.current.rotation.z = 0.25 + Math.sin(t * 3) * 0.1;
    }
    if (rightWing.current) {
      rightWing.current.rotation.z = -0.25 - Math.sin(t * 3) * 0.1;
    }
  });

  return (
    <group>
      {/* Left wing — two lobes */}
      <mesh ref={leftWing} position={[-0.28, 0.2, -0.1]} rotation={[0.1, 0.3, 0.3]}>
        <sphereGeometry args={[0.14, 10, 10]} />
        <meshStandardMaterial color="#FF8888" transparent opacity={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[-0.22, 0.08, -0.08]} rotation={[0.1, 0.2, 0.2]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial color="#FFCCCC" transparent opacity={0.6} roughness={0.3} />
      </mesh>

      {/* Right wing */}
      <mesh ref={rightWing} position={[0.28, 0.2, -0.1]} rotation={[0.1, -0.3, -0.3]}>
        <sphereGeometry args={[0.14, 10, 10]} />
        <meshStandardMaterial color="#FF8888" transparent opacity={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0.22, 0.08, -0.08]} rotation={[0.1, -0.2, -0.2]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial color="#FFCCCC" transparent opacity={0.6} roughness={0.3} />
      </mesh>
    </group>
  );
}

/* ─── The complete character (sitting pose) ─── */
function MadChao3DCharacter() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) {
      // Gentle bob
      groupRef.current.position.y = Math.sin(t * 0.8) * 0.02;
      // Slight sway
      groupRef.current.rotation.y = Math.sin(t * 0.4) * 0.06;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.1, 0]}>
      <Head />
      <HeadPoint />
      <Halo />
      <Face />
      <Body />
      <Arms />
      <Feet />
      <Wings />
    </group>
  );
}

/* ─── Scene ─── */
function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 5, 2]} intensity={0.8} castShadow color="#FFF8F0" />
      <directionalLight position={[-2, 3, -2]} intensity={0.25} color="#FFAA66" />
      <pointLight position={[0, 1.2, 1]} intensity={0.4} color="#FF6666" distance={5} />

      <MadChao3DCharacter />

      <Sparkles count={15} scale={5} size={0.8} speed={0.2} color="#FFAA44" opacity={0.25} />

      <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[5, 5]} />
        <meshStandardMaterial color="#1a1a1a" transparent opacity={0.06} />
      </mesh>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   EXPORT
   ═══════════════════════════════════════════════════════════ */

export default function MadChao3DCanvas({ className = "" }: { className?: string }) {
  return (
    <div className={`w-full h-full min-h-[340px] ${className}`}>
      <Canvas
        camera={{ position: [0, 0.2, 2.2], fov: 34 }}
        shadows
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Scene />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 3.5}
          maxPolarAngle={Math.PI / 1.9}
          minAzimuthAngle={-0.5}
          maxAzimuthAngle={0.5}
          autoRotate
          autoRotateSpeed={0.4}
          enableDamping
          dampingFactor={0.05}
        />
      </Canvas>
    </div>
  );
}
