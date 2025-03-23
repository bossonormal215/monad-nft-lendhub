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



/////////////////////////////----------------------------------------------------//////////////////////

// "use client"

// import { useState, useEffect } from "react"
// import { Button } from "@/Components/privy/ui/button"
// import { Card, CardContent } from "@/Components/privy/ui/card"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/privy/ui/tabs"
// import { usePrivy } from "@privy-io/react-auth"
// import { useToast } from "@/Components/privy/ui/use-toast"
// import { useAccount, useWriteContract } from "wagmi"
// import { NFT_LENDHUB_ADDRESS, NFT_LENDHUB_ABI, ERC20_ABI } from "./lib/constants"
// import { calculateRepaymentAmount } from "./lib/utils"
// import { getAllUserLoans, type LoanData } from "./lib/contract-utils"
// import { Loader2 } from "lucide-react"
// import { NFTCard } from "@/components/nft-card"

// export function DashboardTab() {
//   const { authenticated, login } = usePrivy()
//   const { address } = useAccount()
//   const { toast } = useToast()
//   const [isLoading, setIsLoading] = useState(true)
//   const [myBorrowings, setMyBorrowings] = useState<LoanData[]>([])
//   const [myLendings, setMyLendings] = useState<LoanData[]>([])
//   const [activeTab, setActiveTab] = useState("borrowings")
//   const [isProcessing, setIsProcessing] = useState(false)
//   const [processingLoanIndex, setProcessingLoanIndex] = useState<number | null>(null)

//   const { writeContractAsync: approveToken } = useWriteContract()
//   const { writeContractAsync: repayLoan } = useWriteContract()
//   const { writeContractAsync: claimLoan } = useWriteContract()
//   const { writeContractAsync: claimRepayment } = useWriteContract()
//   const { writeContractAsync: claimNFT } = useWriteContract()

//   useEffect(() => {
//     if (!authenticated || !address) {
//       return
//     }

//     const fetchUserLoans = async () => {
//       setIsLoading(true)
//       try {
//         console.log("Fetching loans for address:", address)
//         const { borrowings, lendings } = await getAllUserLoans(address)

//         setMyBorrowings([...borrowings])
//         setMyLendings([...lendings])
//       } catch (error) {
//         console.error("Error fetching user loans:", error)
//         toast({ title: "Error", description: "Failed to fetch your loans", variant: "destructive" })
//       } finally {
//         setIsLoading(false)
//       }
//     }

//     fetchUserLoans()
//     const interval = setInterval(fetchUserLoans, 300000)
//     return () => clearInterval(interval)
//   }, [authenticated, address])

//   const handleAction = async (loan: LoanData, index: number, action: string) => {
//     if (!authenticated) {
//       login()
//       return
//     }

//     try {
//       setIsProcessing(true)
//       setProcessingLoanIndex(index)

//       switch (action) {
//         case "claimLoan":
//           await claimLoan({
//             address: NFT_LENDHUB_ADDRESS,
//             abi: NFT_LENDHUB_ABI,
//             functionName: "claimLoan",
//             args: [loan.loanId],
//           })
//           break
//         case "repayLoan":
//           const repaymentAmount = calculateRepaymentAmount(loan.loanAmount, Number(loan.interestRate))
//           await approveToken({
//             address: loan.loanToken as `0x${string}`,
//             abi: ERC20_ABI,
//             functionName: "approve",
//             args: [NFT_LENDHUB_ADDRESS, repaymentAmount],
//           })
//           await repayLoan({
//             address: NFT_LENDHUB_ADDRESS,
//             abi: NFT_LENDHUB_ABI,
//             functionName: "repayLoan",
//             args: [loan.loanId],
//           })
//           break
//         case "claimRepayment":
//           await claimRepayment({
//             address: NFT_LENDHUB_ADDRESS,
//             abi: NFT_LENDHUB_ABI,
//             functionName: "claimRepayment",
//             args: [loan.loanId],
//           })
//           break
//         case "claimNFT":
//           await claimNFT({
//             address: NFT_LENDHUB_ADDRESS,
//             abi: NFT_LENDHUB_ABI,
//             functionName: "claimNFT",
//             args: [loan.loanId],
//           })
//           break
//       }

