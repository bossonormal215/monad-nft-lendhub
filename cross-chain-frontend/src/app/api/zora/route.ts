// src/app/api/zora/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const zoraResponse = await fetch('https://api.zora.co/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await zoraResponse.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('Zora Proxy Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data from Zora' },
      { status: 500 }
    );
  }
}

// import axios from 'axios';

// export async function fetchUserNFTs(ownerAddress: string) {
//   const ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY as string;
//   const chain = 'monad-testnet'; // adjust if Alchemy requires a custom name

//   const url = `https://eth-${chain}.alchemyapi.io/v2/${ALCHEMY_API_KEY}/getNFTs/`;

//   try {
//     const response = await axios.get(url, {
//       params: {
//         owner: ownerAddress,
//         withMetadata: true,
//       },
//     });

//     return response.data.ownedNfts || [];
//   } catch (err) {
//     console.error('Error fetching NFTs from Alchemy:', err);
//     return [];
//   }
// }
