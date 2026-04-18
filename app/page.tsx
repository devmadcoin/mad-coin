"use client";

import Link from "next/link";
import MadConfessions from "./components/MadConfessions";

export default function Home() {
  return (
    <div className="min-h-screen bg-black px-4 py-8 text-white">
      {/* HERO */}
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-8 rounded-[30px] border border-white/10 bg-[#0a0a0a] p-8 lg:flex-row">
        {/* LEFT TEXT */}
        <div className="flex-1">
          <h1 className="text-5xl font-black leading-tight">
            <span className="text-red-500">STOP</span> TRADING NOISE.
            <br />
            START BEING{" "}
            <span className="text-red-500">$MAD</span>{" "}
            <span className="text-green-400">RICH</span>.
          </h1>

          <p className="mt-4 text-white/60">
            Control the chaos. Or it controls you.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/mad-mind"
              className="rounded-full bg-red-500 px-5 py-2 font-bold text-white transition hover:bg-red-400"
            >
              Enter MAD Mind
            </Link>

            <a
              href="#confessions"
              className="rounded-full border border-white/20 px-5 py-2 transition hover:border-white/40 hover:bg-white/5"
            >
              View Confessions
            </a>
          </div>
        </div>

        {/* RIGHT VISUAL */}
        <div className="flex flex-1 justify-center">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full max-w-md rounded-xl"
          >
            <source src="/loops/bullish-mad.mp4" type="video/mp4" />
          </video>
        </div>
      </div>

      {/* CONFESSIONS */}
      <div id="confessions" className="mx-auto mt-10 max-w-6xl">
        <h2 className="mb-4 text-3xl font-black">MAD Confessions</h2>
        <MadConfessions />
      </div>
    </div>
  );
}
