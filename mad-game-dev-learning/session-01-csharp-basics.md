# MAD Game Dev — Learning Log

## 2026-06-17 — Session 1: C# Fundamentals for Unity

### Why C# First?
- Unity is the bridge between Roblox (where we are) and standalone $MAD games (where we're going)
- C# is similar enough to Luau (both C-family) that patterns transfer
- Unity WebGL export = games on mad-coin.vercel.app
- Asset Store = speed up development

### Today's Goal
Write and understand C# basics by building a simple console app, then map it to Unity concepts.

---

## C# Basics — The 20% That Does 80%

### Variables & Types
```csharp
// C# is strongly typed — you declare what something IS
string playerName = "$MAD Dev";
int score = 1337;
float speed = 5.5f;  // 'f' suffix required for floats
bool isRich = true;

// var lets compiler figure it out (but type is still fixed)
var health = 100;  // compiler knows this is int
```

### vs Luau
```lua
-- Luau is dynamically typed
local playerName = "$MAD Dev"
local score = 1337
local speed = 5.5
local isRich = true
-- Same syntax, no type declarations needed
```

**Key difference**: C# catches type errors at compile time. Luau catches them at runtime (or with type annotations).

---

### Functions / Methods
```csharp
// C# method
public int CalculateMadness(int baseMadness, float multiplier)
{
    return (int)(baseMadness * multiplier);
}

// Usage
int totalMadness = CalculateMadness(100, 2.5f);  // 250
```

```lua
-- Luau function
local function calculateMadness(baseMadness, multiplier)
    return math.floor(baseMadness * multiplier)
end
```

**Pattern is identical**. C# just needs types and `public`/`private` access modifiers.

---

### Classes — The Big One
```csharp
// C# class — everything in Unity is a class
public class Player : MonoBehaviour  // inherits from Unity's base class
{
    public string playerName;
    public int health = 100;
    public float moveSpeed = 5f;
    
    // Start runs once when object is created
    void Start()
    {
        Debug.Log($"Welcome, {playerName}! GET $MAD!");
    }
    
    // Update runs every frame (like RenderStepped in Roblox)
    void Update()
    {
        // Movement input
        float horizontal = Input.GetAxis("Horizontal");
        float vertical = Input.GetAxis("Vertical");
        
        Vector3 movement = new Vector3(horizontal, 0, vertical);
        transform.Translate(movement * moveSpeed * Time.deltaTime);
    }
    
    public void TakeDamage(int damage)
    {
        health -= damage;
        if (health <= 0)
        {
            Die();
        }
    }
    
    void Die()
    {
        Debug.Log("$MAD spirit lives on...");
        // Respawn logic here
    }
}
```

**vs Roblox**:
```lua
-- ServerScript
local Players = game:GetService("Players")

local function onPlayerAdded(player)
    local leaderstats = Instance.new("Folder")
    leaderstats.Name = "leaderstats"
    leaderstats.Parent = player
    
    local health = Instance.new("IntValue")
    health.Name = "Health"
    health.Value = 100
    health.Parent = leaderstats
end

Players.PlayerAdded:Connect(onPlayerAdded)
```

**Key insight**: In Unity, the Player IS a class with built-in methods. In Roblox, you attach scripts to existing objects. Different mental model, same outcome.

---

### Arrays & Lists
```csharp
// Fixed array
string[] madQuotes = new string[] {
    "GET $MAD",
    "STAY MAD",
    "MAD RICH"
};

// Dynamic list (more common)
List<string> inventory = new List<string>();
inventory.Add("MAD Sword");
inventory.Add("HODL Shield");
inventory.Remove("MAD Sword");
```

---

### Coroutines (Unity's version of delayed execution)
```csharp
// Like task.wait() in Luau
public IEnumerator SpawnEnemy()
{
    yield return new WaitForSeconds(2f);  // wait 2 seconds
    // Spawn enemy
    
    yield return new WaitForSeconds(1f);  // wait 1 more second
    // Spawn another
}

// Start it
StartCoroutine(SpawnEnemy());
```

**vs Luau**:
```lua
task.spawn(function()
    task.wait(2)
    -- spawn enemy
    task.wait(1)
    -- spawn another
end)
```

---

## Unity-Specific Concepts

### GameObject + Components
Everything in Unity is a GameObject with Components:
- **Transform** — Position, rotation, scale (like Part.CFrame in Roblox)
- **Renderer** — Makes it visible
- **Collider** — Physics detection
- **Your Scripts** — Custom behavior

```csharp
// Accessing components
Rigidbody rb = GetComponent<Rigidbody>();
rb.AddForce(Vector3.up * 500f);  // Jump!

// Finding objects
GameObject player = GameObject.Find("Player");
PlayerHealth health = player.GetComponent<PlayerHealth>();
```

### Input System
```csharp
void Update()
{
    // Keyboard
    if (Input.GetKeyDown(KeyCode.Space))
    {
        Jump();
    }
    
    // Mouse
    if (Input.GetMouseButtonDown(0))  // Left click
    {
        Shoot();
    }
    
    // Mobile touch (built-in!)
    if (Input.touchCount > 0)
    {
        Touch touch = Input.GetTouch(0);
        // Handle touch
    }
}
```

---

## Today's Build: $MAD Coin Collector (Console App)

Before Unity, let's write a simple C# console app to practice.

```csharp
using System;
using System.Collections.Generic;

class MadCoinCollector
{
    static void Main(string[] args)
    {
        Console.WriteLine("=== $MAD COIN COLLECTOR ===");
        
        Player player = new Player("$MAD Dev");
        
        // Game loop
        while (player.IsAlive)
        {
            Console.WriteLine($"\nHealth: {player.Health} | Coins: {player.Coins}");
            Console.WriteLine("1. Collect Coin (+10)");
            Console.WriteLine("2. Fight Jeeter (-20 health, +50 coins)");
            Console.WriteLine("3. HODL (heal +10)");
            Console.WriteLine("4. Exit");
            
            string choice = Console.ReadLine();
            
            switch (choice)
            {
                case "1":
                    player.CollectCoin();
                    break;
                case "2":
                    player.FightJeeter();
                    break;
                case "3":
                    player.HODL();
                    break;
                case "4":
                    return;
                default:
                    Console.WriteLine("Invalid choice. Stay MAD!");
                    break;
            }
        }
        
        Console.WriteLine("You got jeeted! Final score: " + player.Coins);
    }
}

class Player
{
    public string Name { get; private set; }
    public int Health { get; private set; }
    public int Coins { get; private set; }
    public bool IsAlive => Health > 0;
    
    public Player(string name)
    {
        Name = name;
        Health = 100;
        Coins = 0;
    }
    
    public void CollectCoin()
    {
        Coins += 10;
        Console.WriteLine("$MAD coin collected!");
    }
    
    public void FightJeeter()
    {
        Health -= 20;
        Coins += 50;
        Console.WriteLine("Jeeter defeated! But took damage.");
    }
    
    public void HODL()
    {
        Health = Math.Min(100, Health + 10);
        Console.WriteLine("HODLing... health restored.");
    }
}
```

---

## Key Takeaways

1. **C# syntax is familiar** — If you know Luau, C# is just adding types and `;`
2. **Classes are everything** — Unity is object-oriented; embrace it
3. **Unity's Update() ≈ Roblox's RenderStepped** — Both run every frame
4. **Start() ≈ Roblox's PlayerAdded** — Initialization hook
5. **Coroutines ≈ task.spawn/task.wait** — Delayed execution pattern

## Next Session
- Set up actual Unity project
- Build a 3D $MAD character controller
- Export to WebGL
- Embed on website

---

**Time invested**: ~45 min
**Confidence level**: 7/10 (syntax is easy, Unity-specific patterns need practice)
**Ready for**: Writing actual Unity scripts
