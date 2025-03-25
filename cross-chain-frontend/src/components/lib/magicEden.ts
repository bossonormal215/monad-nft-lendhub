import axios from 'axios';

export async function fetchMagicEdenCollectionData(contractAddress: string) {
  try {
    const response = await axios.get(
      `https://api-mainnet.magiceden.dev/v2/collections/${contractAddress}`
    );

    const { is_verified, floor_price } = response.data;

    return {
      verified: is_verified ?? false,
      floorPrice: floor_price ? floor_price / 1e9 : 0, // assuming it's in lamports
    };
  } catch (err) {
    console.error('❌ Error fetching Magic Eden data:', err);
    return {
      verified: false,
      floorPrice: 0,
    };
  }
}
