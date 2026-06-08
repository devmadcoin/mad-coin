/**
 * Trench Radar — Solana wallet scanner for $MAD
 *
 * Tracks:
 *  - Whale wallet movements (top holders)
 *  - New buyer detection (fresh wallets aping in)
 *  - PnL analysis (realized/unrealized gains)
 *  - Smart money rotation (what else they hold)
 *
 * Requires: HELIUS_API_KEY or SOLANA_RPC_URL
 */

export interface WalletScanResult {
  address: string;
  solBalance: number;
  tokenHoldings: TokenHolding[];
  recentTransactions: TxSummary[];
  riskScore: number; // 0-100
  tags: WalletTag[];
  lastActive: string;
  estimatedPnL: PnL | null;
}

export interface TokenHolding {
  mint: string;
  symbol: string;
  name: string;
  amount: number;
  usdValue: number;
  decimals: number;
  priceChange24h?: number;
}

export interface TxSummary {
  signature: string;
  timestamp: string;
  type: "buy" | "sell" | "transfer" | "swap" | "other";
  tokenIn?: { mint: string; symbol: string; amount: number };
  tokenOut?: { mint: string; symbol: string; amount: number };
  usdValue: number;
  success: boolean;
}

export interface PnL {
  realized: number;
  unrealized: number;
  total: number;
  winRate: number; // 0-1
  trades: number;
}

export type WalletTag =
  | "whale"           // >$100k holdings
  | "smart_money"     // High win rate
  | "new_wallet"      // <7 days old
  | "diamond_hands"   // Holds >30 days
  | "paper_hands"     // Sells within 24h
  | "bot"             // MEV/bot pattern
  | "doxxed"          // Known identity
  | "kols"            // Influencer
  | "accumulator"     // Buying consistently
  | "dumper";         // Selling consistently

// ─── Configuration ───
const HELIUS_KEY = process.env.HELIUS_API_KEY || "";
const HELIUS_BASE = HELIUS_KEY
  ? `https://mainnet.helius-rpc.com/?api-key=${HELIUS_KEY}`
  : "https://api.mainnet-beta.solana.com";

const DEX_SCREENER_API = "https://api.dexscreener.com/latest/dex/pairs/solana";
const SOLSCAN_API = "https://api.solscan.io";

// $MAD token
const MAD_MINT = "Fa7ZE9nCEYnrHsnoeHuhEExJpchtrBtKXnWe6CgHpump";
const MAD_PAIR = "Gt3dWHHKRd2mNQmmCHPzdeTpG4tTAa23exN1m2vwinfs";

// ─── Core Functions ───

export async function scanWallet(address: string): Promise<WalletScanResult> {
  if (!isValidSolanaAddress(address)) {
    throw new Error("Invalid Solana address");
  }

  // Try Helius first, fall back to Solscan
  const [balance, tokenAccounts, txs] = await Promise.allSettled([
    fetchSolBalance(address),
    fetchTokenHoldings(address),
    fetchRecentTransactions(address),
  ]);

  const solBal = balance.status === "fulfilled" ? balance.value : 0;
  const holdings = tokenAccounts.status === "fulfilled" ? tokenAccounts.value : [];
  const transactions = txs.status === "fulfilled" ? txs.value : [];

  const tags = deriveTags(solBal, holdings, transactions, address);
  const pnl = estimatePnL(transactions, holdings);
  const riskScore = calculateRiskScore(holdings, transactions, tags);

  return {
    address,
    solBalance: solBal,
    tokenHoldings: holdings,
    recentTransactions: transactions,
    riskScore,
    tags,
    lastActive: transactions[0]?.timestamp || new Date().toISOString(),
    estimatedPnL: pnl,
  };
}

export async function scanWhaleWallets(
  tokenMint: string = MAD_MINT,
  topN: number = 20
): Promise<WalletScanResult[]> {
  // Fetch top holders via Helius token holders endpoint
  // Fallback: use DexScreener pair data for rough estimate
  const holders = await fetchTopHolders(tokenMint, topN);
  const scans = await Promise.allSettled(
    holders.map((h) => scanWallet(h.address))
  );
  return scans
    .filter((s): s is PromiseFulfilledResult<WalletScanResult> => s.status === "fulfilled")
    .map((s) => s.value)
    .sort((a, b) => b.estimatedPnL?.total || 0 - (a.estimatedPnL?.total || 0));
}

