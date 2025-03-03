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
import { ArrowRight } from "lucide-react";
  

export default function Home() {

  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const address = useAddress();
  const [isHovered, setIsHovered] = useState(false);

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
                      <ConnectWallet 
                     className="!bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] !text-white hover:opacity-90 transition-opacity"
                     />
                    </div>
                    
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
                <Link href="./lending" className="inline-block">
                  <button
                    className="relative group overflow-hidden rounded-full px-8 py-4 font-medium text-white shadow-lg transition-all duration-300 ease-out"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    style={{
                      background: "linear-gradient(to right, #8B5CF6, #6366F1)",
                      boxShadow: isHovered
                        ? "0 10px 25px -3px rgba(99, 102, 241, 0.5)"
                        : "0 4px 6px -1px rgba(99, 102, 241, 0.3)",
                    }}
                  >
                    {/* Animated background shine effect */}
                    <span
                      className="absolute top-0 left-0 w-full h-full bg-white opacity-0 group-hover:opacity-20 transform -translate-x-full group-hover:translate-x-full transition-all duration-1000 ease-out"
                      style={{
                        background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
                      }}
                    />
          
                    {/* Button text with icon */}
                    <span className="flex items-center justify-center gap-2 transform group-hover:translate-x-1 transition-transform duration-300">
                      Explore Lending
                      <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
          
                    {/* Subtle border glow */}
                    <span className="absolute inset-0 rounded-full border border-white/20 group-hover:border-white/40 transition-all duration-300" />
                  </button>
                </Link>
              </div>
              )}
      </div>
    </main>
  );
}

