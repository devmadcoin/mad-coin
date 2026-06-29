"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";

/* ═══════════════════════════════════════════════════════════
   ANIMATION
   ═══════════════════════════════════════════════════════════ */
function useInView(options?: IntersectionObserverInit) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsInView(true); observer.disconnect(); } },
      { threshold: 0.1, ...options }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [options]);
  return { ref, isInView };
}

function FadeIn({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const { ref, isInView } = useInView();
  return (
    <div ref={ref} className={className} style={{
      opacity: isInView ? 1 : 0, transform: isInView ? "translateY(0)" : "translateY(20px)",
      transition: `opacity 0.5s ease ${delay}s, transform 0.5s ease ${delay}s`,
    }}>{children}</div>
  );
}

/* ─── Navbar ─── */
function Navbar() {
  const links = [
    { label: "Home", href: "/" }, { label: "MAD AI", href: "/mad-mind" },
    { label: "Roadmap", href: "/roadmap", active: true }, { label: "Game", href: "/game" },
    { label: "MAD Art", href: "/mad-art" }, { label: "Rewards", href: "/rewards" }, { label: "Merch", href: "/merch" },
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
              className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-all ${l.active ? "bg-[#FF2D2D]/10 text-[#FF2D2D]" : "text-white/40 hover:text-white hover:bg-white/5"}`}
            >{l.label}</Link>
          ))}
        </div>
      </div>
    </nav>
  );
}

/* ═══════════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════════ */
const PILLARS = [
  {
    id: "games", label: "Games", icon: "🎮",
    desc: "+1 MAD PER SECOND on Roblox. Our first game. Live and growing. MAD SHOT — our second game. Just dropped. Optimized and available for console, computers, mobile, tablet, and VR.",
    status: "live" as const,
    color: "#FF2D2D",
    image: "/game/mad-shot-hero.png",
    milestones: [
      { text: "+1 MAD PER SECOND launched on Roblox", done: true },
      { text: "MAD SHOT shooter launched", done: true },
      { text: "Leaderboards & competitive modes", done: true },
      { text: "MAD games to infinity — more coming", done: true },
    ],
  },
  {
    id: "merch", label: "Merch", icon: "👕",
    desc: "Physical + digital drops. Every item tells a story. 1st Limited edition with only 26 hats was given a special reward of 1M Mad Tokens.",
    status: "wip" as const,
    color: "#FF6B00",
    image: "/merch/mad-hat-limited-001-v2.png",
    milestones: [
      { text: "Design system & story-driven items", done: true },
      { text: "MAD // LIMITED 001 — 26 hats, 1M $MAD reward", done: true },
      { text: "Next drop — tees & accessories", done: false },
      { text: "Community-designed apparel", done: false },
    ],
  },
  {
    id: "music", label: "Music", icon: "🎵",
    desc: "Soundtrack to the madness. Phonk, rage, victory. Mello Will collaboration locked in.",
    status: "coming" as const,
    color: "#FFD700",
    milestones: [
      { text: "Collaboration with Mello Will", done: true },
      { text: "$MAD anthem — original track", done: false },
      { text: "Soundtrack for games & content", done: false },
      { text: "Community music submissions", done: false },
    ],
  },
  {
    id: "food", label: "Food", icon: "🍔",
    desc: "$MAD Bites. Fuel for the trenches.",
    status: "coming" as const,
    color: "#22c55e",
    milestones: [
      { text: "$MAD Bites concept", done: false },
      { text: "Pop-up food truck at events", done: false },
      { text: "Collaboration with food brands", done: false },
      { text: "MAD Meal NFT combos", done: false },
    ],
  },
  {
    id: "content", label: "Content", icon: "📹",
    desc: "The MAD Show. Animations, lore, weekly drops.",
    status: "live" as const,
    color: "#A855F7",
    milestones: [
      { text: "'I'M MAD GETTING RUGGED' animation", done: true },
      { text: "Coffee Collects YouTube (3 channels)", done: true },
      { text: "MAD Chronicles Episode 2", done: false },
      { text: "Weekly MAD Minute shorts", done: false },
    ],
  },
  {
    id: "events", label: "Events", icon: "🎉",
    desc: "IRL activations. The Initiation. Pop-ups. Chaos.",
    status: "coming" as const,
    color: "#00D4FF",
    milestones: [
      { text: "Solana Breakpoint activation", done: false },
      { text: "MAD Initiation scavenger hunt", done: false },
      { text: "Community meetups", done: false },
      { text: "Global tour", done: false },
    ],
  },
  {
    id: "finance", label: "Finance", icon: "💰",
    desc: "Staking, burns, treasury. The economic engine.",
    status: "live" as const,
    color: "#10b981",
    milestones: [
      { text: "50% supply burned", done: true },
      { text: "7 communities locked to 2060", done: true },
      { text: "Burn #2 protocol (10K holders)", done: false },
      { text: "Staking + revenue share", done: false },
    ],
  },
];

/* ═══════════════════════════════════════════════════════════
   STATS — SOLID COLORS ONLY (mobile Safari fix)
   ═══════════════════════════════════════════════════════════ */
function QuickStats() {
  const stats = [
    { value: "$90M+", label: "Market Cap", bg: "#1a0808", accent: "#FF4444", text: "#FFFFFF" },
    { value: "50%", label: "Supply Burned", bg: "#1a0f00", accent: "#FF8833", text: "#FFFFFF" },
    { value: "7", label: "Communities Locked", bg: "#081a0f", accent: "#33CC66", text: "#FFFFFF" },
    { value: "3,940+", label: "Holders", bg: "#12081a", accent: "#AA66FF", text: "#FFFFFF" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {stats.map((s) => (
        <div key={s.label} className="rounded-2xl p-4 text-center" style={{ backgroundColor: s.bg, border: `2px solid ${s.accent}` }}>
          <p className="text-2xl sm:text-3xl font-black" style={{ color: s.text }}>{s.value}</p>
          <p className="text-[10px] font-bold uppercase tracking-wider mt-1" style={{ color: s.accent }}>{s.label}</p>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   STATUS BADGE — SOLID COLORS
   ═══════════════════════════════════════════════════════════ */
function StatusBadge({ status }: { status: "live" | "wip" | "coming" }) {
  const config = {
    live: { bg: "#10b981", text: "#FFFFFF", label: "LIVE" },
    wip: { bg: "#FF6B00", text: "#FFFFFF", label: "IN PROGRESS" },
    coming: { bg: "#333333", text: "#888888", label: "COMING SOON" },
  };
  const c = config[status];
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider"
      style={{ backgroundColor: c.bg, color: c.text }}
    >
      {status === "live" && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
      {c.label}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════
   PILLAR CARD — Clean, professional, solid colors only
   ═══════════════════════════════════════════════════════════ */
function PillarCard({ pillar, index }: { pillar: typeof PILLARS[0]; index: number }) {
  const completed = pillar.milestones.filter((m) => m.done).length;
  const total = pillar.milestones.length;
  const pct = Math.round((completed / total) * 100);

  return (
    <FadeIn delay={index * 0.08}>
      <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: "#121212", border: `1px solid ${pillar.color}40` }}>
        {/* Colored top bar */}
        <div className="h-1" style={{ backgroundColor: pillar.color }} />

        <div className="p-5 sm:p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{pillar.icon}</span>
              <div>
                <h3 className="text-base font-black text-white">{pillar.label}</h3>
                <StatusBadge status={pillar.status} />
              </div>
            </div>
            <span className="text-2xl font-black" style={{ color: pillar.color }}>{pct}%</span>
          </div>

          {/* Image for Games and Merch pillars */}
          {(pillar.id === "games" || pillar.id === "merch") && pillar.image && (
            <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-4">
              <Image src={pillar.image} alt={pillar.label} fill className="object-cover" />
            </div>
          )}

          {/* Description */}
          <p className="text-sm mb-5" style={{ color: "#999999" }}>{pillar.desc}</p>

          {/* Progress bar - solid */}
          <div className="mb-5">
            <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: "#1a1a1a" }}>
              <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: pillar.color }} />
            </div>
            <p className="text-[10px] font-bold mt-1.5" style={{ color: "#666666" }}>
              {completed} of {total} milestones completed
            </p>
          </div>

          {/* Milestones */}
          <div className="space-y-2.5">
            {pillar.milestones.map((m, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                  style={{
                    backgroundColor: m.done ? pillar.color : "#222222",
                    color: m.done ? "#FFFFFF" : "#555555",
                  }}
                >
                  {m.done ? "✓" : "○"}
                </div>
                <span className="text-xs leading-relaxed" style={{ color: m.done ? "#CCCCCC" : "#555555" }}>
                  {m.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </FadeIn>
  );
}

/* ═══════════════════════════════════════════════════════════
   CTA
   ═══════════════════════════════════════════════════════════ */
function CTASection() {
  return (
    <div className="rounded-2xl p-8 sm:p-10 text-center" style={{ backgroundColor: "#121212", border: "1px solid #222222" }}>
      <h2 className="text-2xl sm:text-4xl font-black text-white mb-3">BUILD WITH US.</h2>
      <p className="text-sm sm:text-base mb-6" style={{ color: "#888888" }}>
        Seven pillars. One community. Every milestone gets us closer.
      </p>
      <a href="https://jup.ag/swap?sell=So11111111111111111111111111111111111111112&buy=Fa7ZE9nCEYnrHsnoeHuhEExJpchtrBtKXnWe6CgHpump"
        target="_blank" rel="noreferrer"
        className="inline-flex rounded-full px-8 py-4 text-base font-black text-white transition-transform hover:scale-105"
        style={{ background: "linear-gradient(135deg, #FF2D2D, #FF6B00)" }}
      >
        Get $MAD →
      </a>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   RISK
   ═══════════════════════════════════════════════════════════ */
function RiskNotice() {
  return (
    <div className="rounded-2xl px-6 py-8 text-center" style={{ backgroundColor: "#120808", border: "1px solid #331111" }}>
      <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-2" style={{ color: "#FF4444" }}>Risk Notice</p>
      <p className="text-xs sm:text-sm leading-relaxed" style={{ color: "#666666" }}>
        $MAD is a meme coin and speculative digital asset. Nothing on this website is financial advice.
        Crypto is risky and volatile. Never risk money you cannot afford to lose.
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   PILLAR CAROUSEL — Mobile: slide 1 card. Desktop: grid.
   ═══════════════════════════════════════════════════════════ */
function PillarCarousel() {
  const [current, setCurrent] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const next = () => setCurrent((prev) => (prev + 1) % PILLARS.length);
  const prev = () => setCurrent((prev) => (prev - 1 + PILLARS.length) % PILLARS.length);

  const onTouchStart = (e: React.TouchEvent) => setTouchStart(e.targetTouches[0].clientX);
  const onTouchMove = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX);
  const onTouchEnd = () => {
    if (touchStart - touchEnd > 75) next();
    if (touchEnd - touchStart > 75) prev();
  };

  const pillar = PILLARS[current];
  const completed = pillar.milestones.filter((m) => m.done).length;
  const total = pillar.milestones.length;
  const pct = Math.round((completed / total) * 100);

  // Mobile: one card carousel
  if (isMobile) {
    return (
      <div onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
        <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: "#121212", border: `1px solid ${pillar.color}40` }}>
          <div className="h-1" style={{ backgroundColor: pillar.color }} />
          <div className="p-5">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{pillar.icon}</span>
                <div>
                  <h3 className="text-base font-black text-white">{pillar.label}</h3>
                  <StatusBadge status={pillar.status} />
                </div>
              </div>
              <span className="text-2xl font-black" style={{ color: pillar.color }}>{pct}%</span>
            </div>
            {/* Image for Games and Merch pillars */}
            {(pillar.id === "games" || pillar.id === "merch") && pillar.image && (
              <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-4">
                <Image src={pillar.image} alt={pillar.label} fill className="object-cover" />
              </div>
            )}
            <p className="text-sm mb-5" style={{ color: "#999999" }}>{pillar.desc}</p>
            {/* Progress */}
            <div className="mb-5">
              <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: "#1a1a1a" }}>
                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: pillar.color }} />
              </div>
              <p className="text-[10px] font-bold mt-1.5" style={{ color: "#666666" }}>{completed} of {total} milestones completed</p>
            </div>
            {/* Milestones */}
            <div className="space-y-2.5">
              {pillar.milestones.map((m, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                    style={{ backgroundColor: m.done ? pillar.color : "#222222", color: m.done ? "#FFFFFF" : "#555555" }}>
                    {m.done ? "✓" : "○"}
                  </div>
                  <span className="text-xs leading-relaxed" style={{ color: m.done ? "#CCCCCC" : "#555555" }}>{m.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 mt-5">
          <button onClick={prev}
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "#1a1a1a", border: "1px solid #333333", color: "#FFFFFF" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <div className="flex items-center gap-2">
            {PILLARS.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)}
                className="rounded-full transition-all duration-300"
                style={{ width: i === current ? 24 : 8, height: 8, backgroundColor: i === current ? "#FF2D2D" : "#333333" }}
              />
            ))}
          </div>
          <button onClick={next}
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "#1a1a1a", border: "1px solid #333333", color: "#FFFFFF" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        </div>
        <p className="text-center text-[10px] font-bold mt-2" style={{ color: "#444444" }}>{current + 1} / {PILLARS.length}</p>
      </div>
    );
  }

  // Desktop: grid
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
      {PILLARS.map((pillar, i) => (
        <PillarCard key={pillar.id} pillar={pillar} index={i} />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════════ */
export default function RoadmapPage() {
  return (
    <div className="min-h-screen bg-[#080808] text-white">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-20 pt-20">
        {/* Hero */}
        <div className="text-center py-10 sm:py-16">
          <FadeIn>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] mb-3" style={{ color: "#FF6B00" }}>The Ecosystem</p>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black leading-none mb-4 text-white">
              $MAD <span style={{ color: "#FF2D2D" }}>ROADMAP</span>
            </h1>
            <p className="text-sm sm:text-base max-w-md mx-auto" style={{ color: "#888888" }}>
              Where we are. Where we're going. Milestone by milestone.
            </p>
          </FadeIn>
        </div>

        <div className="space-y-6">
          <FadeIn delay={0.05}><QuickStats /></FadeIn>

          <FadeIn delay={0.1}>
            <PillarCarousel />
          </FadeIn>

          <FadeIn delay={0.15}><CTASection /></FadeIn>
          <FadeIn delay={0.2}><RiskNotice /></FadeIn>
        </div>
      </main>
    </div>
  );
}
