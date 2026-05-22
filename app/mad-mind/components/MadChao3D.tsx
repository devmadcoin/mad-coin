"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sparkles } from "@react-three/drei";
import * as THREE from "three";

/* ═══════════════════════════════════════════════════════════
   MAD CHAO 3D v3 — Actually Looks Like a Chao
   Anatomy: Teardrop body, big head-top, small feet, back wings.
   ═══════════════════════════════════════════════════════════ */

const RED = "#E62E2E";
const DARK_RED = "#B22222";
const FLAME_CORE = "#FF6B00";
const FLAME_TIP = "#FFB800";
const CREAM = "#FFF8F0";
const BLACK = "#1a1a1a";

/* ─── Main Body — Teardrop/egg shape (the classic chao form) ─── */
function ChaoBody() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (meshRef.current) {
      const breathe = 1 + Math.sin(t * 1.5) * 0.01;
      meshRef.current.scale.set(breathe, breathe, breathe);
    }
  });

  return (
    <mesh ref={meshRef} castShadow>
      {/* Stretched sphere: taller than wide, like an egg standing up */}
      <sphereGeometry args={[0.5, 24, 24]} />
      <meshStandardMaterial
        color={RED}
        flatShading
        roughness={0.3}
        metalness={0.05}
      />
      {/* Scale in the mesh transform to make it egg-shaped */}
    </mesh>
  );
}

/* ─── Face — Big integrated eyes (not stuck-on spheres) ─── */
function Face() {
  return (
    <group position={[0, 0.22, 0.38]}>
      {/* Left eye — slightly recessed into face */}
      <mesh position={[-0.18, 0, 0]}>
        <sphereGeometry args={[0.14, 16, 16]} />
        <meshStandardMaterial color={CREAM} flatShading />
      </mesh>
      {/* Right eye */}
      <mesh position={[0.18, 0, 0]}>
        <sphereGeometry args={[0.14, 16, 16]} />
        <meshStandardMaterial color={CREAM} flatShading />
      </mesh>

      {/* Left pupil — centered, not offset weirdly */}
      <mesh position={[-0.18, 0, 0.1]}>
        <sphereGeometry args={[0.09, 12, 12]} />
        <meshStandardMaterial color={BLACK} flatShading />
      </mesh>
      {/* Right pupil */}
      <mesh position={[0.18, 0, 0.1]}>
        <sphereGeometry args={[0.09, 12, 12]} />
        <meshStandardMaterial color={BLACK} flatShading />
      </mesh>

      {/* Pupil highlight dots */}
      <mesh position={[-0.16, 0.03, 0.17]}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshStandardMaterial color={CREAM} flatShading />
      </mesh>
      <mesh position={[0.2, 0.03, 0.17]}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshStandardMaterial color={CREAM} flatShading />
      </mesh>

      {/* Eyebrows — thin angry lines above eyes */}
      <mesh position={[-0.18, 0.16, 0.05]} rotation={[0, 0, -0.25]}>
        <boxGeometry args={[0.16, 0.025, 0.02]} />
        <meshStandardMaterial color={DARK_RED} flatShading />
      </mesh>
      <mesh position={[0.18, 0.16, 0.05]} rotation={[0, 0, 0.25]}>
        <boxGeometry args={[0.16, 0.025, 0.02]} />
        <meshStandardMaterial color={DARK_RED} flatShading />
      </mesh>

      {/* Small downturned mouth */}
      <mesh position={[0, -0.14, 0.06]} rotation={[0.1, 0, 0]}>
        <boxGeometry args={[0.08, 0.02, 0.02]} />
        <meshStandardMaterial color={DARK_RED} flatShading />
      </mesh>
    </group>
  );
}

/* ─── Halo / Flame Ring floating above head ─── */
function HaloFlame() {
  const haloRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);

  const particleCount = 30;
  const particleGeo = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const radius = 0.35 + Math.random() * 0.1;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = Math.random() * 0.15;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (haloRef.current) {
      haloRef.current.rotation.y = t * 0.8;
      haloRef.current.position.y = 0.68 + Math.sin(t * 2) * 0.03;
    }
    if (particlesRef.current) {
      const pos = particlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        pos[i * 3 + 1] += 0.008;
        if (pos[i * 3 + 1] > 0.2) {
          const angle = (i / particleCount) * Math.PI * 2;
          const radius = 0.35 + Math.random() * 0.1;
          pos[i * 3] = Math.cos(angle + t) * radius;
          pos[i * 3 + 1] = 0;
          pos[i * 3 + 2] = Math.sin(angle + t) * radius;
        }
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group ref={haloRef} position={[0, 0.68, 0]}>
      {/* Floating ring of fire */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <mesh
          key={i}
          position={[
            Math.cos((i / 6) * Math.PI * 2) * 0.3,
            Math.sin((i / 6) * Math.PI * 4) * 0.05,
            Math.sin((i / 6) * Math.PI * 2) * 0.3,
          ]}
        >
          <sphereGeometry args={[0.07, 8, 8]} />
          <meshStandardMaterial
            color={i % 2 === 0 ? FLAME_CORE : FLAME_TIP}
            emissive={i % 2 === 0 ? FLAME_CORE : FLAME_TIP}
            emissiveIntensity={3}
            flatShading
          />
        </mesh>
      ))}

      {/* Center flame pillar */}
      <mesh position={[0, 0.1, 0]}>
        <coneGeometry args={[0.1, 0.25, 6]} />
        <meshStandardMaterial color={FLAME_CORE} emissive={FLAME_CORE} emissiveIntensity={3} flatShading />
      </mesh>
      <mesh position={[0, 0.22, 0]}>
        <coneGeometry args={[0.06, 0.15, 5]} />
        <meshStandardMaterial color={FLAME_TIP} emissive={FLAME_TIP} emissiveIntensity={4} flatShading />
      </mesh>

      {/* Orbiting particles */}
      <points ref={particlesRef} geometry={particleGeo}>
        <pointsMaterial color={FLAME_TIP} size={0.04} transparent opacity={0.8} sizeAttenuation />
      </points>

      {/* Light */}
      <pointLight color={FLAME_CORE} intensity={1.5} distance={3} position={[0, 0, 0]} />
    </group>
  );
}

