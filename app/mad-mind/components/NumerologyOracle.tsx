"use client";

import { useState, useCallback } from "react";

/* ───────────────────────────────────────────────────────────
   NUMEROLOGY ORACLE — Lloyd Strayhorn Chaldean-Pythagorean
   Replaces The Oracle (chat) with birthday divination
   ─────────────────────────────────────────────────────────── */

interface NumerologyResult {
  lifePath: number;
  birthday: number;
  attitude: number;
  personalYear: number;
  peakCycle: number;
  challenge: number;
}

const MASTER_NUMBERS = [11, 22, 33];

function reduceToDigit(n: number, allowMaster = true): number {
  if (allowMaster && MASTER_NUMBERS.includes(n)) return n;
  while (n > 9) {
    n = String(n).split("").reduce((a, b) => a + parseInt(b), 0);
    if (allowMaster && MASTER_NUMBERS.includes(n)) return n;
  }
  return n;
}

function getLifePathMeaning(n: number): string {
  const meanings: Record<number, string> = {
    1: "The Leader. Independent, driven, born to pioneer. You build what others fear to start.",
    2: "The Diplomat. Intuitive, sensitive, the bridge between worlds. Your strength is subtlety.",
    3: "The Creator. Expressive, charismatic, Jupiter's child. Expansion follows your voice.",
    4: "The Builder. Disciplined, reliable, the foundation. You turn vision into structure.",
    5: "The Freedom Seeker. Adaptive, magnetic, Mercury's spark. Change is your native tongue.",
    6: "The Nurturer. Responsible, magnetic, Venus-blessed. Home and harmony are your empire.",
    7: "The Seeker. Analytical, spiritual, Neptune's depth. You see through the surface.",
    8: "The Powerhouse. Ambitious, authoritative, Saturn's discipline. Wealth follows focus.",
    9: "The Humanitarian. Compassionate, creative, Mars-transformed. You complete cycles.",
    11: "The Illuminator. Intuitive master. Vision beyond logic. The bridge between worlds.",
    22: "The Master Builder. Practical visionary. You manifest what others dream.",
    33: "The Master Teacher. Selfless guide. Compassion as a superpower.",
  };
  return meanings[n] || "A unique frequency. The numbers speak, but you decide the meaning.";
}

function getBirthdayMeaning(n: number): string {
  const meanings: Record<number, string> = {
    1: "Gift: Initiative. You were born to lead, not follow.",
    2: "Gift: Cooperation. Harmony is your natural habitat.",
    3: "Gift: Expression. Joy radiates from you effortlessly.",
    4: "Gift: Order. You bring structure to chaos.",
    5: "Gift: Adaptability. Freedom is your birthright.",
    6: "Gift: Responsibility. You are the anchor.",
    7: "Gift: Wisdom. Inner knowledge is your compass.",
    8: "Gift: Authority. Power flows to those who wield it justly.",
    9: "Gift: Completion. You finish what others abandon.",
  };
  return meanings[n] || "Gift: Uniqueness. Your path is yours to forge.";
}

function getAttitudeMeaning(n: number): string {
  const meanings: Record<number, string> = {
    1: "Attitude: Bold. You approach life head-on.",
    2: "Attitude: Harmonious. You read the room before entering.",
    3: "Attitude: Optimistic. Silver linings find you.",
    4: "Attitude: Practical. Feet on ground, eyes on goal.",
    5: "Attitude: Curious. Every door is an invitation.",
    6: "Attitude: Caring. Others feel safe near you.",
    7: "Attitude: Analytical. You question before accepting.",
    8: "Attitude: Ambitious. Status is a byproduct of your drive.",
    9: "Attitude: Compassionate. The world needs your empathy.",
  };
  return meanings[n] || "Attitude: Unique. You defy simple categorization.";
}

function getPersonalYearMeaning(n: number): string {
  const meanings: Record<number, string> = {
    1: "This year: NEW BEGINNINGS. Plant seeds. Start what you delayed.",
    2: "This year: PATIENCE & PARTNERSHIP. Cooperate. Relationships deepen.",
    3: "This year: CREATIVITY & EXPANSION. Express yourself. Jupiter smiles.",
    4: "This year: FOUNDATION & WORK. Build. Discipline rewards you.",
    5: "This year: CHANGE & FREEDOM. Expect the unexpected. Adapt.",
    6: "This year: RESPONSIBILITY & HOME. Family, health, service.",
    7: "This year: REFLECTION & TRUTH. Study, spiritual growth, solitude.",
    8: "This year: POWER & MANIFESTATION. Career, money, authority. Reap.",
    9: "This year: COMPLETION & RELEASE. Let go. Endings precede new cycles.",
  };
  return meanings[n] || "This year: TRANSFORMATION. Expect the unexpected.";
}

