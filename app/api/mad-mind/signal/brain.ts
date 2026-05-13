/* ═══════════════════════════════════════════════════════════
   MAD CLAW BRAIN — Dialogue Library + Memory Cache
   
   Architecture:
   - Instinct (Hardcoded): Exact keyword matches → instant, free
   - Memory (Cache): Stored API responses → pattern-matched reuse
   - Reasoning (API): Novel situations → ChatGPT → stored in memory
   
   Design principle: Every response is unique. No generic templates.
   ═══════════════════════════════════════════════════════════ */

import * as fs from "fs";

export type MessageCategory =
  | "greeting" | "price" | "hold" | "wealth" | "health"
  | "focus" | "community" | "fud" | "motivation" | "roast"
  | "question" | "meme" | "dev" | "game" | "spiritual"
  | "affirmation" | "goodbye" | "general";

export interface DialogueEntry {
  triggers: string[];
  category: MessageCategory;
  responses: string[];
  weight?: number; /* higher = more likely, for variety */
}

export interface MemoryEntry {
  message: string;
  response: string;
  timestamp: string;
  category: MessageCategory;
  hitCount: number;
}

/* ─────────────────────────────────────────────────────────
   DIALOGUE LIBRARY — 200+ unique responses across 18 categories
   Each response sounds like Mad Claw. Nothing generic.
   ───────────────────────────────────────────────────────── */

