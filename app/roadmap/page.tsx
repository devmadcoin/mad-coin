"use client";

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
  locked = false,
}: {
  children: ReactNode;
  tone: "green" | "red" | "neutral";
  locked?: boolean;
}) {
  return (
    <div className="flex items-start gap-3 rounded-[1rem] border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-medium text-white/88 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
      <div
        className={cn(
          "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px]",
          tone === "green" &&
            "border-emerald-400/45 bg-emerald-400/20 text-emerald-200 shadow-[0_0_10px_rgba(16,185,129,0.3)]",
          tone === "red" &&
            "border-red-500/45 bg-red-500/20 text-red-200 shadow-[0_0_10px_rgba(255,0,0,0.22)]",
          tone === "neutral" && "border-white/25 bg-white/10 text-white/80"
        )}
      >
        {locked ? "🔒" : tone === "green" ? "✓" : tone === "red" ? "•" : "•"}
      </div>
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
  locked = false,
}: {
  phase: string;
  title: string;
  status: string;
  tone: "green" | "red" | "neutral";
  bullets: readonly string[];
  className?: string;
  locked?: boolean;
}) {
  return (
    <div
      className={cn(
        "absolute z-20 rounded-[1.8rem] border bg-[linear-gradient(180deg,rgba(10,10,12,0.88),rgba(16,16,18,0.72))] p-5 backdrop-blur-xl",
        tone === "green" &&
          "border-emerald-400/40 shadow-[0_0_40px_rgba(16,185,129,0.18)]",
        tone === "red" &&
          "border-red-500/38 shadow-[0_0_40px_rgba(255,0,0,0.14)]",
        tone === "neutral" &&
          "border-white/18 shadow-[0_0_30px_rgba(255,255,255,0.06)]",
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
        <Badge tone={tone}>{status}</Badge>
      </div>

      <div className="mt-5 grid gap-3">
        {bullets.map((item) => (
          <Bullet key={item} tone={tone} locked={locked}>
            {item}
          </Bullet>
        ))}
      </div>
    </div>
  );
}

function MountainBackdrop() {
  return (
    <>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_22%,rgba(255,149,64,0.22),transparent_12%),radial-gradient(circle_at_78%_22%,rgba(255,255,255,0.09),transparent_22%),radial-gradient(circle_at_62%_54%,rgba(255,0,0,0.14),transparent_18%),radial-gradient(circle_at_24%_82%,rgba(16,185,129,0.12),transparent_22%)]" />

      <div className="absolute inset-x-0 bottom-0 h-[50%] bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.22)_20%,rgba(0,0,0,0.92))]" />

      <div className="absolute left-[32%] top-[26%] h-[26%] w-[22%] bg-[radial-gradient(circle_at_50%_40%,rgba(80,80,80,0.12),rgba(0,0,0,0)_70%)] [clip-path:polygon(0%_100%,10%_60%,25%_52%,36%_36%,50%_62%,64%_28%,80%_58%,100%_100%)] opacity-90" />
      <div className="absolute left-[48%] top-[20%] h-[30%] w-[22%] bg-[radial-gradient(circle_at_50%_40%,rgba(80,80,80,0.14),rgba(0,0,0,0)_70%)] [clip-path:polygon(0%_100%,15%_55%,28%_38%,42%_58%,56%_24%,72%_56%,86%_40%,100%_100%)] opacity-95" />
      <div className="absolute right-[5%] top-[16%] h-[35%] w-[23%] bg-[radial-gradient(circle_at_50%_40%,rgba(90,90,90,0.15),rgba(0,0,0,0)_70%)] [clip-path:polygon(0%_100%,8%_64%,20%_44%,34%_60%,48%_24%,62%_55%,80%_28%,100%_100%)] opacity-95" />

      <div className="absolute left-[-8%] bottom-[8%] h-[38%] w-[36%] bg-[radial-gradient(circle_at_60%_40%,rgba(90,90,90,0.12),rgba(0,0,0,0)_68%)] [clip-path:polygon(0%_100%,12%_64%,28%_52%,42%_66%,58%_34%,74%_60%,92%_42%,100%_100%)] opacity-80" />
      <div className="absolute right-[-4%] bottom-[4%] h-[42%] w-[36%] bg-[radial-gradient(circle_at_40%_35%,rgba(90,90,90,0.14),rgba(0,0,0,0)_68%)] [clip-path:polygon(0%_100%,10%_62%,24%_48%,38%_70%,52%_36%,68%_66%,84%_40%,100%_100%)] opacity-85" />
    </>
  );
}

