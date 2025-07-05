import { ethers } from 'hardhat';
import { expect } from 'chai';
import { Mission5NFT } from '../typechain-types';

describe('Mission5NFT Lock/Unlock', function () {
  let nft: Mission5NFT;
  let owner: any;
  let user: any;

  beforeEach(async () => {
    [owner, user] = await ethers.getSigners();
    const Mission5NFTFactory = await ethers.getContractFactory('Mission5NFT');
    nft = (await Mission5NFTFactory.deploy()) as Mission5NFT;
    await nft.waitForDeployment();
  });

  it('should mint, lock, and unlock NFT correctly', async function () {
    // Mint NFT to owner
    const mintTx = await nft.connect(owner).mint(owner.address);
    const receipt = await mintTx.wait();
    const tokenId = 0;
    expect(await nft.ownerOf(tokenId)).to.equal(owner.address);
    expect(await nft.isLocked(tokenId)).to.equal(false);

    // Check unlocked tokenURI
    const unlockedUri = await nft.tokenURI(tokenId);
    console.log('Unlocked tokenURI:', unlockedUri);
    
    // Decode and validate unlocked metadata
    const unlockedMetadata = decodeTokenURI(unlockedUri);
    expect(unlockedMetadata.name).to.equal('Monad Monanimal #0');
    expect(unlockedMetadata.attributes[0].value).to.equal('Unlocked');
    expect(unlockedMetadata.attributes[1].value).to.equal('None');
    expect(unlockedMetadata.description).to.include('unlocked and fully accessible');

    // Lock NFT with owner as manager
    const duration = 60 * 60 * 24; // 1 day
    await expect(
      nft.connect(owner).lock(tokenId, owner.address, duration)
    ).to.emit(nft, 'Locked');
    expect(await nft.isLocked(tokenId)).to.equal(true);

    // Check locked tokenURI
    const lockedUri = await nft.tokenURI(tokenId);
    console.log('Locked tokenURI:', lockedUri);
    
    // Decode and validate locked metadata
    const lockedMetadata = decodeTokenURI(lockedUri);
    expect(lockedMetadata.name).to.equal('Monad Monanimal #0');
    expect(lockedMetadata.attributes[0].value).to.equal('Locked');
    expect(lockedMetadata.attributes[1].value).to.equal(owner.address.toLowerCase());
    expect(lockedMetadata.description).to.include('currently locked and managed');

    // Try to transfer (should fail)
    await expect(
      nft.connect(owner).transferFrom(owner.address, user.address, tokenId)
    ).to.be.revertedWith('NFT is locked');

    // Try to unlock as non-manager (should fail)
    await expect(nft.connect(user).unlock(tokenId)).to.be.revertedWith(
      'Not authorized manager'
    );

    // Unlock as manager (owner)
    await expect(nft.connect(owner).unlock(tokenId)).to.emit(nft, 'Unlocked');
    expect(await nft.isLocked(tokenId)).to.equal(false);

    // Check unlocked tokenURI again
    const unlockedUri2 = await nft.tokenURI(tokenId);
    const unlockedMetadata2 = decodeTokenURI(unlockedUri2);
    expect(unlockedMetadata2.attributes[0].value).to.equal('Unlocked');

    // Now transfer should succeed
    await nft.connect(owner).transferFrom(owner.address, user.address, tokenId);
    expect(await nft.ownerOf(tokenId)).to.equal(user.address);
  });

  it('should have valid JSON metadata for both locked and unlocked states', async function () {
    // Mint NFT
    const mintTx = await nft.connect(owner).mint(owner.address);
    const receipt = await mintTx.wait();
    const tokenId = 0;

    // Test unlocked metadata
    const unlockedUri = await nft.tokenURI(tokenId);
    const unlockedMetadata = decodeTokenURI(unlockedUri);
    
    // Validate unlocked metadata structure
    expect(unlockedMetadata).to.have.property('name');
    expect(unlockedMetadata).to.have.property('description');
    expect(unlockedMetadata).to.have.property('image');
    expect(unlockedMetadata).to.have.property('attributes');
    expect(unlockedMetadata.attributes).to.be.an('array');
    expect(unlockedMetadata.attributes).to.have.length(3);
    
    // Validate unlocked attributes
    const statusAttr = unlockedMetadata.attributes.find((attr: any) => attr.trait_type === 'Status');
    const managerAttr = unlockedMetadata.attributes.find((attr: any) => attr.trait_type === 'Manager');
    const tokenIdAttr = unlockedMetadata.attributes.find((attr: any) => attr.trait_type === 'Token ID');
    
    expect(statusAttr?.value).to.equal('Unlocked');
    expect(managerAttr?.value).to.equal('None');
    expect(tokenIdAttr?.value).to.equal('0');

    // Lock NFT
    const duration = 60 * 60 * 24; // 1 day
    await nft.connect(owner).lock(tokenId, owner.address, duration);

    // Test locked metadata
    const lockedUri = await nft.tokenURI(tokenId);
    const lockedMetadata = decodeTokenURI(lockedUri);
    
    // Validate locked metadata structure
    expect(lockedMetadata).to.have.property('name');
    expect(lockedMetadata).to.have.property('description');
    expect(lockedMetadata).to.have.property('image');
    expect(lockedMetadata).to.have.property('attributes');
    expect(lockedMetadata.attributes).to.be.an('array');
    expect(lockedMetadata.attributes).to.have.length(3);
    
    // Validate locked attributes
    const lockedStatusAttr = lockedMetadata.attributes.find((attr: any) => attr.trait_type === 'Status');
    const lockedManagerAttr = lockedMetadata.attributes.find((attr: any) => attr.trait_type === 'Manager');
    const lockedTokenIdAttr = lockedMetadata.attributes.find((attr: any) => attr.trait_type === 'Token ID');
    
    expect(lockedStatusAttr?.value).to.equal('Locked');
    expect(lockedManagerAttr?.value).to.equal(owner.address.toLowerCase());
    expect(lockedTokenIdAttr?.value).to.equal('0');
  });
});

// Helper function to decode tokenURI
function decodeTokenURI(uri: string): any {
  // Remove data:application/json;base64, prefix
  const base64Json = uri.replace(/^data:application\/json;base64,/, '');
  const jsonStr = Buffer.from(base64Json, 'base64').toString('utf-8');
  return JSON.parse(jsonStr);
}
