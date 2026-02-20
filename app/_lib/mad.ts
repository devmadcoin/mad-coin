/* app/_lib/forge-data.ts */
import type { EyeItem, AccessoryItem } from "./mad";
import { makeItem } from "./mad";

// ---------- Forge Data (keeps /forge/page.tsx small) ----------

export const FORGE_EYES: EyeItem[] = [
  makeItem<EyeItem>(
    "c-common-black",
    "/pfp/eyes/cartoon/common/cartoon-common-black.png",
    "Cartoon Common Black",
    "common",
    "cartoon"
  ),
  makeItem<EyeItem>(
    "c-common-blue",
    "/pfp/eyes/cartoon/common/cartoon-common-blue.png",
    "Cartoon Common Blue",
    "common",
    "cartoon"
  ),
  makeItem<EyeItem>(
    "c-common-green",
    "/pfp/eyes/cartoon/common/cartoon-common-green.png",
    "Cartoon Common Green",
    "common",
    "cartoon"
  ),
  makeItem<EyeItem>(
    "c-common-orange",
    "/pfp/eyes/cartoon/common/cartoon-common-orange.png",
    "Cartoon Common Orange",
    "common",
    "cartoon"
  ),
  makeItem<EyeItem>(
    "c-common-pink",
    "/pfp/eyes/cartoon/common/cartoon-common-pink.png",
    "Cartoon Common Pink",
    "common",
    "cartoon"
  ),
  makeItem<EyeItem>(
    "c-common-red",
    "/pfp/eyes/cartoon/common/cartoon-common-red.png",
    "Cartoon Common Red",
    "common",
    "cartoon"
  ),
];

export const FORGE_ACCESSORIES: AccessoryItem[] = (() => {
  const tall = (y: number, scale = 1) => ({
    cssTransform: `translateY(${y}px) scale(${scale})`,
    draw: { y, scale },
  });

  return [
    makeItem<AccessoryItem>(
      "a-c-common-bandaid",
      "/pfp/accessories/cartoon/common/cartoon-common-bandaid.png",
      "Bandage",
      "common",
      "cartoon"
    ),
    makeItem<AccessoryItem>(
      "a-c-rare-icedchain",
      "/pfp/accessories/cartoon/rare/cartoon-rare-icedchain.png",
      "Iced $MAD Chain",
      "rare",
      "cartoon"
    ),

    // Legendary (your real filenames)
    makeItem<AccessoryItem>(
      "a-c-leg-cigar",
      "/pfp/accessories/cartoon/legendary/cartoon-legendary-cigar.png",
      "Cigar",
      "legendary",
      "cartoon"
    ),
    makeItem<AccessoryItem>(
      "a-c-leg-crown",
      "/pfp/accessories/cartoon/legendary/cartoon-legendary-crown.png",
      "Crown",
      "legendary",
      "cartoon",
      tall(18, 0.98)
    ),
    makeItem<AccessoryItem>(
      "a-c-leg-halo",
      "/pfp/accessories/cartoon/legendary/cartoon-legendary-halo.png",
      "Halo",
      "legendary",
      "cartoon",
      tall(28, 0.95)
    ),
    makeItem<AccessoryItem>(
      "a-c-leg-jetpack",
      "/pfp/accessories/cartoon/legendary/cartoon-legendary-jetpack.png",
      "Jetpack",
      "legendary",
      "cartoon",
      tall(18, 0.98)
    ),
    makeItem<AccessoryItem>(
      "a-c-leg-lightninghorns",
      "/pfp/accessories/cartoon/legendary/cartoon-legendary-lightninghorns.png",
      "Lightning Horns",
      "legendary",
      "cartoon",
      tall(24, 0.96)
    ),
    makeItem<AccessoryItem>(
      "a-c-leg-void",
      "/pfp/accessories/cartoon/legendary/cartoon-legendary-void.png",
      "Void",
      "legendary",
      "cartoon",
      tall(20, 0.98)
    ),
    makeItem<AccessoryItem>(
      "a-c-leg-rugproofshield",
      "/pfp/accessories/cartoon/legendary/cartoon-legendary-rugproofshield.png",
      "Rugproof Shield",
      "legendary",
      "cartoon"
    ),
    makeItem<AccessoryItem>(
      "a-c-leg-sash",
      "/pfp/accessories/cartoon/legendary/cartoon-legendary-sash.png",
      "Sash",
      "legendary",
      "cartoon"
    ),
    makeItem<AccessoryItem>(
      "a-c-leg-moneybag",
      "/pfp/accessories/cartoon/legendary/cartoon-legendary-moneybag.png",
      "Money Bag",
      "legendary",
      "cartoon"
    ),
    makeItem<AccessoryItem>(
      "a-c-leg-pinkgrill",
      "/pfp/accessories/cartoon/legendary/cartoon-legendary-pinkgrill.png",
      "Pink Grill",
      "legendary",
      "cartoon"
    ),
    makeItem<AccessoryItem>(
      "a-c-leg-firegrills",
      "/pfp/accessories/cartoon/legendary/cartoon-legendary-firegrills.png",
      "Fire Grills",
      "legendary",
      "cartoon"
    ),
    makeItem<AccessoryItem>(
      "a-c-leg-fieryaura",
      "/pfp/accessories/cartoon/legendary/cartoon-legendary-fieryaura.png",
      "Fiery Aura",
      "legendary",
      "cartoon",
      tall(22, 0.98)
    ),
    makeItem<AccessoryItem>(
      "a-c-leg-fireaura",
      "/pfp/accessories/cartoon/legendary/cartoon-legendary-fireaura.png",
      "Fire Aura",
      "legendary",
      "cartoon",
      tall(22, 0.98)
    ),
    makeItem<AccessoryItem>(
      "a-c-leg-madchaininfinity",
      "/pfp/accessories/cartoon/legendary/cartoon-legendary-madchaininfinity.png",
      "Infinity Chain",
      "legendary",
      "cartoon"
    ),
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
