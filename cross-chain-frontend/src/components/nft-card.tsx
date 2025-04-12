"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/Components/privy/ui/card";
import { Badge } from "@/Components/privy/ui/badge";
import { Button } from "@/Components/privy/ui/button";
import { Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { formatEther } from "viem";
import { getCachedNFTMetadata } from "./lib/nftCache";

interface NFTCardProps {
  loanId: bigint;
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
  active?: boolean;
  completed?: boolean;
  loanClaimed?: boolean;
  repaymentClaimed?: boolean;
  nftClaimed?: boolean;
  imageUrl?: string;
  onAction?: () => void;
  actionText: string;
  actionDisabled?: boolean;
  isProcessing?: boolean;
  showLender?: boolean;
  onClick?: () => void;
}

export function NFTCard({
  loanId,
  nftId,
  nftAddress,
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
  onAction,
  actionText,
  actionDisabled = false,
  isProcessing = false,
  showLender = true,
  onClick,
}: NFTCardProps) {
  const [image, setImage] = useState("/placeholder.svg");
  const [name, setName] = useState(`NFT #${nftId}`);
  useEffect(() => {
    getCachedNFTMetadata(nftAddress, nftId).then((meta) => {
      setImage(meta.imageUrl);
      setName(meta.name);
    });
  }, [nftId, nftAddress]);

  const now = Math.floor(Date.now() / 1000);
  const loanEnd = startTime + loanDuration;
  const timeLeft =
    loanEnd > now
      ? formatDistanceToNow(new Date(loanEnd * 1000), { addSuffix: true })
      : "Expired";
  const isExpired: boolean =
    !completed && active && startTime > 0 && loanEnd < now;

  const formattedLoanAmount = formatEther(loanAmount);
  const tokenSymbol = getTokenSymbol(loanToken);

  return (
    <Card
      onClick={onClick}
      // className="overflow-hidden border border-monad-border bg-card hover:shadow-md hover:shadow-monad-500/10 transition-all duration-300"
      className="overflow-hidden border border-monad-border bg-card hover:shadow-md hover:shadow-monad-500/10 transition-all duration-300 cursor-pointer"
    >
      <CardHeader className="p-0">
        <div className="relative h-32 w-full bg-muted">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover"
            unoptimized
          />
          <div className="absolute top-2 right-2">
            {completed ? (
              <Badge className="bg-green-600 hover:bg-green-700 text-xs py-0 px-2">
                Completed
              </Badge>
            ) : repaid ? (
              <Badge className="bg-green-600 hover:bg-green-700 text-xs py-0 px-2">
                Repaid
              </Badge>
            ) : active ? (
              <Badge className="bg-monad-500 hover:bg-monad-600 text-xs py-0 px-2">
                Active
              </Badge>
            ) : isExpired ? (
              <Badge className="bg-monad-500 hover:bg-monad-600 text-xs py-0 px-2">
                Expired
              </Badge>
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
          <a
            href={`https://testnet.monadexplorer.com/nft/${nftAddress}/${nftId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-monad-500 hover:underline"
            title={`View ${name} on Monad Explorer`}
          >
            {name}
          </a>
          <p className="text-xs text-muted-foreground">
            ID: {loanId.toString()}
          </p>
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
            <span className="font-medium text-foreground">
              {loanDuration / 86400}d
            </span>
          </div>

          {active && startTime > 0 && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Time Left:</span>
              <span
                className={`font-medium ${
                  loanEnd < now ? "text-red-400" : "text-foreground"
                }`}
              >
                {timeLeft}
              </span>
            </div>
          )}

          {showLender && active && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Lender:</span>
              <span className="font-medium truncate text-foreground max-w-[80px]">
                <a
                  href={`/user/${lender}`}
                  className="hover:underline text-blue-400"
                  target="_blank"
                >
                  {lender.slice(0, 4)}...{lender.slice(-4)}
                </a>
              </span>
            </div>
          )}

          <div className="flex justify-between">
            <span className="text-muted-foreground">Collection Address:</span>
            <a
              href={`https://testnet.monadexplorer.com/address/${nftAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-monad-300 hover:underline max-w-[80px] truncate"
              title={nftAddress}
            >
              {nftAddress.slice(0, 4)}...{nftAddress.slice(-4)}
            </a>
          </div>
        </div>
      </CardContent>

      {onAction && (
        <CardFooter className="p-3 pt-0">
          <Button
            onClick={onAction}
            disabled={actionDisabled || isProcessing}
            className="w-full bg-monad-500 hover:bg-monad-600 text-white disabled:bg-muted disabled:text-muted-foreground text-xs h-8"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-3 h-3 mr-1 animate-spin" /> Processing
              </>
            ) : (
              actionText
            )}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}

function InfoRow({
  label,
  value,
  valueClass = "text-foreground",
}: {
  label: string;
  value: React.ReactNode;
  valueClass?: string;
}) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}:</span>
      <span className={`font-medium ${valueClass}`}>{value}</span>
    </div>
  );
}

function getTokenSymbol(address: string) {
  if (address.toLowerCase().includes("760afe")) return "wMON";
  if (address.toLowerCase().includes("88b8e2")) return "USDT";
  if (address.toLowerCase().includes("f81725")) return "ETH";
  return "Token";
}
