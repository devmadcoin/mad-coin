"use client";

import Image from "next/image";
import Link from "next/link";

const ADDR = "Fa7ZE9nCEYnrHsnoeHuhEExJpchtrBtKXnWe6CgHpump";

const LINKS = {
  home: "/",
  roadmap: "/roadmap",
  forge: "/forge",
  merch: "/merch",
  art: "/memes",
  lore: "/lore",
  game: "/game",
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
    description:
      "The everyday signal piece. Clean, bold, and easy to add anywhere the culture needs a little more rage.",
    href: LINKS.retailSticker,
    src: "/stickers/Mad-Sticker-logo.png",
    badge: "Classic",
  },
  {
    name: "Card Wrap",
    subtitle: "Premium embossed",
    description:
      "A sharper premium look with texture and attitude. Built for holders who want the flex to feel elevated.",
    href: LINKS.premiumCard,
    src: "/stickers/Mad-Premium-Embossed-Card-Wrap.png",
    badge: "Premium",
  },
  {
    name: "Rich Wrap",
    subtitle: "Luxury variant",
    description:
      "The louder luxury version. Same $MAD energy, pushed into a more high-end lane.",
    href: LINKS.richPremiumCard,
    src: "/stickers/Mad-Rich-Premium-Embossed-Card-Wrap.png",
    badge: "Luxury",
  },
  {
    name: "Peeker",
    subtitle: "Window flex",
    description:
      "A smaller but high-impact piece made to catch eyes fast. Minimal space, maximum signal.",
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
  const className = [
    "inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-black transition duration-200",
    primary
      ? "border border-red-500/30 bg-red-500 text-white hover:scale-[1.01] hover:bg-red-400"
      : "border border-white/12 bg-white/[0.04] text-white hover:border-white/20 hover:bg-white/[0.07]",
  ].join(" ");

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
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

function NavPill({
  href,
  children,
  active = false,
}: {
  href: string;
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={[
        "rounded-full px-4 py-2 text-sm font-semibold transition",
        active
          ? "border border-red-500/35 bg-red-500/15 text-red-300 shadow-[0_0_24px_rgba(255,0,0,0.18)]"
          : "text-white/68 hover:bg-white/[0.05] hover:text-white",
      ].join(" ")}
    >
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

      <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-5 sm:px-6 lg:px-8">
        <header className="mb-5 rounded-full border border-white/10 bg-black/35 px-4 py-3 backdrop-blur-xl sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-3">
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
                  <p className="text-xs font-black tracking-[0.28em] text-white">
                    $MAD
                  </p>
                  <p className="text-[10px] uppercase tracking-[0.24em] text-white/45">
                    Solana • Culture • Chaos
                  </p>
                </div>
              </Link>
            </div>

            <nav className="hidden items-center gap-2 md:flex">
              <NavPill href={LINKS.home}>Home</NavPill>
              <NavPill href={LINKS.roadmap}>Roadmap</NavPill>
              <NavPill href={LINKS.forge}>Forge</NavPill>
              <NavPill href={LINKS.merch} active>
                Merch
              </NavPill>
              <NavPill href={LINKS.art}>$MAD Art</NavPill>
              <NavPill href={LINKS.lore}>Lore</NavPill>
              <NavPill href={LINKS.game}>Game</NavPill>
            </nav>

            <div className="flex items-center gap-2">
              <PillLink href={LINKS.jupiter} primary external>
                Buy on Jupiter
              </PillLink>
            </div>
          </div>
        </header>

        <section className="overflow-hidden rounded-[38px] border border-white/10 bg-black/35 shadow-[0_24px_120px_rgba(0,0,0,0.5)] backdrop-blur-xl">
          <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="relative px-5 py-12 sm:px-8 sm:py-14 lg:px-12 lg:py-16">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-500/25 to-transparent" />

              <p className="text-[11px] font-semibold uppercase tracking-[0.38em] text-white/42">
                RETAIL SIGNAL
              </p>

              <h1 className="mt-5 max-w-4xl text-[2.5rem] font-black leading-[0.9] tracking-[-0.04em] text-white sm:text-[4rem] lg:text-[5.2rem]">
                DON’T JUST
                <br />
                HOLD <span className="text-red-500">$MAD</span>.
                <br />
                WEAR IT.
              </h1>

              <p className="mt-6 max-w-xl text-sm leading-7 text-white/62 sm:text-base">
                A storefront for the people carrying the signal. Same culture.
                Same chaos. Now in physical form.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <PillLink href="#products" primary>
                  Shop the Drop
                </PillLink>
                <PillLink href={LINKS.home}>Back to Home</PillLink>
                <PillLink href={LINKS.jupiter} external>
                  Buy $MAD
                </PillLink>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                <InfoCard label="Category" value={<span>Merch / Signal Pieces</span>} />
                <InfoCard label="Aesthetic" value={<span>Luxury meme chaos</span>} />
                <InfoCard label="Built For" value={<span>Holders, collectors, believers</span>} />
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

                        <p className="mt-3 max-w-md text-center text-sm leading-7 text-white/58">
                          The premium flex lane for the people who want their
                          $MAD to look louder, cleaner, and more collectible.
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
              MERCH FOR THE BELIEVERS • COLLECT THE SIGNAL • RETAIL CHAOS IN
              PHYSICAL FORM
            </span>
            <span className="mx-6">
              MERCH FOR THE BELIEVERS • COLLECT THE SIGNAL • RETAIL CHAOS IN
              PHYSICAL FORM
            </span>
            <span className="mx-6">
              MERCH FOR THE BELIEVERS • COLLECT THE SIGNAL • RETAIL CHAOS IN
              PHYSICAL FORM
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
              body="Every piece below opens the product directly, but now the experience starts inside your own world first."
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
                <div className="mb-4 flex items-center justify-between">
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
                  <h3 className="text-xl font-black text-white">{item.name}</h3>
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
          <SectionHeader
            eyebrow="Why a Merch Page"
            title={
              <>
                Keep people in the <span className="text-red-500">$MAD</span> world longer.
              </>
            }
            body="Instead of instantly ejecting visitors to an outside store, this page gives the brand its own retail layer first."
            align="center"
          />

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            <InfoCard
              label="Brand"
              value={
                <span>
                  Makes the project feel more like a real ecosystem and less
                  like a single outbound link.
                </span>
              }
            />
            <InfoCard
              label="Experience"
              value={
                <span>
                  Lets visitors browse, compare, and understand what each piece
                  is before leaving.
                </span>
              }
            />
            <InfoCard
              label="Conversion"
              value={
                <span>
                  Gives your merch a cleaner storefront presentation with more
                  premium energy.
                </span>
              }
            />
          </div>
        </section>

        <footer className="mt-14 border-t border-white/10 pt-8 text-center">
          <p className="mx-auto max-w-3xl text-xs leading-7 text-white/42 sm:text-sm sm:leading-8">
            $MAD is not about value.
            <br />
            It’s about belief.
            <br />
            <br />
            This page is the retail layer for the culture.
            <br />
            Collect what carries the signal.
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
