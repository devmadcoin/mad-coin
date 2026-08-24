import { useEffect, useMemo, useState } from "react";
import DeskFloor from "@/components/DeskFloor";
import PageShell from "@/components/PageShell";
import PhantomConnect from "@/components/PhantomConnect";
import Reveal from "@/components/Reveal";
import { CA } from "@/lib/data";
import {
  MAD_GATE_AMOUNT,
  getMadBalance,
  isMobileUserAgent,
  shortAddr,
} from "@/lib/mad-gate";
import { cn } from "@/lib/utils";

const DCA_KEY = "madrich-dca";

type ToolId = "overview" | "stream" | "tokens" | "wallet" | "scanner" | "dca" | "alerts" | "exits";
type ToolStatus = "GATED" | "LOCAL" | "COMING";

const TOOLS: { id: ToolId; name: string; status: ToolStatus; blurb: string }[] = [
  { id: "overview", name: "Overview", status: "GATED", blurb: "Holder home once unlocked. No fake smart-trade counts." },
  { id: "stream", name: "Live stream", status: "COMING", blurb: "Token tape. Feed is not wired in this app." },
  { id: "tokens", name: "Tokens", status: "COMING", blurb: "Token list. No mock trending board." },
  { id: "wallet", name: "Wallet", status: "GATED", blurb: "Connected Solana portfolio. Balance read only." },
  { id: "scanner", name: "Scanner", status: "COMING", blurb: "Security check (honeypot / can-sell). Not a signal." },
  { id: "dca", name: "DCA", status: "LOCAL", blurb: "Local cost-basis log. Record buys. Not a paper trader." },
  { id: "alerts", name: "Alerts", status: "COMING", blurb: "Price alerts you set. Not wired in this build." },
  { id: "exits", name: "Exits", status: "COMING", blurb: "Exit tape. No fake exit signals." },
];

function statusStyle(s: ToolStatus) {
  if (s === "LOCAL") return "border-yellow-500/40 bg-yellow-500/10 text-yellow-400";
  if (s === "GATED") return "border-mad/30 bg-mad/10 text-mad-bright";
  return "border-white/15 bg-white/5 text-ash";
}

type DcaBuy = { amount: number; price: number; date: string };
type DcaEntry = { id: string; tokenAddress: string; tokenSymbol: string; buys: DcaBuy[] };

function loadDca(): DcaEntry[] {
  try {
    const raw = localStorage.getItem(DCA_KEY);
    if (raw) return JSON.parse(raw) as DcaEntry[];
  } catch {
    /* ignore */
  }
  return [];
}

