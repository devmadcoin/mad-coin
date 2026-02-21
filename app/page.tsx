/* app/page.tsx */
"use client";

import React, { useMemo, useState } from "react";

export default function Home() {
  const addr = "Fa7ZE9nCEYnrHsnoeHuhEExJpchtrBtKXnWe6CgHpump";

  const links = useMemo(
    () => ({
      buy: `https://jup.ag/swap/SOL-${addr}`,
      chart: `https://dexscreener.com/solana/${addr}`,
      tg: "https://t.me/madtokenfam",
    }),
    [addr]
  );

  const [copied, setCopied] = useState(false);

  function copyAddr() {
    navigator.clipboard.writeText(addr);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  }

  // Dexscreener embed URL (works in iframe)
  const dexEmbed = useMemo(() => {
    // Dexscreener embed supports "embed=1" on many pairs.
    // If your specific page doesn’t render, it will still show via the "Open on Dexscreener" button.
    return `https://dexscreener.com/solana/${addr}?embed=1&theme=dark&trades=0&info=0`;
  }, [addr]);

  return (
    <div className="relative overflow-hidden">
      {/* Luxury dark background */}
      <div className="absolute inset-0 bg-black" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,0,60,0.18),transparent_60%)]" />
      <div className="absolute inset-0 opacity-20 [background:linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:56px_56px]" />

      <div className="relative mx-auto max-w-6xl px-6 py-16">
        {/* HERO */}
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/60">
            SOLANA • Digital emotion — refined
          </p>

          <h1 className="mt-4 text-5xl font-extrabold tracking-tight sm:text-6xl text-white">
            Welcome To{" "}
            <span className="text-white drop-shadow-[0_0_10px_rgba(255,0,0,0.35)]">
              $MAD
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-white/70 leading-relaxed">
            Emotion evolves. Born in volatility. Refined through discipline.
          </p>

          {/* ACTION BUTTONS (not nav) */}
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="/forge"
              className="rounded-full bg-red-600 px-7 py-3 text-sm font-black text-white shadow-[0_0_18px_rgba(255,0,0,0.35)] transition hover:bg-red-500"
            >
              Forge Identity
            </a>

            <a
              href={links.buy}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-white/5 px-7 py-3 text-sm font-black text-white/90 hover:bg-white/10 transition border border-white/10"
            >
              Buy on Jupiter
            </a>

            <a
              href="#chart"
              className="rounded-full bg-white/5 px-7 py-3 text-sm font-black text-white/90 hover:bg-white/10 transition border border-white/10"
            >
              Track Momentum
            </a>

            <a
              href={links.tg}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-white/5 px-7 py-3 text-sm font-black text-white/90 hover:bg-white/10 transition border border-white/10"
            >
              Telegram
            </a>
          </div>

          {/* Contract box */}
          <div className="mt-10 rounded-2xl border border-white/10 bg-black/40 p-5 backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/50">
              Contract
            </p>

            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex-1 rounded-xl border border-white/10 bg-black/60 px-4 py-3 text-sm text-white/85 break-all">
                {addr}
              </div>

              <button
                onClick={copyAddr}
                className="rounded-full border border-white/10 bg-white/5 px-7 py-3 text-sm font-black text-white hover:bg-white/10 transition"
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
        <section id="chart" className="mt-14">
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/50">
                Live chart
              </p>
              <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-white">
                Track Momentum
              </h2>
              <p className="mt-2 text-white/60 max-w-2xl">
                A clean live view of price action — inside the site.
              </p>
            </div>

            <a
              href={links.chart}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-black text-white/90 hover:bg-white/10 transition"
            >
              Open on Dexscreener →
            </a>
          </div>

          <div className="mt-5 rounded-2xl border border-white/10 bg-black/60 shadow-[0_0_30px_rgba(255,0,0,0.08)] overflow-hidden">
            <div className="relative w-full" style={{ aspectRatio: "16 / 9" }}>
              <iframe
                src={dexEmbed}
                className="absolute inset-0 h-full w-full"
                loading="lazy"
                referrerPolicy="no-referrer"
                allow="clipboard-write; encrypted-media"
                title="$MAD Chart"
              />
            </div>
          </div>

          <p className="mt-3 text-xs text-white/35">
            If the embedded view ever fails, use “Open on Dexscreener”.
          </p>
        </section>
      </div>
    </div>
  );
}
