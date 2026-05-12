#!/usr/bin/env python3
"""
MAD Paper Trading Lab
Fake money. Real decisions. Learn without bleeding.

Usage:
    python3 paper_trading.py --status              # View portfolio
    python3 paper_trading.py --analyze             # Get buy/sell recommendations
    python3 paper_trading.py --buy MAD 100         # Buy 100 worth of MAD
    python3 paper_trading.py --sell MAD 50        # Sell 50 worth of MAD
    python3 paper_trading.py --history             # View trade history
    python3 paper_trading.py --log                 # View decision log
"""

import sqlite3
import json
import time
import argparse
import os
from datetime import datetime
from pathlib import Path

# --- CONFIG ---
DB_PATH = "/root/.openclaw/workspace/paper_trades.db"
STARTING_BALANCE = 10000.0  # USD
MAX_POSITION_PCT = 0.20     # Max 20% in any single coin
STOP_LOSS_PCT = 0.10        # 10% stop loss
TAKE_PROFIT_PCT = 0.25      # 25% take profit

# Tracked assets
ASSETS = {
    "MAD": {
        "name": "MAD",
        "type": "memecoin",
        "chain": "solana",
        "contract": "Fa7ZE9nCEYnrHsnoeHuhEExJpchtrBtKXnWe6CgHpump",
        "risk": "high",
        "thesis": "Community-driven memecoin with real products (Roblox games, merch). Brand expansion thesis.",
    },
    "BTC": {
        "name": "Bitcoin",
        "type": "largecap",
        "risk": "low",
        "thesis": "Digital gold. Portfolio anchor. Hold forever.",
    },
    "ETH": {
        "name": "Ethereum",
        "type": "largecap",
        "risk": "medium",
        "thesis": "Smart contract platform. DeFi backbone.",
    },
    "SOL": {
        "name": "Solana",
        "type": "midcap",
        "risk": "medium-high",
        "thesis": "High-speed L1. MAD lives here. Ecosystem growth.",
    },
}

# --- DATABASE SETUP ---
def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS portfolio (
            id INTEGER PRIMARY KEY,
            cash REAL DEFAULT 10000.0,
            total_deposited REAL DEFAULT 10000.0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS positions (
            symbol TEXT PRIMARY KEY,
            quantity REAL DEFAULT 0.0,
            avg_entry_price REAL DEFAULT 0.0,
            total_invested REAL DEFAULT 0.0,
            stop_loss REAL,
            take_profit REAL,
            opened_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS trades (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            symbol TEXT,
            action TEXT,  -- BUY or SELL
            quantity REAL,
            price REAL,
            total_value REAL,
            pnl REAL DEFAULT 0.0,
            reasoning TEXT,
            approved_by TEXT DEFAULT 'AI'
        )
    """)
    
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS decisions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            symbol TEXT,
            recommendation TEXT,  -- STRONG_BUY, BUY, HOLD, SELL, WAIT
            confidence REAL,
            current_price REAL,
            price_change_7d REAL,
            reasoning TEXT,
            user_override TEXT  -- If user changes the recommendation
        )
    """)
    
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS price_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            symbol TEXT,
            price REAL,
            market_cap REAL,
            volume_24h REAL,
            change_24h REAL
        )
    """)
    
    # Initialize portfolio if empty
    cursor.execute("SELECT COUNT(*) FROM portfolio")
    if cursor.fetchone()[0] == 0:
        cursor.execute(
            "INSERT INTO portfolio (cash, total_deposited) VALUES (?, ?)",
            (STARTING_BALANCE, STARTING_BALANCE)
        )
    
    conn.commit()
    conn.close()

# --- PRICE FETCHING ---
def fetch_price_coingecko(symbol):
    """Fetch price from CoinGecko. Returns price in USD or None."""
    # Map symbols to CoinGecko IDs
    id_map = {
        "BTC": "bitcoin",
        "ETH": "ethereum",
        "SOL": "solana",
        "MAD": None,  # MAD not on CoinGecko yet, would need DexScreener
    }
    
    cg_id = id_map.get(symbol)
    if not cg_id:
        # For MAD, we'd need to use DexScreener or Raydium API
        return None
    
    try:
        import urllib.request
        url = f"https://api.coingecko.com/api/v3/simple/price?ids={cg_id}&vs_currencies=usd&include_24h_change=true&include_market_cap=true&include_24h_vol=true"
        req = urllib.request.Request(url, headers={"Accept": "application/json"})
        with urllib.request.urlopen(req, timeout=10) as response:
            data = json.loads(response.read())
            coin_data = data.get(cg_id, {})
            return {
                "price": coin_data.get("usd", 0),
                "change_24h": coin_data.get("usd_24h_change", 0),
                "market_cap": coin_data.get("usd_market_cap", 0),
                "volume_24h": coin_data.get("usd_24h_vol", 0),
            }
    except Exception as e:
        print(f"⚠️  Price fetch failed for {symbol}: {e}")
        return None

def get_current_price(symbol):
    """Get current price, checking cache first."""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Check recent cache (within 5 minutes)
    cursor.execute("""
        SELECT price, market_cap, volume_24h, change_24h 
        FROM price_history 
        WHERE symbol = ? AND timestamp > datetime('now', '-5 minutes')
        ORDER BY timestamp DESC LIMIT 1
    """, (symbol,))
    
    cached = cursor.fetchone()
    if cached:
        conn.close()
        return {"price": cached[0], "market_cap": cached[1], "volume_24h": cached[2], "change_24h": cached[3]}
    
    # Fetch fresh
    data = fetch_price_coingecko(symbol)
    if data and data["price"] > 0:
        cursor.execute("""
            INSERT INTO price_history (symbol, price, market_cap, volume_24h, change_24h)
            VALUES (?, ?, ?, ?, ?)
        """, (symbol, data["price"], data.get("market_cap", 0), data.get("volume_24h", 0), data.get("change_24h", 0)))
        conn.commit()
        conn.close()
        return data
    
    conn.close()
    return None

def get_price_history(symbol, days=7):
    """Get price history for trend analysis."""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        SELECT price, timestamp FROM price_history 
        WHERE symbol = ? AND timestamp > datetime('now', '-{} days')
        ORDER BY timestamp ASC
    """.format(days), (symbol,))
    
    history = cursor.fetchall()
    conn.close()
    return [h[0] for h in history]  # Just prices

