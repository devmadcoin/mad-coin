"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import MadConfessions from "./components/MadConfessions";

const ADDR = "Fa7ZE9nCEYnrHsnoeHuhEExJpchtrBtKXnWe6CgHpump";

const LINKS = {
  chartPage: `https://dexscreener.com/solana/${ADDR}`,
  telegram: "https://t.me/MadOfficalChannel",
  x: "https://x.com/devmadcoin",
  tiktok: "https://www.tiktok.com/@devmadcoin",
  coingecko: "https://www.coingecko.com/en/coins/mad-coin",
  birdeye: `https://birdeye.so/token/${ADDR}?chain=solana`,
  jupiter: `https://jup.ag/swap/SOL-${ADDR}`,
  solscan: `https://solscan.io/token/${ADDR}`,
  retailSticker:
    "https://notaveragestickers.com/products/mad-%F0%9F%98%A1-sticker",
  premiumCard:
    "https://notaveragestickers.com/products/mad-%F0%9F%98%A1-premium-embossed-card-wrap",
  richPremiumCard:
    "https://notaveragestickers.com/products/mad-%F0%9F%98%A1-premium-embossed-card-wrap-copy",
  peeker:
    "https://notaveragestickers.com/products/mad-%F0%9F%98%A1-peeker",
} as const;

const ecosystemItems = [
  {
    name: "Dexscreener",
    href: LINKS.chartPage,
    src: "/logos/DEX-screener.png",
    alt: "Dexscreener",
    width: 170,
    height: 50,
    cardClass: "bg-black",
    imageClass: "h-auto w-auto object-contain",
  },
  {
    name: "CoinGecko",
    href: LINKS.coingecko,
    src: "/logos/coingecko.png",
    alt: "CoinGecko",
    width: 170,
    height: 50,
    cardClass: "bg-white",
    imageClass: "h-auto w-auto object-contain",
  },
  {
    name: "Birdeye",
    href: LINKS.birdeye,
    src: "/logos/birdeye.png",
    alt: "Birdeye",
    width: 150,
    height: 44,
    cardClass: "bg-black",
    imageClass: "h-auto w-auto object-contain",
  },
  {
    name: "Jupiter",
    href: LINKS.jupiter,
    src: "/logos/jupiter.png",
    alt: "Jupiter",
    width: 150,
    height: 44,
    cardClass: "bg-black",
    imageClass: "h-auto w-auto object-contain",
  },
  {
    name: "Solscan",
    href: LINKS.solscan,
    src: "/logos/solscan.png",
    alt: "Solscan",
    width: 150,
    height: 44,
    cardClass: "bg-white",
    imageClass: "h-auto w-auto object-contain",
  },
] as const;

const artCards = [
  {
    src: "/stickers/he-sold-pump-it.webp",
    alt: "He Sold Pump It",
    rotate: "-rotate-6",
  },
  {
    src: "/stickers/keep-building.webp",
    alt: "Keep Building",
    rotate: "rotate-6",
  },
  {
    src: "/stickers/never-selling.webp",
    alt: "Never Selling",
    rotate: "-rotate-3",
  },
  {
    src: "/stickers/sticker-smash.webp",
    alt: "Sticker Smash",
    rotate: "rotate-3",
  },
  {
    src: "/stickers/sticker.webp Buy More.webp",
    alt: "Buy More",
    rotate: "-rotate-6",
  },
  {
    src: "/stickers/sticker.webp Buy The Dip.webp",
    alt: "Buy The Dip",
    rotate: "rotate-6",
  },
  {
    src: "/stickers/sticker.webp Raid.webp",
    alt: "Raid",
    rotate: "-rotate-3",
  },
  {
    src: "/stickers/sticker.webp Uno Reverse.webp",
    alt: "Uno Reverse",
    rotate: "rotate-3",
  },
] as const;

function DecorativeArtRow({ index }: { index: number }) {
  const card = artCards[index % artCards.length];

  return (
    <section className="pointer-events-none flex justify-center py-1">
      <div
        className={`relative h-24 w-24 overflow-hidden rounded-[22px] border border-white/8 bg-black/20 shadow-[0_14px_32px_rgba(0,0,0,0.32)] ${card.rotate} sm:h-28 sm:w-28`}
      >
        <Image
          src={card.src}
          alt={card.alt}
          fill
          className="object-contain p-2"
        />
      </div>
    </section>
  );
}

