"use client";

import { useRef, useMemo, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float } from "@react-three/drei";
import * as THREE from "three";

/* ═══════════════════════════════════════════════════════════
   $MAD CHAO — 3D Character for MAD Mind
   Procedural Chao-style creature on a floating island.
   ═══════════════════════════════════════════════════════════ */

const MOUSE = { x: 0, y: 0 };

/* ────────────────────────────────
   ISLAND ENVIRONMENT
   ──────────────────────────────── */
function IslandEnvironment() {
  return (
    <group position={[0, -1.2, 0]}>
      {/* Island base — dark stone */}
      <mesh position={[0, 0, 0]} scale={[2.0, 0.35, 2.0]}>
        <cylinderGeometry args={[1, 1.15, 1, 48]} />
        <meshStandardMaterial color="#222233" roughness={0.75} metalness={0.15} />
      </mesh>

      {/* Island top — mossy surface */}
      <mesh position={[0, 0.2, 0]} scale={[1.9, 0.06, 1.9]}>
        <cylinderGeometry args={[1, 1, 1, 48]} />
        <meshStandardMaterial color="#1a3a2a" roughness={0.85} />
      </mesh>

      {/* Glowing edge ring */}
      <mesh position={[0, 0.24, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.88, 1.92, 64]} />
        <meshStandardMaterial
          color="#ff4444"
          emissive="#ff2222"
          emissiveIntensity={2}
          transparent
          opacity={0.5}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Rocks */}
      {[
        { p: [-0.9, 0.15, 0.4], s: [0.15, 0.1, 0.12], r: [0.2, 0.5, 0.1], c: "#3a3a4a" },
        { p: [0.8, 0.12, -0.6], s: [0.1, 0.08, 0.09], r: [0.1, -0.3, 0.2], c: "#333344" },
        { p: [0.4, 0.18, 0.9], s: [0.12, 0.09, 0.1], r: [-0.1, 0.8, 0], c: "#3d3d4d" },
        { p: [-0.3, 0.14, -0.9], s: [0.09, 0.07, 0.08], r: [0.3, 0.2, -0.1], c: "#353545" },
      ].map((rock, i) => (
        <mesh key={i} position={rock.p as [number, number, number]} scale={rock.s as [number, number, number]} rotation={rock.r as [number, number, number]}>
          <dodecahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color={rock.c} roughness={0.6} />
        </mesh>
      ))}

      {/* Tiny plants */}
      {[
        { p: [-0.6, 0.35, 0.6], s: [0.05, 0.18, 0.05], c: "#2a5a3a" },
        { p: [0.7, 0.32, 0.3], s: [0.04, 0.14, 0.04], c: "#1d4a2d" },
        { p: [0.2, 0.3, -0.7], s: [0.035, 0.12, 0.035], c: "#254a30" },
        { p: [-0.4, 0.28, -0.4], s: [0.03, 0.1, 0.03], c: "#1e3d28" },
      ].map((plant, i) => (
        <mesh key={i} position={plant.p as [number, number, number]} scale={plant.s as [number, number, number]}>
          <coneGeometry args={[1, 1, 6]} />
          <meshStandardMaterial color={plant.c} roughness={0.8} />
        </mesh>
      ))}

      {/* Small red flowers / crystals */}
      {[
        { p: [0.5, 0.28, 0.5], s: [0.04, 0.06, 0.04] },
        { p: [-0.5, 0.26, -0.3], s: [0.035, 0.05, 0.035] },
        { p: [0.1, 0.27, 0.8], s: [0.03, 0.045, 0.03] },
      ].map((f, i) => (
        <mesh key={i} position={f.p as [number, number, number]} scale={f.s as [number, number, number]}>
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color="#ff4444" emissive="#ff2222" emissiveIntensity={1} roughness={0.3} />
        </mesh>
      ))}

      {/* Water ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
        <ringGeometry args={[2.1, 5, 64]} />
        <meshStandardMaterial
          color="#0d1f3a"
          roughness={0.05}
          metalness={0.7}
          transparent
          opacity={0.5}
        />
      </mesh>

      {/* Outer water */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.15, 0]}>
        <planeGeometry args={[25, 25]} />
        <meshStandardMaterial
          color="#080e1c"
          roughness={0.02}
          metalness={0.9}
          transparent
          opacity={0.35}
        />
      </mesh>
    </group>
  );
}

/* ────────────────────────────────
   CHAO CHARACTER
   ──────────────────────────────── */

