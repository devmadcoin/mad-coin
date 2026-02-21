/* app/game/page.tsx */
"use client";

import Image from "next/image";

export default function GamePage() {
  return (
    <div className="relative overflow-hidden">
      {/* subtle background glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,0,60,0.18),transparent_55%),radial-gradient(circle_at_80%_40%,rgba(255,80,0,0.15),transparent_60%)]" />

      <div className="relative mx-auto max-w-6xl px-6 pt-16 pb-24">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/50">
          GAME
        </p>

        <h1 className="mt-4 text-4xl sm:text-6xl font-black leading-tight">
          Will You Get{" "}
          <span className="text-red-500 drop-shadow-[0_0_12px_rgba(255,0,0,0.6)]">
            RICH
          </span>{" "}
          Or Stay{" "}
          <span className="text-red-500 drop-shadow-[0_0_12px_rgba(255,0,0,0.6)]">
            $MAD
          </span>
        </h1>

        <p className="mt-5 max-w-2xl text-white/70">
          Prototype is live — we’ll revamp this page later with trailers,
          updates, and rewards.
        </p>

        {/* 🔥 IMAGE SECTION */}
        <div className="mt-10 rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_40px_rgba(255,0,0,0.25)]">
          <div className="relative aspect-[16/9] w-full">
            <Image
              src="/game/rich-or-mad-banner.png"
              alt="Will You Get Rich Or Stay Mad"
              fill
              sizes="(max-width: 1024px) 100vw, 1200px"
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* CTA */}
        <div className="mt-10">
          <a
            href="https://www.roblox.com/games/133907998204829/Will-You-Get-RICH-Or-Stay-MAD"
            target="_blank"
            rel="noreferrer"
            className="inline-flex rounded-full border border-red-500/40 bg-red-500/15 px-6 py-3 text-sm font-black text-red-300 shadow-[0_0_12px_rgba(255,0,0,0.35)] transition hover:bg-red-500/25"
          >
            Play on Roblox →
          </a>
        </div>
      </div>
    </div>
  );
}
