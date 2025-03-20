'use client';

import { useEffect, useState } from 'react';
import { useAccount, usePublicClient, useWalletClient } from 'wagmi';
import { getContract } from 'viem';
import { NFTCollateralVaultABI } from '@/contracts/interfaces/NFTCollateralVault';
import { LoanManagerABI } from '@/contracts/interfaces/LoanManager';
import { LiquidationManagerABI } from '@/contracts/interfaces/LiquidationManager';
import { USDTLiquidityPoolABI } from '@/contracts/interfaces/USDTLiquidityPool';
import { MockUsdtABI } from '@/contracts/interfaces/mocUsdt';
import { DMON_NFT_CONTRACT } from '@/contracts/interfaces/dmonNftAbi';

export const MONAD_RPC = 'https://testnet-rpc.monad.xyz';
export const USDT_CONTRACT =
  '0xe78dA65A6CfE45C5DDbf6F2151E70AD7A1CA5875' as const;
export const NFT_VAULT_CONTRACT =
  '0x1f9B16C4f5a2972192Ba31CF8bF999841d219B66' as const;
export const LOAN_MANAGER_CONTRACT =
  '0x77F3EE500935BdA0C7C606f385AD97E311584948' as const;
export const LIQUIDATION_MANAGER_CONTRACT =
  '0x5333a7Ea522862ef680Da8EF7178a42a9E6D89C6' as const;
export const LIQUIDITY_POOL_CONTRACT =
  '0xEdad7642e3BDC6bC2A185F22abd743d98bf13340' as const;

type ContractType = ReturnType<typeof getContract>;

export function useContracts() {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  const [contracts, setContracts] = useState<{
    usdt: ContractType | null;
    nftVault: ContractType | null;
    loanManager: ContractType | null;
    liquidationManager: ContractType | null;
    liquidityPool: ContractType | null;
    dmonContract: ContractType | null;
  }>({
    usdt: null,
    nftVault: null,
    loanManager: null,
    liquidationManager: null,
    liquidityPool: null,
    dmonContract: null,
  });

  useEffect(() => {
    if (!publicClient || !address) return;

    const createContract = (address: `0x${string}`, abi: any) => {
      return getContract({
        address,
        abi,
        client: publicClient,
        // walletClient: walletClient || undefined,
      });
    };

    setContracts({
      usdt: createContract(USDT_CONTRACT, MockUsdtABI.abi),
      nftVault: createContract(NFT_VAULT_CONTRACT, NFTCollateralVaultABI.abi),
      loanManager: createContract(LOAN_MANAGER_CONTRACT, LoanManagerABI.abi),
      liquidationManager: createContract(
        LIQUIDATION_MANAGER_CONTRACT,
        LiquidationManagerABI.abi
      ),
      liquidityPool: createContract(
        LIQUIDITY_POOL_CONTRACT,
        USDTLiquidityPoolABI.abi
      ),
      dmonContract: createContract(
        DMON_NFT_CONTRACT.address as `0x${string}`,
        DMON_NFT_CONTRACT.abi
      ),
    });
  }, [publicClient, walletClient, address]);

  return contracts;
}
