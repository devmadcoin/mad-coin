import { NextRequest, NextResponse } from "next/server";

const SOLANA_RPC = "https://api.mainnet-beta.solana.com";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const rpcRes = await fetch(SOLANA_RPC, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await rpcRes.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Solana RPC proxy error:", error);
    return NextResponse.json(
      { error: "RPC proxy failed", details: String(error) },
      { status: 500 }
    );
  }
}
