# NFTLendHub Telegram Notification Bot

A Telegram bot that sends notifications to users about their NFT loan milestones on the NFTLendHub platform.

## Features

- User registration with wallet address
- Real-time notifications for loan events:
  - Loan funding
  - Loan claiming
  - Loan repayment
  - Repayment claiming
  - NFT claiming by lender
  - NFT withdrawal

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Fill in the environment variables in `.env`:
   - Get a Telegram bot token from [@BotFather](https://t.me/BotFather)
   - Set up your MySQL database
   - Configure your Monad RPC URL
   - Add your NFTLendHub contract address

5. Build the project:
   ```bash
   npm run build
   ```

6. Start the bot:
   ```bash
   npm start
   ```

## Development

For development with hot-reload:
```bash
npm run dev
```

## Usage

1. Start a chat with your bot on Telegram
2. Send `/start` to begin registration
3. Enter your wallet address when prompted
4. You'll now receive notifications for all loan-related events

## Database Schema

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  telegram_username VARCHAR(255) NOT NULL,
  chat_id VARCHAR(255) NOT NULL,
  wallet_address VARCHAR(255) NOT NULL UNIQUE,
  registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## License

MIT 