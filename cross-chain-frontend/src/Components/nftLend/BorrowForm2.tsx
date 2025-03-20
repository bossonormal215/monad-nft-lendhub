"use client"

import { useState, useEffect } from "react"
import { parseUnits } from "viem"
import { useReadContract, useWriteContract, useAccount } from "wagmi"
import { LOAN_MANAGER_CONTRACT } from "@/contracts/contracts"
import { LoanManagerABI } from "@/contracts/interfaces/LoanManager"
import { useToast } from "@/Components/privy/ui/use-toast"

interface BorrowFormProps {
  collateralId: number | null
  maxLoanAmount: string
  onBorrow: (collateralId: number, amount: string, durationInSeconds: number) => Promise<void>
  isLoading: boolean
}

// Duration options in seconds
const DURATION_OPTIONS = [
  { label: "5 minutes", value: 5 * 60 },
  { label: "20 minutes", value: 20 * 60 },
  { label: "4 hours", value: 4 * 60 * 60 },
  { label: "12 hours", value: 12 * 60 * 60 },
  { label: "1 day", value: 24 * 60 * 60 },
  { label: "7 days", value: 7 * 24 * 60 * 60 },
  { label: "14 days", value: 14 * 24 * 60 * 60 },
  { label: "30 days", value: 30 * 24 * 60 * 60 },
]

export function BorrowForm({ collateralId, maxLoanAmount, onBorrow, isLoading }: BorrowFormProps) {
  const [amount, setAmount] = useState<string>("")
  const [duration, setDuration] = useState<number>(0)
  const [error, setError] = useState<string>("")
  const [status, setStatus] = useState<string>("")
  const [isProcessing, setIsProcessing] = useState(false)
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

  // Reset states when collateral changes
  useEffect(() => {
    setAmount("")
    setError("")
    setStatus("")
  }, [collateralId])

  // Check if loan exists
  const { data: loanData, refetch: refetchLoan } = useReadContract({
    address: LOAN_MANAGER_CONTRACT as `0x${string}`,
    abi: LoanManagerABI.abi,
    functionName: "loans",
    args: [BigInt(collateralId || 0)],
  })

  // Write contract hook
  const { writeContractAsync: borrowWrite, isPending: isBorrowLoading } = useWriteContract()

  const validateAmount = (value: string): boolean => {
    if (!value || isNaN(Number(value))) {
      setError("Please enter a valid amount")
      return false
    }

    const numAmount = parseUnits(value, 18)
    const maxAmount = parseUnits(maxLoanAmount, 18)

    if (numAmount <= BigInt(0)) {
      setError("Amount must be greater than 0")
      return false
    }

    if (numAmount > maxAmount) {
      setError(`Amount cannot exceed ${maxLoanAmount} USDT`)
      return false
    }

    // Validate duration
    if (!duration) {
      setError("Please select a loan duration")
      return false
    }

    return true
  }

  const handleSubmit = async () => {
    if (!collateralId || !amount || !duration) {
      setError("Please enter a valid amount and duration")
      return
    }

    if (!validateAmount(amount)) return

    setIsProcessing(true)
    setError("")
    setStatus("Processing your loan...")

    try {
      // Check if loan exists
      if (loanData && (loanData as any).isActive) {
        setError("A loan already exists for this collateral")
        setIsProcessing(false)
        return
      }

      await borrowWrite({
        address: LOAN_MANAGER_CONTRACT as `0x${string}`,
        abi: LoanManagerABI.abi,
        functionName: "issueLoan",
        args: [BigInt(collateralId), parseUnits(amount, 18), BigInt(duration)],
      })

      setStatus(`Successfully borrowed ${amount} USDT! 🎉`)
      toast({
        title: "Success",
        description: `Successfully borrowed ${amount} USDT!`,
      })

      // Wait for transaction confirmation
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setAmount("")
      setDuration(0)
      await onBorrow(Number(collateralId), amount, duration)
      refetchLoan()
    } catch (error: any) {
      setStatus("")
      console.error("Detailed borrow error:", error)

      if (error.message && error.message.includes("exceeds max loan amount")) {
        setError(`Amount exceeds maximum loan amount of ${maxLoanAmount} USDT`)
      } else if (error.message && error.message.includes("Loan already exists")) {
        setError("This NFT already has an active loan")
      } else if (error.message && error.message.includes("insufficient liquidity")) {
        setError("Insufficient liquidity in the pool")
      } else if (error.message && error.message.includes("Collateral not active")) {
        setError("Selected Collateral Is Not Active")
      } else {
        setError("Transaction failed")
      }
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="space-y-4">
      {!collateralId ? (
        <p className="text-sm text-gray-400">Deposit an NFT to enable borrowing</p>
      ) : (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Borrow Amount (Max: {maxLoanAmount} USDT)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value)
                setError("")
                setStatus("")
              }}
              step="0.1"
              min="0"
              max={maxLoanAmount}
              className="w-full px-3 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
              placeholder={`Enter amount (max ${maxLoanAmount} USDT)`}
              disabled={isProcessing || isLoading || isBorrowLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Loan Duration</label>
            <select
              value={duration}
              onChange={(e) => {
                setDuration(Number(e.target.value))
                setError("")
                setStatus("")
              }}
              className="w-full px-3 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
              disabled={isProcessing || isLoading || isBorrowLoading}
            >
              <option value={0}>Select loan duration</option>
              {DURATION_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleSubmit}
            disabled={isProcessing || isLoading || isBorrowLoading || !!error || !amount || !duration}
            className={`w-full py-3 px-6 rounded-lg text-lg font-medium ${
              isProcessing || isLoading || isBorrowLoading || !!error || !amount || !duration
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600"
            } text-white transition-colors`}
          >
            {isProcessing || isBorrowLoading
              ? "Processing..."
              : isLoading
                ? "Please wait..."
                : !amount
                  ? "Enter Loan Amount"
                  : !duration
                    ? "Select Duration"
                    : "Borrow USDT"}
          </button>

          {error && (
            <div
              className="fixed bottom-4 right-4 max-w-md bg-gray-800 text-red p-4 rounded-lg shadow-lg border border-gray-700 animate-fade-in-out"
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
        </>
      )}
    </div>
  )
}

