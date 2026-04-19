"use client";

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

const ROADMAP_PHASES = [
  {
    phase: "PHASE 01",
    title: "Brand + Foundation",
    status: "Completed",
    tone: "green",
    x: "18%",
    y: "74%",
    align: "left",
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
    tone: "green",
    x: "42%",
    y: "53%",
    align: "left",
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
    tone: "red",
    x: "67%",
    y: "36%",
    align: "left",
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
    tone: "red",
    x: "86%",
    y: "20%",
    align: "right",
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
          "border border-emerald-400/30 bg-emerald-500/12 text-emerald-200 shadow-[0_0_18px_rgba(16,185,129,0.14)]",
        tone === "red" &&
          "border border-red-500/30 bg-red-500/12 text-red-100 shadow-[0_0_18px_rgba(255,0,0,0.14)]",
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
        "rounded-[1.25rem] border p-4 transition duration-300 hover:-translate-y-0.5",
        tone === "green"
          ? "border-emerald-400/35 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.22),rgba(0,0,0,0.84))] shadow-[0_0_25px_rgba(16,185,129,0.15)]"
          : "border-red-500/25 bg-[radial-gradient(circle_at_top_left,rgba(255,0,0,0.16),rgba(0,0,0,0.84))] shadow-[0_0_20px_rgba(255,0,0,0.08)]"
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

function RoadmapProgress() {
  return (
    <div className="mt-8 max-w-[33rem]">
      <div className="mb-3 flex items-center justify-between gap-4 text-sm font-black text-white">
        <span className="uppercase tracking-[0.16em]">Overall Progress</span>
        <span className="text-emerald-300">65% COMPLETE</span>
      </div>

      <div className="h-4 overflow-hidden rounded-full bg-white/10">
        <div className="h-full w-[65%] rounded-full bg-[linear-gradient(90deg,#16a34a,#34d399)] shadow-[0_0_25px_rgba(16,185,129,0.35)]" />
      </div>
    </div>
  );
}

function PhaseBadge({
  status,
  tone,
}: {
  status: string;
  tone: "green" | "red";
}) {
  return (
    <div
      className={cn(
        "inline-flex rounded-full border px-4 py-1 text-[10px] font-black uppercase tracking-[0.22em]",
        tone === "green"
          ? "border-emerald-400/30 bg-emerald-500/14 text-emerald-100"
          : "border-red-500/30 bg-red-500/14 text-red-100",
        status === "Next" && "border-white/15 bg-white/[0.06] text-white/85"
      )}
    >
      {status}
    </div>
  );
}

function MilestonePost({ tone }: { tone: "green" | "red" }) {
  return (
    <div className="absolute left-1/2 top-full flex -translate-x-1/2 flex-col items-center">
      <div
        className={cn(
          "h-12 w-[3px]",
          tone === "green"
            ? "bg-emerald-400/80 shadow-[0_0_18px_rgba(16,185,129,0.55)]"
            : "bg-red-500/80 shadow-[0_0_18px_rgba(255,0,0,0.45)]"
        )}
      />
      <div
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-full border text-xl font-black",
          tone === "green"
            ? "border-emerald-400/40 bg-black shadow-[0_0_18px_rgba(16,185,129,0.4)]"
            : "border-red-500/40 bg-black shadow-[0_0_18px_rgba(255,0,0,0.3)]"
        )}
      >
        {tone === "green" ? "✓" : "•"}
      </div>
    </div>
  );
}

function PhaseBullet({
  item,
  tone,
}: {
  item: string;
  tone: "green" | "red";
}) {
  return (
    <div className="flex items-start gap-3 rounded-[1rem] border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-medium text-white/88 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
      <div
        className={cn(
          "mt-0.5 h-3.5 w-3.5 shrink-0 rounded-full border",
          tone === "green"
            ? "border-emerald-400/45 bg-emerald-400/20"
            : "border-red-500/45 bg-red-500/20"
        )}
      />
      <div>{item}</div>
    </div>
  );
}

