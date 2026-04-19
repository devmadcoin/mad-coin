"use client";

import Image from "next/image";
import Link from "next/link";
import MadConfessions from "./components/MadConfessions";

const LINKS = {
  telegram: "https://t.me/MadOfficalChannel",
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

function SocialIconButton({
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
      className="group flex h-16 w-16 items-center justify-center rounded-full border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] shadow-[0_10px_24px_rgba(0,0,0,0.28)] transition duration-300 hover:scale-105 hover:border-white/20 hover:bg-white/[0.08]"
    >
      <Image
        src={src}
        alt={alt}
        width={34}
        height={34}
        className="h-9 w-9 object-contain transition duration-300 group-hover:scale-110"
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

function ExchangeLogoCard({
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
      className="flex min-w-[240px] items-center justify-center rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.035),rgba(255,255,255,0.018))] px-8 py-10 shadow-[0_10px_24px_rgba(0,0,0,0.22)] transition duration-300 hover:scale-[1.01] hover:border-white/20 hover:bg-white/[0.06]"
      aria-label={label}
      title={label}
    >
      <Image
        src={src}
        alt={alt}
        width={180}
        height={56}
        className="h-12 w-auto object-contain opacity-95"
      />
    </a>
  );
}

function HeroGlobe() {
  return (
    <div className="pointer-events-none absolute right-[-120px] top-[-90px] hidden h-[520px] w-[520px] overflow-hidden rounded-full opacity-20 lg:block">
      <div className="absolute inset-0 rounded-full border border-red-500/20 bg-[radial-gradient(circle_at_35%_35%,rgba(255,0,0,0.22),rgba(255,0,0,0.06)_38%,transparent_65%)] shadow-[0_0_70px_rgba(255,0,0,0.18)]" />
      <div className="absolute inset-0 rounded-full bg-[repeating-linear-gradient(to_right,rgba(255,0,0,0.18)_0px,rgba(255,0,0,0.18)_1px,transparent_1px,transparent_40px),repeating-linear-gradient(to_bottom,rgba(255,0,0,0.14)_0px,rgba(255,0,0,0.14)_1px,transparent_1px,transparent_40px)] opacity-55" />
      <div className="absolute inset-[8%] rounded-full border border-red-500/18" />
      <div className="absolute inset-[22%] rounded-full border border-red-500/14" />
      <div className="absolute inset-[36%] rounded-full border border-red-500/10" />

      <div className="absolute left-[12%] top-[16%] h-2.5 w-2.5 rounded-full bg-red-500 shadow-[0_0_16px_rgba(255,0,0,0.8)]" />
      <div className="absolute left-[28%] top-[34%] h-2 w-2 rounded-full bg-red-400 shadow-[0_0_12px_rgba(255,0,0,0.75)]" />
      <div className="absolute left-[60%] top-[24%] h-2.5 w-2.5 rounded-full bg-red-500 shadow-[0_0_16px_rgba(255,0,0,0.8)]" />
      <div className="absolute left-[74%] top-[40%] h-2 w-2 rounded-full bg-red-400 shadow-[0_0_12px_rgba(255,0,0,0.75)]" />
      <div className="absolute left-[52%] top-[62%] h-2.5 w-2.5 rounded-full bg-red-500 shadow-[0_0_16px_rgba(255,0,0,0.8)]" />
      <div className="absolute left-[30%] top-[70%] h-2 w-2 rounded-full bg-red-400 shadow-[0_0_12px_rgba(255,0,0,0.75)]" />

      <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black via-black/20 to-transparent" />
      <div className="absolute inset-0 rounded-full border border-red-500/8" />
    </div>
  );
}

export default function Home() {
  const exchangeItems = [
    {
      href: LINKS.birdeye,
      src: "/logos/birdeye.png",
      alt: "Birdeye",
      label: "Birdeye",
    },
    {
      href: LINKS.solscan,
      src: "/logos/solscan.png",
      alt: "Solscan",
      label: "Solscan",
    },
    {
      href: LINKS.jupiter,
      src: "/logos/jupiter.png",
      alt: "Jupiter",
      label: "Jupiter",
    },
    {
      href: LINKS.dexscreener,
      src: "/logos/DEX-screener.png",
      alt: "DEX Screener",
      label: "DEX Screener",
    },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#040404] text-white">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(255,0,0,0.14),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(0,255,120,0.06),transparent_28%),linear-gradient(180deg,#080808,#030303)]" />

      <main className="mx-auto max-w-7xl px-4 pb-24 pt-6 sm:px-6 lg:px-8">
        <section className="relative overflow-hidden rounded-[42px] border border-white/10 bg-black/40 p-6 shadow-[0_20px_100px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-10 lg:p-14">
          <HeroGlobe />

          <div className="relative z-10 grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
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

              <div className="mt-6 max-w-xl">
                <p className="text-base font-semibold text-white/72">
                  Most people fold. $MAD builds.
                </p>

                <p className="mt-3 text-sm leading-7 text-white/55 sm:text-base">
                  $MAD Rich means staying calm under pressure, building while others
                  panic, and turning discipline into wealth.
                </p>
              </div>

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
                <SocialIconButton
                  href={LINKS.telegram}
                  src="/logos/MAD-TELEGRAM.png"
                  alt="Telegram"
                />
                <SocialIconButton
                  href={LINKS.x}
                  src="/logos/MAD-X-LOGO.png"
                  alt="X"
                />
                <SocialIconButton
                  href={LINKS.instagram}
                  src="/logos/MAD-INSTAGRAM-LOGO.png"
                  alt="Instagram"
                />
                <SocialIconButton
                  href={LINKS.tiktok}
                  src="/logos/MAD-TIKTOK-LOGO.png"
                  alt="TikTok"
                />
              </div>
            </div>

            <div className="relative rounded-[34px] border border-white/10 bg-white/[0.03] p-4">
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

        <section className="mt-10 overflow-hidden rounded-[38px] border border-white/10 bg-black/30 p-6 shadow-[0_18px_70px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-8 lg:p-10">
          <div>
            <p className="text-center text-[11px] font-semibold uppercase tracking-[0.34em] text-white/42">
              Verified on exchanges
            </p>

            <h2 className="mt-3 text-center text-3xl font-black leading-[0.95] text-white sm:text-4xl md:text-5xl">
              Trusted across real crypto platforms.
            </h2>
          </div>

          <div className="mt-8 overflow-hidden rounded-[28px] bg-[linear-gradient(90deg,rgba(96,58,80,0.95),rgba(49,57,110,0.95))] px-4 py-8 sm:px-6">
            <div className="logo-marquee flex w-max items-center gap-8">
              {[...exchangeItems, ...exchangeItems, ...exchangeItems].map(
                (item, index) => (
                  <ExchangeLogoCard
                    key={`${item.label}-${index}`}
                    href={item.href}
                    src={item.src}
                    alt={item.alt}
                    label={item.label}
                  />
                ),
              )}
            </div>
          </div>
        </section>

        <section className="mt-10 rounded-[38px] border border-white/10 bg-[linear-gradient(180deg,rgba(25,0,0,0.9),rgba(6,0,0,0.96))] p-4 shadow-[0_18px_70px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-6 lg:p-8">
          <div className="min-w-0">
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
