"use client";

import type { ReactNode } from "react";

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

const LINKS = {
  buy: "https://jup.ag/swap?sell=So11111111111111111111111111111111111111112&buy=Fa7ZE9nCEYnrHsnoeHuhEExJpchtrBtKXnWe6CgHpump",
} as const;

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
          ? "border-emerald-400/35 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.2),rgba(0,0,0,0.9))] shadow-[0_0_25px_rgba(16,185,129,0.12)]"
          : "border-red-500/25 bg-[radial-gradient(circle_at_top_left,rgba(255,0,0,0.14),rgba(0,0,0,0.9))] shadow-[0_0_20px_rgba(255,0,0,0.08)]"
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

function Badge({
  children,
  tone,
}: {
  children: ReactNode;
  tone: "green" | "red" | "neutral";
}) {
  return (
    <div
      className={cn(
        "inline-flex rounded-full border px-4 py-1 text-[10px] font-black uppercase tracking-[0.22em]",
        tone === "green" &&
          "border-emerald-400/30 bg-emerald-500/14 text-emerald-100",
        tone === "red" && "border-red-500/30 bg-red-500/14 text-red-100",
        tone === "neutral" && "border-white/15 bg-white/[0.06] text-white/85"
      )}
    >
      {children}
    </div>
  );
}

function Bullet({
  children,
  tone,
}: {
  children: ReactNode;
  tone: "green" | "red" | "neutral";
}) {
  return (
    <div className="flex items-start gap-3 rounded-[1rem] border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-medium text-white/88 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
      <div
        className={cn(
          "mt-0.5 h-3.5 w-3.5 shrink-0 rounded-full border",
          tone === "green" &&
            "border-emerald-400/45 bg-emerald-400/20 shadow-[0_0_10px_rgba(16,185,129,0.3)]",
          tone === "red" &&
            "border-red-500/45 bg-red-500/20 shadow-[0_0_10px_rgba(255,0,0,0.22)]",
          tone === "neutral" && "border-white/25 bg-white/10"
        )}
      />
      <div>{children}</div>
    </div>
  );
}

function RoadCard({
  phase,
  title,
  status,
  tone,
  bullets,
  className = "",
}: {
  phase: string;
  title: string;
  status: string;
  tone: "green" | "red" | "neutral";
  bullets: readonly string[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "absolute z-20 w-[17rem] rounded-[1.8rem] border bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.015))] p-5 backdrop-blur-xl",
        tone === "green" &&
          "border-emerald-400/40 shadow-[0_0_35px_rgba(16,185,129,0.16)]",
        tone === "red" &&
          "border-red-500/35 shadow-[0_0_35px_rgba(255,0,0,0.12)]",
        tone === "neutral" &&
          "border-white/15 shadow-[0_0_30px_rgba(255,255,255,0.05)]",
        className
      )}
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/60">
        {phase}
      </p>

      <h3 className="mt-3 text-[2rem] font-black leading-[0.95] text-white">
        {title}
      </h3>

      <div className="mt-4">
        <Badge
          tone={
            tone === "green" ? "green" : tone === "red" ? "red" : "neutral"
          }
        >
          {status}
        </Badge>
      </div>

      <div className="mt-5 grid gap-3">
        {bullets.map((item) => (
          <Bullet
            key={item}
            tone={
              tone === "green" ? "green" : tone === "red" ? "red" : "neutral"
            }
          >
            {item}
          </Bullet>
        ))}
      </div>
    </div>
  );
}

function RoadPins() {
  return (
    <>
      <div className="absolute left-[22%] top-[71%] z-10 flex flex-col items-center">
        <div className="h-12 w-[3px] bg-emerald-400/80 shadow-[0_0_16px_rgba(16,185,129,0.45)]" />
        <div className="flex h-14 w-14 items-center justify-center rounded-full border border-emerald-400/40 bg-black text-2xl text-white shadow-[0_0_18px_rgba(16,185,129,0.38)]">
          ✓
        </div>
      </div>

      <div className="absolute left-[47%] top-[56%] z-10 flex flex-col items-center">
        <div className="h-10 w-[3px] bg-emerald-400/80 shadow-[0_0_16px_rgba(16,185,129,0.42)]" />
        <div className="flex h-14 w-14 items-center justify-center rounded-full border border-emerald-400/35 bg-black text-2xl text-white shadow-[0_0_16px_rgba(16,185,129,0.32)]">
          ✓
        </div>
      </div>

      <div className="absolute left-[68%] top-[40%] z-10 flex flex-col items-center">
        <div className="h-10 w-[3px] bg-red-500/80 shadow-[0_0_16px_rgba(255,0,0,0.35)]" />
        <div className="flex h-14 w-14 items-center justify-center rounded-full border border-red-500/40 bg-black text-2xl text-white shadow-[0_0_16px_rgba(255,0,0,0.25)]">
          •
        </div>
      </div>

      <div className="absolute left-[87%] top-[22%] z-10 flex flex-col items-center">
        <div className="h-10 w-[3px] bg-white/65 shadow-[0_0_14px_rgba(255,255,255,0.15)]" />
        <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-black text-xl text-white shadow-[0_0_14px_rgba(255,255,255,0.08)]">
          🔒
        </div>
      </div>
    </>
  );
}

