"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const schema_1 = require("./db/schema");
const bot_1 = require("./bot");
const listener_1 = require("./listener");
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const db_1 = require("./config/db");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).send('OK');
});
// Initialize bot and start server
async function main() {
    try {
        // Test database connection first
        await (0, db_1.testConnection)();
        console.log('✅ Database connection test successful');
        // Initialize database schema
        await (0, schema_1.initDatabase)();
        console.log('✅ Database schema initialized');
        // Initialize bot
        (0, bot_1.initBot)();
        console.log('✅ Bot initialized');
        // Start contract event listener
        await (0, listener_1.startListener)();
        console.log('✅ Event listener started');
        // Start server
        app.listen(port, () => {
            console.log(`🚀 Server running on port ${port}`);
        });
    }
    catch (error) {
        console.error('❌ Error starting application:', error);
        process.exit(1);
    }
}
// Start the application
main();
// Handle graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    process.exit(0);
});
process.on('SIGINT', () => {
    console.log('SIGINT received. Shutting down gracefully...');
    process.exit(0);
});
