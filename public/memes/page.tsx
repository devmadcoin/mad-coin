"use client";

import Image from "next/image";

export default function MemeVaultPage() {
  const memes = [
    { src: "/memes/mad-meme-alarm.png", label: "Alarm" },
    { src: "/memes/mad-meme-chipsbagofair.png", label: "Chips Bag of Air" },
    { src: "/memes/mad-meme-coffeehot.png", label: "Coffee Too Hot" },
    { src: "/memes/mad-meme-coldshower.png", label: "Cold Shower" },
    { src: "/memes/mad-meme-lipbalm.png", label: "Lip Balm" },
    { src: "/memes/mad-meme-nogym.png", label: "No Gym" },
    { src: "/memes/mad-meme-toiletpaper.png", label: "Toilet Paper" },
    { src: "/memes/mad-meme-wifibuffer.png", label: "WiFi Buffer" },
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,0,60,0.22),transparent_55%),radial-gradient(circle_at_80%_40%,rgba(255,80,0,0.18),transparent_60%),radial-gradient(circle_at_50%_90%,rgba(255,0,0,0.14),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-25 [background:linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:48px_48px]" />

      <div className="relative mx-auto max-w-6xl px-6 pt-16 pb-24">
        {/* Header */}
        <h1 className="text-6xl font-black tracking-tight sm:text-7xl">
          Meme{" "}
          <span className="text-red-500 drop-shadow-[0_0_12px_rgba(255,0,0,0.65)]">
            Vault
          </span>
        </h1>

        <p className="mt-6 max-w-xl text-white/60">
          Official $MAD culture archive. Built to be shared.
        </p>

        {/* Grid */}
        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {memes.map((m) => (
            <a
              key={m.src}
              href={m.src}
              target="_blank"
              rel="noreferrer"
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl transition-transform duration-300 hover:scale-[1.02]"
              title={`Open: ${m.label}`}
            >
              <div className="relative w-full aspect-[4/3]">
                <Image
                  src={m.src}
                  alt={`$MAD meme: ${m.label}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                />
              </div>

              {/* Bottom label bar */}
              <div className="absolute inset-x-0 bottom-0 p-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/50 px-3 py-1 text-xs font-semibold text-white/80 backdrop-blur">
                  <span className="h-2 w-2 rounded-full bg-red-500 shadow-[0_0_12px_rgba(255,0,0,0.7)]" />
                  {m.label}
                </div>
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
