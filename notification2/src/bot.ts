import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';
import { addUser, getUserByChatId } from './db/schema';

dotenv.config();

export const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN!, {
  polling: true,
});

// Store temporary user data during registration
const userRegistrationState: { [key: string]: { step: number; walletAddress?: string } } = {};

// Initialize bot commands
export const initBot = () => {
  // Handle /start command
  bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id.toString();
    const username = msg.from?.username || 'anonymous';

    // Check if user is already registered
    const existingUser = await getUserByChatId(chatId);
    if (existingUser) {
      bot.sendMessage(chatId, '👋 Welcome back! You are already registered.');
      return;
    }

    // Start registration process
    userRegistrationState[chatId] = { step: 1 };
    bot.sendMessage(
      chatId,
      '👋 Welcome to NFTLendHub Notifications!\n\nPlease enter your wallet address to register:'
    );
  });

  // Handle wallet address input
  bot.on('message', async (msg) => {
    const chatId = msg.chat.id.toString();
    const username = msg.from?.username || 'anonymous';
    const text = msg.text || '';

    // Skip if not in registration process
    if (!userRegistrationState[chatId]) return;

    // Handle wallet address input
    if (userRegistrationState[chatId].step === 1) {
      // Basic wallet address validation (you might want to enhance this)
      if (!text.startsWith('0x') || text.length !== 42) {
        bot.sendMessage(chatId, '❌ Invalid wallet address. Please enter a valid Ethereum address:');
        return;
      }

      // Store wallet address and complete registration
      userRegistrationState[chatId].walletAddress = text;
      const success = await addUser(username, chatId, text);

      if (success) {
        bot.sendMessage(
          chatId,
          '✅ Registration successful! You will now receive notifications about your loans.'
        );
      } else {
        bot.sendMessage(
          chatId,
          '❌ Registration failed. This wallet might already be registered.'
        );
      }

      // Clean up registration state
      delete userRegistrationState[chatId];
    }
  });
};

// Notification functions
export const notifyUser = async (chatId: string, message: string, options?: { parse_mode?: 'HTML' | 'Markdown' }) => {
  try {
    await bot.sendMessage(chatId, message, options);
  } catch (err) {
    console.error(`❌ Failed to send message to chat ${chatId}:`, err);
  }
};

// Specific notification types
export const notifyLoanFunded = async (chatId: string, loanId: string) => {
  await notifyUser(chatId, `🎉 Your loan #${loanId} was funded! You can now claim it on lendhub.`);
};

export const notifyLoanClaimed = async (chatId: string, loanId: string) => {
  await notifyUser(chatId, `✅ You claimed loan #${loanId} on lendhub. Funds transferred!`);
};

export const notifyLoanRepaid = async (chatId: string, loanId: string) => {
  await notifyUser(chatId, `💸 You repaid loan #${loanId} on lendhub. Well done!`);
};

export const notifyLenderFunded = async (chatId: string, loanId: string) => {
  await notifyUser(chatId, `🤝 You funded loan #${loanId} on lendhub .`);
};

export const notifyRepaymentReady = async (chatId: string, loanId: string) => {
  await notifyUser(chatId, `💰 Repayment for loan #${loanId} is ready on lendhub. Claim it!`);
};

export const notifyNFTClaimed = async (chatId: string, loanId: string, nftId: string) => {
  await notifyUser(chatId, `🔓 You claimed NFT #${nftId} from loan #${loanId} after default on lendhub.`);
}; 