import { useWallets } from '@privy-io/react-auth';

export function useAddress() {
  const { wallets } = useWallets();
  return wallets[0]?.address;
}
