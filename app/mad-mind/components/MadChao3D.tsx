"use client";

import { useState, useRef, useMemo, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float } from "@react-three/drei";
import * as THREE from "three";

/* ═══════════════════════════════════════════════════════════
   $MAD CHAO GARDEN — 3D World with Walking Character
   ═══════════════════════════════════════════════════════════ */

const MOUSE = { x: 0, y: 0 };

/* ────────────────────────────────
   GARDEN ENVIRONMENT
/* ────────────────────────────────
   MAIN SCENE
   ──────────────────────────────── */
function GardenWorld() {
  return (
    <group>
      <FloatingIsland position={[0, -0.3, 0]} scale={1.2} isMain />
      <FloatingIsland position={[-3.5, -0.8, -2]} scale={0.7} />
      <FloatingIsland position={[3.2, -0.5, -1.5]} scale={0.9} />
      <FloatingIsland position={[-1.5, -1.2, 3]} scale={0.6} />
      <FloatingIsland position={[2.5, -0.6, 2.5]} scale={0.5} />
      <EtherealBridge from={[0, -0.3, 0]} to={[-3.5, -0.8, -2]} />
      <EtherealBridge from={[0, -0.3, 0]} to={[3.2, -0.5, -1.5]} />
      <GardenWater />
      <GardenParticles />
      <StarField />
    </group>
  );
}

function FloatingIsland({ position, scale, isMain = false }: { position: [number, number, number]; scale: number; isMain?: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.4 + position[0]) * 0.15;
    }
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      <mesh position={[0, -0.2, 0]} scale={[1.5, 0.4, 1.5]}>
        <cylinderGeometry args={[1, 1.3, 1, 32]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.8} metalness={0.1} />
      </mesh>
      <mesh position={[0, 0.05, 0]} scale={[1.45, 0.08, 1.45]}>
        <cylinderGeometry args={[1, 1, 1, 32]} />
        <meshStandardMaterial color={isMain ? "#1a3a2a" : "#152a20"} roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.4, 1.48, 64]} />
        <meshStandardMaterial color="#ff4444" emissive="#ff2222" emissiveIntensity={isMain ? 2 : 1} transparent opacity={0.5} side={THREE.DoubleSide} />
      </mesh>
      {isMain && (
        <>
          <GardenTree position={[-0.8, 0.2, 0.6]} scale={0.8} />
          <GardenTree position={[0.9, 0.15, -0.5]} scale={0.6} />
          <GardenTree position={[0.3, 0.2, 0.9]} scale={0.7} />
        </>
      )}
      <mesh position={[-0.5, 0.15, -0.7]} scale={[0.12, 0.1, 0.1]} rotation={[0.2, 0.5, 0.1]}>
        <dodecahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color="#2a2a3a" roughness={0.6} />
      </mesh>
      <Crystal position={[0.7, 0.3, 0.4]} scale={0.15} color="#ff4444" />
      <Crystal position={[-0.6, 0.25, -0.3]} scale={0.1} color="#ff6666" />
      {isMain && (
        <>
          <GardenFlower position={[-0.3, 0.12, 0.5]} color="#ff3333" />
          <GardenFlower position={[0.5, 0.12, 0.3]} color="#ff5555" />
          <GardenFlower position={[0.2, 0.12, -0.6]} color="#ff4444" />
          <GardenFlower position={[-0.7, 0.12, -0.2]} color="#ff6666" />
        </>
      )}
    </group>
  );
}

