"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserByChatId = exports.getUserByWallet = exports.addUser = exports.initDatabase = void 0;
const db_1 = require("../config/db");
// Initialize database schema
const initDatabase = async () => {
    try {
        // Create users table
        await db_1.db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        telegram_username VARCHAR(255) NOT NULL,
        chat_id VARCHAR(255) NOT NULL,
        wallet_address VARCHAR(255) NOT NULL UNIQUE,
        registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
        console.log('✅ Database schema initialized');
    }
    catch (error) {
        console.error('❌ Failed to initialize database:', error);
        throw error;
    }
};
exports.initDatabase = initDatabase;
// User management functions
const addUser = async (username, chatId, walletAddress) => {
    try {
        await db_1.db.query('INSERT INTO users (telegram_username, chat_id, wallet_address) VALUES (?, ?, ?)', [username, chatId, walletAddress]);
        return true;
    }
    catch (error) {
        console.error('❌ Failed to add user:', error);
        return false;
    }
};
exports.addUser = addUser;
const getUserByWallet = async (walletAddress) => {
    try {
        const [rows] = await db_1.db.query('SELECT * FROM users WHERE wallet_address = ?', [walletAddress]);
        return rows[0] || null;
    }
    catch (error) {
        console.error('❌ Failed to get user:', error);
        return null;
    }
};
exports.getUserByWallet = getUserByWallet;
const getUserByChatId = async (chatId) => {
    try {
        const [rows] = await db_1.db.query('SELECT * FROM users WHERE chat_id = ?', [chatId]);
        return rows[0] || null;
    }
    catch (error) {
        console.error('❌ Failed to get user:', error);
        return null;
    }
};
exports.getUserByChatId = getUserByChatId;
