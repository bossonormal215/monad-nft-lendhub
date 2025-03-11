import { useContract } from '@thirdweb-dev/react';
import { NFTCollateralVaultABI } from '@/contracts/interfaces/NFTCollateralVault';
import { LoanManagerABI } from '@/contracts/interfaces/LoanManager';
import { LiquidationManagerABI } from '@/contracts/interfaces/LiquidationManager';
import { USDTLiquidityPoolABI } from '@/contracts/interfaces/USDTLiquidityPool';
import { MockUsdtABI } from '../contracts/interfaces/mocUsdt';
import { DMON_NFT_CONTRACT } from '@/contracts/interfaces/dmonNftAbi';

export const MONAD_RPC = 'https://testnet-rpc.monad.xyz'; // Replace with actual Monad Devnet RPC
export const USDT_CONTRACT = '0xD7A3f4cF54e7c1b1C89CDbf4cc94eeaA20D7B5c5'; // 2 testnet

export const NFT_VAULT_CONTRACT = '0x8b499ae4929E59d8101cbbb54b49690Ba0c3627C'; // 2 testnet

export const LOAN_MANAGER_CONTRACT =
  '0x34dd2B5d9Bd254a602dbd41D3b1C037656C712E4'; // 2 testnet

export const LIQUIDATION_MANAGER_CONTRACT =
  '0xf2B94a95e1bB8C68F94F3Cc2153744f37e6d45d7'; // 2 testnet

export const LIQUIDITY_POOL_CONTRACT =
  '0x8Fe57D653c1073211170Cb8B2D9861DcDab06F79'; // 2 testnet

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
