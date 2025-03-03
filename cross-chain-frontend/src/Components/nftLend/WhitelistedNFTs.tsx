'use client'


import { useState } from 'react';
import { WHITELISTED_NFTS, WhitelistedNFT } from '@/app/whitelistedNft/nft';
// import { useAddress } from '../privy/hooks/useWallet';
import {  useAddress } from '@thirdweb-dev/react';
// import { ethers } from 'ethers';
// import { NFT_VAULT_CONTRACT } from '../thirdweb/thirdwebConfig';

interface NFTCardProps {
    nft: WhitelistedNFT;
    onSelect: (nft: WhitelistedNFT) => void;
    selected: boolean;
}

const NFTCard = ({ nft, onSelect, selected }: NFTCardProps) => {
    return (
        <div
            className={`border rounded-lg p-4 cursor-pointer transition-all ${selected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
                }`}
            onClick={() => onSelect(nft)}
        >
            {nft.image && (
                <img
                    src={nft.image}
                    alt={nft.name}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                />
            )}
            <h3 className="font-bold text-lg text-white">{nft.name}</h3>
            <p className="text-sm text-gray-300">{nft.symbol}</p>
            {nft.description && (
                <p className="text-sm text-gray-400 mt-2">{nft.description}</p>
            )}
            <div className="mt-4 space-y-2">
                <p className="text-sm text-gray-300">Max Loan: {nft.maxLoanAmount} USDT</p>
                <p className="text-sm text-gray-300">LTV Ratio: {nft.ltvRatio}%</p>
            </div>
        </div>
    );
};

interface WhitelistedNFTsProps {
    onNFTDeposit: (nftAddress: string, tokenId: string, maxLoanAmount: number) => Promise<void>;
    isLoading: boolean;
}

export function WhitelistedNFTs({ onNFTDeposit, isLoading }: WhitelistedNFTsProps) {
    const [selectedNFT, setSelectedNFT] = useState<WhitelistedNFT | null>(null);
    const [tokenId, setTokenId] = useState<string>('');
    const address = useAddress();

    const handleNFTSelect = (nft: WhitelistedNFT) => {
        setSelectedNFT(nft);
    };

    const handleDeposit = async () => {
        if (!selectedNFT || !tokenId || !address) return;
        await onNFTDeposit(selectedNFT.address, tokenId, selectedNFT.maxLoanAmount);
        // Reset form on success
        setTokenId('');
        setSelectedNFT(null);
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-6 text-white">Supported NFT Collections</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {WHITELISTED_NFTS.map((nft) => (
                    <NFTCard
                        key={nft.address}
                        nft={nft}
                        onSelect={handleNFTSelect}
                        selected={selectedNFT?.address === nft.address}
                    />
                ))}
            </div>

            {selectedNFT && (
                <div className="mt-8 p-4 border rounded-lg bg-gray-800 border-gray-700">
                    <h3 className="text-xl font-bold mb-4 text-white">Deposit {selectedNFT.name}</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1 text-white">
                                Token ID
                            </label>
                            <input
                                type="number"
                                value={tokenId}
                                onChange={(e) => {
                                    const value = Math.floor(Number(e.target.value));
                                    if (value >= 0) {
                                        setTokenId(value.toString());
                                    }
                                }}
                                min="0"
                                step="1"
                                className="w-full p-2 border rounded bg-gray-700 text-green-400 border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                                placeholder="Enter NFT Token ID"
                                disabled={isLoading}
                            />
                        </div>

                        <button
                            onClick={handleDeposit}
                            disabled={isLoading || !tokenId || !address}
                            className={`w-full py-2 px-4 rounded ${isLoading ? 'bg-gray-600' : 'bg-blue-500 hover:bg-blue-600'
                                } text-white font-medium transition-colors`}
                        >
                            {isLoading ? 'Processing...' : 'Deposit NFT'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
} 