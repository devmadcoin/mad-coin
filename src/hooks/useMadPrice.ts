import { useEffect, useRef, useState } from "react";

export function useMadPrice() {
  const [price, setPrice] = useState<number | null>(null);
  const [mcap, setMcap] = useState<number | null>(null);
  const [volume24h, setVolume24h] = useState<number | null>(null);
  const [liquidity, setLiquidity] = useState<number | null>(null);
  const [change24h, setChange24h] = useState<number | null>(null);
  const [direction, setDirection] = useState<"up" | "down" | null>(null);
  const [loading, setLoading] = useState(true);
  const prev = useRef<number | null>(null);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const res = await fetch(
          "https://api.dexscreener.com/latest/dex/pairs/solana/gt3dwhhkrd2mnqmmchpzdetpg4ttaa23exn1m2vwinfs"
        );
        const data = await res.json();
        const pair = data.pairs?.[0];
        if (pair) {
          const newPrice = parseFloat(pair.priceUsd);
          setPrice(newPrice);
          setMcap(parseFloat(pair.fdv));
          setVolume24h(parseFloat(pair.volume.h24));
          setLiquidity(parseFloat(pair.liquidity.usd));
          setChange24h(parseFloat(pair.priceChange.h24));
          if (prev.current != null) {
            setDirection(newPrice > prev.current ? "up" : newPrice < prev.current ? "down" : null);
          }
          prev.current = newPrice;
        }
      } catch (e) {
        console.error("Price fetch failed", e);
      } finally {
        setLoading(false);
      }
    };

    fetchPrice();
    const interval = setInterval(fetchPrice, 15000);
    return () => clearInterval(interval);
  }, []);

  return { price, mcap, volume24h, liquidity, change24h, direction, loading };
}

export function fmtPrice(n: number | null) {
  if (n == null) return "—";
  if (n >= 1) return `$${n.toFixed(4)}`;
  if (n >= 0.01) return `$${n.toFixed(6)}`;
  return `$${n.toFixed(10)}`;
}

export function fmtUsd(n: number | null) {
  if (n == null) return "—";
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(2)}B`;
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(2)}K`;
  return `$${n.toFixed(2)}`;
}
