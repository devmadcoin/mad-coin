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

   V5: Cinematic hero with MAD Claw background. Deployed 2026-05-23.
   ═══════════════════════════════════════════════════════════ */

export default function MadMindPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#F5F1E8] text-[#1a1a1a]">
      <Scanlines />
      <FloatingParticles />

      <main>
        <MadClawIdentity />
      </main>
    </div>
  );
}
