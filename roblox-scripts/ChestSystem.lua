--// ChestSystem.lua
--// Server + Client chest handling for Mad Phonk Awakening
--// Features: Auto-open at chest area, keybinds (E/T), minimize HUD clutter

local ChestSystem = {}

-- Services
local Players = game:GetService("Players")
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local TweenService = game:GetService("TweenService")
local Debris = game:GetService("Debris")

-- Remotes
local ChestRemotes = Instance.new("Folder")
ChestRemotes.Name = "ChestRemotes"
ChestRemotes.Parent = ReplicatedStorage

local OpenChestRemote = Instance.new("RemoteEvent")
OpenChestRemote.Name = "OpenChest"
OpenChestRemote.Parent = ChestRemotes

local OpenChestBatchRemote = Instance.new("RemoteEvent")
OpenChestBatchRemote.Name = "OpenChestBatch"
OpenChestBatchRemote.Parent = ChestRemotes

local ChestResultRemote = Instance.new("RemoteEvent")
ChestResultRemote.Name = "ChestResult"
ChestResultRemote.Parent = ChestRemotes

-- Chest configuration
local CHEST_CONFIG = {
	Common = {
		Name = "Common Chest",
		Color = Color3.fromRGB(150, 150, 150),
		Cost = 100, -- Old currency
		Rewards = {
			{ Item = "Basic Sword", Chance = 0.4, Type = "Sword" },
			{ Item = "Small Coin Boost", Chance = 0.3, Type = "Boost" },
			{ Item = "Weak Aura", Chance = 0.2, Type = "Aura" },
			{ Item = "Common Pose", Chance = 0.1, Type = "Pose" },
		}
	},
	Rare = {
		Name = "Rare Chest",
		Color = Color3.fromRGB(0, 150, 255),
		Cost = 500,
		Rewards = {
			{ Item = "Rare Sword", Chance = 0.35, Type = "Sword" },
			{ Item = "Medium Coin Boost", Chance = 0.25, Type = "Boost" },
			{ Item = "Blue Aura", Chance = 0.2, Type = "Aura" },
			{ Item = "Rare Pose", Chance = 0.15, Type = "Pose" },
			{ Item = "Mad Pet Common", Chance = 0.05, Type = "Pet" },
		}
	},
	Legendary = {
		Name = "Legendary Chest",
		Color = Color3.fromRGB(255, 200, 0),
		Cost = 2000,
		Rewards = {
			{ Item = "Legendary Sword", Chance = 0.3, Type = "Sword" },
			{ Item = "Large Coin Boost", Chance = 0.2, Type = "Boost" },
			{ Item = "Golden Aura", Chance = 0.2, Type = "Aura" },
			{ Item = "Legendary Pose", Chance = 0.15, Type = "Pose" },
			{ Item = "Mad Pet Rare", Chance = 0.1, Type = "Pet" },
			{ Item = "Ultimate Aura Fragment", Chance = 0.05, Type = "Fragment" },
		}
	},
	Reincarnation = {
		Name = "Reincarnation Chest",
		Color = Color3.fromRGB(0, 50, 255),
		Cost = 1000, -- Reincarnation currency
		RequiresReincarnation = true,
		Rewards = {
			{ Item = "Blue Infinity Sword", Chance = 0.25, Type = "Sword" },
			{ Item = "Rebirth Aura", Chance = 0.25, Type = "Aura" },
			{ Item = "Ascension Pose", Chance = 0.2, Type = "Pose" },
			{ Item = "Mad Chao Pet", Chance = 0.2, Type = "Pet" },
			{ Item = "Ultimate Reincarnation Aura", Chance = 0.1, Type = "Aura" },
		}
	}
}

-- Active chest areas (add your chest part names/locations)
local CHEST_AREAS = {}

-- Player chest data
local PlayerChestData = {}

--// SERVER FUNCTIONS

function ChestSystem:InitServer()
	-- Handle single chest open
	OpenChestRemote.OnServerEvent:Connect(function(player, chestType, chestPosition)
		self:OpenChest(player, chestType, chestPosition)
	end)
	
	-- Handle batch open (E for 3, T for 3)
	OpenChestBatchRemote.OnServerEvent:Connect(function(player, chestType, amount)
		for i = 1, amount do
			self:OpenChest(player, chestType)
			wait(0.3) -- Small delay between openings
		end
	end)
	
	print("[ChestSystem] Server initialized")
