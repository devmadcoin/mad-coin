"use client";

import { useState, useCallback } from "react";

/* ───────────────────────────────────────────────────────────
   THE FREQUENCY METER — How $MAD is your current vibe?
   5 questions. One frequency reading. A prescription to level up.
   ─────────────────────────────────────────────────────────── */

type FrequencyLevel = "broke" | "struggling" | "building" | "abundant" | "transcendent";

interface Question {
  id: number;
  text: string;
  options: {
    label: string;
    score: number; // 0-100
  }[];
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    text: "How did you wake up feeling today?",
    options: [
      { label: "Anxious, checking my phone before my eyes focus", score: 15 },
      { label: "Tired, but I'll grind through it", score: 35 },
      { label: "Neutral, ready to see what the day brings", score: 50 },
      { label: "Good. I said my affirmations before leaving bed", score: 75 },
      { label: "Abundant. I already know today is mine", score: 100 },
    ],
  },
  {
    id: 2,
    text: "When you think about your $MAD bag right now, you feel...",
    options: [
      { label: "Sick. I should have sold / I should have bought more", score: 10 },
      { label: "Nervous. The chart is all I can think about", score: 25 },
      { label: "Patient. I'm here for the long game", score: 55 },
      { label: "Confident. My conviction runs deeper than any dip", score: 80 },
      { label: "Grateful. The bag is growing in ways I can't even see yet", score: 100 },
    ],
  },
  {
    id: 3,
    text: "Your friend paper-hands and tells you to do the same. You...",
    options: [
      { label: "Panic and check the chart immediately", score: 10 },
      { label: "Consider it. Maybe they're seeing something I'm not", score: 30 },
      { label: "Ignore them. My path is my path", score: 60 },
      { label: "Send them the $MAD affirmation thread. Elevate them", score: 85 },
      { label: "Laugh. Paper hands don't understand frequency", score: 100 },
    ],
  },
  {
    id: 4,
    text: "It's 11 PM. What are you doing?",
    options: [
      { label: "Doom-scrolling X, staring at red candles", score: 15 },
      { label: "Studying charts, looking for 'the perfect entry'", score: 30 },
      { label: "Relaxing. I did my work today", score: 55 },
      { label: "Reading, learning, expanding my mind", score: 80 },
      { label: "Sleeping like the already-rich. Tomorrow is handled", score: 100 },
    ],
  },
  {
    id: 5,
    text: "Complete this sentence: 'I am...'",
    options: [
      { label: "Worried about my investment", score: 10 },
      { label: "Hoping this works out", score: 30 },
      { label: "Building something bigger than myself", score: 60 },
      { label: "$MAD Abundant, $MAD Rich, $MAD Focused", score: 85 },
      { label: "Already there. The money is just catching up", score: 100 },
    ],
  },
];

