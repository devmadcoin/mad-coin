"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sparkles } from "@react-three/drei";
import * as THREE from "three";

/* ═══════════════════════════════════════════════════════════
   MAD CHAO 3D v2 — Proportions Fixed
   Chao-style: big head, compact body, visible limbs.
   ═══════════════════════════════════════════════════════════ */

const RED = "#FF2D2D";
const DARK_RED = "#CC1A1A";
const FLAME_CORE = "#FF6B00";
const FLAME_TIP = "#FFB800";
const EYE_WHITE = "#FFFFFF";
const EYE_PUPIL = "#1a1a1a";

/* ─── Head + Body combined (Chao style: head is the body) ─── */
function ChaoBody() {
  const bodyRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (bodyRef.current) {
      const breathe = 1 + Math.sin(t * 1.8) * 0.012;
      bodyRef.current.scale.set(breathe, breathe * 0.98, breathe);
    }
  });

  return (
    <mesh ref={bodyRef} position={[0, 0.5, 0]} castShadow>
      {/* Slightly squashed sphere — round but not a perfect ball */}
      <sphereGeometry args={[0.42, 20, 16]} />
      <meshStandardMaterial color={RED} flatShading roughness={0.35} metalness={0.05} />
    </mesh>
  );
}

/* ─── Flame on top ─── */
function Flame() {
  const flameRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);

  const particleCount = 25;
  const particleGeo = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 0.25;
      positions[i * 3 + 1] = Math.random() * 0.5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.25;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (flameRef.current) {
      const flicker = 1 + Math.sin(t * 9) * 0.1 + Math.sin(t * 15) * 0.05;
      flameRef.current.scale.set(flicker, flicker * 1.15, flicker);
      flameRef.current.rotation.z = Math.sin(t * 4) * 0.08;
    }
    if (particlesRef.current) {
      const pos = particlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        pos[i * 3 + 1] += 0.01;
        if (pos[i * 3 + 1] > 0.5) {
          pos[i * 3 + 1] = 0;
          pos[i * 3] = (Math.random() - 0.5) * 0.25;
          pos[i * 3 + 2] = (Math.random() - 0.5) * 0.25;
        }
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group ref={flameRef} position={[0, 0.95, 0]}>
      {/* Core — bigger */}
      <mesh position={[0, 0.12, 0]}>
        <coneGeometry args={[0.14, 0.4, 6]} />
        <meshStandardMaterial color={FLAME_CORE} emissive={FLAME_CORE} emissiveIntensity={2.5} flatShading />
      </mesh>
      {/* Inner bright core */}
      <mesh position={[0, 0.08, 0]}>
        <coneGeometry args={[0.08, 0.25, 5]} />
        <meshStandardMaterial color={FLAME_TIP} emissive={FLAME_TIP} emissiveIntensity={4} flatShading />
      </mesh>
      {/* Tip */}
      <mesh position={[0, 0.32, 0]}>
        <coneGeometry args={[0.06, 0.18, 4]} />
        <meshStandardMaterial color={FLAME_TIP} emissive="#FFEA00" emissiveIntensity={5} flatShading />
      </mesh>
      {/* Particles */}
      <points ref={particlesRef} geometry={particleGeo}>
        <pointsMaterial color={FLAME_TIP} size={0.05} transparent opacity={0.9} sizeAttenuation />
      </points>
      {/* Glow light */}
      <pointLight color={FLAME_CORE} intensity={2} distance={4} position={[0, 0.15, 0]} />
    </group>
  );
}

