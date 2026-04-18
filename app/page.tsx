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

function SocialButton({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-black text-white transition duration-300 hover:scale-[1.02] hover:border-white/20 hover:bg-white/[0.08]"
    >
      {label}
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

function ArtCampaignCard({
  title,
  text,
  image,
  accent = "red",
}: {
  title: string;
  text: string;
  image: string;
  accent?: "red" | "green" | "white";
}) {
  return (
    <div
      className={[
        "group relative overflow-hidden rounded-[28px] border min-h-[220px] transition duration-300 hover:scale-[1.01]",
        accent === "red" && "border-red-500/20",
        accent === "green" && "border-emerald-400/20",
        accent === "white" && "border-white/10",
      ].join(" ")}
    >
      <div className="absolute inset-0">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition duration-500 group-hover:scale-[1.04]"
          sizes="(max-width: 1024px) 100vw, 33vw"
        />
      </div>

      <div
        className={[
          "absolute inset-0",
          accent === "red" &&
            "bg-[linear-gradient(180deg,rgba(10,10,10,0.2),rgba(20,0,0,0.58)_50%,rgba(0,0,0,0.92))]",
          accent === "green" &&
            "bg-[linear-gradient(180deg,rgba(10,10,10,0.2),rgba(0,24,10,0.52)_50%,rgba(0,0,0,0.92))]",
          accent === "white" &&
            "bg-[linear-gradient(180deg,rgba(10,10,10,0.22),rgba(12,12,12,0.56)_50%,rgba(0,0,0,0.92))]",
        ].join(" ")}
      />

      <div
        className={[
          "absolute inset-0",
          accent === "red" && "bg-red-500/10",
          accent === "green" && "bg-emerald-500/10",
          accent === "white" && "bg-black/10",
        ].join(" ")}
      />

      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
      <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-white/8 blur-3xl" />

      <div className="relative z-10 flex h-full flex-col justify-end p-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/55">
          {title}
        </p>
        <p className="mt-3 max-w-sm text-2xl font-black leading-tight text-white sm:text-[2rem]">
          {text}
        </p>
      </div>
    </div>
  );
}

function PlatformPoster({
  href,
  src,
  alt,
  eyebrow,
  title,
}: {
  href: string;
  src: string;
  alt: string;
  eyebrow: string;
  title: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="group relative overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-6 transition duration-300 hover:scale-[1.015] hover:border-white/20 hover:bg-white/[0.06]"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-500/35 to-transparent" />
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-red-500/10 blur-3xl transition duration-300 group-hover:bg-red-500/20" />

      <div className="relative flex min-h-[230px] flex-col justify-between">
        <div className="flex justify-center">
          <div className="flex h-32 w-32 items-center justify-center rounded-full border border-white/10 bg-black/50 shadow-[0_0_30px_rgba(255,0,0,0.12)]">
            <Image
              src={src}
              alt={alt}
              width={84}
              height={84}
              className="h-20 w-20 object-contain"
            />
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/40">
            {eyebrow}
          </p>
          <p className="mt-3 text-3xl font-black leading-tight text-white">
            {title}
          </p>
        </div>
      </div>
    </a>
  );
}

function ExchangeGlobe() {
  return (
    <div className="pointer-events-none absolute right-[-8%] top-[-8%] hidden h-[440px] w-[440px] overflow-hidden rounded-full opacity-90 lg:block">
      <div className="absolute inset-0 rounded-full border border-red-500/20 bg-[radial-gradient(circle_at_35%_35%,rgba(255,0,0,0.2),rgba(255,0,0,0.05)_38%,transparent_65%)] shadow-[0_0_60px_rgba(255,0,0,0.16)]" />
      <div className="absolute inset-0 rounded-full bg-[repeating-linear-gradient(to_right,rgba(255,0,0,0.16)_0px,rgba(255,0,0,0.16)_1px,transparent_1px,transparent_36px),repeating-linear-gradient(to_bottom,rgba(255,0,0,0.12)_0px,rgba(255,0,0,0.12)_1px,transparent_1px,transparent_36px)] opacity-55" />
      <div className="absolute inset-[10%] rounded-full border border-red-500/20" />
      <div className="absolute inset-[22%] rounded-full border border-red-500/15" />
      <div className="absolute inset-[34%] rounded-full border border-red-500/10" />
      <div className="absolute left-[12%] top-[16%] h-2 w-2 rounded-full bg-red-500 shadow-[0_0_16px_rgba(255,0,0,0.8)]" />
      <div className="absolute left-[26%] top-[34%] h-1.5 w-1.5 rounded-full bg-red-400 shadow-[0_0_12px_rgba(255,0,0,0.75)]" />
      <div className="absolute left-[58%] top-[24%] h-2 w-2 rounded-full bg-red-500 shadow-[0_0_16px_rgba(255,0,0,0.8)]" />
      <div className="absolute left-[72%] top-[38%] h-1.5 w-1.5 rounded-full bg-red-400 shadow-[0_0_12px_rgba(255,0,0,0.75)]" />
      <div className="absolute left-[48%] top-[58%] h-2 w-2 rounded-full bg-red-500 shadow-[0_0_16px_rgba(255,0,0,0.8)]" />
      <div className="absolute left-[30%] top-[66%] h-1.5 w-1.5 rounded-full bg-red-400 shadow-[0_0_12px_rgba(255,0,0,0.75)]" />
      <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black via-black/25 to-transparent" />
      <div className="absolute left-0 top-0 h-full w-full rounded-full border border-red-500/10" />
    </div>
  );
}

export default function Home() {
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

              <div className="mt-8 flex flex-wrap gap-3">
                <SocialButton href={LINKS.telegram} label="Join Telegram" />
                <SocialButton href={LINKS.x} label="Follow X" />
                <SocialButton href={LINKS.instagram} label="Instagram" />
                <SocialButton href={LINKS.tiktok} label="TikTok" />
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
          <ArtCampaignCard
            title="Mindset"
            text="Pressure reveals the real ones."
            image="/memes/MAD-KINGS-ONLY.png"
            accent="red"
          />
          <ArtCampaignCard
            title="Signal"
            text="Not noise. Not panic. Signal."
            image="/memes/MAD-YOU-SIDELINED.png"
            accent="white"
          />
          <ArtCampaignCard
            title="Wealth"
            text="Rich starts in the mind first."
            image="/memes/MAD-RICH-OR-BROKE.png"
            accent="green"
          />
        </section>

        <section className="relative mt-10 overflow-hidden rounded-[38px] border border-white/10 bg-black/30 p-6 shadow-[0_18px_70px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-8 lg:p-10">
          <ExchangeGlobe />

          <div className="relative z-10">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-white/42">
                Live In The Wild
              </p>

              <h2 className="mt-3 text-3xl font-black leading-[0.95] text-white sm:text-4xl md:text-5xl">
                Verified on{" "}
                <span className="text-red-500 drop-shadow-[0_0_16px_rgba(255,0,0,0.4)]">
                  exchanges.
                </span>
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/62 sm:text-base">
                $MAD is already visible on real crypto platforms.
              </p>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <PlatformPoster
                href={LINKS.birdeye}
                src="/logos/birdeye.png"
                alt="Birdeye"
                eyebrow="Live On"
                title="Track on Birdeye"
              />
              <PlatformPoster
                href={LINKS.solscan}
                src="/logos/solscan.png"
                alt="Solscan"
                eyebrow="Live On"
                title="Verify on Solscan"
              />
              <PlatformPoster
                href={LINKS.jupiter}
                src="/logos/jupiter.png"
                alt="Jupiter"
                eyebrow="Live On"
                title="Buy on Jupiter"
              />
              <PlatformPoster
                href={LINKS.dexscreener}
                src="/logos/DEX-screener.png"
                alt="DEX Screener"
                eyebrow="Live On"
                title="View Chart"
              />
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
