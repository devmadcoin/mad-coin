"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const LINKS = {
  telegram: "https://t.me/MadOfficialChannel",
  x: "https://x.com/madrichclub_",
  instagram: "https://www.instagram.com/madrichclub/",
  tiktok: "https://www.tiktok.com/@madrichclub",
} as const;

type Phase = {
  phase: string;
  title: string;
  status: "Live" | "Building" | "Next";
  description: string;
  wins: string[];
};

type ProofNode = {
  label: string;
  status: "Live" | "Building" | "Next";
  percent: number;
  detail: string;
};

const PHASES: Phase[] = [
  {
    phase: "Phase 1",
    title: "Identity + Core Signal",
    status: "Live",
    description:
      "$MAD established the core identity first: emotion under control, pressure as truth, and discipline over panic.",
    wins: [
      "Brand foundation and Stay $MAD philosophy",
      "Core website and visual identity live",
      "Social channels connected",
      "MAD Mind concept and signal-based messaging launched",
    ],
  },
  {
    phase: "Phase 2",
    title: "Community + Proof",
    status: "Live",
    description:
      "The mission moved from idea to public proof. Real people, real reactions, real signal.",
    wins: [
      "MAD Confessions live on site",
      "Community-facing posting loop active",
      "Public proof section and social trust layer",
      "Clearer onboarding for retail understanding",
    ],
  },
  {
    phase: "Phase 3",
    title: "MAD AI + Interactive Engine",
    status: "Building",
    description:
      "This is where $MAD started becoming deeper tech. The project is no longer just content and branding. It is becoming an interactive machine with memory, response loops, scoring, archetypes, and AI-based engagement.",
    wins: [
      "MAD Mind live and deployed",
      "Pressure score, archetypes, and progression system",
      "Shareable card / clip features",
      "Retention loop foundation built",
      "MAD AI development started",
      "Interactive response engine connected to on-site experience",
    ],
  },
  {
    phase: "Phase 4",
    title: "Game + Ecosystem Expansion",
    status: "Next",
    description:
      "The next layer is turning identity into participation through games, experiences, merch, and stronger social loops.",
    wins: [
      "Game ecosystem expansion",
      "Deeper leaderboard and progression systems",
      "Merch and collectible identity rollout",
      "Stronger community reward mechanics",
    ],
  },
];

const PROOF_NODES: ProofNode[] = [
  {
    label: "Brand Identity",
    status: "Live",
    percent: 100,
    detail: "Philosophy, visuals, tone, and signal are established.",
  },
  {
    label: "Website",
    status: "Live",
    percent: 100,
    detail: "Core public hub is live and evolving.",
  },
  {
    label: "Community",
    status: "Live",
    percent: 88,
    detail: "Telegram, X, confessions, and public interaction loops are active.",
  },
  {
    label: "MAD Mind",
    status: "Live",
    percent: 84,
    detail: "Interactive experience is already live and usable.",
  },
  {
    label: "MAD AI",
    status: "Building",
    percent: 72,
    detail: "AI behavior, memory, progression, and engagement tech are being built.",
  },
  {
    label: "Game Layer",
    status: "Building",
    percent: 42,
    detail: "The ecosystem is expanding from content into interaction.",
  },
  {
    label: "Merch / Collectibles",
    status: "Building",
    percent: 38,
    detail: "Physical identity layer is forming.",
  },
  {
    label: "Full Ecosystem",
    status: "Next",
    percent: 24,
    detail: "Game, tech, merch, and community all compounding together.",
  },
];

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function StatusPill({ status }: { status: Phase["status"] | ProofNode["status"] }) {
  return (
    <span
      className={cn(
        "rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] border",
        status === "Live" && "bg-emerald-500/15 text-emerald-300 border-emerald-400/20",
        status === "Building" && "bg-red-500/15 text-red-200 border-red-400/20",
        status === "Next" && "bg-white/10 text-white/70 border-white/10",
      )}
    >
      {status}
    </span>
  );
}

