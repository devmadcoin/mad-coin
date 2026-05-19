"use client";

import { useState, useRef, useMemo, useCallback, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float } from "@react-three/drei";
import * as THREE from "three";

/* ═══════════════════════════════════════════════════════════
   $MAD VOID — Professional lighting, proper proportions
   ═══════════════════════════════════════════════════════════ */

const MOUSE = { x: 0, y: 0 };

/* ═══════════════════════════════════════════════════════════
   ENVIRONMENT — Minimal, no platform under character
   ═══════════════════════════════════════════════════════════ */
function VoidWorld({ clawPosition }: { clawPosition: React.MutableRefObject<THREE.Vector3> }) {
  return (
    <group>
      <AmbientParticles />
      <StarField />
      <RedFog />
    </group>
  );
}

function AmbientParticles() {
  const count = 60;
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
      <meshStandardMaterial color="#1a0000" emissive="#ff0000" emissiveIntensity={0.08} transparent opacity={0.2} roughness={1} />
    </mesh>
  );
}

/* ═══════════════════════════════════════════════════════════
   $MAD MASCOT — Rebuilt with proper proportions
   Reference: round red head, thick angry brows, defined body
   ═══════════════════════════════════════════════════════════ */

function CharacterHead({ excited }: { excited: boolean }) {
  const headRef = useRef<THREE.Group>(null);
  const browLeftRef = useRef<THREE.Group>(null);
  const browRightRef = useRef<THREE.Group>(null);
  const mouthRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (headRef.current) {
      headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, MOUSE.x * 0.4, 0.08);
      headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, -MOUSE.y * 0.25, 0.08);
    }
    if (excited) {
      const t = Date.now() / 80;
      if (browLeftRef.current) browLeftRef.current.position.y = 0.22 + Math.sin(t) * 0.04;
      if (browRightRef.current) browRightRef.current.position.y = 0.22 + Math.sin(t) * 0.04;
    }
  });

  return (
    <group ref={headRef} position={[0, 0.82, 0]}>
      {/* Main head — wider sphere for cheek fullness */}
      <mesh scale={[1.05, 0.95, 1]}>
        <sphereGeometry args={[0.42, 32, 32]} />
        <meshStandardMaterial color="#e60000" roughness={0.25} metalness={0.05} />
      </mesh>

      {/* Subtle cheek highlights */}
      <mesh position={[0.2, -0.05, 0.32]} scale={0.12}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial color="#ff3333" transparent opacity={0.2} roughness={0.1} />
      </mesh>
      <mesh position={[-0.2, -0.05, 0.32]} scale={0.12}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial color="#ff3333" transparent opacity={0.2} roughness={0.1} />
      </mesh>

      {/* Eye sockets — slight indent shadows */}
      <mesh position={[-0.13, 0.06, 0.36]} scale={[0.14, 0.1, 0.03]}>
        <sphereGeometry args={[1, 12, 12]} />
        <meshStandardMaterial color="#cc0000" roughness={0.5} />
      </mesh>
      <mesh position={[0.13, 0.06, 0.36]} scale={[0.14, 0.1, 0.03]}>
        <sphereGeometry args={[1, 12, 12]} />
        <meshStandardMaterial color="#cc0000" roughness={0.5} />
      </mesh>

      {/* Eyes — almond shaped, angry */}
      <mesh position={[-0.13, 0.06, 0.38]} scale={[0.09, 0.065, 0.04]} rotation={[0, 0, -0.1]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial color="#ffffff" roughness={0.15} />
      </mesh>
      <mesh position={[0.13, 0.06, 0.38]} scale={[0.09, 0.065, 0.04]} rotation={[0, 0, 0.1]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial color="#ffffff" roughness={0.15} />
      </mesh>

      {/* Pupils — slightly off-center for angry look */}
      <mesh position={[-0.11, 0.05, 0.41]} scale={[0.035, 0.04, 0.025]}>
        <sphereGeometry args={[1, 12, 12]} />
        <meshStandardMaterial color="#111111" roughness={0.1} />
      </mesh>
      <mesh position={[0.11, 0.05, 0.41]} scale={[0.035, 0.04, 0.025]}>
        <sphereGeometry args={[1, 12, 12]} />
        <meshStandardMaterial color="#111111" roughness={0.1} />
      </mesh>

      {/* Eye glints */}
      <mesh position={[-0.09, 0.07, 0.42]} scale={0.015}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1} />
      </mesh>
      <mesh position={[0.15, 0.07, 0.42]} scale={0.015}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1} />
      </mesh>

      {/* Angry eyebrows — thick, tilted down at inner edge */}
      <group ref={browLeftRef} position={[-0.14, 0.22, 0.35]}>
        <mesh rotation={[0.1, 0, 0.5]} scale={[0.14, 0.055, 0.07]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.4} />
        </mesh>
        {/* Brow shadow underneath */}
        <mesh position={[0, -0.03, 0.01]} rotation={[0.1, 0, 0.5]} scale={[0.13, 0.02, 0.06]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#330000" roughness={0.5} />
        </mesh>
      </group>
      <group ref={browRightRef} position={[0.14, 0.22, 0.35]}>
        <mesh rotation={[0.1, 0, -0.5]} scale={[0.14, 0.055, 0.07]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.4} />
        </mesh>
        <mesh position={[0, -0.03, 0.01]} rotation={[0.1, 0, -0.5]} scale={[0.13, 0.02, 0.06]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#330000" roughness={0.5} />
        </mesh>
      </group>

      {/* Frown — curved downward arc */}
      <group ref={mouthRef} position={[0, -0.12, 0.38]}>
        <mesh rotation={[0.2, 0, 0]} scale={[0.08, 0.025, 0.04]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#4a0000" roughness={0.5} />
        </mesh>
        {/* Chin crease */}
        <mesh position={[0, -0.03, 0.02]} scale={[0.06, 0.015, 0.02]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#330000" roughness={0.6} />
        </mesh>
      </group>

      {/* Nose — subtle */}
      <mesh position={[0, -0.02, 0.4]} scale={[0.04, 0.03, 0.035]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshStandardMaterial color="#cc0000" roughness={0.3} />
      </mesh>

      {/* Ears — small round bumps */}
      <mesh position={[-0.38, 0.05, 0]} scale={[0.08, 0.1, 0.07]}>
        <sphereGeometry args={[1, 12, 12]} />
        <meshStandardMaterial color="#d40000" roughness={0.3} />
      </mesh>
      <mesh position={[0.38, 0.05, 0]} scale={[0.08, 0.1, 0.07]}>
        <sphereGeometry args={[1, 12, 12]} />
        <meshStandardMaterial color="#d40000" roughness={0.3} />
      </mesh>
    </group>
  );
}

function CharacterBody({ isSitting }: { isSitting: boolean }) {
  return (
    <group position={[0, isSitting ? 0.2 : 0.4, 0]}>
      {/* Torso — wider at shoulders, narrower at waist */}
      <mesh scale={[0.38, 0.42, 0.28]}>
        <sphereGeometry args={[1, 20, 20]} />
        <meshStandardMaterial color="#cc0000" roughness={0.3} metalness={0.05} />
      </mesh>
      {/* Chest plate highlight */}
      <mesh position={[0, 0.05, 0.2]} scale={[0.2, 0.15, 0.08]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial color="#e60000" transparent opacity={0.4} roughness={0.2} />
      </mesh>
      {/* $MAD emblem on chest */}
      <mesh position={[0, 0.08, 0.25]} scale={[0.06, 0.04, 0.015]} rotation={[0, 0, 0.1]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#ffcc00" emissive="#ffaa00" emissiveIntensity={0.5} roughness={0.3} metalness={0.3} />
      </mesh>
      {/* Waist belt */}
      <mesh position={[0, -0.15, 0]} scale={[0.32, 0.06, 0.26]}>
        <cylinderGeometry args={[1, 1, 1, 16]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.6} metalness={0.2} />
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
      <group ref={leftThigh} position={[-0.15, 0.12, 0]}>
        <mesh position={[0, -0.1, 0]} scale={[0.1, 0.2, 0.1]}>
          <capsuleGeometry args={[1, 1, 4, 8]} />
          <meshStandardMaterial color="#cc0000" roughness={0.4} />
        </mesh>
        <group ref={leftShin} position={[0, -0.22, 0]}>
          <mesh position={[0, -0.09, 0]} scale={[0.09, 0.17, 0.09]}>
            <capsuleGeometry args={[1, 1, 4, 8]} />
            <meshStandardMaterial color="#b30000" roughness={0.4} />
          </mesh>
          {/* Boot */}
          <mesh position={[0, -0.2, 0.02]} scale={[0.12, 0.07, 0.14]}>
            <sphereGeometry args={[1, 10, 10]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.5} metalness={0.3} />
          </mesh>
          {/* Boot sole */}
          <mesh position={[0, -0.24, 0.02]} scale={[0.13, 0.03, 0.15]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#0a0a0a" roughness={0.7} />
          </mesh>
        </group>
      </group>
      {/* Right leg */}
      <group ref={rightThigh} position={[0.15, 0.12, 0]}>
        <mesh position={[0, -0.1, 0]} scale={[0.1, 0.2, 0.1]}>
          <capsuleGeometry args={[1, 1, 4, 8]} />
          <meshStandardMaterial color="#cc0000" roughness={0.4} />
        </mesh>
        <group ref={rightShin} position={[0, -0.22, 0]}>
          <mesh position={[0, -0.09, 0]} scale={[0.09, 0.17, 0.09]}>
            <capsuleGeometry args={[1, 1, 4, 8]} />
            <meshStandardMaterial color="#b30000" roughness={0.4} />
          </mesh>
          <mesh position={[0, -0.2, 0.02]} scale={[0.12, 0.07, 0.14]}>
            <sphereGeometry args={[1, 10, 10]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.5} metalness={0.3} />
          </mesh>
          <mesh position={[0, -0.24, 0.02]} scale={[0.13, 0.03, 0.15]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#0a0a0a" roughness={0.7} />
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
      if (leftArm.current) { leftArm.current.rotation.z = 0.35; leftArm.current.position.y = 0.04; }
      if (rightArm.current) { rightArm.current.rotation.z = -0.35; rightArm.current.position.y = 0.04; }
      return;
    }
    if (excited) {
      if (leftArm.current) { leftArm.current.rotation.z = 2.3 + Math.sin(time * 15) * 0.25; leftArm.current.position.y = 0; }
      if (rightArm.current) { rightArm.current.rotation.z = -2.3 - Math.sin(time * 15) * 0.25; rightArm.current.position.y = 0; }
      return;
    }
    const swing = Math.sin(time * 2) * 0.06;
    if (leftArm.current) { leftArm.current.rotation.x = swing; leftArm.current.rotation.z = 0.12; leftArm.current.position.y = 0; }
    if (rightArm.current) { rightArm.current.rotation.x = -swing; rightArm.current.rotation.z = -0.12; rightArm.current.position.y = 0; }
  });

  return (
    <group>
      {/* Left arm */}
      <group ref={leftArm} position={[-0.32, 0.42, 0]}>
        <mesh position={[0, -0.1, 0]} scale={[0.08, 0.18, 0.08]}>
          <capsuleGeometry args={[1, 1, 4, 8]} />
          <meshStandardMaterial color="#cc0000" roughness={0.4} />
        </mesh>
        {/* Forearm */}
        <mesh position={[0, -0.22, 0.02]} scale={[0.07, 0.14, 0.07]}>
          <capsuleGeometry args={[1, 1, 4, 8]} />
          <meshStandardMaterial color="#b30000" roughness={0.4} />
        </mesh>
        {/* Glove */}
        <mesh position={[0, -0.32, 0.02]} scale={[0.1, 0.08, 0.1]}>
          <sphereGeometry args={[1, 10, 10]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.5} metalness={0.2} />
        </mesh>
      </group>
      {/* Right arm */}
      <group ref={rightArm} position={[0.32, 0.42, 0]}>
        <mesh position={[0, -0.1, 0]} scale={[0.08, 0.18, 0.08]}>
          <capsuleGeometry args={[1, 1, 4, 8]} />
          <meshStandardMaterial color="#cc0000" roughness={0.4} />
        </mesh>
        <mesh position={[0, -0.22, 0.02]} scale={[0.07, 0.14, 0.07]}>
          <capsuleGeometry args={[1, 1, 4, 8]} />
          <meshStandardMaterial color="#b30000" roughness={0.4} />
        </mesh>
        <mesh position={[0, -0.32, 0.02]} scale={[0.1, 0.08, 0.1]}>
          <sphereGeometry args={[1, 10, 10]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.5} metalness={0.2} />
        </mesh>
      </group>
    </group>
  );
}

function CharacterBackpack() {
  return (
    <group position={[0, 0.42, -0.25]}>
      <mesh scale={[0.24, 0.2, 0.12]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.6} metalness={0.2} />
      </mesh>
      {/* Straps */}
      <mesh position={[-0.08, 0, 0.07]} scale={[0.03, 0.22, 0.015]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.7} />
      </mesh>
      <mesh position={[0.08, 0, 0.07]} scale={[0.03, 0.22, 0.015]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.7} />
      </mesh>
      {/* Red detail */}
      <mesh position={[0, 0.06, -0.07]} scale={[0.07, 0.05, 0.015]}>
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
      claw.position.y = 0.2 + Math.sin(state.clock.elapsedTime * 15) * 0.15;
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
          const footX = claw.position.x + (isLeft ? -0.15 : 0.15) * Math.cos(claw.rotation.y);
          const footZ = claw.position.z + (isLeft ? -0.15 : 0.15) * Math.sin(claw.rotation.y);
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
   LIGHTING — 3-point setup for clean character definition
   ═══════════════════════════════════════════════════════════ */
function Lighting() {
  return (
    <group>
      {/* Key light — warm white, front-left */}
      <directionalLight position={[3, 4, 5]} intensity={1.2} color="#fff0e8" castShadow />
      {/* Fill light — cool blue, right, dim */}
      <directionalLight position={[-3, 2, 2]} intensity={0.3} color="#d0d8ff" />
      {/* Rim light — red, from behind */}
      <pointLight position={[0, 2, -4]} intensity={1.5} color="#ff4444" distance={10} />
      {/* Top highlight */}
      <pointLight position={[0, 5, 0]} intensity={0.6} color="#ffffff" distance={8} />
      {/* Under glow — subtle red bounce */}
      <pointLight position={[0, -2, 0]} intensity={0.4} color="#ff0000" distance={6} />
      {/* Ambient — very dark, just enough to not be pitch black */}
      <ambientLight intensity={0.15} color="#221111" />
      <hemisphereLight args={["#ff2222", "#050000", 0.2]} />
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
      <Lighting />
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
        camera={{ position: [0, 1.5, 5.5], fov: 40 }}
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
