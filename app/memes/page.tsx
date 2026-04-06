"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

type Category =
  | "All"
  | "New Drop"
  | "Archive"
  | "Army"
  | "Philosophy"
  | "Meme"
  | "Signal";

type ArtItem = {
  src: string;
  title: string;
  category: Exclude<Category, "All">;
  featured?: boolean;
};

const NEW_ART: ArtItem[] = [
  {
    src: "/memes/WE-MAD-ZOOMIN.png",
    title: "We MAD Zoomin",
    category: "Signal",
    featured: true,
  },
  {
    src: "/memes/MAD-2-MONTHS.png",
    title: "MAD 2 Months",
    category: "Signal",
    featured: true,
  },
  {
    src: "/memes/MAD-KINGS-ONLY.png",
    title: "MAD Kings Only",
    category: "Signal",
    featured: true,
  },
  {
    src: "/memes/MAD-NEPTUNE.png",
    title: "MAD Neptune",
    category: "Philosophy",
    featured: false,
  },
  {
    src: "/memes/MAD-RICH-IN-THE-TUB.png",
    title: "MAD Rich in the Tub",
    category: "Meme",
    featured: true,
  },
];

const ARCHIVE_ART: ArtItem[] = [
  { src: "/memes/MAD-ARMY.png", title: "MAD Army", category: "Army", featured: true },
  { src: "/memes/MAD-AT-BEARS.png", title: "MAD at Bears", category: "Meme", featured: true },
  { src: "/memes/MAD-BELIEVE.png", title: "MAD Believe", category: "Philosophy", featured: true },
  { src: "/memes/MAD-BELIEVING.png", title: "MAD Believing", category: "Philosophy" },
  { src: "/memes/MAD-COMMUNITY.png", title: "MAD Community", category: "Signal" },
  { src: "/memes/MAD-DOCTOR.png", title: "MAD Doctor", category: "Meme" },
  { src: "/memes/MAD-DOLLAR.png", title: "MAD Dollar", category: "Signal" },
  {
    src: "/memes/MAD-HOLD-ON-DEAR-LIFE.png",
    title: "MAD Hold On Dear Life",
    category: "Signal",
  },
  { src: "/memes/MAD-MONTH.png", title: "MAD Month", category: "Signal" },
  { src: "/memes/MAD-RICH-OR-BROKE.png", title: "MAD Rich or Broke", category: "Meme" },
  { src: "/memes/MAD-SCHOOL.png", title: "MAD School", category: "Meme" },
  { src: "/memes/MAD-YOU-SIDELINED.png", title: "MAD You Sidelined", category: "Signal" },
  { src: "/memes/MAKE-MAD-GREAT-AGAIN.png", title: "Make MAD Great Again", category: "Meme" },
  { src: "/memes/YOU-MAKE-ME-MAD.png", title: "You Make Me MAD", category: "Meme" },
  { src: "/memes/YOU-WILL-BE-MAD.png", title: "You Will Be MAD", category: "Signal" },

  { src: "/memes/mad-meme-alarm.png", title: "Alarm", category: "Meme" },
  { src: "/memes/mad-meme-chipsbagofair.png", title: "Chips Bag of Air", category: "Meme" },
  { src: "/memes/mad-meme-coffeehot.png", title: "Coffee Too Hot", category: "Meme" },
  { src: "/memes/mad-meme-coldshower.png", title: "Cold Shower", category: "Meme" },
  { src: "/memes/mad-meme-lipbalm.png", title: "Lip Balm", category: "Meme" },
  { src: "/memes/mad-meme-nogym.png", title: "No Gym", category: "Meme" },
  { src: "/memes/mad-meme-toiletpaper.png", title: "Toilet Paper", category: "Meme" },
  { src: "/memes/mad-meme-wifibuffer.png", title: "WiFi Buffer", category: "Meme" },
];

const ALL_ART: ArtItem[] = [...NEW_ART, ...ARCHIVE_ART];

const FILTERS: Category[] = [
  "All",
  "New Drop",
  "Archive",
  "Army",
  "Philosophy",
  "Meme",
  "Signal",
];

function downloadNameFromSrc(src: string) {
  return src.split("/").pop() || "mad-art.png";
}

function getVisibleArt(activeFilter: Category, items: ArtItem[]) {
  if (activeFilter === "All") return items;
  if (activeFilter === "Archive") return items.filter((item) => item.category !== "New Drop");
  return items.filter((item) => item.category === activeFilter);
}

