// "use client"

// import { useState } from "react"
// import { Button } from "@/Components/privy/ui/button"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/Components/privy/ui/card"
// import { Input } from "@/Components/privy/ui/input"
// import { Label } from "@/Components/privy/ui/label"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/privy/ui/select"
// import { usePrivy } from "@privy-io/react-auth"
// import { useToast } from "@/Components/privy/ui/use-toast"
// import { useAccount, useReadContract, useWriteContract } from "wagmi"
// import {
//   NFT_LENDHUB_ADDRESS,
//   NFT_LENDHUB_ABI,
//   ERC721_ABI,
//   NFT_ADDRESS,
//   WMON_ADDRESS,
//   USDT_ADDRESS,
//   ETH_ADDRESS,
// } from "./lib/constants"
// import { parseAmount } from "./lib/utils"
// import { Loader2 } from "lucide-react"
// import { loanExists } from "./lib/contract-utils"

// export function BorrowTab() {
//   const { authenticated, login } = usePrivy()
//   const { address } = useAccount()
//   const { toast } = useToast()
//   const [nftId, setNftId] = useState("")
//   const [loanAmount, setLoanAmount] = useState("")
//   const [interestRate, setInterestRate] = useState("5")
//   const [loanDuration, setLoanDuration] = useState("7")
//   const [loanToken, setLoanToken] = useState(WMON_ADDRESS)
//   const [isApproving, setIsApproving] = useState(false)
//   const [isListing, setIsListing] = useState(false)
//   const [isCheckingLoan, setIsCheckingLoan] = useState(false)
//   const [loanAlreadyExists, setLoanAlreadyExists] = useState(false)

//   const { data: nftOwner } = useReadContract({
//     address: NFT_ADDRESS,
//     abi: ERC721_ABI,
//     functionName: "ownerOf",
//     args: [BigInt(nftId || "0")],
//     // enabled: !!nftId && nftId !== "0",
//   })

//   const isOwner = address && nftOwner && address.toLowerCase() === nftOwner

//   const { writeContractAsync: approveNft } = useWriteContract()
//   const { writeContractAsync: listNft } = useWriteContract()

//   // Check if the NFT is already listed for a loan
//   const checkLoanExists = async () => {
//     if (!nftId) return

//     setIsCheckingLoan(true)
//     try {
//       const exists = await loanExists(NFT_ADDRESS, BigInt(nftId))
//       setLoanAlreadyExists(exists)

//       if (exists) {
//         toast({
//           title: "NFT Already Listed",
//           description: "This NFT is already listed for a loan",
//           variant: "destructive",
//         })
//       }
//     } catch (error) {
//       console.error("Error checking loan existence:", error)
//     } finally {
//       setIsCheckingLoan(false)
//     }
//   }

//   const handleApproveNft = async () => {
//     if (!authenticated) {
//       login()
//       return
//     }

//     if (!nftId) {
//       toast({
//         title: "Error",
//         description: "Please enter a valid NFT ID",
//         variant: "destructive",
//       })
//       return
//     }

//     if (!isOwner) {
//       toast({
//         title: "Error",
//         description: "You don't own this NFT",
//         variant: "destructive",
//       })
//       return
//     }

//     // Check if the NFT is already listed
//     await checkLoanExists()
//     if (loanAlreadyExists) {
//       return
//     }

//     try {
//       setIsApproving(true)
//       await approveNft({
//         address: NFT_ADDRESS,
//         abi: ERC721_ABI,
//         functionName: "approve",
//         args: [NFT_LENDHUB_ADDRESS, BigInt(nftId)],
//       })

//       toast({
//         title: "Success",
//         description: "NFT approved for listing",
//       })
//     } catch (error) {
//       console.error("Error approving NFT:", error)
//       toast({
//         title: "Error",
//         description: "Failed to approve NFT",
//         variant: "destructive",
//       })
//     } finally {
//       setIsApproving(false)
//     }
//   }

//   const handleListNft = async () => {
//     if (!authenticated) {
//       login()
//       return
//     }

//     if (!nftId || !loanAmount || !interestRate || !loanDuration) {
//       toast({
//         title: "Error",
//         description: "Please fill in all fields",
//         variant: "destructive",
//       })
//       return
//     }

//     if (!isOwner) {
//       toast({
//         title: "Error",
//         description: "You don't own this NFT",
//         variant: "destructive",
//       })
//       return
//     }

//     // Check if the NFT is already listed
//     await checkLoanExists()
//     if (loanAlreadyExists) {
//       return
//     }

//     try {
//       setIsListing(true)
//       await listNft({
//         address: NFT_LENDHUB_ADDRESS,
//         abi: NFT_LENDHUB_ABI,
//         functionName: "listNFTForLoan",
//         args: [
//           NFT_ADDRESS,
//           BigInt(nftId),
//           parseAmount(loanAmount),
//           BigInt(interestRate),
//           BigInt(Number.parseInt(loanDuration) * 86400), // Convert days to seconds
//           loanToken,
//         ],
//       })