function EtherealBridge({ from, to }: { from: [number, number, number]; to: [number, number, number] }) {
  const midX = (from[0] + to[0]) / 2;
  const midY = Math.min(from[1], to[1]) - 0.3;
  const midZ = (from[2] + to[2]) / 2;
  const dist = Math.sqrt((to[0] - from[0]) ** 2 + (to[2] - from[2]) ** 2);
  
  return (
    <group>
      <mesh position={[midX, midY, midZ]} rotation={[0, Math.atan2(to[0] - from[0], to[2] - from[2]), 0]} scale={[dist * 0.5, 0.05, 0.3]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#ff4444" emissive="#ff2222" emissiveIntensity={0.5} transparent opacity={0.3} />
      </mesh>
      {Array.from({ length: 5 }, (_, i) => {
        const t = i / 4;
        const x = from[0] + (to[0] - from[0]) * t;
        const z = from[2] + (to[2] - from[2]) * t;
        const y = from[1] + (to[1] - from[1]) * t - 0.2 + Math.sin(t * Math.PI) * 0.3;
        return (
          <mesh key={i} position={[x, y, z]} scale={0.04}>
            <sphereGeometry args={[1, 8, 8]} />
            <meshStandardMaterial color="#ff5555" emissive="#ff3333" emissiveIntensity={1} transparent opacity={0.8} />
          </mesh>
        );
      })}
    </group>
  );
}

function GardenTree({ position, scale }: { position: [number, number, number]; scale: number }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.3, 0]} scale={[0.08, 0.4, 0.08]}>
        <cylinderGeometry args={[1, 1.2, 1, 6]} />
        <meshStandardMaterial color="#2a1a1a" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.7, 0]} scale={[0.35, 0.25, 0.35]}>
        <sphereGeometry args={[1, 12, 12]} />
        <meshStandardMaterial color="#1a4a2a" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.9, 0]} scale={[0.25, 0.2, 0.25]}>
        <sphereGeometry args={[1, 12, 12]} />
        <meshStandardMaterial color="#1d5a30" roughness={0.8} />
      </mesh>
      <mesh position={[0.15, 0.75, 0.15]} scale={0.04}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshStandardMaterial color="#ff4444" emissive="#ff2222" emissiveIntensity={1} />
      </mesh>
    </group>
  );
}

function Crystal({ position, scale, color }: { position: [number, number, number]; scale: number; color: string }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.5;
      ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 1.5) * 0.05;
    }
  });
  return (
    <mesh ref={ref} position={position} scale={scale}>
      <octahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} roughness={0.2} metalness={0.5} />
    </mesh>
  );
}

function GardenFlower({ position, color }: { position: [number, number, number]; color: string }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5 + position[0]) * 0.2;
      ref.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 2 + position[2]) * 0.05);
    }
  });
  return (
    <group ref={ref} position={position}>
      <mesh position={[0, 0.06, 0]} scale={[0.01, 0.06, 0.01]}>
        <cylinderGeometry args={[1, 1, 1, 4]} />
        <meshStandardMaterial color="#1a3a1a" />
      </mesh>
      <mesh position={[0, 0.12, 0]} scale={0.04}>
        <sphereGeometry args={[1, 6, 6]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

function GardenWater() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ref.current) ref.current.position.y = -1.8 + Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
  });
  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.8, 0]}>
      <planeGeometry args={[30, 30]} />
      <meshStandardMaterial color="#0a0e1a" roughness={0.05} metalness={0.9} transparent opacity={0.4} />
    </mesh>
  );
}

function GardenParticles() {
  const particlesRef = useRef<THREE.Group>(null);
  const particles = useMemo(() => Array.from({ length: 20 }, (_, i) => ({
    position: [(Math.random() - 0.5) * 10, Math.random() * 4 - 1, (Math.random() - 0.5) * 10] as [number, number, number],
    speed: 0.2 + Math.random() * 0.8,
    offset: Math.random() * Math.PI * 2,
    size: 0.02 + Math.random() * 0.04,
    color: ["#ff3333", "#ff5555", "#ffaaaa", "#ffffff"][Math.floor(Math.random() * 4)],
  })), []);
  
  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.children.forEach((child, i) => {
        const p = particles[i];
        child.position.y = p.position[1] + Math.sin(state.clock.elapsedTime * p.speed + p.offset) * 0.8;
        child.position.x = p.position[0] + Math.cos(state.clock.elapsedTime * p.speed * 0.5 + p.offset) * 0.3;
        child.rotation.y = state.clock.elapsedTime * p.speed;
      });
    }
  });
  
  return (
    <group ref={particlesRef}>
      {particles.map((p, i) => (
        <mesh key={i} position={p.position}>
          <sphereGeometry args={[p.size, 6, 6]} />
          <meshStandardMaterial color={p.color} emissive={p.color} emissiveIntensity={0.6} transparent opacity={0.7} />
        </mesh>
      ))}
    </group>
  );
}

