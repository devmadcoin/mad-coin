--// HUDSystem.lua
--// HUD overlay for Mad Phonk Awakening
--// Features: Base coin purchase, rebirth notification, rebirth purchase, Mad VIP display

local HUDSystem = {}

-- Services
local Players = game:GetService("Players")
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local TweenService = game:GetService("TweenService")
local MarketplaceService = game:GetService("MarketplaceService")

-- Gamepass/Product IDs (UPDATE THESE)
local PRODUCTS = {
	BaseCoin1k = 0,
	BaseCoin10k = 0,
	BaseCoin100k = 0,
	BaseCoin1M = 0,
	BaseRebirth1 = 0,
	BaseRebirth5 = 0,
	BaseRebirth10 = 0,
	MadVIP = 0,
	UltraVIP = 0,
}

-- Remotes
local HUDRemotes = Instance.new("Folder")
HUDRemotes.Name = "HUDRemotes"
HUDRemotes.Parent = ReplicatedStorage

local HUDUpdateRemote = Instance.new("RemoteEvent")
HUDUpdateRemote.Name = "HUDUpdate"
HUDUpdateRemote.Parent = HUDRemotes

local PurchaseProductRemote = Instance.new("RemoteEvent")
PurchaseProductRemote.Name = "PurchaseProduct"
PurchaseProductRemote.Parent = HUDRemotes

--// CLIENT FUNCTIONS

