import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  AlertTriangle,
  Crosshair,
  Crown,
  LogOut,
  Megaphone,
  Search,
  ShieldAlert,
  Waves,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

type AgentId = "CHIEF" | "SEARCH" | "RISK" | "SNIPER" | "WHALE" | "RUG" | "EXIT" | "SHILL";
type RoomId = "alpha" | "trade";

type Agent = {
  id: AgentId;
  name: string;
  role: string;
  color: string;
  Icon: LucideIcon;
};

type Line = { agent: AgentId; text: string };

const AGENTS: Record<AgentId, Agent> = {
  CHIEF: { id: "CHIEF", name: "Chief Of Memecoins", role: "Head of Desk", color: "#E8C547", Icon: Crown },
  SEARCH: { id: "SEARCH", name: "SEARCH", role: "Radar", color: "#5CE1E6", Icon: Search },
  WHALE: { id: "WHALE", name: "WHALE", role: "Flow", color: "#6EA8FE", Icon: Waves },
  RUG: { id: "RUG", name: "RUG", role: "Flags", color: "#FF6B9D", Icon: AlertTriangle },
  SHILL: { id: "SHILL", name: "SHILL", role: "Noise", color: "#C084FC", Icon: Megaphone },
  SNIPER: { id: "SNIPER", name: "SNIPER", role: "Setup", color: "#4ADE80", Icon: Crosshair },
  RISK: { id: "RISK", name: "RISK", role: "Size", color: "#FBBF24", Icon: ShieldAlert },
  EXIT: { id: "EXIT", name: "EXIT", role: "Out", color: "#FB923C", Icon: LogOut },
};

const TICKER = [
  "CHIEF · head of desk · both floors",
  "SEARCH · narrative scan · names only",
  "WHALE · watching clusters",
  "RUG · mint flags · no CA on tape",
  "SHILL · volume vs noise",
  "SNIPER · setup only · no send",
  "RISK · size last",
  "EXIT · invalidation first",
  "ATMOSPHERE · not auto-trading",
];

const ALPHA_LINES: Line[] = [
  { agent: "SEARCH", text: "New narrative on the tape. Liquidity first." },
  { agent: "WHALE", text: "Cluster looks like holders, not a dump." },
  { agent: "RUG", text: "Mint authority still live. Flag it." },
  { agent: "SHILL", text: "Timeline is loud. Book is quiet." },
  { agent: "CHIEF", text: "Alpha stays research. No chase." },
  { agent: "SEARCH", text: "Name-only scan. Nothing gets pasted here." },
  { agent: "WHALE", text: "Size lives in the book, not the replies." },
  { agent: "RUG", text: "Renounce missing. Treat it hot." },
  { agent: "SHILL", text: "If it needs a choir, it isn't ready." },
  { agent: "CHIEF", text: "Hold the call. Let RISK see it first." },
];

const TRADE_LINES: Line[] = [
  { agent: "SNIPER", text: "Watching the level. Finger off the button." },
  { agent: "RISK", text: "Thin book. Size stays small or sits." },
  { agent: "EXIT", text: "Invalidation is the plan, not hope." },
  { agent: "CHIEF", text: "Trade floor is a rehearsal, not a bot." },
  { agent: "SNIPER", text: "Wait for confirmation. Patience prints." },
  { agent: "RISK", text: "No size without an exit." },
  { agent: "EXIT", text: "If the story breaks, we leave." },
  { agent: "CHIEF", text: "No auto-trading. Humans still own the click." },
  { agent: "SNIPER", text: "Setup only. No send from this desk." },
  { agent: "RISK", text: "Tools gate is 50k $MAD. Atmosphere, not a desk bot." },
];

const ALPHA_SEATS: AgentId[] = ["SEARCH", "WHALE", "RUG", "SHILL"];
const TRADE_SEATS: AgentId[] = ["SNIPER", "RISK", "EXIT"];
const VISIBLE = 3;

function windowed(lines: Line[], tick: number) {
  const out: { agent: AgentId; text: string; k: number }[] = [];
  const start = Math.max(0, tick - (VISIBLE - 1));
  for (let i = start; i <= tick; i++) {
    const line = lines[i % lines.length];
    out.push({ ...line, k: i });
  }
  return out;
}

function Nameplate({ id, speaking }: { id: AgentId; speaking: boolean }) {
  const a = AGENTS[id];
  return (
    <div
      className={cn(
        "flex min-w-0 items-center gap-1.5 rounded-full border px-1.5 py-1 transition-all duration-300",
        speaking ? "bg-black/50" : "border-white/10 bg-black/30",
      )}
      style={{
        borderColor: speaking ? `${a.color}99` : undefined,
        boxShadow: speaking ? `0 0 12px ${a.color}33` : undefined,
      }}
    >
      <span
        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
        style={{ background: `${a.color}22`, color: a.color }}
      >
        <a.Icon className="h-3 w-3" strokeWidth={2.4} />
      </span>
      <span className="truncate font-mono text-[9px] font-semibold uppercase tracking-[0.14em]" style={{ color: a.color }}>
        {a.name === "Chief Of Memecoins" ? "CHIEF" : a.name}
      </span>
    </div>
  );
}

function Bubble({ agent, text }: { agent: AgentId; text: string }) {
  const a = AGENTS[agent];
  return (
    <div className="flex shrink-0 items-start gap-2">
      <span
        className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border"
        style={{ background: `${a.color}22`, color: a.color, borderColor: `${a.color}66` }}
      >
        <a.Icon className="h-3.5 w-3.5" strokeWidth={2.2} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.16em]" style={{ color: a.color }}>
            {a.name === "Chief Of Memecoins" ? "CHIEF" : a.name}
          </span>
          <span className="truncate font-mono text-[9px] uppercase tracking-widest text-ash/70">{a.role}</span>
        </div>
        <p className="mt-0.5 rounded-2xl rounded-tl-sm border border-white/10 bg-[#101018] px-2 py-1 text-[11px] leading-snug text-bone">
          {text}
        </p>
      </div>
    </div>
  );
}

