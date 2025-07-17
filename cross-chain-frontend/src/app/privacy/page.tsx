"use client";

import { Button } from "@/Components/privy/ui/button";
import Link from "next/link";
import { Shield, ArrowLeft, Lock, Eye, Database } from "lucide-react";

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pt-20">
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <div className="flex justify-center mb-6">
                            <div className="w-20 h-20 bg-gradient-to-br from-monad-500 to-monad-600 rounded-2xl flex items-center justify-center">
                                <Shield className="w-10 h-10 text-white" />
                            </div>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-monad-500 to-monad-400 bg-clip-text text-transparent mb-4">
                            Privacy Policy
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            How we protect and handle your data on LendHub
                        </p>
                    </div>

                    {/* Coming Soon Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-12 text-center mb-12">
                        <div className="w-24 h-24 bg-gradient-to-br from-monad-500/10 to-monad-600/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Shield className="w-12 h-12 text-monad-500" />
                        </div>

                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                            Coming Soon
                        </h2>

                        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                            We're developing a comprehensive privacy policy that will detail how we collect, use, and protect
                            your data. This will include blockchain transparency, data retention policies, and user control
                            over personal information.
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

                    {/* Privacy Sections Preview */}
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center mb-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-lg flex items-center justify-center mr-4">
                                    <Lock className="w-6 h-6 text-blue-500" />
                                </div>
                                <h3 className="font-semibold text-lg">Data Protection</h3>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                How we secure your personal information, wallet addresses, and transaction data with industry-leading encryption.
                            </p>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center mb-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-lg flex items-center justify-center mr-4">
                                    <Eye className="w-6 h-6 text-green-500" />
                                </div>
                                <h3 className="font-semibold text-lg">Transparency</h3>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Our commitment to transparency about data collection, usage, and sharing practices in the DeFi ecosystem.
                            </p>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center mb-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-lg flex items-center justify-center mr-4">
                                    <Database className="w-6 h-6 text-purple-500" />
                                </div>
                                <h3 className="font-semibold text-lg">Data Control</h3>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                User rights to access, modify, and delete personal data, with clear opt-out mechanisms.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}