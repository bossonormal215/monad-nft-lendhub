import { ethers } from "hardhat";

async function main() {
  console.log("🔗 Registering MonadLock Guardians in LockableHub...");

  // Contract addresses (update these after deployment)
  const LOCKABLE_HUB_ADDRESS = "0x889675a389A2379D4D76f6e74e51b02f9C1031C4"; // Update with deployed LockableHub address
  const MONADLOCK_GUARDIANS_ADDRESS = "0x9397C34A0DA380C33cFBCCF2587C03fBE0961588"; // Update with deployed MonadLock Guardians address

  // Get contract instances
  const lockableHub = await ethers.getContractAt("LockableHub", LOCKABLE_HUB_ADDRESS);
  const monadLockGuardians = await ethers.getContractAt("MonadLockGuardians", MONADLOCK_GUARDIANS_ADDRESS);

  console.log("📋 Collection Details:");
  console.log("   - Name: MonadLock Guardians");
  console.log("   - Symbol: MLG");
  console.log("   - Description: Novel NFT collection with ILockable integration and Monad-inspired mechanics");
  console.log("   - Contract: ", MONADLOCK_GUARDIANS_ADDRESS);

  // Register the collection in LockableHub
  const tx = await lockableHub.registerCollection(
    MONADLOCK_GUARDIANS_ADDRESS,
    "MonadLock Guardians",
    "MLG",
    "Novel NFT collection with ILockable integration and Monad-inspired mechanics. Features dynamic visual states, experience system, and special abilities that unlock through lending participation."
  );

  console.log("⏳ Waiting for transaction confirmation...");
  await tx.wait();

  console.log("✅ MonadLock Guardians successfully registered in LockableHub!");
  
  // Verify the registration
  const collection = await lockableHub.lockableCollections(MONADLOCK_GUARDIANS_ADDRESS);
  console.log("\n📊 Registration Details:");
  console.log("   - Creator:", collection.creator);
  console.log("   - Name:", collection.name);
  console.log("   - Symbol:", collection.symbol);
  console.log("   - Verified:", collection.verified);
  console.log("   - Created At:", new Date(Number(collection.createdAt) * 1000).toISOString());

  // Get global stats
  const stats = await lockableHub.getGlobalStats();
  console.log("\n📈 Updated Global Stats:");
  console.log("   - Total Collections:", stats.totalCollections.toString());
  console.log("   - Total Lockable NFTs:", stats.totalLockableNFTs.toString());
  console.log("   - Total Active Locks:", stats.totalActiveLocks.toString());
  console.log("   - Total Lending Volume:", ethers.formatEther(stats.totalLendingVolume), "ETH");
  console.log("   - Total Lending Transactions:", stats.totalLendingTransactions.toString());

  console.log("\n🎉 Mission 5 Integration Complete!");
  console.log("   - Track 1: MonadLock Guardians deployed and registered");
  console.log("   - Track 2: LockableHub deployed and operational");
  console.log("   - Integration: Collection successfully registered in tooling platform");

  return {
    lockableHubAddress: LOCKABLE_HUB_ADDRESS,
    monadLockGuardiansAddress: MONADLOCK_GUARDIANS_ADDRESS,
    registrationTx: tx.hash
  };
}

main()
  .then((result) => {
    console.log("\n🎯 Mission 5 Ready for Submission!");
    console.log("Contract Addresses:");
    console.log("   - LockableHub:", result.lockableHubAddress);
    console.log("   - MonadLock Guardians:", result.monadLockGuardiansAddress);
    console.log("   - Registration TX:", result.registrationTx);
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Registration failed:", error);
    process.exit(1);
  }); 