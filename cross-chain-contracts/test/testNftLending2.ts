import { ethers } from 'hardhat';

async function main() {
  console.log('🚀 Running NFT Lending Test on Monad Testnet...');

  // Use real Monad Testnet wallets
  const LENDER_WALLET = new ethers.Wallet(
    process.env.PRIVATE_KEY,
    ethers.provider
  );
  const BORROWER_WALLET = new ethers.Wallet(
    process.env.PRIVATE_KEY2,
    ethers.provider
  );

  console.log(`\n🔹 Lender Address: ${LENDER_WALLET.address}`);
  console.log(`🔹 Borrower Address: ${BORROWER_WALLET.address}`);

  // Replace these with actual deployed contract addresses on Monad Testnet
  const NFT_LENDHUB_ADDRESS = '0x6675d33ed0A81a45F6FD138bf85e91f050539cCb';
  const LENDING_POOL_ADDRESS = '0xCCec83c2e4758f0cD8C1baD23Cc66F53b1C37Fb0';
  const LOAN_GOVERNANCE_ADDRESS = '0x34f08447ac38AD7ED5f2D3ac0f007f70B8B897D6';

  async function getNextNonce(wallet: ethers.Wallet): Promise<number> {
    return await ethers.provider.getTransactionCount(wallet.address, 'latest');
  }

  // Your already deployed NFT contract
  const NFT_ADDRESS = '0xCC133Be7950d9c00B78BCbFa470A8E63c3DD7BfC';

  // Loan parameters
  const NFT_ID = 437;
  const LOAN_AMOUNT = ethers.parseEther('2'); // 2 MON
  const INTEREST_RATE = 5; // 5% interest
  const LOAN_DURATION = 7 * 86400; // 7 days
  const LOAN_TOKEN = '0x760AfE86e5de5fa0Ee542fc7B7B713e1c5425701'; // wMON token address
  const wMON = await ethers.getContractAt('IERC20', LOAN_TOKEN);

  // Connect to deployed contracts
  const nftLendHub = await ethers.getContractAt(
    'NFTLendHub',
    NFT_LENDHUB_ADDRESS
  );
  const lendingPool = await ethers.getContractAt(
    'LendingPool',
    LENDING_POOL_ADDRESS
  );
  const loanGovernance = await ethers.getContractAt(
    'LoanGovernance',
    LOAN_GOVERNANCE_ADDRESS
  );
  const nftContract = await ethers.getContractAt('DmonNFT', NFT_ADDRESS);

  console.log('\n🔹 Step 1: Borrower Approves & Lists NFT for Loan...');
  /*
  const nonce = await getNextNonce(BORROWER_WALLET);
  console.log('Next nonce: ', nonce.toString());

  await nftContract
    .connect(BORROWER_WALLET)
    .approve(NFT_LENDHUB_ADDRESS, NFT_ID, { nonce: nonce });

  const nftOwner = await nftContract.ownerOf(NFT_ID);
  console.log('nftId owner: ', nftOwner.toLocaleLowerCase());

  const ListTx = await nftLendHub.connect(BORROWER_WALLET).listNFTForLoan(
    NFT_ADDRESS,
    NFT_ID,
    LOAN_AMOUNT,
    INTEREST_RATE,
    LOAN_DURATION,
    LOAN_TOKEN,
    { nonce: nonce + 1 } // Manually adjust the nonce if necessary
  );
  await ListTx.wait(1);
  console.log('✅ NFT Listed for Loan!');
  

  console.log('\n🔹Lender Approves wMON Transfer...');
  const approveTx = await wMON
    .connect(LENDER_WALLET)
    .approve(NFT_LENDHUB_ADDRESS, LOAN_AMOUNT);
  await approveTx.wait(1);
  console.log('✅ Approval Successful!');

  console.log('\n🔹 Step 2: Lender Funds the Loan...');
  const FundTx = await nftLendHub
    .connect(LENDER_WALLET)
    .fundLoan(NFT_ADDRESS, NFT_ID);

  await FundTx.wait(1);
  console.log('✅ Loan Funded!');
*/

  console.log('\n🔹 Step 3: Borrower Claims the Loan...');
  const loanClaimTx = await nftLendHub
    .connect(BORROWER_WALLET)
    .claimLoan(NFT_ADDRESS, NFT_ID);
  await loanClaimTx.wait(1);
  console.log('✅ Loan Claimed!');

  console.log(
    '\n🔹 Step 4.1: Borrower Approves wMON Transfer for Repayment...'
  );
  const repaymentAmount =
    LOAN_AMOUNT + (LOAN_AMOUNT * BigInt(INTEREST_RATE)) / BigInt(100); // LOAN_AMOUNT + 5% interest
  const approveRepayTx = await wMON
    .connect(BORROWER_WALLET)
    .approve(NFT_LENDHUB_ADDRESS, repaymentAmount);
  await approveRepayTx.wait(1);
  console.log('✅ Repayment Approval Successful!');

  console.log('\n🔹 Step 4: Borrower Repays the Loan...');
  const repayLoanTx = await nftLendHub
    .connect(BORROWER_WALLET)
    .repayLoan(NFT_ADDRESS, NFT_ID);
  await repayLoanTx.wait(1);
  console.log('✅ Loan Repaid!');

  console.log('\n🔹 Step 5: Lender Claims Repayment...');
  const LenderClaimTx = await nftLendHub
    .connect(LENDER_WALLET)
    .claimRepayment(NFT_ADDRESS, NFT_ID);
  await LenderClaimTx.wait(1);
  console.log('✅ Repayment Claimed by Lender!');

  /*
  console.log(
    '\n🔹 Step 6: Lender Claims NFT After Default (If Not Repaid)...'
  );
  const ClaimNftTx = await nftLendHub
    .connect(LENDER_WALLET)
    .claimNFT(NFT_ADDRESS, NFT_ID);
  await ClaimNftTx.wait(1);
  console.log('✅ NFT Claimed by Lender!');
  */

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
