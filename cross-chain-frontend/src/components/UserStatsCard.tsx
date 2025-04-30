"use client";

import { useEffect, useState } from "react";
import { LoanData } from "@/components/lib/contract-utils";
import { LoanStatus } from "./lib/LoanStatus";

interface UserStatsCardProps {
  loans: LoanData[];
  address: string;
}

export function UserStatsCard({ loans, address }: UserStatsCardProps) {
  const [completedLoans, setCompletedLoans] = useState<LoanData[]>([]);
  const [totalVolume, setTotalVolume] = useState(0);
  const [uniqueNFTs, setUniqueNFTs] = useState<Set<string>>(new Set());

  useEffect(() => {
    const filtered = loans.filter((l) => l.completed);
    const volume = filtered.reduce(
      (acc, loan) => acc + Number(loan.loanAmount),
      0
    );

    const nftSet = new Set<string>();
    filtered.forEach((loan) => {
      nftSet.add(
        `${loan.loanAddDetails.nftAddress.toLowerCase()}-${loan.nftId.toString()}`
      );
    });

    setCompletedLoans(filtered);
    setTotalVolume(volume);
    setUniqueNFTs(nftSet);
  }, [loans]);

  return (
    <div className="bg-card border border-monad-border rounded-lg p-6 mb-8 shadow-sm">
      <h2 className="text-xl font-bold text-foreground mb-4">User Stats</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-muted-foreground">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted">
            Completed Loans
          </p>
          <p className="text-lg font-semibold text-foreground">
            {completedLoans.length}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-muted">
            Total Loan Volume
          </p>
          <p className="text-lg font-semibold text-foreground">
            {(Number(totalVolume) / 1e18).toFixed(2)} Tokens
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-muted">
            Unique NFTs Used
          </p>
          <p className="text-lg font-semibold text-foreground">
            {uniqueNFTs.size}
          </p>
        </div>
      </div>
    </div>
  );
}
