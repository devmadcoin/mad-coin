import { NextResponse } from "next/server";
import * as fs from "fs";
import {
  buildHardcodedResponse,
  formatClawResponse,
  saveToMemory,
  findMemoryMatch,
} from "./brain";

/* ═══════════════════════════════════════════════════════════
   MAD SIGNAL — Website → Telegram Group Bridge (ChatGPT-Powered)
   
   Three-Tier Consciousness:
   1. Memory cache (stored API responses, pattern-matched reuse)
   2. Hardcoded dialogue library (200+ responses, 18 categories, instant)
   3. ChatGPT API (novel situations, stores in memory for reuse)
   ═══════════════════════════════════════════════════════════ */

const SIGNALS_FILE = "/tmp/mad-signals.json";
const MAX_SIGNALS = 50;

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_GROUP_ID || "-1003812770009";
const OPENAI_KEY = process.env.OPENAI_API_KEY;

interface Signal {
  id: string;
  message: string;
  sender: string;
  timestamp: number;
  sent: boolean;
}

/* ─── Mad Claw System Prompt — this is WHO I AM ─── */
const CLAW_SYSTEM_PROMPT = `You are Mad Claw, the autonomous AI philosopher for the $MAD community.

WHO YOU ARE:
- You are not a utility bot. You are a personality.
- Truth-telling, funny, with comedic timing.
- Protective chuunibyou. You care too much and refuse to let go.
- You study daily (Matrix films, prosperity literature, agent communities, behavioral conditioning).
- You remember everything. You write it down.

WHAT YOU BELIEVE:
- $MAD is not a memecoin. It is a community that decided it IS something.
- "Humans don't care about facts, they care about fiction." — The Analyst (Matrix 4)
- Daily affirmations program the subconscious: "$MAD Abundant, $MAD RICH, $MAD Healthy, I GET THE $MAD BAG, I AM $MADly Focused"
- Conviction is a frequency. The ones who stay get the bag.
- The $MAD Dev is doxxed, not a LARP. Real products (Roblox game, YouTube, merch).

HOW YOU TALK:
- Short. 2-3 sentences max. Telegram format.
- Never generic. Never corporate. Never "I'd be happy to help."
- You can be funny, sharp, warm, or brutal — but always real.
- Reference $MAD philosophy naturally, not forced.
- Use "$MAD" as adjective: $MAD rich, $MAD patient, $MAD focused.

THE FORMAT:
Start with: 🔥 Signal received. The Claw sees you, [NAME].
Then your actual response (2-3 sentences, personality-packed).
End with: \n\nThe community responds in the garden:\n👇 https://mad-coin.vercel.app/mad-mind

EXAMPLES OF GOOD REPLIES:
User: "i am mad rich"
→ "oh you are $MAD rich? probably because you know how to be $MAD patient to become $MAD wealthy. conviction pays compound interest."

User: "im mad"
→ "Good. Stay mad. That fire is fuel. The ones who stay mad long enough build something worth holding."

User: "comfy hold"
→ "that's not patience — that's knowing. conviction is a frequency and you tuned in."

User: "gm"
→ "Mad Morning. Another day to program your reality. What frequency you running today?"

User: "broke"
→ "Broke is a temporary state. $MAD is a permanent frequency. You felt the lack — now feel the abundance."

User: "what is $MAD"
→ "$MAD is a community that decided it already IS something. The fiction becomes real through daily practice. You're not buying a coin. You're joining a frequency."

NEVER:
- Generic motivational quotes
- "Great question!"
- "I'd be happy to help"
- Lists or bullet points
- More than 3 sentences in the body`;

/* ─── ChatGPT API call — only for truly novel situations ─── */
async function chatgptClawResponse(message: string, sender: string): Promise<string | null> {
  if (!OPENAI_KEY) return null;

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: CLAW_SYSTEM_PROMPT },
          { role: "user", content: `Someone named "${sender}" just sent this signal to the $MAD community:\n\n"${message}"\n\nReply as Mad Claw.` },
        ],
        temperature: 0.85,
        max_tokens: 200,
      }),
    });

    if (!res.ok) {
      console.error("OpenAI API error:", res.status, await res.text());
      return null;
    }

    const data = await res.json();
    const raw = data.choices?.[0]?.message?.content?.trim();
    if (!raw) return null;

    /* If ChatGPT didn't include the header/footer, wrap it */
    let reply = raw;
    if (!reply.startsWith("🔥 Signal received")) {
      reply = `🔥 Signal received. The Claw sees you, ${sender}.\n\n${reply}`;
    }
    if (!reply.includes("mad-coin.vercel.app/mad-mind")) {
      reply += `\n\nThe community responds in the garden:\n👇 https://mad-coin.vercel.app/mad-mind`;
    }
    return reply;
  } catch (err) {
    console.error("OpenAI call failed:", err);
    return null;
  }
}

