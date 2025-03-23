// "use client";

// import { useState } from "react";
// import { formatUnits } from "viem";
// import { LoanManager } from "./LoanManager3";
// import { BorrowForm } from "./BorrowForm3";
// import { ChevronDownIcon } from "@heroicons/react/24/outline";
// import { Wallet, Box, DollarSign } from "lucide-react";

// interface Collateral {
//   id: number;
//   nftAddress: string;
//   tokenId: string;
//   maxLoanAmount: string;
//   currentLoanAmount: string;
//   isActive: boolean;
//   tokenSymbol: string; // Added for multi-token support
// }

// interface CollateralListProps {
//   collaterals: Collateral[];
//   onNFTWithdrawn: (collateralId: number) => Promise<void>;
//   onBorrow: (collateralId: number, amount: string, durationInSeconds: number) => Promise<void>;
//   onSelect: (collateral: Collateral) => void;
// }

// export function CollateralList({
//   collaterals,
//   onNFTWithdrawn,
//   onBorrow,
//   onSelect,
// }: CollateralListProps) {
//   const [selectedCollateral, setSelectedCollateral] = useState<number | null>(null);
//   const [activeTab, setActiveTab] = useState<"active" | "inactive">("active");
//   const [isDropdownOpen, setIsDropdownOpen] = useState(true);

//   const activeCollaterals = collaterals.filter((c) => c.isActive);
//   const inactiveCollaterals = collaterals.filter((c) => !c.isActive);

//   const formatAmount = (amount: string) => {
//     try {
//       return formatUnits(BigInt(amount), 18);
//     } catch (error) {
//       console.error("Error formatting amount:", error);
//       return "0";
//     }
//   };

//   const toggleCollateral = (e: React.MouseEvent, id: number) => {
//     e.stopPropagation();
//     setSelectedCollateral(selectedCollateral === id ? null : id);
//   };

//   const gradientColors = [
//     "from-purple-500/20 via-blue-500/20 to-cyan-500/20",
//     "from-rose-500/20 via-pink-500/20 to-purple-500/20",
//     "from-amber-500/20 via-orange-500/20 to-red-500/20",
//     "from-emerald-500/20 via-teal-500/20 to-cyan-500/20",
//     "from-blue-500/20 via-indigo-500/20 to-violet-500/20",
//   ];

//   const renderCollateralCard = (
//     collateral: Collateral,
//     index: number,
//     isActive: boolean
//   ) => (
//     <div
//       key={collateral.id}
//       className={`relative overflow-hidden bg-gradient-to-br from-[#1C2839] to-[#131A2A] p-6 rounded-[20px] transition-all duration-500 hover:scale-[1.02] hover:shadow-xl ${
//         selectedCollateral === collateral.id
//           ? "ring-2 ring-[#4C82FB] shadow-lg shadow-[#4C82FB]/10"
//           : "hover:ring-2 hover:ring-[#4C82FB]/50 hover:shadow-[#4C82FB]/5"
//       }`}
//     >
//       <div
//         className={`absolute inset-0 bg-gradient-to-br ${
//           gradientColors[index % gradientColors.length]
//         } opacity-30 rounded-[20px]`}
//       />
//       <div className="relative z-10">
//         <div className="flex justify-between items-center mb-6">
//           <div className="flex items-center gap-3">
//             <div className="p-2.5 rounded-full bg-[#2C3545]">
//               <Wallet className="w-5 h-5 text-[#4C82FB]" />
//             </div>
//             <div>
//               <h3 className="text-[#F5F6FC] font-semibold text-lg">
//                 Collateral #{collateral.id}
//               </h3>
//               <div className="flex items-center gap-2 mt-1">
//                 <p className="text-[#98A1C0] text-sm">Click to view details</p>
//                 <button
//                   onClick={(e) => toggleCollateral(e, collateral.id)}
//                   className="p-1 rounded-full hover:bg-[#2C3545] transition-all duration-300"
//                 >
//                   <ChevronDownIcon
//                     className={`w-4 h-4 text-[#98A1C0] transition-transform duration-300 ${
//                       selectedCollateral === collateral.id ? "rotate-180" : ""
//                     }`}
//                   />
//                 </button>
//               </div>
//             </div>
//           </div>
//           <div className="flex flex-col items-end gap-2">
//             <span className="px-3 py-1.5 bg-[#2C3545] text-[#98A1C0] text-sm rounded-full flex items-center gap-1.5">
//               <span className="w-2 h-2 rounded-full bg-[#4C82FB]"></span>
//               NFT #{collateral.tokenId}
//             </span>
//           </div>
//         </div>

//         <div className="bg-[#131A2A]/80 rounded-xl p-4 border border-[#2C3545]">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-2">
//               <DollarSign className="w-4 h-4 text-[#4C82FB]" />
//               <span className="text-[#98A1C0]">Max Loan:</span>
//             </div>
//             <span className="text-white font-semibold text-lg">
//               {formatAmount(collateral.maxLoanAmount)} {collateral.tokenSymbol}
//             </span>
//           </div>
//         </div>

