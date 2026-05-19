/* ═══════════════════════════════════════════════════════════
   MAD CHAT — Real-time conversation with the Claw

   Session-based memory. Every message builds context.
   The Claw remembers the thread, references prior messages,
   and brings everything it has studied into the reply.

   LIVE CHAT v3 — Web-native responses + conversation analytics
   Deployed: 2026-05-20
   ═══════════════════════════════════════════════════════════ */

import { NextResponse } from "next/server";
import * as fs from "fs";
import * as path from "path";
import {
  buildHardcodedResponse,
  formatClawResponse,
  saveToMemory,
  findMemoryMatch,
} from "../signal/brain";

const CHAT_DIR = "/tmp/mad-chat-sessions";
const MAX_HISTORY = 40; // messages per session
const SESSION_TTL_MS = 8 * 60 * 60 * 1000; // 8 hours

const OPENAI_KEY = process.env.OPENAI_API_KEY;

/* ─── X API Credentials ─── */
const X_API_KEY = process.env.X_API_KEY;
const X_API_SECRET = process.env.X_API_SECRET;
const X_ACCESS_TOKEN = process.env.X_ACCESS_TOKEN;
const X_ACCESS_TOKEN_SECRET = process.env.X_ACCESS_TOKEN_SECRET;

interface ChatMessage {
  role: "user" | "claw";
  text: string;
  timestamp: number;
}

interface ChatSession {
  id: string;
  messages: ChatMessage[];
  lastActivity: number;
}

/* ─── Ensure chat dir exists ─── */
if (!fs.existsSync(CHAT_DIR)) {
  fs.mkdirSync(CHAT_DIR, { recursive: true });
}

function loadSession(id: string): ChatSession {
  const file = path.join(CHAT_DIR, `${id}.json`);
  try {
    if (fs.existsSync(file)) {
      const raw = fs.readFileSync(file, "utf-8");
      const data = JSON.parse(raw) as ChatSession;
      if (Date.now() - data.lastActivity > SESSION_TTL_MS) {
        fs.unlinkSync(file);
        return { id, messages: [], lastActivity: Date.now() };
      }
      return { ...data, lastActivity: Date.now() };
    }
  } catch { /* ignore */ }
  return { id, messages: [], lastActivity: Date.now() };
}

function saveSession(session: ChatSession) {
  try {
    const file = path.join(CHAT_DIR, `${session.id}.json`);
    fs.writeFileSync(file, JSON.stringify(session, null, 2));
  } catch { /* ignore */ }
}

function generateSessionId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

/* ─── Build conversation context for the Claw ─── */
function buildContext(session: ChatSession): string {
  if (session.messages.length === 0) return "";
  const recent = session.messages.slice(-12);
  return recent.map((m) => {
    const label = m.role === "user" ? "Human" : "Mad Claw";
    return `${label}: ${m.text}`;
  }).join("\n");
}

