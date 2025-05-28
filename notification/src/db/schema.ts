import { db } from '../config/db';
import { RowDataPacket } from 'mysql2';

// User interface extending RowDataPacket
export interface User extends RowDataPacket {
  id: number;
  telegram_username: string;
  chat_id: string;
  wallet_address: string;
  registered_at: Date;
}

// Initialize database schema
export const initDatabase = async () => {
  try {
    // Create users table
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        telegram_username VARCHAR(255) NOT NULL,
        chat_id VARCHAR(255) NOT NULL,
        wallet_address VARCHAR(255) NOT NULL UNIQUE,
        registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Database schema initialized');
  } catch (error) {
    console.error('❌ Failed to initialize database:', error);
    throw error;
  }
};

// User management functions
export const addUser = async (
  username: string,
  chatId: string,
  walletAddress: string
) => {
  try {
    await db.query(
      'INSERT INTO users (telegram_username, chat_id, wallet_address) VALUES (?, ?, ?)',
      [username, chatId, walletAddress]
    );
    return true;
  } catch (error) {
    console.error('❌ Failed to add user:', error);
    return false;
  }
};

export const getUserByWallet = async (
  walletAddress: string
): Promise<User | null> => {
  try {
    const [rows] = await db.query<User[]>(
      'SELECT * FROM users WHERE wallet_address = ?',
      [walletAddress]
    );
    return rows[0] || null;
  } catch (error) {
    console.error('❌ Failed to get user:', error);
    return null;
  }
};

export const getUserByChatId = async (chatId: string): Promise<User | null> => {
  try {
    const [rows] = await db.query<User[]>(
      'SELECT * FROM users WHERE chat_id = ?',
      [chatId]
    );
    return rows[0] || null;
  } catch (error) {
    console.error('❌ Failed to get user:', error);
    return null;
  }
}; 