function ArtCard({
  item,
  index,
}: {
  item: ArtItem;
  index: number;
}) {
  return (
    <article className="group overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.035] shadow-[0_18px_50px_rgba(0,0,0,0.35)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-red-500/25 hover:shadow-[0_24px_70px_rgba(120,0,0,0.28)]">
      <a
        href={item.src}
        target="_blank"
        rel="noreferrer"
        className="block"
        title={`Open ${item.title}`}
      >
        <div className="relative aspect-[4/5] w-full overflow-hidden">
          <Image
            src={item.src}
            alt={item.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover transition duration-500 group-hover:scale-[1.04]"
            priority={index < 6}
          />

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent opacity-90" />

          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            <div className="rounded-full border border-white/10 bg-black/45 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-white/70 backdrop-blur-md">
              $MAD Archive
            </div>

            {item.featured ? (
              <div className="rounded-full border border-red-400/20 bg-red-500/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-red-100 backdrop-blur-md">
                Featured
              </div>
            ) : null}
          </div>
        </div>
      </a>

      <div className="flex items-center justify-between gap-4 p-5">
        <div className="min-w-0">
          <h3 className="truncate text-lg font-black text-white/95">{item.title}</h3>
          <p className="mt-1 text-[11px] uppercase tracking-[0.22em] text-white/45">
            {item.category}
          </p>
          <p className="mt-1 truncate text-xs text-white/35">{downloadNameFromSrc(item.src)}</p>
        </div>

        <a
          href={item.src}
          download={downloadNameFromSrc(item.src)}
          className="shrink-0 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-xs font-semibold text-white/90 transition hover:border-red-500/20 hover:bg-red-500/10 hover:text-red-100"
        >
          Download
        </a>
      </div>
    </article>
  );
}

export default function MemesPage() {
  const [activeFilter, setActiveFilter] = useState<Category>("All");

  const stickerSrc = "/stickers/sticker-smash.webp";

  const featuredCount = ALL_ART.filter((item) => item.featured).length;

  const visibleArt = useMemo(
    () => getVisibleArt(activeFilter, ALL_ART),
    [activeFilter]
  );

  const visibleNewArt = useMemo(() => NEW_ART, []);

  return (
    <div className="relative overflow-hidden bg-black text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(255,0,60,0.18),transparent_38%),radial-gradient(circle_at_82%_22%,rgba(255,90,0,0.12),transparent_34%),radial-gradient(circle_at_50%_100%,rgba(120,0,0,0.18),transparent_45%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.03),transparent_18%,transparent_82%,rgba(255,255,255,0.02))]" />

      <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-16 sm:px-8 lg:px-10">
        <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] p-7 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,0,60,0.12),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(255,60,0,0.08),transparent_25%)]" />

          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl animate-fadeUp">
              <p className="text-xs font-semibold uppercase tracking-[0.38em] text-white/45">
                CULTURE ARCHIVE
              </p>

              <h1 className="mt-5 text-5xl font-black tracking-tight sm:text-6xl lg:text-7xl">
                <span className="text-red-500 drop-shadow-[0_0_16px_rgba(255,0,0,0.55)]">
                  $MAD
                </span>{" "}
                Art
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/65 sm:text-lg">
                A curated gallery of <span className="text-white/90">community energy</span>, signal,
                and visual identity. Open any piece in full size or download it below.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <div className="rounded-full border border-red-500/20 bg-red-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-red-200">
                  Premium Gallery
                </div>
                <div className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white/70">
                  {ALL_ART.length} Pieces
                </div>
                <div className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white/70">
                  Download Ready
                </div>
              </div>
            </div>

            <div className="relative mx-auto h-[120px] w-[120px] shrink-0 sm:h-[150px] sm:w-[150px] lg:mx-0 lg:mt-1">
              <div className="absolute inset-0 rounded-full bg-red-500/10 blur-2xl" />
              <div className="relative h-full w-full rotate-[-7deg] drop-shadow-[0_20px_40px_rgba(0,0,0,0.55)]">
                <Image
                  src={stickerSrc}
                  alt="$MAD Art Sticker"
                  fill
                  sizes="150px"
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-[1.5rem] border border-white/10 bg-white/[0.025] px-5 py-4 backdrop-blur-xl">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/40">
              EXHIBITION STATUS
            </p>
            <p className="mt-2 text-sm text-white/65">
              New drops can lead the gallery, while older classics stay archived below in the same flow.
            </p>
          </div>

          <div className="rounded-full border border-white/10 bg-black/30 px-4 py-2 text-sm font-semibold text-white/80">
            Featured: {featuredCount}
          </div>
        </section>

        <section className="mt-6 overflow-x-auto">
          <div className="flex min-w-max gap-3 pb-2">
            {FILTERS.map((filter) => {
              const isActive = activeFilter === filter;

              return (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={[
                    "rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] transition",
                    isActive
                      ? "border-red-500/30 bg-red-500/15 text-red-100"
                      : "border-white/10 bg-white/[0.04] text-white/70 hover:border-red-500/20 hover:bg-red-500/10 hover:text-red-100",
                  ].join(" ")}
                >
                  {filter}
                </button>
              );
            })}
          </div>
        </section>

        {visibleNewArt.length > 0 && (activeFilter === "All" || activeFilter === "New Drop") ? (
          <section className="mt-10">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-red-200/70">
                  CURRENT SIGNAL DROP
                </p>
                <h2 className="mt-2 text-2xl font-black tracking-tight text-white">
                  New Additions
                </h2>
              </div>

              <div className="rounded-full border border-red-500/20 bg-red-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-red-100">
                {visibleNewArt.length} New
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {visibleNewArt.map((item, index) => (
                <ArtCard key={item.src} item={item} index={index} />
              ))}
            </div>
          </section>
        ) : null}

        <section className="mt-10">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/40">
                FULL ARCHIVE
              </p>
              <h2 className="mt-2 text-2xl font-black tracking-tight text-white">
                {activeFilter === "All" ? "All Pieces" : activeFilter}
              </h2>
            </div>

            <div className="rounded-full border border-white/10 bg-black/30 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
              {visibleArt.length} Visible
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {visibleArt.map((item, index) => (
              <ArtCard key={`${item.src}-${activeFilter}`} item={item} index={index} />
            ))}
          </div>
        </section>

        <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.025] px-5 py-4 text-xs leading-relaxed text-white/38 backdrop-blur-xl">
          To add more art later, drop the new image files into{" "}
          <span className="text-white/60">/public/memes/</span> and paste a new object into{" "}
          <span className="text-white/60">NEW_ART</span> at the top of this file.
          If a tile appears blank, the filename in the script must match the real file exactly,
          including capitalization.
        </div>
      </div>
    </div>
  );
}
