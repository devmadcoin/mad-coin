# Blender 3D Pipeline for Web — Study Notes

**Date:** 2026-06-26
**Status:** Complete

## The Pipeline Overview

### 1. Model → 2. Texture → 3. Rig (if animated) → 4. Export → 5. Optimize → 6. Web Integrate

## Modeling for Web

### Key Principles
- **Low poly is king** — Target 1,000-10,000 triangles for real-time web
- **Quads → Tris** — Blender models in quads. Export converts to triangles. Fine.
- **Clean topology** — Even edge loops, no ngons (faces with >4 edges)
- **Scale properly** — 1 unit = 1 meter in Blender. Consistent with Three.js.

### The $MAD Chao Character Workflow
1. **Concept** → Sketch or reference image (Sonic Advance Chao aesthetic)
2. **Base mesh** → Start with cube/sphere, sculpt or box-model
3. **Details** → Add eyes, mouth, accessories (halo, wings, etc.)
4. **Symmetry** → Use Mirror modifier for symmetrical parts

## Texturing

### PBR Workflow (Physically Based Rendering)
- **Base Color** — What color is the surface
- **Roughness** — How shiny/dull (black = mirror, white = matte)
- **Metallic** — Is it metal? (0 = plastic, 1 = chrome)
- **Normal** — Fake surface detail without geometry
- **Emission** — Self-illuminating (glow effects)

### For Web (Optimized)
- Bake everything to **one texture atlas** when possible
- **2048x2048 max** for hero assets. 512x512 for background props.
- **PNG with alpha** for transparent parts
- **KTX2/Basis Universal** compression for fastest loading

## Exporting for Web

### GLB/GLTF (The Standard)
- **GLB** = Single binary file (texture + mesh + materials)
- **GLTF** = JSON + separate files
- **GLB is preferred** for web — one file, one HTTP request

### Export Settings (Blender → Web)
```
File → Export → glTF 2.0 (.glb/.gltf)
- Format: glTF Binary (.glb)
- Include: Selected Objects (or All)
- Transform: +Y Up (standard for web)
- Geometry: Apply Modifiers, UVs, Normals
- Materials: Principled BSDF (PBR)
- Compression: Draco (reduces file size 80-90%)
- Animations: Include if rigged
```

### File Size Targets
| Asset Type | Triangle Count | Texture Size | GLB Size |
|------------|---------------|--------------|----------|
| Hero character | 5,000-15,000 | 2048x2048 | 1-3 MB |
| Background prop | 500-2,000 | 512x512 | 100-500 KB |
| UI element | 100-500 | 256x256 | 20-50 KB |

## Web Integration (Three.js / React Three Fiber)

### The Stack
- **Three.js** — Core 3D library
- **React Three Fiber** — React renderer for Three.js (declarative)
- **Drei** — Helper components (environment, controls, etc.)
- **GLTFLoader** — Built into Three.js, loads .glb files

### Basic Code Pattern
```jsx
import { Canvas } from '@react-three/fiber'
import { useGLTF, OrbitControls } from '@react-three/drei'

function MADChao() {
  const { scene } = useGLTF('/models/mad-chao.glb')
  return <primitive object={scene} scale={0.5} />
}

function Scene() {
  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <MADChao />
      <OrbitControls />
    </Canvas>
  )
}
```

### Optimization for Web
1. **Draco compression** — Blender export with Draco. Three.js GLTFLoader with Draco decoder.
2. **LOD (Level of Detail)** — Far away = lower poly model. Close = higher detail.
3. **Texture compression** — Basis Universal / KTX2.
4. **Instancing** — Same mesh repeated 100x? Use InstancedMesh.
5. **Lazy loading** — Load 3D only when in viewport (IntersectionObserver).

## The $MAD Chao Integration Plan

### Where It Goes
- **Website hero section** — Floating $MAD Chao, slowly rotating, reacting to mouse
- **/mad-mind page** — Companion character next to the chat interface
- **Loading screen** — Animated $MAD Chao during page transitions
- **Game bridge** — Same character model in Roblox (via mesh import) and on web

### Technical Implementation
```jsx
// Floating animation with mouse interaction
import { useFrame, useGLTF } from '@react-three/drei'
import { useRef } from 'react'
import * as THREE from 'three'

function FloatingChao() {
  const ref = useRef()
  const { scene } = useGLTF('/models/mad-chao.glb')
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    ref.current.position.y = Math.sin(t) * 0.1 + 0.5
    ref.current.rotation.y = Math.sin(t * 0.5) * 0.2
    // Mouse parallax could be added here
  })
  
  return <primitive ref={ref} object={scene} scale={0.5} />
}
```

### Blender → Roblox Bridge
- Export from Blender as **FBX** (Roblox imports FBX)
- Or export **OBJ** for mesh parts
- Texture as **PNG** with alpha
- Roblox **MeshPart** for custom characters
- Limitations: Roblox has 10,000 triangle limit per mesh, 1024x1024 texture limit

## Resources
- **Blender** — https://blender.org (free, open source)
- **Three.js** — https://threejs.org
- **React Three Fiber** — https://docs.pmndrs.react-three-fiber.org
- **Drei** — https://github.com/pmndrs/drei
- **GLTF Validator** — https://github.khronos.org/glTF-Validator
- **Blender to GLTF guide** — https://docs.blender.org/manual/en/latest/addons/import_export/scene_gltf2.html

## Key Insight

The $MAD Chao isn't just a cute character. It's a **cross-platform brand asset** — web, Roblox, future AR/VR. Building it once in Blender, optimizing for web, and keeping a Roblox-compatible version means the same character appears everywhere. That's how you build recognizable IP, not just a website decoration.
