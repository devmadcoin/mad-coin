import { kv } from "@vercel/kv";

export const runtime = "nodejs";

type ReactionKey = "same" | "lol" | "handshake";
type Confession = {
  id: string;
  text: string;
  createdAt: number;
  reactions: Record<ReactionKey, number>;
};

const ITEM = (id: string) => `mad:confession:${id}`;

function isReactionKey(x: any): x is ReactionKey {
  return x === "same" || x === "lol" || x === "handshake";
}

/**
 * POST /api/confessions/react
 * body: { id: string, kind: "same"|"lol"|"handshake", delta: 1|-1 }
 *
 * This matches your FRONTEND exactly.
 */
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const id = String(body?.id ?? "");
  const kind = body?.kind;
  const delta = Number(body?.delta ?? 1);

  if (!id) return Response.json({ error: "id required" }, { status: 400 });
  if (!isReactionKey(kind)) return Response.json({ error: "invalid kind" }, { status: 400 });
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
    [kind, String(delta)]
  );

  if (!updatedJson) return Response.json({ error: "not found" }, { status: 404 });

  const item = JSON.parse(updatedJson) as Confession;
  return Response.json({ ok: true, item });
}

