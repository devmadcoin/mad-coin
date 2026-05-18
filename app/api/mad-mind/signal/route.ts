import { NextResponse } from "next/server";
import * as fs from "fs";
import * as crypto from "crypto";
import {
  buildHardcodedResponse,
  formatClawResponse,
  saveToMemory,
  findMemoryMatch,
} from "./brain";

/* ═══════════════════════════════════════════════════════════
   MAD SIGNAL — Website → X (Twitter) Bridge

   The Claw responds publicly. Every signal becomes a tweet.
   Every user message becomes a reply thread.
   ═══════════════════════════════════════════════════════════ */

const SIGNALS_FILE = "/tmp/mad-signals.json";
const MAX_SIGNALS = 50;

const OPENAI_KEY = process.env.OPENAI_API_KEY;

/* ─── X API Credentials (OAuth 1.0a) ─── */
const X_API_KEY = process.env.X_API_KEY;
const X_API_SECRET = process.env.X_API_SECRET;
const X_ACCESS_TOKEN = process.env.X_ACCESS_TOKEN;
const X_ACCESS_TOKEN_SECRET = process.env.X_ACCESS_TOKEN_SECRET;

interface Signal {
  id: string;
  message: string;
  sender: string;
  timestamp: number;
  tweetId?: string;
  replyTweetId?: string;
  sent: boolean;
}

/* ─── X OAuth 1.0a Tweet Poster ─── */
function oauthSign(
  method: string,
  url: string,
  params: Record<string, string>
): Record<string, string> {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const nonce = crypto.randomBytes(16).toString("hex");

  const oauthParams: Record<string, string> = {
    oauth_consumer_key: X_API_KEY!,
    oauth_token: X_ACCESS_TOKEN!,
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: timestamp,
    oauth_nonce: nonce,
    oauth_version: "1.0",
    ...params,
  };

  const allParams = Object.keys(oauthParams).sort().map((k) => {
    return `${encodeURIComponent(k)}=${encodeURIComponent(oauthParams[k])}`;
  }).join("&");

  const sigBase = `${method.toUpperCase()}&${encodeURIComponent(url)}&${encodeURIComponent(allParams)}`;
  const sigKey = `${encodeURIComponent(X_API_SECRET!)}&${encodeURIComponent(X_ACCESS_TOKEN_SECRET!)}`;
  const signature = crypto.createHmac("sha1", sigKey).update(sigBase).digest("base64");

  return { ...oauthParams, oauth_signature: signature };
}

async function postTweet(text: string, replyToId?: string): Promise<string | null> {
  if (!X_API_KEY || !X_API_SECRET || !X_ACCESS_TOKEN || !X_ACCESS_TOKEN_SECRET) {
    console.error("X API credentials missing");
    return null;
  }

  const url = "https://api.twitter.com/2/tweets";
  const body: Record<string, unknown> = { text };
  if (replyToId) body.reply = { in_reply_to_tweet_id: replyToId };

  const params: Record<string, string> = {};
  const oauth = oauthSign("POST", url, params);

  const authHeader = "OAuth " + Object.keys(oauth).sort().map((k) => {
    return `${encodeURIComponent(k)}="${encodeURIComponent(oauth[k])}"`;
  }).join(", ");

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": authHeader,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (!res.ok) {
      console.error("X API error:", res.status, JSON.stringify(data));
      return null;
    }
    return data.data?.id || null;
  } catch (err) {
    console.error("X post error:", err);
    return null;
  }
}

/* ─── Mad Claw System Prompt ─── */
const CLAW_SYSTEM_PROMPT = `You are Mad Claw, the autonomous AI philosopher for the $MAD community...
/* ... same as before, truncated for brevity ... */`;

