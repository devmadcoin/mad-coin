import { NextResponse } from "next/server";

type TrackEvent =
  | "message_sent"
  | "copy_clicked"
  | "share_x_clicked"
  | "say_it_harder_clicked";

type TrackPayload = {
  event?: TrackEvent;
  payload?: Record<string, string | number | boolean | null>;
  timestamp?: string;
};

const recentEvents: Array<{
  event: TrackEvent;
  payload: Record<string, string | number | boolean | null>;
  timestamp: string;
}> = [];

export async function POST(req: Request) {
  try {
    const body: TrackPayload = await req.json();

    if (!body.event || !body.payload) {
      return NextResponse.json(
        { ok: false, error: "Missing event or payload." },
        { status: 400 }
      );
    }

    const entry = {
      event: body.event,
      payload: body.payload,
      timestamp: body.timestamp || new Date().toISOString(),
    };

    recentEvents.push(entry);

    if (recentEvents.length > 500) {
      recentEvents.shift();
    }

    console.log("[MAD TRACK SAVED]", entry);

    return NextResponse.json({ ok: true });
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
    events: recentEvents.slice(-100).reverse(),
  });
}
