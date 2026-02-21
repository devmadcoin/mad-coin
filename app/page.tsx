/* app/page.tsx */
"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";

export default function Home() {
  const addr = "Fa7ZE9nCEYnrHsnoeHuhEExJpchtrBtKXnWe6CgHpump";

  const links = useMemo(
    () => ({
      buy: `https://jup.ag/swap/SOL-${addr}`,
      chartPage: `https://dexscreener.com/solana/${addr}`,
      tg: "https://t.me/madtokenfam",
    }),
    [addr]
  );

  const [copied, setCopied] = useState(false);

  function copyAddr() {
    if (typeof navigator === "undefined" || !navigator.clipboard) return;
    navigator.clipboard.writeText(addr).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  }

  return (
    <div className="relative overflow-hidden">
      {/* background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,0,60,0.22),transparent_55%),radial-gradient(circle_at_80%_40%,rgba(255,80,0,0.18),transparent_60%),radial-gradient(circle_at_50%_90%,rgba(255,0,0,0.14),transparent_55%)]" />
      <div className="absolute inset-0 opacity-25 [background:linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:48px_48px]" />

      <div className="relative mx-auto max-w-6xl px-6 pt-16 pb-24">
        {/* HERO (make this relative so the sticker can anchor) */}
        <div className="relative max-w-3xl animate-fadeUp">
          {/* GM sticker (desktop only) */}
          <div className="pointer-events-none hidden lg:block absolute -right-36 top-6 w-[280px] h-[280px] opacity-95">
            <Image
              src="/stickers/sticker.webp%20Gm.webp"
              alt="GM Sticker"
              fill
              priority
              className="object-contain drop-shadow-[0_25px_55px_rgba(0,0,0,0.65)] animate-float"
            />
          </div>

          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/60">
            SOLANA • Digital emotion — refined
          </p>

          <h1 className="mt-6 text-6xl font-black tracking-tight sm:text-7xl">
            Welcome To <span className="text-white">$MAD</span>
          </h1>

          <p className="mt-6 max-w-xl text-white/70 leading-relaxed">
            Emotion evolves. Born in volatility. Refined through discipline.
          </p>

          {/* ACTION BUTTONS */}
          <div className="mt-10 flex flex-wrap gap-3">
            <a
              href="/forge"
              className="rounded-full bg-white/10 px-6 py-3 text-sm font-black text-white transition border border-white/10 hover:bg-white/15"
            >
              Forge Identity
            </a>

            <a
              href={links.buy}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-white/5 px-6 py-3 text-sm font-black text-white/90 transition border border-white/10 hover:bg-white/10 hover:text-white"
            >
              Buy on Jupiter
            </a>

            <a
              href="#chart"
              className="rounded-full bg-white/5 px-6 py-3 text-sm font-black text-white/90 transition border border-white/10 hover:bg-white/10 hover:text-white"
            >
              Track Momentum
            </a>

            <a
              href={links.tg}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-white/5 px-6 py-3 text-sm font-black text-white/90 transition border border-white/10 hover:bg-white/10 hover:text-white"
            >
              Telegram
            </a>
          </div>

          {/* CONTRACT */}
          <div className="mt-12 rounded-3xl border border-white/10 bg-black/35 p-6 backdrop-blur-xl shadow-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/50">
              Contract
            </p>

            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex-1 rounded-2xl border border-white/10 bg-black/45 px-4 py-3 text-sm text-white/85 break-all">
                {addr}
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
        </div>

        {/* CHART */}
        <section id="chart" className="mt-16 animate-fadeUp scroll-mt-24">
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/50">
                Live Chart
              </p>
              <h2 className="mt-2 text-3xl sm:text-4xl font-black">Track Momentum</h2>
              <p className="mt-2 text-white/60">
                A clean live view of price action — inside the site.
              </p>
            </div>

            <a
              href={links.chartPage}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm font-semibold text-white/90 transition hover:bg-white/10 hover:text-white"
            >
              Open on Dexscreener →
            </a>
          </div>

          <div className="mt-6 overflow-hidden rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl">
            <div className="relative w-full" style={{ aspectRatio: "16 / 9" }}>
              <iframe
                className="absolute inset-0 h-full w-full"
                src={`https://dexscreener.com/solana/${addr}?embed=1&theme=dark`}
                title="$MAD Dexscreener Chart"
                loading="lazy"
                referrerPolicy="no-referrer"
                allow="clipboard-write; fullscreen"
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
