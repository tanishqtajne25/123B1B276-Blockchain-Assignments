import { parseAbiItem, type Abi } from 'viem'

export const productRegistryAddress =
  (import.meta.env.VITE_PRODUCT_REGISTRY_ADDRESS ??
    '0x5FbDB2315678afecb367f032d93F642f64180aa3') as `0x${string}`

export const productRegistryAbi = [
  {
    type: 'function',
    name: 'addProduct',
    stateMutability: 'payable',
    inputs: [
      { name: 'name', type: 'string', internalType: 'string' },
      { name: 'price', type: 'uint256', internalType: 'uint256' },
    ],
    outputs: [{ name: 'id', type: 'uint256', internalType: 'uint256' }],
  },
  {
    type: 'function',
    name: 'getProduct',
    stateMutability: 'view',
    inputs: [{ name: 'id', type: 'uint256', internalType: 'uint256' }],
    outputs: [
      {
        name: '',
        type: 'tuple',
        internalType: 'struct ProductRegistry.Product',
        components: [
          { name: 'id', type: 'uint256', internalType: 'uint256' },
          { name: 'name', type: 'string', internalType: 'string' },
          { name: 'price', type: 'uint256', internalType: 'uint256' },
          { name: 'seller', type: 'address', internalType: 'address' },
        ],
      },
    ],
  },
  {
    type: 'event',
    name: 'ProductAdded',
    anonymous: false,
    inputs: [
      { indexed: true, name: 'id', type: 'uint256', internalType: 'uint256' },
      { indexed: false, name: 'name', type: 'string', internalType: 'string' },
      { indexed: false, name: 'price', type: 'uint256', internalType: 'uint256' },
      { indexed: true, name: 'seller', type: 'address', internalType: 'address' },
    ],
  },
] as const satisfies Abi

export const productAddedEventAbiItem = parseAbiItem(
  'event ProductAdded(uint256 indexed id, string name, uint256 price, address indexed seller)',
)