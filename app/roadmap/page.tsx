/* app/roadmap/page.tsx */
import Image from "next/image";

type RoadmapItem = {
  phase: string;
  title: string;
  desc: string;
  done?: boolean; // completed checkpoint
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function RoadmapPage() {
  // ✅ EDIT THESE ONLY
  const items: RoadmapItem[] = [
    { phase: "Phase 1", title: "Bond", desc: "Establish the foundation. Lock in the culture. Build the core.", done: true },
    { phase: "Phase 1.1", title: "300M Burn (30%)", desc: "Proof-of-signal. Big burn. Clear intent.", done: true },
    { phase: "Phase 1.2", title: "350M Burn (35%)", desc: "Phase 1.2 complete — 350,000,000 tokens burned.", done: true },
    { phase: "Phase 1.3", title: "40% Supply Burned", desc: "Target milestone — 40% of total supply burned.", done: false },
    { phase: "Phase 2", title: "$1M", desc: "First major milestone. Momentum becomes visible." },
    { phase: "Phase 3", title: "$10M", desc: "Scale the culture. Expand the orbit." },
    { phase: "Phase 4", title: "$50M", desc: "The line gets crowded. The fade gets expensive." },
  ];

  // ✅ Progress is based on how many items are marked done
  const total = Math.max(1, items.length);
  const doneCount = items.filter((i) => !!i.done).length;
  const progress = clamp(doneCount / total, 0, 1);

  return (
    <main className="relative min-h-screen overflow-hidden text-white">
      {/* Background */}
      <div className="fixed inset-0 -z-20">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/70 to-black" />
        <div className="absolute inset-0 opacity-35 bg-[radial-gradient(circle_at_30%_40%,rgba(255,120,80,.45),transparent_60%),radial-gradient(circle_at_70%_60%,rgba(255,40,40,.35),transparent_60%)]" />
      </div>

      <style jsx global>{`
        @keyframes progressGlow {
          0% {
            transform: translateX(-20%);
            opacity: 0.25;
          }
          50% {
            transform: translateX(20%);
            opacity: 0.55;
          }
          100% {
            transform: translateX(-20%);
            opacity: 0.25;
          }
        }
        @keyframes shimmerSlide {
          0% {
            transform: translateX(-60%);
            opacity: 0;
          }
          20% {
            opacity: 0.25;
          }
          50% {
            opacity: 0.55;
          }
          80% {
            opacity: 0.25;
          }
          100% {
            transform: translateX(60%);
            opacity: 0;
          }
        }
        @keyframes checkpointPulse {
          0%,
          100% {
            transform: scale(1);
            filter: saturate(1);
          }
          50% {
            transform: scale(1.08);
            filter: saturate(1.25);
          }
        }
      `}</style>

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 py-14">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-white/10 p-3 border border-white/10 shadow-[0_0_80px_rgba(255,120,80,0.12)]">
              <Image src="/mad.png" alt="$MAD" width={44} height={44} priority />
            </div>
            <div className="text-left">
              <div className="text-xs uppercase tracking-[0.35em] text-white/60">Roadmap</div>
              <div className="text-2xl sm:text-3xl font-black leading-tight">Bond → Burn → Climb</div>
            </div>
          </div>

          <a
            href="/"
            className="inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-black transition border border-white/10 bg-white/10 hover:bg-white/15 text-white focus:outline-none focus:ring-2 focus:ring-white/15"
          >
            ← Home
          </a>
        </div>

        {/* Progress Card */}
        <section className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8 overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div>
              <p className="text-white/60 uppercase tracking-[0.35em] text-xs">Progress</p>
              <h1 className="mt-2 text-3xl sm:text-4xl font-black">Momentum Meter</h1>
              <p className="mt-2 text-white/65 leading-[1.9]">
                Checkpoints completed:{" "}
                <span className="font-black text-white tabular-nums">
                  {doneCount}/{total}
                </span>
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm">
              <div className="text-white/55 text-xs uppercase tracking-[0.35em]">Completion</div>
              <div className="mt-1 text-2xl font-black tabular-nums">{Math.round(progress * 100)}%</div>
            </div>
          </div>

          {/* ✅ Animated Progress Bar */}
          <div className="mt-6">
            <div className="relative h-4 w-full overflow-hidden rounded-full bg-white/10 border border-white/10">
              {/* filled */}
              <div
                className="h-full rounded-full bg-gradient-to-r from-red-500 to-orange-500 transition-[width] duration-700 ease-out"
                style={{ width: `${progress * 100}%` }}
              />
              {/* glow + shimmer */}
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  animation: "progressGlow 2.6s ease-in-out infinite",
                  background:
                    "radial-gradient(circle at 20% 50%, rgba(255,180,120,0.30), transparent 50%)," +
                    "radial-gradient(circle at 80% 50%, rgba(255,80,80,0.22), transparent 55%)",
                }}
              />
              <div
                className="pointer-events-none absolute inset-y-0 left-1/2 w-[45%] -translate-x-1/2"
                style={{
                  animation: "shimmerSlide 2.2s ease-in-out infinite",
                  background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)",
                  mixBlendMode: "screen",
                }}
              />
            </div>

            {/* checkpoint dots */}
            <div className="mt-5 flex items-center justify-between">
              {items.map((it, idx) => {
                const completed = !!it.done;
                const isActive = !completed && idx === doneCount; // next target
                return (
                  <div key={it.phase + it.title} className="relative flex flex-col items-center gap-2 w-full">
                    <div
                      className={[
                        "h-4 w-4 rounded-full border",
                        completed ? "bg-white border-white/40" : isActive ? "bg-orange-500/90 border-white/30" : "bg-white/10 border-white/15",
                      ].join(" ")}
                      style={isActive ? { animation: "checkpointPulse 1.4s ease-in-out infinite" } : undefined}
                      title={`${it.phase}: ${it.title}`}
                    />
                    <div className="text-[10px] text-white/45 uppercase tracking-[0.22em] whitespace-nowrap">
                      {it.phase}
                    </div>

                    {/* connecting line (except last) */}
                    {idx !== items.length - 1 && (
                      <div className="absolute top-2 left-1/2 w-full h-px bg-white/10 -z-10" />
                    )}
                  </div>
                );
              })}
            </div>

            <p className="mt-4 text-xs text-white/40 leading-[1.8]">
              The orange dot is the next target. Completed checkpoints are white.
            </p>
          </div>
        </section>

        {/* Roadmap List */}
        <section className="mt-10 grid gap-5">
          {items.map((item) => {
            const done = !!item.done;
            return (
              <div
                key={item.phase + item.title}
                className={[
                  "rounded-3xl border border-white/10 bg-white/5 p-6 transition",
                  done ? "opacity-85" : "hover:bg-white/10",
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
        </section>

        <footer className="mt-14 py-10 text-center text-white/35 text-sm">
          © {new Date().getFullYear()} $MAD. Built by the community.
        </footer>
      </div>
    </main>
  );
}
