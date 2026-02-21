"use client";

import Image from "next/image";

type MemeItem = {
  src: string; // must match /public/memes/*
  title: string;
};

const MEMES: MemeItem[] = [
  { src: "/memes/mad-meme-alarm.png", title: "Alarm" },
  { src: "/memes/mad-meme-chipsbagofair.png", title: "Chips Bag of Air" },
  { src: "/memes/mad-meme-coffeehot.png", title: "Coffee Too Hot" },
  { src: "/memes/mad-meme-coldshower.png", title: "Cold Shower" },
  { src: "/memes/mad-meme-lipbalm.png", title: "Lip Balm" },
  { src: "/memes/mad-meme-nogym.png", title: "No Gym" },
  { src: "/memes/mad-meme-toiletpaper.png", title: "Toilet Paper" },
  { src: "/memes/mad-meme-wifibuffer.png", title: "WiFi Buffer" },
];

function downloadNameFromSrc(src: string) {
  return src.split("/").pop() || "mad-meme.png";
}

export default function MemesPage() {
  // ✅ Change this ONE path if your sticker filename is different
  // Put the sticker in: /public/stickers/sticker-smash.webp
  const stickerSrc = "/stickers/sticker-smash.webp";

  return (
    <div className="relative overflow-hidden">
      {/* background (matches your other pages) */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,0,60,0.22),transparent_55%),radial-gradient(circle_at_80%_40%,rgba(255,80,0,0.18),transparent_60%),radial-gradient(circle_at_50%_90%,rgba(255,0,0,0.14),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-25 [background:linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:48px_48px]" />

      <div className="relative mx-auto max-w-6xl px-6 pt-16 pb-24">
        {/* Header */}
        <div className="relative mx-auto max-w-3xl animate-fadeUp">
          {/* ✅ Sticker (desktop only, floats near the header) */}
          <div className="pointer-events-none absolute right-[-90px] top-[-18px] hidden lg:block">
            <div className="relative h-[140px] w-[140px] rotate-[-8deg] drop-shadow-[0_25px_45px_rgba(0,0,0,0.6)] transition-transform duration-300 hover:rotate-0 hover:scale-105">
              <Image
                src={stickerSrc}
                alt="Smash Sticker"
                fill
                sizes="140px"
                className="object-contain"
                priority={false}
              />
            </div>
          </div>

          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/50">
            CULTURE
          </p>

          <h1 className="mt-6 text-6xl font-black tracking-tight sm:text-7xl">
            Meme{" "}
            <span className="text-red-500 drop-shadow-[0_0_12px_rgba(255,0,0,0.65)]">
              Vault
            </span>
          </h1>

          <p className="mt-5 max-w-2xl text-white/65 leading-relaxed">
            Your{" "}
            <span className="text-red-500 drop-shadow-[0_0_10px_rgba(255,0,0,0.55)]">
              $MAD
            </span>{" "}
            meme gallery — click any meme to open it, or hit download.
          </p>
        </div>

        {/* Grid */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {MEMES.map((m) => (
            <div
              key={m.src}
              className="group overflow-hidden rounded-3xl border border-white/10 bg-black/30 backdrop-blur-xl shadow-2xl"
            >
              <a
                href={m.src}
                target="_blank"
                rel="noreferrer"
                className="block"
                title="Open full size"
              >
                <div className="relative aspect-[16/9] w-full">
                  <Image
                    src={m.src}
                    alt={m.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    priority={false}
                  />
                </div>
              </a>

              <div className="flex items-center justify-between gap-3 p-4">
                <div className="min-w-0">
                  <p className="truncate text-sm font-black text-white/90">
                    {m.title}
                  </p>
                  <p className="truncate text-xs text-white/40">{m.src}</p>
                </div>

                <a
                  href={m.src}
                  download={downloadNameFromSrc(m.src)}
                  className="shrink-0 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white/90 transition hover:bg-white/10"
                >
                  Download
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Tiny debug helper */}
        <div className="mt-10 text-xs text-white/35">
          If a tile is blank: the filename in{" "}
          <span className="text-white/60">/public/memes/</span> must match the
          list exactly (no extra spaces, no uppercase .PNG).
        </div>
      </div>
    </div>
  );
}
