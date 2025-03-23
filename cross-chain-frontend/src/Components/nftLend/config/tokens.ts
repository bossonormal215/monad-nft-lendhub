import { erc20Abi } from 'viem';

export type SupportedToken = 'USDT' | 'wMON' | 'USDC';

export interface TokenInfo {
  name: string;
  symbol: SupportedToken;
  address: `0x${string}`;
  decimals: number;
  abi: typeof erc20Abi;
}

// Mainnet/Testnet token addresses on Monad (replace with real ones)
export const TOKENS: Record<SupportedToken, TokenInfo> = {
  USDT: {
    name: 'Tether USD',
    symbol: 'USDT',
    address: '0x88b8E2161DEDC77EF4ab7585569D2415a1C1055D', // Replace with real address
    decimals: 18,
    abi: erc20Abi,
  },
  USDC: {
    name: 'USD Coin',
    symbol: 'USDC',
    address: '0x5efBf7Eb6EfBDc47b7Ff10D315eCA2994a080c6e', // Replace with real address
    decimals: 18,
    abi: erc20Abi,
  },
  wMON: {
    name: 'Wrapped Monad',
    symbol: 'wMON',
    address: '0x760AfE86e5de5fa0Ee542fc7B7B713e1c5425701', // Replace with real address
    decimals: 18,
    abi: erc20Abi,
  },
};

// Optional: get token info by address
export const getTokenByAddress = (address: string): TokenInfo | undefined => {
  return Object.values(TOKENS).find(
    (token) => token.address.toLowerCase() === address.toLowerCase()
  );
};
