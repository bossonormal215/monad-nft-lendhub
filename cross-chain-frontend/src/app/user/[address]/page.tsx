// app/user/[address]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getAllUserLoans, getUserLoans } from "@/components/lib/contract-utils";
import { LoanData } from "@/components/lib/contract-utils";
import { Loader2 } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/Components/privy/ui/tabs";
import { NFTCard } from "@/components/nft-card";
import { UserStatsCard } from "@/components/UserStatsCard";
import { LoanStatus } from "@/components/lib/LoanStatus";

export default function UserHistoryPage() {
  const params = useParams();
  const userAddress = params?.address as string;

  const [isLoading, setIsLoading] = useState(true);
  const [loans, setLoans] = useState<LoanData[]>([]);
  const [tab, setTab] = useState("active");

  useEffect(() => {
    const fetchUserLoans = async () => {
      if (!userAddress) return;
      setIsLoading(true);
      try {
        const fetchedLoans = await getUserLoans(userAddress);
        const { borrowings, lendings } = await getAllUserLoans(userAddress);
        const allLoans = [...borrowings, ...lendings];
        setLoans(allLoans);
        // setLoans(fetchedLoans);
      } catch (error) {
        console.error("Error fetching user history:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserLoans();
  }, [userAddress]);

  const filteredLoans = (
    status: "active" | "pending" | "completed" | "Cancelled" | "stat"
  ) => {
    if (status === "active")
      return loans.filter((l) => l.active && !l.completed);
    // return loans.filter(
    //   (l) =>
    //     l.status !== LoanStatus.Completed && l.status === LoanStatus.active
    // );

    if (status === "pending")
      return loans.filter((l) => !l.active && !l.completed && !l.cancelled);
    // return loans.filter(
    //   (l) =>
    //     l.status !== LoanStatus.Completed &&
    //     l.status !== LoanStatus.active &&
    //     l.status !== LoanStatus.cancelled
    // );
    if (status === "completed") return loans.filter((l) => l.completed);
    // if (status === "completed")
    //   return loans.filter((l) => l.status === LoanStatus.Completed);
    if (status === "Cancelled") return loans.filter((l) => l.cancelled);
    // if (status === "Cancelled")
    //   return loans.filter((l) => l.status === LoanStatus.cancelled);
    if (status === "stat") return loans.filter((l) => l.completed);
    return [];
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-foreground text-center">
        User History
      </h1>
      <p className="text-center text-muted-foreground break-words mb-6 text-sm">
        {userAddress}
      </p>

      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="flex justify-center gap-4 mb-6">
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="Cancelled">Cancelled</TabsTrigger>
          <TabsTrigger value="stat">Stat</TabsTrigger>
        </TabsList>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-monad-500" />
          </div>
        ) : (
          ["active", "pending", "completed", "Cancelled", "stat"].map(
            (status) => (
              <TabsContent key={status} value={status}>
                {filteredLoans(status as any).length === 0 ? (
                  <p className="text-muted-foreground text-center">
                    No {status} loans found for this user.
                  </p>
                ) : (
                  <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                    {filteredLoans(status as any).map((loan) => (
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
                        // repaid={loan.status === LoanStatus.repaid}
                        active={loan.active}
                        // active={loan.status === LoanStatus.active}
                        completed={loan.completed}
                        // completed={loan.status === LoanStatus.Completed}
                        imageUrl={loan.imageUrl}
                        actionText={"View Only"}
                        actionDisabled={true}
                        showLender={true}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
            )
          )
        )}
      </Tabs>
    </div>
  );
}
