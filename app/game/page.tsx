"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

const CA = "Fa7ZE9nCEYnrHsnoeHuhEExJpchtrBtKXnWe6CgHpump";

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
  children: React.ReactNode;
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

function StaggerGrid({
  children,
  className = "",
  staggerDelay = 0.08,
  baseDelay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
  baseDelay?: number;
}) {
  const { ref, isInView } = useInView();
  return (
    <div ref={ref} className={className}>
      {Array.isArray(children)
        ? children.map((child, i) => (
            <div
              key={i}
              style={{
                opacity: isInView ? 1 : 0,
                transform: isInView ? "translateY(0)" : "translateY(20px)",
                transition: `opacity 0.45s cubic-bezier(0.25,0.46,0.45,0.94) ${baseDelay + i * staggerDelay}s, transform 0.45s cubic-bezier(0.25,0.46,0.45,0.94) ${baseDelay + i * staggerDelay}s`,
                willChange: "opacity, transform",
              }}
            >
              {child}
            </div>
          ))
        : children}
    </div>
  );
}

function GlowPulse({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={className} style={{ animation: "glowPulse 3s ease-in-out infinite" }}>
      {children}
      <style>{`
        @keyframes glowPulse {
          0%,100% { box-shadow: 0 0 20px rgba(255,45,45,0.15); }
          50% { box-shadow: 0 0 35px rgba(255,45,45,0.28); }
        }
      `}</style>
    </div>
  );
}

function HoverLift({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={className}
      style={{ transition: "transform 0.3s cubic-bezier(0.25,0.46,0.45,0.94)" }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
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
        backgroundImage: "linear-gradient(to bottom, rgba(0,0,0,0.03) 1px, transparent 1px)",
        backgroundSize: "100% 3px",
      }}
    />
  );
}

/* ─── Navbar (matches homepage/roadmap) ─── */
function Navbar() {
  const links = [
    { label: "Home", href: "/" },
    { label: "MAD AI", href: "/mad-mind" },
    { label: "Roadmap", href: "/roadmap" },
    { label: "Game", href: "/game", active: true },
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
                l.active ? "bg-[#FF2D2D]/10 text-[#FF2D2D]" : "text-white/40 hover:text-white hover:bg-white/5"
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

const TUTORIAL_VIDEO = "https://www.youtube.com/embed/V0LBY-ZiklY";
const GAME_LINK = "https://www.roblox.com/games/123392566067659/MAD-INCREMENTAL";
const TOWER_DEFENSE_TEASER = "https://streamable.com/e/yc9dot";
const CREATOR = "@CoffeeCollectsBlox";
const CREATOR_LINK = "https://www.roblox.com/users/5183792958/profile";

const GAME_STATS = {
  visits: 68600,
  favorites: 265,
  active: 0,
  serverSize: 25,
  created: "4/14/2026",
  updated: "6/18/2026",
  voiceChat: "Not Supported",
  camera: "Supported",
  genre: "N/A",
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/* ─── Dark mode pills ─── */
function Pill({ children, tone = "default" }: { children: React.ReactNode; tone?: "default" | "red" | "green" }) {
  return (
    <div
      className={cn(
        "rounded-full px-4 py-2 text-[11px] font-black uppercase tracking-[0.24em]",
        tone === "red" && "border border-[#FF2D2D]/30 bg-[#FF2D2D]/10 text-[#FF2D2D]",
        tone === "green" && "border border-emerald-400/25 bg-emerald-500/10 text-emerald-400",
        tone === "default" && "border border-white/10 bg-white/[0.03] text-white/50",
      )}
    >
      {children}
    </div>
  );
}

/* ─── Dark mode section shell ─── */
function SectionShell({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <section className={cn("overflow-hidden rounded-[2rem] border border-white/5 bg-[#121212] shadow-[0_18px_50px_rgba(0,0,0,0.3)", className)}>
      {children}
    </section>
  );
}

/* ─── Dark mode simple card ─── */
function SimpleCard({ title, text, icon }: { title: string; text: string; icon: React.ReactNode }) {
  return (
    <HoverLift>
      <div className="rounded-[1.4rem] border border-white/5 bg-white/[0.03] p-5 transition-colors hover:border-white/10 group">
        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-[#FF2D2D]/20 bg-[#FF2D2D]/10 text-[#FF2D2D] transition-transform group-hover:scale-110">
          {icon}
        </div>
        <h3 className="text-xl font-black text-white">{title}</h3>
        <p className="mt-3 text-sm leading-7 text-white/50">{text}</p>
      </div>
    </HoverLift>
  );
}

/* ─── Dark mode stat card ─── */
function StatCard({ value, label, icon }: { value: string; label: string; icon: React.ReactNode }) {
  return (
    <HoverLift>
      <div className="rounded-[1.4rem] border border-white/5 bg-white/[0.03] p-6 text-center transition-colors hover:border-white/10">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-[#FF2D2D]/20 bg-[#FF2D2D]/10 text-[#FF2D2D]">
          {icon}
        </div>
        <div className="text-3xl font-black text-white">{value}</div>
        <div className="mt-1 text-[11px] uppercase tracking-[0.2em] text-white/35">
          {label}
        </div>
      </div>
    </HoverLift>
  );
}

/* ─── Risk Notice (dark mode) ─── */
function RiskNotice() {
  return (
    <SectionShell className="border-[#FF2D2D]/15 bg-[#FF2D2D]/[0.03] px-6 py-8 sm:px-10 sm:py-10">
      <p className="text-center text-xs font-black uppercase tracking-[0.38em] text-[#FF2D2D]/70">
        Risk Notice
      </p>
      <p className="mx-auto mt-5 max-w-6xl text-center text-base leading-9 text-white/50 sm:text-xl">
        $MAD is a meme coin and speculative digital asset. Nothing on this
        website is financial advice or a guarantee of returns. Crypto is risky
        and volatile. Never risk money you cannot afford to lose. Always do your
        own research.
      </p>
    </SectionShell>
  );
}

/* ICONS */
const Icons = {
  user: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  play: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  ),
  gamepad: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="6" width="20" height="12" rx="6" />
      <path d="M6 12h4M8 10v4" />
      <circle cx="16" cy="11" r="1" />
      <circle cx="18" cy="13" r="1" />
    </svg>
  ),
  eye: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  heart: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
  ),
  users: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87" />
      <path d="M16 3.13a4 4 0 010 7.75" />
    </svg>
  ),
  server: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="2" width="20" height="8" rx="2" />
      <rect x="2" y="14" width="20" height="8" rx="2" />
      <line x1="6" y1="6" x2="6.01" y2="6" />
      <line x1="6" y1="18" x2="6.01" y2="18" />
    </svg>
  ),
};

