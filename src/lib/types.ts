// Types for SmartVault

export interface WalletState {
  address: string;
  balance: string;
  isConnected: boolean;
  chainId: number;
}

export interface Transaction {
  hash: string;
  type: "send" | "receive" | "bridge" | "swap";
  amount: string;
  token: string;
  from: string;
  to: string;
  timestamp: number;
  status: "pending" | "confirmed" | "failed";
  explorerUrl?: string;
}

export interface SendParams {
  to: string;
  amount: string;
  token: "USDC" | "EURC";
}

export interface UnifiedBalance {
  total: string;
  byChain: Record<string, string>;
}
