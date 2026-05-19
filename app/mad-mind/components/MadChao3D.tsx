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
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={baseIntensity} roughness={0.1} metalness={0.3} transparent opacity={0.85} />
    </mesh>
  );
}

function EtherealBridge({ from, to }: { from: [number, number, number]; to: [number, number, number] }) {
  const ref = useRef<THREE.Mesh>(null);
  const mid = [(from[0] + to[0]) / 2, (from[1] + to[1]) / 2 + 0.4, (from[2] + to[2]) / 2] as [number, number, number];
  const dist = Math.sqrt((to[0] - from[0]) ** 2 + (to[2] - from[2]) ** 2);

  useFrame((state) => {
    if (ref.current) {
      ref.current.position.y = mid[1] + Math.sin(state.clock.elapsedTime * 0.7) * 0.1;
    }
  });

  return (
    <group>
      <mesh ref={ref} position={mid} scale={[dist * 0.5, 0.08, 0.15]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#ff4444" emissive="#ff2222" emissiveIntensity={0.8} transparent opacity={0.5} />
      </mesh>
      {[0.2, 0.4, 0.6, 0.8].map((t, i) => (
        <Float key={i} speed={1.5} floatIntensity={0.3} rotationIntensity={0}>
          <mesh position={[from[0] + (to[0] - from[0]) * t, mid[1] + 0.15 + (i % 2) * 0.1, from[2] + (to[2] - from[2]) * t]} scale={0.06}>
            <sphereGeometry args={[1, 8, 8]} />
            <meshStandardMaterial color="#ff5555" emissive="#ff3333" emissiveIntensity={1.5} transparent opacity={0.8} />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

function GardenTree({ position, scale }: { position: [number, number, number]; scale: number }) {
  const swayRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (swayRef.current) {
      swayRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.8 + position[0]) * 0.05;
    }
  });

  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.3, 0]} scale={[0.08, 0.6, 0.08]}>
        <cylinderGeometry args={[1, 1.3, 1, 6]} />
        <meshStandardMaterial color="#3a2a1a" roughness={0.9} />
      </mesh>
      <group ref={swayRef} position={[0, 0.7, 0]}>
        <mesh scale={[0.4, 0.35, 0.4]}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshStandardMaterial color="#1a3a1a" roughness={0.8} />
        </mesh>
        <mesh position={[0.15, 0.15, 0.1]} scale={[0.08, 0.08, 0.08]}>
          <sphereGeometry args={[1, 6, 6]} />
          <meshStandardMaterial color="#ff3333" emissive="#ff1111" emissiveIntensity={0.8} />
        </mesh>
        <mesh position={[-0.1, 0.2, -0.15]} scale={[0.06, 0.06, 0.06]}>
          <sphereGeometry args={[1, 6, 6]} />
          <meshStandardMaterial color="#ff4444" emissive="#ff2222" emissiveIntensity={0.6} />
        </mesh>
      </group>
    </group>
  );
}

function GardenFlower({ position, color }: { position: [number, number, number]; color: string }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 1.5 + position[0]) * 0.15;
      ref.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 2) * 0.1);
    }
  });

  return (
    <group position={position}>
      <mesh position={[0, 0.06, 0]} scale={[0.03, 0.12, 0.03]}>
        <cylinderGeometry args={[1, 1, 1, 6]} />
        <meshStandardMaterial color="#2a4a2a" roughness={0.9} />
      </mesh>
      <mesh ref={ref} position={[0, 0.14, 0]} scale={[0.08, 0.08, 0.08]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} roughness={0.6} />
      </mesh>
    </group>
  );
}

function GardenWater() {
  return (
    <mesh position={[0, -2.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[30, 30, 32, 32]} />
      <meshStandardMaterial color="#0a0a15" roughness={0.05} metalness={0.8} transparent opacity={0.7} />
    </mesh>
  );
}

function GardenParticles() {
  const count = 60;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 12;
      arr[i * 3 + 1] = Math.random() * 6 - 1;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 12;
    }
    return arr;
  }, []);

  const ref = useRef<THREE.Points>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const pos = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 1] += Math.sin(state.clock.elapsedTime * 0.5 + i) * 0.002;
      if (pos[i * 3 + 1] > 5) pos[i * 3 + 1] = -1;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#ff4444" size={0.04} transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

