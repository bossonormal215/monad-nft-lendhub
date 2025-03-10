'use client'

import { Sepolia } from "@thirdweb-dev/chains";
import { coinbaseWallet, embeddedWallet, metamaskWallet, rabbyWallet, rainbowWallet, ThirdwebProvider, walletConnect, zerionWallet } from "@thirdweb-dev/react";


const monadTestNet = {
    chainId: 10143, // Replace with actual monad devnet chain ID
    // rpc: ['https://rpc-devnet.monadinfra.com/rpc/3fe540e310bbb6ef0b9f16cd23073b0a'],
    rpc: ['https://testnet-rpc.monad.xyz'],
    nativeCurrency: {
      decimals: 18,
      name: "Monad TestNet",
      symbol: "MON",
    },
    shortName: "monad",
    slug: "monad",
    testnet: true,
    chain: "monad",
    name: "Monad Testnet",
  };

export default function Web3Wrapper({ children }: { children: React.ReactNode }) {
    return (
        <ThirdwebProvider
            activeChain={monadTestNet}
            clientId={process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID}
            supportedChains={[monadTestNet, Sepolia]}
            autoSwitch={true}
      
            supportedWallets={[
              embeddedWallet(),
              metamaskWallet(),
              zerionWallet(),
              coinbaseWallet(),
              walletConnect(),
              rabbyWallet(),
              rainbowWallet()
            ]}
        >
            {/* <PrivyWrapper> */}
                {children}
            {/* </PrivyWrapper> */}
        </ThirdwebProvider>
    );
} 