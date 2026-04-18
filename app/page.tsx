"use client";

import Link from "next/link";
import MadConfessions from "./components/MadConfessions";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-black px-4 py-6 text-white sm:px-6 sm:py-8 lg:px-8">
      {/* BACKGROUND */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,48,48,0.12),transparent_35%),radial-gradient(circle_at_20%_20%,rgba(255,0,60,0.08),transparent_30%),radial-gradient(circle_at_80%_30%,rgba(255,80,0,0.06),transparent_30%)]" />
        <div className="absolute inset-0 opacity-[0.05] [background-image:linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:40px_40px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/70" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        {/* HERO */}
        <section className="overflow-hidden rounded-[30px] border border-white/10 bg-[#0a0a0a]/90 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl">
          <div className="grid items-center gap-8 lg:grid-cols-[1fr_0.95fr]">
            
            {/* LEFT */}
            <div className="px-6 py-10 sm:px-8 sm:py-12 lg:px-10 lg:py-14">
              <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-white/35">
                CONTROL YOURSELF
              </p>

              <h1 className="mt-5 text-4xl font-black leading-[0.9] tracking-[-0.04em] sm:text-5xl lg:text-7xl">
                <span className="text-red-500 drop-shadow-[0_0_16px_rgba(255,0,0,0.45)]">
                  STOP
                </span>{" "}
                PANICKING.
                <br />
                START BEING{" "}
                <span className="text-red-500 drop-shadow-[0_0_16px_rgba(255,0,0,0.45)]">
                  $MAD
                </span>{" "}
                <span className="text-green-400 drop-shadow-[0_0_16px_rgba(0,255,120,0.35)]">
                  RICH
                </span>
                .
              </h1>

              <p className="mt-5 max-w-xl text-sm leading-7 text-white/60 sm:text-base">
                Most people panic. You don’t have to.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/mad-mind"
                  className="inline-flex items-center justify-center rounded-full bg-red-500 px-5 py-2.5 text-sm font-bold text-white transition duration-200 hover:scale-[1.02] hover:bg-red-400"
                >
                  Enter MAD Mind
                </Link>

                <a
                  href="#confessions"
                  className="inline-flex items-center justify-center rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold text-white transition duration-200 hover:border-white/40 hover:bg-white/5"
                >
                  See What People Are Saying
                </a>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45 sm:text-xs">
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                  Anonymous
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                  Real People
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                  Live Reactions
                </span>
              </div>
            </div>

            {/* RIGHT */}
            <div className="relative flex justify-center px-6 pb-8 sm:px-8 lg:px-10 lg:pb-0">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,60,60,0.12),transparent_45%)]" />
              <video
                autoPlay
                muted
                loop
                playsInline
                className="relative w-full max-w-md rounded-2xl border border-white/10 bg-black shadow-[0_18px_60px_rgba(0,0,0,0.45)]"
              >
                <source src="/loops/bullish-mad.mp4" type="video/mp4" />
              </video>
            </div>
          </div>
        </section>

        {/* CONFESSIONS */}
        <section
          id="confessions"
          className="mt-10 rounded-[30px] border border-white/10 bg-[#0a0a0a]/90 p-6 shadow-[0_20px_70px_rgba(0,0,0,0.4)] backdrop-blur-xl sm:p-8"
        >
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-white/35">
                MAD CONFESSIONS
              </p>

              <h2 className="mt-3 text-3xl font-black leading-tight sm:text-4xl">
                Say what you’re really thinking.
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-white/60 sm:text-base">
                People share what they actually feel. Others react. The real ones rise to the top.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/45 sm:text-xs">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                Trending
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                Most Liked
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                Live
              </span>
            </div>
          </div>

          <MadConfessions />
        </section>

        {/* MINI FOOTER */}
        <section className="mt-8 rounded-[24px] border border-white/10 bg-white/[0.03] px-5 py-4 text-center shadow-[0_12px_40px_rgba(0,0,0,0.25)]">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
            Stay $MAD
          </p>
          <p className="mt-2 text-sm text-white/60">
            Most people panic. You don’t have to.
          </p>
        </section>
      </div>
    </div>
  );
}
