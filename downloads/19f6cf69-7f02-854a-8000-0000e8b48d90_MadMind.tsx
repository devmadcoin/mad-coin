import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import PageShell from "@/components/PageShell";
import Reveal from "@/components/Reveal";
import { useMadPrice, fmtPrice, fmtUsd } from "@/hooks/useMadPrice";
import {
  SUPPLY, MILESTONES, LIFE_PATH, ZODIAC, ELEMENTS,
  ARCHETYPES, QUIZ, FREQUENCY_QS, FREQUENCIES,
  type ArchetypeKey,
} from "@/lib/pages-data";
import { CA } from "@/lib/data";
import { cn } from "@/lib/utils";

/* ---------- Value Calculator ---------- */

function ValueCalc() {
  const { price, mcap, change24h } = useMadPrice();
  const [bag, setBag] = useState(100000);
  const [target, setTarget] = useState(10_000_000);
  const up = (change24h ?? 0) >= 0;

  const currentValue = price ? bag * price : 0;
  const targetPrice = target / SUPPLY;
  const targetValue = bag * targetPrice;
  const multiplier = price && mcap ? target / mcap : 0;

  return (
    <div id="calc" className="scroll-mt-28 overflow-hidden rounded-3xl border border-mad/25 bg-panel shadow-glow-sm">
      <div className="border-b border-white/8 bg-black/40 px-6 py-5 text-center">
        <h3 className="font-display text-2xl uppercase text-mad">$MAD Value Calc 😡</h3>
        <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.25em] text-ash">
          Real-time metrics · updates every 15s
        </p>
      </div>
      <div className="p-6 sm:p-8">
        <label className="font-mono text-[11px] uppercase tracking-[0.25em] text-ash">
          Your $MAD bag (amount of tokens)
        </label>
        <input
          type="number"
          value={bag || ""}
          onChange={(e) => setBag(Math.max(0, Number(e.target.value)))}
          className="mt-3 w-full rounded-full border border-white/10 bg-black/40 px-6 py-4 font-mono text-lg text-bone outline-none transition-colors focus:border-mad/60"
        />
        <div className="mt-3 flex flex-wrap gap-2">
          {[100_000, 1_000_000, 5_000_000, 10_000_000, 100_000_000].map((v) => (
            <button
              key={v}
              onClick={() => setBag(v)}
              className={cn(
                "rounded-full border px-4 py-1.5 font-mono text-xs transition-all",
                bag === v ? "border-mad bg-mad/15 text-mad-bright" : "border-white/10 text-ash hover:border-mad/40 hover:text-bone",
              )}
            >
              {v >= 1_000_000 ? `${v / 1_000_000}M` : `${v / 1_000}K`}
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/8 bg-black/40 p-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-ash">Current Price</p>
            <p className="mt-2 font-mono text-2xl font-bold text-bone">{fmtPrice(price)}</p>
            {change24h != null && (
              <p className={cn("font-mono text-sm", up ? "text-green-400" : "text-mad-bright")}>
                {up ? "▲" : "▼"} {Math.abs(change24h).toFixed(2)}%
              </p>
            )}
          </div>
          <div className="rounded-2xl border border-white/8 bg-black/40 p-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-ash">Current MCAP</p>
            <p className="mt-2 font-mono text-2xl font-bold text-bone">{fmtUsd(mcap)}</p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-mad/30 bg-mad/[0.06] p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-ash">
              Target Market Cap Simulation
            </p>
            <div className="flex items-center gap-2 font-mono text-mad-bright">
              <span>$</span>
              <input
                type="number"
                value={target || ""}
                onChange={(e) => setTarget(Math.max(0, Number(e.target.value)))}
                className="w-32 rounded-lg border border-mad/30 bg-black/50 px-3 py-1.5 text-right outline-none focus:border-mad"
              />
            </div>
          </div>
          <input
            type="range"
            min={1_000_000}
            max={100_000_000}
            step={1_000_000}
            value={Math.min(target, 100_000_000)}
            onChange={(e) => setTarget(Number(e.target.value))}
            className="mt-4 w-full accent-mad"
          />
          <div className="mt-4 grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-ash">Current Value</p>
              <p className="mt-1 font-mono text-lg font-bold text-bone">{fmtUsd(currentValue)}</p>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-ash">Target Value</p>
              <p className="mt-1 font-mono text-lg font-bold text-green-400">{fmtUsd(targetValue)}</p>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-ash">Multiplier</p>
              <p className="mt-1 font-mono text-lg font-bold text-mad-bright">
                {multiplier ? `${multiplier.toFixed(1)}x` : "—"}
              </p>
            </div>
          </div>
        </div>

        <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.25em] text-ash">Milestone Simulator</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {MILESTONES.map((m) => {
            const val = bag * (m.mcap / SUPPLY);
            const reached = mcap != null && mcap >= m.mcap;
            const mult = mcap ? m.mcap / mcap : 0;
            return (
              <div
                key={m.mcap}
                className={cn(
                  "flex items-center justify-between rounded-2xl border px-4 py-3",
                  reached ? "border-green-500/40 bg-green-500/[0.06]" : "border-white/8 bg-black/30",
                )}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{m.icon}</span>
                  <div>
                    <p className="font-mono text-sm font-bold text-bone">{fmtUsd(m.mcap).replace("$", "$")}</p>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-ash">MCAP</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-mono text-sm font-bold text-bone">{fmtUsd(val)}</p>
                  <p className={cn("font-mono text-[10px]", reached ? "text-green-400" : "text-ash")}>
                    {reached ? "✓ REACHED" : `${mult.toFixed(1)}x from now`}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        <p className="mt-4 text-center font-mono text-[10px] text-ash">
          Supply: 490.82M tokens · Updates from DexScreener · Not financial advice · CA: {CA.slice(0, 6)}...{CA.slice(-5)}
        </p>
      </div>
    </div>
  );
}

/* ---------- Numerology ---------- */

function reduceNumber(n: number): number {
  while (n > 9 && n !== 11 && n !== 22) {
    n = String(n).split("").reduce((a, d) => a + Number(d), 0);
  }
  return n;
}

function Numerology() {
  const [date, setDate] = useState("");
  const [result, setResult] = useState<number | null>(null);

  const reveal = () => {
    if (!date) return;
    const digits = date.replaceAll("-", "");
    const sum = digits.split("").reduce((a, d) => a + Number(d), 0);
    setResult(reduceNumber(sum));
  };

  return (
    <div id="numerology" className="scroll-mt-28 rounded-3xl border border-white/8 bg-panel p-8">
      <span className="text-3xl">🔢</span>
      <h3 className="mt-3 font-display text-2xl uppercase text-bone">$MAD Numerology</h3>
      <p className="mt-2 text-sm text-ash">Enter your birthday. The numbers reveal your frequency.</p>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <input
          type="date"
          value={date}
          onChange={(e) => { setDate(e.target.value); setResult(null); }}
          className="flex-1 rounded-full border border-white/10 bg-black/40 px-5 py-3 font-mono text-bone outline-none [color-scheme:dark] focus:border-mad/60"
        />
        <button
          onClick={reveal}
          className="rounded-full bg-mad px-6 py-3 text-sm font-bold uppercase tracking-wider text-white transition-all hover:scale-105 hover:shadow-glow"
        >
          Reveal My Numbers
        </button>
      </div>
      <AnimatePresence>
        {result != null && LIFE_PATH[result] && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-5 rounded-2xl border border-mad/30 bg-mad/[0.06] p-5"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-mad">Life Path {result}</p>
            <p className="mt-1 font-display text-xl uppercase text-bone">{LIFE_PATH[result].title}</p>
            <p className="mt-2 text-sm leading-relaxed text-ash">{LIFE_PATH[result].reading}</p>
          </motion.div>
        )}
      </AnimatePresence>
      <p className="mt-4 font-mono text-[10px] text-ash/70">
        Based on the Chaldean-Pythagorean system. Numbers are vibrations. You are a frequency.
      </p>
    </div>
  );
}

/* ---------- Astrology ---------- */

function Astrology() {
  const [date, setDate] = useState("");
  const [result, setResult] = useState<{ animal: (typeof ZODIAC)[number]; element: string } | null>(null);

  const reveal = () => {
    if (!date) return;
    const year = Number(date.slice(0, 4));
    if (!year || year < 1900 || year > 2100) return;
    const animal = ZODIAC[(year - 4) % 12];
    const element = ELEMENTS[Math.floor((year % 10) / 2)];
    setResult({ animal, element });
  };

  return (
    <div id="astrology" className="scroll-mt-28 rounded-3xl border border-white/8 bg-panel p-8">
      <span className="text-3xl">🐉</span>
      <h3 className="mt-3 font-display text-2xl uppercase text-bone">$MAD Astrology</h3>
      <p className="mt-2 text-sm text-ash">Your zodiac animal, element, and cosmic holding style.</p>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <input
          type="date"
          value={date}
          onChange={(e) => { setDate(e.target.value); setResult(null); }}
          className="flex-1 rounded-full border border-white/10 bg-black/40 px-5 py-3 font-mono text-bone outline-none [color-scheme:dark] focus:border-mad/60"
        />
        <button
          onClick={reveal}
          className="rounded-full bg-mad px-6 py-3 text-sm font-bold uppercase tracking-wider text-white transition-all hover:scale-105 hover:shadow-glow"
        >
          Reveal My Chart
        </button>
      </div>
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-5 rounded-2xl border border-mad/30 bg-mad/[0.06] p-5"
          >
            <p className="text-3xl">{result.animal.icon}</p>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.3em] text-mad">
              {result.element} {result.animal.animal}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-ash">{result.animal.style}</p>
          </motion.div>
        )}
      </AnimatePresence>
      <p className="mt-4 font-mono text-[10px] text-ash/70">
        Based on classical Chinese astrology — Ba Zi, Wu Xing, and the 12 Zodiac Animals.
      </p>
    </div>
  );
}

