"use client";

import { useEffect, useRef, useState } from "react";

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
  lattice?: string[];
};

type OutputVariants = {
  safe?: string;
  savage?: string;
  crashout?: string;
};

type ApiResponse = {
  output?: string;
  outputs?: OutputVariants;
  meta?: ApiMeta;
  error?: string;
};

type StyleMode = "safe" | "savage" | "crashout";
type ChatRole = "user" | "mad";

type ChatMessage = {
  id: string;
  role: ChatRole;
  text: string;
  meta?: ApiMeta | null;
  outputs?: OutputVariants | null;
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
    q: "Why am I stuck?",
    a: "Because thinking became your replacement for moving.",
  },
];

const PLACEHOLDERS = [
  "Ask what others avoid...",
  "Why am I stuck?",
  "What’s my real problem?",
  "Why do I keep hesitating?",
];

function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "web-user";

  const existing = window.localStorage.getItem("madmind_session_id");
  if (existing) return existing;

  const next = `mad-${Math.random().toString(36).slice(2, 10)}`;
  window.localStorage.setItem("madmind_session_id", next);
  return next;
}

function getCookLevel(style: StyleMode): "mild" | "crashout" | "demon" {
  if (style === "safe") return "mild";
  if (style === "crashout") return "demon";
  return "crashout";
}

