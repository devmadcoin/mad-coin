"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import MadConfessions from "./components/MadConfessions";

const CA = "Fa7ZE9nCEYnrHsnoeHuhEExJpchtrBtKXnWe6CgHpump";

const LINKS = {
  telegram: "https://t.me/MadOfficalChannel",
  x: "https://x.com/madrichclub_",
  instagram: "https://www.instagram.com/madrichclub/",
  tiktok: "https://www.tiktok.com/@madrichclub",
  buy: "https://jup.ag/tokens/Fa7ZE9nCEYnrHsnoeHuhEExJpchtrBtKXnWe6CgHpump",
  chart: "https://dexscreener.com/solana/gt3dwhhkrd2mnqmmchpzdetpg4ttaa23exn1m2vwinfs",
  jupiter: "https://jup.ag/tokens/Fa7ZE9nCEYnrHsnoeHuhEExJpchtrBtKXnWe6CgHpump",
  solscan: "https://solscan.io/token/Fa7ZE9nCEYnrHsnoeHuhEExJpchtrBtKXnWe6CgHpump",
  birdeye: "https://birdeye.so/solana/token/Fa7ZE9nCEYnrHsnoeHuhEExJpchtrBtKXnWe6CgHpump",
  dexscreener: "https://dexscreener.com/solana/gt3dwhhkrd2mnqmmchpzdetpg4ttaa23exn1m2vwinfs",
} as const;

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
function Btn({ href, children, primary = false }: { href: string; children: React.ReactNode; primary?: boolean }) {
  const external = href.startsWith("http");
  const className = [
    "inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-black transition duration-300",
    primary
      ? "bg-red-500 text-white hover:scale-[1.02] hover:bg-red-400"
      : "border border-white/10 bg-white/[0.04] text-white hover:border-white/20 hover:bg-white/[0.07]",
  ].join(" ");
  if (!external) return <Link href={href} className={className}>{children}</Link>;
  return <a href={href} target="_blank" rel="noreferrer" className={className}>{children}</a>;
}

function Chip({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-white/55">{children}</span>;
}

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
      <nav
        className={[
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled ? "bg-black/95 backdrop-blur-xl border-b border-white/10" : "bg-transparent",
        ].join(" ")}
      >
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
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-red-500 flex items-center justify-center text-white font-black text-sm shadow-[0_0_20px_rgba(255,0,0,0.3)]">
                M
              </div>
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

/* ─── SOCIAL BUTTON ─── */
function SocialIconButton({ href, src, alt }: { href: string; src: string; alt: string }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" aria-label={alt} title={alt} className="group flex h-16 w-16 items-center justify-center rounded-full border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] shadow-[0_10px_24px_rgba(0,0,0,0.28)] transition duration-300 hover:scale-105 hover:border-white/20 hover:bg-white/[0.08]">
      <Image src={src} alt={alt} width={34} height={34} className="h-9 w-9 object-contain transition duration-300 group-hover:scale-110" />
    </a>
  );
}

/* ─── METRIC CARD ─── */
function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
      <p className="text-2xl font-black text-white">{value}</p>
      <p className="mt-1 text-[11px] uppercase tracking-[0.24em] text-white/42">{label}</p>
    </div>
  );
}

/* ─── TOKEN STAT CARD ─── */
function TokenStatCard({ label, value, change, isPositive }: { label: string; value: string; change?: string; isPositive?: boolean }) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5 hover:border-white/15 transition duration-300 group">
      <p className="text-[11px] uppercase tracking-[0.24em] text-white/40 font-bold">{label}</p>
      <p className="mt-2 text-2xl font-black text-white group-hover:scale-[1.02] transition-transform origin-left">{value}</p>
      {change && (
        <p className={`mt-1 text-xs font-bold flex items-center gap-1 ${isPositive ? "text-green-400" : "text-red-400"}`}>
          {isPositive ? (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M7 17l5-5 5 5M7 7h10"/></svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M7 7l5 5 5-5M7 17h10"/></svg>
          )}
          {change}
        </p>
      )}
    </div>
  );
}

