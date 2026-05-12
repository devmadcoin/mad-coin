--// GamepassManager.lua
--// Gamepass handling for Mad Phonk Awakening
--// Features: Check ownership, prompt purchases, handle reincarnation-locked gamepasses

local GamepassManager = {}

-- Services
local Players = game:GetService("Players")
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local MarketplaceService = game:GetService("MarketplaceService")
local DataStoreService = game:GetService("DataStoreService")

-- Gamepass IDs (UPDATE THESE WITH YOUR ACTUAL IDs)
local GAMEPASSES = {
	UnlockReincarnation = 0,
	UnlockAllZones = 0,
	MadVIP = 0,
	UltraVIP = 0,
	ChestBoost = 0,
	DoubleCoins = 0,
	AutoClicker = 0,
}

-- Gamepass configurations
local GAMEPASS_CONFIG = {
	UnlockReincarnation = {
		Name = "Unlock Reincarnation",
		Description = "Unlock the Reincarnation track immediately!",
		Price = 799,
		Color = Color3.fromRGB(0, 100, 255),
		RequiresReincarnation = false,
	},
	UnlockAllZones = {
		Name = "Unlock All Zones",
		Description = "Access all zones without requirements!",
		Price = 499,
		Color = Color3.fromRGB(255, 200, 0),
		RequiresReincarnation = false,
	},
	MadVIP = {
		Name = "Mad VIP",
		Description = "2x Coins, Special Aura, VIP Chat Tag!",
		Price = 399,
		Color = Color3.fromRGB(255, 200, 0),
		RequiresReincarnation = false,
	},
	UltraVIP = {
		Name = "Ultra VIP",
		Description = "4x Coins, Exclusive Auras, Ultra Chat Tag! REINCARNATION ONLY",
		Price = 999,
		Color = Color3.fromRGB(0, 150, 255),
		RequiresReincarnation = true,
	},
	ChestBoost = {
		Name = "Chest Boost",
		Description = "Open 3x chests at once!",
		Price = 299,
		Color = Color3.fromRGB(255, 100, 50),
		RequiresReincarnation = false,
	},
	DoubleCoins = {
		Name = "Double Coins",
		Description = "2x coin multiplier permanently!",
		Price = 199,
		Color = Color3.fromRGB(0, 255, 100),
		RequiresReincarnation = false,
	},
	AutoClicker = {
		Name = "Auto Clicker",
		Description = "Auto-click for you!",
		Price = 149,
		Color = Color3.fromRGB(200, 50, 255),
		RequiresReincarnation = false,
	},
}

-- Player cache
local PlayerGamepassCache = {}

-- Remotes
local GamepassRemotes = Instance.new("Folder")
GamepassRemotes.Name = "GamepassRemotes"
GamepassRemotes.Parent = ReplicatedStorage

local CheckGamepassRemote = Instance.new("RemoteFunction")
CheckGamepassRemote.Name = "CheckGamepass"
CheckGamepassRemote.Parent = GamepassRemotes

local PromptGamepassRemote = Instance.new("RemoteEvent")
PromptGamepassRemote.Name = "PromptGamepass"
PromptGamepassRemote.Parent = GamepassRemotes

local GamepassPurchasedRemote = Instance.new("RemoteEvent")
GamepassPurchasedRemote.Name = "GamepassPurchased"
GamepassPurchasedRemote.Parent = GamepassRemotes

--// SERVER FUNCTIONS

function GamepassManager:InitServer()
	-- Check ownership
	CheckGamepassRemote.OnServerInvoke = function(player, gamepassId)
		return self:HasGamepass(player, gamepassId)
	end
	
	-- Handle prompt requests
	PromptGamepassRemote.OnServerEvent:Connect(function(player, gamepassId)
		self:PromptPurchase(player, gamepassId)
	end)
	
	-- Listen for purchase completions
	MarketplaceService.PromptGamePassPurchaseFinished:Connect(function(player, gamepassId, wasPurchased)
		if wasPurchased then
			self:OnGamepassPurchased(player, gamepassId)
		end
	end)
	
	print("[GamepassManager] Server initialized")
end

function GamepassManager:HasGamepass(player, gamepassId)
	if gamepassId == 0 then return false end
	
	-- Check cache first
	if PlayerGamepassCache[player.UserId] and PlayerGamepassCache[player.UserId][gamepassId] ~= nil then
		return PlayerGamepassCache[player.UserId][gamepassId]
	end
	
	-- Query Marketplace
	local success, hasPass = pcall(function()
		return MarketplaceService:UserOwnsGamePassAsync(player.UserId, gamepassId)
	end)
	
	if success then
		-- Cache result
		if not PlayerGamepassCache[player.UserId] then
			PlayerGamepassCache[player.UserId] = {}
		end
		PlayerGamepassCache[player.UserId][gamepassId] = hasPass
		return hasPass
	end
	
	return false