function StarField() {
  const stars = useMemo(() => Array.from({ length: 100 }, () => ({
    position: [(Math.random() - 0.5) * 40, (Math.random() - 0.5) * 20 + 5, (Math.random() - 0.5) * 40 - 10] as [number, number, number],
    size: 0.02 + Math.random() * 0.04,
  })), []);
  
  return (
    <group>
      {stars.map((star, i) => (
        <mesh key={i} position={star.position}>
          <sphereGeometry args={[star.size, 4, 4]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} transparent opacity={0.8} />
        </mesh>
      ))}
    </group>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAD CLAW CHARACTER — With Legs & Walking
   ═══════════════════════════════════════════════════════════ */

function CharacterBody() {
  return (
    <mesh position={[0, 0.35, 0]} scale={[0.9, 0.75, 0.85]}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial color="#0a0a0a" roughness={0.4} metalness={0.15} />
    </mesh>
  );
}

function CharacterHead() {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = 1.1 + Math.sin(state.clock.elapsedTime * 1.5) * 0.03;
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, MOUSE.x * 0.6, 0.04);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -MOUSE.y * 0.3, 0.04);
    }
  });

  return (
    <group ref={groupRef} position={[0, 1.1, 0]}>
      {/* Head sphere */}
      <mesh scale={[0.85, 0.82, 0.82]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#111111" roughness={0.35} metalness={0.2} />
      </mesh>
      
      {/* Red energy stripe on forehead */}
      <mesh position={[0, 0.35, 0.72]} rotation={[0.1, 0, 0]} scale={[0.25, 0.1, 0.08]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial color="#ff3333" emissive="#ff1111" emissiveIntensity={0.8} roughness={0.2} />
      </mesh>

      {/* Left Eye */}
      <group position={[-0.28, 0.05, 0.68]}>
        <mesh scale={[0.26, 0.3, 0.14]}>
          <sphereGeometry args={[1, 24, 24]} />
          <meshStandardMaterial color="#ffffff" roughness={0.2} />
        </mesh>
        <mesh position={[0, 0, 0.11]} scale={[0.13, 0.15, 0.07]}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshStandardMaterial color="#0a0a0a" roughness={0.1} />
        </mesh>
        <mesh position={[0.05, 0.05, 0.14]} scale={[0.04, 0.04, 0.02]}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1} />
        </mesh>
      </group>

      {/* Right Eye */}
      <group position={[0.28, 0.05, 0.68]}>
        <mesh scale={[0.26, 0.3, 0.14]}>
          <sphereGeometry args={[1, 24, 24]} />
          <meshStandardMaterial color="#ffffff" roughness={0.2} />
        </mesh>
        <mesh position={[0, 0, 0.11]} scale={[0.13, 0.15, 0.07]}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshStandardMaterial color="#0a0a0a" roughness={0.1} />
        </mesh>
        <mesh position={[-0.05, 0.05, 0.14]} scale={[0.04, 0.04, 0.02]}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1} />
        </mesh>
      </group>

      {/* Hair tuft */}
      <group position={[0, 0.75, 0]}>
        <mesh scale={[0.3, 0.25, 0.3]}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.18, 0]} scale={[0.15, 0.12, 0.15]}>
          <sphereGeometry args={[1, 12, 12]} />
          <meshStandardMaterial color="#ff3333" emissive="#ff1111" emissiveIntensity={0.5} roughness={0.3} />
        </mesh>
      </group>

      {/* Blush marks */}
      <mesh position={[-0.5, -0.12, 0.55]} scale={[0.09, 0.05, 0.03]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshStandardMaterial color="#ff5555" transparent opacity={0.4} />
      </mesh>
      <mesh position={[0.5, -0.12, 0.55]} scale={[0.09, 0.05, 0.03]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshStandardMaterial color="#ff5555" transparent opacity={0.4} />
      </mesh>
    </group>
  );
}

function CharacterWings({ time }: { time: number }) {
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
      <group ref={leftWing} position={[-0.65, 0.35, -0.15]}>
        <mesh rotation={[0.3, 0.5, 0]} scale={[0.45, 0.45, 0.45]}>
          <shapeGeometry args={[wingShape]} />
          <meshStandardMaterial color="#ff3333" transparent opacity={0.7} side={THREE.DoubleSide} emissive="#ff1111" emissiveIntensity={0.2} />
        </mesh>
      </group>
      <group ref={rightWing} position={[0.65, 0.35, -0.15]}>
        <mesh rotation={[0.3, -0.5, 0]} scale={[-0.45, 0.45, 0.45]}>
          <shapeGeometry args={[wingShape]} />
          <meshStandardMaterial color="#ff3333" transparent opacity={0.7} side={THREE.DoubleSide} emissive="#ff1111" emissiveIntensity={0.2} />
        </mesh>
      </group>
    </group>
  );
}

