"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import MadConfessions from "./components/MadConfessions";

const ADDR = "Fa7ZE9nCEYnrHsnoeHuhEExJpchtrBtKXnWe6CgHpump";

const LINKS = {
  chartPage: `https://dexscreener.com/solana/${ADDR}`,
  telegram: "https://t.me/MadOfficalChannel",
  x: "https://x.com/devmadcoin",
  tiktok: "https://www.tiktok.com/@devmadcoin",
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

function InfoCard({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4 sm:p-5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/40">
        {label}
      </p>
      <div className="mt-2 text-sm font-medium text-white/88 sm:text-base">
        {value}
      </div>
    </div>
  );
}

export default function Home() {
  const [copied, setCopied] = useState(false);
  const [iframeReady, setIframeReady] = useState(false);

  async function copyAddr() {
    try {
      await navigator.clipboard.writeText(ADDR);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = ADDR;
      ta.setAttribute("readonly", "true");
      ta.style.position = "absolute";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    }
  }

  const marqueeItems = useMemo(() => [...ecosystemItems, ...ecosystemItems], []);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#050505] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,48,48,0.12),transparent_35%),radial-gradient(circle_at_20%_20%,rgba(255,0,60,0.10),transparent_30%),radial-gradient(circle_at_80%_30%,rgba(255,80,0,0.08),transparent_30%)]" />
        <div className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:42px_42px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/70" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-5 sm:px-6 lg:px-8">
        <header className="mb-5 rounded-full border border-white/10 bg-black/35 px-4 py-3 backdrop-blur-xl sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="relative grid h-10 w-10 place-items-center overflow-hidden rounded-full border border-red-500/20 bg-white/[0.04]">
                <span className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,59,48,0.2),transparent_70%)]" />
                <Image
                  src="/mad.png"
                  alt="$MAD icon"
                  width={28}
                  height={28}
                  className="relative z-10 h-7 w-7 object-contain"
                />
              </div>

              <div>
                <p className="text-xs font-black tracking-[0.28em] text-white">$MAD</p>
                <p className="text-[10px] uppercase tracking-[0.24em] text-white/45">
                  Solana • Culture • Chaos
                </p>
              </div>
            </div>

            <nav className="hidden items-center gap-2 md:flex">
              <a
                href="#merch"
                className="rounded-full px-4 py-2 text-sm text-white/68 transition hover:bg-white/[0.05] hover:text-white"
              >
                Merch
              </a>
              <a
                href="#chart"
                className="rounded-full px-4 py-2 text-sm text-white/68 transition hover:bg-white/[0.05] hover:text-white"
              >
                Chart
              </a>
              <a
                href="#signal"
                className="rounded-full px-4 py-2 text-sm text-white/68 transition hover:bg-white/[0.05] hover:text-white"
              >
                The Signal
              </a>
              <a
                href="#ecosystem"
                className="rounded-full px-4 py-2 text-sm text-white/68 transition hover:bg-white/[0.05] hover:text-white"
              >
                Ecosystem
              </a>
              <a
                href="#confessions"
                className="rounded-full px-4 py-2 text-sm text-white/68 transition hover:bg-white/[0.05] hover:text-white"
              >
                Confessions
              </a>
            </nav>
          </div>
        </header>

        <section className="overflow-hidden rounded-[38px] border border-white/10 bg-black/35 shadow-[0_24px_120px_rgba(0,0,0,0.5)] backdrop-blur-xl">
          <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="relative px-5 py-12 sm:px-8 sm:py-14 lg:px-12 lg:py-16">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-500/25 to-transparent" />

              <p className="text-[11px] font-semibold uppercase tracking-[0.38em] text-white/42">
                CONTROLLED CHAOS
              </p>

              <h1 className="mt-5 max-w-4xl text-[2.5rem] font-black leading-[0.9] tracking-[-0.04em] text-white sm:text-[4rem] lg:text-[5.2rem]">
                <span className="text-red-500 drop-shadow-[0_0_12px_rgba(255,0,0,0.55)]">
                  STOP
                </span>{" "}
                TRADING
                <br />
                NOISE.
                <br />
                START BEING{" "}
                <span className="text-red-500 drop-shadow-[0_0_12px_rgba(255,0,0,0.55)]">
                  $MAD
                </span>
                .
              </h1>

              <p className="mt-6 max-w-xl text-sm leading-7 text-white/62 sm:text-base">
                Built for the ones who feel pressure, read the signal, and move with conviction.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <PillButton href="#chart" primary>
                  Track Momentum
                </PillButton>
                <PillButton href="#signal">Read The Signal</PillButton>
                <PillButton href="#merch">Shop Merch</PillButton>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                <InfoCard
                  label="Contract"
                  value={<span className="break-all text-white/82">{ADDR}</span>}
                />
                <InfoCard label="Network" value={<span>Solana</span>} />
                <InfoCard
                  label="Positioning"
                  value={<span>Culture, identity, and controlled chaos</span>}
                />
              </div>

              <div className="mt-5">
                <button
                  onClick={copyAddr}
                  className="rounded-full border border-white/12 bg-white/[0.04] px-5 py-3 text-sm font-black text-white transition hover:bg-white/[0.07]"
                >
                  {copied ? "Copied!" : "Copy Contract"}
                </button>
              </div>
            </div>

            <div className="relative min-h-[340px] border-t border-white/10 bg-gradient-to-br from-red-500/10 via-transparent to-transparent lg:min-h-full lg:border-l lg:border-t-0">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,60,60,0.16),transparent_42%)]" />

              <div className="relative flex h-full items-center justify-center px-6 py-12">
                <div className="relative w-full max-w-[520px]">
                  <div className="absolute -inset-6 rounded-[40px] bg-red-500/10 blur-3xl" />

                  <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-black/55 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
                    <div className="relative overflow-hidden rounded-[26px] border border-white/10 bg-[#0a0a0a] p-6 sm:p-8">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,59,48,0.12),transparent_50%)]" />

                      <div className="relative flex flex-col items-center justify-center">
                        <div className="flex items-center justify-center rounded-[28px] border border-red-500/15 bg-black/30 p-4 shadow-[0_0_30px_rgba(255,0,0,0.08)]">
                          <video
                            autoPlay
                            muted
                            loop
                            playsInline
                            className="h-[180px] w-auto object-contain sm:h-[240px] lg:h-[280px]"
                          >
                            <source src="/loops/bullish-mad.mp4" type="video/mp4" />
                          </video>
                        </div>

                        <p className="mt-6 text-[11px] uppercase tracking-[0.28em] text-white/38">
                          Belief Layer
                        </p>

                        <p className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">
                          $MAD
                        </p>

                        <p className="mt-3 max-w-md text-center text-sm leading-7 text-white/58">
                          No promises. No guarantees. Only what people decide it becomes.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
                className="group rounded-[28px] border border-white/10 bg-white/[0.03] p-5 transition duration-300 hover:-translate-y-1 hover:border-red-500/30 hover:bg-white/[0.05]"
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
          id="chart"
          className="mt-12 rounded-[38px] border border-white/10 bg-black/28 px-5 py-10 shadow-[0_18px_70px_rgba(0,0,0,0.4)] backdrop-blur-xl sm:px-8 sm:py-12 lg:px-10"
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeader
              eyebrow="Live Chart"
              title={
                <>
                  Track the
                  <span className="text-red-500"> momentum</span>.
                </>
              }
              body="A live look at the momentum behind $MAD."
            />
            <PillButton href={LINKS.chartPage}>Open on Dexscreener</PillButton>
          </div>

          <div className="mt-8 overflow-hidden rounded-[30px] border border-white/10 bg-black/45">
            <div className="relative h-[420px] w-full sm:h-[560px] lg:h-[680px]">
              {!iframeReady && (
                <div className="absolute inset-0 grid place-items-center">
                  <div className="rounded-2xl border border-white/10 bg-black/60 px-4 py-2 text-sm text-white/70">
                    Loading chart…
                  </div>
                </div>
              )}

              <iframe
                className="absolute inset-0 h-full w-full"
                src={`https://dexscreener.com/solana/${ADDR}?embed=1&theme=dark&trades=0&info=0`}
                title="$MAD Dexscreener Chart"
                loading="lazy"
                referrerPolicy="no-referrer"
                allow="clipboard-write; fullscreen"
                onLoad={() => setIframeReady(true)}
              />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <PillButton href={LINKS.chartPage}>View Full Dexscreener</PillButton>
            <PillButton href={LINKS.jupiter} primary>
              Open on Jupiter
            </PillButton>
          </div>

          <p className="mt-4 text-sm leading-7 text-white/52">
            Watch the chart first. Read the signal second. If it makes sense to you, the route is right here.
          </p>
        </section>

        <section
          id="signal"
          className="mt-12 overflow-hidden rounded-[38px] border border-white/10 bg-black/28 shadow-[0_18px_70px_rgba(0,0,0,0.4)] backdrop-blur-xl"
        >
          <div className="relative">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(255,40,40,0.14),transparent_35%),radial-gradient(circle_at_85%_70%,rgba(255,80,0,0.10),transparent_30%)]" />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.02),transparent,rgba(255,255,255,0.02))]" />

            <div className="relative grid max-w-7xl grid-cols-1 gap-10 px-5 py-12 sm:px-8 sm:py-14 lg:grid-cols-[1.2fr_0.8fr] lg:gap-14 lg:px-10">
              <div className="max-w-3xl">
                <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.35em] text-white/45">
                  The Signal
                </p>

                <h2 className="max-w-4xl text-4xl font-black uppercase leading-[0.95] text-white sm:text-5xl lg:text-6xl">
                  <span className="text-[#ff3b30] drop-shadow-[0_0_18px_rgba(255,59,48,0.35)]">
                    Stop
                  </span>{" "}
                  Trading Noise.
                  <br />
                  Start Being $MAD.
                </h2>

                <p className="mt-6 max-w-2xl text-base leading-7 text-white/72 sm:text-lg">
                  $MAD is more than a token. It is a philosophy of control under pressure.
                  Most people chase hype, panic in red, and react without thinking.
                  $MAD stands for something different.
                </p>

                <div className="mt-8 space-y-4 text-sm leading-7 text-white/75 sm:text-base">
                  <p>
                    <span className="font-bold text-white">RIC</span> — control your emotions
                  </p>
                  <p>
                    <span className="font-bold text-white">WEAL</span> — build something that grows
                  </p>
                  <p>
                    Every pump tests your ego. Every dip tests your discipline. Every decision reveals who you are.
                  </p>
                </div>

                <div className="mt-8 rounded-[30px] border border-white/10 bg-white/[0.03] p-6 sm:p-7">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/42">
                    True Definition
                  </p>
                  <h3 className="mt-3 text-2xl font-black leading-tight text-white sm:text-3xl">
                    MAD is not just emotion.
                    <br />
                    It is the force that creates change.
                  </h3>
                  <p className="mt-4 max-w-2xl text-sm leading-7 text-white/66 sm:text-base">
                    Most people hear mad and think chaos. But pressure is only the beginning.
                    $MAD is the moment reaction becomes direction — when emotion,
                    conviction, and intensity turn into movement.
                  </p>
                </div>

                <div className="mt-6 rounded-[30px] border border-red-500/20 bg-red-500/[0.06] p-6 sm:p-7">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-red-400">
                    The MAD Method
                  </p>
                  <h3 className="mt-3 text-2xl font-black leading-tight text-white sm:text-3xl">
                    M.A.D. is a system.
                  </h3>

                  <div className="mt-5 space-y-3 text-sm leading-7 text-white/75 sm:text-base">
                    <p>
                      <span className="font-bold text-white">Measure</span> — Why am I mad?
                    </p>
                    <p>
                      <span className="font-bold text-white">Aim</span> — What’s my real target?
                    </p>
                    <p>
                      <span className="font-bold text-white">Do</span> — Take controlled action.
                    </p>
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap gap-4">
                  <PillButton href={LINKS.chartPage} primary>
                    Track The Signal
                  </PillButton>
                  <PillButton href={LINKS.jupiter}>Route on Jupiter</PillButton>
                </div>
              </div>

              <div className="grid gap-4 self-start">
                <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#ff3b30]">
                    RIC
                  </p>
                  <h3 className="mt-3 text-2xl font-bold text-white">Control</h3>
                  <p className="mt-2 text-sm leading-6 text-white/68">
                    Hold your center when the market tries to move your mind for you.
                  </p>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#ff3b30]">
                    WEAL
                  </p>
                  <h3 className="mt-3 text-2xl font-bold text-white">Growth</h3>
                  <p className="mt-2 text-sm leading-6 text-white/68">
                    Build what lasts. Not just hype, not just noise, not just a moment.
                  </p>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#ff3b30]">
                    The Test
                  </p>
                  <h3 className="mt-3 text-2xl font-bold text-white">Stay $MAD</h3>
                  <p className="mt-2 text-sm leading-6 text-white/68">
                    Anyone can cheer in green. Identity is revealed when conviction gets tested.
                  </p>
                </div>

                <div className="rounded-3xl border border-red-500/20 bg-red-500/[0.06] p-6 backdrop-blur-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#ff3b30]">
                    Change
                  </p>
                  <h3 className="mt-3 text-2xl font-bold text-white">Transformation</h3>
                  <p className="mt-2 text-sm leading-6 text-white/68">
                    To be $MAD is not to lose control. It is to be moved enough to change.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="ecosystem"
          className="mt-12 rounded-[38px] border border-white/10 bg-black/28 px-5 py-10 shadow-[0_18px_70px_rgba(0,0,0,0.4)] backdrop-blur-xl sm:px-8 sm:py-12 lg:px-10"
        >
          <SectionHeader
            eyebrow="Where $MAD Lives"
            title={<>The ecosystem, in one lane.</>}
            body="Explore the platforms, tools, and signals behind $MAD."
            align="center"
          />

          <div className="relative mt-8 overflow-hidden">
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
