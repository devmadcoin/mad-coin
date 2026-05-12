--// ReincarnationSystem.lua
--// Server-side core reincarnation logic for Mad Phonk Awakening
--// Handles: Rebirth tracking, currency conversion, multipliers, unlock conditions

local ReincarnationSystem = {}

-- Services
local Players = game:GetService("Players")
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local MarketplaceService = game:GetService("MarketplaceService")
local DataStoreService = game:GetService("DataStoreService")

-- DataStore
local ReincarnationData = DataStoreService:GetDataStore("ReincarnationData_v1")
local PlayerData = DataStoreService:GetDataStore("PlayerData_v1")

-- Gamepass IDs (UPDATE THESE WITH YOUR ACTUAL IDs)
local GAMEPASSES = {
	UnlockReincarnation = 0, -- Set your gamepass ID
	UltraVIP = 0, -- Set your gamepass ID
	UnlockAllZones = 0, -- Set your gamepass ID
	ChestBoost = 0, -- Set your gamepass ID
}

-- Constants
local REINCARNATION_THRESHOLD = math.huge -- "INF or close to INF" - using math.huge as proxy
local BASE_MULTIPLIER = 2 -- x2 base for reincarnation

-- RemoteEvents (create in ReplicatedStorage if not exists)
local Remotes = ReplicatedStorage:FindFirstChild("ReincarnationRemotes")
if not Remotes then
	Remotes = Instance.new("Folder")
	Remotes.Name = "ReincarnationRemotes"
	Remotes.Parent = ReplicatedStorage
end

local function GetOrCreateRemote(name, class)
	local remote = Remotes:FindFirstChild(name)
	if not remote then
		remote = Instance.new(class)
		remote.Name = name
		remote.Parent = Remotes
	end
	return remote
end

local ReincarnateRemote = GetOrCreateRemote("Reincarnate", "RemoteEvent")
local RequestReincarnationData = GetOrCreateRemote("RequestReincarnationData", "RemoteFunction")
local PurchasePromptRemote = GetOrCreateRemote("PurchasePrompt", "RemoteEvent")
local NotificationRemote = GetOrCreateRemote("Notification", "RemoteEvent")

-- Player Data Structure
--[[
	playerData = {
		Rebirths = 0,
		Reincarnations = 0,
		ReincarnationCurrency = 0,
		OldCurrency = 0,
		HasReincarnationTrack = false,
		UnlockedPoses = {},
		UnlockedAuras = {},
		UnlockedPets = {},
		ReincarnationItems = {},
		EquippedPose = "",
		EquippedAura = "",
		EquippedPet = "",
		Multiplier = 1,
		IsOnReincarnationTrack = false,
	}
]]

-- Load player data
function ReincarnationSystem:LoadData(player)
	local success, data = pcall(function()
		return ReincarnationData:GetAsync(player.UserId)
	end)
	
	if success and data then
		return data
	else
		-- Return default data
		return {
			Rebirths = 0,
			Reincarnations = 0,
			ReincarnationCurrency = 0,
			OldCurrency = 0,
			HasReincarnationTrack = false,
			UnlockedPoses = {},
			UnlockedAuras = {},
			UnlockedPets = {},
			ReincarnationItems = {},
			EquippedPose = "",
			EquippedAura = "",
			EquippedPet = "",
			Multiplier = 1,
			IsOnReincarnationTrack = false,
			TotalReincarnationProgress = 0,
		}
	end
end

-- Save player data
function ReincarnationSystem:SaveData(player, data)
	local success, err = pcall(function()
		ReincarnationData:SetAsync(player.UserId, data)
	end)
	if not success then
		warn("Failed to save reincarnation data for " .. player.Name .. ": " .. tostring(err))
	end
	return success
end

