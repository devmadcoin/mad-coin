/* app/_lib/mad.ts */
import type React from "react";

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
  T extends {
    id: string;
    primary: string;
    fallbacks: string[];
    label: string;
    rarity: Rarity;
    style: Style;
  }
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

// ---------- Forge Data (keeps /forge/page.tsx small) ----------
export const FORGE_EYES: EyeItem[] = [
  makeItem<EyeItem>("c-common-black", "/pfp/eyes/cartoon/common/cartoon-common-black.png", "Cartoon Common Black", "common", "cartoon"),
  makeItem<EyeItem>("c-common-blue", "/pfp/eyes/cartoon/common/cartoon-common-blue.png", "Cartoon Common Blue", "common", "cartoon"),
  makeItem<EyeItem>("c-common-green", "/pfp/eyes/cartoon/common/cartoon-common-green.png", "Cartoon Common Green", "common", "cartoon"),
  makeItem<EyeItem>("c-common-orange", "/pfp/eyes/cartoon/common/cartoon-common-orange.png", "Cartoon Common Orange", "common", "cartoon"),
  makeItem<EyeItem>("c-common-pink", "/pfp/eyes/cartoon/common/cartoon-common-pink.png", "Cartoon Common Pink", "common", "cartoon"),
  makeItem<EyeItem>("c-common-red", "/pfp/eyes/cartoon/common/cartoon-common-red.png", "Cartoon Common Red", "common", "cartoon"),
];

export const FORGE_ACCESSORIES: AccessoryItem[] = (() => {
  const tall = (y: number, scale = 1) => ({
    cssTransform: `translateY(${y}px) scale(${scale})`,
    draw: { y, scale } as DrawTransform,
  });

  return [
    makeItem<AccessoryItem>("a-c-common-bandaid", "/pfp/accessories/cartoon/common/cartoon-common-bandaid.png", "Bandage", "common", "cartoon"),
    makeItem<AccessoryItem>("a-c-rare-icedchain", "/pfp/accessories/cartoon/rare/cartoon-rare-icedchain.png", "Iced $MAD Chain", "rare", "cartoon"),

    makeItem<AccessoryItem>("a-c-leg-cigar", "/pfp/accessories/cartoon/legendary/cartoon-legendary-cigar.png", "Cigar", "legendary", "cartoon"),
    makeItem<AccessoryItem>("a-c-leg-crown", "/pfp/accessories/cartoon/legendary/cartoon-legendary-crown.png", "Crown", "legendary", "cartoon", tall(18, 0.98)),
    makeItem<AccessoryItem>("a-c-leg-halo", "/pfp/accessories/cartoon/legendary/cartoon-legendary-halo.png", "Halo", "legendary", "cartoon", tall(28, 0.95)),
    makeItem<AccessoryItem>("a-c-leg-jetpack", "/pfp/accessories/cartoon/legendary/cartoon-legendary-jetpack.png", "Jetpack", "legendary", "cartoon", tall(18, 0.98)),
    makeItem<AccessoryItem>("a-c-leg-lightninghorns", "/pfp/accessories/cartoon/legendary/cartoon-legendary-lightninghorns.png", "Lightning Horns", "legendary", "cartoon", tall(24, 0.96)),
    makeItem<AccessoryItem>("a-c-leg-void", "/pfp/accessories/cartoon/legendary/cartoon-legendary-void.png", "Void", "legendary", "cartoon", tall(20, 0.98)),
    makeItem<AccessoryItem>("a-c-leg-rugproofshield", "/pfp/accessories/cartoon/legendary/cartoon-legendary-rugproofshield.png", "Rugproof Shield", "legendary", "cartoon"),
    makeItem<AccessoryItem>("a-c-leg-sash", "/pfp/accessories/cartoon/legendary/cartoon-legendary-sash.png", "Sash", "legendary", "cartoon"),
    makeItem<AccessoryItem>("a-c-leg-moneybag", "/pfp/accessories/cartoon/legendary/cartoon-legendary-moneybag.png", "Money Bag", "legendary", "cartoon"),
    makeItem<AccessoryItem>("a-c-leg-pinkgrill", "/pfp/accessories/cartoon/legendary/cartoon-legendary-pinkgrill.png", "Pink Grill", "legendary", "cartoon"),
    makeItem<AccessoryItem>("a-c-leg-firegrills", "/pfp/accessories/cartoon/legendary/cartoon-legendary-firegrills.png", "Fire Grills", "legendary", "cartoon"),
    makeItem<AccessoryItem>("a-c-leg-fieryaura", "/pfp/accessories/cartoon/legendary/cartoon-legendary-fieryaura.png", "Fiery Aura", "legendary", "cartoon", tall(22, 0.98)),
    makeItem<AccessoryItem>("a-c-leg-fireaura", "/pfp/accessories/cartoon/legendary/cartoon-legendary-fireaura.png", "Fire Aura", "legendary", "cartoon", tall(22, 0.98)),
    makeItem<AccessoryItem>("a-c-leg-madchaininfinity", "/pfp/accessories/cartoon/legendary/cartoon-legendary-madchaininfinity.png", "Infinity Chain", "legendary", "cartoon"),
  ];
})();

export const FORGE_BASE = makeItem<{
  id: string;
  primary: string;
  fallbacks: string[];
  label: string;
  rarity: "common";
  style: "cartoon";
}>("base", "/pfp/base/base-01.png", "Base", "common", "cartoon");
