"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const LINKS = {
  telegram: "https://t.me/MadOfficialChannel",
  x: "https://x.com/madrichclub_",
  buy: "https://jup.ag/tokens/Fa7ZE9nCEYnrHsnoeHuhEExJpchtrBtKXnWe6CgHpump",
  dex: "https://dexscreener.com/solana/gt3dwhhkrd2mnqmmchpzdetpg4ttaa23exn1m2vwinfs",
} as const;

type PhaseStatus = "Completed" | "Building" | "Next";

type Phase = {
  phase: string;
  title: string;
  status: PhaseStatus;
  description: string;
  bullets: string[];
};

const PHASES: Phase[] = [
  {
    phase: "01",
    title: "Brand + Foundation",
    status: "Completed",
    description:
      "$MAD started by building the identity, website, and public-facing foundation first.",
    bullets: [
      "Stay $MAD philosophy established",
      "Brand identity and visual language completed",
      "Core website launched",
      "Public social channels connected",
    ],
  },
  {
    phase: "02",
    title: "Proof + Community",
    status: "Completed",
    description:
      "The project moved past just being a meme page by creating visible proof and public interaction.",
    bullets: [
      "MAD Confessions live",
      "Exchange / tracker visibility live",
      "Community-facing proof sections completed",
      "400M tokens burned completed",
    ],
  },
  {
    phase: "03",
    title: "Tech + Expansion",
    status: "Building",
    description:
      "$MAD is now building the next layer: deeper tech, stronger retention loops, and broader ecosystem growth.",
    bullets: [
      "MAD Mind live",
      "MAD AI currently building",
      "MAD merch stickers completed",
      "MAD merch clothing not launched yet",
    ],
  },
  {
    phase: "04",
    title: "Big Goal",
    status: "Next",
    description:
      "The long-term mission is to keep tightening supply, expand the ecosystem, and push the brand further.",
    bullets: [
      "800M total burn goal",
      "Game direction",
      "Clothing rollout later",
      "Broader ecosystem expansion",
    ],
  },
];

const STATUS = [
  { label: "Website", value: "Completed", tone: "green" },
  { label: "MAD Mind", value: "Completed", tone: "green" },
  { label: "Confessions", value: "Completed", tone: "green" },
  { label: "400M Burned", value: "Completed", tone: "green" },
  { label: "MAD AI", value: "Building", tone: "red" },
  { label: "Stickers", value: "Completed", tone: "green" },
  { label: "Clothing", value: "Not Yet", tone: "red" },
  { label: "800M Goal", value: "Target", tone: "red" },
] as const;

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function Reveal({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setShow(true), delay);
    return () => window.clearTimeout(t);
  }, [delay]);

  return (
    <div
      className={cn(
        "transition-all duration-700 ease-out",
        show ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
      )}
    >
      {children}
    </div>
  );
}

function StatusPill({ status }: { status: PhaseStatus }) {
  return (
    <span
      className={cn(
        "rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em]",
        status === "Completed" &&
          "border-emerald-400/20 bg-emerald-500/10 text-emerald-200",
        status === "Building" &&
          "border-red-500/20 bg-red-500/10 text-red-100",
        status === "Next" && "border-red-500/20 bg-red-500/10 text-red-100",
      )}
    >
      {status}
    </span>
  );
}

function SectionHeading({
  eyebrow,
  title,
  body,
  center = false,
}: {
  eyebrow: string;
  title: string;
  body?: string;
  center?: boolean;
}) {
  return (
    <div className={cn(center && "text-center")}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-white/40">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-3xl font-black leading-[0.95] text-white sm:text-4xl md:text-5xl">
        {title}
      </h2>
      {body ? (
        <p
          className={cn(
            "mt-4 text-sm leading-7 text-white/62 sm:text-base",
            center ? "mx-auto max-w-3xl" : "max-w-3xl",
          )}
        >
          {body}
        </p>
      ) : null}
    </div>
  );
}

