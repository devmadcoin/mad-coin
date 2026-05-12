--// ReincarnationUI.lua
--// Client-side UI for Mad Phonk Awakening Reincarnation
--// Handles: Reincarnation menu, item display, purchase prompts, "REINCARNATION ONLY" labels

local ReincarnationUI = {}

-- Services
local Players = game:GetService("Players")
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local TweenService = game:GetService("TweenService")
local UserInputService = game:GetService("UserInputService")

local Player = Players.LocalPlayer
local PlayerGui = Player:WaitForChild("PlayerGui")

-- Remotes
local Remotes = ReplicatedStorage:WaitForChild("ReincarnationRemotes")
local ReincarnateRemote = Remotes:WaitForChild("Reincarnate")
local RequestReincarnationData = Remotes:WaitForChild("RequestReincarnationData")
local PurchasePromptRemote = Remotes:WaitForChild("PurchasePrompt")
local NotificationRemote = Remotes:WaitForChild("Notification")
local InitDataRemote = Remotes:WaitForChild("InitReincarnationData")

-- UI Container
local ReincarnationGui = Instance.new("ScreenGui")
ReincarnationGui.Name = "ReincarnationUI"
ReincarnationGui.ResetOnSpawn = false
ReincarnationGui.ZIndexBehavior = Enum.ZIndexBehavior.Sibling
ReincarnationGui.Parent = PlayerGui

--// UI CREATION HELPERS
local function CreateFrame(props)
	local frame = Instance.new("Frame")
	for prop, val in pairs(props) do
		frame[prop] = val
	end
	return frame
end

local function CreateTextLabel(props)
	local label = Instance.new("TextLabel")
	for prop, val in pairs(props) do
		label[prop] = val
	end
	return label
end

local function CreateTextButton(props)
	local button = Instance.new("TextButton")
	for prop, val in pairs(props) do
		button[prop] = val
	end
	return button
end

local function CreateImageLabel(props)
	local img = Instance.new("ImageLabel")
	for prop, val in pairs(props) do
		img[prop] = val
	end
	return img
end

local function CreateUICorner(radius)
	local corner = Instance.new("UICorner")
	corner.CornerRadius = UDim.new(0, radius or 8)
	return corner
end

local function CreateUIStroke(color, thickness)
	local stroke = Instance.new("UIStroke")
	stroke.Color = color or Color3.fromRGB(255, 255, 255)
	stroke.Thickness = thickness or 1
	return stroke
end

local function CreateUIGrid(props)
	local grid = Instance.new("UIGridLayout")
	for prop, val in pairs(props) do
		grid[prop] = val
	end
	return grid
end

--// MAIN FRAME
local MainFrame = CreateFrame({
	Name = "MainFrame",
	Size = UDim2.new(0, 700, 0, 500),
	Position = UDim2.new(0.5, -350, 0.5, -250),
	BackgroundColor3 = Color3.fromRGB(15, 15, 30),
	BorderSizePixel = 0,
	Visible = false,
	Parent = ReincarnationGui,
})
CreateUICorner(12).Parent = MainFrame
CreateUIStroke(Color3.fromRGB(0, 150, 255), 2).Parent = MainFrame

-- Title
local TitleBar = CreateFrame({
	Name = "TitleBar",
	Size = UDim2.new(1, 0, 0, 50),
	Position = UDim2.new(0, 0, 0, 0),
	BackgroundColor3 = Color3.fromRGB(10, 10, 25),
	BorderSizePixel = 0,
	Parent = MainFrame,
})
CreateUICorner(12).Parent = TitleBar

local TitleText = CreateTextLabel({
	Name = "Title",
	Size = UDim2.new(1, 0, 1, 0),
	Position = UDim2.new(0, 0, 0, 0),
	BackgroundTransparency = 1,
	Text = "REINCARNATION",
	TextColor3 = Color3.fromRGB(0, 200, 255),
	TextScaled = true,
	Font = Enum.Font.GothamBold,
	Parent = TitleBar,
})

