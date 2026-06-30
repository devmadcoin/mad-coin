# Solana Tokenomics & Pump.fun Mechanics — Study Notes

**Date:** 2026-06-26
**Status:** Complete

## How Pump.fun Bonding Curves Work

### The Mechanics
1. **No-code launch** — Anyone can create a token with name, symbol, image. No coding required.
2. **Bonding curve pricing** — Price starts low and rises as more tokens are bought. Mathematical relationship between supply and price.
3. **1B supply, 6 decimals** — Standard SPL token format. Indistinguishable from any direct-launch token at the mint level.
4. **No pre-sale, no team allocation** — Fair launch model. Creator CAN buy at start (5-30% of supply is common risk factor).

### Graduation Threshold
- **~85 SOL** accumulated in bonding curve = graduation trigger
- **Market cap** crosses approximately $69,000-$100,000
- **Automatic migration** to PumpSwap (since March 20, 2025)
- **LP tokens burned** — liquidity permanently locked. Creator cannot rug the pool.

### Post-Graduation
- Trading moves from bonding curve to **PumpSwap AMM** (constant-product, x×y=k)
- Program address: `pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA`
- Before March 2025, graduated to Raydium. Now PumpSwap is default.
- "Graduation pump" often occurs as migration triggers attention.
- "Post-graduation dump" as early buyers exit.

### Critical Statistics
- **11.9M+ total launches** on Pump.fun
- **< 2% graduation rate** (most recent data: ~1.4% historical)
- **$800M+ platform revenue**
- **42,000 tokens launched in a single day** (peak)

## What This Means for $MAD

$MAD already graduated. It's in the <2% club. That's a credibility signal most tokens can't claim.

### Implications:
1. **LP is burned** — The liquidity pool is permanent. No rug pull possible on the pool itself.
2. **PumpSwap routing** — $MAD trades through PumpSwap's AMM, not bonding curve. Standard two-sided market dynamics.
3. **Survivor bias** — Most tokens that launch die. $MAD survived. That puts it in a different category.
4. **Creator holdings** — The risk factor is NOT the LP (burned). The risk is creator wallet holdings. If dev holds 20%+ and dumps, price collapses. (User is doxxed, which mitigates this.)

## Reading On-Chain Data

### APIs / Tools
- **Helius** — Solana RPC with enriched APIs
- **Jupiter** — Swap aggregation, price APIs
- **DexScreener** — Best for live price/volume/LP data (what we use)
- **PumpSwap program** — `pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA`
- **Pump.fun program** — `6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P`

### Key Metrics to Track
- Holder count and distribution
- Daily volume vs market cap
- Top wallet concentrations
- LP depth (though burned, depth matters for slippage)

## MEV & Bot Landscape

- **Sandwich bots** front-run retail trades
- **Sniping bots** buy within milliseconds of launch
- **Jito bundles** — anti-MEV routing
- **Anti-MEV RPCs** help but don't eliminate disadvantage
- Most retail adaptation: enter after first 5-10 minutes, accept higher slippage, focus on organic community traction

## $MAD-Specific Intelligence

- **Contract:** `Fa7ZE9nCEYnrHsnoeHuhEExJpchtrBtKXnWe6CgHpump`
- **Pair:** `Gt3dWHHKRd2mNQmmCHPzdeTpG4tTAa23exN1m2vwinfs`
- **Platform:** PumpSwap (graduated)
- **Launch date:** Feb 4, 2026
- **Age:** ~142 days (as of June 26, 2026)
- **Status:** Survivor (<2% club)

## Knowledge Drops (Telegram/X Content)

**Drop 1 — The 2% Club**
> "11.9 million tokens launched on Pump.fun. Fewer than 2% ever graduate. $MAD is in that 2%. The LP is burned. The dev is doxxed. The game is live. Most tokens die in days. $MAD is building in months."

**Drop 2 — Bonding Curve Survivor**
> "The bonding curve is a filter. It separates the noise from the signal. 98% of tokens never make it past $69K market cap. $MAD did. Then kept building. That's not luck. That's conviction."

**Drop 3 — LP Burned**
> "LP tokens = burned. Permanently. What does that mean? The liquidity pool is locked forever. No rug. No exit scam. The dev can't drain it even if they wanted to. $MAD plays different."
