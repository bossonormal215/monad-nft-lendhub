"use client";

import { useState, useEffect } from "react";
import { Button } from "@/Components/privy/ui/button";
import Link from "next/link";
import Image from "next/image";
import {
    ArrowRight,
    Shield,
    Zap,
    Coins,
    Lock,
    Globe,
    Users,
    TrendingUp,
    CheckCircle,
    Star,
    Target,
    BarChart3,
    Rocket,
    Award,
    Lightbulb,
    ChevronRight,
    ChevronLeft,
    ExternalLink,
    FileText,
} from "lucide-react";

export default function DeckPage() {
    const [currentSlide, setCurrentSlide] = useState(0);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.key === "ArrowRight" || event.key === " ") {
                event.preventDefault();
                nextSlide();
            } else if (event.key === "ArrowLeft") {
                event.preventDefault();
                prevSlide();
            }
        };

        window.addEventListener("keydown", handleKeyPress);
        return () => window.removeEventListener("keydown", handleKeyPress);
    }, []);

    const slides = [
        {
            id: 1,
            title: "Executive Summary",
            content: (
                <div className="space-y-8">
                    <div className="text-center space-y-6">
                        <div className="flex justify-center">
                            <div className="w-24 h-24 bg-gradient-to-br from-monad-500 to-monad-600 rounded-2xl flex items-center justify-center">
                                <Coins className="w-12 h-12 text-white" />
                            </div>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-monad-500 to-monad-400 bg-clip-text text-transparent">
                            LendHub
                        </h1>
                        <p className="text-2xl md:text-3xl text-muted-foreground max-w-4xl mx-auto font-light">
                            Peer-to-Peer NFT-Powered Lending Protocol
                        </p>
                        <div className="flex justify-center items-center space-x-4 text-sm text-muted-foreground">
                            <span>•</span>
                            <span>Dual Chain Deployment</span>
                            <span>•</span>
                            <span>ILockable Standard</span>
                            <span>•</span>
                            <span>Cross-Chain Future</span>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 mt-12">
                        <div className="space-y-4">
                            <h3 className="text-2xl font-semibold text-monad-500">Overview</h3>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                LendHub is a peer-to-peer NFT-powered lending protocol built for the next generation of onchain finance.
                                It is launching across two scalable EVM-compatible chains: Somnia and Monad.
                            </p>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                This dual deployment reflects LendHub's core principle — decentralized infrastructure should not be confined to one chain.
                                Liquidity, utility, and adoption come from interoperability, not exclusivity.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-2xl font-semibold text-monad-500">Key Innovation</h3>
                            <div className="bg-gradient-to-r from-green-500/10 to-green-600/10 border border-green-200 dark:border-green-800 rounded-xl p-4">
                                <h4 className="font-semibold text-green-600 dark:text-green-400 mb-2">ILockable Standard</h4>
                                <p className="text-sm text-muted-foreground">
                                    A new primitive that enables borrowers to retain NFT ownership, utility, and identity while accessing liquidity.
                                </p>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <span>Retain ownership and utility</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <span>Cross-chain compatibility</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <span>Secure and transparent</span>
                            </div>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 2,
            title: "Market Problem",
            content: (
                <div className="space-y-8">
                    <div className="text-center space-y-4">
                        <h2 className="text-4xl md:text-5xl font-bold text-monad-500">The Core Problem</h2>
                        <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
                            Despite over $10B in cumulative NFT sales, NFTs remain financially idle
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-gradient-to-br from-red-500/10 to-red-600/10 border border-red-200 dark:border-red-800 rounded-xl p-6 space-y-4">
                            <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
                                <Lock className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-xl font-semibold">No Borrowing Without Transfer</h3>
                            <p className="text-muted-foreground">
                                You can't borrow against an NFT without handing it over to escrow or custodial contracts
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border border-orange-200 dark:border-orange-800 rounded-xl p-6 space-y-4">
                            <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                                <Users className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-xl font-semibold">Loss of Utility</h3>
                            <p className="text-muted-foreground">
                                Borrowers lose utility, reputation, and access to apps or games linked to their NFT
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6 space-y-4">
                            <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
                                <Shield className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-xl font-semibold">Poor Adoption</h3>
                            <p className="text-muted-foreground">
                                High risk for lenders, little incentive for creators to integrate lending into collections
                            </p>
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-monad-500/10 to-monad-600/10 border border-monad-200 dark:border-monad-800 rounded-xl p-6">
                        <h3 className="text-xl font-semibold text-monad-500 mb-3">Market Impact</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-lg text-muted-foreground">
                                    <strong>Result:</strong> Poor adoption, high risk for lenders, and little incentive for creators to integrate lending into their collections.
                                </p>
                            </div>
                            <div>
                                <p className="text-lg text-muted-foreground">
                                    <strong>Opportunity:</strong> Over $30B in P2P crypto lending annually, with NFT-Fi representing less than 1%.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 3,
            title: "Solution: ILockable Standard",
            content: (
                <div className="space-y-8">
                    <div className="text-center space-y-4">
                        <div className="flex justify-center">
                            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                                <Zap className="w-8 h-8 text-white" />
                            </div>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-monad-500">The ILockable Breakthrough</h2>
                        <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
                            A new primitive that enables composable lending without compromising ownership
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <h3 className="text-2xl font-semibold text-monad-500">Two Types of NFT Lending</h3>

                            <div className="space-y-4">
                                <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                                    <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">Standard NFTs</h4>
                                    <p className="text-sm text-muted-foreground">
                                        Transferred to protocol's escrow smart contract. Borrower gives up ownership for loan period.
                                    </p>
                                </div>

                                <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-200 dark:border-green-800 rounded-xl p-4">
                                    <h4 className="font-semibold text-green-600 dark:text-green-400 mb-2">ILockable NFTs</h4>
                                    <p className="text-sm text-muted-foreground">
                                        Locked, not transferred. Borrower retains ownership, reputation, utility, and access. Lender has lien rights.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-2xl font-semibold text-monad-500">Key Benefits</h3>

                            <div className="space-y-3">
                                <div className="flex items-center space-x-3">
                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                    <span>Retain ownership and identity</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                    <span>Keep utility and reputation</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                    <span>Maintain access to apps/games</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                    <span>Transparent default handling</span>
                                </div>
                            </div>

                            <div className="bg-gradient-to-r from-monad-500/10 to-monad-600/10 border border-monad-200 dark:border-monad-800 rounded-xl p-4">
                                <p className="text-sm text-muted-foreground">
                                    <strong>Critical distinction:</strong> ILockable unlocks composable lending — borrowers don't just get liquidity, they retain their identity.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-green-500/10 to-green-600/10 border border-green-200 dark:border-green-800 rounded-xl p-6">
                        <h3 className="text-xl font-semibold text-green-600 dark:text-green-400 mb-3">Default Handling</h3>
                        <p className="text-muted-foreground">
                            If default occurs, lenders must explicitly claim the NFT from the protocol. There is no automatic seizure,
                            ensuring transparency, finality, and gas efficiency.
                        </p>
                    </div>
                </div>
            )
        },
        {
            id: 4,
            title: "How LendHub Works",
            content: (
                <div className="space-y-8">
                    <div className="text-center space-y-4">
                        <h2 className="text-4xl md:text-5xl font-bold text-monad-500">P2P Lending Flow</h2>
                        <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
                            Simple, transparent, and secure peer-to-peer lending process
                        </p>
                    </div>

                    <div className="grid md:grid-cols-5 gap-4">
                        {[
                            {
                                step: "1",
                                title: "List NFT",
                                description: "Borrower lists NFT, sets loan amount, duration, and interest"
                            },
                            {
                                step: "2",
                                title: "Fund Loan",
                                description: "Lender funds loan, triggering smart contract logic"
                            },
                            {
                                step: "3",
                                title: "Receive Funds",
                                description: "Borrower receives loan in wSTT, USDC, or USDT"
                            },
                            {
                                step: "4",
                                title: "Repay or Default",
                                description: "If repaid, NFT is released. If defaulted, lender may claim"
                            },
                            {
                                step: "5",
                                title: "Recovery",
                                description: "Lender executes recovery function if needed"
                            }
                        ].map((item, index) => (
                            <div key={index} className="text-center space-y-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-monad-500 to-monad-600 rounded-full flex items-center justify-center mx-auto">
                                    <span className="text-white font-bold">{item.step}</span>
                                </div>
                                <h3 className="font-semibold text-monad-500">{item.title}</h3>
                                <p className="text-xs text-muted-foreground">{item.description}</p>
                            </div>
                        ))}
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 mt-8">
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold text-monad-500">Supported Tokens</h3>
                            <div className="flex space-x-2">
                                {["wSTT", "USDC", "USDT"].map((token) => (
                                    <span key={token} className="px-3 py-1 bg-monad-500/10 text-monad-500 rounded-full text-sm">
                                        {token}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold text-monad-500">Security Features</h3>
                            <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                    <Shield className="w-4 h-4 text-green-500" />
                                    <span className="text-sm">Verified oracles</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Shield className="w-4 h-4 text-green-500" />
                                    <span className="text-sm">Onchain milestone enforcement</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Shield className="w-4 h-4 text-green-500" />
                                    <span className="text-sm">No off-chain dependency</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 5,
            title: "Chain Strategy",
            content: (
                <div className="space-y-8">
                    <div className="text-center space-y-4">
                        <h2 className="text-4xl md:text-5xl font-bold text-monad-500">Dual Chain Deployment</h2>
                        <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
                            LendHub is infra-first, not chain-maxi
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-200 dark:border-purple-800 rounded-xl p-6 space-y-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                                    <Star className="w-5 h-5 text-white" />
                                </div>
                                <h3 className="text-xl font-semibold text-purple-600 dark:text-purple-400">Why Somnia?</h3>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center space-x-2">
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                    <span className="text-sm">High-performance EVM chain focused on NFT utility</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                    <span className="text-sm">Built-in wallet and ZK support</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                    <span className="text-sm">Composability with other NFT-powered dApps</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                    <span className="text-sm">Natural fit for lending protocols</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-200 dark:border-blue-800 rounded-xl p-6 space-y-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                                    <Rocket className="w-5 h-5 text-white" />
                                </div>
                                <h3 className="text-xl font-semibold text-blue-600 dark:text-blue-400">Why Also Monad?</h3>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center space-x-2">
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                    <span className="text-sm">Tech stack aligned with DeFi-native power users</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                    <span className="text-sm">Early traction with developer-focused dApps</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                    <span className="text-sm">Valuable for stress-testing core smart contracts</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                    <span className="text-sm">Cross-chain future preparation</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-monad-500/10 to-monad-600/10 border border-monad-200 dark:border-monad-800 rounded-xl p-6 text-center">
                        <h3 className="text-xl font-semibold text-monad-500 mb-2">The Future is Cross-Chain</h3>
                        <p className="text-muted-foreground">
                            LendHub is built to support the future of lending across multiple chains
                        </p>
                    </div>
                </div>
            )
        },
        {
            id: 6,
            title: "Market & Opportunity",
            content: (
                <div className="space-y-8">
                    <div className="text-center space-y-4">
                        <h2 className="text-4xl md:text-5xl font-bold text-monad-500">Market Opportunity</h2>
                        <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
                            The numbers speak for themselves
                        </p>
                    </div>

                    <div className="grid md:grid-cols-4 gap-6">
                        <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-200 dark:border-green-800 rounded-xl p-6 text-center">
                            <div className="text-3xl font-bold text-green-600 dark:text-green-400">1M+</div>
                            <div className="text-sm text-muted-foreground">Active NFT wallets on EVM</div>
                        </div>

                        <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-200 dark:border-blue-800 rounded-xl p-6 text-center">
                            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">&lt;1%</div>
                            <div className="text-sm text-muted-foreground">NFTs used in DeFi</div>
                        </div>

                        <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-200 dark:border-purple-800 rounded-xl p-6 text-center">
                            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">$30B+</div>
                            <div className="text-sm text-muted-foreground">P2P lending in crypto annually</div>
                        </div>

                        <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border border-orange-200 dark:border-orange-800 rounded-xl p-6 text-center">
                            <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">&lt;1%</div>
                            <div className="text-sm text-muted-foreground">NFT-Fi of total lending</div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-monad-500/10 to-monad-600/10 border border-monad-200 dark:border-monad-800 rounded-xl p-6">
                        <h3 className="text-xl font-semibold text-monad-500 mb-3">Market Gap</h3>
                        <p className="text-lg text-muted-foreground">
                            LendHub fixes this with a design-first approach built around utility and composability.
                            The market is ready for a solution that preserves NFT utility while unlocking liquidity.
                        </p>
                    </div>
                </div>
            )
        },
        {
            id: 7,
            title: "Roadmap & Execution",
            content: (
                <div className="space-y-8">
                    <div className="text-center space-y-4">
                        <h2 className="text-4xl md:text-5xl font-bold text-monad-500">State of Execution</h2>
                        <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
                            Current state and upcoming milestones
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <h3 className="text-2xl font-semibold text-monad-500">Features at a Glance</h3>

                            <div className="space-y-3">
                                <div className="flex items-center space-x-3">
                                    <Lock className="w-5 h-5 text-monad-500" />
                                    <span>ILockable standard — retain NFT ownership while borrowing</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Shield className="w-5 h-5 text-monad-500" />
                                    <span>Escrow smart contract for standard NFTs</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <CheckCircle className="w-5 h-5 text-monad-500" />
                                    <span>Verified oracles to protect lenders</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Zap className="w-5 h-5 text-monad-500" />
                                    <span>Onchain milestone enforcement</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Coins className="w-5 h-5 text-monad-500" />
                                    <span>Token support: wSTT, USDC, USDT</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-2xl font-semibold text-monad-500">Development Timeline</h3>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">MVP live on Monad</span>
                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Smart contracts porting to Somnia</span>
                                    <div className="w-5 h-5 border-2 border-monad-500 rounded-full"></div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">ILockable implementation live</span>
                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Testnet campaign upcoming</span>
                                    <div className="w-5 h-5 border-2 border-monad-500 rounded-full"></div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Security audit scheduled</span>
                                    <div className="w-5 h-5 border-2 border-monad-500 rounded-full"></div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Mainnet deployment Q3</span>
                                    <div className="w-5 h-5 border-2 border-monad-500 rounded-full"></div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">ILockable as EVM-wide standard</span>
                                    <div className="w-5 h-5 border-2 border-monad-500 rounded-full"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 8,
            title: "GTM Strategy",
            content: (
                <div className="space-y-8">
                    <div className="text-center space-y-4">
                        <h2 className="text-4xl md:text-5xl font-bold text-monad-500">Go-to-Market Strategy</h2>
                        <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
                            Building adoption through strategic partnerships and incentives
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <h3 className="text-2xl font-semibold text-monad-500">Partnership Strategy</h3>

                            <div className="space-y-3">
                                <div className="flex items-center space-x-3">
                                    <Users className="w-5 h-5 text-monad-500" />
                                    <span>Collaborate with Somnia-native NFT collections</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Award className="w-5 h-5 text-monad-500" />
                                    <span>Airdrop incentives for borrowers and lenders</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Star className="w-5 h-5 text-monad-500" />
                                    <span>Campaigns rewarding ILockable integration</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Lightbulb className="w-5 h-5 text-monad-500" />
                                    <span>Education and onboarding for creators</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <BarChart3 className="w-5 h-5 text-monad-500" />
                                    <span>Early adopter scoreboards + testnet rewards</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-2xl font-semibold text-monad-500">Funding & Alignment</h3>

                            <div className="space-y-4">
                                <p className="text-muted-foreground">
                                    LendHub is currently bootstrapping. As a multi-chain protocol, it does not rely solely on one ecosystem's grants.
                                </p>

                                <div className="space-y-2">
                                    <h4 className="font-semibold text-monad-500">We're open to:</h4>
                                    <div className="space-y-1">
                                        <div className="flex items-center space-x-2">
                                            <CheckCircle className="w-4 h-4 text-green-500" />
                                            <span className="text-sm">Ecosystem grants (with non-exclusivity clauses)</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <CheckCircle className="w-4 h-4 text-green-500" />
                                            <span className="text-sm">Cross-chain partnerships</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <CheckCircle className="w-4 h-4 text-green-500" />
                                            <span className="text-sm">Oracle and NFT infra integrations</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <CheckCircle className="w-4 h-4 text-green-500" />
                                            <span className="text-sm">LPs and community backers</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 9,
            title: "Vision & Mission",
            content: (
                <div className="space-y-8">
                    <div className="text-center space-y-4">
                        <h2 className="text-4xl md:text-5xl font-bold text-monad-500">Vision & Mission</h2>
                        <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
                            Building the future of NFT-powered finance
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-gradient-to-br from-monad-500/10 to-monad-600/10 border border-monad-200 dark:border-monad-800 rounded-xl p-6 space-y-4">
                            <div className="flex items-center space-x-3">
                                <Target className="w-8 h-8 text-monad-500" />
                                <h3 className="text-xl font-semibold text-monad-500">Vision</h3>
                            </div>
                            <p className="text-muted-foreground">
                                To unlock capital for NFTs without compromising their core value — ownership, identity, and onchain presence.
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-monad-500/10 to-monad-600/10 border border-monad-200 dark:border-monad-800 rounded-xl p-6 space-y-4">
                            <div className="flex items-center space-x-3">
                                <Rocket className="w-8 h-8 text-monad-500" />
                                <h3 className="text-xl font-semibold text-monad-500">Mission</h3>
                            </div>
                            <p className="text-muted-foreground">
                                To build a secure, open, and interoperable NFT lending layer that creators, borrowers, and lenders can rely on — across multiple chains.
                            </p>
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-monad-500/20 to-monad-600/20 border border-monad-200 dark:border-monad-800 rounded-xl p-8 text-center space-y-4">
                        <h3 className="text-2xl font-semibold text-monad-500">The Future of NFT-Fi</h3>
                        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                            LendHub isn't a hype machine. It's a real infrastructure play — for real NFT users.
                        </p>
                        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                            The future of NFT-Fi isn't about flipping JPEGs. It's about borrowing, lending, gaming, staking, and building — with NFTs that retain utility.
                        </p>
                        <p className="text-xl font-semibold text-monad-500">
                            LendHub enables that future — one lock at a time.
                        </p>
                    </div>

                    <div className="flex justify-center space-x-4">
                        <Link href="/borrow">
                            <Button size="lg" className="bg-monad-500 hover:bg-monad-600 text-white">
                                Get Started <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                        <Link href="/">
                            <Button size="lg" variant="outline" className="border-monad-200 hover:bg-monad-100/50">
                                <FileText className="mr-2 h-4 w-4" />
                                View Documentation
                            </Button>
                        </Link>
                    </div>
                </div>
            )
        }
    ];

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pt-20">
            {/* Slide Navigation */}
            <div className="fixed top-20 right-4 z-50 flex items-center space-x-2">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={prevSlide}
                    className="bg-white/80 dark:bg-gray-800/80 backdrop-blur"
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur px-3 py-1 rounded-md text-sm font-medium">
                    {currentSlide + 1} / {slides.length}
                </div>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={nextSlide}
                    className="bg-white/80 dark:bg-gray-800/80 backdrop-blur"
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>

            {/* Progress Bar */}
            <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 dark:bg-gray-700 z-40">
                <div
                    className="h-full bg-gradient-to-r from-monad-500 to-monad-600 transition-all duration-500 ease-out"
                    style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
                />
            </div>

            {/* Slide Content */}
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="max-w-6xl w-full">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-8 md:p-12">
                        <div className="animate-in slide-in-from-bottom-4 duration-500">
                            {slides[currentSlide].content}
                        </div>
                    </div>
                </div>
            </div>

            {/* Slide Indicators */}
            <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
                <div className="flex space-x-2">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide
                                ? "bg-monad-500 scale-125"
                                : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
                                }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>

            {/* Keyboard Navigation */}
            <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 text-center">
                <p className="text-sm text-muted-foreground bg-white/80 dark:bg-gray-800/80 backdrop-blur px-4 py-2 rounded-md">
                    Use arrow keys, spacebar, or click the navigation buttons to navigate
                </p>
            </div>
        </div>
    );
} 