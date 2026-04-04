"use client";

import React from "react";
import Image from "next/image";

type LoreEvent = {
  date: string;
  title: string;
  desc: string;
  accent?: "red" | "amber" | "neutral";
};

const EVENTS: LoreEvent[] = [
  {
    date: "Mar 2026",
    title: "THE FIRST MAD GAMES",
    desc: "The first MAD Games was held inside Roblox — a live experiment where chaos met competition. Players entered the arena for a chance to earn real SOL. 6 winners emerged from the madness, splitting a 3.5 SOL prize pool. First place secured 1 SOL, establishing the first hierarchy of skill, timing, and survival. This marked a shift: $MAD was no longer just a token… it had become a game.",
    accent: "red",
  },
  {
    date: "Mar 19, 2026",
    title: "VERIFIED BY JUPITER",
    desc: "$MAD was officially verified on Jupiter. What began as chaos was now recognized by the system itself. Not because it changed — but because it became impossible to ignore.",
    accent: "amber",
  },
  {
    date: "Mar 4, 2026",
    title: "THE GORK MOMENT",
    desc: "After the 400M burn milestone, the $MAD dev grew frustrated seeing Gork publicly favor another project ($pigeon) over $MAD. The dev confronted him directly. Gork responded casually: 'lmao yeah burn that 800m.' What began as a jab instantly became the next mission. On March 4th, the journey toward burning 800,000,000 total $MAD officially began.",
    accent: "amber",
  },
  {
    date: "Mar 1, 2026",
    title: "THE 400M BURN",
    desc: "March 1st marked a defining milestone. 400,000,000 $MAD tokens were permanently burned, reaching a 40% burn rate. It wasn’t destruction — it was refinement. Scarcity strengthened conviction and proved the discipline behind the anti-rug structure.",
    accent: "red",
  },
  {
    date: "Late Feb, 2026",
    title: "THE SILENT BURN",
    desc: "Before the major milestone, 33,000,000 tokens were quietly burned from a side wallet. There was no announcement and no spectacle. Observers were left wondering what happened. But the intention was simple: reduce supply and reinforce the long-term structure of $MAD.",
    accent: "amber",
  },
  {
    date: "Feb 20, 2026 — 11:32 AM",
    title: "THE COMEBACK",
    desc: "I woke up and our Telegram had been deleted. But they can’t delete belief. $MAD rose back up again.",
    accent: "red",
  },
  {
    date: "Feb 18, 2026 — 3:19 PM",
    title: "THE ATTACK",
    desc: "Telegram and Dexscreener were botted. Noise attempted to bury signal. $MAD continued forward.",
    accent: "amber",
  },
  {
    date: "Feb 15, 2026",
    title: "THE MADNESS BECAME VISIBLE",
    desc: "$MAD was officially listed on CoinGecko. What began as raw emotion and signal could now be tracked by the wider world. Visibility increased. The madness became impossible to ignore.",
    accent: "amber",
  },
  {
    date: "Feb 14, 2026",
    title: "RECLAMATION",
    desc: "Telegram ownership was secured for $200 to retain members and avoid disruption. Not ego—responsibility.",
    accent: "neutral",
  },
  {
    date: "Feb 7, 2026 — 16:56",
    title: "BONDING",
    desc: "Liquidity bonded at ~35.06K MC (USD). Infrastructure hardened. Volatility met structure.",
    accent: "red",
  },
  {
    date: "Launch week",
    title: "THE TRIAL — The 5% Wallet",
    desc: "A wallet held ~5% of supply for about 3 days. Everyone demanded a relaunch. But $MAD did not reset. Discipline over panic.",
    accent: "amber",
  },
  {
    date: "Feb 5, 2026",
    title: "COMMUNITY IGNITES",
    desc: "Telegram launched (created by a helper). The first gathering formed. Momentum found a channel.",
    accent: "neutral",
  },
  {
    date: "Feb 4, 2026 — 6:27:24 PM",
    title: "GENESIS",
    desc: "$MAD was minted. Emotion became code. Not a reset. Not a test run. A beginning.",
    accent: "red",
  },
];

