import { NextResponse } from "next/server";

type TrackEvent =
  | "message_sent"
  | "copy_clicked"
  | "share_x_clicked"
  | "say_it_harder_clicked"
  | "cook_level_changed"
  | "respect_mode_hit"
  | "roast_card_opened"
  | "roast_card_copied"
  | "challenge_completed"
  | "archetype_revealed"
  | "leaderboard_submitted"
  | "session_best_roast_selected"
  | "share_score_clicked"
  | "challenge_friend_clicked";

type TrackValue = string | number | boolean | null;

type TrackPayload = {
  event?: TrackEvent;
  payload?: Record<string, TrackValue>;
  timestamp?: string;
};

type TrackEntry = {
  event: TrackEvent;
  payload: Record<string, TrackValue>;
  timestamp: string;
};

const MAX_EVENTS = 1000;
const MAX_RETURNED_EVENTS = 200;
const MAX_PAYLOAD_KEYS = 40;
const MAX_STRING_LENGTH = 2000;

const ALLOWED_EVENTS = new Set<TrackEvent>([
  "message_sent",
  "copy_clicked",
  "share_x_clicked",
  "say_it_harder_clicked",
  "cook_level_changed",
  "respect_mode_hit",
  "roast_card_opened",
  "roast_card_copied",
  "challenge_completed",
  "archetype_revealed",
  "leaderboard_submitted",
  "session_best_roast_selected",
  "share_score_clicked",
  "challenge_friend_clicked",
]);

const recentEvents: TrackEntry[] = [];

function isTrackValue(value: unknown): value is TrackValue {
  return (
    value === null ||
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  );
}

function sanitizePayload(
  payload: unknown
): Record<string, TrackValue> | null {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return null;
  }

  const entries = Object.entries(payload).slice(0, MAX_PAYLOAD_KEYS);
  const sanitized: Record<string, TrackValue> = {};

  for (const [key, value] of entries) {
    if (!key || typeof key !== "string") continue;
    if (!isTrackValue(value)) continue;

    if (typeof value === "string") {
      sanitized[key] = value.slice(0, MAX_STRING_LENGTH);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

function isValidTimestamp(value: unknown) {
  if (typeof value !== "string") return false;
  return !Number.isNaN(new Date(value).getTime());
}

export async function POST(req: Request) {
  try {
    const body: TrackPayload = await req.json();

    if (!body.event || !ALLOWED_EVENTS.has(body.event)) {
      return NextResponse.json(
        { ok: false, error: "Invalid or missing event." },
        { status: 400 }
      );
    }

    const payload = sanitizePayload(body.payload);

    if (!payload) {
      return NextResponse.json(
        { ok: false, error: "Invalid or missing payload." },
        { status: 400 }
      );
    }

    const entry: TrackEntry = {
      event: body.event,
      payload,
      timestamp:
        body.timestamp && isValidTimestamp(body.timestamp)
          ? body.timestamp
          : new Date().toISOString(),
    };

    recentEvents.push(entry);

    if (recentEvents.length > MAX_EVENTS) {
      recentEvents.splice(0, recentEvents.length - MAX_EVENTS);
    }

    console.log("[MAD TRACK SAVED]", entry);

    return NextResponse.json({
      ok: true,
      saved: true,
      count: recentEvents.length,
    });
  } catch (error) {
    console.error("MAD track route error:", error);

    return NextResponse.json(
      { ok: false, error: "Track route failed." },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    count: recentEvents.length,
    events: recentEvents.slice(-MAX_RETURNED_EVENTS).reverse(),
  });
}
