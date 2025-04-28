const { ethers } = require('hardhat');

async function main() {
  const factory = await ethers.getContractFactory('OnchainTamagotchi');
  const deployedFactory = await factory.deploy();
  await deployedFactory.waitForDeployment();
  const deployedFactoryAddress = await deployedFactory.getAddress();
  console.log('Address: ', deployedFactoryAddress);
  /*
  const bytecodeSize = Buffer.byteLength(deployedContract.bytecode, 'hex') / 2;
  console.log(`Contract size: ${bytecodeSize} bytes`);
*/

  const bytecode = factory.bytecode;
  const sizeInBytes = bytecode.length / 2 - 1; // hex string with "0x" prefix
  console.log(`📦 Bytecode size: ${sizeInBytes} bytes`);
}
main();
