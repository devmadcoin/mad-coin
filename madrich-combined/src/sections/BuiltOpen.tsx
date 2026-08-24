import { Link } from "react-router";
import Reveal from "@/components/Reveal";
import { IMPACT_STATS } from "@/lib/pages-data";
import { LINKS } from "@/lib/data";

const ITEMS = [
  {
    label: "Liquidity Locked",
    value: "100M $MAD",
    sub: "Locked via Streamflow · verifiable on-chain",
    href: IMPACT_STATS.onChainProof,
    external: true,
  },
  {
    label: "Token Burns",
    value: `${IMPACT_STATS.tokensBurned / 1_000_000}M $MAD`,
    sub: "Forever removed from circulation",
    href: LINKS.lockProof,
    external: true,
  },
  {
    label: "Community Donations",
    value: `$${IMPACT_STATS.totalDonatedUSD.toLocaleString()}`,
    sub: "Distributed to holders & causes",
    href: "/community",
    external: false,
  },
  {
    label: "Holder Tools",
    value: "50,000 $MAD",
    sub: "DCA tracker, scanner, wallet — gated. Not a paper trader.",
    href: "/tools",
    external: false,
  },
  {
    label: "Doxxed Dev",
    value: "Coffee Collects",
    sub: "YouTuber · Game Dev · Real identity",
    href: LINKS.youtube,
    external: true,
  },
];

export default function BuiltOpen() {
  return (
    <section className="relative py-28">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_50%_30%,rgba(234,32,34,0.06),transparent_70%)]" />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <div className="mb-12 text-center">
            <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-mad">Proof</p>
            <h2 className="mt-3 font-display text-3xl uppercase tracking-wide text-bone sm:text-4xl">
              Built in the Open
            </h2>
            <p className="mt-3 text-sm text-ash">No shadows. No secrets. Everything verifiable.</p>
          </div>
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ITEMS.map((item, i) => {
            const inner = (
              <>
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash">{item.label}</p>
                <p className="mt-2 font-display text-2xl uppercase text-bone">{item.value}</p>
                <p className="mt-2 text-sm leading-relaxed text-ash">{item.sub}</p>
              </>
            );
            const cls =
              "block h-full rounded-3xl border border-white/8 bg-panel p-6 transition-all duration-300 hover:border-mad/35";
            return (
              <Reveal key={item.label} delay={i * 0.06}>
                {item.external ? (
                  <a href={item.href} target="_blank" rel="noreferrer" className={cls}>
                    {inner}
                  </a>
                ) : (
                  <Link to={item.href} className={cls}>
                    {inner}
                  </Link>
                )}
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
