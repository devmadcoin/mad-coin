"use client";

import { useRef, useMemo, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float } from "@react-three/drei";
import * as THREE from "three";

/* ═══════════════════════════════════════════════════════════
   $MAD CHAO GARDEN — 3D World
   Inspired by Sonic Adventure 2 Chao Garden.
   A living world where the Claw grows with the community.
   ═══════════════════════════════════════════════════════════ */

const MOUSE = { x: 0, y: 0 };

/* ────────────────────────────────
   GARDEN ENVIRONMENT — Multi-island world
   ──────────────────────────────── */
function GardenWorld() {
  return (
    <group>
      {/* Main island — where the Claw lives */}
      <FloatingIsland position={[0, -0.3, 0]} scale={1.2} isMain />
      
      {/* Secondary islands */}
      <FloatingIsland position={[-3.5, -0.8, -2]} scale={0.7} />
      <FloatingIsland position={[3.2, -0.5, -1.5]} scale={0.9} />
      <FloatingIsland position={[-1.5, -1.2, 3]} scale={0.6} />
      <FloatingIsland position={[2.5, -0.6, 2.5]} scale={0.5} />
      
      {/* Connecting bridges */}
      <EtherealBridge from={[0, -0.3, 0]} to={[-3.5, -0.8, -2]} />
      <EtherealBridge from={[0, -0.3, 0]} to={[3.2, -0.5, -1.5]} />
      
      {/* Water below */}
      <GardenWater />
      
      {/* Sky particles */}
      <GardenParticles />
      
      {/* Background stars */}
      <StarField />
    </group>
  );
}

/* ─── Individual floating island ─── */
function FloatingIsland({ position, scale, isMain = false }: { position: [number, number, number]; scale: number; isMain?: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.4 + position[0]) * 0.15;
    }
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Island base — dark stone with moss */}
      <mesh position={[0, -0.2, 0]} scale={[1.5, 0.4, 1.5]}>
        <cylinderGeometry args={[1, 1.3, 1, 32]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.8} metalness={0.1} />
      </mesh>
      
      {/* Grass top */}
      <mesh position={[0, 0.05, 0]} scale={[1.45, 0.08, 1.45]}>
        <cylinderGeometry args={[1, 1, 1, 32]} />
        <meshStandardMaterial color={isMain ? "#1a3a2a" : "#152a20"} roughness={0.9} />
      </mesh>
      
      {/* Glowing edge */}
      <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.4, 1.48, 64]} />
        <meshStandardMaterial
          color="#ff4444"
          emissive="#ff2222"
          emissiveIntensity={isMain ? 2 : 1}
          transparent
          opacity={0.5}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Trees */}
      {isMain && (
        <>
          <GardenTree position={[-0.8, 0.2, 0.6]} scale={0.8} />
          <GardenTree position={[0.9, 0.15, -0.5]} scale={0.6} />
          <GardenTree position={[0.3, 0.2, 0.9]} scale={0.7} />
        </>
      )}
      
      {/* Rocks */}
      <mesh position={[-0.5, 0.15, -0.7]} scale={[0.12, 0.1, 0.1]} rotation={[0.2, 0.5, 0.1]}>
        <dodecahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color="#2a2a3a" roughness={0.6} />
      </mesh>
      
      {/* Crystals */}
      <Crystal position={[0.7, 0.3, 0.4]} scale={0.15} color="#ff4444" />
      <Crystal position={[-0.6, 0.25, -0.3]} scale={0.1} color="#ff6666" />
      
      {/* Flowers for main island */}
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

/* ─── Ethereal bridge between islands ─── */
function EtherealBridge({ from, to }: { from: [number, number, number]; to: [number, number, number] }) {
  const midX = (from[0] + to[0]) / 2;
  const midY = Math.min(from[1], to[1]) - 0.3;
  const midZ = (from[2] + to[2]) / 2;
  const dist = Math.sqrt((to[0] - from[0]) ** 2 + (to[2] - from[2]) ** 2);
  
  return (
    <group>
      {/* Bridge path */}
      <mesh position={[midX, midY, midZ]} rotation={[0, Math.atan2(to[0] - from[0], to[2] - from[2]), 0]} scale={[dist * 0.5, 0.05, 0.3]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#ff4444" emissive="#ff2222" emissiveIntensity={0.5} transparent opacity={0.3} />
      </mesh>
      
      {/* Glowing orbs along bridge */}
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
      {/* Trunk */}
      <mesh position={[0, 0.3, 0]} scale={[0.08, 0.4, 0.08]}>
        <cylinderGeometry args={[1, 1.2, 1, 6]} />
        <meshStandardMaterial color="#2a1a1a" roughness={0.9} />
      </mesh>
      
      {/* Canopy layers */}
      <mesh position={[0, 0.7, 0]} scale={[0.35, 0.25, 0.35]}>
        <sphereGeometry args={[1, 12, 12]} />
        <meshStandardMaterial color="#1a4a2a" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.9, 0]} scale={[0.25, 0.2, 0.25]}>
        <sphereGeometry args={[1, 12, 12]} />
        <meshStandardMaterial color="#1d5a30" roughness={0.8} />
      </mesh>
      
      {/* Red fruit/glow */}
      <mesh position={[0.15, 0.75, 0.15]} scale={0.04}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshStandardMaterial color="#ff4444" emissive="#ff2222" emissiveIntensity={1} />
      </mesh>
      <mesh position={[-0.1, 0.85, -0.1]} scale={0.03}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshStandardMaterial color="#ff5555" emissive="#ff3333" emissiveIntensity={0.8} />
      </mesh>
    </group>
  );
}

