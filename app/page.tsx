"use client";

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

const proofItems = [
  {
    src: "/proof/mad-sticker-1.png",
    alt: "$MAD sticker proof 1",
  },
  {
    src: "/proof/mad-sticker-2.png",
    alt: "$MAD sticker proof 2",
  },
  {
    src: "/proof/mad-sticker-3.png",
    alt: "$MAD sticker proof 3",
  },
] as const;

const ecosystemItems = [
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
    name: "Dexscreener",
    href: LINKS.chartPage,
    src: "/logos/DEX-screener.png",
    alt: "Dexscreener",
    width: 160,
    height: 46,
    light: false,
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
          : "border border-white/10 bg-[linear-gradient(180deg,rgba(70,20,20,0.75),rgba(36,10,10,0.9))] text-white hover:border-white/20 hover:bg-[linear-gradient(180deg,rgba(82,26,26,0.85),rgba(44,12,12,0.96))]",
      ].join(" ")}
    >
      {children}
    </a>
  );
}

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

function PromptChip({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center rounded-full border border-white/10 bg-black/40 px-4 py-2 text-sm font-semibold text-white/78 transition duration-200 hover:border-white/20 hover:bg-white/10 hover:text-white"
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

function ProofCard({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
  return (
    <div className="group relative w-[260px] shrink-0 overflow-hidden rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(52,8,8,0.96),rgba(24,4,4,0.98))] p-3 sm:w-[300px]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,70,70,0.10),transparent_38%),radial-gradient(circle_at_bottom,rgba(120,0,0,0.18),transparent_42%)] opacity-80" />

      <div className="relative overflow-hidden rounded-[18px] border border-white/10 bg-black/40">
        <div className="relative aspect-[4/5] w-full">
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(max-width: 768px) 70vw, 300px"
            className="object-cover transition duration-300 group-hover:scale-[1.03]"
          />
        </div>
      </div>

      <div className="relative mt-3 flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/45">
          Community post
        </p>
        <div className="flex items-center gap-2 text-[11px] text-white/55">
          <span className="rounded-full bg-red-500/20 px-2 py-1">🔥 proof</span>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const slidingProofItems = [...proofItems, ...proofItems];

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#050505] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,48,48,0.12),transparent_35%),radial-gradient(circle_at_20%_20%,rgba(255,0,60,0.10),transparent_30%),radial-gradient(circle_at_80%_30%,rgba(255,80,0,0.08),transparent_30%)]" />
        <div className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:42px_42px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/70" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-4 sm:px-6 sm:pt-6 lg:px-8 lg:pt-8">
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

              <div className="mt-10 flex w-full max-w-md flex-col items-start gap-6">
                <div className="flex flex-wrap gap-3">
                  <InternalPillButton href="/mad-mind" primary>
                    Enter MAD AI
                  </InternalPillButton>
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

        <section className="mt-10 rounded-[38px] border border-white/10 bg-[linear-gradient(180deg,rgba(30,0,0,0.85),rgba(10,0,0,0.95))] px-6 py-12 shadow-[0_18px_70px_rgba(0,0,0,0.4)] backdrop-blur-xl sm:px-10 lg:px-12">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div className="text-center lg:text-left">
              <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-white/42">
                MAD AI
              </p>

              <h2 className="mt-4 text-3xl font-black leading-[0.95] text-white sm:text-4xl md:text-5xl">
                Talk to the AI behind the movement.
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-7 text-white/62 sm:text-base lg:max-w-2xl">
                Ask MAD AI about the philosophy, generate captions in brand
                voice, or turn chaos into signal.
              </p>

              <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
                <PromptChip href="/mad-mind">
                  What does Stay $MAD mean?
                </PromptChip>
                <PromptChip href="/mad-mind">
                  Write a savage caption
                </PromptChip>
                <PromptChip href="/mad-mind">
                  Explain $MAD simply
                </PromptChip>
              </div>

              <div className="mt-8 flex justify-center lg:justify-start">
                <InternalPillButton href="/mad-mind" primary>
                  Enter MAD AI
                </InternalPillButton>
              </div>
            </div>

            <div className="relative flex justify-center">
              <div className="absolute -inset-10 rounded-full bg-red-500/20 blur-3xl animate-pulse" />

              <div className="relative animate-spin-slow hover:[animation-duration:5s]">
                <Image
                  src="/MAD-MIND-HEAD.png"
                  alt="MAD AI"
                  width={420}
                  height={420}
                  className="object-contain drop-shadow-[0_0_40px_rgba(255,0,0,0.6)]"
                />
              </div>
            </div>
          </div>
        </section>

        <section
          id="merch"
          className="mt-12 rounded-[38px] border border-white/10 bg-[linear-gradient(180deg,rgba(45,0,0,0.78),rgba(20,0,0,0.92))] px-5 py-10 shadow-[0_18px_70px_rgba(0,0,0,0.4)] backdrop-blur-xl sm:px-8 sm:py-12 lg:px-10"
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
                className="group relative block overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(52,8,8,0.95),rgba(28,4,4,0.98))] p-5 transition duration-300 hover:-translate-y-1 hover:border-red-500/30"
              >
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,70,70,0.10),transparent_38%),radial-gradient(circle_at_bottom,rgba(120,0,0,0.18),transparent_42%)] opacity-80" />

                <div className="relative flex h-[220px] items-center justify-center overflow-hidden rounded-[22px] border border-white/10 bg-[linear-gradient(180deg,rgba(70,16,16,0.9),rgba(36,8,8,0.95))] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,80,80,0.12),transparent_48%)] opacity-70 transition duration-300 group-hover:opacity-100" />

                  <div className="absolute inset-[16px] rounded-[18px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0.005))]" />

                  <Image
                    src={item.src}
                    alt={item.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
                    className="object-contain p-10 transition duration-300 group-hover:scale-[1.04]"
                  />
                </div>

                <div className="relative mt-5">
                  <p className="text-xs uppercase tracking-[0.24em] text-white/42">
                    {item.subtitle}
                  </p>
                  <h3 className="mt-2 text-xl font-black text-white">
                    {item.name}
                  </h3>
                  <p className="mt-3 text-sm font-bold text-red-400">
                    Open Product →
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-[34px] border border-white/10 bg-[linear-gradient(180deg,rgba(38,0,0,0.82),rgba(18,0,0,0.95))] p-4 shadow-[0_18px_70px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-6">
          <div className="mb-6 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-white/42">
              MAD Community
            </p>

            <h3 className="mt-3 text-3xl font-black leading-[0.95] text-white sm:text-4xl">
              <span className="text-green-400 drop-shadow-[0_0_10px_rgba(0,255,120,0.5)]">
                Proof
              </span>{" "}
              Everyone’s MAD
            </h3>

            <p className="mt-3 text-sm text-white/60">
              Real people. Real orders. Real energy.
            </p>
          </div>

          <div className="proof-slider-mask">
            <div className="proof-slider-track">
              {slidingProofItems.map((item, i) => (
                <ProofCard
                  key={`${item.src}-${i}`}
                  src={item.src}
                  alt={item.alt}
                />
              ))}
            </div>
          </div>
        </section>

        <section
          id="ecosystem"
          className="mt-12 rounded-[38px] border border-white/10 bg-black/28 px-5 py-10 shadow-[0_18px_70px_rgba(0,0,0,0.4)] backdrop-blur-xl sm:px-8 sm:py-12 lg:px-10"
        >
          <SectionHeader
            eyebrow="Verified Presence"
            title={
              <>
                Verified and trusted on these{" "}
                <span className="text-red-500 drop-shadow-[0_0_12px_rgba(255,0,0,0.4)]">
                  platforms
                </span>
                .
              </>
            }
            body="Explore where $MAD is visible, recognized, and easy to verify."
            align="center"
          />

          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {ecosystemItems.map((item, index) => {
              const isLastOddItem =
                ecosystemItems.length % 2 === 1 &&
                index === ecosystemItems.length - 1;

              return (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className={[
                    "flex h-24 items-center justify-center rounded-[24px] border px-4 shadow-lg transition hover:-translate-y-0.5",
                    item.light
                      ? "border-white/10 bg-white"
                      : "border-white/10 bg-black",
                    isLastOddItem
                      ? "col-span-2 md:col-span-2 lg:col-span-1"
                      : "",
                  ].join(" ")}
                  aria-label={`Open ${item.name}`}
                  title={item.name}
                >
                  <Image
                    src={item.src}
                    alt={item.alt}
                    width={item.width}
                    height={item.height}
                    className="h-auto max-h-10 w-auto object-contain"
                  />
                </a>
              );
            })}
          </div>
        </section>

        <section
          id="confessions"
          className="mt-12 rounded-[38px] border border-white/10 bg-black/28 p-2 sm:p-3 shadow-[0_18px_70px_rgba(0,0,0,0.4)] backdrop-blur-xl"
        >
          <div className="min-w-0 px-1 sm:px-0">
            <MadConfessions />
          </div>
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
                Built on conviction, carried by culture, and driven by the
                people who choose to be $MAD.
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

        .proof-slider-mask {
          overflow: hidden;
          width: 100%;
        }

        .proof-slider-track {
          display: flex;
          width: max-content;
          gap: 1rem;
          animation: proofScroll 22s linear infinite;
        }

        .proof-slider-mask:hover .proof-slider-track {
          animation-play-state: paused;
        }

        .animate-spin-slow {
          animation: spinSlow 20s linear infinite;
        }

        @keyframes madMarquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }

        @keyframes proofScroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-50% - 0.5rem));
          }
        }

        @keyframes spinSlow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
