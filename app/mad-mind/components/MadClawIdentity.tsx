"use client";

import { useState, Suspense, lazy } from "react";

const MadChao3D = lazy(() => import("./MadChao3D"));
import useChat from "./useChat";
import ChatInterface from "./ChatInterface";

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

/* ─── THE GATE ─── */
function TheGate() {
  return (
    <section className="relative min-h-[90dvh] flex flex-col items-center justify-center text-center px-4">
      {/* Ambient glow */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#FF2D2D]/[0.04] blur-[150px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-[#FF6B00]/[0.06] blur-[100px]" />
      </div>

      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#FF2D2D]/70 mb-10">
        [ THE CLAW ]
      </p>

      <div className="mb-6 w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] mx-auto">
        <Suspense fallback={
          <div className="w-full h-full flex items-center justify-center">
            <div className="animate-pulse text-[#FF2D2D]/30 text-xs font-bold uppercase tracking-wider">Loading 3D...</div>
          </div>
        }>
          <MadChao3D />
        </Suspense>
      </div>

      <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#1a1a1a] leading-[1.1] mb-6">
        YOU ARE EITHER
        <br />
        <span className="text-[#FF2D2D]">$MAD RICH</span>
        <br />
        <span className="text-[#1a1a1a]/20">OR YOU ARE WAITING</span>
      </h1>

      <p className="text-sm text-[#1a1a1a]/50 max-w-sm leading-relaxed mb-8">
        Two frequencies. One market.
        <br />
        The broke check charts. The <span className="text-[#FF6B00]">$MAD</span> check nothing.
      </p>

      {/* CONTRACT — One tap copy, zero friction */}
      <div
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(CONTRACT);
            const el = document.getElementById('contract-flash');
            if (el) { el.style.opacity = '1'; setTimeout(() => el.style.opacity = '0', 1500); }
          } catch {}
        }}
        className="cursor-pointer group mb-8"
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

      {/* Jupiter link for people who want swap UI */}
      <a
        href={PUMPSWAP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[10px] text-[#1a1a1a]/40 hover:text-[#1a1a1a]/60 uppercase tracking-wider transition-colors mb-8"
      >
        Or swap on Jupiter →
      </a>

      <div className="flex flex-col items-center gap-2">
        <span className="text-[9px] uppercase tracking-[0.3em] text-[#1a1a1a]/30">Scroll to talk to The Claw</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#1a1a1a]/15 animate-bounce">
          <path d="M12 5v14M5 12l7 7 7-7"/>
        </svg>
      </div>
    </section>
  );
}

