import { ethers } from 'hardhat';
import { bigint } from 'hardhat/internal/core/params/argumentTypes';

async function delay(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

async function main() {
  const [player] = await ethers.getSigners();
  const BLACKJACK_ADDRESS = '0x3B10B843514659b386F3C33E541c382FdeE8Ed60'; // replace!
  const blackjack = await ethers.getContractAt('Blackjack3', BLACKJACK_ADDRESS);

  const fee = await blackjack.getFee();
  const bet = ethers.parseEther('2'); // 2 MON
  const total = fee + bet;

  const gameState = await blackjack.getGameState(player.address);
  const [cards, sum, isAlive, hasBlackjack] = gameState;

  if (!isAlive) {
    console.log(
      `-----------------------Starting a new game with bet: ${ethers.formatEther(
        bet
      )} MON---------------------------`
    );
    const random1 = ethers.hexlify(ethers.randomBytes(32));
    console.log('random1', random1);
    const startTx = await blackjack.startGame(random1, { value: total });
    await startTx.wait();
    console.log(
      '-------------------------------Game started! Waiting 15 seconds for randomness callback...-----------------'
    );
    await delay(15000);
  }

  console.log(
    '------------------------------Game state:------------------------------------------'
  );

  console.log(`Cards: ${cards}`);
  console.log(`Sum: ${sum}, `);
  console.log(`Alive: ${isAlive}`);
  console.log(`Blackjack: ${hasBlackjack}`);

  if (isAlive && !hasBlackjack) {
    console.log(
      '-------------------------------Drawing a new card...---------------------------------'
    );
    const random2 = ethers.hexlify(ethers.randomBytes(32));
    const drawTx = await blackjack.drawCard(random2, { value: fee });
    await drawTx.wait();
    console.log('--------Card drawn. Waiting for callback...---------------');
    await delay(15000);
  }

  const finalState = await blackjack.getGameState(player.address);
  const [finalCards, finalSum, finalAlive, finalBlackjack] = finalState;
  console.log(`Final Cards: ${finalCards}`);
  console.log(`Final Sum: ${finalSum}`);
  console.log(` Blackjack: ${finalBlackjack}`);
  console.log(` Alive: ${finalAlive}`);

  // Chip balance
  const chips = await blackjack.chips(player.address);
  console.log(`Chip Balance: ${chips}`);

  // Try transfer
  const accounts = await ethers.getSigners();
  if (accounts.length > 1) {
    const to = accounts[1].address;
    const transferAmount = 100;
    const tx = await blackjack.transferChips(to, transferAmount);
    await tx.wait();
    console.log(`Transferred ${transferAmount} chips to ${to}`);
  }

  // Spend chips
  //   const spendTx = await blackjack.spendChips(50);
  //   await spendTx.wait();
  //   console.log('Spent 50 chips');

  // Mint NFT (if eligible)
  const canMint = (await blackjack.chips(player.address)) >= 10000;
  if (canMint) {
    const nftTx = await blackjack.mintNFT();
    await nftTx.wait();
    console.log('NFT minted!');
  } else {
    console.log('Not enough chips to mint NFT.');
  }

  // Top players
  const top = await blackjack.getTopPlayers(5);
  console.log('🏆 Top Players:');
  //   top.top.forEach((addr, i) => {
  //     console.log(`${i + 1}. ${addr} - ${top.scores[i]} chips`);
  //   });
  console.table(
    top.top.map((addr, i) => ({
      Rank: i + 1,
      Address: addr,
      Chips: top.scores[i].toString(),
    }))
  );

  if (!finalAlive) {
    if (finalSum === BigInt(21)) {
      console.log('🎉 Blackjack! You win!');
    } else if (finalSum > 21) {
      console.log('💥 Busted!');
    } else {
      console.log('😐 Game ended.');
    }
  }

  // Optionally reset if needed
  const [, , stillAlive] = await blackjack.getGameState(player.address);
  if (!stillAlive) {
    await (await blackjack.resetGame()).wait();
    console.log('Game reset.');
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
