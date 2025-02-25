import { useContract } from '@thirdweb-dev/react';
import { NFTCollateralVaultABI } from '@/contracts/interfaces/NFTCollateralVault';
import { LoanManagerABI } from '@/contracts/interfaces/LoanManager';
import { LiquidationManagerABI } from '@/contracts/interfaces/LiquidationManager';
import { USDTLiquidityPoolABI } from '@/contracts/interfaces/USDTLiquidityPool';
import { MockUsdtABI } from '../contracts/interfaces/mocUsdt';

// export const MONAD_RPC ='https://rpc-devnet.monadinfra.com/rpc/3fe540e310bbb6ef0b9f16cd23073b0a'; // Replace with actual Monad Devnet RPC
export const MONAD_RPC = 'https://testnet-rpc.monad.xyz'; // Replace with actual Monad Devnet RPC
export const USDT_CONTRACT = '0x4565a53f12942bb7B08CF517F8ae3911102b3AD6'; // 1 testnet

export const NFT_VAULT_CONTRACT = '0xd0434B6eF7369e213C32cDA3DEd50775B208Ed81'; // 1 testnet

export const LOAN_MANAGER_CONTRACT =
  '0x3ffED1D0912FFF6b6f237B9797409F39bc2268Ba'; // 1 testnet

export const LIQUIDATION_MANAGER_CONTRACT =
  '0x0f4D03635456bC3261D4e341F91E36cc3606e0Cd'; // 1 testnet

export const LIQUIDITY_POOL_CONTRACT =
  '0xcAbd7E3DDF1238f2eEaf27c0888FACE396FccBFb'; // 1 testnet

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

  return { usdt, nftVault, loanManager, liquidationManager, liquidityPool };
}