end

function ChestSystem:OpenChest(player, chestType, position)
	local config = CHEST_CONFIG[chestType]
	if not config then return end
	
	-- Check reincarnation requirement
	if config.RequiresReincarnation then
		local hasReincarnation = false -- Check via ReincarnationSystem
		if not hasReincarnation then
			ChestResultRemote:FireClient(player, {
				Success = false,
				Message = "REINCARNATION ONLY",
				ChestType = chestType,
			})
			return
		end
	end
	
	-- Roll for reward
	local roll = math.random()
	local cumulativeChance = 0
	local reward = nil
	
	for _, rewardData in ipairs(config.Rewards) do
		cumulativeChance = cumulativeChance + rewardData.Chance
		if roll <= cumulativeChance then
			reward = rewardData
			break
		end
	end
	
	-- Fallback to first reward
	if not reward then
		reward = config.Rewards[1]
	end
	
	-- Give reward to player (integrate with your inventory system)
	self:GiveReward(player, reward)
	
	-- Notify client
	ChestResultRemote:FireClient(player, {
		Success = true,
		Item = reward.Item,
		Type = reward.Type,
		ChestType = chestType,
		Position = position,
	})
	
	return reward
end

function ChestSystem:GiveReward(player, reward)
	-- Integrate with your inventory/equipment system
	-- This is a placeholder - replace with your actual inventory code
	
	local itemType = reward.Type
	local itemName = reward.Item
	
	-- Add to player's data
	if not PlayerChestData[player.UserId] then
		PlayerChestData[player.UserId] = {}
	end
	
	table.insert(PlayerChestData[player.UserId], {
		Item = itemName,
		Type = itemType,
		Obtained = tick(),
	})
	
	print(player.Name .. " obtained " .. itemName .. " (" .. itemType .. ")")
end

--// CLIENT FUNCTIONS

function ChestSystem:InitClient()
	local Player = Players.LocalPlayer
	local PlayerGui = Player:WaitForChild("PlayerGui")
	
	-- Create minimal chest UI (no inventory clutter)
	local ChestGui = Instance.new("ScreenGui")
	ChestGui.Name = "ChestUI"
	ChestGui.ResetOnSpawn = false
	ChestGui.Parent = PlayerGui
	
	-- Keybind indicators (minimal)
	local KeybindFrame = Instance.new("Frame")
	KeybindFrame.Name = "KeybindFrame"
	KeybindFrame.Size = UDim2.new(0, 200, 0, 60)
	KeybindFrame.Position = UDim2.new(0.5, -100, 0.85, 0)
	KeybindFrame.BackgroundColor3 = Color3.fromRGB(20, 20, 35)
	KeybindFrame.BackgroundTransparency = 0.3
	KeybindFrame.BorderSizePixel = 0
	KeybindFrame.Visible = false
	KeybindFrame.Parent = ChestGui
	
	local corner = Instance.new("UICorner")
	corner.CornerRadius = UDim.new(0, 8)
	corner.Parent = KeybindFrame
	
	local stroke = Instance.new("UIStroke")
	stroke.Color = Color3.fromRGB(0, 150, 255)
	stroke.Thickness = 1
	stroke.Parent = KeybindFrame
	
	local promptLabel = Instance.new("TextLabel")
	promptLabel.Name = "PromptLabel"
	promptLabel.Size = UDim2.new(1, 0, 1, 0)
	promptLabel.BackgroundTransparency = 1
	promptLabel.Text = "Press [E] to open 3 chests\nPress [T] to open 3 chests"
	promptLabel.TextColor3 = Color3.fromRGB(255, 255, 255)
	promptLabel.TextScaled = true
	promptLabel.Font = Enum.Font.GothamBold
	promptLabel.Parent = KeybindFrame
	
	-- Detect chest proximity
	local function CheckChestProximity()
		local character = Player.Character
		if not character then return end
		
		local humanoidRootPart = character:FindFirstChild("HumanoidRootPart")
		if not humanoidRootPart then return end
		
		-- Check distance to chest areas
		for _, chestArea in ipairs(CHEST_AREAS) do
			if chestArea and chestArea.Position then
				local distance = (humanoidRootPart.Position - chestArea.Position).Magnitude
				if distance <= 15 then -- 15 stud radius
					return chestArea
				end
			end
		end
		
		return nil
	end
	
	-- Keybind handling
	local UserInputService = game:GetService("UserInputService")
	
	UserInputService.InputBegan:Connect(function(input, gameProcessed)
		if gameProcessed then return end
		
		local nearbyChest = CheckChestProximity()
		if not nearbyChest then
			KeybindFrame.Visible = false
			return
		end
		
		-- Show keybind prompt when near chest
		KeybindFrame.Visible = true
		
		if input.KeyCode == Enum.KeyCode.E then
			OpenChestBatchRemote:FireServer(nearbyChest.ChestType or "Common", 3)
		elseif input.KeyCode == Enum.KeyCode.T then
			OpenChestBatchRemote:FireServer(nearbyChest.ChestType or "Common", 3)
		end
	end)
	
	-- Hide prompt when far from chest
	spawn(function()
		while true do
			wait(0.5)
			local nearby = CheckChestProximity()
			if not nearby then
				KeybindFrame.Visible = false
			end
		end
	end)
	
	-- Handle chest results
	ChestResultRemote.OnClientEvent:Connect(function(result)
		if result.Success then
			self:ShowChestOpeningAnimation(result)
		else
			self:ShowNotification(result.Message or "Cannot open chest!", Color3.fromRGB(255, 50, 50))
		end
	end)
	
	print("[ChestSystem] Client initialized")