function DcaTracker({ unlocked }: { unlocked: boolean }) {
  const [entries, setEntries] = useState<DcaEntry[]>(() =>
    typeof window === "undefined" ? [] : loadDca(),
  );
  const [address, setAddress] = useState(CA);
  const [symbol, setSymbol] = useState("$MAD");
  const [spent, setSpent] = useState("");
  const [px, setPx] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [msg, setMsg] = useState("");

  function persist(next: DcaEntry[]) {
    setEntries(next);
    try {
      localStorage.setItem(DCA_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }

  function addBuy() {
    const amount = Number(spent);
    const price = Number(px);
    if (!address.trim() || !Number.isFinite(amount) || amount <= 0 || !Number.isFinite(price) || price <= 0) {
      setMsg("Need contract, $ spent, and price.");
      return;
    }
    const buy: DcaBuy = { amount, price, date };
    const existing = entries.find((e) => e.tokenAddress === address.trim());
    const next = existing
      ? entries.map((e) => (e.id === existing.id ? { ...e, buys: [...e.buys, buy] } : e))
      : [
          ...entries,
          {
            id: String(Date.now()),
            tokenAddress: address.trim(),
            tokenSymbol: symbol.trim() || "unknown",
            buys: [buy],
          },
        ];
    persist(next);
    setSpent("");
    setPx("");
    setMsg("Logged. Local only — not an on-chain order.");
  }

  if (!unlocked) {
    return (
      <p className="text-sm text-ash">
        DCA here is a cost-basis notebook (contract, $ spent, fill price, date). It is not a paper
        trader and it does not place trades. Unlock with 50,000 $MAD to use it.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-ash">
        Cost-basis log stored in this browser. Not a paper trader. Not a buy signal.
      </p>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
        <input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Token CA"
          className="rounded-full border border-white/10 bg-black/40 px-4 py-2.5 font-mono text-xs text-bone outline-none focus:border-mad/60 lg:col-span-2"
        />
        <input
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          placeholder="Symbol"
          className="rounded-full border border-white/10 bg-black/40 px-4 py-2.5 font-mono text-xs text-bone outline-none focus:border-mad/60"
        />
        <input
          type="number"
          value={spent}
          onChange={(e) => setSpent(e.target.value)}
          placeholder="$ spent"
          className="rounded-full border border-white/10 bg-black/40 px-4 py-2.5 font-mono text-xs text-bone outline-none focus:border-mad/60"
        />
        <input
          type="number"
          value={px}
          onChange={(e) => setPx(e.target.value)}
          placeholder="Price"
          className="rounded-full border border-white/10 bg-black/40 px-4 py-2.5 font-mono text-xs text-bone outline-none focus:border-mad/60"
        />
      </div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="rounded-full border border-white/10 bg-black/40 px-4 py-2.5 font-mono text-xs text-bone outline-none [color-scheme:dark] focus:border-mad/60"
        />
        <button
          type="button"
          onClick={addBuy}
          className="rounded-full bg-mad px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white"
        >
          Log buy
        </button>
        {msg && <p className="font-mono text-[11px] text-ash">{msg}</p>}
      </div>
      {entries.length === 0 ? (
        <p className="font-mono text-xs text-ash">No DCA entries yet.</p>
      ) : (
        <ul className="space-y-3">
          {entries.map((e) => {
            const spentUsd = e.buys.reduce((s, b) => s + b.amount, 0);
            const qty = e.buys.reduce((s, b) => s + b.amount / b.price, 0);
            const avg = qty ? spentUsd / qty : 0;
            return (
              <li key={e.id} className="rounded-2xl border border-white/8 bg-black/30 p-4">
                <p className="font-mono text-sm font-bold text-bone">{e.tokenSymbol}</p>
                <p className="mt-1 break-all font-mono text-[10px] text-ash">{e.tokenAddress}</p>
                <p className="mt-2 font-mono text-xs text-ash">
                  {e.buys.length} buy{e.buys.length === 1 ? "" : "s"} · ${spentUsd.toFixed(2)} · avg ${avg.toPrecision(6)}
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function detailCopy(id: ToolId, unlocked: boolean) {
  if (id === "dca") return null;
  if (id === "overview") {
    return unlocked
      ? "You clear the 50,000 $MAD gate. Overview in the live terminal is a holder dashboard. This build does not invent live stream stats."
      : "Behind the gate: a holder dashboard for the eight tools below. Nothing is counted until you unlock.";
  }
  if (id === "wallet") {
    return unlocked
      ? "Wallet is a Solana portfolio view. This build only reads $MAD balance for the gate — no extra portfolio feed."
      : "Shows the connected wallet’s $MAD once you unlock. We only read balance.";
  }
  if (id === "scanner") {
    return "Security scanner (honeypot / blacklist / can-sell). The lookup API is not in this app, so we are not showing mock results.";
  }
  if (id === "stream" || id === "tokens" || id === "exits" || id === "alerts") {
    return "Not wired here. We will not print a fake tape or exit signals.";
  }
  return "";
}

export default function Tools() {
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState(0);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [open, setOpen] = useState<ToolId>("overview");

  const unlocked = !!address && balance >= MAD_GATE_AMOUNT;
  const mobile = useMemo(() => isMobileUserAgent(), []);
  const active = TOOLS.find((t) => t.id === open)!;

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

  async function connect(opts?: { onlyIfTrusted?: boolean }) {
    setError("");
    if (!opts?.onlyIfTrusted) setStatus("");
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
      const res = await provider.connect(opts);
      const addr = res.publicKey.toString();
      setAddress(addr);
      setStatus(`Wallet connected: ${shortAddr(addr)}`);
      await readBalance(addr);
    } catch {
      if (!opts?.onlyIfTrusted) {
        setError("Wallet connection cancelled or failed.");
      }
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

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const provider = window.solana;
      if (!provider?.connect) return;
      try {
        const res = await provider.connect({ onlyIfTrusted: true });
        if (cancelled) return;
        const addr = res.publicKey.toString();
        setAddress(addr);
        setStatus(`Wallet connected: ${shortAddr(addr)}`);
        await readBalance(addr);
      } catch {
        /* origin not yet trusted — wait for an explicit Connect click */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <PageShell
      eyebrow="Solana · 50,000 $MAD"
      title={
        <>
          $MAD <span className="text-mad">Tools</span>
        </>
      }
      sub="Holder tools on Solana. Hold 50,000 $MAD to unlock. We only read balance."
      top={<DeskFloor />}
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

      <p className="mt-10 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-ash">
        Behind the gate
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {TOOLS.map((tool) => {
          const on = open === tool.id;
          return (
            <button
              key={tool.id}
              type="button"
              onClick={() => setOpen(tool.id)}
              className={cn(
                "flex h-full flex-col rounded-3xl border bg-panel p-5 text-left transition-all duration-300",
                on ? "border-mad/50 shadow-glow-sm" : "border-white/8 hover:border-mad/35",
              )}
            >
              <span className={cn("w-fit rounded-full border px-3 py-0.5 font-mono text-[10px] uppercase tracking-widest", statusStyle(tool.status))}>
                {tool.status}
              </span>
              <h3 className="mt-3 font-display text-xl uppercase text-bone">{tool.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ash">{tool.blurb}</p>
            </button>
          );
        })}
      </div>

      <Reveal delay={0.08} className="mt-6">
        <div className="rounded-3xl border border-white/8 bg-panel p-6 sm:p-8">
          <div className="mb-4 flex items-center gap-3">
            <h3 className="font-display text-2xl uppercase text-bone">{active.name}</h3>
            <span className={cn("rounded-full border px-3 py-0.5 font-mono text-[10px] uppercase tracking-widest", statusStyle(active.status))}>
              {active.status}
            </span>
          </div>
          {open === "dca" ? (
            <DcaTracker unlocked={unlocked} />
          ) : (
            <p className="text-sm leading-relaxed text-ash">{detailCopy(open, unlocked)}</p>
          )}
        </div>
      </Reveal>

      <p className="mx-auto mt-10 max-w-2xl text-center text-xs leading-relaxed text-ash">
        <span className="font-semibold text-bone">Not financial advice. DYOR.</span> These are holder
        tools, not trade signals. DCA is a local cost-basis log — not a paper trader, not a forecast,
        not a promise of profit.
      </p>
    </PageShell>
  );
}
