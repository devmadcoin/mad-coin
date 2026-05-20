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
      copied ? "border border-green-400/30 bg-green-400/10 text-green-400" : "border border-[#FF2D2D]/30 bg-[#FF2D2D]/10 text-[#FF2D2D] hover:bg-[#FF2D2D]/20",
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
   THE LOBBY — HERO
   ═══════════════════════════════════════════════════════════ */
function TheLobby() {
  return (
    <section className="relative min-h-[100dvh] flex flex-col items-center justify-center px-4 sm:px-6 overflow-hidden">
      {/* Ambient glow behind hero */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(255,45,45,0.06),transparent_70%)]" />
      </div>
      
      <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto">
        {/* Red Circle Guy — Hero Art */}
        <div className="relative mb-6 w-[220px] h-[220px] sm:w-[280px] sm:h-[280px]">
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(255,45,45,0.15),transparent_70%)]" />
          <Image
            src="/memes/MAD-KINGS-ONLY.png"
            alt="The $MAD King"
            fill
            className="object-contain drop-shadow-[0_0_30px_rgba(255,45,45,0.3)]"
            priority
          />
        </div>

        {/* The Declaration */}
        <h1 className="text-[2.5rem] sm:text-[4rem] lg:text-[5.5rem] font-black leading-[0.9] tracking-[-0.04em]">
          <span className="text-[#FF2D2D] drop-shadow-[0_0_20px_rgba(255,45,45,0.4)]">STOP</span>
          <br />
          <span className="text-white">PANICKING.</span>
          <br />
          <span className="text-white">GET </span>
          <span className="text-[#FF2D2D] drop-shadow-[0_0_20px_rgba(255,45,45,0.4)]">$MAD</span>
          <span className="text-green-400">RICH.</span>
        </h1>

        {/* Subtle tagline */}
        <p className="mt-5 text-sm sm:text-base font-medium text-white/50 max-w-md">
          Doxxed dev. Real Roblox game. No VC. No tax. No presale.
          <br className="hidden sm:block" />
          Just a different frequency.
        </p>

        {/* Contract — THE CTA */}
        <div className="mt-8 w-full max-w-xl">
          <ContractBlock />
        </div>

        {/* Verified Strip — Credibility as decor */}
        <div className="mt-3 flex items-center justify-center gap-5 sm:gap-7 opacity-40 hover:opacity-70 transition-opacity duration-500">
          <span className="text-[9px] font-bold uppercase tracking-[0.34em] text-white/30">Verified on</span>
          <div className="flex items-center gap-4 sm:gap-6">
            {[
              { name: "Jupiter", src: "/logos/jupiter.png" },
              { name: "DEX Screener", src: "/logos/DEX-screener.png" },
              { name: "Birdeye", src: "/logos/birdeye.png" },
              { name: "Solscan", src: "/logos/solscan.png" },
              { name: "CoinGecko", src: "/logos/coingecko.png" },
            ].map((dex) => (
              <a
                key={dex.name}
                href={dex.name === "Jupiter" ? LINKS.jupiter : dex.name === "DEX Screener" ? LINKS.dexscreener : dex.name === "Birdeye" ? LINKS.birdeye : dex.name === "Solscan" ? LINKS.solscan : "https://www.coingecko.com/en/coins/mad-coin"}
                target="_blank"
                rel="noreferrer"
                className="group relative flex flex-col items-center"
                title={dex.name}
              >
                <Image
                  src={dex.src}
                  alt={dex.name}
                  width={28}
                  height={28}
                  className="h-5 w-auto object-contain opacity-50 group-hover:opacity-100 transition-opacity"
                />
                <span className="absolute -bottom-4 text-[8px] font-bold uppercase tracking-wider text-white/0 group-hover:text-white/40 transition-colors whitespace-nowrap">
                  {dex.name}
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Buy Button — Secondary CTA */}
        <a 
          href={LINKS.buy} 
          target="_blank" 
          rel="noreferrer"
          className="mt-4 group flex items-center justify-center gap-2 px-8 py-4 bg-[#FF6B00] hover:bg-[#FF8533] text-white text-base font-black rounded-full transition-all hover:scale-[1.02] shadow-[0_0_30px_rgba(255,107,0,0.25)]"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
          SWAP ON JUPITER
        </a>

        {/* Navigation Links */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="/mad-mind" className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] hover:border-[#FF2D2D]/20 text-white/70 hover:text-white text-xs font-bold transition-all">
            <span className="text-[#FF2D2D]">🔥</span>
            Enter The Oracle
          </Link>
          <Link href="/memes" className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] hover:border-[#FF2D2D]/20 text-white/70 hover:text-white text-xs font-bold transition-all">
            <span>🎨</span>
            The Vault
          </Link>
          <Link href="/game" className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] hover:border-[#FF2D2D]/20 text-white/70 hover:text-white text-xs font-bold transition-all">
            <span>🎮</span>
            The Game
          </Link>
        </div>

        {/* Minimal chips */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-white/40">265 HOLDERS</span>
          <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-white/40">504M SUPPLY</span>
          <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-white/40">0% TAX</span>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/20">
        <span className="text-[10px] font-bold uppercase tracking-[0.34em]">Scroll</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-bounce"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   THE WALLS — FEATURED ART
   ═══════════════════════════════════════════════════════════ */
function ArtWall({ title, image, subtitle }: { title: string; image: string; subtitle: string }) {
  return (
    <div className="group relative overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.02] aspect-[4/5] sm:aspect-[3/4]">
      <Image
        src={image}
        alt={title}
        fill
        className="object-cover transition duration-700 group-hover:scale-[1.05]"
        sizes="(max-width: 768px) 100vw, 33vw"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_40%,rgba(8,8,8,0.9)_80%,rgba(8,8,8,0.98))]" />
      <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.34em] text-[#FF2D2D]/60">{subtitle}</p>
        <p className="mt-1 text-lg sm:text-xl font-black text-white">{title}</p>
      </div>
    </div>
  );
}

function TheWalls() {
  return (
    <section className="px-4 sm:px-6 py-20 sm:py-28">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10 sm:mb-14">
          <p className="text-[10px] font-bold uppercase tracking-[0.34em] text-white/30">The Atmosphere</p>
          <h2 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-black text-white">
            The <span className="text-[#FF2D2D]">Walls</span> Speak
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <ArtWall title="Kings Only" image="/memes/MAD-KINGS-ONLY.png" subtitle="Power" />
          <ArtWall title="At The Bears" image="/memes/MAD-AT-BEARS.png" subtitle="Dominance" />
          <ArtWall title="The Signal" image="/memes/MAD-BELIEVE.png" subtitle="Conviction" />
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   THE ORACLE — Link to MAD Mind
   ═══════════════════════════════════════════════════════════ */
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
                {/* Simplified MAD Chao preview */}
                <rect x="96" y="80" width="64" height="64" rx="32" fill="#FF2D2D" opacity="0.9" />
                <rect x="112" y="100" width="12" height="16" rx="6" fill="#080808" />
                <rect x="132" y="100" width="12" height="16" rx="6" fill="#080808" />
                <rect x="120" y="128" width="16" height="6" rx="3" fill="#080808" />
                {/* Flame */}
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
    { name: "Telegram", icon: "✈️", href: LINKS.telegram, color: "text-blue-400" },
    { name: "YouTube", icon: "▶️", href: LINKS.youtube, color: "text-red-400" },
    { name: "Roblox", icon: "🎮", href: LINKS.game, color: "text-green-400" },
  ];

  return (
    <section className="px-4 sm:px-6 py-12 sm:py-16 border-t border-white/5">
      <div className="max-w-4xl mx-auto">
        <p className="text-center text-[10px] font-bold uppercase tracking-[0.34em] text-white/25 mb-6">The Frequency</p>
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
        <TheLobby />
        <TheWalls />
        <TheOracle />
        <TheFrequency />
      </main>

      <Footer />
    </div>
  );
}
