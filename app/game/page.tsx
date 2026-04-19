/* app/game/page.tsx */
"use client";

import Image from "next/image";

const TUTORIAL_VIDEO = "https://www.youtube.com/embed/V0LBY-ZiklY";
const GAME_LINK =
  "https://www.roblox.com/games/133907998204829/Will-You-Get-RICH-Or-Stay-MAD";
const SPECIAL_GUEST_URL = "https://x.com/Kubo100x";
const TOWER_DEFENSE_TEASER = "https://streamable.com/e/yc9dot";

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
    <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl transition duration-300 hover:border-white/20 hover:bg-white/[0.05]">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/40">
        {step}
      </p>
      <h3 className="mt-3 text-xl font-black text-white">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-white/68">{text}</p>
    </div>
  );
}

function InfoCard({
  eyebrow,
  text,
}: {
  eyebrow: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/40">
        {eyebrow}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-white/65">{text}</p>
    </div>
  );
}

export default function GamePage() {
  return (
    <div className="relative overflow-hidden bg-black text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(255,0,60,0.16),transparent_40%),radial-gradient(circle_at_82%_22%,rgba(255,90,0,0.12),transparent_34%),radial-gradient(circle_at_50%_100%,rgba(120,0,0,0.16),transparent_45%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.02),transparent_20%,transparent_80%,rgba(255,255,255,0.015))]" />

      <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-10 sm:px-8 lg:px-10">
        <section className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-8">
          <div className="max-w-4xl">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-red-300/75">
              START HERE
            </p>

            <h1 className="mt-3 text-3xl font-black leading-tight text-white sm:text-5xl">
              Play the $MAD games
            </h1>

            <p className="mt-4 leading-relaxed text-white/70">
              New to Roblox? Follow these 3 simple steps and jump in fast.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Pill tone="green">Easy Start</Pill>
            <Pill tone="red">Official Games</Pill>
            <Pill>Tutorial Included</Pill>
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
            text="Use the video below if you want the easiest way to get set up."
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
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-4xl">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-red-300/75">
                QUICK START
              </p>

              <h2 className="mt-3 text-3xl font-black leading-tight text-white sm:text-4xl">
                Need help before playing?
              </h2>

              <p className="mt-4 leading-relaxed text-white/70">
                Watch this quick setup video first. It helps brand new players
                get into Roblox fast so they can jump into MAD Games without
                getting confused.
              </p>
            </div>

            <a
              href={SPECIAL_GUEST_URL}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-3 rounded-full border border-red-500/30 bg-red-500/12 px-5 py-3 text-sm font-black text-red-200 shadow-[0_0_16px_rgba(255,0,0,0.22)] transition hover:bg-red-500/20"
            >
              <span className="rounded-full border border-red-400/30 bg-black/30 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-red-200">
                Special Guest
              </span>
              <span className="text-white group-hover:text-red-100">Kubo</span>
            </a>
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

          <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-[1.25rem] border border-white/10 bg-black/20 px-4 py-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-red-200">
                Tutorial Host
              </span>

              <a
                href={SPECIAL_GUEST_URL}
                target="_blank"
                rel="noreferrer"
                className="text-sm font-black text-white underline underline-offset-4 transition hover:text-red-300"
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

        <section className="mt-10 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/40">
              OFFICIAL GAME
            </p>

            <h2 className="mt-4 text-3xl font-black leading-tight sm:text-5xl">
              Will You Get{" "}
              <span className="text-red-500 drop-shadow-[0_0_12px_rgba(255,0,0,0.5)]">
                RICH
              </span>
              <br />
              Or Stay{" "}
              <span className="text-red-500 drop-shadow-[0_0_12px_rgba(255,0,0,0.5)]">
                $MAD
              </span>
            </h2>

            <p className="mt-5 text-base leading-relaxed text-white/70">
              The official $MAD Roblox game.
            </p>

            <p className="mt-2 text-sm leading-relaxed text-white/55">
              Open it. Play it. See what happens.
            </p>

            <div className="mt-8">
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

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.02fr_0.98fr]">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-red-300/75">
              COMING SOON
            </p>

            <h2 className="mt-4 text-3xl font-black leading-tight sm:text-5xl">
              MAD Tower Defense
            </h2>

            <p className="mt-4 leading-relaxed text-white/68">
              A new MAD game is coming. Build your defense, place crazy towers,
              and survive wave after wave inside the MAD universe.
            </p>

            <div className="mt-6 grid gap-3">
              <InfoCard
                eyebrow="WHAT IT IS"
                text="A tower defense game where players place MAD-themed units and try to stop incoming enemies."
              />
              <InfoCard
                eyebrow="FIRST TOWER CONCEPT"
                text="Hazmat Turret concept revealed. More towers, enemies, and upgrades are planned next."
              />
              <InfoCard
                eyebrow="STATUS"
                text="Early concept stage. Teaser and concept art are live now. Full game coming later."
              />
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="https://streamable.com/yc9dot"
                target="_blank"
                rel="noreferrer"
                className="inline-flex rounded-full border border-red-500/40 bg-red-500/15 px-6 py-3 text-sm font-black text-red-300 shadow-[0_0_12px_rgba(255,0,0,0.35)] transition hover:bg-red-500/25"
              >
                Watch Tower Defense Teaser →
              </a>

              <div className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-6 py-3 text-sm font-semibold text-white/80">
                More towers coming
              </div>
            </div>
          </div>

          <div className="grid gap-6">
            <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] shadow-[0_18px_50px_rgba(0,0,0,0.35)] backdrop-blur-xl">
              <div className="relative aspect-video w-full">
                <iframe
                  src={TOWER_DEFENSE_TEASER}
                  title="MAD Tower Defense teaser"
                  className="absolute inset-0 h-full w-full"
                  allow="autoplay; fullscreen"
                  allowFullScreen
                />
              </div>
            </div>

            <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] shadow-[0_18px_50px_rgba(0,0,0,0.35)] backdrop-blur-xl">
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src="/game/mad-hazmat-turret.png"
                  alt="MAD Tower Defense Hazmat Turret concept art"
                  fill
                  sizes="(max-width: 1024px) 100vw, 700px"
                  className="object-cover"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
