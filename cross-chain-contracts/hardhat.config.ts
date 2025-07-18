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
      accounts: [
        process.env.PRIVATE_KEY as string,
        process.env.PRIVATE_KEY_2 as string,
        process.env.PRIVATE_KEY_3 as string,
      ].filter(Boolean), // Remove any undefined values
    },
    sepolia: {
      // url: process.env.SEPOLIA_RPC_URL,
      url: process.env.PUBLIC_MONAD_RPC_URL,
      accounts: [
        process.env.PRIVATE_KEY as string,
        process.env.PRIVATE_KEY_2 as string,
        process.env.PRIVATE_KEY_3 as string,
      ].filter(Boolean), // Remove any undefined values
    },
    somnia: {
      url: process.env.PUBLIC_SOMNIA_RPC_URL,
      accounts: [
        process.env.PRIVATE_KEY as string,
        process.env.PRIVATE_KEY_2 as string,
        process.env.PRIVATE_KEY_3 as string,
      ].filter(Boolean), // Remove any undefined values
    },
  },

  sourcify: {
    enabled: true,
    apiUrl: 'https://sourcify-api-monad.blockvision.org',
    browserUrl: 'https://testnet.monadexplorer.com',
  },
  etherscan: {
    enabled: true,
    apiKey: {
      "somnia-testnet": "dummy" // Somnia doesn't require an API key
    },
    customChains: [
      {
        network: "somnia-testnet",
        chainId: 50312,
        urls: {
          apiURL: "https://somnia.w3us.site/api",
          browserURL: "https://somnia.w3us.site"
        }
      }
    ]
  },
};

export default config;
