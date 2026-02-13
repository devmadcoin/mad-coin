import { kv } from "@vercel/kv";

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

function clampText(s: string, max = 240) {
  const t = (s || "").replace(/\s+/g, " ").trim();
  return t.length > max ? t.slice(0, max).trim() : t;
}

function makeId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function isReactionKey(x: any): x is ReactionKey {
  return x === "same" || x === "lol" || x === "handshake";
}

export async function GET() {
  const ids = (await kv.lrange<string>(KEY, 0, 199)) ?? [];
  const items = await Promise.all(ids.map((id) => kv.get<Confession>(ITEM(id))));
  const confessions = items.filter(Boolean) as Confession[];

  return Response.json({ confessions });
}

/**
 * POST supports 2 actions (so you don't have to change your frontend):
 * 1) Create confession: { text: string }
 * 2) React: { id: string, reaction: "same"|"lol"|"handshake" }
 */
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));

  // --- (A) React ---
  const maybeId = String(body?.id ?? "");
  const maybeReaction = body?.reaction ?? body?.type; // supports either key name
  if (maybeId && isReactionKey(maybeReaction)) {
    const key = ITEM(maybeId);

    const existing = await kv.get<Confession>(key);
    if (!existing) return Response.json({ error: "Not found" }, { status: 404 });

    const next: Confession = {
      ...existing,
      reactions: {
        same: existing.reactions?.same ?? 0,
        lol: existing.reactions?.lol ?? 0,
        handshake: existing.reactions?.handshake ?? 0,
      },
    };

    next.reactions[maybeReaction] = (next.reactions[maybeReaction] ?? 0) + 1;

    await kv.set(key, next);

    return Response.json({ item: next });
  }

  // --- (B) Create confession ---
  const text = clampText(String(body?.text ?? ""), 240);

  if (!text) return Response.json({ error: "Text required" }, { status: 400 });
  if (text.length < 4) return Response.json({ error: "Too short" }, { status: 400 });

  const item: Confession = {
    id: makeId(),
    text,
    createdAt: Date.now(),
    reactions: { same: 0, lol: 0, handshake: 0 },
  };

  await kv.set(ITEM(item.id), item);
  await kv.lpush(KEY, item.id);
  await kv.ltrim(KEY, 0, 199);

  return Response.json({ item });
}

/**
 * PATCH (optional) react endpoint:
 * { id: string, reaction: "same"|"lol"|"handshake" }
 */
export async function PATCH(req: Request) {
  const body = await req.json().catch(() => ({}));
  const id = String(body?.id ?? "");
  const reaction = body?.reaction ?? body?.type;

  if (!id || !isReactionKey(reaction)) {
    return Response.json(
      { error: "Provide { id, reaction } where reaction is same|lol|handshake" },
      { status: 400 }
    );
  }

  const key = ITEM(id);
  const existing = await kv.get<Confession>(key);
  if (!existing) return Response.json({ error: "Not found" }, { status: 404 });

  const next: Confession = {
    ...existing,
    reactions: {
      same: existing.reactions?.same ?? 0,
      lol: existing.reactions?.lol ?? 0,
      handshake: existing.reactions?.handshake ?? 0,
    },
  };

  next.reactions[reaction] = (next.reactions[reaction] ?? 0) + 1;

  await kv.set(key, next);

  return Response.json({ item: next });
}

