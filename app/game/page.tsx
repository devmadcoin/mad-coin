/* app/game/page.tsx */
"use client";

import Image from "next/image";

const TUTORIAL_VIDEO = "https://www.youtube.com/embed/V0LBY-ZiklY";
const GAME_LINK =
  "https://www.roblox.com/games/133907998204829/Will-You-Get-RICH-Or-Stay-MAD";
const SPECIAL_GUEST_URL = "https://x.com/Kubo100x";

export default function GamePage() {
  return (
    <div className="relative overflow-hidden bg-black text-white">
      {/* background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(255,0,60,0.16),transparent_40%),radial-gradient(circle_at_82%_22%,rgba(255,90,0,0.12),transparent_34%),radial-gradient(circle_at_50%_100%,rgba(120,0,0,0.16),transparent_45%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.02),transparent_20%,transparent_80%,rgba(255,255,255,0.015))]" />

      <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-16 sm:px-8 lg:px-10">
        {/* HERO */}
        <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] p-7 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,0,60,0.12),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(255,60,0,0.08),transparent_25%)]" />

          <div className="relative mx-auto max-w-5xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.38em] text-white/45">
              GAME PORTAL
            </p>

            <h1 className="mt-5 text-5xl font-black tracking-tight sm:text-6xl lg:text-7xl">
              Start Your{" "}
              <span className="text-red-500 drop-shadow-[0_0_16px_rgba(255,0,0,0.55)]">
                $MAD
              </span>{" "}
              Run
            </h1>

            <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-white/68 sm:text-lg">
              Start here, get set up, then jump into the official Roblox
              experience.
            </p>

            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <div className="rounded-full border border-red-500/20 bg-red-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-red-200">
                New Player Friendly
              </div>
              <div className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white/70">
                Tutorial First
              </div>
              <div className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white/70">
                Direct Game Link
              </div>
            </div>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href="#quick-start"
                className="inline-flex rounded-full border border-red-500/40 bg-red-500/15 px-6 py-3 text-sm font-black text-red-300 shadow-[0_0_14px_rgba(255,0,0,0.32)] transition hover:bg-red-500/25"
              >
                Watch Tutorial First
              </a>

              <a
                href={GAME_LINK}
                target="_blank"
                rel="noreferrer"
                className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-6 py-3 text-sm font-semibold text-white/85 transition hover:bg-white/[0.08]"
              >
                Skip to Game
              </a>
            </div>
          </div>
        </section>

        {/* QUICK START */}
        <section
          id="quick-start"
          className="mt-10 rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-8"
        >
          <div className="max-w-4xl">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-red-300/75">
              QUICK START
            </p>

            <h2 className="mt-3 text-3xl font-black leading-tight text-white sm:text-4xl">
              New to Roblox? Get set up here first.
            </h2>

            <p className="mt-4 text-white/70 leading-relaxed">
              If you do not have a Roblox account yet, start with this quick
              tutorial. Once you are set up, use the game button below to jump
              straight into MAD Games.
            </p>
          </div>

          <div className="mt-8 overflow-hidden rounded-[1.5rem] border border-white/10 bg-black shadow-[0_0_24px_rgba(255,0,0,0.12)]">
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

          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-white/60">
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

            <a
              href={GAME_LINK}
              target="_blank"
              rel="noreferrer"
              className="inline-flex rounded-full border border-red-500/40 bg-red-500/15 px-6 py-3 text-sm font-black text-red-300 shadow-[0_0_12px_rgba(255,0,0,0.35)] transition hover:bg-red-500/25"
            >
              Play MAD Games on Roblox →
            </a>
          </div>
        </section>

        {/* GAME FEATURE */}
        <section className="mt-10 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/40">
              FEATURED GAME
            </p>

            <h2 className="mt-4 text-3xl font-black leading-tight sm:text-5xl">
              Will You Get{" "}
              <span className="text-red-500 drop-shadow-[0_0_12px_rgba(255,0,0,0.5)]">
                RICH
              </span>{" "}
              Or Stay{" "}
              <span className="text-red-500 drop-shadow-[0_0_12px_rgba(255,0,0,0.5)]">
                $MAD
              </span>
            </h2>

            <p className="mt-4 text-white/68 leading-relaxed">
              The official $MAD Roblox experience. Jump in, survive the chaos,
              and see whether your path leads to riches or madness.
            </p>

            <div className="mt-6 grid gap-3">
              <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/40">
                  WHAT TO EXPECT
                </p>
                <p className="mt-2 text-sm leading-relaxed text-white/65">
                  Fast decisions, chaotic energy, and a direct entry into the
                  $MAD universe through Roblox gameplay.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/40">
                  BEST FOR
                </p>
                <p className="mt-2 text-sm leading-relaxed text-white/65">
                  First-time visitors, Roblox players, and anyone who wants the
                  fastest route from website to action.
                </p>
              </div>
            </div>

            <div className="mt-6">
              <a
                href={GAME_LINK}
                target="_blank"
                rel="noreferrer"
                className="inline-flex rounded-full border border-red-500/40 bg-red-500/15 px-6 py-3 text-sm font-black text-red-300 shadow-[0_0_12px_rgba(255,0,0,0.35)] transition hover:bg-red-500/25"
              >
                Open Official Roblox Game →
              </a>
            </div>
          </div>

          <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] shadow-[0_18px_50px_rgba(0,0,0,0.35)] backdrop-blur-xl">
            <div className="relative aspect-[16/10] w-full">
              <Image
                src="/game/rich-or-mad-banner.png"
                alt="Will You Get RICH Or Stay $MAD"
                fill
                sizes="(max-width: 1024px) 100vw, 700px"
                className="object-cover"
                priority
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
            </div>
          </div>
        </section>

        {/* STEPS */}
        <section className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/40">
              STEP 1
            </p>
            <p className="mt-3 text-sm leading-relaxed text-white/68">
              Create or log into your Roblox account.
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/40">
              STEP 2
            </p>
            <p className="mt-3 text-sm leading-relaxed text-white/68">
              Watch the tutorial if you are brand new to Roblox.
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/40">
              STEP 3
            </p>
            <p className="mt-3 text-sm leading-relaxed text-white/68">
              Enter MAD Games and choose whether you get rich or stay mad.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
