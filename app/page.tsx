"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

const CA = "Fa7ZE9nCEYnrHsnoeHuhEExJpchtrBtKXnWe6CgHpump";

const LINKS = {
  telegram: "https://t.me/MadOfficalChannel",
  x: "https://x.com/madrichclub_",
  instagram: "https://www.instagram.com/madrichclub/",
  tiktok: "https://www.tiktok.com/@madrichclub",
  buy: "https://jup.ag/?sell=So11111111111111111111111111111111111111112&buy=Fa7ZE9nCEYnrHsnoeHuhEExJpchtrBtKXnWe6CgHpump",
  chart: "https://dexscreener.com/solana/gt3dwhhkrd2mnqmmchpzdetpg4ttaa23exn1m2vwinfs",
  jupiter: "https://jup.ag/tokens/Fa7ZE9nCEYnrHsnoeHuhEExJpchtrBtKXnWe6CgHpump",
  solscan: "https://solscan.io/token/Fa7ZE9nCEYnrHsnoeHuhEExJpchtrBtKXnWe6CgHpump",
  birdeye: "https://birdeye.so/solana/token/Fa7ZE9nCEYnrHsnoeHuhEExJpchtrBtKXnWe6CgHpump",
  dexscreener: "https://dexscreener.com/solana/gt3dwhhkrd2mnqmmchpzdetpg4ttaa23exn1m2vwinfs",
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
    <div className="pointer-events-none fixed inset-0 z-[100] opacity-[0.03]"
      style={{
        backgroundImage: "linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)",
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
   THE CINEMA — Full-viewport video hero (fwogs energy)
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
        {/* The Declaration — flipped hierarchy */}
        <h1 className="text-center">
          <span className="block text-[2rem] sm:text-[3rem] lg:text-[4rem] font-black tracking-[-0.02em] text-[#FF2D2D] drop-shadow-[0_0_20px_rgba(255,45,45,0.4)]">
            STOP PANICKING.
          </span>
          <span className="block text-[3rem] sm:text-[5rem] lg:text-[7rem] font-black leading-[0.85] tracking-[-0.05em] text-white mt-2">
            GET $MAD RICH.
          </span>
        </h1>

        {/* Contract + Buy */}
        <div className="mt-8 max-w-xl mx-auto">
          <ContractBlock />
        </div>

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
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-white/40">265 HOLDERS</span>
          <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-white/40">504M SUPPLY</span>
          <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-white/40">0% TAX</span>
        </div>
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
   THE VERIFIED — Exchange badges (unified dark containers)
   ═══════════════════════════════════════════════════════════ */
function TheVerified() {
  const exchanges = [
    { name: "Jupiter", src: "/logos/jupiter.png", href: LINKS.jupiter },
    { name: "DEX Screener", src: "/logos/DEX-screener.png", href: LINKS.dexscreener },
    { name: "Birdeye", src: "/logos/birdeye.png", href: LINKS.birdeye },
    { name: "Solscan", src: "/logos/solscan.png", href: LINKS.solscan },
    { name: "CoinGecko", src: "/logos/coingecko.png", href: "https://www.coingecko.com/en/coins/mad-coin" },
  ];

  return (
    <section className="px-4 sm:px-6 py-14 sm:py-18 border-y border-white/5">
      <div className="max-w-4xl mx-auto">
        <p className="text-center text-[11px] font-bold uppercase tracking-[0.34em] text-white/40 mb-8">
          Verified On-Chain
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          {exchanges.map((dex) => (
            <a 
              key={dex.name}
              href={dex.href}
              target="_blank"
              rel="noreferrer"
              className="group flex flex-col items-center gap-2 px-5 py-4 sm:px-6 sm:py-5 rounded-2xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] hover:border-[#FF2D2D]/20 transition-all duration-300"
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
              <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/30 group-hover:text-white/50 transition-colors">
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
   WHAT IS $MAD — The story, from the roadmap
   ═══════════════════════════════════════════════════════════ */
function WhatIsMAD() {
  return (
    <section className="px-4 sm:px-6 py-20 sm:py-28">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-8 sm:mb-10">
          What is <span className="text-[#FF2D2D]">$MAD</span>
        </h2>

        <div className="space-y-6 text-sm sm:text-base leading-relaxed text-white/60">
          <p>
            <span className="text-white font-bold">$MAD is not a token. It's a frequency.</span> Most projects sell you a future. $MAD sells you a present — the present where you are already mad rich, already part of something, already holding.
          </p>
          <p>
            The dev is <span className="text-white font-bold">doxxed</span>. The <Link href="/game" className="text-[#FF2D2D] hover:text-white transition-colors">Roblox game</Link> is real. There was no presale, no VC, no tax. Just a contract, a community, and a group of people who decided they were done folding.
          </p>
          <p>
            Before asking anyone to trust the mission, $MAD showed loyalty in public: <span className="text-white font-bold">three communities supported</span>, tokens locked via Streamflow until 2060. Not theory. Proof. Three times.
          </p>
          <p>
            The supply shrinks toward <span className="text-[#FF2D2D] font-bold">800M</span>. Every holder is a participant in a <span className="text-white font-bold">Life Economy</span> exit — no bosses, no quarterly reports, just the daily practice of staying $MAD.
          </p>

          {/* Closing punch */}
          <div className="mt-8 p-5 sm:p-6 rounded-2xl border border-[#FF2D2D]/15 bg-[#FF2D2D]/[0.03]">
            <p className="text-base sm:text-lg font-bold text-white/80 leading-relaxed">
              The daily practice of staying <span className="text-[#FF2D2D]">$MAD Rich</span>. No worrying about your portfolio. No fear of AI layoffs. The world is only going to <span className="text-[#FF2D2D]">GET MORE $MAD</span>.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-12 pt-10 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-6">
          <div>
            <p className="text-3xl sm:text-4xl font-black text-white">273</p>
            <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.22em] text-white/40">Holders</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-black text-white">3</p>
            <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.22em] text-white/40">Communities Locked</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-black text-white">1</p>
            <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.22em] text-white/40">Real Game</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-black text-[#FF2D2D]">0%</p>
            <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.22em] text-white/40">Tax</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   THE PROOF — Mad Rich Tub + Testimony
   ═══════════════════════════════════════════════════════════ */
function TheProof() {
  return (
    <section className="px-4 sm:px-6 py-20 sm:py-28">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10 sm:mb-14">
          <p className="text-[10px] font-bold uppercase tracking-[0.34em] text-white/30">Real Stories</p>
          <h2 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-black text-white">
            The <span className="text-[#FF2D2D]">Proof</span> is Real
          </h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tub Image */}
          <div className="relative overflow-hidden rounded-[24px] border border-white/10 aspect-[4/3]">
            <Image
              src="/memes/MAD-RICH-IN-THE-TUB.png"
              alt="Mad Rich in the Tub"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_50%,rgba(8,8,8,0.8)_90%)]" />
            <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
              <p className="text-[10px] font-bold uppercase tracking-[0.34em] text-[#FF2D2D]/60">The Lifestyle</p>
              <p className="mt-1 text-lg sm:text-xl font-black text-white">Mad Rich in the Tub</p>
            </div>
          </div>
          
          {/* Testimony */}
          <div className="relative overflow-hidden rounded-[24px] border border-[#FF2D2D]/15 bg-[#FF2D2D]/[0.03] p-6 sm:p-8 flex flex-col justify-center">
            <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-[#FF2D2D]/5 blur-3xl" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-5">
                <div className="h-10 w-10 rounded-full bg-[#FF2D2D]/20 flex items-center justify-center text-base font-black text-[#FF2D2D] border border-[#FF2D2D]/30">A</div>
                <div>
                  <p className="text-sm font-black text-white">Abraxas</p>
                  <p className="text-[10px] text-white/40">$MAD Holder · Giveaway Winner</p>
                </div>
                <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-[#FF6B00]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#FF6B00] border border-[#FF6B00]/20">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF6B00] opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#FF6B00]" />
                  </span>
                  Verified
                </span>
              </div>

              <blockquote className="text-sm sm:text-base leading-relaxed text-white/70 italic">
                <span className="text-[#FF2D2D] text-lg font-black not-italic mr-1">"</span>
                When I first encountered Mad Rich, I won a 200k MAD giveaway. The profits on holding the $120 worth of $MAD lasted me 2 months. <span className="text-[#FF2D2D] font-bold not-italic">$MAD relieved me of most my debts.</span> $MAD saved me during the hard times.
                <span className="text-[#FF2D2D] text-lg font-black not-italic ml-1">"</span>
              </blockquote>

              <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-between">
                <p className="text-[10px] text-white/30">Shared via DM · With permission</p>
                <a 
                  href="https://x.com/madrichclub_/status/2052836164311322949" 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-[10px] font-bold text-white/40 hover:text-[#FF2D2D] transition-colors"
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  See on X
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   THE ARCHITECTS — Team
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
    <section className="px-4 sm:px-6 py-16 sm:py-20 border-y border-white/5">
      <div className="max-w-4xl mx-auto">
        <p className="text-center text-[10px] font-bold uppercase tracking-[0.34em] text-white/30 mb-2">
          The People Behind It
        </p>
        <h2 className="text-center text-2xl sm:text-3xl font-black text-white mb-10 sm:mb-14">
          The <span className="text-[#FF2D2D]">Architects</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {team.map((member) => (
            <div
              key={member.role}
              className="group relative overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.02] p-6 sm:p-8 text-center transition-all duration-300 hover:border-[#FF2D2D]/20 hover:bg-white/[0.04]"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,45,45,0.04),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                {/* Avatar */}
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-[#FF2D2D]/30 transition-colors">
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
                <p className="text-lg font-black text-white">{member.name}</p>
                <p className="mt-1 text-xs text-white/40">{member.handle}</p>
                <div className="mt-4 flex items-center justify-center gap-2">
                  {member.links.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] hover:border-[#FF2D2D]/20 text-white/50 hover:text-white text-[10px] font-bold uppercase tracking-wider transition-all"
                    >
                      {link.label === "X" ? (
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                      ) : (
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>
                      )}
                      {link.label}
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
function TheOracle() {
  return (
    <section className="px-4 sm:px-6 py-16 sm:py-20">
      <div className="max-w-4xl mx-auto">
        <Link href="/mad-mind" className="group block relative overflow-hidden rounded-[28px] border border-[#FF2D2D]/15 bg-[#FF2D2D]/[0.03] p-6 sm:p-10 transition-all duration-500 hover:border-[#FF2D2D]/30 hover:shadow-[0_0_50px_rgba(255,45,45,0.1)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,45,45,0.06),transparent_60%)]" />
          <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6 sm:gap-10">
            {/* MAD Chao preview */}
            <div className="shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border border-[#FF2D2D]/20 bg-black/50 flex items-center justify-center overflow-hidden">
              <svg viewBox="0 0 256 256" className="w-16 h-16 sm:w-20 sm:h-20" xmlns="http://www.w3.org/2000/svg">
                <rect x="96" y="80" width="64" height="64" rx="32" fill="#FF2D2D" opacity="0.9" />
                <rect x="112" y="100" width="12" height="16" rx="6" fill="#080808" />
                <rect x="132" y="100" width="12" height="16" rx="6" fill="#080808" />
                <rect x="120" y="128" width="16" height="6" rx="3" fill="#080808" />
                <rect x="120" y="52" width="16" height="20" rx="4" fill="#FF6B00" opacity="0.8" />
              </svg>
            </div>
            <div className="text-center sm:text-left">
              <p className="text-[10px] font-bold uppercase tracking-[0.34em] text-[#FF2D2D]/50 mb-2">The Oracle Chamber</p>
              <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-[#FF2D2D] transition-colors">
                The Claw Reads Your Frequency
              </h3>
              <p className="mt-2 text-sm text-white/40 max-w-md">
                Not a chatbot. A presence. Ask about death economies, life economies, or why your 401k feels like a hostage situation.
              </p>
              <div className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-[#FF2D2D]/70 group-hover:text-[#FF2D2D] transition-colors">
                Enter The Oracle
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   THE FREQUENCY — Social Strip
   ═══════════════════════════════════════════════════════════ */
function TheFrequency() {
  const platforms = [
    { name: "X", icon: "𝕏", href: LINKS.x, color: "text-white" },
    { name: "Telegram", icon: "✈️", href: LINKS.telegram, color: "text-[#FF6B00]" },
    { name: "YouTube", icon: "▶️", href: LINKS.youtube, color: "text-[#FF2D2D]" },
    { name: "Roblox", icon: "🎮", href: LINKS.game, color: "text-white" },
  ];

  return (
    <section className="px-4 sm:px-6 py-12 sm:py-16 border-t border-white/5">
      <div className="max-w-4xl mx-auto">
        <p className="text-center text-[10px] font-bold uppercase tracking-[0.34em] text-white/25 mb-6">
          The Frequency
        </p>
        <div className="flex items-center justify-center gap-3 sm:gap-4">
          {platforms.map((p) => (
            <a
              key={p.name}
              href={p.href}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20 transition-all"
            >
              <span className={`text-sm ${p.color}`}>{p.icon}</span>
              <span className="text-xs font-bold text-white/60 hover:text-white transition-colors hidden sm:inline">{p.name}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   DISCLAIMER — Legal protection
   ═══════════════════════════════════════════════════════════ */
function Disclaimer() {
  return (
    <section className="px-4 sm:px-6 py-10 border-t border-white/5">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-start justify-center gap-3">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 shrink-0 text-[#FF2D2D]/50">
            <path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
          </svg>
          <p className="text-[11px] leading-relaxed text-white/50 text-center">
            <span className="font-bold text-white/60">$MAD is a memecoin for entertainment purposes only.</span> Not financial advice. 
            Cryptocurrency may lose value. DYOR. <span className="text-[#FF2D2D]/70 font-bold">No guarantees. No refunds. No hand-holding.</span>
          </p>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   FOOTER — Minimal
   ═══════════════════════════════════════════════════════════ */
function Footer() {
  return (
    <footer className="border-t border-white/5 px-4 sm:px-6 py-10">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#FF2D2D] flex items-center justify-center text-white font-black text-sm">M</div>
          <div>
            <span className="text-white font-black text-sm">$MAD</span>
            <span className="block text-white/30 text-[9px] tracking-[0.3em] uppercase">Stay $MAD</span>
          </div>
        </div>
        <p className="text-white/25 text-[10px] font-medium">
          Doxxed. Building. Not asking permission.
        </p>
        <div className="flex items-center gap-1 text-white/20 text-[10px]">
          <span>Contract:</span>
          <code className="text-[#FF2D2D]/40 font-mono">{CA.slice(0, 8)}...{CA.slice(-4)}</code>
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════════ */
export default function Home() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#080808] text-white">
      <Scanlines />
      <FloatingParticles />
      
      {/* Subtle ambient background */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_50%_20%,rgba(255,45,45,0.04),transparent_50%)]" />

      <main>
        <TheCinema />
        <WhatIsMAD />
        <TheVerified />
        <TheProof />
        <TheArchitects />
        <TheOracle />
        <TheFrequency />
      </main>

      <Disclaimer />
      <Footer />
    </div>
  );
}
