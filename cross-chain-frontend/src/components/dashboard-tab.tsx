"use client";

import { useState, useEffect } from "react";
import { Button } from "@/Components/privy/ui/button";
import { Card, CardContent } from "@/Components/privy/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/Components/privy/ui/tabs";
import { usePrivy } from "@privy-io/react-auth";
import { useToast } from "@/Components/privy/ui/use-toast";
import { useAccount, useWriteContract } from "wagmi";
import {
  NFT_LENDHUB_ADDRESS,
  NFT_LENDHUB_ADDRESS_V2,
  NFT_LENDHUB_ABI,
  NFT_LENDHUB_ABI_V2,
  ERC20_ABI,
} from "./lib/constants";
import { calculateRepaymentAmount } from "./lib/utils";
import { getAllUserLoans, type LoanData } from "./lib/contract-utils";
import { Loader2 } from "lucide-react";
import { NFTCard } from "@/components/nft-card";
import { LoanDetailsModal } from "@/components/LoanDetailsModal";
import { LoanStatus } from "./lib/LoanStatus";

export function DashboardTab() {
  const { authenticated, login, user } = usePrivy();
  const { address } = useAccount();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [myBorrowings, setMyBorrowings] = useState<LoanData[]>([]);
  const [myLendings, setMyLendings] = useState<LoanData[]>([]);
  const [activeTab, setActiveTab] = useState("borrowings");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isBorrowing, setIsBorrowing] = useState(false);
  const [processingLoanIndex, setProcessingLoanIndex] = useState<number | null>(
    null
  );
  const [modalLoan, setModalLoan] = useState<LoanData | null>(null);

  const { writeContractAsync: approveToken } = useWriteContract();
  const { writeContractAsync: repayLoan } = useWriteContract();
  const { writeContractAsync: claimLoan } = useWriteContract();
  const { writeContractAsync: claimRepayment } = useWriteContract();
  const { writeContractAsync: claimNFT } = useWriteContract();
  const { writeContractAsync: cancelLoan } = useWriteContract();

  useEffect(() => {
    if (!authenticated || !address) {
      return;
    }

    const fetchUserLoans = async () => {
      setIsLoading(true);
      try {
        console.log("Fetching loans for address:", address);
        const { borrowings, lendings } = await getAllUserLoans(address);

        setMyBorrowings([...borrowings]);
        setMyLendings([...lendings]);
      } catch (error) {
        console.error("Error fetching user loans:", error);
        toast({
          title: "Error",
          description: "Failed to fetch your loans",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserLoans();
    const interval = setInterval(fetchUserLoans, 300000);
    return () => clearInterval(interval);
  }, [authenticated, address]);

  const handleAction = async (
    loan: LoanData,
    index: number,
    action: string
  ) => {
    if (!authenticated) {
      login();
      return;
    }

    try {
      setIsProcessing(true);
      setProcessingLoanIndex(index);

      switch (action) {
        case "cancelLoan":
          await cancelLoan({
            // address: NFT_LENDHUB_ADDRESS, // version 1
            address: NFT_LENDHUB_ADDRESS_V2, // version 2
            // abi: NFT_LENDHUB_ABI, // version 1 ABI
            abi: NFT_LENDHUB_ABI_V2, // version 2 ABI
            functionName: "cancelLoanAndWithdrawNFT",
            args: [loan.loanId],
          });
          break;

        case "claimLoan":
          await claimLoan({
            // address: NFT_LENDHUB_ADDRESS, // version 1 address
            address: NFT_LENDHUB_ADDRESS_V2, // version 2 address
            // abi: NFT_LENDHUB_ABI, // version 1 ABI
            abi: NFT_LENDHUB_ABI_V2, // version 2 ABI
            functionName: "claimLoan",
            args: [loan.loanId],
          });
          break;
        case "repayLoan":
          const repaymentAmount = calculateRepaymentAmount(
            loan.loanAmount,
            Number(loan.interestRate)
          );
          await approveToken({
            address: loan.loanAddDetails.loanToken as `0x${string}`,
            abi: ERC20_ABI,
            functionName: "approve",
            // args: [NFT_LENDHUB_ADDRESS, repaymentAmount], // version 1
            args: [NFT_LENDHUB_ADDRESS_V2, repaymentAmount], // version 2
          });
          await repayLoan({
            // address: NFT_LENDHUB_ADDRESS, // version 1
            address: NFT_LENDHUB_ADDRESS_V2, // version 2
            // abi: NFT_LENDHUB_ABI, // version 1 ABI
            abi: NFT_LENDHUB_ABI_V2, // version 2 ABI
            functionName: "repayLoan",
            args: [loan.loanId],
          });
          break;
        case "claimRepayment":
          await claimRepayment({
            // address: NFT_LENDHUB_ADDRESS, // version 1 address
            address: NFT_LENDHUB_ADDRESS_V2, // version 2 address
            // abi: NFT_LENDHUB_ABI, // version 1 ABI
            abi: NFT_LENDHUB_ABI_V2, // version 2 ABI
            functionName: "claimRepayment",
            args: [loan.loanId],
          });
          break;
        case "claimNFT":
          await claimNFT({
            // address: NFT_LENDHUB_ADDRESS, // version 1 address
            address: NFT_LENDHUB_ADDRESS_V2, // version 2 address
            // abi: NFT_LENDHUB_ABI, // version 1 ABI
            abi: NFT_LENDHUB_ABI_V2, // version 2 ABI
            functionName: "claimNFT",
            args: [loan.loanId],
          });
          break;
      }
      // Wait for transaction confirmation
      await new Promise((resolve) => setTimeout(resolve, 4000));

      toast({ title: "Success", description: `${action} successful` });
    } catch (error) {
      console.error(`Error during ${action}:`, error);
      toast({
        title: "Error",
        description: `Failed to ${action}`,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setProcessingLoanIndex(null);
    }
  };

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-foreground">Loan Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Manage your borrowings and lendings
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8 bg-card border border-monad-border">
          <TabsTrigger
            value="borrowings"
            className="data-[state=active]:bg-monad-500 data-[state=active]:text-white"
          >
            My Borrowings
          </TabsTrigger>
          <TabsTrigger
            value="lendings"
            className="data-[state=active]:bg-monad-500 data-[state=active]:text-white"
          >
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
                <p className="text-foreground">
                  You don't have any active borrowings.
                </p>
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
                const isNotFunded = !loan.active; // !loan.status === LoanStatus.active;
                const isLoanClaimed = loan.loanClaimed;
                const isRepaid = loan.repaid;
                const isCompleted = loan.completed;
                const isClaimed = loan.milestones.startTime > 0;
                const isAwaitingClaim =
                  loan.active && loan.milestones.startTime === BigInt(0);
                loan.active &&
                  loan.loanAddDetails.lender !=
                    "0x0000000000000000000000000000000000000000";
                const isCancelled = loan.cancelled;

                // let actionText = "Waiting for a Lender";
                let actionText = "Cancel Loan";
                let onAction = null;
                let actionDisabled = true;

                if (isCompleted === true) {
                  actionText = "Loan Completed";
                } else if (isCancelled) {
                  actionText = "Loan Cancelled";
                } else if (isNotFunded) {
                  actionText = "Waiting for a Lender";
                } else if (isRepaid) {
                  actionText = "Loan Repaid";
                } else if (!isLoanClaimed && loan.active && !isCompleted) {
                  actionText = "Claim Loan";
                  actionDisabled = false;
                } else if (
                  isLoanClaimed &&
                  !isRepaid &&
                  !isCompleted &&
                  loan.active
                ) {
                  actionText = "Repay Loan";
                  onAction = () =>
                    handleAction(loan, index, !loan.repaid ? "repayLoan" : "");

                  actionDisabled = false;
                } else {
                }

                return (
                  <NFTCard
                    key={loan.loanId}
                    nftId={Number(loan.nftId)}
                    nftAddress={loan.loanAddDetails.nftAddress}
                    loanId={loan.loanId}
                    nftOwner={loan.loanAddDetails.nftOwner}
                    lender={loan.loanAddDetails.lender}
                    loanToken={loan.loanAddDetails.loanToken}
                    loanAmount={loan.loanAmount}
                    interestRate={Number(loan.interestRate)}
                    loanDuration={Number(loan.loanDuration)}
                    startTime={Number(loan.milestones.startTime)}
                    loanClaimed={loan.loanClaimed}
                    repaid={loan.repaid}
                    // onAction={() =>
                    //   handleAction(
                    //     loan,
                    //     index,
                    //     isLoanClaimed && !loan.completed && !loan.repaid
                    //       ? "repayLoan"
                    //       : "claimLoan" // repay met
                    //   )
                    // }
                    onAction={() => {
                      if (
                        !loan.active &&
                        !loan.repaid &&
                        !loan.loanClaimed &&
                        !loan.completed &&
                        !loan.cancelled
                      ) {
                        handleAction(loan, index, "cancelLoan");
                      } else if (
                        isLoanClaimed &&
                        !loan.completed &&
                        !loan.repaid
                      ) {
                        handleAction(loan, index, "repayLoan");
                      } else {
                        handleAction(loan, index, "claimLoan");
                      }
                    }}
                    actionText={actionText}
                    actionDisabled={actionDisabled}
                    isProcessing={isProcessing && processingLoanIndex === index}
                    showLender={true}
                    onClick={() => {
                      setModalLoan(loan);
                      // setIsBorrowing(user?.wallet?.address === loan.loanAddDetails.nftOwner);
                      setIsBorrowing(address === loan.loanAddDetails.nftOwner);
                    }}
                  />
                );
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
                <p className="text-foreground">
                  You don't have any active lendings.
                </p>
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
                const now = Math.floor(Date.now() / 1000);
                const loanEnd =
                  Number(loan.milestones.startTime) + Number(loan.loanDuration);
                const gracePeriodEnd = loanEnd + 7 * 86400; // 7 days grace period
                const canClaimNFT =
                  !loan.repaid && now > gracePeriodEnd && !loan.completed;
                const isCompleted = loan.completed;

                let actionText = "Waiting for Repayment";
                let onAction = null;
                let actionDisabled = true;

                if (isCompleted) {
                  actionText = "Loan Completed";
                } else if (loan.repaid && loan.active && !loan.completed) {
                  actionText = "Claim Repayment";
                  onAction = () =>
                    handleAction(
                      loan,
                      index,
                      loan.repaid && !loan.completed ? "claimRepayment" : ""
                    );
                  actionDisabled = false;
                } else if (loan.repaid && loan.completed && !loan.active) {
                  actionText = "Repayment Claimed";
                } else if (canClaimNFT) {
                  actionText = "Claim NFT";
                  onAction = () =>
                    handleAction(
                      loan,
                      index,
                      !loan.repaid && canClaimNFT ? "claimNFT" : ""
                    );
                  actionDisabled = false;
                } else if (canClaimNFT && loan.completed) {
                  actionText = "NFT Claimed";
                }

                return (
                  <NFTCard
                    key={loan.loanId}
                    nftId={Number(loan.nftId)}
                    nftAddress={loan.loanAddDetails.nftAddress}
                    loanId={loan.loanId}
                    nftOwner={loan.loanAddDetails.nftOwner}
                    lender={loan.loanAddDetails.lender}
                    loanToken={loan.loanAddDetails.loanToken}
                    loanAmount={loan.loanAmount}
                    interestRate={Number(loan.interestRate)}
                    loanDuration={Number(loan.loanDuration)}
                    startTime={Number(loan.milestones.startTime)}
                    repaid={loan.repaid}
                    active={loan.active}
                    completed={loan.completed}
                    cancelled={loan.cancelled}
                    onAction={() =>
                      handleAction(
                        loan,
                        index,
                        loan.repaid && !loan.completed && !canClaimNFT
                          ? "claimRepayment"
                          : "claimNFT"
                      )
                    }
                    actionText={actionText}
                    actionDisabled={actionDisabled}
                    isProcessing={isProcessing && processingLoanIndex === index}
                    showLender={false}
                    onClick={() => {
                      setModalLoan(loan);
                      setIsBorrowing(false);
                    }}
                  />
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {modalLoan && (
        <LoanDetailsModal
          isOpen={!!modalLoan}
          onClose={() => setModalLoan(null)}
          loan={modalLoan}
          onAction={(action) => {
            if (!modalLoan) return;
            const loanIndex = [...myBorrowings, ...myLendings].findIndex(
              (l) => l.loanId === modalLoan.loanId
            );
            handleAction(modalLoan, loanIndex, action);
          }}
          isProcessing={isProcessing}
          isBorrowing={isBorrowing}
        />
      )}
    </div>
  );
}
