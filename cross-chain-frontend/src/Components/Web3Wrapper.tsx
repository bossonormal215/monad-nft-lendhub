'use client'

import { coinbaseWallet, embeddedWallet, metamaskWallet, rabbyWallet, rainbowWallet, ThirdwebProvider, walletConnect, zerionWallet } from "@thirdweb-dev/react";
import PrivyWrapper from "./PrivyWrapper";

const monadTestNet = {
    chainId: 10143, 
    rpc: [ process.env.NEXT_PUBLIC_PUBLIC_MONAD_TESTNET_RPC as string, process.env.NEXT_PUBLIC_MONAD_TESTNET_RPC as string,],
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
            supportedChains={[monadTestNet]}
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