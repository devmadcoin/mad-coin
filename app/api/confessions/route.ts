import { kv } from "@vercel/kv";
import { NextResponse } from "next/server";

type ReactionKey = "same" | "lol" | "handshake";

type Confession = {
  id: string;
  text: string;
  createdAt: number;
  reactions: Record<ReactionKey, number>;
};

type PostBody = {
  text?: unknown;
};

type PatchBody = {
  id?: unknown;
  reaction?: unknown;
  kind?: unknown;
  delta?: unknown;
};

const KEY = "mad:confessions";
const ITEM = (id: string) => `mad:confession:${id}`;

const MAX_ITEMS = 200;
const MAX_TEXT = 240;
const MIN_TEXT = 4;

const POST_COOLDOWN_SECONDS = 45;
const REACTION_COOLDOWN_SECONDS = 60 * 60 * 12; // 12 hours

const EMPTY_REACTIONS: Record<ReactionKey, number> = {
  same: 0,
  lol: 0,
  handshake: 0,
};

function json(
  body: Record<string, unknown>,
  init?: number | ResponseInit
) {
  if (typeof init === "number") {
    return NextResponse.json(body, { status: init });
  }
  return NextResponse.json(body, init);
}

function sanitizeText(value: unknown, max = MAX_TEXT) {
  const raw = typeof value === "string" ? value : String(value ?? "");
  const text = raw.replace(/\s+/g, " ").trim();
  return text.length > max ? text.slice(0, max).trim() : text;
}

function makeId() {
  return `${Date.now().toString(36)}-${crypto.randomUUID().slice(0, 8)}`;
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

function normalizeId(value: unknown): string | null {
  const text = toStringSafe(value);
  if (!text) return null;

  const clean = text.trim();
  return clean || null;
}

function normalizeConfession(item: Partial<Confession> | null): Confession | null {
  if (!item?.id || !item?.text || !item?.createdAt) return null;

  return {
    id: String(item.id),
    text: sanitizeText(item.text),
    createdAt: Number(item.createdAt),
    reactions: {
      same: Number(item.reactions?.same ?? 0),
      lol: Number(item.reactions?.lol ?? 0),
      handshake: Number(item.reactions?.handshake ?? 0),
    },
  };
}

async function parseJson<T>(req: Request): Promise<T | null> {
  try {
    return (await req.json()) as T;
  } catch {
    return null;
  }
}

function getClientId(req: Request) {
  const forwardedFor =
    req.headers.get("x-forwarded-for") ||
    req.headers.get("x-real-ip") ||
    req.headers.get("cf-connecting-ip") ||
    "";

  const raw = forwardedFor.split(",")[0]?.trim() || "anonymous";
  return raw.toLowerCase().replace(/[^a-z0-9:._-]/g, "_");
}

function postCooldownKey(clientId: string) {
  return `mad:cooldown:post:${clientId}`;
}

function reactionCooldownKey(
  clientId: string,
  confessionId: string,
  reaction: ReactionKey
) {
  return `mad:cooldown:react:${clientId}:${confessionId}:${reaction}`;
}

async function getCooldownRemainingSeconds(key: string) {
  const expiresAt = await kv.get<number>(key);
  if (!expiresAt) return 0;

  const remainingMs = Number(expiresAt) - Date.now();
  if (remainingMs <= 0) return 0;

  return Math.ceil(remainingMs / 1000);
}

async function setCooldown(key: string, seconds: number) {
  const expiresAt = Date.now() + seconds * 1000;
  await kv.set(key, expiresAt, { ex: seconds });
}

export async function GET() {
  try {
    const rawIds = (await kv.lrange(KEY, 0, MAX_ITEMS - 1)) ?? [];
    const ids = rawIds
      .map(normalizeId)
      .filter((id): id is string => Boolean(id));

    if (ids.length === 0) {
      return json({ confessions: [] });
    }

    const items = await Promise.all(ids.map((id) => kv.get<Confession>(ITEM(id))));

    const confessions = items
      .map((item) => normalizeConfession(item))
      .filter((item): item is Confession => Boolean(item))
      .sort((a, b) => b.createdAt - a.createdAt);

    return json({ confessions });
  } catch (error) {
    const message = error instanceof Error ? error.message : "KV error";
    return json({ confessions: [], error: message }, 500);
  }
}

export async function POST(req: Request) {
  try {
    const clientId = getClientId(req);
    const cooldownKey = postCooldownKey(clientId);
    const remainingSeconds = await getCooldownRemainingSeconds(cooldownKey);

    if (remainingSeconds > 0) {
      return json(
        {
          error: "Cooldown active",
          retryAfterSeconds: remainingSeconds,
        },
        429
      );
    }

    const body = await parseJson<PostBody>(req);
    const text = sanitizeText(body?.text);

    if (!text) {
      return json({ error: "Text required" }, 400);
    }

    if (text.length < MIN_TEXT) {
      return json({ error: "Too short" }, 400);
    }

    const item: Confession = {
      id: makeId(),
      text,
      createdAt: Date.now(),
      reactions: { ...EMPTY_REACTIONS },
    };

    await kv.set(ITEM(item.id), item);
    await kv.lpush(KEY, item.id);
    await kv.ltrim(KEY, 0, MAX_ITEMS - 1);
    await setCooldown(cooldownKey, POST_COOLDOWN_SECONDS);

    return json({
      item,
      cooldownSeconds: POST_COOLDOWN_SECONDS,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "POST failed";
    return json({ error: message }, 500);
  }
}

export async function PATCH(req: Request) {
  try {
    const clientId = getClientId(req);
    const body = await parseJson<PatchBody>(req);

    const id = normalizeId(body?.id);
    const reaction = body?.reaction ?? body?.kind;
    const delta = Number(body?.delta ?? 1);

    if (!id) {
      return json({ error: "id required" }, 400);
    }

    if (!isReactionKey(reaction)) {
      return json({ error: "invalid reaction" }, 400);
    }

    if (delta !== 1) {
      return json({ error: "only +1 reactions allowed" }, 400);
    }

    const cooldownKey = reactionCooldownKey(clientId, id, reaction);
    const remainingSeconds = await getCooldownRemainingSeconds(cooldownKey);

    if (remainingSeconds > 0) {
      return json(
        {
          error: "Reaction already used",
          retryAfterSeconds: remainingSeconds,
        },
        429
      );
    }

    const key = ITEM(id);
    const existingRaw = await kv.get<Confession>(key);
    const existing = normalizeConfession(existingRaw);

    if (!existing) {
      return json({ error: "not found" }, 404);
    }

    const updated: Confession = {
      ...existing,
      reactions: {
        same: existing.reactions.same,
        lol: existing.reactions.lol,
        handshake: existing.reactions.handshake,
        [reaction]: Math.max(0, existing.reactions[reaction] + 1),
      },
    };

    await kv.set(key, updated);
    await setCooldown(cooldownKey, REACTION_COOLDOWN_SECONDS);

    return json({
      item: updated,
      reactionLocked: true,
      retryAfterSeconds: REACTION_COOLDOWN_SECONDS,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "PATCH failed";
    return json({ error: message }, 500);
  }
}
