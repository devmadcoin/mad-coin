"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useCallback } from "react";

const MAD_HEAD_IMAGE = "/MAD-MIND-HEAD.png";

function useInView(options?: IntersectionObserverInit) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, ...options }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [options]);

  return { ref, isInView };
}

function FadeIn({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const { ref, isInView } = useInView();

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isInView ? 1 : 0,
        transform: isInView ? "translateY(0)" : "translateY(28px)",
        transition: `opacity .6s cubic-bezier(.22,1,.36,1) ${delay}s, transform .6s cubic-bezier(.22,1,.36,1) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

function GlowPulse({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ animation: "glowPulse 3s ease-in-out infinite" }}>
      {children}
      <style>{`
        @keyframes glowPulse {
          0%,100% { box-shadow: 0 0 25px rgba(255,0,0,.12); }
          50% { box-shadow: 0 0 45px rgba(255,0,0,.28); }
        }
      `}</style>
    </div>
  );
}

function HoverLift({ children }: { children: React.ReactNode }) {
  return <div className="transition-transform duration-300 hover:-translate-y-1">{children}</div>;
}

function useTypewriter(text: string, speed = 24, enabled = true) {
  const [displayed, setDisplayed] = useState(enabled ? "" : text);
  const [done, setDone] = useState(!enabled);

  useEffect(() => {
    if (!enabled) {
      setDisplayed(text);
      setDone(true);
      return;
    }

    setDisplayed("");
    setDone(false);

    let i = 0;
    const timer = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));

      if (i >= text.length) {
        clearInterval(timer);
        setDone(true);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed, enabled]);

  return { displayed, done };
}

type ApiMeta = {
  intent?: string;
  states?: string[];
  mood?: string;
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
  isNew?: boolean;
};

const PLACEHOLDERS = [
  "Why do I keep hesitating?",
  "What is really holding me back?",
  "Why do I keep losing focus?",
  "What truth am I avoiding?",
];

const SUGGESTED_PROMPTS = [
  "Why do I procrastinate?",
  "Why am I broke?",
  "Why can't I focus?",
  "Why do I fear failure?",
];

const WELCOME_MESSAGES: ChatMessage[] = [
  {
    id: "welcome-user-1",
    role: "user",
    text: "Why do I keep making the same mistakes?",
  },
  {
    id: "welcome-mad-1",
    role: "mad",
    text: "Because you keep calling the pattern a lesson, then repeating it like a subscription. The problem is not knowledge. It is discipline.",
    meta: { intent: "pattern-expose", mood: "direct" },
  },
  {
    id: "welcome-user-2",
    role: "user",
    text: "How do I actually change?",
  },
  {
    id: "welcome-mad-2",
    role: "mad",
    text: "Stop waiting to feel ready. Ready is a costume fear wears when it wants more time. Move first. The feeling catches up later.",
    meta: { intent: "reframe", mood: "savage" },
  },
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
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function inferPatterns(input: string, apiStates?: string[]): string[] {
  if (apiStates?.length) return apiStates.map(formatTag).slice(0, 3);

  const text = input.toLowerCase();
  const tags = new Set<string>();

  if (text.includes("focus") || text.includes("distracted")) tags.add("Discipline");
  if (text.includes("fear") || text.includes("failure")) tags.add("Fear Loop");
  if (text.includes("broke") || text.includes("money")) tags.add("Money Pressure");
  if (text.includes("stuck") || text.includes("hesitate")) tags.add("Hesitation");
  if (text.includes("lazy") || text.includes("procrastinate")) tags.add("Comfort Addiction");

  return Array.from(tags).slice(0, 3);
}

function messageId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function AmbientBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,40,40,0.12),transparent_45%),radial-gradient(circle_at_80%_20%,rgba(255,90,0,0.06),transparent_35%),linear-gradient(180deg,#030303,#050505)]" />
      <div
        className="absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-red-500/[0.035] blur-[130px] animate-pulse"
        style={{ animationDuration: "8s" }}
      />
    </div>
  );
}

function StyleSelector({
  style,
  onChange,
}: {
  style: StyleMode;
  onChange: (s: StyleMode) => void;
}) {
  const modes = [
    { key: "safe" as const, label: "Safe", desc: "Gentle", color: "text-green-300", border: "border-green-500/30", bg: "bg-green-500/10" },
    { key: "savage" as const, label: "Savage", desc: "Raw", color: "text-red-300", border: "border-red-500/30", bg: "bg-red-500/10" },
    { key: "crashout" as const, label: "Crashout", desc: "Brutal", color: "text-orange-300", border: "border-orange-500/30", bg: "bg-orange-500/10" },
  ];

  return (
    <div className="flex gap-2 rounded-2xl border border-white/10 bg-white/[0.03] p-1.5">
      {modes.map((m) => (
        <button
          key={m.key}
          onClick={() => onChange(m.key)}
          className={`relative flex-1 rounded-xl px-4 py-3 text-center transition-all ${
            style === m.key
              ? `${m.bg} ${m.border} border`
              : "border border-transparent hover:border-white/10 hover:bg-white/[0.03]"
          }`}
        >
          <div className={`text-sm font-black uppercase tracking-wider ${style === m.key ? m.color : "text-white/50"}`}>
            {m.label}
          </div>
          <div className="mt-0.5 text-[10px] text-white/30">{m.desc}</div>
        </button>
      ))}
    </div>
  );
}

function MadHeadHero() {
  return (
    <div className="relative mx-auto mt-10 h-[280px] w-full max-w-[440px] md:mt-0 md:h-[420px]">
      <div className="absolute inset-8 rounded-full bg-red-500/20 blur-[90px]" />
      <div className="absolute inset-0 rounded-[3rem] border border-red-500/10 bg-[radial-gradient(circle_at_center,rgba(255,0,0,.14),transparent_60%)]" />
      <Image
        src={MAD_HEAD_IMAGE}
        alt="MAD Mind AI fiery brain"
        fill
        priority
        className="object-contain drop-shadow-[0_0_45px_rgba(255,0,0,.35)]"
      />
    </div>
  );
}

function LuxuryLoading() {
  return (
    <div className="flex justify-start">
      <div className="max-w-[88%] rounded-[1.6rem] border border-red-500/20 bg-[linear-gradient(180deg,rgba(70,0,0,.22),rgba(0,0,0,.38))] px-6 py-5 text-red-50">
        <div className="mb-3 flex items-center gap-3">
          <div className="relative h-12 w-12">
            <div className="absolute inset-0 rounded-full bg-red-500/15 blur-md" />
            <Image
              src={MAD_HEAD_IMAGE}
              alt="MAD thinking"
              fill
              className="animate-pulse object-contain"
            />
          </div>
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-red-200/70">
            MAD is reading your signal
          </span>
        </div>

        <div className="h-1.5 w-48 overflow-hidden rounded-full bg-white/10">
          <div className="h-full w-[60%] animate-pulse rounded-full bg-red-500/60" />
        </div>
      </div>
    </div>
  );
}

function MessageCard({
  message,
  isLatest,
}: {
  message: ChatMessage;
  isLatest: boolean;
}) {
  const isUser = message.role === "user";
  const isWelcome = message.id.startsWith("welcome-");

  const { displayed, done } = useTypewriter(
    message.text,
    24,
    isLatest && !isUser && !isWelcome && message.isNew
  );

  return (
    <div className={isUser ? "flex justify-end" : "flex justify-start"}>
      <div
        className={
          isUser
            ? "max-w-[82%] rounded-[1.6rem] border border-white/10 bg-[#151515] px-5 py-4 text-white shadow-lg"
            : "max-w-[88%] rounded-[1.6rem] border border-red-500/20 bg-[linear-gradient(180deg,rgba(70,0,0,.18),rgba(0,0,0,.35))] px-5 py-5 text-red-50 shadow-[0_8px_32px_rgba(255,0,0,.08)]"
        }
      >
        <div
          className={
            isUser
              ? "mb-2 text-xs uppercase tracking-[0.2em] text-white/35"
              : "mb-3 flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.2em] text-red-200/70"
          }
        >
          {isUser ? (
            "You"
          ) : (
            <>
              <span className="font-bold">MAD</span>
              {message.meta?.intent && (
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-1 text-[10px] tracking-[0.18em] text-white/45">
                  {message.meta.intent}
                </span>
              )}
              {isWelcome && (
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-1 text-[10px] tracking-[0.18em] text-white/35">
                  Example
                </span>
              )}
            </>
          )}
        </div>

        <div
          className={
            isUser
              ? "text-base leading-7 text-white/85"
              : "whitespace-pre-wrap text-2xl font-black leading-tight text-red-100 md:text-3xl"
          }
        >
          {isUser ? message.text : displayed}
          {!done && isLatest && !isWelcome && (
            <span className="ml-1 inline-block h-6 w-1 animate-pulse bg-red-400" />
          )}
        </div>
      </div>
    </div>
  );
}

function GrowthCard({ count }: { count: number }) {
  const level = Math.floor(count / 5) + 1;
  const progress = ((count % 5) / 5) * 100;

  return (
    <HoverLift>
      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <div className="mb-1 text-xs uppercase tracking-[0.35em] text-white/45">
          Your Growth Level
        </div>
        <div className="mt-3 text-5xl font-black text-white">Lv.{level}</div>
        <div className="mt-1 text-sm text-white/50">{count} truths received</div>

        <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-red-500 transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="mt-3 text-xs text-white/40">
          Next level every 5 truths
        </div>
      </div>
    </HoverLift>
  );
}

function PatternCard({
  patterns,
  mood,
}: {
  patterns: string[];
  mood?: string;
}) {
  return (
    <HoverLift>
      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <div className="mb-4 text-xs uppercase tracking-[0.35em] text-white/45">
          What MAD Sees
        </div>

        <div className="space-y-3">
          {patterns.length ? (
            patterns.map((pattern) => (
              <div
                key={pattern}
                className="flex items-center gap-3 rounded-2xl bg-white/5 px-4 py-3"
              >
                <span className="h-2 w-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(255,0,0,.4)]" />
                <span className="text-sm font-medium text-white/70">
                  {pattern}
                </span>
              </div>
            ))
          ) : (
            <div className="rounded-2xl bg-white/5 px-4 py-3 text-sm text-white/45">
              Ask something real. MAD will find the pattern.
            </div>
          )}
        </div>

        {mood && (
          <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm">
            <span className="text-white/40">Mood:</span>{" "}
            <span className="font-bold text-white">{formatTag(mood)}</span>
          </div>
        )}
      </div>
    </HoverLift>
  );
}

export default function MadMindPage() {
  const [input, setInput] = useState("");
  const [style, setStyle] = useState<StyleMode>("savage");
  const [sessionId, setSessionId] = useState("web-user");
  const [isLoading, setIsLoading] = useState(false);
  const [count, setCount] = useState(2);
  const [patterns, setPatterns] = useState<string[]>([
    "Pattern Repeats",
    "Comfort Addiction",
    "Avoidance",
  ]);
  const [messages, setMessages] = useState<ChatMessage[]>(WELCOME_MESSAGES);

  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setSessionId(getOrCreateSessionId());
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isLoading]);

  const latestMad = [...messages].reverse().find((m) => m.role === "mad");
  const latestMeta = latestMad?.meta ?? null;
  const hasOnlyWelcome = messages.length <= WELCOME_MESSAGES.length;

  const sendMessage = useCallback(
    async (messageOverride?: string) => {
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

      try {
        const response = await fetch("/api/mad-mind", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: text,
            sessionId,
            cookLevel: getCookLevel(style),
            preferredStyle: style,
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
          isNew: true,
        };

        setMessages((prev) => [...prev, madMessage]);
        setPatterns(inferPatterns(text, data?.meta?.states));
        setCount((prev) => prev + 1);
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            id: messageId(),
            role: "mad",
            text: "Could not reach MAD.",
            meta: null,
            isNew: true,
          },
        ]);
        setPatterns(inferPatterns(text));
      } finally {
        setIsLoading(false);
      }
    },
    [input, isLoading, count, sessionId, style]
  );

  const handlePromptClick = useCallback(
    (prompt: string) => {
      setInput(prompt);
      void sendMessage(prompt);
    },
    [sendMessage]
  );

  return (
    <main className="min-h-screen bg-[#030303] text-white">
      <AmbientBackground />

      <FadeIn>
        <section className="relative overflow-hidden border-b border-white/[0.08] pb-12 pt-16 md:pb-16 md:pt-24">
          <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 md:grid-cols-[1.05fr_.95fr]">
            <div className="text-center md:text-left">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-red-500/25 bg-red-500/10 px-5 py-2.5">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
                </span>
                <span className="text-xs font-bold uppercase tracking-[0.3em] text-red-300">
                  MAD AI is Live
                </span>
              </div>

              <h1 className="text-6xl font-black leading-[0.9] tracking-tight text-white sm:text-7xl md:text-8xl">
                The Truth
                <br />
                <span className="text-red-500 drop-shadow-[0_0_30px_rgba(255,0,0,.35)]">
                  Machine.
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-lg text-white/50 md:text-xl">
                A chat that tells you what you need to hear. Not what you want to hear.
              </p>

              <div className="mt-7 flex flex-wrap justify-center gap-3 md:justify-start">
                <div className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-white/55">
                  Pattern Reader
                </div>
                <div className="rounded-full border border-red-500/20 bg-red-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-red-200">
                  Pressure Engine
                </div>
              </div>
            </div>

            <MadHeadHero />
          </div>
        </section>
      </FadeIn>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-8 lg:grid-cols-[1.4fr_0.75fr]">
        <FadeIn delay={0.1}>
          <div className="overflow-hidden rounded-[2.2rem] border border-white/[0.08] bg-white/[0.02] shadow-[0_18px_60px_rgba(0,0,0,.45)] backdrop-blur-sm">
            <div className="border-b border-white/[0.08] px-6 py-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-black uppercase tracking-[0.28em] text-red-300/80">
                    Live Chat
                  </div>
                  <div className="mt-1 text-sm text-white/40">
                    {hasOnlyWelcome
                      ? "Example conversation loaded"
                      : `${messages.length} messages`}
                  </div>
                </div>

                <StyleSelector style={style} onChange={setStyle} />
              </div>
            </div>

            <div
              ref={scrollRef}
              className="h-[58vh] min-h-[420px] space-y-5 overflow-y-auto px-5 py-5"
            >
              {messages.map((message, idx) => (
                <MessageCard
                  key={message.id}
                  message={message}
                  isLatest={idx === messages.length - 1}
                />
              ))}

              {isLoading && <LuxuryLoading />}
            </div>

            <div className="border-t border-white/[0.08] px-5 py-5">
              {!isLoading && hasOnlyWelcome && (
                <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
                  {SUGGESTED_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => handlePromptClick(prompt)}
                      className="shrink-0 rounded-full border border-white/[0.06] bg-white/[0.02] px-4 py-2 text-xs text-white/40 transition hover:border-red-500/20 hover:text-red-200"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              )}

              <div className="flex gap-3">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") void sendMessage();
                  }}
                  placeholder={PLACEHOLDERS[count % PLACEHOLDERS.length]}
                  className="flex-1 rounded-2xl border border-white/[0.08] bg-black/60 px-6 py-4 text-base outline-none transition placeholder:text-white/25 focus:border-red-500/40 focus:bg-black/80 focus:shadow-[0_0_20px_rgba(255,0,0,.1)]"
                />

                <GlowPulse>
                  <button
                    onClick={() => void sendMessage()}
                    disabled={isLoading}
                    className="rounded-2xl bg-red-500 px-7 py-4 text-base font-black text-black transition hover:bg-red-400 disabled:opacity-60"
                  >
                    Send
                  </button>
                </GlowPulse>
              </div>
            </div>
          </div>
        </FadeIn>

        <div className="space-y-5">
          <FadeIn delay={0.2}>
            <GrowthCard count={count} />
          </FadeIn>

          <FadeIn delay={0.25}>
            <PatternCard patterns={patterns} mood={latestMeta?.mood} />
          </FadeIn>

          <FadeIn delay={0.3}>
            <HoverLift>
              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                <div className="mb-3 text-xs uppercase tracking-[0.35em] text-white/45">
                  Pro Tip
                </div>
                <p className="text-sm leading-relaxed text-white/55">
                  Ask sharper questions. The cleaner your signal, the harder MAD can expose the pattern.
                </p>
              </div>
            </HoverLift>
          </FadeIn>
        </div>
      </section>
    </main>
  );
}
