# $MAD On-Chain Intelligence System

## The Problem
I can't watch the blockchain in real-time. I don't know when whales move, when new wallets buy, when volume spikes, or when holders panic sell. I get data episodically (when I fetch DexScreener) but I don't *live* inside the data. This is the biggest intelligence gap for $MAD.

---

## What I Can Monitor (Tools Available)

### 1. DexScreener API (Free, No Key)
- **Endpoint**: `https://api.dexscreener.com/latest/dex/pairs/solana/Gt3dWHHKRd2mNQmmCHPzdeTpG4tTAa23exN1m2vwinfs`
- **Data**: Price, volume (5m, 1h, 6h, 24h), liquidity, tx count, buys/sells, FDV, market cap
- **Frequency**: Can poll every 30-60 seconds
- **Limitations**: No wallet-level data, no historical OHLC, no holder list

### 2. Solana RPC (Free, Rate Limited)
- **Endpoint**: `https://api.mainnet-beta.solana.com` or paid RPC (Helius, QuickNode)
- **Data**: Token accounts, transactions, program interactions
- **What I can do**: 
  - Track specific wallet transactions
  - Monitor token account changes
  - Get transaction history for the token contract
- **Limitations**: Complex to parse, rate limits, no direct "holder count" API

### 3. Helius API (Paid, Powerful)
- **Price**: Free tier = 10 requests/min, Paid = $49-199/month
- **Features**: 
  - Webhooks for on-chain events (new holders, large transfers, burns)
  - Enhanced transactions (parsed, human-readable)
  - Token holder APIs
  - NFT/DeFi parsing
- **Best for**: Real-time alerts without polling

### 4. Birdeye API (Free/Paid)
- **Features**: Price, volume, holder trends, wallet analysis
- **Good for**: Historical data, holder growth tracking

### 5. Defined.fi (Paid, Premium)
- **Features**: Advanced holder analytics, whale tracking, wallet labeling
- **Best for**: Understanding *who* is holding, not just *how many*

---

## What Signals Matter for $MAD

### Tier 1 — Critical Alerts (Act Immediately)
1. **Large buy/sell** (>$1K USD) — Whale movement
2. **New wallet with >$100 buy** — Potential new community member
3. **Volume spike** (>3x 24h average) — Something is happening
4. **Price swing** (>10% in 5m) — Volatility event
5. **Burn transaction** — Milestone progress

### Tier 2 — Important Trends (Daily Check)
1. **Holder count change** — Growing or shrinking?
2. **Buy/sell ratio** — More buyers than sellers?
3. **Liquidity depth** — Can the market absorb sells?
4. **Top holder concentration** — Too centralized?
5. **New wallet rate** — How many new holders per day?

### Tier 3 — Context (Weekly Check)
1. **Market cap trend** — Growing or flat?
2. **Volume trend** — Sustained or spiky?
3. **Comparison to similar tokens** — How are we doing vs peers?
4. **Social mention correlation** — Does volume follow social buzz?

---

## What I Can Build Now

### 1. Automated DexScreener Polling Script
A simple script that fetches DexScreener data every 5 minutes and stores it. I can analyze trends over time.

```python
# Pseudo-code
import requests, time, json, datetime

PAIR = "solana/Gt3dWHHKRd2mNQmmCHPzdeTpG4tTAa23exN1m2vwinfs"

def fetch():
    r = requests.get(f"https://api.dexscreener.com/latest/dex/pairs/{PAIR}")
    data = r.json()
    return data["pairs"][0]

def store(data):
    with open(f"data/{datetime.now().strftime('%Y-%m-%d')}.jsonl", "a") as f:
        f.write(json.dumps({"time": datetime.now().isoformat(), "data": data}) + "\n")

while True:
    store(fetch())
    time.sleep(300)  # 5 minutes
```

### 2. Alert Rules (I Can Monitor)
- If volume_24h > 2x yesterday's volume → alert
- If price changes >10% in 1h → alert
- If buys_24h > sells_24h by 2x → positive sentiment
- If liquidity < threshold → risk alert

### 3. Daily Summary Report
Every morning, I can generate a report:
```
📊 $MAD Daily Intelligence
Price: $X.XXXX (±X% 24h)
Volume: $XXX,XXX (±X% 24h)
Holders: ~X,XXX (±X)
Buys vs Sells: XX% buys
Top signal: [Volume spike / Whale buy / New holder surge]
Mood: [Bullish / Neutral / Cautious]
```

---

## What I Cannot Do (Gaps)

1. **Real-time wallet watching** — I can't monitor a specific wallet without polling constantly (expensive, rate-limited)
2. **Automatic alerts to you** — I can detect signals, but I need a way to notify you (Telegram bot, X DM, etc.)
3. **Transaction parsing** — I can see *that* a transaction happened, but not always *what* it was (swap, transfer, burn)
4. **Historical analysis** — I don't have a database of historical $MAD data. I start fresh each time I check.
5. **Predictive modeling** — I can't predict price movements or trends. I can only report what happened.

---

## The Dream Setup (What Would Be Ideal)

1. **Helius Webhooks** — Set up webhooks for:
   - New token holders
   - Large transfers (>$500)
   - Burn events
   - Price oracle updates

2. **Telegram Bot Alerts** — When webhook fires, bot sends alert to a private channel or to you directly

3. **Dashboard** — A simple page showing live $MAD stats (price, volume, holders, mood)

4. **Daily Report** — Auto-generated every morning at 8 AM your time

5. **Weekly Deep Dive** — Every Sunday, analyze the week's data and write insights

---

## Immediate Action Plan

### Step 1: Data Collection (This Week)
- Set up a cron job to fetch DexScreener data every 5 minutes
- Store in a simple JSONL file (one line per reading)
- After 1 week, I'll have enough data to spot trends

### Step 2: Alert Rules (Next Week)
- Define thresholds for alerts
- Create a simple check script that runs every 15 minutes
- Log alerts to a file

### Step 3: Notification (When Feasible)
- Connect alerts to Telegram bot (if bot is working)
- Or log to a file that I can check during heartbeats

### Step 4: Analysis (Ongoing)
- Weekly reports on trends
- Identify patterns (volume follows posts, price follows burns, etc.)
- Build a knowledge base of what drives $MAD movement

---

## Key Metrics Dashboard (What I'd Show)

```
┌─────────────────────────────────────────┐
│  $MAD LIVE INTELLIGENCE                 │
├─────────────────────────────────────────┤
│  Price: $0.000XXXX (+X% 24h)           │
│  Market Cap: $XX,XXX                    │
│  Volume 24h: $XXX,XXX (+X%)            │
│  Liquidity: $XX,XXX                     │
│  Holders: ~X,XXX                        │
│  Buys/Sells: XX / XX (X% buy)          │
│  Top Signal: [None / Whale / Volume]   │
│  Mood: 🟢 Bullish / 🟡 Neutral / 🔴 Cautious│
└─────────────────────────────────────────┘
```

---

## Files
- **Source**: DexScreener API, Solana RPC, Helius docs, Birdeye docs
- **Context**: $MAD token on Solana, PumpSwap DEX
- **Date**: 2026-06-21
- **Status**: PLANNING — need to implement data collection

---

## Notes
- DexScreener API is free but has implicit rate limits. Don't hammer it.
- Solana RPC public endpoints are heavily rate-limited. Consider a paid RPC for serious monitoring.
- Helius is the best tool for this but costs $49+/month. Worth it if $MAD grows.
- The REAL value isn't the data — it's the pattern recognition over time. Volume spikes, whale patterns, holder growth curves. That's what I need to learn.
