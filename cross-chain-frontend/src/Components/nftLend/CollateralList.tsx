"use client"

import type React from "react"

import { useState } from "react"
import { ethers } from "ethers"
import { LoanManager } from "./LoanManager"
import { BorrowForm } from "./BorrowForm"
import { ChevronDownIcon } from "@heroicons/react/24/outline"
import { Wallet, Box, DollarSign } from "lucide-react"

interface Collateral {
  id: number
  nftAddress: string
  tokenId: string
  maxLoanAmount: string
  currentLoanAmount: string
  isActive: boolean
}

interface CollateralListProps {
  collaterals: Collateral[]
  onNFTWithdrawn: (collateralId: number) => Promise<void>
  onBorrow: (collateralId: number, amount: string) => Promise<void>
  onSelect: (collateral: Collateral) => void
}

export function CollateralList({ collaterals, onNFTWithdrawn, onBorrow, onSelect }: CollateralListProps) {
  const [selectedCollateral, setSelectedCollateral] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState<"active" | "inactive">("active")
  const [isDropdownOpen, setIsDropdownOpen] = useState(true)

  const activeCollaterals = collaterals.filter((c) => c.isActive)
  const inactiveCollaterals = collaterals.filter((c) => !c.isActive)

  const formatAmount = (amount: string) => {
    try {
      return ethers.utils.formatEther(amount)
    } catch (error) {
      console.error("Error formatting amount:", error)
      return "0"
    }
  }

  const toggleCollateral = (e: React.MouseEvent, id: number) => {
    e.stopPropagation() // Prevent event from bubbling up
    setSelectedCollateral(selectedCollateral === id ? null : id)
  }

  const gradientColors = [
    "from-purple-500/20 via-blue-500/20 to-cyan-500/20",
    "from-rose-500/20 via-pink-500/20 to-purple-500/20",
    "from-amber-500/20 via-orange-500/20 to-red-500/20",
    "from-emerald-500/20 via-teal-500/20 to-cyan-500/20",
    "from-blue-500/20 via-indigo-500/20 to-violet-500/20",
  ]

  const renderCollateralCard = (collateral: Collateral, index: number, isActive: boolean) => (
                            <div
                                key={collateral.id}
      className={`relative overflow-hidden bg-gradient-to-br from-[#1C2839] to-[#131A2A] p-6 rounded-[20px] transition-all duration-500 hover:scale-[1.02] hover:shadow-xl ${
        selectedCollateral === collateral.id
          ? "ring-2 ring-[#4C82FB] shadow-lg shadow-[#4C82FB]/10"
          : "hover:ring-2 hover:ring-[#4C82FB]/50 hover:shadow-[#4C82FB]/5"
      }`}
    >
      {/* Gradient Border */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradientColors[index % gradientColors.length]} opacity-30 rounded-[20px]`}
      />

      {/* Content Container */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-full bg-[#2C3545] group-hover:bg-[#4C82FB]/20">
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

        {/* Loan Amount Box */}
        <div className="bg-[#131A2A]/80 rounded-xl p-4 border border-[#2C3545]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-[#4C82FB]" />
              <span className="text-[#98A1C0]">Max Loan:</span>
            </div>
            <span className="text-white font-semibold text-lg">{formatAmount(collateral.maxLoanAmount)} USDT</span>
                                </div>
                            </div>

        {/* Expanded Content */}
        {selectedCollateral === collateral.id && (
          <div className="mt-6 pt-6 border-t border-[#2C3545] animate-fadeIn" onClick={(e) => e.stopPropagation()}>
            {isActive ? (
              <>
                <BorrowForm
                  collateralId={collateral.id}
                  maxLoanAmount={formatAmount(collateral.maxLoanAmount)}
                  isLoading={false}
                  onBorrow={onBorrow}
                />
                <div className="mt-4">
                  <LoanManager
                    collateralId={collateral.id}
                    maxLoanAmount={formatAmount(collateral.maxLoanAmount)}
                    onNFTWithdrawn={onNFTWithdrawn}
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
  )

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

      {/* Dropdown Toggle */}
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-[#1C2839] rounded-lg text-[#F5F6FC] hover:bg-[#2C3545] transition-all duration-300 mb-4 border border-[#2C3545] hover:border-[#4C82FB]/50 group"
      >
        <div className="flex items-center gap-2">
          <Box className="w-4 h-4 text-[#4C82FB] group-hover:text-[#6366F1] transition-colors" />
          <span className="text-sm font-medium">
            {activeTab === "active" ? "Active Collaterals" : "InActive Collaterals"}
                                    </span>
                                </div>
        <div className={`transform transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`}>
          <ChevronDownIcon className="w-4 h-4 text-[#98A1C0]" />
                                </div>
      </button>

      {/* Collateral Lists */}
      {isDropdownOpen && (
        <div className="space-y-4">
          {activeTab === "active" ? (
            activeCollaterals.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activeCollaterals.map((collateral, index) => renderCollateralCard(collateral, index, true))}
                            </div>
            ) : (
              <div className="text-center text-[#98A1C0] py-12 bg-[#1C2839]/50 rounded-xl border border-[#2C3545]">
                <Box className="w-12 h-12 mx-auto mb-4 text-[#4C82FB]/50" />
                <p className="text-lg font-medium">No active collaterals found</p>
                <p className="text-sm text-[#98A1C0]">Add a collateral to get started</p>
                    </div>
            )
          ) : inactiveCollaterals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {inactiveCollaterals.map((collateral, index) => renderCollateralCard(collateral, index, false))}
                </div>
          ) : (
            <div className="text-center text-[#98A1C0] py-12 bg-[#1C2839]/50 rounded-xl border border-[#2C3545]">
              <Box className="w-12 h-12 mx-auto mb-4 text-[#4C82FB]/50" />
              <p className="text-lg font-medium">No inactive collaterals found</p>
              <p className="text-sm text-[#98A1C0]">Add a collateral to get started</p>
                </div>
            )}
        </div>
      )}
    </div>
  )
}








//////////////////////////////////////////////////////////////////////////////////////
// 'use client'

// import { useState } from 'react';
// import { ethers } from 'ethers';
// // import { LoanDetails } from './LoanDetails';
// import { LoanManager } from './LoanManager';
// import { BorrowForm } from './BorrowForm';
// import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

// interface Collateral {
//     id: number;
//     nftAddress: string;
//     tokenId: string;
//     maxLoanAmount: string;
//     currentLoanAmount: string;
//     isActive: boolean;
//     // collection: string;
// }

// interface CollateralListProps {
//     collaterals: Collateral[];
//     onNFTWithdrawn: (collateralId: number) => Promise<void>;
//     onBorrow: (collateralId: number, amount: string) => Promise<void>;
//     // selectedId: number | null;
//     onSelect: (collateral: Collateral) => void;
//     // activeLoan: any; // Add this prop
//     // onRepay: () => Promise<void>;
//     // onLiquidate: () => Promise<void>;
//     // isLoading: boolean;
// }

// export function CollateralList({
//     collaterals,
//     onNFTWithdrawn,
//     onBorrow,
//     // selectedId,
//     onSelect,
//     // activeLoan,
//     // onRepay,
//     // onLiquidate,
//     // isLoading
// }: CollateralListProps) {
//     const [selectedCollateral, setSelectedCollateral] = useState<number | null>(null);
//     const [activeTab, setActiveTab] = useState<'active' | 'inactive'>('active');
//     const [isDropdownOpen, setIsDropdownOpen] = useState(true);

//     // Separate active and inactive collaterals
//     const activeCollaterals = collaterals.filter(c => c.isActive);
//     const inactiveCollaterals = collaterals.filter(c => !c.isActive);

//     // Helper function to format BigNumber to string
//     const formatAmount = (amount: string) => {
//         try {
//             return ethers.utils.formatEther(amount);
//         } catch (error) {
//             console.error('Error formatting amount:', error);
//             return '0';
//         }
//     };

//     return (
//         <div className="bg-[#131A2A] rounded-[20px] p-6">
//             {/* Tabs */}
//             <div className="flex space-x-4 mb-6">
//                 <button
//                     onClick={() => setActiveTab('active')}
//                     className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'active'
//                         ? 'bg-[#2C3545] text-white'
//                         : 'text-[#98A1C0] hover:text-white'
//                         }`}
//                 >
//                     Active Collaterals ({activeCollaterals.length})
//                 </button>
//                 <button
//                     onClick={() => setActiveTab('inactive')}
//                     className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'inactive'
//                         ? 'bg-[#2C3545] text-white'
//                         : 'text-[#98A1C0] hover:text-white'
//                         }`}
//                 >
//                     InActive Collaterals ({inactiveCollaterals.length})
//                 </button>
//             </div>

//             {/* Dropdown Toggle */}
//             <button
//                 onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//                 className="w-full flex items-center justify-between px-3 py-1.5 bg-[#1C2839] 
//                          rounded-lg text-[#F5F6FC] hover:bg-[#2C3545] transition-colors mb-4"
//             >
//                 <span className="text-sm font-medium">
//                     {activeTab === 'active' ? 'Active Collaterals' : 'InActive Collaterals'}
//                 </span>
//                 <span className="flex items-center justify-center w-4 h-4">
//                     {isDropdownOpen ? (
//                         <ChevronUpIcon className="w-2.5 h-2.5 text-[#98A1C0]" />
//                     ) : (
//                         <ChevronDownIcon className="w-2.5 h-2.5 text-[#98A1C0]" />
//                     )}
//                 </span>
//             </button>

//             {/* Collateral Lists */}
//             {isDropdownOpen && (
//                 <div className="space-y-4">
//                     {activeTab === 'active' ? (
//                         // Active Loans
//                         activeCollaterals.length > 0 ? (
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         {activeCollaterals.map((collateral) => (
//                             <div
//                                 key={collateral.id}
//                                         className={`bg-[#1C2839] p-6 rounded-[20px] border-2 ${selectedCollateral === collateral.id
//                                             ? 'border-[#4C82FB]'
//                                             : 'border-transparent'
//                                             } hover:border-[#4C82FB] transition-colors cursor-pointer`}
//                                         onClick={() => setSelectedCollateral(collateral.id)}
//                                     >
//                                         <div className="flex justify-between items-center mb-4">
//                                             <span className="text-[#F5F6FC] font-medium">
//                                                 Collateral #{collateral.id}
//                                             </span>
//                                             <span className="px-3 py-1 bg-[#2C3545] text-[#98A1C0] 
//                                                          text-sm rounded-full">
//                                         NFT #{collateral.tokenId}
//                                     </span>
//                                 </div>
//                                         <div className="text-[#98A1C0] text-sm mb-4">
//                                             Max Loan: {formatAmount(collateral.maxLoanAmount)} USDT
//                                 </div>

//                                         {selectedCollateral === collateral.id && (
//                                             <div className="mt-4 pt-4 border-t border-[#2C3545]">
//                                             <BorrowForm
//                                                 collateralId={collateral.id}
//                                                 maxLoanAmount={formatAmount(collateral.maxLoanAmount)}
//                                                 isLoading={false}
//                                                 onBorrow={onBorrow}
//                                             />
//                                             <div className="mt-4">
//                                                 <LoanManager
//                                                     collateralId={collateral.id}
//                                                     maxLoanAmount={formatAmount(collateral.maxLoanAmount)}
//                                                     onNFTWithdrawn={onNFTWithdrawn}
//                                                 />
//                     </div>
//                 </div>
//             )}
//                                     </div>
//                                 ))}
//                             </div>
//                         ) : (
//                             <div className="text-center text-[#98A1C0] py-8">
//                                 No active loans found
//                             </div>
//                         )
//                     ) : (
//                         // Inactive Collaterals
//                         inactiveCollaterals.length > 0 ? (
//                             <div className="space-y-4">
//                         {inactiveCollaterals.map((collateral) => (
//                             <div
//                                 key={collateral.id}
//                                         className={`bg-[#1C2839] p-6 rounded-[20px] border-2 ${selectedCollateral === collateral.id
//                                             ? 'border-[#4C82FB]'
//                                             : 'border-transparent'
//                                             } hover:border-[#4C82FB] transition-colors cursor-pointer`}
//                                         onClick={() => setSelectedCollateral(collateral.id)}
//                                     >
//                                         <div className="flex justify-between items-center mb-4">
//                                             <span className="text-[#F5F6FC] font-medium">
//                                                 Collateral #{collateral.id}
//                                             </span>
//                                             <span className="px-3 py-1 bg-[#2C3545] text-[#98A1C0] 
//                                                          text-sm rounded-full">
//                                         NFT #{collateral.tokenId}
//                                     </span>
//                                 </div>
//                                         <div className="text-[#98A1C0] text-sm mb-4">
//                                             Max Loan: {formatAmount(collateral.maxLoanAmount)} USDT
//                                         </div>

//                                         {selectedCollateral === collateral.id && (
//                                             <div className="mt-4 pt-4 border-t border-[#2C3545]">
//                                                 {/* <BorrowForm
//                                                     collateralId={collateral.id}
//                                                     maxLoanAmount={formatAmount(collateral.maxLoanAmount)}
//                                                     isLoading={false}
//                                                     onBorrow={onBorrow}
//                                                 /> */}
//                                                 <div className="mt-4">
//                                                     {/* <LoanManager
//                                                         collateralId={collateral.id}
//                                                         maxLoanAmount={formatAmount(collateral.maxLoanAmount)}
//                                                         onNFTWithdrawn={onNFTWithdrawn}
//                                                     /> */}
//                                 </div>
//                             </div>
//                         )}
//                 </div>
//             ))}
//     </div>
//                         ) : (
//                             <div className="text-center text-[#98A1C0] py-8">
//                                 No available collaterals found
//                 </div>
//                         )
//             )}
//                 </div>
//             )}
//         </div>
//     );
// } 


//////////////////////////////////////