// 'use client'

// import Login from "../Components/Login";
// // import { transferFromSepoliaToMonad } from "../utils/wormhole";
// import { useState } from "react";
// import { usePrivy } from "@privy-io/react-auth";
// import Swap from "@/Components/Swap";

// export default function Home() {

//   const [recipient, setRecipient] = useState("");
//   const [amount, setAmount] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   const { ready, user, authenticated } = usePrivy();

//   const disableTipping = !ready || !user || !authenticated || !recipient || !amount;

//   async function handleTip() {
//     // if (!recipient || !amount) return alert("Enter recipient & amount!");

//     if (!recipient || !amount) return alert("⚠️ Enter recipient & amount!");
//     setIsLoading(true);
//     // await transferFromSepoliaToMonad(recipient, amount);

//     try {
//       // const tx = await transferFromSepoliaToMonad(recipient, amount);
//       const tx = 'txu';
//       if (tx) {
//         alert(`✅ Transaction Sent: ${tx}`);
//         alert(`Sent ${amount} Sepolia ETH to ${recipient} on Monad!`);
//       } else {
//         alert("❌ Transaction Failed");
//       }
//     } catch (error) {
//       console.error(error);
//       alert("❌ Transaction Error");
//     }

//     setIsLoading(false);
//   }


//   return (
//     <main className="min-h-screen bg-[#0D111C] text-gray-100 p-6 md:p-10">
//       <div className="max-w-6xl mx-auto space-y-8">
//         {/* Header */}
//         <div className="text-center mb-12">
//           <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#8B5CF6] to-[#6366F1]">
//             Monad DeFi Hub
//           </h1>
//           <p className="mt-2 text-[#98A1C0]">Swap and Bridge Assets Seamlessly</p>
//         </div>

//         {/* Login Section */}
//         <Login />

//         {/* Main Content Grid */}
//         <div className="grid md:grid-cols-2 gap-8">
//           {/* Swap Section */}
          
//         </div>
//       </div>
//     </main>
//   );
// }


/////////////////////////------------------------------------------//////////////////////////
// 'use client'

// import { ConnectWallet } from "@thirdweb-dev/react";
// // import { transferFromSepoliaToMonad } from "../utils/wormhole";
// import { useState } from "react";

// export default function Home() {

//   const [recipient, setRecipient] = useState("");
//   const [amount, setAmount] = useState("");
//   const [isLoading, setIsLoading] = useState(false);


//   const disableTipping =  !recipient || !amount;

//   async function handleTip() {
//     // if (!recipient || !amount) return alert("Enter recipient & amount!");

//     if (!recipient || !amount) return alert("⚠️ Enter recipient & amount!");
//     setIsLoading(true);
//     // await transferFromSepoliaToMonad(recipient, amount);

//     try {
//       // const tx = await transferFromSepoliaToMonad(recipient, amount);
//       const tx = 'txu';
//       if (tx) {
//         alert(`✅ Transaction Sent: ${tx}`);
//         alert(`Sent ${amount} Sepolia ETH to ${recipient} on Monad!`);
//       } else {
//         alert("❌ Transaction Failed");
//       }
//     } catch (error) {
//       console.error(error);
//       alert("❌ Transaction Error");
//     }

//     setIsLoading(false);
//   }


//   return (
//     <main className="min-h-screen bg-[#0D111C] text-gray-100 p-6 md:p-10">
//       <div className="max-w-6xl mx-auto space-y-8">
//         {/* Header */}
//         <div className="text-center mb-12">
//           <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#8B5CF6] to-[#6366F1]">
//             Monad DeFi Hub
//           </h1>
//           <p className="mt-2 text-[#98A1C0]">Swap and Bridge Assets Seamlessly</p>
//         </div>

//         {/* Login Section */}
//         <ConnectWallet />

//         {/* Main Content Grid */}
//         <div className="grid md:grid-cols-2 gap-8">
//           {/* Swap Section */}
          
//         </div>
//       </div>
//     </main>
//   );
// }


// /////////////////////////------------------------------------------//////////////////////////
'use client'

import { ConnectWallet, useAddress } from "@thirdweb-dev/react";
import { useState } from "react";
import Link from "next/link";

export default function Home() {

  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const address = useAddress()

  const disableTipping =  !recipient || !amount;

  async function handleTip() {
    // if (!recipient || !amount) return alert("Enter recipient & amount!");

    if (!recipient || !amount) return alert("⚠️ Enter recipient & amount!");
    setIsLoading(true);
    // await transferFromSepoliaToMonad(recipient, amount);

    try {
      // const tx = await transferFromSepoliaToMonad(recipient, amount);
      const tx = 'txu';
      if (tx) {
        alert(`✅ Transaction Sent: ${tx}`);
        alert(`Sent ${amount} Sepolia ETH to ${recipient} on Monad!`);
      } else {
        alert("❌ Transaction Failed");
      }
    } catch (error) {
      console.error(error);
      alert("❌ Transaction Error");
    }

    setIsLoading(false);
  }


  return (
    <main className="min-h-screen bg-[#0D111C] text-gray-100 p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
         <header className="sticky top-0 z-50 bg-[#131A2A]/80 backdrop-blur-sm p-4 border-b border-[#1C2839]">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
                  <h1 className="text-2xl sm:text-3xl font-bold">Monad NFT Lending</h1>
                  <ConnectWallet />
                </div>
          </header>
        
        {!address ? (
                // Show connect wallet message when no wallet is connected
                <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
                  <div className="text-center space-y-6 max-w-lg">
                    <h2 className="text-3xl font-bold text-[#F5F6FC]">
                      Welcome to Monad NFT Lending
                    </h2>
                    <p className="text-[#98A1C0] text-lg">
                      Connect your wallet to start borrowing against your NFTs or providing liquidity to the platform.
                    </p>
                    <div className="inline-block">
                      <ConnectWallet />
                    </div>
                    <div className="pt-8 text-sm text-[#98A1C0]">
                      <p>Supported features:</p>
                      <ul className="mt-2 space-y-1">
                        <li>• NFT Collateral Lending</li>
                        <li>• Liquidity Provision</li>
                        <li>• DMON NFT Minting</li>
                      </ul>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex space-x-4">
                  <Link
                  href='./lending'
                  className="bg-blue-600- hover:bg-blue-700 text-white px-8 py-3 rounded-full font-bold transition-all"
                  >
                    Explore Lending
                  </Link> 
                  </div>
              )}
      </div>
    </main>
  );
}