function GlobeBackdrop() {
  return (
    <div className="pointer-events-none absolute right-[-10%] top-[-12%] hidden h-[500px] w-[500px] overflow-hidden rounded-full opacity-20 lg:block">
      <div className="absolute inset-0 rounded-full border border-red-500/20 bg-[radial-gradient(circle_at_35%_35%,rgba(255,0,0,0.24),rgba(255,0,0,0.06)_38%,transparent_65%)] shadow-[0_0_60px_rgba(255,0,0,0.18)]" />
      <div className="absolute inset-0 rounded-full bg-[repeating-linear-gradient(to_right,rgba(255,0,0,0.16)_0px,rgba(255,0,0,0.16)_1px,transparent_1px,transparent_38px),repeating-linear-gradient(to_bottom,rgba(255,0,0,0.12)_0px,rgba(255,0,0,0.12)_1px,transparent_1px,transparent_38px)] opacity-55" />
      <div className="absolute inset-[10%] rounded-full border border-red-500/20" />
      <div className="absolute inset-[24%] rounded-full border border-red-500/14" />
      <div className="absolute inset-[38%] rounded-full border border-red-500/10" />
      <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black via-black/25 to-transparent" />
    </div>
  );
}

function QuickStatusCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "red" | "green";
}) {
  return (
    <div
      className={cn(
        "rounded-[24px] border p-5 transition duration-300 hover:scale-[1.01]",
        tone === "green" && "border-emerald-400/20 bg-emerald-500/10",
        tone === "red" && "border-red-500/20 bg-red-500/10",
      )}
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/40">
        {label}
      </p>
      <p className="mt-3 text-2xl font-black text-white">{value}</p>
    </div>
  );
}

