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
    desc: "The first MAD Games was held inside Roblox — chaos met competition. Real SOL rewards. 6 winners. A system was born. $MAD became more than a token.",
    accent: "red",
  },
  {
    date: "Mar 19, 2026",
    title: "VERIFIED BY JUPITER",
    desc: "$MAD was officially recognized by the system itself. Not because it changed — but because it became impossible to ignore.",
    accent: "amber",
  },
  {
    date: "Mar 4, 2026",
    title: "THE GORK MOMENT",
    desc: "A challenge became a mission. Burn 800M. The next phase of $MAD began.",
    accent: "amber",
  },
  {
    date: "Mar 1, 2026",
    title: "THE 400M BURN",
    desc: "40% of supply removed. Not destruction — refinement. Conviction strengthened.",
    accent: "red",
  },
  {
    date: "Feb 20, 2026",
    title: "THE COMEBACK",
    desc: "Telegram deleted. Community didn’t break. $MAD rose again.",
    accent: "red",
  },
  {
    date: "Feb 4, 2026",
    title: "GENESIS",
    desc: "$MAD was minted. Emotion became code.",
    accent: "red",
  },
];

function Accent({ children, tone = "red" }: any) {
  if (tone === "amber") {
    return <span className="text-amber-300">{children}</span>;
  }
  if (tone === "neutral") {
    return <span className="text-white">{children}</span>;
  }
  return (
    <span className="text-red-500 drop-shadow-[0_0_12px_rgba(255,0,0,0.6)]">
      {children}
    </span>
  );
}

export default function LorePage() {
  return (
    <div className="relative overflow-hidden bg-black text-white">

      {/* BACKGROUND */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,0,60,0.18),transparent_55%),radial-gradient(circle_at_80%_40%,rgba(255,80,0,0.12),transparent_60%)]" />

      <div className="relative mx-auto max-w-6xl px-6 pb-24 pt-20">

        {/* HERO */}
        <div className="text-center max-w-3xl mx-auto">
          <p className="text-xs tracking-[0.4em] text-white/40 uppercase">
            ARCHIVE
          </p>

          <h1 className="mt-6 text-5xl sm:text-7xl font-black">
            The <Accent>$MAD</Accent> Chronicle
          </h1>

          <p className="mt-4 text-white/60">
            Not updates. Not marketing.  
            A record of decisions, pressure, and survival.
          </p>

          <div className="mt-10 flex justify-center">
            <Image
              src="/stickers/never-selling.webp"
              alt="Never Selling"
              width={140}
              height={140}
              className="drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)]"
            />
          </div>
        </div>

        {/* TIMELINE */}
        <div className="mt-16 relative">

          {/* Vertical Line */}
          <div className="absolute left-4 top-0 bottom-0 w-[2px] bg-white/10" />

          <div className="space-y-10">
            {EVENTS.map((e, i) => (
              <div key={i} className="relative pl-12">

                {/* Dot */}
                <div className="absolute left-[6px] top-2 h-3 w-3 rounded-full bg-red-500 shadow-[0_0_10px_rgba(255,0,0,0.7)]" />

                {/* Card */}
                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl transition hover:border-red-500/30">

                  <p className="text-xs text-white/40 uppercase tracking-[0.3em]">
                    {e.date}
                  </p>

                  <h3 className="mt-2 text-xl font-bold">
                    <Accent tone={e.accent}>{e.title}</Accent>
                  </h3>

                  <p className="mt-3 text-white/65 text-sm leading-relaxed">
                    {e.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FINAL STATEMENT */}
        <div className="mt-20 text-center border border-white/10 rounded-3xl p-10 bg-white/[0.03]">
          <h2 className="text-3xl font-black">
            You Can Delete A Channel.
          </h2>

          <p className="mt-4 text-white/60">
            But you can’t delete belief.  
            And <span className="text-red-500 font-bold">$MAD</span> doesn’t reset.
          </p>
        </div>

      </div>
    </div>
  );
}
