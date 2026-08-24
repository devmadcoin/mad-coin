import PageShell from "@/components/PageShell";
import Reveal from "@/components/Reveal";
import CountUp from "@/components/CountUp";
import { TRACKS } from "@/lib/pages-data";
import { LINKS } from "@/lib/data";
import { cn } from "@/lib/utils";

const ENGINE = [
  { value: 200, suffix: "M", label: "Max Supply", note: "Hard cap. No more tokens will ever be minted." },
  { value: 50, suffix: "%", label: "Already Burned", note: "Gone forever. Reduced supply increases scarcity." },
  { value: 7, suffix: "", label: "Communities Locked", note: "Locked until 2060. Long-term holders only." },
];

function statusStyle(s: string) {
  if (s === "LIVE") return "border-green-500/40 bg-green-500/10 text-green-400";
  if (s === "IN PROGRESS") return "border-yellow-500/40 bg-yellow-500/10 text-yellow-400";
  return "border-white/15 bg-white/5 text-ash";
}

export default function Roadmap() {
  return (
    <PageShell
      eyebrow="The Ecosystem"
      title={<>
        $MAD <span className="text-mad">Roadmap</span>
      </>
      }
      sub="Where we are. Where we're going. Milestone by milestone."
    >
      <Reveal>
        <div className="overflow-hidden rounded-3xl border border-mad/25 bg-panel shadow-glow-sm">
          <div className="border-b border-white/8 bg-black/40 px-6 py-6 text-center">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-mad">The Engine</p>
            <h2 className="mt-2 font-display text-3xl uppercase text-bone sm:text-4xl">
              200M Cap. <span className="text-mad">Burn the Rest.</span>
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-ash">
              $MAD is designed to get scarcer over time. Every burn makes your bag heavier. Less supply,
              more demand, same community.
            </p>
          </div>
          <div className="grid gap-4 p-6 sm:grid-cols-3">
            {ENGINE.map((e) => (
              <div key={e.label} className="rounded-2xl border border-white/8 bg-black/30 p-6 text-center">
                <p className="font-display text-5xl text-mad">
                  <CountUp value={e.value} suffix={e.suffix} />
                </p>
                <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.25em] text-bone">{e.label}</p>
                <p className="mt-2 text-xs leading-relaxed text-ash">{e.note}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-col items-center gap-3 border-t border-white/8 px-6 py-5 sm:flex-row sm:justify-center sm:gap-8">
            <p className="flex items-center gap-2 font-mono text-sm text-green-400">✓ Burn #1 — Complete <span className="text-ash">· 50% supply burned</span></p>
            <p className="flex items-center gap-2 font-mono text-sm text-mad-bright">🔒 Burn #2 — Locked <span className="text-ash">· triggers at 10,000 holders</span></p>
          </div>
        </div>
      </Reveal>

      <div className="mt-16 flex flex-col gap-6">
        {TRACKS.map((t) => {
          const done = t.milestones.filter((m) => m.done).length;
          return (
            <Reveal key={t.name} delay={0.05}>
              <div className="group overflow-hidden rounded-3xl border border-white/8 bg-panel transition-all duration-500 hover:border-mad/35">
                <div className="flex flex-col gap-6 p-7 sm:p-8 lg:flex-row">
                  <div className="lg:w-80 lg:shrink-0">
                    <div className="flex items-center gap-4">
                      <span className="text-4xl">{t.icon}</span>
                      <div>
                        <h3 className="font-display text-2xl uppercase text-bone">{t.name}</h3>
                        <span className={cn("mt-1 inline-block rounded-full border px-3 py-0.5 font-mono text-[10px] uppercase tracking-widest", statusStyle(t.status))}>
                          {t.status}
                        </span>
                      </div>
                      <span className="ml-auto font-display text-4xl text-mad/80 lg:hidden">{t.pct}%</span>
                    </div>
                    <p className="mt-4 text-sm leading-relaxed text-ash">{t.desc}</p>
                    <p className="mt-4 font-mono text-xs text-ash">
                      <span className="text-mad-bright">{done}</span> of {t.milestones.length} milestones completed
                    </p>
                  </div>

                  <div className="hidden w-24 shrink-0 flex-col items-center justify-center lg:flex">
                    <div className="relative h-24 w-24">
                      <svg viewBox="0 0 96 96" className="h-full w-full -rotate-90">
                        <circle cx="48" cy="48" r="42" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="7" />
                        <circle
                          cx="48" cy="48" r="42" fill="none" stroke="#EA2022" strokeWidth="7"
                          strokeLinecap="round"
                          strokeDasharray={`${(t.pct / 100) * 264} 264`}
                          className="transition-all duration-1000"
                        />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center font-display text-xl text-bone">
                        {t.pct}%
                      </span>
                    </div>
                  </div>

                  <ul className="flex-1 space-y-2.5">
                    {t.milestones.map((m) => (
                      <li key={m.text} className="flex items-start gap-3 text-sm">
                        <span className={cn("mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border font-mono text-[10px]", m.done ? "border-green-500/50 bg-green-500/15 text-green-400" : "border-white/15 text-ash")}>
                          {m.done ? "✓" : "○"}
                        </span>
                        <span className={m.done ? "text-bone/85" : "text-ash"}>{m.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>

      <Reveal className="mt-16 text-center">
        <h2 className="font-display text-3xl uppercase text-bone sm:text-4xl">
          Build With <span className="text-mad">Us.</span>
        </h2>
        <p className="mt-3 text-ash">Seven pillars. One community. Every milestone gets us closer.</p>
        <a
          href={LINKS.buy}
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-block rounded-full bg-mad px-9 py-4 text-base font-bold uppercase tracking-wider text-white shadow-glow transition-all hover:scale-105 hover:shadow-glow-lg"
        >
          Get $MAD →
        </a>
      </Reveal>
    </PageShell>
  );
}
