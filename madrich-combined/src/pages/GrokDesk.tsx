import { useEffect, useState, type ReactNode } from "react";
import PageShell from "@/components/PageShell";
import Reveal from "@/components/Reveal";
import CaPill from "@/components/CaPill";
import { GROK_DESK } from "@/lib/pages-data";
import { CA, LINKS } from "@/lib/data";
import { useMadPrice, fmtUsd } from "@/hooks/useMadPrice";
import { cn } from "@/lib/utils";

const MAD_MINT = CA;
const PUMP_LATEST =
  "https://frontend-api-v3.pump.fun/coins?limit=8&offset=0&sort=created_timestamp&order=DESC";
const GRADUATE_SOL = 85;

type Print = {
  ticker: string;
  mint: string;
  mc: string;
  solIn: string;
  curve: string;
  age: string;
  live: boolean;
  why: string;
};

function fmtAge(ts: number) {
  const s = Math.max(0, Math.floor((Date.now() - ts) / 1000));
  if (s < 60) return `${s}s`;
  if (s < 3600) return `${Math.floor(s / 60)}m`;
  return `${Math.floor(s / 3600)}h`;
}

function TapeSeat() {
  const [prints, setPrints] = useState<Print[]>([]);
  const [status, setStatus] = useState("Waiting for live prints…");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch(PUMP_LATEST);
        if (!res.ok) throw new Error("tape feed down");
        const rows = (await res.json()) as Array<Record<string, unknown>>;
        if (cancelled) return;
        const next: Print[] = [];
        for (const row of rows) {
          const mint = String(row.mint || "");
          const ticker = String(row.symbol || "—");
          if (!mint || mint === MAD_MINT || ticker.toUpperCase() === "MAD") continue;
          const sol = Number(row.real_sol_reserves || 0) / 1e9;
          const curvePct = Math.min(100, (sol / GRADUATE_SOL) * 100);
          const usd = Number(row.usd_market_cap ?? row.market_cap_usd ?? 0);
          const desc = String(row.description || row.name || "").replace(/\s+/g, " ").trim();
          next.push({
            ticker,
            mint,
            mc: usd ? fmtUsd(usd) : "—",
            solIn: `${sol.toFixed(2)} SOL`,
            curve: `${curvePct.toFixed(0)}%`,
            age: fmtAge(Number(row.created_timestamp || 0)),
            live: row.complete !== true && row.is_banned !== true,
            why: desc ? desc.slice(0, 88) : "New Pump.fun mint. Not a hunt on $MAD.",
          });
        }
        setPrints(next.slice(0, 6));
        setStatus(next.length ? "Live Pump.fun prints. $MAD is not a hunt." : "No prints.");
      } catch {
        if (!cancelled) {
          setPrints([]);
          setStatus("Tape feed unreachable. No seeded prints.");
        }
      }
    }

    load();
    const id = setInterval(load, 20000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  return (
    <Seat name="Tape" badge="Live prints">
      <p className="text-sm leading-relaxed text-ash">
        Ticker, mint, MC, SOL in, curve %, age, live or not, one-line why. No confetti. No seeded
        P&amp;L. $MAD is not a hunt.
      </p>
      <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.25em] text-ash">{status}</p>
      {prints.length === 0 ? (
        <p className="mt-4 font-mono text-xs text-ash">—</p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[720px] text-left font-mono text-[11px]">
            <thead className="text-[10px] uppercase tracking-wider text-ash">
              <tr>
                <th className="pb-2 pr-3">Ticker</th>
                <th className="pb-2 pr-3">Mint</th>
                <th className="pb-2 pr-3">MC</th>
                <th className="pb-2 pr-3">SOL in</th>
                <th className="pb-2 pr-3">Curve</th>
                <th className="pb-2 pr-3">Age</th>
                <th className="pb-2 pr-3">Live</th>
                <th className="pb-2">Why</th>
              </tr>
            </thead>
            <tbody className="text-bone/80">
              {prints.map((p) => (
                <tr key={p.mint} className="border-t border-white/8">
                  <td className="py-2 pr-3 font-bold text-bone">{p.ticker}</td>
                  <td className="py-2 pr-3 text-ash">{p.mint.slice(0, 4)}…{p.mint.slice(-4)}</td>
                  <td className="py-2 pr-3">{p.mc}</td>
                  <td className="py-2 pr-3">{p.solIn}</td>
                  <td className="py-2 pr-3">{p.curve}</td>
                  <td className="py-2 pr-3">{p.age}</td>
                  <td className={cn("py-2 pr-3", p.live ? "text-green-400" : "text-ash")}>
                    {p.live ? "yes" : "no"}
                  </td>
                  <td className="py-2 text-ash">{p.why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Seat>
  );
}

function RiskSeat() {
  const skips = [
    "Mint or freeze authority live",
    "Top-10 > 40% ex-curve",
    "Reused image",
    "Unverifiable — kill",
  ];

  return (
    <Seat name="Risk" badge="PASS / WATCH / KILL">
      <p className="text-sm leading-relaxed text-ash">
        PASS / WATCH / KILL. Unverifiable is a kill. WATCH is not a quote.
      </p>
      <div className="mt-4 flex flex-wrap gap-2" aria-label="Risk gate">
        {["PASS", "WATCH", "KILL"].map((g) => (
          <span
            key={g}
            className={cn(
              "rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-widest",
              g === "PASS" && "border-green-500/40 bg-green-500/10 text-green-400",
              g === "WATCH" && "border-yellow-500/40 bg-yellow-500/10 text-yellow-400",
              g === "KILL" && "border-mad/40 bg-mad/10 text-mad-bright",
            )}
          >
            {g}
          </span>
        ))}
      </div>
      <p className="mt-3 text-sm leading-relaxed text-ash">
        Only PASS can quote. WATCH is not a quote. No buy button. No autotrade.
      </p>
      <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.25em] text-mad">Hard skips</p>
      <ul className="mt-2 space-y-1.5 text-sm text-ash">
        {skips.map((s) => (
          <li key={s}>· {s}</li>
        ))}
      </ul>
    </Seat>
  );
}

function FillsSeat() {
  return (
    <Seat name="Fills" badge="Quote only after PASS">
      <p className="text-sm leading-relaxed text-ash">
        Quote only after a PASS. Human greenlights in chat. Phantom signs. No buy button. Bots do
        not autotrade.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <Stat label="Size" value={`${GROK_DESK.quoteSol} SOL`} note="default ticket" />
        <Stat label="Slip" value={`${GROK_DESK.slipPct}%`} note="quote slip" />
        <Stat label="Max" value={`${GROK_DESK.maxSol} SOL`} note="hard cap" />
      </div>
      <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.25em] text-mad">Brackets</p>
      <ul className="mt-2 space-y-1.5 text-sm text-ash">
        <li>· −40% or creator dump</li>
        <li>· +100% or graduation</li>
        <li>· {GROK_DESK.ageOutMin} min age-out</li>
      </ul>
    </Seat>
  );
}

function BookSeat() {
  const { mcap, liquidity, change24h, loading } = useMadPrice();
  const dump = (change24h ?? 0) < -20;
  const stance = loading && mcap == null ? "—" : dump ? "Dump pressure (24h Dex)" : "Hold (24h Dex)";
  const exit =
    loading && mcap == null
      ? "—"
      : dump
        ? "Size down only if the human confirms. Not a bot exit."
        : "House bag. No hunt. No quote from Book.";

  return (
    <Seat name="Book" badge="House bag $MAD">
      <p className="text-sm leading-relaxed text-ash">
        Book watches $MAD only. No hunt. No quote. No buy button. Dex MC and PumpSwap liq from
        DexScreener. P&amp;L only if we have it — we don&apos;t invent it.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Dex MC" value={loading && mcap == null ? "…" : fmtUsd(mcap)} note="DexScreener · 15s" />
        <Stat label="PumpSwap liq" value={loading && liquidity == null ? "…" : fmtUsd(liquidity)} note="pair liq" />
        <Stat label="Dump vs hold" value={stance} note="24h change, not a signal" />
        <Stat label="P&L" value="—" note="not available" />
      </div>
      <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.25em] text-mad">One-line exit</p>
      <p className="mt-2 text-sm text-ash">{exit}</p>
      <div className="mt-5 flex flex-col items-start gap-3">
        <CaPill />
        <p className="break-all font-mono text-[10px] text-ash/70">{CA}</p>
        <a
          href={LINKS.chart}
          target="_blank"
          rel="noreferrer"
          className="rounded-full border border-white/15 px-5 py-2 text-xs font-bold uppercase tracking-wider text-bone transition-all hover:border-mad/50 hover:text-mad-bright"
        >
          DexScreener
        </a>
      </div>
    </Seat>
  );
}

function Stat({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-black/30 p-4">
      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash">{label}</p>
      <p className="mt-2 font-display text-2xl text-bone">{value}</p>
      <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-ash">{note}</p>
    </div>
  );
}

function Seat({ name, badge, children }: { name: string; badge: string; children: ReactNode }) {
  return (
    <Reveal>
      <section className="rounded-3xl border border-white/8 bg-panel p-6 sm:p-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-display text-3xl uppercase text-bone">{name}</h2>
          <span className="w-fit rounded-full border border-white/15 bg-white/5 px-3 py-0.5 font-mono text-[10px] uppercase tracking-widest text-ash">
            {badge}
          </span>
        </div>
        <div className="mt-4">{children}</div>
      </section>
    </Reveal>
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
      sub="Four seats. Pump Desk leads. Confirm-only. Stay $MAD."
    >
      <Reveal>
        <div className="rounded-3xl border border-mad/30 bg-panel p-6 shadow-glow-sm sm:p-8">
          <span className="inline-block rounded-full border border-mad/40 bg-mad/10 px-3 py-0.5 font-mono text-[10px] uppercase tracking-widest text-mad-bright">
            {GROK_DESK.lead.badge}
          </span>
          <h2 className="mt-3 font-display text-3xl uppercase text-bone sm:text-4xl">{GROK_DESK.lead.name}</h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ash">{GROK_DESK.lead.job}</p>
        </div>
      </Reveal>

      <div className="mt-6 flex flex-col gap-4">
        <TapeSeat />
        <RiskSeat />
        <FillsSeat />
        <BookSeat />
      </div>
    </PageShell>
  );
}
