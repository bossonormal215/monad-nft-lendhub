"use client"

// import { Header } from "@/components/header"
// import { DashboardTab } from "@/components/dashboard-tab"
// import { WagmiConfig } from "@/providers/wagmi-provider";


export default function DashboardPage() {
  return (
    <>
    {/* // <WagmiConfig > */}
    <div className="flex min-h-screen flex-col">
      {/* <Header /> */}
      <main className="flex-1 container py-8">
        {/* <DashboardTab /> */}
        <div>BUILDING</div>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">© 2024 NFT LendHub. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <a href="#" className="text-xs hover:underline underline-offset-4">
            Terms of Service
          </a>
          <a href="#" className="text-xs hover:underline underline-offset-4">
            Privacy
          </a>
        </nav>
      </footer>
    </div>
    {/* </WagmiConfig> */}
    </>
  )
}

