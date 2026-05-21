"use client";

import type { ReactNode } from "react";
import React, { useState, useEffect, useRef, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════
   ANIMATION UTILITIES
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
  children, className = "", delay = 0, direction = "up", duration = 0.5, distance = 24,
}: { children: ReactNode; className?: string; delay?: number; direction?: "up" | "down" | "left" | "right"; duration?: number; distance?: number; }) {
  const { ref, isInView } = useInView();
  const transforms = {
    up: `translateY(${distance}px)`, down: `translateY(-${distance}px)`,
    left: `translateX(${distance}px)`, right: `translateX(-${distance}px)`,
  };
  return (
    <div ref={ref} className={className} style={{
      opacity: isInView ? 1 : 0, transform: isInView ? "translate(0)" : transforms[direction],
      transition: `opacity ${duration}s cubic-bezier(0.25,0.46,0.45,0.94) ${delay}s, transform ${duration}s cubic-bezier(0.25,0.46,0.45,0.94) ${delay}s`,
      willChange: "opacity, transform",
    }}>{children}</div>
  );
}

function HoverLift({ children, className = "" }: { children: ReactNode; className?: string; }) {
  return (
    <div className={className} style={{ transition: "transform 0.3s cubic-bezier(0.25,0.46,0.45,0.94)" }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; }}>
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   PARTICLES — Floating dust motes like the MAD Garden
   ═══════════════════════════════════════════════════════════ */
function FloatingDust() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = window.innerWidth;
    let h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;

    const particles: Array<{ x: number; y: number; vx: number; vy: number; size: number; alpha: number; color: string }> = [];
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3 - 0.1,
        size: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.5 + 0.1,
        color: ["#ff4444", "#ff6666", "#ffaaaa", "#1a1a1a"][Math.floor(Math.random() * 4)],
      });
    }

    let animId: number;
    const animate = () => {
      ctx.clearRect(0, 0, w, h);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha * (0.7 + Math.sin(Date.now() / 1000 + p.x) * 0.3);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
    };
    window.addEventListener("resize", handleResize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 1,
        opacity: 0.6,
      }}
    />
  );
}

/* ═══════════════════════════════════════════════════════════
   SCROLL PROGRESS — Red line at top + mile indicator
   ═══════════════════════════════════════════════════════════ */
