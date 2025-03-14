import { ethers } from 'hardhat';
// import { getContract } from '@/contract-helper';

async function main() {
  const DmonNFTAddress = '0x0151A8659004aAFbF5B53a31b7b428aC82b5d8bc';
  const contract = await ethers.getContractAt('DmonNFT', DmonNFTAddress);
  //   const contract = await getContract();
  //  await verifyOwner(contract);

  console.log('Current contract state:');
  console.log('Public sale active:', await contract.isPublicSaleActive());
  console.log('Presale active:', await contract.isPresaleActive());
  console.log('Revealed:', await contract.isRevealed());
  console.log('whiteliat mint price:', await contract.WhitelistMintPrice());
  console.log('MAX SUPPLY:', await contract.MAX_SUPPLY());
  console.log('TOTAL SUPPLY:', await contract.totalSupply());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
