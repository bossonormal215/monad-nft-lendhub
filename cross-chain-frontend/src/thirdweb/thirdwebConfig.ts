import { useContract } from '@thirdweb-dev/react';
import { NFTCollateralVaultABI } from '@/contracts/interfaces/NFTCollateralVault';
import { LoanManagerABI } from '@/contracts/interfaces/LoanManager';
import { LiquidationManagerABI } from '@/contracts/interfaces/LiquidationManager';
import { USDTLiquidityPoolABI } from '@/contracts/interfaces/USDTLiquidityPool';
import { MockUsdtABI } from '../contracts/interfaces/mocUsdt';
import { DMON_NFT_CONTRACT } from '@/contracts/interfaces/dmonNftAbi';

// export const MONAD_RPC ='https://rpc-devnet.monadinfra.com/rpc/3fe540e310bbb6ef0b9f16cd23073b0a'; // Replace with actual Monad Devnet RPC
export const MONAD_RPC = 'https://testnet-rpc.monad.xyz'; // Replace with actual Monad Devnet RPC
export const USDT_CONTRACT = '0xe78dA65A6CfE45C5DDbf6F2151E70AD7A1CA5875'; // 2 testnet

export const NFT_VAULT_CONTRACT = '0x1f9B16C4f5a2972192Ba31CF8bF999841d219B66'; // 2 testnet

export const LOAN_MANAGER_CONTRACT =
  '0x77F3EE500935BdA0C7C606f385AD97E311584948'; // 2 testnet

export const LIQUIDATION_MANAGER_CONTRACT =
  '0x5333a7Ea522862ef680Da8EF7178a42a9E6D89C6'; // 2 testnet

export const LIQUIDITY_POOL_CONTRACT =
  '0xEdad7642e3BDC6bC2A185F22abd743d98bf13340'; // 2 testnet

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
