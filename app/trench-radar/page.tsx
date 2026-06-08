"use client";

import { useState, useCallback } from "react";

type WalletTag =
  | "whale"
  | "smart_money"
  | "new_wallet"
  | "diamond_hands"
  | "paper_hands"
  | "bot"
  | "doxxed"
  | "kols"
  | "accumulator"
  | "dumper";

interface TokenHolding {
  symbol: string;
  name: string;
  amount: number;
  usdValue: number;
  priceChange24h?: number;
}

interface TxSummary {
  signature: string;
  timestamp: string;
  type: string;
  usdValue: number;
  success: boolean;
}

interface PnL {
  realized: number;
  unrealized: number;
  total: number;
  winRate: number;
  trades: number;
}

interface WalletScan {
  address: string;
  solBalance: number;
  tokenHoldings: TokenHolding[];
  recentTransactions: TxSummary[];
  riskScore: number;
  tags: WalletTag[];
  lastActive: string;
  estimatedPnL: PnL | null;
}

const TAG_COLORS: Record<WalletTag, string> = {
  whale: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  smart_money: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  new_wallet: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  diamond_hands: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  paper_hands: "bg-red-500/20 text-red-300 border-red-500/30",
  bot: "bg-gray-500/20 text-gray-300 border-gray-500/30",
  doxxed: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  kols: "bg-pink-500/20 text-pink-300 border-pink-500/30",
  accumulator: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  dumper: "bg-rose-500/20 text-rose-300 border-rose-500/30",
};

const TAG_LABELS: Record<WalletTag, string> = {
  whale: "🐋 WHALE",
  smart_money: "🧠 SMART MONEY",
  new_wallet: "🆕 NEW",
  diamond_hands: "💎 DIAMOND HANDS",
  paper_hands: "📄 PAPER HANDS",
  bot: "🤖 BOT",
  doxxed: "✓ DOXXED",
  kols: "📢 KOL",
  accumulator: "📥 ACCUMULATOR",
  dumper: "📤 DUMPER",
};

function truncate(addr: string) {
  return addr.slice(0, 4) + "..." + addr.slice(-4);
}

function formatUSD(n: number) {
  if (n >= 1_000_000) return "$" + (n / 1_000_000).toFixed(2) + "M";
  if (n >= 1_000) return "$" + (n / 1_000).toFixed(1) + "K";
  return "$" + n.toFixed(2);
}

function formatSOL(n: number) {
  return n.toFixed(3) + " SOL";
}

function formatTimeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function RiskBar({ score }: { score: number }) {
  const color = score < 40 ? "bg-emerald-500" : score < 70 ? "bg-yellow-500" : "bg-red-500";
  const label = score < 40 ? "LOW" : score < 70 ? "MEDIUM" : "HIGH";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
        <div className={`h-full ${color} transition-all`} style={{ width: `${score}%` }} />
      </div>
      <span className="text-[10px] font-black text-white/50">{label}</span>
    </div>
  );
}