function LuxuryButton({
  href,
  children,
  primary = false,
}: {
  href: string;
  children: React.ReactNode;
  primary?: boolean;
}) {
  return (
    <a
      href={href}
      target={href.startsWith("#") ? undefined : "_blank"}
      rel={href.startsWith("#") ? undefined : "noreferrer"}
      className={
        primary
          ? "rounded-full border border-red-500/25 bg-red-500/8 px-6 py-3 text-sm font-black text-white transition hover:bg-red-500/12"
          : "rounded-full border border-white/10 bg-white/[0.04] px-6 py-3 text-sm font-black text-white/92 transition hover:bg-white/[0.07]"
      }
    >
      {children}
    </a>
  );
}

export default function Home() {
  const [copied, setCopied] = useState(false);
  const [iframeReady, setIframeReady] = useState(false);
  const [momentumVisible, setMomentumVisible] = useState(false);

  const momentumRef = useRef<HTMLElement | null>(null);

  function fallbackCopy(text: string) {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "true");
      ta.style.position = "absolute";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);

      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      // do nothing
    }
  }

  function copyAddr() {
    const text = ADDR;

    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1200);
        })
        .catch(() => {
          fallbackCopy(text);
        });
      return;
    }

    fallbackCopy(text);
  }

  useEffect(() => {
    const el = momentumRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setMomentumVisible(true);
      },
      { threshold: 0.35 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative max-w-full overflow-x-hidden bg-[#050505] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,0,60,0.14),transparent_50%),radial-gradient(circle_at_80%_30%,rgba(255,60,0,0.10),transparent_52%),radial-gradient(circle_at_50%_100%,rgba(255,0,0,0.08),transparent_55%)]" />
      <div className="absolute inset-0 opacity-[0.12] [background:linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:44px_44px]" />
      <div className="absolute inset-0 bg-gradient-to-b from-red-950/10 via-transparent to-black/70" />

      <div className="relative mx-auto max-w-6xl px-4 pb-24 pt-10 sm:px-6 sm:pt-14">
        <section className="relative max-w-full overflow-hidden rounded-[36px] border border-white/10 bg-black/30 px-4 py-10 shadow-[0_24px_90px_rgba(0,0,0,0.42)] backdrop-blur-xl sm:px-8 sm:py-14">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,0,0,0.06),transparent_45%)]" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-500/25 to-transparent" />

          <div className="relative mx-auto max-w-4xl">
            <p className="text-center text-[9px] font-semibold uppercase tracking-[0.24em] text-white/45 sm:text-xs sm:tracking-[0.42em]">
              SOLANA • MEME SIGNAL • CONTROLLED CHAOS
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-5">
              <div className="mad-hero-video-wrap">
                <div className="relative overflow-hidden rounded-2xl border border-red-500/15 bg-black/20 p-2 shadow-[0_0_18px_rgba(255,0,0,0.10)]">
                  <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="h-20 w-auto rounded-xl object-contain sm:h-24"
                  >
                    <source src="/loops/bullish-mad.mp4" type="video/mp4" />
                  </video>
                </div>
              </div>

              <div className="flex w-full justify-center">
                <div className="mad-ticker-stack">
                  <div className="mad-ticker-wrap">
                    <div className="mad-ticker-icon" aria-hidden="true">
                      <span className="mad-ticker-icon-glow" />
                      <Image
                        src="/mad.png"
                        alt="$MAD icon"
                        width={46}
                        height={46}
                        className="relative z-10 h-8 w-8 object-contain sm:h-11 sm:w-11"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                      <span className="mad-fallback-icon relative z-10">😡</span>
                    </div>

                    <div className="mad-wordmark" aria-label="$MAD">
                      <span className="mad-wordmark-base">$MAD</span>
                      <span className="mad-wordmark-glitch mad-wordmark-glitch-a">
                        $MAD
                      </span>
                      <span className="mad-wordmark-glitch mad-wordmark-glitch-b">
                        $MAD
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <p className="mx-auto mt-7 max-w-2xl text-center text-sm leading-7 text-white/65 sm:text-base">
              Stop trading noise. Start being{" "}
              <span className="font-semibold text-red-500">$MAD</span> at
              everything.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <LuxuryButton href="#chart" primary>
                Track Momentum
              </LuxuryButton>
              <LuxuryButton href={LINKS.chartPage}>View Chart</LuxuryButton>
              <LuxuryButton href={LINKS.jupiter}>Buy on Jupiter</LuxuryButton>
            </div>

            <div className="mt-12 flex justify-center">
              <div className="w-full max-w-3xl rounded-[30px] border border-white/10 bg-black/35 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.34)]">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-white/40">
                      Contract
                    </p>
                    <div className="mt-3 break-all rounded-2xl border border-white/10 bg-black/55 px-4 py-3 text-sm text-white/85">
                      {ADDR}
                    </div>
                  </div>

                  <button
                    onClick={copyAddr}
                    className="shrink-0 rounded-full border border-white/10 bg-white/[0.04] px-6 py-3 text-sm font-black text-white transition hover:bg-white/[0.07]"
                  >
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>

                <p className="mt-4 text-center text-xs text-white/38">
                  Not financial advice. Meme energy. Cultural volatility.
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="relative mt-8 overflow-hidden rounded-2xl border border-white/10 bg-black/25 py-3">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-black to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-black to-transparent" />
          <div className="mad-warning-marquee whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.28em] text-red-200/70 sm:text-xs">
            <span className="mx-6">
              HIGH VOLATILITY • MEME CULTURE ONLY • DO NOT RISK MONEY YOU CANNOT
              AFFORD TO LOSE
            </span>
            <span className="mx-6">
              HIGH VOLATILITY • MEME CULTURE ONLY • DO NOT RISK MONEY YOU CANNOT
              AFFORD TO LOSE
            </span>
            <span className="mx-6">
              HIGH VOLATILITY • MEME CULTURE ONLY • DO NOT RISK MONEY YOU CANNOT
              AFFORD TO LOSE
            </span>
          </div>
        </div>

        <div className="mt-10 max-w-full space-y-12">
          <DecorativeArtRow index={0} />

          <section className="rounded-[34px] border border-white/10 bg-black/30 p-6 shadow-[0_18px_60px_rgba(0,0,0,0.34)] backdrop-blur-xl sm:p-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/45">
                Fuel the Fire
              </p>
              <h2 className="mt-3 text-3xl font-black leading-tight sm:text-4xl">
                You&apos;re <span className="text-red-500">$MAD</span>.
                <br />
                Grab Some Merch
              </h2>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-4 sm:gap-10">
              <div className="min-w-0 flex flex-col items-center justify-start">
                <Link
                  href={LINKS.retailSticker}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-block"
                  aria-label="MAD Stickers"
                  title="MAD Stickers"
                >
                  <div className="relative h-[110px] w-[110px] rotate-[-3deg] drop-shadow-[0_18px_38px_rgba(0,0,0,0.45)] transition-all duration-300 group-hover:rotate-0 group-hover:scale-[1.03] sm:h-[160px] sm:w-[160px]">
                    <Image
                      src="/stickers/Mad-Sticker-logo.png"
                      alt="MAD Stickers"
                      fill
                      priority
                      sizes="(max-width: 640px) 110px, 160px"
                      className="object-contain"
                    />
                  </div>
                </Link>

                <Link
                  href={LINKS.retailSticker}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 max-w-full text-center text-sm font-black text-red-500 transition hover:text-red-400 sm:text-base"
                >
                  MAD Stickers →
                </Link>
              </div>

              <div className="min-w-0 flex flex-col items-center justify-start">
                <Link
                  href={LINKS.premiumCard}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-block"
                  aria-label="MAD Premium Card Wrap"
                  title="MAD Premium Card Wrap"
                >
                  <div className="relative h-[110px] w-[110px] rotate-[2deg] drop-shadow-[0_18px_38px_rgba(0,0,0,0.45)] transition-all duration-300 group-hover:rotate-0 group-hover:scale-[1.03] sm:h-[160px] sm:w-[160px]">
                    <Image
                      src="/stickers/Mad-Premium-Embossed-Card-Wrap.png"
                      alt="MAD Premium Card Wrap"
                      fill
                      priority
                      sizes="(max-width: 640px) 110px, 160px"
                      className="object-contain"
                    />
                  </div>
                </Link>

                <Link
                  href={LINKS.premiumCard}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 max-w-full text-center text-sm font-black text-red-500 transition hover:text-red-400 sm:text-base"
                >
                  Card Wrap →
                </Link>
              </div>

              <div className="min-w-0 flex flex-col items-center justify-start">
                <Link
                  href={LINKS.richPremiumCard}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-block"
                  aria-label="MAD Rich Card Wrap"
                  title="MAD Rich Card Wrap"
                >
                  <div className="relative h-[110px] w-[110px] rotate-[-2deg] drop-shadow-[0_18px_38px_rgba(0,0,0,0.45)] transition-all duration-300 group-hover:rotate-0 group-hover:scale-[1.03] sm:h-[160px] sm:w-[160px]">
                    <Image
                      src="/stickers/Mad-Rich-Premium-Embossed-Card-Wrap.png"
                      alt="MAD Rich Card Wrap"
                      fill
                      priority
                      sizes="(max-width: 640px) 110px, 160px"
                      className="object-contain"
                    />
                  </div>
                </Link>

                <Link
                  href={LINKS.richPremiumCard}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 max-w-full text-center text-sm font-black text-red-500 transition hover:text-red-400 sm:text-base"
                >
                  Rich Wrap →
                </Link>
              </div>

              <div className="min-w-0 flex flex-col items-center justify-start">
                <Link
                  href={LINKS.peeker}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-block"
                  aria-label="MAD Peeker"
                  title="MAD Peeker"
                >
                  <div className="relative h-[110px] w-[110px] rotate-[2deg] drop-shadow-[0_18px_38px_rgba(0,0,0,0.45)] transition-all duration-300 group-hover:rotate-0 group-hover:scale-[1.03] sm:h-[160px] sm:w-[160px]">
                    <Image
                      src="/stickers/Mad-Peeker.png"
                      alt="MAD Peeker"
                      fill
                      priority
                      sizes="(max-width: 640px) 110px, 160px"
                      className="object-contain"
                    />
                  </div>
                </Link>

                <Link
                  href={LINKS.peeker}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 max-w-full text-center text-sm font-black text-red-500 transition hover:text-red-400 sm:text-base"
                >
                  Peeker →
                </Link>
              </div>
            </div>
          </section>

          <DecorativeArtRow index={1} />

          <section
            id="chart"
            ref={momentumRef}
            className="scroll-mt-24 rounded-[34px] border border-white/10 bg-black/30 p-6 shadow-[0_18px_60px_rgba(0,0,0,0.34)] backdrop-blur-xl sm:p-8"
          >
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/50">
                  Live Chart
                </p>

                <h2 className="mt-3 text-3xl font-black sm:text-4xl">
                  Track{" "}
                  <span
                    className={`transition-colors duration-700 ${
                      momentumVisible
                        ? "text-red-500 drop-shadow-[0_0_8px_rgba(255,0,0,0.45)]"
                        : "text-white"
                    }`}
                  >
                    Momentum
                  </span>
                </h2>

                <p className="mt-2 text-white/60">
                  A live view of price action — inside the site.
                </p>
              </div>

              <LuxuryButton href={LINKS.chartPage}>
                Open on Dexscreener →
              </LuxuryButton>
            </div>

            <div className="mt-6 overflow-hidden rounded-[28px] border border-white/10 bg-black/40 shadow-[0_18px_50px_rgba(0,0,0,0.32)]">
              <div className="relative h-[520px] w-full sm:h-[620px]">
                {!iframeReady && (
                  <div className="absolute inset-0 grid place-items-center">
                    <div className="rounded-2xl border border-white/10 bg-black/50 px-4 py-2 text-sm text-white/70">
                      Loading chart…
                    </div>
                  </div>
                )}

                <iframe
                  className="absolute inset-0 h-full w-full"
                  src={`https://dexscreener.com/solana/${ADDR}?embed=1&theme=dark&trades=0&info=0`}
                  title="$MAD Dexscreener Chart"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  allow="clipboard-write; fullscreen"
                  onLoad={() => setIframeReady(true)}
                />
              </div>
            </div>
          </section>

          <section className="overflow-hidden rounded-[34px] border border-white/10 bg-black/25 py-7 shadow-[0_18px_60px_rgba(0,0,0,0.34)] backdrop-blur-xl">
            <div className="mb-4 text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-white/40">
                Where $MAD Lives
              </p>
            </div>

            <div className="sm:hidden">
              <div className="flex gap-4 overflow-x-auto px-4 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {ecosystemItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Open ${item.name}`}
                    title={item.name}
                    className={`flex h-12 shrink-0 items-center rounded-2xl border border-white/10 px-4 shadow-lg ${item.cardClass}`}
                  >
                    <Image
                      src={item.src}
                      alt={item.alt}
                      width={item.width}
                      height={item.height}
                      className="h-auto w-auto object-contain"
                    />
                  </a>
                ))}
              </div>
            </div>

            <div className="relative hidden overflow-hidden sm:block">
              <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-black/90 to-transparent" />
              <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-black/90 to-transparent" />

              <div className="logo-marquee flex w-max items-center gap-8 px-2 lg:gap-12">
                {[...Array(4)].map((_, i) => (
                  <React.Fragment key={i}>
                    {ecosystemItems.map((item) => (
                      <a
                        key={`${item.name}-${i}`}
                        href={item.href}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`Open ${item.name}`}
                        title={item.name}
                        className={`group flex h-14 items-center rounded-2xl border border-white/10 px-5 shadow-lg transition-transform duration-300 hover:scale-[1.02] lg:h-16 lg:px-6 ${item.cardClass}`}
                      >
                        <Image
                          src={item.src}
                          alt={item.alt}
                          width={item.width}
                          height={item.height}
                          className={item.imageClass}
                        />
                      </a>
                    ))}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </section>

          <DecorativeArtRow index={2} />

          <MadConfessions />

          <DecorativeArtRow index={3} />

          <section className="rounded-[34px] border border-white/10 bg-black/30 p-6 shadow-[0_18px_60px_rgba(0,0,0,0.34)] backdrop-blur-xl sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/50">
              Signal
            </p>
            <h3 className="mt-3 text-2xl font-black sm:text-3xl">
              No guarantees.
              <br />
              No promises.
            </h3>
            <p className="mt-3 max-w-md text-white/65">
              Only what people decide it becomes.
            </p>
          </section>
        </div>

        <footer className="mt-16 border-t border-white/10 pt-8 text-center">
          <p className="mx-auto max-w-3xl text-xs leading-7 text-white/45 sm:text-sm sm:leading-8">
            $MAD is not about value.
            <br />
            It’s about belief.
            <br />
            <br />
            That’s why you stop trading…
            <br />
            and start being{" "}
            <span className="font-semibold text-red-500 drop-shadow-[0_0_8px_rgba(255,0,0,0.35)]">
              $MAD
            </span>{" "}
            at everything.
            <br />
            <br />
            No guarantees. No promises.
            <br />
            Only what people decide it becomes.
            <br />
            <br />
            Do not risk money you cannot afford to lose.
            <br />
            <br />
            © 2026 $MAD // Built on Solana
          </p>
        </footer>
      </div>

      <style jsx>{`
        .mad-ticker-stack {
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          max-width: 100%;
        }

        .mad-hero-video-wrap {
          display: flex;
          justify-content: center;
          width: 100%;
        }

        .mad-ticker-wrap {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.7rem;
          width: min(100%, 720px);
          max-width: 100%;
          padding: 1.2rem 1rem 1.05rem;
          border-radius: 1.65rem;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background:
            linear-gradient(
              180deg,
              rgba(255, 255, 255, 0.02),
              rgba(255, 255, 255, 0.008)
            ),
            rgba(0, 0, 0, 0.38);
          box-shadow:
            0 16px 50px rgba(0, 0, 0, 0.32),
            inset 0 1px 0 rgba(255, 255, 255, 0.03);
          overflow: hidden;
        }

        .mad-ticker-icon {
          position: relative;
          display: grid;
          place-items: center;
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 999px;
          flex-shrink: 0;
        }

        .mad-ticker-icon-glow {
          position: absolute;
          inset: 0;
          border-radius: 999px;
          background: radial-gradient(
            circle,
            rgba(255, 59, 48, 0.20),
            transparent 70%
          );
          filter: blur(8px);
          animation: madPulseGlow 2.8s ease-in-out infinite;
        }

        .mad-fallback-icon {
          display: none;
          font-size: 1.5rem;
          line-height: 1;
        }

        .mad-ticker-icon img[style*="display: none"] + .mad-fallback-icon,
        .mad-ticker-icon :global(img[style*="display: none"]) ~
          .mad-fallback-icon {
          display: inline-block;
        }

        .mad-wordmark {
          position: relative;
          display: inline-block;
          font-weight: 900;
          letter-spacing: 0.03em;
          line-height: 0.95;
          font-size: clamp(2.2rem, 14vw, 5.8rem);
          color: #f8f7f3;
          text-transform: uppercase;
          text-shadow:
            0 1px 0 rgba(255, 255, 255, 0.12),
            0 0 12px rgba(255, 255, 255, 0.05),
            0 0 18px rgba(255, 59, 48, 0.08);
          word-break: keep-all;
          white-space: nowrap;
        }

        .mad-wordmark-base {
          position: relative;
          z-index: 2;
          animation: madGlitchBase 7s infinite steps(1, end);
        }

        .mad-wordmark-glitch {
          position: absolute;
          inset: 0;
          opacity: 0;
          pointer-events: none;
          z-index: 1;
        }

        .mad-wordmark-glitch-a {
          color: rgba(255, 59, 48, 0.45);
          transform: translate(0, 0);
          animation: madGlitchRed 7s infinite steps(1, end);
        }

        .mad-wordmark-glitch-b {
          color: rgba(95, 188, 255, 0.30);
          transform: translate(0, 0);
          animation: madGlitchBlue 7s infinite steps(1, end);
        }

        .mad-warning-marquee {
          display: inline-block;
          min-width: 100%;
          animation: madMarquee 22s linear infinite;
        }

        @keyframes madPulseGlow {
          0%,
          100% {
            transform: scale(0.96);
            opacity: 0.65;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.9;
          }
        }

        @keyframes madGlitchBase {
          0%,
          87%,
          100% {
            transform: translate(0, 0);
            filter: none;
          }
          88% {
            transform: translate(-1px, 0);
          }
          89% {
            transform: translate(1px, 0);
          }
          90% {
            transform: translate(0, 0);
          }
          96% {
            transform: translate(0, 0);
          }
          97% {
            transform: translate(-2px, 1px);
          }
          98% {
            transform: translate(1px, -1px);
          }
          99% {
            transform: translate(0, 0);
          }
        }

        @keyframes madGlitchRed {
          0%,
          87%,
          100% {
            opacity: 0;
            transform: translate(0, 0);
          }
          88% {
            opacity: 1;
            transform: translate(3px, 0);
          }
          89% {
            opacity: 1;
            transform: translate(-2px, 0);
          }
          90%,
          96% {
            opacity: 0;
            transform: translate(0, 0);
          }
          97% {
            opacity: 1;
            transform: translate(-3px, 1px);
          }
          98% {
            opacity: 1;
            transform: translate(2px, -1px);
          }
          99%,
          100% {
            opacity: 0;
            transform: translate(0, 0);
          }
        }

        @keyframes madGlitchBlue {
          0%,
          87%,
          100% {
            opacity: 0;
            transform: translate(0, 0);
          }
          88% {
            opacity: 1;
            transform: translate(-3px, 0);
          }
          89% {
            opacity: 1;
            transform: translate(2px, 0);
          }
          90%,
          96% {
            opacity: 0;
            transform: translate(0, 0);
          }
          97% {
            opacity: 1;
            transform: translate(3px, -1px);
          }
          98% {
            opacity: 1;
            transform: translate(-2px, 1px);
          }
          99%,
          100% {
            opacity: 0;
            transform: translate(0, 0);
          }
        }

        @keyframes madMarquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }

        @media (max-width: 640px) {
          .mad-ticker-wrap {
            gap: 0.5rem;
            width: 100%;
            padding: 1rem 0.85rem 0.9rem;
            border-radius: 1.3rem;
          }

          .mad-ticker-icon {
            width: 2rem;
            height: 2rem;
          }

          .mad-fallback-icon {
            font-size: 1.15rem;
          }

          .mad-wordmark {
            font-size: clamp(1.85rem, 13vw, 3.1rem);
            letter-spacing: 0.02em;
          }
        }
      `}</style>
    </div>
  );
}