//       toast({ title: "Success", description: `${action} successful` })
//     } catch (error) {
//       console.error(`Error during ${action}:`, error)
//       toast({ title: "Error", description: `Failed to ${action}`, variant: "destructive" })
//     } finally {
//       setIsProcessing(false)
//       setProcessingLoanIndex(null)
//     }
//   }

//   return (
//     <div className="mx-auto max-w-6xl">
//       <div className="mb-8 text-center">
//         <h1 className="text-3xl font-bold text-foreground">Your Dashboard</h1>
//         <p className="text-muted-foreground mt-2">Manage your borrowings and lendings</p>
//       </div>

//       <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//         <TabsList className="grid w-full grid-cols-2 mb-8 bg-card border border-monad-border">
//           <TabsTrigger value="borrowings" className="data-[state=active]:bg-monad-500 data-[state=active]:text-white">
//             My Borrowings
//           </TabsTrigger>
//           <TabsTrigger value="lendings" className="data-[state=active]:bg-monad-500 data-[state=active]:text-white">
//             My Lendings
//           </TabsTrigger>
//         </TabsList>

//         <TabsContent value="borrowings">
//           {isLoading ? (
//             <div className="flex justify-center items-center py-12">
//               <Loader2 className="h-8 w-8 animate-spin text-monad-500" />
//             </div>
//           ) : myBorrowings.length === 0 ? (
//             <Card className="text-center py-12 border-monad-border bg-card">
//               <CardContent>
//                 <p className="text-foreground">You don't have any active borrowings.</p>
//                 <Button
//                   className="mt-4 bg-monad-500 hover:bg-monad-600 text-white"
//                   onClick={() => (window.location.href = "/borrow")}
//                 >
//                   Borrow Now
//                 </Button>
//               </CardContent>
//             </Card>
//           ) : (
//             <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//               {myBorrowings.map((loan, index) => {
//                 const isNotFunded = !loan.active
//                 const isRepaid = loan.repaid
//                 const isCompleted = loan.completed
//                 const isClaimed = loan.startTime > 0
//                 const isAwaitingClaim = loan.active && loan.startTime === BigInt(0)

//                 let actionText = "Waiting for Lender"
//                 let onAction = null
//                 let actionDisabled = true

//                 if (isCompleted === true) {
//                   actionText = "Loan Completed"
//                 } else if (isNotFunded) {
//                   actionText = "Waiting for Lender"
//                 } else if (isRepaid) {
//                   actionText = "Loan Repaid"
//                 } else if (!isNotFunded && loan.active && !isCompleted) {
//                   actionText = "Claim Loan"
//                   actionDisabled = false
//                 } else if (!isNotFunded && !isRepaid && !isCompleted && loan.active) {
//                   actionText = "Repay Loan"
//                   onAction = () => handleAction(loan, index, !loan.repaid ? "repayLoan" : "")
//                   actionDisabled = false
//                 } else {
//                 }

//                 return (
//                   <NFTCard
//                     key={loan.loanId}
//                     nftId={Number(loan.nftId)}
//                     nftAddress={loan.nftAddress}
//                     loanId={loan.loanId}
//                     nftOwner={loan.nftOwner}
//                     lender={loan.lender}
//                     loanToken={loan.loanToken}
//                     loanAmount={loan.loanAmount}
//                     interestRate={Number(loan.interestRate)}
//                     loanDuration={Number(loan.loanDuration)}
//                     startTime={Number(loan.startTime)}
//                     repaid={loan.repaid}
//                     active={loan.active}
//                     completed={loan.completed}
//                     onAction={() =>
//                       handleAction(
//                         loan,
//                         index,
//                         isClaimed && !isAwaitingClaim && !loan.completed && !loan.repaid ? "repayLoan" : "repayLoan", // repay met
//                         // isClaimed && !isAwaitingClaim && !loan.completed && !loan.repaid ? "claimLoan" : "claimLoan", // claim met
//                       )
//                     }
//                     actionText={actionText}
//                     actionDisabled={actionDisabled}
//                     isProcessing={isProcessing && processingLoanIndex === index}
//                     showLender={true}
//                   />
//                 )
//               })}
//             </div>
//           )}
//         </TabsContent>