-- Close Button
local CloseButton = CreateTextButton({
	Name = "CloseButton",
	Size = UDim2.new(0, 40, 0, 40),
	Position = UDim2.new(1, -45, 0, 5),
	BackgroundColor3 = Color3.fromRGB(200, 50, 50),
	Text = "X",
	TextColor3 = Color3.fromRGB(255, 255, 255),
	TextScaled = true,
	Font = Enum.Font.GothamBold,
	Parent = TitleBar,
})
CreateUICorner(8).Parent = CloseButton

--// TAB SYSTEM
local TabFrame = CreateFrame({
	Name = "TabFrame",
	Size = UDim2.new(1, -20, 0, 40),
	Position = UDim2.new(0, 10, 0, 55),
	BackgroundTransparency = 1,
	Parent = MainFrame,
})

local TabButtons = {}
local TabContents = {}

local function CreateTab(name, icon)
	local tabBtn = CreateTextButton({
		Name = name .. "Tab",
		Size = UDim2.new(0.2, -4, 1, 0),
		BackgroundColor3 = Color3.fromRGB(30, 30, 50),
		Text = name,
		TextColor3 = Color3.fromRGB(200, 200, 200),
		Font = Enum.Font.Gotham,
		Parent = TabFrame,
	})
	CreateUICorner(6).Parent = tabBtn
	
	local content = CreateFrame({
		Name = name .. "Content",
		Size = UDim2.new(1, -20, 0, 390),
		Position = UDim2.new(0, 10, 0, 100),
		BackgroundColor3 = Color3.fromRGB(20, 20, 35),
		BorderSizePixel = 0,
		Visible = false,
		Parent = MainFrame,
	})
	CreateUICorner(8).Parent = content
	
	TabButtons[name] = tabBtn
	TabContents[name] = content
	
	tabBtn.MouseButton1Click:Connect(function()
		for _, btn in pairs(TabButtons) do
			btn.BackgroundColor3 = Color3.fromRGB(30, 30, 50)
			btn.TextColor3 = Color3.fromRGB(200, 200, 200)
		end
		tabBtn.BackgroundColor3 = Color3.fromRGB(0, 150, 255)
		tabBtn.TextColor3 = Color3.fromRGB(255, 255, 255)
		
		for _, cont in pairs(TabContents) do
			cont.Visible = false
		end
		content.Visible = true
	end)
	
	return content
end

-- Create tabs
local RebirthTab = CreateTab("Rebirth")
local AurasTab = CreateTab("Auras")
local PosesTab = CreateTab("Poses")
local PetsTab = CreateTab("Pets")
local ChestsTab = CreateTab("Chests")

--// REBIRTH TAB CONTENT
-- Reincarnation Status
local StatusFrame = CreateFrame({
	Name = "StatusFrame",
	Size = UDim2.new(1, -20, 0, 120),
	Position = UDim2.new(0, 10, 0, 10),
	BackgroundColor3 = Color3.fromRGB(25, 25, 45),
	Parent = RebirthTab,
})
CreateUICorner(8).Parent = StatusFrame

local ReincarnationLabel = CreateTextLabel({
	Name = "ReincarnationLabel",
	Size = UDim2.new(1, -20, 0, 30),
	Position = UDim2.new(0, 10, 0, 10),
	BackgroundTransparency = 1,
	Text = "Reincarnations: 0",
	TextColor3 = Color3.fromRGB(0, 200, 255),
	TextScaled = true,
	Font = Enum.Font.GothamBold,
	Parent = StatusFrame,
})

local MultiplierLabel = CreateTextLabel({
	Name = "MultiplierLabel",
	Size = UDim2.new(1, -20, 0, 30),
	Position = UDim2.new(0, 10, 0, 45),
	BackgroundTransparency = 1,
	Text = "Multiplier: x1",
	TextColor3 = Color3.fromRGB(255, 200, 0),
	TextScaled = true,
	Font = Enum.Font.GothamBold,
	Parent = StatusFrame,
})

