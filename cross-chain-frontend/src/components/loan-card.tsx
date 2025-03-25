// "use client"

// import { JSX, useEffect, useState } from "react"
// import { Card } from "@/Components/privy/ui/card"
// import { Button } from "@/Components/privy/ui/button"
// import { Badge } from "@/Components/privy/ui/badge"
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/Components/privy/ui/dropdown-menu"
// import { ChevronDownIcon } from "@heroicons/react/24/outline"
// import { formatDistanceToNow } from "date-fns"
// import { formatEther } from "viem"
// import { Loader2 } from "lucide-react"
// import Image from "next/image"
// import { fetchNFTMetadata } from "./lib/fetchUserNfts"

// interface LoanCardProps {
//   nftId: number
//   nftAddress: string
//   nftOwner: string
//   loanAmount: bigint
//   interestRate: number
//   loanDuration: number
//   startTime: number
//   repaid: boolean
//   lender: string
//   loanToken: string
//   active: boolean
//   completed: boolean
//   claimed?: boolean
//   repaymentClaimed?: boolean
//   nftClaimed?: boolean
//   imageUrl?: string;
//   onRepay?: () => void
//   onClaim?: () => void
//   onClaimRepayment?: () => void
//   onClaimNFT?: () => void
//   isProcessing?: boolean
//   gradientIndex?: number
// }

// const gradientColors = [
//   "from-purple-500/20 via-blue-500/20 to-cyan-500/20",
//   "from-rose-500/20 via-pink-500/20 to-purple-500/20",
//   "from-amber-500/20 via-orange-500/20 to-red-500/20",
//   "from-emerald-500/20 via-teal-500/20 to-cyan-500/20",
//   "from-blue-500/20 via-indigo-500/20 to-violet-500/20",
// ]

// export function LoanCard({
//   nftId,
//   nftAddress,
//   loanAmount,
//   interestRate,
//   loanDuration,
//   startTime,
//   repaid,
//   active,
//   completed,
//   imageUrl,
//   claimed,
//   repaymentClaimed,
//   nftClaimed,
//   onRepay,
//   onClaim,
//   onClaimRepayment,
//   onClaimNFT,
//   isProcessing,
//   gradientIndex = 0,
// }: LoanCardProps) {

//   // Inside LoanCard...
// const [image, setImage] = useState(imageUrl || "https://api.nad.domains/nft-metadata/10143/image/Ym9zc28")
// const [name, setName] = useState("NFT #" + nftId)

// useEffect(() => {
//   const loadMetadata = async () => {
//     try {
//       const meta = await fetchNFTMetadata(nftAddress, nftId)
//       if (meta?.imageUrl) setImage(meta.imageUrl)
//       if (meta?.name) setName(meta.name)
//     } catch {}
//   }
//   loadMetadata()
// }, [nftId, nftAddress])


//   const [isExpanded, setIsExpanded] = useState(false)

//   const formattedLoanAmount = formatEther(loanAmount)
//   const interestAmount = Number(formattedLoanAmount) * (interestRate / 100)
//   const totalRepayment = Number(formattedLoanAmount) + interestAmount

//   const now = Math.floor(Date.now() / 1000)
//   const loanEnd = startTime + loanDuration
//   const timeLeft = startTime > 0 ? formatDistanceToNow(new Date(loanEnd * 1000), { addSuffix: true }) : "Not started"
//   const gracePeriodEnd = loanEnd + 7 * 86400 // 7 days grace period
//   const canClaimNFT = !repaid && now > gracePeriodEnd && !completed

//   const getStatusBadge = () => {
//     if (completed) return <Badge variant="success">Completed</Badge>
//     if (repaid) return <Badge variant="success">Repaid</Badge>
//     if (active) return <Badge variant="warning">Active</Badge>
//     return <Badge variant="secondary">Pending</Badge>
//   }

//   const getAvailableActions = () => {
//     const actions: JSX.Element[] = []

//     if (completed) {
//       return actions // No actions for completed loans
//     }

//     if (active && !claimed && onClaim) {
//       actions.push(
//         <DropdownMenuItem key="claim" onClick={onClaim}>
//           Claim Loan
//         </DropdownMenuItem>,
//       )
//     }

