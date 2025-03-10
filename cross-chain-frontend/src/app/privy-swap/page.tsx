import { SwapInterface } from "@/Components/privy/swap-interface"
import { AuthWrapper } from "@/Components/privy/auth-wrapper"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-24">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8">0x Swap on Monad Testnet</h1>
        <AuthWrapper>
          <SwapInterface />
        </AuthWrapper>
      </div>
    </main>
  )
}
