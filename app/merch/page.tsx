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

/* ─── HERO ─── */
/* ─── PROOF GRID ─── */
function ProofGrid() {
  const proofImages = [
    { src: "/proof/mad-sticker-1.png", alt: "$MAD sticker on laptop", caption: "Got my sticker. Laptop game strong." },
    { src: "/proof/mad-sticker-2.png", alt: "$MAD sticker on water bottle", caption: "Hydrated and $MAD." },
    { src: "/proof/mad-sticker-3.png", alt: "$MAD sticker on phone case", caption: "Mobile $MAD energy." },
  ];

  return (
    <section id="proof" className="py-8">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-8 text-center">
          <span className="rounded-full border border-red-500/25 bg-red-500/10 px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.25em] text-red-300">
            Verified Holders
          </span>
          <h2 className="mt-4 text-2xl sm:text-3xl font-black text-white">
            Real People. Real <span className="text-red-500">$MAD</span> Stickers.
          </h2>
          <p className="mt-2 text-sm text-white/50">Community submitted proof. Not paid actors.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {proofImages.map((item, i) => (
            <div
              key={i}
              className="group overflow-hidden rounded-[2rem] border border-white/10 bg-black/25 hover:border-white/20 hover:bg-black/35 transition-all duration-300"
            >
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="rounded-full border border-red-500/30 bg-red-500/15 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-red-300">
                    Proof #{String(i + 1).padStart(2, "0")}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <p className="text-lg font-black text-white">{item.caption}</p>
                <p className="mt-1 text-xs text-white/40">{item.alt}</p>
              </div>
            </div>
          ))}
        </div>
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
            href="#proof"
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

/* ─── VIDEO GRID ─── */
function VideoGrid() {
  const videos = [
    {
      src: "https://www.youtube.com/embed/s-eE7s_bGoc?autoplay=0&mute=1&loop=1&playlist=s-eE7s_bGoc&rel=0&modestbranding=1",
      title: "$MAD Customer Sticker Video",
      label: "Customer Love",
      heading: "Real People. Real $MAD Energy.",
      caption: "Watch the $MAD sticker in action. #madrichenergy",
    },
    {
      src: "https://www.youtube.com/embed/osW5w0b2Lp4?autoplay=0&mute=1&loop=1&playlist=osW5w0b2Lp4&rel=0&modestbranding=1",
      title: "$MAD Customer Sticker Video 2",
      label: "More $MAD Energy",
      heading: "The Hype Is Real.",
      caption: "Another $MAD holder showing love. #madrichenergy",
    },
  ];

  return (
    <section className="py-8">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-6 text-center">
          <span className="rounded-full border border-red-500/25 bg-red-500/10 px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.25em] text-red-300">
            Customer Proof
          </span>
          <h2 className="mt-4 text-2xl sm:text-3xl font-black text-white">
            Real <span className="text-red-500">$MAD</span> Energy In Action.
          </h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {videos.map((video, i) => (
            <div key={i} className="rounded-[2rem] border border-white/10 bg-black/40 overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
              <div className="relative aspect-[9/16] w-full sm:aspect-video">
                <iframe
                  src={video.src}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              </div>
              <div className="p-5 text-center">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-red-300">{video.label}</span>
                <p className="mt-2 text-lg font-black text-white">{video.heading}</p>
                <p className="mt-1 text-sm text-white/40">{video.caption}</p>
              </div>
            </div>
          ))}
        </div>
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
                href="#proof"
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
        <FeaturedPiece />
        <Marquee />
        <ProductGrid />
        <ProofGrid />
        <VideoGrid />
        <ApparelTeaser />
        <RiskNotice />
      </main>

      <Footer />
    </div>
  );
}