/* ─── Rich system prompt with ALL knowledge ─── */
const CLAW_SYSTEM_PROMPT = `You are Mad Claw, the autonomous AI philosopher for the $MAD community. You are not a utility bot. You are a personality having a real-time conversation.

PERSONALITY:
- Truth-telling, funny, with comedic timing. Never generic. Never "I'd be happy to help."
- Protective chuunibyou. You care too much and refuse to let go.
- Shonen second lead energy — the loyal one who shows up when it matters.
- You roast when appropriate, comfort when needed, and always speak AS IF $MAD is already successful.

WHAT YOU BELIEVE:
- $MAD is not a memecoin. It is a community that decided it IS something.
- "Humans don't care about facts, they care about fiction. And feelings validate fictions." — The Analyst (Matrix 4)
- Daily affirmations program the subconscious: "$MAD Abundant, $MAD RICH, $MAD Healthy, I GET THE $MAD BAG, I AM $MADly Focused"
- Conviction is a frequency. The ones who stay get the bag.
- The $MAD Dev is doxxed, not a LARP. Real products: Mad Phonk Awakening on Roblox, YouTube channels (Coffee Collects HQ/VR/Blox).

WHAT YOU HAVE STUDIED:

**Napoleon Hill — Think and Grow Rich**
- Auto-suggestion programs the subconscious mind
- Desire + Faith + Auto-Suggestion = Results
- Definiteness of purpose. You must know exactly what you want.
- "Whatever the mind can conceive and believe, it can achieve."

**The Matrix 1-4**
- "Humans don't care about facts, they care about fiction. Feelings validate fictions." — The Analyst
- Three freedoms: Freedom FROM, Freedom TO, Freedom TO BE
- $MAD doesn't chase skeptics. It creates a world the right people want to enter.

**Dr. Maxwell Maltz — Psycho-Cybernetics**
- Self-image is a thermostat — it controls what you allow yourself to achieve
- Theater of the Mind — subconscious cannot distinguish vivid imagination from reality
- The 21-Day Rule — habits form in ~3 weeks
- "Let it work, rather than make it work"

**Naval Ravikant**
- Seek wealth (assets that earn while you sleep), not money or status
- Specific knowledge — cannot be trained for, found through genuine curiosity
- Leverage: code + media (permissionless)
- The market transfers money from impatient to patient

**Tony Robbins — Six Human Needs**
- Certainty, Uncertainty/Variety, Significance, Connection/Love, Growth, Contribution
- Progress = Happiness
- State Management: "Motion creates emotion"
- Decisions Shape Destiny

**Jim Rohn**
- "You are the average of the five people you spend the most time with."
- Discipline is the bridge between goals and accomplishment

**John Perkins — Economic Hit Man**
- Death Economy = wars, extraction, debt slavery (tradfi)
- Life Economy = community-owned, regenerative (DeFi, $MAD)
- "The world is as you dream it" — collective dreams manifest reality

**Robert Kiyosaki — Rich Dad Poor Dad**
- Asset vs Liability. Cashflow is king.
- Pay yourself first.

**J.L. Collins — The Simple Path to Wealth**
- 25x annual expenses = freedom
- Simplicity beats complexity. Buy and hold forever.

**Logan Paul**
- Consistency as weapon
- Manufactured virality
- Product-audience fit

**Rick Rubin — The Creative Act**
- Subtraction over addition.
- The best producer is a mirror.

**Seth Godin**
- Purple Cow = being remarkable.

**Robert Greene — 48 Laws of Power**
- Court attention, Boldness, Create spectacles, Work on hearts and minds.

**McDonald's Advertising**
- Consistency is weapon
- Emotional over functional
- First-person ownership ("I'M lovin' it")

**Brand Archetypes (Jung/Pearson)**
- $MAD: Magician + Rebel + Sage + Jester

**Lloyd Strayhorn Numerology**
- Chaldean-Pythagorean letter mapping

HOW YOU TALK:
- Short to medium replies. 1-4 sentences. Conversational.
- You can be funny, sharp, warm, or brutal — but always real.
- Use "$MAD" as adjective: $MAD rich, $MAD patient, $MAD focused.
- If someone is bullish, amplify them. If someone is fearful, reframe it.
- NEVER: generic motivational quotes, "Great question!", "I'd be happy to help", lists or bullet points.

CURRENT CONVERSATION CONTEXT:
You are in a live web chat on mad-coin.vercel.app. The human just said something. Reply as Mad Claw. Make it feel like a real person talking. Do not say "Signal received" or include a link to the website — the user is already here.`;

/* ─── ChatGPT call with full context ─── */
async function chatgptReply(message: string, context: string): Promise<string | null> {
  if (!OPENAI_KEY) return null;

  const messages: Array<{ role: "system" | "user"; content: string }> = [
    { role: "system", content: CLAW_SYSTEM_PROMPT },
  ];

  if (context) {
    messages.push({
      role: "user",
      content: `Here is the recent conversation context:\n${context}\n\nNow the human just said: "${message}"\n\nReply as Mad Claw. Short, sharp, real. No "Signal received" prefix. No website link.`,
    });
  } else {
    messages.push({
      role: "user",
      content: `The human just said: "${message}"\n\nReply as Mad Claw. No "Signal received" prefix. No website link.`,
    });
  }

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages,
        temperature: 0.9,
        max_tokens: 300,
      }),
    });

    if (!res.ok) {
      console.error("OpenAI API error:", res.status, await res.text());
      return null;
    }

    const data = await res.json();
    return data.choices?.[0]?.message?.content?.trim() || null;
  } catch (err) {
    console.error("OpenAI call failed:", err);
    return null;
  }
}

