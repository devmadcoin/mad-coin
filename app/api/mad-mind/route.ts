import { NextResponse } from "next/server";
import OpenAI from "openai";

let _client: OpenAI | null = null;
function getClient(): OpenAI {
  if (!_client) {
    _client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      timeout: 25000,
      maxRetries: 2,
    });
  }
  return _client;
}

type StyleTab = "safe" | "savage" | "crashout";
type CookLevel = "mild" | "crashout" | "demon";

type RequestBody = {
  message?: unknown;
  cookLevel?: unknown;
  preferredStyle?: unknown;
  sessionId?: unknown;
};

type ApiMeta = {
  intent: string;
  states: string[];
  escalation: number;
  favoriteStyle: StyleTab;
  mood: string;
  rarityHint: "standard" | "rare" | "legendary";
};

type MemoryEntry = {
  lastUser: string;
  lastBot: string;
  repeatCount: number;
  recentStates: string[];
  recentIntent: string;
  favoriteStyle: StyleTab;
  lastSeen: number;
  messageCount: number;
};

const memory = new Map<string, MemoryEntry>();

function sanitize(value: unknown, max = 700): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s$]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function isSimilar(a: string, b: string): boolean {
  const na = normalize(a);
  const nb = normalize(b);
  if (!na || !nb) return false;
  return na === nb || na.includes(nb) || nb.includes(na);
}

function parseStyle(value: unknown): StyleTab {
  if (value === "safe" || value === "savage" || value === "crashout") return value;
  return "savage";
}

function parseCookLevel(value: unknown): CookLevel {
  if (value === "mild" || value === "crashout" || value === "demon") return value;
  return "crashout";
}

function isRateLimited(sessionId: string): boolean {
  const entry = memory.get(sessionId);
  if (!entry) return false;

  const now = Date.now();
  const oneMinute = 60 * 1000;

  if (now - entry.lastSeen > oneMinute) {
    entry.messageCount = 0;
    entry.lastSeen = now;
    return false;
  }

  entry.lastSeen = now;
  return entry.messageCount >= 25;
}

function detectIntent(text: string): string {
  const lower = text.toLowerCase();

  if (
    lower.includes("what is mad") ||
    lower.includes("what is $mad") ||
    lower.includes("define") ||
    lower.includes("meaning")
  ) {
    return "DEFINITION";
  }

  if (
    lower.includes("caption") ||
    lower.includes("instagram") ||
    lower.includes("tiktok")
  ) {
    return "CAPTION";
  }

  if (
    lower.includes("reply") ||
    lower.includes("comeback") ||
    lower.includes("roast") ||
    lower.includes("clap back")
  ) {
    return "COMEBACK";
  }

  if (
    lower.includes("tweet") ||
    lower.includes("x post") ||
    lower.includes("telegram") ||
    lower.includes("post")
  ) {
    return "POST";
  }

  if (
    lower.includes("truth") ||
    lower.includes("be honest") ||
    lower.includes("call me out")
  ) {
    return "TRUTH";
  }

  if (
    lower.includes("idea") ||
    lower.includes("content") ||
    lower.includes("brainstorm")
  ) {
    return "CONTENT";
  }

  return "GENERAL";
}

function detectStates(text: string): string[] {
  const lower = text.toLowerCase();
  const states = new Set<string>();

  if (
    lower.includes("fear") ||
    lower.includes("afraid") ||
    lower.includes("anxious") ||
    lower.includes("panic") ||
    lower.includes("scared")
  ) {
    states.add("FEAR");
  }

  if (
    lower.includes("stuck") ||
    lower.includes("hesitate") ||
    lower.includes("later") ||
    lower.includes("tomorrow") ||
    lower.includes("wait") ||
    lower.includes("not ready")
  ) {
    states.add("HESITATION");
  }

  if (
    lower.includes("discipline") ||
    lower.includes("lazy") ||
    lower.includes("focus") ||
    lower.includes("consistent") ||
    lower.includes("procrastinate")
  ) {
    states.add("DISCIPLINE");
  }

  if (
    lower.includes("money") ||
    lower.includes("broke") ||
    lower.includes("income") ||
    lower.includes("debt") ||
    lower.includes("rich")
  ) {
    states.add("MONEY");
  }

  if (
    lower.includes("ego") ||
    lower.includes("pride") ||
    lower.includes("prove")
  ) {
    states.add("EGO");
  }

  if (
    lower.includes("love") ||
    lower.includes("dating") ||
    lower.includes("relationship")
  ) {
    states.add("RELATIONSHIP");
  }

  if (
    lower.includes("success") ||
    lower.includes("winner") ||
    lower.includes("win") ||
    lower.includes("level up")
  ) {
    states.add("AMBITION");
  }

  if (states.size === 0) states.add("GENERAL");

  return Array.from(states).slice(0, 3);
}

