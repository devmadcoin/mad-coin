"use client";

import { useState, useEffect } from "react";

import NumerologyOracle from "./NumerologyOracle";
import MadArchetypeQuiz from "./MadArchetypeQuiz";
import FrequencyMeter from "./FrequencyMeter";
import MadBagCalculator from "./MadBagCalculator";

/* ─── Data ─── */
const CONTRACT = "Fa7ZE9nCEYnrHsnoeHuhEExJpchtrBtKXnWe6CgHpump";
const PUMPSWAP_URL = "https://jup.ag/?sell=So11111111111111111111111111111111111111112&buy=Fa7ZE9nCEYnrHsnoeHExJpchtrBtKXnWe6CgHpump";

const DEATH = [
  "Still checking charts at 3am? There's another frequency.",
  "Your 401k is BlackRock's asset. Your mortgage is their income stream. Your labor is their dividend.",
  "The system was built to keep you here. Comfortable. Predictable. Empty.",
];

const LIFE = [
  "We don't check charts at 3am. We sleep like the already-rich.",
  "Community-owned. Permissionless. Already decided.",
  "The fiction is real because we keep feeling it.",
];

const PLATFORMS = [
  { icon: "𝕏", handle: "@madrichclub_", url: "https://x.com/madrichclub_" },
  { icon: "✈️", handle: "@madrichclub", url: "https://t.me/madrichclub" },
  { icon: "🎮", handle: "Mad Phonk Awakening", url: "https://www.roblox.com/games/123392566067659/Mad-Phonk-Awakening" },
];

/* ─── THE GATE — Cinematic hero with MAD Claw background ─── */
function TheGate() {
  return (
    <section className="relative min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/mad-claw-hero.webp"
          alt=""
          className="w-full h-full object-cover object-center"
        />
        {/* Dark gradient overlay — fades from clear top to solid bottom */}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_20%,rgba(8,8,8,0.5)_50%,rgba(8,8,8,0.92)_75%,#080808_100%)]" />
      </div>

      {/* Content overlay */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 mb-8">
          [ THE CLAW ]
        </p>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.1] mb-6">
          YOU ARE EITHER
          <br />
          <span className="text-[#FF2D2D]">$MAD RICH</span>
          <br />
          <span className="text-white/20">OR YOU ARE WAITING</span>
        </h1>

        <p className="text-sm text-white/50 max-w-sm leading-relaxed mb-8 mx-auto">
          Two frequencies. One market.
          <br />
          The broke check charts. The <span className="text-[#FF6B00]">$MAD</span> check nothing.
        </p>

        {/* CONTRACT */}
        <div
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(CONTRACT);
              const el = document.getElementById('contract-flash');
              if (el) { el.style.opacity = '1'; setTimeout(() => el.style.opacity = '0', 1500); }
            } catch {}
          }}
          className="cursor-pointer group mb-8 inline-block"
        >
          <div className="border border-[#FF2D2D]/30 bg-[#FF2D2D]/[0.06] px-5 py-4 hover:border-[#FF2D2D]/50 transition-all shadow-[0_0_30px_rgba(255,45,45,0.08)]">
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#FF6B00]/70 mb-2">
              Solana Contract — Tap to Copy
            </p>
            <p className="text-xs sm:text-sm font-mono text-[#FF2D2D] break-all leading-relaxed">
              {CONTRACT}
            </p>
          </div>
          <div id="contract-flash" className="mt-2 text-center transition-opacity duration-300 opacity-0">
            <p className="text-[10px] text-[#FF6B00] font-bold uppercase tracking-wider">
              ✓ Copied — Paste into Phantom
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <span className="text-[9px] uppercase tracking-[0.3em] text-white/30">Scroll to talk to The Claw</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/15 animate-bounce">
            <path d="M12 5v14M5 12l7 7 7-7"/>
          </svg>
        </div>
      </div>
    </section>
  );
}

/* ─── THE ORACLE (Numerology) ─── */
function TheOracle() {
  return <NumerologyOracle />;
}

