# $MAD CHAO — Official Character Specification
## Version 1.0 | 2026-05-21
## Reference Image: 20260521_user_mad_chao_reference_pixel_fire_red.jpg

---

## 1. CORE IDENTITY

**Name:** MAD Chao (informally: "the $MAD")
**Role:** $MAD brand mascot, community avatar, game character, PFP identity
**Archetype:** Rebel + Magician (transformation through defiance)
**Energy:** Controlled chaos — angry but purposeful, not destructive

---

## 2. COLOR SYSTEM (LOCKED)

### Primary
| Color | Hex | RGB | Usage |
|-------|-----|-----|-------|
| **MAD Red** | `#FF2D2D` | 255, 45, 45 | Body, primary fill |
| **Flame Orange** | `#FF6B00` | 255, 107, 0 | Flame crown, accents, energy |
| **Dark Ash** | `#0A0A0A` | 10, 10, 10 | Background, void space |

### Secondary
| Color | Hex | RGB | Usage |
|-------|-----|-----|-------|
| **Ember Yellow** | `#FFD700` | 255, 215, 0 | Flame core, highlights, "hot" states |
| **Bone White** | `#F5F5F5` | 245, 245, 245 | Eye sclera, teeth, text on dark |
| **Shadow Black** | `#1A1A1A` | 26, 26, 26 | Outline, depth, dimensional shadow |

### Usage Rules
- **Body**: MAD Red with subtle gradient → darker at bottom (gravity)
- **Flame**: Ember Yellow core → Flame Orange mid → transparent/wispy tips
- **Eyes**: Bone White sclera + pure black pupils (no iris = intensity)
- **Background**: Always Dark Ash or darker — never light backgrounds
- **Glow**: Flame emits subtle orange bloom (hex: `#FF6B00` at 30% opacity)

---

## 3. PROPORTIONS & ANATOMY

### Base Form ("Easy to Draw" Standard)
```
        [FLAME]
           |
      [HEAD] ← perfectly circular
      /    \
 [ARM]      [ARM] ← short, stubby, rounded
    |        |
 [BODY] ← slightly smaller circle, overlaps head
    |        |
 [LEG]      [LEG] ← short, no ankles, rounded feet
    
 [WINGS/TAIL] ← small, pointed, 2-3 prongs
```

### Measurements (relative to head diameter = 1 unit)
| Feature | Ratio | Notes |
|---------|-------|-------|
| Head | 1.0 | Perfect circle, slightly flattened top for flame |
| Body | 0.85 | Sits below head, overlaps ~20% |
| Arms | 0.35 length, 0.2 width | Stubby, no elbows visible |
| Legs | 0.4 length, 0.25 width | Rounded, no ankles |
| Flame | 0.5 height | Teardrop shape, emanates from top center |
| Wings/Tail | 0.3 length | 2-3 prongs, angled up/back |
| Eyes | 0.2 diameter each | Large, expressive, dominate face |

### Design Rules
1. **No neck** — head connects directly to body (Kirby/Chao rule)
2. **No fingers** — mitten-style hands
3. **No toes** — rounded foot nubs
4. **Outline**: 2-3px Shadow Black on all forms (pixel art = 1px)
5. **Symmetry**: Base pose is symmetrical, asymmetry only for action poses
6. **Minimum size**: 32×32 pixels (favicon/emoji), 128×128 (PFP), 512×512 (HQ)

---

## 4. EMOTIONAL STATE SYSTEM (5 States)

Like Chao's heart/?/!/swirl system, MAD Chao has 5 core emotional states:

### 1. DEFIANT (Default)
- **Expression**: Eyebrows angled down/inward, frown, arms crossed
- **Flame**: Steady burn, moderate height
- **Use**: Default avatar, PFP, brand logo
- **Vibe**: "I'm ready. Try me."

### 2. RAGING (Peak Energy)
- **Expression**: Eyes wide, teeth bared, arms raised/clenched
- **Flame**: Tall, wild, flickering rapidly
- **Use**: All-caps tweets, hype moments, ATH celebrations
- **Vibe**: "LET'S GO. WE'RE DOING THIS."

### 3. FOCUSED (Building)
- **Expression**: Single eye squint, slight smirk, one arm forward
- **Flame**: Low, contained, intense blue-white core
- **Use**: Study sessions, grind posts, "building" content
- **Vibe**: "Head down. Work."

### 4. CHILL (Community)
- **Expression**: Relaxed eyes, small smile, arms at sides
- **Flame**: Gentle candle-like flicker
- **Use**: Casual replies, "comfy hold" moments, rest
- **Vibe**: "We're good. Relax."

### 5. BERSERK (Rare / Comedic)
- **Expression**: Swirl eyes (dizzy), tongue out, arms flailing
- **Flame**: Oversized, chaotic, sparks flying
- **Use**: Meme reactions, absurdity, "what just happened"
- **Vibe**: "Too much. Send help."

### State Transitions
- States should feel like the SAME character, not different designs
- Only eyebrows, mouth, arm position, and flame intensity change
- Body shape NEVER changes (consistency rule)

