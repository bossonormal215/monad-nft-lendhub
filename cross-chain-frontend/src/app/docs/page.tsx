"use client";

import { Button } from "@/Components/privy/ui/button";
import Link from "next/link";
import { BookOpen, ArrowLeft, Code, Zap, Shield } from "lucide-react";

export default function DocsPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pt-20">
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <div className="flex justify-center mb-6">
                            <div className="w-20 h-20 bg-gradient-to-br from-monad-500 to-monad-600 rounded-2xl flex items-center justify-center">
                                <BookOpen className="w-10 h-10 text-white" />
                            </div>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-monad-500 to-monad-400 bg-clip-text text-transparent mb-4">
                            Documentation
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Technical guides, API references, and integration documentation
                        </p>
                    </div>

                    {/* Coming Soon Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-12 text-center mb-12">
                        <div className="w-24 h-24 bg-gradient-to-br from-monad-500/10 to-monad-600/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <BookOpen className="w-12 h-12 text-monad-500" />
                        </div>

                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                            Coming Soon
                        </h2>

                        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                            We're building comprehensive documentation for developers, integrators, and users.
                            This will include smart contract guides, API documentation, integration tutorials,
                            and best practices for NFT lending.
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

                    {/* Documentation Sections Preview */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Smart Contracts */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                            <div className="flex items-center mb-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-lg flex items-center justify-center mr-4">
                                    <Code className="w-6 h-6 text-blue-500" />
                                </div>
                                <h3 className="font-semibold text-lg">Smart Contracts</h3>
                            </div>
                            <p className="text-sm text-muted-foreground mb-4">
                                Complete documentation for our lending contracts, ILockable standard, and escrow mechanisms.
                            </p>
                            <div className="space-y-2">
                                <div className="flex items-center text-sm text-muted-foreground">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                                    <span>ILockable Interface</span>
                                </div>
                                <div className="flex items-center text-sm text-muted-foreground">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                                    <span>Lending Contracts</span>
                                </div>
                                <div className="flex items-center text-sm text-muted-foreground">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                                    <span>Oracle Integration</span>
                                </div>
                            </div>
                        </div>

                        {/* API Reference */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                            <div className="flex items-center mb-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-lg flex items-center justify-center mr-4">
                                    <Zap className="w-6 h-6 text-green-500" />
                                </div>
                                <h3 className="font-semibold text-lg">API Reference</h3>
                            </div>
                            <p className="text-sm text-muted-foreground mb-4">
                                RESTful APIs for querying loans, NFT data, and integrating with LendHub services.
                            </p>
                            <div className="space-y-2">
                                <div className="flex items-center text-sm text-muted-foreground">
                                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                    <span>Loan Endpoints</span>
                                </div>
                                <div className="flex items-center text-sm text-muted-foreground">
                                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                    <span>NFT Metadata</span>
                                </div>
                                <div className="flex items-center text-sm text-muted-foreground">
                                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                    <span>Market Data</span>
                                </div>
                            </div>
                        </div>

                        {/* Security */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                            <div className="flex items-center mb-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-lg flex items-center justify-center mr-4">
                                    <Shield className="w-6 h-6 text-purple-500" />
                                </div>
                                <h3 className="font-semibold text-lg">Security</h3>
                            </div>
                            <p className="text-sm text-muted-foreground mb-4">
                                Security best practices, audit reports, and guidelines for safe NFT lending.
                            </p>
                            <div className="space-y-2">
                                <div className="flex items-center text-sm text-muted-foreground">
                                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                                    <span>Audit Reports</span>
                                </div>
                                <div className="flex items-center text-sm text-muted-foreground">
                                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                                    <span>Best Practices</span>
                                </div>
                                <div className="flex items-center text-sm text-muted-foreground">
                                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                                    <span>Risk Management</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}