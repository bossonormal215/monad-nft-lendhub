"use client";

import Link from "next/link";
import Image from "next/image";
import { usePrivy } from "@privy-io/react-auth";
import { Button } from "@/Components/privy/ui/button";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/Components/privy/ui/sheet";
import { useAccount } from "wagmi";

export function Header() {
  const { login, authenticated, ready, user, logout } = usePrivy();
  const { isConnected, address } = useAccount();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-monad-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="https://amethyst-conscious-vole-978.mypinata.cloud/ipfs/bafkreid7sltmasp74vubafpketmw3b4kp7wpzy7idinapdqgktq6c3e5aq"
              alt="LendHub Logo"
              width={40}
              height={40}
              className="object-contain"
            />
            <h2 className="text-xl font-bold tracking-tight">LendHub</h2>
          </Link>
        </div>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/home"
            className="text-sm font-medium transition-colors hover:text-monad-500"
          >
            Home
          </Link>
          <Link
            href="/dashboard"
            className="text-sm font-medium transition-colors hover:text-monad-500"
          >
            Dashboard
          </Link>
          <Link
            href="/borrow"
            className="text-sm font-medium transition-colors hover:text-monad-500"
          >
            Borrow
          </Link>
          <Link
            href="/lend"
            className="text-sm font-medium transition-colors hover:text-monad-500"
          >
            Lend
          </Link>
          <Link
            href="/collections"
            className="text-sm font-medium transition-colors hover:text-monad-500"
          >
            Collections
          </Link>

          <Link
            href="/stats"
            className="text-sm font-medium transition-colors hover:text-monad-500"
          >
            Stats
          </Link>

          {/* <Link
            href="/workedstats"
            className="text-sm font-medium transition-colors hover:text-monad-500"
          >
            Worked Stats
          </Link> */}
          {ready && authenticated && address ? (
            <Button
              variant="outline"
              onClick={() => logout()}
              className="border-monad-border hover:bg-monad-500/10 hover:text-monad-500 h-8 text-xs sm:text-sm"
            >
              {/* {user?.wallet?.address
                ? `${user.wallet.address.slice(
                    0,
                    4
                  )}...${user.wallet.address.slice(-4)}`
                : "Disconnect"} */}
              {address
                ? `${address.slice(0, 4)}...${address.slice(-4)}`
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
        </nav>

        {/* Mobile navigation */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-foreground"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left" // Changed side to "left"
              className="bg-background border-monad-border"
            >
              <nav className="flex flex-col gap-4 mt-8">
                <Link
                  href="/home"
                  className="text-sm font-medium transition-colors hover:text-monad-500"
                >
                  Home
                </Link>
                <Link
                  href="/dashboard"
                  className="text-sm font-medium transition-colors hover:text-monad-500"
                >
                  Dashboard
                </Link>
                <Link
                  href="/borrow"
                  className="text-sm font-medium transition-colors hover:text-monad-500"
                >
                  Borrow
                </Link>
                <Link
                  href="/lend"
                  className="text-sm font-medium transition-colors hover:text-monad-500"
                >
                  Lend
                </Link>
                <Link
                  href="/collections"
                  className="text-sm font-medium transition-colors hover:text-monad-500"
                >
                  Collections
                </Link>

                <Link
                  href="/stats"
                  className="text-sm font-medium transition-colors hover:text-monad-500"
                >
                  Stats
                </Link>
                <div className="mt-6">
                  {authenticated ? (
                    <Button
                      variant="outline"
                      onClick={() => logout()}
                      className="w-full border-monad-border hover:bg-monad-500/10 hover:text-monad-500 h-10 text-sm"
                    >
                      {/* {user?.wallet?.address
                        ? `${user.wallet.address.slice(
                            0,
                            4
                          )}...${user.wallet.address.slice(-4)}`
                        : "Disconnect"} */}
                      {address
                        ? `${address.slice(0, 4)}...${address.slice(-4)}`
                        : "Disconnect"}
                    </Button>
                  ) : (
                    <Button
                      onClick={() => login()}
                      className="w-full bg-monad-500 hover:bg-monad-600 text-white h-10 text-sm"
                    >
                      Connect
                    </Button>
                  )}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
