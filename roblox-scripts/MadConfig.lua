--// MadConfig.lua
--// Central configuration for Mad Phonk Awakening Reincarnation Update
--// Place this as a ModuleScript in ReplicatedStorage
--// Update ONLY this file with your actual Roblox asset IDs

local MadConfig = {}

-- ============================================
-- GAMEPASS IDs (UPDATE THESE!)
-- ============================================
MadConfig.Gamepasses = {
	UnlockReincarnation = 0,  -- Unlock reincarnation track immediately
	UnlockAllZones    = 0,  -- Access all zones without requirements
	MadVIP            = 0,  -- 2x coins, special aura, VIP tag
	UltraVIP          = 0,  -- 4x coins, exclusive auras, ULTRA tag (REINCARNATION ONLY)
	ChestBoost        = 0,  -- Open 3x chests at once
	DoubleCoins       = 0,  -- Permanent 2x coin multiplier
	AutoClicker       = 0,  -- Auto-click for you
}

-- ============================================
-- DEVELOPER PRODUCT IDs (UPDATE THESE!)
-- ============================================
MadConfig.Products = {
	-- Currency packs
	Coin1k   = 0,  -- +1,000 coins
	Coin10k  = 0,  -- +10,000 coins
	Coin100k = 0,  -- +100,000 coins
	Coin1M   = 0,  -- +1,000,000 coins
	
	-- Rebirth packs
	Rebirth1  = 0,  -- +1 rebirth
	Rebirth5  = 0,  -- +5 rebirths
	Rebirth10 = 0,  -- +10 rebirths
	
	-- Chest packs
	Chest1  = 0,  -- +1 chest open
	Chest3  = 0,  -- +3 chest opens
	Chest10 = 0,  -- +10 chest opens
}

-- ============================================
-- REINCARNATION SETTINGS
-- ============================================
MadConfig.Reincarnation = {
	-- Power required to unlock reincarnation track
	UnlockThreshold = 999999999999,  -- "INF or close to INF"
	
	-- Currency conversion rate (old → reincarnation currency)
	ConversionRate = 0.1,  -- 10%
	
	-- Base multiplier after reincarnation
	BaseMultiplier = 2,
	
	-- Multiplier bonuses
	UltimateItemBonus    = 0.5,  -- Per ultimate/reincarnation item
	NormalItemBonus      = 0.1,  -- Per normal item
	MaxMultiplier        = 50,   -- Hard cap
}

-- ============================================
-- CHEST SETTINGS
-- ============================================
MadConfig.Chests = {
	-- Proximity detection radius
	OpenRadius = 15,
	
	-- Batch open keybinds
	BatchKeybinds = {Enum.KeyCode.E, Enum.KeyCode.T},
	
	-- Batch open amount
	BatchAmount = 3,
	
	-- Chest types and their rewards
	Types = {
		Common = {
			Cost = 0,  -- Free
			Cooldown = 0,
			Items = {"BasicAura", "BasicPose", "BasicPet"},
			Weights = {60, 30, 10},
		},
		Rare = {
			Cost = 1000,
			Cooldown = 60,
			Items = {"RareAura", "RarePose", "RarePet"},
			Weights = {50, 35, 15},
		},
		Legendary = {
			Cost = 10000,
			Cooldown = 300,
			Items = {"LegendaryAura", "LegendaryPose", "LegendaryPet"},
			Weights = {40, 35, 25},
		},
		Reincarnation = {
			Cost = 50000,
			Cooldown = 600,
			Items = {"RebirthAura", "RebirthPose", "RebirthPet"},
			Weights = {35, 35, 30},
			RequiresReincarnation = true,
		},
	},
}

-- ============================================
-- ZONE SETTINGS
-- ============================================
MadConfig.Zones = {
	{
		Name = "Starter Zone",
		RequiredLevel = 0,
		RequiredRebirths = 0,
		RequiredReincarnations = 0,
		Position = Vector3.new(0, 0, 0),
		Radius = 100,
		Free = true,
	},
	{
		Name = "Advanced Zone",
		RequiredLevel = 100,
		RequiredRebirths = 1,
		RequiredReincarnations = 0,
		Position = Vector3.new(500, 0, 0),
		Radius = 100,
		Free = false,
	},
	{
		Name = "Expert Zone",
		RequiredLevel = 500,
		RequiredRebirths = 5,
		RequiredReincarnations = 0,
		Position = Vector3.new(1000, 0, 0),
		Radius = 100,
		Free = false,
	},
	{
		Name = "Reincarnation Zone",
		RequiredLevel = 999,
		RequiredRebirths = 10,
		RequiredReincarnations = 1,
		Position = Vector3.new(1500, 0, 0),
		Radius = 150,
		Free = false,
		ReincarnationOnly = true,
	},
	{
		Name = "Ultimate Zone",
		RequiredLevel = 9999,
		RequiredRebirths = 50,
		RequiredReincarnations = 5,
		Position = Vector3.new(2000, 0, 0),
		Radius = 200,
		Free = false,
		ReincarnationOnly = true,
	},
}

-- ============================================
-- DATASTORE SETTINGS
-- ============================================
MadConfig.DataStores = {
	ReincarnationData   = "ReincarnationData_v1",
	PlayerData          = "PlayerData_v1",
	LeaderboardData     = "LeaderboardData_v1",
	ReincarnationLeaderboard = "ReincarnationLeaderboard_v1",
	AutoSaveInterval    = 60,  -- seconds
}

-- ============================================
-- HUD / UI SETTINGS
-- ============================================
MadConfig.UI = {
	-- Colors
	ReincarnationColor = Color3.fromRGB(0, 150, 255),    -- Blue
	RebirthColor       = Color3.fromRGB(255, 50, 50),    -- Red
	CurrencyColor      = Color3.fromRGB(255, 200, 0),    -- Gold
	VIPColor           = Color3.fromRGB(255, 200, 0),    -- Gold
	UltraVIPColor      = Color3.fromRGB(0, 150, 255),    -- Blue
	
	-- Positions
	TopBarWidth  = 500,
	TopBarHeight = 50,
}

-- ============================================
-- NOTIFICATION MESSAGES
-- ============================================
MadConfig.Messages = {
	ReincarnationUnlocked = "🎉 REINCARNATION TRACK UNLOCKED!",
	ReincarnationComplete = "✨ You have reincarnated! Multiplier x2 activated!",
	ItemPurchased         = "💎 Purchase successful!",
	ChestOpened           = "🎁 Chest opened!",
	ZoneLocked            = "🔒 Zone locked! Requirements not met.",
	ReincarnationOnly     = "⭐ REINCARNATION ONLY - Unlock reincarnation first!",
	MaxMultiplierReached  = "⚠️ Max multiplier reached!",
}

return MadConfig