//         {selectedCollateral === collateral.id && (
//           <div
//             className="mt-6 pt-6 border-t border-[#2C3545] animate-fadeIn"
//             onClick={(e) => e.stopPropagation()}
//           >
//             {isActive ? (
//               <>
//                 <BorrowForm
//                   collateralId={collateral.id}
//                   maxLoanAmount={formatAmount(collateral.maxLoanAmount)}
//                   tokenSymbol={collateral.tokenSymbol}
//                   isLoading={false}
//                   onBorrow={onBorrow}
//                 />
//                 <div className="mt-4">
//                   <LoanManager
//                     collateralId={collateral.id}
//                     maxLoanAmount={formatAmount(collateral.maxLoanAmount)}
//                     tokenSymbol={collateral.tokenSymbol}
//                     onNFTWithdrawn={onNFTWithdrawn}
//                   />
//                 </div>
//               </>
//             ) : (
//               <div className="text-center text-[#98A1C0] py-4">
//                 This collateral is currently inactive
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );

//   return (
//     <div className="bg-[#131A2A] rounded-[20px] p-6">
//       <div className="flex space-x-4 mb-6 p-1 bg-[#1C2839] rounded-xl">
//         <button
//           onClick={() => setActiveTab("active")}
//           className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
//             activeTab === "active"
//               ? "bg-gradient-to-r from-[#4C82FB] to-[#6366F1] text-white shadow-lg shadow-blue-500/20"
//               : "text-[#98A1C0] hover:text-white hover:bg-[#2C3545]/50"
//           }`}
//         >
//           <span className="flex items-center justify-center gap-2">
//             <Box className="w-4 h-4" />
//             Active Collaterals ({activeCollaterals.length})
//           </span>
//         </button>
//         <button
//           onClick={() => setActiveTab("inactive")}
//           className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
//             activeTab === "inactive"
//               ? "bg-gradient-to-r from-[#4C82FB] to-[#6366F1] text-white shadow-lg shadow-blue-500/20"
//               : "text-[#98A1C0] hover:text-white hover:bg-[#2C3545]/50"
//           }`}
//         >
//           <span className="flex items-center justify-center gap-2">
//             <Box className="w-4 h-4" />
//             Inactive Collaterals ({inactiveCollaterals.length})
//           </span>
//         </button>
//       </div>

//       <div className="space-y-4">
//         {(activeTab === "active" ? activeCollaterals : inactiveCollaterals).map(
//           (collateral, index) =>
//             renderCollateralCard(collateral, index, activeTab === "active")
//         )}
//       </div>
//     </div>
//   );
// }


/////////////////////////////////--------------------------------------///////////////////////////////

// CollateralList3.tsx
"use client"

import { useState } from "react";
import { formatUnits } from "viem";
import { BorrowForm } from "./BorrowForm3";
import { LoanManager } from "./LoanManager3";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { Wallet, Box, DollarSign } from "lucide-react";
import { SupportedToken } from "./config/tokens";

interface Collateral {
  id: number;
  nftAddress: string;
  tokenId: string;
  maxLoanAmount: string;
  currentLoanAmount: string;
  isActive: boolean;
  tokenSymbol: SupportedToken;
}

interface CollateralListProps {
  collaterals: Collateral[];
  onNFTWithdrawn: (collateralId: number) => Promise<void>;
  onBorrow: (collateralId: number, amount: string, durationInSeconds: number) => Promise<void>;
  onSelect: (collateral: Collateral) => void;
}

