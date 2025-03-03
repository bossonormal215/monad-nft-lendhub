import { ethers } from 'hardhat';
import { getContract, verifyOwner } from './contract-helper';

async function main() {
  const contract = await getContract();
  //   await verifyOwner(contract);

  console.log('Current contract state:');
  console.log('Public sale active:', await contract.isPublicSaleActive());
  console.log('Presale active:', await contract.isPresaleActive());
  console.log('Revealed:', await contract.isRevealed());

  // Toggle public sale

  /*
  console.log('\nToggling public sale...');
  const tx1 = await contract.togglePublicSale();
  await tx1.wait();
  console.log('Public sale toggled');
  */

  // Toggle presale

  console.log('\nToggling presale...');
  const tx2 = await contract.togglePresale();
  await tx2.wait();
  console.log('Presale toggled');

  console.log('\nUpdated contract state:');
  console.log('Public sale active:', await contract.isPublicSaleActive());
  console.log('Presale active:', await contract.isPresaleActive());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
