"use client"

import { useSwitchChain } from "@thirdweb-dev/react"
import { Button } from "@/Components/privy/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/privy/ui/select"
import { ArrowRightLeft } from "lucide-react"

interface ChainSelectorProps {
  sourceChain: string
  destinationChain: string
  onSourceChainChange: (chain: string) => void
  onDestinationChainChange: (chain: string) => void
  onSwapChains: () => void
}

const CHAINS = [
  { id: "sepolia", name: "Sepolia", chainId: 11155111, logo: "/sepolia-logo.svg" },
  { id: "monad", name: "Monad Testnet", chainId: 1338, logo: "/monad-logo.svg" },
]

export function ChainSelector({
  sourceChain,
  destinationChain,
  onSourceChainChange,
  onDestinationChainChange,
  onSwapChains,
}: ChainSelectorProps) {
  const switchChain = useSwitchChain()

  const handleSourceChainChange = (value: string) => {
    onSourceChainChange(value)
    const chain = CHAINS.find((c) => c.id === value)
    if (chain) {
      switchChain(chain.chainId)
    }
  }

  return (
    <div className="grid grid-cols-[1fr,auto,1fr] items-center gap-2">
      <Select value={sourceChain} onValueChange={handleSourceChainChange}>
        <SelectTrigger className="bg-gray-900 border-gray-700">
          <SelectValue placeholder="Source Chain" />
        </SelectTrigger>
        <SelectContent className="bg-gray-900 border-gray-700">
          {CHAINS.map((chain) => (
            <SelectItem key={chain.id} value={chain.id} className="hover:bg-gray-800">
              {chain.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button variant="ghost" size="icon" onClick={onSwapChains} className="rounded-full bg-gray-800 hover:bg-gray-700">
        <ArrowRightLeft className="h-4 w-4" />
      </Button>

      <Select value={destinationChain} onValueChange={onDestinationChainChange}>
        <SelectTrigger className="bg-gray-900 border-gray-700">
          <SelectValue placeholder="Destination Chain" />
        </SelectTrigger>
        <SelectContent className="bg-gray-900 border-gray-700">
          {CHAINS.map((chain) => (
            <SelectItem key={chain.id} value={chain.id} className="hover:bg-gray-800">
              {chain.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

