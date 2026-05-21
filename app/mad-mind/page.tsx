"use client";

import MadClawIdentity from "./components/MadClawIdentity";

/* ─── Scanlines (subtle on crème) ─── */
function Scanlines() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[100] opacity-[0.02]"
      style={{
        backgroundImage: "linear-gradient(to bottom, rgba(0,0,0,0.03) 1px, transparent 1px)",
        backgroundSize: "100% 3px",
      }}
    />
  );
}

/* ─── Floating Particles (ambient) ─── */
function FloatingParticles() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-[#FF2D2D]/10 blur-sm"
          style={{
            width: `${Math.random() * 4 + 2}px`,
            height: `${Math.random() * 4 + 2}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `floatUp ${Math.random() * 4 + 4}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAD MIND — The Frequency Gate
   You are either $MAD or you are waiting.

   V4: Venetian crème theme. Deployed 2026-05-21.
   ═══════════════════════════════════════════════════════════ */

export default function MadMindPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#F5F1E8] text-[#1a1a1a]">
      <Scanlines />
      <FloatingParticles />
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(255,45,45,0.06),transparent_35%),radial-gradient(circle_at_80%_20%,rgba(255,107,0,0.04),transparent_30%),linear-gradient(180deg,#F5F1E8,#F0EDE3)]" />

      <main className="mx-auto max-w-5xl px-3 sm:px-4 pb-8 pt-4 sm:pt-6">
        <div className="h-4 sm:h-6" />
        <MadClawIdentity />
      </main>
    </div>
  );
}
