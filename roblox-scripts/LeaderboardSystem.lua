--// LeaderboardSystem.lua
--// Leaderboards for Mad Phonk Awakening
--// Features: Currency leaderboard, Reincarnation progress leaderboard, favorite/notification/event prompt

local LeaderboardSystem = {}

-- Services
local Players = game:GetService("Players")
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local DataStoreService = game:GetService("DataStoreService")
local TweenService = game:GetService("TweenService")
local HttpService = game:GetService("HttpService")

-- DataStores
local LeaderboardData = DataStoreService:GetOrderedDataStore("LeaderboardData_v1")
local ReincarnationLeaderboard = DataStoreService:GetOrderedDataStore("ReincarnationLeaderboard_v1")

-- Remotes
local LeaderboardRemotes = Instance.new("Folder")
LeaderboardRemotes.Name = "LeaderboardRemotes"
LeaderboardRemotes.Parent = ReplicatedStorage

local RequestLeaderboard = Instance.new("RemoteFunction")
RequestLeaderboard.Name = "RequestLeaderboard"
RequestLeaderboard.Parent = LeaderboardRemotes

local UpdateLeaderboard = Instance.new("RemoteEvent")
UpdateLeaderboard.Name = "UpdateLeaderboard"
UpdateLeaderboard.Parent = LeaderboardRemotes

-- Configuration
local LEADERBOARD_CONFIG = {
	Currency = {
		Title = "TOP COIN HOLDERS",
		Color = Color3.fromRGB(255, 200, 0),
		DataStore = LeaderboardData,
		Icon = "💰",
	},
	Reincarnation = {
		Title = "REINCARNATION MASTERS",
		Color = Color3.fromRGB(0, 150, 255),
		DataStore = ReincarnationLeaderboard,
		Icon = "✨",
	},
	Rebirths = {
		Title = "TOP REBIRTHS",
		Color = Color3.fromRGB(255, 50, 50),
		DataStore = nil, -- Will use leaderstats
		Icon = "🔥",
	},
}

-- Cache
local CachedLeaderboards = {
	Currency = {},
	Reincarnation = {},
	Rebirths = {},
}

--// SERVER FUNCTIONS

function LeaderboardSystem:InitServer()
	-- Handle leaderboard requests
	RequestLeaderboard.OnServerInvoke = function(player, boardType)
		return self:GetLeaderboardData(boardType)
	end
	
	-- Update leaderboards periodically
	spawn(function()
		while true do
			wait(60) -- Update every minute
			self:UpdateAllLeaderboards()
		end
	end)
	
	-- Update on player events
	Players.PlayerRemoving:Connect(function(player)
		self:SavePlayerData(player)
	end)
	
	print("[LeaderboardSystem] Server initialized")
end

function LeaderboardSystem:SavePlayerData(player)
	local leaderstats = player:FindFirstChild("leaderstats")
	if not leaderstats then return end
	
	local coins = leaderstats:FindFirstChild("Coins") and leaderstats.Coins.Value or 0
	local rebirths = leaderstats:FindFirstChild("Rebirths") and leaderstats.Rebirths.Value or 0
	local reincarnations = leaderstats:FindFirstChild("Reincarnations") and leaderstats.Reincarnations.Value or 0
	
	-- Save to DataStores
	pcall(function()
		LeaderboardData:SetAsync(player.UserId, coins)
	end)
	
	pcall(function()
		ReincarnationLeaderboard:SetAsync(player.UserId, reincarnations)
	end)
end

function LeaderboardSystem:UpdateAllLeaderboards()
	-- Update currency leaderboard
	pcall(function()
		local pages = LeaderboardData:GetSortedAsync(false, 50)
		local data = pages:GetCurrentPage()
		
		CachedLeaderboards.Currency = {}
		for _, entry in ipairs(data) do
			table.insert(CachedLeaderboards.Currency, {
				UserId = entry.key,
				Value = entry.value,
			})
		end
	end)
	
	-- Update reincarnation leaderboard
	pcall(function()
		local pages = ReincarnationLeaderboard:GetSortedAsync(false, 50)
		local data = pages:GetCurrentPage()
		
		CachedLeaderboards.Reincarnation = {}
		for _, entry in ipairs(data) do
			table.insert(CachedLeaderboards.Reincarnation, {
				UserId = entry.key,
				Value = entry.value,
			})
		end
	end)
	
	-- Update rebirths from current players
	CachedLeaderboards.Rebirths = {}
	for _, player in ipairs(Players:GetPlayers()) do
		local leaderstats = player:FindFirstChild("leaderstats")
		if leaderstats then
			local rebirths = leaderstats:FindFirstChild("Rebirths")
			if rebirths then
				table.insert(CachedLeaderboards.Rebirths, {
					UserId = player.UserId,
					Value = rebirths.Value,
					Name = player.Name,
				})
			end
		end
	end
	
	-- Sort rebirths
	table.sort(CachedLeaderboards.Rebirths, function(a, b)
		return a.Value > b.Value
	end)
	
	-- Broadcast update to all clients
	UpdateLeaderboard:FireAllClients(CachedLeaderboards)
