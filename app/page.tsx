"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

const CA = "Fa7ZE9nCEYnrHsnoeHuhEExJpchtrBtKXnWe6CgHpump";

const LINKS = {
  buy: "https://jup.ag/tokens/Fa7ZE9nCEYnrHsnoeHuhEExJpchtrBtKXnWe6CgHpump",
  chart: "https://dexscreener.com/solana/gt3dwhhkrd2mnqmmchpzdetpg4ttaa23exn1m2vwinfs",
  phantom: "https://phantom.app",
  coinbase: "https://coinbase.com",
  jupiter: "https://jup.ag",
  telegram: "https://t.me/MadOfficalChannel",
  x: "https://x.com/madrichclub_",
  madMind: "/mad-mind",
  roadmap: "/roadmap",
  game: "/game",
  memes: "/memes",
  merch: "/merch",
} as const;

/* ─── UTILS ─── */
function useCopyToClipboard(timeout = 2000) {
  const [copied, setCopied] = useState(false);
  const copy = async (text: string) => {
    try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), timeout); }
    catch { /* ignore */ }
  };
  return { copied, copy };
}

/* ─── GRAIN TEXTURE — injected once in layout, referenced here ─── */
export function GrainOverlay() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[100] opacity-[0.035] mix-blend-overlay"
      style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")` }} />
  );
}

/* ─── LIVE TICKER ─── */
function LiveTicker() {
  const [stats, setStats] = useState<{ price: string; change: string; mcap: string; volume: string; buys: string; sells: string } | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("https://api.dexscreener.com/latest/dex/pairs/solana/Gt3dWHHKRd2mNQmmCHPzdeTpG4tTAa23exN1m2vwinfs");
        const data = await res.json();
        const pair = data.pairs?.[0];
        if (pair) {
          const b24 = pair.txns?.h24?.buys || 0;
          const s24 = pair.txns?.h24?.sells || 0;
          setStats({
            price: pair.priceUsd ? `$${parseFloat(pair.priceUsd).toFixed(8)}` : "—",
            change: pair.priceChange?.h24 ? `${pair.priceChange.h24 > 0 ? "+" : ""}${pair.priceChange.h24}%` : "—",
            mcap: pair.marketCap ? `$${(pair.marketCap / 1000).toFixed(1)}K` : "—",
            volume: pair.volume?.h24 ? `$${(pair.volume.h24 / 1000).toFixed(1)}K` : "—",
            buys: String(b24),
            sells: String(s24),
          });
        }
      } catch { /* silent */ }
    }
    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  if (!stats) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] bg-black/95 border-b border-white/10">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between gap-4 overflow-x-auto">
        <div className="flex items-center gap-6 min-w-max">
          <span className="text-white/30 text-[10px] font-black uppercase tracking-widest shrink-0">[ $MAD ]</span>
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-white/30 text-[10px] font-bold uppercase">PRICE</span>
            <span className="text-sm font-black text-white">{stats.price}</span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-white/30 text-[10px] font-bold uppercase">24H</span>
            <span className={`text-sm font-black ${stats.change.startsWith("+") ? "text-green-400" : stats.change.startsWith("-") ? "text-red-400" : "text-white/60"}`}>{stats.change}</span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-white/30 text-[10px] font-bold uppercase">BUYS</span>
            <span className="text-sm font-black text-green-400">{stats.buys}</span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-white/30 text-[10px] font-bold uppercase">SELLS</span>
            <span className="text-sm font-black text-red-400">{stats.sells}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="inline-flex rounded-full h-2 w-2 bg-green-400" />
          <span className="text-[10px] text-white/40 font-black">LIVE</span>
        </div>
      </div>
    </div>
  );
}

