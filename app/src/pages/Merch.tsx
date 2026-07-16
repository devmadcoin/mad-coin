import { useState, useEffect } from "react";
import { PRODUCTS, FEATURED } from "@/lib/pages-data";
import { cn } from "@/lib/utils";

/* ─── Live Ticker ─── */
function LiveTicker() {
  const [stats, setStats] = useState<{ price: string; change: string; mcap: string } | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch(
          "https://api.dexscreener.com/latest/dex/tokens/Fa7ZE9nCEYnrHsnoeHuhEExJpchtrBtKXnWe6CgHpump",
        );
        const data = await res.json();
        const pair = data.pairs?.[0];
        if (pair) {
          setStats({
            price: pair.priceUsd ? `$${parseFloat(pair.priceUsd).toFixed(8)}` : "—",
            change: pair.priceChange?.h24 ? `${pair.priceChange.h24 > 0 ? "+" : ""}${pair.priceChange.h24}%` : "—",
            mcap: pair.marketCap ? `$${(pair.marketCap / 1000).toFixed(1)}K` : "—",
          });
        }
      } catch {
        /* ignore */
      }
    }
    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  if (!stats) return null;

  const items = [
    { label: "PRICE", value: stats.price },
    { label: "24H", value: stats.change, color: stats.change.startsWith("+") ? "text-green-400" : stats.change.startsWith("-") ? "text-mad-bright" : "text-ash" },
    { label: "MCAP", value: stats.mcap },
  ];

  return (
    <div className="fixed inset-x-0 top-0 z-[60] border-b border-white/10 bg-ink/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 overflow-x-auto px-4 py-2">
        <div className="flex min-w-max items-center gap-6">
          <span className="shrink-0 font-mono text-[10px] font-bold uppercase tracking-widest text-ash">
            $MAD Live
          </span>
          {items.map((item) => (
            <div key={item.label} className="flex shrink-0 items-center gap-1.5">
              <span className="font-mono text-[10px] font-bold uppercase text-ash/40">{item.label}</span>
              <span className={cn("font-mono text-xs font-black", item.color || "text-bone")}>
                {item.value}
              </span>
            </div>
          ))}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mad opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-mad" />
          </span>
          <span className="font-mono text-[10px] font-bold text-ash">LIVE</span>
        </div>
      </div>
    </div>
  );
}

/* ─── Star Rating ─── */
function StarRating({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => {
        const filled = i + 1 <= count;
        return (
          <svg
            key={i}
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill={filled ? "#C5A572" : "white"}
            className={filled ? "drop-shadow-[0_0_1px_rgba(197,165,114,0.4)]" : "opacity-15"}
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        );
      })}
    </div>
  );
}

/* ─── Stock Badge ─── */
function StockBadge({ tone, children }: { tone: "green" | "yellow" | "red"; children: React.ReactNode }) {
  const map = {
    green: "border-green-400/25 bg-green-400/10 text-green-400",
    yellow: "border-amber-400/25 bg-amber-400/10 text-amber-400",
    red: "border-mad/25 bg-mad/10 text-mad-bright",
  };
  return (
    <span className={cn("rounded-full border px-3 py-1 font-mono text-[10px] font-black uppercase tracking-[0.2em]", map[tone])}>
      {children}
    </span>
  );
}

/* ─── Hero ─── */
function MerchHero() {
  return (
    <section className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden">
      <img
        src="/assets/merch/hero/merch-hero-bg.jpg"
        alt="$MAD merch"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-ink" />
      <div className="relative z-10 mx-auto max-w-7xl px-4 text-center">
        <span className="inline-flex rounded-full border border-mad/30 bg-mad/10 px-4 py-1.5 font-mono text-[11px] font-black uppercase tracking-[0.25em] text-mad backdrop-blur-sm">
          Drop 001 — Limited
        </span>
        <h1 className="mt-6 font-display text-5xl uppercase leading-[0.9] text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.5)] sm:text-7xl lg:text-8xl">
          DON&apos;T JUST
          <br />
          HOLD <span className="text-mad">$MAD</span>.
        </h1>
        <p className="mt-4 font-display text-3xl uppercase text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.5)] sm:text-5xl lg:text-6xl">
          WEAR IT.
        </p>
        <p className="mx-auto mt-6 max-w-xl text-white/60 drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]">
          Stickers, wraps, and signal pieces for the people carrying the brand into real life.
        </p>
        <div className="mt-10 flex justify-center">
          <a
            href="#products"
            className="rounded-full bg-mad px-8 py-4 font-black text-white transition-all hover:scale-[1.02] hover:bg-mad-bright shadow-glow"
          >
            Shop the Drop
          </a>
        </div>
      </div>
    </section>
  );
}