/* ─── Crystal ─── */
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
      {/* Stem */}
      <mesh position={[0, 0.06, 0]} scale={[0.01, 0.06, 0.01]}>
        <cylinderGeometry args={[1, 1, 1, 4]} />
        <meshStandardMaterial color="#1a3a1a" />
      </mesh>
      {/* Petals */}
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
    if (ref.current) {
      ref.current.position.y = -1.8 + Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
    }
  });
  
  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.8, 0]}>
      <planeGeometry args={[30, 30]} />
      <meshStandardMaterial
        color="#0a0e1a"
        roughness={0.05}
        metalness={0.9}
        transparent
        opacity={0.4}
      />
    </mesh>
  );
}

/* ─── Floating particles ─── */
function GardenParticles() {
  const particlesRef = useRef<THREE.Group>(null);
  
  const particles = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 10,
        Math.random() * 4 - 1,
        (Math.random() - 0.5) * 10,
      ] as [number, number, number],
      speed: 0.2 + Math.random() * 0.8,
      offset: Math.random() * Math.PI * 2,
      size: 0.02 + Math.random() * 0.04,
      color: ["#ff3333", "#ff5555", "#ffaaaa", "#ffffff"][Math.floor(Math.random() * 4)],
    }));
  }, []);
  
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
          <meshStandardMaterial
            color={p.color}
            emissive={p.color}
            emissiveIntensity={0.6}
            transparent
            opacity={0.7}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ─── Star field background ─── */
function StarField() {
  const stars = useMemo(() => {
    return Array.from({ length: 100 }, () => ({
      position: [
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 20 + 5,
        (Math.random() - 0.5) * 40 - 10,
      ] as [number, number, number],
      size: 0.02 + Math.random() * 0.04,
    }));
  }, []);
  
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

/* ────────────────────────────────
   CHAO CHARACTER — The Claw
   ──────────────────────────────── */

function ChaoBody() {
  return (
    <mesh position={[0, 0, 0]} scale={[1, 0.85, 0.95]}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial color="#0a0a0a" roughness={0.4} metalness={0.15} />
    </mesh>
  );
}

function ChaoHead() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = 1.4 + Math.sin(state.clock.elapsedTime * 1.5) * 0.08;
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, MOUSE.x * 0.6, 0.04);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -MOUSE.y * 0.3, 0.04);
    }
  });

  return (
    <group ref={groupRef} position={[0, 1.4, 0]}>
      <mesh scale={[0.95, 0.9, 0.95]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#111111" roughness={0.35} metalness={0.2} />
      </mesh>

      {/* Red energy stripe */}
      <mesh position={[0, 0.35, 0.82]} rotation={[0.1, 0, 0]} scale={[0.3, 0.12, 0.1]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial color="#ff3333" emissive="#ff1111" emissiveIntensity={0.8} roughness={0.2} />
      </mesh>

      {/* Left Eye */}
      <group position={[-0.32, 0.05, 0.78]}>
        <mesh scale={[0.28, 0.32, 0.15]}>
          <sphereGeometry args={[1, 24, 24]} />
          <meshStandardMaterial color="#ffffff" roughness={0.2} />
        </mesh>
        <mesh position={[0, 0, 0.12]} scale={[0.14, 0.16, 0.08]}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshStandardMaterial color="#0a0a0a" roughness={0.1} />
        </mesh>
        <mesh position={[0.06, 0.06, 0.16]} scale={[0.05, 0.05, 0.02]}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1} />
        </mesh>
      </group>

      {/* Right Eye */}
      <group position={[0.32, 0.05, 0.78]}>
        <mesh scale={[0.28, 0.32, 0.15]}>
          <sphereGeometry args={[1, 24, 24]} />
          <meshStandardMaterial color="#ffffff" roughness={0.2} />
        </mesh>
        <mesh position={[0, 0, 0.12]} scale={[0.14, 0.16, 0.08]}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshStandardMaterial color="#0a0a0a" roughness={0.1} />
        </mesh>
        <mesh position={[-0.06, 0.06, 0.16]} scale={[0.05, 0.05, 0.02]}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1} />
        </mesh>
      </group>

      {/* Hair crest */}
      <group position={[0, 0.85, 0]}>
        <mesh scale={[0.35, 0.3, 0.35]}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.2, 0]} scale={[0.18, 0.15, 0.18]}>
          <sphereGeometry args={[1, 12, 12]} />
          <meshStandardMaterial color="#ff3333" emissive="#ff1111" emissiveIntensity={0.5} roughness={0.3} />
        </mesh>
      </group>

      {/* Blush marks */}
      <mesh position={[-0.55, -0.15, 0.6]} scale={[0.1, 0.06, 0.04]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshStandardMaterial color="#ff5555" transparent opacity={0.4} />
      </mesh>
      <mesh position={[0.55, -0.15, 0.6]} scale={[0.1, 0.06, 0.04]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshStandardMaterial color="#ff5555" transparent opacity={0.4} />
      </mesh>
    </group>
  );
}