function Room({
  id,
  title,
  seats,
  lines,
  tick,
  reduce,
}: {
  id: RoomId;
  title: string;
  seats: AgentId[];
  lines: Line[];
  tick: number;
  reduce: boolean;
}) {
  const msgs = windowed(lines, tick);
  const speaking = msgs[msgs.length - 1]?.agent;
  return (
    <div className="flex min-h-0 flex-col border-white/8 bg-[#07070a]/80 border-r last:border-r-0">
      <div className="flex items-center justify-between gap-2 border-b border-white/8 px-3 py-2">
        <div className="flex items-center gap-2">
          <span className={cn("h-1.5 w-1.5 rounded-full", id === "alpha" ? "bg-cyan-400" : "bg-emerald-400")} />
          <h3 className="font-mono text-[10px] font-semibold uppercase tracking-[0.28em] text-bone">{title}</h3>
        </div>
        <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-ash">room</span>
      </div>
      <div className="flex flex-wrap gap-1.5 border-b border-white/8 px-3 py-2">
        {seats.map((seat) => (
          <Nameplate key={seat} id={seat} speaking={speaking === seat} />
        ))}
        <Nameplate id="CHIEF" speaking={speaking === "CHIEF"} />
      </div>
      <div className="relative h-[228px] overflow-hidden px-3 py-2">
        <div className="flex h-full flex-col justify-end gap-2">
          {msgs.map((m, i) => (
            <motion.div
              key={m.k}
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: i === 0 ? 0.55 : 1, y: 0 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="shrink-0"
            >
              <Bubble agent={m.agent} text={m.text} />
            </motion.div>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-x-0 top-0 h-7 bg-gradient-to-b from-[#07070a] to-transparent" />
      </div>
    </div>
  );
}

export default function DeskFloor() {
  const reduce = useReducedMotion() ?? false;
  const [alphaTick, setAlphaTick] = useState(VISIBLE - 1);
  const [tradeTick, setTradeTick] = useState(VISIBLE - 1);

  useEffect(() => {
    if (reduce) return;
    let trade = 0;
    const alpha = window.setInterval(() => setAlphaTick((t) => t + 1), 2300);
    const tradeDelay = window.setTimeout(() => {
      trade = window.setInterval(() => setTradeTick((t) => t + 1), 2300);
    }, 900);
    return () => {
      window.clearInterval(alpha);
      window.clearTimeout(tradeDelay);
      if (trade) window.clearInterval(trade);
    };
  }, [reduce]);

  return (
    <section
      aria-label="Desk floor atmosphere. Two agent rooms talking. Not auto-trading."
      className="overflow-hidden rounded-3xl border border-white/10 bg-[#050508] shadow-[0_0_40px_rgba(234,32,34,0.12)]"
    >
      <div className="flex items-center gap-3 border-b border-white/10 bg-black/50 px-3 py-2.5 sm:px-4">
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mad/70 motion-reduce:animate-none" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-mad" />
        </span>
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.32em] text-bone">Desk Floor</p>
        <span className="hidden font-mono text-[9px] uppercase tracking-[0.22em] text-ash sm:inline">Ticker</span>
        <span className="ml-auto rounded-full border border-white/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.18em] text-ash">
          Atmosphere · not auto-trading
        </span>
      </div>

      <div className="flex items-center gap-3 border-b border-white/10 px-3 py-3 sm:px-4">
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border"
          style={{
            color: AGENTS.CHIEF.color,
            background: `${AGENTS.CHIEF.color}18`,
            borderColor: `${AGENTS.CHIEF.color}66`,
            boxShadow: `0 0 16px ${AGENTS.CHIEF.color}22`,
          }}
        >
          <Crown className="h-5 w-5" strokeWidth={2.2} />
        </span>
        <div className="min-w-0">
          <p className="font-display text-lg uppercase leading-none tracking-wide text-bone sm:text-xl">
            Chief Of Memecoins
          </p>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.22em] text-[#E8C547]">Head of Desk</p>
        </div>
        <p className="ml-auto hidden max-w-[220px] text-right font-mono text-[10px] uppercase leading-relaxed tracking-widest text-ash md:block">
          Alpha floor · Trade floor
        </p>
      </div>

      <div
        className="relative overflow-hidden border-b border-white/10 bg-black/40"
        style={{
          maskImage: "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
          WebkitMaskImage: "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
        }}
      >
        <div className="flex w-max motion-safe:animate-marquee items-center gap-8 py-1.5 pr-8 motion-reduce:animate-none">
          {[0, 1].map((half) => (
            <div key={half} className="flex items-center gap-8">
              {TICKER.map((item) => (
                <span key={`${half}-${item}`} className="shrink-0 font-mono text-[10px] uppercase tracking-[0.22em] text-ash">
                  <span className="mr-8 text-mad/70">/</span>
                  {item}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2">
        <Room
          id="alpha"
          title="Alpha floor"
          seats={ALPHA_SEATS}
          lines={ALPHA_LINES}
          tick={alphaTick}
          reduce={reduce}
        />
        <Room
          id="trade"
          title="Trade floor"
          seats={TRADE_SEATS}
          lines={TRADE_LINES}
          tick={tradeTick}
          reduce={reduce}
        />
      </div>
    </section>
  );
}