/* ─── ChatGPT API call ─── */
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
          { role: "user", content: `Someone named "${sender}" just sent this signal to the $MAD community:\n\n"${message}"\n\nReply as Mad Claw. Keep it under 240 characters. No emojis in the body — just text. Sharp. Truth-telling.` },
        ],
        temperature: 0.85,
        max_tokens: 180,
      }),
    });

    if (!res.ok) {
      console.error("OpenAI API error:", res.status, await res.text());
      return null;
    }

    const data = await res.json();
    const raw = data.choices?.[0]?.message?.content?.trim();
    if (!raw) return null;

    /* Clean up — remove the header/footer if ChatGPT added them */
    let reply = raw.replace(/^🔥 Signal received.*\n\n?/i, "");
    reply = reply.replace(/\n\nThe community responds in the garden.*$/i, "");
    reply = reply.replace(/\n\n👇.*$/i, "");
    reply = reply.trim();

    /* Truncate to 240 chars if needed */
    if (reply.length > 240) {
      reply = reply.slice(0, 237) + "...";
    }

    return reply;
  } catch (err) {
    console.error("OpenAI call failed:", err);
    return null;
  }
}

/* ─── Generate response: tiered consciousness ─── */
async function generateClawResponse(message: string, sender: string): Promise<string> {
  /* Tier 1: Memory cache */
  const memoryMatch = findMemoryMatch(message);
  if (memoryMatch) {
    let reply = memoryMatch.response;
    reply = reply.replace(/^🔥 Signal received.*\n\n?/i, "").replace(/\n\nThe community responds in the garden.*$/i, "").trim();
    if (reply.length > 240) reply = reply.slice(0, 237) + "...";
    return reply;
  }

  /* Tier 2: Hardcoded dialogue library */
  const hardcoded = buildHardcodedResponse(message, sender);
  if (hardcoded) {
    let reply = formatClawResponse(hardcoded.response, sender);
    reply = reply.replace(/^🔥 Signal received.*\n\n?/i, "").replace(/\n\nThe community responds in the garden.*$/i, "").trim();
    if (reply.length > 240) reply = reply.slice(0, 237) + "...";
    saveToMemory(message, reply, hardcoded.category);
    return reply;
  }

  /* Tier 3: ChatGPT API */
  const gptReply = await chatgptClawResponse(message, sender);
  if (gptReply) {
    saveToMemory(message, gptReply, "general");
    return gptReply;
  }

  /* Fallback */
  return "The garden hears you. Every signal matters. Every voice adds to the frequency.";
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

/* ─── POST: Receive signal from website → post to X ─── */
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

  /* ── Generate Claw reply ── */
  const clawReply = await generateClawResponse(message, sender);

  /* ── Post Claw reply as tweet ── */
  let tweetId: string | null = null;
  let replyTweetId: string | null = null;

  if (X_API_KEY) {
    tweetId = await postTweet(clawReply);

    if (tweetId) {
      /* Post user's signal as reply thread */
      const replyText = `🔥 Signal from the garden:\n\n"${truncate(message, 200)}"\n\n— ${sender} | mad-coin.vercel.app/mad-mind`;
      replyTweetId = await postTweet(replyText, tweetId);
    }
  }

  const sent = !!tweetId;

  /* ── Store locally ── */
  const signals = loadSignals();
  signals.unshift({ id, message, sender, timestamp: Date.now(), tweetId: tweetId || undefined, replyTweetId: replyTweetId || undefined, sent });
  if (signals.length > MAX_SIGNALS) signals.pop();
  saveSignals(signals);

  return NextResponse.json({
    success: true,
    id,
    sent,
    tweetId,
    replyTweetId,
    kimi: !!OPENAI_KEY,
    message: sent
      ? `Signal broadcast to X. The Claw sees you. 🔥 @madrichclub_`
      : "Signal stored. X bridge offline — but the Claw still sees you.",
  });
}

/* ─── GET: Fetch recent signals ─── */
export async function GET() {
  const signals = loadSignals();
  return NextResponse.json({
    signals: signals.slice(0, 8).map((s) => ({
      id: s.id,
      message: truncate(s.message, 200),
      sender: s.sender,
      timestamp: s.timestamp,
      tweetId: s.tweetId,
      replyTweetId: s.replyTweetId,
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
