import axios from 'axios';

const ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY as string;
const BASE_URL = `https://monad-testnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`;

export interface NFT {
  tokenId: string;
  contractAddress: string;
  imageUrl: string;
  name: string;
}

export async function fetchUserNFTs(address: string): Promise<NFT[]> {
  try {
    const response = await axios.get(`${BASE_URL}/getNFTs/`, {
      params: {
        owner: address,
        withMetadata: true,
      },
    });

    const ownedNfts = response.data?.ownedNfts || [];

    const result = ownedNfts
      .map((nft: any) => {
        const mediaUrl = nft.media?.[0]?.gateway || nft.media?.[0]?.raw || null;
        const imageUrl =
          mediaUrl && mediaUrl !== '' ? mediaUrl : '/placeholder.svg';

        return {
          tokenId: BigInt(nft.id.tokenId).toString(), // normalize tokenId from hex
          contractAddress: nft.contract.address,
          imageUrl,
          name: nft.metadata?.name || `Token #${parseInt(nft.id.tokenId, 16)}`,
        };
      })
      .filter((nft: NFT) => nft.imageUrl !== null); // Optional: only include NFTs with some image

    console.log('🖼️ Parsed NFTs:', result);
    return result;
  } catch (err) {
    console.error('❌ Error fetching NFTs from Alchemy:', err);
    return [];
  }
}

export function normalizeImageUrl(url?: string): string {
  if (!url) return '/placeholder.svg';
  if (url.startsWith('ipfs://')) {
    return `https://ipfs.io/ipfs/${url.replace('ipfs://', '')}`;
  }
  if (url.startsWith('data:')) return url;
  return url;
}

export async function fetchNFTMetadata(
  contractAddress: string,
  tokenId: number
) {
  try {
    const res = await fetch(
      `${BASE_URL}/getNFTMetadata?contractAddress=${contractAddress}&tokenId=${tokenId}&withMetadata=true`
    );
    const json = await res.json();

    const name = json.metadata?.name || `NFT #${tokenId}`;
    const rawImage = json.metadata?.image || json.image;
    const imageUrl = normalizeImageUrl(rawImage);

    return { name, imageUrl };
  } catch {
    return { name: `NFT #${tokenId}`, imageUrl: '/placeholder.svg' };
  }
}
