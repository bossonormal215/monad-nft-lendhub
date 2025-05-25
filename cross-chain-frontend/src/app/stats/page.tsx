"use client";

import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  ArrowDownLeft,
  ArrowUpRight,
  CheckCircle,
  Clock,
  Hourglass,
  Loader2,
  RefreshCw,
  Wallet,
  Package,
  ExternalLink,
  Search,
} from "lucide-react";
import type {
  NftListed,
  LoanFunded,
  LoanClaimed,
  LoanRepaid,
  RepaymentClaimed,
  NFTClaimedByLender,
  NFTWithdrawn,
} from "@/components/types/envio";
import { Badge } from "@/Components/privy/ui/badge";
import { Button } from "@/Components/privy/ui/button";
import { Input } from "@/Components/privy/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/privy/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/Components/privy/ui/tooltip";
import { Card, CardContent } from "@/Components/privy/ui/card";
import { ethers } from "ethers";
import {
  NFT_LENDHUB_ABI_V2,
  NFT_LENDHUB_ADDRESS_V2,
} from "@/components/lib/constants";

// Helper to format address
const formatAddress = (addr: string) =>
  addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "-";

// Helper to format amount (wei to wMON)
const formatAmount = (wei: string) => (Number(wei) / 1e18).toFixed(2);

// Helper to format NFT
const formatNFT = (nftId: string) => {
  if (!nftId) return "-";
  if (nftId === "undefined") return "-";

  // If the NFT ID is very long (more than 12 chars), truncate it
  if (nftId.length > 12) {
    return `Token #${nftId.slice(0, 8)}...`;
  }
  return `Token #${nftId}`;
};

// Helper to get status
const getStatus = (type: string) => {
  if (type === "NFTListed") return "Pending";
  if (["LoanFunded", "LoanClaimed"].includes(type)) return "Active";
  if (
    [
      "LoanRepaid",
      "RepaymentClaimed",
      "NFTClaimedByLender",
      "NFTWithdrawn",
    ].includes(type)
  )
    return "Completed";
  return "Unknown";
};

// Helper to get action label
const getAction = (type: string) => {
  if (type === "NFTListed") return "ListedNftForLoan"; // ListedNftForLoan
  if (type === "LoanFunded") return "FundedLoan"; //
  if (type === "LoanClaimed") return "ClaimedLoan"; // ClaimedLoan
  if (type === "LoanRepaid") return "RepaidLoan"; //
  if (type === "RepaymentClaimed") return "ClaimedRepayment"; // ClaimedRepayment
  if (type === "NFTClaimedByLender") return "ClaimedNft"; // ClaimedNft
  if (type === "NFTWithdrawn") return "WithdrawnNft"; // WithdrawnNft
  return type;
};

// Helper to get action icon
const getActionIcon = (type: string) => {
  switch (type) {
    case "NFTListed":
      return <Package className="h-4 w-4 text-purple-400" />;
    case "LoanFunded":
      return <ArrowDownLeft className="h-4 w-4 text-green-400" />;
    case "LoanClaimed":
      return <Wallet className="h-4 w-4 text-blue-400" />;
    case "LoanRepaid":
      return <ArrowUpRight className="h-4 w-4 text-amber-400" />;
    case "RepaymentClaimed":
      return <CheckCircle className="h-4 w-4 text-green-400" />;
    case "NFTClaimedByLender":
      return <Package className="h-4 w-4 text-pink-400" />;
    case "NFTWithdrawn":
      return <Package className="h-4 w-4 text-indigo-400" />;
    default:
      return <RefreshCw className="h-4 w-4 text-gray-400" />;
  }
};

