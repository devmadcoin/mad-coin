# MAD Game Dev — Session 2: Unity Editor & First Scene

## 2026-06-17 — Session 2

### Learning Objective
Go from "scripts exist" to "I can build and play a scene." Understand the Unity Editor, prefabs, physics, and scene building.

---

## Part 1: Unity Editor Crash Course

### The 4 Main Windows

```
┌─────────────────────────────────────────────┐
│  HIERARCHY    │      SCENE VIEW              │
│  (objects)    │  (what you see in editor)    │
│               │                              │
│ Main Camera   │                              │
│ Directional   │  ┌──────────────┐            │
│ Light         │  │   Ground     │            │
│ Player        │  │              │            │
│   - Camera    │  │    🧍       │            │
│   - Model     │  │   Player     │            │
│ Coins         │  │              │            │
│   - Coin1     │  └──────────────┘            │
│   - Coin2     │                              │
│               │                              │
├───────────────┼──────────────────────────────┤
│  PROJECT      │      INSPECTOR               │
│  (assets)     │  (edit selected object)      │
│               │                              │
│ Materials/    │  Transform                    │
│ Scripts/      │    Position  X 0 Y 1 Z 0      │
│ Prefabs/      │    Rotation  X 0 Y 0 Z 0      │
│ Scenes/       │    Scale     X 1 Y 1 Z 1      │
│               │                              │
│               │  PlayerController (Script)    │
│               │    Speed: 5                   │
│               │    Jump: 8                    │
│               │                              │
└───────────────┴──────────────────────────────┘
```

**Hierarchy** = What's in your scene (like Roblox Explorer)  
**Scene View** = Visual editor (like Roblox Studio viewport)  
**Game View** = What the player sees (press Play to test)  
**Inspector** = Edit properties of selected object  
**Project** = All your files/assets

---

## Part 2: Building Your First Scene Step-by-Step

### Step 1: Create New 3D Project
- Unity Hub → New Project → 3D (URP or Built-in)
- Name: `MAD-Coin-Runner`

### Step 2: Scene Setup
```
1. Create Ground
   - GameObject → 3D Object → Plane
   - Rename to "Ground"
   - Scale: X=10, Y=1, Z=10
   - Position: Y=0
   - Add Material: Create → Material → Color #1a1a1a (dark grey)

2. Create Player
   - GameObject → 3D Object → Capsule
   - Rename to "Player"
   - Position: Y=1 (so it sits on ground)
   - Add Component: Character Controller
   - Remove Collider (Capsule comes with one, but CharacterController has its own)
   - Drag MadCharacterController.cs script onto Player
   - In Inspector, set:
     * Move Speed: 5
     * Sprint Speed: 10
     * Jump Force: 8
     * Mouse Sensitivity: 2

3. Create Camera Setup
   - Main Camera already exists
   - Drag Main Camera onto Player (make it a child)
   - Reset Camera Position: X=0, Y=0.6, Z=0
   - This makes camera follow player

4. Create Ground Check
   - Right-click Player → Create Empty
   - Name: "GroundCheck"
   - Position: Y=-0.9 (just below capsule bottom)
   - Drag GroundCheck into MadCharacterController's "Ground Check" slot
   - Set Ground Mask to "Everything" (or create "Ground" layer)

5. Create Light
   - Directional Light already exists
   - Position: X=0, Y=10, Z=0
   - Rotation: X=50, Y=-30, Z=0
   - Color: White, slightly warm
   - Intensity: 1

6. Create a Coin
   - GameObject → 3D Object → Cylinder
   - Rename to "Coin"
   - Scale: X=0.5, Y=0.05, Z=0.5 (flat disc)
   - Rotation: X=90, Y=0, Z=0 (stand upright)
   - Position: X=3, Y=1, Z=3
   - Create Material: Color #FF2D2D (MAD red), Metallic=0.8, Smoothness=0.5
   - Add Component: Sphere Collider (trigger)
     * Is Trigger: CHECKED
     * Radius: 0.5
   - Add Coin.cs script
   - In Inspector, set Collect Effect (create particle system or leave empty)

7. Create UI
   - GameObject → UI → Canvas
   - Right-click Canvas → UI → Text
   - Rename Text to "CoinText"
   - Position: Top-left corner
   - Text: "💰 0"
   - Font Size: 32
   - Color: White
   
   - Create CoinManager GameObject (empty)
   - Add CoinManager.cs
   - Drag CoinText into CoinManager's "Coin Text" slot
```

