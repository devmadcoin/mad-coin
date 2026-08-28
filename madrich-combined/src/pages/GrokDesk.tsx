import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Link } from "react-router";
import { CA, LINKS, PAIR } from "@/lib/data";
import { GROK_DESK, PAGE_LINKS } from "@/lib/pages-data";
import "./grok-desk.css";

const MAD_MINT = CA;
const DEX_PAIR = PAIR;
const DEX_URL = LINKS.chart;
const DEX_EMBED = `${DEX_URL}?embed=1&loadChartSettings=0&trades=0&tabs=0&info=0&chartLeftToolbar=0&chartTheme=dark&theme=dark&chartStyle=1&chartType=usd&interval=15`;
const TAPE_URL = "/api/pump-tape";
const DEX_API = `https://api.dexscreener.com/latest/dex/pairs/solana/${DEX_PAIR}`;
const QUOTE_SOL = GROK_DESK.quoteSol;
const SLIP_PCT = GROK_DESK.slipPct;

type SeatId = "pump" | "tape" | "risk" | "fills" | "book";
type Stamp = "PASS" | "WATCH" | "KILL";

type Print = {
  ticker: string;
  mint: string;
  url: string;
  mc: string;
  solIn: string;
  curve: string;
  age: string;
  live: boolean;
  why: string;
  stamp: Stamp;
  stampWhy: string;
};

type TapePayload = {
  ok: boolean;
  status: string;
  deskSol: number;
  openClips: number;
  prints: Print[];
};

type FeedLine = {
  id: number;
  ts: string;
  who: SeatId;
  name: string;
  color: string;
  text: string;
};

type Pt = { x: number; y: number };

type Agent = {
  id: SeatId;
  name: string;
  color: string;
  row: number;
  x: number;
  y: number;
  dir: number;
  frame: number;
  bob: boolean;
  state: string;
  speech: string;
  speechUntil: number;
  path: Pt[];
  onDone: (() => void) | null;
};

const META: Record<SeatId, { name: string; color: string; row: number; tag: string }> = {
  pump: { name: "PUMP DESK", color: "#f87171", row: 0, tag: "LEAD" },
  tape: { name: "TAPE", color: "#67e8f9", row: 1, tag: "SEAT" },
  risk: { name: "RISK", color: "#facc15", row: 2, tag: "SEAT" },
  fills: { name: "FILLS", color: "#a78bfa", row: 3, tag: "SEAT" },
  book: { name: "BOOK", color: "#4ade80", row: 4, tag: "SEAT" },
};

const DESK: Record<SeatId, Pt> = {
  pump: { x: 44, y: 47 },
  tape: { x: 24.5, y: 44 },
  fills: { x: 70.5, y: 44 },
  risk: { x: 26, y: 71 },
  book: { x: 71.5, y: 71 },
};

const MARK = {
  boardLeft: { x: 36, y: 51 },
  boardRight: { x: 52, y: 51 },
  tapeStand: { x: 29, y: 48 },
  chart: { x: 57, y: 31 },
};

const GLOW: Record<SeatId, Pt> = {
  pump: { x: 44, y: 50 },
  tape: { x: 22, y: 38 },
  fills: { x: 73, y: 38 },
  risk: { x: 24, y: 65 },
  book: { x: 74, y: 65 },
};

const HOTS: { id: SeatId; label: string; left: string; top: string; w: string; h: string }[] = [
  { id: "pump", label: "PUMP DESK", left: "36%", top: "38%", w: "16%", h: "16%" },
  { id: "tape", label: "TAPE", left: "16%", top: "36%", w: "16%", h: "16%" },
  { id: "fills", label: "FILLS", left: "62%", top: "36%", w: "16%", h: "16%" },
  { id: "risk", label: "RISK", left: "18%", top: "62%", w: "16%", h: "16%" },
  { id: "book", label: "BOOK", left: "63%", top: "62%", w: "16%", h: "16%" },
];

const SEATS: SeatId[] = ["pump", "tape", "risk", "fills", "book"];
const seenMints = new Set<string>();
let tapeSeeded = false;
let unreachableNoted = false;