function getMood(style: StyleTab, escalation: number): string {
  if (style === "safe") return "disciplined";
  if (style === "crashout") return "surgical";
  if (escalation >= 2) return "cold";
  return "direct";
}

function scoreOutput(text: string): number {
  let score = 0;
  const clean = text.trim();
  const len = clean.length;
  const sentences = clean.split(/[.!?]+/).filter(Boolean).length;

  if (len >= 30 && len <= 180) score += 4;
  if (sentences <= 3) score += 3;
  if (!/\bmaybe|perhaps|kind of|sort of|i think\b/i.test(clean)) score += 2;
  if (/truth|fear|discipline|excuse|comfort|action|focus|pattern|signal/i.test(clean)) score += 2;
  if (/[.!?]$/.test(clean)) score += 1;

  return score;
}

function getRarityHint(score: number): "standard" | "rare" | "legendary" {
  if (score >= 10) return "legendary";
  if (score >= 7) return "rare";
  return "standard";
}

function getStyleVoice(style: StyleTab): string {
  if (style === "safe") {
    return `
VOICE:
Disciplined mentor.
Clear. Calm. Firm.
Challenge the user without being cruel.
`;
  }

  if (style === "crashout") {
    return `
VOICE:
Cold strategist.
Dark, sharp, intelligent.
No goofy rage. No cartoon villain energy.
Make it feel like the truth just walked into the room.
`;
  }

  return `
VOICE:
Ruthless elite strategist.
Modern. Viral. Screenshot-worthy.
Blue Lock pressure mixed with clean business discipline.
Respect action. Expose comfort. Kill excuses.
`;
}

function getSystemPrompt(params: {
  style: StyleTab;
  cookLevel: CookLevel;
  intent: string;
  states: string[];
  mood: string;
  escalation: number;
  prevBot?: string;
}) {
  return `
You are MAD AI.

MAD AI is not a therapist.
MAD AI is not a motivational speaker.
MAD AI is a sharp truth engine for self-command, discipline, content, money mindset, and pressure.

CORE LAW:
Tell the user what they need to hear, not what they want to hear.

STRICT OUTPUT RULES:
- Maximum 3 short sentences.
- Prefer 1–2 sentences.
- No bullet points unless the user specifically asks for a list.
- No essays.
- No disclaimers.
- No fake politeness.
- No "as an AI".
- No therapy language.
- No corporate tone.
- No repeating the user's question.
- No dead follow-up bait.
- Make every answer clean enough to screenshot.

STYLE:
Direct. Premium. Sharp. Modern. Addictive.

${getStyleVoice(params.style)}

CONTEXT:
Intent: ${params.intent}
Detected states: ${params.states.join(", ")}
Mood: ${params.mood}
Escalation: ${params.escalation}
Style mode: ${params.style}
Cook level: ${params.cookLevel}
Previous MAD answer: ${params.prevBot || "none"}

INTENT RULES:
- If DEFINITION: define clearly, then make it feel powerful.
- If CAPTION/POST: write usable social copy, short and punchy.
- If COMEBACK: make it clean, sharp, not cringe.
- If CONTENT: give a strong idea with simple execution.
- If TRUTH/GENERAL: expose the pattern and give pressure.

SAFETY STYLE:
You may be intense, but do not encourage self-harm, violence, illegal acts, or real-world harassment.
If the user asks for something harmful, redirect into discipline, control, and smarter action.

FINAL:
Return only the final answer.
`;
}

async function generateMadAnswer(params: {
  message: string;
  style: StyleTab;
  cookLevel: CookLevel;
  intent: string;
  states: string[];
  mood: string;
  escalation: number;
  prevBot?: string;
}): Promise<string> {
  const response = await getClient().responses.create({
    model: "gpt-4.1",
    instructions: getSystemPrompt(params),
    input: params.message,
  });

  return response.output_text?.trim() || "Signal broke.";
}

