"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

const CA = "Fa7ZE9nCEYnrHsnoeHuhEExJpchtrBtKXnWe6CgHpump";

const LINKS = {
  buy: "https://jup.ag/tokens/Fa7ZE9nCEYnrHsnoeHuhEExJpchtrBtKXnWe6CgHpump",
  solscan: "https://solscan.io/token/Fa7ZE9nCEYnrHsnoeHuhEExJpchtrBtKXnWe6CgHpump",
  telegram: "https://t.me/MadOfficalChannel",
  x: "https://x.com/madrichclub_",
  instagram: "https://www.instagram.com/madrichclub/",
  tiktok: "https://www.tiktok.com/@madrichclub",
} as const;

const ART_FILES = [
  "MAD-2-MONTHS.png",
  "MAD-ARMY.png",
  "MAD-AT-BEARS.png",
  "MAD-BELIEVE.png",
  "MAD-BELIEVING.png",
  "MAD-COMMUNITY.png",
  "MAD-DOCTOR.png",
  "MAD-DOLLAR.png",
  "MAD-HOLD-ON-DEAR-LIFE.png",
  "MAD-KINGS-ONLY.png",
  "MAD-MONTH.png",
  "MAD-NEPTUNE.png",
  "MAD-RICH-IN-THE-TUB.png",
  "MAD-RICH-OR-BROKE.png",
  "MAD-SCHOOL.png",
  "MAD-YOU-SIDELINED.png",
  "MAKE-MAD-GREAT-AGAIN.png",
  "WE-MAD-ZOOMIN.png",
  "YOU-MAKE-ME-MAD.png",
  "YOU-WILL-BE-MAD.png",
] as const;

function cleanTitle(name: string) {
  return name.replace(".png", "").replaceAll("-", " ").toUpperCase();
}

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
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

/* ─── SHARED COMPONENTS ─── */
function CopyButton({ text = CA }: { text?: string }) {
  const { copied, copy } = useCopyToClipboard();
  return (
    <button
      onClick={() => copy(text)}
      className={[
        "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold transition duration-300",
        copied
          ? "border border-green-400/30 bg-green-400/10 text-green-400"
          : "border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20",
      ].join(" ")}
    >
      {copied ? (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
      )}
      {copied ? "Copied!" : "Copy CA"}
    </button>
  );
}

function Pill({ children, tone = "default" }: { children: React.ReactNode; tone?: "default" | "red" | "green" | "yellow" }) {
  return (
    <div className={cn(
      "rounded-full px-4 py-2 text-[11px] font-black uppercase tracking-[0.24em]",
      tone === "red" && "border border-red-500/25 bg-red-500/10 text-red-200",
      tone === "green" && "border border-emerald-400/20 bg-emerald-500/10 text-emerald-200",
      tone === "yellow" && "border border-amber-400/20 bg-amber-500/10 text-amber-200",
      tone === "default" && "border border-white/10 bg-white/[0.04] text-white/70",
    )}>
      {children}
    </div>
  );
}

function SectionShell({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <section className={cn(
      "overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.03] shadow-[0_18px_50px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:rounded-[2rem]",
      className,
    )}>
      {children}
    </section>
  );
}

