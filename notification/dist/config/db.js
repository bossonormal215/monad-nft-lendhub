"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testConnection = exports.db = void 0;
const promise_1 = __importDefault(require("mysql2/promise"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Validate environment variables
if (!process.env.DB_HOST)
    throw new Error('DB_HOST is not set in environment variables');
if (!process.env.DB_USER)
    throw new Error('DB_USER is not set in environment variables');
if (!process.env.DB_PASSWORD)
    throw new Error('DB_PASSWORD is not set in environment variables');
if (!process.env.DB_NAME)
    throw new Error('DB_NAME is not set in environment variables');
// Database configuration
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 60000, // 60 seconds
    port: 3306,
    family: 4,
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000,
    keepAliveIdleTimeout: 60000,
    keepAliveInterval: 10000,
    keepAliveCount: 10,
    keepAliveTimeout: 60000,
};
console.log('📝 Database configuration:', {
    host: dbConfig.host,
    user: dbConfig.user,
    database: dbConfig.database,
    port: dbConfig.port,
    // Don't log the password for security
});
// Create connection pool
exports.db = promise_1.default.createPool(dbConfig);
// Test database connection
const testConnection = async () => {
    let connection;
    try {
        console.log('🔄 Attempting to connect to database...');
        connection = await exports.db.getConnection();
        console.log('✅ Database connection successful');
        // Test the connection with a simple query
        console.log('🔄 Testing database query...');
        const [rows] = await connection.query('SELECT 1');
        console.log('✅ Database query test successful');
        return true;
    }
    catch (error) {
        console.error('❌ Database connection failed:', {
            code: error.code,
            errno: error.errno,
            sqlState: error.sqlState,
            sqlMessage: error.sqlMessage,
            address: error.address,
            port: error.port,
            stack: error.stack
        });
        // Additional error information
        if (error.code === 'ETIMEDOUT') {
            console.error('⚠️ Connection timed out. This could be due to:');
            console.error('1. Firewall blocking the connection');
            console.error('2. Database server not accepting connections from your IP');
            console.error('3. Network connectivity issues');
            console.error('Please check your Hostinger database settings and ensure your IP is whitelisted.');
        }
        throw error;
    }
    finally {
        if (connection) {
            connection.release();
        }
    }
};
exports.testConnection = testConnection;
