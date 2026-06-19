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

/* ─── MOCK TRANSACTIONS ─── */
const MOCK_TXNS = [
  { type: "buy", wallet: "0x7a3...f91", amount: "5,000", time: "2s ago" },
  { type: "sell", wallet: "0x2b1...c44", amount: "12,000", time: "8s ago" },
  { type: "buy", wallet: "0x9e5...a22", amount: "850", time: "15s ago" },
  { type: "buy", wallet: "0x4c8...d77", amount: "23,400", time: "22s ago" },
  { type: "sell", wallet: "0x1f3...b99", amount: "3,200", time: "31s ago" },
  { type: "buy", wallet: "0x6a2...e55", amount: "1,500", time: "45s ago" },
  { type: "buy", wallet: "0x8d4...h33", amount: "67,000", time: "1m ago" },
  { type: "sell", wallet: "0x3e7...j11", amount: "8,900", time: "1m ago" },
];

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
    const interval = setInterval(fetchData, 30000); // refresh every 30s
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

          {/* ─── TRANSACTIONS COLUMN ─── */}
          <div className="lg:col-span-1">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 h-full">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-white/40">Recent Activity</p>
                <span className="text-[9px] text-white/20">Live</span>
              </div>
              <div className="space-y-2 max-h-[320px] overflow-hidden">
                {MOCK_TXNS.map((tx, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-2 px-3 rounded-lg bg-white/[0.02] border border-white/5"
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${tx.type === "buy" ? "bg-green-400" : "bg-red-400"}`} />
                      <span className="text-[11px] font-mono text-white/60">{tx.wallet}</span>
                    </div>
                    <div className="text-right">
                      <p className={`text-xs font-bold ${tx.type === "buy" ? "text-green-400" : "text-red-400"}`}>
                        {tx.type === "buy" ? "+" : "-"}{tx.amount}
                      </p>
                      <p className="text-[9px] text-white/20">{tx.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