/* ─── NAVBAR ─── */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "MAD Mind", href: "/mad-mind" },
    { label: "Roadmap", href: "/roadmap" },
    { label: "Game", href: "/game" },
    { label: "Memes", href: "/memes" },
    { label: "Merch", href: "/merch" },
  ];

  return (
    <>
      <nav className={[
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled ? "bg-black/95 backdrop-blur-xl border-b border-white/10" : "bg-transparent",
      ].join(" ")}>
        {scrolled && (
          <div className="border-b border-white/10 bg-white/[0.02]">
            <div className="mx-auto max-w-7xl px-4 py-2 flex items-center justify-center gap-3">
              <span className="text-white/40 text-xs font-bold">CA:</span>
              <code className="text-red-400 font-mono text-xs truncate max-w-[180px] sm:max-w-sm">{CA}</code>
              <CopyButton />
            </div>
          </div>
        )}

        <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-full bg-red-500 flex items-center justify-center text-white font-black text-sm shadow-[0_0_20px_rgba(255,0,0,0.3)]">
              M
            </div>
            <div className="flex flex-col">
              <span className="text-white font-black text-lg tracking-tight">$MAD</span>
              <span className="text-white/40 text-[9px] tracking-[0.3em] uppercase">Stay $MAD</span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.label} href={link.href} className="px-4 py-2 text-sm font-bold text-white/50 hover:text-white transition-colors rounded-full hover:bg-white/5">
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <a href={LINKS.buy} target="_blank" rel="noreferrer" className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-red-500 hover:bg-red-400 text-white text-sm font-black rounded-full transition-all hover:scale-[1.02]">
              Buy $MAD
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>
            </a>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 text-white/50 hover:text-white transition-colors">
              {mobileOpen ? <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg> : <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 8h16M4 16h16"/></svg>}
            </button>
          </div>
        </div>
      </nav>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/98 backdrop-blur-xl pt-24 px-6 lg:hidden">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link key={link.label} href={link.href} onClick={() => setMobileOpen(false)} className="text-2xl font-black text-white/80 hover:text-red-400 transition-colors py-3 border-b border-white/10">
                {link.label}
              </Link>
            ))}
            <div className="mt-6 p-4 bg-white/[0.03] border border-white/10 rounded-2xl">
              <p className="text-white/40 text-sm font-bold mb-2">Contract Address</p>
              <code className="text-red-400 text-xs break-all font-mono">{CA}</code>
              <div className="mt-3"><CopyButton /></div>
            </div>
            <a href={LINKS.buy} target="_blank" rel="noreferrer" className="mt-4 flex items-center justify-center gap-2 py-4 bg-red-500 text-white font-black rounded-full text-lg">
              Buy $MAD
            </a>
          </div>
        </div>
      )}
    </>
  );
}

