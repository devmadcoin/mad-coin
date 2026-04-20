"use client";

import Image from "next/image";

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
] as const;

function cleanTitle(name: string) {
  return name.replace(".png", "").replaceAll("-", " ").toUpperCase();
}

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
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
        "overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.03] shadow-[0_18px_50px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:rounded-[2rem]",
        className,
      )}
    >
      {children}
    </section>
  );
}

function Pill({
  children,
  tone = "default",
}: {
  children: React.ReactNode;
  tone?: "default" | "red" | "green";
}) {
  return (
    <div
      className={cn(
        "rounded-full px-4 py-2 text-[11px] font-black uppercase tracking-[0.24em]",
        tone === "red" && "border border-red-500/25 bg-red-500/10 text-red-200",
        tone === "green" &&
          "border border-emerald-400/20 bg-emerald-500/10 text-emerald-200",
        tone === "default" &&
          "border border-white/10 bg-white/[0.04] text-white/70",
      )}
    >
      {children}
    </div>
  );
}

function ArtCard({
  file,
}: {
  file: string;
}) {
  const imageSrc = `/memes/${file}`;
  const title = cleanTitle(file);

  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/25 transition hover:border-white/20">
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
}

export default function MemesPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(255,0,0,0.12),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(0,255,120,0.05),transparent_28%),linear-gradient(180deg,#080808,#030303)]" />

      <main className="mx-auto max-w-7xl px-4 pb-24 pt-8 sm:px-6 lg:px-8">
        <SectionShell className="p-6 sm:p-10">
          <p className="text-xs uppercase tracking-[0.34em] text-red-300/70">
            $MAD ART
          </p>

          <h1 className="mt-4 text-4xl font-black sm:text-6xl">
            The <span className="text-red-500">$MAD</span> Art Vault.
          </h1>

          <p className="mt-5 max-w-3xl text-base leading-8 text-white/70 sm:text-lg">
            Posters. Memes. Identity. Chaos turned into visuals.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Pill tone="red">Official Art</Pill>
            <Pill tone="green">Easy Download</Pill>
            <Pill>Live Collection</Pill>
          </div>
        </SectionShell>

        <SectionShell className="mt-8 overflow-hidden p-0">
          <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="relative min-h-[280px] sm:min-h-[360px] lg:min-h-[540px]">
              <Image
                src="/memes/MAD-KINGS-ONLY.png"
                alt="$MAD featured art"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
            </div>

            <div className="min-w-0 p-5 sm:p-8 lg:p-10">
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white/45">
                Featured Piece
              </p>

              <h2 className="mt-4 break-words text-3xl font-black leading-[0.95] text-white sm:text-5xl">
                Pressure.
                <br />
                Signal.
                <br />
                Identity.
              </h2>

              <p className="mt-5 max-w-xl break-words text-base leading-8 text-white/70">
                The $MAD art world is built to be bold, sharable, and easy to
                explore on mobile.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Pill tone="red">Bold</Pill>
                <Pill>Sharable</Pill>
                <Pill tone="green">Mobile Safe</Pill>
              </div>
            </div>
          </div>
        </SectionShell>

        <section className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {ART_FILES.map((file) => (
            <ArtCard key={file} file={file} />
          ))}
        </section>
      </main>
    </div>
  );
}
