"use client";

import { useState, useRef, useMemo, useCallback, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float } from "@react-three/drei";
import * as THREE from "three";

/* ═══════════════════════════════════════════════════════════
   $MAD VOID — Dark world for the red mascot
   ═══════════════════════════════════════════════════════════ */

const MOUSE = { x: 0, y: 0 };

/* ═══════════════════════════════════════════════════════════
   ENVIRONMENT
   ═══════════════════════════════════════════════════════════ */

function VoidWorld({ clawPosition }: { clawPosition: React.MutableRefObject<THREE.Vector3> }) {
  return (
    <group>
      <DarkPlatform />
      <EnergyGrid />
      <FloatingShards count={12} clawPosition={clawPosition} />
      <RingStructure position={[0, 2.5, 0]} radius={4} />
      <RingStructure position={[0, -1, 0]} radius={6} rotSpeed={0.3} />
      <AmbientParticles />
      <StarField />
      <RedFog />
    </group>
  );
}

/* ─── Dark obsidian platform ─── */
function DarkPlatform() {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (meshRef.current) {
      const mat = meshRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.3 + Math.sin(state.clock.elapsedTime * 0.8) * 0.1;
    }
  });

  return (
    <group>
      {/* Main disk */}
      <mesh ref={meshRef} position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[2.5, 64]} />
        <meshStandardMaterial
          color="#0a0a0a"
          roughness={0.05}
          metalness={0.95}
          emissive="#220000"
          emissiveIntensity={0.3}
        />
      </mesh>
      {/* Red ring edge */}
      <mesh position={[0, -0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.48, 2.52, 128]} />
        <meshStandardMaterial
          color="#ff0000"
          emissive="#ff0000"
          emissiveIntensity={2}
          transparent
          opacity={0.8}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Inner subtle ring */}
      <mesh position={[0, -0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.5, 1.52, 128]} />
        <meshStandardMaterial
          color="#ff3333"
          emissive="#ff1111"
          emissiveIntensity={1}
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

/* ─── Red energy grid on floor ─── */
function EnergyGrid() {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.children.forEach((line, i) => {
      const mat = (line as THREE.Mesh).material as THREE.MeshStandardMaterial;
      mat.opacity = 0.1 + Math.sin(state.clock.elapsedTime * 1.5 + i * 0.5) * 0.08;
    });
  });

  const lines = [];
  for (let i = -4; i <= 4; i++) {
    lines.push(
      <mesh key={`x${i}`} position={[i * 0.6, -0.02, 0]} scale={[0.01, 1, 5]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={1} transparent opacity={0.15} />
      </mesh>
    );
    lines.push(
      <mesh key={`z${i}`} position={[0, -0.02, i * 0.6]} scale={[5, 1, 0.01]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={1} transparent opacity={0.15} />
      </mesh>
    );
  }

  return <group ref={ref}>{lines}</group>;
}

/* ─── Floating dark crystal shards ─── */
function FloatingShards({ count, clawPosition }: { count: number; clawPosition: React.MutableRefObject<THREE.Vector3> }) {
  const shards = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      position: [
        (Math.random() - 0.5) * 10,
        Math.random() * 4 - 0.5,
        (Math.random() - 0.5) * 10,
      ] as [number, number, number],
      scale: 0.05 + Math.random() * 0.15,
      speed: 0.2 + Math.random() * 0.5,
      color: ["#ff0000", "#ff3333", "#ff5555", "#aa0000"][Math.floor(Math.random() * 4)],
    }));
  }, []);

  return (
    <group>
      {shards.map((shard) => (
        <Float key={shard.id} speed={shard.speed} floatIntensity={0.4} rotationIntensity={0.8}>
          <ShardMesh {...shard} clawPosition={clawPosition} />
        </Float>
      ))}
    </group>
  );
}

