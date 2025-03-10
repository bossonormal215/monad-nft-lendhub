'use client'

import { PrivyProvider } from "@privy-io/react-auth";
import { monadTestnet } from "viem/chains";

export default function PrivyWrapper({ children }: { children: React.ReactNode }) {
    const privy_apiKey = process.env.NEXT_PUBLIC_PRIVY_API_KEY as string;

    return (
        <PrivyProvider
            appId={privy_apiKey}
            config={{
                defaultChain: monadTestnet,
                supportedChains: [monadTestnet],
                loginMethods: ["wallet", "email"],
                appearance: {
                    theme: 'dark',
                    accentColor: '#676FFF',
                    logo: 'https://your-logo-url',
                },
                embeddedWallets: {
                    createOnLogin: 'users-without-wallets',
                },
            }}
        >
            {children}
        </PrivyProvider>
    );
} 




