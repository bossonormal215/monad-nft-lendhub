"use client"

import { useState, useEffect } from "react"
import { useAccount, useReadContract, useWriteContract } from "wagmi"
import { formatUnits } from "viem"
import { LOAN_MANAGER_CONTRACT, NFT_VAULT_CONTRACT, USDT_CONTRACT } from "@/contracts/contracts"
import { LoanManagerABI } from "@/contracts/interfaces/LoanManager"
import { NFTCollateralVaultABI } from "@/contracts/interfaces/NFTCollateralVault"
import { MockUsdtABI } from "@/contracts/interfaces/mocUsdt"
import { useToast } from "@/Components/privy/ui/use-toast"
import { ethers } from "ethers"

interface LoanManagerProps {
  collateralId: number | null
  maxLoanAmount?: string
  onNFTWithdrawn?: (collateralId: number) => Promise<void>
}

// Add a utility function for formatting large numbers
const formatBigNumber = (value: any, decimals = 18) => {
  try {
    // return formatUnits(value, decimals)
    // return ethers.utils.formatUnits(value, decimals);
    return Number(formatUnits(value, decimals)).toFixed(decimals === 6 ? 6 : 2);
  } catch (error) {
    console.error("Error formatting BigNumber:", error)
    return "0"
  }
}

const formatBigNumber2 = (value: any, decimals = 12) => {
    try {
      return formatUnits(value, decimals)
    } catch (error) {
      console.error("Error formatting BigNumber:", error)
      return "0"
    }
  }