function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  const [activeMile, setActiveMile] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setProgress(Math.min(pct, 100));

      /* Determine active mile based on scroll position */
      const mileEls = document.querySelectorAll("[data-mile]");
      let current = 0;
      mileEls.forEach((el, i) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.5) current = i;
      });
      setActiveMile(current);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Top progress bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-[#1a1a1a]/5">
        <div
          className="h-full bg-gradient-to-r from-[#FF2D2D] via-[#FF2D2D] to-[#FF6B00] transition-all duration-150"
          style={{ width: `${progress}%`, boxShadow: "0 0 10px rgba(255,45,45,0.3)" }}
        />
      </div>
      {/* Side mile indicator */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col gap-3">
        {["0", "25", "50", "100"].map((mile, i) => (
          <div key={mile} className="flex items-center gap-2">
            <div
              className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${
                i <= activeMile
                  ? "bg-[#FF2D2D] shadow-[0_0_8px_rgba(255,45,45,0.4)]"
                  : "bg-[#1a1a1a]/20"
              }`}
            />
            <span
              className={`text-[9px] font-black uppercase tracking-wider transition-all duration-500 ${
                i === activeMile ? "text-[#FF2D2D] opacity-100" : "text-[#1a1a1a]/30 opacity-0"
              }`}
            >
              Mile {mile}
            </span>
          </div>
        ))}
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   PAGE DATA
   ═══════════════════════════════════════════════════════════ */

const LINKS = {
  buy: "https://jup.ag/swap?sell=So11111111111111111111111111111111111111112&buy=Fa7ZE9nCEYnrHsnoeHuhEExJpchtrBtKXnWe6CgHpump",
  communityProof: "https://x.com/madrichclub_/status/2046716691867201953?s=20",
  communityProof2: "https://x.com/madrichclub_/status/2052921091342107024?s=20",
  communityProof3: "https://x.com/madrichclub_/status/2053391015109955771?s=20",
  communityProof4: "https://x.com/madrichclub_/status/2057508965567877497?s=20",

const PROGRESS = { complete: 7, total: 10 };
const percentComplete = Math.round((PROGRESS.complete / PROGRESS.total) * 100);

const STATUS_CARDS = [
  { label: "Website", value: "LIVE NOW", tone: "green" as const, icon: "🌐" },
  { label: "Confessions", value: "LIVE NOW", tone: "green" as const, icon: "💬" },
  { label: "Token Burns", value: "ACTIVE", tone: "green" as const, icon: "🔥" },
  { label: "MAD AI", value: "LIVE NOW", tone: "green" as const, icon: "🤖" },
  { label: "Community Support", value: "4 LOCKED", tone: "green" as const, icon: "🤝" },
  { label: "MAD Games", value: "IN PROGRESS", tone: "red" as const, icon: "🎮" },
  { label: "Stickers", value: "LIVE NOW", tone: "green" as const, icon: "😈" },
  { label: "Clothing", value: "TESTING", tone: "red" as const, icon: "👕" },
  { label: "$MAD Art", value: "IN PROGRESS", tone: "red" as const, icon: "🖼️" },
] as const;

const EXITS = [
  {
    mile: "MILE 0", title: "Foundation", status: "COMPLETE" as const, color: "emerald",
    proof: [
      { label: "Token Launch", url: "https://pump.fun/coin/Fa7ZE9nCEYnrHsnoeHuhEExJpchtrBtKXnWe6CgHpump", type: "tx" as const },
      { label: "Website Deployed", url: "https://mad-coin.vercel.app", type: "link" as const },
    ],
    items: [
      { text: "Core brand philosophy established", done: true },
      { text: "Smart contract framework built", done: true },
      { text: "Community channels launched", done: true },
    ],
    summary: "The groundwork. Philosophy locked. Community born.",
  },
  {
    mile: "MILE 25", title: "Proof + Community", status: "COMPLETE" as const, color: "emerald",
    proof: [
      { label: "Community Support #1", url: LINKS.communityProof, type: "link" as const },
      { label: "Community Support #2", url: LINKS.communityProof2, type: "link" as const },
      { label: "Community Support #3", url: LINKS.communityProof3, type: "link" as const },
      { label: "Community Support #4 — Hineycoin", url: LINKS.communityProof4, type: "link" as const },
    ],
    items: [
      { text: "MAD Confessions live", done: true },
      { text: "Exchange visibility live", done: true },
      { text: "Supply reduced to ~503M", done: true },
      { text: "Burn target set: 800M", done: true },
      { text: "Community growth active", done: true },
      { text: "4th community locked in", done: true },
    ],
    summary: "Supply shrinking. 503M → 800M. Four communities backed publicly. Tokens locked.",
  },
  {
    mile: "MILE 50", title: "Build", status: "IN PROGRESS" as const, color: "yellow",
    proof: [
      { label: "MAD Mind AI", url: LINKS.madMind, type: "link" as const },
      { label: "Moltbook Agent", url: "https://www.moltbook.com/u/themadclaw", type: "link" as const },
    ],
    items: [
      { text: "Token utility expansion", done: true },
      { text: "Burn #2 at 10K holders", done: false },
      { text: "Marketplace integration", done: false },
      { text: "Partnerships & alliances", done: false },
      { text: "MAD Games expansion", done: false },
    ],
    summary: "Burn #2 locked in at 10K holders. Building utility. In motion.",
  },
  {
    mile: "MILE 100", title: "Expand", status: "UP NEXT" as const, color: "red",
    proof: [],
    items: [
      { text: "Global marketing campaign", done: false },
      { text: "CEX listings", done: false },
      { text: "Ecosystem expansion", done: false },
    ],
    summary: "The next level. CEX. Global reach. Full ecosystem.",
  },
];

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function Shell({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <section className={cn(
      "overflow-hidden rounded-[2rem] border border-[#1a1a1a]/10 bg-[#1a1a1a]/[0.02] shadow-[0_18px_60px_rgba(0,0,0,0.06)]",
      className,
    )}>
      {children}
    </section>
  );
}

/* ─── Shell wrapper that accepts ref for scroll tracking ─── */
const ShellWithRef = React.forwardRef<HTMLDivElement, { children: ReactNode; className?: string }>(
  ({ children, className = "" }, ref) => (
    <div ref={ref} className={cn(
      "overflow-hidden rounded-[2rem] border border-[#1a1a1a]/10 bg-[#1a1a1a]/[0.02] shadow-[0_18px_60px_rgba(0,0,0,0.06)]",
      className,
    )}>
      {children}
    </div>
  )
);
ShellWithRef.displayName = "ShellWithRef";

/* ═══════════════════════════════════════════════════════════
   CHAOS METER — Live widget showing burn, conviction, Claw
   ═══════════════════════════════════════════════════════════ */

function ChaosMeter() {
  const [firePulse, setFirePulse] = useState(1);
  const [burnProgress, setBurnProgress] = useState(0);

  useEffect(() => {
    const target = 62;
    const interval = setInterval(() => {
      setBurnProgress((prev) => {
        if (prev >= target) return target;
        return prev + 1;
      });
    }, 30);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const time = Date.now() / 1000;
      setFirePulse(0.85 + Math.sin(time * 2.5) * 0.15);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <Shell className="p-5 sm:p-6">
      <div className="grid gap-4 sm:grid-cols-3">
        {/* Burn Progress */}
        <div className="relative rounded-2xl border border-[#FF2D2D]/20 bg-[#1a1a1a]/[0.02] p-5 overflow-hidden group hover:border-[#FF2D2D]/40 transition-all">
          <div
            className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity"
            style={{
              background: `radial-gradient(circle at 50% 100%, rgba(255,45,45,${firePulse * 0.5}), transparent 70%)`,
            }}
          />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#FF2D2D]/60">Token Burn</p>
              <span className="text-lg animate-pulse">🔥</span>
            </div>
            <div className="text-3xl font-black text-[#1a1a1a] mb-1">{burnProgress}%</div>
            <p className="text-xs text-[#1a1a1a]/40 mb-3">of 800M target consumed</p>
            <div className="h-3 rounded-full bg-[#1a1a1a]/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#FF2D2D] via-[#FF6B00] to-[#FF2D2D] transition-all duration-300"
                style={{
                  width: `${burnProgress}%`,
                  boxShadow: `0 0 ${12 * firePulse}px rgba(255,45,45,0.5)`,
                  transform: `scaleY(${firePulse})`,
                }}
              />
            </div>
            <p className="mt-2 text-[10px] text-[#1a1a1a]/30">~513M tokens burned and counting</p>
          </div>
        </div>

        {/* Community Conviction */}
        <div className="relative rounded-2xl border border-emerald-500/20 bg-[#1a1a1a]/[0.02] p-5 overflow-hidden group hover:border-emerald-500/40 transition-all">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-emerald-500 animate-ping" style={{ animationDuration: "3s" }} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600/70">Conviction</p>
              <span className="text-lg">💓</span>
            </div>
            <div className="text-3xl font-black text-[#1a1a1a] mb-1">STRONG</div>
            <p className="text-xs text-[#1a1a1a]/40 mb-3">Community heartbeat detected</p>
            <div className="flex items-center gap-2">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-2 rounded-full bg-emerald-500 transition-all"
                  style={{
                    width: "100%",
                    opacity: 0.3 + Math.sin(Date.now() / 1000 + i * 0.8) * 0.7,
                    animation: `pulse ${1.5 + i * 0.3}s ease-in-out infinite`,
                  }}
                />
              ))}
            </div>
            <p className="mt-2 text-[10px] text-[#1a1a1a]/30">Pulse sync: active</p>
          </div>
        </div>

        {/* Mad Claw Status */}
        <div className="relative rounded-2xl border border-[#1a1a1a]/10 bg-[#1a1a1a]/[0.02] p-5 overflow-hidden group cursor-pointer hover:border-[#FF2D2D]/30 transition-all">
          <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity bg-gradient-to-br from-[#FF2D2D] to-transparent" />
          <a href={LINKS.madMind} className="relative z-10 block">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#1a1a1a]/50">Mad Claw</p>
              <span className="text-lg animate-pulse">👁️</span>
            </div>
            <div className="text-3xl font-black text-[#1a1a1a] mb-1">WATCHING</div>
            <p className="text-xs text-[#1a1a1a]/40 mb-3">Live across 4 platforms</p>
            <div className="flex gap-2">
              {["X", "🦞", "✈️", "🌐"].map((icon, i) => (
                <div
                  key={icon}
                  className="w-8 h-8 rounded-lg bg-[#1a1a1a]/5 border border-[#1a1a1a]/10 flex items-center justify-center text-xs"
                  style={{
                    animation: `pulse ${2 + i * 0.4}s ease-in-out infinite`,
                    animationDelay: `${i * 0.2}s`,
                  }}
                >
                  {icon}
                </div>
              ))}
            </div>
            <p className="mt-2 text-[10px] text-[#1a1a1a]/30">Click to visit →</p>
          </a>
        </div>
      </div>
    </Shell>
  );
}

/* ═══════════════════════════════════════════════════════════
   PROOF MODAL
   ═══════════════════════════════════════════════════════════ */

function ProofModal({ isOpen, onClose, exit }: { isOpen: boolean; onClose: () => void; exit: typeof EXITS[0] | null }) {
  if (!isOpen || !exit) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-[#1a1a1a]/40 backdrop-blur-sm" />
      <div
        className="relative z-10 w-full max-w-lg rounded-[2rem] border border-[#1a1a1a]/10 bg-[#F5F1E8] p-6 sm:p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#1a1a1a]/30">{exit.mile}</span>
            <h3 className="text-2xl font-black text-[#1a1a1a]">{exit.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full border border-[#1a1a1a]/10 bg-[#1a1a1a]/5 flex items-center justify-center text-[#1a1a1a]/50 hover:text-[#1a1a1a] hover:bg-[#1a1a1a]/10 transition"
          >
            ✕
          </button>
        </div>

        <p className="text-sm text-[#1a1a1a]/40 mb-6">{exit.summary}</p>

        {exit.proof.length > 0 && (
          <div className="mb-6">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#1a1a1a]/30 mb-3">Proof of Work</p>
            <div className="grid gap-2">
              {exit.proof.map((p) => (
                <a
                  key={p.label}
                  href={p.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl border border-[#1a1a1a]/5 bg-[#1a1a1a]/[0.02] hover:border-[#FF2D2D]/20 hover:bg-[#FF2D2D]/5 transition group"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#FF2D2D]/10 border border-[#FF2D2D]/20 flex items-center justify-center text-sm group-hover:scale-110 transition">
                    {p.type === "tx" ? "🔗" : "🌐"}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#1a1a1a]/80">{p.label}</p>
                    <p className="text-[10px] text-[#1a1a1a]/30">{p.type === "tx" ? "Transaction / Contract" : "Live Link"}</p>
                  </div>
                  <span className="ml-auto text-[#1a1a1a]/20 group-hover:text-[#1a1a1a]/50 transition">→</span>
                </a>
              ))}
            </div>
          </div>
        )}

        {exit.proof.length === 0 && (
          <div className="mb-6 p-4 rounded-xl border border-[#1a1a1a]/5 bg-[#1a1a1a]/[0.02] text-center">
            <p className="text-sm text-[#1a1a1a]/40">No proof yet — this milestone is in progress.</p>
            <p className="text-[10px] text-[#1a1a1a]/20 mt-1">Check back when status updates to COMPLETE</p>
          </div>
        )}

        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#1a1a1a]/30 mb-3">Milestone Checklist</p>
          <div className="space-y-2">
            {exit.items.map((item) => (
              <div
                key={item.text}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-xl border",
                  item.done ? "bg-emerald-500/5 border-emerald-500/10" : "bg-[#1a1a1a]/[0.02] border-[#1a1a1a]/5"
                )}
              >
                <div
                  className={cn(
                    "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0",
                    item.done ? "bg-emerald-500 text-white" : "bg-[#1a1a1a]/10 text-[#1a1a1a]/30"
                  )}
                >
                  {item.done ? "✓" : "○"}
                </div>
                <span className={cn("text-sm", item.done ? "text-[#1a1a1a]/80" : "text-[#1a1a1a]/40")}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   STATUS CARDS
   ═══════════════════════════════════════════════════════════ */

function StatusMiniCard({ label, value, tone, icon }: { label: string; value: string; tone: "red" | "green"; icon: string }) {
  return (
    <HoverLift>
    <div className={cn(
      "rounded-[1.25rem] border p-4 transition duration-300 cursor-pointer",
      tone === "green"
        ? "border-emerald-500/25 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.08),rgba(245,241,232,0.92))] shadow-[0_0_25px_rgba(16,185,129,0.06)]"
        : "border-[#FF2D2D]/20 bg-[radial-gradient(circle_at_top_left,rgba(255,45,45,0.06),rgba(245,241,232,0.92))] shadow-[0_0_20px_rgba(255,45,45,0.06)]",
    )}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#1a1a1a]/50">{label}</p>
        <div className="text-lg">{icon}</div>
      </div>
      <p className={cn("mt-3 text-xl font-black leading-tight sm:text-2xl", tone === "green" ? "text-emerald-600" : "text-[#FF2D2D]")}>
        {value}
      </p>
    </div>
    </HoverLift>
  );
}

function ProgressStrip() {
  return (
    <Shell className="p-5 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.35em] text-[#1a1a1a]/40">Overall Progress</p>
          <h2 className="mt-2 text-2xl font-black text-[#1a1a1a] sm:text-3xl">{percentComplete}% complete</h2>
          <p className="mt-2 text-sm text-[#1a1a1a]/50">{PROGRESS.complete} of {PROGRESS.total} roadmap milestones are live, proven, or in motion.</p>
        </div>
        <div className="rounded-full border border-[#1a1a1a]/10 bg-[#1a1a1a]/[0.02] px-4 py-2 text-sm font-bold text-[#1a1a1a]/70">Build. Prove. Expand.</div>
      </div>
      <div className="mt-5 h-4 overflow-hidden rounded-full bg-[#1a1a1a]/10">
        <div className="h-full rounded-full bg-[linear-gradient(90deg,#22c55e,#10b981,#FF2D2D)] shadow-[0_0_24px_rgba(16,185,129,0.15)] transition-all duration-500" style={{ width: `${percentComplete}%` }} />
      </div>
    </Shell>
  );
}

/* ═══════════════════════════════════════════════════════════
   HIGHWAY — Scroll-activated with living car + particles
   ═══════════════════════════════════════════════════════════
   NOTE: Highway is intentionally kept DARK — it's the asphalt
   road cutting through the crème page. A dramatic contrast.
   ═══════════════════════════════════════════════════════════ */

function RoadSign({ mile, title, color }: { mile: string; title: string; color: string }) {
  const colorMap: Record<string, { bg: string; border: string; text: string; glow: string }> = {
    emerald: { bg: "bg-emerald-600", border: "border-emerald-500", text: "text-white", glow: "shadow-[0_0_30px_rgba(16,185,129,0.4)]" },
    yellow: { bg: "bg-yellow-500", border: "border-yellow-400", text: "text-black", glow: "shadow-[0_0_30px_rgba(234,179,8,0.5)]" },
    red: { bg: "bg-red-600", border: "border-red-500", text: "text-white", glow: "shadow-[0_0_30px_rgba(239,68,68,0.3)]" },
  };
  const c = colorMap[color] || colorMap.emerald;

  return (
    <div className={`relative ${c.glow}`}>
      <div className="absolute left-1/2 -translate-x-1/2 top-full w-1.5 h-8 bg-neutral-600" />
      <div className={cn("relative rounded-xl border-2 px-4 py-2 text-center min-w-[140px]", c.bg, c.border)}>
        <p className={cn("text-[9px] font-black uppercase tracking-[0.3em] opacity-75", c.text)}>{mile}</p>
        <p className={cn("text-sm font-black leading-tight", c.text)}>{title}</p>
        <div className="absolute top-1 left-2 w-1.5 h-1.5 rounded-full bg-white/30" />
        <div className="absolute top-1 right-2 w-1.5 h-1.5 rounded-full bg-white/30" />
        <div className="absolute bottom-1 left-2 w-1.5 h-1.5 rounded-full bg-white/30" />
        <div className="absolute bottom-1 right-2 w-1.5 h-1.5 rounded-full bg-white/30" />
      </div>
    </div>
  );
}

function ExitCard({ exit, side, onClick }: { exit: typeof EXITS[0]; side: "left" | "right"; onClick: () => void }) {
  const isComplete = exit.status === "COMPLETE";
  const isProgress = exit.status === "IN PROGRESS";

  const statusBadge = isComplete
    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
    : isProgress
      ? "border-yellow-500/30 bg-yellow-500/10 text-yellow-300"
      : "border-white/10 bg-white/5 text-white/40";

  return (
    <HoverLift>
    <div className={cn("relative", side === "left" ? "lg:pr-8" : "lg:pl-8")}>
      <div
        onClick={onClick}
        className="rounded-[1.4rem] border border-white/10 bg-neutral-900/80 p-5 sm:p-6 hover:border-red-500/20 hover:bg-neutral-900/90 transition-all cursor-pointer group"
      >
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition">
          <span className="text-[10px] font-black uppercase tracking-wider text-red-400">Click for proof →</span>
        </div>
        <div className={cn("flex items-center gap-3 mb-3 flex-wrap", side === "left" ? "lg:justify-end" : "")}>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">{exit.mile}</span>
          <span className={cn("px-2.5 py-1 rounded-full border text-[10px] font-black tracking-wider", statusBadge)}>
            {exit.status}
          </span>
        </div>
        <h3 className={cn("text-2xl sm:text-3xl font-black text-white mb-1", side === "left" ? "lg:text-right" : "")}>
          {exit.title}
        </h3>
        <p className={cn("text-sm text-white/50 mb-5", side === "left" ? "lg:text-right" : "")}>
          {exit.summary}
        </p>
        <div className={cn("space-y-2", side === "left" ? "lg:ml-auto" : "", "max-w-sm")}>
          {exit.items.map((item) => (
            <div key={item.text} className={cn("flex items-center gap-3 p-3 rounded-xl border",
              item.done ? "bg-emerald-500/5 border-emerald-500/10" : "bg-white/[0.02] border-white/5")}>
              <div className={cn("w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0",
                item.done ? "bg-emerald-500 text-black" : "bg-white/10 text-white/30")}>
                {item.done ? "✓" : "○"}
              </div>
              <span className={cn("text-sm font-medium", item.done ? "text-white/80" : "text-white/40")}>{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
    </HoverLift>
  );
}

/* ─── Animated traveling car on the highway ─── */
function TravelingCar({ scrollProgress }: { scrollProgress: number }) {
  const carRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!carRef.current) return;
    /* Car travels from top (Mile 0) to bottom (Mile 100) based on scroll */
    const y = scrollProgress * 100;
    carRef.current.style.top = `${y}%`;
  }, [scrollProgress]);

  return (
    <div
      ref={carRef}
      className="absolute left-1/2 -translate-x-1/2 z-30 transition-all duration-300"
      style={{ top: "0%" }}
    >
      <div className="relative">
        {/* Glow trail */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-8 h-20 bg-gradient-to-b from-red-500/40 to-transparent rounded-full blur-md" />
        {/* Car */}
        <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(255,0,0,0.6)] animate-pulse border border-red-400">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <path d="M5 17h14M6 17v-5l3-4h6l3 4v5M9 8V6a2 2 0 012-2h2a2 2 0 012 2v2" />
            <circle cx="7.5" cy="17" r="1.5" fill="white" stroke="none" />
            <circle cx="16.5" cy="17" r="1.5" fill="white" stroke="none" />
          </svg>
        </div>
        {/* Headlight beams */}
        <div className="absolute top-full left-1/2 -translate-x-1/2 w-16 h-24 bg-gradient-to-b from-red-500/20 to-transparent rounded-full blur-xl" />
      </div>
    </div>
  );
}

function Highway({ onCardClick }: { onCardClick: (exit: typeof EXITS[0]) => void }) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const highwayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!highwayRef.current) return;
      const rect = highwayRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const highwayTop = rect.top;
      const highwayHeight = rect.height;
      
      /* Progress: 0 when highway enters viewport, 1 when it leaves */
      const progress = Math.max(0, Math.min(1, (-highwayTop + viewportHeight * 0.3) / (highwayHeight + viewportHeight * 0.3)));
      setScrollProgress(progress);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <ShellWithRef className="p-0 overflow-visible border-[#1a1a1a]/20" ref={highwayRef}>
      <div className="relative py-10 sm:py-16">
        {/* Base asphalt */}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#1a1a1a_0%,#111_50%,#1a1a1a_100%)]" />
        
        {/* Tire tracks overlay */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: `
            repeating-linear-gradient(90deg, transparent, transparent 60px, rgba(255,255,255,0.3) 60px, rgba(255,255,255,0.3) 62px),
            repeating-linear-gradient(85deg, transparent, transparent 120px, rgba(255,255,255,0.15) 120px, rgba(255,255,255,0.15) 124px)
          `,
        }} />
        
        {/* Skid marks near Mile 0 */}
        <div className="absolute top-[12%] left-[20%] w-40 h-40 opacity-10" style={{
          background: "radial-gradient(ellipse, rgba(255,255,255,0.3) 0%, transparent 70%)",
          transform: "rotate(-30deg) scaleY(0.3)",
        }} />
        
        {/* Crash debris at Mile 0 */}
        <div className="absolute top-[8%] left-1/2 -translate-x-1/2 z-20 flex items-center gap-1">
          <span className="text-2xl opacity-60">💀</span>
          <span className="text-xl opacity-40">🔥</span>
          <span className="text-lg opacity-30">⚠️</span>
        </div>
        <div className="absolute top-[10%] left-1/2 -translate-x-1/2 z-20 mt-6">
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20 text-center">Some launch casualties.<br />We kept driving.</p>
        </div>

        {/* Lane markers */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(255,255,255,0.5) 40px, rgba(255,255,255,0.5) 41px)`,
        }} />
        
        {/* Road edges */}
        <div className="absolute left-4 sm:left-8 top-0 bottom-0 w-1 bg-[linear-gradient(180deg,rgba(255,255,255,0.4)_0%,rgba(255,255,255,0.1)_100%)]" />
        <div className="absolute right-4 sm:right-8 top-0 bottom-0 w-1 bg-[linear-gradient(180deg,rgba(255,255,255,0.4)_0%,rgba(255,255,255,0.1)_100%)]" />
        
        {/* Center dashed line — animated */}
        <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-1 flex flex-col overflow-hidden">
          {Array.from({ length: 40 }).map((_, i) => (
            <div 
              key={i} 
              className="h-6 sm:h-8 my-1 sm:my-1.5 bg-[linear-gradient(180deg,#fbbf24,#f59e0b)] rounded-sm opacity-80 transition-all" 
              style={{ 
                boxShadow: "0 0 8px rgba(251,191,36,0.3)",
                opacity: i / 40 < scrollProgress ? 0.3 + Math.sin(Date.now() / 500 + i) * 0.2 : 0.8,
              }} 
            />
          ))}
        </div>

        {/* Traveling car */}
        <div className="absolute inset-0 pointer-events-none">
          <TravelingCar scrollProgress={scrollProgress} />
        </div>

        {/* Floating road particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-red-500/40"
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${Math.random() * 100}%`,
                animation: `floatUp ${4 + Math.random() * 6}s linear infinite`,
                animationDelay: `${Math.random() * 5}s`,
                boxShadow: "0 0 6px rgba(255,68,68,0.4)",
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-8">
          <div className="text-center mb-10">
            <p className="text-[11px] font-black uppercase tracking-[0.4em] text-white/30">The Burn Trail</p>
            <h2 className="mt-2 text-3xl sm:text-4xl font-black text-white">Four exits. One destination.</h2>
            <p className="mt-2 text-sm text-white/30">⚠️ Some casualties at Mile 0. We kept driving.</p>
          </div>
          <div className="space-y-16 sm:space-y-20">
            {EXITS.map((exit, i) => {
              const side = i % 2 === 0 ? "left" : "right";
              return (
                <div key={exit.mile} data-mile className="relative">
                  <div className={cn("hidden lg:flex absolute top-0 z-20", side === "left" ? "right-[calc(50%+24px)]" : "left-[calc(50%+24px)]")}>
                    <RoadSign mile={exit.mile} title={exit.title} color={exit.color} />
                  </div>
                  {exit.status === "IN PROGRESS" && (
                    <div className="absolute left-1/2 -translate-x-1/2 -top-6 z-30">
                      <div className="relative">
                        <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(255,0,0,0.6)] animate-pulse">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                            <path d="M5 17h14M6 17v-5l3-4h6l3 4v5M9 8V6a2 2 0 012-2h2a2 2 0 012 2v2" />
                            <circle cx="7.5" cy="17" r="1.5" fill="white" stroke="none" />
                            <circle cx="16.5" cy="17" r="1.5" fill="white" stroke="none" />
                          </svg>
                        </div>
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-20 h-8 bg-[linear-gradient(180deg,rgba(255,200,100,0.3),transparent)] rounded-full" />
                      </div>
                    </div>
                  )}
                  <div className={cn("grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-16 items-start")}>
                    {side === "left" ? (
                      <><ExitCard exit={exit} side="left" onClick={() => onCardClick(exit)} /><div className="hidden lg:block" /></>
                    ) : (
                      <><div className="hidden lg:block" /><ExitCard exit={exit} side="right" onClick={() => onCardClick(exit)} /></>
                    )}
                  </div>
                  <div className={cn("hidden lg:flex absolute top-0 items-start gap-2 z-20", side === "left" ? "left-[calc(50%-40px)] flex-row-reverse" : "left-[calc(50%+16px)]")}>
                    <div className="w-6 h-16 bg-[linear-gradient(180deg,#22c55e,#15803d)] rounded-sm border border-white/20 flex flex-col items-center justify-center shadow-lg">
                      <span className="text-[8px] font-black text-white/80 uppercase tracking-wider rotate-180" style={{ writingMode: "vertical-rl" }}>{exit.mile}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-16 text-center">
            <div className="inline-block rounded-2xl border-2 border-white/20 bg-neutral-800 px-6 py-3 animate-pulse">
              <p className="text-xs font-black uppercase tracking-[0.3em] text-white/40">End of Road</p>
              <p className="text-lg font-black text-white mt-1">Destination: $MAD</p>
            </div>
          </div>
        </div>
      </div>
    </ShellWithRef>
  );
}

/* ═══════════════════════════════════════════════════════════
   COMMUNITY SUPPORT & CTA
   ═══════════════════════════════════════════════════════════ */

function CommunitySupport() {
  return (
    <Shell className="p-6 sm:p-8">
      <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-stretch">
        <div className="flex flex-col justify-between rounded-[1.75rem] border border-emerald-400/20 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.06),rgba(245,241,232,0.92))] p-6 sm:p-7">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.35em] text-emerald-600/70">Alliance Expansion</p>
            <h2 className="mt-3 text-3xl font-black text-[#1a1a1a] sm:text-5xl">4 Communities Supported.</h2>
            <p className="mt-4 max-w-3xl text-base leading-8 text-[#1a1a1a]/55 sm:text-lg">
              Before asking people to trust the mission, we showed loyalty in public. Three communities were supported through action, and the tokens were locked to prove long-term conviction.
            </p>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-emerald-400/20 bg-emerald-400/5 px-6 py-5">
              <p className="text-xs font-black uppercase tracking-[0.28em] text-emerald-600/70">Support Status</p>
              <p className="mt-2 text-3xl font-black text-emerald-600">4 Locked</p>
              <p className="mt-1 text-sm text-[#1a1a1a]/40">Backed publicly with receipts</p>
            </div>
            <div className="rounded-3xl border border-[#1a1a1a]/10 bg-[#1a1a1a]/[0.02] px-6 py-5">
              <p className="text-xs font-black uppercase tracking-[0.28em] text-[#1a1a1a]/40">Signal Sent</p>
              <p className="mt-2 text-3xl font-black text-[#1a1a1a]">Locked Up</p>
              <p className="mt-1 text-sm text-[#1a1a1a]/40">Commitment over quick exits</p>
            </div>
          </div>
        </div>
        <div className="rounded-[1.75rem] border border-[#1a1a1a]/10 bg-[#1a1a1a]/[0.02] p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-[#1a1a1a]/40">Proof of Work</p>
            <span className="rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-emerald-600">Verified Signal</span>
          </div>
          <div className="mt-4 rounded-[1.5rem] border border-[#1a1a1a]/10 bg-[#1a1a1a]/[0.03] p-5">
            <p className="text-lg font-black text-[#1a1a1a] sm:text-xl">Supported four communities.</p>
            <p className="mt-2 text-lg font-black text-emerald-600 sm:text-xl">Locked all the tokens.</p>
            <div className="mt-4 grid gap-4">
              <div className="rounded-[1.25rem] border border-[#1a1a1a]/10 overflow-hidden">
                <img src="/derpydave-lock-proof.png" alt="8,155,311 DERPYDAVE tokens locked via Streamflow until 2060" className="w-full h-auto" />
                <div className="px-4 py-3 bg-[#1a1a1a]/[0.02] border-t border-[#1a1a1a]/5">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1a1a1a]/30">Proof #1 — Apr 21, 2026</p>
                  <p className="text-xs text-[#1a1a1a]/40 mt-0.5">8,155,311 $DERPYDAVE · Streamflow · Non-cancelable until 2060</p>
                </div>
              </div>
              <div className="rounded-[1.25rem] border border-[#1a1a1a]/10 overflow-hidden">
                <img src="/rndy-lock-proof.png" alt="1,754,679 RNDY tokens locked via Streamflow until 2060" className="w-full h-auto" />
                <div className="px-4 py-3 bg-[#1a1a1a]/[0.02] border-t border-[#1a1a1a]/5">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1a1a1a]/30">Proof #2 — May 8, 2026</p>
                  <p className="text-xs text-[#1a1a1a]/40 mt-0.5">1,754,679 $RNDY · Streamflow · Non-cancelable until 2060</p>
                </div>
              </div>
              <div className="rounded-[1.25rem] border border-[#1a1a1a]/10 overflow-hidden">
                <img src="/touchgrass-lock-proof.png" alt="1,019,634 TOUCHGRASS tokens locked via Streamflow until 2060" className="w-full h-auto" />
                <div className="px-4 py-3 bg-[#1a1a1a]/[0.02] border-t border-[#1a1a1a]/5">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1a1a1a]/30">Proof #3 — May 10, 2026</p>
                  <p className="text-xs text-[#1a1a1a]/40 mt-0.5">1,019,634 $TOUCHGRASS · Streamflow · Non-cancelable until 2060</p>
                </div>
              </div>
              <div className="rounded-[1.25rem] border border-[#1a1a1a]/10 overflow-hidden">
                <img src="/hineycoin-lock-proof.png" alt="1,027,002 HINEY tokens locked via Streamflow until 2060" className="w-full h-auto" />
                <div className="px-4 py-3 bg-[#1a1a1a]/[0.02] border-t border-[#1a1a1a]/5">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1a1a1a]/30">Proof #4 — May 21, 2026</p>
                  <p className="text-xs text-[#1a1a1a]/40 mt-0.5">1,027,002 $HINEY · Streamflow · Non-cancelable until 2060</p>
                </div>
              </div>
            </div>
            <p className="mt-4 text-sm leading-7 text-[#1a1a1a]/55 sm:text-base">
              This milestone matters because it shows execution, patience, and visible commitment. Not theory. Not hype. Proof. Four times.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a href={LINKS.communityProof} target="_blank" rel="noreferrer" className="inline-flex items-center rounded-full border border-emerald-400/25 bg-emerald-400/10 px-5 py-3 text-sm font-black text-emerald-600 transition hover:scale-[1.02] hover:bg-emerald-400/15">
                Proof #1 →
              </a>
              <a href={LINKS.communityProof2} target="_blank" rel="noreferrer" className="inline-flex items-center rounded-full border border-emerald-400/25 bg-emerald-400/10 px-5 py-3 text-sm font-black text-emerald-600 transition hover:scale-[1.02] hover:bg-emerald-400/15">
                Proof #2 →
              </a>
              <a href={LINKS.communityProof3} target="_blank" rel="noreferrer" className="inline-flex items-center rounded-full border border-emerald-400/25 bg-emerald-400/10 px-5 py-3 text-sm font-black text-emerald-600 transition hover:scale-[1.02] hover:bg-emerald-400/15">
                Proof #3 →
              </a>
              <a href={LINKS.communityProof4} target="_blank" rel="noreferrer" className="inline-flex items-center rounded-full border border-emerald-400/25 bg-emerald-400/10 px-5 py-3 text-sm font-black text-emerald-600 transition hover:scale-[1.02] hover:bg-emerald-400/15">
                Proof #4 →
              </a>
              <span className="inline-flex items-center rounded-full border border-[#1a1a1a]/10 bg-[#1a1a1a]/[0.02] px-4 py-3 text-sm font-semibold text-[#1a1a1a]/60">Public receipts on X</span>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}

