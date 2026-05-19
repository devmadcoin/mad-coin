"use client";

import { useState, useRef, useMemo, useCallback, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Float } from "@react-three/drei";
import * as THREE from "three";

/* ═══════════════════════════════════════════════════════════
   $MAD CHAO GARDEN — Living World
   ═══════════════════════════════════════════════════════════ */

const MOUSE = { x: 0, y: 0 };

/* ═══════════════════════════════════════════════════════════
   GARDEN ENVIRONMENT
   ═══════════════════════════════════════════════════════════ */
function GardenWorld({ clawPosition }: { clawPosition: React.MutableRefObject<THREE.Vector3> }) {
  return (
    <group>
      <FloatingIsland position={[0, -0.3, 0]} scale={1.2} isMain clawPosition={clawPosition} />
      <FloatingIsland position={[-3.5, -0.8, -2]} scale={0.7} clawPosition={clawPosition} />
      <FloatingIsland position={[3.2, -0.5, -1.5]} scale={0.9} clawPosition={clawPosition} />
      <FloatingIsland position={[-1.5, -1.2, 3]} scale={0.6} clawPosition={clawPosition} />
      <FloatingIsland position={[2.5, -0.6, 2.5]} scale={0.5} clawPosition={clawPosition} />
      <EtherealBridge from={[0, -0.3, 0]} to={[-3.5, -0.8, -2]} />
      <EtherealBridge from={[0, -0.3, 0]} to={[3.2, -0.5, -1.5]} />
      <GardenWater />
      <GardenParticles />
      <Fireflies />
      <StarField />
    </group>
  );
}

/* ─── Floating island with reactive crystals ─── */
function FloatingIsland({ position, scale, isMain = false, clawPosition }: { position: [number, number, number]; scale: number; isMain?: boolean; clawPosition?: React.MutableRefObject<THREE.Vector3> }) {
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
      <ReactiveCrystal position={[0.7, 0.3, 0.4]} scale={0.15} color="#ff4444" clawPosition={clawPosition} />
      <ReactiveCrystal position={[-0.6, 0.25, -0.3]} scale={0.1} color="#ff6666" clawPosition={clawPosition} />
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

/* ─── Crystal that glows brighter when Claw is near ─── */
function ReactiveCrystal({ position, scale, color, clawPosition }: { position: [number, number, number]; scale: number; color: string; clawPosition?: React.MutableRefObject<THREE.Vector3> }) {
  const ref = useRef<THREE.Mesh>(null);
  const [baseIntensity] = useState(0.8);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.5;
    ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 1.5) * 0.05;

    if (clawPosition?.current) {
      const dx = clawPosition.current.x - position[0];
      const dy = clawPosition.current.y - position[1];
      const dz = clawPosition.current.z - position[2];
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
      const proximity = Math.max(0, 1 - dist / 2.5);
      const intensity = baseIntensity + proximity * 2;
      (ref.current.material as THREE.MeshStandardMaterial).emissiveIntensity = intensity;
    }
  });

  return (
    <mesh ref={ref} position={position} scale={scale}>
      <octahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={baseIntensity} roughness={0.2} metalness={0.5} />
    </mesh>
  );
}

/* ─── Ethereal bridge ─── */
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

/* ─── Garden tree ─── */
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

/* ─── Garden flower ─── */
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

/* ─── Water plane ─── */
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

/* ─── Floating particles ─── */
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

/* ─── Fireflies / Spirits ─── */
function Fireflies() {
  const groupRef = useRef<THREE.Group>(null);
  const fireflies = useMemo(() => Array.from({ length: 8 }, () => ({
    position: [(Math.random() - 0.5) * 8, 0.5 + Math.random() * 2, (Math.random() - 0.5) * 8] as [number, number, number],
    speed: 0.5 + Math.random() * 1,
    radius: 0.5 + Math.random() * 1.5,
    offset: Math.random() * Math.PI * 2,
    color: ["#ff5555", "#ff7777", "#ffaaaa", "#ffddaa"][Math.floor(Math.random() * 4)],
  })), []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.children.forEach((child, i) => {
        const f = fireflies[i];
        const t = state.clock.elapsedTime * f.speed + f.offset;
        child.position.x = f.position[0] + Math.sin(t) * f.radius;
        child.position.z = f.position[2] + Math.cos(t * 0.7) * f.radius;
        child.position.y = f.position[1] + Math.sin(t * 1.3) * 0.3;
        const scale = 1 + Math.sin(t * 3) * 0.3;
        child.scale.setScalar(scale * 0.04);
      });
    }
  });

  return (
    <group ref={groupRef}>
      {fireflies.map((f, i) => (
        <mesh key={i} position={f.position} scale={0.04}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshStandardMaterial color={f.color} emissive={f.color} emissiveIntensity={2} transparent opacity={0.9} />
        </mesh>
      ))}
    </group>
  );
}