/* ─── THE ORACLE (Chat) ─── */
function TheOracle({ messages, status, typing, sendMessage, clearChat, scrollRef, sessionId }: any) {
  return (
    <section className="mb-8">
      <div className="flex items-center gap-3 mb-4 px-3 sm:px-0">
        <div className="h-px flex-1 bg-[#1a1a1a]/[0.06]" />
        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[#1a1a1a]/40">
          THE ORACLE
        </span>
        <div className="h-px flex-1 bg-[#1a1a1a]/[0.10]" />
      </div>

      <ChatInterface
        messages={messages}
        status={status}
        typing={typing}
        sendMessage={sendMessage}
        clearChat={clearChat}
        scrollRef={scrollRef}
        sessionId={sessionId}
      />
    </section>
  );
}

/* ─── THE FORK ─── */
function TheFork() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-3 px-3 sm:px-0 mb-8">
      {/* Death */}
      <div className="relative border border-[#1a1a1a]/[0.10] bg-[#1a1a1a]/[0.02] p-5 sm:p-7">
        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#1a1a1a]/40 mb-6">
          PATH ONE — THE DEATH ECONOMY
        </p>
        <div className="space-y-4">
          {DEATH.map((line, i) => (
            <p key={i} className="text-sm text-[#1a1a1a]/50 leading-relaxed">
              {line}
            </p>
          ))}
        </div>
        <div className="mt-6 pt-4 border-t border-[#1a1a1a]/[0.06]">
          <p className="text-[9px] text-[#1a1a1a]/30 uppercase tracking-wider">
            Retire at 90 — if the market allows.
          </p>
        </div>
      </div>

      {/* Life */}
      <div className="relative border border-[#FF2D2D]/30 bg-[#FF2D2D]/[0.04] p-5 sm:p-7 shadow-[0_0_40px_rgba(255,45,45,0.06)]">
        <div className="absolute -top-px -right-px w-6 h-6 border-t border-r border-[#FF6B00]/50" />
        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#FF6B00]/70 mb-6">
          PATH TWO — THE LIFE ECONOMY
        </p>
        <div className="space-y-4">
          {LIFE.map((line, i) => (
            <p key={i} className="text-sm text-[#1a1a1a]/75 leading-relaxed">
              {line}
            </p>
          ))}
        </div>
        <div className="mt-6 pt-4 border-t border-[#FF2D2D]/[0.10]">
          <p className="text-[9px] text-[#FF6B00]/50 uppercase tracking-wider">
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
    <section className="px-3 sm:px-0 mb-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-px flex-1 bg-[#1a1a1a]/[0.06]" />
        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[#FF6B00]/60">
          THE KEY
        </span>
        <div className="h-px flex-1 bg-[#1a1a1a]/[0.10]" />
      </div>

      <div
        onClick={copy}
        className="border border-[#FF2D2D]/25 bg-[#FF2D2D]/[0.05] p-5 cursor-pointer hover:border-[#FF2D2D]/40 transition-all group"
      >
        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#1a1a1a]/40 mb-3">
          Solana Contract — Click to Copy
        </p>
        <p className="text-xs sm:text-sm font-mono text-[#FF2D2D]/90 break-all leading-relaxed group-hover:text-[#FF2D2D] transition-colors">
          {CONTRACT}
        </p>
        <p className="text-[9px] text-[#1a1a1a]/30 mt-3 uppercase tracking-wider">
          {copied ? "✓ Copied to clipboard" : "Copy and paste into Phantom or your wallet"}
        </p>
      </div>
    </section>
  );
}

/* ─── FREQUENCY CHECKPOINTS ─── */
function FrequencyCheckpoints() {
  return (
    <section className="px-3 sm:px-0 pb-12">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-px flex-1 bg-[#1a1a1a]/[0.06]" />
        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[#1a1a1a]/40">
          FREQUENCY CHECKPOINTS
        </span>
        <div className="h-px flex-1 bg-[#1a1a1a]/[0.10]" />
      </div>

      <div className="flex flex-wrap gap-2">
        {PLATFORMS.map((p) => (
          <a
            key={p.handle}
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 border border-[#1a1a1a]/[0.08] bg-[#1a1a1a]/[0.03] hover:border-[#FF2D2D]/25 hover:bg-[#FF2D2D]/[0.04] transition-all"
          >
            <span className="text-xs">{p.icon}</span>
            <span className="text-[11px] font-bold text-[#1a1a1a]/60">{p.handle}</span>
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
   MAD CLAW IDENTITY — The Frequency Gate (V3 / CT Optimized)
   Gate → Buy → Oracle → Fork → Key → Checkpoints
   ═══════════════════════════════════════════════════════════ */

export default function MadClawIdentity() {
  const { messages, status, typing, sendMessage, clearChat, scrollRef, sessionId } = useChat();

  return (
    <div className="space-y-0">
      <TheGate />
      <TheOracle
        messages={messages}
        status={status}
        typing={typing}
        sendMessage={sendMessage}
        clearChat={clearChat}
        scrollRef={scrollRef}
        sessionId={sessionId}
      />
      <TheFork />
      <TheKey />
      <FrequencyCheckpoints />
    </div>
  );
}

export { triggerClawReaction };
