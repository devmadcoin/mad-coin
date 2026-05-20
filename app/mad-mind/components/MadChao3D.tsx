"use client";

import { useRef, useMemo, useEffect, useState, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";

/* ═══════════════════════════════════════════════════════════
   $MAD CAR — The Chao is Driving!
   ═══════════════════════════════════════════════════════════ */

const TRACK_RADIUS = 4.0;
const CAR_SPEED = 0.35; // radians per second

/* ─── CAR MODEL ─── */
function CarScene() {
  const { scene } = useGLTF("/mad-car-v5.glb");
  const carGroupRef = useRef<THREE.Group | null>(null);
  const wheelsRef = useRef<THREE.Object3D[]>([]);
  const steeringRef = useRef<THREE.Object3D | null>(null);
  const armsRef = useRef<THREE.Object3D[]>([]);
  const chaoHeadRef = useRef<THREE.Object3D | null>(null);
  const chaoBodyRef = useRef<THREE.Object3D | null>(null);
  const timeRef = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    scene.traverse((child) => {
      if (child.name === 'CarBody_v5' && !carGroupRef.current) {
        carGroupRef.current = child as THREE.Group;
      }
      if (child.name.startsWith('Tire_') || child.name.startsWith('Rim_')) {
        wheelsRef.current.push(child);
      }
      if (child.name === 'SteeringWheel') {
        steeringRef.current = child;
      }
      if (child.name.startsWith('ChaoArm_')) {
        armsRef.current.push(child);
      }
      if (child.name === 'ChaoHead_v5') {
        chaoHeadRef.current = child;
      }
      if (child.name === 'ChaoBody_v5') {
        chaoBodyRef.current = child;
      }
    });

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, [scene]);

  useFrame((state, delta) => {
    timeRef.current = state.clock.elapsedTime;
    if (!carGroupRef.current) return;

    const t = timeRef.current * CAR_SPEED;
    const car = carGroupRef.current;

    // Drive in a circle
    const nextT = t + 0.1;
    car.position.x = Math.cos(t) * TRACK_RADIUS;
    car.position.z = Math.sin(t) * TRACK_RADIUS;
    car.position.y = 0.15;
    car.lookAt(
      Math.cos(nextT) * TRACK_RADIUS,
      0.15,
      Math.sin(nextT) * TRACK_RADIUS
    );
    // Flip 180° — car model is backwards relative to direction
    car.rotation.y += Math.PI;

    // Spin wheels
    wheelsRef.current.forEach((wheel) => {
      wheel.rotation.x += delta * 8;
    });

    // Steering wheel oscillation (turning left/right)
    if (steeringRef.current) {
      const steerAngle = Math.sin(timeRef.current * 0.8) * 0.6; // ±0.6 radians
      steeringRef.current.rotation.z = steerAngle;
    }

    // Chao arms follow steering wheel rotation
    armsRef.current.forEach((arm) => {
      const steerAngle = Math.sin(timeRef.current * 0.8) * 0.6;
      const side = arm.name.includes('_L') ? -1 : 1;
      // Arms pivot from shoulder, hands stay on wheel
      arm.rotation.z = steerAngle * side * 0.5;
    });

    // Chao head tracks mouse
    if (chaoHeadRef.current) {
      const targetX = mouseRef.current.x * 0.4;
      const targetY = mouseRef.current.y * 0.3;
      chaoHeadRef.current.rotation.y = THREE.MathUtils.lerp(
        chaoHeadRef.current.rotation.y, targetX, delta * 3
      );
      chaoHeadRef.current.rotation.x = THREE.MathUtils.lerp(
        chaoHeadRef.current.rotation.x, targetY, delta * 3
      );
    }

    // Chao body engine vibration
    if (chaoBodyRef.current) {
      chaoBodyRef.current.position.y = 0.58 + Math.sin(timeRef.current * 25) * 0.002;
    }

    // Engine vibration bob
    car.position.y = 0.15 + Math.sin(timeRef.current * 20) * 0.003;
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
      <directionalLight position={[6, 10, 6]} intensity={3.0} color="#fff5f0" castShadow />
      <directionalLight position={[-5, 6, 3]} intensity={1.0} color="#d0d8ff" />
      <pointLight position={[0, 2, -6]} intensity={2.0} color="#ff4444" distance={20} />
      <pointLight position={[0, 8, 0]} intensity={1.0} color="#ffffff" distance={15} />
      <ambientLight intensity={0.5} color="#221111" />
      <hemisphereLight args={["#ff4444", "#050000", 0.25]} />
    </group>
  );
}

/* ═══════════════════════════════════════════════════════════
   EXHAUST PARTICLES
   ═══════════════════════════════════════════════════════════ */
function ExhaustParticles() {
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
    if (!particles.current) return;
    const pos = particles.current.geometry.attributes.position.array as Float32Array;
    const t = state.clock.elapsedTime;

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      data.life[i] -= 0.016;
      
      if (data.life[i] <= 0) {
        // Respawn at rear of car (now opposite side due to 180° flip)
        const angle = t * CAR_SPEED + Math.PI / 2; // Opposite direction
        const carX = Math.cos(t * CAR_SPEED) * TRACK_RADIUS;
        const carZ = Math.sin(t * CAR_SPEED) * TRACK_RADIUS;
        const exX = carX - Math.cos(angle) * 0.5;
        const exZ = carZ - Math.sin(angle) * 0.5;
        pos[idx] = exX + (Math.random() - 0.5) * 0.1;
        pos[idx + 1] = 0.25;
        pos[idx + 2] = exZ + (Math.random() - 0.5) * 0.1;
        data.life[i] = 1.0 + Math.random() * 0.5;
      } else {
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
  return (
    <group>
      <Lighting />
      <StarField />
      <Suspense fallback={null}>
        <CarScene />
      </Suspense>
      <ExhaustParticles />
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
        camera={{ position: [6, 8, 6], fov: 45 }}
        style={{ background: "#080808" }}
        gl={{ antialias: true, alpha: true }}
      >
        <Scene />
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          maxPolarAngle={Math.PI / 2.2}
          minPolarAngle={Math.PI / 8}
          autoRotate
          autoRotateSpeed={0.15}
          minDistance={4}
          maxDistance={16}
        />
      </Canvas>
    </div>
  );
}

// Preload
try {
  useGLTF.preload("/mad-car-v5.glb");
} catch {
  // Static preloading might fail, runtime Suspense handles it
}
