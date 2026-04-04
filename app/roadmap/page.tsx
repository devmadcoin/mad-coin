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
      cls: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    };
  }

  if (status === "in_progress") {
    return {
      label: "In Progress",
      cls: "bg-red-500/15 text-red-300 border-red-500/30",
    };
  }

  return {
    label: "Locked",
    cls: "bg-white/5 text-white/50 border-white/10",
  };
}

function phaseBarWidth(status: Status) {
  if (status === "complete") return "100%";
  if (status === "in_progress") return "60%";
  return "10%";
}

export default function RoadmapPage() {
  const items: RoadmapItem[] = useMemo(
    () => [
      {
        phase: "PHASE 1",
        title: "Foundation",
        desc: "Launch $MAD. Establish identity. Deploy system.",
        status: "complete",
      },
      {
        phase: "PHASE 1.2",
        title: "Token Lock",
        desc: "111M tokens locked → anti-rug architecture activated.",
        status: "complete",
      },
      {
        phase: "PHASE 1.3",
        title: "Supply Burn",
        desc: "450M tokens burned → scarcity engine engaged.",
        status: "complete",
      },
      {
        phase: "PHASE 1.4",
        title: "Signal Expansion",
        desc: "Listed on CoinGecko → visibility unlocked.",
        status: "complete",
      },
      {
        phase: "PHASE 1.5",
        title: "Liquidity Access",
        desc: "Live on Jupiter → frictionless entry.",
        status: "complete",
      },
      {
        phase: "PHASE 1.6",
        title: "Physical Layer",
        desc: "$MAD merch enters real world.",
        status: "complete",
      },
      {
        phase: "PHASE 2",
        title: "Acquisition Engine",
        desc: "Acquire supply + support community growth.",
        status: "planned",
      },
      {
        phase: "PHASE 3",
        title: "Game Integration",
        desc: "$MAD Roblox experience launches.",
        status: "planned",
      },
      {
        phase: "PHASE 4",
        title: "Final Burn",
        desc: "Push total burn to 800M supply.",
        status: "in_progress",
      },
    ],
    []
  );

  const total = items.length;
  const completed = items.filter((x) => x.status === "complete").length;
  const pct = clamp(Math.round((completed / total) * 100), 0, 100);

  return (
    <div className="relative overflow-hidden bg-black text-white">
      
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,0,60,0.25),transparent_60%),radial-gradient(circle_at_80%_40%,rgba(255,80,0,0.18),transparent_60%)]" />

      <div className="relative mx-auto max-w-6xl px-6 pb-24 pt-20">

        {/* HEADER */}
        <div className="max-w-3xl">
          <p className="text-xs tracking-[0.4em] text-white/50 uppercase">
            SYSTEM PROGRESSION
          </p>

          <h1 className="mt-6 text-6xl sm:text-7xl font-black">
            <span className="text-red-500 drop-shadow-[0_0_18px_rgba(255,0,0,0.8)]">
              $MAD
            </span>{" "}
            Roadmap
          </h1>

          <p className="mt-4 text-white/60 max-w-lg">
            Not hype. Not promises.  
            A system expanding in real time.
          </p>
        </div>

        {/* PROGRESS PANEL */}
        <div className="mt-12 rounded-3xl border border-white/10 bg-black/40 p-8 backdrop-blur-xl">

          <div className="flex items-center justify-between">
            <p className="text-sm text-white/60">
              {completed} / {total} Phases Complete
            </p>

            <div className="text-xl font-bold text-white">
              {pct}%
            </div>
          </div>

          <div className="mt-6 h-3 w-full rounded-full bg-white/5 overflow-hidden border border-white/10">
            <div
              className="h-full bg-red-500 transition-all duration-700"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {/* ROADMAP CARDS */}
        <div className="mt-12 space-y-6">
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
    <div className="group rounded-3xl border border-white/10 bg-black/30 p-6 backdrop-blur-xl transition hover:border-red-500/30 hover:scale-[1.01]">

      <div className="flex justify-between items-start gap-4">
        <div>
          <p className="text-xs tracking-[0.3em] text-white/40 uppercase">
            {item.phase}
          </p>

          <h3 className="mt-2 text-2xl font-bold group-hover:text-red-400 transition">
            {item.title}
          </h3>

          <p className="mt-2 text-white/60 text-sm max-w-md">
            {item.desc}
          </p>
        </div>

        <div className={`rounded-full border px-3 py-1 text-xs ${chip.cls}`}>
          {chip.label}
        </div>
      </div>

      {/* PROGRESS BAR */}
      <div className="mt-5 h-2 w-full bg-white/5 rounded-full overflow-hidden">
        <div
          className={`h-full ${
            item.status === "complete"
              ? "bg-emerald-400"
              : item.status === "in_progress"
              ? "bg-red-400"
              : "bg-white/20"
          }`}
          style={{ width: barWidth }}
        />
      </div>
    </div>
  );
}