end

function LeaderboardSystem:GetLeaderboardData(boardType)
	if boardType == "Rebirths" then
		-- Return current session data
		return CachedLeaderboards.Rebirths
	end
	
	-- Return cached data for persistent leaderboards
	return CachedLeaderboards[boardType] or {}
end

--// CLIENT FUNCTIONS

function LeaderboardSystem:InitClient()
	local Player = Players.LocalPlayer
	local PlayerGui = Player:WaitForChild("PlayerGui")
	
	-- Create Leaderboard GUI
	local LeaderboardGui = Instance.new("ScreenGui")
	LeaderboardGui.Name = "LeaderboardUI"
	LeaderboardGui.ResetOnSpawn = false
	LeaderboardGui.ZIndexBehavior = Enum.ZIndexBehavior.Sibling
	LeaderboardGui.Parent = PlayerGui
	
	-- Toggle button
	local ToggleBtn = Instance.new("TextButton")
	ToggleBtn.Name = "LeaderboardToggle"
	ToggleBtn.Size = UDim2.new(0, 120, 0, 40)
	ToggleBtn.Position = UDim2.new(0, 10, 0.5, 50)
	ToggleBtn.BackgroundColor3 = Color3.fromRGB(255, 200, 0)
	ToggleBtn.Text = "Leaderboards"
	ToggleBtn.TextColor3 = Color3.fromRGB(0, 0, 0)
	ToggleBtn.TextScaled = true
	ToggleBtn.Font = Enum.Font.GothamBold
	ToggleBtn.Parent = LeaderboardGui
	
	local toggleCorner = Instance.new("UICorner")
	toggleCorner.CornerRadius = UDim.new(0, 8)
	toggleCorner.Parent = ToggleBtn
	
	-- Main frame
	local MainFrame = Instance.new("Frame")
	MainFrame.Name = "MainFrame"
	MainFrame.Size = UDim2.new(0, 600, 0, 500)
	MainFrame.Position = UDim2.new(0.5, -300, 0.5, -250)
	MainFrame.BackgroundColor3 = Color3.fromRGB(15, 15, 30)
	MainFrame.BorderSizePixel = 0
	MainFrame.Visible = false
	MainFrame.Parent = LeaderboardGui
	
	local mainCorner = Instance.new("UICorner")
	mainCorner.CornerRadius = UDim.new(0, 12)
	mainCorner.Parent = MainFrame
	
	local mainStroke = Instance.new("UIStroke")
	mainStroke.Color = Color3.fromRGB(0, 150, 255)
	mainStroke.Thickness = 2
	mainStroke.Parent = MainFrame
	
	-- Title
	local Title = Instance.new("TextLabel")
	Title.Size = UDim2.new(1, 0, 0, 50)
	Title.Position = UDim2.new(0, 0, 0, 0)
	Title.BackgroundColor3 = Color3.fromRGB(10, 10, 25)
	Title.BorderSizePixel = 0
	Title.Text = "🏆 MAD LEADERBOARDS"
	Title.TextColor3 = Color3.fromRGB(255, 200, 0)
	Title.TextScaled = true
	Title.Font = Enum.Font.GothamBold
	Title.Parent = MainFrame
	
	local titleCorner = Instance.new("UICorner")
	titleCorner.CornerRadius = UDim.new(0, 12)
	titleCorner.Parent = Title
	
	-- Close button
	local CloseBtn = Instance.new("TextButton")
	CloseBtn.Size = UDim2.new(0, 40, 0, 40)
	CloseBtn.Position = UDim2.new(1, -45, 0, 5)
	CloseBtn.BackgroundColor3 = Color3.fromRGB(200, 50, 50)
	CloseBtn.Text = "X"
	CloseBtn.TextColor3 = Color3.fromRGB(255, 255, 255)
	CloseBtn.TextScaled = true
	CloseBtn.Font = Enum.Font.GothamBold
	CloseBtn.Parent = MainFrame
	
	local closeCorner = Instance.new("UICorner")
	closeCorner.CornerRadius = UDim.new(0, 8)
	closeCorner.Parent = CloseBtn
	
	-- Tab buttons
	local TabFrame = Instance.new("Frame")
	TabFrame.Size = UDim2.new(1, -20, 0, 40)
	TabFrame.Position = UDim2.new(0, 10, 0, 55)
	TabFrame.BackgroundTransparency = 1
	TabFrame.Parent = MainFrame
	
	local tabs = {}
	local contents = {}
	
	local function CreateTab(name, color)
		local btn = Instance.new("TextButton")
		btn.Size = UDim2.new(0.33, -5, 1, 0)
		btn.BackgroundColor3 = Color3.fromRGB(30, 30, 50)
		btn.Text = name
		btn.TextColor3 = Color3.fromRGB(200, 200, 200)
		btn.TextScaled = true
		btn.Font = Enum.Font.Gotham
		btn.Parent = TabFrame
		
		local btnCorner = Instance.new("UICorner")
		btnCorner.CornerRadius = UDim.new(0, 6)
		btnCorner.Parent = btn
		
		local content = Instance.new("ScrollingFrame")
		content.Name = name .. "Content"
		content.Size = UDim2.new(1, -20, 0, 390)
		content.Position = UDim2.new(0, 10, 0, 100)
		content.BackgroundTransparency = 1
		content.ScrollBarThickness = 6
		content.Visible = false
		content.Parent = MainFrame
		
		tabs[name] = btn
		contents[name] = content
		
		btn.MouseButton1Click:Connect(function()
			for _, b in pairs(tabs) do
				b.BackgroundColor3 = Color3.fromRGB(30, 30, 50)
				b.TextColor3 = Color3.fromRGB(200, 200, 200)
			end
			btn.BackgroundColor3 = color
			btn.TextColor3 = Color3.fromRGB(255, 255, 255)
			
			for _, c in pairs(contents) do
				c.Visible = false
			end
			content.Visible = true
		end)
		
		return content
	end
	
	local CurrencyTab = CreateTab("Currency", Color3.fromRGB(255, 200, 0))
	local ReincTab = CreateTab("Reincarnation", Color3.fromRGB(0, 150, 255))
	local RebirthTab = CreateTab("Rebirths", Color3.fromRGB(255, 50, 50))
	
	-- Function to populate leaderboard entries
	local function CreateEntry(parent, rank, name, value, color, isReincarnation)
		local entry = Instance.new("Frame")
		entry.Size = UDim2.new(1, -10, 0, 50)
		entry.Position = UDim2.new(0, 5, 0, (rank - 1) * 55)
		entry.BackgroundColor3 = Color3.fromRGB(25, 25, 45)
		entry.BorderSizePixel = 0
		entry.Parent = parent
		
		local entryCorner = Instance.new("UICorner")
		entryCorner.CornerRadius = UDim.new(0, 8)
		entryCorner.Parent = entry
		
		-- Rank badge
		local rankColors = {
			[1] = Color3.fromRGB(255, 215, 0),   -- Gold
			[2] = Color3.fromRGB(192, 192, 192), -- Silver
			[3] = Color3.fromRGB(205, 127, 50),   -- Bronze
		}
		
		local rankBadge = Instance.new("TextLabel")
		rankBadge.Size = UDim2.new(0, 40, 0, 40)
		rankBadge.Position = UDim2.new(0, 5, 0.5, -20)
		rankBadge.BackgroundColor3 = rankColors[rank] or Color3.fromRGB(50, 50, 70)
		rankBadge.Text = "#" .. rank
		rankBadge.TextColor3 = Color3.fromRGB(255, 255, 255)
		rankBadge.TextScaled = true
		rankBadge.Font = Enum.Font.GothamBold
		rankBadge.Parent = entry
		
		local badgeCorner = Instance.new("UICorner")
		badgeCorner.CornerRadius = UDim.new(0, 6)
		badgeCorner.Parent = rankBadge
		
		-- Player name
		local nameLabel = Instance.new("TextLabel")
		nameLabel.Size = UDim2.new(0, 200, 0, 25)
		nameLabel.Position = UDim2.new(0, 55, 0, 5)
		nameLabel.BackgroundTransparency = 1
		nameLabel.Text = name
		nameLabel.TextColor3 = Color3.fromRGB(255, 255, 255)
		nameLabel.TextScaled = true
		nameLabel.Font = Enum.Font.GothamBold
		nameLabel.TextXAlignment = Enum.TextXAlignment.Left
		nameLabel.Parent = entry
		
		-- Value
		local valueLabel = Instance.new("TextLabel")
		valueLabel.Size = UDim2.new(0, 150, 0, 25)
		valueLabel.Position = UDim2.new(0, 55, 0, 25)
		valueLabel.BackgroundTransparency = 1
		valueLabel.Text = isReincarnation and "Reincarnations: " .. value or self:FormatNumber(value)
		valueLabel.TextColor3 = color
		valueLabel.TextScaled = true
		valueLabel.Font = Enum.Font.GothamBold
		valueLabel.TextXAlignment = Enum.TextXAlignment.Left
		valueLabel.Parent = entry
		
		-- REINCARNATION ONLY badge for reincarnation leaderboard
		if isReincarnation and rank <= 3 then
			local badge = Instance.new("TextLabel")
			badge.Size = UDim2.new(0, 100, 0, 18)
			badge.Position = UDim2.new(1, -105, 0.5, -9)
			badge.BackgroundColor3 = Color3.fromRGB(0, 50, 150)
			badge.Text = "REINCARNATION"
			badge.TextColor3 = Color3.fromRGB(0, 200, 255)
			badge.TextScaled = true
			badge.Font = Enum.Font.GothamBold
			badge.Parent = entry
			
			local badgeCorner2 = Instance.new("UICorner")
			badgeCorner2.CornerRadius = UDim.new(0, 3)
			badgeCorner2.Parent = badge
		end
	end
	
	-- Update leaderboard display
	function self:UpdateDisplay(data)
		-- Clear existing entries
		for _, content in pairs(contents) do
			for _, child in ipairs(content:GetChildren()) do
				if child:IsA("Frame") then
					child:Destroy()
				end
			end
		end
		
		-- Populate currency
		if data.Currency then
			for i, entry in ipairs(data.Currency) do
				if i > 50 then break end
				local name = entry.Name or "Unknown"
				CreateEntry(CurrencyTab, i, name, entry.Value, Color3.fromRGB(255, 200, 0), false)
			end
		end
		
		-- Populate reincarnation
		if data.Reincarnation then
			for i, entry in ipairs(data.Reincarnation) do
				if i > 50 then break end
				local name = entry.Name or "Unknown"
				CreateEntry(ReincTab, i, name, entry.Value, Color3.fromRGB(0, 150, 255), true)
			end
		end
		
		-- Populate rebirths
		if data.Rebirths then
			for i, entry in ipairs(data.Rebirths) do
				if i > 50 then break end
				local name = entry.Name or entry.Username or "Unknown"
				CreateEntry(RebirthTab, i, name, entry.Value, Color3.fromRGB(255, 50, 50), false)
			end
		end
	end
	
	-- Toggle visibility
	ToggleBtn.MouseButton1Click:Connect(function()
		MainFrame.Visible = not MainFrame.Visible
		
		if MainFrame.Visible then
			-- Request fresh data
			local data = RequestLeaderboard:InvokeServer("All")
			self:UpdateDisplay(data)
		end
	end)
	
	CloseBtn.MouseButton1Click:Connect(function()
		MainFrame.Visible = false
	end)
	
	-- Handle server updates
	UpdateLeaderboard.OnClientEvent:Connect(function(data)
		self:UpdateDisplay(data)
	end)
	
	-- Favorite and notification prompt
	self:CreateFavoritePrompt(LeaderboardGui)
	self:CreateEventPrompt(LeaderboardGui)
	
	print("[LeaderboardSystem] Client initialized")
