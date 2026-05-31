"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

const CA = "Fa7ZE9nCEYnrHsnoeHuhEExJpchtrBtKXnWe6CgHpump";

const DASHBOARD_CARDS = [
  {
    title: "Game",
    subtitle: "Mad Phonk Awakening",
    href: "/game",
    image: "/game/mad-phonk-awakening-hero.png",
    cta: "Play",
  },
  {
    title: "Memes",
    subtitle: "32 Pieces. All Rare.",
    href: "/memes",
    image: "/memes/MAD-ROLLERCOASTER.png",
    cta: "Download",
  },
  {
    title: "MAD Mind",
    subtitle: "Talk to the bot",
    href: "/mad-mind",
    image: "/MAD-MIND-HEAD.png",
    cta: "Chat",
  },
  {
    title: "Rewards",
    subtitle: "Hold. Unlock. Earn.",
    href: "/rewards",
    image: "/memes/MAD-KINGS-ONLY.png",
    cta: "View",
  },
  {
    title: "Merch",
    subtitle: "Real $MAD goods",
    href: "/merch",
    image: "/merch/hero/merch-hero-bg.jpg",
    cta: "Shop",
  },
  {
    title: "Roadmap",
    subtitle: "The plan ahead",
    href: "/roadmap",
    image: "/roadmap/the-mad-roadmap.png",
    cta: "Explore",
  },
];

const LINKS = {
  telegram: "https://t.me/MadRichClub",
  x: "https://x.com/madrichclub_",
  instagram: "https://www.instagram.com/madrichclub/",
  tiktok: "https://www.tiktok.com/@madrichclub",
  buy: "https://jup.ag/?sell=So11111111111111111111111111111111111111112&buy=Fa7ZE9nCEYnrHsnoeHuhEExJpchtrBtKXnWe6CgHpump",
  chart: "https://dexscreener.com/solana/gt3dwhhkrd2mnqmmchpzdetpg4ttaa23exn1m2vwinfs",
  jupiter: "https://jup.ag/tokens/Fa7ZE9nCEYnrHsnoeHuhEExJpchtrBtKXnWe6CgHpump",
  solscan: "https://solscan.io/token/Fa7ZE9nCEYnrHsnoeHuhEExJpchtrBtKXnWe6CgHpump",
  birdeye: "https://birdeye.so/solana/token/Fa7ZE9nCEYnrHsnoeHuhEExJpchtrBtKXnWe6CgHpump",
  okx: "https://web3.okx.com/dex-swap?chain=solana,solana&token=11111111111111111111111111111111,Fa7ZE9nCEYnrHsnoeHuhEExJpchtrBtKXnWe6CgHpump",
  gate: "https://www.gate.com/alpha/sol-Fa7ZE9nCEYnrHsnoeHuhEExJpchtrBtKXnWe6CgHpump",
  dexscreener: "https://dexscreener.com/solana/gt3dwhhkrd2mnqmmchpzdetpg4ttaa23exn1m2vwinfs",
  mexc: "https://www.mexc.com/dex/trade?pair_ca=Gt3dWHHKRd2mNQmmCHPzdeTpG4tTAa23exN1m2vwinfs&chain_id=100000&token_ca=Fa7ZE9nCEYnrHsnoeHuhEExJpchtrBtKXnWe6CgHpump&from=search",
  game: "https://www.roblox.com/games/123392566067659/Mad-Phonk-Awakening",
  youtube: "https://youtube.com/@coffeecollectshq",
} as const;

/* ═══════════════════════════════════════════════════════════
   UTILITIES
   ═══════════════════════════════════════════════════════════ */

function useCopyToClipboard(timeout = 2000) {
  const [copied, setCopied] = useState(false);
  const copy = async (text: string) => {
    try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), timeout); }
    catch { /* ignore */ }
  };
  return { copied, copy };
}

/* ─── SCANLINE OVERLAY ─── */
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

/* ─── FLOATING PARTICLES ─── */
function FloatingParticles() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-[#FF2D2D]/10 blur-sm"
          style={{
            width: `${Math.random() * 4 + 2}px`,
            height: `${Math.random() * 4 + 2}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `floatUp ${Math.random() * 4 + 4}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        />
      ))}
    </div>
  );
}