/* ─── GIANT BUTTON ─── */
function GiantButton({ href, children, primary = false, onClick }: { href?: string; children: React.ReactNode; primary?: boolean; onClick?: () => void }) {
  const className = [
    "inline-flex items-center justify-center gap-3 rounded-full font-black transition-all duration-300",
    "px-10 py-5 text-lg sm:text-xl sm:px-14 sm:py-6",
    primary
      ? "bg-red-600 text-white hover:bg-red-500 hover:scale-[1.03] shadow-[0_0_50px_rgba(255,0,0,0.25)]"
      : "border-2 border-white/20 bg-white/[0.03] text-white hover:border-white/40 hover:bg-white/[0.06] hover:scale-[1.03]",
  ].join(" ");

  if (onClick) return <button onClick={onClick} className={className}>{children}</button>;
  if (href?.startsWith("http")) return <a href={href} target="_blank" rel="noreferrer" className={className}>{children}</a>;
  return <Link href={href || "/"} className={className}>{children}</Link>;
}

/* ─── STAT CARD ─── */
function StatCard({ label, value, sub, color = "white" }: { label: string; value: string; sub?: string; color?: "white" | "green" | "red" }) {
  const colorClass = color === "green" ? "text-green-400" : color === "red" ? "text-red-400" : "text-white";
  return (
    <div className="flex flex-col items-center text-center p-6">
      <p className={`text-4xl sm:text-5xl font-black ${colorClass}`}>{value}</p>
      <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.24em] text-white/40">{label}</p>
      {sub && <p className="mt-1 text-xs font-bold text-white/50">{sub}</p>}
    </div>
  );
}

/* ─── STEP CARD ─── */
function StepCard({ number, title, icon, link, linkText }: { number: string; title: string; icon: React.ReactNode; link: string; linkText: string }) {
  return (
    <div className="flex flex-col items-center text-center p-6">
      <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-white/70 mb-4">
        {icon}
      </div>
      <p className="text-white/30 font-black text-2xl mb-2">{number}</p>
      <p className="text-white font-black text-lg mb-3">{title}</p>
      <a href={link} target="_blank" rel="noreferrer" className="text-sm font-bold text-white/50 hover:text-white transition-colors inline-flex items-center gap-1">
        {linkText}
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>
      </a>
    </div>
  );
}

/* ─── MEME SCROLL ─── */
function MemeScroll() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const memes = [
    { src: "/memes/MAD-KINGS-ONLY.png", alt: "Kings Only" },
    { src: "/memes/MAD-YOU-SIDELINED.png", alt: "You Sideline" },
    { src: "/memes/MAD-RICH-OR-BROKE.png", alt: "Rich or Broke" },
    { src: "/memes/MAD-BELIEVE.png", alt: "Believe" },
    { src: "/memes/MAD-ARMY.png", alt: "Army" },
    { src: "/memes/YOU-WILL-BE-MAD.png", alt: "You Will Be MAD" },
  ];

  return (
    <div className="relative">
      <div ref={scrollRef} className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
        {memes.map((meme) => (
          <div key={meme.src} className="snap-start shrink-0 w-[280px] sm:w-[320px] rounded-[24px] border border-white/10 bg-white/[0.02] overflow-hidden">
            <div className="aspect-square relative">
              <Image src={meme.src} alt={meme.alt} fill className="object-cover" sizes="320px" />
            </div>
          </div>
        ))}
        <Link href={LINKS.memes} className="snap-start shrink-0 w-[280px] sm:w-[320px] rounded-[24px] border border-white/10 bg-white/[0.02] flex items-center justify-center">
          <div className="text-center p-8">
            <p className="text-4xl mb-2 text-white/30">→</p>
            <p className="text-white/70 font-black text-lg">VIEW ALL</p>
            <p className="text-white/30 text-xs mt-1">29 MEMES</p>
          </div>
        </Link>
      </div>
      <div className="text-center mt-2">
        <p className="text-white/20 text-xs font-bold tracking-widest">← SWIPE TO EXPLORE →</p>
      </div>
    </div>
  );
}

/* ─── TEASER CARD ─── */
function TeaserCard({ href, title, sub, emoji }: { href: string; title: string; sub: string; emoji: string }) {
  return (
    <Link href={href} className="group flex flex-col items-center text-center p-8 rounded-[28px] border border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04] transition-all duration-300">
      <p className="text-5xl mb-4 group-hover:scale-110 transition-transform">{emoji}</p>
      <p className="text-white font-black text-xl mb-2">{title}</p>
      <p className="text-white/50 text-sm">{sub}</p>
      <p className="mt-4 text-white/30 font-bold text-sm group-hover:text-white/60 group-hover:translate-x-1 transition-all">Enter →</p>
    </Link>
  );
}