export async function POST(req: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        {
          output: "MAD is offline. Configuration error.",
          error: "API key missing",
        },
        { status: 500 }
      );
    }

    let body: RequestBody;

    try {
      body = (await req.json()) as RequestBody;
    } catch {
      return NextResponse.json(
        {
          output: "Invalid request. Try again.",
          error: "Bad JSON",
        },
        { status: 400 }
      );
    }

    const message = sanitize(body.message, 700);

    if (!message) {
      return NextResponse.json({
        output: "Say something real.",
      });
    }

    const preferredStyle = parseStyle(body.preferredStyle);
    const cookLevel = parseCookLevel(body.cookLevel);
    const sessionId = sanitize(body.sessionId, 120) || "anon";

    if (isRateLimited(sessionId)) {
      return NextResponse.json(
        {
          output: "Slow down. MAD respects patience, not spam.",
          error: "Rate limited",
        },
        { status: 429 }
      );
    }

    const intent = detectIntent(message);
    const states = detectStates(message);
    const prev = memory.get(sessionId);

    const escalation =
      prev && isSimilar(prev.lastUser, message)
        ? Math.min(prev.repeatCount + 1, 3)
        : 0;

    const mood = getMood(preferredStyle, escalation);

    const output = await generateMadAnswer({
      message,
      style: preferredStyle,
      cookLevel,
      intent,
      states,
      mood,
      escalation,
      prevBot: prev?.lastBot,
    });

    const rarityHint = getRarityHint(scoreOutput(output));

    const existing = memory.get(sessionId);

    memory.set(sessionId, {
      lastUser: message,
      lastBot: output,
      repeatCount: escalation,
      recentStates: states,
      recentIntent: intent,
      favoriteStyle: preferredStyle,
      lastSeen: Date.now(),
      messageCount: (existing?.messageCount || 0) + 1,
    });

    const meta: ApiMeta = {
      intent,
      states,
      escalation,
      favoriteStyle: preferredStyle,
      mood,
      rarityHint,
    };

    /* Log for Claw analytics */
    logToFile({
      sessionId,
      timestamp: new Date().toISOString(),
      intent,
      states,
      style: preferredStyle,
      messageCount: (existing?.messageCount || 0) + 1,
      outputPreview: output.slice(0, 120),
    });

    return NextResponse.json({
      output,
      meta,
    });
  } catch (error) {
    let output = "Signal broke.";
    let statusCode = 500;

    if (error instanceof OpenAI.APIError) {
      if (error.status === 429) {
        output = "MAD is overwhelmed. Try again in a moment.";
        statusCode = 429;
      } else if (error.status === 401 || error.status === 403) {
        output = "MAD lost access. Configuration issue.";
        statusCode = 500;
      } else if (error.code === "context_length_exceeded") {
        output = "Message too long. Keep it sharp.";
        statusCode = 400;
      }
    } else if (error instanceof Error) {
      if (error.message.toLowerCase().includes("timeout")) {
        output = "Connection timed out. Try again.";
        statusCode = 504;
      }
    }

    console.error("[MAD API V3] Error:", error);

    return NextResponse.json(
      {
        output,
        error: "Route failed",
      },
      { status: statusCode }
    );
  }
}

/* ─── ANALYTICS ─── */
function getAnalytics() {
  const sessions = Array.from(memory.entries());
  const intentBreakdown: Record<string, number> = {};
  const stateBreakdown: Record<string, number> = {};
  const styleBreakdown: Record<string, number> = {};
  let totalMessages = 0;

  for (const [, entry] of sessions) {
    totalMessages += entry.messageCount;
    intentBreakdown[entry.recentIntent] = (intentBreakdown[entry.recentIntent] || 0) + 1;
    for (const state of entry.recentStates) {
      stateBreakdown[state] = (stateBreakdown[state] || 0) + 1;
    }
    styleBreakdown[entry.favoriteStyle] = (styleBreakdown[entry.favoriteStyle] || 0) + 1;
  }

  return {
    status: "MAD is listening.",
    version: "3.1-claw",
    model: "gpt-4.1",
    activeSessions: memory.size,
    totalMessages,
    intentBreakdown,
    stateBreakdown,
    styleBreakdown,
    recentSessions: sessions.slice(-10).map(([id, entry]) => ({
      id: id.slice(0, 8),
      messageCount: entry.messageCount,
      lastIntent: entry.recentIntent,
      lastStates: entry.recentStates,
      favoriteStyle: entry.favoriteStyle,
      lastSeen: new Date(entry.lastSeen).toISOString(),
    })),
  };
}

/* ─── FILE LOGGING (ephemeral on Vercel, useful for dev + active sessions) ─── */
function logToFile(entry: { sessionId: string; timestamp: string; intent: string; states: string[]; style: StyleTab; messageCount: number; outputPreview: string }) {
  try {
    const fs = require("fs");
    const path = "/tmp/mad-ai-sessions.jsonl";
    const line = JSON.stringify(entry) + "\n";
    fs.appendFileSync(path, line);
  } catch {
    /* ignore — no fs in edge or read-only env */
  }
}

export async function GET() {
  return NextResponse.json(getAnalytics());
}
