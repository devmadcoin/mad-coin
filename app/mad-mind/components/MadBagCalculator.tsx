"use client";

import { useState, useEffect, useCallback } from "react";

/* ─── Constants ─── */
const SUPPLY = 490820000; // 490.82M tokens
const DEXSCREENER_API = "https://api.dexscreener.com/latest/dex/pairs/solana/Gt3dWHHKRd2mNQmmCHPzdeTpG4tTAa23exN1m2vwinfs";

interface TokenData {
  priceUsd: number;
  marketCap: number;
  volume24h: number;
  priceChange24h: number;
}

/* ─── Milestone Data ─── */
const MILESTONES = [
  { label: "$1M", mcap: 1000000, emoji: "🎯" },
  { label: "$5M", mcap: 5000000, emoji: "📈" },
  { label: "$10M", mcap: 10000000, emoji: "🚀" },
  { label: "$25M", mcap: 25000000, emoji: "💎" },
  { label: "$50M", mcap: 50000000, emoji: "🔥" },
  { label: "$100M", mcap: 100000000, emoji: "👑" },
];

/* ─── Format helpers ─── */
function formatUSD(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(2)}K`;
  return `$${n.toFixed(2)}`;
}

function formatTokens(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

/* ─── THE CALCULATOR ─── */
export default function MadBagCalculator() {
  const [tokenAmount, setTokenAmount] = useState<string>("1000000");
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const [loading, setLoading] = useState(true);
  const [customMcap, setCustomMcap] = useState<string>("");

  /* Fetch live data from DexScreener */
  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(DEXSCREENER_API, { cache: "no-store" });
      const data = await res.json();
      const pair = data.pairs?.[0];
      if (pair) {
        setTokenData({
          priceUsd: parseFloat(pair.priceUsd),
          marketCap: pair.marketCap || parseFloat(pair.priceUsd) * SUPPLY,
          volume24h: parseFloat(pair.volume?.h24 || 0),
          priceChange24h: parseFloat(pair.priceChange?.h24 || 0),
        });
      }
    } catch (err) {
      console.error("DexScreener fetch failed:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, [fetchData]);

  const amount = parseFloat(tokenAmount) || 0;
  const currentPrice = tokenData?.priceUsd || 0;
  const currentMcap = tokenData?.marketCap || 0;
  const currentValue = amount * currentPrice;

  /* Calculate bag value at any market cap */
  const valueAtMcap = (mcap: number) => {
    const priceAtMcap = mcap / SUPPLY;
    return amount * priceAtMcap;
  };

  /* Progress to milestone */
  const progressToMilestone = (mcap: number) => {
    if (currentMcap <= 0) return 0;
    return Math.min(100, (currentMcap / mcap) * 100);
  };

  /* How many X to reach milestone */
  const multiplierToMilestone = (mcap: number) => {
    if (currentMcap <= 0) return 0;
    return mcap / currentMcap;
  };

  return (
    <section className="px-2 sm:px-0 mb-3">
      {/* Section header */}
      <div className="flex items-center gap-2 mb-3">
        <div className="h-px flex-1 bg-[#1a1a1a]/[0.06]" />
        <span className="text-[8px] font-black uppercase tracking-[0.3em] text-[#FF6B00]/50">
          BAG CALCULATOR
        </span>
        <div className="h-px flex-1 bg-[#1a1a1a]/[0.10]" />
      </div>

      <div className="border border-[#1a1a1a]/[0.10] bg-[#1a1a1a]/[0.02] p-4 sm:p-5">
        {/* Live Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">
          <StatBox
            label="Price"
            value={loading ? "—" : currentPrice > 0 ? `$${currentPrice.toFixed(8)}` : "—"}
            change={tokenData?.priceChange24h}
          />
          <StatBox
            label="Market Cap"
            value={loading ? "—" : currentMcap > 0 ? formatUSD(currentMcap) : "—"}
          />
          <StatBox
            label="Supply"
            value={formatTokens(SUPPLY)}
          />
          <StatBox
            label="24h Volume"
            value={loading ? "—" : tokenData?.volume24h ? formatUSD(tokenData.volume24h) : "—"}
          />
        </div>

        {/* Input Section */}
        <div className="mb-5">
          <label className="text-[8px] font-black uppercase tracking-[0.3em] text-[#1a1a1a]/40 mb-2 block">
            YOUR $MAD BAG
          </label>
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <input
                type="number"
                value={tokenAmount}
                onChange={(e) => setTokenAmount(e.target.value)}
                className="w-full bg-transparent border border-[#1a1a1a]/15 px-4 py-3 text-lg font-mono font-bold text-[#1a1a1a] placeholder:text-[#1a1a1a]/20 focus:border-[#FF2D2D]/40 focus:outline-none transition-colors"
                placeholder="1000000"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-[#1a1a1a]/30">
                $MAD
              </span>
            </div>
            {/* Quick buttons */}
            <div className="flex gap-1">
              {["1M", "5M", "10M", "100M"].map((label) => (
                <button
                  key={label}
                  onClick={() => {
                    const multiplier = label === "1M" ? 1_000_000 : label === "5M" ? 5_000_000 : label === "10M" ? 10_000_000 : 100_000_000;
                    setTokenAmount(multiplier.toString());
                  }}
                  className="px-2 py-1 text-[9px] font-bold border border-[#1a1a1a]/10 hover:border-[#FF2D2D]/30 hover:bg-[#FF2D2D]/[0.04] transition-all text-[#1a1a1a]/50"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <p className="text-[9px] text-[#1a1a1a]/30 mt-1.5">
            Current value: <span className="font-bold text-[#FF2D2D]">{currentValue > 0 ? formatUSD(currentValue) : "—"}</span>
          </p>
        </div>

        {/* Milestones Grid */}
        <div className="mb-5">
          <label className="text-[8px] font-black uppercase tracking-[0.3em] text-[#1a1a1a]/40 mb-3 block">
            MILESTONE SIMULATOR
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {MILESTONES.map((m) => {
              const value = valueAtMcap(m.mcap);
              const progress = progressToMilestone(m.mcap);
              const mult = multiplierToMilestone(m.mcap);
              const isReached = currentMcap >= m.mcap;

              return (
                <div
                  key={m.label}
                  className={`relative border p-3 transition-all ${
                    isReached
                      ? "border-[#FF2D2D]/40 bg-[#FF2D2D]/[0.06]"
                      : "border-[#1a1a1a]/10 bg-[#1a1a1a]/[0.02]"
                  }`}
                >
                  {/* Progress bar background */}
                  <div
                    className="absolute bottom-0 left-0 h-0.5 bg-[#FF2D2D]/30 transition-all duration-1000"
                    style={{ width: `${progress}%` }}
                  />

                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-[#1a1a1a]/60">{m.label} MCAP</span>
                    <span className="text-xs">{m.emoji}</span>
                  </div>

                  <p className="text-lg font-black text-[#1a1a1a] leading-tight">
                    {formatUSD(value)}
                  </p>

                  <p className="text-[8px] text-[#1a1a1a]/30 mt-1">
                    {isReached
                      ? "✓ REACHED"
                      : mult > 0
                      ? `${mult.toFixed(1)}x from now`
                      : "—"
                    }
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Custom Target */}
        <div className="mb-4">
          <label className="text-[8px] font-black uppercase tracking-[0.3em] text-[#1a1a1a]/40 mb-2 block">
            CUSTOM TARGET
          </label>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-[#1a1a1a]/40">$</span>
            <input
              type="number"
              value={customMcap}
              onChange={(e) => setCustomMcap(e.target.value)}
              className="flex-1 bg-transparent border border-[#1a1a1a]/15 px-3 py-2 text-sm font-mono font-bold text-[#1a1a1a] placeholder:text-[#1a1a1a]/20 focus:border-[#FF2D2D]/40 focus:outline-none transition-colors"
              placeholder="Enter market cap..."
            />
            <span className="text-[10px] font-bold text-[#1a1a1a]/30">MCAP</span>
          </div>
          {customMcap && parseFloat(customMcap) > 0 && (
            <p className="text-sm font-black text-[#FF2D2D] mt-2">
              Your bag at ${(parseFloat(customMcap) / 1_000_000).toFixed(1)}M MCAP: {formatUSD(valueAtMcap(parseFloat(customMcap)))}
            </p>
          )}
        </div>

        {/* Bottom note */}
        <div className="pt-3 border-t border-[#1a1a1a]/[0.06]">
          <p className="text-[8px] text-[#1a1a1a]/30 text-center uppercase tracking-wider">
            Supply: {formatTokens(SUPPLY)} tokens • Data updates every 30s from DexScreener
          </p>
        </div>
      </div>
    </section>
  );
}

/* ─── Stat Box Component ─── */
function StatBox({ label, value, change }: { label: string; value: string; change?: number }) {
  return (
    <div className="border border-[#1a1a1a]/[0.08] bg-[#1a1a1a]/[0.02] p-2.5">
      <p className="text-[7px] font-black uppercase tracking-[0.3em] text-[#1a1a1a]/30 mb-1">
        {label}
      </p>
      <p className="text-sm font-mono font-bold text-[#1a1a1a] leading-tight">
        {value}
      </p>
      {change !== undefined && (
        <p className={`text-[8px] font-bold mt-0.5 ${change >= 0 ? "text-green-600" : "text-red-600"}`}>
          {change >= 0 ? "+" : ""}{change.toFixed(2)}%
        </p>
      )}
    </div>
  );
}
