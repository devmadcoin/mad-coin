"use client";

import MadClawIdentity from "./components/MadClawIdentity";

/* ═══════════════════════════════════════════════════════════
   MAD MIND — Meet Your AI
   The one place to talk to the Claw.
   ═══════════════════════════════════════════════════════════ */

export default function MadMindPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#050505", color: "#fff", display: "flex", flexDirection: "column", alignItems: "center", padding: "24px 16px" }}>
      <MadClawIdentity />
    </main>
  );
}
