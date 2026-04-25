"use client";

import Image from "next/image";

const TUTORIAL_VIDEO = "https://www.youtube.com/embed/V0LBY-ZiklY";
const GAME_LINK = "https://www.roblox.com/games/133907998204829/Will-You-Get-RICH-Or-Stay-MAD";
const TOWER_DEFENSE_TEASER = "https://streamable.com/e/yc9dot";

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
    <div className="rounded-[1.4rem] border border-white/10 bg-black/25 p-5 hover:border-white/15 transition-colors group">
      <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mb-4 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-black text-white">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-white/65">{text}</p>
    </div>
  );
}

function FeatureCard({ title, desc, icon }: { title: string; desc: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-[1.4rem] border border-red-500/10 bg-[linear-gradient(180deg,rgba(40,0,0,0.3),rgba(10,0,0,0.4))] p-6 hover:border-red-500/20 transition-all hover:-translate-y-0.5">
      <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-black text-white mb-2">{title}</h3>
      <p className="text-sm text-white/55 leading-relaxed">{desc}</p>
    </div>
  );
}

function LeaderboardRow({ rank, name, score, highlight = false }: { rank: number; name: string; score: string; highlight?: boolean }) {
  const rankColor = rank === 1 ? "text-yellow-400" : rank === 2 ? "text-gray-300" : rank === 3 ? "text-orange-400" : "text-white/50";
  const rankBg = rank === 1 ? "bg-yellow-500/5 border-yellow-500/10" : highlight ? "bg-red-500/5 border-red-500/10" : "bg-white/[0.02] border-white/5";

  return (
    <div className={`flex items-center gap-4 rounded-xl border px-4 py-3 ${rankBg} transition-colors`}>
      <span className={`text-lg font-black w-6 text-center ${rankColor}`}>{rank}</span>
      <span className="flex-1 text-sm font-semibold text-white">{name}</span>
      <span className="text-sm font-bold text-red-300">{score}</span>
    </div>
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

// Inline SVG icons
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
};

export default function GamePage() {
  return (
    <div className="relative overflow-hidden bg-black text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(255,0,60,0.14),transparent_30%),radial-gradient(circle_at_85%_15%,rgba(255,90,0,0.1),transparent_28%),radial-gradient(circle_at_50%_100%,rgba(120,0,0,0.18),transparent_45%)]" />

      <div className="relative mx-auto max-w-7xl px-4 pb-24 pt-8 sm:px-6 lg:px-8">
        {/* ─── HERO ─── */}
        <SectionShell className="overflow-hidden p-0">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.95fr]">
            <div className="p-6 sm:p-8 lg:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.34em] text-red-200/75">PLAY NOW</p>
              <h1 className="mt-4 text-4xl font-black leading-[0.95] tracking-tight text-white sm:text-6xl">
                The <span className="text-red-500 drop-shadow-[0_0_14px_rgba(255,0,0,0.45)]">$MAD</span> game is live.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-white/70 sm:text-lg">
                Will You Get RICH Or Stay $MAD? A Roblox experience built by the community. Jump in now.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Pill tone="green">Easy Start</Pill>
                <Pill tone="red">Official Game</Pill>
                <Pill>Tutorial Included</Pill>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href={GAME_LINK} target="_blank" rel="noreferrer" className="inline-flex rounded-full border border-red-500/40 bg-red-500 px-7 py-4 text-base font-black text-white transition hover:scale-[1.02] hover:bg-red-400">
                  Play Now →
                </a>
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

        {/* ─── GAME FEATURES ─── */}
        <SectionShell className="mt-8 p-6 sm:p-8">
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-red-200/75">WHAT TO EXPECT</p>
            <h2 className="mt-3 text-3xl font-black leading-tight text-white sm:text-4xl">
              Game <span className="text-red-500">Features</span>
            </h2>
            <p className="mt-2 text-sm text-white/50 max-w-lg">
              Built on Roblox. Designed for the $MAD community. Play, compete, and prove your discipline.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <FeatureCard title="Rich vs MAD" desc="Make choices that test your temperament. Will you chase riches or stay true to the $MAD mindset?" icon={Icons.gamepad} />
            <FeatureCard title="Community Built" desc="Created by the $MAD community for the community. Not a corporate production." icon={Icons.users} />
            <FeatureCard title="Special Guests" desc="Community supporters featured in-game. Your favorite $MAD voices make appearances." icon={Icons.star} />
            <FeatureCard title="More Coming" desc="MAD Tower Defense is in development. The $MAD gaming universe is just getting started." icon={Icons.flame} />
          </div>
        </SectionShell>

        {/* ─── HOW IT WORKS ─── */}
        <SectionShell className="mt-8 p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-white/45">HOW IT WORKS</p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <SimpleCard title="1. Make Roblox" text="No account yet? Create one at roblox.com. It's free and takes 2 minutes." icon={Icons.user} />
            <SimpleCard title="2. Watch Help" text="New to Roblox? Use our tutorial for the easiest setup and first-game walkthrough." icon={Icons.play} />
            <SimpleCard title="3. Join $MAD" text="Click Play Now, join the official $MAD game, and start making decisions." icon={Icons.gamepad} />
          </div>
        </SectionShell>

        {/* ─── QUICK HELP + KUBO ─── */}
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

        {/* ─── LEADERBOARD + STATS ─── */}
        <SectionShell className="mt-8 p-6 sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-yellow-200/75">TOP PLAYERS</p>
              <h2 className="mt-3 text-3xl font-black leading-tight text-white sm:text-4xl">
                <span className="text-yellow-400">Leaderboard</span>
              </h2>
              <p className="mt-2 text-sm text-white/50 mb-6">
                The most disciplined players in the $MAD universe. Updated weekly.
              </p>
              <div className="space-y-2">
                <LeaderboardRow rank={1} name="MAD_King_42" score="12,450" />
                <LeaderboardRow rank={2} name="DiamondHODL" score="11,280" />
                <LeaderboardRow rank={3} name="StayMAD_99" score="10,115" />
                <LeaderboardRow rank={4} name="ChaosCtrl" score="9,840" />
                <LeaderboardRow rank={5} name="BuildNotFold" score="8,620" highlight />
              </div>
              <p className="mt-4 text-xs text-white/30">Season 1 · Ends in 14 days</p>
            </div>

            <div className="space-y-4">
              <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.02] p-6 text-center">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mb-3">
                  {Icons.users}
                </div>
                <div className="text-3xl font-black text-white">2,400+</div>
                <div className="text-xs uppercase tracking-[0.2em] text-white/40 mt-1">Total Players</div>
              </div>
              <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.02] p-6 text-center">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-3">
                  {Icons.chart}
                </div>
                <div className="text-3xl font-black text-white">18.5K</div>
                <div className="text-xs uppercase tracking-[0.2em] text-white/40 mt-1">Games Played</div>
              </div>
              <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.02] p-6 text-center">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-400 mb-3">
                  {Icons.trophy}
                </div>
                <div className="text-3xl font-black text-white">142</div>
                <div className="text-xs uppercase tracking-[0.2em] text-white/40 mt-1">This Week</div>
              </div>
            </div>
          </div>
        </SectionShell>

        {/* ─── COMING SOON ─── */}
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
                <a href="https://streamable.com/yc9dot" target="_blank" rel="noreferrer" className="inline-flex rounded-full border border-red-500/40 bg-red-500/15 px-6 py-3 text-sm font-black text-red-300 transition hover:bg-red-500/25">
                  Watch Teaser →
                </a>
                <Pill>More Coming</Pill>
              </div>
            </div>
            <div className="relative aspect-video w-full bg-black">
              <iframe src={TOWER_DEFENSE_TEASER} title="MAD Tower Defense teaser" className="absolute inset-0 h-full w-full" allow="autoplay; fullscreen" allowFullScreen />
            </div>
          </div>
        </SectionShell>

        {/* ─── RISK NOTICE ─── */}
        <div className="mt-8">
          <RiskNotice />
        </div>
      </div>
    </div>
  );
}
