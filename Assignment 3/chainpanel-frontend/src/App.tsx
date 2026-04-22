import { useEffect, useMemo, useState } from 'react'
import {
  useAccount,
  useConnect,
  useDisconnect,
  usePublicClient,
  useSwitchChain,
  useWaitForTransactionReceipt,
  useWatchContractEvent,
  useWriteContract,
} from 'wagmi'
import { hardhat } from 'wagmi/chains'
import { formatEther, parseEther } from 'viem'
import {
  productAddedEventAbiItem,
  productRegistryAbi,
  productRegistryAddress,
} from './lib/productRegistry'

type ProductEvent = {
  id: bigint
  name: string
  price: bigint
  seller: `0x${string}`
  txHash?: `0x${string}`
  blockNumber?: bigint
  logIndex?: number
}

const addressLabel = (value?: string) => {
  if (!value) return 'Not connected'
  return `${value.slice(0, 6)}...${value.slice(-4)}`
}

const toBigInt = (value: unknown): bigint | null => {
  try {
    if (typeof value === 'bigint') return value
    if (typeof value === 'number' || typeof value === 'string') return BigInt(value)
  } catch {
    return null
  }

  return null
}

const parseProductEvent = (log: {
  args?: Record<string, unknown>
  transactionHash?: `0x${string}`
  blockNumber?: bigint
  logIndex?: number
}): ProductEvent | null => {
  const args = log.args
  if (!args) return null

  const id = toBigInt(args.id)
  const price = toBigInt(args.price)
  const name = args.name
  const seller = args.seller

  if (id === null || price === null) return null
  if (typeof name !== 'string') return null
  if (typeof seller !== 'string' || !seller.startsWith('0x')) return null

  return {
    id,
    name,
    price,
    seller: seller as `0x${string}`,
    txHash: log.transactionHash,
    blockNumber: log.blockNumber,
    logIndex: log.logIndex,
  }
}

const eventKey = (event: ProductEvent) =>
  `${event.txHash ?? 'no-hash'}:${event.logIndex ?? -1}:${event.id.toString()}`

const sortEvents = (events: ProductEvent[]) => {
  return [...events].sort((a, b) => {
    const aBlock = a.blockNumber ?? 0n
    const bBlock = b.blockNumber ?? 0n

    if (aBlock !== bBlock) return aBlock > bBlock ? -1 : 1

    const aLogIndex = a.logIndex ?? 0
    const bLogIndex = b.logIndex ?? 0
    return bLogIndex - aLogIndex
  })
}

