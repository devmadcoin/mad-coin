"use client";

import Image from "next/image";
import Link from "next/link";
import MadConfessions from "./components/MadConfessions";

const LINKS = {
  telegram: "https://t.me/MadOfficialChannel",
  x: "https://x.com/madrichclub_",
  instagram: "https://www.instagram.com/madrichclub/",
  tiktok: "https://www.tiktok.com/@madrichclub",
  buy: "#",
  chart: "#",
  dexscreener: "#",
  birdeye: "#",
  coingecko: "#",
  jupiter: "#",
  solscan: "#",
} as const;

function Btn({
  href,
  children,
  primary = false,
}: {
  href: string;
  children: React.ReactNode;
  primary?: boolean;
}) {
  const external = href.startsWith("http") || href === "#";

  if (!external) {
    return (
      <Link
        href={href}
        className={`inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-black transition duration-300 ${
          primary
            ? "bg-red-500 text-white hover:scale-[1.02] hover:bg-red-400"
            : "border border-white/10 bg-white/[0.04] text-white hover:border-white/20 hover:bg-white/[0.07]"
        }`}
      >
        {children}
      </Link>
    );
  }

  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel="noreferrer"
      className={`inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-black transition duration-300 ${
        primary
          ? "bg-red-500 text-white hover:scale-[1.02] hover:bg-red-400"
          : "border border-white/10 bg-white/[0.04] text-white hover:border-white/20 hover:bg-white/[0.07]"
      }`}
    >
      {children}
    </a>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-white/55">
      {children}
    </span>
  );
}

function Stat({
  number,
  label,
}: {
  number: string;
  label: string;
}) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
      <p className="text-2xl font-black text-white">{number}</p>
      <p className="mt-1 text-xs uppercase tracking-[0.24em] text-white/45">
        {label}
      </p>
    </div>
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

function PlatformMarqueeCard({
  href,
  src,
  alt,
  label,
}: {
  href: string;
  src: string;
  alt: string;
  label: string;
}) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel="noreferrer"
      className="flex min-w-[240px] items-center gap-4 rounded-[24px] border border-white/10 bg-white/[0.04] px-5 py-4 shadow-[0_10px_30px_rgba(0,0,0,0.2)] transition duration-300 hover:scale-[1.02] hover:border-white/20 hover:bg-white/[0.07]"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-black/40">
        <Image
          src={src}
          alt={alt}
          width={32}
          height={32}
          className="h-8 w-8 object-contain"
        />
      </div>

      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/40">
          Tracked On
        </p>
        <p className="text-xl font-black text-white/95">{label}</p>
      </div>
    </a>
  );
}