function HUDSystem:InitClient()
	local Player = Players.LocalPlayer
	local PlayerGui = Player:WaitForChild("PlayerGui")
	
	-- Create HUD GUI
	local HUDGui = Instance.new("ScreenGui")
	HUDGui.Name = "MADHUD"
	HUDGui.ResetOnSpawn = false
	HUDGui.ZIndexBehavior = Enum.ZIndexBehavior.Sibling
	HUDGui.Parent = PlayerGui
	
	--// TOP BAR (Currency Display)
	local TopBar = Instance.new("Frame")
	TopBar.Name = "TopBar"
	TopBar.Size = UDim2.new(0, 500, 0, 50)
	TopBar.Position = UDim2.new(0.5, -250, 0, 10)
	TopBar.BackgroundColor3 = Color3.fromRGB(20, 20, 35)
	TopBar.BackgroundTransparency = 0.2
	TopBar.BorderSizePixel = 0
	TopBar.Parent = HUDGui
	
	local topCorner = Instance.new("UICorner")
	topCorner.CornerRadius = UDim.new(0, 10)
	topCorner.Parent = TopBar
	
	local topStroke = Instance.new("UIStroke")
	topStroke.Color = Color3.fromRGB(0, 150, 255)
	topStroke.Thickness = 1
	topStroke.Parent = TopBar
	
	-- Currency icon and text
	local CoinIcon = Instance.new("ImageLabel")
	CoinIcon.Name = "CoinIcon"
	CoinIcon.Size = UDim2.new(0, 30, 0, 30)
	CoinIcon.Position = UDim2.new(0, 10, 0.5, -15)
	CoinIcon.BackgroundTransparency = 1
	CoinIcon.Image = "rbxassetid://0" -- Replace with your coin icon
	CoinIcon.Parent = TopBar
	
	local CoinText = Instance.new("TextLabel")
	CoinText.Name = "CoinText"
	CoinText.Size = UDim2.new(0, 150, 0, 30)
	CoinText.Position = UDim2.new(0, 45, 0.5, -15)
	CoinText.BackgroundTransparency = 1
	CoinText.Text = "0"
	CoinText.TextColor3 = Color3.fromRGB(255, 200, 0)
	CoinText.TextScaled = true
	CoinText.Font = Enum.Font.GothamBold
	CoinText.Parent = TopBar
	
	-- Rebirth icon and text
	local RebirthIcon = Instance.new("ImageLabel")
	RebirthIcon.Name = "RebirthIcon"
	RebirthIcon.Size = UDim2.new(0, 30, 0, 30)
	RebirthIcon.Position = UDim2.new(0, 210, 0.5, -15)
	RebirthIcon.BackgroundTransparency = 1
	RebirthIcon.Image = "rbxassetid://0" -- Replace with your rebirth icon
	RebirthIcon.Parent = TopBar
	
	local RebirthText = Instance.new("TextLabel")
	RebirthText.Name = "RebirthText"
	RebirthText.Size = UDim2.new(0, 100, 0, 30)
	RebirthText.Position = UDim2.new(0, 245, 0.5, -15)
	RebirthText.BackgroundTransparency = 1
	RebirthText.Text = "0"
	RebirthText.TextColor3 = Color3.fromRGB(255, 50, 50)
	RebirthText.TextScaled = true
	RebirthText.Font = Enum.Font.GothamBold
	RebirthText.Parent = TopBar
	
	-- Reincarnation icon and text
	local ReincIcon = Instance.new("ImageLabel")
	ReincIcon.Name = "ReincIcon"
	ReincIcon.Size = UDim2.new(0, 30, 0, 30)
	ReincIcon.Position = UDim2.new(0, 355, 0.5, -15)
	ReincIcon.BackgroundTransparency = 1
	ReincIcon.Image = "rbxassetid://0" -- Replace with your reincarnation icon
	ReincIcon.Parent = TopBar
	
	local ReincText = Instance.new("TextLabel")
	ReincText.Name = "ReincText"
	ReincText.Size = UDim2.new(0, 100, 0, 30)
	ReincText.Position = UDim2.new(0, 390, 0.5, -15)
	ReincText.BackgroundTransparency = 1
	ReincText.Text = "0"
	ReincText.TextColor3 = Color3.fromRGB(0, 150, 255)
	ReincText.TextScaled = true
	ReincText.Font = Enum.Font.GothamBold
	ReincText.Parent = TopBar
	
	--// REBIRTH NOTIFICATION
	local RebirthNotif = Instance.new("Frame")
	RebirthNotif.Name = "RebirthNotification"
	RebirthNotif.Size = UDim2.new(0, 350, 0, 80)
	RebirthNotif.Position = UDim2.new(0.5, -175, 0, -100)
	RebirthNotif.BackgroundColor3 = Color3.fromRGB(30, 20, 50)
	RebirthNotif.BorderSizePixel = 0
	RebirthNotif.Visible = false
	RebirthNotif.Parent = HUDGui
	
	local notifCorner = Instance.new("UICorner")
	notifCorner.CornerRadius = UDim.new(0, 10)
	notifCorner.Parent = RebirthNotif
	
	local notifStroke = Instance.new("UIStroke")
	notifStroke.Color = Color3.fromRGB(255, 50, 50)
	notifStroke.Thickness = 2
	notifStroke.Parent = RebirthNotif
	
	local notifTitle = Instance.new("TextLabel")
	notifTitle.Size = UDim2.new(1, -10, 0, 30)
	notifTitle.Position = UDim2.new(0, 5, 0, 5)
	notifTitle.BackgroundTransparency = 1
	notifTitle.Text = "TIME TO REBIRTH!"
	notifTitle.TextColor3 = Color3.fromRGB(255, 50, 50)
	notifTitle.TextScaled = true
	notifTitle.Font = Enum.Font.GothamBold
	notifTitle.Parent = RebirthNotif
	
	local notifSub = Instance.new("TextLabel")
	notifSub.Size = UDim2.new(1, -10, 0, 35)
	notifSub.Position = UDim2.new(0, 5, 0, 35)
	notifSub.BackgroundTransparency = 1
	notifSub.Text = "You have enough power to rebirth!"
	notifSub.TextColor3 = Color3.fromRGB(200, 200, 200)
	notifSub.TextScaled = true
	notifSub.Font = Enum.Font.Gotham
	notifSub.Parent = RebirthNotif
	
	--// PURCHASE BUTTONS FRAME (Right side)
	local PurchaseFrame = Instance.new("Frame")
	PurchaseFrame.Name = "PurchaseFrame"
	PurchaseFrame.Size = UDim2.new(0, 180, 0, 250)
	PurchaseFrame.Position = UDim2.new(1, -190, 0.5, -125)
	PurchaseFrame.BackgroundColor3 = Color3.fromRGB(20, 20, 35)
	PurchaseFrame.BackgroundTransparency = 0.3
	PurchaseFrame.BorderSizePixel = 0
	PurchaseFrame.Parent = HUDGui
	
	local purchaseCorner = Instance.new("UICorner")
	purchaseCorner.CornerRadius = UDim.new(0, 10)
	purchaseCorner.Parent = PurchaseFrame
	
	local purchaseStroke = Instance.new("UIStroke")
	purchaseStroke.Color = Color3.fromRGB(0, 150, 255)
	purchaseStroke.Thickness = 1
	purchaseStroke.Parent = PurchaseFrame
	
	-- Purchase title
	local purchaseTitle = Instance.new("TextLabel")
	purchaseTitle.Size = UDim2.new(1, 0, 0, 30)
	purchaseTitle.Position = UDim2.new(0, 0, 0, 5)
	purchaseTitle.BackgroundTransparency = 1
	purchaseTitle.Text = "SHOP"
	purchaseTitle.TextColor3 = Color3.fromRGB(0, 200, 255)
	purchaseTitle.TextScaled = true
	purchaseTitle.Font = Enum.Font.GothamBold
	purchaseTitle.Parent = PurchaseFrame
	
	-- Coin purchase buttons
	local coinProducts = {
		{ Name = "+1K Coins", Cost = "99", Id = PRODUCTS.BaseCoin1k },
		{ Name = "+10K Coins", Cost = "499", Id = PRODUCTS.BaseCoin10k },
		{ Name = "+100K Coins", Cost = "999", Id = PRODUCTS.BaseCoin100k },
		{ Name = "+1M Coins", Cost = "1999", Id = PRODUCTS.BaseCoin1M },
	}
	
	local yOffset = 40
	for _, product in ipairs(coinProducts) do
		local btn = Instance.new("TextButton")
		btn.Name = product.Name
		btn.Size = UDim2.new(0.9, 0, 0, 30)
		btn.Position = UDim2.new(0.05, 0, 0, yOffset)
		btn.BackgroundColor3 = Color3.fromRGB(255, 200, 0)
		btn.Text = product.Name .. " (" .. product.Cost .. " R$)"
		btn.TextColor3 = Color3.fromRGB(0, 0, 0)
		btn.TextScaled = true
		btn.Font = Enum.Font.GothamBold
		btn.Parent = PurchaseFrame
		
		local btnCorner = Instance.new("UICorner")
		btnCorner.CornerRadius = UDim.new(0, 6)
		btnCorner.Parent = btn
		
		btn.MouseButton1Click:Connect(function()
			PurchaseProductRemote:FireServer(product.Id, "Coin")
		end)
		
		yOffset = yOffset + 35
	end
	
	-- Rebirth purchase buttons
	local rebirthProducts = {
		{ Name = "+1 Rebirth", Cost = "199", Id = PRODUCTS.BaseRebirth1 },
		{ Name = "+5 Rebirths", Cost = "799", Id = PRODUCTS.BaseRebirth5 },
		{ Name = "+10 Rebirths", Cost = "1499", Id = PRODUCTS.BaseRebirth10 },
	}
	
	for _, product in ipairs(rebirthProducts) do
		local btn = Instance.new("TextButton")
		btn.Name = product.Name
		btn.Size = UDim2.new(0.9, 0, 0, 25)
		btn.Position = UDim2.new(0.05, 0, 0, yOffset)
		btn.BackgroundColor3 = Color3.fromRGB(255, 50, 50)
		btn.Text = product.Name .. " (" .. product.Cost .. " R$)"
		btn.TextColor3 = Color3.fromRGB(255, 255, 255)
		btn.TextScaled = true
		btn.Font = Enum.Font.GothamBold
		btn.Parent = PurchaseFrame
		
		local btnCorner = Instance.new("UICorner")
		btnCorner.CornerRadius = UDim.new(0, 6)
		btnCorner.Parent = btn
		
		btn.MouseButton1Click:Connect(function()
			PurchaseProductRemote:FireServer(product.Id, "Rebirth")
		end)
		
		yOffset = yOffset + 30
	end
	
	--// MAD VIP DISPLAY
	local VIPFrame = Instance.new("Frame")
	VIPFrame.Name = "VIPFrame"
	VIPFrame.Size = UDim2.new(0, 200, 0, 60)
	VIPFrame.Position = UDim2.new(0, 10, 1, -70)
	VIPFrame.BackgroundColor3 = Color3.fromRGB(40, 20, 60)
	VIPFrame.BackgroundTransparency = 0.3
	VIPFrame.BorderSizePixel = 0
	VIPFrame.Parent = HUDGui
	
	local vipCorner = Instance.new("UICorner")
	vipCorner.CornerRadius = UDim.new(0, 10)
	vipCorner.Parent = VIPFrame
	
	local vipStroke = Instance.new("UIStroke")
	vipStroke.Color = Color3.fromRGB(255, 200, 0)
	vipStroke.Thickness = 2
	vipStroke.Parent = VIPFrame
	
	local vipLabel = Instance.new("TextLabel")
	vipLabel.Size = UDim2.new(1, -10, 0, 25)
	vipLabel.Position = UDim2.new(0, 5, 0, 5)
	vipLabel.BackgroundTransparency = 1
	vipLabel.Text = "MAD VIP"
	vipLabel.TextColor3 = Color3.fromRGB(255, 200, 0)
	vipLabel.TextScaled = true
	vipLabel.Font = Enum.Font.GothamBold
	vipLabel.Parent = VIPFrame
	
	local vipStatus = Instance.new("TextLabel")
	vipStatus.Size = UDim2.new(1, -10, 0, 25)
	vipStatus.Position = UDim2.new(0, 5, 0, 30)
	vipStatus.BackgroundTransparency = 1
	vipStatus.Text = "INACTIVE - Tap to Purchase"
	vipStatus.TextColor3 = Color3.fromRGB(255, 100, 100)
	vipStatus.TextScaled = true
	vipStatus.Font = Enum.Font.Gotham
	vipStatus.Parent = VIPFrame
	
	-- VIP purchase button
	local vipBtn = Instance.new("TextButton")
	vipBtn.Size = UDim2.new(1, 0, 1, 0)
	vipBtn.BackgroundTransparency = 1
	vipBtn.Text = ""
	vipBtn.Parent = VIPFrame
	
	vipBtn.MouseButton1Click:Connect(function()
		PurchaseProductRemote:FireServer(PRODUCTS.MadVIP, "VIP")
	end)
	
	-- Ultra VIP (hidden until reincarnated)
	local UltraVIPFrame = Instance.new("Frame")
	UltraVIPFrame.Name = "UltraVIPFrame"
	UltraVIPFrame.Size = UDim2.new(0, 200, 0, 60)
	UltraVIPFrame.Position = UDim2.new(0, 10, 1, -135)
	UltraVIPFrame.BackgroundColor3 = Color3.fromRGB(20, 20, 50)
	UltraVIPFrame.BackgroundTransparency = 0.3
	UltraVIPFrame.BorderSizePixel = 0
	UltraVIPFrame.Visible = false -- Hidden by default
	UltraVIPFrame.Parent = HUDGui
	
	local ultraCorner = Instance.new("UICorner")
	ultraCorner.CornerRadius = UDim.new(0, 10)
	ultraCorner.Parent = UltraVIPFrame
	
	local ultraStroke = Instance.new("UIStroke")
	ultraStroke.Color = Color3.fromRGB(0, 100, 255)
	ultraStroke.Thickness = 2
	ultraStroke.Parent = UltraVIPFrame
	
	local ultraLabel = Instance.new("TextLabel")
	ultraLabel.Size = UDim2.new(1, -10, 0, 25)
	ultraLabel.Position = UDim2.new(0, 5, 0, 5)
	ultraLabel.BackgroundTransparency = 1
	ultraLabel.Text = "ULTRA VIP"
	ultraLabel.TextColor3 = Color3.fromRGB(0, 150, 255)
	ultraLabel.TextScaled = true
	ultraLabel.Font = Enum.Font.GothamBold
	ultraLabel.Parent = UltraVIPFrame
	
	local ultraStatus = Instance.new("TextLabel")
	ultraStatus.Size = UDim2.new(1, -10, 0, 25)
	ultraStatus.Position = UDim2.new(0, 5, 0, 30)
	ultraStatus.BackgroundTransparency = 1
	ultraStatus.Text = "LOCKED - Reincarnate to Unlock"
	ultraStatus.TextColor3 = Color3.fromRGB(150, 150, 150)
	ultraStatus.TextScaled = true
	ultraStatus.Font = Enum.Font.Gotham
	ultraStatus.Parent = UltraVIPFrame
	
	local ultraBtn = Instance.new("TextButton")
	ultraBtn.Size = UDim2.new(1, 0, 1, 0)
	ultraBtn.BackgroundTransparency = 1
	ultraBtn.Text = ""
	ultraBtn.Parent = UltraVIPFrame
	
	ultraBtn.MouseButton1Click:Connect(function()
		PurchaseProductRemote:FireServer(PRODUCTS.UltraVIP, "VIP")
	end)
	
	-- REINCARNATION ONLY badge for Ultra VIP
	local ultraBadge = Instance.new("TextLabel")
	ultraBadge.Size = UDim2.new(0, 120, 0, 18)
	ultraBadge.Position = UDim2.new(0.5, -60, 0, -10)
	ultraBadge.BackgroundColor3 = Color3.fromRGB(0, 50, 150)
	ultraBadge.Text = "REINCARNATION ONLY"
	ultraBadge.TextColor3 = Color3.fromRGB(0, 200, 255)
	ultraBadge.TextScaled = true
	ultraBadge.Font = Enum.Font.GothamBold
	ultraBadge.Parent = UltraVIPFrame
	
	local ultraBadgeCorner = Instance.new("UICorner")
	ultraBadgeCorner.CornerRadius = UDim.new(0, 3)
	ultraBadgeCorner.Parent = ultraBadge
	
	--// HUD UPDATE HANDLER
	HUDUpdateRemote.OnClientEvent:Connect(function(data)
		-- Update currency display
		if data.Coins then
			CoinText.Text = self:FormatNumber(data.Coins)
		end
		
		if data.Rebirths then
			RebirthText.Text = tostring(data.Rebirths)
			
			-- Change rebirth icon color when reincarnated
			if data.HasReincarnationTrack then
				RebirthText.TextColor3 = Color3.fromRGB(0, 150, 255) -- Blue
			else
				RebirthText.TextColor3 = Color3.fromRGB(255, 50, 50) -- Red
			end
		end
		
		if data.Reincarnations then
			ReincText.Text = tostring(data.Reincarnations)
		end
		
		-- Show rebirth notification
		if data.CanRebirth then
			RebirthNotif.Visible = true
			TweenService:Create(RebirthNotif, TweenInfo.new(0.5, Enum.EasingStyle.Bounce), {
				Position = UDim2.new(0.5, -175, 0, 70)
			}):Play()
		else
			TweenService:Create(RebirthNotif, TweenInfo.new(0.3), {
				Position = UDim2.new(0.5, -175, 0, -100)
			}):Play()
		end
		
		-- Update VIP status
		if data.HasMadVIP then
			vipStatus.Text = "ACTIVE"
			vipStatus.TextColor3 = Color3.fromRGB(100, 255, 100)
			vipStroke.Color = Color3.fromRGB(100, 255, 100)
		end
		
		-- Show Ultra VIP if reincarnated
		if data.HasReincarnationTrack then
			UltraVIPFrame.Visible = true
			
			if data.HasUltraVIP then
				ultraStatus.Text = "ACTIVE"
				ultraStatus.TextColor3 = Color3.fromRGB(100, 255, 100)
				ultraStroke.Color = Color3.fromRGB(100, 255, 100)
			else
				ultraStatus.Text = "AVAILABLE - Tap to Purchase"
				ultraStatus.TextColor3 = Color3.fromRGB(0, 200, 255)
			end
		end
		
		-- Update Mad icon color (reincarnation track)
		if data.HasReincarnationTrack then
			-- You can animate the icon to turn blue here
			-- Example: MadIcon.ImageColor3 = Color3.fromRGB(0, 150, 255)
		end
	end)
	
	print("[HUDSystem] Client initialized")
end

function HUDSystem:FormatNumber(num)
	if num >= 1e15 then
		return string.format("%.1fQ", num / 1e15)
	elseif num >= 1e12 then
		return string.format("%.1fT", num / 1e12)
	elseif num >= 1e9 then
		return string.format("%.1fB", num / 1e9)
	elseif num >= 1e6 then
		return string.format("%.1fM", num / 1e6)
	elseif num >= 1e3 then
		return string.format("%.1fK", num / 1e3)
	else
		return tostring(num)
	end
end

--// SERVER FUNCTIONS

function HUDSystem:UpdatePlayerHUD(player, data)
	HUDUpdateRemote:FireClient(player, data)
end

function HUDSystem:InitServer()
	PurchaseProductRemote.OnServerEvent:Connect(function(player, productId, productType)
		if productId == 0 then
			warn("Product ID not configured!")
			return
		end
		
		-- Prompt purchase
		local success, err = pcall(function()
			MarketplaceService:PromptProductPurchase(player, productId)
		end)
		
		if not success then
			warn("Purchase prompt failed: " .. tostring(err))
		end
	end)
	
	print("[HUDSystem] Server initialized")
end

return HUDSystem
