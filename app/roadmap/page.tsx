"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

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

  // Animate bar: start at 0 then fill to target
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setPct(targetPct), 150);
    return () => clearTimeout(t);
  }, [targetPct]);

  const barPct = clamp(pct, 0, 100);

  return (
    <div className="mx-auto max-w-5xl px-6 py-14">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-white/50">Roadmap</p>
          <h1 className="mt-3 text-4xl sm:text-5xl font-black">Progress</h1>
          <p className="mt-3 text-white/65 leading-[1.8]">
            Completed: <span className="font-black text-white">{completed}</span> / {total}
          </p>
        </div>

        <Link
          href="/"
          className="rounded-full px-5 py-3 text-sm font-black border border-white/10 bg-white/5 hover:bg-white/10 transition"
        >
          ← Back to Home
        </Link>
      </div>

      {/* PROGRESS BAR */}
      <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-6">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-white/50">Overall completion</p>
            <div className="mt-2 text-3xl sm:text-4xl font-black tabular-nums">{barPct}%</div>
          </div>

          <div className="text-xs text-white/45">
            Tip: when you mark a phase done, the bar updates automatically.
          </div>
        </div>

        <div className="mt-5 h-3 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-red-500 to-orange-500 transition-all duration-700 ease-out"
            style={{ width: `${barPct}%` }}
          />
        </div>

        {/* little “shine” animation */}
        <div className="mt-4 relative h-10 overflow-hidden rounded-2xl border border-white/10 bg-black/30">
          <div
            className="absolute inset-y-0 w-1/3 bg-white/10 blur-xl"
            style={{
              transform: "translateX(-40%)",
              animation: "slideShine 1.8s linear infinite",
            }}
          />
          <div className="relative z-10 h-full flex items-center justify-between px-4 text-xs text-white/60">
            <span>Signal getting stronger…</span>
            <span className="tabular-nums">{barPct}/100</span>
          </div>
        </div>

        {/* normal <style> tag is fine in client component */}
        <style>{`
          @keyframes slideShine {
            0% { left: -40%; opacity: 0.0; }
            10% { opacity: 0.6; }
            50% { opacity: 0.35; }
            90% { opacity: 0.6; }
            100% { left: 120%; opacity: 0.0; }
          }
        `}</style>
      </div>

      {/* LIST */}
      <div className="mt-10 grid gap-5">
        {roadmap.map((item) => {
          const done = !!item.done;
          return (
            <div
              key={item.phase + item.title}
              className={[
                "rounded-3xl border border-white/10 p-6 transition",
                done ? "bg-white/5 opacity-85" : "bg-white/5 hover:bg-white/10",
              ].join(" ")}
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs uppercase tracking-[0.35em] text-white/50">{item.phase}</p>
                <span className="text-xs font-black text-white/55">{done ? "Completed" : "Not Completed"}</span>
              </div>

              <h3 className="mt-2 text-2xl sm:text-3xl font-black">{item.title}</h3>
              <p className="mt-2 text-white/65 leading-[1.9]">{item.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
