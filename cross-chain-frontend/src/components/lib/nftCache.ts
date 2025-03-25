import { fetchNFTMetadata } from './fetchUserNfts';

const metadataCache = new Map<string, { name: string; imageUrl: string }>();

export function normalizeImageUrl(url?: string): string {
  if (!url) return 'https://via.placeholder.com/300x300.png?text=No+Image';
  if (url.startsWith('ipfs://')) {
    return `https://ipfs.io/ipfs/${url.replace('ipfs://', '')}`;
  }
  if (url.startsWith('data:')) return url;
  return url;
}

export async function getCachedNFTMetadata(
  contractAddress: string,
  tokenId: number
): Promise<{ name: string; imageUrl: string }> {
  const key = `${contractAddress}-${tokenId}`;
  if (metadataCache.has(key)) return metadataCache.get(key)!;

  try {
    const meta = await fetchNFTMetadata(contractAddress, tokenId);
    const rawImage =
      meta?.imageUrl || 'https://via.placeholder.com/300x300.png?text=No+Image';
    const data = {
      name: meta?.name || `NFT #${tokenId}`,
      imageUrl: normalizeImageUrl(rawImage),
    };
    metadataCache.set(key, data);
    return data;
  } catch {
    return {
      name: `NFT #${tokenId}`,
      imageUrl: 'https://via.placeholder.com/300x300.png?text=No+Image',
    };
  }
}