end

function ChestSystem:ShowChestOpeningAnimation(result)
	local Player = Players.LocalPlayer
	local PlayerGui = Player:WaitForChild("PlayerGui")
	
	-- Create opening effect frame
	local effectFrame = Instance.new("Frame")
	effectFrame.Name = "ChestOpenEffect"
	effectFrame.Size = UDim2.new(0, 300, 0, 200)
	effectFrame.Position = UDim2.new(0.5, -150, 0.3, 0)
	effectFrame.BackgroundColor3 = Color3.fromRGB(20, 20, 35)
	effectFrame.BorderSizePixel = 0
	effectFrame.Parent = PlayerGui:FindFirstChild("ChestUI") or PlayerGui
	
	local corner = Instance.new("UICorner")
	corner.CornerRadius = UDim.new(0, 12)
	corner.Parent = effectFrame
	
	local stroke = Instance.new("UIStroke")
	stroke.Color = CHEST_CONFIG[result.ChestType] and CHEST_CONFIG[result.ChestType].Color or Color3.fromRGB(255, 200, 0)
	stroke.Thickness = 2
	stroke.Parent = effectFrame
	
	-- Chest icon
	local chestIcon = Instance.new("TextLabel")
	chestIcon.Name = "ChestIcon"
	chestIcon.Size = UDim2.new(0, 80, 0, 80)
	chestIcon.Position = UDim2.new(0.5, -40, 0, 10)
	chestIcon.BackgroundTransparency = 1
	chestIcon.Text = "📦"
	chestIcon.TextScaled = true
	chestIcon.Parent = effectFrame
	
	-- Item name
	local itemLabel = Instance.new("TextLabel")
	itemLabel.Name = "ItemLabel"
	itemLabel.Size = UDim2.new(1, -20, 0, 40)
	itemLabel.Position = UDim2.new(0, 10, 0, 100)
	itemLabel.BackgroundTransparency = 1
	itemLabel.Text = result.Item
	itemLabel.TextColor3 = Color3.fromRGB(255, 200, 0)
	itemLabel.TextScaled = true
	itemLabel.Font = Enum.Font.GothamBold
	itemLabel.Parent = effectFrame
	
	-- Type label
	local typeLabel = Instance.new("TextLabel")
	typeLabel.Name = "TypeLabel"
	typeLabel.Size = UDim2.new(1, -20, 0, 25)
	typeLabel.Position = UDim2.new(0, 10, 0, 145)
	typeLabel.BackgroundTransparency = 1
	typeLabel.Text = result.Type
	typeLabel.TextColor3 = Color3.fromRGB(200, 200, 200)
	typeLabel.TextScaled = true
	typeLabel.Font = Enum.Font.Gotham
	typeLabel.Parent = effectFrame
	
	-- REINCARNATION ONLY badge if applicable
	if result.ChestType == "Reincarnation" then
		local badge = Instance.new("TextLabel")
		badge.Name = "ReincarnationBadge"
		badge.Size = UDim2.new(0, 120, 0, 20)
		badge.Position = UDim2.new(0.5, -60, 0, 175)
		badge.BackgroundColor3 = Color3.fromRGB(0, 50, 150)
		badge.Text = "REINCARNATION ONLY"
		badge.TextColor3 = Color3.fromRGB(0, 200, 255)
		badge.TextScaled = true
		badge.Font = Enum.Font.GothamBold
		badge.Parent = effectFrame
		
		local badgeCorner = Instance.new("UICorner")
		badgeCorner.CornerRadius = UDim.new(0, 4)
		badgeCorner.Parent = badge
	end
	
	-- Animate
	effectFrame.Size = UDim2.new(0, 0, 0, 0)
	TweenService:Create(effectFrame, TweenInfo.new(0.5, Enum.EasingStyle.Back), {
		Size = UDim2.new(0, 300, 0, 200)
	}):Play()
	
	-- Shake effect
	spawn(function()
		for i = 1, 10 do
			effectFrame.Position = UDim2.new(0.5, -150 + math.random(-5, 5), 0.3, math.random(-5, 5))
			wait(0.05)
		end
		effectFrame.Position = UDim2.new(0.5, -150, 0.3, 0)
	end)
	
	-- Remove after delay
	wait(3)
	TweenService:Create(effectFrame, TweenInfo.new(0.5, Enum.EasingStyle.Quad), {
		Size = UDim2.new(0, 0, 0, 0),
		Position = UDim2.new(0.5, 0, 0.3, 100)
	}):Play()
	wait(0.5)
	effectFrame:Destroy()
