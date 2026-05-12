--// ZoneSystem.lua
--// Zone management for Mad Phonk Awakening
--// Features: Zone entry triggers, gamepass prompts, locked zone handling

local ZoneSystem = {}

-- Services
local Players = game:GetService("Players")
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local MarketplaceService = game:GetService("MarketplaceService")
local TweenService = game:GetService("TweenService")

-- Gamepass IDs (UPDATE THESE)
local GAMEPASSES = {
	UnlockAllZones = 0, -- Set your gamepass ID
	MadVIP = 0, -- Set your gamepass ID
	UltraVIP = 0, -- Set your gamepass ID
}

-- Zone configuration
local ZONES = {
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

-- Player zone tracking
local PlayerCurrentZones = {}

-- Remotes
local ZoneRemotes = Instance.new("Folder")
ZoneRemotes.Name = "ZoneRemotes"
ZoneRemotes.Parent = ReplicatedStorage

local ZoneEnterRemote = Instance.new("RemoteEvent")
ZoneEnterRemote.Name = "ZoneEnter"
ZoneEnterRemote.Parent = ZoneRemotes

local ZonePromptRemote = Instance.new("RemoteEvent")
ZonePromptRemote.Name = "ZonePrompt"
ZonePromptRemote.Parent = ZoneRemotes

local PurchaseGamepassRemote = Instance.new("RemoteEvent")
PurchaseGamepassRemote.Name = "PurchaseGamepass"
PurchaseGamepassRemote.Parent = ZoneRemotes

--// SERVER FUNCTIONS

function ZoneSystem:InitServer()
	-- Monitor player positions
	spawn(function()
		while true do
			wait(1)
			for _, player in ipairs(Players:GetPlayers()) do
				self:CheckPlayerZone(player)
			end
		end
	end)
	
	-- Handle gamepass purchase requests
	PurchaseGamepassRemote.OnServerEvent:Connect(function(player, gamepassId)
		self:PromptGamepassPurchase(player, gamepassId)
	end)
	
	print("[ZoneSystem] Server initialized")
end

function ZoneSystem:CheckPlayerZone(player)
	local character = player.Character
	if not character then return end
	
	local humanoidRootPart = character:FindFirstChild("HumanoidRootPart")
	if not humanoidRootPart then return end
	
	local playerPos = humanoidRootPart.Position
	local currentZone = nil
	
	-- Find which zone player is in
	for _, zone in ipairs(ZONES) do
		local distance = (playerPos - zone.Position).Magnitude
		if distance <= zone.Radius then
			currentZone = zone
			break
		end
	end
	
	if not currentZone then return end
	
	-- Check if zone changed
	local prevZone = PlayerCurrentZones[player.UserId]
	if prevZone and prevZone.Name == currentZone.Name then
		return -- Still in same zone
	end
	
	PlayerCurrentZones[player.UserId] = currentZone
	
	-- Check if player can enter
	local canEnter, reason = self:CanEnterZone(player, currentZone)
	
	if not canEnter then
		-- Push player back or show prompt
		self:HandleZoneRestriction(player, currentZone, reason)
	else
		-- Notify client of zone entry
		ZoneEnterRemote:FireClient(player, {
			ZoneName = currentZone.Name,
			RequiredLevel = currentZone.RequiredLevel,
			RequiredRebirths = currentZone.RequiredRebirths,
			RequiredReincarnations = currentZone.RequiredReincarnations,
		})
	end
end

function ZoneSystem:CanEnterZone(player, zone)
	-- Get player stats (replace with your actual stat retrieval)
	local leaderstats = player:FindFirstChild("leaderstats")
	if not leaderstats then return false, "Stats not loaded" end
	
	local level = leaderstats:FindFirstChild("Level") and leaderstats.Level.Value or 0
	local rebirths = leaderstats:FindFirstChild("Rebirths") and leaderstats.Rebirths.Value or 0
	local reincarnations = leaderstats:FindFirstChild("Reincarnations") and leaderstats.Reincarnations.Value or 0
	
	-- Check level
	if level < zone.RequiredLevel then
		return false, "Requires Level " .. zone.RequiredLevel
	end
	
	-- Check rebirths
	if rebirths < zone.RequiredRebirths then
		return false, "Requires " .. zone.RequiredRebirths .. " Rebirths"
	end
	
	-- Check reincarnations
	if reincarnations < zone.RequiredReincarnations then
		return false, "Requires " .. zone.RequiredReincarnations .. " Reincarnations"
	end
	
	-- Check reincarnation-only zones
	if zone.ReincarnationOnly and reincarnations < 1 then
		return false, "REINCARNATION ONLY"
	end
	
	-- Check if needs gamepass (non-free zones)
	if not zone.Free then
		local hasUnlockPass = self:HasGamepass(player, GAMEPASSES.UnlockAllZones)
		if not hasUnlockPass then
			return false, "Unlock All Zones gamepass required"
		end
	end
	
	return true
end

function ZoneSystem:HandleZoneRestriction(player, zone, reason)
	-- Show prompt to client
	ZonePromptRemote:FireClient(player, {
		ZoneName = zone.Name,
		Reason = reason,
		RequiresGamepass = not zone.Free,
		GamepassId = GAMEPASSES.UnlockAllZones,
		RequiredLevel = zone.RequiredLevel,
		RequiredRebirths = zone.RequiredRebirths,
		RequiredReincarnations = zone.RequiredReincarnations,
	})
	
	-- Push player back slightly
	local character = player.Character
	if character then
		local humanoidRootPart = character:FindFirstChild("HumanoidRootPart")
		if humanoidRootPart then
			local pushDirection = (humanoidRootPart.Position - zone.Position).Unit
			humanoidRootPart.CFrame = humanoidRootPart.CFrame + pushDirection * 20
		end
	end
end

function ZoneSystem:HasGamepass(player, gamepassId)
	if gamepassId == 0 then return false end -- Not configured
	
	local success, hasPass = pcall(function()
		return MarketplaceService:UserOwnsGamePassAsync(player.UserId, gamepassId)
	end)
	
	return success and hasPass
end

function ZoneSystem:PromptGamepassPurchase(player, gamepassId)
	if gamepassId == 0 then
		warn("Gamepass ID not set!")
		return
	end
	
	local success, err = pcall(function()
		MarketplaceService:PromptGamePassPurchase(player, gamepassId)
	end)
	
	if not success then
		warn("Failed to prompt gamepass purchase: " .. tostring(err))
	end
end

--// CLIENT FUNCTIONS

function ZoneSystem:InitClient()
	local Player = Players.LocalPlayer
	local PlayerGui = Player:WaitForChild("PlayerGui")
	
	-- Zone prompt UI
	local ZonePromptUI = Instance.new("ScreenGui")
	ZonePromptUI.Name = "ZonePromptUI"
	ZonePromptUI.ResetOnSpawn = false
	ZonePromptUI.Parent = PlayerGui
	
	local PromptFrame = Instance.new("Frame")
	PromptFrame.Name = "PromptFrame"
	PromptFrame.Size = UDim2.new(0, 400, 0, 250)
	PromptFrame.Position = UDim2.new(0.5, -200, 0.5, -125)
	PromptFrame.BackgroundColor3 = Color3.fromRGB(20, 20, 35)
	PromptFrame.BorderSizePixel = 0
	PromptFrame.Visible = false
	PromptFrame.Parent = ZonePromptUI
	
	local corner = Instance.new("UICorner")
	corner.CornerRadius = UDim.new(0, 12)
	corner.Parent = PromptFrame
	
	local stroke = Instance.new("UIStroke")
	stroke.Color = Color3.fromRGB(255, 50, 50)
	stroke.Thickness = 2
	stroke.Parent = PromptFrame
	
	-- Title
	local title = Instance.new("TextLabel")
	title.Name = "Title"
	title.Size = UDim2.new(1, -20, 0, 40)
	title.Position = UDim2.new(0, 10, 0, 10)
	title.BackgroundTransparency = 1
	title.Text = "ZONE LOCKED"
	title.TextColor3 = Color3.fromRGB(255, 50, 50)
	title.TextScaled = true
	title.Font = Enum.Font.GothamBold
	title.Parent = PromptFrame
	
	-- Reason
	local reasonLabel = Instance.new("TextLabel")
	reasonLabel.Name = "Reason"
	reasonLabel.Size = UDim2.new(1, -20, 0, 60)
	reasonLabel.Position = UDim2.new(0, 10, 0, 55)
	reasonLabel.BackgroundTransparency = 1
	reasonLabel.Text = "You cannot enter this zone."
	reasonLabel.TextColor3 = Color3.fromRGB(255, 255, 255)
	reasonLabel.TextScaled = true
	reasonLabel.Font = Enum.Font.Gotham
	reasonLabel.Parent = PromptFrame
	
	-- Requirements
	local reqLabel = Instance.new("TextLabel")
	reqLabel.Name = "Requirements"
	reqLabel.Size = UDim2.new(1, -20, 0, 30)
	reqLabel.Position = UDim2.new(0, 10, 0, 120)
	reqLabel.BackgroundTransparency = 1
	reqLabel.Text = "Requires: Level 100, 1 Rebirth"
	reqLabel.TextColor3 = Color3.fromRGB(200, 200, 200)
	reqLabel.TextScaled = true
	reqLabel.Font = Enum.Font.Gotham
	reqLabel.Parent = PromptFrame
	
	-- Gamepass button
	local gamepassBtn = Instance.new("TextButton")
	gamepassBtn.Name = "GamepassBtn"
	gamepassBtn.Size = UDim2.new(0.45, -5, 0, 40)
	gamepassBtn.Position = UDim2.new(0.05, 0, 0, 170)
	gamepassBtn.BackgroundColor3 = Color3.fromRGB(0, 150, 255)
	gamepassBtn.Text = "Unlock All Zones"
	gamepassBtn.TextColor3 = Color3.fromRGB(255, 255, 255)
	gamepassBtn.TextScaled = true
	gamepassBtn.Font = Enum.Font.GothamBold
	gamepassBtn.Parent = PromptFrame
	
	local btnCorner = Instance.new("UICorner")
	btnCorner.CornerRadius = UDim.new(0, 8)
	btnCorner.Parent = gamepassBtn
	
	-- Close button
	local closeBtn = Instance.new("TextButton")
	closeBtn.Name = "CloseBtn"
	closeBtn.Size = UDim2.new(0.45, -5, 0, 40)
	closeBtn.Position = UDim2.new(0.5, 5, 0, 170)
	closeBtn.BackgroundColor3 = Color3.fromRGB(100, 100, 100)
	closeBtn.Text = "Close"
	closeBtn.TextColor3 = Color3.fromRGB(255, 255, 255)
	closeBtn.TextScaled = true
	closeBtn.Font = Enum.Font.GothamBold
	closeBtn.Parent = PromptFrame
	
	local closeCorner = Instance.new("UICorner")
	closeCorner.CornerRadius = UDim.new(0, 8)
	closeCorner.Parent = closeBtn
	
	-- REINCARNATION ONLY badge
	local reincBadge = Instance.new("TextLabel")
	reincBadge.Name = "ReincarnationBadge"
	reincBadge.Size = UDim2.new(0, 140, 0, 22)
	reincBadge.Position = UDim2.new(0.5, -70, 0, 220)
	reincBadge.BackgroundColor3 = Color3.fromRGB(0, 50, 150)
	reincBadge.Text = "REINCARNATION ONLY"
	reincBadge.TextColor3 = Color3.fromRGB(0, 200, 255)
	reincBadge.TextScaled = true
	reincBadge.Font = Enum.Font.GothamBold
	reincBadge.Visible = false
	reincBadge.Parent = PromptFrame
	
	local badgeCorner = Instance.new("UICorner")
	badgeCorner.CornerRadius = UDim.new(0, 4)
	badgeCorner.Parent = reincBadge
	
	-- Handle zone prompt from server
	ZonePromptRemote.OnClientEvent:Connect(function(data)
		reasonLabel.Text = data.Reason
		
		local reqText = ""
		if data.RequiredLevel > 0 then
			reqText = reqText .. "Level " .. data.RequiredLevel .. " "
		end
		if data.RequiredRebirths > 0 then
			reqText = reqText .. "Rebirths: " .. data.RequiredRebirths .. " "
		end
		if data.RequiredReincarnations > 0 then
			reqText = reqText .. "Reincarnations: " .. data.RequiredReincarnations
		end
		reqLabel.Text = reqText ~= "" and "Requires: " .. reqText or ""
		
		-- Show/hide gamepass button
		gamepassBtn.Visible = data.RequiresGamepass
		
		-- Show reincarnation badge
		reincBadge.Visible = string.find(data.Reason, "REINCARNATION") ~= nil
		
		-- Show prompt
		PromptFrame.Visible = true
		PromptFrame.Size = UDim2.new(0, 0, 0, 0)
		TweenService:Create(PromptFrame, TweenInfo.new(0.5, Enum.EasingStyle.Back), {
			Size = UDim2.new(0, 400, 0, 250)
		}):Play()
	end)
	
	-- Gamepass button click
	gamepassBtn.MouseButton1Click:Connect(function()
		PurchaseGamepassRemote:FireServer(GAMEPASSES.UnlockAllZones)
	end)
	
	-- Close button
	closeBtn.MouseButton1Click:Connect(function()
		TweenService:Create(PromptFrame, TweenInfo.new(0.3), {
			Size = UDim2.new(0, 0, 0, 0)
		}):Play()
		wait(0.3)
		PromptFrame.Visible = false
	end)
	
	-- Zone entry notification
	ZoneEnterRemote.OnClientEvent:Connect(function(data)
		-- Show zone entry notification
		local notif = Instance.new("Frame")
		notif.Size = UDim2.new(0, 300, 0, 60)
		notif.Position = UDim2.new(0.5, -150, 0, -70)
		notif.BackgroundColor3 = Color3.fromRGB(20, 20, 35)
		notif.BorderSizePixel = 0
		notif.Parent = ZonePromptUI
		
		local nCorner = Instance.new("UICorner")
		nCorner.CornerRadius = UDim.new(0, 8)
		nCorner.Parent = notif
		
		local nStroke = Instance.new("UIStroke")
		nStroke.Color = Color3.fromRGB(0, 200, 255)
		nStroke.Thickness = 1
		nStroke.Parent = notif
		
		local nLabel = Instance.new("TextLabel")
		nLabel.Size = UDim2.new(1, -10, 1, 0)
		nLabel.Position = UDim2.new(0, 5, 0, 0)
		nLabel.BackgroundTransparency = 1
		nLabel.Text = "Entered: " .. data.ZoneName
		nLabel.TextColor3 = Color3.fromRGB(0, 200, 255)
		nLabel.TextScaled = true
		nLabel.Font = Enum.Font.GothamBold
		nLabel.Parent = notif
		
		TweenService:Create(notif, TweenInfo.new(0.3, Enum.EasingStyle.Bounce), {
			Position = UDim2.new(0.5, -150, 0, 20)
		}):Play()
		
		wait(3)
		TweenService:Create(notif, TweenInfo.new(0.3), {
			Position = UDim2.new(0.5, -150, 0, -70)
		}):Play()
		wait(0.3)
		notif:Destroy()
	end)
	
	print("[ZoneSystem] Client initialized")
end

--// ZONE CREATION HELPERS

function ZoneSystem:CreateZonePart(zoneConfig)
	local zonePart = Instance.new("Part")
	zonePart.Name = zoneConfig.Name .. "Zone"
	zonePart.Size = Vector3.new(zoneConfig.Radius * 2, 100, zoneConfig.Radius * 2)
	zonePart.Position = zoneConfig.Position
	zonePart.Anchored = true
	zonePart.CanCollide = false
	zonePart.Transparency = 0.9
	zonePart.Material = Enum.Material.ForceField
	
	-- Color based on zone type
	if zoneConfig.ReincarnationOnly then
		zonePart.Color = Color3.fromRGB(0, 50, 255)
	elseif zoneConfig.Free then
		zonePart.Color = Color3.fromRGB(0, 255, 100)
	else
		zonePart.Color = Color3.fromRGB(255, 50, 50)
	end
	
	zonePart.Parent = workspace
	
	-- Zone label
	local label = Instance.new("BillboardGui")
	label.Size = UDim2.new(0, 200, 0, 50)
	label.StudsOffset = Vector3.new(0, 50, 0)
	label.AlwaysOnTop = true
	label.Parent = zonePart
	
	local text = Instance.new("TextLabel")
	text.Size = UDim2.new(1, 0, 1, 0)
	text.BackgroundTransparency = 1
	text.Text = zoneConfig.Name
	text.TextColor3 = zonePart.Color
	text.TextScaled = true
	text.Font = Enum.Font.GothamBold
	text.Parent = label
	
	-- REINCARNATION ONLY label
	if zoneConfig.ReincarnationOnly then
		local subLabel = Instance.new("TextLabel")
		subLabel.Size = UDim2.new(1, 0, 0, 20)
		subLabel.Position = UDim2.new(0, 0, 0, 30)
		subLabel.BackgroundTransparency = 1
		subLabel.Text = "REINCARNATION ONLY"
		subLabel.TextColor3 = Color3.fromRGB(0, 200, 255)
		subLabel.TextScaled = true
		subLabel.Font = Enum.Font.GothamBold
		subLabel.Parent = label
	end
	
	return zonePart
end

return ZoneSystem