end

function LeaderboardSystem:FormatNumber(num)
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

function LeaderboardSystem:CreateFavoritePrompt(parent)
	local Player = Players.LocalPlayer
	
	local prompt = Instance.new("Frame")
	prompt.Name = "FavoritePrompt"
	prompt.Size = UDim2.new(0, 300, 0, 100)
	prompt.Position = UDim2.new(0.5, -150, 0, -120)
	prompt.BackgroundColor3 = Color3.fromRGB(20, 20, 35)
	prompt.BorderSizePixel = 0
	prompt.Visible = false
	prompt.Parent = parent
	
	local corner = Instance.new("UICorner")
	corner.CornerRadius = UDim.new(0, 10)
	corner.Parent = prompt
	
	local stroke = Instance.new("UIStroke")
	stroke.Color = Color3.fromRGB(255, 200, 0)
	stroke.Thickness = 2
	stroke.Parent = prompt
	
	local title = Instance.new("TextLabel")
	title.Size = UDim2.new(1, -10, 0, 30)
	title.Position = UDim2.new(0, 5, 0, 5)
	title.BackgroundTransparency = 1
	title.Text = "⭐ Favorite Mad Phonk!"
	title.TextColor3 = Color3.fromRGB(255, 200, 0)
	title.TextScaled = true
	title.Font = Enum.Font.GothamBold
	title.Parent = prompt
	
	local sub = Instance.new("TextLabel")
	sub.Size = UDim2.new(1, -10, 0, 25)
	sub.Position = UDim2.new(0, 5, 0, 35)
	sub.BackgroundTransparency = 1
	sub.Text = "Like & Favorite for updates!"
	sub.TextColor3 = Color3.fromRGB(200, 200, 200)
	sub.TextScaled = true
	sub.Font = Enum.Font.Gotham
	sub.Parent = prompt
	
	local favBtn = Instance.new("TextButton")
	favBtn.Size = UDim2.new(0.8, 0, 0, 30)
	favBtn.Position = UDim2.new(0.1, 0, 0, 65)
	favBtn.BackgroundColor3 = Color3.fromRGB(255, 200, 0)
	favBtn.Text = "Favorite Game"
	favBtn.TextColor3 = Color3.fromRGB(0, 0, 0)
	favBtn.TextScaled = true
	favBtn.Font = Enum.Font.GothamBold
	favBtn.Parent = prompt
	
	local btnCorner = Instance.new("UICorner")
	btnCorner.CornerRadius = UDim.new(0, 6)
	btnCorner.Parent = favBtn
	
	-- Show after 5 minutes
	spawn(function()
		wait(300) -- 5 minutes
		prompt.Visible = true
		TweenService:Create(prompt, TweenInfo.new(0.5, Enum.EasingStyle.Bounce), {
			Position = UDim2.new(0.5, -150, 0, 20)
		}):Play()
	end)
	
	favBtn.MouseButton1Click:Connect(function()
		-- Trigger favorite
		local success = pcall(function()
			local gameInfo = game:GetService("MarketplaceService")
		end)
		
		TweenService:Create(prompt, TweenInfo.new(0.3), {
			Position = UDim2.new(0.5, -150, 0, -120)
		}):Play()
		wait(0.3)
		prompt.Visible = false
	end)