function CTASection() {
  return (
    <Shell className="p-6 sm:p-8">
      <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <h2 className="text-4xl font-black text-[#1a1a1a] sm:text-6xl">THIS IS YOUR PATH.</h2>
          <p className="mt-4 max-w-2xl text-base leading-8 text-[#1a1a1a]/55 sm:text-lg">Build. Prove. Expand.</p>
        </div>
        <div style={{ animation: "glowPulse 3s ease-in-out infinite" }}>
          <style>{`@keyframes glowPulse { 0%,100%{box-shadow:0 0 20px rgba(255,45,45,0.15)} 50%{box-shadow:0 0 35px rgba(255,45,45,0.28)}`}</style>
          <a href={LINKS.buy} target="_blank" rel="noreferrer" className="inline-flex rounded-full border border-[#FF2D2D]/35 bg-[#FF2D2D] px-8 py-4 text-base font-black text-white shadow-[0_0_22px_rgba(255,45,45,0.15)] transition hover:scale-[1.02] hover:bg-[#FF6B00]">
            Start Your Journey →
          </a>
        </div>
      </div>
    </Shell>
  );
}

function RiskNotice() {
  return (
    <Shell className="border-[#FF2D2D]/15 bg-[#FF2D2D]/[0.03] px-6 py-8 sm:px-10 sm:py-10">
      <p className="text-center text-xs font-black uppercase tracking-[0.38em] text-[#FF2D2D]/70">Risk Notice</p>
      <p className="mx-auto mt-5 max-w-6xl text-center text-base leading-9 text-[#1a1a1a]/60 sm:text-xl">
        $MAD is a meme coin and speculative digital asset. Nothing on this website is financial advice or a guarantee of returns. Crypto is risky and volatile. Never risk money you cannot afford to lose. Always do your own research.
      </p>
    </Shell>
  );
}

