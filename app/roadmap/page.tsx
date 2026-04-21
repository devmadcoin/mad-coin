"use client";

import Image from "next/image";
import type { ReactNode } from "react";

const LINKS = {
  buy: "https://jup.ag/swap?sell=So11111111111111111111111111111111111111112&buy=Fa7ZE9nCEYnrHsnoeHuhEExJpchtrBtKXnWe6CgHpump",
} as const;

const PROGRESS = {
  complete: 7,
  total: 9,
};

const percentComplete = Math.round((PROGRESS.complete / PROGRESS.total) * 100);

const STATUS_CARDS = [
  { label: "Website", value: "LIVE NOW", tone: "green", icon: "🌐" },
  { label: "MAD Mind", value: "LIVE NOW", tone: "green", icon: "🧠" },
  { label: "Confessions", value: "LIVE NOW", tone: "green", icon: "💬" },
  { label: "400M Burn", value: "PROVEN", tone: "green", icon: "🔥" },
  { label: "MAD AI", value: "LIVE NOW", tone: "green", icon: "🤖" },
  { label: "MAD Games", value: "IN PROGRESS", tone: "red", icon: "🎮" },
  { label: "Stickers", value: "LIVE NOW", tone: "green", icon: "😈" },
  { label: "Clothing", value: "TESTING", tone: "red", icon: "👕" },
  { label: "800M Goal", value: "FINAL GOAL", tone: "red", icon: "🎯" },
] as const;

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function Shell({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0.01))] shadow-[0_18px_60px_rgba(0,0,0,0.42)] backdrop-blur-xl",
        className,
      )}
    >
      {children}
    </section>
  );
}

function StatusMiniCard({
  label,
  value,
  tone,
  icon,
}: {
  label: string;
  value: string;
  tone: "red" | "green";
  icon: string;
}) {
  return (
    <div
      className={cn(
        "rounded-[1.25rem] border p-4 transition duration-300 hover:-translate-y-0.5",
        tone === "green"
          ? "border-emerald-400/35 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.2),rgba(0,0,0,0.92))] shadow-[0_0_25px_rgba(16,185,129,0.12)]"
          : "border-red-500/25 bg-[radial-gradient(circle_at_top_left,rgba(255,0,0,0.14),rgba(0,0,0,0.92))] shadow-[0_0_20px_rgba(255,0,0,0.08)]",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/58">
          {label}
        </p>
        <div className="text-lg">{icon}</div>
      </div>

      <p
        className={cn(
          "mt-3 text-xl font-black leading-tight sm:text-2xl",
          tone === "green" ? "text-emerald-300" : "text-red-100",
        )}
      >
        {value}
      </p>
    </div>
  );
}

function ProgressStrip() {
  return (
    <Shell className="p-5 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.35em] text-white/45">
            Overall Progress
          </p>
          <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl">
            {percentComplete}% complete
          </h2>
          <p className="mt-2 text-sm text-white/60">
            {PROGRESS.complete} of {PROGRESS.total} roadmap milestones are live,
            proven, or locked in.
          </p>
        </div>

        <div className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-bold text-white/75">
          Build. Prove. Expand.
        </div>
      </div>

      <div className="mt-5 h-4 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-[linear-gradient(90deg,#22c55e,#10b981,#ef4444)] shadow-[0_0_24px_rgba(16,185,129,0.25)] transition-all duration-500"
          style={{ width: `${percentComplete}%` }}
        />
      </div>
    </Shell>
  );
}

function RoadmapPoster() {
  return (
    <Shell className="overflow-hidden p-0">
      <div className="relative aspect-[16/9] w-full bg-black">
        <Image
          src="/roadmap/the-mad-roadmap.png"
          alt="The MAD roadmap"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>
    </Shell>
  );
}

function CommunitySupport() {
  return (
    <Shell className="p-6 sm:p-8">
      <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.35em] text-emerald-300/85">
            Alliance Expansion
          </p>

          <h2 className="mt-3 text-3xl font-black text-white sm:text-5xl">
            Support 1 Community.
          </h2>

          <p className="mt-4 max-w-3xl text-base leading-8 text-white/75 sm:text-lg">
            Buy 8M of their tokens and build strategic alignment through action,
            not empty talk.
          </p>
        </div>

        <div className="rounded-3xl border border-emerald-400/20 bg-emerald-400/5 px-8 py-6 text-center">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-emerald-300/80">
            Target Size
          </p>
          <p className="mt-2 text-4xl font-black text-emerald-300">8M</p>
          <p className="mt-1 text-sm text-white/55">Tokens</p>
        </div>
      </div>
    </Shell>
  );
}

function CTASection() {
  return (
    <Shell className="p-6 sm:p-8">
      <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <h2 className="text-4xl font-black text-white sm:text-6xl">
            THIS IS YOUR PATH.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-8 text-white/78 sm:text-lg">
            Build. Prove. Expand.
          </p>
        </div>

        <a
          href={LINKS.buy}
          target="_blank"
          rel="noreferrer"
          className="inline-flex rounded-full border border-red-500/35 bg-red-500 px-8 py-4 text-base font-black text-white shadow-[0_0_22px_rgba(255,0,0,0.22)] transition hover:scale-[1.02] hover:bg-red-400"
        >
          Start Your Journey →
        </a>
      </div>
    </Shell>
  );
}

function RiskNotice() {
  return (
    <Shell className="border-yellow-500/20 bg-[linear-gradient(180deg,rgba(255,208,0,0.05),rgba(255,208,0,0.02))] px-6 py-8 sm:px-10 sm:py-10">
      <p className="text-center text-xs font-black uppercase tracking-[0.38em] text-yellow-300/85">
        Risk Notice
      </p>

      <p className="mx-auto mt-5 max-w-6xl text-center text-base leading-9 text-yellow-100/90 sm:text-xl">
        $MAD is a meme coin and speculative digital asset. Nothing on this
        website is financial advice or a guarantee of returns. Crypto is risky
        and volatile. Never risk money you cannot afford to lose. Always do your
        own research.
      </p>
    </Shell>
  );
}

export default function RoadmapPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#050505] text-white">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(255,0,0,0.10),transparent_28%),radial-gradient(circle_at_80%_10%,rgba(16,185,129,0.08),transparent_22%),radial-gradient(circle_at_50%_80%,rgba(255,255,255,0.03),transparent_25%),linear-gradient(180deg,#050505,#020202)]" />

      <main className="mx-auto max-w-7xl px-4 pb-20 pt-6 sm:px-6 lg:px-8">
        <div className="grid gap-6">
          <ProgressStrip />

          <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-9">
            {STATUS_CARDS.map((card) => (
              <StatusMiniCard
                key={card.label}
                label={card.label}
                value={card.value}
                tone={card.tone}
                icon={card.icon}
              />
            ))}
          </div>

          <RoadmapPoster />

          <CommunitySupport />

          <CTASection />

          <RiskNotice />
        </div>
      </main>
    </div>
  );
}
