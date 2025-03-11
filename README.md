# 🏦 Monad NFT LendHub

A decentralized NFT-backed lending and borrowing platform built natively on Monad. Users can collateralize whitelisted NFTs to borrow USDT, while liquidity providers earn rewards for providing liquidity.

## 🌟 Key Features

### For Borrowers

- 🎭 NFT Collateralization: Deposit whitelisted NFTs as collateral
- 💰 Instant Loans: Borrow up to 70% of NFT floor price in USDT
- ⚡ Quick Withdrawals: Reclaim NFT instantly after loan repayment
- 📊 Real-time Monitoring: Track loan health and repayment status

### For Liquidity Providers

- 🏦 Yield Generation: Earn interest from loan repayments
- 🎯 Points System: Accumulate rewards based on:
  - Deposit amount
  - Duration of liquidity provision
  - Pool utilization rate
- 🔄 Flexible Withdrawals: Remove liquidity anytime (subject to availability)

### Platform Features

- 🔐 Automated Liquidations: Protect protocol and LP funds
- ⚖️ Dynamic Interest Rates: Based on pool utilization
- 🎨 Whitelisted NFTs: Carefully curated collections
- 🌉 Cross-Chain Bridge: ETH bridging between Sepolia and Monad (Coming Soon)

## 🛠 Technical Stack

- **Frontend**: Next.js, TailwindCSS, TypeScript
- **Web3 Integration**: Thirdweb SDK
- **Smart Contracts**: Solidity, Hardhat
- **Network**: Monad Testnet
- **Bridge**: Wormhole Protocol Integration (In Progress)

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn
- Hardhat
- Monad Testnet RPC URL

### Installation

1. Clone the repository

```bash
git clone git clone https://github.com/bossonormal215/monad-nft-lendhub.git
```

2. Install dependencies

```bash
cd monad-nft-lendhub
npm install
```

3. Create a `.env` file in the cross-chain-contracts root

- MONAD_RPC_URL
- PRIVATE_KEY
- PRIVATE_KEY2

### And another `.env.local` in the cross-chain-frontend root

- NEXT_PUBLIC_THIRDWEB_CLIENT_ID
- NEXT_PUBLIC_PRIVY_API_KEY
- NEXT_PUBLIC_ZEROX_API_KEY

### Start development server

```bash
npm run dev
```

## 👨‍💻 User Flow

1. **Connect Wallet**

   - Connect to Monad Testnet
   - Auto network switching supported

2. **Get Whitelisted & Mint NFT**

   - Get address whitelisted by admin
   - Mint test NFT (max 5 per wallet)
   - Fetch tokenId from block explorer

3. **Deposit NFT**

   - Select whitelisted collection
   - Enter tokenId
   - Approve & deposit NFT

4. **Borrow USDT**

   - Enter loan amount (≤70% of NFT value)
   - Receive USDT instantly
   - Monitor loan status

5. **Repay & Withdraw**

   - Repay loan + interest
   - Withdraw NFT after repayment

6. **LP Functions**
   - Deposit USDT to pool
   - Earn interest & points
   - Monitor rewards

## 🔄 Current Status

### Implemented Features

- ✅ Wallet Connection & Network Switching
- ✅ NFT Minting & Whitelisting
- ✅ NFT Collateral Deposits
- ✅ USDT Borrowing
- ✅ Liquidity Provision
- ✅ Basic Points System

### In Progress

- 🏗️ Wormhole Bridge Integration
- 🏗️ Advanced Points System
- 🏗️ Liquidation Automation
- 🏗️ Enhanced UI/UX

## 🤝 Contributing

Contributions welcome! Please read our contributing guidelines first.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Monad Foundation
- Wormhole Protocol
- ThirdWeb Team