//         <TabsContent value="lendings">
//           {isLoading ? (
//             <div className="flex justify-center items-center py-12">
//               <Loader2 className="h-8 w-8 animate-spin text-monad-500" />
//             </div>
//           ) : myLendings.length === 0 ? (
//             <Card className="text-center py-12 border-monad-border bg-card">
//               <CardContent>
//                 <p className="text-foreground">You don't have any active lendings.</p>
//                 <Button
//                   className="mt-4 bg-monad-500 hover:bg-monad-600 text-white"
//                   onClick={() => (window.location.href = "/lend")}
//                 >
//                   Lend Now
//                 </Button>
//               </CardContent>
//             </Card>
//           ) : (
//             <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//               {myLendings.map((loan, index) => {
//                 const now = Math.floor(Date.now() / 1000)
//                 const loanEnd = Number(loan.startTime) + Number(loan.loanDuration)
//                 const gracePeriodEnd = loanEnd + 7 * 86400 // 7 days grace period
//                 const canClaimNFT = !loan.repaid && now > gracePeriodEnd && !loan.completed
//                 const isCompleted = loan.completed

//                 let actionText = "Waiting for Repayment"
//                 let onAction = null
//                 let actionDisabled = true

//                 if (isCompleted) {
//                   actionText = "Loan Completed"
//                 } else if (loan.repaid && loan.active && !loan.completed) {
//                   actionText = "Claim Repayment"
//                   onAction = () => handleAction(loan, index, loan.repaid && !loan.completed ? "claimRepayment" : "")
//                   actionDisabled = false
//                 } else if (loan.repaid && loan.completed && !loan.active) {
//                   actionText = "Repayment Claimed"
//                 } else if (canClaimNFT) {
//                   actionText = "Claim NFT"
//                   onAction = () =>
//                     handleAction(loan, index, loan.repaid && !loan.completed && canClaimNFT ? "claimNFT" : "")
//                   actionDisabled = false
//                 } else if (canClaimNFT && loan.completed) {
//                   actionText = "NFT Claimed"
//                 }

//                 return (
//                   <NFTCard
//                     key={loan.loanId}
//                     nftId={Number(loan.nftId)}
//                     nftAddress={loan.nftAddress}
//                     loanId={loan.loanId}
//                     nftOwner={loan.nftOwner}
//                     lender={loan.lender}
//                     loanToken={loan.loanToken}
//                     loanAmount={loan.loanAmount}
//                     interestRate={Number(loan.interestRate)}
//                     loanDuration={Number(loan.loanDuration)}
//                     startTime={Number(loan.startTime)}
//                     repaid={loan.repaid}
//                     active={loan.active}
//                     completed={loan.completed}
//                     onAction={() =>
//                       handleAction(
//                         loan,
//                         index,
//                         loan.repaid && !loan.completed && !canClaimNFT ? "claimRepayment" : "claimNFT",
//                       )
//                     }
//                     actionText={actionText}
//                     actionDisabled={actionDisabled}
//                     isProcessing={isProcessing && processingLoanIndex === index}
//                     showLender={true}
//                   />
//                 )
//               })}
//             </div>
//           )}
//         </TabsContent>
//       </Tabs>
//     </div>
//   )
// }



/////////////////////////////////////-----------------------------------------------/////////////////////////////
// "use client"

