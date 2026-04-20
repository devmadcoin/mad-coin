"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

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

  if (text.includes("relationship") || text.includes("love")) {
    return "You keep asking for clarity from people who enjoy confusion.";
  }

  if (text.includes("fear") || text.includes("anxious")) {
    return "Your imagination is working harder than your courage.";
  }

  if (text.includes("overthink")) {
    return "Overthinking is hesitation wearing intelligent clothes.";
  }

  return "Your next level starts where your excuses end.";
}

export default function MadMindPage() {
  const [input, setInput] = useState("");
  const [truth, setTruth] = useState("");
  const [count, setCount] = useState(0);
  const [demoIndex, setDemoIndex] = useState(0);

  useMemo(() => {
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
    setCount((prev) => prev + 1);
  }

  return (
    <main className="min-h-screen bg-black text-white">
      {/* NAV */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500 text-xl font-black text-black">
              😡
            </div>
            <div>
              <div className="text-lg font-black">$MAD</div>
              <div className="text-[10px] uppercase tracking-[0.35em] text-white/50">
                Stay $MAD
              </div>
            </div>
          </Link>

          <nav className="hidden gap-6 text-sm text-white/70 md:flex">
            <Link href="/">Home</Link>
            <Link href="/roadmap">The Mad Path</Link>
            <Link href="/game">Game</Link>
            <Link href="/memes">$MAD Art</Link>
            <Link href="/merch">Merch</Link>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-white/10 bg-gradient-to-b from-red-950/40 via-black to-black">
        <div className="mx-auto max-w-5xl px-4 py-20 text-center">
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

          <div className="mx-auto mt-10 max-w-2xl rounded-3xl border border-white/10 bg-white/5 p-3 shadow-2xl">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={PLACEHOLDERS[count % PLACEHOLDERS.length]}
              className="mb-3 w-full rounded-2xl border border-white/10 bg-black/60 px-5 py-4 text-lg outline-none placeholder:text-white/30"
            />

            <button
              onClick={handleTruth}
              className="w-full rounded-2xl bg-red-500 px-6 py-4 text-lg font-black text-black transition hover:scale-[1.02] hover:bg-red-400"
            >
              🔥 Tell Me The Truth
            </button>

            <div className="mt-3 text-sm text-white/45">
              Free • Instant • No Sign Up
            </div>
          </div>
        </div>
      </section>

      {/* RESULT */}
      <section className="mx-auto max-w-5xl px-4 py-12">
        <div className="grid gap-6 md:grid-cols-[1.6fr_0.9fr]">
          {/* LEFT */}
          <div className="rounded-3xl border border-red-500/20 bg-gradient-to-b from-red-950/30 to-black p-6">
            <div className="mb-3 text-xs uppercase tracking-[0.35em] text-red-300">
              Live Truth
            </div>

            {!truth ? (
              <>
                <div className="text-sm text-white/50">Example:</div>
                <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-5">
                  <div className="text-sm text-white/45">
                    You asked:
                  </div>
                  <div className="mt-1 text-lg font-semibold">
                    {DEMOS[demoIndex].q}
                  </div>

                  <div className="mt-5 text-sm text-white/45">
                    MAD replied:
                  </div>
                  <div className="mt-1 text-2xl font-black text-red-200">
                    {DEMOS[demoIndex].a}
                  </div>
                </div>
              </>
            ) : (
              <div className="rounded-2xl border border-red-500/20 bg-black/40 p-6">
                <div className="text-sm text-white/45">MAD says:</div>
                <div className="mt-3 text-3xl font-black leading-tight text-red-100">
                  {truth}
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button className="rounded-full border border-red-500/30 px-4 py-2 text-sm">
                    🔥 Harder
                  </button>
                  <button className="rounded-full border border-white/15 px-4 py-2 text-sm">
                    🧠 Smarter
                  </button>
                  <button className="rounded-full border border-white/15 px-4 py-2 text-sm">
                    ✂️ Shorter
                  </button>
                  <button className="rounded-full border border-white/15 px-4 py-2 text-sm">
                    📤 Share
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT */}
          <div className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
              <div className="text-xs uppercase tracking-[0.35em] text-white/45">
                Your Growth Level
              </div>

              <div className="mt-4 text-4xl font-black">
                Level {level}
              </div>

              <div className="mt-2 text-sm text-white/55">
                Truths Received: {count}
              </div>

              <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-red-500 transition-all"
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
                <div className="rounded-2xl bg-white/5 px-4 py-3">
                  Overthinking
                </div>
                <div className="rounded-2xl bg-white/5 px-4 py-3">
                  Hesitation
                </div>
                <div className="rounded-2xl bg-white/5 px-4 py-3">
                  Untapped Discipline
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY PEOPLE LOVE IT */}
      <section className="border-y border-white/10 bg-white/[0.02]">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-16 md:grid-cols-3">
          {[
            ["Brutal Honesty", "No fake motivation. Real signal only."],
            ["Fast Clarity", "One message can shift your direction."],
            ["Addictive Growth", "Each truth reveals a pattern."],
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
      <section className="mx-auto max-w-6xl px-4 py-16">
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
        <div className="mx-auto max-w-4xl px-4 py-20 text-center">
          <h2 className="text-4xl font-black md:text-6xl">
            Ready for the truth?
          </h2>

          <p className="mt-4 text-white/60">
            Stop guessing. Start seeing clearly.
          </p>

          <button
            onClick={() =>
              window.scrollTo({ top: 0, behavior: "smooth" })
            }
            className="mt-8 rounded-2xl bg-red-500 px-8 py-4 text-lg font-black text-black transition hover:scale-105"
          >
            🔥 Start Now
          </button>
        </div>
      </section>
    </main>
  );
}
