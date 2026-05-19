"use client";

import { useState, useRef, useMemo, useCallback, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float } from "@react-three/drei";
import * as THREE from "three";

/* ═══════════════════════════════════════════════════════════
   $MAD MASCOT — Exact proportions from reference
   Big round head, angry face, chibi body, clean lighting
   ═══════════════════════════════════════════════════════════ */

const MOUSE = { x: 0, y: 0 };

/* ═══════════════════════════════════════════════════════════
   ENVIRONMENT — Clean dark void
   ═══════════════════════════════════════════════════════════ */
function VoidWorld() {
  return (
    <group>
      <AmbientParticles />
      <StarField />
      <RedFog />
    </group>
  );
}

function AmbientParticles() {
  const count = 50;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 15;
      arr[i * 3 + 1] = Math.random() * 8 - 2;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 15;
    }
    return arr;
  }, []);

  const ref = useRef<THREE.Points>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const pos = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 1] += Math.sin(state.clock.elapsedTime * 0.3 + i) * 0.001;
      if (pos[i * 3 + 1] > 6) pos[i * 3 + 1] = -2;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#ff2222" size={0.04} transparent opacity={0.5} sizeAttenuation />
    </points>
  );
}

function StarField() {
  const count = 80;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 12 + Math.random() * 25;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.cos(phi) + 3;
      arr[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    return arr;
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#ffffff" size={0.04} transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

function RedFog() {
  return (
    <mesh position={[0, -4, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[40, 40]} />
      <meshStandardMaterial color="#1a0000" emissive="#ff0000" emissiveIntensity={0.06} transparent opacity={0.2} roughness={1} />
    </mesh>
  );
}

/* ═══════════════════════════════════════════════════════════
   $MAD MASCOT CHARACTER — Rebuilt with exact proportions
   ═══════════════════════════════════════════════════════════ */

/* ─── HEAD: Perfect round sphere, 40% of total height ─── */
function CharacterHead({ excited }: { excited: boolean }) {
  const headRef = useRef<THREE.Group>(null);
  const browLeftRef = useRef<THREE.Group>(null);
  const browRightRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (headRef.current) {
      headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, MOUSE.x * 0.3, 0.08);
      headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, -MOUSE.y * 0.2, 0.08);
    }
    if (excited) {
      const t = Date.now() / 80;
      if (browLeftRef.current) browLeftRef.current.position.y = 0.28 + Math.sin(t) * 0.03;
      if (browRightRef.current) browRightRef.current.position.y = 0.28 + Math.sin(t) * 0.03;
    }
  });

  return (
    <group ref={headRef} position={[0, 1.0, 0]}>
      {/* Main head — PERFECT SPHERE */}
      <mesh>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color="#e60000" roughness={0.2} metalness={0.05} />
      </mesh>

      {/* Subtle cheek roundness highlight */}
      <mesh position={[0.22, -0.08, 0.35]} scale={0.15}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial color="#ff4444" transparent opacity={0.15} roughness={0.1} />
      </mesh>
      <mesh position={[-0.22, -0.08, 0.35]} scale={0.15}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial color="#ff4444" transparent opacity={0.15} roughness={0.1} />
      </mesh>

      {/* ─── EYES: Large, white, almond-shaped ─── */}
      {/* Left eye sclera */}
      <mesh position={[-0.16, 0.06, 0.42]} scale={[0.12, 0.09, 0.05]} rotation={[0, 0, -0.05]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial color="#ffffff" roughness={0.15} />
      </mesh>
      {/* Right eye sclera */}
      <mesh position={[0.16, 0.06, 0.42]} scale={[0.12, 0.09, 0.05]} rotation={[0, 0, 0.05]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial color="#ffffff" roughness={0.15} />
      </mesh>

      {/* Pupils — large, angry, slightly inward */}
      <mesh position={[-0.14, 0.05, 0.46]} scale={[0.055, 0.06, 0.03]}>
        <sphereGeometry args={[1, 12, 12]} />
        <meshStandardMaterial color="#111111" roughness={0.1} />
      </mesh>
      <mesh position={[0.14, 0.05, 0.46]} scale={[0.055, 0.06, 0.03]}>
        <sphereGeometry args={[1, 12, 12]} />
        <meshStandardMaterial color="#111111" roughness={0.1} />
      </mesh>

      {/* Eye glints — small white sparkle */}
      <mesh position={[-0.11, 0.07, 0.48]} scale={0.02}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={2} />
      </mesh>
      <mesh position={[0.19, 0.07, 0.48]} scale={0.02}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={2} />
      </mesh>

      {/* ─── ANGRY EYEBROWS: Sharp V-shape, thick ─── */}
      <group ref={browLeftRef} position={[-0.18, 0.28, 0.4]}>
        {/* Main brow — angled down to center */}
        <mesh rotation={[0.15, 0, 0.6]} scale={[0.16, 0.05, 0.08]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.4} />
        </mesh>
      </group>
      <group ref={browRightRef} position={[0.18, 0.28, 0.4]}>
        <mesh rotation={[0.15, 0, -0.6]} scale={[0.16, 0.05, 0.08]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.4} />
        </mesh>
      </group>

      {/* ─── MOUTH: Small curved frown ─── */}
      <group position={[0, -0.15, 0.42]}>
        <mesh rotation={[0.15, 0, 0]} scale={[0.1, 0.025, 0.04]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#4a0000" roughness={0.5} />
        </mesh>
      </group>

      {/* Nose — subtle bump */}
      <mesh position={[0, -0.02, 0.48]} scale={[0.04, 0.03, 0.03]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshStandardMaterial color="#cc0000" roughness={0.3} />
      </mesh>

      {/* Ear bumps — small and round */}
      <mesh position={[-0.45, 0.05, 0]} scale={[0.1, 0.12, 0.08]}>
        <sphereGeometry args={[1, 12, 12]} />
        <meshStandardMaterial color="#d40000" roughness={0.3} />
      </mesh>
      <mesh position={[0.45, 0.05, 0]} scale={[0.1, 0.12, 0.08]}>
        <sphereGeometry args={[1, 12, 12]} />
        <meshStandardMaterial color="#d40000" roughness={0.3} />
      </mesh>
    </group>
  );
}

/* ─── BODY: Chibi proportions, wider than head ─── */
function CharacterBody({ isSitting }: { isSitting: boolean }) {
  return (
    <group position={[0, isSitting ? 0.3 : 0.55, 0]}>
      {/* Main body — rounded, wider at shoulders */}
      <mesh scale={[0.45, 0.4, 0.35]}>
        <sphereGeometry args={[1, 20, 20]} />
        <meshStandardMaterial color="#cc0000" roughness={0.3} metalness={0.05} />
      </mesh>
      {/* Belly highlight */}
      <mesh position={[0, -0.05, 0.28]} scale={[0.25, 0.2, 0.1]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial color="#e60000" transparent opacity={0.3} roughness={0.2} />
      </mesh>
      {/* $MAD emblem on chest */}
      <mesh position={[0, 0.08, 0.32]} scale={[0.08, 0.05, 0.015]} rotation={[0, 0, 0.1]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#ffcc00" emissive="#ffaa00" emissiveIntensity={0.4} roughness={0.3} metalness={0.3} />
      </mesh>
      {/* Waist belt */}
      <mesh position={[0, -0.18, 0]} scale={[0.4, 0.06, 0.32]}>
        <cylinderGeometry args={[1, 1, 1, 16]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.6} metalness={0.2} />
      </mesh>
    </group>
  );
}

/* ─── LEGS: Short, stubby, boots ─── */
function CharacterLegs({ time, isWalking, isSitting }: { time: number; isWalking: boolean; isSitting: boolean }) {
  const leftThigh = useRef<THREE.Group>(null);
  const rightThigh = useRef<THREE.Group>(null);
  const leftShin = useRef<THREE.Group>(null);
  const rightShin = useRef<THREE.Group>(null);

  useFrame(() => {
    if (isSitting) {
      if (leftThigh.current) { leftThigh.current.rotation.x = -0.9; leftThigh.current.position.y = 0.08; }
      if (rightThigh.current) { rightThigh.current.rotation.x = -0.9; rightThigh.current.position.y = 0.08; }
      if (leftShin.current) { leftShin.current.rotation.x = 1.1; leftShin.current.position.z = 0.08; }
      if (rightShin.current) { rightShin.current.rotation.x = 1.1; rightShin.current.position.z = 0.08; }
      return;
    }
    if (!isWalking) {
      if (leftThigh.current) { leftThigh.current.rotation.x = 0; leftThigh.current.position.y = 0; }
      if (rightThigh.current) { rightThigh.current.rotation.x = 0; rightThigh.current.position.y = 0; }
      if (leftShin.current) { leftShin.current.rotation.x = 0.03; leftShin.current.position.z = 0; }
      if (rightShin.current) { rightShin.current.rotation.x = 0.03; rightShin.current.position.z = 0; }
      return;
    }
    const walkSpeed = 5;
    const stride = 0.3;
    const lPhase = Math.sin(time * walkSpeed);
    if (leftThigh.current) leftThigh.current.rotation.x = lPhase * stride;
    if (leftShin.current) leftShin.current.rotation.x = Math.max(0, -lPhase * stride * 0.6) + 0.03;
    const rPhase = Math.sin(time * walkSpeed + Math.PI);
    if (rightThigh.current) rightThigh.current.rotation.x = rPhase * stride;
    if (rightShin.current) rightShin.current.rotation.x = Math.max(0, -rPhase * stride * 0.6) + 0.03;
  });

  return (
    <group>
      {/* Left leg */}
      <group ref={leftThigh} position={[-0.18, 0.2, 0]}>
        <mesh position={[0, -0.12, 0]} scale={[0.11, 0.22, 0.11]}>
          <capsuleGeometry args={[1, 1, 4, 8]} />
          <meshStandardMaterial color="#cc0000" roughness={0.4} />
        </mesh>
        <group ref={leftShin} position={[0, -0.25, 0]}>
          <mesh position={[0, -0.1, 0]} scale={[0.1, 0.18, 0.1]}>
            <capsuleGeometry args={[1, 1, 4, 8]} />
            <meshStandardMaterial color="#b30000" roughness={0.4} />
          </mesh>
          {/* Boot */}
          <mesh position={[0, -0.22, 0.02]} scale={[0.13, 0.08, 0.15]}>
            <sphereGeometry args={[1, 10, 10]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.5} metalness={0.3} />
          </mesh>
          {/* Sole */}
          <mesh position={[0, -0.26, 0.02]} scale={[0.14, 0.03, 0.16]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#0a0a0a" roughness={0.7} />
          </mesh>
        </group>
      </group>
      {/* Right leg */}
      <group ref={rightThigh} position={[0.18, 0.2, 0]}>
        <mesh position={[0, -0.12, 0]} scale={[0.11, 0.22, 0.11]}>
          <capsuleGeometry args={[1, 1, 4, 8]} />
          <meshStandardMaterial color="#cc0000" roughness={0.4} />
        </mesh>
        <group ref={rightShin} position={[0, -0.25, 0]}>
          <mesh position={[0, -0.1, 0]} scale={[0.1, 0.18, 0.1]}>
            <capsuleGeometry args={[1, 1, 4, 8]} />
            <meshStandardMaterial color="#b30000" roughness={0.4} />
          </mesh>
          <mesh position={[0, -0.22, 0.02]} scale={[0.13, 0.08, 0.15]}>
            <sphereGeometry args={[1, 10, 10]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.5} metalness={0.3} />
          </mesh>
          <mesh position={[0, -0.26, 0.02]} scale={[0.14, 0.03, 0.16]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#0a0a0a" roughness={0.7} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

/* ─── ARMS: Short with gloves ─── */
function CharacterArms({ time, isSitting, excited }: { time: number; isSitting: boolean; excited: boolean }) {
  const leftArm = useRef<THREE.Group>(null);
  const rightArm = useRef<THREE.Group>(null);

  useFrame(() => {
    if (isSitting) {
      if (leftArm.current) { leftArm.current.rotation.z = 0.3; leftArm.current.position.y = 0.04; }
      if (rightArm.current) { rightArm.current.rotation.z = -0.3; rightArm.current.position.y = 0.04; }
      return;
    }
    if (excited) {
      if (leftArm.current) { leftArm.current.rotation.z = 2.3 + Math.sin(time * 15) * 0.25; leftArm.current.position.y = 0; }
      if (rightArm.current) { rightArm.current.rotation.z = -2.3 - Math.sin(time * 15) * 0.25; rightArm.current.position.y = 0; }
      return;
    }
    const swing = Math.sin(time * 2) * 0.06;
    if (leftArm.current) { leftArm.current.rotation.x = swing; leftArm.current.rotation.z = 0.1; leftArm.current.position.y = 0; }
    if (rightArm.current) { rightArm.current.rotation.x = -swing; rightArm.current.rotation.z = -0.1; rightArm.current.position.y = 0; }
  });

  return (
    <group>
      {/* Left arm */}
      <group ref={leftArm} position={[-0.38, 0.55, 0]}>
        <mesh position={[0, -0.1, 0]} scale={[0.09, 0.18, 0.09]}>
          <capsuleGeometry args={[1, 1, 4, 8]} />
          <meshStandardMaterial color="#cc0000" roughness={0.4} />
        </mesh>
        <mesh position={[0, -0.22, 0.02]} scale={[0.07, 0.14, 0.07]}>
          <capsuleGeometry args={[1, 1, 4, 8]} />
          <meshStandardMaterial color="#b30000" roughness={0.4} />
        </mesh>
        {/* Glove */}
        <mesh position={[0, -0.32, 0.02]} scale={[0.11, 0.09, 0.11]}>
          <sphereGeometry args={[1, 10, 10]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.5} metalness={0.2} />
        </mesh>
      </group>
      {/* Right arm */}
      <group ref={rightArm} position={[0.38, 0.55, 0]}>
        <mesh position={[0, -0.1, 0]} scale={[0.09, 0.18, 0.09]}>
          <capsuleGeometry args={[1, 1, 4, 8]} />
          <meshStandardMaterial color="#cc0000" roughness={0.4} />
        </mesh>
        <mesh position={[0, -0.22, 0.02]} scale={[0.07, 0.14, 0.07]}>
          <capsuleGeometry args={[1, 1, 4, 8]} />
          <meshStandardMaterial color="#b30000" roughness={0.4} />
        </mesh>
        <mesh position={[0, -0.32, 0.02]} scale={[0.11, 0.09, 0.11]}>
          <sphereGeometry args={[1, 10, 10]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.5} metalness={0.2} />
        </mesh>
      </group>
    </group>
  );
}

/* ─── BACKPACK ─── */
function CharacterBackpack() {
  return (
    <group position={[0, 0.55, -0.3]}>
      <mesh scale={[0.28, 0.22, 0.12]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.6} metalness={0.2} />
      </mesh>
      <mesh position={[-0.1, 0, 0.07]} scale={[0.03, 0.24, 0.015]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.7} />
      </mesh>
      <mesh position={[0.1, 0, 0.07]} scale={[0.03, 0.24, 0.015]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.07, -0.07]} scale={[0.08, 0.05, 0.015]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

/* ═══════════════════════════════════════════════════════════
   THE WALKING CLAW
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
      claw.position.y = 0.3 + Math.sin(state.clock.elapsedTime * 15) * 0.15;
      s.isWalking = false;
      s.isSitting = false;
      s.idleTimer = 0;
      return;
    }

    if (s.isWalking) {
      claw.position.y = 0.3;
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
      claw.position.y = 0.3 + Math.sin(state.clock.elapsedTime * 1) * 0.02;
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
      <group ref={groupRef} scale={0.55} position={[0, 0.3, 0]}>
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

function FootstepSpark({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Mesh>(null);
  const [life] = useState(() => ({ t: 0 }));

  useFrame((_, delta) => {
    if (!ref.current) return;
    life.t += delta;
    const progress = Math.min(life.t / 0.6, 1);
    ref.current.position.y = position[1] + progress * 0.4;
    ref.current.scale.setScalar(0.03 + progress * 0.08);
    (ref.current.material as THREE.MeshStandardMaterial).opacity = 1 - progress;
  });

  return (
    <mesh ref={ref} position={position} scale={0.03}>
      <octahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color="#ff3333" emissive="#ff0000" emissiveIntensity={2} transparent opacity={0.9} />
    </mesh>
  );
}

/* ═══════════════════════════════════════════════════════════
   LIGHTING — Studio setup for clean character read
   ═══════════════════════════════════════════════════════════ */
function Lighting() {
  return (
    <group>
      {/* Key light — soft warm, front-left */}
      <directionalLight position={[4, 5, 6]} intensity={1.0} color="#fff5f0" castShadow />
      {/* Fill light — cool, right, dim */}
      <directionalLight position={[-4, 3, 2]} intensity={0.25} color="#d0d8ff" />
      {/* Rim light — red, from behind for edge pop */}
      <pointLight position={[0, 3, -5]} intensity={1.2} color="#ff4444" distance={12} />
      {/* Top highlight for head shine */}
      <pointLight position={[0, 6, 0]} intensity={0.5} color="#ffffff" distance={10} />
      {/* Subtle under glow */}
      <pointLight position={[0, -2, 0]} intensity={0.3} color="#ff0000" distance={8} />
      {/* Very dark ambient */}
      <ambientLight intensity={0.12} color="#221111" />
      <hemisphereLight args={["#ff2222", "#050000", 0.15]} />
    </group>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN SCENE
   ═══════════════════════════════════════════════════════════ */
function Scene() {
  const clawPosition = useRef(new THREE.Vector3());

  return (
    <group>
      <Lighting />
      <VoidWorld />
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
        camera={{ position: [0, 1.2, 5], fov: 38 }}
        style={{ background: "#080808" }}
        gl={{ antialias: true, alpha: true }}
      >
        <Scene />
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          maxPolarAngle={Math.PI / 2.2}
          minPolarAngle={Math.PI / 10}
          autoRotate
          autoRotateSpeed={0.3}
          minDistance={3}
          maxDistance={10}
        />
      </Canvas>
    </div>
  );
}
