# Blockchain Lab Assignments

## Student Details
- **Name:** Tanishq Tajne
- **Roll Number:** 123B1B276
- **Course Name:** Blockchain Lab

---

## Overview
This repository contains blockchain lab assignments that cover:

- Solidity smart contract fundamentals
- Testnet deployment
- Full-stack Web3 dApp development
- IPFS-based decentralized file storage
- DAO governance logic

---

## Assignment Descriptions

### Assignment 1: Smart Contract Development
Implements a simple storage contract to set and get an integer value on-chain.

### Assignment 2: Polygon Deployment
Deploys the storage contract on Polygon Amoy testnet using Remix and MetaMask.

### Assignment 3: ChainPanel dApp
Builds a full-stack dApp with:

- Hardhat + Solidity contract (`ProductRegistry`)
- React (Vite) + TypeScript frontend
- Wagmi + Viem wallet/contract integration
- Event-based transaction history via `ProductAdded`

### Assignment 4: IPFS Integration (Pinata)
Uses Node.js scripts to:

- Upload a local file to Pinata/IPFS
- Retrieve file content from IPFS gateways using CID

### Assignment 5: DAO Smart Contract
Implements a DAO contract with member management, proposal creation, voting, and execution.

---

## Tech Stack Used
- Solidity
- Hardhat (Ignition)
- Remix IDE
- React (Vite) + TypeScript
- Tailwind CSS
- Wagmi + Viem
- MetaMask
- Node.js
- IPFS (Pinata)
- Polygon Amoy Testnet

---

## How to Run Each Assignment

### Assignment 1 and Assignment 2
1. Open Remix IDE: https://remix.ethereum.org
2. Open the contract file (`contract.sol`).
3. Compile using a Solidity `0.8.x` compiler.
4. In **Deploy & Run Transactions**, select **Injected Provider - MetaMask**.
5. Choose the correct network:
   - Assignment 1: Sepolia (or your configured practice network)
   - Assignment 2: Polygon Amoy
6. Deploy and test the contract functions.

### Assignment 3 (ChainPanel)
From `Assignment 3/chainpanel-contracts`:

```powershell
npm install
npx hardhat compile
npx hardhat node
```

In a second terminal (same folder):

```powershell
npx hardhat ignition deploy .\ignition\modules\ProductRegistry.ts --network localhost
```

From `Assignment 3/chainpanel-frontend`:

```powershell
npm install
npm run dev
```

Then connect MetaMask to Hardhat localhost (`http://127.0.0.1:8545`, chain ID `31337`).

### Assignment 4 (IPFS + Pinata)
From `Assignment 4`:

```powershell
npm install
node upload.js
node retrieve.js <CID>
```

You can also set `PINATA_CID` in `.env` and run `node retrieve.js`.

### Assignment 5 (DAO)
1. Open Remix IDE.
2. Compile `DAO.sol`.
3. Deploy using MetaMask.
4. Interact with core functions:
   - `addMember`
   - `createProposal`
   - `vote`
   - `executeProposal`
5. Verify proposal state and results from getter functions.

---

## Notes
- Assignment-level details are documented in each assignment's own `readme.md`/`README.md`.
- Keep API keys and secrets in local `.env` files and avoid committing them to public repositories.