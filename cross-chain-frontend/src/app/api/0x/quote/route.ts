import { NextRequest, NextResponse } from 'next/server';

// Set your platform fee recipient address here
const PLATFORM_FEE_BPS = 30; // 0.3%
const PLATFORM_FEE_RECIPIENT = '0xED42844Cd35d734fec3B65dF486158C443896b41'; // Replace with your address

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const chainId = searchParams.get('chainId');
  const sellToken = searchParams.get('sellToken');
  const buyToken = searchParams.get('buyToken');
  const sellAmount = searchParams.get('sellAmount');
  const taker = searchParams.get('taker');
  // Allow override via query, else use default
  const swapFeeBps = searchParams.get('swapFeeBps') || PLATFORM_FEE_BPS;
  const swapFeeRecipient = searchParams.get('swapFeeRecipient') || PLATFORM_FEE_RECIPIENT;
  // Use sellToken as the fee token
  const swapFeeToken = searchParams.get('swapFeeToken') || sellToken;

  if (!chainId || !sellToken || !buyToken || !sellAmount || !taker) {
    return NextResponse.json({ error: 'Missing required query parameters' }, { status: 400 });
  }

//   const url = `https://api.0x.org/swap/permit2/quote?chainId=${chainId}&sellToken=${sellToken}&buyToken=${buyToken}&sellAmount=${sellAmount}&taker=${taker}`;
//   const url = `https://api.0x.org/swap/allowance-holder/quote?chainId=${chainId}&sellToken=${sellToken}&buyToken=${buyToken}&sellAmount=${sellAmount}&taker=${taker}`;
  const url = `https://api.0x.org/swap/allowance-holder/quote?chainId=${chainId}&sellToken=${sellToken}&buyToken=${buyToken}&sellAmount=${sellAmount}&taker=${taker}&swapFeeBps=${swapFeeBps}&swapFeeRecipient=${swapFeeRecipient}&swapFeeToken=${swapFeeToken}`;

  try {
    const response = await fetch(url, {
      headers: {
        '0x-api-key': process.env.NEXT_PUBLIC_0X_API_KEY!,
        '0x-version': 'v2',
      },
    });
    const data = await response.text();
    return new NextResponse(data, {
      status: response.status,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch from 0x API' }, { status: 500 });
  }
} 