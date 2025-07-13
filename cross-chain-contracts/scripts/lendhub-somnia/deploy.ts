import { ethers } from 'hardhat';

async function main() {
  console.log('🚀 Deploying NFTLendHub, LendingPool, and LoanGovernance...');

  // real somniia Testnet token addresses
  const STT = '0x4A3BC48C156384f9564Fd65A53a2f3D534D8f2b7'; // wSTT token address
  const USDT = '0x65296738D4E5edB1515e40287B6FDf8320E6eE04'; //  USDT token address
  const USDC = '0xE9CC37904875B459Fa5D0FE37680d36F1ED55e38'; // USDC token address
  const platformWallet = '0xED42844Cd35d734fec3B65dF486158C443896b41'; // USDC token address

  // Deploy NFTLendHub
  const NFTLendHub = await ethers.getContractFactory('Lendhub_somnia');
  const nftLendHub = await NFTLendHub.deploy(STT, USDT, USDC, platformWallet);
  await nftLendHub.waitForDeployment();
  const nftLendHubAddress = await nftLendHub.getAddress();
  console.log(`✅ NFTLendHub deployed at: ${nftLendHubAddress}`);

  // Deploy LendingPool
  const LendingPool = await ethers.getContractFactory('LendingPool');
  const lendingPool = await LendingPool.deploy(STT, USDT, USDC);
  await lendingPool.waitForDeployment();
  console.log(`✅ LendingPool deployed at: ${await lendingPool.getAddress()}`);

  // Deploy LoanGovernance
  const LoanGovernance = await ethers.getContractFactory('LoanGovernance');
  const loanGovernance = await LoanGovernance.deploy();
  await loanGovernance.waitForDeployment();
  console.log(
    `✅ LoanGovernance deployed at: ${await loanGovernance.getAddress()}`
  );

  console.log('\n🎉 All contracts deployed successfully!');

  // Verify the contract
  console.log('Start verifying contract...');
  // try {
  //   await hre.run('verify:verify', {
  //     address: nftLendHubAddress,
  //     constructorArguments: [STT, USDT, USDC, platformWallet],
  //   });
  //   console.log('Successfully verified contract.');
  // } catch (error) {
  //   console.log('Verify contract failed:', error);
  // }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

// npx hardhat verify \
// --network somnia \
// 0xC0743c3C22801204245A884faaF65E3bFAD341Ca \
// [STT, USDT, USDC, platformWallet]
