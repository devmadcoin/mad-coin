"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import MadConfessions from "./components/MadConfessions";

const ADDR = "Fa7ZE9nCEYnrHsnoeHuhEExJpchtrBtKXnWe6CgHpump";

const LINKS = {
  chartPage: `https://dexscreener.com/solana/${ADDR}`,
  telegram: "https://t.me/MadOfficalChannel",
  x: "https://x.com/madrichclub_",
  instagram: "https://www.instagram.com/madrichclub/",
  tiktok: "https://www.tiktok.com/@madrichclub",
  coingecko: "https://www.coingecko.com/en/coins/mad-coin",
  birdeye: `https://birdeye.so/token/${ADDR}?chain=solana`,
  jupiter: `https://jup.ag/swap/SOL-${ADDR}`,
  solscan: `https://solscan.io/token/${ADDR}`,
  retailSticker:
    "https://notaveragestickers.com/products/mad-%F0%9F%98%A1-sticker",
  premiumCard:
    "https://notaveragestickers.com/products/mad-%F0%9F%98%A1-premium-embossed-card-wrap",
  richPremiumCard:
    "https://notaveragestickers.com/products/mad-%F0%9F%98%A1-premium-embossed-card-wrap-copy",
  peeker:
    "https://notaveragestickers.com/products/mad-%F0%9F%98%A1-peeker",
} as const;

const merchItems = [
  {
    name: "MAD Stickers",
    subtitle: "Retail classic",
    href: LINKS.retailSticker,
    src: "/stickers/Mad-Sticker-logo.png",
  },
  {
    name: "Card Wrap",
    subtitle: "Premium embossed",
    href: LINKS.premiumCard,
    src: "/stickers/Mad-Premium-Embossed-Card-Wrap.png",
  },
  {
    name: "Rich Wrap",
    subtitle: "Luxury variant",
    href: LINKS.richPremiumCard,
    src: "/stickers/Mad-Rich-Premium-Embossed-Card-Wrap.png",
  },
  {
    name: "Peeker",
    subtitle: "Window flex",
    href: LINKS.peeker,
    src: "/stickers/Mad-Peeker.png",
  },
] as const;

const ecosystemItems = [
  {
    name: "Dexscreener",
    href: LINKS.chartPage,
    src: "/logos/DEX-screener.png",
    alt: "Dexscreener",
    width: 160,
    height: 46,
    light: false,
  },
  {
    name: "CoinGecko",
    href: LINKS.coingecko,
    src: "/logos/coingecko.png",
    alt: "CoinGecko",
    width: 160,
    height: 46,
    light: true,
  },
  {
    name: "Birdeye",
    href: LINKS.birdeye,
    src: "/logos/birdeye.png",
    alt: "Birdeye",
    width: 145,
    height: 42,
    light: false,
  },
  {
    name: "Jupiter",
    href: LINKS.jupiter,
    src: "/logos/jupiter.png",
    alt: "Jupiter",
    width: 145,
    height: 42,
    light: false,
  },
  {
    name: "Solscan",
    href: LINKS.solscan,
    src: "/logos/solscan.png",
    alt: "Solscan",
    width: 145,
    height: 42,
    light: true,
  },
] as const;

function PillButton({
  href,
  children,
  primary = false,
}: {
  href: string;
  children: React.ReactNode;
  primary?: boolean;
}) {
  const isHash = href.startsWith("#");

  return (
    <a
      href={href}
      target={isHash ? undefined : "_blank"}
      rel={isHash ? undefined : "noreferrer"}
      className={[
        "inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-black transition duration-200",
        primary
          ? "border border-red-500/30 bg-red-500 text-white hover:scale-[1.01] hover:bg-red-400"
          : "border border-white/12 bg-white/[0.04] text-white hover:border-white/20 hover:bg-white/[0.07]",
      ].join(" ")}
    >
      {children}
    </a>
  );
}

function SectionHeader({
  eyebrow,
  title,
  body,
  align = "left",
}: {
  eyebrow: string;
  title: React.ReactNode;
  body?: React.ReactNode;
  align?: "left" | "center";
}) {
  return (
    <div className={align === "center" ? "text-center" : ""}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-white/42">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-3xl font-black leading-[0.95] tracking-tight text-white sm:text-4xl md:text-5xl">
        {title}
      </h2>
      {body ? (
        <p
          className={[
            "mt-4 max-w-2xl text-sm leading-7 text-white/62 sm:text-base",
            align === "center" ? "mx-auto" : "",
          ].join(" ")}
        >
          {body}
        </p>
      ) : null}
    </div>
  );
}

