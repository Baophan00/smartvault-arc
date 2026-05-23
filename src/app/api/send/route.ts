import { NextRequest, NextResponse } from "next/server";
import { AppKit } from "@circle-fin/app-kit";
import { createViemAdapterFromPrivateKey } from "@circle-fin/adapter-viem-v2";

const kit = new AppKit();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { privateKey, to, amount, token } = body;

    if (!privateKey || !to || !amount || !token) {
      return NextResponse.json(
        { error: "Missing required fields: privateKey, to, amount, token" },
        { status: 400 }
      );
    }

    const adapter = createViemAdapterFromPrivateKey({
      privateKey: privateKey as string,
    });

    // Estimate fee first
    const estimateParams = {
      from: { adapter, chain: "Arc_Testnet" as const },
      to: to as string,
      amount: amount as string,
      token: token as string,
    };

    const estimate = await kit.estimateSend(estimateParams);
    console.log("Send estimate:", estimate);

    // Execute send
    const result = await kit.send(estimateParams);

    return NextResponse.json({
      success: true,
      txHash: result.txHash,
      explorerUrl: `https://testnet.arcscan.app/tx/${result.txHash}`,
      state: result.state,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Send error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
