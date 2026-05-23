"use client";

import { formatBalance, truncateAddress } from "@/lib/utils";

interface WalletCardProps {
  isConnected: boolean;
  address: string;
  onConnect?: (address: string) => void;
  onCreateWallet?: () => void;
}

export default function WalletCard({ isConnected, address, onCreateWallet }: WalletCardProps) {
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
            <span className="text-xs text-white/60">Security</span>
            <span className="text-xs font-medium text-green-300 flex items-center gap-1">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              Passkey
            </span>
          </div>
        </div>
      )}

      {/* CTA when not connected */}
      {!isConnected && (
        <button
          onClick={onCreateWallet}
          className="glass rounded-2xl p-4 w-full text-left hover:bg-white/10 transition-colors cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center group-hover:scale-105 transition-transform">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold">Create a SmartVault</p>
              <p className="text-xs text-white/60">
                Secured by Face ID / Passkey. No seed phrase needed.
              </p>
            </div>
            <svg className="ml-auto text-white/40" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </div>
        </button>
      )}
    </div>
  );
}
