import { useState } from 'react';
import { LoanManager } from './LoanManager';
import { BorrowForm } from './BorrowForm';

interface Collateral {
    id: number;
    nftAddress: string;
    tokenId: string;
    maxLoanAmount: string;
    currentLoanAmount: string;
    isActive: boolean;
}

interface CollateralListProps {
    collaterals: Collateral[];
    onNFTWithdrawn: (collateralId: number) => Promise<void>;
    onBorrow: (collateralId: number, amount: string) => Promise<void>;
}

export function CollateralList({
    collaterals,
    onNFTWithdrawn,
    onBorrow
}: CollateralListProps) {
    const [selectedCollateral, setSelectedCollateral] = useState<number | null>(null);

    // Separate active and inactive collaterals
    const activeCollaterals = collaterals.filter(c => c.isActive);
    const inactiveCollaterals = collaterals.filter(c => !c.isActive);

    return (
        <div className="space-y-8">
            {/* Active Loans Section */}
            {activeCollaterals.length > 0 && (
                <div>
                    <h2 className="text-xl font-semibold mb-4">Active Loans</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {activeCollaterals.map((collateral) => (
                            <div
                                key={collateral.id}
                                className={`p-4 rounded-lg border-2 ${selectedCollateral === collateral.id
                                    ? 'border-blue-500'
                                    : 'border-gray-200'
                                    }`}
                                onClick={() => setSelectedCollateral(collateral.id)}
                            >
                                <div className="mb-4">
                                    <p>Collateral ID: {collateral.id}</p>
                                    <p>NFT ID: {collateral.tokenId}</p>
                                    <p>Loan Amount: {collateral.currentLoanAmount} USDT</p>
                                </div>
                                {selectedCollateral === collateral.id && (
                                    <LoanManager
                                        collateralId={collateral.id}
                                        maxLoanAmount={collateral.maxLoanAmount}
                                        onNFTWithdrawn={onNFTWithdrawn}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Available Collaterals Section */}
            {inactiveCollaterals.length > 0 && (
                <div>
                    <h2 className="text-xl font-semibold mb-4">Available Collaterals</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {inactiveCollaterals.map((collateral) => (
                            <div
                                key={collateral.id}
                                className={`p-4 rounded-lg border-2 ${selectedCollateral === collateral.id
                                    ? 'border-blue-500'
                                    : 'border-gray-200'
                                    }`}
                                onClick={() => setSelectedCollateral(collateral.id)}
                            >
                                <div className="mb-4">
                                    <p>Collateral ID: {collateral.id}</p>
                                    <p>NFT ID: {collateral.tokenId}</p>
                                    <p>Max Loan: {collateral.maxLoanAmount} USDT</p>
                                </div>
                                {selectedCollateral === collateral.id && (
                                    <>
                                        <BorrowForm
                                            collateralId={collateral.id}
                                            maxLoanAmount={collateral.maxLoanAmount}
                                            isLoading={false}
                                            onBorrow={onBorrow}
                                        />
                                        <LoanManager
                                            collateralId={collateral.id}
                                            maxLoanAmount={collateral.maxLoanAmount}
                                            onNFTWithdrawn={onNFTWithdrawn}
                                        />
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {collaterals.length === 0 && (
                <div className="text-center text-gray-500">
                    No collaterals found. Deposit an NFT to get started.
                </div>
            )}
        </div>
    );
} 