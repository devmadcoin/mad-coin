"use client";

import { useEffect, useRef, useState, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════
   ANIMATION UTILITIES (inlined — zero external deps)
   ═══════════════════════════════════════════════════════════ */

function useInView(options?: IntersectionObserverInit) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsInView(true); observer.disconnect(); } },
      { threshold: 0.12, ...options }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [options]);
  return { ref, isInView };
}

function FadeIn({
  children, className = "", delay = 0, direction = "up", duration = 0.6, distance = 30,
}: { children: React.ReactNode; className?: string; delay?: number; direction?: "up" | "down" | "left" | "right"; duration?: number; distance?: number; }) {
  const { ref, isInView } = useInView();
  const transforms = {
    up: `translateY(${distance}px)`, down: `translateY(-${distance}px)`,
    left: `translateX(${distance}px)`, right: `translateX(-${distance}px)`,
  };
  return (
    <div ref={ref} className={className} style={{
      opacity: isInView ? 1 : 0, transform: isInView ? "translate(0)" : transforms[direction],
      transition: `opacity ${duration}s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s, transform ${duration}s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s`,
      willChange: "opacity, transform",
    }}>{children}</div>
  );
}

function StaggerGrid({
  children, className = "", staggerDelay = 0.1, baseDelay = 0,
}: { children: React.ReactNode; className?: string; staggerDelay?: number; baseDelay?: number; }) {
  const { ref, isInView } = useInView();
  return (
    <div ref={ref} className={className}>
      {Array.isArray(children) ? children.map((child, i) => (
        <div key={i} style={{
          opacity: isInView ? 1 : 0, transform: isInView ? "translateY(0)" : "translateY(24px)",
          transition: `opacity 0.5s cubic-bezier(0.22, 1, 0.36, 1) ${baseDelay + i * staggerDelay}s, transform 0.5s cubic-bezier(0.22, 1, 0.36, 1) ${baseDelay + i * staggerDelay}s`,
          willChange: "opacity, transform",
        }}>{child}</div>
      )) : children}
    </div>
  );
}

function GlowPulse({ children, className = "" }: { children: React.ReactNode; className?: string; }) {
  return (
    <div className={className} style={{ animation: "glowPulse 3s ease-in-out infinite" }}>
      {children}
      <style>{`@keyframes glowPulse { 0%,100%{box-shadow:0 0 25px rgba(255,0,0,0.12)} 50%{box-shadow:0 0 45px rgba(255,0,0,0.28)}`}</style>
    </div>
  );
}

function HoverLift({ children, className = "" }: { children: React.ReactNode; className?: string; }) {
  return (
    <div className={className} style={{ transition: "transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)" }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-6px)"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; }}>
      {children}
    </div>
  );
}

/* ─── TYPEWRITER HOOK ─── */
function useTypewriter(text: string, speed = 30, enabled = true) {
  const [displayed, setDisplayed] = useState(enabled ? "" : text);
  const [done, setDone] = useState(!enabled);

  useEffect(() => {
    if (!enabled) { setDisplayed(text); setDone(true); return; }
    setDisplayed("");
    setDone(false);
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) { clearInterval(timer); setDone(true); }
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed, enabled]);

  return { displayed, done };
}

/* ═══════════════════════════════════════════════════════════
   TYPES & DATA
   ═══════════════════════════════════════════════════════════ */

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

type OutputVariants = { safe?: string; savage?: string; crashout?: string };

type ApiResponse = { output?: string; outputs?: OutputVariants; meta?: ApiMeta; error?: string };

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
  "Ask what others avoid...",
  "Why am I stuck?",
  "What's my real problem?",
  "Why do I keep hesitating?",
];

const SUGGESTED_PROMPTS = [
  "Why do I procrastinate?",
  "Why am I broke?",
  "Why can't I focus?",
  "Why do I fear failure?",
  "Why am I so distracted?",
  "What's holding me back?",
];