// Helper to get status badge
const getStatusBadge = (status: string) => {
  switch (status) {
    case "Active":
      return (
        <Badge
          variant="outline"
          className="bg-blue-950/50 text-blue-300 border-blue-800"
        >
          <Clock className="mr-1 h-3 w-3" /> Active
        </Badge>
      );
    case "Pending":
      return (
        <Badge
          variant="outline"
          className="bg-amber-950/50 text-amber-300 border-amber-800"
        >
          <Hourglass className="mr-1 h-3 w-3" /> Pending
        </Badge>
      );
    case "Completed":
      return (
        <Badge
          variant="outline"
          className="bg-green-950/50 text-green-300 border-green-800"
        >
          <CheckCircle className="mr-1 h-3 w-3" /> Completed
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="bg-gray-800 text-gray-300">
          {status}
        </Badge>
      );
  }
};

const GET_ACTIVITY = `
  query GetActivity {
    Nftlendhub_NFTListed(limit: 100000) {
      id loanId nftOwner nftAddress nftId loanAmount interestRate duration loanToken _blockNumber _timestamp
    }
    Nftlendhub_LoanFunded(limit: 100000) {
      id loanId lender _blockNumber _timestamp
    }
    Nftlendhub_LoanClaimed(limit: 1000000) {
      id loanId borrower _blockNumber _timestamp
    }
    Nftlendhub_LoanRepaid(limit: 1000000) {
      id loanId borrower  _blockNumber _timestamp
    }
    Nftlendhub_RepaymentClaimed(limit: 100000) {
      id loanId lender _blockNumber _timestamp
    }
    Nftlendhub_NFTClaimedByLender(limit: 100000) {
      id loanId lender borrower _blockNumber _timestamp
    }
    Nftlendhub_NFTWithdrawn(limit: 100000) {
      id loanId owner _blockNumber _timestamp
    }
  }
`;

