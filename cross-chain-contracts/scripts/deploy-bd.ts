/*const { ethers } = require('hardhat');

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log('Deploying contracts with:', deployer.address);

  const USDT = await ethers.getContractFactory('MockUSDT');
  const usdt = await USDT.deploy();
  await usdt.waitForDeployment()
  console.log('USDT deployed to:', usdt.address);

  const NFTVault = await ethers.getContractFactory('NFTCollateralVault');
  const vault = await NFTVault.deploy();
  console.log('NFT Vault deployed to:', vault.address);

  const LoanManager = await ethers.getContractFactory('LoanManager');
  const loanManager = await LoanManager.deploy(usdt.address, vault.address);
  console.log('LoanManager deployed to:', loanManager.address);

  const LiquidationManager = await ethers.getContractFactory(
    'LiquidationManager'
  );
  const liquidationManager = await LiquidationManager.deploy(
    usdt.address,
    vault.address,
    '0xPythOracleAddress'
  );
  console.log('LiquidationManager deployed to:', liquidationManager.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
*/

////////////////////////////////////////////
/*
const { ethers } = require('hardhat');

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log('Deploying contracts with:', deployer.address);

  // Deploy Mock USDT
  const MockUSDT = await ethers.getContractFactory('MockUSDT');
  const usdt = await MockUSDT.deploy();
  // await usdt.deployed();
  await usdt.waitForDeployment();
  const UsdtAddress = await usdt.getAddress();
  console.log('USDT deployed to:', UsdtAddress);

  // Deploy USDT Liquidity Pool
  const USDTLiquidityPool = await ethers.getContractFactory(
    'USDTLiquidityPool'
  );
  console.log(`Deploying USDTLiquidityPool contract!!!!!!!!!!!`);
  const liquidityPool = await USDTLiquidityPool.deploy(UsdtAddress);
  // await liquidityPool.deployed();
  await liquidityPool.waitForDeployment();
  const liquidityPoolAddress = await liquidityPool.getAddress();
  console.log('USDT Liquidity Pool deployed to:', liquidityPoolAddress);

  // Deploy NFT Vault
  const NFTCollateralVault = await ethers.getContractFactory(
    'NFTCollateralVault'
  );
  console.log(`Deploying NFTCollateralVault contract!!!!!!!!!!!`);
  const vault = await NFTCollateralVault.deploy();
  // await vault.deployed();
  await vault.waitForDeployment();
  const vaultAddress = await vault.getAddress();
  console.log('NFT Vault deployed to:', vaultAddress);

  // Deploy Loan Manager
  const LoanManager = await ethers.getContractFactory('LoanManager');
  console.log(`Deploying LoanManager contract!!!!!!!!!!!`);
  const loanManager = await LoanManager.deploy(
    UsdtAddress,
    vaultAddress,
    liquidityPoolAddress
  );
  
  await loanManager.waitForDeployment();
  const loanManagerAddress = await loanManager.getAddress();
  console.log('LoanManager deployed to:', loanManagerAddress);

  // Deploy Liquidation Manager
  const LiquidationManager = await ethers.getContractFactory(
    'LiquidationManager'
  );
  console.log(`Deploying LiquidationManager contract!!!!!!!!!!!`);
  const liquidationManager = await LiquidationManager.deploy(
    UsdtAddress,
    vaultAddress,
    liquidityPoolAddress
  );
  // await liquidationManager.deployed();
  await liquidationManager.waitForDeployment();
  const liquidationManagerAddress = await liquidationManager.getAddress();
  console.log('LiquidationManager deployed to:', liquidationManagerAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
*/

////////////////////////////////////////////
const { ethers } = require('hardhat');

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log('Deploying contracts with:', deployer.address);

  // Deploy Mock USDT
  const MockUSDT = await ethers.getContractFactory('MockUSDT');
  const usdt = await MockUSDT.deploy();
  await usdt.waitForDeployment();
  const UsdtAddress = await usdt.getAddress();
  console.log('USDT deployed to:', UsdtAddress);

  // Deploy DMONNFT
  const DmonNFT = await ethers.getContractFactory('DmonNFT');
  const dmonNFT = await DmonNFT.deploy(UsdtAddress);
  await dmonNFT.waitForDeployment();
  const DmonNFTAddress = await dmonNFT.getAddress();
  console.log('DMON NFT deployed to:', DmonNFTAddress);
  // const DmonNFTAddress = '0xCC133Be7950d9c00B78BCbFa470A8E63c3DD7BfC'; // Example NFT Collection
  // const nftContract = await ethers.getContractAt('DmonNFT', DmonNFTAddress);

  // configure DmonNFT to be able to call whitelist user on MockUsdt
  await usdt.setNFTContract(DmonNFTAddress);
  console.log('Configured DMONNft to whitelist user...');

  // Iniitial whitelist to let deployer to mintNFT
  await dmonNFT.addToWhitelist([deployer.address]);

  // Deploy USDT Liquidity Pool
  const USDTLiquidityPool = await ethers.getContractFactory(
    'USDTLiquidityPool'
  );
  console.log(`Deploying USDTLiquidityPool contract...`);
  const liquidityPool = await USDTLiquidityPool.deploy(UsdtAddress);
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
  const LoanManager = await ethers.getContractFactory('LoanManager');
  console.log(`Deploying LoanManager contract...`);
  const loanManager = await LoanManager.deploy(
    UsdtAddress,
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

  // 2. Whitelist DMONNFT contract in NFT Vault (replace with your NFT contract address)
  // const DMONNFT_ADDRESS = '0xFd6E4CF0FC697236b359ac67701B8D1dFe82D301'; // devnet
  // const DMONNFT_ADDRESS = '0xb14580f95375b097d229EF4fBe330Dc9866e6CFe'; // testnet
  // const DMONNFT_ADDRESS = DmonNFTAddress; // testnet
  const whitelistNFTTx = await vault.whitelistNFT(DmonNFTAddress);
  await whitelistNFTTx.wait();
  console.log('DMONNFT whitelisted in NFT Vault');

  // 3. Set up mock USDT for testing
  const mintAmount = ethers.parseUnits('1000000', 18); // 1 million USDT
  const mintTx = await usdt.mint(deployer.address, mintAmount);
  await mintTx.wait();
  console.log('Minted test USDT to deployer');

  // Log all deployed addresses for frontend configuration
  console.log('\nDeployed Contract Addresses:');
  console.log('--------------------');
  console.log('USDT:', UsdtAddress);
  console.log('DMONNFT:', DmonNFTAddress);
  console.log('LiquidityPool:', liquidityPoolAddress);
  console.log('NFTVault:', vaultAddress);
  console.log('LoanManager:', loanManagerAddress);
  console.log('LiquidationManager:', liquidationManagerAddress);

  // Verify contract addresses are correctly set
  console.log('\nVerifying contract connections...');

  const loanManagerUSDT = await loanManager.usdt();
  const loanManagerVault = await loanManager.nftVault();
  const loanManagerPool = await loanManager.liquidityPool();

  console.log(
    'LoanManager USDT address matches:',
    loanManagerUSDT === UsdtAddress
  );
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
