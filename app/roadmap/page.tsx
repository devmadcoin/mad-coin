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

/* ─── Scanlines ─── */
function Scanlines() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[100] opacity-[0.02]"
      style={{
        backgroundImage: "linear-gradient(to bottom, rgba(0,0,0,0.03) 1px, transparent 1px)",
        backgroundSize: "100% 3px",
      }}
    />
  );
}

/* ─── Navbar (matches homepage) ─── */
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
          <div className="w-8 h-8 rounded-full bg-[#FF2D2D] flex items-center justify-center text-white font-black text-sm">M</div>
          <span className="text-white font-black text-sm tracking-tight">$MAD</span>
        </Link>
        <div className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <Link key={l.label} href={l.href}
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
   BUBBLE MAP DATA
   ═══════════════════════════════════════════════════════════ */

interface BubbleData {
  id: string;
  label: string;
  icon: string;
  description: string;
  status: "live" | "wip" | "coming";
  milestones: { text: string; done: boolean }[];
  color: string;
  glowColor: string;
  angle: number;
  distance: number;
}

const BUBBLES: BubbleData[] = [
  {
    id: "games", label: "Games", icon: "🎮",
    description: "Mad Phonk Awakening on Roblox. Built. Live. Crushing.",
    status: "live", color: "#FF2D2D", glowColor: "rgba(255,45,45,0.3)",
    angle: 270, distance: 38,
    milestones: [
      { text: "Mad Phonk Awakening launched on Roblox", done: true },
      { text: "$MAD token integration in-game", done: true },
      { text: "Leaderboards & competitive modes", done: false },
      { text: "Mobile port", done: false },
    ],
  },
  {
    id: "merch", label: "Merch", icon: "👕",
    description: "Physical + digital drops. Every item tells a story.",
    status: "wip", color: "#FF6B00", glowColor: "rgba(255,107,0,0.3)",
    angle: 321, distance: 38,
    milestones: [
      { text: "Design system & story-driven items", done: true },
      { text: "The Rugged Tee concept", done: true },
      { text: "Digital twin NFTs for each item", done: false },
      { text: "First drop live", done: false },
    ],
  },
  {
    id: "music", label: "Music", icon: "🎵",
    description: "Soundtrack to the madness. Phonk, rage, victory.",
    status: "coming", color: "#FFD700", glowColor: "rgba(255,215,0,0.3)",
    angle: 13, distance: 38,
    milestones: [
      { text: "MAD Phonk soundtrack EP", done: false },
      { text: "Artist collaborations", done: false },
      { text: "Music NFT drops", done: false },
      { text: "Live DJ sets / Events", done: false },
    ],
  },
  {
    id: "food", label: "Food", icon: "🍔",
    description: "$MAD Bites. Fuel for the trenches.",
    status: "coming", color: "#22c55e", glowColor: "rgba(34,197,94,0.3)",
    angle: 64, distance: 38,
    milestones: [
      { text: "$MAD Bites concept", done: false },
      { text: "Pop-up food truck at events", done: false },
      { text: "Collaboration with food brands", done: false },
      { text: "MAD Meal NFT combos", done: false },
    ],
  },
  {
    id: "content", label: "Content", icon: "📹",
    description: "The MAD Show. Animations, lore, weekly drops.",
    status: "live", color: "#A855F7", glowColor: "rgba(168,85,247,0.3)",
    angle: 115, distance: 38,
    milestones: [
      { text: "'I'M MAD GETTING RUGGED' animation", done: true },
      { text: "Coffee Collects YouTube (3 channels)", done: true },
      { text: "MAD Chronicles Episode 2", done: false },
      { text: "Weekly MAD Minute shorts", done: false },
    ],
  },
  {
    id: "events", label: "Events", icon: "🎉",
    description: "IRL activations. The Initiation. Pop-ups. Chaos.",
    status: "coming", color: "#00D4FF", glowColor: "rgba(0,212,255,0.3)",
    angle: 166, distance: 38,
    milestones: [
      { text: "Solana Breakpoint activation", done: false },
      { text: "MAD Initiation scavenger hunt", done: false },
      { text: "Community meetups", done: false },
      { text: "Global tour", done: false },
    ],
  },
  {
    id: "finance", label: "Finance", icon: "💰",
    description: "Staking, burns, treasury. The economic engine.",
    status: "live", color: "#10b981", glowColor: "rgba(16,185,129,0.3)",
    angle: 217, distance: 38,
    milestones: [
      { text: "50% supply burned", done: true },
      { text: "7 communities locked to 2060", done: true },
      { text: "Burn #2 protocol (10K holders)", done: false },
      { text: "Staking + revenue share", done: false },
    ],
  },
];

