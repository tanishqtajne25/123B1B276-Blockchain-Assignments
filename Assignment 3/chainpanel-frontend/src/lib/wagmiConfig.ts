import { createConfig, http } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { hardhat } from 'wagmi/chains'

export const wagmiConfig = createConfig({
  chains: [hardhat],
  connectors: [injected()],
  transports: {
    [hardhat.id]: http('http://127.0.0.1:8545'),
  },
})