function ChaoBody() {
  return (
    <mesh position={[0, 0, 0]} scale={[1, 0.85, 0.95]}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial color="#0a0a0a" roughness={0.4} metalness={0.15} />
    </mesh>
  );
}

function ChaoHead() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = 1.4 + Math.sin(state.clock.elapsedTime * 1.5) * 0.08;
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, MOUSE.x * 0.6, 0.04);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -MOUSE.y * 0.3, 0.04);
    }
  });

  return (
    <group ref={groupRef} position={[0, 1.4, 0]}>
      <mesh scale={[0.95, 0.9, 0.95]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#111111" roughness={0.35} metalness={0.2} />
      </mesh>

      {/* Red energy stripe */}
      <mesh position={[0, 0.35, 0.82]} rotation={[0.1, 0, 0]} scale={[0.3, 0.12, 0.1]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial color="#ff3333" emissive="#ff1111" emissiveIntensity={0.8} roughness={0.2} />
      </mesh>

      {/* Left Eye */}
      <group position={[-0.32, 0.05, 0.78]}>
        <mesh scale={[0.28, 0.32, 0.15]}>
          <sphereGeometry args={[1, 24, 24]} />
          <meshStandardMaterial color="#ffffff" roughness={0.2} />
        </mesh>
        <mesh position={[0, 0, 0.12]} scale={[0.14, 0.16, 0.08]}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshStandardMaterial color="#0a0a0a" roughness={0.1} />
        </mesh>
        <mesh position={[0.06, 0.06, 0.16]} scale={[0.05, 0.05, 0.02]}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1} />
        </mesh>
      </group>

      {/* Right Eye */}
      <group position={[0.32, 0.05, 0.78]}>
        <mesh scale={[0.28, 0.32, 0.15]}>
          <sphereGeometry args={[1, 24, 24]} />
          <meshStandardMaterial color="#ffffff" roughness={0.2} />
        </mesh>
        <mesh position={[0, 0, 0.12]} scale={[0.14, 0.16, 0.08]}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshStandardMaterial color="#0a0a0a" roughness={0.1} />
        </mesh>
        <mesh position={[-0.06, 0.06, 0.16]} scale={[0.05, 0.05, 0.02]}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1} />
        </mesh>
      </group>

      {/* Hair crest */}
      <group position={[0, 0.85, 0]}>
        <mesh scale={[0.35, 0.3, 0.35]}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.2, 0]} scale={[0.18, 0.15, 0.18]}>
          <sphereGeometry args={[1, 12, 12]} />
          <meshStandardMaterial color="#ff3333" emissive="#ff1111" emissiveIntensity={0.5} roughness={0.3} />
        </mesh>
      </group>

      {/* Blush marks */}
      <mesh position={[-0.55, -0.15, 0.6]} scale={[0.1, 0.06, 0.04]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshStandardMaterial color="#ff5555" transparent opacity={0.4} />
      </mesh>
      <mesh position={[0.55, -0.15, 0.6]} scale={[0.1, 0.06, 0.04]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshStandardMaterial color="#ff5555" transparent opacity={0.4} />
      </mesh>
    </group>
  );
}

function ChaoWings({ time }: { time: number }) {
  const leftWing = useRef<THREE.Group>(null);
  const rightWing = useRef<THREE.Group>(null);

  useFrame(() => {
    const flap = Math.sin(time * 4) * 0.25;
    if (leftWing.current) leftWing.current.rotation.z = -0.3 + flap;
    if (rightWing.current) rightWing.current.rotation.z = 0.3 - flap;
  });

  const wingShape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.quadraticCurveTo(0.4, 0.3, 0.3, 0.7);
    shape.quadraticCurveTo(0.1, 0.9, -0.1, 0.6);
    shape.quadraticCurveTo(-0.2, 0.3, 0, 0);
    return shape;
  }, []);

  return (
    <group>
      <group ref={leftWing} position={[-0.7, 0.4, -0.2]}>
        <mesh rotation={[0.3, 0.5, 0]} scale={[0.5, 0.5, 0.5]}>
          <shapeGeometry args={[wingShape]} />
          <meshStandardMaterial color="#ff3333" transparent opacity={0.7} side={THREE.DoubleSide} emissive="#ff1111" emissiveIntensity={0.2} />
        </mesh>
      </group>
      <group ref={rightWing} position={[0.7, 0.4, -0.2]}>
        <mesh rotation={[0.3, -0.5, 0]} scale={[-0.5, 0.5, 0.5]}>
          <shapeGeometry args={[wingShape]} />
          <meshStandardMaterial color="#ff3333" transparent opacity={0.7} side={THREE.DoubleSide} emissive="#ff1111" emissiveIntensity={0.2} />
        </mesh>
      </group>
    </group>
  );
}

