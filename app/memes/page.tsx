"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import IdentityForge from "../components/IdentityForge";

type Category =
  | "All"
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

const GALLERY_ART: ArtItem[] = [
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

const FILTERS: Category[] = [
  "All",
  "Archive",
  "Army",
  "Philosophy",
  "Meme",
  "Signal",
];

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function downloadNameFromSrc(src: string) {
  return src.split("/").pop() || "mad-art.png";
}

function getVisibleArt(activeFilter: Category, items: ArtItem[]) {
  if (activeFilter === "All") return items;
  if (activeFilter === "Archive") return items;
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
              $MAD Art
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

function SectionShell({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-[2rem] border border-white/10 bg-white/[0.03] shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl",
        className
      )}
    >
      {children}
    </section>
  );
}

function StatPill({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4">
      <p className="text-[11px] uppercase tracking-[0.24em] text-white/40">
        {label}
      </p>
      <p className="mt-3 text-2xl font-black text-white">{value}</p>
    </div>
  );
}

export default function MemesPage() {
  const [activeFilter, setActiveFilter] = useState<Category>("All");

  const featuredCount = GALLERY_ART.filter((item) => item.featured).length;

  const visibleArt = useMemo(
    () => getVisibleArt(activeFilter, GALLERY_ART),
    [activeFilter]
  );

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(255,0,0,0.10),transparent_28%),radial-gradient(circle_at_80%_10%,rgba(255,0,0,0.06),transparent_22%),radial-gradient(circle_at_50%_100%,rgba(120,0,0,0.14),transparent_40%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.02),transparent_18%,transparent_82%,rgba(255,255,255,0.015))]" />

      <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-16 sm:px-8 lg:px-10">
        <section className="relative overflow-hidden rounded-[2.4rem] border border-white/10 bg-white/[0.02] p-7 shadow-[0_20px_80px_rgba(0,0,0,0.48)] backdrop-blur-xl sm:p-10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_28%,rgba(255,0,0,0.14),transparent_22%),radial-gradient(circle_at_82%_18%,rgba(255,0,0,0.08),transparent_18%)]" />
          <div className="pointer-events-none absolute right-[-10%] top-[-18%] hidden h-[420px] w-[420px] rounded-full border border-red-500/10 lg:block" />
          <div className="pointer-events-none absolute right-[-6%] top-[-10%] hidden h-[320px] w-[320px] rounded-full border border-red-500/8 lg:block" />

          <div className="relative grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.38em] text-white/45">
                CULTURE ARCHIVE
              </p>

              <h1 className="mt-5 text-[3.6rem] font-black leading-[0.88] tracking-[-0.05em] sm:text-[5.6rem]">
                <span className="text-red-500 drop-shadow-[0_0_16px_rgba(255,0,0,0.55)]">
                  $MAD
                </span>{" "}
                Art.
                <br />
                Memes.
                <br />
                NFTs.
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-8 text-white/68 sm:text-lg">
                Signal, memes, collectibles.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#prototype-lab"
                  className="inline-flex rounded-full border border-red-500/30 bg-red-500 px-6 py-3 text-sm font-black text-white shadow-[0_0_22px_rgba(255,0,0,0.22)] transition hover:scale-[1.02] hover:bg-red-400"
                >
                  Enter Lab
                </a>

                <a
                  href="#gallery"
                  className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-6 py-3 text-sm font-black text-white/90 transition hover:bg-white/[0.08]"
                >
                  View Art
                </a>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <div className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white/70">
                  Premium Gallery
                </div>
                <div className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white/70">
                  {GALLERY_ART.length} Pieces
                </div>
                <div className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-200">
                  NFT Prototype Live
                </div>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[530px]">
              <div className="absolute inset-0 rounded-[2rem] bg-red-500/10 blur-3xl" />
              <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.015))] p-4 shadow-[0_22px_60px_rgba(0,0,0,0.45)]">
                <div className="relative aspect-[16/10] overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/40">
                  <Image
                    src="/memes/MAD-RICH-OR-BROKE.png"
                    alt="$MAD featured art"
                    fill
                    sizes="(max-width: 1024px) 100vw, 530px"
                    className="object-cover"
                    priority
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                </div>

                <div className="mt-4 grid grid-cols-3 gap-3">
                  <div className="rounded-[1.3rem] border border-white/10 bg-white/[0.03] p-4">
                    <div className="text-3xl font-black text-white">LIVE</div>
                    <div className="mt-1 text-[11px] uppercase tracking-[0.28em] text-white/40">
                      Gallery
                    </div>
                  </div>

                  <div className="rounded-[1.3rem] border border-white/10 bg-white/[0.03] p-4">
                    <div className="text-3xl font-black text-white">NFT</div>
                    <div className="mt-1 text-[11px] uppercase tracking-[0.28em] text-white/40">
                      Prototype
                    </div>
                  </div>

                  <div className="rounded-[1.3rem] border border-white/10 bg-white/[0.03] p-4">
                    <div className="text-3xl font-black text-white">DAILY</div>
                    <div className="mt-1 text-[11px] uppercase tracking-[0.28em] text-white/40">
                      Signal
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="prototype-lab" className="mt-10">
          <SectionShell className="relative overflow-hidden p-0">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,0,60,0.12),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(255,60,0,0.08),transparent_24%)]" />

            <div className="relative border-b border-white/10 px-7 py-8 sm:px-10 sm:py-10">
              <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
                <div className="max-w-3xl">
                  <p className="text-xs font-semibold uppercase tracking-[0.38em] text-white/45">
                    NFT PROTOTYPE LAB
                  </p>

                  <h2 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
                    <span className="text-red-500 drop-shadow-[0_0_16px_rgba(255,0,0,0.55)]">
                      $MAD
                    </span>{" "}
                    NFT Prototype
                  </h2>

                  <p className="mt-5 max-w-2xl text-base leading-8 text-white/68 sm:text-lg">
                    Build your own MAD identity.
                    <br />
                    Randomize traits.
                    <br />
                    Download your build.
                  </p>

                  <div className="mt-7 flex flex-wrap gap-3">
                    <div className="rounded-full border border-red-500/20 bg-red-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-red-200">
                      Prototype Only
                    </div>
                    <div className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white/70">
                      No Live Mint
                    </div>
                  </div>
                </div>

                <div className="grid w-full max-w-[430px] gap-3 sm:grid-cols-3 lg:w-[420px]">
                  <StatPill label="Status" value="Open" />
                  <StatPill label="Style" value="Rare" />
                  <StatPill label="Export" value="PNG" />
                </div>
              </div>
            </div>

            <div className="p-3 sm:p-4">
              <div className="rounded-[2rem] border border-white/10 bg-white/[0.025] p-3 shadow-[0_18px_50px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-4">
                <IdentityForge />
              </div>
            </div>
          </SectionShell>
        </section>

        <section className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-[1.5rem] border border-white/10 bg-white/[0.025] px-5 py-4 backdrop-blur-xl">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/40">
              GALLERY STATUS
            </p>
            <p className="mt-2 text-sm text-white/65">
              Live gallery. Updated culture archive.
            </p>
          </div>

          <div className="rounded-full border border-white/10 bg-black/30 px-4 py-2 text-sm font-semibold text-white/80">
            Featured: {featuredCount}
          </div>
        </section>

        <section id="gallery" className="mt-6 overflow-x-auto">
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

        <section className="mt-10">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/40">
                THE GALLERY
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

        <section className="mt-10 rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 text-center shadow-[0_18px_50px_rgba(0,0,0,0.3)] backdrop-blur-xl sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-red-200/70">
            FUTURE COLLECTIBLES
          </p>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-5xl">
            Art today. NFTs tomorrow.
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-sm leading-relaxed text-white/65 sm:text-lg">
            $MAD Art pulls people in. The prototype lab shows where it can go.
          </p>
        </section>

        <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.025] px-5 py-4 text-xs leading-relaxed text-white/38 backdrop-blur-xl">
          Add new art in <span className="text-white/60">/public/memes/</span> and update{" "}
          <span className="text-white/60">GALLERY_ART</span>. If something is blank,
          the filename and capitalization must match exactly. Prototype assets still depend on{" "}
          <span className="text-white/60">/public/pfp/manifest.json</span>.
        </div>
      </div>
    </div>
  );
}
