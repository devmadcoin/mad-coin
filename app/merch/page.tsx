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

function useCopyToClipboard(timeout = 2000) {
  const [copied, setCopied] = useState(false);

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), timeout);
    } catch {}
  };

  return { copied, copy };
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
      {copied ? "Copied!" : "Copy CA"}
    </button>
  );
}

function StockBadge({
  tone,
  children,
}: {
  tone: "green" | "yellow" | "red";
  children: React.ReactNode;
}) {
  const map = {
    green: "border-emerald-400/25 bg-emerald-400/10 text-emerald-300",
    yellow: "border-amber-400/25 bg-amber-400/10 text-amber-300",
    red: "border-red-400/25 bg-red-400/10 text-red-300",
  };

  return (
    <span
      className={[
        "rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] border",
        map[tone],
      ].join(" ")}
    >
      {children}
    </span>
  );
}

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
          scrolled
            ? "bg-black/95 backdrop-blur-xl border-b border-white/10"
            : "bg-transparent",
        ].join(" ")}
      >
        <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-red-500 flex items-center justify-center text-white font-black text-sm">
              M
            </div>

            <div className="flex flex-col">
              <span className="text-white font-black text-lg">$MAD</span>
              <span className="text-white/40 text-[9px] tracking-[0.3em] uppercase">
                Stay $MAD
              </span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="px-4 py-2 text-sm font-bold text-white/50 hover:text-white rounded-full hover:bg-white/5"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <a
              href={LINKS.buy}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex px-5 py-2.5 bg-red-500 hover:bg-red-400 text-white text-sm font-black rounded-full"
            >
              Buy $MAD
            </a>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 text-white"
            >
              {mobileOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>
      </nav>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/95 pt-24 px-6 lg:hidden">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-2xl font-black text-white/80 py-3 border-b border-white/10"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
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
            className="px-8 py-4 bg-red-500 hover:bg-red-400 text-white font-black rounded-full"
          >
            Shop the Drop
          </a>

          <a
            href={LINKS.buy}
            target="_blank"
            rel="noreferrer"
            className="px-8 py-4 border border-white/15 text-white rounded-full"
          >
            Buy $MAD First
          </a>
        </div>
      </div>
    </section>
  );
}

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

            <a
              href={FEATURED.url}
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-flex w-fit px-8 py-4 bg-red-500 hover:bg-red-400 text-white font-black rounded-full"
            >
              Grab the Sticker
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Marquee() {
  return (
    <div className="border-y border-white/10 py-4 text-center text-xs font-black tracking-[0.3em] text-white/30">
      NOT FOR EVERYONE • LIMITED DROP • WHILE SUPPLIES LAST •
    </div>
  );
}

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
              className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-5 hover:border-white/20"
            >
              <img
                src={product.image}
                alt={product.name}
                className="h-48 w-full object-contain"
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

function RiskNotice() {
  return (
    <section className="py-8">
      <div className="mx-auto max-w-7xl px-4">
        <div className="rounded-[2rem] border border-yellow-400/15 bg-yellow-500/[0.07] px-6 py-8 text-center">
          <p className="text-[11px] font-black uppercase tracking-[0.34em] text-yellow-200/80">
            Risk Notice
          </p>

          <p className="mt-4 text-yellow-100/85 max-w-4xl mx-auto">
            $MAD is a meme coin and speculative digital asset. Nothing on this
            website is financial advice or a guarantee of returns.
          </p>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/10">
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <h3 className="text-white font-black text-xl">$MAD</h3>
            <p className="text-white/50 mt-3">Limited. Exclusive. Cult.</p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Navigation</h4>
            <div className="space-y-2 text-white/50">
              <Link href="/mad-mind">MAD Mind</Link><br />
              <Link href="/roadmap">Roadmap</Link><br />
              <Link href="/game">Game</Link><br />
              <Link href="/memes">Memes</Link>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Buy</h4>
            <a
              href={LINKS.buy}
              target="_blank"
              rel="noreferrer"
              className="text-white/50"
            >
              Buy on Jupiter
            </a>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Contract</h4>
            <code className="text-xs text-red-400 break-all">{CA}</code>
            <div className="mt-4">
              <CopyButton />
            </div>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-white/10 text-white/40 text-xs">
          © {new Date().getFullYear()} $MAD. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default function MerchPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden">
      <Navbar />

      <main>
        <MerchHero />
        <FeaturedPiece />
        <Marquee />
        <ProductGrid />
        <ApparelTeaser />
        <RiskNotice />
      </main>

      <Footer />
    </div>
  );
}
