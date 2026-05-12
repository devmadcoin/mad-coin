--// PurchasePromptManager.lua
--// Double purchase prompt system for Mad Phonk Awakening
--// Features: After purchase, prompt appears again (double prompt mechanic)

local PurchasePromptManager = {}

-- Services
local Players = game:GetService("Players")
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local MarketplaceService = game:GetService("MarketplaceService")
local TweenService = game:GetService("TweenService")

-- Product/Gamepass IDs (UPDATE THESE)
local PRODUCTS = {
	-- Currency products
	Coin1k = 0,
	Coin10k = 0,
	Coin100k = 0,
	Coin1M = 0,
	
	-- Rebirth products
	Rebirth1 = 0,
	Rebirth5 = 0,
	Rebirth10 = 0,
	
	-- Chest products
	Chest1 = 0,
	Chest3 = 0,
	Chest10 = 0,
}

-- Track recent purchases to trigger double prompt
local RecentPurchases = {}

-- Remotes
local PromptRemotes = Instance.new("Folder")
PromptRemotes.Name = "PurchasePromptRemotes"
PromptRemotes.Parent = ReplicatedStorage

local ShowPromptRemote = Instance.new("RemoteEvent")
ShowPromptRemote.Name = "ShowPrompt"
ShowPromptRemote.Parent = PromptRemotes

local PurchaseCompleteRemote = Instance.new("RemoteEvent")
PurchaseCompleteRemote.Name = "PurchaseComplete"
PurchaseCompleteRemote.Parent = PromptRemotes

--// SERVER FUNCTIONS

function PurchasePromptManager:InitServer()
	-- Listen for product purchases
	MarketplaceService.ProcessReceipt = function(receiptInfo)
		return self:ProcessReceipt(receiptInfo)
	end
	
	-- Listen for gamepass purchases
	MarketplaceService.PromptGamePassPurchaseFinished:Connect(function(player, gamepassId, wasPurchased)
		if wasPurchased then
			self:OnPurchaseComplete(player, gamepassId, "Gamepass")
		end
	end)
	
	print("[PurchasePromptManager] Server initialized")
end

function PurchasePromptManager:ProcessReceipt(receiptInfo)
	local player = Players:GetPlayerByUserId(receiptInfo.PlayerId)
	if not player then
		return Enum.ProductPurchaseDecision.NotProcessedYet
	end
	
	-- Give product
	local productId = receiptInfo.ProductId
	self:GiveProduct(player, productId)
	
	-- Mark purchase as complete
	self:OnPurchaseComplete(player, productId, "Product")
	
	return Enum.ProductPurchaseDecision.PurchaseGranted
end

function PurchasePromptManager:GiveProduct(player, productId)
	-- Determine what product was purchased and give it
	for key, id in pairs(PRODUCTS) do
		if id == productId then
			if string.find(key, "Coin") then
				-- Give coins
				local amount = self:GetCoinAmount(key)
				self:AddCoins(player, amount)
				
			elseif string.find(key, "Rebirth") then
				-- Give rebirths
				local amount = self:GetRebirthAmount(key)
				self:AddRebirths(player, amount)
				
			elseif string.find(key, "Chest") then
				-- Give chest opens
				local amount = self:GetChestAmount(key)
				self:AddChestOpens(player, amount)
			end
			break
		end
	end
end

function PurchasePromptManager:GetCoinAmount(key)
	local amounts = {
		Coin1k = 1000,
		Coin10k = 10000,
		Coin100k = 100000,
		Coin1M = 1000000,
	}
	return amounts[key] or 0
end

function PurchasePromptManager:GetRebirthAmount(key)
	local amounts = {
		Rebirth1 = 1,
		Rebirth5 = 5,
		Rebirth10 = 10,
	}
	return amounts[key] or 0
end

function PurchasePromptManager:GetChestAmount(key)
	local amounts = {
		Chest1 = 1,
		Chest3 = 3,
		Chest10 = 10,
	}
	return amounts[key] or 0
end

function PurchasePromptManager:AddCoins(player, amount)
	local leaderstats = player:FindFirstChild("leaderstats")
	if not leaderstats then return end
	
	local coins = leaderstats:FindFirstChild("Coins")
	if coins then
		coins.Value = coins.Value + amount
	end
end

function PurchasePromptManager:AddRebirths(player, amount)
	local leaderstats = player:FindFirstChild("leaderstats")
	if not leaderstats then return end
	
	local rebirths = leaderstats:FindFirstChild("Rebirths")
	if rebirths then
		rebirths.Value = rebirths.Value + amount
	end
end

function PurchasePromptManager:AddChestOpens(player, amount)
	-- Store in player data or leaderstats
	local leaderstats = player:FindFirstChild("leaderstats")
	if not leaderstats then return end
	
	local chestOpens = leaderstats:FindFirstChild("ChestOpens")
	if not chestOpens then
		chestOpens = Instance.new("IntValue")
		chestOpens.Name = "ChestOpens"
		chestOpens.Value = 0
		chestOpens.Parent = leaderstats
	end
	chestOpens.Value = chestOpens.Value + amount
