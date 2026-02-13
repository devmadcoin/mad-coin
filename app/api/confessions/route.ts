import { kv } from "@vercel/kv";

export const runtime = "nodejs";

type Confession = {
  id: string;
  text: string;
  createdAt: number;
  reactions: { same: number; lol: number; handshake: number };
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

export async function GET() {
  const ids = (await kv.lrange<string>(KEY, 0, 199)) ?? [];
  const items = await Promise.all(ids.map((id) => kv.get<Confession>(ITEM(id))));
  const confessions = items.filter(Boolean) as Confession[];

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
