"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const MAD_MINT = "Fa7ZE9nCEYnrHsnoeHuhEExJpchtrBtKXnWe6CgHpump";
const SOLANA_RPC = "https://api.mainnet-beta.solana.com";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function SectionShell({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "overflow-hidden rounded-[2rem] border border-white/5 bg-white/[0.02] shadow-[0_18px_50px_rgba(0,0,0,0.3)]",
        className,
      )}
    >
      {children}
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   CONFETTI CELEBRATION — Phase 1 completion burst
   ═══════════════════════════════════════════════════════════ */
function ConfettiBurst() {
  const [particles, setParticles] = useState<Array<{
    id: number; left: string; delay: string; duration: string; color: string; size: string; rotation: string;
  }>>([]);

  useEffect(() => {
    const colors = ['#FF2D2D', '#FFD700', '#10B981', '#FF6B00', '#1a1a1a'];
    const p = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 3}s`,
      duration: `${Math.random() * 3 + 3}s`,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: `${Math.random() * 8 + 4}px`,
      rotation: `${Math.random() * 360}deg`,
    }));
    setParticles(p);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute top-[-20px] will-change-transform"
          style={{
            left: p.left,
            animationDelay: p.delay,
            animationDuration: p.duration,
            animation: `confettiFall ${p.duration} ease-out ${p.delay} forwards`,
          }}
        >
          <div
            style={{
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              transform: `rotate(${p.rotation})`,
              borderRadius: Math.random() > 0.5 ? '50%' : '2px',
              opacity: 0.7,
            }}
          />
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   HOLDER VERIFICATION — On-chain balance + hold date checker
   ═══════════════════════════════════════════════════════════ */
function HolderVerification() {
  const [wallet, setWallet] = useState("");
  const [tg, setTg] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    balance: number;
    firstHeld: Date | null;
    qualified: boolean;
    category: string;
    categoryLabel: string;
    isOld: boolean;
    isNew: boolean;
    isTooLate: boolean;
  } | null>(null);
  const [error, setError] = useState("");
  const [devOpen, setDevOpen] = useState(false);

  const [config, setConfig] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("mad-verifier-config");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          return {
            minBalance: parsed.minBalance ?? 1000,
            oldCutoff: new Date(parsed.oldCutoff || "2026-05-01T00:00:00Z"),
            newCutoff: new Date(parsed.newCutoff || "2026-07-31T23:59:59Z"),
            oldSpots: parsed.oldSpots ?? 50,
            newSpots: parsed.newSpots ?? 30,
            target: parsed.target ?? "10M",
            rpcUrl: parsed.rpcUrl ?? SOLANA_RPC,
          };
        } catch { /* fall through */ }
      }
    }
    return {
      minBalance: 1000,
      oldCutoff: new Date("2026-05-01T00:00:00Z"),
      newCutoff: new Date("2026-07-31T23:59:59Z"),
      oldSpots: 50,
      newSpots: 30,
      target: "10M",
      rpcUrl: SOLANA_RPC,
    };
  });

  const [configSaved, setConfigSaved] = useState(false);

  const saveConfig = () => {
    localStorage.setItem("mad-verifier-config", JSON.stringify({
      minBalance: config.minBalance,
      oldCutoff: config.oldCutoff.toISOString(),
      newCutoff: config.newCutoff.toISOString(),
      oldSpots: config.oldSpots,
      newSpots: config.newSpots,
      target: config.target,
      rpcUrl: config.rpcUrl,
    }));
    setConfigSaved(true);
    setTimeout(() => setConfigSaved(false), 2000);
  };

  const toggleDevPanel = () => {
    if (!devOpen) {
      const pwd = prompt("Enter dev password:");
      if (pwd !== "madrichnbpf8f") {
        alert("Incorrect password.");
        return;
      }
    }
    setDevOpen(!devOpen);
  };

  async function rpc(method: string, params: unknown[]) {
    const res = await fetch("/api/solana-rpc", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
    });
    if (!res.ok) {
      throw new Error(`RPC HTTP error: ${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    if (data.error) {
      throw new Error(`RPC error: ${data.error.message || JSON.stringify(data.error)}`);
    }
    return data.result;
  }

  async function getTokenBalance(addr: string): Promise<number> {
    try {
      const result = await rpc("getTokenAccountsByOwner", [
        addr,
        { mint: MAD_MINT },
        { encoding: "jsonParsed" },
      ]);
      if (!result || !result.value || result.value.length === 0) return 0;
      return result.value[0].account.data.parsed.info.tokenAmount.uiAmount || 0;
    } catch (e) {
      throw new Error(`Balance check failed: ${e instanceof Error ? e.message : "Unknown error"}`);
    }
  }

  async function getFirstHoldDate(addr: string): Promise<Date | null> {
    try {
      const accounts = await rpc("getTokenAccountsByOwner", [
        addr,
        { mint: MAD_MINT },
        { encoding: "jsonParsed" },
      ]);
      if (!accounts || !accounts.value || accounts.value.length === 0) return null;
      const tokenAccount = accounts.value[0].pubkey;
      const sigs = await rpc("getSignaturesForAddress", [
        tokenAccount,
        { limit: 1000, commitment: "confirmed" },
      ]);
      if (!sigs || sigs.length === 0) return null;
      const oldest = sigs[sigs.length - 1];
      if (!oldest.blockTime) return null;
      return new Date(oldest.blockTime * 1000);
    } catch (e) {
      throw new Error(`First hold date check failed: ${e instanceof Error ? e.message : "Unknown error"}`);
    }
  }

  function formatBalance(n: number): string {
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(2) + "M MAD";
    if (n >= 1_000) return (n / 1_000).toFixed(1) + "K MAD";
    return n.toFixed(0) + " MAD";
  }

  function formatDate(d: Date | null): string {
    if (!d) return "Unknown";
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  }

  async function verify() {
    setError("");
    setResult(null);

    if (!wallet || wallet.length < 32) {
      setError("Please enter a valid Solana wallet address (at least 32 characters).");
      return;
    }
    if (!tg) {
      setError("Please enter your Telegram username.");
      return;
    }

    setLoading(true);
    try {
      const [balance, firstHeld] = await Promise.all([
        getTokenBalance(wallet),
        getFirstHoldDate(wallet),
      ]);

      const isOld = !!firstHeld && firstHeld <= config.oldCutoff;
      const isNew = !!firstHeld && firstHeld > config.oldCutoff && firstHeld <= config.newCutoff;
      const isTooLate = !!firstHeld && firstHeld > config.newCutoff;

      let category = "invalid";
      let categoryLabel = "Too Late";
      if (isOld) { category = "old"; categoryLabel = "Old Holder"; }
      else if (isNew) { category = "new"; categoryLabel = "New Holder"; }

      const qualified = balance >= config.minBalance && (isOld || isNew);

      setResult({
        balance,
        firstHeld,
        qualified,
        category,
        categoryLabel,
        isOld,
        isNew,
        isTooLate,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error occurred";
      setError(`Failed to verify: ${msg}. Check wallet address and try again.`);
      console.error("Verification error:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Milestone Banner */}
      <div className="rounded-xl border-l-4 border-[#FFD700]/60 bg-[#FFD700]/[0.04] p-4 mb-6 flex items-center gap-3">
        <span className="text-xl">🎯</span>
        <p className="text-sm text-white/60">
          <span className="font-bold text-[#FFD700]">{config.oldSpots} old + {config.newSpots} new holders</span> rewarded at {config.target} MC. Min: <span className="font-bold text-[#FFD700]">{config.minBalance.toLocaleString()} MAD</span>.
        </p>
      </div>

      {/* Dev Settings Toggle */}
      <div className="mb-4 text-center">
        <button
          onClick={toggleDevPanel}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white/30 hover:text-white/50 transition"
        >
          ⚙️ Dev Config
        </button>
      </div>

      {/* Dev Settings Panel */}
      {devOpen && (
        <div className="mb-6 rounded-2xl border border-[#FF6B00]/20 bg-[#FF6B00]/[0.03] p-5">
          <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#FF6B00]/70 mb-3">⚙️ Dev Configuration</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Old Cutoff", type: "date", val: config.oldCutoff.toISOString().split('T')[0], set: (v: string) => setConfig({ ...config, oldCutoff: new Date(v + "T00:00:00Z") }) },
              { label: "New Cutoff", type: "date", val: config.newCutoff.toISOString().split('T')[0], set: (v: string) => setConfig({ ...config, newCutoff: new Date(v + "T23:59:59Z") }) },
              { label: "Min Balance", type: "number", val: config.minBalance, set: (v: string) => setConfig({ ...config, minBalance: parseInt(v) || 1000 }) },
              { label: "Old Spots", type: "number", val: config.oldSpots, set: (v: string) => setConfig({ ...config, oldSpots: parseInt(v) || 50 }) },
              { label: "New Spots", type: "number", val: config.newSpots, set: (v: string) => setConfig({ ...config, newSpots: parseInt(v) || 30 }) },
              { label: "Target MC", type: "text", val: config.target, set: (v: string) => setConfig({ ...config, target: v }) },
            ].map((field) => (
              <div key={field.label}>
                <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-white/30 mb-1">{field.label}</label>
                <input
                  type={field.type}
                  value={field.val}
                  onChange={(e) => field.set(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg text-white font-mono text-sm px-3 py-2 outline-none focus:border-[#FF6B00]/50"
                />
              </div>
            ))}
          </div>
          <button
            onClick={saveConfig}
            className={`mt-3 font-bold text-xs rounded-lg px-4 py-2 transition ${configSaved ? "bg-emerald-500/20 text-emerald-400" : "bg-[#FF6B00]/20 text-[#FF6B00] hover:bg-[#FF6B00]/30"}`}
          >
            {configSaved ? "✅ Saved!" : "Save Settings"}
          </button>
        </div>
      )}

      {/* Input Card */}
      <div className="rounded-2xl border border-white/5 bg-[#111111] p-5 sm:p-6">
        <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-white/40 mb-2">Solana Wallet</label>
        <input
          type="text"
          value={wallet}
          onChange={(e) => setWallet(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && verify()}
          placeholder="Paste wallet address..."
          className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg text-white font-mono text-sm px-4 py-3 outline-none focus:border-[#FF2D2D]/50 transition-colors mb-3 placeholder:text-white/10"
        />

        <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-white/40 mb-2">Telegram @username</label>
        <input
          type="text"
          value={tg}
          onChange={(e) => setTg(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && verify()}
          placeholder="@yourusername"
          className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg text-white font-mono text-sm px-4 py-3 outline-none focus:border-[#FF2D2D]/50 transition-colors mb-4 placeholder:text-white/10"
        />

        <button
          onClick={verify}
          disabled={loading}
          className="w-full bg-[#FF2D2D] text-white font-bold text-sm rounded-lg px-6 py-3 transition hover:bg-[#FF2D2D]/80 active:scale-[0.98] disabled:bg-white/10 disabled:cursor-not-allowed"
        >
          {loading ? "Checking on-chain..." : "Check My Wallet"}
        </button>

        <p className="mt-2 text-[10px] text-white/25 text-center">Read-only. Nothing is signed or sent.</p>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-3 rounded-xl border border-[#FF2D2D]/20 bg-[#FF2D2D]/[0.04] p-3">
          <p className="text-xs text-[#FF2D2D] font-mono font-bold">{error}</p>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="mt-6 text-center">
          <div className="flex justify-center gap-2 mb-2">
            {[0, 0.2, 0.4].map((d) => (
              <span key={d} className="w-2 h-2 rounded-full bg-[#FF2D2D] animate-bounce" style={{ animationDelay: `${d}s` }} />
            ))}
          </div>
          <p className="text-[10px] font-mono text-white/30">Checking on-chain...</p>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className={`mt-6 rounded-2xl border border-white/5 bg-[#111111] overflow-hidden ${result.qualified ? "border-l-4 border-l-emerald-500" : "border-l-4 border-l-[#FF2D2D]"}`}>
          <div className="p-5 flex items-center gap-3">
            <span className="text-2xl">{result.qualified ? "✅" : "❌"}</span>
            <div>
              <p className={`font-black ${result.qualified ? "text-emerald-400" : "text-[#FF2D2D]"}`}>
                {result.qualified ? "Qualified" : "Not Qualified"}
              </p>
              <p className="text-[10px] font-mono text-white/30">
                {result.qualified ? "Wallet meets requirements" : "Does not qualify for this giveaway"}
              </p>
            </div>
          </div>
          <div className="px-5 pb-5">
            <div className="space-y-2 text-sm">
              {[
                { label: "Balance", value: formatBalance(result.balance) },
                { label: "Holding Since", value: formatDate(result.firstHeld) },
                { label: "Minimum", value: config.minBalance.toLocaleString() + " MAD" },
                { label: "Category", value: result.categoryLabel },
              ].map((stat) => (
                <div key={stat.label} className="flex justify-between py-1 border-b border-white/5 last:border-0">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-white/30">{stat.label}</span>
                  <span className="font-mono font-bold text-white/70">{stat.value}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 rounded-lg bg-[#0a0a0a] p-3 text-xs text-white/40">
              {result.qualified && result.isOld ? (
                <p>Old Holder — in pool of {config.oldSpots}. Winners picked at {config.target} MC.</p>
              ) : result.qualified && result.isNew ? (
                <p>New Holder — in pool of {config.newSpots}. Winners picked at {config.target} MC.</p>
              ) : result.isTooLate ? (
                <p>Hold date after cutoff. Not eligible this round.</p>
              ) : result.balance === 0 ? (
                <p>No $MAD found. Buy at least {config.minBalance.toLocaleString()} MAD to qualify.</p>
              ) : (
                <p>Need {config.minBalance.toLocaleString()} MAD minimum. You have {formatBalance(result.balance)}.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SIMPLIFIED REWARDS PAGE
   ═══════════════════════════════════════════════════════════ */

const milestones = [
  { mc: "$1M", status: "done", reward: "2.5M $MAD", winners: 50, label: "Phase 1" },
  { mc: "$10M", status: "active", reward: "1M $MAD", winners: 80, label: "Phase 2" },
  { mc: "$25M", status: "locked", reward: "?", winners: "?", label: "Phase 3" },
  { mc: "$50M", status: "locked", reward: "?", winners: "?", label: "Phase 4" },
  { mc: "$75M", status: "locked", reward: "?", winners: "?", label: "Phase 5" },
  { mc: "$100M", status: "locked", reward: "?", winners: "?", label: "Phase 6" },
];

export default function RewardsPage() {
  return (
    <div className="relative overflow-hidden bg-[#0a0a0a] text-white">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_50%_20%,rgba(255,45,45,0.08),transparent_60%)]" />
      <ConfettiBurst />

      <style>{`
        @keyframes confettiFall {
          0% { transform: translateY(-20px) rotate(0deg); opacity: 0; }
          10% { opacity: 0.8; }
          90% { opacity: 0.6; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
        @keyframes madPulse {
          0%, 100% { transform: scale(1); text-shadow: 0 0 30px rgba(255,45,45,0.3), 0 0 60px rgba(255,45,45,0.15); }
          50% { transform: scale(1.02); text-shadow: 0 0 40px rgba(255,45,45,0.5), 0 0 80px rgba(255,45,45,0.25); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
      `}</style>

      <div className="relative mx-auto max-w-4xl px-4 pb-20 pt-8 sm:px-6">
        {/* Banner */}
        <div className="mb-6 overflow-hidden rounded-2xl border border-white/5 shadow-[0_18px_50px_rgba(0,0,0,0.3)]">
          <Image
            src="/rewards-banner.png"
            alt="$MAD Rewards"
            width={1200}
            height={400}
            className="w-full h-auto object-cover"
            priority
          />
        </div>

        {/* Status Pills */}
        <div className="mb-8 flex flex-wrap items-center justify-center gap-2">
          <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-emerald-400">
            ✅ Phase 1 Done — 50 Paid
          </span>
          <span className="rounded-full border border-[#FF6B00]/20 bg-[#FF6B00]/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-[#FF6B00]">
            🎯 Phase 2 Active — $10M Target
          </span>
        </div>

        {/* Hero */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">
            $MAD <span className="text-[#FF2D2D]">Rewards</span>
          </h1>
          <p className="mt-3 text-base text-white/50">Hold a minimum of 1,000 $MAD tokens to be eligible.</p>
          <a
            href="https://jup.ag/swap?sell=So11111111111111111111111111111111111111112&buy=Fa7ZE9nCEYnrHsnoeHuhEExJpchtrBtKXnWe6CgHpump"
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex rounded-full bg-[#FF2D2D] px-7 py-3 text-sm font-black text-white transition hover:scale-[1.02]"
          >
            Buy $MAD →
          </a>
        </div>

        {/* HERO STAT — 12M $MAD */}
        <div className="mb-8 rounded-2xl border border-[#FF2D2D]/20 bg-[#FF2D2D]/[0.04] p-6 sm:p-10 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,45,45,0.12),transparent_70%)]" />
          <div className="relative">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#FF2D2D]/70 mb-3">
              🎁 Rewards Pool
            </p>
            <p
              className="text-6xl sm:text-8xl font-black tracking-tighter text-white"
              style={{ animation: 'madPulse 3s ease-in-out infinite' }}
            >
              12,000,000
            </p>
            <p className="mt-2 text-2xl sm:text-3xl font-black text-[#FF2D2D]">$MAD</p>
            <p className="mt-3 text-sm text-white/40 max-w-md mx-auto">
              Sitting in the reward wallet, waiting for the community. 100% community funded. Zero dev allocation.
            </p>
            <div className="mt-5 flex items-center justify-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">Live on-chain</span>
            </div>
          </div>
        </div>

        {/* Supporting Stats */}
        <div className="mb-10 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.04] p-5 text-center">
            <p className="text-3xl font-black text-emerald-400">50</p>
            <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400/60">Winners Paid</p>
            <p className="mt-1 text-[10px] text-white/25">Phase 1 · $1M MC</p>
          </div>
          <div className="rounded-2xl border border-[#FF6B00]/20 bg-[#FF6B00]/[0.04] p-5 text-center">
            <p className="text-3xl font-black text-[#FF6B00]">80</p>
            <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-[#FF6B00]/60">Spots Open</p>
            <p className="mt-1 text-[10px] text-white/25">Phase 2 · $10M MC</p>
          </div>
        </div>

        {/* Roadmap */}
        <SectionShell className="mb-10 p-6 sm:p-8">
          <h2 className="text-center text-xl font-black text-white mb-6">The Road Up</h2>
          <div className="relative max-w-xl mx-auto">
            <div className="absolute left-3 sm:left-4 top-2 bottom-2 w-0.5 bg-white/5" />
            {milestones.map((m, i) => (
              <div key={m.mc} className="relative flex items-start gap-4 mb-5 last:mb-0">
                <div className={cn(
                  "relative z-10 mt-1 h-2.5 w-2.5 rounded-full shrink-0",
                  m.status === "done" && "bg-emerald-500 ring-4 ring-emerald-500/20",
                  m.status === "active" && "bg-[#FF6B00] ring-4 ring-[#FF6B00]/20 animate-pulse",
                  m.status === "locked" && "bg-white/10 ring-4 ring-white/5",
                )} />
                <div className={cn(
                  "flex-1 rounded-xl border p-4",
                  m.status === "done" && "border-emerald-500/20 bg-emerald-500/[0.03]",
                  m.status === "active" && "border-[#FF6B00]/20 bg-[#FF6B00]/[0.03]",
                  m.status === "locked" && "border-white/5 bg-white/[0.02] opacity-50",
                )}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-black text-white">{m.mc}</span>
                    <span className={cn(
                      "text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full",
                      m.status === "done" && "bg-emerald-500/10 text-emerald-400",
                      m.status === "active" && "bg-[#FF6B00]/10 text-[#FF6B00]",
                      m.status === "locked" && "bg-white/5 text-white/30",
                    )}>
                      {m.status === "done" ? "Done" : m.status === "active" ? "Next" : "Locked"}
                    </span>
                  </div>
                  <p className="text-xs text-white/40">
                    {m.status === "done" ? `${m.reward} · ${m.winners} winners paid` :
                     m.status === "active" ? `${m.reward} ready · ${m.winners} winners · Min 1K $MAD` :
                     "Reward TBA"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </SectionShell>

        {/* Wallet Check */}
        <SectionShell className="mb-10 p-6 sm:p-8">
          <div className="text-center mb-6">
            <h2 className="text-xl font-black text-white">Check Your Wallet</h2>
            <p className="mt-1 text-sm text-white/40">Paste your address. No connection needed.</p>
          </div>
          <HolderVerification />
        </SectionShell>

        {/* Past Challenges */}
        <SectionShell className="mb-10 p-6 sm:p-8">
          <h2 className="text-center text-xl font-black text-white mb-6">Past Challenges</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a
              href="https://x.com/madrichclub_/status/2061871512991437267"
              target="_blank"
              rel="noreferrer"
              className="rounded-xl border border-white/5 bg-white/[0.02] p-4 transition hover:border-[#FF2D2D]/20"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-black text-emerald-400">✅ Paid</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-white/30">Jun 2026</span>
              </div>
              <p className="text-sm font-bold text-white">$MAD Health Competition</p>
              <p className="text-xs text-white/40">20 pushups · 50K $MAD each</p>
            </a>
            <a
              href="https://x.com/madrichclub_/status/2065002932349931857"
              target="_blank"
              rel="noreferrer"
              className="rounded-xl border border-white/5 bg-white/[0.02] p-4 transition hover:border-[#FF2D2D]/20"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-black text-emerald-400">✅ Paid</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-white/30">Jun 2026</span>
              </div>
              <p className="text-sm font-bold text-white">$MAD Rich Animal Challenge</p>
              <p className="text-xs text-white/40">Pet + cash · 20K $MAD each</p>
            </a>
          </div>
        </SectionShell>

        {/* CTA */}
        <div className="text-center">
          <a
            href="https://jup.ag/swap?sell=So11111111111111111111111111111111111111112&buy=Fa7ZE9nCEYnrHsnoeHuhEExJpchtrBtKXnWe6CgHpump"
            target="_blank"
            rel="noreferrer"
            className="inline-flex rounded-full bg-[#FF2D2D] px-8 py-4 text-lg font-black text-white transition hover:scale-[1.02]"
          >
            Buy $MAD →
          </a>
          <p className="mt-3 text-xs text-white/30">Join the movement. Stay $MAD.</p>
        </div>
      </div>
    </div>
  );
}