### Step 3: Test
- Press **Play** (▶️) at top center
- WASD to move, mouse to look, Space to jump
- Walk into coin → should disappear, score updates

---

## Part 3: Prefabs (The Secret Weapon)

### vs Roblox

**Roblox**: You clone Instances
```lua
local coinTemplate = game.ReplicatedStorage.Coin
local newCoin = coinTemplate:Clone()
newCoin.Position = Vector3.new(10, 1, 5)
newCoin.Parent = workspace
```

**Unity**: You instantiate Prefabs
```csharp
public GameObject coinPrefab;  // Drag prefab here in Inspector

void SpawnCoin(Vector3 position)
{
    Instantiate(coinPrefab, position, Quaternion.identity);
}
```

### Why Prefabs Are Better
1. **Edit once, update all** — Change the prefab, ALL instances update
2. **Override per-instance** — You can tweak individual instances without breaking the link
3. **Nested prefabs** — Prefabs inside prefabs (Roblox can't do this easily)

### Creating a Prefab
1. Drag "Coin" from Hierarchy into Project window (into Prefabs folder)
2. Delete Coin from scene (we'll spawn via script)
3. Create CoinSpawner.cs:

```csharp
using UnityEngine;

public class CoinSpawner : MonoBehaviour
{
    [SerializeField] GameObject coinPrefab;
    [SerializeField] int coinCount = 20;
    [SerializeField] float spawnRadius = 20f;
    
    void Start()
    {
        for (int i = 0; i < coinCount; i++)
        {
            Vector3 randomPos = new Vector3(
                Random.Range(-spawnRadius, spawnRadius),
                1f,
                Random.Range(-spawnRadius, spawnRadius)
            );
            
            Instantiate(coinPrefab, randomPos, Quaternion.identity);
        }
        
        Debug.Log($"Spawned {coinCount} $MAD coins! GET THEM!");
    }
}
```

---

## Part 4: Physics — Unity vs Roblox

### Roblox Physics
```lua
-- Physics are automatic
local part = Instance.new("Part")
part.Anchored = false  -- Falls due to gravity
part.Velocity = Vector3.new(0, 50, 0)  -- Launch up
```

### Unity Physics (Two Systems)

**System 1: Rigidbody (Physics-driven)**
```csharp
// Object is controlled by physics engine
Rigidbody rb = GetComponent<Rigidbody>();

rb.AddForce(Vector3.up * 500f);        // Launch up
rb.AddExplosionForce(1000f, pos, 10f); // Boom!
rb.velocity = new Vector3(5, 0, 0);    // Set velocity directly

// Constraints
rb.freezeRotation = true;  // Don't tip over
rb.useGravity = true;      // Affected by gravity
rb.mass = 5f;              // Heavier = harder to push
```

Use Rigidbody for: Enemies, crates, projectiles, ragdolls

**System 2: CharacterController (Script-driven)**
```csharp
// Object is controlled by YOUR code, not physics
CharacterController controller = GetComponent<CharacterController>();

// YOU handle movement, gravity, collision
controller.Move(movement * Time.deltaTime);
```

Use CharacterController for: Player characters (more responsive, less floaty)

### When to Use What

| Situation | Use |
|-----------|-----|
| Player character | CharacterController |
| Enemy that walks around | CharacterController or NavMeshAgent |
| Crate you can push | Rigidbody |
| Projectile (bullet) | Rigidbody (fast, physics-based) |
| Coin that spins in place | Neither — just rotate via script |
| Explosion that pushes things | Rigidbody.AddExplosionForce |

---

## Part 5: Lighting & Rendering (Make It Look $MAD)

### Quick Settings for Dark Moody Look

**Directional Light**:
- Color: #FFF5E6 (warm white)
- Intensity: 0.8
- Shadows: Soft Shadows

**Environment Lighting**:
- Window → Rendering → Lighting → Environment
- Ambient Color: #1a1a2e (dark blue-grey)
- Ambient Intensity: 0.3

**Post-Processing (URP)**:
1. Add Volume component to scene
2. Profile settings:
   - Bloom: Intensity 0.5, Threshold 0.8 (makes bright things glow)
   - Color Grading: Contrast +10, Saturation -5 (cinematic look)
   - Vignette: Intensity 0.3 (dark edges)

**Skybox**:
- Create → Material → Shader: Skybox/Procedural
- Sun: None
- Atmosphere Thickness: 0.5
- Ground Color: #0a0a0a (very dark)

### Result
Dark, moody, red accents popping. Like the $MAD website aesthetic.

---

## Part 6: Camera Systems

### First-Person (What we built)
- Camera is child of player
- Mouse rotates player body + camera pitch
- Good for: Shooters, exploration

### Third-Person
```csharp
public class ThirdPersonCamera : MonoBehaviour
{
    [SerializeField] Transform target;      // Player
    [SerializeField] float distance = 5f;   // How far back
    [SerializeField] float height = 2f;     // How high up
    [SerializeField] float rotationSpeed = 3f;
    
    void LateUpdate()
    {
        // Get mouse input
        float horizontal = Input.GetAxis("Mouse X") * rotationSpeed;
        
        // Orbit around player
        transform.RotateAround(target.position, Vector3.up, horizontal);
        
        // Position behind player
        Vector3 desiredPosition = target.position 
            - target.forward * distance 
            + Vector3.up * height;
        
        transform.position = Vector3.Lerp(transform.position, desiredPosition, 0.1f);
        transform.LookAt(target.position + Vector3.up * height);
    }
}
```

Good for: Action games, platformers

### Isometric (Like $MAD Chao Garden)
```csharp
public class IsometricCamera : MonoBehaviour
{
    [SerializeField] Transform target;
    [SerializeField] Vector3 offset = new Vector3(10, 10, -10);
    
    void LateUpdate()
    {
        transform.position = target.position + offset;
        transform.LookAt(target.position);
    }
}
```

Good for: Strategy, Chao Garden, simulation

---

## Part 7: Input System (New vs Old)

### Old Input (What we used — simple, works)
```csharp
float horizontal = Input.GetAxis("Horizontal");  // A/D or Arrow keys
bool jump = Input.GetButtonDown("Jump");          // Space
```

### New Input System (More powerful, more setup)
1. Window → Package Manager → Input System → Install
2. Create → Input Actions
3. Define actions: Move, Jump, Attack, etc.
4. Generate C# class
5. Use:
```csharp
var controls = new PlayerControls();
controls.Gameplay.Move.performed += ctx => moveInput = ctx.ReadValue<Vector2>();
controls.Gameplay.Jump.performed += _ => Jump();
```

**Recommendation**: Stick with Old Input for now. Switch to New Input when you need gamepad support, rebinding, or complex input.

---

## Part 8: Audio Basics

### Setup
1. GameObject → Create Empty → "AudioManager"
2. Add AudioSource component
3. Create Audio folder in Project
4. Import sound files (WAV or MP3)

### Script
```csharp
public class AudioManager : MonoBehaviour
{
    public static AudioManager Instance;
    
    [SerializeField] AudioClip coinSound;
    [SerializeField] AudioClip jumpSound;
    [SerializeField] AudioClip damageSound;
    
    AudioSource source;
    
    void Awake()
    {
        Instance = this;
        source = GetComponent<AudioSource>();
    }
    
    public void PlayCoin() => source.PlayOneShot(coinSound);
    public void PlayJump() => source.PlayOneShot(jumpSound);
    public void PlayDamage() => source.PlayOneShot(damageSound);
}
```

**Usage from other scripts:**
```csharp
AudioManager.Instance?.PlayCoin();
```

---

## Part 9: Build & Test Workflow

### Rapid Iteration Cycle
```
1. Edit in Scene view
2. Press PLAY (▶️)
3. Test gameplay
4. Press PLAY again to stop
5. Edit
6. Repeat
```

**Important**: Changes made WHILE playing are LOST when you stop. If you like a change:
- Copy the GameObject
- Stop playing
- Paste into scene

Or use **Prefab Mode**: Double-click prefab in Project window → edit there → changes save automatically.

### Build for WebGL
1. File → Build Settings
2. Switch Platform to WebGL
3. Player Settings:
   - Resolution: 960×600
   - Compression: Brotli
4. Build → choose folder
5. Wait...
6. Test: Open index.html in browser (need local server)

---

## Key Takeaways

1. **Scene building is drag-and-drop** — Way faster than scripting everything
2. **Prefabs = Reusable templates** — Like Roblox's ReplicatedStorage but better
3. **Two physics systems** — CharacterController for players, Rigidbody for physics objects
4. **Lighting makes the game** — Spend time here, it transforms everything
5. **Test constantly** — Press Play every 5 minutes, catch problems early
6. **The Editor is your friend** — Most things don't need code

## Ready for Next
- Animation system (Animator, states, transitions)
- Particle effects (coin sparkle, explosion)
- More AI behaviors
- Saving/loading with JSON
- Mobile input (touch controls)

---

**Confidence level**: 8/10 (editor is intuitive, component system clicks, ready to build)
