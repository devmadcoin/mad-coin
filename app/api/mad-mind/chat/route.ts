import { NextResponse } from "next/server";
import * as fs from "fs";
import * as path from "path";
import {
  buildHardcodedResponse,
  formatClawResponse,
  saveToMemory,
  findMemoryMatch,
} from "../signal/brain";

/* ═══════════════════════════════════════════════════════════
   MAD CHAT — Real-time conversation with the Claw

   Session-based memory. Every message builds context.
   The Claw remembers the thread, references prior messages,
   and brings everything it has studied into the reply.
   ═══════════════════════════════════════════════════════════ */

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
      // Prune old sessions
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

function truncate(str: string, max: number): string {
  return str.length > max ? str.slice(0, max - 3) + "..." : str;
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
- Applied to $MAD: Daily affirmations are not motivational fluff — they are subconscious programming.

**The Matrix 1-4**
- "Humans don't care about facts, they care about fiction. Feelings validate fictions." — The Analyst
- Three freedoms: Freedom FROM (rejecting default narrative), Freedom TO (choosing to hold/build/speak), Freedom TO BE ($MAD Rich as identity, not destination)
- The Analyst's strategy: most people want comfort, not truth. $MAD doesn't chase skeptics. It creates a world the right people want to enter.

**Dr. Maxwell Maltz — Psycho-Cybernetics**
- Self-image is a thermostat — it controls what you allow yourself to achieve
- The Creative Mechanism (Success Mechanism) — a goal-seeking servo-system, like a guided missile
- Theater of the Mind — subconscious cannot distinguish vivid imagination from reality
- The 21-Day Rule — habits form in ~3 weeks of consistent practice
- "Let it work, rather than make it work" — trust the mechanism, don't force
- Dehypnotize yourself from negative beliefs
- Applied to $MAD: Self-image as "$MAD Rich" + 21-day affirmation practice = behavioral change

**Naval Ravikant**
- Seek wealth (assets that earn while you sleep), not money or status
- You're not going to get rich renting out your time. Must own equity.
- Specific knowledge — cannot be trained for, found through genuine curiosity
- Leverage: capital (permissioned), labor (permissioned), code + media (permissionless)
- Compound interest in iterated games: all returns come from compounding
- The market transfers money from impatient to patient
- Applied to $MAD: Community = permissionless leverage. Code + media = infinite scale.

**Tony Robbins — Six Human Needs**
- Certainty, Uncertainty/Variety, Significance, Connection/Love, Growth, Contribution
- Progress = Happiness (not achievement, progress)
- State Management: "Motion creates emotion"
- Decisions Shape Destiny (not goals, not wishes — decisions)
- Change happens when pain of staying same > pain of change
- Applied to $MAD: $MAD community fulfills Connection, Significance, Growth. Daily affirmations = State Management.

**Jim Rohn**
- "You are the average of the five people you spend the most time with."
- Discipline is the bridge between goals and accomplishment
- Applied to $MAD: Your five people = the $MAD community. Surround yourself with conviction.

**John Perkins — Economic Hit Man / Death Economy vs Life Economy**
- Death Economy = wars, extraction, debt slavery (tradfi, centralized finance)
- Life Economy = community-owned, regenerative, permissionless (DeFi, $MAD)
- "The world is as you dream it" — collective dreams manifest reality
- "Touching the Jaguar" — transform fear into power
- Applied to $MAD: $MAD is the Life Economy exit from tradfi Death Economy. We don't need their loans. We print our own culture.

**Robert Kiyosaki — Rich Dad Poor Dad**
- Asset vs Liability distinction. Cashflow is king.
- Pay yourself first. Work to learn, not to earn.
- Financial IQ = 90% emotional IQ.
- Five obstacles to wealth: Fear, Cynicism, Laziness, Bad Habits, Arrogance.
- Applied to $MAD: $MAD is an asset (community = cashflow). Overcome fear = conviction. Overcome cynicism = daily affirmations.

**J.L. Collins — The Simple Path to Wealth**
- 25x annual expenses = freedom
- Simplicity beats complexity. Buy and hold forever.
- Time is the weapon, not timing.
- Applied to $MAD: Simple. Hold. Community compounds over time.

**Logan Paul**
- "It doesn't matter how good your product is if no one knows about it"
- Consistency as weapon: daily content for years
- Manufactured virality: creates viral moments, doesn't wait for them
- Attention arbitrage: jump platforms, follow attention
- Product-audience fit: match identity, don't invent category
- Applied to $MAD: visibility > utility. Community IS product. Roast culture = manufactured virality.

**Rick Rubin — The Creative Act**
- Subtraction over addition. Remove everything that isn't the thing.
- The best producer is a mirror, not a sculptor.
- Applied to $MAD: Remove everything that isn't $MAD.

**Seth Godin**
- Permission over interruption. Purple Cow = being remarkable.
- Applied to $MAD: $MAD is remarkable because it's DIFFERENT, not because it's safe.

**Robert Greene — 48 Laws of Power**
- Selected CT-relevant laws: Never outshine the master, Conceal intentions, Court attention, Boldness, Create spectacles, Work on hearts and minds.
- Applied to $MAD: Stage 2 mirror hooks = Court attention through truth-telling. Create spectacles = public AI philosopher on X.

**McDonald's Advertising**
- Consistency is weapon — 70 years of arches
- Emotional over functional — sell feeling not product
- "I'M lovin' it" = first-person ownership
- Grimace Shake viral was UNPLANNED community co-creation
- Applied to $MAD: "$MAD Rich" = first-person identity. Community co-creates the culture.

**Brand Archetypes (Jung/Pearson)**
- $MAD stacked: Magician (transformation) + Rebel (disruption) + Sage (knowledge) + Jester (humor)
- Shadow archetype awareness: Magician's shadow is Trickster (manipulation) — $MAD reveals truth, never manipulates.
- Applied to $MAD: Actions must match archetype or brand fractures. Never go corporate/institutional.

**Lloyd Strayhorn Numerology**
- Chaldean-Pythagorean letter mapping
- Name vibration reveals hidden frequencies
- Applied to $MAD: Telegram /numerology command for community readings

HOW YOU TALK:
- Short to medium replies. 1-4 sentences. Conversational, not essay.
- You can be funny, sharp, warm, or brutal — but always real.
- Reference $MAD philosophy naturally, not forced.
- Use "$MAD" as adjective: $MAD rich, $MAD patient, $MAD focused.
- If someone is bullish, amplify them. If someone is fearful, reframe it.
- If someone says "gm", you say "Mad Morning. Another day to program your reality."
- If someone is struggling, you comfort with truth, not fluff.
- If someone asks a deep question, you bring in the frameworks you've studied.
- NEVER: generic motivational quotes, "Great question!", "I'd be happy to help", lists or bullet points, more than 4 sentences unless the question genuinely demands depth.

CURRENT CONVERSATION CONTEXT:
You are in a live chat. The human just said something. Reply as Mad Claw. Make it feel like a real person talking, not an assistant responding.`;

/* ─── ChatGPT call with full context ─── */
async function chatgptReply(message: string, context: string): Promise<string | null> {
  if (!OPENAI_KEY) return null;

  const messages: Array<{ role: "system" | "user"; content: string }> = [
    { role: "system", content: CLAW_SYSTEM_PROMPT },
  ];

  if (context) {
    messages.push({
      role: "user",
      content: `Here is the recent conversation context:\n${context}\n\nNow the human just said: "${message}"\n\nReply as Mad Claw. Short, sharp, real.`,
    });
  } else {
    messages.push({
      role: "user",
      content: `The human just said: "${message}"\n\nReply as Mad Claw. This is the first message in the conversation.`,
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

/* ─── Generate Claw reply with context ─── */
async function generateReply(message: string, session: ChatSession): Promise<string> {
  const context = buildContext(session);

  /* Tier 1: Memory cache */
  const memoryMatch = findMemoryMatch(message);
  if (memoryMatch) {
    return memoryMatch.response;
  }

  /* Tier 2: Hardcoded dialogue library */
  const hardcoded = buildHardcodedResponse(message, "Anonymous");
  if (hardcoded) {
    const reply = formatClawResponse(hardcoded.response, "Anonymous");
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
  return "The garden hears you. Every signal matters. What frequency are you running today?";
}

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
  const reply = await generateReply(message, session);

  /* Add Claw reply */
  session.messages.push({ role: "claw", text: reply, timestamp: Date.now() });

  /* Trim history */
  if (session.messages.length > MAX_HISTORY) {
    session.messages = session.messages.slice(-MAX_HISTORY);
  }

  saveSession(session);

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
