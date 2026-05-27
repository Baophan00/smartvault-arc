"use client";

import { useState } from "react";
import { useCircle } from "@/contexts/CircleContext";

interface ExportWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ExportWalletModal({ isOpen, onClose }: ExportWalletModalProps) {
  const { wallet } = useCircle();
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!wallet?.privateKey) return;
    navigator.clipboard.writeText(wallet.privateKey).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      const textArea = document.createElement("textarea");
      textArea.value = wallet.privateKey;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-sm bg-[#111620] rounded-t-3xl sm:rounded-3xl shadow-2xl border border-[#1e2640] max-h-[90vh] overflow-y-auto animate-slide-up arc-glow p-6 space-y-6">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-xl bg-[#141a24] flex items-center justify-center text-[#7a8599] hover:text-[#acc6e9] hover:bg-[#1e2640] transition-all border border-[#1e2640]"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="text-center pt-4">
          <div className="w-16 h-16 rounded-2xl bg-[#1b3158] flex items-center justify-center mx-auto border border-[#702718]/50">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#e9a13f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h2 className="text-xl font-light mt-4" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
            Export Private Key
          </h2>
          <p className="text-sm text-[#e9a13f]/80 mt-2">
            Anyone with this key controls your wallet. Keep it secret!
          </p>
        </div>

        {wallet?.privateKey ? (
          <div className="space-y-3">
            {revealed ? (
              <div className="bg-[#0a0d14] border border-[#1e2640] rounded-xl p-4">
                <p className="text-[10px] arc-label text-[#e9a13f] mb-2">PRIVATE KEY</p>
                <p className="text-xs font-mono text-[#acc6e9] break-all select-all">
                  {wallet.privateKey}
                </p>
              </div>
            ) : (
              <button
                onClick={() => setRevealed(true)}
                className="w-full py-3.5 rounded-2xl bg-[#702718]/30 hover:bg-[#702718]/50 text-[#e9a13f] font-medium text-sm transition-all border border-[#702718]/50"
              >
                <span className="flex items-center justify-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  Reveal Private Key
                </span>
              </button>
            )}

            {revealed && (
              <button
                onClick={handleCopy}
                className="w-full py-3.5 rounded-2xl bg-[#1b3158] hover:bg-[#2f578c] text-white font-medium text-sm transition-all border border-[#2f578c]/20"
              >
                {copied ? "Copied!" : "Copy Private Key"}
              </button>
            )}
          </div>
        ) : (
          <div className="bg-[#0a0d14] border border-[#1e2640] rounded-xl p-6 text-center">
            <p className="text-sm text-[#7a8599]">No wallet connected</p>
          </div>
        )}

        <div className="bg-[#141a24] rounded-xl border border-[#702718]/30 p-4">
          <p className="arc-label text-[#e9a13f] mb-1">⚠️ IMPORTANT</p>
          <ul className="text-xs text-[#7a8599] space-y-1.5">
            <li>• Never share this key with anyone</li>
            <li>• Save it somewhere safe (password manager, offline)</li>
            <li>• Import it into any wallet (MetaMask, viem) to recover funds</li>
            <li>• SmartVault does NOT store your private key on any server</li>
          </ul>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-[#141a24] hover:bg-[#1e2640] text-[#7a8599] text-sm font-medium transition-all border border-[#1e2640]"
        >
          Close
        </button>
      </div>
    </div>
  );
}
