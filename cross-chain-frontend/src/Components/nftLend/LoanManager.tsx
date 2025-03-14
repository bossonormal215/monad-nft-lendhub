'use client'

import { useState, useEffect, useCallback } from 'react';
import { useContract, useAddress } from '@thirdweb-dev/react';
import { ethers } from 'ethers';
import { LOAN_MANAGER_CONTRACT, NFT_VAULT_CONTRACT, USDT_CONTRACT, LIQUIDATION_MANAGER_CONTRACT } from '@/thirdweb/thirdwebConfig';
import { LoanManagerABI } from '@/contracts/interfaces/LoanManager';
import { NFTCollateralVaultABI } from '@/contracts/interfaces/NFTCollateralVault';
import { LiquidationManagerABI } from '@/contracts/interfaces/LiquidationManager';
import { MockUsdtABI } from '@/contracts/interfaces/mocUsdt';
// import { useAddress } from '../privy/hooks/useWallet';

interface LoanManagerProps {
    collateralId: number | null;
    maxLoanAmount?: string;
    onNFTWithdrawn?: (collateralId: number) => Promise<void>;
}

// Add a utility function for formatting large numbers
const formatBigNumber = (value: any, decimals = 18) => {
    try {
        return ethers.utils.formatUnits(value, decimals);
    } catch (error) {
        console.error("Error formatting BigNumber:", error);
        return "0";
    }
};

const parseBigNumber = (value: string, decimals = 18) => {
    try {
        return ethers.utils.parseUnits(value, decimals);
    } catch (error) {
        console.error("Error parsing BigNumber:", error);
        return ethers.BigNumber.from(0);
    }
};

