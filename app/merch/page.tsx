"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

const CA = "Fa7ZE9nCEYnrHsnoeHuhEExJpchtrBtKXnWe6CgHpump";

const LINKS = {
  buy: "https://jup.ag/tokens/Fa7ZE9nCEYnrHsnoeHuhEExJpchtrBtKXnWe6CgHpump",
  merch: "/merch",
  telegram: "https://t.me/MadOfficalChannel",
  x: "https://x.com/madrichclub_",
  instagram: "https://www.instagram.com/madrichclub/",
  tiktok: "https://www.tiktok.com/@madrichclub",
} as const;

const PROOF_IMAGES = [
  { src: "/proof/mad-sticker-1.png", alt: "$MAD sticker on laptop", caption: "Got my sticker. Laptop game strong." },
  { src: "/proof/mad-sticker-2.png", alt: "$MAD sticker on water bottle", caption: "Hydrated and $MAD." },
  { src: "/proof/mad-sticker-3.png", alt: "$MAD sticker on phone case", caption: "Mobile $MAD energy." },
] as const;

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/* ─── LIVE TICKER ─── */
function LiveTicker() {
  const [stats, setStats] = useState<{ price: string; change: string; mcap: string; volume: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("https://api.dexscreener.com/latest/dex/tokens/Fa7ZE9nCEYnrHsnoeHuhEExJpchtrBtKXnWe6CgHpump");
        const data = await res.json();
        const pair = data.pairs?.[0];
        if (pair) {
          setStats({
            price: pair.priceUsd ? `$${parseFloat(pair.priceUsd).toFixed(8)}` : "—",
            change: pair.priceChange?.h24 ? `${pair.priceChange.h24 > 0 ? "+" : ""}${pair.priceChange.h24}%` : "—",
            mcap: pair.marketCap ? `$${(pair.marketCap / 1000).toFixed(1)}K` : "—",
            volume: pair.volume?.h24 ? `$${(pair.volume.h24 / 1000).toFixed(1)}K` : "—",
          });
        }
      } catch {
        setStats(null);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="fixed top-0 left-0 right-0 z-[60] bg-black/90 backdrop-blur-xl border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-2 flex items-center justify-center gap-4">
          <span className="text-white/40 text-xs font-bold">Loading $MAD stats...</span>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const items = [
    { label: "PRICE", value: stats.price },
    { label: "24H", value: stats.change, color: stats.change.startsWith("+") ? "text-green-400" : stats.change.startsWith("-") ? "text-red-400" : "text-white/60" },
    { label: "MCAP", value: stats.mcap },
    { label: "24H VOL", value: stats.volume },
    { label: "CA", value: CA.slice(0, 6) + "..." + CA.slice(-4) },
  ];

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] bg-black/90 backdrop-blur-xl border-b border-white/10">
      <div className="mx-auto max-w-7xl px-4 py-2 flex items-center justify-between gap-4 overflow-x-auto">
        <div className="flex items-center gap-6 min-w-max">
          <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest shrink-0">$MAD Live</span>
          {items.map((item) => (
            <div key={item.label} className="flex items-center gap-1.5 shrink-0">
              <span className="text-white/30 text-[10px] font-bold uppercase">{item.label}</span>
              <span className={cn("text-xs font-black", item.color || "text-white")}>{item.value}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
          </span>
          <span className="text-[10px] text-white/40 font-bold">LIVE</span>
        </div>
      </div>
    </div>
  );
}

/* ─── HOOKS ─── */
function useCopyToClipboard(timeout = 2000) {
  const [copied, setCopied] = useState(false);
  const copy = async (text: string) => {
    try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), timeout); }
    catch { /* ignore */ }
  };
  return { copied, copy };
}

function CopyButton({ text = CA }: { text?: string }) {
  const { copied, copy } = useCopyToClipboard();
  return (
    <button
      onClick={() => copy(text)}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold transition duration-300",
        copied
          ? "border border-green-400/30 bg-green-400/10 text-green-400"
          : "border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20",
      )}
    >
      {copied ? "Copied!" : "Copy CA"}
    </button>
  );
}

/* ─── HERO ─── */
function ProofHero() {
  return (
    <section className="pt-32 pb-12 sm:pt-40 sm:pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <span className="rounded-full border border-red-500/25 bg-red-500/10 px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.25em] text-red-300 mb-6 inline-flex">
          Real Holders. Real Stickers.
        </span>
        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black text-white leading-[0.9] tracking-tight">
          PROOF OF <span className="text-red-500">$MAD</span>.
        </h1>
        <p className="mt-5 text-lg sm:text-xl text-white/55 max-w-xl mx-auto leading-relaxed">
          Not paid actors. Not renders. Real people flexing $MAD stickers in the wild.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-white/55">Verified Holders</span>
          <span className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-emerald-300">Community Submitted</span>
        </div>
      </div>
    </section>
  );
}

