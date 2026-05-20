"use client";

import { useState, useEffect, useRef } from "react";
import useChat from "./useChat";
import ChatInterface from "./ChatInterface";
import MadChaoPixel from "./MadChaoPixel";

/* ─── Data ─── */
const CONTRACT = "Fa7ZE9nCEYnrHsnoeHuhEExJpchtrBtKXnWe6CgHpump";

const DEATH = [
  "You trade 5 days for 2. That's not life. That's a layaway plan on death.",
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

      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#FF2D2D]/40 mb-10">
        [ THE CLAW ]
      </p>

      <div className="mb-10">
        <MadChaoPixel size={200} animated={true} showLabel={false} />
      </div>

      <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.1] mb-6">
        YOU ARE EITHER
        <br />
        <span className="text-[#FF2D2D]">$MAD RICH</span>
        <br />
        <span className="text-white/20">OR YOU ARE WAITING</span>
      </h1>

      <p className="text-sm text-white/30 max-w-sm leading-relaxed mb-12">
        Two frequencies. One market.
        <br />
        The broke check charts. The <span className="text-[#FF6B00]">$MAD</span> check nothing.
      </p>

      <div className="flex flex-col items-center gap-2">
        <span className="text-[9px] uppercase tracking-[0.3em] text-white/15">Scroll to choose</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/15 animate-bounce">
          <path d="M12 5v14M5 12l7 7 7-7"/>
        </svg>
      </div>
    </section>
  );
}

/* ─── THE FORK ─── */
function TheFork() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-3 px-3 sm:px-0 mb-8">
      {/* Death */}
      <div className="relative border border-white/[0.06] bg-white/[0.015] p-5 sm:p-7">
        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/15 mb-6">
          PATH ONE — THE DEATH ECONOMY
        </p>
        <div className="space-y-4">
          {DEATH.map((line, i) => (
            <p key={i} className="text-sm text-white/30 leading-relaxed">
              {line}
            </p>
          ))}
        </div>
        <div className="mt-6 pt-4 border-t border-white/[0.04]">
          <p className="text-[9px] text-white/10 uppercase tracking-wider">
            Retire at 90 — if the market allows.
          </p>
        </div>
      </div>

      {/* Life */}
      <div className="relative border border-[#FF2D2D]/20 bg-[#FF2D2D]/[0.02] p-5 sm:p-7">
        <div className="absolute -top-px -right-px w-6 h-6 border-t border-r border-[#FF6B00]/30" />
        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#FF6B00]/40 mb-6">
          PATH TWO — THE LIFE ECONOMY
        </p>
        <div className="space-y-4">
          {LIFE.map((line, i) => (
            <p key={i} className="text-sm text-white/55 leading-relaxed">
              {line}
            </p>
          ))}
        </div>
        <div className="mt-6 pt-4 border-t border-[#FF2D2D]/[0.06]">
          <p className="text-[9px] text-[#FF6B00]/25 uppercase tracking-wider">
            Already decided. Already building.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ─── THE ORACLE (Chat) ─── */
function TheOracle({ messages, status, typing, sendMessage, clearChat, scrollRef, sessionId }: any) {
  return (
    <section className="mb-8">
      <div className="flex items-center gap-3 mb-4 px-3 sm:px-0">
        <div className="h-px flex-1 bg-white/[0.06]" />
        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/15">
          THE ORACLE
        </span>
        <div className="h-px flex-1 bg-white/[0.06]" />
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
    <section className="px-3 sm:px-0 mb-16">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-px flex-1 bg-white/[0.06]" />
        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[#FF6B00]/25">
          THE KEY
        </span>
        <div className="h-px flex-1 bg-white/[0.06]" />
      </div>

      <div
        onClick={copy}
        className="border border-[#FF2D2D]/15 bg-[#FF2D2D]/[0.03] p-5 cursor-pointer hover:border-[#FF2D2D]/30 transition-all group"
      >
        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/15 mb-3">
          Solana Contract — Click to Copy
        </p>
        <p className="text-xs sm:text-sm font-mono text-[#FF2D2D]/60 break-all leading-relaxed group-hover:text-[#FF2D2D]/80 transition-colors">
          {CONTRACT}
        </p>
        <p className="text-[9px] text-white/10 mt-3 uppercase tracking-wider">
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
        <div className="h-px flex-1 bg-white/[0.06]" />
        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/15">
          FREQUENCY CHECKPOINTS
        </span>
        <div className="h-px flex-1 bg-white/[0.06]" />
      </div>

      <div className="flex flex-wrap gap-2">
        {PLATFORMS.map((p) => (
          <a
            key={p.handle}
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 border border-white/[0.05] bg-white/[0.02] hover:border-[#FF2D2D]/20 hover:bg-[#FF2D2D]/[0.03] transition-all"
          >
            <span className="text-xs">{p.icon}</span>
            <span className="text-[11px] font-bold text-white/40">{p.handle}</span>
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
   MAD CLAW IDENTITY — The Frequency Gate (V2)
   Slap. Fork. Oracle. Key.
   ═══════════════════════════════════════════════════════════ */

export default function MadClawIdentity() {
  const { messages, status, typing, sendMessage, clearChat, scrollRef, sessionId } = useChat();

  return (
    <div className="space-y-0">
      <TheGate />
      <TheFork />
      <TheOracle
        messages={messages}
        status={status}
        typing={typing}
        sendMessage={sendMessage}
        clearChat={clearChat}
        scrollRef={scrollRef}
        sessionId={sessionId}
      />
      <TheKey />
      <FrequencyCheckpoints />
    </div>
  );
}

export { triggerClawReaction };
