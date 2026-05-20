"use client";

import { useState, useRef, useMemo, useCallback, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";

/* ═══════════════════════════════════════════════════════════
   $MAD MASCOT — Loaded from Blender-built .glb
   ═══════════════════════════════════════════════════════════ */

const MOUSE = { x: 0, y: 0 };

/* ─── GLTF LOADER ─── */
function MascotModel({ positionRef, walkState, isSitting, excited }: {
  positionRef: React.MutableRefObject<THREE.Vector3>;
  walkState: { isWalking: boolean; targetX: number; targetZ: number; pauseTimer: number; idleTimer: number; excitedTimer: number };
  isSitting: boolean;
  excited: boolean;
}) {
  const { scene } = useGLTF("/mad-mascot.glb");
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Object3D | null>(null);
  const timeRef = useRef(0);

  // Find head in the loaded scene for mouse tracking
  useEffect(() => {
    scene.traverse((child) => {
      if (child.name === 'Head' && !headRef.current) {
        headRef.current = child;
      }
    });
  }, [scene]);

  useFrame((state, delta) => {
    timeRef.current = state.clock.elapsedTime;
    if (!groupRef.current) return;
    const claw = groupRef.current;
    const s = walkState;

    positionRef.current.copy(claw.position);

    // Head tracks mouse
    if (headRef.current) {
      headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, MOUSE.x * 0.4, 0.08);
      headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, -MOUSE.y * 0.25, 0.08);
    }

    // Excited bounce
    if (excited) {
      claw.position.y = 0.6 + Math.sin(timeRef.current * 15) * 0.15;
      s.isWalking = false;
      return;
    }

    // Walking state machine
    if (s.isWalking) {
      claw.position.y = 0.6 + Math.sin(timeRef.current * 5) * 0.02;
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
      }
    } else {
      claw.position.y = 0.6 + Math.sin(timeRef.current * 1) * 0.02;
      s.pauseTimer -= delta;
      s.idleTimer += delta;
      if (s.pauseTimer <= 0) {
        s.targetX = (Math.random() - 0.5) * 1.2;
        s.targetZ = (Math.random() - 0.5) * 1.2;
        s.isWalking = true;
        s.idleTimer = 0;
      }
    }
  });

  return (
    <group ref={groupRef} scale={0.5} position={[0, 0.6, 0]}>
      <primitive object={scene} />
    </group>
  );
}

/* ═══════════════════════════════════════════════════════════
   ENVIRONMENT
   ═══════════════════════════════════════════════════════════ */
function VoidWorld() {
  return (
    <group>
      <StarField />
      <AmbientParticles />
      <GroundPlane />
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

function GroundPlane() {
  return (
    <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[8, 8]} />
      <meshStandardMaterial
        color="#111111"
        roughness={0.8}
        metalness={0.2}
        transparent
        opacity={0.5}
      />
    </mesh>
  );
}

/* ═══════════════════════════════════════════════════════════
   LIGHTING — Bright studio setup (Blender materials need more light)
   ═══════════════════════════════════════════════════════════ */
function Lighting() {
  return (
    <group>
      {/* Key light — bright warm */}
      <directionalLight position={[4, 6, 5]} intensity={2.5} color="#fff5f0" castShadow />
      {/* Fill — cool, brighter */}
      <directionalLight position={[-4, 4, 3]} intensity={1.0} color="#d0d8ff" />
      {/* Rim — red from behind */}
      <pointLight position={[0, 2, -4]} intensity={2.0} color="#ff4444" distance={15} />
      {/* Top fill */}
      <pointLight position={[0, 5, 0]} intensity={1.0} color="#ffffff" distance={12} />
      {/* Bottom bounce — illuminates legs/boots */}
      <pointLight position={[0, -2, 2]} intensity={0.8} color="#ff6666" distance={8} />
      {/* Front fill for face */}
      <pointLight position={[0, 1, 3]} intensity={0.6} color="#ffffff" distance={8} />
      {/* Ambient — much brighter for dark background */}
      <ambientLight intensity={0.4} color="#331111" />
      <hemisphereLight args={["#ff4444", "#1a0000", 0.3]} />
    </group>
  );
}

/* ═══════════════════════════════════════════════════════════
   FOOTSTEP SPARKS
   ═══════════════════════════════════════════════════════════ */
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
   THE WALKING CLAW
   ═══════════════════════════════════════════════════════════ */

export const CLAW_STATE = {
  excited: false,
  setExcited: (v: boolean) => { CLAW_STATE.excited = v; },
};

function WalkingClaw({ positionRef }: { positionRef: React.MutableRefObject<THREE.Vector3> }) {
  const [sparks, setSparks] = useState<Array<{ id: number; pos: [number, number, number] }>>([]);
  const sparkId = useRef(0);
  const lastStepPhase = useRef(0);
  const walkState = useRef({
    targetX: 0,
    targetZ: 0,
    isWalking: false,
    pauseTimer: 0,
    idleTimer: 0,
    excitedTimer: 0,
  }).current;
  const [isSitting, setIsSitting] = useState(false);

  useEffect(() => {
    const handleReact = () => { walkState.excitedTimer = 1.5; };
    window.addEventListener("madclaw-react", handleReact);
    return () => window.removeEventListener("madclaw-react", handleReact);
  }, [walkState]);

  useFrame((state, delta) => {
    if (walkState.excitedTimer > 0) {
      walkState.excitedTimer -= delta;
      CLAW_STATE.setExcited(true);
      setIsSitting(false);
    } else {
      CLAW_STATE.setExcited(false);
    }

    // Sitting logic
    if (!walkState.isWalking && walkState.idleTimer > 8 && walkState.excitedTimer <= 0) {
      setIsSitting(true);
    } else if (walkState.isWalking || walkState.excitedTimer > 0) {
      setIsSitting(false);
    }

    // Spark generation on steps
    if (walkState.isWalking) {
      const stepPhase = Math.sin(state.clock.elapsedTime * 5);
      if (stepPhase * lastStepPhase.current < 0) {
        const isLeft = stepPhase > 0;
        const pos = positionRef.current;
        const angle = Math.atan2(walkState.targetX - pos.x, walkState.targetZ - pos.z) + Math.PI;
        const footX = pos.x + (isLeft ? -0.17 : 0.17) * Math.cos(angle);
        const footZ = pos.z + (isLeft ? -0.17 : 0.17) * Math.sin(angle);
        const id = ++sparkId.current;
        setSparks(prev => [...prev.slice(-10), { id, pos: [footX, 0.05, footZ] }]);
        setTimeout(() => { setSparks(prev => prev.filter(d => d.id !== id)); }, 600);
      }
      lastStepPhase.current = stepPhase;
    }
  });

  const excited = CLAW_STATE.excited;

  return (
    <group>
      <Suspense fallback={null}>
        <MascotModel positionRef={positionRef} walkState={walkState} isSitting={isSitting} excited={excited} />
      </Suspense>
      {sparks.map(d => <FootstepSpark key={d.id} position={d.pos} />)}
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
      <WalkingClaw positionRef={clawPosition} />
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
        camera={{ position: [0, 0.5, 4.0], fov: 40 }}
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

// Preload the GLB
useGLTF.preload("/mad-mascot.glb");