// import { useState, useEffect } from "react"
// import { Button } from "@/Components/privy/ui/button"
// import { Card, CardContent } from "@/Components/privy/ui/card"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/privy/ui/tabs"
// import { usePrivy } from "@privy-io/react-auth"
// import { useToast } from "@/Components/privy/ui/use-toast"
// import { useAccount, useWriteContract } from "wagmi"
// import { NFT_LENDHUB_ADDRESS, NFT_LENDHUB_ABI, ERC20_ABI } from "./lib/constants"
// import { calculateRepaymentAmount } from "./lib/utils"
// import { getAllUserLoans, type LoanData } from "./lib/contract-utils"
// import { Loader2 } from "lucide-react"
// import { NFTCard } from "@/components/nft-card"
// import { WagmiConfig } from "@/providers/wagmi-provider"

// import { getLoanDetails } from "./lib/contract-utils";
// if (typeof window !== "undefined") {
//   (window as any).getLoanDetails = getLoanDetails;
// }


// export function DashboardTab() {
//   const { authenticated, login } = usePrivy()
//   const { address } = useAccount()
//   const { toast } = useToast()
//   const [isLoading, setIsLoading] = useState(true)
//   const [myBorrowings, setMyBorrowings] = useState<LoanData[]>([])
//   const [myLendings, setMyLendings] = useState<LoanData[]>([])
//   const [activeTab, setActiveTab] = useState("borrowings")
//   const [isProcessing, setIsProcessing] = useState(false)
//   const [processingLoanIndex, setProcessingLoanIndex] = useState<number | null>(null)

//   const { writeContractAsync: approveToken } = useWriteContract()
//   const { writeContractAsync: repayLoan } = useWriteContract()
//   const { writeContractAsync: claimLoan } = useWriteContract()
//   const { writeContractAsync: claimRepayment } = useWriteContract()
//   const { writeContractAsync: claimNFT } = useWriteContract()

//   useEffect(() => {
//     if (!authenticated || !address) {
//       return
//     }

//     const fetchUserLoans = async () => {
//       setIsLoading(true)
//       try {
//         console.log("Fetching loans for address:", address)
//         // Using the new utility function that leverages the enhanced contract
//         const { borrowings, lendings } = await getAllUserLoans(address)
//         // Filter borrowings to separate pending, active, and completed loans
//         const pendingBorrowings = borrowings.filter((loan) => !loan.active && !loan.completed)
//         const activeBorrowings = borrowings.filter((loan) => loan.active && !loan.repaid && !loan.completed)
//         const completedBorrowings = borrowings.filter((loan) => loan.completed)

//         console.log("Pending borrowings:", pendingBorrowings.length)
//         console.log("Active borrowings:", activeBorrowings.length)
//         console.log("Completed borrowings:", completedBorrowings.length)

//          // ✅ Force update to check lender field
//       borrowings.forEach((loan) => {
//         console.log("🔍 Checking loan:", loan.nftId, " Lender:", loan.lender);
//       });

//         // Combine all borrowings, prioritizing active loans
//         // setMyBorrowings([...activeBorrowings, ...pendingBorrowings, ...completedBorrowings])
//         setMyBorrowings([...borrowings]);
//         setMyLendings([...lendings]);

//         // Filter lendings to separate active and completed loans
//         const activeLendings = lendings.filter((loan) => loan.active && !loan.completed)
//         const completedLendings = lendings.filter((loan) => loan.completed )

//         console.log("Active lendings:", activeLendings.length)
//         console.log("Completed lendings:", completedLendings.length)

//         // Combine all lendings, prioritizing active loans
//         setMyLendings([...activeLendings, ...completedLendings])
//       } catch (error) {
//         console.error("Error fetching user loans:", error)
//         toast({
//           title: "Error",
//           description: "Failed to fetch your loans",
//           variant: "destructive",
//         })
//       } finally {
//         setIsLoading(false)
//       }
//     }

//     if (authenticated && address) {
//       fetchUserLoans();
//     }

//     fetchUserLoans()

//      // 🔄 Re-fetch loan details every 5 seconds
//     const interval = setInterval(fetchUserLoans, 300000);
//     return () => clearInterval(interval); // Clean up interval on unmount

