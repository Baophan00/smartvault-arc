"use client";

import { useState, useEffect, useCallback } from "react";
import Header from "@/components/Header";
import WalletCard from "@/components/WalletCard";
import SendForm from "@/components/SendForm";
import BridgeForm from "@/components/BridgeForm";
import SwapForm from "@/components/SwapForm";
import TransactionHistory from "@/components/TransactionHistory";
import QuickActions from "@/components/QuickActions";
import NetworkBadge from "@/components/NetworkBadge";
import WalletSetupModal from "@/components/WalletSetupModal";
import ExportWalletModal from "@/components/ExportWalletModal";
import { useCircle } from "@/contexts/CircleContext";

interface BalanceData {
  USDC: string;
  EURC: string;
  total: string;
  raw: { USDC: string; EURC: string };
}

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

const TABS = [
  { id: "wallet" as const, label: "Wallet" },
  { id: "send" as const, label: "Send" },
  { id: "bridge" as const, label: "Bridge" },
  { id: "swap" as const, label: "Swap" },
  { id: "history" as const, label: "History" },
];

export default function HomeContent() {
  const { wallet, createLocalWallet, importWallet } = useCircle();
  const [activeTab, setActiveTab] = useState<"wallet" | "send" | "bridge" | "swap" | "history">("wallet");
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState("");
  const [showWalletSetup, setShowWalletSetup] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [balances, setBalances] = useState<BalanceData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);

  // Restore wallet from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("smartvault_wallet");
    if (saved) {
      try {
        const { address: savedAddr, privateKey } = JSON.parse(saved);
        if (savedAddr && privateKey) {
          importWallet(privateKey);
          setAddress(savedAddr);
          setIsConnected(true);
        }
      } catch {
        // Invalid saved wallet, ignore
      }
    }
  }, [importWallet]);

  // Fetch real balances when connected
  const fetchBalances = useCallback(async () => {
    if (!address) return;
    setLoading(true);
    try {
      const res = await fetch("/api/balance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address }),
      });
      const data = await res.json();
      if (data.success) {
        setBalances(data.balances);
        if (data.transactions?.length) {
          setTransactions(data.transactions);
        }
      }
    } catch (e) {
      console.warn("Failed to fetch balances:", e);
    } finally {
      setLoading(false);
    }
  }, [address]);

  useEffect(() => {
    if (isConnected && address) {
      fetchBalances();
      const interval = setInterval(fetchBalances, 30000);
      return () => clearInterval(interval);
    }
  }, [isConnected, address, fetchBalances]);

  const handleWalletCreated = (newAddress: string) => {
    setAddress(newAddress);
    setIsConnected(true);
    setShowWalletSetup(false);
    setActiveTab("wallet");
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setAddress("");
    setBalances(null);
    setTransactions([]);
    localStorage.removeItem("smartvault_wallet");
  };

  return (
    <div className="min-h-screen bg-[#0a0d14]">
      <Header
        isConnected={isConnected}
        address={address}
        onDisconnect={handleDisconnect}
        onCreateWallet={() => setShowWalletSetup(true)}
        onExport={() => setShowExport(true)}
      />

      <main className="max-w-md mx-auto px-4 pt-5 pb-24 space-y-5">
        {/* ARC-style decorative label */}
        <div className="flex items-center gap-2">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#1e2640] to-transparent" />
          <span className="arc-label text-[#7a8599] text-[10px]">SMART WALLET</span>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#1e2640] to-transparent" />
        </div>

        {/* Network Badge */}
        <NetworkBadge />

        {/* Wallet Card */}
        <WalletCard
          isConnected={isConnected}
          address={address}
          balance={balances?.total}
          loading={loading}
          onCreateWallet={() => setShowWalletSetup(true)}
        />

        {/* Quick Actions */}
        <QuickActions
          isConnected={isConnected}
          address={address}
          onSend={() => setActiveTab("send")}
          onBridge={() => setActiveTab("bridge")}
          onSwap={() => setActiveTab("swap")}
        />

        {/* Tab Navigation */}
        <div className="flex bg-[#111620] rounded-xl p-1 border border-[#1e2640]">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2.5 text-xs arc-label rounded-lg transition-all ${
                activeTab === tab.id
                  ? "bg-[#1b3158] text-[#acc6e9] shadow-sm"
                  : "text-[#7a8599] hover:text-[#acc6e9]"
              }`}
            >
              {tab.label.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "wallet" && (
          <div className="bg-[#111620] border border-[#1e2640] rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-[#1e2640] flex items-center justify-between">
              <p className="arc-label text-[#7a8599]">ASSETS</p>
              <span className="text-[11px] text-[#7a8599] font-mono">//A.01</span>
            </div>

            <div className="divide-y divide-[#1e2640]">
              {[
                { symbol: "USDC", name: "USD Coin", balance: balances?.USDC || "—", color: "text-[#acc6e9]", icon: "$" },
                { symbol: "EURC", name: "Euro Coin", balance: balances?.EURC || "—", color: "text-[#e9a13f]", icon: "€" },
              ].map((token) => (
                <div
                  key={token.symbol}
                  className="flex items-center justify-between px-6 py-3.5 hover:bg-[#141a24] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#1b3158] flex items-center justify-center text-xs font-medium border border-[#2f578c]/30">
                      <span className={token.color}>{token.icon}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#e8ecf0]">{token.symbol}</p>
                      <p className="text-xs text-[#7a8599]">{token.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {isConnected ? token.balance : "—"}
                    </p>
                    {isConnected && (
                      <p className="text-xs text-[#7a8599]">{token.symbol}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "send" && (
          <SendForm
            isConnected={isConnected}
            usdcBalance={balances?.USDC}
            eurcBalance={balances?.EURC}
          />
        )}

        {activeTab === "bridge" && (
          <BridgeForm
            isConnected={isConnected}
            balance={balances?.USDC}
          />
        )}

        {activeTab === "swap" && (
          <SwapForm
            isConnected={isConnected}
            usdcBalance={balances?.USDC}
          />
        )}

        {activeTab === "history" && (
          <TransactionHistory
            isConnected={isConnected}
            transactions={transactions}
          />
        )}
      </main>

      <WalletSetupModal
        isOpen={showWalletSetup}
        onClose={() => setShowWalletSetup(false)}
        onWalletCreated={handleWalletCreated}
      />

      <ExportWalletModal
        isOpen={showExport}
        onClose={() => setShowExport(false)}
      />
    </div>
  );
}