export function LoanManager({
    collateralId,
    maxLoanAmount,
    onNFTWithdrawn
}: LoanManagerProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>('');
    const [status, setStatus] = useState<string>('');
    const [activeLoan, setActiveLoan] = useState<any>(null);
    const address = useAddress();

    // Add auto-dismiss effect
  useEffect(() => {
    if (status || error) {
      const timer = setTimeout(() => {
        setStatus('');
        setError('')
      }, 5000); // 5 seconds

      return () => clearTimeout(timer);
    }
  }, [status]);

    // Move all contract initializations to component level
    const { contract: loanManager } = useContract(
        LOAN_MANAGER_CONTRACT,
        LoanManagerABI.abi
    );
    const { contract: nftVault } = useContract(
        NFT_VAULT_CONTRACT,
        NFTCollateralVaultABI.abi
    );
    const { contract: liquidationManager } = useContract(
        LIQUIDATION_MANAGER_CONTRACT,
        LiquidationManagerABI.abi
    );
    const { contract: usdt } = useContract(
        USDT_CONTRACT,
        MockUsdtABI.abi
    );

    const fetchLoanDetails = useCallback(async () => {
        if (!loanManager || !collateralId || !address) return;

        try {
            console.log("Fetching loan details for collateral:", collateralId);

            // Get loan details
            const loan = await loanManager.call(
                "loans",
                [collateralId]
            );

            console.log("Raw loan details:", loan);

            // Check loan structure and active status
            if (loan && typeof loan === 'object') {
                // Log full loan structure for debugging
                console.log("Loan structure:", {
                    collateralId: loan.collateralId?.toString(),
                    amount: loan.amount?.toString(),
                    timestamp: loan.timestamp?.toString(),
                    isActive: loan.isActive,
                    interestRate: loan.interestRate?.toString(),
                    duration: loan.duration?.toString()
                });

                // Check if loan is actually active
                const hasActiveLoan = loan.isActive === true && loan.amount && !loan.amount.isZero();

                if (hasActiveLoan) {
                    console.log("Active loan found:", {
                        amount: loan.amount.toString(),
                        interest: loan.interest?.toString(),
                        isActive: loan.isActive
                    });

                    setActiveLoan({
                        amount: loan.amount,
                        startTime: loan.timestamp || 0,
                        duration: loan.duration || 0,
                        interest: loan.interest || 0,
                        isActive: true,
                        totalRepayment: loan.amount.add(loan.interest || 0)
                    });
                } else {
                    console.log("No active loan - NFT is available for borrowing");
                    setActiveLoan(null);
                }
            } else {
                console.log("Invalid loan data");
                setActiveLoan(null);
            }

            setError('');
        } catch (error: any) {
            console.error("Error fetching loan details:", {
                error,
                message: error.message,
                collateralId
            });
            setError("Failed to fetch loan details");
            setActiveLoan(null);
        }
    }, [loanManager, collateralId, address]);

    useEffect(() => {
        fetchLoanDetails();
    }, [fetchLoanDetails]);

    // Add debug logging when component mounts
    useEffect(() => {
        console.log("LoanManager mounted with:", {
            hasLoanManager: !!loanManager,
            collateralId,
            address,
            activeLoan
        });
    }, []);

    // Add debug logging for contract calls
    useEffect(() => {
        const verifyContracts = async () => {
            if (loanManager) {
                try {
                    const address = await loanManager.getAddress();
                    console.log("LoanManager contract verified at:", address);
                } catch (error) {
                    console.error("LoanManager contract verification failed:", error);
                }
            }
        };
        verifyContracts();
    }, [loanManager]);

    // Add auto-dismiss effect
    useEffect(() => {
        if (status || error) {
            const timer = setTimeout(() => {
                setStatus('');
            }, 5000); // 5 seconds

            return () => clearTimeout(timer);
        }
    }, [status]);

    const handleRepay = async () => {
        if (!loanManager || !collateralId || !activeLoan || !usdt) return;

        setIsLoading(true);
        setError('');
        setStatus('Processing repayment...');

        try {
            const repaymentAmount = activeLoan.totalRepayment;
            console.log("Repayment details:", {
                loanAmount: formatBigNumber(activeLoan.amount),
                interest: formatBigNumber(activeLoan.interest),
                totalRepayment: formatBigNumber(repaymentAmount),
                rawRepaymentAmount: repaymentAmount.toString()
            });

            // Check USDT balance
            const balance = await usdt.call(
                "balanceOf",
                [address]
            );
            console.log("USDT Balance:", {
                formatted: formatBigNumber(balance),
                raw: balance.toString()
            });

            if (balance.lt(repaymentAmount)) {
                setError(`Insufficient USDT balance. Need ${formatBigNumber(repaymentAmount)} USDT, have ${formatBigNumber(balance)} USDT`);
                return;
            }

            // Check current allowance
            const currentAllowance = await usdt.call(
                "allowance",
                [address, LOAN_MANAGER_CONTRACT]
            );
            console.log("Current allowance:", {
                formatted: formatBigNumber(currentAllowance),
                raw: currentAllowance.toString()
            });

            const interestAmount = '20000000000000000000'

            // If current allowance is less than repayment amount, approve the difference plus 1
            // if (currentAllowance.lt(repaymentAmount.add(interestAmount))) {
            if (repaymentAmount) {
                setStatus('Approving USDT...');

                try {
                    // reset approval to 0
                    // await usdt.call(
                    //     "approve",
                    //     [LOAN_MANAGER_CONTRACT, ethers.constants.Zero]
                    // );
                    // Calculate amount to approve: (repaymentAmount - currentAllowance) + 1
                    const amountToApprove = repaymentAmount.add(interestAmount);
                    console.log("Approving additional amount:", {
                        formatted: formatBigNumber(amountToApprove),
                        raw: amountToApprove.toString()
                    });

                    // Approve exact amount needed plus 1
                    await usdt.call(
                        "approve",
                        [LOAN_MANAGER_CONTRACT, amountToApprove]
                    );
                    console.log("Additional approval completed");
                } catch (approvalError) {
                    console.error("Approval failed:", approvalError);
                    setError("Failed to approve USDT. Please try again.");
                    return;
                }
            }

            // Verify allowance after approval
            const newAllowance = await usdt.call(
                "allowance",
                [address, LOAN_MANAGER_CONTRACT]
            );
            console.log("New allowance:", {
                formatted: formatBigNumber(newAllowance),
                raw: newAllowance.toString()
            });

            if (newAllowance.lt(repaymentAmount.add(interestAmount))) {
                setError("USDT approval failed(insufficient). Please try again.");
                return;
            }

            // Proceed with repayment
            setStatus('Repaying loan...');
            const tx = await loanManager.call(
                "repayLoan",
                [collateralId]
            );
            console.log("Repay transaction completed:", tx);

            setStatus("Loan successfully repaid! 🎉");
            await fetchLoanDetails();
        } catch (error: any) {
            console.error("Repay failed:", error);
            if (error.message.includes("insufficient allowance")) {
                setError("USDT approval needed. Please try again.");
            }
            else if (error.message.includes('Loan not active')) {
                setError('You Are Trying to Repay an INACTIVE loan')
            }
            else if (error.message.includes('rejected')) {
                setError('You Rejected The Repayment tx')
            }
            else {
                // setError(error.message || "Failed to repay loan");
                console.log('Error: ', error.message)
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleLiquidate = async () => {
        if (!loanManager || !collateralId || !activeLoan || !liquidationManager) return;

        setIsLoading(true);
        setError('');
        setStatus('Processing liquidation...');

        try {
            // Check if loan is eligible for liquidation
            // const loanDetails = await liquidationManager.call(
            const loanDetails = await loanManager.call(
                "isLoanOverdue",
                [collateralId]
            );
            console.log("Can liquidate:", loanDetails);

            if (!loanDetails ) {
                setError("This loan is not eligible for liquidation yet");
                return;
            }

           /* // Check if caller has permission to liquidate
            const hasPermission = await liquidationManager.call(
                "hasLiquidationPermission",
                [address, collateralId]
            );
            console.log("Has liquidation permission:", hasPermission);

            if (!hasPermission) {
                setError("You don't have permission to liquidate this loan");
                return;
            }
            */

            // Attempt liquidation
            setStatus('Initiating liquidation...');
            // const tx = await liquidationManager.call(
            const tx = await loanManager.call(
                "liquidateOverdueLoan",
                [collateralId]
            );
            console.log("Liquidate transaction:", tx);
            setStatus('Liquidated successfully');

            setStatus("Collateral successfully liquidated! 🎉");
            await fetchLoanDetails();
        } catch (error: any) {
            console.error("Liquidation failed:", error);
            if (error.message.includes("not eligible")) {
                setError("Loan is not eligible for liquidation");
            } else if (error.message.includes("no permission")) {
                setError("You don't have permission to liquidate this loan");
            } else {
                setError(error.message || "Failed to liquidate");
                console.log('error: ', error.message)
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleWithdrawNFT = async () => {
        if (!nftVault || !collateralId) return;

        setIsLoading(true);
        setError('');

        try {
            console.log("Withdrawing NFT for collateral ID:", collateralId);

            // Check if there's no active loan first
            const loan = await loanManager?.call(
                "loans",
                [collateralId]
            );

            if (loan && loan.isActive) {
                setError("Cannot withdraw NFT while loan is active");
                return;
            }

            // Withdraw NFT
            const tx = await nftVault.call(
                "withdrawNFT",
                [collateralId]
            );

            console.log("Withdraw NFT transaction:", tx);
            setStatus("NFT successfully withdrawn! 🎉");

            // Refresh user's collaterals
            if (onNFTWithdrawn) {
                await onNFTWithdrawn(collateralId);
            }
        } catch (error: any) {
            console.error("Withdraw NFT failed:", error);
            if (error.message.includes('Collateral inactive')) {
                setError(' Collateral inactive: You Have Already Withdrawn The Selected NFT');
            } else if (error.message.includes('Loan not repaid')) {
                setError('Active Loan is yet to e repaid')
            }
            // else if (error.message.includes){}
            else {
                // setError(error.message || "Failed to withdraw NFT");
                console.log('error: ', error.message)
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            {!activeLoan ? (
                // Show borrow option when no active loan
                <div className="text-center text-gray-400">
                    <p>NFT deposited as collateral</p>
                    <p>You can borrow up to {maxLoanAmount} USDT</p>
                    <button
                        onClick={handleWithdrawNFT}
                        disabled={isLoading}
                        className={`w-full mt-4 py-3 px-6 rounded-lg text-lg font-medium ${isLoading
                            ? 'bg-gray-600 cursor-not-allowed'
                            : 'bg-red-500 hover:bg-red-600'
                            } text-white transition-colors`}
                    >
                        Withdraw NFT
                    </button>
                </div>
            ) : (
                // Show loan management options when loan is active
                <div className="space-y-4">
                    <div className="text-sm text-gray-400 mb-2">
                        <p>Loan Amount: {formatBigNumber(activeLoan.amount)} USDT</p>
                        <p>Interest: {formatBigNumber(activeLoan.interest)} USDT</p>
                        <p>Total to Repay: {formatBigNumber(activeLoan.totalRepayment)} USDT</p>
                    </div>
                    <div className="flex gap-4">
                    <button
              onClick={handleRepay}
              disabled={isLoading}
              className={`flex-1 py-3 px-6 rounded-xl text-lg font-medium transition-all duration-300 
                ${
                    isLoading
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-yellow-500 hover:bg-yellow-600'
                } text-white transition-colors`}
            >
              {isLoading ? 'Processing...' : 'Repay Loan'}
            </button>

            <button
              onClick={handleLiquidate}
              disabled={isLoading}
              className={`flex-1 py-3 px-6 rounded-xl text-lg font-medium transition-all duration-300
                ${ 
                    isLoading
                    ? "bg-gray-600 cursor-not-allowed"
                    : 'bg-red-500 hover:bg-red-600'
                } text-white transition-colors`}
            >
              Liquidate
            </button>
                    </div>
                </div>
            )}

            {error && (
                <p className="mt-2 text-sm text-red-500">{error}</p>
            )}
              {/* Status Messages */}
              {status && (
                      <div className="fixed bottom-4 right-4 max-w-md bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700 animate-fade-in-out"
                          style={{
                          animation: 'fadeInOut 20s ease-in-out'
                                }}
                        >
                         <p className="text-sm text-[#F5F6FC]">{status}</p>
                       </div>
                      )}
        </div>
    );
} 