function getPeakCycleMeaning(n: number): string {
  const meanings: Record<number, string> = {
    1: "Peak Cycle: INDEPENDENCE. You are becoming yourself. Lead.",
    2: "Peak Cycle: COOPERATION. Partnerships define this era. Unite.",
    3: "Peak Cycle: CREATIVITY. Self-expression peaks. Share your art.",
    4: "Peak Cycle: FOUNDATION. Build something permanent. The work matters.",
    5: "Peak Cycle: FREEDOM. Change, travel, new horizons. Explore.",
    6: "Peak Cycle: RESPONSIBILITY. Home, family, community. Give back.",
    7: "Peak Cycle: WISDOM. Knowledge, spirituality, inner truth. Seek.",
    8: "Peak Cycle: POWER. Material success, authority, legacy. Achieve.",
    9: "Peak Cycle: COMPASSION. Humanitarian work, endings, completion. Serve.",
  };
  return meanings[n] || "Peak Cycle: EVOLUTION. Your path is unfolding uniquely.";
}

function getChallengeMeaning(n: number): string {
  const meanings: Record<number, string> = {
    0: "Challenge: THE VOID. Master all lessons. The ultimate test of integration.",
    1: "Challenge: SELF-DOUBT. Trust your instincts. Independence is the lesson.",
    2: "Challenge: OVERSENSITIVITY. Balance giving with boundaries.",
    3: "Challenge: SCATTERED ENERGY. Focus. Completion over perfection.",
    4: "Challenge: RIGIDITY. Flexibility is your growth edge.",
    5: "Challenge: RESTLESSNESS. Commitment brings true freedom.",
    6: "Challenge: PERFECTIONISM. Done is better than perfect. Accept flaws.",
    7: "Challenge: ISOLATION. Share your wisdom. Connection is key.",
    8: "Challenge: MATERIALISM. Power without purpose is empty. Find meaning.",
  };
  return meanings[n] || "Challenge: UNKNOWN. The numbers reveal; you navigate.";
}

function calculateNumerology(birthday: string): NumerologyResult | null {
  const [year, month, day] = birthday.split("-").map(Number);
  if (!year || !month || !day) return null;

  const lifePath = reduceToDigit(month + day + year);
  const birthdayNum = reduceToDigit(day, false);
  const attitude = reduceToDigit(month + day, false);
  const currentYear = new Date().getFullYear();
  const personalYear = reduceToDigit(day + month + currentYear);
  const peakCycle = reduceToDigit(Math.abs(lifePath - birthdayNum));
  const challenge = reduceToDigit(Math.abs(day - month), false);

  return { lifePath, birthday: birthdayNum, attitude, personalYear, peakCycle, challenge };
}

