import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const ALCHEMY_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY!;
const ALCHEMY_BASE_URL = `https://monad-testnet.g.alchemy.com/v2/${ALCHEMY_KEY}`;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const contractAddress = searchParams.get('address');
  const tokenId = searchParams.get('tokenId');

  if (!contractAddress || !tokenId) {
    return NextResponse.json({ error: 'Missing params' }, { status: 400 });
  }

  try {
    const res = await axios.get(`${ALCHEMY_BASE_URL}/getNFTMetadata/`, {
      params: {
        contractAddress,
        tokenId,
      },
    });

    const metadata = res.data?.metadata || {};
    const name = metadata.name || `Token #${tokenId}`;
    const imageUrl = metadata.image || '';

    return NextResponse.json({ name, imageUrl });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch NFT info' }, { status: 500 });
  }
}