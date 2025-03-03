'use client'

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useContracts } from '@/thirdweb/thirdwebConfig';

interface BorrowFormProps {
    collateralId: number | null;
    maxLoanAmount: string;
    onBorrow: (collateralId: number, amount: string) => Promise<void>;
    isLoading: boolean;
}

export function BorrowForm({ collateralId, maxLoanAmount, onBorrow, isLoading }: BorrowFormProps) {
    const [amount, setAmount] = useState<string>('');
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

        return true;
    };

    const handleSubmit = async () => {
        if (!loanManager || !collateralId || !amount) {
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
                [collateralId, parsedAmount]
            );

            console.log("Borrow transaction completed:", tx);
            setStatus(`Successfully borrowed ${amount} USDT! ��`);
            setAmount('');
            setError('');

            // Call onBorrow after successful transaction
            await onBorrow(collateralId, amount);
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
                                !amount ? 'Enter Loan Amount' :
                                    'Borrow USDT'}
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


// //////////////////////////////////////////
// import { useState, useEffect } from "react";
// import { ethers } from "ethers";
// import { LoanManagerABI } from "@/contracts/interfaces/LoanManager";
// import { usePrivy } from "@privy-io/react-auth";

// interface BorrowFormProps {
//     collateralId: number | null;
//     maxLoanAmount: string;
//     onBorrow: (collateralId: number, amount: string) => Promise<void>;
//     isLoading: boolean;
// }

// export function BorrowForm({
//     collateralId,
//     maxLoanAmount,
//     onBorrow,
//     isLoading,
// }: BorrowFormProps) {
//     const { user, authenticated, login } = usePrivy();
//     const [amount, setAmount] = useState<string>("");
//     const [error, setError] = useState<string>("");
//     const [status, setStatus] = useState<string>("");
//     const [isProcessing, setIsProcessing] = useState(false);

//     const LOAN_MANAGER_CONTRACT = "0x3ffED1D0912FFF6b6f237B9797409F39bc2268Ba"; // Replace with actual contract address
//     const provider = new ethers.providers.JsonRpcProvider("https://testnet-rpc.monad.xyz"); // Monad testnet RPC

//     useEffect(() => {
//         setAmount("");
//         setError("");
//         setStatus("");
//     }, [collateralId]);

//     useEffect(() => {
//         if (error || status) {
//             const timer = setTimeout(() => {
//                 setError("");
//                 setStatus("");
//             }, 5000);
//             return () => clearTimeout(timer);
//         }
//     }, [error, status]);

//     const validateAmount = (value: string): boolean => {
//         if (!value || isNaN(Number(value))) {
//             setError("Please enter a valid amount");
//             return false;
//         }

//         // const numAmount = ethers.utils.parseEther(value);
//         // const maxAmount = ethers.utils.parseEther(maxLoanAmount);

//         const numAmount = ethers.utils.parseEther(value);
//         const maxAmount = ethers.utils.parseEther(maxLoanAmount);

//         if (numAmount.lte(0)) {

//         // if (numAmount <= 0) {
//             setError("Amount must be greater than 0");
//             return false;
//         }

//         if (numAmount > maxAmount) {
//             setError(`Amount cannot exceed ${maxLoanAmount} USDT`);
//             return false;
//         }

//         return true;
//     };

//     const handleSubmit = async () => {
//         if (!collateralId || !amount) {
//             setError("Please enter a valid amount");
//             return;
//         }

//         if (!authenticated) {
//             setError("Please connect your wallet via Privy");
//             return login();
//         }

//         if (!validateAmount(amount)) return;

//         setIsProcessing(true);
//         setError("");
//         setStatus("Processing your loan...");

//         try {
//             if (!user || !user.wallet) throw new Error("Wallet not found");

//             // const signer = await user.wallet.getEthersSigner();
//             const signer =  await provider.getSigner(user.wallet?.address);
//             if (!signer) throw new Error("Signer not available");

//             const loanManager = new ethers.Contract(
//                 LOAN_MANAGER_CONTRACT,
//                 LoanManagerABI.abi,
//                 signer
//             );

//             // Check if loan already exists
//             const loan = await loanManager.loans(collateralId);
//             if (loan && loan.isActive) {
//                 setError("A loan already exists for this collateral");
//                 return;
//             }

//             const parsedAmount = ethers.utils.parseEther(amount);
//             console.log("Proceeding with borrow:", {
//                 collateralId,
//                 amount,
//                 parsedAmount: parsedAmount.toString(),
//                 maxLoanAmount,
//             });

//             const tx = await loanManager.issueLoan(collateralId, parsedAmount);
//             await tx.wait();

//             console.log("Borrow transaction completed:", tx);

//             await onBorrow(collateralId, amount);
//             setStatus(`Successfully borrowed ${amount} USDT! 🎉`);
//             setAmount("");
//             setError("");
//         } catch (error: any) {
//             console.error("Borrow failed:", error);
//             if (error.message.includes("exceeds max loan amount")) {
//                 setError(`Amount exceeds maximum loan amount of ${maxLoanAmount} USDT`);
//             } else if (error.message.includes("Loan already exists")) {
//                 setError("This NFT already has an active loan");
//             } else if (error.message.includes("insufficient liquidity")) {
//                 setError("Insufficient liquidity in the pool");
//             } else if (error.message.includes("Collateral not active")) {
//                 setError("Selected Collateral is not active");
//             } else {
//                 console.log(error.message || "Failed to borrow");
//             }
//             setStatus("");
//         } finally {
//             setIsProcessing(false);
//         }
//     };

//     return (
//         <div className="space-y-4">
//             {!collateralId ? (
//                 <p className="text-sm text-gray-400">
//                     Deposit an NFT to enable borrowing
//                 </p>
//             ) : (
//                 <>
//                     <div>
//                         <label className="block text-sm font-medium text-gray-300 mb-2">
//                             Borrow Amount (Max: {maxLoanAmount} USDT)
//                         </label>
//                         <input
//                             type="number"
//                             value={amount}
//                             onChange={(e) => {
//                                 setAmount(e.target.value);
//                                 setError("");
//                                 setStatus("");
//                             }}
//                             step="0.1"
//                             min="0"
//                             max={maxLoanAmount}
//                             className="w-full px-3 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
//                             placeholder={`Enter amount (max ${maxLoanAmount} USDT)`}
//                             disabled={isProcessing || isLoading}
//                         />
//                     </div>

//                     <button
//                         onClick={handleSubmit}
//                         disabled={isProcessing || isLoading || !!error || !amount}
//                         className={`w-full py-3 px-6 rounded-lg text-lg font-medium ${isProcessing || isLoading || !!error || !amount
//                                 ? "bg-gray-600 cursor-not-allowed"
//                                 : "bg-green-500 hover:bg-green-600"
//                             } text-white transition-colors`}
//                     >
//                         {isProcessing
//                             ? "Processing..."
//                             : isLoading
//                                 ? "Please wait..."
//                                 : !amount
//                                     ? "Enter Loan Amount"
//                                     : "Borrow USDT"}
//                     </button>

//                     {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
//                     {status && !error && (
//                         <p className="mt-2 text-sm text-green-500">{status}</p>
//                     )}
//                 </>
//             )}
//         </div>
//     );
// }
