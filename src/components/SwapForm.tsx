"use client";

import { useState, useCallback } from "react";
import { useCircle } from "@/contexts/CircleContext";
import { ARC_TESTNET } from "@/lib/config";
import ConfirmModal from "@/components/ConfirmModal";
import { AppKit } from "@circle-fin/app-kit";
import { createViemAdapterFromPrivateKey } from "@circle-fin/adapter-viem-v2";
import { createWalletClient, custom } from "viem";

const kit = new AppKit();

// Custom EIP-1193 provider: wraps HTTP RPC but handles wallet methods as no-op
function createRpcProvider(rpcUrl: string) {
  return {
    request: async ({ method, params }: { method: string; params?: unknown[] }) => {
      if (
        method === "wallet_switchEthereumChain" ||
        method === "wallet_addEthereumChain"
      ) {
        return null;
      }
      const res = await fetch(rpcUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jsonrpc: "2.0", method, params, id: Date.now() }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error.message);
      return data.result;
    },
  };
}

const SWAP_TOKENS = [
  { symbol: "USDC", name: "USD Coin" },
  { symbol: "USDT", name: "USDT" },
  { symbol: "EURC", name: "Euro Coin" },
  { symbol: "NATIVE", name: "ARC (Native)" },
];

interface SwapFormProps {
  isConnected: boolean;
  usdcBalance?: string;
}

