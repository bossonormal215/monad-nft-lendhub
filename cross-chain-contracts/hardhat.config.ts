import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import dotenv from 'dotenv';
dotenv.config();

const config: HardhatUserConfig = {
  solidity: '0.8.28',
  networks: {
    monadTestnet: {
      url: process.env.MONAD_RPC_URL,
      accounts: [process.env.PRIVATE_KEY as string],
    },
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL,
      accounts: [process.env.PRIVATE_KEY as string],
    },
  },
};

export default config;
