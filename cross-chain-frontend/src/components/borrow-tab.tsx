"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/Components/privy/ui/card"
import { Input } from "@/Components/privy/ui/input"
import { Label } from "@/Components/privy/ui/label"
import { Button } from "@/Components/privy/ui/button"
import { useAccount, useWriteContract } from "wagmi"
import { ERC721_ABI, NFT_LENDHUB_ABI } from "./lib/constants"
import { NFT_ADDRESS, NFT_LENDHUB_ADDRESS, WMON_ADDRESS } from "./lib/constants"
import { useToast } from "@/Components/privy/ui/use-toast"
import { usePrivy } from "@privy-io/react-auth"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/privy/ui/select"
import { parseAmount } from "./lib/utils"
import { Loader2 } from "lucide-react"
import { SelectNFTModal, NFT } from "./SelectNFTModal"


const BorrowTab = () => {
  const { address } = useAccount()
  const { toast } = useToast()
  const { authenticated, login } = usePrivy()

  const { writeContractAsync: approveNft } = useWriteContract()
  const { writeContractAsync: listNft } = useWriteContract()

  const [nftId, setNftId] = useState("")
  const [loanAmount, setLoanAmount] = useState("")
  const [interestRate, setInterestRate] = useState("5")
  const [loanDuration, setLoanDuration] = useState("7")
  const [loanToken, setLoanToken] = useState(WMON_ADDRESS)

  const [isApproving, setIsApproving] = useState(false)
  const [isListing, setIsListing] = useState(false)

  const [nftAddress, setNftAddress] = useState(NFT_ADDRESS)

  // ✅ Handle NFT Approval
  const handleApproveNft = async () => {
    if (!authenticated) {
      login()
      return
    }

    if (!nftId) {
      toast({ title: "Error", description: "Please enter a valid NFT ID", variant: "destructive" })
      return
    }

    try {
      setIsApproving(true)
      console.log("🔹 Approving NFT:", nftAddress, nftId)

      await approveNft({
        address: nftAddress as `0x${string}`,
        abi: ERC721_ABI,
        functionName: "approve",
        args: [NFT_LENDHUB_ADDRESS, BigInt(nftId)],
      })

      // Wait for transaction confirmation
    await new Promise((resolve) => setTimeout(resolve, 4000))

      toast({ title: "Success", description: "NFT approved for lending" })
    } catch (error) {
      console.error("❌ Error approving NFT:", error)
      toast({ title: "Error", description: "Failed to approve NFT", variant: "destructive" })
    } finally {
      setIsApproving(false)
    }
  }

  // ✅ Handle Listing NFT for Loan
  const handleListNft = async () => {
    if (!authenticated) {
      login()
      return
    }

    if (!nftId || !loanAmount || !interestRate || !loanDuration) {
      toast({ title: "Error", description: "Please fill in all fields", variant: "destructive" })
      return
    }

    try {
      setIsListing(true)
      console.log("🔹 Listing NFT for Loan:", nftAddress, nftId)

      await listNft({
        address: NFT_LENDHUB_ADDRESS,
        abi: NFT_LENDHUB_ABI,
        functionName: "listNFTForLoan",
        args: [
          nftAddress,
          BigInt(nftId),
          parseAmount(loanAmount),
          BigInt(interestRate),
          BigInt(Number.parseInt(loanDuration) * 86400), // Convert days to seconds
          loanToken,
        ],
      })

      // Wait for transaction confirmation
    await new Promise((resolve) => setTimeout(resolve, 4000))

      toast({ title: "Success", description: "NFT listed for loan" })

      // ✅ Reset form
      setNftId("")
      setLoanAmount("")
      setInterestRate("5")
      setLoanDuration("7")
      setLoanToken(WMON_ADDRESS)
    } catch (error) {
      console.error("❌ Error listing NFT:", error)
      toast({ title: "Error", description: "Failed to list NFT for loan", variant: "destructive" })
    } finally {
      setIsListing(false)
    }
  }

  const handleNFTSelect = (nft: NFT) => {
    setNftAddress(nft.contractAddress);
    setNftId(nft.tokenId);
  };
  

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="border border-monad-border bg-card">
        <CardHeader className="bg-gradient-to-r from-card to-card/90 py-3 px-4">
          <CardTitle className="text-base text-foreground">NFT Information</CardTitle>
          <CardDescription className="text-xs text-muted-foreground">Enter your NFT details</CardDescription>
        </CardHeader>

        {/* <CardContent className="grid gap-3 pt-3 px-4">
           <div className="space-y-1">
            <Label className="text-xs text-foreground">NFT Collection Address</Label>
            <Input
              placeholder="Enter NFT contract address"
              value={nftAddress}
              onChange={(e) => setNftAddress(e.target.value)}
              className="bg-muted border-monad-border focus:border-monad-500 focus:ring-monad-500/20 h-8 text-sm"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="nft-id" className="text-xs text-foreground">
              NFT ID
            </Label>
            <Input
              id="nft-id"
              placeholder="Enter NFT ID"
              value={nftId}
              onChange={(e) => setNftId(e.target.value)}
              className="bg-muted border-monad-border focus:border-monad-500 focus:ring-monad-500/20 h-8 text-sm"
            />
          </div> 
        </CardContent> */}

        <CardContent className="grid gap-3 pt-3 px-4">
          <div className="space-y-1">
             <Label className="text-xs text-foreground">Select NFT From Wallet</Label>
               <SelectNFTModal onSelect={handleNFTSelect} />
          </div>

         {nftId && nftAddress && (
            <div className="flex gap-4 items-center p-2 mt-2 rounded-md border border-monad-border bg-muted">
             <div className="flex-1 space-y-1 text-xs">
              <p className="font-semibold text-foreground">NFT ID: {nftId}</p>
              <p className="text-muted-foreground break-all text-[10px]">
                 Address: {nftAddress}
              </p>
            </div>
           </div>
          )}
       </CardContent>


        <CardFooter className="border-t border-monad-border pt-3 px-4 pb-4">
          <Button
            disabled={isApproving || isListing}
            onClick={handleApproveNft}
            className="w-full bg-monad-500 hover:bg-monad-600 text-white disabled:bg-muted disabled:text-muted-foreground h-8 text-sm"
          >
            {isApproving ? (
              <>
                <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                Approving...
              </>
            ) : (
              "Approve NFT"
            )}
          </Button>
        </CardFooter>
      </Card>

      <Card className="border border-monad-border bg-card">
        <CardHeader className="bg-gradient-to-r from-card to-card/90 py-3 px-4">
          <CardTitle className="text-base text-foreground">Loan Terms</CardTitle>
          <CardDescription className="text-xs text-muted-foreground">Specify your loan requirements</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 pt-3 px-4">
          <div className="space-y-1">
            <Label htmlFor="loan-amount" className="text-xs text-foreground">
              Loan Amount
            </Label>
            <Input
              id="loan-amount"
              placeholder="Enter loan amount"
              value={loanAmount}
              onChange={(e) => setLoanAmount(e.target.value)}
              className="bg-muted border-monad-border focus:border-monad-500 focus:ring-monad-500/20 h-8 text-sm"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="interest-rate" className="text-xs text-foreground">
              Interest Rate (%)
            </Label>
            <div className="grid grid-cols-4 gap-1">
              {["5", "10", "15", "20"].map((rate) => (
                <Button
                  key={rate}
                  type="button"
                  variant={interestRate === rate ? "default" : "outline"}
                  className={`h-7 text-xs px-1 ${
                    interestRate === rate
                      ? "bg-monad-500 hover:bg-monad-600 text-white"
                      : "border-monad-border hover:border-monad-500 hover:text-monad-500"
                  }`}
                  onClick={() => setInterestRate(rate)}
                >
                  {rate}%
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="loan-duration" className="text-xs text-foreground">
              Loan Duration
            </Label>
            <div className="grid grid-cols-4 gap-1">
              {[
                { value: "7", label: "7d" },
                { value: "14", label: "14d" },
                { value: "30", label: "30d" },
                { value: "60", label: "60d" },
              ].map((duration) => (
                <Button
                  key={duration.value}
                  type="button"
                  variant={loanDuration === duration.value ? "default" : "outline"}
                  className={`h-7 text-xs px-1 ${
                    loanDuration === duration.value
                      ? "bg-monad-500 hover:bg-monad-600 text-white"
                      : "border-monad-border hover:border-monad-500 hover:text-monad-500"
                  }`}
                  onClick={() => setLoanDuration(duration.value)}
                >
                  {duration.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-xs text-foreground">Loan Token</Label>
            <Select value={loanToken} onValueChange={setLoanToken}>
              <SelectTrigger className="bg-muted border-monad-border focus:ring-monad-500/20 h-8 text-sm">
                <SelectValue placeholder="Select token" />
              </SelectTrigger>
              <SelectContent className="bg-card border-monad-border">
                <SelectItem value={WMON_ADDRESS}>WMON</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter className="border-t border-monad-border pt-3 px-4 pb-4">
          <Button
            disabled={isApproving || isListing}
            onClick={handleListNft}
            className="w-full bg-monad-500 hover:bg-monad-600 text-white disabled:bg-muted disabled:text-muted-foreground h-8 text-sm"
          >
            {isListing ? (
              <>
                <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                Listing...
              </>
            ) : (
              "List NFT for Loan"
            )}
          </Button>
        </CardFooter>
      </Card>

      <Card className="md:col-span-2 border border-monad-border bg-card">
        <CardHeader className="py-3 px-4">
          <CardTitle className="text-base text-foreground">How It Works</CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <ol className="list-decimal list-inside space-y-1 text-xs text-muted-foreground">
            <li>Enter your NFT ID and approve the NFT for listing</li>
            <li>Specify your desired loan amount, interest rate, and duration</li>
            <li>List your NFT as collateral</li>
            <li>Once a lender funds your loan, you can claim the loan amount</li>
            <li>Repay the loan (principal + interest) before the due date to get your NFT back</li>
            <li>If you don't repay, the lender can claim your NFT after the grace period</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  )
}

export default BorrowTab





/////////////////////////////////////--------------------------------------------/////////////////////////
// "use client"

// import type React from "react"

// import { useState } from "react"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/Components/privy/ui/card"
// import { Input } from "@/Components/privy/ui/input"
// import { Label } from "@/Components/privy/ui/label"
// import { Button } from "@/Components/privy/ui/button"
// import { useAccount, useReadContract, useWriteContract } from "wagmi"
// import { ERC721_ABI, NFT_LENDHUB_ABI } from "./lib/constants"
// import { NFT_ADDRESS, NFT_LENDHUB_ADDRESS, WMON_ADDRESS } from "./lib/constants"
// import { useToast } from "@/Components/privy/ui/use-toast"
// import { loanExists } from "./lib/contract-utils"
// import { parseAmount } from "./lib/utils"
// import { usePrivy } from "@privy-io/react-auth"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/privy/ui/select"

// type BorrowTabProps = {}

// const BorrowTab: React.FC<BorrowTabProps> = () => {
//   const { address, isConnected } = useAccount()
//   const { toast } = useToast()
//   const { authenticated, login } = usePrivy()

//   const { writeContractAsync: approveNft } = useWriteContract()
//   const { writeContractAsync: listNft } = useWriteContract()

//   const [nftId, setNftId] = useState("")
//   const [loanAmount, setLoanAmount] = useState("")
//   const [interestRate, setInterestRate] = useState("5")
//   const [loanDuration, setLoanDuration] = useState("7")
//   const [loanToken, setLoanToken] = useState(WMON_ADDRESS)

//   const [isApproving, setIsApproving] = useState(false)
//   const [isListing, setIsListing] = useState(false)
//   const [isCheckingLoan, setIsCheckingLoan] = useState(false)
//   const [loanAlreadyExists, setLoanAlreadyExists] = useState(false)

//   // First, let's modify the component to allow custom NFT address input
//   // Add a new state for NFT address
//   const [nftAddress, setNftAddress] = useState(NFT_ADDRESS)

//   // Update the NFT owner check to use the custom NFT address and properly handle BigInt conversion
//   const { data: nftOwner } = useReadContract({
//     address: nftAddress as `0x${string}`,
//     abi: ERC721_ABI,
//     functionName: "ownerOf",
//     args: [nftId ? BigInt(nftId) : BigInt(0)],
//     // enabled: !!nftId && nftId !== "0" && !!nftAddress,
//   })

//   // Fix the isOwner check to properly compare addresses
//   const isOwner = address && nftOwner && address === nftOwner

//   // Update the checkLoanExists function to use the custom NFT address
//   const checkLoanExists = async () => {
//     if (!nftId || !nftAddress) return

//     setIsCheckingLoan(true)
//     try {
//       const exists = await loanExists(nftAddress, BigInt(nftId))
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

//   // Update the handleApproveNft function to use the custom NFT address
//   const handleApproveNft = async () => {
//     if (!authenticated) {
//       login()
//       return
//     }

//     if (!nftId || !nftAddress) {
//       toast({
//         title: "Error",
//         description: "Please enter a valid NFT ID and address",
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
//         address: nftAddress as `0x${string}`,
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

//   // Update the handleListNft function to use the custom NFT address
//   const handleListNft = async () => {
//     if (!authenticated) {
//       login()
//       return
//     }

//     if (!nftId || !nftAddress || !loanAmount || !interestRate || !loanDuration) {
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
//           nftAddress,
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
//     <Card>
//       <CardHeader>
//         <CardTitle>List NFT for Loan</CardTitle>
//         <CardDescription>List your NFT to request a loan.</CardDescription>
//       </CardHeader>
//       <CardContent className="grid gap-4">
//         {/* Now, let's update the UI to include an input field for the NFT address
//         Replace the hardcoded NFT Collection input with this: */}
//         <div className="space-y-2">
//           <Label>NFT Collection Address</Label>
//           <Input
//             placeholder="Enter NFT contract address"
//             value={nftAddress}
//             onChange={(e) => {
//               setNftAddress(e.target.value)
//               setLoanAlreadyExists(false)
//             }}
//           />
//         </div>

//         <div className="space-y-2">
//           <Label htmlFor="nft-id">NFT ID</Label>
//           <Input
//             id="nft-id"
//             placeholder="Enter NFT ID"
//             value={nftId}
//             onChange={(e) => {
//               setNftId(e.target.value)
//               setLoanAlreadyExists(false)
//             }}
//           />
//         </div>
//         <div className="space-y-2">
//           <Label htmlFor="loan-amount">Loan Amount</Label>
//           <Input
//             id="loan-amount"
//             placeholder="Enter loan amount"
//             value={loanAmount}
//             onChange={(e) => setLoanAmount(e.target.value)}
//           />
//         </div>
//         <div className="space-y-2">
//           <Label htmlFor="interest-rate">Interest Rate (%)</Label>
//           <Input
//             id="interest-rate"
//             placeholder="Enter interest rate"
//             value={interestRate}
//             onChange={(e) => setInterestRate(e.target.value)}
//           />
//         </div>
//         <div className="space-y-2">
//           <Label htmlFor="loan-duration">Loan Duration (Days)</Label>
//           <Input
//             id="loan-duration"
//             placeholder="Enter loan duration"
//             value={loanDuration}
//             onChange={(e) => setLoanDuration(e.target.value)}
//           />
//         </div>

//         <div className="space-y-2">
//           <Label>Loan Token</Label>
//           <Select value={loanToken} onValueChange={setLoanToken}>
//             <SelectTrigger className="w-[180px]">
//               <SelectValue placeholder="Select a loan token" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value={WMON_ADDRESS}>WMON</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>
//       </CardContent>
//       <CardFooter className="flex justify-between">
//         <Button disabled={isApproving || isListing || isCheckingLoan} onClick={handleApproveNft}>
//           {isApproving ? "Approving..." : "Approve NFT"}
//         </Button>
//         <Button disabled={isApproving || isListing || isCheckingLoan} onClick={handleListNft}>
//           {isListing ? "Listing..." : "List NFT"}
//         </Button>
//       </CardFooter>
//     </Card>
//   )
// }

// export default BorrowTab
///////////////////////----------------------------------//////////////////////////////