const WELCOME_MESSAGES: ChatMessage[] = [
  {
    id: "welcome-user-1", role: "user", text: "Why do I keep making the same mistakes?",
  },
  {
    id: "welcome-mad-1", role: "mad",
    text: "Because you forgive yourself too easily. You call it a 'lesson' and repeat it like a subscription.",
    meta: { intent: "pattern-expose", mood: "direct", followUpBait: ["How do I actually change?", "Why do I self-sabotage?"] },
  },
  {
    id: "welcome-user-2", role: "user", text: "How do I actually change?",
  },
  {
    id: "welcome-mad-2", role: "mad",
    text: "Stop waiting to feel ready. Ready is a lie you tell yourself to stay comfortable. Act first. The feeling follows the action, never the other way around.",
    meta: { intent: "reframe", mood: "savage" },
  },
];

/* ═══════════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════════ */

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
  return value.toLowerCase().replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function inferPatterns(input: string, apiStates?: string[]): string[] {
  if (apiStates?.length) return apiStates.map(formatTag).slice(0, 3);
  const text = input.toLowerCase();
  const tags = new Set<string>();
  if (text.includes("overthink") || text.includes("anxious") || text.includes("fear")) tags.add("Overthinking");
  if (text.includes("stuck") || text.includes("hesitate") || text.includes("wait")) tags.add("Hesitation");
  if (text.includes("discipline") || text.includes("lazy") || text.includes("focus")) tags.add("Untapped Discipline");
  return Array.from(tags).slice(0, 3);
}

async function shareOrCopy(text: string): Promise<boolean> {
  try {
    if (typeof navigator !== "undefined" && navigator.share) {
      await navigator.share({ text });
      return true;
    }
  } catch { /* fall through */ }
  try {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch { /* no-op */ }
  return false;
}

function messageId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/* ═══════════════════════════════════════════════════════════
   COMPONENTS
   ═══════════════════════════════════════════════════════════ */

function AmbientBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,40,40,0.12),transparent_45%),radial-gradient(circle_at_80%_20%,rgba(255,90,0,0.06),transparent_35%),radial-gradient(circle_at_20%_80%,rgba(120,0,0,0.08),transparent_40%),linear-gradient(180deg,#030303,#050505)]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-red-500/[0.03] rounded-full blur-[120px] animate-pulse" style={{ animationDuration: "8s" }} />
    </div>
  );
}

function StyleSelector({ style, onChange }: { style: StyleMode; onChange: (s: StyleMode) => void }) {
  const modes: { key: StyleMode; label: string; color: string; border: string; bg: string; desc: string }[] = [
    { key: "safe", label: "Safe", color: "text-green-300", border: "border-green-500/30", bg: "bg-green-500/8", desc: "Gentle" },
    { key: "savage", label: "Savage", color: "text-red-300", border: "border-red-500/30", bg: "bg-red-500/8", desc: "Raw" },
    { key: "crashout", label: "Crashout", color: "text-orange-300", border: "border-orange-500/30", bg: "bg-orange-500/8", desc: "Brutal" },
  ];

  return (
    <div className="flex gap-2 p-1.5 rounded-2xl border border-white/10 bg-white/[0.03]">
      {modes.map((m) => (
        <button
          key={m.key}
          onClick={() => onChange(m.key)}
          className={`relative flex-1 rounded-xl px-4 py-3 text-center transition-all duration-300 ${
            style === m.key
              ? `${m.bg} ${m.border} border`
              : "border border-transparent hover:border-white/10 hover:bg-white/[0.03]"
          }`}
        >
          <div className={`text-sm font-black uppercase tracking-wider ${style === m.key ? m.color : "text-white/50"}`}>
            {m.label}
          </div>
          <div className="text-[10px] text-white/30 mt-0.5">{m.desc}</div>
          {style === m.key && (
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-current opacity-50" />
          )}
        </button>
      ))}
    </div>
  );
}

function LuxuryLoading() {
  return (
    <div className="flex justify-start">
      <div className="max-w-[88%] rounded-[1.6rem] border border-red-500/20 bg-[linear-gradient(180deg,rgba(70,0,0,0.22),rgba(0,0,0,0.38))] px-6 py-5 text-red-50">
        <div className="flex items-center gap-3 mb-3">
          <div className="relative w-8 h-8">
            <div className="absolute inset-0 rounded-full border-2 border-red-500/20" />
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-red-500 animate-spin" style={{ animationDuration: "1.2s" }} />
          </div>
          <span className="text-xs uppercase tracking-[0.25em] text-red-200/70 font-bold">MAD is reading your signal</span>
        </div>
        <div className="h-1.5 w-48 rounded-full bg-white/10 overflow-hidden">
          <div className="h-full bg-red-500/60 rounded-full animate-pulse" style={{ width: "60%", animationDuration: "1.5s" }} />
        </div>
      </div>
    </div>
  );
}

