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
import { Loader2, Bell, MessageCircle } from "lucide-react";
import { NFTCard } from "@/components/nft-card";
import { LoanDetailsModal } from "@/components/LoanDetailsModal";
import { LoanStatus } from "./lib/LoanStatus";
import { AuthWrapper } from "@/Components/privy/auth-wrapper";
import { createPublicClient, http } from "viem";
import { monadTestnet } from "viem/chains";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/Components/privy/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/Components/privy/ui/select";

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
  const [showHistory, setShowHistory] = useState(false);
  const [dashboardFilter, setDashboardFilter] = useState<string>("all");
  const [historySort, setHistorySort] = useState<"desc" | "asc">("desc");
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [telegramUsername, setTelegramUsername] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  const { writeContractAsync: approveToken } = useWriteContract();
  const { writeContractAsync: repayLoan } = useWriteContract();
  const { writeContractAsync: claimLoan } = useWriteContract();
  const { writeContractAsync: claimRepayment } = useWriteContract();
  const { writeContractAsync: claimNFT } = useWriteContract();
  const { writeContractAsync: cancelLoan } = useWriteContract();

  const client = createPublicClient({
    chain: monadTestnet,
    transport: http(
      process.env.NEXT_PUBLIC_MONAD_TESTNET_RPC ||
        "https://testnet-rpc.monad.xyz"
    ),
  });

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
          // Simulate the transaction
          try {
            await client.simulateContract({
              address: NFT_LENDHUB_ADDRESS_V2,
              abi: NFT_LENDHUB_ABI_V2,
              functionName: "cancelLoanAndWithdrawNFT",
              args: [loan.loanId],
              account: address,
            });
          } catch (error: any) {
            toast({
              title: "Loan Cancellation Error",
              description: error?.message || "This transaction will fail.",
              variant: "destructive",
            });

            return;
          }

          await cancelLoan({
            address: NFT_LENDHUB_ADDRESS_V2,
            abi: NFT_LENDHUB_ABI_V2,
            functionName: "cancelLoanAndWithdrawNFT",
            args: [loan.loanId],
          });
          break;

        case "claimLoan":
          // Simulate the transaction
          try {
            await client.simulateContract({
              address: NFT_LENDHUB_ADDRESS_V2,
              abi: NFT_LENDHUB_ABI_V2,
              functionName: "claimLoan",
              args: [loan.loanId],
              account: address,
            });
          } catch (error: any) {
            toast({
              title: "Loan Claim Error",
              description: error?.message || "This transaction will fail.",
              variant: "destructive",
            });

            return;
          }

          await claimLoan({
            address: NFT_LENDHUB_ADDRESS_V2,
            abi: NFT_LENDHUB_ABI_V2,
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
            args: [NFT_LENDHUB_ADDRESS_V2, repaymentAmount],
          });

          // Simulate the transaction
          try {
            await client.simulateContract({
              address: NFT_LENDHUB_ADDRESS_V2,
              abi: NFT_LENDHUB_ABI_V2,
              functionName: "repayLoan",
              args: [loan.loanId],
              account: address,
            });
          } catch (error: any) {
            toast({
              title: "Repayment Error",
              description: error?.message || "This transaction will fail.",
              variant: "destructive",
            });

            return;
          }

          await repayLoan({
            address: NFT_LENDHUB_ADDRESS_V2,
            abi: NFT_LENDHUB_ABI_V2,
            functionName: "repayLoan",
            args: [loan.loanId],
          });
          break;
        case "claimRepayment":
          await claimRepayment({
            address: NFT_LENDHUB_ADDRESS_V2,
            abi: NFT_LENDHUB_ABI_V2,
            functionName: "claimRepayment",
            args: [loan.loanId],
          });
          break;
        case "claimNFT":
          await claimNFT({
            address: NFT_LENDHUB_ADDRESS_V2,
            abi: NFT_LENDHUB_ABI_V2,
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

  // Helper to filter by dashboard status
  function filterLoansByStatus(loans: LoanData[], status: string): LoanData[] {
    if (status === "active")
      return loans.filter((l) => l.active && !l.completed && !l.cancelled);
    if (status === "completed") return loans.filter((l) => l.completed);
    if (status === "pending")
      return loans.filter((l) => !l.active && !l.completed && !l.cancelled);
    return loans;
  }

  // Add this function to handle notification registration
  const handleNotificationRegistration = async () => {
    if (!telegramUsername) {
      toast({
        title: "Error",
        description: "Please enter your Telegram username",
        variant: "destructive",
      });
      return;
    }

    setIsRegistering(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_NOTIFICATION_API}/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            address,
            telegramUsername: telegramUsername.replace("@", ""),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Registration failed");
      }

      toast({
        title: "Success",
        description: "Successfully registered for notifications!",
      });
      setShowNotificationModal(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to register for notifications",
        variant: "destructive",
      });
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <AuthWrapper>
      <div className="mx-auto max-w-7xl px-2 sm:px-4">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-foreground">Loan Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Manage your borrowings and lendings
          </p>
        </div>
        {/* Filter and Notification Icons Row */}
        <div className="mb-4 flex justify-end items-center gap-2">
          <button
            className="p-2 rounded-full hover:bg-muted transition-colors"
            aria-label="Register for Notifications"
            onClick={() => setShowNotificationModal(true)}
          >
            <MessageCircle className="h-6 w-6 text-monad-500" />
          </button>
          <button
            className="p-2 rounded-full hover:bg-muted transition-colors"
            aria-label="View Transaction History"
            onClick={() => setShowHistory(true)}
          >
            <Bell className="h-6 w-6 text-monad-500" />
          </button>
          <Select value={dashboardFilter} onValueChange={setDashboardFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
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
            ) : filterLoansByStatus(myBorrowings, dashboardFilter).length ===
              0 ? (
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
                {filterLoansByStatus(myBorrowings, dashboardFilter).map(
                  (loan, index) => {
                    const isNotFunded = !loan.active;
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
                        handleAction(
                          loan,
                          index,
                          !loan.repaid ? "repayLoan" : ""
                        );

                      actionDisabled = false;
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
                        isProcessing={
                          isProcessing && processingLoanIndex === index
                        }
                        showLender={true}
                        onClick={() => {
                          setModalLoan(loan);
                          setIsBorrowing(
                            address === loan.loanAddDetails.nftOwner
                          );
                        }}
                      />
                    );
                  }
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="lendings">
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-monad-500" />
              </div>
            ) : filterLoansByStatus(myLendings, dashboardFilter).length ===
              0 ? (
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
                {filterLoansByStatus(myLendings, dashboardFilter).map(
                  (loan, index) => {
                    const now = Math.floor(Date.now() / 1000);
                    const loanEnd =
                      Number(loan.milestones.startTime) +
                      Number(loan.loanDuration);
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
                        isProcessing={
                          isProcessing && processingLoanIndex === index
                        }
                        showLender={false}
                        onClick={() => {
                          setModalLoan(loan);
                          setIsBorrowing(false);
                        }}
                      />
                    );
                  }
                )}
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

        {/* Transaction History Modal - add pr-2 to scrollable area */}
        <Dialog open={showHistory} onOpenChange={setShowHistory}>
          <DialogContent className="max-w-lg max-h-[90vh] flex flex-col">
            <DialogTitle>Transaction History</DialogTitle>
            <div className="mb-4 flex justify-end flex-shrink-0">
              <Select
                value={historySort}
                onValueChange={(v) => setHistorySort(v as "desc" | "asc")}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">Newest First</SelectItem>
                  <SelectItem value="asc">Oldest First</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Tabs
              defaultValue="active"
              className="mt-4 flex flex-col flex-1 min-h-0"
            >
              <TabsList className="grid grid-cols-3 mb-4 flex-shrink-0">
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
              </TabsList>
              <div className="flex-1 overflow-hidden">
                {["active", "completed", "pending"].map((tab) => (
                  <TabsContent
                    value={tab}
                    key={tab}
                    className="h-full overflow-y-auto max-h-[50vh] data-[state=active]:flex data-[state=active]:flex-col pr-2"
                  >
                    {filteredLoans([...myBorrowings, ...myLendings], tab).sort(
                      (a, b) =>
                        historySort === "desc"
                          ? Number(b.milestones.startTime) -
                            Number(a.milestones.startTime)
                          : Number(a.milestones.startTime) -
                            Number(b.milestones.startTime)
                    ).length === 0 ? (
                      <div className="flex-1 flex items-center justify-center py-8">
                        <p className="text-muted-foreground text-center">
                          No {tab} loans.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2 pb-4">
                        {filteredLoans([...myBorrowings, ...myLendings], tab)
                          .sort((a, b) =>
                            historySort === "desc"
                              ? Number(b.milestones.startTime) -
                                Number(a.milestones.startTime)
                              : Number(a.milestones.startTime) -
                                Number(b.milestones.startTime)
                          )
                          .map((loan: LoanData) => (
                            <LoanHistoryItem
                              key={loan.loanId}
                              loan={loan}
                              address={address ?? ""}
                            />
                          ))}
                      </div>
                    )}
                  </TabsContent>
                ))}
              </div>
            </Tabs>
          </DialogContent>
        </Dialog>

        {/* Notification Registration Modal */}
        <Dialog
          open={showNotificationModal}
          onOpenChange={setShowNotificationModal}
        >
          <DialogContent className="max-w-md w-full px-2 sm:px-6 py-6">
            <DialogTitle>Register for Telegram Notifications</DialogTitle>
            <div className="space-y-4 py-4">
              <p className="text-sm text-muted-foreground">
                Get notified about your loan milestones and important updates
                via Telegram.
              </p>
              {/* <div className="space-y-2">
                <label htmlFor="telegram" className="text-sm font-medium">
                  Telegram Username
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    id="telegram"
                    type="text"
                    placeholder="@username"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={telegramUsername}
                    onChange={(e) => setTelegramUsername(e.target.value)}
                  />
                  <Button
                    onClick={handleNotificationRegistration}
                    disabled={isRegistering}
                    className="bg-monad-500 hover:bg-monad-600 text-white w-full sm:w-auto"
                  >
                    {isRegistering ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Register"
                    )}
                  </Button>
                </div>
              </div> */}
              <div className="text-sm text-muted-foreground">
                <p>To get started:</p>
                <ol className="list-decimal list-inside space-y-1 mt-2">
                  <li>
                    Start a chat with our bot:{" "}
                    <a
                      href="https://t.me/lendhub_notification_bot"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-monad-500 hover:underline"
                    >
                      Lendhub Notify Bot
                    </a>
                  </li>
                  <li>Enter your Telegram username above</li>
                  <li>Click Register to start receiving notifications</li>
                </ol>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AuthWrapper>
  );
}

