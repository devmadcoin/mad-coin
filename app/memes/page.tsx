"use client";

import Image from "next/image";

const ART_ITEMS = [
  {
    title: "$MAD Core Drop",
    eyebrow: "Featured",
    text: "The main visual identity behind the $MAD world.",
    image: "/memes/MAD-KINGS-ONLY.png",
  },
  {
    title: "Signal Over Noise",
    eyebrow: "Poster",
    text: "Built for clarity, pressure, and conviction.",
    image: "/memes/MAD-YOU-SIDELINED.png",
  },
  {
    title: "Rich or Broke",
    eyebrow: "Drop",
    text: "The choice is simple. Build or fold.",
    image: "/memes/MAD-RICH-OR-BROKE.png",
  },
  {
    title: "$MAD Energy",
    eyebrow: "Concept",
    text: "Raw emotion turned into visual identity.",
    image: "/memes/MAD-KINGS-ONLY.png",
  },
  {
    title: "Pressure Tested",
    eyebrow: "Visual",
    text: "Chaos outside. Control inside.",
    image: "/memes/MAD-YOU-SIDELINED.png",
  },
  {
    title: "Stay $MAD",
    eyebrow: "Poster",
    text: "A brand built on pressure, identity, and motion.",
    image: "/memes/MAD-RICH-OR-BROKE.png",
  },
] as const;

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
  title,
  eyebrow,
  text,
  image,
}: {
  title: string;
  eyebrow: string;
  text: string;
  image: string;
}) {
  return (
    <div className="min-w-0 overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/25 transition duration-300 hover:border-white/20 hover:bg-white/[0.04]">
      <div className="relative aspect-[4/5] w-full sm:aspect-square">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      </div>

      <div className="min-w-0 p-4 sm:p-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/45">
          {eyebrow}
        </p>

        <h3 className="mt-2 break-words text-xl font-black leading-tight text-white sm:text-2xl">
          {title}
        </h3>

        <p className="mt-2 break-words text-sm leading-7 text-white/65">
          {text}
        </p>
      </div>
    </div>
  );
}

export default function MemesPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#040404] text-white">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(255,0,0,0.12),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(0,255,120,0.05),transparent_28%),linear-gradient(180deg,#080808,#030303)]" />

      <main className="mx-auto max-w-7xl px-4 pb-20 pt-6 sm:px-6 lg:px-8">
        <SectionShell className="p-5 sm:p-8 lg:p-10">
          <div className="max-w-5xl min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-red-200/75">
              $MAD ART
            </p>

            <h1 className="mt-4 text-4xl font-black leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-7xl">
              Art for the{" "}
              <span className="text-red-500 drop-shadow-[0_0_14px_rgba(255,0,0,0.45)]">
                $MAD
              </span>{" "}
              world.
            </h1>

            <p className="mt-5 max-w-3xl text-base leading-8 text-white/70 sm:text-lg">
              Posters, drops, identity pieces, and visual energy from the $MAD universe.
            </p>
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
            <Pill tone="red">Official Art</Pill>
            <Pill tone="green">Mobile Safe</Pill>
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
                This page is the visual side of $MAD. Clean, aggressive, and easy to scroll on mobile without feeling cramped or broken.
              </p>

              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/40">
                    Style
                  </p>
                  <p className="mt-2 text-sm leading-7 text-white/65">
                    Bold, premium, meme-native.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/40">
                    Use
                  </p>
                  <p className="mt-2 text-sm leading-7 text-white/65">
                    Posters, branding, drops, and visual lore.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </SectionShell>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ART_ITEMS.map((item) => (
            <ArtCard
              key={item.title}
              title={item.title}
              eyebrow={item.eyebrow}
              text={item.text}
              image={item.image}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
