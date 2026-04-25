"use client";

import Image from "next/image";
import type { ReactNode } from "react";

const LINKS = {
  buy: "https://jup.ag/swap?sell=So11111111111111111111111111111111111111112&buy=Fa7ZE9nCEYnrHsnoeHuhEExJpchtrBtKXnWe6CgHpump",
  communityProof:
    "https://x.com/madrichclub_/status/2046716691867201953?s=20",
} as const;

const PROGRESS = {
  complete: 6,
  total: 9,
};

const percentComplete = Math.round((PROGRESS.complete / PROGRESS.total) * 100);

const STATUS_CARDS = [
  { label: "Website", value: "LIVE NOW", tone: "green" as const, icon: "🌐" },
  { label: "Confessions", value: "LIVE NOW", tone: "green" as const, icon: "💬" },
  { label: "400M Burn", value: "PROVEN", tone: "green" as const, icon: "🔥" },
  { label: "MAD AI", value: "LIVE NOW", tone: "green" as const, icon: "🤖" },
  { label: "Community Support", value: "PROVEN", tone: "green" as const, icon: "🤝" },
  { label: "MAD Games", value: "IN PROGRESS", tone: "red" as const, icon: "🎮" },
  { label: "Stickers", value: "LIVE NOW", tone: "green" as const, icon: "😈" },
  { label: "Clothing", value: "TESTING", tone: "red" as const, icon: "👕" },
  { label: "$MAD Art", value: "IN PROGRESS", tone: "red" as const, icon: "🖼️" },
] as const;

/* ─── PHASES (replaces the static roadmap image) ─── */
const PHASES = [
  {
    id: "01",
    title: "Foundation",
    status: "COMPLETE" as const,
    statusColor: "text-emerald-300",
    statusBg: "border-emerald-400/25 bg-emerald-400/10",
    dotColor: "bg-emerald-500",
    dotGlow: "shadow-[0_0_20px_rgba(16,185,129,0.5)]",
    lineFrom: "from-emerald-500",
    lineTo: "to-emerald-400",
    items: [
      { text: "Core brand philosophy established", done: true },
      { text: "Smart contract framework built", done: true },
      { text: "Community channels launched", done: true },
    ],
    summary: "The groundwork. Philosophy locked. Community born.",
  },
  {
    id: "02",
    title: "Proof + Community",
    status: "COMPLETE" as const,
    statusColor: "text-emerald-300",
    statusBg: "border-emerald-400/25 bg-emerald-400/10",
    dotColor: "bg-emerald-500",
    dotGlow: "shadow-[0_0_20px_rgba(16,185,129,0.5)]",
    lineFrom: "from-emerald-400",
    lineTo: "to-yellow-500",
    items: [
      { text: "MAD Confessions live", done: true },
      { text: "Exchange visibility live", done: true },
      { text: "400M tokens burned completed", done: true },
      { text: "Community growth active", done: true },
    ],
    summary: "Proof of work. 400M burned. Community backed publicly.",
  },
  {
    id: "03",
    title: "Build",
    status: "IN PROGRESS" as const,
    statusColor: "text-yellow-300",
    statusBg: "border-yellow-500/25 bg-yellow-500/10",
    dotColor: "bg-yellow-500",
    dotGlow: "shadow-[0_0_24px_rgba(234,179,8,0.6)]",
    lineFrom: "from-yellow-500",
    lineTo: "to-red-500",
    items: [
      { text: "Token utility expansion", done: true },
      { text: "Marketplace integration", done: false },
      { text: "Partnerships & alliances", done: false },
      { text: "MAD Games expansion", done: false },
    ],
    summary: "Building utility. Expanding the ecosystem. In motion.",
  },
  {
    id: "04",
    title: "Expand",
    status: "UP NEXT" as const,
    statusColor: "text-white/50",
    statusBg: "border-white/10 bg-white/5",
    dotColor: "bg-white/30",
    dotGlow: "",
    lineFrom: "from-red-500",
    lineTo: "to-red-600",
    items: [
      { text: "Global marketing campaign", done: false },
      { text: "CEX listings", done: false },
      { text: "Ecosystem expansion", done: false },
    ],
    summary: "The next level. CEX. Global reach. Full ecosystem.",
  },
];

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

