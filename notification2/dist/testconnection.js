"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const net_1 = require("net");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const host = process.env.DB_HOST;
const port = 3306;
console.log(`Testing connection to ${host}:${port}...`);
const client = (0, net_1.createConnection)({ host, port, family: 4 }, () => {
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