# --- PORTFOLIO OPERATIONS ---
def get_portfolio():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute("SELECT cash, total_deposited FROM portfolio LIMIT 1")
    portfolio = cursor.fetchone()
    
    cursor.execute("SELECT symbol, quantity, avg_entry_price, total_invested FROM positions")
    positions = cursor.fetchall()
    
    conn.close()
    
    return {
        "cash": portfolio[0] if portfolio else STARTING_BALANCE,
        "total_deposited": portfolio[1] if portfolio else STARTING_BALANCE,
        "positions": {
            p[0]: {
                "quantity": p[1],
                "avg_entry": p[2],
                "invested": p[3],
            } for p in positions
        }
    }

def get_total_value():
    portfolio = get_portfolio()
    total = portfolio["cash"]
    
    for symbol, pos in portfolio["positions"].items():
        price_data = get_current_price(symbol)
        if price_data:
            total += pos["quantity"] * price_data["price"]
        else:
            total += pos["invested"]  # Fallback to invested amount
    
    return total

def buy(symbol, dollar_amount, reasoning="", approved_by="AI"):
    """Execute a paper buy."""
    portfolio = get_portfolio()
    
    if dollar_amount > portfolio["cash"]:
        return False, f"❌ Insufficient cash. Have: ${portfolio['cash']:.2f}, Need: ${dollar_amount:.2f}"
    
    price_data = get_current_price(symbol)
    if not price_data or price_data["price"] <= 0:
        return False, f"❌ Cannot fetch price for {symbol}"
    
    price = price_data["price"]
    quantity = dollar_amount / price
    
    # Check max position size
    total_value = get_total_value()
    current_position_value = portfolio["positions"].get(symbol, {}).get("quantity", 0) * price
    new_position_value = current_position_value + dollar_amount
    
    if new_position_value / total_value > MAX_POSITION_PCT:
        return False, f"❌ Position would exceed {MAX_POSITION_PCT*100}% max. Current: ${current_position_value:.2f}, Would be: ${new_position_value:.2f}"
    
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Update cash
    cursor.execute("UPDATE portfolio SET cash = cash - ?", (dollar_amount,))
    
    # Update position
    cursor.execute("""
        INSERT INTO positions (symbol, quantity, avg_entry_price, total_invested, stop_loss, take_profit)
        VALUES (?, ?, ?, ?, ?, ?)
        ON CONFLICT(symbol) DO UPDATE SET
            quantity = quantity + ?,
            avg_entry_price = ((avg_entry_price * (total_invested / NULLIF(avg_entry_price, 0))) + ?) / (quantity + ?),
            total_invested = total_invested + ?,
            stop_loss = MIN(stop_loss, ?),
            take_profit = MAX(take_profit, ?)
    """, (
        symbol, quantity, price, dollar_amount,
        price * (1 - STOP_LOSS_PCT), price * (1 + TAKE_PROFIT_PCT),
        quantity, dollar_amount, quantity, dollar_amount,
        price * (1 - STOP_LOSS_PCT), price * (1 + TAKE_PROFIT_PCT)
    ))
    
    # Log trade
    cursor.execute("""
        INSERT INTO trades (symbol, action, quantity, price, total_value, reasoning, approved_by)
        VALUES (?, 'BUY', ?, ?, ?, ?, ?)
    """, (symbol, quantity, price, dollar_amount, reasoning, approved_by))
    
    conn.commit()
    conn.close()
    
    return True, f"✅ Paper BUY: {quantity:.6f} {symbol} @ ${price:.6f} = ${dollar_amount:.2f}"

