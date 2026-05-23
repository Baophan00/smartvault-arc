// Arc Testnet Configuration
// Docs: https://docs.arc.io/arc/references/connect-to-arc

export const ARC_TESTNET = {
  chainId: 5042002,
  chainIdHex: "0x4CF292", // 5042002 in hex
  name: "Arc Testnet",
  rpcUrl: "https://rpc.testnet.arc.network",
  wsUrl: "wss://rpc.testnet.arc.network",
  explorerUrl: "https://testnet.arcscan.app",
  currency: "USDC",
  currencyDecimals: 18, // Native USDC (gas token)
  erc20Decimals: 6,     // ERC-20 USDC interface
} as const;

export const ARC_TOKENS = {
  USDC: {
    symbol: "USDC",
    name: "USD Coin",
    address: "0x3600000000000000000000000000000000000000",
    decimals: 6,
  },
  EURC: {
    symbol: "EURC",
    name: "Euro Coin",
    address: "0x89B50855Aa3bE2F677cD6303Cec089B5F319D72a",
    decimals: 6,
  },
} as const;

export const CCTP_CONTRACTS = {
  tokenMessenger: "0x8FE6B999Dc680CcFDD5Bf7EB0974218be2542DAA",
  messageTransmitter: "0xE737e5cEBEEBa77EFE34D4aa090756590b1CE275",
  tokenMinter: "0xb43db544E2c27092c107639Ad201b3dEfAbcF192",
} as const;

export const APP_CONFIG = {
  appName: "SmartVault",
  appDescription: "Smart multichain wallet on Arc Network",
};
