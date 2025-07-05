"use client";

import { useEffect, useState, useMemo } from "react";
import { useQuery } from "@apollo/client";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { motion } from "framer-motion";
import { Card } from "@/Components/privy/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/Components/privy/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/privy/ui/select";
import { ZooView } from "@/components/visualizer/ZooView";
import { ActivityFeed } from "@/components/visualizer/ActivityFeed";
import { TrendingUp, DollarSign, Activity, Users, Sparkles, BarChart3 } from "lucide-react";

// Types
interface LoanData {
    id: string;
    loanId: string;
    nftAddress: string;
    nftId: string;
    loanAmount: string;
    interestRate: string;
    duration: string;
    _timestamp: string;
}

interface FundedLoan {
    id: string;
    loanId: string;
    loanAmount: string;
    _timestamp: string;
}

interface RepaidLoan {
    id: string;
    loanId: string;
    loanAmount: string;
    _timestamp: string;
}

interface QueryData {
    Nftlendhub_NFTListed: LoanData[];
    Nftlendhub_LoanFunded: FundedLoan[];
    Nftlendhub_LoanRepaid: RepaidLoan[];
}

interface Monanimal {
    id: string;
    name: string;
    color: string;
    size: number;
    happiness: number;
    x: number;
    y: number;
    loanAmount: number;
    interestRate: number;
    status: "listed" | "funded" | "repaid";
    collection: string;
}



// Initialize Apollo Client
const client = new ApolloClient({
    uri: process.env.NEXT_PUBLIC_INDEXER_URL,
    cache: new InMemoryCache(),
});



// GraphQL Queries
const GET_LOAN_STATS = gql`
  query GetLoanStats {
    Nftlendhub_NFTListed {
      id
      loanId
      nftAddress
      nftId
      loanAmount
      interestRate
      duration
      _timestamp
    }
    Nftlendhub_LoanFunded {
      id
      loanId
      loanAmount
      _timestamp
    }
    Nftlendhub_LoanRepaid {
      id
      loanId
      loanAmount
      _timestamp
    }
  }
`;



// LendHub brand color palette - matching their website
const LENDHUB_PALETTE = [
    "#8b5cf6", // Primary purple
    "#a855f7", // Light purple
    "#7c3aed", // Dark purple
    "#c084fc", // Lighter purple
    "#9333ea", // Medium purple
    "#d8b4fe", // Very light purple
    "#6d28d9", // Darker purple
    "#e9d5ff", // Pale purple
    "#5b21b6", // Deep purple
    "#f3e8ff", // Lightest purple
];

// Hash function for consistent color assignment
function hashStringToColorIdx(str: string, paletteLen: number) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash) % paletteLen;
}

// Assign a color to each collection
function getCollectionColors(collections: string[]): Record<string, string> {
    const map: Record<string, string> = {};
    collections.forEach((col) => {
        map[col] = LENDHUB_PALETTE[hashStringToColorIdx(col, LENDHUB_PALETTE.length)];
    });
    return map;
}


