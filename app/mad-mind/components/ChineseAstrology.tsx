"use client";

import { useState, useCallback } from "react";

/* ───────────────────────────────────────────────────────────
   CHINESE ASTROLOGY — Ba Zi Birth Chart Reader
   Based on the complete study of classical Chinese astrology
   ─────────────────────────────────────────────────────────── */

/* ─── Data ─── */
const ANIMALS = [
  "Rat", "Ox", "Tiger", "Rabbit", "Dragon", "Snake",
  "Horse", "Goat", "Monkey", "Rooster", "Dog", "Pig",
];

const ANIMAL_ELEMENTS: Record<string, string> = {
  Rat: "Water", Ox: "Earth", Tiger: "Wood", Rabbit: "Wood",
  Dragon: "Earth", Snake: "Fire", Horse: "Fire", Goat: "Earth",
  Monkey: "Metal", Rooster: "Metal", Dog: "Earth", Pig: "Water",
};

const ANIMAL_YIN_YANG: Record<string, string> = {
  Rat: "Yang", Ox: "Yin", Tiger: "Yang", Rabbit: "Yin",
  Dragon: "Yang", Snake: "Yin", Horse: "Yang", Goat: "Yin",
  Monkey: "Yang", Rooster: "Yin", Dog: "Yang", Pig: "Yin",
};

const ELEMENTS = ["Wood", "Fire", "Earth", "Metal", "Water"];

const STEMS = [
  { name: "Jia", element: "Wood", yinYang: "Yang" },
  { name: "Yi", element: "Wood", yinYang: "Yin" },
  { name: "Bing", element: "Fire", yinYang: "Yang" },
  { name: "Ding", element: "Fire", yinYang: "Yin" },
  { name: "Wu", element: "Earth", yinYang: "Yang" },
  { name: "Ji", element: "Earth", yinYang: "Yin" },
  { name: "Geng", element: "Metal", yinYang: "Yang" },
  { name: "Xin", element: "Metal", yinYang: "Yin" },
  { name: "Ren", element: "Water", yinYang: "Yang" },
  { name: "Gui", element: "Water", yinYang: "Yin" },
];

const BRANCHES = [
  { name: "Zi", animal: "Rat", element: "Water", yinYang: "Yang" },
  { name: "Chou", animal: "Ox", element: "Earth", yinYang: "Yin" },
  { name: "Yin", animal: "Tiger", element: "Wood", yinYang: "Yang" },
  { name: "Mao", animal: "Rabbit", element: "Wood", yinYang: "Yin" },
  { name: "Chen", animal: "Dragon", element: "Earth", yinYang: "Yang" },
  { name: "Si", animal: "Snake", element: "Fire", yinYang: "Yin" },
  { name: "Wu", animal: "Horse", element: "Fire", yinYang: "Yang" },
  { name: "Wei", animal: "Goat", element: "Earth", yinYang: "Yin" },
  { name: "Shen", animal: "Monkey", element: "Metal", yinYang: "Yang" },
  { name: "You", animal: "Rooster", element: "Metal", yinYang: "Yin" },
  { name: "Xu", animal: "Dog", element: "Earth", yinYang: "Yang" },
  { name: "Hai", animal: "Pig", element: "Water", yinYang: "Yin" },
];

const SAN_HE_GROUPS = [
  ["Rat", "Dragon", "Monkey"],
  ["Ox", "Snake", "Rooster"],
  ["Tiger", "Horse", "Dog"],
  ["Rabbit", "Goat", "Pig"],
];

const ELEMENT_COLORS: Record<string, string> = {
  Wood: "#4CAF50",
  Fire: "#FF2D2D",
  Earth: "#FF9800",
  Metal: "#E0E0E0",
  Water: "#2196F3",
};

