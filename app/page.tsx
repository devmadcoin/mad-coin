"use client";

import Image from "next/image";
import Link from "next/link";
import MadConfessions from "./components/MadConfessions";

const LINKS = {
  telegram: "https://t.me/MadOfficalChannel",
  x: "https://x.com/madrichclub_",
  instagram: "https://www.instagram.com/madrichclub/",
  tiktok: "https://www.tiktok.com/@madrichclub",
} as const;

function InternalPillButton({
  href,
  children,
  primary = false,
}: {
  href: string;
  children: React.ReactNode;
  primary?: boolean;
}) {
  return (
    <Link
      href={href}
      className={[
        "inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-black transition duration-200",
        primary
          ? "border border-red-500/30 bg-red-500 text-white hover:scale-[1.01] hover:bg-red-400"
          : "border border-white/10 bg-[linear-gradient(180deg,rgba(70,20,20,0.75),rgba(36,10,10,0.9))] text-white hover:border-white/20 hover:bg-[linear-gradient(180deg,rgba(82,26,26,0.85),rgba(44,12,12,0.96))]",
      ].join(" ")}
    >
      {children}
    </Link>
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
      className="block h-14 w-14 shrink-0 transition-transform duration-300 hover:scale-110"
    >
      <Image
        src={src}
        alt={alt}
        width={56}
        height={56}
        className="h-full w-full object-contain"
      />
    </a>
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

      <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-4 sm:px-6 sm:pt-6 lg:px-8 lg:pt-8">
        {/* HERO */}
        <section className="overflow-hidden rounded-[38px] border border-white/10 bg-black/35 shadow-[0_24px_120px_rgba(0,0,0,0.5)] backdrop-blur-xl">
          <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="relative flex flex-col justify-center px-6 py-14 sm:px-10 lg:px-12 lg:py-20">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-500/25 to-transparent" />

              <p className="text-[11px] font-semibold uppercase tracking-[0.38em] text-white/40">
                CONTROLLED CHAOS
              </p>

              <h1 className="mt-6 text-[3rem] font-black leading-[0.88] tracking-[-0.05em] text-white sm:text-[4.5rem] lg:text-[6rem]">
                <span className="text-red-500 drop-shadow-[0_0_18px_rgba(255,0,0,0.6)]">
                  STOP
                </span>
                <br />
                TRADING
                <br />
                NOISE.
                <br />
                START
                <br />
                BEING{" "}
                <span className="text-red-500 drop-shadow-[0_0_18px_rgba(255,0,0,0.6)]">
                  $MAD
                </span>{" "}
                <span className="text-green-400 drop-shadow-[0_0_18px_rgba(0,255,120,0.6)]">
                  RICH
                </span>
                .
              </h1>

              <p className="mt-6 max-w-xl text-sm leading-7 text-white/62 sm:text-base">
                Control the chaos. Or it controls you.
              </p>

              <div className="mt-10 flex w-full max-w-md flex-col items-start gap-6">
                <div className="flex flex-wrap gap-3">
                  <InternalPillButton href="/mad-mind" primary>
                    Enter MAD AI
                  </InternalPillButton>

                  <a
                    href="#confessions"
                    className="inline-flex items-center justify-center rounded-full border border-white/10 bg-[linear-gradient(180deg,rgba(70,20,20,0.75),rgba(36,10,10,0.9))] px-5 py-3 text-sm font-black text-white transition duration-200 hover:border-white/20 hover:bg-[linear-gradient(180deg,rgba(82,26,26,0.85),rgba(44,12,12,0.96))]"
                  >
                    View Confessions
                  </a>
                </div>

                <div className="flex w-full max-w-md items-center justify-between">
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
                      className="aspect-[16/10] w-full object-cover"
                    >
                      <source src="/loops/bullish-mad.mp4" type="video/mp4" />
                    </video>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* DISCLAIMER MARQUEE */}
        <section className="mt-5 overflow-hidden rounded-[26px] border border-white/10 bg-black/25 py-3">
          <div className="mad-marquee whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.28em] text-red-200/65">
            <span className="mx-6">
              HIGH VOLATILITY • MEME CULTURE ONLY • DO NOT RISK MONEY YOU CANNOT
              AFFORD TO LOSE
            </span>
            <span className="mx-6">
              HIGH VOLATILITY • MEME CULTURE ONLY • DO NOT RISK MONEY YOU CANNOT
              AFFORD TO LOSE
            </span>
            <span className="mx-6">
              HIGH VOLATILITY • MEME CULTURE ONLY • DO NOT RISK MONEY YOU CANNOT
              AFFORD TO LOSE
            </span>
          </div>
        </section>

        {/* MAD CONFESSIONS */}
        <section
          id="confessions"
          className="mt-12 rounded-[38px] border border-white/10 bg-[linear-gradient(180deg,rgba(30,0,0,0.86),rgba(8,0,0,0.96))] p-5 shadow-[0_18px_70px_rgba(0,0,0,0.4)] backdrop-blur-xl sm:p-8 lg:p-10"
        >
          <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-white/42">
                MAD Confessions
              </p>

              <h2 className="mt-3 text-3xl font-black leading-[0.95] text-white sm:text-4xl md:text-5xl">
                Proof everyone’s a little{" "}
                <span className="text-red-500 drop-shadow-[0_0_14px_rgba(255,0,0,0.5)]">
                  $MAD
                </span>
                .
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/62 sm:text-base">
                Anonymous thoughts. Real pressure. Real people. This is where
                the movement talks back.
              </p>
            </div>

            <div className="shrink-0">
              <InternalPillButton href="/mad-mind">
                Explore MAD AI
              </InternalPillButton>
            </div>
          </div>

          <div className="min-w-0">
            <MadConfessions />
          </div>
        </section>

        {/* MINI CTA STRIP */}
        <section className="mt-8 rounded-[30px] border border-white/10 bg-black/28 px-6 py-6 shadow-[0_18px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:px-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-white/40">
                Stay $MAD
              </p>
              <h3 className="mt-2 text-2xl font-black leading-tight text-white sm:text-3xl">
                You’re not alone. You’re just not in control yet.
              </h3>
            </div>

            <div className="flex flex-wrap gap-3">
              <InternalPillButton href="/mad-mind" primary>
                Enter MAD AI
              </InternalPillButton>
              <InternalPillButton href="/the-mad-path">
                Read The Mad Path
              </InternalPillButton>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="mt-14 border-t border-white/10 pt-8 text-center">
          <div className="mx-auto flex max-w-md items-center justify-center gap-6 pb-8">
            <SocialIcon
              href={LINKS.telegram}
              src="/logos/MAD-TELEGRAM.png"
              alt="Telegram"
            />
            <SocialIcon href={LINKS.x} src="/logos/MAD-X-LOGO.png" alt="X" />
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

          <p className="mx-auto max-w-3xl text-xs leading-7 text-white/42 sm:text-sm sm:leading-8">
            $MAD is not about value.
            <br />
            It’s about belief.
            <br />
            <br />
            That’s why you stop trading…
            <br />
            and start being{" "}
            <span className="font-semibold text-red-500">$MAD</span> at
            everything.
            <br />
            <br />
            Do not risk money you cannot afford to lose.
            <br />
            © 2026 $MAD // Built on Solana
          </p>
        </footer>
      </div>

      <style jsx>{`
        .mad-marquee {
          display: inline-block;
          min-width: 100%;
          animation: madMarquee 22s linear infinite;
        }

        @keyframes madMarquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }
      `}</style>
    </div>
  );
}
