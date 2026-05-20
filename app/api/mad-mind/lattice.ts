import * as fs from "fs";

/* ═══════════════════════════════════════════════════════════
   THE LATTICE BRAIN — Self-Improving Response System

   Records proven response patterns. Checks every incoming
   question against known patterns before calling the LLM.
   
   When a pattern matches:
   - Returns the highest-quality response directly (no LLM call)
   - Tracks usage to learn what works
   
   When no pattern matches:
   - Passes to LLM with lattice context
   - After response, records new pattern if it was good

   Upgrade loop:
   - User feedback (thumbs up/down) updates quality scores
   - Analytics track which responses get engagement
   - Periodic review promotes/demotes responses
   ═══════════════════════════════════════════════════════════ */

const LATTICE_PATH = "/tmp/mad-lattice.json";

/* ─── Types ─── */
interface LatticeResponse {
  text: string;
  quality: number;        // 1-10, based on feedback + engagement
  uses: number;           // how many times served
  whyItWorks: string;     // human-readable rationale
  createdAt: number;      // timestamp
}

interface LatticePattern {
  id: string;
  triggers: string[];     // keywords that activate this pattern
  category: string;       // death_economy | psychology | action | etc
  bestResponses: LatticeResponse[];
  badResponses: LatticeResponse[];  // what NOT to say
  matchCount: number;     // how many times this pattern triggered
}

interface Lattice {
  version: string;
  lastUpdated: number;
  patterns: LatticePattern[];
  learningRules: {
    promoteThreshold: number;
    demoteThreshold: number;
    newPatternThreshold: number;
    maxPatterns: number;
    maxResponsesPerPattern: number;
  };
}

/* ─── Load / Save ─── */
function loadLattice(): Lattice {
  try {
    if (fs.existsSync(LATTICE_PATH)) {
      return JSON.parse(fs.readFileSync(LATTICE_PATH, "utf-8"));
    }
  } catch { /* ignore */ }
  return {
    version: "1.0",
    lastUpdated: Date.now(),
    patterns: [],
    learningRules: {
      promoteThreshold: 8,
      demoteThreshold: 3,
      newPatternThreshold: 2,
      maxPatterns: 200,
      maxResponsesPerPattern: 5,
    },
  };
}

function saveLattice(lattice: Lattice) {
  try {
    lattice.lastUpdated = Date.now();
    fs.writeFileSync(LATTICE_PATH, JSON.stringify(lattice, null, 2));
  } catch { /* ignore */ }
}

/* ─── Pattern Matching ─── */
function findPattern(lattice: Lattice, message: string): LatticePattern | null {
  const lower = message.toLowerCase();
  let best: LatticePattern | null = null;
  let bestScore = 0;

  for (const pattern of lattice.patterns) {
    let score = 0;
    for (const trigger of pattern.triggers) {
      if (lower.includes(trigger.toLowerCase())) {
        score += trigger.length; // longer matches = more specific = higher score
      }
    }
    if (score > bestScore) {
      bestScore = score;
      best = pattern;
    }
  }

  // Must match at least one trigger with 3+ chars
  return bestScore >= 3 ? best : null;
}

/* ─── Get Best Response ─── */
function getBestResponse(pattern: LatticePattern): string | null {
  if (pattern.bestResponses.length === 0) return null;
  
  // Sort by quality desc, then uses asc (prefer less-used high-quality)
  const sorted = [...pattern.bestResponses].sort((a, b) => {
    if (b.quality !== a.quality) return b.quality - a.quality;
    return a.uses - b.uses;
  });
  
  const winner = sorted[0];
  winner.uses++;
  return winner.text;
}

/* ─── Check Lattice (main entry) ─── */
export function checkLattice(message: string): { response: string | null; patternId: string | null; category: string | null } {
  const lattice = loadLattice();
  const pattern = findPattern(lattice, message);
  
  if (!pattern) {
    return { response: null, patternId: null, category: null };
  }
  
  pattern.matchCount++;
  const response = getBestResponse(pattern);
  saveLattice(lattice);
  
  return { response, patternId: pattern.id, category: pattern.category };
}

