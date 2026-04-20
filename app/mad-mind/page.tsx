"use client";

import { useEffect, useState } from "react";

type Demo = {
  q: string;
  a: string;
};

const DEMOS: Demo[] = [
  {
    q: "Why can’t I stay consistent?",
    a: "Because you rely on mood instead of systems.",
  },
  {
    q: "Why am I broke?",
    a: "Because comfort gets paid before discipline does.",
  },
  {
    q: "Why am I anxious?",
    a: "Because you rehearse fear more than action.",
  },
  {
    q: "Why am I stuck?",
    a: "Because thinking became your replacement for moving.",
  },
  {
    q: "Why do I self sabotage?",
    a: "Because your habits still serve your old identity.",
  },
];

const PLACEHOLDERS = [
  "What’s messing you up right now?",
  "Why am I stuck?",
  "Why can’t I focus?",
  "Why do I overthink everything?",
  "Why am I lazy lately?",
];

function generateTruth(input: string) {
  const text = input.toLowerCase();

  if (text.includes("money") || text.includes("broke")) {
    return "You treat money like emotion instead of strategy.";
  }

  if (text.includes("lazy") || text.includes("discipline")) {
    return "You don’t need motivation. You need rules.";
  }

  if (text.includes("focus")) {
    return "Your attention is leaking into things that don’t matter.";
  }

  if (
    text.includes("relationship") ||
    text.includes("love") ||
    text.includes("dating")
  ) {
    return "You keep asking for clarity from people who enjoy confusion.";
  }

  if (text.includes("fear") || text.includes("anxious") || text.includes("anxiety")) {
    return "Your imagination is working harder than your courage.";
  }

  if (text.includes("overthink")) {
    return "Overthinking is hesitation wearing intelligent clothes.";
  }

  if (text.includes("win") || text.includes("losing") || text.includes("lose")) {
    return "You want the reward, but you still negotiate with the work.";
  }

  return "Your next level starts where your excuses end.";
}

function inferPatterns(input: string) {
  const text = input.toLowerCase();
  const patterns = new Set<string>();

  if (text.includes("overthink") || text.includes("anxious") || text.includes("fear")) {
    patterns.add("Overthinking");
  }

  if (
    text.includes("stuck") ||
    text.includes("hesitate") ||
    text.includes("hesitation") ||
    text.includes("wait") ||
    text.includes("win")
  ) {
    patterns.add("Hesitation");
  }

  if (
    text.includes("lazy") ||
    text.includes("discipline") ||
    text.includes("focus") ||
    text.includes("consistent") ||
    text.includes("consistency")
  ) {
    patterns.add("Untapped Discipline");
  }

  if (text.includes("money") || text.includes("broke")) {
    patterns.add("Emotional Spending");
  }

  if (text.includes("relationship") || text.includes("love") || text.includes("dating")) {
    patterns.add("Confused Standards");
  }

  const finalPatterns = Array.from(patterns);

  if (finalPatterns.length === 0) {
    return ["Overthinking", "Hesitation", "Untapped Discipline"];
  }

  return finalPatterns.slice(0, 3);
}