/* ─── COPY BUTTON ─── */
function CopyButton({ text = CA, label = "Copy CA" }: { text?: string; label?: string }) {
  const { copied, copy } = useCopyToClipboard();
  return (
    <button onClick={() => copy(text)} className={[
      "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold transition duration-300",
      copied ? "border border-[#FF6B00]/30 bg-[#FF6B00]/10 text-[#FF6B00]" : "border border-[#FF2D2D]/30 bg-[#FF2D2D]/10 text-[#FF2D2D] hover:bg-[#FF2D2D]/20",
    ].join(" ")}>
      {copied ? (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
      )}
      {copied ? "Copied!" : label}
    </button>
  );
}

/* ─── CONTRACT BLOCK ─── */
function ContractBlock() {
  const { copied, copy } = useCopyToClipboard();
  return (
    <div 
      onClick={() => copy(CA)}
      className="group cursor-pointer relative overflow-hidden rounded-[24px] border border-[#FF2D2D]/20 bg-[#FF2D2D]/[0.04] p-5 sm:p-6 backdrop-blur-sm transition-all duration-500 hover:border-[#FF2D2D]/50 hover:shadow-[0_0_40px_rgba(255,45,45,0.15)] hover:bg-[#FF2D2D]/[0.07]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,45,45,0.08),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative z-10">
        <p className="text-[10px] font-bold uppercase tracking-[0.34em] text-[#FF2D2D]/60 mb-3">Solana Contract</p>
        <code className="block text-[#FF2D2D] font-mono text-sm sm:text-base break-all leading-relaxed">{CA}</code>
        <div className="mt-4 flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-white/40">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
            {copied ? "COPIED — PASTE INTO PHANTOM" : "TAP TO COPY"}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   THE CINEMA — Full-viewport video hero (stays dark)
   ═══════════════════════════════════════════════════════════ */
function TheCinema() {
  return (
    <section className="relative min-h-[100dvh] flex flex-col items-center justify-end overflow-hidden">
      {/* Video background */}
      <div className="absolute inset-0 z-0">
        <video 
          autoPlay 
          muted 
          loop 
          playsInline 
          preload="auto"
          className="w-full h-full object-cover"
        >
          <source src="/loops/bullish-mad.mp4" type="video/mp4" />
        </video>
        {/* Dark gradient overlay — fades from clear top to solid bottom */}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_20%,rgba(8,8,8,0.5)_50%,rgba(8,8,8,0.92)_75%,#080808_100%)]" />
      </div>

      {/* Content overlay at bottom */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 pb-12 sm:pb-16">
        {/* The Declaration */}
        <h1 className="text-center">
          <span className="block text-[2rem] sm:text-[3rem] lg:text-[4rem] font-black tracking-[-0.02em] text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
            STOP
          </span>
          <span className="block text-[2rem] sm:text-[3rem] lg:text-[4rem] font-black tracking-[-0.02em] text-[#FF2D2D] drop-shadow-[0_0_20px_rgba(255,45,45,0.4)]">
            PANICKING.
          </span>
          <span className="block text-[3rem] sm:text-[5rem] lg:text-[7rem] font-black leading-[0.85] tracking-[-0.05em] text-white mt-2">
            GET <span className="text-green-400">$MAD</span> RICH.
          </span>
        </h1>

        {/* Contract + Buy */}
        <div className="mt-8 max-w-xl mx-auto">
          <ContractBlock />
        </div>

        {/* Buy button */}
        <div className="mt-4 flex justify-center">
          <a 
            href={LINKS.buy} 
            target="_blank" 
            rel="noreferrer"
            className="group flex items-center gap-2 px-8 py-4 bg-[#FF6B00] hover:bg-[#FF8533] text-white text-base font-black rounded-full transition-all hover:scale-[1.02] shadow-[0_0_30px_rgba(255,107,0,0.25)]"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
            SWAP ON JUPITER
          </a>
        </div>

        {/* Minimal chips */}
        {/* Removed — stats now in WhatIsMAD section */}
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/15 z-10">
        <span className="text-[9px] font-bold uppercase tracking-[0.34em]">Explore</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-bounce"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   WHY $MAD STRIP — Elevator pitch credibility cluster
   Six trust signals. One glance. Zero doubt.
   ═══════════════════════════════════════════════════════════ */
function WhyMADStrip() {
  const signals = [
    { icon: "👤", label: "Doxxed", sub: "Not a LARP" },
    { icon: "🎮", label: "Real Game", sub: "Roblox Live" },
    { icon: "💰", label: "0% Tax", sub: "Every Trade" },
    { icon: "🚫", label: "No VC", sub: "Community First" },
    { icon: "🔐", label: "Locked", sub: "6 Communities" },
    { icon: "⚡", label: "No Presale", sub: "Fair Launch" },
  ];

  return (
    <section className="px-4 sm:px-6 py-8 sm:py-10 bg-[#F5F1E8] border-b border-[#1a1a1a]/10">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 sm:gap-4">
          {signals.map((s) => (
            <div
              key={s.label}
              className="flex flex-col items-center text-center p-3 sm:p-4 rounded-2xl border border-[#1a1a1a]/10 bg-[#1a1a1a]/[0.02] hover:border-[#FF2D2D]/20 hover:bg-[#FF2D2D]/[0.03] transition-all duration-300 group"
            >
              <span className="text-xl sm:text-2xl mb-1 group-hover:scale-110 transition-transform">{s.icon}</span>
              <p className="text-xs sm:text-sm font-black text-[#1a1a1a] uppercase tracking-wider">{s.label}</p>
              <p className="text-[9px] sm:text-[10px] text-[#1a1a1a]/40 mt-0.5">{s.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   THE DASHBOARD — Chimpers-style command center
   ═══════════════════════════════════════════════════════════ */
function TheDashboard() {
  return (
    <section className="px-4 sm:px-6 py-12 sm:py-16 bg-[#F5F1E8]">
      <div className="max-w-6xl mx-auto">
        {/* Section label */}
        <p className="text-[11px] font-bold uppercase tracking-[0.34em] text-[#8B7355] mb-2">
          Everything $MAD
        </p>
        <h2 className="text-2xl sm:text-3xl font-black text-[#1a1a1a] mb-8">
          The <span className="text-[#FF2D2D]">Command Center</span>
        </h2>

        {/* Card grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-5">
          {DASHBOARD_CARDS.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className="group relative overflow-hidden rounded-[1.5rem] border border-[#1a1a1a]/10 bg-[#1a1a1a]/[0.02] hover:border-[#FF2D2D]/30 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_40%,rgba(245,241,232,0.95)_90%)]" />
              </div>
              {/* Text */}
              <div className="p-4 sm:p-5">
                <p className="text-sm sm:text-base font-black text-[#1a1a1a] group-hover:text-[#FF2D2D] transition-colors">
                  {card.title}
                </p>
                <p className="text-[10px] sm:text-xs text-[#1a1a1a]/40 mt-0.5">
                  {card.subtitle}
                </p>
                <div className="mt-3 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#FF2D2D]/70 group-hover:text-[#FF2D2D] transition-colors">
                  {card.cta}
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M7 17L17 7M17 7H7M17 7v10"/>
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   WHAT IS $MAD — Venetian crème
   ═══════════════════════════════════════════════════════════ */
function WhatIsMAD() {
  return (
    <section className="px-4 sm:px-6 py-20 sm:py-28 bg-[#F5F1E8]">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1a1a1a] mb-8 sm:mb-10">
          What is <span className="text-[#FF2D2D]">$MAD</span>
        </h2>

        <div className="space-y-6 text-sm sm:text-base leading-relaxed text-[#1a1a1a]/60">
          <p>
            <span className="text-[#1a1a1a] font-bold">$MAD is not a token. It&apos;s a frequency.</span> Most projects sell you a future. $MAD sells you a present — the present where you are already mad rich, already part of something, already holding.
          </p>
          <p>
            The dev is <span className="text-[#1a1a1a] font-bold">doxxed</span>. The <Link href="/game" className="text-[#FF2D2D] hover:text-[#1a1a1a] transition-colors">Roblox game</Link> is real. There was no presale, no VC, no tax. Just a contract, a community, and a group of people who decided they were done folding.
          </p>
          <p>
            Before asking anyone to trust the mission, $MAD showed loyalty in public: <span className="text-[#1a1a1a] font-bold">five communities supported</span>, tokens locked to 2060. Not theory. Proof. Five times.
          </p>
          <p>
            The supply shrinks toward <span className="text-[#FF2D2D] font-bold">200M</span>. Every holder is a participant in a <span className="text-[#1a1a1a] font-bold">Life Economy</span> exit — no bosses, no quarterly reports, just the daily practice of staying $MAD.
          </p>

          {/* Closing punch */}
          <div className="mt-8 p-5 sm:p-6 rounded-2xl border border-[#FF2D2D]/15 bg-[#FF2D2D]/[0.03]">
            <p className="text-base sm:text-lg font-bold text-[#1a1a1a]/80 leading-relaxed">
              The daily practice of staying <span className="text-[#FF2D2D]">$MAD Rich</span>. No worrying about your portfolio. No fear of AI layoffs. The world is only going to <span className="text-[#FF2D2D]">GET MORE $MAD</span>.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-12 pt-10 border-t border-[#1a1a1a]/10 grid grid-cols-2 sm:grid-cols-5 gap-6">
          <div>
            <p className="text-3xl sm:text-4xl font-black text-[#1a1a1a]">273</p>
            <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.22em] text-[#1a1a1a]/40">Holders</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-black text-[#1a1a1a]">5</p>
            <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.22em] text-[#1a1a1a]/40">Communities Locked</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-black text-[#1a1a1a]">1</p>
            <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.22em] text-[#1a1a1a]/40">Real Game</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-black text-[#FF2D2D]">50%</p>
            <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.22em] text-[#1a1a1a]/40">Supply Burn</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-black text-[#FF2D2D]">0%</p>
            <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.22em] text-[#1a1a1a]/40">Tax</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   THE VERIFIED — Exchange badges (crème edition)
   ═══════════════════════════════════════════════════════════ */
function TheVerified() {
  const exchanges = [
    { name: "Jupiter", src: "/logos/jupiter.png", href: LINKS.jupiter },
    { name: "OKX DEX", src: "/logos/okx.png", href: LINKS.okx },
    { name: "Gate", src: "/logos/gate.png", href: LINKS.gate },
    { name: "MEXC", src: "/logos/mexc.png", href: LINKS.mexc },
    { name: "DEX Screener", src: "/logos/DEX-screener.png", href: LINKS.dexscreener },
    { name: "Birdeye", src: "/logos/birdeye.png", href: LINKS.birdeye },
    { name: "Solscan", src: "/logos/solscan.png", href: LINKS.solscan },
    { name: "CoinGecko", src: "/logos/coingecko.png", href: "https://www.coingecko.com/en/coins/mad-coin" },
  ];

  return (
    <section className="px-4 sm:px-6 py-14 sm:py-18 bg-[#F5F1E8] border-y border-[#1a1a1a]/10">
      <div className="max-w-4xl mx-auto">
        <p className="text-center text-[11px] font-bold uppercase tracking-[0.34em] text-[#1a1a1a]/40 mb-8">
          Verified On-Chain
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          {exchanges.map((dex) => (
            <a 
              key={dex.name}
              href={dex.href}
              target="_blank"
              rel="noreferrer"
              className="group flex flex-col items-center gap-2 px-5 py-4 sm:px-6 sm:py-5 rounded-2xl border border-[#1a1a1a]/10 bg-[#1a1a1a]/[0.03] hover:bg-[#1a1a1a]/[0.06] hover:border-[#FF2D2D]/20 transition-all duration-300"
              title={dex.name}
            >
              {/* Unified dark container for all logos */}
              <div className="relative h-9 sm:h-10 w-32 sm:w-36 flex items-center justify-center rounded-xl bg-[#0a0a0a]/80 px-3 py-2">
                <Image
                  src={dex.src}
                  alt={dex.name}
                  fill
                  className="object-contain opacity-70 group-hover:opacity-100 transition-opacity duration-300 p-1"
                />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#1a1a1a]/40 group-hover:text-[#1a1a1a]/60 transition-colors">
                {dex.name}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   THE PROOF — Mad Rich Tub + Testimony (Venetian crème)
   ═══════════════════════════════════════════════════════════ */
function StarRating() {
  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <svg key={i} width="20" height="20" viewBox="0 0 24 24" fill="#C5A572" className="drop-shadow-[0_0_2px_rgba(197,165,114,0.5)]">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

function TheProof() {
  return (
    <section className="px-4 sm:px-6 py-20 sm:py-28 bg-[#F5F1E8]">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="mb-10 sm:mb-14 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C5A572" strokeWidth="1.5">
              <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z" />
            </svg>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C5A572" strokeWidth="1.5">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C5A572" strokeWidth="1.5">
              <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z" />
            </svg>
          </div>
          <p className="text-[11px] font-bold uppercase tracking-[0.34em] text-[#8B7355]">Holder Review</p>
          <h2 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-black text-[#1a1a1a]">
            The <span className="text-[#FF2D2D]">Proof</span> is Real
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tub Image */}
          <div className="relative overflow-hidden rounded-[24px] border border-[#1a1a1a]/10 aspect-[4/3]">
            <Image
              src="/memes/MAD-RICH-IN-THE-TUB.png"
              alt="Mad Rich in the Tub"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_50%,rgba(245,241,232,0.9)_90%)]" />
            <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
              <p className="text-[10px] font-bold uppercase tracking-[0.34em] text-[#FF2D2D]/70">The Lifestyle</p>
              <p className="mt-1 text-lg sm:text-xl font-black text-[#1a1a1a]">Mad Rich in the Tub</p>
            </div>
          </div>
          
          {/* Abraxas Testimony Card */}
          <div className="relative overflow-hidden rounded-[24px] border border-[#C5A572]/30 bg-white p-6 sm:p-8 flex flex-col justify-center shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
            <div className="relative z-10">
              {/* Stars */}
              <div className="mb-4">
                <StarRating />
              </div>

              {/* Avatar row */}
              <div className="flex items-center gap-3 mb-5">
                <div className="h-10 w-10 rounded-full bg-[#FF2D2D]/10 flex items-center justify-center text-base font-black text-[#FF2D2D] border border-[#FF2D2D]/20">A</div>
                <div>
                  <p className="text-sm font-black text-[#1a1a1a]">Abraxas</p>
                  <p className="text-[10px] text-[#1a1a1a]/50">$MAD Holder · Giveaway Winner</p>
                </div>
                <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-[#FF6B00]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#FF6B00] border border-[#FF6B00]/20">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF6B00] opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#FF6B00]" />
                  </span>
                  Verified
                </span>
              </div>

              <blockquote className="text-sm sm:text-base leading-relaxed text-[#1a1a1a]/70 italic">
                <span className="text-[#FF2D2D] text-lg font-black not-italic mr-1">&quot;</span>
                When I first encountered Mad Rich, I won a 200k MAD giveaway. The profits on holding the $120 worth of $MAD lasted me 2 months. <span className="text-[#FF2D2D] font-bold not-italic">$MAD relieved me of most my debts.</span> $MAD saved me during the hard times.
                <span className="text-[#FF2D2D] text-lg font-black not-italic ml-1">&quot;</span>
              </blockquote>

              <div className="mt-6 pt-5 border-t border-[#1a1a1a]/10 flex items-center justify-between">
                <p className="text-[10px] text-[#1a1a1a]/40">Shared via DM · With permission</p>
                <a 
                  href="https://x.com/madrichclub_/status/2052836164311322949" 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[#1a1a1a]/50 hover:text-[#FF2D2D] transition-colors"
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  See on X
                </a>
              </div>
            </div>
          </div>

          {/* DKWTT Testimony — Full Width */}
          <div className="lg:col-span-2 relative overflow-hidden rounded-[24px] border border-[#1a1a1a]/10 bg-white shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
            <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] lg:grid-cols-[320px_1fr]">
              {/* Tweet Image */}
              <div className="relative aspect-square md:aspect-auto">
                <Image
                  src="/proof-american-dad-hat.png"
                  alt="DKWTT wearing $MAD American Dad hat with MAD game on tablet"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 320px"
                />
              </div>
              
              {/* Tweet Content */}
              <div className="p-6 sm:p-8 flex flex-col justify-center">
                <div className="mb-4">
                  <StarRating />
                </div>

                <div className="flex items-center gap-3 mb-5">
                  <div className="h-10 w-10 rounded-full bg-[#FF2D2D]/10 flex items-center justify-center text-base font-black text-[#FF2D2D] border border-[#FF2D2D]/20">D</div>
                  <div>
                    <p className="text-sm font-black text-[#1a1a1a]">DKWTT (CHADWICK BASEMAN)</p>
                    <p className="text-[10px] text-[#1a1a1a]/50">@lit_terrestrial · $MAD Merch Buyer</p>
                  </div>
                  <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-[#FF6B00]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#FF6B00] border border-[#FF6B00]/20">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF6B00] opacity-75" />
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#FF6B00]" />
                    </span>
                    Verified
                  </span>
                </div>

                <blockquote className="text-sm sm:text-base leading-relaxed text-[#1a1a1a]/70 italic">
                  <span className="text-[#FF2D2D] text-lg font-black not-italic mr-1">&quot;</span>
                  Ordered the <span className="text-[#FF2D2D] font-bold not-italic">$MAD American Dad hat</span> on the day that my Dad passed, he was an Army Veteran as well. This is not just a hat to me, <span className="text-[#FF2D2D] font-bold not-italic">$MAD is not just a meme coin to me</span>, Its deeper than just a feeling... It&apos;s Motivation Alignment &amp; Discipline.
                  <span className="text-[#FF2D2D] text-lg font-black not-italic ml-1">&quot;</span>
                </blockquote>

                <div className="mt-6 pt-5 border-t border-[#1a1a1a]/10 flex items-center justify-between">
                  <p className="text-[10px] text-[#1a1a1a]/40">May 26, 2026 · 603 Views</p>
                  <a 
                    href="https://x.com/lit_terrestrial/status/2059486216567824581?s=20" 
                    target="_blank" 
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[#1a1a1a]/50 hover:text-[#FF2D2D] transition-colors"
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                    See on X
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   THE ARCHITECTS — Team (crème edition)
   ═══════════════════════════════════════════════════════════ */
function TheArchitects() {
  const team = [
    {
      role: "Dev / Founder",
      name: "$MAD Dev",
      handle: "Coffee Collects",
      image: "/team/mad-dev-coffee-collects.png",
      links: [
        { label: "X", href: "https://x.com/madrichclub_" },
        { label: "YouTube", href: "https://www.youtube.com/@CoffeeCollectsHQ" },
      ],
    },
    {
      role: "Community Builder",
      name: "crypto guru",
      handle: "@followdv80",
      image: "/rewards/crypto-guru-followdv80.png",
      links: [
        { label: "X", href: "https://x.com/followdv80" },
      ],
    },
    {
      role: "Community Builder",
      name: "Perspective 360",
      handle: "@Derrick152667",
      image: "/rewards/perspective-360-kakashi.png",
      links: [
        { label: "X", href: "https://x.com/Derrick152667" },
      ],
    },
    {
      role: "Community Builder",
      name: "Dino",
      handle: "@Iam__dino9",
      image: "/team/dino-moderator.png",
      links: [
        { label: "X", href: "https://x.com/Iam__dino9" },
      ],
    },
    {
      role: "Mad Artist",
      name: "Heydun",
      handle: "@Grpx_Heydun",
      image: "/team/mad-artist-heydun.png",
      links: [
        { label: "X", href: "https://x.com/Grpx_Heydun" },
      ],
    },
  ];

  return (
    <section className="px-4 sm:px-6 py-16 sm:py-20 bg-[#F5F1E8] border-y border-[#1a1a1a]/10">
      <div className="max-w-4xl mx-auto">
        <p className="text-center text-[10px] font-bold uppercase tracking-[0.34em] text-[#1a1a1a]/40 mb-2">
          The People Behind It
        </p>
        <h2 className="text-center text-2xl sm:text-3xl font-black text-[#1a1a1a] mb-10 sm:mb-14">
          The <span className="text-[#FF2D2D]">Architects</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {team.map((member) => (
            <div
              key={member.role}
              className="group relative overflow-hidden rounded-[24px] border border-[#1a1a1a]/10 bg-[#1a1a1a]/[0.02] p-6 sm:p-8 text-center transition-all duration-300 hover:border-[#FF2D2D]/20 hover:bg-[#1a1a1a]/[0.04]"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,45,45,0.04),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                {/* Avatar */}
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 rounded-full overflow-hidden border-2 border-[#1a1a1a]/10 group-hover:border-[#FF2D2D]/30 transition-colors">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </div>

                <p className="text-[10px] font-bold uppercase tracking-[0.34em] text-[#FF2D2D]/60 mb-2">
                  {member.role}
                </p>
                <p className="text-lg font-black text-[#1a1a1a]">{member.name}</p>
                <p className="mt-1 text-xs text-[#1a1a1a]/40">{member.handle}</p>
                <div className="mt-4 flex items-center justify-center gap-2">
                  {member.links.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={link.label}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#1a1a1a]/10 bg-[#1a1a1a]/[0.03] hover:bg-[#1a1a1a]/[0.06] hover:border-[#FF2D2D]/20 text-[#1a1a1a]/50 hover:text-[#1a1a1a] text-[10px] font-bold uppercase tracking-wider transition-all"
                    >
                      {link.label === "X" ? (
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                      ) : (
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>
                      )}
                      {link.label !== "X" && link.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   DISCLAIMER — Legal protection (crème edition)
   ═══════════════════════════════════════════════════════════ */
function Disclaimer() {
  return (
    <section className="px-4 sm:px-6 py-10 bg-[#F5F1E8] border-t border-[#1a1a1a]/10">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-start justify-center gap-3">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 shrink-0 text-[#FF2D2D]/50">
            <path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
          </svg>
          <p className="text-[11px] leading-relaxed text-[#1a1a1a]/50 text-center">
            <span className="font-bold text-[#1a1a1a]/70">$MAD is a memecoin for entertainment purposes only.</span> Not financial advice. 
            Cryptocurrency may lose value. DYOR. <span className="text-[#FF2D2D]/70 font-bold">No guarantees. No refunds. No hand-holding.</span>
          </p>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   FOOTER — Full navigation footer (crème edition)
   ═══════════════════════════════════════════════════════════ */
function Footer() {
  const nav = [
    { label: "MAD AI", href: "/mad-mind" },
    { label: "Roadmap", href: "/roadmap" },
    { label: "Game", href: "/game" },
    { label: "MAD Art", href: "/mad-art" },
    { label: "Merch", href: "/merch" },
  ];

  const socials = [
    { icon: "tg", label: "Telegram", href: LINKS.telegram },
    { icon: "x", label: "X", href: LINKS.x },
    { icon: "ig", label: "Instagram", href: LINKS.instagram },
    { icon: "tt", label: "TikTok", href: LINKS.tiktok },
  ];

  return (
    <footer className="border-t border-[#1a1a1a]/10 px-4 sm:px-6 py-12 sm:py-16 bg-[#F5F1E8]">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
        {/* Left — Brand + tagline + socials */}
        <div>
          {/* Logo row */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-[#FF2D2D] flex items-center justify-center text-white font-black text-xl shrink-0">
              M
            </div>
            <div>
              <span className="text-[#1a1a1a] font-black text-xl tracking-tight">$MAD</span>
              <span className="block text-[#1a1a1a]/40 text-[10px] tracking-[0.3em] uppercase font-bold">STAY $MAD</span>
            </div>
          </div>

          {/* Tagline */}
          <p className="text-sm text-[#1a1a1a]/50 leading-relaxed max-w-xs mb-6">
            The Supreme of Solana. Limited. Exclusive. Cult.
          </p>

          {/* Social buttons */}
          <div className="flex items-center gap-3">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={s.label}
                className="w-11 h-11 rounded-full border border-[#1a1a1a]/15 bg-transparent flex items-center justify-center text-[#1a1a1a]/40 hover:text-[#FF2D2D] hover:border-[#FF2D2D]/30 transition-all duration-300"
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
          <p className="text-[11px] font-black uppercase tracking-[0.3em] text-[#1a1a1a]/40 mb-5">NAVIGATION</p>
          <ul className="space-y-3">
            {nav.map((item) => (
              <li key={item.label}>
                <Link href={item.href} className="text-sm font-bold text-[#1a1a1a]/60 hover:text-[#FF2D2D] transition-colors duration-300">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="max-w-6xl mx-auto mt-12 pt-6 border-t border-[#1a1a1a]/10 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-[10px] text-[#1a1a1a]/30">
          Doxxed. Building. Not asking permission.
        </p>
        <p className="text-[10px] text-[#1a1a1a]/30 font-mono">
          {CA.slice(0, 12)}...{CA.slice(-4)}
        </p>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════════ */
export default function Home() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#F5F1E8] text-[#1a1a1a]">
      <Scanlines />
      <FloatingParticles />
      
      {/* Subtle ambient warmth */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_50%_20%,rgba(255,45,45,0.03),transparent_50%)]" />

      <main>
        <TheCinema />
        <WhyMADStrip />
        <TheDashboard />
        <WhatIsMAD />
        <TheVerified />
        <TheProof />
        <TheArchitects />
      </main>

      <Disclaimer />
      <Footer />
    </div>
  );
}