//     if (active && !repaid && onRepay) {
//       actions.push(
//         <DropdownMenuItem key="repay" onClick={onRepay}>
//           Repay Loan
//         </DropdownMenuItem>,
//       )
//     }

//     if (repaid && !repaymentClaimed && onClaimRepayment) {
//       actions.push(
//         <DropdownMenuItem key="claim-repayment" onClick={onClaimRepayment}>
//           Claim Repayment
//         </DropdownMenuItem>,
//       )
//     }

//     if (canClaimNFT && !nftClaimed && onClaimNFT) {
//       actions.push(
//         <DropdownMenuItem key="claim-nft" onClick={onClaimNFT}>
//           Claim NFT
//         </DropdownMenuItem>,
//       )
//     }

//     return actions
//   }

//   const actions = getAvailableActions()

//   return (
//     <Card
//       className={`overflow-hidden bg-gradient-to-br ${gradientColors[gradientIndex]} transition-all duration-200 hover:scale-[1.02]`}
//     >
//       <div className="relative">
//         <div className="relative h-32 w-full">
//           <Image
//             // src={`https://api.nad.domains/nft-metadata/10143/image/Ym9zc28` || `/placeholder.svg?height=200&width=400&text=NFT%20ID%20${nftId}`}
//           src={image} // ✅ Use dynamic one you set with setImage
//           alt={name}
//             // alt={`NFT #${nftId}`}
//             fill
//             className="object-cover"
//             unoptimized
//           />
//           {/* <Image
//             src={`/placeholder.svg?height=200&width=400&text=NFT%20ID%20${nftId}`}
//             // src='src/app/favicon.ico'
//             alt={`NFT ID ${nftId}`}
//             fill
//             className="object-cover"
//           /> */}
//           <div className="absolute top-2 right-2">{getStatusBadge()}</div>
//         </div>
//         <div className="p-4">
//           <div className="mb-2 flex items-center justify-between">
//             <h3 className="text-lg font-semibold">{`${name} ${nftId}`}</h3>
//             {actions.length > 0 && (
//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <Button variant="ghost" size="sm" disabled={isProcessing}>
//                     {isProcessing ? (
//                       <Loader2 className="h-4 w-4 animate-spin" />
//                     ) : (
//                       <ChevronDownIcon className="h-4 w-4" />
//                     )}
//                   </Button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent align="end">{actions}</DropdownMenuContent>
//               </DropdownMenu>
//             )}
//           </div>
//           <p className="text-xs text-muted-foreground truncate mb-2">
//             Collection: {nftAddress.slice(0, 6)}...{nftAddress.slice(-4)}
//           </p>
//           <div className="space-y-1 text-sm">
//             <div className="flex justify-between">
//               <span className="text-muted-foreground">Amount:</span>
//               <span>{Number(formattedLoanAmount).toFixed(4)} wMON</span>
//             </div>
//             <div className="flex justify-between">
//               <span className="text-muted-foreground">Interest:</span>
//               <span>{interestRate}%</span>
//             </div>
//             <div className="flex justify-between">
//               <span className="text-muted-foreground">Repayment:</span>
//               <span>{totalRepayment.toFixed(4)} wMON</span>
//             </div>
//             {active && startTime > 0 && (
//               <div className="flex justify-between">
//                 <span className="text-muted-foreground">Time Left:</span>
//                 <span>{timeLeft}</span>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </Card>
//   )
// }