export async function detectNewBuyers(
  tokenMint: string = MAD_MINT,
  hoursBack: number = 24
): Promise<WalletScanResult[]> {
  // Find wallets with first-ever purchase of this token within window
  const recentSwaps = await fetchTokenSwaps(tokenMint, hoursBack);
  const newBuyers = recentSwaps.filter(
    (swap) => swap.buyerHistory?.length === 1 || swap.isFirstBuy
  );
  const scans = await Promise.allSettled(
    newBuyers.map((b) => scanWallet(b.buyer))
  );
  return scans
    .filter((s): s is PromiseFulfilledResult<WalletScanResult> => s.status === "fulfilled")
    .map((s) => s.value)
    .filter((w) => w.tags.includes("new_wallet") || w.tags.includes("accumulator"));
}

export async function trackSmartMoneyRotation(
  walletAddresses: string[],
  tokenMint: string = MAD_MINT
): Promise<{ wallet: string; rotatedTo: string[]; rotatedFrom: string[] }[]> {
  const rotations = [];
  for (const addr of walletAddresses) {
    const scan = await scanWallet(addr);
    const madHolding = scan.tokenHoldings.find((t) => t.mint === tokenMint);
    const otherMints = scan.tokenHoldings
      .filter((t) => t.mint !== tokenMint && t.usdValue > 1000)
      .map((t) => t.mint);

    const recentSells = scan.recentTransactions.filter(
      (t) => t.type === "sell" && t.tokenOut?.mint === tokenMint
    );
    const recentBuys = scan.recentTransactions.filter(
      (t) => t.type === "buy" && t.tokenIn?.mint === tokenMint
    );

    if (recentSells.length > 0 && otherMints.length > 0) {
      rotations.push({ wallet: addr, rotatedTo: otherMints, rotatedFrom: [tokenMint] });
    } else if (recentBuys.length > 0 && madHolding && madHolding.usdValue > 1000) {
      rotations.push({ wallet: addr, rotatedTo: [tokenMint], rotatedFrom: otherMints });
    }
  }
  return rotations;
}

// ─── RPC Helpers ───

async function fetchSolBalance(address: string): Promise<number> {
  const res = await fetch(HELIUS_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "getBalance",
      params: [address],
    }),
  });
  const json = await res.json();
  return json.result?.value ? json.result.value / 1e9 : 0;
}

async function fetchTokenHoldings(address: string): Promise<TokenHolding[]> {
  // Helius: getTokenAccountsByOwner with parsed data
  // Fallback: simplified mock if no API key
  if (!HELIUS_KEY) {
    return [];
  }

  const res = await fetch(HELIUS_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "getTokenAccountsByOwner",
      params: [
        address,
        { programId: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA" },
        { encoding: "jsonParsed", commitment: "confirmed" },
      ],
    }),
  });

  const json = await res.json();
  const accounts = json.result?.value || [];

  const holdings: TokenHolding[] = await Promise.all(
    accounts
      .filter((acc: any) => {
        const ui = acc.account?.data?.parsed?.info?.tokenAmount?.uiAmount;
        return ui && ui > 0;
      })
      .map(async (acc: any) => {
        const mint = acc.account?.data?.parsed?.info?.mint;
        const amount = acc.account?.data?.parsed?.info?.tokenAmount?.uiAmount || 0;
        const decimals = acc.account?.data?.parsed?.info?.tokenAmount?.decimals || 0;

        // Fetch price data from DexScreener or Jupiter
        const priceInfo = await fetchTokenPrice(mint);

        return {
          mint,
          symbol: priceInfo?.symbol || "???",
          name: priceInfo?.name || "Unknown",
          amount,
          decimals,
          usdValue: priceInfo?.priceUsd ? amount * priceInfo.priceUsd : 0,
          priceChange24h: priceInfo?.priceChange24h,
        };
      })
  );

  return holdings.filter((h) => h.usdValue > 0.01).sort((a, b) => b.usdValue - a.usdValue);
}

