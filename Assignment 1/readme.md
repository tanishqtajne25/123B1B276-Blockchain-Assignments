# Assignment 1: SimpleStorage

## Overview

This contract is a basic Solidity example that saves one unsigned integer on-chain and lets users read it back. It is useful for understanding state variables, transaction-based writes, and view functions.

## Contract Summary

- Contract name: `SimpleStorage`
- Solidity version: `^0.8.0`
- Stored variable: `uint256 private data`

## Available Functions

| Function | Purpose |
| --- | --- |
| `set(uint256 _data)` | Updates the stored number |
| `get()` | Returns the current stored number |

## Compile and Deploy (Remix + MetaMask)

1. Open Remix IDE.
2. Create a file named `contract.sol` and paste the contract code.
3. Compile with a Solidity `0.8.x` compiler.
4. Open the **Deploy & Run Transactions** panel.
5. Choose **Injected Provider - MetaMask** as the environment.
6. Connect your wallet and confirm network access.
7. Press **Deploy**, then approve the transaction in MetaMask.

## Quick Test

1. Call `set` with any number, for example `25`.
2. Call `get` to verify that the contract now returns the same value.