/* ─── Helpers ─── */
function getChineseNewYear(year: number): Date {
  // Approximate CNY dates for 1900-2030
  const cnyDates: Record<number, string> = {
    2024: "2024-02-10", 2025: "2025-01-29", 2026: "2026-02-17",
    2023: "2023-01-22", 2022: "2022-02-01", 2021: "2021-02-12",
    2020: "2020-01-25", 2019: "2019-02-05", 2018: "2018-02-16",
    2017: "2017-01-28", 2016: "2016-02-08", 2015: "2015-02-19",
    2014: "2014-01-31", 2013: "2013-02-10", 2012: "2012-01-23",
    2011: "2011-02-03", 2010: "2010-02-14", 2009: "2009-01-26",
    2008: "2008-02-07", 2007: "2007-02-18", 2006: "2006-01-29",
    2005: "2005-02-09", 2004: "2004-01-22", 2003: "2003-02-01",
    2002: "2002-02-12", 2001: "2001-01-24", 2000: "2000-02-05",
    1999: "1999-02-16", 1998: "1998-01-28", 1997: "1997-02-07",
    1996: "1996-02-19", 1995: "1995-01-31", 1994: "1994-02-10",
    1993: "1993-01-23", 1992: "1992-02-04", 1991: "1991-02-15",
    1990: "1990-01-27", 1989: "1989-02-06", 1988: "1988-02-17",
    1987: "1987-01-29", 1986: "1986-02-09", 1985: "1985-02-20",
    1984: "1984-02-02", 1983: "1983-02-13", 1982: "1982-01-25",
    1981: "1981-02-05", 1980: "1980-02-16", 1979: "1979-01-28",
    1978: "1978-02-07", 1977: "1977-02-18", 1976: "1976-01-31",
    1975: "1975-02-11", 1974: "1974-01-23", 1973: "1973-02-03",
    1972: "1972-02-15", 1971: "1971-01-27", 1970: "1970-02-06",
    1969: "1969-02-17", 1968: "1968-01-30", 1967: "1967-02-09",
    1966: "1966-02-21", 1965: "1965-02-02", 1964: "1964-02-13",
    1963: "1963-01-25", 1962: "1962-02-05", 1961: "1961-02-15",
    1960: "1960-01-28", 1959: "1959-02-08", 1958: "1958-02-18",
    1957: "1957-01-31", 1956: "1956-02-12", 1955: "1955-01-24",
    1954: "1954-02-03", 1953: "1953-02-14", 1952: "1952-01-27",
    1951: "1951-02-06", 1950: "1950-02-17", 1949: "1949-01-29",
    1948: "1948-02-10", 1947: "1947-01-22", 1946: "1946-02-02",
    1945: "1945-02-13", 1944: "1944-01-25", 1943: "1943-02-05",
    1942: "1942-02-15", 1941: "1941-01-27", 1940: "1940-02-08",
    1939: "1939-02-19", 1938: "1938-01-31", 1937: "1937-02-11",
    1936: "1936-01-24", 1935: "1935-02-04", 1934: "1934-02-14",
    1933: "1933-01-26", 1932: "1932-02-06", 1931: "1931-02-17",
    1930: "1930-01-30", 1929: "1929-02-10", 1928: "1928-01-23",
    1927: "1927-02-02", 1926: "1926-02-13", 1925: "1925-01-24",
    1924: "1924-02-05", 1923: "1923-02-16", 1922: "1922-01-28",
    1921: "1921-02-08", 1920: "1920-02-20", 1919: "1919-02-01",
    1918: "1918-02-11", 1917: "1917-01-23", 1916: "1916-02-03",
    1915: "1915-02-14", 1914: "1914-01-26", 1913: "1913-02-06",
    1912: "1912-02-18", 1911: "1911-01-30", 1910: "1910-02-10",
    1909: "1909-02-01", 1908: "1908-02-13", 1907: "1907-02-13",
    1906: "1906-01-25", 1905: "1905-02-04", 1904: "1904-02-16",
    1903: "1903-01-29", 1902: "1902-02-08", 1901: "1901-02-19",
    1900: "1900-01-31",
  };
  
  if (cnyDates[year]) {
    return new Date(cnyDates[year]);
  }
  // Fallback approximation
  return new Date(`${year}-02-04`);
}

function getZodiacAnimal(year: number, month: number, day: number): string {
  const birthday = new Date(year, month - 1, day);
  const cny = getChineseNewYear(year);
  
  let effectiveYear = year;
  if (birthday < cny) {
    effectiveYear = year - 1;
  }
  
  const index = (effectiveYear - 4) % 12;
  return ANIMALS[index < 0 ? index + 12 : index];
}

