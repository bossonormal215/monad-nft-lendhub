'use client'

import { ethers } from 'ethers';

interface LoanDetailsProps {
    loan?: {
        amount?: ethers.BigNumber;
        interest?: ethers.BigNumber;
        startTime?: number;
        duration?: number;
    };
    onRepay: () => Promise<void>;
    onLiquidate: () => Promise<void>;
    isLoading: boolean;
}

export function LoanDetails({ loan, onRepay, onLiquidate, isLoading }: LoanDetailsProps) {
    if (!loan?.amount || !loan?.interest) {
        return null;
    }

    const totalAmount = loan.amount.add(loan.interest);
    const endTime = (loan.startTime || 0) + (loan.duration || 0);
    const now = Math.floor(Date.now() / 1000);
    const timeLeft = endTime - now;
    const isOverdue = timeLeft < 0;

    return (
        <div className="bg-[#131A2A] rounded-[20px] p-6">
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium text-[#F5F6FC]">Loan Details</h3>
                    <span className={`px-3 py-1 rounded-full text-sm ${isOverdue ? 'bg-red-500 text-white' : 'bg-[#222C3B] text-[#98A1C0]'
                        }`}>
                        {isOverdue ? 'Overdue' : 'Active'}
                    </span>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-[#98A1C0]">Borrowed Amount</span>
                        <span className="text-[#F5F6FC]">
                            {ethers.utils.formatEther(loan.amount)} USDT
                        </span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-[#98A1C0]">Interest</span>
                        <span className="text-[#F5F6FC]">
                            {ethers.utils.formatEther(loan.interest)} USDT
                        </span>
                    </div>
                    <div className="flex justify-between text-sm font-medium">
                        <span className="text-[#98A1C0]">Total to Repay</span>
                        <span className="text-[#F5F6FC]">
                            {ethers.utils.formatEther(totalAmount)} USDT
                        </span>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={onRepay}
                        disabled={isLoading}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] 
                     rounded-[20px] text-white font-medium hover:opacity-90 
                     disabled:opacity-50 transition-all"
                    >
                        Repay Loan
                    </button>

                    {isOverdue && (
                        <button
                            onClick={onLiquidate}
                            disabled={isLoading}
                            className="px-6 py-3 bg-[#FFC107] text-black font-medium rounded-[20px] 
                       hover:bg-[#FFB300] disabled:opacity-50 transition-colors"
                        >
                            Liquidate
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}




