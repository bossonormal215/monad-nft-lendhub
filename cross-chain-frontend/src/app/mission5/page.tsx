"use client";

import { WagmiConfig } from "@/providers/wagmi-provider";
import Mission5NFTMonanimals from "@/components/mission5/MonadLockGuardians";

export default function Mission5Page() {
    return (
        <WagmiConfig>
            <div className="flex min-h-screen flex-col">
                <main className="flex-1">
                    <div className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 min-h-screen">
                        <div className="container mx-auto px-4 py-8">
                            {/* Mission 5 Header */}
                            <div className="text-center mb-8">
                                <div className="inline-flex items-center gap-2 bg-yellow-500/20 border border-yellow-500/30 rounded-full px-4 py-2 mb-4">
                                    <span className="text-yellow-400 text-sm font-semibold">🏆 MONAD HACKATHON</span>
                                </div>
                                <h1 className="text-5xl font-bold text-white mb-4">
                                    Mission 5: MonadLock Ecosystem
                                </h1>
                                <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                                    Novel NFTs and NFT Tooling for the Monad Ecosystem
                                </p>
                            </div>

                            {/* Mission Description */}
                            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8 border border-white/20">
                                <h2 className="text-2xl font-semibold text-white mb-4">Mission Overview</h2>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <h3 className="text-lg font-medium text-yellow-400 mb-2">Track 1: Novel NFTs</h3>
                                        <p className="text-gray-300">
                                            Create unique NFT collections with innovative mechanics, open-source code,
                                            and integration with Monad lore and parallel processing concepts.
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-medium text-yellow-400 mb-2">Track 2: NFT Tooling</h3>
                                        <p className="text-gray-300">
                                            Build tools and infrastructure to support the NFT ecosystem, including
                                            standards, marketplaces, and developer tools.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Mission5NFT Monanimals Component */}
                            <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
                                <Mission5NFTMonanimals />
                            </div>

                            {/* Mission Status */}
                            <div className="mt-8 bg-green-500/20 border border-green-500/30 rounded-lg p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                                    <h3 className="text-lg font-semibold text-green-400">Mission Status: COMPLETED</h3>
                                </div>
                                <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-300">
                                    <div>
                                        <span className="font-medium">✅ Mission5NFT Contract:</span> Deployed & Tested
                                    </div>
                                    <div>
                                        <span className="font-medium">✅ ILockable Standard:</span> Fully Implemented
                                    </div>
                                    <div>
                                        <span className="font-medium">✅ Frontend Integration:</span> Connected
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>

                <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t border-white/10 bg-black/20">
                    <p className="text-xs text-gray-400">
                        © 2025 MonadLock Ecosystem. Built for Monad Hackathon.
                    </p>
                    <nav className="sm:ml-auto flex gap-4 sm:gap-6">
                        <a href="#" className="text-xs text-gray-400 hover:text-white transition-colors">
                            Documentation
                        </a>
                        <a href="#" className="text-xs text-gray-400 hover:text-white transition-colors">
                            GitHub
                        </a>
                    </nav>
                </footer>
            </div>
        </WagmiConfig>
    );
}
