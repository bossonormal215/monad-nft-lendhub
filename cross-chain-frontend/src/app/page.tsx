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
'use client'

import { ConnectWallet } from "@thirdweb-dev/react";
// import { transferFromSepoliaToMonad } from "../utils/wormhole";
import { useState } from "react";

export default function Home() {

  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);


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
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#8B5CF6] to-[#6366F1]">
            Monad DeFi Hub
          </h1>
          <p className="mt-2 text-[#98A1C0]">Swap and Bridge Assets Seamlessly</p>
        </div>

        {/* Login Section */}
        <ConnectWallet />

        {/* Main Content Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Swap Section */}
          
        </div>
      </div>
    </main>
  );
}
