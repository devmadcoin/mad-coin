"use client";

import { useState, useCallback } from "react";

/* ───────────────────────────────────────────────────────────
   HOW $MAD ARE YOU? — Archetype Quiz
   8 questions. 5 archetypes. One truth.
   ─────────────────────────────────────────────────────────── */

type Archetype =
  | "diamond-hands"
  | "trench-warrior"
  | "manifestor"
  | "mad-scientist"
  | "cult-leader";

interface Question {
  id: number;
  text: string;
  options: {
    label: string;
    archetypes: Record<Archetype, number>;
  }[];
}

const ARCHETYPES: Record<
  Archetype,
  {
    name: string;
    tagline: string;
    emoji: string;
    color: string;
    description: string;
    strengths: string[];
    weakness: string;
    madAdvice: string;
  }
> = {
  "diamond-hands": {
    name: "The Diamond Hands",
    tagline: "Unshakable. Unbreakable. Unbothered.",
    emoji: "💎",
    color: "#00D4FF",
    description:
      "You don't flinch at -80%. You don't celebrate at +300%. Your hands are forged in silence, and your conviction runs deeper than any chart. While others panic-sell into the void, you buy the dip with the calm of a monk who has already seen the future.",
    strengths: ["Unshakeable conviction", "Emotional mastery", "Long-term vision"],
    weakness: "Sometimes you hold too long. Not every project deserves diamond hands.",
    madAdvice: "Your strength is your silence. But remember: conviction without verification is just stubbornness. DYOR, then never look back.",
  },
  "trench-warrior": {
    name: "The Trench Warrior",
    tagline: "Grinds. Never sleeps. Always building.",
    emoji: "⚔️",
    color: "#FF2D2D",
    description:
      "You're in the trenches before dawn. You shill when no one's watching. You grind when the chart is flat. Your work ethic is terrifying, and your hustle is unmatched. You're not here for the pump — you're here for the empire.",
    strengths: ["Relentless work ethic", "Community-first mindset", "Early to everything"],
    weakness: "Burnout is real. You can't grind forever without rest.",
    madAdvice: "The trenches made you. But empires aren't built in trenches — they're built from them. Step back, zoom out, let the work compound.",
  },
  "manifestor": {
    name: "The Manifestor",
    tagline: "Affirmations + Action = Alchemy.",
    emoji: "✨",
    color: "#FF6B00",
    description:
      "You speak it into existence. You feel it before you see it. Your morning routine includes '$MAD Abundant' and your night routine is gratitude for wealth you haven't touched yet. You're not delusional — you're programming reality.",
    strengths: ["Visualization mastery", "Emotional intelligence", "Attracts abundance"],
    weakness: "Manifestation without action is just daydreaming. The universe rewards movement.",
    madAdvice: "Your mind is the most powerful tool in this game. But the bag doesn't fill itself — affirm, then ACT. The universe responds to motion.",
  },
  "mad-scientist": {
    name: "The Mad Scientist",
    tagline: "Analyzes. Then strikes. Precisely.",
    emoji: "🧪",
    color: "#A855F7",
    description:
      "You don't FOMO. You calculate. You read contracts, study tokenomics, and time your entries like a sniper. Your portfolio is a lab, and every trade is an experiment. Others call you paranoid. You call it due diligence.",
    strengths: ["Analytical precision", "Risk management", "Strategic timing"],
    weakness: "Analysis paralysis. Sometimes the perfect entry doesn't exist.",
    madAdvice: "Your edge is your mind. But crypto rewards conviction over perfection. Calculate, then commit. The best trade is the one you actually take.",
  },
  "cult-leader": {
    name: "The Cult Leader",
    tagline: "Brings people in. They follow the frequency.",
    emoji: "🔥",
    color: "#FFD700",
    description:
      "You don't just hold — you recruit. You don't just believe — you convert. Your Telegram is a temple, your X feed is a sermon, and your community hangs on every word. You're not a holder. You're a movement.",
    strengths: ["Charismatic influence", "Community building", "Viral energy"],
    weakness: "Leadership without substance is just noise. Make sure the project backs your voice.",
    madAdvice: "Your voice moves markets. But a cult without a cause is just a crowd. Lead them somewhere real. Build something that lasts.",
  },
};

