export interface WhitelistedNFT {
  address: string;
  name: string;
  // symbol: string;
  description?: string;
  image?: string;
  maxLoanAmount: number; // Maximum loan amount in USDT
  ltvRatio: number; // Loan-to-Value ratio (e.g., 70 means 70%)
}

export const WHITELISTED_NFTS: WhitelistedNFT[] = [
  {
    // address: '0xFd6E4CF0FC697236b359ac67701B8D1dFe82D301', devnet
    // address: '0xb14580f95375b097d229EF4fBe330Dc9866e6CFe', // testnet
    address: '0x48724834cEb86E79AC8f0E861d8176c5fa324A6D', // testnet 2
    name: 'DMONNFT',
    // symbol: 'DMON',
    description: 'Exclusive Monad Ape Collection',
    image: '',
    // image: '/images/monad-ape.png', // Add your NFT collection image
    maxLoanAmount: 1000, // 1000 USDT
    ltvRatio: 70,
  },
  {
    address: '0x4ed897f597890ac80f6da0f1ba3240c193bdc1f5', // testnet 2
    name: 'AnimeLady',
    // symbol: 'DMON',
    description: 'Nft for AI Collection for Entertainment Purposes',
    image:
      'https://img-cdn.magiceden.dev/rs:fill:800:0:0/plain/https%3A%2F%2Fimg.reservoir.tools%2Fimages%2Fv2%2Fmonad-testnet%2Fi9YO%252F4yHXUdJsWcTqhqvf2zIqWHEHeAEFw449ngomCALF1JfIZNs6gwCEwg1YSMFWo5yubb5pYMAIwL2B1HiGynacXCzBPDrstAVb2D1wzr3804e4v%252FyYX9vYlpdhoEzKoqvTysPQUN0GU7Oi1Ue7A%253D%253D.jpg',

    maxLoanAmount: 50, // 1000 MON
    ltvRatio: 70,
  },
  {
    address: '0x9ae8e3c5B2a0Bc9c7d0FD9ABE56c8D80DAcdbA34', // testnet 2
    name: '4221',
    // symbol: 'DMON',
    description: 'Nft for AI Collection for Entertainment Purposes',
    image:
      'https://img-cdn.magiceden.dev/rs:fill:800:0:0/plain/https%3A%2F%2Fimg.reservoir.tools%2Fimages%2Fv2%2Fmonad-testnet%2Fi9YO%252F4yHXUdJsWcTqhqvf2zIqWHEHeAEFw449ngomCALF1JfIZNs6gwCEwg1YSMFWo5yubb5pYMAIwL2B1HiGynacXCzBPDrstAVb2D1wzr3804e4v%252FyYX9vYlpdhoEzKoqvTysPQUN0GU7Oi1Ue7A%253D%253D.jpg',

    maxLoanAmount: 50, // 1000 MON
    ltvRatio: 70,
  },
  // Add more whitelisted NFTs here
];

export function isNFTWhitelisted(address: string): boolean {
  return WHITELISTED_NFTS.some(
    (nft) => nft.address.toLowerCase() === address.toLowerCase()
  );
}

export function getNFTByAddress(address: string): WhitelistedNFT | undefined {
  return WHITELISTED_NFTS.find(
    (nft) => nft.address.toLowerCase() === address.toLowerCase()
  );
}
