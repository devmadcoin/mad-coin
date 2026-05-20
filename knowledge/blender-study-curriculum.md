# Blender Study Curriculum — $MAD Mascot Pipeline

**Goal:** Learn enough Blender to model the $MAD mascot properly, then export as `.glb` for the website.

**Why Blender over Three.js primitives:**
- Real topology (smooth organic shapes, not blocky spheres)
- Proper edge flow for the round head, defined jaw, organic limbs
- Sculpting for angry eyebrow ridges, mouth creases
- Materials with normal maps, roughness maps, emission
- Rigging for poseable character (walk, sit, excited)
- Export as glTF 2.0 → drag-and-drop into Three.js

---

## Phase 1: Blender Fundamentals (2-3 days)

### Must-Watch Free Tutorials

1. **Blender Guru — Donut Tutorial (Blender 4.0)**
   - YouTube, 5 hours, 10.7M views
   - Link: https://www.youtube.com/playlist?list=PLjEaoINr3zgFX8ZsChQVQsuDSjEqdWMAD
   - **Why:** Covers EVERY fundamental — interface, modeling, sculpting, shading, lighting, rendering
   - **Do:** Full tutorial, don't skip. It's the Blender bible.

2. **Ryan King Art — Complete Beginner Tutorial Series**
   - YouTube, 6 hours, 1.1M views
   - Link: https://www.youtube.com/@RyanKingArt
   - **Why:** Faster than Donut, project-based (house + environment)
   - **Do:** If Donut feels too long, do this instead

3. **Blender Official — Fast Track (2.8+)**
   - Link: https://www.blender.org/support/tutorials/
   - **Why:** Official, covers interface + hotkeys

### Key Hotkeys to Memorize
```
G           = Grab/Move
S           = Scale
R           = Rotate
E           = Extrude
Tab         = Edit/Object mode toggle
Ctrl+R      = Loop Cut
Ctrl+B      = Bevel
Shift+A     = Add menu
X           = Delete
Ctrl+Z      = Undo
Shift+D     = Duplicate
Ctrl+J      = Join objects
Alt+Click   = Select edge loop
. (period)  = Pivot to selection
```

---

## Phase 2: Chibi Character Modeling (3-5 days)

### Core Techniques for $MAD Mascot

**Chibi Proportions Rule:**
- Head = 1:1 scale (same as reference)
- Body = 1/3 of head height
- Arms/Legs = stubby, about 1/2 head height
- Eyes = 1/3 of face width each
- Big round head is everything

### Tutorials to Study

1. **Sasha Luvr — "Create Your First Chibi Character" (Skillshare)**
   - **Why:** Exact chibi workflow — box modeling head, eye placement, body proportions
   - **Key lessons:** Head sphere → subdivision, eye socket topology, cheek puffiness
   - **Apply to $MAD:** Same head shape, add angry eyebrows instead of cute

2. **Grant Abbitt — "Blender Character Creator for Video Games" (Udemy)**
   - 17 hours, 4.8/5 rating
   - **Why:** Complete pipeline — model → sculpt → texture → rig → export
   - **Focus on:** Low-poly techniques, game-ready topology

3. **YouTube Search: "Blender chibi box modeling"**
   - Channels: Darrin Lile, Imphenzia, Danny Mac
   - **Why:** Free, fast, shows actual workflow

### $MAD-Specific Modeling Order
```
1. Reference image planes (front + side view)
2. Head: UV Sphere → Edit mode → scale to perfect circle
3. Eyes: Delete face loops → inset circles → extrude back
4. Eyebrows: Sculpt mode → grab tool for angry ridge
5. Mouth: Edge loop cut → extrude in for frown
6. Body: Cylinder → scale down → round the belly
7. Arms/Legs: Cylinders + spheres for joints
8. Boots: Separate mesh, blocky style
9. Backpack: Box modeling, straps
10. Merge all → Shade Smooth → Subdivision Surface
```

---

## Phase 3: Materials & Texturing (1-2 days)

### For $MAD Mascot

**Skin/Head Material:**
- Base color: #E60000 (red)
- Subsurface scattering: 0.2 (gives that soft toy look)
- Roughness: 0.3 (slight shine, not plastic)
- Normal map: subtle fabric texture

**Eye Material:**
- Sclera: White, glossy
- Pupil: Black, slight emission for "alive" look
- Glint: Tiny white sphere with emission

