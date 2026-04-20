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
  { label: "400M Burn", value: "PROVEN", tone: "green", icon: "🔥" },
  { label: "MAD AI", value: "IN PROGRESS", tone: "red", icon: "🤖" },
  { label: "Stickers", value: "LIVE", tone: "green", icon: "😈" },
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

          <RoadmapPoster />

          <CTASection />

          <RiskNotice />
        </div>
      </main>
    </div>
  );
}
