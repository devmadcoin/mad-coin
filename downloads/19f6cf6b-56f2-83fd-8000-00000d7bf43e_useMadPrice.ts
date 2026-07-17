import { useEffect, useRef, useState } from "react";
import { CA } from "@/lib/data";

export type MadPrice = {
  price: number | null;
  change24h: number | null;
  mcap: number | null;
  volume24h: number | null;
  liquidity: number | null;
  direction: "up" | "down" | null;
  loading: boolean;
};

const FALLBACK: MadPrice = {
  price: 0.004597,
  change24h: -8.92,
  mcap: 2250000,
  volume24h: 14400,
  liquidity: 167400,
  direction: null,
  loading: true,
};

export function useMadPrice(intervalMs = 15000): MadPrice {
  const [data, setData] = useState<MadPrice>(FALLBACK);
  const prevPrice = useRef<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${CA}`);
        const json = await res.json();
        const pair = json?.pairs?.[0];
        if (!pair || cancelled) return;
        const price = parseFloat(pair.priceUsd ?? "0");
        const direction =
          prevPrice.current == null || price === prevPrice.current
            ? null
            : price > prevPrice.current
              ? "up"
              : "down";
        prevPrice.current = price;
        setData({
          price,
          change24h: pair.priceChange?.h24 ?? null,
          mcap: pair.marketCap ?? pair.fdv ?? null,
          volume24h: pair.volume?.h24 ?? null,
          liquidity: pair.liquidity?.usd ?? null,
          direction,
          loading: false,
        });
      } catch {
        if (!cancelled) setData((d) => ({ ...d, loading: false }));
      }
    }

    load();
    const t = setInterval(load, intervalMs);
    return () => {
      cancelled = true;
      clearInterval(t);
    };
  }, [intervalMs]);

  return data;
}

export function fmtUsd(n: number | null, digits = 2): string {
  if (n == null) return "—";
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toFixed(digits)}`;
}

export function fmtPrice(n: number | null): string {
  if (n == null) return "—";
  return `$${n.toFixed(6)}`;
}
