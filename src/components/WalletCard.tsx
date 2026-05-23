"use client";

import { formatBalance, truncateAddress } from "@/lib/utils";

interface WalletCardProps {
  isConnected: boolean;
  address: string;
}

export default function WalletCard({ isConnected, address }: WalletCardProps) {
  return (
    <div className="wallet-gradient rounded-3xl p-6 text-white shadow-2xl shadow-blue-500/20">
      {/* Total Balance */}
      <div className="space-y-1 mb-6">
        <p className="text-sm text-white/70 font-medium">Total Balance</p>
        <p className="text-3xl font-bold tracking-tight">
          {isConnected ? "$1,500.50" : "$0.00"}
        </p>
        <p className="text-xs text-white/50">
          {isConnected ? "Unified across all chains" : "Connect wallet to view"}
        </p>
      </div>

      {/* Wallet Info */}
      {isConnected && (
        <div className="glass rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/60">Address</span>
            <span className="text-xs font-mono text-white/80">{truncateAddress(address, 6)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/60">Network</span>
            <span className="text-xs font-medium bg-white/15 px-2 py-0.5 rounded-full">Arc Testnet</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/60">Gas</span>
            <span className="text-xs font-medium text-white/80">USDC</span>
          </div>
        </div>
      )}

      {/* Quick actions inside card */}
      {!isConnected && (
        <div className="glass rounded-2xl p-4">
          <p className="text-xs text-white/70 text-center">
            Connect wallet to send, receive, and bridge USDC
          </p>
        </div>
      )}
    </div>
  );
}
