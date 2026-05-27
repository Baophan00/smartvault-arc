"use client";

import { useState } from "react";
import { ARC_TESTNET } from "@/lib/config";
import { useCircle } from "@/contexts/CircleContext";

interface SendFormProps {
  isConnected: boolean;
  usdcBalance?: string;
  eurcBalance?: string;
}

export default function SendForm({ isConnected, usdcBalance, eurcBalance }: SendFormProps) {
  const { wallet } = useCircle();
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [token, setToken] = useState<"USDC" | "EURC">("USDC");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [txHash, setTxHash] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSend = async () => {
    if (!to || !amount || !wallet) return;
    setStatus("sending");
    setErrorMsg("");

    try {
      const res = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          privateKey: wallet.privateKey,
          to,
          amount,
          token,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Send failed");
      }

      setTxHash(data.txHash);
      setStatus("success");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setErrorMsg(message);
      setStatus("error");
    }
  };

  if (!isConnected) {
    return (
      <div className="bg-[#111620] border border-[#1e2640] rounded-2xl p-8 text-center">
        <p className="text-sm text-[#7a8599]">
          <span className="arc-label text-[#7a8599] block mb-1">CONNECT WALLET</span>
          Connect your wallet to send tokens
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
          <h3 className="text-lg font-medium" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>Sent successfully</h3>
          <p className="text-sm text-[#7a8599] mt-1">
            {amount} {token} → {to.slice(0, 6)}...{to.slice(-4)}
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
            setTo("");
            setAmount("");
            setTxHash("");
          }}
          className="w-full py-3 rounded-xl bg-[#1e2640] hover:bg-[#2f578c]/30 text-sm font-medium transition-all border border-[#1e2640]"
        >
          Send again
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
          <h3 className="text-lg font-medium" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>Transaction failed</h3>
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
    <div className="bg-[#111620] border border-[#1e2640] rounded-2xl p-6 space-y-5">
      <div className="flex items-center justify-between">
        <p className="arc-label text-[#7a8599]">SEND TOKENS</p>
        <span className="text-[11px] text-[#7a8599] font-mono">//T.01</span>
      </div>

      {/* Token selector */}
      <div className="flex gap-2">
        {(["USDC", "EURC"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setToken(t)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
              token === t
                ? "bg-[#1b3158] text-white border border-[#2f578c]/40"
                : "bg-[#141a24] text-[#7a8599] hover:text-[#acc6e9] border border-[#1e2640]"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Recipient */}
      <div className="space-y-1.5">
        <label className="arc-label text-[#7a8599]">RECIPIENT</label>
        <input
          type="text"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          placeholder="0x..."
          className="w-full px-4 py-3 rounded-xl bg-[#141a24] border border-[#1e2640] focus:outline-none focus:border-[#2f578c] text-sm font-mono transition-all placeholder:text-[#7a8599]/40"
        />
      </div>

      {/* Amount */}
      <div className="space-y-1.5">
        <label className="arc-label text-[#7a8599]">AMOUNT</label>
        <div className="relative">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            step="0.01"
            min="0"
            className="w-full px-4 py-3 rounded-xl bg-[#141a24] border border-[#1e2640] focus:outline-none focus:border-[#2f578c] text-lg font-light transition-all placeholder:text-[#7a8599]/40"
            style={{ fontFamily: '"Space Grotesk", sans-serif' }}
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[#7a8599] arc-label">
            {token}
          </span>
        </div>
        <p className="text-xs text-[#7a8599]">
          Balance: {token === "USDC" ? (usdcBalance || "0") : (eurcBalance || "0")} {token}
        </p>
      </div>

      {/* Fee info — ARC-style stats section */}
      <div className="bg-[#0a0d14] rounded-xl border border-[#1e2640] divide-y divide-[#1e2640]">
        <div className="flex justify-between px-4 py-2.5">
          <span className="text-xs text-[#7a8599]">Network fee</span>
          <span className="text-xs font-medium text-[#9F72FF]">~$0.00 (sponsored)</span>
        </div>
        <div className="flex justify-between px-4 py-2.5">
          <span className="text-xs text-[#7a8599]">Arrival time</span>
          <span className="text-xs font-medium text-[#acc6e9]">&lt; 1 second</span>
        </div>
        <div className="flex justify-between px-4 py-2.5">
          <span className="text-xs text-[#7a8599]">Network</span>
          <span className="text-xs font-medium">Arc Testnet</span>
        </div>
      </div>

      {/* Send button */}
      <button
        onClick={handleSend}
        disabled={!to || !amount || status === "sending"}
        className="w-full py-3.5 rounded-2xl bg-[#1b3158] hover:bg-[#2f578c] text-white font-medium text-sm disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-lg shadow-[#1b3158]/20 border border-[#2f578c]/20"
      >
        {status === "sending" ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4 text-[#acc6e9]" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Sending on Arc Testnet...
          </span>
        ) : (
          `Send ${amount || "0"} ${token}`
        )}
      </button>
    </div>
  );
}
