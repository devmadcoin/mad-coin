"use client";

import { useState, useEffect } from "react";

const TOKEN_API = "https://api.dexscreener.com/latest/dex/pairs/solana/Gt3dWHHKRd2mNQmmCHPzdeTpG4tTAa23exN1m2vwinfs";
const CA = "Fa7ZE9nCEYnrHsnoeHuhEExJpchtrBtKXnWe6CgHpump";

interface TokenData {
  priceUsd: string;
  priceChange: { h24: string };
  fdv: string;
  volume: { h24: string };
  liquidity: { usd: string };
}

/* ─── LIVE COMMAND CENTER ─── */
export default function MadCommandCenter() {
  const [data, setData] = useState<TokenData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(TOKEN_API);
        const json = await res.json();
        if (json.pairs && json.pairs[0]) {
          const pair = json.pairs[0];
          setData({
            priceUsd: pair.priceUsd,
            priceChange: { h24: pair.priceChange?.h24 || "0" },
            fdv: pair.fdv || pair.marketCap || "0",
            volume: { h24: pair.volume?.h24 || "0" },
            liquidity: { usd: pair.liquidity?.usd || "0" },
          });
          setLastUpdate(new Date());
        }
      } catch (e) {
        console.error("Failed to fetch token data", e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatNum = (n: string | number, prefix = "") => {
    const num = parseFloat(String(n));
    if (num >= 1e6) return `${prefix}${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `${prefix}${(num / 1e3).toFixed(1)}K`;
    return `${prefix}${num.toFixed(4)}`;
  };

  const isPositive = data ? parseFloat(data.priceChange.h24) >= 0 : true;

  return (
    <section className="relative px-4 sm:px-6 py-12 sm:py-16 bg-[#0a0a0a] border-y border-[#FF2D2D]/10 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,45,45,0.06),transparent_70%)]" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.34em] text-[#FF2D2D]/60 mb-1">
              Live Feed
            </p>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              $MAD <span className="text-[#FF2D2D]">Command Center</span>
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-white/40">
              {lastUpdate ? `Updated ${lastUpdate.toLocaleTimeString()}` : "Connecting..."}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* ─── STATS COLUMN ─── */}
          <div className="lg:col-span-1 space-y-3">
            {/* Price Card */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-white/40 mb-1">Price</p>
              {loading ? (
                <div className="h-8 w-32 bg-white/10 rounded animate-pulse" />
              ) : (
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-black text-white">
                    ${data ? parseFloat(data.priceUsd).toFixed(6) : "0.000000"}
                  </span>
                  <span className={`text-sm font-bold ${isPositive ? "text-green-400" : "text-red-400"}`}>
                    {isPositive ? "+" : ""}{data ? parseFloat(data.priceChange.h24).toFixed(2) : "0"}%
                  </span>
                </div>
              )}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-[9px] font-bold uppercase tracking-wider text-white/40 mb-1">Market Cap</p>
                {loading ? (
                  <div className="h-5 w-16 bg-white/10 rounded animate-pulse" />
                ) : (
                  <p className="text-lg font-black text-white">{formatNum(data?.fdv || "0", "$")}</p>
                )}
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-[9px] font-bold uppercase tracking-wider text-white/40 mb-1">24h Volume</p>
                {loading ? (
                  <div className="h-5 w-16 bg-white/10 rounded animate-pulse" />
                ) : (
                  <p className="text-lg font-black text-white">{formatNum(data?.volume.h24 || "0", "$")}</p>
                )}
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-[9px] font-bold uppercase tracking-wider text-white/40 mb-1">Liquidity</p>
                {loading ? (
                  <div className="h-5 w-16 bg-white/10 rounded animate-pulse" />
                ) : (
                  <p className="text-lg font-black text-white">{formatNum(data?.liquidity.usd || "0", "$")}</p>
                )}
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-[9px] font-bold uppercase tracking-wider text-white/40 mb-1">Network</p>
                <p className="text-lg font-black text-[#9945FF]">Solana</p>
              </div>
            </div>

            {/* Buy Button */}
            <a
              href={`https://jup.ag/?sell=So11111111111111111111111111111111111111112&buy=${CA}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 w-full py-4 bg-[#FF6B00] hover:bg-[#FF8533] text-white text-sm font-black rounded-2xl transition-all hover:scale-[1.02] shadow-[0_0_30px_rgba(255,107,0,0.25)]"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
              BUY $MAD
            </a>
          </div>

          {/* ─── CHART COLUMN ─── */}
          <div className="lg:col-span-1">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-1 h-full min-h-[300px]">
              <iframe
                src="https://dexscreener.com/solana/Gt3dWHHKRd2mNQmmCHPzdeTpG4tTAa23exN1m2vwinfs?embed=1&theme=dark"
                className="w-full h-full min-h-[300px] rounded-xl"
                style={{ border: "none" }}
                title="$MAD Chart"
              />
            </div>
          </div>

          {/* ─── TRANSACTIONS COLUMN — Embedded DexScreener ─── */}
          <div className="lg:col-span-1">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] h-full flex flex-col overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-4 pt-4 pb-2">
                <p className="text-[10px] font-bold uppercase tracking-wider text-white/40">Recent Trades</p>
                <span className="text-[9px] text-white/20 flex items-center gap-1">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-400" />
                  </span>
                  Live
                </span>
              </div>
              {/* DexScreener Embed — Transactions tab */}
              <div className="flex-1 min-h-[320px]">
                <iframe
                  src="https://dexscreener.com/solana/Gt3dWHHKRd2mNQmmCHPzdeTpG4tTAa23exN1m2vwinfs?embed=1&theme=dark&tab=txns"
                  className="w-full h-full min-h-[320px] rounded-xl"
                  style={{ border: "none" }}
                  title="$MAD Live Trades"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