function TimelineCard({ phase, index }: { phase: Phase; index: number }) {
  return (
    <div className="group relative rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.035),rgba(255,255,255,0.018))] p-6 transition duration-300 hover:border-white/18 hover:bg-white/[0.05]">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />

      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-black tracking-[0.2em] text-red-300">
              PHASE {phase.phase}
            </span>
            <StatusPill status={phase.status} />
          </div>

          <h3 className="mt-3 text-2xl font-black text-white sm:text-3xl">
            {phase.title}
          </h3>

          <p className="mt-3 text-sm leading-7 text-white/65 sm:text-base">
            {phase.description}
          </p>
        </div>

        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/10 bg-black/30 text-sm font-black text-white/70">
          {index + 1}
        </div>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {phase.bullets.map((item) => (
          <div
            key={item}
            className="rounded-[18px] border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/75"
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

function ProgressStrip() {
  const items = Array.from({ length: 18 });

  return (
    <div className="overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(90deg,rgba(70,14,14,0.95),rgba(31,28,44,0.95))] px-4 py-6 sm:px-6">
      <div className="logo-marquee flex w-max items-center gap-4">
        {items.map((_, index) => (
          <div
            key={index}
            className="flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.05] px-5 py-3 shadow-[0_0_18px_rgba(255,0,0,0.14)]"
          >
            <img
              src="/mad.png"
              alt="$MAD logo"
              className="h-10 w-10 rounded-full object-contain"
            />
            <span className="text-sm font-black tracking-wide text-white">
              $MAD
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AnimatedGraph() {
  const points = useMemo(
    () => [
      [4, 88],
      [14, 82],
      [24, 74],
      [34, 66],
      [44, 59],
      [54, 52],
      [64, 40],
      [74, 31],
      [84, 18],
      [96, 10],
    ],
    [],
  );

  const polyline = points.map(([x, y]) => `${x},${y}`).join(" ");

  return (
    <div className="relative overflow-hidden rounded-[34px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-4 shadow-[0_18px_60px_rgba(0,0,0,0.35)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,0,0,0.12),transparent_35%)]" />

      <div className="relative z-10 rounded-[28px] border border-white/10 bg-black/40 p-4">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/40">
              Progress Chart
            </p>
            <p className="mt-2 text-xl font-black text-white">
              Panic down. Progress up.
            </p>
          </div>

          <div className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-emerald-200">
            Live build
          </div>
        </div>

        <div className="relative h-[280px] overflow-hidden rounded-[22px] border border-white/10 bg-[linear-gradient(180deg,rgba(20,20,20,0.8),rgba(5,5,5,0.98))]">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:42px_42px]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,0,0,0.08),transparent_55%)]" />

          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="absolute inset-0 h-full w-full"
          >
            <defs>
              <linearGradient id="madLine" x1="0%" x2="100%" y1="0%" y2="0%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
                <stop offset="60%" stopColor="#ef4444" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#22c55e" stopOpacity="0.95" />
              </linearGradient>

              <linearGradient id="madFill" x1="0%" x2="0%" y1="0%" y2="100%">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.28" />
                <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
              </linearGradient>
            </defs>

            <polygon
              points={`${polyline} 100,100 0,100`}
              fill="url(#madFill)"
            />

            <polyline
              points={polyline}
              fill="none"
              stroke="url(#madLine)"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {points.map(([x, y], i) => (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="1.4"
                fill={i === points.length - 1 ? "#22c55e" : "#ef4444"}
              />
            ))}
          </svg>

          <div className="absolute left-4 top-4 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-red-100">
            Weak hands
          </div>

          <div className="absolute bottom-4 right-4 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-emerald-200">
            Strong build
          </div>
        </div>
      </div>
    </div>
  );
}

function LiveDexChartBlock() {
  return (
    <div className="overflow-hidden rounded-[34px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] shadow-[0_18px_60px_rgba(0,0,0,0.35)]">
      <div className="border-b border-white/10 px-6 py-5 sm:px-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/55">
          Public Since Day One
        </p>
        <h3 className="mt-3 text-2xl font-black text-white sm:text-3xl">
          Live market chart
        </h3>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-white/68">
          Launch, growth, pullback, and rebuild — all visible in public.
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-white/80">
            Live DexScreener
          </span>
          <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-white/80">
            Public history
          </span>
          <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-white/80">
            Real market proof
          </span>
        </div>
      </div>

      <div className="relative aspect-[16/9] w-full bg-black">
        <iframe
          src={LINKS.dex}
          title="MAD live DexScreener chart"
          className="absolute inset-0 h-full w-full"
          loading="lazy"
          allowFullScreen
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 px-6 py-4 sm:px-8">
        <p className="text-xs uppercase tracking-[0.2em] text-white/45">
          Live chart powered by DexScreener
        </p>

        <a
          href={LINKS.dex}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[0.04] px-5 py-2 text-sm font-black text-white transition duration-300 hover:border-white/20 hover:bg-white/[0.07]"
        >
          Open full chart
        </a>
      </div>
    </div>
  );
}

function DancingMadBlock() {
  return (
    <div className="overflow-hidden rounded-[34px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] shadow-[0_18px_60px_rgba(0,0,0,0.35)]">
      <div className="relative min-h-[420px]">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src="/loops/mad-dancing.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,10,0.08),rgba(20,0,0,0.48)_50%,rgba(0,0,0,0.92))]" />
        <div className="absolute inset-0 bg-red-500/10" />

        <div className="relative z-10 flex min-h-[420px] flex-col justify-end p-6 sm:p-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/55">
            MAD Energy
          </p>
          <p className="mt-3 max-w-md text-3xl font-black leading-tight text-white">
            Building can still look fun.
          </p>
          <p className="mt-3 max-w-md text-sm leading-7 text-white/70">
            This is not just roadmap text. It has culture, motion, art, and identity.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function RoadmapPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#050505] text-white">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(255,48,48,0.12),transparent_35%),radial-gradient(circle_at_20%_20%,rgba(255,0,60,0.10),transparent_30%),radial-gradient(circle_at_80%_30%,rgba(255,80,0,0.08),transparent_30%),linear-gradient(180deg,#080808,#030303)]" />

      <main className="mx-auto max-w-7xl px-4 pb-20 pt-6 sm:px-6 lg:px-8">
        <Reveal>
          <section className="relative overflow-hidden rounded-[42px] border border-white/10 bg-black/35 p-6 shadow-[0_24px_120px_rgba(0,0,0,0.5)] backdrop-blur-xl sm:p-10 lg:p-14">
            <GlobeBackdrop />

            <div className="relative z-10 grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.38em] text-white/40">
                  THE MAD PATH
                </p>

                <h1 className="mt-6 text-[3rem] font-black leading-[0.88] tracking-[-0.05em] sm:text-[4.8rem] lg:text-[6rem]">
                  BUILD
                  <br />
                  PROGRESS.
                  <br />
                  SURVIVE
                  <br />
                  <span className="text-red-500 drop-shadow-[0_0_18px_rgba(255,0,0,0.55)]">
                    PRESSURE.
                  </span>
                </h1>

                <p className="mt-6 max-w-xl text-base font-semibold text-white/68">
                  The roadmap, lore, and live proof of what $MAD is building.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href="/mad-mind"
                    className="inline-flex items-center justify-center rounded-full bg-red-500 px-6 py-3 text-sm font-black text-white transition duration-300 hover:scale-[1.02] hover:bg-red-400"
                  >
                    Enter MAD Mind
                  </Link>
                  <a
                    href={LINKS.buy}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[0.04] px-6 py-3 text-sm font-black text-white transition duration-300 hover:border-white/20 hover:bg-white/[0.07]"
                  >
                    Buy $MAD
                  </a>
                  <a
                    href={LINKS.x}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[0.04] px-6 py-3 text-sm font-black text-white transition duration-300 hover:border-white/20 hover:bg-white/[0.07]"
                  >
                    Follow X
                  </a>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-2">
                {STATUS.map((card) => (
                  <QuickStatusCard
                    key={card.label}
                    label={card.label}
                    value={card.value}
                    tone={card.tone}
                  />
                ))}
              </div>
            </div>
          </section>
        </Reveal>

        <Reveal delay={120}>
          <section className="mt-10">
            <ProgressStrip />
          </section>
        </Reveal>

        <Reveal delay={180}>
          <section className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <AnimatedGraph />
            <DancingMadBlock />
          </section>
        </Reveal>

        <Reveal delay={300}>
          <section className="mt-10">
            <LiveDexChartBlock />
          </section>
        </Reveal>

        <Reveal delay={360}>
          <section className="mt-10 rounded-[38px] border border-white/10 bg-black/30 p-6 shadow-[0_18px_70px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-8 lg:p-10">
            <SectionHeading
              eyebrow="Timeline"
              title="The roadmap"
              body="Cleaner, faster to scan, still meaningful."
            />

            <div className="mt-10 space-y-5">
              {PHASES.map((phase, index) => (
                <TimelineCard key={phase.phase} phase={phase} index={index} />
              ))}
            </div>
          </section>
        </Reveal>

        <Reveal delay={440}>
          <section className="mt-10 rounded-[38px] border border-white/10 bg-[linear-gradient(180deg,rgba(30,0,0,0.86),rgba(8,0,0,0.96))] p-6 text-center shadow-[0_18px_70px_rgba(0,0,0,0.4)] backdrop-blur-xl sm:p-8 lg:p-10">
            <SectionHeading
              eyebrow="Next Move"
              title="Still early. Still building."
              body="The mission is simple: turn pressure into progress, progress into identity, and identity into a real ecosystem."
              center
            />

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <a
                href={LINKS.telegram}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-red-500 px-6 py-3 text-sm font-black text-white transition duration-300 hover:scale-[1.02] hover:bg-red-400"
              >
                Join Telegram
              </a>
              <a
                href={LINKS.x}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[0.04] px-6 py-3 text-sm font-black text-white transition duration-300 hover:border-white/20 hover:bg-white/[0.07]"
              >
                Follow X
              </a>
            </div>
          </section>
        </Reveal>
      </main>
    </div>
  );
}
