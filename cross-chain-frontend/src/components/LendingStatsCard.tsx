// "use client";

// import { useEffect, useState } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/Components/privy/ui/card";
// import { getActiveLoans, getCompletedLoans } from "@/components/lib/contract-utils";
// import { Loader2 } from "lucide-react";

// export function LendingStatsCard() {
//   const [totalLoans, setTotalLoans] = useState(0);
//   const [totalVolume, setTotalVolume] = useState(0);
//   const [averageInterest, setAverageInterest] = useState(0);
//   const [activeLoans, setActiveLoans] = useState(0);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchStats = async () => {
//       setLoading(true);
//       try {
//         const completed = await getCompletedLoans();
//         const active = await getActiveLoans();

//         const allLoans = [...completed, ...active];
//         const volume = allLoans.reduce((sum, loan) => sum + Number(loan.loanAmount), 0);
//         const avgInterest =
//           allLoans.length > 0
//             ? allLoans.reduce((sum, loan) => sum + Number(loan.interestRate), 0) / allLoans.length
//             : 0;

//         setTotalLoans(allLoans.length);
//         setTotalVolume(volume);
//         setAverageInterest(avgInterest);
//         setActiveLoans(active.length);
//       } catch (error) {
//         console.error("Failed to fetch stats", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchStats();
//   }, []);

//   return (
//     <Card className="bg-card border-monad-border">
//       <CardHeader>
//         <CardTitle className="text-lg text-foreground">Platform Lending Stats</CardTitle>
//       </CardHeader>
//       <CardContent>
//         {loading ? (
//           <div className="flex justify-center items-center py-8">
//             <Loader2 className="h-5 w-5 animate-spin text-monad-500" />
//           </div>
//         ) : (
//           <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm text-foreground">
//             <div>
//               <p className="font-semibold">Total Loans</p>
//               <p>{totalLoans}</p>
//             </div>
//             <div>
//               <p className="font-semibold">Total Volume</p>
//               <p>{(totalVolume / 1e18).toFixed(2)} wMON</p>
//             </div>
//             <div>
//               <p className="font-semibold">Avg. Interest</p>
//               <p>{averageInterest.toFixed(2)}%</p>
//             </div>
//             <div>
//               <p className="font-semibold">Completed Loans</p>
//               <p>{activeLoans}</p>
//             </div>
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   );
// }

//////////////////////////////---------------------------------------////////////////////////////////////

"use client";

import type React from "react";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/Components/privy/ui/card";
import {
  getActiveLoans,
  getCompletedLoans,
} from "@/components/lib/contract-utils";
import { Loader2, TrendingUp, Users, Percent, CheckCircle } from "lucide-react";

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
        const volume = allLoans.reduce(
          (sum, loan) => sum + Number(loan.loanAmount),
          0
        );
        const avgInterest =
          allLoans.length > 0
            ? allLoans.reduce(
                (sum, loan) => sum + Number(loan.interestRate),
                0
              ) / allLoans.length
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
    <Card className="border border-monad-border shadow-sm overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-monad-500 to-monad-100/50 border-b border-monad-border">
        <CardTitle className="text-lg flex items-center gap-2">
          <div className="h-6 w-6 rounded-full bg-monad-200 flex items-center justify-center">
            <TrendingUp className="h-3 w-3 text-monad-500" />
          </div>
          Platform Lending Stats
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-monad-500" />
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Loans"
              value={totalLoans.toString()}
              icon={<Users className="h-4 w-4 text-monad-500" />}
              color="monad"
            />

            <StatCard
              title="Total Volume"
              value={`${(totalVolume / 1e18).toFixed(2)} wMON`}
              icon={<TrendingUp className="h-4 w-4 text-monad-600" />}
              color="monad"
            />

            <StatCard
              title="Avg. Interest"
              value={`${averageInterest.toFixed(2)}%`}
              icon={<Percent className="h-4 w-4 text-monad-700" />}
              color="monad"
            />

            <StatCard
              title="Active Loans"
              value={activeLoans.toString()}
              icon={<CheckCircle className="h-4 w-4 text-monad-800" />}
              color="monad"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: "monad";
}

function StatCard({ title, value, icon, color }: StatCardProps) {
  return (
    <div className="group rounded-xl border border-monad-border bg-card p-4 transition-all duration-200 hover:shadow-md hover:border-monad-300">
      <div className="flex items-center gap-2 mb-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-monad-100">
          {icon}
        </div>
        <h3 className="font-medium text-sm text-muted-foreground">{title}</h3>
      </div>
      <p className="text-2xl font-bold">{value}</p>

      {/* Mini chart placeholder - could be replaced with actual mini charts */}
      <div className="mt-3 h-6 w-full overflow-hidden rounded-full bg-monad-100/50">
        <div
          className="h-full bg-monad-300"
          style={{ width: `${Math.random() * 60 + 40}%` }}
        />
      </div>
    </div>
  );
}
