"use client";

import Image from "next/image";

const TUTORIAL_VIDEO = "https://www.youtube.com/embed/V0LBY-ZiklY";
const GAME_LINK =
  "https://www.roblox.com/games/133907998204829/Will-You-Get-RICH-Or-Stay-MAD";
const TOWER_DEFENSE_TEASER = "https://streamable.com/e/yc9dot";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function Pill({
  children,
  tone = "default",
}: {
  children: React.ReactNode;
  tone?: "default" | "red" | "green";
}) {
  return (
    <div
      className={cn(
        "rounded-full px-4 py-2 text-[11px] font-black uppercase tracking-[0.24em]",
        tone === "red" && "border border-red-500/25 bg-red-500/10 text-red-200",
        tone === "green" &&
          "border border-emerald-400/20 bg-emerald-500/10 text-emerald-200",
        tone === "default" &&
          "border border-white/10 bg-white/[0.04] text-white/70",
      )}
    >
      {children}
    </div>
  );
}

function SectionShell({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] shadow-[0_18px_50px_rgba(0,0,0,0.35)] backdrop-blur-xl",
        className,
      )}
    >
      {children}
    </section>
  );
}

function SimpleCard({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-[1.4rem] border border-white/10 bg-black/25 p-5">
      <h3 className="text-xl font-black text-white">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-white/65">{text}</p>
    </div>
  );
}

function RiskNotice() {
  return (
    <SectionShell className="border-yellow-500/20 bg-[linear-gradient(180deg,rgba(255,208,0,0.05),rgba(255,208,0,0.02))] px-6 py-8 sm:px-10 sm:py-10">
      <p className="text-center text-xs font-black uppercase tracking-[0.38em] text-yellow-300/85">
        Risk Notice
      </p>

      <p className="mx-auto mt-5 max-w-6xl text-center text-base leading-9 text-yellow-100/90 sm:text-xl">
        $MAD is a meme coin and speculative digital asset. Nothing on this
        website is financial advice or a guarantee of returns. Crypto is risky
        and volatile. Never risk money you cannot afford to lose. Always do your
        own research.
      </p>
    </SectionShell>
  );
}

export default function GamePage() {
  return (
    <div className="relative overflow-hidden bg-black text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(255,0,60,0.14),transparent_30%),radial-gradient(circle_at_85%_15%,rgba(255,90,0,0.1),transparent_28%),radial-gradient(circle_at_50%_100%,rgba(120,0,0,0.18),transparent_45%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.02),transparent_20%,transparent_80%,rgba(255,255,255,0.015))]" />

      <div className="relative mx-auto max-w-7xl px-4 pb-24 pt-8 sm:px-6 lg:px-8">
        <SectionShell className="overflow-hidden p-0">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.95fr]">
            <div className="p-6 sm:p-8 lg:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.34em] text-red-200/75">
                PLAY NOW
              </p>

              <h1 className="mt-4 text-4xl font-black leading-[0.95] tracking-tight text-white sm:text-6xl">
                The{" "}
                <span className="text-red-500 drop-shadow-[0_0_14px_rgba(255,0,0,0.45)]">
                  $MAD
                </span>{" "}
                game is live.
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-8 text-white/70 sm:text-lg">
                Jump in now. New to Roblox? Watch the tutorial first.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Pill tone="green">Easy Start</Pill>
                <Pill tone="red">Official Game</Pill>
                <Pill>Tutorial Included</Pill>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={GAME_LINK}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex rounded-full border border-red-500/40 bg-red-500 px-7 py-4 text-base font-black text-white shadow-[0_0_16px_rgba(255,0,0,0.3)] transition hover:scale-[1.02] hover:bg-red-400"
                >
                  Play Now →
                </a>

                <a
                  href={TUTORIAL_VIDEO.replace("/embed/", "/watch?v=")}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-7 py-4 text-base font-black text-white/85 transition hover:border-white/20 hover:bg-white/[0.08]"
                >
                  Watch Tutorial
                </a>
              </div>
            </div>

            <div className="relative min-h-[280px] sm:min-h-[360px] lg:min-h-full">
              <Image
                src="/game/rich-or-mad-banner.png"
                alt="Will You Get RICH Or Stay $MAD"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 700px"
                className="object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </div>
          </div>
        </SectionShell>

        <SectionShell className="mt-8 p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-white/45">
            HOW IT WORKS
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <SimpleCard
              title="1. Make Roblox"
              text="No account yet? Make one first."
            />
            <SimpleCard
              title="2. Watch Help"
              text="Use the tutorial if you want the easiest setup."
            />
            <SimpleCard
              title="3. Join $MAD"
              text="Open the official game and start playing."
            />
          </div>
        </SectionShell>

        <SectionShell className="mt-8 p-6 sm:p-8">
          <div className="max-w-4xl">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-red-200/75">
              QUICK HELP
            </p>

            <h2 className="mt-3 text-3xl font-black leading-tight text-white sm:text-5xl">
              Need help first?
            </h2>

            <p className="mt-4 max-w-3xl text-base leading-8 text-white/70">
              Watch this quick setup video to get into Roblox and start playing
              fast.
            </p>
          </div>

          <div className="mt-8 overflow-hidden rounded-[1.6rem] border border-white/10 bg-black shadow-[0_0_24px_rgba(255,0,0,0.12)]">
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
        </SectionShell>

        <SectionShell className="mt-8 overflow-hidden p-0">
          <div className="grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="p-6 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-red-300/75">
                COMING SOON
              </p>

              <h2 className="mt-4 text-4xl font-black leading-[0.95] text-white sm:text-6xl">
                <span className="text-red-500 drop-shadow-[0_0_12px_rgba(255,0,0,0.45)]">
                  MAD
                </span>
                <br />
                Tower Defense
              </h2>

              <p className="mt-5 max-w-xl text-base leading-8 text-white/68">
                Bigger and wilder. Still in development.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="https://streamable.com/yc9dot"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex rounded-full border border-red-500/40 bg-red-500/15 px-6 py-3 text-sm font-black text-red-300 shadow-[0_0_12px_rgba(255,0,0,0.35)] transition hover:bg-red-500/25"
                >
                  Watch Teaser →
                </a>

                <Pill>More Coming</Pill>
              </div>
            </div>

            <div className="grid gap-0">
              <div className="relative aspect-video w-full">
                <iframe
                  src={TOWER_DEFENSE_TEASER}
                  title="MAD Tower Defense teaser"
                  className="absolute inset-0 h-full w-full"
                  allow="autoplay; fullscreen"
                  allowFullScreen
                />
              </div>

              <div className="relative aspect-[4/3] w-full">
                <Image
                  src="/game/mad-hazmat-turret.png"
                  alt="MAD Tower Defense Hazmat Turret concept art"
                  fill
                  sizes="(max-width: 1024px) 100vw, 700px"
                  className="object-cover"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
              </div>
            </div>
          </div>
        </SectionShell>

        <div className="mt-8">
          <RiskNotice />
        </div>
      </div>
    </div>
  );
}
