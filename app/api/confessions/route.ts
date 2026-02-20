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

function toStringSafe(v: unknown): string | null {
  if (typeof v === "string") return v;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const anyV: any = v;
  if (anyV && typeof anyV === "object" && typeof anyV.toString === "function") {
    try {
      const s = anyV.toString();
      return typeof s === "string" ? s : null;
    } catch {
      return null;
    }
  }
  return null;
}

function safeJson<T>(raw: unknown): T | null {
  try {
    const s = toStringSafe(raw);
    if (!s) return null;
    return JSON.parse(s) as T;
  } catch {
    return null;
  }
}

export async function GET() {
  try {
    const ids = (await kv.lrange<string>(KEY, 0, 199)) ?? [];
    const items = await Promise.all(ids.map((id) => kv.get<Confession>(ITEM(id))));
    const confessions = (items.filter(Boolean) as Confession[]).sort((a, b) => b.createdAt - a.createdAt);
    return Response.json({ confessions });
  } catch (err: any) {
    return Response.json({ confessions: [], error: err?.message || "KV error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({} as any));
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
  } catch (err: any) {
    return Response.json({ error: err?.message || "POST failed" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json().catch(() => ({} as any));

    const id = String(body?.id ?? "");
    const reaction = body?.reaction ?? body?.kind;
    const delta = Number(body?.delta ?? 1);

    if (!id) return Response.json({ error: "id required" }, { status: 400 });
    if (!isReactionKey(reaction)) return Response.json({ error: "invalid reaction" }, { status: 400 });
    if (![1, -1].includes(delta)) return Response.json({ error: "invalid delta" }, { status: 400 });

    const key = ITEM(id);

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
if nextVal < 0 then nextVal = 0 end

data.reactions[reaction] = nextVal

redis.call("SET", k, cjson.encode(data))
return cjson.encode(data)
      `,
      [key],
      [reaction, String(delta)]
    );

    if (!result) return Response.json({ error: "not found" }, { status: 404 });

    const parsed = safeJson<Confession>(result);
    if (!parsed) return Response.json({ error: "bad data from KV" }, { status: 500 });

    return Response.json({ item: parsed });
  } catch (err: any) {
    return Response.json({ error: err?.message || "PATCH failed" }, { status: 500 });
  }
}
