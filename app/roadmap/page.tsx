"use client";

import Image from "next/image";
import type { ReactNode } from "react";

const LINKS = {
  telegram: "https://t.me/MadOfficalChannel",
  x: "https://x.com/madrichclub_",
  buy: "https://jup.ag/tokens/Fa7ZE9nCEYnrHsnoeHuhEExJpchtrBtKXnWe6CgHpump",
  dex: "https://dexscreener.com/solana/gt3dwhhkrd2mnqmmchpzdetpg4ttaa23exn1m2vwinfs",
} as const;

const STATUS_CARDS = [
  { label: "Website", value: "LIVE NOW", tone: "green" },
  { label: "MAD Mind", value: "LIVE NOW", tone: "green" },
  { label: "Confessions", value: "LIVE NOW", tone: "green" },
  { label: "400M Burn", value: "COMPLETE", tone: "green" },
  { label: "MAD AI", value: "IN PROGRESS", tone: "red" },
  { label: "Stickers", value: "COMPLETE", tone: "green" },
  { label: "Clothing", value: "TESTING", tone: "red" },
  { label: "800M Goal", value: "FINAL GOAL", tone: "red" },
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
        className,
      )}
    >
      {children}
    </section>
  );
}

function GlobeBackdrop() {
  return (
    <div className="pointer-events-none absolute right-[-8%] top-[-10%] hidden h-[520px] w-[520px] overflow-hidden rounded-full opacity-30 lg:block">
      <div className="absolute inset-0 rounded-full border border-red-500/20 bg-[radial-gradient(circle_at_35%_35%,rgba(255,0,0,0.24),rgba(255,0,0,0.06)_38%,transparent_65%)] shadow-[0_0_70px_rgba(255,0,0,0.16)]" />
      <div className="absolute inset-0 rounded-full bg-[repeating-linear-gradient(to_right,rgba(255,0,0,0.13)_0px,rgba(255,0,0,0.13)_1px,transparent_1px,transparent_44px),repeating-linear-gradient(to_bottom,rgba(255,0,0,0.11)_0px,rgba(255,0,0,0.11)_1px,transparent_1px,transparent_44px)] opacity-60" />
      <div className="absolute inset-[9%] rounded-full border border-red-500/18" />
      <div className="absolute inset-[22%] rounded-full border border-red-500/14" />
      <div className="absolute inset-[35%] rounded-full border border-red-500/10" />
      <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black via-black/20 to-transparent" />
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body: string;
}) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-red-200/80">
        {eyebrow}
      </p>

      <h2 className="mt-3 text-4xl font-black tracking-[-0.04em] text-white sm:text-6xl">
        {title}
      </h2>

      <p className="mt-4 max-w-3xl text-base leading-8 text-white/78 sm:text-lg">
        {body}
      </p>
    </div>
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
          "border border-emerald-400/30 bg-emerald-500/12 text-emerald-200 shadow-[0_0_18px_rgba(16,185,129,0.12)]",
        tone === "red" &&
          "border border-red-500/30 bg-red-500/12 text-red-100 shadow-[0_0_18px_rgba(255,0,0,0.12)]",
        tone === "default" &&
          "border border-white/10 bg-white/[0.05] text-white/85",
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
}: {
  label: string;
  value: string;
  tone: "red" | "green";
}) {
  return (
    <div
      className={cn(
        "rounded-[1.25rem] border p-4 transition duration-300 hover:-translate-y-0.5",
        tone === "green"
          ? "border-emerald-400/35 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.22),rgba(0,0,0,0.78))] shadow-[0_0_25px_rgba(16,185,129,0.15)]"
          : "border-red-500/25 bg-[radial-gradient(circle_at_top_left,rgba(255,0,0,0.16),rgba(0,0,0,0.78))] shadow-[0_0_20px_rgba(255,0,0,0.08)]",
      )}
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/58">
        {label}
      </p>

      <p
        className={cn(
          "mt-3 text-xl font-black sm:text-2xl",
          tone === "green" ? "text-emerald-300" : "text-red-100",
        )}
      >
        {value}
      </p>
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
    <div className="rounded-[1.6rem] border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.025),rgba(255,255,255,0.012))] p-5 transition duration-300 hover:border-white/20 hover:bg-white/[0.035]">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-red-200/85">
            {phase}
          </p>
          <h3 className="mt-2 text-2xl font-black text-white">{title}</h3>
        </div>

        <div
          className={cn(
            "rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em]",
            status === "Completed" &&
              "border-emerald-400/30 bg-emerald-500/14 text-emerald-100",
            status === "Building" &&
              "border-red-500/30 bg-red-500/14 text-red-100",
            status === "Next" &&
              "border-white/15 bg-white/[0.06] text-white/85",
          )}
        >
          {status}
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {bullets.map((item) => (
          <div
            key={item}
            className="rounded-[1rem] border border-white/12 bg-white/[0.04] px-4 py-3 text-sm font-medium text-white/88 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]"
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

function OrbitIcon({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "absolute flex items-center justify-center rounded-full border border-red-500/25 bg-[radial-gradient(circle_at_top,rgba(255,40,40,0.25),rgba(0,0,0,0.92))] shadow-[0_0_24px_rgba(255,0,0,0.18)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

function BuildCoreOrbit() {
  return (
    <div className="relative flex min-h-[430px] items-center justify-center">
      <div className="absolute h-[280px] w-[280px] rounded-full border border-red-500/20 shadow-[0_0_80px_rgba(255,0,0,0.18)]" />
      <div className="absolute h-[360px] w-[360px] rounded-full border border-red-500/10" />
      <div className="absolute h-[430px] w-[430px] rounded-full border border-red-500/6" />

      <div className="absolute h-[340px] w-[470px] rotate-[14deg] rounded-full border border-red-500/14" />
      <div className="absolute h-[300px] w-[420px] -rotate-[18deg] rounded-full border border-red-500/10" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,0,0,0.22),transparent_42%)]" />

      <OrbitIcon className="left-[16%] top-[20%] h-20 w-20">
        <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-black/40 text-lg font-black text-red-300">
          $MAD
        </div>
      </OrbitIcon>

      <OrbitIcon className="left-[20%] bottom-[14%] h-24 w-24 rotate-[-18deg]">
        <div className="text-5xl">🎮</div>
      </OrbitIcon>

      <OrbitIcon className="right-[10%] top-[14%] h-24 w-24 rotate-[12deg]">
        <div className="text-5xl">👕</div>
      </OrbitIcon>

      <OrbitIcon className="right-[6%] bottom-[20%] h-24 w-24">
        <div className="text-5xl">🤖</div>
      </OrbitIcon>

      <OrbitIcon className="top-[2%] h-20 w-20">
        <div className="text-4xl">😡</div>
      </OrbitIcon>

      <OrbitIcon className="bottom-[8%] right-[24%] h-14 w-14">
        <div className="text-2xl">🪙</div>
      </OrbitIcon>

      <div className="relative z-10 text-center">
        <div className="mx-auto flex h-60 w-60 items-center justify-center rounded-[2.2rem] border border-red-500/20 bg-[radial-gradient(circle_at_center,rgba(255,0,0,0.22),rgba(20,0,0,0.6)_52%,rgba(0,0,0,0.96))] shadow-[0_0_60px_rgba(255,0,0,0.25)]">
          <div className="rounded-[2rem] border border-white/10 bg-black/55 px-10 py-10 shadow-[0_0_30px_rgba(255,0,0,0.12)]">
            <div className="text-5xl font-black text-red-500">$MAD</div>
            <div className="mt-3 text-xs uppercase tracking-[0.28em] text-white/60">
              Build Core
            </div>
          </div>
        </div>
      </div>

      <div className="absolute left-[24%] top-[26%] h-2 w-2 rounded-full bg-red-400 shadow-[0_0_12px_rgba(255,0,0,0.8)]" />
      <div className="absolute right-[20%] top-[20%] h-2 w-2 rounded-full bg-red-400 shadow-[0_0_12px_rgba(255,0,0,0.8)]" />
      <div className="absolute bottom-[18%] left-[28%] h-2 w-2 rounded-full bg-red-400 shadow-[0_0_12px_rgba(255,0,0,0.8)]" />
      <div className="absolute right-[26%] bottom-[10%] h-2 w-2 rounded-full bg-red-400 shadow-[0_0_12px_rgba(255,0,0,0.8)]" />
    </div>
  );
}

function BurnGoalBlock() {
  return (
    <Shell className="p-6 sm:p-8">
      <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-red-200/80">
        Supply Goal
      </p>

      <h3 className="mt-4 text-4xl font-black leading-[0.95] text-white sm:text-5xl">
        Burn progress
      </h3>

      <p className="mt-4 max-w-xl text-base leading-8 text-white/78">
        400M tokens already burned. Final target is 800M.
      </p>

      <div className="mt-7">
        <div className="flex items-center justify-between text-sm font-black text-white">
          <span>400M burned</span>
          <span>800M goal</span>
        </div>

        <div className="mt-3 h-4 overflow-hidden rounded-full bg-white/10">
          <div className="h-full w-1/2 rounded-full bg-[linear-gradient(90deg,#22c55e,#16a34a)] shadow-[0_0_20px_rgba(34,197,94,0.25)]" />
        </div>

        <div className="mt-3 text-sm text-white/72">
          50% of final burn goal complete.
        </div>
      </div>

      <div className="mt-7 flex flex-wrap gap-3">
        <HeroPill tone="green">400M COMPLETE</HeroPill>
        <HeroPill tone="red">800M TARGET</HeroPill>
      </div>
    </Shell>
  );
}

function MerchPrototypeBlock() {
  return (
    <Shell className="p-0">
      <div className="grid gap-0 lg:grid-cols-[0.78fr_1.22fr]">
        <div className="flex flex-col justify-between p-6 sm:p-8">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-red-200/80">
              Merch Prototype
            </p>

            <h3 className="mt-4 text-4xl font-black leading-[0.95] text-white sm:text-6xl">
              MAD
              <br />
              <span className="text-red-500 drop-shadow-[0_0_12px_rgba(255,0,0,0.45)]">
                RICH.
              </span>
            </h3>

            <p className="mt-5 max-w-sm text-base leading-8 text-white/78">
              The sticker line is done. Clothing is now moving from idea into
              real-world prototype phase.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <HeroPill tone="red">CLOTHING PROTOTYPE</HeroPill>
            <HeroPill>MORE PIECES LATER</HeroPill>
          </div>
        </div>

        <div className="relative min-h-[520px]">
          <Image
            src="/merch/MAD-MERCH-SAMPLE-SHIRT.jpg"
            alt="MAD merch sample shirt"
            fill
            sizes="(max-width: 1024px) 100vw, 900px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
        </div>
      </div>
    </Shell>
  );
}

function LiveDexChartBlock() {
  return (
    <Shell className="overflow-hidden p-0">
      <div className="border-b border-white/10 px-6 py-5 sm:px-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-red-200/80">
          Public Since Day One
        </p>

        <h3 className="mt-3 text-3xl font-black text-white sm:text-4xl">
          Live market chart.
        </h3>

        <p className="mt-3 max-w-xl text-sm leading-7 text-white/78">
          Launch, growth, pullback, rebuild — visible in real time.
        </p>
      </div>

      <div className="relative h-[760px] w-full bg-black">
        <div className="absolute right-4 top-4 z-20 rounded-full border border-emerald-400/30 bg-emerald-500/14 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-emerald-200 shadow-[0_0_14px_rgba(16,185,129,0.18)]">
          LIVE
        </div>

        <iframe
          src="https://dexscreener.com/solana/gt3dwhhkrd2mnqmmchpzdetpg4ttaa23exn1m2vwinfs?embed=1&theme=dark&trades=0&info=1"
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
          Open Full DexScreener →
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
          <Shell className="relative p-6 sm:p-8 lg:p-10">
            <GlobeBackdrop />

            <div className="relative z-10 grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
              <div>
                <div className="inline-flex rounded-full border border-red-500/25 bg-red-500/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-red-200">
                  The Mad Path
                </div>

                <h1 className="mt-6 text-[3rem] font-black leading-[0.9] tracking-[-0.05em] text-white sm:text-[4.4rem]">
                  BUILD.
                  <br />
                  PROVE.
                  <br />
                  <span className="text-red-500 drop-shadow-[0_0_16px_rgba(255,0,0,0.5)]">
                    EXPAND.
                  </span>
                </h1>

                <p className="mt-5 max-w-xl text-base leading-8 text-white/82">
                  Lore, roadmap, and real proof of what $MAD is building.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <HeroPill tone="green">LIVE</HeroPill>
                  <HeroPill tone="red">BUILDING</HeroPill>
                  <HeroPill>NEXT</HeroPill>
                </div>
              </div>

              <BuildCoreOrbit />
            </div>
          </Shell>

          <div className="grid gap-3 md:grid-cols-4 xl:grid-cols-8">
            {STATUS_CARDS.map((card) => (
              <StatusMiniCard
                key={card.label}
                label={card.label}
                value={card.value}
                tone={card.tone}
              />
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <MerchPrototypeBlock />
            <LiveDexChartBlock />
          </div>

          <BurnGoalBlock />

          <Shell className="p-6 sm:p-8">
            <SectionHeading
              eyebrow="Timeline"
              title="The roadmap"
              body="See what is done, what is building, and what comes next."
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

          <Shell className="p-6 sm:p-8">
            <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
              <div className="flex items-center gap-5">
                <div className="flex h-24 w-24 items-center justify-center rounded-full border border-red-500/30 bg-red-500/14 text-4xl font-black text-red-300 shadow-[0_0_30px_rgba(255,0,0,0.22)]">
                  $
                </div>

                <div>
                  <h2 className="text-3xl font-black text-white sm:text-5xl">
                    THIS IS YOUR PATH.
                  </h2>
                  <p className="mt-2 text-base leading-8 text-white/82">
                    Lore, proof, roadmap, and the real build of $MAD in one
                    place.
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
        </div>
      </main>
    </div>
  );
}