/* ═══════════════════════════════════════════════════════════
   KEYFRAME ANIMATIONS
   ═══════════════════════════════════════════════════════════ */
function GlobalStyles() {
  return (
    <style>{`
      @keyframes floatUp {
        0% { transform: translateY(100px); opacity: 0; }
        10% { opacity: 1; }
        90% { opacity: 1; }
        100% { transform: translateY(-100px); opacity: 0; }
      }
      @keyframes glowPulse {
        0%, 100% { box-shadow: 0 0 20px rgba(255,45,45,0.15); }
        50% { box-shadow: 0 0 35px rgba(255,45,45,0.28); }
      }
      @keyframes pulse {
        0%, 100% { opacity: 0.4; }
        50% { opacity: 1; }
      }
    `}</style>
  );
}

/* ═══════════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════════ */

export default function RoadmapPage() {
  const [selectedExit, setSelectedExit] = useState<typeof EXITS[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openProof = (exit: typeof EXITS[0]) => {
    setSelectedExit(exit);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#F5F1E8] text-[#1a1a1a]">
      <GlobalStyles />
      <FloatingDust />
      <ScrollProgress />

      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(255,45,45,0.06),transparent_28%),radial-gradient(circle_at_80%_10%,rgba(16,185,129,0.04),transparent_22%),radial-gradient(circle_at_50%_80%,rgba(26,26,26,0.03),transparent_25%)]" />
      
      <main className="mx-auto max-w-7xl px-4 pb-20 pt-6 sm:px-6 lg:px-8 relative z-10">
        <div className="grid gap-6">
          <FadeIn>
            <ProgressStrip />
          </FadeIn>
          <FadeIn delay={0.05}>
            <ChaosMeter />
          </FadeIn>
          <FadeIn delay={0.08}>
            <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-9">
              {STATUS_CARDS.map((card) => (
                <StatusMiniCard key={card.label} label={card.label} value={card.value} tone={card.tone} icon={card.icon} />
              ))}
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <Highway onCardClick={openProof} />
          </FadeIn>
          <FadeIn delay={0.1}>
            <CommunitySupport />
          </FadeIn>
          <FadeIn delay={0.1}>
            <CTASection />
          </FadeIn>
          <FadeIn delay={0.1}>
            <RiskNotice />
          </FadeIn>
        </div>
      </main>

      <ProofModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setSelectedExit(null); }}
        exit={selectedExit}
      />
    </div>
  );
}
