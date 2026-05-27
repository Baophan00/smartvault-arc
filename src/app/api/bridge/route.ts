import { NextRequest, NextResponse } from "next/server";
import { AppKit } from "@circle-fin/app-kit";
import { createViemAdapterFromPrivateKey } from "@circle-fin/adapter-viem-v2";

const kit = new AppKit();

// Testnet chains that support bridging FROM Arc Testnet
export const BRIDGE_DESTINATIONS = [
  { value: "Ethereum_Sepolia", label: "Ethereum Sepolia" },
  { value: "Arbitrum_Sepolia", label: "Arbitrum Sepolia" },
  { value: "Base_Sepolia", label: "Base Sepolia" },
  { value: "Avalanche_Fuji", label: "Avalanche Fuji" },
  { value: "Optimism_Sepolia", label: "Optimism Sepolia" },
  { value: "Polygon_Amoy_Testnet", label: "Polygon Amoy" },
  { value: "Sonic_Testnet", label: "Sonic Testnet" },
  { value: "Sui_Testnet", label: "Sui Testnet" },
  { value: "Solana_Devnet", label: "Solana Devnet" },
] as const;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { privateKey, amount, destinationChain, recipientAddress } = body;

    if (!privateKey || !amount || !destinationChain || !recipientAddress) {
      return NextResponse.json(
        { error: "Missing required fields: privateKey, amount, destinationChain, recipientAddress" },
        { status: 400 }
      );
    }

    // Create source adapter (Arc Testnet)
    const sourceAdapter = createViemAdapterFromPrivateKey({
      privateKey: privateKey as string,
    });

    // Validate destination chain
    const validChain = BRIDGE_DESTINATIONS.find(
      (d) => d.value === destinationChain
    );
    if (!validChain) {
      return NextResponse.json(
        { error: `Unsupported destination chain: ${destinationChain}` },
        { status: 400 }
      );
    }

    // Estimate bridge fee first
    const estimateParams = {
      from: { adapter: sourceAdapter, chain: "Arc_Testnet" as const },
      to: {
        chain: destinationChain as string,
        useForwarder: true as const,
        recipientAddress: recipientAddress as string,
      } as any, // Cast needed: AppKit supports forwarder-only (no adapter on dest)
      amount: amount as string,
      token: "USDC" as const,
    } as any;

    const estimate = await kit.estimateBridge(estimateParams);
    console.log("Bridge estimate:", estimate);

    // Execute bridge
    const result: any = await kit.bridge(estimateParams);

    return NextResponse.json({
      success: true,
      state: result.state || "unknown",
      txHash: result.txHash || result.hash || result.steps?.[0]?.txHash || result.steps?.[0]?.hash || null,
      steps: (result.steps || []).map((s: any) => ({
        type: s.name || s.type,
        hash: s.txHash || s.hash,
        status: s.state || s.status,
        error: s.errorMessage || s.error,
      })),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Bridge error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