/* ─── PHOTO CAROUSEL ─── */
function PhotoCarousel() {
  const [current, setCurrent] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const next = () => setCurrent((prev) => (prev + 1) % PROOF_IMAGES.length);
  const prev = () => setCurrent((prev) => (prev - 1 + PROOF_IMAGES.length) % PROOF_IMAGES.length);

  const handleTouchStart = (e: React.TouchEvent) => setTouchStart(e.targetTouches[0].clientX);
  const handleTouchMove = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX);
  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) next();
    if (touchStart - touchEnd < -50) prev();
  };

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(next, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, current]);

  return (
    <section className="py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Carousel */}
        <div 
          className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-black/40 shadow-[0_20px_80px_rgba(0,0,0,0.5)]"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          <div
            className="relative aspect-[4/3] sm:aspect-[16/9] lg:aspect-[2/1] overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {PROOF_IMAGES.map((item, i) => (
              <div
                key={i}
                className={cn(
                  "absolute inset-0 transition-all duration-700 ease-out",
                  i === current ? "opacity-100 translate-x-0 scale-100" : "opacity-0",
                  i < current ? "-translate-x-full scale-95" : i > current ? "translate-x-full scale-95" : ""
                )}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                  priority={i === 0}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Caption overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="rounded-full border border-red-500/30 bg-red-500/15 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-red-300">
                      Proof #{String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <p className="text-xl sm:text-3xl font-black text-white">{item.caption}</p>
                  <p className="mt-1 text-sm text-white/50">{item.alt}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation arrows */}
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white hover:bg-black/80 transition-all hover:scale-110 z-10"
            aria-label="Previous"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white hover:bg-black/80 transition-all hover:scale-110 z-10"
            aria-label="Next"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
          </button>

          {/* Dots indicator */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
            {PROOF_IMAGES.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={cn(
                  "h-2.5 rounded-full transition-all duration-300",
                  i === current ? "bg-red-500 w-8" : "bg-white/30 w-2.5 hover:bg-white/50"
                )}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Thumbnail strip */}
        <div className="mt-5 flex items-center justify-center gap-3">
          {PROOF_IMAGES.map((item, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={cn(
                "relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden border-2 transition-all duration-300",
                i === current ? "border-red-500 scale-105 shadow-[0_0_20px_rgba(255,0,0,0.3)]" : "border-white/10 opacity-50 hover:opacity-80"
              )}
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                className="object-cover"
                sizes="112px"
              />
            </button>
          ))}
        </div>

        {/* Counter */}
        <p className="mt-4 text-center text-xs text-white/40 font-bold uppercase tracking-widest">
          {current + 1} / {PROOF_IMAGES.length}
        </p>
      </div>
    </section>
  );
}

