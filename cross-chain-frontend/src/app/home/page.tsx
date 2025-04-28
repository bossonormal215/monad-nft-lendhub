// // import { Header } from "@/components/header";
// import { Button } from "@/Components/privy/ui/button";
// import Link from "next/link";
// import Image from "next/image";
// import { Toaster } from "@/Components/privy/ui/toaster";
// import { WagmiConfig } from "@/providers/wagmi-provider";
// import { LendingStatsCard } from "@/components/LendingStatsCard";

// export default function Home() {
//   return (
//     <WagmiConfig>
//       <div className="flex min-h-screen flex-col">
//         {/* <Header /> */}
//         <main className="flex-1">
//           <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
//             <div className="container px-4 md:px-6">
//               <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
//                 <div className="flex flex-col justify-center space-y-4">
//                   <div className="space-y-2">
//                     <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
//                       Unlock the Value of Your NFTs
//                     </h1>
//                     <p className="max-w-[600px] text-muted-foreground md:text-xl">
//                       NFT LendHub is a peer-to-peer lending platform that allows
//                       you to use your NFTs as collateral for loans or earn
//                       interest by lending to others.
//                     </p>
//                   </div>
//                   <div className="flex flex-col gap-2 min-[400px]:flex-row">
//                     <Link href="/borrow">
//                       <Button className="bg-monad-500 hover:bg-monad-600">
//                         Borrow Now
//                       </Button>
//                     </Link>
//                     <Link href="/lend">
//                       <Button>Become a Lender</Button>
//                     </Link>
//                   </div>
//                 </div>
//                 {/* <div className="flex items-center justify-center">
//                   <div className="relative h-[300px] w-[300px] md:h-[400px] md:w-[400px] lg:h-[500px] lg:w-[500px]">
//                     <Image
//                       // src='https://amethyst-conscious-vole-978.mypinata.cloud/ipfs/bafkreid3blc55ixcdd4w2d22rmbecqnju7255pznqutfj2szxje5axvllq'
//                       src="https://amethyst-conscious-vole-978.mypinata.cloud/ipfs/bafkreid7sltmasp74vubafpketmw3b4kp7wpzy7idinapdqgktq6c3e5aq"
//                       alt="Monad Logo"
//                       fill
//                       // width={200}
//                       // height={80}
//                       className="object-contain"
//                     />
//                   </div>
//                 </div> */}
//               </div>
//             </div>
//           </section>

//           {/* Lending Stats Card Section */}
//           <section className="w-full py-12 md:py-24 lg:py-32">
//             <div className="container px-4 md:px-6">
//               <div className="flex flex-col items-center justify-center space-y-4 text-center mb-6">
//                 <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
//                   Lending Activity Stats
//                 </h2>
//                 <p className="max-w-[800px] text-muted-foreground md:text-xl">
//                   Real-time metrics showing total loan volume, number of loans,
//                   and top lenders on the platform.
//                 </p>
//               </div>
//               <LendingStatsCard />
//             </div>
//           </section>

