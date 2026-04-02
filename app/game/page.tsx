/* app/game/page.tsx */
"use client";

import Image from "next/image";

const TUTORIAL_VIDEO = "https://www.youtube.com/embed/V0LBY-ZiklY";
const GAME_LINK =
  "https://www.roblox.com/games/133907998204829/Will-You-Get-RICH-Or-Stay-MAD";
const SPECIAL_GUEST_URL = "https://x.com/Kubo100x";

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
          New to Roblox? Start here first, then jump into MAD Games.
        </p>

        {/* HERO IMAGE */}
        <div className="mt-10 overflow-hidden rounded-3xl border border-white/10 shadow-[0_0_40px_rgba(255,0,0,0.25)]">
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

        {/* TUTORIAL SECTION */}
        <div className="mt-14 rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8 shadow-[0_0_30px_rgba(255,0,0,0.12)]">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-red-300/80">
            Quick Start
          </p>

          <h2 className="mt-3 text-2xl sm:text-4xl font-black leading-tight text-white">
            Tutorial on How to Make a Roblox Account to Play MAD Games
          </h2>

          <p className="mt-4 max-w-3xl text-white/70">
            If you do not have a Roblox account yet, watch this quick tutorial
            first. Once you are done, use the button below to jump straight into
            the game.
          </p>

          {/* VIDEO EMBED */}
          <div className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-black shadow-[0_0_24px_rgba(255,0,0,0.14)]">
            <div className="relative aspect-video w-full">
              <iframe
                src={TUTORIAL_VIDEO}
                title="Tutorial on how to make a Roblox account to play MAD Games"
                className="absolute inset-0 h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          </div>

          {/* SPECIAL GUEST CREDIT */}
          <div className="mt-6 text-sm text-white/60">
            Special Guest:{" "}
            <a
              href={SPECIAL_GUEST_URL}
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-red-400 underline underline-offset-2 transition hover:text-red-300"
            >
              Kubo
            </a>
          </div>

          {/* CTA UNDER VIDEO */}
          <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <a
              href={GAME_LINK}
              target="_blank"
              rel="noreferrer"
              className="inline-flex rounded-full border border-red-500/40 bg-red-500/15 px-6 py-3 text-sm font-black text-red-300 shadow-[0_0_12px_rgba(255,0,0,0.35)] transition hover:bg-red-500/25"
            >
              Play MAD Games on Roblox →
            </a>

            <p className="text-sm text-white/50">
              Watch the tutorial above first if you are new to Roblox.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
