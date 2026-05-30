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

        {/* Placeholder for reward tiers */}
        <SectionShell className="mt-8 p-6 sm:p-10">
          <div className="text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.34em] text-[#8B7355]">
              Reward Tiers
            </p>
            <h2 className="mt-3 text-2xl font-black text-[#1a1a1a] sm:text-3xl">
              The <span className="text-[#FF2D2D]">$MAD</span> Tiers
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-8 text-[#1a1a1a]/55">
              Different levels of commitment unlock different rewards. From
              stickers and merch to exclusive events and airdrops.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                tier: "Bronze",
                label: "Holder",
                desc: "Hold any amount of $MAD. Access to community channels and basic perks.",
                perks: ["Community Access", "Sticker Discounts", "Voting Rights"],
              },
              {
                tier: "Silver",
                label: "Believer",
                desc: "Hold 1M+ $MAD. Unlock merch drops, early product access, and more.",
                perks: ["Merch Early Access", "Exclusive Drops", "Priority Support"],
              },
              {
                tier: "Gold",
                label: "Conviction",
                desc: "Hold 10M+ $MAD. Real-world rewards, events, and direct dev access.",
                perks: ["Event Invites", "Airdrop Eligibility", "1-on-1 Dev Chat"],
              },
            ].map((item) => (
              <div
                key={item.tier}
                className="rounded-[1.4rem] border border-[#1a1a1a]/10 bg-white p-6 sm:p-8 transition-all hover:border-[#FF2D2D]/20"
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#FF2D2D]/20 bg-[#FF2D2D]/10 text-sm font-black text-[#FF2D2D]">
                    {item.tier[0]}
                  </div>
                  <div>
                    <p className="text-sm font-black text-[#1a1a1a]">{item.tier}</p>
                    <p className="text-[10px] text-[#1a1a1a]/40">{item.label}</p>
                  </div>
                </div>
                <p className="text-sm leading-7 text-[#1a1a1a]/55">{item.desc}</p>
                <ul className="mt-4 space-y-2">
                  {item.perks.map((perk) => (
                    <li
                      key={perk}
                      className="flex items-center gap-2 text-sm text-[#1a1a1a]/60"
                    >
                      <span className="text-emerald-600">✓</span> {perk}
                    </li>
                  ))}
                </ul>
              </div>
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