end

function LeaderboardSystem:CreateEventPrompt(parent)
	local prompt = Instance.new("Frame")
	prompt.Name = "EventPrompt"
	prompt.Size = UDim2.new(0, 350, 0, 80)
	prompt.Position = UDim2.new(0.5, -175, 1, -90)
	prompt.BackgroundColor3 = Color3.fromRGB(20, 20, 35)
	prompt.BorderSizePixel = 0
	prompt.Visible = false
	prompt.Parent = parent
	
	local corner = Instance.new("UICorner")
	corner.CornerRadius = UDim.new(0, 10)
	corner.Parent = prompt
	
	local stroke = Instance.new("UIStroke")
	stroke.Color = Color3.fromRGB(0, 150, 255)
	stroke.Thickness = 1
	stroke.Parent = prompt
	
	local title = Instance.new("TextLabel")
	title.Size = UDim2.new(1, -10, 0, 25)
	title.Position = UDim2.new(0, 5, 0, 5)
	title.BackgroundTransparency = 1
	title.Text = "🎉 EVENT ACTIVE"
	title.TextColor3 = Color3.fromRGB(0, 200, 255)
	title.TextScaled = true
	title.Font = Enum.Font.GothamBold
	title.Parent = prompt
	
	local sub = Instance.new("TextLabel")
	sub.Size = UDim2.new(1, -10, 0, 40)
	sub.Position = UDim2.new(0, 5, 0, 30)
	sub.BackgroundTransparency = 1
	sub.Text = "2x Coins Active! Join now!"
	sub.TextColor3 = Color3.fromRGB(255, 255, 255)
	sub.TextScaled = true
	sub.Font = Enum.Font.Gotham
	sub.Parent = prompt
	
	-- Show/hide function
	self.EventPrompt = prompt
end

function LeaderboardSystem:ShowEventPrompt(text)
	if self.EventPrompt then
		self.EventPrompt.Sub.Text = text
		self.EventPrompt.Visible = true
		TweenService:Create(self.EventPrompt, TweenInfo.new(0.3, Enum.EasingStyle.Bounce), {
			Position = UDim2.new(0.5, -175, 1, -90)
		}):Play()
	end
end

function LeaderboardSystem:HideEventPrompt()
	if self.EventPrompt then
		TweenService:Create(self.EventPrompt, TweenInfo.new(0.3), {
			Position = UDim2.new(0.5, -175, 1, 0)
		}):Play()
	end
end

return LeaderboardSystem