function RoadPins() {
  return (
    <>
      <div className="absolute left-[18%] top-[78%] z-10 flex flex-col items-center">
        <div className="h-12 w-[3px] bg-emerald-400/85 shadow-[0_0_18px_rgba(16,185,129,0.48)]" />
        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-emerald-400/40 bg-black text-3xl text-white shadow-[0_0_22px_rgba(16,185,129,0.4)]">
          ✓
        </div>
      </div>

      <div className="absolute left-[43%] top-[68%] z-10 flex flex-col items-center">
        <div className="h-12 w-[3px] bg-emerald-400/85 shadow-[0_0_18px_rgba(16,185,129,0.45)]" />
        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-emerald-400/35 bg-black text-3xl text-white shadow-[0_0_20px_rgba(16,185,129,0.34)]">
          ✓
        </div>
      </div>

      <div className="absolute left-[65%] top-[50%] z-10 flex flex-col items-center">
        <div className="h-12 w-[3px] bg-red-500/80 shadow-[0_0_18px_rgba(255,0,0,0.34)]" />
        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-red-500/40 bg-black text-3xl text-white shadow-[0_0_20px_rgba(255,0,0,0.26)]">
          •
        </div>
      </div>

      <div className="absolute left-[87%] top-[37%] z-10 flex flex-col items-center">
        <div className="h-12 w-[3px] bg-white/65 shadow-[0_0_16px_rgba(255,255,255,0.14)]" />
        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-black text-2xl text-white shadow-[0_0_16px_rgba(255,255,255,0.08)]">
          🔒
        </div>
      </div>
    </>
  );
}

function RoadCanvas() {
  return (
    <div className="relative h-[860px] overflow-hidden rounded-[2.2rem] border border-white/10 bg-[linear-gradient(180deg,#020305,#050608_38%,#090909_100%)]">
      <MountainBackdrop />

      <svg
        viewBox="0 0 1000 860"
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="roadFill" x1="10%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#25272d" />
            <stop offset="100%" stopColor="#3a3d46" />
          </linearGradient>

          <linearGradient id="roadGlowLeft" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="38%" stopColor="#34d399" />
            <stop offset="56%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#f8fafc" />
          </linearGradient>

          <filter id="roadGlow">
            <feGaussianBlur stdDeviation="7" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="lightSweepGlow">
            <feGaussianBlur stdDeviation="12" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <path
          d="M135 770 C 235 715, 325 665, 415 608 C 535 532, 620 448, 707 344 C 782 253, 850 192, 944 125"
          stroke="rgba(0,0,0,0.84)"
          strokeWidth="188"
          strokeLinecap="round"
          fill="none"
        />

        <path
          d="M135 770 C 235 715, 325 665, 415 608 C 535 532, 620 448, 707 344 C 782 253, 850 192, 944 125"
          stroke="url(#roadFill)"
          strokeWidth="160"
          strokeLinecap="round"
          fill="none"
        />

        <path
          d="M110 785 C 210 728, 300 678, 390 622 C 510 545, 595 462, 682 357 C 756 267, 825 206, 920 139"
          stroke="rgba(240,255,255,0.82)"
          strokeWidth="4.5"
          strokeLinecap="round"
          fill="none"
        />

        <path
          d="M160 754 C 260 699, 349 649, 438 595 C 558 521, 643 436, 730 332 C 806 242, 873 180, 968 112"
          stroke="rgba(255,220,220,0.74)"
          strokeWidth="4.5"
          strokeLinecap="round"
          fill="none"
        />

        <path
          d="M110 785 C 210 728, 300 678, 390 622 C 510 545, 595 462, 682 357 C 756 267, 825 206, 920 139"
          stroke="url(#roadGlowLeft)"
          strokeWidth="7"
          strokeLinecap="round"
          fill="none"
          filter="url(#roadGlow)"
        />

        <path
          d="M135 770 C 235 715, 325 665, 415 608 C 535 532, 620 448, 707 344 C 782 253, 850 192, 944 125"
          stroke="rgba(255,255,255,0.34)"
          strokeWidth="3"
          strokeDasharray="18 18"
          strokeLinecap="round"
          fill="none"
        />

        <path
          d="M180 744 C 280 689, 365 640, 450 587 C 566 514, 648 432, 732 330 C 803 243, 870 184, 962 117"
          stroke="rgba(255,255,255,0.75)"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          filter="url(#lightSweepGlow)"
          opacity="0.95"
        >
          <animate
            attributeName="stroke-dasharray"
            values="1 920;130 790;1 920"
            dur="4.8s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="stroke-dashoffset"
            values="0;-260;-560"
            dur="4.8s"
            repeatCount="indefinite"
          />
        </path>
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
        className="left-[4%] bottom-[22%] w-[18rem]"
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
        className="left-[31%] bottom-[30%] w-[18rem]"
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
        className="left-[56%] top-[13%] w-[16rem]"
      />

      <RoadCard
        phase="PHASE 04"
        title="Expand"
        status="Up Next"
        tone="neutral"
        locked
        bullets={[
          "Global marketing campaign",
          "CEX listings",
          "Ecosystem expansion",
        ]}
        className="right-[4%] top-[2.5%] w-[16rem]"
      />

      <RoadPins />
    </div>
  );
}

function RoadmapHero() {
  return (
    <Shell className="p-6 sm:p-8 lg:p-10">
      <div className="grid gap-8 lg:grid-cols-[0.68fr_1.32fr] lg:items-start">
        <div className="pt-3">
          <div className="inline-flex rounded-full border border-red-500/25 bg-red-500/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-red-200">
            The Mad Path
          </div>

          <h1 className="mt-6 text-[3.4rem] font-black leading-[0.88] tracking-[-0.05em] text-white sm:text-[5.8rem]">
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