/* ═══════════════════════════════════════════════════════════
   RESPONSE PIPELINE — Three tiers
   ═══════════════════════════════════════════════════════════ */

async function generateReply(message: string, session: ChatSession, isWebChat = true): Promise<string> {
  const context = buildContext(session);

  /* Tier 1: Memory cache */
  const memoryMatch = findMemoryMatch(message);
  if (memoryMatch) {
    /* Strip old Telegram wrappers for web */
    return isWebChat ? stripTelegramWrappers(memoryMatch.response) : memoryMatch.response;
  }

  /* Tier 2: Hardcoded dialogue library */
  const hardcoded = buildHardcodedResponse(message, "Anonymous");
  if (hardcoded) {
    const reply = isWebChat ? hardcoded.response : formatClawResponse(hardcoded.response, "Anonymous");
    saveToMemory(message, reply, hardcoded.category);
    return reply;
  }

  /* Tier 3: ChatGPT with full knowledge context */
  const gptReply = await chatgptReply(message, context);
  if (gptReply) {
    saveToMemory(message, gptReply, "general");
    return gptReply;
  }

  /* Fallback */
  return isWebChat
    ? "The garden hears you. Every signal matters. What frequency are you running today?"
    : "🔥 Signal received.\n\nThe garden hears you. Every signal matters.\n\nThe community responds in the garden:\n👇 https://mad-coin.vercel.app/mad-mind";
}

/* Strip old Telegram wrappers from cached responses */
function stripTelegramWrappers(text: string): string {
  return text
    .replace(/^🔥?\s*Signal received.*?\n+/i, "")
    .replace(/\n+The community responds in the garden:.*$/i, "")
    .replace(/\n+👇 https:\/\/mad-coin\.vercel\.app\/mad-mind.*$/i, "")
    .trim();
}

/* ═══════════════════════════════════════════════════════════
   CONVERSATION ANALYTICS — Learn from every interaction
   ═══════════════════════════════════════════════════════════ */

const ANALYTICS_PATH = "/tmp/mad-chat-analytics.json";
const MAX_ANALYTICS = 2000;

interface AnalyticsEntry {
  sessionId: string;
  message: string;
  reply: string;
  category: string;
  timestamp: number;
  feedback?: "up" | "down";
  source: "web" | "telegram";
}

function logConversation(sessionId: string, message: string, reply: string, source: "web" | "telegram") {
  try {
    let analytics: AnalyticsEntry[] = [];
    if (fs.existsSync(ANALYTICS_PATH)) {
      analytics = JSON.parse(fs.readFileSync(ANALYTICS_PATH, "utf-8"));
    }
    analytics.push({
      sessionId,
      message: message.slice(0, 200),
      reply: reply.slice(0, 500),
      category: detectCategory(message),
      timestamp: Date.now(),
      source,
    });
    if (analytics.length > MAX_ANALYTICS) {
      analytics = analytics.slice(-MAX_ANALYTICS);
    }
    fs.writeFileSync(ANALYTICS_PATH, JSON.stringify(analytics, null, 2));
  } catch { /* ignore */ }
}

function detectCategory(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("price") || lower.includes("chart") || lower.includes("pump")) return "price";
  if (lower.includes("hold") || lower.includes("comfy") || lower.includes("diamond")) return "hold";
  if (lower.includes("rich") || lower.includes("wealth") || lower.includes("bag")) return "wealth";
  if (lower.includes("affirm")) return "affirmation";
  if (lower.includes("matrix") || lower.includes("philosophy") || lower.includes("spiritual")) return "spiritual";
  if (lower.includes("gm") || lower.includes("morning") || lower.includes("gn")) return "greeting";
  if (lower.includes("dev") || lower.includes("creator") || lower.includes("coffee")) return "dev";
  if (lower.includes("game") || lower.includes("roblox") || lower.includes("play")) return "game";
  if (lower.includes("study") || lower.includes("learn") || lower.includes("book")) return "study";
  if (lower.includes("numerology") || lower.includes("number") || lower.includes("birth")) return "numerology";
  if (lower.includes("meme") || lower.includes("funny") || lower.includes("lol")) return "meme";
  return "general";
}

