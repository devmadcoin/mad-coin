"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";
import MadConfessions from "./components/MadConfessions";

const CA = "Fa7ZE9nCEYnrHsnoeHuhEExJpchtrBtKXnWe6CgHpump";
const PAIR = "Gt3dWHHKRd2mNQmmCHPzdeTpG4tTAa23exN1m2vwinfs";
const LAUNCH_DATE = new Date("2026-02-04T00:00:00Z");

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

function Chip({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-white/55">{children}</span>;
}

function CopyButton({ text = CA, label = "Copy CA" }: { text?: string; label?: string }) {
  const { copied, copy } = useCopyToClipboard();
  return (
    <button onClick={() => copy(text)} className={[
      "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold transition duration-300",
      copied ? "border border-green-400/30 bg-green-400/10 text-green-400" : "border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20",
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

/* ─── SCANLINE OVERLAY (Matrix aesthetic) ─── */
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

/* ─── LIVE TICKER (top bar) ─── */
function LiveTicker() {
  const [stats, setStats] = useState<{ price: string; change: string; mcap: string; volume: string; buys: number; sells: number } | null>(null);
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
            buys: pair.txns?.h24?.buys || 0,
            sells: pair.txns?.h24?.sells || 0,
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
      <div className="fixed top-0 left-0 right-0 z-[60] bg-black/90 backdrop-blur-xl border-b border-red-500/20">
        <div className="mx-auto max-w-7xl px-4 py-2 flex items-center justify-center gap-4">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
            </span>
            <span className="text-red-400/60 text-xs font-bold uppercase tracking-widest">Connecting to Solana...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const items = [
    { label: "PRICE", value: stats.price },
    { label: "24H", value: stats.change, color: stats.change.startsWith("+") ? "text-green-400" : stats.change.startsWith("-") ? "text-red-400" : "text-white/60" },
    { label: "MCAP", value: stats.mcap },
    { label: "VOL", value: stats.volume },
    { label: "BUYS", value: `${stats.buys}`, color: "text-green-400" },
    { label: "SELLS", value: `${stats.sells}`, color: "text-red-400" },
    { label: "CA", value: `${CA.slice(0, 6)}...${CA.slice(-4)}` },
  ];

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] bg-black/90 backdrop-blur-xl border-b border-red-500/20">
      <div className="mx-auto max-w-7xl px-4 py-2 flex items-center justify-between gap-4 overflow-x-auto">
        <div className="flex items-center gap-5 min-w-max">
          <span className="text-red-500/60 text-[10px] font-bold uppercase tracking-widest shrink-0">$MAD LIVE</span>
          {items.map((item) => (
            <div key={item.label} className="flex items-center gap-1.5 shrink-0">
              <span className="text-white/25 text-[10px] font-bold uppercase">{item.label}</span>
              <span className={`text-xs font-black ${item.color || "text-white"}`}>{item.value}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
          </span>
          <span className="text-[10px] text-green-400/60 font-bold uppercase">ONLINE</span>
        </div>
      </div>
    </div>
  );
}

/* ─── DAYS ALIVE COUNTER ─── */
function DaysAlive() {
  const [days, setDays] = useState(0);
  useEffect(() => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - LAUNCH_DATE.getTime()) / (1000 * 60 * 60 * 24));
    setDays(diff);
  }, []);
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
      </span>
      <span className="text-xs font-bold text-white/50">
        <span className="text-white font-black">{days}</span> DAYS ALIVE
      </span>
    </div>
  );
}

/* ─── SOCIAL ICON ─── */
function SocialIconButton({ href, src, alt }: { href: string; src: string; alt: string }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" aria-label={alt} title={alt} className="group flex h-14 w-14 items-center justify-center rounded-full border border-white/12 bg-white/[0.03] shadow-[0_8px_20px_rgba(0,0,0,0.28)] transition duration-300 hover:scale-105 hover:border-red-500/30 hover:bg-red-500/10">
      <Image src={src} alt={alt} width={30} height={30} className="h-8 w-8 object-contain transition duration-300 group-hover:scale-110" />
    </a>
  );
}

/* ─── METRIC CARD ─── */
function MetricCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-[20px] border border-white/10 bg-white/[0.03] p-4 backdrop-blur-sm">
      <p className="text-[10px] uppercase tracking-[0.24em] text-white/40 font-bold">{label}</p>
      <p className="mt-1 text-xl font-black text-white">{value}</p>
      {sub && <p className="mt-0.5 text-[10px] text-white/30">{sub}</p>}
    </div>
  );
}