function NumberCard({ 
  number, 
  label, 
  meaning, 
  isMaster = false 
}: { 
  number: number; 
  label: string; 
  meaning: string; 
  isMaster?: boolean;
}) {
  return (
    <div className={`relative rounded-[1.2rem] border p-4 sm:p-5 transition-all hover:scale-[1.02] ${
      isMaster 
        ? "border-[#FF6B00]/30 bg-[#FF6B00]/[0.04] shadow-[0_0_30px_rgba(255,107,0,0.06)]" 
        : "border-white/10 bg-white/[0.03] hover:border-white/20"
    }`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40">
          {label}
        </span>
        {isMaster && (
          <span className="text-[8px] font-black uppercase tracking-wider text-[#FF6B00]/70 px-2 py-0.5 rounded-full border border-[#FF6B00]/20 bg-[#FF6B00]/10">
            MASTER
          </span>
        )}
      </div>
      <div className="flex items-baseline gap-2 mb-2">
        <span className={`text-3xl sm:text-4xl font-black tracking-tight ${isMaster ? "text-[#FF6B00]" : "text-white"}`}>
          {number}
        </span>
      </div>
      <p className="text-xs text-white/60 leading-relaxed">{meaning}</p>
    </div>
  );
}

/* ─── THE NUMEROLOGY ORACLE ─── */
export default function NumerologyOracle() {
  const [birthday, setBirthday] = useState("");
  const [result, setResult] = useState<NumerologyResult | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleCalculate = useCallback(() => {
    if (!birthday) return;
    const res = calculateNumerology(birthday);
    if (res) {
      setResult(res);
      setShowResult(true);
    }
  }, [birthday]);

  const handleReset = useCallback(() => {
    setBirthday("");
    setResult(null);
    setShowResult(false);
  }, []);

  return (
    <section className="mb-1">
      <div className="rounded-none sm:rounded-2xl border-0 sm:border border-white/5 bg-[#121212] overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.3)] relative">
        
        {/* Header */}
        <div className="shrink-0 flex items-center justify-center px-4 sm:px-6 py-4 sm:py-5 border-b border-white/5">
          <div className="text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#FF6B00]/60 mb-1">
              [ THE ORACLE ]
            </p>
            <p className="text-xs text-white/40">
              Enter your birthday. The numbers reveal your frequency.
            </p>
          </div>
        </div>

        {!showResult ? (
          /* Input State */
          <div className="flex flex-col items-center justify-center px-4 py-12 sm:py-16">
            <div className="w-16 h-16 rounded-full bg-[#FF2D2D]/10 border border-[#FF2D2D]/20 flex items-center justify-center mb-6">
              <span className="text-2xl">🔢</span>
            </div>
            
            <div className="w-full max-w-xs">
              <label className="block text-[9px] font-black uppercase tracking-[0.3em] text-white/30 mb-3 text-center">
                Your Birth Date
              </label>
              <input
                type="date"
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/[0.03] text-white text-sm text-center placeholder:text-white/20 outline-none focus:border-[#FF2D2D]/30 focus:bg-white/[0.05] transition-all"
              />
            </div>

            <button
              onClick={handleCalculate}
              disabled={!birthday}
              className={`mt-6 px-8 py-3 rounded-full text-sm font-black uppercase tracking-wider transition-all ${
                birthday
                  ? "bg-[#FF2D2D] text-white hover:bg-[#FF6B00] hover:scale-[1.02] shadow-[0_0_20px_rgba(255,45,45,0.2)]"
                  : "bg-white/[0.03] text-white/20 cursor-not-allowed border border-white/5"
              }`}
            >
              Reveal My Numbers
            </button>

            <p className="mt-4 text-[10px] text-white/20 text-center max-w-xs leading-relaxed">
              Based on Lloyd Strayhorn's Chaldean-Pythagorean system. 
              Numbers are vibrations. You are a frequency.
            </p>
          </div>
        ) : (
          /* Results State */
          <div className="px-3 sm:px-4 py-4 sm:py-6">
            {/* Life Path — Hero */}
            <div className="text-center mb-6">
              <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/30 mb-2">
                Your Life Path
              </p>
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full border-2 border-[#FF2D2D]/30 bg-[#FF2D2D]/[0.06] mb-3">
                <span className={`text-4xl font-black ${MASTER_NUMBERS.includes(result!.lifePath) ? "text-[#FF6B00]" : "text-white"}`}>
                  {result!.lifePath}
                </span>
              </div>
              <p className="text-sm text-white/70 max-w-md mx-auto leading-relaxed">
                {getLifePathMeaning(result!.lifePath)}
              </p>
              {MASTER_NUMBERS.includes(result!.lifePath) && (
                <p className="mt-2 text-[10px] text-[#FF6B00]/60 font-bold uppercase tracking-wider">
                  Master Number — Higher octave energy
                </p>
              )}
            </div>

            {/* Grid of other numbers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <NumberCard
                number={result!.birthday}
                label="Birthday Gift"
                meaning={getBirthdayMeaning(result!.birthday)}
              />
              <NumberCard
                number={result!.attitude}
                label="Attitude"
                meaning={getAttitudeMeaning(result!.attitude)}
              />
              <NumberCard
                number={result!.personalYear}
                label="Personal Year"
                meaning={getPersonalYearMeaning(result!.personalYear)}
              />
              <NumberCard
                number={result!.peakCycle}
                label="Peak Cycle"
                meaning={getPeakCycleMeaning(result!.peakCycle)}
              />
              <NumberCard
                number={result!.challenge}
                label="Challenge"
                meaning={getChallengeMeaning(result!.challenge)}
              />
              <div className="relative rounded-[1.2rem] border border-[#FF6B00]/20 bg-[#FF6B00]/[0.03] p-4 sm:p-5 flex flex-col items-center justify-center text-center">
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[#FF6B00]/50 mb-2">
                  $MAD Frequency
                </span>
                <p className="text-xs text-white/50 leading-relaxed">
                  Your number is {result!.lifePath}. 
                  In the $MAD universe, this frequency aligns with 
                  {result!.lifePath === 3 || result!.lifePath === 8 || result!.lifePath === 11 
                    ? " expansion and abundance. Jupiter's blessing." 
                    : result!.lifePath === 1 || result!.lifePath === 9 
                    ? " creation and completion. The alpha and omega." 
                    : " your unique path. Trust the vibration."}
                </p>
              </div>
            </div>

            {/* Reset */}
            <div className="text-center mt-6">
              <button
                onClick={handleReset}
                className="px-6 py-2.5 rounded-full border border-white/10 bg-white/[0.03] text-xs font-bold text-white/40 hover:text-white/60 hover:border-white/20 transition-all"
              >
                Calculate Another Birthday
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