function MessageCard({ message, isLatest }: { message: ChatMessage; isLatest: boolean }) {
  const isUser = message.role === "user";
  const isWelcome = message.id.startsWith("welcome-");
  const { displayed, done } = useTypewriter(message.text, 28, isLatest && !isUser && !isWelcome && message.isNew);

  return (
    <div className={isUser ? "flex justify-end" : "flex justify-start"}>
      <div
        className={
          isUser
            ? "max-w-[82%] rounded-[1.6rem] border border-white/10 bg-[#141414] px-5 py-4 text-white shadow-lg"
            : `max-w-[88%] rounded-[1.6rem] border px-5 py-5 text-red-50 shadow-[0_8px_32px_rgba(255,0,0,0.08)] ${
                message.meta?.mood === "savage" ? "border-red-500/25" : "border-red-500/15"
              } bg-[linear-gradient(180deg,rgba(70,0,0,0.18),rgba(0,0,0,0.35))]`
        }
        style={message.isNew ? {
          animation: "msgSlideIn 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
        } : undefined}
      >
        <div className={isUser ? "text-xs uppercase tracking-[0.2em] text-white/35 mb-2" : "flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.2em] text-red-200/70 mb-3"}>
          {isUser ? "You" : (
            <>
              <span className="font-bold">MAD</span>
              {message.meta?.intent && (
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-1 text-[10px] tracking-[0.18em] text-white/50">
                  {message.meta.intent}
                </span>
              )}
              {isWelcome && (
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-1 text-[10px] tracking-[0.18em] text-white/40">Example</span>
              )}
            </>
          )}
        </div>

        <div className={isUser ? "text-base leading-7 text-white/85" : "whitespace-pre-wrap text-2xl font-black leading-tight text-red-100 md:text-3xl"}>
          {isUser ? message.text : displayed}
          {!done && isLatest && !isWelcome && (
            <span className="inline-block w-1 h-6 bg-red-400 ml-1 animate-pulse" />
          )}
        </div>

        {!isUser && message.meta?.followUpBait?.length ? (
          <div className="mt-5 flex flex-wrap gap-2">
            {message.meta.followUpBait.slice(0, 3).map((item) => (
              <button
                key={item}
                onClick={() => { /* handled by parent */ }}
                className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs text-white/60 transition hover:border-red-500/30 hover:bg-red-500/8 hover:text-red-200"
              >
                {item}
              </button>
            ))}
          </div>
        ) : null}
      </div>
      <style>{`
        @keyframes msgSlideIn {
          from { opacity: 0; transform: translateY(16px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}

function EmptyStateSummon({ onPrompt }: { onPrompt: (p: string) => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-6">
      <div className="w-20 h-20 rounded-3xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.5">
          <path d="M12 2a10 10 0 100 20 10 10 0 000-20z"/><path d="M12 8v8M8 12h8"/>
        </svg>
      </div>
      <h3 className="text-2xl font-black text-white mb-2">Summon MAD</h3>
      <p className="text-sm text-white/40 max-w-sm mb-8">
        Ask what others avoid. MAD doesn't comfort you — it exposes the pattern.
      </p>
      <StaggerGrid className="flex flex-wrap justify-center gap-3 max-w-md" staggerDelay={0.08}>
        {SUGGESTED_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            onClick={() => onPrompt(prompt)}
            className="rounded-full border border-white/10 bg-white/[0.03] px-5 py-3 text-sm text-white/60 transition hover:border-red-500/30 hover:bg-red-500/8 hover:text-red-200"
          >
            {prompt}
          </button>
        ))}
      </StaggerGrid>
    </div>
  );
}

function GrowthCard({ count }: { count: number }) {
  const level = Math.floor(count / 5) + 1;
  const progress = ((count % 5) / 5) * 100;
  return (
    <HoverLift>
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
      <div className="text-xs uppercase tracking-[0.35em] text-white/45 mb-1">Your Growth Level</div>
      <div className="mt-3 text-5xl font-black text-white">Lv.{level}</div>
      <div className="mt-1 text-sm text-white/50">{count} truths received</div>
      <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-red-500 transition-all duration-700" style={{ width: `${progress}%` }} />
      </div>
      <div className="mt-3 text-xs text-white/40">Next level every 5 truths</div>
    </div>
    </HoverLift>
  );
}

function PatternCard({ patterns, mood }: { patterns: string[]; mood?: string }) {
  return (
    <HoverLift>
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
      <div className="text-xs uppercase tracking-[0.35em] text-white/45 mb-4">What MAD Sees</div>
      <div className="space-y-3">
        {patterns.map((pattern) => (
          <div key={pattern} className="rounded-2xl bg-white/5 px-4 py-3 flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(255,0,0,0.4)]" />
            <span className="text-sm font-medium text-white/70">{pattern}</span>
          </div>
        ))}
      </div>
      {mood ? (
        <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm">
          <span className="text-white/40">Mood:</span> <span className="text-white font-bold">{formatTag(mood)}</span>
        </div>
      ) : null}
    </div>
    </HoverLift>
  );
}

/* ═══════════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════════ */

export default function MadMindPage() {
  const [input, setInput] = useState("");
  const [style, setStyle] = useState<StyleMode>("savage");
  const [sessionId, setSessionId] = useState("web-user");
  const [isLoading, setIsLoading] = useState(false);
  const [shareMessage, setShareMessage] = useState("");
  const [count, setCount] = useState(2);
  const [patterns, setPatterns] = useState<string[]>(["Pattern Repeats", "Comfort Addiction", "Avoidance"]);
  const [messages, setMessages] = useState<ChatMessage[]>(WELCOME_MESSAGES);

  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => { setSessionId(getOrCreateSessionId()); }, []);

  useEffect(() => {
    if (!shareMessage) return;
    const timer = window.setTimeout(() => setShareMessage(""), 1600);
    return () => window.clearTimeout(timer);
  }, [shareMessage]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isLoading]);

  const latestMad = [...messages].reverse().find((m) => m.role === "mad");
  const latestMeta = latestMad?.meta ?? null;

  const sendMessage = useCallback(async (messageOverride?: string) => {
    const text = (messageOverride ?? input).trim() || PLACEHOLDERS[count % PLACEHOLDERS.length];
    if (!text || isLoading) return;

    const userMessage: ChatMessage = { id: messageId(), role: "user", text };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setShareMessage("");

    try {
      const response = await fetch("/api/mad-mind", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          sessionId,
          cookLevel: getCookLevel(style),
          preferredStyle: style,
          multiOutput: false,
        }),
      });

      let data: ApiResponse | null = null;
      try { data = (await response.json()) as ApiResponse; } catch { data = null; }

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
      const madMessage: ChatMessage = { id: messageId(), role: "mad", text: "Could not reach MAD.", meta: null, isNew: true };
      setMessages((prev) => [...prev, madMessage]);
      setPatterns(inferPatterns(text));
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, count, sessionId, style]);

  const handleQuickReply = useCallback(async (type: "harder" | "smarter" | "shorter") => {
    const lastUser = [...messages].reverse().find((m) => m.role === "user")?.text;
    if (!lastUser) return;
    const mapped = type === "harder" ? `${lastUser} go harder` : type === "shorter" ? `${lastUser} make it shorter` : `${lastUser} make it smarter`;
    await sendMessage(mapped);
  }, [messages, sendMessage]);

  const handleShare = useCallback(async () => {
    if (!latestMad?.text) return;
    const didShare = await shareOrCopy(latestMad.text);
    setShareMessage(didShare ? "Copied." : "Could not share.");
  }, [latestMad]);

  const handlePromptClick = useCallback((prompt: string) => {
    setInput(prompt);
    void sendMessage(prompt);
  }, [sendMessage]);

  const hasOnlyWelcome = messages.length <= WELCOME_MESSAGES.length;

  return (
    <main className="min-h-screen bg-[#030303] text-white">
      <AmbientBackground />

      {/* ─── HERO ─── */}
      <FadeIn>
      <section className="relative border-b border-white/[0.08] pt-16 pb-12 md:pt-24 md:pb-16">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-red-500/25 bg-red-500/10 px-5 py-2.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
            </span>
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-red-300">MAD AI is Live</span>
          </div>
          <h1 className="text-6xl font-black leading-[0.9] tracking-tight text-white sm:text-7xl md:text-8xl">
            The Truth<br />
            <span className="text-red-500 drop-shadow-[0_0_30px_rgba(255,0,0,0.35)]">Machine.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-white/50 md:text-xl">
            A chat that tells you what you need to hear. Not what you want to hear.
          </p>
        </div>
      </section>
      </FadeIn>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-8 lg:grid-cols-[1.4fr_0.75fr]">
        {/* ─── CHAT AREA ─── */}
        <FadeIn delay={0.1}>
        <div className="overflow-hidden rounded-[2.2rem] border border-white/[0.08] bg-white/[0.02] shadow-[0_18px_60px_rgba(0,0,0,0.45)] backdrop-blur-sm">
          {/* Header */}
          <div className="border-b border-white/[0.08] px-6 py-5">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <div className="text-sm font-black uppercase tracking-[0.28em] text-red-300/80">Live Chat</div>
                <div className="mt-1 text-sm text-white/40">
                  {hasOnlyWelcome ? "Example conversation loaded" : `${messages.length} messages`}
                </div>
              </div>
              <StyleSelector style={style} onChange={setStyle} />
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="h-[58vh] min-h-[420px] space-y-5 overflow-y-auto px-5 py-5">
            {messages.length === 0 ? (
              <EmptyStateSummon onPrompt={handlePromptClick} />
            ) : (
              messages.map((message, idx) => (
                <MessageCard
                  key={message.id}
                  message={message}
                  isLatest={idx === messages.length - 1}
                />
              ))
            )}

            {isLoading && <LuxuryLoading />}
          </div>

          {/* Input */}
          <div className="border-t border-white/[0.08] px-5 py-5">
            {/* Quick actions */}
            <div className="mb-4 flex flex-wrap gap-2">
              {(["harder", "smarter", "shorter"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => void handleQuickReply(type)}
                  disabled={isLoading || messages.length === 0}
                  className="rounded-full border border-white/10 px-5 py-2.5 text-sm font-bold text-white/60 transition hover:border-red-500/25 hover:bg-red-500/8 hover:text-red-200 disabled:opacity-40"
                >
                  {type === "harder" ? "Go Harder" : type === "smarter" ? "Make It Smarter" : "Make It Shorter"}
                </button>
              ))}
              <button
                onClick={() => void handleShare()}
                disabled={messages.length === 0}
                className="rounded-full border border-white/10 px-5 py-2.5 text-sm font-bold text-white/60 transition hover:border-white/20 hover:bg-white/5 disabled:opacity-40"
              >
                Share
              </button>
              {shareMessage && <span className="self-center text-sm text-red-300 font-bold">{shareMessage}</span>}
            </div>

            {/* Suggested */}
            {!isLoading && hasOnlyWelcome && (
              <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
                {SUGGESTED_PROMPTS.slice(0, 4).map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handlePromptClick(prompt)}
                    className="shrink-0 rounded-full border border-white/[0.06] bg-white/[0.02] px-4 py-2 text-xs text-white/40 transition hover:border-white/12 hover:text-white/60"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}

            {/* Input bar */}
            <div className="flex gap-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") void sendMessage(); }}
                placeholder={PLACEHOLDERS[count % PLACEHOLDERS.length]}
                className="flex-1 rounded-2xl border border-white/[0.08] bg-black/60 px-6 py-4 text-base outline-none transition placeholder:text-white/25 focus:border-red-500/40 focus:bg-black/80 focus:shadow-[0_0_20px_rgba(255,0,0,0.1)]"
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

        {/* ─── SIDEBAR ─── */}
        <div className="space-y-5">
          <FadeIn delay={0.2}><GrowthCard count={count} /></FadeIn>
          <FadeIn delay={0.25}><PatternCard patterns={patterns} mood={latestMeta?.mood} /></FadeIn>
          <FadeIn delay={0.3}>
            <HoverLift>
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
              <div className="text-xs uppercase tracking-[0.35em] text-white/45 mb-3">Pro Tip</div>
              <p className="text-sm text-white/55 leading-relaxed">
                The deeper you go, the harder MAD hits. Use <span className="text-red-300 font-bold">Go Harder</span> to escalate, <span className="text-white font-bold">Smarter</span> for strategy.
              </p>
            </div>
            </HoverLift>
          </FadeIn>
        </div>
      </section>
    </main>
  );
}
