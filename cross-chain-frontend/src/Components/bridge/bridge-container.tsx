"use client"

import { useState, useEffect } from "react"
import { useAddress, useChain, useConnectionStatus } from "@thirdweb-dev/react"
import { ChainSelector } from "./chain-selector"
import { TokenSelector } from "./token-selector";
import { TransferForm } from './transfer-form';
import { TransactionStatus } from "./transaction-status"
import { ConnectWallet } from '@thirdweb-dev/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/privy/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/privy/ui/tabs"

export default function BridgeContainer() {
  const address = useAddress()
  const connectionStatus = useConnectionStatus()
  const isConnected = connectionStatus === "connected"
  const chain = useChain()
  const [sourceChain, setSourceChain] = useState<string>("sepolia")
  const [destinationChain, setDestinationChain] = useState<string>("monad")
  const [selectedToken, setSelectedToken] = useState<string>("ETH")
  const [txStatus, setTxStatus] = useState<"idle" | "pending" | "success" | "error">("idle")
  const [txHash, setTxHash] = useState<string | null>(null)

  // Handle chain switching when source chain changes
  useEffect(() => {
    if (isConnected && chain?.chainId) {
      // Logic to ensure wallet is connected to the right chain
    }
  }, [isConnected, chain]) // Removed sourceChain from dependencies

  // Swap source and destination chains
  const swapChains = () => {
    const temp = sourceChain
    setSourceChain(destinationChain)
    setDestinationChain(temp)
  }

  return (
    <Card className="border-gray-800 bg-gray-950 shadow-xl">
      <CardHeader>
        <CardTitle>Cross-Chain Bridge</CardTitle>
        <CardDescription>Transfer tokens between Sepolia and Monad Testnet</CardDescription>
      </CardHeader>
      <CardContent>
        {!isConnected ? (
          <ConnectWallet />
        ) : (
          <Tabs defaultValue="bridge" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="bridge">Bridge</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>
            <TabsContent value="bridge">
              <div className="space-y-4">
                <ChainSelector
                  sourceChain={sourceChain}
                  destinationChain={destinationChain}
                  onSourceChainChange={setSourceChain}
                  onDestinationChainChange={setDestinationChain}
                  onSwapChains={swapChains}
                />

                <TokenSelector
                  selectedToken={selectedToken}
                  onTokenChange={setSelectedToken}
                  sourceChain={sourceChain}
                />

                <TransferForm
                  sourceChain={sourceChain}
                  destinationChain={destinationChain}
                  selectedToken={selectedToken}
                  onTransferStart={() => setTxStatus("pending")}
                  onTransferSuccess={(hash) => {
                    setTxStatus("success")
                    setTxHash(hash)
                  }}
                  onTransferError={() => setTxStatus("error")}
                />

                {txStatus !== "idle" && (
                  <TransactionStatus
                    status={txStatus}
                    txHash={txHash}
                    sourceChain={sourceChain}
                    destinationChain={destinationChain}
                  />
                )}
              </div>
            </TabsContent>
            <TabsContent value="history">
              <div className="text-center py-8 text-gray-400">
                <p>Transaction history will appear here</p>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  )
}