/* ═══════════════════════════════════════════════════════════
   GAME CAROUSEL — Slide-through game cards with arrows
   ═══════════════════════════════════════════════════════════ */
function GameCarousel() {
  const [current, setCurrent] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const games = [
    {
      title: "+1 MAD PER SECOND",
      tagline: "The Reincarnation Update",
      desc: "The first official $MAD game. Step into the arena, wield the MAD blade, and prove your conviction. New auras, new madness.",
      image: "/game/mad-incremental-hero.png",
      link: "https://www.roblox.com/games/123392566067659/MAD-INCREMENTAL",
      status: "live" as const,
      stats: { visits: "68.6K+", favorites: "265", updated: "6/18/2026" },
    },
    {
      title: "MAD SHOT",
      tagline: "Lock In. Shoot. Win.",
      desc: "The official $MAD shooter. Fast-paced action, competitive modes, and pure MAD energy. Lock in and prove your aim.",
      image: "/game/mad-shot-hero.png",
      link: "https://www.roblox.com/games/134848900359215/MAD-SHOT",
      status: "live" as const,
      stats: { visits: "Active", favorites: "Growing", updated: "Now" },
    },
    {
      title: "MAD AFK Smash Gods",
      tagline: "Coming Soon",
      desc: "AFK and earn. Smash the competition while you're away. The gods of idle gameplay meet $MAD energy.",
      image: "/game/mad-afk-smash-gods-hero.png",
      link: "#",
      status: "coming" as const,
      stats: { visits: "—", favorites: "—", updated: "In Dev" },
    },
  ];

  const next = () => setCurrent((prev) => (prev + 1) % games.length);
  const prev = () => setCurrent((prev) => (prev - 1 + games.length) % games.length);

  // Touch handlers for swipe
  const onTouchStart = (e: React.TouchEvent) => setTouchStart(e.targetTouches[0].clientX);
  const onTouchMove = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX);
  const onTouchEnd = () => {
    if (touchStart - touchEnd > 75) next();
    if (touchEnd - touchStart > 75) prev();
  };

  const g = games[current];

  return (
    <FadeIn>
      <div className="relative overflow-hidden rounded-[2rem] border border-white/5 bg-[#121212] shadow-[0_18px_50px_rgba(0,0,0,0.3)]"
        onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}
      >
        {/* Top color bar */}
        <div className="h-1" style={{ backgroundColor: g.status === "live" ? "#FF2D2D" : "#666666" }} />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.9fr]">
          {/* Left: Info */}
          <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10 order-2 lg:order-1">
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider"
                style={{ backgroundColor: g.status === "live" ? "#10b981" : "#444444", color: "#FFFFFF" }}
              >
                {g.status === "live" && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                {g.title === "MAD SHOT" ? "BETA (LIVE)" : g.status === "live" ? "LIVE NOW" : "COMING SOON"}
              </span>
              <span className="text-[10px] font-black uppercase tracking-wider" style={{ color: "#FF6B00" }}>{g.tagline}</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-white leading-none mb-4">
              {g.title}
            </h2>

            <p className="text-sm sm:text-base leading-7 mb-6" style={{ color: "#999999" }}>
              {g.desc}
            </p>

            {/* Mini stats row */}
            <div className="flex gap-4 mb-6">
              <div>
                <p className="text-lg font-black text-white">{g.stats.visits}</p>
                <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: "#666666" }}>Visits</p>
              </div>
              <div className="w-px bg-white/10" />
              <div>
                <p className="text-lg font-black text-white">{g.stats.favorites}</p>
                <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: "#666666" }}>Favorites</p>
              </div>
              <div className="w-px bg-white/10" />
              <div>
                <p className="text-lg font-black text-white">{g.stats.updated}</p>
                <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: "#666666" }}>Updated</p>
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-wrap gap-3">
              <a href={g.link} target="_blank" rel="noreferrer"
                className="inline-flex rounded-full px-8 py-4 text-base font-black text-white transition-transform hover:scale-105"
                style={{ background: "linear-gradient(135deg, #FF2D2D, #FF6B00)" }}
              >
                {g.status === "live" ? "Play Now →" : "Watch Teaser →"}
              </a>
            </div>

            {/* Slide indicators + arrows */}
            <div className="flex items-center gap-4 mt-8">
              {/* Arrow left */}
              <button onClick={prev}
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
                style={{ backgroundColor: "#1a1a1a", border: "1px solid #333333", color: "#FFFFFF" }}
                aria-label="Previous game"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6"/></svg>
              </button>

              {/* Dots */}
              <div className="flex items-center gap-2">
                {games.map((_, i) => (
                  <button key={i} onClick={() => setCurrent(i)}
                    className="rounded-full transition-all duration-300"
                    style={{
                      width: i === current ? 24 : 8,
                      height: 8,
                      backgroundColor: i === current ? "#FF2D2D" : "#333333",
                    }}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>

              {/* Arrow right */}
              <button onClick={next}
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
                style={{ backgroundColor: "#1a1a1a", border: "1px solid #333333", color: "#FFFFFF" }}
                aria-label="Next game"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
              </button>

              <span className="text-[10px] font-bold ml-auto" style={{ color: "#444444" }}>
                {current + 1} / {games.length}
              </span>
            </div>
          </div>

          {/* Right: Image */}
          <div className="relative min-h-[280px] sm:min-h-[360px] lg:min-h-full order-1 lg:order-2">
            <Image src={g.image} alt={g.title} fill priority className="object-cover" />
            {/* Gradient overlay for text readability on mobile */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent lg:hidden" />
          </div>
        </div>
      </div>
    </FadeIn>
  );
}

/* ═══════════════════════════════════════════════════════════
   DIGITAL WEARABLES CAROUSEL — Roblox Catalog Items
   ═══════════════════════════════════════════════════════════ */
function DigitalWearablesCarousel() {
  const [current, setCurrent] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const items = [
    {
      title: "MAD Skate Shirt",
      subtitle: "Digital Wearables",
      desc: "Rock the $MAD brand inside Roblox. Official digital clothing and accessories now available in the Roblox catalog. Rep the community everywhere you go.",
      image: "/game/mad-skate-shirt-card.png",
      link: "https://www.roblox.com/catalog/89506653556378/MAD-brown-skate-shirt",
      cta: "Get the Shirt →",
    },
    {
      title: "MAD Brown Pants",
      subtitle: "Digital Wearables",
      desc: "Complete the look. Official $MAD brown pants to match the skate shirt. Available now in the Roblox catalog.",
      image: "/game/mad-brown-pants-card.png",
      link: "https://www.roblox.com/catalog/97286453888370/MAD-brown-pants",
      cta: "Get the Pants →",
    },
    {
      title: "MAD Beige Button-Up",
      subtitle: "Digital Wearables",
      desc: "Clean and classic. Official $MAD beige button-up shirt with the signature MAD face. Elevate your Roblox wardrobe.",
      image: "/game/mad-beige-buttonup-card.png",
      link: "https://www.roblox.com/catalog/117800329844621/MAD-beige-button-up",
      cta: "Get the Shirt →",
    },
    {
      title: "MAD Ice Washed Denim",
      subtitle: "Digital Wearables",
      desc: "Ice cold drip. Official $MAD ice washed denim jeans for that premium Roblox look. Fresh fit, fresh mood.",
      image: "/game/mad-ice-denim-card.png",
      link: "https://www.roblox.com/catalog/89146674743225/MAD-Ice-Washed-Denim",
      cta: "Get the Denim →",
    },
    {
      title: "MAD Red Cybersigilism Tee",
      subtitle: "Digital Wearables",
      desc: "Bold red energy. Official $MAD cybersigilism tee — cyberpunk vibes with the MAD edge. Stand out in every server.",
      image: "/game/mad-red-cybersigilism-tee-card.png",
      link: "https://www.roblox.com/catalog/122315809395599/MAD-Red-Cybersigilism-Tee",
      cta: "Get the Tee →",
    },
    {
      title: "MAD Red Faded Jeans",
      subtitle: "Digital Wearables",
      desc: "Red wash, faded perfection. Official $MAD red faded jeans — the bottom half that completes the fit. Available now in the Roblox catalog.",
      image: "/game/mad-red-faded-jeans-card.png",
      link: "https://www.roblox.com/catalog/113611821499264/MAD-Red-Faded-Jeans",
      cta: "Get the Jeans →",
    },
    {
      title: "MAD Grey Knit Shirt",
      subtitle: "Digital Wearables",
      desc: "Subtle heat. Official $MAD grey knit shirt — textured, tonal, unmistakably MAD. Low key, high impact.",
      image: "/game/mad-grey-knit-shirt-card.png",
      link: "https://www.roblox.com/catalog/105117227780245/MAD-Grey-Knit-Shirt",
      cta: "Get the Shirt →",
    },
    {
      title: "MAD Black Jeans",
      subtitle: "Digital Wearables",
      desc: "Dark mode drip. Official $MAD black jeans — sleek, versatile, essential. The foundation of every MAD fit.",
      image: "/game/mad-black-jeans-card.png",
      link: "https://www.roblox.com/catalog/94746335770817/MAD-Black-Jeans",
      cta: "Get the Jeans →",
    },
  ];

  const next = () => setCurrent((prev) => (prev + 1) % items.length);
  const prev = () => setCurrent((prev) => (prev - 1 + items.length) % items.length);

  const onTouchStart = (e: React.TouchEvent) => setTouchStart(e.targetTouches[0].clientX);
  const onTouchMove = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX);
  const onTouchEnd = () => {
    if (touchStart - touchEnd > 75) next();
    if (touchEnd - touchStart > 75) prev();
  };

  const item = items[current];

  return (
    <FadeIn>
      <div className="relative overflow-hidden rounded-[2rem] border border-white/5 bg-[#121212] shadow-[0_18px_50px_rgba(0,0,0,0.3)]"
        onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}
      >
        {/* Top color bar */}
        <div className="h-1 bg-[#FF6B00]" />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.9fr]">
          {/* Left: Info */}
          <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10 order-2 lg:order-1">
            <p className="text-[10px] font-black uppercase tracking-[0.32em] text-[#FF6B00]/60">
              {item.subtitle}
            </p>
            <h2 className="mt-4 text-4xl font-black leading-[0.95] text-white sm:text-5xl">
              {item.title}
            </h2>
            <p className="mt-5 max-w-xl text-base leading-8 text-white/50">
              {item.desc}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <GlowPulse>
                <a
                  href={item.link}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex rounded-full border border-[#FF2D2D]/40 bg-gradient-to-r from-[#FF2D2D] to-[#FF6B00] px-7 py-4 text-base font-black text-white transition hover:scale-[1.02]"
                >
                  {item.cta}
                </a>
              </GlowPulse>
              <Pill tone="red">Roblox Catalog</Pill>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4 mt-8">
              <button onClick={prev}
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
                style={{ backgroundColor: "#1a1a1a", border: "1px solid #333333", color: "#FFFFFF" }}
                aria-label="Previous item"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6"/></svg>
              </button>
              <div className="flex items-center gap-2">
                {items.map((_, i) => (
                  <button key={i} onClick={() => setCurrent(i)}
                    className="rounded-full transition-all duration-300"
                    style={{ width: i === current ? 24 : 8, height: 8, backgroundColor: i === current ? "#FF6B00" : "#333333" }}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>
              <button onClick={next}
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
                style={{ backgroundColor: "#1a1a1a", border: "1px solid #333333", color: "#FFFFFF" }}
                aria-label="Next item"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
              </button>
              <span className="text-[10px] font-bold ml-auto text-white/30">
                {current + 1} / {items.length}
              </span>
            </div>
          </div>

          {/* Right: Image */}
          <div className="relative min-h-[280px] sm:min-h-[360px] lg:min-h-full order-1 lg:order-2 bg-[#0a0a0a]">
            <Image src={item.image} alt={item.title} fill className="object-contain p-4 sm:p-6" />
          </div>
        </div>
      </div>
    </FadeIn>
  );
}

/* ═══════════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════════ */

export default function GamePage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#080808] text-white relative">
      <Scanlines />
      <Navbar />

      {/* Background gradient */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_50%_20%,rgba(255,45,45,0.04),transparent_50%)]" />

      <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-20 pt-6 relative z-10">
        {/* Hero Header */}
        <div className="relative pt-12 pb-6 sm:pt-20 sm:pb-10 text-center">
          <FadeIn>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#FF6B00]/60 mb-3">
              Official $MAD Experience
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
              MAD GAMES
            </h1>
            <p className="text-sm sm:text-base text-white/40 max-w-md mx-auto leading-relaxed">
              Built on Roblox. Powered by conviction. The official $MAD gaming universe.
            </p>
          </FadeIn>
        </div>

        {/* Digital Wearables Carousel */}
        <div className="mt-6">
          <DigitalWearablesCarousel />
        </div>

        {/* Game Carousel — Slide through games */}
        <div className="mt-6">
          <GameCarousel />
        </div>

        {/* YouTube Video Section */}
        <FadeIn delay={0.15}>
          <SectionShell className="mt-6 overflow-hidden p-0">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="flex flex-col justify-center p-6 sm:p-8">
                <p className="text-[10px] font-black uppercase tracking-[0.32em] text-[#FF6B00]/60">
                  Watch the Madness
                </p>
                <h2 className="mt-4 text-3xl font-black leading-[0.95] text-white sm:text-4xl">
                  10K ROBUX Spent
                </h2>
                <p className="mt-5 max-w-xl text-base leading-8 text-white/50">
                  Coffee Blox just dropped 10,000 ROBUX into MAD INCREMENTAL.
                  Unlocking crazy auras, evolving from weak to overpowered.
                  Real gameplay. Real chaos. Real $MAD.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <GlowPulse>
                    <a
                      href="https://www.youtube.com/watch?v=Pte0bOa16xI&t=840s"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex rounded-full border border-[#FF2D2D]/40 bg-gradient-to-r from-[#FF2D2D] to-[#FF6B00] px-7 py-4 text-base font-black text-white transition hover:scale-[1.02]"
                    >
                      Watch on YouTube →
                    </a>
                  </GlowPulse>
                  <Pill tone="red">NEW</Pill>
                </div>
              </div>
              <div className="relative aspect-video w-full bg-black">
                <iframe
                  src="https://www.youtube.com/embed/Pte0bOa16xI?start=840"
                  title="I Spent 10,000 ROBUX In MAD INCREMENTAL! (ROBLOX)"
                  className="absolute inset-0 h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </SectionShell>
        </FadeIn>

        {/* How It Works */}
        <FadeIn delay={0.1}>
          <SectionShell className="mt-6 p-6 sm:p-8">
            <p className="text-[10px] font-black uppercase tracking-[0.32em] text-white/30">
              How It Works
            </p>
            <StaggerGrid className="mt-6 grid gap-4 md:grid-cols-3" staggerDelay={0.1}>
              <SimpleCard
                title="1. Make Roblox"
                text="No account yet? Create one at roblox.com. It's free and takes 2 minutes."
                icon={Icons.user}
              />
              <SimpleCard
                title="2. Watch Help"
                text="New to Roblox? Use our tutorial for the easiest setup and first-game walkthrough."
                icon={Icons.play}
              />
              <SimpleCard
                title="3. Join $MAD"
                text="Click Play Now, join the official $MAD game, and start making decisions."
                icon={Icons.gamepad}
              />
            </StaggerGrid>
          </SectionShell>
        </FadeIn>

        {/* Quick Help + Kubo */}
        <FadeIn delay={0.1}>
          <SectionShell className="mt-6 p-6 sm:p-8">
            <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
              <div>
                <div className="max-w-4xl">
                  <p className="text-[10px] font-black uppercase tracking-[0.32em] text-[#FF6B00]/60">
                    Quick Help
                  </p>
                  <h2 className="mt-3 text-3xl font-black leading-tight text-white sm:text-5xl">
                    Need help first?
                  </h2>
                  <p className="mt-4 max-w-3xl text-base leading-8 text-white/50">
                    Watch this quick setup video to get into Roblox and start
                    playing fast.
                  </p>
                </div>
                <div className="mt-8 overflow-hidden rounded-[1.6rem] border border-white/5 bg-black shadow-[0_0_24px_rgba(255,45,45,0.08)]">
                  <div className="relative aspect-video w-full">
                    <iframe
                      src={TUTORIAL_VIDEO}
                      title="Roblox Sign Up Tutorial"
                      className="absolute inset-0 h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>
                </div>
              </div>
              <div className="rounded-[1.8rem] border border-white/5 bg-white/[0.03] p-5 sm:p-6">
                <p className="text-[10px] font-black uppercase tracking-[0.32em] text-[#FF6B00]/60">
                  Special Guest
                </p>
                <div className="mt-4 overflow-hidden rounded-[1.4rem] border border-white/5 bg-black">
                  <div className="relative aspect-square w-full">
                    <Image
                      src="/game/kubo-special-guest.png"
                      alt="Kubo special guest"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <h3 className="mt-5 text-2xl font-black text-white sm:text-3xl">
                  Kubo was a{" "}
                  <span className="text-[#FF2D2D] drop-shadow-[0_0_12px_rgba(255,45,45,0.25)]">
                    special guest
                  </span>
                </h3>
                <p className="mt-3 text-sm leading-7 text-white/50">
                  Community supporter featured inside the $MAD gaming world.
                </p>
                <div className="mt-6">
                  <a
                    href="https://x.com/Kubo100x"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex rounded-full border border-[#FF2D2D]/40 bg-gradient-to-r from-[#FF2D2D] to-[#FF6B00] px-6 py-3 text-sm font-black text-white transition hover:scale-[1.02]"
                  >
                    Visit @Kubo100x →
                  </a>
                </div>
              </div>
            </div>
          </SectionShell>
        </FadeIn>

        {/* Tower Defense Teaser */}
        <FadeIn delay={0.1}>
          <SectionShell className="mt-6 overflow-hidden p-0">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="flex flex-col justify-center p-6 sm:p-8">
                <p className="text-[10px] font-black uppercase tracking-[0.32em] text-[#FF6B00]/60">
                  Coming Soon
                </p>
                <h2 className="mt-4 text-4xl font-black leading-[0.95] text-white sm:text-5xl">
                  MAD Tower Defense
                </h2>
                <p className="mt-5 max-w-xl text-base leading-8 text-white/50">
                  Bigger, wilder, and more strategic. Build your defenses,
                  withstand the chaos, and prove your $MAD discipline. Still in
                  active development.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <GlowPulse>
                    <a
                      href={TOWER_DEFENSE_TEASER.replace("/e/", "/")}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex rounded-full border border-[#FF2D2D]/40 bg-[#FF2D2D]/15 px-6 py-3 text-sm font-black text-[#FF2D2D] transition hover:bg-[#FF2D2D]/25"
                    >
                      Watch Teaser →
                    </a>
                  </GlowPulse>
                  <Pill>More Coming</Pill>
                </div>
              </div>
              <div className="relative aspect-video w-full bg-black">
                <iframe
                  src={TOWER_DEFENSE_TEASER}
                  title="MAD Tower Defense teaser"
                  className="absolute inset-0 h-full w-full"
                  allow="autoplay; fullscreen"
                  allowFullScreen
                />
              </div>
            </div>
          </SectionShell>
        </FadeIn>

        {/* Risk Notice */}
        <FadeIn delay={0.1}>
          <div className="mt-6">
            <RiskNotice />
          </div>
        </FadeIn>
      </main>
    </div>
  );
}