//   }, [authenticated, address])

//   const handleClaimLoan = async (loan: LoanData, index: number) => {
//     if (!authenticated) {
//       login()
//       return
//     }

//     try {
//       setIsProcessing(true)
//       setProcessingLoanIndex(index)

//       await claimLoan({
//         address: NFT_LENDHUB_ADDRESS,
//         abi: NFT_LENDHUB_ABI,
//         functionName: "claimLoan",
//         args: [loan.nftAddress, loan.nftId],
//       })

//       toast({
//         title: "Success",
//         description: "Loan claimed successfully",
//       })

//       // Update the loan status in the UI
//       const updatedLoans = [...myBorrowings]
//       updatedLoans[index] = { ...updatedLoans[index], claimed: true }
//       setMyBorrowings(updatedLoans)
//     } catch (error) {
//       console.error("Error claiming loan:", error)
//       toast({
//         title: "Error",
//         description: "Failed to claim loan",
//         variant: "destructive",
//       })
//     } finally {
//       setIsProcessing(false)
//       setProcessingLoanIndex(null)
//     }
//   }

//   const handleRepayLoan = async (loan: LoanData, index: number) => {
//     if (!authenticated) {
//       login()
//       return
//     }

//     try {
//       setIsProcessing(true)
//       setProcessingLoanIndex(index)

//       const repaymentAmount = calculateRepaymentAmount(loan.loanAmount, Number(loan.interestRate))

//       // First approve the token transfer
//       await approveToken({
//         address: loan.loanToken as `0x${string}`, // Use the loan token from the loan data
//         abi: ERC20_ABI,
//         functionName: "approve",
//         args: [NFT_LENDHUB_ADDRESS, repaymentAmount],
//       })

//       toast({
//         title: "Success",
//         description: "Token approval successful",
//       })

//       // Then repay the loan
//       await repayLoan({
//         address: NFT_LENDHUB_ADDRESS,
//         abi: NFT_LENDHUB_ABI,
//         functionName: "repayLoan",
//         args: [loan.nftAddress, loan.nftId],
//       })

//       toast({
//         title: "Success",
//         description: "Loan repaid successfully. Your NFT has been returned to your wallet.",
//       })

//       // Update the loan status in the UI
//       const updatedLoans = [...myBorrowings]
//       updatedLoans[index] = {
//         ...updatedLoans[index],
//         repaid: true,
//         completed: true,
//       }
//       setMyBorrowings(updatedLoans)
//     } catch (error) {
//       console.error("Error repaying loan:", error)
//       toast({
//         title: "Error",
//         description: "Failed to repay loan",
//         variant: "destructive",
//       })
//     } finally {
//       setIsProcessing(false)
//       setProcessingLoanIndex(null)
//     }
//   }

//   const handleClaimRepayment = async (loan: LoanData, index: number) => {
//     if (!authenticated) {
//       login()
//       return
//     }

//     try {
//       setIsProcessing(true)
//       setProcessingLoanIndex(index)

//       await claimRepayment({
//         address: NFT_LENDHUB_ADDRESS,
//         abi: NFT_LENDHUB_ABI,
//         functionName: "claimRepayment",
//         args: [loan.nftAddress, loan.nftId],
//       })

//       toast({
//         title: "Success",
//         description: "Repayment claimed successfully",
//       })

//       // Update the loan status in the UI
//       const updatedLoans = [...myLendings]
//       updatedLoans[index] = {
//         ...updatedLoans[index],
//         repaymentClaimed: true,
//       }
//       setMyLendings(updatedLoans)
//     } catch (error) {
//       console.error("Error claiming repayment:", error)
//       toast({
//         title: "Error",
//         description: "Failed to claim repayment",
//         variant: "destructive",
//       })
//     } finally {
//       setIsProcessing(false)
//       setProcessingLoanIndex(null)
//     }
//   }

