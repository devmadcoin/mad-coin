# TOOLS.md - Local Notes

Skills define _how_ tools work. This file is for _your_ specifics — the stuff that's unique to your setup.

## What Goes Here

Things like:

- Camera names and locations
- SSH hosts and aliases
- Preferred voices for TTS
- Speaker/room names
- Device nicknames
- Anything environment-specific

## Examples

```markdown
### Cameras

- living-room → Main area, 180° wide angle
- front-door → Entrance, motion-triggered

### SSH

- home-server → 192.168.1.100, user: admin

### TTS

- Preferred voice: "Nova" (warm, slightly British)
- Default speaker: Kitchen HomePod
```

## Why Separate?

Skills are shared. Your setup is yours. Keeping them apart means you can update skills without losing your notes, and share skills without leaking your infrastructure.

---

## $MAD Data Sources

### Primary: DexScreener
- **URL:** https://dexscreener.com/solana/Gt3dWHHKRd2mNQmmCHPzdeTpG4tTAa23exN1m2vwinfs
- **Chain:** Solana
- **Pair:** `Gt3dWHHKRd2mNQmmCHPzdeTpG4tTAa23exN1m2vwinfs`
- **Token:** `Fa7ZE9nCEYnrHsnoeHuhEExJpchtrBtKXnWe6CgHpump`
- **Best for:** Live price, volume, transactions, liquidity, chart
- **User preference:** "this place is def the best place to check"

### API Endpoints (for programmatic access)
- Pair data: `https://api.dexscreener.com/latest/dex/pairs/solana/Gt3dWHHKRd2mNQmmCHPzdeTpG4tTAa23exN1m2vwinfs`
- Token pairs: `https://api.dexscreener.com/token-pairs/v1/solana/Fa7ZE9nCEYnrHsnoeHuhEExJpchtrBtKXnWe6CgHpump`
- **Note:** Direct page fetch returns 403, use API endpoints

### $MAD Reference Data
- **Launch date:** Feb 4, 2026
- **Age check:** Current date - Feb 4 = days since launch
- **Platform:** PumpSwap (Solana)
- **Contract:** `Fa7ZE9nCEYnrHsnoeHuhEExJpchtrBtKXnWe6CgHpump`
- **Website:** https://mad-coin.vercel.app
- **X:** @madrichclub_
- **Game:** Mad Phonk Awakening on Roblox