/* ─── Legacy Drop ─── */
function LegacyDrop() {
  return (
    <section className="py-12">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid overflow-hidden rounded-3xl border border-white/5 bg-panel lg:grid-cols-2">
          <div className="flex items-center justify-center bg-black/40 p-8">
            <img
              src="/assets/merch/mad-limited-001-hat.png"
              alt="MAD // LIMITED 001 Hat"
              className="max-h-72 object-contain"
            />
          </div>
          <div className="flex flex-col justify-center p-8 sm:p-12">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <span className="text-xs text-ash">Drop 001 — Legacy</span>
              <span className="animate-pulse rounded-full border border-mad/40 bg-mad/15 px-4 py-1.5 font-mono text-xs font-black uppercase tracking-[0.2em] text-mad shadow-glow-sm">
                SOLD OUT FOREVER
              </span>
            </div>
            <h2 className="font-display text-4xl font-black leading-tight text-bone">
              MAD // <span className="text-mad">LIMITED 001</span>
            </h2>
            <p className="mt-2 font-display text-lg font-black text-ash">$mad America dad hat</p>
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-mad" />
                <p className="text-sm text-ash">
                  Only <span className="font-black text-bone">26</span> ever made. No restocks. No reprints.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-mad" />
                <p className="text-sm text-ash">
                  Every buyer received <span className="font-black text-bone">1,000,000 $MAD</span> tokens each.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-mad" />
                <p className="text-sm text-ash">
                  This will <span className="font-black text-bone">never happen again</span>.
                </p>
              </div>
            </div>
            <div className="mt-8 rounded-2xl border border-mad/15 bg-mad/[0.03] p-5">
              <p className="text-xs leading-relaxed text-ash">
                The hat that started the legend. If you own one, you are one of the 26. If you missed
                it, you missed the most exclusive $MAD drop in history.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Featured Piece ─── */
function FeaturedPiece() {
  return (
    <section className="py-12">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid overflow-hidden rounded-3xl border border-white/5 bg-panel lg:grid-cols-2">
          <div className="flex items-center justify-center p-8">
            <img src={FEATURED.image} alt={FEATURED.name} className="max-h-80 object-contain" />
          </div>
          <div className="flex flex-col justify-center p-8 sm:p-12">
            <div className="mb-4 flex gap-3">
              <span className="text-xs text-ash">{FEATURED.tag}</span>
              <StockBadge tone={FEATURED.stockTone}>{FEATURED.stock}</StockBadge>
            </div>
            <h2 className="font-display text-4xl font-black text-bone">{FEATURED.name}</h2>
            <p className="mt-2 font-display text-3xl font-black text-mad">{FEATURED.price}</p>
            <p className="mt-4 max-w-md text-ash">{FEATURED.featuredText}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={FEATURED.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-fit rounded-full bg-mad px-8 py-4 font-black text-white transition-all hover:scale-[1.02] hover:bg-mad-bright shadow-glow"
              >
                Grab the Sticker
              </a>
              <a
                href="#proof"
                className="inline-flex w-fit rounded-full border border-white/10 px-6 py-4 text-sm font-bold text-bone transition-all hover:bg-white/[0.03]"
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

/* ─── Marquee ─── */
function Marquee() {
  const text = "NOT FOR EVERYONE • LIMITED DROP • WHILE SUPPLIES LAST • ";
  return (
    <div className="overflow-hidden border-y border-white/5 bg-panel py-4">
      <div className="flex w-max animate-marquee-slow items-center whitespace-nowrap">
        {[0, 1].map((half) => (
          <div key={half} className="flex items-center gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <span key={i} className="mx-4 font-mono text-xs font-black uppercase tracking-[0.3em] text-ash">
                {text}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Product Grid ─── */
function ProductGrid() {
  return (
    <section id="products" className="py-16">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="mb-10 font-display text-4xl font-black text-bone">
          The <span className="text-mad">$MAD</span> Drop.
        </h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PRODUCTS.map((product) => (
            <a
              key={product.id}
              href={product.url}
              target="_blank"
              rel="noreferrer"
              className="group rounded-3xl border border-white/5 bg-panel p-5 transition-all hover:border-white/10 hover:bg-white/[0.02]"
            >
              <img
                src={product.image}
                alt={product.name}
                className="h-48 w-full object-contain transition-transform duration-300 group-hover:scale-105"
              />
              <div className="mt-5 flex items-center justify-between">
                <span className="text-xs text-ash">{product.tier}</span>
                <StockBadge tone={product.stockTone}>{product.stock}</StockBadge>
              </div>
              <div className="mt-3">
                <StarRating count={product.stars} />
              </div>
              <h3 className="mt-3 font-display text-xl font-black text-bone">{product.name}</h3>
              <p className="mt-2 font-display text-2xl font-black text-bone">{product.price}</p>
              <p className="mt-2 text-sm text-ash">{product.desc}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Proof Grid ─── */
function ProofGrid() {
  const proofImages = [
    { src: "/assets/proof/mad-sticker-1.png", alt: "Sticker on laptop", caption: "Got my sticker. Laptop game strong." },
    { src: "/assets/proof/mad-sticker-2.png", alt: "Sticker on water bottle", caption: "Hydrated and $MAD." },
    { src: "/assets/proof/mad-sticker-3.png", alt: "Sticker on phone case", caption: "Mobile $MAD energy." },
  ];

  return (
    <section id="proof" className="py-8">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-8 text-center">
          <span className="rounded-full border border-mad/20 bg-mad/10 px-4 py-1.5 font-mono text-[11px] font-black uppercase tracking-[0.25em] text-mad">
            Verified Holders
          </span>
          <h2 className="mt-4 font-display text-2xl font-black text-bone sm:text-3xl">
            Real People. Real <span className="text-mad">$MAD</span> Stickers.
          </h2>
          <p className="mt-2 text-sm text-ash">Community submitted proof. Not paid actors.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {proofImages.map((item, i) => (
            <div
              key={i}
              className="group overflow-hidden rounded-3xl border border-white/5 bg-panel transition-all hover:border-white/10"
            >
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={item.src}
                  alt={item.alt}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute left-4 top-4">
                  <span className="rounded-full border border-mad/20 bg-mad/15 px-3 py-1 font-mono text-[10px] font-black uppercase tracking-[0.2em] text-mad">
                    Proof #{String(i + 1).padStart(2, "0")}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <p className="font-display text-lg font-black text-bone">{item.caption}</p>
                <p className="mt-1 text-xs text-ash">{item.alt}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Video Grid ─── */
function VideoGrid() {
  const videos = [
    {
      src: "https://www.youtube.com/embed/s-eE7s_bGoc?rel=0&modestbranding=1",
      title: "$MAD Customer Sticker Video",
      label: "Customer Love",
      heading: "Real People. Real $MAD Energy.",
      caption: "Watch the $MAD sticker in action. #madrichenergy",
    },
    {
      src: "https://www.youtube.com/embed/osW5w0b2Lp4?rel=0&modestbranding=1",
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
          <span className="rounded-full border border-mad/20 bg-mad/10 px-4 py-1.5 font-mono text-[11px] font-black uppercase tracking-[0.25em] text-mad">
            Customer Proof
          </span>
          <h2 className="mt-4 font-display text-2xl font-black text-bone sm:text-3xl">
            Real <span className="text-mad">$MAD</span> Energy In Action.
          </h2>
        </div>
        <div className="grid gap-5 lg:grid-cols-2">
          {videos.map((video, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-3xl border border-white/5 bg-panel shadow-[0_20px_60px_rgba(0,0,0,0.3)]"
            >
              <div className="relative aspect-video w-full">
                <iframe
                  src={video.src}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full"
                />
              </div>
              <div className="p-5 text-center">
                <span className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-mad">
                  {video.label}
                </span>
                <p className="mt-2 font-display text-lg font-black text-bone">{video.heading}</p>
                <p className="mt-1 text-sm text-ash">{video.caption}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Risk Notice ─── */
function RiskNotice() {
  return (
    <section className="py-8">
      <div className="mx-auto max-w-7xl px-4">
        <div className="rounded-3xl border border-mad/15 bg-mad/[0.03] px-6 py-8 text-center">
          <p className="font-mono text-[11px] font-black uppercase tracking-[0.34em] text-mad/70">
            Risk Notice
          </p>
          <p className="mx-auto mt-4 max-w-4xl text-sm text-ash">
            $MAD is a meme coin and speculative digital asset. Nothing on this website is financial
            advice or a guarantee of returns. Crypto is risky and volatile. Never risk money you
            cannot afford to lose. Always do your own research.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ─── Main Page ─── */
export default function Merch() {
  return (
    <>
      <LiveTicker />
      <MerchHero />
      <div className="mx-auto max-w-7xl px-4 pb-24 pt-12 sm:px-6 lg:px-8">
        <LegacyDrop />
        <FeaturedPiece />
        <Marquee />
        <ProductGrid />
        <ProofGrid />
        <VideoGrid />
        <RiskNotice />
      </div>
    </>
  );
}
