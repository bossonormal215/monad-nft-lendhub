import { ethers } from "hardhat";

async function main() {
  console.log("🚀 Deploying MonadLock Guardians for Mission 5...");

  // Get the contract factory
  const MonadLockGuardians = await ethers.getContractFactory("MonadLockGuardians");
  
  // Deploy the contract
  const monadLockGuardians = await MonadLockGuardians.deploy();
  
  await monadLockGuardians.waitForDeployment();
  
  const address = await monadLockGuardians.getAddress();
  
  console.log("✅ MonadLock Guardians deployed to:", address);
  console.log("📋 Contract Details:");
  console.log("   - Name: MonadLock Guardians");
  console.log("   - Symbol: MLG");
  console.log("   - Max Supply: 1000");
  console.log("   - Mint Price: 0.01 ETH");
  console.log("   - ILockable Interface: ✅ Implemented");
  console.log("   - Novel Mechanics: ✅ Experience System");
  console.log("   - Monad Lore Integration: ✅ Guardian Theme");
  
  console.log("\n🎯 Mission 5 Features:");
  console.log("   - Dynamic visual states based on lock status");
  console.log("   - Experience system tied to lending activities");
  console.log("   - Special abilities that unlock through participation");
  console.log("   - Monad lore integration (Guardians protecting parallel processing)");
  console.log("   - ILockable standard showcase");
  
  console.log("\n🔗 Next Steps:");
  console.log("   1. Update frontend to integrate with this contract");
  console.log("   2. Create metadata API endpoints");
  console.log("   3. Deploy to Monad testnet");
  console.log("   4. Submit to Mission 5");
  
  return address;
}

main()
  .then((address) => {
    console.log("\n🎉 Deployment successful!");
    console.log("Contract address:", address);
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  }); 