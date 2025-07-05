import { ethers } from 'hardhat';
import { Mission5NFT } from '../../typechain-types';

async function main() {
  // Update with your deployed contract address
  //   const MISSION5NFT_ADDRESS = '0xDEcC40b3F0F07A5088189fB2bB21fE1d74457cf2'; // 1
  //   const MISSION5NFT_ADDRESS = '0xCFe197Ad289BAdDF79B4deb7Ed0373d3f41D71bb'; // 2
  //   const MISSION5NFT_ADDRESS = '0x571E6f24d29BA6d1b17Ce2C391E6a2a7369DCC60'; // 3
  //   const MISSION5NFT_ADDRESS = '0x6f9A0feE5eE8175a09192668F35481dd42F33997'; // 4
  //   const MISSION5NFT_ADDRESS = '0x935e97913145856443D96BD2EC8Bb77Fe9Fa2057'; // 5
  // const MISSION5NFT_ADDRESS = '0x943A1995F8b39D785f10582A09Ac7922E8BC3FC4'; // 6
  // const MISSION5NFT_ADDRESS = '0x6D6E12949b12CdB95f9BACC1DfFE048CCa87EEd6'; // 7
  const MISSION5NFT_ADDRESS = '0x47d62aa2ca121e2E651C9591cfB1Bb9BF3172e33'; // 8

  // Get contract instance with correct type

  // Get contract instances
  const mission5NFT = await ethers.getContractAt(
    'Mission5NFT',
    MISSION5NFT_ADDRESS
  );

  const [owner] = await ethers.getSigners();

  console.log('Minting NFT to:', owner.address);
  const mintTx = await mission5NFT.connect(owner).mint(owner.address);
  const mintReceipt = await mintTx.wait();

  // Parse logs to find the Transfer event
  const iface = mission5NFT.interface;
  let tokenId = '0';
  for (const log of mintReceipt!.logs) {
    try {
      const parsed = iface.parseLog(log);
      if (parsed!.name === 'Transfer') {
        tokenId = parsed!.args.tokenId.toString();
        break;
      }
    } catch (e) {
      // Not a Transfer event, skip
    }
  }
  console.log(`Minted NFT with tokenId: ${tokenId}`);

  // Show URI when not locked
  let uri = await mission5NFT.tokenURI(tokenId);
  console.log('Unlocked tokenURI:\n', uri);

  // Lock the NFT (owner is lockManager)
  const duration = 60 * 60 * 24; // 1 day
  const lockTx = await mission5NFT
    .connect(owner)
    .lock(tokenId, owner.address, duration);
  await lockTx.wait();
  console.log(`Locked tokenId ${tokenId} for ${duration} seconds`);

  // Show URI when locked
  uri = await mission5NFT.tokenURI(tokenId);
  console.log('Locked tokenURI:\n', uri);
}

main()
  .then(() => {
    console.log('\n✅ Mint and lock interaction complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Mint/lock interaction failed:', error);
    process.exit(1);
  });
