import { ethers } from 'hardhat';
import { getContract, verifyOwner } from './contract-helper';

async function main() {
  const contract = await getContract();
  //  await verifyOwner(contract);

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

/*
  Current Functionality:
- Full NFT lending platform operational on Monad Testnet
- Wallet connection and network switching
- NFT minting with whitelist system
- NFT collateralization and USDT borrowing
- Liquidity provision system
- Clean and intuitive UI

Remaining Work:
1. Wormhole Bridge Integration:
   - Complete ETH bridging between Sepolia and Monad
   - Add transaction status tracking
   - Implement bridge security measures

2. Enhanced Features:
   - Basic points/rewards tracking
   - Automated liquidation system
   - Advanced points system with multipliers
   - Real-time price feeds
   - Transaction history
   - User dashboard improvements

3. Testing & Security:
   - Complete test coverage
   - Security audit preparations
   - Performance optimization

Blockers:
1. Technical Challenges:
   - Wormhole integration complexity
   - Cross-chain transaction handling
   - Price oracle implementation
   - Point Reward system

2. Resource Constraints:
   - Limited testing resources
   - Time constraints for security audit

 Requests for Assistance:
1. Technical Guidance:
   - Best practices for Wormhole integration
   - Optimal liquidation mechanisms
   - Price oracle implementation

2. Testing Support:
   - Access to additional testnet resources
   - Feedback on security measures
   
*/