export default function LendHubVisualizer() {
    const [collectionNames, setCollectionNames] = useState<Record<string, string>>({});
    const { loading, error, data } = useQuery<QueryData>(GET_LOAN_STATS, {
        client,
        pollInterval: 5000,
    });
    const [timeRange, setTimeRange] = useState("24h");
    const [selectedCollection, setSelectedCollection] = useState("all");
    const [metrics, setMetrics] = useState({
        tvl: "0",
        activeLoans: "0",
        totalVolume: "0",
        averageInterest: "0",
    });




    // Update fetchCollectionName to require both address and tokenId
    async function fetchCollectionName(address: string, tokenId: string): Promise<string> {
        try {
            const cacheKey = `collectionName:${address}:${tokenId}`;
            const cached = typeof window !== 'undefined' ? localStorage.getItem(cacheKey) : null;
            if (cached) return cached;
            const res = await fetch(`/api/nftinfo?address=${address}&tokenId=${tokenId}`);
            const data = await res.json();
            const name = data.name || address.slice(0, 8) + "..." + address.slice(-4);
            if (typeof window !== 'undefined') localStorage.setItem(cacheKey, name);
            return name;
        } catch {
            return address.slice(0, 8) + "..." + address.slice(-4);
        }
    }

    // Get unique collections
    const collections = useMemo(() => {
        if (!data) return [];
        const set = new Set<string>();
        data.Nftlendhub_NFTListed.forEach((l) => set.add(l.nftAddress));
        return Array.from(set);
    }, [data]);
    const collectionColors = useMemo(() => getCollectionColors(collections), [collections]);
    // Build a map of collection address -> a real tokenId
    const collectionTokenIds = useMemo(() => {
        if (!data) return {};
        const map: Record<string, string> = {};
        data.Nftlendhub_NFTListed.forEach((l) => {
            if (!map[l.nftAddress]) map[l.nftAddress] = l.nftId;
        });
        return map;
    }, [data]);

    // Fetch collection names using the real tokenId
    useEffect(() => {
        async function fetchNames() {
            const names: Record<string, string> = {};
            await Promise.all(
                collections.map(async (col: string) => {
                    const tokenId = collectionTokenIds[col] || "1";
                    names[col] = await fetchCollectionName(col, tokenId);
                }),
            );
            setCollectionNames(names);
        }
        if (collections.length) fetchNames();
    }, [collections, collectionTokenIds]);

    // Process data into monanimals
    function processDataIntoMonanimals(
        data: QueryData,
        collectionColors: Record<string, string>,
        selectedCollection: string,
        collectionNames: Record<string, string>
    ): Monanimal[] {
        if (!data) return [];
        let filtered = data.Nftlendhub_NFTListed;
        if (selectedCollection !== "all") {
            filtered = filtered.filter(l => l.nftAddress === selectedCollection);
        }
        // Distribute bubbles in a grid to avoid overlap
        const gridSize = Math.ceil(Math.sqrt(filtered.length));
        return filtered.map((loan, idx) => {
            const funded = data.Nftlendhub_LoanFunded.find(f => f.loanId === loan.loanId);
            const repaid = data.Nftlendhub_LoanRepaid.find(r => r.loanId === loan.loanId);
            const size = Math.max(0.7, Math.min(2, Number(loan.loanAmount) / 1e18 / 10));
            const happiness = Math.min(1, Number(loan.interestRate) / 100);
            // Grid positioning
            const row = Math.floor(idx / gridSize);
            const col = idx % gridSize;
            const x = 10 + (col * 80) / (gridSize - 1 || 1); // 10% to 90%
            const y = 10 + (row * 80) / (gridSize - 1 || 1);
            const collectionLabel =
                collectionNames[loan.nftAddress] ||
                (loan.nftAddress ? loan.nftAddress.slice(0, 8) + "..." + loan.nftAddress.slice(-4) : "Collection");
            return {
                id: loan.id,
                name: `${collectionLabel} #${loan.nftId}`,
                color: collectionColors[loan.nftAddress] || "#8b5cf6",
                size,
                happiness,
                x,
                y,
                loanAmount: Number(loan.loanAmount) / 1e18,
                interestRate: Number(loan.interestRate),
                status: repaid ? "repaid" : funded ? "funded" : "listed",
                collection: collectionLabel,
            };
        });
    }

    // Process data into activities
    function processDataIntoActivities(
        data: QueryData,
        collectionColors: Record<string, string>,
        selectedCollection: string,
        collectionNames: Record<string, string>
    ) {
        if (!data) return [];
        let listed = data.Nftlendhub_NFTListed;
        if (selectedCollection !== "all") {
            listed = listed.filter(l => l.nftAddress === selectedCollection);
        }
        const activities = [
            ...listed.map((loan) => {
                const collectionLabel =
                    collectionNames[loan.nftAddress] ||
                    (loan.nftAddress ? loan.nftAddress.slice(0, 8) + "..." + loan.nftAddress.slice(-4) : "Collection");
                return {
                    id: loan.id,
                    type: "listed" as const,
                    loanId: loan.loanId,
                    amount: (Number(loan.loanAmount) / 1e18).toFixed(2),
                    timestamp: Number(loan._timestamp),
                    collection: `${collectionLabel} #${loan.nftId}`,
                    color: collectionColors[loan.nftAddress] || "#8b5cf6",
                };
            }),
            ...data.Nftlendhub_LoanFunded.filter(
                (f) => selectedCollection === "all" || listed.some((l) => l.loanId === f.loanId),
            ).map((loan) => {
                const original = data.Nftlendhub_NFTListed.find((l) => l.loanId === loan.loanId);
                const collectionLabel =
                    original && (collectionNames[original.nftAddress] ||
                        (original.nftAddress ? original.nftAddress.slice(0, 8) + "..." + original.nftAddress.slice(-4) : "Collection"));
                return {
                    id: loan.id,
                    type: "funded" as const,
                    loanId: loan.loanId,
                    amount: (Number(loan.loanAmount) / 1e18).toFixed(2),
                    timestamp: Number(loan._timestamp),
                    collection: original ? `${collectionLabel} #${original.nftId}` : "Unknown",
                    color: original ? collectionColors[original.nftAddress] : "#8b5cf6",
                };
            }),
            ...data.Nftlendhub_LoanRepaid.filter(
                (r) => selectedCollection === "all" || listed.some((l) => l.loanId === r.loanId),
            ).map((loan) => {
                const original = data.Nftlendhub_NFTListed.find((l) => l.loanId === loan.loanId);
                const collectionLabel =
                    original && (collectionNames[original.nftAddress] ||
                        (original.nftAddress ? original.nftAddress.slice(0, 8) + "..." + original.nftAddress.slice(-4) : "Collection"));
                return {
                    id: loan.id,
                    type: "repaid" as const,
                    loanId: loan.loanId,
                    amount: (Number(loan.loanAmount) / 1e18).toFixed(2),
                    timestamp: Number(loan._timestamp),
                    collection: original ? `${collectionLabel} #${original.nftId}` : "Unknown",
                    color: original ? collectionColors[original.nftAddress] : "#8b5cf6",
                };
            }),
        ].sort((a, b) => b.timestamp - a.timestamp);
        return activities;
    }


    // Processed data
    const monanimals = useMemo(
        () => processDataIntoMonanimals(data!, collectionColors, selectedCollection, collectionNames),
        [data, collectionColors, selectedCollection, collectionNames],
    );
    const activities = useMemo(
        () => processDataIntoActivities(data!, collectionColors, selectedCollection, collectionNames),
        [data, collectionColors, selectedCollection, collectionNames],
    );

    // Metrics
    useEffect(() => {
        if (!monanimals.length) {
            setMetrics({ tvl: "0", activeLoans: "0", totalVolume: "0", averageInterest: "0" });
            return;
        }
        const tvl = monanimals.filter((m) => m.status === "funded").reduce((acc, m) => acc + m.loanAmount, 0);
        const activeLoans = monanimals.filter((m) => m.status === "funded").length;
        const totalVolume = monanimals.reduce((acc, m) => acc + m.loanAmount, 0);
        const averageInterest = monanimals.reduce((acc, m) => acc + m.interestRate, 0) / monanimals.length;
        setMetrics({
            tvl: tvl.toFixed(2),
            activeLoans: activeLoans.toString(),
            totalVolume: totalVolume.toFixed(2),
            averageInterest: averageInterest.toFixed(2),
        });
    }, [monanimals]);

    return (
        <div className="min-h-screen bg-slate-900 text-white">
            {/* Header */}
            <div className="border-b border-slate-800 bg-slate-900/95 backdrop-blur-sm sticky top-0 z-50">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                                <Sparkles className="w-5 h-5 text-white" />
                            </div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                                LendHub Analytics
                            </h1>
                        </div>
                        <div className="text-sm text-slate-400">Real-Time Lending Activity on Monad</div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-8">
                {/* Hero Section */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 bg-clip-text text-transparent">
                        Platform Metrics Dashboard
                    </h2>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                        Track the pulse of our platform with live metrics showing loan volume, active loans, and lending activity.
                    </p>
                </div>

                {/* Controls */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <Tabs defaultValue={timeRange} className="w-full md:w-auto" onValueChange={setTimeRange}>
                        <TabsList className="bg-slate-800 border-slate-700">
                            <TabsTrigger value="24h" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                                24h
                            </TabsTrigger>
                            <TabsTrigger value="7d" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                                7d
                            </TabsTrigger>
                            <TabsTrigger value="30d" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                                30d
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                    <Select value={selectedCollection} onValueChange={setSelectedCollection}>
                        <SelectTrigger className="w-full md:w-[280px] bg-slate-800 border-slate-700 text-white">
                            <SelectValue placeholder="Select Collection" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                            <SelectItem value="all">All Collections</SelectItem>
                            {collections.map((col) => (
                                <SelectItem key={col} value={col}>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full" style={{ background: collectionColors[col] }} />
                                        <span className="text-white">
                                            {collectionNames[col] || col.slice(0, 8) + "..." + col.slice(-4)}
                                        </span>
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:bg-slate-800/70 transition-all duration-300">
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-2 bg-purple-500/20 rounded-lg">
                                        <DollarSign className="w-6 h-6 text-purple-400" />
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-bold text-white">{metrics.tvl}</p>
                                        <p className="text-sm text-purple-400">wMON</p>
                                    </div>
                                </div>
                                <h3 className="text-lg font-semibold text-white mb-1">Total Value Locked</h3>
                                <p className="text-sm text-slate-400">Currently locked in active loans</p>
                            </div>
                        </Card>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:bg-slate-800/70 transition-all duration-300">
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-2 bg-purple-500/20 rounded-lg">
                                        <Activity className="w-6 h-6 text-purple-400" />
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-bold text-white">{metrics.activeLoans}</p>
                                        <p className="text-sm text-purple-400">loans</p>
                                    </div>
                                </div>
                                <h3 className="text-lg font-semibold text-white mb-1">Active Loans</h3>
                                <p className="text-sm text-slate-400">Currently earning yield</p>
                            </div>
                        </Card>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:bg-slate-800/70 transition-all duration-300">
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-2 bg-purple-500/20 rounded-lg">
                                        <TrendingUp className="w-6 h-6 text-purple-400" />
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-bold text-white">{metrics.totalVolume}</p>
                                        <p className="text-sm text-purple-400">wMON</p>
                                    </div>
                                </div>
                                <h3 className="text-lg font-semibold text-white mb-1">Total Volume</h3>
                                <p className="text-sm text-slate-400">All-time lending volume</p>
                            </div>
                        </Card>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:bg-slate-800/70 transition-all duration-300">
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-2 bg-purple-500/20 rounded-lg">
                                        <BarChart3 className="w-6 h-6 text-purple-400" />
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-bold text-white">{metrics.averageInterest}%</p>
                                        <p className="text-sm text-purple-400">APR</p>
                                    </div>
                                </div>
                                <h3 className="text-lg font-semibold text-white mb-1">Average Interest</h3>
                                <p className="text-sm text-slate-400">Platform average rate</p>
                            </div>
                        </Card>
                    </motion.div>
                </div>

                {/* Main Visualization Area */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Zoo View */}
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
                        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm h-[600px]">
                            <div className="p-6 h-full flex flex-col">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-purple-500/20 rounded-lg">
                                        <Users className="w-5 h-5 text-purple-400" />
                                    </div>
                                    <h2 className="text-2xl font-semibold text-white">Lending Zoo</h2>
                                </div>
                                <div className="relative flex-1 bg-slate-900/50 rounded-lg border border-slate-700">
                                    {loading ? (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="text-center">
                                                <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                                <p className="text-slate-400">Loading lending data...</p>
                                            </div>
                                        </div>
                                    ) : monanimals.length === 0 ? (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="text-center">
                                                <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mb-4 mx-auto">
                                                    <Users className="w-8 h-8 text-slate-400" />
                                                </div>
                                                <p className="text-slate-400">No loans to display</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <ZooView monanimals={monanimals} selectedCollection={selectedCollection} />
                                    )}
                                </div>
                            </div>
                        </Card>
                    </motion.div>

                    {/* Activity Feed */}
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
                        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm h-[600px]">
                            <div className="p-6 h-full flex flex-col">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-purple-500/20 rounded-lg">
                                        <Activity className="w-5 h-5 text-purple-400" />
                                    </div>
                                    <h2 className="text-2xl font-semibold text-white">Live Activity Feed</h2>
                                </div>
                                <div className="flex-1 overflow-y-auto bg-slate-900/50 rounded-lg border border-slate-700 p-4">
                                    {loading ? (
                                        <div className="flex items-center justify-center h-full">
                                            <div className="text-center">
                                                <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                                <p className="text-slate-400">Loading activities...</p>
                                            </div>
                                        </div>
                                    ) : activities.length === 0 ? (
                                        <div className="flex items-center justify-center h-full">
                                            <div className="text-center">
                                                <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mb-4 mx-auto">
                                                    <Activity className="w-8 h-8 text-slate-400" />
                                                </div>
                                                <p className="text-slate-400">No recent activity</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <ActivityFeed activities={activities} />
                                    )}
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                </div>

                {/* Footer */}
                <div className="text-center mt-12 pt-8 border-t border-slate-800">
                    <p className="text-slate-400 mb-2">
                        Powered by <span className="text-purple-400 font-semibold">LendHub</span> on Monad Testnet
                    </p>
                    <p className="text-sm text-slate-500">Real-time data visualization for NFT lending protocol</p>
                </div>
            </div>
        </div>
    );
} 