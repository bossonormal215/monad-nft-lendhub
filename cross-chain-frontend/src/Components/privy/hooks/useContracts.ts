// 'use client';

// import { useAccount } from 'wagmi';
// import {
//   NFT_VAULT_CONTRACT,
//   LOAN_MANAGER_CONTRACT,
//   LIQUIDATION_MANAGER_CONTRACT,
//   LIQUIDITY_POOL_CONTRACT,
//   USDT_CONTRACT,
// } from '@/thirdweb/thirdwebConfig';
// import { NFTCollateralVaultABI } from '@/contracts/interfaces/NFTCollateralVault';
// import { LoanManagerABI } from '@/contracts/interfaces/LoanManager';
// import { LiquidationManagerABI } from '@/contracts/interfaces/LiquidationManager';
// import { USDTLiquidityPoolABI } from '@/contracts/interfaces/USDTLiquidityPool';
// import { MockUsdtABI } from '@/contracts/interfaces/mocUsdt';
// import { DMON_NFT_CONTRACT } from '@/contracts/interfaces/dmonNftAbi';
// import { usePublicClient } from '@/Components/privy/hooks/useWallet';
// import { getContract } from 'viem';

// export function useContracts() {
//   const { address } = useAccount();
//   const publicClient = usePublicClient();

//   // Create contract instances
//   const usdt = address
//     ? getContract({
//         address: USDT_CONTRACT as `0x${string}`,
//         abi: MockUsdtABI.abi,
//         publicClient,
//       })
//     : null;

//   const nftVault = address
//     ? getContract({
//         address: NFT_VAULT_CONTRACT as `0x${string}`,
//         abi: NFTCollateralVaultABI.abi,
//         publicClient,
//       })
//     : null;

//   const loanManager = address
//     ? getContract({
//         address: LOAN_MANAGER_CONTRACT as `0x${string}`,
//         abi: LoanManagerABI.abi,
//         publicClient,
//       })
//     : null;

//   const liquidationManager = address
//     ? getContract({
//         address: LIQUIDATION_MANAGER_CONTRACT as `0x${string}`,
//         abi: LiquidationManagerABI.abi,
//         publicClient,
//       })
//     : null;

//   const liquidityPool = address
//     ? getContract({
//         address: LIQUIDITY_POOL_CONTRACT as `0x${string}`,
//         abi: USDTLiquidityPoolABI.abi,
//         publicClient,
//       })
//     : null;

//   const dmonContract = address
//     ? getContract({
//         address: DMON_NFT_CONTRACT.address as `0x${string}`,
//         abi: DMON_NFT_CONTRACT.abi,
//         publicClient,
//       })
//     : null;

//   return {
//     usdt,
//     nftVault,
//     loanManager,
//     liquidationManager,
//     liquidityPool,
//     dmonContract,
//   };
// }
