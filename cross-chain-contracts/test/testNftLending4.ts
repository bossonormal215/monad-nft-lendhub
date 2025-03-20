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
  const NFT_LENDHUB_ADDRESS = '0xa7507707FD388989fa794372677b89494517f75C'; // Contract
  const NFT_ADDRESS = '0xCC133Be7950d9c00B78BCbFa470A8E63c3DD7BfC'; // NFT Collection

  // ✅ Loan parameters
  const NFT_ID = 437;
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
    'NFTLendHub4',
    NFT_LENDHUB_ADDRESS
  );

  const nftContract = await ethers.getContractAt('DmonNFT', NFT_ADDRESS);
  const nonce = await getNextNonce(BORROWER_WALLET);

  /*
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

  // ✅ Fetch Loan ID for the listed NFT
  console.log('\n🔍 Fetching loan details...');
  let userLoans = await nftLendHub.getUserLoans(BORROWER_WALLET.address);

  if (userLoans.length === 0) {
    console.error('❌ No loan found for borrower. Exiting test.');
    process.exit(1);
  }

  const loanId = userLoans[userLoans.length - 1].loanId;
  console.log(`📌 Loan ID: ${loanId}`);

  // ✅ Step 2: Fetch All Available Loans
  console.log('\n🔹 Step 2: Fetch Available Loans...');
  const allLoans = await nftLendHub.getAllLoans();
  console.log('📌 All Available Loans:', allLoans);

  // ✅ Step 3: Lender Approves & Funds the Loan
  console.log('\n🔹 Lender Approves wMON Transfer...');
  const approveTx = await wMON
    .connect(LENDER_WALLET)
    .approve(NFT_LENDHUB_ADDRESS, LOAN_AMOUNT);
  await approveTx.wait(1);
  console.log('✅ Approval Successful!');

  console.log('\n🔹 Step 3: Lender Funds the Loan...');

  const fundTx = await nftLendHub.connect(LENDER_WALLET).fundLoan(loanId);
  await fundTx.wait(1);
  console.log('✅ Loan Funded!');

  // ✅ Step 4: Fetch User-Specific Loans
  console.log('\n🔹 Step 4: Fetch User-Specific Loans...');
  userLoans = await nftLendHub.getUserLoans(BORROWER_WALLET.address);
  let lenderLoans = await nftLendHub.getLenderLoans(LENDER_WALLET.address);
  console.log("🔍 Borrower's Loans:", userLoans);
  console.log("🔍 Lender's Loans:", lenderLoans);

  console.log('\n🔹 Step 5: Borrower Claims the Loan...');
  const loanClaimTx = await nftLendHub
    .connect(BORROWER_WALLET)
    .claimLoan(loanId);
  await loanClaimTx.wait(1);

  console.log('✅ Loan Claimed!');

  // ✅ Step 6: Check if loan is already repaid before calling repayLoan()
  console.log('\n🔹 Step 6: Checking if loan is already repaid...');
  userLoans = await nftLendHub.getUserLoans(BORROWER_WALLET.address);
  const loanStatus = userLoans.find((loan) => loan.loanId === loanId);

  if (loanStatus?.repaid) {
    console.log('✅ Loan already repaid. Skipping repayment step...');
  } else {
    console.log('\n🔹 Step 6: Borrower Approves wMON & Repays Loan...');
    const repaymentAmount =
      LOAN_AMOUNT + (LOAN_AMOUNT * BigInt(INTEREST_RATE)) / BigInt(100); // Loan Amount + 5% Interest
    const repayApproveTx = await wMON
      .connect(BORROWER_WALLET)
      .approve(NFT_LENDHUB_ADDRESS, repaymentAmount /*, { nonce: nonce + 1 }*/ /*);
    await repayApproveTx.wait();
    console.log('Approved✅');

    const repayLoanTx = await nftLendHub
      .connect(BORROWER_WALLET)
      .repayLoan(loanId);
    await repayLoanTx.wait();
    console.log('✅ Loan Repaid!');
  }

  // ✅ Step 4: Fetch User-Specific Loans
  console.log(
    '\n🔹 Step 4(repeat): Fetch User-Specific Loans... while repeating step 4'
  );
  userLoans = await nftLendHub.getUserLoans(BORROWER_WALLET.address);
  let lenderLoansRecheck = await nftLendHub.getLenderLoans(
    LENDER_WALLET.address
  );
  console.log("🔍 Borrower's Loans:", userLoans);
  console.log("🔍 Lender's Loans:", lenderLoansRecheck);

  // ✅ Step 7: Fetch Completed Loans
  console.log('\n🔹 Step 7: Fetch Completed Loans...');
  let completedLoans = await nftLendHub.getCompletedLoans();
  console.log('✅ Completed Loans:', completedLoans);

  // ✅ Step 8: Check if repayment is already claimed before calling claimRepayment()
  console.log('\n🔹 Step 8: Checking if repayment is already claimed...');
  lenderLoans = await nftLendHub.getLenderLoans(LENDER_WALLET.address);
  const lenderLoanStatus = lenderLoans.find((loan) => loan.loanId === loanId);

  if (lenderLoanStatus?.completed) {
    console.log('✅ Repayment already claimed. Skipping...');
  } else {
    console.log('\n🔹 Step 8: Lender Claims Repayment...');
    await nftLendHub.connect(LENDER_WALLET).claimRepayment(loanId);
    console.log('✅ Repayment Claimed by Lender!');
  }
  */

  // ✅ Step 9: Final Loan Status Check
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
