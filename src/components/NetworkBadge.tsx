"use client";

import { ARC_TESTNET } from "@/lib/config";

export default function NetworkBadge() {
  return (
    <a
      href={ARC_TESTNET.explorerUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-[#1b3158]/20 border border-[#2f578c]/20 text-xs hover:bg-[#1b3158]/30 transition-colors"
    >
      <div className="flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-[#9F72FF] animate-pulse-soft shadow-[0_0_6px_#9F72FF]" />
        <span className="font-medium text-[#acc6e9]">Arc Testnet</span>
        <span className="text-[#7a8599]">· Chain ID: {ARC_TESTNET.chainId}</span>
      </div>
      <span className="text-[#7a8599] hover:text-[#acc6e9] transition-colors">↗</span>
    </a>
  );
}
