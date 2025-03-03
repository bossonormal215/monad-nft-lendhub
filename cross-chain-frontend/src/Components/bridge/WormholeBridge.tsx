// 'use client'

// import { useState, useEffect } from 'react';
// import { ethers } from 'ethers';
// import { useAddress } from "@thirdweb-dev/react";
// import { CHAIN_CONFIG, initWormhole } from '@/utils/wormhole';
// import { signSendWait, Wormhole } from '@wormhole-foundation/sdk';

// export function WormholeBridge() {
//     const [amount, setAmount] = useState<string>('');
//     const [isLoading, setIsLoading] = useState(false);
//     const [error, setError] = useState<string>('');
//     const [status, setStatus] = useState<string>('');
//     const [balance, setBalance] = useState<string>('0');
//     const [sourceChain, setSourceChain] = useState<'sepolia' | 'monad'>('sepolia');

//     const address = useAddress();

//     useEffect(() => {
//         fetchBalance();
//     }, [address, sourceChain]);

//     const fetchBalance = async () => {
//         if (!address) return;
//         try {
//             const provider = new ethers.providers.JsonRpcProvider(
//                 sourceChain === 'sepolia'
//                     ? 'https://sepolia.infura.io/v3/bc3fba1bbc6a4ab7a4ec1964d16eb8ff'
//                     : 'https://testnet-rpc.monad.xyz'
//             );
//             const balance = await provider.getBalance(address);
//             setBalance(ethers.utils.formatEther(balance));
//         } catch (error) {
//             console.error('Error fetching balance:', error);
//         }
//     };

//     const handleBridge = async () => {
//         if (!address || !amount) return;

//         setIsLoading(true);
//         setError('');
//         setStatus('Initializing bridge transfer...');

//         try {
//             // Initialize Wormhole
//             const wh = await initWormhole();

//             // Parse amount
//             const amountInWei = ethers.utils.parseEther(amount);

//             // Get chain contexts
//             const sourceChainCtx = wh.getChain(sourceChain === 'sepolia' ? 'Sepolia' : 'Monad');
//             const targetChainCtx = wh.getChain(sourceChain === 'sepolia' ? 'Monad' : 'Sepolia');

//             // Get Token Bridge contract
//             const tokenBridge = await sourceChainCtx.getTokenBridge();

//             // Send the native token of the source chain
//             const tokenId = Wormhole.tokenId(sourceChainCtx.chain, "native");

//             // Create transfer parameters
//             const transfer = await tokenBridge.transfer(
//                 tokenId,  // token address (native token)
//                 amountInWei.toString(),             // amount
//                 sourceChain === 'sepolia' ? CHAIN_CONFIG.monad.wormholeChainId : CHAIN_CONFIG.sepolia.wormholeChainId,
//                 address                             // recipient address
//             );

//             setStatus('Confirming transfer...');
//             const txids = await signSendWait(sourceChainCtx, transfer);
//             console.log('Bridge transfer initiated:', txids);

//             setStatus('Transfer complete! 🎉');
//             setAmount('');
//             await fetchBalance();
//         } catch (error: any) {
//             console.error('Bridge error:', error);
//             setError(error.message || 'Failed to bridge tokens');
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     return (
//         <div className="max-w-xl mx-auto bg-[#131A2A] rounded-[20px] p-6">
//             <h2 className="text-xl font-semibold mb-6 text-[#F5F6FC]">Bridge ETH</h2>

//             <div className="space-y-6">
//                 {/* Chain Selection */}
//                 <div className="grid grid-cols-2 gap-4">
//                     <button
//                         onClick={() => setSourceChain('sepolia')}
//                         className={`p-4 rounded-lg ${sourceChain === 'sepolia'
//                             ? 'bg-[#2C3545] text-white'
//                             : 'bg-[#1C2839] text-[#98A1C0]'
//                             }`}
//                     >
//                         From Sepolia
//                     </button>
//                     <button
//                         onClick={() => setSourceChain('monad')}
//                         className={`p-4 rounded-lg ${sourceChain === 'monad'
//                             ? 'bg-[#2C3545] text-white'
//                             : 'bg-[#1C2839] text-[#98A1C0]'
//                             }`}
//                     >
//                         From Monad
//                     </button>
//                 </div>

//                 {/* Balance Display */}
//                 <div className="flex justify-between text-sm">
//                     <span className="text-[#98A1C0]">Available Balance</span>
//                     <span className="text-[#F5F6FC] font-medium">
//                         {balance} ETH
//                     </span>
//                 </div>

//                 {/* Amount Input */}
//                 <div className="space-y-2">
//                     <label className="text-sm text-[#98A1C0]">Amount</label>
//                     <input
//                         type="number"
//                         value={amount}
//                         onChange={(e) => {
//                             setAmount(e.target.value);
//                             setError('');
//                         }}
//                         placeholder="Enter amount to bridge"
//                         className="w-full px-4 py-3 bg-[#0D111C] border border-[#1C2839] rounded-[20px]
//                                  text-[#F5F6FC] placeholder-[#5D6785] focus:outline-none focus:border-[#98A1C0]"
//                         disabled={isLoading}
//                     />
//                 </div>

//                 {error && <p className="text-sm text-red-500">{error}</p>}
//                 {status && !error && <p className="text-sm text-blue-400">{status}</p>}

//                 <button
//                     onClick={handleBridge}
//                     disabled={isLoading || !amount || Number(amount) <= 0}
//                     className="w-full py-3 px-6 bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] 
//                              rounded-[20px] text-white font-medium hover:opacity-90 
//                              disabled:opacity-50 disabled:cursor-not-allowed transition-all"
//                 >
//                     {isLoading ? 'Processing...' : 'Bridge ETH'}
//                 </button>
//             </div>
//         </div>
//     );
// } 