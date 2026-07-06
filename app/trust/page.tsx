"use client";

import Image from "next/image";
import Link from "next/link";

/* ═══════════════════════════════════════════════════════════
   DATA — Dev Transparency
   ═══════════════════════════════════════════════════════════ */

const TRANSPARENCY_ITEMS = [
  {
    type: "lock" as const,
    title: "100M $MAD Dev Lock",
    amount: "100,000,000",
    value: "$472,348",
    token: "$MAD",
    date: "2026-06-05",
    unlockDate: "2026-12-04",
    status: "locked",
    contract: "2Qg5Ugf2eH12ry9w3StU9sMvo5biuruK7ob2sni2Yref",
    xPost: "https://x.com/madrichclub_/status/2074232348292661547",
    description: "Developer locked 100M $MAD tokens via Streamflow. Non-cancelable. Immutable contract. Cannot be withdrawn, transferred, or revoked until December 2026.",
  },
];

const BURN_DATA = {
  totalBurned: "800,000,000",
  burnRate: "80%",
  burnWallet: "burn_wallet_address_here",
  milestones: [
    { date: "Feb 2026", amount: "33M", note: "The Silent Burn" },
    { date: "Mar 1, 2026", amount: "400M", note: "The 400M Burn — 40% total supply" },
    { date: "Mar 4, 2026", amount: "800M", note: "The 800M Burn — 80% total supply" },
  ],
};

/* ═══════════════════════════════════════════════════════════
   ANIMATIONS
   ═══════════════════════════════════════════════════════════ */
function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <div
      style={{
        animation: `fadeInUp 0.6s ease-out ${delay}s both`,
      }}
    >
      {children}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   HERO
   ═══════════════════════════════════════════════════════════ */
