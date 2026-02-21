"use client";

import Image from "next/image";

export default function MemeVaultPage() {
  const memes = [
    "/memes/mad-meme-alarm.png",
    "/memes/mad-meme-chipsbagofair.png",
    "/memes/mad-meme-coffeehot.png",
    "/memes/mad-meme-coldshower.png",
    "/memes/mad-meme-lipbalm.png",
    "/memes/mad-meme-nogym.png",
    "/memes/mad-meme-toiletpaper.png",
    "/memes/mad-meme-wifibuffer.png",
  ];

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,0,60,0.22),transparent_55%),radial-gradient(circle_at_80%_40%,rgba(255,80,0,0.18),transparent_60%),radial-gradient(circle_at_50%_90%,rgba(255,0,0,0.14),transparent_55%)]" />

      <div className="relative mx-auto max-w-6xl px-6 pt-16 pb-24">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/60">
          CULTURE
        </p>

        <h1 className="mt-6 text-6xl font-black tracking-tight sm:text-7xl">
          Meme{" "}
          <span className="text-red-500 drop-shadow-[0_0_12px_rgba(255,0,0,0.65)]">
            Vault
          </span>
        </h1>

        <p className="mt-6 max-w-xl text-white/60">
          Official $MAD culture archive.
        </p>

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {memes.map((src) => (
            <div
              key={src}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl transition-transform duration-300 hover:scale-[1.02]"
            >
              <div className="relative w-full aspect-[4/3]">
                <Image
                  src={src}
                  alt="$MAD meme"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