/* ─── THE FORK ─── */
function TheFork() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-2 px-2 sm:px-0 mb-2">
      {/* Death */}
      <div className="relative border border-white/10 bg-white/[0.02] p-3 sm:p-4 rounded-xl">
        <p className="text-[8px] font-black uppercase tracking-[0.3em] text-white/40 mb-3">
          PATH ONE — THE DEATH ECONOMY
        </p>
        <div className="space-y-2">
          {DEATH.map((line, i) => (
            <p key={i} className="text-xs text-white/50 leading-relaxed">
              {line}
            </p>
          ))}
        </div>
        <div className="mt-4 pt-3 border-t border-white/[0.06]">
          <p className="text-[8px] text-white/30 uppercase tracking-wider">
            Retire at 90 — if the market allows.
          </p>
        </div>
      </div>

      {/* Life */}
      <div className="relative border border-[#FF2D2D]/30 bg-[#FF2D2D]/[0.04] p-3 sm:p-4 rounded-xl shadow-[0_0_40px_rgba(255,45,45,0.06)]">
        <div className="absolute -top-px -right-px w-6 h-6 border-t border-r border-[#FF6B00]/50" />
        <p className="text-[8px] font-black uppercase tracking-[0.3em] text-[#FF6B00]/70 mb-3">
          PATH TWO — THE LIFE ECONOMY
        </p>
        <div className="space-y-2">
          {LIFE.map((line, i) => (
            <p key={i} className="text-xs text-white/75 leading-relaxed">
              {line}
            </p>
          ))}
        </div>
        <div className="mt-4 pt-3 border-t border-[#FF2D2D]/[0.10]">
          <p className="text-[8px] text-[#FF6B00]/50 uppercase tracking-wider">
            Already decided. Already building.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ─── THE KEY ─── */
function TheKey() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(CONTRACT);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <section className="px-2 sm:px-0 mb-2">
      <div className="flex items-center gap-2 mb-2">
        <div className="h-px flex-1 bg-white/[0.06]" />
        <span className="text-[8px] font-black uppercase tracking-[0.3em] text-[#FF6B00]/40">
          THE KEY
        </span>
        <div className="h-px flex-1 bg-white/[0.10]" />
      </div>

      <div
        onClick={copy}
        className="border border-[#FF2D2D]/25 bg-[#FF2D2D]/[0.05] p-3 cursor-pointer hover:border-[#FF2D2D]/40 transition-all group rounded-xl"
      >
        <p className="text-[8px] font-black uppercase tracking-[0.3em] text-white/40 mb-2">
          Solana Contract — Click to Copy
        </p>
        <p className="text-xs sm:text-sm font-mono text-[#FF2D2D]/90 break-all leading-relaxed group-hover:text-[#FF2D2D] transition-colors">
          {CONTRACT}
        </p>
        <p className="text-[8px] text-white/30 mt-2 uppercase tracking-wider">
          {copied ? "✓ Copied to clipboard" : "Copy and paste into Phantom or your wallet"}
        </p>
      </div>
    </section>
  );
}

/* ─── FREQUENCY CHECKPOINTS ─── */
function FrequencyCheckpoints() {
  return (
    <section className="px-2 sm:px-0 pb-3">
      <div className="flex items-center gap-2 mb-2">
        <div className="h-px flex-1 bg-white/[0.06]" />
        <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white/30">
          FREQUENCY CHECKPOINTS
        </span>
        <div className="h-px flex-1 bg-white/[0.10]" />
      </div>

      <div className="flex flex-wrap gap-1.5">
        {PLATFORMS.map((p) => (
          <a
            key={p.handle}
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-2 py-1.5 border border-white/[0.08] bg-white/[0.03] hover:border-[#FF2D2D]/25 hover:bg-[#FF2D2D]/[0.04] transition-all rounded-lg"
          >
            <span className="text-[10px]">{p.icon}</span>
            <span className="text-[10px] font-bold text-white/60">{p.handle}</span>
          </a>
        ))}
      </div>
    </section>
  );
}

/* ─── Trigger reaction (for external use) ─── */
function triggerClawReaction() {
  window.dispatchEvent(new CustomEvent("madclaw-react"));
}

/* ═══════════════════════════════════════════════════════════
   MAD CLAW IDENTITY — The Frequency Gate (V4 / Dark Theme)
   Gate → Oracle → Calculator → Fork → Key → Checkpoints
   ═══════════════════════════════════════════════════════════ */

export default function MadClawIdentity() {
  return (
    <div className="space-y-0">
      <TheGate />
      {/* Content below hero on dark background */}
      <div className="bg-[#0a0a0a] relative z-10">
        <div className="mx-auto max-w-5xl px-2 sm:px-4 pb-2 pt-1 sm:pt-2">
          <TheOracle />
          <MadArchetypeQuiz />
          <FrequencyMeter />
          <MadBagCalculator />
          <TheFork />
          <TheKey />
          <FrequencyCheckpoints />
        </div>
      </div>
    </div>
  );
}

export { triggerClawReaction };