function RoadPhaseCard({
  phase,
  title,
  status,
  bullets,
  tone,
  style,
}: {
  phase: string;
  title: string;
  status: string;
  bullets: readonly string[];
  tone: "green" | "red";
  style: React.CSSProperties;
}) {
  return (
    <div className="absolute z-20" style={style}>
      <div
        className={cn(
          "relative w-[17rem] rounded-[1.8rem] border bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.02))] p-5 backdrop-blur-xl",
          tone === "green"
            ? "border-emerald-400/40 shadow-[0_0_35px_rgba(16,185,129,0.18)]"
            : "border-red-500/35 shadow-[0_0_35px_rgba(255,0,0,0.12)]"
        )}
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/60">
          {phase}
        </p>

        <h3 className="mt-3 text-[2rem] font-black leading-[0.95] text-white">
          {title}
        </h3>

        <div className="mt-4">
          <PhaseBadge status={status} tone={tone} />
        </div>

        <div className="mt-5 grid gap-3">
          {bullets.map((item) => (
            <PhaseBullet key={item} item={item} tone={tone} />
          ))}
        </div>

        <MilestonePost tone={tone} />
      </div>
    </div>
  );
}

function MountainLayer() {
  return (
    <>
      <div className="absolute inset-x-0 bottom-0 h-[44%] bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.12)_18%,rgba(0,0,0,0.92))]" />
      <div className="absolute left-[-6%] bottom-[18%] h-[34%] w-[44%] rotate-[-6deg] bg-[radial-gradient(circle_at_60%_40%,rgba(90,90,90,0.16),rgba(0,0,0,0)_58%)] [clip-path:polygon(0%_100%,18%_60%,36%_72%,48%_42%,64%_78%,80%_48%,100%_100%)]" />
      <div className="absolute right-[-4%] bottom-[16%] h-[40%] w-[48%] bg-[radial-gradient(circle_at_40%_35%,rgba(90,90,90,0.16),rgba(0,0,0,0)_58%)] [clip-path:polygon(0%_100%,14%_52%,28%_68%,44%_34%,60%_70%,78%_42%,100%_100%)]" />
      <div className="absolute left-[28%] bottom-[34%] h-[24%] w-[20%] bg-[radial-gradient(circle_at_50%_30%,rgba(80,80,80,0.14),rgba(0,0,0,0)_64%)] [clip-path:polygon(0%_100%,20%_44%,38%_64%,58%_28%,74%_56%,100%_100%)]" />
    </>
  );
}

