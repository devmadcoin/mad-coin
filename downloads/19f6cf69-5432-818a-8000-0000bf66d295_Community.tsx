import PageShell from "@/components/PageShell";
import Reveal from "@/components/Reveal";
import CountUp from "@/components/CountUp";
import TiltCard from "@/components/TiltCard";
import { IMPACT_STATS, COMMUNITIES } from "@/lib/pages-data";

const PILLARS = [
  { icon: "🔗", title: "On-Chain Proof", desc: "Every donation is recorded on the Solana blockchain. No promises — just verifiable transactions anyone can audit." },
  { icon: "🫂", title: "Community First", desc: "Before the dev takes, the community receives. Holder giveaways, project support, and mutual aid — that's the $MAD way." },
  { icon: "📊", title: "Transparent Impact", desc: "We show the math. Communities supported, amounts donated, transaction hashes. Nothing hidden, nothing faked." },
];

export default function Community() {
  return (
    <PageShell
      eyebrow="On-Chain Proof"
      title={<>Community <span className="text-mad">Impact</span></>}
      sub="$MAD doesn't just extract — it distributes. Every community supported, every token locked, every act of conviction is recorded on-chain for anyone to verify."
    >
      {/* stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {IMPACT_STATS.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.08}>
            <div className="group rounded-3xl border border-white/8 bg-panel p-7 text-center transition-all duration-500 hover:border-mad/40 hover:shadow-glow-sm">
              <span className="text-2xl">{s.icon}</span>
              <div className="mt-2 font-display text-4xl text-mad sm:text-5xl">
                <CountUp
                  value={s.value}
                  decimals={(s as { decimals?: number }).decimals ?? 0}
                  suffix={s.suffix ?? ""}
                  prefix={(s as { prefix?: string }).prefix ?? ""}
                />
              </div>
              <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.25em] text-ash">{s.label}</p>
            </div>
          </Reveal>
        ))}
      </div>

      {/* pillars */}
      <Reveal className="mt-20">
        <h2 className="text-center font-display text-3xl uppercase text-bone sm:text-4xl">
          Built to <span className="text-mad">Give</span>, Not Just Grow
        </h2>
      </Reveal>
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {PILLARS.map((p, i) => (
          <Reveal key={p.title} delay={i * 0.08}>
            <TiltCard className="rounded-3xl" max={7}>
              <div className="h-full rounded-3xl border border-white/8 bg-panel p-8 transition-all duration-500 hover:border-mad/40 hover:shadow-glow-sm">
                <span className="text-3xl">{p.icon}</span>
                <h3 className="mt-4 font-display text-xl uppercase text-bone">{p.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ash">{p.desc}</p>
              </div>
            </TiltCard>
          </Reveal>
        ))}
      </div>

      {/* verified impact */}
      <Reveal className="mt-20">
        <h2 className="text-center font-display text-3xl uppercase text-bone sm:text-4xl">
          Verified <span className="text-mad">Impact</span>
        </h2>
        <p className="mt-3 text-center font-mono text-[11px] uppercase tracking-[0.3em] text-ash">
          {COMMUNITIES.length} communities · locked via Streamflow
        </p>
      </Reveal>
      <div className="mt-10 grid gap-4">
        {COMMUNITIES.map((c, i) => (
          <Reveal key={c.name} delay={Math.min(i * 0.05, 0.3)}>
            <div className="group flex flex-col gap-4 rounded-3xl border border-white/8 bg-panel p-6 transition-all duration-500 hover:border-mad/40 sm:flex-row sm:items-center">
              <div className="flex items-center gap-4 sm:w-56">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-mad/10 font-display text-lg text-mad">
                  {c.name[0]}
                </div>
                <div>
                  <p className="font-bold text-bone">{c.name}</p>
                  <a href={`https://x.com/${c.handle.slice(1)}`} target="_blank" rel="noreferrer" className="font-mono text-xs text-ash transition-colors hover:text-mad-bright">
                    {c.handle} 𝕏
                  </a>
                </div>
              </div>
              <p className="flex-1 text-sm leading-relaxed text-ash">{c.note}</p>
              <div className="flex items-center gap-5 sm:flex-col sm:items-end sm:gap-1">
                <p className="font-mono text-xl font-bold text-mad-bright">${c.usd.toLocaleString()}</p>
                <p className="font-mono text-xs text-ash">{c.amount} {c.ticker}</p>
              </div>
              <div className="flex gap-2">
                <a href={c.post} target="_blank" rel="noreferrer" className="rounded-full border border-white/10 px-4 py-1.5 font-mono text-[11px] uppercase tracking-wider text-ash transition-all hover:border-mad/50 hover:text-bone">
                  Post ↗
                </a>
                <a href={c.verify} target="_blank" rel="noreferrer" className="rounded-full border border-green-500/30 px-4 py-1.5 font-mono text-[11px] uppercase tracking-wider text-green-400 transition-all hover:bg-green-500/10">
                  Verify ↗
                </a>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      {/* dev lock */}
      <Reveal className="mt-10">
        <div className="rounded-3xl border border-mad/40 bg-mad/[0.06] p-8 text-center shadow-glow-sm">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-mad">Dev Commitment</p>
          <p className="mt-2 font-display text-4xl text-bone">100M $MAD <span className="text-mad">Locked</span></p>
          <p className="mt-2 text-sm text-ash">
            $472,348 · Non-cancelable until Dec 2026 · Cannot be revoked or withdrawn
          </p>
          <a
            href="https://app.streamflow.finance/contract/solana/mainnet/vi57YgR8GGHL31EieLLN1Ekbzj5w4wTV6iXcDiU4R2G"
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-block rounded-full bg-mad px-7 py-3 text-sm font-bold uppercase tracking-wider text-white transition-all hover:scale-105 hover:shadow-glow"
          >
            Verify the Lock ↗
          </a>
        </div>
      </Reveal>
    </PageShell>
  );
}