function Fireflies() {
  const count = 8;
  const refs = useRef<Array<THREE.Mesh>>([]);

  useFrame((state) => {
    refs.current.forEach((ref, i) => {
      if (!ref) return;
      const t = state.clock.elapsedTime;
      ref.position.x = Math.sin(t * 0.3 + i * 1.5) * 3;
      ref.position.y = 1.5 + Math.sin(t * 0.5 + i * 2) * 1;
      ref.position.z = Math.cos(t * 0.4 + i * 1.2) * 2.5;
      const scale = 0.06 + Math.sin(t * 3 + i) * 0.03;
      ref.scale.setScalar(scale);
    });
  });

  return (
    <group>
      {Array.from({ length: count }).map((_, i) => (
        <mesh key={i} ref={(el) => { if (el) refs.current[i] = el; }}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshStandardMaterial color={i % 2 === 0 ? "#ff3333" : "#ffffff"} emissive={i % 2 === 0 ? "#ff1111" : "#ffffff"} emissiveIntensity={2} transparent opacity={0.9} />
        </mesh>
      ))}
    </group>
  );
}

function StarField() {
  const count = 100;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 15 + Math.random() * 20;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.cos(phi) + 5;
      arr[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    return arr;
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#ffffff" size={0.06} transparent opacity={0.8} sizeAttenuation />
    </points>
  );
}

/* ═══════════════════════════════════════════════════════════
   $MAD MASCOT CHARACTER
   Red angry character with thick brows, stubby limbs
   ═══════════════════════════════════════════════════════════ */

