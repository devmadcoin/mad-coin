"use client";

import { useEffect, useState } from "react";

type Demo = {
  q: string;
  a: string;
};

type ApiMeta = {
  intent?: string;
  states?: string[];
  escalation?: number;
  favoriteStyle?: string | null;
  multiOutput?: boolean;
  mood?: string;
  callback?: string | null;
  rarityHint?: "standard" | "rare" | "legendary";
  followUpBait?: string[];
};

type ApiResponse = {
  output?: string;
  outputs?: {
    safe?: string;
    savage?: string;
    crashout?: string;
  };
  meta?: ApiMeta;
  error?: string;
};

type StyleMode = "safe" | "savage" | "crashout";
type RefineMode = "harder" | "shorter" | "smarter" | "share";

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

function inferPatterns(input: string, apiStates?: string[]): string[] {
  if (apiStates && apiStates.length > 0) {
    return apiStates
      .map((state) =>
        state
          .toLowerCase()
          .replace(/_/g, " ")
          .replace(/\b\w/g, (char) => char.toUpperCase()),
      )
      .slice(0, 3);
  }

  const text = input.toLowerCase();
  const patterns = new Set<string>();

  if (
    text.includes("overthink") ||
    text.includes("anxious") ||
    text.includes("fear")
  ) {
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

  if (
    text.includes("relationship") ||
    text.includes("love") ||
    text.includes("dating")
  ) {
    patterns.add("Confused Standards");
  }

  const finalPatterns = Array.from(patterns);

  return finalPatterns.length > 0
    ? finalPatterns.slice(0, 3)
    : ["Overthinking", "Hesitation", "Untapped Discipline"];
}

function rarityLabel(rarity?: "standard" | "rare" | "legendary"): string {
  if (rarity === "legendary") return "Legendary";
  if (rarity === "rare") return "Rare";
  return "Standard";
}

function getCookLevel(style: StyleMode): "mild" | "crashout" | "demon" {
  if (style === "safe") return "mild";
  if (style === "crashout") return "demon";
  return "crashout";
}

function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "web-user";

  const existing = window.localStorage.getItem("madmind_session_id");
  if (existing) return existing;

  const next = `mad-${Math.random().toString(36).slice(2, 10)}`;
  window.localStorage.setItem("madmind_session_id", next);
  return next;
}

async function shareOrCopy(text: string): Promise<void> {
  try {
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      await navigator.share({ text });
      return;
    }
  } catch {
    // fall through to clipboard
  }

  try {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(text);
    }
  } catch {
    // no-op
  }
}

