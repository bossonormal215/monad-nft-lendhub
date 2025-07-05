import { ethers } from "hardhat";

async function main() {
  console.log("🚀 Deploying LockableHub for Mission 5 Track 2...");

  // Get the contract factory
  const LockableHub = await ethers.getContractFactory("LockableHub");
  
  // Deploy the contract
  const lockableHub = await LockableHub.deploy();
  
  await lockableHub.waitForDeployment();
  
  const address = await lockableHub.getAddress();
  
  console.log("✅ LockableHub deployed to:", address);
  console.log("📋 Contract Details:");
  console.log("   - Name: LockableHub");
  console.log("   - Purpose: ILockable Ecosystem Tooling");
  console.log("   - Track: Mission 5 - NFT Tooling");
  
  console.log("\n🎯 Mission 5 Track 2 Features:");
  console.log("   - Lockable NFT creation templates");
  console.log("   - Analytics and statistics tracking");
  console.log("   - Integration verification");
  console.log("   - Marketplace functionality for lockable NFTs");
  console.log("   - ILockable standard promotion");
  
  console.log("\n🔧 Tooling Components:");
  console.log("   1. Collection Registry - Register and verify ILockable collections");
  console.log("   2. Template System - Pre-built templates for developers");
  console.log("   3. Analytics Dashboard - Track lockable NFT usage");
  console.log("   4. Integration SDK - Easy ILockable implementation");
  console.log("   5. Marketplace - Specialized marketplace for lockable NFTs");
  
  console.log("\n📊 Default Templates Included:");
  console.log("   - BasicLockable: Standard ILockable implementation");
  console.log("   - GamingLockable: Gaming-focused with experience system");
  console.log("   - DeFiLockable: DeFi-focused with lending integration");
  
  console.log("\n🔗 Next Steps:");
  console.log("   1. Deploy MonadLock Guardians collection");
  console.log("   2. Register collection in LockableHub");
  console.log("   3. Create frontend integration");
  console.log("   4. Deploy to Monad testnet");
  console.log("   5. Submit to Mission 5");
  
  return address;
}

main()
  .then((address) => {
    console.log("\n🎉 LockableHub deployment successful!");
    console.log("Contract address:", address);
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  }); 