export function CollateralList({ collaterals, onNFTWithdrawn, onBorrow, onSelect }: CollateralListProps) {
  const [selectedCollateral, setSelectedCollateral] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"active" | "inactive">("active");
  const [isDropdownOpen, setIsDropdownOpen] = useState(true);

  const activeCollaterals = collaterals.filter((c) => c.isActive);
  const inactiveCollaterals = collaterals.filter((c) => !c.isActive);

  const formatAmount = (amount: string) => {
    try {
      return formatUnits(BigInt(amount), 18);
    } catch (err) {
      console.error("Error formatting amount", err);
      return "0";
    }
  };

  const toggleCollateral = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setSelectedCollateral(selectedCollateral === id ? null : id);
  };

  const gradientColors = [
    "from-purple-500/20 via-blue-500/20 to-cyan-500/20",
    "from-rose-500/20 via-pink-500/20 to-purple-500/20",
    "from-amber-500/20 via-orange-500/20 to-red-500/20",
    "from-emerald-500/20 via-teal-500/20 to-cyan-500/20",
    "from-blue-500/20 via-indigo-500/20 to-violet-500/20",
  ];

  const renderCollateralCard = (collateral: Collateral, index: number, isActive: boolean) => (
    <div
      key={collateral.id}
      className={`relative overflow-hidden bg-gradient-to-br from-[#1C2839] to-[#131A2A] p-6 rounded-[20px] transition-all duration-500 hover:scale-[1.02] hover:shadow-xl ${
        selectedCollateral === collateral.id
          ? "ring-2 ring-[#4C82FB] shadow-lg shadow-[#4C82FB]/10"
          : "hover:ring-2 hover:ring-[#4C82FB]/50 hover:shadow-[#4C82FB]/5"
      }`}
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradientColors[index % gradientColors.length]} opacity-30 rounded-[20px]`}
      />

      <div className="relative z-10">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-full bg-[#2C3545]">
              <Wallet className="w-5 h-5 text-[#4C82FB]" />
            </div>
            <div>
              <h3 className="text-[#F5F6FC] font-semibold text-lg">Collateral #{collateral.id}</h3>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-[#98A1C0] text-sm">Click to view details</p>
                <button
                  onClick={(e) => toggleCollateral(e, collateral.id)}
                  className="p-1 rounded-full hover:bg-[#2C3545] transition-all duration-300"
                >
                  <ChevronDownIcon
                    className={`w-4 h-4 text-[#98A1C0] transition-transform duration-300 ${
                      selectedCollateral === collateral.id ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="px-3 py-1.5 bg-[#2C3545] text-[#98A1C0] text-sm rounded-full flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#4C82FB]"></span>
              NFT #{collateral.tokenId}
            </span>
          </div>
        </div>

        <div className="bg-[#131A2A]/80 rounded-xl p-4 border border-[#2C3545]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-[#4C82FB]" />
              <span className="text-[#98A1C0]">Max Loan:</span>
            </div>
            <span className="text-white font-semibold text-lg">
              {formatAmount(collateral.maxLoanAmount)} {collateral.tokenSymbol}
            </span>
          </div>
        </div>

        {selectedCollateral === collateral.id && (
          <div className="mt-6 pt-6 border-t border-[#2C3545] animate-fadeIn" onClick={(e) => e.stopPropagation()}>
            {isActive ? (
              <>
                <BorrowForm
                  collateralId={collateral.id}
                  maxLoanAmount={formatAmount(collateral.maxLoanAmount)}
                  tokenSymbol={collateral.tokenSymbol}
                  onBorrow={onBorrow}
                />
                <div className="mt-4">
                  <LoanManager
                    collateralId={collateral.id}
                    tokenSymbol={collateral.tokenSymbol}
                    onNFTWithdrawn={onNFTWithdrawn}
                    maxLoanAmount={formatAmount(collateral.maxLoanAmount)}
                  />
                </div>
              </>
            ) : (
              <div className="text-center text-[#98A1C0] py-4">This collateral is currently inactive</div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-[#131A2A] rounded-[20px] p-6">
      {/* Tabs */}
      <div className="flex space-x-4 mb-6 p-1 bg-[#1C2839] rounded-xl">
        <button
          onClick={() => setActiveTab("active")}
          className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
            activeTab === "active"
              ? "bg-gradient-to-r from-[#4C82FB] to-[#6366F1] text-white shadow-lg shadow-blue-500/20"
              : "text-[#98A1C0] hover:text-white hover:bg-[#2C3545]/50"
          }`}
        >
          <span className="flex items-center justify-center gap-2">
            <Box className="w-4 h-4" />
            Active Collaterals ({activeCollaterals.length})
          </span>
        </button>
        <button
          onClick={() => setActiveTab("inactive")}
          className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
            activeTab === "inactive"
              ? "bg-gradient-to-r from-[#4C82FB] to-[#6366F1] text-white shadow-lg shadow-blue-500/20"
              : "text-[#98A1C0] hover:text-white hover:bg-[#2C3545]/50"
          }`}
        >
          <span className="flex items-center justify-center gap-2">
            <Box className="w-4 h-4" />
            Inactive Collaterals ({inactiveCollaterals.length})
          </span>
        </button>
      </div>

      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-[#1C2839] rounded-lg text-[#F5F6FC] hover:bg-[#2C3545] transition-all duration-300 mb-4 border border-[#2C3545] hover:border-[#4C82FB]/50 group"
      >
        <div className="flex items-center gap-2">
          <Box className="w-4 h-4 text-[#4C82FB] group-hover:text-[#6366F1] transition-colors" />
          <span className="text-sm font-medium">
            {activeTab === "active" ? "Active Collaterals" : "Inactive Collaterals"}
          </span>
        </div>
        <div className={`transform transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`}>
          <ChevronDownIcon className="w-4 h-4 text-[#98A1C0]" />
        </div>
      </button>

      {isDropdownOpen && (
        <div className="space-y-4">
          {(activeTab === "active" ? activeCollaterals : inactiveCollaterals).map((collateral, index) =>
            renderCollateralCard(collateral, index, activeTab === "active")
          )}
        </div>
      )}
    </div>
  );
}
