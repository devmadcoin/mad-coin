"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";

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
                transition: `opacity 0.45s cubic-bezier(0.25,0.46,0.45,0.94) ${
                  baseDelay + i * staggerDelay
                }s, transform 0.45s cubic-bezier(0.25,0.46,0.45,0.94) ${
                  baseDelay + i * staggerDelay
                }s`,
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

function GlowPulse({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={className}
      style={{ animation: "glowPulse 3s ease-in-out infinite" }}
    >
      {children}
      <style>{`
        @keyframes glowPulse {
          0%,100% { box-shadow: 0 0 20px rgba(255,0,0,0.15); }
          50% { box-shadow: 0 0 35px rgba(255,0,0,0.28); }
        }
      `}</style>
    </div>
  );
}

function HoverLift({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={className}
      style={{
        transition: "transform 0.3s cubic-bezier(0.25,0.46,0.45,0.94)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════════ */

const TUTORIAL_VIDEO = "https://www.youtube.com/embed/V0LBY-ZiklY";
const GAME_LINK =
  "https://www.roblox.com/games/123392566067659/Mad-Phonk-Awakening";
const TOWER_DEFENSE_TEASER = "https://streamable.com/e/yc9dot";
const CREATOR = "@CoffeeCollectsBlox";
const CREATOR_LINK = "https://www.roblox.com/users/5183792958/profile";

const GAME_STATS = {
  visits: 7426,
  favorites: 12,
  active: 5,
  serverSize: 25,
  created: "4/14/2026",
  updated: "5/1/2026",
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function Pill({
  children,
  tone = "default",
}: {
  children: React.ReactNode;
  tone?: "default" | "red" | "green";
}) {
  return (
    <div
      className={cn(
        "rounded-full px-4 py-2 text-[11px] font-black uppercase tracking-[0.24em]",
        tone === "red" && "border border-red-500/25 bg-red-500/10 text-red-200",
        tone === "green" &&
          "border border-emerald-400/20 bg-emerald-500/10 text-emerald-200",
        tone === "default" &&
          "border border-white/10 bg-white/[0.04] text-white/70"
      )}
    >
      {children}
    </div>
  );
}

function SectionShell({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] shadow-[0_18px_50px_rgba(0,0,0,0.35)] backdrop-blur-xl",
        className
      )}
    >
      {children}
    </section>
  );
}

function SimpleCard({
  title,
  text,
  icon,
}: {
  title: string;
  text: string;
  icon: React.ReactNode;
}) {
  return (
    <HoverLift>
      <div className="rounded-[1.4rem] border border-white/10 bg-black/25 p-5 transition-colors hover:border-white/15 group">
        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 transition-transform group-hover:scale-110">
          {icon}
        </div>
        <h3 className="text-xl font-black text-white">{title}</h3>
        <p className="mt-3 text-sm leading-7 text-white/65">{text}</p>
      </div>
    </HoverLift>
  );
}

function StatCard({
  value,
  label,
  icon,
}: {
  value: string;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <HoverLift>
      <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.02] p-6 text-center transition-colors hover:border-white/15">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10 text-red-400">
          {icon}
        </div>
        <div className="text-3xl font-black text-white">{value}</div>
        <div className="mt-1 text-[11px] uppercase tracking-[0.2em] text-white/40">
          {label}
        </div>
      </div>
    </HoverLift>
  );
}

function RiskNotice() {
  return (
    <SectionShell className="border-yellow-500/20 bg-[linear-gradient(180deg,rgba(255,208,0,0.05),rgba(255,208,0,0.02))] px-6 py-8 sm:px-10 sm:py-10">
      <p className="text-center text-xs font-black uppercase tracking-[0.38em] text-yellow-300/85">
        Risk Notice
      </p>
      <p className="mx-auto mt-5 max-w-6xl text-center text-base leading-9 text-yellow-100/90 sm:text-xl">
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
    <div className="relative overflow-hidden bg-black text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(255,0,60,0.14),transparent_30%),radial-gradient(circle_at_85%_15%,rgba(255,90,0,0.1),transparent_28%),radial-gradient(circle_at_50%_100%,rgba(120,0,0,0.18),transparent_45%)]" />

      <div className="relative mx-auto max-w-7xl px-4 pb-24 pt-8 sm:px-6 lg:px-8">
        <FadeIn>
          <SectionShell className="overflow-hidden p-0">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.95fr]">
              <div className="p-6 sm:p-8 lg:p-10">
                <p className="text-xs font-semibold uppercase tracking-[0.34em] text-red-200/75">
                  OFFICIAL $MAD EXPERIENCE — NOW LIVE
                </p>

                <h1 className="mt-4 text-4xl font-black leading-[0.95] tracking-tight text-white sm:text-6xl">
                  Mad{" "}
                  <span className="text-red-500 drop-shadow-[0_0_14px_rgba(255,0,0,0.45)]">
                    Phonk
                  </span>
                  <br />
                  <span className="text-red-500 drop-shadow-[0_0_14px_rgba(255,0,0,0.45)]">
                    Awakening
                  </span>
                </h1>

                <p className="mt-5 max-w-2xl text-base leading-8 text-white/70 sm:text-lg">
                  The first official $MAD game just dropped. Step into the arena, 
                  wield the MAD blade, and prove your conviction. This isn't a 
                  prototype — this is the real signal.
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
                      className="inline-flex rounded-full border border-red-500/40 bg-red-500 px-7 py-4 text-base font-black text-white transition hover:scale-[1.02] hover:bg-red-400"
                    >
                      Play Mad Phonk Awakening →
                    </a>
                  </GlowPulse>

                  <a
                    href={TUTORIAL_VIDEO.replace("/embed/", "/watch?v=")}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-7 py-4 text-base font-black text-white/85 transition hover:border-white/20 hover:bg-white/[0.08]"
                  >
                    Watch Tutorial
                  </a>
                </div>
              </div>

              <div className="relative min-h-[280px] sm:min-h-[360px] lg:min-h-full">
                <Image
                  src="/game/mad-phonk-awakening-hero.png"
                  alt="Mad Phonk Awakening — Official $MAD Game"
                  fill
                  priority
                  className="object-cover"
                />
              </div>
            </div>
          </SectionShell>
        </FadeIn>

        <FadeIn delay={0.1}>
          <SectionShell className="mt-8 p-6 sm:p-8">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.32em] text-red-200/75">
                  LIVE STATS
                </p>
                <h2 className="mt-2 text-2xl font-black text-white">
                  Game Activity
                </h2>
              </div>

              <a
                href={GAME_LINK}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-white/40 transition-colors hover:text-red-400"
              >
                View on Roblox →
              </a>
            </div>

            <StaggerGrid className="grid grid-cols-2 gap-3 sm:grid-cols-4" staggerDelay={0.06}>
              <StatCard value={GAME_STATS.visits.toLocaleString()} label="Visits" icon={Icons.eye} />
              <StatCard value={GAME_STATS.favorites.toString()} label="Favorites" icon={Icons.heart} />
              <StatCard value={GAME_STATS.active.toString()} label="Active Now" icon={Icons.users} />
              <StatCard value={`${GAME_STATS.serverSize}`} label="Server Size" icon={Icons.server} />
            </StaggerGrid>

            <div className="mt-4 flex flex-wrap gap-4 text-xs text-white/30">
              <span>Created {GAME_STATS.created}</span>
              <span>Updated {GAME_STATS.updated}</span>
              <span>
                By{" "}
                <a
                  href={CREATOR_LINK}
                  target="_blank"
                  rel="noreferrer"
                  className="text-red-400/60 hover:text-red-400"
                >
                  {CREATOR}
                </a>
              </span>
            </div>
          </SectionShell>
        </FadeIn>

        <FadeIn delay={0.1}>
          <SectionShell className="mt-8 p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-white/45">
              HOW IT WORKS
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

        <FadeIn delay={0.1}>
          <SectionShell className="mt-8 p-6 sm:p-8">
            <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
              <div>
                <div className="max-w-4xl">
                  <p className="text-xs font-semibold uppercase tracking-[0.32em] text-red-200/75">
                    QUICK HELP
                  </p>
                  <h2 className="mt-3 text-3xl font-black leading-tight text-white sm:text-5xl">
                    Need help first?
                  </h2>
                  <p className="mt-4 max-w-3xl text-base leading-8 text-white/70">
                    Watch this quick setup video to get into Roblox and start
                    playing fast.
                  </p>
                </div>

                <div className="mt-8 overflow-hidden rounded-[1.6rem] border border-white/10 bg-black shadow-[0_0_24px_rgba(255,0,0,0.12)]">
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

              <div className="rounded-[1.8rem] border border-white/10 bg-white/[0.03] p-5 sm:p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.32em] text-red-200/75">
                  SPECIAL GUEST
                </p>

                <div className="mt-4 overflow-hidden rounded-[1.4rem] border border-white/10 bg-black">
                  <div className="relative aspect-square w-full">
                    <Image
                      src="/game/kubo-special-guest.jpg"
                      alt="Kubo special guest"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>

                <h3 className="mt-5 text-2xl font-black text-white sm:text-3xl">
                  Kubo was a{" "}
                  <span className="text-red-500 drop-shadow-[0_0_12px_rgba(255,0,0,0.45)]">
                    special guest
                  </span>
                </h3>

                <p className="mt-3 text-sm leading-7 text-white/65">
                  Community supporter featured inside the $MAD gaming world.
                </p>

                <div className="mt-6">
                  <a
                    href="https://x.com/Kubo100x"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex rounded-full border border-red-500/40 bg-red-500 px-6 py-3 text-sm font-black text-white transition hover:scale-[1.02] hover:bg-red-400"
                  >
                    Visit @Kubo100x →
                  </a>
                </div>
              </div>
            </div>
          </SectionShell>
        </FadeIn>

        <FadeIn delay={0.1}>
          <SectionShell className="mt-8 overflow-hidden p-0">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="flex flex-col justify-center p-6 sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.32em] text-red-300/75">
                  COMING SOON
                </p>

                <h2 className="mt-4 text-4xl font-black leading-[0.95] text-white sm:text-5xl">
                  MAD Tower Defense
                </h2>

                <p className="mt-5 max-w-xl text-base leading-8 text-white/68">
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
                      className="inline-flex rounded-full border border-red-500/40 bg-red-500/15 px-6 py-3 text-sm font-black text-red-300 transition hover:bg-red-500/25"
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

        <FadeIn delay={0.1}>
          <div className="mt-8">
            <RiskNotice />
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