end

function GamepassManager:PromptPurchase(player, gamepassId)
	if gamepassId == 0 then
		warn("Gamepass ID not configured!")
		return
	end
	
	-- Check if reincarnation-required gamepass
	for key, config in pairs(GAMEPASS_CONFIG) do
		if GAMEPASSES[key] == gamepassId then
			if config.RequiresReincarnation then
				-- Check if player has reincarnation
				local hasReincarnation = self:CheckReincarnationStatus(player)
				if not hasReincarnation then
					-- Notify client that reincarnation is needed
					GamepassPurchasedRemote:FireClient(player, {
						Success = false,
						Message = "REINCARNATION ONLY - Complete reincarnation first!",
						GamepassId = gamepassId,
					})
					return
				end
			end
			break
		end
	end
	
	local success, err = pcall(function()
		MarketplaceService:PromptGamePassPurchase(player, gamepassId)
	end)
	
	if not success then
		warn("Failed to prompt gamepass: " .. tostring(err))
	end
end

function GamepassManager:OnGamepassPurchased(player, gamepassId)
	-- Update cache
	if not PlayerGamepassCache[player.UserId] then
		PlayerGamepassCache[player.UserId] = {}
	end
	PlayerGamepassCache[player.UserId][gamepassId] = true
	
	-- Apply benefits
	self:ApplyGamepassBenefits(player, gamepassId)
	
	-- Notify client
	local gamepassName = "Unknown"
	for key, id in pairs(GAMEPASSES) do
		if id == gamepassId then
			gamepassName = GAMEPASS_CONFIG[key] and GAMEPASS_CONFIG[key].Name or key
			break
		end
	end
	
	GamepassPurchasedRemote:FireClient(player, {
		Success = true,
		GamepassId = gamepassId,
		GamepassName = gamepassName,
	})
	
	print(player.Name .. " purchased gamepass: " .. gamepassName)
end

function GamepassManager:ApplyGamepassBenefits(player, gamepassId)
	-- Apply benefits based on gamepass
	for key, id in pairs(GAMEPASSES) do
		if id == gamepassId then
			if key == "MadVIP" then
				-- Apply VIP benefits
				local leaderstats = player:FindFirstChild("leaderstats")
				if leaderstats then
					local vipTag = Instance.new("StringValue")
					vipTag.Name = "VIPTag"
					vipTag.Value = "MAD VIP"
					vipTag.Parent = leaderstats
				end
				
			elseif key == "UltraVIP" then
				-- Apply Ultra VIP benefits
				local leaderstats = player:FindFirstChild("leaderstats")
				if leaderstats then
					local vipTag = Instance.new("StringValue")
					vipTag.Name = "VIPTag"
					vipTag.Value = "ULTRA VIP"
					vipTag.Parent = leaderstats
				end
				
			elseif key == "DoubleCoins" then
				-- Apply double coin multiplier
				local leaderstats = player:FindFirstChild("leaderstats")
				if leaderstats then
					local multiplier = leaderstats:FindFirstChild("CoinMultiplier")
					if not multiplier then
						multiplier = Instance.new("NumberValue")
						multiplier.Name = "CoinMultiplier"
						multiplier.Value = 1
						multiplier.Parent = leaderstats
					end
					multiplier.Value = multiplier.Value + 1
				end
				
			elseif key == "UnlockReincarnation" then
				-- Unlock reincarnation track immediately
				local leaderstats = player:FindFirstChild("leaderstats")
				if leaderstats then
					local reincarnations = leaderstats:FindFirstChild("Reincarnations")
					if reincarnations then
						reincarnations.Value = math.max(reincarnations.Value, 1)
					end
				end
				
			elseif key == "ChestBoost" then
				-- Apply chest boost
				local leaderstats = player:FindFirstChild("leaderstats")
				if leaderstats then
					local chestBoost = Instance.new("IntValue")
					chestBoost.Name = "ChestBoost"
					chestBoost.Value = 3
					chestBoost.Parent = leaderstats
				end
			end
			break
		end
	end
end

function GamepassManager:CheckReincarnationStatus(player)
	local leaderstats = player:FindFirstChild("leaderstats")
	if not leaderstats then return false end
	
	local reincarnations = leaderstats:FindFirstChild("Reincarnations")
	return reincarnations and reincarnations.Value > 0
end

