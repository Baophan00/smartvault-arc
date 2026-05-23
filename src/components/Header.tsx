"use client";

import { useState } from "react";
import { truncateAddress } from "@/lib/utils";

interface HeaderProps {
  isConnected: boolean;
  address: string;
  onDisconnect: () => void;
  onCreateWallet: () => void;
}

export default function Header({ isConnected, address, onDisconnect, onCreateWallet }: HeaderProps) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg wallet-gradient flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 1 0 0 4h3a1 1 0 0 0 1-1v-2.5" />
              <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
            </svg>
          </div>
          <span className="text-lg font-bold tracking-tight">SmartVault</span>
        </div>

        {/* Right side */}
        {isConnected ? (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors"
            >
              <span className="w-2 h-2 rounded-full bg-green-500" />
              {truncateAddress(address)}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            {showMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-xl shadow-xl z-20 py-1 animate-scale-in">
                  <div className="px-4 py-2 border-b border-border">
                    <p className="text-xs text-muted-foreground">Connected as</p>
                    <p className="text-sm font-mono font-medium">{truncateAddress(address, 8)}</p>
                  </div>
                  <div className="px-4 py-2 border-b border-border">
                    <p className="text-xs text-muted-foreground">Network</p>
                    <p className="text-sm font-medium text-green-500">Arc Testnet</p>
                  </div>
                  <button
                    onClick={() => { setShowMenu(false); onDisconnect(); }}
                    className="w-full px-4 py-2.5 text-left text-sm text-red-500 hover:bg-muted/50 transition-colors"
                  >
                    Disconnect
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={onCreateWallet}
              className="px-4 py-2 rounded-full wallet-gradient text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-blue-500/25"
            >
              Create Wallet
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