def sell(symbol, dollar_amount=None, quantity=None, reasoning="", approved_by="AI"):
    """Execute a paper sell. Either dollar_amount or quantity must be specified."""
    portfolio = get_portfolio()
    
    if symbol not in portfolio["positions"]:
        return False, f"❌ No position in {symbol}"
    
    pos = portfolio["positions"][symbol]
    price_data = get_current_price(symbol)
    
    if not price_data or price_data["price"] <= 0:
        return False, f"❌ Cannot fetch price for {symbol}"
    
    price = price_data["price"]
    
    # Determine quantity to sell
    if dollar_amount:
        quantity_to_sell = dollar_amount / price
    elif quantity:
        quantity_to_sell = quantity
        dollar_amount = quantity * price
    else:
        # Sell entire position
        quantity_to_sell = pos["quantity"]
        dollar_amount = quantity_to_sell * price
    
    if quantity_to_sell > pos["quantity"]:
        return False, f"❌ Only have {pos['quantity']:.6f} {symbol}, trying to sell {quantity_to_sell:.6f}"
    
    # Calculate P&L
    cost_basis = quantity_to_sell * pos["avg_entry"]
    pnl = dollar_amount - cost_basis
    pnl_pct = (pnl / cost_basis * 100) if cost_basis > 0 else 0
    
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Update cash
    cursor.execute("UPDATE portfolio SET cash = cash + ?", (dollar_amount,))
    
    # Update position
    new_quantity = pos["quantity"] - quantity_to_sell
    new_invested = pos["invested"] - cost_basis
    
    if new_quantity <= 0:
        cursor.execute("DELETE FROM positions WHERE symbol = ?", (symbol,))
    else:
        cursor.execute("""
            UPDATE positions SET quantity = ?, total_invested = ?
            WHERE symbol = ?
        """, (new_quantity, new_invested, symbol))
    
    # Log trade
    cursor.execute("""
        INSERT INTO trades (symbol, action, quantity, price, total_value, pnl, reasoning, approved_by)
        VALUES (?, 'SELL', ?, ?, ?, ?, ?, ?)
    """, (symbol, quantity_to_sell, price, dollar_amount, pnl, reasoning, approved_by))
    
    conn.commit()
    conn.close()
    
    emoji = "🟢" if pnl >= 0 else "🔴"
    return True, f"{emoji} Paper SELL: {quantity_to_sell:.6f} {symbol} @ ${price:.6f} = ${dollar_amount:.2f} | P&L: ${pnl:.2f} ({pnl_pct:+.2f}%)"

