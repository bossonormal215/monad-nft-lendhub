import {
  type Chain,
  type TokenId,
  toNative,
  Wormhole,
  type NativeAddress,
} from '@wormhole-foundation/sdk';
import evm from '@wormhole-foundation/sdk/evm';

// Chain IDs for Wormhole
const CHAIN_IDS = {
  sepolia: 10002, // Ethereum Sepolia testnet
  monad: 88888, // Placeholder for Monad testnet
};

// Initialize Wormhole SDK
export async function initializeWormhole() {
  // Create a Wormhole instance for testnet
  const wh = await wormhole('Testnet', [evm]);

  return wh;
}

// Transfer native token (ETH)
export async function transferNativeToken(
  wh: Wormhole,
  sourceChain: string,
  destinationChain: string,
  recipient: string,
  amountToSend: string
) {
  // Get chain objects
  const source = wh.getChain(sourceChain as Chain);
  const destination = wh.getChain(destinationChain as Chain);

  // Get token bridge for source chain
  const tokenBridge = source.getTokenBridge();

  // Convert amount to native format
  const nativeAmount = toNative(amountToSend, 18);

  // Create transfer with token bridge
  const transfer = await tokenBridge.transfer(
    nativeAmount,
    source.getNative().address,
    destination.chain,
    recipient as NativeAddress
  );

  // Execute the transfer
  const tx = await transfer.execute();

  // Return transaction hash
  return tx.hash;
}

// Transfer ERC20 token (WETH, USDT)
export async function transferERC20Token(
  wh: Wormhole,
  sourceChain: string,
  destinationChain: string,
  tokenAddress: string,
  recipient: string,
  amountToSend: string,
  decimals: number
) {
  // Get chain objects
  const source = wh.getChain(sourceChain as Chain);
  const destination = wh.getChain(destinationChain as Chain);

  // Get token bridge for source chain
  const tokenBridge = source.getTokenBridge();

  // Create token ID
  const tokenId: TokenId = {
    chain: source.chain,
    address: tokenAddress<'Ethereum'>,
  };

  // Convert amount to native format
  const nativeAmount = toNative(amountToSend, decimals);

  // Create transfer with token bridge
  const transfer = await tokenBridge.transfer(
    nativeAmount,
    tokenId,
    destination.chain,
    recipient as NativeAddress
  );

  // Execute the transfer
  const tx = await transfer.execute();

  // Return transaction hash
  return tx.hash;
}
