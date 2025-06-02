import { createConnection } from 'net';
import dotenv from 'dotenv';

dotenv.config();

const host = process.env.DB_HOST;
const port = 3306;

console.log(`Testing connection to ${host}:${port}...`);

const client = createConnection({ host, port, family: 4 }, () => {
  console.log('✅ Successfully connected to the server');
  client.end();
});

client.on('error', (err) => {
  console.error('❌ Connection error:', err);
});

client.on('timeout', () => {
  console.error('❌ Connection timed out');
  client.end();
});

// Set a timeout
setTimeout(() => {
  if (client.connecting) {
    console.error('❌ Connection attempt timed out');
    client.end();
  }
}, 10000); 