import { initDatabase } from './db';
import { initBot } from './bot';
import { startListener } from './listener';
import dotenv from 'dotenv';
import express, { Request, Response } from 'express';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).send('OK');
});

// Initialize bot and start server
async function main() {
  try {
    // Initialize database
    await initDatabase();
    console.log('✅ Database initialized');

    // Initialize bot
    initBot();
    console.log('✅ Bot initialized');

    // Start contract event listener
    await startListener();
    console.log('✅ Event listener started');

    // Start server
    app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
    });

  } catch (error) {
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