//           <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
//             <div className="container px-4 md:px-6">
//               <div className="flex flex-col items-center justify-center space-y-4 text-center">
//                 <div className="space-y-2">
//                   <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
//                     How It Works
//                   </h2>
//                   <p className="max-w-[900px] text-muted-foreground md:text-xl">
//                     Our platform makes it easy to get liquidity from your NFTs
//                     or earn interest by lending to others.
//                   </p>
//                 </div>
//               </div>
//               <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3 lg:gap-12">
//                 <div className="flex flex-col items-center space-y-2 border rounded-lg p-4">
//                   <div className="flex h-16 w-16 items-center justify-center rounded-full bg-monad-100">
//                     <svg
//                       className="h-8 w-8 text-monad-500"
//                       fill="none"
//                       height="24"
//                       stroke="currentColor"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth="2"
//                       viewBox="0 0 24 24"
//                       width="24"
//                       xmlns="http://www.w3.org/2000/svg"
//                     >
//                       <path d="M21 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v3" />
//                       <path d="M21 16v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3" />
//                       <path d="M4 12H2" />
//                       <path d="M10 12H8" />
//                       <path d="M16 12h-2" />
//                       <path d="M22 12h-2" />
//                     </svg>
//                   </div>
//                   <h3 className="text-xl font-bold">List Your NFT</h3>
//                   <p className="text-center text-muted-foreground">
//                     List your NFT as collateral and specify your loan terms.
//                   </p>
//                 </div>
//                 <div className="flex flex-col items-center space-y-2 border rounded-lg p-4">
//                   <div className="flex h-16 w-16 items-center justify-center rounded-full bg-monad-100">
//                     <svg
//                       className="h-8 w-8 text-monad-500"
//                       fill="none"
//                       height="24"
//                       stroke="currentColor"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth="2"
//                       viewBox="0 0 24 24"
//                       width="24"
//                       xmlns="http://www.w3.org/2000/svg"
//                     >
//                       <path d="M12 2v20" />
//                       <path d="M17 12H2" />
//                     </svg>
//                   </div>
//                   <h3 className="text-xl font-bold">Get Funded</h3>
//                   <p className="text-center text-muted-foreground">
//                     Lenders browse available NFTs and fund loans they're
//                     interested in.
//                   </p>
//                 </div>
//                 <div className="flex flex-col items-center space-y-2 border rounded-lg p-4">
//                   <div className="flex h-16 w-16 items-center justify-center rounded-full bg-monad-100">
//                     <svg
//                       className="h-8 w-8 text-monad-500"
//                       fill="none"
//                       height="24"
//                       stroke="currentColor"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth="2"
//                       viewBox="0 0 24 24"
//                       width="24"
//                       xmlns="http://www.w3.org/2000/svg"
//                     >
//                       <path d="M12 22V8" />
//                       <path d="m5 12-2-2 2-2" />
//                       <path d="m19 12 2-2-2-2" />
//                       <path d="M5 10h14" />
//                       <path d="m15 19-3 3-3-3" />
//                     </svg>
//                   </div>
//                   <h3 className="text-xl font-bold">Repay or Default</h3>
//                   <p className="text-center text-muted-foreground">
//                     Repay your loan to get your NFT back, or default and lose
//                     your NFT to the lender.
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </section>
//           <section className="w-full py-12 md:py-24 lg:py-32">
//             <div className="container px-4 md:px-6">
//               <div className="flex flex-col items-center justify-center space-y-4 text-center">
//                 <div className="space-y-2">
//                   <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
//                     Built on Monad
//                   </h2>
//                   <p className="max-w-[900px] text-muted-foreground md:text-xl">
//                     Leveraging the speed and efficiency of the Monad blockchain
//                     for a seamless lending experience.
//                   </p>
//                 </div>
//                 {/* <div className="mx-auto w-full max-w-sm space-y-2">
//                   <div className="flex justify-center">
//                     <Image
//                       // src='https://amethyst-conscious-vole-978.mypinata.cloud/ipfs/bafkreid3blc55ixcdd4w2d22rmbecqnju7255pznqutfj2szxje5axvllq'
//                       src="https://amethyst-conscious-vole-978.mypinata.cloud/ipfs/bafkreid7sltmasp74vubafpketmw3b4kp7wpzy7idinapdqgktq6c3e5aq"
//                       alt="Monad Logo"
//                       width={200}
//                       height={80}
//                       className="object-contain"
//                     />
//                   </div>
//                 </div> */}
//               </div>
//             </div>
//           </section>
//         </main>
//         <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
//           <p className="text-xs text-muted-foreground">
//             © 2024 NFT LendHub. All rights reserved.
//           </p>
//           <nav className="sm:ml-auto flex gap-4 sm:gap-6">
//             <Link
//               href="#"
//               className="text-xs hover:underline underline-offset-4"
//             >
//               Terms of Service
//             </Link>
//             <Link
//               href="#"
//               className="text-xs hover:underline underline-offset-4"
//             >
//               Privacy
//             </Link>
//           </nav>
//         </footer>
//       </div>
//       <Toaster />
//     </WagmiConfig>
//   );
// }

/////////////////////////////////////-----------------V0 1--------------------//////////////////////////

// "use client";

// import { Button } from "@/Components/privy/ui/button";
// import Link from "next/link";
// import Image from "next/image";
// import { Toaster } from "@/Components/privy/ui/toaster";
// import { WagmiConfig } from "@/providers/wagmi-provider";
// import { LendingStatsCard } from "@/components/LendingStatsCard";
// import { motion } from "framer-motion";
// import {
//   ArrowRight,
//   Wallet,
//   Coins,
//   RefreshCw,
//   Shield,
//   Zap,
//   ChevronRight,
// } from "lucide-react";

// export default function Home() {
//   return (
//     <WagmiConfig>
//       <div className="flex min-h-screen flex-col bg-gradient-to-b from-background to-background/95">
//         <main className="flex-1">
//           {/* Hero Section */}
//           <section className="relative w-full overflow-hidden py-20 md:py-32">
//             {/* Background gradient */}
//             <div className="absolute inset-0 bg-gradient-radial from-purple-500/10 to-transparent" />

//             {/* Animated circles */}
//             <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-purple-500/5 blur-3xl" />
//             <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" />

