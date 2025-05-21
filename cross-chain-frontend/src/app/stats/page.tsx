"use client";
import React, { useEffect, useState, useRef } from "react";
import { formatDistanceToNow } from "date-fns";
import { Card, CardContent } from "@/Components/privy/ui/card"
import { ethers } from "ethers";
import { NFT_LENDHUB_ABI_V2, NFT_LENDHUB_ADDRESS_V2 } from "@/components/lib/constants";
import { ArrowUpRight, ArrowDownLeft, Ban, Loader2, CheckCircle, Clock, Hourglass, List, ArrowDownCircle, ArrowUpCircle, DollarSign, Gift } from "lucide-react";

// Add event config for activity feed
const EVENT_CONFIG = [
    {
        name: "NFTListed",
        action: "ListLoan",
        status: "Pending",
        getFields: (args: any) => ({
            address: args.nftOwner,
            nftAddress: args.nftAddress,
            tokenId: args.nftId.toString(),
            amount: args.loanAmount.toString(),
        }),
    },
    {
        name: "LoanFunded",
        action: "FundLoan",
        status: "Active",
        getFields: (args: any) => ({
            address: args.lender,
            nftAddress: args.nftAddress,
            tokenId: args.nftId.toString(),
            amount: args.loanAmount.toString(),
        }),
    },
    {
        name: "LoanClaimed",
        action: "ClaimLoan",
        status: "Active",
        getFields: (args: any) => ({
            address: args.borrower,
            nftAddress: args.nftAddress,
            tokenId: args.nftId.toString(),
            amount: args.loanAmount.toString(),
        }),
    },
    {
        name: "LoanRepaid",
        action: "RepayLoan",
        status: "Completed",
        getFields: (args: any) => ({
            address: args.borrower,
            nftAddress: args.nftAddress,
            tokenId: args.nftId.toString(),
            amount: args.repaymentAmount?.toString() || args.loanAmount?.toString() || "0",
        }),
    },
    {
        name: "RepaymentClaimed",
        action: "ClaimRepayment",
        status: "Completed",
        getFields: (args: any) => ({
            address: args.lender,
            nftAddress: args.nftAddress,
            tokenId: args.nftId?.toString() || "",
            amount: args.repaymentAmount?.toString() || "0",
        }),
    },
    {
        name: "NFTClaimedByLender",
        action: "ClaimNft",
        status: "Completed",
        getFields: (args: any) => ({
            address: args.lender,
            nftAddress: args.nftAddress,
            tokenId: args.nftId?.toString() || "",
            amount: args.loanAmount?.toString() || "0",
        }),
    },
];

