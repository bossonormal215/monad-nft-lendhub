"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/privy/ui/card";
import { getActiveLoans, getCompletedLoans } from "@/components/lib/contract-utils";
import { Loader2 } from "lucide-react";

export function LendingStatsCard() {
  const [totalLoans, setTotalLoans] = useState(0);
  const [totalVolume, setTotalVolume] = useState(0);
  const [averageInterest, setAverageInterest] = useState(0);
  const [activeLoans, setActiveLoans] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const completed = await getCompletedLoans();
        const active = await getActiveLoans();

        const allLoans = [...completed, ...active];
        const volume = allLoans.reduce((sum, loan) => sum + Number(loan.loanAmount), 0);
        const avgInterest =
          allLoans.length > 0
            ? allLoans.reduce((sum, loan) => sum + Number(loan.interestRate), 0) / allLoans.length
            : 0;

        setTotalLoans(allLoans.length);
        setTotalVolume(volume);
        setAverageInterest(avgInterest);
        setActiveLoans(active.length);
      } catch (error) {
        console.error("Failed to fetch stats", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <Card className="bg-card border-monad-border">
      <CardHeader>
        <CardTitle className="text-lg text-foreground">Platform Lending Stats</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-monad-500" />
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm text-foreground">
            <div>
              <p className="font-semibold">Total Loans</p>
              <p>{totalLoans}</p>
            </div>
            <div>
              <p className="font-semibold">Total Volume</p>
              <p>{(totalVolume / 1e18).toFixed(2)} wMON</p>
            </div>
            <div>
              <p className="font-semibold">Avg. Interest</p>
              <p>{averageInterest.toFixed(2)}%</p>
            </div>
            <div>
              <p className="font-semibold">Active Loans</p>
              <p>{activeLoans}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
