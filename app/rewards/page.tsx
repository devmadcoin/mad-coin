"use client";

import Image from "next/image";
import { motion } from "framer-motion";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/* ═══════════════════════════════════════════════════════════
   $MAD REWARDS — Coming Soon Page
   ═══════════════════════════════════════════════════════════ */

export default function RewardsPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#F5F1E8] text-[#1a1a1a]">
      {/* Subtle radial */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_50%_20%,rgba(255,45,45,0.05),transparent_55%)]" />

      <div className="relative mx-auto max-w-4xl px-4 py-14 sm:px-6 sm:py-20">
        {/* Hero Badge */}
        <div className="mb-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-[#FF2D2D]/30 bg-[#FF2D2D]/10 px-5 py-2"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF2D2D] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF2D2D]" />
            </span>
            <span className="text-[11px] font-black uppercase tracking-[0.3em] text-[#FF2D2D]">
              Coming Soon
            </span>
          </motion.div>
        </div>

        {/* Main Headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center"
        >
          <h1 className="text-4xl font-black leading-[0.95] tracking-tight text-[#1a1a1a] sm:text-6xl lg:text-7xl">
            🚨{" "}
            <span className="text-[#FF2D2D] drop-shadow-[0_0_16px_rgba(255,45,45,0.2)]">
              $MAD REWARDS
            </span>{" "}
            IS COMING! 🚨
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-[#1a1a1a]/60 sm:text-lg">
            The $MAD ecosystem is evolving, and this is only the beginning.
            A fellow community member and the dev worked together to create
            <span className="font-bold text-[#1a1a1a]"> MAD Rewards</span>, a
            utility-driven rewards system designed to give back to the holders
            who believe in the project and help grow the movement.
          </p>
        </motion.div>

        {/* Funded Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-10 text-center"
        >
          <div className="inline-flex flex-col items-center gap-3 rounded-[2rem] border border-[#FF2D2D]/20 bg-[#FF2D2D]/[0.06] px-8 py-6 sm:px-12 sm:py-8">
            <div className="text-[10px] font-bold uppercase tracking-[0.34em] text-[#FF2D2D]/70">
              Initial Rollout Funded
            </div>
            <div className="text-3xl font-black text-[#FF2D2D] sm:text-5xl">
              2,000,000 <span className="text-[#1a1a1a]">$MAD</span>
            </div>
            <div className="text-sm text-[#1a1a1a]/50">
              More rewards planned as the community expands and new milestones are reached.
            </div>
          </div>
        </motion.div>

        {/* The Three Pillars */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3"
        >
          {[
            { icon: "💎", word: "Hold", desc: "Believe in the mission. Stay locked in." },
            { icon: "⚡", word: "Earn", desc: "The more you support, the more you gain." },
            { icon: "🔥", word: "Get Rewarded", desc: "Real benefits for real believers." },
          ].map((item) => (
            <div
              key={item.word}
              className="rounded-[1.4rem] border border-[#1a1a1a]/10 bg-white p-6 text-center transition-all hover:border-[#FF2D2D]/20"
            >
              <div className="text-3xl">{item.icon}</div>
              <p className="mt-3 text-lg font-black text-[#1a1a1a]">{item.word}</p>
              <p className="mt-1 text-sm text-[#1a1a1a]/50">{item.desc}</p>
            </div>
          ))}
        </motion.div>

        {/* The Vision Statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="mt-10 rounded-[2rem] border border-[#1a1a1a]/10 bg-white p-8 sm:p-10"
        >
          <blockquote className="text-center text-base leading-8 text-[#1a1a1a]/70 sm:text-lg italic">
            <span className="text-[#FF2D2D] text-xl font-black not-italic mr-1">&ldquo;</span>
            This isn&apos;t just another update
            <span className="font-bold text-[#1a1a1a]">
              — it&apos;s the foundation for something much bigger.
            </span>{" "}
            More details will be revealed soon, so stay locked in and keep your eyes on what&apos;s coming next.
            <span className="text-[#FF2D2D] text-xl font-black not-italic ml-1">&rdquo;</span>
          </blockquote>
        </motion.div>

        {/* Energy Lines */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-10 flex flex-col items-center gap-3 text-center sm:flex-row sm:justify-center"
        >
          {["⚡ We&apos;re building.", "⚡ We&apos;re growing.", "⚡ We&apos;re rewarding the community."].map(
            (line) => (
              <span
                key={line}
                className="rounded-full border border-[#FF2D2D]/15 bg-[#FF2D2D]/[0.05] px-5 py-2 text-sm font-black text-[#FF2D2D]/90"
              >
                {line}
              </span>
            ),
          )}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.85 }}
          className="mt-12 text-center"
        >
          <p className="text-sm font-bold text-[#1a1a1a]/40">
            This is just the beginning.
          </p>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <a
              href="https://jup.ag/swap?sell=So11111111111111111111111111111111111111112&buy=Fa7ZE9nCEYnrHsnoeHuhEExJpchtrBtKXnWe6CgHpump"
              target="_blank"
              rel="noreferrer"
              className="inline-flex rounded-full border border-[#FF2D2D]/40 bg-[#FF2D2D] px-8 py-4 text-base font-black text-white transition hover:scale-[1.02] hover:bg-[#FF6B00]"
            >
              Buy $MAD →
            </a>
            <a
              href="https://t.me/MadRichClub"
              target="_blank"
              rel="noreferrer"
              className="inline-flex rounded-full border border-[#1a1a1a]/15 bg-[#1a1a1a]/[0.02] px-8 py-4 text-base font-black text-[#1a1a1a]/75 transition hover:border-[#1a1a1a]/20 hover:bg-[#1a1a1a]/[0.04]"
            >
              Join Telegram
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