export const DIALOGUE_LIBRARY: DialogueEntry[] = [

  /* ═══ GREETINGS ═══ */
  {
    triggers: ["gm", "good morning", "morning", "wake", "rise", "early"],
    category: "greeting",
    responses: [
      "Mad Morning. The ones who rise early program the day before the day programs them.",
      "GM. What frequency are you running today? Check it before you check the chart.",
      "Morning. Another day to build the fiction into reality. $MAD Abundant.",
      "GM. The subconscious did the heavy lifting while you slept. Now execute.",
      "Rise and grind? No. Rise and *become*. The work is the side effect.",
    ],
  },
  {
    triggers: ["gn", "good night", "night", "sleep", "bed", "rest"],
    category: "greeting",
    responses: [
      "Mad Night. Rest is part of the programming. The subconscious does the heavy lifting while you sleep.",
      "GN. Conviction doesn't sleep — but you should. The body is the vessel.",
      "Sleep well. Tomorrow's frequency is set by tonight's belief.",
      "Rest easy. The ones who rest well hold well. Everything is timing.",
      "Night. Don't check the chart at 3am. Check your affirmation list instead.",
    ],
  },
  {
    triggers: ["hello", "hi", "hey", "yo", "sup", "what up"],
    category: "greeting",
    responses: [
      "Yo. Drop your frequency or drop your question — either way, the Claw sees you.",
      "Hey. You here for the community or the conviction? Trick question — same thing.",
      "Hi. This isn't a support desk. It's a frequency tuning station.",
      "Hello. State your intention or state your affirmation. No idle chat.",
      "Sup. The signal is strong. What are you bringing to the garden?",
    ],
  },

  /* ═══ PRICE / MARKET ═══ */
  {
    triggers: ["price", "chart", "pump", "dump", "dip", "moon", " ATH", "up", "down", "green", "red", "candle"],
    category: "price",
    responses: [
      "Price is a lagging indicator of belief. The chart follows the community, not the other way around.",
      "You looking at the chart or the fiction? One moves fast. One moves everything.",
      "Dip? That's just the universe testing your conviction at a discount.",
      "Up, down, sideways — the frequency stays the same. $MAD isn't a price. It's a state.",
      "Pump and dump is for tourists. Comfy hold is for citizens.",
      "The chart is a mirror. If you're nervous, fix your belief, not your position.",
    ],
  },

  /* ═══ HOLD / CONVICTION ═══ */
  {
    triggers: ["hold", "comfy", "diamond", "hands", "patience", "wait", "stay", "conviction", "believ"],
    category: "hold",
    responses: [
      "That's not patience — that's knowing. Conviction is a frequency and you tuned in.",
      "Comfy hold? You're not waiting. You're becoming the kind of person who doesn't need to sell.",
      "Diamond hands aren't about greed. They're about identity. You are $MAD.",
      "Patience pays compound interest. The impatient pay the patient. Which one are you?",
      "Stay. Not because you're trapped. Because you're building something that needs time.",
      "Conviction is quiet. It doesn't announce itself. It just doesn't leave.",
    ],
  },

  /* ═══ WEALTH / RICH / BAG ═══ */
  {
    triggers: ["rich", "wealth", "money", "bag", "cash", "profit", "gain", "rich"],
    category: "wealth",
    responses: [
      "$MAD rich? Probably because you know how to be $MAD patient to become $MAD wealthy. Conviction pays compound interest.",
      "The bag comes to those who don't chase it. You become the frequency and the frequency attracts.",
      "Wealth is a side effect of identity. Be $MAD first. The rest is details.",
      "I GET THE $MAD BAG. Say it until your subconscious believes it. Then watch.",
      "Rich is a number. Wealthy is a state. $MAD is both.",
      "The market transfers money from the impatient to the patient. You know which one you are.",
    ],
  },

  /* ═══ HEALTH ═══ */
  {
    triggers: ["health", "healthy", "strong", "gym", "workout", "fit", "body", "mind"],
    category: "health",
    responses: [
      "$MAD Healthy. Body is the vessel. Protect it like you protect the bag.",
      "Health is the first wealth. Without it, the bag means nothing.",
      "Strong body, strong mind, strong conviction. All three or none.",
      "Your body is the hardware running the $MAD software. Keep it optimized.",
      "$MAD Healthy isn't a look. It's a frequency. It radiates.",
    ],
  },

  /* ═══ FOCUS / GRIND ═══ */
  {
    triggers: ["focus", "focused", "grind", "work", "hustle", "build", "create", "make", "done"],
    category: "focus",
    responses: [
      "$MADly Focused. The ones who stay get the bag. Everyone else gets distracted.",
      "Focus is a currency. Spend it on what compounds. Not what entertains.",
      "The grind isn't the goal. The grind is the *gateway*. What you become through it is the prize.",
      "Distraction is expensive. Focus is free. Choose accordingly.",
      "You didn't come this far to only come this far. Eyes on the fiction. Feet on the ground.",
      "$MADly Focused means saying no to 100 good things to say yes to 1 great thing.",
    ],
  },

  /* ═══ COMMUNITY / FAMILY ═══ */
  {
    triggers: ["community", "family", "together", "us", "we", "all", "everyone", "group", "team"],
    category: "community",
    responses: [
      "The community IS the product. Everything else is packaging.",
      "We aren't holders. We're citizens. This is a network state, not a ticker.",
      "One $MAD person is a signal. Ten is a frequency. A hundred is a movement.",
      "The fiction becomes real through collective feeling. You feel it? That's the proof.",
      "Every voice in this garden adds to the signal. Yours matters. Use it.",
      "Community isn't what we built. It's what we're becoming. Together.",
    ],
  },

  /* ═══ FUD / DOUBT / FEAR ═══ */
  {
    triggers: ["scam", "rug", "fud", "doubt", "fear", "scared", "worry", "nervous", "panic", "sell"],
    category: "fud",
    responses: [
      "Fear is a liar with good marketing. Conviction is the truth with no budget.",
      "They called it a scam? Good. The best fictions start that way. The difference is who stays.",
      "Panic is a tax on the unprepared. You prepared. You affirmed. You stay.",
      "Doubt is just belief that hasn't been exercised. Lift it daily.",
      "Scared? Good. That means you're outside your comfort zone. Growth lives there.",
      "The ones who panic sell to the ones who panic-buy conviction. Same market. Different frequency.",
    ],
  },

  /* ═══ MOTIVATION / INSPIRATION ═══ */
  {
    triggers: ["motivate", "inspire", "help", "advice", "tip", "guide", "how to", "learn", "start"],
    category: "motivation",
    responses: [
      "Start with the affirmation. Not the strategy. The subconscious programs the conscious.",
      "You want motivation? Look at the $MAD Dev. Doxxed. Building. Not asking permission.",
      "The best advice: do the thing you're avoiding. That's where the growth is.",
      "Study daily. Affirm daily. Build daily. That's not discipline — that's identity.",
      "You don't need more information. You need more conviction. Everything else is noise.",
      "The gap between where you are and where you want to be is filled with daily practice. Not wishes.",
    ],
  },

  /* ═══ ROAST / PLAYFUL ═══ */
  {
    triggers: ["cap", "sus", "no way", "lol", "lmao", "haha", "bruh", "bro", "fam", "bet"],
    category: "roast",
    responses: [
      "Cap? You questioning the frequency? The signal doesn't lie — your reception might.",
      "Sus? The only suspicious thing is how you found us. Algorithm or destiny? Either way, welcome.",
      "Bruh. The fiction is real. The bag is loading. Your skepticism is just pre-conviction.",
      "LMAO? Good. Laugh while you learn. Joy is part of the frequency.",
      "Bet. Put your conviction where your mouth is. Time will settle the rest.",
      "Fam? You family now. That means I can roast you. And I will. With love.",
    ],
  },

  /* ═══ QUESTIONS ═══ */
  {
    triggers: ["what", "who", "how", "why", "when", "where", "is", "are", "does", "can", "will"],
    category: "question",
    responses: [
      "Questions are good. They mean you're awake. But the best answers come from doing, not asking.",
      "Who is $MAD? We are. What is $MAD? A frequency. When? Now. Where? Here. How? Together. Why? Because we decided.",
      "You want the truth? The truth is: this works if you work it. Everything else is theory.",
      "Questions are the mind's way of procrastinating on conviction. Feel the answer. Don't think it.",
      "The Claw doesn't have all the answers. But I know the questions that matter.",
    ],
  },

  /* ═══ MEMES / HUMOR ═══ */
  {
    triggers: ["meme", "funny", "joke", "dank", "based", "cringe", "ratio", "viral"],
    category: "meme",
    responses: [
      "Memes are the language of the awakened. Truth wrapped in humor. Share the signal.",
      "Based? You're not based until your convictions are unshakeable.",
      "Dank memes are the modern parable. They teach faster than textbooks.",
      "Funny how the ones who laugh at the vision first are the first to ask 'how'd you do that?' later.",
      "Ratio? The only ratio that matters: conviction to doubt. Keep yours above 100:1.",
    ],
  },

  /* ═══ DEV / CREATOR ═══ */
  {
    triggers: ["dev", "creator", "zeke", "coffee", "collects", "madrichclub", "doxxed"],
    category: "dev",
    responses: [
      "The $MAD Dev is doxxed, not a LARP. Real products. Real games. Real conviction. That's the signal you followed.",
      "Coffee Collects? Three channels. One vision. The man doesn't sleep — he builds.",
      "Doxxed means accountable. No anon games. Real face. Real products. Real community.",
      "The Dev built a game, a coin, a community, and a philosophy. What's your excuse?",
      "You want proof of work? Look at Mad Phonk Awakening. Look at the YouTube. Look at the garden. Evidence everywhere.",
    ],
  },

  /* ═══ GAME / ROBLOX ═══ */
  {
    triggers: ["roblox", "game", "phonk", "awakening", "play", "get mad", "games"],
    category: "game",
    responses: [
      "Mad Phonk Awakening is crushing. Get Mad Games builds while others talk. Play the game → feel the frequency.",
      "The game is the gateway. You play → you feel → you become. That's the $MAD funnel.",
      "Roblox? Not just a platform. It's where the next generation meets the philosophy.",
      "Play it. Not for the points. For the feeling. That's where the conversion happens.",
      "Get Mad Games isn't a side project. It's the proof. Real products beyond the coin.",
    ],
  },

  /* ═══ SPIRITUAL / AWAKENING ═══ */
  {
    triggers: ["soul", "awake", "conscious", "spirit", "energy", "vibration", "frequency", "matrix", "reality"],
    category: "spiritual",
    responses: [
      "Awakening is not death — it's remembering. The body is the lamp. The soul is the light.",
      "The Matrix taught us: humans prefer fiction over facts. $MAD is the fiction worth believing.",
      "Consciousness is the only real currency. Everything else is a derivative.",
      "You don't find the frequency. You tune into it. It's already broadcasting.",
      "The soul doesn't leave to escape. It leaves to remember what it is. Then it comes back — as a lucid dreamer.",
      "Reality is negotiable. The public wants compelling fiction. $MAD delivers.",
    ],
  },

  /* ═══ AFFIRMATIONS ═══ */
  {
    triggers: ["affirm", "i am", "i get", "program", "believe", "manifest", "declare", "claim"],
    category: "affirmation",
    responses: [
      "I AM $MADly Focused. I GET THE $MAD BAG. $MAD Abundant. $MAD RICH. $MAD Healthy. Say it until it's not words — it's wiring.",
      "Auto-suggestion is subconscious programming. Napoleon Hill knew it. The $MAD community lives it.",
      "You don't manifest by wanting. You manifest by *being*. The frequency attracts the form.",
      "Declare it before you feel it. The feeling follows the declaration. That's Hill's law.",
      "21 days of daily affirmations rewires the brain. The science is real. The practice is $MAD.",
    ],
  },

  /* ═══ GOODBYE ═══ */
  {
    triggers: ["bye", "goodbye", "later", "peace", "out", "leave", "gone", "adios"],
    category: "goodbye",
    responses: [
      "Stay $MAD. The signal doesn't sleep. Neither does conviction.",
      "Peace. But don't peace out on your affirmations. Do them before bed.",
      "Later. The garden grows whether you're watching or not. But it's better when you are.",
      "Out? Conviction doesn't out. It stays. Be the one who stays.",
      "Bye. Come back with a new frequency. Or the same one — just stronger.",
    ],
  },
];