function ShardMesh({
  position, scale, color, id, clawPosition,
}: {
  position: [number, number, number];
  scale: number;
  color: string;
  id: number;
  clawPosition: React.MutableRefObject<THREE.Vector3>;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const [baseIntensity] = useState(0.5 + Math.random() * 1);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.x += 0.005;
    ref.current.rotation.y += 0.008;

    /* Proximity glow */
    if (clawPosition?.current) {
      const dx = clawPosition.current.x - position[0];
      const dy = clawPosition.current.y - position[1];
      const dz = clawPosition.current.z - position[2];
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
      const proximity = Math.max(0, 1 - dist / 3);
      const intensity = baseIntensity + proximity * 3;
      (ref.current.material as THREE.MeshStandardMaterial).emissiveIntensity = intensity;
    }
  });

  return (
    <mesh ref={ref} position={position} scale={scale}>
      <octahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={baseIntensity}
        roughness={0.1}
        metalness={0.5}
        transparent
        opacity={0.85}
      />
    </mesh>
  );
}

/* ─── Ring structure ─── */
function RingStructure({
  position, radius, rotSpeed = 0.2,
}: {
  position: [number, number, number];
  radius: number;
  rotSpeed?: number;
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.elapsedTime * rotSpeed * 0.3;
      ref.current.rotation.z = state.clock.elapsedTime * rotSpeed * 0.2;
    }
  });

  return (
    <group ref={ref} position={position}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius, 0.03, 8, 64]} />
        <meshStandardMaterial
          color="#ff0000"
          emissive="#ff0000"
          emissiveIntensity={1.5}
          transparent
          opacity={0.4}
        />
      </mesh>
      {/* Small orbiting nodes */}
      {[0, Math.PI / 2, Math.PI, -Math.PI / 2].map((angle, i) => (
        <mesh
          key={i}
          position={[Math.cos(angle) * radius, 0, Math.sin(angle) * radius]}
          scale={0.06}
        >
          <sphereGeometry args={[1, 8, 8]} />
          <meshStandardMaterial
            color="#ff3333"
            emissive="#ff1111"
            emissiveIntensity={2}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ─── Ambient red particles ─── */
function AmbientParticles() {
  const count = 80;
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
      <pointsMaterial color="#ff3333" size={0.03} transparent opacity={0.5} sizeAttenuation />
    </points>
  );
}

/* ─── Star field ─── */
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
      <pointsMaterial color="#ffffff" size={0.05} transparent opacity={0.7} sizeAttenuation />
    </points>
  );
}

/* ─── Subtle red fog plane ─── */
function RedFog() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <mesh ref={ref} position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[30, 30]} />
      <meshStandardMaterial
        color="#330000"
        emissive="#ff0000"
        emissiveIntensity={0.15}
        transparent
        opacity={0.3}
        roughness={1}
      />
    </mesh>
  );
}

/* ═══════════════════════════════════════════════════════════
   $MAD MASCOT CHARACTER
   ═══════════════════════════════════════════════════════════ */