//             <div className="container relative px-4 md:px-6">
//               <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
//                 <div className="flex flex-col justify-center space-y-8">
//                   <div className="flex items-center gap-2">
//                     <Image
//                       // src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/monad%20lendhub%20bradning%203-vi0PeD6DQ9eLlQGKTnxMeFTs9DSPOj.png"
//                       src="https://amethyst-conscious-vole-978.mypinata.cloud/ipfs/bafkreid7sltmasp74vubafpketmw3b4kp7wpzy7idinapdqgktq6c3e5aq"
//                       alt="MonadLendHub Logo"
//                       width={60}
//                       height={60}
//                       className="object-contain"
//                     />
//                     <h2 className="text-2xl font-bold tracking-tight">
//                       MonadLendHub
//                     </h2>
//                   </div>

//                   <div className="space-y-4">
//                     <motion.h1
//                       className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent"
//                       initial={{ opacity: 0, y: 20 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       transition={{ duration: 0.5 }}
//                     >
//                       Unlock the Value of Your NFTs
//                     </motion.h1>
//                     <motion.p
//                       className="max-w-[600px] text-muted-foreground text-lg md:text-xl"
//                       initial={{ opacity: 0, y: 20 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       transition={{ duration: 0.5, delay: 0.1 }}
//                     >
//                       A peer-to-peer lending platform that allows you to use
//                       your NFTs as collateral for loans or earn interest by
//                       lending to others.
//                     </motion.p>
//                   </div>

//                   <motion.div
//                     className="flex flex-col sm:flex-row gap-4"
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.5, delay: 0.2 }}
//                   >
//                     <Link href="/borrow">
//                       <Button
//                         size="lg"
//                         className="bg-purple-600 hover:bg-purple-700 text-white"
//                       >
//                         Borrow Now <ArrowRight className="ml-2 h-4 w-4" />
//                       </Button>
//                     </Link>
//                     <Link href="/lend">
//                       <Button
//                         size="lg"
//                         variant="outline"
//                         className="border-purple-200 hover:bg-purple-100/50"
//                       >
//                         Become a Lender <Coins className="ml-2 h-4 w-4" />
//                       </Button>
//                     </Link>
//                   </motion.div>

//                   <motion.div
//                     className="flex items-center gap-2 text-sm text-muted-foreground"
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     transition={{ duration: 0.5, delay: 0.3 }}
//                   >
//                     <Shield className="h-4 w-4 text-green-500" />
//                     <span>Secure, transparent, and decentralized lending</span>
//                   </motion.div>
//                 </div>

//                 <motion.div
//                   className="relative mx-auto lg:mx-0"
//                   initial={{ opacity: 0, scale: 0.9 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   transition={{ duration: 0.7 }}
//                 >
//                   <div className="relative h-[400px] w-[400px] rounded-2xl overflow-hidden border border-purple-200/30 shadow-xl">
//                     <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-purple-700/20" />
//                     <Image
//                       src="/placeholder.svg?height=800&width=800"
//                       alt="NFT Lending Platform"
//                       fill
//                       className="object-cover"
//                     />
//                     <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6">
//                       <div className="space-y-2">
//                         <div className="flex items-center gap-2">
//                           <div className="h-8 w-8 rounded-full bg-purple-500 flex items-center justify-center">
//                             <Wallet className="h-4 w-4 text-white" />
//                           </div>
//                           <span className="text-white font-medium">
//                             NFT Collateral
//                           </span>
//                         </div>
//                         <h3 className="text-xl font-bold text-white">
//                           Bored Ape #1234
//                         </h3>
//                         <div className="flex justify-between items-center">
//                           <div className="text-sm text-white/80">
//                             <span className="block">Loan Amount</span>
//                             <span className="font-bold text-white">
//                               5,000 wMON
//                             </span>
//                           </div>
//                           <div className="text-sm text-white/80">
//                             <span className="block">Interest Rate</span>
//                             <span className="font-bold text-white">8.5%</span>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Floating cards */}
//                   <div className="absolute -top-6 -right-6 h-24 w-48 rounded-lg bg-white/90 backdrop-blur-sm p-3 shadow-lg border border-purple-100 flex items-center gap-3">
//                     <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
//                       <Zap className="h-6 w-6 text-green-600" />
//                     </div>
//                     <div>
//                       <p className="text-xs text-muted-foreground">
//                         Total Value Locked
//                       </p>
//                       <p className="font-bold">$2.4M</p>
//                     </div>
//                   </div>

