import axios from 'axios';

const ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY as string;
const ALCHEMY_BASE_URL = `https://monad-testnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`;

export async function fetchWalletNFTs(address: string) {
  try {
    const response = await axios.get(`${ALCHEMY_BASE_URL}/getNFTs/`, {
      params: {
        owner: address,
        withMetadata: true,
      },
    });

    const nfts = response.data.ownedNfts || [];
    return nfts.map((nft: any) => ({
      tokenId: nft.id.tokenId,
      contractAddress: nft.contract.address,
      image: nft.media?.[0]?.gateway || '',
      name: nft.title || `NFT #${nft.id.tokenId}`,
    }));
  } catch (error) {
    console.error('Failed to fetch NFTs from Alchemy:', error);
    return [];
  }
}
