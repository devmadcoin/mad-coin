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

const PRODUCTS = [
  {
    id: "stickers",
    name: "MAD Stickers",
    tag: "Retail Classic",
    tier: "Classic",
    price: "$5.98",
    url: "https://notaveragestickers.com/products/mad-%F0%9F%98%A1-sticker",
    desc: "Clean, bold, and easy to place anywhere.",
    stock: "In Stock",
    stockTone: "green" as const,
    image: "/stickers/Mad-Sticker-logo.png",
    featuredText:
      "The easiest way to carry $MAD into the real world. Simple, loud, collectible, and built for instant signal.",
  },
  {
    id: "card-wrap",
    name: "Card Wrap",
    tag: "Premium Embossed",
    tier: "Premium",
    price: "$10.98",
    url: "https://notaveragestickers.com/products/mad-%F0%9F%98%A1-premium-embossed-card-wrap",
    desc: "A sharper premium look with texture and attitude.",
    stock: "Selling Fast",
    stockTone: "yellow" as const,
    image: "/stickers/Mad-Premium-Embossed-Card-Wrap.png",
    featuredText:
      "A sharper premium piece with texture, attitude, and clean $MAD energy.",
  },
  {
    id: "rich-wrap",
    name: "Rich Wrap",
    tag: "Luxury Variant",
    tier: "Luxury",
    price: "$10.98",
    url: "https://notaveragestickers.com/products/mad-%F0%9F%98%A1-premium-embossed-card-wrap-copy",
    desc: "The louder luxury version with richer flex energy.",
    stock: "Low Stock",
    stockTone: "red" as const,
    image: "/stickers/Mad-Rich-Premium-Embossed-Card-Wrap.png",
    featuredText:
      "The louder luxury version for people who want their $MAD to look richer and cleaner.",
  },
  {
    id: "peeker",
    name: "Peeker",
    tag: "Window Flex",
    tier: "Fan Favorite",
    price: "$9.98",
    url: "https://notaveragestickers.com/products/mad-%F0%9F%98%A1-peeker",
    desc: "Small piece. Fast attention. Big signal.",
    stock: "In Stock",
    stockTone: "green" as const,
    image: "/stickers/Mad-Peeker.png",
    featuredText:
      "Small piece, big signal. Built to catch attention fast.",
  },
] as const;

const FEATURED = PRODUCTS[0];

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

/* ─── SHARED COMPONENTS ─── */
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