function CharacterHead({ excited }: { excited: boolean }) {
  const headRef = useRef<THREE.Group>(null);
  const browLeftRef = useRef<THREE.Mesh>(null);
  const browRightRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (headRef.current) {
      headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, MOUSE.x * 0.5, 0.08);
      headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, -MOUSE.y * 0.3, 0.08);
    }
    if (excited) {
      const bounce = Math.sin(Date.now() / 100) * 0.05;
      if (browLeftRef.current) browLeftRef.current.position.y = 0.18 + bounce;
      if (browRightRef.current) browRightRef.current.position.y = 0.18 + bounce;
    }
  });

  return (
    <group ref={headRef} position={[0, 0.75, 0]}>
      <mesh>
        <sphereGeometry args={[0.38, 24, 24]} />
        <meshStandardMaterial color="#cc0000" roughness={0.3} metalness={0.1} />
      </mesh>
      <mesh position={[0.1, 0.15, 0.25]} scale={0.15}>
        <sphereGeometry args={[1, 12, 12]} />
        <meshStandardMaterial color="#ff3333" transparent opacity={0.3} roughness={0.1} />
      </mesh>
      {/* Eyes */}
      <mesh position={[-0.12, 0.05, 0.28]} scale={[0.1, 0.12, 0.06]}>
        <sphereGeometry args={[1, 12, 12]} />
        <meshStandardMaterial color="#ffffff" roughness={0.2} />
      </mesh>
      <mesh position={[0.12, 0.05, 0.28]} scale={[0.1, 0.12, 0.06]}>
        <sphereGeometry args={[1, 12, 12]} />
        <meshStandardMaterial color="#ffffff" roughness={0.2} />
      </mesh>
      <mesh position={[-0.1, 0.05, 0.33]} scale={[0.045, 0.055, 0.03]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshStandardMaterial color="#000000" roughness={0.1} />
      </mesh>
      <mesh position={[0.1, 0.05, 0.33]} scale={[0.045, 0.055, 0.03]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshStandardMaterial color="#000000" roughness={0.1} />
      </mesh>
      {/* Angry eyebrows */}
      <mesh ref={browLeftRef} position={[-0.14, 0.18, 0.28]} rotation={[0, 0, 0.35]} scale={[0.12, 0.04, 0.06]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#111111" roughness={0.5} />
      </mesh>
      <mesh ref={browRightRef} position={[0.14, 0.18, 0.28]} rotation={[0, 0, -0.35]} scale={[0.12, 0.04, 0.06]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#111111" roughness={0.5} />
      </mesh>
      {/* Frown */}
      <mesh position={[0, -0.08, 0.3]} rotation={[0.1, 0, 0]} scale={[0.1, 0.025, 0.04]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#330000" roughness={0.5} />
      </mesh>
      {/* Nose */}
      <mesh position={[0, 0, 0.35]} scale={[0.04, 0.03, 0.04]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshStandardMaterial color="#aa0000" roughness={0.4} />
      </mesh>
      {/* Ears */}
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

function CharacterBody({ isSitting }: { isSitting: boolean }) {
  return (
    <group position={[0, isSitting ? 0.15 : 0.35, 0]}>
      <mesh scale={[0.28, 0.35, 0.25]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial color="#b30000" roughness={0.4} metalness={0.05} />
      </mesh>
      <mesh position={[0, -0.05, 0.18]} scale={[0.15, 0.2, 0.08]}>
        <sphereGeometry args={[1, 12, 12]} />
        <meshStandardMaterial color="#cc2222" transparent opacity={0.5} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.05, 0.22]} scale={[0.08, 0.06, 0.02]} rotation={[0, 0, 0.1]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#ffcc00" emissive="#ffaa00" emissiveIntensity={0.3} roughness={0.3} />
      </mesh>
    </group>
  );
}

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
          <mesh position={[0, -0.22, 0.02]} scale={[0.12, 0.08, 0.14]}>
            <sphereGeometry args={[1, 8, 8]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.6} />
          </mesh>
        </group>
      </group>
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
          <mesh position={[0, -0.22, 0.02]} scale={[0.12, 0.08, 0.14]}>
            <sphereGeometry args={[1, 8, 8]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.6} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

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
      <group ref={leftArm} position={[-0.32, 0.4, 0]}>
        <mesh position={[0, -0.12, 0]} scale={[0.09, 0.2, 0.09]}>
          <capsuleGeometry args={[1, 1, 4, 8]} />
          <meshStandardMaterial color="#cc0000" roughness={0.5} />
        </mesh>
        <mesh position={[0, -0.25, 0]} scale={[0.11, 0.09, 0.11]}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.5} />
        </mesh>
      </group>
      <group ref={rightArm} position={[0.32, 0.4, 0]}>
        <mesh position={[0, -0.12, 0]} scale={[0.09, 0.2, 0.09]}>
          <capsuleGeometry args={[1, 1, 4, 8]} />
          <meshStandardMaterial color="#cc0000" roughness={0.5} />
        </mesh>
        <mesh position={[0, -0.25, 0]} scale={[0.11, 0.09, 0.11]}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.5} />
        </mesh>
      </group>
    </group>
  );
}

function CharacterBackpack() {
  return (
    <group position={[0, 0.4, -0.22]}>
      <mesh scale={[0.22, 0.18, 0.1]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.6} metalness={0.2} />
      </mesh>
      <mesh position={[-0.1, 0, 0.06]} scale={[0.04, 0.2, 0.02]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.7} />
      </mesh>
      <mesh position={[0.1, 0, 0.06]} scale={[0.04, 0.2, 0.02]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.05, -0.06]} scale={[0.08, 0.06, 0.02]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

/* ─── Footstep sparks (red instead of dust) ─── */
function FootstepSpark({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Mesh>(null);
  const [life] = useState(() => ({ t: 0 }));

  useFrame((_, delta) => {
    if (!ref.current) return;
    life.t += delta;
    const progress = Math.min(life.t / 0.6, 1);
    ref.current.position.y = position[1] + progress * 0.4;
    ref.current.scale.setScalar(0.04 + progress * 0.1);
    (ref.current.material as THREE.MeshStandardMaterial).opacity = 1 - progress;
  });

  return (
    <mesh ref={ref} position={position} scale={0.04}>
      <octahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={2} transparent opacity={0.9} />
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
  const [sparks, setSparks] = useState<Array<{ id: number; pos: [number, number, number] }>>([]);
  const sparkId = useRef(0);
  const lastStepPhase = useRef(0);

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

    if (s.excitedTimer > 0) {
      s.excitedTimer -= delta;
      CLAW_STATE.setExcited(true);
    } else {
      CLAW_STATE.setExcited(false);
    }

    positionRef.current.copy(claw.position);

    if (s.excitedTimer > 0) {
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

        const stepPhase = Math.sin(timeRef.current * 5);
        if (stepPhase * lastStepPhase.current < 0) {
          const isLeft = stepPhase > 0;
          const footX = claw.position.x + (isLeft ? -0.18 : 0.18) * Math.cos(claw.rotation.y);
          const footZ = claw.position.z + (isLeft ? -0.18 : 0.18) * Math.sin(claw.rotation.y);
          const id = ++sparkId.current;
          setSparks(prev => [...prev.slice(-10), { id, pos: [footX, 0.05, footZ] }]);
          setTimeout(() => {
            setSparks(prev => prev.filter(d => d.id !== id));
          }, 600);
        }
        lastStepPhase.current = stepPhase;
      }
    } else {
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
      {sparks.map(d => (
        <FootstepSpark key={d.id} position={d.pos} />
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
      <ambientLight intensity={0.2} color="#331111" />
      <directionalLight position={[3, 5, 4]} intensity={0.8} color="#ffcccc" />
      <pointLight position={[-2, 3, -2]} intensity={1.2} color="#ff0000" />
      <pointLight position={[2, 2, 2]} intensity={0.6} color="#ff4444" />
      <pointLight position={[0, -2, 0]} intensity={0.4} color="#ff0000" />
      <hemisphereLight args={["#ff2222", "#0a0000", 0.3]} />

      <VoidWorld clawPosition={clawPosition} />

      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
        <WalkingClaw positionRef={clawPosition} />
      </Float>
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
        camera={{ position: [0, 2, 7], fov: 45 }}
        style={{ background: "#050505" }}
        gl={{ antialias: true, alpha: true }}
      >
        <Scene />
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          maxPolarAngle={Math.PI / 2.1}
          minPolarAngle={Math.PI / 8}
          autoRotate
          autoRotateSpeed={0.3}
          minDistance={3}
          maxDistance={12}
        />
      </Canvas>
    </div>
  );
}