function formatTag(value: string): string {
  return value
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function inferPatterns(input: string, apiStates?: string[]): string[] {
  if (apiStates?.length) return apiStates.map(formatTag).slice(0, 3);

  const text = input.toLowerCase();
  const tags = new Set<string>();

  if (
    text.includes("overthink") ||
    text.includes("anxious") ||
    text.includes("fear")
  ) {
    tags.add("Overthinking");
  }

  if (
    text.includes("stuck") ||
    text.includes("hesitate") ||
    text.includes("wait")
  ) {
    tags.add("Hesitation");
  }

  if (
    text.includes("discipline") ||
    text.includes("lazy") ||
    text.includes("focus")
  ) {
    tags.add("Untapped Discipline");
  }

  return Array.from(tags).slice(0, 3);
}

async function shareOrCopy(text: string): Promise<boolean> {
  try {
    if (typeof navigator !== "undefined" && navigator.share) {
      await navigator.share({ text });
      return true;
    }
  } catch {
    // fall through
  }

  try {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // no-op
  }

  return false;
}

function messageId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export default function MadMindPage() {
  const [input, setInput] = useState("");
  const [style, setStyle] = useState<StyleMode>("savage");
  const [sessionId, setSessionId] = useState("web-user");
  const [isLoading, setIsLoading] = useState(false);
  const [shareMessage, setShareMessage] = useState("");
  const [count, setCount] = useState(0);
  const [patterns, setPatterns] = useState<string[]>([
    "Overthinking",
    "Hesitation",
    "Untapped Discipline",
  ]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [demoIndex, setDemoIndex] = useState(0);

  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setSessionId(getOrCreateSessionId());
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setDemoIndex((prev) => (prev + 1) % DEMOS.length);
    }, 3500);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!shareMessage) return;
    const timer = window.setTimeout(() => setShareMessage(""), 1600);
    return () => window.clearTimeout(timer);
  }, [shareMessage]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isLoading]);

  const latestMad = [...messages].reverse().find((m) => m.role === "mad");
  const latestMeta = latestMad?.meta ?? null;
  const level = Math.floor(count / 5) + 1;
  const progress = ((count % 5) / 5) * 100;

  async function sendMessage(messageOverride?: string) {
    const text =
      (messageOverride ?? input).trim() ||
      PLACEHOLDERS[count % PLACEHOLDERS.length];

    if (!text || isLoading) return;

    const userMessage: ChatMessage = {
      id: messageId(),
      role: "user",
      text,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setShareMessage("");

    try {
      const response = await fetch("/api/mad-mind", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text,
          sessionId,
          cookLevel: getCookLevel(style),
          preferredStyle: style,
          multiOutput: false,
        }),
      });

      let data: ApiResponse | null = null;

      try {
        data = (await response.json()) as ApiResponse;
      } catch {
        data = null;
      }

      const botText = response.ok
        ? data?.output?.trim() || data?.error || "Signal broke."
        : data?.output || data?.error || `Request failed (${response.status})`;

      const madMessage: ChatMessage = {
        id: messageId(),
        role: "mad",
        text: botText,
        meta: data?.meta ?? null,
        outputs: data?.outputs ?? null,
      };

      setMessages((prev) => [...prev, madMessage]);
      setPatterns(inferPatterns(text, data?.meta?.states));
      setCount((prev) => prev + 1);
    } catch {
      const madMessage: ChatMessage = {
        id: messageId(),
        role: "mad",
        text: "Could not reach MAD.",
        meta: null,
      };

      setMessages((prev) => [...prev, madMessage]);
      setPatterns(inferPatterns(text));
    } finally {
      setIsLoading(false);
    }
  }

  async function handleQuickReply(type: "harder" | "smarter" | "shorter") {
    const lastUser = [...messages].reverse().find((m) => m.role === "user")?.text;
    if (!lastUser) return;

    const mapped =
      type === "harder"
        ? `${lastUser} go harder`
        : type === "shorter"
          ? `${lastUser} make it shorter`
          : `${lastUser} make it smarter`;

    await sendMessage(mapped);
  }

  async function handleShare() {
    if (!latestMad?.text) return;
    const didShare = await shareOrCopy(latestMad.text);
    setShareMessage(didShare ? "Copied." : "Could not share.");
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="relative border-b border-white/10 bg-gradient-to-b from-red-950/40 via-black to-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,40,40,0.16),transparent_38%)]" />
        <div className="relative mx-auto max-w-6xl px-4 py-10 md:py-14">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 inline-flex rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.35em] text-red-300">
              MAD AI
            </div>

            <h1 className="text-5xl font-black leading-tight md:text-7xl">
              The Truth Machine.
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-lg text-white/65 md:text-xl">
              A chat that tells you what you need to hear, not what you want to hear.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-6 lg:grid-cols-[1.45fr_0.8fr]">
        <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] shadow-[0_18px_50px_rgba(0,0,0,0.35)]">
          <div className="border-b border-white/10 px-5 py-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-sm font-black uppercase tracking-[0.28em] text-red-300">
                  Live Chat
                </div>
                <div className="mt-1 text-sm text-white/50">
                  {messages.length === 0
                    ? `Example: ${DEMOS[demoIndex].q}`
                    : "Every message reveals how you think."}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {(["safe", "savage", "crashout"] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setStyle(mode)}
                    className={`rounded-full border px-3 py-1.5 text-xs uppercase tracking-[0.2em] transition ${
                      style === mode
                        ? "border-red-500/40 bg-red-500/10 text-red-200"
                        : "border-white/10 bg-white/[0.03] text-white/55 hover:border-white/20 hover:text-white"
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div
            ref={scrollRef}
            className="h-[62vh] min-h-[480px] space-y-4 overflow-y-auto px-4 py-4 md:px-5"
          >
            {messages.length === 0 ? (
              <div className="flex h-full items-center justify-center">
                <div className="max-w-xl rounded-[1.8rem] border border-white/10 bg-black/30 p-6 text-center">
                  <div className="text-sm uppercase tracking-[0.24em] text-white/35">
                    MAD says
                  </div>
                  <div className="mt-3 text-2xl font-black leading-tight text-red-100">
                    {DEMOS[demoIndex].a}
                  </div>
                  <div className="mt-4 text-sm text-white/40">
                    Ask what others avoid.
                  </div>
                </div>
              </div>
            ) : (
              messages.map((message) => {
                const isUser = message.role === "user";

                return (
                  <div
                    key={message.id}
                    className={isUser ? "flex justify-end" : "flex justify-start"}
                  >
                    <div
                      className={
                        isUser
                          ? "max-w-[82%] rounded-[1.6rem] border border-white/10 bg-[#141414] px-5 py-4 text-white"
                          : "max-w-[88%] rounded-[1.6rem] border border-red-500/20 bg-[linear-gradient(180deg,rgba(70,0,0,0.22),rgba(0,0,0,0.38))] px-5 py-4 text-red-50"
                      }
                    >
                      <div
                        className={
                          isUser
                            ? "text-xs uppercase tracking-[0.2em] text-white/35"
                            : "flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.2em] text-red-200/70"
                        }
                      >
                        {isUser ? (
                          "You"
                        ) : (
                          <>
                            <span>MAD</span>
                            {message.meta?.intent ? (
                              <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-1 text-[10px] tracking-[0.18em] text-white/60">
                                {message.meta.intent}
                              </span>
                            ) : null}
                          </>
                        )}
                      </div>

                      <div
                        className={
                          isUser
                            ? "mt-2 text-base leading-7 text-white/85"
                            : "mt-3 whitespace-pre-wrap text-2xl font-black leading-tight text-red-100 md:text-3xl"
                        }
                      >
                        {message.text}
                      </div>

                      {!isUser && message.meta?.callback ? (
                        <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/60">
                          {message.meta.callback}
                        </div>
                      ) : null}

                      {!isUser && message.meta?.followUpBait?.length ? (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {message.meta.followUpBait.slice(0, 3).map((item) => (
                            <button
                              key={item}
                              type="button"
                              onClick={() => {
                                setInput(item);
                                void sendMessage(item);
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
                  </div>
                );
              })
            )}

            {isLoading ? (
              <div className="flex justify-start">
                <div className="max-w-[88%] rounded-[1.6rem] border border-red-500/20 bg-[linear-gradient(180deg,rgba(70,0,0,0.22),rgba(0,0,0,0.38))] px-5 py-4 text-red-50">
                  <div className="text-xs uppercase tracking-[0.2em] text-red-200/70">
                    MAD
                  </div>
                  <div className="mt-3 text-lg font-black text-red-100">
                    MAD is reading you...
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          <div className="border-t border-white/10 px-4 py-4 md:px-5">
            <div className="mb-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => void handleQuickReply("harder")}
                disabled={isLoading || messages.length === 0}
                className="rounded-full border border-red-500/30 px-4 py-2 text-sm text-white transition hover:border-red-400 hover:bg-red-500/10 disabled:opacity-50"
              >
                Harder
              </button>
              <button
                type="button"
                onClick={() => void handleQuickReply("smarter")}
                disabled={isLoading || messages.length === 0}
                className="rounded-full border border-white/15 px-4 py-2 text-sm text-white transition hover:border-white/30 hover:bg-white/5 disabled:opacity-50"
              >
                Smarter
              </button>
              <button
                type="button"
                onClick={() => void handleQuickReply("shorter")}
                disabled={isLoading || messages.length === 0}
                className="rounded-full border border-white/15 px-4 py-2 text-sm text-white transition hover:border-white/30 hover:bg-white/5 disabled:opacity-50"
              >
                Shorter
              </button>
              <button
                type="button"
                onClick={() => void handleShare()}
                disabled={messages.length === 0}
                className="rounded-full border border-white/15 px-4 py-2 text-sm text-white transition hover:border-white/30 hover:bg-white/5 disabled:opacity-50"
              >
                Share
              </button>
              {shareMessage ? (
                <div className="self-center text-sm text-red-200">{shareMessage}</div>
              ) : null}
            </div>

            <div className="flex gap-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    void sendMessage();
                  }
                }}
                placeholder={PLACEHOLDERS[count % PLACEHOLDERS.length]}
                className="flex-1 rounded-2xl border border-white/10 bg-black/70 px-5 py-4 text-base outline-none transition placeholder:text-white/30 focus:border-red-500/40"
              />
              <button
                type="button"
                onClick={() => void sendMessage()}
                disabled={isLoading}
                className="rounded-2xl bg-red-500 px-6 py-4 text-base font-black text-black transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-70"
              >
                Send
              </button>
            </div>
          </div>
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

            {latestMeta?.mood ? (
              <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/60">
                Mood: <span className="text-white">{formatTag(latestMeta.mood)}</span>
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </main>
  );
}
