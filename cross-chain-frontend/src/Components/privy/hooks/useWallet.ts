'use client';

import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useEffect, useState } from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import { createPublicClient, http } from 'viem';
import { monadTestnet } from 'wagmi/chains';

export function useAddress() {
  const { user, authenticated } = usePrivy();
  const { wallets } = useWallets();
  const { address: wagmiAddress } = useAccount();
  const [address, setAddress] = useState<string | null>(null);

  useEffect(() => {
    if (authenticated && user) {
      // First try to get address from wagmi
      if (wagmiAddress) {
        setAddress(wagmiAddress);
        return;
      }

      // Then try to get from privy wallets
      const linkedWallet = wallets.find(
        (wallet) => wallet.walletClientType !== 'privy'
      );
      if (linkedWallet?.address) {
        setAddress(linkedWallet.address);
        return;
      }

      // Finally try embedded wallet
      const embeddedWallet = wallets.find(
        (wallet) => wallet.walletClientType === 'privy'
      );
      if (embeddedWallet?.address) {
        setAddress(embeddedWallet.address);
        return;
      }
    } else {
      setAddress(null);
    }
  }, [authenticated, user, wallets, wagmiAddress]);

  return address;
}

export function useWallet() {
  const { user, authenticated, login, logout } = usePrivy();
  const { wallets } = useWallets();
  const { address: wagmiAddress } = useAccount();
  const { disconnect } = useDisconnect();
  const [activeWallet, setActiveWallet] = useState<any>(null);

  useEffect(() => {
    if (authenticated && wallets.length > 0) {
      // Prefer connected wagmi wallet
      if (wagmiAddress) {
        const wallet = wallets.find(
          (w) => w.address?.toLowerCase() === wagmiAddress.toLowerCase()
        );
        if (wallet) {
          setActiveWallet(wallet);
          return;
        }
      }

      // Otherwise use first available wallet
      setActiveWallet(wallets[0]);
    } else {
      setActiveWallet(null);
    }
  }, [authenticated, wallets, wagmiAddress]);

  const connectWallet = async () => {
    if (!authenticated) {
      await login();
    }
  };

  const disconnectWallet = async () => {
    disconnect();
    await logout();
  };

  return {
    address: activeWallet?.address || wagmiAddress || null,
    isConnected: !!activeWallet || !!wagmiAddress,
    connectWallet,
    disconnectWallet,
    activeWallet,
  };
}

export function usePublicClient() {
  return createPublicClient({
    chain: monadTestnet,
    transport: http(
      process.env.NEXT_PUBLIC_MONAD_TESTNET_RPC ||
        'https://testnet-rpc.monad.xyz'
    ),
  });
}
