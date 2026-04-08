"use client";

import React, { useEffect, useMemo, useState } from "react";

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

function statusDot(status: Status) {
  if (status === "complete") {
    return "border-emerald-400 bg-emerald-400 shadow-[0_0_22px_rgba(52,211,153,0.55)]";
  }
  if (status === "in_progress") {
    return "border-red-400 bg-red-400 shadow-[0_0_22px_rgba(248,113,113,0.65)]";
  }
  return "border-white/25 bg-[#101010]";
}

function phaseBarWidth(status: Status) {
  if (status === "complete") return "100%";
  if (status === "in_progress") return "60%";
  return "10%";
}

function pointY(status: Status, index: number) {
  if (status === "complete") {
    return [68, 56, 44, 36, 28, 22][index] ?? 28;
  }
  if (status === "in_progress") {
    return 18;
  }
  return [26, 20, 14][index % 3] ?? 18;
}

export default function RoadmapPage() {
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setAnimateIn(true), 120);
    return () => window.clearTimeout(t);
  }, []);

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
  const inProgress = items.filter((x) => x.status === "in_progress").length;
  const pct = clamp(Math.round((completed / total) * 100), 0, 100);

  const points = items.map((item, index) => {
    const x = (index / (items.length - 1)) * 100;
    const y = pointY(item.status, index);
    return { ...item, x, y, index };
  });

  const pathD = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  const currentIndex =
    items.findIndex((item) => item.status === "in_progress") !== -1
      ? items.findIndex((item) => item.status === "in_progress")
      : completed - 1;

  const currentPoint = points[Math.max(0, currentIndex)];

  return (
    <div className="relative overflow-hidden bg-[#050505] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(255,0,60,0.18),transparent_40%),radial-gradient(circle_at_82%_32%,rgba(255,80,0,0.14),transparent_42%),radial-gradient(circle_at_50%_100%,rgba(255,40,40,0.12),transparent_55%)]" />
        <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:42px_42px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/70" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-20">
        <div className="max-w-3xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.4em] text-white/45">
            SIGNAL PATH
          </p>

          <h1 className="mt-5 text-5xl font-black leading-[0.92] tracking-tight sm:text-6xl lg:text-7xl">
            <span className="text-red-500 drop-shadow-[0_0_18px_rgba(255,0,0,0.7)]">
              $MAD
            </span>{" "}
            Roadmap
          </h1>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-white/62 sm:text-base">
            Not hype. Not promises. A system expanding in real time. Track the
            signal, watch the movement, and see where the next phase begins.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <StatCard label="Complete" value={`${completed}`} />
          <StatCard label="Active" value={`${inProgress}`} accent />
          <StatCard label="Progress" value={`${pct}%`} />
        </div>

        <section className="mt-10 overflow-hidden rounded-[36px] border border-white/10 bg-black/35 p-5 shadow-[0_24px_100px_rgba(0,0,0,0.42)] backdrop-blur-xl sm:p-7 lg:p-8">
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-white/42">
                Momentum Map
              </p>
              <h2 className="mt-3 text-3xl font-black leading-[0.95] sm:text-4xl">
                Charting the climb.
              </h2>
            </div>

            <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.06] px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.24em] text-red-300/80">
                You Are Here
              </p>
              <p className="mt-1 text-sm font-bold text-white">
                {currentPoint?.phase} — {currentPoint?.title}
              </p>
            </div>
          </div>

          <div className="rounded-[30px] border border-white/10 bg-[#080808] p-4 sm:p-6">
            <div className="relative h-[300px] w-full overflow-hidden rounded-[24px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))] sm:h-[360px]">
              <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(to_right,rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:56px_56px]" />

              <div className="pointer-events-none absolute left-0 right-0 top-[18%] border-t border-white/8" />
              <div className="pointer-events-none absolute left-0 right-0 top-[38%] border-t border-white/8" />
              <div className="pointer-events-none absolute left-0 right-0 top-[58%] border-t border-white/8" />
              <div className="pointer-events-none absolute left-0 right-0 top-[78%] border-t border-white/8" />

              <div className="absolute inset-0">
                <svg
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  className="h-full w-full"
                >
                  <defs>
                    <linearGradient id="madPathGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="rgba(255,80,80,0.35)" />
                      <stop offset="55%" stopColor="rgba(255,59,48,1)" />
                      <stop offset="100%" stopColor="rgba(255,180,120,0.55)" />
                    </linearGradient>
                  </defs>

                  <path
                    d={pathD}
                    fill="none"
                    stroke="rgba(255,255,255,0.08)"
                    strokeWidth="1.8"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  />

                  <path
                    d={pathD}
                    fill="none"
                    stroke="url(#madPathGlow)"
                    strokeWidth="2.4"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    className={animateIn ? "roadmap-draw" : "opacity-0"}
                  />
                </svg>
              </div>

              <div className="absolute inset-0">
                {points.map((point, index) => {
                  const active = index === currentIndex;
                  const isComplete = point.status === "complete";
                  const isPlanned = point.status === "planned";

                  return (
                    <button
                      key={point.phase}
                      type="button"
                      className="group absolute -translate-x-1/2 -translate-y-1/2 text-left"
                      style={{
                        left: `${point.x}%`,
                        top: `${point.y}%`,
                        transitionDelay: `${150 + index * 90}ms`,
                      }}
                    >
                      <div
                        className={[
                          "relative flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all duration-500",
                          statusDot(point.status),
                          animateIn ? "scale-100 opacity-100" : "scale-75 opacity-0",
                          active ? "ring-8 ring-red-500/10" : "",
                        ].join(" ")}
                      >
                        {active ? (
                          <span className="absolute inline-flex h-10 w-10 animate-ping rounded-full bg-red-500/20" />
                        ) : null}
                      </div>

                      <div
                        className={[
                          "absolute left-1/2 top-7 w-[150px] -translate-x-1/2 rounded-2xl border px-3 py-2 backdrop-blur-xl transition duration-300 sm:w-[170px]",
                          isComplete
                            ? "border-emerald-500/20 bg-emerald-500/[0.06]"
                            : active
                            ? "border-red-500/25 bg-red-500/[0.08]"
                            : "border-white/10 bg-black/55",
                          isPlanned ? "opacity-90" : "",
                        ].join(" ")}
                      >
                        <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/45">
                          {point.phase}
                        </p>
                        <p className="mt-1 text-xs font-bold text-white sm:text-sm">
                          {point.title}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div
                className="pointer-events-none absolute bottom-4 left-4 rounded-full border border-white/10 bg-black/55 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-white/45 backdrop-blur"
              >
                Live roadmap signal
              </div>
            </div>

            <div className="mt-5">
              <div className="h-3 w-full overflow-hidden rounded-full border border-white/10 bg-white/5">
                <div
                  className="h-full rounded-full bg-red-500 transition-all duration-1000"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="mt-3 text-sm text-white/52">
                {completed} of {total} roadmap phases completed.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-12">
          <div className="mb-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-white/42">
              Phase Details
            </p>
            <h2 className="mt-3 text-3xl font-black leading-[0.95] sm:text-4xl">
              Every signal point, explained.
            </h2>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            {items.map((item) => (
              <RoadmapCard key={item.phase} item={item} />
            ))}
          </div>
        </section>
      </div>

      <style jsx>{`
        .roadmap-draw {
          stroke-dasharray: 220;
          stroke-dashoffset: 220;
          animation: roadmapDraw 1.6s ease-out forwards;
        }

        @keyframes roadmapDraw {
          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </div>
  );
}

function StatCard({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div
      className={[
        "rounded-[28px] border p-5 backdrop-blur-xl",
        accent
          ? "border-red-500/20 bg-red-500/[0.06]"
          : "border-white/10 bg-black/35",
      ].join(" ")}
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/42">
        {label}
      </p>
      <p className="mt-3 text-3xl font-black text-white">{value}</p>
    </div>
  );
}

function RoadmapCard({ item }: { item: RoadmapItem }) {
  const chip = statusChip(item.status);
  const barWidth = phaseBarWidth(item.status);

  return (
    <div className="group rounded-[30px] border border-white/10 bg-black/30 p-6 backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:border-red-500/25">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/40">
            {item.phase}
          </p>

          <h3 className="mt-2 text-2xl font-black text-white transition group-hover:text-red-400">
            {item.title}
          </h3>

          <p className="mt-3 max-w-md text-sm leading-7 text-white/60">
            {item.desc}
          </p>
        </div>

        <div className={`rounded-full border px-3 py-1 text-xs font-semibold ${chip.cls}`}>
          {chip.label}
        </div>
      </div>

      <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-white/5">
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