//                   <div className="absolute -bottom-6 -left-6 h-24 w-48 rounded-lg bg-white/90 backdrop-blur-sm p-3 shadow-lg border border-purple-100 flex items-center gap-3">
//                     <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
//                       <RefreshCw className="h-6 w-6 text-blue-600" />
//                     </div>
//                     <div>
//                       <p className="text-xs text-muted-foreground">
//                         Active Loans
//                       </p>
//                       <p className="font-bold">1,240</p>
//                     </div>
//                   </div>
//                 </motion.div>
//               </div>
//             </div>
//           </section>

//           {/* Stats Section */}
//           <section className="w-full py-16 md:py-24">
//             <div className="container px-4 md:px-6">
//               <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
//                 <div className="inline-block rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-800 mb-2">
//                   Platform Metrics
//                 </div>
//                 <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
//                   Real-Time Lending Activity
//                 </h2>
//                 <p className="max-w-[800px] text-muted-foreground md:text-xl">
//                   Track the pulse of our platform with live metrics showing loan
//                   volume, active loans, and top lenders.
//                 </p>
//               </div>
//               <LendingStatsCard />
//             </div>
//           </section>

//           {/* How It Works Section */}
//           <section className="w-full py-16 md:py-24 bg-purple-50/50">
//             <div className="container px-4 md:px-6">
//               <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
//                 <div className="inline-block rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-800 mb-2">
//                   Simple Process
//                 </div>
//                 <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
//                   How It Works
//                 </h2>
//                 <p className="max-w-[800px] text-muted-foreground md:text-xl">
//                   Our platform makes it easy to get liquidity from your NFTs or
//                   earn interest by lending to others.
//                 </p>
//               </div>

//               <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 py-8 md:grid-cols-3 lg:gap-12">
//                 {/* Step 1 */}
//                 <div className="group relative flex flex-col items-center space-y-4 rounded-2xl bg-white p-6 shadow-sm transition-all hover:shadow-md">
//                   <div className="absolute -top-5 left-1/2 -translate-x-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-purple-600 text-white font-bold">
//                     1
//                   </div>
//                   <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 group-hover:bg-purple-200 transition-colors">
//                     <svg
//                       className="h-8 w-8 text-purple-600"
//                       fill="none"
//                       height="24"
//                       stroke="currentColor"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth="2"
//                       viewBox="0 0 24 24"
//                       width="24"
//                       xmlns="http://www.w3.org/2000/svg"
//                     >
//                       <path d="M21 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v3" />
//                       <path d="M21 16v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3" />
//                       <path d="M4 12H2" />
//                       <path d="M10 12H8" />
//                       <path d="M16 12h-2" />
//                       <path d="M22 12h-2" />
//                     </svg>
//                   </div>
//                   <h3 className="text-xl font-bold">List Your NFT</h3>
//                   <p className="text-center text-muted-foreground">
//                     Connect your wallet and list your NFT as collateral,
//                     specifying your desired loan terms.
//                   </p>
//                   <Link
//                     href="/borrow"
//                     className="inline-flex items-center text-sm font-medium text-purple-600 hover:text-purple-800"
//                   >
//                     Learn more <ChevronRight className="ml-1 h-4 w-4" />
//                   </Link>
//                 </div>

//                 {/* Step 2 */}
//                 <div className="group relative flex flex-col items-center space-y-4 rounded-2xl bg-white p-6 shadow-sm transition-all hover:shadow-md">
//                   <div className="absolute -top-5 left-1/2 -translate-x-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-purple-600 text-white font-bold">
//                     2
//                   </div>
//                   <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 group-hover:bg-purple-200 transition-colors">
//                     <svg
//                       className="h-8 w-8 text-purple-600"
//                       fill="none"
//                       height="24"
//                       stroke="currentColor"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth="2"
//                       viewBox="0 0 24 24"
//                       width="24"
//                       xmlns="http://www.w3.org/2000/svg"
//                     >
//                       <path d="M12 2v20" />
//                       <path d="M17 12H2" />
//                     </svg>
//                   </div>
//                   <h3 className="text-xl font-bold">Get Funded</h3>
//                   <p className="text-center text-muted-foreground">
//                     Lenders browse available NFTs and fund loans they're
//                     interested in based on your terms.
//                   </p>
//                   <Link
//                     href="/marketplace"
//                     className="inline-flex items-center text-sm font-medium text-purple-600 hover:text-purple-800"
//                   >
//                     View marketplace <ChevronRight className="ml-1 h-4 w-4" />
//                   </Link>
//                 </div>

