# SmartVault — Smart Wallet on Arc Network

A smart multichain wallet built on **Arc Network** (Circle's stablecoin-native L1 blockchain). Send, receive, bridge, and swap USDC/EURC with passkey security and gasless transactions.

## ✨ Features

- 🔐 **Passkey Login** — Sign in with biometrics/Face ID (WebAuthn)
- 💸 **Send USDC/EURC** — Gasless transfers via Arc Network
- 🌉 **Cross-chain Bridge** — Bridge USDC across chains via CCTP
- 💰 **Unified Balance** — Combine USDC from multiple chains into one
- 🔄 **FX Swap** — USDC ↔ EURC via StableFX
- ⚡ **Sub-second Finality** — Transactions settle in under 1 second
- ⛽ **Gas Sponsorship** — No gas tokens needed, paymaster covers fees

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 15 + Tailwind CSS |
| **Blockchain** | Arc Testnet (Chain ID: 5042002) |
| **Wallet SDK** | Circle App Kit (`@circle-fin/app-kit`) |
| **Wallet Adapter** | Viem (`@circle-fin/adapter-viem-v2`) |
| **AA Infrastructure** | ERC-4337 (Biconomy/Pimlico) |
| **Auth** | Circle Modular Wallets + WebAuthn passkey |

## 🚀 Getting Started

### Prerequisites

- Node.js v22+
- npm

### Installation

```bash
# Clone the repo
git clone https://github.com/Baophan00/smartvault-arc.git
cd smartvault-arc

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add your private key to .env

# Start development server
npm run dev
```

### Environment Variables

```env
# Your wallet private key (for development)
PRIVATE_KEY=your_private_key_here
```

## 📁 Project Structure

```
smartvault-arc/
├── src/
│   ├── app/
│   │   ├── globals.css       # Tailwind + global styles
│   │   ├── layout.tsx        # Root layout
│   │   └── page.tsx          # Main wallet page
│   ├── components/
│   │   ├── Header.tsx        # Top navigation + connect button
│   │   ├── WalletCard.tsx    # Balance display + wallet info
│   │   ├── SendForm.tsx      # Send USDC/EURC form
│   │   ├── QuickActions.tsx  # Send/Receive/Bridge/Swap buttons
│   │   ├── TransactionHistory.tsx  # Recent activity list
│   │   └── NetworkBadge.tsx  # Arc Testnet status badge
│   └── lib/
│       ├── config.ts         # Arc chain config + contract addresses
│       ├── types.ts          # TypeScript types
│       └── utils.ts          # Utility functions
├── public/
├── .env.example
├── next.config.ts
├── package.json
└── README.md
```

## 🗺 Roadmap

**Phase 1 — Wallet MVP** ✅ Current
- [x] Project setup with Next.js + Tailwind
- [x] UI components (Wallet, Send, History)
- [x] Arc Testnet configuration
- [ ] Wallet connection (Circle Modular Wallets)
- [ ] Real USDC send via App Kit SDK

**Phase 2 — Cross-chain**
- [ ] Bridge tokens via CCTP
- [ ] Unified Balance (Gateway)
- [ ] EURC swap via StableFX

**Phase 3 — Production**
- [ ] Passkey authentication
- [ ] Gas sponsorship (paymaster)
- [ ] Social recovery
- [ ] Mobile-first responsive design

## 🔗 Arc Network

| Parameter | Value |
|-----------|-------|
| Network | Arc Testnet |
| RPC URL | `https://rpc.testnet.arc.network` |
| Chain ID | `5042002` |
| Currency | USDC (gas token) |
| Explorer | https://testnet.arcscan.app |
| Faucet | https://faucet.circle.com |

## 📚 Resources

- [Arc Docs](https://docs.arc.io)
- [Circle App Kit](https://docs.arc.io/app-kit)
- [Circle Modular Wallets](https://developers.circle.com/wallets/modular)
- [CCTP Docs](https://developers.circle.com/cctp)

## 📄 License

MIT
