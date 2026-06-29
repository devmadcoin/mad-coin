"use client";

import type { ReactNode } from "react";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";

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
  direction = "up",
  duration = 0.5,
  distance = 24,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  duration?: number;
  distance?: number;
}) {
  const { ref, isInView } = useInView();
  const transforms = {
    up: `translateY(${distance}px)`,
    down: `translateY(-${distance}px)`,
    left: `translateX(${distance}px)`,
    right: `translateX(-${distance}px)`,
  };
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isInView ? 1 : 0,
        transform: isInView ? "translate(0)" : transforms[direction],
        transition: `opacity ${duration}s cubic-bezier(0.25,0.46,0.45,0.94) ${delay}s, transform ${duration}s cubic-bezier(0.25,0.46,0.45,0.94) ${delay}s`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}

/* ─── Scanlines ─── */
function Scanlines() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-[100] opacity-[0.02]"
      style={{
        backgroundImage:
          "linear-gradient(to bottom, rgba(0,0,0,0.03) 1px, transparent 1px)",
        backgroundSize: "100% 3px",
      }}
    />
  );
}

/* ─── Navbar ─── */
function Navbar() {
  const links = [
    { label: "Home", href: "/" },
    { label: "MAD AI", href: "/mad-mind" },
    { label: "Roadmap", href: "/roadmap", active: true },
    { label: "Game", href: "/game" },
    { label: "MAD Art", href: "/mad-art" },
    { label: "Rewards", href: "/rewards" },
    { label: "Merch", href: "/merch" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#080808]/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#FF2D2D] flex items-center justify-center text-white font-black text-sm">
            M
          </div>
          <span className="text-white font-black text-sm tracking-tight">$MAD</span>
        </Link>
        <div className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-all ${
                l.active
                  ? "bg-[#FF2D2D]/10 text-[#FF2D2D]"
                  : "text-white/40 hover:text-white hover:bg-white/5"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}

/* ═══════════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════════ */

interface PillarData {
  id: string;
  label: string;
  icon: string;
  description: string;
  status: "live" | "wip" | "coming";
  milestones: { text: string; done: boolean }[];
  color: string;
  glowColor: string;
}

const PILLARS: PillarData[] = [
  {
    id: "games",
    label: "Games",
    icon: "🎮",
    description: "Mad Phonk Awakening on Roblox. Built. Live. Crushing.",
    status: "live",
    color: "#FF2D2D",
    glowColor: "rgba(255,45,45,0.3)",
    milestones: [
      { text: "Mad Phonk Awakening launched on Roblox", done: true },
      { text: "$MAD token integration in-game", done: true },
      { text: "Leaderboards & competitive modes", done: false },
      { text: "Mobile port", done: false },
    ],
  },
  {
    id: "merch",
    label: "Merch",
    icon: "👕",
    description: "Physical + digital drops. Every item tells a story.",
    status: "wip",
    color: "#FF6B00",
    glowColor: "rgba(255,107,0,0.3)",
    milestones: [
      { text: "Design system & story-driven items", done: true },
      { text: "The Rugged Tee concept", done: true },
      { text: "Digital twin NFTs for each item", done: false },
      { text: "First drop live", done: false },
    ],
  },
  {
    id: "music",
    label: "Music",
    icon: "🎵",
    description: "Soundtrack to the madness. Phonk, rage, victory.",
    status: "coming",
    color: "#FFD700",
    glowColor: "rgba(255,215,0,0.3)",
    milestones: [
      { text: "MAD Phonk soundtrack EP", done: false },
      { text: "Artist collaborations", done: false },
      { text: "Music NFT drops", done: false },
      { text: "Live DJ sets / Events", done: false },
    ],
  },
  {
    id: "food",
    label: "Food",
    icon: "🍔",
    description: "$MAD Bites. Fuel for the trenches.",
    status: "coming",
    color: "#22c55e",
    glowColor: "rgba(34,197,94,0.3)",
    milestones: [
      { text: "$MAD Bites concept", done: false },
      { text: "Pop-up food truck at events", done: false },
      { text: "Collaboration with food brands", done: false },
      { text: "MAD Meal NFT combos", done: false },
    ],
  },
  {
    id: "content",
    label: "Content",
    icon: "📹",
    description: "The MAD Show. Animations, lore, weekly drops.",
    status: "live",
    color: "#A855F7",
    glowColor: "rgba(168,85,247,0.3)",
    milestones: [
      { text: "'I'M MAD GETTING RUGGED' animation", done: true },
      { text: "Coffee Collects YouTube (3 channels)", done: true },
      { text: "MAD Chronicles Episode 2", done: false },
      { text: "Weekly MAD Minute shorts", done: false },
    ],
  },
  {
    id: "events",
    label: "Events",
    icon: "🎉",
    description: "IRL activations. The Initiation. Pop-ups. Chaos.",
    status: "coming",
    color: "#00D4FF",
    glowColor: "rgba(0,212,255,0.3)",
    milestones: [
      { text: "Solana Breakpoint activation", done: false },
      { text: "MAD Initiation scavenger hunt", done: false },
      { text: "Community meetups", done: false },
      { text: "Global tour", done: false },
    ],
  },
  {
    id: "finance",
    label: "Finance",
    icon: "💰",
    description: "Staking, burns, treasury. The economic engine.",
    status: "live",
    color: "#10b981",
    glowColor: "rgba(16,185,129,0.3)",
    milestones: [
      { text: "50% supply burned", done: true },
      { text: "7 communities locked to 2060", done: true },
      { text: "Burn #2 protocol (10K holders)", done: false },
      { text: "Staking + revenue share", done: false },
    ],
  },
];

/* ═══════════════════════════════════════════════════════════
   QUICK STATS — Solid colored backgrounds, no inline styles
   ═══════════════════════════════════════════════════════════ */
function QuickStats() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <div className="rounded-2xl p-4 text-center border border-red-500/20 bg-red-500/10">
        <p className="text-xl sm:text-2xl font-black text-red-400">$90M+</p>
        <p className="text-[10px] font-bold uppercase tracking-wider text-white/70 mt-1">Market Cap</p>
      </div>
      <div className="rounded-2xl p-4 text-center border border-orange-500/20 bg-orange-500/10">
        <p className="text-xl sm:text-2xl font-black text-orange-400">50%</p>
        <p className="text-[10px] font-bold uppercase tracking-wider text-white/70 mt-1">Supply Burned</p>
      </div>
      <div className="rounded-2xl p-4 text-center border border-emerald-500/20 bg-emerald-500/10">
        <p className="text-xl sm:text-2xl font-black text-emerald-400">7 Locked</p>
        <p className="text-[10px] font-bold uppercase tracking-wider text-white/70 mt-1">Communities</p>
      </div>
      <div className="rounded-2xl p-4 text-center border border-purple-500/20 bg-purple-500/10">
        <p className="text-xl sm:text-2xl font-black text-purple-400">3,940+</p>
        <p className="text-[10px] font-bold uppercase tracking-wider text-white/70 mt-1">Holders</p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   PILLAR CARD — Tailwind only, solid backgrounds
   ═══════════════════════════════════════════════════════════ */
function PillarCard({ bubble }: { bubble: PillarData }) {
  const completedCount = bubble.milestones.filter((m) => m.done).length;
  const totalCount = bubble.milestones.length;
  const progressPct = Math.round((completedCount / totalCount) * 100);

  const statusConfig = {
    live: { label: "● LIVE", bg: "bg-emerald-500/15", color: "text-emerald-400" },
    wip: { label: "◐ IN PROGRESS", bg: "bg-orange-500/15", color: "text-orange-400" },
    coming: { label: "○ COMING SOON", bg: "bg-white/10", color: "text-white/50" },
  };
  const status = statusConfig[bubble.status];

  // Color map for border/progress
  const colorMap: Record<string, { border: string; bar: string; checkBg: string; checkText: string; glow: string }> = {
    "#FF2D2D": { border: "border-red-500/30", bar: "bg-red-500", checkBg: "bg-red-500", checkText: "text-white", glow: "shadow-red-500/20" },
    "#FF6B00": { border: "border-orange-500/30", bar: "bg-orange-500", checkBg: "bg-orange-500", checkText: "text-white", glow: "shadow-orange-500/20" },
    "#FFD700": { border: "border-yellow-500/30", bar: "bg-yellow-500", checkBg: "bg-yellow-500", checkText: "text-black", glow: "shadow-yellow-500/20" },
    "#22c55e": { border: "border-emerald-500/30", bar: "bg-emerald-500", checkBg: "bg-emerald-500", checkText: "text-white", glow: "shadow-emerald-500/20" },
    "#A855F7": { border: "border-purple-500/30", bar: "bg-purple-500", checkBg: "bg-purple-500", checkText: "text-white", glow: "shadow-purple-500/20" },
    "#00D4FF": { border: "border-cyan-500/30", bar: "bg-cyan-400", checkBg: "bg-cyan-400", checkText: "text-black", glow: "shadow-cyan-500/20" },
    "#10b981": { border: "border-teal-500/30", bar: "bg-teal-500", checkBg: "bg-teal-500", checkText: "text-white", glow: "shadow-teal-500/20" },
  };
  const cm = colorMap[bubble.color] || colorMap["#FF2D2D"];

  return (
    <div className={`rounded-2xl border-2 p-5 sm:p-6 bg-[#1a1a1a] transition-all duration-300 hover:scale-[1.02] ${cm.border} ${cm.glow} shadow-lg`}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-3xl">{bubble.icon}</span>
        <div className="flex-1">
          <h3 className="text-lg font-black text-white">{bubble.label}</h3>
          <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full inline-block mt-1 ${status.bg} ${status.color}`}>
            {status.label}
          </span>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-white/50 mb-4 leading-relaxed">
        {bubble.description}
      </p>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[9px] font-black uppercase tracking-wider text-white/30">
            Progress
          </span>
          <span className="text-[9px] font-black text-white/50">
            {completedCount}/{totalCount}
          </span>
        </div>
        <div className="h-2 rounded-full bg-white/5 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${cm.bar}`}
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Milestones */}
      <div className="space-y-2">
        {bubble.milestones.map((m) => (
          <div key={m.text} className="flex items-center gap-2.5">
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black shrink-0 ${
                m.done ? `${cm.checkBg} ${cm.checkText}` : "bg-white/[0.08] text-white/25"
              }`}
            >
              {m.done ? "✓" : "○"}
            </div>
            <span className={`text-xs ${m.done ? "text-white/70" : "text-white/30"}`}>
              {m.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   ROADMAP CARDS — Mobile swipe, Desktop grid
   ═══════════════════════════════════════════════════════════ */
function RoadmapCards() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const scrollLeft = scrollRef.current.scrollLeft;
    const cardWidth = scrollRef.current.offsetWidth * 0.85 + 16;
    const newIndex = Math.round(scrollLeft / cardWidth);
    setActiveIndex(Math.min(Math.max(newIndex, 0), PILLARS.length - 1));
  };

  const scrollTo = (index: number) => {
    if (!scrollRef.current) return;
    const cardWidth = scrollRef.current.offsetWidth * 0.85 + 16;
    scrollRef.current.scrollTo({
      left: index * cardWidth,
      behavior: "smooth",
    });
  };

  return (
    <div>
      {/* Mobile: horizontal scroll */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 sm:hidden"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {PILLARS.map((bubble) => (
          <div key={bubble.id} className="snap-center" style={{ width: "85vw", flexShrink: 0 }}>
            <PillarCard bubble={bubble} />
          </div>
        ))}
      </div>

      {/* Desktop: grid */}
      <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {PILLARS.map((bubble) => (
          <PillarCard key={bubble.id} bubble={bubble} />
        ))}
      </div>

      {/* Mobile: Dots + Swipe hint */}
      {isMobile && (
        <div className="mt-4 flex flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            {PILLARS.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollTo(i)}
                className="transition-all duration-300 rounded-full"
                style={{
                  width: i === activeIndex ? 24 : 8,
                  height: 8,
                  background: i === activeIndex ? "#FF2D2D" : "rgba(255,255,255,0.15)",
                }}
              />
            ))}
          </div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-white/20">
            ← Swipe to explore →
          </p>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   CTA SECTION
   ═══════════════════════════════════════════════════════════ */
function CTASection() {
  return (
    <div className="rounded-[2rem] border border-white/5 bg-white/[0.03] p-6 sm:p-10 text-center">
      <h2 className="text-2xl sm:text-4xl font-black text-white mb-4">
        THE $MAD ECOSYSTEM.
      </h2>
      <p className="text-sm sm:text-base text-white/40 max-w-xl mx-auto mb-6">
        Seven pillars. One MAD core. Every piece connected. Swipe to explore.
      </p>
      <a
        href="https://jup.ag/swap?sell=So11111111111111111111111111111111111111112&buy=Fa7ZE9nCEYnrHsnoeHuhEExJpchtrBtKXnWe6CgHpump"
        target="_blank"
        rel="noreferrer"
        className="inline-flex rounded-full border border-[#FF2D2D]/40 bg-gradient-to-r from-[#FF2D2D] to-[#FF6B00] px-6 py-3 sm:px-8 sm:py-4 text-sm sm:text-base font-black text-white shadow-[0_0_25px_rgba(255,45,45,0.3)] transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_40px_rgba(255,45,45,0.5)]"
      >
        Join The Ecosystem →
      </a>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   RISK NOTICE
   ═══════════════════════════════════════════════════════════ */
function RiskNotice() {
  return (
    <div className="rounded-[2rem] border border-[#FF2D2D]/15 bg-[#FF2D2D]/[0.03] px-5 py-6 sm:px-10 sm:py-8 text-center">
      <p className="text-[10px] font-black uppercase tracking-[0.38em] text-[#FF2D2D]/70 mb-3">
        Risk Notice
      </p>
      <p className="text-xs sm:text-sm text-white/40 max-w-3xl mx-auto leading-relaxed">
        $MAD is a meme coin and speculative digital asset. Nothing on this
        website is financial advice. Crypto is risky and volatile. Never risk
        money you cannot afford to lose.
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════════ */

export default function RoadmapPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#080808] text-white relative">
      <Scanlines />
      <Navbar />

      {/* Background gradient */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_50%_30%,rgba(255,45,45,0.04),transparent_50%),radial-gradient(circle_at_20%_80%,rgba(255,107,0,0.03),transparent_40%)]" />

      <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-20 pt-6 relative z-10">
        {/* Hero Header */}
        <div className="relative pt-12 pb-6 sm:pt-20 sm:pb-10 text-center">
          <FadeIn>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#FF6B00]/60 mb-3">
              The Ecosystem
            </p>
            <h1
              className="text-4xl sm:text-6xl lg:text-7xl font-black leading-[0.95] mb-4"
              style={{
                background: "linear-gradient(135deg, #FF2D2D, #FF6B00, #FFD700)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              ROADMAP
            </h1>
            <p className="text-sm sm:text-base text-white/40 max-w-md mx-auto leading-relaxed">
              Seven pillars. One MAD core. Swipe to explore every piece of the
              universe.
            </p>
          </FadeIn>
        </div>

        <div className="grid gap-6">
          <FadeIn delay={0.05}>
            <QuickStats />
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="rounded-[2rem] border border-white/5 bg-[#121212] shadow-[0_18px_60px_rgba(0,0,0,0.3)] p-4 sm:p-6">
              <div className="text-center mb-4">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">
                  Swipe to explore the ecosystem
                </p>
              </div>
              <RoadmapCards />
            </div>
          </FadeIn>

          <FadeIn delay={0.15}>
            <CTASection />
          </FadeIn>

          <FadeIn delay={0.2}>
            <RiskNotice />
          </FadeIn>
        </div>
      </main>
    </div>
  );
}