**Boot/Glove Material:**
- Black, roughness 0.6
- Slight metalness 0.2 for leather look

**Backpack Material:**
- Dark gray, rough
- Emissive red strip for $MAD branding

### Tutorials
- **Blender Guru — Materials series** (part of Donut)
- **Ducky 3D — "How to make any material in Blender"**

---

## Phase 4: Rigging for Animation (2-3 days)

### What You Need

**Rig for web export:**
- Armature with bones for: head, torso, arms (upper/lower), legs (upper/lower), boots
- IK for legs (automatic foot placement)
- FK for arms (direct rotation control)
- Shape keys for: eyebrow raise, mouth open, eye blink

**Animations to create:**
1. Idle (breathing, slight sway)
2. Walk cycle (4 keyframes: contact, down, pass, up)
3. Sit (smooth transition from standing)
4. Excited bounce (squash + stretch)
5. Wave (for chat reaction)

### Tutorials
1. **Royal Skies — "Blender Rigging Tutorial"** (YouTube, 2 hours)
2. **Pierrick Picaut — "Game Character Rigging"** (Gumroad)
3. **Darrin Lile — "Blender Character Animation"** (LinkedIn Learning)

---

## Phase 5: Export to Web (1 day)

### glTF 2.0 Export Pipeline

**Blender → Three.js:**
```
1. File → Export → glTF 2.0 (.glb)
2. Settings:
   - Format: glTF Binary (.glb)
   - Include: ✅ Cameras, ✅ Lights (optional)
   - Data: ✅ Materials (Principled BSDF → PBR)
   - Compression: Draco (reduces file size 80%)
   - Animations: ✅ Skinning, ✅ Morph targets
3. Test in: https://gltf-viewer.donmccurdy.com/
```

**Three.js Import:**
```javascript
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const loader = new GLTFLoader();
loader.load('/models/mad-mascot.glb', (gltf) => {
  const model = gltf.scene;
  const animations = gltf.animations; // idle, walk, sit, excited
  scene.add(model);
});
```

### Tutorials
- **Don McCurdy — glTF Viewer** (test your exports)
- **Three.js Journey — "Loading Models"** (Bruno Simon)
- **Poimandres — "react-three-fiber + glTF"**

---

## Phase 6: Integration into $MAD Website (1 day)

### Replace Procedural Claw with GLB Model

```typescript
// MadChao3D.tsx — new version
import { useGLTF, useAnimations } from '@react-three/drei';

function MADMascot() {
  const { scene, animations } = useGLTF('/models/mad-mascot.glb');
  const { actions } = useAnimations(animations, scene);
  
  // Trigger animations
  const playWalk = () => actions['walk']?.play();
  const playExcited = () => actions['excited']?.play();
  
  return <primitive object={scene} scale={0.5} />;
}
```

### Benefits Over Current Procedural Model
- **File size:** 500KB glb vs 23KB code (but looks 100x better)
- **Animation:** Proper walk cycle, smooth transitions
- **Materials:** Real PBR with normal maps
- **LOD:** Can have low-poly version for mobile
- **Future:** Easy to add new outfits, accessories

---

## Total Time Investment

| Phase | Days | Hours/Day |
|-------|------|-----------|
| Fundamentals | 3 | 2-3 |
| Chibi Modeling | 5 | 2-3 |
| Materials | 2 | 1-2 |
| Rigging | 3 | 2-3 |
| Export + Web | 1 | 2 |
| **Total** | **~14 days** | **~35 hours** |

---

## Alternative: Skip Learning, Commission It

**If 2 weeks is too long:**

**Fiverr Chibi Modelers ($30-100):**
- Search: "chibi 3D character model blender"
- Deliverables: .blend + .glb + textures
- Provide: Your reference image + proportion notes
- Timeline: 3-7 days

**Then I wire it into the website** (same integration code above).

---

## Recommended Daily Practice

**Days 1-3:** Watch Donut tutorial, replicate each step
**Days 4-7:** Model simple chibi from reference (not $MAD yet, practice character)
**Days 8-10:** Model $MAD mascot with your reference image
**Days 11-12:** Materials + test renders
**Days 13-14:** Rig + export + website integration

---

*Study log: Created 2026-05-20*
*Next update: When phase completed*
