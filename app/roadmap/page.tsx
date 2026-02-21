/* app/roadmap/page.tsx */
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";

export default function Page() {
  // =========================
  // EDIT THESE 2 NUMBERS ONLY
  // =========================
  const TARGET_MC = 100_000_000;
  const CURRENT_MC = 2_400_000; // <- update this anytime

  // ====== Roadmap ======
  const roadmap = useMemo(
    () => [
      {
        phase: "Phase 1",
        title: "Bond",
        desc: "Establish the foundation. Lock in the culture. Build the core.",
        done: true,
      },
      {
        phase: "Phase 1.1",
        title: "300M Burn (30%)",
        desc: "Proof-of-signal. Big burn. Clear intent.",
        done: true,
      },
      {
        phase: "Phase 1.2",
        title: "350M Burn (35%)",
        desc: "Phase 1.2 complete — 350,000,000 tokens burned.",
        done: true,
      },
      {
        phase: "Phase 1.3",
        title: "40% Supply Burned",
        desc: "Target milestone — 40% of total supply burned.",
        done: false,
      },
      { phase: "Phase 2", title: "$1M", desc: "First major milestone. Momentum becomes visible.", done: false },
      { phase: "Phase 3", title: "$10M", desc: "Scale the culture. Expand the orbit.", done: false },
      { phase: "Phase 4", title: "$50M", desc: "The line gets crowded. The fade gets expensive.", done: false },
      { phase: "Phase 5", title: "$100M", desc: "The full thesis. The brand becomes gravity.", done: false },
    ],
    []
  );

  // ====== Milestones for the progress bar ======
  const milestones = useMemo(
    () => [
      { label: "$1M", value: 1_000_000 },
      { label: "$10M", value: 10_000_000 },
      { label: "$25M", value: 25_000_000 },
      { label: "$50M", value: 50_000_000 },
      { label: "$75M", value: 75_000_000 },
      { label: "$100M", value: 100_000_000 },
    ],
    []
  );

  const progressPercent = Math.min((CURRENT_MC / TARGET_MC) * 100, 100);

  const currentMilestoneIndex = useMemo(() => {
    let idx = -1;
    for (let i = 0; i < milestones.length; i++) {
      if (CURRENT_MC >= milestones[i].value) idx = i;
    }
    return idx;
  }, [CURRENT_MC, milestones]);

  // ====== (C) Glow burst when crossing a milestone ======
  const prevMilestoneIndexRef = useRef<number>(-1);
  const [milestoneBurst, setMilestoneBurst] = useState(false);
  const [burstLabel, setBurstLabel] = useState<string>("");

  useEffect(() => {
    const prev = prevMilestoneIndexRef.current;

    // initialize once
    if (prev === -1) {
      prevMilestoneIndexRef.current = currentMilestoneIndex;
      return;
    }

    // crossed upward
    if (currentMilestoneIndex > prev) {
      setBurstLabel(milestones[currentMilestoneIndex]?.label ?? "");
      setMilestoneBurst(true);
      window.setTimeout(() => setMilestoneBurst(false), 900);
      prevMilestoneIndexRef.current = currentMilestoneIndex;
    } else {
      prevMilestoneIndexRef.current = currentMilestoneIndex;
    }
  }, [currentMilestoneIndex, milestones]);

  const btnBase =
    "inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-black transition border border-white/10 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-white/15";
  const btnGhost = `${btnBase} bg-white/10 hover:bg-white/15 text-white`;

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="relative mx-auto w-full max-w-6xl px-6 py-14">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-white/10 p-3 border border-white/10 shadow-[0_0_80px_rgba(255,120,80,0.12)]">
            <Image src="/mad.png" alt="$MAD logo" width={48} height={48} priority />
          </div>
          <div className="text-left">
            <div className="text-xs uppercase tracking-[0.35em] text-white/60">Roadmap</div>
            <div className="text-2xl sm:text-3xl font-black leading-tight">Road to $100M</div>
          </div>
        </div>

        <p className="mt-6 text-white/65 leading-[1.9] max-w-2xl">
          Structure first. Hype second. Expansion third.
        </p>

        {/* ====== Progress Meter ====== */}
        <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-5 sm:p-7 overflow-hidden">
          <div className="flex items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-white/60 uppercase tracking-[0.35em] text-xs">Progress</p>
              <h3 className="mt-2 text-2xl sm:text-3xl font-black">Market Cap Milestones</h3>
              <p className="mt-2 text-white/60 leading-[1.8]">
                When the line is crossed, the UI celebrates.
              </p>
            </div>

            <div
              className={[
                "shrink-0 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-center transition",
                milestoneBurst ? "milestone-burst" : "",
              ].join(" ")}
            >
              <div className="text-xs uppercase tracking-[0.35em] text-white/50">Current</div>
              <div className="mt-1 text-lg font-black text-white">
                {currentMilestoneIndex >= 0 ? milestones[currentMilestoneIndex].label : "$0"}
              </div>
              {milestoneBurst && (
                <div className="mt-1 text-xs font-black text-white/80">✅ Milestone hit: {burstLabel}</div>
              )}
            </div>
          </div>

          <div className="mt-7">
            <div className="flex justify-between text-xs text-white/60 mb-2">
              <span>$0</span>
              <span>$100M</span>
            </div>

            <div className="relative w-full h-4 bg-white/10 rounded-full overflow-hidden">
              <div
                className={["h-full bg-gradient-to-r from-red-500 to-orange-500 transition-all duration-700", milestoneBurst ? "bar-burst" : ""].join(
                  " "
                )}
                style={{ width: `${progressPercent}%` }}
              />

              {milestones.map((m, i) => {
                const left = (m.value / TARGET_MC) * 100;
                const reached = CURRENT_MC >= m.value;
                const isCurrent = i === currentMilestoneIndex;

                return (
                  <div key={m.label} className="absolute top-0 h-full flex items-center" style={{ left: `${left}%` }}>
                    <div
                      className={["w-[2px] h-6 -translate-x-1/2 rounded-full transition", reached ? "bg-white/70" : "bg-white/20", isCurrent ? "tick-glow" : ""].join(
                        " "
                      )}
                      title={m.label}
                    />
                  </div>
                );
              })}
            </div>

            <div className="mt-3 flex justify-between text-[11px] text-white/45">
              <span>Start</span>
              <span className="text-white/60 font-black">${(CURRENT_MC / 1_000_000).toFixed(2)}M now</span>
              <span>Target</span>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button className={btnGhost} onClick={() => navigator.clipboard.writeText(String(CURRENT_MC))}>
                Copy Current MC #
              </button>
              <button className={btnGhost} onClick={() => navigator.clipboard.writeText(String(TARGET_MC))}>
                Copy Target #
              </button>
            </div>
          </div>
        </div>

        {/* ====== Roadmap Cards ====== */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {roadmap.map((r) => (
            <div
              key={r.phase}
              className={[
                "rounded-3xl border border-white/10 bg-white/5 p-6",
                r.done ? "shadow-[0_0_80px_rgba(255,120,80,0.08)]" : "",
              ].join(" ")}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs uppercase tracking-[0.35em] text-white/55">{r.phase}</div>
                  <div className="mt-2 text-xl font-black">{r.title}</div>
                </div>
                <div className="text-sm font-black">{r.done ? "✅" : "⏳"}</div>
              </div>
              <p className="mt-3 text-white/65 leading-[1.85]">{r.desc}</p>
            </div>
          ))}
        </div>

        <footer className="py-12 text-center text-white/35 text-sm">© {new Date().getFullYear()} $MAD.</footer>

        {/* animations */}
        <style jsx global>{`
          @keyframes burstGlow {
            0% {
              transform: scale(1);
              filter: saturate(1);
              box-shadow: 0 0 0 rgba(255, 120, 80, 0);
            }
            35% {
              transform: scale(1.03);
              filter: saturate(1.25);
              box-shadow: 0 0 70px rgba(255, 120, 80, 0.22);
            }
            100% {
              transform: scale(1);
              filter: saturate(1);
              box-shadow: 0 0 0 rgba(255, 120, 80, 0);
            }
          }

          @keyframes barPulse {
            0% {
              filter: saturate(1);
            }
            40% {
              filter: saturate(1.35) brightness(1.08);
            }
            100% {
              filter: saturate(1);
            }
          }

          @keyframes tickSpark {
            0% {
              box-shadow: 0 0 0 rgba(255, 120, 80, 0);
            }
            40% {
              box-shadow: 0 0 30px rgba(255, 120, 80, 0.35);
            }
            100% {
              box-shadow: 0 0 0 rgba(255, 120, 80, 0);
            }
          }

          .milestone-burst {
            animation: burstGlow 900ms ease-out;
          }
          .bar-burst {
            animation: barPulse 900ms ease-out;
          }
          .tick-glow {
            animation: tickSpark 900ms ease-out;
          }
        `}</style>
      </div>
    </div>
  );
}
