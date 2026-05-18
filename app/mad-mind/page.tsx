"use client";

import MadClawIdentity from "./components/MadClawIdentity";

/* ─── Scanlines (Matrix aesthetic) ─── */
function Scanlines() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[100] opacity-[0.03]"
      style={{
        backgroundImage: "linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)",
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
          className="absolute rounded-full bg-red-500/10 blur-sm"
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
   MAD MIND — Meet Your AI
   The one place to talk to the Claw.
   ═══════════════════════════════════════════════════════════ */

export default function MadMindPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#030303] text-white">
      <Scanlines />
      <FloatingParticles />
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(255,0,0,0.12),transparent_35%),radial-gradient(circle_at_80%_20%,rgba(255,40,0,0.05),transparent_30%),linear-gradient(180deg,#070707,#020202)]" />

      <main className="mx-auto max-w-3xl px-4 pb-24 pt-6 sm:px-6">
        <div className="h-12" />
        <MadClawIdentity />
      </main>
    </div>
  );
}