/* ─── HERO ─── */
function ArtHero() {
  return (
    <section className="relative pt-32 pb-12 sm:pt-40 sm:pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <span className="rounded-full border border-red-500/25 bg-red-500/10 px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.25em] text-red-300 mb-6">
            20 Pieces. All Rare.
          </span>
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black text-white leading-[0.9] tracking-tight">
            THE <span className="text-red-500">$MAD</span><br />
            VAULT.
          </h1>
          <p className="mt-5 text-lg sm:text-xl text-white/55 max-w-xl leading-relaxed">
            Posters. Memes. Identity. Chaos turned into visuals. Free to grab. Yours to share.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Pill tone="red">Official Art</Pill>
            <Pill tone="green">Free Download</Pill>
            <Pill>High Res</Pill>
            <Pill tone="yellow">20 Total</Pill>
          </div>

          {/* Contract box — drunk proof */}
          <div className="mt-8 w-full max-w-2xl rounded-2xl border border-red-500/20 bg-red-500/[0.04] p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-white/40 text-xs font-black uppercase tracking-wider">Contract</span>
                <code className="text-red-400 font-mono text-xs sm:text-sm">{CA}</code>
              </div>
              <div className="flex items-center gap-2">
                <CopyButton />
                <a href={LINKS.buy} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-500 hover:bg-red-400 text-white text-xs font-black rounded-full transition-all">
                  Buy
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── MARQUEE ─── */
function Marquee() {
  const text = "RARE ART • FREE TO GRAB • NOT FOR EVERYONE • SHARE THE SIGNAL • DOWNLOAD ALL 20 • ";
  return (
    <div className="overflow-hidden border-y border-white/10 bg-white/[0.02] py-4">
      <div className="flex whitespace-nowrap animate-[marquee_20s_linear_infinite]">
        {Array.from({ length: 8 }).map((_, i) => (
          <span key={i} className="text-xs sm:text-sm font-black uppercase tracking-[0.3em] text-white/30 mx-4">
            {text}
          </span>
        ))}
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}

/* ─── FEATURED PIECE ─── */
function FeaturedPiece() {
  const title = cleanTitle("MAD-KINGS-ONLY.png");
  return (
    <SectionShell className="mt-10 overflow-hidden p-0">
      <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="relative min-h-[280px] sm:min-h-[360px] lg:min-h-[540px]">
          <Image
            src="/memes/MAD-KINGS-ONLY.png"
            alt="$MAD featured art"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 55vw"
            className="object-cover"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
          <div className="absolute top-4 left-4">
            <span className="rounded-full border border-red-500/30 bg-red-500/15 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-red-300">
              Featured
            </span>
          </div>
        </div>

        <div className="flex flex-col justify-center min-w-0 p-5 sm:p-8 lg:p-10">
          <p className="text-[11px] font-black uppercase tracking-[0.3em] text-white/45">
            Piece 01 / 20
          </p>
          <h2 className="mt-4 break-words text-3xl font-black leading-[0.95] text-white sm:text-5xl">
            Pressure.
            <br />
            Signal.
            <br />
            Identity.
          </h2>
          <p className="mt-5 max-w-xl break-words text-base leading-8 text-white/70">
            The $MAD art vault is built to be bold, sharable, and impossible to ignore. Each piece carries the brand into feeds, group chats, and timelines.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Pill tone="red">Bold</Pill>
            <Pill>Sharable</Pill>
            <Pill tone="green">Mobile Safe</Pill>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="/memes/MAD-KINGS-ONLY.png"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 border border-white/15 bg-white/[0.04] hover:bg-white/[0.08] rounded-full text-sm font-black text-white transition-all"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
              View Full Size
            </a>
            <a
              href="/memes/MAD-KINGS-ONLY.png"
              download="MAD-KINGS-ONLY.png"
              className="inline-flex items-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-400 rounded-full text-sm font-black text-white transition-all hover:scale-[1.02] shadow-[0_0_15px_rgba(255,0,0,0.2)]"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><path d="M7 10l5 5 5-5"/><path d="M12 15V3"/></svg>
              Download
            </a>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}

/* ─── ART CARD ─── */
function ArtCard({ file }: { file: string }) {
  const imageSrc = `/memes/${file}`;
  const title = cleanTitle(file);

  return (
    <div className="group overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/25 hover:border-white/20 hover:bg-black/35 transition-all duration-300">
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={imageSrc}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="p-4 sm:p-5">
        <p className="text-sm font-black text-white group-hover:text-red-400 transition-colors">{title}</p>

        <div className="mt-4 flex gap-2">
          <a
            href={imageSrc}
            target="_blank"
            rel="noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs font-black uppercase tracking-[0.18em] text-white/80 transition hover:border-white/20 hover:bg-white/[0.08]"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
            View
          </a>

          <a
            href={imageSrc}
            download={file}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-full border border-red-500/35 bg-red-500 px-4 py-2.5 text-xs font-black uppercase tracking-[0.18em] text-white transition hover:scale-[1.02] hover:bg-red-400 shadow-[0_0_12px_rgba(255,0,0,0.15)]"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><path d="M7 10l5 5 5-5"/><path d="M12 15V3"/></svg>
            Download
          </a>
        </div>
      </div>
    </div>
  );
}

/* ─── BUY $MAD BANNER ─── */
function BuyMADBanner() {
  return (
    <section className="mt-16 sm:mt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-red-500/20 bg-[radial-gradient(circle_at_top_right,rgba(255,0,0,0.10),rgba(6,0,0,0.95))] p-8 sm:p-12 text-center">
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-red-500/5 rounded-full blur-3xl" />

          <p className="text-[11px] font-black uppercase tracking-[0.34em] text-red-300/80">Like what you see?</p>
          <h2 className="mt-3 text-3xl sm:text-5xl font-black text-white">
            BUY THE TOKEN.<br className="hidden sm:block" /> THEN SHARE THE ART.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-white/60 max-w-xl mx-auto">
            All 20 pieces are free. But the real flex is holding $MAD while you post them.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={LINKS.buy}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-red-500 hover:bg-red-400 text-white text-lg font-black rounded-full transition-all hover:scale-[1.02] shadow-[0_0_30px_rgba(255,0,0,0.25)]"
            >
              Buy $MAD Now
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>
            </a>
            <a
              href={LINKS.solscan}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-6 py-4 border border-white/15 rounded-full text-sm font-bold text-white/70 hover:text-white hover:border-white/30 transition-all"
            >
              View on Solscan
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>
            </a>
          </div>

          <div className="mt-8 inline-flex items-center gap-3 px-5 py-3 rounded-2xl border border-white/10 bg-white/[0.03]">
            <span className="text-white/40 text-xs font-bold">CA:</span>
            <code className="text-red-400 font-mono text-xs sm:text-sm">{CA}</code>
            <CopyButton />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── RISK NOTICE ─── */
function RiskNotice() {
  return (
    <SectionShell className="mt-16 border-yellow-500/20 bg-[linear-gradient(180deg,rgba(255,208,0,0.05),rgba(255,208,0,0.02))] px-6 py-8 sm:px-10 sm:py-10">
      <p className="text-center text-[11px] font-black uppercase tracking-[0.38em] text-yellow-300/85">Risk Notice</p>
      <p className="mx-auto mt-5 max-w-6xl text-center text-base leading-9 text-yellow-100/90 sm:text-xl">
        $MAD is a meme coin and speculative digital asset. Nothing on this website is financial advice or a guarantee of returns. Crypto is risky and volatile. Never risk money you cannot afford to lose. Always do your own research.
      </p>
    </SectionShell>
  );
}

/* ─── FOOTER ─── */
function Footer() {
  const socials = [
    { name: "Telegram", href: LINKS.telegram, icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.2 2L2 10.8l5.6 2.4L16.8 6 9.6 14.8l.8 5.2L13 16.8l4.8 3.2L22 2.8"/></svg> },
    { name: "X", href: LINKS.x, icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
    { name: "Instagram", href: LINKS.instagram, icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg> },
    { name: "TikTok", href: LINKS.tiktok, icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 12a4 4 0 104 4V4a5 5 0 005 5"/></svg> },
  ];

  return (
    <footer className="border-t border-white/10 mt-20">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
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

          {/* Nav */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 tracking-wide">NAVIGATION</h4>
            <ul className="space-y-2.5">
              {[{l:"MAD AI",h:"/mad-mind"},{l:"Roadmap",h:"/roadmap"},{l:"Game",h:"/game"},{l:"Memes",h:"/memes"},{l:"Merch",h:"/merch"}].map((link)=>(
                <li key={link.l}><Link href={link.h} className="text-white/50 hover:text-white text-sm font-medium transition-colors">{link.l}</Link></li>
              ))}
            </ul>
          </div>

          {/* Buy */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 tracking-wide">BUY &amp; TRACK</h4>
            <ul className="space-y-2.5">
              {[{l:"Buy on Jupiter",h:LINKS.buy},{l:"Solscan",h:LINKS.solscan}].map((link)=>(
                <li key={link.l}><a href={link.h} target="_blank" rel="noreferrer" className="text-white/50 hover:text-white text-sm font-medium transition-colors inline-flex items-center gap-1">{link.l}<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg></a></li>
              ))}
            </ul>
          </div>

          {/* Contract */}
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
export default function MemesPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#050505] text-white">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(255,0,0,0.10),transparent_28%),radial-gradient(circle_at_80%_10%,rgba(16,185,129,0.08),transparent_22%),radial-gradient(circle_at_50%_80%,rgba(255,255,255,0.03),transparent_25%),linear-gradient(180deg,#050505,#020202)]" />
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 pb-24 pt-0 sm:px-6 lg:px-8">
        <ArtHero />
        <Marquee />
        <FeaturedPiece />

        {/* Grid */}
        <section className="mt-10">
          <div className="flex items-end justify-between gap-4 mb-6">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.34em] text-white/40">Collection</p>
              <h2 className="mt-1 text-2xl sm:text-3xl font-black text-white">
                All <span className="text-red-500">20</span> Pieces.
              </h2>
            </div>
            <span className="text-white/30 text-xs font-bold uppercase tracking-wider hidden sm:inline">
              Free to download.
            </span>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {ART_FILES.map((file) => (
              <ArtCard key={file} file={file} />
            ))}
          </div>
        </section>

        <BuyMADBanner />
        <RiskNotice />
      </main>
      <Footer />
    </div>
  );
}