end

function PurchasePromptManager:OnPurchaseComplete(player, productId, purchaseType)
	-- Track this purchase
	if not RecentPurchases[player.UserId] then
		RecentPurchases[player.UserId] = {}
	end
	
	local purchaseKey = purchaseType .. "_" .. productId
	RecentPurchases[player.UserId][purchaseKey] = {
		Time = tick(),
		ProductId = productId,
		Type = purchaseType,
	}
	
	-- Notify client that purchase is complete
	PurchaseCompleteRemote:FireClient(player, {
		ProductId = productId,
		Type = purchaseType,
		Time = tick(),
	})
	
	-- Schedule double prompt
	spawn(function()
		wait(2) -- Wait 2 seconds after purchase
		
		-- Check if player is still in game
		if not player.Parent then return end
		
		-- Show the prompt again
		ShowPromptRemote:FireClient(player, {
			ProductId = productId,
			Type = purchaseType,
			IsDoublePrompt = true,
			Message = "Want more? Purchase again!",
		})
	end)
end

--// CLIENT FUNCTIONS

function PurchasePromptManager:InitClient()
	local Player = Players.LocalPlayer
	local PlayerGui = Player:WaitForChild("PlayerGui")
	
	-- Create double prompt UI
	local DoublePromptGui = Instance.new("ScreenGui")
	DoublePromptGui.Name = "DoublePromptUI"
	DoublePromptGui.ResetOnSpawn = false
	DoublePromptGui.Parent = PlayerGui
	
	-- Handle purchase complete
	PurchaseCompleteRemote.OnClientEvent:Connect(function(data)
		self:ShowPurchaseSuccess(data)
	end)
	
	-- Handle double prompt
	ShowPromptRemote.OnClientEvent:Connect(function(data)
		if data.IsDoublePrompt then
			self:ShowDoublePrompt(data)
		end
	end)
	
	print("[PurchasePromptManager] Client initialized")
end

function PurchasePromptManager:ShowPurchaseSuccess(data)
	local Player = Players.LocalPlayer
	local PlayerGui = Player:WaitForChild("PlayerGui")
	
	-- Success notification
	local successFrame = Instance.new("Frame")
	successFrame.Size = UDim2.new(0, 300, 0, 100)
	successFrame.Position = UDim2.new(0.5, -150, 0, -120)
	successFrame.BackgroundColor3 = Color3.fromRGB(20, 50, 30)
	successFrame.BorderSizePixel = 0
	successFrame.Parent = PlayerGui
	
	local corner = Instance.new("UICorner")
	corner.CornerRadius = UDim.new(0, 10)
	corner.Parent = successFrame
	
	local stroke = Instance.new("UIStroke")
	stroke.Color = Color3.fromRGB(100, 255, 100)
	stroke.Thickness = 2
	stroke.Parent = successFrame
	
	local title = Instance.new("TextLabel")
	title.Size = UDim2.new(1, -10, 0, 30)
	title.Position = UDim2.new(0, 5, 0, 10)
	title.BackgroundTransparency = 1
	title.Text = "PURCHASE COMPLETE!"
	title.TextColor3 = Color3.fromRGB(100, 255, 100)
	title.TextScaled = true
	title.Font = Enum.Font.GothamBold
	title.Parent = successFrame
	
	local sub = Instance.new("TextLabel")
	sub.Size = UDim2.new(1, -10, 0, 50)
	sub.Position = UDim2.new(0, 5, 0, 40)
	sub.BackgroundTransparency = 1
	sub.Text = "Your items have been delivered!"
	sub.TextColor3 = Color3.fromRGB(255, 255, 255)
	sub.TextScaled = true
	sub.Font = Enum.Font.Gotham
	sub.Parent = successFrame
	
	-- Animate in
	TweenService:Create(successFrame, TweenInfo.new(0.5, Enum.EasingStyle.Bounce), {
		Position = UDim2.new(0.5, -150, 0, 50)
	}):Play()
	
	-- Animate out
	wait(3)
	TweenService:Create(successFrame, TweenInfo.new(0.3), {
		Position = UDim2.new(0.5, -150, 0, -120)
	}):Play()
	wait(0.3)
	successFrame:Destroy()
end

