const { ethers } = require('hardhat');

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log('Deploying contracts with:', deployer.address);

  // Deploy USDT Liquidity Pool
  const LiquidityPool = await ethers.getContractFactory('LiquidityPool2');
  console.log(`Deploying USDTLiquidityPool contract...`);
  const liquidityPool = await LiquidityPool.deploy();
  await liquidityPool.waitForDeployment();
  const liquidityPoolAddress = await liquidityPool.getAddress();
  console.log('USDT Liquidity Pool deployed to:', liquidityPoolAddress);

  // Deploy NFT Vault
  const NFTCollateralVault = await ethers.getContractFactory(
    'NFTCollateralVault'
  );
  console.log(`Deploying NFTCollateralVault contract...`);
  const vault = await NFTCollateralVault.deploy();
  await vault.waitForDeployment();
  const vaultAddress = await vault.getAddress();
  console.log('NFT Vault deployed to:', vaultAddress);

  // Deploy Loan Manager
  const LoanManager = await ethers.getContractFactory('LoanManager2');
  console.log(`Deploying LoanManager contract...`);
  const loanManager = await LoanManager.deploy(
    vaultAddress,
    liquidityPoolAddress
  );
  await loanManager.waitForDeployment();
  const loanManagerAddress = await loanManager.getAddress();
  console.log('LoanManager deployed to:', loanManagerAddress);
  // set LoanManager in nftvault for nft transfer
  await vault.setLoanManager(loanManagerAddress);

  // Deploy Liquidation Manager
  const LiquidationManager = await ethers.getContractFactory(
    'LiquidationManager'
  );
  console.log(`Deploying LiquidationManager contract...`);
  const liquidationManager = await LiquidationManager.deploy(
    vaultAddress,
    loanManagerAddress,
    liquidityPoolAddress
  );
  await liquidationManager.waitForDeployment();
  const liquidationManagerAddress = await liquidationManager.getAddress();
  console.log('LiquidationManager deployed to:', liquidationManagerAddress);

  // Set up permissions and connections
  console.log('Setting up contract permissions...');

  // 1. Transfer ownership of LiquidityPool to LoanManager
  const transferLiquidityPoolTx = await liquidityPool.transferOwnership(
    loanManagerAddress
  );
  await transferLiquidityPoolTx.wait();
  console.log('LiquidityPool ownership transferred to LoanManager');

  const whitelistNFTTx = await vault.whitelistNFT(
    '0x48724834cEb86E79AC8f0E861d8176c5fa324A6D'
  );
  await whitelistNFTTx.wait();
  console.log('DMONNFT whitelisted in NFT Vault');

  // Log all deployed addresses for frontend configuration
  console.log('\nDeployed Contract Addresses:');
  console.log('--------------------');
  console.log('LiquidityPool:', liquidityPoolAddress);
  console.log('NFTVault:', vaultAddress);
  console.log('LoanManager:', loanManagerAddress);
  console.log('LiquidationManager:', liquidationManagerAddress);

  // Verify contract addresses are correctly set
  console.log('\nVerifying contract connections...');

  const loanManagerVault = await loanManager.nftVault();
  const loanManagerPool = await loanManager.liquidityPool();

  console.log(
    'LoanManager NFTVault address matches:',
    loanManagerVault === vaultAddress
  );
  console.log(
    'LoanManager LiquidityPool address matches:',
    loanManagerPool === liquidityPoolAddress
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
