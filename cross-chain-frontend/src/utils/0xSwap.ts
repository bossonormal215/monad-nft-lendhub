const API_URL = 'https://api.0x.org/swap/permit2/quote'; // 0x Swap API Endpoint
const API_KEY = process.env.NEXT_PUBLIC_ZEROX_API_KEY as string; // 0x API Key

export async function getSwapQuote(
  sellToken: string,
  buyToken: string,
  amount: string,
  takerAddress: string
) {
  try {
    const response = await fetch(
      `${API_URL}?sellAmount=${amount}&chainId=10143&sellToken=${sellToken}&buyToken=${buyToken}&taker=${takerAddress}`,
      {
        method: 'GET',
        headers: {
          '0x-api-key': API_KEY!,
          '0x-version': 'v2',
        },
      }
    );

    const quote = await response.json();
    if (!quote.price) throw new Error('No swap quote found');

    console.log('Swap Quote:', quote);
    return quote;
  } catch (error) {
    console.error('Failed to fetch swap quote:', error);
  }
}

// Replace "YOUR_API_KEY" with your actual API key from https://dashboard.0x.org/create-account
