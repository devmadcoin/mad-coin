--// MainServer.lua
--// Main server initialization for Mad Phonk Awakening Reincarnation Update
--// Place in ServerScriptService

local ReplicatedStorage = game:GetService("ReplicatedStorage")
local ServerStorage = game:GetService("ServerStorage")

-- Load all systems
local ReincarnationSystem = require(script.Parent:WaitForChild("ReincarnationSystem"))
local ChestSystem = require(script.Parent:WaitForChild("ChestSystem"))
local ZoneSystem = require(script.Parent:WaitForChild("ZoneSystem"))
local HUDSystem = require(script.Parent:WaitForChild("HUDSystem"))
local LeaderboardSystem = require(script.Parent:WaitForChild("LeaderboardSystem"))
local GamepassManager = require(script.Parent:WaitForChild("GamepassManager"))
local PurchasePromptManager = require(script.Parent:WaitForChild("PurchasePromptManager"))

-- Initialize all systems
ReincarnationSystem:Init()
ChestSystem:InitServer()
ZoneSystem:InitServer()
HUDSystem:InitServer()
LeaderboardSystem:InitServer()
GamepassManager:InitServer()
PurchasePromptManager:InitServer()

print("[Mad Phonk Awakening] All systems initialized successfully!")
print("[Mad Phonk Awakening] Reincarnation Update v1.0 loaded")

--// Leaderstats setup (run for each player)
local Players = game:GetService("Players")

local function SetupPlayer(player)
	local leaderstats = Instance.new("Folder")
	leaderstats.Name = "leaderstats"
	leaderstats.Parent = player
	
	-- Coins
	local coins = Instance.new("NumberValue")
	coins.Name = "Coins"
	coins.Value = 0
	coins.Parent = leaderstats
	
	-- Rebirths
	local rebirths = Instance.new("IntValue")
	rebirths.Name = "Rebirths"
	rebirths.Value = 0
	rebirths.Parent = leaderstats
	
	-- Level
	local level = Instance.new("IntValue")
	level.Name = "Level"
	level.Value = 1
	level.Parent = leaderstats
	
	-- Reincarnations
	local reincarnations = Instance.new("IntValue")
	reincarnations.Name = "Reincarnations"
	reincarnations.Value = 0
	reincarnations.Parent = leaderstats
	
	-- Power (for INF tracking)
	local power = Instance.new("NumberValue")
	power.Name = "Power"
	power.Value = 0
	power.Parent = leaderstats
	
	-- Coin Multiplier
	local coinMultiplier = Instance.new("NumberValue")
	coinMultiplier.Name = "CoinMultiplier"
	coinMultiplier.Value = 1
	coinMultiplier.Parent = leaderstats
	
	-- Update HUD when stats change
	coins.Changed:Connect(function()
		HUDSystem:UpdatePlayerHUD(player, {
			Coins = coins.Value,
			Rebirths = rebirths.Value,
			Reincarnations = reincarnations.Value,
		})
	end)
	
	rebirths.Changed:Connect(function()
		HUDSystem:UpdatePlayerHUD(player, {
			Coins = coins.Value,
			Rebirths = rebirths.Value,
			Reincarnations = reincarnations.Value,
		})
	end)
	
	reincarnations.Changed:Connect(function()
		HUDSystem:UpdatePlayerHUD(player, {
			Coins = coins.Value,
			Rebirths = rebirths.Value,
			Reincarnations = reincarnations.Value,
			HasReincarnationTrack = reincarnations.Value > 0,
		})
	end)
	
	-- Check rebirth notification
	spawn(function()
		while wait(5) do
			if not player.Parent then break end
			
			-- Check if player can rebirth (you'll need to set your own threshold)
			local canRebirth = power.Value >= 1000000 -- Example threshold
			
			HUDSystem:UpdatePlayerHUD(player, {
				Coins = coins.Value,
				Rebirths = rebirths.Value,
				Reincarnations = reincarnations.Value,
				CanRebirth = canRebirth,
				HasReincarnationTrack = reincarnations.Value > 0,
			})
		end
	end)
end

Players.PlayerAdded:Connect(SetupPlayer)

-- Setup existing players
for _, player in ipairs(Players:GetPlayers()) do
	SetupPlayer(player)
end

--// Zone creation (create your zones in workspace)
-- Example:
-- ZoneSystem:CreateZonePart({
--     Name = "Starter Zone",
--     RequiredLevel = 0,
--     RequiredRebirths = 0,
--     RequiredReincarnations = 0,
--     Position = Vector3.new(0, 0, 0),
--     Radius = 100,
--     Free = true,
-- })

--// Chest area registration
-- Example:
-- local chestPart = workspace:FindFirstChild("ChestArea")
-- if chestPart then
--     ChestSystem:RegisterChestArea(chestPart, "Common")
-- end

print("[Mad Phonk Awakening] Server setup complete!")