/* ─── Proper legs with walking animation ─── */
function CharacterLegs({ time, isWalking }: { time: number; isWalking: boolean }) {
  const leftThigh = useRef<THREE.Group>(null);
  const rightThigh = useRef<THREE.Group>(null);
  const leftShin = useRef<THREE.Group>(null);
  const rightShin = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!isWalking) {
      /* Idle breathing pose */
      if (leftThigh.current) leftThigh.current.rotation.x = 0;
      if (rightThigh.current) rightThigh.current.rotation.x = 0;
      if (leftShin.current) leftShin.current.rotation.x = 0.1;
      if (rightShin.current) rightShin.current.rotation.x = 0.1;
      return;
    }

    const walkSpeed = 5;
    const stride = 0.4;
    
    /* Left leg */  
    const lPhase = Math.sin(time * walkSpeed);
    if (leftThigh.current) leftThigh.current.rotation.x = lPhase * stride;
    if (leftShin.current) leftShin.current.rotation.x = Math.max(0, -lPhase * stride * 0.8) + 0.1;
    
    /* Right leg — opposite phase */
    const rPhase = Math.sin(time * walkSpeed + Math.PI);
    if (rightThigh.current) rightThigh.current.rotation.x = rPhase * stride;
    if (rightShin.current) rightShin.current.rotation.x = Math.max(0, -rPhase * stride * 0.8) + 0.1;
  });

  return (
    <group>
      {/* Left Leg */}
      <group ref={leftThigh} position={[-0.3, 0, 0]}>
        {/* Thigh */}
        <mesh position={[0, -0.2, 0]} scale={[0.12, 0.3, 0.12]}>
          <sphereGeometry args={[1, 12, 12]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.5} />
        </mesh>
        <group ref={leftShin} position={[0, -0.4, 0]}>
          {/* Shin */}
          <mesh position={[0, -0.15, 0]} scale={[0.1, 0.25, 0.1]}>
            <sphereGeometry args={[1, 12, 12]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.5} />
          </mesh>
          {/* Foot */}
          <mesh position={[0, -0.3, 0.05]} scale={[0.14, 0.08, 0.18]}>
            <sphereGeometry args={[1, 12, 12]} />
            <meshStandardMaterial color="#0a0a0a" roughness={0.5} />
          </mesh>
        </group>
      </group>

      {/* Right Leg */}
      <group ref={rightThigh} position={[0.3, 0, 0]}>
        {/* Thigh */}
        <mesh position={[0, -0.2, 0]} scale={[0.12, 0.3, 0.12]}>
          <sphereGeometry args={[1, 12, 12]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.5} />
        </mesh>
        <group ref={rightShin} position={[0, -0.4, 0]}>
          {/* Shin */}
          <mesh position={[0, -0.15, 0]} scale={[0.1, 0.25, 0.1]}>
            <sphereGeometry args={[1, 12, 12]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.5} />
          </mesh>
          {/* Foot */}
          <mesh position={[0, -0.3, 0.05]} scale={[0.14, 0.08, 0.18]}>
            <sphereGeometry args={[1, 12, 12]} />
            <meshStandardMaterial color="#0a0a0a" roughness={0.5} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

/* ─── Arms ─── */
function CharacterArms({ time }: { time: number }) {
  const leftArm = useRef<THREE.Group>(null);
  const rightArm = useRef<THREE.Group>(null);

  useFrame(() => {
    const swing = Math.sin(time * 2) * 0.1;
    if (leftArm.current) leftArm.current.rotation.x = swing;
    if (rightArm.current) rightArm.current.rotation.x = -swing;
  });

  return (
    <group>
      {/* Left Arm */}
      <group ref={leftArm} position={[-0.5, 0.3, 0]}>
        <mesh position={[0, -0.15, 0]} scale={[0.1, 0.25, 0.1]}>
          <sphereGeometry args={[1, 12, 12]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.5} />
        </mesh>
        <mesh position={[0, -0.32, 0]} scale={[0.12, 0.1, 0.12]}>
          <sphereGeometry args={[1, 12, 12]} />
          <meshStandardMaterial color="#0a0a0a" roughness={0.5} />
        </mesh>
      </group>
      {/* Right Arm */}
      <group ref={rightArm} position={[0.5, 0.3, 0]}>
        <mesh position={[0, -0.15, 0]} scale={[0.1, 0.25, 0.1]}>
          <sphereGeometry args={[1, 12, 12]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.5} />
        </mesh>
        <mesh position={[0, -0.32, 0]} scale={[0.12, 0.1, 0.12]}>
          <sphereGeometry args={[1, 12, 12]} />
          <meshStandardMaterial color="#0a0a0a" roughness={0.5} />
        </mesh>
      </group>
    </group>
  );
}

/* ─── Tail ─── */
function CharacterTail({ time }: { time: number }) {
  const ref = useRef<THREE.Group>(null);
  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y = Math.sin(time * 3) * 0.3;
      ref.current.rotation.z = Math.cos(time * 2.5) * 0.2;
    }
  });
  return (
    <group ref={ref} position={[0, 0.2, -0.5]}>
      <mesh position={[0, 0, -0.15]} scale={[0.08, 0.08, 0.3]}>
        <sphereGeometry args={[1, 12, 12]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.05, -0.35]} scale={[0.1, 0.1, 0.12]}>
        <sphereGeometry args={[1, 12, 12]} />
        <meshStandardMaterial color="#ff3333" emissive="#ff1111" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