export default function MadMindPage() {
  const [input, setInput] = useState<string>("");
  const [truth, setTruth] = useState<string>("");
  const [count, setCount] = useState<number>(0);
  const [demoIndex, setDemoIndex] = useState<number>(0);
  const [patterns, setPatterns] = useState<string[]>([
    "Overthinking",
    "Hesitation",
    "Untapped Discipline",
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [meta, setMeta] = useState<ApiMeta | null>(null);
  const [lastPrompt, setLastPrompt] = useState<string>("");
  const [currentStyle, setCurrentStyle] = useState<StyleMode>("savage");
  const [sessionId, setSessionId] = useState<string>("web-user");

  useEffect(() => {
    setSessionId(getOrCreateSessionId());
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setDemoIndex((prev) => (prev + 1) % DEMOS.length);
    }, 4000);

    return () => window.clearInterval(timer);
  }, []);

  const level = Math.floor(count / 5) + 1;
  const progress = ((count % 5) / 5) * 100;

  async function askMad(
    messageOverride?: string,
    styleOverride?: StyleMode,
  ): Promise<void> {
    const finalInput =
      (messageOverride ?? input).trim() ||
      PLACEHOLDERS[count % PLACEHOLDERS.length];

    if (!finalInput || isLoading) return;

    const styleToUse = styleOverride ?? currentStyle;

    setIsLoading(true);
    setLastPrompt(finalInput);

    try {
      const response = await fetch("/api/mad-mind", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: finalInput,
          sessionId,
          cookLevel: getCookLevel(styleToUse),
          preferredStyle: styleToUse,
          multiOutput: false,
        }),
      });

      let data: ApiResponse | null = null;

      try {
        data = (await response.json()) as ApiResponse;
      } catch {
        data = null;
      }

      if (!response.ok) {
        const errorMessage =
          data?.output || data?.error || `Request failed (${response.status})`;

        setTruth(errorMessage);
        setMeta(data?.meta ?? null);
        setPatterns(inferPatterns(finalInput, data?.meta?.states));
        return;
      }

      const nextTruth =
        data?.output?.trim() || data?.error || "Signal broke.";

      setTruth(nextTruth);
      setMeta(data?.meta ?? null);
      setPatterns(inferPatterns(finalInput, data?.meta?.states));
      setCount((prev) => prev + 1);
    } catch {
      setTruth("Could not reach MAD.");
      setMeta(null);
      setPatterns(inferPatterns(finalInput));
    } finally {
      setIsLoading(false);
    }
  }

  async function handleRefine(refinement: RefineMode): Promise<void> {
    if (!truth && !lastPrompt) return;

    if (refinement === "share") {
      await shareOrCopy(truth || "MAD says the truth hurts.");
      return;
    }

    const base =
      lastPrompt || input || PLACEHOLDERS[count % PLACEHOLDERS.length];

    const mapped =
      refinement === "harder"
        ? `${base} go harder`
        : refinement === "shorter"
          ? `${base} make it shorter`
          : `${base} make it smarter`;

    await askMad(mapped);
  }

  return (
    <main className="min-h-screen bg-black text-white">
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
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    void askMad();
                  }
                }}
                placeholder={PLACEHOLDERS[count % PLACEHOLDERS.length]}
                className="mb-3 w-full rounded-2xl border border-white/10 bg-black/70 px-5 py-4 text-lg outline-none transition placeholder:text-white/30 focus:border-red-500/40"
              />

              <button
                type="button"
                onClick={() => void askMad()}
                disabled={isLoading}
                className="w-full rounded-2xl bg-red-500 px-6 py-4 text-lg font-black text-black transition duration-200 hover:scale-[1.01] hover:bg-red-400 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isLoading ? "MAD is reading you..." : "Tell Me The Truth"}
              </button>

              <div className="mt-3 text-sm text-white/45">
                Free • Instant • No Sign Up
              </div>

              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {(["safe", "savage", "crashout"] as const).map((style) => (
                  <button
                    key={style}
                    type="button"
                    onClick={() => setCurrentStyle(style)}
                    className={`rounded-full border px-3 py-1.5 text-xs uppercase tracking-[0.2em] transition ${
                      currentStyle === style
                        ? "border-red-500/40 bg-red-500/10 text-red-200"
                        : "border-white/10 bg-white/[0.03] text-white/55 hover:border-white/20 hover:text-white"
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

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
                <div className="flex flex-wrap items-center gap-2 text-sm text-white/45">
                  <span>MAD says</span>
                  {meta?.intent ? (
                    <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] uppercase tracking-[0.18em] text-white/65">
                      {meta.intent}
                    </span>
                  ) : null}
                  {meta?.rarityHint ? (
                    <span className="rounded-full border border-red-500/20 bg-red-500/10 px-2.5 py-1 text-[11px] uppercase tracking-[0.18em] text-red-200">
                      {rarityLabel(meta.rarityHint)}
                    </span>
                  ) : null}
                </div>

                <div className="mt-3 whitespace-pre-wrap text-3xl font-black leading-tight text-red-100 md:text-4xl">
                  {truth}
                </div>

                {meta?.callback ? (
                  <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/60">
                    {meta.callback}
                  </div>
                ) : null}

                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => void handleRefine("harder")}
                    disabled={isLoading}
                    className="rounded-full border border-red-500/30 px-4 py-2 text-sm text-white transition hover:border-red-400 hover:bg-red-500/10 disabled:opacity-60"
                  >
                    Harder
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleRefine("smarter")}
                    disabled={isLoading}
                    className="rounded-full border border-white/15 px-4 py-2 text-sm text-white transition hover:border-white/30 hover:bg-white/5 disabled:opacity-60"
                  >
                    Smarter
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleRefine("shorter")}
                    disabled={isLoading}
                    className="rounded-full border border-white/15 px-4 py-2 text-sm text-white transition hover:border-white/30 hover:bg-white/5 disabled:opacity-60"
                  >
                    Shorter
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleRefine("share")}
                    className="rounded-full border border-white/15 px-4 py-2 text-sm text-white transition hover:border-white/30 hover:bg-white/5"
                  >
                    Share
                  </button>
                </div>

                {meta?.followUpBait?.length ? (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {meta.followUpBait.slice(0, 3).map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => {
                          setInput(item);
                          void askMad(item);
                        }}
                        disabled={isLoading}
                        className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-white/70 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white disabled:opacity-60"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                ) : null}
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

              {meta?.mood ? (
                <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/60">
                  Mood:{" "}
                  <span className="text-white">
                    {meta.mood.charAt(0).toUpperCase() + meta.mood.slice(1)}
                  </span>
                </div>
              ) : null}
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

      <section className="border-t border-white/10 bg-gradient-to-b from-black to-red-950/20">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center md:py-20">
          <h2 className="text-4xl font-black md:text-6xl">
            Ready for the truth?
          </h2>

          <p className="mt-4 text-white/60">
            Stop guessing. Start seeing clearly.
          </p>

          <button
            type="button"
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