function RoadScene() {
  return (
    <div className="relative min-h-[980px] overflow-hidden rounded-[2.2rem] border border-white/10 bg-[radial-gradient(circle_at_50%_10%,rgba(255,255,255,0.04),transparent_22%),linear-gradient(180deg,#020305,#040507_32%,#090909_100%)]">
      <MountainLayer />

      <div className="absolute inset-0">
        <svg
          viewBox="0 0 1000 1000"
          className="absolute inset-0 h-full w-full"
          preserveAspectRatio="none"
        >
          <defs>
            <filter id="softGlowGreen">
              <feGaussianBlur stdDeviation="7" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="softGlowRed">
              <feGaussianBlur stdDeviation="7" result="blur2" />
              <feMerge>
                <feMergeNode in="blur2" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="roadFill" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1b1b1d" />
              <stop offset="100%" stopColor="#2b2b31" />
            </linearGradient>
            <linearGradient id="leftGlow" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="45%" stopColor="#34d399" />
              <stop offset="58%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#f87171" />
            </linearGradient>
          </defs>

          <path
            d="M165 880 C 285 820, 370 805, 455 770 C 560 725, 622 660, 690 590 C 772 505, 822 410, 840 280 C 848 218, 873 160, 928 110"
            stroke="rgba(0,0,0,0.78)"
            strokeWidth="148"
            strokeLinecap="round"
            fill="none"
          />

          <path
            d="M165 880 C 285 820, 370 805, 455 770 C 560 725, 622 660, 690 590 C 772 505, 822 410, 840 280 C 848 218, 873 160, 928 110"
            stroke="url(#roadFill)"
            strokeWidth="128"
            strokeLinecap="round"
            fill="none"
          />

          <path
            d="M165 880 C 285 820, 370 805, 455 770 C 560 725, 622 660, 690 590 C 772 505, 822 410, 840 280 C 848 218, 873 160, 928 110"
            stroke="url(#leftGlow)"
            strokeWidth="8"
            strokeLinecap="round"
            fill="none"
            filter="url(#softGlowRed)"
            opacity="0.95"
          />

          <path
            d="M145 892 C 265 832, 350 817, 438 782 C 544 738, 606 672, 676 600 C 758 516, 808 420, 826 292 C 834 230, 859 171, 914 122"
            stroke="rgba(255,255,255,0.8)"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
            opacity="0.8"
          />

          <path
            d="M184 867 C 304 807, 388 792, 472 758 C 575 716, 637 651, 704 580 C 786 496, 836 401, 854 269 C 862 207, 886 150, 943 98"
            stroke="rgba(255,180,180,0.7)"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
            opacity="0.78"
          />

          <path
            d="M164 880 C 284 820, 369 805, 454 770 C 559 725, 621 660, 689 590 C 771 505, 821 410, 839 280 C 847 218, 872 160, 927 110"
            stroke="rgba(255,255,255,0.35)"
            strokeWidth="2.5"
            strokeDasharray="18 20"
            strokeLinecap="round"
            fill="none"
          />
        </svg>

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_82%,rgba(16,185,129,0.16),transparent_16%),radial-gradient(circle_at_67%_38%,rgba(255,0,0,0.18),transparent_22%),radial-gradient(circle_at_88%_16%,rgba(255,255,255,0.08),transparent_10%)]" />
      </div>

      <RoadPhaseCard
        phase={ROADMAP_PHASES[0].phase}
        title={ROADMAP_PHASES[0].title}
        status={ROADMAP_PHASES[0].status}
        bullets={ROADMAP_PHASES[0].bullets}
        tone={ROADMAP_PHASES[0].tone}
        style={{ left: "8%", bottom: "20%" }}
      />

      <RoadPhaseCard
        phase={ROADMAP_PHASES[1].phase}
        title={ROADMAP_PHASES[1].title}
        status={ROADMAP_PHASES[1].status}
        bullets={ROADMAP_PHASES[1].bullets}
        tone={ROADMAP_PHASES[1].tone}
        style={{ left: "33%", bottom: "42%" }}
      />

      <RoadPhaseCard
        phase={ROADMAP_PHASES[2].phase}
        title={ROADMAP_PHASES[2].title}
        status={ROADMAP_PHASES[2].status}
        bullets={ROADMAP_PHASES[2].bullets}
        tone={ROADMAP_PHASES[2].tone}
        style={{ left: "58%", bottom: "56%" }}
      />

      <RoadPhaseCard
        phase={ROADMAP_PHASES[3].phase}
        title={ROADMAP_PHASES[3].title}
        status={ROADMAP_PHASES[3].status}
        bullets={ROADMAP_PHASES[3].bullets}
        tone={ROADMAP_PHASES[3].tone}
        style={{ right: "5%", top: "7%" }}
      />

      <div className="absolute left-[21%] top-[79%] h-16 w-16 rounded-full border border-emerald-400/30 bg-black/75 shadow-[0_0_18px_rgba(16,185,129,0.35)]" />
      <div className="absolute left-[46%] top-[57%] h-16 w-16 rounded-full border border-emerald-400/24 bg-black/75 shadow-[0_0_18px_rgba(16,185,129,0.28)]" />
      <div className="absolute left-[71%] top-[40%] h-16 w-16 rounded-full border border-red-500/28 bg-black/75 shadow-[0_0_18px_rgba(255,0,0,0.24)]" />
      <div className="absolute left-[88%] top-[23%] h-16 w-16 rounded-full border border-red-500/24 bg-black/75 shadow-[0_0_18px_rgba(255,0,0,0.22)]" />
    </div>
  );
}

function RoadmapHero() {
  return (
    <Shell className="relative p-6 sm:p-8 lg:p-10">
      <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
        <div className="relative z-10">
          <div className="inline-flex rounded-full border border-red-500/25 bg-red-500/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-red-200">
            The Mad Path
          </div>

          <h1 className="mt-6 text-[3rem] font-black leading-[0.92] tracking-[-0.05em] text-white sm:text-[5rem]">
            The roadmap
            <br />
            to{" "}
            <span className="text-red-500 drop-shadow-[0_0_16px_rgba(255,0,0,0.5)]">
              greatness.
            </span>
          </h1>

          <p className="mt-5 max-w-xl text-base leading-8 text-white/82 sm:text-lg">
            See what is done, what is building, and what comes next.
          </p>

          <RoadmapProgress />
        </div>

        <RoadScene />
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
            Lore, proof, roadmap, and the real build of $MAD in one place.
          </p>
        </div>

        <div>
          <a
            href={LINKS.buy}
            target="_blank"
            rel="noreferrer"
            className="inline-flex rounded-full border border-emerald-400/35 bg-emerald-500 px-8 py-4 text-base font-black text-black shadow-[0_0_22px_rgba(16,185,129,0.24)] transition hover:scale-[1.02] hover:bg-emerald-400"
          >
            Start Your Journey →
          </a>
        </div>
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
