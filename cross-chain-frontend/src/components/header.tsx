"use client"

import Link from "next/link"
import { usePrivy } from "@privy-io/react-auth"
import { Button } from "@/Components/privy/ui/button"
import { Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/Components/privy/ui/sheet"

export function Header() {
  const { login, authenticated, user, logout } = usePrivy()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-monad-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            {/* Show abbreviated logo on mobile, full logo on sm and up */}
            <span className="font-bold text-lg text-monad-500 sm:hidden">MLH</span>
            <span className="hidden font-bold sm:inline-block text-xl text-monad-500">NFT LendHub</span>
          </Link>
        </div>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/home" className="text-sm font-medium transition-colors hover:text-monad-500">
            Home
          </Link>
          <Link href="/dashboard" className="text-sm font-medium transition-colors hover:text-monad-500">
            Dashboard
          </Link>
          <Link href="/borrow" className="text-sm font-medium transition-colors hover:text-monad-500">
            Borrow
          </Link>
          <Link href="/lend" className="text-sm font-medium transition-colors hover:text-monad-500">
            Lend
          </Link>
        </nav>

        {/* Mobile navigation */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-foreground">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-background border-monad-border">
            <nav className="flex flex-col gap-4 mt-8">
              <Link href="/home" className="text-sm font-medium transition-colors hover:text-monad-500">
                Home
              </Link>
              <Link href="/dashboard" className="text-sm font-medium transition-colors hover:text-monad-500">
                Dashboard
              </Link>
              <Link href="/borrow" className="text-sm font-medium transition-colors hover:text-monad-500">
                Borrow
              </Link>
              <Link href="/lend" className="text-sm font-medium transition-colors hover:text-monad-500">
                Lend
              </Link>
            </nav>
          </SheetContent>
        </Sheet>

        <div className="flex items-center gap-2">
          {authenticated ? (
            <Button
              variant="outline"
              onClick={() => logout()}
              className="border-monad-border hover:bg-monad-500/10 hover:text-monad-500 h-8 text-xs sm:text-sm"
            >
              {user?.wallet?.address
                ? `${user.wallet.address.slice(0, 4)}...${user.wallet.address.slice(-4)}`
                : "Disconnect"}
            </Button>
          ) : (
            <Button
              onClick={() => login()}
              className="bg-monad-500 hover:bg-monad-600 text-white h-8 text-xs sm:text-sm"
            >
              Connect
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}

