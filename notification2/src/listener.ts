import dotenv from 'dotenv';
import { getUserByWallet } from './db/schema';
import {
  notifyLoanFunded,
  notifyLoanClaimed,
  notifyLoanRepaid,
  notifyLenderFunded,
  notifyRepaymentReady,
  notifyNFTClaimed,
  notifyUser
} from './bot';
import {
  fetchRecentEvents,
  fetchLoanDetails,
  getLatestBlock,
  type EnvioResponse,
  type LoanDetails
} from './envio';

dotenv.config();

// Store active loans and last processed blocks
let activeLoans = new Map<string, {
  loanId: string;
  borrower: string;
  lender: string;
  startTime: number;
  duration: number;
  lastNotified: number;
}>();

// Track last processed block for each event type
let lastProcessedBlocks = {
  Nftlendhub_NFTListed: 0,
  Nftlendhub_LoanFunded: 0,
  Nftlendhub_LoanClaimed: 0,
  Nftlendhub_LoanRepaid: 0,
  Nftlendhub_LoanCancelled: 0,
  Nftlendhub_RepaymentClaimed: 0,
  Nftlendhub_NFTClaimedByLender: 0,
  Nftlendhub_NFTWithdrawn: 0
};

// Utility functions
function formatEther(wei: string): string {
  return (parseFloat(wei) / 1e18).toLocaleString(undefined, { maximumFractionDigits: 4 }) + ' wMON';
}

function formatDuration(seconds: string): string {
  return (parseFloat(seconds) / 86400).toFixed() + ' days';
}

function formatWalletLink(address: string): string {
  const shortenedAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;
  return `<a href="https://www.lendhub.xyz/user/${address}">${shortenedAddress}</a>`;
}

// Check loan expiration status
const checkLoanExpiration = async () => {
  const currentTime = Math.floor(Date.now() / 1000);
  const GRACE_PERIOD = 7 * 24 * 60 * 60; // 7 days in seconds

  for (const [key, loan] of activeLoans.entries()) {
    const loanEndTime = loan.startTime + loan.duration;
    const gracePeriodEnd = loanEndTime + GRACE_PERIOD;

    // Check if loan has expired but still in grace period
    if (currentTime > loanEndTime && currentTime <= gracePeriodEnd) {
      // Notify borrower about expiration
      const borrowerUser = await getUserByWallet(loan.borrower);
      if (borrowerUser && currentTime - loan.lastNotified > 24 * 60 * 60) { // Notify once per day
        await notifyUser(
          borrowerUser.chat_id,
          `⚠️ Your loan #${loan.loanId} on lendhub has expired! You have ${Math.floor((gracePeriodEnd - currentTime) / (24 * 60 * 60))} days left in the grace period to repay.`
        );
        loan.lastNotified = currentTime;
      }

      // Notify lender about expiration
      const lenderUser = await getUserByWallet(loan.lender);
      if (lenderUser && currentTime - loan.lastNotified > 24 * 60 * 60) {
        await notifyUser(
          lenderUser.chat_id,
          `⚠️ Loan #${loan.loanId} on lendhub has expired! The borrower has ${Math.floor((gracePeriodEnd - currentTime) / (24 * 60 * 60))} days left in the grace period to repay.`
        );
      }
    }
    // Check if grace period has ended
    else if (currentTime > gracePeriodEnd) {
      // Notify lender that NFT is ready to be claimed
      const lenderUser = await getUserByWallet(loan.lender);
      if (lenderUser && currentTime - loan.lastNotified > 24 * 60 * 60) {
        await notifyUser(
          lenderUser.chat_id,
          `🔔 The grace period for loan #${loan.loanId} on lendhub has ended. You can now claim the NFT!`
        );
        loan.lastNotified = currentTime;
      }

      // Notify borrower that NFT can be claimed
      const borrowerUser = await getUserByWallet(loan.borrower);
      if (borrowerUser && currentTime - loan.lastNotified > 24 * 60 * 60) {
        await notifyUser(
          borrowerUser.chat_id,
          `⚠️ The grace period for your loan #${loan.loanId} on lendhub has ended. The lender can now claim your NFT!`
        );
      }
    }
  }
};

