/* app/roadmap/page.tsx */
"use client";

import React from "react";

export default function Roadmap() {
  const phases = [
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
  ];

  return (
    <div className="relative overflow-hidden">
      <div className="relative mx-auto max-w-5xl px-6 pt-20 pb-24">

        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/60">
            Structure before hype.
          </p>

          <h1 className="mt-6 text-5xl sm:text-6xl font-black tracking-tight">
            $MAD Roadmap
          </h1>

          <p className="mt-6 text-white/70">
            Anti-rug architecture. Controlled expansion. Disciplined growth.
          </p>
        </div>

        <div className="mt-16 space-y-8">
          {phases.map((item, i) => (
            <div
              key={i}
              className="rounded-3xl border border-white/10 bg-black/40 p-8 backdrop-blur-xl"
            >
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-white/50">
                    {item.phase}
                  </p>
                  <h2 className="mt-2 text-2xl font-black">
                    {item.title}
                  </h2>
                </div>

                <div
                  className={`rounded-full px-4 py-2 text-xs font-bold ${
                    item.done
                      ? "bg-green-500/20 text-green-400"
                      : "bg-white/10 text-white/60"
                  }`}
                >
                  {item.done ? "Complete" : "In Progress"}
                </div>
              </div>

              <p className="mt-4 text-white/70">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
