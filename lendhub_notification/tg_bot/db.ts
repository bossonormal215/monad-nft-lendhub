import mysql, { RowDataPacket, PoolOptions } from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

// Define User interface extending RowDataPacket
interface User extends RowDataPacket {
  id: number;
  telegram_username: string;
  chat_id: string;
  wallet_address: string;
  registered_at: Date;
}

// Validate database configuration
if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_NAME) {
  throw new Error('Missing required database configuration. Please check your .env file');
}

const dbConfig: PoolOptions = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000, // 10 seconds
};

export const db = mysql.createPool(dbConfig);

// Test database connection
const testConnection = async () => {
  try {
    const connection = await db.getConnection();
    console.log('✅ Database connection successful');
    connection.release();
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    throw error;
  }
};

// Initialize database schema
export const initDatabase = async () => {
  try {
    // First test the connection
    await testConnection();

    // Then create the table
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
export const addUser = async (username: string, chatId: string, walletAddress: string) => {
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

export const getUserByWallet = async (walletAddress: string): Promise<User | null> => {
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