local CurrencyLabel = CreateTextLabel({
	Name = "CurrencyLabel",
	Size = UDim2.new(1, -20, 0, 30),
	Position = UDim2.new(0, 10, 0, 80),
	BackgroundTransparency = 1,
	Text = "Reincarnation Currency: 0",
	TextColor3 = Color3.fromRGB(0, 150, 255),
	TextScaled = true,
	Font = Enum.Font.GothamBold,
	Parent = StatusFrame,
})

-- Reincarnate Button
local ReincarnateButton = CreateTextButton({
	Name = "ReincarnateButton",
	Size = UDim2.new(0.8, 0, 0, 50),
	Position = UDim2.new(0.1, 0, 0, 140),
	BackgroundColor3 = Color3.fromRGB(0, 100, 200),
	Text = "REINCARNATE",
	TextColor3 = Color3.fromRGB(255, 255, 255),
	TextScaled = true,
	Font = Enum.Font.GothamBold,
	Parent = RebirthTab,
})
CreateUICorner(10).Parent = ReincarnateButton

local ReincarnateLockedLabel = CreateTextLabel({
	Name = "LockedLabel",
	Size = UDim2.new(0.8, 0, 0, 30),
	Position = UDim2.new(0.1, 0, 0, 195),
	BackgroundTransparency = 1,
	Text = "Reach near-INF power to unlock!",
	TextColor3 = Color3.fromRGB(255, 100, 100),
	TextScaled = true,
	Font = Enum.Font.Gotham,
	Parent = RebirthTab,
})

-- REINCARNATION ONLY Badge
local ReincarnationOnlyBadge = CreateTextLabel({
	Name = "ReincarnationOnlyBadge",
	Size = UDim2.new(0, 150, 0, 25),
	Position = UDim2.new(0.5, -75, 0, 230),
	BackgroundColor3 = Color3.fromRGB(0, 50, 150),
	Text = "REINCARNATION ONLY",
	TextColor3 = Color3.fromRGB(0, 200, 255),
	TextScaled = true,
	Font = Enum.Font.GothamBold,
	Parent = RebirthTab,
})
CreateUICorner(6).Parent = ReincarnationOnlyBadge

--// AURAS TAB CONTENT
local function CreateItemGrid(parent, itemType)
	local scrollFrame = Instance.new("ScrollingFrame")
	scrollFrame.Name = itemType .. "Grid"
	scrollFrame.Size = UDim2.new(1, -20, 1, -20)
	scrollFrame.Position = UDim2.new(0, 10, 0, 10)
	scrollFrame.BackgroundTransparency = 1
	scrollFrame.ScrollBarThickness = 6
	scrollFrame.Parent = parent
	
	local grid = CreateUIGrid({
		CellSize = UDim2.new(0, 120, 0, 140),
		CellPadding = UDim2.new(0, 10, 0, 10),
		FillDirection = Enum.FillDirection.Horizontal,
		Parent = scrollFrame,
	})
	
	return scrollFrame
end

local AurasGrid = CreateItemGrid(AurasTab, "Aura")
local PosesGrid = CreateItemGrid(PosesTab, "Pose")
local PetsGrid = CreateItemGrid(PetsTab, "Pet")

--// CHESTS TAB CONTENT
local ChestsFrame = CreateFrame({
	Name = "ChestsFrame",
	Size = UDim2.new(1, -20, 0, 200),
	Position = UDim2.new(0, 10, 0, 10),
	BackgroundColor3 = Color3.fromRGB(25, 25, 45),
	Parent = ChestsTab,
})
CreateUICorner(8).Parent = ChestsFrame

local ChestsTitle = CreateTextLabel({
	Name = "ChestsTitle",
	Size = UDim2.new(1, 0, 0, 30),
	Position = UDim2.new(0, 0, 0, 10),
	BackgroundTransparency = 1,
	Text = "REINCARNATION CHESTS",
	TextColor3 = Color3.fromRGB(0, 200, 255),
	TextScaled = true,
	Font = Enum.Font.GothamBold,
	Parent = ChestsFrame,
})

-- Chest buttons
local chestTiers = {
	{ Name = "Common Chest", Color = Color3.fromRGB(150, 150, 150), Cost = 100 },
	{ Name = "Rare Chest", Color = Color3.fromRGB(0, 150, 255), Cost = 500 },
	{ Name = "Legendary Chest", Color = Color3.fromRGB(255, 200, 0), Cost = 2000 },
}

