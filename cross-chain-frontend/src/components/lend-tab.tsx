"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/Components/privy/ui/card";
import { usePrivy } from "@privy-io/react-auth";
import { useToast } from "@/Components/privy/ui/use-toast";
import { useAccount, useWriteContract } from "wagmi";
import {
  NFT_LENDHUB_ADDRESS,
  NFT_LENDHUB_ABI,
  ERC20_ABI,
} from "./lib/constants";
import { getPendingListings, type LoanData } from "./lib/contract-utils";
import { Loader2 } from "lucide-react";
import { NFTCard } from "@/components/nft-card";
import { createPublicClient, formatEther, http } from "viem";
import { readContract } from "viem/actions";
import { monadTestnet } from "viem/chains";
import { LoanDetailsModal } from "./LoanDetailsModal";

export function LendTab() {
  const { authenticated, login } = usePrivy();
  const { address } = useAccount();
  const { toast } = useToast();
  const [pendingLoans, setPendingLoans] = useState<LoanData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFunding, setIsFunding] = useState(false);
  const [selectedLoanIndex, setSelectedLoanIndex] = useState<number | null>(
    null
  );

  const [modalLoan, setModalLoan] = useState<LoanData | null>(null);
  const [isBorrowing, setIsBorrowing] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<
    | "amountAsc"
    | "amountDesc"
    | "interestAsc"
    | "interestDesc"
    | "durationAsc"
    | "durationDesc"
  >("amountAsc");

  const { writeContractAsync: approveToken } = useWriteContract();
  const { writeContractAsync: fundLoan } = useWriteContract();

  const client = createPublicClient({
    chain: monadTestnet,
    transport: http(
      process.env.NEXT_PUBLIC_MONAD_TESTNET_RPC ||
        "https://testnet-rpc.monad.xyz"
    ),
  });

  useEffect(() => {
    const fetchLoans = async () => {
      setIsLoading(true);
      try {
        const listings = await getPendingListings();
        setPendingLoans(listings);
      } catch (error) {
        console.error("Error fetching loans:", error);
        toast({
          title: "Error",
          description: "Failed to fetch available loans",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchLoans();
  }, [toast]);

  const filteredLoans = pendingLoans
    .filter((loan) => {
      const query = searchQuery.toLowerCase();
      return (
        loan.nftId.toString().includes(query) ||
        loan.nftAddress.toLowerCase().includes(query)
      );
    })
    .sort((a, b) => {
      switch (sortOption) {
        case "amountAsc":
          return Number(a.loanAmount) - Number(b.loanAmount);
        case "amountDesc":
          return Number(b.loanAmount) - Number(a.loanAmount);
        case "interestAsc":
          return Number(a.interestRate) - Number(b.interestRate);
        case "interestDesc":
          return Number(b.interestRate) - Number(a.interestRate);
        case "durationAsc":
          return Number(a.loanDuration) - Number(b.loanDuration);
        case "durationDesc":
          return Number(b.loanDuration) - Number(a.loanDuration);
        default:
          return 0;
      }
    });

  const handleFundLoan = async (loan: LoanData, index: number) => {
    if (!authenticated) {
      login();
      return;
    }

    try {
      setIsFunding(true);
      setSelectedLoanIndex(index);

      // ✅ Get user's balance dynamically
      const rawBalance = await readContract(client, {
        address: loan.loanToken as `0x${string}`,
        abi: ERC20_ABI,
        functionName: "balanceOf",
        args: [address],
      });

      const userBalance = rawBalance as bigint;

      if (userBalance < loan.loanAmount) {
        const balanceFormatted = Number(formatEther(userBalance)).toFixed(2);
        const neededFormatted = Number(formatEther(loan.loanAmount)).toFixed(2);
        toast({
          title: "Insufficient Balance",
          description: `You have ${balanceFormatted} wMON but need ${neededFormatted} wMON`,
          variant: "destructive",
        });
        return;
      }

      await approveToken({
        address: loan.loanToken as `0x${string}`,
        abi: ERC20_ABI,
        functionName: "approve",
        args: [NFT_LENDHUB_ADDRESS, loan.loanAmount],
      });

      await new Promise((resolve) => setTimeout(resolve, 4000));

      toast({
        title: "Success",
        description: "Token approval successful",
      });

      await fundLoan({
        address: NFT_LENDHUB_ADDRESS,
        abi: NFT_LENDHUB_ABI,
        functionName: "fundLoan",
        args: [loan.loanId],
      });

      await new Promise((resolve) => setTimeout(resolve, 4000));

      toast({
        title: "Success",
        description: "Loan fund tx sent successfully",
      });

      const updatedLoans = [...pendingLoans];
      updatedLoans.splice(index, 1);
      setPendingLoans(updatedLoans);
    } catch (error) {
      console.error("Error funding loan:", error);
      toast({
        title: "Error",
        description: "Failed to fund loan",
        variant: "destructive",
      });
    } finally {
      setIsFunding(false);
      setSelectedLoanIndex(null);
    }
  };

  const handleModalAction = async (action: string) => {
    if (!modalLoan) return;

    if (action === "fundLoan") {
      const index = pendingLoans.findIndex(
        (l) => l.loanId === modalLoan.loanId
      );
      if (index !== -1) {
        await handleFundLoan(modalLoan, index);
      }
    } else {
      toast({
        title: "Not Available",
        description: `Action "${action}" is not supported here.`,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-foreground">
          Lend to NFT Owners
        </h1>
        <p className="text-muted-foreground mt-2">
          Browse available NFT loan requests and earn interest by funding loans
        </p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by Collection Address"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:w-1/2 p-2 border border-monad-border rounded bg-card text-sm"
        />

        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value as any)}
          className="p-2 border border-monad-border rounded bg-card text-sm"
        >
          <option value="amountAsc">Loan Amount ↑</option>
          <option value="amountDesc">Loan Amount ↓</option>
          <option value="interestAsc">Interest Rate ↑</option>
          <option value="interestDesc">Interest Rate ↓</option>
          <option value="durationAsc">Duration ↑</option>
          <option value="durationDesc">Duration ↓</option>
        </select>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-monad-500" />
        </div>
      ) : filteredLoans.length === 0 ? (
        <Card className="text-center py-12 border-monad-border bg-card">
          <CardContent>
            <p className="text-foreground">
              No active loan requests match your filters.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {filteredLoans.map((loan, index) => {
            const isLenderForThisLoan = loan.lender === address;

            let actionText = "Fund Loan";
            if (isLenderForThisLoan) {
              actionText = "You Funded This Loan";
            }

            return (
              <NFTCard
                loanId={loan.loanId}
                key={`${loan.nftAddress}-${Number(loan.nftId)}`}
                nftId={Number(loan.nftId)}
                nftAddress={loan.nftAddress}
                nftOwner={loan.nftOwner}
                loanAmount={loan.loanAmount}
                interestRate={Number(loan.interestRate)}
                loanDuration={Number(loan.loanDuration)}
                startTime={Number(loan.startTime)}
                repaid={loan.repaid}
                lender={loan.lender}
                loanToken={loan.loanToken}
                active={loan.active}
                completed={loan.completed}
                onAction={() => handleFundLoan(loan, index)}
                actionText={actionText}
                actionDisabled={isLenderForThisLoan}
                isProcessing={isFunding && selectedLoanIndex === index}
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

      {modalLoan && (
        <LoanDetailsModal
          isOpen={!!modalLoan}
          onClose={() => setModalLoan(null)}
          loan={modalLoan}
          onAction={handleModalAction}
          isProcessing={isFunding}
          isBorrowing={isBorrowing}
        />
      )}
    </div>
  );
}
