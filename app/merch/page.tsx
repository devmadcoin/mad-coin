"use client";

import Image from "next/image";
import Link from "next/link";

const ADDR = "Fa7ZE9nCEYnrHsnoeHuhEExJpchtrBtKXnWe6CgHpump";

const LINKS = {
  home: "/",
  jupiter: `https://jup.ag/swap/SOL-${ADDR}`,
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
    description: "Clean, bold, and easy to place anywhere.",
    price: "$5.98",
    href: LINKS.retailSticker,
    src: "/stickers/Mad-Sticker-logo.png",
    badge: "Classic",
  },
  {
    name: "Card Wrap",
    subtitle: "Premium embossed",
    description: "A sharper premium look with texture and attitude.",
    price: "$10.98",
    href: LINKS.premiumCard,
    src: "/stickers/Mad-Premium-Embossed-Card-Wrap.png",
    badge: "Premium",
  },
  {
    name: "Rich Wrap",
    subtitle: "Luxury variant",
    description: "The louder luxury version with richer flex energy.",
    price: "$10.98",
    href: LINKS.richPremiumCard,
    src: "/stickers/Mad-Rich-Premium-Embossed-Card-Wrap.png",
    badge: "Luxury",
  },
  {
    name: "Peeker",
    subtitle: "Window flex",
    description: "Small piece. Fast attention. Big signal.",
    price: "$9.98",
    href: LINKS.peeker,
    src: "/stickers/Mad-Peeker.png",
    badge: "Fan Favorite",
  },
] as const;

