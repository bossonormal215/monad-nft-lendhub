

//   // token addresses on Monad Testnet
//   const MON = "0x760AfE86e5de5fa0Ee542fc7B7B713e1c5425701"; // WMON
//   const USDT = "0x88b8E2161DEDC77EF4ab7585569D2415a1C1055D";
//   const ETH = "0xf817257fed379853cDe0fa4F97AB987181B1E5Ea"; // USDC
  import { ethers } from "hardhat";

  async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("🚀 Running NFT Lending Test on Monad Testnet...");
  
    // Replace these with the actual deployed contract addresses
    const NFT_LENDHUB_ADDRESS = "0x2e0a5a00F895B7a44D0f2311785Df84a8a61cAE9";
    const LENDING_POOL_ADDRESS = "0xaFa6D03555df9612A22F0965598Cfa895A4cBabF";
    const LOAN_GOVERNANCE_ADDRESS = "0xC1Ac77D35946cC0Df92c76cA6bBC997f26db56C0";
    
    // Your already deployed NFT contract
    const NFT_ADDRESS = "0xCC133Be7950d9c00B78BCbFa470A8E63c3DD7BfC";
  
    // Replace with real lender & borrower addresses on Monad Testnet
    const LENDER_ADDRESS = deployer.address;  
    // const BORROWER_ADDRESS = "BORROWER_WALLET_ADDRESS";
    const BORROWER_ADDRESS = "BORROWER_WALLET_ADDRESS";
    const BORROWER_WALLET = new ethers.Wallet(process.env.PRIVATE_KEY2, ethers.provider);

  
    // Loan parameters
    const NFT_ID = 88; // Assuming we use NFT ID 88
    const LOAN_AMOUNT = ethers.utils.parseEther("2"); // 10 MON
    const INTEREST_RATE = 5; // 5% interest
    const LOAN_DURATION = 7 * 86400; // 7 days
    const LOAN_TOKEN = "0x760AfE86e5de5fa0Ee542fc7B7B713e1c5425701"; // wMON token address
  
    // Connect to deployed contracts
    const nftLendHub = await ethers.getContractAt("NFTLendHub", NFT_LENDHUB_ADDRESS);
    const lendingPool = await ethers.getContractAt("LendingPool", LENDING_POOL_ADDRESS);
    const loanGovernance = await ethers.getContractAt("LoanGovernance", LOAN_GOVERNANCE_ADDRESS);
    const nftContract = await ethers.getContractAt("DmonNFT", NFT_ADDRESS);
  
    console.log("\n🔹 Step 1: Listing NFT for Loan...");
    await nftContract.connect(BORROWER_ADDRESS).approve(NFT_LENDHUB_ADDRESS, NFT_ID);
    await nftLendHub.connect(BORROWER_ADDRESS).listNFTForLoan(
      NFT_ADDRESS,
      NFT_ID,
      LOAN_AMOUNT,
      INTEREST_RATE,
      LOAN_DURATION,
      LOAN_TOKEN
    );
    console.log("✅ NFT Listed for Loan!");
  
    console.log("\n🔹 Step 2: Lender Funds the Loan...");
    await nftLendHub.connect(LENDER_ADDRESS).fundLoan(NFT_ADDRESS, NFT_ID);
    console.log("✅ Loan Funded!");
  
    console.log("\n🔹 Step 3: Borrower Claims the Loan...");
    await nftLendHub.connect(BORROWER_ADDRESS).claimLoan(NFT_ADDRESS, NFT_ID);
    console.log("✅ Loan Claimed!");
  
    console.log("\n🔹 Step 4: Borrower Repays the Loan...");
    await nftLendHub.connect(BORROWER_ADDRESS).repayLoan(NFT_ADDRESS, NFT_ID);
    console.log("✅ Loan Repaid!");

    console.log("\n🔹 Step 5: lender claims the Loan repayment...");
    await nftLendHub.connect(BORROWER_ADDRESS).claimRepayment(NFT_ADDRESS, NFT_ID);
    console.log("✅ Loan Reypament claimed!");
  
    console.log("\n🔹 Step 6: Lender Claims NFT after Default (If Not Repaid)...");
    await nftLendHub.connect(LENDER_ADDRESS).claimNFT(NFT_ADDRESS, NFT_ID);
    console.log("✅ NFT Claimed by Lender!");
  
    console.log("\n🎉 All NFT Lending Test Cases Passed Successfully on Monad Testnet!");
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
  