//                 {/* Step 3 */}
//                 <div className="group relative flex flex-col items-center space-y-4 rounded-2xl bg-white p-6 shadow-sm transition-all hover:shadow-md">
//                   <div className="absolute -top-5 left-1/2 -translate-x-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-purple-600 text-white font-bold">
//                     3
//                   </div>
//                   <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 group-hover:bg-purple-200 transition-colors">
//                     <svg
//                       className="h-8 w-8 text-purple-600"
//                       fill="none"
//                       height="24"
//                       stroke="currentColor"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth="2"
//                       viewBox="0 0 24 24"
//                       width="24"
//                       xmlns="http://www.w3.org/2000/svg"
//                     >
//                       <path d="M12 22V8" />
//                       <path d="m5 12-2-2 2-2" />
//                       <path d="m19 12 2-2-2-2" />
//                       <path d="M5 10h14" />
//                       <path d="m15 19-3 3-3-3" />
//                     </svg>
//                   </div>
//                   <h3 className="text-xl font-bold">Repay or Default</h3>
//                   <p className="text-center text-muted-foreground">
//                     Repay your loan with interest to get your NFT back, or
//                     default and the NFT transfers to the lender.
//                   </p>
//                   <Link
//                     href="/dashboard"
//                     className="inline-flex items-center text-sm font-medium text-purple-600 hover:text-purple-800"
//                   >
//                     Manage loans <ChevronRight className="ml-1 h-4 w-4" />
//                   </Link>
//                 </div>
//               </div>
//             </div>
//           </section>

//           {/* Built on Monad Section */}
//           <section className="w-full py-16 md:py-24">
//             <div className="container px-4 md:px-6">
//               <div className="grid gap-10 lg:grid-cols-2 items-center">
//                 <div className="space-y-6">
//                   <div className="inline-block rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-800">
//                     Powered by Monad
//                   </div>
//                   <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
//                     Built on the Fastest Blockchain
//                   </h2>
//                   <p className="text-muted-foreground text-lg">
//                     MonadLendHub leverages the speed and efficiency of the Monad
//                     blockchain for a seamless lending experience with:
//                   </p>

//                   <ul className="space-y-3">
//                     {[
//                       "Lightning-fast transaction speeds",
//                       "Minimal gas fees for all operations",
//                       "Secure and transparent loan contracts",
//                       "Cross-chain compatibility (coming soon)",
//                     ].map((feature, i) => (
//                       <li key={i} className="flex items-center gap-3">
//                         <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
//                           <svg
//                             className="h-4 w-4 text-green-600"
//                             fill="none"
//                             height="24"
//                             stroke="currentColor"
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth="2"
//                             viewBox="0 0 24 24"
//                             width="24"
//                             xmlns="http://www.w3.org/2000/svg"
//                           >
//                             <polyline points="20 6 9 17 4 12" />
//                           </svg>
//                         </div>
//                         <span>{feature}</span>
//                       </li>
//                     ))}
//                   </ul>

//                   <div className="flex items-center gap-4 pt-4">
//                     <Image
//                       // src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/monad%20lendhub%20bradning%203-vi0PeD6DQ9eLlQGKTnxMeFTs9DSPOj.png"
//                       src="https://amethyst-conscious-vole-978.mypinata.cloud/ipfs/bafkreid7sltmasp74vubafpketmw3b4kp7wpzy7idinapdqgktq6c3e5aq"
//                       alt="MonadLendHub Logo"
//                       width={40}
//                       height={40}
//                       className="object-contain"
//                     />
//                     <div className="h-10 w-px bg-border" />
//                     <Image
//                       src="/placeholder.svg?height=40&width=120&text=MONAD"
//                       alt="Monad Logo"
//                       width={120}
//                       height={40}
//                       className="object-contain"
//                     />
//                   </div>
//                 </div>

//                 <div className="relative mx-auto lg:mx-0 max-w-md">
//                   <div className="relative rounded-2xl overflow-hidden border border-purple-200/30 shadow-xl aspect-square">
//                     <Image
//                       src="/placeholder.svg?height=600&width=600"
//                       alt="Monad Blockchain"
//                       fill
//                       className="object-cover"
//                     />
//                     <div className="absolute inset-0 bg-gradient-to-br from-purple-500/40 to-purple-700/40 flex items-center justify-center">
//                       <div className="text-center p-6">
//                         <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-white/20 backdrop-blur-sm mb-4">
//                           <Zap className="h-8 w-8 text-white" />
//                         </div>
//                         <h3 className="text-2xl font-bold text-white mb-2">
//                           Blazing Fast
//                         </h3>
//                         <p className="text-white/80">
//                           Experience transaction speeds of up to 10,000 TPS on
//                           the Monad blockchain
//                         </p>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Decorative elements */}
//                   <div className="absolute -z-10 -bottom-6 -right-6 h-64 w-64 rounded-full bg-purple-200/50 blur-2xl" />
//                   <div className="absolute -z-10 -top-6 -left-6 h-64 w-64 rounded-full bg-purple-300/30 blur-2xl" />
//                 </div>
//               </div>
//             </div>
//           </section>

