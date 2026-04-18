"use client";

import Image from "next/image";
import Link from "next/link";
import MadConfessions from "./components/MadConfessions";

const LINKS = {
  telegram: "https://t.me/MadOfficialChannel",
  x: "https://x.com/madrichclub_",
  instagram: "https://www.instagram.com/madrichclub/",
  tiktok: "https://www.tiktok.com/@madrichclub",

  buy: "https://jup.ag/tokens/Fa7ZE9nCEYnrHsnoeHuhEExJpchtrBtKXnWe6CgHpump",
  chart:
    "https://dexscreener.com/solana/gt3dwhhkrd2mnqmmchpzdetpg4ttaa23exn1m2vwinfs",

  jupiter:
    "https://jup.ag/tokens/Fa7ZE9nCEYnrHsnoeHuhEExJpchtrBtKXnWe6CgHpump",
  solscan:
    "https://solscan.io/token/Fa7ZE9nCEYnrHsnoeHuhEExJpchtrBtKXnWe6CgHpump",
  birdeye:
    "https://birdeye.so/solana/token/Fa7ZE9nCEYnrHsnoeHuhEExJpchtrBtKXnWe6CgHpump",
  dexscreener:
    "https://dexscreener.com/solana/gt3dwhhkrd2mnqmmchpzdetpg4ttaa23exn1m2vwinfs",
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
  const external = href.startsWith("http");

  if (!external) {
    return (
      <Link
        href={href}
        className={[
          "inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-black transition duration-300",
          primary
            ? "bg-red-500 text-white hover:scale-[1.02] hover:bg-red-400"
            : "border border-white/10 bg-white/[0.04] text-white hover:border-white/20 hover:bg-white/[0.07]",
        ].join(" ")}
      >
        {children}
      </Link>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={[
        "inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-black transition duration-300",
        primary
          ? "bg-red-500 text-white hover:scale-[1.02] hover:bg-red-400"
          : "border border-white/10 bg-white/[0.04] text-white hover:border-white/20 hover:bg-white/[0.07]",
      ].join(" ")}
    >
      {children}
    </a>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-white/55">
      {children}
    </span>
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

function MetricCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
      <p className="text-2xl font-black text-white">{value}</p>
      <p className="mt-1 text-[11px] uppercase tracking-[0.24em] text-white/42">
        {label}
      </p>
    </div>
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
      target="_blank"
      rel="noreferrer"
      className="flex min-w-[280px] items-center gap-4 rounded-[24px] border border-white/10 bg-white/[0.04] px-5 py-4 shadow-[0_10px_30px_rgba(0,0,0,0.22)] transition duration-300 hover:scale-[1.02] hover:border-white/20 hover:bg-white/[0.07]"
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
          Live On
        </p>
        <p className="text-lg font-black text-white/95">{label}</p>
      </div>
    </a>
  );
}

function UniverseCard({
  title,
  text,
  accent = "red",
}: {
  title: string;
  text: string;
  accent?: "red" | "green" | "white";
}) {
  return (
    <div
      className={[
        "relative overflow-hidden rounded-[28px] border p-6",
        accent === "red" &&
          "border-red-500/20 bg-[linear-gradient(180deg,rgba(80,8,8,0.55),rgba(15,3,3,0.92))]",
        accent === "green" &&
          "border-emerald-400/20 bg-[linear-gradient(180deg,rgba(8,45,20,0.5),rgba(3,15,8,0.92))]",
        accent === "white" &&
          "border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))]",
      ].join(" ")}
    >
      <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/5 blur-2xl" />
      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/42">
        {title}
      </p>
      <p className="mt-4 max-w-sm text-xl font-black leading-tight text-white">
        {text}
      </p>
    </div>
  );
}

export default function Home() {
  const marqueeItems = [
    {
      href: LINKS.jupiter,
      src: "/logos/jupiter.png",
      alt: "Jupiter",
      label: "Buy on Jupiter",
    },
    {
      href: LINKS.dexscreener,
      src: "/logos/DEX-screener.png",
      alt: "DEX Screener",
      label: "View Chart",
    },
    {
      href: LINKS.birdeye,
      src: "/logos/birdeye.png",
      alt: "Birdeye",
      label: "Track on Birdeye",
    },
    {
      href: LINKS.solscan,
      src: "/logos/solscan.png",
      alt: "Solscan",
      label: "Verify on Solscan",
    },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#040404] text-white">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(255,0,0,0.14),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(0,255,120,0.06),transparent_28%),linear-gradient(180deg,#080808,#030303)]" />

      <main className="mx-auto max-w-7xl px-4 pb-24 pt-6 sm:px-6 lg:px-8">
        <section className="rounded-[42px] border border-white/10 bg-black/40 p-6 shadow-[0_20px_100px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-10 lg:p-14">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.34em] text-white/40">
                CONTROL YOURSELF
              </p>

              <h1 className="mt-6 text-[3.2rem] font-black leading-[0.88] tracking-[-0.05em] sm:text-[5rem] lg:text-[6.3rem]">
                <span className="text-red-500 drop-shadow-[0_0_18px_rgba(255,0,0,0.45)]">
                  STOP
                </span>
                <br />
                PANICKING.
                <br />
                GET
                <br />
                <span className="text-red-500 drop-shadow-[0_0_18px_rgba(255,0,0,0.45)]">
                  $MAD
                </span>{" "}
                <span className="text-green-400 drop-shadow-[0_0_18px_rgba(34,197,94,0.35)]">
                  RICH.
                </span>
              </h1>

              <p className="mt-6 max-w-lg text-base font-semibold text-white/68">
                Most people fold. $MAD builds.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Btn href="/mad-mind" primary>
                  Enter MAD Mind
                </Btn>
                <Btn href="/roadmap">See Why It’s Real</Btn>
                <Btn href={LINKS.buy}>Buy $MAD</Btn>
              </div>

              <div className="mt-8 flex flex-wrap gap-2">
                <Chip>Real Project</Chip>
                <Chip>Live Tech</Chip>
                <Chip>Public Build</Chip>
                <Chip>Meme Coin</Chip>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-4">
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

            <div className="rounded-[34px] border border-white/10 bg-white/[0.03] p-4">
              <div className="overflow-hidden rounded-[28px] border border-white/10 bg-black">
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
                <MetricCard label="Website" value="LIVE" />
                <MetricCard label="MAD Mind" value="AI" />
                <MetricCard label="Build" value="DAILY" />
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-4 lg:grid-cols-3">
          <UniverseCard
            title="Mindset"
            text="Pressure reveals the real ones."
            accent="red"
          />
          <UniverseCard
            title="Signal"
            text="Not noise. Not panic. Signal."
            accent="white"
          />
          <UniverseCard
            title="Wealth"
            text="Rich starts in the mind first."
            accent="green"
          />
        </section>

        <section className="mt-10 overflow-hidden rounded-[38px] border border-white/10 bg-black/30 p-5 shadow-[0_18px_70px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-8 lg:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-white/42">
                Live In The Wild
              </p>

              <h2 className="mt-3 text-3xl font-black leading-[0.95] text-white sm:text-4xl md:text-5xl">
                Real. Public. Moving.
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/62 sm:text-base">
                $MAD is already visible on real platforms.
              </p>
            </div>

            <div className="shrink-0 flex flex-wrap gap-2">
              <Chip>Tracked</Chip>
              <Chip>Visible</Chip>
              <Chip>Moving</Chip>
            </div>
          </div>

          <div className="marquee-mask relative mt-8">
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

        <section className="mt-10 rounded-[38px] border border-white/10 bg-[linear-gradient(180deg,rgba(25,0,0,0.9),rgba(6,0,0,0.96))] p-6 sm:p-8 lg:p-10">
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
              <Chip>Trending</Chip>
              <Chip>Live</Chip>
              <Chip>Top</Chip>
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