export default function ActivityFeed() {
  const [allEvents, setAllEvents] = useState<any[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  // Add NFT name cache state
  const [nftNames, setNftNames] = useState<{ [key: string]: string }>({});

  const [stats, setStats] = useState({
    totalCompletedAmount: 0,
    totalCompleted: 0,
    totalActive: 0,
    totalPending: 0,
  });

  // Fetch stats from contract using ethers.js
  useEffect(() => {
    async function fetchStats() {
      try {
        const provider = new ethers.providers.JsonRpcProvider(
          process.env.NEXT_PUBLIC_MONAD_TESTNET_RPC
        );
        const contract = new ethers.Contract(
          NFT_LENDHUB_ADDRESS_V2,
          NFT_LENDHUB_ABI_V2,
          provider
        );
        const allLoans = await contract.getAllLoans();
        let totalCompletedAmount = 0,
          totalCompleted = 0,
          totalActive = 0,
          totalPending = 0;
        for (const loan of allLoans) {
          if (loan.completed) {
            totalCompleted++;
            totalCompletedAmount += Number(loan.loanAmount);
          } else if (loan.active) {
            totalActive++;
          } else if (!loan.completed && !loan.active && !loan.cancelled) {
            totalPending++;
          }
        }
        setStats({
          totalCompletedAmount,
          totalCompleted,
          totalActive,
          totalPending,
        });
      } catch (err) {
        // Optionally handle error
      }
    }
    fetchStats();
  }, []);

  // Helper to fetch and cache NFT name
  async function fetchNFTName(nftAddress: string, tokenId: string) {
    const key = `${nftAddress}-${tokenId}`;
    if (nftNames[key]) return nftNames[key];
    try {
      const res = await fetch(
        `/api/nftinfo?address=${nftAddress}&tokenId=${tokenId}`
      );
      const data = await res.json();
      const name = data.name || `Token #${tokenId}`;
      setNftNames((prev) => ({ ...prev, [key]: name }));
      return name;
    } catch {
      setNftNames((prev) => ({ ...prev, [key]: `Token #${tokenId}` }));
      return `Token #${tokenId}`;
    }
  }

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          process.env.NEXT_PUBLIC_INDEXER_URL ||
          "http://localhost:8080/v1/graphql",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query: GET_ACTIVITY }),
            signal: controller.signal,
          }
        );
        if (!res.ok) throw new Error("Network response was not ok");
        const { data } = await res.json();
        const events: any[] = [
          ...data.Nftlendhub_NFTListed.map((e: NftListed) => ({
            ...e,
            type: "NFTListed",
            address: e.nftOwner,
            amount: e.loanAmount,
          })),
          ...data.Nftlendhub_LoanFunded.map((e: LoanFunded) => ({
            ...e,
            type: "LoanFunded",
            address: e.lender,
          })),
          ...data.Nftlendhub_LoanClaimed.map((e: LoanClaimed) => ({
            ...e,
            type: "LoanClaimed",
            address: e.borrower,
          })),
          ...data.Nftlendhub_LoanRepaid.map((e: LoanRepaid) => ({
            ...e,
            type: "LoanRepaid",
            address: e.borrower,
          })),
          ...data.Nftlendhub_RepaymentClaimed.map((e: RepaymentClaimed) => ({
            ...e,
            type: "RepaymentClaimed",
            address: e.lender,
          })),
          ...data.Nftlendhub_NFTClaimedByLender.map(
            (e: NFTClaimedByLender) => ({
              ...e,
              type: "NFTClaimedByLender",
              address: e.lender,
            })
          ),
          ...data.Nftlendhub_NFTWithdrawn.map((e: NFTWithdrawn) => ({
            ...e,
            type: "NFTWithdrawn",
            address: e.owner,
          })),
        ];
        events.sort((a, b) => Number(b._blockNumber) - Number(a._blockNumber));
        setAllEvents(events);
        setFilteredEvents(events);
      } catch (err: unknown) {
        if (err instanceof Error && err.name !== "AbortError") {
          setError("Failed to fetch activity data.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Optional: Poll every 10 seconds for live updates
    const interval = setInterval(fetchData, 60000);
    return () => {
      clearInterval(interval);
      controller.abort();
    };
  }, []);

  // Filter events when status filter or search term changes
  useEffect(() => {
    let filtered = [...allEvents];

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (event) => getStatus(event.type) === statusFilter
      );
    }

    // Apply search filter (search by address, NFT ID, or loan ID)
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (event) =>
          (event.address && event.address.toLowerCase().includes(term)) ||
          (event.nftId && event.nftId.toLowerCase().includes(term)) ||
          (event.loanId && event.loanId.toLowerCase().includes(term))
      );
    }

    setFilteredEvents(filtered);
  }, [statusFilter, searchTerm, allEvents]);

  // After events are set, fetch NFT names for visible events
  useEffect(() => {
    filteredEvents.forEach((event) => {
      if (event.nftAddress && event.nftId) {
        fetchNFTName(event.nftAddress, event.nftId);
      }
    });
    // eslint-disable-next-line
  }, [filteredEvents]);

  const handleRefresh = async () => {
    setLoading(true);
    // Reuse the fetch logic here
    try {
      const res = await fetch(
        process.env.NEXT_PUBLIC_INDEXER_URL ||
        "http://localhost:8080/v1/graphql",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: GET_ACTIVITY }),
        }
      );
      if (!res.ok) throw new Error("Network response was not ok");
      const { data } = await res.json();
      const events: any[] = [
        ...data.Nftlendhub_NFTListed.map((e: NftListed) => ({
          ...e,
          type: "NFTListed",
          address: e.nftOwner,
          amount: e.loanAmount,
        })),
        ...data.Nftlendhub_LoanFunded.map((e: LoanFunded) => ({
          ...e,
          type: "LoanFunded",
          address: e.lender,
        })),
        ...data.Nftlendhub_LoanClaimed.map((e: LoanClaimed) => ({
          ...e,
          type: "LoanClaimed",
          address: e.borrower,
        })),
        ...data.Nftlendhub_LoanRepaid.map((e: LoanRepaid) => ({
          ...e,
          type: "LoanRepaid",
          address: e.borrower,
        })),
        ...data.Nftlendhub_RepaymentClaimed.map((e: RepaymentClaimed) => ({
          ...e,
          type: "RepaymentClaimed",
          address: e.lender,
        })),
        ...data.Nftlendhub_NFTClaimedByLender.map((e: NFTClaimedByLender) => ({
          ...e,
          type: "NFTClaimedByLender",
          address: e.lender,
        })),
        ...data.Nftlendhub_NFTWithdrawn.map((e: NFTWithdrawn) => ({
          ...e,
          type: "NFTWithdrawn",
          address: e.owner,
        })),
      ];
      events.sort((a, b) => Number(b._blockNumber) - Number(a._blockNumber));
      setAllEvents(events);
      setFilteredEvents(events);
    } catch (err) {
      setError("Failed to refresh activity data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-gray-950 text-gray-100 rounded-xl overflow-hidden">
      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8 text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 inline-block">
          Platform Stats
        </h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10">
          <Card className="bg-gradient-to-br from-blue-900/90 to-blue-700/90 border-0 shadow-xl shadow-blue-900/20 overflow-hidden">
            <CardContent className="p-6">
              <div className="text-lg font-semibold text-blue-200 flex items-center justify-center gap-2">
                <CheckCircle className="text-green-400" />
                <span>Total Completed(wMON)</span>
              </div>
              <div className="text-3xl font-bold text-white mt-2 text-center">
                {formatAmount(stats.totalCompletedAmount.toString())}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-900/90 to-green-700/90 border-0 shadow-xl shadow-green-900/20 overflow-hidden">
            <CardContent className="p-6">
              <div className="text-lg font-semibold text-green-200 flex items-center justify-center gap-2">
                <CheckCircle className="text-green-400" />
                <span>Completed Loans</span>
              </div>
              <div className="text-3xl font-bold text-white mt-2 text-center">
                {stats.totalCompleted}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-900/90 to-blue-700/90 border-0 shadow-xl shadow-blue-900/20 overflow-hidden">
            <CardContent className="p-6">
              <div className="text-lg font-semibold text-blue-200 flex items-center justify-center gap-2">
                <Clock className="text-blue-400" />
                <span>Active Loans</span>
              </div>
              <div className="text-3xl font-bold text-white mt-2 text-center">
                {stats.totalActive}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-900/90 to-yellow-700/90 border-0 shadow-xl shadow-yellow-900/20 overflow-hidden">
            <CardContent className="p-6">
              <div className="text-lg font-semibold text-yellow-200 flex items-center justify-center gap-2">
                <Hourglass className="text-yellow-400" />
                <span>Pending Loans</span>
              </div>
              <div className="text-3xl font-bold text-white mt-2 text-center">
                {stats.totalPending}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="p-4 border-b border-gray-800 bg-gray-900/50 flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold">Activity Feed</h2>
          <Badge variant="outline" className="ml-2 bg-gray-800">
            {filteredEvents.length} events
          </Badge>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search by address or NFT ID..."
              className="pl-9 bg-gray-900 border-gray-700 w-full sm:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40 bg-gray-900 border-gray-700">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-gray-700">
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="icon"
            className="bg-gray-900 border-gray-700 hover:bg-gray-800"
            onClick={handleRefresh}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
        </div>
      )}

      {error && (
        <div className="p-4 text-center text-red-400">
          <p>{error}</p>
          <Button
            variant="outline"
            className="mt-2 bg-gray-900 border-gray-700"
            onClick={handleRefresh}
          >
            Try Again
          </Button>
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-gray-200">
              <thead className="bg-gray-900/70 text-gray-400 text-sm">
                <tr>
                  <th className="py-3 px-4 font-medium">Action</th>
                  <th className="py-3 px-4 font-medium">Address</th>
                  <th className="py-3 px-4 font-medium">NFT</th>
                  <th className="py-3 px-4 font-medium">Amount</th>
                  <th className="py-3 px-4 font-medium">Time</th>
                  <th className="py-3 px-4 font-medium">Loan Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.map((event) => (
                  <tr
                    key={event.id}
                    className="border-b border-gray-800/50 hover:bg-gray-800/20 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-gray-800/50">
                          {getActionIcon(event.type)}
                        </div>
                        <span className="font-medium">
                          {getAction(event.type)}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="font-mono bg-gray-800/50 px-2 py-1 rounded text-sm">
                              {formatAddress(event.address)}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent className="bg-gray-900 border-gray-700">
                            <p>{event.address}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </td>
                    <td className="py-3 px-4">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center gap-2 max-w-[180px]">
                              <div className="w-6 h-6 rounded-md bg-gray-800/80 flex items-center justify-center text-xs">
                                NFT
                              </div>
                              <span className="truncate">
                                {event.nftAddress &&
                                  event.nftId &&
                                  nftNames[`${event.nftAddress}-${event.nftId}`]
                                  ? nftNames[
                                  `${event.nftAddress}-${event.nftId}`
                                  ]
                                  : formatNFT(event.nftId)}
                              </span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent className="bg-gray-900 border-gray-700">
                            <p>
                              {event.nftAddress &&
                                event.nftId &&
                                nftNames[`${event.nftAddress}-${event.nftId}`]
                                ? nftNames[`${event.nftAddress}-${event.nftId}`]
                                : `Token #${event.nftId}`}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </td>
                    <td className="py-3 px-4 font-medium">
                      {event.amount ? formatAmount(event.amount) : "-"}
                    </td>
                    <td className="py-3 px-4 text-gray-400">
                      {event._timestamp
                        ? formatDistanceToNow(
                          new Date(event._timestamp * 1000),
                          {
                            addSuffix: true,
                          }
                        )
                        : "-"}
                    </td>
                    <td className="py-3 px-4">
                      {getStatusBadge(getStatus(event.type))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden">
            {filteredEvents.length === 0 ? (
              <div className="p-6 text-center text-gray-400">
                No events found matching your criteria
              </div>
            ) : (
              <div className="divide-y divide-gray-800/50">
                {filteredEvents.map((event) => (
                  <div key={event.id} className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-gray-800/50">
                          {getActionIcon(event.type)}
                        </div>
                        <span className="font-medium">
                          {getAction(event.type)}
                        </span>
                      </div>
                      {getStatusBadge(getStatus(event.type))}
                    </div>

                    <div className="grid grid-cols-2 gap-y-2 text-sm">
                      <div className="text-gray-400">Address:</div>
                      <div className="text-right">
                        <span className="font-mono bg-gray-800/50 px-2 py-1 rounded text-xs">
                          {formatAddress(event.address)}
                        </span>
                      </div>

                      <div className="text-gray-400">NFT:</div>
                      <div className="text-right truncate">
                        {event.nftAddress &&
                          event.nftId &&
                          nftNames[`${event.nftAddress}-${event.nftId}`]
                          ? nftNames[`${event.nftAddress}-${event.nftId}`]
                          : formatNFT(event.nftId)}
                      </div>

                      <div className="text-gray-400">Amount:</div>
                      <div className="text-right font-medium">
                        {event.amount ? formatAmount(event.amount) : "-"}
                      </div>

                      <div className="text-gray-400">Time:</div>
                      <div className="text-right text-gray-300">
                        {event._timestamp
                          ? formatDistanceToNow(
                            new Date(event._timestamp * 1000),
                            {
                              addSuffix: true,
                            }
                          )
                          : "-"}
                      </div>
                    </div>

                    {/* <Button
                      variant="ghost"
                      size="sm"
                      className="w-full mt-3 text-purple-400 hover:text-purple-300 hover:bg-purple-950/20"
                      onClick={}
                    >
                      View Details <ExternalLink className="ml-1 h-3 w-3" />
                    </Button> */}
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {!loading && !error && filteredEvents.length > 10 && (
        <div className="p-4 border-t border-gray-800 flex justify-between items-center">
          <div className="text-sm text-gray-400">
            Showing {filteredEvents.length} of {allEvents.length} events
          </div>
          <Button variant="outline" className="bg-gray-900 border-gray-700">
            Load More
          </Button>
        </div>
      )}
    </div>
  );
}
