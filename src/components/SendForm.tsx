"use client";

import { useState } from "react";
import { ARC_TESTNET } from "@/lib/config";
import { useCircle } from "@/contexts/CircleContext";

interface SendFormProps {
  isConnected: boolean;
}

export default function SendForm({ isConnected }: SendFormProps) {
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
      <div className="bg-card border border-border rounded-2xl p-8 text-center">
        <p className="text-muted-foreground">Connect your wallet to send tokens</p>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="bg-card border border-border rounded-2xl p-6 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-semibold">Sent successfully!</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {amount} {token} sent to {to.slice(0, 6)}...{to.slice(-4)}
          </p>
        </div>
        {txHash && (
          <a
            href={`${ARC_TESTNET.explorerUrl}/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
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
          className="w-full py-2.5 rounded-xl bg-muted text-sm font-medium hover:bg-muted/80 transition-colors"
        >
          Send again
        </button>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="bg-card border border-border rounded-2xl p-6 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-semibold">Transaction failed</h3>
          <p className="text-sm text-red-500/80 mt-1">{errorMsg || "Something went wrong"}</p>
        </div>
        <button
          onClick={() => setStatus("idle")}
          className="w-full py-2.5 rounded-xl bg-muted text-sm font-medium hover:bg-muted/80 transition-colors"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-2xl p-5 space-y-5">
      <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
        Send Tokens
      </h2>

      {/* Token selector */}
      <div className="flex gap-2">
        {(["USDC", "EURC"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setToken(t)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
              token === t
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Recipient */}
      <div className="space-y-1.5">
        <label className="text-xs text-muted-foreground font-medium">Recipient Address</label>
        <input
          type="text"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          placeholder="0x..."
          className="w-full px-4 py-3 rounded-xl bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm font-mono transition-all"
        />
      </div>

      {/* Amount */}
      <div className="space-y-1.5">
        <label className="text-xs text-muted-foreground font-medium">Amount</label>
        <div className="relative">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            step="0.01"
            min="0"
            className="w-full px-4 py-3 rounded-xl bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 text-lg font-semibold transition-all"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">
            {token}
          </span>
        </div>
        <p className="text-xs text-muted-foreground">
          Balance: {token === "USDC" ? "1,250.50" : "250.00"} {token}
        </p>
      </div>

      {/* Fee info */}
      <div className="bg-muted/50 rounded-xl p-3 space-y-1.5">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Network fee</span>
          <span className="text-green-500 font-medium">~$0.00 (sponsored)</span>
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Arrival time</span>
          <span className="font-medium">&lt; 1 second</span>
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Network</span>
          <span className="font-medium">Arc Testnet</span>
        </div>
      </div>

      {/* Send button */}
      <button
        onClick={handleSend}
        disabled={!to || !amount || status === "sending"}
        className="w-full py-3.5 rounded-2xl wallet-gradient text-white font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-all shadow-lg shadow-blue-500/20"
      >
        {status === "sending" ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
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