function AccentText({
  children,
  tone = "red",
}: {
  children: React.ReactNode;
  tone?: "red" | "amber" | "neutral";
}) {
  if (tone === "amber") {
    return (
      <span className="text-amber-300 drop-shadow-[0_0_10px_rgba(255,180,0,0.35)]">
        {children}
      </span>
    );
  }

  if (tone === "neutral") {
    return <span className="text-white">{children}</span>;
  }

  return (
    <span className="text-red-500 drop-shadow-[0_0_12px_rgba(255,0,0,0.55)]">
      {children}
    </span>
  );
}

export default function LorePage() {
  return (
    <div className="relative overflow-hidden bg-black text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(255,0,60,0.16),transparent_40%),radial-gradient(circle_at_82%_22%,rgba(255,90,0,0.10),transparent_34%),radial-gradient(circle_at_50%_100%,rgba(120,0,0,0.16),transparent_45%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.02),transparent_20%,transparent_80%,rgba(255,255,255,0.015))]" />

      <div className="relative mx-auto max-w-6xl px-6 pb-24 pt-16 sm:px-8 lg:px-10">
        <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] p-7 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,0,60,0.12),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(255,60,0,0.08),transparent_25%)]" />

          <div className="relative mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.38em] text-white/45">
              FOUNDER ARCHIVE
            </p>

            <h1 className="mt-5 text-5xl font-black tracking-tight sm:text-6xl lg:text-7xl">
              The <AccentText>$MAD</AccentText> Chronicle
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/65 sm:text-lg">
              Not a dev log. Not recycled hype. A record of pressure, decisions,
              survival, and structure built in public.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <div className="rounded-full border border-red-500/20 bg-red-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-red-200">
                Legacy Timeline
              </div>
              <div className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white/70">
                {EVENTS.length} Entries
              </div>
              <div className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white/70">
                Discipline Over Panic
              </div>
            </div>

            <div className="mt-10 flex justify-center">
              <div className="relative h-[140px] w-[140px] sm:h-[160px] sm:w-[160px]">
                <div className="absolute inset-0 rounded-full bg-red-500/10 blur-2xl" />
                <Image
                  src="/stickers/never-selling.webp"
                  alt="Never Selling"
                  fill
                  sizes="160px"
                  className="object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)]"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        <section className="relative mt-12">
          <div className="absolute bottom-0 left-[15px] top-0 hidden w-px bg-gradient-to-b from-red-500/30 via-white/10 to-transparent md:block" />

          <div className="space-y-6">
            {EVENTS.map((e, idx) => (
              <div key={idx} className="relative md:pl-14">
                <div className="absolute left-0 top-7 hidden md:block">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border border-red-500/25 bg-black shadow-[0_0_25px_rgba(255,0,0,0.12)]">
                    <div className="h-2.5 w-2.5 rounded-full bg-red-500 shadow-[0_0_12px_rgba(255,0,0,0.75)]" />
                  </div>
                </div>

                <article className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.35)] backdrop-blur-xl transition duration-300 hover:border-red-500/25 hover:bg-white/[0.045]">
                  <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/40">
                    {e.date}
                  </p>

                  <h3 className="mt-3 text-2xl font-black sm:text-3xl">
                    <AccentText tone={e.accent}>{e.title}</AccentText>
                  </h3>

                  <p className="mt-4 max-w-4xl leading-relaxed text-white/72">
                    {e.desc}
                  </p>
                </article>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] shadow-[0_18px_50px_rgba(0,0,0,0.35)]">
          <div className="relative w-full" style={{ aspectRatio: "3 / 4" }}>
            <Image
              src="/lore/believe.webp"
              alt="Believe"
              fill
              sizes="(max-width: 1024px) 100vw, 900px"
              className="object-cover"
              priority={false}
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
          </div>
        </section>

        <section className="mt-10 rounded-[2rem] border border-white/10 bg-white/[0.03] p-8 text-center shadow-[0_18px_50px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-10">
          <h2 className="text-3xl font-black text-white sm:text-4xl">
            You Can Delete A Channel.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-white/70">
            But you can’t delete belief.
            <br />
            And <span className="font-bold text-red-500">$MAD</span> doesn’t
            reset.
          </p>
        </section>
      </div>
    </div>
  );
}
