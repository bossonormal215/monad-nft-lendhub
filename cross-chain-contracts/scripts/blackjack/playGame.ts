import { config as dotenvConfig } from 'dotenv';
import { ethers } from 'hardhat';
import { Contract, BigNumberish } from 'ethers';
import { randomBytes } from 'crypto';

// Load environment variables
dotenvConfig();

// Contract address and provider address (from your deploy script)
const BLACKJACK_ADDRESS = '0xF29C40105C9527722a737b1230d85A83795597e6';
const PROVIDER_ADDRESS = '0x6CC14824Ea2918f5De5C2f75A9Da968ad4BD6344';

// Minimal ABI for the Blackjack contract
const BLACKJACK_ABI = [
  'function startGame(bytes32 userRandomNumber) external payable',
  'function drawCard(bytes32 userRandomNumber) external payable',
  'function getGameState(address player) external view returns (uint8[] memory, uint8, bool, bool, uint256)',
  'function getFee() external view returns (uint128)',
  'function resetGame() external',
];

// Generate a random bytes32 userRandomNumber
const generateUserRandomNumber = (): string => {
  return '0x' + randomBytes(32).toString('hex');
};

async function main() {
  // Get signer
  const [signer] = await ethers.getSigners();
  console.log(`🚀 Connected to Blackjack at ${BLACKJACK_ADDRESS}`);
  console.log(`👤 Signer address: ${signer.address}`);
  // Check signer balance
  const balance = await signer.provider?.getBalance(signer.address);
  console.log(`💰 Signer balance: ${ethers.formatEther(balance)} MON`);

  // Get contract instance using minimal ABI
  const contract: Contract = await ethers.getContractAt(
    BLACKJACK_ABI,
    BLACKJACK_ADDRESS,
    signer
  );

  // Helper function to get Pyth Entropy fee
  const getFee = async (): Promise<bigint> => {
    const fee: bigint = await contract.getFee();
    return fee;
  };

  // Reset game state (if function exists in contract)
  const resetGame = async (): Promise<void> => {
    console.log('\n🔄 Resetting game state...');
    try {
      const tx = await contract.resetGame({ gasLimit: 500_000 });
      console.log(`⏳ Transaction sent: ${tx.hash}`);
      await tx.wait();
      console.log('✅ Game state reset!');
    } catch (error: any) {
      console.error('❌ Error resetting game:', error.message);
      throw error;
    }
  };

  // Start a new game
  const startGame = async (): Promise<void> => {
    console.log('\n🎮 Starting a new game...');
    const userRandomNumber: string = generateUserRandomNumber();
    const fee: BigNumberish = await getFee();
    // const fee: bigint = ethers.parseEther('0.1'); // Example: 0.01 MON
    // console.log(`  Fee: ${ethers.formatEther(fee).toString()}`);
    console.log(`  Fee: ${fee.toString()}`);
    console.log(`  User Random Number: ${userRandomNumber}`);
    const betAmount = ethers.parseEther('1'); // Example: 1 Ether
    console.log(`  Bet Amount: ${betAmount.toString()}`);
    // const totalAmount = ethers.formatEther(fee) + ethers.formatEther(betAmount);
    const totalAmount = fee + betAmount;
    console.log(`  Total Amount: ${totalAmount.toString()}`);

    try {
      const tx = await contract.startGame(userRandomNumber, {
        value: totalAmount,
        gasLimit: 500_000, // Adjust based on network
      });
      console.log(`⏳ Transaction sent: ${tx.hash}`);
      await tx.wait();
      console.log('✅ Game started!');
    } catch (error: any) {
      console.error('❌ Error starting game:', error.message);
      throw error;
    }
  };

  // Draw a card
  const drawCard = async (): Promise<void> => {
    console.log('\n🃏 Drawing a card...');
    const userRandomNumber: string = generateUserRandomNumber();
    const fee: BigNumberish = await getFee();
    // const fee: bigint = ethers.parseEther('0.01'); // Example: 0.01 MON

    try {
      const tx = await contract.drawCard(userRandomNumber, {
        value: fee,
        gasLimit: 500_000, // Adjust based on network
      });
      console.log(`⏳ Transaction sent: ${tx.hash}`);
      await tx.wait();
      console.log('✅ Card drawn!');
    } catch (error: any) {
      console.error('❌ Error drawing card:', error.message);
      throw error;
    }
  };

  // Get game state
  const getGameState = async (): Promise<void> => {
    console.log('\n📊 Fetching game state...');
    try {
      const [cards, sum, isAlive, hasBlackjack, chips]: [
        number[],
        number,
        boolean,
        boolean,
        bigint
      ] = await contract.getGameState(signer.address);
      console.log('Game State:');
      console.log(`  Cards: ${cards.join(', ')}`);
      console.log(`  Sum: ${sum}`);
      console.log(`  Is Alive: ${isAlive}`);
      console.log(`  Has Blackjack: ${hasBlackjack}`);
      console.log(`  Chips: ${chips.toString()}`);
    } catch (error: any) {
      console.error('❌ Error fetching game state:', error.message);
      throw error;
    }
  };

  // Execute interactions
  try {
    // Check initial game state
    await getGameState();

    // Reset game state (if function exists in contract)
    await resetGame();

    // Start a new game
    await startGame();
    // Wait for Pyth Entropy callback (adjust delay as needed)
    await new Promise((resolve) => setTimeout(resolve, 10_000)); // 10 seconds
    await getGameState();

    // Draw a card
    await drawCard();
    await new Promise((resolve) => setTimeout(resolve, 10_000)); // 10 seconds
    await getGameState();
  } catch (error: any) {
    console.error('❌ Interaction failed:', error.message);
    throw error;
  }
}

main()
  .then(() => {
    console.log('\n🎉 Interaction complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