function ChaoFeet({ time }: { time: number }) {
  const leftFoot = useRef<THREE.Mesh>(null);
  const rightFoot = useRef<THREE.Mesh>(null);

  useFrame(() => {
    const bounce = Math.sin(time * 3) * 0.05;
    if (leftFoot.current) leftFoot.current.position.y = -0.75 + bounce;
    if (rightFoot.current) rightFoot.current.position.y = -0.75 + Math.cos(time * 3) * 0.05;
  });

  return (
    <group>
      <mesh ref={leftFoot} position={[-0.4, -0.75, 0.3]} scale={[0.22, 0.18, 0.28]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.5} />
      </mesh>
      <mesh ref={rightFoot} position={[0.4, -0.75, 0.3]} scale={[0.22, 0.18, 0.28]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.5} />
      </mesh>
    </group>
  );
}

function ChaoHalo() {
  const haloRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (haloRef.current) {
      haloRef.current.rotation.z = state.clock.elapsedTime * 0.5;
      haloRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
    }
  });

  return (
    <mesh ref={haloRef} position={[0, 2.3, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[0.55, 0.03, 8, 32]} />
      <meshStandardMaterial color="#ff4444" emissive="#ff2222" emissiveIntensity={1.5} transparent opacity={0.8} />
    </mesh>
  );
}

function FloatingParticles() {
  const particlesRef = useRef<THREE.Group>(null);

  const particles = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 4 + 1,
        (Math.random() - 0.5) * 4,
      ] as [number, number, number],
      speed: 0.3 + Math.random() * 0.7,
      offset: Math.random() * Math.PI * 2,
      size: 0.03 + Math.random() * 0.05,
    }));
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.children.forEach((child, i) => {
        const p = particles[i];
        child.position.y = p.position[1] + Math.sin(state.clock.elapsedTime * p.speed + p.offset) * 0.5;
        child.rotation.y = state.clock.elapsedTime * p.speed;
      });
    }
  });

  return (
    <group ref={particlesRef}>
      {particles.map((p, i) => (
        <mesh key={i} position={p.position}>
          <sphereGeometry args={[p.size, 8, 8]} />
          <meshStandardMaterial
            color={i % 3 === 0 ? "#ff3333" : i % 3 === 1 ? "#ff6666" : "#ffaaaa"}
            emissive="#ff2222"
            emissiveIntensity={0.8}
            transparent
            opacity={0.6}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ────────────────────────────────
   SCENE
   ──────────────────────────────── */
function Scene() {
  const timeRef = useRef(0);

  useFrame((state) => {
    timeRef.current = state.clock.elapsedTime;
  });

  return (
    <group>
      {/* Lighting */}
      <ambientLight intensity={0.5} color="#ffffff" />
      <directionalLight position={[3, 6, 4]} intensity={1.5} color="#fff5f0" />
      <pointLight position={[-3, 4, -3]} intensity={0.8} color="#ff5555" />
      <pointLight position={[3, 2, 3]} intensity={0.5} color="#ff9999" />

      {/* Hit plane */}
      <mesh position={[0, 0, -2]} visible={false}>
        <planeGeometry args={[20, 20]} />
        <meshBasicMaterial />
      </mesh>

      {/* Chao on island */}
      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.3}>
        <group scale={0.65} position={[0, 0.2, 0]}>
          <ChaoBody />
          <ChaoHead />
          <ChaoWings time={timeRef.current} />
          <ChaoFeet time={timeRef.current} />
          <ChaoHalo />
        </group>
      </Float>

      {/* Island */}
      <IslandEnvironment />

      {/* Particles */}
      <FloatingParticles />
    </group>
  );
}

/* ═══════════════════════════════════════════════════════════
   EXPORT
   ═══════════════════════════════════════════════════════════ */

export default function MadChao3D() {
  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    MOUSE.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    MOUSE.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  }, []);

  return (
    <div
      style={{
        width: "100%",
        height: "420px",
        borderRadius: "20px",
        overflow: "hidden",
        marginBottom: "24px",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
      onPointerMove={handlePointerMove}
    >
      <Canvas
        camera={{ position: [0, 0.8, 4.5], fov: 45 }}
        style={{ background: "#050505" }}
        gl={{ antialias: true, alpha: true }}
      >
        <Scene />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 1.6}
          minPolarAngle={Math.PI / 5}
          autoRotate
          autoRotateSpeed={0.8}
        />
      </Canvas>
    </div>
  );
}
