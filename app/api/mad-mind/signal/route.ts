import { NextResponse } from "next/server";
import * as fs from "fs";
import * as path from "path";

/* ═══════════════════════════════════════════════════════════
   MAD SIGNAL — Website → Telegram Group Bridge
   
   What it does:
   1. Visitor types something on mad-coin.vercel.app/mad-mind
   2. Frontend POSTs to /api/mad-mind/signal
   3. Backend forwards message to $MAD Telegram group
   4. Backend stores message in /tmp/mad-signals.json
   5. "Recent Signals" wall reads from this file
   
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

  /* ── Forward to Telegram ── */
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
          }),
        }
      );
      const tgData = await tgRes.json();
      sent = tgData.ok === true;
    } catch {
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
