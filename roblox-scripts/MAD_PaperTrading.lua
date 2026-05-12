--// MAD_PaperTrading.lua
--// Paper Trading System for $MAD and Crypto Portfolio
--// Fake money. Real decisions. Learning without bleeding.

local PaperTrading = {}

-- ============================================
-- PORTFOLIO CONFIG
-- ============================================
PaperTrading.Config = {
    StartingBalance = 10000,  -- USD
    MaxPositionSize = 0.20,   -- Max 20% in any single coin
    StopLossPercent = 0.10,   -- 10% stop loss
    TakeProfitPercent = 0.25, -- 25% take profit
    RebalanceInterval = 86400, -- Check daily (in seconds)
}

-- ============================================
-- TRACKED ASSETS
-- ============================================
PaperTrading.Assets = {
    {
        Symbol = "MAD",
        Name = "$MAD",
        Type = "memecoin",
        Chain = "solana",
        Contract = "Fa7ZE9nCEYnrHsnoeHuhEExJpchtrBtKXnWe6CgHpump",
        RiskLevel = "high",
        Thesis = "Community-driven memecoin with real products (Roblox games, merch). Growth thesis: brand expansion.",
    },
    {
        Symbol = "BTC",
        Name = "Bitcoin",
        Type = "largecap",
        Chain = "bitcoin",
        RiskLevel = "low",
        Thesis = "Digital gold. Portfolio anchor. 25x rule: hold forever.",
    },
    {
        Symbol = "ETH",
        Name = "Ethereum",
        Type = "largecap",
        Chain = "ethereum",
        RiskLevel = "medium",
        Thesis = "Smart contract platform. DeFi backbone. Long-term infrastructure play.",
    },
    {
        Symbol = "SOL",
        Name = "Solana",
        Type = "midcap",
        Chain = "solana",
        RiskLevel = "medium-high",
        Thesis = "High-speed L1. $MAD lives here. Ecosystem growth momentum.",
    },
}

-- ============================================
-- PORTFOLIO STATE
-- ============================================
PaperTrading.Portfolio = {
    Cash = 10000,
    Positions = {}, -- Symbol -> {EntryPrice, Quantity, EntryDate, StopLoss, TakeProfit}
    TradeHistory = {},
    ValueHistory = {}, -- Date -> TotalValue
}

-- ============================================
-- TRADING LOGIC
-- ============================================