////////////////////////---------------------------///////////////////////////////////
"use client"
import { useEffect, useState } from "react"
import Image from "next/image"
import { Card } from "@/Components/privy/ui/card"
import { Badge } from "@/Components/privy/ui/badge"
import { Button } from "@/Components/privy/ui/button"
import { ChevronDownIcon } from "@heroicons/react/24/outline"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/Components/privy/ui/dropdown-menu"
import { Loader2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { formatEther } from "viem"
import { getCachedNFTMetadata } from "./lib/nftCache"

interface LoanCardProps {
  nftId: number
  nftAddress: string
  nftOwner: string
  loanAmount: bigint
  interestRate: number
  loanDuration: number
  startTime: number
  repaid: boolean
  lender: string
  loanToken: string
  active: boolean
  completed: boolean
  claimed?: boolean
  repaymentClaimed?: boolean
  nftClaimed?: boolean
  imageUrl?: string;
  onRepay?: () => void
  onClaim?: () => void
  onClaimRepayment?: () => void
  onClaimNFT?: () => void
  isProcessing?: boolean
  gradientIndex?: number
}

export function LoanCard({
  nftId,
  nftAddress,
  loanAmount,
  interestRate,
  loanDuration,
  startTime,
  repaid,
  completed,
  active,
  onClaim,
  onRepay,
  onClaimNFT,
  onClaimRepayment,
  isProcessing,
  gradientIndex = 0,
}: LoanCardProps) {
  const [image, setImage] = useState("/https://via.placeholder.com/300x300.png?text=No+Image")
  const [name, setName] = useState(`NFT #${nftId}`)

  useEffect(() => {
    getCachedNFTMetadata(nftAddress, nftId).then((meta) => {
      setImage(meta.imageUrl)
      setName(meta.name)
    })
  }, [nftId, nftAddress])

  const now = Math.floor(Date.now() / 1000)
  const loanEnd = startTime + loanDuration
  const gracePeriodEnd = loanEnd + 7 * 86400
  const canClaimNFT = !repaid && now > gracePeriodEnd && !completed
  const timeLeft = startTime > 0 ? formatDistanceToNow(new Date(loanEnd * 1000), { addSuffix: true }) : "Not started"

  // const actions = [
  //   !completed && active && onClaim && { label: "Claim Loan", onClick: onClaim },
  //   !completed && active && !repaid && onRepay && { label: "Repay Loan", onClick: onRepay },
  //   repaid && onClaimRepayment && { label: "Claim Repayment", onClick: onClaimRepayment },
  //   canClaimNFT && onClaimNFT && { label: "Claim NFT", onClick: onClaimNFT },
  // ].filter(Boolean)
  type Action = { label: string; onClick: () => void }

  const actions : Action[] = []
  if (!completed && active && onClaim){
    actions.push( {label:  'Claim Loan', onClick: onClaim})
  }
  if (!completed && active && !repaid && onRepay){
    actions.push( {label: 'Repay Loan ', onClick: onRepay})
  }
  if(repaid && onClaimRepayment){
    actions.push( {label: 'Claim Repayment', onClick: onClaimRepayment})
  }
  if (canClaimNFT && onClaimNFT){
    actions.push( { label: 'Claim NFT', onClick: onClaimNFT})
  }

  return (
    <Card className={`overflow-hidden bg-gradient-to-br ${gradientColors[gradientIndex % gradientColors.length]} hover:scale-[1.02]`}>
      <div className="relative h-32 w-full">
        <Image src={image} alt={name} fill className="object-cover" unoptimized />
        <div className="absolute top-2 right-2">{getStatusBadge(completed, repaid, active)}</div>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold truncate">{name}</h3>
          {actions.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="ghost" disabled={isProcessing}>
                  {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <ChevronDownIcon className="h-4 w-4" />}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {actions.map((a, i) => (
                  <DropdownMenuItem key={i} onClick={a.onClick}>
                    {a.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <Info label="Collection" value={`${nftAddress.slice(0, 6)}...${nftAddress.slice(-4)}`} />
        <Info label="Amount" value={`${formatEther(loanAmount)} wMON`} />
        <Info label="Interest" value={`${interestRate}%`} />
        <Info label="Duration" value={`${loanDuration / 86400} days`} />
        {active && startTime > 0 && <Info label="Time Left" value={timeLeft} />}
      </div>
    </Card>
  )
}

function getStatusBadge(completed: boolean, repaid: boolean, active: boolean) {
  if (completed) return <Badge variant="success">Completed</Badge>
  if (repaid) return <Badge variant="success">Repaid</Badge>
  if (active) return <Badge variant="warning">Active</Badge>
  return <Badge variant="secondary">Pending</Badge>
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm text-muted-foreground">
      <span>{label}:</span>
      <span className="text-foreground font-medium">{value}</span>
    </div>
  )
}

const gradientColors = [
  "from-purple-500/20 via-blue-500/20 to-cyan-500/20",
  "from-rose-500/20 via-pink-500/20 to-purple-500/20",
  "from-amber-500/20 via-orange-500/20 to-red-500/20",
  "from-emerald-500/20 via-teal-500/20 to-cyan-500/20",
  "from-blue-500/20 via-indigo-500/20 to-violet-500/20",
]
