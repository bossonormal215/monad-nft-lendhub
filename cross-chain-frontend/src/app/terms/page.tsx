"use client";

import { Button } from "@/Components/privy/ui/button";
import Link from "next/link";
import { FileText, ArrowLeft, Shield, Scale, Users } from "lucide-react";

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pt-20">
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <div className="flex justify-center mb-6">
                            <div className="w-20 h-20 bg-gradient-to-br from-monad-500 to-monad-600 rounded-2xl flex items-center justify-center">
                                <FileText className="w-10 h-10 text-white" />
                            </div>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-monad-500 to-monad-400 bg-clip-text text-transparent mb-4">
                            Terms of Service
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Legal terms and conditions for using LendHub services
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
                            We're finalizing our comprehensive terms of service that will govern the use of LendHub's
                            NFT lending platform. This will include user rights, platform responsibilities, and legal
                            protections for all participants.
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

                    {/* Terms Sections Preview */}
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center mb-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-lg flex items-center justify-center mr-4">
                                    <Users className="w-6 h-6 text-blue-500" />
                                </div>
                                <h3 className="font-semibold text-lg">User Rights</h3>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Clear definition of user rights, privacy protections, and platform access terms for borrowers and lenders.
                            </p>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center mb-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-lg flex items-center justify-center mr-4">
                                    <Shield className="w-6 h-6 text-green-500" />
                                </div>
                                <h3 className="font-semibold text-lg">Platform Security</h3>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Security measures, data protection, and platform liability terms for safe NFT lending operations.
                            </p>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center mb-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-lg flex items-center justify-center mr-4">
                                    <Scale className="w-6 h-6 text-purple-500" />
                                </div>
                                <h3 className="font-semibold text-lg">Legal Framework</h3>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Dispute resolution, jurisdiction, and legal compliance terms for cross-chain NFT lending.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}