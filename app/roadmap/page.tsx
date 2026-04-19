"use client";

import Image from "next/image";
import type { ReactNode } from "react";

const LINKS = {
  telegram: "https://t.me/MadOfficalChannel",
  x: "https://x.com/madrichclub_",
  buy: "https://jup.ag/swap?sell=So11111111111111111111111111111111111111112&buy=Fa7ZE9nCEYnrHsnoeHuhEExJpchtrBtKXnWe6CgHpump",
  dex: "https://dexscreener.com/solana/gt3dwhhkrd2mnqmmchpzdetpg4ttaa23exn1m2vwinfs",
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

const ROAD_STOPS = [
  {
    phase: "PHASE 01",
    title: "Brand + Foundation",
    status: "Completed",
    color: "green",
    side: "left",
    bullets: [
      "Stay $MAD philosophy established",
      "Brand identity completed",
      "Core website launched",
      "Public socials connected",
    ],
  },
  {
    phase: "PHASE 02",
    title: "Proof + Community",
    status: "Completed",
    color: "green",
    side: "center",
    bullets: [
      "MAD Confessions live",
      "Exchange visibility live",
      "400M tokens burned complete",
      "Community growth active",
    ],
  },
  {
    phase: "PHASE 03",
    title: "Tech + Expansion",
    status: "Building",
    color: "red",
    side: "right",
    bullets: [
      "MAD Mind live",
      "MAD AI building",
      "Sticker merch complete",
      "Clothing prototype started",
    ],
  },
  {
    phase: "PHASE 04",
    title: "Big Goal",
    status: "Next",
    color: "red",
    side: "farRight",
    bullets: [
      "800M burn target",
      "Game expansion",
      "Clothing rollout later",
      "Bigger ecosystem push",
    ],
  },
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
        "overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.015))] shadow-[0_18px_50px_rgba(0,0,0,0.35)] backdrop-blur-xl",
        className
      )}
    >
      {children}
    </section>
  );
}

function HeroPill({
  children,
  tone = "default",
}: {
  children: ReactNode;
  tone?: "green" | "red" | "default";
}) {
  return (
    <div
      className={cn(
        "rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.2em]",
        tone === "green" &&
          "border border-emerald-400/30 bg-emerald-500/12 text-emerald-200",
        tone === "red" &&
          "border border-red-500/30 bg-red-500/12 text-red-100",
        tone === "default" &&
          "border border-white/10 bg-white/[0.05] text-white/85"
      )}
    >
      {children}
    </div>
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
        "rounded-[1.25rem] border p-4 transition duration-300 hover:-translate-y-1",
        tone === "green"
          ? "border-emerald-400/35 bg-black shadow-[0_0_25px_rgba(16,185,129,0.18)]"
          : "border-red-500/25 bg-black shadow-[0_0_20px_rgba(255,0,0,0.12)]"
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/55">
          {label}
        </p>
        <span className="text-xl">{icon}</span>
      </div>

      <p
        className={cn(
          "mt-3 text-xl font-black sm:text-2xl",
          tone === "green" ? "text-emerald-300" : "text-red-200"
        )}
      >
        {value}
      </p>
    </div>
  );
}

