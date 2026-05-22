"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Float, Sparkles } from "@react-three/drei";
import * as THREE from "three";

/* ═══════════════════════════════════════════════════════════
   MAD CHAO 3D — The $MAD Flame Guardian
   Procedural character built from primitives.
   Matches pixel-art aesthetic: flat shading, bold colors.
   ═══════════════════════════════════════════════════════════ */

const RED = "#FF2D2D";
const DARK_RED = "#CC1A1A";
const FLAME_CORE = "#FF6B00";
const FLAME_TIP = "#FFB800";
const EYE_WHITE = "#FFFFFF";
const EYE_PUPIL = "#1a1a1a";

/* ─── Flame on head ─── */
function Flame({ intensity = 1 }: { intensity?: number }) {
  const flameRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);

  const particleCount = 20;
  const particleGeo = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 0.3;
      positions[i * 3 + 1] = Math.random() * 0.6;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.3;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (flameRef.current) {
      // Flicker scale
      const flicker = 1 + Math.sin(t * 8) * 0.08 + Math.sin(t * 13) * 0.04;
      flameRef.current.scale.set(1 * flicker, 1.1 * flicker, 1 * flicker);
      // Slight wobble
      flameRef.current.rotation.z = Math.sin(t * 3) * 0.05;
      flameRef.current.rotation.x = Math.sin(t * 4) * 0.03;
    }
    if (particlesRef.current) {
      const pos = particlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        pos[i * 3 + 1] += 0.008; // Rise up
        if (pos[i * 3 + 1] > 0.6) {
          pos[i * 3 + 1] = 0;
          pos[i * 3] = (Math.random() - 0.5) * 0.3;
          pos[i * 3 + 2] = (Math.random() - 0.5) * 0.3;
        }
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group ref={flameRef} position={[0, 1.15, 0]}>
      {/* Core flame */}
      <mesh position={[0, 0.15, 0]}>
        <coneGeometry args={[0.12, 0.35, 6]} />
        <meshStandardMaterial color={FLAME_CORE} emissive={FLAME_CORE} emissiveIntensity={2} flatShading />
      </mesh>
      {/* Tip flame */}
      <mesh position={[0, 0.35, 0]}>
        <coneGeometry args={[0.07, 0.2, 5]} />
        <meshStandardMaterial color={FLAME_TIP} emissive={FLAME_TIP} emissiveIntensity={3} flatShading />
      </mesh>
      {/* Particles */}
      <points ref={particlesRef} geometry={particleGeo}>
        <pointsMaterial
          color={FLAME_TIP}
          size={0.04}
          transparent
          opacity={0.8}
          sizeAttenuation
        />
      </points>
      {/* Light glow */}
      <pointLight color={FLAME_CORE} intensity={1.5 * intensity} distance={3} position={[0, 0.2, 0]} />
    </group>
  );
}

/* ─── Body ─── */
function Body() {
  const bodyRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (bodyRef.current) {
      // Breathing
      const breathe = 1 + Math.sin(t * 2) * 0.015;
      bodyRef.current.scale.set(breathe, breathe, breathe);
    }
  });

  return (
    <mesh ref={bodyRef} position={[0, 0.45, 0]} castShadow>
      <sphereGeometry args={[0.55, 16, 14]} />
      <meshStandardMaterial color={RED} flatShading roughness={0.4} metalness={0.1} />
    </mesh>
  );
}

/* ─── Arms crossed ─── */
function ArmsCrossed() {
  return (
    <group position={[0, 0.35, 0.3]}>
      {/* Left arm */}
      <mesh position={[-0.18, 0.02, 0.05]} rotation={[0, 0, 0.4]}>
        <capsuleGeometry args={[0.1, 0.35, 4, 8]} />
        <meshStandardMaterial color={DARK_RED} flatShading />
      </mesh>
      {/* Right arm */}
      <mesh position={[0.18, 0.02, 0.05]} rotation={[0, 0, -0.4]}>
        <capsuleGeometry args={[0.1, 0.35, 4, 8]} />
        <meshStandardMaterial color={DARK_RED} flatShading />
      </mesh>
      {/* Crossed forearms */}
      <mesh position={[0, -0.05, 0.15]} rotation={[0.3, 0, 0]}>
        <capsuleGeometry args={[0.09, 0.4, 4, 8]} />
        <meshStandardMaterial color={RED} flatShading />
      </mesh>
    </group>
  );
}

