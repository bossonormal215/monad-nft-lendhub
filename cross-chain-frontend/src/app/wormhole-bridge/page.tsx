'use client'

import { useState } from 'react';
import { ethers } from 'ethers';
import {
    useAddress,
    useContract,
    useNetworkMismatch,
    useSwitchChain,
    ConnectWallet
} from "@thirdweb-dev/react";
// import { WormholeBridge } from '@/Components/bridge/WormholeBridge';

function BridgePage() {
    const [status, setStatus] = useState<string>('');
    const address = useAddress();
    const isMismatch = useNetworkMismatch();
    const switchNetwork = useSwitchChain();

    return (
        <div className="min-h-screen bg-[#0D111C] text-white">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-[#131A2A]/80 backdrop-blur-sm p-4 border-b border-[#1C2839]">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
                    <h1 className="text-2xl sm:text-3xl font-bold">Monad Bridge</h1>
                    <ConnectWallet modalTitle="Connect Your Wallet" modalSize="wide" />
                </div>
            </header>

            {!address ? (
                // Show connect wallet message when no wallet is connected
                <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
                    <div className="text-center space-y-6 max-w-lg">
                        <h2 className="text-3xl font-bold text-[#F5F6FC]">
                            Welcome to Monad Bridge
                        </h2>
                        <p className="text-[#98A1C0] text-lg">
                            Connect your wallet to start bridging assets between Ethereum Sepolia and Monad Testnet.
                        </p>
                        <div className="inline-block">
                            <ConnectWallet
                                modalTitle="Connect Your Wallet"
                                modalSize="wide"
                                className="!bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] !text-white hover:opacity-90 transition-opacity"
                            />
                        </div>
                    </div>
                </div>
            ) : (
                <main className="container mx-auto px-4 py-6">
                    {/* <WormholeBridge /> */}
                </main>
            )}

            {/* Status Messages */}
            {status && (
                <div className="fixed bottom-4 right-4 max-w-md bg-[#131A2A] p-4 rounded-[20px] 
                               border border-[#1C2839] animate-fade-in-out">
                    <p className="text-sm text-[#F5F6FC]">{status}</p>
                </div>
            )}
        </div>
    );
}

export default BridgePage;