function getYearElement(year: number): string {
  const lastDigit = year % 10;
  if (lastDigit === 0 || lastDigit === 1) return "Metal";
  if (lastDigit === 2 || lastDigit === 3) return "Water";
  if (lastDigit === 4 || lastDigit === 5) return "Wood";
  if (lastDigit === 6 || lastDigit === 7) return "Fire";
  return "Earth";
}

function getYearStemBranch(year: number, month: number, day: number): { stem: string; branch: string } {
  const birthday = new Date(year, month - 1, day);
  const cny = getChineseNewYear(year);
  
  let effectiveYear = year;
  if (birthday < cny) {
    effectiveYear = year - 1;
  }
  
  const stemIndex = (effectiveYear - 4) % 10;
  const branchIndex = (effectiveYear - 4) % 12;
  
  return {
    stem: STEMS[stemIndex < 0 ? stemIndex + 10 : stemIndex].name,
    branch: BRANCHES[branchIndex < 0 ? branchIndex + 12 : branchIndex].name,
  };
}

function getAllies(animal: string): string[] {
  for (const group of SAN_HE_GROUPS) {
    if (group.includes(animal)) {
      return group.filter((a) => a !== animal);
    }
  }
  return [];
}

function getMadElementReading(element: string): string {
  const readings: Record<string, string> = {
    Wood: "Growth is your native tongue. In the $MAD ecosystem, you're the community builder — planting seeds that become forests. Your HODL style: accumulate during quiet periods, expand during hype.",
    Fire: "Passion is your fuel. You're the hype engine, the voice that rallies. Your HODL style: all-in during momentum, but watch for burnout — even flames need oxygen.",
    Earth: "Stability is your superpower. You're the bedrock holder who sleeps through dips. Your HODL style: diamond hands, steady accumulation, ignore the noise.",
    Metal: "Precision and timing. You cut through FUD like a blade. Your HODL style: strategic entries, disciplined exits, never emotional.",
    Water: "Adaptability is your edge. You flow around obstacles, find opportunity in chaos. Your HODL style: fluid, reading the market's rhythm, riding waves.",
  };
  return readings[element] || "Your element is unique. Trust your intuition.";
}

function getMadAnimalReading(animal: string): string {
  const readings: Record<string, string> = {
    Rat: "Intelligent and resourceful. You see opportunities others miss. In $MAD, you're the early detector — you knew before they knew.",
    Ox: "Steady and relentless. You don't chase pumps; you outlast them. The $MAD community needs your dependable energy.",
    Tiger: "Bold and competitive. You thrive when the market fights back. $MAD respects the tiger's courage.",
    Rabbit: "Gentle but strategic. You move quietly but decisively. Your $MAD position grows while others panic.",
    Dragon: "Charismatic and ambitious. You were born for this. Dragons don't hold tokens — they build dynasties.",
    Snake: "Wise and intuitive. You see patterns before they form. In $MAD, your timing is legendary.",
    Horse: "Energetic and independent. You gallop while others walk. $MAD moves fast; you move faster.",
    Goat: "Creative and calm. You bring art and soul to the community. $MAD is culture, and you are the artist.",
    Monkey: "Sharp and curious. You figure out systems before the devs explain them. $MAD's puzzle solver.",
    Rooster: "Observant and precise. You catch details that save bags. The $MAD community's early warning system.",
    Dog: "Loyal and honest. You hold when others paper. $MAD was built for holders like you.",
    Pig: "Compassionate and generous. You share alpha, not just memes. The $MAD community's heart.",
  };
  return readings[animal] || "Your animal carries ancient wisdom. Trust it.";
}

