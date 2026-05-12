# MAD PHONK AWAKENING — Reincarnation Update Setup Guide

## What You Have
9 modular Lua scripts ready to drop into Roblox Studio. All you need to do is **update gamepass/product IDs** in one file.

---

## Quick Start (5 Steps)

### Step 1: Create Config Module
1. In Roblox Studio, go to **ReplicatedStorage**
2. Right-click → **Insert Object** → **ModuleScript**
3. Name it `MadConfig`
4. Paste the contents of `MadConfig.lua`
5. **Update the 0s with your actual Roblox asset IDs** (see below)

### Step 2: Create Scripts Folder
1. In **ServerScriptService**, create a folder called `MadScripts`
2. Drop ALL 9 `.lua` files into it

### Step 3: Place MainServer
1. Put `MainServer.lua` directly in **ServerScriptService** (not in the folder)
2. It will auto-load everything else

### Step 4: Update Gamepass IDs
In `MadConfig`, find this section and replace the `0`s:

```lua
MadConfig.Gamepasses = {
    UnlockReincarnation = 0,  -- UPDATE THIS
    UnlockAllZones    = 0,  -- UPDATE THIS
    MadVIP            = 0,  -- UPDATE THIS
    UltraVIP          = 0,  -- UPDATE THIS
    ChestBoost        = 0,  -- UPDATE THIS
    DoubleCoins       = 0,  -- UPDATE THIS
    AutoClicker       = 0,  -- UPDATE THIS
}
```

To get your gamepass ID:
- Go to your game → Store → Gamepasses
- Click the gamepass → copy the ID from the URL

### Step 5: Update Developer Product IDs
In `MadConfig`, replace these `0`s too:

```lua
MadConfig.Products = {
    Coin1k   = 0,  -- UPDATE THIS
    Coin10k  = 0,  -- UPDATE THIS
    Coin100k = 0,  -- UPDATE THIS
    Coin1M   = 0,  -- UPDATE THIS
    Rebirth1  = 0,  -- UPDATE THIS
    Rebirth5  = 0,  -- UPDATE THIS
    Rebirth10 = 0,  -- UPDATE THIS
}
```

To get product IDs:
- Go to Creator Dashboard → Your Game → Monetization → Developer Products
- Copy each product ID

---

## Script Reference

| Script | Location | What It Does |
|--------|----------|--------------|
| `MadConfig.lua` | ReplicatedStorage (ModuleScript) | Central config — all IDs live here |
| `MainServer.lua` | ServerScriptService | Auto-loads everything, sets up leaderstats |
| `ReincarnationSystem.lua` | ServerScriptService/MadScripts | Core reincarnation logic |
| `ReincarnationUI.lua` | StarterPlayerScripts | Client UI for reincarnation tabs |
| `ChestSystem.lua` | ServerScriptService/MadScripts | Auto-open chests, keybinds |
| `ZoneSystem.lua` | ServerScriptService/MadScripts | Zone entry + restrictions |
| `HUDSystem.lua` | StarterPlayerScripts | Currency display + shop overlay |
| `LeaderboardSystem.lua` | ServerScriptService/MadScripts | Top players board |
| `GamepassManager.lua` | ServerScriptService/MadScripts | Ownership checks + Ultra VIP lock |
| `PurchasePromptManager.lua` | ServerScriptService/MadScripts | Double purchase mechanic |

---

## In-Studio Setup Checklist

- [ ] `MadConfig` ModuleScript in ReplicatedStorage (with real IDs)
- [ ] `MainServer` Script in ServerScriptService
- [ ] All other scripts in ServerScriptService/MadScripts
- [ ] `ReincarnationUI` and `HUDSystem` also copied to StarterPlayerScripts
- [ ] Chest parts named "ChestArea" in workspace (or update MainServer to find your parts)
- [ ] Zone parts created (or use the ZoneSystem:CreateZonePart() helper)

---

## Testing Checklist

- [ ] Join game → leaderstats appear (Coins, Rebirths, Level, Reincarnations, Power)
- [ ] HUD shows in top-right
- [ ] Walk into a locked zone → prompt appears
- [ ] Press E/T near chests → batch open works
- [ ] Can open ReincarnationUI with toggle button
- [ ] Purchase a product → double prompt appears after 2 seconds
- [ ] Reincarnation track unlocks at near-INF power

---

## Need Help?

The scripter flaked. I didn't. If something breaks, screenshot the Output window and send it to me.

**All scripts saved to:** `/root/.openclaw/workspace/roblox-scripts/`

Let's ship this. 🔥