function fmtUsd(n: number | null) {
  if (n == null || !Number.isFinite(n)) return "—";
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(2)}K`;
  return `$${n.toFixed(2)}`;
}

function fmtPx(n: number | null) {
  if (n == null || !Number.isFinite(n)) return "—";
  if (n >= 1) return `$${n.toFixed(4)}`;
  if (n >= 0.01) return `$${n.toFixed(6)}`;
  return `$${n.toFixed(8)}`;
}

function face(id: SeatId) {
  return id === "tape" || id === "risk" ? -1 : 1;
}

function clockNow() {
  return new Date().toLocaleTimeString("en-US", {
    timeZone: "America/Los_Angeles",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function buildAgents(): Record<SeatId, Agent> {
  const out = {} as Record<SeatId, Agent>;
  for (const id of SEATS) {
    const meta = META[id];
    const desk = DESK[id];
    out[id] = {
      id,
      name: meta.name,
      color: meta.color,
      row: meta.row,
      x: desk.x,
      y: desk.y,
      dir: face(id),
      frame: 0,
      bob: false,
      state: id === "pump" ? "at the board" : "at desk",
      speech: "",
      speechUntil: 0,
      path: [],
      onDone: null,
    };
  }
  return out;
}

function densify(from: Pt, waypoints: Pt[]) {
  const steps: Pt[] = [];
  let cur = { ...from };
  for (const wp of waypoints) {
    const dx = wp.x >= cur.x ? 3.2 : -3.2;
    while (Math.abs(wp.x - cur.x) >= 1.76) {
      cur = { x: cur.x + dx, y: cur.y };
      steps.push({ ...cur });
    }
    cur = { x: wp.x, y: cur.y };
    const dy = wp.y >= cur.y ? 3.2 : -3.2;
    while (Math.abs(wp.y - cur.y) >= 1.76) {
      cur = { x: cur.x, y: cur.y + dy };
      steps.push({ ...cur });
    }
    cur = { x: wp.x, y: wp.y };
    steps.push({ ...cur });
  }
  const thin: Pt[] = [];
  for (const p of steps) {
    const last = thin[thin.length - 1];
    if (!last || Math.abs(last.x - p.x) + Math.abs(last.y - p.y) > 0.35) thin.push(p);
  }
  if (thin.length > 18) {
    const out: Pt[] = [];
    const step = (thin.length - 1) / 16;
    for (let i = 0; i < 16; i++) out.push(thin[Math.round(i * step)]);
    out.push(thin[thin.length - 1]);
    return out;
  }
  return thin;
}

function routeTo(from: Pt, to: Pt) {
  const via: Pt[] = [];
  if (Math.abs(from.y - to.y) > 10 || (from.y < 52 && to.y < 52 && Math.abs(from.x - to.x) > 12)) {
    via.push({ x: from.x, y: 58 }, { x: to.x, y: 58 });
  }
  via.push(to);
  return densify(from, via);
}

export default function GrokDesk() {
  const [prints, setPrints] = useState<Print[]>([]);
  const [tapeStatus, setTapeStatus] = useState("Waiting for live prints…");
  const [mcap, setMcap] = useState<number | null>(null);
  const [liq, setLiq] = useState<number | null>(null);
  const [chg, setChg] = useState<number | null>(null);
  const [px, setPx] = useState<number | null>(null);
  const [dexLoading, setDexLoading] = useState(true);
  const [focus, setFocus] = useState<SeatId>("pump");
  const [clock, setClock] = useState("");
  const [feed, setFeed] = useState<FeedLine[]>([]);
  const [, tick] = useState(0);
  const [deskSol, setDeskSol] = useState(0);
  const [openClips, setOpenClips] = useState(0);
  const [lastGate, setLastGate] = useState<{ stamp: Stamp; why: string; ticker: string } | null>(null);
  const [padLine, setPadLine] = useState("DARK");

  const agents = useRef(buildAgents());
  const seq = useRef(0);
  const mcapRef = useRef<number | null>(null);
  const stanceRef = useRef("—");
  const lastMc = useRef<number | null>(null);
  const jobs = useRef({ q: [] as Print[], busy: false, riskOut: false, fillsOut: false });
  const deskSolRef = useRef(0);
  const bump = () => tick((n) => n + 1);

  const pushFeed = (who: SeatId, text: string) => {
    const meta = META[who];
    const line: FeedLine = {
      id: ++seq.current,
      ts: clockNow(),
      who,
      name: meta.name,
      color: meta.color,
      text,
    };
    setFeed((prev) => [line, ...prev].slice(0, 20));
  };

  const say = (agent: Agent, state: string, speech: string, feedText: string) => {
    agent.state = state;
    agent.speech = speech;
    agent.speechUntil = speech ? Date.now() + 2800 : 0;
    pushFeed(agent.id, feedText);
    bump();
  };

  const walk = (agent: Agent, dest: Pt, onDone: () => void) => {
    agent.path = routeTo({ x: agent.x, y: agent.y }, dest);
    agent.onDone = onDone;
    if (!agent.path.length) onDone();
  };

  const maybeNext = () => {
    const j = jobs.current;
    if (!j.riskOut && !j.fillsOut) {
      j.busy = false;
      runQueue();
    }
  };

  const runFills = (print: Print) => {
    const fills = agents.current.fills;
    const j = jobs.current;
    j.fillsOut = true;
    const canQuote = deskSolRef.current >= QUOTE_SOL;
    const speech = canQuote
      ? `quote ${QUOTE_SOL} SOL · ${SLIP_PCT}% slip UNSIGNED`
      : "pad dark — desk SOL under 0.05";
    const feedText = canQuote
      ? `${speech} · $${print.ticker}`
      : `${speech} · $${print.ticker} — no fill invented`;
    setPadLine(canQuote ? "UNSIGNED" : "DARK");
    say(fills, "handing off", speech, feedText);
    walk(fills, MARK.boardRight, () => {
      say(
        fills,
        "handing off",
        speech,
        canQuote ? `waiting on human greenlight · $${print.ticker}` : `pad stays dark · $${print.ticker}`,
      );
      window.setTimeout(() => {
        say(fills, "walking", "", "back to desk");
        walk(fills, DESK.fills, () => {
          fills.dir = face("fills");
          say(fills, "at desk", "", "at desk");
          j.fillsOut = false;
          maybeNext();
        });
      }, 1800);
    });
  };

  const runRisk = (print: Print) => {
    const risk = agents.current.risk;
    const stamp = print.stamp || "KILL";
    const why = print.stampWhy || "unverifiable";
    const j = jobs.current;
    j.riskOut = true;
    setLastGate({ stamp, why, ticker: print.ticker });
    say(risk, "handing off", stamp, `handing off · ${stamp} $${print.ticker}`);
    walk(risk, MARK.tapeStand, () => {
      say(risk, "handing off", stamp, `${stamp} $${print.ticker} — ${why}`);
      if (stamp === "PASS") runFills(print);
      window.setTimeout(() => {
        say(risk, "walking", stamp, "back to desk");
        walk(risk, DESK.risk, () => {
          risk.dir = face("risk");
          say(risk, "at desk", "", "at desk");
          j.riskOut = false;
          maybeNext();
        });
      }, 1600);
    });
  };

  const runTape = (print: Print) => {
    const a = agents.current;
    const tape = a.tape;
    const pump = a.pump;
    say(tape, "walking", `print $${print.ticker}`, `print $${print.ticker}  MC ${print.mc}  curve ${print.curve}`);
    pump.dir = pump.dir === 1 ? -1 : 1;
    say(pump, "at the board", "confirm-only", "confirm-only · no trade");
    walk(tape, MARK.boardLeft, () => {
      say(tape, "at the board", `print $${print.ticker}`, `at the board · $${print.ticker}`);
      runRisk(print);
      window.setTimeout(() => {
        say(tape, "walking", "", "back to desk");
        walk(tape, DESK.tape, () => {
          tape.dir = face("tape");
          say(tape, "at desk", "", "at desk");
        });
      }, 1400);
    });
  };

  const runQueue = () => {
    const j = jobs.current;
    if (j.busy || !j.q.length) return;
    const next = j.q.shift();
    if (next) {
      j.busy = true;
      runTape(next);
    }
  };

  const enqueue = (print: Print) => {
    jobs.current.q.push(print);
    runQueue();
  };

  const walkBook = () => {
    const book = agents.current.book;
    if (book.path.length) return;
    const mc = fmtUsd(mcapRef.current);
    const dump = typeof stanceRef.current === "string" && stanceRef.current.startsWith("Dump");
    const line = dump ? `MC ${mc} · Dump` : `MC ${mc} · Hold`;
    say(book, "walking", line, line);
    walk(book, MARK.chart, () => {
      say(book, "idle", line, "at wall chart");
      window.setTimeout(() => {
        say(book, "walking", line, "back to desk");
        walk(book, DESK.book, () => {
          book.dir = face("book");
          say(book, "at desk", dump ? "Dump" : "Hold", "at desk");
        });
      }, 1200);
    });
  };

  useEffect(() => {
    const id = window.setInterval(() => {
      const now = Date.now();
      let dirty = false;
      for (const seat of SEATS) {
        const a = agents.current[seat];
        if (a.speech && a.speechUntil && a.speechUntil < now) {
          a.speech = "";
          dirty = true;
        }
        if (!a.path.length) {
          if (a.state === "idle" || a.state === "at the board") {
            a.bob = !a.bob;
            dirty = true;
          }
          continue;
        }
        const step = a.path.shift();
        if (step) {
          if (step.x > a.x + 0.2) a.dir = 1;
          else if (step.x < a.x - 0.2) a.dir = -1;
          a.x = step.x;
          a.y = step.y;
          a.frame = a.frame === 1 ? 2 : 1;
          a.bob = !a.bob;
          dirty = true;
          if (!a.path.length) {
            a.frame = 0;
            if (a.state !== "idle" && a.state !== "at the board") a.bob = false;
            const done = a.onDone;
            a.onDone = null;
            done?.();
          }
        }
      }
      if (dirty) bump();
    }, 340);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function loadTape() {
      try {
        const res = await fetch(TAPE_URL);
        if (!res.ok) throw new Error("tape feed down");
        const data = (await res.json()) as TapePayload;
        if (cancelled) return;
        const next = Array.isArray(data.prints) ? data.prints : [];
        setPrints(next.slice(0, 6));
        const sol = Number.isFinite(data.deskSol) ? data.deskSol : 0;
        deskSolRef.current = sol;
        setDeskSol(sol);
        setOpenClips(Number.isFinite(data.openClips) ? data.openClips : 0);
        setTapeStatus(
          data.status ||
            (next.length ? "Live Pump.fun prints. $MAD is not a hunt." : "No prints."),
        );
        if (!data.ok && !next.length) {
          setTapeStatus(data.status || "Tape feed unreachable. No seeded prints.");
        }
      } catch {
        if (!cancelled) {
          setPrints([]);
          setTapeStatus("Tape feed unreachable. No seeded prints.");
        }
      }
    }
    async function loadDex() {
      try {
        const res = await fetch(DEX_API);
        const data = await res.json();
        const pair = data.pairs?.[0];
        if (pair && !cancelled) {
          const fdv = parseFloat(pair.fdv);
          const liqUsd = parseFloat(pair.liquidity?.usd);
          const chg24 = parseFloat(pair.priceChange?.h24);
          const price = parseFloat(pair.priceUsd);
          setMcap(Number.isFinite(fdv) ? fdv : null);
          setLiq(Number.isFinite(liqUsd) ? liqUsd : null);
          setChg(Number.isFinite(chg24) ? chg24 : null);
          setPx(Number.isFinite(price) ? price : null);
        }
      } catch {
        /* Dex missing stays not available — never invent */
      } finally {
        if (!cancelled) setDexLoading(false);
      }
    }
    loadTape();
    loadDex();
    const tapeId = setInterval(loadTape, 20000);
    const dexId = setInterval(loadDex, 15000);
    return () => {
      cancelled = true;
      clearInterval(tapeId);
      clearInterval(dexId);
    };
  }, []);

  useEffect(() => {
    const tickClock = () => setClock(`${clockNow()} PT`);
    tickClock();
    const id = setInterval(tickClock, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!prints.length) return;
    if (!tapeSeeded) {
      tapeSeeded = true;
      prints.forEach((p) => seenMints.add(p.mint));
      enqueue(prints[0]);
      return;
    }
    for (const p of prints) {
      if (!seenMints.has(p.mint)) {
        seenMints.add(p.mint);
        enqueue(p);
      }
    }
  }, [prints]);

  useEffect(() => {
    if (tapeStatus.startsWith("Tape feed unreachable") && !unreachableNoted) {
      unreachableNoted = true;
      pushFeed("tape", "Tape feed unreachable. No seeded prints.");
    }
  }, [tapeStatus]);

  useEffect(() => {
    mcapRef.current = mcap;
  }, [mcap]);

  const dump = (chg ?? 0) < -20;
  const stance = dexLoading && mcap == null ? "—" : dump ? "Dump pressure (24h Dex)" : "Hold (24h Dex)";
  stanceRef.current = stance;
  const exit =
    dexLoading && mcap == null
      ? "—"
      : dump
        ? "Size down only if the human confirms. Not a bot exit."
        : "House bag. No hunt. No quote from Book.";

  useEffect(() => {
    if (mcap == null) return;
    const prev = lastMc.current;
    if (prev != null && Math.abs(mcap - prev) < 1) return;
    lastMc.current = mcap;
    const id = window.setTimeout(() => walkBook(), prev == null ? 900 : 200);
    return () => window.clearTimeout(id);
  }, [mcap]);

  const chgLabel =
    chg == null || !Number.isFinite(chg) ? "—" : `${chg >= 0 ? "+" : ""}${chg.toFixed(2)}%`;
  const chgColor = chg == null || !Number.isFinite(chg) ? "#9a958c" : chg >= 0 ? "#4ade80" : "#f87171";

  const ticks: { key: string; text: string; color: string }[] = [];
  if (!dexLoading || mcap != null) {
    ticks.push({
      key: "MAD",
      text: `$MAD  ${px != null ? fmtPx(px) : fmtUsd(mcap)}  MC ${fmtUsd(mcap)}  ${chgLabel}`,
      color: chgColor,
    });
  }
  for (const p of prints) {
    ticks.push({
      key: p.mint,
      text: `${p.ticker}  MC ${p.mc}  ${p.solIn}  curve ${p.curve}  ${p.age}`,
      color: p.live ? "#67e8f9" : "#9a958c",
    });
  }

  const roster = SEATS.map((id) => ({
    id,
    name: META[id].name,
    tag: META[id].tag,
    status: agents.current[id].state,
    color: META[id].color,
  }));
  const live = agents.current;

  return (
    <div className="gd">
      <header className="gd-header">
        <div className="gd-header-inner">
          <Link to="/" className="gd-logo">
            <span style={{ fontSize: 28, lineHeight: 1 }}>😡</span>
            <div>
              <span className="gd-logo-name">$MAD</span>
              <span className="gd-logo-sub">Stay $MAD</span>
            </div>
          </Link>
          <nav className="gd-nav">
            {PAGE_LINKS.map((l) => (
              <Link
                key={l.href}
                to={l.href}
                className={l.href === "/grok-desk" ? "gd-nav-link gd-nav-link-on" : "gd-nav-link"}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <div className="gd-titlebar">
        <div className="gd-title-left">
          <h1 className="gd-h1">
            GROK DESK <span className="gd-dot">•</span> <span className="gd-live">LIVE</span>
          </h1>
          <span className="gd-pill">NIGHT SHIFT</span>
          <span className="gd-muted">PUMP.FUN · CONFIRM ONLY</span>
        </div>
        <div className="gd-title-right">
          <span className="gd-muted">4 SEATS + LEAD</span>
          <span className="gd-clock">{clock || "—"}</span>
        </div>
      </div>

      <div className="gd-ticker" aria-label="Live ticker">
        <div className="gd-ticker-track">
          {(ticks.length ? [0, 1] : [0]).flatMap((copy) =>
            (ticks.length
              ? ticks
              : [
                  {
                    key: "wait",
                    text: dexLoading
                      ? "Waiting for Dex / Pump tape…"
                      : "No live ticker names. Tape unreachable or empty.",
                    color: "#9a958c",
                  },
                ]
            ).map((t) => (
              <span key={`${copy}-${t.key}`} className="gd-tick" style={{ color: t.color }}>
                {t.text}
                <span className="gd-tick-sep">◆</span>
              </span>
            )),
          )}
        </div>
      </div>

      <div className="gd-floor-row">
        <div className="gd-pit">
          <div className="gd-stage">
            <img
              src="/grok-desk-floor-empty.png"
              alt="Grok Desk isometric research floor"
              className="gd-floor-img"
              onError={(e) => {
                const img = e.currentTarget;
                if (!img.dataset.fb) {
                  img.dataset.fb = "1";
                  img.src = "/grok-desk-floor.png";
                }
              }}
            />
            {SEATS.map((id) => {
              const st = live[id].state;
              if (st !== "at desk" && st !== "at the board") return null;
              const g = GLOW[id];
              return <div key={`glow-${id}`} className="gd-glow" style={{ left: `${g.x}%`, top: `${g.y}%` }} />;
            })}
            {HOTS.map((h) => (
              <button
                key={h.id}
                type="button"
                className={focus === h.id ? "gd-hot gd-hot-on" : "gd-hot"}
                style={{ left: h.left, top: h.top, width: h.w, height: h.h }}
                onClick={() => setFocus(h.id)}
                aria-label={`Focus ${h.label}`}
                aria-pressed={focus === h.id}
              />
            ))}
            {SEATS.map((id) => {
              const a = live[id];
              const seated = a.state === "at desk" || a.state === "at the board";
              return (
                <button
                  key={id}
                  type="button"
                  className={focus === id ? "gd-walker gd-walker-on" : "gd-walker"}
                  style={{ left: `${a.x}%`, top: `${a.y}%`, zIndex: 4 + Math.round(a.y) }}
                  onClick={() => setFocus(id)}
                  aria-label={`Focus ${a.name}`}
                >
                  <span
                    className={a.bob ? "gd-spr gd-spr-bob" : "gd-spr"}
                    style={{
                      backgroundPosition: `${50 * a.frame}% ${25 * a.row}%`,
                      transform: `translateX(-50%) scaleX(${a.dir})${seated ? " scale(0.94)" : ""}`,
                    }}
                  />
                  <span className="gd-chip" style={{ color: a.color, borderColor: a.color }}>
                    {a.name}
                  </span>
                  {a.speech ? (
                    <span className="gd-speech" key={a.speechUntil}>
                      {a.speech}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
          <div className="gd-seat-panel">
            <SeatPanel
              seat={focus}
              prints={prints}
              tapeStatus={tapeStatus}
              mcap={mcap}
              liquidity={liq}
              loading={dexLoading}
              stance={stance}
              exit={exit}
              lastGate={lastGate}
              padLine={padLine}
              openClips={openClips}
              deskSol={deskSol}
            />
          </div>
        </div>

        <aside className="gd-side">
          <div className="gd-side-head">AGENTS</div>
          <ul className="gd-agents">
            {roster.map((a) => (
              <li key={a.id}>
                <button
                  type="button"
                  className={focus === a.id ? "gd-agent gd-agent-on" : "gd-agent"}
                  onClick={() => setFocus(a.id)}
                >
                  <span className="gd-agent-dot" style={{ background: a.color }} />
                  <span className="gd-agent-name">{a.name}</span>
                  <span className={a.tag === "LEAD" ? "gd-agent-tag gd-agent-tag-lead" : "gd-agent-tag"}>
                    {a.tag}
                  </span>
                  <span className="gd-agent-status">{a.status}</span>
                </button>
              </li>
            ))}
          </ul>
          <div className="gd-side-head">LIVE FEED</div>
          <div className="gd-feed">
            {feed.length === 0 ? (
              <p className="gd-feed-empty">{tapeStatus}</p>
            ) : (
              feed.map((line) => (
                <button
                  key={line.id}
                  type="button"
                  className="gd-feed-line"
                  onClick={() => setFocus(line.who)}
                >
                  <span className="gd-feed-ts">{line.ts}</span>
                  <span className="gd-feed-who" style={{ color: line.color }}>
                    {line.name}
                  </span>
                  <span className="gd-feed-msg">{line.text}</span>
                </button>
              ))
            )}
          </div>
        </aside>
      </div>

      <div className="gd-bottom">
        <div className="gd-chart">
          <div className="gd-chart-label">
            $MAD · DexScreener · {DEX_PAIR}
            <a href={DEX_URL} target="_blank" rel="noreferrer">
              open
            </a>
          </div>
          <iframe title="$MAD DexScreener chart" src={DEX_EMBED} className="gd-chart-frame" allow="clipboard-write" />
        </div>
        <div className="gd-bookbar">
          <Stat label="Dex MC" value={dexLoading && mcap == null ? "…" : fmtUsd(mcap)} note="DexScreener · 15s" />
          <Stat
            label="PumpSwap liq"
            value={dexLoading && liq == null ? "…" : fmtUsd(liq)}
            note="pair liq"
          />
          <Stat
            label="24h"
            value={dexLoading && chg == null ? "…" : chgLabel}
            note="not a signal"
            accent={chgColor}
          />
          <Stat label="P&L" value="—" note="not available" />
        </div>
      </div>
    </div>
  );
}

function SeatPanel({
  seat,
  prints,
  tapeStatus,
  mcap,
  liquidity,
  loading,
  stance,
  exit,
  lastGate,
  padLine,
  openClips,
  deskSol,
}: {
  seat: SeatId;
  prints: Print[];
  tapeStatus: string;
  mcap: number | null;
  liquidity: number | null;
  loading: boolean;
  stance: string;
  exit: string;
  lastGate: { stamp: Stamp; why: string; ticker: string } | null;
  padLine: string;
  openClips: number;
  deskSol: number;
}) {
  if (seat === "pump") {
    return (
      <section>
        <span className="gd-badge-lead">Lead</span>
        <h2 className="gd-seat-title">Pump Desk</h2>
        <p className="gd-copy">{GROK_DESK.lead.job}</p>
        <p className="gd-mono">Human is the order button. Pump Desk never sizes.</p>
      </section>
    );
  }
  if (seat === "tape") {
    return (
      <section>
        <div className="gd-seat-head">
          <h2 className="gd-seat-title">Tape</h2>
          <span className="gd-badge">Live prints</span>
        </div>
        <p className="gd-copy">
          Ticker, mint, pump.fun URL, USD MC, real SOL in, curve %, age, live or not, one-line why. No
          confetti. No seeded P&amp;L. $MAD is not a hunt.
        </p>
        <p className="gd-mono">{tapeStatus}</p>
        {prints.length === 0 ? (
          <p className="gd-mono">—</p>
        ) : (
          <div className="gd-table-wrap">
            <table className="gd-table">
              <thead>
                <tr>
                  {["Ticker", "Mint", "URL", "MC", "SOL in", "Curve", "Age", "Live", "Why"].map((h) => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {prints.map((p) => (
                  <tr key={p.mint}>
                    <td className="gd-td-strong">{p.ticker}</td>
                    <td>
                      {p.mint.slice(0, 4)}…{p.mint.slice(-4)}
                    </td>
                    <td>
                      <a className="gd-link" href={p.url} target="_blank" rel="noreferrer">
                        pump.fun
                      </a>
                    </td>
                    <td>{p.mc}</td>
                    <td>{p.solIn}</td>
                    <td>{p.curve}</td>
                    <td>{p.age}</td>
                    <td className={p.live ? "gd-yes" : ""}>{p.live ? "yes" : "no"}</td>
                    <td>{p.why}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    );
  }
  if (seat === "risk") {
    return (
      <section>
        <div className="gd-seat-head">
          <h2 className="gd-seat-title">Risk</h2>
          <span className="gd-badge">PASS / WATCH / KILL</span>
        </div>
        <p className="gd-copy">PASS / WATCH / KILL. Unverifiable is a kill. WATCH is not a quote.</p>
        <div className="gd-gates" aria-label="Risk gate">
          {(["PASS", "WATCH", "KILL"] as Stamp[]).map((g) => (
            <span
              key={g}
              className={`gd-gate gd-gate-${g.toLowerCase()}${lastGate?.stamp === g ? " gd-gate-on" : ""}`}
            >
              {g}
            </span>
          ))}
        </div>
        {lastGate ? (
          <p className="gd-mono">
            Last: {lastGate.stamp} ${lastGate.ticker} — {lastGate.why}
          </p>
        ) : (
          <p className="gd-copy">Only PASS can quote. WATCH is not a quote. No buy button. No autotrade.</p>
        )}
        <p className="gd-mono gd-red">Hard skips</p>
        <ul className="gd-list">
          <li>· Mint or freeze authority live</li>
          <li>· Top-10 &gt; 40% ex-curve</li>
          <li>· Reused image</li>
          <li>· Bundler majority</li>
          <li>· Dump-watch if SOL chopped ~40%+ off peak</li>
          <li>· Unverifiable — kill</li>
        </ul>
      </section>
    );
  }
  if (seat === "fills") {
    return (
      <section>
        <div className="gd-seat-head">
          <h2 className="gd-seat-title">Fills</h2>
          <span className="gd-badge">Quote only after PASS</span>
        </div>
        <p className="gd-copy">
          Quote only after a PASS. {QUOTE_SOL} SOL / {SLIP_PCT}% slip UNSIGNED. Human greenlights in chat.
          Phantom signs. No buy button. Bots do not autotrade. Desk SOL under {QUOTE_SOL} keeps the pad dark —
          no invented fill.
        </p>
        <div className="gd-stats3">
          <Stat label="Size" value={`${QUOTE_SOL} SOL`} note="default ticket" />
          <Stat label="Slip" value={`${SLIP_PCT}%`} note="quote slip" />
          <Stat label="Pad" value={deskSol >= QUOTE_SOL ? padLine : "DARK"} note={`desk ${deskSol.toFixed(2)} SOL`} />
        </div>
        <p className="gd-mono gd-red">Brackets</p>
        <ul className="gd-list">
          <li>· −40% or creator dump</li>
          <li>· +100% or graduation</li>
          <li>· {GROK_DESK.ageOutMin} min age-out</li>
        </ul>
      </section>
    );
  }
  return (
    <section>
      <div className="gd-seat-head">
        <h2 className="gd-seat-title">Book</h2>
        <span className="gd-badge">House bag $MAD</span>
      </div>
      <p className="gd-copy">
        Book watches $MAD only. No hunt. No quote. No buy button. Dex MC and PumpSwap liq from DexScreener.
        Open clips: {openClips}. P&amp;L only if we have it — we don&apos;t invent it.
      </p>
      <div className="gd-stats4">
        <Stat label="Dex MC" value={loading && mcap == null ? "…" : fmtUsd(mcap)} note="DexScreener · 15s" />
        <Stat
          label="PumpSwap liq"
          value={loading && liquidity == null ? "…" : fmtUsd(liquidity)}
          note="pair liq"
        />
        <Stat label="Dump vs hold" value={stance} note="24h change, not a signal" />
        <Stat label="P&L" value="—" note="not available" />
      </div>
      <p className="gd-mono gd-red">One-line exit</p>
      <p className="gd-copy">{exit}</p>
      <p className="gd-mono gd-ca">{MAD_MINT}</p>
      <a href={DEX_URL} target="_blank" rel="noreferrer" className="gd-chart-btn">
        DexScreener
      </a>
    </section>
  );
}

function Stat({
  label,
  value,
  note,
  accent,
}: {
  label: string;
  value: string;
  note: string;
  accent?: string;
}) {
  const style: CSSProperties | undefined = accent ? { color: accent } : undefined;
  return (
    <div className="gd-stat">
      <p className="gd-mono">{label}</p>
      <p className="gd-stat-value" style={style}>
        {value}
      </p>
      <p className="gd-mono">{note}</p>
    </div>
  );
}
