import { CA } from "./data";

/** Holder threshold for /tools. Matches the existing 50,000 $MAD gate. */
export const MAD_GATE_AMOUNT = 50_000;
export const MAD_MINT = CA;
export const SOLANA_RPC = "https://api.mainnet-beta.solana.com";

async function rpc(method: string, params: unknown[]) {
  const res = await fetch(SOLANA_RPC, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message || "RPC error");
  return data.result;
}

/** Read-only $MAD token balance. Sums every token account for the mint. */
export async function getMadBalance(addr: string): Promise<number> {
  const result = await rpc("getTokenAccountsByOwner", [
    addr,
    { mint: MAD_MINT },
    { encoding: "jsonParsed" },
  ]);
  if (!result?.value?.length) return 0;
  return result.value.reduce((sum: number, acc: { account?: { data?: { parsed?: { info?: { tokenAmount?: { uiAmount?: number | null } } } } } }) => {
    return sum + (acc.account?.data?.parsed?.info?.tokenAmount?.uiAmount || 0);
  }, 0);
}

export function formatMad(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

export function shortAddr(addr: string): string {
  return `${addr.slice(0, 4)}…${addr.slice(-4)}`;
}

export function isMobileUserAgent(ua = typeof navigator === "undefined" ? "" : navigator.userAgent) {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
}
