# $MAD Mascot — 3D Modeling Study Plan

**Created:** 2026-05-20
**Goal:** Build a proper $MAD mascot in Blender, export as .glb, integrate into website

---

## The Problem

Current mascot in `MadChao3D.tsx` is built from Three.js primitives (spheres, boxes, capsules). It hits a ceiling at ~80% fidelity because:
- No smooth organic shapes (subdivision surfaces)
- No proper topology for facial features
- Materials are flat (no normal maps, no subsurface scattering)
- No real rigging (just group rotations)

**Solution:** Model in Blender → export glTF → load in Three.js

---

## Free Learning Resources (Curated)

### 1. Blender Fundamentals (Start Here)

**Blender Guru — Donut Tutorial (Blender 4.0)**
- YouTube: `Blender 4.0 Beginner Donut Tutorial`
- ~5 hours total
- **What you learn:** Interface, modeling, sculpting, materials, lighting, rendering
- **Why it's the one:** Covers EVERYTHING. The Blender bible. 10M+ views.
- **My hotkey cheatsheet:**
  - `G` = grab, `S` = scale, `R` = rotate
  - `E` = extrude, `Tab` = edit mode
  - `Ctrl+R` = loop cut, `Ctrl+B` = bevel
  - `Shift+A` = add, `Shift+D` = duplicate
  - `Alt+Click` = select edge loop

### 2. Chibi Character Modeling (The $MAD Shape)

**Sasha Luvr — "Create Your First Chibi Character" (Skillshare)**
- Exact chibi workflow from reference image
- Head: UV Sphere → subdivide → shape
- Eyes: inset circles, extrude back
- Body: 1/3 head height, stubby limbs

**YouTube: "Blender chibi box modeling"**
- Channels: Imphenzia, Danny Mac, Darrin Lile
- Free, shows actual workflow speed

### 3. Export to Web

**Don McCurdy glTF Viewer**
- https://gltf-viewer.donmccurdy.com/
- Test your exports before touching code

**Three.js + glTF**
- `useGLTF()` from @react-three/drei
- `useAnimations()` for playing exported anims

---

## The $MAD Modeling Spec (From Reference)

Based on your reference image, the model needs:

```
HEAD
- Perfect sphere, radius = 1.0 unit
- Smooth surface, slight cheek puffiness
- Small ear bumps on sides

FACE
- Eyes: Large white sclera (almond shape), black pupils
  - Position: y=0.1, x=±0.3, z=0.85
  - Scale: 0.25 x 0.2 x 0.05
- Eyebrows: Sharp V-shape, thick, dark
  - Position: y=0.35, angled inward-down
  - Created via sculpting (grab tool) or separate mesh
- Mouth: Small downturned curve
  - Position: y=-0.2
  - Simple edge loop extrude
- Nose: Subtle bump (optional, chibis often skip)

BODY
- Compact, rounded
- Height: ~0.6 units (60% of head)
- Width: ~0.7 units (wider than tall)
- Belly: Slight forward curve

ARMS
- Short, stubby
- Upper arm: 0.3 length
- Forearm: 0.25 length
- Gloves: Black, rounded at ends

LEGS
- Short, thick thighs
- Boots: Black, blocky/chibi style
- Sole: Flat bottom

BACKPACK
- Small, sits on back
- Dark color with red $MAD emblem
- Straps visible over shoulders
```

---

## Web Export Checklist

When the model is done, export as:
- **Format:** glTF Binary (.glb)
- **Draco compression:** Enabled (80% smaller)
- **Animations:** Include (walk, idle, sit, excited)
- **Materials:** Principled BSDF → PBR auto-convert
- **Target file size:** Under 2MB for web

Then in Three.js:
```typescript
import { useGLTF, useAnimations } from '@react-three/drei';

function MADMascot() {
  const { scene, animations } = useGLTF('/models/mad-mascot.glb');
  const { actions } = useAnimations(animations, scene);
  
  return <primitive object={scene} scale={0.5} />;
}
```

---

## Time Estimate

| Phase | Hours | Output |
|-------|-------|--------|
| Learn Blender basics | 10-15 | Can navigate, model simple shapes |
| Model chibi practice | 8-12 | Generic chibi character |
| Model $MAD mascot | 6-10 | Your mascot from reference |
| Materials + texture | 4-6 | Red skin, black boots, white eyes |
| Rig + animate | 8-12 | Idle, walk, sit, excited |
| Export + web test | 2-4 | Working .glb in Three.js |
| **Total** | **38-59 hours** | **~2-3 weeks at 2-3 hrs/day** |

---

## Alternative: Commission Route

If learning isn't the priority right now:

**Fiverr "chibi 3D character" — $30-100**
- Provide: Your reference image + this spec document
- Ask for: .blend source + .glb export + 4 animations
- Timeline: 3-7 days
- Then I handle the website integration

---

## Today's Action Items

- [ ] Download Blender 4.0+ (free, blender.org)
- [ ] Start Donut Tutorial Part 1 (interface + first modeling)
- [ ] Save reference image as background plane in Blender
- [ ] Create first attempt at head sphere matching reference

---

*Study log created 2026-05-20*
