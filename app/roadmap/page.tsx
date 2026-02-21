/* app/roadmap/page.tsx */
"use client";

import React, { useMemo } from "react";
import Image from "next/image";

type RoadmapItem = {
  phase: string;
  title: string;
  desc: string;
  status: "complete" | "in_progress" | "planned";
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function RoadmapPage() {
  const items: RoadmapItem[] = useMemo(
    () => [
      {
        phase: "PHASE 1",
        title: "Foundation",
        desc: "Launch $MAD. Establish identity. Deploy site.",
        status: "complete",
      },
      {
        phase: "PHASE 1.2",
        title: "Supply Burn",
        desc: "Burn 350,000,000 tokens to reinforce anti-rug structure.",
        status: "complete",
      },
      {
        phase: "PHASE 2",
        title: "Forge Expansion",
        desc: "Launch identity forge and expand digital emotion layer.",
        status: "in_progress",
      },
      {
        phase: "PHASE 3",
        title: "Cultural Expansion",
        desc: "Community campaigns, meme vault growth, ecosystem depth.",
        status: "in_progress",
      },
    ],
    []
  );

  const total = items.length;
  const completed = items.filter((x) => x.status === "complete").length;
  const pct = clamp(Math.round((completed / total) * 100), 0, 100);

  // IMPORTANT: your filenames include spaces + the "sticker.webp " prefix.
  // This path matches your current GitHub uploads exactly.
  const chillSrc = "/stickers/sticker.webp%20Chill.webp";

  return (
    <div className="relative overflow-hidden">
      {/* background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,0,60,0.22),transparent_55%),radial-gradient(circle_at_80%_40%,rgba(255,80,0,0.18),transparent_60%),radial-gradient(circle_at_50%_90%,rgba(255,0,0,0.14),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-25 [background:linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:48px_48px]" />

      <div className="relative mx-auto max-w-6xl px-6 pt-16 pb-24">
        {/* Header */}
        <div className="mx-auto max-w-3xl animate-fadeUp">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/60">
            STRUCTURE BEFORE HYPE.
          </p>

          <h1 className="mt-6 text-6xl font-black tracking-tight sm:text-7xl">
            <span className="text-white">$MAD</span> Roadmap
          </h1>

          <p className="mt-5 max-w-xl text-white/70 leading-relaxed">
            Anti-rug architecture. Controlled expansion. Disciplined growth.
          </p>
        </div>

        {/* Overall progress card (with Chill sticker + bar underneath) */}
        <div className="mt-10 animate-fadeUp">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/35 p-6 backdrop-blur-xl shadow-2xl">
            {/* Chill sticker */}
            <div className="pointer-events-none absolute -right-10 -top-10 hidden md:block opacity-95">
              <Image
                src={chillSrc}
                alt="Chill sticker"
                width={260}
                height={260}
                priority={false}
              />
            </div>

            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/50">
                  OVERALL PROGRESS
                </p>
                <p className="mt-2 text-sm text-white/70">
                  {completed} of {total} phases complete
                </p>
              </div>

              <div className="shrink-0 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/80">
                {pct}%
              </div>
            </div>

            {/* Progress bar moved UNDER the sticker row */}
            <div className="mt-5">
              <div className="mad-progress-track">
                <div className="mad-progress-fill" style={{ width: `${pct}%` }} />
              </div>
              <p className="mt-2 text-xs text-white/40">
                Progress updates as phases are marked complete.
              </p>
            </div>
          </div>
        </div>

        {/* Roadmap cards */}
        <div className="mt-10 space-y-6">
          {items.map((item) => (
            <RoadmapCard key={item.phase} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}

function RoadmapCard({ item }: { item: RoadmapItem }) {
  const isDone = item.status === "complete";
  const isProgress = item.status === "in_progress";

  const chip =
    item.status === "complete"
      ? "Complete"
      : item.status === "in_progress"
      ? "In Progress"
      : "Planned";

  return (
    <div className="animate-fadeUp">
      <div className="rounded-3xl border border-white/10 bg-black/30 p-6 backdrop-blur-xl shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/50">
              {item.phase}
            </p>
            <h3 className="mt-3 text-3xl font-black">{item.title}</h3>
            <p className="mt-3 text-white/70">{item.desc}</p>
          </div>

          <div
            className={[
              "shrink-0 rounded-full px-4 py-2 text-xs font-semibold border",
              isDone
                ? "bg-emerald-500/15 text-emerald-200 border-emerald-500/25"
                : isProgress
                ? "bg-white/10 text-white/75 border-white/10"
                : "bg-white/5 text-white/60 border-white/10",
            ].join(" ")}
          >
            {chip}
          </div>
        </div>

        {/* Optional bottom bar per phase */}
        <div className="mt-6">
          <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden border border-white/10">
            <div
              className={[
                "h-full rounded-full",
                isDone ? "bg-emerald-400/70" : isProgress ? "bg-white/15" : "bg-white/10",
              ].join(" ")}
              style={{ width: isDone ? "100%" : isProgress ? "55%" : "15%" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
