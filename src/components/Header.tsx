"use client";

import { truncateAddress } from "@/lib/utils";

interface HeaderProps {
  isConnected: boolean;
  setIsConnected: (v: boolean) => void;
  address: string;
  setAddress: (v: string) => void;
}

export default function Header({ isConnected, setIsConnected, address, setAddress }: HeaderProps) {
  const handleConnect = () => {
    // In Phase 1: simulate wallet connection
    // Later: integrate Circle Modular Wallets + WebAuthn
    setIsConnected(true);
    setAddress("0xB815A0c4bC23930119324d4359dB65e27A846A2d");
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setAddress("");
  };

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

        {/* Connect / Profile */}
        {isConnected ? (
          <button
            onClick={handleDisconnect}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors"
          >
            <span className="w-2 h-2 rounded-full bg-green-500" />
            {truncateAddress(address)}
          </button>
        ) : (
          <button
            onClick={handleConnect}
            className="px-4 py-2 rounded-full wallet-gradient text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-blue-500/25"
          >
            Connect Wallet
          </button>
        )}
      </div>
    </header>
  );
}