/* ─── ART CAMPAIGN CARD ─── */
function ArtCampaignCard({ title, text, image, accent = "red" }: { title: string; text: string; image: string; accent?: "red" | "green" | "white" }) {
  const borderClass = accent === "red" ? "border-red-500/20" : accent === "green" ? "border-emerald-400/20" : "border-white/10";
  const overlayClass = accent === "red" ? "bg-[linear-gradient(180deg,rgba(10,10,10,0.2),rgba(20,0,0,0.58)_50%,rgba(0,0,0,0.92))]" : accent === "green" ? "bg-[linear-gradient(180deg,rgba(10,10,10,0.2),rgba(0,24,10,0.52)_50%,rgba(0,0,0,0.92))]" : "bg-[linear-gradient(180deg,rgba(10,10,10,0.22),rgba(12,12,12,0.56)_50%,rgba(0,0,0,0.92))]";
  const tintClass = accent === "red" ? "bg-red-500/10" : accent === "green" ? "bg-emerald-500/10" : "bg-black/10";

  return (
    <div className={`group relative overflow-hidden rounded-[28px] border ${borderClass} min-h-[220px] transition duration-300 hover:scale-[1.01]`}>
      <div className="absolute inset-0"><Image src={image} alt={title} fill className="object-cover transition duration-500 group-hover:scale-[1.04]" sizes="(max-width: 1024px) 100vw, 33vw" /></div>
      <div className={`absolute inset-0 ${overlayClass}`} />
      <div className={`absolute inset-0 ${tintClass}`} />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
      <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-white/8 blur-3xl" />
      <div className="relative z-10 flex h-full flex-col justify-end p-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/55">{title}</p>
        <p className="mt-3 max-w-sm text-2xl font-black leading-tight text-white sm:text-[2rem]">{text}</p>
      </div>
    </div>
  );
}

/* ─── EXCHANGE LOGO CARD ─── */
function ExchangeLogoCard({ href, src, alt, label }: { href: string; src: string; alt: string; label: string }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="flex min-w-[240px] items-center justify-center rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.035),rgba(255,255,255,0.018))] px-8 py-10 shadow-[0_10px_24px_rgba(0,0,0,0.22)] transition duration-300 hover:scale-[1.01] hover:border-white/20 hover:bg-white/[0.06]" aria-label={label} title={label}>
      <Image src={src} alt={alt} width={180} height={56} className="h-12 w-auto object-contain opacity-95" />
    </a>
  );
}

