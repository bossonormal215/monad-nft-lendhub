const { ethers } = require('hardhat');

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log('Deploying contracts with:', deployer.address);

  const nftContractVaultAddress = '0x291f04af2132110083D2C7d73845Fb11Fe8d810a';
  const AnimeLady = '0x4ed897f597890ac80f6da0f1ba3240c193bdc1f5';

  console.log('Getting contract instance...');
  const vault = await ethers.getContractAt(
    'NFTCollateralVault',
    nftContractVaultAddress
  );
  console.log('Contract instance obtained.');

  console.log(`Whitelisting NFT: ${AnimeLady}...`);
  const whitelistNFTTx = await vault.whitelistNFT(AnimeLady);
  console.log(`Transaction sent: ${whitelistNFTTx.hash}`);

  console.log('Waiting for confirmation...');
  await whitelistNFTTx.wait();
  console.log('DMONNFT whitelisted in NFT Vault');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
