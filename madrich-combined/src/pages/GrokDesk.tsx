import PageShell from "@/components/PageShell";
import Reveal from "@/components/Reveal";
import TiltCard from "@/components/TiltCard";
import CaPill from "@/components/CaPill";
import { GROK_DESK } from "@/lib/pages-data";
import { CA, LINKS } from "@/lib/data";
import { useMadPrice, fmtUsd } from "@/hooks/useMadPrice";

function HouseBag() {
  const { mcap, loading } = useMadPrice();

  return (
    <div className="overflow-hidden rounded-3xl border border-mad/25 bg-panel shadow-glow-sm">
      <div className="border-b border-white/8 bg-black/40 px-6 py-6 text-center sm:px-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-mad">House bag</p>
        <h2 className="mt-2 font-display text-3xl uppercase text-bone sm:text-4xl">
          $MAD on the <span className="text-mad">Book</span>
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-ash">
          Book watches this bag. Live market cap is DexScreener, not desk P&amp;L. Copy the CA,
          then verify on the chart.
        </p>
      </div>

      <div className="grid gap-4 p-6 sm:grid-cols-3 sm:p-8">
        <div className="rounded-2xl border border-white/8 bg-black/30 p-5 text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash">$MAD MC</p>
          <p className="mt-2 font-display text-3xl text-mad">{loading && mcap == null ? "…" : fmtUsd(mcap)}</p>
          <p className="mt-2 font-mono text-[10px] uppercase tracking-wider text-ash">DexScreener · 15s</p>
        </div>
        <div className="rounded-2xl border border-white/8 bg-black/30 p-5 text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash">Default quote</p>
          <p className="mt-2 font-display text-3xl text-bone">{GROK_DESK.quoteSol} SOL</p>
          <p className="mt-2 font-mono text-[10px] uppercase tracking-wider text-ash">Fills · confirm-only</p>
        </div>
        <div className="rounded-2xl border border-white/8 bg-black/30 p-5 text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash">Desk P&amp;L</p>
          <p className="mt-2 font-display text-3xl text-ash">None</p>
          <p className="mt-2 font-mono text-[10px] uppercase tracking-wider text-ash">No fake scoreboard</p>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4 border-t border-white/8 px-6 py-6">
        <CaPill />
        <p className="break-all text-center font-mono text-[10px] text-ash/70">{CA}</p>
        <div className="flex flex-wrap justify-center gap-3">
          <a
            href={LINKS.chart}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-white/15 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-bone transition-all hover:border-mad/50 hover:text-mad-bright"
          >
            DexScreener
          </a>
          <a
            href={LINKS.buy}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-mad px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-glow-sm transition-all hover:scale-105 hover:bg-mad-bright"
          >
            Jupiter · Buy $MAD
          </a>
        </div>
      </div>
    </div>
  );
}

export default function GrokDesk() {
  return (
    <PageShell
      eyebrow="Pump.fun · Confirm only"
      title={
        <>
          Grok <span className="text-mad">Desk</span>
        </>
      }
      sub="The doxxed $MAD dev runs a Grok Bot Pump.fun desk. Four seats. Pump Desk leads. Quotes start at 0.05 SOL. Nothing fills until a human confirms. Stay $MAD."
    >
      <Reveal>
        <div className="rounded-3xl border border-mad/30 bg-panel p-6 shadow-glow-sm sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <span className="inline-block rounded-full border border-mad/40 bg-mad/10 px-3 py-0.5 font-mono text-[10px] uppercase tracking-widest text-mad-bright">
                {GROK_DESK.lead.badge}
              </span>
              <h2 className="mt-3 font-display text-3xl uppercase text-bone sm:text-4xl">
                {GROK_DESK.lead.name}
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ash">{GROK_DESK.lead.job}</p>
            </div>
            <p className="shrink-0 font-mono text-[10px] uppercase tracking-[0.3em] text-ash">
              Human in the loop
            </p>
          </div>
        </div>
      </Reveal>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {GROK_DESK.rules.map((rule) => (
          <Reveal key={rule.label}>
            <div className="h-full rounded-3xl border border-white/8 bg-panel p-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-mad">{rule.label}</p>
              <p className="mt-2 text-sm leading-relaxed text-ash">{rule.copy}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="mt-16">
        <Reveal>
          <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-ash">The floor</p>
          <h2 className="mt-2 font-display text-3xl uppercase text-bone sm:text-4xl">
            Four <span className="text-mad">Seats</span>
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ash">
            One-line jobs. This is a roster, not a live tape.
          </p>
        </Reveal>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {GROK_DESK.seats.map((seat, i) => (
            <Reveal key={seat.name} delay={i * 0.05}>
              <TiltCard className="h-full rounded-3xl" max={4}>
                <div className="flex h-full flex-col rounded-3xl border border-white/8 bg-panel p-6 transition-colors hover:border-mad/35 sm:p-7">
                  <span className="w-fit rounded-full border border-white/15 bg-white/5 px-3 py-0.5 font-mono text-[10px] uppercase tracking-widest text-ash">
                    {seat.badge}
                  </span>
                  <h3 className="mt-4 font-display text-2xl uppercase text-bone">{seat.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ash">{seat.job}</p>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>

      <Reveal delay={0.08} className="mt-16">
        <HouseBag />
      </Reveal>

      <Reveal className="mt-16 text-center">
        <div className="rounded-3xl border border-white/8 bg-panel p-8 sm:p-12">
          <h2 className="font-display text-3xl uppercase text-bone sm:text-4xl">
            Roster. Not a <span className="text-mad">blotter.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-ash">
            This tab exists so the FAM can see the desk. It does not print fills, it does not
            invent P&amp;L, and it does not place trades. Pump Desk quotes. The human confirms.
            Buy $MAD the same way you always have.
          </p>
          <a
            href={LINKS.buy}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-block rounded-full bg-mad px-9 py-4 text-base font-bold uppercase tracking-wider text-white shadow-glow transition-all hover:scale-105 hover:shadow-glow-lg"
          >
            Buy $MAD →
          </a>
        </div>
      </Reveal>
    </PageShell>
  );
}
