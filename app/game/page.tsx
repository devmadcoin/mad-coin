/* app/game/page.tsx */
"use client";

import Image from "next/image";

const TUTORIAL_VIDEO = "https://www.youtube.com/embed/V0LBY-ZiklY";
const GAME_LINK =
  "https://www.roblox.com/games/133907998204829/Will-You-Get-RICH-Or-Stay-MAD";
const SPECIAL_GUEST_URL = "https://x.com/Kubo100x";

function Pill({
  children,
  tone = "default",
}: {
  children: React.ReactNode;
  tone?: "default" | "red" | "green";
}) {
  return (
    <div
      className={[
        "rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em]",
        tone === "red" &&
          "border border-red-500/20 bg-red-500/10 text-red-200",
        tone === "green" &&
          "border border-emerald-400/20 bg-emerald-500/10 text-emerald-200",
        tone === "default" &&
          "border border-white/10 bg-white/[0.04] text-white/70",
      ].join(" ")}
    >
      {children}
    </div>
  );
}

function StepCard({
  step,
  title,
  text,
}: {
  step: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/40">
        {step}
      </p>
      <h3 className="mt-3 text-xl font-black text-white">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-white/68">{text}</p>
    </div>
  );
}

export default function GamePage() {
  return (
    <div className="relative overflow-hidden bg-black text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(255,0,60,0.16),transparent_40%),radial-gradient(circle_at_82%_22%,rgba(255,90,0,0.12),transparent_34%),radial-gradient(circle_at_50%_100%,rgba(120,0,0,0.16),transparent_45%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.02),transparent_20%,transparent_80%,rgba(255,255,255,0.015))]" />

      <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-16 sm:px-8 lg:px-10">
        <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] p-7 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,0,60,0.12),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(255,60,0,0.08),transparent_25%)]" />

          <div className="relative mx-auto max-w-5xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.38em] text-white/45">
              GAME PORTAL
            </p>

            <h1 className="mt-5 text-5xl font-black tracking-tight sm:text-6xl lg:text-7xl">
              Play the official{" "}
              <span className="text-red-500 drop-shadow-[0_0_16px_rgba(255,0,0,0.55)]">
                $MAD
              </span>{" "}
              Roblox game
            </h1>

            <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-white/68 sm:text-lg">
              New here? Watch the quick tutorial, make your Roblox account, and
              then jump into the game.
            </p>

            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Pill tone="green">Easy Start</Pill>
              <Pill tone="red">Official Game</Pill>
              <Pill>Tutorial Included</Pill>
            </div>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href="#quick-start"
                className="inline-flex rounded-full border border-red-500/40 bg-red-500/15 px-6 py-3 text-sm font-black text-red-300 shadow-[0_0_14px_rgba(255,0,0,0.32)] transition hover:bg-red-500/25"
              >
                Start Here
              </a>

              <a
                href={GAME_LINK}
                target="_blank"
                rel="noreferrer"
                className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-6 py-3 text-sm font-semibold text-white/85 transition hover:bg-white/[0.08]"
              >
                Go Straight to Game
              </a>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          <StepCard
            step="STEP 1"
            title="Make a Roblox account"
            text="If you do not have Roblox yet, make your free account first."
          />
          <StepCard
            step="STEP 2"
            title="Watch the quick tutorial"
            text="Use the video below if you want help getting set up the easy way."
          />
          <StepCard
            step="STEP 3"
            title="Join the MAD game"
            text="Once your account is ready, open the official Roblox game and play."
          />
        </section>

        <section
          id="quick-start"
          className="mt-10 rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-8"
        >
          <div className="max-w-4xl">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-red-300/75">
              QUICK START
            </p>

            <h2 className="mt-3 text-3xl font-black leading-tight text-white sm:text-4xl">
              Need help before playing?
            </h2>

            <p className="mt-4 leading-relaxed text-white/70">
              Watch this quick setup video first. It helps brand new players get
              into Roblox fast so they can jump into MAD Games without getting
              confused.
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

        <section className="mt-10 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/40">
              OFFICIAL GAME
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

            <p className="mt-4 leading-relaxed text-white/68">
              This is the official $MAD Roblox experience. Go in, survive the
              chaos, and see where your run takes you.
            </p>

            <div className="mt-6 grid gap-3">
              <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/40">
                  WHAT IT IS
                </p>
                <p className="mt-2 text-sm leading-relaxed text-white/65">
                  A Roblox game inside the $MAD world. Easy to enter, fast to
                  understand, and built for action.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/40">
                  WHO IT IS FOR
                </p>
                <p className="mt-2 text-sm leading-relaxed text-white/65">
                  New visitors, Roblox players, and anyone who wants the fastest
                  way to experience the MAD universe.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/40">
                  SIMPLE VERSION
                </p>
                <p className="mt-2 text-sm leading-relaxed text-white/65">
                  Make account. Open game. Start playing.
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
      </div>
    </div>
  );
}