end

function ChestSystem:ShowNotification(text, color)
	local Player = Players.LocalPlayer
	local PlayerGui = Player:WaitForChild("PlayerGui")
	
	local notif = Instance.new("Frame")
	notif.Size = UDim2.new(0, 250, 0, 50)
	notif.Position = UDim2.new(0.5, -125, 0, -60)
	notif.BackgroundColor3 = Color3.fromRGB(30, 30, 50)
	notif.BorderSizePixel = 0
	notif.Parent = PlayerGui
	
	local corner = Instance.new("UICorner")
	corner.CornerRadius = UDim.new(0, 8)
	corner.Parent = notif
	
	local stroke = Instance.new("UIStroke")
	stroke.Color = color or Color3.fromRGB(255, 50, 50)
	stroke.Thickness = 1
	stroke.Parent = notif
	
	local label = Instance.new("TextLabel")
	label.Size = UDim2.new(1, -10, 1, 0)
	label.Position = UDim2.new(0, 5, 0, 0)
	label.BackgroundTransparency = 1
	label.Text = text
	label.TextColor3 = color or Color3.fromRGB(255, 50, 50)
	label.TextScaled = true
	label.Font = Enum.Font.GothamBold
	label.Parent = notif
	
	TweenService:Create(notif, TweenInfo.new(0.3, Enum.EasingStyle.Bounce), {
		Position = UDim2.new(0.5, -125, 0, 20)
	}):Play()
	
	wait(3)
	TweenService:Create(notif, TweenInfo.new(0.3), {
		Position = UDim2.new(0.5, -125, 0, -60)
	}):Play()
	wait(0.3)
	notif:Destroy()
end

--// UTILITY: Auto-open chests at chest area
function ChestSystem:RegisterChestArea(chestPart, chestType)
	if not chestPart then return end
	
	table.insert(CHEST_AREAS, {
		Part = chestPart,
		Position = chestPart.Position,
		ChestType = chestType,
	})
	
	-- Auto-open when player touches
	chestPart.Touched:Connect(function(hit)
		local character = hit.Parent
		local player = Players:GetPlayerFromCharacter(character)
		if not player then return end
		
		-- Small delay to prevent spam
		wait(0.5)
		
		-- Auto-open the chest
		self:OpenChest(player, chestType, chestPart.Position)
	end)
end

return ChestSystem