-- Check if player can reincarnate
function ReincarnationSystem:CanReincarnate(player, currentStats)
	local data = self.PlayerCache[player.UserId]
	if not data then return false end
	
	-- Must have rebirth track (has done at least 1 rebirth)
	if data.Rebirths < 1 then
		return false, "Complete at least 1 Rebirth first!"
	end
	
	-- Must be close to INF (we'll check against a very high number)
	local currentPower = currentStats and currentStats.Power or 0
	local threshold = 999999999999 -- Close to INF
	
	if currentPower < threshold then
		return false, "Reach near-INF power to unlock Reincarnation!"
	end
	
	-- Check if already has reincarnation track
	if data.HasReincarnationTrack then
		return false, "You already have the Reincarnation Track!"
	end
	
	return true
end

-- Perform reincarnation
function ReincarnationSystem:DoReincarnation(player, currentStats)
	local data = self.PlayerCache[player.UserId]
	if not data then return false end
	
	local canReincarnate, reason = self:CanReincarnate(player, currentStats)
	if not canReincarnate then
		NotificationRemote:FireClient(player, {
			Title = "Cannot Reincarnate",
			Text = reason,
			Duration = 5,
		})
		return false
	end
	
	-- Convert old currency to reincarnation currency
	local oldCurrency = currentStats.Currency or 0
	local conversionRate = 0.1 -- 10% conversion
	local newReincarnationCurrency = math.floor(oldCurrency * conversionRate)
	
	-- Update data
	data.Reincarnations = data.Reincarnations + 1
	data.ReincarnationCurrency = data.ReincarnationCurrency + newReincarnationCurrency
	data.OldCurrency = 0 -- Reset old currency
	data.HasReincarnationTrack = true
	data.IsOnReincarnationTrack = true
	data.Multiplier = data.Multiplier * BASE_MULTIPLIER
	
	-- Give starting reincarnation items
	data.UnlockedPoses["Rebirth Pose Blue"] = true
	data.UnlockedAuras["Blue Aura Base"] = true
	
	-- Save
	self:SaveData(player, data)
	
	-- Notify client
	ReincarnateRemote:FireClient(player, {
		Success = true,
		ReincarnationNumber = data.Reincarnations,
		NewCurrency = data.ReincarnationCurrency,
		Multiplier = data.Multiplier,
		UnlockedItems = {
			Poses = {"Rebirth Pose Blue"},
			Auras = {"Blue Aura Base"},
		}
	})
	
	-- Send notification
	NotificationRemote:FireClient(player, {
		Title = "REINCARNATION COMPLETE!",
		Text = "You are now Reincarnation " .. data.Reincarnations .. "! Multiplier: x" .. data.Multiplier,
		Duration = 8,
	})
	
	return true
end

-- Check if player has reincarnation track
function ReincarnationSystem:HasReincarnationTrack(player)
	local data = self.PlayerCache[player.UserId]
	return data and data.HasReincarnationTrack or false
end

-- Get reincarnation multiplier
function ReincarnationSystem:GetMultiplier(player)
	local data = self.PlayerCache[player.UserId]
	return data and data.Multiplier or 1
end

-- Add reincarnation currency
function ReincarnationSystem:AddReincarnationCurrency(player, amount)
	local data = self.PlayerCache[player.UserId]
	if not data then return end
	
	-- Apply multiplier
	local multipliedAmount = math.floor(amount * data.Multiplier)
	data.ReincarnationCurrency = data.ReincarnationCurrency + multipliedAmount
	self:SaveData(player, data)
	
	return multipliedAmount
end

-- Purchase reincarnation item
function ReincarnationSystem:PurchaseItem(player, itemType, itemName, cost)
	local data = self.PlayerCache[player.UserId]
	if not data then return false end
	
	if data.ReincarnationCurrency < cost then
		return false, "Not enough Reincarnation Currency!"
	end
	
	-- Deduct currency
	data.ReincarnationCurrency = data.ReincarnationCurrency - cost
	
	-- Add item
	if itemType == "Pose" then
		data.UnlockedPoses[itemName] = true
		data.EquippedPose = itemName
	elseif itemType == "Aura" then
		data.UnlockedAuras[itemName] = true
		data.EquippedAura = itemName
	elseif itemType == "Pet" then
		data.UnlockedPets[itemName] = true
		data.EquippedPet = itemName
	elseif itemType == "Item" then
		data.ReincarnationItems[itemName] = true
	end
	
	-- Update multiplier if it's a reincarnation-exclusive item
	if string.find(itemName, "Reincarnation") or string.find(itemName, "Ultimate") then
		data.Multiplier = data.Multiplier + 0.5 -- Each ultimate item adds 0.5x
	end
	
	self:SaveData(player, data)
	return true
end

-- Open reincarnation chest
function ReincarnationSystem:OpenReincarnationChest(player, chestTier)
	local data = self.PlayerCache[player.UserId]
	if not data or not data.HasReincarnationTrack then
		return false, "Reincarnation Only!"
	end
	
	-- Chest rewards by tier
	local chestRewards = {
		[1] = { -- Common
			items = {"Blue Sword", "Blue Shield"},
			poseChance = 0.1,
			auraChance = 0.05,
			petChance = 0.02,
		},
		[2] = { -- Rare
			items = {"Azure Blade", "Phantom Cloak"},
			poseChance = 0.2,
			auraChance = 0.1,
			petChance = 0.05,
		},
		[3] = { -- Legendary
			items = {"Infinity Edge", "Ethereal Wings"},
			poseChance = 0.4,
			auraChance = 0.2,
			petChance = 0.1,
		},
	}
	
	local reward = chestRewards[chestTier] or chestRewards[1]
	local roll = math.random()
	local wonItem = nil
	local itemType = "Item"
	
	-- Roll for rewards
	if roll < reward.petChance then
		local pets = {"Mad Chao", "Blue Spirit", "Rebirth Guardian"}
		wonItem = pets[math.random(1, #pets)]
		itemType = "Pet"
		data.UnlockedPets[wonItem] = true
	elseif roll < reward.auraChance then
		local auras = {"Blue Flame", "Celestial Glow", "Infinity Aura"}
		wonItem = auras[math.random(1, #auras)]
		itemType = "Aura"
		data.UnlockedAuras[wonItem] = true
	elseif roll < reward.poseChance then
		local poses = {"Meditation Pose", "Ascension Pose", "Power Stance"}
		wonItem = poses[math.random(1, #poses)]
		itemType = "Pose"
		data.UnlockedPoses[wonItem] = true
	else
		wonItem = reward.items[math.random(1, #reward.items)]
		data.ReincarnationItems[wonItem] = true
	end
	
	-- Update multiplier for reincarnation items
	data.Multiplier = data.Multiplier + 0.1
	
	self:SaveData(player, data)
	
	return true, wonItem, itemType
end

-- Get all player reincarnation data (for client)
function ReincarnationSystem:GetClientData(player)
	local data = self.PlayerCache[player.UserId]
	if not data then return nil end
	
	return {
		Reincarnations = data.Reincarnations,
		ReincarnationCurrency = data.ReincarnationCurrency,
		HasReincarnationTrack = data.HasReincarnationTrack,
		IsOnReincarnationTrack = data.IsOnReincarnationTrack,
		Multiplier = data.Multiplier,
		UnlockedPoses = data.UnlockedPoses,
		UnlockedAuras = data.UnlockedAuras,
		UnlockedPets = data.UnlockedPets,
		EquippedPose = data.EquippedPose,
		EquippedAura = data.EquippedAura,
		EquippedPet = data.EquippedPet,
		TotalReincarnationProgress = data.TotalReincarnationProgress,
	}
end

-- Player added
function ReincarnationSystem:PlayerAdded(player)
	local data = self:LoadData(player)
	self.PlayerCache[player.UserId] = data
	
	-- Set up leaderstats for reincarnation
	local leaderstats = player:FindFirstChild("leaderstats")
	if leaderstats then
		local reincarnationStat = leaderstats:FindFirstChild("Reincarnations")
		if not reincarnationStat then
			reincarnationStat = Instance.new("IntValue")
			reincarnationStat.Name = "Reincarnations"
			reincarnationStat.Value = data.Reincarnations
			reincarnationStat.Parent = leaderstats
		end
		
		local rebirthStat = leaderstats:FindFirstChild("Rebirths")
		if not rebirthStat then
			rebirthStat = Instance.new("IntValue")
			rebirthStat.Name = "Rebirths"
			rebirthStat.Value = data.Rebirths
			rebirthStat.Parent = leaderstats
		end
	end
	
	-- Send initial data to client
	local clientData = self:GetClientData(player)
	if clientData then
		local initRemote = GetOrCreateRemote("InitReincarnationData", "RemoteEvent")
		initRemote:FireClient(player, clientData)
	end
end

-- Player removing
function ReincarnationSystem:PlayerRemoving(player)
	local data = self.PlayerCache[player.UserId]
	if data then
		self:SaveData(player, data)
		self.PlayerCache[player.UserId] = nil
	end
end

-- Cache
ReincarnationSystem.PlayerCache = {}

-- Initialize
function ReincarnationSystem:Init()
	-- Connect player events
	Players.PlayerAdded:Connect(function(player)
		self:PlayerAdded(player)
	end)
	
	Players.PlayerRemoving:Connect(function(player)
		self:PlayerRemoving(player)
	end)
	
	-- Handle reincarnation request
	ReincarnateRemote.OnServerEvent:Connect(function(player, currentStats)
		self:DoReincarnation(player, currentStats)
	end)
	
	-- Handle data request
	RequestReincarnationData.OnServerInvoke = function(player)
		return self:GetClientData(player)
	end
	
	-- Load existing players
	for _, player in ipairs(Players:GetPlayers()) do
		self:PlayerAdded(player)
	end
	
	print("[ReincarnationSystem] Initialized successfully")
end

-- Auto-save loop
spawn(function()
	while true do
		wait(60) -- Save every minute
		for userId, data in pairs(ReincarnationSystem.PlayerCache) do
			local player = Players:GetPlayerByUserId(userId)
			if player then
				ReincarnationSystem:SaveData(player, data)
			end
		end
	end
end)

return ReincarnationSystem
