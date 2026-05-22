"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sparkles } from "@react-three/drei";
import * as THREE from "three";

/* ═══════════════════════════════════════════════════════════
   MAD CHAO 3D v4 — Actually Cute (Research-Based)
   Chao DNA: big bobbly eyes, soft squishy body, tiny feet,
   floating halo ring, little head tuft, cheek blush.
   ═══════════════════════════════════════════════════════════ */

const RED = "#E63030";
const DARK_RED = "#C41E1E";
const FLAME_CORE = "#FF6B00";
const FLAME_TIP = "#FFC107";
const CREAM = "#FFF5E6";
const BLACK = "#111111";
const BLUSH = "#FF8888";

/* ─── Body — Squishy egg/blob, wider at bottom ─── */
function ChaoBody() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (meshRef.current) {
      // Gentle squish animation
      const squish = 1 + Math.sin(t * 2) * 0.008;
      meshRef.current.scale.set(squish * 1.05, 1 / squish, squish);
    }
  });

  return (
    <group scale={[1, 1.2, 0.95]} position={[0, -0.05, 0]}>
      <mesh ref={meshRef} castShadow>
        <sphereGeometry args={[0.48, 24, 24]} />
        <meshStandardMaterial
          color={RED}
          flatShading={false}
          roughness={0.25}
          metalness={0.02}
        />
      </mesh>
    </group>
  );
}

