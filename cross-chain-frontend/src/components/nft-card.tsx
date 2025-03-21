"use client"

import { Card, CardContent, CardFooter, CardHeader } from "@/Components/privy/ui/card"
import { Button } from "@/Components/privy/ui/button"
import { Badge } from "@/Components/privy/ui/badge"
import { Loader2 } from "lucide-react"
import Image from "next/image"
import { formatDistanceToNow } from "date-fns"
import { formatEther } from "viem"

interface NFTCardProps {
  loanId: bigint
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
  loanClaimed?: boolean
  repaymentClaimed?: boolean
  nftClaimed?: boolean
  onAction?: () => void
  actionText: string
  actionDisabled?: boolean
  isProcessing?: boolean
  showLender?: boolean
}

export function NFTCard({
  loanId,
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
  loanClaimed,
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
  const isLoanClaimed = loanClaimed
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
    const lowerAddress = address
    if (lowerAddress.includes("0x760AfE86e5de5fa0Ee542fc7B7B713e1c5425701")) return "wMON"
    if (lowerAddress.includes("0x88b8E2161DEDC77EF4ab7585569D2415a1C1055D")) return "USDT"
    if (lowerAddress.includes("0xf817257fed379853cDe0fa4F97AB987181B1E5Ea")) return "ETH"
    return "Token"
  }

  const tokenSymbol = getTokenSymbol(loanToken)

  return (
    <Card className="overflow-hidden border border-monad-border bg-card hover:shadow-md hover:shadow-monad-500/10 transition-all duration-300">
      <CardHeader className="p-0">
        <div className="relative h-32 w-full bg-muted">
          <Image
            src={`/placeholder.svg?height=128&width=200&text=NFT%20${nftId}`}
            alt={`NFT ID ${nftId}`}
            fill
            className="object-cover"
          />
          <div className="absolute top-2 right-2">
            {isCompleted ? (
              <Badge className="bg-green-600 hover:bg-green-700 text-xs py-0 px-2">Completed</Badge>
            ) : isRepaid ? (
              <Badge className="bg-green-600 hover:bg-green-700 text-xs py-0 px-2">Repaid</Badge>
            ) : isFunded ? (
              <Badge className="bg-monad-500 hover:bg-monad-600 text-xs py-0 px-2">Active</Badge>
            ) : (
              <Badge variant="secondary" className="text-xs py-0 px-2">
                Pending
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-3 bg-gradient-to-b from-card to-card/90 space-y-2">
        <div className="flex justify-between items-center">
          <p className="text-sm font-semibold text-monad-500">NFT #{nftId}</p>
          <p className="text-xs text-muted-foreground">ID: {loanId.toString()}</p>
        </div>

        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Amount:</span>
            <span className="font-medium text-foreground">
              {Number(formattedLoanAmount).toFixed(2)} {tokenSymbol}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Interest:</span>
            <span className="font-medium text-foreground">{interestRate}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Duration:</span>
            <span className="font-medium text-foreground">{loanDuration / 86400}d</span>
          </div>
          {isActive && startTime > 0 && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Time Left:</span>
              <span className={`font-medium ${loanEnd < now ? "text-red-400" : "text-foreground"}`}>{timeLeft}</span>
            </div>
          )}
          {showLender && isActive && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Lender:</span>
              <span className="font-medium truncate text-foreground max-w-[80px]">
                {lender.slice(0, 4)}...{lender.slice(-4)}
              </span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-3 pt-0 bg-card">
        {onAction && (
          <Button
            onClick={onAction}
            disabled={actionDisabled || isProcessing}
            className="w-full bg-monad-500 hover:bg-monad-600 text-white disabled:bg-muted disabled:text-muted-foreground text-xs h-8"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-1 h-3 w-3 animate-spin" />
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