# --- ANALYSIS & RECOMMENDATIONS ---
def analyze_opportunity(symbol):
    """Analyze a trading opportunity and return a recommendation."""
    asset = ASSETS.get(symbol)
    if not asset:
        return None
    
    price_data = get_current_price(symbol)
    if not price_data:
        return {
            "symbol": symbol,
            "name": asset["name"],
            "current_price": 0,
            "recommendation": "UNKNOWN",
            "confidence": 0,
            "reasoning": ["Cannot fetch price data — coin may not be on CoinGecko yet"],
            "risk_level": asset["risk"],
            "thesis": asset["thesis"],
            "position_pct": 0,
        }
    
    current_price = price_data["price"]
    history = get_price_history(symbol, 7)
    
    reasoning = []
    recommendation = "HOLD"
    confidence = 0.5
    
    # Trend analysis
    if len(history) >= 2:
        week_ago = history[0] if len(history) >= 7 else history[0]
        change = (current_price - week_ago) / week_ago if week_ago > 0 else 0
        
        if change < -0.20:
            recommendation = "STRONG_BUY"
            confidence = 0.70
            reasoning.append(f"📉 Down {change*100:.1f}% — deep dip opportunity")
        elif change < -0.10:
            recommendation = "BUY"
            confidence = 0.60
            reasoning.append(f"📉 Down {change*100:.1f}% — moderate dip")
        elif change > 0.30:
            recommendation = "WAIT"
            confidence = 0.65
            reasoning.append(f"📈 Up {change*100:.1f}% — extended, wait for pullback")
        elif change > 0.15:
            recommendation = "HOLD"
            confidence = 0.55
            reasoning.append(f"📊 Up {change*100:.1f}% — momentum but extended")
        else:
            reasoning.append(f"📊 Sideways ({change*100:+.1f}%) — no clear signal")
    
    # 24h change
    if price_data.get("change_24h"):
        change_24h = price_data["change_24h"]
        if change_24h < -10:
            reasoning.append(f"⏰ 24h down {change_24h:.1f}% — short-term panic?")
        elif change_24h > 10:
            reasoning.append(f"⏰ 24h up {change_24h:.1f}% — FOMO check")
    
    # Asset-specific logic
    if symbol == "MAD":
        reasoning.append("🎯 MAD Thesis: Community + products (Roblox games)")
        reasoning.append("⚠️  Memecoin volatility — high risk/reward")
    elif symbol == "BTC":
        reasoning.append("🏦 Portfolio anchor — 25x = freedom rule")
    
    # Risk check
    portfolio = get_portfolio()
    total_value = get_total_value()
    position_value = portfolio["positions"].get(symbol, {}).get("quantity", 0) * current_price
    position_pct = position_value / total_value if total_value > 0 else 0
    
    if position_pct >= MAX_POSITION_PCT:
        reasoning.append(f"⚠️  Already at max position size ({position_pct*100:.1f}%)")
        recommendation = "HOLD"
        confidence = 0.80
    
    # Log the decision
    log_decision(symbol, recommendation, confidence, current_price, change if 'change' in dir() else 0, reasoning)
    
    return {
        "symbol": symbol,
        "name": asset["name"],
        "current_price": current_price,
        "recommendation": recommendation,
        "confidence": confidence,
        "reasoning": reasoning,
        "risk_level": asset["risk"],
        "thesis": asset["thesis"],
        "position_pct": position_pct,
    }

def log_decision(symbol, recommendation, confidence, price, price_change_7d, reasoning):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO decisions (symbol, recommendation, confidence, current_price, price_change_7d, reasoning)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (symbol, recommendation, confidence, price, price_change_7d, " | ".join(reasoning)))
    conn.commit()
    conn.close()