function StockBadge({ tone, children }: { tone: "green" | "yellow" | "red"; children: React.ReactNode }) {
  const map = {
    green: "border-emerald-400/25 bg-emerald-400/10 text-emerald-300",
    yellow: "border-amber-400/25 bg-amber-400/10 text-amber-300",
    red: "border-red-400/25 bg-red-400/10 text-red-300",
  };
  return (
    <span className={cn("rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] border", map[tone])}>
      {children}
    </span>
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

/* ─── TOKEN STATS ─── */
function TokenStatsBar() {
  const [liveStats, setLiveStats] = useState<{ price: string; change: string; mcap: string; volume: string } | null>(null);

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
            volume: pair.volume?.h24 ? `$${(pair.volume.h24 / 1000).toFixed(1)}K` : "—",
          });
        }
      } catch { /* silent fail */ }
    }
    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const stats = liveStats ? [
    { label: "PRICE", value: liveStats.price, change: liveStats.change, isPositive: liveStats.change.startsWith("+") },
    { label: "MARKET CAP", value: liveStats.mcap, change: "+8.2%", isPositive: true },
    { label: "24H VOLUME", value: liveStats.volume, change: undefined, isPositive: true },
    { label: "HOLDERS", value: "273", change: "+52", isPositive: true },
  ] : [
    { label: "PRICE", value: "$0.0002066", change: "+5.84%", isPositive: true },
    { label: "MARKET CAP", value: "$106K", change: "+8.2%", isPositive: true },
    { label: "24H VOLUME", value: "$12K", change: undefined, isPositive: true },
    { label: "HOLDERS", value: "273", change: "+52", isPositive: true },
  ];

  return (
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
          <span className="text-xs text-white/40">{liveStats ? "Live data" : "Loading..."}</span>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5 hover:border-white/15 transition duration-300 group">
            <p className="text-[11px] uppercase tracking-[0.24em] text-white/40 font-bold">{stat.label}</p>
            <p className="mt-2 text-2xl font-black text-white group-hover:scale-[1.02] transition-transform origin-left">{stat.value}</p>
            {stat.change && (
              <p className={cn("mt-1 text-xs font-bold flex items-center gap-1", stat.isPositive ? "text-green-400" : "text-red-400")}>
                {stat.isPositive ? "↑" : "↓"} {stat.change}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── HERO ─── */
/* ─── PROOF CAROUSEL ─── */
function ProofCarousel() {
  const [current, setCurrent] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const proofImages = [
    { src: "/proof/mad-sticker-1.png", alt: "$MAD sticker on laptop", caption: "Got my sticker. Laptop game strong." },
    { src: "/proof/mad-sticker-2.png", alt: "$MAD sticker on water bottle", caption: "Hydrated and $MAD." },
    { src: "/proof/mad-sticker-3.png", alt: "$MAD sticker on phone case", caption: "Mobile $MAD energy." },
  ];

  const next = () => setCurrent((prev) => (prev + 1) % proofImages.length);
  const prev = () => setCurrent((prev) => (prev - 1 + proofImages.length) % proofImages.length);

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
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-6 text-center">
          <span className="rounded-full border border-red-500/25 bg-red-500/10 px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.25em] text-red-300">
            Verified Holders
          </span>
          <h2 className="mt-4 text-2xl sm:text-3xl font-black text-white">
            Real People. Real <span className="text-red-500">$MAD</span> Stickers.
          </h2>
          <p className="mt-2 text-sm text-white/50">Community submitted proof. Not paid actors.</p>
        </div>

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
            {proofImages.map((item, i) => (
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
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
                  <span className="rounded-full border border-red-500/30 bg-red-500/15 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-red-300">
                    Proof #{String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="mt-3 text-xl sm:text-3xl font-black text-white">{item.caption}</p>
                  <p className="mt-1 text-sm text-white/50">{item.alt}</p>
                </div>
              </div>
            ))}
          </div>

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

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
            {proofImages.map((_, i) => (
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

        <div className="mt-5 flex items-center justify-center gap-3">
          {proofImages.map((item, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={cn(
                "relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden border-2 transition-all duration-300",
                i === current ? "border-red-500 scale-105 shadow-[0_0_20px_rgba(255,0,0,0.3)]" : "border-white/10 opacity-50 hover:opacity-80"
              )}
            >
              <Image src={item.src} alt={item.alt} fill className="object-cover" sizes="112px" />
            </button>
          ))}
        </div>

        <p className="mt-4 text-center text-xs text-white/40 font-bold uppercase tracking-widest">
          {current + 1} / {proofImages.length}
        </p>
      </div>
    </section>
  );
}

function MerchHero() {
  return (
    <section className="pt-32 pb-16 text-center">
      <div className="mx-auto max-w-7xl px-4">
        <span className="rounded-full border border-red-500/25 bg-red-500/10 px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.25em] text-red-300 inline-flex">
          Drop 001 — Limited
        </span>

        <h1 className="mt-6 text-5xl sm:text-7xl lg:text-8xl font-black text-white leading-[0.9]">
          DON&apos;T JUST
          <br />
          HOLD <span className="text-red-500">$MAD</span>.
        </h1>

        <p className="mt-4 text-3xl sm:text-5xl lg:text-6xl font-black text-white">
          WEAR IT.
        </p>

        <p className="mt-6 text-white/55 max-w-xl mx-auto">
          Stickers, wraps, and signal pieces for the people carrying the brand into real life.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#products"
            className="px-8 py-4 bg-red-500 hover:bg-red-400 text-white font-black rounded-full transition-all hover:scale-[1.02] shadow-[0_0_30px_rgba(255,0,0,0.25)]"
          >
            Shop the Drop
          </a>

          <a
            href="/proof"
            className="px-8 py-4 border border-white/15 text-white rounded-full hover:bg-white/[0.05] transition-all"
          >
            See Proof
          </a>

          <a
            href={LINKS.buy}
            target="_blank"
            rel="noreferrer"
            className="px-8 py-4 border border-white/15 text-white rounded-full hover:bg-white/[0.05] transition-all"
          >
            Buy $MAD First
          </a>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Pill tone="red">Real Project</Pill>
          <Pill tone="green">Live Tech</Pill>
          <Pill>513M Supply</Pill>
          <Pill tone="yellow">800M Target</Pill>
        </div>
      </div>
    </section>
  );
}

/* ─── CUSTOMER VIDEO 1 ─── */
function CustomerVideo() {
  return (
    <section className="py-8">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-6 text-center">
          <span className="rounded-full border border-red-500/25 bg-red-500/10 px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.25em] text-red-300">
            Customer Love
          </span>
          <h2 className="mt-4 text-2xl sm:text-3xl font-black text-white">
            Real People. Real <span className="text-red-500">$MAD</span> Energy.
          </h2>
        </div>
        <div className="mx-auto max-w-2xl rounded-[2rem] border border-white/10 bg-black/40 overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
          <div className="relative aspect-[9/16] w-full sm:aspect-video">
            <iframe
              src="https://www.youtube.com/embed/s-eE7s_bGoc?autoplay=0&mute=1&loop=1&playlist=s-eE7s_bGoc&rel=0&modestbranding=1"
              title="$MAD Customer Sticker Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
        </div>
        <p className="mt-4 text-center text-sm text-white/40">
          Watch the $MAD sticker in action. #madrichenergy
        </p>
      </div>
    </section>
  );
}

/* ─── FEATURED PIECE ─── */
function FeaturedPiece() {
  return (
    <section className="py-12">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid lg:grid-cols-2 rounded-[2rem] border border-white/10 bg-white/[0.03] overflow-hidden">
          <div className="p-8 flex items-center justify-center">
            <img
              src={FEATURED.image}
              alt={FEATURED.name}
              className="max-h-80 object-contain"
            />
          </div>

          <div className="p-8 sm:p-12 flex flex-col justify-center">
            <div className="flex gap-3 mb-4">
              <span className="text-xs text-white/50">{FEATURED.tag}</span>
              <StockBadge tone={FEATURED.stockTone}>{FEATURED.stock}</StockBadge>
            </div>

            <h2 className="text-4xl font-black text-white">{FEATURED.name}</h2>

            <p className="mt-2 text-3xl font-black text-red-400">
              {FEATURED.price}
            </p>

            <p className="mt-4 text-white/60 max-w-md">
              {FEATURED.featuredText}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={FEATURED.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-fit px-8 py-4 bg-red-500 hover:bg-red-400 text-white font-black rounded-full transition-all hover:scale-[1.02]"
              >
                Grab the Sticker
              </a>
              <a
                href="/proof"
                className="inline-flex w-fit px-6 py-4 border border-white/15 text-white rounded-full hover:bg-white/[0.05] transition-all text-sm font-bold"
              >
                View Customer Proof
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── MARQUEE ─── */
function Marquee() {
  const text = "NOT FOR EVERYONE • LIMITED DROP • WHILE SUPPLIES LAST • ";
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

/* ─── PRODUCT GRID ─── */
function ProductGrid() {
  return (
    <section id="products" className="py-16">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="text-4xl font-black text-white mb-10">
          The <span className="text-red-500">$MAD</span> Drop.
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {PRODUCTS.map((product) => (
            <a
              key={product.id}
              href={product.url}
              target="_blank"
              rel="noreferrer"
              className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-5 hover:border-white/20 hover:bg-white/[0.05] transition-all duration-300 group"
            >
              <img
                src={product.image}
                alt={product.name}
                className="h-48 w-full object-contain group-hover:scale-105 transition-transform duration-300"
              />

              <div className="mt-5 flex justify-between items-center">
                <span className="text-xs text-white/40">{product.tier}</span>
                <StockBadge tone={product.stockTone}>{product.stock}</StockBadge>
              </div>

              <h3 className="mt-4 text-xl font-black text-white">
                {product.name}
              </h3>

              <p className="mt-2 text-2xl font-black text-white">
                {product.price}
              </p>

              <p className="mt-2 text-sm text-white/50">{product.desc}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── CUSTOMER VIDEO 2 ─── */
function CustomerVideoTwo() {
  return (
    <section className="py-8">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-6 text-center">
          <span className="rounded-full border border-red-500/25 bg-red-500/10 px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.25em] text-red-300">
            More $MAD Energy
          </span>
          <h2 className="mt-4 text-2xl sm:text-3xl font-black text-white">
            The Hype Is <span className="text-red-500">Real</span>.
          </h2>
        </div>
        <div className="mx-auto max-w-2xl rounded-[2rem] border border-white/10 bg-black/40 overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
          <div className="relative aspect-[9/16] w-full sm:aspect-video">
            <iframe
              src="https://www.youtube.com/embed/osW5w0b2Lp4?autoplay=0&mute=1&loop=1&playlist=osW5w0b2Lp4&rel=0&modestbranding=1"
              title="$MAD Customer Sticker Video 2"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
        </div>
        <p className="mt-4 text-center text-sm text-white/40">
          Another $MAD holder showing love. #madrichenergy
        </p>
      </div>
    </section>
  );
}

/* ─── APPAREL TEASER ─── */
function ApparelTeaser() {
  return (
    <section className="py-16 border-t border-white/10">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid lg:grid-cols-2 rounded-[2rem] border border-white/10 bg-white/[0.03] overflow-hidden">
          <div className="p-8 sm:p-12 flex flex-col justify-center">
            <span className="text-xs text-white/50 uppercase">Drop 002</span>

            <h2 className="mt-4 text-4xl font-black text-white">
              $MAD isn&apos;t just held.
              <br />
              It&apos;s <span className="text-red-500">worn</span>.
            </h2>

            <p className="mt-4 text-white/55">
              The first apparel pieces are on the way.
            </p>
          </div>

          <div className="p-8 flex items-center justify-center">
            <img
              src="/merch/MAD-MERCH-SAMPLE-SHIRT.jpg"
              alt="MAD Rich apparel preview"
              className="max-h-96 object-cover rounded-2xl"
            />
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
      <div className="mx-auto max-w-7xl px-4">
        <div className="rounded-[2rem] border border-yellow-400/15 bg-yellow-500/[0.07] px-6 py-8 text-center">
          <p className="text-[11px] font-black uppercase tracking-[0.34em] text-yellow-200/80">
            Risk Notice
          </p>

          <p className="mt-4 text-yellow-100/85 max-w-4xl mx-auto text-sm sm:text-base">
            $MAD is a meme coin and speculative digital asset. Nothing on this
            website is financial advice or a guarantee of returns. Crypto is risky and volatile. Never risk money you cannot afford to lose. Always do your own research.
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
              {[{l:"MAD AI",h:"/mad-mind"},{l:"Roadmap",h:"/roadmap"},{l:"Game",h:"/game"},{l:"Memes",h:"/memes"},{l:"Merch",h:"/merch"}].map((link)=>(
                <li key={link.l}><Link href={link.h} className="text-white/50 hover:text-white text-sm font-medium transition-colors">{link.l}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold text-sm mb-4 tracking-wide">BUY & TRACK</h4>
            <ul className="space-y-2.5">
              {[{l:"Buy on Jupiter",h:LINKS.buy},{l:"Solscan",h:LINKS.solscan}].map((link)=>(
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
export default function MerchPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(255,0,0,0.10),transparent_28%),radial-gradient(circle_at_80%_10%,rgba(16,185,129,0.08),transparent_22%),radial-gradient(circle_at_50%_80%,rgba(255,255,255,0.03),transparent_25%),linear-gradient(180deg,#050505,#020202)]" />

      <LiveTicker />

      <main className="mx-auto max-w-7xl px-4 pb-24 pt-6 sm:px-6 lg:px-8">
        <div className="h-20" />

        <MerchHero />
        <ProofCarousel />
        <TokenStatsBar />
        <CustomerVideo />
        <FeaturedPiece />
        <Marquee />
        <ProductGrid />
        <CustomerVideoTwo />
        <ApparelTeaser />
        <RiskNotice />
      </main>

      <Footer />
    </div>
  );
}
