import { NextRequest, NextResponse } from "next/server";
import { createPublicClient, http, formatUnits } from "viem";
import { ARC_TESTNET, ARC_TOKENS } from "@/lib/config";

// Create viem public client for Arc Testnet
const client = createPublicClient({
  transport: http(ARC_TESTNET.rpcUrl),
});

// ERC-20 ABI for balanceOf
const ERC20_ABI = [
  {
    name: "balanceOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "balance", type: "uint256" }],
  },
] as const;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { address } = body;

    if (!address) {
      return NextResponse.json(
        { error: "Missing address" },
        { status: 400 }
      );
    }

    // 1. Native USDC balance (native token on Arc — use eth_getBalance)
    const nativeBalanceWei = await client.getBalance({
      address: address as `0x${string}`,
    });
    const usdcBalance = formatUnits(nativeBalanceWei, ARC_TESTNET.currencyDecimals);

    // 2. EURC balance (ERC-20 token)
    let eurcBalance = "0";
    try {
      const eurcResult = await client.readContract({
        address: ARC_TOKENS.EURC.address as `0x${string}`,
        abi: ERC20_ABI,
        functionName: "balanceOf",
        args: [address as `0x${string}`],
      });
      eurcBalance = formatUnits(eurcResult as bigint, ARC_TOKENS.EURC.decimals);
    } catch (e) {
      console.warn("Failed to fetch EURC balance:", e);
    }

    // 3. Get recent transactions (last 10)
    let transactions: Array<{
      hash: string;
      type: string;
      amount: string;
      token: string;
      from: string;
      to: string;
      time: string;
      status: string;
    }> = [];

    try {
      // Get the latest block number
      const blockNumber = await client.getBlockNumber();
      
      // We'll look at the last 50 blocks for transactions involving this address
      const fromBlock = blockNumber - BigInt(50);
      
      // Use eth_getLogs to find Transfer events involving this address
      const transferEventSignature = "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef";
      
      const logs = await client.getLogs({
        event: {
          type: "event" as const,
          name: "Transfer",
          inputs: [
            { type: "address", name: "from", indexed: true },
            { type: "address", name: "to", indexed: true },
            { type: "uint256", name: "value", indexed: false },
          ],
        },
        args: {
          from: address as `0x${string}`,
        },
        fromBlock,
        toBlock: blockNumber,
      });

      const incomingLogs = await client.getLogs({
        event: {
          type: "event" as const,
          name: "Transfer",
          inputs: [
            { type: "address", name: "from", indexed: true },
            { type: "address", name: "to", indexed: true },
            { type: "uint256", name: "value", indexed: false },
          ],
        },
        args: {
          to: address as `0x${string}`,
        },
        fromBlock,
        toBlock: blockNumber,
      });

      // Combine and sort
      const ALL_LOGS = [...logs, ...incomingLogs].slice(0, 10);

      // Collect unique block numbers to fetch timestamps in batch
      const uniqueBlocks = new Set<string>();
      for (const log of ALL_LOGS) {
        if (log.blockNumber) uniqueBlocks.add(log.blockNumber.toString());
      }
      const blockCache = new Map<string, number>();
      const now = Math.floor(Date.now() / 1000);

      await Promise.all(
        Array.from(uniqueBlocks).map(async (blockNumStr) => {
          try {
            const block = await client.getBlock({
              blockNumber: BigInt(blockNumStr),
            });
            blockCache.set(blockNumStr, Number(block.timestamp));
          } catch {
            blockCache.set(blockNumStr, now);
          }
        })
      );

      for (const log of ALL_LOGS) {
        const isSend = log.args.from?.toLowerCase() === address.toLowerCase();
        const blockTs = log.blockNumber
          ? blockCache.get(log.blockNumber.toString()) || now
          : now;
        const secondsAgo = now - blockTs;
        const timeAgo =
          secondsAgo < 60
            ? `${secondsAgo}s ago`
            : secondsAgo < 3600
            ? `${Math.floor(secondsAgo / 60)}m ago`
            : secondsAgo < 86400
            ? `${Math.floor(secondsAgo / 3600)}h ago`
            : `${Math.floor(secondsAgo / 86400)}d ago`;
        transactions.push({
          hash: `${log.transactionHash.slice(0, 10)}...`,
          type: isSend ? "send" : "receive",
          amount: formatUnits(log.args.value as bigint, 6),
          token: "USDC",
          from: `${(log.args.from || "").slice(0, 8)}...`,
          to: `${(log.args.to || "").slice(0, 8)}...`,
          time: timeAgo,
          status: "confirmed",
        });
      }
    } catch (e) {
      console.warn("Failed to fetch transactions:", e);
    }

    return NextResponse.json({
      success: true,
      balances: {
        USDC: parseFloat(usdcBalance).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
        EURC: parseFloat(eurcBalance).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
        total: (
          parseFloat(usdcBalance) + parseFloat(eurcBalance)
        ).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
        raw: {
          USDC: usdcBalance,
          EURC: eurcBalance,
        },
      },
      transactions: transactions.slice(0, 5),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Balance fetch error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
