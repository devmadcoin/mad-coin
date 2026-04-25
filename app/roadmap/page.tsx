"use client";

import type { ReactNode } from "react";

const LINKS = {
  buy: "https://jup.ag/swap?sell=So11111111111111111111111111111111111111112&buy=Fa7ZE9nCEYnrHsnoeHuhEExJpchtrBtKXnWe6CgHpump",
  communityProof: "https://x.com/madrichclub_/status/2046716691867201953?s=20",
} as const;

const PROGRESS = { complete: 6, total: 9 };
const percentComplete = Math.round((PROGRESS.complete / PROGRESS.total) * 100);

const STATUS_CARDS = [
  { label: "Website", value: "LIVE NOW", tone: "green" as const, icon: "🌐" },
  { label: "Confessions", value: "LIVE NOW", tone: "green" as const, icon: "💬" },
  { label: "Token Burns", value: "ACTIVE", tone: "green" as const, icon: "🔥" },
  { label: "MAD AI", value: "LIVE NOW", tone: "green" as const, icon: "🤖" },
  { label: "Community Support", value: "PROVEN", tone: "green" as const, icon: "🤝" },
  { label: "MAD Games", value: "IN PROGRESS", tone: "red" as const, icon: "🎮" },
  { label: "Stickers", value: "LIVE NOW", tone: "green" as const, icon: "😈" },
  { label: "Clothing", value: "TESTING", tone: "red" as const, icon: "👕" },
  { label: "$MAD Art", value: "IN PROGRESS", tone: "red" as const, icon: "🖼️" },
] as const;