function get2026Reading(animal: string): string {
  // 2026 is Year of the Fire Horse (Bing Wu)
  const readings: Record<string, string> = {
    Rat: "2026 Fire Horse year: Fast energy, quick decisions. Your Water nature can handle the heat — stay adaptable.",
    Ox: "2026 Fire Horse year: The Horse and Ox clash. Stay grounded. Your Earth element protects you from FOMO.",
    Tiger: "2026 Fire Horse year: Fire feeds your Wood nature. This is your growth year. Expand, but don't overextend.",
    Rabbit: "2026 Fire Horse year: Wood Rabbit + Fire Horse = creative explosion. Your ideas gain traction.",
    Dragon: "2026 Fire Horse year: Two Yang forces. Power struggles possible, but your Earth Dragon nature stabilizes.",
    Snake: "2026 Fire Horse year: Fire year amplifies your Fire nature. Passion peaks — channel it, don't burn out.",
    Horse: "2026 Fire Horse year: Your year. Double Fire energy. This is when legends are made or bags are lost. Stay sharp.",
    Goat: "2026 Fire Horse year: Fire creates Earth. Your stability is needed. Others will look to you for calm.",
    Monkey: "2026 Fire Horse year: Fire melts Metal. Flexibility required. Your adaptability is your armor.",
    Rooster: "2026 Fire Horse year: Fire tests Metal. Stay precise. Don't let hype override your analysis.",
    Dog: "2026 Fire Horse year: Fire creates Earth. Your loyalty is rewarded. Long-term holders win.",
    Pig: "2026 Fire Horse year: Water Pig meets Fire Horse. Tension creates opportunity. Flow, don't fight.",
  };
  return readings[animal] || "2026 is a Fire year. All signs feel the heat. Stay balanced.";
}

/* ─── Types ─── */
interface AstroResult {
  animal: string;
  element: string;
  yinYang: string;
  yearStem: string;
  yearBranch: string;
  allies: string[];
  madElementReading: string;
  madAnimalReading: string;
  reading2026: string;
}

/* ─── Sub-Components ─── */
function ElementBadge({ element }: { element: string }) {
  const color = ELEMENT_COLORS[element] || "#fff";
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider"
      style={{ backgroundColor: `${color}15`, color, border: `1px solid ${color}30` }}
    >
      {element}
    </span>
  );
}

function AllyBadge({ animal }: { animal: string }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-white/[0.05] text-white/50 border border-white/10">
      {animal}
    </span>
  );
}

