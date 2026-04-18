"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const LINKS = {
  telegram: "https://t.me/MadOfficialChannel",
  x: "https://x.com/madrichclub_",
  buy: "https://jup.ag/tokens/Fa7ZE9nCEYnrHsnoeHuhEExJpchtrBtKXnWe6CgHpump",
} as const;

type PhaseStatus = "Live" | "Building" | "Next";

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
    title: "Identity + Core Signal",
    status: "Live",
    description:
      "$MAD started by building identity first: emotion under control, pressure as truth, and discipline over panic.",
    bullets: [
      "Stay $MAD philosophy established",
      "Core branding and visual identity live",
      "Website foundation deployed",
      "Public social channels connected",
    ],
  },
  {
    phase: "02",
    title: "Community + Proof",
    status: "Live",
    description:
      "The project moved from idea to visible proof with public interaction, confessions, and stronger community-facing signal.",
    bullets: [
      "MAD Confessions live",
      "Public proof and social trust layer",
      "Retail-friendlier messaging",
      "Community interaction loop started",
    ],
  },
  {
    phase: "03",
    title: "MAD Mind + Tech Layer",
    status: "Building",
    description:
      "$MAD is no longer just a meme page. It is becoming a live system with interaction, memory, progression, and AI behavior.",
    bullets: [
      "MAD Mind deployed",
      "Pressure score and archetype system",
      "Shareable card / clip loop",
      "MAD AI build phase started",
    ],
  },
  {
    phase: "04",
    title: "Expansion Layer",
    status: "Next",
    description:
      "The next layer is ecosystem depth: stronger retention loops, game direction, merch, collectibles, and broader participation.",
    bullets: [
      "Game ecosystem direction",
      "Merch and collectible identity",
      "Leaderboard / retention upgrades",
      "Stronger community mechanics",
    ],
  },
];

const STATUS_CARDS = [
  { label: "Website", value: "Live", tone: "red" },
  { label: "MAD Mind", value: "Live", tone: "green" },
  { label: "Confessions", value: "Live", tone: "red" },
  { label: "MAD AI", value: "Building", tone: "white" },
  { label: "Game", value: "Next", tone: "white" },
  { label: "Merch", value: "Next", tone: "white" },
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
        status === "Live" && "border-emerald-400/20 bg-emerald-500/10 text-emerald-200",
        status === "Building" && "border-red-500/20 bg-red-500/10 text-red-100",
        status === "Next" && "border-white/10 bg-white/5 text-white/65",
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
    <div className="pointer-events-none absolute right-[-10%] top-[-12%] hidden h-[480px] w-[480px] overflow-hidden rounded-full opacity-20 lg:block">
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
  tone: "red" | "green" | "white";
}) {
  return (
    <div
      className={cn(
        "rounded-[24px] border p-5",
        tone === "red" && "border-red-500/20 bg-red-500/10",
        tone === "green" && "border-emerald-400/20 bg-emerald-500/10",
        tone === "white" && "border-white/10 bg-white/[0.03]",
      )}
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/40">
        {label}
      </p>
      <p className="mt-3 text-2xl font-black text-white">{value}</p>
    </div>
  );
}

