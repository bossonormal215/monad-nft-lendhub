import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import dotenv from 'dotenv';
dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.28',
    settings: {
      viaIR: true,
      optimizer: {
        enabled: true,
        runs: 200, // You can adjust the number of runs as needed
      },
    },
  },
  networks: {
    monadTestnet: {
      // url: process.env.MONAD_RPC_URL,
      url: process.env.PUBLIC_MONAD_RPC_URL,
      accounts: [process.env.PRIVATE_KEY as string],
    },
    sepolia: {
      // url: process.env.SEPOLIA_RPC_URL,
      url: process.env.PUBLIC_MONAD_RPC_URL,
      accounts: [process.env.PRIVATE_KEY as string],
    },
  },

  sourcify: {
    enabled: true,
    apiUrl: 'https://sourcify-api-monad.blockvision.org',
    browserUrl: 'https://testnet.monadexplorer.com',
  },
  etherscan: {
    enabled: false,
  },
};

export default config;