/* ─── CTA BANNER ─── */
function ProofCTA() {
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-red-500/20 bg-[radial-gradient(circle_at_top_right,rgba(255,0,0,0.10),rgba(6,0,0,0.95))] p-8 sm:p-12 text-center">
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-red-500/5 rounded-full blur-3xl" />

          <p className="text-[11px] font-black uppercase tracking-[0.34em] text-red-300/80">
            Want Your Photo Here?
          </p>
          <h2 className="mt-3 text-3xl sm:text-5xl font-black text-white">
            GET THE STICKER.<br className="hidden sm:block" /> JOIN THE WALL.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-white/60 max-w-xl mx-auto">
            Buy $MAD, grab the sticker, slap it somewhere loud, and tag us. Your proof could be next.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={LINKS.merch}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-red-500 hover:bg-red-400 text-white text-lg font-black rounded-full transition-all hover:scale-[1.02] shadow-[0_0_30px_rgba(255,0,0,0.25)]"
            >
              Shop Stickers
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>
            </a>
            <a
              href={LINKS.buy}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-6 py-4 border border-white/15 rounded-full text-sm font-bold text-white/70 hover:text-white hover:border-white/30 transition-all"
            >
              Buy $MAD Token
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── RISK NOTICE ─── */
function RiskNotice() {
  return (
    <section className="py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-yellow-400/15 bg-yellow-500/[0.07] px-6 py-8 text-center">
          <p className="text-[11px] font-black uppercase tracking-[0.34em] text-yellow-200/80">Risk Notice</p>
          <p className="mt-4 text-yellow-100/85 max-w-4xl mx-auto text-sm sm:text-base">
            $MAD is a meme coin and speculative digital asset. Nothing on this website is financial advice or a guarantee of returns. Crypto is risky and volatile. Never risk money you cannot afford to lose.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ─── FOOTER ─── */
function Footer() {
  const socials = [
    { name: "Telegram", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.2 2L2 10.8l5.6 2.4L16.8 6 9.6 14.8l.8 5.2L13 16.8l4.8 3.2L22 2.8"/></svg>, href: LINKS.telegram },
    { name: "X", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>, href: LINKS.x },
    { name: "Instagram", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/></svg>, href: LINKS.instagram },
    { name: "TikTok", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.24 4.97v-7.36a8.24 8.24 0 004.55 1.37V10.4a4.85 4.85 0 01-3.77-4.25c.02-.15.04-.31.04-.47V2h3.45v3.45c0 .16.02.32.04.47a4.83 4.83 0 003.77 4.25c.28.06.56.1.85.1v-3.5a1.5 1.5 0 01-.85.1z"/></svg>, href: LINKS.tiktok },
  ];

  return (
    <footer className="border-t border-white/10">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white font-black text-lg">M</div>
              <div>
                <span className="text-white font-black text-xl">$MAD</span>
                <span className="block text-white/40 text-[10px] tracking-[0.3em] uppercase">Stay $MAD</span>
              </div>
            </div>
            <p className="text-white/50 text-sm leading-relaxed mb-6">The Supreme of Solana. Limited. Exclusive. Cult.</p>
            <div className="flex items-center gap-2">
              {socials.map((s) => (
                <a key={s.name} href={s.href} target="_blank" rel="noreferrer" className="w-10 h-10 bg-white/5 hover:bg-red-500/10 border border-white/5 hover:border-red-500/20 rounded-xl flex items-center justify-center text-white/40 hover:text-red-400 transition-all" title={s.name}>{s.icon}</a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-white font-bold text-sm mb-4 tracking-wide">NAVIGATION</h4>
            <ul className="space-y-2.5">
              {[{l:"Home",h:"/"},{l:"MAD AI",h:"/mad-mind"},{l:"Roadmap",h:"/roadmap"},{l:"Game",h:"/game"},{l:"Memes",h:"/memes"},{l:"Merch",h:"/merch"}].map((link)=>(
                <li key={link.l}><Link href={link.h} className="text-white/50 hover:text-white text-sm font-medium transition-colors">{link.l}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold text-sm mb-4 tracking-wide">BUY & TRACK</h4>
            <ul className="space-y-2.5">
              {[{l:"Buy on Jupiter",h:LINKS.buy},{l:"Solscan",h:"https://solscan.io/token/Fa7ZE9nCEYnrHsnoeHuhEExJpchtrBtKXnWe6CgHpump"}].map((link)=>(
                <li key={link.l}><a href={link.h} target="_blank" rel="noreferrer" className="text-white/50 hover:text-white text-sm font-medium transition-colors inline-flex items-center gap-1">{link.l}<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg></a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold text-sm mb-4 tracking-wide">CONTRACT ADDRESS</h4>
            <div className="p-4 bg-white/[0.02] border border-white/10 rounded-xl">
              <code className="text-xs text-red-400 font-mono break-all block mb-3">{CA}</code>
              <CopyButton />
            </div>
            <a href={LINKS.telegram} target="_blank" rel="noreferrer" className="mt-3 flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white text-sm font-bold transition-all">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.2 2L2 10.8l5.6 2.4L16.8 6 9.6 14.8l.8 5.2L13 16.8l4.8 3.2L22 2.8"/></svg>
              Join Telegram
            </a>
          </div>
        </div>
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-xs">&copy; {new Date().getFullYear()} $MAD. All rights reserved.</p>
          <p className="text-white/40 text-xs">Stay $MAD. Limited. Exclusive. Cult.</p>
        </div>
      </div>
    </footer>
  );
}

/* ─── MAIN PAGE ─── */
export default function ProofPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#050505] text-white">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(255,0,0,0.10),transparent_28%),radial-gradient(circle_at_80%_10%,rgba(16,185,129,0.08),transparent_22%),radial-gradient(circle_at_50%_80%,rgba(255,255,255,0.03),transparent_25%),linear-gradient(180deg,#050505,#020202)]" />

      <LiveTicker />

      <main className="mx-auto max-w-7xl px-4 pb-24 pt-6 sm:px-6 lg:px-8">
        <div className="h-20" />
        <ProofHero />
        <PhotoCarousel />
        <ProofCTA />
        <RiskNotice />
      </main>

      <Footer />
    </div>
  );
}
