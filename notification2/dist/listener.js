"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startListener = void 0;
const ethers_1 = require("ethers");
const dotenv_1 = __importDefault(require("dotenv"));
const lendhub_1 = require("./lendhub");
const schema_1 = require("./db/schema");
const bot_1 = require("./bot");
dotenv_1.default.config();
// Store last processed block and active loans
let lastProcessedBlock = 0;
let activeLoans = new Map();
// Check loan expiration status
const checkLoanExpiration = async (contract) => {
    const currentTime = Math.floor(Date.now() / 1000);
    const GRACE_PERIOD = 7 * 24 * 60 * 60; // 7 days in seconds
    for (const [key, loan] of activeLoans.entries()) {
        const loanEndTime = loan.startTime + loan.duration;
        const gracePeriodEnd = loanEndTime + GRACE_PERIOD;
        // Check if loan has expired but still in grace period
        if (currentTime > loanEndTime && currentTime <= gracePeriodEnd) {
            // Notify borrower about expiration
            const borrowerUser = await (0, schema_1.getUserByWallet)(loan.borrower);
            if (borrowerUser && currentTime - loan.lastNotified > 24 * 60 * 60) { // Notify once per day
                await (0, bot_1.notifyUser)(borrowerUser.chat_id, `⚠️ Your loan #${loan.loanId} on lendhub has expired! You have ${Math.floor((gracePeriodEnd - currentTime) / (24 * 60 * 60))} days left in the grace period to repay.`);
                loan.lastNotified = currentTime;
            }
            // Notify lender about expiration
            const lenderUser = await (0, schema_1.getUserByWallet)(loan.lender);
            if (lenderUser && currentTime - loan.lastNotified > 24 * 60 * 60) {
                await (0, bot_1.notifyUser)(lenderUser.chat_id, `⚠️ Loan #${loan.loanId} on lendhub has expired! The borrower has ${Math.floor((gracePeriodEnd - currentTime) / (24 * 60 * 60))} days left in the grace period to repay.`);
            }
        }
        // Check if grace period has ended
        else if (currentTime > gracePeriodEnd) {
            // Notify lender that NFT is ready to be claimed
            const lenderUser = await (0, schema_1.getUserByWallet)(loan.lender);
            if (lenderUser && currentTime - loan.lastNotified > 24 * 60 * 60) {
                await (0, bot_1.notifyUser)(lenderUser.chat_id, `🔔 The grace period for loan #${loan.loanId} on lendhub has ended. You can now claim the NFT!`);
                loan.lastNotified = currentTime;
            }
            // Notify borrower that NFT can be claimed
            const borrowerUser = await (0, schema_1.getUserByWallet)(loan.borrower);
            if (borrowerUser && currentTime - loan.lastNotified > 24 * 60 * 60) {
                await (0, bot_1.notifyUser)(borrowerUser.chat_id, `⚠️ The grace period for your loan #${loan.loanId} on lendhub has ended. The lender can now claim your NFT!`);
            }
        }
    }
};
const startListener = async () => {
    try {
        // Validate environment variables
        if (!process.env.RPC_URL) {
            throw new Error('RPC_URL is not set in environment variables');
        }
        if (!process.env.CONTRACT_ADDRESS) {
            throw new Error('CONTRACT_ADDRESS is not set in environment variables');
        }
        // Initialize provider
        const provider = new ethers_1.ethers.JsonRpcProvider(process.env.RPC_URL);
        // Validate contract address
        if (!ethers_1.ethers.isAddress(process.env.CONTRACT_ADDRESS)) {
            throw new Error('Invalid contract address format');
        }
        const contract = new ethers_1.ethers.Contract(process.env.CONTRACT_ADDRESS, lendhub_1.LENDHUB_ABI, provider);
        console.log('🚀 Starting event listener...');
        console.log(`📝 Contract address: ${process.env.CONTRACT_ADDRESS}`);
        console.log(`🌐 RPC URL: ${process.env.RPC_URL}`);
        // Get current block number
        const currentBlock = await provider.getBlockNumber();
        lastProcessedBlock = currentBlock - 1000; // Start from 1000 blocks ago
        console.log(`📦 Starting from block ${lastProcessedBlock}`);
        // Poll for new blocks
        const pollInterval = 15000; // 15 seconds
        setInterval(async () => {
            try {
                const currentBlock = await provider.getBlockNumber();
                if (currentBlock <= lastProcessedBlock)
                    return;
                const MAX_BLOCK_RANGE = 100;
                let fromBlock = lastProcessedBlock + 1;
                while (fromBlock <= currentBlock) {
                    const toBlock = Math.min(fromBlock + MAX_BLOCK_RANGE - 1, currentBlock);
                    console.log(`🔍 Checking blocks ${fromBlock} to ${toBlock}`);
                    // Get events for each type in this chunk
                    const events = await Promise.all([
                        contract.queryFilter('NFTListed', fromBlock, toBlock),
                        contract.queryFilter('LoanFunded', fromBlock, toBlock),
                        contract.queryFilter('LoanClaimed', fromBlock, toBlock),
                        contract.queryFilter('LoanRepaid', fromBlock, toBlock),
                        contract.queryFilter('RepaymentClaimed', fromBlock, toBlock),
                        contract.queryFilter('NFTClaimedByLender', fromBlock, toBlock),
                        contract.queryFilter('NFTWithdrawn', fromBlock, toBlock),
                        contract.queryFilter('LoanCancelled', fromBlock, toBlock)
                    ]);
                    // Process NFTListed events
                    for (const event of events[0]) {
                        const typedEvent = event;
                        const loanId = typedEvent.args[0];
                        const loanAmount = typedEvent.args[4];
                        const nftOwner = typedEvent.args[1];
                        console.log(`📥 NFTListed event: Loan #${loanId} by ${nftOwner}`);
                        const user = await (0, schema_1.getUserByWallet)(nftOwner);
                        if (user) {
                            await (0, bot_1.notifyUser)(user.chat_id, `🎨 Your NFT has been listed for loan on lendhub for ${loanAmount} with Loan Id #${loanId}`);
                        }
                    }
                    // Process LoanFunded events
                    for (const event of events[1]) {
                        const typedEvent = event;
                        const loanId = typedEvent.args[0];
                        const lender = typedEvent.args[1];
                        const borrower = typedEvent.args[2];
                        // Get loan details
                        const loan = await contract.loans(loanId);
                        // Add to active loans tracking
                        activeLoans.set(loanId.toString(), {
                            loanId: loanId.toString(),
                            borrower,
                            lender,
                            startTime: Number(loan.milestones.startTime),
                            duration: Number(loan.loanDuration),
                            lastNotified: Math.floor(Date.now() / 1000)
                        });
                        console.log(`📥 LoanFunded event: Loan #${loanId} by ${lender} for ${borrower}`);
                        // Notify borrower
                        const borrowerUser = await (0, schema_1.getUserByWallet)(borrower);
                        if (borrowerUser) {
                            await (0, bot_1.notifyLoanFunded)(borrowerUser.chat_id, loanId.toString());
                        }
                        // Notify lender
                        const lenderUser = await (0, schema_1.getUserByWallet)(lender);
                        if (lenderUser) {
                            await (0, bot_1.notifyLenderFunded)(lenderUser.chat_id, loanId.toString());
                        }
                    }
                    // Process LoanClaimed events
                    for (const event of events[2]) {
                        const typedEvent = event;
                        const loanId = typedEvent.args[0];
                        const borrower = typedEvent.args[1];
                        console.log(`📥 LoanClaimed event: Loan #${loanId} by ${borrower}`);
                        const user = await (0, schema_1.getUserByWallet)(borrower);
                        if (user) {
                            await (0, bot_1.notifyLoanClaimed)(user.chat_id, loanId.toString());
                        }
                    }
                    // Process LoanRepaid events
                    for (const event of events[3]) {
                        const typedEvent = event;
                        const loanId = typedEvent.args[0];
                        // Remove from active loans tracking
                        activeLoans.delete(loanId.toString());
                        const borrower = typedEvent.args[1];
                        const lender = typedEvent.args[2];
                        console.log(`📥 LoanRepaid event: Loan #${loanId} by ${borrower}`);
                        // Notify lender about repayment
                        const lenderUser = await (0, schema_1.getUserByWallet)(lender);
                        if (lenderUser) {
                            await (0, bot_1.notifyRepaymentReady)(lenderUser.chat_id, loanId.toString());
                        }
                        // Notify borrower about successful repayment
                        const borrowerUser = await (0, schema_1.getUserByWallet)(borrower);
                        if (borrowerUser) {
                            await (0, bot_1.notifyLoanRepaid)(borrowerUser.chat_id, loanId.toString());
                        }
                    }
                    // Process RepaymentClaimed events
                    for (const event of events[4]) {
                        const typedEvent = event;
                        const loanId = typedEvent.args[0];
                        const lender = typedEvent.args[1];
                        console.log(`📥 RepaymentClaimed event: Loan #${loanId} by ${lender}`);
                        const user = await (0, schema_1.getUserByWallet)(lender);
                        if (user) {
                            await (0, bot_1.notifyUser)(user.chat_id, `💸 You have successfully claimed repayment for loan #${loanId} on lendhub`);
                        }
                    }
                    // Process NFTClaimedByLender events
                    for (const event of events[5]) {
                        const typedEvent = event;
                        const loanId = typedEvent.args[0];
                        // Remove from active loans tracking
                        activeLoans.delete(loanId.toString());
                        const lender = typedEvent.args[1];
                        const borrower = typedEvent.args[2];
                        console.log(`📥 NFTClaimedByLender event: Loan #${loanId} by ${lender}`);
                        // Notify lender
                        const lenderUser = await (0, schema_1.getUserByWallet)(lender);
                        if (lenderUser) {
                            const loan = await contract.loans(loanId);
                            await (0, bot_1.notifyNFTClaimed)(lenderUser.chat_id, loanId.toString(), loan.nftId.toString());
                        }
                        // Notify borrower
                        const borrowerUser = await (0, schema_1.getUserByWallet)(borrower);
                        if (borrowerUser) {
                            await (0, bot_1.notifyUser)(borrowerUser.chat_id, `⚠️ Your NFT from loan #${loanId} on lendhub has been claimed by the lender due to non-repayment`);
                        }
                    }
                    // Process NFTWithdrawn events
                    for (const event of events[6]) {
                        const typedEvent = event;
                        const loanId = typedEvent.args[0];
                        const owner = typedEvent.args[1];
                        console.log(`📥 NFTWithdrawn event: Loan #${loanId} by ${owner}`);
                        const user = await (0, schema_1.getUserByWallet)(owner);
                        if (user) {
                            await (0, bot_1.notifyUser)(user.chat_id, `🔄 You have successfully withdrawn your NFT from loan #${loanId}`);
                        }
                    }
                    // Process LoanCancelled events
                    for (const event of events[7]) {
                        const typedEvent = event;
                        const loanId = typedEvent.args[0];
                        // Remove from active loans tracking
                        activeLoans.delete(loanId.toString());
                        const owner = typedEvent.args[1];
                        console.log(`📥 LoanCancelled event: Loan #${loanId} by ${owner}`);
                        const user = await (0, schema_1.getUserByWallet)(owner);
                        if (user) {
                            await (0, bot_1.notifyUser)(user.chat_id, `❌ You have cancelled loan #${loanId}`);
                        }
                    }
                    fromBlock = toBlock + 1;
                    lastProcessedBlock = toBlock;
                }
                // Check loan expiration status
                await checkLoanExpiration(contract);
            }
            catch (error) {
                console.error('❌ Error processing blocks:', error);
            }
        }, pollInterval);
    }
    catch (error) {
        console.error('❌ Error in event listener:', error);
        // Attempt to restart the listener after a delay
        setTimeout(exports.startListener, 5000);
    }
};
exports.startListener = startListener;