export default function Home() {
  const marqueeItems = useMemo(() => [...ecosystemItems, ...ecosystemItems], []);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#050505] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,48,48,0.12),transparent_35%),radial-gradient(circle_at_20%_20%,rgba(255,0,60,0.10),transparent_30%),radial-gradient(circle_at_80%_30%,rgba(255,80,0,0.08),transparent_30%)]" />
        <div className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:42px_42px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/70" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-6 sm:px-6 sm:pt-8 lg:px-8 lg:pt-10">
        <section className="overflow-hidden rounded-[38px] border border-white/10 bg-black/35 shadow-[0_24px_120px_rgba(0,0,0,0.5)] backdrop-blur-xl">
          <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="relative flex flex-col justify-center px-6 py-16 sm:px-10 lg:px-12 lg:py-20">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-500/25 to-transparent" />

              <p className="text-[11px] font-semibold uppercase tracking-[0.38em] text-white/40">
                CONTROLLED CHAOS
              </p>

              <h1 className="mt-6 text-[3.2rem] font-black leading-[0.88] tracking-[-0.05em] text-white sm:text-[4.7rem] lg:text-[6rem]">
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
                </span>
                .
              </h1>

              <div className="mt-10">
                <PillButton href="#connect" primary>
                  Enter Signal
                </PillButton>
              </div>
            </div>

            <div className="relative flex items-center justify-center bg-[linear-gradient(180deg,rgba(100,0,0,0.18),rgba(20,0,0,0.04))] p-6 sm:p-8 lg:p-10">
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

        <section
          id="connect"
          className="mt-12 rounded-[38px] border border-white/10 bg-black/28 px-5 py-10 shadow-[0_18px_70px_rgba(0,0,0,0.4)] backdrop-blur-xl sm:px-8 sm:py-12 lg:px-10"
        >
          <div className="text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-white/42">
              Connect
            </p>

            <h3 className="mt-3 text-3xl font-black leading-[0.95] sm:text-4xl">
              Where the signal lives.
            </h3>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/62 sm:text-base">
              Tap in with the channels building the culture.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <PillButton href={LINKS.telegram} primary>
              Join Telegram
            </PillButton>
            <PillButton href={LINKS.x}>Follow on X</PillButton>
            <PillButton href={LINKS.instagram}>Instagram</PillButton>
            <PillButton href={LINKS.tiktok}>TikTok</PillButton>
          </div>
        </section>

        <section className="mt-5 overflow-hidden rounded-[26px] border border-white/10 bg-black/25 py-3">
          <div className="mad-marquee whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.28em] text-red-200/65">
            <span className="mx-6">
              HIGH VOLATILITY • MEME CULTURE ONLY • DO NOT RISK MONEY YOU CANNOT AFFORD TO LOSE
            </span>
            <span className="mx-6">
              HIGH VOLATILITY • MEME CULTURE ONLY • DO NOT RISK MONEY YOU CANNOT AFFORD TO LOSE
            </span>
            <span className="mx-6">
              HIGH VOLATILITY • MEME CULTURE ONLY • DO NOT RISK MONEY YOU CANNOT AFFORD TO LOSE
            </span>
          </div>
        </section>

        <section
          id="merch"
          className="mt-12 rounded-[38px] border border-white/10 bg-black/28 px-5 py-10 shadow-[0_18px_70px_rgba(0,0,0,0.4)] backdrop-blur-xl sm:px-8 sm:py-12 lg:px-10"
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeader
              eyebrow="Retail"
              title={
                <>
                  You’re <span className="text-red-500">$MAD</span>.
                  <br />
                  Wear it like you mean it.
                </>
              }
              body="Collect the pieces that carry the signal."
            />
            <div className="shrink-0">
              <PillButton href={LINKS.retailSticker}>View Retail</PillButton>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {merchItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group block rounded-[28px] border border-white/10 bg-white/[0.03] p-5 transition duration-300 hover:-translate-y-1 hover:border-red-500/30 hover:bg-white/[0.05]"
              >
                <div className="relative flex h-[220px] items-center justify-center overflow-hidden rounded-[22px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))]">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,59,48,0.12),transparent_45%)] opacity-0 transition duration-300 group-hover:opacity-100" />
                  <Image
                    src={item.src}
                    alt={item.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
                    className="object-contain p-6 transition duration-300 group-hover:scale-[1.04]"
                  />
                </div>

                <div className="mt-5">
                  <p className="text-xs uppercase tracking-[0.24em] text-white/42">
                    {item.subtitle}
                  </p>
                  <h3 className="mt-2 text-xl font-black text-white">{item.name}</h3>
                  <p className="mt-3 text-sm font-bold text-red-400">Open Product →</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section
          id="ecosystem"
          className="mt-12 rounded-[38px] border border-white/10 bg-black/28 px-5 py-10 shadow-[0_18px_70px_rgba(0,0,0,0.4)] backdrop-blur-xl sm:px-8 sm:py-12 lg:px-10"
        >
          <SectionHeader
            eyebrow="Verified Presence"
            title={<>Verified and trusted on these platforms.</>}
            body="Explore where $MAD is visible, recognized, and easy to verify."
            align="center"
          />

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <PillButton href={LINKS.chartPage}>Open Dexscreener</PillButton>
            <PillButton href={LINKS.jupiter} primary>
              Open Jupiter
            </PillButton>
            <PillButton href={LINKS.solscan}>View Solscan</PillButton>
          </div>

          <div className="relative mt-10 overflow-hidden">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-[#050505] to-transparent sm:w-24" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-[#050505] to-transparent sm:w-24" />

            <div className="mad-logo-marquee flex w-max items-center gap-4 sm:gap-6">
              {marqueeItems.map((item, index) => (
                <a
                  key={`${item.name}-${index}`}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className={[
                    "flex h-16 items-center rounded-[22px] border px-5 shadow-lg transition hover:-translate-y-0.5",
                    item.light
                      ? "border-white/10 bg-white"
                      : "border-white/10 bg-black",
                  ].join(" ")}
                  aria-label={`Open ${item.name}`}
                  title={item.name}
                >
                  <Image
                    src={item.src}
                    alt={item.alt}
                    width={item.width}
                    height={item.height}
                    className="h-auto w-auto object-contain"
                  />
                </a>
              ))}
            </div>
          </div>
        </section>

        <section
          id="confessions"
          className="mt-12 rounded-[38px] border border-white/10 bg-black/28 p-2 shadow-[0_18px_70px_rgba(0,0,0,0.4)] backdrop-blur-xl"
        >
          <div className="px-4 pb-2 pt-6 sm:px-6">
            <SectionHeader
              eyebrow="Community"
              title={<>Confessions from the culture.</>}
              body="Raw thoughts from the community, straight from the culture."
            />
          </div>
          <MadConfessions />
        </section>

        <section className="mt-12 rounded-[38px] border border-white/10 bg-black/28 px-5 py-10 shadow-[0_18px_70px_rgba(0,0,0,0.4)] backdrop-blur-xl sm:px-8 sm:py-12 lg:px-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr]">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-white/42">
                Final Signal
              </p>
              <h3 className="mt-3 text-3xl font-black leading-[0.95] sm:text-4xl">
                No guarantees.
                <br />
                No promises.
                <br />
                Only belief.
              </h3>
            </div>

            <div className="rounded-[26px] border border-white/10 bg-white/[0.03] p-5">
              <p className="text-sm leading-7 text-white/62">
                Built on conviction, carried by culture, and driven by the people who choose to be $MAD.
              </p>
            </div>
          </div>
        </section>

        <footer className="mt-14 border-t border-white/10 pt-8 text-center">
          <p className="mx-auto max-w-3xl text-xs leading-7 text-white/42 sm:text-sm sm:leading-8">
            $MAD is not about value.
            <br />
            It’s about belief.
            <br />
            <br />
            That’s why you stop trading…
            <br />
            and start being{" "}
            <span className="font-semibold text-red-500">$MAD</span> at everything.
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

        .mad-logo-marquee {
          animation: logoMarquee 26s linear infinite;
        }

        @keyframes madMarquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }

        @keyframes logoMarquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}