/* ─── Face ─── */
function Face({ expression = "stern" }: { expression?: "stern" | "angry" | "neutral" }) {
  return (
    <group position={[0, 0.55, 0.42]}>
      {/* Eyes */}
      <mesh position={[-0.16, 0.02, 0]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial color={EYE_WHITE} flatShading />
      </mesh>
      <mesh position={[0.16, 0.02, 0]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial color={EYE_WHITE} flatShading />
      </mesh>
      {/* Pupils */}
      <mesh position={[-0.14, 0.02, 0.05]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color={EYE_PUPIL} flatShading />
      </mesh>
      <mesh position={[0.14, 0.02, 0.05]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color={EYE_PUPIL} flatShading />
      </mesh>
      {/* Eyebrows / expression */}
      {expression === "stern" && (
        <>
          <mesh position={[-0.16, 0.1, 0.02]} rotation={[0, 0, -0.3]}>
            <boxGeometry args={[0.14, 0.03, 0.02]} />
            <meshStandardMaterial color={DARK_RED} flatShading />
          </mesh>
          <mesh position={[0.16, 0.1, 0.02]} rotation={[0, 0, 0.3]}>
            <boxGeometry args={[0.14, 0.03, 0.02]} />
            <meshStandardMaterial color={DARK_RED} flatShading />
          </mesh>
        </>
      )}
      {/* Mouth — unimpressed line */}
      <mesh position={[0, -0.08, 0.02]}>
        <boxGeometry args={[0.12, 0.025, 0.02]} />
        <meshStandardMaterial color={DARK_RED} flatShading />
      </mesh>
    </group>
  );
}

/* ─── Wings / Fins ─── */
function Wings() {
  return (
    <group>
      {/* Left wing */}
      <mesh position={[-0.5, 0.4, -0.1]} rotation={[0.2, 0.4, 0.3]}>
        <boxGeometry args={[0.25, 0.35, 0.05]} />
        <meshStandardMaterial color={DARK_RED} flatShading transparent opacity={0.9} />
      </mesh>
      {/* Right wing */}
      <mesh position={[0.5, 0.4, -0.1]} rotation={[0.2, -0.4, -0.3]}>
        <boxGeometry args={[0.25, 0.35, 0.05]} />
        <meshStandardMaterial color={DARK_RED} flatShading transparent opacity={0.9} />
      </mesh>
    </group>
  );
}

/* ─── Legs ─── */
function Legs() {
  return (
    <group>
      <mesh position={[-0.2, 0.05, 0.05]}>
        <capsuleGeometry args={[0.1, 0.15, 4, 8]} />
        <meshStandardMaterial color={DARK_RED} flatShading />
      </mesh>
      <mesh position={[0.2, 0.05, 0.05]}>
        <capsuleGeometry args={[0.1, 0.15, 4, 8]} />
        <meshStandardMaterial color={DARK_RED} flatShading />
      </mesh>
    </group>
  );
}

/* ─── The complete character ─── */
function MadChao3D({ mousePosition }: { mousePosition: React.MutableRefObject<{ x: number; y: number }> }) {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    
    // Mouse tracking — subtle head turn
    if (headRef.current && mousePosition.current) {
      const targetX = mousePosition.current.x * 0.3;
      const targetY = mousePosition.current.y * 0.2;
      headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, targetX, 0.05);
      headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, targetY, 0.05);
    }

    // Idle float
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(t * 1.5) * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      <group ref={headRef}>
        <Body />
        <Face expression="stern" />
        <Flame intensity={1.2} />
      </group>
      <ArmsCrossed />
      <Wings />
      <Legs />
    </group>
  );
}

/* ─── Scene wrapper ─── */
function Scene() {
  const mouseRef = useRef({ x: 0, y: 0 });
  const { viewport } = useThree();

  const handlePointerMove = (e: THREE.Event | any) => {
    if (e.point) {
      mouseRef.current.x = (e.point.x / viewport.width) * 2;
      mouseRef.current.y = (e.point.y / viewport.height) * 2;
    }
  };

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 5, 2]} intensity={1} castShadow />
      <pointLight position={[-2, 3, -2]} intensity={0.5} color="#FF6B00" />
      
      <group onPointerMove={handlePointerMove}>
        <MadChao3D mousePosition={mouseRef} />
      </group>

      {/* Floating embers */}
      <Sparkles count={40} scale={4} size={2} speed={0.4} color="#FF6B00" opacity={0.6} />
      
      {/* Dark ground plane */}
      <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#1a1a1a" transparent opacity={0.3} />
      </mesh>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   EXPORT — Canvas wrapper with responsive sizing
   ═══════════════════════════════════════════════════════════ */

export default function MadChao3DCanvas({ className = "" }: { className?: string }) {
  return (
    <div className={`w-full h-full min-h-[350px] ${className}`}>
      <Canvas
        camera={{ position: [0, 0.8, 2.5], fov: 45 }}
        shadows
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Scene />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.8}
          minAzimuthAngle={-0.5}
          maxAzimuthAngle={0.5}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
}
