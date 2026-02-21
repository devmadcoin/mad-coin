"use client";

import IdentityForge from "../components/IdentityForge";

export default function ForgePage() {
  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,0,60,0.22),transparent_55%),radial-gradient(circle_at_80%_40%,rgba(255,80,0,0.18),transparent_60%),radial-gradient(circle_at_50%_90%,rgba(255,0,0,0.14),transparent_55%)]" />

      <div className="relative mx-auto max-w-6xl px-6 pt-16 pb-24">
        {/* ✅ Removed PHASE 2 line */}

        <h1 className="mt-6 text-6xl font-black tracking-tight sm:text-7xl">
          Identity{" "}
          <span className="text-red-500 drop-shadow-[0_0_12px_rgba(255,0,0,0.6)]">
            Forge
          </span>
        </h1>

        <div className="mt-10">
          <IdentityForge />
        </div>
      </div>
    </div>
  );
}