/* ─── TOKEN STAT CARD ─── */
function TokenStatCard({ label, value, change, isPositive, href }: { label: string; value: string; change?: string; isPositive?: boolean; href?: string }) {
  const Card = (
    <div className={`rounded-[20px] border border-white/10 bg-white/[0.03] p-5 hover:border-red-500/20 transition duration-300 group ${href ? "cursor-pointer" : ""}`}>
      <p className="text-[10px] uppercase tracking-[0.24em] text-white/40 font-bold">{label}</p>
      <p className="mt-2 text-2xl font-black text-white group-hover:text-red-400 transition-colors">{value}</p>
      {change && (
        <p className={`mt-1 text-xs font-bold ${isPositive ? "text-green-400" : "text-red-400"}`}>
          {change}
        </p>
      )}
    </div>
  );
  if (href) return <a href={href} target="_blank" rel="noreferrer">{Card}</a>;
  return Card;
}

/* ─── ART CARD ─── */
function ArtCard({ title, text, image, accent = "red" }: { title: string; text: string; image: string; accent?: "red" | "green" | "white" }) {
  const borderClass = accent === "red" ? "border-red-500/20" : accent === "green" ? "border-emerald-400/20" : "border-white/10";
  return (
    <div className={`group relative overflow-hidden rounded-[24px] border ${borderClass} min-h-[200px] transition duration-300 hover:scale-[1.01] hover:border-red-500/30`}>
      <div className="absolute inset-0"><Image src={image} alt={title} fill className="object-cover transition duration-500 group-hover:scale-[1.04]" sizes="(max-width: 1024px) 100vw, 33vw" /></div>
      <div className={`absolute inset-0 ${accent === "red" ? "bg-[linear-gradient(180deg,transparent_30%,rgba(20,0,0,0.8)_70%,rgba(0,0,0,0.95))]" : accent === "green" ? "bg-[linear-gradient(180deg,transparent_30%,rgba(0,20,10,0.8)_70%,rgba(0,0,0,0.95))]" : "bg-[linear-gradient(180deg,transparent_30%,rgba(10,10,10,0.8)_70%,rgba(0,0,0,0.95))]"}`} />
      <div className="relative z-10 flex h-full flex-col justify-end p-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/50">{title}</p>
        <p className="mt-2 text-xl font-black leading-tight text-white">{text}</p>
      </div>
    </div>
  );
}

/* ─── EXCHANGE CARD ─── */
function ExchangeCard({ href, src, alt, label }: { href: string; src: string; alt: string; label: string }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="flex min-w-[200px] items-center justify-center rounded-[20px] border border-white/10 bg-white/[0.03] px-6 py-8 transition duration-300 hover:border-red-500/20 hover:bg-red-500/[0.04]" aria-label={label} title={label}>
      <Image src={src} alt={alt} width={160} height={48} className="h-10 w-auto object-contain opacity-90" />
    </a>
  );
}