function ChaoWings({ time }: { time: number }) {
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
      <group ref={leftWing} position={[-0.7, 0.4, -0.2]}>
        <mesh rotation={[0.3, 0.5, 0]} scale={[0.5, 0.5, 0.5]}>
          <shapeGeometry args={[wingShape]} />
          <meshStandardMaterial color="#ff3333" transparent opacity={0.7} side={THREE.DoubleSide} emissive="#ff1111" emissiveIntensity={0.2} />
        </mesh>
      </group>
      <group ref={rightWing} position={[0.7, 0.4, -0.2]}>
        <mesh rotation={[0.3, -0.5, 0]} scale={[-0.5, 0.5, 0.5]}>
          <shapeGeometry args={[wingShape]} />
          <meshStandardMaterial color="#ff3333" transparent opacity={0.7} side={THREE.DoubleSide} emissive="#ff1111" emissiveIntensity={0.2} />
        </mesh>
      </group>
    </group>
  );
}

function ChaoFeet({ time }: { time: number }) {
  const leftFoot = useRef<THREE.Mesh>(null);
  const rightFoot = useRef<THREE.Mesh>(null);

  useFrame(() => {
    const bounce = Math.sin(time * 3) * 0.05;
    if (leftFoot.current) leftFoot.current.position.y = -0.75 + bounce;
    if (rightFoot.current) rightFoot.current.position.y = -0.75 + Math.cos(time * 3) * 0.05;
  });

  return (
    <group>
      <mesh ref={leftFoot} position={[-0.4, -0.75, 0.3]} scale={[0.22, 0.18, 0.28]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.5} />
      </mesh>
      <mesh ref={rightFoot} position={[0.4, -0.75, 0.3]} scale={[0.22, 0.18, 0.28]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.5} />
      </mesh>
    </group>
  );
}

function ChaoHalo() {
  const haloRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (haloRef.current) {
      haloRef.current.rotation.z = state.clock.elapsedTime * 0.5;
      haloRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
    }
  });

  return (
    <mesh ref={haloRef} position={[0, 2.3, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[0.55, 0.03, 8, 32]} />
      <meshStandardMaterial color="#ff4444" emissive="#ff2222" emissiveIntensity={1.5} transparent opacity={0.8} />
    </mesh>
  );
}

/* ─── Wandering animation for the Claw ─── */
function WanderingChao() {
  const groupRef = useRef<THREE.Group>(null);
  const timeRef = useRef(0);
  
  useFrame((state) => {
    timeRef.current = state.clock.elapsedTime;
    if (groupRef.current) {
      /* Gentle wandering on the island */
      groupRef.current.position.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.4;
      groupRef.current.position.z = Math.cos(state.clock.elapsedTime * 0.2) * 0.3;
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.3;
    }
  });
  
  return (
    <group ref={groupRef} scale={0.65} position={[0, 0.3, 0]}>
      <ChaoBody />
      <ChaoHead />
      <ChaoWings time={timeRef.current} />
      <ChaoFeet time={timeRef.current} />
      <ChaoHalo />
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
      {/* Lighting — soft dreamy Chao Garden style */}
      <ambientLight intensity={0.4} color="#e8e0ff" />
      <directionalLight position={[3, 8, 4]} intensity={1.2} color="#fff8f0" />
      <pointLight position={[-3, 4, -3]} intensity={0.8} color="#ff5555" />
      <pointLight position={[3, 2, 3]} intensity={0.5} color="#ff9999" />
      <pointLight position={[0, -1, 0]} intensity={0.3} color="#4444ff" />
      
      {/* Fog-like atmosphere via distant light */}
      <hemisphereLight args={["#ff5555", "#0a0e1a", 0.3]} />

      {/* Garden World */}
      <GardenWorld />

      {/* The Claw, wandering on main island */}
      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
        <WanderingChao />
      </Float>

      {/* Invisible hit plane for mouse tracking */}
      <mesh position={[0, 0, -2]} visible={false}>
        <planeGeometry args={[20, 20]} />
        <meshBasicMaterial />
      </mesh>
    </group>
  );
}

/* ═══════════════════════════════════════════════════════════
   EXPORT — MAD Garden
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