//   const handleClaimNFT = async (loan: LoanData, index: number) => {
//     if (!authenticated) {
//       login()
//       return
//     }

//     try {
//       setIsProcessing(true)
//       setProcessingLoanIndex(index)

//       await claimNFT({
//         address: NFT_LENDHUB_ADDRESS,
//         abi: NFT_LENDHUB_ABI,
//         functionName: "claimNFT",
//         args: [loan.nftAddress, loan.nftId],
//       })

//       toast({
//         title: "Success",
//         description: "NFT claimed successfully",
//       })

//       // Update the loan status in the UI
//       const updatedLoans = [...myLendings]
//       updatedLoans[index] = {
//         ...updatedLoans[index],
//         nftClaimed: true,
//         completed: true,
//       }
//       setMyLendings(updatedLoans)
//     } catch (error) {
//       console.error("Error claiming NFT:", error)
//       toast({
//         title: "Error",
//         description: "Failed to claim NFT",
//         variant: "destructive",
//       })
//     } finally {
//       setIsProcessing(false)
//       setProcessingLoanIndex(null)
//     }
//   }

//   if (!authenticated) {
//     return (
//       <div className="mx-auto max-w-md">
//         <Card className="w-full">
//           <CardContent className="pt-6 pb-6 text-center">
//             <h2 className="text-xl font-semibold mb-4">Connect Wallet</h2>
//             <p className="text-muted-foreground mb-6">Please connect your wallet to view your dashboard</p>
//             <Button onClick={() => login()} className="w-full bg-monad-500 hover:bg-monad-600">
//               Connect Wallet
//             </Button>
//           </CardContent>
//         </Card>
//       </div>
//     )
//   }

//   return (
//     <div className="mx-auto max-w-6xl">
//       <div className="mb-8 text-center">
//         <h1 className="text-3xl font-bold">Your Dashboard</h1>
//         <p className="text-muted-foreground mt-2">Manage your borrowings and lendings</p>
//       </div>

//       <Tabs value={activeTab} onValueChange={setActiveTab}>
//         <TabsList className="grid w-full grid-cols-2 mb-8">
//           <TabsTrigger value="borrowings">My Borrowings</TabsTrigger>
//           <TabsTrigger value="lendings">My Lendings</TabsTrigger>
//         </TabsList>

//         <TabsContent value="borrowings">
//           {isLoading ? (
//             <div className="flex justify-center items-center py-12">
//               <Loader2 className="h-8 w-8 animate-spin text-monad-500" />
//             </div>
//           ) : myBorrowings.length === 0 ? (
//             <Card className="text-center py-12">
//               <CardContent>
//                 <p>You don't have any active borrowings.</p>
//                 <Button
//                   className="mt-4 bg-monad-500 hover:bg-monad-600"
//                   onClick={() => (window.location.href = "/borrow")}
//                 >
//                   Borrow Now
//                 </Button>
//               </CardContent>
//             </Card>
//           ) : (
//             <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//               {myBorrowings.map((loan, index) => {
//                 console.log('Loan Data: ',loan)
//                 const isNotFunded = !loan.active
//                 const isRepaid = loan.repaid
//                 const isCompleted = loan.completed

//                 let actionText = "Waiting for Lender"
//                 let onAction = null
//                 let actionDisabled = true

//                 if (isCompleted === true) {
//                   actionText = "Loan Completed"
//                 } else if (isNotFunded) {
//                   actionText = "Waiting for Lender"
//                 } else if (isRepaid) {
//                   actionText = "Loan Repaid"
//                 } else if ( isNotFunded && !loan.claimed && !isCompleted) {
//                   actionText = "Claim Loan"
//                   onAction = () => handleClaimLoan(loan, index)
//                   actionDisabled = false
//                 } else if (!isNotFunded && !isRepaid && !isCompleted) {
//                   actionText = "Repay Loan"
//                   onAction = () => handleRepayLoan(loan, index)
//                   actionDisabled = false
//                 } else {}

