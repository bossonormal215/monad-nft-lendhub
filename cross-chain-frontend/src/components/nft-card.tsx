"use client"

import { Card, CardContent, CardFooter, CardHeader } from "@/Components/privy/ui/card"
import { Button } from "@/Components/privy/ui/button"
import { Badge } from "@/Components/privy/ui/badge"
import { Loader2 } from "lucide-react"
import Image from "next/image"
import { formatDistanceToNow } from "date-fns"
import { formatEther } from "viem"

interface NFTCardProps {
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
  active?: boolean
  completed?: boolean
  claimed?: boolean
  repaymentClaimed?: boolean
  nftClaimed?: boolean
  onAction?: () => void
  actionText: string
  actionDisabled?: boolean
  isProcessing?: boolean
  showLender?: boolean
}

export function NFTCard({
  nftId,
  nftAddress,
  nftOwner,
  loanAmount,
  interestRate,
  loanDuration,
  startTime,
  repaid,
  lender,
  loanToken,
  active = false,
  completed = false,
  claimed,
  repaymentClaimed,
  nftClaimed,
  onAction,
  actionText,
  actionDisabled = false,
  isProcessing = false,
  showLender = true,
}: NFTCardProps) {
  const isActive = active || lender !== "0x0000000000000000000000000000000000000000"
  const isFunded = isActive && !repaid
  const isRepaid = repaid
  const isCompleted = completed
  const now = Math.floor(Date.now() / 1000)
  const loanEnd = startTime + loanDuration
  const timeLeft = loanEnd > now ? formatDistanceToNow(new Date(loanEnd * 1000), { addSuffix: true }) : "Expired"

  // Format the loan amount to display in ETH
  const formattedLoanAmount = formatEther(loanAmount)

  // Calculate the total repayment amount (principal + interest)
  const interestAmount = Number(formattedLoanAmount) * (interestRate / 100)
  const totalRepayment = Number(formattedLoanAmount) + interestAmount

  // Get token symbol based on address
  const getTokenSymbol = (address: string) => {
    const lowerAddress = address.toLowerCase()
    if (lowerAddress.includes("mon")) return "wMON"
    if (lowerAddress.includes("usdt")) return "USDT"
    if (lowerAddress.includes("eth")) return "ETH"
    return "Token"
  }

  const tokenSymbol = getTokenSymbol(loanToken)

  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full bg-muted">
          <Image
            src={`/placeholder.svg?height=200&width=400&text=NFT%20ID%20${nftId}`}
            alt={`NFT ID ${nftId}`}
            fill
            className="object-cover"
          />
          <div className="absolute top-2 right-2">
            {isCompleted ? (
              <Badge variant="success">Completed</Badge>
            ) : isRepaid ? (
              <Badge variant="success">Repaid</Badge>
            ) : isFunded ? (
              <Badge variant="warning">Active</Badge>
            ) : (
              <Badge variant="secondary">Pending</Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="mb-4">
          <h3 className="text-lg font-semibold">NFT #{nftId}</h3>
          <p className="text-sm text-muted-foreground truncate">
            Collection: {nftAddress.slice(0, 6)}...{nftAddress.slice(-4)}
          </p>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Loan Amount:</span>
            <span className="font-medium">
              {Number(formattedLoanAmount).toFixed(4)} {tokenSymbol}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Interest Rate:</span>
            <span className="font-medium">{interestRate}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total Repayment:</span>
            <span className="font-medium">
              {totalRepayment.toFixed(4)} {tokenSymbol}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Duration:</span>
            <span className="font-medium">{loanDuration / 86400} days</span>
          </div>
          {isActive && startTime > 0 && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Time Left:</span>
              <span className="font-medium">{timeLeft}</span>
            </div>
          )}
          {showLender && isActive && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Lender:</span>
              <span className="font-medium truncate">
                {lender.slice(0, 6)}...{lender.slice(-4)}
              </span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        {onAction && (
          <Button
            onClick={onAction}
            disabled={actionDisabled || isProcessing}
            className="w-full bg-monad-500 hover:bg-monad-600"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              actionText
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