function Hero() {
  return (
    <section className="relative overflow-hidden px-4 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-5xl text-center"
      >
        <FadeIn>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#FF6B00]/60"
          >
            Nothing Hidden
          </p>
          <h1 className="mt-4 text-4xl font-black leading-[0.95] text-white sm:text-6xl lg:text-7xl"
          >
            Dev{" "}
            <span className="text-[#FF2D2D] drop-shadow-[0_0_20px_rgba(255,45,45,0.4)]"
            >
              Transparency
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-white/50 sm:text-lg"
          >
            Most projects hide. We don't. Every lock, every burn, every transaction is on-chain 
            and verifiable. This is what accountability looks like in a space full of shadows.
          </p>
        </FadeIn>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   DEV LOCK — The Big One
   ═══════════════════════════════════════════════════════════ */
function DevLock() {
  const lock = TRANSPARENCY_ITEMS[0];

  return (
    <section className="px-4 py-16 sm:py-20"
    >
      <div className="mx-auto max-w-4xl"
      >
        <FadeIn>
          <div className="rounded-3xl border border-[#FF2D2D]/20 bg-[#FF2D2D]/[0.03] p-8 sm:p-12"
          >
            <div className="flex items-center gap-3 mb-6"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FF2D2D]/20"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF2D2D" strokeWidth="2"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <div
              >
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#FF6B00]/60"
                >
                  Non-Cancelable Dev Lock
                </p>
                <p className="text-xs text-white/40"
                >
                  Immutable · On-Chain Verified
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8"
            >
              <div
              >
                <p className="text-5xl sm:text-6xl font-black text-white"
                >
                  {lock.amount}
                </p>
                <p className="text-lg font-black text-[#FF2D2D] mt-1"
                >
                  {lock.token} Locked
                </p>
                <p className="text-2xl font-black text-white/70 mt-4"
                >
                  {lock.value}
                </p>
                <p className="text-xs text-white/30"
                >
                  Current Value
                </p>
              </div>

              <div className="space-y-4"
              >
                <div className="flex justify-between border-b border-white/5 pb-3"
                >
                  <span className="text-sm text-white/40"
                  >Lock Date</span>
                  <span className="text-sm font-bold text-white"
                  >{lock.date}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-3"
                >
                  <span className="text-sm text-white/40"
                  >Unlock Date</span>
                  <span className="text-sm font-bold text-white"
                  >{lock.unlockDate}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-3"
                >
                  <span className="text-sm text-white/40"
                  >Status</span>
                  <span className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-400"
                  >
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"
                    />
                    Active
                  </span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-3"
                >
                  <span className="text-sm text-white/40"
                  >Cancelable</span>
                  <span className="text-sm font-bold text-[#FF2D2D]"
                  >No</span>
                </div>
              </div>
            </div>

            <p className="mt-8 text-sm leading-7 text-white/40"
            >
              {lock.description}
            </p>

            <div className="mt-6 flex flex-wrap gap-3"
            >
              <a
                href={`https://app.streamflow.finance/contract/solana/mainnet/${lock.contract}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-6 py-3 text-sm font-bold text-emerald-400 transition hover:bg-emerald-500/20"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                Verify on Streamflow
              </a>
              <a
                href={lock.xPost}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-6 py-3 text-sm font-bold text-white/60 transition hover:bg-white/5 hover:text-white"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                View Announcement
              </a>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   BURN HISTORY
   ═══════════════════════════════════════════════════════════ */
function BurnHistory() {
  return (
    <section className="border-y border-white/5 bg-white/[0.01] px-4 py-16 sm:py-20"
    >
      <div className="mx-auto max-w-4xl"
      >
        <FadeIn>
          <div className="text-center mb-12"
          >
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#FF6B00]/60"
            >
              Supply Reduction
            </p>
            <h2 className="mt-4 text-3xl font-black text-white sm:text-4xl"
            >
              <span className="text-[#FF2D2D]"
              >{BURN_DATA.totalBurned}</span>{" "}
              $MAD Burned
            </h2>
            <p className="mt-2 text-lg font-bold text-white/40"
            >
              {BURN_DATA.burnRate} of total supply permanently removed
            </p>
          </div>
        </FadeIn>

        <div className="space-y-4"
        >
          {BURN_DATA.milestones.map((m, i) => (
            <FadeIn key={m.date} delay={i * 0.1}
            >
              <div className="flex items-center gap-4 rounded-2xl border border-white/5 bg-[#0a0a0a] p-5"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#FF2D2D]/10"
                >
                  <span className="text-lg font-black text-[#FF2D2D]"
                  >
                    {m.amount}
                  </span>
                </div>
                <div className="flex-1"
                >
                  <p className="font-black text-white"
                  >
                    {m.note}
                  </p>
                  <p className="text-sm text-white/40"
                  >
                    {m.date}
                  </p>
                </div>
                <div className="hidden sm:block"
                >
                  <span className="rounded-full border border-white/5 bg-white/[0.02] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white/30"
                  >
                    Verified
                  </span>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.4}
        >
          <div className="mt-8 text-center"
          >
            <a
              href="https://solscan.io/token/Fa7ZE9nCEYnrHsnoeHuhEExJpchtrBtKXnWe6CgHpump"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-6 py-3 text-sm font-bold text-white/60 transition hover:bg-white/5 hover:text-white"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              View Burn Wallet on Solscan
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   TRUST CHECKLIST
   ═══════════════════════════════════════════════════════════ */
function TrustChecklist() {
  const checks = [
    { label: "Dev tokens locked", status: "done", detail: "100M $MAD until Dec 2026" },
    { label: "Contract renounced", status: "done", detail: "Immutable, no admin functions" },
    { label: "Liquidity locked", status: "done", detail: "Burned LP tokens" },
    { label: "Doxxed founder", status: "done", detail: "Coffee Collects / @madrichclub_" },
    { label: "Real products", status: "done", detail: "Roblox game, merch, YouTube" },
    { label: "On-chain community support", status: "done", detail: "Normie and more" },
  ];

  return (
    <section className="px-4 py-16 sm:py-20"
    >
      <div className="mx-auto max-w-4xl"
      >
        <FadeIn>
          <div className="text-center mb-12"
          >
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#FF6B00]/60"
            >
              The $MAD Standard
            </p>
            <h2 className="mt-4 text-3xl font-black text-white sm:text-4xl"
            >
              Trust{" "}
              <span className="text-[#FF2D2D]"
              >Checklist</span>
            </h2>
          </div>
        </FadeIn>

        <div className="grid gap-3 sm:grid-cols-2"
        >
          {checks.map((check, i) => (
            <FadeIn key={check.label} delay={i * 0.05}
            >
              <div className="flex items-center gap-4 rounded-2xl border border-white/5 bg-[#0a0a0a] p-5"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/10"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5"
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>
                <div
                >
                  <p className="font-bold text-white"
                  >
                    {check.label}
                  </p>
                  <p className="text-sm text-white/40"
                  >
                    {check.detail}
                  </p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   CTA
   ═══════════════════════════════════════════════════════════ */
function CTA() {
  return (
    <section className="px-4 py-16 sm:py-20"
    >
      <div className="mx-auto max-w-3xl text-center"
      >
        <FadeIn>
          <div className="rounded-3xl border border-[#FF2D2D]/20 bg-[#FF2D2D]/[0.03] p-8 sm:p-12"
          >
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#FF6B00]/60"
            >
              The Standard
            </p>
            <h2 className="mt-4 text-3xl font-black text-white sm:text-4xl"
            >
              This is what{" "}
              <span className="text-[#FF2D2D]"
              >accountability</span>{" "}
              looks like
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-8 text-white/50"
            >
              No shadows. No hidden wallets. No promises without proof. 
              If every project operated like this, the space would be unrecognizable.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3"
            >
              <Link
                href="/community"
                className="inline-flex rounded-full bg-[#FF2D2D] px-8 py-4 text-base font-black text-white transition hover:scale-105 hover:bg-[#FF6B00]"
              >
                Community Impact →
              </Link>
              <a
                href="https://x.com/madrichclub_"
                target="_blank"
                rel="noreferrer"
                className="inline-flex rounded-full border border-white/10 bg-white/[0.03] px-8 py-4 text-base font-black text-white transition hover:bg-white/5"
              >
                Follow Updates
              </a>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════════ */
export default function TrustPage() {
  return (
    <div className="min-h-screen bg-[#050505]"
    >
      <Hero />
      <DevLock />
      <BurnHistory />
      <TrustChecklist />
      <CTA />
    </div>
  );
}