//           {/* CTA Section */}
//           <section className="w-full py-16 md:py-24 bg-purple-600">
//             <div className="container px-4 md:px-6">
//               <div className="flex flex-col items-center justify-center space-y-4 text-center">
//                 <h2 className="text-3xl font-bold tracking-tighter md:text-4xl text-white">
//                   Ready to Get Started?
//                 </h2>
//                 <p className="max-w-[600px] text-white/80 md:text-xl">
//                   Join thousands of users already leveraging their NFTs or
//                   earning interest on our platform.
//                 </p>
//                 <div className="flex flex-col sm:flex-row gap-4 mt-6">
//                   <Link href="/borrow">
//                     <Button
//                       size="lg"
//                       className="bg-white text-purple-600 hover:bg-white/90"
//                     >
//                       Borrow Now <ArrowRight className="ml-2 h-4 w-4" />
//                     </Button>
//                   </Link>
//                   <Link href="/lend">
//                     <Button
//                       size="lg"
//                       variant="outline"
//                       className="border-white text-white hover:bg-white/10"
//                     >
//                       Become a Lender <Coins className="ml-2 h-4 w-4" />
//                     </Button>
//                   </Link>
//                 </div>
//               </div>
//             </div>
//           </section>
//         </main>

//         <footer className="w-full border-t bg-background">
//           <div className="container px-4 py-12 md:px-6">
//             <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
//               <div className="space-y-4">
//                 <div className="flex items-center gap-2">
//                   <Image
//                     // src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/monad%20lendhub%20bradning%203-vi0PeD6DQ9eLlQGKTnxMeFTs9DSPOj.png"
//                     src="https://amethyst-conscious-vole-978.mypinata.cloud/ipfs/bafkreid7sltmasp74vubafpketmw3b4kp7wpzy7idinapdqgktq6c3e5aq"
//                     alt="MonadLendHub Logo"
//                     width={40}
//                     height={40}
//                     className="object-contain"
//                   />
//                   <h3 className="text-lg font-bold">MonadLendHub</h3>
//                 </div>
//                 <p className="text-sm text-muted-foreground">
//                   The premier NFT lending platform on the Monad blockchain.
//                 </p>
//               </div>

//               <div>
//                 <h4 className="text-sm font-semibold mb-4">Platform</h4>
//                 <ul className="space-y-2 text-sm">
//                   <li>
//                     <Link
//                       href="/borrow"
//                       className="text-muted-foreground hover:text-foreground"
//                     >
//                       Borrow
//                     </Link>
//                   </li>
//                   <li>
//                     <Link
//                       href="/lend"
//                       className="text-muted-foreground hover:text-foreground"
//                     >
//                       Lend
//                     </Link>
//                   </li>
//                   <li>
//                     <Link
//                       href="/dashboard"
//                       className="text-muted-foreground hover:text-foreground"
//                     >
//                       Dashboard
//                     </Link>
//                   </li>
//                   <li>
//                     <Link
//                       href="/marketplace"
//                       className="text-muted-foreground hover:text-foreground"
//                     >
//                       Marketplace
//                     </Link>
//                   </li>
//                 </ul>
//               </div>

//               <div>
//                 <h4 className="text-sm font-semibold mb-4">Resources</h4>
//                 <ul className="space-y-2 text-sm">
//                   <li>
//                     <Link
//                       href="/docs"
//                       className="text-muted-foreground hover:text-foreground"
//                     >
//                       Documentation
//                     </Link>
//                   </li>
//                   <li>
//                     <Link
//                       href="/faq"
//                       className="text-muted-foreground hover:text-foreground"
//                     >
//                       FAQ
//                     </Link>
//                   </li>
//                   <li>
//                     <Link
//                       href="/blog"
//                       className="text-muted-foreground hover:text-foreground"
//                     >
//                       Blog
//                     </Link>
//                   </li>
//                 </ul>
//               </div>

//               <div>
//                 <h4 className="text-sm font-semibold mb-4">Legal</h4>
//                 <ul className="space-y-2 text-sm">
//                   <li>
//                     <Link
//                       href="/terms"
//                       className="text-muted-foreground hover:text-foreground"
//                     >
//                       Terms of Service
//                     </Link>
//                   </li>
//                   <li>
//                     <Link
//                       href="/privacy"
//                       className="text-muted-foreground hover:text-foreground"
//                     >
//                       Privacy Policy
//                     </Link>
//                   </li>
//                 </ul>
//               </div>
//             </div>

