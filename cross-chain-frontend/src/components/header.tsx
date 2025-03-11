// "use client"

// import Link from "next/link"
// import { usePrivy } from "@privy-io/react-auth"
// import { Button } from "@/Components/privy/ui/button"
// import { MoonIcon, SunIcon } from "lucide-react"
// // import { useTheme } from "next-themes"
// import Image from "next/image"

// export function Header() {
//   const { login, authenticated, user, logout } = usePrivy()
// //   const { theme, setTheme } = useTheme()

//   return (
//     <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
//       <div className="container flex h-16 items-center justify-between">
//         <div className="flex items-center gap-2">
//           <Link href="/" className="flex items-center gap-2">
//             <Image src="/logo.png" alt="NFT LendHub Logo" width={32} height={32} className="rounded-md" />
//             <span className="hidden font-bold sm:inline-block text-xl">NFT LendHub</span>
//           </Link>
//         </div>
//         <nav className="hidden md:flex items-center gap-6">
//           <Link href="/home" className="text-sm font-medium transition-colors hover:text-primary">
//             Home
//           </Link>
//           <Link href="/dashboard" className="text-sm font-medium transition-colors hover:text-primary">
//             Dashboard
//           </Link>
//           <Link href="/borrow" className="text-sm font-medium transition-colors hover:text-primary">
//             Borrow
//           </Link>
//           <Link href="/lend" className="text-sm font-medium transition-colors hover:text-primary">
//             Lend
//           </Link>
//         </nav>
//         <div className="flex items-center gap-2">
//           {/* <Button
//             variant="ghost"
//             size="icon"
//             onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
//             className="mr-2"
//           >
//             {theme === "dark" ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
//             <span className="sr-only">Toggle theme</span>
//           </Button> */}
//           {authenticated ? (
//             <Button variant="outline" onClick={() => logout()} className="hidden sm:flex">
//               {user?.wallet?.address
//                 ? `${user.wallet.address.slice(0, 6)}...${user.wallet.address.slice(-4)}`
//                 : "Disconnect"}
//             </Button>
//           ) : (
//             <Button onClick={() => login()} className="bg-monad-500 hover:bg-monad-600">
//               Connect Wallet
//             </Button>
//           )}
//         </div>
//       </div>
//     </header>
//   )
// }