const QUESTIONS: Question[] = [
  {
    id: 1,
    text: "The chart just dumped 60% in 2 hours. What's your first move?",
    options: [
      {
        label: "Buy more. The discount is divine.",
        archetypes: { "diamond-hands": 3, "mad-scientist": 1, "trench-warrior": 1, manifestor: 0, "cult-leader": 0 },
      },
      {
        label: "Open Telegram, rally the troops, post memes.",
        archetypes: { "cult-leader": 3, "trench-warrior": 2, "diamond-hands": 0, manifestor: 0, "mad-scientist": 0 },
      },
      {
        label: "Check the contract, wallet movements, dev activity.",
        archetypes: { "mad-scientist": 3, "diamond-hands": 1, "trench-warrior": 0, manifestor: 0, "cult-leader": 0 },
      },
      {
        label: "Close the app. Say my affirmations. Trust the process.",
        archetypes: { manifestor: 3, "diamond-hands": 1, "mad-scientist": 0, "trench-warrior": 0, "cult-leader": 0 },
      },
      {
        label: "I've been grinding since 3am anyway. This changes nothing.",
        archetypes: { "trench-warrior": 3, "cult-leader": 1, manifestor: 0, "diamond-hands": 0, "mad-scientist": 0 },
      },
    ],
  },
  {
    id: 2,
    text: "How many times do you check the chart per day?",
    options: [
      {
        label: "Chart? I check my goals, not the price.",
        archetypes: { manifestor: 3, "diamond-hands": 2, "mad-scientist": 0, "trench-warrior": 0, "cult-leader": 0 },
      },
      {
        label: "Every 15 minutes. I have alerts set up like a pro.",
        archetypes: { "mad-scientist": 3, "trench-warrior": 1, "diamond-hands": 0, manifestor: 0, "cult-leader": 0 },
      },
      {
        label: "I don't check. I already know where this is going.",
        archetypes: { "diamond-hands": 3, manifestor: 1, "mad-scientist": 0, "trench-warrior": 0, "cult-leader": 0 },
      },
      {
        label: "Every hour, but only to screenshot for my community.",
        archetypes: { "cult-leader": 3, "trench-warrior": 1, "diamond-hands": 0, manifestor: 0, "mad-scientist": 0 },
      },
      {
        label: "I live in the trenches. I AM the chart.",
        archetypes: { "trench-warrior": 3, "cult-leader": 1, "diamond-hands": 0, manifestor: 0, "mad-scientist": 0 },
      },
    ],
  },
  {
    id: 3,
    text: "Someone spreads FUD in the Telegram. Your response?",
    options: [
      {
        label: "Drop the wallet scan, tokenomics breakdown, and a meme.",
        archetypes: { "mad-scientist": 3, "cult-leader": 1, "diamond-hands": 0, manifestor: 0, "trench-warrior": 0 },
      },
      {
        label: "Ignore them. FUD is a test of conviction.",
        archetypes: { "diamond-hands": 3, manifestor: 1, "mad-scientist": 0, "trench-warrior": 0, "cult-leader": 0 },
      },
      {
        label: "Rally the community. Drown them in positivity.",
        archetypes: { "cult-leader": 3, "trench-warrior": 2, manifestor: 0, "diamond-hands": 0, "mad-scientist": 0 },
      },
      {
        label: "I've already posted 5 times today defending the project.",
        archetypes: { "trench-warrior": 3, "cult-leader": 1, manifestor: 0, "diamond-hands": 0, "mad-scientist": 0 },
      },
      {
        label: "Send them love. Their fear is their frequency.",
        archetypes: { manifestor: 3, "diamond-hands": 1, "cult-leader": 0, "trench-warrior": 0, "mad-scientist": 0 },
      },
    ],
  },
  {
    id: 4,
    text: "The price just 10x'd overnight. What's your move?",
    options: [
      {
        label: "Take profits? I'm just getting started.",
        archetypes: { "diamond-hands": 3, manifestor: 1, "mad-scientist": 0, "trench-warrior": 0, "cult-leader": 0 },
      },
      {
        label: "Screenshot, post, tag everyone I know.",
        archetypes: { "cult-leader": 3, "trench-warrior": 2, manifestor: 0, "diamond-hands": 0, "mad-scientist": 0 },
      },
      {
        label: "Check the volume, liquidity, whale wallets first.",
        archetypes: { "mad-scientist": 3, "diamond-hands": 1, "trench-warrior": 0, manifestor: 0, "cult-leader": 0 },
      },
      {
        label: "I knew this was coming. I've been visualizing it.",
        archetypes: { manifestor: 3, "diamond-hands": 1, "cult-leader": 0, "trench-warrior": 0, "mad-scientist": 0 },
      },
      {
        label: "Back to work. The pump is just the beginning.",
        archetypes: { "trench-warrior": 3, "cult-leader": 1, manifestor: 0, "diamond-hands": 0, "mad-scientist": 0 },
      },
    ],
  },
  {
    id: 5,
    text: "What does your morning routine look like?",
    options: [
      {
        label: "Affirmations, visualization, then action.",
        archetypes: { manifestor: 3, "diamond-hands": 1, "trench-warrior": 0, "mad-scientist": 0, "cult-leader": 0 },
      },
      {
        label: "Check markets, scan for alpha, set alerts.",
        archetypes: { "mad-scientist": 3, "trench-warrior": 1, manifestor: 0, "diamond-hands": 0, "cult-leader": 0 },
      },
      {
        label: "Wake up at 5am. Grind starts before the sun.",
        archetypes: { "trench-warrior": 3, "cult-leader": 1, manifestor: 0, "diamond-hands": 0, "mad-scientist": 0 },
      },
      {
        label: "No routine. I'm already where I need to be.",
        archetypes: { "diamond-hands": 3, manifestor: 1, "mad-scientist": 0, "trench-warrior": 0, "cult-leader": 0 },
      },
      {
        label: "Post the daily $MAD energy to my community first.",
        archetypes: { "cult-leader": 3, manifestor: 1, "trench-warrior": 0, "diamond-hands": 0, "mad-scientist": 0 },
      },
    ],
  },
  {
    id: 6,
    text: "Why are you really in crypto?",
    options: [
      {
        label: "To build generational wealth. Slow and steady.",
        archetypes: { "diamond-hands": 3, manifestor: 1, "mad-scientist": 0, "trench-warrior": 0, "cult-leader": 0 },
      },
      {
        label: "To be part of something bigger than myself.",
        archetypes: { "cult-leader": 3, manifestor: 2, "diamond-hands": 0, "trench-warrior": 0, "mad-scientist": 0 },
      },
      {
        label: "To understand the systems that control money.",
        archetypes: { "mad-scientist": 3, "diamond-hands": 1, manifestor: 0, "trench-warrior": 0, "cult-leader": 0 },
      },
      {
        label: "To prove that mind creates matter.",
        archetypes: { manifestor: 3, "diamond-hands": 1, "mad-scientist": 0, "trench-warrior": 0, "cult-leader": 0 },
      },
      {
        label: "To outwork everyone and take what's mine.",
        archetypes: { "trench-warrior": 3, "cult-leader": 1, "diamond-hands": 0, manifestor: 0, "mad-scientist": 0 },
      },
    ],
  },
  {
    id: 7,
    text: "Your friend paper-hands at -20%. What do you say?",
    options: [
      {
        label: "Nothing. Their journey is theirs. I keep holding.",
        archetypes: { "diamond-hands": 3, manifestor: 1, "mad-scientist": 0, "trench-warrior": 0, "cult-leader": 0 },
      },
      {
        label: "Bro, let me show you the wallet data...",
        archetypes: { "mad-scientist": 3, "diamond-hands": 1, "trench-warrior": 0, manifestor: 0, "cult-leader": 0 },
      },
      {
        label: "Send them the $MAD affirmation thread. Fix their frequency.",
        archetypes: { manifestor: 3, "cult-leader": 2, "diamond-hands": 0, "trench-warrior": 0, "mad-scientist": 0 },
      },
      {
        label: "Tag them in 5 posts showing why we're still early.",
        archetypes: { "trench-warrior": 3, "cult-leader": 2, manifestor: 0, "diamond-hands": 0, "mad-scientist": 0 },
      },
      {
        label: "Write a thread about conviction. Make it go viral.",
        archetypes: { "cult-leader": 3, manifestor: 1, "diamond-hands": 0, "trench-warrior": 0, "mad-scientist": 0 },
      },
    ],
  },
  {
    id: 8,
    text: "It's 3AM. You can't sleep. What's on your mind?",
    options: [
      {
        label: "Nothing. I sleep like the already-rich.",
        archetypes: { "diamond-hands": 3, manifestor: 2, "mad-scientist": 0, "trench-warrior": 0, "cult-leader": 0 },
      },
      {
        label: "New content ideas. My community needs more signal.",
        archetypes: { "cult-leader": 3, "trench-warrior": 2, manifestor: 0, "diamond-hands": 0, "mad-scientist": 0 },
      },
      {
        label: "Chart patterns I noticed before bed. Must confirm.",
        archetypes: { "mad-scientist": 3, "trench-warrior": 1, manifestor: 0, "diamond-hands": 0, "cult-leader": 0 },
      },
      {
        label: "The empire I'm building. Sleep is for the weak.",
        archetypes: { "trench-warrior": 3, "cult-leader": 1, manifestor: 0, "diamond-hands": 0, "mad-scientist": 0 },
      },
      {
        label: "Visualizing the future. Feeling it into existence.",
        archetypes: { manifestor: 3, "diamond-hands": 1, "mad-scientist": 0, "trench-warrior": 0, "cult-leader": 0 },
      },
    ],
  },
];

