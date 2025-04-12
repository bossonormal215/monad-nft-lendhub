// src/app/api/nfts/route.ts

import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const ALCHEMY_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY!;
const ALCHEMY_BASE_URL = `https://monad-testnet.g.alchemy.com/v2/${ALCHEMY_KEY}`;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const wallet = searchParams.get('wallet');

  if (!wallet) {
    return NextResponse.json(
      { error: 'Wallet address missing' },
      { status: 400 }
    );
  }

  try {
    const res = await axios.get(`${ALCHEMY_BASE_URL}/getNFTs/`, {
      params: {
        owner: wallet,
        withMetadata: true,
        excludeFilters: 'SPAM',
      },
    });

    const ownedNfts = res.data?.ownedNfts || [];

    const nfts = ownedNfts.map((nft: any) => {
      const tokenId = BigInt(nft.id.tokenId).toString();
      const contractAddress = nft.contract.address;
      const rawImage = nft.media?.[0]?.gateway || nft.media?.[0]?.raw || '';
      const name =
        nft.metadata?.name || `Token #${parseInt(nft.id.tokenId, 16)}`;

      return {
        tokenId,
        contractAddress,
        name,
        imageUrl: normalizeImageUrl(rawImage),
      };
    });

    return NextResponse.json(nfts);
  } catch (error) {
    console.error('❌ Error fetching NFTs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch NFTs' },
      { status: 500 }
    );
  }
}

function normalizeImageUrl(url?: string): string {
  if (!url)
    return 'https://next.cdn.magiceden.dev/_next/static/media/nft_fallback.f889df8f.svg'; // placeholder
  if (url.startsWith('ipfs://')) {
    return `https://ipfs.io/ipfs/${url.replace('ipfs://', '')}`;
  }
  return url;
}