for i, chest in ipairs(chestTiers) do
	local chestBtn = CreateTextButton({
		Name = chest.Name,
		Size = UDim2.new(0.3, -10, 0, 100),
		Position = UDim2.new((i-1) * 0.33 + 0.02, 0, 0, 50),
		BackgroundColor3 = chest.Color,
		Text = chest.Name .. "\nCost: " .. chest.Cost,
		TextColor3 = Color3.fromRGB(255, 255, 255),
		TextScaled = true,
		Font = Enum.Font.GothamBold,
		Parent = ChestsFrame,
	})
	CreateUICorner(8).Parent = chestBtn
	
	chestBtn.MouseButton1Click:Connect(function()
		-- Fire server to open chest
		local openRemote = ReplicatedStorage:FindFirstChild("OpenReincarnationChest")
		if openRemote then
			openRemote:FireServer(i)
		end
	end)
end

--// TOGGLE UI
local ToggleButton = CreateTextButton({
	Name = "ToggleButton",
	Size = UDim2.new(0, 120, 0, 40),
	Position = UDim2.new(0, 10, 0.5, -20),
	BackgroundColor3 = Color3.fromRGB(0, 100, 200),
	Text = "Reincarnation",
	TextColor3 = Color3.fromRGB(255, 255, 255),
	TextScaled = true,
	Font = Enum.Font.GothamBold,
	Parent = ReincarnationGui,
})
CreateUICorner(8).Parent = ToggleButton

ToggleButton.MouseButton1Click:Connect(function()
	MainFrame.Visible = not MainFrame.Visible
end)

CloseButton.MouseButton1Click:Connect(function()
	MainFrame.Visible = false
end)

--// DATA MANAGEMENT
local CurrentData = {
	Reincarnations = 0,
	ReincarnationCurrency = 0,
	HasReincarnationTrack = false,
	Multiplier = 1,
	UnlockedPoses = {},
	UnlockedAuras = {},
	UnlockedPets = {},
}

-- Update UI with data
function ReincarnationUI:UpdateUI(data)
	CurrentData = data
	
	ReincarnationLabel.Text = "Reincarnations: " .. data.Reincarnations
	MultiplierLabel.Text = "Multiplier: x" .. data.Multiplier
	CurrencyLabel.Text = "Reincarnation Currency: " .. data.ReincarnationCurrency
	
	-- Update reincarnate button state
	if data.HasReincarnationTrack then
		ReincarnateButton.Text = "ALREADY REINCARNATED"
		ReincarnateButton.BackgroundColor3 = Color3.fromRGB(50, 150, 50)
		ReincarnateLockedLabel.Text = "Track unlocked!"
		ReincarnateLockedLabel.TextColor3 = Color3.fromRGB(100, 255, 100)
	end
	
	-- Populate item grids
	self:PopulateGrid(AurasGrid, data.UnlockedAuras, "Aura")
	self:PopulateGrid(PosesGrid, data.UnlockedPoses, "Pose")
	self:PopulateGrid(PetsGrid, data.UnlockedPets, "Pet")
end

