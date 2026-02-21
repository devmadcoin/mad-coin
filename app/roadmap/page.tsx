"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

type RoadmapItem = {
  phase: string;
  title: string;
  desc: string;
  done?: boolean;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function Page() {
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

  // Progress = how many are marked done
  const doneCount = roadmap.filter((r) => r.done).length;
  const totalCount = roadmap.length;
  const targetPct = totalCount ? (doneCount / totalCount) * 100 : 0;

  // Animate fill from 0 -> targetPct on load
  const [animatedPct, setAnimatedPct] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setAnimatedPct(clamp(targetPct, 0, 100)), 120);
    return () => clearTimeout(t);
  }, [targetPct]);

  return (
    <main className="min-h-screen text-white bg-black">
      <style jsx global>{`
        @keyframes madGlow {
          0% { opacity: 0.55; transform: translate3d(-6px, 0, 0); }
          50% { opacity: 0.95; transform: translate3d(6px, 0, 0); }
          100% { opacity: 0.55; transform: translate3d(-6px, 0, 0); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-60%); opacity: 0; }
          20% { opacity: 0.35; }
          50% { opacity: 0.6; }
          80% { opacity: 0.35; }
          100% { transform: translateX(160%); opacity: 0; }
        }
      `}</style>

      <div className="mx-auto w-full max-w-5xl px-6 py-16">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="rounded-2xl border border-white/10 bg-white/10 p-3">
            <Image src="/mad.png" alt="$MAD" width={44} height={44} priority />
          </div>
          <div>
            <div className="text-xs uppercase tracking-[0.35em] text-white/60">Roadmap</div>
            <h1 className="text-3xl sm:text-4xl font-black leading-tight">Progression</h1>
          </div>
        </div>

        {/* Progress bar card */}
        <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8 overflow-hidden relative">
          <div
            className="pointer-events-none absolute -inset-10 blur-3xl"
            style={{
              background:
                "radial-gradient(circle at 20% 50%, rgba(255,110,60,0.35), transparent 60%)," +
                "radial-gradient(circle at 80% 50%, rgba(255,40,40,0.25), transparent 60%)",
              animation: "madGlow 2.8s ease-in-out infinite",
            }}
          />

          <div className="relative">
            <div className="flex items-end justify-between gap-4">
              <div>
                <div className="text-xs uppercase tracking-[0.35em] text-white/55">Completion</div>
                <div className="mt-2 text-2xl sm:text-3xl font-black">
                  {doneCount}/{totalCount} done
                </div>
              </div>

              <div className="text-sm font-black text-white/70 tabular-nums">
                {Math.round(targetPct)}%
              </div>
            </div>

            <div className="mt-5 h-4 w-full rounded-full bg-white/10 border border-white/10 overflow-hidden relative">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{
                  width: `${animatedPct}%`,
                  background: "linear-gradient(90deg, rgba(255,50,50,0.9), rgba(255,140,60,0.9))",
                }}
              />

              {/* Shimmer */}
              <div
                className="absolute inset-y-0 left-0 w-1/3"
                style={{
                  background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)",
                  animation: "shimmer 1.8s linear infinite",
                }}
              />
            </div>

            <p className="mt-3 text-xs text-white/45">
              This bar fills automatically based on which phases are marked <span className="font-black text-white/70">done: true</span>.
            </p>
          </div>
        </div>

        {/* Roadmap list */}
        <div className="mt-10 grid gap-5">
          {roadmap.map((item) => {
            const done = !!item.done;
            return (
              <div
                key={item.phase + item.title}
                className={[
                  "rounded-3xl border border-white/10 bg-white/5 p-6 transition",
                  done ? "opacity-80" : "hover:bg-white/10",
                ].join(" ")}
              >
                <div className="flex items-center justify-between gap-3">
                  <p className={["text-xs uppercase tracking-[0.35em] text-white/50", done ? "line-through decoration-white/30" : ""].join(" ")}>
                    {item.phase}
                  </p>
                  <span className="text-xs font-black text-white/55">{done ? "Completed" : "Not Completed"}</span>
                </div>

                <div className="mt-2 flex items-baseline gap-3">
                  <h3 className={["text-2xl sm:text-3xl font-black", done ? "line-through decoration-white/25" : ""].join(" ")}>
                    {item.title}
                  </h3>
                  <span className="h-px flex-1 bg-white/10" />
                </div>

                <p className={["text-white/65 mt-2 leading-[1.95]", done ? "line-through decoration-white/15" : ""].join(" ")}>
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-10 text-center text-xs text-white/35">
          Tip: Mark a phase as done by setting <span className="font-mono">done: true</span>.
        </div>
      </div>
    </main>
  );
}
