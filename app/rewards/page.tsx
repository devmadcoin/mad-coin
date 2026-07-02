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

function Pill({
  children,
  tone = "default",
}: {
  children: React.ReactNode;
  tone?: "default" | "red" | "green";
}) {
  return (
    <div
      className={cn(
        "rounded-full px-4 py-2 text-[11px] font-black uppercase tracking-[0.24em]",
        tone === "red" && "border border-[#FF2D2D]/25 bg-[#FF2D2D]/10 text-[#FF2D2D]",
        tone === "green" &&
          "border border-emerald-400/20 bg-emerald-500/10 text-emerald-600",
        tone === "default" &&
          "border border-[#1a1a1a]/10 bg-[#1a1a1a]/[0.03] text-[#1a1a1a]/60",
      )}
    >
      {children}
    </div>
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

  // Dev config with localStorage persistence
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
    // Use local API proxy to bypass CORS
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
      <div className="rounded-xl border-l-4 border-[#FFD700]/60 bg-[#FFD700]/[0.04] p-4 mb-8 flex items-center gap-3">
        <span className="text-xl">🎯</span>
        <p className="text-sm text-white/60">
          <span className="font-bold text-[#FFD700]">{config.oldSpots} old holders + {config.newSpots} new holders</span> will receive rewards at {config.target} market cap. Minimum holding: <span className="font-bold text-[#FFD700]">{config.minBalance.toLocaleString()} MAD</span>.
        </p>
      </div>

      {/* Dev Settings Toggle */}
      <div className="mb-6 text-center">
        <button
          onClick={toggleDevPanel}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-white/40 hover:text-white/60 transition"
        >
          <span>⚙️</span>
          <span>Dev Configuration</span>
        </button>
      </div>

      {/* Dev Settings Panel */}
      {devOpen && (
        <div className="mb-8 rounded-2xl border border-[#FF6B00]/20 bg-[#FF6B00]/[0.03] p-6">
          <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#FF6B00]/70 mb-4">⚙️ Dev Configuration</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-white/30 mb-1.5">Old Holder Cutoff</label>
              <input
                type="date"
                value={config.oldCutoff.toISOString().split('T')[0]}
                onChange={(e) => setConfig({ ...config, oldCutoff: new Date(e.target.value + "T00:00:00Z") })}
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg text-white font-mono text-sm px-3 py-2.5 outline-none focus:border-[#FF6B00]/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-white/30 mb-1.5">New Holder End Date</label>
              <input
                type="date"
                value={config.newCutoff.toISOString().split('T')[0]}
                onChange={(e) => setConfig({ ...config, newCutoff: new Date(e.target.value + "T23:59:59Z") })}
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg text-white font-mono text-sm px-3 py-2.5 outline-none focus:border-[#FF6B00]/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-white/30 mb-1.5">Min Balance (MAD)</label>
              <input
                type="number"
                value={config.minBalance}
                onChange={(e) => setConfig({ ...config, minBalance: parseInt(e.target.value) || 1000 })}
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg text-white font-mono text-sm px-3 py-2.5 outline-none focus:border-[#FF6B00]/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-white/30 mb-1.5">Old Holder Spots</label>
              <input
                type="number"
                value={config.oldSpots}
                onChange={(e) => setConfig({ ...config, oldSpots: parseInt(e.target.value) || 50 })}
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg text-white font-mono text-sm px-3 py-2.5 outline-none focus:border-[#FF6B00]/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-white/30 mb-1.5">New Holder Spots</label>
              <input
                type="number"
                value={config.newSpots}
                onChange={(e) => setConfig({ ...config, newSpots: parseInt(e.target.value) || 30 })}
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg text-white font-mono text-sm px-3 py-2.5 outline-none focus:border-[#FF6B00]/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-white/30 mb-1.5">Target Market Cap</label>
              <input
                type="text"
                value={config.target}
                onChange={(e) => setConfig({ ...config, target: e.target.value })}
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg text-white font-mono text-sm px-3 py-2.5 outline-none focus:border-[#FF6B00]/50 transition-colors"
              />
            </div>
          </div>
          <button
            onClick={saveConfig}
            className={`mt-4 font-bold text-xs rounded-lg px-5 py-2.5 transition ${
              configSaved
                ? "bg-emerald-500/20 text-emerald-400"
                : "bg-[#FF6B00]/20 text-[#FF6B00] hover:bg-[#FF6B00]/30"
            }`}
          >
            {configSaved ? "✅ Saved!" : "Save Settings"}
          </button>
          <p className="mt-2 text-[10px] font-mono text-white/20">Settings are saved in the browser. Update before sharing the page link.</p>
        </div>
      )}

      {/* Input Card */}
      <div className="rounded-2xl border border-white/5 bg-[#111111] p-6 sm:p-8">
        <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-white/40 mb-3">
          Your Solana Wallet Address
        </label>
        <input
          type="text"
          value={wallet}
          onChange={(e) => setWallet(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && verify()}
          placeholder="Paste your wallet address..."
          className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg text-white font-mono text-sm px-4 py-3.5 outline-none focus:border-[#FF2D2D]/50 transition-colors mb-4 placeholder:text-white/10"
        />

        <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-white/40 mb-3">
          Your Telegram Username
        </label>
        <input
          type="text"
          value={tg}
          onChange={(e) => setTg(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && verify()}
          placeholder="@yourusername"
          className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg text-white font-mono text-sm px-4 py-3.5 outline-none focus:border-[#FF2D2D]/50 transition-colors mb-5 placeholder:text-white/10"
        />

        <button
          onClick={verify}
          disabled={loading}
          className="w-full bg-[#FF2D2D] text-white font-bold text-sm rounded-lg px-6 py-3.5 transition hover:bg-[#FF2D2D]/80 active:scale-[0.98] disabled:bg-white/10 disabled:cursor-not-allowed"
        >
          {loading ? "Checking on-chain..." : "Check My Wallet"}
        </button>

        <p className="mt-3 text-[11px] text-white/30">
          Read-only check. Nothing is sent or signed. Your TG username helps the dev identify winners.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-4 rounded-xl border border-[#FF2D2D]/20 bg-[#FF2D2D]/[0.04] p-4">
          <p className="text-sm text-[#FF2D2D] font-mono font-bold mb-1">Verification Failed</p>
          <p className="text-xs text-white/50 font-mono">{error}</p>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="mt-8 text-center">
          <div className="flex justify-center gap-2 mb-3">
            {[0, 0.2, 0.4].map((d) => (
              <span key={d} className="w-2 h-2 rounded-full bg-[#FF2D2D] animate-bounce" style={{ animationDelay: `${d}s` }} />
            ))}
          </div>
          <p className="text-[11px] font-mono text-white/30 tracking-wider">Checking on-chain data...</p>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="mt-8">
          <div className={`rounded-2xl border border-white/5 bg-[#111111] overflow-hidden ${result.qualified ? "border-l-4 border-l-emerald-500" : "border-l-4 border-l-[#FF2D2D]"}`}>
            {/* Header */}
            <div className="p-6 sm:p-8 flex items-center gap-4">
              <span className="text-3xl">{result.qualified ? "✅" : "❌"}</span>
              <div>
                <p className={`text-lg font-black ${result.qualified ? "text-emerald-400" : "text-[#FF2D2D]"}`}>
                  {result.qualified ? "Qualified" : "Not Qualified"}
                </p>
                <p className="text-xs font-mono text-white/30">
                  {result.qualified ? "Your wallet meets the requirement" : "Your wallet does not qualify for this giveaway"}
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="px-6 sm:px-8 pb-6 sm:pb-8">
              <div className="space-y-3">
                {[
                  { label: "Wallet", value: wallet.slice(0, 6) + "..." + wallet.slice(-4) },
                  { label: "Telegram", value: tg },
                  { label: "MAD Balance", value: formatBalance(result.balance) },
                  { label: "Holding Since", value: formatDate(result.firstHeld) },
                  { label: "Minimum Required", value: config.minBalance.toLocaleString() + " MAD" },
                ].map((stat) => (
                  <div key={stat.label} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-white/30">{stat.label}</span>
                    <span className="text-sm font-mono font-bold text-white/70">{stat.value}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center py-2">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-white/30">Category</span>
                  <div>
                    {result.balance === 0 ? (
                      <span className="text-sm font-mono font-bold text-white/50">—</span>
                    ) : (
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold font-mono tracking-wider border ${
                        result.category === "old"
                          ? "bg-[#FFD700]/10 text-[#FFD700] border-[#FFD700]/20"
                          : result.category === "new"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : "bg-[#FF2D2D]/10 text-[#FF2D2D] border-[#FF2D2D]/20"
                      }`}>
                        {result.categoryLabel}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Notice */}
              <div className="mt-5 rounded-xl border border-white/5 bg-[#0a0a0a] p-4 text-sm text-white/40 leading-relaxed">
                {result.qualified && result.isOld ? (
                  <p><span className="font-bold text-white">Old Holder</span> — You held $MAD on or before {formatDate(config.oldCutoff)}. You're in the old holder pool ({config.oldSpots} spots). Winners selected randomly by the dev at {config.target} market cap.</p>
                ) : result.qualified && result.isNew ? (
                  <p><span className="font-bold text-white">New Holder</span> — You started holding $MAD between {formatDate(config.oldCutoff)} and {formatDate(config.newCutoff)}. You're in the new holder pool ({config.newSpots} spots). Winners selected randomly by the dev at {config.target} market cap.</p>
                ) : result.isTooLate && result.balance >= config.minBalance ? (
                  <p>You hold enough $MAD but your wallet first received tokens <span className="font-bold text-white">after the cutoff date ({formatDate(config.newCutoff)})</span>. Late buyers are not eligible for this giveaway round.</p>
                ) : result.balance === 0 ? (
                  <p>Your wallet holds no $MAD tokens. Buy at least <span className="font-bold text-white">{config.minBalance.toLocaleString()} MAD</span> on Jupiter to qualify for future giveaways.</p>
                ) : (
                  <p>Your wallet holds <span className="font-bold text-white">{formatBalance(result.balance)}</span> — you need at least <span className="font-bold text-white">{config.minBalance.toLocaleString()} MAD</span> to qualify.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* How it works */}
      <div className="mt-10">
        <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-white/20 text-center mb-5">How it works</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { num: "01", text: "Paste your wallet and Telegram username above" },
            { num: "02", text: "We check your MAD balance and when you first held" },
            { num: "03", text: "Your category is confirmed. Dev picks winners at 10M" },
          ].map((step) => (
            <div key={step.num} className="rounded-xl border border-white/5 bg-[#111111] p-5 text-center">
              <p className="text-[11px] font-mono font-bold text-[#FF2D2D] tracking-wider mb-2">{step.num}</p>
              <p className="text-sm text-white/40 leading-relaxed">{step.text}</p>
            </div>
          ))}
        </div>
      </div>

      <p className="mt-8 text-center text-[11px] font-mono text-white/15">
        Read-only on-chain verification. No wallet connection required.
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   GIVEAWAY TRACKER — Time-locked winner system
   ═══════════════════════════════════════════════════════════ */
function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [target, setTarget] = useState<number | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("mad-rewards-target");
    let targetTime: number;

    if (stored) {
      targetTime = parseInt(stored, 10);
    } else {
      targetTime = Date.now() + 12 * 60 * 60 * 1000;
      localStorage.setItem("mad-rewards-target", targetTime.toString());
    }

    setTarget(targetTime);

    const interval = setInterval(() => {
      const now = Date.now();
      const diff = targetTime - now;
      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        clearInterval(interval);
      } else {
        setTimeLeft({
          hours: Math.floor(diff / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    // Run immediately
    const now = Date.now();
    const diff = targetTime - now;
    if (diff <= 0) {
      setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
    } else {
      setTimeLeft({
        hours: Math.floor(diff / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    }

    return () => clearInterval(interval);
  }, []);

  const pad = (n: number) => n.toString().padStart(2, "0");

  return (
    <div className="mt-4 rounded-[1.2rem] border border-[#FF2D2D]/20 bg-[#FF2D2D]/[0.04] p-4 sm:p-5">
      <p className="text-[10px] font-black uppercase tracking-[0.34em] text-[#FF2D2D]/70 mb-3 text-center">
        Reward Distribution In
      </p>
      <div className="flex items-center justify-center gap-2 sm:gap-4">
        {[
          { value: timeLeft.hours, label: "Hours" },
          { value: timeLeft.minutes, label: "Minutes" },
          { value: timeLeft.seconds, label: "Seconds" },
        ].map((item) => (
          <div key={item.label} className="flex flex-col items-center">
            <div className="rounded-xl border border-[#1a1a1a]/10 bg-white px-3 py-2 sm:px-4 sm:py-3 min-w-[60px] sm:min-w-[72px] text-center">
              <span className="text-xl sm:text-2xl font-black text-[#FF2D2D]">{pad(item.value)}</span>
            </div>
            <span className="mt-1 text-[9px] font-bold uppercase tracking-wider text-[#1a1a1a]/40">{item.label}</span>
          </div>
        ))}
      </div>
      <p className="mt-3 text-center text-xs text-[#1a1a1a]/50">
        Hold 50K+ $MAD for 12 hours after 1M MC to be eligible
      </p>
    </div>
  );
}

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
        @keyframes pulseFire {
          0%, 100% { box-shadow: 0 0 20px rgba(255,45,45,0.15); }
          50% { box-shadow: 0 0 40px rgba(255,45,45,0.3), 0 0 80px rgba(255,107,0,0.1); }
        }
        @keyframes trophyFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
      `}</style>

      <div className="relative mx-auto max-w-7xl px-4 pb-24 pt-8 sm:px-6 lg:px-8">
        {/* Banner Image */}
        <div className="mb-6 overflow-hidden rounded-[1.6rem] border border-white/5 shadow-[0_18px_50px_rgba(0,0,0,0.3)]">
          <Image
            src="/rewards-banner.png"
            alt="$MAD Rewards - Bigger Market Cap, Bigger Cash Giveaways"
            width={1200}
            height={400}
            className="w-full h-auto object-cover"
            priority
          />
        </div>

        {/* PHASE 1 VICTORY BANNER */}
        <div className="mb-6 overflow-hidden rounded-[1.6rem] border border-[#FF2D2D]/30 bg-[#FF2D2D]/[0.06] p-6 sm:p-8 text-center" style={{animation: 'pulseFire 3s ease-in-out infinite'}}>
          <div className="flex flex-col items-center gap-3">
            <div className="text-4xl" style={{animation: 'trophyFloat 2s ease-in-out infinite'}}>🏆</div>
            <p className="text-lg sm:text-xl font-black tracking-tight text-white">
              PHASE 1 <span className="text-[#FF2D2D]">COMPLETE</span>
            </p>
            <p className="text-sm font-black text-white/60 tracking-wider">
              $1,000,000 MARKET CAP <span className="text-emerald-400">ACHIEVED</span>
            </p>
            <div className="mt-2 flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5">
              <span className="relative flex h-2 w-2">
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">2.5M $MAD Distributed · 50 Winners Paid</span>
            </div>
            <p className="mt-1 text-[10px] text-white/30 uppercase tracking-widest">Phase 2 ($10M) Revealed Below · The Mission Continues</p>
          </div>
        </div>

        {/* Hero */}
        <SectionShell className="border-white/5 bg-white/[0.02] p-6 sm:p-10 lg:p-14">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.34em] text-[#FF2D2D]/60">
              Mission Control
            </p>
            <h1 className="mt-4 text-4xl font-black leading-[0.95] tracking-tight text-white sm:text-6xl">
              $MAD{" "}
              <span className="text-[#FF2D2D] drop-shadow-[0_0_20px_rgba(255,45,45,0.4)]">
                Rewards
              </span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-white/50 sm:text-lg">
              Loyalty gets rewarded. Holders who stay $MAD unlock exclusive perks,
              early access, and real-world benefits. The longer you hold, the more
              you earn.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Pill tone="red">Holder Benefits</Pill>
              <Pill tone="green">Early Access</Pill>
              <Pill>Exclusive Perks</Pill>
            </div>
          </div>
        </SectionShell>

        {/* ═══════════════════════════════════════════════════════════
            LIVE TRACKER — Reward Wallet (moved under hero)
            ═══════════════════════════════════════════════════════════ */}
        <section className="mt-8 overflow-hidden rounded-[2rem] border border-[#FF2D2D]/15 bg-[#111111] text-white shadow-[0_18px_50px_rgba(0,0,0,0.12)]">
          <div className="p-6 sm:p-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
                </span>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400">LIVE</span>
              </div>
              <span className="text-[10px] text-white/30 font-mono">AUTO-REFRESH 30s</span>
            </div>

            <div className="text-center">
              <p className="text-[11px] font-bold uppercase tracking-[0.34em] text-white/40">Reward Wallet Balance</p>
              <div className="mt-3 flex items-baseline justify-center gap-2">
                <span className="text-4xl sm:text-6xl font-black tracking-tight text-white">11,500,000</span>
                <span className="text-lg sm:text-2xl font-black text-[#FF2D2D]">$MAD</span>
              </div>
              <p className="mt-2 text-sm text-white/40">Remaining supply after Phase 1 distribution · 100% community funded</p>
            </div>

            <div className="mt-8 mx-auto max-w-2xl">
              <div className="rounded-[1.2rem] border border-white/10 bg-[#1a1a1a] p-5 sm:p-6">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-[0.34em] text-white/30 mb-1">Wallet Address</p>
                    <p className="text-sm font-mono text-white/60 truncate">FdWFKfUmyRFzusT4Gj77sKr1ArjJCHG7kTgw6pvbo9iW</p>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText("FdWFKfUmyRFzusT4Gj77sKr1ArjJCHG7kTgw6pvbo9iW");
                    }}
                    className="shrink-0 inline-flex items-center gap-1.5 rounded-full border border-[#FF2D2D]/30 bg-[#FF2D2D]/15 px-4 py-2 text-xs font-bold text-[#FF2D2D] transition hover:bg-[#FF2D2D]/25"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
                    Copy
                  </button>
                </div>
                <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FF2D2D]/15">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF2D2D" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
                  </div>
                  <div>
                    <p className="text-sm font-black text-white">Solana</p>
                    <p className="text-[10px] text-white/30">Verified on-chain</p>
                  </div>
                  <a
                    href="https://solscan.io/account/FdWFKfUmyRFzusT4Gj77sKr1ArjJCHG7kTgw6pvbo9iW"
                    target="_blank"
                    rel="noreferrer"
                    className="ml-auto inline-flex items-center gap-1 text-xs font-bold text-[#FF2D2D]/70 hover:text-[#FF2D2D] transition"
                  >
                    View on Solscan
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 bg-[#1a1a1a] px-6 py-3 flex items-center justify-between text-[10px] font-mono text-white/30">
            <span>Last updated: <span id="tracker-ts">just now</span></span>
            <span>Tracker v1.0</span>
          </div>
        </section>

        <script dangerouslySetInnerHTML={{__html: `
          (function(){
            const el = document.getElementById('tracker-ts');
            if(!el) return;
            const fmt = () => {
              const now = new Date();
              el.textContent = now.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit', second:'2-digit'});
            };
            fmt();
            setInterval(fmt, 30000);
          })();
        `}} />

        {/* ═══════════════════════════════════════════════════════════
            HOLDER VERIFICATION — Check if you qualify
            ═══════════════════════════════════════════════════════════ */}
        <SectionShell className="mt-8 p-6 sm:p-10">
          <div className="text-center mb-10">
            <p className="text-[11px] font-bold uppercase tracking-[0.34em] text-[#FF2D2D]/60">
              Are you $MAD enough?
            </p>
            <h2 className="mt-3 text-2xl font-black text-white sm:text-3xl">
              Holder <span className="text-[#FF2D2D]">Verification</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-white/50">
              Check if your wallet qualifies for the next giveaway. No wallet connection needed — just paste your address.
            </p>
          </div>
          <HolderVerification />
        </SectionShell>

        {/* ═══════════════════════════════════════════════════════════
            REWARD MILESTONES — Chart Ascending to $100M
            ═══════════════════════════════════════════════════════════ */}
        <SectionShell className="mt-8 p-6 sm:p-10">
          <div className="text-center mb-10">
            <p className="text-[11px] font-bold uppercase tracking-[0.34em] text-[#8B7355]">
              The Road Up
            </p>
            <h2 className="mt-3 text-2xl font-black text-white sm:text-3xl">
              Reward <span className="text-[#FF2D2D]">Milestones</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-white/50">
              Every milestone unlocks a reward. The chart only goes up — the question is how long you hold.
            </p>
            <p className="mx-auto mt-3 max-w-xl text-xs font-bold uppercase tracking-[0.2em] text-[#FF2D2D]/80">
              Market Cap tracked via DexScreener, not Pump.fun — $MAD 😡
            </p>
          </div>

          {/* Chart container */}
          <div className="relative max-w-3xl mx-auto">
            {/* Vertical line connecting milestones */}
            <div className="absolute left-[24px] sm:left-[32px] top-0 bottom-0 w-0.5 bg-white/5" />

            {/* === CURRENT POSITION === */}
            <div className="relative mb-8">
              <div className="absolute left-[18px] sm:left-[26px] top-5 z-10 h-3 w-3 rounded-full bg-[#FF6B00] ring-4 ring-[#FF6B00]/20 animate-pulse" />

              <div className="ml-14 sm:ml-20 rounded-[1.4rem] border border-[#FF6B00]/30 bg-[#FF6B00]/[0.04] p-5 sm:p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="inline-flex rounded-full bg-[#FF6B00]/10 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-[#FF6B00]">
                    Now
                  </span>
                  <p className="text-[11px] font-bold uppercase tracking-[0.34em] text-[#8B7355]">
                    Current Position
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <h3 className="text-xl font-black text-white">
                    $1M Market Cap
                  </h3>
                  <div className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1">
                    <span className="relative flex h-2 w-2">
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">Completed</span>
                  </div>
                </div>

                {/* Progress bar to $1M */}
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-white/40">Progress to $1M</span>
                    <span className="text-[10px] font-black text-emerald-400">100% ✅</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full rounded-full bg-emerald-500 w-full shadow-[0_0_10px_rgba(16,185,129,0.3)]" />
                  </div>
                </div>

                <p className="mt-3 text-xs text-white/40">
                  ✅ 1M Market Cap reached · 12-hour reward window closed · Winners paid
                </p>
              </div>
            </div>

            {/* === 1M — ACTIVE === */}
            <div className="relative mb-8">
              {/* Dot on the line */}
              <div className="absolute left-[18px] sm:left-[26px] top-6 z-10 h-3 w-3 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20" />
              
              <div className="ml-14 sm:ml-20 rounded-[1.4rem] border border-emerald-500/30 bg-[#0d1117] p-5 sm:p-6 shadow-[0_0_30px_rgba(16,185,129,0.08)]">
                <div className="flex items-center gap-3 mb-4">
                  <span className="inline-flex rounded-full bg-emerald-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-400">
                    Completed
                  </span>
                  <p className="text-[11px] font-bold uppercase tracking-[0.34em] text-[#8B7355]">
                    Phase 1
                  </p>
                </div>
                <h3 className="text-xl font-black text-white">
                  $1M Market Cap <span className="text-emerald-400">Completed</span>
                </h3>
                <p className="mt-2 text-sm text-white/50 leading-relaxed">
                  $MAD hit $1M market cap and held for <span className="font-bold text-white">12 hours</span>. 2.5M $MAD tokens distributed to 50 eligible holders. <span className="font-bold text-emerald-400">Reward window closed.</span>
                </p>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="rounded-xl border border-white/5 bg-white/[0.03] p-4">
                    <p className="text-2xl font-black text-[#FF2D2D]">50K</p>
                    <p className="text-xs font-bold text-white/70">$MAD Each</p>
                    <p className="mt-1 text-xs text-white/30">30 OG holders randomly selected</p>
                  </div>
                  <div className="rounded-xl border border-white/5 bg-white/[0.03] p-4">
                    <p className="text-2xl font-black text-[#FF2D2D]">50K</p>
                    <p className="text-xs font-bold text-white/70">$MAD Each</p>
                    <p className="mt-1 text-xs text-white/30">20 new holders randomly selected</p>
                  </div>
                </div>

                <div className="mt-4 rounded-xl border border-emerald-500/15 bg-emerald-500/[0.05] p-4">
                  <p className="text-xs font-bold text-emerald-400 mb-2">✅ Distribution Complete</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-white/40">
                    <p>✅ Hold at least <span className="font-bold text-white/70">50K $MAD</span></p>
                    <p>✅ Held for <span className="font-bold text-white/70">12 hours</span> after 1M MC</p>
                  </div>
                </div>

                <div className="mt-4 rounded-xl border border-white/5 bg-white/[0.02] p-4 text-center">
                  <p className="text-[10px] font-black uppercase tracking-[0.34em] text-[#8B7355]">Reward Distribution</p>
                  <p className="mt-1 text-sm font-bold text-emerald-400">Completed · Winners Paid</p>
                </div>
              </div>
            </div>

            {/* === 10M — LOCKED === */}
            <div className="relative mb-8">
              <div className="absolute left-[18px] sm:left-[26px] top-5 z-10 h-3 w-3 rounded-full bg-[#FF2D2D]/30 ring-4 ring-[#FF2D2D]/10" />
              
              <div className="ml-14 sm:ml-20 rounded-[1.4rem] border border-[#FF2D2D]/20 bg-[#FF2D2D]/[0.03] p-5 sm:p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="inline-flex rounded-full bg-[#FF2D2D]/10 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-[#FF2D2D]/60">
                    Locked
                  </span>
                  <p className="text-[11px] font-bold uppercase tracking-[0.34em] text-[#8B7355]/60">
                    Phase 2
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <h3 className="text-xl font-black text-white/70">
                    $10M Market Cap
                  </h3>
                </div>
                <p className="mt-2 text-sm text-white/40 leading-relaxed">
                  When $MAD hits $10M market cap, <span className="font-bold text-white/70">12.5K $MAD</span> (≈$250) distributed to <span className="font-bold text-white/70">80 eligible holders</span>.
                </p>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                    <p className="text-2xl font-black text-[#FF2D2D]/70">12.5K</p>
                    <p className="text-xs font-bold text-white/50">$MAD Each (~$250)</p>
                    <p className="mt-1 text-xs text-white/25">50 OG holders randomly selected</p>
                  </div>
                  <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                    <p className="text-2xl font-black text-[#FF2D2D]/70">12.5K</p>
                    <p className="text-xs font-bold text-white/50">$MAD Each (~$250)</p>
                    <p className="mt-1 text-xs text-white/25">30 new holders randomly selected</p>
                  </div>
                </div>

                <div className="mt-4 rounded-xl border border-[#FF2D2D]/10 bg-[#FF2D2D]/[0.02] p-4">
                  <p className="text-xs font-bold text-white/50 mb-2">Eligibility</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-white/25">
                    <p>🔒 Hold at least <span className="font-bold text-white/50">1K $MAD</span></p>
                    <p>🔒 Hold for <span className="font-bold text-white/50">24 hours</span> after $10M MC</p>
                  </div>
                </div>

                {/* Community Giveaway Tracker */}

              </div>
            </div>

            {/* === 25M — LOCKED === */}
            <div className="relative mb-8">
              <div className="absolute left-[18px] sm:left-[26px] top-5 z-10 h-3 w-3 rounded-full bg-[#1a1a1a]/20 ring-4 ring-[#1a1a1a]/5" />
              
              <div className="ml-14 sm:ml-20 rounded-[1.4rem] border border-[#1a1a1a]/10 bg-[#1a1a1a]/[0.02] p-5 sm:p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="inline-flex rounded-full bg-[#1a1a1a]/10 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-[#1a1a1a]/40">
                    Locked
                  </span>
                  <p className="text-[11px] font-bold uppercase tracking-[0.34em] text-[#1a1a1a]/30">
                    Phase 3
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <h3 className="text-xl font-black text-white/20">
                    $25M Market Cap
                  </h3>
                  <div className="h-10 w-10 rounded-full border border-white/5 bg-white/[0.02] flex items-center justify-center">
                    <span className="text-lg font-black text-white/20">?</span>
                  </div>
                </div>
                <p className="mt-2 text-sm text-white/20">
                  The rewards get serious. The community gets rewarded.
                </p>
              </div>
            </div>

            {/* === 50M — LOCKED === */}
            <div className="relative mb-8">
              <div className="absolute left-[18px] sm:left-[26px] top-5 z-10 h-3 w-3 rounded-full bg-white/10 ring-4 ring-white/5" />
              
              <div className="ml-14 sm:ml-20 rounded-[1.4rem] border border-white/5 bg-white/[0.02] p-5 sm:p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="inline-flex rounded-full bg-white/5 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white/30">
                    Locked
                  </span>
                  <p className="text-[11px] font-bold uppercase tracking-[0.34em] text-white/20">
                    Phase 4
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <h3 className="text-xl font-black text-white/20">
                    $50M Market Cap
                  </h3>
                  <div className="h-10 w-10 rounded-full border border-white/5 bg-white/[0.02] flex items-center justify-center">
                    <span className="text-lg font-black text-white/20">?</span>
                  </div>
                </div>
                <p className="mt-2 text-sm text-white/20">
                  Halfway to the dream. The reward reflects the journey.
                </p>
              </div>
            </div>

            {/* === 75M — LOCKED === */}
            <div className="relative mb-8">
              <div className="absolute left-[18px] sm:left-[26px] top-5 z-10 h-3 w-3 rounded-full bg-white/10 ring-4 ring-white/5" />
              
              <div className="ml-14 sm:ml-20 rounded-[1.4rem] border border-white/5 bg-white/[0.02] p-5 sm:p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="inline-flex rounded-full bg-white/5 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white/30">
                    Locked
                  </span>
                  <p className="text-[11px] font-bold uppercase tracking-[0.34em] text-white/20">
                    Phase 5
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <h3 className="text-xl font-black text-white/20">
                    $75M Market Cap
                  </h3>
                  <div className="h-10 w-10 rounded-full border border-white/5 bg-white/[0.02] flex items-center justify-center">
                    <span className="text-lg font-black text-white/20">?</span>
                  </div>
                </div>
                <p className="mt-2 text-sm text-white/20">
                  The community is massive. The reward is legendary.
                </p>
              </div>
            </div>

            {/* === 100M — LOCKED === */}
            <div className="relative">
              <div className="absolute left-[18px] sm:left-[26px] top-5 z-10 h-3 w-3 rounded-full bg-[#FF2D2D]/30 ring-4 ring-[#FF2D2D]/10" />
              
              <div className="ml-14 sm:ml-20 rounded-[1.4rem] border border-[#FF2D2D]/15 bg-[#FF2D2D]/[0.03] p-5 sm:p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="inline-flex rounded-full bg-[#FF2D2D]/10 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-[#FF2D2D]/40">
                    Final Goal
                  </span>
                  <p className="text-[11px] font-bold uppercase tracking-[0.34em] text-[#FF2D2D]/30">
                    Phase 6
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <h3 className="text-xl font-black text-[#FF2D2D]/30">
                    $100M Market Cap
                  </h3>
                  <div className="h-10 w-10 rounded-full border border-[#FF2D2D]/10 bg-[#FF2D2D]/[0.03] flex items-center justify-center">
                    <span className="text-lg font-black text-[#FF2D2D]/25">?</span>
                  </div>
                </div>
                <p className="mt-2 text-sm text-[#FF2D2D]/20">
                  The ultimate milestone. The ultimate reward. Are you $MAD enough to find out?
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-white/40">
              Didn't win a phase? No worries. The next milestone is always coming. <span className="font-bold text-[#FF2D2D]">Hold longer. Stay $MAD.</span>
            </p>
          </div>
        </SectionShell>

        {/* ═══════════════════════════════════════════════════════════
            COMPLETED CHALLENGES — Past Giveaways
            ═══════════════════════════════════════════════════════════ */}
        <SectionShell className="mt-8 p-6 sm:p-10">
          <div className="text-center mb-10">
            <p className="text-[11px] font-bold uppercase tracking-[0.34em] text-[#8B7355]">
              Completed
            </p>
            <h2 className="mt-3 text-2xl font-black text-[#1a1a1a] sm:text-3xl">
              Past <span className="text-[#FF2D2D]">Challenges</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-[#1a1a1a]/55">
              Real rewards. Real winners. Proof that $MAD delivers.
            </p>
          </div>

          <div className="rounded-[1.4rem] border border-[#FF2D2D]/15 bg-[#FF2D2D]/[0.03] p-5 sm:p-6 overflow-hidden">
            <div className="flex flex-col sm:flex-row items-start gap-5 sm:gap-8">
              {/* Video player */}
              <div className="relative w-full sm:w-56 shrink-0 aspect-[4/5] rounded-[1.2rem] overflow-hidden border border-[#1a1a1a]/10 bg-black">
                <video
                  src="/rewards/mad-health-competition.mp4"
                  controls
                  playsInline
                  className="w-full h-full object-cover"
                  poster="/mad-claw-hero.png"
                />
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="inline-flex rounded-full bg-[#FF2D2D]/10 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-[#FF2D2D]">
                    Completed
                  </span>
                  <span className="inline-flex rounded-full bg-emerald-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-600">
                    ✅ Winners Paid
                  </span>
                </div>

                <h3 className="text-xl font-black text-[#1a1a1a] leading-tight">
                  $MAD Health Competition
                </h3>
                <p className="mt-2 text-sm text-[#1a1a1a]/55 leading-relaxed">
                  The first-ever $MAD community challenge. Film yourself doing 20 pushups IRL. First 100 entries eligible. Winners announced June 6, 2026.
                </p>

                <div className="mt-4 grid grid-cols-3 gap-3">
                  <div className="rounded-xl border border-[#1a1a1a]/10 bg-[#F5F1E8] p-3 text-center">
                    <p className="text-lg font-black text-[#FF2D2D]">100</p>
                    <p className="text-[10px] font-bold text-[#1a1a1a]/60 uppercase">Eligible</p>
                  </div>
                  <div className="rounded-xl border border-[#1a1a1a]/10 bg-[#F5F1E8] p-3 text-center">
                    <p className="text-lg font-black text-[#FF2D2D]">50K</p>
                    <p className="text-[10px] font-bold text-[#1a1a1a]/60 uppercase">$MAD Each</p>
                  </div>
                  <div className="rounded-xl border border-[#1a1a1a]/10 bg-[#F5F1E8] p-3 text-center">
                    <p className="text-lg font-black text-[#FF2D2D]">20</p>
                    <p className="text-[10px] font-bold text-[#1a1a1a]/60 uppercase">Pushups</p>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <a
                    href="https://x.com/madrichclub_/status/2061871512991437267"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-[#FF2D2D]/30 bg-[#FF2D2D]/10 px-5 py-2.5 text-xs font-black text-[#FF2D2D] transition hover:bg-[#FF2D2D]/20"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                    View on X
                  </a>
                  <p className="text-[10px] text-[#1a1a1a]/40 font-mono">
                    Jun 2, 2026 · 12.5K views
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Challenge #2 — $MAD Rich Animal Challenge ── */}
          <div className="rounded-[1.4rem] border border-[#FF2D2D]/15 bg-[#FF2D2D]/[0.03] p-5 sm:p-6 overflow-hidden mt-6">
            <div className="flex flex-col sm:flex-row items-start gap-5 sm:gap-8">
              <div className="relative w-full sm:w-56 shrink-0 aspect-[4/5] rounded-[1.2rem] overflow-hidden border border-[#1a1a1a]/10 bg-[#1a1a1a]/5">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-5xl">🐕🐈</span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-[#1a1a1a]/60 backdrop-blur-sm">
                  <p className="text-[10px] font-black text-white uppercase tracking-wider">🎥 Watch on X</p>
                </div>
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="inline-flex rounded-full bg-[#FF2D2D]/10 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-[#FF2D2D]">
                    Completed
                  </span>
                  <span className="inline-flex rounded-full bg-emerald-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-600">
                    ✅ Winners Paid
                  </span>
                </div>

                <h3 className="text-xl font-black text-[#1a1a1a] leading-tight">
                  $MAD Rich Animal Challenge
                </h3>
                <p className="mt-2 text-sm text-[#1a1a1a]/55 leading-relaxed">
                  Show the world your pet is $MAD Rich. Post a photo of your animal with money on top, include your wallet address, and hold 5K $MAD tokens. Winners announced June 14, 2026.
                </p>

                <div className="mt-4 grid grid-cols-3 gap-3">
                  <div className="rounded-xl border border-[#1a1a1a]/10 bg-[#F5F1E8] p-3 text-center">
                    <p className="text-lg font-black text-[#FF2D2D]">5K</p>
                    <p className="text-[10px] font-bold text-[#1a1a1a]/60 uppercase">Hold $MAD</p>
                  </div>
                  <div className="rounded-xl border border-[#1a1a1a]/10 bg-[#F5F1E8] p-3 text-center">
                    <p className="text-lg font-black text-[#FF2D2D]">20K</p>
                    <p className="text-[10px] font-bold text-[#1a1a1a]/60 uppercase">$MAD Each</p>
                  </div>
                  <div className="rounded-xl border border-[#1a1a1a]/10 bg-[#F5F1E8] p-3 text-center">
                    <p className="text-lg font-black text-[#FF2D2D]">100</p>
                    <p className="text-[10px] font-bold text-[#1a1a1a]/60 uppercase">Eligible</p>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <a
                    href="https://x.com/madrichclub_/status/2065002932349931857"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-[#FF2D2D]/30 bg-[#FF2D2D]/10 px-5 py-2.5 text-xs font-black text-[#FF2D2D] transition hover:bg-[#FF2D2D]/20"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                    View on X
                  </a>
                  <p className="text-[10px] text-[#1a1a1a]/40 font-mono">
                    Jun 11, 2026 · 11.3K views
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-[#1a1a1a]/55">
              More challenges coming. <span className="font-bold text-[#FF2D2D]">Stay active. Stay $MAD.</span>
            </p>
          </div>
        </SectionShell>

        {/* Thank You — The MAD Fam Behind the Concept */}
        <SectionShell className="mt-8 p-6 sm:p-10">
          <div className="text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.34em] text-[#8B7355]">
              The MAD Fam
            </p>
            <h2 className="mt-3 text-2xl font-black text-[#1a1a1a] sm:text-3xl">
              Thank <span className="text-[#FF2D2D]">You</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-8 text-[#1a1a1a]/55">
              The $MAD Rewards concept was born from the community. These two holders saw the vision and helped build it from the ground up.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[
              {
                name: "crypto guru",
                handle: "@followdv80",
                image: "/rewards/crypto-guru-followdv80.png",
                href: "https://x.com/followdv80",
              },
              {
                name: "Perspective 360",
                handle: "@Derrick152667",
                image: "/rewards/perspective-360-derrick152667.png",
                href: "https://x.com/Derrick152667",
              },
            ].map((person) => (
              <a
                key={person.handle}
                href={person.href}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-4 rounded-[1.4rem] border border-[#1a1a1a]/10 bg-white p-5 transition-all hover:border-[#FF2D2D]/20"
              >
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border border-[#1a1a1a]/10">
                  <Image
                    src={person.image}
                    alt={person.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                    sizes="64px"
                  />
                </div>
                <div>
                  <p className="text-base font-black text-[#1a1a1a]">{person.name}</p>
                  <p className="text-sm text-[#1a1a1a]/50">{person.handle}</p>
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-[#FF2D2D]/70">
                    Concept Creator
                  </p>
                </div>
                <div className="ml-auto text-[#1a1a1a]/30 transition-colors group-hover:text-[#FF2D2D]">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </div>
              </a>
            ))}
          </div>
        </SectionShell>

        {/* CTA */}
        <SectionShell className="mt-8 overflow-hidden p-0">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="flex flex-col justify-center p-6 sm:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#FF2D2D]/60">
                Get Started
              </p>
              <h2 className="mt-4 text-3xl font-black leading-[0.95] text-[#1a1a1a] sm:text-4xl">
                Join the $MAD Movement
              </h2>
              <p className="mt-5 max-w-xl text-base leading-8 text-[#1a1a1a]/55">
                Hold $MAD. Stay $MAD. Get rewarded. The program launches soon —
                position yourself now.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="https://jup.ag/swap?sell=So11111111111111111111111111111111111111112&buy=Fa7ZE9nCEYnrHsnoeHuhEExJpchtrBtKXnWe6CgHpump"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex rounded-full border border-[#FF2D2D]/40 bg-[#FF2D2D] px-7 py-4 text-base font-black text-white transition hover:scale-[1.02] hover:bg-[#FF6B00]"
                >
                  Buy $MAD →
                </a>
                <a
                  href="https://t.me/MadRichClub"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex rounded-full border border-[#1a1a1a]/15 bg-[#1a1a1a]/[0.02] px-7 py-4 text-base font-black text-[#1a1a1a]/75 transition hover:border-[#1a1a1a]/20 hover:bg-[#1a1a1a]/[0.04]"
                >
                  Join Telegram
                </a>
              </div>
            </div>
            <div className="relative min-h-[280px] sm:min-h-[360px] lg:min-h-full">
              <Image
                src="/mad.png"
                alt="$MAD Logo"
                fill
                className="object-contain p-10"
              />
            </div>
          </div>
        </SectionShell>
      </div>
    </div>
  );
}
