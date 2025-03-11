'use client'

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useContracts } from '@/thirdweb/thirdwebConfig';

interface BorrowFormProps {
    collateralId: number | null;
    maxLoanAmount: string;
    onBorrow: (collateralId: number, amount: string, durationInSeconds: number) => Promise<void>;
    isLoading: boolean;
}


// Duration options in seconds
const DURATION_OPTIONS = [
    { label: "5 minutes", value: 5 * 60 },
    { label: "20 minutes", value: 20 * 60 },
    { label: "4 hours", value: 4 * 60 * 60 },
    { label: "12 hours", value: 12 * 60 * 60 },
    { label: "1 day", value: 24 * 60 * 60 },
    { label: "7 days", value: 7 * 24 * 60 * 60 },
    { label: "14 days", value: 14 * 24 * 60 * 60 },
    { label: "30 days", value: 30 * 24 * 60 * 60 },
  ]

export function BorrowForm({ collateralId, maxLoanAmount, onBorrow, isLoading }: BorrowFormProps) {
    const [amount, setAmount] = useState<string>('');
    const [duration, setDuration] = useState<number>(0)
    const [error, setError] = useState<string>('');
    const [status, setStatus] = useState<string>('');
    const [isProcessing, setIsProcessing] = useState(false);
    const { loanManager } = useContracts();

    // Reset states when collateral changes
    useEffect(() => {
        setAmount('');
        setError('');
        setStatus('');
    }, [collateralId]);

    // Clear messages after timeout
    useEffect(() => {
        if (error || status) {
            const timer = setTimeout(() => {
                setError('');
                setStatus('');
            }, 5000); // 20 seconds

            return () => clearTimeout(timer);
        }
    }, [error, status]);

    const validateAmount = (value: string): boolean => {
        if (!value || isNaN(Number(value))) {
            setError('Please enter a valid amount');
            return false;
        }

        const numAmount = ethers.utils.parseEther(value);
        const maxAmount = ethers.utils.parseEther(maxLoanAmount);

        if (numAmount.lte(0)) {
            setError('Amount must be greater than 0');
            return false;
        }

        if (numAmount.gt(maxAmount)) {
            setError(`Amount cannot exceed ${maxLoanAmount} USDT`);
            return false;
        }

        // Validate duration
    if (!duration) {
        setError("Please select a loan duration")
        return false
      }

        return true;
    };

    const handleSubmit = async () => {
        if (!loanManager || !collateralId || !amount || !duration) {
            setError("Please enter a valid amount");
            return;
        }

        if (!validateAmount(amount)) return;

        setIsProcessing(true);
        setError('');
        setStatus('Processing your loan...');

        try {
            // Check if loan exists first
            const loan = await loanManager.call(
                "loans",
                [collateralId]
            );

            if (loan && loan.isActive) {
                setError("A loan already exists for this collateral");
                return;
            }

            const parsedAmount = ethers.utils.parseEther(amount);
            console.log("Proceeding with borrow:", {
                collateralId,
                amount,
                parsedAmount: parsedAmount.toString(),
                maxLoanAmount
            });

            // Issue the loan
            const tx = await loanManager.call(
                "issueLoan",
                [collateralId, parsedAmount, duration]
            );

            console.log("Borrow transaction completed:", tx);
            setStatus(`Successfully borrowed ${amount} USDT! ��`);
            setAmount('');
            setError('');

            // Call onBorrow after successful transaction
            await onBorrow(collateralId, amount, duration);
        } catch (error: any) {
            console.error("Detailed borrow error:", error);

            if (error.message.includes("exceeds max loan amount")) {
                setError(`Amount exceeds maximum loan amount of ${maxLoanAmount} USDT`);
            } else if (error.message.includes("Loan already exists")) {
                setError("This NFT already has an active loan");
            } else if (error.message.includes("insufficient liquidity")) {
                setError("Insufficient liquidity in the pool");
            } else if (error.message.includes('Collateral not active')) {
                setError('Selected Collateral Is Not Active');
            }
            setStatus('');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="space-y-4">
            {!collateralId ? (
                <p className="text-sm text-gray-400">Deposit an NFT to enable borrowing</p>
            ) : (
                <>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Borrow Amount (Max: {maxLoanAmount} USDT)
                        </label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => {
                                setAmount(e.target.value);
                                setError('');
                                setStatus('');
                            }}
                            step="0.1"
                            min="0"
                            max={maxLoanAmount}
                            className="w-full px-3 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
                            placeholder={`Enter amount (max ${maxLoanAmount} USDT)`}
                            disabled={isProcessing || isLoading}
                        />
                    </div>

                    <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Loan Duration</label>
            <select
              value={duration}
              onChange={(e) => {
                setDuration(Number(e.target.value))
                setError("")
                setStatus("")
              }}
              className="w-full px-3 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
              disabled={isProcessing || isLoading}
            >
              <option value={0}>Select loan duration</option>
              {DURATION_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>


                    <button
                        onClick={handleSubmit}
                        disabled={isProcessing || isLoading || !!error || !amount}
                        className={`w-full py-3 px-6 rounded-lg text-lg font-medium ${isProcessing || isLoading || !!error || !amount
                            ? 'bg-gray-600 cursor-not-allowed'
                            : 'bg-green-500 hover:bg-green-600'
                            } text-white transition-colors`}
                    >
                        {isProcessing ? 'Processing...' :
                            isLoading ? 'Please wait...' :
                            !amount ? 'Enter Loan Amount' 
                            : 'Borrow USDT'}
                    </button>

                    {error && (
                        <p className="mt-2 text-sm text-red-500">{error}</p>
                    )}
                    {status && !error && (
                        <p className="mt-2 text-sm text-green-500">{status}</p>
                    )}
                </>
            )}
        </div>
    );
}
