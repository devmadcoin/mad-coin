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
    date: "Feb 4, 2026 — 6:27:24 PM",
    title: "GENESIS",
    desc: "$MAD was minted. Emotion became code. Not a reset. Not a test run. A beginning.",
    accent: "red",
  },
  {
    date: "Feb 5, 2026",
    title: "COMMUNITY IGNITES",
    desc: "Telegram launched (created by a helper). The first gathering formed. Momentum found a channel.",
    accent: "neutral",
  },
  {
    date: "Launch Week",
    title: "THE TRIAL — The 5% Wallet",
    desc: "A wallet held ~5% of supply for about 3 days. Everyone demanded a relaunch. But $MAD did not reset. Discipline over panic.",
    accent: "amber",
  },
  {
    date: "Feb 7, 2026 — 16:56",
    title: "BONDING",
    desc: "Liquidity bonded at ~35.06K MC (USD). Infrastructure hardened. Volatility met structure.",
    accent: "red",
  },
  {
    date: "Feb 14, 2026",
    title: "RECLAMATION",
    desc: "Telegram ownership was secured for $200 to retain members and avoid disruption. Not ego—responsibility.",
    accent: "neutral",
  },
  {
    date: "Feb 18, 2026 — 3:19 PM",
    title: "THE ATTACK",
    desc: "Coordinated botting hit Telegram and Dexscreener. Noise tried to bury signal. But $MAD kept moving.",
    accent: "amber",
  },
  {
    date: "Feb 20, 2026 — 11:32 AM",
    title: "THE COMEBACK",
    desc: "I woke up and our Telegram had been deleted. But they can’t delete belief. $MAD rose back up again.",
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
  if (tone === "neutral") return <span className="text-white">{children}</span>;

  return (
    <span className="text-red-500 drop-shadow-[0_0_12px_rgba(255,0,0,0.65)]">
      {children}
    </span>
  );
}

export default function LorePage() {
  return (
    <div className="relative overflow-hidden">
      {/* background (matches other pages) */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,0,60,0.22),transparent_55%),radial-gradient(circle_at_80%_40%,rgba(255,80,0,0.18),transparent_60%),radial-gradient(circle_at_50%_90%,rgba(255,0,0,0.14),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-25 [background:linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:48px_48px]" />

      <div className="relative mx-auto max-w-6xl px-6 pt-16 pb-24">
        {/* Header */}
        <div className="mx-auto max-w-3xl animate-fadeUp text-center">
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

          {/* Sticker (swap to Never Selling) */}
          <div className="mt-10 flex justify-center">
            <div className="relative h-[150px] w-[150px] rotate-[-2deg] drop-shadow-[0_18px_38px_rgba(0,0,0,0.55)]">
              <Image
                src="/stickers/never-selling.webp"
                alt="Never Selling"
                fill
                sizes="150px"
                className="object-contain"
                priority={false}
              />
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="mt-14 grid gap-6 lg:grid-cols-12">
          {/* left rail */}
          <div className="hidden lg:block lg:col-span-3">
            <div className="sticky top-24 rounded-3xl border border-white/10 bg-black/30 p-6 backdrop-blur-xl shadow-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/50">
                DOCTRINE
              </p>

              <p className="mt-4 text-sm text-white/75 leading-relaxed">
                One chain. One contract. One coin.
              </p>

              <p className="mt-4 text-sm text-white/70 leading-relaxed">
                <AccentText>Emotion evolves.</AccentText> Born in volatility.
                Refined through discipline.
              </p>

              <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-white/70">
                No relaunch. No reset. No fragmentation.
              </div>
            </div>
          </div>

          {/* timeline list */}
          <div className="lg:col-span-9">
            <div className="space-y-6">
              {EVENTS.map((e, idx) => (
                <div
                  key={`${e.title}-${idx}`}
                  className="animate-fadeUp rounded-3xl border border-white/10 bg-black/30 p-6 backdrop-blur-xl shadow-2xl"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/50">
                        {e.date}
                      </p>

                      <h3 className="mt-3 text-2xl sm:text-3xl font-black">
                        <AccentText tone={e.accent}>{e.title}</AccentText>
                      </h3>

                      <p className="mt-3 text-white/75 leading-relaxed">
                        {e.desc}
                      </p>
                    </div>

                    <div className="shrink-0">
                      <span
                        className={[
                          "inline-flex items-center rounded-full border px-4 py-2 text-xs font-semibold",
                          e.accent === "red"
                            ? "border-red-500/40 bg-red-500/15 text-red-300 shadow-[0_0_12px_rgba(255,0,0,0.35)]"
                            : e.accent === "amber"
                            ? "border-amber-400/30 bg-amber-400/10 text-amber-200"
                            : "border-white/10 bg-white/5 text-white/75",
                        ].join(" ")}
                      >
                        {e.accent === "red"
                          ? "CORE"
                          : e.accent === "amber"
                          ? "TRIAL"
                          : "NOTE"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Cinematic BELIEVE image block (above final quote) */}
              <div className="animate-fadeUp">
                <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black shadow-2xl">
                  <div className="relative w-full h-[520px] sm:h-[620px] md:h-[720px]">
                    <Image
                      src="/lore/believe.png"
                      alt="Believe"
                      fill
                      className="object-cover object-center"
                      sizes="100vw"
                      priority={false}
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                </div>
              </div>

              {/* Closing quote card */}
              <div className="animate-fadeUp rounded-3xl border border-white/10 bg-black/35 p-10 backdrop-blur-xl shadow-2xl text-center">
                <h3 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                  You Can Delete A Channel.
                </h3>

                <p className="mt-5 text-white/75 text-base sm:text-lg">
                  But you can’t delete belief.
                </p>

                <p className="mt-2 text-lg sm:text-xl font-black text-red-400 drop-shadow-[0_0_12px_rgba(255,0,0,0.35)]">
                  And $MAD doesn’t reset.
                </p>
              </div>
            </div>

            {/* mobile doctrine (since sticky rail is hidden) */}
            <div className="mt-10 lg:hidden animate-fadeUp rounded-3xl border border-white/10 bg-black/30 p-6 backdrop-blur-xl shadow-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/50">
                DOCTRINE
              </p>
              <p className="mt-4 text-sm text-white/75 leading-relaxed">
                One chain. One contract. One coin. No relaunch. No reset. No
                fragmentation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