function GamepassManager:GetPlayerBenefits(player)
	local benefits = {
		CoinMultiplier = 1,
		VIPTag = nil,
		HasReincarnationUnlock = false,
		ChestBoost = 1,
		AutoClicker = false,
		ZoneUnlock = false,
	}
	
	-- Check each gamepass
	if self:HasGamepass(player, GAMEPASSES.DoubleCoins) then
		benefits.CoinMultiplier = benefits.CoinMultiplier + 1
	end
	
	if self:HasGamepass(player, GAMEPASSES.MadVIP) then
		benefits.CoinMultiplier = benefits.CoinMultiplier + 1
		benefits.VIPTag = "MAD VIP"
	end
	
	if self:HasGamepass(player, GAMEPASSES.UltraVIP) then
		benefits.CoinMultiplier = benefits.CoinMultiplier + 3
		benefits.VIPTag = "ULTRA VIP"
	end
	
	if self:HasGamepass(player, GAMEPASSES.ChestBoost) then
		benefits.ChestBoost = 3
	end
	
	if self:HasGamepass(player, GAMEPASSES.AutoClicker) then
		benefits.AutoClicker = true
	end
	
	if self:HasGamepass(player, GAMEPASSES.UnlockAllZones) then
		benefits.ZoneUnlock = true
	end
	
	if self:HasGamepass(player, GAMEPASSES.UnlockReincarnation) then
		benefits.HasReincarnationUnlock = true
	end
	
	return benefits
end

--// CLIENT FUNCTIONS

function GamepassManager:InitClient()
	local Player = Players.LocalPlayer
	local PlayerGui = Player:WaitForChild("PlayerGui")
	
	-- Gamepass purchase UI
	local GamepassGui = Instance.new("ScreenGui")
	GamepassGui.Name = "GamepassUI"
	GamepassGui.ResetOnSpawn = false
	GamepassGui.Parent = PlayerGui
	
	-- Notification for purchases
	GamepassPurchasedRemote.OnClientEvent:Connect(function(data)
		if data.Success then
			self:ShowPurchaseNotification(data.GamepassName, true)
		else
			self:ShowPurchaseNotification(data.Message or "Purchase failed", false)
		end
	end)
	
	print("[GamepassManager] Client initialized")
end

function GamepassManager:ShowPurchaseNotification(text, isSuccess)
	local Player = Players.LocalPlayer
	local PlayerGui = Player:WaitForChild("PlayerGui")
	
	local notif = Instance.new("Frame")
	notif.Size = UDim2.new(0, 300, 0, 80)
	notif.Position = UDim2.new(0.5, -150, 0, -100)
	notif.BackgroundColor3 = isSuccess and Color3.fromRGB(20, 50, 30) or Color3.fromRGB(50, 20, 20)
	notif.BorderSizePixel = 0
	notif.Parent = PlayerGui
	
	local corner = Instance.new("UICorner")
	corner.CornerRadius = UDim.new(0, 10)
	corner.Parent = notif
	
	local stroke = Instance.new("UIStroke")
	stroke.Color = isSuccess and Color3.fromRGB(100, 255, 100) or Color3.fromRGB(255, 50, 50)
	stroke.Thickness = 2
	stroke.Parent = notif
	
	local title = Instance.new("TextLabel")
	title.Size = UDim2.new(1, -10, 0, 30)
	title.Position = UDim2.new(0, 5, 0, 10)
	title.BackgroundTransparency = 1
	title.Text = isSuccess and "PURCHASE SUCCESSFUL!" or "PURCHASE FAILED"
	title.TextColor3 = isSuccess and Color3.fromRGB(100, 255, 100) or Color3.fromRGB(255, 50, 50)
	title.TextScaled = true
	title.Font = Enum.Font.GothamBold
	title.Parent = notif
	
	local sub = Instance.new("TextLabel")
	sub.Size = UDim2.new(1, -10, 0, 30)
	sub.Position = UDim2.new(0, 5, 0, 40)
	sub.BackgroundTransparency = 1
	sub.Text = text
	sub.TextColor3 = Color3.fromRGB(255, 255, 255)
	sub.TextScaled = true
	sub.Font = Enum.Font.Gotham
	sub.Parent = notif
	
	-- Animate in
	TweenService:Create(notif, TweenInfo.new(0.5, Enum.EasingStyle.Bounce), {
		Position = UDim2.new(0.5, -150, 0, 50)
	}):Play()
	
	-- Animate out
	wait(4)
	TweenService:Create(notif, TweenInfo.new(0.3), {
		Position = UDim2.new(0.5, -150, 0, -100)
	}):Play()
	wait(0.3)
	notif:Destroy()
end

return GamepassManager
