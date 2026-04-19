"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const LINKS = {
  telegram: "https://t.me/MadOfficialChannel",
  x: "https://x.com/madrichclub_",
  buy: "https://jup.ag/tokens/Fa7ZE9nCEYnrHsnoeHuhEExJpchtrBtKXnWe6CgHpump",
  dex: "https://dexscreener.com/solana/gt3dwhhkrd2mnqmmchpzdetpg4ttaa23exn1m2vwinfs",
} as const;

const STATUS_CARDS = [
  { label: "Website", value: "Completed", tone: "green", icon: "◉" },
  { label: "MAD Mind", value: "Completed", tone: "green", icon: "◎" },
  { label: "Confessions", value: "Completed", tone: "green", icon: "◌" },
  { label: "400M Burned", value: "Completed", tone: "green", icon: "◍" },
  { label: "MAD AI", value: "Building", tone: "red", icon: "✦" },
  { label: "Stickers", value: "Completed", tone: "green", icon: "⬢" },
  { label: "Clothing", value: "Prototype", tone: "red", icon: "⬡" },
  { label: "800M Goal", value: "Target", tone: "red", icon: "◔" },
] as const;

const HOW_IT_WORKS = [
  {
    step: "1. START",
    text: "Enter the MAD world and follow the first builds.",
    icon: "◔",
  },
  {
    step: "2. COMPLETE",
    text: "Each launch, tool, burn, and product pushes the path forward.",
    icon: "☷",
  },
  {
    step: "3. EARN",
    text: "As the brand grows, the ecosystem gets stronger and more visible.",
    icon: "$",
  },
  {
    step: "4. UNLOCK",
    text: "More tech, more games, more merch, more reach.",
    icon: "♛",
  },
] as const;

const ROADMAP_PHASES = [
  {
    phase: "PHASE 01",
    title: "Brand + Foundation",
    status: "Completed",
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
    bullets: [
      "MAD Confessions live",
      "Exchange visibility live",
      "400M tokens burned completed",
      "Community growth active",
    ],
  },
  {
    phase: "PHASE 03",
    title: "Tech + Expansion",
    status: "Building",
    bullets: [
      "MAD Mind live",
      "MAD AI building",
      "Sticker merch completed",
      "Clothing prototype started",
    ],
  },
  {
    phase: "PHASE 04",
    title: "Big Goal",
    status: "Next",
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
        show ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0",
      )}
    >
      {children}
    </div>
  );
}

function Shell({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.015))] shadow-[0_18px_50px_rgba(0,0,0,0.35)] backdrop-blur-xl",
        className,
      )}
    >
      {children}
    </section>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-red-200/80">
      {children}
    </p>
  );
}

function HeroBadge({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex rounded-full border border-red-500/25 bg-red-500/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-red-200">
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
    <div className="rounded-[1.25rem] border border-white/10 bg-black/25 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/42">
            {label}
          </p>
          <p
            className={cn(
              "mt-2 text-base font-black",
              tone === "green" ? "text-emerald-300" : "text-red-200",
            )}
          >
            {value}
          </p>
        </div>
        <div
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-full border text-sm font-black",
            tone === "green"
              ? "border-emerald-400/20 bg-emerald-500/10 text-emerald-300"
              : "border-red-500/20 bg-red-500/10 text-red-200",
          )}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

function HowCard({
  step,
  text,
  icon,
}: {
  step: string;
  text: string;
  icon: string;
}) {
  return (
    <div className="rounded-[1.25rem] border border-white/10 bg-black/25 p-4">
      <div className="flex gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-red-500/20 bg-red-500/10 text-lg font-black text-red-200">
          {icon}
        </div>
        <div>
          <p className="text-sm font-black text-white">{step}</p>
          <p className="mt-1 text-sm leading-6 text-white/62">{text}</p>
        </div>
      </div>
    </div>
  );
}

function ProgressStat({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-[1.25rem] border border-white/10 bg-black/20 p-4 text-center">
      <div className="text-3xl font-black text-white">{value}</div>
      <div className="mt-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/45">
        {label}
      </div>
    </div>
  );
}

