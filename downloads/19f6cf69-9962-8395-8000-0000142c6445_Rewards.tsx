import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import PageShell from "@/components/PageShell";
import Reveal from "@/components/Reveal";
import CountUp from "@/components/CountUp";
import { REWARD_WALLET, REWARD_ROAD, PAST_CHALLENGES } from "@/lib/pages-data";
import { LINKS } from "@/lib/data";
import { cn } from "@/lib/utils";

function WalletCheck() {
  const [addr, setAddr] = useState("");
  const [state, setState] = useState<"idle" | "invalid" | "ok">("idle");

  const check = () => {
    const v = addr.trim();
    if (/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(v)) setState("ok");
    else setState("invalid");
  };

  return (
    <div className="rounded-3xl border border-white/8 bg-panel p-8">
      <span className="text-3xl">🔍</span>
      <h3 className="mt-3 font-display text-2xl uppercase text-bone">Check Your Wallet</h3>
      <p className="mt-2 text-sm text-ash">
        Paste your Solana address. Read-only — no connection, nothing signed, nothing sent.
      </p>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <input
          value={addr}
          onChange={(e) => { setAddr(e.target.value); setState("idle"); }}
          placeholder="Your Solana wallet address"
          className="flex-1 rounded-full border border-white/10 bg-black/40 px-5 py-3 font-mono text-sm text-bone outline-none focus:border-mad/60"
        />
        <button
          onClick={check}
          className="rounded-full bg-mad px-7 py-3 text-sm font-bold uppercase tracking-wider text-white transition-all hover:scale-105 hover:shadow-glow"
        >
          Check My Wallet
        </button>
      </div>
      <AnimatePresence>
        {state === "invalid" && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-4 font-mono text-sm text-mad-bright">
            ⚠️ That doesn't look like a valid Solana address. Double-check and try again.
          </motion.p>
        )}
        {state === "ok" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-4 rounded-2xl border border-green-500/30 bg-green-500/[0.06] p-4">
            <p className="font-mono text-sm text-green-400">✓ Valid address format.</p>
            <p className="mt-1 text-sm text-ash">
              Verify your $MAD balance directly on-chain — you need{" "}
              <span className="font-bold text-bone">1,000 $MAD minimum</span> to be eligible.{" "}
              <a
                href={`https://solscan.io/account/${addr.trim()}`}
                target="_blank"
                rel="noreferrer"
                className="text-mad-bright underline decoration-mad/40 underline-offset-4 hover:text-bone"
              >
                View holdings on Solscan ↗
              </a>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Rewards() {
  const [copied, setCopied] = useState(false);
  const copyWallet = async () => {
    try { await navigator.clipboard.writeText(REWARD_WALLET); } catch { /* noop */ }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <PageShell
      eyebrow="✅ Phase 1 Done — 50 Paid · 🎯 Phase 2 Active"
      title={<>$MAD <span className="text-mad">Rewards</span></>}
      sub="100% community funded. Zero dev allocation. The pool sits on-chain, waiting for the FAM."
    >
      {/* eligibility + pool */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Reveal>
          <div className="h-full rounded-3xl border border-mad/35 bg-mad/[0.05] p-8">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-mad">⚠️ Eligibility Requirement</p>
            <p className="mt-3 font-display text-4xl text-bone">
              Hold <span className="text-mad">1,000 $MAD</span>
            </p>
            <p className="mt-2 text-sm text-ash">Minimum. No exceptions. Check your wallet below.</p>
            <a
              href={LINKS.buy}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-block rounded-full bg-mad px-7 py-3 text-sm font-bold uppercase tracking-wider text-white shadow-glow-sm transition-all hover:scale-105 hover:shadow-glow"
            >
              Buy $MAD →
            </a>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="h-full rounded-3xl border border-white/8 bg-panel p-8">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-mad">🎁 Rewards Pool</p>
            <p className="mt-3 font-display text-4xl text-bone sm:text-5xl">
              <CountUp value={12_000_000} /> <span className="text-mad">$MAD</span>
            </p>
            <p className="mt-2 text-sm text-ash">Sitting in the reward wallet, waiting for the community.</p>
            <div className="mt-4 flex flex-wrap items-center gap-2 font-mono text-xs">
              <span className="rounded-full border border-white/10 bg-black/40 px-4 py-2 text-ash">
                {REWARD_WALLET.slice(0, 10)}...{REWARD_WALLET.slice(-8)}
              </span>
              <button onClick={copyWallet} className="rounded-full border border-white/10 px-4 py-2 text-ash transition-all hover:border-mad/50 hover:text-bone">
                {copied ? "✓ Copied" : "Copy"}
              </button>
              <a
                href={`https://solscan.io/account/${REWARD_WALLET}`}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-green-500/30 px-4 py-2 text-green-400 transition-all hover:bg-green-500/10"
              >
                Verify on Solscan ↗
              </a>
            </div>
          </div>
        </Reveal>
      </div>

      {/* phase chips */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Reveal>
          <div className="rounded-2xl border border-green-500/30 bg-green-500/[0.05] p-5 text-center">
            <p className="font-display text-3xl text-green-400">50</p>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.25em] text-ash">Winners Paid · Phase 1 · $1M MC</p>
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <div className="rounded-2xl border border-mad/30 bg-mad/[0.05] p-5 text-center">
            <p className="font-display text-3xl text-mad-bright">80</p>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.25em] text-ash">Spots Open · Phase 2 · $10M MC</p>
          </div>
        </Reveal>
      </div>

      {/* the road up */}
      <Reveal className="mt-16">
        <h2 className="text-center font-display text-3xl uppercase text-bone sm:text-4xl">
          The Road <span className="text-mad">Up</span>
        </h2>
      </Reveal>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {REWARD_ROAD.map((r, i) => (
          <Reveal key={r.mcap} delay={i * 0.06}>
            <div
              className={cn(
                "relative overflow-hidden rounded-3xl border p-6",
                r.status === "done" && "border-green-500/35 bg-green-500/[0.05]",
                r.status === "next" && "border-mad/50 bg-mad/[0.07] shadow-glow-sm",
                r.status === "locked" && "border-white/8 bg-panel opacity-70",
              )}
            >
              <div className="flex items-center justify-between">
                <p className="font-display text-3xl text-bone">{r.mcap}</p>
                <span className={cn(
                  "rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-widest",
                  r.status === "done" && "border-green-500/40 text-green-400",
                  r.status === "next" && "border-mad/50 text-mad-bright",
                  r.status === "locked" && "border-white/15 text-ash",
                )}>
                  {r.status === "done" ? "✓ Done" : r.status === "next" ? "▶ Next" : "🔒 Locked"}
                </span>
              </div>
              <p className={cn("mt-3 font-mono text-xl font-bold", r.status === "locked" ? "text-ash" : "text-mad-bright")}>
                {r.usd} <span className="text-xs text-ash">USD</span>
              </p>
              <p className="mt-1 text-xs text-ash">{r.note}</p>
            </div>
          </Reveal>
        ))}
      </div>

      {/* wallet check */}
      <Reveal className="mt-14">
        <WalletCheck />
      </Reveal>

      {/* past challenges */}
      <Reveal className="mt-16">
        <h2 className="text-center font-display text-3xl uppercase text-bone sm:text-4xl">
          Past <span className="text-mad">Challenges</span>
        </h2>
      </Reveal>
      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {PAST_CHALLENGES.map((c, i) => (
          <Reveal key={c.name} delay={i * 0.08}>
            <a href={c.post} target="_blank" rel="noreferrer" className="block rounded-3xl border border-white/8 bg-panel p-7 transition-all duration-500 hover:border-mad/40 hover:shadow-glow-sm">
              <div className="flex items-center justify-between">
                <span className="rounded-full border border-green-500/40 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-green-400">✅ Paid · {c.date}</span>
                <span className="text-ash">↗</span>
              </div>
              <h3 className="mt-4 font-display text-xl uppercase text-bone">{c.name}</h3>
              <p className="mt-2 text-sm text-ash">{c.note}</p>
            </a>
          </Reveal>
        ))}
      </div>
    </PageShell>
  );
}
