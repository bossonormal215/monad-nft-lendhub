"use client";

import type { ReactNode } from "react";
import { PrivyProvider } from "@privy-io/react-auth";
import { createConfig, http } from "wagmi";
import { monadTestnet } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import PrivyWrapper from "./PrivyWrapper";

const queryClient = new QueryClient();

const config = createConfig({
  chains: [monadTestnet],
  transports: {
    [monadTestnet.id]: http(),
  },
});

// Privy configuration
const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID as string;

interface Web3WrapperProps {
  children: ReactNode;
}

export default function Web3Wrapper({ children }: Web3WrapperProps) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <PrivyWrapper>
          {children}
        </PrivyWrapper>
      </QueryClientProvider>
    </WagmiProvider>
  );
}