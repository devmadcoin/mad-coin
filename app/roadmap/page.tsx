/* app/roadmap/page.tsx */
"use client";

import React, { useMemo } from "react";
import Image from "next/image";

type Status = "complete" | "in_progress" | "planned";

type RoadmapItem = {
  phase: string;
  title: string;
  desc: string;
  status: Status;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function statusChip(status: Status) {
  if (status === "complete") {
    return {
      label: "Complete",
      cls: "bg-emerald-500/15 text-emerald-200 border-emerald-500/25",
    };
  }
  if (status === "in_progress") {
    return {
      label: "In Progress",
      cls: "bg-white/10 text-white/75 border-white/10",
    };
  }
  return { label: "Planned", cls: "bg-white/5 text-white/60 border-white/10" };
}

function phaseBarWidth(status: Status) {
  if (status === "complete") return "100%";
  if (status === "in_progress") return "55%";
  return "15%";
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
        title: "Lock Tokens",
        desc: "Lock 111,000,000 tokens until 6/1/26 to reinforce anti-rug structure.",
        status: "complete",
      },
      {
        phase: "PHASE 1.3",
        title: "400M Token Burn",
        desc: "Burned 400,000,000 tokens reaching a 40% burn rate and strengthening the anti-rug structure.",
        status: "complete",
      },
      {
        phase: "PHASE 1.4",
        title: "Acquire + Support",
        desc: "Acquire 8,000,000 supply and support 1 community through $MAD.",
        status: "planned",
      },
      {
        phase: "PHASE 2",
        title: "Physical Sticker Merchandise",
        desc: "Launch physical $MAD sticker merch for the community.",
        status: "planned",
      },
      {
        phase: "PHASE 3",
        title: "$MAD Roblox Game",
        desc: "Build and release the official $MAD Roblox game.",
        status: "planned",
      },
      {
        phase: "PHASE 4",
        title: "Reach $1M Market Cap",
        desc: "Hit a $1,000,000 market cap milestone through disciplined growth.",
        status: "planned",
      },
      {
        phase: "PHASE 5",
        title: "Reach $25M + $MAD Tattoo",
        desc: "Hit $25,000,000 market cap and get a $MAD tattoo.",
        status: "planned",
      },
      {
        phase: "PHASE 6",
        title: "Reach $50M Market Cap",
        desc: "Hit a $50,000,000 market cap milestone.",
        status: "planned",
      },
      {
        phase: "PHASE 7",
        title: "Reach $100M Market Cap",
        desc: "Hit a $100,000,000 market cap milestone.",
        status: "planned",
      },
      {
        phase: "PHASE 8",
        title: "Burn 800M Tokens",
        desc: "The long-term mission. Push total tokens burned to 800,000,000 following the challenge issued during the Gork moment.",
        status: "in_progress",
      },
    ],
    []
  );

  const total = items.length;
  const completed = items.filter((x) => x.status === "complete").length;
  const pct = clamp(Math.round((completed / total) * 100), 0, 100);

  const chillSrc = "/stickers/chill.webp";

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,0,60,0.22),transparent_55%),radial-gradient(circle_at_80%_40%,rgba(255,80,0,0.18),transparent_60%),radial-gradient(circle_at_50%_90%,rgba(255,0,0,0.14),transparent_55%)]" />

      <div className="relative mx-auto max-w-6xl px-6 pt-16 pb-24">
        <div className="mx-auto max-w-3xl animate-fadeUp">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/60">
            STRUCTURE BEFORE HYPE.
          </p>

          <h1 className="mt-6 text-6xl font-black tracking-tight sm:text-7xl">
            <span className="text-red-500 drop-shadow-[0_0_14px_rgba(255,0,0,0.65)]">
              $MAD
            </span>{" "}
            Roadmap
          </h1>

          <p className="mt-5 max-w-xl text-white/70 leading-relaxed">
            Anti-rug architecture. Controlled expansion. Disciplined growth.
          </p>
        </div>

        <div className="mt-10 animate-fadeUp">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/35 p-6 backdrop-blur-xl shadow-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/50">
              OVERALL PROGRESS
            </p>

            <p className="mt-2 text-sm text-white/70">
              {completed} of {total} phases complete
            </p>

            <div className="pointer-events-none mt-6 flex justify-center">
              <Image
                src={chillSrc}
                alt="Chill sticker"
                width={220}
                height={220}
                className="object-contain drop-shadow-[0_16px_30px_rgba(0,0,0,0.45)]"
                priority
              />
            </div>

            <div className="mt-6 w-full max-w-2xl mx-auto">
              <div className="flex items-center gap-4">
                <div className="mad-progress-track flex-1">
                  <div
                    className="mad-progress-fill"
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <div className="shrink-0 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm font-semibold text-white/90">
                  {pct}%
                </div>
              </div>

              <p className="mt-3 text-center text-xs text-white/40">
                Progress updates as phases are marked complete.
              </p>
            </div>
          </div>
        </div>

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
  const chip = statusChip(item.status);
  const barWidth = phaseBarWidth(item.status);

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
              chip.cls,
            ].join(" ")}
          >
            {chip.label}
          </div>
        </div>

        <div className="mt-6">
          <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden border border-white/10">
            <div
              className={[
                "h-full rounded-full",
                item.status === "complete"
                  ? "bg-emerald-400/70"
                  : item.status === "in_progress"
                  ? "bg-white/15"
                  : "bg-white/10",
              ].join(" ")}
              style={{ width: barWidth }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