export function LoanManager({ collateralId, maxLoanAmount, onNFTWithdrawn }: LoanManagerProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>("")
  const [status, setStatus] = useState<string>("")
  const [activeLoan, setActiveLoan] = useState<any>(null)
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

  // Fetch loan details
  const { data: loanData, refetch: refetchLoan } = useReadContract({
    address: LOAN_MANAGER_CONTRACT as `0x${string}`,
    abi: LoanManagerABI.abi,
    functionName: "loans",
    // args: [BigInt(collateralId || 0)],
    args: [collateralId ? BigInt(collateralId) : BigInt(0)]

  })

  // Process loan data
  /*
  useEffect(() => {
    if (loanData && typeof loanData === 'object') {
        const loan = loanData as any;
        console.log("Loan structure:", loan);

        console.log("Loan structure:", {
            collateralId: loan.collateralId?.toString(),
            amount: loan.amount?.toString(),
            timestamp: loan.timestamp?.toString(),
            isActive: loan.isActive,
            interestRate: loan.interestRate?.toString(),
            duration: loan.duration?.toString()
        });
        
        // More detailed logging to debug the issue
        console.log("Loan details:", {
            collateralId: loan.collateralId?.toString(),
            amount: loan.amount?.toString(),
            timestamp: loan.timestamp?.toString(),
            isActive: loan.isActive,
            interestRate: loan.interestRate?.toString(),
            duration: loan.duration?.toString(),
            interest: loan.interest?.toString()
        });

        // Check if loan is active - be more explicit about the condition
        const hasActiveLoan = loan.isActive === true;

        if (hasActiveLoan) {
            setActiveLoan({
                amount: loan.amount || BigInt(0),
                startTime: loan.timestamp || BigInt(0),
                duration: loan.duration || BigInt(0),
                interest: loan.interest || BigInt(0),
                isActive: true,
                totalRepayment: (loan.amount || BigInt(0)) + (loan.interest || BigInt(0))
            });
            console.log("Active loan detected:", {
                amount: formatBigNumber(loan.amount || BigInt(0)),
                interest: formatBigNumber(loan.interest || BigInt(0)),
                totalRepayment: formatBigNumber((loan.amount || BigInt(0)) + (loan.interest || BigInt(0)))
            });
        } else {
            console.log("No active loan detected");
            setActiveLoan(null);
        }
    } else {
        console.log("No loan data or invalid format:", loanData);
        setActiveLoan(null);
    }
}, [loanData]);
*/

// Process loan data
useEffect(() => {
    if (loanData && Array.isArray(loanData)) {
      console.log("Loan structure:", loanData);
  
      // Convert loanData array into an object
      const loan = {
        collateralId: loanData[0] ? loanData[0].toString() : undefined,
        amount: loanData[1] ? loanData[1].toString() : undefined,
        timestamp: loanData[2] ? loanData[2].toString() : undefined,
        interest: loanData[3] ? loanData[3].toString() : undefined,
        duration: loanData[4] ? loanData[4].toString() : undefined,
        isActive: loanData[5] === true,  // Boolean flag
        interestRate: loanData[6] ? loanData[6].toString() : undefined
      };
  
      console.log("Formatted Loan details:", loan);
  
      // Check if loan is active
      const hasActiveLoan = loan.isActive === true && loan.amount && loan.amount !== "0";
  
      if (hasActiveLoan) {
        setActiveLoan({
          amount: BigInt(loan.amount || 0),
          startTime: BigInt(loan.timestamp || 0),
          duration: BigInt(loan.duration || 0),
          interest: BigInt(loan.interest || 0),
          isActive: true,
          totalRepayment: BigInt(loan.amount || 0) + BigInt(loan.interest || 0),
        });
  
        console.log("Active loan detected:", loan);
      } else {
        console.log("No active loan detected");
        setActiveLoan(null);
      }
    } else {
      console.log("No loan data or invalid format:", loanData);
      setActiveLoan(null);
    }
  }, [loanData]);
  

  // Write contract hooks
  const { writeContractAsync: approveUsdt, isPending: isApproveLoading } = useWriteContract()
  const { writeContractAsync: repayLoan, isPending: isRepayLoading } = useWriteContract()
  const { writeContractAsync: liquidateLoan, isPending: isLiquidateLoading } = useWriteContract()
  const { writeContractAsync: withdrawNFT, isPending: isWithdrawLoading } = useWriteContract()

  const handleRepay = async () => {
    if (!collateralId || !activeLoan) return

    setIsLoading(true)
    setError("")
    setStatus("Processing repayment...")

    try {
      // First approve USDT
      await approveUsdt({
        address: USDT_CONTRACT as `0x${string}`,
        abi: MockUsdtABI.abi,
        functionName: "approve",
        args: [LOAN_MANAGER_CONTRACT, activeLoan.totalRepayment],
      })

      setStatus("USDT approved, repaying loan...")

      // Wait for transaction confirmation
      await new Promise((resolve) => setTimeout(resolve, 2000))

      await repayLoan({
        address: LOAN_MANAGER_CONTRACT as `0x${string}`,
        abi: LoanManagerABI.abi,
        functionName: "repayLoan",
        args: [BigInt(collateralId)],
      })

      setStatus("Loan successfully repaid! 🎉")
      toast({
        title: "Success",
        description: "Loan successfully repaid!",
      })

      // Wait for transaction confirmation
      await new Promise((resolve) => setTimeout(resolve, 2000))

      refetchLoan()
    } catch (error: any) {
      setStatus("")
      if (error.message && error.message.includes("Loan not active")) {
        setError("You Are Trying to Repay an INACTIVE loan")
      } else {
        setError("Failed to repay loan")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleLiquidate = async () => {
    if (!collateralId || !activeLoan) return

    setIsLoading(true)
    setError("")
    setStatus("Processing liquidation...")

    try {
      await liquidateLoan({
        address: LOAN_MANAGER_CONTRACT as `0x${string}`,
        abi: LoanManagerABI.abi,
        functionName: "liquidateOverdueLoan",
        args: [BigInt(collateralId)],
      })

      setStatus("Collateral successfully liquidated! 🎉")
      toast({
        title: "Success",
        description: "Collateral successfully liquidated!",
      })

      // Wait for transaction confirmation
      await new Promise((resolve) => setTimeout(resolve, 2000))

      refetchLoan()
    } catch (error: any) {
      setStatus("")
      if (error.message && error.message.includes("not eligible")) {
        setError("Loan is not eligible for liquidation")
      } else if (error.message && error.message.includes("no permission")) {
        setError("You don't have permission to liquidate this loan")
      } else {
        setError("Failed to liquidate loan")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleWithdrawNFT = async () => {
    if (!collateralId) return

    setIsLoading(true)
    setError("")
    setStatus("Withdrawing NFT...")

    try {
      await withdrawNFT({
        address: NFT_VAULT_CONTRACT as `0x${string}`,
        abi: NFTCollateralVaultABI.abi,
        functionName: "withdrawNFT",
        args: [BigInt(collateralId)],
      })

      setStatus("NFT successfully withdrawn! 🎉")
      toast({
        title: "Success",
        description: "NFT successfully withdrawn!",
      })

      // Wait for transaction confirmation
      await new Promise((resolve) => setTimeout(resolve, 2000))

      if (onNFTWithdrawn && collateralId) {
        await onNFTWithdrawn(collateralId)
      }
    } catch (error: any) {
      setStatus("")
      if (error.message && error.message.includes("Collateral inactive")) {
        setError("Collateral inactive: You Have Already Withdrawn The Selected NFT")
      } else if (error.message && error.message.includes("Loan not repaid")) {
        setError("Active Loan is yet to be repaid")
      } else {
        setError("Failed to withdraw NFT")
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Determine if any operation is loading
  const isAnyLoading = isLoading || isApproveLoading || isRepayLoading || isLiquidateLoading || isWithdrawLoading

  return (
    <div className="space-y-4">
      {!activeLoan ? (
        // Show borrow option when no active loan
        <div className="text-center text-gray-400">
          <p>NFT deposited as collateral</p>
          <p>You can borrow up to {maxLoanAmount} USDT</p>
          <button
            onClick={handleWithdrawNFT}
            disabled={isAnyLoading}
            className={`w-full mt-4 py-3 px-6 rounded-lg text-lg font-medium ${
              isAnyLoading ? "bg-gray-600 cursor-not-allowed" : "bg-red-500 hover:bg-red-600"
            } text-white transition-colors`}
          >
            Withdraw NFT
          </button>
        </div>
      ) : (
        // Show loan management options when loan is active
        <div className="space-y-4">
          <div className="text-sm text-gray-400 mb-2">
            <p>Loan Amount: {formatBigNumber(activeLoan.amount)} USDT</p>
            <p>Interest: {formatBigNumber(activeLoan.interest, 6)} USDT</p>
            <p>Total to Repay: {formatBigNumber(activeLoan.totalRepayment, 18)} USDT</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleRepay}
              disabled={isAnyLoading}
              className={`flex-1 py-3 px-6 rounded-xl text-lg font-medium transition-all duration-300 
                                ${
                                  isAnyLoading ? "bg-gray-600 cursor-not-allowed" : "bg-yellow-500 hover:bg-yellow-600"
                                } text-white transition-colors`}
            >
              {isAnyLoading ? "Processing..." : "Repay Loan"}
            </button>

            <button
              onClick={handleLiquidate}
              disabled={isAnyLoading}
              className={`flex-1 py-3 px-6 rounded-xl text-lg font-medium transition-all duration-300
                                ${
                                  isAnyLoading ? "bg-gray-600 cursor-not-allowed" : "bg-red-500 hover:bg-red-600"
                                } text-white transition-colors`}
            >
              Liquidate
            </button>
          </div>
        </div>
      )}

      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
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
    </div>
  )
}
