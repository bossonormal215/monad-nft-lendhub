import { ethers } from 'hardhat';

async function main() {
  const Tipping = await ethers.getContractFactory('Tipping');
  const tipping = await Tipping.deploy();
  await tipping.waitForDeployment();
  console.log(`Tipping deployed at: ${await tipping.getAddress()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