/* ─── Head: Red sphere with angry face ─── */
function CharacterHead({ excited }: { excited: boolean }) {
  const headRef = useRef<THREE.Group>(null);
  const browLeftRef = useRef<THREE.Mesh>(null);
  const browRightRef = useRef<THREE.Mesh>(null);
  const mouthRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    /* Head tracks mouse with clamped limits */
    if (headRef.current) {
      headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, MOUSE.x * 0.5, 0.08);
      headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, -MOUSE.y * 0.3, 0.08);
    }
    /* Angry brows pulse when excited */
    if (excited) {
      const bounce = Math.sin(Date.now() / 100) * 0.05;
      if (browLeftRef.current) browLeftRef.current.position.y = 0.18 + bounce;
      if (browRightRef.current) browRightRef.current.position.y = 0.18 + bounce;
    }
  });

  return (
    <group ref={headRef} position={[0, 0.75, 0]}>
      {/* Main head — red sphere */}
      <mesh>
        <sphereGeometry args={[0.38, 24, 24]} />
        <meshStandardMaterial color="#cc0000" roughness={0.3} metalness={0.1} />
      </mesh>
      {/* Subtle highlight for 3D feel */}
      <mesh position={[0.1, 0.15, 0.25]} scale={0.15}>
        <sphereGeometry args={[1, 12, 12]} />
        <meshStandardMaterial color="#ff3333" transparent opacity={0.3} roughness={0.1} />
      </mesh>

      {/* Eyes — white sclera */}
      <mesh position={[-0.12, 0.05, 0.28]} scale={[0.1, 0.12, 0.06]}>
        <sphereGeometry args={[1, 12, 12]} />
        <meshStandardMaterial color="#ffffff" roughness={0.2} />
      </mesh>
      <mesh position={[0.12, 0.05, 0.28]} scale={[0.1, 0.12, 0.06]}>
        <sphereGeometry args={[1, 12, 12]} />
        <meshStandardMaterial color="#ffffff" roughness={0.2} />
      </mesh>
      {/* Pupils — black, angry (looking slightly inward) */}
      <mesh position={[-0.1, 0.05, 0.33]} scale={[0.045, 0.055, 0.03]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshStandardMaterial color="#000000" roughness={0.1} />
      </mesh>
      <mesh position={[0.1, 0.05, 0.33]} scale={[0.045, 0.055, 0.03]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshStandardMaterial color="#000000" roughness={0.1} />
      </mesh>

      {/* Angry eyebrows — thick black tilted inward */}
      <mesh ref={browLeftRef} position={[-0.14, 0.18, 0.28]} rotation={[0, 0, 0.35]} scale={[0.12, 0.04, 0.06]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#111111" roughness={0.5} />
      </mesh>
      <mesh ref={browRightRef} position={[0.14, 0.18, 0.28]} rotation={[0, 0, -0.35]} scale={[0.12, 0.04, 0.06]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#111111" roughness={0.5} />
      </mesh>

      {/* Frown — small downward curved mouth */}
      <mesh ref={mouthRef} position={[0, -0.08, 0.3]} rotation={[0.1, 0, 0]} scale={[0.1, 0.025, 0.04]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#330000" roughness={0.5} />
      </mesh>

      {/* Nose — tiny bump */}
      <mesh position={[0, 0, 0.35]} scale={[0.04, 0.03, 0.04]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshStandardMaterial color="#aa0000" roughness={0.4} />
      </mesh>

      {/* Ear bumps */}
      <mesh position={[-0.32, 0.1, 0]} scale={[0.08, 0.1, 0.06]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshStandardMaterial color="#cc0000" roughness={0.3} />
      </mesh>
      <mesh position={[0.32, 0.1, 0]} scale={[0.08, 0.1, 0.06]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshStandardMaterial color="#cc0000" roughness={0.3} />
      </mesh>
    </group>
  );
}

/* ─── Body: Compact red torso ─── */
function CharacterBody({ isSitting }: { isSitting: boolean }) {
  return (
    <group position={[0, isSitting ? 0.15 : 0.35, 0]}>
      {/* Main body */}
      <mesh scale={[0.28, 0.35, 0.25]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial color="#b30000" roughness={0.4} metalness={0.05} />
      </mesh>
      {/* Belly highlight */}
      <mesh position={[0, -0.05, 0.18]} scale={[0.15, 0.2, 0.08]}>
        <sphereGeometry args={[1, 12, 12]} />
        <meshStandardMaterial color="#cc2222" transparent opacity={0.5} roughness={0.3} />
      </mesh>
      {/* $MAD emblem on chest */}
      <mesh position={[0, 0.05, 0.22]} scale={[0.08, 0.06, 0.02]} rotation={[0, 0, 0.1]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#ffcc00" emissive="#ffaa00" emissiveIntensity={0.3} roughness={0.3} />
      </mesh>
    </group>
  );
}

/* ─── Legs: Stubby red with dark boots ─── */
function CharacterLegs({ time, isWalking, isSitting }: { time: number; isWalking: boolean; isSitting: boolean }) {
  const leftThigh = useRef<THREE.Group>(null);
  const rightThigh = useRef<THREE.Group>(null);
  const leftShin = useRef<THREE.Group>(null);
  const rightShin = useRef<THREE.Group>(null);

  useFrame(() => {
    if (isSitting) {
      if (leftThigh.current) { leftThigh.current.rotation.x = -1.0; leftThigh.current.position.y = 0.1; }
      if (rightThigh.current) { rightThigh.current.rotation.x = -1.0; rightThigh.current.position.y = 0.1; }
      if (leftShin.current) { leftShin.current.rotation.x = 1.2; leftShin.current.position.z = 0.1; }
      if (rightShin.current) { rightShin.current.rotation.x = 1.2; rightShin.current.position.z = 0.1; }
      return;
    }

    if (!isWalking) {
      if (leftThigh.current) { leftThigh.current.rotation.x = 0; leftThigh.current.position.y = 0; }
      if (rightThigh.current) { rightThigh.current.rotation.x = 0; rightThigh.current.position.y = 0; }
      if (leftShin.current) { leftShin.current.rotation.x = 0.05; leftShin.current.position.z = 0; }
      if (rightShin.current) { rightShin.current.rotation.x = 0.05; rightShin.current.position.z = 0; }
      return;
    }

    const walkSpeed = 5;
    const stride = 0.35;
    const lPhase = Math.sin(time * walkSpeed);
    if (leftThigh.current) leftThigh.current.rotation.x = lPhase * stride;
    if (leftShin.current) leftShin.current.rotation.x = Math.max(0, -lPhase * stride * 0.7) + 0.05;
    const rPhase = Math.sin(time * walkSpeed + Math.PI);
    if (rightThigh.current) rightThigh.current.rotation.x = rPhase * stride;
    if (rightShin.current) rightShin.current.rotation.x = Math.max(0, -rPhase * stride * 0.7) + 0.05;
  });

  return (
    <group>
      {/* Left leg */}
      <group ref={leftThigh} position={[-0.18, 0.15, 0]}>
        <mesh position={[0, -0.12, 0]} scale={[0.1, 0.22, 0.1]}>
          <capsuleGeometry args={[1, 1, 4, 8]} />
          <meshStandardMaterial color="#cc0000" roughness={0.5} />
        </mesh>
        <group ref={leftShin} position={[0, -0.25, 0]}>
          <mesh position={[0, -0.1, 0]} scale={[0.09, 0.18, 0.09]}>
            <capsuleGeometry args={[1, 1, 4, 8]} />
            <meshStandardMaterial color="#cc0000" roughness={0.5} />
          </mesh>
          {/* Boot */}
          <mesh position={[0, -0.22, 0.02]} scale={[0.12, 0.08, 0.14]}>
            <sphereGeometry args={[1, 8, 8]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.6} />
          </mesh>
        </group>
      </group>
      {/* Right leg */}
      <group ref={rightThigh} position={[0.18, 0.15, 0]}>
        <mesh position={[0, -0.12, 0]} scale={[0.1, 0.22, 0.1]}>
          <capsuleGeometry args={[1, 1, 4, 8]} />
          <meshStandardMaterial color="#cc0000" roughness={0.5} />
        </mesh>
        <group ref={rightShin} position={[0, -0.25, 0]}>
          <mesh position={[0, -0.1, 0]} scale={[0.09, 0.18, 0.09]}>
            <capsuleGeometry args={[1, 1, 4, 8]} />
            <meshStandardMaterial color="#cc0000" roughness={0.5} />
          </mesh>
          {/* Boot */}
          <mesh position={[0, -0.22, 0.02]} scale={[0.12, 0.08, 0.14]}>
            <sphereGeometry args={[1, 8, 8]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.6} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

/* ─── Arms: Stubby red with dark gloves ─── */
function CharacterArms({ time, isSitting, excited }: { time: number; isSitting: boolean; excited: boolean }) {
  const leftArm = useRef<THREE.Group>(null);
  const rightArm = useRef<THREE.Group>(null);

  useFrame(() => {
    if (isSitting) {
      if (leftArm.current) { leftArm.current.rotation.z = 0.4; leftArm.current.position.y = 0.05; }
      if (rightArm.current) { rightArm.current.rotation.z = -0.4; rightArm.current.position.y = 0.05; }
      return;
    }
    if (excited) {
      /* Arms up when excited! */
      if (leftArm.current) { leftArm.current.rotation.z = 2.5 + Math.sin(time * 15) * 0.3; leftArm.current.position.y = 0; }
      if (rightArm.current) { rightArm.current.rotation.z = -2.5 - Math.sin(time * 15) * 0.3; rightArm.current.position.y = 0; }
      return;
    }
    const swing = Math.sin(time * 2) * 0.08;
    if (leftArm.current) { leftArm.current.rotation.x = swing; leftArm.current.rotation.z = 0.15; leftArm.current.position.y = 0; }
    if (rightArm.current) { rightArm.current.rotation.x = -swing; rightArm.current.rotation.z = -0.15; rightArm.current.position.y = 0; }
  });

  return (
    <group>
      {/* Left arm */}
      <group ref={leftArm} position={[-0.32, 0.4, 0]}>
        <mesh position={[0, -0.12, 0]} scale={[0.09, 0.2, 0.09]}>
          <capsuleGeometry args={[1, 1, 4, 8]} />
          <meshStandardMaterial color="#cc0000" roughness={0.5} />
        </mesh>
        {/* Glove/hand */}
        <mesh position={[0, -0.25, 0]} scale={[0.11, 0.09, 0.11]}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.5} />
        </mesh>
      </group>
      {/* Right arm */}
      <group ref={rightArm} position={[0.32, 0.4, 0]}>
        <mesh position={[0, -0.12, 0]} scale={[0.09, 0.2, 0.09]}>
          <capsuleGeometry args={[1, 1, 4, 8]} />
          <meshStandardMaterial color="#cc0000" roughness={0.5} />
        </mesh>
        {/* Glove/hand */}
        <mesh position={[0, -0.25, 0]} scale={[0.11, 0.09, 0.11]}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.5} />
        </mesh>
      </group>
    </group>
  );
}

/* ─── Backpack / Gear — small detail on back ─── */
function CharacterBackpack() {
  return (
    <group position={[0, 0.4, -0.22]}>
      <mesh scale={[0.22, 0.18, 0.1]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.6} metalness={0.2} />
      </mesh>
      {/* Straps */}
      <mesh position={[-0.1, 0, 0.06]} scale={[0.04, 0.2, 0.02]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.7} />
      </mesh>
      <mesh position={[0.1, 0, 0.06]} scale={[0.04, 0.2, 0.02]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.7} />
      </mesh>
      {/* Small red detail */}
      <mesh position={[0, 0.05, -0.06]} scale={[0.08, 0.06, 0.02]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

/* ─── Footstep dust particles ─── */
function FootstepDust({ position }: { position: [number, number, number] }) {
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
  const [dustParticles, setDustParticles] = useState<Array<{ id: number; pos: [number, number, number] }>>([]);
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
          const footX = claw.position.x + (isLeft ? -0.18 : 0.18) * Math.cos(claw.rotation.y);
          const footZ = claw.position.z + (isLeft ? -0.18 : 0.18) * Math.sin(claw.rotation.y);
          const id = ++dustId.current;
          setDustParticles(prev => [...prev.slice(-10), { id, pos: [footX, 0.05, footZ] }]);
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
        <CharacterLegs time={timeRef.current} isWalking={walkState.isWalking} isSitting={walkState.isSitting} />
        <CharacterArms time={timeRef.current} isSitting={walkState.isSitting} excited={isExcited} />
        <CharacterBackpack />
      </group>
      {dustParticles.map(d => (
        <FootstepDust key={d.id} position={d.pos} />
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
