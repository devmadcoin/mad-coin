"use client";

import Image from "next/image";
import Link from "next/link";
import MadConfessions from "./components/MadConfessions";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white px-4 py-8">
      
      {/* HERO */}
      <div className="max-w-6xl mx-auto rounded-[30px] border border-white/10 bg-[#0a0a0a] p-8 flex flex-col lg:flex-row items-center justify-between gap-8">
        
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

          <div className="mt-6 flex gap-3">
            <Link
              href="/mad-mind"
              className="bg-red-500 px-5 py-2 rounded-full font-bold"
            >
              Enter MAD Mind
            </Link>

            <a
              href="#confessions"
              className="border border-white/20 px-5 py-2 rounded-full"
            >
              View Confessions
            </a>
          </div>
        </div>

        {/* RIGHT VISUAL */}
        <div className="flex-1 flex justify-center">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="rounded-xl w-full max-w-md"
          >
            <source src="/loops/bullish-mad.mp4" type="video/mp4" />
          </video>
        </div>
      </div>

      {/* CONFESSIONS */}
      <div id="confessions" className="max-w-6xl mx-auto mt-10">
        <h2 className="text-3xl font-black mb-4">
          MAD Confessions
        </h2>

        <MadConfessions />
      </div>
    </div>
  );
}
