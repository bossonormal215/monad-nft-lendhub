"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/Components/privy/ui/card"
import { usePrivy } from "@privy-io/react-auth"
import { useToast } from "@/Components/privy/ui/use-toast"
import { useAccount, useWriteContract } from "wagmi"
import { NFT_LENDHUB_ADDRESS, NFT_LENDHUB_ABI, ERC20_ABI } from "./lib/constants"
import { getPendingListings, type LoanData } from "./lib/contract-utils"
import { Loader2 } from "lucide-react"
import { NFTCard } from "@/components/nft-card"

export function LendTab() {
  const { authenticated, login } = usePrivy()
  const { address } = useAccount()
  const { toast } = useToast()
  const [pendingLoans, setPendingLoans] = useState<LoanData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFunding, setIsFunding] = useState(false)
  const [selectedLoanIndex, setSelectedLoanIndex] = useState<number | null>(null)

  const { writeContractAsync: approveToken } = useWriteContract()
  const { writeContractAsync: fundLoan } = useWriteContract()

  // Fetch pending loan listings from the blockchain
  useEffect(() => {
    const fetchLoans = async () => {
      setIsLoading(true)
      try {
        // Using the new utility function that leverages the enhanced contract
        const listings = await getPendingListings()
        setPendingLoans(listings)
      } catch (error) {
        console.error("Error fetching loans:", error)
        toast({
          title: "Error",
          description: "Failed to fetch available loans",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchLoans()
  }, [toast])

  const handleFundLoan = async (loan: LoanData, index: number) => {
    if (!authenticated) {
      login()
      return
    }

    try {
      setIsFunding(true)
      setSelectedLoanIndex(index)

      // First approve the token transfer
      await approveToken({
        address: loan.loanToken as `0x${string}`, // Use the loan token from the loan data
        abi: ERC20_ABI,
        functionName: "approve",
        args: [NFT_LENDHUB_ADDRESS, loan.loanAmount],
      })

      toast({
        title: "Success",
        description: "Token approval successful",
      })

      // Then fund the loan
      await fundLoan({
        address: NFT_LENDHUB_ADDRESS,
        abi: NFT_LENDHUB_ABI,
        functionName: "fundLoan",
        args: [loan.nftAddress, loan.nftId],
      })

      toast({
        title: "Success",
        description: "Loan funded successfully",
      })

      // Update the loan status in the UI
      const updatedLoans = [...pendingLoans]
      updatedLoans.splice(index, 1) // Remove the funded loan from the list
      setPendingLoans(updatedLoans)
    } catch (error) {
      console.error("Error funding loan:", error)
      toast({
        title: "Error",
        description: "Failed to fund loan",
        variant: "destructive",
      })
    } finally {
      setIsFunding(false)
      setSelectedLoanIndex(null)
    }
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">Lend to NFT Owners</h1>
        <p className="text-muted-foreground mt-2">
          Browse available NFT loan requests and earn interest by funding loans
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-monad-500" />
        </div>
      ) : pendingLoans.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <p>No active loan requests available at the moment.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {pendingLoans.map((loan, index) => {
            const isLenderForThisLoan = loan.lender?.toLowerCase() === address?.toLowerCase()

            let actionText = "Fund Loan"
            if (isLenderForThisLoan) {
              actionText = "You Funded This Loan"
            }

            return (
              <NFTCard
                key={`${loan.nftAddress}-${Number(loan.nftId)}`}
                nftId={Number(loan.nftId)}
                nftAddress={loan.nftAddress}
                nftOwner={loan.nftOwner}
                loanAmount={loan.loanAmount}
                interestRate={Number(loan.interestRate)}
                loanDuration={Number(loan.loanDuration)}
                startTime={Number(loan.startTime)}
                repaid={loan.repaid}
                lender={loan.lender}
                loanToken={loan.loanToken}
                active={loan.active}
                completed={loan.completed}
                onAction={() => handleFundLoan(loan, index)}
                actionText={actionText}
                actionDisabled={isLenderForThisLoan}
                isProcessing={isFunding && selectedLoanIndex === index}
                showLender={false}
              />
            )
          })}
        </div>
      )}

      <div className="mt-12">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4">How Lending Works</h3>
            <ol className="list-decimal list-inside space-y-2">
              <li>Browse available NFT loan requests</li>
              <li>Fund a loan by approving and transferring the requested amount</li>
              <li>If the borrower repays on time, you'll receive the principal plus interest</li>
              <li>If the borrower defaults, you can claim their NFT after the grace period</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

