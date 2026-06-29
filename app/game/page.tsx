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

        {/* Digital Wearables — Shirt */}
        <FadeIn delay={0.1}>
          <SectionShell className="overflow-hidden p-0">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="flex flex-col justify-center p-6 sm:p-8">
                <p className="text-[10px] font-black uppercase tracking-[0.32em] text-[#FF6B00]/60">
                  Digital Wearables
                </p>
                <h2 className="mt-4 text-4xl font-black leading-[0.95] text-white sm:text-5xl">
                  MAD Skate Shirt
                </h2>
                <p className="mt-5 max-w-xl text-base leading-8 text-white/50">
                  Rock the $MAD brand inside Roblox. Official digital clothing
                  and accessories now available in the Roblox catalog. Rep the
                  community everywhere you go.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <GlowPulse>
                    <a
                      href="https://www.roblox.com/catalog/89506653556378/MAD-brown-skate-shirt"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex rounded-full border border-[#FF2D2D]/40 bg-gradient-to-r from-[#FF2D2D] to-[#FF6B00] px-7 py-4 text-base font-black text-white transition hover:scale-[1.02]"
                    >
                      Get the Shirt →
                    </a>
                  </GlowPulse>
                  <Pill tone="red">Roblox Catalog</Pill>
                </div>
              </div>
              <div className="relative aspect-square w-full bg-[#0a0a0a]">
                <Image
                  src="/game/mad-brown-skate-shirt.png"
                  alt="MAD Brown Skate Shirt — Roblox Digital Wearable"
                  fill
                  className="object-contain p-6"
                />
              </div>
            </div>
          </SectionShell>
        </FadeIn>

        {/* Digital Wearables — Pants */}
        <FadeIn delay={0.1}>
          <SectionShell className="mt-6 overflow-hidden p-0">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="flex flex-col justify-center p-6 sm:p-8">
                <p className="text-[10px] font-black uppercase tracking-[0.32em] text-[#FF6B00]/60">
                  Digital Wearables
                </p>
                <h2 className="mt-4 text-4xl font-black leading-[0.95] text-white sm:text-5xl">
                  MAD Brown Pants
                </h2>
                <p className="mt-5 max-w-xl text-base leading-8 text-white/50">
                  Complete the look. Official $MAD brown pants to match the
                  skate shirt. Available now in the Roblox catalog.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <GlowPulse>
                    <a
                      href="https://www.roblox.com/catalog/97286453888370/MAD-brown-pants"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex rounded-full border border-[#FF2D2D]/40 bg-gradient-to-r from-[#FF2D2D] to-[#FF6B00] px-7 py-4 text-base font-black text-white transition hover:scale-[1.02]"
                    >
                      Get the Pants →
                    </a>
                  </GlowPulse>
                  <Pill tone="red">Roblox Catalog</Pill>
                </div>
              </div>
              <div className="relative aspect-square w-full bg-[#0a0a0a]">
                <Image
                  src="/game/mad-brown-pants.png"
                  alt="MAD Brown Pants — Roblox Digital Wearable"
                  fill
                  className="object-contain p-6"
                />
              </div>
            </div>
          </SectionShell>
        </FadeIn>

        {/* MAD INCREMENTAL Hero */}
        <FadeIn>
          <SectionShell className="overflow-hidden p-0">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.95fr]">
              <div className="p-6 sm:p-8 lg:p-10">
                <p className="text-[10px] font-black uppercase tracking-[0.34em] text-[#FF6B00]/60">
                  Official $MAD Experience — Now Live
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Pill tone="red">🔥 REINCARNATION UPDATE</Pill>
                </div>
                <h1 className="mt-4 text-4xl font-black leading-[0.95] tracking-tight text-white sm:text-6xl">
                  MAD{" "}
                  <span className="text-[#FF2D2D] drop-shadow-[0_0_14px_rgba(255,45,45,0.25)]">
                    INCREMENTAL
                  </span>
                </h1>
                <p className="mt-5 max-w-2xl text-base leading-8 text-white/50 sm:text-lg">
                  The first official $MAD game just dropped. Step into the arena,
                  wield the MAD blade, and prove your conviction. This isn&apos;t a
                  prototype — this is the real signal.
                  <br className="hidden sm:block" />
                  <span className="mt-2 inline-block text-[#FF2D2D]/70">
                    🔥 The Reincarnation update is live. New auras, new madness.
                  </span>
                </p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <Pill tone="green">Official Launch</Pill>
                  <Pill tone="red">By {CREATOR}</Pill>
                  <Pill>Server Size {GAME_STATS.serverSize}</Pill>
                </div>
                <div className="mt-8 flex flex-wrap gap-3">
                  <GlowPulse>
                    <a
                      href={GAME_LINK}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex rounded-full border border-[#FF2D2D]/40 bg-gradient-to-r from-[#FF2D2D] to-[#FF6B00] px-7 py-4 text-base font-black text-white transition hover:scale-[1.02]"
                    >
                      Play MAD INCREMENTAL →
                    </a>
                  </GlowPulse>
                  <a
                    href={TUTORIAL_VIDEO.replace("/embed/", "/watch?v=")}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex rounded-full border border-white/10 bg-white/[0.03] px-7 py-4 text-base font-black text-white/70 transition hover:border-white/20 hover:bg-white/[0.05]"
                  >
                    Watch Tutorial
                  </a>
                </div>
              </div>
              <div className="relative min-h-[280px] sm:min-h-[360px] lg:min-h-full">
                <Image
                  src="/game/mad-incremental-hero.png"
                  alt="MAD INCREMENTAL — Official $MAD Game"
                  fill
                  priority
                  className="object-cover"
                />
              </div>
            </div>
          </SectionShell>
        </FadeIn>

        {/* Live Stats */}
        <FadeIn delay={0.1}>
          <SectionShell className="mt-6 p-6 sm:p-8">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.32em] text-[#FF6B00]/60">
                  Live Stats
                </p>
                <h2 className="mt-2 text-2xl font-black text-white">
                  Game Activity
                </h2>
              </div>
              <a
                href={GAME_LINK}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-white/30 transition-colors hover:text-[#FF2D2D]"
              >
                View on Roblox →
              </a>
            </div>
            <StaggerGrid className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6" staggerDelay={0.06}>
              <StatCard value="68.6K+" label="Visits" icon={Icons.eye} />
              <StatCard value={GAME_STATS.favorites.toString()} label="Favorites" icon={Icons.heart} />
              <StatCard value={GAME_STATS.active.toString()} label="Active Now" icon={Icons.users} />
              <StatCard value={`${GAME_STATS.serverSize}`} label="Server Size" icon={Icons.server} />
              <StatCard value={GAME_STATS.voiceChat} label="Voice Chat" icon={Icons.server} />
              <StatCard value={GAME_STATS.camera} label="Camera" icon={Icons.eye} />
            </StaggerGrid>
            <div className="mt-4 flex flex-wrap gap-4 text-xs text-white/20">
              <span>Created {GAME_STATS.created}</span>
              <span>Updated {GAME_STATS.updated}</span>
              <span>Genre {GAME_STATS.genre}</span>
              <span>
                By{" "}
                <a href={CREATOR_LINK} target="_blank" rel="noreferrer" className="text-[#FF6B00]/60 hover:text-[#FF2D2D]">
                  {CREATOR}
                </a>
              </span>
            </div>
          </SectionShell>
        </FadeIn>

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

      <DarkFooter />
    </div>
  );
}

/* ─── Dark Footer ─── */
function DarkFooter() {
  const nav = [
    { label: "MAD AI", href: "/mad-mind" },
    { label: "Roadmap", href: "/roadmap" },
    { label: "Game", href: "/game" },
    { label: "MAD Art", href: "/mad-art" },
    { label: "Rewards", href: "/rewards" },
    { label: "Merch", href: "/merch" },
  ];

  const socials = [
    { icon: "tg", label: "Telegram", href: "https://t.me/MadRichClub" },
    { icon: "x", label: "X", href: "https://x.com/madrichclub_" },
    { icon: "ig", label: "Instagram", href: "https://www.instagram.com/madrichclub/" },
    { icon: "tt", label: "TikTok", href: "https://www.tiktok.com/@madrichclub" },
  ];

  return (
    <footer className="border-t border-white/5 px-4 sm:px-6 py-12 sm:py-16 bg-[#080808]">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
        {/* Left — Brand + tagline + socials */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-[#FF2D2D] flex items-center justify-center text-white font-black text-xl shrink-0">
              M
            </div>
            <div>
              <span className="text-white font-black text-xl tracking-tight">$MAD</span>
              <span className="block text-white/40 text-[10px] tracking-[0.3em] uppercase font-bold">STAY $MAD</span>
            </div>
          </div>
          <p className="text-sm text-white/50 leading-relaxed max-w-xs mb-6">
            The Supreme of Solana. Limited. Exclusive. Cult.
          </p>
          <div className="flex items-center gap-3">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={s.label}
                className="w-11 h-11 rounded-full border border-white/10 bg-transparent flex items-center justify-center text-white/40 hover:text-[#FF2D2D] hover:border-[#FF2D2D]/30 transition-all duration-300"
              >
                {s.icon === "tg" && (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/>
                  </svg>
                )}
                {s.icon === "x" && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                )}
                {s.icon === "ig" && (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                  </svg>
                )}
                {s.icon === "tt" && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                  </svg>
                )}
              </a>
            ))}
          </div>
        </div>

        {/* Right — Navigation */}
        <div className="md:text-right">
          <p className="text-[11px] font-black uppercase tracking-[0.3em] text-white/40 mb-5">NAVIGATION</p>
          <ul className="space-y-3">
            {nav.map((item) => (
              <li key={item.label}>
                <Link href={item.href} className="text-sm font-bold text-white/60 hover:text-[#FF2D2D] transition-colors duration-300">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="max-w-6xl mx-auto mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-[10px] text-white/30">
          Doxxed. Building. Not asking permission.
        </p>
        <p className="text-[10px] text-white/30 font-mono">
          {CA.slice(0, 12)}...{CA.slice(-4)}
        </p>
      </div>
    </footer>
  );
}
