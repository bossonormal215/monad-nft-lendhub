import { useState } from 'react';
import { ethers } from 'ethers';
// import { LoanDetails } from './LoanDetails';
import { LoanManager } from './LoanManager';
import { BorrowForm } from './BorrowForm';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

interface Collateral {
    id: number;
    nftAddress: string;
    tokenId: string;
    maxLoanAmount: string;
    currentLoanAmount: string;
    isActive: boolean;
    // collection: string;
}

interface CollateralListProps {
    collaterals: Collateral[];
    onNFTWithdrawn: (collateralId: number) => Promise<void>;
    onBorrow: (collateralId: number, amount: string) => Promise<void>;
    // selectedId: number | null;
    onSelect: (collateral: Collateral) => void;
    // activeLoan: any; // Add this prop
    // onRepay: () => Promise<void>;
    // onLiquidate: () => Promise<void>;
    // isLoading: boolean;
}

export function CollateralList({
    collaterals,
    onNFTWithdrawn,
    onBorrow,
    // selectedId,
    onSelect,
    // activeLoan,
    // onRepay,
    // onLiquidate,
    // isLoading
}: CollateralListProps) {
    const [selectedCollateral, setSelectedCollateral] = useState<number | null>(null);
    const [activeTab, setActiveTab] = useState<'active' | 'inactive'>('active');
    const [isDropdownOpen, setIsDropdownOpen] = useState(true);

    // Separate active and inactive collaterals
    const activeCollaterals = collaterals.filter(c => c.isActive);
    const inactiveCollaterals = collaterals.filter(c => !c.isActive);

    // Helper function to format BigNumber to string
    const formatAmount = (amount: string) => {
        try {
            return ethers.utils.formatEther(amount);
        } catch (error) {
            console.error('Error formatting amount:', error);
            return '0';
        }
    };

    return (
        <div className="bg-[#131A2A] rounded-[20px] p-6">
            {/* Tabs */}
            <div className="flex space-x-4 mb-6">
                <button
                    onClick={() => setActiveTab('active')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'active'
                        ? 'bg-[#2C3545] text-white'
                        : 'text-[#98A1C0] hover:text-white'
                        }`}
                >
                    Active Loans ({activeCollaterals.length})
                </button>
                <button
                    onClick={() => setActiveTab('inactive')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'inactive'
                        ? 'bg-[#2C3545] text-white'
                        : 'text-[#98A1C0] hover:text-white'
                        }`}
                >
                    Available Collaterals ({inactiveCollaterals.length})
                </button>
            </div>

            {/* Dropdown Toggle */}
            <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full flex items-center justify-between px-4 py-2 bg-[#1C2839] 
                         rounded-lg text-[#F5F6FC] hover:bg-[#2C3545] transition-colors mb-4"
            >
                <span className="font-medium">
                    {activeTab === 'active' ? 'Active Loans' : 'Available Collaterals'}
                </span>
                {isDropdownOpen ? (
                    <ChevronUpIcon className="w-1 h-1 text-[#98A1C0]" />
                ) : (
                    <ChevronDownIcon className="w-1 h-1 text-[#98A1C0]" />
                )}
            </button>

            {/* Collateral Lists */}
            {isDropdownOpen && (
                <div className="space-y-4">
                    {activeTab === 'active' ? (
                        // Active Loans
                        activeCollaterals.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {activeCollaterals.map((collateral) => (
                                    <div
                                        key={collateral.id}
                                        className={`bg-[#1C2839] p-6 rounded-[20px] border-2 ${selectedCollateral === collateral.id
                                            ? 'border-[#4C82FB]'
                                            : 'border-transparent'
                                            } hover:border-[#4C82FB] transition-colors cursor-pointer`}
                                        onClick={() => setSelectedCollateral(collateral.id)}
                                    >
                                        <div className="flex justify-between items-center mb-4">
                                            <span className="text-[#F5F6FC] font-medium">
                                                Collateral #{collateral.id}
                                            </span>
                                            <span className="px-3 py-1 bg-[#2C3545] text-[#98A1C0] 
                                                         text-sm rounded-full">
                                                NFT #{collateral.tokenId}
                                            </span>
                                        </div>
                                        <div className="text-[#98A1C0] text-sm mb-4">
                                            Max Loan: {formatAmount(collateral.maxLoanAmount)} USDT
                                        </div>

                                        {selectedCollateral === collateral.id && (
                                            <div className="mt-4 pt-4 border-t border-[#2C3545]">
                                                <LoanManager
                                                    collateralId={collateral.id}
                                                    maxLoanAmount={formatAmount(collateral.maxLoanAmount)}
                                                    onNFTWithdrawn={onNFTWithdrawn}
                                                />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center text-[#98A1C0] py-8">
                                No active loans found
                            </div>
                        )
                    ) : (
                        // Inactive Collaterals
                        inactiveCollaterals.length > 0 ? (
                            <div className="space-y-4">
                                {inactiveCollaterals.map((collateral) => (
                                    <div
                                        key={collateral.id}
                                        className={`bg-[#1C2839] p-6 rounded-[20px] border-2 ${selectedCollateral === collateral.id
                                            ? 'border-[#4C82FB]'
                                            : 'border-transparent'
                                            } hover:border-[#4C82FB] transition-colors cursor-pointer`}
                                        onClick={() => setSelectedCollateral(collateral.id)}
                                    >
                                        <div className="flex justify-between items-center mb-4">
                                            <span className="text-[#F5F6FC] font-medium">
                                                Collateral #{collateral.id}
                                            </span>
                                            <span className="px-3 py-1 bg-[#2C3545] text-[#98A1C0] 
                                                         text-sm rounded-full">
                                                NFT #{collateral.tokenId}
                                            </span>
                                        </div>
                                        <div className="text-[#98A1C0] text-sm mb-4">
                                            Max Loan: {formatAmount(collateral.maxLoanAmount)} USDT
                                        </div>

                                        {selectedCollateral === collateral.id && (
                                            <div className="mt-4 pt-4 border-t border-[#2C3545]">
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
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center text-[#98A1C0] py-8">
                                No available collaterals found
                            </div>
                        )
                    )}
                </div>
            )}
        </div>
    );
} 