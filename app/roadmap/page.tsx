"use client";

import Image from "next/image";
import type { ReactNode } from "react";

const LINKS = {
  buy: "https://jup.ag/swap?sell=So11111111111111111111111111111111111111112&buy=Fa7ZE9nCEYnrHsnoeHuhEExJpchtrBtKXnWe6CgHpump",
} as const;

const STATUS_CARDS = [
  { label: "Website", value: "LIVE NOW", tone: "green", icon: "🌐" },
  { label: "MAD Mind", value: "LIVE NOW", tone: "green", icon: "🧠" },
  { label: "Confessions", value: "LIVE NOW", tone: "green", icon: "💬" },
  { label: "400M Burn", value: "COMPLETE", tone: "green", icon: "🔥" },
  { label: "MAD AI", value: "IN PROGRESS", tone: "red", icon: "🤖" },
  { label: "Stickers", value: "COMPLETE", tone: "green", icon: "😈" },
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
        className
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
          : "border-red-500/25 bg-[radial-gradient(circle_at_top_left,rgba(255,0,0,0.14),rgba(0,0,0,0.92))] shadow-[0_0_20px_rgba(255,0,0,0.08)]"
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
          tone === "green" ? "text-emerald-300" : "text-red-100"
        )}
      >
        {value}
      </p>
    </div>
  );
}

function ProgressBlock() {
  return (
    <div className="mt-8 max-w-[34rem]">
      <div className="mb-3 flex items-center justify-between gap-4 text-sm font-black text-white">
        <span className="uppercase tracking-[0.18em]">Overall Progress</span>
        <span className="text-emerald-300">65% complete</span>
      </div>

      <div className="h-4 overflow-hidden rounded-full bg-white/10">
        <div className="h-full w-[65%] rounded-full bg-[linear-gradient(90deg,#22c55e,#34d399)] shadow-[0_0_22px_rgba(16,185,129,0.35)]" />
      </div>
    </div>
  );
}

function RoadmapHero() {
  return (
    <Shell className="overflow-hidden">
      <div className="relative min-h-[920px]">
        <Image
          src="/roadmap/the-mad-roadmap.png"
          alt="The MAD roadmap background"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />

        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.78)_0%,rgba(0,0,0,0.52)_34%,rgba(0,0,0,0.14)_64%,rgba(0,0,0,0.04)_100%)]" />

        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.10),rgba(0,0,0,0.28))]" />

        <div className="relative z-10 grid min-h-[920px] gap-8 p-6 sm:p-8 lg:grid-cols-[0.62fr_1.38fr] lg:p-10">
          <div className="pt-4">
            <div className="inline-flex rounded-full border border-red-500/25 bg-red-500/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-red-200">
              The Mad Path
            </div>

            <h1 className="mt-6 text-[3.6rem] font-black leading-[0.88] tracking-[-0.05em] text-white sm:text-[5.9rem]">
              The roadmap
              <br />
              to{" "}
              <span className="text-red-500 drop-shadow-[0_0_18px_rgba(255,0,0,0.52)]">
                greatness.
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-base leading-8 text-white/82 sm:text-lg">
              See what is done, what is building, and what comes next.
            </p>

            <ProgressBlock />
          </div>

          <div />
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

export default function RoadmapPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#050505] text-white">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(255,0,0,0.10),transparent_28%),radial-gradient(circle_at_80%_10%,rgba(16,185,129,0.08),transparent_22%),radial-gradient(circle_at_50%_80%,rgba(255,255,255,0.03),transparent_25%),linear-gradient(180deg,#050505,#020202)]" />

      <main className="mx-auto max-w-7xl px-4 pb-20 pt-6 sm:px-6 lg:px-8">
        <div className="grid gap-6">
          <div className="grid gap-3 md:grid-cols-4 xl:grid-cols-8">
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

          <RoadmapHero />

          <CTASection />
        </div>
      </main>
    </div>
  );
}