/* ─── Face — Bobbly big eyes, tiny mouth, blush ─── */
function Face() {
  return (
    <group position={[0, 0.25, 0.35]}>
      {/* Left eye — big, round, sits ON the face */}
      <group position={[-0.17, 0, 0.06]}>
        {/* Sclera */}
        <mesh>
          <sphereGeometry args={[0.16, 16, 16]} />
          <meshStandardMaterial color={CREAM} roughness={0.2} />
        </mesh>
        {/* Pupil */}
        <mesh position={[0, 0, 0.12]}>
          <sphereGeometry args={[0.1, 12, 12]} />
          <meshStandardMaterial color={BLACK} roughness={0.1} />
        </mesh>
        {/* Shine highlight */}
        <mesh position={[0.04, 0.05, 0.18]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshStandardMaterial color={CREAM} emissive={CREAM} emissiveIntensity={0.5} />
        </mesh>
        <mesh position={[-0.03, -0.03, 0.17]}>
          <sphereGeometry args={[0.015, 6, 6]} />
          <meshStandardMaterial color={CREAM} emissive={CREAM} emissiveIntensity={0.3} />
        </mesh>
      </group>

      {/* Right eye */}
      <group position={[0.17, 0, 0.06]}>
        <mesh>
          <sphereGeometry args={[0.16, 16, 16]} />
          <meshStandardMaterial color={CREAM} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0, 0.12]}>
          <sphereGeometry args={[0.1, 12, 12]} />
          <meshStandardMaterial color={BLACK} roughness={0.1} />
        </mesh>
        <mesh position={[0.04, 0.05, 0.18]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshStandardMaterial color={CREAM} emissive={CREAM} emissiveIntensity={0.5} />
        </mesh>
        <mesh position={[-0.03, -0.03, 0.17]}>
          <sphereGeometry args={[0.015, 6, 6]} />
          <meshStandardMaterial color={CREAM} emissive={CREAM} emissiveIntensity={0.3} />
        </mesh>
      </group>

      {/* Tiny cat-like mouth — inverted triangle/rounded */}
      <mesh position={[0, -0.18, 0.08]} rotation={[0.1, 0, 0]}>
        <boxGeometry args={[0.04, 0.025, 0.02]} />
        <meshStandardMaterial color={DARK_RED} />
      </mesh>

      {/* Cheek blush — left */}
      <mesh position={[-0.32, -0.05, 0.18]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial color={BLUSH} transparent opacity={0.4} />
      </mesh>
      {/* Cheek blush — right */}
      <mesh position={[0.32, -0.05, 0.18]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial color={BLUSH} transparent opacity={0.4} />
      </mesh>

      {/* Eyebrows — subtle angled lines */}
      <mesh position={[-0.17, 0.2, 0.1]} rotation={[0, 0, -0.2]}>
        <boxGeometry args={[0.12, 0.02, 0.01]} />
        <meshStandardMaterial color={DARK_RED} />
      </mesh>
      <mesh position={[0.17, 0.2, 0.1]} rotation={[0, 0, 0.2]}>
        <boxGeometry args={[0.12, 0.02, 0.01]} />
        <meshStandardMaterial color={DARK_RED} />
      </mesh>
    </group>
  );
}

/* ─── Head Tuft — Little spiky hair on top (like Cheese's bow) ─── */
function HeadTuft() {
  return (
    <group position={[0, 0.55, 0.1]}>
      <mesh position={[0, 0.04, 0]} rotation={[0, 0, 0]}>
        <coneGeometry args={[0.06, 0.12, 4]} />
        <meshStandardMaterial color={FLAME_CORE} flatShading />
      </mesh>
      <mesh position={[-0.06, 0.02, -0.02]} rotation={[0, 0, 0.5]}>
        <coneGeometry args={[0.04, 0.08, 4]} />
        <meshStandardMaterial color={FLAME_TIP} flatShading />
      </mesh>
      <mesh position={[0.06, 0.02, -0.02]} rotation={[0, 0, -0.5]}>
        <coneGeometry args={[0.04, 0.08, 4]} />
        <meshStandardMaterial color={FLAME_TIP} flatShading />
      </mesh>
    </group>
  );
}

/* ─── Halo — Proper floating ring (torus), not scattered orbs ─── */
function Halo() {
  const haloRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (haloRef.current) {
      haloRef.current.position.y = 0.78 + Math.sin(t * 1.5) * 0.04;
      haloRef.current.rotation.y = t * 0.5;
      haloRef.current.rotation.z = Math.sin(t * 1) * 0.05;
    }
    if (ringRef.current) {
      // Subtle pulse
      const pulse = 1 + Math.sin(t * 3) * 0.03;
      ringRef.current.scale.set(pulse, pulse, pulse);
    }
  });

  return (
    <group ref={haloRef} position={[0, 0.78, 0]}>
      {/* Main ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.28, 0.04, 8, 24]} />
        <meshStandardMaterial
          color={FLAME_CORE}
          emissive={FLAME_CORE}
          emissiveIntensity={2}
          flatShading
        />
      </mesh>

      {/* Inner bright ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.28, 0.015, 6, 24]} />
        <meshStandardMaterial
          color={FLAME_TIP}
          emissive={FLAME_TIP}
          emissiveIntensity={3}
          flatShading
        />
      </mesh>

      {/* Floating orbs on ring */}
      {[0, 1, 2, 3].map((i) => {
        const angle = (i / 4) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * 0.28,
              0,
              Math.sin(angle) * 0.28,
            ]}
          >
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshStandardMaterial
            color={FLAME_TIP}
            emissive={FLAME_TIP}
            emissiveIntensity={2.5}
            flatShading
          />
          </mesh>
        );
      })}

      {/* Light */}
      <pointLight color={FLAME_CORE} intensity={1.2} distance={3} position={[0, 0, 0]} />
    </group>
  );
}