function PillLink({
  href,
  children,
  primary = false,
  external = false,
}: {
  href: string;
  children: React.ReactNode;
  primary?: boolean;
  external?: boolean;
}) {
  const isHash = href.startsWith("#");

  const className = [
    "inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-black transition duration-200",
    primary
      ? "border border-red-500/30 bg-red-500 text-white hover:scale-[1.01] hover:bg-red-400"
      : "border border-white/12 bg-white/[0.04] text-white hover:border-white/20 hover:bg-white/[0.07]",
  ].join(" ");

  if (external || isHash) {
    return (
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer" : undefined}
        className={className}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
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

export default function MerchPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#050505] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,48,48,0.12),transparent_35%),radial-gradient(circle_at_20%_20%,rgba(255,0,60,0.10),transparent_30%),radial-gradient(circle_at_80%_30%,rgba(255,80,0,0.08),transparent_30%)]" />
        <div className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:42px_42px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/70" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-10 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-[38px] border border-white/10 bg-black/35 shadow-[0_24px_120px_rgba(0,0,0,0.5)] backdrop-blur-xl">
          <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="relative px-5 py-12 sm:px-8 sm:py-14 lg:px-12 lg:py-16">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-500/25 to-transparent" />

              <p className="text-[11px] font-semibold uppercase tracking-[0.38em] text-white/42">
                MERCH
              </p>

              <h1 className="mt-5 max-w-4xl text-[2.5rem] font-black leading-[0.9] tracking-[-0.04em] text-white sm:text-[4rem] lg:text-[5.2rem]">
                DON’T JUST
                <br />
                HOLD <span className="text-red-500">$MAD</span>.
                <br />
                WEAR IT.
              </h1>

              <p className="mt-6 max-w-xl text-sm leading-7 text-white/62 sm:text-base">
                Stickers, wraps, and signal pieces for the people carrying the
                brand into real life.
              </p>

              <div className="mt-8">
                <PillLink href="#products" primary>
                  Shop Now
                </PillLink>
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
                        <div className="relative flex h-[260px] w-full items-center justify-center overflow-hidden rounded-[28px] border border-red-500/15 bg-black/30 p-6 shadow-[0_0_30px_rgba(255,0,0,0.08)] sm:h-[320px]">
                          <Image
                            src="/stickers/Mad-Rich-Premium-Embossed-Card-Wrap.png"
                            alt="$MAD featured merch"
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-contain p-8"
                          />
                        </div>

                        <p className="mt-6 text-[11px] uppercase tracking-[0.28em] text-white/38">
                          Featured Piece
                        </p>

                        <p className="mt-3 text-center text-3xl font-black tracking-tight sm:text-5xl">
                          Rich Wrap
                        </p>

                        <p className="mt-2 text-center text-xl font-black text-red-400">
                          $10.98
                        </p>

                        <p className="mt-3 max-w-md text-center text-sm leading-7 text-white/58">
                          The premium flex piece for the people who want their
                          $MAD to look louder and cleaner.
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
              MERCH FOR THE BELIEVERS • COLLECT THE SIGNAL • WEAR THE CULTURE
            </span>
            <span className="mx-6">
              MERCH FOR THE BELIEVERS • COLLECT THE SIGNAL • WEAR THE CULTURE
            </span>
            <span className="mx-6">
              MERCH FOR THE BELIEVERS • COLLECT THE SIGNAL • WEAR THE CULTURE
            </span>
          </div>
        </section>

        <section
          id="products"
          className="mt-12 rounded-[38px] border border-white/10 bg-black/28 px-5 py-10 shadow-[0_18px_70px_rgba(0,0,0,0.4)] backdrop-blur-xl sm:px-8 sm:py-12 lg:px-10"
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeader
              eyebrow="Storefront"
              title={
                <>
                  The <span className="text-red-500">$MAD</span> drop.
                </>
              }
              body="Pick a piece and open the product directly."
            />
            <div className="shrink-0">
              <PillLink href={LINKS.home}>Return Home</PillLink>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {merchItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-[28px] border border-white/10 bg-white/[0.03] p-5 transition duration-300 hover:-translate-y-1 hover:border-red-500/30 hover:bg-white/[0.05]"
              >
                <div className="mb-4 flex items-center justify-between gap-3">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/40">
                    {item.subtitle}
                  </p>
                  <span className="rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-red-300">
                    {item.badge}
                  </span>
                </div>

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
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-xl font-black text-white">{item.name}</h3>
                    <span className="shrink-0 text-lg font-black text-red-400">
                      {item.price}
                    </span>
                  </div>

                  <p className="mt-3 text-sm leading-7 text-white/58">
                    {item.description}
                  </p>

                  <p className="mt-4 text-sm font-bold text-red-400">
                    Open Product →
                  </p>
                </div>
              </a>
            ))}
          </div>
        </section>

        <section className="mt-12 rounded-[38px] border border-white/10 bg-black/28 px-5 py-10 shadow-[0_18px_70px_rgba(0,0,0,0.4)] backdrop-blur-xl sm:px-8 sm:py-12 lg:px-10">
          <div className="grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-white/42">
                Apparel
              </p>

              <h2 className="mt-4 text-3xl font-black leading-[0.95] tracking-tight text-white sm:text-4xl md:text-5xl">
                <span className="text-red-500">$MAD</span> isn’t just held.
                <br />
                It’s worn.
              </h2>

              <p className="mt-5 max-w-xl text-sm leading-7 text-white/62 sm:text-base">
                The first apparel pieces are on the way.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <span className="inline-flex items-center rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-red-300">
                  Coming Soon
                </span>

                <PillLink href="#products">Shop Current Merch</PillLink>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[30px] border border-white/10">
              <div className="relative h-[420px] w-full sm:h-[560px]">
                <Image
                  src="/merch/MAD-MERCH-SAMPLE-SHIRT.jpg"
                  alt="$MAD apparel coming soon"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />

                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/55">
                      Drop 001
                    </p>
                    <p className="mt-2 text-2xl font-black text-white sm:text-3xl">
                      MAD RICH.
                    </p>
                  </div>

                  <span className="shrink-0 rounded-full border border-white/15 bg-black/45 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/85 backdrop-blur">
                    Apparel Preview
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-12 rounded-[38px] border border-white/10 bg-black/28 px-5 py-10 shadow-[0_18px_70px_rgba(0,0,0,0.4)] backdrop-blur-xl sm:px-8 sm:py-12 lg:px-10">
          <SectionHeader
            eyebrow="Built for the Culture"
            title={
              <>
                More than merch.
                <br />
                It’s <span className="text-red-500">$MAD</span> you can wear.
              </>
            }
            body="Clean, bold, collectible pieces built to carry the signal into the real world."
            align="center"
          />

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            <InfoCard
              label="Signal"
              value={<span>Instantly reads as part of the $MAD universe.</span>}
            />
            <InfoCard
              label="Style"
              value={<span>Sharp, minimal, high-contrast presentation.</span>}
            />
            <InfoCard
              label="Collectible"
              value={<span>Built to feel worth keeping.</span>}
            />
          </div>
        </section>

        <footer className="mt-14 border-t border-white/10 pt-8 text-center">
          <p className="mx-auto max-w-3xl text-xs leading-7 text-white/42 sm:text-sm sm:leading-8">
            $MAD is not just a token.
            <br />
            It’s a signal.
            <br />
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