const FREQUENCY_LEVELS: Record<FrequencyLevel, {
  label: string;
  color: string;
  bgColor: string;
  description: string;
  prescription: string[];
}> = {
  broke: {
    label: "Broke Frequency",
    color: "#FF2D2D",
    bgColor: "rgba(255, 45, 45, 0.08)",
    description: "You're vibrating at scarcity. Fear is driving every decision. This is where bags get liquidated and dreams get abandoned.",
    prescription: [
      "Step 1: Close the charts. Right now. For 24 hours minimum.",
      "Step 2: Write down 3 things you're grateful for. Not crypto things. Life things.",
      "Step 3: Say aloud: 'I am $MAD Abundant. The dip is my teacher.' 10 times.",
      "Step 4: Come back when you feel calm. The market will still be here.",
    ],
  },
  struggling: {
    label: "Struggling Frequency",
    color: "#FF6B00",
    bgColor: "rgba(255, 107, 0, 0.08)",
    description: "You're in the trenches but your mind is in the clouds. Half-building, half-worrying. This frequency burns people out.",
    prescription: [
      "Step 1: Define your 'why' in one sentence. Why are you really here?",
      "Step 2: Set one non-crypto goal for this week. Garden, gym, book — something real.",
      "Step 3: Limit chart-checking to 2 times per day. Set alarms, not compulsions.",
      "Step 4: Re-read your archetype result. That's who you are. Act like it.",
    ],
  },
  building: {
    label: "Building Frequency",
    color: "#FFD700",
    bgColor: "rgba(255, 215, 0, 0.08)",
    description: "Solid foundation. You're doing the work without losing your mind. This is where real wealth starts — consistent, patient, present.",
    prescription: [
      "Step 1: Double down on your strengths. Check your archetype — what are you best at?",
      "Step 2: Help one person in the community today. Reply, encourage, educate.",
      "Step 3: Visualize your goal for 5 minutes before sleep. Feel it like it's real.",
      "Step 4: You're close to the next level. Stay consistent. The compound is coming.",
    ],
  },
  abundant: {
    label: "Abundant Frequency",
    color: "#00D4FF",
    bgColor: "rgba(0, 212, 255, 0.08)",
    description: "You're operating from a place of already-having. This is the frequency that attracts. The universe responds to this signal.",
    prescription: [
      "Step 1: Your energy is contagious. Share it. Post, tweet, talk.",
      "Step 2: Mentor someone newer than you. Teaching amplifies your own conviction.",
      "Step 3: Set a bigger goal. If you're this abundant, what does the next level look like?",
      "Step 4: Protect your peace. Not everyone deserves access to your frequency.",
    ],
  },
  transcendent: {
    label: "Transcendent Frequency",
    color: "#A855F7",
    bgColor: "rgba(168, 85, 247, 0.08)",
    description: "You've moved beyond the chart. Beyond the price. You're building a legacy. This is the frequency of generational wealth.",
    prescription: [
      "Step 1: Document your journey. People need to see what's possible.",
      "Step 2: Build something that outlasts the token. A product, a community, a movement.",
      "Step 3: Give back. The more you give from abundance, the more returns.",
      "Step 4: Teach others to reach this frequency. A rising tide lifts all $MAD ships.",
    ],
  },
};

function getFrequencyLevel(score: number): FrequencyLevel {
  if (score <= 25) return "broke";
  if (score <= 45) return "struggling";
  if (score <= 70) return "building";
  if (score <= 90) return "abundant";
  return "transcendent";
}

function getArchetypeBoost(archetype: string | null): string {
  if (!archetype) return "";
  const boosts: Record<string, string> = {
    "diamond-hands": "Your Diamond Hands nature means you have the discipline to hold this frequency. Don't let doubt creep in.",
    "trench-warrior": "Your Trench Warrior grind is your superpower — but remember, even warriors need rest. Pace yourself.",
    "manifestor": "As a Manifestor, your visualization practice is your anchor. When the frequency dips, return to your affirmations.",
    "mad-scientist": "Your analytical mind is an asset — but don't overthink the vibe. Sometimes frequency is felt, not calculated.",
    "cult-leader": "Your community looks to you. When your frequency is high, you lift everyone. Protect it like the asset it is.",
  };
  return boosts[archetype] || "";
}

