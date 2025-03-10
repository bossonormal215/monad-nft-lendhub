import { Header } from "@/components/header";
import { Button } from "@/Components/privy/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Toaster } from "@/Components/privy/ui/toaster";
import { WagmiConfig } from "@/providers/wagmi-provider";

export default function Home() {
  return (
    <WagmiConfig>
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Unlock the Value of Your NFTs
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    NFT LendHub is a peer-to-peer lending platform that allows
                    you to use your NFTs as collateral for loans or earn
                    interest by lending to others.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/borrow">
                    <Button className="bg-monad-500 hover:bg-monad-600">
                      Borrow Now
                    </Button>
                  </Link>
                  <Link href="/lend">
                    <Button variant="outline">Become a Lender</Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative h-[300px] w-[300px] md:h-[400px] md:w-[400px] lg:h-[500px] lg:w-[500px]">
                  <Image
                    src="/hero-image.png"
                    alt="NFT Lending"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                  How It Works
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl">
                  Our platform makes it easy to get liquidity from your NFTs or
                  earn interest by lending to others.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3 lg:gap-12">
              <div className="flex flex-col items-center space-y-2 border rounded-lg p-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-monad-100">
                  <svg
                    className="h-8 w-8 text-monad-500"
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
                  List your NFT as collateral and specify your loan terms.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border rounded-lg p-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-monad-100">
                  <svg
                    className="h-8 w-8 text-monad-500"
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
                  Lenders browse available NFTs and fund loans they're interested in.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border rounded-lg p-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-monad-100">
                  <svg
                    className="h-8 w-8 text-monad-500"
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
                  Repay your loan to get your NFT back, or default and lose your NFT to the lender.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                  Built on Monad
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl">
                  Leveraging the speed and efficiency of the Monad blockchain for a seamless lending experience.
                </p>
              </div>
              <div className="mx-auto w-full max-w-sm space-y-2">
                <div className="flex justify-center">
                  <Image
                    src="/monad-logo.png"
                    alt="Monad Logo"
                    width={200}
                    height={80}
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">
          © 2024 NFT LendHub. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link
            href="#"
            className="text-xs hover:underline underline-offset-4"
          >
            Terms of Service
          </Link>
          <Link
            href="#"
            className="text-xs hover:underline underline-offset-4"
          >
            Privacy
          </Link>
        </nav>
      </footer>
      </div>
      <Toaster />
      </WagmiConfig>
    
  );
}
