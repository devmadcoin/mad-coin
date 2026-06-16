# Roblox → Unity Concept Mapping

## The Mental Model Shift

**Roblox**: Objects exist in the workspace. You attach scripts to them.
**Unity**: Everything is a GameObject with Components. Scripts ARE components.

---

## Core Concepts Side-by-Side

### 1. The "Object"

**Roblox**:
```lua
local part = Instance.new("Part")
part.Name = "MADBlock"
part.Size = Vector3.new(4, 4, 4)
part.Position = Vector3.new(0, 10, 0)
part.Color = Color3.fromRGB(255, 45, 45)
part.Anchored = true
part.Parent = workspace
```

**Unity**:
```csharp
// In Unity Editor: GameObject → 3D Object → Cube
// Then attach this script:

public class MadBlock : MonoBehaviour
{
    void Start()
    {
        // This runs when the object is created
        gameObject.name = "MADBlock";
        transform.localScale = new Vector3(4, 4, 4);
        transform.position = new Vector3(0, 10, 0);
        
        // Get or add components
        Renderer rend = GetComponent<Renderer>();
        rend.material.color = new Color(1f, 0.176f, 0.176f); // #FF2D2D
        
        // "Anchored" in Unity = Rigidbody with isKinematic = true
        Rigidbody rb = GetComponent<Rigidbody>();
        if (rb != null) rb.isKinematic = true;
    }
}
```

**Key difference**: In Roblox you create instances and set properties. In Unity you work with components on existing GameObjects.

---

### 2. Player Management

**Roblox**:
```lua
local Players = game:GetService("Players")

Players.PlayerAdded:Connect(function(player)
    print(player.Name .. " joined!")
    
    player.CharacterAdded:Connect(function(char)
        local humanoid = char:WaitForChild("Humanoid")
        humanoid.Died:Connect(function()
            print(player.Name .. " died!")
        end)
    end)
end)
```

**Unity**:
```csharp
// Unity doesn't have a built-in Players service
// You typically have a GameManager singleton

public class GameManager : MonoBehaviour
{
    public static GameManager Instance;
    public List<PlayerController> Players = new List<PlayerController>();
    
    void Awake()
    {
        // Singleton pattern
        if (Instance == null) Instance = this;
        else Destroy(gameObject);
    }
    
    public void RegisterPlayer(PlayerController player)
    {
        Players.Add(player);
        Debug.Log($"{player.PlayerName} joined!");
    }
}

// On the player prefab:
public class PlayerController : MonoBehaviour
{
    public string PlayerName;
    public int Health = 100;
    
    void Start()
    {
        GameManager.Instance.RegisterPlayer(this);
    }
    
    public void TakeDamage(int damage)
    {
        Health -= damage;
        if (Health <= 0) Die();
    }
    
    void Die()
    {
        Debug.Log($"{PlayerName} died!");
        // Respawn logic
        GameManager.Instance.RespawnPlayer(this);
    }
}
```

---

### 3. Leaderstats / UI

**Roblox**:
```lua
local function setupLeaderstats(player)
    local leaderstats = Instance.new("Folder")
    leaderstats.Name = "leaderstats"
    
    local coins = Instance.new("IntValue")
    coins.Name = "Coins"
    coins.Value = 0
    coins.Parent = leaderstats
    
    leaderstats.Parent = player
end

Players.PlayerAdded:Connect(setupLeaderstats)
```

**Unity**:
```csharp
// Unity uses Canvas + UI Text elements
// Attach to a Canvas in the scene

public class HUD : MonoBehaviour
{
    public Text coinsText;
    public Text healthText;
    public Slider healthBar;
    
    private PlayerController player;
    
    void Start()
    {
        player = GetComponentInParent<PlayerController>();
    }
    
    void Update()
    {
        coinsText.text = $"💰 {player.Coins}";
        healthText.text = $"❤️ {player.Health}/100";
        healthBar.value = player.Health / 100f;
    }
}
```

---

### 4. Events / RemoteEvents

**Roblox**:
```lua
-- Server
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local damageEvent = Instance.new("RemoteEvent")
damageEvent.Name = "DamagePlayer"
damageEvent.Parent = ReplicatedStorage

damageEvent.OnServerEvent:Connect(function(player, target, damage)
    -- Validate and apply damage
end)

-- Client
local damageEvent = ReplicatedStorage:WaitForChild("DamagePlayer")
damageEvent:FireServer(targetPlayer, 25)
```