const EXITS = [
  {
    mile: "MILE 0",
    title: "Foundation",
    status: "COMPLETE" as const,
    color: "emerald",
    items: [
      { text: "Core brand philosophy established", done: true },
      { text: "Smart contract framework built", done: true },
      { text: "Community channels launched", done: true },
    ],
    summary: "The groundwork. Philosophy locked. Community born.",
  },
  {
    mile: "MILE 25",
    title: "Proof + Community",
    status: "COMPLETE" as const,
    color: "emerald",
    items: [
      { text: "MAD Confessions live", done: true },
      { text: "Exchange visibility live", done: true },
      { text: "Supply reduced to ~513M", done: true },
      { text: "Burn target set: 200M", done: true },
      { text: "Community growth active", done: true },
    ],
    summary: "Supply shrinking. 513M → 200M. Community backed publicly.",
  },
  {
    mile: "MILE 50",
    title: "Build",
    status: "IN PROGRESS" as const,
    color: "yellow",
    items: [
      { text: "Token utility expansion", done: true },
      { text: "Burn #2 at 10K holders", done: false },
      { text: "Marketplace integration", done: false },
      { text: "Partnerships & alliances", done: false },
      { text: "MAD Games expansion", done: false },
    ],
    summary: "Burn #2 locked in at 10K holders. Building utility. In motion.",
  },
  {
    mile: "MILE 100",
    title: "Expand",
    status: "UP NEXT" as const,
    color: "red",
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

function Shell({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <section className={cn(
      "overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0.01))] shadow-[0_18px_60px_rgba(0,0,0,0.42)] backdrop-blur-xl",
      className,
    )}>
      {children}
    </section>
  );
}

function StatusMiniCard({ label, value, tone, icon }: { label: string; value: string; tone: "red" | "green"; icon: string }) {
  return (
    <div className={cn(
      "rounded-[1.25rem] border p-4 transition duration-300 hover:-translate-y-0.5",
      tone === "green"
        ? "border-emerald-400/35 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.2),rgba(0,0,0,0.92))] shadow-[0_0_25px_rgba(16,185,129,0.12)]"
        : "border-red-500/25 bg-[radial-gradient(circle_at_top_left,rgba(255,0,0,0.14),rgba(0,0,0,0.92))] shadow-[0_0_20px_rgba(255,0,0,0.08)]",
    )}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/58">{label}</p>
        <div className="text-lg">{icon}</div>
      </div>
      <p className={cn("mt-3 text-xl font-black leading-tight sm:text-2xl", tone === "green" ? "text-emerald-300" : "text-red-100")}>
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
          <p className="text-xs font-black uppercase tracking-[0.35em] text-white/45">Overall Progress</p>
          <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl">{percentComplete}% complete</h2>
          <p className="mt-2 text-sm text-white/60">{PROGRESS.complete} of {PROGRESS.total} roadmap milestones are live, proven, or in motion.</p>
        </div>
        <div className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-bold text-white/75">Build. Prove. Expand.</div>
      </div>
      <div className="mt-5 h-4 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-[linear-gradient(90deg,#22c55e,#10b981,#ef4444)] shadow-[0_0_24px_rgba(16,185,129,0.25)] transition-all duration-500" style={{ width: `${percentComplete}%` }} />
      </div>
    </Shell>
  );
}

/* ─── ROAD SIGN COMPONENT ─── */
function RoadSign({ mile, title, color }: { mile: string; title: string; color: string }) {
  const colorMap: Record<string, { bg: string; border: string; text: string; glow: string }> = {
    emerald: { bg: "bg-emerald-600", border: "border-emerald-500", text: "text-white", glow: "shadow-[0_0_30px_rgba(16,185,129,0.4)]" },
    yellow: { bg: "bg-yellow-500", border: "border-yellow-400", text: "text-black", glow: "shadow-[0_0_30px_rgba(234,179,8,0.5)]" },
    red: { bg: "bg-red-600", border: "border-red-500", text: "text-white", glow: "shadow-[0_0_30px_rgba(239,68,68,0.3)]" },
  };

  const c = colorMap[color] || colorMap.emerald;

  return (
    <div className={`relative ${c.glow}`}>
      {/* Sign pole */}
      <div className="absolute left-1/2 -translate-x-1/2 top-full w-1.5 h-8 bg-neutral-600" />
      {/* Sign board */}
      <div className={cn("relative rounded-xl border-2 px-4 py-2 text-center min-w-[140px]", c.bg, c.border)}>
        <p className={cn("text-[9px] font-black uppercase tracking-[0.3em] opacity-75", c.text)}>{mile}</p>
        <p className={cn("text-sm font-black leading-tight", c.text)}>{title}</p>
        {/* Sign bolts */}
        <div className="absolute top-1 left-2 w-1.5 h-1.5 rounded-full bg-white/30" />
        <div className="absolute top-1 right-2 w-1.5 h-1.5 rounded-full bg-white/30" />
        <div className="absolute bottom-1 left-2 w-1.5 h-1.5 rounded-full bg-white/30" />
        <div className="absolute bottom-1 right-2 w-1.5 h-1.5 rounded-full bg-white/30" />
      </div>
    </div>
  );
}

/* ─── EXIT CARD (phase details at each mile marker) ─── */
function ExitCard({ exit, side }: { exit: typeof EXITS[0]; side: "left" | "right" }) {
  const isComplete = exit.status === "COMPLETE";
  const isProgress = exit.status === "IN PROGRESS";

  const statusBadge = isComplete
    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
    : isProgress
      ? "border-yellow-500/30 bg-yellow-500/10 text-yellow-300"
      : "border-white/10 bg-white/5 text-white/40";

  return (
    <div className={cn("relative", side === "left" ? "lg:pr-8" : "lg:pl-8")}>
      <div className="rounded-[1.4rem] border border-white/10 bg-neutral-900/80 p-5 sm:p-6 hover:border-white/15 transition-all">
        {/* Mile + Status */}
        <div className={cn("flex items-center gap-3 mb-3 flex-wrap", side === "left" ? "lg:justify-end" : "")}>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">{exit.mile}</span>
          <span className={cn("px-2.5 py-1 rounded-full border text-[10px] font-black tracking-wider", statusBadge)}>
            {exit.status}
          </span>
        </div>

        <h3 className={cn("text-2xl sm:text-3xl font-black text-white mb-1", side === "left" ? "lg:text-right" : "")}>
          {exit.title}
        </h3>
        <p className={cn("text-sm text-white/50 mb-5", side === "left" ? "lg:text-right" : "")}>
          {exit.summary}
        </p>

        {/* Checklist */}
        <div className={cn("space-y-2", side === "left" ? "lg:ml-auto" : "", "max-w-sm")}>
          {exit.items.map((item) => (
            <div key={item.text} className={cn("flex items-center gap-3 p-3 rounded-xl border",
              item.done ? "bg-emerald-500/5 border-emerald-500/10" : "bg-white/[0.02] border-white/5")}>
              <div className={cn("w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0",
                item.done ? "bg-emerald-500 text-black" : "bg-white/10 text-white/30")}>
                {item.done ? "✓" : "○"}
              </div>
              <span className={cn("text-sm font-medium", item.done ? "text-white/80" : "text-white/40")}>{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── THE HIGHWAY (literal road) ─── */
function Highway() {
  return (
    <Shell className="p-0 overflow-visible">
      {/* Road surface */}
      <div className="relative py-10 sm:py-16">
        {/* Asphalt background */}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#1a1a1a_0%,#111_50%,#1a1a1a_100%)]" />

        {/* Road texture lines (subtle) */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(255,255,255,0.5) 40px, rgba(255,255,255,0.5) 41px)`,
        }} />

        {/* Edge lines - left */}
        <div className="absolute left-4 sm:left-8 top-0 bottom-0 w-1 bg-[linear-gradient(180deg,rgba(255,255,255,0.4)_0%,rgba(255,255,255,0.1)_100%)]" />
        {/* Edge lines - right */}
        <div className="absolute right-4 sm:right-8 top-0 bottom-0 w-1 bg-[linear-gradient(180deg,rgba(255,255,255,0.4)_0%,rgba(255,255,255,0.1)_100%)]" />

        {/* Center dashed lane markings */}
        <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-1 flex flex-col">
          {Array.from({ length: 30 }).map((_, i) => (
            <div key={i} className="h-6 sm:h-8 my-1 sm:my-1.5 bg-[linear-gradient(180deg,#fbbf24,#f59e0b)] rounded-sm opacity-80" style={{ boxShadow: "0 0 8px rgba(251,191,36,0.3)" }} />
          ))}
        </div>

        {/* Road content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-8">
          {/* Header */}
          <div className="text-center mb-10">
            <p className="text-[11px] font-black uppercase tracking-[0.4em] text-white/30">The Mad Highway</p>
            <h2 className="mt-2 text-3xl sm:text-4xl font-black text-white">Four exits. One destination.</h2>
          </div>

          {/* Exits along the road */}
          <div className="space-y-16 sm:space-y-20">
            {EXITS.map((exit, i) => {
              const side = i % 2 === 0 ? "left" : "right";

              return (
                <div key={exit.mile} className="relative">
                  {/* Road sign on the side */}
                  <div className={cn("hidden lg:flex absolute top-0 z-20", side === "left" ? "right-[calc(50%+24px)]" : "left-[calc(50%+24px)]")}>
                    <RoadSign mile={exit.mile} title={exit.title} color={exit.color} />
                  </div>

                  {/* Car marker on the road at current progress */}
                  {exit.status === "IN PROGRESS" && (
                    <div className="absolute left-1/2 -translate-x-1/2 -top-6 z-30">
                      <div className="relative">
                        {/* Car icon */}
                        <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(255,0,0,0.6)] animate-pulse">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                            <path d="M5 17h14M6 17v-5l3-4h6l3 4v5M9 8V6a2 2 0 012-2h2a2 2 0 012 2v2" />
                            <circle cx="7.5" cy="17" r="1.5" fill="white" stroke="none" />
                            <circle cx="16.5" cy="17" r="1.5" fill="white" stroke="none" />
                          </svg>
                        </div>
                        {/* Headlights glow */}
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-20 h-8 bg-[linear-gradient(180deg,rgba(255,200,100,0.3),transparent)] rounded-full" />
                      </div>
                    </div>
                  )}

                  {/* Phase card */}
                  <div className={cn("grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-16 items-start", side === "left" ? "" : "")}>
                    {side === "left" ? (
                      <>
                        <ExitCard exit={exit} side="left" />
                        <div className="hidden lg:block" /> {/* spacer */}
                      </>
                    ) : (
                      <>
                        <div className="hidden lg:block" /> {/* spacer */}
                        <ExitCard exit={exit} side="right" />
                      </>
                    )}
                  </div>

                  {/* Mile marker post on the road edge */}
                  <div className={cn("hidden lg:flex absolute top-0 items-start gap-2 z-20", side === "left" ? "left-[calc(50%-40px)] flex-row-reverse" : "left-[calc(50%+16px)]")}>
                    <div className="w-6 h-16 bg-[linear-gradient(180deg,#22c55e,#15803d)] rounded-sm border border-white/20 flex flex-col items-center justify-center shadow-lg">
                      <span className="text-[8px] font-black text-white/80 uppercase tracking-wider rotate-180" style={{ writingMode: "vertical-rl" }}>{exit.mile}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* End of road marker */}
          <div className="mt-16 text-center">
            <div className="inline-block rounded-2xl border-2 border-white/20 bg-neutral-800 px-6 py-3">
              <p className="text-xs font-black uppercase tracking-[0.3em] text-white/40">End of Road</p>
              <p className="text-lg font-black text-white mt-1">Destination: $MAD</p>
            </div>
          </div>
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
            <p className="text-xs font-black uppercase tracking-[0.35em] text-emerald-300/85">Alliance Expansion</p>
            <h2 className="mt-3 text-3xl font-black text-white sm:text-5xl">1 Community Supported.</h2>
            <p className="mt-4 max-w-3xl text-base leading-8 text-white/78 sm:text-lg">
              Before asking people to trust the mission, we showed loyalty in public. One community was supported through action, and the tokens were locked to prove long-term conviction.
            </p>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-emerald-400/20 bg-emerald-400/5 px-6 py-5">
              <p className="text-xs font-black uppercase tracking-[0.28em] text-emerald-300/80">Support Status</p>
              <p className="mt-2 text-3xl font-black text-emerald-300">Completed</p>
              <p className="mt-1 text-sm text-white/55">Backed publicly with receipts</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] px-6 py-5">
              <p className="text-xs font-black uppercase tracking-[0.28em] text-white/55">Signal Sent</p>
              <p className="mt-2 text-3xl font-black text-white">Locked Up</p>
              <p className="mt-1 text-sm text-white/55">Commitment over quick exits</p>
            </div>
          </div>
        </div>
        <div className="rounded-[1.75rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.015))] p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-white/55">Proof of Work</p>
            <span className="rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-emerald-300">Verified Signal</span>
          </div>
          <div className="mt-4 rounded-[1.5rem] border border-white/10 bg-black/40 p-5">
            <p className="text-lg font-black text-white sm:text-xl">Supported one community.</p>
            <p className="mt-2 text-lg font-black text-emerald-300 sm:text-xl">Locked all the tokens.</p>
            <p className="mt-4 text-sm leading-7 text-white/68 sm:text-base">
              This milestone matters because it shows execution, patience, and visible commitment. Not theory. Not hype. Proof.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a href={LINKS.communityProof} target="_blank" rel="noreferrer" className="inline-flex items-center rounded-full border border-emerald-400/25 bg-emerald-400/10 px-5 py-3 text-sm font-black text-emerald-300 transition hover:scale-[1.02] hover:bg-emerald-400/15">
                View Proof →
              </a>
              <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-semibold text-white/65">Public receipt on X</span>
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
          <h2 className="text-4xl font-black text-white sm:text-6xl">THIS IS YOUR PATH.</h2>
          <p className="mt-4 max-w-2xl text-base leading-8 text-white/78 sm:text-lg">Build. Prove. Expand.</p>
        </div>
        <a href={LINKS.buy} target="_blank" rel="noreferrer" className="inline-flex rounded-full border border-red-500/35 bg-red-500 px-8 py-4 text-base font-black text-white shadow-[0_0_22px_rgba(255,0,0,0.22)] transition hover:scale-[1.02] hover:bg-red-400">
          Start Your Journey →
        </a>
      </div>
    </Shell>
  );
}

function RiskNotice() {
  return (
    <Shell className="border-yellow-500/20 bg-[linear-gradient(180deg,rgba(255,208,0,0.05),rgba(255,208,0,0.02))] px-6 py-8 sm:px-10 sm:py-10">
      <p className="text-center text-xs font-black uppercase tracking-[0.38em] text-yellow-300/85">Risk Notice</p>
      <p className="mx-auto mt-5 max-w-6xl text-center text-base leading-9 text-yellow-100/90 sm:text-xl">
        $MAD is a meme coin and speculative digital asset. Nothing on this website is financial advice or a guarantee of returns. Crypto is risky and volatile. Never risk money you cannot afford to lose. Always do your own research.
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
              <StatusMiniCard key={card.label} label={card.label} value={card.value} tone={card.tone} icon={card.icon} />
            ))}
          </div>
          <Highway />
          <CommunitySupport />
          <CTASection />
          <RiskNoti
