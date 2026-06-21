#!/usr/bin/env python3
"""MAD Token Daily Report — Run each morning to generate summary."""
import json, os, datetime, sys, glob

DATA_DIR = os.path.dirname(os.path.abspath(__file__))

def load_today_data():
    date_str = datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%d")
    path = os.path.join(DATA_DIR, f"{date_str}.jsonl")
    if not os.path.exists(path):
        return []
    with open(path) as f:
        return [json.loads(line) for line in f if line.strip()]

def load_yesterday_data():
    yesterday = datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(days=1)
    date_str = yesterday.strftime("%Y-%m-%d")
    path = os.path.join(DATA_DIR, f"{date_str}.jsonl")
    if not os.path.exists(path):
        return []
    with open(path) as f:
        return [json.loads(line) for line in f if line.strip()]

def fmt_currency(val):
    if val is None:
        return "N/A"
    val = float(val)
    if val >= 1000000:
        return f"${val/1000000:.2f}M"
    elif val >= 1000:
        return f"${val/1000:.1f}K"
    return f"${val:.4f}"

def main():
    today = load_today_data()
    yesterday = load_yesterday_data()
    
    if not today:
        print("No data for today yet. Run fetch.py first.", file=sys.stderr)
        sys.exit(1)
    
    latest = today[-1]
    
    # Get earliest reading of today for comparison
    earliest = today[0] if today else latest
    
    # Get last reading of yesterday for 24h comparison
    yesterdays_last = yesterday[-1] if yesterday else None
    
    price_now = float(latest.get("priceUsd", 0) or 0)
    price_open = float(earliest.get("priceUsd", 0) or 0)
    price_yesterday = float(yesterdays_last.get("priceUsd", 0) or 0) if yesterdays_last else None
    
    vol_24h = latest.get("volume_24h", 0) or 0
    mcap = latest.get("marketCap", 0) or 0
    liq = latest.get("liquidity_usd", 0) or 0
    buys = latest.get("buyTxns_24h", 0) or 0
    sells = latest.get("sellTxns_24h", 0) or 0
    buy_ratio = buys / (sells + buys) * 100 if (buys + sells) > 0 else 0
    
    day_change = ((price_now - price_open) / price_open * 100) if price_open else 0
    day_24h = latest.get("priceChange_24h", 0) or 0
    
    # Mood
    if day_change > 5 or buy_ratio > 70:
        mood = "Bullish"
        emoji = "🟢"
    elif day_change < -10 or buy_ratio < 40:
        mood = "Cautious"
        emoji = "🔴"
    else:
        mood = "Neutral"
        emoji = "🟡"
    
    # Signal
    signal = "None"
    if vol_24h > 50000:
        signal = "High Volume"
    elif buys > 1000:
        signal = "High Buy Activity"
    elif day_change > 10:
        signal = "Price Surge"
    elif day_change < -15:
        signal = "Price Drop"
    
    print(f"""
📊 MAD DAILY INTELLIGENCE — {datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%d')}

Price:        {fmt_currency(price_now)} ({day_change:+.2f}% today, {day_24h:+.2f}% 24h)
Market Cap:   {fmt_currency(mcap)}
Volume 24h:   {fmt_currency(vol_24h)}
Liquidity:    {fmt_currency(liq)}
Buys/Sells:   {buys} / {sells} ({buy_ratio:.1f}% buy ratio)
Top Signal:   {signal}
Mood:         {emoji} {mood}

Data Points:  {len(today)} readings today
""")

if __name__ == "__main__":
    main()
