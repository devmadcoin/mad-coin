"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";

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
  children, className = "", delay = 0, direction = "up", duration = 0.5, distance = 24,
}: { children: React.ReactNode; className?: string; delay?: number; direction?: "up" | "down" | "left" | "right"; duration?: number; distance?: number; }) {
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

function StaggerGrid({
  children, className = "", staggerDelay = 0.08, baseDelay = 0,
}: { children: React.ReactNode; className?: string; staggerDelay?: number; baseDelay?: number; }) {
  const { ref, isInView } = useInView();
  return (
    <div ref={ref} className={className}>
      {Array.isArray(children) ? children.map((child, i) => (
        <div key={i} style={{
          opacity: isInView ? 1 : 0, transform: isInView ? "translateY(0)" : "translateY(20px)",
          transition: `opacity 0.45s cubic-bezier(0.25,0.46,0.45,0.94) ${baseDelay + i * staggerDelay}s, transform 0.45s cubic-bezier(0.25,0.46,0.45,0.94) ${baseDelay + i * staggerDelay}s`,
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
      <style>{`@keyframes glowPulse { 0%,100%{box-shadow:0 0 20px rgba(255,0,0,0.15)} 50%{box-shadow:0 0 35px rgba(255,0,0,0.28)}`}</style>
    </div>
  );
}

function HoverLift({ children, className = "" }: { children: React.ReactNode; className?: string; }) {
  return (
    <div className={className} style={{ transition: "transform 0.3s cubic-bezier(0.25,0.46,0.45,0.94)" }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; }}>
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   DATA & SHARED
   ═══════════════════════════════════════════════════════════ */

const TUTORIAL_VIDEO = "https://www.youtube.com/embed/V0LBY-ZiklY";
const GAME_LINK = "https://www.roblox.com/games/133907998204829/Will-You-Get-RICH-Or-Stay-MAD";
const TOWER_DEFENSE_TEASER = "https://streamable.com/e/yc9dot";
const CREATOR = "@CoffeeCollectsBlox";
const CREATOR_LINK = "https://www.roblox.com/users/5183792958/profile";

const GAME_STATS = {
  visits: 106,
  favorites: 3,
  active: 0,
  serverSize: 50,
  created: "2/6/2026",
  updated: "2/8/2026",
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function Pill({ children, tone = "default" }: { children: React.ReactNode; tone?: "default" | "red" | "green" }) {
  return (
    <div className={cn(
      "rounded-full px-4 py-2 text-[11px] font-black uppercase tracking-[0.24em]",
      tone === "red" && "border border-red-500/25 bg-red-500/10 text-red-200",
      tone === "green" && "border border-emerald-400/20 bg-emerald-500/10 text-emerald-200",
      tone === "default" && "border border-white/10 bg-white/[0.04] text-white/70",
    )}>
      {children}
    </div>
  );
}

function SectionShell({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <section className={cn(
      "overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] shadow-[0_18px_50px_rgba(0,0,0,0.35)] backdrop-blur-xl",
      className,
    )}>
      {children}
    </section>
  );
}

function SimpleCard({ title, text, icon }: { title: string; text: string; icon: React.ReactNode }) {
  return (
    <HoverLift>
    <div className="rounded-[1.4rem] border border-white/10 bg-black/25 p-5 hover:border-white/15 transition-colors group">
      <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mb-4 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-black text-white">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-white/65">{text}</p>
    </div>
    </HoverLift>
  );
}

function FeatureCard({ title, desc, icon, accent = "red" }: { title: string; desc: string; icon: React.ReactNode; accent?: "red" | "orange" }) {
  const borderColor = accent === "orange" ? "border-orange-500/10" : "border-red-500/10";
  const bgGradient = accent === "orange"
    ? "bg-[linear-gradient(180deg,rgba(40,20,0,0.3),rgba(10,5,0,0.4))]"
    : "bg-[linear-gradient(180deg,rgba(40,0,0,0.3),rgba(10,0,0,0.4))]";
  const hoverBorder = accent === "orange" ? "hover:border-orange-500/20" : "hover:border-red-500/20";

  return (
    <HoverLift>
    <div className={`rounded-[1.4rem] border ${borderColor} ${bgGradient} p-6 ${hoverBorder} transition-all hover:-translate-y-0.5`}>
      <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-black text-white mb-2">{title}</h3>
      <p className="text-sm text-white/55 leading-relaxed">{desc}</p>
    </div>
    </HoverLift>
  );
}

function StatCard({ value, label, icon }: { value: string; label: string; icon: React.ReactNode }) {
  return (
    <HoverLift>
    <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.02] p-6 text-center hover:border-white/15 transition-colors">
      <div className="w-12 h-12 mx-auto rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mb-3">
        {icon}
      </div>
      <div className="text-3xl font-black text-white">{value}</div>
      <div className="text-[11px] uppercase tracking-[0.2em] text-white/40 mt-1">{label}</div>
    </div>
    </HoverLift>
  );
}

function RiskNotice() {
  return (
    <SectionShell className="border-yellow-500/20 bg-[linear-gradient(180deg,rgba(255,208,0,0.05),rgba(255,208,0,0.02))] px-6 py-8 sm:px-10 sm:py-10">
      <p className="text-center text-xs font-black uppercase tracking-[0.38em] text-yellow-300/85">Risk Notice</p>
      <p className="mx-auto mt-5 max-w-6xl text-center text-base leading-9 text-yellow-100/90 sm:text-xl">
        $MAD is a meme coin and speculative digital asset. Nothing on this website is financial advice or a guarantee of returns. Crypto is risky and volatile. Never risk money you cannot afford to lose. Always do your own research.
      </p>
    </SectionShell>
  );
}

/* ─── INLINE SVG ICONS ─── */
const Icons = {
  user: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  play: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>,
  gamepad: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="6" width="20" height="12" rx="6"/><path d="M6 12h4M8 10v4"/><circle cx="16" cy="11" r="1"/><circle cx="18" cy="13" r="1"/></svg>,
  trophy: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9H4.5a2.5 2.5 0 010-5H6"/><path d="M18 9h1.5a2.5 2.5 0 000-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0012 0V2z"/></svg>,
  flame: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2c0 0-7 4-7 11v1a7 7 0 0014 0v-1c0-7-7-11-7-11z"/></svg>,
  target: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
  chart: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>,
  users: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
  star: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  eye: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  heart: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>,
  server: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>,
  hammer: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 12l-8.5 8.5a2.12 2.12 0 01-3 0 2.12 2.12 0 010-3L12 9"/><path d="M17.64 15L22 10.64"/><path d="M20.91 11.7l-1.25-1.25c-.6-.6-.93-1.4-.93-2.25V7.86c0-.55-.45-1-1-1H16.14c-.85 0-1.65-.33-2.25-.93L12.64 4.64"/></svg>,
  trending: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  door: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 20V6a2 2 0 00-2-2H8a2 2 0 00-2 2v14"/><path d="M2 20h20"/><path d="M14 12v.01"/></svg>,
  alert: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
};

const GAME_MECHANICS = [
  { title: "Build your MAD", desc: "Construct your empire. Every block is a decision that shapes your path.", icon: Icons.hammer },
  { title: "Time your buys", desc: "The market moves. Your timing decides if you win or fold.", icon: Icons.trending },
  { title: "Unlock gated zones", desc: "Progress unlocks new areas. Keep building to access more.", icon: Icons.door },
  { title: "Climb the Goal Ladder", desc: "Hit milestones. Grind to 100 MAD and unlock the bag.", icon: Icons.trophy },
];

const GAME_RISKS = [
  { title: "Paper hands will hit you", desc: "Weak convictions get punished. Stay disciplined or pay the price.", icon: Icons.alert },
  { title: "Wrong doors will dump you", desc: "Not every path leads up. Choose your moves wisely.", icon: Icons.door },
  { title: "KOLs might chase you", desc: "Influencers come and go. Trust your own strategy.", icon: Icons.users },
  { title: "Global Rage explodes", desc: "Every decision pushes the Rage Index higher. The world gets crazier.", icon: Icons.flame },
];

/* ═══════════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════════ */

export default function GamePage() {
  return (
    <div className="relative overflow-hidden bg-black text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(255,0,60,0.14),transparent_30%),radial-gradient(circle_at_85%_15%,rgba(255,90,0,0.1),transparent_28%),radial-gradient(circle_at_50%_100%,rgba(120,0,0,0.18),transparent_45%)]" />
      <div className="relative mx-auto max-w-7xl px-4 pb-24 pt-8 sm:px-6 lg:px-8">

        {/* ─── HERO ─── */}
        <FadeIn>
        <SectionShell className="overflow-hidden p-0">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.95fr]">
            <div className="p-6 sm:p-8 lg:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.34em] text-red-200/75">PLAY NOW ON ROBLOX</p>
              <h1 className="mt-4 text-4xl font-black leading-[0.95] tracking-tight text-white sm:text-6xl">
                Will You Get <span className="text-red-500 drop-shadow-[0_0_14px_rgba(255,0,0,0.45)]">RICH</span>...
                <br />Or Stay <span className="text-red-500 drop-shadow-[0_0_14px_rgba(255,0,0,0.45)]">$MAD</span>?
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-white/70 sm:text-lg">
                The market moves. You follow it. Build your MAD, time your buys, and climb the Goal Ladder. But be careful — paper hands will hit you.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Pill tone="green">Easy Start</Pill>
                <Pill tone="red">By {CREATOR}</Pill>
                <Pill>Server Size {GAME_STATS.serverSize}</Pill>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <GlowPulse>
                <a href={GAME_LINK} target="_blank" rel="noreferrer" className="inline-flex rounded-full border border-red-500/40 bg-red-500 px-7 py-4 text-base font-black text-white transition hover:scale-[1.02] hover:bg-red-400">
                  Play on Roblox →
                </a>
                </GlowPulse>
                <a href={TUTORIAL_VIDEO.replace("/embed/", "/watch?v=")} target="_blank" rel="noreferrer" className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-7 py-4 text-base font-black text-white/85 transition hover:border-white/20 hover:bg-white/[0.08]">
                  Watch Tutorial
                </a>
              </div>
            </div>
            <div className="relative min-h-[280px] sm:min-h-[360px] lg:min-h-full">
              <Image src="/game/rich-or-mad-banner.png" alt="Will You Get Rich Or Stay MAD" fill priority className="object-cover" />
            </div>
          </div>
        </SectionShell>
        </FadeIn>

        {/* ─── LIVE STATS ─── */}
        <FadeIn delay={0.1}>
        <SectionShell className="mt-8 p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-red-200/75">LIVE STATS</p>
              <h2 className="mt-2 text-2xl font-black text-white">Game Activity</h2>
            </div>
            <a href={GAME_LINK} target="_blank" rel="noreferrer" className="text-xs text-white/40 hover:text-red-400 transition-colors">
              View on Roblox →
            </a>
          </div>
          <StaggerGrid className="grid grid-cols-2 sm:grid-cols-4 gap-3" staggerDelay={0.06}>
            <StatCard value={GAME_STATS.visits.toLocaleString()} label="Visits" icon={Icons.eye} />
            <StatCard value={GAME_STATS.favorites.toString()} label="Favorites" icon={Icons.heart} />
            <StatCard value={GAME_STATS.active.toString()} label="Active Now" icon={Icons.users} />
            <StatCard value={`${GAME_STATS.serverSize}`} label="Server Size" icon={Icons.server} />
          </StaggerGrid>
          <div className="mt-4 flex flex-wrap gap-4 text-xs text-white/30">
            <span className="flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              Created {GAME_STATS.created}
            </span>
            <span className="flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>
              Updated {GAME_STATS.updated}
            </span>
            <span className="flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              By <a href={CREATOR_LINK} target="_blank" rel="noreferrer" className="text-red-400/60 hover:text-red-400 ml-0.5">{CREATOR}</a>
            </span>
          </div>
        </SectionShell>
        </FadeIn>

        {/* ─── HOW IT WORKS ─── */}
        <FadeIn delay={0.1}>
        <SectionShell className="mt-8 p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-white/45">HOW IT WORKS</p>
          <StaggerGrid className="mt-6 grid gap-4 md:grid-cols-3" staggerDelay={0.1}>
            <SimpleCard title="1. Make Roblox" text="No account yet? Create one at roblox.com. It's free and takes 2 minutes." icon={Icons.user} />
            <SimpleCard title="2. Watch Help" text="New to Roblox? Use our tutorial for the easiest setup and first-game walkthrough." icon={Icons.play} />
            <SimpleCard title="3. Join $MAD" text="Click Play Now, join the official $MAD game, and start making decisions." icon={Icons.gamepad} />
          </StaggerGrid>
        </SectionShell>
        </FadeIn>

        {/* ─── GAME MECHANICS ─── */}
        <FadeIn delay={0.1}>
        <SectionShell className="mt-8 p-6 sm:p-8">
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-red-200/75">GAMEPLAY</p>
            <h2 className="mt-3 text-3xl font-black leading-tight text-white sm:text-4xl">
              What You <span className="text-red-500">Do</span>
            </h2>
            <p className="mt-2 text-sm text-white/50 max-w-lg">
              Build your MAD empire. Every decision matters. The higher the Global Rage Index goes, the crazier the world gets.
            </p>
          </div>
          <StaggerGrid className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" staggerDelay={0.08}>
            {GAME_MECHANICS.map((m) => (
              <FeatureCard key={m.title} title={m.title} desc={m.desc} icon={m.icon} />
            ))}
          </StaggerGrid>
        </SectionShell>
        </FadeIn>

        {/* ─── GAME RISKS ─── */}
        <FadeIn delay={0.1}>
        <SectionShell className="mt-8 p-6 sm:p-8">
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-orange-200/75">WATCH OUT</p>
            <h2 className="mt-3 text-3xl font-black leading-tight text-white sm:text-4xl">
              What Can <span className="text-orange-400">Hit You</span>
            </h2>
            <p className="mt-2 text-sm text-white/50 max-w-lg">
              Every decision pushes the Global Rage Index higher. The higher it goes, the crazier the world gets.
            </p>
          </div>
          <StaggerGrid className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" staggerDelay={0.08}>
            {GAME_RISKS.map((r) => (
              <FeatureCard key={r.title} title={r.title} desc={r.desc} icon={r.icon} accent="orange" />
            ))}
          </StaggerGrid>
        </SectionShell>
        </FadeIn>

        {/* ─── QUICK HELP + KUBO ─── */}
        <FadeIn delay={0.1}>
        <SectionShell className="mt-8 p-6 sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <div className="max-w-4xl">
                <p className="text-xs font-semibold uppercase tracking-[0.32em] text-red-200/75">QUICK HELP</p>
                <h2 className="mt-3 text-3xl font-black leading-tight text-white sm:text-5xl">Need help first?</h2>
                <p className="mt-4 max-w-3xl text-base leading-8 text-white/70">
                  Watch this quick setup video to get into Roblox and start playing fast.
                </p>
              </div>
              <div className="mt-8 overflow-hidden rounded-[1.6rem] border border-white/10 bg-black shadow-[0_0_24px_rgba(255,0,0,0.12)]">
                <div className="relative aspect-video w-full">
                  <iframe src={TUTORIAL_VIDEO} title="Roblox Sign Up Tutorial" className="absolute inset-0 h-full w-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />
                </div>
              </div>
            </div>
            <div className="rounded-[1.8rem] border border-white/10 bg-white/[0.03] p-5 sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-red-200/75">SPECIAL GUEST</p>
              <div className="mt-4 overflow-hidden rounded-[1.4rem] border border-white/10 bg-black">
                <div className="relative aspect-square w-full">
                  <Image src="/game/kubo-special-guest.jpg" alt="Kubo special guest" fill className="object-cover" />
                </div>
              </div>
              <h3 className="mt-5 text-2xl font-black text-white sm:text-3xl">
                Kubo was a <span className="text-red-500 drop-shadow-[0_0_12px_rgba(255,0,0,0.45)]">special guest</span>
              </h3>
              <p className="mt-3 text-sm leading-7 text-white/65">
                Community supporter featured inside the $MAD gaming world.
              </p>
              <div className="mt-6">
                <a href="https://x.com/Kubo100x" target="_blank" rel="noreferrer" className="inline-flex rounded-full border border-red-500/40 bg-red-500 px-6 py-3 text-sm font-black text-white transition hover:scale-[1.02] hover:bg-red-400">
                  Visit @Kubo100x →
                </a>
              </div>
            </div>
          </div>
        </SectionShell>
        </FadeIn>

        {/* ─── COMING SOON ─── */}
        <FadeIn delay={0.1}>
        <SectionShell className="mt-8 overflow-hidden p-0">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-6 sm:p-8 flex flex-col justify-center">
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-red-300/75">COMING SOON</p>
              <h2 className="mt-4 text-4xl font-black leading-[0.95] text-white sm:text-5xl">
                MAD Tower Defense
              </h2>
              <p className="mt-5 max-w-xl text-base leading-8 text-white/68">
                Bigger, wilder, and more strategic. Build your defenses, withstand the chaos, and prove your $MAD discipline. Still in active development.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <GlowPulse>
                <a href={TOWER_DEFENSE_TEASER.replace("/e/", "/")} target="_blank" rel="noreferrer" className="inline-flex rounded-full border border-red-500/40 bg-red-500/15 px-6 py-3 text-sm font-black text-red-300 transition hover:bg-red-500/25">
                  Watch Teaser →
                </a>
                </GlowPulse>
                <Pill>More Coming</Pill>
              </div>
            </div>
            <div className="relative aspect-video w-full bg-black">
              <iframe src={TOWER_DEFENSE_TEASER} title="MAD Tower Defense teaser" className="absolute inset-0 h-full w-full" allow="autoplay; fullscreen" allowFullScreen />
            </div>
          </div>
        </SectionShell>
        </FadeIn>

        {/* ─── RISK NOTICE ─── */}
        <FadeIn delay={0.1}>
        <div className="mt-8"><RiskNotice /></div>
        </FadeIn>
      </div>
    </div>
  );
}
