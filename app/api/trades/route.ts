import { NextResponse } from "next/server";

const TOKEN_CA = "Fa7ZE9nCEYnrHsnoeHuhEExJpchtrBtKXnWe6CgHpump";
const BIRDEYE_API = "https://public-api.birdeye.so/defi/txs";

// Types matching Birdeye API response
interface BirdeyeTx {
  txHash: string;
  owner: string;
  from: {
    address: string;
    symbol: string;
    amount: number;
    decimals: number;
  };
  to: {
    address: string;
    symbol: string;
    amount: number;
    decimals: number;
  };
  blockTime: number;
}

interface TradeData {
  time: string;
  type: "buy" | "sell";
  solAmount: string;
  usdValue: string;
  tokenAmount: string;
  price: string;
  wallet: string;
  walletShort: string;
  txHash: string;
}

function formatTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() / 1000) - timestamp);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
}

function shortenWallet(addr: string): string {
  return addr.slice(0, 4) + "..." + addr.slice(-4);
}

export async function GET() {
  const apiKey = process.env.BIRDEYE_API_KEY;

  if (!apiKey) {
    // Return demo data with flag
    return NextResponse.json({
      trades: [],
      demo: true,
      message: "Add BIRDEYE_API_KEY to your .env for live data",
    });
  }

  try {
    const res = await fetch(
      `${BIRDEYE_API}?address=${TOKEN_CA}&offset=0&limit=20`,
      {
        headers: {
          "X-API-KEY": apiKey,
          "accept": "application/json",
        },
        next: { revalidate: 15 }, // Cache for 15 seconds
      }
    );

    if (!res.ok) {
      throw new Error(`Birdeye API error: ${res.status}`);
    }

    const data = await res.json();
    const transactions: BirdeyeTx[] = data?.data?.items || [];

    // Get SOL price for USD conversion (approximate)
    const solPriceRes = await fetch(
      "https://api.dexscreener.com/latest/dex/pairs/solana/So11111111111111111111111111111111111111112",
      { next: { revalidate: 60 } }
    );
    const solPriceData = await solPriceRes.json();
    const solPriceUsd = parseFloat(solPriceData?.pairs?.[0]?.priceUsd || "140");

    const trades: TradeData[] = transactions.map((tx: BirdeyeTx) => {
      const isBuy = tx.to.address === TOKEN_CA || tx.to.symbol === "$MAD";
      const solAmt = isBuy ? tx.from.amount / Math.pow(10, tx.from.decimals) : tx.to.amount / Math.pow(10, tx.to.decimals);
      const tokenAmt = isBuy ? tx.to.amount / Math.pow(10, tx.to.decimals) : tx.from.amount / Math.pow(10, tx.from.decimals);
      const usdVal = solAmt * solPriceUsd;
      const price = tokenAmt > 0 ? usdVal / tokenAmt : 0;

      return {
        time: formatTimeAgo(tx.blockTime),
        type: isBuy ? "buy" : "sell",
        solAmount: solAmt.toFixed(solAmt < 0.1 ? 3 : 2),
        usdValue: usdVal >= 1000 ? `$${(usdVal / 1000).toFixed(1)}K` : `$${usdVal.toFixed(2)}`,
        tokenAmount: tokenAmt >= 1000 ? `${(tokenAmt / 1000).toFixed(1)}K` : tokenAmt.toFixed(0),
        price: `$${price.toFixed(6)}`,
        wallet: tx.owner,
        walletShort: shortenWallet(tx.owner),
        txHash: tx.txHash,
      };
    });

    return NextResponse.json({ trades, demo: false });
  } catch (err) {
    console.error("Trade fetch error:", err);
    return NextResponse.json(
      { trades: [], demo: true, error: "Failed to fetch live data" },
      { status: 500 }
    );
  }
}