// Helper to filter loans by status
function filteredLoans(loans: LoanData[], status: string): LoanData[] {
  if (status === "active") {
    return loans.filter(
      (l: LoanData) => l.active && !l.completed && !l.cancelled
    );
  }
  if (status === "completed") {
    return loans.filter((l: LoanData) => l.completed);
  }
  if (status === "pending") {
    return loans.filter(
      (l: LoanData) => !l.active && !l.completed && !l.cancelled
    );
  }
  return loans;
}

// LoanHistoryItem component for rendering a single loan row
function LoanHistoryItem({
  loan,
  address,
}: {
  loan: LoanData;
  address: string;
}) {
  return (
    <div className="border-b border-muted py-2 flex flex-col gap-1">
      <div className="flex justify-between items-center">
        <span className="font-mono text-xs text-muted-foreground">
          #{loan.loanId.toString()}
        </span>
        <span className="text-xs ">
          {loan.loanAddDetails.nftOwner === address ? "Borrowing" : "Lending"}
        </span>
        <span className="text-xs capitalize">
          {loan.completed
            ? "Completed"
            : loan.repaid
            ? "Repaid"
            : loan.active
            ? "Active"
            : loan.cancelled
            ? "Cancelled"
            : "Pending"}
        </span>
      </div>
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Amount: {Number(loan.loanAmount) / 1e18}</span>
        <span>
          {loan.milestones.startTime
            ? new Date(
                Number(loan.milestones.startTime) * 1000
              ).toLocaleDateString()
            : "-"}
        </span>
      </div>
    </div>
  );
}
