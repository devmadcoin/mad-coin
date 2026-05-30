"use client";

import Image from "next/image";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function SectionShell({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "overflow-hidden rounded-[2rem] border border-[#1a1a1a]/10 bg-[#1a1a1a]/[0.02] shadow-[0_18px_50px_rgba(0,0,0,0.06)]",
        className,
      )}
    >
      {children}
    </section>
  );
}

function Pill({
  children,
  tone = "default",
}: {
  children: React.ReactNode;
  tone?: "default" | "red" | "green";
}) {
  return (
    <div
      className={cn(
        "rounded-full px-4 py-2 text-[11px] font-black uppercase tracking-[0.24em]",
        tone === "red" && "border border-[#FF2D2D]/25 bg-[#FF2D2D]/10 text-[#FF2D2D]",
        tone === "green" &&
          "border border-emerald-400/20 bg-emerald-500/10 text-emerald-600",
        tone === "default" &&
          "border border-[#1a1a1a]/10 bg-[#1a1a1a]/[0.03] text-[#1a1a1a]/60",
      )}
    >
      {children}
    </div>
  );
}

export default function RewardsPage() {
  return (
    <div className="relative overflow-hidden bg-[#F5F1E8] text-[#1a1a1a]">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_50%_20%,rgba(255,45,45,0.04),transparent_50%)]" />

      <div className="relative mx-auto max-w-7xl px-4 pb-24 pt-8 sm:px-6 lg:px-8">
        {/* Hero */}
        <SectionShell className="p-6 sm:p-10 lg:p-14">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.34em] text-[#FF2D2D]/60">
              Coming Soon
            </p>
            <h1 className="mt-4 text-4xl font-black leading-[0.95] tracking-tight text-[#1a1a1a] sm:text-6xl">
              $MAD{" "}
              <span className="text-[#FF2D2D] drop-shadow-[0_0_14px_rgba(255,45,45,0.25)]">
                Rewards
              </span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-[#1a1a1a]/55 sm:text-lg">
              Loyalty gets rewarded. Holders who stay $MAD unlock exclusive perks,
              early access, and real-world benefits. The longer you hold, the more
              you earn.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Pill tone="red">Holder Benefits</Pill>
              <Pill tone="green">Early Access</Pill>
              <Pill>Exclusive Perks</Pill>
            </div>
          </div>
        </SectionShell>

        {/* ═══════════════════════════════════════════════════════════
            REWARD MILESTONES — Chart Ascending to $100M
            ═══════════════════════════════════════════════════════════ */}
        <SectionShell className="mt-8 p-6 sm:p-10">
          <div className="text-center mb-10">
            <p className="text-[11px] font-bold uppercase tracking-[0.34em] text-[#8B7355]">
              The Road Up
            </p>
            <h2 className="mt-3 text-2xl font-black text-[#1a1a1a] sm:text-3xl">
              Reward <span className="text-[#FF2D2D]">Milestones</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-[#1a1a1a]/55">
              Every milestone unlocks a reward. The chart only goes up — the question is how fast you hold.
            </p>
          </div>

          {/* Chart container */}
          <div className="relative max-w-3xl mx-auto">
            {/* Vertical line connecting milestones */}
            <div className="absolute left-[24px] sm:left-[32px] top-0 bottom-0 w-0.5 bg-[#1a1a1a]/10" />

            {/* === CURRENT POSITION === */}
            <div className="relative mb-8">
              <div className="absolute left-[18px] sm:left-[26px] top-5 z-10 h-3 w-3 rounded-full bg-[#FF6B00] ring-4 ring-[#FF6B00]/20 animate-pulse" />

              <div className="ml-14 sm:ml-20 rounded-[1.4rem] border border-[#FF6B00]/30 bg-[#FF6B00]/[0.04] p-5 sm:p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="inline-flex rounded-full bg-[#FF6B00]/10 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-[#FF6B00]">
                    Now
                  </span>
                  <p className="text-[11px] font-bold uppercase tracking-[0.34em] text-[#8B7355]">
                    Current Position
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <h3 className="text-xl font-black text-[#1a1a1a]">
                    $200K Market Cap
                  </h3>
                </div>

                {/* Progress bar to $1M */}
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-[#1a1a1a]/40">Progress to $1M</span>
                    <span className="text-[10px] font-black text-[#FF6B00]">20%</span>
                  </div>
                  <div className="h-2 rounded-full bg-[#1a1a1a]/[0.06] overflow-hidden">
                    <div className="h-full rounded-full bg-[#FF6B00] w-[20%] shadow-[0_0_10px_rgba(255,107,0,0.3)]" />
                  </div>
                </div>

                <p className="mt-3 text-xs text-[#1a1a1a]/50">
                  📈 +4.58% today · 582 buys vs 178 sells · 70 traders active
                </p>
              </div>
            </div>

            {/* === 1M — ACTIVE === */}
            <div className="relative mb-8">
              {/* Dot on the line */}
              <div className="absolute left-[18px] sm:left-[26px] top-6 z-10 h-3 w-3 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20" />
              
              <div className="ml-14 sm:ml-20 rounded-[1.4rem] border border-emerald-500/30 bg-white p-5 sm:p-6 shadow-[0_0_20px_rgba(16,185,129,0.06)]">
                <div className="flex items-center gap-3 mb-4">
                  <span className="inline-flex rounded-full bg-emerald-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-600">
                    Unlocked
                  </span>
                  <p className="text-[11px] font-bold uppercase tracking-[0.34em] text-[#8B7355]">
                    Phase 1
                  </p>
                </div>
                <h3 className="text-xl font-black text-[#1a1a1a]">
                  $1M Market Cap <span className="text-emerald-500">Distribution</span>
                </h3>
                <p className="mt-2 text-sm text-[#1a1a1a]/55 leading-relaxed">
                  When $MAD hits $1M market cap and holds for <span className="font-bold text-[#1a1a1a]">12 hours</span>, 2M $MAD tokens distributed to 50 eligible holders.
                </p>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="rounded-xl border border-[#1a1a1a]/10 bg-[#F5F1E8] p-4">
                    <p className="text-2xl font-black text-[#FF2D2D]">50K</p>
                    <p className="text-xs font-bold text-[#1a1a1a]">$MAD Each</p>
                    <p className="mt-1 text-xs text-[#1a1a1a]/50">30 OG holders randomly selected</p>
                  </div>
                  <div className="rounded-xl border border-[#1a1a1a]/10 bg-[#F5F1E8] p-4">
                    <p className="text-2xl font-black text-[#FF2D2D]">25K</p>
                    <p className="text-xs font-bold text-[#1a1a1a]">$MAD Each</p>
                    <p className="mt-1 text-xs text-[#1a1a1a]/50">20 new holders randomly selected</p>
                  </div>
                </div>

                <div className="mt-4 rounded-xl border border-[#FF2D2D]/15 bg-[#FF2D2D]/[0.03] p-4">
                  <p className="text-xs font-bold text-[#1a1a1a] mb-2">Eligibility</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#1a1a1a]/55">
                    <p>✅ Hold at least <span className="font-bold text-[#1a1a1a]">50K $MAD</span></p>
                    <p>✅ Hold for <span className="font-bold text-[#1a1a1a]">12 hours</span> after 1M MC</p>
                  </div>
                </div>
              </div>
            </div>

            {/* === 10M — LOCKED === */}
            <div className="relative mb-8">
              <div className="absolute left-[18px] sm:left-[26px] top-5 z-10 h-3 w-3 rounded-full bg-[#1a1a1a]/20 ring-4 ring-[#1a1a1a]/5" />
              
              <div className="ml-14 sm:ml-20 rounded-[1.4rem] border border-[#1a1a1a]/10 bg-[#1a1a1a]/[0.02] p-5 sm:p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="inline-flex rounded-full bg-[#1a1a1a]/10 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-[#1a1a1a]/40">
                    Locked
                  </span>
                  <p className="text-[11px] font-bold uppercase tracking-[0.34em] text-[#1a1a1a]/30">
                    Phase 2
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <h3 className="text-xl font-black text-[#1a1a1a]/30">
                    $10M Market Cap
                  </h3>
                  <div className="h-10 w-10 rounded-full border border-[#1a1a1a]/10 bg-[#1a1a1a]/[0.03] flex items-center justify-center">
                    <span className="text-lg font-black text-[#1a1a1a]/30">?</span>
                  </div>
                </div>
                <p className="mt-2 text-sm text-[#1a1a1a]/30">
                  Bigger milestone. Bigger reward. Stay $MAD to find out.
                </p>
              </div>
            </div>

            {/* === 25M — LOCKED === */}
            <div className="relative mb-8">
              <div className="absolute left-[18px] sm:left-[26px] top-5 z-10 h-3 w-3 rounded-full bg-[#1a1a1a]/20 ring-4 ring-[#1a1a1a]/5" />
              
              <div className="ml-14 sm:ml-20 rounded-[1.4rem] border border-[#1a1a1a]/10 bg-[#1a1a1a]/[0.02] p-5 sm:p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="inline-flex rounded-full bg-[#1a1a1a]/10 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-[#1a1a1a]/40">
                    Locked
                  </span>
                  <p className="text-[11px] font-bold uppercase tracking-[0.34em] text-[#1a1a1a]/30">
                    Phase 3
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <h3 className="text-xl font-black text-[#1a1a1a]/30">
                    $25M Market Cap
                  </h3>
                  <div className="h-10 w-10 rounded-full border border-[#1a1a1a]/10 bg-[#1a1a1a]/[0.03] flex items-center justify-center">
                    <span className="text-lg font-black text-[#1a1a1a]/30">?</span>
                  </div>
                </div>
                <p className="mt-2 text-sm text-[#1a1a1a]/30">
                  The rewards get serious. The community gets rewarded.
                </p>
              </div>
            </div>

            {/* === 50M — LOCKED === */}
            <div className="relative mb-8">
              <div className="absolute left-[18px] sm:left-[26px] top-5 z-10 h-3 w-3 rounded-full bg-[#1a1a1a]/20 ring-4 ring-[#1a1a1a]/5" />
              
              <div className="ml-14 sm:ml-20 rounded-[1.4rem] border border-[#1a1a1a]/10 bg-[#1a1a1a]/[0.02] p-5 sm:p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="inline-flex rounded-full bg-[#1a1a1a]/10 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-[#1a1a1a]/40">
                    Locked
                  </span>
                  <p className="text-[11px] font-bold uppercase tracking-[0.34em] text-[#1a1a1a]/30">
                    Phase 4
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <h3 className="text-xl font-black text-[#1a1a1a]/30">
                    $50M Market Cap
                  </h3>
                  <div className="h-10 w-10 rounded-full border border-[#1a1a1a]/10 bg-[#1a1a1a]/[0.03] flex items-center justify-center">
                    <span className="text-lg font-black text-[#1a1a1a]/30">?</span>
                  </div>
                </div>
                <p className="mt-2 text-sm text-[#1a1a1a]/30">
                  Halfway to the dream. The reward reflects the journey.
                </p>
              </div>
            </div>

            {/* === 75M — LOCKED === */}
            <div className="relative mb-8">
              <div className="absolute left-[18px] sm:left-[26px] top-5 z-10 h-3 w-3 rounded-full bg-[#1a1a1a]/20 ring-4 ring-[#1a1a1a]/5" />
              
              <div className="ml-14 sm:ml-20 rounded-[1.4rem] border border-[#1a1a1a]/10 bg-[#1a1a1a]/[0.02] p-5 sm:p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="inline-flex rounded-full bg-[#1a1a1a]/10 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-[#1a1a1a]/40">
                    Locked
                  </span>
                  <p className="text-[11px] font-bold uppercase tracking-[0.34em] text-[#1a1a1a]/30">
                    Phase 5
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <h3 className="text-xl font-black text-[#1a1a1a]/30">
                    $75M Market Cap
                  </h3>
                  <div className="h-10 w-10 rounded-full border border-[#1a1a1a]/10 bg-[#1a1a1a]/[0.03] flex items-center justify-center">
                    <span className="text-lg font-black text-[#1a1a1a]/30">?</span>
                  </div>
                </div>
                <p className="mt-2 text-sm text-[#1a1a1a]/30">
                  The community is massive. The reward is legendary.
                </p>
              </div>
            </div>

            {/* === 100M — LOCKED === */}
            <div className="relative">
              <div className="absolute left-[18px] sm:left-[26px] top-5 z-10 h-3 w-3 rounded-full bg-[#FF2D2D]/30 ring-4 ring-[#FF2D2D]/10" />
              
              <div className="ml-14 sm:ml-20 rounded-[1.4rem] border border-[#FF2D2D]/20 bg-[#FF2D2D]/[0.03] p-5 sm:p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="inline-flex rounded-full bg-[#FF2D2D]/10 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-[#FF2D2D]/60">
                    Final Goal
                  </span>
                  <p className="text-[11px] font-bold uppercase tracking-[0.34em] text-[#FF2D2D]/40">
                    Phase 6
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <h3 className="text-xl font-black text-[#FF2D2D]/50">
                    $100M Market Cap
                  </h3>
                  <div className="h-10 w-10 rounded-full border border-[#FF2D2D]/20 bg-[#FF2D2D]/[0.05] flex items-center justify-center">
                    <span className="text-lg font-black text-[#FF2D2D]/40">?</span>
                  </div>
                </div>
                <p className="mt-2 text-sm text-[#FF2D2D]/30">
                  The ultimate milestone. The ultimate reward. Are you $MAD enough to find out?
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-[#1a1a1a]/55">
              Didn't win a phase? No worries. The next milestone is always coming. <span className="font-bold text-[#FF2D2D]">Hold longer. Stay $MAD.</span>
            </p>
          </div>
        </SectionShell>

        {/* Live Tracker — Reward Wallet */}
        <section className="mt-8 overflow-hidden rounded-[2rem] border border-[#FF2D2D]/15 bg-[#111111] text-white shadow-[0_18px_50px_rgba(0,0,0,0.12)]">
          <div className="p-6 sm:p-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
                </span>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400">LIVE</span>
              </div>
              <span className="text-[10px] text-white/30 font-mono">AUTO-REFRESH 30s</span>
            </div>

            <div className="text-center">
              <p className="text-[11px] font-bold uppercase tracking-[0.34em] text-white/40">Reward Wallet Balance</p>
              <div className="mt-3 flex items-baseline justify-center gap-2">
                <span className="text-4xl sm:text-6xl font-black tracking-tight text-white">2,000,000</span>
                <span className="text-lg sm:text-2xl font-black text-[#FF2D2D]">$MAD</span>
              </div>
              <p className="mt-2 text-sm text-white/40">Initial rollout supply · 100% community funded</p>
            </div>

            <div className="mt-8 mx-auto max-w-2xl">
              <div className="rounded-[1.2rem] border border-white/10 bg-[#1a1a1a] p-5 sm:p-6">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-[0.34em] text-white/30 mb-1">Wallet Address</p>
                    <p className="text-sm font-mono text-white/60 truncate">FdWFKfUmyRFzusT4Gj77sKr1ArjJCHG7kTgw6pvbo9iW</p>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText("FdWFKfUmyRFzusT4Gj77sKr1ArjJCHG7kTgw6pvbo9iW");
                    }}
                    className="shrink-0 inline-flex items-center gap-1.5 rounded-full border border-[#FF2D2D]/30 bg-[#FF2D2D]/15 px-4 py-2 text-xs font-bold text-[#FF2D2D] transition hover:bg-[#FF2D2D]/25"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
                    Copy
                  </button>
                </div>
                <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FF2D2D]/15">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF2D2D" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
                  </div>
                  <div>
                    <p className="text-sm font-black text-white">Solana</p>
                    <p className="text-[10px] text-white/30">Verified on-chain</p>
                  </div>
                  <a
                    href="https://solscan.io/account/FdWFKfUmyRFzusT4Gj77sKr1ArjJCHG7kTgw6pvbo9iW"
                    target="_blank"
                    rel="noreferrer"
                    className="ml-auto inline-flex items-center gap-1 text-xs font-bold text-[#FF2D2D]/70 hover:text-[#FF2D2D] transition"
                  >
                    View on Solscan
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 bg-[#1a1a1a] px-6 py-3 flex items-center justify-between text-[10px] font-mono text-white/30">
            <span>Last updated: <span id="tracker-ts">just now</span></span>
            <span>Tracker v1.0</span>
          </div>
        </section>

        <script dangerouslySetInnerHTML={{__html: `
          (function(){
            const el = document.getElementById('tracker-ts');
            if(!el) return;
            const fmt = () => {
              const now = new Date();
              el.textContent = now.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit', second:'2-digit'});
            };
            fmt();
            setInterval(fmt, 30000);
          })();
        `}} />

        {/* Thank You — The MAD Fam Behind the Concept */}
        <SectionShell className="mt-8 p-6 sm:p-10">
          <div className="text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.34em] text-[#8B7355]">
              The MAD Fam
            </p>
            <h2 className="mt-3 text-2xl font-black text-[#1a1a1a] sm:text-3xl">
              Thank <span className="text-[#FF2D2D]">You</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-8 text-[#1a1a1a]/55">
              The $MAD Rewards concept was born from the community. These two holders saw the vision and helped build it from the ground up.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[
              {
                name: "crypto guru",
                handle: "@followdv80",
                image: "/rewards/crypto-guru-followdv80.png",
                href: "https://x.com/followdv80",
              },
              {
                name: "Perspective 360",
                handle: "@Derrick152667",
                image: "/rewards/perspective-360-derrick152667.png",
                href: "https://x.com/Derrick152667",
              },
            ].map((person) => (
              <a
                key={person.handle}
                href={person.href}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-4 rounded-[1.4rem] border border-[#1a1a1a]/10 bg-white p-5 transition-all hover:border-[#FF2D2D]/20"
              >
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border border-[#1a1a1a]/10">
                  <Image
                    src={person.image}
                    alt={person.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                    sizes="64px"
                  />
                </div>
                <div>
                  <p className="text-base font-black text-[#1a1a1a]">{person.name}</p>
                  <p className="text-sm text-[#1a1a1a]/50">{person.handle}</p>
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-[#FF2D2D]/70">
                    Concept Creator
                  </p>
                </div>
                <div className="ml-auto text-[#1a1a1a]/30 transition-colors group-hover:text-[#FF2D2D]">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </div>
              </a>
            ))}
          </div>
        </SectionShell>

        {/* CTA */}
        <SectionShell className="mt-8 overflow-hidden p-0">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="flex flex-col justify-center p-6 sm:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#FF2D2D]/60">
                Get Started
              </p>
              <h2 className="mt-4 text-3xl font-black leading-[0.95] text-[#1a1a1a] sm:text-4xl">
                Join the $MAD Movement
              </h2>
              <p className="mt-5 max-w-xl text-base leading-8 text-[#1a1a1a]/55">
                Hold $MAD. Stay $MAD. Get rewarded. The program launches soon —
                position yourself now.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="https://jup.ag/swap?sell=So11111111111111111111111111111111111111112&buy=Fa7ZE9nCEYnrHsnoeHuhEExJpchtrBtKXnWe6CgHpump"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex rounded-full border border-[#FF2D2D]/40 bg-[#FF2D2D] px-7 py-4 text-base font-black text-white transition hover:scale-[1.02] hover:bg-[#FF6B00]"
                >
                  Buy $MAD →
                </a>
                <a
                  href="https://t.me/MadRichClub"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex rounded-full border border-[#1a1a1a]/15 bg-[#1a1a1a]/[0.02] px-7 py-4 text-base font-black text-[#1a1a1a]/75 transition hover:border-[#1a1a1a]/20 hover:bg-[#1a1a1a]/[0.04]"
                >
                  Join Telegram
                </a>
              </div>
            </div>
            <div className="relative min-h-[280px] sm:min-h-[360px] lg:min-h-full">
              <Image
                src="/mad.png"
                alt="$MAD Logo"
                fill
                className="object-contain p-10"
              />
            </div>
          </div>
        </SectionShell>
      </div>
    </div>
  );
}
