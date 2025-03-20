"use client"

import { JSX, useState } from "react"
import { Card } from "@/Components/privy/ui/card"
import { Button } from "@/Components/privy/ui/button"
import { Badge } from "@/Components/privy/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/Components/privy/ui/dropdown-menu"
import { ChevronDownIcon } from "@heroicons/react/24/outline"
import { formatDistanceToNow } from "date-fns"
import { formatEther } from "viem"
import { Loader2 } from "lucide-react"
import Image from "next/image"

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
  onRepay?: () => void
  onClaim?: () => void
  onClaimRepayment?: () => void
  onClaimNFT?: () => void
  isProcessing?: boolean
  gradientIndex?: number
}

const gradientColors = [
  "from-purple-500/20 via-blue-500/20 to-cyan-500/20",
  "from-rose-500/20 via-pink-500/20 to-purple-500/20",
  "from-amber-500/20 via-orange-500/20 to-red-500/20",
  "from-emerald-500/20 via-teal-500/20 to-cyan-500/20",
  "from-blue-500/20 via-indigo-500/20 to-violet-500/20",
]

export function LoanCard({
  nftId,
  nftAddress,
  loanAmount,
  interestRate,
  loanDuration,
  startTime,
  repaid,
  active,
  completed,
  claimed,
  repaymentClaimed,
  nftClaimed,
  onRepay,
  onClaim,
  onClaimRepayment,
  onClaimNFT,
  isProcessing,
  gradientIndex = 0,
}: LoanCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const formattedLoanAmount = formatEther(loanAmount)
  const interestAmount = Number(formattedLoanAmount) * (interestRate / 100)
  const totalRepayment = Number(formattedLoanAmount) + interestAmount

  const now = Math.floor(Date.now() / 1000)
  const loanEnd = startTime + loanDuration
  const timeLeft = startTime > 0 ? formatDistanceToNow(new Date(loanEnd * 1000), { addSuffix: true }) : "Not started"
  const gracePeriodEnd = loanEnd + 7 * 86400 // 7 days grace period
  const canClaimNFT = !repaid && now > gracePeriodEnd && !completed

  const getStatusBadge = () => {
    if (completed) return <Badge variant="success">Completed</Badge>
    if (repaid) return <Badge variant="success">Repaid</Badge>
    if (active) return <Badge variant="warning">Active</Badge>
    return <Badge variant="secondary">Pending</Badge>
  }

  const getAvailableActions = () => {
    const actions: JSX.Element[] = []

    if (completed) {
      return actions // No actions for completed loans
    }

    if (active && !claimed && onClaim) {
      actions.push(
        <DropdownMenuItem key="claim" onClick={onClaim}>
          Claim Loan
        </DropdownMenuItem>,
      )
    }

    if (active && !repaid && onRepay) {
      actions.push(
        <DropdownMenuItem key="repay" onClick={onRepay}>
          Repay Loan
        </DropdownMenuItem>,
      )
    }

    if (repaid && !repaymentClaimed && onClaimRepayment) {
      actions.push(
        <DropdownMenuItem key="claim-repayment" onClick={onClaimRepayment}>
          Claim Repayment
        </DropdownMenuItem>,
      )
    }

    if (canClaimNFT && !nftClaimed && onClaimNFT) {
      actions.push(
        <DropdownMenuItem key="claim-nft" onClick={onClaimNFT}>
          Claim NFT
        </DropdownMenuItem>,
      )
    }

    return actions
  }

  const actions = getAvailableActions()

  return (
    <Card
      className={`overflow-hidden bg-gradient-to-br ${gradientColors[gradientIndex]} transition-all duration-200 hover:scale-[1.02]`}
    >
      <div className="relative">
        <div className="relative h-32 w-full">
          <Image
            src={`/placeholder.svg?height=200&width=400&text=NFT%20ID%20${nftId}`}
            // src='src/app/favicon.ico'
            alt={`NFT ID ${nftId}`}
            fill
            className="object-cover"
          />
          <div className="absolute top-2 right-2">{getStatusBadge()}</div>
        </div>
        <div className="p-4">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-lg font-semibold">NFT #{nftId}</h3>
            {actions.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" disabled={isProcessing}>
                    {isProcessing ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <ChevronDownIcon className="h-4 w-4" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">{actions}</DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          <p className="text-xs text-muted-foreground truncate mb-2">
            Collection: {nftAddress.slice(0, 6)}...{nftAddress.slice(-4)}
          </p>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Amount:</span>
              <span>{Number(formattedLoanAmount).toFixed(4)} wMON</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Interest:</span>
              <span>{interestRate}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Repayment:</span>
              <span>{totalRepayment.toFixed(4)} wMON</span>
            </div>
            {active && startTime > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Time Left:</span>
                <span>{timeLeft}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}