//       toast({
//         title: "Success",
//         description: "NFT listed for loan",
//       })

//       // Reset form
//       setNftId("")
//       setLoanAmount("")
//       setInterestRate("5")
//       setLoanDuration("7")
//       setLoanToken(WMON_ADDRESS)
//       setLoanAlreadyExists(false)
//     } catch (error) {
//       console.error("Error listing NFT:", error)
//       toast({
//         title: "Error",
//         description: "Failed to list NFT for loan",
//         variant: "destructive",
//       })
//     } finally {
//       setIsListing(false)
//     }
//   }

//   return (
//     <div className="mx-auto max-w-4xl">
//       <div className="mb-8 text-center">
//         <h1 className="text-3xl font-bold">Borrow Against Your NFT</h1>
//         <p className="text-muted-foreground mt-2">List your NFT as collateral and get a loan in your preferred token</p>
//       </div>

//       <div className="grid gap-8 md:grid-cols-2">
//         <Card>
//           <CardHeader>
//             <CardTitle>NFT Information</CardTitle>
//             <CardDescription>Enter the details of the NFT you want to use as collateral</CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="nft-id">NFT ID</Label>
//               <div className="flex gap-2">
//                 <Input
//                   id="nft-id"
//                   placeholder="Enter your NFT ID"
//                   value={nftId}
//                   onChange={(e) => {
//                     setNftId(e.target.value)
//                     setLoanAlreadyExists(false)
//                   }}
//                 />
//                 <Button variant="outline" onClick={checkLoanExists} disabled={!nftId || isCheckingLoan}>
//                   {isCheckingLoan ? <Loader2 className="h-4 w-4 animate-spin" /> : "Check"}
//                 </Button>
//               </div>
//               {loanAlreadyExists && <p className="text-sm text-destructive">This NFT is already listed for a loan</p>}
//             </div>
//             <div className="space-y-2">
//               <Label>NFT Collection</Label>
//               <Input value="Dmon NFT Collection" disabled />
//             </div>
//             {nftId && (
//               <div className="pt-2">
//                 <p className="text-sm">Owner: {isOwner ? "You own this NFT" : "You don't own this NFT"}</p>
//               </div>
//             )}
//           </CardContent>
//           <CardFooter>
//             <Button
//               onClick={handleApproveNft}
//               disabled={!isOwner || isApproving || loanAlreadyExists}
//               className="w-full bg-monad-500 hover:bg-monad-600"
//             >
//               {isApproving ? (
//                 <>
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                   Approving...
//                 </>
//               ) : (
//                 "Approve NFT"
//               )}
//             </Button>
//           </CardFooter>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle>Loan Terms</CardTitle>
//             <CardDescription>Specify the terms for your loan</CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="loan-amount">Loan Amount</Label>
//               <Input
//                 id="loan-amount"
//                 placeholder="e.g. 1.5"
//                 value={loanAmount}
//                 onChange={(e) => setLoanAmount(e.target.value)}
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="loan-token">Loan Token</Label>
//               <Select value={loanToken} onValueChange={setLoanToken}>
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select loan token" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value={WMON_ADDRESS}>wMON</SelectItem>
//                   <SelectItem value={USDT_ADDRESS}>USDT</SelectItem>
//                   <SelectItem value={ETH_ADDRESS}>ETH</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="interest-rate">Interest Rate (%)</Label>
//               <Select value={interestRate} onValueChange={setInterestRate}>
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select interest rate" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="5">5%</SelectItem>
//                   <SelectItem value="10">10%</SelectItem>
//                   <SelectItem value="15">15%</SelectItem>
//                   <SelectItem value="20">20%</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="loan-duration">Loan Duration (Days)</Label>
//               <Select value={loanDuration} onValueChange={setLoanDuration}>
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select loan duration" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="7">7 days</SelectItem>
//                   <SelectItem value="14">14 days</SelectItem>
//                   <SelectItem value="30">30 days</SelectItem>
//                   <SelectItem value="60">60 days</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//           </CardContent>
//           <CardFooter>
//             <Button
//               onClick={handleListNft}
//               disabled={!isOwner || isListing || loanAlreadyExists}
//               className="w-full bg-monad-500 hover:bg-monad-600"
//             >
//               {isListing ? (
//                 <>
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                   Listing NFT...
//                 </>
//               ) : (
//                 "List NFT for Loan"
//               )}
//             </Button>
//           </CardFooter>
//         </Card>
//       </div>

//       <div className="mt-8">
//         <Card>
//           <CardHeader>
//             <CardTitle>How It Works</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <ol className="list-decimal list-inside space-y-2">
//               <li>Enter your NFT ID and approve the NFT for listing</li>
//               <li>Specify your desired loan amount, interest rate, and duration</li>
//               <li>List your NFT as collateral</li>
//               <li>Once a lender funds your loan, you can claim the loan amount</li>
//               <li>Repay the loan (principal + interest) before the due date to get your NFT back</li>
//               <li>If you don't repay, the lender can claim your NFT after the grace period</li>
//             </ol>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   )
// }

