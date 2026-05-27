"use client";

import { truncateAddress } from "@/lib/utils";
import { useState } from "react";

interface WalletCardProps {
  isConnected: boolean;
  address: string;
  balance?: string;
  loading?: boolean;
  onConnect?: (address: string) => void;
  onCreateWallet?: () => void;
}

export default function WalletCard({ isConnected, address, balance, loading, onCreateWallet }: WalletCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!address) return;
    navigator.clipboard.writeText(address).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      const textArea = document.createElement("textarea");
      textArea.value = address;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="relative overflow-hidden rounded-3xl arc-glow-blue">
      {/* Premium gradient card — ARC-inspired */}
      <div className="relative z-10 p-6 wallet-gradient-light">
        <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-white/5 blur-xl" />
        <div className="absolute -bottom-10 -left-10 w-24 h-24 rounded-full bg-[#9F72FF]/10 blur-xl" />
        <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        <div className="relative z-10">
          <p className="arc-label text-white/50 mb-1">TOTAL BALANCE</p>
        </div>

        <div className="relative z-10 mt-1 flex items-baseline gap-2">
          {loading ? (
            <div className="flex items-center gap-2">
              <span
                className="text-[40px] font-light leading-none tracking-tight"
                style={{ fontFamily: '"Space Grotesk", sans-serif' }}
              >
                —
              </span>
              <svg className="animate-spin h-5 w-5 text-white/50" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
          ) : (
            <span
              className="text-[40px] font-light leading-none tracking-tight"
              style={{ fontFamily: '"Space Grotesk", sans-serif' }}
            >
              {isConnected && balance ? `$${balance}` : "$0.00"}
            </span>
          )}
          {isConnected && balance && (
            <span className="text-xs text-white/50 font-medium arc-label">USDC</span>
          )}
        </div>

        <p className="relative z-10 text-xs text-white/40 mt-2">
          {isConnected
            ? loading
              ? "Fetching balance from Arc..."
              : "Real balance from Arc Testnet"
            : "Connect wallet to view balance"}
        </p>
      </div>

      {/* Wallet info section */}
      {isConnected && (
        <div className="bg-[#0d1522] border-t border-[#1e2640]/60 px-6 py-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="arc-label text-[#7a8599] mb-1">ADDRESS</p>
              <button
                onClick={handleCopy}
                className="text-xs font-mono text-[#acc6e9] hover:text-[#9F72FF] transition-colors flex items-center gap-1.5"
              >
                {truncateAddress(address, 6)}
                {copied ? (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#9F72FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                )}
              </button>
            </div>
            <div>
              <p className="arc-label text-[#7a8599] mb-1">NETWORK</p>
              <p className="text-xs font-medium flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-[#9F72FF] shadow-[0_0_4px_#9F72FF]" />
                Arc Testnet
              </p>
            </div>
            <div>
              <p className="arc-label text-[#7a8599] mb-1">SECURITY</p>
              <p className="text-xs font-medium text-[#9F72FF] flex items-center gap-1">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" className="opacity-70">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                Passkey
              </p>
            </div>
          </div>
        </div>
      )}

      {/* CTA when not connected */}
      {!isConnected && (
        <button
          onClick={onCreateWallet}
          className="w-full bg-[#0d1522] hover:bg-[#111620] border-t border-[#1e2640]/60 px-6 py-4 text-left transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1b3158] flex items-center justify-center group-hover:bg-[#2f578c] transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#acc6e9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-[#e8ecf0]">Create a SmartVault</p>
              <p className="text-xs text-[#7a8599]">
                Secured by Face ID / Passkey. No seed phrase.
              </p>
            </div>
            <svg className="text-[#7a8599] group-hover:text-[#acc6e9] transition-colors" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </div>
        </button>
      )}
    </div>
  );
}
