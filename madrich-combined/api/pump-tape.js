const MAD_MINT = "Fa7ZE9nCEYnrHsnoeHuhEExJpchtrBtKXnWe6CgHpump";
const GRADUATE_SOL = 85;
const TOKEN_2022 = "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb";
const PUMP_COINS =
  "https://frontend-api-v3.pump.fun/coins?limit=24&offset=0&sort=created_timestamp&order=DESC";
const RPC = "https://api.mainnet-beta.solana.com";
const TWEET_FARM = /(?:https?:\/\/)?(?:www\.)?(?:x\.com|twitter\.com)\/\S+\/status|\bt\.co\//i;
const COPY_NOISE = /copied|copy pasta|copy-paste|same as|clone of/i;

function fmtUsd(n) {
  if (n == null || !Number.isFinite(n) || n <= 0) return "—";
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(2)}K`;
  return `$${n.toFixed(2)}`;
}

function fmtAge(ts) {
  const s = Math.max(0, Math.floor((Date.now() - Number(ts || 0)) / 1000));
  if (s < 60) return `${s}s`;
  if (s < 3600) return `${Math.floor(s / 60)}m`;
  return `${Math.floor(s / 3600)}h`;
}

function normTicker(s) {
  return String(s || "")
    .toUpperCase()
    .replace(/^\$/, "")
    .replace(/[^A-Z0-9]/g, "");
}

function normText(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function emptyPayload(status) {
  return {
    ok: false,
    status,
    deskSol: 0,
    openClips: 0,
    prints: [],
  };
}

async function fetchPumpCoins(signal) {
  const res = await fetch(PUMP_COINS, {
    signal,
    headers: {
      Origin: "https://pump.fun",
      Referer: "https://pump.fun/",
      Accept: "application/json",
      "User-Agent": "MADGrokDesk/1.0",
    },
  });
  if (!res.ok) throw new Error(`pump ${res.status}`);
  const rows = await res.json();
  if (!Array.isArray(rows)) throw new Error("pump shape");
  return rows;
}

async function rpc(method, params, signal) {
  const res = await fetch(RPC, {
    method: "POST",
    signal,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
  });
  if (!res.ok) throw new Error(`rpc ${res.status}`);
  const body = await res.json();
  if (body.error) throw new Error(body.error.message || "rpc error");
  return body.result;
}

function b64ToBytes(b64) {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

function u32le(bytes, offset) {
  return bytes[offset] | (bytes[offset + 1] << 8) | (bytes[offset + 2] << 16) | (bytes[offset + 3] << 24);
}

function u16le(bytes, offset) {
  return bytes[offset] | (bytes[offset + 1] << 8);
}

function parseMintFlags(account) {
  if (!account?.data?.[0]) return { known: false };
  const raw = b64ToBytes(account.data[0]);
  if (raw.length < 82) return { known: false };
  const mintLive = u32le(raw, 0) === 1;
  const freezeLive = u32le(raw, 46) === 1;
  let transferFee = false;
  let permanentDelegate = false;
  if (account.owner === TOKEN_2022 && raw.length > 166) {
    let i = 166;
    while (i + 4 <= raw.length) {
      const type = u16le(raw, i);
      const len = u16le(raw, i + 2);
      i += 4;
      if (type === 0) break;
      if (type === 1) transferFee = true;
      if (type === 12) permanentDelegate = true;
      i += len;
    }
  }
  return { known: true, mintLive, freezeLive, transferFee, permanentDelegate };
}

async function loadMintFlags(mints, signal) {
  const flags = new Map();
  if (!mints.length) return flags;
  try {
    const result = await rpc("getMultipleAccounts", [mints, { encoding: "base64" }], signal);
    const values = result?.value || [];
    mints.forEach((mint, i) => flags.set(mint, parseMintFlags(values[i])));
  } catch {
    mints.forEach((mint) => flags.set(mint, { known: false }));
  }
  return flags;
}

function stripReason(row, ctx) {
  const mint = String(row.mint || "");
  const ticker = String(row.symbol || "—");
  const key = normTicker(ticker);
  if (!mint || mint.length < 32) return "unverifiable";
  if (mint === MAD_MINT || key === "MAD") return "$MAD is not a hunt";
  if (row.complete === true || row.is_banned === true) return "not live";
  const sol = Number(row.real_sol_reserves || 0) / 1e9;
  if (!Number.isFinite(sol) || sol < 0.001) return "0 SOL in";
  const desc = String(row.description || "");
  if (TWEET_FARM.test(desc) || TWEET_FARM.test(String(row.name || ""))) return "status-tweet farm";
  if (COPY_NOISE.test(desc)) return "copy-paste";
  const descKey = normText(desc);
  if (descKey.length >= 24 && (ctx.descCounts.get(descKey) || 0) > 1) return "copy-paste";
  if (key && (ctx.tickerCounts.get(key) || 0) > 1) return "clone race";
  const img = String(row.image_uri || "");
  if (img && (ctx.imageCounts.get(img) || 0) > 1) return "reused image";
  return null;
}

function gatePrint(print, flags) {
  if (!print.mint || print.mint.length < 32) return { stamp: "KILL", stampWhy: "unverifiable" };
  if (print.mint === MAD_MINT || normTicker(print.ticker) === "MAD") {
    return { stamp: "KILL", stampWhy: "$MAD mint skipped" };
  }
  if (!print.live) return { stamp: "KILL", stampWhy: "not live" };
  if (print.curvePct >= 80) return { stamp: "WATCH", stampWhy: "late curve — not a 0.05 clip" };
  if (
    print.solInNum >= 1 &&
    print.athUsd > 0 &&
    print.mcUsd > 0 &&
    print.mcUsd <= print.athUsd * 0.6
  ) {
    return { stamp: "WATCH", stampWhy: "dump-watch — SOL chopped ~40%+ off peak" };
  }
  const mint = flags.get(print.mint) || { known: false };
  if (!mint.known) return { stamp: "KILL", stampWhy: "unverifiable" };
  if (mint.mintLive || mint.freezeLive) return { stamp: "KILL", stampWhy: "mint/freeze still live" };
  if (mint.transferFee || mint.permanentDelegate) return { stamp: "KILL", stampWhy: "Token-2022 spam" };
  return { stamp: "KILL", stampWhy: "unverifiable" };
}

export async function buildTape() {
  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), 9000);
  try {
    const rows = await fetchPumpCoins(ac.signal);
    const tickerCounts = new Map();
    const descCounts = new Map();
    const imageCounts = new Map();
    for (const row of rows) {
      const key = normTicker(row.symbol);
      if (key) tickerCounts.set(key, (tickerCounts.get(key) || 0) + 1);
      const descKey = normText(row.description);
      if (descKey.length >= 24) descCounts.set(descKey, (descCounts.get(descKey) || 0) + 1);
      const img = String(row.image_uri || "");
      if (img) imageCounts.set(img, (imageCounts.get(img) || 0) + 1);
    }
    const ctx = { tickerCounts, descCounts, imageCounts };
    const heat = [];
    for (const row of rows) {
      const skip = stripReason(row, ctx);
      if (skip) continue;
      const mint = String(row.mint || "");
      const ticker = String(row.symbol || "—");
      const sol = Number(row.real_sol_reserves || 0) / 1e9;
      const curvePct = Math.min(100, (sol / GRADUATE_SOL) * 100);
      const mcUsd = Number(row.usd_market_cap ?? row.market_cap_usd ?? 0);
      const athUsd = Number(row.ath_market_cap ?? 0);
      const desc = String(row.description || row.name || "")
        .replace(/\s+/g, " ")
        .trim();
      heat.push({
        ticker,
        mint,
        url: `https://pump.fun/coin/${mint}`,
        mc: mcUsd ? fmtUsd(mcUsd) : "—",
        mcUsd: Number.isFinite(mcUsd) && mcUsd > 0 ? mcUsd : 0,
        athUsd: Number.isFinite(athUsd) && athUsd > 0 ? athUsd : 0,
        solIn: `${sol.toFixed(2)} SOL`,
        solInNum: sol,
        curve: `${curvePct.toFixed(0)}%`,
        curvePct,
        age: fmtAge(row.created_timestamp),
        live: row.complete !== true && row.is_banned !== true,
        why: desc ? desc.slice(0, 88) : "Pump.fun mint. Not a hunt on $MAD.",
      });
    }

    const flags = await loadMintFlags(heat.slice(0, 8).map((p) => p.mint), ac.signal);
    const prints = heat.slice(0, 6).map((p) => {
      const gate = gatePrint(p, flags);
      return { ...p, stamp: gate.stamp, stampWhy: gate.stampWhy };
    });

    return {
      ok: true,
      status: prints.length
        ? "Live Pump.fun prints. $MAD is not a hunt."
        : "No prints after tape filters.",
      deskSol: 0,
      openClips: 0,
      prints,
    };
  } catch {
    return emptyPayload("Tape feed unreachable. No seeded prints.");
  } finally {
    clearTimeout(timer);
  }
}

export async function GET() {
  const body = await buildTape();
  return Response.json(body, {
    status: 200,
    headers: {
      "Cache-Control": "s-maxage=8, stale-while-revalidate=20",
    },
  });
}

export default async function handler(_req, res) {
  const body = await buildTape();
  res.setHeader("Cache-Control", "s-maxage=8, stale-while-revalidate=20");
  res.status(200).json(body);
}
