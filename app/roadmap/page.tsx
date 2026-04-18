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
      "Brand identity completed",
      "Core website launched",
      "Public socials connected",
    ],
  },
  {
    phase: "02",
    title: "Proof + Community",
    status: "Completed",
    description:
      "The project moved beyond just memes by creating visible proof and community interaction.",
    bullets: [
      "MAD Confessions live",
      "Exchange visibility live",
      "400M tokens burned",
      "Community growth active",
    ],
  },
  {
    phase: "03",
    title: "Tech + Expansion",
    status: "Building",
    description:
      "$MAD is now building stronger retention loops, more tools, and ecosystem expansion.",
    bullets: [
      "MAD Mind live",
      "MAD AI building",
      "Sticker merch live",
      "Clothing coming later",
    ],
  },
  {
    phase: "04",
    title: "Big Goal",
    status: "Next",
    description:
      "Long-term mission: reduce supply, grow ecosystem, strengthen brand.",
    bullets: [
      "800M burn target",
      "Game direction",
      "Clothing rollout",
      "Bigger ecosystem push",
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
        show ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      )}
    >
      {children}
    </div>
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

      {body && (
        <p
          className={cn(
            "mt-4 text-sm leading-7 text-white/62 sm:text-base",
            center ? "mx-auto max-w-3xl" : "max-w-3xl"
          )}
        >
          {body}
        </p>
      )}
    </div>
  );
}

function GlobeBackdrop() {
  return (
    <div className="pointer-events-none absolute right-[-10%] top-[-12%] hidden h-[500px] w-[500px] overflow-hidden rounded-full opacity-20 lg:block">
      <div className="absolute inset-0 rounded-full border border-red-500/20 bg-[radial-gradient(circle_at_35%_35%,rgba(255,0,0,0.24),rgba(255,0,0,0.06)_38%,transparent_65%)]" />
      <div className="absolute inset-0 rounded-full bg-[repeating-linear-gradient(to_right,rgba(255,0,0,0.16)_0px,rgba(255,0,0,0.16)_1px,transparent_1px,transparent_38px),repeating-linear-gradient(to_bottom,rgba(255,0,0,0.12)_0px,rgba(255,0,0,0.12)_1px,transparent_1px,transparent_38px)] opacity-55" />
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
        "rounded-[24px] border p-5",
        tone === "green" && "border-emerald-400/20 bg-emerald-500/10",
        tone === "red" && "border-red-500/20 bg-red-500/10"
      )}
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/40">
        {label}
      </p>
      <p className="mt-3 text-2xl font-black text-white">{value}</p>
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
        status !== "Completed" &&
          "border-red-500/20 bg-red-500/10 text-red-100"
      )}
    >
      {status}
    </span>
  );
}

function TimelineCard({ phase, index }: { phase: Phase; index: number }) {
  return (
    <div className="rounded-[30px] border border-white/10 bg-white/[0.03] p-6">
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
  const items = [
    { logo: true },
    { label: "$MAD" },
    { label: "Website Completed" },
    { label: "MAD Mind Completed" },
    { label: "Confessions Completed" },
    { label: "400M Burned Completed" },
    { label: "MAD AI Building" },
    { label: "Stickers Completed" },
    { label: "Clothing Not Yet" },
    { label: "800M Burn Goal" },
  ];

  const repeated = [...items, ...items, ...items];

  return (
    <div className="overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(90deg,rgba(70,14,14,0.95),rgba(31,28,44,0.95))] px-4 py-6">
      <div className="logo-marquee flex w-max items-center gap-4">
        {repeated.map((item, index) =>
          "logo" in item ? (
            <img
              key={index}
              src="/mad.png"
              className="h-12 w-12 rounded-full"
              alt="$MAD"
            />
          ) : (
            <div
              key={index}
              className="rounded-full border border-white/10 bg-white/[0.05] px-5 py-3 text-sm font-black text-white"
            >
              {item.label}
            </div>
          )
        )}
      </div>
    </div>
  );
}

function LiveDexChartBlock() {
  return (
    <div className="overflow-hidden rounded-[34px] border border-white/10 bg-black/30">
      <div className="border-b border-white/10 px-6 py-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/55">
          Public Since Day One
        </p>

        <h3 className="mt-3 text-2xl font-black text-white sm:text-3xl">
          Live market chart
        </h3>
      </div>

      <div className="relative aspect-[16/9] w-full bg-black">
        <iframe
          src={LINKS.dex}
          title="MAD live chart"
          className="absolute inset-0 h-full w-full"
        />
      </div>
    </div>
  );
}

export default function RoadmapPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#050505] text-white">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(255,48,48,0.12),transparent_35%),linear-gradient(180deg,#080808,#030303)]" />

      <main className="mx-auto max-w-7xl px-4 pb-20 pt-6 sm:px-6 lg:px-8">
        <Reveal>
          <section className="relative overflow-hidden rounded-[42px] border border-white/10 bg-black/35 p-6 sm:p-10 lg:p-14">
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
                  <span className="text-red-500">PRESSURE.</span>
                </h1>

                <p className="mt-6 max-w-xl text-base font-semibold text-white/68">
                  The roadmap and live proof of what $MAD is building.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href="/mad-mind"
                    className="rounded-full bg-red-500 px-6 py-3 text-sm font-black text-white"
                  >
                    Enter MAD Mind
                  </Link>

                  <a
                    href={LINKS.buy}
                    target="_blank"
                    className="rounded-full border border-white/10 px-6 py-3 text-sm font-black text-white"
                  >
                    Buy $MAD
                  </a>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
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

        <Reveal delay={240}>
          <section className="mt-10">
            <LiveDexChartBlock />
          </section>
        </Reveal>

        <Reveal delay={360}>
          <section className="mt-10 rounded-[38px] border border-white/10 bg-black/30 p-6 sm:p-8 lg:p-10">
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
          <section className="mt-10 rounded-[38px] border border-white/10 bg-[linear-gradient(180deg,rgba(30,0,0,0.86),rgba(8,0,0,0.96))] p-6 text-center sm:p-8 lg:p-10">
            <SectionHeading
              eyebrow="Next Move"
              title="Still early. Still building."
              body="Turn pressure into progress, progress into identity, identity into a real ecosystem."
              center
            />

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <a
                href={LINKS.telegram}
                target="_blank"
                className="rounded-full bg-red-500 px-6 py-3 text-sm font-black text-white"
              >
                Join Telegram
              </a>

              <a
                href={LINKS.x}
                target="_blank"
                className="rounded-full border border-white/10 px-6 py-3 text-sm font-black text-white"
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
