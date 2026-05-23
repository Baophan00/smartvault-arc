"use client";

import { ARC_TESTNET } from "@/lib/config";
import { truncateAddress } from "@/lib/utils";

interface TransactionHistoryProps {
  isConnected: boolean;
}

const MOCK_TXS = [
  { hash: "0xabc...def1", type: "receive" as const, amount: "500.00", token: "USDC", from: "0x742...3f2a", time: "2 min ago", status: "confirmed" as const },
  { hash: "0xdef...7890", type: "send" as const, amount: "100.00", token: "USDC", to: "0x8a3...b1c9", time: "15 min ago", status: "confirmed" as const },
  { hash: "0x456...cdef", type: "bridge" as const, amount: "1,000.00", token: "USDC", from: "Ethereum → Arc", time: "1 hr ago", status: "confirmed" as const },
  { hash: "0x789...abcd", type: "swap" as const, amount: "250.00", token: "USDC → EURC", time: "3 hrs ago", status: "confirmed" as const },
];

export default function TransactionHistory({ isConnected }: TransactionHistoryProps) {
  if (!isConnected) {
    return (
      <div className="bg-card border border-border rounded-2xl p-8 text-center">
        <p className="text-muted-foreground">Connect your wallet to see history</p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-2xl">
      {/* Header */}
      <div className="p-5 border-b border-border">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Recent Activity
        </h2>
      </div>

      {/* List */}
      <div className="divide-y divide-border">
        {MOCK_TXS.map((tx, i) => (
          <div key={i} className="p-4 hover:bg-muted/30 transition-colors">
            <div className="flex items-center gap-3">
              {/* Icon */}
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm ${
                tx.type === "receive" ? "bg-green-500/10" :
                tx.type === "send" ? "bg-red-500/10" :
                tx.type === "bridge" ? "bg-blue-500/10" : "bg-purple-500/10"
              }`}>
                {tx.type === "receive" && <span className="text-green-500">↓</span>}
                {tx.type === "send" && <span className="text-red-500">↑</span>}
                {tx.type === "bridge" && <span className="text-blue-500">↔</span>}
                {tx.type === "swap" && <span className="text-purple-500">⟳</span>}
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium capitalize">{tx.type}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {tx.type === "send" ? `To ${truncateAddress(tx.to || "")}` :
                   tx.type === "receive" ? `From ${truncateAddress(tx.from || "")}` :
                   tx.type === "bridge" ? tx.from : tx.from || tx.to}
                </p>
              </div>

              {/* Amount & Time */}
              <div className="text-right">
                <p className={`text-sm font-semibold ${
                  tx.type === "receive" ? "text-green-500" : ""
                }`}>
                  {tx.type === "receive" ? "+" : ""}{tx.amount} {tx.token.split(" ")[0]}
                </p>
                <p className="text-xs text-muted-foreground">{tx.time}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Explorer link */}
      <a
        href={ARC_TESTNET.explorerUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block p-4 text-center text-sm text-primary hover:underline border-t border-border"
      >
        View all on Arc Scan ↗
      </a>
    </div>
  );
}