function ProgressStrip() {
  return (
    <Shell className="p-5 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.35em] text-white/45">
            Overall Progress
          </p>

          <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl">
            {percentComplete}% complete
          </h2>

          <p className="mt-2 text-sm text-white/60">
            {PROGRESS.complete} of {PROGRESS.total} roadmap milestones are live,
            proven, or in motion.
          </p>
        </div>

        <div className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-bold text-white/75">
          Build. Prove. Expand.
        </div>
      </div>

      <div className="mt-5 h-4 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-[linear-gradient(90deg,#22c55e,#10b981,#ef4444)] shadow-[0_0_24px_rgba(16,185,129,0.25)] transition-all duration-500"
          style={{ width: `${percentComplete}%` }}
        />
      </div>
    </Shell>
  );
}

/* ─── NEW: INTERACTIVE PHASE ROADMAP (replaces static image) ─── */
function PhaseRoadmap() {
  return (
    <Shell className="p-6 sm:p-8 lg:p-10">
      <div className="mb-8">
        <p className="text-xs font-black uppercase tracking-[0.35em] text-white/45">
          The Mad Path
        </p>
        <h2 className="mt-2 text-3xl font-black text-white sm:text-4xl">
          Four phases. One mission.
        </h2>
      </div>

      <div className="relative">
        {/* Central vertical line (desktop only) */}
        <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2">
          <div className="w-full h-full bg-gradient-to-b from-emerald-500/30 via-yellow-500/20 to-red-500/10" />
        </div>

        <div className="space-y-8 lg:space-y-0">
          {PHASES.map((phase, i) => {
            const isLeft = i % 2 === 0;
            const statusIcon =
              phase.status === "COMPLETE" || phase.status === "COMPLETE"
                ? "✓"
                : phase.status === "IN PROGRESS"
                  ? "●"
                  : "○";

            return (
              <div
                key={phase.id}
                className={cn(
                  "relative flex items-start gap-4 lg:gap-0",
                  isLeft ? "lg:flex-row" : "lg:flex-row-reverse",
                  "flex-col",
                )}
              >
                {/* Phase card */}
                <div className={cn("flex-1", isLeft ? "lg:pr-16" : "lg:pl-16")}>
                  <div
                    className={cn(
                      "rounded-[1.8rem] border p-5 sm:p-6 transition-all hover:-translate-y-1",
                      "border-white/10 bg-white/[0.03] hover:border-white/15",
                    )}
                  >
                    {/* Header */}
                    <div
                      className={cn(
                        "flex items-center gap-3 mb-3 flex-wrap",
                        isLeft ? "lg:justify-end" : "",
                      )}
                    >
                      <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">
                        Phase {phase.id}
                      </span>
                      <span
                        className={cn(
                          "px-2.5 py-1 rounded-full border text-[10px] font-black tracking-wider",
                          phase.statusBg,
                          phase.statusColor,
                        )}
                      >
                        {phase.status}
                      </span>
                    </div>

                    <h3
                      className={cn(
                        "text-2xl sm:text-3xl font-black text-white mb-1",
                        isLeft ? "lg:text-right" : "",
                      )}
                    >
                      {phase.title}
                    </h3>
                    <p
                      className={cn(
                        "text-sm text-white/50 mb-5",
                        isLeft ? "lg:text-right" : "",
                      )}
                    >
                      {phase.summary}
                    </p>

                    {/* Checklist */}
                    <div
                      className={cn(
                        "space-y-2 max-w-sm",
                        isLeft ? "lg:ml-auto" : "",
                      )}
                    >
                      {phase.items.map((item) => (
                        <div
                          key={item.text}
                          className={cn(
                            "flex items-center gap-3 p-3 rounded-xl border",
                            item.done
                              ? "bg-emerald-500/5 border-emerald-500/10"
                              : "bg-white/[0.02] border-white/5",
                          )}
                        >
                          <div
                            className={cn(
                              "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0",
                              item.done
                                ? "bg-emerald-500 text-black"
                                : "bg-white/10 text-white/30",
                            )}
                          >
                            {item.done ? "✓" : "○"}
                          </div>
                          <span
                            className={cn(
                              "text-sm font-medium",
                              item.done ? "text-white/80" : "text-white/40",
                            )}
                          >
                            {item.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Center node + connector */}
                <div className="hidden lg:flex flex-col items-center shrink-0 self-stretch">
                  {/* Top connector */}
                  {i > 0 && (
                    <div className="w-px h-6 bg-gradient-to-b from-emerald-500/30 to-transparent" />
                  )}

                  {/* Node */}
                  <div className="relative">
                    <div
                      className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center text-black font-black text-sm relative z-10",
                        phase.dotColor,
                        phase.dotGlow,
                      )}
                    >
                      {statusIcon}
                    </div>
                    {/* Glow behind */}
                    <div
                      className={cn(
                        "absolute inset-0 rounded-full blur-xl opacity-30",
                        phase.dotColor,
                      )}
                    />
                    {/* Pulse ring for in-progress */}
                    {phase.status === "IN PROGRESS" && (
                      <div className="absolute -inset-2 rounded-full border-2 border-yellow-500/30 animate-pulse" />
                    )}
                  </div>

                  {/* Bottom connector */}
                  {i < PHASES.length - 1 && (
                    <div
                      className={cn(
                        "flex-1 min-h-[40px] w-px bg-gradient-to-b",
                        phase.lineFrom,
                        phase.lineTo,
                      )}
                    />
                  )}
                </div>

                {/* Mobile: simple dot instead of timeline */}
                <div className="lg:hidden flex items-center gap-3 mb-2">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-black font-black text-xs shrink-0",
                      phase.dotColor,
                    )}
                  >
                    {statusIcon}
                  </div>
                  <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent" />
                </div>

                {/* Spacer for alternating */}
                <div className="flex-1 hidden lg:block" />
              </div>
            );
          })}
        </div>
      </div>
    </Shell>
  );
}

