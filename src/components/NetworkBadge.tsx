"use client";

import { ARC_TESTNET } from "@/lib/config";

export default function NetworkBadge() {
  return (
    <a
      href={ARC_TESTNET.explorerUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-blue-500/5 border border-blue-500/10 text-xs"
    >
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
        <span className="font-medium text-blue-400">Arc Testnet</span>
        <span className="text-muted-foreground">· Chain ID: {ARC_TESTNET.chainId}</span>
      </div>
      <span className="text-blue-400/60 hover:text-blue-400 transition-colors">↗</span>
    </a>
  );
}