/* ─── Back Wings — Small fin-like appendages ─── */
function Wings() {
  const leftWing = useRef<THREE.Mesh>(null);
  const rightWing = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (leftWing.current) {
      leftWing.current.rotation.z = 0.2 + Math.sin(t * 3) * 0.06;
    }
    if (rightWing.current) {
      rightWing.current.rotation.z = -0.2 - Math.sin(t * 3) * 0.06;
    }
  });

  return (
    <group>
      {/* Left wing — flat oval on the back */}
      <mesh ref={leftWing} position={[-0.35, 0.15, -0.18]} rotation={[0.1, 0.2, 0.3]}>
        <sphereGeometry args={[0.12, 10, 10]} />
        <meshStandardMaterial color={DARK_RED} flatShading transparent opacity={0.8} />
      </mesh>
      <mesh position={[-0.42, 0.28, -0.15]} rotation={[0.1, 0.3, 0.4]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial color={DARK_RED} flatShading transparent opacity={0.8} />
      </mesh>

      {/* Right wing */}
      <mesh ref={rightWing} position={[0.35, 0.15, -0.18]} rotation={[0.1, -0.2, -0.3]}>
        <sphereGeometry args={[0.12, 10, 10]} />
        <meshStandardMaterial color={DARK_RED} flatShading transparent opacity={0.8} />
      </mesh>
      <mesh position={[0.42, 0.28, -0.15]} rotation={[0.1, -0.3, -0.4]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial color={DARK_RED} flatShading transparent opacity={0.8} />
      </mesh>
    </group>
  );
}

/* ─── Feet — Small round nubs at bottom ─── */
function Feet() {
  return (
    <group>
      <mesh position={[-0.15, -0.42, 0.08]}>
        <sphereGeometry args={[0.1, 10, 10]} />
        <meshStandardMaterial color={DARK_RED} flatShading />
      </mesh>
      <mesh position={[0.15, -0.42, 0.08]}>
        <sphereGeometry args={[0.1, 10, 10]} />
        <meshStandardMaterial color={DARK_RED} flatShading />
      </mesh>
    </group>
  );
}

/* ─── Arms — Resting at sides, slightly forward ─── */
function Arms() {
  return (
    <group>
      {/* Left arm */}
      <mesh position={[-0.38, 0.05, 0.1]} rotation={[0.2, 0, 0.4]}>
        <capsuleGeometry args={[0.07, 0.22, 4, 8]} />
        <meshStandardMaterial color={DARK_RED} flatShading />
      </mesh>
      {/* Right arm */}
      <mesh position={[0.38, 0.05, 0.1]} rotation={[0.2, 0, -0.4]}>
        <capsuleGeometry args={[0.07, 0.22, 4, 8]} />
        <meshStandardMaterial color={DARK_RED} flatShading />
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
      // Gentle bob
      groupRef.current.position.y = Math.sin(t * 1) * 0.03;
      // Slow idle rotation
      groupRef.current.rotation.y = Math.sin(t * 0.4) * 0.1;
    }
  });

  return (
    <group ref={groupRef} scale={[1, 1.15, 1]} position={[0, -0.05, 0]}>
      <ChaoBody />
      <Face />
      <HaloFlame />
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
      <directionalLight position={[3, 5, 2]} intensity={0.8} castShadow color="#FFF8F0" />
      <directionalLight position={[-2, 2, -2]} intensity={0.2} color="#FF8C42" />
      <pointLight position={[0, 1.5, 1]} intensity={0.4} color="#FF6B6B" distance={5} />

      <MadChao3DCharacter />

      {/* Ambient sparkles */}
      <Sparkles count={25} scale={5} size={1.2} speed={0.25} color="#FF8C42" opacity={0.4} />

      {/* Floor shadow */}
      <mesh position={[0, -0.55, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[5, 5]} />
        <meshStandardMaterial color="#1a1a1a" transparent opacity={0.1} />
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
        camera={{ position: [0, 0.4, 2.5], fov: 38 }}
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
          autoRotateSpeed={0.6}
          enableDamping
          dampingFactor={0.05}
        />
      </Canvas>
    </div>
  );
}
