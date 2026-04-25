"use client";

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
    image: "/images/merch/stickers.jpg",
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
    image: "/images/merch/card-wrap.jpg",
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
    image: "/images/merch/rich-wrap.jpg",
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
    image: "/images/merch/peeker.jpg",
  },
] as const;

const FEATURED = PRODUCTS[2]; // Rich Wrap

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

function StockBadge({ tone, children }: { tone: "green" | "yellow" | "red"; children: React.ReactNode }) {
  const map = {
    green: "border-emerald-400/25 bg-emerald-400/10 text-emerald-300",
    yellow: "border-amber-400/25 bg-amber-400/10 text-amber-300",
    red: "border-red-400/25 bg-red-400/10 text-red-300",
  };
  return (
    <span className={["rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] border", map[tone]].join(" ")}>
      {children}
    </span>
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
function MerchHero() {
  return (
    <section className="relative pt-32 pb-16 sm:pt-40 sm:pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <span className="rounded-full border border-red-500/25 bg-red-500/10 px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.25em] text-red-300 mb-6">
            Drop 001 — Limited
          </span>
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black text-white leading-[0.9] tracking-tight">
            DON&apos;T JUST<br />
            HOLD <span className="text-red-500">$MAD</span>.
          </h1>
          <p className="mt-4 text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-[0.95]">
            WEAR IT.
          </p>
          <p className="mt-6 text-base sm:text-lg text-white/55 max-w-xl leading-relaxed">
            Stickers, wraps, and signal pieces for the people carrying the brand into real life. Not for everyone. While supplies last.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <a
              href="#products"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-red-500 hover:bg-red-400 text-white text-lg font-black rounded-full transition-all hover:scale-[1.02] shadow-[0_0_30px_rgba(255,0,0,0.25)]"
            >
              Shop the Drop
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>
            </a>
            <a
              href={LINKS.buy}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/15 hover:border-white/30 bg-white/[0.04] hover:bg-white/[0.07] text-white text-sm font-black rounded-full transition-all"
            >
              Buy $MAD First
            </a>
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

/* ─── FEATURED PIECE ─── */
function FeaturedPiece() {
  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.03] shadow-[0_18px_70px_rgba(0,0,0,0.35)] backdrop-blur-xl">
          <div className="grid lg:grid-cols-2 gap-0">
            {/* Image side */}
            <div className="relative h-72 sm:h-96 lg:h-auto bg-[radial-gradient(circle_at_center,rgba(255,0,0,0.08),transparent_60%)] flex items-center justify-center p-8">
              <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,0,0,0.05),transparent,rgba(255,0,0,0.05))]" />
              <div className="relative w-full max-w-sm aspect-square rounded-[2rem] border border-white/10 bg-[#0a0a0a] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,0,0,0.12),transparent_50%)]" />
                <span className="text-white/10 text-9xl font-black select-none">$</span>
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="rounded-full border border-red-500/30 bg-red-500/15 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-red-300">
                    Bestseller
                  </span>
                </div>
              </div>
            </div>

            {/* Content side */}
            <div className="flex flex-col justify-center p-6 sm:p-10 lg:p-12">
              <div className="flex items-center gap-3 mb-4">
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-white/50">
                  {FEATURED.tag}
                </span>
                <StockBadge tone={FEATURED.stockTone}>{FEATURED.stock}</StockBadge>
              </div>

              <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight">
                {FEATURED.name}
              </h2>
              <p className="mt-2 text-2xl sm:text-3xl font-black text-red-400">
                {FEATURED.price}
              </p>
              <p className="mt-4 text-base text-white/60 leading-relaxed max-w-md">
                {FEATURED.desc} The premium flex piece for the people who want their $MAD to look louder and cleaner.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <a
                  href={FEATURED.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-red-500 hover:bg-red-400 text-white font-black rounded-full transition-all hover:scale-[1.02] shadow-[0_0_20px_rgba(255,0,0,0.2)]"
                >
                  Grab It Now
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>
                </a>
                <span className="text-white/30 text-xs font-bold uppercase tracking-wider">
                  Once it&apos;s gone, it&apos;s gone.
                </span>
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
  const text = "NOT FOR EVERYONE • LIMITED DROP • WHILE SUPPLIES LAST • GRAB IT OR REGRET IT • ";
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
    <section id="products" className="py-16 sm:py-24 scroll-mt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.34em] text-white/40">Storefront</p>
            <h2 className="mt-2 text-3xl sm:text-5xl font-black text-white">
              The <span className="text-red-500">$MAD</span> Drop.
            </h2>
            <p className="mt-2 text-sm text-white/50">Pick a piece and open the product directly. Limited quantities.</p>
          </div>
          <Link href="/" className="inline-flex items-center gap-2 px-5 py-2.5 border border-white/10 rounded-full text-sm font-bold text-white/60 hover:text-white hover:border-white/20 transition-all">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Return Home
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {PRODUCTS.map((product) => (
            <a
              key={product.id}
              href={product.url}
              target="_blank"
              rel="noreferrer"
              className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05] transition-all duration-300"
            >
              {/* Image area */}
              <div className="relative h-56 sm:h-64 bg-[radial-gradient(circle_at_center,rgba(255,0,0,0.06),transparent_60%)] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,0,0,0.03),transparent,rgba(255,0,0,0.03))]" />
                <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-3xl border border-white/10 bg-[#0a0a0a] flex items-center justify-center">
                  <span className="text-white/10 text-5xl font-black select-none">
                    {product.name[0]}
                  </span>
                </div>
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-red-500/0 group-hover:bg-red-500/5 transition-colors" />
              </div>

              {/* Content */}
              <div className="p-5 sm:p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">{product.tier}</span>
                  <StockBadge tone={product.stockTone}>{product.stock}</StockBadge>
                </div>
                <h3 className="text-xl font-black text-white group-hover:text-red-400 transition-colors">
                  {product.name}
                </h3>
                <p className="mt-3 text-2xl font-black text-white">
                  {product.price}
                </p>
                <p className="mt-2 text-sm text-white/50 leading-relaxed">
                  {product.desc}
                </p>
                <div className="mt-5 inline-flex items-center gap-2 text-sm font-black text-red-400 group-hover:gap-3 transition-all">
                  Open Product
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── BUY $MAD BANNER ─── */
function BuyMADBanner() {
  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-red-500/20 bg-[radial-gradient(circle_at_top_right,rgba(255,0,0,0.10),rgba(6,0,0,0.95))] p-8 sm:p-12 text-center">
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-red-500/5 rounded-full blur-3xl" />

          <p className="text-[11px] font-black uppercase tracking-[0.34em] text-red-300/80">Step One</p>
          <h2 className="mt-3 text-3xl sm:text-5xl font-black text-white">
            YOU NEED $MAD<br className="hidden sm:block" /> BEFORE YOU CAN FLEX IT.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-white/60 max-w-xl mx-auto">
            Buy the token first. Then come back and grab the merch. That&apos;s the order of operations.
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

/* ─── APPAREL TEASER ─── */
function ApparelTeaser() {
  return (
    <section className="py-16 sm:py-24 border-t border-white/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.03] shadow-[0_18px_70px_rgba(0,0,0,0.35)] backdrop-blur-xl">
          <div className="grid lg:grid-cols-2 gap-0">
            <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-16 order-2 lg:order-1">
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-white/50 w-fit mb-6">
                Drop 002
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight">
                $MAD isn&apos;t just held.<br />
                It&apos;s <span className="text-red-500">worn</span>.
              </h2>
              <p className="mt-4 text-base sm:text-lg text-white/55 leading-relaxed max-w-md">
                The first apparel pieces are on the way. Sharp, minimal, high-contrast. Built for the culture.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <span className="inline-flex items-center gap-2 px-6 py-3 border border-white/15 rounded-full text-sm font-black text-white/50">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                  Coming Soon
                </span>
                <span className="text-white/30 text-xs font-bold uppercase tracking-wider">
                  MAD RICH. apparel loading...
                </span>
              </div>
            </div>

            <div className="relative h-72 sm:h-96 lg:h-auto bg-[radial-gradient(circle_at_center,rgba(255,0,0,0.08),transparent_60%)] flex items-center justify-center p-8 order-1 lg:order-2">
              <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,0,0,0.05),transparent,rgba(255,0,0,0.05))]" />
              <div className="relative w-full max-w-sm aspect-square rounded-[2rem] border border-white/10 bg-[#0a0a0a] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,0,0,0.12),transparent_50%)]" />
                <span className="text-white/10 text-9xl font-black select-none">M</span>
                <div className="absolute bottom-6 left-6 right-6 flex justify-center">
                  <span className="rounded-full border border-red-500/30 bg-red-500/15 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-red-300">
                    Drop 002 — Loading
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── APPAREL PREVIEW ─── */
function ApparelPreview() {
  const pillars = [
    {
      title: "Signal",
      desc: "Instantly reads as part of the $MAD universe.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>
      ),
    },
    {
      title: "Style",
      desc: "Sharp, minimal, high-contrast presentation.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
      ),
    },
    {
      title: "Collectible",
      desc: "Built to feel worth keeping.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
      ),
    },
  ];

  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-[11px] font-bold uppercase tracking-[0.34em] text-white/40">Built for the Culture</p>
          <h2 className="mt-2 text-3xl sm:text-4xl font-black text-white">
            More than merch.<br className="hidden sm:block" /> It&apos;s <span className="text-red-500">$MAD</span> you can wear.
          </h2>
          <p className="mt-3 text-sm text-white/50 max-w-lg mx-auto">
            Clean, bold, collectible pieces built to carry the signal into the real world.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-5">
          {pillars.map((p) => (
            <div key={p.title} className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 sm:p-8 hover:border-white/15 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mb-5">
                {p.icon}
              </div>
              <h3 className="text-xl font-black text-white">{p.title}</h3>
              <p className="mt-2 text-sm text-white/55 leading-relaxed">{p.desc}</p>
            </div>
          ))}
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
        <div className="rounded-[2rem] border border-yellow-400/15 bg-yellow-500/[0.07] px-6 py-8 sm:px-10 sm:py-10 text-center">
          <p className="text-[11px] font-black uppercase tracking-[0.34em] text-yellow-200/80">Risk Notice</p>
          <p className="mx-auto mt-4 max-w-4xl text-sm sm:text-base leading-8 text-yellow-100/85">
            $MAD is a meme coin and speculative digital asset. Nothing on this website is financial advice or a guarantee of returns. Merch purchases are processed through our retail partner. Crypto is risky and volatile. Never risk money you cannot afford to lose.
          </p>
        </div>
      </div>
    </section>
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
export default function MerchPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#050505] text-white">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(255,0,0,0.10),transparent_28%),radial-gradient(circle_at_80%_10%,rgba(16,185,129,0.08),transparent_22%),radial-gradient(circle_at_50%_80%,rgba(255,255,255,0.03),transparent_25%),linear-gradient(180deg,#050505,#020202)]" />
      <Navbar />
      <main>
        <MerchHero />
        <FeaturedPiece />
        <Marquee />
        <ProductGrid />
        <BuyMADBanner />
        <ApparelTeaser />
        <ApparelPreview />
        <RiskNotice />
      </main>
      <Footer />
    </div>
  );
}
