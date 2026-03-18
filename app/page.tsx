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
  retailSticker:
    "https://notaveragestickers.com/products/mad-%F0%9F%98%A1-sticker",
  premiumCard:
    "https://notaveragestickers.com/products/mad-%F0%9F%98%A1-premium-embossed-card-wrap",
  richPremiumCard:
    "https://notaveragestickers.com/products/mad-%F0%9F%98%A1-premium-embossed-card-wrap-copy",
} as const;

export default function Home() {
  const [copied, setCopied] = useState(false);
  const [iframeReady, setIframeReady] = useState(false);
  const [momentumVisible, setMomentumVisible] = useState(false);

  const momentumRef = useRef<HTMLElement | null>(null);

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
      // If copying fails, do nothing
    }
  }

  useEffect(() => {
    const el = momentumRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setMomentumVisible(true);
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,0,60,0.22),transparent_55%),radial-gradient(circle_at_80%_40%,rgba(255,80,0,0.18),transparent_60%),radial-gradient(circle_at_50%_90%,rgba(255,0,0,0.14),transparent_55%)]" />
      <div className="absolute inset-0 opacity-25 [background:linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:48px_48px]" />

      <div className="relative mx-auto max-w-6xl px-6 pb-24 pt-16">
        {/* HERO */}
        <div className="relative max-w-3xl animate-fadeUp">
          {/* GM sticker (desktop only) */}
          <div className="pointer-events-none absolute right-[-260px] top-6 hidden h-[280px] w-[280px] opacity-95 lg:block">
            <Image
              src="/stickers/gm.webp"
              alt="GM Sticker"
              fill
              priority
              sizes="280px"
              className="object-contain drop-shadow-[0_25px_55px_rgba(0,0,0,0.65)]"
            />
          </div>

          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/60">
            SOLANA • Digital emotion — refined
          </p>

          <h1 className="mt-6 text-6xl font-black tracking-tight sm:text-7xl">
            Welcome To{" "}
            <span className="text-red-500 drop-shadow-[0_0_12px_rgba(255,0,0,0.6)]">
              $MAD
            </span>
          </h1>

          <p className="mt-6 max-w-xl leading-relaxed text-white/70">
            Emotion evolves. Born in volatility. Refined through discipline.
          </p>

          {/* ACTION BUTTONS */}
          <div className="mt-10 flex flex-wrap gap-3">
            <a
              href="#chart"
              className="rounded-full border border-white/10 bg-white/10 px-6 py-3 text-sm font-black text-white transition hover:bg-white/15"
            >
              Track Momentum
            </a>

            <a
              href={LINKS.x}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-black text-white/90 transition hover:bg-white/10 hover:text-white"
              aria-label="Open X"
              title="X"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="currentColor"
              >
                <path d="M18.9 2H22l-6.8 7.8L23.3 22h-6.6l-5.1-6.6L5.8 22H2.7l7.3-8.4L.7 2h6.7l4.6 6.1L18.9 2zm-1.2 18h1.7L6.5 3.9H4.7L17.7 20z" />
              </svg>
              X
            </a>

            <a
              href={LINKS.telegram}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-black text-white/90 transition hover:bg-white/10 hover:text-white"
              aria-label="Open Telegram"
              title="Telegram"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="currentColor"
              >
                <path d="M9.45 15.56 9.2 19.1c.46 0 .66-.2.9-.44l2.16-2.06 4.48 3.28c.82.45 1.41.21 1.62-.76l2.94-13.8h0c.26-1.2-.43-1.67-1.22-1.37L2.3 9.2c-1.15.45-1.13 1.09-.2 1.38l4.42 1.38 10.28-6.49c.48-.29.93-.13.56.16L9.45 15.56z" />
              </svg>
              Telegram
            </a>

            <a
              href={LINKS.tiktok}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-black text-white/90 transition hover:bg-white/10 hover:text-white"
              aria-label="Open TikTok"
              title="TikTok"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="currentColor"
              >
                <path d="M15 3c.6 2.9 2.7 5.1 5.5 5.5V12c-2 0-3.8-.6-5.5-1.8v6.2c0 3.3-2.7 6-6 6s-6-2.7-6-6 2.7-6 6-6c.4 0 .8 0 1.2.1v3.3c-.4-.2-.8-.3-1.2-.3-1.5 0-2.8 1.2-2.8 2.8S7.5 19 9 19s2.8-1.2 2.8-2.8V3H15z" />
              </svg>
              TikTok
            </a>
          </div>

          {/* CONTRACT */}
          <div className="mt-12 rounded-3xl border border-white/10 bg-black/35 p-6 shadow-2xl backdrop-blur-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/50">
              Contract
            </p>

            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex-1 break-all rounded-2xl border border-white/10 bg-black/45 px-4 py-3 text-sm text-white/85">
                {ADDR}
              </div>

              <button
                onClick={copyAddr}
                className="rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-black transition hover:bg-white/10"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>

            <p className="mt-4 text-xs text-white/40">
              Not financial advice. Culture experiment. Wearable energy.
            </p>
          </div>

          {/* MAD product links */}
          <div className="my-12 grid grid-cols-1 gap-10 sm:grid-cols-3">
            {/* 1 — MAD Sticker */}
            <div className="flex flex-col items-center justify-center">
              <Link
                href={LINKS.retailSticker}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-block"
                aria-label="MAD Stickers"
                title="MAD Stickers"
              >
                <div className="relative h-[140px] w-[140px] rotate-[-4deg] transition-all duration-300 group-hover:rotate-0 group-hover:scale-105 group-hover:drop-shadow-[0_0_20px_rgba(255,0,0,0.45)] drop-shadow-[0_18px_38px_rgba(0,0,0,0.55)]">
                  <Image
                    src="/stickers/Mad-Sticker-logo.png"
                    alt="MAD Stickers"
                    fill
                    priority
                    sizes="140px"
                    className="object-contain"
                  />
                </div>
              </Link>

              <Link
                href={LINKS.retailSticker}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 text-center text-lg font-black text-red-500 transition hover:text-red-400 drop-shadow-[0_0_14px_rgba(255,0,0,0.8)]"
              >
                MAD Stickers →
              </Link>
            </div>

            {/* 2 — Premium Card Wrap */}
            <div className="flex flex-col items-center justify-center">
              <Link
                href={LINKS.premiumCard}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-block"
                aria-label="MAD Premium Card Wrap"
                title="MAD Premium Card Wrap"
              >
                <div className="relative h-[140px] w-[140px] rotate-[3deg] transition-all duration-300 group-hover:rotate-0 group-hover:scale-105 group-hover:drop-shadow-[0_0_20px_rgba(255,0,0,0.45)] drop-shadow-[0_18px_38px_rgba(0,0,0,0.55)]">
                  <Image
                    src="/stickers/Mad-Premium-Embossed-Card-Wrap.png"
                    alt="MAD Premium Card Wrap"
                    fill
                    priority
                    sizes="140px"
                    className="object-contain"
                  />
                </div>
              </Link>

              <Link
                href={LINKS.premiumCard}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 text-center text-lg font-black text-red-500 transition hover:text-red-400 drop-shadow-[0_0_14px_rgba(255,0,0,0.8)]"
              >
                Card Wrap →
              </Link>
            </div>

            {/* 3 — Rich Premium Card Wrap */}
            <div className="flex flex-col items-center justify-center">
              <Link
                href={LINKS.richPremiumCard}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-block"
                aria-label="MAD Rich Card Wrap"
                title="MAD Rich Card Wrap"
              >
                <div className="relative h-[140px] w-[140px] rotate-[-3deg] transition-all duration-300 group-hover:rotate-0 group-hover:scale-105 group-hover:drop-shadow-[0_0_20px_rgba(255,0,0,0.45)] drop-shadow-[0_18px_38px_rgba(0,0,0,0.55)]">
                  <Image
                    src="/stickers/Mad-Rich-Premium-Embossed-Card-Wrap.png"
                    alt="MAD Rich Card Wrap"
                    fill
                    priority
                    sizes="140px"
                    className="object-contain"
                  />
                </div>
              </Link>

              <Link
                href={LINKS.richPremiumCard}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 text-center text-lg font-black text-red-500 transition hover:text-red-400 drop-shadow-[0_0_14px_rgba(255,0,0,0.8)]"
              >
                Rich Wrap →
              </Link>
            </div>
          </div>

          {/* MAD CONFESSIONS */}
          <MadConfessions />
        </div>

        {/* CHART */}
        <section
          id="chart"
          ref={momentumRef}
          className="mt-16 animate-fadeUp scroll-mt-24"
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
                A clean live view of price action — inside the site.
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

          <div className="mt-6 overflow-hidden rounded-3xl border border-white/10 bg-black/40 shadow-2xl backdrop-blur-xl">
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
      </div>
    </div>
  );
}
