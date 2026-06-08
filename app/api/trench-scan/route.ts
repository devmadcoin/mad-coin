import { NextRequest, NextResponse } from "next/server";
import { scanWallet, scanWhaleWallets, detectNewBuyers, generateMockScan, WalletScanResult } from "@/lib/wallet-scanner";

const USE_MOCK = !process.env.HELIUS_API_KEY;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const address = searchParams.get("address");
  const mode = searchParams.get("mode") || "single"; // single | whales | newbies

  try {
    if (mode === "single" && address) {
      const result = USE_MOCK
        ? generateMockScan(address)
        : await scanWallet(address);
      return NextResponse.json({ ok: true, data: result });
    }

    if (mode === "whales") {
      const results = USE_MOCK
        ? Array.from({ length: 5 }, () => generateMockScan(randomAddress()))
        : await scanWhaleWallets();
      return NextResponse.json({ ok: true, data: results });
    }

    if (mode === "newbies") {
      const results = USE_MOCK
        ? Array.from({ length: 5 }, () => generateMockScan(randomAddress()))
        : await detectNewBuyers();
      return NextResponse.json({ ok: true, data: results });
    }

    return NextResponse.json({ ok: false, error: "Missing address or mode" }, { status: 400 });
  } catch (err: any) {
    console.error("Trench scan error:", err);
    return NextResponse.json(
      { ok: false, error: err.message || "Scan failed" },
      { status: 500 }
    );
  }
}

function randomAddress(): string {
  const chars = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
  let addr = "";
  for (let i = 0; i < 44; i++) addr += chars[Math.floor(Math.random() * chars.length)];
  return addr;
}