function PaperTrading:EvaluateBuyOpportunity(symbol, currentPrice, priceHistory)
    local asset = self:GetAsset(symbol)
    if not asset then return nil end
    
    local analysis = {
        Symbol = symbol,
        CurrentPrice = currentPrice,
        Recommendation = "HOLD",
        Confidence = 0,
        Reasoning = {},
        RiskLevel = asset.RiskLevel,
    }
    
    -- Check if we already have max position
    local existingPosition = self.Portfolio.Positions[symbol]
    if existingPosition then
        local positionValue = existingPosition.Quantity * currentPrice
        local portfolioValue = self:GetTotalValue()
        if positionValue / portfolioValue >= self.Config.MaxPositionSize then
            table.insert(analysis.Reasoning, "Position already at max size (" .. (self.Config.MaxPositionSize * 100) .. "%)")
            return analysis
        end
    end
    
    -- Simple momentum check (would be more sophisticated in real implementation)
    if #priceHistory >= 7 then
        local weekAgo = priceHistory[#priceHistory - 6]
        local change = (currentPrice - weekAgo) / weekAgo
        
        if change < -0.15 then
            analysis.Recommendation = "STRONG_BUY"
            analysis.Confidence = 0.75
            table.insert(analysis.Reasoning, "Down " .. math.round(change * 100) .. "% in 7 days — potential dip buy")
        elseif change < -0.05 then
            analysis.Recommendation = "BUY"
            analysis.Confidence = 0.60
            table.insert(analysis.Reasoning, "Down " .. math.round(change * 100) .. "% — mild dip")
        elseif change > 0.20 then
            analysis.Recommendation = "WAIT"
            analysis.Confidence = 0.70
            table.insert(analysis.Reasoning, "Up " .. math.round(change * 100) .. "% — FOMO zone, wait for pullback")
        end
    end
    
    -- $MAD specific logic
    if symbol == "MAD" then
        table.insert(analysis.Reasoning, "$MAD Thesis: Community growth + product expansion (Roblox, future games)")
        table.insert(analysis.Reasoning, "Risk: High volatility typical of memecoins")
    end
    
    return analysis
end

function PaperTrading:ExecutePaperTrade(symbol, action, quantity, price, reasoning)
    local trade = {
        Date = os.time(),
        Symbol = symbol,
        Action = action, -- "BUY" or "SELL"
        Quantity = quantity,
        Price = price,
        Total = quantity * price,
        Reasoning = reasoning,
        PnL = 0,
    }
    
    if action == "BUY" then
        if self.Portfolio.Cash >= trade.Total then
            self.Portfolio.Cash = self.Portfolio.Cash - trade.Total
            
            if self.Portfolio.Positions[symbol] then
                -- Average down
                local pos = self.Portfolio.Positions[symbol]
                local totalQty = pos.Quantity + quantity
                pos.EntryPrice = (pos.EntryPrice * pos.Quantity + price * quantity) / totalQty
                pos.Quantity = totalQty
            else
                self.Portfolio.Positions[symbol] = {
                    EntryPrice = price,
                    Quantity = quantity,
                    EntryDate = os.time(),
                    StopLoss = price * (1 - self.Config.StopLossPercent),
                    TakeProfit = price * (1 + self.Config.TakeProfitPercent),
                }
            end
            
            table.insert(self.Portfolio.TradeHistory, trade)
            return true, "Paper buy executed: " .. quantity .. " " .. symbol .. " @ $" .. price
        else
            return false, "Insufficient cash: $" .. self.Portfolio.Cash .. " < $" .. trade.Total
        end
        
    elseif action == "SELL" then
        local pos = self.Portfolio.Positions[symbol]
        if pos and pos.Quantity >= quantity then
            trade.PnL = (price - pos.EntryPrice) * quantity
            self.Portfolio.Cash = self.Portfolio.Cash + trade.Total
            
            pos.Quantity = pos.Quantity - quantity
            if pos.Quantity <= 0 then
                self.Portfolio.Positions[symbol] = nil
            end
            
            table.insert(self.Portfolio.TradeHistory, trade)
            return true, "Paper sell executed: " .. quantity .. " " .. symbol .. " @ $" .. price .. " (P&L: $" .. trade.PnL .. ")"
        else
            return false, "No position or insufficient quantity"
        end
    end
    
    return false, "Unknown action"
end

function PaperTrading:GetAsset(symbol)
    for _, asset in ipairs(self.Assets) do
        if asset.Symbol == symbol then
            return asset
        end
    end
    return nil
end

function PaperTrading:GetTotalValue()
    local total = self.Portfolio.Cash
    -- Note: In real implementation, would fetch current prices
    -- For now, returns cash + position book values
    for symbol, pos in pairs(self.Portfolio.Positions) do
        total = total + (pos.Quantity * pos.EntryPrice)
    end
    return total
end

function PaperTrading:GetPerformance()
    local current = self:GetTotalValue()
    local starting = self.Config.StartingBalance
    return {
        TotalValue = current,
        StartingValue = starting,
        AbsoluteReturn = current - starting,
        PercentReturn = ((current - starting) / starting) * 100,
        TradeCount = #self.Portfolio.TradeHistory,
    }
end

-- ============================================
-- DECISION LOG (For Learning)
-- ============================================
function PaperTrading:LogDecision(decision)
    -- This would write to a persistent log
    -- Format: Timestamp | Symbol | Recommendation | Confidence | ActualOutcome | Lesson
    print(string.format("[DECISION] %s | %s | %s | %.0f%% | %s",
        os.date("%Y-%m-%d %H:%M"),
        decision.Symbol,
        decision.Recommendation,
        decision.Confidence * 100,
        table.concat(decision.Reasoning, "; ")
    ))
end

return PaperTrading