export default function SwapForm({ isConnected, usdcBalance }: SwapFormProps) {
  const { wallet } = useCircle();
  const [tokenIn, setTokenIn] = useState("USDC");
  const [tokenOut, setTokenOut] = useState("USDT");
  const [amountIn, setAmountIn] = useState("");
  const [slippage, setSlippage] = useState("0.5"); // percentage
  const [status, setStatus] = useState<"idle" | "estimating" | "confirm" | "swapping" | "success" | "error">("idle");
  const [txHash, setTxHash] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [estimateResult, setEstimateResult] = useState<{
    estimatedOutput: string;
    fee: string;
    slippageBps: number;
  } | null>(null);

  const slippageBps = Math.round(parseFloat(slippage || "0.5") * 100);

  const getAdapter = useCallback(() => {
    if (!wallet?.privateKey) return null;
    return createViemAdapterFromPrivateKey({
      privateKey: wallet.privateKey,
      getWalletClient: ({ chain, account }) =>
        createWalletClient({
          account,
          chain,
          transport: custom(createRpcProvider(chain.rpcUrls.default.http[0])),
        }),
    });
  }, [wallet]);

  const handleEstimate = useCallback(async () => {
    if (!amountIn || !wallet) return;
    setStatus("estimating");
    setErrorMsg("");

    try {
      const adapter = getAdapter();
      if (!adapter) throw new Error("Wallet not ready");

      const params: any = {
        from: { adapter, chain: "Arc_Testnet" as const },
        tokenIn,
        tokenOut,
        amountIn,
        config: { slippageBps },
      };

      const estimate: any = await kit.estimateSwap(params);

      // Build output amount display from estimate
      let outputDisplay = "—";
      if (estimate?.estimatedOutput?.amount) {
        outputDisplay = estimate.estimatedOutput.amount;
      }

      // Parse fees
      let feeDisplay = "≈ $0.00";
      const fees = estimate?.fees;
      if (fees && fees.length > 0) {
        const totalFee = fees.reduce((sum: number, f: any) => {
          return sum + parseFloat(f.amount || "0");
        }, 0);
        if (totalFee > 0) {
          feeDisplay = `≈ $${totalFee.toFixed(6)}`;
        }
      }

      setEstimateResult({
        estimatedOutput: outputDisplay,
        fee: feeDisplay,
        slippageBps,
      });
      setStatus("confirm");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "";
      console.warn("Swap estimate failed, proceeding with defaults:", message);
      setEstimateResult({
        estimatedOutput: "—",
        fee: "≈ $0.00",
        slippageBps,
      });
      setStatus("confirm");
    }
  }, [amountIn, tokenIn, tokenOut, slippageBps, wallet, getAdapter]);

  const handleConfirmSwap = useCallback(async () => {
    if (!amountIn || !wallet) return;
    setStatus("swapping");

    try {
      const adapter = getAdapter();
      if (!adapter) throw new Error("Wallet not ready");

      const params: any = {
        from: { adapter, chain: "Arc_Testnet" as const },
        tokenIn,
        tokenOut,
        amountIn,
        config: { slippageBps },
      };

      const result: any = await kit.swap(params);
      setTxHash(result.txHash || "");
      setStatus("success");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setErrorMsg(message);
      setStatus("error");
    }
  }, [amountIn, tokenIn, tokenOut, slippageBps, wallet, getAdapter]);

  if (!isConnected) {
    return (
      <div className="bg-[#111620] border border-[#1e2640] rounded-2xl p-8 text-center">
        <p className="text-sm text-[#7a8599]">
          <span className="arc-label text-[#7a8599] block mb-1">CONNECT WALLET</span>
          Connect your wallet to swap tokens
        </p>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="bg-[#111620] border border-[#1e2640] rounded-2xl p-8 text-center space-y-5 animate-scale-in">
        <div className="w-16 h-16 rounded-2xl bg-[#1b3158] flex items-center justify-center mx-auto border border-[#2f578c]/30">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#acc6e9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-medium" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>Swap complete</h3>
          <p className="text-sm text-[#7a8599] mt-1">
            {amountIn} {tokenIn} → {estimateResult?.estimatedOutput || "?"} {tokenOut}
          </p>
        </div>
        {txHash && (
          <a
            href={`${ARC_TESTNET.explorerUrl}/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-[#9F72FF] hover:text-[#b899ff] transition-colors"
          >
            View on explorer ↗
          </a>
        )}
        <button
          onClick={() => {
            setStatus("idle");
            setAmountIn("");
            setTxHash("");
            setEstimateResult(null);
          }}
          className="w-full py-3 rounded-xl bg-[#1e2640] hover:bg-[#2f578c]/30 text-sm font-medium transition-all border border-[#1e2640]"
        >
          Swap again
        </button>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="bg-[#111620] border border-[#1e2640] rounded-2xl p-8 text-center space-y-5 animate-scale-in">
        <div className="w-16 h-16 rounded-2xl bg-[#1b3158] flex items-center justify-center mx-auto border border-[#702718]/50">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e9a13f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-medium" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>Swap failed</h3>
          <p className="text-sm text-[#e9a13f]/80 mt-1">{errorMsg || "Something went wrong"}</p>
        </div>
        <button
          onClick={() => setStatus("idle")}
          className="w-full py-3 rounded-xl bg-[#1e2640] hover:bg-[#2f578c]/30 text-sm font-medium transition-all border border-[#1e2640]"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="bg-[#111620] border border-[#1e2640] rounded-2xl p-6 space-y-5">
        <div className="flex items-center justify-between">
          <p className="arc-label text-[#7a8599]">SWAP TOKENS</p>
          <span className="text-[11px] text-[#7a8599] font-mono">//S.01</span>
        </div>

        {/* From token */}
        <div className="space-y-1.5">
          <label className="arc-label text-[#7a8599]">FROM</label>
          <div className="flex gap-2">
            <select
              value={tokenIn}
              onChange={(e) => {
                setTokenIn(e.target.value);
                if (e.target.value === tokenOut) setTokenOut(tokenIn);
              }}
              className="w-1/3 px-3 py-3 rounded-xl bg-[#141a24] border border-[#1e2640] focus:outline-none focus:border-[#2f578c] text-sm transition-all appearance-none cursor-pointer text-[#e8ecf0]"
            >
              {SWAP_TOKENS.map((t) => (
                <option key={t.symbol} value={t.symbol}>{t.symbol}</option>
              ))}
            </select>
            <input
              type="number"
              value={amountIn}
              onChange={(e) => setAmountIn(e.target.value)}
              placeholder="0.00"
              step="0.01"
              min="0"
              className="flex-1 px-4 py-3 rounded-xl bg-[#141a24] border border-[#1e2640] focus:outline-none focus:border-[#2f578c] text-lg font-light transition-all placeholder:text-[#7a8599]/40"
              style={{ fontFamily: '"Space Grotesk", sans-serif' }}
            />
          </div>
          <p className="text-xs text-[#7a8599]">Balance: {usdcBalance || "0"} USDC</p>
        </div>

        {/* Swap direction arrow */}
        <div className="flex justify-center">
          <button
            onClick={() => {
              setTokenIn(tokenOut);
              setTokenOut(tokenIn);
            }}
            className="w-10 h-10 rounded-xl bg-[#141a24] border border-[#1e2640] flex items-center justify-center text-[#7a8599] hover:text-[#acc6e9] hover:border-[#2f578c] transition-all"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="17 1 21 5 17 9" />
              <path d="M3 11V9a4 4 0 0 1 4-4h14" />
              <polyline points="7 23 3 19 7 15" />
              <path d="M21 13v2a4 4 0 0 1-4 4H3" />
            </svg>
          </button>
        </div>

        {/* To token */}
        <div className="space-y-1.5">
          <label className="arc-label text-[#7a8599]">TO</label>
          <select
            value={tokenOut}
            onChange={(e) => {
              setTokenOut(e.target.value);
              if (e.target.value === tokenIn) setTokenIn(tokenOut);
            }}
            className="w-full px-4 py-3 rounded-xl bg-[#141a24] border border-[#1e2640] focus:outline-none focus:border-[#2f578c] text-sm transition-all appearance-none cursor-pointer text-[#e8ecf0]"
          >
            {SWAP_TOKENS.map((t) => (
              <option key={t.symbol} value={t.symbol}>{t.symbol} — {t.name}</option>
            ))}
          </select>
        </div>

        {/* Slippage */}
        <div className="space-y-1.5">
          <label className="arc-label text-[#7a8599]">SLIPPAGE TOLERANCE</label>
          <div className="flex gap-2">
            {["0.1", "0.5", "1.0", "3.0"].map((v) => (
              <button
                key={v}
                onClick={() => setSlippage(v)}
                className={`flex-1 py-2 rounded-xl text-xs font-medium transition-all ${
                  slippage === v
                    ? "bg-[#1b3158] text-white border border-[#2f578c]/40"
                    : "bg-[#141a24] text-[#7a8599] hover:text-[#acc6e9] border border-[#1e2640]"
                }`}
              >
                {v}%
              </button>
            ))}
          </div>
        </div>

        {/* Privacy note */}
        <div className="bg-[#141a24] rounded-xl border border-[#1e2640] p-3">
          <p className="text-[10px] text-[#7a8599] flex items-center gap-1.5">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            Signed in-browser. Private key never leaves your device.
          </p>
        </div>

        {/* Swap button */}
        <button
          onClick={handleEstimate}
          disabled={!amountIn || parseFloat(amountIn) <= 0 || tokenIn === tokenOut || status === "estimating" || status === "swapping"}
          className="w-full py-3.5 rounded-2xl bg-[#1b3158] hover:bg-[#2f578c] text-white font-medium text-sm disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-lg shadow-[#1b3158]/20 border border-[#2f578c]/20"
        >
          {status === "estimating" ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4 text-[#acc6e9]" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Estimating swap...
            </span>
          ) : tokenIn === tokenOut ? (
            "Select different tokens"
          ) : (
            `Review ${amountIn || "0"} ${tokenIn} → ${tokenOut}`
          )}
        </button>
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={status === "confirm"}
        title="Confirm Swap"
        fromNetwork="Arc Testnet"
        fromAddress={wallet?.address || ""}
        toLabel="Receive"
        toValue={estimateResult?.estimatedOutput || "—"}
        amount={amountIn}
        token={tokenIn}
        fee={estimateResult?.fee || "≈ $0.00"}
        extraInfo={[
          { label: "Output", value: `${estimateResult?.estimatedOutput || "—"} ${tokenOut}` },
          { label: "Slippage", value: `${slippage}%` },
        ]}
        isLoading={status === "swapping"}
        loadingLabel="Swapping via AppKit..."
        onConfirm={handleConfirmSwap}
        onCancel={() => setStatus("idle")}
      />
    </>
  );
}
