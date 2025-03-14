// const { ethers } = require('hardhat');
import { ethers } from 'hardhat';
import axios from 'axios';
// const { DmonNFT } = require('../../typechain-types');

const DEPLOYED_CONTRACT_ADDRESS = '0x48724834cEb86E79AC8f0E861d8176c5fa324A6D'; // monad testnet
// const DEPLOYED_CONTRACT_ADDRESS = '0xFd6E4CF0FC697236b359ac67701B8D1dFe82D301'; // monad devnet
// const DEPLOYED_CONTRACT_ADDRESS = '0x6c5006D7aC2e255f60C154DFEE9150BCE94C4C38'; // monad devnet with pyth

async function getContract() {
  // No type annotations in JavaScript
  const contract = await ethers.getContractAt(
    // 'GMonad', // Correct contract name the one with pyth
    'DmonNFT',
    DEPLOYED_CONTRACT_ADDRESS
  );
  return contract;
}

async function verifyOwner() {
  const [signer] = await ethers.getSigners();
  const contract = await ethers.getContractAt(
    // 'GMonad', // Correct contract name the one with pyth
    'DmonNFT',
    DEPLOYED_CONTRACT_ADDRESS
  );
  const owner = await contract.owner();
  if (owner.toLowerCase() !== signer.address.toLowerCase()) {
    throw new Error('Signer is not the contract owner');
  }
}

async function fetchPriceUpdate() {
  const priceFeedId =
    '0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace';
  const url = `https://hermes.pyth.network/v2/updates/price/latest?&ids[]=${priceFeedId}`;

  try {
    const response = await axios.get(url);
    const priceUpdateData = response.data.binary.data[0]; // Extract the first element from the data array

    // Write the price update data to a file
    const fs = require('fs');
    fs.writeFileSync('price_update.txt', priceUpdateData, { encoding: 'utf8' });

    console.log('Price update data saved to price_update.txt');
  } catch (error) {
    console.error('Error fetching price update:', error);
  }
}

module.exports = {
  getContract,
  verifyOwner,
  fetchPriceUpdate,
  DEPLOYED_CONTRACT_ADDRESS,
}; // Export for use in other files