function SectionHeading({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body: string;
}) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-white/42">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-3xl font-black leading-[0.95] text-white sm:text-4xl md:text-5xl">
        {title}
      </h2>
      <p className="mt-4 max-w-3xl text-sm leading-7 text-white/62 sm:text-base">
        {body}
      </p>
    </div>
  );
}

function RevealSection({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setVisible(true), delay);
    return () => window.clearTimeout(t);
  }, [delay]);

  return (
    <div
      className={cn(
        "transition-all duration-700 ease-out",
        visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
      )}
    >
      {children}
    </div>
  );
}

function ProofChart() {
  return (
    <div className="rounded-[30px] border border-white/10 bg-black/40 p-5 shadow-[0_20px_80px_rgba(0,0,0,0.45)]">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/40">
            Visual Proof
          </p>
          <h3 className="mt-2 text-2xl font-black text-white sm:text-3xl">
            Real project momentum
          </h3>
        </div>
        <div className="rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-red-200">
          Building in public
        </div>
      </div>

      <div className="space-y-4">
        {PROOF_NODES.map((node, index) => (
          <div
            key={node.label}
            className="rounded-[22px] border border-white/10 bg-white/[0.03] p-4"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-black text-white">{node.label}</p>
                  <StatusPill status={node.status} />
                </div>
                <p className="mt-2 text-sm text-white/58">{node.detail}</p>
              </div>
              <div className="text-right">
                <div className="text-xl font-black text-white">{node.percent}%</div>
                <div className="text-[11px] uppercase tracking-[0.16em] text-white/35">
                  progress
                </div>
              </div>
            </div>

            <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/10">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-1000",
                  node.status === "Live" && "bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.5)]",
                  node.status === "Building" && "bg-red-500 shadow-[0_0_18px_rgba(239,68,68,0.45)]",
                  node.status === "Next" && "bg-white/40",
                )}
                style={{
                  width: `${node.percent}%`,
                  transitionDelay: `${index * 100}ms`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EcosystemCurve() {
  return (
    <div className="rounded-[30px] border border-white/10 bg-black/40 p-5 shadow-[0_20px_80px_rgba(0,0,0,0.45)]">
      <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/40">
        Quick Read
      </p>
      <h3 className="mt-2 text-2xl font-black text-white sm:text-3xl">
        Why people say “this is real”
      </h3>
      <p className="mt-3 text-sm leading-7 text-white/62">
        This visual is for people who do not want to read every paragraph. It shows
        the project moving from idea into system.
      </p>

      <div className="mt-6 rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))] p-4">
        <div className="relative h-[260px] overflow-hidden rounded-[18px] border border-white/10 bg-black/30">
          <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(to_right,rgba(255,255,255,0.35)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.35)_1px,transparent_1px)] [background-size:48px_48px]" />

          <div className="absolute left-6 right-6 top-6 bottom-8">
            <svg viewBox="0 0 100 100" className="h-full w-full">
              <defs>
                <linearGradient id="madCurve" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.65)" />
                  <stop offset="45%" stopColor="rgba(239,68,68,0.92)" />
                  <stop offset="100%" stopColor="rgba(52,211,153,0.95)" />
                </linearGradient>
              </defs>

              <path
                d="M 5 85 C 20 78, 28 72, 38 66 S 56 52, 64 46 S 78 26, 95 15"
                fill="none"
                stroke="url(#madCurve)"
                strokeWidth="3"
                strokeLinecap="round"
                className="drop-shadow-[0_0_10px_rgba(239,68,68,0.4)]"
              />

              {[
                { x: 8, y: 84, label: "Idea" },
                { x: 26, y: 72, label: "Identity" },
                { x: 44, y: 60, label: "Community" },
                { x: 60, y: 46, label: "MAD Mind" },
                { x: 74, y: 31, label: "MAD AI" },
                { x: 93, y: 16, label: "Ecosystem" },
              ].map((point) => (
                <g key={point.label}>
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r="2.8"
                    fill="white"
                    className="drop-shadow-[0_0_10px_rgba(255,255,255,0.7)]"
                  />
                  <text
                    x={point.x}
                    y={point.y - 5}
                    textAnchor="middle"
                    fontSize="4"
                    fill="rgba(255,255,255,0.82)"
                    fontWeight="700"
                  >
                    {point.label}
                  </text>
                </g>
              ))}
            </svg>
          </div>

          <div className="absolute left-4 bottom-3 right-4 flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.16em] text-white/35">
            <span>Earlier</span>
            <span>Now</span>
            <span>Next</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RoadmapPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#050505] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,48,48,0.12),transparent_35%),radial-gradient(circle_at_20%_20%,rgba(255,0,60,0.10),transparent_30%),radial-gradient(circle_at_80%_30%,rgba(255,80,0,0.08),transparent_30%)]" />
        <div className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:42px_42px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/70" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 lg:px-8 lg:pt-8">
        <RevealSection>
          <section className="overflow-hidden rounded-[38px] border border-white/10 bg-black/35 shadow-[0_24px_120px_rgba(0,0,0,0.5)] backdrop-blur-xl">
            <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
              <div className="relative flex flex-col justify-center px-6 py-14 sm:px-10 lg:px-12 lg:py-20">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-500/25 to-transparent" />

                <p className="text-[11px] font-semibold uppercase tracking-[0.38em] text-white/40">
                  THE MAD PATH
                </p>

                <h1 className="mt-6 text-[3rem] font-black leading-[0.88] tracking-[-0.05em] text-white sm:text-[4.5rem] lg:text-[5.8rem]">
                  BUILD
                  <br />
                  SIGNAL.
                  <br />
                  SURVIVE
                  <br />
                  <span className="text-red-500 drop-shadow-[0_0_18px_rgba(255,0,0,0.6)]">
                    PRESSURE.
                  </span>
                </h1>

                <p className="mt-6 max-w-xl text-sm leading-7 text-white/62 sm:text-base">
                  This is the roadmap, lore, and public progress of $MAD. Not hype.
                  Not vague promises. Just the path: what was built, what is live,
                  and what comes next.
                </p>

                <div className="mt-5 max-w-xl rounded-[20px] border border-red-500/15 bg-red-500/[0.06] px-4 py-3 text-sm text-white/70">
                  Chaos is constant. The roadmap is how control gets built anyway.
                </div>

                <div className="mt-10 flex flex-wrap gap-3">
                  <Link
                    href="/mad-mind"
                    className="inline-flex items-center justify-center rounded-full border border-red-500/30 bg-red-500 px-5 py-3 text-sm font-black text-white transition duration-200 hover:scale-[1.01] hover:bg-red-400"
                  >
                    Enter MAD Mind
                  </Link>

                  <a
                    href="#timeline"
                    className="inline-flex items-center justify-center rounded-full border border-white/10 bg-[linear-gradient(180deg,rgba(70,20,20,0.75),rgba(36,10,10,0.9))] px-5 py-3 text-sm font-black text-white transition duration-200 hover:border-white/20 hover:bg-[linear-gradient(180deg,rgba(82,26,26,0.85),rgba(44,12,12,0.96))]"
                  >
                    View Timeline
                  </a>
                </div>
              </div>

              <div className="relative flex items-center justify-center bg-[linear-gradient(180deg,rgba(100,0,0,0.18),rgba(20,0,0,0.04))] p-5 sm:p-7 lg:p-10">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,60,60,0.14),transparent_44%)]" />
                <div className="relative w-full max-w-[620px] space-y-4">
                  <div className="rounded-[28px] border border-white/10 bg-black/50 p-5 shadow-[0_20px_80px_rgba(0,0,0,0.45)]">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/40">
                      Core Formula
                    </p>
                    <p className="mt-3 text-2xl font-black text-white sm:text-3xl">
                      RIC + WEAL = true wealth
                    </p>
                    <p className="mt-3 text-sm leading-7 text-white/62">
                      Control first. Well-being second. Wealth becomes durable only
                      when emotion stops running the system.
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="rounded-[22px] border border-white/10 bg-white/[0.03] p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/40">
                        Philosophy
                      </p>
                      <p className="mt-2 text-sm text-white/62">
                        Stay $MAD means feel everything, obey nothing weak.
                      </p>
                    </div>
                    <div className="rounded-[22px] border border-white/10 bg-white/[0.03] p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/40">
                        Mission
                      </p>
                      <p className="mt-2 text-sm text-white/62">
                        Turn pressure into signal, identity, and action.
                      </p>
                    </div>
                    <div className="rounded-[22px] border border-white/10 bg-white/[0.03] p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/40">
                        Direction
                      </p>
                      <p className="mt-2 text-sm text-white/62">
                        Build a culture, a system, and an ecosystem people can use.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </RevealSection>

        <RevealSection delay={120}>
          <section className="mt-10 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <ProofChart />
            <EcosystemCurve />
          </section>
        </RevealSection>

        <RevealSection delay={220}>
          <section className="mt-10 rounded-[38px] border border-white/10 bg-[linear-gradient(180deg,rgba(30,0,0,0.86),rgba(8,0,0,0.96))] p-6 shadow-[0_18px_70px_rgba(0,0,0,0.4)] backdrop-blur-xl sm:p-8 lg:p-10">
            <SectionHeading
              eyebrow="MAD AI"
              title="When the project started becoming tech"
              body="This is one of the biggest turning points in the path. $MAD stopped being just message, content, and identity. This is where the project started becoming interactive tech. MAD Mind, on-site progression, pressure scoring, archetypes, share loops, and AI behavior changed the project from a static page into a system people can actually use."
            />

            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {[
                "MAD AI development started",
                "MAD Mind now responds in real time",
                "Pressure score and archetype system created",
                "Interactive retention loops now exist",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-[22px] border border-red-500/20 bg-red-500/10 px-4 py-4 text-sm font-semibold text-red-100 shadow-[0_0_18px_rgba(239,68,68,0.12)]"
                >
                  {item}
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-[26px] border border-white/10 bg-black/25 p-5">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-3xl">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/40">
                    Why it matters
                  </p>
                  <p className="mt-3 text-sm leading-7 text-white/62 sm:text-base">
                    For a lot of people, this is the “wow” moment. A project with AI,
                    interactive systems, public progression, shareable outputs, and
                    ecosystem logic feels different from a normal meme page. It feels
                    like something with real depth, real engineering, and room to grow.
                  </p>
                </div>

                <div className="rounded-[22px] border border-emerald-400/20 bg-emerald-500/10 px-5 py-4 text-center">
                  <div className="text-3xl font-black text-emerald-300">LIVE</div>
                  <div className="mt-1 text-[11px] uppercase tracking-[0.18em] text-emerald-100/80">
                    MAD Mind online
                  </div>
                </div>
              </div>
            </div>
          </section>
        </RevealSection>

        <RevealSection delay={320}>
          <section className="mt-10 rounded-[38px] border border-white/10 bg-[linear-gradient(180deg,rgba(30,0,0,0.86),rgba(8,0,0,0.96))] p-6 shadow-[0_18px_70px_rgba(0,0,0,0.4)] backdrop-blur-xl sm:p-8 lg:p-10">
            <SectionHeading
              eyebrow="Lore"
              title="What $MAD actually means"
              body="$MAD is not about random anger. It is about mastering the emotional moment where most people fold. Panic, hesitation, greed, fear, ego, excuse-making — all of it gets exposed under pressure. The path is about learning to stay clear enough to move anyway."
            />

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/40">
                  Chaos
                </p>
                <p className="mt-3 text-sm leading-7 text-white/62">
                  Chaos is real. Markets move. People switch up. Pressure hits
                  without warning.
                </p>
              </div>

              <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/40">
                  Discipline
                </p>
                <p className="mt-3 text-sm leading-7 text-white/62">
                  Discipline is the separator. Most people react. Very few decide.
                </p>
              </div>

              <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/40">
                  Identity
                </p>
                <p className="mt-3 text-sm leading-7 text-white/62">
                  The goal is not temporary motivation. The goal is becoming the
                  kind of person who does not fold.
                </p>
              </div>
            </div>
          </section>
        </RevealSection>

        <RevealSection delay={420}>
          <section
            id="timeline"
            className="mt-10 rounded-[38px] border border-white/10 bg-black/30 p-6 shadow-[0_18px_70px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-8 lg:p-10"
          >
            <SectionHeading
              eyebrow="Roadmap"
              title="The build timeline"
              body="This is the structured path from philosophy into ecosystem. What is live stays visible. What is being built stays accountable. What comes next stays clear."
            />

            <div className="mt-10 space-y-5">
              {PHASES.map((phase, index) => (
                <div
                  key={phase.phase}
                  className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5 sm:p-6"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="text-sm font-black uppercase tracking-[0.18em] text-red-300">
                          {phase.phase}
                        </span>
                        <StatusPill status={phase.status} />
                      </div>
                      <h3 className="mt-3 text-2xl font-black text-white">
                        {phase.title}
                      </h3>
                      <p className="mt-3 max-w-3xl text-sm leading-7 text-white/62">
                        {phase.description}
                      </p>
                    </div>

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-sm font-black text-white/70">
                      {index + 1}
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 md:grid-cols-2">
                    {phase.wins.map((win) => (
                      <div
                        key={win}
                        className="rounded-[18px] border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/75"
                      >
                        {win}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </RevealSection>

        <RevealSection delay={520}>
          <section className="mt-10 rounded-[38px] border border-white/10 bg-[linear-gradient(180deg,rgba(30,0,0,0.86),rgba(8,0,0,0.96))] p-6 shadow-[0_18px_70px_rgba(0,0,0,0.4)] backdrop-blur-xl sm:p-8 lg:p-10">
            <SectionHeading
              eyebrow="Accomplished"
              title="What is already done"
              body="This keeps the path honest. These are not vague intentions. These are pieces that already exist in public."
            />

            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {[
                "Website live",
                "Brand philosophy defined",
                "The Mad Path page live",
                "MAD Mind deployed",
                "MAD Confessions live",
                "Social channels connected",
                "Interactive share loops started",
                "Identity-driven UX direction established",
                "Retail-friendly messaging improved",
                "MAD AI build phase started",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-[22px] border border-emerald-400/20 bg-emerald-500/10 px-4 py-4 text-sm font-semibold text-emerald-100"
                >
                  {item}
                </div>
              ))}
            </div>
          </section>
        </RevealSection>

        <RevealSection delay={620}>
          <section className="mt-10 rounded-[38px] border border-white/10 bg-black/30 p-6 shadow-[0_18px_70px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-8 lg:p-10">
            <SectionHeading
              eyebrow="Next"
              title="What comes next"
              body="The next chapter is about compounding attention into ecosystem depth."
            />

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {[
                "Deeper MAD Mind memory + progression",
                "Leaderboard and trending loops",
                "Game ecosystem expansion",
                "Merch identity rollout",
                "More public proof and social signal",
                "Stronger community participation mechanics",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-[22px] border border-white/10 bg-white/[0.03] px-4 py-4 text-sm text-white/75"
                >
                  {item}
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={LINKS.telegram}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-red-500/30 bg-red-500 px-5 py-3 text-sm font-black text-white transition duration-200 hover:scale-[1.01] hover:bg-red-400"
              >
                Join Telegram
              </a>
              <a
                href={LINKS.x}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-white/10 bg-[linear-gradient(180deg,rgba(70,20,20,0.75),rgba(36,10,10,0.9))] px-5 py-3 text-sm font-black text-white transition duration-200 hover:border-white/20 hover:bg-[linear-gradient(180deg,rgba(82,26,26,0.85),rgba(44,12,12,0.96))]"
              >
                Follow X
              </a>
            </div>
          </section>
        </RevealSection>
      </div>
    </div>
  );
}
