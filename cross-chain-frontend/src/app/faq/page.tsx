"use client";

import { Button } from "@/Components/privy/ui/button";
import Link from "next/link";
import { HelpCircle, ArrowLeft } from "lucide-react";

export default function FaqPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pt-20">
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <div className="flex justify-center mb-6">
                            <div className="w-20 h-20 bg-gradient-to-br from-monad-500 to-monad-600 rounded-2xl flex items-center justify-center">
                                <HelpCircle className="w-10 h-10 text-white" />
                            </div>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-monad-500 to-monad-400 bg-clip-text text-transparent mb-4">
                            Frequently Asked Questions
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Everything you need to know about LendHub
                        </p>
                    </div>

                    {/* Coming Soon Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
                        <div className="w-24 h-24 bg-gradient-to-br from-monad-500/10 to-monad-600/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <HelpCircle className="w-12 h-12 text-monad-500" />
                        </div>

                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                            Coming Soon
                        </h2>

                        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                            We're working hard to compile the most comprehensive FAQ section for LendHub.
                            This will include detailed answers about our ILockable standard, dual chain deployment,
                            and everything you need to know about NFT-powered lending.
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

                    {/* Preview Sections */}
                    <div className="grid md:grid-cols-3 gap-6 mt-12">
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                            <h3 className="font-semibold text-monad-500 mb-2">ILockable Standard</h3>
                            <p className="text-sm text-muted-foreground">
                                Learn about our revolutionary NFT locking mechanism
                            </p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                            <h3 className="font-semibold text-monad-500 mb-2">Dual Chain Strategy</h3>
                            <p className="text-sm text-muted-foreground">
                                Understanding our Somnia and Monad deployment
                            </p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                            <h3 className="font-semibold text-monad-500 mb-2">Security & Safety</h3>
                            <p className="text-sm text-muted-foreground">
                                How we protect lenders and borrowers
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}