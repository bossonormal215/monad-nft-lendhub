import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    console.log('Price API params:', searchParams.toString());

    const response = await fetch(
      `https://api.0x.org/swap/permit2/price?${searchParams}`,
      {
        headers: {
          '0x-api-key': process.env.NEXT_PUBLIC_ZEROX_API_KEY || '',
          Accept: 'application/json',
          '0x-version': 'v2',
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('0x Price API Error:', errorText);
      return Response.json(
        { error: 'Failed to fetch price from 0x API', details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error: any) {
    console.error('Price API error:', error);
    return Response.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