//                 return (
//                   <NFTCard
//                     // key={`borrowing-${loan.nftAddress}-${Number(loan.nftId)}`}
//                     key={`borrowing-${loan.nftAddress}-${Number(loan.nftId)}-${index}`}
//                     nftId={Number(loan.nftId)}
//                     nftAddress={loan.nftAddress}
//                     nftOwner={loan.nftOwner}
//                     loanAmount={loan.loanAmount}
//                     interestRate={Number(loan.interestRate)}
//                     loanDuration={Number(loan.loanDuration)}
//                     startTime={Number(loan.startTime)}
//                     repaid={loan.repaid}
//                     lender={loan.lender}
//                     loanToken={loan.loanToken}
//                     active={loan.active}
//                     completed={loan.completed}
//                     onAction={onAction ? () => onAction!() : undefined}
//                     actionText={actionText}
//                     actionDisabled={actionDisabled}
//                     isProcessing={isProcessing && processingLoanIndex === index}
//                     showLender={true}
//                   />
//                 )
//               })}
//             </div>
//           )}
//         </TabsContent>

//         <TabsContent value="lendings">
//           {isLoading ? (
//             <div className="flex justify-center items-center py-12">
//               <Loader2 className="h-8 w-8 animate-spin text-monad-500" />
//             </div>
//           ) : myLendings.length === 0 ? (
//             <Card className="text-center py-12">
//               <CardContent>
//                 <p>You don't have any active lendings.</p>
//                 <Button
//                   className="mt-4 bg-monad-500 hover:bg-monad-600"
//                   onClick={() => (window.location.href = "/lend")}
//                 >
//                   Lend Now
//                 </Button>
//               </CardContent>
//             </Card>
//           ) : (
//             <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//               {myLendings.map((loan, index) => {
//                 const now = Math.floor(Date.now() / 1000)
//                 const loanEnd = Number(loan.startTime) + Number(loan.loanDuration)
//                 const gracePeriodEnd = loanEnd + 7 * 86400 // 7 days grace period
//                 const canClaimNFT = !loan.repaid && now > gracePeriodEnd && !loan.completed
//                 const isCompleted = loan.completed

//                 let actionText = "Waiting for Repayment"
//                 let onAction = null
//                 let actionDisabled = true

//                 if (isCompleted) {
//                   actionText = "Loan Completed"
//                 } else if (loan.repaid && !loan.repaymentClaimed) {
//                   actionText = "Claim Repayment"
//                   onAction = () => handleClaimRepayment(loan, index)
//                   actionDisabled = false
//                 } else if (loan.repaid && loan.repaymentClaimed) {
//                   actionText = "Repayment Claimed"
//                 } else if (canClaimNFT) {
//                   actionText = "Claim NFT"
//                   onAction = () => handleClaimNFT(loan, index)
//                   actionDisabled = false
//                 } else if (loan.nftClaimed) {
//                   actionText = "NFT Claimed"
//                 }

//                 return (
//                   <NFTCard
//                     key={`lending-${loan.nftAddress}-${Number(loan.nftId)}`}
//                     nftId={Number(loan.nftId)}
//                     nftAddress={loan.nftAddress}
//                     nftOwner={loan.nftOwner}
//                     loanAmount={loan.loanAmount}
//                     interestRate={Number(loan.interestRate)}
//                     loanDuration={Number(loan.loanDuration)}
//                     startTime={Number(loan.startTime)}
//                     repaid={loan.repaid}
//                     lender={loan.lender}
//                     loanToken={loan.loanToken}
//                     active={loan.active}
//                     completed={loan.completed}
//                     onAction={onAction ? () => onAction!() : undefined}
//                     actionText={actionText}
//                     actionDisabled={actionDisabled}
//                     isProcessing={isProcessing && processingLoanIndex === index}
//                     showLender={false}
//                   />
//                 )
//               })}
//             </div>
//           )}
//         </TabsContent>
//       </Tabs>
//     </div>
//   )
// }
///////////////////////----------------------------////////////////////////////////////////////