async function fetchRecentTransactions(address: string, limit: number = 50): Promise<TxSummary[]> {
  if (!HELIUS_KEY) return [];

  const res = await fetch(HELIUS_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "getSignaturesForAddress",
      params: [address, { limit }],
    }),
  });

  const json = await res.json();
  const signatures: string[] = (json.result || []).map((r: any) => r.signature);

  if (signatures.length === 0) return [];

  // Fetch parsed transactions
  const txRes = await fetch(HELIUS_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "getParsedTransactions",
      params: [signatures, { maxSupportedTransactionVersion: 0 }],
    }),
  });

  const txJson = await txRes.json();
  const txs = txJson.result || [];

  return txs.map(parseTransaction).filter(Boolean) as TxSummary[];
}

async function fetchTopHolders(tokenMint: string, topN: number): Promise<{ address: string; amount: number }[]> {
  if (!HELIUS_KEY) return [];

  // Helius doesn't have a direct top-holders endpoint in free tier
  // Use Solscan or a fallback
  try {
    const res = await fetch(`${SOLSCAN_API}/token/holders?tokenAddress=${tokenMint}&offset=0&limit=${topN}`);
    const json = await res.json();
    return (json.data || []).map((h: any) => ({ address: h.address, amount: h.amount }));
  } catch {
    return [];
  }
}

async function fetchTokenSwaps(tokenMint: string, hoursBack: number): Promise<any[]> {
  // Requires Helius enhanced API or DEX Screener
  return [];
}

async function fetchTokenPrice(mint: string): Promise<{ symbol: string; name: string; priceUsd: number; priceChange24h?: number } | null> {
  try {
    const res = await fetch(`${DEX_SCREENER_API}/${mint}`);
    const json = await res.json();
    const pair = json.pairs?.[0];
    if (!pair) return null;
    return {
      symbol: pair.baseToken?.symbol || "???",
      name: pair.baseToken?.name || "Unknown",
      priceUsd: parseFloat(pair.priceUsd) || 0,
      priceChange24h: parseFloat(pair.priceChange?.h24) || 0,
    };
  } catch {
    return null;
  }
}

function parseTransaction(tx: any): TxSummary | null {
  if (!tx) return null;

  const meta = tx.meta;
  const blockTime = tx.blockTime;
  const timestamp = blockTime
    ? new Date(blockTime * 1000).toISOString()
    : new Date().toISOString();

  // Detect swap via Raydium/Jupiter/ pump.fun
  const isSwap = meta?.innerInstructions?.some((ix: any) =>
    ix.instructions?.some((i: any) =>
      i.programId === "JUP6LkbZbjS1jKKwapdHNy74zc3Hwc2D1B8Aq1G6Q" || // Jupiter
      i.programId === "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8" || // Raydium AMM
      i.programId === "6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14gA74a5b5y"    // pump.fun
    )
  );

  const type: TxSummary["type"] = isSwap ? "swap" : "other";
  const usdValue = 0; // Would need price oracle

  return {
    signature: tx.transaction?.signatures?.[0] || "",
    timestamp,
    type,
    usdValue,
    success: !meta?.err,
  };
}

function deriveTags(
  solBalance: number,
  holdings: TokenHolding[],
  transactions: TxSummary[],
  address: string
): WalletTag[] {
  const tags: WalletTag[] = [];
  const totalValue = holdings.reduce((sum, h) => sum + h.usdValue, 0) + solBalance * 150; // rough SOL price

  if (totalValue > 100_000) tags.push("whale");
  if (totalValue > 10_000 && totalValue < 100_000) tags.push("smart_money");

  const madHold = holdings.find((h) => h.mint === MAD_MINT);
  if (madHold) {
    const holdDuration = estimateHoldDuration(transactions, MAD_MINT);
    if (holdDuration > 30) tags.push("diamond_hands");
    if (holdDuration < 1 && transactions.some((t) => t.type === "sell")) tags.push("paper_hands");
  }

  const buyCount = transactions.filter((t) => t.type === "buy" || t.type === "swap").length;
  const sellCount = transactions.filter((t) => t.type === "sell").length;
  if (buyCount > sellCount * 2 && buyCount > 5) tags.push("accumulator");
  if (sellCount > buyCount * 2 && sellCount > 5) tags.push("dumper");

  // Check if new wallet (few txns, low balance)
  if (transactions.length < 10 && solBalance < 1) tags.push("new_wallet");

  // Check for MEV pattern (many small swaps, perfect timing)
  const swapCount = transactions.filter((t) => t.type === "swap").length;
  if (swapCount > 20 && transactions.length < 100) tags.push("bot");

  return tags;
}