/* ─── HOW TO BUY STEP ─── */
function HowToBuyStep({ number, title, description, link, linkText, icon }: { number: string; title: string; description: string; link: string; linkText: string; icon: React.ReactNode }) {
  return (
    <div className="relative p-6 bg-white/[0.02] border border-white/10 rounded-[24px] hover:border-white/15 transition-all duration-300 group">
      <div className="absolute -top-3 -left-2 w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-lg shadow-red-500/20">
        {number}
      </div>
      <div className="w-12 h-12 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center justify-center text-red-400 mb-4 mt-2 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-lg font-black text-white mb-2">{title}</h3>
      <p className="text-sm text-white/50 mb-4 leading-relaxed">{description}</p>
      <a href={link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm font-bold text-red-400 hover:text-red-300 transition-colors">
        {linkText}
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>
      </a>
    </div>
  );
}

/* ─── HERO GLOBE ─── */
function HeroGlobe() {
  return (
    <div className="pointer-events-none absolute right-[-120px] top-[-90px] hidden h-[520px] w-[520px] overflow-hidden rounded-full opacity-20 lg:block">
      <div className="absolute inset-0 rounded-full border border-red-500/20 bg-[radial-gradient(circle_at_35%_35%,rgba(255,0,0,0.22),rgba(255,0,0,0.06)_38%,transparent_65%)] shadow-[0_0_70px_rgba(255,0,0,0.18)]" />
      <div className="absolute inset-0 rounded-full bg-[repeating-linear-gradient(to_right,rgba(255,0,0,0.18)_0px,rgba(255,0,0,0.18)_1px,transparent_1px,transparent_40px),repeating-linear-gradient(to_bottom,rgba(255,0,0,0.14)_0px,rgba(255,0,0,0.14)_1px,transparent_1px,transparent_40px)] opacity-55" />
      <div className="absolute inset-[8%] rounded-full border border-red-500/18" />
      <div className="absolute inset-[22%] rounded-full border border-red-500/14" />
      <div className="absolute inset-[36%] rounded-full border border-red-500/10" />
      <div className="absolute left-[12%] top-[16%] h-2.5 w-2.5 rounded-full bg-red-500 shadow-[0_0_16px_rgba(255,0,0,0.8)]" />
      <div className="absolute left-[28%] top-[34%] h-2 w-2 rounded-full bg-red-400 shadow-[0_0_12px_rgba(255,0,0,0.75)]" />
      <div className="absolute left-[60%] top-[24%] h-2.5 w-2.5 rounded-full bg-red-500 shadow-[0_0_16px_rgba(255,0,0,0.8)]" />
      <div className="absolute left-[74%] top-[40%] h-2 w-2 rounded-full bg-red-400 shadow-[0_0_12px_rgba(255,0,0,0.75)]" />
      <div className="absolute left-[52%] top-[62%] h-2.5 w-2.5 rounded-full bg-red-500 shadow-[0_0_16px_rgba(255,0,0,0.8)]" />
      <div className="absolute left-[30%] top-[70%] h-2 w-2 rounded-full bg-red-400 shadow-[0_0_12px_rgba(255,0,0,0.75)]" />
      <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black via-black/20 to-transparent" />
      <div className="absolute inset-0 rounded-full border border-red-500/8" />
    </div>
  );
}

/* ─── MAIN PAGE ─── */
export default function Home() {
  const exchangeItems = [
    { href: LINKS.birdeye, src: "/logos/birdeye.png", alt: "Birdeye", label: "Birdeye" },
    { href: LINKS.solscan, src: "/logos/solscan.png", alt: "Solscan", label: "Solscan" },
    { href: LINKS.jupiter, src: "/logos/jupiter.png", alt: "Jupiter", label: "Jupiter" },
    { href: LINKS.dexscreener, src: "/logos/DEX-screener.png", alt: "DEX Screener", label: "DEX Screener" },
  ];

  const tokenStats = [
    { label: "PRICE", value: "$0.0002066", change: "+5.84%", isPositive: true },
    { label: "MARKET CAP", value: "$106K", change: "+8.2%", isPositive: true },
    { label: "HOLDERS", value: "273", change: "+52", isPositive: true },
    { label: "SUPPLY", value: "513M", change: "↓ to 800M", isPositive: true },
    { label: "NEXT BURN", value: "10K HLD", change: undefined, isPositive: true },
  ];

  const howToBuySteps = [
    {
      number: "01",
      title: "Get Phantom Wallet",
      description: "Download Phantom from your app store or browser. Create a wallet. Save your recovery phrase.",
      link: "https://phantom.app",
      linkText: "Get Phantom →",
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 12V8H6a2 2 0 00-2 2v8a2 2 0 002 2h12v-4"/><path d="M16 6l4 4-4 4"/></svg>,
    },
    {
      number: "02",
      title: "Buy SOL",
      description: "Purchase SOL on Coinbase, Binance, or Kraken. Send it to your Phantom wallet address.",
      link: "https://coinbase.com",
      linkText: "Buy on Coinbase →",
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9 12h6m-3-3v6"/></svg>,
    },
    {
      number: "03",
      title: "Connect Jupiter",
      description: "Open Jupiter Exchange. Connect your Phantom wallet. Make sure you're on Solana.",
      link: "https://jup.ag",
      linkText: "Open Jupiter →",
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4"/></svg>,
    },
    {
      number: "04",
      title: "Swap for $MAD",
      description: "Paste the contract address below. Choose how much SOL. Swap. Welcome to the club.",
      link: LINKS.buy,
      linkText: "Buy $MAD Now →",
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>,
    },
  ];

  const socials = [
    { name: "Telegram", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M21.2 2L2 10.8l5.6 2.4L16.8 6 9.6 14.8l.8 5.2L13 16.8l4.8 3.2L22 2.8"/></svg>, href: LINKS.telegram },
    { name: "X", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>, href: LINKS.x },
    { name: "Instagram", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/></svg>, href: LINKS.instagram },
    { name: "TikTok", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.24 4.97v-7.36a8.24 8.24 0 004.55 1.37V10.4a4.85 4.85 0 01-3.77-4.25c.02-.15.04-.31.04-.47V2h3.45v3.45c0 .16.02.32.04.47a4.83 4.83 0 003.77 4.25c.28.06.56.1.85.1v-3.5a1.5 1.5 0 01-.85.1z"/></svg>, href: LINKS.tiktok },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#040404] text-white">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(255,0,0,0.14),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(0,255,120,0.06),transparent_28%),linear-gradient(180deg,#080808,#030303)]" />
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 pb-24 pt-6 sm:px-6 lg:px-8">
        <div className="h-16" />

        {/* ─── HERO ─── */}
        <section className="relative overflow-hidden rounded-[42px] border border-white/10 bg-black/40 p-6 shadow-[0_20px_100px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-10 lg:p-14">
          <HeroGlobe />

          <div className="relative z-10 grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.34em] text-white/40">CONTROL YOURSELF</p>

              <h1 className="mt-5 text-[3.2rem] font-black leading-[0.88] tracking-[-0.05em] sm:text-[5rem] lg:text-[6.3rem]">
                <span className="text-red-500 drop-shadow-[0_0_18px_rgba(255,0,0,0.45)]">STOP</span>
                <br />PANICKING.
                <br />GET
                <br /><span className="text-red-500 drop-shadow-[0_0_18px_rgba(255,0,0,0.45)]">$MAD</span>{" "}
                <span className="text-green-400 drop-shadow-[0_0_18px_rgba(34,197,94,0.35)]">RICH.</span>
              </h1>

              <div className="mt-5 max-w-xl">
                <p className="text-base font-semibold text-white/72">Most people fold. $MAD builds.</p>
                <p className="mt-3 text-sm leading-7 text-white/55 sm:text-base">
                  $MAD Rich means staying calm under pressure, building while others panic, and turning discipline into wealth.
                </p>
              </div>

              {/* DRUNK-PROOF CTAS: BIGGER, FEWER, IMPOSSIBLE TO MISS */}
              <div className="mt-7 flex flex-col sm:flex-row gap-3">
                <a href={LINKS.buy} target="_blank" rel="noreferrer" className="group flex items-center justify-center gap-3 px-10 py-5 bg-red-500 hover:bg-red-400 text-white text-xl font-black rounded-full transition-all hover:scale-[1.02] shadow-[0_0_40px_rgba(255,0,0,0.35)]">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                  Buy $MAD Now
                </a>
                <a href="#how-to-buy" className="flex items-center justify-center gap-2 px-8 py-5 border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-white text-lg font-black rounded-full transition-all">
                  How to Buy
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
                </a>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                <Chip>Real Project</Chip>
                <Chip>Live Tech</Chip>
                <Chip>513M Supply</Chip>
                <Chip>800M Target</Chip>
              </div>

              <div className="mt-7 flex flex-wrap items-center gap-4">
                <SocialIconButton href={LINKS.telegram} src="/logos/MAD-TELEGRAM.png" alt="Telegram" />
                <SocialIconButton href={LINKS.x} src="/logos/MAD-X-LOGO.png" alt="X" />
                <SocialIconButton href={LINKS.instagram} src="/logos/MAD-INSTAGRAM-LOGO.png" alt="Instagram" />
                <SocialIconButton href={LINKS.tiktok} src="/logos/MAD-TIKTOK-LOGO.png" alt="TikTok" />
              </div>
            </div>

            <div className="relative rounded-[34px] border border-white/10 bg-white/[0.03] p-4">
              <div className="overflow-hidden rounded-[28px] border border-white/10 bg-black">
                <video autoPlay muted loop playsInline preload="auto" className="aspect-[16/10] w-full object-cover">
                  <source src="/loops/bullish-mad.mp4" type="video/mp4" />
                </video>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <MetricCard label="Website" value="LIVE" />
                <MetricCard label="MAD Mind" value="AI" />
                <MetricCard label="Build" value="DAILY" />
              </div>
            </div>
          </div>
        </section>

        {/* ─── TOKEN STATS ─── */}
        <section className="mt-10 rounded-[38px] border border-white/10 bg-black/40 p-6 shadow-[0_18px_70px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-8 lg:p-10">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.34em] text-white/40">Live on Solana</p>
              <h2 className="mt-2 text-2xl font-black leading-[0.95] text-white sm:text-3xl md:text-4xl">Token <span className="text-red-500">Stats</span></h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
              </span>
              <span className="text-xs text-white/40">Live data</span>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {tokenStats.map((stat) => (
              <TokenStatCard key={stat.label} label={stat.label} value={stat.value} change={stat.change} isPositive={stat.isPositive} />
            ))}
          </div>
        </section>

        {/* ─── HOW TO BUY ─── */}
        <section id="how-to-buy" className="mt-10 rounded-[38px] border border-white/10 bg-black/40 p-6 shadow-[0_18px_70px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-8 lg:p-10">
          <div className="mb-8">
            <p className="text-[11px] font-bold uppercase tracking-[0.34em] text-white/40">Get Started</p>
            <h2 className="mt-2 text-2xl font-black leading-[0.95] text-white sm:text-3xl md:text-4xl">How to <span className="text-red-500">Buy $MAD</span></h2>
            <p className="mt-3 text-sm text-white/50 max-w-xl">4 steps. No complex DeFi knowledge needed.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {howToBuySteps.map((step) => (
              <HowToBuyStep key={step.number} {...step} />
            ))}
          </div>

          {/* CONTRACT ADDRESS - BIG, OBVIOUS, IMPOSSIBLE TO MISS */}
          <div className="mt-8 p-6 bg-white/[0.02] border-2 border-red-500/20 rounded-[24px]">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <p className="text-white/40 text-sm font-bold mb-1 uppercase tracking-widest">Contract Address (Solana)</p>
                <code className="text-red-400 font-mono text-sm sm:text-base break-all">{CA}</code>
              </div>
              <div className="flex gap-3 shrink-0">
                <CopyButton />
                <Btn href={LINKS.solscan}>View on Solscan</Btn>
              </div>
            </div>
          </div>
        </section>

        {/* ─── LIVE CHART ─── */}
        <section className="mt-10 overflow-hidden rounded-[38px] border border-white/10 bg-black/40 p-6 shadow-[0_18px_70px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-8 lg:p-10">
          <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.34em] text-white/40">Real Time Data</p>
              <h2 className="mt-2 text-2xl font-black leading-[0.95] text-white sm:text-3xl md:text-4xl">Live Chart</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <Btn href={LINKS.chart} primary>DEX Screener</Btn>
              <Btn href={LINKS.birdeye}>Birdeye</Btn>
              <Btn href={LINKS.jupiter} primary>Buy on Jupiter</Btn>
            </div>
          </div>
          <div className="overflow-hidden rounded-[24px] border border-white/10 bg-black">
            <iframe src={`${LINKS.dexscreener}?embed=1&theme=dark&trades=0&info=0`} className="aspect-[4/3] w-full sm:aspect-[16/9]" allow="clipboard-write" title="$MAD Chart" />
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <Chip>DEX Screener</Chip>
            <Chip>Birdeye</Chip>
            <Chip>Solscan</Chip>
            <Chip>Jupiter</Chip>
          </div>
        </section>

        {/* ─── ART CAMPAIGN CARDS ─── */}
        <section className="mt-10 grid gap-4 lg:grid-cols-3">
          <ArtCampaignCard title="Mindset" text="Pressure reveals the real ones." image="/memes/MAD-KINGS-ONLY.png" accent="red" />
          <ArtCampaignCard title="Signal" text="Not noise. Not panic. Signal." image="/memes/MAD-YOU-SIDELINED.png" accent="white" />
          <ArtCampaignCard title="Wealth" text="Rich starts in the mind first." image="/memes/MAD-RICH-OR-BROKE.png" accent="green" />
        </section>

        {/* ─── EXCHANGE MARQUEE ─── */}
        <section className="mt-10 overflow-hidden rounded-[38px] border border-white/10 bg-black/30 p-6 shadow-[0_18px_70px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-8 lg:p-10">
          <div>
            <p className="text-center text-[11px] font-semibold uppercase tracking-[0.34em] text-white/42">Verified on exchanges</p>
            <h2 className="mt-3 text-center text-3xl font-black leading-[0.95] text-white sm:text-4xl md:text-5xl">Trusted across real crypto platforms.</h2>
            <p className="mx-auto mt-3 max-w-lg text-center text-sm text-white/50">Track $MAD on Jupiter, DEX Screener, Birdeye, and Solscan.</p>
          </div>
          <div className="mt-8 overflow-hidden rounded-[28px] bg-[linear-gradient(90deg,rgba(96,58,80,0.95),rgba(49,57,110,0.95))] px-4 py-8 sm:px-6">
            <div className="logo-marquee flex w-max items-center gap-8">
              {[...exchangeItems, ...exchangeItems, ...exchangeItems].map((item, index) => (
                <ExchangeLogoCard key={`${item.label}-${index}`} href={item.href} src={item.src} alt={item.alt} label={item.label} />
              ))}
            </div>
          </div>
        </section>

        {/* ─── CONFESSIONS ─── */}
        <section className="mt-10 rounded-[38px] border border-white/10 bg-[linear-gradient(180deg,rgba(25,0,0,0.9),rgba(6,0,0,0.96))] p-4 shadow-[0_18px_70px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-6 lg:p-8">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.34em] text-white/40">Community</p>
              <h2 className="mt-2 text-2xl font-black leading-[0.95] text-white sm:text-3xl md:text-4xl">MAD <span className="text-red-500">Confessions</span></h2>
              <p className="mt-2 text-sm text-white/50 max-w-lg">Anonymous thoughts. No filter. Just real feelings.</p>
            </div>
            <Btn href="#">View All</Btn>
          </div>
          <div className="min-w-0">
            <MadConfessions />
          </div>
        </section>

        {/* ─── RISK NOTICE ─── */}
        <section className="mt-8 rounded-[26px] border border-yellow-400/15 bg-yellow-500/[0.07] px-5 py-5 text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-yellow-200/80">Risk Notice</p>
          <p className="mt-3 text-sm leading-7 text-yellow-100/85">
            $MAD is a meme coin and speculative digital asset. Nothing on this website is financial advice or a guarantee of returns. Crypto is risky and volatile. Never risk money you cannot afford to lose. Always do your own research.
          </p>
        </section>
      </main>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-white/10">
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

            {/* Resources */}
            <div>
              <h4 className="text-white font-bold text-sm mb-4 tracking-wide">BUY & TRACK</h4>
              <ul className="space-y-2.5">
                {[{l:"Buy on Jupiter",h:LINKS.jupiter},{l:"DEX Screener",h:LINKS.dexscreener},{l:"Birdeye",h:LINKS.birdeye},{l:"Solscan",h:LINKS.solscan}].map((link)=>(
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
    </div>
  );
}
