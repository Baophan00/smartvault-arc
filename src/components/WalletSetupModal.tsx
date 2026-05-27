"use client";

import { useState, useCallback } from "react";
import { useCircle } from "@/contexts/CircleContext";

interface WalletSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWalletCreated: (address: string) => void;
}

export default function WalletSetupModal({ isOpen, onClose, onWalletCreated }: WalletSetupModalProps) {
  const { createLocalWallet } = useCircle();
  const [creating, setCreating] = useState(false);
  const [done, setDone] = useState(false);
  const [newAddress, setNewAddress] = useState("");

  const handleCreate = useCallback(() => {
    setCreating(true);
    // Small delay so the user sees the "creating" state
    setTimeout(() => {
      const w = createLocalWallet();
      setNewAddress(w.address);
      setDone(true);
      setCreating(false);
    }, 800);
  }, [createLocalWallet]);

  const handleEnter = useCallback(() => {
    if (newAddress) {
      onWalletCreated(newAddress);
    }
    onClose();
  }, [newAddress, onWalletCreated, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-sm bg-[#111620] rounded-t-3xl sm:rounded-3xl shadow-2xl border border-[#1e2640] max-h-[90vh] overflow-y-auto animate-slide-up arc-glow">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-xl bg-[#141a24] flex items-center justify-center text-[#7a8599] hover:text-[#acc6e9] hover:bg-[#1e2640] transition-all border border-[#1e2640]"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="px-6 py-8">
          {!creating && !done && <WelcomeStep onStart={handleCreate} />}
          {creating && !done && <CreatingStep />}
          {done && newAddress && <SuccessStep address={newAddress} onDone={handleEnter} />}
        </div>
      </div>
    </div>
  );
}

/* ============ Steps ============ */

function WelcomeStep({ onStart }: { onStart: () => void }) {
  return (
    <div className="space-y-8 text-center">
      <div className="w-20 h-20 rounded-2xl bg-[#1b3158] flex items-center justify-center mx-auto shadow-lg shadow-[#1b3158]/40 border border-[#2f578c]/30">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#acc6e9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 1 0 0 4h3a1 1 0 0 0 1-1v-2.5" />
          <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
        </svg>
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-light tracking-tight" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
          Welcome to SmartVault
        </h2>
        <p className="text-sm text-[#7a8599] max-w-xs mx-auto">
          Create a wallet secured by your <span className="text-[#acc6e9]">Face ID</span> or{" "}
          <span className="text-[#acc6e9]">fingerprint</span>. No seed phrases.
        </p>
      </div>

      <div className="space-y-2">
        {[
          { label: "BIOMETRIC SECURITY", desc: "Face ID / Touch ID" },
          { label: "GAS-FREE", desc: "Sponsored transactions on Arc" },
          { label: "CROSS-CHAIN", desc: "Unified USDC balance" },
          { label: "RECOVERABLE", desc: "Restore via phone + OTP" },
        ].map((f, i) => (
          <div key={i} className="flex items-center justify-between px-4 py-3 rounded-xl bg-[#141a24] border border-[#1e2640]">
            <span className="text-xs text-[#acc6e9] arc-label">{f.label}</span>
            <span className="text-xs text-[#7a8599]">{f.desc}</span>
          </div>
        ))}
      </div>

      <button
        onClick={onStart}
        className="w-full py-3.5 rounded-2xl bg-[#1b3158] hover:bg-[#2f578c] text-white font-medium text-sm transition-all shadow-lg shadow-[#1b3158]/30 border border-[#2f578c]/20"
      >
        Create Wallet
      </button>

      <p className="text-[10px] arc-label text-[#7a8599]">
        BY CONTINUING, YOU AGREE TO THE TERMS OF SERVICE
      </p>
    </div>
  );
}

function CreatingStep() {
  return (
    <div className="space-y-8 text-center py-8">
      <div className="w-20 h-20 rounded-2xl bg-[#1b3158] flex items-center justify-center mx-auto border border-[#2f578c]/30">
        <svg className="animate-spin h-8 w-8 text-[#acc6e9]" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
      <div className="space-y-2">
        <h2 className="text-xl font-light tracking-tight" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
          Creating your wallet
        </h2>
        <p className="text-sm text-[#7a8599]">Generating secure key pair...</p>
      </div>
      <div className="flex justify-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-[#2f578c] animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
}

function SuccessStep({ address, onDone }: { address: string; onDone: () => void }) {
  return (
    <div className="space-y-6 text-center">
      <div className="w-20 h-20 rounded-2xl bg-[#1b3158] flex items-center justify-center mx-auto border border-[#2f578c]/30">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#acc6e9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>

      <div className="space-y-1">
        <h2 className="text-2xl font-light tracking-tight" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
          Wallet created
        </h2>
        <p className="text-sm text-[#7a8599]">
          Your SmartVault is ready
        </p>
      </div>

      <div className="bg-[#141a24] rounded-xl border border-[#1e2640] p-4">
        <p className="arc-label text-[#7a8599] mb-2">YOUR ADDRESS</p>
        <p className="text-xs font-mono text-[#acc6e9] bg-[#0a0d14] border border-[#1e2640] rounded-lg p-3 break-all">
          {address}
        </p>
      </div>

      <div className="space-y-3">
        <p className="arc-label text-[#7a8599]">NEXT STEPS</p>
        <div className="divide-y divide-[#1e2640] bg-[#141a24] rounded-xl border border-[#1e2640]">
          {[
            { label: "GET TESTNET USDC", desc: "Free from faucet" },
            { label: "SEND TOKENS", desc: "Any wallet in seconds" },
            { label: "VIEW ACTIVITY", desc: "Transaction history" },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between px-4 py-3">
              <span className="text-xs arc-label text-[#acc6e9]">{item.label}</span>
              <span className="text-xs text-[#7a8599]">{item.desc}</span>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={onDone}
        className="w-full py-3.5 rounded-2xl bg-[#1b3158] hover:bg-[#2f578c] text-white font-medium text-sm transition-all shadow-lg shadow-[#1b3158]/30 border border-[#2f578c]/20"
      >
        Enter SmartVault
      </button>
    </div>
  );
}
