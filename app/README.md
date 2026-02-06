# AsP Web3 Application

A React-based Web3 application for interacting with AsP (Achin Smart Payment) tokens.

## Features

- MetaMask wallet connection
- View ETH and AsP token balances
- Send and receive AsP tokens
- Real-time transaction processing
- Network information display
- DEX integration links (PancakeSwap, Uniswap)

## Technology Stack

- React 18
- TypeScript
- Vite
- ethers.js v6
- CSS3

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MetaMask browser extension
- AsP tokens (testnet or mainnet)

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The application will open at http://localhost:3000

### Build

```bash
npm run build
```

## Configuration

Before using the app, update the token contract address in `src/App.tsx`:

```typescript
const ASP_TOKEN_ADDRESS = '0x...' // Replace with deployed AsP token address
```

## Usage

1. Click "Connect MetaMask" to connect your wallet
2. View your ETH and AsP balances in the dashboard
3. Use the transfer form to send AsP tokens to other addresses
4. Click DEX links to trade tokens on decentralized exchanges

## Network Support

- Ethereum Sepolia Testnet (current)
- BNB Chain (planned)

## Security Notes

- Always verify recipient addresses before sending tokens
- Keep your private keys secure
- Transactions are irreversible once confirmed
- Only use on trusted networks

## License

Educational and demonstration purposes only.