export default function StatsPage() {
    const [stats, setStats] = useState({
        totalCompletedAmount: 0,
        totalCompleted: 0,
        totalActive: 0,
        totalPending: 0,
    });
    const [activity, setActivity] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [warning, setWarning] = useState<string | null>(null);

    // NFT info cache
    const nftInfoCache = useRef(new Map<string, string>());
    async function fetchNFTNameCached(nftAddress: string, tokenId: string) {
        const key = `${nftAddress}:${tokenId}`;
        if (nftInfoCache.current.has(key)) return nftInfoCache.current.get(key);
        const name = await fetchNFTName(nftAddress, tokenId);
        nftInfoCache.current.set(key, name);
        return name;
    }

    // Helper to fetch NFT name
    async function fetchNFTName(nftAddress: string, tokenId: string) {
        try {
            const res = await fetch(`/api/nftinfo?address=${nftAddress}&tokenId=${tokenId}`);
            const data = await res.json();
            return data.name || `Token #${tokenId}`;
        } catch {
            return `Token #${tokenId}`;
        }
    }

    // Helper to fetch logs in batches (to avoid Alchemy's 500 block limit)
    async function getLogsInBatches(contract: any, filter: any, fromBlock: number, toBlock: number, batchSize = 500) {
        let logs: any[] = [];
        let start = fromBlock;
        while (start <= toBlock) {
            const end = Math.min(start + batchSize - 1, toBlock);
            console.log(`Fetching logs for batch: ${filter.topics?.[0] || ''} from block ${start} to ${end}`);
            // Add a timeout for each batch fetch
            const batchPromise = contract.queryFilter(filter, start, end);
            const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error(`Timeout fetching logs for blocks ${start}-${end}`)), 10000));
            const batchLogs = await Promise.race([batchPromise, timeoutPromise]);
            logs = logs.concat(batchLogs);
            start = end + 1;
        }
        return logs;
    }

    // Fetch all loans and calculate stats
    async function fetchStatsAndEvents() {
        setLoading(true);
        setError(null);
        setWarning(null);
        try {
            const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_MONAD_TESTNET_RPC);
            const contract = new ethers.Contract(NFT_LENDHUB_ADDRESS_V2, NFT_LENDHUB_ABI_V2, provider);

            // Stats: fetch all loans as before
            let totalCompletedAmount = 0, totalCompleted = 0, totalActive = 0, totalPending = 0;
            try {
                const allLoans = await contract.getAllLoans();
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
            } catch { }
            setStats({ totalCompletedAmount, totalCompleted, totalActive, totalPending });

            // Activity: fetch all events in batches (limit to last 2,000 blocks)
            let allActivities: any[] = [];
            const latestBlock = await provider.getBlockNumber();
            // const fromBlock = Math.max(0, latestBlock - 2000);
            const fromBlock = 15294605;
            for (const config of EVENT_CONFIG) {
                console.log('Fetching logs for', config.name);
                const filter = contract.filters[config.name]();
                const logs = await getLogsInBatches(contract, filter, fromBlock, latestBlock, 500);
                console.log('Fetched', logs.length, 'logs for', config.name);
                for (const log of logs) {
                    const args = log.args as any;
                    const block = await provider.getBlock(log.blockNumber);
                    const time = block.timestamp;
                    const fields = config.getFields(args);
                    allActivities.push({
                        action: config.action,
                        status: config.status,
                        ...fields,
                        time,
                    });
                }
            }
            // Log the number of events found
            console.log('Total events found:', allActivities.length);
            // Sort by time descending
            allActivities.sort((a, b) => b.time - a.time);
            // Limit to first 20 events for testing
            allActivities = allActivities.slice(0, 20);
            // Fetch NFT names with cache, with timeout warning
            let timeoutId: NodeJS.Timeout | null = null;
            const timeoutPromise = new Promise((_, reject) => {
                timeoutId = setTimeout(() => {
                    setWarning('Fetching NFT info is taking longer than expected...');
                }, 10000); // 10 seconds
            });
            console.log('Fetching NFT names for', allActivities.length, 'activities');
            const activitiesWithNames = await Promise.race([
                Promise.all(
                    allActivities.map(async (act) => ({
                        ...act,
                        nftName: await fetchNFTNameCached(act.nftAddress, act.tokenId),
                    }))
                ),
                timeoutPromise,
            ]);
            if (timeoutId) clearTimeout(timeoutId);
            // If timeoutPromise wins, activitiesWithNames will be undefined
            if (!activitiesWithNames) {
                setError('NFT info fetching timed out. Please try again.');
                setLoading(false);
                return;
            }
            setActivity(activitiesWithNames as any[]);
            setLoading(false);
        } catch (err: any) {
            setError('Failed to fetch activity data. Please check your network or try again.');
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchStatsAndEvents();
        const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_MONAD_TESTNET_RPC);
        const contract = new ethers.Contract(NFT_LENDHUB_ADDRESS_V2, NFT_LENDHUB_ABI_V2, provider);
        for (const config of EVENT_CONFIG) {
            contract.on(config.name, async (...args) => {
                const event = args[args.length - 1];
                const block = await provider.getBlock(event.blockNumber);
                const time = block.timestamp;
                const fields = config.getFields(event.args);
                const nftName = await fetchNFTNameCached(fields.nftAddress, fields.tokenId);
                setActivity((prev) => [
                    {
                        action: config.action,
                        status: config.status,
                        ...fields,
                        time,
                        nftName,
                    },
                    ...prev,
                ]);
            });
        }
        return () => {
            for (const config of EVENT_CONFIG) {
                contract.removeAllListeners(config.name);
            }
        };
    }, []);

    function formatAmount(amount: string) {
        if (!amount) return "-";
        return (Number(amount) / 1e18).toLocaleString(undefined, { maximumFractionDigits: 4 });
    }

    function actionIcon(action: string) {
        if (action === "ListLoan") return <List className="text-blue-400 inline mr-1" size={18} />;
        if (action === "FundLoan") return <ArrowDownCircle className="text-green-400 inline mr-1" size={18} />;
        if (action === "ClaimLoan") return <Gift className="text-yellow-400 inline mr-1" size={18} />;
        if (action === "RepayLoan") return <DollarSign className="text-green-400 inline mr-1" size={18} />;
        if (action === "ClaimRepayment") return <ArrowUpCircle className="text-green-400 inline mr-1" size={18} />;
        if (action === "ClaimNft") return <CheckCircle className="text-purple-400 inline mr-1" size={18} />;
        return null;
    }

    // Get status badge with appropriate color
    const getStatusBadge = (status: string) => {
        switch (status) {
            case "Completed":
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900/60 text-green-200">
                        <CheckCircle className="mr-1 h-3 w-3" /> Completed
                    </span>
                )
            case "Active":
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900/60 text-blue-200">
                        <Clock className="mr-1 h-3 w-3" /> Active
                    </span>
                )
            case "Pending":
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-900/60 text-yellow-200">
                        <Hourglass className="mr-1 h-3 w-3" /> Pending
                    </span>
                )
            case "Cancelled":
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-900/60 text-red-200">
                        <Ban className="mr-1 h-3 w-3" /> Cancelled
                    </span>
                )
            default:
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-700 text-gray-200">
                        {status}
                    </span>
                )
        }
    }

    return (
        <div className="min-h-screen bg-gray-950 text-gray-100">
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
                            <div className="text-3xl font-bold text-white mt-2 text-center">{stats.totalCompleted}</div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-blue-900/90 to-blue-700/90 border-0 shadow-xl shadow-blue-900/20 overflow-hidden">
                        <CardContent className="p-6">
                            <div className="text-lg font-semibold text-blue-200 flex items-center justify-center gap-2">
                                <Clock className="text-blue-400" />
                                <span>Active Loans</span>
                            </div>
                            <div className="text-3xl font-bold text-white mt-2 text-center">{stats.totalActive}</div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-yellow-900/90 to-yellow-700/90 border-0 shadow-xl shadow-yellow-900/20 overflow-hidden">
                        <CardContent className="p-6">
                            <div className="text-lg font-semibold text-yellow-200 flex items-center justify-center gap-2">
                                <Hourglass className="text-yellow-400" />
                                <span>Pending Loans</span>
                            </div>
                            <div className="text-3xl font-bold text-white mt-2 text-center">{stats.totalPending}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Activity Section */}
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-white">Activity</h2>
                    <div className="text-sm text-gray-400">Showing recent transactions</div>
                </div>

                <Card className="bg-gray-900/80 border-gray-800 shadow-xl overflow-hidden">
                    {loading ? (
                        <div className="flex justify-center items-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                        </div>
                    ) : warning ? (
                        <div className="flex flex-col items-center justify-center py-6">
                            <div className="text-yellow-400 font-semibold mb-2">{warning}</div>
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <div className="text-red-400 font-semibold mb-2">{error}</div>
                            <button
                                onClick={fetchStatsAndEvents}
                                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                            >
                                Retry
                            </button>
                        </div>
                    ) : activity.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <div className="text-gray-400 font-semibold">No activity events found.</div>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-gray-200">
                                <thead>
                                    <tr className="border-b border-gray-800 bg-gray-900/60">
                                        <th className="py-4 px-4 font-medium">Action</th>
                                        <th className="py-4 px-4 font-medium">Address</th>
                                        <th className="py-4 px-4 font-medium">NFT</th>
                                        <th className="py-4 px-4 font-medium">Amount</th>
                                        <th className="py-4 px-4 font-medium">Time</th>
                                        <th className="py-4 px-4 font-medium">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {activity.map((act, idx) => (
                                        <tr
                                            key={idx}
                                            className={`border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors ${idx % 2 === 0 ? "bg-gray-900/30" : "bg-gray-800/30"
                                                }`}
                                        >
                                            <td className="py-3 px-4 font-medium">
                                                <div className="flex items-center">
                                                    {actionIcon(act.action)}
                                                    {act.action}
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className="font-mono bg-gray-800 px-2 py-1 rounded text-sm" title={act.address}>
                                                    {act.address.slice(0, 6)}...{act.address.slice(-4)}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 max-w-[180px] truncate" title={act.nftName || act.tokenId}>
                                                <div className="flex items-center">
                                                    <div className="w-6 h-6 rounded-full bg-gray-700 mr-2"></div>
                                                    {act.nftName || act.tokenId}
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 font-medium">{formatAmount(act.amount)}</td>
                                            <td className="py-3 px-4 text-gray-400">
                                                {act.time ? formatDistanceToNow(new Date(act.time * 1000), { addSuffix: true }) : "-"}
                                            </td>
                                            <td className="py-3 px-4">{getStatusBadge(act.status)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Card>

                {/* Mobile Activity Cards - Only shown on small screens */}
                <div className="mt-6 sm:hidden space-y-4">
                    {activity.map((act, idx) => (
                        <Card key={idx} className="bg-gray-900/80 border-gray-800 shadow-md overflow-hidden">
                            <CardContent className="p-4">
                                <div className="flex justify-between items-center mb-2">
                                    <div className="flex items-center font-medium">
                                        {actionIcon(act.action)}
                                        {act.action}
                                    </div>
                                    <div>{getStatusBadge(act.status)}</div>
                                </div>

                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div className="text-gray-400">Address:</div>
                                    <div className="font-mono text-right" title={act.address}>
                                        {act.address.slice(0, 6)}...{act.address.slice(-4)}
                                    </div>

                                    <div className="text-gray-400">NFT:</div>
                                    <div className="truncate text-right" title={act.nftName || act.tokenId}>
                                        {act.nftName || act.tokenId}
                                    </div>

                                    <div className="text-gray-400">Amount:</div>
                                    <div className="font-medium text-right">{formatAmount(act.amount)}</div>

                                    <div className="text-gray-400">Time:</div>
                                    <div className="text-gray-300 text-right">
                                        {act.time ? formatDistanceToNow(new Date(act.time * 1000), { addSuffix: true }) : "-"}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}