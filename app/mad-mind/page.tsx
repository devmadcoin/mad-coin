"use client";

import Link from "next/link";
import Image from "next/image";
import MadClawIdentity from "./components/MadClawIdentity";

const CA = "Fa7ZE9nCEYnrHsnoeHuhEExJpchtrBtKXnWe6CgHpump";
const LINKS = {
  telegram: "https://t.me/MadRichClub",
  x: "https://x.com/madrichclub_",
  instagram: "https://www.instagram.com/madrichclub/",
  tiktok: "https://www.tiktok.com/@madrichclub",
};

/* ─── Scanlines ─── */
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

/* ─── Navbar (matches homepage) ─── */
function Navbar() {
  const links = [
    { label: "Home", href: "/" },
    { label: "MAD AI", href: "/mad-mind", active: true },
    { label: "Roadmap", href: "/roadmap" },
    { label: "Game", href: "/game" },
    { label: "MAD Art", href: "/mad-art" },
    { label: "Rewards", href: "/rewards" },
    { label: "Merch", href: "/merch" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#080808]/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#FF2D2D] flex items-center justify-center text-white font-black text-sm">M</div>
          <span className="text-white font-black text-sm tracking-tight">$MAD</span>
        </Link>
        <div className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <Link key={l.label} href={l.href}
              className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-all ${
                l.active
                  ? "bg-[#FF2D2D]/10 text-[#FF2D2D]"
                  : "text-white/40 hover:text-white hover:bg-white/5"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAD MIND — The Frequency Gate
   ═══════════════════════════════════════════════════════════ */

export default function MadMindPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#080808] text-white">
      <Scanlines />
      <Navbar />

      <main className="pt-14">
        <MadClawIdentity />
      </main>

      <Disclaimer />
      <Footer />
    </div>
  );
}

/* ─── Disclaimer ─── */
function Disclaimer() {
  return (
    <section className="px-4 sm:px-6 py-10 bg-[#080808] border-t border-white/5">
      <div className="max-w-3xl mx-auto">
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-center">
          <p className="text-xs text-white/50 leading-relaxed">
            ⚠️ <span className="font-bold text-white/70">$MAD is a memecoin for entertainment purposes only.</span> Not financial advice. Always DYOR. 
            The MAD FAM is a community — not a company, not a guarantee, not a promise. 
            Tokens may go up, down, or sideways. Never invest more than you can afford to lose.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ─── Footer (matches homepage) ─── */
function Footer() {
  const socials = [
    { label: "Telegram", href: LINKS.telegram },
    { label: "X", href: LINKS.x },
    { label: "Instagram", href: LINKS.instagram },
    { label: "TikTok", href: LINKS.tiktok },
  ];

  return (
    <footer className="border-t border-white/5 px-4 sm:px-6 py-12 bg-[#080808]">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-[#FF2D2D] flex items-center justify-center text-white font-black text-sm">M</div>
            <div>
              <span className="text-white font-black text-lg tracking-tight">$MAD</span>
              <span className="block text-white/20 text-[9px] tracking-[0.3em] uppercase font-bold">A Next-Gen Entertainment Company</span>
            </div>
          </div>
          <p className="text-xs text-white/30 leading-relaxed max-w-xs">
            The MAD FAM is a global community building the future of entertainment through games, animation, AI, and culture.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {socials.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noreferrer"
              className="px-3 py-1.5 rounded-full border border-white/5 text-[10px] font-bold uppercase tracking-wider text-white/30 hover:text-white hover:border-white/10 transition-all"
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>
      <div className="max-w-6xl mx-auto mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-[10px] text-white/15">Public. Real. Building in the open.</p>
        <p className="text-[10px] text-white/15 font-mono">{CA.slice(0, 12)}...{CA.slice(-4)}</p>
      </div>
    </footer>
  );
}