function estimateHoldDuration(transactions: TxSummary[], mint: string): number {
  const related = transactions.filter(
    (t) => t.tokenIn?.mint === mint || t.tokenOut?.mint === mint
  );
  if (related.length < 2) return 0;
  const first = new Date(related[related.length - 1].timestamp);
  const last = new Date(related[0].timestamp);
  return (last.getTime() - first.getTime()) / (1000 * 60 * 60 * 24); // days
}

function estimatePnL(transactions: TxSummary[], _holdings: TokenHolding[]): PnL | null {
  if (transactions.length < 2) return null;

  const swaps = transactions.filter((t) => t.type === "swap" || t.type === "buy" || t.type === "sell");
  const totalVolume = swaps.reduce((sum, t) => sum + t.usdValue, 0);

  // Simplified: without accurate price data, this is an estimate
  const realized = swaps.reduce((sum, t) => {
    if (t.type === "sell") return sum + t.usdValue;
    return sum;
  }, 0);

  const winRate = swaps.length > 0 ? 0.5 : 0; // Placeholder without full price history

  return {
    realized,
    unrealized: 0, // Would need cost basis
    total: realized,
    winRate,
    trades: swaps.length,
  };
}

function calculateRiskScore(holdings: TokenHolding[], transactions: TxSummary[], tags: WalletTag[]): number {
  let score = 50; // baseline

  // Too many tokens = degen
  if (holdings.length > 20) score += 20;
  if (holdings.length > 50) score += 15;

  // High swap frequency = risky
  const swapCount = transactions.filter((t) => t.type === "swap").length;
  if (swapCount > 50) score += 15;

  // Bot tag = high risk
  if (tags.includes("bot")) score += 20;

  // New wallet = risky
  if (tags.includes("new_wallet")) score += 10;

  // Paper hands = unstable
  if (tags.includes("paper_hands")) score += 10;

  // Whale = less risky (has proven track record usually)
  if (tags.includes("whale")) score -= 15;
  if (tags.includes("diamond_hands")) score -= 10;

  return Math.min(100, Math.max(0, score));
}

function isValidSolanaAddress(address: string): boolean {
  return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
}

// ─── Demo / Mock Data ───

export function generateMockScan(address: string): WalletScanResult {
  const tags: WalletTag[] = ["accumulator", "diamond_hands"];
  const totalValue = Math.random() * 50000 + 5000;

  return {
    address,
    solBalance: Math.random() * 50 + 1,
    tokenHoldings: [
      {
        mint: MAD_MINT,
        symbol: "$MAD",
        name: "MAD",
        amount: Math.random() * 1e9 + 1e6,
        decimals: 6,
        usdValue: totalValue * 0.6,
        priceChange24h: (Math.random() - 0.5) * 20,
      },
      {
        mint: "So11111111111111111111111111111111111111112",
        symbol: "SOL",
        name: "Solana",
        amount: Math.random() * 100 + 5,
        decimals: 9,
        usdValue: totalValue * 0.25,
        priceChange24h: (Math.random() - 0.5) * 10,
      },
      {
        mint: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
        symbol: "BONK",
        name: "Bonk",
        amount: Math.random() * 1e8 + 1e6,
        decimals: 5,
        usdValue: totalValue * 0.1,
        priceChange24h: (Math.random() - 0.5) * 30,
      },
    ],
    recentTransactions: Array.from({ length: 5 }, (_, i) => ({
      signature: `${address.slice(0, 8)}...${i}`,
      timestamp: new Date(Date.now() - i * 3600000).toISOString(),
      type: Math.random() > 0.5 ? "buy" : "swap",
      usdValue: Math.random() * 500 + 50,
      success: true,
    })),
    riskScore: Math.floor(Math.random() * 40) + 30,
    tags,
    lastActive: new Date().toISOString(),
    estimatedPnL: {
      realized: Math.random() * 10000 - 2000,
      unrealized: Math.random() * 5000,
      total: Math.random() * 8000,
      winRate: Math.random() * 0.3 + 0.5,
      trades: Math.floor(Math.random() * 50) + 10,
    },
  };
}

export const WHALE_WATCHLIST = [
  // Add known whale addresses to track
  // "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
];
