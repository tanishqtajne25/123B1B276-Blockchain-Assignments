# Assignment 3: ChainPanel dApp (Hardhat + React + Wagmi)

## Objective

Build a decentralized application named ChainPanel to register product transactions on a local blockchain.

## Project Structure

- `chainpanel-contracts/` - Solidity contract and Hardhat deployment setup
- `chainpanel-frontend/` - React + TypeScript frontend with Wagmi integration
- `screenshots/` - UI and transaction proof images
- `readme.md` - assignment documentation

## Tech Stack

- Smart Contract: Solidity `^0.8.20`
- Local Blockchain/Tooling: Hardhat 3 + Ignition
- Frontend: React (Vite) + TypeScript + Tailwind CSS
- Web3: Wagmi, Viem, `@tanstack/react-query`

## Smart Contract Summary

Contract: `ProductRegistry`

### Product Model

Each product stores:

- `id`
- `name`
- `price`
- `seller`

### Core Functions

- `addProduct(string name, uint256 price)`
  - payable
  - requires non-empty name
  - requires price > 0
  - requires exact payment (`msg.value == price`)
  - emits `ProductAdded`

- `getProduct(uint256 id)`
  - view function to read product details

- `withdraw()`
  - owner-only
  - reverts with custom error `Unauthorized()` for non-owner

## Frontend Features

- Connect/disconnect wallet using Wagmi hooks
- Network check and switch to Hardhat localhost (`31337`)
- Product form for name + price
- Writes `addProduct` transaction using `useWriteContract`
- Waits for confirmation using `useWaitForTransactionReceipt`
- Tracks history using `useWatchContractEvent` (`ProductAdded`)

## Setup and Run

### 1. Start local blockchain and deploy contract

From `Assignment 3/chainpanel-contracts`:

```powershell
npm install
npx hardhat compile
npx hardhat node
```

Open a second terminal in the same folder:

```powershell
npx hardhat ignition deploy .\ignition\modules\ProductRegistry.ts --network localhost
```

### 2. Start frontend

From `Assignment 3/chainpanel-frontend`:

```powershell
npm install
npm run dev
```

## Contract Address in Frontend

Frontend reads address from:

- `VITE_PRODUCT_REGISTRY_ADDRESS` (if provided), else
- default local deployment address:
  `0x5FbDB2315678afecb367f032d93F642f64180aa3`

If your deployment address changes, create/update `.env.local` in `chainpanel-frontend`:

```env
VITE_PRODUCT_REGISTRY_ADDRESS=0xYOUR_DEPLOYED_CONTRACT_ADDRESS
```

## MetaMask Configuration

Use Hardhat local network:

- Network Name: Hardhat Localhost
- RPC URL: `http://127.0.0.1:8545`
- Chain ID: `31337`
- Currency Symbol: `ETH`

## Expected Flow

1. Connect MetaMask in the sidebar.
2. Switch to localhost network if prompted.
3. Enter product name and price.
4. Submit transaction and confirm in wallet.
5. View event-based transaction history updates in the right panel.

## Notes

- This assignment uses a local development chain, so addresses and transaction history reset when the node restarts.
- The owner for `withdraw()` is the deployer account.