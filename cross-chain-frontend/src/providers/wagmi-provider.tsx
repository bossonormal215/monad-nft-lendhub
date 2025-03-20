"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {WagmiProvider, createConfig} from '@privy-io/wagmi';
import PrivyWrapper from "@/Components/PrivyWrapper";
import {mainnet, monadTestnet} from 'viem/chains';
import {http} from 'wagmi';


const queryClient = new QueryClient();

const config = createConfig({
  chains: [monadTestnet, mainnet],
  transports: {
    [mainnet.id]: http(),
    [monadTestnet.id]: http(),
  },
});

export function WagmiConfig({ children }: { children: React.ReactNode }) {
  return (
    <PrivyWrapper>
      <QueryClientProvider client={queryClient}>
       <WagmiProvider config={config}>
         {children}
       </WagmiProvider>
    </QueryClientProvider>
    </PrivyWrapper>
  );
}