function RoadmapCard({
  phase,
  title,
  status,
  bullets,
}: {
  phase: string;
  title: string;
  status: string;
  bullets: readonly string[];
}) {
  return (
    <div className="rounded-[1.6rem] border border-white/10 bg-black/20 p-5 transition duration-300 hover:border-white/20 hover:bg-white/[0.03]">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-red-200/80">
            {phase}
          </p>
          <h3 className="mt-2 text-2xl font-black text-white">{title}</h3>
        </div>

        <div
          className={cn(
            "rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em]",
            status === "Completed" &&
              "border-emerald-400/20 bg-emerald-500/10 text-emerald-200",
            status === "Building" &&
              "border-red-500/20 bg-red-500/10 text-red-100",
            status === "Next" &&
              "border-white/10 bg-white/[0.05] text-white/70",
          )}
        >
          {status}
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {bullets.map((item) => (
          <div
            key={item}
            className="rounded-[1rem] border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/72"
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

function AnimatedGraphBlock() {
  const bars = [22, 38, 24, 54, 81, 47, 65, 42, 33, 48, 30, 44];

  return (
    <Shell className="p-6 sm:p-8">
      <Eyebrow>Reward System</Eyebrow>

      <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_0.95fr]">
        <div>
          <h2 className="text-4xl font-black leading-[0.95] text-white sm:text-5xl">
            Get rewarded for
            <br />
            being{" "}
            <span className="text-red-500 drop-shadow-[0_0_12px_rgba(255,0,0,0.45)]">
              active.
            </span>
          </h2>

          <p className="mt-5 max-w-md text-base leading-8 text-white/68">
            The more you participate, the more the path moves forward.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <div className="rounded-[1.2rem] border border-white/10 bg-black/20 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-red-200/80">
                Tier 1
              </p>
              <p className="mt-3 text-lg font-black text-white">Starter</p>
              <p className="mt-2 text-sm text-white/58">
                Easy missions, small rewards.
              </p>
            </div>
            <div className="rounded-[1.2rem] border border-white/10 bg-black/20 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-red-200/80">
                Tier 2
              </p>
              <p className="mt-3 text-lg font-black text-white">Grinder</p>
              <p className="mt-2 text-sm text-white/58">
                More missions, better rewards.
              </p>
            </div>
            <div className="rounded-[1.2rem] border border-white/10 bg-black/20 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-red-200/80">
                Tier 3
              </p>
              <p className="mt-3 text-lg font-black text-white">Legend</p>
              <p className="mt-2 text-sm text-white/58">
                Harder missions, biggest rewards.
              </p>
            </div>
          </div>

          <div className="mt-7">
            <a
              href={LINKS.x}
              target="_blank"
              rel="noreferrer"
              className="inline-flex rounded-full border border-red-500/35 bg-red-500/12 px-6 py-3 text-sm font-black text-red-200 transition hover:bg-red-500/20"
            >
              View Rewards →
            </a>
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-white/10 bg-black/25 p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/42">
            Activity Meter
          </p>
          <div className="mt-5 flex h-[260px] items-end gap-3 rounded-[1.25rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(0,0,0,0.35))] p-5">
            {bars.map((h, i) => (
              <div key={i} className="flex flex-1 items-end">
                <div
                  className="w-full rounded-t-[0.8rem] bg-[linear-gradient(180deg,#ff3b3b,#7f1313)] shadow-[0_0_18px_rgba(255,0,0,0.22)]"
                  style={{ height: `${h * 2.2}px` }}
                />
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between text-xs uppercase tracking-[0.22em] text-white/42">
            <span>Early</span>
            <span>Now</span>
          </div>
        </div>
      </div>
    </Shell>
  );
}

function UtilityBlock() {
  return (
    <Shell className="p-6 sm:p-8">
      <Eyebrow>Utility + Access</Eyebrow>

      <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <h2 className="text-4xl font-black leading-[0.95] text-white sm:text-5xl">
            $MAD unlocks
            <br />
            the{" "}
            <span className="text-red-500 drop-shadow-[0_0_12px_rgba(255,0,0,0.45)]">
              MAD
            </span>{" "}
            universe.
          </h2>

          <p className="mt-5 max-w-md text-base leading-8 text-white/68">
            Games, content, perks, and more layers as the brand expands.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <div className="rounded-[1.2rem] border border-white/10 bg-black/20 p-4">
              <p className="text-lg font-black text-white">Games</p>
              <p className="mt-2 text-sm text-white/58">
                Access MAD game experiences.
              </p>
            </div>
            <div className="rounded-[1.2rem] border border-white/10 bg-black/20 p-4">
              <p className="text-lg font-black text-white">Exclusive</p>
              <p className="mt-2 text-sm text-white/58">
                Early drops, special access, WL spots.
              </p>
            </div>
            <div className="rounded-[1.2rem] border border-white/10 bg-black/20 p-4">
              <p className="text-lg font-black text-white">Perks</p>
              <p className="mt-2 text-sm text-white/58">
                More benefits as the universe grows.
              </p>
            </div>
            <div className="rounded-[1.2rem] border border-white/10 bg-black/20 p-4">
              <p className="text-lg font-black text-white">More Coming</p>
              <p className="mt-2 text-sm text-white/58">
                New tools and layers still in build mode.
              </p>
            </div>
          </div>

          <div className="mt-7">
            <Link
              href="/game"
              className="inline-flex rounded-full border border-red-500/35 bg-red-500/12 px-6 py-3 text-sm font-black text-red-200 transition hover:bg-red-500/20"
            >
              Learn More →
            </Link>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <div className="relative flex h-[320px] w-full items-center justify-center overflow-hidden rounded-[1.6rem] border border-white/10 bg-[radial-gradient(circle_at_center,rgba(255,0,0,0.18),rgba(0,0,0,0.08)_45%,transparent_70%)]">
            <div className="absolute h-[210px] w-[210px] rounded-full border border-red-500/25 shadow-[0_0_40px_rgba(255,0,0,0.18)]" />
            <div className="absolute h-[270px] w-[270px] rounded-full border border-red-500/10" />
            <div className="relative rounded-[2rem] border border-red-500/20 bg-black/55 px-10 py-14 text-center shadow-[0_0_40px_rgba(255,0,0,0.12)]">
              <div className="text-5xl font-black tracking-tight text-red-500">
                $MAD
              </div>
              <div className="mt-3 text-sm uppercase tracking-[0.26em] text-white/55">
                Access Portal
              </div>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}

function ProgressPanel() {
  return (
    <Shell className="p-6 sm:p-8">
      <Eyebrow>Your Progress</Eyebrow>

      <h2 className="mt-4 text-4xl font-black leading-[0.95] text-white sm:text-5xl">
        Track your{" "}
        <span className="text-red-500 drop-shadow-[0_0_12px_rgba(255,0,0,0.45)]">
          journey.
        </span>
      </h2>

      <p className="mt-5 max-w-md text-base leading-8 text-white/68">
        Every mission, build, and launch moves the MAD Path forward.
      </p>

      <div className="mt-8 rounded-[1.4rem] border border-white/10 bg-black/25 p-5">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-black/30 text-xl font-black text-white">
            $
          </div>
          <div className="flex-1">
            <p className="text-sm font-black text-white">MAD HOLDER</p>
            <p className="mt-1 text-xs uppercase tracking-[0.22em] text-white/45">
              Level 12
            </p>
          </div>
          <div className="rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-red-200">
            Live
          </div>
        </div>

        <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/10">
          <div className="h-full w-[72%] rounded-full bg-[linear-gradient(90deg,#ff4a4a,#ff1818)] shadow-[0_0_14px_rgba(255,0,0,0.25)]" />
        </div>

        <div className="mt-3 text-xs uppercase tracking-[0.22em] text-white/42">
          XP 8,450 / 12,000
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <ProgressStat value="24" label="Missions Completed" />
        <ProgressStat value="12,450" label="$MAD Earned" />
        <ProgressStat value="12" label="Current Level" />
      </div>

      <div className="mt-7">
        <a
          href={LINKS.telegram}
          target="_blank"
          rel="noreferrer"
          className="inline-flex rounded-full border border-red-500/35 bg-red-500/12 px-6 py-3 text-sm font-black text-red-200 transition hover:bg-red-500/20"
        >
          View My Progress →
        </a>
      </div>
    </Shell>
  );
}

function LiveDexChartBlock() {
  return (
    <Shell className="p-0">
      <div className="border-b border-white/10 px-6 py-5 sm:px-8">
        <Eyebrow>Public Since Day One</Eyebrow>
        <h3 className="mt-3 text-3xl font-black text-white sm:text-4xl">
          Live market chart.
        </h3>
        <p className="mt-3 max-w-xl text-sm leading-7 text-white/68">
          Launch, growth, pullback, and rebuild — all visible in public.
        </p>
      </div>

      <div className="relative aspect-[16/10] w-full bg-black">
        <iframe
          src={LINKS.dex}
          title="MAD live DexScreener chart"
          className="absolute inset-0 h-full w-full"
          loading="lazy"
          allowFullScreen
        />
      </div>

      <div className="border-t border-white/10 px-6 py-5 sm:px-8">
        <a
          href={LINKS.dex}
          target="_blank"
          rel="noreferrer"
          className="inline-flex rounded-full border border-red-500/35 bg-red-500/12 px-6 py-3 text-sm font-black text-red-200 transition hover:bg-red-500/20"
        >
          View on DexScreener →
        </a>
      </div>
    </Shell>
  );
}

function MerchPrototypeBlock() {
  return (
    <Shell className="p-0">
      <div className="grid gap-0 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="p-6 sm:p-8">
          <Eyebrow>Merch Prototype</Eyebrow>

          <h3 className="mt-4 text-4xl font-black leading-[0.95] text-white sm:text-6xl">
            MAD
            <br />
            <span className="text-red-500 drop-shadow-[0_0_12px_rgba(255,0,0,0.45)]">
              RICH.
            </span>
          </h3>

          <p className="mt-5 max-w-md text-base leading-8 text-white/68">
            The sticker line is done. Clothing is now moving from idea into real-world prototype phase.
          </p>

          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            <div className="rounded-[1.2rem] border border-white/10 bg-black/20 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/40">
                Status
              </p>
              <p className="mt-2 text-sm leading-7 text-white/70">
                Sample shirt created.
              </p>
            </div>
            <div className="rounded-[1.2rem] border border-white/10 bg-black/20 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/40">
                What It Proves
              </p>
              <p className="mt-2 text-sm leading-7 text-white/70">
                $MAD is becoming a real brand, not just a chart.
              </p>
            </div>
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
            <div className="rounded-full border border-red-500/25 bg-red-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-red-200">
              Clothing Prototype
            </div>
            <div className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-white/75">
              More Pieces Later
            </div>
          </div>
        </div>

        <div className="relative min-h-[520px]">
          <Image
            src="/merch/MAD-MERCH-SAMPLE-SHIRT.jpg"
            alt="MAD merch sample shirt"
            fill
            sizes="(max-width: 1024px) 100vw, 800px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
        </div>
      </div>
    </Shell>
  );
}

export default function RoadmapPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#050505] text-white">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(255,48,48,0.12),transparent_35%),radial-gradient(circle_at_20%_20%,rgba(255,0,60,0.10),transparent_30%),radial-gradient(circle_at_80%_30%,rgba(255,80,0,0.08),transparent_30%),linear-gradient(180deg,#080808,#030303)]" />

      <main className="mx-auto max-w-7xl px-4 pb-20 pt-6 sm:px-6 lg:px-8">
        <Reveal>
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <Shell className="relative p-6 sm:p-8">
              <GlobeBackdrop />

              <div className="relative z-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
                <div>
                  <HeroBadge>The MAD Path</HeroBadge>

                  <h1 className="mt-6 text-[3rem] font-black leading-[0.9] tracking-[-0.05em] text-white sm:text-[4.4rem]">
                    COMPLETE MISSIONS.
                    <br />
                    EARN{" "}
                    <span className="text-red-500 drop-shadow-[0_0_16px_rgba(255,0,0,0.5)]">
                      $MAD.
                    </span>
                  </h1>

                  <p className="mt-5 max-w-xl text-base leading-8 text-white/70">
                    The MAD Path is your journey inside the $MAD universe. Complete missions, track the build, and unlock bigger opportunities.
                  </p>

                  <div className="mt-8 grid gap-4 sm:grid-cols-3">
                    <div className="rounded-[1.2rem] border border-white/10 bg-black/20 p-4 text-center">
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-red-500/20 bg-red-500/10 text-lg font-black text-red-200">
                        ◎
                      </div>
                      <p className="mt-3 text-sm font-black text-white">
                        Complete Missions
                      </p>
                      <p className="mt-2 text-sm text-white/58">
                        Finish simple tasks across platforms.
                      </p>
                    </div>

                    <div className="rounded-[1.2rem] border border-white/10 bg-black/20 p-4 text-center">
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-red-500/20 bg-red-500/10 text-lg font-black text-red-200">
                        $
                      </div>
                      <p className="mt-3 text-sm font-black text-white">
                        Earn $MAD
                      </p>
                      <p className="mt-2 text-sm text-white/58">
                        Get rewarded for your actions.
                      </p>
                    </div>

                    <div className="rounded-[1.2rem] border border-white/10 bg-black/20 p-4 text-center">
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-red-500/20 bg-red-500/10 text-lg font-black text-red-200">
                        ▣
                      </div>
                      <p className="mt-3 text-sm font-black text-white">
                        Unlock More
                      </p>
                      <p className="mt-2 text-sm text-white/58">
                        Access bigger layers as the brand grows.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="relative flex min-h-[480px] items-center justify-center">
                  <div className="absolute h-[320px] w-[320px] rounded-full border border-red-500/20 shadow-[0_0_70px_rgba(255,0,0,0.18)]" />
                  <div className="absolute h-[390px] w-[390px] rounded-full border border-red-500/10" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,0,0,0.26),transparent_38%)]" />

                  <div className="relative text-center">
                    <div className="mx-auto flex h-64 w-64 items-center justify-center rounded-full border border-red-500/20 bg-[radial-gradient(circle_at_center,rgba(255,0,0,0.22),rgba(0,0,0,0.3)_55%,rgba(0,0,0,0.8))] shadow-[0_0_55px_rgba(255,0,0,0.2)]">
                      <div className="rounded-[2rem] border border-white/10 bg-black/55 px-10 py-10 shadow-[0_0_30px_rgba(255,0,0,0.12)]">
                        <div className="text-5xl font-black text-red-500">$MAD</div>
                        <div className="mt-3 text-xs uppercase tracking-[0.28em] text-white/50">
                          Mission Core
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Shell>

            <Shell className="p-6 sm:p-8">
              <Eyebrow>How It Works</Eyebrow>

              <div className="mt-6 space-y-4">
                {HOW_IT_WORKS.map((item) => (
                  <HowCard
                    key={item.step}
                    step={item.step}
                    text={item.text}
                    icon={item.icon}
                  />
                ))}
              </div>

              <div className="mt-7">
                <a
                  href={LINKS.telegram}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex w-full items-center justify-center rounded-full border border-red-500/35 bg-red-500/12 px-6 py-3 text-sm font-black text-red-200 transition hover:bg-red-500/20"
                >
                  View All Missions →
                </a>
              </div>
            </Shell>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="mt-6 grid gap-3 md:grid-cols-4 xl:grid-cols-8">
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
        </Reveal>

        <Reveal delay={220}>
          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            <AnimatedGraphBlock />
            <UtilityBlock />
            <ProgressPanel />
          </div>
        </Reveal>

        <Reveal delay={320}>
          <div className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <MerchPrototypeBlock />
            <LiveDexChartBlock />
          </div>
        </Reveal>

        <Reveal delay={400}>
          <Shell className="mt-6 p-6 sm:p-8">
            <SectionHeading
              eyebrow="Timeline"
              title="The roadmap"
              body="A cleaner, faster way to see what is finished, what is building, and what comes next."
            />

            <div className="mt-8 grid gap-4 xl:grid-cols-2">
              {ROADMAP_PHASES.map((phase) => (
                <RoadmapCard
                  key={phase.phase}
                  phase={phase.phase}
                  title={phase.title}
                  status={phase.status}
                  bullets={phase.bullets}
                />
              ))}
            </div>
          </Shell>
        </Reveal>

        <Reveal delay={480}>
          <Shell className="mt-6 p-6 sm:p-8">
            <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
              <div className="flex items-center gap-5">
                <div className="flex h-20 w-20 items-center justify-center rounded-full border border-red-500/20 bg-red-500/10 text-3xl font-black text-red-500 shadow-[0_0_24px_rgba(255,0,0,0.18)]">
                  $
                </div>

                <div>
                  <h2 className="text-3xl font-black text-white sm:text-5xl">
                    THIS IS YOUR PATH.
                  </h2>
                  <p className="mt-2 text-base leading-8 text-white/68">
                    Complete missions. Earn $MAD. Build the MAD life.
                  </p>
                </div>
              </div>

              <div>
                <a
                  href={LINKS.telegram}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex rounded-full border border-red-500/35 bg-red-500 px-8 py-4 text-base font-black text-white shadow-[0_0_18px_rgba(255,0,0,0.2)] transition hover:scale-[1.02] hover:bg-red-400"
                >
                  Start Your Journey →
                </a>
              </div>
            </div>
          </Shell>
        </Reveal>
      </main>
    </div>
  );
}
