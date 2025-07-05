import { ethers } from 'hardhat';

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log('Deploying contracts with the account:', deployer.address);

  const Mission5NFT = await ethers.getContractFactory('Mission5NFT');
  const mission5NFT = await Mission5NFT.deploy();
  await mission5NFT.waitForDeployment();
  const address = await mission5NFT.getAddress();

  console.log('Mission5NFT deployed to:', address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