/* ─── Wings — Small translucent back fins ─── */
function Wings() {
  const leftWing = useRef<THREE.Mesh>(null);
  const rightWing = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (leftWing.current) {
      leftWing.current.rotation.z = 0.15 + Math.sin(t * 4) * 0.08;
    }
    if (rightWing.current) {
      rightWing.current.rotation.z = -0.15 - Math.sin(t * 4) * 0.08;
    }
  });

  return (
    <group>
      <mesh ref={leftWing} position={[-0.32, 0.1, -0.15]} rotation={[0.1, 0.2, 0.2]}>
        <sphereGeometry args={[0.11, 10, 10]} />
        <meshStandardMaterial color={DARK_RED} transparent opacity={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[-0.38, 0.22, -0.12]} rotation={[0.1, 0.3, 0.3]}>
        <sphereGeometry args={[0.07, 8, 8]} />
        <meshStandardMaterial color={DARK_RED} transparent opacity={0.7} roughness={0.3} />
      </mesh>

      <mesh ref={rightWing} position={[0.32, 0.1, -0.15]} rotation={[0.1, -0.2, -0.2]}>
        <sphereGeometry args={[0.11, 10, 10]} />
        <meshStandardMaterial color={DARK_RED} transparent opacity={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0.38, 0.22, -0.12]} rotation={[0.1, -0.3, -0.3]}>
        <sphereGeometry args={[0.07, 8, 8]} />
        <meshStandardMaterial color={DARK_RED} transparent opacity={0.7} roughness={0.3} />
      </mesh>
    </group>
  );
}

/* ─── Feet — Tiny little nubs barely visible ─── */
function Feet() {
  const leftFoot = useRef<THREE.Mesh>(null);
  const rightFoot = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (leftFoot.current) {
      leftFoot.current.position.y = -0.48 + Math.sin(t * 3) * 0.015;
    }
    if (rightFoot.current) {
      rightFoot.current.position.y = -0.48 + Math.sin(t * 3 + 1) * 0.015;
    }
  });

  return (
    <group>
      <mesh ref={leftFoot} position={[-0.14, -0.48, 0.06]}>
        <sphereGeometry args={[0.08, 10, 10]} />
        <meshStandardMaterial color={DARK_RED} roughness={0.3} />
      </mesh>
      <mesh ref={rightFoot} position={[0.14, -0.48, 0.06]}>
        <sphereGeometry args={[0.08, 10, 10]} />
        <meshStandardMaterial color={DARK_RED} roughness={0.3} />
      </mesh>
    </group>
  );
}

/* ─── Arms — Small rounded nubs at sides ─── */
function Arms() {
  return (
    <group>
      <mesh position={[-0.38, 0, 0.08]} rotation={[0.2, 0, 0.35]}>
        <capsuleGeometry args={[0.07, 0.18, 4, 8]} />
        <meshStandardMaterial color={DARK_RED} roughness={0.3} />
      </mesh>
      <mesh position={[0.38, 0, 0.08]} rotation={[0.2, 0, -0.35]}>
        <capsuleGeometry args={[0.07, 0.18, 4, 8]} />
        <meshStandardMaterial color={DARK_RED} roughness={0.3} />
      </mesh>
    </group>
  );
}

/* ─── The complete character ─── */
function MadChao3DCharacter() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(t * 0.8) * 0.025;
      groupRef.current.rotation.y = Math.sin(t * 0.3) * 0.08;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <ChaoBody />
      <Face />
      <HeadTuft />
      <Halo />
      <Wings />
      <Feet />
      <Arms />
    </group>
  );
}

/* ─── Scene ─── */
function Scene() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 5, 2]} intensity={0.9} castShadow color="#FFF8F0" />
      <directionalLight position={[-2, 3, -2]} intensity={0.3} color="#FFAA66" />
      <pointLight position={[0, 1.2, 1]} intensity={0.5} color="#FF6666" distance={5} />

      <MadChao3DCharacter />

      <Sparkles count={20} scale={5} size={1} speed={0.2} color="#FFAA44" opacity={0.3} />

      <mesh position={[0, -0.55, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[5, 5]} />
        <meshStandardMaterial color="#1a1a1a" transparent opacity={0.08} />
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
        camera={{ position: [0, 0.3, 2.4], fov: 36 }}
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
          autoRotateSpeed={0.5}
          enableDamping
          dampingFactor={0.05}
        />
      </Canvas>
    </div>
  );
}
