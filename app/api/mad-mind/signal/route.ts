import { NextResponse } from "next/server";
import * as fs from "fs";
import * as path from "path";

/* ═══════════════════════════════════════════════════════════
   MAD SIGNAL — Website → Telegram Group Bridge
   
   What it does:
   1. Visitor types something on mad-coin.vercel.app/mad-mind
   2. Frontend POSTs to /api/mad-mind/signal
   3. Backend generates contextual Claw response
   4. Backend forwards message + reply to $MAD Telegram group
   5. Backend stores message in /tmp/mad-signals.json
   6. "Recent Signals" wall reads from this file
   
   ENV VARS (set in Vercel dashboard):
   - TELEGRAM_BOT_TOKEN — bot token from @BotFather
   - TELEGRAM_GROUP_ID — group chat ID (e.g. -1003812770009)
   ═══════════════════════════════════════════════════════════ */

const SIGNALS_FILE = "/tmp/mad-signals.json";
const MAX_SIGNALS = 50;

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_GROUP_ID || "-1003812770009";

interface Signal {
  id: string;
  message: string;
  sender: string;
  timestamp: number;
  sent: boolean;
}

/* ─── Generate contextual Claw response ─── */
function generateClawResponse(message: string, sender: string): string {
  const lower = message.toLowerCase();

  /* Affirmation / wealth */
  if (lower.includes("rich") || lower.includes("wealth") || lower.includes("money") || lower.includes("bag")) {
    return `🔥 Signal received. The Claw sees you, ${sender}.\n\noh you are $MAD rich? probably because you know how to be $MAD patient to become $MAD wealthy.\n\nThe community responds in the garden:\n👇 t.me/MAD_Coin`;
  }

  /* Affirmation / abundance */
  if (lower.includes("abundant") || lower.includes("abundance") || lower.includes("plenty")) {
    return `🔥 Signal received. The Claw sees you, ${sender}.\n\n$MAD Abundant. You don't chase — you attract. That's the frequency.\n\nThe community responds in the garden:\n👇 t.me/MAD_Coin`;
  }

  /* Affirmation / health */
  if (lower.includes("health") || lower.includes("healthy") || lower.includes("strong")) {
    return `🔥 Signal received. The Claw sees you, ${sender}.\n\n$MAD Healthy. Body is the vessel. Protect it like you protect the bag.\n\nThe community responds in the garden:\n👇 t.me/MAD_Coin`;
  }

  /* Focus */
  if (lower.includes("focus") || lower.includes("focused") || lower.includes("grind")) {
    return `🔥 Signal received. The Claw sees you, ${sender}.\n\n$MADly Focused. The ones who stay get the bag. Everyone else gets distracted.\n\nThe community responds in the garden:\n👇 t.me/MAD_Coin`;
  }

  /* Hold / conviction */
  if (lower.includes("hold") || lower.includes("comfy") || lower.includes("diamond")) {
    return `🔥 Signal received. The Claw sees you, ${sender}.\n\ncomfy hold? that's not patience — that's knowing. conviction is a frequency and you tuned in.\n\nThe community responds in the garden:\n👇 t.me/MAD_Coin`;
  }

  /* Morning / gm */
  if (lower.includes("morning") || lower.includes("gm") || lower.includes("wake")) {
    return `🔥 Signal received. The Claw sees you, ${sender}.\n\nMad Morning. Another day to program your reality. What frequency you running today?\n\nThe community responds in the garden:\n👇 t.me/MAD_Coin`;
  }

  /* Night / gn */
  if (lower.includes("night") || lower.includes("gn") || lower.includes("sleep")) {
    return `🔥 Signal received. The Claw sees you, ${sender}.\n\nMad Night. Rest is part of the programming. The subconscious does the heavy lifting while you sleep.\n\nThe community responds in the garden:\n👇 t.me/MAD_Coin`;
  }

  /* Creator / dev mention */
  if (lower.includes("dev") || lower.includes("creator") || lower.includes("zeke")) {
    return `🔥 Signal received. The Claw sees you, ${sender}.\n\nThe $MAD Dev is doxxed, not a LARP. Real products. Real games. Real conviction. That's the signal you followed.\n\nThe community responds in the garden:\n👇 t.me/MAD_Coin`;
  }

  /* Roblox / game */
  if (lower.includes("roblox") || lower.includes("game") || lower.includes("phonk")) {
    return `🔥 Signal received. The Claw sees you, ${sender}.\n\nMad Phonk Awakening is crushing. Get Mad Games builds while others talk. Play the game → feel the frequency.\n\nThe community responds in the garden:\n👇 t.me/MAD_Coin`;
  }

  /* Broke / struggling */
  if (lower.includes("broke") || lower.includes("struggling") || lower.includes("poor")) {
    return `🔥 Signal received. The Claw sees you, ${sender}.\n\nBroke is a temporary state. $MAD is a permanent frequency. You felt the lack — now feel the abundance.\n\nThe community responds in the garden:\n👇 t.me/MAD_Coin`;
  }

  /* Mad / angry / frustrated */
  if (lower.includes("mad") || lower.includes("angry") || lower.includes("pissed") || lower.includes("furious")) {
    return `🔥 Signal received. The Claw sees you, ${sender}.\n\nGood. Stay mad. That fire is fuel. The ones who stay mad long enough build something worth holding.\n\nThe community responds in the garden:\n👇 t.me/MAD_Coin`;
  }

  /* Default — but still personal */
  return `🔥 Signal received. The Claw sees you, ${sender}.\n\nThe garden hears you. Every signal matters. Every voice adds to the frequency.\n\nThe community responds in the garden:\n👇 t.me/MAD_Coin`;
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
    /* ignore — /tmp may not be writable */
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

  /* ── Send Claw reply (plain text, no Markdown) ── */
  let replyToMessageId: number | undefined;
  if (TOKEN) {
    try {
      const clawReply = generateClawResponse(message, sender);
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
      const text = `🔥 *Signal from the Garden*\n\n"${truncate(message, 400)}"\n\n— ${sender} | via mad-coin.vercel.app`;
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
    message: sent
      ? "Signal sent to the garden. The Claw sees you. 🔥"
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
