import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { useMadPrice, fmtPrice, fmtUsd } from "@/hooks/useMadPrice";
import { LINKS } from "@/lib/data";
import { cn } from "@/lib/utils";

function Stat({
  label,
  value,
  accent,
  flash,
}: {
  label: string;
  value: string;
  accent?: "green" | "red";
  flash?: "up" | "down" | null;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/8 bg-black/40 p-5 transition-colors duration-300 hover:border-mad/40">
      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-ash">{label}</p>
      <p
        className={cn(
          "mt-2 font-mono text-2xl font-bold sm:text-3xl",
          accent === "green" && "text-green-400",
          accent === "red" && "text-mad-bright",
          !accent && "text-bone",
          flash === "up" && "animate-flash-up",
          flash === "down" && "animate-flash-down",
        )}
      >
        {value}
      </p>
    </div>
  );
}

export default function CommandCenter() {
  const { price, change24h, mcap, volume24h, liquidity, direction, loading } = useMadPrice();
  const up = (change24h ?? 0) >= 0;

  return (
    <section id="command" className="relative py-28">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_55%_at_50%_45%,rgba(234,32,34,0.07),transparent_70%)]" />
      <div className="relative mx-auto max-w-5xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Live feed · Solana"
          title={
            <>
              $MAD <span className="text-mad">Command Center</span>
            </>
          }
        />

        <Reveal>
          <div className="overflow-hidden rounded-3xl border border-mad/25 bg-panel shadow-glow-sm">
            {/* terminal title bar */}
            <div className="flex items-center gap-2 border-b border-white/8 bg-black/50 px-5 py-3">
              <span className="h-3 w-3 rounded-full bg-mad/80" />
              <span className="h-3 w-3 rounded-full bg-yellow-500/60" />
              <span className="h-3 w-3 rounded-full bg-green-500/60" />
              <span className="ml-3 font-mono text-xs text-ash">mad-terminal — live</span>
              <span className="ml-auto flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-green-400">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute h-full w-full animate-ping rounded-full bg-green-400 opacity-70" />
                  <span className="relative h-1.5 w-1.5 rounded-full bg-green-400" />
                </span>
                Streaming
              </span>
            </div>

            <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3">
              <Stat label="Price" value={fmtPrice(price)} flash={direction} />
              <Stat
                label="24h Change"
                value={loading || change24h == null ? "—" : `${up ? "+" : ""}${change24h.toFixed(2)}%`}
                accent={up ? "green" : "red"}
              />
              <Stat label="Market Cap" value={fmtUsd(mcap)} />
              <Stat label="24h Volume" value={fmtUsd(volume24h)} />
              <Stat label="Liquidity" value={fmtUsd(liquidity)} />
              <Stat label="Network" value="SOLANA" />
            </div>

            <div className="flex flex-col items-center gap-4 border-t border-white/8 px-6 py-6 sm:flex-row sm:justify-between">
              <p className="font-mono text-xs text-ash">
                🔒 Dev locked <span className="text-bone">100M $MAD</span> · non-cancelable until Dec
                2026 ·{" "}
                <a
                  href={LINKS.lockProof}
                  target="_blank"
                  rel="noreferrer"
                  className="text-mad-bright underline decoration-mad/40 underline-offset-4 hover:text-bone"
                >
                  on-chain proof ↗
                </a>
              </p>
              <div className="flex gap-3">
                <a
                  href={LINKS.chart}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-white/15 px-6 py-2.5 text-sm font-bold text-bone transition-all duration-300 hover:border-mad/50 hover:text-mad-bright"
                >
                  Chart ↗
                </a>
                <a
                  href={LINKS.buy}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full bg-mad px-6 py-2.5 text-sm font-bold uppercase tracking-wider text-white shadow-glow-sm transition-all duration-300 hover:scale-105 hover:shadow-glow"
                >
                  Buy $MAD
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