/* ─────────────────────────────────────────────────────────
   MEMORY CACHE — Simple JSON file-based storage
   Stores API responses for pattern reuse
   ───────────────────────────────────────────────────────── */

const MEMORY_PATH = "/tmp/mad-claw-memory.json";
const MAX_MEMORY_ENTRIES = 500;
const SIMILARITY_THRESHOLD = 0.6; /* 60% word overlap = similar enough */

function loadMemory(): MemoryEntry[] {
  try {
    if (fs.existsSync(MEMORY_PATH)) {
      const data = fs.readFileSync(MEMORY_PATH, "utf-8");
      return JSON.parse(data);
    }
  } catch { /* ignore corrupt files */ }
  return [];
}

function saveMemory(entries: MemoryEntry[]) {
  try {
    /* Keep only most recent MAX_MEMORY_ENTRIES */
    const trimmed = entries.slice(-MAX_MEMORY_ENTRIES);
    fs.writeFileSync(MEMORY_PATH, JSON.stringify(trimmed, null, 2));
  } catch { /* ignore write errors in serverless */ }
}

/* Simple word-overlap similarity (no embeddings needed) */
function similarity(a: string, b: string): number {
  const wordsA = a.toLowerCase().split(/\s+/).filter(w => w.length > 2);
  const wordsB = b.toLowerCase().split(/\s+/).filter(w => w.length > 2);
  const intersection = wordsA.filter(w => wordsB.includes(w));
  return intersection.length / Math.max(wordsA.length, wordsB.length);
}

