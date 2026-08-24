import PageShell from "@/components/PageShell";
import Reveal from "@/components/Reveal";
import CountUp from "@/components/CountUp";
import TiltCard from "@/components/TiltCard";
import { COMMUNITIES, IMPACT_STATS } from "@/lib/pages-data";
import { LINKS } from "@/lib/data";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function Community() {
  const [filter, setFilter] = useState<"all" | "recent" | "biggest">("all");

  const sorted = [...COMMUNITIES].sort((a, b) => {
    if (filter === "recent") return new Date(b.date).getTime() - new Date(a.date).getTime();
    if (filter === "biggest") return b.amountUSD - a.amountUSD;
    return 0;
  });

  return (
    <>
      <div className="relative h-[300px] overflow-hidden sm:h-[380px]">
        <img src="/mad-ai-banner.png" alt="$MAD Community" className="h-full w-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-transparent to-ink" />
      </div>

      <PageShell
        eyebrow="On-Chain Proof"
        title={
          <>
            Community{" "}
            <span className="text-mad">Impact</span>
          </>
        }
        sub="$MAD doesn't just extract — it distributes. Every community supported, every token donated, every act of conviction is recorded on-chain for anyone to verify."
      >
        <Reveal>
          <div className="mb-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-2xl border border-white/8 bg-panel p-5 text-center">
              <p className="font-display text-3xl text-mad">{IMPACT_STATS.communitiesSupported}</p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.25em] text-ash">Communities Supported</p>
            </div>
            <div className="rounded-2xl border border-white/8 bg-panel p-5 text-center">
              <p className="font-display text-3xl text-mad">${IMPACT_STATS.totalDonatedUSD.toLocaleString()}</p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.25em] text-ash">Total Donated</p>
            </div>
            <div className="rounded-2xl border border-white/8 bg-panel p-5 text-center">
              <p className="font-display text-3xl text-mad">
                <CountUp value={IMPACT_STATS.totalTokensDonated / 1_000_000} suffix="M" />
              </p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.25em] text-ash">$MAD Tokens Given</p>
            </div>
            <div className="rounded-2xl border border-white/8 bg-panel p-5 text-center">
              <p className="font-display text-3xl text-mad">
                <CountUp value={IMPACT_STATS.tokensBurned / 1_000_000} suffix="M" />
              </p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.25em] text-ash">Tokens Burned</p>
            </div>
          </div>
        </Reveal>

        <Reveal>
          <div className="text-center">
            <a
              href={IMPACT_STATS.onChainProof}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-6 py-3 text-sm font-bold text-green-400 transition hover:bg-green-500/20"
            >
              🔗 Verify On-Chain
            </a>
          </div>
        </Reveal>

        <div className="mt-20">
          <Reveal>
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-ash">Verified Impact</p>
                <h2 className="mt-2 font-display text-3xl uppercase text-bone sm:text-4xl">
                  Communities <span className="text-mad">Supported</span>
                </h2>
              </div>
              <div className="flex gap-2">
                {(["all", "recent", "biggest"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={cn(
                      "rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition",
                      filter === f
                        ? "bg-mad text-white"
                        : "border border-white/10 text-ash hover:border-white/20 hover:text-bone",
                    )}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </Reveal>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sorted.map((c, i) => (
              <Reveal key={c.txHash} delay={i * 0.05}>
                <TiltCard className="rounded-2xl" max={4}>
                  <div className="flex h-full flex-col rounded-2xl border border-white/8 bg-panel p-5 transition-colors hover:border-white/12">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={c.logo}
                          alt={c.name}
                          className="h-12 w-12 rounded-xl border border-white/10 object-cover"
                          loading="lazy"
                        />
                        <div>
                          <p className="font-bold text-bone">{c.name}</p>
                          {c.handle && <p className="font-mono text-xs text-ash">{c.handle}</p>}
                        </div>
                      </div>
                      <span className="rounded-full border border-white/5 bg-white/[0.02] px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-ash">
                        {c.platform}
                      </span>
                    </div>
                    <p className="mt-4 flex-1 text-sm leading-relaxed text-ash">{c.description}</p>
                    <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-4">
                      <div>
                        <p className="font-mono text-lg font-bold text-mad-bright">${c.amountUSD.toLocaleString()}</p>
                        <p className="font-mono text-[10px] text-ash">
                          {(c.tokenAmount / 1_000_000).toFixed(2)}M {c.tokenSymbol}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {c.xPost && (
                          <a
                            href={c.xPost}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-ash transition hover:bg-white/5 hover:text-bone"
                          >
                            𝕏 Post
                          </a>
                        )}
                        <a
                          href={`https://app.streamflow.finance/contract/solana/mainnet/${c.txHash}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-green-400 transition hover:bg-green-500/20"
                        >
                          🔗 Verify
                        </a>
                      </div>
                    </div>
                  </div>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="mt-20">
          <Reveal>
            <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-ash">Dev Commitment</p>
            <h2 className="mt-2 font-display text-3xl uppercase text-bone sm:text-4xl">
              <span className="text-green-400">100M $MAD</span> Locked
            </h2>
            <p className="mt-2 font-mono text-lg font-bold text-ash">$472,348 · Non-cancelable until Dec 2026</p>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mt-8 rounded-3xl border border-green-500/20 bg-green-500/[0.03] p-6 sm:p-8">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="rounded-2xl border border-white/5 bg-black/30 p-4 text-center">
                  <p className="font-mono text-lg font-bold text-bone">100M</p>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-ash">$MAD Locked</p>
                </div>
                <div className="rounded-2xl border border-white/5 bg-black/30 p-4 text-center">
                  <p className="font-mono text-lg font-bold text-green-400">$472K</p>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-ash">Current Value</p>
                </div>
                <div className="rounded-2xl border border-white/5 bg-black/30 p-4 text-center">
                  <p className="font-mono text-lg font-bold text-bone">Jun 5</p>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-ash">Lock Date</p>
                </div>
                <div className="rounded-2xl border border-white/5 bg-black/30 p-4 text-center">
                  <p className="font-mono text-lg font-bold text-mad-bright">Dec 4</p>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-ash">Unlock Date</p>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="https://app.streamflow.finance/contract/solana/mainnet/2Qg5Ugf2eH12ry9w3StU9sMvo5biuruK7ob2sni2Yref"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-6 py-3 text-sm font-bold text-green-400 transition hover:bg-green-500/20"
                >
                  🔗 Verify on Streamflow
                </a>
                <a
                  href="https://x.com/madrichclub_/status/2062897412516217028"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-6 py-3 text-sm font-bold text-ash transition hover:bg-white/5 hover:text-bone"
                >
                    𝕏 Announcement
                </a>
              </div>
            </div>
          </Reveal>
        </div>

        <div className="mt-20 text-center">
          <Reveal>
            <div className="rounded-3xl border border-mad/20 bg-mad/[0.03] p-8 sm:p-12">
              <h2 className="font-display text-3xl uppercase text-bone sm:text-4xl">
                Be Part of the <span className="text-mad">Impact</span>
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-ash">
                Every holder strengthens the community. Every community strengthens the mission. Hold
                $MAD. Support the movement. Watch the ripple effect.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <a
                  href="/rewards"
                  className="inline-flex rounded-full bg-mad px-8 py-4 text-base font-bold uppercase tracking-wider text-white shadow-glow transition-all hover:scale-105"
                >
                  View Rewards →
                </a>
                <a
                  href={LINKS.buy}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex rounded-full border border-white/15 px-8 py-4 text-base font-bold uppercase tracking-wider text-bone transition-all hover:border-mad/50 hover:text-mad-bright"
                >
                  Buy $MAD
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </PageShell>
    </>
  );
}