function ReincarnationUI:PopulateGrid(gridFrame, items, itemType)
	-- Clear existing
	for _, child in ipairs(gridFrame:GetChildren()) do
		if child:IsA("Frame") then
			child:Destroy()
		end
	end
	
	local count = 0
	for itemName, unlocked in pairs(items) do
		if unlocked then
			local itemFrame = CreateFrame({
				Name = itemName,
				Size = UDim2.new(0, 120, 0, 140),
				BackgroundColor3 = Color3.fromRGB(30, 30, 50),
				Parent = gridFrame,
			})
			CreateUICorner(8).Parent = itemFrame
			
			local itemLabel = CreateTextLabel({
				Name = "Label",
				Size = UDim2.new(1, -10, 0, 40),
				Position = UDim2.new(0, 5, 0, 5),
				BackgroundTransparency = 1,
				Text = itemName,
				TextColor3 = Color3.fromRGB(255, 255, 255),
				TextScaled = true,
				Font = Enum.Font.Gotham,
				Parent = itemFrame,
			})
			
			local equipBtn = CreateTextButton({
				Name = "EquipBtn",
				Size = UDim2.new(0.8, 0, 0, 30),
				Position = UDim2.new(0.1, 0, 0, 100),
				BackgroundColor3 = Color3.fromRGB(0, 150, 255),
				Text = "EQUIP",
				TextColor3 = Color3.fromRGB(255, 255, 255),
				TextScaled = true,
				Font = Enum.Font.GothamBold,
				Parent = itemFrame,
			})
			CreateUICorner(6).Parent = equipBtn
			
			count = count + 1
		end
	end
	
	if count == 0 then
		local emptyLabel = CreateTextLabel({
			Name = "EmptyLabel",
			Size = UDim2.new(1, 0, 0, 50),
			Position = UDim2.new(0, 0, 0, 50),
			BackgroundTransparency = 1,
			Text = "No " .. itemType .. "s unlocked yet!",
			TextColor3 = Color3.fromRGB(150, 150, 150),
			TextScaled = true,
			Font = Enum.Font.Gotham,
			Parent = gridFrame,
		})
	end
end

--// EVENTS
ReincarnateButton.MouseButton1Click:Connect(function()
	-- Get current stats from local player (you'll need to pass these from your game)
	local currentStats = {
		Power = 999999999999, -- Replace with actual power reading
		Currency = 1000000, -- Replace with actual currency
	}
	
	ReincarnateRemote:FireServer(currentStats)
end)

InitDataRemote.OnClientEvent:Connect(function(data)
	ReincarnationUI:UpdateUI(data)
end)

-- Request data on load
local initialData = RequestReincarnationData:InvokeServer()
if initialData then
	ReincarnationUI:UpdateUI(initialData)
end

-- Notification handler
NotificationRemote.OnClientEvent:Connect(function(notification)
	-- Create notification popup
	local notifFrame = CreateFrame({
		Name = "Notification",
		Size = UDim2.new(0, 300, 0, 80),
		Position = UDim2.new(0.5, -150, 0, -100),
		BackgroundColor3 = Color3.fromRGB(20, 20, 35),
		BorderSizePixel = 0,
		Parent = ReincarnationGui,
	})
	CreateUICorner(10).Parent = notifFrame
	CreateUIStroke(Color3.fromRGB(0, 150, 255), 2).Parent = notifFrame
	
	local title = CreateTextLabel({
		Name = "Title",
		Size = UDim2.new(1, -20, 0, 25),
		Position = UDim2.new(0, 10, 0, 10),
		BackgroundTransparency = 1,
		Text = notification.Title or "Notification",
		TextColor3 = Color3.fromRGB(0, 200, 255),
		TextScaled = true,
		Font = Enum.Font.GothamBold,
		Parent = notifFrame,
	})
	
	local text = CreateTextLabel({
		Name = "Text",
		Size = UDim2.new(1, -20, 0, 35),
		Position = UDim2.new(0, 10, 0, 35),
		BackgroundTransparency = 1,
		Text = notification.Text or "",
		TextColor3 = Color3.fromRGB(255, 255, 255),
		TextScaled = true,
		Font = Enum.Font.Gotham,
		Parent = notifFrame,
	})
	
	-- Animate in
	notifFrame.Position = UDim2.new(0.5, -150, 0, -100)
	TweenService:Create(notifFrame, TweenInfo.new(0.5, Enum.EasingStyle.Bounce), {
		Position = UDim2.new(0.5, -150, 0, 50)
	}):Play()
	
	-- Animate out after duration
	wait(notification.Duration or 5)
	TweenService:Create(notifFrame, TweenInfo.new(0.5, Enum.EasingStyle.Quad), {
		Position = UDim2.new(0.5, -150, 0, -100)
	}):Play()
	wait(0.5)
	notifFrame:Destroy()
end)

print("[ReincarnationUI] Initialized successfully")

return ReincarnationUI
