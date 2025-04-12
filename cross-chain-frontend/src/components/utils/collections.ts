import axios from 'axios';

export interface Collection {
  name: string;
  slug: string;
  imageUrl: string;
  contractAddress: string;
  floorPrice: number;
  verified: boolean;
}

const MAGICEDEN_V3_API =
  'https://api-mainnet.magiceden.dev/v3/rtp/monad-testnet/collections/v7';

export async function fetchSupportedCollections(): Promise<Collection[]> {
  try {
    const { data } = await axios.get(MAGICEDEN_V3_API, {
      params: {
        includeMintStages: 'false',
        includeSecurityConfigs: 'false',
        normalizeRoyalties: 'false',
        useNonFlaggedFloorAsk: 'false',
        sortBy: 'allTimeVolume',
        limit: 20,
        // sortBy: 'updatedAt',
        // limit: 1000,
      },
      headers: {
        accept: '*/*',
      },
    });

    const collections = data.collections || [];

    return collections.map(
      (col: any): Collection => ({
        name: col.name,
        slug: col.slug,
        imageUrl:
          col.image ||
          'https://next.cdn.magiceden.dev/_next/static/media/nft_fallback.f889df8f.svg', // placeholder
        // contractAddress: col.contracts?.[0]?.contract || '',
        contractAddress: col.id || '',
        floorPrice: parseFloat(col.floorAsk?.price?.amount?.decimal || '0'),
        verified: col.magicedenVerificationStatus === 'verified',
      })
    );
  } catch (err) {
    console.error('❌ Error fetching collections:', err);
    return [];
  }
}
