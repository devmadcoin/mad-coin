"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

type Status = "complete" | "in_progress" | "planned";

type PathItem = {
  phase: string;
  date: string;
  title: string;
  action: string;
  meaning: string;
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
  if (status === "in_progress") return "68%";
  return "10%";
}

function pointY(status: Status, index: number) {
  if (status === "complete") {
    return [74, 69, 64, 58, 52, 46, 40, 34, 29, 24, 20, 17, 14][index] ?? 14;
  }
  if (status === "in_progress") {
    return 11;
  }
  return [19, 15][index % 2] ?? 15;
}

export default function MadPathPage() {
  const [animateIn, setAnimateIn] = useState(false);
  const [zoom, setZoom] = useState(1.2);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const t = window.setTimeout(() => setAnimateIn(true), 120);
    return () => window.clearTimeout(t);
  }, []);

  const items: PathItem[] = useMemo(
    () => [
      {
        phase: "PHASE 1",
        date: "Feb 4, 2026 — 6:27:24 PM",
        title: "Genesis",
        action: "$MAD was minted. Emotion became code.",
        meaning:
          "This wasn’t a test run or a reset button. From the first moment, $MAD had to survive in real conditions.",
        status: "complete",
      },
      {
        phase: "PHASE 1.1",
        date: "Feb 5, 2026",
        title: "Community Ignition",
        action: "Telegram launched. The first gathering formed.",
        meaning:
          "Signal needs a channel. This is where belief stopped being individual and became collective.",
        status: "complete",
      },
      {
        phase: "PHASE 1.2",
        date: "Launch Week",
        title: "The Trial",
        action: "A 5% wallet tested the system during launch week.",
        meaning:
          "Most projects restart under pressure. $MAD didn’t. Discipline over panic became the standard.",
        status: "complete",
      },
      {
        phase: "PHASE 1.3",
        date: "Feb 7, 2026 — 16:56",
        title: "Bonding",
        action: "Liquidity bonded. Structure hardened.",
        meaning:
          "Volatility met foundation. This was the moment chaos started becoming controlled.",
        status: "complete",
      },
      {
        phase: "PHASE 1.4",
        date: "Feb 14, 2026",
        title: "Reclamation",
        action: "Telegram ownership was secured to protect the channel and avoid disruption.",
        meaning:
          "Not ego — responsibility. This was a quiet act of preservation before the next wave of pressure.",
        status: "complete",
      },
      {
        phase: "PHASE 1.5",
        date: "Feb 15, 2026",
        title: "Visibility",
        action: "$MAD was officially listed on CoinGecko.",
        meaning:
          "The signal left the underground. Now it could be tracked, watched, and judged by the wider world.",
        status: "complete",
      },
      {
        phase: "PHASE 1.6",
        date: "Feb 18, 2026 — 3:19 PM",
        title: "The Attack",
        action: "Telegram and Dexscreener were botted.",
        meaning:
          "Noise tried to bury signal. It didn’t work. Pressure revealed resilience.",
        status: "complete",
      },
      {
        phase: "PHASE 1.7",
        date: "Feb 20, 2026 — 11:32 AM",
        title: "The Comeback",
        action: "Telegram was deleted, but belief rebuilt the path.",
        meaning:
          "Platforms can be removed. Belief cannot. This became one of the defining identity moments for $MAD.",
        status: "complete",
      },
      {
        phase: "PHASE 1.8",
        date: "Late Feb, 2026",
        title: "Silent Discipline",
        action: "33M tokens were quietly burned with no spectacle.",
        meaning:
          "No announcement. No hype. Just structure. This proved intent over attention.",
        status: "complete",
      },
      {
        phase: "PHASE 1.9",
        date: "Mar 1, 2026",
        title: "The 400M Burn",
        action: "400,000,000 $MAD tokens were permanently burned.",
        meaning:
          "This wasn’t destruction. It was refinement. Scarcity strengthened conviction and sharpened identity.",
        status: "complete",
      },
      {
        phase: "PHASE 2.0",
        date: "Mar 4, 2026",
        title: "The Gork Moment",
        action: "A challenge became the mission: burn 800M.",
        meaning:
          "What started as a jab became direction. This is where the path stopped moving forward and started aiming upward.",
        status: "complete",
      },
      {
        phase: "PHASE 2.1",
        date: "Mar 18, 2026",
        title: "Physical Layer",
        action: "$MAD sticker merch officially launched.",
        meaning:
          "The signal left the screen. $MAD became something people could hold, wear, and bring into everyday life.",
        status: "complete",
      },
      {
        phase: "PHASE 2.2",
        date: "Mar 19, 2026",
        title: "System Recognition",
        action: "$MAD was officially verified by Jupiter.",
        meaning:
          "The system didn’t change $MAD. It acknowledged it. Recognition followed persistence.",
        status: "complete",
      },
      {
        phase: "PHASE 2.3",
        date: "Mar 28, 2026",
        title: "MAD Games",
        action: "The first MAD Games happened inside Roblox with real SOL rewards.",
        meaning:
          "$MAD became interactive. Not just watched — experienced. The signal became a game.",
        status: "complete",
      },
      {
        phase: "PHASE 3",
        date: "Next Signal",
        title: "Acquisition Engine",
        action: "Acquire supply and support community growth.",
        meaning:
          "This is where conviction starts organizing itself. Not random movement — directed expansion.",
        status: "planned",
      },
      {
        phase: "PHASE 4",
        date: "After Expansion",
        title: "Game Integration",
        action: "Expand the $MAD experience deeper into gaming.",
        meaning:
          "The signal keeps moving from chart to culture to interaction.",
        status: "planned",
      },
      {
        phase: "FINAL PHASE",
        date: "The Summit Ahead",
        title: "The Sky Burn",
        action: "Push toward 800M total $MAD burned.",
        meaning:
          "This is the vertical move — the defining contraction that marks the next level of the story.",
        status: "in_progress",
      },
    ],
    []
  );

  const total = items.length;
  const completed = items.filter((x) => x.status === "complete").length;
  const inProgress = items.filter((x) => x.status === "in_progress").length;
  const pct = clamp(Math.round((completed / total) * 100), 0, 100);

  const leftPad = 6;
  const rightPad = 7;
  const usableWidth = 100 - leftPad - rightPad;

  const points = items.map((item, index) => {
    const x = leftPad + (index / Math.max(1, items.length - 1)) * usableWidth;
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

  const candleTarget = {
    x: Math.min(97, (currentPoint?.x ?? 93) + 1.5),
    y: 3.2,
  };

  function zoomIn() {
    setZoom((z) => clamp(Number((z + 0.2).toFixed(2)), 1, 2.2));
  }

  function zoomOut() {
    setZoom((z) => clamp(Number((z - 0.2).toFixed(2)), 1, 2.2));
  }

  function resetZoom() {
    setZoom(1.2);
    scrollRef.current?.scrollTo({ left: 0, behavior: "smooth" });
  }

  const chartMinWidth = `${Math.round(1360 * zoom)}px`;

  return (
    <div className="relative overflow-hidden bg-[#050505] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(255,0,60,0.18),transparent_40%),radial-gradient(circle_at_82%_32%,rgba(255,80,0,0.14),transparent_42%),radial-gradient(circle_at_50%_100%,rgba(255,40,40,0.12),transparent_55%)]" />
        <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:42px_42px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/70" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-20">
        <div className="max-w-4xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.4em] text-white/45">
            THE MAD PATH
          </p>

          <h1 className="mt-5 text-5xl font-black leading-[0.92] tracking-tight sm:text-6xl lg:text-7xl">
            Follow the
            <span className="text-red-500 drop-shadow-[0_0_18px_rgba(255,0,0,0.7)]">
              {" "}Mad Path
            </span>
            .
          </h1>

          <p className="mt-5 max-w-3xl text-sm leading-7 text-white/62 sm:text-base">
            Not everyone will understand it. Only the ones who feel it will follow it.
            This is not a checklist. It is a dated record of pressure, survival,
            discipline, and upward movement.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <StatCard label="Chapters Complete" value={`${completed}`} />
          <StatCard label="Current Phase" value={`${inProgress}`} accent />
          <StatCard label="Path Progress" value={`${pct}%`} />
        </div>

        <section className="mt-10 overflow-hidden rounded-[36px] border border-white/10 bg-black/35 p-5 shadow-[0_24px_100px_rgba(0,0,0,0.42)] backdrop-blur-xl sm:p-7 lg:p-8">
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-white/42">
                The Climb
              </p>
              <h2 className="mt-3 text-3xl font-black leading-[0.95] sm:text-4xl">
                Pressure. Response. Evolution.
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="rounded-full border border-white/10 bg-black/45 p-1 backdrop-blur">
                <button
                  type="button"
                  onClick={zoomOut}
                  className="rounded-full px-3 py-2 text-xs font-semibold text-white/75 transition hover:bg-white/5 hover:text-white"
                >
                  Zoom Out
                </button>
                <button
                  type="button"
                  onClick={resetZoom}
                  className="rounded-full px-3 py-2 text-xs font-semibold text-white/75 transition hover:bg-white/5 hover:text-white"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={zoomIn}
                  className="rounded-full px-3 py-2 text-xs font-semibold text-white/75 transition hover:bg-white/5 hover:text-white"
                >
                  Zoom In
                </button>
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
          </div>

          <div className="rounded-[30px] border border-white/10 bg-[#080808] p-4 sm:p-6">
            <div
              ref={scrollRef}
              className="overflow-x-auto overflow-y-hidden rounded-[24px]"
            >
              <div
                className="relative h-[340px] min-w-full sm:h-[390px]"
                style={{ minWidth: chartMinWidth }}
              >
                <div className="relative h-full w-full overflow-hidden rounded-[24px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))]">
                  <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(to_right,rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:56px_56px]" />

                  <div className="pointer-events-none absolute left-0 right-0 top-[16%] border-t border-white/8" />
                  <div className="pointer-events-none absolute left-0 right-0 top-[34%] border-t border-white/8" />
                  <div className="pointer-events-none absolute left-0 right-0 top-[52%] border-t border-white/8" />
                  <div className="pointer-events-none absolute left-0 right-0 top-[70%] border-t border-white/8" />
                  <div className="pointer-events-none absolute left-0 right-0 top-[88%] border-t border-white/8" />

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

                        <linearGradient id="madCandleGlow" x1="0%" y1="100%" x2="0%" y2="0%">
                          <stop offset="0%" stopColor="rgba(255,90,90,0.35)" />
                          <stop offset="60%" stopColor="rgba(255,59,48,1)" />
                          <stop offset="100%" stopColor="rgba(255,230,210,1)" />
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

                      <line
                        x1={candleTarget.x}
                        y1={currentPoint?.y ?? 11}
                        x2={candleTarget.x}
                        y2={candleTarget.y}
                        stroke="url(#madCandleGlow)"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        className={animateIn ? "candle-draw" : "opacity-0"}
                      />
                    </svg>
                  </div>

                  <div className="absolute inset-0">
                    {points.map((point, index) => {
                      const active = index === currentIndex;
                      const isComplete = point.status === "complete";
                      const isPlanned = point.status === "planned";
                      const isFirst = index === 0;
                      const isLast = index === points.length - 1;

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
                              "absolute top-7 w-[190px] rounded-2xl border px-3 py-2 backdrop-blur-xl transition duration-300 sm:w-[220px]",
                              isFirst
                                ? "left-0 translate-x-0"
                                : isLast
                                ? "right-0 translate-x-0"
                                : "left-1/2 -translate-x-1/2",
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
                            <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-white/35">
                              {point.date}
                            </p>
                          </div>
                        </button>
                      );
                    })}

                    <div
                      className="absolute -translate-x-1/2 -translate-y-1/2"
                      style={{
                        left: `${candleTarget.x}%`,
                        top: `${candleTarget.y}%`,
                      }}
                    >
                      <div
                        className={[
                          "relative flex h-5 w-5 items-center justify-center rounded-full border-2 border-red-300 bg-white shadow-[0_0_30px_rgba(255,120,120,0.82)] transition-all duration-700",
                          animateIn ? "scale-100 opacity-100" : "scale-75 opacity-0",
                        ].join(" ")}
                      >
                        <span className="absolute inline-flex h-12 w-12 animate-pulse rounded-full bg-red-500/15" />
                      </div>

                      <div className="absolute bottom-8 left-1/2 w-[180px] -translate-x-1/2 rounded-2xl border border-red-500/30 bg-red-500/[0.10] px-3 py-2 backdrop-blur-xl sm:w-[210px]">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-red-300/80">
                          The Summit
                        </p>
                        <p className="mt-1 text-xs font-bold text-white sm:text-sm">
                          800M Burn
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pointer-events-none absolute bottom-4 left-4 rounded-full border border-white/10 bg-black/55 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-white/45 backdrop-blur">
                    Live path signal
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="h-3 w-full overflow-hidden rounded-full border border-white/10 bg-white/5 sm:max-w-[calc(100%-180px)]">
                <div
                  className="h-full rounded-full bg-red-500 transition-all duration-1000"
                  style={{ width: `${pct}%` }}
                />
              </div>

              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/40">
                Zoom {Math.round(zoom * 100)}%
              </p>
            </div>

            <p className="mt-3 text-sm text-white/52">
              {completed} of {total} chapters completed.
            </p>
          </div>
        </section>

        <section className="mt-12">
          <div className="mb-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-white/42">
              The Path
            </p>
            <h2 className="mt-3 text-3xl font-black leading-[0.95] sm:text-4xl">
              Every chapter, in order.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/58 sm:text-base">
              The story reads better when it moves forward one signal at a time.
            </p>
          </div>

          <div className="relative">
            <div className="absolute bottom-0 left-4 top-0 hidden w-px bg-gradient-to-b from-red-500/25 via-white/10 to-transparent md:block" />

            <div className="space-y-5">
              {items.map((item, index) => (
                <MadPathCard key={item.phase} item={item} index={index} />
              ))}
            </div>
          </div>
        </section>
      </div>

      <style jsx>{`
        .roadmap-draw {
          stroke-dasharray: 220;
          stroke-dashoffset: 220;
          animation: roadmapDraw 1.6s ease-out forwards;
        }

        .candle-draw {
          stroke-dasharray: 52;
          stroke-dashoffset: 52;
          animation: candleDraw 0.95s ease-out 1.2s forwards;
        }

        @keyframes roadmapDraw {
          to {
            stroke-dashoffset: 0;
          }
        }

        @keyframes candleDraw {
          to {
            stroke-dashoffset: 0;
          }
        }

        @keyframes pathCardIn {
          0% {
            opacity: 0;
            transform: translateY(18px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
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

function MadPathCard({
  item,
  index,
}: {
  item: PathItem;
  index: number;
}) {
  const chip = statusChip(item.status);
  const barWidth = phaseBarWidth(item.status);

  return (
    <article
      className="group relative overflow-hidden rounded-[30px] border border-white/10 bg-black/30 p-6 backdrop-blur-xl transition duration-500 hover:border-red-500/25 hover:bg-black/35 md:ml-10"
      style={{
        animation: `pathCardIn 0.65s ease-out forwards`,
        animationDelay: `${index * 120}ms`,
        opacity: 0,
        transform: "translateY(18px)",
      }}
    >
      <div className="absolute left-[-30px] top-8 hidden md:block">
        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-red-500/25 bg-black shadow-[0_0_25px_rgba(255,0,0,0.12)]">
          <div
            className={`h-2.5 w-2.5 rounded-full ${
              item.status === "complete"
                ? "bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.75)]"
                : item.status === "in_progress"
                ? "bg-red-400 shadow-[0_0_12px_rgba(248,113,113,0.75)]"
                : "bg-white/35"
            }`}
          />
        </div>
      </div>

      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/40">
            {item.phase}
          </p>
          <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/32">
            {item.date}
          </p>

          <h3 className="mt-3 text-2xl font-black text-white transition group-hover:text-red-400 sm:text-3xl">
            {item.title}
          </h3>
        </div>

        <div className={`rounded-full border px-3 py-1 text-xs font-semibold ${chip.cls}`}>
          {chip.label}
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/42">
            Action
          </p>
          <p className="mt-2 text-sm leading-7 text-white/72 sm:text-base">
            {item.action}
          </p>
        </div>

        <div className="rounded-2xl border border-red-500/15 bg-red-500/[0.05] p-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-red-300/80">
            Why It Mattered
          </p>
          <p className="mt-2 text-sm leading-7 text-white/76 sm:text-base">
            {item.meaning}
          </p>
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
    </article>
  );
}
