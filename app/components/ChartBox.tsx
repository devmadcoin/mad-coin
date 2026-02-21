"use client";

import React from "react";

export default function ChartBox({ url }: { url: string }) {
  return (
    <section className="mt-10">
      <div className="rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl overflow-hidden shadow-[0_0_0_1px_rgba(255,255,255,0.06)]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-white/50">Live Chart</p>
            <h2 className="mt-1 text-lg font-black text-white">Track Momentum</h2>
          </div>

          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="rounded-full px-4 py-2 text-sm font-black border border-white/10 bg-white/5 hover:bg-white/10 transition"
          >
            Open ↗
          </a>
        </div>

        {/* Responsive iframe */}
        <div className="relative w-full" style={{ paddingTop: "62%" }}>
          <iframe
            className="absolute inset-0 h-full w-full"
            src={url}
            title="Dexscreener Chart"
            loading="lazy"
            allow="clipboard-write; encrypted-media"
          />
        </div>
      </div>

      <p className="mt-3 text-xs text-white/45">
        Not financial advice. Signal display only.
      </p>
    </section>
  );
}