export default function MadMindPage() {
  const [input, setInput] = useState("");
  const [truth, setTruth] = useState("");
  const [count, setCount] = useState(33);
  const [demoIndex, setDemoIndex] = useState(0);
  const [patterns, setPatterns] = useState<string[]>([
    "Overthinking",
    "Hesitation",
    "Untapped Discipline",
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setDemoIndex((prev) => (prev + 1) % DEMOS.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  const level = Math.floor(count / 5) + 1;
  const progress = ((count % 5) / 5) * 100;

  function handleTruth() {
    const finalInput = input.trim() || PLACEHOLDERS[count % PLACEHOLDERS.length];
    const result = generateTruth(finalInput);

    setTruth(result);
    setPatterns(inferPatterns(finalInput));
    setCount((prev) => prev + 1);
  }

  return (
    <main className="min-h-screen bg-black text-white">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-white/10 bg-gradient-to-b from-red-950/40 via-black to-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,40,40,0.16),transparent_38%)]" />
        <div className="relative mx-auto max-w-5xl px-4 py-14 md:py-20">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-4 inline-flex rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.35em] text-red-300">
              MAD AI
            </div>

            <h1 className="mx-auto max-w-4xl text-5xl font-black leading-tight md:text-7xl">
              The Truth Machine.
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-lg text-white/65 md:text-xl">
              Brutally honest insight for discipline, money, fear, excuses,
              relationships, and growth.
            </p>

            <div className="mx-auto mt-10 max-w-2xl rounded-3xl border border-white/10 bg-white/5 p-3 shadow-2xl shadow-red-950/20">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={PLACEHOLDERS[count % PLACEHOLDERS.length]}
                className="mb-3 w-full rounded-2xl border border-white/10 bg-black/70 px-5 py-4 text-lg outline-none transition placeholder:text-white/30 focus:border-red-500/40"
              />

              <button
                onClick={handleTruth}
                className="w-full rounded-2xl bg-red-500 px-6 py-4 text-lg font-black text-black transition duration-200 hover:scale-[1.01] hover:bg-red-400 active:scale-[0.99]"
              >
                Tell Me The Truth
              </button>

              <div className="mt-3 text-sm text-white/45">
                Free • Instant • No Sign Up
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RESULT */}
      <section className="mx-auto max-w-5xl px-4 py-10 md:py-12">
        <div className="grid gap-6 md:grid-cols-[1.6fr_0.9fr]">
          <div className="rounded-3xl border border-red-500/20 bg-gradient-to-b from-red-950/25 to-black p-6">
            <div className="mb-3 text-xs uppercase tracking-[0.35em] text-red-300">
              Live Truth
            </div>

            {!truth ? (
              <div className="rounded-2xl border border-white/10 bg-black/40 p-6">
                <div className="text-sm text-white/45">Example prompt</div>
                <div className="mt-2 text-xl font-semibold text-white">
                  {DEMOS[demoIndex].q}
                </div>

                <div className="mt-6 text-sm text-white/45">MAD says</div>
                <div className="mt-2 text-3xl font-black leading-tight text-red-100">
                  {DEMOS[demoIndex].a}
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-red-500/20 bg-black/40 p-6">
                <div className="text-sm text-white/45">MAD says</div>
                <div className="mt-3 text-3xl font-black leading-tight text-red-100 md:text-4xl">
                  {truth}
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button className="rounded-full border border-red-500/30 px-4 py-2 text-sm text-white transition hover:border-red-400 hover:bg-red-500/10">
                    Harder
                  </button>
                  <button className="rounded-full border border-white/15 px-4 py-2 text-sm text-white transition hover:border-white/30 hover:bg-white/5">
                    Smarter
                  </button>
                  <button className="rounded-full border border-white/15 px-4 py-2 text-sm text-white transition hover:border-white/30 hover:bg-white/5">
                    Shorter
                  </button>
                  <button className="rounded-full border border-white/15 px-4 py-2 text-sm text-white transition hover:border-white/30 hover:bg-white/5">
                    Share
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
              <div className="text-xs uppercase tracking-[0.35em] text-white/45">
                Your Growth Level
              </div>

              <div className="mt-4 text-4xl font-black">Level {level}</div>

              <div className="mt-2 text-sm text-white/55">
                Truths Received: {count}
              </div>

              <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-red-500 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="mt-3 text-xs text-white/45">
                Savage Mode unlocks every 5 truths.
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
              <div className="text-xs uppercase tracking-[0.35em] text-white/45">
                What MAD Sees
              </div>

              <div className="mt-4 space-y-3 text-sm">
                {patterns.map((pattern) => (
                  <div
                    key={pattern}
                    className="rounded-2xl bg-white/5 px-4 py-3"
                  >
                    {pattern}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY IT HITS */}
      <section className="border-y border-white/10 bg-white/[0.02]">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-14 md:grid-cols-3">
          {[
            ["Brutal Honesty", "No fake motivation. Real signal only."],
            ["Fast Clarity", "One message can shift your direction."],
            ["Addictive Growth", "Each truth exposes another pattern."],
          ].map(([title, text]) => (
            <div
              key={title}
              className="rounded-3xl border border-white/10 bg-black/40 p-6"
            >
              <div className="text-xl font-black">{title}</div>
              <div className="mt-3 text-white/60">{text}</div>
            </div>
          ))}
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="mx-auto max-w-6xl px-4 py-14 md:py-16">
        <div className="mb-8 text-center text-3xl font-black">
          People Keep Coming Back.
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {[
            "This called me out bad.",
            "Why is this thing always right?",
            "Better than fake motivation.",
            "MAD just cooked me.",
          ].map((quote) => (
            <div
              key={quote}
              className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 text-white/80"
            >
              “{quote}”
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/10 bg-gradient-to-b from-black to-red-950/20">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center md:py-20">
          <h2 className="text-4xl font-black md:text-6xl">
            Ready for the truth?
          </h2>

          <p className="mt-4 text-white/60">
            Stop guessing. Start seeing clearly.
          </p>

          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="mt-8 rounded-2xl bg-red-500 px-8 py-4 text-lg font-black text-black transition duration-200 hover:scale-[1.03] hover:bg-red-400 active:scale-[0.99]"
          >
            Start Now
          </button>
        </div>
      </section>
    </main>
  );
}