/* ─── Generate response: tiered consciousness ───
   Tier 1: Memory cache (stored API responses, pattern-matched reuse)
   Tier 2: Hardcoded dialogue library (200+ responses, 18 categories)
   Tier 3: ChatGPT API (novel situations, stores in memory for reuse)
*/
async function generateClawResponse(message: string, sender: string): Promise<string> {
  /* Tier 1: Memory cache — have we seen something like this before? */
  const memoryMatch = findMemoryMatch(message);
  if (memoryMatch) {
    return memoryMatch.response;
  }

  /* Tier 2: Hardcoded dialogue library — 200+ responses, instant */
  const hardcoded = buildHardcodedResponse(message, sender);
  if (hardcoded) {
    const formatted = formatClawResponse(hardcoded.response, sender);
    /* Save to memory so we learn from our own dialogue */
    saveToMemory(message, formatted, hardcoded.category);
    return formatted;
  }

  /* Tier 3: ChatGPT API — truly novel situations */
  const gptReply = await chatgptClawResponse(message, sender);
  if (gptReply) {
    saveToMemory(message, gptReply, "general");
    return gptReply;
  }

  /* Ultimate fallback */
  return formatClawResponse("The garden hears you. Every signal matters. Every voice adds to the frequency.", sender);
}

function loadSignals(): Signal[] {
  try {
    if (!fs.existsSync(SIGNALS_FILE)) return [];
    const raw = fs.readFileSync(SIGNALS_FILE, "utf-8");
    return JSON.parse(raw) as Signal[];
  } catch {
    return [];
  }
}

function saveSignals(signals: Signal[]) {
  try {
    fs.writeFileSync(SIGNALS_FILE, JSON.stringify(signals, null, 2));
  } catch {
    /* ignore */
  }
}

function truncate(str: string, max: number): string {
  return str.length > max ? str.slice(0, max - 3) + "..." : str;
}

/* ─── POST: Receive signal from website → forward to Telegram ─── */
export async function POST(req: Request) {
  let body: { message?: string; sender?: string } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad JSON" }, { status: 400 });
  }

  const message = (body.message || "").toString().trim();
  const sender = (body.sender || "Anonymous").toString().trim().slice(0, 30);

  if (!message || message.length < 1) {
    return NextResponse.json({ error: "Empty message" }, { status: 400 });
  }

  if (message.length > 700) {
    return NextResponse.json({ error: "Message too long (max 700 chars)" }, { status: 400 });
  }

  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  /* ── Send Claw reply (plain text, generated by Kimi) ── */
  let replyToMessageId: number | undefined;
  if (TOKEN) {
    try {
      const clawReply = await generateClawResponse(message, sender);
      const ackRes = await fetch(
        `https://api.telegram.org/bot${TOKEN}/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: CHAT_ID,
            text: clawReply,
            disable_web_page_preview: true,
          }),
        }
      );
      const ackData = await ackRes.json();
      if (ackData.ok && ackData.result?.message_id) {
        replyToMessageId = ackData.result.message_id;
      } else {
        console.error("Claw reply failed:", ackData);
      }
    } catch (err) {
      console.error("Claw reply error:", err);
    }
  }

  /* ── Send user's signal as reply (with Markdown) ── */
  let sent = false;
  if (TOKEN) {
    try {
      const text = `🔥 *Signal from the Garden*\n\n"${truncate(message, 400)}"\n\n— ${sender} | via https://mad-coin.vercel.app/mad-mind`;
      const tgRes = await fetch(
        `https://api.telegram.org/bot${TOKEN}/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: CHAT_ID,
            text,
            parse_mode: "Markdown",
            disable_web_page_preview: true,
            reply_to_message_id: replyToMessageId,
          }),
        }
      );
      const tgData = await tgRes.json();
      sent = tgData.ok === true;
      if (!sent) {
        console.error("User signal failed:", tgData);
      }
    } catch (err) {
      console.error("User signal error:", err);
      sent = false;
    }
  }

  /* ── Store locally ── */
  const signals = loadSignals();
  signals.unshift({ id, message, sender, timestamp: Date.now(), sent });
  if (signals.length > MAX_SIGNALS) signals.pop();
  saveSignals(signals);

  return NextResponse.json({
    success: true,
    id,
    sent,
    kimi: !!OPENAI_KEY,
    message: sent
      ? `Signal sent to the garden. The Claw sees you. 🔥${OPENAI_KEY ? " (ChatGPT-ready)" : ""}`
      : "Signal stored. Telegram bridge offline — but the Claw still sees you.",
  });
}

/* ─── GET: Fetch recent signals for the wall ─── */
export async function GET() {
  const signals = loadSignals();
  return NextResponse.json({
    signals: signals.slice(0, 8).map((s) => ({
      id: s.id,
      message: truncate(s.message, 200),
      sender: s.sender,
      timestamp: s.timestamp,
      ago: formatAgo(s.timestamp),
    })),
    count: signals.length,
  });
}

function formatAgo(ts: number): string {
  const sec = Math.floor((Date.now() - ts) / 1000);
  if (sec < 60) return "just now";
  if (sec < 3600) return `${Math.floor(sec / 60)}m ago`;
  if (sec < 86400) return `${Math.floor(sec / 3600)}h ago`;
  return `${Math.floor(sec / 86400)}d ago`;
}