function RoadCard({
  stop,
}: {
  stop: (typeof ROAD_STOPS)[number];
}) {
  const glow =
    stop.color === "green"
      ? "border-emerald-400/50 shadow-[0_0_30px_rgba(16,185,129,0.35)]"
      : "border-red-500/50 shadow-[0_0_30px_rgba(255,0,0,0.30)]";

  const badge =
    stop.color === "green"
      ? "bg-emerald-500/15 text-emerald-200 border-emerald-400/30"
      : "bg-red-500/15 text-red-200 border-red-500/30";

  return (
    <div
      className={cn(
        "rounded-[1.7rem] border bg-black/80 p-5 backdrop-blur-xl animate-pulse",
        glow
      )}
    >
      <p className="text-[10px] font-bold tracking-[0.3em] text-white/60">
        {stop.phase}
      </p>

      <h3 className="mt-3 text-3xl font-black text-white">{stop.title}</h3>

      <div
        className={cn(
          "mt-3 inline-flex rounded-full border px-4 py-1 text-xs font-black uppercase tracking-[0.2em]",
          badge
        )}
      >
        {stop.status}
      </div>

      <div className="mt-5 space-y-2">
        {stop.bullets.map((item) => (
          <div
            key={item}
            className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white/82"
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

function RoadmapHighway() {
  return (
    <Shell className="p-6 sm:p-8">
      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div>
          <div className="inline-flex rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-red-200">
            The Mad Path
          </div>

          <h2 className="mt-6 text-5xl font-black leading-[0.92] tracking-[-0.05em] text-white sm:text-7xl">
            The roadmap
            <br />
            to{" "}
            <span className="text-red-500 drop-shadow-[0_0_18px_rgba(255,0,0,.55)]">
              greatness.
            </span>
          </h2>

          <p className="mt-6 max-w-xl text-lg leading-8 text-white/78">
            See what is done, what is building, and what comes next.
          </p>

          <div className="mt-8">
            <div className="flex items-center justify-between text-sm font-black text-white">
              <span>Overall Progress</span>
              <span className="text-emerald-300">65% COMPLETE</span>
            </div>

            <div className="mt-3 h-4 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-[65%] rounded-full bg-[linear-gradient(90deg,#22c55e,#16a34a)] shadow-[0_0_20px_rgba(34,197,94,0.35)] animate-pulse" />
            </div>
          </div>
        </div>

        <div className="relative min-h-[820px] overflow-hidden rounded-[2rem] border border-white/10 bg-black">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,0,0,.22),transparent_30%),radial-gradient(circle_at_30%_80%,rgba(16,185,129,.16),transparent_25%)]" />

          <div className="absolute inset-0">
            <div className="absolute left-[5%] top-[76%] h-24 w-[55%] rotate-[-22deg] rounded-full border-4 border-emerald-400/70 shadow-[0_0_30px_rgba(16,185,129,.5)] animate-pulse" />
            <div className="absolute left-[35%] top-[52%] h-24 w-[45%] rotate-[14deg] rounded-full border-4 border-white/70" />
            <div className="absolute left-[54%] top-[28%] h-24 w-[40%] rotate-[-18deg] rounded-full border-4 border-red-500/70 shadow-[0_0_30px_rgba(255,0,0,.45)] animate-pulse" />
          </div>

          <div className="absolute left-[4%] bottom-[4%] w-[42%]">
            <RoadCard stop={ROAD_STOPS[0]} />
          </div>

          <div className="absolute left-[33%] top-[38%] w-[40%]">
            <RoadCard stop={ROAD_STOPS[1]} />
          </div>

          <div className="absolute right-[12%] top-[18%] w-[38%]">
            <RoadCard stop={ROAD_STOPS[2]} />
          </div>

          <div className="absolute right-[2%] top-[2%] w-[34%]">
            <RoadCard stop={ROAD_STOPS[3]} />
          </div>
        </div>
      </div>
    </Shell>
  );
}

export default function RoadmapPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#050505] text-white">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(255,0,0,0.10),transparent_28%),radial-gradient(circle_at_80%_10%,rgba(16,185,129,0.08),transparent_22%),linear-gradient(180deg,#050505,#020202)]" />

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

          <RoadmapHighway />

          <Shell className="p-6 sm:p-8">
            <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <h2 className="text-4xl font-black text-white sm:text-6xl">
                  THIS IS YOUR PATH.
                </h2>

                <p className="mt-4 max-w-2xl text-lg leading-8 text-white/78">
                  Build. Prove. Expand. Enter early and grow with the movement.
                </p>
              </div>

              <a
                href={LINKS.buy}
                target="_blank"
                rel="noreferrer"
                className="inline-flex rounded-full border border-emerald-400/35 bg-emerald-500 px-8 py-4 text-base font-black text-black shadow-[0_0_18px_rgba(34,197,94,0.35)] transition hover:scale-[1.03]"
              >
                Start Your Journey →
              </a>
            </div>
          </Shell>
        </div>
      </main>
    </div>
  );
}
