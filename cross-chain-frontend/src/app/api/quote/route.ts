import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    console.log('Incoming request params:', searchParams.toString());

    // Construct the 0x API URL with the correct endpoint
    const apiUrl = `https://api.0x.org/swap/permit2/quote?${searchParams}`;

    console.log('Calling 0x API:', apiUrl);

    // Make the request to 0x API
    const response = await fetch(apiUrl, {
      headers: {
        '0x-api-key': process.env.NEXT_PUBLIC_ZEROX_API_KEY || '',
        Accept: 'application/json',
        '0x-version': 'v2',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('0x API Error:', errorText);
      return new Response(
        JSON.stringify({
          error: 'Failed to fetch quote from 0x API',
          details: errorText,
        }),
        {
          status: response.status,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error: any) {
    console.error('Proxy error:', error);
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        details: error.message,
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}
