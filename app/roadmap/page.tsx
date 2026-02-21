/* app/roadmap/page.tsx */
"use client";

import React, { useEffect, useMemo, useState } from "react";

type RoadmapItem = {
  phase: string;
  title: string;
  desc: string;
  done?: boolean;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function RoadmapPage() {
  const roadmap: RoadmapItem[] = useMemo(
    () => [
      { phase: "Phase 1", title: "Bond", desc: "Establish the foundation. Lock in the culture. Build the core.", done: true },
      { phase: "Phase 1.1", title: "300M Burn (30%)", desc: "Proof-of-signal. Big burn. Clear intent.", done: true },
      { phase: "Phase 1.2", title: "350M Burn (35%)", desc: "Phase 1.2 complete — 350,000,000 tokens burned.", done: true },
      { phase: "Phase 1.3", title: "40% Supply Burned", desc: "Target milestone — 40% of total supply burned.", done: false },
      { phase: "Phase 2", title: "$1M", desc: "First major milestone. Momentum becomes visible.", done: false },
      { phase: "Phase 3", title: "$10M", desc: "Scale the culture. Expand the orbit.", done: false },
      { phase: "Phase 4", title: "$50M", desc: "The line gets crowded. The fade gets expensive.", done: false },
    ],
    []
  );

  const completed = useMemo(() => roadmap.filter((r) => r.done).length, [roadmap]);
  const total = roadmap.length;
  const targetPct = useMemo(() => Math.round((completed / total) * 100), [completed, total]);

  // animate bar from 0 -> target
  const [pct, setPct] = useState(0);
  useEffect(() => {
    setPct(0);
    const t = setTimeout(() => setPct(targetPct), 120);
    return () => clearTimeout(t);
  }, [targetPct]);

  const barPct = clamp(pct, 0, 100);

  return (
    <div className="mx-auto max-w-6xl px-6 py-16 animate-fadeUp">
      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/50">Roadmap</p>
      <h1 className="mt-4 text-5xl font-black tracking-tight">Progress</h1>

      <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <div className="text-5xl font-black">{barPct}%</div>
            <p className="mt-2 text-white/60">
              Completed: <span className="text-white font-semibold">{completed}</span> / {total}
            </p>
          </div>

          <div className="text-right text-sm text-white/50">
            <div>Signal getting stronger…</div>
            <div className="mt-1">{barPct}/100</div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-5 h-5 w-full rounded-full bg-black/30 overflow-hidden border border-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-red-500 to-orange-400 transition-[width] duration-1000 ease-out"
            style={{ width: `${barPct}%` }}
          />
        </div>
      </div>

      {/* List */}
      <div className="mt-10 grid gap-4">
        {roadmap.map((r) => (
          <div
            key={r.phase + r.title}
            className="rounded-2xl border border-white/10 bg-black/30 p-6 backdrop-blur"
          >
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/50">
                  {r.phase}
                </p>
                <h3 className="mt-2 text-2xl font-black">{r.title}</h3>
                <p className="mt-2 text-white/65 leading-relaxed">{r.desc}</p>
              </div>

              <div
                className={[
                  "shrink-0 rounded-full px-3 py-1 text-xs font-black border",
                  r.done
                    ? "bg-white/10 text-white border-white/10"
                    : "bg-black/20 text-white/60 border-white/10",
                ].join(" ")}
              >
                {r.done ? "DONE" : "NEXT"}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
