"use client";

import { useRef, useMemo, useEffect, useState, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";

/* ═══════════════════════════════════════════════════════════
   MAD TRACK DAY — Complete Scene
   Procedural car paint + sculpted Chao + environment + animation
   ═══════════════════════════════════════════════════════════ */

function CompleteScene() {
  const { scene, animations } = useGLTF("/mad-scene-complete.glb");
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const carRef = useRef<THREE.Object3D | null>(null);
  const chaoHeadRef = useRef<THREE.Object3D | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Setup animation mixer
    if (animations && animations.length > 0) {
      const mixer = new THREE.AnimationMixer(scene);
      animations.forEach((clip) => {
        const action = mixer.clipAction(clip);
        action.play();
        action.setLoop(THREE.LoopRepeat, Infinity);
      });
      mixerRef.current = mixer;
    }

    // Find key objects by name
    scene.traverse((child) => {
      if (child.name === "CarBody_v6" || child.name.includes("CarBody")) {
        carRef.current = child;
      }
      if (child.name === "ChaoHead_v6" || child.name.includes("ChaoHead")) {
        chaoHeadRef.current = child;
      }
    });

    // Mouse tracking
    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", onMouseMove);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      if (mixerRef.current) {
        mixerRef.current.stopAllAction();
        mixerRef.current = null;
      }
    };
  }, [scene, animations]);

  useFrame((state, delta) => {
    // Update baked animation
    if (mixerRef.current) {
      mixerRef.current.update(delta);
    }

    // Chao head mouse tracking (on top of baked animation)
    if (chaoHeadRef.current) {
      const targetX = mouseRef.current.x * 0.3;
      const targetY = mouseRef.current.y * 0.2;
      chaoHeadRef.current.rotation.y = THREE.MathUtils.lerp(
        chaoHeadRef.current.rotation.y,
        targetX,
        delta * 3
      );
      chaoHeadRef.current.rotation.x = THREE.MathUtils.lerp(
        chaoHeadRef.current.rotation.x,
        targetY,
        delta * 3
      );
    }
  });

  return <primitive object={scene} />;
}

/* ═══════════════════════════════════════════════════════════
   STAR FIELD
   ═══════════════════════════════════════════════════════════ */
function StarField() {
  const count = 120;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 20 + Math.random() * 40;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.cos(phi) + 8;
      arr[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    return arr;
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#ffffff" size={0.04} transparent opacity={0.5} sizeAttenuation />
    </points>
  );
}

/* ═══════════════════════════════════════════════════════════
   LIGHTING
   ═══════════════════════════════════════════════════════════ */
function Lighting() {
  return (
    <group>
      <directionalLight position={[6, 12, 8]} intensity={4.0} color="#fff5f0" castShadow />
      <directionalLight position={[-6, 8, -4]} intensity={1.5} color="#a0c8ff" />
      <pointLight position={[0, 3, 0]} intensity={3.0} color="#ff0044" distance={25} />
      <pointLight position={[-4, 2, 4]} intensity={1.5} color="#00ffff" distance={20} />
      <pointLight position={[4, 2, -4]} intensity={1.5} color="#ff00ff" distance={20} />
      <ambientLight intensity={0.4} color="#1a0a1a" />
      <hemisphereLight args={["#ff2244", "#050005", 0.35]} />
    </group>
  );
}

/* ═══════════════════════════════════════════════════════════
   CAMERA RIG (slow orbit)
   ═══════════════════════════════════════════════════════════ */
function CameraRig() {
  useFrame((state) => {
    const t = state.clock.elapsedTime * 0.08;
    state.camera.position.x = Math.sin(t) * 8;
    state.camera.position.z = Math.cos(t) * 8;
    state.camera.position.y = 3 + Math.sin(t * 0.5) * 1;
    state.camera.lookAt(0, 0.5, 0);
  });
  return null;
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
        <CompleteScene />
      </Suspense>
      <CameraRig />
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
        camera={{ position: [8, 3, 8], fov: 45 }}
        style={{ background: "#050005" }}
        gl={{ antialias: true, alpha: true }}
      >
        <Scene />
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          maxPolarAngle={Math.PI / 2.1}
          minPolarAngle={Math.PI / 12}
          autoRotate
          autoRotateSpeed={0.2}
          minDistance={3}
          maxDistance={20}
        />
      </Canvas>
    </div>
  );
}

// Preload
try {
  useGLTF.preload("/mad-scene-complete.glb");
} catch {
  // Static preloading might fail, runtime Suspense handles it
}
