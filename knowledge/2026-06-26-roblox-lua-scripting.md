# Roblox Lua Scripting — Study Notes

**Date:** 2026-06-26
**Status:** Complete

## The Basics

Roblox uses **Luau**, a modified version of Lua 5.1 with type inference, faster execution, and Roblox-specific APIs.

### Script Types
- **Script** — Runs on server (game logic, data storage, anti-cheat)
- **LocalScript** — Runs on client (UI, player input, visual effects)
- **ModuleScript** — Reusable code modules (required by other scripts)

### The Three Pillars of Roblox Dev
1. **Parts** — The building blocks. Position, Size, Color, Material.
2. **Services** — Built-in engine features (Players, Workspace, ReplicatedStorage, TweenService)
3. **Events** — Connections between actions (PlayerAdded, Touched, RenderStepped)

## Core Syntax Patterns

```lua
-- Variables and types
local playerName = "MAD"          -- string
local health = 100                  -- number
local isAlive = true                -- boolean

-- Functions
local function takeDamage(amount)
    health -= amount
    if health <= 0 then
        isAlive = false
    end
end

-- Events
game.Players.PlayerAdded:Connect(function(player)
    print(player.Name .. " joined!")
end)

-- Tweening (animations)
local TweenService = game:GetService("TweenService")
local tween = TweenService:Create(part, TweenInfo.new(0.5), {Position = newPos})
tween:Play()
```

## Roblox Game Architecture

### Client-Server Model
- **Server** = Source of truth. Handles data, purchases, security.
- **Client** = Visuals and input. Never trust client for important logic.
- **RemoteEvents/RemoteFunctions** = Bridge between client and server

### Data Persistence
```lua
-- DataStore (saves across sessions)
local DataStoreService = game:GetService("DataStoreService")
local playerData = DataStoreService:GetDataStore("PlayerData")

-- Save when player leaves
playerData:SetAsync(player.UserId, {coins = 500, level = 12})

-- Load when player joins
local data = playerData:GetAsync(player.UserId)
```

### Key Services for Game Dev
| Service | Purpose |
|---------|---------|
| Players | Player management, spawning |
| Workspace | 3D world, physics, parts |
| ReplicatedStorage | Shared assets (client + server) |
| TweenService | Animations, smooth transitions |
| UserInputService | Detect keyboard, mouse, touch |
| RunService | Game loops, heartbeat, render |
| MarketplaceService | In-game purchases, gamepasses |
| DataStoreService | Save/load persistent data |

## Digital Wearables (Relevant to $MAD)

### How They Work
1. Create **Accessory** or **Clothing** items in Roblox Studio
2. Upload to Roblox as a **UGC (User Generated Content)** item or **game asset**
3. Players equip via **HumanoidDescription** or direct parenting to character
4. **Gamepasses** or **Developer Products** = monetization path

### Scripting Wearables
```lua
-- Equip a hat to player
local function equipHat(player, hatId)
    local humanoid = player.Character:FindFirstChildOfClass("Humanoid")
    if humanoid then
        humanoid:AddAccessory(game.ReplicatedStorage.Hats[hatId]:Clone())
    end
end

-- Gamepass purchase handler
local MarketplaceService = game:GetService("MarketplaceService")
MarketplaceService.PromptGamePassPurchaseFinished:Connect(function(player, passId, wasPurchased)
    if wasPurchased then
        equipHat(player, passId)
    end
end)
```

## The $MAD Game Context

**Mad Phonk Awakening** uses:
- **Character customization** (digital wearables)
- **Gamepass monetization** ($MAD themed items)
- **Leaderboards/stats** (DataStore persistence)
- **Player progression** (levels, achievements)

### What Would Be Useful to Add
1. **$MAD token holder verification** — Check if wallet holds $MAD, unlock special in-game items
2. **Cross-platform leaderboards** — Web + Roblox synced stats
3. **Live events** — Time-limited $MAD themed events
4. **Trading system** — Player-to-player item exchange

## Resources
- **Roblox Creator Hub** — https://create.roblox.com
- **Luau Reference** — https://luau-lang.org
- **Roblox API Reference** — https://developer.roblox.com
- **DevForum** — Community support and tutorials

## Key Insight for $MAD

Roblox has 70M+ daily active users. The platform's UGC economy generates billions. $MAD's digital wearables are a real revenue stream, not just marketing. The game is the product. The token is the community. The wearables bridge both.
