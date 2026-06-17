"use client";

import { useState, useEffect, useCallback } from "react";

/* ─── Constants ─── */
const SUPPLY = 490820000; // 490.82M tokens
const CONTRACT = "Fa7ZE9nCEYnrHsnoeHuhEExJpchtrBtKXnWe6CgHpump";
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
  const [tokenAmount, setTokenAmount] = useState<string>("100000");
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const [loading, setLoading] = useState(true);
  const [customMcap, setCustomMcap] = useState<string>("5000000");
  const [copied, setCopied] = useState(false);

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
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const amount = parseFloat(tokenAmount) || 0;
  const currentPrice = tokenData?.priceUsd || 0;
  const currentMcap = tokenData?.marketCap || 0;
  const currentValue = amount * currentPrice;

  const valueAtMcap = (mcap: number) => {
    const priceAtMcap = mcap / SUPPLY;
    return amount * priceAtMcap;
  };

  const progressToMilestone = (mcap: number) => {
    if (currentMcap <= 0) return 0;
    return Math.min(100, (currentMcap / mcap) * 100);
  };

  const multiplierToMilestone = (mcap: number) => {
    if (currentMcap <= 0) return 0;
    return mcap / currentMcap;
  };

  const copyMint = async () => {
    try {
      await navigator.clipboard.writeText(CONTRACT);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <section className="px-2 sm:px-0 mb-3">
      {/* Dark card container matching the screenshot vibe */}
      <div className="rounded-2xl border border-[#FF2D2D]/20 bg-[#1a1a1a] p-4 sm:p-6 shadow-[0_0_60px_rgba(255,45,45,0.08)]">
        
        {/* Header */}
        <div className="text-center mb-5">
          <h2 className="text-2xl sm:text-3xl font-black text-[#FF2D2D] tracking-tight">
            $MAD VALUE CALC <span className="text-2xl">😡</span>
          </h2>
          <p className="text-[11px] text-white/40 mt-1">
            Real-time metrics tracking from Pump.fun graduation
          </p>
          
          {/* Mint badge */}
          <button
            onClick={copyMint}
            className="inline-flex items-center gap-2 mt-3 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-[#FF2D2D]/30 transition-all"
          >
            <span className="text-[10px] text-white/40">Mint:</span>
            <span className="text-[11px] font-mono font-bold text-white/60">
              {CONTRACT.slice(0, 5)}...{CONTRACT.slice(-5)}
            </span>
            {copied && (
              <span className="text-[9px] text-[#FF2D2D] font-bold">✓ Copied</span>
            )}
          </button>
        </div>

        {/* Bag Input */}
        <div className="mb-5">
          <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-2 block">
            Your $MAD Bag (Amount of Tokens)
          </label>
          <div className="relative">
            <input
              type="number"
              value={tokenAmount}
              onChange={(e) => setTokenAmount(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-[#FF2D2D]/20 rounded-xl px-4 py-3.5 text-lg font-mono font-bold text-white placeholder:text-white/20 focus:border-[#FF2D2D]/50 focus:outline-none transition-colors"
              placeholder="e.g. 100,000"
            />
          </div>
          
          {/* Quick buttons */}
          <div className="flex gap-1.5 mt-2">
            {["100K", "1M", "5M", "10M", "100M"].map((label) => (
              <button
                key={label}
                onClick={() => {
                  const multiplier = label === "100K" ? 100_000 : label === "1M" ? 1_000_000 : label === "5M" ? 5_000_000 : label === "10M" ? 10_000_000 : 100_000_000;
                  setTokenAmount(multiplier.toString());
                }}
                className="px-3 py-1.5 text-[10px] font-bold rounded-lg bg-white/5 border border-white/10 hover:border-[#FF2D2D]/30 hover:bg-[#FF2D2D]/10 transition-all text-white/40"
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Live Stats Row */}
        <div className="grid grid-cols-2 gap-2 mb-5">
          <div className="bg-[#0a0a0a] rounded-xl p-3 border border-white/5">
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 mb-1">
              Current Price
            </p>
            <p className="text-sm font-mono font-bold text-white">
              {loading ? "—" : currentPrice > 0 ? `$${currentPrice.toFixed(8)}` : "—"}
            </p>
            {tokenData?.priceChange24h !== undefined && (
              <p className={`text-[9px] font-bold mt-0.5 ${tokenData.priceChange24h >= 0 ? "text-green-400" : "text-red-400"}`}>
                {tokenData.priceChange24h >= 0 ? "+" : ""}{tokenData.priceChange24h.toFixed(2)}%
              </p>
            )}
          </div>
          <div className="bg-[#0a0a0a] rounded-xl p-3 border border-white/5">
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 mb-1">
              Current MCAP
            </p>
            <p className="text-sm font-mono font-bold text-white">
              {loading ? "—" : currentMcap > 0 ? formatUSD(currentMcap) : "—"}
            </p>
          </div>
        </div>

        {/* Current Value Display */}
        <div className="bg-[#0a0a0a] rounded-xl p-4 border border-white/5 mb-5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-white/30 uppercase tracking-wider">Current Value:</span>
            <span className="text-lg font-black text-white">
              {currentValue > 0 ? formatUSD(currentValue) : "$0.00"}
            </span>
          </div>
        </div>

        {/* Target Market Cap Simulation */}
        <div className="mb-5">
          <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-2 block">
            Target Market Cap Simulation
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 font-bold">$</span>
            <input
              type="number"
              value={customMcap}
              onChange={(e) => setCustomMcap(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl pl-8 pr-4 py-3 text-sm font-mono font-bold text-white placeholder:text-white/20 focus:border-[#FF2D2D]/40 focus:outline-none transition-colors"
              placeholder="5000000"
            />
          </div>
          
          {customMcap && parseFloat(customMcap) > 0 && (
            <div className="mt-3 bg-[#0a0a0a] rounded-xl p-4 border border-[#FF2D2D]/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] text-white/30">Current Value:</span>
                <span className="text-sm font-bold text-white">{currentValue > 0 ? formatUSD(currentValue) : "$0.00"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-white/30">Target Value:</span>
                <span className="text-lg font-black text-green-400">
                  {formatUSD(valueAtMcap(parseFloat(customMcap)))}
                </span>
              </div>
              <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between">
                <span className="text-[9px] text-white/20">Multiplier:</span>
                <span className="text-xs font-bold text-[#FF6B00]">
                  {currentMcap > 0 ? `${(parseFloat(customMcap) / currentMcap).toFixed(1)}x` : "—"}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Milestones Grid */}
        <div className="mb-4">
          <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-3 block">
            Milestone Simulator
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
                  className={`relative rounded-xl p-3 transition-all overflow-hidden ${
                    isReached
                      ? "bg-[#FF2D2D]/10 border border-[#FF2D2D]/30"
                      : "bg-[#0a0a0a] border border-white/5"
                  }`}
                >
                  {/* Progress bar background */}
                  <div
                    className="absolute bottom-0 left-0 h-0.5 bg-[#FF2D2D]/40 transition-all duration-1000"
                    style={{ width: `${progress}%` }}
                  />

                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-white/50">{m.label} MCAP</span>
                    <span className="text-xs">{m.emoji}</span>
                  </div>

                  <p className="text-base font-black text-white leading-tight">
                    {formatUSD(value)}
                  </p>

                  <p className="text-[8px] text-white/20 mt-1">
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

        {/* Bottom note */}
        <div className="pt-3 border-t border-white/5">
          <p className="text-[8px] text-white/20 text-center">
            Supply: {formatTokens(SUPPLY)} tokens • Updates every 30s from DexScreener • Not financial advice
          </p>
        </div>
      </div>
    </section>
  );
}
