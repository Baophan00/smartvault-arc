"use client";

import { useState } from "react";
import Header from "@/components/Header";
import WalletCard from "@/components/WalletCard";
import SendForm from "@/components/SendForm";
import TransactionHistory from "@/components/TransactionHistory";
import QuickActions from "@/components/QuickActions";
import NetworkBadge from "@/components/NetworkBadge";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"wallet" | "send" | "history">("wallet");
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState("");

  return (
    <div className="min-h-screen bg-background">
      <Header
        isConnected={isConnected}
        setIsConnected={setIsConnected}
        address={address}
        setAddress={setAddress}
      />

      <main className="max-w-md mx-auto px-4 pt-6 pb-24 space-y-5">
        {/* Network Badge */}
        <NetworkBadge />

        {/* Wallet Card */}
        <WalletCard
          isConnected={isConnected}
          address={address}
        />

        {/* Quick Actions */}
        <QuickActions
          isConnected={isConnected}
          onSend={() => setActiveTab("send")}
        />

        {/* Tab Navigation */}
        <div className="flex gap-1 bg-muted rounded-xl p-1">
          {[
            { id: "wallet" as const, label: "Wallet" },
            { id: "send" as const, label: "Send" },
            { id: "history" as const, label: "History" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
                activeTab === tab.id
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "wallet" && (
          <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Assets
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-sm font-bold text-blue-400">
                    $
                  </div>
                  <div>
                    <p className="text-sm font-medium">USDC</p>
                    <p className="text-xs text-muted-foreground">USD Coin</p>
                  </div>
                </div>
                <p className="text-sm font-semibold">
                  {isConnected ? "1,250.50" : "—"}
                </p>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-sm font-bold text-green-400">
                    €
                  </div>
                  <div>
                    <p className="text-sm font-medium">EURC</p>
                    <p className="text-xs text-muted-foreground">Euro Coin</p>
                  </div>
                </div>
                <p className="text-sm font-semibold">
                  {isConnected ? "250.00" : "—"}
                </p>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-sm font-bold text-purple-400">
                    ⟠
                  </div>
                  <div>
                    <p className="text-sm font-medium">USYC</p>
                    <p className="text-xs text-muted-foreground">Yield-bearing</p>
                  </div>
                </div>
                <p className="text-sm font-semibold">
                  {isConnected ? "5,000.00" : "—"}
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "send" && (
          <SendForm isConnected={isConnected} />
        )}

        {activeTab === "history" && (
          <TransactionHistory isConnected={isConnected} />
        )}
      </main>
    </div>
  );
}
