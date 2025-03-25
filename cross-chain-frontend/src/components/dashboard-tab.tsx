"use client"

import { useState, useEffect } from "react"
import { Button } from "@/Components/privy/ui/button"
import { Card, CardContent } from "@/Components/privy/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/privy/ui/tabs"
import { usePrivy } from "@privy-io/react-auth"
import { useToast } from "@/Components/privy/ui/use-toast"
import { useAccount, useWriteContract } from "wagmi"
import { NFT_LENDHUB_ADDRESS, NFT_LENDHUB_ABI, ERC20_ABI } from "./lib/constants"
import { calculateRepaymentAmount } from "./lib/utils"
import { getAllUserLoans, type LoanData } from "./lib/contract-utils"
import { Loader2 } from "lucide-react"
import { NFTCard } from "@/components/nft-card"

export function DashboardTab() {
  const { authenticated, login } = usePrivy()
  const { address } = useAccount()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [myBorrowings, setMyBorrowings] = useState<LoanData[]>([])
  const [myLendings, setMyLendings] = useState<LoanData[]>([])
  const [activeTab, setActiveTab] = useState("borrowings")
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingLoanIndex, setProcessingLoanIndex] = useState<number | null>(null)

  const { writeContractAsync: approveToken } = useWriteContract()
  const { writeContractAsync: repayLoan } = useWriteContract()
  const { writeContractAsync: claimLoan } = useWriteContract()
  const { writeContractAsync: claimRepayment } = useWriteContract()
  const { writeContractAsync: claimNFT } = useWriteContract()

  useEffect(() => {
    if (!authenticated || !address) {
      return
    }

    const fetchUserLoans = async () => {
      setIsLoading(true)
      try {
        console.log("Fetching loans for address:", address)
        const { borrowings, lendings } = await getAllUserLoans(address)

        setMyBorrowings([...borrowings])
        setMyLendings([...lendings])
      } catch (error) {
        console.error("Error fetching user loans:", error)
        toast({ title: "Error", description: "Failed to fetch your loans", variant: "destructive" })
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserLoans()
    const interval = setInterval(fetchUserLoans, 300000)
    return () => clearInterval(interval)
  }, [authenticated, address])

  const handleAction = async (loan: LoanData, index: number, action: string) => {
    if (!authenticated) {
      login()
      return
    }

    try {
      setIsProcessing(true)
      setProcessingLoanIndex(index)

      switch (action) {
        case "claimLoan":
          await claimLoan({
            address: NFT_LENDHUB_ADDRESS,
            abi: NFT_LENDHUB_ABI,
            functionName: "claimLoan",
            args: [loan.loanId],
          })
          break
        case "repayLoan":
          const repaymentAmount = calculateRepaymentAmount(loan.loanAmount, Number(loan.interestRate))
          await approveToken({
            address: loan.loanToken as `0x${string}`,
            abi: ERC20_ABI,
            functionName: "approve",
            args: [NFT_LENDHUB_ADDRESS, repaymentAmount],
          })
          await repayLoan({
            address: NFT_LENDHUB_ADDRESS,
            abi: NFT_LENDHUB_ABI,
            functionName: "repayLoan",
            args: [loan.loanId],
          })
          break
        case "claimRepayment":
          await claimRepayment({
            address: NFT_LENDHUB_ADDRESS,
            abi: NFT_LENDHUB_ABI,
            functionName: "claimRepayment",
            args: [loan.loanId],
          })
          break
        case "claimNFT":
          await claimNFT({
            address: NFT_LENDHUB_ADDRESS,
            abi: NFT_LENDHUB_ABI,
            functionName: "claimNFT",
            args: [loan.loanId],
          })
          break
      }
      // Wait for transaction confirmation
    await new Promise((resolve) => setTimeout(resolve, 4000))

      toast({ title: "Success", description: `${action} successful` })
    } catch (error) {
      console.error(`Error during ${action}:`, error)
      toast({ title: "Error", description: `Failed to ${action}`, variant: "destructive" })
    } finally {
      setIsProcessing(false)
      setProcessingLoanIndex(null)
    }
  }

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-foreground">Loan Dashboard</h1>
        <p className="text-muted-foreground mt-2">Manage your borrowings and lendings</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8 bg-card border border-monad-border">
          <TabsTrigger value="borrowings" className="data-[state=active]:bg-monad-500 data-[state=active]:text-white">
            My Borrowings
          </TabsTrigger>
          <TabsTrigger value="lendings" className="data-[state=active]:bg-monad-500 data-[state=active]:text-white">
            My Lendings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="borrowings">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-monad-500" />
            </div>
          ) : myBorrowings.length === 0 ? (
            <Card className="text-center py-12 border-monad-border bg-card">
              <CardContent>
                <p className="text-foreground">You don't have any active borrowings.</p>
                <Button
                  className="mt-4 bg-monad-500 hover:bg-monad-600 text-white"
                  onClick={() => (window.location.href = "/borrow")}
                >
                  Borrow Now
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {myBorrowings.map((loan, index) => {
                const isNotFunded = !loan.active
                const isLoanClaimed = loan.loanClaimed
                const isRepaid = loan.repaid
                const isCompleted = loan.completed
                const isClaimed = loan.startTime > 0
                const isAwaitingClaim = loan.active && loan.startTime === BigInt(0)

                let actionText = "Waiting for a Lender"
                let onAction = null
                let actionDisabled = true

                if (isCompleted === true) {
                  actionText = "Loan Completed"
                } else if (isNotFunded) {
                  actionText = "Waiting for a Lender"
                } else if (isRepaid) {
                  actionText = "Loan Repaid"
                } else if ( !isLoanClaimed && loan.active && !isCompleted) {
                  actionText = "Claim Loan"
                  actionDisabled = false
                } else if (isLoanClaimed  &&  !isRepaid && !isCompleted && loan.active) {
                  actionText = "Repay Loan"
                  onAction = () => handleAction(loan, index, !loan.repaid ? "repayLoan" : "")
                  actionDisabled = false
                } else {
                }

                return (
                  <NFTCard
                    key={loan.loanId}
                    nftId={Number(loan.nftId)}
                    nftAddress={loan.nftAddress}
                    loanId={loan.loanId}
                    nftOwner={loan.nftOwner}
                    lender={loan.lender}
                    loanToken={loan.loanToken}
                    loanAmount={loan.loanAmount}
                    interestRate={Number(loan.interestRate)}
                    loanDuration={Number(loan.loanDuration)}
                    startTime={Number(loan.startTime)}
                    loanClaimed={loan.loanClaimed}
                    repaid={loan.repaid}
                    active={loan.active}
                    completed={loan.completed}
                    onAction={() =>
                      handleAction(
                        loan,
                        index,
                        // isClaimed && !isAwaitingClaim && !loan.completed && !loan.repaid ? "claimLoan" : "claimLoan", // claim met
                        isLoanClaimed && !loan.completed && !loan.repaid ? "repayLoan" : "claimLoan" // repay met
                      )
                    }
                    actionText={actionText}
                    actionDisabled={actionDisabled}
                    isProcessing={isProcessing && processingLoanIndex === index}
                    showLender={true}
                  />
                )
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="lendings">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-monad-500" />
            </div>
          ) : myLendings.length === 0 ? (
            <Card className="text-center py-12 border-monad-border bg-card">
              <CardContent>
                <p className="text-foreground">You don't have any active lendings.</p>
                <Button
                  className="mt-4 bg-monad-500 hover:bg-monad-600 text-white"
                  onClick={() => (window.location.href = "/lend")}
                >
                  Lend Now
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {myLendings.map((loan, index) => {
                const now = Math.floor(Date.now() / 1000)
                const loanEnd = Number(loan.startTime) + Number(loan.loanDuration)
                const gracePeriodEnd = loanEnd + 7 * 86400 // 7 days grace period
                const canClaimNFT = !loan.repaid && now > gracePeriodEnd && !loan.completed
                const isCompleted = loan.completed

                let actionText = "Waiting for Repayment"
                let onAction = null
                let actionDisabled = true

                if (isCompleted) {
                  actionText = "Loan Completed"
                } else if (loan.repaid && loan.active && !loan.completed) {
                  actionText = "Claim Repayment"
                  onAction = () => handleAction(loan, index, loan.repaid && !loan.completed ? "claimRepayment" : "")
                  actionDisabled = false
                } else if (loan.repaid && loan.completed && !loan.active) {
                  actionText = "Repayment Claimed"
                } else if (canClaimNFT) {
                  actionText = "Claim NFT"
                  onAction = () =>
                    handleAction(loan, index, loan.repaid && !loan.completed && canClaimNFT ? "claimNFT" : "")
                  actionDisabled = false
                } else if (canClaimNFT && loan.completed) {
                  actionText = "NFT Claimed"
                }

                return (
                  <NFTCard
                    key={loan.loanId}
                    nftId={Number(loan.nftId)}
                    nftAddress={loan.nftAddress}
                    loanId={loan.loanId}
                    nftOwner={loan.nftOwner}
                    lender={loan.lender}
                    loanToken={loan.loanToken}
                    loanAmount={loan.loanAmount}
                    interestRate={Number(loan.interestRate)}
                    loanDuration={Number(loan.loanDuration)}
                    startTime={Number(loan.startTime)}
                    repaid={loan.repaid}
                    active={loan.active}
                    completed={loan.completed}
                    onAction={() =>
                      handleAction(
                        loan,
                        index,
                        loan.repaid && !loan.completed && !canClaimNFT ? "claimRepayment" : "claimNFT",
                      )
                    }
                    actionText={actionText}
                    actionDisabled={actionDisabled}
                    isProcessing={isProcessing && processingLoanIndex === index}
                    showLender={false}
                  />
                )
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
