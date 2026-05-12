"use client";

import { useRef, useMemo, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float } from "@react-three/drei";
import * as THREE from "three";

/* ═══════════════════════════════════════════════════════════
   $MAD CHAO — 3D Character for MAD Mind
   Procedural Chao-style creature: cute, chaotic, $MAD-branded
   Built entirely with React Three Fiber — no external model files.
   ═══════════════════════════════════════════════════════════ */

/* ─── Shared mouse position (NDC -1 to 1) ─── */
const MOUSE = { x: 0, y: 0 };

/* ─── Body ─── */
function ChaoBody() {
  return (
    <mesh position={[0, 0, 0]} scale={[1, 0.85, 0.95]}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial color="#0a0a0a" roughness={0.4} metalness={0.15} />
    </mesh>
  );
}

/* ─── Head + Eyes ─── */
function ChaoHead() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      // Breathing float
      groupRef.current.position.y = 1.4 + Math.sin(state.clock.elapsedTime * 1.5) * 0.08;
      // Look at mouse (subtle)
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, MOUSE.x * 0.6, 0.04);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -MOUSE.y * 0.3, 0.04);
    }
  });

  return (
    <group ref={groupRef} position={[0, 1.4, 0]}>
      {/* Main head */}
      <mesh scale={[0.95, 0.9, 0.95]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#111111" roughness={0.35} metalness={0.2} />
      </mesh>

      {/* Red energy stripe on forehead */}
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

      {/* Hair crest on top */}
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

/* ─── Wings ─── */
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
        <mesh rotation={[0.3, 0.5, 0]} scale={[0.52, 0.52, 0.52]}>
          <shapeGeometry args={[wingShape]} />
          <meshStandardMaterial color="#ff6666" transparent opacity={0.15} side={THREE.DoubleSide} />
        </mesh>
      </group>
      <group ref={rightWing} position={[0.7, 0.4, -0.2]}>
        <mesh rotation={[0.3, -0.5, 0]} scale={[-0.5, 0.5, 0.5]}>
          <shapeGeometry args={[wingShape]} />
          <meshStandardMaterial color="#ff3333" transparent opacity={0.7} side={THREE.DoubleSide} emissive="#ff1111" emissiveIntensity={0.2} />
        </mesh>
        <mesh rotation={[0.3, -0.5, 0]} scale={[-0.52, 0.52, 0.52]}>
          <shapeGeometry args={[wingShape]} />
          <meshStandardMaterial color="#ff6666" transparent opacity={0.15} side={THREE.DoubleSide} />
        </mesh>
      </group>
    </group>
  );
}

/* ─── Feet ─── */
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

/* ─── Halo ─── */
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

/* ─── Floating Particles ─── */
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

/* ─── Scene Composition ─── */
function Scene() {
  const timeRef = useRef(0);

  useFrame((state) => {
    timeRef.current = state.clock.elapsedTime;
  });

  return (
    <group>
      {/* Lighting */}
      <ambientLight intensity={0.4} color="#ffffff" />
      <directionalLight position={[3, 5, 3]} intensity={1.2} color="#ffffff" />
      <pointLight position={[-2, 3, -2]} intensity={0.6} color="#ff4444" />
      <pointLight position={[2, 1, 2]} intensity={0.4} color="#ff8888" />

      {/* Invisible hit plane for mouse tracking */}
      <mesh position={[0, 0, -2]} visible={false}>
        <planeGeometry args={[20, 20]} />
        <meshBasicMaterial />
      </mesh>

      {/* The $MAD Chao */}
      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.3}>
        <group scale={0.65} position={[0, -0.5, 0]}>
          <ChaoBody />
          <ChaoHead />
          <ChaoWings time={timeRef.current} />
          <ChaoFeet time={timeRef.current} />
          <ChaoHalo />
        </group>
      </Float>

      {/* Chao Garden Island */}
      <IslandEnvironment />

      <FloatingParticles />

/* ─── Island Environment ─── */
function IslandEnvironment() {
  return (
    <group position={[0, -1.8, 0]}>
      {/* Main island base */}
      <mesh position={[0, 0, 0]} scale={[2.2, 0.4, 2.2]}>
        <cylinderGeometry args={[1, 1.1, 1, 32]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.8} />
      </mesh>
      {/* Island top grass layer */}
      <mesh position={[0, 0.22, 0]} scale={[2.0, 0.08, 2.0]}>
        <cylinderGeometry args={[1, 1, 1, 32]} />
        <meshStandardMaterial color="#0f2a1a" roughness={0.9} />
      </mesh>
      {/* Small rocks */}
      <mesh position={[-1.2, 0.15, 0.5]} scale={[0.12, 0.08, 0.1]} rotation={[0.2, 0.5, 0.1]}>
        <dodecahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color="#2a2a3a" roughness={0.7} />
      </mesh>
      <mesh position={[1.0, 0.12, -0.7]} scale={[0.08, 0.06, 0.09]} rotation={[0.1, -0.3, 0.2]}>
        <dodecahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color="#252535" roughness={0.7} />
      </mesh>
      <mesh position={[0.5, 0.18, 1.1]} scale={[0.1, 0.07, 0.08]} rotation={[-0.1, 0.8, 0]}>
        <dodecahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color="#2d2d3d" roughness={0.7} />
      </mesh>
      {/* Tiny plants / coral */}
      <mesh position={[-0.7, 0.35, 0.8]} scale={[0.04, 0.15, 0.04]}>
        <coneGeometry args={[1, 1, 6]} />
        <meshStandardMaterial color="#3a5a3a" roughness={0.8} />
      </mesh>
      <mesh position={[0.9, 0.3, 0.4]} scale={[0.03, 0.12, 0.03]}>
        <coneGeometry args={[1, 1, 6]} />
        <meshStandardMaterial color="#2d4a2d" roughness={0.8} />
      </mesh>
      {/* Water ring around island */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.15, 0]}>
        <ringGeometry args={[2.4, 4.5, 64]} />
        <meshStandardMaterial
          color="#0a1628"
          roughness={0.1}
          metalness={0.6}
          transparent
          opacity={0.6}
        />
      </mesh>
      {/* Outer water */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.2, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial
          color="#050a14"
          roughness={0.05}
          metalness={0.8}
          transparent
          opacity={0.4}
        />
      </mesh>
    </group>
  );
}
    </group>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN EXPORT — 3D Canvas Wrapper
   ═══════════════════════════════════════════════════════════ */

export default function MadChao3D() {
  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    MOUSE.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    MOUSE.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  }, []);

  return (
    <div
      style={{ width: "100%", height: "420px", borderRadius: "20px", overflow: "hidden", marginBottom: "24px", border: "1px solid rgba(255,255,255,0.06)" }}
      onPointerMove={handlePointerMove}
    >
      <Canvas
        camera={{ position: [0, 0.2, 4.5], fov: 45 }}
        style={{ background: "#050505" }}
        gl={{ antialias: true, alpha: true }}
      >
        <Scene />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 1.8}
          minPolarAngle={Math.PI / 4}
          autoRotate
          autoRotateSpeed={0.8}
        />
      </Canvas>
    </div>
  );
}