function CommunitySupport() {
  return (
    <Shell className="p-6 sm:p-8">
      <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-stretch">
        <div className="flex flex-col justify-between rounded-[1.75rem] border border-emerald-400/20 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.12),rgba(0,0,0,0.92))] p-6 sm:p-7">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.35em] text-emerald-300/85">
              Alliance Expansion
            </p>

            <h2 className="mt-3 text-3xl font-black text-white sm:text-5xl">
              1 Community Supported.
            </h2>

            <p className="mt-4 max-w-3xl text-base leading-8 text-white/78 sm:text-lg">
              Before asking people to trust the mission, we showed loyalty in
              public. One community was supported through action, and the tokens
              were locked to prove long-term conviction.
            </p>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-emerald-400/20 bg-emerald-400/5 px-6 py-5">
              <p className="text-xs font-black uppercase tracking-[0.28em] text-emerald-300/80">
                Support Status
              </p>
              <p className="mt-2 text-3xl font-black text-emerald-300">
                Completed
              </p>
              <p className="mt-1 text-sm text-white/55">
                Backed publicly with receipts
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.03] px-6 py-5">
              <p className="text-xs font-black uppercase tracking-[0.28em] text-white/55">
                Signal Sent
              </p>
              <p className="mt-2 text-3xl font-black text-white">Locked Up</p>
              <p className="mt-1 text-sm text-white/55">
                Commitment over quick exits
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.015))] p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-white/55">
              Proof of Work
            </p>

            <span className="rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-emerald-300">
              Verified Signal
            </span>
          </div>

          <div className="mt-4 rounded-[1.5rem] border border-white/10 bg-black/40 p-5">
            <p className="text-lg font-black text-white sm:text-xl">
              Supported one community.
            </p>
            <p className="mt-2 text-lg font-black text-emerald-300 sm:text-xl">
              Locked all the tokens.
            </p>

            <p className="mt-4 text-sm leading-7 text-white/68 sm:text-base">
              This milestone matters because it shows execution, patience, and
              visible commitment. Not theory. Not hype. Proof.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href={LINKS.communityProof}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center rounded-full border border-emerald-400/25 bg-emerald-400/10 px-5 py-3 text-sm font-black text-emerald-300 transition hover:scale-[1.02] hover:bg-emerald-400/15"
              >
                View Proof →
              </a>

              <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-semibold text-white/65">
                Public receipt on X
              </span>
            </div>
          </div>
        </div>
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
          <ProgressStrip />

          <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-9">
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

          {/* REPLACED: static RoadmapPoster → interactive PhaseRoadmap */}
          <PhaseRoadmap />

          <CommunitySupport />

          <CTASection />

          <RiskNotice />
        </div>
      </main>
    </div>
  );
}
