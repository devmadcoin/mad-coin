import { useState, useMemo } from "react";
import PageShell from "@/components/PageShell";
import Reveal from "@/components/Reveal";
import { REWARD_MILESTONES, REWARD_WALLET } from "@/lib/pages-data";
import { LINKS } from "@/lib/data";
import { cn } from "@/lib/utils";

/* ═══════════════════════════════════════════
   HOLDER VERIFICATION
   ═══════════════════════════════════════════ */

const MAD_MINT = "Fa7ZE9nCEYnrHsnoeHuhEExJpchtrBtKXnWe6CgHpump";
const SOLANA_RPC = "https://api.mainnet-beta.solana.com";

async function rpc(method: string, params: unknown[]) {
  const res = await fetch(SOLANA_RPC, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message || "RPC error");
  return data.result;
}

async function getTokenBalance(addr: string): Promise<number> {
  const result = await rpc("getTokenAccountsByOwner", [
    addr,
    { mint: MAD_MINT },
    { encoding: "jsonParsed" },
  ]);
  if (!result?.value?.length) return 0;
  return result.value[0].account.data.parsed.info.tokenAmount.uiAmount || 0;
}

async function getFirstHoldDate(addr: string): Promise<Date | null> {
  const accounts = await rpc("getTokenAccountsByOwner", [
    addr,
    { mint: MAD_MINT },
    { encoding: "jsonParsed" },
  ]);
  if (!accounts?.value?.length) return null;
  const tokenAccount = accounts.value[0].pubkey;
  const sigs = await rpc("getSignaturesForAddress", [
    tokenAccount,
    { limit: 1000, commitment: "confirmed" },
  ]);
  if (!sigs?.length) return null;
  const oldest = sigs[sigs.length - 1];
  if (!oldest.blockTime) return null;
  return new Date(oldest.blockTime * 1000);
}

function formatBalance(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(2) + "M MAD";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K MAD";
  return n.toFixed(0) + " MAD";
}