/* ─── Star field ─── */
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
   MAD CLAW CHARACTER — Living, Walking, Reacting
   ═══════════════════════════════════════════════════════════ */

/* ─── Body ─── */
function CharacterBody({ isSitting }: { isSitting: boolean }) {
  return (
    <mesh position={[0, isSitting ? 0.2 : 0.35, 0]} scale={[0.9, isSitting ? 0.6 : 0.75, 0.85]}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial color="#0a0a0a" roughness={0.4} metalness={0.15} />
    </mesh>
  );
}

/* ─── Head ─── */
function CharacterHead({ excited }: { excited: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const baseY = 1.1;

  useFrame((state) => {
    if (!groupRef.current) return;
    const bounce = excited ? Math.sin(state.clock.elapsedTime * 12) * 0.15 : Math.sin(state.clock.elapsedTime * 1.5) * 0.03;
    groupRef.current.position.y = baseY + bounce;
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, MOUSE.x * 0.6, 0.04);
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -MOUSE.y * 0.3, 0.04);
  });

  return (
    <group ref={groupRef} position={[0, baseY, 0]}>
      <mesh scale={[0.85, 0.82, 0.82]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#111111" roughness={0.35} metalness={0.2} />
      </mesh>
      <mesh position={[0, 0.35, 0.72]} rotation={[0.1, 0, 0]} scale={[0.25, 0.1, 0.08]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial color="#ff3333" emissive="#ff1111" emissiveIntensity={0.8} roughness={0.2} />
      </mesh>
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

/* ─── Wings ─── */
function CharacterWings({ time, excited }: { time: number; excited: boolean }) {
  const leftWing = useRef<THREE.Group>(null);
  const rightWing = useRef<THREE.Group>(null);

  useFrame(() => {
    const speed = excited ? 12 : 4;
    const flap = Math.sin(time * speed) * (excited ? 0.5 : 0.25);
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

/* ─── Legs with walking + sitting ─── */
function CharacterLegs({ time, isWalking, isSitting }: { time: number; isWalking: boolean; isSitting: boolean }) {
  const leftThigh = useRef<THREE.Group>(null);
  const rightThigh = useRef<THREE.Group>(null);
  const leftShin = useRef<THREE.Group>(null);
  const rightShin = useRef<THREE.Group>(null);

  useFrame(() => {
    if (isSitting) {
      if (leftThigh.current) { leftThigh.current.rotation.x = -1.2; leftThigh.current.position.y = 0.15; }
      if (rightThigh.current) { rightThigh.current.rotation.x = -1.2; rightThigh.current.position.y = 0.15; }
      if (leftShin.current) { leftShin.current.rotation.x = 1.5; leftShin.current.position.z = 0.15; }
      if (rightShin.current) { rightShin.current.rotation.x = 1.5; rightShin.current.position.z = 0.15; }
      return;
    }

    if (!isWalking) {
      if (leftThigh.current) { leftThigh.current.rotation.x = 0; leftThigh.current.position.y = 0; }
      if (rightThigh.current) { rightThigh.current.rotation.x = 0; rightThigh.current.position.y = 0; }
      if (leftShin.current) { leftShin.current.rotation.x = 0.1; leftShin.current.position.z = 0; }
      if (rightShin.current) { rightShin.current.rotation.x = 0.1; rightShin.current.position.z = 0; }
      return;
    }

    const walkSpeed = 5;
    const stride = 0.4;
    const lPhase = Math.sin(time * walkSpeed);
    if (leftThigh.current) leftThigh.current.rotation.x = lPhase * stride;
    if (leftShin.current) leftShin.current.rotation.x = Math.max(0, -lPhase * stride * 0.8) + 0.1;
    const rPhase = Math.sin(time * walkSpeed + Math.PI);
    if (rightThigh.current) rightThigh.current.rotation.x = rPhase * stride;
    if (rightShin.current) rightShin.current.rotation.x = Math.max(0, -rPhase * stride * 0.8) + 0.1;
  });

  return (
    <group>
      <group ref={leftThigh} position={[-0.3, 0, 0]}>
        <mesh position={[0, -0.2, 0]} scale={[0.12, 0.3, 0.12]}>
          <sphereGeometry args={[1, 12, 12]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.5} />
        </mesh>
        <group ref={leftShin} position={[0, -0.4, 0]}>
          <mesh position={[0, -0.15, 0]} scale={[0.1, 0.25, 0.1]}>
            <sphereGeometry args={[1, 12, 12]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.5} />
          </mesh>
          <mesh position={[0, -0.3, 0.05]} scale={[0.14, 0.08, 0.18]}>
            <sphereGeometry args={[1, 12, 12]} />
            <meshStandardMaterial color="#0a0a0a" roughness={0.5} />
          </mesh>
        </group>
      </group>
      <group ref={rightThigh} position={[0.3, 0, 0]}>
        <mesh position={[0, -0.2, 0]} scale={[0.12, 0.3, 0.12]}>
          <sphereGeometry args={[1, 12, 12]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.5} />
        </mesh>
        <group ref={rightShin} position={[0, -0.4, 0]}>
          <mesh position={[0, -0.15, 0]} scale={[0.1, 0.25, 0.1]}>
            <sphereGeometry args={[1, 12, 12]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.5} />
          </mesh>
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
function CharacterArms({ time, isSitting }: { time: number; isSitting: boolean }) {
  const leftArm = useRef<THREE.Group>(null);
  const rightArm = useRef<THREE.Group>(null);

  useFrame(() => {
    if (isSitting) {
      if (leftArm.current) { leftArm.current.rotation.z = 0.5; leftArm.current.position.y = 0.1; }
      if (rightArm.current) { rightArm.current.rotation.z = -0.5; rightArm.current.position.y = 0.1; }
      return;
    }
    const swing = Math.sin(time * 2) * 0.1;
    if (leftArm.current) { leftArm.current.rotation.x = swing; leftArm.current.rotation.z = 0; leftArm.current.position.y = 0; }
    if (rightArm.current) { rightArm.current.rotation.x = -swing; rightArm.current.rotation.z = 0; rightArm.current.position.y = 0; }
  });

  return (
    <group>
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
function CharacterTail({ time, excited }: { time: number; excited: boolean }) {
  const ref = useRef<THREE.Group>(null);
  useFrame(() => {
    if (!ref.current) return;
    const speed = excited ? 8 : 2.5;
    ref.current.rotation.y = Math.sin(time * speed) * 0.4;
    ref.current.rotation.z = Math.cos(time * speed * 0.8) * 0.2;
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

/* ─── Footstep dust particles ─── */
function FootstepDust({ position, isLeft }: { position: [number, number, number]; isLeft: boolean }) {
  const ref = useRef<THREE.Mesh>(null);
  const [life] = useState(() => ({ t: 0 }));

  useFrame((_, delta) => {
    if (!ref.current) return;
    life.t += delta;
    const progress = Math.min(life.t / 0.6, 1);
    ref.current.position.y = position[1] + progress * 0.3;
    ref.current.scale.setScalar(0.1 + progress * 0.15);
    (ref.current.material as THREE.MeshStandardMaterial).opacity = 1 - progress;
  });

  return (
    <mesh ref={ref} position={position} scale={0.1}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshStandardMaterial color="#8a7a6a" transparent opacity={0.6} />
    </mesh>
  );
}

/* ═══════════════════════════════════════════════════════════
   THE WALKING CLAW — Full state machine
   ═══════════════════════════════════════════════════════════ */

export const CLAW_STATE = {
  excited: false,
  setExcited: (v: boolean) => { CLAW_STATE.excited = v; },
};

function WalkingClaw({ positionRef }: { positionRef: React.MutableRefObject<THREE.Vector3> }) {
  const groupRef = useRef<THREE.Group>(null);
  const timeRef = useRef(0);
  const [walkState] = useState(() => ({
    targetX: 0,
    targetZ: 0,
    isWalking: false,
    pauseTimer: 0,
    idleTimer: 0,
    isSitting: false,
    excitedTimer: 0,
  }));
  const [dustParticles, setDustParticles] = useState<Array<{ id: number; pos: [number, number, number]; isLeft: boolean }>>([]);
  const dustId = useRef(0);
  const lastStepPhase = useRef(0);

  /* Listen for chat reaction events */
  useEffect(() => {
    const handleReact = () => {
      walkState.excitedTimer = 1.5;
    };
    window.addEventListener("madclaw-react", handleReact);
    return () => window.removeEventListener("madclaw-react", handleReact);
  }, [walkState]);

  useFrame((state, delta) => {
    timeRef.current = state.clock.elapsedTime;
    if (!groupRef.current) return;

    const claw = groupRef.current;
    const s = walkState;

    /* Excited state from chat */
    if (s.excitedTimer > 0) {
      s.excitedTimer -= delta;
      CLAW_STATE.setExcited(true);
    } else {
      CLAW_STATE.setExcited(false);
    }

    /* Update position ref for crystal proximity */
    positionRef.current.copy(claw.position);

    /* State machine */
    if (s.excitedTimer > 0) {
      /* Excited bounce in place */
      claw.position.y = 0.2 + Math.sin(state.clock.elapsedTime * 15) * 0.2;
      s.isWalking = false;
      s.isSitting = false;
      s.idleTimer = 0;
      return;
    }

    if (s.isWalking) {
      claw.position.y = 0.2;
      s.isSitting = false;
      s.idleTimer = 0;

      const dx = s.targetX - claw.position.x;
      const dz = s.targetZ - claw.position.z;
      const dist = Math.sqrt(dx * dx + dz * dz);

      if (dist < 0.05) {
        s.isWalking = false;
        s.pauseTimer = 2 + Math.random() * 3;
      } else {
        const speed = 0.008;
        claw.position.x += (dx / dist) * speed;
        claw.position.z += (dz / dist) * speed;
        claw.rotation.y = Math.atan2(dx, dz) + Math.PI;

        /* Footstep dust */
        const stepPhase = Math.sin(timeRef.current * 5);
        if (stepPhase * lastStepPhase.current < 0) {
          /* Zero crossing = foot hit ground */
          const isLeft = stepPhase > 0;
          const footX = claw.position.x + (isLeft ? -0.2 : 0.2) * Math.cos(claw.rotation.y);
          const footZ = claw.position.z + (isLeft ? -0.2 : 0.2) * Math.sin(claw.rotation.y);
          const id = ++dustId.current;
          setDustParticles(prev => [...prev.slice(-10), { id, pos: [footX, 0.05, footZ], isLeft }]);
          /* Auto-remove after animation */
          setTimeout(() => {
            setDustParticles(prev => prev.filter(d => d.id !== id));
          }, 600);
        }
        lastStepPhase.current = stepPhase;
      }
    } else {
      /* Paused / idle */
      claw.position.y = 0.2 + Math.sin(state.clock.elapsedTime * 1) * 0.02;
      s.pauseTimer -= delta;
      s.idleTimer += delta;

      if (s.pauseTimer <= 0) {
        s.targetX = (Math.random() - 0.5) * 1.2;
        s.targetZ = (Math.random() - 0.5) * 1.2;
        s.isWalking = true;
        s.idleTimer = 0;
        s.isSitting = false;
      }

      /* Sit after 8 seconds of idle */
      if (s.idleTimer > 8 && !s.isSitting) {
        s.isSitting = true;
      }
    }
  });

  const isExcited = CLAW_STATE.excited;

  return (
    <group>
      <group ref={groupRef} scale={0.65} position={[0, 0.2, 0]}>
        <CharacterBody isSitting={walkState.isSitting} />
        <CharacterHead excited={isExcited} />
        <CharacterWings time={timeRef.current} excited={isExcited} />
        <CharacterLegs time={timeRef.current} isWalking={walkState.isWalking} isSitting={walkState.isSitting} />
        <CharacterArms time={timeRef.current} isSitting={walkState.isSitting} />
        <CharacterTail time={timeRef.current} excited={isExcited} />
        <CharacterHalo />
      </group>
      {dustParticles.map(d => (
        <FootstepDust key={d.id} position={d.pos} isLeft={d.isLeft} />
      ))}
    </group>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN SCENE
   ═══════════════════════════════════════════════════════════ */
function Scene() {
  const timeRef = useRef(0);
  const clawPosition = useRef(new THREE.Vector3());

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

      <GardenWorld clawPosition={clawPosition} />

      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
        <WalkingClaw positionRef={clawPosition} />
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

export function triggerClawReaction() {
  window.dispatchEvent(new CustomEvent("madclaw-react"));
}

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
