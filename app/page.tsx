"use client";

import Image from "next/image";
import Link from "next/link";
import MadConfessions from "./components/MadConfessions";

const LINKS = {
  telegram: "https://t.me/MadOfficialChannel",
  x: "https://x.com/madrichclub_",
  instagram: "https://www.instagram.com/madrichclub/",
  tiktok: "https://www.tiktok.com/@madrichclub",
} as const;

function PrimaryButton({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center rounded-full border border-red-500/30 bg-red-500 px-5 py-3 text-sm font-black text-white transition duration-200 hover:scale-[1.01] hover:bg-red-400"
    >
      {children}
    </Link>
  );
}

function SecondaryAnchor({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className="inline-flex items-center justify-center rounded-full border border-white/10 bg-[linear-gradient(180deg,rgba(70,20,20,0.75),rgba(36,10,10,0.9))] px-5 py-3 text-sm font-black text-white transition duration-200 hover:border-white/20 hover:bg-[linear-gradient(180deg,rgba(82,26,26,0.85),rgba(44,12,12,0.96))]"
    >
      {children}
    </a>
  );
}

function SocialIcon({
  href,
  src,
  alt,
}: {
  href: string;
  src: string;
  alt: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={alt}
      title={alt}
      className="group flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 transition duration-300 hover:scale-110 hover:border-white/20 hover:bg-white/10"
    >
      <Image
        src={src}
        alt={alt}
        width={28}
        height={28}
        className="h-7 w-7 object-contain"
      />
    </a>
  );
}

function StatChip({ label }: { label: string }) {
  return (
    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45 sm:text-xs">
      {label}
    </span>
  );
}

function QuickCard({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-[20px] border border-white/10 bg-white/[0.03] p-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/40">
        {title}
      </p>
      <p className="mt-2 text-sm leading-6 text-white/62">{text}</p>
    </div>
  );
}

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#050505] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,48,48,0.12),transparent_35%),radial-gradient(circle_at_20%_20%,rgba(255,0,60,0.10),transparent_30%),radial-gradient(circle_at_80%_30%,rgba(255,80,0,0.08),transparent_30%)]" />
        <div className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:42px_42px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/70" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-4 sm:px-6 sm:pt-6 lg:px-8 lg:pt-8">
        <section className="overflow-hidden rounded-[38px] border border-white/10 bg-black/35 shadow-[0_24px_120px_rgba(0,0,0,0.5)] backdrop-blur-xl">
          <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="relative flex flex-col justify-center px-6 py-14 sm:px-10 lg:px-12 lg:py-20">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-500/25 to-transparent" />

              <p className="text-[11px] font-semibold uppercase tracking-[0.38em] text-white/40">
                CONTROL YOURSELF
              </p>

              <h1 className="mt-6 text-[3rem] font-black leading-[0.88] tracking-[-0.05em] text-white sm:text-[4.5rem] lg:text-[5.8rem]">
                <span className="text-red-500 drop-shadow-[0_0_18px_rgba(255,0,0,0.6)]">
                  STOP
                </span>
                <br />
                PANICKING
                <br />
                AND GET
                <br />
                <span className="text-red-500 drop-shadow-[0_0_18px_rgba(255,0,0,0.6)]">
                  $MAD
                </span>{" "}
                <span className="text-green-400 drop-shadow-[0_0_18px_rgba(0,255,120,0.6)]">
                  RICH.
                </span>
              </h1>

              <p className="mt-6 max-w-lg text-base text-white/68">
                Clear mind. Strong signal. Real project.
              </p>

              <div className="mt-4 max-w-lg rounded-[20px] border border-red-500/15 bg-red-500/[0.06] px-4 py-3 text-sm font-semibold text-white/78">
                Most people panic. $MAD builds.
              </div>

              <div className="mt-10 flex w-full max-w-md flex-col items-start gap-6">
                <div className="flex flex-wrap gap-3">
                  <PrimaryButton href="/mad-mind">Enter MAD Mind</PrimaryButton>
                  <SecondaryAnchor href="/roadmap">
                    See Why It’s Real
                  </SecondaryAnchor>
                </div>

                <div className="flex w-full max-w-md items-center gap-4">
                  <SocialIcon
                    href={LINKS.telegram}
                    src="/logos/MAD-TELEGRAM.png"
                    alt="Telegram"
                  />
                  <SocialIcon
                    href={LINKS.x}
                    src="/logos/MAD-X-LOGO.png"
                    alt="X"
                  />
                  <SocialIcon
                    href={LINKS.instagram}
                    src="/logos/MAD-INSTAGRAM-LOGO.png"
                    alt="Instagram"
                  />
                  <SocialIcon
                    href={LINKS.tiktok}
                    src="/logos/MAD-TIKTOK-LOGO.png"
                    alt="TikTok"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <StatChip label="Real Project" />
                  <StatChip label="Live Tech" />
                  <StatChip label="Public Build" />
                </div>
              </div>
            </div>

            <div className="relative flex items-center justify-center bg-[linear-gradient(180deg,rgba(100,0,0,0.18),rgba(20,0,0,0.04))] p-5 sm:p-7 lg:p-10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,60,60,0.14),transparent_44%)]" />

              <div className="relative w-full max-w-[620px]">
                <div className="absolute -inset-8 rounded-[42px] bg-red-500/10 blur-3xl" />

                <div className="relative rounded-[34px] border border-white/10 bg-black/60 p-4 shadow-[0_20px_80px_rgba(0,0,0,0.6)] sm:p-5">
                  <div className="overflow-hidden rounded-[24px] border border-white/10 bg-black">
                    <video
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="auto"
                      className="aspect-[16/10] w-full object-cover"
                    >
                      <source src="/loops/bullish-mad.mp4" type="video/mp4" />
                    </video>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <QuickCard title="Live" text="Website, confessions, MAD Mind." />
                    <QuickCard title="Building" text="MAD AI, progression, loops." />
                    <QuickCard title="Next" text="Game, merch, full ecosystem." />
                  </div>

                  <div className="mt-4 rounded-[20px] border border-emerald-400/20 bg-emerald-500/10 p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-emerald-200/80">
                      Why people care
                    </p>
                    <p className="mt-2 text-sm font-semibold leading-6 text-emerald-100/90">
                      This is not just a meme page anymore. It already has live tech,
                      public interaction, and an expanding ecosystem.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="confessions"
          className="mt-10 rounded-[38px] border border-white/10 bg-[linear-gradient(180deg,rgba(30,0,0,0.86),rgba(8,0,0,0.96))] p-5 shadow-[0_18px_70px_rgba(0,0,0,0.4)] backdrop-blur-xl sm:p-8 lg:p-10"
        >
          <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-white/42">
                MAD Confessions
              </p>

              <h2 className="mt-3 text-3xl font-black leading-[0.95] text-white sm:text-4xl md:text-5xl">
                See what people really think.
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/62 sm:text-base">
                Real thoughts. Real reactions. Real signal.
              </p>
            </div>

            <div className="shrink-0 flex flex-wrap gap-2">
              <StatChip label="Trending" />
              <StatChip label="Top" />
              <StatChip label="Live" />
            </div>
          </div>

          <div className="min-w-0">
            <MadConfessions />
          </div>
        </section>

        <section className="mt-8 rounded-[24px] border border-white/10 bg-white/[0.03] px-5 py-4 text-center shadow-[0_12px_40px_rgba(0,0,0,0.25)]">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
            Stay $MAD
          </p>
          <p className="mt-2 text-sm text-white/60">
            Stop panicking. Build smarter.
          </p>
        </section>
      </div>
    </div>
  );
}
