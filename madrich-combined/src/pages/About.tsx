import PageShell from "@/components/PageShell";
import Reveal from "@/components/Reveal";
import { useMadPrice, fmtPrice } from "@/hooks/useMadPrice";
import { LINKS } from "@/lib/data";

export default function About() {
  const { price, change24h, loading } = useMadPrice();
  const up = (change24h ?? 0) >= 0;

  return (
    <PageShell
      eyebrow="The Origin"
      title={
        <>
          Get <span className="text-mad">$MAD</span>. Then Change Everything.
        </>
      }
      sub="$MAD isn't a ticker. It's a frequency. The root word of MAD means TO CHANGE. Every breakthrough in your life started with the same signal: you got MAD enough to stop accepting the current reality."
    >
      <Reveal>
        <div className="overflow-hidden rounded-2xl border border-white/10">
          <img src="/mad-logo.png" alt="$MAD Banner" className="mx-auto h-40 w-40 object-contain sm:h-52 sm:w-52" />
        </div>
      </Reveal>

      <Reveal delay={0.05} className="mt-6 text-center">
        <a
          href={LINKS.chart}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2.5 rounded-full border border-mad/30 bg-mad/10 px-5 py-2.5 transition-all hover:border-mad/50 hover:bg-mad/20"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mad opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-mad" />
          </span>
          <span className="font-mono text-xs uppercase tracking-wider text-ash">Live Price</span>
          <span className="font-display text-lg text-bone">{loading ? "—" : fmtPrice(price)}</span>
          <span className={`text-xs font-medium ${up ? "text-green-400" : "text-mad-bright"}`}>
            {loading ? "" : `${up ? "▲" : "▼"} ${Math.abs(change24h ?? 0).toFixed(2)}%`}
          </span>
        </a>
      </Reveal>

      <Reveal delay={0.08} className="mt-10">
        <div className="rounded-2xl border border-white/8 bg-panel p-8">
          <p className="text-center font-mono text-xs uppercase tracking-[0.3em] text-ash">The On-Chain Proof</p>
          <div className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-ash">Price</p>
              <p className="mt-1 font-display text-3xl text-mad">{loading ? "—" : fmtPrice(price)}</p>
              <p className={`mt-0.5 text-xs ${up ? "text-green-400" : "text-mad-bright"}`}>
                {loading ? "" : `${up ? "▲" : "▼"} ${Math.abs(change24h ?? 0).toFixed(2)}%`}
              </p>
            </div>
            <div className="text-center">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-ash">Total Supply</p>
              <p className="mt-1 font-display text-3xl text-bone">486.6M</p>
              <p className="mt-0.5 text-xs text-ash/60">50% burned forever</p>
            </div>
            <div className="text-center">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-ash">Launch Date</p>
              <p className="mt-1 font-display text-3xl text-bone">Feb 4</p>
              <p className="mt-0.5 text-xs text-ash/60">2026</p>
            </div>
            <div className="text-center">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-ash">Dev Status</p>
              <p className="mt-1 font-display text-3xl text-bone">Doxxed</p>
              <p className="mt-0.5 text-xs text-ash/60">Coffee Collects</p>
            </div>
          </div>
        </div>
      </Reveal>
    </PageShell>
  );
}
