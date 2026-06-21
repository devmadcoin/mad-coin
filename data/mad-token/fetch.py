#!/usr/bin/env python3
"""MAD Token Data Fetch — Single snapshot. Call this to get current data."""
import requests, json, os, datetime, sys

PAIR = "solana/Gt3dWHHKRd2mNQmmCHPzdeTpG4tTAa23exN1m2vwinfs"
DATA_DIR = os.path.dirname(os.path.abspath(__file__))

def fetch():
    try:
        r = requests.get(f"https://api.dexscreener.com/latest/dex/pairs/{PAIR}", timeout=15)
        r.raise_for_status()
        data = r.json()
        if not data.get("pairs"):
            return None
        pair = data["pairs"][0]
        return {
            "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat(),
            "priceUsd": pair.get("priceUsd"),
            "priceNative": pair.get("priceNative"),
            "volume_24h": pair.get("volume", {}).get("h24"),
            "volume_6h": pair.get("volume", {}).get("h6"),
            "volume_1h": pair.get("volume", {}).get("h1"),
            "volume_5m": pair.get("volume", {}).get("m5"),
            "liquidity_usd": pair.get("liquidity", {}).get("usd"),
            "liquidity_base": pair.get("liquidity", {}).get("base"),
            "liquidity_quote": pair.get("liquidity", {}).get("quote"),
            "fdv": pair.get("fdv"),
            "marketCap": pair.get("marketCap"),
            "buyTxns_24h": pair.get("txns", {}).get("h24", {}).get("buys"),
            "sellTxns_24h": pair.get("txns", {}).get("h24", {}).get("sells"),
            "buyTxns_1h": pair.get("txns", {}).get("h1", {}).get("buys"),
            "sellTxns_1h": pair.get("txns", {}).get("h1", {}).get("sells"),
            "priceChange_24h": pair.get("priceChange", {}).get("h24"),
            "priceChange_1h": pair.get("priceChange", {}).get("h1"),
            "priceChange_5m": pair.get("priceChange", {}).get("m5"),
        }
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        return None

def store(record):
    if not record:
        return
    date_str = datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%d")
    path = os.path.join(DATA_DIR, f"{date_str}.jsonl")
    with open(path, "a") as f:
        f.write(json.dumps(record) + "\n")
    print(f"[{record['timestamp']}] Price: ${record['priceUsd']} | Vol24h: ${record['volume_24h']} | MCap: ${record['marketCap']}")

def main():
    record = fetch()
    store(record)
    if record:
        print(json.dumps(record, indent=2))
    else:
        print("Failed to fetch data", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
