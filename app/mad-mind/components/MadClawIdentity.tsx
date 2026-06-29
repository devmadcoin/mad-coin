"use client";

import { useEffect } from "react";

import NumerologyOracle from "./NumerologyOracle";
import MadArchetypeQuiz from "./MadArchetypeQuiz";
import FrequencyMeter from "./FrequencyMeter";
import MadBagCalculator from "./MadBagCalculator";
import ChineseAstrology from "./ChineseAstrology";

/* ─── Data ─── */
const CONTRACT = "Fa7ZE9nCEYnrHsnoeHuhEExJpchtrBtKXnWe6CgHpump";

export default function MadClawIdentity() {
  return (
    <div className="space-y-0">
      <div className="bg-[#0a0a0a] relative z-10">
        <div className="mx-auto max-w-5xl px-2 sm:px-4 pb-2 pt-1 sm:pt-2">
          <MadBagCalculator />
        </div>
      </div>

      {/* Divider — separates calculator from oracle */}
      <section className="w-full bg-[#0a0a0a] py-4">
        <img
          src="/mad-ai-divider.jpg"
          alt="$MAD AI Numerology"
          className="w-full max-w-3xl mx-auto h-auto rounded-xl"
        />
      </section>

      {/* Content below hero on dark background */}
      <div className="bg-[#0a0a0a] relative z-10">
        <div className="mx-auto max-w-5xl px-2 sm:px-4 pb-2 pt-1 sm:pt-2">
          <TheOracle />

          {/* Chinese Astrology Divider */}
          <section className="w-full py-4">
            <img
              src="/mad-chinese-astrology-divider.jpg"
              alt="$MAD Chinese Astrology"
              className="w-full max-w-3xl mx-auto h-auto rounded-xl"
            />
          </section>

          <ChineseAstrology />

          {/* Archetype Divider */}
          <section className="w-full py-4">
            <img
              src="/mad-archetype-divider.jpg"
              alt="$MAD AI Archetype"
              className="w-full max-w-3xl mx-auto h-auto rounded-xl"
            />
          </section>

          <MadArchetypeQuiz />

          {/* Frequency Divider */}
          <section className="w-full py-4">
            <img
              src="/mad-frequency-divider.jpg"
              alt="$MAD AI Check Your Frequency"
              className="w-full max-w-3xl mx-auto h-auto rounded-xl"
            />
          </section>

          <FrequencyMeter />
        </div>
      </div>
    </div>
  );
}

export { triggerClawReaction };
