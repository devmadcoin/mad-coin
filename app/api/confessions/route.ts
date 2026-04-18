import { kv } from "@vercel/kv";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type ReactionKey = "same" | "lol" | "handshake";

type Confession = {
  id: string;
  text: string;
  createdAt: number;
  reactions: Record<ReactionKey, number>;
};

const KEY = "mad:confessions";
const ITEM = (id: string) => `mad:confession:${id}`;
const MAX_ITEMS = 200;
const MAX_TEXT = 240;

function clampText(value: string, max = MAX_TEXT) {
  const text = (value || "").replace(/\s+/g, " ").trim();
  return text.length > max ? text.slice(0, max).trim() : text;
}

function makeId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function isReactionKey(value: unknown): value is ReactionKey {
  return value === "same" || value === "lol" || value === "handshake";
}

function toStringSafe(value: unknown): string | null {
  if (typeof value === "string") return value;

  if (value && typeof value === "object" && "toString" in value) {
    try {
      const result = value.toString();
      return typeof result === "string" ? result : null;
    } catch {
      return null;
    }
  }

  return null;
}

function safeJson<T>(raw: unknown): T | null {
  try {
    const text = toStringSafe(raw);
    if (!text) return null;
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

function normalizeId(value: unknown): string | null {
  const text = toStringSafe(value);
  if (!text) return null;
  const clean = text.trim();
  return clean ? clean : null;
}

export async function GET() {
  try {
    const rawIds = (await kv.lrange(KEY, 0, MAX_ITEMS - 1)) ?? [];
    const ids = rawIds
      .map(normalizeId)
      .filter((id): id is string => Boolean(id));

    if (ids.length === 0) {
      return NextResponse.json({ confessions: [] });
    }

    const items = await Promise.all(
      ids.map((id) => kv.get<Confession>(ITEM(id)))
    );

    const confessions = items
      .filter((item): item is Confession => Boolean(item))
      .sort((a, b) => b.createdAt - a.createdAt);

    return NextResponse.json({ confessions });
  } catch (error) {
    const message = error instanceof Error ? error.message : "KV error";

    return NextResponse.json(
      { confessions: [], error: message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const text = clampText(String((body as { text?: unknown })?.text ?? ""));

    if (!text) {
      return NextResponse.json({ error: "Text required" }, { status: 400 });
    }

    if (text.length < 4) {
      return NextResponse.json({ error: "Too short" }, { status: 400 });
    }

    const item: Confession = {
      id: makeId(),
      text,
      createdAt: Date.now(),
      reactions: {
        same: 0,
        lol: 0,
        handshake: 0,
      },
    };

    await kv.set(ITEM(item.id), item);
    await kv.lpush(KEY, item.id);
    await kv.ltrim(KEY, 0, MAX_ITEMS - 1);

    return NextResponse.json({ item });
  } catch (error) {
    const message = error instanceof Error ? error.message : "POST failed";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json().catch(() => ({} as Record<string, unknown>));

    const id = String(body?.id ?? "").trim();
    const reaction = body?.reaction ?? body?.kind;
    const delta = Number(body?.delta ?? 1);

    if (!id) {
      return NextResponse.json({ error: "id required" }, { status: 400 });
    }

    if (!isReactionKey(reaction)) {
      return NextResponse.json(
        { error: "invalid reaction" },
        { status: 400 }
      );
    }

    if (delta !== 1 && delta !== -1) {
      return NextResponse.json({ error: "invalid delta" }, { status: 400 });
    }

    const result = await kv.eval(
      `
local k = KEYS[1]
local reaction = ARGV[1]
local delta = tonumber(ARGV[2])

local obj = redis.call("GET", k)
if not obj then
  return nil
end

local data = cjson.decode(obj)
data.reactions = data.reactions or {}

local current = tonumber(data.reactions[reaction]) or 0
local nextVal = current + delta
if nextVal < 0 then
  nextVal = 0
end

data.reactions[reaction] = nextVal

redis.call("SET", k, cjson.encode(data))
return cjson.encode(data)
      `,
      [ITEM(id)],
      [reaction, String(delta)]
    );

    if (!result) {
      return NextResponse.json({ error: "not found" }, { status: 404 });
    }

    const parsed = safeJson<Confession>(result);

    if (!parsed) {
      return NextResponse.json(
        { error: "bad data from KV" },
        { status: 500 }
      );
    }

    return NextResponse.json({ item: parsed });
  } catch (error) {
    const message = error instanceof Error ? error.message : "PATCH failed";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