/* ─── HOW TO BUY STEP ─── */
function HowToBuyStep({ number, title, description, link, linkText, icon }: { number: string; title: string; description: string; link: string; linkText: string; icon: React.ReactNode }) {
  return (
    <div className="relative p-5 bg-white/[0.02] border border-white/10 rounded-[20px] hover:border-red-500/20 transition-all duration-300 group">
      <div className="absolute -top-3 -left-2 w-9 h-9 bg-red-500 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-lg shadow-red-500/20">{number}</div>
      <div className="w-10 h-10 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center justify-center text-red-400 mb-3 mt-1 group-hover:scale-110 transition-transform">{icon}</div>
      <h3 className="text-base font-black text-white mb-1">{title}</h3>
      <p className="text-xs text-white/50 mb-3 leading-relaxed">{description}</p>
      <a href={link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-bold text-red-400 hover:text-white transition-colors">
        {linkText}
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>
      </a>
    </div>
  );
}

/* ─── HERO GLOBE (enhanced) ─── */
function HeroGlobe() {
  return (
    <div className="pointer-events-none absolute right-[-100px] top-[-80px] hidden h-[480px] w-[480px] overflow-hidden rounded-full opacity-[0.15] lg:block">
      <div className="absolute inset-0 rounded-full border border-red-500/20 bg-[radial-gradient(circle_at_35%_35%,rgba(255,0,0,0.25),rgba(255,0,0,0.08)_38%,transparent_65%)] shadow-[0_0_60px_rgba(255,0,0,0.15)]" />
      <div className="absolute inset-0 rounded-full bg-[repeating-linear-gradient(to_right,rgba(255,0,0,0.15)_0px,rgba(255,0,0,0.15)_1px,transparent_1px,transparent_35px),repeating-linear-gradient(to_bottom,rgba(255,0,0,0.12)_0px,rgba(255,0,0,0.12)_1px,transparent_1px,transparent_35px)] opacity-50" />
      <div className="absolute inset-[8%] rounded-full border border-red-500/15" />
      <div className="absolute inset-[22%] rounded-full border border-red-500/12" />
      <div className="absolute inset-[36%] rounded-full border border-red-500/8" />
      <div className="absolute left-[12%] top-[16%] h-2 w-2 rounded-full bg-red-500 shadow-[0_0_14px_rgba(255,0,0,0.7)]" />
      <div className="absolute left-[28%] top-[34%] h-1.5 w-1.5 rounded-full bg-red-400 shadow-[0_0_10px_rgba(255,0,0,0.6)]" />
      <div className="absolute left-[60%] top-[24%] h-2 w-2 rounded-full bg-red-500 shadow-[0_0_14px_rgba(255,0,0,0.7)]" />
      <div className="absolute left-[74%] top-[40%] h-1.5 w-1.5 rounded-full bg-red-400 shadow-[0_0_10px_rgba(255,0,0,0.6)]" />
      <div className="absolute left-[52%] top-[62%] h-2 w-2 rounded-full bg-red-500 shadow-[0_0_14px_rgba(255,0,0,0.7)]" />
      <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black via-black/20 to-transparent" />
    </div>
  );
}

/* ─── FLOATING PARTICLES (ambient) ─── */
function FloatingParticles() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-red-500/10 blur-sm"
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

/* ═══════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════ */

export default function Home() {
  const [liveStats, setLiveStats] = useState<{ price: string; change: string; mcap: string; holders: string; volume: string; buys: number; sells: number } | null>(null);
  const [showConfessions, setShowConfessions] = useState(false);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("https://api.dexscreener.com/latest/dex/tokens/Fa7ZE9nCEYnrHsnoeHuhEExJpchtrBtKXnWe6CgHpump");
        const data = await res.json();
        const pair = data.pairs?.[0];
        if (pair) {
          setLiveStats({
            price: pair.priceUsd ? `$${parseFloat(pair.priceUsd).toFixed(8)}` : "—",
            change: pair.priceChange?.h24 ? `${pair.priceChange.h24 > 0 ? "+" : ""}${pair.priceChange.h24}%` : "—",
            mcap: pair.marketCap ? `$${(pair.marketCap / 1000).toFixed(1)}K` : "—",
            holders: "265",
            volume: pair.volume?.h24 ? `$${(pair.volume.h24 / 1000).toFixed(1)}K` : "—",
            buys: pair.txns?.h24?.buys || 0,
            sells: pair.txns?.h24?.sells || 0,
          });
        }
      } catch {
        /* fallback to static if API fails */
      }
    }
    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const exchangeItems = [
    { href: LINKS.birdeye, src: "/logos/birdeye.png", alt: "Birdeye", label: "Birdeye" },
    { href: LINKS.solscan, src: "/logos/solscan.png", alt: "Solscan", label: "Solscan" },
    { href: LINKS.jupiter, src: "/logos/jupiter.png", alt: "Jupiter", label: "Jupiter" },
    { href: LINKS.dexscreener, src: "/logos/DEX-screener.png", alt: "DEX Screener", label: "DEX Screener" },
  ];

  const tokenStats = liveStats ? [
    { label: "PRICE", value: liveStats.price, change: liveStats.change, isPositive: liveStats.change.startsWith("+") },
    { label: "MARKET CAP", value: liveStats.mcap, change: "+7.7%", isPositive: true },
    { label: "HOLDERS", value: "265", change: "+44", isPositive: true },
    { label: "SUPPLY", value: "504.76M", change: "↓ 800M", isPositive: true, href: "https://solscan.io/token/Fa7ZE9nCEYnrHsnoeHuhEExJpchtrBtKXnWe6CgHpump" },
    { label: "24H VOL", value: liveStats.volume, change: undefined, isPositive: true },
    { label: "24H TXNS", value: `${liveStats.buys + liveStats.sells}`, change: `${liveStats.buys}B / ${liveStats.sells}S`, isPositive: liveStats.buys > liveStats.sells },
  ] : [
    { label: "PRICE", value: "$0.0002599", change: "+7.70%", isPositive: true },
    { label: "MARKET CAP", value: "$131.2K", change: "+7.7%", isPositive: true },
    { label: "HOLDERS", value: "265", change: "+44", isPositive: true },
    { label: "SUPPLY", value: "504.76M", change: "↓ 800M", isPositive: true, href: "https://solscan.io/token/Fa7ZE9nCEYnrHsnoeHuhEExJpchtrBtKXnWe6CgHpump" },
    { label: "24H VOL", value: "$4.5K", change: undefined, isPositive: true },
    { label: "24H TXNS", value: "120", change: "83B / 37S", isPositive: true },
  ];

  const howToBuySteps = [
    {
      number: "01", title: "Get Phantom Wallet",
      description: "Download Phantom. Create a wallet. Save your recovery phrase. That's your bank now.",
      link: "https://phantom.app", linkText: "Get Phantom →",
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 12V8H6a2 2 0 00-2 2v8a2 2 0 002 2h12v-4"/><path d="M16 6l4 4-4 4"/></svg>,
    },
    {
      number: "02", title: "Buy SOL",
      description: "Purchase SOL on Coinbase or Binance. Send it to your Phantom wallet. Simple.",
      link: "https://coinbase.com", linkText: "Buy SOL →",
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9 12h6m-3-3v6"/></svg>,
    },
    {
      number: "03", title: "Connect Jupiter",
      description: "Open Jupiter Exchange. Connect Phantom. Make sure you're on Solana mainnet.",
      link: "https://jup.ag", linkText: "Open Jupiter →",
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4"/></svg>,
    },
    {
      number: "04", title: "Swap for $MAD",
      description: "Paste the contract address. Choose how much SOL. Swap. Welcome to the exit.",
      link: LINKS.buy, linkText: "Buy $MAD Now →",
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>,
    },
  ];

  const socials = [
    { name: "Telegram", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M21.2 2L2 10.8l5.6 2.4L16.8 6 9.6 14.8l.8 5.2L13 16.8l4.8 3.2L22 2.8"/></svg>, href: LINKS.telegram },
    { name: "X", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>, href: LINKS.x },
    { name: "Instagram", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/></svg>, href: LINKS.instagram },
    { name: "TikTok", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.24 4.97v-7.36a8.24 8.24 0 004.55 1.37V10.4a4.85 4.85 0 01-3.77-4.25c.02-.15.04-.31.04-.47V2h3.45v3.45c0 .16.02.32.04.47a4.83 4.83 0 003.77 4.25c.28.06.56.1.85.1v-3.5a1.5 1.5 0 01-.85.1z"/></svg>, href: LINKS.tiktok },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#030303] text-white">
      <Scanlines />
      <FloatingParticles />

      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(255,0,0,0.12),transparent_35%),radial-gradient(circle_at_80%_20%,rgba(255,40,0,0.05),transparent_30%),linear-gradient(180deg,#070707,#020202)]" />

      <LiveTicker />

      <main className="mx-auto max-w-7xl px-4 pb-24 pt-6 sm:px-6 lg:px-8">
        <div className="h-20" />

        {/* ═══════════════════════════════════════════
           HERO — THE DOOR
           ═══════════════════════════════════════════ */}
        <section className="relative overflow-hidden rounded-[36px] border border-red-500/15 bg-black/50 p-6 shadow-[0_20px_80px_rgba(255,0,0,0.08)] backdrop-blur-xl sm:p-10 lg:p-14">
          <HeroGlobe />
          <div className="relative z-10 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <DaysAlive />
                <Chip>LIVE</Chip>
                <Chip>DOXXED DEV</Chip>
              </div>

              <p className="text-[11px] font-bold uppercase tracking-[0.34em] text-white/40">CONTROL YOURSELF</p>
              <h1 className="mt-4 text-[3rem] font-black leading-[0.88] tracking-[-0.04em] sm:text-[4.5rem] lg:text-[5.5rem]">
                <span className="text-red-500 drop-shadow-[0_0_20px_rgba(255,0,0,0.4)]">STOP</span>
                <br />PANICKING.
                <br />GET
                <br /><span className="text-red-500 drop-shadow-[0_0_20px_rgba(255,0,0,0.4)]">$MAD</span>{" "}
                <span className="text-green-400 drop-shadow-[0_0_16px_rgba(34,197,94,0.3)]">RICH.</span>
              </h1>

              <div className="mt-5 max-w-lg">
                <p className="text-base font-bold text-white/80">Most people fold. $MAD builds.</p>
                <p className="mt-2 text-sm leading-7 text-white/50">
                  104 days on-chain. 265 holders. One doxxed dev. No VC. No presale. No tax. Just frequency.
                </p>
              </div>

              {/* CONTRACT ADDRESS — IMPOSSIBLE TO MISS */}
              <div className="mt-6 p-4 bg-red-500/[0.05] border border-red-500/20 rounded-[20px]">
                <p className="text-[10px] font-bold uppercase tracking-widest text-red-400/60 mb-2">Solana Contract Address</p>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <code className="text-red-400 font-mono text-sm break-all">{CA}</code>
                  <div className="flex gap-2 shrink-0">
                    <CopyButton />
                    <a href={LINKS.solscan} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-white/70 transition-colors">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>
                      Solscan
                    </a>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <a href={LINKS.buy} target="_blank" rel="noreferrer" className="group flex items-center justify-center gap-3 px-8 py-4 bg-red-500 hover:bg-red-400 text-white text-lg font-black rounded-full transition-all hover:scale-[1.02] shadow-[0_0_30px_rgba(255,0,0,0.3)]">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                  GET $MAD
                </a>
                <a href="#how-to-buy" className="flex items-center justify-center gap-2 px-6 py-4 border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-white text-base font-black rounded-full transition-all">
                  How to Buy
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
                </a>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <Chip>REAL PROJECT</Chip>
                <Chip>504.76M SUPPLY</Chip>
                <Chip>800M TARGET</Chip>
                <Chip>0% TAX</Chip>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <SocialIconButton href={LINKS.telegram} src="/logos/MAD-TELEGRAM.png" alt="Telegram" />
                <SocialIconButton href={LINKS.x} src="/logos/MAD-X-LOGO.png" alt="X" />
                <SocialIconButton href={LINKS.instagram} src="/logos/MAD-INSTAGRAM-LOGO.png" alt="Instagram" />
                <SocialIconButton href={LINKS.tiktok} src="/logos/MAD-TIKTOK-LOGO.png" alt="TikTok" />
              </div>
            </div>

            <div className="relative rounded-[28px] border border-white/10 bg-white/[0.02] p-3">
              <div className="overflow-hidden rounded-[24px] border border-white/10 bg-black">
                <video autoPlay muted loop playsInline preload="auto" className="aspect-[16/10] w-full object-cover">
                  <source src="/loops/bullish-mad.mp4" type="video/mp4" />
                </video>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2">
                <MetricCard label="Website" value="LIVE" sub="Next.js / Vercel" />
                <MetricCard label="MAD Mind" value="AI" sub="Autonomous growth" />
                <MetricCard label="Build" value="DAILY" sub="No days off" />
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
           STORY — THE GOSPEL IS REAL
           ═══════════════════════════════════════════ */}
        <section className="mt-8 rounded-[36px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,0,0,0.9),rgba(5,0,0,0.96))] p-6 shadow-[0_16px_60px_rgba(0,0,0,0.3)] backdrop-blur-xl sm:p-8 lg:p-10">
          <div className="mb-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.34em] text-white/40">Real People. Real Stories.</p>
            <h2 className="mt-2 text-2xl font-black leading-[0.95] text-white sm:text-3xl md:text-4xl">The <span className="text-red-500">Gospel</span> is Real</h2>
          </div>

          <div className="rounded-[24px] border border-red-500/15 bg-red-500/[0.04] p-5 sm:p-7 relative overflow-hidden">
            <div className="absolute -top-16 -right-16 h-32 w-32 rounded-full bg-red-500/10 blur-3xl" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-full bg-red-500/20 flex items-center justify-center text-base font-black text-red-400 border border-red-500/30">A</div>
                <div>
                  <p className="text-sm font-black text-white">Abraxas</p>
                  <p className="text-[10px] text-white/40">$MAD Holder · DM to Dev</p>
                </div>
                <div className="ml-auto">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-green-400/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-green-400 border border-green-400/20">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-400" />
                    </span>
                    Verified
                  </span>
                </div>
              </div>

              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-red-500/10 px-3 py-1.5 border border-red-500/20">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-400"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                <p className="text-[10px] font-bold text-red-400 uppercase tracking-wider">Giveaway Winner · Held. Didn&apos;t Fold.</p>
              </div>

              <blockquote className="text-sm leading-7 text-white/60 italic">
                <span className="text-red-500 text-lg font-black not-italic mr-1">&ldquo;</span>
                When I first encountered Mad Rich, I won a 200k MAD giveaway. The profits on holding the $120 worth of $MAD lasted me 2 months. $MAD relieved me most of my debts.
                <br /><br />
                <span className="text-red-400 font-semibold not-italic">$MAD saved me during the hard times.</span>
                <span className="text-red-500 text-lg font-black not-italic ml-1">&rdquo;</span>
              </blockquote>

              <div className="mt-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-4 border-t border-white/10">
                <div className="flex items-center gap-3">
                  <p className="text-[10px] text-white/30">Shared via DM · With permission</p>
                  <a href="https://x.com/madrichclub_/status/2052836164311322949" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-[10px] text-white/40 hover:text-red-400 transition-colors">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                    See post
                  </a>
                </div>
                <p className="text-[10px] font-bold text-red-400/70 uppercase tracking-wider">$MAD Changes Lives</p>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
           LIVE TOKEN STATS
           ═══════════════════════════════════════════ */}
        <section className="mt-8 rounded-[36px] border border-white/10 bg-black/50 p-6 shadow-[0_16px_60px_rgba(0,0,0,0.3)] backdrop-blur-xl sm:p-8 lg:p-10">
          <div className="mb-5 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.34em] text-white/40">On-Chain Data</p>
              <h2 className="mt-2 text-2xl font-black leading-[0.95] text-white sm:text-3xl md:text-4xl">Live <span className="text-red-500">Token Stats</span></h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
              </span>
              <span className="text-xs text-green-400/60 font-bold">{liveStats ? "LIVE DATA" : "DEXSCREENER API"}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {tokenStats.map((stat) => (
              <TokenStatCard key={stat.label} label={stat.label} value={stat.value} change={stat.change} isPositive={stat.isPositive} href={stat.href} />
            ))}
          </div>
          <div className="mt-4 flex items-center justify-center">
            <a href={LINKS.dexscreener} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-xs font-bold text-white/40 hover:text-red-400 transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>
              View on DEX Screener
            </a>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
           HOW TO BUY — THE EXIT
           ═══════════════════════════════════════════ */}
        <section id="how-to-buy" className="mt-8 rounded-[36px] border border-white/10 bg-black/50 p-6 shadow-[0_16px_60px_rgba(0,0,0,0.3)] backdrop-blur-xl sm:p-8 lg:p-10">
          <div className="mb-6">
            <p className="text-[11px] font-bold uppercase tracking-[0.34em] text-white/40">Get Started</p>
            <h2 className="mt-2 text-2xl font-black leading-[0.95] text-white sm:text-3xl md:text-4xl">How to <span className="text-red-500">Buy $MAD</span></h2>
            <p className="mt-2 text-sm text-white/50 max-w-lg">4 steps. No DeFi degree required. Just a wallet and conviction.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {howToBuySteps.map((step) => (
              <HowToBuyStep key={step.number} {...step} />
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════════
           ART CAMPAIGN — VISUAL FREQUENCY
           ═══════════════════════════════════════════ */}
        <div className="mt-8 grid gap-3 lg:grid-cols-3">
          <ArtCard title="Mindset" text="Pressure reveals the real ones." image="/memes/MAD-KINGS-ONLY.png" accent="red" />
          <ArtCard title="Signal" text="Not noise. Not panic. Signal." image="/memes/MAD-YOU-SIDELINED.png" accent="white" />
          <ArtCard title="Wealth" text="Rich starts in the mind first." image="/memes/MAD-RICH-OR-BROKE.png" accent="green" />
        </div>

        {/* ═══════════════════════════════════════════
           EXCHANGE MARQUEE
           ═══════════════════════════════════════════ */}
        <section className="mt-8 overflow-hidden rounded-[36px] border border-white/10 bg-black/30 p-6 shadow-[0_16px_60px_rgba(0,0,0,0.3)] backdrop-blur-xl sm:p-8 lg:p-10">
          <div>
            <p className="text-center text-[11px] font-semibold uppercase tracking-[0.34em] text-white/40">Verified on-chain</p>
            <h2 className="mt-3 text-center text-3xl font-black leading-[0.95] text-white sm:text-4xl md:text-5xl">Track <span className="text-red-500">$MAD</span> Everywhere</h2>
            <p className="mx-auto mt-2 max-w-lg text-center text-sm text-white/50">Jupiter. DEX Screener. Birdeye. Solscan. Real platforms. Real data.</p>
          </div>
          <div className="mt-6 overflow-hidden rounded-[24px] bg-[linear-gradient(90deg,rgba(96,58,80,0.95),rgba(49,57,110,0.95))] px-4 py-6 sm:px-6">
            <div className="logo-marquee flex w-max items-center gap-6">
              {[...exchangeItems, ...exchangeItems].map((item, index) => (
                <ExchangeCard key={`${item.label}-${index}`} href={item.href} src={item.src} alt={item.alt} label={item.label} />
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
           CONFESSIONS — CONDITIONAL
           ═══════════════════════════════════════════ */}
        {showConfessions && (
          <section className="mt-8 rounded-[36px] border border-white/10 bg-[linear-gradient(180deg,rgba(20,0,0,0.9),rgba(5,0,0,0.96))] p-4 shadow-[0_16px_60px_rgba(0,0,0,0.3)] backdrop-blur-xl sm:p-6 lg:p-8">
            <div className="mb-5 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.34em] text-white/40">Community</p>
                <h2 className="mt-2 text-2xl font-black leading-[0.95] text-white sm:text-3xl md:text-4xl">MAD <span className="text-red-500">Confessions</span></h2>
                <p className="mt-1 text-sm text-white/50 max-w-lg">Anonymous thoughts. No filter. Just real feelings.</p>
              </div>
            </div>
            <div className="min-w-0"><MadConfessions /></div>
          </section>
        )}

        {/* ═══════════════════════════════════════════
           RISK NOTICE
           ═══════════════════════════════════════════ */}
        <section className="mt-6 rounded-[24px] border border-yellow-400/15 bg-yellow-500/[0.07] px-5 py-5 text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-yellow-200/80">Risk Notice</p>
          <p className="mt-3 text-sm leading-7 text-yellow-100/85">
            $MAD is a meme coin and speculative digital asset. Nothing on this website is financial advice or a guarantee of returns. Crypto is risky and volatile. Never risk money you cannot afford to lose. Always do your own research.
          </p>
        </section>
      </main>

      {/* ═══════════════════════════════════════════
         FOOTER
         ═══════════════════════════════════════════ */}
      <footer className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white font-black text-lg">M</div>
                <div>
                  <span className="text-white font-black text-xl">$MAD</span>
                  <span className="block text-white/40 text-[10px] tracking-[0.3em] uppercase">Stay $MAD</span>
                </div>
              </div>
              <p className="text-white/50 text-sm leading-relaxed mb-5">The Supreme of Solana. Limited. Exclusive. Cult.</p>
              <div className="flex items-center gap-2">
                {socials.map((s) => (
                  <a key={s.name} href={s.href} target="_blank" rel="noreferrer" className="w-10 h-10 bg-white/5 hover:bg-red-500/10 border border-white/5 hover:border-red-500/20 rounded-xl flex items-center justify-center text-white/40 hover:text-red-400 transition-all" title={s.name}>{s.icon}</a>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-white font-bold text-sm mb-3 tracking-wide">NAVIGATION</h4>
              <ul className="space-y-2">
                {[{l:"MAD AI",h:"/mad-mind"},{l:"Roadmap",h:"/roadmap"},{l:"Game",h:"/game"},{l:"Memes",h:"/memes"},{l:"Merch",h:"/merch"}].map((link)=> (
                  <li key={link.l}><Link href={link.h} className="text-white/50 hover:text-white text-sm font-medium transition-colors">{link.l}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold text-sm mb-3 tracking-wide">BUY & TRACK</h4>
              <ul className="space-y-2">
                {[{l:"Buy on Jupiter",h:LINKS.jupiter},{l:"DEX Screener",h:LINKS.dexscreener},{l:"Birdeye",h:LINKS.birdeye},{l:"Solscan",h:LINKS.solscan}].map((link)=> (
                  <li key={link.l}><a href={link.h} target="_blank" rel="noreferrer" className="text-white/50 hover:text-white text-sm font-medium transition-colors inline-flex items-center gap-1">{link.l}<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg></a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold text-sm mb-3 tracking-wide">CONTRACT</h4>
              <div className="p-3 bg-white/[0.02] border border-white/10 rounded-xl">
                <code className="text-[10px] text-red-400 font-mono break-all block mb-2">{CA}</code>
                <CopyButton label="Copy" />
              </div>
              <a href={LINKS.telegram} target="_blank" rel="noreferrer" className="mt-3 flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white text-sm font-bold transition-all">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.2 2L2 10.8l5.6 2.4L16.8 6 9.6 14.8l.8 5.2L13 16.8l4.8 3.2L22 2.8"/></svg>
                Join Telegram
              </a>
            </div>
          </div>
          <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-white/40 text-xs">&copy; {new Date().getFullYear()} $MAD. All rights reserved.</p>
            <p className="text-white/40 text-xs">Stay $MAD. Limited. Exclusive. Cult.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