function PurchasePromptManager:ShowDoublePrompt(data)
	local Player = Players.LocalPlayer
	local PlayerGui = Player:WaitForChild("PlayerGui")
	
	-- Check if we already have a double prompt open
	local existing = PlayerGui:FindFirstChild("DoublePromptUI")
	if existing then
		local oldPrompt = existing:FindFirstChild("PromptFrame")
		if oldPrompt then
			oldPrompt:Destroy()
		end
	end
	
	local promptFrame = Instance.new("Frame")
	promptFrame.Name = "PromptFrame"
	promptFrame.Size = UDim2.new(0, 350, 0, 200)
	promptFrame.Position = UDim2.new(0.5, -175, 0.5, -100)
	promptFrame.BackgroundColor3 = Color3.fromRGB(20, 20, 35)
	promptFrame.BorderSizePixel = 0
	promptFrame.Parent = DoublePromptGui
	
	local corner = Instance.new("UICorner")
	corner.CornerRadius = UDim.new(0, 12)
	corner.Parent = promptFrame
	
	local stroke = Instance.new("UIStroke")
	stroke.Color = Color3.fromRGB(255, 200, 0)
	stroke.Thickness = 2
	stroke.Parent = promptFrame
	
	-- Title
	local title = Instance.new("TextLabel")
	title.Size = UDim2.new(1, -10, 0, 35)
	title.Position = UDim2.new(0, 5, 0, 10)
	title.BackgroundTransparency = 1
	title.Text = "🎉 GET MORE!"
	title.TextColor3 = Color3.fromRGB(255, 200, 0)
	title.TextScaled = true
	title.Font = Enum.Font.GothamBold
	title.Parent = promptFrame
	
	-- Message
	local msg = Instance.new("TextLabel")
	msg.Size = UDim2.new(1, -20, 0, 50)
	msg.Position = UDim2.new(0, 10, 0, 50)
	msg.BackgroundTransparency = 1
	msg.Text = data.Message or "Want to purchase again?"
	msg.TextColor3 = Color3.fromRGB(255, 255, 255)
	msg.TextScaled = true
	msg.Font = Enum.Font.Gotham
	msg.Parent = promptFrame
	
	-- Yes button
	local yesBtn = Instance.new("TextButton")
	yesBtn.Size = UDim2.new(0.45, -5, 0, 40)
	yesBtn.Position = UDim2.new(0.05, 0, 0, 140)
	yesBtn.BackgroundColor3 = Color3.fromRGB(0, 200, 100)
	yesBtn.Text = "YES!"
	yesBtn.TextColor3 = Color3.fromRGB(255, 255, 255)
	yesBtn.TextScaled = true
	yesBtn.Font = Enum.Font.GothamBold
	yesBtn.Parent = promptFrame
	
	local yesCorner = Instance.new("UICorner")
	yesCorner.CornerRadius = UDim.new(0, 8)
	yesCorner.Parent = yesBtn
	
	-- No button
	local noBtn = Instance.new("TextButton")
	noBtn.Size = UDim2.new(0.45, -5, 0, 40)
	noBtn.Position = UDim2.new(0.5, 5, 0, 140)
	noBtn.BackgroundColor3 = Color3.fromRGB(200, 50, 50)
	noBtn.Text = "NO THANKS"
	noBtn.TextColor3 = Color3.fromRGB(255, 255, 255)
	noBtn.TextScaled = true
	noBtn.Font = Enum.Font.GothamBold
	noBtn.Parent = promptFrame
	
	local noCorner = Instance.new("UICorner")
	noCorner.CornerRadius = UDim.new(0, 8)
	noCorner.Parent = noBtn
	
	-- Button actions
	yesBtn.MouseButton1Click:Connect(function()
		-- Re-prompt purchase
		if data.Type == "Product" then
			MarketplaceService:PromptProductPurchase(Player, data.ProductId)
		elseif data.Type == "Gamepass" then
			MarketplaceService:PromptGamePassPurchase(Player, data.ProductId)
		end
		
		-- Close prompt
		TweenService:Create(promptFrame, TweenInfo.new(0.3), {
			Size = UDim2.new(0, 0, 0, 0),
			Position = UDim2.new(0.5, 0, 0.5, 0)
		}):Play()
		wait(0.3)
		promptFrame:Destroy()
	end)
	
	noBtn.MouseButton1Click:Connect(function()
		TweenService:Create(promptFrame, TweenInfo.new(0.3), {
			Size = UDim2.new(0, 0, 0, 0),
			Position = UDim2.new(0.5, 0, 0.5, 0)
		}):Play()
		wait(0.3)
		promptFrame:Destroy()
	end)
	
	-- Auto-close after 10 seconds
	spawn(function()
		wait(10)
		if promptFrame and promptFrame.Parent then
			TweenService:Create(promptFrame, TweenInfo.new(0.3), {
				Size = UDim2.new(0, 0, 0, 0),
				Position = UDim2.new(0.5, 0, 0.5, 0)
			}):Play()
			wait(0.3)
			if promptFrame then
				promptFrame:Destroy()
			end
		end
	end)
	
	-- Animate in
	promptFrame.Size = UDim2.new(0, 0, 0, 0)
	promptFrame.Position = UDim2.new(0.5, 0, 0.5, 0)
	TweenService:Create(promptFrame, TweenInfo.new(0.5, Enum.EasingStyle.Back), {
		Size = UDim2.new(0, 350, 0, 200),
		Position = UDim2.new(0.5, -175, 0.5, -100)
	}):Play()
end

return PurchasePromptManager
