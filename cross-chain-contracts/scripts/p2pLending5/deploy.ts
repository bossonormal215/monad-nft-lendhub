import { ethers } from 'hardhat';

async function main() {
  console.log('🚀 Deploying NFTLendHub, LendingPool, and LoanGovernance...');

  // real Monad Testnet token addresses
  const MON = '0x760AfE86e5de5fa0Ee542fc7B7B713e1c5425701'; // wMON token address
  const USDT = '0x88b8E2161DEDC77EF4ab7585569D2415a1C1055D'; //  USDT token address
  const ETH = '0xf817257fed379853cDe0fa4F97AB987181B1E5Ea'; // USDC token address
  const platformWallet = '0xED42844Cd35d734fec3B65dF486158C443896b41'; // USDC token address

  // Deploy NFTLendHub
  const NFTLendHub = await ethers.getContractFactory('NFTLendHub5_v2');
  const nftLendHub = await NFTLendHub.deploy(MON, USDT, ETH, platformWallet);
  await nftLendHub.waitForDeployment();
  const nftLendHubAddress = await nftLendHub.getAddress();
  console.log(`✅ NFTLendHub deployed at: ${nftLendHubAddress}`);

  // Deploy LendingPool
  const LendingPool = await ethers.getContractFactory('LendingPool');
  const lendingPool = await LendingPool.deploy(MON, USDT, ETH);
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
  //     constructorArguments: [MON, USDT, ETH, platformWallet],
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
// --network monadTestnet \
// 0xC0743c3C22801204245A884faaF65E3bFAD341Ca \
// [MON, USDT, ETH, platformWallet]
