"use client";

import type React from "react";
import { useState } from "react";
import Image from "next/image";
import { formatDistanceToNow, format } from "date-fns";
import { formatEther } from "viem";
import {
  ExternalLink,
  Clock,
  DollarSign,
  Percent,
  Calendar,
  CheckCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/Components/privy/ui/dialog";
import { Button } from "@/Components/privy/ui/button";
import { Badge } from "@/Components/privy/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/Components/privy/ui/tabs";
import { Loader2 } from "lucide-react";

interface LoanDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  loan: any;
  onAction: (action: string) => void;
  isProcessing: boolean;
  isBorrowing: boolean;
}

export function LoanDetailsModal({
  isOpen,
  onClose,
  loan,
  onAction,
  isProcessing,
  isBorrowing,
}: LoanDetailModalProps) {
  const [activeTab, setActiveTab] = useState("details");

  if (!loan) return null;

  const now = Math.floor(Date.now() / 1000);
  const loanEnd = Number(loan.milestones.startTime) + Number(loan.loanDuration);
  const gracePeriodEnd = loanEnd + 7 * 86400; // 7 days grace period
  const isExpired = now > loanEnd && Number(loan.milestones.startTime) > 0;
  const isInGracePeriod = isExpired && now <= gracePeriodEnd;
  const isCancelled = loan.cancelled;
  const canClaimNFT =
    !loan.repaid &&
    now > gracePeriodEnd &&
    !loan.completed &&
    loan.loanAddDetails.lender !== "0x0000000000000000000000000000000000000000";

  const formattedLoanAmount = formatEther(loan.loanAmount);
  const interestAmount =
    Number(formattedLoanAmount) * (Number(loan.interestRate) / 100);
  const totalRepayment = Number(formattedLoanAmount) + interestAmount;

  // Format dates with validation
  const formatTimestamp = (timestamp: bigint) =>
    Number(timestamp) > 0
      ? format(new Date(Number(timestamp) * 1000), "MMM dd, yyyy HH:mm")
      : "Not started";

  const startDate = formatTimestamp(loan.milestones.startTime);
  const endDate =
    Number(loan.milestones.startTime) > 0
      ? format(new Date(loanEnd * 1000), "MMM dd, yyyy HH:mm")
      : "Not started";
  const gracePeriodEndDate =
    Number(loan.milestones.startTime) > 0
      ? format(new Date(gracePeriodEnd * 1000), "MMM dd, yyyy HH:mm")
      : "Not started";
  const timeLeft =
    Number(loan.milestones.startTime) > 0
      ? formatDistanceToNow(new Date(loanEnd * 1000), { addSuffix: true })
      : "Not started";

  const progressPercentage =
    Number(loan.milestones.startTime) > 0
      ? Math.min(
          100,
          Math.max(
            0,
            ((now - Number(loan.milestones.startTime)) /
              Number(loan.loanDuration)) *
              100
          )
        )
      : 0;

  const tokenSymbol = getTokenSymbol(loan.loanAddDetails.loanToken);

  // Determine action button text and handler
  let actionText = "";
  let actionHandler = null;
  let actionDisabled = true;

  if (isBorrowing) {
    if (loan.completed) {
      actionText = "Loan Completed";
    } else if (!loan.active && !isCancelled) {
      actionText = "Cancel Loan";
      actionHandler = () => onAction("withdrawLoan");
      actionDisabled = false;
    } else if (isCancelled) {
      actionText = "Loan Cancelled";
    } else if (
      !loan.active &&
      !loan.repaid &&
      !loan.loanClaimed &&
      !loan.completed &&
      isBorrowing
    ) {
      actionText = "Cancel Loan";
      actionHandler = () => onAction("withdrawLoan");
      actionDisabled = false;
    } else if (loan.repaid) {
      actionText = "Loan Repaid";
    } else if (!loan.loanClaimed && loan.active && !loan.completed) {
      actionText = "Claim Loan";
      actionHandler = () => onAction("claimLoan");
      actionDisabled = false;
    } else if (
      loan.loanClaimed &&
      !loan.repaid &&
      !loan.completed &&
      loan.active
    ) {
      actionText = "Repay Loan";
      actionHandler = () => onAction("repayLoan");
      actionDisabled = false;
    }
  } else {
    // Lending actions
    if (!loan.active && !loan.completed && !loan.repaid && !loan.loanClaimed) {
      actionText = "Fund Loan";
      actionHandler = () => onAction("fundLoan");
      actionDisabled = false;
    } else if (loan.completed) {
      actionText = "Loan Completed";
    } else if (loan.repaid && loan.active && !loan.completed) {
      actionText = "Claim Repayment";
      actionHandler = () => onAction("claimRepayment");
      actionDisabled = false;
    } else if (loan.repaid && loan.completed) {
      actionText = "Repayment Claimed";
    } else if (canClaimNFT) {
      actionText = "Claim NFT";
      actionHandler = () => onAction("claimNFT");
      actionDisabled = false;
    } else if (canClaimNFT && loan.completed) {
      actionText = "NFT Claimed";
    } else {
      actionText = "Waiting for Repayment";
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <div className="mb-4">
          <DialogTitle className="flex items-center gap-2">
            Loan #{loan.loanId.toString()}
            <LoanStatusBadge
              completed={loan.completed}
              repaid={loan.repaid}
              active={loan.active}
              isExpired={isExpired}
              isInGracePeriod={isInGracePeriod}
              isCancelled={isCancelled}
            />
          </DialogTitle>
          <DialogDescription>
            View complete details about this loan
          </DialogDescription>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="details">Loan Details</TabsTrigger>
            <TabsTrigger value="timeline">Loan Timeline</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative h-40 w-full sm:w-40 rounded-md overflow-hidden bg-muted">
                <Image
                  src={
                    loan.imageUrl ||
                    "https://next.cdn.magiceden.dev/_next/static/media/nft_fallback.f889df8f.svg"
                  }
                  alt={loan.name || `NFT #${loan.nftId}`}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>

              <div className="flex-1 space-y-2">
                <h3 className="text-lg font-semibold">
                  {loan.name || `NFT #${loan.nftId}`}
                </h3>

                <div className="flex flex-col gap-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Collection:</span>
                    <a
                      href={`https://testnet.monadexplorer.com/address/${loan.loanAddDetails.nftAddress}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-monad-500 hover:underline"
                    >
                      {truncateAddress(loan.loanAddDetails.nftAddress)}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">NFT ID:</span>
                    <a
                      href={`https://testnet.monadexplorer.com/nft/${loan.loanAddDetails.nftAddress}/${loan.nftId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-monad-500 hover:underline"
                    >
                      {loan.nftId}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>

                  {isBorrowing ? (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Lender:</span>
                      <a
                        href={`/user/${loan.loanAddDetails.lender}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-monad-500 hover:underline"
                      >
                        {/* {truncateAddress(loan.loanAddDetails.lender)} */}
                        View Lender Profile
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  ) : (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Borrower:</span>
                      <a
                        href={`/user/${loan.loanAddDetails.nftOwner}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-monad-500 hover:underline"
                      >
                        {/* {truncateAddress(loan.loanAddDetails.nftOwner)} */}
                        View Borrower Profile
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="h-px bg-border my-4" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-3 p-3 rounded-md bg-card/50 border border-monad-border">
                <h4 className="font-medium flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-monad-500" />
                  Loan Terms
                </h4>

                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Loan Amount:</span>
                    <span className="font-medium">
                      {Number(formattedLoanAmount).toFixed(4)} {tokenSymbol}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Interest Rate:
                    </span>
                    <span className="font-medium flex items-center gap-1">
                      <Percent className="h-3 w-3 text-monad-500" />
                      {Number(loan.interestRate)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Interest Amount:
                    </span>
                    <span className="font-medium">
                      {interestAmount.toFixed(4)} {tokenSymbol}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Total Repayment:
                    </span>
                    <span className="font-medium">
                      {totalRepayment.toFixed(4)} {tokenSymbol}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 p-3 rounded-md bg-card/50 border border-monad-border">
                <h4 className="font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-monad-500" />
                  Loan Duration
                </h4>

                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duration:</span>
                    <span className="font-medium">
                      {Number(loan.loanDuration) / 86400} days
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Start Date:</span>
                    <span className="font-medium">{startDate}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">End Date:</span>
                    <span className="font-medium">{endDate}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Grace Period End:
                    </span>
                    <span className="font-medium">{gracePeriodEndDate}</span>
                  </div>
                </div>
              </div>
            </div>

            {Number(loan.milestones.startTime) > 0 && !loan.completed && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Loan Progress:</span>
                  <span className="font-medium flex items-center gap-1">
                    <Clock className="h-3 w-3 text-monad-500" />
                    {isExpired ? "Expired" : timeLeft}
                  </span>
                </div>

                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-monad-500"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>

                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Start</span>
                  <span>End</span>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="timeline" className="space-y-4">
            <div className="space-y-4">
              <TimelineItem
                title="Loan Created"
                description="The loan request was created by the borrower"
                date={formatTimestamp(loan.milestones.startTime)}
                status={
                  Number(loan.milestones.startTime) > 0 ? "complete" : "pending"
                }
                icon={<DollarSign className="h-4 w-4" />}
              />

              <TimelineItem
                title="Loan Funded"
                description="A lender has funded this loan"
                date={formatTimestamp(loan.milestones.fundedAt)}
                status={loan.active ? "complete" : "pending"}
                icon={<DollarSign className="h-4 w-4" />}
              />

              <TimelineItem
                title="Loan Claimed"
                description="The borrower has claimed the loan funds"
                date={formatTimestamp(loan.milestones.claimedAt)}
                status={loan.loanClaimed ? "complete" : "pending"}
                icon={<DollarSign className="h-4 w-4" />}
              />

              <TimelineItem
                title="Loan Repaid"
                description="The borrower has repaid the loan with interest"
                date={formatTimestamp(loan.milestones.repaidAt)}
                status={loan.repaid ? "complete" : "pending"}
                icon={<DollarSign className="h-4 w-4" />}
              />

              <TimelineItem
                title="Loan Completed"
                description={
                  loan.repaid
                    ? "The lender has claimed the repayment"
                    : "The lender has claimed the NFT after grace period"
                }
                date={formatTimestamp(loan.milestones.completedAt)}
                status={loan.completed ? "complete" : "pending"}
                icon={<CheckCircle className="h-4 w-4" />}
              />
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>

          {actionHandler && (
            <Button
              onClick={actionHandler}
              disabled={actionDisabled || isProcessing}
              className="bg-monad-500 hover:bg-monad-600 text-white"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing
                </>
              ) : (
                actionText
              )}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function LoanStatusBadge({
  completed,
  repaid,
  active,
  isExpired,
  isInGracePeriod,
  isCancelled,
}: {
  completed: boolean;
  repaid: boolean;
  active: boolean;
  isExpired: boolean;
  isInGracePeriod: boolean;
  isCancelled: boolean;
}) {
  if (completed) {
    return <Badge className="bg-green-600 hover:bg-green-700">Completed</Badge>;
  }

  if (repaid) {
    return <Badge className="bg-green-600 hover:bg-green-700">Repaid</Badge>;
  }

  if (active) {
    if (isExpired) {
      if (isInGracePeriod) {
        return (
          <Badge className="bg-amber-500 hover:bg-amber-600">
            Grace Period
          </Badge>
        );
      }
      return <Badge className="bg-red-500 hover:bg-red-600">Expired</Badge>;
    }

    return <Badge className="bg-monad-500 hover:bg-monad-600">Active</Badge>;
  } else if (isCancelled) {
    return <Badge className="bg-red-500 hover:bg-red-600">Cancelled</Badge>;
  }

  return <Badge variant="secondary">Awaiting Funding</Badge>;
}

function TimelineItem({
  title,
  description,
  date,
  status,
  icon,
}: {
  title: string;
  description: string;
  date: string;
  status: "complete" | "pending" | "error";
  icon: React.ReactNode;
}) {
  return (
    <div className="flex gap-3">
      <div
        className={`
        flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
        ${
          status === "complete"
            ? "bg-monad-500 text-white"
            : status === "error"
            ? "bg-red-500 text-white"
            : "bg-muted text-muted-foreground"
        }
      `}
      >
        {icon}
      </div>

      <div className="flex-1 pb-4 border-l border-muted pl-4 -ml-4 mt-1">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-medium">{title}</h4>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          <span className="text-xs text-muted-foreground">{date}</span>
        </div>
      </div>
    </div>
  );
}

function truncateAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function getTokenSymbol(address: string) {
  if (address.toLowerCase().includes("760afe")) return "wMON";
  if (address.toLowerCase().includes("88b8e2")) return "USDT";
  if (address.toLowerCase().includes("f81725")) return "ETH";
  return "Token";
}

// //////////////////////////////////////------------------------------------------------///////////////////////////////////////
// "use client";

// import type React from "react";

// import { useState } from "react";
// import Image from "next/image";
// import { formatDistanceToNow, format } from "date-fns";
// import { formatEther } from "viem";
// import {
//   ExternalLink,
//   Clock,
//   DollarSign,
//   Percent,
//   Calendar,
//   CheckCircle,
// } from "lucide-react";
// import {
//   Dialog,
//   DialogContent,
//   DialogTitle,
//   DialogDescription,
// } from "@/Components/privy/ui/dialog";
// import { Button } from "@/Components/privy/ui/button";
// import { Badge } from "@/Components/privy/ui/badge";
// import {
//   Tabs,
//   TabsContent,
//   TabsList,
//   TabsTrigger,
// } from "@/Components/privy/ui/tabs";
// import { Loader2 } from "lucide-react";

// interface LoanDetailModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   loan: any;
//   onAction: (action: string) => void;
//   isProcessing: boolean;
//   isBorrowing: boolean;
// }

// export function LoanDetailsModal({
//   isOpen,
//   onClose,
//   loan,
//   onAction,
//   isProcessing,
//   isBorrowing,
// }: LoanDetailModalProps) {
//   const [activeTab, setActiveTab] = useState("details");

//   if (!loan) return null;

//   const now = Math.floor(Date.now() / 1000);
//   const loanEnd = Number(loan.startTime) + Number(loan.loanDuration);
//   const gracePeriodEnd = loanEnd + 7 * 86400; // 7 days grace period
//   const isExpired = now > loanEnd && Number(loan.startTime) > 0;
//   const isInGracePeriod = isExpired && now <= gracePeriodEnd;
//   const isCancelled = loan.cancelled;
//   const canClaimNFT =
//     !loan.repaid &&
//     now > gracePeriodEnd &&
//     !loan.completed &&
//     loan.loanAddDetails.lender != "0x0000000000000000000000000000000000000000";

//   const formattedLoanAmount = formatEther(loan.loanAmount);
//   const interestAmount =
//     Number(formattedLoanAmount) * (Number(loan.interestRate) / 100);
//   const totalRepayment = Number(formattedLoanAmount) + interestAmount;

//   const timeLeft =
//     Number(loan.milestones.startTime) > 0
//       ? formatDistanceToNow(new Date(loanEnd * 1000), { addSuffix: true })
//       : "Not started";

//   const startDate =
//     Number(loan.milestones.startTime) > 0
//       ? format(new Date(Number(loan.startTime) * 1000), "MMM dd, yyyy HH:mm")
//       : "Not started";

//   const endDate =
//     Number(loan.milestones.startTime) > 0
//       ? format(new Date(loanEnd * 1000), "MMM dd, yyyy HH:mm")
//       : "Not started";

//   const gracePeriodEndDate =
//     Number(loan.milestones.startTime) > 0
//       ? format(new Date(gracePeriodEnd * 1000), "MMM dd, yyyy HH:mm")
//       : "Not started";

//   const progressPercentage =
//     Number(loan.milestones.startTime) > 0
//       ? Math.min(
//           100,
//           Math.max(
//             0,
//             ((now - Number(loan.milestones.startTime)) /
//               Number(loan.milestones.loanDuration)) *
//               100
//           )
//         )
//       : 0;

//   const tokenSymbol = getTokenSymbol(loan.loanAddDetails.loanToken);

//   // Determine action button text and handler
//   let actionText = "";
//   let actionHandler = null;
//   let actionDisabled = true;

//   if (isBorrowing) {
//     if (loan.completed) {
//       actionText = "Loan Completed";
//     } else if (!loan.active && !isCancelled) {
//       actionText = "Cancel Loan";
//       actionHandler = () => onAction("withdrawLoan");
//       actionDisabled = false;
//     } else if (loan.isCancelled) {
//       actionText = "Loan Cancelled";
//     } else if (
//       !loan.active &&
//       !loan.repaid &&
//       !loan.loanClaimed &&
//       !loan.completed &&
//       isBorrowing
//     ) {
//       actionText = "Cancel Loan";
//       actionHandler = () => onAction("withdrawLoan");
//       actionDisabled = false;
//     } else if (loan.repaid) {
//       actionText = "Loan Repaid";
//     } else if (!loan.loanClaimed && loan.active && !loan.completed) {
//       actionText = "Claim Loan";
//       actionHandler = () => onAction("claimLoan"); //✅
//       actionDisabled = false;
//     } else if (
//       loan.loanClaimed &&
//       !loan.repaid &&
//       !loan.completed &&
//       loan.active
//     ) {
//       actionText = "Repay Loan";
//       actionHandler = () => onAction("repayLoan");
//       actionDisabled = false;
//     }
//   } else {
//     // Lending actions
//     if (!loan.active && !loan.completed && !loan.repaid && !loan.loanClaimed) {
//       actionText = "Fund Loan";
//       actionHandler = () => onAction("fundLoan");
//       actionDisabled = false;
//     } else if (loan.completed) {
//       actionText = "Loan Completed";
//     } else if (loan.repaid && loan.active && !loan.completed) {
//       actionText = "Claim Repayment";
//       actionHandler = () => onAction("claimRepayment");
//       actionDisabled = false;
//     } else if (loan.repaid && loan.completed) {
//       actionText = "Repayment Claimed";
//     } else if (canClaimNFT) {
//       actionText = "Claim NFT";
//       actionHandler = () => onAction("claimNFT");
//       actionDisabled = false;
//     } else if (canClaimNFT && loan.completed) {
//       actionText = "NFT Claimed";
//     } else {
//       actionText = "Waiting for Repayment";
//     }
//   }

//   return (
//     <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
//       <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
//         <div className="mb-4">
//           <DialogTitle className="flex items-center gap-2">
//             Loan #{loan.loanId.toString()}
//             <LoanStatusBadge
//               completed={loan.completed}
//               repaid={loan.repaid}
//               active={loan.active}
//               isExpired={isExpired}
//               isInGracePeriod={isInGracePeriod}
//               isCancelled={isCancelled}
//             />
//           </DialogTitle>
//           <DialogDescription>
//             View complete details about this loan
//           </DialogDescription>
//         </div>

//         <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//           <TabsList className="grid w-full grid-cols-2 mb-4">
//             <TabsTrigger value="details">Loan Details</TabsTrigger>
//             <TabsTrigger value="timeline">Loan Timeline</TabsTrigger>
//           </TabsList>

//           <TabsContent value="details" className="space-y-4">
//             <div className="flex flex-col sm:flex-row gap-4">
//               <div className="relative h-40 w-full sm:w-40 rounded-md overflow-hidden bg-muted">
//                 <Image
//                   src={
//                     loan.imageUrl ||
//                     "https://next.cdn.magiceden.dev/_next/static/media/nft_fallback.f889df8f.svg"
//                   } // placeholder
//                   alt={loan.name || `NFT #${loan.nftId}`}
//                   fill
//                   className="object-cover"
//                   unoptimized
//                 />
//               </div>

//               <div className="flex-1 space-y-2">
//                 <h3 className="text-lg font-semibold">
//                   {loan.name || `NFT #${loan.nftId}`}
//                 </h3>

//                 <div className="flex flex-col gap-1 text-sm">
//                   <div className="flex justify-between">
//                     <span className="text-muted-foreground">Collection:</span>
//                     <a
//                       href={`https://testnet.monadexplorer.com/address/${loan.nftAddress}`}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="flex items-center gap-1 text-monad-500 hover:underline"
//                     >
//                       {truncateAddress(loan.loanAddDetails.nftAddress)}
//                       <ExternalLink className="h-3 w-3" />
//                     </a>
//                   </div>

//                   <div className="flex justify-between">
//                     <span className="text-muted-foreground">NFT ID:</span>
//                     <a
//                       href={`https://testnet.monadexplorer.com/nft/${loan.nftAddress}/${loan.nftId}`}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="flex items-center gap-1 text-monad-500 hover:underline"
//                     >
//                       {loan.nftId}
//                       <ExternalLink className="h-3 w-3" />
//                     </a>
//                   </div>

//                   {isBorrowing ? (
//                     <div className="flex justify-between">
//                       <span className="text-muted-foreground">Lender:</span>
//                       <a
//                         // href={`https://testnet.monadexplorer.com/address/${loan.lender}`}
//                         href={`/user/${loan.lender}`}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="flex items-center gap-1 text-monad-500 hover:underline"
//                       >
//                         {truncateAddress(loan.loanAddDetails.lender)}
//                         <ExternalLink className="h-3 w-3" />
//                       </a>
//                     </div>
//                   ) : (
//                     <div className="flex justify-between">
//                       <span className="text-muted-foreground">Borrower:</span>
//                       <a
//                         // href={`https://testnet.monadexplorer.com/address/${loan.nftOwner}`}
//                         href={`/user/${loan.nftOwner}`}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="flex items-center gap-1 text-monad-500 hover:underline"
//                       >
//                         {truncateAddress(loan.loanAddDetails.nftOwner)}
//                         <ExternalLink className="h-3 w-3" />
//                       </a>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>

//             <div className="h-px bg-border my-4" />

//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <div className="space-y-3 p-3 rounded-md bg-card/50 border border-monad-border">
//                 <h4 className="font-medium flex items-center gap-2">
//                   <DollarSign className="h-4 w-4 text-monad-500" />
//                   Loan Terms
//                 </h4>

//                 <div className="space-y-1 text-sm">
//                   <div className="flex justify-between">
//                     <span className="text-muted-foreground">Loan Amount:</span>
//                     <span className="font-medium">
//                       {Number(formattedLoanAmount).toFixed(4)} {tokenSymbol}
//                     </span>
//                   </div>

//                   <div className="flex justify-between">
//                     <span className="text-muted-foreground">
//                       Interest Rate:
//                     </span>
//                     <span className="font-medium flex items-center gap-1">
//                       <Percent className="h-3 w-3 text-monad-500" />
//                       {Number(loan.interestRate)}
//                     </span>
//                   </div>

//                   <div className="flex justify-between">
//                     <span className="text-muted-foreground">
//                       Interest Amount:
//                     </span>
//                     <span className="font-medium">
//                       {interestAmount.toFixed(4)} {tokenSymbol}
//                     </span>
//                   </div>

//                   <div className="flex justify-between">
//                     <span className="text-muted-foreground">
//                       Total Repayment:
//                     </span>
//                     <span className="font-medium">
//                       {totalRepayment.toFixed(4)} {tokenSymbol}
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               <div className="space-y-3 p-3 rounded-md bg-card/50 border border-monad-border">
//                 <h4 className="font-medium flex items-center gap-2">
//                   <Calendar className="h-4 w-4 text-monad-500" />
//                   Loan Duration
//                 </h4>

//                 <div className="space-y-1 text-sm">
//                   <div className="flex justify-between">
//                     <span className="text-muted-foreground">Duration:</span>
//                     <span className="font-medium">
//                       {Number(loan.loanDuration) / 86400} days
//                     </span>
//                   </div>

//                   <div className="flex justify-between">
//                     <span className="text-muted-foreground">Start Date:</span>
//                     <span className="font-medium">{startDate}</span>
//                   </div>

//                   <div className="flex justify-between">
//                     <span className="text-muted-foreground">End Date:</span>
//                     <span className="font-medium">{endDate}</span>
//                   </div>

//                   <div className="flex justify-between">
//                     <span className="text-muted-foreground">
//                       Grace Period End:
//                     </span>
//                     <span className="font-medium">{gracePeriodEndDate}</span>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {Number(loan.milestones.startTime) > 0 && !loan.completed && (
//               <div className="space-y-2">
//                 <div className="flex justify-between text-sm">
//                   <span className="text-muted-foreground">Loan Progress:</span>
//                   <span className="font-medium flex items-center gap-1">
//                     <Clock className="h-3 w-3 text-monad-500" />
//                     {isExpired ? "Expired" : timeLeft}
//                   </span>
//                 </div>

//                 <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
//                   <div
//                     className="h-full bg-monad-500"
//                     style={{ width: `${progressPercentage}%` }}
//                   />
//                 </div>

//                 <div className="flex justify-between text-xs text-muted-foreground">
//                   <span>Start</span>
//                   <span>End</span>
//                 </div>
//               </div>
//             )}
//           </TabsContent>

//           <TabsContent value="timeline" className="space-y-4">
//             <div className="space-y-4">
//               <TimelineItem
//                 title="Loan Created"
//                 description="The loan request was created by the borrower"
//                 date={
//                   Number(loan.milestones.startTime) > 0 ? startDate : "Pending"
//                 }
//                 status="complete"
//                 icon={<DollarSign className="h-4 w-4" />}
//               />

//               <TimelineItem
//                 title="Loan Funded"
//                 description="A lender has funded this loan"
//                 date={
//                   Number(loan.milestones.startTime) > 0 ? startDate : "Pending"
//                 }
//                 status={loan.active ? "complete" : "pending"}
//                 icon={<DollarSign className="h-4 w-4" />}
//               />

//               <TimelineItem
//                 title="Loan Claimed"
//                 description="The borrower has claimed the loan funds"
//                 date={
//                   Number(loan.milestones.claimedAt) > 0 ? startDate : "Pending"
//                 }
//                 status={loan.loanClaimed ? "complete" : "pending"}
//                 icon={<DollarSign className="h-4 w-4" />}
//               />

//               <TimelineItem
//                 title="Loan Repaid"
//                 description="The borrower has repaid the loan with interest"
//                 date={
//                   Number(loan.milestones.repaidAt) > 0 ? startDate : "Pending"
//                 }
//                 status={loan.repaid ? "complete" : "pending"}
//                 icon={<DollarSign className="h-4 w-4" />}
//               />

//               <TimelineItem
//                 title="Loan Completed"
//                 description={
//                   loan.repaid
//                     ? "The lender has claimed the repayment"
//                     : "The lender has claimed the NFT after grace period"
//                 }
//                 date={
//                   Number(loan.milestones.completedAt) > 0
//                     ? startDate
//                     : "Pending"
//                 }
//                 status={loan.completed ? "complete" : "pending"}
//                 icon={<CheckCircle className="h-4 w-4" />}
//               />
//             </div>
//           </TabsContent>
//         </Tabs>

//         <div className="flex justify-end gap-2 mt-4">
//           <Button variant="outline" onClick={onClose}>
//             Close
//           </Button>

//           {actionHandler && (
//             <Button
//               onClick={actionHandler}
//               disabled={actionDisabled || isProcessing}
//               className="bg-monad-500 hover:bg-monad-600 text-white"
//             >
//               {isProcessing ? (
//                 <>
//                   <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing
//                 </>
//               ) : (
//                 actionText
//               )}
//             </Button>
//           )}
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }

// function LoanStatusBadge({
//   completed,
//   repaid,
//   active,
//   isExpired,
//   isInGracePeriod,
//   isCancelled,
// }: {
//   completed: boolean;
//   repaid: boolean;
//   active: boolean;
//   isExpired: boolean;
//   isInGracePeriod: boolean;
//   isCancelled: boolean;
// }) {
//   if (completed) {
//     return <Badge className="bg-green-600 hover:bg-green-700">Completed</Badge>;
//   }

//   if (repaid) {
//     return <Badge className="bg-green-600 hover:bg-green-700">Repaid</Badge>;
//   }

//   if (active) {
//     if (isExpired) {
//       if (isInGracePeriod) {
//         return (
//           <Badge className="bg-amber-500 hover:bg-amber-600">
//             Grace Period
//           </Badge>
//         );
//       }
//       return <Badge className="bg-red-500 hover:bg-red-600">Expired</Badge>;
//     }

//     return <Badge className="bg-monad-500 hover:bg-monad-600">Active</Badge>;
//   } else if (isCancelled) {
//     return <Badge className="bg-red-500 hover:bg-red-600">Cancelled</Badge>;
//   }

//   return <Badge variant="secondary">Awaiting Funding</Badge>;
// }

// function TimelineItem({
//   title,
//   description,
//   date,
//   status,
//   icon,
// }: {
//   title: string;
//   description: string;
//   date: string;
//   status: "complete" | "pending" | "error";
//   icon: React.ReactNode;
// }) {
//   return (
//     <div className="flex gap-3">
//       <div
//         className={`
//         flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
//         ${
//           status === "complete"
//             ? "bg-monad-500 text-white"
//             : status === "error"
//             ? "bg-red-500 text-white"
//             : "bg-muted text-muted-foreground"
//         }
//       `}
//       >
//         {icon}
//       </div>

//       <div className="flex-1 pb-4 border-l border-muted pl-4 -ml-4 mt-1">
//         <div className="flex justify-between items-start">
//           <div>
//             <h4 className="font-medium">{title}</h4>
//             <p className="text-sm text-muted-foreground">{description}</p>
//           </div>
//           <span className="text-xs text-muted-foreground">{date}</span>
//         </div>
//       </div>
//     </div>
//   );
// }

// function truncateAddress(address: string) {
//   return `${address.slice(0, 6)}...${address.slice(-4)}`;
// }

// function getTokenSymbol(address: string) {
//   if (address.toLowerCase().includes("760afe")) return "wMON";
//   if (address.toLowerCase().includes("88b8e2")) return "USDT";
//   if (address.toLowerCase().includes("f81725")) return "ETH";
//   return "Token";
// }