function App() {
  const [productName, setProductName] = useState('')
  const [priceEth, setPriceEth] = useState('')
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>()
  const [formError, setFormError] = useState<string | null>(null)
  const [historyError, setHistoryError] = useState<string | null>(null)
  const [events, setEvents] = useState<ProductEvent[]>([])

  const { address, isConnected, chainId, chain } = useAccount()
  const { connect, connectors, status: connectStatus, error: connectError } = useConnect()
  const { disconnect } = useDisconnect()
  const { switchChainAsync, isPending: isSwitchingChain, error: switchChainError } = useSwitchChain()
  const { writeContractAsync, status: writeStatus, error: writeError } = useWriteContract()
  const {
    status: receiptStatus,
    isSuccess: isConfirmed,
    error: receiptError,
  } = useWaitForTransactionReceipt({
    hash: txHash,
    chainId: hardhat.id,
  })

  const publicClient = usePublicClient({ chainId: hardhat.id })
  const isConnecting = connectStatus === 'pending'
  const isWriting = writeStatus === 'pending'
  const isConfirming = receiptStatus === 'pending'
  const isCorrectChain = chainId === hardhat.id
  const connectedNetworkLabel =
    chain && chainId ? `${chain.name} (${chainId})` : 'Not connected'

  const metaMaskConnector = useMemo(() => {
    return connectors.find((connector) => /metamask/i.test(connector.name)) ?? connectors[0]
  }, [connectors])

  useEffect(() => {
    if (!publicClient) return

    let isActive = true

    const loadHistoricalEvents = async () => {
      try {
        const logs = await publicClient.getLogs({
          address: productRegistryAddress,
          event: productAddedEventAbiItem,
          fromBlock: 0n,
          toBlock: 'latest',
        })

        if (!isActive) return

        const parsed = logs
          .map((log) =>
            parseProductEvent({
              args: log.args as Record<string, unknown> | undefined,
              transactionHash: log.transactionHash,
              blockNumber: log.blockNumber,
              logIndex: log.logIndex,
            }),
          )
          .filter((item): item is ProductEvent => item !== null)

        setEvents(sortEvents(parsed))
        setHistoryError(null)
      } catch {
        if (isActive) {
          setHistoryError('Unable to read ProductAdded history. Make sure the local node is running.')
        }
      }
    }

    void loadHistoricalEvents()

    return () => {
      isActive = false
    }
  }, [publicClient])

  useWatchContractEvent({
    address: productRegistryAddress,
    abi: productRegistryAbi,
    eventName: 'ProductAdded',
    chainId: hardhat.id,
    onLogs(logs) {
      setEvents((current) => {
        const mapped = logs
          .map((log) =>
            parseProductEvent({
              args: log.args as Record<string, unknown> | undefined,
              transactionHash: log.transactionHash,
              blockNumber: log.blockNumber,
              logIndex: log.logIndex,
            }),
          )
          .filter((item): item is ProductEvent => item !== null)

        if (mapped.length === 0) return current

        const keys = new Set(current.map(eventKey))
        const merged = [...current]

        for (const item of mapped) {
          const key = eventKey(item)
          if (!keys.has(key)) {
            merged.push(item)
            keys.add(key)
          }
        }

        return sortEvents(merged)
      })
    },
  })

  const onConnectWallet = () => {
    if (!metaMaskConnector) {
      setFormError('No injected wallet connector found. Please install MetaMask.')
      return
    }

    setFormError(null)
    connect({ connector: metaMaskConnector })
  }

  const onSwitchNetwork = async () => {
    setFormError(null)

    try {
      await switchChainAsync({ chainId: hardhat.id })
    } catch {
      // Hook state exposes the switch error. No extra action needed here.
    }
  }

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFormError(null)

    if (!isConnected) {
      setFormError('Connect MetaMask before submitting a product transaction.')
      return
    }

    if (!isCorrectChain) {
      setFormError('Switch MetaMask to Hardhat Localhost (chain 31337) before submitting.')
      return
    }

    const cleanedName = productName.trim()
    if (!cleanedName) {
      setFormError('Product name cannot be empty.')
      return
    }

    let weiPrice: bigint
    try {
      weiPrice = parseEther(priceEth)
    } catch {
      setFormError('Price must be a valid number in ETH/POL, for example 0.05')
      return
    }

    if (weiPrice <= 0n) {
      setFormError('Price must be greater than 0.')
      return
    }

    try {
      const hash = await writeContractAsync({
        address: productRegistryAddress,
        abi: productRegistryAbi,
        functionName: 'addProduct',
        args: [cleanedName, weiPrice],
        value: weiPrice,
        chainId: hardhat.id,
      })

      setTxHash(hash)
      setProductName('')
      setPriceEth('')
    } catch {
      // Hook state exposes the write error. No extra action needed here.
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden text-slate-100">
      <div className="ambient-orb pointer-events-none absolute -left-28 -top-20 h-80 w-80 rounded-full bg-sky-500/20 blur-3xl" />
      <div className="ambient-orb pointer-events-none absolute -right-28 top-24 h-96 w-96 rounded-full bg-orange-500/20 blur-3xl [animation-delay:1.2s]" />

      <div className="mx-auto grid min-h-screen w-full max-w-7xl grid-cols-1 gap-6 px-4 py-6 lg:grid-cols-[300px_1fr] lg:px-6 lg:py-8">
        <aside className="panel-enter flex flex-col gap-6 rounded-3xl border border-white/10 bg-slate-950/65 p-6 shadow-2xl backdrop-blur-xl">
          <div>
            <p className="mono text-xs uppercase tracking-[0.22em] text-cyan-300">ChainPanel</p>
            <h1 className="mt-3 text-3xl font-semibold leading-tight text-white">Product Ledger Dashboard</h1>
            <p className="mt-3 text-sm text-slate-300">
              Register product transactions directly on the local blockchain with exact-value payments.
            </p>
          </div>

          <div className="space-y-3 rounded-2xl border border-cyan-400/30 bg-cyan-950/30 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-cyan-200">Wallet</p>
            <p className="mono text-sm text-slate-100">{addressLabel(address)}</p>
            <p className="text-xs text-slate-400">Network: {connectedNetworkLabel}</p>

            {isConnected ? (
              <button
                type="button"
                onClick={() => disconnect()}
                className="w-full rounded-xl bg-rose-500 px-4 py-2.5 font-medium text-white transition hover:bg-rose-400"
              >
                Disconnect
              </button>
            ) : (
              <button
                type="button"
                onClick={onConnectWallet}
                disabled={isConnecting}
                className="w-full rounded-xl bg-cyan-500 px-4 py-2.5 font-medium text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isConnecting ? 'Connecting...' : 'Connect MetaMask'}
              </button>
            )}

            {connectError ? <p className="text-xs text-rose-300">{connectError.message}</p> : null}

            {isConnected && !isCorrectChain ? (
              <div className="space-y-2 rounded-xl border border-amber-300/35 bg-amber-500/10 p-3">
                <p className="text-xs text-amber-100">
                  Wrong network selected. Use Hardhat Localhost (31337) for this dApp.
                </p>
                <button
                  type="button"
                  onClick={onSwitchNetwork}
                  disabled={isSwitchingChain}
                  className="w-full rounded-lg bg-amber-400 px-3 py-2 text-xs font-semibold text-slate-950 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSwitchingChain ? 'Switching...' : 'Switch to Localhost 31337'}
                </button>
                {switchChainError ? (
                  <p className="text-xs text-rose-200">{switchChainError.message}</p>
                ) : null}
              </div>
            ) : null}
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 text-sm text-slate-300">
            <p className="mono text-xs uppercase tracking-[0.16em] text-slate-400">Contract</p>
            <p className="mono mt-2 break-all text-xs text-slate-200">{productRegistryAddress}</p>
          </div>
        </aside>

        <main className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          <section className="panel-enter panel-enter-delay-1 rounded-3xl border border-white/10 bg-slate-950/70 p-6 shadow-2xl backdrop-blur-xl lg:col-span-3">
            <div className="mb-6 flex items-center justify-between gap-3">
              <div>
                <p className="mono text-xs uppercase tracking-[0.2em] text-amber-300">New Transaction</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Register Product</h2>
              </div>
              <span className="rounded-full border border-amber-300/40 bg-amber-300/15 px-3 py-1 text-xs text-amber-100">
                addProduct
              </span>
            </div>

            <form className="space-y-4" onSubmit={onSubmit}>
              <label className="block space-y-2">
                <span className="text-sm text-slate-300">Product Name</span>
                <input
                  value={productName}
                  onChange={(event) => setProductName(event.target.value)}
                  placeholder="Organic Olive Oil"
                  className="w-full rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-3 text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30"
                />
              </label>

              <label className="block space-y-2">
                <span className="text-sm text-slate-300">Price (ETH/POL)</span>
                <input
                  value={priceEth}
                  onChange={(event) => setPriceEth(event.target.value)}
                  placeholder="0.05"
                  inputMode="decimal"
                  className="mono w-full rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-3 text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30"
                />
              </label>

              <button
                type="submit"
                disabled={!isConnected || !isCorrectChain || isWriting || isConfirming}
                className="w-full rounded-xl bg-orange-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {!isConnected
                  ? 'Connect Wallet First'
                  : !isCorrectChain
                    ? 'Switch to Localhost 31337'
                    : isWriting
                      ? 'Confirm in Wallet...'
                      : isConfirming
                        ? 'Waiting for Confirmation...'
                        : 'Submit Transaction'}
              </button>
            </form>

            {formError ? <p className="mt-4 text-sm text-rose-300">{formError}</p> : null}
            {writeError ? <p className="mt-4 text-sm text-rose-300">{writeError.message}</p> : null}
            {receiptError ? <p className="mt-4 text-sm text-rose-300">{receiptError.message}</p> : null}

            {txHash ? (
              <p className="mono mt-4 break-all text-xs text-cyan-200">
                Pending tx: {txHash}
              </p>
            ) : null}

            {isConfirmed ? (
              <p className="mt-4 rounded-xl border border-emerald-300/35 bg-emerald-400/10 px-3 py-2 text-sm text-emerald-200">
                Transaction confirmed. ProductAdded event should appear in the history panel.
              </p>
            ) : null}
          </section>

          <section className="panel-enter panel-enter-delay-2 rounded-3xl border border-white/10 bg-slate-950/70 p-6 shadow-2xl backdrop-blur-xl lg:col-span-2">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-white">Transaction History</h3>
              <span className="mono rounded-full border border-white/20 px-3 py-1 text-xs text-slate-300">
                ProductAdded
              </span>
            </div>

            {historyError ? (
              <p className="mb-4 rounded-xl border border-rose-300/35 bg-rose-400/10 px-3 py-2 text-sm text-rose-200">
                {historyError}
              </p>
            ) : null}

            <div className="max-h-[560px] space-y-3 overflow-auto pr-1">
              {events.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-600 bg-slate-900/55 p-5 text-sm text-slate-400">
                  No ProductAdded events yet. Submit the first product transaction to populate this panel.
                </div>
              ) : (
                events.map((item) => (
                  <article
                    key={eventKey(item)}
                    className="rounded-2xl border border-slate-700/80 bg-slate-900/80 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-white">#{item.id.toString()} {item.name}</p>
                        <p className="mono mt-1 text-xs text-cyan-200">
                          {formatEther(item.price)} ETH/POL
                        </p>
                      </div>
                      <span className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-2 py-1 text-[11px] text-cyan-200">
                        on-chain
                      </span>
                    </div>

                    <p className="mono mt-3 break-all text-xs text-slate-400">seller: {item.seller}</p>

                    {item.txHash ? (
                      <p className="mono mt-2 break-all text-xs text-slate-500">tx: {item.txHash}</p>
                    ) : null}
                  </article>
                ))
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}

export default App