/* ─── CONFESSION BANNER ─── */
function ConfessionBanner() {
  const confessions = [
    "I panic sold Bitcoin at $16k. $MAD is my redemption arc.",
    "My family thinks I'm crazy. My wallet says I'm early.",
    "Sold my gaming PC to buy more $MAD. No regrets.",
    "I told my therapist about $MAD. She bought some.",
  ];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setIndex((i) => (i + 1) % confessions.length), 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="rounded-[24px] border border-white/10 bg-white/[0.02] p-6 sm:p-8 text-center">
      <p className="text-white/30 text-[10px] font-bold uppercase tracking-[0.3em] mb-4">[ Anonymous Confession ]</p>
      <p className="text-xl sm:text-2xl font-black text-white leading-tight">"{confessions[index]}"</p>
      <p className="mt-4 text-white/20 text-xs font-bold">— Holder #{273 + index}</p>
    </div>
  );
}

/* ─── SINGLE SCROLL REVEAL (stats section only) ─── */
function useInViewOnce() {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsInView(true); observer.disconnect(); } },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, isInView };
}

/* ═══════════════════════════════════════════════════════════
 LUXURY REDESIGN — Grain + Brackets + One Reveal
 ═══════════════════════════════════════════════════════════ */

export default function Home() {
  const [liveStats, setLiveStats] = useState<{ price: string; change: string; mcap: string; volume: string; buys: string; sells: string } | null>(null);
  const { copied, copy } = useCopyToClipboard();
  const { ref: statsRef, isInView: statsVisible } = useInViewOnce();

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("https://api.dexscreener.com/latest/dex/pairs/solana/Gt3dWHHKRd2mNQmmCHPzdeTpG4tTAa23exN1m2vwinfs");
        const data = await res.json();
        const pair = data.pairs?.[0];
        if (pair) {
          const b24 = pair.txns?.h24?.buys || 0;
          const s24 = pair.txns?.h24?.sells || 0;
          setLiveStats({
            price: pair.priceUsd ? `$${parseFloat(pair.priceUsd).toFixed(8)}` : "—",
            change: pair.priceChange?.h24 ? `${pair.priceChange.h24 > 0 ? "+" : ""}${pair.priceChange.h24}%` : "—",
            mcap: pair.marketCap ? `$${(pair.marketCap / 1000).toFixed(1)}K` : "—",
            volume: pair.volume?.h24 ? `$${(pair.volume.h24 / 1000).toFixed(1)}K` : "—",
            buys: String(b24),
            sells: String(s24),
          });
        }
      } catch { /* silent */ }
    }
    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <LiveTicker />
      <GrainOverlay />

      <main className="pt-16">
        {/* ═══════════════════════════════════════════
         HERO — 100vh, instant impact
        ═══════════════════════════════════════════ */}
        <section className="min-h-[100dvh] flex flex-col items-center justify-center px-4 py-20 relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,0,0,0.10),transparent_50%)]" />

          <div className="relative z-10 text-center max-w-4xl mx-auto">
            <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.4em] mb-8">
              [ Solana · 513M Supply · Limited ]
            </p>

            <h1 className="text-[18vw] sm:text-[14vw] md:text-[12vw] font-black leading-[0.8] tracking-[-0.04em] text-white"
              style={{ textShadow: "0 0 80px rgba(255,0,0,0.15)" }}
            >
              $MAD
            </h1>

            <p className="mt-8 text-xl sm:text-2xl font-bold text-white/60 max-w-lg mx-auto leading-relaxed">
              Most people fold. We build.
            </p>

            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
              <GiantButton href={LINKS.buy} primary>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                BUY $MAD
              </GiantButton>
              <GiantButton href={LINKS.chart}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>
                VIEW CHART
              </GiantButton>
            </div>

            <div className="mt-16 max-w-xl mx-auto">
              <ConfessionBanner />
            </div>
          </div>

          <div className="absolute bottom-8 left-0 right-0 text-center">
            <p className="text-white/15 text-xs font-bold tracking-widest">[ SCROLL DOWN ]</p>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
         THE NUMBERS — One scroll reveal
        ═══════════════════════════════════════════ */}
        <section ref={statsRef} className="py-24 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16"
              style={{
                opacity: statsVisible ? 1 : 0,
                transform: statsVisible ? "translateY(0)" : "translateY(24px)",
                transition: "opacity 0.8s cubic-bezier(0.25,0.46,0.45,0.94), transform 0.8s cubic-bezier(0.25,0.46,0.45,0.94)",
              }}
            >
              <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.4em] mb-3">[ 24 Hour Activity ]</p>
              <h2 className="text-4xl sm:text-5xl font-black text-white">The Numbers Don't Lie</h2>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4"
              style={{
                opacity: statsVisible ? 1 : 0,
                transform: statsVisible ? "translateY(0)" : "translateY(24px)",
                transition: "opacity 0.8s cubic-bezier(0.25,0.46,0.45,0.94) 0.15s, transform 0.8s cubic-bezier(0.25,0.46,0.45,0.94) 0.15s",
              }}
            >
              <div className="rounded-[28px] border border-white/10 bg-white/[0.02] p-6">
                <StatCard label="Price" value={liveStats?.price || "—"} sub="USD" />
              </div>
              <div className="rounded-[28px] border border-white/10 bg-white/[0.02] p-6">
                <StatCard label="24H Change" value={liveStats?.change || "—"} color={liveStats?.change?.startsWith("+") ? "green" : "red"} />
              </div>
              <div className="rounded-[28px] border border-white/10 bg-white/[0.02] p-6">
                <StatCard label="Buys" value={liveStats?.buys || "—"} sub="transactions" color="green" />
              </div>
              <div className="rounded-[28px] border border-white/10 bg-white/[0.02] p-6">
                <StatCard label="Sells" value={liveStats?.sells || "—"} sub="transactions" color="red" />
              </div>
            </div>

            {liveStats && liveStats.buys !== "—" && (
              <div className="mt-6 rounded-[24px] border border-white/10 bg-white/[0.02] p-6"
                style={{
                  opacity: statsVisible ? 1 : 0,
                  transform: statsVisible ? "translateY(0)" : "translateY(24px)",
                  transition: "opacity 0.8s cubic-bezier(0.25,0.46,0.45,0.94) 0.3s, transform 0.8s cubic-bezier(0.25,0.46,0.45,0.94) 0.3s",
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-white/30 text-xs font-bold uppercase">[ Buy Pressure ]</span>
                  <span className="text-green-400 text-sm font-black">
                    {Math.round((parseInt(liveStats.buys) / (parseInt(liveStats.buys) + parseInt(liveStats.sells))) * 100)}% BUY
                  </span>
                </div>
                <div className="w-full h-4 rounded-full bg-white/10 overflow-hidden flex">
                  <div className="h-full bg-green-500 rounded-full transition-all" style={{ width: `${Math.round((parseInt(liveStats.buys) / (parseInt(liveStats.buys) + parseInt(liveStats.sells))) * 100)}%` }} />
                  <div className="h-full bg-red-500 rounded-full transition-all" style={{ width: `${Math.round((parseInt(liveStats.sells) / (parseInt(liveStats.buys) + parseInt(liveStats.sells))) * 100)}%` }} />
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-green-400 text-xs font-bold">{liveStats.buys} BUYS</span>
                  <span className="text-red-400 text-xs font-bold">{liveStats.sells} SELLS</span>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ═══════════════════════════════════════════
         HOW TO GET IT
        ═══════════════════════════════════════════ */}
        <section className="py-24 px-4 sm:px-6 bg-[linear-gradient(180deg,transparent,rgba(255,0,0,0.02),transparent)]">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.4em] mb-3">[ Get Started ]</p>
              <h2 className="text-4xl sm:text-5xl font-black text-white">Get $MAD in 30 Seconds</h2>
            </div>

            <div className="grid sm:grid-cols-3 gap-6">
              <div className="rounded-[28px] border border-white/10 bg-white/[0.02] p-8 text-center">
                <StepCard
                  number="01"
                  title="Get Phantom"
                  icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 12V8H6a2 2 0 00-2 2v8a2 2 0 002 2h12v-4"/><path d="M16 6l4 4-4 4"/></svg>}
                  link={LINKS.phantom}
                  linkText="Download →"
                />
              </div>
              <div className="rounded-[28px] border border-white/10 bg-white/[0.02] p-8 text-center">
                <StepCard
                  number="02"
                  title="Buy SOL"
                  icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9 12h6m-3-3v6"/></svg>}
                  link={LINKS.coinbase}
                  linkText="Buy SOL →"
                />
              </div>
              <div className="rounded-[28px] border border-white/10 bg-white/[0.02] p-8 text-center">
                <StepCard
                  number="03"
                  title="Swap on Jupiter"
                  icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>}
                  link={LINKS.buy}
                  linkText="Buy $MAD →"
                />
              </div>
            </div>

            <div className="mt-8 rounded-[24px] border-2 border-white/10 bg-white/[0.02] p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                  <p className="text-white/30 text-xs font-bold uppercase tracking-widest mb-2">[ Contract Address ]</p>
                  <code className="text-white/60 font-mono text-sm sm:text-base break-all">{CA}</code>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => copy(CA)}
                    className={[
                      "inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold transition duration-300",
                      copied ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-white/[0.05] text-white/60 border border-white/10 hover:bg-white/[0.08] hover:text-white",
                    ].join(" ")}
                  >
                    {copied ? "Copied!" : "Copy CA"}
                  </button>
                  <GiantButton href={LINKS.buy} primary>BUY NOW</GiantButton>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
         THE ART
        ═══════════════════════════════════════════ */}
        <section className="py-24 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.4em] mb-3">[ $MAD Art ]</p>
              <h2 className="text-4xl sm:text-5xl font-black text-white">The Gallery</h2>
              <p className="mt-3 text-white/40 text-lg">Swipe. Laugh. Share.</p>
            </div>
            <MemeScroll />
          </div>
        </section>

        {/* ═══════════════════════════════════════════
         EXPLORE
        ═══════════════════════════════════════════ */}
        <section className="py-24 px-4 sm:px-6 bg-[linear-gradient(180deg,transparent,rgba(255,0,0,0.015),transparent)]">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.4em] mb-3">[ Explore ]</p>
              <h2 className="text-4xl sm:text-5xl font-black text-white">Go Deeper</h2>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <TeaserCard href={LINKS.madMind} title="MAD AI" sub="Chat with the machine" emoji="🤖" />
              <TeaserCard href={LINKS.roadmap} title="The Mad Path" sub="Where we're going" emoji="🗺️" />
              <TeaserCard href={LINKS.game} title="The Game" sub="Play. Win. Earn." emoji="🎮" />
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
         FINAL CTA
        ═══════════════════════════════════════════ */}
        <section className="py-24 px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-5xl sm:text-6xl font-black text-white mb-6">Still Here?</h2>
            <p className="text-xl text-white/50 mb-10">The chart doesn't care about your hesitation.</p>
            <GiantButton href={LINKS.buy} primary>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
              GET $MAD NOW
            </GiantButton>
            <div className="mt-8 flex items-center justify-center gap-6">
              <a href={LINKS.telegram} target="_blank" rel="noreferrer" className="text-white/20 hover:text-white transition-colors">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M21.2 2L2 10.8l5.6 2.4L16.8 6 9.6 14.8l.8 5.2L13 16.8l4.8 3.2L22 2.8"/></svg>
              </a>
              <a href={LINKS.x} target="_blank" rel="noreferrer" className="text-white/20 hover:text-white transition-colors">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
         RISK NOTICE
        ═══════════════════════════════════════════ */}
        <section className="px-4 sm:px-6 pb-24">
          <div className="max-w-3xl mx-auto rounded-[24px] border border-white/10 bg-white/[0.02] px-6 py-8 text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 mb-3">[ Risk Notice ]</p>
            <p className="text-sm text-white/50 leading-relaxed">
              $MAD is a meme coin. Nothing here is financial advice. Crypto is volatile. Never risk money you can't afford to lose. DYOR.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}