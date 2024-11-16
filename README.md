# 📢 AdBidder - Web3 Ad Space Marketplace
AdBidder revolutionizes digital advertising on Web3, powered by Scroll's zkEVM technology and Dynamic's user-centric onboarding solutions. Our platform combines technical excellence with accessibility:
- 🔄 Native compatibility with Ethereum through Scroll's zkEVM
- 🎯 Frictionless social login and Web3 onboarding via Dynamic
- ⚡ High-performance, cost-effective operations
- 🤖 AI-powered ad content verification
- 🌐 Easy Web3 accessibility for everyone

## 🚀 Deployment
- **Network**: Scroll Sepolia [0xa16d5668d5cac82c2e65534eb111343212c9f4dc](https://sepolia.scrollscan.com/address/0xa16d5668d5cac82c2e65534eb111343212c9f4dc)

## 🛠 Tech Stack
- **Web3 User Experience**: Dynamic
- **Smart Contracts**: Hardhat, Solidity
- **Frontend**: Next.js, TypeScript, TailwindCSS
- **Framework**: Scaffold-ETH 2
- **AI Integration**: Image content verification model

## 📝 Getting Started
### Prerequisites
1. Copy .env.example file to the appropriate .env file
```bash
cp .env.example .env.<phase>
```

2. Fill the IPFS API key information
```bash
NEXT_PUBLIC_PINATA_API_KEY=...
NEXT_PUBLIC_PINATA_SECRET_API_KEY=...
```

### Installation & Setup
1. Clone the repository
```bash
git clone https://github.com/apac-chainchanger/ad-bidder.git
cd ad-bidder
```

2. Navigate to the frontend directory
```bash
cd packages/nextjs
```

3. Install dependencies
```bash
yarn install
```

4. Start the server
```bash
yarn start
```

Your application should now be running at `http://localhost:3000` on `Scroll Sepolia`

## ✨ Key Features
### 🎪 Ad Slot Management
- Create and manage advertising slots
- Configure slot dimensions and domain settings
- Ownership transfer capabilities
- Batch operations for efficient management

### 💫 Bidding System
- Real-time bid processing
- Automatic refund system for previous bidders (90%)
- IPFS-based ad image storage
- AI-powered content verification
  - Automated screening for inappropriate content
  - Real-time image analysis for brand safety
  - Content policy compliance checks

### 💰 Fee Management
- Fee distribution on each bid:
  - 3% platform fee
  - 7% to ad slot owner
- Efficient withdrawal system for both platform and slot owners
- Batch processing for fee management

## 🏗 Smart Contract Architecture
### 🎮 AdSlotController
- Central controller for ad slot creation and management
- Multi-slot management capabilities
- Platform fee collection and distribution system

### 📍 AdSlot
- Individual ad slot management
- Bid processing and refund logic
- Ad slot owner fee settlement system

## 🔗 Resources
- [Scroll Sepolia](https://docs.scroll.io/en/home/)
- [Dynamic Documentation](https://www.dynamic.xyz/docs)
- [Scaffold-ETH 2](https://scaffoldeth.io/)
