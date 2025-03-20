"use client"

import Navbar from "@/Components/p2plendhub/Navbar";
// import { AuthWrapper } from "@/Components/privy/auth-wrapper";
import { WagmiProvider } from "wagmi"; 
import PrivyWrapper from "@/Components/PrivyWrapper";
import { wagmiConfig } from "@/utils/wagmi";
// import LoanList from "@/Components/p2plendhub/LoanList";

export default function NFTLendHubPage() {
  return (
    <div className="min-h-screen bg-monadDark text-monadLight">
         <WagmiProvider config={wagmiConfig}>
       <PrivyWrapper>
      <Navbar />
      <div className="p-10">
        <h1 className="text-3xl font-bold text-monadBlue">
          Welcome to NFT LendHub 🚀
        </h1>
        <>
        {/* <LoanList /> */}
        </>
      </div>
      </PrivyWrapper>
      </WagmiProvider>
    </div>
  );
}
