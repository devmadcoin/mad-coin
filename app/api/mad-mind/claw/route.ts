import { NextResponse } from "next/server";
import * as fs from "fs";
import * as path from "path";

/* ═══════════════════════════════════════════════════════════
   MAD CLAW INTEGRATION — Async Polling Backend
   ═══════════════════════════════════════════════════════════

   How it works:
   1. Frontend POSTs message → this route
   2. Route writes request to /tmp/mad-claw/in/{requestId}.json
   3. Route returns { requestId, status: "pending", pollUrl }
   4. MadClaw (me) polls GET /api/mad-mind/claw to find pending requests
   5. MadClaw writes response to /tmp/mad-claw/out/{requestId}.json
   6. Frontend polls GET /api/mad-mind/claw?requestId=xxx until response ready

   NOTE: /tmp is ephemeral on Vercel. For production, swap to Redis/DB.
   ═══════════════════════════════════════════════════════════ */

const IN_DIR = "/tmp/mad-claw/in";
const OUT_DIR = "/tmp/mad-claw/out";

type ClawRequest = {
  requestId: string;
  sessionId: string;
  message: string;
  style: string;
  timestamp: number;
  status: "pending" | "processing" | "done";
};

type ClawResponse = {
  requestId: string;
  output: string;
  meta: {
    intent: string;
    states: string[];
    mood: string;
    processedAt: string;
  };
  timestamp: number;
};

function ensureDirs() {
  try {
    if (!fs.existsSync(IN_DIR)) fs.mkdirSync(IN_DIR, { recursive: true });
    if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });
  } catch {
    /* ignore */
  }
}

function readJson<T>(filePath: string): T | null {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8")) as T;
  } catch {
    return null;
  }
}

function writeJson(filePath: string, data: unknown) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch {
    /* ignore */
  }
}

/* ─── POST: Receive message from frontend ─── */
export async function POST(req: Request) {
  ensureDirs();

  let body: { message?: string; sessionId?: string; style?: string } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad JSON" }, { status: 400 });
  }

  const requestId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const sessionId = (body.sessionId || "anon").toString().slice(0, 120);
  const message = (body.message || "").toString().trim().slice(0, 700);

  if (!message) {
    return NextResponse.json({ error: "Empty message" }, { status: 400 });
  }

  const clawReq: ClawRequest = {
    requestId,
    sessionId,
    message,
    style: body.style || "savage",
    timestamp: Date.now(),
    status: "pending",
  };

  writeJson(path.join(IN_DIR, `${requestId}.json`), clawReq);

  const baseUrl = req.headers.get("origin") || "https://mad-coin.vercel.app";
  const pollUrl = `${baseUrl}/api/mad-mind/claw?requestId=${requestId}`;

  return NextResponse.json({
    requestId,
    status: "pending",
    pollUrl,
    message: "Message queued. MadClaw will respond.",
  });
}

/* ─── GET: Poll for response OR list pending for Claw ─── */
export async function GET(req: Request) {
  ensureDirs();

  const { searchParams } = new URL(req.url);
  const requestId = searchParams.get("requestId");
  const listPending = searchParams.get("listPending") === "true";

  /* Mode A: Frontend polling for a specific response */
  if (requestId) {
    const outPath = path.join(OUT_DIR, `${requestId}.json`);
    const response = readJson<ClawResponse>(outPath);

    if (response) {
      return NextResponse.json({
        requestId,
        status: "done",
        output: response.output,
        meta: response.meta,
      });
    }

    const inPath = path.join(IN_DIR, `${requestId}.json`);
    const request = readJson<ClawRequest>(inPath);

    if (!request) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    return NextResponse.json({
      requestId,
      status: request.status,
      message: request.status === "pending" ? "Waiting for MadClaw..." : "Processing...",
    });
  }

  /* Mode B: MadClaw polling for pending requests */
  if (listPending) {
    try {
      const files = fs.readdirSync(IN_DIR).filter((f) => f.endsWith(".json"));
      const pending: ClawRequest[] = [];

      for (const file of files) {
        const req = readJson<ClawRequest>(path.join(IN_DIR, file));
        if (req && req.status === "pending") {
          pending.push(req);
        }
      }

      return NextResponse.json({
        pending: pending.sort((a, b) => a.timestamp - b.timestamp),
        count: pending.length,
      });
    } catch {
      return NextResponse.json({ pending: [], count: 0 });
    }
  }

  /* Default: integration status */
  return NextResponse.json({
    status: "MAD Claw integration active",
    version: "1.0",
    note: "Use POST to queue a message. Use ?requestId=xxx to poll for response. Use ?listPending=true to see queue.",
  });
}

/* ─── PUT: MadClaw submitting a response ─── */
export async function PUT(req: Request) {
  ensureDirs();

  let body: { requestId?: string; output?: string; meta?: ClawResponse["meta"] } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad JSON" }, { status: 400 });
  }

  const requestId = body.requestId;
  const output = (body.output || "").toString().trim();

  if (!requestId || !output) {
    return NextResponse.json({ error: "Missing requestId or output" }, { status: 400 });
  }

  /* Mark request as done */
  const inPath = path.join(IN_DIR, `${requestId}.json`);
  const request = readJson<ClawRequest>(inPath);
  if (request) {
    request.status = "done";
    writeJson(inPath, request);
  }

  /* Write response */
  const clawResp: ClawResponse = {
    requestId,
    output,
    meta: body.meta || { intent: "GENERAL", states: [], mood: "direct", processedAt: new Date().toISOString() },
    timestamp: Date.now(),
  };

  writeJson(path.join(OUT_DIR, `${requestId}.json`), clawResp);

  return NextResponse.json({ success: true, requestId });
}