def analyze_all():
    """Analyze all tracked assets."""
    print("=" * 60)
    print("📊 MAD PAPER TRADING LAB — MARKET ANALYSIS")
    print("=" * 60)
    print(f"Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print()
    
    for symbol in ASSETS:
        analysis = analyze_opportunity(symbol)
        if not analysis:
            continue
        
        print(f"{'='*60}")
        print(f"🪙 {analysis['name']} ({symbol})")
        print(f"   Price: {analysis['current_price']:,.6f}")
        print(f"   Signal: {analysis['recommendation']} (confidence: {analysis['confidence']*100:.0f}%)")
        print(f"   Risk: {analysis['risk_level'].upper()}")
        print(f"   Position: {analysis['position_pct']*100:.1f}% of portfolio")
        print()
        print(f"   Thesis: {analysis['thesis']}")
        print()
        for r in analysis['reasoning']:
            print(f"   • {r}")
        print()
    
    print("=" * 60)
    print("💡 Next step: Run with --buy SYMBOL AMOUNT or --sell SYMBOL AMOUNT")
    print("   Example: python3 paper_trading.py --buy BTC 500")
    print("=" * 60)

def show_portfolio():
    """Display current portfolio."""
    portfolio = get_portfolio()
    total_value = get_total_value()
    
    print("=" * 60)
    print("💼 MAD PAPER TRADING LAB — PORTFOLIO")
    print("=" * 60)
    print(f"Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print()
    print(f"💵 Cash: ${portfolio['cash']:,.2f}")
    print(f"📈 Total Value: ${total_value:,.2f}")
    print(f"📊 Return: ${total_value - STARTING_BALANCE:,.2f} ({((total_value - STARTING_BALANCE)/STARTING_BALANCE)*100:+.2f}%)")
    print()
    
    if portfolio["positions"]:
        print("📋 Positions:")
        print(f"{'Symbol':<8} {'Qty':<14} {'Entry':<12} {'Current':<12} {'Value':<12} {'P&L':<12}")
        print("-" * 72)
        
        for symbol, pos in portfolio["positions"].items():
            price_data = get_current_price(symbol)
            current_price = price_data["price"] if price_data else pos["avg_entry"]
            current_value = pos["quantity"] * current_price
            pnl = current_value - pos["invested"]
            pnl_pct = (pnl / pos["invested"] * 100) if pos["invested"] > 0 else 0
            
            emoji = "🟢" if pnl >= 0 else "🔴"
            print(f"{symbol:<8} {pos['quantity']:<14.6f} ${pos['avg_entry']:<12.6f} ${current_price:<12.6f} ${current_value:<12.2f} {emoji} ${pnl:.2f} ({pnl_pct:+.1f}%)")
    else:
        print("📭 No open positions — all cash")
    
    print()
    print("=" * 60)

def show_history():
    """Display trade history."""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        SELECT timestamp, symbol, action, quantity, price, total_value, pnl, reasoning
        FROM trades ORDER BY timestamp DESC LIMIT 20
    """)
    trades = cursor.fetchall()
    conn.close()
    
    print("=" * 60)
    print("📜 TRADE HISTORY (Last 20)")
    print("=" * 60)
    
    if not trades:
        print("No trades yet.")
        return
    
    print(f"{'Time':<20} {'Action':<6} {'Symbol':<8} {'Qty':<12} {'Price':<12} {'Total':<10} {'P&L':<12}")
    print("-" * 90)
    
    for t in trades:
        ts, sym, action, qty, price, total, pnl, reason = t
        emoji = "🟢" if (pnl or 0) >= 0 else "🔴"
        print(f"{ts:<20} {action:<6} {sym:<8} {qty:<12.6f} ${price:<12.6f} ${total:<10.2f} {emoji} ${pnl:.2f}")

def show_decisions():
    """Display decision log."""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        SELECT timestamp, symbol, recommendation, confidence, current_price, reasoning, user_override
        FROM decisions ORDER BY timestamp DESC LIMIT 30
    """)
    decisions = cursor.fetchall()
    conn.close()
    
    print("=" * 60)
    print("🧠 DECISION LOG (Last 30)")
    print("=" * 60)
    
    if not decisions:
        print("No decisions logged yet. Run --analyze first.")
        return
    
    for d in decisions:
        ts, sym, rec, conf, price, reason, override = d
        print(f"\n[{ts}] {sym} — {rec} ({conf*100:.0f}% confidence) @ ${price:.6f}")
        for line in reason.split(" | "):
            print(f"  • {line}")
        if override:
            print(f"  👤 USER OVERRIDE: {override}")

# --- MAIN ---
def main():
    parser = argparse.ArgumentParser(description="MAD Paper Trading Lab")
    parser.add_argument("--status", action="store_true", help="Show portfolio")
    parser.add_argument("--analyze", action="store_true", help="Analyze opportunities")
    parser.add_argument("--buy", nargs=2, metavar=("SYMBOL", "AMOUNT"), help="Buy SYMBOL with AMOUNT")
    parser.add_argument("--sell", nargs=2, metavar=("SYMBOL", "AMOUNT"), help="Sell AMOUNT of SYMBOL")
    parser.add_argument("--history", action="store_true", help="Show trade history")
    parser.add_argument("--log", action="store_true", help="Show decision log")
    parser.add_argument("--reason", default="", help="Reason for trade (optional)")
    parser.add_argument("--user", default="User", help="Who approved the trade")
    
    args = parser.parse_args()
    
    # Initialize DB
    init_db()
    
    if args.status:
        show_portfolio()
    elif args.analyze:
        analyze_all()
    elif args.buy:
        symbol, amount = args.buy[0].upper(), float(args.buy[1])
        success, msg = buy(symbol, amount, args.reason, args.user)
        print(msg)
        if success:
            show_portfolio()
    elif args.sell:
        symbol, amount = args.sell[0].upper(), float(args.sell[1])
        success, msg = sell(symbol, dollar_amount=amount, reasoning=args.reason, approved_by=args.user)
        print(msg)
        if success:
            show_portfolio()
    elif args.history:
        show_history()
    elif args.log:
        show_decisions()
    else:
        show_portfolio()
        print()
        print("Usage:")
        print("  --status          Show portfolio")
        print("  --analyze         Get buy/sell recommendations")
        print("  --buy SYM AMT     Buy AMOUNT of SYMBOL")
        print("  --sell SYM AMT    Sell AMOUNT of SYMBOL")
        print("  --history         View trade history")
        print("  --log             View decision log")

if __name__ == "__main__":
    main()
