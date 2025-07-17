"use client";

import { Button } from "@/Components/privy/ui/button";
import Link from "next/link";
import { FileText, ArrowLeft, Calendar, User, Tag } from "lucide-react";

export default function BlogPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pt-20">
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <div className="flex justify-center mb-6">
                            <div className="w-20 h-20 bg-gradient-to-br from-monad-500 to-monad-600 rounded-2xl flex items-center justify-center">
                                <FileText className="w-10 h-10 text-white" />
                            </div>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-monad-500 to-monad-400 bg-clip-text text-transparent mb-4">
                            LendHub Blog
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Insights, updates, and stories from the NFT lending frontier
                        </p>
                    </div>

                    {/* Coming Soon Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-12 text-center mb-12">
                        <div className="w-24 h-24 bg-gradient-to-br from-monad-500/10 to-monad-600/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FileText className="w-12 h-12 text-monad-500" />
                        </div>

                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                            Coming Soon
                        </h2>

                        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                            We're preparing insightful content about NFT lending, DeFi innovation, and the future of
                            cross-chain finance. Stay tuned for deep dives into our technology, community stories,
                            and industry analysis.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/">
                                <Button size="lg" variant="outline" className="border-monad-200 hover:bg-monad-100/50">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Back to Home
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Preview Articles */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Preview Article 1 */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                            <div className="h-48 bg-gradient-to-br from-monad-500/20 to-monad-600/20 flex items-center justify-center">
                                <FileText className="w-12 h-12 text-monad-500" />
                            </div>
                            <div className="p-6">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                                    <Calendar className="w-4 h-4" />
                                    <span>Coming Soon</span>
                                    <User className="w-4 h-4 ml-2" />
                                    <span>LendHub Team</span>
                                </div>
                                <h3 className="font-semibold text-lg mb-2">Introducing ILockable: The Future of NFT Lending</h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    A deep dive into our revolutionary NFT locking mechanism and how it preserves utility while unlocking liquidity.
                                </p>
                                <div className="flex gap-2">
                                    <span className="px-2 py-1 bg-monad-500/10 text-monad-500 rounded-full text-xs">Technology</span>
                                    <span className="px-2 py-1 bg-monad-500/10 text-monad-500 rounded-full text-xs">NFT-Fi</span>
                                </div>
                            </div>
                        </div>

                        {/* Preview Article 2 */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                            <div className="h-48 bg-gradient-to-br from-purple-500/20 to-purple-600/20 flex items-center justify-center">
                                <FileText className="w-12 h-12 text-purple-500" />
                            </div>
                            <div className="p-6">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                                    <Calendar className="w-4 h-4" />
                                    <span>Coming Soon</span>
                                    <User className="w-4 h-4 ml-2" />
                                    <span>LendHub Team</span>
                                </div>
                                <h3 className="font-semibold text-lg mb-2">Why Dual Chain Deployment Matters</h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Exploring our strategy of launching on both Somnia and Monad, and what it means for the future of DeFi.
                                </p>
                                <div className="flex gap-2">
                                    <span className="px-2 py-1 bg-purple-500/10 text-purple-500 rounded-full text-xs">Strategy</span>
                                    <span className="px-2 py-1 bg-purple-500/10 text-purple-500 rounded-full text-xs">Multi-Chain</span>
                                </div>
                            </div>
                        </div>

                        {/* Preview Article 3 */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                            <div className="h-48 bg-gradient-to-br from-green-500/20 to-green-600/20 flex items-center justify-center">
                                <FileText className="w-12 h-12 text-green-500" />
                            </div>
                            <div className="p-6">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                                    <Calendar className="w-4 h-4" />
                                    <span>Coming Soon</span>
                                    <User className="w-4 h-4 ml-2" />
                                    <span>LendHub Team</span>
                                </div>
                                <h3 className="font-semibold text-lg mb-2">The Market Opportunity in NFT-Fi</h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Analyzing the $30B+ P2P lending market and how LendHub is positioned to capture the NFT-Fi opportunity.
                                </p>
                                <div className="flex gap-2">
                                    <span className="px-2 py-1 bg-green-500/10 text-green-500 rounded-full text-xs">Market</span>
                                    <span className="px-2 py-1 bg-green-500/10 text-green-500 rounded-full text-xs">Analysis</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}