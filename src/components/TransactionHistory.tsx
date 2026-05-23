"use client";

import { ARC_TESTNET } from "@/lib/config";
import { truncateAddress } from "@/lib/utils";

interface Transaction {
  hash: string;
  type: string;
  amount: string;
  token: string;
  from: string;
  to: string;
  time: string;
  status: string;
}

interface TransactionHistoryProps {
  isConnected: boolean;
  transactions?: Transaction[];
}

const TYPE_STYLES: Record<string, { icon: string; bg: string; color: string }> = {
  receive: { icon: "↓", bg: "bg-[#1b3158]", color: "text-[#acc6e9]" },
  send: { icon: "↑", bg: "bg-[#2f578c]/30", color: "text-[#9F72FF]" },
  bridge: { icon: "↔", bg: "bg-[#1b3158]", color: "text-[#e9a13f]" },
  swap: { icon: "⟳", bg: "bg-[#2f578c]/30", color: "text-[#ffcc6f]" },
};

export default function TransactionHistory({ isConnected, transactions = [] }: TransactionHistoryProps) {
  if (!isConnected) {
    return (
      <div className="bg-[#111620] border border-[#1e2640] rounded-2xl p-8 text-center">
        <p className="arc-label text-[#7a8599] mb-1">NO ACTIVITY</p>
        <p className="text-sm text-[#7a8599]">Connect your wallet to see history</p>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="bg-[#111620] border border-[#1e2640] rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-[#1e2640] flex items-center justify-between">
          <p className="arc-label text-[#7a8599]">RECENT ACTIVITY</p>
          <span className="text-[11px] text-[#7a8599] font-mono">//T.02</span>
        </div>
        <div className="p-8 text-center">
          <p className="text-sm text-[#7a8599]">No transactions yet</p>
          <p className="text-xs text-[#7a8599]/60 mt-1">
            Send USDC to see your activity here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#111620] border border-[#1e2640] rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[#1e2640] flex items-center justify-between">
        <p className="arc-label text-[#7a8599]">RECENT ACTIVITY</p>
        <span className="text-[11px] text-[#7a8599] font-mono">//T.02</span>
      </div>

      {/* List */}
      <div className="divide-y divide-[#1e2640]">
        {transactions.map((tx, i) => {
          const style = TYPE_STYLES[tx.type] || TYPE_STYLES.send;
          return (
            <div key={i} className="px-6 py-3.5 hover:bg-[#141a24] transition-colors">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-medium ${style.bg} ${style.color}`}>
                  {style.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium capitalize text-[#e8ecf0]">{tx.type}</p>
                  <p className="text-xs text-[#7a8599] truncate">
                    {tx.type === "send" ? `To ${truncateAddress(tx.to)}` :
                     tx.type === "receive" ? `From ${truncateAddress(tx.from)}` : tx.from}
                  </p>
                </div>

                <div className="text-right">
                  <p className={`text-sm font-medium ${tx.type === "receive" ? "text-[#acc6e9]" : ""}`}>
                    {tx.type === "receive" ? "+" : ""}{tx.amount} {tx.token}
                  </p>
                  <p className="text-xs text-[#7a8599]">{tx.time}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <a
        href={ARC_TESTNET.explorerUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block px-6 py-3.5 text-center text-xs text-[#9F72FF] hover:text-[#b899ff] transition-colors border-t border-[#1e2640]"
      >
        View all on Arc Scan ↗
      </a>
    </div>
  );
}