**Unity (Mirror or Netcode for GameObjects)**:
```csharp
// Mirror networking (popular Unity networking library)
using Mirror;

public class Combat : NetworkBehaviour
{
    [Command]  // Client → Server
    public void CmdDealDamage(NetworkIdentity target, int damage)
    {
        // Server validates and applies
        target.GetComponent<Health>().TakeDamage(damage);
        
        // Broadcast to all clients
        RpcOnDamage(target, damage);
    }
    
    [ClientRpc]  // Server → All clients
    void RpcOnDamage(NetworkIdentity target, int damage)
    {
        // Play hit effects, sounds
        Debug.Log($"{target.name} took {damage} damage!");
    }
}
```

**Key difference**: Roblox handles networking automatically. Unity requires explicit networking setup (but gives more control).

---

### 5. DataStore → PlayerPrefs / JSON Save

**Roblox**:
```lua
local DataStoreService = game:GetService("DataStoreService")
local playerData = DataStoreService:GetDataStore("PlayerData")

local function saveData(player)
    local success, err = pcall(function()
        playerData:SetAsync(player.UserId, {
            coins = player.leaderstats.Coins.Value,
            rebirths = player.leaderstats.Rebirths.Value
        })
    end)
end
```

**Unity**:
```csharp
// Simple: PlayerPrefs (limited, local only)
PlayerPrefs.SetInt("Coins", coins);
PlayerPrefs.SetInt("Rebirths", rebirths);
PlayerPrefs.Save();

// Advanced: JSON file save
using System.IO;

[System.Serializable]
public class PlayerData
{
    public int Coins;
    public int Rebirths;
    public string PlayerName;
}

public class SaveSystem : MonoBehaviour
{
    string path => Application.persistentDataPath + "/playerdata.json";
    
    public void Save(PlayerData data)
    {
        string json = JsonUtility.ToJson(data);
        File.WriteAllText(path, json);
    }
    
    public PlayerData Load()
    {
        if (!File.Exists(path)) return new PlayerData();
        string json = File.ReadAllText(path);
        return JsonUtility.FromJson<PlayerData>(json);
    }
}
```

---

### 6. Tweening / Animations

**Roblox**:
```lua
local TweenService = game:GetService("TweenService")

local tween = TweenService:Create(
    part,
    TweenInfo.new(1, Enum.EasingStyle.Quad, Enum.EasingDirection.Out),
    {Position = Vector3.new(0, 20, 0)}
)
tween:Play()
```

**Unity**:
```csharp
// Option 1: Built-in Animation system
// Option 2: DOTween (free, popular asset)
using DG.Tweening;

// Move to position over 1 second with ease
transform.DOMove(new Vector3(0, 20, 0), 1f)
    .SetEase(Ease.OutQuad);

// Scale punch (bounce effect)
transform.DOPunchScale(Vector3.one * 0.2f, 0.5f);

// Chain tweens
Sequence seq = DOTween.Sequence();
seq.Append(transform.DOMoveY(20, 1f));
seq.Append(transform.DOScale(2, 0.5f));
seq.Play();
```

---

### 7. Raycasting (Click detection, shooting)

**Roblox**:
```lua
local mouse = player:GetMouse()

mouse.Button1Down:Connect(function()
    local ray = Ray.new(mouse.Hit.p, mouse.UnitRay.Direction * 100)
    local hit, position = workspace:FindPartOnRay(ray)
    
    if hit then
        print("Clicked: " .. hit.Name)
    end
end)
```

**Unity**:
```csharp
void Update()
{
    if (Input.GetMouseButtonDown(0))
    {
        Ray ray = Camera.main.ScreenPointToRay(Input.mousePosition);
        
        if (Physics.Raycast(ray, out RaycastHit hit, 100f))
        {
            Debug.Log($"Clicked: {hit.collider.name}");
            
            // Damage if it has health
            if (hit.collider.TryGetComponent<Health>(out var health))
            {
                health.TakeDamage(25);
            }
        }
    }
}
```

---

## Quick Reference Card

| Roblox | Unity | Purpose |
|--------|-------|---------|
| `workspace` | `Scene` | Game world |
| `Part` | `GameObject` + `MeshRenderer` | Physical object |
| `Humanoid` | Custom script + `CharacterController` | Player movement |
| `RemoteEvent` | `[Command]` / `[ClientRpc]` | Networking |
| `DataStore` | JSON files / PlayerPrefs / Backend | Save data |
| `TweenService` | DOTween / `Animation` | Smooth transitions |
| `RunService.Heartbeat` | `Update()` | Every frame |
| `task.wait(n)` | `yield return new WaitForSeconds(n)` | Delay |
| `Vector3` | `Vector3` | 3D position (same!) |
| `CFrame` | `Transform` (position + rotation) | Transform |

---

## The Biggest Mindset Shift

**Roblox**: "I create objects and scripts modify them"
**Unity**: "Everything is a component. My script IS a component that modifies other components."

In Unity, your script doesn't "find" a player and move them. Your script IS attached TO the player and moves itself via `transform.Translate()`.

This is actually cleaner once you get used to it.
