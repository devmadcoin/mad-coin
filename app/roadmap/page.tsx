"use client";

import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

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

function phaseBarWidth(status: Status) {
  if (status === "complete") return "100%";
  if (status === "in_progress") return "68%";
  return "10%";
}

function RevealOnScroll({
  children,
  delay = 0,
}: {
  children: ReactNode;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(node);
        }
      },
      {
        threshold: 0.18,
        rootMargin: "0px 0px -8% 0px",
      }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={[
        "transition-all duration-700 ease-out will-change-transform",
        visible
          ? "translate-y-0 opacity-100 blur-0"
          : "translate-y-8 opacity-0 blur-[2px]",
      ].join(" ")}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function GrowthVisual({
  animateIn,
  pct,
  currentTitle,
}: {
  animateIn: boolean;
  pct: number;
  currentTitle: string;
}) {
  const barHeights = [18, 28, 40, 53, 68, 86, 108, 136];
  const activeBars = Math.max(1, Math.round((pct / 100) * barHeights.length));

  return (
    <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-[#060606] p-5 sm:p-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_90%,rgba(0,255,120,0.08),transparent_28%),radial-gradient(circle_at_90%_10%,rgba(255,0,0,0.08),transparent_25%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.05] [background-image:linear-gradient(to_right,rgba(255,255,255,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.07)_1px,transparent_1px)] [background-size:46px_46px]" />

      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-white/42">
              The Climb
            </p>
            <h2 className="mt-3 text-3xl font-black leading-[0.95] sm:text-4xl">
              Pressure. Response. Evolution.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/58 sm:text-base">
              A cleaner read of the journey: pressure converted into structure,
              structure into belief, and belief into upward momentum.
            </p>
          </div>

          <div className="hidden rounded-2xl border border-red-500/20 bg-red-500/[0.06] px-4 py-3 md:block">
            <p className="text-[11px] uppercase tracking-[0.24em] text-red-300/80">
              You Are Here
            </p>
            <p className="mt-1 text-sm font-bold text-white">{currentTitle}</p>
          </div>
        </div>

        <div className="mt-8">
          <div className="relative h-[260px] rounded-[26px] border border-white/8 bg-black/40 px-4 pb-6 pt-4 sm:h-[320px] sm:px-6">
            <svg
              viewBox="0 0 1000 420"
              className="absolute inset-0 h-full w-full"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="growthBars" x1="0%" y1="100%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor="#16a34a" />
                  <stop offset="100%" stopColor="#4ade80" />
                </linearGradient>
                <linearGradient id="growthArrow" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#16a34a" />
                  <stop offset="100%" stopColor="#22c55e" />
                </linearGradient>
                <filter id="greenGlow">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {[80, 160, 240, 320].map((y) => (
                <line
                  key={y}
                  x1="40"
                  x2="960"
                  y1={y}
                  y2={y}
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth="1"
                />
              ))}

              {barHeights.map((h, i) => {
                const x = 110 + i * 95;
                const y = 360 - h * 2;
                const isActive = i < activeBars;
                return (
                  <g
                    key={i}
                    className={animateIn ? "bar-rise" : "opacity-0"}
                    style={{ animationDelay: `${120 + i * 90}ms` }}
                  >
                    <rect
                      x={x}
                      y={y}
                      width="46"
                      height={h * 2}
                      rx="2"
                      fill={isActive ? "url(#growthBars)" : "rgba(255,255,255,0.16)"}
                    />
                    <polygon
                      points={`${x},${y} ${x + 16},${y - 16} ${x + 62},${y - 16} ${x + 46},${y}`}
                      fill={isActive ? "#4ade80" : "rgba(255,255,255,0.22)"}
                    />
                    <polygon
                      points={`${x + 46},${y} ${x + 62},${y - 16} ${x + 62},${y + h * 2 - 16} ${x + 46},${y + h * 2}`}
                      fill={isActive ? "#16a34a" : "rgba(255,255,255,0.12)"}
                    />
                  </g>
                );
              })}

              <g
                className={animateIn ? "arrow-rise" : "opacity-0"}
                filter="url(#greenGlow)"
              >
                <path
                  d="M 140 300 C 280 270, 420 238, 560 185 C 700 132, 820 92, 900 42"
                  fill="none"
                  stroke="url(#growthArrow)"
                  strokeWidth="18"
                  strokeLinecap="round"
                />
                <polygon
                  points="900,42 845,58 875,88"
                  fill="#22c55e"
                />
              </g>
            </svg>

            <div className="relative flex h-full items-end justify-between gap-2 px-4 pb-2 sm:px-8">
              <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/35">
                Launch
              </div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/35">
                Expansion
              </div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/35">
                Summit
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="h-3 w-full overflow-hidden rounded-full border border-white/10 bg-white/5 sm:max-w-[calc(100%-160px)]">
              <div
                className="h-full rounded-full bg-red-500 transition-all duration-1000"
                style={{ width: `${pct}%` }}
              />
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/40">
              Path progress {pct}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MadPathPage() {
  const [animateIn, setAnimateIn] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const t = window.setTimeout(() => setAnimateIn(true), 120);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const tryPlay = () => {
      video.play().catch(() => {});
    };

    tryPlay();

    const unlock = () => {
      tryPlay();
      window.removeEventListener("touchstart", unlock);
      window.removeEventListener("click", unlock);
    };

    window.addEventListener("touchstart", unlock, { passive: true });
    window.addEventListener("click", unlock);

    return () => {
      window.removeEventListener("touchstart", unlock);
      window.removeEventListener("click", unlock);
    };
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
        action:
          "Telegram ownership was secured to protect the channel and avoid disruption.",
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
  const currentItem =
    items.find((item) => item.status === "in_progress") ??
    items[Math.max(0, completed - 1)];

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
              {" "}
              Mad Path
            </span>
            .
          </h1>

          <p className="mt-5 max-w-3xl text-sm leading-7 text-white/62 sm:text-base">
            Not everyone will understand it. Only the ones who feel it will
            follow it. This is not a checklist. It is a dated record of
            pressure, survival, discipline, and upward movement.
          </p>
        </div>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[30px] border border-white/10 bg-black/25 p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-white/42">
              PATH SIGNAL
            </p>

            <h3 className="mt-3 text-2xl font-black text-white sm:text-3xl">
              Motion creates belief.
            </h3>

            <p className="mt-3 max-w-xl text-sm leading-7 text-white/62 sm:text-base">
              This isn’t just progress. It’s energy turning into identity. The
              ones who move… become.
            </p>

            <p className="mt-4 text-xs leading-6 text-white/40">
              The motion signal should start automatically. On some phones,
              Safari may wait until the first touch before allowing playback.
            </p>
          </div>

          <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-black/40 p-3 shadow-[0_18px_70px_rgba(0,0,0,0.35)]">
            <div className="absolute -inset-6 rounded-[40px] bg-red-500/10 blur-2xl" />

            <div className="relative overflow-hidden rounded-[22px] border border-white/10 bg-black">
              <video
                ref={videoRef}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                className="block aspect-[4/3] w-full object-cover sm:aspect-[16/10]"
              >
                <source src="/loops/mad-dancing.mp4" type="video/mp4" />
              </video>
            </div>
          </div>
        </section>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <StatCard label="Chapters Complete" value={`${completed}`} />
          <StatCard label="Current Phase" value={`${inProgress}`} accent />
          <StatCard label="Path Progress" value={`${pct}%`} />
        </div>

        <section className="mt-10">
          <GrowthVisual
            animateIn={animateIn}
            pct={pct}
            currentTitle={`${currentItem.phase} — ${currentItem.title}`}
          />
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
                <RevealOnScroll
                  key={item.phase}
                  delay={Math.min(index * 45, 220)}
                >
                  <MadPathCard item={item} />
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </section>
      </div>

      <style jsx>{`
        .bar-rise {
          animation: barRise 0.8s ease-out forwards;
          transform-origin: bottom;
        }

        .arrow-rise {
          animation: arrowRise 1.1s ease-out 0.5s forwards;
        }

        @keyframes barRise {
          0% {
            opacity: 0;
            transform: translateY(24px) scaleY(0.6);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scaleY(1);
          }
        }

        @keyframes arrowRise {
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

function MadPathCard({ item }: { item: PathItem }) {
  const chip = statusChip(item.status);
  const barWidth = phaseBarWidth(item.status);

  return (
    <article className="group relative overflow-hidden rounded-[30px] border border-white/10 bg-black/30 p-6 backdrop-blur-xl transition duration-500 hover:border-red-500/25 hover:bg-black/35 md:ml-10">
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

        <div
          className={`rounded-full border px-3 py-1 text-xs font-semibold ${chip.cls}`}
        >
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
