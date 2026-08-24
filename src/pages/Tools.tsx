import { useEffect, useMemo, useState } from "react";
import PageShell from "@/components/PageShell";
import Reveal from "@/components/Reveal";
import CaPill from "@/components/CaPill";
import { CA, LINKS } from "@/lib/data";
import {
  MAD_GATE_AMOUNT,
  formatMad,
  getMadBalance,
  isMobileUserAgent,
  shortAddr,
} from "@/lib/mad-gate";
import { fmtPrice, fmtUsd, useMadPrice } from "@/hooks/useMadPrice";
import { cn } from "@/lib/utils";

const PAPER_STARTING_CASH = 10_000;
const PAPER_KEY = "mad-paper-trader-v1";

type ToolStatus = "LIVE" | "PAPER" | "COMING";

const TOOLS: {
  id: "paper" | "scanner" | "stats";
  icon: string;
  name: string;
  status: ToolStatus;
  blurb: string;
}[] = [
  {
    id: "paper",
    icon: "📝",
    name: "Paper Trader",
    status: "PAPER",
    blurb: "Fake USD vs live $MAD price. Practice size and timing. No on-chain trades.",
  },
  {
    id: "scanner",
    icon: "📡",
    name: "Scanner",
    status: "COMING",
    blurb: "Solana wallet lookup for $MAD. Not a signal feed. Not wired in this app yet.",
  },
  {
    id: "stats",
    icon: "📊",
    name: "Stats",
    status: "LIVE",
    blurb: "Public DexScreener quotes for $MAD on Solana: price, mcap, volume, liquidity.",
  },
];

function statusStyle(s: ToolStatus) {
  if (s === "LIVE") return "border-green-500/40 bg-green-500/10 text-green-400";
  if (s === "PAPER") return "border-yellow-500/40 bg-yellow-500/10 text-yellow-400";
  return "border-white/15 bg-white/5 text-ash";
}

type PaperState = {
  cash: number;
  mad: number;
  trades: { t: string; side: "buy" | "sell"; usd: number; qty: number; price: number }[];
};

function loadPaper(): PaperState {
  try {
    const raw = localStorage.getItem(PAPER_KEY);
    if (raw) return JSON.parse(raw) as PaperState;
  } catch {
    /* ignore */
  }
  return { cash: PAPER_STARTING_CASH, mad: 0, trades: [] };
}

