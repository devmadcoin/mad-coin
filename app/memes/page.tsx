"use client";

import Image from "next/image";
import Link from "next/link";

const ART_FILES = [
  "MAD-2-MONTHS.png",
  "MAD-ARMY.png",
  "MAD-AT-BEARS.png",
  "MAD-BELIEVE.png",
  "MAD-BELIEVING.png",
  "MAD-COMMUNITY.png",
  "MAD-DOCTOR.png",
  "MAD-DOLLAR.png",
  "MAD-HOLD-ON-DEAR-LIFE.png",
  "MAD-KINGS-ONLY.png",
  "MAD-MONTH.png",
  "MAD-NEPTUNE.png",
  "MAD-RICH-IN-THE-TUB.png",
  "MAD-RICH-OR-BROKE.png",
  "MAD-SCHOOL.png",
  "MAD-YOU-SIDELINED.png",
  "MAKE-MAD-GREAT-AGAIN.png",
  "WE-MAD-ZOOMIN.png",
  "YOU-MAKE-ME-MAD.png",
  "YOU-WILL-BE-MAD.png",
];

function cleanTitle(name: string) {
  return name
    .replace(".png", "")
    .replaceAll("-", " ")
    .toUpperCase();
}

export default function MemesPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <main className="mx-auto max-w-7xl px-4 pb-24 pt-8 sm:px-6 lg:px-8">
        <section className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 sm:p-10">
          <p className="text-xs uppercase tracking-[0.34em] text-red-300/70">
            $MAD ART
          </p>

          <h1 className="mt-4 text-4xl font-black sm:text-6xl">
            The <span className="text-red-500">$MAD</span> Art Vault.
          </h1>

          <p className="mt-5 max-w-3xl text-base leading-8 text-white/70 sm:text-lg">
            Posters. Memes. Identity. Chaos turned into visuals.
          </p>
        </section>

        <section className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {ART_FILES.map((file) => {
            const imageSrc = `/memes/${file}`;
            const title = cleanTitle(file);

            return (
              <div
                key={file}
                className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/25 transition hover:border-white/20"
              >
                <div className="relative aspect-square">
                  <Image
                    src={imageSrc}
                    alt={title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                  />
                </div>

                <div className="p-4">
                  <p className="text-sm font-black text-white">{title}</p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <a
                      href={imageSrc}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-white/80 transition hover:border-white/20 hover:bg-white/[0.08]"
                    >
                      View
                    </a>

                    <a
                      href={imageSrc}
                      download={file}
                      className="inline-flex rounded-full border border-red-500/35 bg-red-500 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-white transition hover:scale-[1.02] hover:bg-red-400"
                    >
                      Download
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        <section className="mt-10 rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 sm:p-10">
          <p className="text-xs uppercase tracking-[0.34em] text-red-300/70">
            FORGE
          </p>

          <h2 className="mt-4 text-3xl font-black sm:text-5xl">
            Build the next layer of $MAD.
          </h2>

          <p className="mt-4 max-w-3xl text-base leading-8 text-white/70">
            More art. More identity. More collectible energy.
          </p>

          <Link
            href="/forge"
            className="mt-6 inline-flex rounded-full bg-red-500 px-8 py-4 text-sm font-black text-white transition hover:scale-[1.02] hover:bg-red-400"
          >
            Enter Forge →
          </Link>
        </section>
      </main>
    </div>
  );
}
