"use client"

import { Alert, AlertDescription, AlertTitle } from "@/Components/privy/ui/alert"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/Components/privy/ui/button"

interface TransactionStatusProps {
  status: "idle" | "pending" | "success" | "error"
  txHash: string | null
  sourceChain: string
  destinationChain: string
}

// Explorer URLs by chain
const EXPLORERS = {
  sepolia: "https://sepolia.etherscan.io/tx/",
  monad: "https://testnet.monadexplorer.com/",
}

export function TransactionStatus({ status, txHash, sourceChain, destinationChain }: TransactionStatusProps) {
  if (status === "idle") return null

  const explorerUrl = txHash ? `${EXPLORERS[sourceChain as keyof typeof EXPLORERS]}${txHash}` : ""

  return (
    <Alert
      className={`
      ${status === "pending" ? "bg-yellow-900/20 border-yellow-800" : ""}
      ${status === "success" ? "bg-green-900/20 border-green-800" : ""}
      ${status === "error" ? "bg-red-900/20 border-red-800" : ""}
    `}
    >
      {status === "pending" && (
        <>
          <Loader2 className="h-4 w-4 animate-spin text-yellow-500" />
          <AlertTitle className="text-yellow-500">Transaction in Progress</AlertTitle>
          <AlertDescription>
            Your transfer is being processed. This may take a few minutes to complete.
          </AlertDescription>
        </>
      )}

      {status === "success" && (
        <>
          <CheckCircle className="h-4 w-4 text-green-500" />
          <AlertTitle className="text-green-500">Transaction Successful</AlertTitle>
          <AlertDescription>
            <div className="space-y-2">
              <p>
                Your transfer has been initiated successfully. Tokens will arrive in your destination wallet shortly.
              </p>
              {explorerUrl && (
                <Button
                  variant="link"
                  className="p-0 h-auto text-green-400 hover:text-green-300"
                  onClick={() => window.open(explorerUrl, "_blank")}
                >
                  View transaction on explorer
                </Button>
              )}
            </div>
          </AlertDescription>
        </>
      )}

      {status === "error" && (
        <>
          <AlertCircle className="h-4 w-4 text-red-500" />
          <AlertTitle className="text-red-500">Transaction Failed</AlertTitle>
          <AlertDescription>There was an error processing your transfer. Please try again.</AlertDescription>
        </>
      )}
    </Alert>
  )
}

