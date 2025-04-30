// components/UserHistory.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getUserLoans } from "@/components/lib/contract-utils";
import { LoanData } from "@/components/lib/contract-utils";
import { Loader2 } from "lucide-react";
import { NFTCard } from "@/components/nft-card";
import { LoanStatus } from "./lib/LoanStatus";

export default function UserHistoryPage() {
  const params = useParams();
  const userAddress = params?.address as string;

  const [isLoading, setIsLoading] = useState(true);
  const [loans, setLoans] = useState<LoanData[]>([]);

  useEffect(() => {
    const fetchUserLoans = async () => {
      if (!userAddress) return;
      setIsLoading(true);
      try {
        const fetchedLoans = await getUserLoans(userAddress);
        setLoans(fetchedLoans);
      } catch (error) {
        console.error("Error fetching user history:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserLoans();
  }, [userAddress]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4 text-foreground">
        User History: {userAddress}
      </h1>
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-monad-500" />
        </div>
      ) : loans.length === 0 ? (
        <p className="text-muted-foreground">No loans found for this user.</p>
      ) : (
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {loans.map((loan) => (
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
              // repaid={loan.status === LoanStatus.repaid} // Assuming 2 is the repaid status
              active={loan.active}
              // active={loan.status === LoanStatus.active} // Assuming 1 is the active status
              completed={loan.completed}
              // completed={loan.status === LoanStatus.Completed} // Assuming 3 is the completed status
              // cancelled={loan.status === LoanStatus.cancelled} // Assuming 4 is the cancelled status
              // defaulted={loan.status === 5} // Assuming 5 is the defaulted status
              imageUrl={loan.imageUrl}
              actionText={"View Only"}
              actionDisabled={true}
              showLender={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}
