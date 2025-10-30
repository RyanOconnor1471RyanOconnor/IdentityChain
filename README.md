# IdentityChain

A blockchain-based identity verification platform with secure KYC submission using Fully Homomorphic Encryption (FHE).

## Features

- **Secure KYC Submission**: Submit personal information with FHE encryption
- **On-Chain Verification**: Age, nationality, and document type stored securely on blockchain
- **Privacy-Preserving**: Encrypted data remains confidential while being verifiable
- **Web3 Integration**: Connect with MetaMask, OKX Wallet, or Coinbase Wallet
- **Admin Dashboard**: Verify and manage KYC submissions

## Technology Stack

- **Frontend**: React + TypeScript + Vite
- **Smart Contracts**: Solidity 0.8.24 with Zama fhEVM
- **Encryption**: Fully Homomorphic Encryption (FHE) via Zama SDK
- **Blockchain**: Ethereum Sepolia Testnet
- **UI Framework**: Tailwind CSS + shadcn/ui

## Getting Started

### Prerequisites

- Node.js 20.x or higher
- MetaMask or compatible Web3 wallet
- Sepolia testnet ETH for deployment

### Installation

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Add your private key to .env
# PRIVATE_KEY=your_private_key_here
```

### Smart Contract Deployment

```bash
# Compile contracts
npm run compile

# Deploy to Sepolia testnet
npm run deploy
```

The deployment script will automatically:
- Deploy the PrivacyKYC contract
- Update `.env` with the contract address
- Update `KYCForm.tsx` with the contract address
- Save deployment info to `deployments/` folder

### Running the Frontend

```bash
# Start development server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
IdentityChain/
├── contracts/
│   └── PrivacyKYC.sol        # FHE-enabled KYC contract
├── scripts/
│   └── deploy.cjs            # Deployment script
├── src/
│   ├── components/
│   │   └── KYCForm.tsx       # Main KYC submission form
│   ├── lib/
│   │   └── fhe.ts            # FHE encryption utilities
│   └── config/
│       └── wagmi.ts          # Web3 configuration
├── hardhat.config.cjs        # Hardhat configuration
└── .env                      # Environment variables
```

## How It Works

1. **User Submission**: Users fill out the KYC form with personal information
2. **Client-Side Encryption**: Age, nationality, and document type are encrypted using FHE
3. **On-Chain Storage**: Encrypted data is submitted to the smart contract
4. **Admin Verification**: Administrators can verify KYC status without seeing raw data
5. **Access Control**: Only authorized parties can decrypt specific data fields

## Smart Contract Functions

- `submitKYC()`: Submit encrypted KYC information
- `verifyKYC()`: Admin-only function to verify KYC status
- `isAgeAbove()`: Check if user's age meets minimum requirement (without decryption)
- `getKYCData()`: Retrieve encrypted KYC data
- `hasKYC()`: Check if user has submitted KYC

## Security Features

- **FHE Encryption**: Data encrypted before leaving the client
- **Access Control**: Smart contract enforces who can access data
- **Admin Management**: Only contract owner can verify KYC
- **Immutable Records**: Blockchain provides tamper-proof storage

## Environment Variables

```env
SEPOLIA_RPC_URL=https://ethereum-sepolia-rpc.publicnode.com
PRIVATE_KEY=your_private_key_here
VITE_KYC_CONTRACT_ADDRESS=deployed_contract_address
```

## License

MIT License

## Support

For issues and questions, please open an issue on GitHub.
