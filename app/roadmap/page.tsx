/* app/roadmap/page.tsx */
"use client";

import React, { useEffect, useMemo, useState } from "react";

type Phase = {
  phase: string;
  title: string;
  desc: string;
  done?: boolean;
};

export default function Roadmap() {
  const phases: Phase[] = useMemo(
    () => [
      {
        phase: "Phase 1",
        title: "Foundation",
        desc: "Launch $MAD. Establish identity. Deploy site.",
        done: true,
      },
      {
        phase: "Phase 1.2",
        title: "Supply Burn",
        desc: "Burn 350,000,000 tokens to reinforce anti-rug structure.",
        done: true,
      },
      {
        phase: "Phase 2",
        title: "Forge Expansion",
        desc: "Launch identity forge and expand digital emotion layer.",
        done: false,
      },
      {
        phase: "Phase 3",
        title: "Cultural Expansion",
        desc: "Community campaigns, meme vault growth, ecosystem depth.",
        done: false,
      },
    ],
    []
  );

  const doneCount = phases.filter((p) => p.done).length;
  const totalCount = phases.length;
  const pct = totalCount === 0 ? 0 : Math.round((doneCount / totalCount) * 100);

  // triggers the “fill” animation after mount
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="relative overflow-hidden">
      {/* subtle bg */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,0,60,0.16),transparent_55%),radial-gradient(circle_at_80%_40%,rgba(255,80,0,0.12),transparent_60%),radial-gradient(circle_at_50%_90%,rgba(255,0,0,0.10),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-20 [background:linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:48px_48px]" />

      <div className="relative mx-auto max-w-5xl px-6 pt-20 pb-24">
        {/* Header */}
        <div className="max-w-3xl animate-fadeUp">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/60">
            Structure before hype.
          </p>

          <h1 className="mt-6 text-5xl sm:text-6xl font-black tracking-tight">
            $MAD Roadmap
          </h1>

          <p className="mt-6 text-white/70">
            Anti-rug architecture. Controlled expansion. Disciplined growth.
          </p>

          {/* Animated Progress Bar */}
          <div className="mt-10 rounded-3xl border border-white/10 bg-black/35 p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-white/50">
                  Overall Progress
                </p>
                <p className="mt-2 text-white/80">
                  {doneCount} of {totalCount} phases complete
                </p>
              </div>

              <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-white/80">
                {pct}%
              </div>
            </div>

            <div className="mt-5 h-3 overflow-hidden rounded-full border border-white/10 bg-white/5">
              <div
                className={[
                  "h-full rounded-full",
                  // looks “luxury” without neon
                  "bg-gradient-to-r from-white/30 via-white/60 to-white/30",
                  "shadow-[0_0_30px_rgba(255,255,255,0.10)]",
                  "transition-[width] duration-1000 ease-out",
                ].join(" ")}
                style={{ width: mounted ? `${pct}%` : "0%" }}
              />
            </div>

            <p className="mt-3 text-xs text-white/45">
              Progress updates as phases are marked complete.
            </p>
          </div>
        </div>

        {/* Phase Cards */}
        <div className="mt-16 space-y-8">
          {phases.map((item, i) => {
            const isDone = !!item.done;

            return (
              <div
                key={i}
                className="rounded-3xl border border-white/10 bg-black/40 p-8 backdrop-blur-xl"
              >
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-white/50">
                      {item.phase}
                    </p>
                    <h2 className="mt-2 text-2xl font-black">{item.title}</h2>
                  </div>

                  <div
                    className={[
                      "rounded-full px-4 py-2 text-xs font-bold",
                      isDone
                        ? "bg-green-500/20 text-green-400"
                        : "bg-white/10 text-white/60",
                    ].join(" ")}
                  >
                    {isDone ? "Complete" : "In Progress"}
                  </div>
                </div>

                <p className="mt-4 text-white/70">{item.desc}</p>

                {/* Optional: tiny per-phase bar (animated too) */}
                <div className="mt-6 h-2 overflow-hidden rounded-full border border-white/10 bg-white/5">
                  <div
                    className={[
                      "h-full rounded-full transition-[width] duration-700 ease-out",
                      isDone
                        ? "bg-green-400/60"
                        : "bg-white/20",
                    ].join(" ")}
                    style={{ width: mounted ? (isDone ? "100%" : "35%") : "0%" }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
