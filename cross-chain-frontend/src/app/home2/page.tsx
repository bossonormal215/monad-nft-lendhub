"use client";

import { Button } from "@/Components/privy/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Toaster } from "@/Components/privy/ui/toaster";
import { WagmiConfig } from "@/providers/wagmi-provider";
import { LendingStatsCard } from "@/components/LendingStatsCard";
import {
  ArrowRight,
  Wallet,
  Coins,
  Shield,
  Zap,
  ChevronRight,
} from "lucide-react";

export default function Home() {
  return (
    <WagmiConfig>
      <div className="flex min-h-screen flex-col">
        <main className="flex-1">
          {/* Hero Section */}
          <section className="relative w-full overflow-hidden py-12 sm:py-16 md:py-24 lg:py-32">
            {/* Background elements */}
            <div className="absolute inset-0 bg-gradient-to-b from-monad-100/10 to-transparent" />
            <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-monad-500/5 blur-3xl" />
            <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-monad-500/10 blur-3xl" />

            <div className="container relative mx-auto px-4 md:px-6 lg:px-8">
              <div className="grid gap-8 md:gap-12 lg:grid-cols-2 lg:gap-16 items-center">
                <div className="flex flex-col justify-center space-y-6 md:space-y-8">
                  <div className="flex items-center gap-2">
                    <Image
                      src="https://amethyst-conscious-vole-978.mypinata.cloud/ipfs/bafkreid7sltmasp74vubafpketmw3b4kp7wpzy7idinapdqgktq6c3e5aq"
                      alt="LendHub Logo"
                      width={60}
                      height={60}
                      className="object-contain"
                    />
                    <h2 className="text-xl md:text-2xl font-bold tracking-tight">
                      LendHub
                    </h2>
                  </div>

                  <div className="space-y-3 md:space-y-4">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-monad-500 to-monad-400">
                      Unlock the Value of Your NFTs
                    </h1>
                    <p className="max-w-[600px] text-muted-foreground text-base sm:text-lg md:text-xl">
                      A peer-to-peer lending platform that allows you to use
                      your NFTs as collateral for loans or earn interest by
                      lending to others.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="/borrow" className="w-full sm:w-auto">
                      <Button
                        size="lg"
                        className="w-full sm:w-auto bg-monad-500 hover:bg-monad-600 text-white"
                      >
                        Borrow Now <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href="/lend" className="w-full sm:w-auto">
                      <Button
                        size="lg"
                        variant="outline"
                        className="w-full sm:w-auto border-monad-200 hover:bg-monad-100/50"
                      >
                        Become a Lender <Coins className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Shield className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span>Secure, transparent, and decentralized lending</span>
                  </div>
                </div>

                <div className="relative mx-auto lg:mx-0 max-w-md w-full">
                  <div className="relative h-[300px] sm:h-[350px] md:h-[400px] w-full rounded-2xl overflow-hidden border border-monad-border shadow-xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-monad-500/20 to-monad-700/20" />
                    <Image
                      src="https://img-cdn.magiceden.dev/da:t/rs:fill:400:0:0/plain/https%3A%2F%2Fimg.reservoir.tools%2Fimages%2Fv2%2Fmonad-testnet%2Fi9YO%252F4yHXUdJsWcTqhqvfyYhpIDLRIn3OfXbN8%252FIcvlCHo66zPoi7Iq0LydbELkQ9YmFoJL1KKkaCYzEP6TxJZ3JuarMMwuBI7hd7qzh4xE%253D.png"
                      alt="NFT Lending Platform"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-4 sm:p-6">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-monad-500 flex items-center justify-center">
                            <Wallet className="h-4 w-4 text-white" />
                          </div>
                          <span className="text-white font-medium">
                            NFT Collateral
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-white">
                          Bored Ape #1234
                        </h3>
                        <div className="flex justify-between items-center">
                          <div className="text-sm text-white/80">
                            <span className="block">Loan Amount</span>
                            <span className="font-bold text-white">
                              5,000 wMON
                            </span>
                          </div>
                          <div className="text-sm text-white/80">
                            <span className="block">Interest Rate</span>
                            <span className="font-bold text-white">8.5%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Floating cards - Uncomment if needed */}
                  {/* <div className="absolute -top-6 -right-6 h-24 w-48 rounded-lg bg-white/90 backdrop-blur-sm p-3 shadow-lg border border-monad-border flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <Zap className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Total Value Locked
                      </p>
                      <p className="font-bold">$2.4M</p>
                    </div>
                  </div> */}

                  {/* <div className="absolute -bottom-6 -left-6 h-24 w-48 rounded-lg bg-white/90 backdrop-blur-sm p-3 shadow-lg border border-monad-border flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <RefreshCw className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Active Loans
                      </p>
                      <p className="font-bold">1,240</p>
                    </div>
                  </div> */}
                </div>
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section className="w-full py-12 md:py-16 lg:py-24">
            <div className="container mx-auto px-4 md:px-6 lg:px-8">
              <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8 md:mb-10">
                <div className="inline-block rounded-full bg-monad-100 px-3 py-1 text-sm font-medium text-monad-800 mb-2">
                  Platform Metrics
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tighter md:text-4xl">
                  Real-Time Lending Activity
                </h2>
                <p className="max-w-[800px] text-muted-foreground text-base sm:text-lg md:text-xl">
                  Track the pulse of our platform with live metrics showing loan
                  volume, active loans, and top lenders.
                </p>
              </div>
              <div className="max-w-6xl mx-auto">
                <LendingStatsCard />
              </div>
            </div>
          </section>

          {/* How It Works Section */}
          <section className="bg-[#1C2839] border border-[#2C3545] rounded-2xl mx-4 sm:mx-6 md:mx-8 lg:mx-auto lg:max-w-6xl p-6 sm:p-8 mb-12">
            <div className="container mx-auto">
              <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8 md:mb-12">
                <div className="inline-block rounded-full bg-monad-100 px-3 py-1 text-sm font-medium text-monad-800 mb-2">
                  Simple Process
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tighter md:text-4xl">
                  How It Works
                </h2>
                <p className="max-w-[800px] text-muted-foreground text-base sm:text-lg md:text-xl">
                  Our platform makes it easy to get liquidity from your NFTs or
                  earn interest by lending to others.
                </p>
              </div>

              <div className="mx-auto grid grid-cols-1 gap-8 py-4 sm:py-6 md:grid-cols-3 md:gap-6 lg:gap-8">
                {/* Step 1 */}
                <div className="group relative flex flex-col items-center space-y-4 rounded-2xl bg-white p-4 sm:p-6 shadow-sm transition-all hover:shadow-md border border-monad-border">
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-monad-500 text-white font-bold">
                    1
                  </div>
                  <div className="flex h-12 w-16 items-center justify-center rounded-full bg-monad-100 group-hover:bg-monad-200 transition-colors">
                    <svg
                      className="h-6 w-8 text-monad-500"
                      fill="none"
                      height="24"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      width="24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M21 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v3" />
                      <path d="M21 16v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3" />
                      <path d="M4 12H2" />
                      <path d="M10 12H8" />
                      <path d="M16 12h-2" />
                      <path d="M22 12h-2" />
                    </svg>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold">
                    List Your NFT
                  </h3>
                  <p className="text-center text-muted-foreground text-sm sm:text-base">
                    Connect your wallet and list your NFT as collateral,
                    specifying your desired loan terms.
                  </p>
                  <Link
                    href="/borrow"
                    className="inline-flex items-center text-sm font-medium text-monad-500 hover:text-monad-700"
                  >
                    Learn more <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>

                {/* Step 2 */}
                <div className="group relative flex flex-col items-center space-y-4 rounded-2xl bg-white p-4 sm:p-6 shadow-sm transition-all hover:shadow-md border border-monad-border">
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-monad-500 text-white font-bold">
                    2
                  </div>
                  <div className="flex h-12 w-16 items-center justify-center rounded-full bg-monad-100 group-hover:bg-monad-200 transition-colors">
                    <svg
                      className="h-6 w-8 text-monad-500"
                      fill="none"
                      height="24"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      width="24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M12 2v20" />
                      <path d="M17 12H2" />
                    </svg>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold">Get Funded</h3>
                  <p className="text-center text-muted-foreground text-sm sm:text-base">
                    Lenders browse available NFTs and fund loans they're
                    interested in based on your terms.
                  </p>
                  <Link
                    href="/collections"
                    className="inline-flex items-center text-sm font-medium text-monad-500 hover:text-monad-700"
                  >
                    View marketplace <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>

                {/* Step 3 */}
                <div className="group relative flex flex-col items-center space-y-4 rounded-2xl bg-white p-4 sm:p-6 shadow-sm transition-all hover:shadow-md border border-monad-border">
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-monad-500 text-white font-bold">
                    3
                  </div>
                  <div className="flex h-12 w-16 items-center justify-center rounded-full bg-monad-100 group-hover:bg-monad-200 transition-colors">
                    <svg
                      className="h-6 w-8 text-monad-500"
                      fill="none"
                      height="24"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      width="24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M12 22V8" />
                      <path d="m5 12-2-2 2-2" />
                      <path d="m19 12 2-2-2-2" />
                      <path d="M5 10h14" />
                      <path d="m15 19-3 3-3-3" />
                    </svg>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold">
                    Repay or Default
                  </h3>
                  <p className="text-center text-muted-foreground text-sm sm:text-base">
                    Repay your loan with interest to get your NFT back, or
                    default and the NFT transfers to the lender.
                  </p>
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center text-sm font-medium text-monad-500 hover:text-monad-700"
                  >
                    Manage loans <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Built on Monad Section */}
          <section className="w-full py-12 md:py-16 lg:py-24">
            <div className="container mx-auto px-4 md:px-6 lg:px-8">
              <div className="grid gap-8 md:gap-10 lg:grid-cols-2 items-center">
                <div className="space-y-4 md:space-y-6">
                  <div className="inline-block rounded-full bg-monad-100 px-3 py-1 text-sm font-medium text-monad-800">
                    Powered by Monad
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold tracking-tighter md:text-4xl">
                    Built on the Fastest Blockchain
                  </h2>
                  <p className="text-muted-foreground text-base sm:text-lg">
                    LendHub leverages the speed and efficiency of the Monad
                    blockchain for a seamless lending experience with:
                  </p>

                  <ul className="space-y-3">
                    {[
                      "Lightning-fast transaction speeds",
                      "Minimal gas fees for all operations",
                      "Secure and transparent loan contracts",
                      "Cross-chain compatibility (coming soon)",
                    ].map((feature, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 flex-shrink-0">
                          <svg
                            className="h-4 w-4 text-green-600"
                            fill="none"
                            height="24"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            width="24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </div>
                        <span className="text-sm sm:text-base">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-center gap-4 pt-4">
                    <Image
                      src="https://amethyst-conscious-vole-978.mypinata.cloud/ipfs/bafkreid7sltmasp74vubafpketmw3b4kp7wpzy7idinapdqgktq6c3e5aq"
                      alt="LendHub Logo"
                      width={40}
                      height={40}
                      className="object-contain"
                    />
                    <div className="h-10 w-px bg-border" />
                    <Image
                      src="/placeholder.svg?height=40&width=120&text=MONAD"
                      alt="Monad Logo"
                      width={120}
                      height={40}
                      className="object-contain"
                    />
                  </div>
                </div>

                <div className="relative mx-auto lg:mx-0 max-w-md w-full">
                  <div className="relative rounded-xl overflow-hidden border border-monad-border shadow-xl aspect-square">
                    <Image
                      src="/placeholder.svg?height=600&width=600"
                      alt="Monad Blockchain"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-monad-500/40 to-monad-700/40 flex items-center justify-center">
                      <div className="text-center p-4 sm:p-6">
                        <div className="inline-flex items-center justify-center h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-white/20 backdrop-blur-sm mb-4">
                          <Zap className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                          Blazing Fast
                        </h3>
                        <p className="text-white/80 text-sm sm:text-base">
                          Experience transaction speeds of up to 10,000 TPS on
                          the Monad blockchain
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Decorative elements */}
                  <div className="absolute -z-10 -bottom-6 -right-6 h-64 w-64 rounded-full bg-monad-200/50 blur-2xl" />
                  <div className="absolute -z-10 -top-6 -left-6 h-64 w-64 rounded-full bg-monad-300/30 blur-2xl" />
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="w-full py-12 md:py-16 lg:py-24 bg-monad-500">
            <div className="container mx-auto px-4 md:px-6 lg:px-8">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tighter md:text-4xl text-white">
                  Ready to Get Started?
                </h2>
                <p className="max-w-[600px] text-white/80 text-base sm:text-lg md:text-xl">
                  Join thousands of users already leveraging their NFTs or
                  earning interest on our platform.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 mt-6 w-full sm:w-auto">
                  <Link href="/borrow" className="w-full sm:w-auto">
                    <Button
                      size="lg"
                      className="w-full sm:w-auto bg-white text-monad-500 hover:bg-white/90"
                    >
                      Borrow Now <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/lend" className="w-full sm:w-auto">
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full sm:w-auto border-white text-white hover:bg-white/10"
                    >
                      Become a Lender <Coins className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </main>

        <footer className="w-full border-t bg-background">
          <div className="container mx-auto px-4 py-8 md:py-12 md:px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Image
                    src="https://amethyst-conscious-vole-978.mypinata.cloud/ipfs/bafkreid7sltmasp74vubafpketmw3b4kp7wpzy7idinapdqgktq6c3e5aq"
                    alt="LendHub Logo"
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                  <h3 className="text-lg font-bold">LendHub</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  The premier NFT lending platform on the Monad blockchain.
                </p>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-3 md:mb-4">Platform</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link
                      href="/borrow"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      Borrow
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/lend"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      Lend
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/dashboard"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/collections"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      Collections
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-3 md:mb-4">
                  Resources
                </h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link
                      href="/docs"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      Documentation
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/faq"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      FAQ
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/blog"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      Blog
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-3 md:mb-4">Legal</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link
                      href="/terms"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/privacy"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      Privacy Policy
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-8 md:mt-12 flex flex-col items-center justify-between gap-4 border-t pt-6 md:flex-row md:pt-8">
              <p className="text-xs text-muted-foreground">
                © 2025 LendHub. All rights reserved.
              </p>
              <div className="flex gap-4">
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                  </svg>
                </Link>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect width="4" height="12" x="2" y="9"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                </Link>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
      <Toaster />
    </WagmiConfig>
  );
}
