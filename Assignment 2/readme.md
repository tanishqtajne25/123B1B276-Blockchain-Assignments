# Assignment 2: Deploying a Smart Contract on Polygon Amoy

## Objective

Deploy the `SimpleStorage` Solidity contract to the Polygon Amoy test network using Remix IDE and MetaMask.

## Files in This Assignment

- `contract.sol` - smart contract source code
- `readme.md` - deployment notes and setup details
- Screenshots - transaction and deployment proof

## Tools Used

- Remix IDE
- MetaMask
- Polygon Amoy Testnet

## Polygon Amoy Network Configuration

| Parameter | Value |
| --- | --- |
| Network Name | Polygon Amoy |
| RPC URL | https://rpc-amoy.polygon.technology |
| Chain ID | 80002 |
| Currency Symbol | POL |
| Block Explorer | https://amoy.polygonscan.com |

## Deployment Procedure

1. Open Remix at https://remix.ethereum.org.
2. Create `contract.sol` and paste the contract code.
3. Compile using Solidity compiler version `0.8.x`.
4. In **Deploy & Run Transactions**, select **Injected Provider - MetaMask**.
5. Connect MetaMask and ensure the selected network is Polygon Amoy.
6. Click **Deploy** and confirm the transaction in MetaMask.
7. Copy the deployed contract address.
8. Verify the address on https://amoy.polygonscan.com.

## Basic Contract Check

After deployment:

1. Call `set` with a sample value (for example, `10`).
2. Call `get` to confirm the value is stored correctly.

## Deployed Contract Address

`0xcb757229dF55B55eb6f1702a003261E4c46b32A3`