export default function TrenchRadarPage() {
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<WalletScan | null>(null);
  const [error, setError] = useState("");
  const [mode, setMode] = useState<"single" | "whales" | "newbies">("single");
  const [batchResults, setBatchResults] = useState<WalletScan[]>([]);

  const scan = useCallback(async () => {
    setLoading(true);
    setError("");
    setResult(null);
    setBatchResults([]);

    try {
      const url = `/api/trench-scan?mode=${mode}${mode === "single" && address ? `&address=${encodeURIComponent(address)}` : ""}`;
      const res = await fetch(url, { cache: "no-store" });
      const json = await res.json();

      if (!json.ok) throw new Error(json.error || "Scan failed");

      if (mode === "single") {
        setResult(json.data);
      } else {
        setBatchResults(json.data || []);
      }
    } catch (err: any) {
      setError(err.message || "Failed to scan.");
    } finally {
      setLoading(false);
    }
  }, [address, mode]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") scan();
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Trench Radar
          </h1>
          <p className="mt-3 text-white/65">
            On-chain intelligence. Who holds, who folds, who apes.
          </p>
        </div>

        {/* Mode Switch */}
        <div className="flex flex-wrap gap-2 mb-6">
          {(["single", "whales", "newbies"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wide transition ${
                mode === m
                  ? "bg-white text-black"
                  : "border border-white/10 bg-black/40 text-white/75 hover:bg-white/5"
              }`}
            >
              {m === "single" ? "🔍 Single Wallet" : m === "whales" ? "🐋 Whale Watch" : "🆕 New Money"}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="flex gap-2 mb-8">
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={mode === "single" ? "Paste Solana wallet address..." : "Optional: filter by token mint"}
            className="flex-1 rounded-xl border border-white/10 bg-black/60 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-white/20"
          />
          <button
            onClick={scan}
            disabled={loading}
            className="rounded-xl bg-white px-6 py-3 text-sm font-bold text-black transition hover:bg-white/90 disabled:opacity-40"
          >
            {loading ? "Scanning..." : "Scan"}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            ⚠️ {error}
          </div>
        )}

        {/* Single Result */}
        {result && mode === "single" && <WalletCard wallet={result} detailed />}

        {/* Batch Results */}
        {batchResults.length > 0 && (
          <div className="grid gap-3 sm:grid-cols-2">
            {batchResults.map((w) => (
              <WalletCard key={w.address} wallet={w} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && !result && batchResults.length === 0 && !error && (
          <div className="rounded-[24px] border border-white/10 bg-[#0b0b0f] p-8 text-center">
            <div className="text-4xl mb-4">📡</div>
            <p className="text-white/50 text-sm">
              {mode === "single"
                ? "Paste a wallet address to scan the trenches."
                : mode === "whales"
                ? "Scan top $MAD holders and whale movements."
                : "Detect fresh wallets aping into the ecosystem."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function WalletCard({ wallet, detailed = false }: { wallet: WalletScan; detailed?: boolean }) {
  const totalValue = wallet.tokenHoldings.reduce((sum, h) => sum + h.usdValue, 0) + wallet.solBalance * 150;

  return (
    <div className="rounded-[24px] border border-white/10 bg-[#0b0b0f] p-5">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-mono font-bold text-white">{truncate(wallet.address)}</span>
            <button
              onClick={() => navigator.clipboard.writeText(wallet.address)}
              className="text-white/30 hover:text-white/60 transition text-xs"
              title="Copy"
            >
              📋
            </button>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-white/40">{formatTimeAgo(wallet.lastActive)}</span>
            <span className="text-xs text-white/20">·</span>
            <span className="text-xs text-white/40">{formatSOL(wallet.solBalance)}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-white">{formatUSD(totalValue)}</div>
          <div className="text-[10px] text-white/40 uppercase">portfolio</div>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {wallet.tags.map((tag) => (
          <span
            key={tag}
            className={`rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-wide ${TAG_COLORS[tag]}`}
          >
            {TAG_LABELS[tag]}
          </span>
        ))}
        {wallet.tags.length === 0 && (
          <span className="text-[10px] text-white/20">No tags detected</span>
        )}
      </div>

      {/* Risk */}
      <div className="mb-4">
        <div className="flex justify-between mb-1">
          <span className="text-[10px] font-black uppercase tracking-wide text-white/30">Risk Score</span>
          <span className="text-[10px] font-bold text-white/50">{wallet.riskScore}/100</span>
        </div>
        <RiskBar score={wallet.riskScore} />
      </div>

      {/* Holdings */}
      {detailed && wallet.tokenHoldings.length > 0 && (
        <div className="mb-4">
          <h3 className="text-[10px] font-black uppercase tracking-wide text-white/30 mb-2">Holdings</h3>
          <div className="space-y-1.5">
            {wallet.tokenHoldings.map((h) => (
              <div key={h.symbol} className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] px-3 py-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">{h.symbol}</span>
                  <span className="text-[10px] text-white/40">{h.name}</span>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-white">{formatUSD(h.usdValue)}</div>
                  {h.priceChange24h !== undefined && (
                    <div className={`text-[10px] ${h.priceChange24h >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                      {h.priceChange24h >= 0 ? "+" : ""}{h.priceChange24h.toFixed(1)}%
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PnL */}
      {wallet.estimatedPnL && (
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="rounded-xl border border-white/5 bg-white/[0.02] px-3 py-2 text-center">
            <div className={`text-xs font-bold ${wallet.estimatedPnL.total >= 0 ? "text-emerald-400" : "text-red-400"}`}>
              {wallet.estimatedPnL.total >= 0 ? "+" : ""}{formatUSD(wallet.estimatedPnL.total)}
            </div>
            <div className="text-[9px] text-white/30 uppercase mt-1">Total PnL</div>
          </div>
          <div className="rounded-xl border border-white/5 bg-white/[0.02] px-3 py-2 text-center">
            <div className="text-xs font-bold text-white">{(wallet.estimatedPnL.winRate * 100).toFixed(0)}%</div>
            <div className="text-[9px] text-white/30 uppercase mt-1">Win Rate</div>
          </div>
          <div className="rounded-xl border border-white/5 bg-white/[0.02] px-3 py-2 text-center">
            <div className="text-xs font-bold text-white">{wallet.estimatedPnL.trades}</div>
            <div className="text-[9px] text-white/30 uppercase mt-1">Trades</div>
          </div>
        </div>
      )}

      {/* Recent Transactions */}
      {detailed && wallet.recentTransactions.length > 0 && (
        <div>
          <h3 className="text-[10px] font-black uppercase tracking-wide text-white/30 mb-2">Recent Activity</h3>
          <div className="space-y-1.5">
            {wallet.recentTransactions.slice(0, 5).map((tx) => (
              <div key={tx.signature} className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] px-3 py-2">
                <div className="flex items-center gap-2">
                  <span className={`text-xs ${tx.type === "buy" || tx.type === "swap" ? "text-emerald-400" : tx.type === "sell" ? "text-red-400" : "text-white/50"}`}>
                    {tx.type.toUpperCase()}
                  </span>
                  <span className="text-[10px] text-white/30">{formatTimeAgo(tx.timestamp)}</span>
                </div>
                <div className="text-xs font-bold text-white">{formatUSD(tx.usdValue)}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
