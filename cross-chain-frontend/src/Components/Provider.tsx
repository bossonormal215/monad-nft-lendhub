'use client'

import { AppProps } from 'next/app';
import { PrivyProvider } from "@privy-io/react-auth";
import { monadTestnet } from 'viem/chains';


const privy_apiKey = process.env.NEXT_PUBLIC_PRIVY_API_KEY as string

function Provider({ Component, pageProps }: AppProps) {
  return (
    <PrivyProvider 
    appId={privy_apiKey}
    config={
      {
        defaultChain: monadTestnet,
        supportedChains: [monadTestnet],
        appearance: {
          theme: 'dark',
          accentColor: '#676FFF',
          logo: 'https://your-logo-url',
        },
        // Create embedded wallets for users who don't have a wallet
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
        },
      }
    }
    >
      <Component {...pageProps} />
    </PrivyProvider>
  );
}

export default Provider;