export default function Home() {
  const marqueeItems = [
    {
      href: LINKS.dexscreener,
      src: "/logos/DEX-screener.png",
      alt: "DEX Screener",
      label: "DEX Screener",
    },
    {
      href: LINKS.birdeye,
      src: "/logos/birdeye.png",
      alt: "Birdeye",
      label: "Birdeye",
    },
    {
      href: LINKS.coingecko,
      src: "/logos/coingecko.png",
      alt: "CoinGecko",
      label: "CoinGecko",
    },
    {
      href: LINKS.jupiter,
      src: "/logos/jupiter.png",
      alt: "Jupiter",
      label: "Jupiter",
    },
    {
      href: LINKS.solscan,
      src: "/logos/solscan.png",
      alt: "Solscan",
      label: "Solscan",
    },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#040404] text-white">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(255,0,0,0.14),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(0,255,120,0.06),transparent_28%),linear-gradient(180deg,#080808,#030303)]" />

      <main className="mx-auto max-w-7xl px-4 pb-24 pt-6 sm:px-6 lg:px-8">
        <section className="rounded-[42px] border border-white/10 bg-black/40 p-6 shadow-[0_20px_100px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-10 lg:p-14">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.34em] text-white/40">
                CONTROL YOURSELF
              </p>

              <h1 className="mt-6 text-[3.2rem] font-black leading-[0.88] tracking-[-0.05em] sm:text-[5rem] lg:text-[6.4rem]">
                <span className="text-red-500">STOP</span>
                <br />
                PANICKING.
                <br />
                GET
                <br />
                <span className="text-red-500">$MAD</span>{" "}
                <span className="text-green-400">RICH.</span>
              </h1>

              <p className="mt-6 max-w-xl text-base leading-8 text-white/65">
                Most people lose because of emotion. $MAD was built around
                discipline, identity, community, and controlled chaos.
              </p>

              <div className="mt-4 max-w-lg rounded-[20px] border border-red-500/15 bg-red-500/[0.06] px-4 py-3 text-sm font-semibold text-white/78">
                Most people panic. $MAD builds.
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Btn href="/mad-mind" primary>
                  Enter MAD Mind
                </Btn>
                <Btn href="/roadmap">See Why It’s Real</Btn>
                <Btn href={LINKS.buy}>Buy $MAD</Btn>
              </div>

              <div className="mt-8 flex flex-wrap gap-2">
                <Badge>Real Project</Badge>
                <Badge>Live Tech</Badge>
                <Badge>Public Build</Badge>
                <Badge>Meme Coin</Badge>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-4">
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
            </div>

            <div className="rounded-[34px] border border-white/10 bg-white/[0.03] p-4">
              <div className="overflow-hidden rounded-[28px] border border-white/10 bg-black">
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

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <Stat number="LIVE" label="website" />
                <Stat number="AI" label="mad mind" />
                <Stat number="BUILD" label="daily" />
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10 overflow-hidden rounded-[38px] border border-white/10 bg-black/30 p-5 shadow-[0_18px_70px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-8 lg:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-white/42">
                Already Live
              </p>

              <h2 className="mt-3 text-3xl font-black leading-[0.95] text-white sm:text-4xl md:text-5xl">
                Tracked Across The Ecosystem.
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/62 sm:text-base">
                For people who need proof fast: $MAD is already showing up on real
                platforms, not just sitting on a landing page.
              </p>
            </div>

            <div className="shrink-0 flex flex-wrap gap-2">
              <Badge>Tracked</Badge>
              <Badge>Visible</Badge>
              <Badge>Moving</Badge>
            </div>
          </div>

          <div className="relative mt-8">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-black/95 to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-black/95 to-transparent" />

            <div className="overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.015))] py-5">
              <div className="logo-marquee flex w-max items-center gap-4 px-4">
                {[...marqueeItems, ...marqueeItems].map((item, index) => (
                  <PlatformMarqueeCard
                    key={`${item.label}-${index}`}
                    href={item.href}
                    src={item.src}
                    alt={item.alt}
                    label={item.label}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section
          id="confessions"
          className="mt-10 rounded-[38px] border border-white/10 bg-[linear-gradient(180deg,rgba(25,0,0,0.9),rgba(6,0,0,0.96))] p-6 sm:p-8 lg:p-10"
        >
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.34em] text-white/40">
                Community Signal
              </p>
              <h2 className="mt-3 text-4xl font-black tracking-[-0.04em]">
                See What People Really Think.
              </h2>
              <p className="mt-4 text-white/62">
                Real thoughts. Real reactions. Real signal.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge>Trending</Badge>
              <Badge>Live</Badge>
              <Badge>Top</Badge>
            </div>
          </div>

          <div className="mt-8">
            <MadConfessions />
          </div>
        </section>

        <section className="mt-8 rounded-[26px] border border-yellow-400/15 bg-yellow-500/[0.07] px-5 py-5 text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-yellow-200/80">
            Risk Notice
          </p>

          <p className="mt-3 text-sm leading-7 text-yellow-100/85">
            $MAD is a meme coin and speculative digital asset. Nothing on this
            website is financial advice or a guarantee of returns. Crypto is
            risky and volatile. Never risk money you cannot afford to lose.
            Always do your own research.
          </p>
        </section>
      </main>
    </div>
  );
}
