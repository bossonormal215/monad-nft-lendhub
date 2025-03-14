import { useContract } from '@thirdweb-dev/react';
import { NFTCollateralVaultABI } from '@/contracts/interfaces/NFTCollateralVault';
import { LoanManagerABI } from '@/contracts/interfaces/LoanManager';
import { LiquidationManagerABI } from '@/contracts/interfaces/LiquidationManager';
import { USDTLiquidityPoolABI } from '@/contracts/interfaces/USDTLiquidityPool';
import { MockUsdtABI } from '../contracts/interfaces/mocUsdt';
import { DMON_NFT_CONTRACT } from '@/contracts/interfaces/dmonNftAbi';

export const MONAD_RPC = 'https://testnet-rpc.monad.xyz'; // Replace with actual Monad Devnet RPC
export const USDT_CONTRACT = '0x557Da2364b089f8FB28C5Aa3DABd8Ef6abB9552C'; // 2 testnet

export const NFT_VAULT_CONTRACT = '0x291f04af2132110083D2C7d73845Fb11Fe8d810a'; // 2 testnet

export const LOAN_MANAGER_CONTRACT =
  '0xe7a2e2BC8aa4383f4E0251fFD830c48Bc7Ad69DD'; // 2 testnet

export const LIQUIDATION_MANAGER_CONTRACT =
  '0x92da7fc1cDd7a9ae1A413b52A6C99FFACb58211c'; // 2 testnet

export const LIQUIDITY_POOL_CONTRACT =
  '0x196F7638B53c2a1adA87e7689e67fd510350e744'; // 2 testnet

export function useContracts() {
  const { contract: usdt } = useContract(USDT_CONTRACT, MockUsdtABI.abi);
  const { contract: nftVault } = useContract(
    NFT_VAULT_CONTRACT,
    NFTCollateralVaultABI.abi
  );
  const { contract: loanManager } = useContract(
    LOAN_MANAGER_CONTRACT,
    LoanManagerABI.abi
  );
  const { contract: liquidationManager } = useContract(
    LIQUIDATION_MANAGER_CONTRACT,
    LiquidationManagerABI.abi
  );
  const { contract: liquidityPool } = useContract(
    LIQUIDITY_POOL_CONTRACT,
    USDTLiquidityPoolABI.abi
  );
  const { contract: dmonContract } = useContract(
    DMON_NFT_CONTRACT.address,
    DMON_NFT_CONTRACT.abi
  );

  return {
    usdt,
    nftVault,
    loanManager,
    liquidationManager,
    liquidityPool,
    dmonContract,
  };
}
