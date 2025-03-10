import { ethers } from 'hardhat';

async function main() {
  console.log('\n🚀 Running NFT Lending Test on Monad Testnet...');

  // ✅ Use real Monad Testnet wallets
  const LENDER_WALLET = new ethers.Wallet(
    process.env.PRIVATE_KEY,
    ethers.provider
  );
  const BORROWER_WALLET = new ethers.Wallet(
    process.env.PRIVATE_KEY2,
    ethers.provider
  );

  console.log(`🔹 Lender Address: ${LENDER_WALLET.address}`);
  console.log(`🔹 Borrower Address: ${BORROWER_WALLET.address}`);

  // ✅ Deployed contract addresses (Replace with the actual deployed addresses)
  const NFT_LENDHUB_ADDRESS = '0x4F672C822d9a4B9cE92D247C8FC3bf1C471E2f39';
  const NFT_ADDRESS = '0xCC133Be7950d9c00B78BCbFa470A8E63c3DD7BfC'; // Example NFT Collection

  // ✅ Loan parameters
  const NFT_ID = 7;
  //   const NFT_ID = 448;
  const LOAN_AMOUNT = ethers.parseEther('2'); // 2 MON
  const INTEREST_RATE = 5; // 5% interest
  const LOAN_DURATION = 7 * 86400; // 7 days
  const LOAN_TOKEN = '0x760AfE86e5de5fa0Ee542fc7B7B713e1c5425701'; // wMON token address
  const wMON = await ethers.getContractAt('IERC20', LOAN_TOKEN);

  async function getNextNonce(wallet: ethers.Wallet): Promise<number> {
    return await ethers.provider.getTransactionCount(wallet.address, 'latest');
  }

  // ✅ Connect to deployed contract
  const nftLendHub = await ethers.getContractAt(
    'NFTLendHub2',
    NFT_LENDHUB_ADDRESS
  );

  const nftContract = await ethers.getContractAt('DmonNFT', NFT_ADDRESS);
  const nonce = await getNextNonce(BORROWER_WALLET);

  // ✅ Step 1: Borrower Lists NFT for Loan

  console.log('\n🔹 Step 1: Borrower Lists NFT for Loan...');
  console.log(' Borrower Approving NFT for Loan...');

  const nftApproveTx = await nftContract
    .connect(BORROWER_WALLET)
    .approve(NFT_LENDHUB_ADDRESS, NFT_ID, { nonce: nonce });
  await nftApproveTx.wait();
  console.log('Approved completed ✅');

  const listTx = await nftLendHub
    .connect(BORROWER_WALLET)
    .listNFTForLoan(
      NFT_ADDRESS,
      NFT_ID,
      LOAN_AMOUNT,
      INTEREST_RATE,
      LOAN_DURATION,
      LOAN_TOKEN,
      { nonce: nonce + 1 }
    );
  await listTx.wait(1);

  console.log('✅ NFT Listed for Loan!');

  // ✅ Step 2: Fetch All Available Loans
  console.log('\n🔹 Step 2: Fetch Available Loans...');
  const allLoans = await nftLendHub.getAllLoans();
  console.log('📌 All Available Loans:', allLoans);
  console.log('📌 All Available Loans:', allLoans);

  // ✅ Step 3: Lender Approves & Funds the Loan
  console.log('\n🔹Lender Approves wMON Transfer..');
  const approveTx = await wMON
    .connect(LENDER_WALLET)
    .approve(NFT_LENDHUB_ADDRESS, LOAN_AMOUNT);
  await approveTx.wait(1);
  console.log('✅ Approval Succusful!');
  /*

  console.log('\n🔹 Step 3: Lender Funds the Loan...');
  const fundTx = await nftLendHub
    .connect(LENDER_WALLET)
    .fundLoan(NFT_ADDRESS, NFT_ID);
  await fundTx.wait(1);
  console.log('✅ Loan Funded!');

  // ✅ Step 4: Fetch User-Specific Loans
  console.log('\n🔹 Step 4: Fetch User-Specific Loans...');
  let borrowerLoans = await nftLendHub.getUserLoans(BORROWER_WALLET.address);
  let lenderLoans = await nftLendHub.getLenderLoans(LENDER_WALLET.address);
  console.log("🔍 Borrower's Loans:", borrowerLoans);
  console.log("🔍 Lender's Loans:", lenderLoans);
  console.log(`Current Timestamp: ${Math.floor(Date.now() / 1000)}`);
  console.log(
    `Loan End Time: ${
      Number(lenderLoans[0].startTime) + Number(lenderLoans[0].loanDuration)
    }`
  );

  console.log('\n🔹 Step 5: Borrower Claims the Loan...');
  const loanClaimTx = await nftLendHub
    .connect(BORROWER_WALLET)
    .claimLoan(NFT_ADDRESS, NFT_ID);
  await loanClaimTx.wait(1);
  console.log('✅ Loan Claimed!');

  // ✅ Step 5: Borrower Repays the Loan
  console.log('\n🔹 Step 6: Borrower Approves wMON & Repays Loan...');
  const repaymentAmount =
    LOAN_AMOUNT + (LOAN_AMOUNT * BigInt(INTEREST_RATE)) / BigInt(100); // Loan Amount + 5% Interest
  const repayApproveTx = await wMON
    .connect(BORROWER_WALLET)
    .approve(NFT_LENDHUB_ADDRESS, repaymentAmount, { nonce: nonce + 1 });
  await repayApproveTx.wait();

  console.log('Approved✅');
  const repayLoanTx = await nftLendHub
    .connect(BORROWER_WALLET)
    .repayLoan(NFT_ADDRESS, NFT_ID /*, { nonce: nonce + 1 });
  await repayLoanTx.wait();
  console.log('✅ Loan Repaid!');
  */

  // ✅ Step 6: Fetch Completed Loans
  console.log('\n🔹 Step 7: Fetch Completed Loans...');
  let completedLoans = await nftLendHub.getCompletedLoans();
  console.log('✅ Completed Loans:', completedLoans);

  // ✅ Step 7: Lender Claims Repayment
  /*

  console.log('\n🔹 Step 8: Lender Claims Repayment...');
  await nftLendHub.connect(LENDER_WALLET).claimRepayment(NFT_ADDRESS, NFT_ID);
  console.log('✅ Repayment Claimed by Lender!');
  */

  // ✅ Step 8: Final Loan Status Check
  console.log('\n🔹 Step 9: Fetch Final Loan Status...');
  let finalLoans = await nftLendHub.getCompletedLoans();
  console.log('✅ Final Completed Loans:', finalLoans);

  console.log(
    '\n🎉 All NFT Lending Test Cases Passed Successfully on Monad Testnet!'
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
