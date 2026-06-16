# $MAD Game Dev Learning Hub

> **Status**: Active learning in progress  
> **Goal**: Master Unity + C# → Build standalone $MAD games → Embed on website  
> **Foundation**: Already know Lua/Luau (Roblox scripting)

---

## 📚 Learning Log

| Session | Date | Topic | File |
|---------|------|-------|------|
| 01 | 2026-06-17 | C# Fundamentals | `session-01-csharp-basics.md` |
| 01 | 2026-06-17 | Roblox → Unity Mapping | `roblox-to-unity-mapping.md` |
| 01 | 2026-06-17 | WebGL Export Guide | `webgl-export-guide.md` |

---

## 🎮 Reusable Scripts

All production-ready Unity C# scripts:

| Script | Purpose |
|--------|---------|
| `MadCharacterController.cs` | First-person 3D movement + mouse look + jump |
| `CoinSystem.cs` | Collectible coins with rotation, bob, particles, save/load |
| `JeeterAI.cs` | Enemy AI (patrol, chase, attack, die states) |
| `GameManager.cs` | Singleton game state machine (menu/play/pause/gameover) |

---

## 🚀 First Project: MAD COIN RUNNER

### Concept
Endless runner + coin collector. $MAD themed.

### Core Loop
1. Player runs forward automatically
2. Swipe/Arrow keys to dodge obstacles
3. Collect $MAD coins (rotating red coins)
4. Avoid "Jeeter" enemies
5. Score = coins collected × distance
6. Share score on X

### Tech Stack
- Unity 2022.3 LTS
- C# scripting
- WebGL export
- Embedded on mad-coin.vercel.app

### Milestones
- [ ] **Week 1**: Player controller + infinite terrain
- [ ] **Week 2**: Coin collection + Jeeter obstacles
- [ ] **Week 3**: UI (score, menus, game over)
- [ ] **Week 4**: Polish + WebGL export + website embed

---

## 🗺️ Full Learning Path

```
PHASE 1: Foundations (NOW)
├── C# syntax & OOP
├── Unity Editor basics
└── Component system mindset

PHASE 2: Core Systems (Next)
├── Character controllers
├── Physics & collision
├── UI (Canvas, Text, Buttons)
├── Animation (Animator, states)
└── Audio (SFX, music)

PHASE 3: Advanced (Later)
├── NavMesh AI
├── Particle effects
├── Post-processing
├── Save/load systems
└── Mobile optimization

PHASE 4: Ship It (Goal)
├── WebGL export
├── Website embedding
├── X integration (share scores)
└── Analytics
```

---

## 🔗 Resources

### Free Courses
- Harvard CS50 Game Dev: https://cs50.harvard.edu/games/
- Unity Learn: https://learn.unity.com/
- Brackeys (YouTube): https://www.youtube.com/@Brackeys

### Documentation
- Unity Scripting API: https://docs.unity3d.com/ScriptReference/
- C# Reference: https://docs.microsoft.com/en-us/dotnet/csharp/

### Assets (Free)
- Unity Asset Store (free section)
- itch.io (free game assets)
- Kenney.nl (free 2D/3D assets)

---

## 💡 Key Insights So Far

1. **C# ≈ Typed Luau** — Same patterns, just declare types
2. **Unity Component system** — Scripts ARE components, not attached to objects
3. **WebGL is viable** — 50MB limit, but perfect for $MAD mini-games
4. **DOTween > TweenService** — Way more powerful animation library
5. **Singleton pattern is king** — GameManager, CoinManager, etc.

---

*Next session: Build actual Unity project, first scene, character controller in action.*