---

## 5. PIXEL ART AESTHETIC (LOCKED)

### Why Pixel Art?
1. **Retro gaming DNA** — connects to Sonic Advance, Chao Garden era
2. **Crypto-native** — pixel PFPs = cultural standard (Cryptopunks, etc.)
3. **Scalable** — looks intentional at 32px, 128px, or 4K
4. **Easy to draw** — even non-artists can reproduce
5. **Nostalgia trigger** — 2000s gaming = emotional anchor for target demo

### Pixel Art Rules
- **Resolution**: Base at 64×64, scale up with nearest-neighbor (no blur)
- **Color count**: Max 16 colors per sprite (authentic retro feel)
- **Outline**: 1px black outline on all forms
- **Dithering**: Minimal — use flat colors with 1-2 shade gradients
- **Animation**: 4-frame loops max (retro constraint = charm)

### Animation Frames
| Animation | Frames | Description |
|-----------|--------|-------------|
| **Idle** | 2 frames | Subtle bob (0.5px up/down), flame flicker |
| **Walk** | 4 frames | Bounce walk, arms swing, flame trails |
| **Jump** | 4 frames | Squash → stretch → peak → land |
| **Rage** | 3 frames | Shake + flame burst + screen shake |
| **Chill** | 2 frames | Gentle sway, tiny flame pulse |

---

## 6. ENVIRONMENTAL INTEGRATION

### The $MAD Garden (Chao Garden Equivalent)
- **Theme**: Volcanic garden — not peaceful, but energized
- **Ground**: Dark obsidian stone, cracks with orange glow
- **Sky**: Always dark, ember particles floating
- **Water**: Not water — lava pools (orange, bubbling)
- **Plants**: Fire-flowers, obsidian crystals, flame-trees
- **Capacity**: 24 MAD Chao max (like Chao Garden limit)

### Chao Garden Emotional States (Environment Reactivity)
- Petting → flame brightens slightly, eyes soften
- Picking up → squirms, flame flickers
- Throwing → rage state triggers briefly
- Feeding → "power up" animation (like ring collection)
- Sleeping → flame dims to ember, eyes close

---

## 7. CROSS-PLATFORM USAGE

| Platform | Size | Style | Notes |
|----------|------|-------|-------|
| **X PFP** | 400×400 | Pixel, DEFIANT state | Head-shot crop, flame visible |
| **Telegram Avatar** | 512×512 | Pixel, DEFIANT state | Same as X |
| **Website Favicon** | 32×32 | Pixel, head only | Flame = identifiable at 32px |
| **Discord Emoji** | 128×128 | Pixel, any state | Transparent background |
| **Game Sprite** | 64×64 | Pixel, animated | All 5 states, 4 animations |
| **Merch Print** | Vector | Smooth pixel-art | MAD Red + Flame Orange on black |
| **3D Model** | 2048×2048 | Voxel/pixel texture | For Roblox integration |

---

## 8. THE "EASY TO DRAW" TEST

### 30-Second Sketch Guide
1. Draw a circle (head)
2. Add a smaller circle overlapping bottom (body)
3. Draw two stubby arms (crossed = defiant, raised = rage)
4. Add two short legs
5. Put a flame on top
6. Add angry eyes + frown
7. Color it red

**Pass criteria**: Recognizable as MAD Chao. That's it.

---

## 9. SOUND DESIGN (Audio Identity)

### Proposed $MAD Audio Signature
| Event | Sound Description |
|-------|-------------------|
| **Idle** | Low ember crackle (subtle, ambient) |
| **Rage trigger** | Flame WHOOSH up |
| **Transaction/Win** | Short flame burst + ember pop |
| **Level up** | 3-note ascending (C → E → G = major chord = achievement) |
| **Brand jingle** | 5 notes: dun-dun-DUN-dun-DUN (rhythmic, memorable) |
| **Hype chant** | Crowd voice: "GET! THE! MAD! BAG!" (community audio) |

---

## 10. DESIGN PRINCIPLES (From Franchise Research)

1. **Sonic's "Easy to Draw" Rule**: Test passed — circle + flame + angry eyes
2. **Kirby's Round = Approachable**: Body is pure circle = friendly despite anger
3. **Chao's Emotional States**: 5 states = depth without complexity
4. **Metroid's Isolation**: Single character focus, no clutter
5. **Nintendo's Garden Philosophy**: MAD Chao exists in a world you want to enter
6. **SEGA's Blue vs $MAD's Red**: We own RED. Red = passion, fire, urgency, "mad"
7. **McDonald's Golden Arches**: The FLAME is our arch — simple, iconic, memorable

---

## 11. NEXT STEPS

- [ ] Vectorize base sprite (DEFIANT state) at 512×512
- [ ] Create 5-state emotion sheet (all poses)
- [ ] Animate idle loop (2 frames)
- [ ] Design MAD Garden environment concept
- [ ] Compose 5-note brand jingle
- [ ] Test "easy to draw" with non-artist
- [ ] Apply to X PFP + website favicon

---

**Color locked. Proportions locked. Style locked. This is the $MAD.**
