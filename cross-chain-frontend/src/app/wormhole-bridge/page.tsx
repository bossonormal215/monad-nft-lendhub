// import BridgeContainer from "@/Components/bridge/bridge-container"
import  Web3Wrapper  from "@/Components/Web3Wrapper"

export default function Home() {
  return (
    <Web3Wrapper>
      <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-gray-900 to-black text-white">
        <div className="max-w-md w-full">
          <h1 className="text-3xl font-bold text-center mb-2">Wormhole Bridge</h1>
          <p className="text-gray-400 text-center mb-8">Transfer tokens between Sepolia and Monad Testnet</p>
          {/* <BridgeContainer /> */}
        </div>
      </main>
    </Web3Wrapper>
  )
}