/* ═══════════════════════════════════════════════════════════
   BUBBLE MAP — Interactive ecosystem visualization
   ═══════════════════════════════════════════════════════════ */

function BubbleMap() {
  const [activeBubble, setActiveBubble] = useState<string | null>(null);
  const [hoveredBubble, setHoveredBubble] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  useEffect(() => {
    const update = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({ width: rect.width, height: rect.height });
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const centerX = dimensions.width / 2;
  const centerY = dimensions.height / 2;
  const centerRadius = Math.min(dimensions.width, dimensions.height) * 0.11;
  const bubbleRadius = Math.min(dimensions.width, dimensions.height) * 0.095;

  const getBubblePos = (bubble: BubbleData) => {
    const rad = (bubble.angle * Math.PI) / 180;
    const dist = Math.min(dimensions.width, dimensions.height) * (bubble.distance / 100);
    return {
      x: centerX + Math.cos(rad) * dist,
      y: centerY + Math.sin(rad) * dist,
    };
  };

  const activeData = BUBBLES.find(b => b.id === activeBubble);

  return (
    <div className="relative w-full" style={{ minHeight: "600px" }}>
      {/* SVG Connections */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 1 }}
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
      >
        <defs>
          {BUBBLES.map((bubble) => (
            <linearGradient key={bubble.id} id={`line-${bubble.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={bubble.color} stopOpacity="0.3" />
              <stop offset="100%" stopColor={bubble.color} stopOpacity="0.1" />
            </linearGradient>
          ))}
        </defs>
        {BUBBLES.map((bubble) => {
          const pos = getBubblePos(bubble);
          const isHovered = hoveredBubble === bubble.id;
          const isActive = activeBubble === bubble.id;
          const angleRad = (bubble.angle * Math.PI) / 180;
          const startX = centerX + Math.cos(angleRad) * centerRadius;
          const startY = centerY + Math.sin(angleRad) * centerRadius;
          const endX = pos.x - Math.cos(angleRad) * bubbleRadius;
          const endY = pos.y - Math.sin(angleRad) * bubbleRadius;

          return (
            <g key={`line-${bubble.id}`}>
              <line
                x1={startX} y1={startY} x2={endX} y2={endY}
                stroke={isHovered || isActive ? bubble.color : "rgba(255,255,255,0.08)"}
                strokeWidth={isHovered || isActive ? 3 : 1.5}
                strokeOpacity={isHovered || isActive ? 0.5 : 0.08}
                strokeDasharray={bubble.status === "coming" ? "6,4" : "none"}
                style={{ transition: "all 0.3s ease" }}
              />
            </g>
          );
        })}
      </svg>

      {/* Center MAD Logo */}
      <div
        className="absolute flex items-center justify-center"
        style={{
          left: centerX - centerRadius,
          top: centerY - centerRadius,
          width: centerRadius * 2,
          height: centerRadius * 2,
          zIndex: 10,
        }}
      >
        <div
          className="relative cursor-pointer group"
          style={{
            width: centerRadius * 2,
            height: centerRadius * 2,
            borderRadius: "50%",
            overflow: "hidden",
            border: "3px solid rgba(255,255,255,0.1)",
            boxShadow: "0 0 30px rgba(255,45,45,0.2), 0 4px 20px rgba(0,0,0,0.3)",
          }}
          onClick={() => setActiveBubble(null)}
        >
          <img
            src="/mad-logo.png"
            alt="$MAD"
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        </div>
        <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">$MAD Core</span>
        </div>
      </div>

      {/* Bubbles */}
      {BUBBLES.map((bubble) => {
        const pos = getBubblePos(bubble);
        const isHovered = hoveredBubble === bubble.id;
        const isActive = activeBubble === bubble.id;
        const completedCount = bubble.milestones.filter(m => m.done).length;
        const totalCount = bubble.milestones.length;
        const progressPct = Math.round((completedCount / totalCount) * 100);

        return (
          <div
            key={bubble.id}
            className="absolute cursor-pointer"
            style={{
              left: pos.x - bubbleRadius,
              top: pos.y - bubbleRadius,
              width: bubbleRadius * 2,
              height: bubbleRadius * 2,
              zIndex: isHovered || isActive ? 20 : 5,
            }}
            onMouseEnter={() => setHoveredBubble(bubble.id)}
            onMouseLeave={() => setHoveredBubble(null)}
            onClick={() => setActiveBubble(activeBubble === bubble.id ? null : bubble.id)}
          >
            <div
              className="relative w-full h-full rounded-full flex flex-col items-center justify-center transition-all duration-300"
              style={{
                background: isHovered || isActive
                  ? `radial-gradient(circle at 30% 30%, ${bubble.color}22, ${bubble.color}08)`
                  : "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
                border: `2.5px solid ${isHovered || isActive ? bubble.color : "rgba(255,255,255,0.08)"}`,
                boxShadow: isHovered || isActive
                  ? `0 0 40px ${bubble.glowColor}, 0 8px 32px rgba(0,0,0,0.3)`
                  : "0 4px 20px rgba(0,0,0,0.2)",
                transform: isHovered || isActive ? "scale(1.15)" : "scale(1)",
              }}
            >
              {(isHovered || isActive) && (
                <div
                  className="absolute inset-0 rounded-full pointer-events-none"
                  style={{
                    border: `2px solid ${bubble.color}`,
                    opacity: 0.4,
                    animation: "madPulse 2s ease-in-out infinite",
                  }}
                />
              )}
              <div
                className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full"
                style={{
                  background: bubble.status === "live" ? "#22c55e" : bubble.status === "wip" ? "#FF6B00" : "rgba(255,255,255,0.3)",
                  boxShadow: `0 0 8px ${bubble.status === "live" ? "rgba(34,197,94,0.5)" : bubble.status === "wip" ? "rgba(255,107,0,0.5)" : "rgba(255,255,255,0.2)"}`,
                }}
              />
              <span className="text-2xl sm:text-3xl mb-1">{bubble.icon}</span>
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-white/70">{bubble.label}</span>
              <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="46" fill="none" stroke={bubble.color} strokeWidth="2" opacity="0.15" />
                <circle
                  cx="50" cy="50" r="46"
                  fill="none"
                  stroke={bubble.color}
                  strokeWidth="2"
                  strokeDasharray={`${(progressPct / 100) * 289} 289`}
                  strokeLinecap="round"
                  opacity="0.6"
                />
              </svg>
            </div>
          </div>
        );
      })}

      {/* Active Bubble Detail Panel */}
      {activeData && (
        <div
          className="absolute z-30 w-full max-w-md"
          style={{ left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}
        >
          <div
            className="rounded-[2rem] border p-6 sm:p-8 shadow-2xl backdrop-blur-xl"
            style={{
              background: "rgba(18,18,18,0.95)",
              borderColor: `${activeData.color}40`,
              boxShadow: `0 0 60px ${activeData.glowColor}`,
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{activeData.icon}</span>
                <div>
                  <h3 className="text-xl font-black text-white">{activeData.label}</h3>
                  <span
                    className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full"
                    style={{
                      background: activeData.status === "live" ? "rgba(34,197,94,0.15)" : activeData.status === "wip" ? "rgba(255,107,0,0.15)" : "rgba(255,255,255,0.08)",
                      color: activeData.status === "live" ? "#22c55e" : activeData.status === "wip" ? "#FF6B00" : "rgba(255,255,255,0.5)",
                    }}
                  >
                    {activeData.status === "live" ? "LIVE" : activeData.status === "wip" ? "IN PROGRESS" : "COMING SOON"}
                  </span>
                </div>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); setActiveBubble(null); }}
                className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition"
              >
                ✕
              </button>
            </div>
            <p className="text-sm text-white/50 mb-5">{activeData.description}</p>
            <div className="space-y-2">
              {activeData.milestones.map((m) => (
                <div key={m.text} className="flex items-center gap-3 p-2.5 rounded-xl border min-w-0"
                  style={{
                    background: m.done ? `${activeData.color}08` : "rgba(255,255,255,0.02)",
                    borderColor: m.done ? `${activeData.color}20` : "rgba(255,255,255,0.06)",
                  }}
                >
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0"
                    style={{
                      background: m.done ? activeData.color : "rgba(255,255,255,0.08)",
                      color: m.done ? "white" : "rgba(255,255,255,0.3)",
                    }}
                  >
                    {m.done ? "✓" : "○"}
                  </div>
                  <span className={`text-sm break-words min-w-0 ${m.done ? "text-white/80" : "text-white/40"}`}>
                    {m.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 z-10">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider">Live</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-[#FF6B00]" />
          <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider">WIP</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-white/30" />
          <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider">Soon</span>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   QUICK STATS BAR
   ═══════════════════════════════════════════════════════════ */
function QuickStats() {
  const stats = [
    { label: "Market Cap", value: "$90M+", color: "#FF2D2D" },
    { label: "Supply Burned", value: "50%", color: "#FF6B00" },
    { label: "Communities", value: "7 Locked", color: "#22c55e" },
    { label: "Holders", value: "3,940+", color: "#A855F7" },
  ];
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {stats.map((s) => (
        <div key={s.label} className="rounded-2xl border border-white/5 bg-white/[0.03] p-4 text-center">
          <p className="text-lg sm:text-2xl font-black" style={{ color: s.color }}>{s.value}</p>
          <p className="text-[10px] font-bold uppercase tracking-wider text-white/40 mt-1">{s.label}</p>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   CTA SECTION
   ═══════════════════════════════════════════════════════════ */
function CTASection() {
  return (
    <div className="rounded-[2rem] border border-white/5 bg-white/[0.03] p-6 sm:p-10 text-center">
      <h2 className="text-2xl sm:text-4xl font-black text-white mb-4">THE $MAD ECOSYSTEM.</h2>
      <p className="text-sm sm:text-base text-white/40 max-w-xl mx-auto mb-6">
        Seven bubbles. One core. Every piece connected. Click any bubble to explore.
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
      <p className="text-[10px] font-black uppercase tracking-[0.38em] text-[#FF2D2D]/70 mb-3">Risk Notice</p>
      <p className="text-xs sm:text-sm text-white/40 max-w-3xl mx-auto leading-relaxed">
        $MAD is a meme coin and speculative digital asset. Nothing on this website is financial advice.
        Crypto is risky and volatile. Never risk money you cannot afford to lose.
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   GLOBAL STYLES
   ═══════════════════════════════════════════════════════════ */
function GlobalStyles() {
  return (
    <style>{`
      @keyframes madPulse {
        0%, 100% { transform: scale(1); opacity: 0.4; }
        50% { transform: scale(1.25); opacity: 0.1; }
      }
    `}</style>
  );
}

/* ═══════════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════════ */

export default function RoadmapPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#080808] text-white relative">
      <GlobalStyles />
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
              Seven bubbles. One MAD core. <br className="hidden sm:block" />
              Click to explore every pillar of the universe.
            </p>
          </FadeIn>
        </div>

        <div className="grid gap-6">
          <FadeIn delay={0.05}>
            <QuickStats />
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="rounded-[2rem] border border-white/5 bg-[#121212] shadow-[0_18px_60px_rgba(0,0,0,0.3)]">
              <div className="p-4 sm:p-6">
                <div className="text-center mb-2">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">
                    Click any bubble to explore
                  </p>
                </div>
                {/* Mobile: horizontal scroll to see full map */}
                <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 sm:overflow-visible">
                  <div className="min-w-[500px] sm:min-w-0">
                    <BubbleMap />
                  </div>
                </div>
              </div>
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
