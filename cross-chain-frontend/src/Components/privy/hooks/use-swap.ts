'use client';

import { useSwap as useSwapContext } from '@/Components/privy/providers/swap-provider';

export function useSwap() {
  return useSwapContext();
}
