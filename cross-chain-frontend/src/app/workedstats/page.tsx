"use client";
import React, { useEffect, useState, useRef } from "react";
import { formatDistanceToNow } from "date-fns";
import { ethers } from "ethers";
import { NFT_LENDHUB_ABI_V2, NFT_LENDHUB_ADDRESS_V2 } from "@/components/lib/constants";


import {
    CheckCircle,
    Clock,
    Hourglass,
    Loader2,
    ArrowDownLeft,
    ArrowUpRight,
    TrendingUp,
    Activity,
    ExternalLink,
} from "lucide-react"
import { motion } from "framer-motion"

type Activity = {
    action: string;
    address: string;
    nftAddress: string;
    tokenId: string;
    amount: string;
    time: number;
    nftName?: string;
};

export default function StatsPage() {
    const [stats, setStats] = useState({
        totalCompletedAmount: 0,
        totalCompleted: 0,
        totalActive: 0,
        totalPending: 0,
    });
    const [activity, setActivity] = useState<Activity[]>([]);
    const activityRef = useRef<Activity[]>([]);
    const [loading, setLoading] = useState(true);

    const [isVisible, setIsVisible] = useState(false)

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

    // Fetch all loans and calculate stats
    async function fetchStatsAndHistory() {
        // Replace with your RPC provider
        const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_MONAD_TESTNET_RPC);
        const contract = new ethers.Contract(NFT_LENDHUB_ADDRESS_V2, NFT_LENDHUB_ABI_V2, provider);
        const allLoans = await contract.getAllLoans();

        let totalCompletedAmount = 0, totalCompleted = 0, totalActive = 0,

            totalPending = 0;
        const activities: Activity[] = [];

        for (const loan of allLoans) {
            // Calculate stats
            if (loan.completed) {
                totalCompleted++;
                totalCompletedAmount += Number(loan.loanAmount);
                activities.push({
                    action: "Completed",
                    address: loan.loanAddDetails.nftOwner,
                    nftAddress: loan.loanAddDetails.nftAddress,
                    tokenId: loan.nftId.toString(),
                    amount: loan.loanAmount.toString(),
                    time: Number(loan.milestones.completedAt),
                });
            } else if (loan.active) {
                totalActive++;
                activities.push({
                    action: "Active",
                    address: loan.loanAddDetails.nftOwner,
                    nftAddress: loan.loanAddDetails.nftAddress,
                    tokenId: loan.nftId.toString(),
                    amount: loan.loanAmount.toString(),
                    time: Number(loan.milestones.startTime),
                });
            } else if (!loan.completed && !loan.active && !loan.cancelled) {
                totalPending++;
                activities.push({
                    action: "Pending",
                    address: loan.loanAddDetails.nftOwner,
                    nftAddress: loan.loanAddDetails.nftAddress,
                    tokenId: loan.nftId.toString(),
                    amount: loan.loanAmount.toString(),
                    time: Number(loan.milestones.startTime),
                });
            }
        }

        setStats({
            totalCompletedAmount,
            totalCompleted,
            totalActive,
            totalPending,
        });

        // Fetch NFT names for activities
        const activitiesWithNames = await Promise.all(
            activities.map(async (act) => ({
                ...act,
                nftName: await fetchNFTName(act.nftAddress, act.tokenId),
            }))
        );

        // Sort by time descending
        activitiesWithNames.sort((a, b) => b.time - a.time);

        setActivity(activitiesWithNames);
        activityRef.current = activitiesWithNames;
        setLoading(false);
    }

    useEffect(() => {
        fetchStatsAndHistory();

        // Listen for contract events (example for ethers.js)
        const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_MONAD_TESTNET_RPC);
        const contract = new ethers.Contract(NFT_LENDHUB_ADDRESS_V2, NFT_LENDHUB_ABI_V2, provider);

        // Example: Listen for LoanRepaid event
        contract.on("LoanRepaid", async (loanId, borrower, lender, event) => {
            // Re-fetch stats and activity
            await fetchStatsAndHistory();
        });

        // Add more event listeners as needed (NFTListed, LoanFunded, etc.)

        return () => {
            contract.removeAllListeners();
        };
    }, []);

    function formatAmount(amount: string) {
        if (!amount) return "-";
        return (Number(amount) / 1e18).toLocaleString(undefined, { maximumFractionDigits: 4 });
    }

    function actionIcon(action: string) {
        if (action === "Completed") return <CheckCircle className="text-green-500 inline mr-1" size={18} />;
        if (action === "Active") return <Clock className="text-blue-500 inline mr-1" size={18} />;
        if (action === "Pending") return <Hourglass className="text-yellow-500 inline mr-1" size={18} />;
        return null;
    }

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    }

    const item = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1 },
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-gray-100">
            <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                {/* Header with subtle animation */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-10"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <TrendingUp className="h-8 w-8 text-purple-400" />
                        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-amber-500">
                            Platform Stats
                        </h1>
                    </div>
                    <p className="text-gray-400 max-w-2xl">Real-time overview of platform activity and performance metrics</p>
                </motion.div>

                {/* Stats Cards with staggered animation */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate={isVisible ? "show" : "hidden"}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
                >
                    <motion.div variants={item}>
                        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-900/80 to-purple-700/80 p-1">
                            <div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:20px_20px]"></div>
                            <div className="relative h-full rounded-xl backdrop-blur-sm bg-black/20 p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="text-lg font-medium text-purple-200">Total Completed</div>
                                    <div className="p-2 rounded-full bg-purple-800/50">
                                        <CheckCircle className="h-5 w-5 text-purple-300" />
                                    </div>
                                </div>
                                <div className="text-3xl font-bold text-white">{formatAmount(stats.totalCompletedAmount.toString())}</div>
                                <div className="mt-2 text-sm text-purple-300 flex items-center gap-1">
                                    <TrendingUp className="h-3 w-3" />
                                    <span>+12.5% from last month</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div variants={item}>
                        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-900/80 to-green-700/80 p-1">
                            <div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:20px_20px]"></div>
                            <div className="relative h-full rounded-xl backdrop-blur-sm bg-black/20 p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="text-lg font-medium text-green-200">Completed Loans</div>
                                    <div className="p-2 rounded-full bg-green-800/50">
                                        <CheckCircle className="h-5 w-5 text-green-300" />
                                    </div>
                                </div>
                                <div className="text-3xl font-bold text-white">{stats.totalCompleted}</div>
                                <div className="mt-2 text-sm text-green-300 flex items-center gap-1">
                                    <TrendingUp className="h-3 w-3" />
                                    <span>+8.3% from last month</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div variants={item}>
                        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-900/80 to-blue-700/80 p-1">
                            <div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:20px_20px]"></div>
                            <div className="relative h-full rounded-xl backdrop-blur-sm bg-black/20 p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="text-lg font-medium text-blue-200">Active Loans</div>
                                    <div className="p-2 rounded-full bg-blue-800/50">
                                        <Clock className="h-5 w-5 text-blue-300" />
                                    </div>
                                </div>
                                <div className="text-3xl font-bold text-white">{stats.totalActive}</div>
                                <div className="mt-2 text-sm text-blue-300 flex items-center gap-1">
                                    <TrendingUp className="h-3 w-3" />
                                    <span>+5.2% from last month</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div variants={item}>
                        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-900/80 to-amber-700/80 p-1">
                            <div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:20px_20px]"></div>
                            <div className="relative h-full rounded-xl backdrop-blur-sm bg-black/20 p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="text-lg font-medium text-amber-200">Pending Loans</div>
                                    <div className="p-2 rounded-full bg-amber-800/50">
                                        <Hourglass className="h-5 w-5 text-amber-300" />
                                    </div>
                                </div>
                                <div className="text-3xl font-bold text-white">{stats.totalPending}</div>
                                <div className="mt-2 text-sm text-amber-300 flex items-center gap-1">
                                    <TrendingUp className="h-3 w-3" />
                                    <span>+3.7% from last month</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Activity Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                >
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <Activity className="h-6 w-6 text-pink-400" />
                            <h2 className="text-2xl font-bold text-white">Recent Activity</h2>
                        </div>
                        <button className="text-sm text-pink-400 hover:text-pink-300 transition-colors flex items-center gap-1">
                            View all <ExternalLink className="h-3 w-3" />
                        </button>
                    </div>

                    {/* Desktop Table */}
                    <div className="hidden sm:block relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 p-1">
                        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:20px_20px]"></div>
                        <div className="relative rounded-xl backdrop-blur-sm bg-black/30 overflow-hidden">
                            {loading ? (
                                <div className="flex justify-center items-center py-12">
                                    <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-gray-200">
                                        <thead>
                                            <tr className="border-b border-gray-800/50">
                                                <th className="py-4 px-6 font-medium text-gray-400">Action</th>
                                                <th className="py-4 px-6 font-medium text-gray-400">Address</th>
                                                <th className="py-4 px-6 font-medium text-gray-400">NFT</th>
                                                <th className="py-4 px-6 font-medium text-gray-400">Amount</th>
                                                <th className="py-4 px-6 font-medium text-gray-400">Time</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {activity.map((act, idx) => (
                                                <tr key={idx} className="border-b border-gray-800/30 hover:bg-white/[0.02] transition-colors">
                                                    <td className="py-4 px-6">
                                                        <div className="flex items-center gap-2">
                                                            <div
                                                                className={`p-1.5 rounded-lg ${act.action === "Borrow" ? "bg-emerald-900/30" : "bg-blue-900/30"
                                                                    }`}
                                                            >
                                                                {actionIcon(act.action)}
                                                            </div>
                                                            <span className="font-medium">{act.action}</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-6">
                                                        <div className="flex items-center">
                                                            <span
                                                                className="font-mono text-sm bg-gray-800/80 px-2 py-1 rounded-md"
                                                                title={act.address}
                                                            >
                                                                {act.address.slice(0, 6)}...{act.address.slice(-4)}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-6 max-w-[180px]" title={act.nftName || act.tokenId}>
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-8 h-8 rounded-md bg-gradient-to-br from-pink-500/30 to-purple-500/30 flex items-center justify-center text-xs font-bold">
                                                                NFT
                                                            </div>
                                                            <span className="truncate">{act.nftName || act.tokenId}</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-6 font-medium">{formatAmount(act.amount)}</td>
                                                    <td className="py-4 px-6 text-gray-400">
                                                        {act.time ? formatDistanceToNow(new Date(act.time * 1000), { addSuffix: true }) : "-"}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Mobile Activity Cards */}
                    <div className="sm:hidden space-y-4">
                        {activity.map((act, idx) => (
                            <div
                                key={idx}
                                className="relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 p-0.5"
                            >
                                <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:20px_20px]"></div>
                                <div className="relative rounded-lg backdrop-blur-sm bg-black/30 p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <div
                                                className={`p-1.5 rounded-lg ${act.action === "Borrow" ? "bg-emerald-900/30" : "bg-blue-900/30"
                                                    }`}
                                            >
                                                {actionIcon(act.action)}
                                            </div>
                                            <span className="font-medium">{act.action}</span>
                                        </div>
                                        <span className="text-sm text-gray-400">
                                            {act.time ? formatDistanceToNow(new Date(act.time * 1000), { addSuffix: true }) : "-"}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-y-2 text-sm">
                                        <div className="text-gray-400">NFT:</div>
                                        <div className="truncate text-right font-medium" title={act.nftName || act.tokenId}>
                                            {act.nftName || act.tokenId}
                                        </div>

                                        <div className="text-gray-400">Address:</div>
                                        <div
                                            className="font-mono text-right bg-gray-800/50 px-1.5 py-0.5 rounded text-xs inline-block ml-auto"
                                            title={act.address}
                                        >
                                            {act.address.slice(0, 6)}...{act.address.slice(-4)}
                                        </div>

                                        <div className="text-gray-400">Amount:</div>
                                        <div className="font-medium text-right">{formatAmount(act.amount)}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    )
    //     <div className="max-w-4xl mx-auto py-10 px-4">
    //         <h1 className="text-3xl font-bold mb-8 text-white">Platform Stats</h1>
    //         <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
    //             <div className="bg-gradient-to-br from-blue-900 to-blue-700 rounded-xl p-6 text-center shadow-lg">
    //                 <div className="text-lg font-semibold text-blue-200 flex items-center justify-center gap-2">
    //                     <CheckCircle className="inline text-green-400" /> Total Completed Amount
    //                 </div>
    //                 <div className="text-3xl font-bold text-white mt-2">{formatAmount(stats.totalCompletedAmount.toString())}</div>
    //             </div>
    //             <div className="bg-gradient-to-br from-green-900 to-green-700 rounded-xl p-6 text-center shadow-lg">
    //                 <div className="text-lg font-semibold text-green-200 flex items-center justify-center gap-2">
    //                     <CheckCircle className="inline text-green-400" /> Completed Loans
    //                 </div>
    //                 <div className="text-3xl font-bold text-white mt-2">{stats.totalCompleted}</div>
    //             </div>
    //             <div className="bg-gradient-to-br from-blue-900 to-blue-700 rounded-xl p-6 text-center shadow-lg">
    //                 <div className="text-lg font-semibold text-blue-200 flex items-center justify-center gap-2">
    //                     <Clock className="inline text-blue-400" /> Active Loans
    //                 </div>
    //                 <div className="text-3xl font-bold text-white mt-2">{stats.totalActive}</div>
    //             </div>
    //             <div className="bg-gradient-to-br from-yellow-900 to-yellow-700 rounded-xl p-6 text-center shadow-lg">
    //                 <div className="text-lg font-semibold text-yellow-200 flex items-center justify-center gap-2">
    //                     <Hourglass className="inline text-yellow-400" /> Pending Loans
    //                 </div>
    //                 <div className="text-3xl font-bold text-white mt-2">{stats.totalPending}</div>
    //             </div>
    //         </div>

    //         <h2 className="text-2xl font-bold mb-4 text-white">Activity</h2>
    //         <div className="bg-card rounded-xl shadow-lg overflow-x-auto">
    //             {loading ? (
    //                 <div className="flex justify-center items-center py-12">
    //                     <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
    //                 </div>
    //             ) : (
    //                 <table className="w-full text-left text-white">
    //                     <thead>
    //                         <tr className="border-b border-gray-700">
    //                             <th className="py-3 px-2">Action</th>
    //                             <th className="py-3 px-2">Address</th>
    //                             <th className="py-3 px-2">NFT</th>
    //                             <th className="py-3 px-2">Amount</th>
    //                             <th className="py-3 px-2">Time</th>
    //                         </tr>
    //                     </thead>
    //                     <tbody>
    //                         {activity.map((act, idx) => (
    //                             <tr
    //                                 key={idx}
    //                                 className={idx % 2 === 0 ? "bg-gray-900/60" : "bg-gray-800/60"}
    //                             >
    //                                 <td className="py-2 px-2">{actionIcon(act.action)}{act.action}</td>
    //                                 <td className="py-2 px-2">
    //                                     <span title={act.address}>
    //                                         {act.address.slice(0, 6)}...{act.address.slice(-4)}
    //                                     </span>
    //                                 </td>
    //                                 <td className="py-2 px-2 max-w-[180px] truncate" title={act.nftName || act.tokenId}>
    //                                     {act.nftName || act.tokenId}
    //                                 </td>
    //                                 <td className="py-2 px-2">{formatAmount(act.amount)}</td>
    //                                 <td className="py-2 px-2">
    //                                     {act.time ? formatDistanceToNow(new Date(act.time * 1000), { addSuffix: true }) : "-"}
    //                                 </td>
    //                             </tr>
    //                         ))}
    //                     </tbody>
    //                 </table>
    //             )}
    //         </div>
    //     </div>
    // );
}