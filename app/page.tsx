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

  return (
    <div className="relative overflow-hidden">
      {/* background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,0,60,0.35),transparent_55%),radial-gradient(circle_at_80%_40%,rgba(255,80,0,0.25),transparent_60%),radial-gradient(circle_at_50%_90%,rgba(255,0,0,0.20),transparent_55%)]" />
      <div className="absolute inset-0 opacity-25 [background:linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:48px_48px]" />

      <div className="relative mx-auto max-w-6xl px-6 py-16">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/60">
            SOLANA • Digital emotion — refined
          </p>

          <h1 className="mt-4 text-5xl font-black tracking-tight sm:text-6xl">
            Welcome To <span className="text-white">$MAD</span>
          </h1>

          <p className="mt-6 max-w-xl text-white/70 leading-relaxed">
            Emotion evolves. Born in volatility. Refined through discipline.
          </p>

          {/* ACTION BUTTONS (not nav) */}
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="/forge"
              className="rounded-full bg-white/10 px-6 py-3 text-sm font-black text-white hover:bg-white/15 transition border border-white/10"
            >
              Forge Identity
            </a>

            <a
              href={links.buy}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-white/5 px-6 py-3 text-sm font-black text-white/90 hover:bg-white/10 transition border border-white/10"
            >
              Buy on Jupiter
            </a>

            <a
              href={links.chart}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-white/5 px-6 py-3 text-sm font-black text-white/90 hover:bg-white/10 transition border border-white/10"
            >
              Track Momentum
            </a>

            <a
              href={links.tg}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-white/5 px-6 py-3 text-sm font-black text-white/90 hover:bg-white/10 transition border border-white/10"
            >
              Telegram
            </a>
          </div>

          {/* Contract box */}
          <div className="mt-10 rounded-2xl border border-white/10 bg-black/30 p-5 backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/50">
              Contract
            </p>

            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex-1 rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white/85 break-all">
                {addr}
              </div>

              <button
                onClick={copyAddr}
                className="rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-black hover:bg-white/10 transition"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>

            <p className="mt-4 text-xs text-white/40">
              Not financial advice. Culture experiment. Wearable energy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