//             <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 md:flex-row">
//               <p className="text-xs text-muted-foreground">
//                 © 2024 MonadLendHub. All rights reserved.
//               </p>
//               <div className="flex gap-4">
//                 <Link
//                   href="#"
//                   className="text-muted-foreground hover:text-foreground"
//                 >
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     width="24"
//                     height="24"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     className="h-5 w-5"
//                   >
//                     <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
//                   </svg>
//                 </Link>
//                 <Link
//                   href="#"
//                   className="text-muted-foreground hover:text-foreground"
//                 >
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     width="24"
//                     height="24"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     className="h-5 w-5"
//                   >
//                     <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
//                     <rect width="4" height="12" x="2" y="9"></rect>
//                     <circle cx="4" cy="4" r="2"></circle>
//                   </svg>
//                 </Link>
//                 <Link
//                   href="#"
//                   className="text-muted-foreground hover:text-foreground"
//                 >
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     width="24"
//                     height="24"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     className="h-5 w-5"
//                   >
//                     <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
//                   </svg>
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </footer>
//       </div>
//       <Toaster />
//     </WagmiConfig>
//   );
// }

///////////////////////////////////------------------- V0 2------------------------------////////////////////////

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
  RefreshCw,
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
          <section className="relative w-full overflow-hidden py-20 md:py-32">
            {/* Background elements */}
            <div className="absolute inset-0 bg-gradient-to-b from-monad-100/10 to-transparent" />
            <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-monad-500/5 blur-3xl" />
            <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-monad-500/10 blur-3xl" />

            <div className="container relative px-4 md:px-6">
              <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
                <div className="flex flex-col justify-center space-y-8">
                  <div className="flex items-center gap-2">
                    <Image
                      // src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/monad%20lendhub%20bradning%203-vi0PeD6DQ9eLlQGKTnxMeFTs9DSPOj.png"
                      src="https://amethyst-conscious-vole-978.mypinata.cloud/ipfs/bafkreid7sltmasp74vubafpketmw3b4kp7wpzy7idinapdqgktq6c3e5aq"
                      alt="LendHub Logo"
                      width={60}
                      height={60}
                      className="object-contain"
                    />
                    <h2 className="text-2xl font-bold tracking-tight">
                      LendHub
                    </h2>
                  </div>

                  <div className="space-y-4">
                    <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-transparent bg-clip-text bg-gradient-to-r from-monad-500 to-monad-400">
                      Unlock the Value of Your NFTs
                    </h1>
                    <p className="max-w-[600px] text-muted-foreground text-lg md:text-xl">
                      A peer-to-peer lending platform that allows you to use
                      your NFTs as collateral for loans or earn interest by
                      lending to others.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="/borrow">
                      <Button
                        size="lg"
                        className="bg-monad-500 hover:bg-monad-600 text-white"
                      >
                        Borrow Now <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href="/lend">
                      <Button
                        size="lg"
                        variant="outline"
                        className="border-monad-200 hover:bg-monad-100/50"
                      >
                        Become a Lender <Coins className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Shield className="h-4 w-4 text-green-500" />
                    <span>Secure, transparent, and decentralized lending</span>
                  </div>
                </div>

                <div className="relative mx-auto lg:mx-0">
                  <div className="relative h-[400px] w-[400px] rounded-2xl overflow-hidden border border-monad-border shadow-xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-monad-500/20 to-monad-700/20" />
                    <Image
                      // src="/placeholder.svg?height=800&width=800"
                      src="https://img-cdn.magiceden.dev/da:t/rs:fill:400:0:0/plain/https%3A%2F%2Fimg.reservoir.tools%2Fimages%2Fv2%2Fmonad-testnet%2Fi9YO%252F4yHXUdJsWcTqhqvfyYhpIDLRIn3OfXbN8%252FIcvlCHo66zPoi7Iq0LydbELkQ9YmFoJL1KKkaCYzEP6TxJZ3JuarMMwuBI7hd7qzh4xE%253D.png"
                      alt="NFT Lending Platform"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6">
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

                  {/* Floating cards */}
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
          <section className="w-full py-16 md:py-24">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
                <div className="inline-block rounded-full bg-monad-100 px-3 py-1 text-sm font-medium text-monad-800 mb-2">
                  Platform Metrics
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                  Real-Time Lending Activity
                </h2>
                <p className="max-w-[800px] text-muted-foreground md:text-xl">
                  Track the pulse of our platform with live metrics showing loan
                  volume, active loans, and top lenders.
                </p>
              </div>
              <LendingStatsCard />
            </div>
          </section>

          {/* How It Works Section */}
          {/* <section className="w-full py-16 md:py-24 bg-monad-100/20"> */}
          <section className="bg-[#1C2839] p-4 border border-[#2C3545] rounded-2xl p-8 mb-12">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                <div className="inline-block rounded-full bg-monad-100 px-3 py-1 text-sm font-medium text-monad-800 mb-2">
                  Simple Process
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                  How It Works
                </h2>
                <p className="max-w-[800px] text-muted-foreground md:text-xl">
                  Our platform makes it easy to get liquidity from your NFTs or
                  earn interest by lending to others.
                </p>
              </div>

              <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 py-8 md:grid-cols-3 lg:gap-12">
                {/* Step 1 */}
                {/* <div className="group relative flex flex-col items-center space-y-4 rounded-2xl bg-white p-6 shadow-sm transition-all hover:shadow-md">
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-monad-500 text-white font-bold"> */}
                <div className="group relative flex flex-col items-center space-y-4 rounded-2xl bg-white p-6 shadow-sm transition-all hover:shadow-md border border-monad-border">
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
                  <h3 className="text-xl font-bold">List Your NFT</h3>
                  <p className="text-center text-muted-foreground">
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
                <div className="group relative flex flex-col items-center space-y-4 rounded-2xl bg-white p-6 shadow-sm transition-all hover:shadow-md">
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
                  <h3 className="text-xl font-bold">Get Funded</h3>
                  <p className="text-center text-muted-foreground">
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
                <div className="group relative flex flex-col items-center space-y-4 rounded-2xl bg-white p-6 shadow-sm transition-all hover:shadow-md">
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
                  <h3 className="text-xl font-bold">Repay or Default</h3>
                  <p className="text-center text-muted-foreground">
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
          <section className="w-full py-16 md:py-24">
            <div className="container px-4 md:px-6">
              <div className="grid gap-10 lg:grid-cols-2 items-center">
                <div className="space-y-6">
                  <div className="inline-block rounded-full bg-monad-100 px-3 py-1 text-sm font-medium text-monad-800">
                    Powered by Monad
                  </div>
                  <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                    Built on the Fastest Blockchain
                  </h2>
                  <p className="text-muted-foreground text-lg">
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
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
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
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-center gap-4 pt-4">
                    <Image
                      // src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/monad%20lendhub%20bradning%203-vi0PeD6DQ9eLlQGKTnxMeFTs9DSPOj.png"
                      src="https://amethyst-conscious-vole-978.mypinata.cloud/ipfs/bafkreid7sltmasp74vubafpketmw3b4kp7wpzy7idinapdqgktq6c3e5aq"
                      alt="LendHub Logo"
                      width={40}
                      height={40}
                      className="object-contain"
                    />
                    <div className="h-10 w-px bg-border" />
                    <Image
                      src="/placeholder.svg?height=40&width=120&text=MONAD"
                      // src="https://cdn.prod.website-files.com/667c57e6f9254a4b6d914440/667d7104644c621965495f6e_LogoMark.svg"
                      alt="Monad Logo"
                      width={120}
                      height={40}
                      className="object-contain"
                    />
                  </div>
                </div>

                <div className="relative mx-auto lg:mx-0 max-w-md">
                  <div className="relative rounded-xl overflow-hidden border border-monad-border shadow-xl aspect-square">
                    <Image
                      src="/placeholder.svg?height=600&width=600"
                      // src="https://cdn.prod.website-files.com/667c57e6f9254a4b6d914440/667d7104644c621965495f6e_LogoMark.svg"
                      alt="Monad Blockchain"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-monad-500/40 to-monad-700/40 flex items-center justify-center">
                      <div className="text-center p-6">
                        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-white/20 backdrop-blur-sm mb-4">
                          <Zap className="h-8 w-8 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">
                          Blazing Fast
                        </h3>
                        <p className="text-white/80">
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
          <section className="w-full py-16 md:py-24 bg-monad-500">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl text-white">
                  Ready to Get Started?
                </h2>
                <p className="max-w-[600px] text-white/80 md:text-xl">
                  Join thousands of users already leveraging their NFTs or
                  earning interest on our platform.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 mt-6">
                  <Link href="/borrow">
                    <Button
                      size="lg"
                      className="bg-white text-monad-500 hover:bg-white/90"
                    >
                      Borrow Now <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/lend">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-white text-white hover:bg-white/10"
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
          <div className="container px-4 py-12 md:px-6">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Image
                    // src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/monad%20lendhub%20bradning%203-vi0PeD6DQ9eLlQGKTnxMeFTs9DSPOj.png"
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
                <h4 className="text-sm font-semibold mb-4">Platform</h4>
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
                <h4 className="text-sm font-semibold mb-4">Resources</h4>
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
                <h4 className="text-sm font-semibold mb-4">Legal</h4>
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

            <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 md:flex-row">
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
