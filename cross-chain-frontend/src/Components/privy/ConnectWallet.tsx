"use client"

import { usePrivy } from "@privy-io/react-auth"
import { useWallet } from "./hooks/useWallet"
import { useToast } from "./ui/use-toast"

interface ConnectWalletProps {
  modalTitle?: string
  modalSize?: "wide" | "compact"
  className?: string
}

export function ConnectWallet({
  modalTitle = "Connect Your Wallet",
  modalSize = "wide",
  className = "",
}: ConnectWalletProps) {
  const { login, ready, authenticated } = usePrivy()
  const { address, disconnectWallet } = useWallet()
  const { toast } = useToast()

  if (!ready) {
    return (
      <button
        className={`px-4 py-2 bg-gray-700 text-white rounded-lg opacity-50 cursor-not-allowed ${className}`}
        disabled
      >
        Loading...
      </button>
    )
  }

  if (!authenticated || !address) {
    return (
      <button
        onClick={() => login()}
        className={`px-4 py-2 bg-gradient-to-r from-[#4C82FB] to-[#6366F1] text-white rounded-lg hover:opacity-90 transition-opacity ${className}`}
      >
        Connect Wallet
      </button>
    )
  }

  // Format address for display
  const displayAddress = `${address.substring(0, 6)}...${address.substring(address.length - 4)}`

  return (
    <div className="flex items-center gap-2">
      <div className="px-3 py-1.5 bg-[#2C3545] text-[#98A1C0] text-sm rounded-full">{displayAddress}</div>
      <button
        onClick={() => {
          disconnectWallet()
          toast({
            title: "Disconnected",
            description: "Your wallet has been disconnected",
          })
        }}
        className={`px-4 py-2 bg-[#1C2839] text-[#F5F6FC] rounded-lg hover:bg-[#2C3545] transition-colors ${className}`}
      >
        Disconnect
      </button>
    </div>
  )
}

