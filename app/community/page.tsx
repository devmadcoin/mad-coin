"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

/* ═══════════════════════════════════════════════════════════
   DATA — Communities Supported On-Chain
   ═══════════════════════════════════════════════════════════ */

const IMPACT_STATS = {
  communitiesSupported: 2,
  totalDonatedUSD: 1185,
  totalTokensDonated: 0,
  onChainProof: "https://app.streamflow.finance/contract/solana/mainnet/vi57YgR8GGHL31EieLLN1Ekbzj5w4wTV6iXcDiU4R2G",
};

const COMMUNITIES: Community[] = [
  {
    name: "Normie",
    handle: "@NormieCEO",
    platform: "X",
    amountUSD: 1061,
    tokenAmount: 1034400,
    tokenSymbol: "Normie",
    date: "2026-07-07",
    txHash: "vi57YgR8GGHL31EieLLN1Ekbzj5w4wTV6iXcDiU4R2G",
    description: "Locked 1.0344M Normie tokens via Streamflow to support the Normie community ecosystem and cross-community collaboration.",
    logo: "/community/normie.png",
    xPost: "https://x.com/madrichclub_/status/2074232348292661547",
  },
  {
    name: "Stash",
    handle: "@gostashxyz",
    platform: "X",
    amountUSD: 124,
    tokenAmount: 33890,
    tokenSymbol: "STASH",
    date: "2026-05-28",
    txHash: "2KDGBDDab2AQCBwnF1eWsEupVUdgS6uHMGtVD2CXJ7j9",
    description: "Locked 33,890 $STASH tokens via Streamflow to support the Stash community ecosystem. Non-cancelable until 2060.",
    xPost: "https://x.com/madrichclub_/status/2062897412516217028",
  },
];

type Community = {
  name: string;
  handle?: string;
  platform: string;
  amountUSD: number;
  tokenAmount: number;
  tokenSymbol: string;
  date: string;
  txHash: string;
  description: string;
  logo?: string;
  xPost?: string;
};

/* ═══════════════════════════════════════════════════════════
   ANIMATIONS
   ═══════════════════════════════════════════════════════════ */
function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <div
      style={{
        animation: `fadeInUp 0.6s ease-out ${delay}s both`,
      }}
    >
      {children}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   HERO
   ═══════════════════════════════════════════════════════════ */