function calculateArchetype(scores: Record<Archetype, number>): Archetype {
  return (Object.entries(scores) as [Archetype, number][]).reduce((a, b) =>
    a[1] > b[1] ? a : b
  )[0];
}

function getShareText(archetype: Archetype): string {
  const a = ARCHETYPES[archetype];
  return `I am ${a.emoji} ${a.name} on the $MAD Archetype Quiz.\n\n"${a.tagline}"\n\nFind your frequency 👇\nhttps://www.madrichclub.com/mad-mind\n\n#MADRichClub #StayMAD`;
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

/* ─── Result Card ─── */
function ResultCard({ archetype, onReset }: { archetype: Archetype; onReset: () => void }) {
  const a = ARCHETYPES[archetype];
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getShareText(archetype));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const handleTweet = () => {
    const text = encodeURIComponent(getShareText(archetype));
    window.open(`https://x.com/intent/tweet?text=${text}`, "_blank");
  };

  return (
    <div className="text-center">
      {/* Archetype Badge */}
      <div className="mb-6">
        <div
          className="inline-flex items-center justify-center w-24 h-24 rounded-full border-2 mb-4"
          style={{ borderColor: `${a.color}40`, backgroundColor: `${a.color}10` }}
        >
          <span className="text-5xl">{a.emoji}</span>
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 mb-2">Your Archetype</p>
        <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">{a.name}</h2>
        <p className="text-sm font-medium" style={{ color: a.color }}>
          {a.tagline}
        </p>
      </div>

      {/* Description */}
      <div className="rounded-[1.2rem] border border-white/10 bg-white/[0.03] p-5 sm:p-6 mb-4 text-left">
        <p className="text-sm text-white/60 leading-relaxed mb-4">{a.description}</p>

        <div className="mb-4">
          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 mb-2">Strengths</p>
          <div className="flex flex-wrap gap-2">
            {a.strengths.map((s) => (
              <span key={s} className="px-3 py-1 rounded-full border border-white/10 bg-white/[0.03] text-[11px] font-bold text-white/60">
                {s}
              </span>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 mb-1">Shadow</p>
          <p className="text-xs text-white/40">{a.weakness}</p>
        </div>

        <div className="rounded-xl border-l-2 p-4" style={{ borderColor: a.color, backgroundColor: `${a.color}08` }}>
          <p className="text-[9px] font-black uppercase tracking-[0.3em] mb-1" style={{ color: `${a.color}99` }}>
            $MAD Advice
          </p>
          <p className="text-sm font-medium text-white/80 leading-relaxed">{a.madAdvice}</p>
        </div>
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
          Retake Quiz
        </button>
      </div>
    </div>
  );
}

/* ─── MAIN QUIZ COMPONENT ─── */
export default function MadArchetypeQuiz() {
  const [started, setStarted] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [scores, setScores] = useState<Record<Archetype, number>>({
    "diamond-hands": 0,
    "trench-warrior": 0,
    manifestor: 0,
    "mad-scientist": 0,
    "cult-leader": 0,
  });
  const [result, setResult] = useState<Archetype | null>(null);

  // Store result in localStorage for Frequency Meter to read
  const storeArchetype = useCallback((archetype: Archetype) => {
    try {
      localStorage.setItem("mad-archetype-result", archetype);
    } catch {}
  }, []);

  const handleStart = useCallback(() => {
    setStarted(true);
    setCurrentQ(0);
    setScores({
      "diamond-hands": 0,
      "trench-warrior": 0,
      manifestor: 0,
      "mad-scientist": 0,
      "cult-leader": 0,
    });
    setResult(null);
  }, []);

  const handleAnswer = useCallback(
    (optionIndex: number) => {
      const q = QUESTIONS[currentQ];
      const selected = q.options[optionIndex];

      setScores((prev) => {
        const next = { ...prev };
        (Object.entries(selected.archetypes) as [Archetype, number][]).forEach(
          ([key, val]) => {
            next[key] += val;
          }
        );
        return next;
      });

      if (currentQ < QUESTIONS.length - 1) {
        setCurrentQ((prev) => prev + 1);
      } else {
        // Calculate final result on next render
        setTimeout(() => {
          setScores((finalScores) => {
            const winner = calculateArchetype(finalScores);
            setResult(winner);
            storeArchetype(winner);
            return finalScores;
          });
        }, 300);
      }
    },
    [currentQ]
  );

  const handleReset = useCallback(() => {
    setStarted(false);
    setCurrentQ(0);
    setScores({
      "diamond-hands": 0,
      "trench-warrior": 0,
      manifestor: 0,
      "mad-scientist": 0,
      "cult-leader": 0,
    });
    setResult(null);
  }, []);

  return (
    <section className="mb-1">
      <div className="rounded-none sm:rounded-2xl border-0 sm:border border-white/5 bg-[#121212] overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.3)] relative">
        {/* Header */}
        <div className="shrink-0 flex items-center justify-center px-4 sm:px-6 py-4 sm:py-5 border-b border-white/5">
          <div className="text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#FF6B00]/60 mb-1">
              [ THE QUIZ ]
            </p>
            <p className="text-xs text-white/40">
              8 questions. One truth. How $MAD are you?
            </p>
          </div>
        </div>

        <div className="px-3 sm:px-4 py-4 sm:py-6">
          {!started ? (
            /* Intro State */
            <div className="flex flex-col items-center justify-center py-8 sm:py-12">
              <div className="w-16 h-16 rounded-full bg-[#FF2D2D]/10 border border-[#FF2D2D]/20 flex items-center justify-center mb-6">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white mb-2 text-center">
                Discover Your $MAD Archetype
              </h3>
              <p className="text-xs text-white/40 text-center max-w-sm mb-6 leading-relaxed">
                Every holder has a frequency. Some grind. Some manifest. Some build. 
                Some lead. Some never flinch. Which one are you?
              </p>
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                {Object.values(ARCHETYPES).map((a) => (
                  <span
                    key={a.name}
                    className="px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.03] text-[10px] font-bold text-white/40"
                  >
                    {a.emoji} {a.name}
                  </span>
                ))}
              </div>
              <button
                onClick={handleStart}
                className="px-8 py-3 rounded-full bg-[#FF2D2D] text-white text-sm font-black uppercase tracking-wider hover:bg-[#FF6B00] hover:scale-[1.02] shadow-[0_0_20px_rgba(255,45,45,0.2)] transition-all"
              >
                Start The Quiz
              </button>
            </div>
          ) : result ? (
            /* Result State */
            <ResultCard archetype={result} onReset={handleReset} />
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