/* ─── Face — BIG and readable ─── */
function Face() {
  return (
    <group position={[0, 0.55, 0.38]}>
      {/* Left eye sclera */}
      <mesh position={[-0.14, 0.02, 0.04]}>
        <sphereGeometry args={[0.11, 12, 12]} />
        <meshStandardMaterial color={EYE_WHITE} flatShading />
      </mesh>
      {/* Right eye sclera */}
      <mesh position={[0.14, 0.02, 0.04]}>
        <sphereGeometry args={[0.11, 12, 12]} />
        <meshStandardMaterial color={EYE_WHITE} flatShading />
      </mesh>

      {/* Left pupil */}
      <mesh position={[-0.12, 0.02, 0.12]}>
        <sphereGeometry args={[0.065, 10, 10]} />
        <meshStandardMaterial color={EYE_PUPIL} flatShading />
      </mesh>
      {/* Right pupil */}
      <mesh position={[0.12, 0.02, 0.12]}>
        <sphereGeometry args={[0.065, 10, 10]} />
        <meshStandardMaterial color={EYE_PUPIL} flatShading />
      </mesh>

      {/* Angry eyebrows — thick angled bars */}
      <mesh position={[-0.14, 0.13, 0.08]} rotation={[0, 0, -0.35]}>
        <boxGeometry args={[0.18, 0.04, 0.03]} />
        <meshStandardMaterial color={DARK_RED} flatShading />
      </mesh>
      <mesh position={[0.14, 0.13, 0.08]} rotation={[0, 0, 0.35]}>
        <boxGeometry args={[0.18, 0.04, 0.03]} />
        <meshStandardMaterial color={DARK_RED} flatShading />
      </mesh>

      {/* Unimpressed mouth — horizontal line */}
      <mesh position={[0, -0.1, 0.06]}>
        <boxGeometry args={[0.14, 0.035, 0.03]} />
        <meshStandardMaterial color={DARK_RED} flatShading />
      </mesh>

      {/* Slight cheek puff on left */}
      <mesh position={[-0.22, -0.02, 0.15]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial color={RED} flatShading />
      </mesh>
      <mesh position={[0.22, -0.02, 0.15]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial color={RED} flatShading />
      </mesh>
    </group>
  );
}

/* ─── Arms crossed — visible and thick ─── */
function ArmsCrossed() {
  return (
    <group position={[0, 0.35, 0.28]}>
      {/* Left upper arm — coming from left side */}
      <mesh position={[-0.28, 0.05, 0]} rotation={[0.3, 0, 0.45]}>
        <capsuleGeometry args={[0.1, 0.28, 4, 8]} />
        <meshStandardMaterial color={DARK_RED} flatShading />
      </mesh>
      {/* Right upper arm — coming from right side */}
      <mesh position={[0.28, 0.05, 0]} rotation={[0.3, 0, -0.45]}>
        <capsuleGeometry args={[0.1, 0.28, 4, 8]} />
        <meshStandardMaterial color={DARK_RED} flatShading />
      </mesh>

      {/* Crossed forearms in front */}
      <mesh position={[-0.06, -0.03, 0.12]} rotation={[0.15, 0.2, 0.25]}>
        <capsuleGeometry args={[0.09, 0.32, 4, 8]} />
        <meshStandardMaterial color={RED} flatShading />
      </mesh>
      <mesh position={[0.06, -0.03, 0.12]} rotation={[0.15, -0.2, -0.25]}>
        <capsuleGeometry args={[0.09, 0.32, 4, 8]} />
        <meshStandardMaterial color={RED} flatShading />
      </mesh>

      {/* Hands/fists */}
      <mesh position={[-0.08, -0.08, 0.22]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial color={DARK_RED} flatShading />
      </mesh>
      <mesh position={[0.08, -0.08, 0.22]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial color={DARK_RED} flatShading />
      </mesh>
    </group>
  );
}

/* ─── Wings — rounded, visible from front ─── */
function Wings() {
  const leftWing = useRef<THREE.Mesh>(null);
  const rightWing = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (leftWing.current) {
      leftWing.current.rotation.z = 0.25 + Math.sin(t * 2) * 0.08;
    }
    if (rightWing.current) {
      rightWing.current.rotation.z = -0.25 - Math.sin(t * 2) * 0.08;
    }
  });

  return (
    <group>
      {/* Left wing — rounded shape, positioned visible from front angle */}
      <mesh ref={leftWing} position={[-0.38, 0.42, -0.15]} rotation={[0.1, 0.3, 0.25]}>
        <sphereGeometry args={[0.14, 10, 10]} />
        <meshStandardMaterial color={DARK_RED} flatShading transparent opacity={0.85} />
      </mesh>
      <mesh position={[-0.45, 0.55, -0.12]} rotation={[0.1, 0.3, 0.35]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial color={DARK_RED} flatShading transparent opacity={0.85} />
      </mesh>

      {/* Right wing */}
      <mesh ref={rightWing} position={[0.38, 0.42, -0.15]} rotation={[0.1, -0.3, -0.25]}>
        <sphereGeometry args={[0.14, 10, 10]} />
        <meshStandardMaterial color={DARK_RED} flatShading transparent opacity={0.85} />
      </mesh>
      <mesh position={[0.45, 0.55, -0.12]} rotation={[0.1, -0.3, -0.35]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial color={DARK_RED} flatShading transparent opacity={0.85} />
      </mesh>
    </group>
  );
}

/* ─── Feet ─── */
function Feet() {
  return (
    <group>
      <mesh position={[-0.18, -0.02, 0.1]}>
        <sphereGeometry args={[0.1, 10, 10]} />
        <meshStandardMaterial color={DARK_RED} flatShading />
      </mesh>
      <mesh position={[0.18, -0.02, 0.1]}>
        <sphereGeometry args={[0.1, 10, 10]} />
        <meshStandardMaterial color={DARK_RED} flatShading />
      </mesh>
    </group>
  );
}

/* ─── Full character ─── */
function MadChao3DCharacter() {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    // Head tracks mouse subtly
    if (headRef.current) {
      headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, Math.sin(t * 0.5) * 0.15, 0.03);
    }

    // Gentle bob
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(t * 1.2) * 0.04;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.1, 0]}>
      <group ref={headRef}>
        <ChaoBody />
        <Face />
        <Flame />
      </group>
      <ArmsCrossed />
      <Wings />
      <Feet />
    </group>
  );
}

/* ─── Scene ─── */
function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[2, 4, 3]} intensity={0.9} castShadow color="#FFF5E6" />
      <directionalLight position={[-2, 2, -2]} intensity={0.3} color="#FF6B00" />
      <pointLight position={[0, 1.5, 1]} intensity={0.6} color="#FF2D2D" distance={5} />

      <MadChao3DCharacter />

      {/* Ambient embers */}
      <Sparkles count={30} scale={5} size={1.5} speed={0.3} color="#FF6B00" opacity={0.5} />

      {/* Shadow plane */}
      <mesh position={[0, -0.25, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[6, 6]} />
        <meshStandardMaterial color="#1a1a1a" transparent opacity={0.15} />
      </mesh>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   EXPORT
   ═══════════════════════════════════════════════════════════ */

export default function MadChao3DCanvas({ className = "" }: { className?: string }) {
  return (
    <div className={`w-full h-full min-h-[320px] ${className}`}>
      <Canvas
        camera={{ position: [0, 0.6, 2.2], fov: 40 }}
        shadows
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Scene />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 3.5}
          maxPolarAngle={Math.PI / 2}
          minAzimuthAngle={-0.6}
          maxAzimuthAngle={0.6}
          autoRotate
          autoRotateSpeed={0.8}
          enableDamping
          dampingFactor={0.05}
        />
      </Canvas>
    </div>
  );
}
