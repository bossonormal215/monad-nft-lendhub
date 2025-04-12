import axios from 'axios';

export interface UserCollectionNFT {
  tokenId: string;
  contractAddress: string;
  name: string;
  imageUrl: string;
  collectionName?: string;
  verified?: boolean;
  floorPrice?: number;
}

export async function fetchUserCollectionNFTs(
  userAddress: string,
  collectionAddress: string
): Promise<UserCollectionNFT[]> {
  try {
    const response = await axios.get(
      'https://api-mainnet.magiceden.dev/v3/rtp/monad-testnet/getUsersUserCollectionsV3',
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_MAGICEDEN_API_KEY}`,
          accept: '*/*',
        },
        params: {
          user: userAddress,
          collection: collectionAddress,
          includeTopBid: 'false',
          includeLiquidCount: 'false',
          offset: '0',
          limit: '100',
          chain: 'monad-testnet',
        },
      }
    );

    const nfts = response.data?.tokens || [];

    return nfts.map((nft: any) => ({
      tokenId: nft.tokenId,
      contractAddress: nft.contract,
      name: nft.name || `NFT #${nft.tokenId}`,
      imageUrl:
        nft.image ||
        'https://next.cdn.magiceden.dev/_next/static/media/nft_fallback.f889df8f.svg', // placeholder svg
      collectionName: nft.collection?.name,
      verified: nft.collection?.magicedenVerificationStatus === 'verified',
      floorPrice: nft.collection?.floorAsk?.price?.amount?.decimal || 0,
    }));
  } catch (error) {
    console.error('❌ Error fetching user NFTs for collection:', error);
    return [];
  }
}
