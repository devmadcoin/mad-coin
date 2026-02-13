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
  const confessions = (items.filter(Boolean) as Confession[]).sort((a, b) => b.createdAt - a.createdAt);
  return Response.json({ confessions });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
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
 * PATCH /api/confessions
 * body: { id: string, reaction: "same"|"lol"|"handshake", delta?: number }
 */
export async function PATCH(req: Request) {
  const body = await req.json().catch(() => ({}));
  const id = String(body?.id ?? "");
  const reaction = body?.reaction;
  const delta = Number(body?.delta ?? 1);

  if (!id) return Response.json({ error: "id required" }, { status: 400 });
  if (!isReactionKey(reaction)) return Response.json({ error: "invalid reaction" }, { status: 400 });
  if (!Number.isFinite(delta) || delta === 0) return Response.json({ error: "invalid delta" }, { status: 400 });

  const key = ITEM(id);

  const updatedJson = await kv.eval<string | null>(
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
data.reactions[reaction] = (tonumber(data.reactions[reaction]) or 0) + delta
if data.reactions[reaction] < 0 then data.reactions[reaction] = 0 end

redis.call("SET", k, cjson.encode(data))
return cjson.encode(data)
    `,
    [key],
    [reaction, String(delta)]
  );

  if (!updatedJson) return Response.json({ error: "not found" }, { status: 404 });

  const item = JSON.parse(updatedJson) as Confession;
  return Response.json({ item });
}