/* ─── Halo ─── */
function CharacterHalo() {
  const haloRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (haloRef.current) {
      haloRef.current.rotation.z = state.clock.elapsedTime * 0.5;
      haloRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
    }
  });
  return (
    <mesh ref={haloRef} position={[0, 2.0, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[0.5, 0.03, 8, 32]} />
      <meshStandardMaterial color="#ff4444" emissive="#ff2222" emissiveIntensity={1.5} transparent opacity={0.8} />
    </mesh>
  );
}

/* ─── The Walking Claw — Complete character with movement ─── */
function WalkingClaw() {
  const groupRef = useRef<THREE.Group>(null);
  const timeRef = useRef(0);
  const [walkState] = useState(() => ({
    targetX: 0,
    targetZ: 0,
    isWalking: false,
    walkTimer: 0,
    pauseTimer: 0,
  }));

  useFrame((state) => {
    timeRef.current = state.clock.elapsedTime;
    if (!groupRef.current) return;

    const claw = groupRef.current;
    const s = walkState;
    
    /* State machine: walk → pause → walk */
    if (s.isWalking) {
      /* Move toward target */
      const dx = s.targetX - claw.position.x;
      const dz = s.targetZ - claw.position.z;
      const dist = Math.sqrt(dx * dx + dz * dz);
      
      if (dist < 0.05) {
        s.isWalking = false;
        s.pauseTimer = 2 + Math.random() * 3; /* Pause 2-5 seconds */
      } else {
        const speed = 0.008;
        claw.position.x += (dx / dist) * speed;
        claw.position.z += (dz / dist) * speed;
        claw.rotation.y = Math.atan2(dx, dz) + Math.PI;
      }
    } else {
      /* Count down pause */
      s.pauseTimer -= 0.016; /* ~60fps */
      if (s.pauseTimer <= 0) {
        /* Pick new random target within island bounds */
        s.targetX = (Math.random() - 0.5) * 1.2;
        s.targetZ = (Math.random() - 0.5) * 1.2;
        s.isWalking = true;
      }
    }
  });

  return (
    <group ref={groupRef} scale={0.65} position={[0, 0.2, 0]}>
      <CharacterBody />
      <CharacterHead />
      <CharacterWings time={timeRef.current} />
      <CharacterLegs time={timeRef.current} isWalking={walkState.isWalking} />
      <CharacterArms time={timeRef.current} />
      <CharacterTail time={timeRef.current} />
      <CharacterHalo />
    </group>
  );
}


/* ────────────────────────────────
   MAIN SCENE
   ──────────────────────────────── */
function Scene() {
  const timeRef = useRef(0);
  useFrame((state) => {
    timeRef.current = state.clock.elapsedTime;
  });

  return (
    <group>
      <ambientLight intensity={0.4} color="#e8e0ff" />
      <directionalLight position={[3, 8, 4]} intensity={1.2} color="#fff8f0" />
      <pointLight position={[-3, 4, -3]} intensity={0.8} color="#ff5555" />
      <pointLight position={[3, 2, 3]} intensity={0.5} color="#ff9999" />
      <pointLight position={[0, -1, 0]} intensity={0.3} color="#4444ff" />
      <hemisphereLight args={["#ff5555", "#0a0e1a", 0.3]} />

      <GardenWorld />

      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
        <WalkingClaw />
      </Float>

      <mesh position={[0, 0, -2]} visible={false}>
        <planeGeometry args={[20, 20]} />
        <meshBasicMaterial />
      </mesh>
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
        height: "500px",
        borderRadius: "20px",
        overflow: "hidden",
        marginBottom: "24px",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
      onPointerMove={handlePointerMove}
    >
      <Canvas
        camera={{ position: [0, 1.5, 6], fov: 50 }}
        style={{ background: "#050508" }}
        gl={{ antialias: true, alpha: true }}
      >
        <Scene />
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          maxPolarAngle={Math.PI / 2.2}
          minPolarAngle={Math.PI / 6}
          autoRotate
          autoRotateSpeed={0.5}
          minDistance={3}
          maxDistance={12}
        />
      </Canvas>
    </div>
  );
}