/* ─── Progress Bar ─── */
function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = ((current + 1) / total) * 100;
  return (
    <div className="w-full mb-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30">
          Question {current + 1} of {total}
        </span>
        <span className="text-[9px] font-black text-white/20">{Math.round(pct)}%</span>
      </div>
      <div className="h-1 rounded-full bg-white/5 overflow-hidden">
        <div
          className="h-full rounded-full bg-[#FF2D2D] transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

/* ─── Option Button ─── */
function OptionButton({
  label,
  onClick,
  delay,
}: {
  label: string;
  onClick: () => void;
  delay: number;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left p-4 rounded-xl border border-white/10 bg-white/[0.03] hover:border-[#FF2D2D]/30 hover:bg-white/[0.06] transition-all group"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center gap-3">
        <div className="w-5 h-5 rounded-full border border-white/20 group-hover:border-[#FF2D2D]/50 flex items-center justify-center shrink-0 transition-all">
          <div className="w-2 h-2 rounded-full bg-transparent group-hover:bg-[#FF2D2D] transition-all" />
        </div>
        <span className="text-sm text-white/70 group-hover:text-white transition-colors">{label}</span>
      </div>
    </button>
  );
}

/* ─── Frequency Gauge ─── */
function FrequencyGauge({ score, level }: { score: number; level: FrequencyLevel }) {
  const config = FREQUENCY_LEVELS[level];
  const circumference = 2 * Math.PI * 90;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center mb-6">
      <div className="relative w-48 h-48">
        {/* Background circle */}
        <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
          <circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="12"
          />
          {/* Progress arc */}
          <circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke={config.color}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1000"
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-black text-white">{score}%</span>
          <span className="text-[9px] font-black uppercase tracking-wider mt-1" style={{ color: config.color }}>
            {config.label}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ─── Result View ─── */
function FrequencyResult({
  score,
  archetype,
  onReset,
}: {
  score: number;
  archetype: string | null;
  onReset: () => void;
}) {
  const level = getFrequencyLevel(score);
  const config = FREQUENCY_LEVELS[level];
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      const text = `My $MAD Frequency: ${score}% — ${config.label}\n\n${config.description}\n\nFind your frequency 👇\nhttps://www.madrichclub.com/mad-mind\n\n#MADRichClub #StayMAD`;
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const handleTweet = () => {
    const text = encodeURIComponent(
      `My $MAD Frequency: ${score}% — ${config.label}\n\n${config.description.slice(0, 100)}...\n\nFind your frequency 👇\nhttps://www.madrichclub.com/mad-mind\n\n#MADRichClub #StayMAD`
    );
    window.open(`https://x.com/intent/tweet?text=${text}`, "_blank");
  };

  return (
    <div className="text-center">
      {/* Gauge */}
      <FrequencyGauge score={score} level={level} />

      {/* Level Badge */}
      <div
        className="inline-block px-4 py-2 rounded-full border mb-4"
        style={{ borderColor: `${config.color}40`, backgroundColor: config.bgColor }}
      >
        <span className="text-xs font-black uppercase tracking-wider" style={{ color: config.color }}>
          {config.label}
        </span>
      </div>

      {/* Description */}
      <div className="rounded-[1.2rem] border border-white/10 bg-white/[0.03] p-5 sm:p-6 mb-4 text-left">
        <p className="text-sm text-white/60 leading-relaxed mb-4">{config.description}</p>

        {/* Prescription */}
        <div className="mb-4">
          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#FF6B00]/60 mb-3">
            Your Prescription
          </p>
          <div className="space-y-2">
            {config.prescription.map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-[10px] font-black text-[#FF6B00]/50 mt-0.5">{i + 1}.</span>
                <p className="text-xs text-white/50 leading-relaxed">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Archetype Boost */}
        {archetype && (
          <div className="rounded-xl border-l-2 border-[#FF6B00]/30 bg-[#FF6B00]/[0.04] p-4">
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#FF6B00]/50 mb-1">
              Archetype Boost
            </p>
            <p className="text-sm text-white/70 leading-relaxed">{getArchetypeBoost(archetype)}</p>
          </div>
        )}
      </div>

      {/* Share Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={handleTweet}
          className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#1a1a1a] text-white text-sm font-bold hover:bg-[#2a2a2a] transition-all flex items-center justify-center gap-2"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
          Share on X
        </button>
        <button
          onClick={handleCopy}
          className="w-full sm:w-auto px-6 py-3 rounded-full border border-white/10 bg-white/[0.03] text-sm font-bold text-white/60 hover:text-white hover:border-white/20 transition-all"
        >
          {copied ? "✓ Copied" : "Copy Result"}
        </button>
        <button
          onClick={onReset}
          className="w-full sm:w-auto px-6 py-3 rounded-full border border-white/10 bg-white/[0.03] text-sm font-bold text-white/40 hover:text-white/60 hover:border-white/20 transition-all"
        >
          Check Again
        </button>
      </div>
    </div>
  );
}

/* ─── MAIN COMPONENT ─── */
export default function FrequencyMeter() {
  const [started, setStarted] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [result, setResult] = useState<{ score: number; archetype: string | null } | null>(null);

  // Try to get archetype from localStorage
  const getStoredArchetype = (): string | null => {
    try {
      const stored = localStorage.getItem("mad-archetype-result");
      return stored || null;
    } catch {
      return null;
    }
  };

  const handleStart = useCallback(() => {
    setStarted(true);
    setCurrentQ(0);
    setTotalScore(0);
    setResult(null);
  }, []);

  const handleAnswer = useCallback(
    (optionIndex: number) => {
      const q = QUESTIONS[currentQ];
      const selected = q.options[optionIndex];
      const newTotal = totalScore + selected.score;

      if (currentQ < QUESTIONS.length - 1) {
        setTotalScore(newTotal);
        setCurrentQ((prev) => prev + 1);
      } else {
        // Final question — calculate result
        const finalScore = Math.round((newTotal) / QUESTIONS.length);
        setResult({
          score: finalScore,
          archetype: getStoredArchetype(),
        });
      }
    },
    [currentQ, totalScore]
  );

  const handleReset = useCallback(() => {
    setStarted(false);
    setCurrentQ(0);
    setTotalScore(0);
    setResult(null);
  }, []);

  return (
    <section className="mb-1">
      <div className="rounded-none sm:rounded-2xl border-0 sm:border border-white/5 bg-[#121212] overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.3)] relative">
        {/* Header */}
        <div className="shrink-0 flex items-center justify-center px-4 sm:px-6 py-4 sm:py-5 border-b border-white/5">
          <div className="text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#FF2D2D]/60 mb-1">
              [ THE METER ]
            </p>
            <p className="text-xs text-white/40">
              5 questions. One frequency reading. A prescription to level up.
            </p>
          </div>
        </div>

        <div className="px-3 sm:px-4 py-4 sm:py-6">
          {!started ? (
            /* Intro State */
            <div className="flex flex-col items-center justify-center py-8 sm:py-12">
              <div className="w-16 h-16 rounded-full bg-[#FF2D2D]/10 border border-[#FF2D2D]/20 flex items-center justify-center mb-6">
                <span className="text-2xl">📡</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-[#FF2D2D] tracking-tight mb-2 text-center">
                Check Your Frequency
              </h3>
              <p className="text-xs text-white/40 text-center max-w-sm mb-6 leading-relaxed">
                You know your numbers. You know your archetype. 
                Now — what's your current vibe? Are you operating at broke frequency 
                or transcendent frequency?
              </p>
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                {Object.values(FREQUENCY_LEVELS).map((f) => (
                  <span
                    key={f.label}
                    className="px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.03] text-[10px] font-bold"
                    style={{ color: `${f.color}99` }}
                  >
                    {f.label}
                  </span>
                ))}
              </div>
              <button
                onClick={handleStart}
                className="px-8 py-3 rounded-full bg-[#FF2D2D] text-white text-sm font-black uppercase tracking-wider hover:bg-[#FF6B00] hover:scale-[1.02] shadow-[0_0_20px_rgba(255,45,45,0.2)] transition-all"
              >
                Measure My Frequency
              </button>
            </div>
          ) : result ? (
            /* Result State */
            <FrequencyResult
              score={result.score}
              archetype={result.archetype}
              onReset={handleReset}
            />
          ) : (
            /* Question State */
            <div>
              <ProgressBar current={currentQ} total={QUESTIONS.length} />
              <div className="mb-6">
                <h3 className="text-base sm:text-lg font-black text-white leading-snug">
                  {QUESTIONS[currentQ].text}
                </h3>
              </div>
              <div className="space-y-2">
                {QUESTIONS[currentQ].options.map((opt, i) => (
                  <OptionButton
                    key={i}
                    label={opt.label}
                    onClick={() => handleAnswer(i)}
                    delay={i * 75}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
