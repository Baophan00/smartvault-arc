"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { type Hex } from "viem";

interface CircleContextType {
  kitKey: string;
  apiKey: string;
  clientKey: string;
  wallet: { address: string; privateKey: Hex } | null;
  createLocalWallet: () => { address: string; privateKey: Hex };
  importWallet: (privateKey: Hex) => void;
  clearWallet: () => void;
}

const CircleContext = createContext<CircleContextType | null>(null);

export function CircleProvider({ children }: { children: ReactNode }) {
  const [wallet, setWallet] = useState<{ address: string; privateKey: Hex } | null>(null);

  const createLocalWallet = useCallback(() => {
    const privKey = generatePrivateKey();
    const account = privateKeyToAccount(privKey);
    const newWallet = {
      address: account.address,
      privateKey: privKey,
    };
    setWallet(newWallet);
    // Persist to localStorage
    localStorage.setItem("smartvault_wallet", JSON.stringify({
      address: newWallet.address,
      privateKey: newWallet.privateKey,
    }));
    return newWallet;
  }, []);

  const importWallet = useCallback((privateKey: Hex) => {
    const account = privateKeyToAccount(privateKey);
    const w = { address: account.address, privateKey };
    setWallet(w);
    localStorage.setItem("smartvault_wallet", JSON.stringify({
      address: w.address,
      privateKey: w.privateKey,
    }));
  }, []);

  const clearWallet = useCallback(() => {
    setWallet(null);
    localStorage.removeItem("smartvault_wallet");
  }, []);

  return (
    <CircleContext.Provider
      value={{
        kitKey: process.env.NEXT_PUBLIC_KIT_KEY || "",
        apiKey: process.env.NEXT_PUBLIC_API_KEY || "",
        clientKey: process.env.NEXT_PUBLIC_CLIENT_KEY || "",
        wallet,
        createLocalWallet,
        importWallet,
        clearWallet,
      }}
    >
      {children}
    </CircleContext.Provider>
  );
}

export function useCircle() {
  const ctx = useContext(CircleContext);
  if (!ctx) throw new Error("useCircle must be used within CircleProvider");
  return ctx;
}
