"use client";

import { useRef, useMemo, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";

/* ═══════════════════════════════════════════════════════════
   $MAD CAR — Driving a neon track with mascot hood ornament
   ═══════════════════════════════════════════════════════════ */

const TRACK_RADIUS = 4.0;
const CAR_SPEED = 0.4; // radians per second

/* ─── CAR MODEL ─── */
function CarScene() {
  const { scene } = useGLTF("/mad-car.glb");
  const carRef = useRef<THREE.Group>(null);
  const wheelsRef = useRef<THREE.Object3D[]>([]);
  const timeRef = useRef(0);

  useEffect(() => {
    // Find car and wheels
    scene.traverse((child) => {
      if (child.name === '$MAD_Car' && !carRef.current) {
        carRef.current = child as THREE.Group;
      }
      if (child.name.startsWith('Wheel_')) {
        wheelsRef.current.push(child);
      }
    });
  }, [scene]);

  useFrame((state, delta) => {
    timeRef.current = state.clock.elapsedTime;
    if (!carRef.current) return;

    const t = timeRef.current * CAR_SPEED;
    const car = carRef.current;

    // Drive in a circle on the track
    car.position.x = Math.cos(t) * TRACK_RADIUS;
    car.position.z = Math.sin(t) * TRACK_RADIUS;
    car.rotation.y = -t + Math.PI / 2; // Face direction of travel

    // Spin wheels
    wheelsRef.current.forEach((wheel) => {
      wheel.rotation.x += delta * 8;
    });

    // Subtle bob from engine vibration
    car.position.y = 0.02 + Math.sin(timeRef.current * 20) * 0.005;
  });

  return <primitive object={scene} />;
}

/* ═══════════════════════════════════════════════════════════
   ENVIRONMENT
   ═══════════════════════════════════════════════════════════ */
function StarField() {
  const count = 80;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 15 + Math.random() * 25;
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

/* ═══════════════════════════════════════════════════════════
   LIGHTING
   ═══════════════════════════════════════════════════════════ */
function Lighting() {
  return (
    <group>
      <directionalLight position={[6, 8, 6]} intensity={3.0} color="#fff5f0" castShadow />
      <directionalLight position={[-5, 4, 3]} intensity={1.0} color="#d0d8ff" />
      <pointLight position={[0, 3, -6]} intensity={3.0} color="#ff4444" distance={20} />
      <pointLight position={[0, 6, 0]} intensity={1.5} color="#ffffff" distance={15} />
      <pointLight position={[0, -1, 4]} intensity={1.0} color="#ff6666" distance={10} />
      <ambientLight intensity={0.5} color="#221111" />
      <hemisphereLight args={["#ff4444", "#050000", 0.25]} />
    </group>
  );
}

/* ═══════════════════════════════════════════════════════════
   EXHAUST PARTICLES
   ═══════════════════════════════════════════════════════════ */
function ExhaustParticles({ carRef }: { carRef: React.MutableRefObject<THREE.Group | null> }) {
  const particles = useRef<THREE.Points>(null);
  const count = 30;
  const data = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const life = new Float32Array(count);
    const offset = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = 0;
      pos[i * 3 + 1] = -100;
      pos[i * 3 + 2] = 0;
      life[i] = 0;
      offset[i] = Math.random() * 2;
    }
    return { pos, life, offset };
  }, []);

  useFrame((state) => {
    if (!particles.current || !carRef.current) return;
    const pos = particles.current.geometry.attributes.position.array as Float32Array;
    const t = state.clock.elapsedTime;

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      data.life[i] -= 0.016;
      
      if (data.life[i] <= 0) {
        // Respawn at car exhaust position
        const car = carRef.current;
        const angle = -t * CAR_SPEED + Math.PI / 2;
        const exX = car.position.x - Math.cos(angle) * 0.5;
        const exZ = car.position.z - Math.sin(angle) * 0.5;
        pos[idx] = exX + (Math.random() - 0.5) * 0.1;
        pos[idx + 1] = 0.3;
        pos[idx + 2] = exZ + (Math.random() - 0.5) * 0.1;
        data.life[i] = 1.0 + Math.random() * 0.5;
      } else {
        // Drift and fade
        pos[idx] += Math.sin(t + data.offset[i]) * 0.002;
        pos[idx + 1] += 0.008;
        pos[idx + 2] += Math.cos(t + data.offset[i]) * 0.002;
      }
    }
    particles.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={particles}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[data.pos, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#ff2222" size={0.06} transparent opacity={0.5} sizeAttenuation />
    </points>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN SCENE
   ═══════════════════════════════════════════════════════════ */
function Scene() {
  const carRef = useRef<THREE.Group>(null);

  return (
    <group>
      <Lighting />
      <StarField />
      <Suspense fallback={null}>
        <CarScene />
      </Suspense>
      <ExhaustParticles carRef={carRef} />
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
    >
      <Canvas
        camera={{ position: [0, 5, 10], fov: 50 }}
        style={{ background: "#080808" }}
        gl={{ antialias: true, alpha: true }}
      >
        <Scene />
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          maxPolarAngle={Math.PI / 2.5}
          minPolarAngle={Math.PI / 6}
          autoRotate
          autoRotateSpeed={0.2}
          minDistance={5}
          maxDistance={18}
        />
      </Canvas>
    </div>
  );
}

// Preload
try {
  useGLTF.preload("/mad-car.glb");
} catch {
  // Static preloading might fail, runtime Suspense handles it
}