function LoreCard({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5 transition duration-300 hover:border-white/20 hover:bg-white/[0.05]">
      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/40">
        {title}
      </p>
      <p className="mt-3 text-sm leading-7 text-white/68">{text}</p>
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
  return (
    <div className="overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(90deg,rgba(70,14,14,0.95),rgba(31,28,44,0.95))] px-4 py-6 sm:px-6">
      <div className="logo-marquee flex w-max items-center gap-4">
        {[
          "Identity Live",
          "Website Live",
          "Confessions Live",
          "MAD Mind Live",
          "MAD AI Building",
          "Game Next",
          "Merch Next",
          "Ecosystem Expanding",
          "Identity Live",
          "Website Live",
          "Confessions Live",
          "MAD Mind Live",
          "MAD AI Building",
          "Game Next",
          "Merch Next",
          "Ecosystem Expanding",
        ].map((item, index) => (
          <div
            key={`${item}-${index}`}
            className="rounded-full border border-white/10 bg-white/[0.05] px-5 py-3 text-sm font-black text-white/90"
          >
            {item}
          </div>
        ))}
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
                  SIGNAL.
                  <br />
                  SURVIVE
                  <br />
                  <span className="text-red-500 drop-shadow-[0_0_18px_rgba(255,0,0,0.55)]">
                    PRESSURE.
                  </span>
                </h1>

                <p className="mt-6 max-w-xl text-base font-semibold text-white/68">
                  This is the roadmap, lore, and live proof of what $MAD is building.
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
                {STATUS_CARDS.map((card) => (
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
          <section className="mt-10 rounded-[38px] border border-white/10 bg-[linear-gradient(180deg,rgba(30,0,0,0.86),rgba(8,0,0,0.96))] p-6 shadow-[0_18px_70px_rgba(0,0,0,0.4)] backdrop-blur-xl sm:p-8 lg:p-10">
            <SectionHeading
              eyebrow="Lore"
              title="What $MAD actually means"
              body="Not random anger. Not empty hype. $MAD is about controlling the emotional moment where most people fold."
            />

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <LoreCard
                title="Chaos"
                text="Chaos is real. Markets move, people panic, and pressure never asks permission."
              />
              <LoreCard
                title="Discipline"
                text="Most people react. Very few decide. That difference changes everything."
              />
              <LoreCard
                title="Identity"
                text="The goal is not temporary motivation. The goal is becoming harder to break."
              />
            </div>
          </section>
        </Reveal>

        <Reveal delay={260}>
          <section className="mt-10 rounded-[38px] border border-white/10 bg-black/30 p-6 shadow-[0_18px_70px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-8 lg:p-10">
            <SectionHeading
              eyebrow="Timeline"
              title="The roadmap"
              body="Shorter. Cleaner. Easier to scan. Everything important is still here."
            />

            <div className="mt-10 space-y-5">
              {PHASES.map((phase, index) => (
                <TimelineCard key={phase.phase} phase={phase} index={index} />
              ))}
            </div>
          </section>
        </Reveal>

        <Reveal delay={340}>
          <section className="mt-10 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="overflow-hidden rounded-[34px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] shadow-[0_18px_60px_rgba(0,0,0,0.35)]">
              <div className="relative min-h-[420px]">
                <Image
                  src="/memes/MAD-KINGS-ONLY.png"
                  alt="MAD art"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,10,0.08),rgba(20,0,0,0.48)_50%,rgba(0,0,0,0.92))]" />
                <div className="relative z-10 flex min-h-[420px] flex-col justify-end p-6 sm:p-8">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/55">
                    MAD Art
                  </p>
                  <p className="mt-3 max-w-md text-3xl font-black leading-tight text-white">
                    This is not just a token page.
                  </p>
                  <p className="mt-3 max-w-md text-sm leading-7 text-white/70">
                    The art, culture, and identity layer are part of what makes the project stick.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[34px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-8">
              <SectionHeading
                eyebrow="Quick Read"
                title="What’s done. What’s building. What’s next."
              />

              <div className="mt-8 space-y-4">
                <div className="rounded-[24px] border border-emerald-400/20 bg-emerald-500/10 p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-200/85">
                    Done
                  </p>
                  <p className="mt-3 text-sm leading-7 text-emerald-50/90">
                    Website live. Brand identity live. MAD Confessions live. MAD Mind live.
                  </p>
                </div>

                <div className="rounded-[24px] border border-red-500/20 bg-red-500/10 p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-red-100/85">
                    Building
                  </p>
                  <p className="mt-3 text-sm leading-7 text-red-50/90">
                    MAD AI, progression layers, retention loops, and stronger system depth.
                  </p>
                </div>

                <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/45">
                    Next
                  </p>
                  <p className="mt-3 text-sm leading-7 text-white/72">
                    Game direction, merch, collectibles, and broader ecosystem expansion.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </Reveal>

        <Reveal delay={420}>
          <section className="mt-10 rounded-[38px] border border-white/10 bg-[linear-gradient(180deg,rgba(30,0,0,0.86),rgba(8,0,0,0.96))] p-6 text-center shadow-[0_18px_70px_rgba(0,0,0,0.4)] backdrop-blur-xl sm:p-8 lg:p-10">
            <SectionHeading
              eyebrow="Next Move"
              title="Still early. Still building."
              body="The goal is simple: turn pressure into signal, signal into identity, and identity into a real ecosystem."
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