function PhantomConnect({
  address,
  balance,
  checking,
  unlocked,
  error,
  status,
  onConnect,
  onDisconnect,
  onSwitch,
}: {
  address: string | null;
  balance: number;
  checking: boolean;
  unlocked: boolean;
  error: string;
  status: string;
  onConnect: () => void;
  onDisconnect: () => void;
  onSwitch: () => void;
}) {
  const mobile = isMobileUserAgent();
  const need = Math.max(0, MAD_GATE_AMOUNT - balance);
  const pct = Math.min(100, (balance / MAD_GATE_AMOUNT) * 100);

  return (
    <div className="overflow-hidden rounded-3xl border border-white/8 bg-panel">
      <div className="border-b border-white/8 bg-black/40 px-6 py-5 text-center sm:px-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-mad">Solana only · Phantom</p>
        <h2 className="mt-2 font-display text-2xl uppercase text-bone sm:text-3xl">
          Hold {MAD_GATE_AMOUNT.toLocaleString()} $MAD to unlock. We only read balance.
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-ash">
          $MAD lives on Solana. Connect Phantom — no transaction, no signature, no spend.
        </p>
        <div className="mt-4 flex justify-center">
          <CaPill />
        </div>
      </div>

      <div className="px-6 py-6 sm:px-8">
        {!address ? (
          <div className="flex flex-col items-center gap-4 text-center">
            {mobile && (
              <p className="max-w-md text-sm text-ash">
                On mobile, open the <span className="text-bone">Phantom app</span>, tap the globe for
                the in-app browser, and go to this page. Then connect.
              </p>
            )}
            <button
              onClick={onConnect}
              disabled={checking}
              className="rounded-full bg-mad px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-white shadow-glow-sm transition-all hover:scale-105 hover:shadow-glow disabled:cursor-not-allowed disabled:opacity-60"
            >
              {checking ? "Checking balance…" : "Connect wallet"}
            </button>
            {error && <p className="font-mono text-xs text-mad-bright">{error}</p>}
            {status && !error && <p className="font-mono text-xs text-ash">{status}</p>}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 text-center">
            <p className="font-mono text-xs text-ash">
              Connected{" "}
              <span className="text-green-400">{shortAddr(address)}</span>
            </p>
            <p className="font-display text-3xl text-bone">
              {checking ? "…" : formatMad(balance)}{" "}
              <span className="text-lg text-ash">$MAD</span>
            </p>
            {!unlocked && (
              <>
                <div className="h-2 w-full max-w-sm overflow-hidden rounded-full bg-black/50">
                  <div
                    className="h-full rounded-full bg-mad transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <p className="text-sm text-ash">
                  {balance === 0
                    ? "No $MAD in this wallet."
                    : `Need ${need.toLocaleString()} more to unlock.`}
                </p>
              </>
            )}
            {unlocked && (
              <p className="rounded-full border border-green-500/40 bg-green-500/10 px-4 py-1.5 font-mono text-[10px] uppercase tracking-widest text-green-400">
                Unlocked
              </p>
            )}
            {error && <p className="font-mono text-xs text-mad-bright">{error}</p>}
            <div className="flex flex-wrap justify-center gap-2">
              <button
                onClick={onSwitch}
                className="rounded-full border border-white/15 px-5 py-2 text-xs font-bold uppercase tracking-wider text-bone transition hover:border-mad/50"
              >
                Switch wallet
              </button>
              <button
                onClick={onDisconnect}
                className="rounded-full border border-white/10 px-5 py-2 text-xs font-bold uppercase tracking-wider text-ash transition hover:text-bone"
              >
                Disconnect
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function PaperDesk({ unlocked, price }: { unlocked: boolean; price: number | null }) {
  const [state, setState] = useState<PaperState>(() =>
    typeof window === "undefined" ? { cash: PAPER_STARTING_CASH, mad: 0, trades: [] } : loadPaper(),
  );
  const [usd, setUsd] = useState("100");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    try {
      localStorage.setItem(PAPER_KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state]);

  const posValue = price ? state.mad * price : 0;
  const equity = state.cash + posValue;
  const pnl = equity - PAPER_STARTING_CASH;

  function trade(side: "buy" | "sell") {
    if (!unlocked || !price || price <= 0) return;
    const amount = Number(usd);
    if (!Number.isFinite(amount) || amount <= 0) {
      setMsg("Enter a USD amount.");
      return;
    }
    if (side === "buy") {
      if (amount > state.cash + 1e-9) {
        setMsg("Not enough paper cash.");
        return;
      }
      const qty = amount / price;
      setState((s) => ({
        cash: s.cash - amount,
        mad: s.mad + qty,
        trades: [{ t: new Date().toISOString(), side, usd: amount, qty, price }, ...s.trades].slice(0, 20),
      }));
      setMsg(`Paper buy ${qty.toFixed(2)} $MAD`);
    } else {
      const qty = amount / price;
      if (qty > state.mad + 1e-9) {
        setMsg("Not enough paper $MAD.");
        return;
      }
      setState((s) => ({
        cash: s.cash + amount,
        mad: s.mad - qty,
        trades: [{ t: new Date().toISOString(), side, usd: amount, qty, price }, ...s.trades].slice(0, 20),
      }));
      setMsg(`Paper sell ${qty.toFixed(2)} $MAD`);
    }
  }

  function reset() {
    setState({ cash: PAPER_STARTING_CASH, mad: 0, trades: [] });
    setMsg("Paper book reset.");
  }

  if (!unlocked) {
    return (
      <p className="text-sm text-ash">
        Starting book: ${PAPER_STARTING_CASH.toLocaleString()} fake USD. Fills at the live $MAD
        DexScreener price. Unlock to trade paper.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { l: "Cash", v: `$${state.cash.toFixed(2)}` },
          { l: "$MAD", v: state.mad.toFixed(2) },
          { l: "Position", v: fmtUsd(posValue) },
          { l: "Paper P&L", v: `${pnl >= 0 ? "+" : ""}$${pnl.toFixed(2)}` },
        ].map((s) => (
          <div key={s.l} className="rounded-2xl border border-white/8 bg-black/30 p-3 text-center">
            <p className="font-mono text-[10px] uppercase tracking-widest text-ash">{s.l}</p>
            <p className="mt-1 font-mono text-sm font-bold text-bone">{s.v}</p>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          type="number"
          min={0}
          value={usd}
          onChange={(e) => setUsd(e.target.value)}
          className="flex-1 rounded-full border border-white/10 bg-black/40 px-5 py-3 font-mono text-sm text-bone outline-none focus:border-mad/60"
          placeholder="USD amount"
        />
        <button
          onClick={() => trade("buy")}
          disabled={!price}
          className="rounded-full bg-mad px-6 py-3 text-sm font-bold uppercase tracking-wider text-white disabled:opacity-50"
        >
          Paper buy
        </button>
        <button
          onClick={() => trade("sell")}
          disabled={!price}
          className="rounded-full border border-white/15 px-6 py-3 text-sm font-bold uppercase tracking-wider text-bone disabled:opacity-50"
        >
          Paper sell
        </button>
      </div>
      <div className="flex items-center justify-between gap-3">
        <p className="font-mono text-[11px] text-ash">{msg || `Mark ${fmtPrice(price)} · paper only`}</p>
        <button onClick={reset} className="font-mono text-[10px] uppercase tracking-widest text-ash hover:text-bone">
          Reset book
        </button>
      </div>
      {state.trades.length > 0 && (
        <ul className="space-y-1 font-mono text-[11px] text-ash">
          {state.trades.slice(0, 5).map((t, i) => (
            <li key={`${t.t}-${i}`}>
              {t.side.toUpperCase()} ${t.usd.toFixed(2)} → {t.qty.toFixed(2)} $MAD @ {fmtPrice(t.price)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function Tools() {
  const { price, mcap, volume24h, liquidity, change24h, loading } = useMadPrice();
  const up = (change24h ?? 0) >= 0;
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState(0);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [open, setOpen] = useState<"paper" | "scanner" | "stats" | null>("stats");

  const unlocked = !!address && balance >= MAD_GATE_AMOUNT;
  const mobile = useMemo(() => isMobileUserAgent(), []);

  async function readBalance(addr: string) {
    setChecking(true);
    setError("");
    try {
      const n = await getMadBalance(addr);
      setBalance(n);
      setStatus(`$MAD balance: ${n.toLocaleString()}`);
    } catch (err) {
      setBalance(0);
      setError(err instanceof Error ? err.message : "Balance check failed. Try again.");
    } finally {
      setChecking(false);
    }
  }

  async function connect() {
    setError("");
    setStatus("");
    const provider = window.solana;
    if (!provider) {
      if (mobile) {
        const app = encodeURIComponent(window.location.href);
        const origin = encodeURIComponent(window.location.origin);
        window.location.href = `https://phantom.app/ul/v1/connect?app_url=${origin}&redirect_link=${app}&cluster=mainnet-beta`;
        return;
      }
      setError("Phantom not found. Install Phantom, then connect.");
      return;
    }
    try {
      const res = await provider.connect();
      const addr = res.publicKey.toString();
      setAddress(addr);
      setStatus(`Wallet connected: ${shortAddr(addr)}`);
      await readBalance(addr);
    } catch {
      setError("Wallet connection cancelled or failed.");
    }
  }

  async function disconnect() {
    try {
      await window.solana?.disconnect?.();
    } catch {
      /* ignore */
    }
    setAddress(null);
    setBalance(0);
    setStatus("Wallet disconnected.");
    setError("");
  }

  async function switchWallet() {
    try {
      await window.solana?.disconnect?.();
    } catch {
      /* ignore */
    }
    setAddress(null);
    setBalance(0);
    setTimeout(() => {
      void connect();
    }, 300);
  }

  return (
    <PageShell
      eyebrow="Open tools · Solana"
      title={
        <>
          $MAD <span className="text-mad">Tools</span>
        </>
      }
      sub="Paper Trader, Scanner, and Stats. Holder-gated at 50,000 $MAD. Public stats preview below — connect only to unlock paper trading."
    >
      <Reveal>
        <PhantomConnect
          address={address}
          balance={balance}
          checking={checking}
          unlocked={unlocked}
          error={error}
          status={status}
          onConnect={() => void connect()}
          onDisconnect={() => void disconnect()}
          onSwitch={() => void switchWallet()}
        />
      </Reveal>

      <div className="mt-10 grid gap-4 lg:grid-cols-3">
        {TOOLS.map((tool, i) => {
          const active = open === tool.id;
          return (
            <Reveal key={tool.id} delay={i * 0.06}>
              <button
                type="button"
                onClick={() => setOpen(tool.id)}
                className={cn(
                  "flex h-full w-full flex-col rounded-3xl border bg-panel p-6 text-left transition-all duration-300",
                  active ? "border-mad/50 shadow-glow-sm" : "border-white/8 hover:border-mad/35",
                )}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-2xl">{tool.icon}</span>
                  <span className={cn("rounded-full border px-3 py-0.5 font-mono text-[10px] uppercase tracking-widest", statusStyle(tool.status))}>
                    {tool.status}
                  </span>
                </div>
                <h3 className="mt-4 font-display text-2xl uppercase text-bone">{tool.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ash">{tool.blurb}</p>
                {tool.id === "stats" && (
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    {[
                      { l: "Price", v: loading ? "…" : fmtPrice(price) },
                      { l: "Mcap", v: loading ? "…" : fmtUsd(mcap) },
                      { l: "Vol 24h", v: loading ? "…" : fmtUsd(volume24h) },
                      { l: "Liq", v: loading ? "…" : fmtUsd(liquidity) },
                    ].map((s) => (
                      <div key={s.l} className="rounded-xl border border-white/8 bg-black/30 px-3 py-2">
                        <p className="font-mono text-[9px] uppercase tracking-widest text-ash">{s.l}</p>
                        <p className="font-mono text-xs font-bold text-bone">{s.v}</p>
                      </div>
                    ))}
                  </div>
                )}
              </button>
            </Reveal>
          );
        })}
      </div>

      <Reveal delay={0.12} className="mt-6">
        <div className="rounded-3xl border border-white/8 bg-panel p-6 sm:p-8">
          {open === "paper" && (
            <>
              <div className="mb-4 flex items-center gap-3">
                <h3 className="font-display text-2xl uppercase text-bone">Paper Trader</h3>
                <span className={cn("rounded-full border px-3 py-0.5 font-mono text-[10px] uppercase tracking-widest", statusStyle("PAPER"))}>
                  Paper
                </span>
              </div>
              <PaperDesk unlocked={unlocked} price={price} />
            </>
          )}
          {open === "scanner" && (
            <>
              <div className="mb-4 flex items-center gap-3">
                <h3 className="font-display text-2xl uppercase text-bone">Scanner</h3>
                <span className={cn("rounded-full border px-3 py-0.5 font-mono text-[10px] uppercase tracking-widest", statusStyle("COMING"))}>
                  Coming
                </span>
              </div>
              <p className="text-sm leading-relaxed text-ash">
                Not live yet. A Solana wallet lookup for $MAD is sketched in the repo but unfinished.
                We are not showing mock scans, whale tags, or trade signals.
              </p>
            </>
          )}
          {open === "stats" && (
            <>
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <h3 className="font-display text-2xl uppercase text-bone">Stats</h3>
                  <span className={cn("rounded-full border px-3 py-0.5 font-mono text-[10px] uppercase tracking-widest", statusStyle("LIVE"))}>
                    Live
                  </span>
                </div>
                {change24h != null && (
                  <span className={cn("font-mono text-sm", up ? "text-green-400" : "text-mad-bright")}>
                    {up ? "▲" : "▼"} {Math.abs(change24h).toFixed(2)}%
                  </span>
                )}
              </div>
              <div className="grid gap-3 sm:grid-cols-4">
                {[
                  { l: "Price", v: fmtPrice(price) },
                  { l: "Market cap", v: fmtUsd(mcap) },
                  { l: "24h volume", v: fmtUsd(volume24h) },
                  { l: "Liquidity", v: fmtUsd(liquidity) },
                ].map((s) => (
                  <div key={s.l} className="rounded-2xl border border-white/8 bg-black/30 p-4">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-ash">{s.l}</p>
                    <p className="mt-2 font-mono text-lg font-bold text-bone">{s.v}</p>
                  </div>
                ))}
              </div>
              <p className="mt-4 font-mono text-[11px] text-ash">
                Pair on Solana · updates every 15s from DexScreener · CA {CA.slice(0, 6)}…{CA.slice(-5)}
              </p>
              <a
                href={LINKS.chart}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex rounded-full border border-white/15 px-5 py-2 text-xs font-bold uppercase tracking-wider text-bone transition hover:border-mad/50 hover:text-mad-bright"
              >
                Open DexScreener →
              </a>
            </>
          )}
        </div>
      </Reveal>

      <p className="mx-auto mt-10 max-w-2xl text-center text-xs leading-relaxed text-ash">
        <span className="font-semibold text-bone">Not financial advice. DYOR.</span> Paper Trader uses
        fake money. Stats are public market quotes, not a forecast. Nothing on this page is a trade
        signal or a promise of profit.
      </p>
    </PageShell>
  );
}
