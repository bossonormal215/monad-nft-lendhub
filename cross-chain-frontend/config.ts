// @noErrors
import { createConfig, cookieStorage } from '@account-kit/react';
import { QueryClient } from '@tanstack/react-query';
import { sepolia, alchemy } from '@account-kit/infra';
import { monadTestnet } from 'viem/chains';

const ALCHEMY_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY! as string;
const WALLET_CONNECT_API_KEY = process.env
  .NEXT_PUBLIC_WALLET_CONNECT_API_KEY as string;

export const config = createConfig(
  {
    // alchemy config
    transport: alchemy({ apiKey: ALCHEMY_KEY }),
    chain: sepolia,
    ssr: true,
    storage: cookieStorage,
    enablePopupOauth: true,
    sessionConfig: {
      expirationTimeMs: 1000 * 60 * 60, // 60 minutes (default is 15 min)
    },
  },
  {
    // authentication ui config - your customizations here
    auth: {
      sections: [
        [{ type: 'email' }],
        [
          { type: 'passkey' },
          { type: 'social', authProviderId: 'google', mode: 'popup' },
          { type: 'social', authProviderId: 'facebook', mode: 'popup' },
        ],
        [
          {
            type: 'external_wallets',
            walletConnect: { projectId: WALLET_CONNECT_API_KEY },
          },
        ],
      ],
      addPasskeyOnSignup: true,
      // showSignInText: true,
    },
  }
);

export const queryClient = new QueryClient();
