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
    <div className="relative overflow-hidden bg-[#050505] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,0,60,0.20),transparent_50%),radial-gradient(circle_at_80%_30%,rgba(255,60,0,0.16),transparent_52%),radial-gradient(circle_at_50%_100%,rgba(255,0,0,0.12),transparent_55%)]" />
      <div className="absolute inset-0 opacity-20 [background:linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:44px_44px]" />
      <div className="absolute inset-0 bg-gradient-to-b from-red-950/10 via-transparent to-black/70" />

      <div className="relative mx-auto max-w-6xl px-4 pb-24 pt-10 sm:px-6 sm:pt-14">
        <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-black/35 px-5 py-10 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:px-8 sm:py-14">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,0,0,0.10),transparent_45%)]" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-500/40 to-transparent" />

          <div className="relative mx-auto max-w-4xl">
            <p className="text-center text-[10px] font-semibold uppercase tracking-[0.42em] text-white/45 sm:text-xs">
              SOLANA • MEME SIGNAL • CONTROLLED CHAOS
            </p>

            <div className="mt-8 flex justify-center">
              <div className="mad-ticker-wrap">
                <div className="mad-ticker-icon" aria-hidden="true">
                  <span className="mad-ticker-icon-glow" />
                  <Image
                    src="/icons/mad-icon.png"
                    alt="$MAD icon"
                    width={46}
                    height={46}
                    className="relative z-10 h-9 w-9 object-contain sm:h-11 sm:w-11"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                  <span className="mad-fallback-flame relative z-10">🔥</span>
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

            <p className="mx-auto mt-6 max-w-2xl text-center text-sm leading-7 text-white/65 sm:text-base">
              Stop trading noise. Start being <span className="text-red-500 font-semibold">$MAD</span> at everything.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <a
                href="#chart"
                className="rounded-full border border-red-500/20 bg-red-500/10 px-6 py-3 text-sm font-black text-white transition hover:bg-red-500/15"
              >
                Track Momentum
              </a>

              <a
                href={LINKS.chartPage}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-black text-white/90 transition hover:bg-white/10 hover:text-white"
              >
                View Chart
              </a>

              <a
                href={LINKS.jupiter}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-black text-white/90 transition hover:bg-white/10 hover:text-white"
              >
                Buy on Jupiter
              </a>
            </div>

            <div className="mt-10 flex justify-center">
              <div className="w-full max-w-3xl rounded-3xl border border-white/10 bg-black/45 p-5 shadow-2xl">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-white/40">
                      Contract
                    </p>
                    <div className="mt-3 break-all rounded-2xl border border-white/10 bg-black/60 px-4 py-3 text-sm text-white/85">
                      {ADDR}
                    </div>
                  </div>

                  <button
                    onClick={copyAddr}
                    className="shrink-0 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-black text-white transition hover:bg-white/10"
                  >
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>

                <p className="mt-4 text-center text-xs text-white/40">
                  Not financial advice. Meme energy. Cultural volatility.
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="relative mt-8 overflow-hidden rounded-2xl border border-white/10 bg-black/30 py-3">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-black to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-black to-transparent" />
          <div className="mad-warning-marquee whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.28em] text-red-200/80 sm:text-xs">
            <span className="mx-6">
              HIGH VOLATILITY • MEME CULTURE ONLY • DO NOT RISK MONEY YOU CANNOT AFFORD TO LOSE
            </span>
            <span className="mx-6">
              HIGH VOLATILITY • MEME CULTURE ONLY • DO NOT RISK MONEY YOU CANNOT AFFORD TO LOSE
            </span>
            <span className="mx-6">
              HIGH VOLATILITY • MEME CULTURE ONLY • DO NOT RISK MONEY YOU CANNOT AFFORD TO LOSE
            </span>
          </div>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div className="space-y-10">
            <section className="rounded-3xl border border-white/10 bg-black/30 p-5 shadow-2xl backdrop-blur-xl sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/45">
                    Fuel the Fire
                  </p>
                  <h2 className="mt-2 text-2xl font-black sm:text-3xl">
                    Enter the <span className="text-red-500">$MAD</span> Ecosystem
                  </h2>
                </div>

                <div className="hidden sm:block">
                  <div className="relative overflow-hidden rounded-2xl border border-red-500/20 bg-black/30 p-2 shadow-[0_0_25px_rgba(255,0,0,0.15)]">
                    <video
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="h-16 w-auto rounded-xl object-contain"
                    >
                      <source src="/loops/bullish-mad.mp4" type="video/mp4" />
                    </video>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-4 sm:gap-8">
                <div className="flex flex-col items-center justify-start">
                  <Link
                    href={LINKS.retailSticker}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-block"
                    aria-label="MAD Stickers"
                    title="MAD Stickers"
                  >
                    <div className="relative h-[120px] w-[120px] rotate-[-4deg] transition-all duration-300 group-hover:rotate-0 group-hover:scale-105 group-hover:drop-shadow-[0_0_20px_rgba(255,0,0,0.45)] drop-shadow-[0_18px_38px_rgba(0,0,0,0.55)] sm:h-[140px] sm:w-[140px]">
                      <Image
                        src="/stickers/Mad-Sticker-logo.png"
                        alt="MAD Stickers"
                        fill
                        priority
                        sizes="(max-width: 640px) 120px, 140px"
                        className="object-contain"
                      />
                    </div>
                  </Link>

                  <Link
                    href={LINKS.retailSticker}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 text-center text-sm font-black text-red-500 transition hover:text-red-400 drop-shadow-[0_0_14px_rgba(255,0,0,0.8)] sm:text-base"
                  >
                    MAD Stickers →
                  </Link>
                </div>

                <div className="flex flex-col items-center justify-start">
                  <Link
                    href={LINKS.premiumCard}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-block"
                    aria-label="MAD Premium Card Wrap"
                    title="MAD Premium Card Wrap"
                  >
                    <div className="relative h-[120px] w-[120px] rotate-[3deg] transition-all duration-300 group-hover:rotate-0 group-hover:scale-105 group-hover:drop-shadow-[0_0_20px_rgba(255,0,0,0.45)] drop-shadow-[0_18px_38px_rgba(0,0,0,0.55)] sm:h-[140px] sm:w-[140px]">
                      <Image
                        src="/stickers/Mad-Premium-Embossed-Card-Wrap.png"
                        alt="MAD Premium Card Wrap"
                        fill
                        priority
                        sizes="(max-width: 640px) 120px, 140px"
                        className="object-contain"
                      />
                    </div>
                  </Link>

                  <Link
                    href={LINKS.premiumCard}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 text-center text-sm font-black text-red-500 transition hover:text-red-400 drop-shadow-[0_0_14px_rgba(255,0,0,0.8)] sm:text-base"
                  >
                    Card Wrap →
                  </Link>
                </div>

                <div className="flex flex-col items-center justify-start">
                  <Link
                    href={LINKS.richPremiumCard}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-block"
                    aria-label="MAD Rich Card Wrap"
                    title="MAD Rich Card Wrap"
                  >
                    <div className="relative h-[120px] w-[120px] rotate-[-3deg] transition-all duration-300 group-hover:rotate-0 group-hover:scale-105 group-hover:drop-shadow-[0_0_20px_rgba(255,0,0,0.45)] drop-shadow-[0_18px_38px_rgba(0,0,0,0.55)] sm:h-[140px] sm:w-[140px]">
                      <Image
                        src="/stickers/Mad-Rich-Premium-Embossed-Card-Wrap.png"
                        alt="MAD Rich Card Wrap"
                        fill
                        priority
                        sizes="(max-width: 640px) 120px, 140px"
                        className="object-contain"
                      />
                    </div>
                  </Link>

                  <Link
                    href={LINKS.richPremiumCard}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 text-center text-sm font-black text-red-500 transition hover:text-red-400 drop-shadow-[0_0_14px_rgba(255,0,0,0.8)] sm:text-base"
                  >
                    Rich Wrap →
                  </Link>
                </div>

                <div className="flex flex-col items-center justify-start">
                  <Link
                    href={LINKS.peeker}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-block"
                    aria-label="MAD Peeker"
                    title="MAD Peeker"
                  >
                    <div className="relative h-[120px] w-[120px] rotate-[2deg] transition-all duration-300 group-hover:rotate-0 group-hover:scale-105 group-hover:drop-shadow-[0_0_20px_rgba(255,0,0,0.45)] drop-shadow-[0_18px_38px_rgba(0,0,0,0.55)] sm:h-[140px] sm:w-[140px]">
                      <Image
                        src="/stickers/Mad-Peeker.png"
                        alt="MAD Peeker"
                        fill
                        priority
                        sizes="(max-width: 640px) 120px, 140px"
                        className="object-contain"
                      />
                    </div>
                  </Link>

                  <Link
                    href={LINKS.peeker}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 text-center text-sm font-black text-red-500 transition hover:text-red-400 drop-shadow-[0_0_14px_rgba(255,0,0,0.8)] sm:text-base"
                  >
                    Peeker →
                  </Link>
                </div>
              </div>
            </section>

            <section className="overflow-hidden rounded-3xl border border-white/10 bg-black/25 py-6 shadow-2xl backdrop-blur-xl">
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
                          className={`group flex h-14 items-center rounded-2xl border border-white/10 px-5 shadow-lg transition-transform duration-300 hover:scale-105 lg:h-16 lg:px-6 ${item.cardClass}`}
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

            <MadConfessions />
          </div>

          <div className="space-y-10">
            <section
              id="chart"
              ref={momentumRef}
              className="scroll-mt-24 rounded-3xl border border-white/10 bg-black/30 p-5 shadow-2xl backdrop-blur-xl sm:p-6"
            >
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/50">
                    Live Chart
                  </p>

                  <h2 className="mt-2 text-3xl font-black sm:text-4xl">
                    Track{" "}
                    <span
                      className={`transition-colors duration-700 ${
                        momentumVisible
                          ? "text-red-500 drop-shadow-[0_0_12px_rgba(255,0,0,0.7)]"
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

                <a
                  href={LINKS.chartPage}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm font-semibold text-white/90 transition hover:bg-white/10 hover:text-white"
                >
                  Open on Dexscreener →
                </a>
              </div>

              <div className="mt-6 overflow-hidden rounded-3xl border border-white/10 bg-black/40 shadow-2xl">
                <div className="relative aspect-[16/10] w-full sm:aspect-[16/9]">
                  {!iframeReady && (
                    <div className="absolute inset-0 grid place-items-center">
                      <div className="rounded-2xl border border-white/10 bg-black/50 px-4 py-2 text-sm text-white/70">
                        Loading chart…
                      </div>
                    </div>
                  )}

                  <iframe
                    className="absolute inset-0 h-full w-full"
                    src={`https://dexscreener.com/solana/${ADDR}?embed=1&theme=dark`}
                    title="$MAD Dexscreener Chart"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    allow="clipboard-write; fullscreen"
                    onLoad={() => setIframeReady(true)}
                  />
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-white/10 bg-black/30 p-5 shadow-2xl backdrop-blur-xl sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/50">
                Signal
              </p>
              <h3 className="mt-2 text-2xl font-black sm:text-3xl">
                No guarantees.
                <br />
                No promises.
              </h3>
              <p className="mt-3 max-w-md text-white/65">
                Only what people decide it becomes.
              </p>
            </section>
          </div>
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
            <span className="font-semibold text-red-500 drop-shadow-[0_0_12px_rgba(255,0,0,0.45)]">
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
        .mad-ticker-wrap {
          display: inline-flex;
          align-items: center;
          gap: 0.9rem;
          padding: 0.9rem 1.1rem;
          border-radius: 1.5rem;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.01)),
            rgba(0, 0, 0, 0.45);
          box-shadow:
            0 12px 40px rgba(0, 0, 0, 0.35),
            inset 0 1px 0 rgba(255, 255, 255, 0.04);
        }

        .mad-ticker-icon {
          position: relative;
          display: grid;
          place-items: center;
          width: 3rem;
          height: 3rem;
          border-radius: 999px;
          flex-shrink: 0;
        }

        .mad-ticker-icon-glow {
          position: absolute;
          inset: 0;
          border-radius: 999px;
          background: radial-gradient(circle, rgba(255, 59, 48, 0.28), transparent 70%);
          filter: blur(8px);
          animation: madPulseGlow 2.8s ease-in-out infinite;
        }

        .mad-fallback-flame {
          display: none;
          font-size: 1.8rem;
          line-height: 1;
        }

        .mad-ticker-icon img[style*="display: none"] + .mad-fallback-flame,
        .mad-ticker-icon :global(img[style*="display: none"]) ~ .mad-fallback-flame {
          display: inline-block;
        }

        .mad-wordmark {
          position: relative;
          display: inline-block;
          font-weight: 900;
          letter-spacing: 0.04em;
          line-height: 1;
          font-size: clamp(2.6rem, 10vw, 5.8rem);
          color: #f8f7f3;
          text-transform: uppercase;
          text-shadow:
            0 1px 0 rgba(255, 255, 255, 0.16),
            0 0 18px rgba(255, 255, 255, 0.08),
            0 0 28px rgba(255, 59, 48, 0.12);
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
          color: rgba(255, 59, 48, 0.55);
          transform: translate(0, 0);
          animation: madGlitchRed 7s infinite steps(1, end);
        }

        .mad-wordmark-glitch-b {
          color: rgba(95, 188, 255, 0.45);
          transform: translate(0, 0);
          animation: madGlitchBlue 7s infinite steps(1, end);
        }

        .mad-warning-marquee {
          display: inline-block;
          min-width: 100%;
          animation: madMarquee 20s linear infinite;
        }

        @keyframes madPulseGlow {
          0%, 100% {
            transform: scale(0.96);
            opacity: 0.75;
          }
          50% {
            transform: scale(1.08);
            opacity: 1;
          }
        }

        @keyframes madGlitchBase {
          0%, 87%, 100% {
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
          0%, 87%, 100% {
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
          90%, 96% {
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
          99%, 100% {
            opacity: 0;
            transform: translate(0, 0);
          }
        }

        @keyframes madGlitchBlue {
          0%, 87%, 100% {
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
          90%, 96% {
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
          99%, 100% {
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
      `}</style>
    </div>
  );
}