/* ─── Main Component ─── */
export default function ChineseAstrology() {
  const [birthday, setBirthday] = useState("");
  const [result, setResult] = useState<AstroResult | null>(null);
  const [showForm, setShowForm] = useState(true);

  const handleCalculate = useCallback(() => {
    if (!birthday) return;
    
    const date = new Date(birthday);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    const animal = getZodiacAnimal(year, month, day);
    const element = getYearElement(year);
    const yinYang = ANIMAL_YIN_YANG[animal];
    const sb = getYearStemBranch(year, month, day);
    const allies = getAllies(animal);
    
    setResult({
      animal,
      element,
      yinYang,
      yearStem: sb.stem,
      yearBranch: sb.branch,
      allies,
      madElementReading: getMadElementReading(element),
      madAnimalReading: getMadAnimalReading(animal),
      reading2026: get2026Reading(animal),
    });
    setShowForm(false);
  }, [birthday]);

  const handleReset = useCallback(() => {
    setBirthday("");
    setResult(null);
    setShowForm(true);
  }, []);

  return (
    <section className="relative rounded-[1.5rem] border border-white/[0.08] bg-white/[0.02] overflow-hidden mb-2">
      {/* Header */}
      <div className="px-4 sm:px-6 py-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg">🔮</span>
          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#FF6B00]/60">
            ANCIENT WISDOM
          </p>
        </div>
        <h2 className="text-lg sm:text-xl font-black text-white leading-tight">
          Chinese Astrology
        </h2>
        <p className="text-[11px] text-white/40 mt-1 max-w-md leading-relaxed">
          Discover your zodiac animal, element, and cosmic allies. 
          Ancient wisdom meets $MAD frequency.
        </p>
      </div>

      {showForm ? (
        /* Input Form */
        <div className="px-4 sm:px-6 py-6">
          <div className="max-w-sm mx-auto text-center">
            <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-3">
              Your Birth Date
            </label>
            <input
              type="date"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#FF6B00]/40 transition-colors text-center"
              max={new Date().toISOString().split("T")[0]}
            />

            <button
              onClick={handleCalculate}
              disabled={!birthday}
              className={`mt-6 px-8 py-3 rounded-full text-sm font-black uppercase tracking-wider transition-all ${
                birthday
                  ? "bg-[#FF2D2D] text-white hover:bg-[#FF6B00] hover:scale-[1.02] shadow-[0_0_20px_rgba(255,45,45,0.2)]"
                  : "bg-white/[0.03] text-white/20 cursor-not-allowed border border-white/5"
              }`}
            >
              Reveal My Chart
            </button>

            <p className="mt-4 text-[10px] text-white/20 text-center max-w-xs leading-relaxed">
              Based on classical Chinese astrology — Ba Zi, Wu Xing, and the 12 Zodiac Animals.
              Your birth year element reveals your $MAD holding style.
            </p>
          </div>
        </div>
      ) : (
        /* Results */
        <div className="px-4 sm:px-6 py-6">
          {/* Hero Card */}
          <div className="text-center mb-6">
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/30 mb-3">
              Your Cosmic Identity
            </p>
            
            <div className="inline-flex flex-col items-center">
              <div className="w-24 h-24 rounded-full border-2 border-[#FF2D2D]/20 bg-[#FF2D2D]/[0.05] flex items-center justify-center mb-3">
                <span className="text-3xl font-black text-white">
                  {result!.animal}
                </span>
              </div>
              
              <div className="flex items-center gap-2 mb-2">
                <ElementBadge element={result!.element} />
                <span className="text-[10px] text-white/40 uppercase tracking-wider">
                  {result!.yinYang}
                </span>
              </div>
              
              <p className="text-xs text-white/50">
                {result!.yearStem} {result!.yearBranch} — {result!.element} {result!.animal}
              </p>
            </div>
          </div>

          {/* Readings Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            {/* Element Reading */}
            <div className="rounded-[1.2rem] border border-white/[0.06] bg-white/[0.02] p-4">
              <div className="flex items-center gap-2 mb-2">
                <ElementBadge element={result!.element} />
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30">
                  Your Element
                </span>
              </div>
              <p className="text-xs text-white/60 leading-relaxed">
                {result!.madElementReading}
              </p>
            </div>

            {/* Animal Reading */}
            <div className="rounded-[1.2rem] border border-white/[0.06] bg-white/[0.02] p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm">{result!.animal === "Rat" ? "🐀" : result!.animal === "Ox" ? "🐂" : result!.animal === "Tiger" ? "🐅" : result!.animal === "Rabbit" ? "🐇" : result!.animal === "Dragon" ? "🐉" : result!.animal === "Snake" ? "🐍" : result!.animal === "Horse" ? "🐎" : result!.animal === "Goat" ? "🐐" : result!.animal === "Monkey" ? "🐒" : result!.animal === "Rooster" ? "🐓" : result!.animal === "Dog" ? "🐕" : "🐖"}</span>
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30">
                  Your Animal
                </span>
              </div>
              <p className="text-xs text-white/60 leading-relaxed">
                {result!.madAnimalReading}
              </p>
            </div>

            {/* 2026 Reading */}
            <div className="rounded-[1.2rem] border border-[#FF6B00]/15 bg-[#FF6B00]/[0.03] p-4 sm:col-span-2">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[#FF6B00]/50">
                  🔥 2026 Fire Horse Year
                </span>
              </div>
              <p className="text-xs text-white/60 leading-relaxed">
                {result!.reading2026}
              </p>
            </div>

            {/* Allies */}
            <div className="rounded-[1.2rem] border border-white/[0.06] bg-white/[0.02] p-4 sm:col-span-2">
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 mb-2">
                Your $MAD Allies (Three Harmony)
              </p>
              <div className="flex flex-wrap gap-2">
                {result!.allies.map((ally) => (
                  <AllyBadge key={ally} animal={ally} />
                ))}
              </div>
              <p className="text-[10px] text-white/30 mt-2 leading-relaxed">
                These are your natural allies in the $MAD community. 
                The Three Harmony (三合) groups form the strongest bonds — 
                in community, in conviction, in the bag.
              </p>
            </div>
          </div>

          {/* Reset */}
          <div className="text-center">
            <button
              onClick={handleReset}
              className="px-6 py-2.5 rounded-full border border-white/10 bg-white/[0.03] text-xs font-bold text-white/40 hover:text-white/60 hover:border-white/20 transition-all"
            >
              Calculate Another Chart
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
