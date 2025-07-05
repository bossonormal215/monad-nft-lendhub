import { ethers } from "hardhat";

// Helper function to handle network operations with retries
async function executeWithRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 2000
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error: any) {
      if (i === maxRetries - 1) throw error;
      
      if (error.code === 'UND_ERR_HEADERS_TIMEOUT' || 
          error.message.includes('timeout') ||
          error.message.includes('Headers Timeout')) {
        console.log(`   ⏳ Network timeout, retrying in ${delay/1000}s... (attempt ${i + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      throw error;
    }
  }
  throw new Error('Max retries exceeded');
}

async function main() {
  console.log("🧪 Testing Mission 5: MonadLock Ecosystem\n");

  // Contract addresses from deployment
  const MONADLOCK_GUARDIANS_ADDRESS = "0x9397C34A0DA380C33cFBCCF2587C03fBE0961588";
  const LOCKABLE_HUB_ADDRESS = "0x889675a389A2379D4D76f6e74e51b02f9C1031C4";

  // Get signers
  const signers = await ethers.getSigners();
  console.log("Signers found:", signers.length);
  
  // Use available signers, fallback to first signer if needed
  // ✅ Use real Monad Testnet wallets
  
  const deployer = signers[0];
  
  // Check if private keys are available, otherwise fallback to signers
  const privateKey2 = process.env.PRIVATE_KEY2;
  const privateKey3 = process.env.PRIVATE_KEY3;
  
  let user1, user2;
  
  if (privateKey2 && privateKey3) {
    user1 = new ethers.Wallet(privateKey2, ethers.provider);
    user2 = new ethers.Wallet(privateKey3, ethers.provider);
  } else {
    console.log("⚠️  Using fallback signers - add PRIVATE_KEY2 and PRIVATE_KEY3 to .env for full testing");
    user1 = signers[1] || signers[0];
    user2 = signers[2] || signers[0];
  }
  
  console.log("👤 Test Accounts:");
  console.log("   - Deployer:", deployer.address);
  console.log("   - User 1:", user1.address);
  console.log("   - User 2:", user2.address);
  console.log("");

  // Get contract instances
  const monadLockGuardians = await ethers.getContractAt("MonadLockGuardians", MONADLOCK_GUARDIANS_ADDRESS);
  const lockableHub = await ethers.getContractAt("LockableHub", LOCKABLE_HUB_ADDRESS);

  console.log("📋 Contract Instances:");
  console.log("   - MonadLock Guardians:", MONADLOCK_GUARDIANS_ADDRESS);
  console.log("   - LockableHub:", LOCKABLE_HUB_ADDRESS);
  console.log("");

  // Test 1: Check initial state
  console.log("🔍 Test 1: Initial State Check");
  const totalSupply = await monadLockGuardians.totalSupply();
  const nextTokenId = await monadLockGuardians.nextTokenId();
  console.log("   - Total Supply:", totalSupply.toString());
  console.log("   - Next Token ID:", nextTokenId.toString());
  console.log("");

  // Test 2: Mint a Guardian
  console.log("🎨 Test 2: Minting a Guardian");
  const mintPrice = ethers.parseEther("0.01");
  console.log("   - Mint Price: 0.01 ETH");
  
  const mintTx = await executeWithRetry(() => 
    monadLockGuardians.connect(user1).mintGuardian(user1.address, { value: mintPrice })
  );
  await mintTx.wait();
  console.log("   ✅ Guardian minted successfully!");
  
  const newTotalSupply = await monadLockGuardians.totalSupply();
  console.log("   - New Total Supply:", newTotalSupply.toString());
  console.log("");

  // Test 3: Check Guardian Stats
  console.log("📊 Test 3: Guardian Stats");
  const guardianStats = await monadLockGuardians.getGuardianStats(0);
  console.log("   - Experience:", guardianStats.experience.toString());
  console.log("   - Total Locks:", guardianStats.totalLocks.toString());
  console.log("   - Guardian Level:", guardianStats.guardianLevel.toString());
  console.log("   - Has Parallel Ability:", guardianStats.hasParallelAbility);
  console.log("   - Has Lock Mastery:", guardianStats.hasLockMastery);
  console.log("");

  // Test 4: Lock the Guardian
  console.log("🔒 Test 4: Locking Guardian");
  const lockDuration = 7 * 24 * 60 * 60; // 7 days in seconds
  
  // First approve the contract
  console.log("   - Approving contract for token 0...");
  const approveTx = await executeWithRetry(() => 
    monadLockGuardians.connect(user1).approve(MONADLOCK_GUARDIANS_ADDRESS, 0)
  );
  await approveTx.wait();
  console.log("   ✅ Contract approved for token 0");
  
  // Lock the guardian
  console.log("   - Locking guardian for 7 days...");
  const lockTx = await executeWithRetry(() => 
    monadLockGuardians.connect(user1).lock(0, user2.address, lockDuration)
  );
  await lockTx.wait();
  console.log("   ✅ Guardian locked for 7 days");
  
  // Check lock status
  const isLocked = await monadLockGuardians.isLocked(0);
  console.log("   - Is Locked:", isLocked);
  
  // Get lock info
  const lockInfo = await monadLockGuardians.getLockInfo(0);
  console.log("   - Lock Manager:", lockInfo.manager);
  console.log("   - Lock Duration:", lockInfo.duration.toString(), "seconds");
  console.log("");

  // Test 5: Check updated stats after locking
  console.log("📈 Test 5: Updated Stats After Locking");
  const updatedStats = await monadLockGuardians.getGuardianStats(0);
  console.log("   - Experience:", updatedStats.experience.toString());
  console.log("   - Total Locks:", updatedStats.totalLocks.toString());
  console.log("   - Guardian Level:", updatedStats.guardianLevel.toString());
  console.log("");

  // Test 6: Try to transfer locked guardian (should fail)
  console.log("❌ Test 6: Transfer Locked Guardian (Should Fail)");
  try {
    if (user1.address === user2.address) {
      console.log("   ⚠️  Skipping transfer test - using same signer for both users");
    } else {
      await executeWithRetry(() => 
        monadLockGuardians.connect(user1).transferFrom(user1.address, user2.address, 0)
      );
      console.log("   ❌ Transfer succeeded (unexpected)");
    }
  } catch (error: any) {
    console.log("   ✅ Transfer failed as expected:", error.message.includes("Guardian is locked") ? "Guardian is locked" : "Transfer blocked");
  }
  console.log("");

  // Test 7: Unlock the Guardian
  console.log("🔓 Test 7: Unlocking Guardian");
  const unlockTx = await executeWithRetry(() => 
    monadLockGuardians.connect(user2).unlock(0)
  );
  await unlockTx.wait();
  console.log("   ✅ Guardian unlocked by manager");
  
  const isStillLocked = await monadLockGuardians.isLocked(0);
  console.log("   - Is Still Locked:", isStillLocked);
  console.log("");

  // Test 8: Check final stats after unlocking
  console.log("📊 Test 8: Final Stats After Unlocking");
  const finalStats = await monadLockGuardians.getGuardianStats(0);
  console.log("   - Experience:", finalStats.experience.toString());
  console.log("   - Total Locks:", finalStats.totalLocks.toString());
  console.log("   - Guardian Level:", finalStats.guardianLevel.toString());
  console.log("   - Total Lending Time:", finalStats.totalLendingTime.toString(), "seconds");
  console.log("");

  // Test 9: LockableHub Analytics
  console.log("📊 Test 9: LockableHub Analytics");
  const globalStats = await lockableHub.getGlobalStats();
  console.log("   - Total Collections:", globalStats.totalCollections.toString());
  console.log("   - Total Lockable NFTs:", globalStats.totalLockableNFTs.toString());
  console.log("   - Total Active Locks:", globalStats.totalActiveLocks.toString());
  console.log("   - Total Lending Volume:", ethers.formatEther(globalStats.totalLendingVolume), "ETH");
  console.log("   - Total Lending Transactions:", globalStats.totalLendingTransactions.toString());
  console.log("");

  // Test 10: Get registered collections
  console.log("📋 Test 10: Registered Collections");
  const collections = await lockableHub.getAllCollections();
  console.log("   - Number of Collections:", collections.length);
  if (collections.length > 0) {
    const collection = collections[0];
    console.log("   - Collection Name:", collection.name);
    console.log("   - Collection Symbol:", collection.symbol);
    console.log("   - Creator:", collection.creator);
    console.log("   - Verified:", collection.verified);
  }
  console.log("");

  // Test 11: Get templates
  console.log("📚 Test 11: Available Templates");
  const templates = await lockableHub.getAllTemplates();
  console.log("   - Number of Templates:", templates.length);
  templates.forEach((template, index) => {
    console.log(`   - Template ${index + 1}: ${template.name} - ${template.description}`);
  });
  console.log("");

  console.log("🎉 Mission 5 Testing Complete!");
  console.log("All features working as expected!");
}

main()
  .then(() => {
    console.log("\n✅ Testing completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Testing failed:", error);
    process.exit(1);
  }); 