function HolderVerification() {
  const [wallet, setWallet] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    balance: number;
    firstHeld: Date | null;
    qualified: boolean;
    category: string;
    categoryLabel: string;
  } | null>(null);
  const [error, setError] = useState("");

  const config = useMemo(() => ({
    minBalance: 1000,
    oldCutoff: new Date("2026-05-01T00:00:00Z"),
    newCutoff: new Date("2026-07-31T23:59:59Z"),
  }), []);

  async function verify() {
    setError("");
    setResult(null);
    if (!wallet || wallet.length < 32) {
      setError("Please enter a valid Solana wallet address.");
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
      let category = "invalid";
      let categoryLabel = "Too Late";
      if (isOld) { category = "old"; categoryLabel = "Old Holder"; }
      else if (isNew) { category = "new"; categoryLabel = "New Holder"; }
      const qualified = balance >= config.minBalance && (isOld || isNew);
      setResult({ balance, firstHeld, qualified, category, categoryLabel });
    } catch (err) {
      setError(`Failed to verify: ${err instanceof Error ? err.message : "Unknown error"}.`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 rounded-2xl border border-mad/30 bg-mad/[0.04] p-4">
        <p className="text-sm text-ash">
          <span className="font-bold text-mad-bright">50 old + 30 new holders</span> rewarded at 10M MC. Min:{" "}
          <span className="font-bold text-mad-bright">1,000 $MAD</span>.
        </p>
      </div>

      <div className="rounded-2xl border border-white/8 bg-panel p-5 sm:p-6">
        <label className="block font-mono text-[11px] uppercase tracking-wider text-ash">Solana Wallet</label>
        <input
          type="text"
          value={wallet}
          onChange={(e) => setWallet(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && verify()}
          placeholder="Paste wallet address..."
          className="mt-2 w-full rounded-full border border-white/10 bg-black/40 px-5 py-3 font-mono text-sm text-bone outline-none placeholder:text-ash/30 focus:border-mad/60"
        />
        <button
          onClick={verify}
          disabled={loading}
          className="mt-4 w-full rounded-full bg-mad px-6 py-3 text-sm font-bold text-white transition hover:bg-mad-bright disabled:bg-white/10 disabled:cursor-not-allowed"
        >
          {loading ? "Checking on-chain..." : "Check My Wallet"}
        </button>
        <p className="mt-2 text-center font-mono text-[10px] text-ash/50">Read-only. Nothing is signed or sent.</p>
      </div>

      {error && (
        <div className="mt-3 rounded-xl border border-mad/20 bg-mad/[0.04] p-3">
          <p className="font-mono text-xs font-bold text-mad-bright">{error}</p>
        </div>
      )}

      {loading && (
        <div className="mt-6 text-center">
          <div className="mb-2 flex justify-center gap-2">
            {[0, 0.2, 0.4].map((d) => (
              <span key={d} className="h-2 w-2 animate-bounce rounded-full bg-mad" style={{ animationDelay: `${d}s` }} />
            ))}
          </div>
          <p className="font-mono text-[10px] text-ash">Checking on-chain...</p>
        </div>
      )}

      {result && (
        <div className={cn(
          "mt-6 rounded-2xl border border-white/5 bg-panel overflow-hidden",
          result.qualified ? "border-l-4 border-l-green-500" : "border-l-4 border-l-mad",
        )}>
          <div className="flex items-center gap-3 p-5">
            <span className="text-2xl">{result.qualified ? "✅" : "❌"}</span>
            <div>
              <p className={cn("font-black", result.qualified ? "text-green-400" : "text-mad-bright")}>
                {result.qualified ? "Qualified" : "Not Qualified"}
              </p>
              <p className="font-mono text-[10px] text-ash">
                {result.qualified ? "Wallet meets requirements" : "Does not qualify for this giveaway"}
              </p>
            </div>
          </div>
          <div className="px-5 pb-5">
            <div className="space-y-2 text-sm">
              {[
                { label: "Balance", value: formatBalance(result.balance) },
                { label: "Holding Since", value: result.firstHeld ? result.firstHeld.toLocaleDateString() : "Unknown" },
                { label: "Minimum", value: "1,000 MAD" },
                { label: "Category", value: result.categoryLabel },
              ].map((s) => (
                <div key={s.label} className="flex justify-between border-b border-white/5 py-1 last:border-0">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-ash">{s.label}</span>
                  <span className="font-mono font-bold text-bone">{s.value}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 rounded-lg bg-black/30 p-3 text-xs text-ash">
              {result.qualified && result.category === "old"
                ? "Old Holder — in pool of 50. Winners picked at 10M MC."
                : result.qualified && result.category === "new"
                  ? "New Holder — in pool of 30. Winners picked at 10M MC."
                  : result.balance === 0
                    ? "No $MAD found. Buy at least 1,000 MAD to qualify."
                    : "Need 1,000 MAD minimum."}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════ */

export default function Rewards() {
  return (
    <>
      <div className="relative h-[300px] overflow-hidden sm:h-[380px]">
        <img src="/assets/rewards-banner.png" alt="$MAD Rewards" className="h-full w-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-transparent to-ink" />
      </div>

      <PageShell
        eyebrow="Rewards Program"
        title={
          <>
            $MAD{" "}
            <span className="text-mad">Rewards</span>
          </>
        }
        sub="12M $MAD in the reward pool. Sitting on-chain, waiting for the community. 100% community funded. Zero dev allocation."
      >
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          <span className="rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-green-400">
            ✅ Phase 1 Done — 50 Paid
          </span>
          <span className="rounded-full border border-mad/20 bg-mad/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-mad-bright">
            🎯 Phase 2 Active — $10M Target
          </span>
        </div>

        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-mad/25 bg-panel p-8 text-center shadow-glow-sm">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(234,32,34,0.12),transparent_70%)]" />
            <div className="relative">
              <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-mad/70">🎁 Rewards Pool</p>
              <p className="mt-2 font-display text-6xl font-black tracking-tighter text-bone sm:text-8xl">
                12,000,000
              </p>
              <p className="mt-2 font-display text-2xl font-black text-mad sm:text-3xl">$MAD</p>
              <p className="mx-auto mt-3 max-w-md text-sm text-ash">
                Sitting in the reward wallet, waiting for the community. 100% community funded. Zero
                dev allocation.
              </p>
              <div className="mt-5 flex items-center justify-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
                </span>
                <span className="font-mono text-[10px] uppercase tracking-wider text-green-400">Live on-chain</span>
              </div>

              <div className="mx-auto mt-6 max-w-lg rounded-xl border border-white/10 bg-black/40 p-4">
                <p className="font-mono text-[10px] uppercase tracking-wider text-ash">Public Reward Wallet</p>
                <div className="mt-2 flex items-center gap-2">
                  <code className="flex-1 truncate font-mono text-xs text-ash">{REWARD_WALLET}</code>
                  <button
                    onClick={() => navigator.clipboard.writeText(REWARD_WALLET)}
                    className="shrink-0 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 font-mono text-[10px] text-ash transition hover:text-bone"
                  >
                    Copy
                  </button>
                </div>
                <a
                  href={`https://solscan.io/account/${REWARD_WALLET}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-block font-mono text-[10px] text-mad/70 transition hover:text-mad"
                >
                  Verify on Solscan →
                </a>
              </div>
            </div>
          </div>
        </Reveal>

        <div className="mt-8 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-green-500/20 bg-green-500/[0.04] p-5 text-center">
            <p className="font-display text-3xl font-black text-green-400">50</p>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-green-400/60">Winners Paid</p>
            <p className="mt-1 font-mono text-[10px] text-ash/50">Phase 1 · $1M MC</p>
          </div>
          <div className="rounded-2xl border border-mad/20 bg-mad/[0.04] p-5 text-center">
            <p className="font-display text-3xl font-black text-mad-bright">80</p>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-mad/60">Spots Open</p>
            <p className="mt-1 font-mono text-[10px] text-ash/50">Phase 2 · $10M MC</p>
          </div>
        </div>

        <div className="mt-16">
          <Reveal>
            <h2 className="text-center font-display text-2xl uppercase text-bone">The Road Up</h2>
          </Reveal>
          <div className="relative mx-auto mt-8 max-w-xl">
            <div className="absolute bottom-2 left-3 top-2 w-0.5 bg-white/5 sm:left-4" />
            {REWARD_MILESTONES.map((m, i) => (
              <Reveal key={m.mc} delay={i * 0.06}>
                <div className="relative mb-5 flex items-start gap-4 last:mb-0">
                  <div
                    className={cn(
                      "relative z-10 mt-1 h-2.5 w-2.5 shrink-0 rounded-full",
                      m.status === "done" && "bg-green-500 ring-4 ring-green-500/20",
                      m.status === "active" && "animate-pulse bg-mad ring-4 ring-mad/20",
                      m.status === "locked" && "bg-white/10 ring-4 ring-white/5",
                    )}
                  />
                  <div
                    className={cn(
                      "flex-1 rounded-xl border p-4",
                      m.status === "done" && "border-green-500/20 bg-green-500/[0.03]",
                      m.status === "active" && "border-mad/20 bg-mad/[0.03]",
                      m.status === "locked" && "border-white/5 bg-white/[0.02] opacity-50",
                    )}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-black text-bone">{m.mc}</span>
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider",
                          m.status === "done" && "bg-green-500/10 text-green-400",
                          m.status === "active" && "bg-mad/10 text-mad-bright",
                          m.status === "locked" && "bg-white/5 text-ash",
                        )}
                      >
                        {m.status === "done" ? "Done" : m.status === "active" ? "Next" : "Locked"}
                      </span>
                    </div>
                    {m.status !== "locked" && (
                      <div className="mb-1">
                        <span className="font-mono text-lg font-black text-mad-bright">{m.usd}</span>
                        <span className="ml-1 font-mono text-[10px] uppercase tracking-wider text-ash">USD</span>
                      </div>
                    )}
                    <p className="text-xs text-ash">
                      {m.status === "done"
                        ? `${m.reward} · ${m.winners} winners paid`
                        : m.status === "active"
                          ? `${m.reward} ready · ${m.winners} winners · Min 1K $MAD`
                          : "Reward TBA"}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="mt-16">
          <Reveal>
            <div className="rounded-2xl border border-mad/30 bg-mad/[0.06] p-6 text-center">
              <p className="flex items-center justify-center gap-2 text-sm font-black uppercase tracking-wider text-mad">
                ⚠️ Eligibility Requirement
              </p>
              <p className="mt-2 font-display text-3xl font-black text-bone sm:text-4xl">
                Hold{" "}
                <span className="text-mad">1,000 $MAD</span> Minimum
              </p>
              <p className="mt-2 text-sm text-ash">No exceptions. Check your wallet below.</p>
            </div>
          </Reveal>
        </div>

        <div className="mt-8 text-center">
          <a
            href={LINKS.buy}
            target="_blank"
            rel="noreferrer"
            className="inline-flex rounded-full bg-mad px-7 py-3 text-sm font-bold text-white transition hover:scale-[1.02]"
          >
            Buy $MAD →
          </a>
        </div>

        <div className="mt-16">
          <Reveal>
            <div className="rounded-3xl border border-white/8 bg-panel p-6 sm:p-8">
              <div className="mb-6 text-center">
                <h2 className="font-display text-xl font-black text-bone">Check Your Wallet</h2>
                <p className="mt-1 text-sm text-ash">Paste your address. No connection needed.</p>
              </div>
              <HolderVerification />
            </div>
          </Reveal>
        </div>

        <div className="mt-16">
          <Reveal>
            <h2 className="text-center font-display text-xl font-black text-bone">Past Challenges</h2>
          </Reveal>
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Reveal>
              <a
                href="https://x.com/madrichclub_/status/2061871512991437267"
                target="_blank"
                rel="noreferrer"
                className="block rounded-xl border border-white/5 bg-white/[0.02] p-4 transition hover:border-mad/20"
              >
                <div className="mb-2 flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-green-400">✅ Paid</span>
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-ash">Jun 2026</span>
                </div>
                <p className="text-sm font-bold text-bone">$MAD Health Competition</p>
                <p className="text-xs text-ash">20 pushups · 50K $MAD each</p>
              </a>
            </Reveal>
            <Reveal>
              <a
                href="https://x.com/madrichclub_/status/2065002932349931857"
                target="_blank"
                rel="noreferrer"
                className="block rounded-xl border border-white/5 bg-white/[0.02] p-4 transition hover:border-mad/20"
              >
                <div className="mb-2 flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-green-400">✅ Paid</span>
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-ash">Jun 2026</span>
                </div>
                <p className="text-sm font-bold text-bone">$MAD Rich Animal Challenge</p>
                <p className="text-xs text-ash">Pet + cash · 20K $MAD each</p>
              </a>
            </Reveal>
          </div>
        </div>
      </PageShell>
    </>
  );
}
