// import { ethers } from 'ethers';
// import { wormhole } from '@wormhole-foundation/sdk';
// import { Wormhole, amount, signSendWait } from '@wormhole-foundation/sdk';
// import evm from '@wormhole-foundation/sdk/evm';

// // Chain configurations
// export const CHAIN_CONFIG = {
//     sepolia: {
//         id: 11155111,
//         rpc: 'https://sepolia.infura.io/v3/bc3fba1bbc6a4ab7a4ec1964d16eb8ff',
//         name: 'Sepolia',
//         wormholeChainId: 11155111,
//     },
//     monad: {
//         id: 10143,
//         rpc: 'https://testnet-rpc.monad.xyz',
//         name: 'Monad Testnet',
//         wormholeChainId: 10143,
//     }
// };

// // Initialize Wormhole context
// export const initWormhole = async () => {
//     try {
//         const wh = await wormhole('Testnet', [evm]);
//         return wh;
//     } catch (error) {
//         console.error('Failed to initialize Wormhole:', error);
//         throw error;
//     }
// };

// export async function transferFromSepoliaToMonad(
//     recipientMonadAddress: string,
//     amountToTransfer: string
// ) {
//     try {
//         // Initialize Wormhole
//         const wh = await initWormhole();

//         // Convert amount to wei
//         const amountInWei = ethers.utils.parseEther(amountToTransfer);

//         // Get the source chain context
//         const sourceChain = wh.getChain('Sepolia');
//         const targetChain = wh.getChain('Monad');

//         // Get Token Bridge contract
//         const tokenBridge = await sourceChain.getTokenBridge();

//         const tokenId = Wormhole.tokenId(sourceChain.chain, "native");

//         // Create transfer parameters
//         const transfer = await tokenBridge.transfer(
//             tokenId, // token address (native token)
//             amountInWei.toString(),         // amount
//             CHAIN_CONFIG.monad.wormholeChainId,  // destination chain
//             recipientMonadAddress           // recipient address
//         );

//         // Execute the transfer
//         const txids = await signSendWait(sourceChain, transfer, address);
//         console.log('Transfer initiated:', txids);
//         return txids;
//     } catch (error) {
//         console.error('Wormhole transfer failed:', error);
//         throw error;
//     }
// }
