"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notifyNFTClaimed = exports.notifyRepaymentReady = exports.notifyLenderFunded = exports.notifyLoanRepaid = exports.notifyLoanClaimed = exports.notifyLoanFunded = exports.notifyUser = exports.initBot = exports.bot = void 0;
const node_telegram_bot_api_1 = __importDefault(require("node-telegram-bot-api"));
const dotenv_1 = __importDefault(require("dotenv"));
const schema_1 = require("./db/schema");
dotenv_1.default.config();
exports.bot = new node_telegram_bot_api_1.default(process.env.TELEGRAM_BOT_TOKEN, {
    polling: true,
});
// Store temporary user data during registration
const userRegistrationState = {};
// Initialize bot commands
const initBot = () => {
    // Handle /start command
    exports.bot.onText(/\/start/, async (msg) => {
        const chatId = msg.chat.id.toString();
        const username = msg.from?.username || 'anonymous';
        // Check if user is already registered
        const existingUser = await (0, schema_1.getUserByChatId)(chatId);
        if (existingUser) {
            exports.bot.sendMessage(chatId, '👋 Welcome back! You are already registered.');
            return;
        }
        // Start registration process
        userRegistrationState[chatId] = { step: 1 };
        exports.bot.sendMessage(chatId, '👋 Welcome to NFTLendHub Notifications!\n\nPlease enter your wallet address to register:');
    });
    // Handle wallet address input
    exports.bot.on('message', async (msg) => {
        const chatId = msg.chat.id.toString();
        const username = msg.from?.username || 'anonymous';
        const text = msg.text || '';
        // Skip if not in registration process
        if (!userRegistrationState[chatId])
            return;
        // Handle wallet address input
        if (userRegistrationState[chatId].step === 1) {
            // Basic wallet address validation (you might want to enhance this)
            if (!text.startsWith('0x') || text.length !== 42) {
                exports.bot.sendMessage(chatId, '❌ Invalid wallet address. Please enter a valid Ethereum address:');
                return;
            }
            // Store wallet address and complete registration
            userRegistrationState[chatId].walletAddress = text;
            const success = await (0, schema_1.addUser)(username, chatId, text);
            if (success) {
                exports.bot.sendMessage(chatId, '✅ Registration successful! You will now receive notifications about your loans.');
            }
            else {
                exports.bot.sendMessage(chatId, '❌ Registration failed. This wallet might already be registered.');
            }
            // Clean up registration state
            delete userRegistrationState[chatId];
        }
    });
};
exports.initBot = initBot;
// Notification functions
const notifyUser = async (chatId, message) => {
    try {
        await exports.bot.sendMessage(chatId, message);
    }
    catch (err) {
        console.error(`❌ Failed to send message to chat ${chatId}:`, err);
    }
};
exports.notifyUser = notifyUser;
// Specific notification types
const notifyLoanFunded = async (chatId, loanId) => {
    await (0, exports.notifyUser)(chatId, `🎉 Your loan #${loanId} was funded! You can now claim it on lendhub.`);
};
exports.notifyLoanFunded = notifyLoanFunded;
const notifyLoanClaimed = async (chatId, loanId) => {
    await (0, exports.notifyUser)(chatId, `✅ You claimed loan #${loanId} on lendhub. Funds transferred!`);
};
exports.notifyLoanClaimed = notifyLoanClaimed;
const notifyLoanRepaid = async (chatId, loanId) => {
    await (0, exports.notifyUser)(chatId, `💸 You repaid loan #${loanId} on lendhub. Well done!`);
};
exports.notifyLoanRepaid = notifyLoanRepaid;
const notifyLenderFunded = async (chatId, loanId) => {
    await (0, exports.notifyUser)(chatId, `🤝 You funded loan #${loanId} on lendhub .`);
};
exports.notifyLenderFunded = notifyLenderFunded;
const notifyRepaymentReady = async (chatId, loanId) => {
    await (0, exports.notifyUser)(chatId, `💰 Repayment for loan #${loanId} is ready on lendhub. Claim it!`);
};
exports.notifyRepaymentReady = notifyRepaymentReady;
const notifyNFTClaimed = async (chatId, loanId, nftId) => {
    await (0, exports.notifyUser)(chatId, `🔓 You claimed NFT #${nftId} from loan #${loanId} after default on lendhub.`);
};
exports.notifyNFTClaimed = notifyNFTClaimed;