export const startListener = async () => {
  try {
    // Validate environment variables
    if (!process.env.ENVIO_GRAPHQL_URL) {
      throw new Error('ENVIO_GRAPHQL_URL is not set in environment variables');
    }

    console.log('🚀 Starting Envio event listener...');
    console.log(`🌐 Envio GraphQL URL: ${process.env.ENVIO_GRAPHQL_URL}`);

    // Get the latest block from Envio
    const latestBlock = await getLatestBlock();
    console.log(`📦 Latest block from Envio: ${latestBlock}`);

    // Initialize last processed blocks
    Object.keys(lastProcessedBlocks).forEach(key => {
      lastProcessedBlocks[key as keyof typeof lastProcessedBlocks] = latestBlock;
    });

    // Poll for new events
    const pollInterval = 15000; // 15 seconds
    setInterval(async () => {
      try {
        // Get current latest block
        const currentBlock = await getLatestBlock();
        
        // Fetch recent events from Envio
        const events = await fetchRecentEvents(currentBlock - 100); // Look back 100 blocks to ensure we don't miss any events

        // Process NFTListed events
        for (const event of events.Nftlendhub_NFTListed) {
          if (event._blockNumber > lastProcessedBlocks.Nftlendhub_NFTListed) {
            const user = await getUserByWallet(event.nftOwner);
            if (user) {
              await notifyUser(
                user.chat_id,
                `🔔 New NFT Listed!\n\nNFT ID: ${event.nftId}\nLoan Amount: ${formatEther(event.loanAmount)}\nInterest Rate: ${event.interestRate}%\nDuration: ${formatDuration(event.duration)}`
              );
            }
            lastProcessedBlocks.Nftlendhub_NFTListed = event._blockNumber;
          }
        }

        // Process LoanCancelled events
        for (const event of events.Nftlendhub_LoanCancelled) {
          if (event._blockNumber > lastProcessedBlocks.Nftlendhub_LoanCancelled) {
            const user = await getUserByWallet(event.owner);
            if (user) {
              await notifyUser(
                user.chat_id,
                `🔔 Loan Cancelled!\n\nLoan ID: ${event.loanId}`
              );
            }
            lastProcessedBlocks.Nftlendhub_LoanCancelled = event._blockNumber;
          }
        }

        // Process LoanFunded events
        for (const event of events.Nftlendhub_LoanFunded) {
          if (event._blockNumber > lastProcessedBlocks.Nftlendhub_LoanFunded) {
            const borrower = await getUserByWallet(event.borrower);
            const lender = await getUserByWallet(event.lender);
            if (borrower) {
              await notifyUser(
                borrower.chat_id,
                `💰 Loan Funded!\n\nLoan ID: ${event.loanId}\nAmount: ${formatEther(event.loanAmount)}\nLender: ${formatWalletLink(event.lender)}`,
                { parse_mode: 'HTML' }
              );
            }
            if (lender) {
              await notifyUser(
                lender.chat_id,
                `💰 You Funded a Loan!\n\nLoan ID: ${event.loanId}\nAmount: ${formatEther(event.loanAmount)}\nBorrower: ${formatWalletLink(event.borrower)}`,
                { parse_mode: 'HTML' }
              );
            }
            lastProcessedBlocks.Nftlendhub_LoanFunded = event._blockNumber;
          }
        }

        // Process LoanClaimed events
        for (const event of events.Nftlendhub_LoanClaimed) {
          if (event._blockNumber > lastProcessedBlocks.Nftlendhub_LoanClaimed) {
            const user = await getUserByWallet(event.borrower);
            if (user) {
              await notifyUser(
                user.chat_id,
                `✅ Loan Claimed!\n\nLoan ID: ${event.loanId}\nAmount: ${formatEther(event.loanAmount)}`
              );
            }
            lastProcessedBlocks.Nftlendhub_LoanClaimed = event._blockNumber;
          }
        }

        // Process LoanRepaid events
        for (const event of events.Nftlendhub_LoanRepaid) {
          if (event._blockNumber > lastProcessedBlocks.Nftlendhub_LoanRepaid) {
            const borrower = await getUserByWallet(event.borrower);
            const lender = await getUserByWallet(event.lender);
            if (borrower) {
              await notifyUser(
                borrower.chat_id,
                `💵 Loan Repaid!\n\nLoan ID: ${event.loanId}\nAmount: ${formatEther(event.loanAmount)}\nLender: ${formatWalletLink(event.lender)}`,
                { parse_mode: 'HTML' }
              );
            }
            if (lender) {
              await notifyUser(
                lender.chat_id,
                `💵 Your Funded Loan was Repaid!\n\nLoan ID: ${event.loanId}\nAmount: ${formatEther(event.loanAmount)}\nBorrower: ${formatWalletLink(event.borrower)}`,
                { parse_mode: 'HTML' }
              );
            }
            lastProcessedBlocks.Nftlendhub_LoanRepaid = event._blockNumber;
          }
        }

        // Process RepaymentClaimed events
        for (const event of events.Nftlendhub_RepaymentClaimed) {
          if (event._blockNumber > lastProcessedBlocks.Nftlendhub_RepaymentClaimed) {
            const user = await getUserByWallet(event.lender);
            if (user) {
              await notifyUser(
                user.chat_id,
                `💸 Repayment Claimed!\n\nLoan ID: ${event.loanId}\nAmount: ${formatEther(event.loanAmount)}`
              );
            }
            lastProcessedBlocks.Nftlendhub_RepaymentClaimed = event._blockNumber;
          }
        }

        // Process NFTClaimedByLender events
        for (const event of events.Nftlendhub_NFTClaimedByLender) {
          if (event._blockNumber > lastProcessedBlocks.Nftlendhub_NFTClaimedByLender) {
            const user = await getUserByWallet(event.borrower);
            if (user) {
              await notifyUser(
                user.chat_id,
                `⚠️ NFT Claimed by Lender!\n\nLoan ID: ${event.loanId}\nLender: ${formatWalletLink(event.lender)}`,
                { parse_mode: 'HTML' }
              );
            }
            const lender = await getUserByWallet(event.lender);
            if (lender) {
              await notifyUser(
                lender.chat_id,
                `💰 Your NFT was Claimed!\n\nLoan ID: ${event.loanId}\nBorrower: ${formatWalletLink(event.borrower)}`,
                { parse_mode: 'HTML' }
              );
            }
            lastProcessedBlocks.Nftlendhub_NFTClaimedByLender = event._blockNumber;
          }
        }

        // Process NFTWithdrawn events
        for (const event of events.Nftlendhub_NFTWithdrawn) {
          if (event._blockNumber > lastProcessedBlocks.Nftlendhub_NFTWithdrawn) {
            const user = await getUserByWallet(event.owner);
            if (user) {
              await notifyUser(
                user.chat_id,
                `📤 NFT Withdrawn!\n\nLoan ID: ${event.loanId}`
              );
            }
            lastProcessedBlocks.Nftlendhub_NFTWithdrawn = event._blockNumber;
          }
        }

        // Check loan expiration status
        await checkLoanExpiration();

      } catch (error) {
        console.error('❌ Error processing events:', error);
      }
    }, pollInterval);

  } catch (error) {
    console.error('❌ Error in event listener:', error);
    // Attempt to restart the listener after a delay
    setTimeout(startListener, 5000);
  }
}; 