function RoadCanvas() {
  return (
    <div className="relative h-[820px] overflow-hidden rounded-[2.2rem] border border-white/10 bg-[linear-gradient(180deg,#030406,#050607_35%,#090909_100%)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_12%,rgba(255,255,255,0.05),transparent_16%),radial-gradient(circle_at_70%_42%,rgba(255,0,0,0.16),transparent_20%),radial-gradient(circle_at_24%_74%,rgba(16,185,129,0.14),transparent_22%)]" />

      <div className="absolute left-[-8%] bottom-[18%] h-[34%] w-[42%] bg-[radial-gradient(circle_at_60%_40%,rgba(90,90,90,0.16),rgba(0,0,0,0)_58%)] [clip-path:polygon(0%_100%,18%_60%,36%_72%,48%_42%,64%_78%,80%_48%,100%_100%)]" />
      <div className="absolute right-[-4%] bottom-[14%] h-[41%] w-[47%] bg-[radial-gradient(circle_at_40%_35%,rgba(90,90,90,0.16),rgba(0,0,0,0)_58%)] [clip-path:polygon(0%_100%,14%_52%,28%_68%,44%_34%,60%_70%,78%_42%,100%_100%)]" />
      <div className="absolute left-[32%] bottom-[34%] h-[23%] w-[18%] bg-[radial-gradient(circle_at_50%_30%,rgba(80,80,80,0.14),rgba(0,0,0,0)_64%)] [clip-path:polygon(0%_100%,20%_44%,38%_64%,58%_28%,74%_56%,100%_100%)]" />

      <svg
        viewBox="0 0 1000 820"
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="roadFillDense" x1="10%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#232428" />
            <stop offset="100%" stopColor="#31333b" />
          </linearGradient>

          <linearGradient id="roadLeftEdgeDense" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="40%" stopColor="#34d399" />
            <stop offset="58%" stopColor="#f97316" />
            <stop offset="75%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#f8fafc" />
          </linearGradient>

          <filter id="roadGlowDense">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <path
          d="M170 760 C 255 705, 345 660, 430 603 C 545 527, 618 444, 690 355 C 760 270, 821 190, 930 78"
          stroke="rgba(0,0,0,0.82)"
          strokeWidth="160"
          strokeLinecap="round"
          fill="none"
        />

        <path
          d="M170 760 C 255 705, 345 660, 430 603 C 545 527, 618 444, 690 355 C 760 270, 821 190, 930 78"
          stroke="url(#roadFillDense)"
          strokeWidth="136"
          strokeLinecap="round"
          fill="none"
        />

        <path
          d="M146 777 C 232 720, 321 675, 408 618 C 523 541, 597 458, 669 368 C 741 282, 801 203, 911 92"
          stroke="rgba(240,255,255,0.78)"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />

        <path
          d="M193 741 C 278 686, 369 642, 454 587 C 569 512, 641 430, 713 342 C 783 258, 844 177, 950 65"
          stroke="rgba(255,210,210,0.7)"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />

        <path
          d="M146 777 C 232 720, 321 675, 408 618 C 523 541, 597 458, 669 368 C 741 282, 801 203, 911 92"
          stroke="url(#roadLeftEdgeDense)"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
          filter="url(#roadGlowDense)"
        />

        <path
          d="M170 760 C 255 705, 345 660, 430 603 C 545 527, 618 444, 690 355 C 760 270, 821 190, 930 78"
          stroke="rgba(255,255,255,0.34)"
          strokeWidth="3"
          strokeDasharray="18 18"
          strokeLinecap="round"
          fill="none"
        />
      </svg>

      <RoadCard
        phase="PHASE 01"
        title="Foundation"
        status="Complete"
        tone="green"
        bullets={[
          "Core brand philosophy established",
          "Smart contract framework built",
          "Community channels launched",
        ]}
        className="left-[6%] bottom-[24%]"
      />

      <RoadCard
        phase="PHASE 02"
        title="Proof + Community"
        status="Completed"
        tone="green"
        bullets={[
          "MAD Confessions live",
          "Exchange visibility live",
          "400M tokens burned completed",
          "Community growth active",
        ]}
        className="left-[31%] bottom-[34%]"
      />

      <RoadCard
        phase="PHASE 03"
        title="Build"
        status="In Progress"
        tone="red"
        bullets={[
          "Token utility expansion",
          "Marketplace integration",
          "Partnerships & alliances",
        ]}
        className="left-[56%] top-[18%]"
      />

      <RoadCard
        phase="PHASE 04"
        title="Expand"
        status="Up Next"
        tone="neutral"
        bullets={[
          "Global marketing campaign",
          "CEX listings",
          "Ecosystem expansion",
        ]}
        className="right-[6%] top-[5%] w-[16rem]"
      />

      <RoadPins />
    </div>
  );
}

function RoadmapHero() {
  return (
    <Shell className="p-6 sm:p-8 lg:p-10">
      <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
        <div className="pt-4">
          <div className="inline-flex rounded-full border border-red-500/25 bg-red-500/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-red-200">
            The Mad Path
          </div>

          <h1 className="mt-6 text-[3.3rem] font-black leading-[0.9] tracking-[-0.05em] text-white sm:text-[5.4rem]">
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

          <ProgressBlock />
        </div>

        <RoadCanvas />
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
