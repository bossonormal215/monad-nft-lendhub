"use client"

import { useState, useEffect } from "react"
import { formatUnits, parseUnits } from "viem"
import { useAccount, useReadContract, useWriteContract } from "wagmi"
import { USDT_CONTRACT, LIQUIDITY_POOL_CONTRACT } from "@/contracts/contracts"
import { USDTLiquidityPoolABI } from "@/contracts/interfaces/USDTLiquidityPool"
import { MockUsdtABI } from "@/contracts/interfaces/mocUsdt"
import { useToast } from "@/Components/privy/ui/use-toast"

// Add this utility function at the top
const formatUSDT = (value: string | number | bigint): string => {
  try {
    // If value is in wei, convert to ether first
    const etherValue = typeof value === "bigint" ? formatUnits(value, 18) : value.toString()

    // Round to 2 decimal places
    const rounded = Number(etherValue).toFixed(2)
    return `${rounded} USDT`
  } catch (error) {
    console.error("Error formatting USDT:", error)
    return "0.00 USDT"
  }
}

export function LiquidityProvider() {
  const [amount, setAmount] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>("")
  const [status, setStatus] = useState<string>("")
  const [usdtBalance, setUsdtBalance] = useState<string>("0")
  const [poolBalance, setPoolBalance] = useState<string>("0")
  const { address } = useAccount()
  const { toast } = useToast()

  // Add auto-dismiss effect
  useEffect(() => {
    if (status || error) {
      const timer = setTimeout(() => {
        setStatus("")
        setError("")
      }, 5000) // 5 seconds

      return () => clearTimeout(timer)
    }
  }, [status])

  // Fetch USDT balance
  const { data: balanceData, refetch: refetchBalance } = useReadContract({
    address: USDT_CONTRACT as `0x${string}`,
    abi: MockUsdtABI.abi,
    functionName: "balanceOf",
    args: [address],
  })

  // Fetch pool balance
  const { data: poolData, refetch: refetchPool } = useReadContract({
    address: LIQUIDITY_POOL_CONTRACT as `0x${string}`,
    abi: USDTLiquidityPoolABI.abi,
    functionName: "getTotalLiquidity",
  })

  // Update balances when data changes
  useEffect(() => {
    if (balanceData) {
      setUsdtBalance(formatUnits(balanceData as bigint, 18))
    }
    if (poolData) {
      setPoolBalance(formatUnits(poolData as bigint, 18))
    }
  }, [balanceData, poolData])

  // Write contract hooks
  const { writeContractAsync: mintUsdt, isPending: isMintLoading } = useWriteContract()
  const { writeContractAsync: approveUsdt, isPending: isApproveLoading } = useWriteContract()
  const { writeContractAsync: addLiquidity, isPending: isAddLiquidityLoading } = useWriteContract()
  const { writeContractAsync: removeLiquidity, isPending: isRemoveLiquidityLoading } = useWriteContract()

  const handleAddLiquidity = async () => {
    if (!address || !amount) return
    setIsLoading(true)
    setError("")
    setStatus("Processing...")

    try {
      if (Number(amount) > Number(usdtBalance)) {
        setError(`Insufficient USDT balance. You have ${usdtBalance} USDT`)
        setIsLoading(false)
        return
      }

      // First approve USDT
      await approveUsdt({
        address: USDT_CONTRACT as `0x${string}`,
        abi: MockUsdtABI.abi,
        functionName: "approve",
        args: [LIQUIDITY_POOL_CONTRACT, parseUnits(amount, 18)],
      })

      setStatus("USDT approved, adding liquidity...")

      // Wait for transaction confirmation
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Then add liquidity
      await addLiquidity({
        address: LIQUIDITY_POOL_CONTRACT as `0x${string}`,
        abi: USDTLiquidityPoolABI.abi,
        functionName: "addLiquidity",
        args: [parseUnits(amount, 18)],
      })

      setStatus("Successfully added liquidity! 🎉")
      toast({
        title: "Success",
        description: "Successfully added liquidity!",
      })

      // Wait for transaction confirmation
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setAmount("")
      refetchBalance()
      refetchPool()
    } catch (error: any) {
      setStatus("")
      setError("Transaction failed")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveLiquidity = async () => {
    if (!address || !amount) return
    setIsLoading(true)
    setError("")
    setStatus("Processing...")

    try {
      await removeLiquidity({
        address: LIQUIDITY_POOL_CONTRACT as `0x${string}`,
        abi: USDTLiquidityPoolABI.abi,
        functionName: "removeLiquidity",
        args: [parseUnits(amount, 18)],
      })

      setStatus("Successfully withdrawn liquidity! 🎉")
      toast({
        title: "Success",
        description: "Successfully withdrawn liquidity!",
      })

      // Wait for transaction confirmation
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setAmount("")
      refetchBalance()
      refetchPool()
    } catch (error: any) {
      setStatus("")
      if (error.message && error.message.includes("Insufficient liquidity")) {
        setError("Insufficient liquidity in the pool")
      } else {
        setError("Failed to withdraw liquidity")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleMintUSDT = async () => {
    if (!address) return
    setIsLoading(true)
    setError("")
    setStatus("Minting USDT...")

    try {
      await mintUsdt({
        address: USDT_CONTRACT as `0x${string}`,
        abi: MockUsdtABI.abi,
        functionName: "mintTokens",
      })

      setStatus("Successfully minted USDT! 🎉")
      toast({
        title: "Success",
        description: "Successfully minted USDT!",
      })

      // Wait for transaction confirmation
      await new Promise((resolve) => setTimeout(resolve, 2000))

      refetchBalance()
    } catch (error: any) {
      setStatus("")
      if (error.message && error.message.includes("You have no tokens to mint")) {
        setError("You have already minted!!")
      } else if (error.message && error.message.includes("owner")) {
        setError("Only Owner Is Allowed To Mint USDT !!")
      } else if (error.message && error.message.includes("data")) {
        setError("You Are Not Allowed To Mint!!, Mint an NFT to be whitelisted for minting 2000 mUSDT")
      } else {
        setError("Failed to mint USDT")
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Determine if any operation is loading
  const isAnyLoading =
    isLoading || isMintLoading || isApproveLoading || isAddLiquidityLoading || isRemoveLiquidityLoading

  return (
    <div className="space-y-6">
      <div className="bg-[#131A2A] rounded-[20px] p-6">
        <h3 className="text-xl font-medium text-[#F5F6FC] mb-4">USDT Liquidity Management</h3>

        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-[#98A1C0]">Your USDT Balance</span>
            <span className="text-[#F5F6FC] font-medium">{formatUSDT(usdtBalance)}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-[#98A1C0]">Total Pool Liquidity</span>
            <span className="text-[#F5F6FC] font-medium">{formatUSDT(poolBalance)}</span>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-[#98A1C0]">Amount of USDT</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-3 bg-[#0D111C] border border-[#1C2839] rounded-[20px]
                                     text-[#F5F6FC] placeholder-[#5D6785] focus:outline-none focus:border-[#98A1C0]
                                     transition-colors"
              placeholder="Enter amount of USDT"
              disabled={isAnyLoading}
            />
          </div>

          {error && (
            <div
              className="fixed bottom-4 right-4 max-w-md bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700 animate-fade-in-out"
              style={{
                animation: "fadInOut 20s ease-in-out",
              }}
            >
              <p className="text-sm text-red-500">{error}</p>
            </div>
          )}

          {/* Status Messages */}
          {status && (
            <div
              className="fixed bottom-4 right-4 max-w-md bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700 animate-fade-in-out"
              style={{
                animation: "fadeInOut 20s ease-in-out",
              }}
            >
              <p className="text-sm text-[#F5F6FC]">{status}</p>
            </div>
          )}

          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={handleMintUSDT}
              disabled={isAnyLoading}
              className={`px-4 py-3 bg-[#131A2A] border border-[#1C2839] rounded-[20px]
                                         text-[#F5F6FC] hover:border-[#98A1C0] transition-colors ${isAnyLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {isAnyLoading ? "Processing..." : "Mint USDT"}
            </button>
            <button
              onClick={handleAddLiquidity}
              disabled={isAnyLoading || !amount}
              className={`px-4 py-3 bg-gradient-to-r from-[#8B5CF6] to-[#6366F1]
                                         rounded-[20px] text-white font-medium hover:opacity-90 transition-opacity ${isAnyLoading || !amount ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {isAnyLoading ? "Processing..." : "Add Liquidity"}
            </button>
            <button
              onClick={handleRemoveLiquidity}
              disabled={isAnyLoading || !amount}
              className={`px-4 py-3 bg-[#131A2A] border border-[#1C2839] rounded-[20px]
                                         text-[#F5F6FC] hover:border-[#98A1C0] transition-colors ${isAnyLoading || !amount ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {isAnyLoading ? "Processing..." : "Withdraw"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

