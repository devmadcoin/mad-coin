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
        {/* Distribution Rules — 1M Market Cap Milestone */}
        <SectionShell className="p-6 sm:p-10">
          <div className="text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.34em] text-[#8B7355]">
              Milestone Reward
            </p>
            <h2 className="mt-3 text-2xl font-black text-[#1a1a1a] sm:text-3xl">
              1M Market Cap <span className="text-[#FF2D2D]">Distribution</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-8 text-[#1a1a1a]/55">
              When $MAD hits 1M market cap on DEX, the rewards unlock. Original holders and active community members get rewarded.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-[1.4rem] border border-[#1a1a1a]/10 bg-white p-6 sm:p-8">
              <div className="mb-4">
                <p className="text-3xl font-black text-[#FF2D2D]">50K</p>
                <p className="text-sm font-black text-[#1a1a1a]">$MAD Tokens</p>
              </div>
              <p className="text-sm text-[#1a1a1a]/55">
                Distributed to <span className="font-bold text-[#1a1a1a]">30 original holders</span> who believed from day one.
              </p>
              <div className="mt-4 inline-flex rounded-full bg-[#FF2D2D]/10 px-3 py-1 text-[10px] font-bold text-[#FF2D2D]">
                ~1,667 $MAD per holder
              </div>
            </div>
            <div className="rounded-[1.4rem] border border-[#1a1a1a]/10 bg-white p-6 sm:p-8">
              <div className="mb-4">
                <p className="text-3xl font-black text-[#FF2D2D]">25K</p>
                <p className="text-sm font-black text-[#1a1a1a]">$MAD Tokens</p>
              </div>
              <p className="text-sm text-[#1a1a1a]/55">
                Distributed to <span className="font-bold text-[#1a1a1a]">20 active holders</span> who keep the community alive.
              </p>
              <div className="mt-4 inline-flex rounded-full bg-[#FF2D2D]/10 px-3 py-1 text-[10px] font-bold text-[#FF2D2D]">
                ~1,250 $MAD per holder
              </div>
            </div>
          </div>
        </SectionShell>

        {/* Hero */}
        <SectionShell className="mt-8 p-6 sm:p-10 lg:p-14">
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
