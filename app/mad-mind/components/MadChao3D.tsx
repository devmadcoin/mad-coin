"use client";

import { useState, useRef, useMemo, useCallback, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float, RoundedBox } from "@react-three/drei";
import * as THREE from "three";

/* ═══════════════════════════════════════════════════════════
   $MAD MASCOT — Advanced Three.js techniques
   ExtrudeGeometry eyebrows, MeshPhysicalMaterial skin,
   layered eyes, proper chibi proportions
   ═══════════════════════════════════════════════════════════ */

const MOUSE = { x: 0, y: 0 };

/* ═══════════════════════════════════════════════════════════
   ENVIRONMENT
   ═══════════════════════════════════════════════════════════ */
function VoidWorld() {
  return (
    <group>
      <StarField />
      <AmbientParticles />
      <RedFog />
    </group>
  );
}

function AmbientParticles() {
  const count = 40;
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
      pos[i * 3 + 1] += Math.sin(state.clock.elapsedTime * 0.2 + i * 0.5) * 0.0008;
      if (pos[i * 3 + 1] > 5) pos[i * 3 + 1] = -1;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#ff3333" size={0.035} transparent opacity={0.4} sizeAttenuation />
    </points>
  );
}

function StarField() {
  const count = 60;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 10 + Math.random() * 20;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.cos(phi) + 2;
      arr[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    return arr;
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#ffffff" size={0.03} transparent opacity={0.5} sizeAttenuation />
    </points>
  );
}

