"use client";

import { useState } from "react";
import { truncateAddress } from "@/lib/utils";

interface HeaderProps {
  isConnected: boolean;
  address: string;
  onDisconnect: () => void;
  onCreateWallet: () => void;
  onExport: () => void;
}

export default function Header({ isConnected, address, onDisconnect, onCreateWallet, onExport }: HeaderProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#0a0d14]/90 backdrop-blur-xl border-b border-[#1e2640]/60">
      <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo — ARC-inspired */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#1b3158] flex items-center justify-center shadow-lg shadow-[#1b3158]/30">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#acc6e9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 1 0 0 4h3a1 1 0 0 0 1-1v-2.5" />
              <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
            </svg>
          </div>
          <div>
            <span className="text-[15px] font-medium tracking-tight" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
              SmartVault
            </span>
            <p className="text-[10px] text-[#7a8599] arc-label leading-none mt-0.5">ON ARC NETWORK</p>
          </div>
        </div>

        {/* Right side */}
        {isConnected ? (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#1e2640] hover:bg-[#2f578c]/30 border border-[#2f578c]/20 text-sm font-medium transition-all"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#9F72FF] shadow-[0_0_6px_#9F72FF]" />
              <span className="text-[13px] text-[#acc6e9]">{truncateAddress(address)}</span>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#7a8599" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            {showMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                <div className="absolute right-0 top-full mt-2 w-52 bg-[#111620] border border-[#1e2640] rounded-xl shadow-2xl z-20 py-1 animate-scale-in arc-glow">
                  <div className="px-4 py-3 border-b border-[#1e2640]">
                    <p className="text-[10px] arc-label text-[#7a8599] mb-1">CONNECTED AS</p>
                    <p className="text-sm font-mono text-[#acc6e9]">{truncateAddress(address, 8)}</p>
                  </div>
                  <div className="px-4 py-3 border-b border-[#1e2640]">
                    <p className="text-[10px] arc-label text-[#7a8599] mb-1">NETWORK</p>
                    <p className="text-sm font-medium flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#9F72FF] shadow-[0_0_6px_#9F72FF]" />
                      Arc Testnet
                    </p>
                  </div>
                  {copied ? (
                    <div className="px-4 py-2.5 text-sm text-[#9F72FF] flex items-center gap-2 border-b border-[#1e2640]">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Copied!
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(address).then(() => {
                          setCopied(true);
                          setTimeout(() => setCopied(false), 2000);
                        });
                      }}
                      className="w-full px-4 py-2.5 text-left text-sm text-[#acc6e9] hover:bg-[#1e2640]/50 transition-colors flex items-center gap-2 border-b border-[#1e2640]"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                      </svg>
                      Copy Address
                    </button>
                  )}
                  <button
                    onClick={() => { setShowMenu(false); onExport(); }}
                    className="w-full px-4 py-2.5 text-left text-sm text-[#acc6e9] hover:bg-[#1e2640]/50 transition-colors flex items-center gap-2 border-b border-[#1e2640]"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    Export Key
                  </button>
                  <button
                    onClick={() => { setShowMenu(false); onDisconnect(); }}
                    className="w-full px-4 py-2.5 text-left text-sm text-[#e9a13f] hover:bg-[#1e2640]/50 transition-colors flex items-center gap-2"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    Disconnect
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <button
            onClick={onCreateWallet}
            className="px-5 py-2 rounded-lg bg-[#1b3158] hover:bg-[#2f578c] text-white text-sm font-medium transition-all shadow-lg shadow-[#1b3158]/30 border border-[#2f578c]/20"
          >
            Create Wallet
          </button>
        )}
      </div>
    </header>
  );
}
