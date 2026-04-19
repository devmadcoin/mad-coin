"use client";

import Image from "next/image";

const TUTORIAL_VIDEO = "https://www.youtube.com/embed/V0LBY-ZiklY";
const GAME_LINK =
  "https://www.roblox.com/games/133907998204829/Will-You-Get-RICH-Or-Stay-MAD";
const SPECIAL_GUEST_URL = "https://x.com/Kubo100x";
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

function StepTile({
  step,
  title,
  text,
  icon,
}: {
  step: string;
  title: string;
  text: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-[1.6rem] border border-white/10 bg-black/25 p-5 transition duration-300 hover:border-white/20 hover:bg-white/[0.04]">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-red-500/20 bg-red-500/10 text-red-300">
        {icon}
      </div>

      <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-red-200/80">
        {step}
      </p>

      <h3 className="mt-3 text-2xl font-black leading-tight text-white">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-7 text-white/68">{text}</p>
    </div>
  );
}

function SmallCard({
  eyebrow,
  text,
}: {
  eyebrow: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/40">
        {eyebrow}
      </p>
      <p className="mt-2 text-sm leading-7 text-white/65">{text}</p>
    </div>
  );
}

export default function GamePage() {
  return (
    <div className="relative overflow-hidden bg-black text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(255,0,60,0.14),transparent_30%),radial-gradient(circle_at_85%_15%,rgba(255,90,0,0.1),transparent_28%),radial-gradient(circle_at_50%_100%,rgba(120,0,0,0.18),transparent_45%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.02),transparent_20%,transparent_80%,rgba(255,255,255,0.015))]" />

      <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-10 sm:px-8 lg:px-10">
        <SectionShell className="p-6 sm:p-8">
          <div className="max-w-5xl">
            <p className="text-xs font-semibold uppercase tracking-[0.34em] text-red-200/75">
              PLAY NOW
            </p>

            <h1 className="mt-4 text-4xl font-black leading-[0.95] tracking-tight text-white sm:text-6xl">
              The{" "}
              <span className="text-red-500 drop-shadow-[0_0_14px_rgba(255,0,0,0.45)]">
                $MAD
              </span>{" "}
              games are live.
            </h1>

            <p className="mt-5 max-w-3xl text-base leading-8 text-white/70 sm:text-lg">
              New to Roblox? Relax. Do these 3 easy steps, then jump in.
            </p>
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
            <Pill tone="green">Easy Start</Pill>
            <Pill tone="red">Official $MAD Game</Pill>
            <Pill>Tutorial Included</Pill>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <StepTile
              step="STEP 1"
              title="Make a Roblox account"
              text="No account yet? Make one free first. That gets you in the door."
              icon={
                <svg viewBox="0 0 24 24" className="h-7 w-7 fill-current">
                  <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4.42 0-8 2.24-8 5v1h16v-1c0-2.76-3.58-5-8-5Zm9-3h-2V9h-2v2h-2v2h2v2h2v-2h2Z" />
                </svg>
              }
            />
            <StepTile
              step="STEP 2"
              title="Watch the quick video"
              text="If you want the easiest setup, hit the tutorial below and copy it."
              icon={
                <svg viewBox="0 0 24 24" className="h-7 w-7 fill-current">
                  <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm-2 14.5v-9l7 4.5Z" />
                </svg>
              }
            />
            <StepTile
              step="STEP 3"
              title="Join the game"
              text="When your account is ready, open the official $MAD Roblox game and play."
              icon={
                <svg viewBox="0 0 24 24" className="h-7 w-7 fill-current">
                  <path d="M7 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h3l3 3h4l3-3h3a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-3-3h-4Zm1 5a1.5 1.5 0 1 1-1.5-1.5A1.5 1.5 0 0 1 8 12Zm9 0a1.5 1.5 0 1 1-1.5-1.5A1.5 1.5 0 0 1 17 12Z" />
                </svg>
              }
            />
          </div>
        </SectionShell>

        <div className="mt-10 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <SectionShell className="p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-white/45">
              OFFICIAL GAME
            </p>

            <div className="mt-5 inline-flex rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-red-200">
              Live Right Now
            </div>

            <h2 className="mt-6 text-4xl font-black leading-[0.95] text-white sm:text-6xl">
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

            <p className="mt-6 max-w-xl text-lg leading-8 text-white/78">
              This is prototype #1 of the official $MAD Roblox game.
            </p>

            <p className="mt-3 max-w-xl text-base leading-8 text-white/58">
              It is live now. Click in, play early, and see the first version before bigger upgrades land.
            </p>

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

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <SmallCard eyebrow="What It Is" text="A live Roblox prototype you can play right now." />
              <SmallCard eyebrow="Best For" text="Anyone who wants the easiest way to enter the $MAD world." />
              <SmallCard eyebrow="Goal" text="Jump in fast. Learn the vibe. Play before the next upgrades drop." />
            </div>
          </SectionShell>

          <SectionShell>
            <div className="relative aspect-[16/10] w-full">
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
          </SectionShell>
        </div>

        <SectionShell className="mt-10 p-6 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-4xl">
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-red-200/75">
                QUICK HELP
              </p>

              <h2 className="mt-3 text-3xl font-black leading-tight text-white sm:text-5xl">
                Need help first?
              </h2>

              <p className="mt-4 max-w-3xl text-base leading-8 text-white/70">
                Watch this quick setup video. It is the fastest way for brand new players to get into Roblox and start playing $MAD.
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
        </SectionShell>

        <div className="mt-10 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <SectionShell className="p-6 sm:p-8">
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

            <p className="mt-5 max-w-md text-lg leading-8 text-white/75">
              Bigger. Wilder. More chaos. This one is still being built.
            </p>

            <p className="mt-3 max-w-xl text-base leading-8 text-white/58">
              The next $MAD game is in development now. Watch the teaser and see where the world is going next.
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

              <div className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-6 py-3 text-sm font-semibold text-white/80">
                More Towers Coming
              </div>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <SmallCard eyebrow="Status" text="Still in development." />
              <SmallCard eyebrow="Energy" text="More action. More defense. More MAD." />
              <SmallCard eyebrow="Next Move" text="Watch the teaser and get ready for what is coming." />
            </div>
          </SectionShell>

          <div className="grid gap-6">
            <SectionShell>
              <div className="relative aspect-video w-full">
                <iframe
                  src={TOWER_DEFENSE_TEASER}
                  title="MAD Tower Defense teaser"
                  className="absolute inset-0 h-full w-full"
                  allow="autoplay; fullscreen"
                  allowFullScreen
                />
              </div>
            </SectionShell>

            <SectionShell>
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
            </SectionShell>
          </div>
        </div>
      </div>
    </div>
  );
}