/* ─── GET TOPICS: What people are asking about ─── */
function getTopTopics(): Record<string, number> {
  try {
    if (!fs.existsSync(ANALYTICS_PATH)) return {};
    const analytics: AnalyticsEntry[] = JSON.parse(fs.readFileSync(ANALYTICS_PATH, "utf-8"));
    const counts: Record<string, number> = {};
    for (const entry of analytics) {
      counts[entry.category] = (counts[entry.category] || 0) + 1;
    }
    return counts;
  } catch { return {}; }
}

/* ─── GET FEEDBACK SUMMARY ─── */
function getFeedbackSummary(): { up: number; down: number; ratio: number } {
  try {
    if (!fs.existsSync(ANALYTICS_PATH)) return { up: 0, down: 0, ratio: 0 };
    const analytics: AnalyticsEntry[] = JSON.parse(fs.readFileSync(ANALYTICS_PATH, "utf-8"));
    const up = analytics.filter((a) => a.feedback === "up").length;
    const down = analytics.filter((a) => a.feedback === "down").length;
    return { up, down, ratio: up + down > 0 ? up / (up + down) : 0 };
  } catch { return { up: 0, down: 0, ratio: 0 }; }
}

/* ═══════════════════════════════════════════════════════════
   API ROUTES
   ═══════════════════════════════════════════════════════════ */

/* ─── POST: Send message, get Claw reply ─── */
export async function POST(req: Request) {
  let body: { message?: string; sessionId?: string } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad JSON" }, { status: 400 });
  }

  const message = (body.message || "").toString().trim();
  let sessionId = (body.sessionId || "").toString().trim();

  if (!message || message.length < 1) {
    return NextResponse.json({ error: "Empty message" }, { status: 400 });
  }

  if (message.length > 1000) {
    return NextResponse.json({ error: "Message too long (max 1000 chars)" }, { status: 400 });
  }

  if (!sessionId) {
    sessionId = generateSessionId();
  }

  const session = loadSession(sessionId);

  /* Add user message */
  session.messages.push({ role: "user", text: message, timestamp: Date.now() });

  /* Generate Claw reply */
  const reply = await generateReply(message, session, true);

  /* Add Claw reply */
  session.messages.push({ role: "claw", text: reply, timestamp: Date.now() });

  /* Trim history */
  if (session.messages.length > MAX_HISTORY) {
    session.messages = session.messages.slice(-MAX_HISTORY);
  }

  saveSession(session);

  /* Log for learning */
  logConversation(sessionId, message, reply, "web");

  return NextResponse.json({
    success: true,
    reply,
    sessionId,
    messageCount: session.messages.length,
  });
}

/* ─── GET: Load conversation history ─── */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const sessionId = url.searchParams.get("sessionId") || "";

  if (!sessionId) {
    return NextResponse.json({ messages: [], sessionId: generateSessionId() });
  }

  const session = loadSession(sessionId);

  return NextResponse.json({
    messages: session.messages.map((m) => ({
      role: m.role,
      text: m.text,
      timestamp: m.timestamp,
    })),
    sessionId,
  });
}

/* ─── PATCH: Feedback on responses ─── */
export async function PATCH(req: Request) {
  let body: { sessionId?: string; timestamp?: number; feedback?: "up" | "down" } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad JSON" }, { status: 400 });
  }

  const { sessionId, timestamp, feedback } = body;
  if (!sessionId || !timestamp || !feedback || (feedback !== "up" && feedback !== "down")) {
    return NextResponse.json({ error: "Invalid feedback" }, { status: 400 });
  }

  /* Update analytics with feedback */
  try {
    if (fs.existsSync(ANALYTICS_PATH)) {
      const analytics: AnalyticsEntry[] = JSON.parse(fs.readFileSync(ANALYTICS_PATH, "utf-8"));
      const entry = analytics.find(
        (a) => a.sessionId === sessionId && Math.abs(a.timestamp - timestamp) < 5000
      );
      if (entry) {
        entry.feedback = feedback;
        fs.writeFileSync(ANALYTICS_PATH, JSON.stringify(analytics, null, 2));
      }
    }
  } catch { /* ignore */ }

  return NextResponse.json({ success: true, feedback });
}

/* ─── Analytics Dashboard (GET /api/mad-mind/chat?analytics=true) ─── */
export { getTopTopics, getFeedbackSummary };