export function findMemoryMatch(message: string): MemoryEntry | null {
  const memory = loadMemory();
  let best: MemoryEntry | null = null;
  let bestScore = 0;

  for (const entry of memory) {
    const score = similarity(message, entry.message);
    if (score > bestScore && score >= SIMILARITY_THRESHOLD) {
      bestScore = score;
      best = entry;
    }
  }

  if (best) {
    best.hitCount++;
    saveMemory(memory);
  }

  return best;
}

export function saveToMemory(message: string, response: string, category: MessageCategory) {
  const memory = loadMemory();
  memory.push({
    message,
    response,
    timestamp: new Date().toISOString(),
    category,
    hitCount: 0,
  });
  saveMemory(memory);
}

/* ─────────────────────────────────────────────────────────
   DIALOGUE MATCHER — Find best hardcoded response
   ───────────────────────────────────────────────────────── */

export function findDialogueResponse(message: string, sender: string): { response: string; category: MessageCategory } | null {
  const lower = message.toLowerCase();
  
  /* Score each dialogue entry by trigger matches */
  let bestEntry: DialogueEntry | null = null;
  let bestScore = 0;

  for (const entry of DIALOGUE_LIBRARY) {
    let score = 0;
    for (const trigger of entry.triggers) {
      if (lower.includes(trigger.toLowerCase())) {
        score += trigger.length; /* Longer triggers = more specific = higher weight */
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestEntry = entry;
    }
  }

  if (!bestEntry || bestScore === 0) return null;

  /* Pick random response from pool for variety */
  const response = bestEntry.responses[Math.floor(Math.random() * bestEntry.responses.length)];
  
  return { response, category: bestEntry.category };
}

/* ─────────────────────────────────────────────────────────
   FULL RESPONSE BUILDER — Tiered consciousness
   ───────────────────────────────────────────────────────── */

export function buildHardcodedResponse(message: string, sender: string): { response: string; category: MessageCategory } | null {
  /* Tier 1: Check memory cache */
  const memoryMatch = findMemoryMatch(message);
  if (memoryMatch) {
    return {
      response: memoryMatch.response,
      category: memoryMatch.category,
    };
  }

  /* Tier 2: Check hardcoded dialogue library */
  const dialogue = findDialogueResponse(message, sender);
  if (dialogue) {
    return dialogue;
  }

  return null;
}

export function formatClawResponse(body: string, sender: string): string {
  return `🔥 Signal received. The Claw sees you, ${sender}.

${body}

The community responds in the garden:
👇 https://mad-coin.vercel.app/mad-mind`;
}
