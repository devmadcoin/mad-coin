/* app/_lib/mad.ts */
export type Rarity = "common" | "rare" | "legendary";
export type Style = "cartoon" | "pixel";

export type EyeItem = {
  id: string;
  primary: string;
  fallbacks: string[];
  label: string;
  rarity: Rarity;
  style: Style;
};

export type DrawTransform = { x?: number; y?: number; scale?: number };

export type AccessoryItem = {
  id: string;
  primary: string;
  fallbacks: string[];
  label: string;
  rarity: Rarity;
  style: Style;
  cssTransform?: string;
  draw?: DrawTransform;
};

export const LS_SITE_UNLOCK_KEY = "mad_site_unlocked_v1";

export const addr = "Fa7ZE9nCEYnrHsnoeHuhEExJpchtrBtKXnWe6CgHpump";

export const links = {
  buy: `https://jup.ag/swap/SOL-${addr}`,
  chart: `https://dexscreener.com/solana/${addr}`,
  x: "https://x.com/i/communities/2019256566248312879/",
  tg: "https://t.me/madtokenfam",
  game: "https://www.roblox.com/games/133907998204829/Will-You-Get-RICH-Or-Stay-MAD",
};

// Token Stats
export const BURNED = 350_000_000;
export const BURN_RATE = 35;
export const LOCKED = 111_000_000;
export const LOCK_UNTIL = "6/1/2026";

// ---------- helpers ----------
export function ensureLeadingSlash(p: string) {
  if (!p) return p;
  return p.startsWith("/") ? p : `/${p}`;
}

/**
 * Builds candidate paths for <img src>.
 * Next.js serves /public/* at root ("/").
 * Also tries legacy "/public" prefixes and ".png.png" mistakes.
 */
export function buildCandidates(originalPath: string): string[] {
  const raw = ensureLeadingSlash(originalPath);
  const prefixes = ["", "/public", "/public/public"];
  const out: string[] = [];

  const pushUnique = (v: string) => {
    const cleaned = v.replace(/\/{2,}/g, "/");
    if (!out.includes(cleaned)) out.push(cleaned);
  };

  for (const pre of prefixes) {
    const p = `${pre}${raw}`.replace(/\/{2,}/g, "/");
    pushUnique(p);

    if (p.endsWith(".png.png")) pushUnique(p.replace(/\.png\.png$/, ".png"));
    if (p.endsWith(".png")) pushUnique(`${p}.png`);
  }

  return out;
}

export function makeItem<
  T extends { id: string; primary: string; fallbacks: string[]; label: string; rarity: Rarity; style: Style }
>(id: string, path: string, label: string, rarity: Rarity, style: Style, extra?: Partial<T>): T {
  const candidates = buildCandidates(path);
  return {
    id,
    primary: candidates[0],
    fallbacks: candidates.slice(1),
    label,
    rarity,
    style,
    ...(extra || {}),
  } as T;
}

/** Weighted: 75% common, 20% rare, 5% legendary */
export function pickWeightedAccessory(all: AccessoryItem[]) {
  const commons = all.filter((a) => a.rarity === "common");
  const rares = all.filter((a) => a.rarity === "rare");
  const legs = all.filter((a) => a.rarity === "legendary");

  const safeCommons = commons.length ? commons : all;
  const safeRares = rares.length ? rares : safeCommons;
  const safeLegs = legs.length ? legs : safeRares;

  const roll = Math.random();
  if (roll < 0.75) return safeCommons[Math.floor(Math.random() * safeCommons.length)];
  if (roll < 0.95) return safeRares[Math.floor(Math.random() * safeRares.length)];
  return safeLegs[Math.floor(Math.random() * safeLegs.length)];
}

export function cycleFallback(e: React.SyntheticEvent<HTMLImageElement, Event>, fallbacks: string[]) {
  const img = e.currentTarget;
  if (!fallbacks?.length) return;

  const current = img.getAttribute("src") || (img as any).currentSrc || "";

  if ((img as any).dataset.lastTried !== current) {
    (img as any).dataset.fallbackIndex = "0";
    (img as any).dataset.lastTried = current;
  }

  const idx = Number((img as any).dataset.fallbackIndex || "0");
  if (idx >= fallbacks.length) return;

  (img as any).dataset.fallbackIndex = String(idx + 1);
  img.setAttribute("src", fallbacks[idx]);
}

export function resetFallbackIndex(e: React.SyntheticEvent<HTMLImageElement, Event>) {
  const img = e.currentTarget;
  (img as any).dataset.fallbackIndex = "0";
  (img as any).dataset.lastTried = img.getAttribute("src") || (img as any).currentSrc || "";
}
