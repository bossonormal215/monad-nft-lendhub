// import { ethers } from 'ethers';
// import { WormholeContext, MAINNET_CHAINS, TESTNET_CHAINS } from '@wormhole-foundation/connect-sdk';

// // Initialize Wormhole context for testnet
// const context = new WormholeContext('TESTNET', [
//   TESTNET_CHAINS.sepolia,  // Source chain
//   TESTNET_CHAINS.monad     // Destination chain
// ]);

// export async function transferFromSepoliaToMonad(
//   recipientMonadAddress: string,
//   amount: string
// ) {
//   try {
//     // Convert amount to wei
//     const amountInWei = ethers.utils.parseEther(amount);

//     // Create transfer
//     const transfer = await context.tokenBridge().transfer({
//       from: TESTNET_CHAINS.sepolia,
//       to: TESTNET_CHAINS.monad,
//       token: 'ETH',
//       amount: amountInWei,
//       recipient: recipientMonadAddress,
//     });

//     // Execute the transfer
//     const tx = await transfer.submit();
//     console.log('Transfer initiated:', tx);
//     return tx;

//   } catch (error) {
//     console.error('Wormhole transfer failed:', error);
//     throw error;
//   }
// }