function RedFog() {
  return (
    <mesh position={[0, -3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[30, 30]} />
      <meshStandardMaterial color="#1a0000" emissive="#ff0000" emissiveIntensity={0.04} transparent opacity={0.15} roughness={1} />
    </mesh>
  );
}

/* ═══════════════════════════════════════════════════════════
   SKIN MATERIAL — MeshPhysicalMaterial with sheen for soft toy look
   ═══════════════════════════════════════════════════════════ */
function SkinMaterial({ color = "#e60000", emissive = "#330000" }: { color?: string; emissive?: string }) {
  return (
    <meshPhysicalMaterial
      color={color}
      roughness={0.35}
      metalness={0.0}
      sheen={0.5}
      sheenRoughness={0.5}
      sheenColor="#ff6666"
      clearcoat={0.1}
      clearcoatRoughness={0.4}
      emissive={emissive}
      emissiveIntensity={0.15}
    />
  );
}

/* ═══════════════════════════════════════════════════════════
   HEAD — Perfect sphere, smooth, with cheek volume
   ═══════════════════════════════════════════════════════════ */
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
      if (browLeftRef.current) browLeftRef.current.position.y = 0.32 + Math.sin(t) * 0.025;
      if (browRightRef.current) browRightRef.current.position.y = 0.32 + Math.sin(t) * 0.025;
    }
  });

  return (
    <group ref={headRef} position={[0, 0.95, 0]}>
      {/* Main head sphere */}
      <mesh castShadow>
        <sphereGeometry args={[0.52, 32, 32]} />
        <SkinMaterial color="#e60000" emissive="#2a0000" />
      </mesh>

      {/* Cheek highlights — subtle volume */}
      <mesh position={[0.24, -0.06, 0.38]} scale={0.14}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial color="#ff5555" transparent opacity={0.12} roughness={0.2} />
      </mesh>
      <mesh position={[-0.24, -0.06, 0.38]} scale={0.14}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial color="#ff5555" transparent opacity={0.12} roughness={0.2} />
      </mesh>

      {/* ─── EYES — Multi-layer construction ─── */}
      {/* Left eye sclera */}
      <mesh position={[-0.17, 0.05, 0.43]} scale={[0.13, 0.095, 0.06]} rotation={[0, 0, -0.03]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshPhysicalMaterial color="#ffffff" roughness={0.1} metalness={0.0} clearcoat={0.3} />
      </mesh>
      {/* Right eye sclera */}
      <mesh position={[0.17, 0.05, 0.43]} scale={[0.13, 0.095, 0.06]} rotation={[0, 0, 0.03]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshPhysicalMaterial color="#ffffff" roughness={0.1} metalness={0.0} clearcoat={0.3} />
      </mesh>

      {/* Pupils */}
      <mesh position={[-0.15, 0.04, 0.47]} scale={[0.06, 0.065, 0.04]}>
        <sphereGeometry args={[1, 12, 12]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.05} />
      </mesh>
      <mesh position={[0.15, 0.04, 0.47]} scale={[0.06, 0.065, 0.04]}>
        <sphereGeometry args={[1, 12, 12]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.05} />
      </mesh>

      {/* Eye glints */}
      <mesh position={[-0.11, 0.065, 0.49]} scale={0.022}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={3} />
      </mesh>
      <mesh position={[0.19, 0.065, 0.49]} scale={0.022}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={3} />
      </mesh>

      {/* ─── ANGRY EYEBROWS — ExtrudeGeometry V-shape ─── */}
      <group ref={browLeftRef} position={[-0.19, 0.32, 0.38]} rotation={[0.1, 0, 0.55]}>
        <mesh>
          <extrudeGeometry
            args={[
              (() => {
                const shape = new THREE.Shape();
                shape.moveTo(-0.09, 0.02);
                shape.lineTo(0.09, -0.02);
                shape.lineTo(0.09, 0.02);
                shape.lineTo(-0.09, 0.06);
                shape.lineTo(-0.09, 0.02);
                return shape;
              })(),
              { depth: 0.05, bevelEnabled: true, bevelThickness: 0.015, bevelSize: 0.015, bevelSegments: 3 },
            ]}
          />
          <meshStandardMaterial color="#1a1a1a" roughness={0.4} metalness={0.1} />
        </mesh>
      </group>
      <group ref={browRightRef} position={[0.19, 0.32, 0.38]} rotation={[0.1, 0, -0.55]}>
        <mesh>
          <extrudeGeometry
            args={[
              (() => {
                const shape = new THREE.Shape();
                shape.moveTo(-0.09, -0.02);
                shape.lineTo(0.09, 0.02);
                shape.lineTo(0.09, 0.06);
                shape.lineTo(-0.09, 0.02);
                shape.lineTo(-0.09, -0.02);
                return shape;
              })(),
              { depth: 0.05, bevelEnabled: true, bevelThickness: 0.015, bevelSize: 0.015, bevelSegments: 3 },
            ]}
          />
          <meshStandardMaterial color="#1a1a1a" roughness={0.4} metalness={0.1} />
        </mesh>
      </group>

      {/* ─── MOUTH — Small frown curve ─── */}
      <group position={[0, -0.18, 0.42]}>
        <mesh rotation={[0.1, 0, 0]} scale={[0.08, 0.02, 0.03]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#3a0000" roughness={0.6} />
        </mesh>
      </group>

      {/* Nose bump */}
      <mesh position={[0, -0.03, 0.49]} scale={[0.035, 0.025, 0.025]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshStandardMaterial color="#cc0000" roughness={0.3} />
      </mesh>

      {/* Small round ears */}
      <mesh position={[-0.48, 0.02, 0]} scale={[0.08, 0.1, 0.06]}>
        <sphereGeometry args={[1, 12, 12]} />
        <SkinMaterial color="#d40000" />
      </mesh>
      <mesh position={[0.48, 0.02, 0]} scale={[0.08, 0.1, 0.06]}>
        <sphereGeometry args={[1, 12, 12]} />
        <SkinMaterial color="#d40000" />
      </mesh>
    </group>
  );
}

/* ═══════════════════════════════════════════════════════════
   BODY — Rounded, compact chibi
   ═══════════════════════════════════════════════════════════ */
function CharacterBody({ isSitting }: { isSitting: boolean }) {
  return (
    <group position={[0, isSitting ? 0.28 : 0.5, 0]}>
      {/* Main body */}
      <mesh castShadow>
        <sphereGeometry args={[0.42, 20, 20]} />
        <SkinMaterial color="#cc0000" emissive="#1a0000" />
      </mesh>
      {/* Belly highlight */}
      <mesh position={[0, -0.04, 0.32]} scale={[0.22, 0.18, 0.08]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial color="#e60000" transparent opacity={0.2} roughness={0.2} />
      </mesh>
      {/* $MAD emblem */}
      <mesh position={[0, 0.1, 0.38]} scale={[0.07, 0.045, 0.015]} rotation={[0, 0, 0.08]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#ffcc00" emissive="#ffaa00" emissiveIntensity={0.5} roughness={0.3} metalness={0.3} />
      </mesh>
      {/* Belt */}
      <mesh position={[0, -0.16, 0]} scale={[0.38, 0.055, 0.3]}>
        <cylinderGeometry args={[1, 1, 1, 16]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.6} metalness={0.2} />
      </mesh>
    </group>
  );
}

/* ═══════════════════════════════════════════════════════════
   LEGS — Segmented with boots
   ═══════════════════════════════════════════════════════════ */
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
      <group ref={leftThigh} position={[-0.17, 0.18, 0]}>
        <mesh position={[0, -0.12, 0]} scale={[0.1, 0.22, 0.1]}>
          <capsuleGeometry args={[1, 1, 4, 8]} />
          <SkinMaterial color="#cc0000" />
        </mesh>
        <group ref={leftShin} position={[0, -0.24, 0]}>
          <mesh position={[0, -0.1, 0]} scale={[0.09, 0.17, 0.09]}>
            <capsuleGeometry args={[1, 1, 4, 8]} />
            <SkinMaterial color="#b30000" />
          </mesh>
          <mesh position={[0, -0.22, 0.02]} scale={[0.12, 0.07, 0.14]}>
            <sphereGeometry args={[1, 10, 10]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.5} metalness={0.3} />
          </mesh>
          <mesh position={[0, -0.26, 0.02]} scale={[0.13, 0.025, 0.15]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#0a0a0a" roughness={0.7} />
          </mesh>
        </group>
      </group>
      {/* Right leg */}
      <group ref={rightThigh} position={[0.17, 0.18, 0]}>
        <mesh position={[0, -0.12, 0]} scale={[0.1, 0.22, 0.1]}>
          <capsuleGeometry args={[1, 1, 4, 8]} />
          <SkinMaterial color="#cc0000" />
        </mesh>
        <group ref={rightShin} position={[0, -0.24, 0]}>
          <mesh position={[0, -0.1, 0]} scale={[0.09, 0.17, 0.09]}>
            <capsuleGeometry args={[1, 1, 4, 8]} />
            <SkinMaterial color="#b30000" />
          </mesh>
          <mesh position={[0, -0.22, 0.02]} scale={[0.12, 0.07, 0.14]}>
            <sphereGeometry args={[1, 10, 10]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.5} metalness={0.3} />
          </mesh>
          <mesh position={[0, -0.26, 0.02]} scale={[0.13, 0.025, 0.15]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#0a0a0a" roughness={0.7} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

/* ═══════════════════════════════════════════════════════════
   ARMS — Segmented with gloves
   ═══════════════════════════════════════════════════════════ */
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
      <group ref={leftArm} position={[-0.36, 0.5, 0]}>
        <mesh position={[0, -0.1, 0]} scale={[0.085, 0.17, 0.085]}>
          <capsuleGeometry args={[1, 1, 4, 8]} />
          <SkinMaterial color="#cc0000" />
        </mesh>
        <mesh position={[0, -0.22, 0.02]} scale={[0.065, 0.13, 0.065]}>
          <capsuleGeometry args={[1, 1, 4, 8]} />
          <SkinMaterial color="#b30000" />
        </mesh>
        <mesh position={[0, -0.32, 0.02]} scale={[0.1, 0.08, 0.1]}>
          <sphereGeometry args={[1, 10, 10]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.5} metalness={0.2} />
        </mesh>
      </group>
      <group ref={rightArm} position={[0.36, 0.5, 0]}>
        <mesh position={[0, -0.1, 0]} scale={[0.085, 0.17, 0.085]}>
          <capsuleGeometry args={[1, 1, 4, 8]} />
          <SkinMaterial color="#cc0000" />
        </mesh>
        <mesh position={[0, -0.22, 0.02]} scale={[0.065, 0.13, 0.065]}>
          <capsuleGeometry args={[1, 1, 4, 8]} />
          <SkinMaterial color="#b30000" />
        </mesh>
        <mesh position={[0, -0.32, 0.02]} scale={[0.1, 0.08, 0.1]}>
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
    <group position={[0, 0.5, -0.28]}>
      <mesh scale={[0.26, 0.2, 0.1]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.6} metalness={0.2} />
      </mesh>
      <mesh position={[-0.09, 0, 0.06]} scale={[0.025, 0.22, 0.015]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.7} />
      </mesh>
      <mesh position={[0.09, 0, 0.06]} scale={[0.025, 0.22, 0.015]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.06, -0.06]} scale={[0.07, 0.045, 0.015]}>
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
    const handleReact = () => { walkState.excitedTimer = 1.5; };
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
          const footX = claw.position.x + (isLeft ? -0.17 : 0.17) * Math.cos(claw.rotation.y);
          const footZ = claw.position.z + (isLeft ? -0.17 : 0.17) * Math.sin(claw.rotation.y);
          const id = ++sparkId.current;
          setSparks(prev => [...prev.slice(-10), { id, pos: [footX, 0.05, footZ] }]);
          setTimeout(() => { setSparks(prev => prev.filter(d => d.id !== id)); }, 600);
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
      if (s.idleTimer > 8 && !s.isSitting) s.isSitting = true;
    }
  });

  const isExcited = CLAW_STATE.excited;

  return (
    <group>
      <group ref={groupRef} scale={0.5} position={[0, 0.3, 0]}>
        <CharacterBody isSitting={walkState.isSitting} />
        <CharacterHead excited={isExcited} />
        <CharacterLegs time={timeRef.current} isWalking={walkState.isWalking} isSitting={walkState.isSitting} />
        <CharacterArms time={timeRef.current} isSitting={walkState.isSitting} excited={isExcited} />
        <CharacterBackpack />
      </group>
      {sparks.map(d => <FootstepSpark key={d.id} position={d.pos} />)}
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
   LIGHTING — Studio setup
   ═══════════════════════════════════════════════════════════ */
function Lighting() {
  return (
    <group>
      <directionalLight position={[4, 5, 6]} intensity={1.0} color="#fff5f0" castShadow />
      <directionalLight position={[-4, 3, 2]} intensity={0.25} color="#d0d8ff" />
      <pointLight position={[0, 3, -4]} intensity={1.0} color="#ff4444" distance={12} />
      <pointLight position={[0, 5, 0]} intensity={0.4} color="#ffffff" distance={10} />
      <pointLight position={[0, -2, 0]} intensity={0.25} color="#ff0000" distance={8} />
      <ambientLight intensity={0.1} color="#221111" />
      <hemisphereLight args={["#ff2222", "#050000", 0.12]} />
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
        camera={{ position: [0, 1.1, 4.5], fov: 36 }}
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
          maxDistance={9}
        />
      </Canvas>
    </div>
  );
}
