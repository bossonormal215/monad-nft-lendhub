"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Card } from "@/Components/privy/ui/card";
import { Badge } from "@/Components/privy/ui/badge";
import { Button } from "@/Components/privy/ui/button";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/Components/privy/ui/dropdown-menu";
import { Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { formatEther } from "viem";
import { getCachedNFTMetadata } from "./lib/nftCache";

interface LoanCardProps {
  nftId: number;
  nftAddress: string;
  nftOwner: string;
  loanAmount: bigint;
  interestRate: number;
  loanDuration: number;
  startTime: number;
  repaid: boolean;
  lender: string;
  loanToken: string;
  active: boolean;
  completed: boolean;
  cancelled: boolean;
  claimed?: boolean;
  repaymentClaimed?: boolean;
  nftClaimed?: boolean;
  imageUrl?: string;
  onRepay?: () => void;
  onClaim?: () => void;
  onClaimRepayment?: () => void;
  onClaimNFT?: () => void;
  isProcessing?: boolean;
  gradientIndex?: number;
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
  cancelled,
  active,
  onClaim,
  onRepay,
  onClaimNFT,
  onClaimRepayment,
  isProcessing,
  gradientIndex = 0,
}: LoanCardProps) {
  const [image, setImage] = useState(
    "/https://via.placeholder.com/300x300.png?text=No+Image"
  );
  const [name, setName] = useState(`NFT #${nftId}`);

  useEffect(() => {
    getCachedNFTMetadata(nftAddress, nftId).then((meta) => {
      setImage(meta.imageUrl);
      setName(meta.name);
    });
  }, [nftId, nftAddress]);

  const formattedLoanAmount = formatEther(loanAmount);
  const interestAmount = Number(formattedLoanAmount) * (interestRate / 100);
  const totalRepayment = Number(formattedLoanAmount) + interestAmount;

  const now = Math.floor(Date.now() / 1000);
  const loanEnd = startTime + loanDuration;
  const gracePeriodEnd = loanEnd + 7 * 86400;
  const canClaimNFT =
    !repaid && now > gracePeriodEnd && !completed && !cancelled;
  const timeLeft =
    startTime > 0
      ? formatDistanceToNow(new Date(loanEnd * 1000), { addSuffix: true })
      : "Not started"; // fundedAt

  type Action = { label: string; onClick: () => void };

  const actions: Action[] = [];
  if (!completed && active && onClaim) {
    actions.push({ label: "Claim Loan", onClick: onClaim });
  }
  if (!completed && active && !repaid && onRepay) {
    actions.push({ label: "Repay Loan ", onClick: onRepay });
  }
  if (repaid && onClaimRepayment) {
    actions.push({ label: "Claim Repayment", onClick: onClaimRepayment });
  }
  if (canClaimNFT && onClaimNFT) {
    actions.push({ label: "Claim NFT", onClick: onClaimNFT });
  }

  return (
    <Card
      className={`overflow-hidden bg-gradient-to-br ${gradientColors[gradientIndex]} transition-all duration-200 hover:scale-[1.02]`}
    >
      <div className="relative">
        <div className="relative h-32 w-full">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover"
            unoptimized
          />
          <div className="absolute top-2 right-2">
            {getStatusBadge(completed, repaid, active, cancelled)}
          </div>
        </div>
        <div className="p-4">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-semibold truncate">{name}</h3>
            {actions.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" variant="ghost" disabled={isProcessing}>
                    {isProcessing ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <ChevronDownIcon className="h-4 w-4" />
                    )}
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

          <p className="text-xs text-muted-foreground truncate mb-2">
            Collection: {nftAddress.slice(0, 6)}...{nftAddress.slice(-4)}
          </p>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Amount:</span>
              <span>{formatEther(loanAmount)} wMON</span>
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
  );
}

function getStatusBadge(
  completed: boolean,
  repaid: boolean,
  active: boolean,
  cancelled: boolean
) {
  if (completed) return <Badge variant="success">Completed</Badge>;
  if (repaid) return <Badge variant="success">Repaid</Badge>;
  if (active) return <Badge variant="warning">Active</Badge>;
  if (cancelled) return <Badge variant="warning">Cancelled</Badge>;
  return <Badge variant="secondary">Pending</Badge>;
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm text-muted-foreground">
      <span>{label}:</span>
      <span className="text-foreground font-medium">{value}</span>
    </div>
  );
}

const gradientColors = [
  "from-purple-500/20 via-blue-500/20 to-cyan-500/20",
  "from-rose-500/20 via-pink-500/20 to-purple-500/20",
  "from-amber-500/20 via-orange-500/20 to-red-500/20",
  "from-emerald-500/20 via-teal-500/20 to-cyan-500/20",
  "from-blue-500/20 via-indigo-500/20 to-violet-500/20",
];
