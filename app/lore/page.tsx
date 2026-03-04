/* app/lore/page.tsx */
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
      <span className="text-amber-300 drop-shadow-[0_0_12px_rgba(255,170,0,0.45)]">
        {children}
      </span>
    );
  }

  if (tone === "neutral") {
    return <span className="text-white">{children}</span>;
  }

  return (
    <span className="text-red-500 drop-shadow-[0_0_12px_rgba(255,0,0,0.65)]">
      {children}
    </span>
  );
}

export default function LorePage() {
  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,0,60,0.22),transparent_55%),radial-gradient(circle_at_80%_40%,rgba(255,80,0,0.18),transparent_60%),radial-gradient(circle_at_50%_90%,rgba(255,0,0,0.14),transparent_55%)]" />

      <div className="relative mx-auto max-w-6xl px-6 pt-16 pb-24">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/50">
            LORE
          </p>

          <h1 className="mt-6 text-6xl font-black tracking-tight sm:text-7xl">
            The <AccentText>$MAD</AccentText> Chronicle
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-white/65 leading-relaxed">
            Not a dev log. A founder chronicle. Structure before hype. Discipline
            over panic.
          </p>

          <div className="mt-10 flex justify-center">
            <div className="relative h-[150px] w-[150px] rotate-[-2deg] drop-shadow-[0_18px_38px_rgba(0,0,0,0.55)]">
              <Image
                src="/stickers/never-selling.webp"
                alt="Never Selling"
                fill
                sizes="150px"
                className="object-contain"
              />
            </div>
          </div>
        </div>

        <div className="mt-14 space-y-6">
          {EVENTS.map((e, idx) => (
            <div
              key={idx}
              className="rounded-3xl border border-white/10 bg-black/30 p-6 backdrop-blur-xl shadow-2xl"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/50">
                {e.date}
              </p>

              <h3 className="mt-3 text-2xl font-black">
                <AccentText tone={e.accent}>{e.title}</AccentText>
              </h3>

              <p className="mt-3 text-white/75 leading-relaxed">{e.desc}</p>
            </div>
          ))}

          <div className="overflow-hidden rounded-3xl border border-white/10 bg-black/40 shadow-2xl">
            <div className="relative w-full" style={{ aspectRatio: "3 / 4" }}>
              <Image
                src="/lore/believe.webp"
                alt="Believe"
                fill
                sizes="(max-width: 1024px) 100vw, 900px"
                className="object-cover"
                priority
              />
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-black/35 p-8 text-center shadow-2xl">
            <h3 className="text-3xl sm:text-4xl font-black text-white">
              You Can Delete A Channel.
            </h3>

            <p className="mt-4 text-white/70">
              But you can’t delete belief.
              <br />
              And <span className="text-red-500 font-bold">$MAD</span> doesn’t
              reset.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
