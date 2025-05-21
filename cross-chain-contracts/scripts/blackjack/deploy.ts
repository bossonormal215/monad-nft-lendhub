import { ethers } from 'hardhat';

async function main() {
  console.log('🚀 Deploying Blackjack...');

  // Pyth Entropy contract address for Monad Testnet
  const PYTH_ENTROPY = '0x36825bf3Fbdf5a29E2d5148bfe7Dcf7B5639e320';
  const PROVIDER = '0x6CC14824Ea2918f5De5C2f75A9Da968ad4BD6344';

  // Deploy Blackjack
  const Blackjack = await ethers.getContractFactory('Blackjack');
  const blackjack = await Blackjack.deploy(PYTH_ENTROPY, PROVIDER);
  await blackjack.waitForDeployment();
  const blackjackAddress = await blackjack.getAddress();
  console.log(`✅ Blackjack deployed at: ${blackjackAddress}`);

  console.log('\n🎉 Blackjack contract deployed successfully!');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