/* ---------- Archetype Quiz ---------- */

function ArchetypeQuiz() {
  const [step, setStep] = useState(-1);
  const [scores, setScores] = useState<Record<ArchetypeKey, number>>({ diamond: 0, trench: 0, manifestor: 0, scientist: 0, leader: 0 });

  const answer = (a: ArchetypeKey) => {
    setScores((s) => ({ ...s, [a]: s[a] + 1 }));
    setStep((s) => s + 1);
  };

  const winner = useMemo(() => {
    if (step < QUIZ.length) return null;
    return (Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0]) as ArchetypeKey;
  }, [step, scores]);

  const reset = () => {
    setStep(-1);
    setScores({ diamond: 0, trench: 0, manifestor: 0, scientist: 0, leader: 0 });
  };

  return (
    <div id="quiz" className="scroll-mt-28 rounded-3xl border border-white/8 bg-panel p-8">
      <span className="text-3xl">🎭</span>
      <h3 className="mt-3 font-display text-2xl uppercase text-bone">Discover Your $MAD Archetype</h3>
      <p className="mt-2 text-sm text-ash">8 questions. One truth. How $MAD are you?</p>

      {step === -1 && (
        <div className="mt-6">
          <div className="flex flex-wrap gap-2">
            {Object.values(ARCHETYPES).map((a) => (
              <span key={a.name} className="rounded-full border border-white/10 px-4 py-1.5 text-xs text-ash">
                {a.icon} {a.name}
              </span>
            ))}
          </div>
          <button
            onClick={() => setStep(0)}
            className="mt-6 rounded-full bg-mad px-8 py-3 text-sm font-bold uppercase tracking-wider text-white transition-all hover:scale-105 hover:shadow-glow"
          >
            Start The Quiz
          </button>
        </div>
      )}

      {step >= 0 && step < QUIZ.length && (
        <div className="mt-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/8">
              <div className="h-full rounded-full bg-mad transition-all duration-500" style={{ width: `${(step / QUIZ.length) * 100}%` }} />
            </div>
            <span className="font-mono text-xs text-ash">{step + 1}/{QUIZ.length}</span>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-lg font-semibold text-bone">{QUIZ[step].q}</p>
              <div className="mt-4 flex flex-col gap-2">
                {QUIZ[step].opts.map((o) => (
                  <button
                    key={o.text}
                    onClick={() => answer(o.a)}
                    className="rounded-2xl border border-white/10 bg-black/30 px-5 py-3 text-left text-sm text-bone/85 transition-all hover:border-mad/50 hover:bg-mad/[0.07]"
                  >
                    {o.text}
                  </button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {winner && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mt-6 rounded-2xl border border-mad/40 bg-mad/[0.07] p-6 text-center">
          <p className="text-5xl">{ARCHETYPES[winner].icon}</p>
          <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.3em] text-mad">You are</p>
          <p className="mt-1 font-display text-3xl uppercase text-bone">{ARCHETYPES[winner].name}</p>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ash">{ARCHETYPES[winner].desc}</p>
          <button onClick={reset} className="mt-5 rounded-full border border-white/15 px-6 py-2.5 text-sm font-bold text-bone transition-all hover:border-mad/50 hover:text-mad-bright">
            Retake ↺
          </button>
        </motion.div>
      )}
    </div>
  );
}

/* ---------- Frequency Meter ---------- */

function FrequencyMeter() {
  const [step, setStep] = useState(-1);
  const [score, setScore] = useState(0);

  const answer = (pts: number) => {
    setScore((s) => s + pts);
    setStep((s) => s + 1);
  };

  const band = step >= FREQUENCY_QS.length ? [...FREQUENCIES].reverse().find((f) => score >= f.min) : null;

  return (
    <div id="frequency" className="scroll-mt-28 rounded-3xl border border-white/8 bg-panel p-8">
      <span className="text-3xl">📡</span>
      <h3 className="mt-3 font-display text-2xl uppercase text-bone">Check Your Frequency</h3>
      <p className="mt-2 text-sm text-ash">5 questions. One reading. A prescription to level up.</p>

      {step === -1 && (
        <div className="mt-6">
          <div className="flex flex-wrap gap-2">
            {FREQUENCIES.map((f) => (
              <span key={f.name} className="rounded-full border border-white/10 px-4 py-1.5 text-xs text-ash">{f.name}</span>
            ))}
          </div>
          <button
            onClick={() => setStep(0)}
            className="mt-6 rounded-full bg-mad px-8 py-3 text-sm font-bold uppercase tracking-wider text-white transition-all hover:scale-105 hover:shadow-glow"
          >
            Measure My Frequency
          </button>
        </div>
      )}

      {step >= 0 && step < FREQUENCY_QS.length && (
        <div className="mt-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/8">
              <div className="h-full rounded-full bg-mad transition-all duration-500" style={{ width: `${(step / FREQUENCY_QS.length) * 100}%` }} />
            </div>
            <span className="font-mono text-xs text-ash">{step + 1}/{FREQUENCY_QS.length}</span>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-lg font-semibold text-bone">{FREQUENCY_QS[step].q}</p>
              <div className="mt-4 flex flex-col gap-2">
                {FREQUENCY_QS[step].opts.map((o, i) => (
                  <button
                    key={o}
                    onClick={() => answer(i)}
                    className="rounded-2xl border border-white/10 bg-black/30 px-5 py-3 text-left text-sm text-bone/85 transition-all hover:border-mad/50 hover:bg-mad/[0.07]"
                  >
                    {o}
                  </button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {band && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mt-6 rounded-2xl border border-mad/40 bg-mad/[0.07] p-6 text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-mad">Current reading</p>
          <p className="mt-2 font-display text-3xl uppercase text-bone">{band.name}</p>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ash">{band.rx}</p>
          <button onClick={() => { setStep(-1); setScore(0); }} className="mt-5 rounded-full border border-white/15 px-6 py-2.5 text-sm font-bold text-bone transition-all hover:border-mad/50 hover:text-mad-bright">
            Measure Again ↺
          </button>
        </motion.div>
      )}
    </div>
  );
}

/* ---------- Page ---------- */

const PILLS = [
  { label: "💰 Bag Calculator", href: "#calc" },
  { label: "🔢 Numerology", href: "#numerology" },
  { label: "🐉 $MAD Astrology", href: "#astrology" },
  { label: "🎭 Archetype Quiz", href: "#quiz" },
  { label: "📊 Frequency Meter", href: "#frequency" },
];

export default function MadMind() {
  return (
    <>
      <div className="relative h-[300px] overflow-hidden sm:h-[380px]">
        <img src="/assets/mad-ai-banner.png" alt="$MAD AI Labs" className="h-full w-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-transparent to-ink" />
      </div>

      <PageShell
        eyebrow="[ The Frequency Gate ]"
        title={<>MAD <span className="text-mad">MIND</span> AI</>}
        sub="Discover your personal numbers, find your MAD archetype, and see what the universe says about your wealth potential. Your AI-powered crystal ball — built different, built $MAD."
      >
        <div className="-mt-6 mb-12 flex flex-wrap justify-center gap-2">
          {PILLS.map((p) => (
            <a
              key={p.href}
              href={p.href}
              className="rounded-full border border-white/10 bg-panel px-5 py-2 text-sm text-ash transition-all hover:border-mad/50 hover:text-bone"
            >
              {p.label}
            </a>
          ))}
        </div>

        <ValueCalc />
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <Reveal><Numerology /></Reveal>
          <Reveal delay={0.1}><Astrology /></Reveal>
        </div>
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <Reveal><ArchetypeQuiz /></Reveal>
          <Reveal delay={0.1}><FrequencyMeter /></Reveal>
        </div>
      </PageShell>
    </>
  );
}
