/* app/roadmap/page.tsx */

import Image from "next/image";

type RoadmapItem = {
  phase: string;
  title: string;
  desc: string;
  done?: boolean;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function formatCompactUSD(n: number) {
  if (!Number.isFinite(n)) return "$0";
  const abs = Math.abs(n);
  if (abs >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(1)}B`;
  if (abs >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${Math.round(n).toString()}`;
}

export default function Page() {
  // --- EDIT THIS WHEN YOU WANT ---
  // If you don’t know current mcap, leave 0 and the bar will sit at 0%.
  const CURRENT_MCAP_USD = 0;

  // Goal: $100M
  const GOAL_USD = 100_000_000;

  const progressPct = clamp((CURRENT_MCAP_USD / GOAL_USD) * 100, 0, 100);

  const roadmap: RoadmapItem[] = [
    {
      phase: "Phase 1",
      title: "Bond",
      desc: "Establish the foundation. Lock in the culture. Build the core.",
      done: true,
    },
    {
      phase: "Phase 1.1",
      title: "300M Burn (30%)",
      desc: "Proof-of-signal. Big burn. Clear intent.",
      done: true,
    },
    {
      phase: "Phase 1.2",
      title: "350M Burn (35%)",
      desc: "Phase 1.2 complete — 350,000,000 tokens burned.",
      done: true,
    },
    {
      phase: "Phase 1.3",
      title: "40% Supply Burned",
      desc: "Target milestone — 40% of total supply burned.",
      done: false,
    },
    {
      phase: "Phase 2",
      title: "$1M",
      desc: "First major milestone. Momentum becomes visible.",
      done: false,
    },
    {
      phase: "Phase 3",
      title: "$10M",
      desc: "Scale the culture. Expand the orbit.",
      done: false,
    },
    {
      phase: "Phase 4",
      title: "$50M",
      desc: "The line gets crowded. The fade gets expensive.",
      done: false,
    },
    {
      phase: "Phase 5",
      title: "$100M",
      desc: "Full signal. The mission is obvious to everyone.",
      done: false,
    },
  ];

  const milestones = [
    { label: "$1M", value: 1_000_000 },
    { label: "$10M", value: 10_000_000 },
    { label: "$50M", value: 50_000_000 },
    { label: "$100M", value: 100_000_000 },
  ];

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto w-full max-w-5xl px-6 py-14">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="rounded-2xl bg-white/10 p-3 border border-white/10">
            <Image src="/mad.png" alt="$MAD logo" width={44} height={44} priority />
          </div>
          <div>
            <div className="text-xs uppercase tracking-[0.35em] text-white/60">Roadmap</div>
            <h1 className="text-3xl sm:text-4xl font-black leading-tight">To $100M.</h1>
            <p className="mt-2 text-white/65 max-w-2xl leading-relaxed">
              Simple milestones. Loud progress. No mystery math.
            </p>
          </div>
        </div>

        {/* Progress Meter */}
        <section className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
            <div>
              <div className="text-sm font-black">Progress Meter</div>
              <div className="text-xs text-white/55 mt-1">
                Current:{" "}
                <span className="text-white/80">{formatCompactUSD(CURRENT_MCAP_USD)}</span>{" "}
                / Goal: <span className="text-white/80">{formatCompactUSD(GOAL_USD)}</span>
              </div>
            </div>
            <div className="text-xs text-white/55">
              Edit <span className="text-white/80">CURRENT_MCAP_USD</span> in this file whenever you want.
            </div>
          </div>

          {/* Animated Progress Bar */}
          <div className="mt-4 h-4 w-full rounded-full bg-white/10 overflow-hidden border border-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-red-500/80 to-orange-500/80 transition-[width] duration-700 ease-out relative"
              style={{ width: `${progressPct}%` }}
              aria-label="progress bar"
            >
              {/* moving shine */}
              <div className="absolute inset-0 opacity-35 animate-madShine bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.35),transparent)]" />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {milestones.map((m) => {
              const hit = CURRENT_MCAP_USD >= m.value && CURRENT_MCAP_USD > 0;
              return (
                <div
                  key={m.label}
                  className={`rounded-2xl border p-3 text-center ${
                    hit ? "border-white/20 bg-white/10" : "border-white/10 bg-white/5"
                  }`}
                >
                  <div className="text-xs text-white/60">Milestone</div>
                  <div className="mt-1 font-black">{m.label}</div>
                  <div className="mt-1 text-[11px] text-white/55">{hit ? "Cleared ✅" : "Pending"}</div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Roadmap Cards */}
        <section className="mt-10 grid grid-cols-1 gap-4">
          {roadmap.map((r) => (
            <div key={r.phase} className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs uppercase tracking-[0.25em] text-white/55">{r.phase}</div>
                  <div className="mt-1 text-xl font-black">{r.title}</div>
                  <p className="mt-2 text-white/65 leading-relaxed">{r.desc}</p>
                </div>
                <div
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-black border ${
                    r.done ? "bg-white/10 border-white/20 text-white" : "bg-white/5 border-white/10 text-white/70"
                  }`}
                >
                  {r.done ? "DONE" : "LOCKED"}
                </div>
              </div>
            </div>
          ))}
        </section>

        <footer className="mt-12 text-center text-white/35 text-sm">© {new Date().getFullYear()} $MAD.</footer>

        {/* tiny global anim for the bar shine */}
        <style jsx global>{`
          @keyframes madShine {
            0% {
              transform: translateX(-120%);
            }
            100% {
              transform: translateX(120%);
            }
          }
          .animate-madShine {
            animation: madShine 1.4s linear infinite;
          }
        `}</style>
      </div>
    </main>
  );
}