function Hero() {
  return (
    <section className="relative overflow-hidden px-4 py-20 sm:py-28">
      <div className="mx-auto max-w-5xl text-center">
        <FadeIn>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#FF6B00]/60">
            On-Chain Proof
          </p>
          <h1 className="mt-4 text-4xl font-black leading-[0.95] text-white sm:text-6xl lg:text-7xl">
            Community{" "}
            <span className="text-[#FF2D2D] drop-shadow-[0_0_20px_rgba(255,45,45,0.4)]">
              Impact
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-white/50 sm:text-lg">
            $MAD doesn&apos;t just extract — it distributes. Every community supported,
            every token donated, every act of conviction is recorded on-chain for anyone to verify.
            This is what it looks like when a memecoin builds instead of takes.
          </p>
        </FadeIn>

        {/* Stats Row */}
        <FadeIn delay={0.15}>
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard
              value={IMPACT_STATS.communitiesSupported.toString()}
              label="Communities Supported"
              icon="🤝"
            />
            <StatCard
              value={`$${IMPACT_STATS.totalDonatedUSD.toLocaleString()}`}
              label="Total Donated"
              icon="💰"
            />
            <StatCard
              value={`${(IMPACT_STATS.totalTokensDonated / 1_000_000).toFixed(1)}M`}
              label="$MAD Tokens Given"
              icon="🔥"
            />
          </div>
        </FadeIn>

        {/* Proof CTA */}
        <FadeIn delay={0.25}>
          <div className="mt-8">
            <a
              href={IMPACT_STATS.onChainProof}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-6 py-3 text-sm font-bold text-emerald-400 transition hover:bg-emerald-500/20"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              Verify On-Chain
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

function StatCard({ value, label, icon }: { value: string; label: string; icon: string }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 text-center transition hover:border-white/10">
      <div className="mb-2 text-2xl">{icon}</div>
      <div className="text-3xl font-black text-white">{value}</div>
      <div className="mt-1 text-[11px] uppercase tracking-[0.2em] text-white/40">{label}</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   PHILOSOPHY — The Why
   ═══════════════════════════════════════════════════════════ */
function Philosophy() {
  return (
    <section className="border-y border-white/5 bg-white/[0.01] px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-4xl text-center">
        <FadeIn>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">
            The $MAD Difference
          </p>
          <h2 className="mt-4 text-3xl font-black text-white sm:text-4xl">
            Built to <span className="text-[#FF2D2D]">Give</span>, Not Just Grow
          </h2>
        </FadeIn>
        <FadeIn delay={0.1}>
          <div className="mt-8 grid gap-6 text-left sm:grid-cols-3">
            <PhilosophyCard
              title="On-Chain Proof"
              text="Every donation is recorded on the Solana blockchain. No promises — just verifiable transactions anyone can audit."
              icon="🔗"
            />
            <PhilosophyCard
              title="Community First"
              text="Before the dev takes, the community receives. Holder giveaways, project support, and mutual aid — that's the $MAD way."
              icon="🫂"
            />
            <PhilosophyCard
              title="Transparent Impact"
              text="We show the math. Communities supported, amounts donated, transaction hashes. Nothing hidden, nothing faked."
              icon="📊"
            />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

function PhilosophyCard({ title, text, icon }: { title: string; text: string; icon: string }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-[#0a0a0a] p-6">
      <div className="mb-3 text-xl">{icon}</div>
      <h3 className="text-lg font-black text-white">{title}</h3>
      <p className="mt-2 text-sm leading-7 text-white/40">{text}</p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   COMMUNITIES GRID — The Impact
   ═══════════════════════════════════════════════════════════ */
function CommunitiesGrid() {
  const [filter, setFilter] = useState<"all" | "recent" | "biggest">("all");

  const sorted = [...COMMUNITIES].sort((a, b) => {
    if (filter === "recent") return new Date(b.date).getTime() - new Date(a.date).getTime();
    if (filter === "biggest") return b.amountUSD - a.amountUSD;
    return 0;
  });

  return (
    <section className="px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <FadeIn>
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">
                Verified Impact
              </p>
              <h2 className="mt-2 text-3xl font-black text-white sm:text-4xl">
                Communities <span className="text-[#FF2D2D]">Supported</span>
              </h2>
            </div>
            <div className="flex gap-2">
              {(["all", "recent", "biggest"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition ${
                    filter === f
                      ? "bg-[#FF2D2D] text-white"
                      : "border border-white/10 text-white/50 hover:border-white/20 hover:text-white/70"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </FadeIn>

        {sorted.length === 0 ? (
          <FadeIn delay={0.1}>
            <div className="mt-12 rounded-2xl border border-dashed border-white/10 bg-white/[0.01] p-12 text-center">
              <div className="text-4xl mb-4">📝</div>
              <p className="text-lg font-black text-white/50">Impact data loading...</p>
              <p className="mt-2 text-sm text-white/30">
                The dev is compiling the full list of communities supported on-chain.
                <br />
                Check back soon for the complete impact report.
              </p>
            </div>
          </FadeIn>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sorted.map((community, i) => (
              <CommunityCard key={community.txHash} community={community} delay={i * 0.05} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function CommunityCard({ community, delay }: { community: Community; delay: number }) {
  return (
    <FadeIn delay={delay}>
      <div className="group relative overflow-hidden rounded-2xl border border-white/5 bg-[#0a0a0a] p-5 transition hover:border-white/10">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {community.logo ? (
              <div className="relative h-12 w-12 overflow-hidden rounded-xl border border-white/10">
                <Image src={community.logo} alt={community.name} fill className="object-cover" />
              </div>
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-[#FF2D2D]/10 text-lg font-black text-[#FF2D2D]">
                {community.name.charAt(0)}
              </div>
            )}
            <div>
              <p className="font-black text-white">{community.name}</p>
              {community.handle && (
                <p className="text-xs text-white/40">{community.handle}</p>
              )}
            </div>
          </div>
          <span className="rounded-full border border-white/5 bg-white/[0.02] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white/30">
            {community.platform}
          </span>
        </div>

        <p className="mt-4 text-sm leading-6 text-white/50">{community.description}</p>

        <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-4">
          <div>
            <p className="text-lg font-black text-[#FF2D2D]">${community.amountUSD.toLocaleString()}</p>
            <p className="text-[10px] text-white/30">{(community.tokenAmount / 1_000_000).toFixed(2)}M {community.tokenSymbol}</p>
          </div>
          <div className="flex items-center gap-2">
            {community.xPost && (
              <a
                href={community.xPost}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-bold text-white/60 transition hover:bg-white/5 hover:text-white"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                View Post
              </a>
            )}
            <a
              href={`https://app.streamflow.finance/contract/solana/mainnet/${community.txHash}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-400 transition hover:bg-emerald-500/20"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              Verify
            </a>
          </div>
        </div>
      </div>
    </FadeIn>
  );
}

/* ═══════════════════════════════════════════════════════════
   DEV LOCK — Proof of Commitment
   ═══════════════════════════════════════════════════════════ */
function DevLock() {
  return (
    <section className="border-y border-white/5 bg-white/[0.01] px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-4xl">
        <FadeIn>
          <div className="text-center mb-10">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#FF6B00]/60">
              Dev Commitment
            </p>
            <h2 className="mt-4 text-3xl font-black text-white sm:text-4xl">
              <span className="text-emerald-400">100M $MAD</span> Locked
            </h2>
            <p className="mt-2 text-lg font-bold text-white/40">$472,348 · Non-cancelable until Dec 2026</p>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/[0.03] p-8 sm:p-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-black text-white">Non-Cancelable</p>
                  <p className="text-xs text-white/40">Cannot be revoked or withdrawn</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-black text-white">On-Chain Verified</p>
                  <p className="text-xs text-white/40">Immutable contract via Streamflow</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="rounded-2xl border border-white/5 bg-[#0a0a0a] p-4 text-center">
                <p className="text-lg font-black text-white">100M</p>
                <p className="text-[10px] text-white/30 uppercase tracking-wider">$MAD Locked</p>
              </div>
              <div className="rounded-2xl border border-white/5 bg-[#0a0a0a] p-4 text-center">
                <p className="text-lg font-black text-emerald-400">$472K</p>
                <p className="text-[10px] text-white/30 uppercase tracking-wider">Current Value</p>
              </div>
              <div className="rounded-2xl border border-white/5 bg-[#0a0a0a] p-4 text-center">
                <p className="text-lg font-black text-white">Jun 5</p>
                <p className="text-[10px] text-white/30 uppercase tracking-wider">Lock Date</p>
              </div>
              <div className="rounded-2xl border border-white/5 bg-[#0a0a0a] p-4 text-center">
                <p className="text-lg font-black text-[#FF2D2D]">Dec 4</p>
                <p className="text-[10px] text-white/30 uppercase tracking-wider">Unlock Date</p>
              </div>
            </div>

            <p className="text-sm text-white/40 leading-relaxed mb-6">
              Developer locked 100M $MAD tokens via Streamflow. This is a non-cancelable, immutable contract 
              that cannot be withdrawn, transferred, or revoked until December 2026. This is what accountability 
              looks like in a space full of shadows.
            </p>

            <div className="flex flex-wrap gap-3">
              <a
                href="https://app.streamflow.finance/contract/solana/mainnet/2Qg5Ugf2eH12ry9w3StU9sMvo5biuruK7ob2sni2Yref"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-6 py-3 text-sm font-bold text-emerald-400 transition hover:bg-emerald-500/20"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                Verify on Streamflow
              </a>
              <a
                href="https://x.com/madrichclub_/status/2062897412516217028"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-6 py-3 text-sm font-bold text-white/60 transition hover:bg-white/5 hover:text-white"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                View Announcement
              </a>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   CTA — Join The Mission
   ═══════════════════════════════════════════════════════════ */
function CTA() {
  return (
    <section className="px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-3xl text-center">
        <FadeIn>
          <div className="rounded-3xl border border-[#FF2D2D]/20 bg-[#FF2D2D]/[0.03] p-8 sm:p-12">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#FF6B00]/60">
              The Mission Continues
            </p>
            <h2 className="mt-4 text-3xl font-black text-white sm:text-4xl">
              Be Part of the <span className="text-[#FF2D2D]">Impact</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-8 text-white/50">
              Every holder strengthens the community. Every community strengthens the mission.
              Hold $MAD. Support the movement. Watch the ripple effect.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/rewards"
                className="inline-flex rounded-full bg-[#FF2D2D] px-8 py-4 text-base font-black text-white transition hover:scale-105 hover:bg-[#FF6B00]"
              >
                View Rewards →
              </Link>
              <a
                href="https://jup.ag/swap?sell=So11111111111111111111111111111111111111112&buy=Fa7ZE9nCEYnrHsnoeHuhEExJpchtrBtKXnWe6CgHpump"
                target="_blank"
                rel="noreferrer"
                className="inline-flex rounded-full border border-white/10 bg-white/[0.03] px-8 py-4 text-base font-black text-white transition hover:bg-white/5"
              >
                Buy $MAD
              </a>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════════ */
export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-[#050505]">
      <Hero />
      <Philosophy />
      <CommunitiesGrid />
      <DevLock />
      <CTA />
    </div>
  );
}