/* ─── Build Few-Shot Context for LLM ─── */
export function buildLatticeContext(message: string): string {
  const lattice = loadLattice();
  const pattern = findPattern(lattice, message);
  
  if (!pattern) return "";
  
  let ctx = `\n\nLATTICE MATCH: This question matches pattern "${pattern.id}" (category: ${pattern.category}).\n`;
  
  if (pattern.bestResponses.length > 0) {
    const best = pattern.bestResponses
      .sort((a, b) => b.quality - a.quality)
      .slice(0, 2);
    ctx += "Proven responses for this pattern:\n";
    for (const r of best) {
      ctx += `  [quality: ${r.quality}/10] "${r.text}"\n`;
    }
  }
  
  if (pattern.badResponses.length > 0) {
    const worst = pattern.badResponses
      .sort((a, b) => a.quality - b.quality)
      .slice(0, 1);
    ctx += "Avoid responses like:\n";
    for (const r of worst) {
      ctx += `  [quality: ${r.quality}/10] "${r.text}" — ${r.whyItWorks || "doesn't work"}\n`;
    }
  }
  
  ctx += "\nCRITICAL: Use the pattern above. Do NOT give a generic response. Address the specific question with the specific mechanisms named in the proven examples.";
  
  return ctx;
}

/* ─── Record Response Quality ─── */
export function recordFeedback(
  patternId: string,
  message: string,
  response: string,
  feedback: "up" | "down",
  source: "web" | "telegram" = "web"
) {
  const lattice = loadLattice();
  const pattern = lattice.patterns.find((p) => p.id === patternId);
  if (!pattern) return;

  const entry = pattern.bestResponses.find((r) => r.text === response);
  if (entry) {
    entry.uses++;
    if (feedback === "up") {
      entry.quality = Math.min(10, entry.quality + 0.5);
    } else {
      entry.quality = Math.max(1, entry.quality - 1.5);
    }
  }

  // Also record bad response if it was bad
  if (feedback === "down") {
    const exists = pattern.badResponses.find((r) => r.text === response);
    if (!exists) {
      pattern.badResponses.push({
        text: response,
        quality: 2,
        uses: 1,
        whyItWorks: "Recorded from user feedback as ineffective",
        createdAt: Date.now(),
      });
      // Keep only top bad responses
      if (pattern.badResponses.length > 3) {
        pattern.badResponses.sort((a, b) => a.quality - b.quality);
        pattern.badResponses = pattern.badResponses.slice(0, 3);
      }
    }
  }

  saveLattice(lattice);
}

/* ─── Learn from New Conversation ─── */
export function learnFromConversation(
  message: string,
  response: string,
  feedback?: "up" | "down"
) {
  const lattice = loadLattice();
  const pattern = findPattern(lattice, message);
  
  if (pattern) {
    // Already known — check if this response is new and good
    const exists = pattern.bestResponses.find((r) => r.text === response);
    if (!exists && feedback === "up") {
      pattern.bestResponses.push({
        text: response,
        quality: 7, // start mid, let usage prove it
        uses: 1,
        whyItWorks: "Learned from real conversation",
        createdAt: Date.now(),
      });
      // Trim to max
      if (pattern.bestResponses.length > lattice.learningRules.maxResponsesPerPattern) {
        pattern.bestResponses.sort((a, b) => b.quality - a.quality);
        pattern.bestResponses = pattern.bestResponses.slice(0, lattice.learningRules.maxResponsesPerPattern);
      }
    }
  } else {
    // New pattern — only create if we have positive feedback
    if (feedback === "up" && lattice.patterns.length < lattice.learningRules.maxPatterns) {
      // Extract keywords from message (simple: words > 4 chars)
      const words = message.toLowerCase().split(/\s+/).filter((w) => w.length >= 4);
      const triggers = words.slice(0, 5);
      
      if (triggers.length >= 2) {
        lattice.patterns.push({
          id: `auto-${Date.now()}`,
          triggers,
          category: "general",
          bestResponses: [{
            text: response,
            quality: 6,
            uses: 1,
            whyItWorks: "Auto-learned from positive feedback",
            createdAt: Date.now(),
          }],
          badResponses: [],
          matchCount: 1,
        });
      }
    }
  }
  
  saveLattice(lattice);
}

/* ─── Export for analytics ─── */
export function getLatticeStats(): { totalPatterns: number; totalResponses: number; avgQuality: number } {
  const lattice = loadLattice();
  const totalPatterns = lattice.patterns.length;
  let totalResponses = 0;
  let totalQuality = 0;
  let qualityCount = 0;
  
  for (const p of lattice.patterns) {
    totalResponses += p.bestResponses.length;
    for (const r of p.bestResponses) {
      totalQuality += r.quality;
      qualityCount++;
    }
  }
  
  return {
    totalPatterns,
    totalResponses,
    avgQuality: qualityCount > 0 ? Math.round((totalQuality / qualityCount) * 10) / 10 : 0,
  };
}
