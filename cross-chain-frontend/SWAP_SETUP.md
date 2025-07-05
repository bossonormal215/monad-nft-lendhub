# Swap Component Setup Guide

This guide explains how to set up and use the token swap component built with Privy and 0x Protocol.

## Prerequisites

1. **0x API Key**: You need to register with 0x and get an API key from their [dashboard](https://dashboard.0x.org/).
2. **Privy Configuration**: Ensure Privy is properly configured in your project.
3. **Monad Testnet**: The component is configured for Monad testnet (Chain ID: 10143).

## Environment Variables

Add the following environment variable to your `.env.local` file:

```bash
NEXT_PUBLIC_0X_API_KEY=your_0x_api_key_here
```

## How to Get a 0x API Key

1. Go to [0x Dashboard](https://dashboard.0x.org/)
2. Create an account or sign in
3. Navigate to the API Keys section
4. Create a new API key
5. Copy the API key and add it to your environment variables

## Supported Tokens

The component currently supports the following tokens on Monad testnet:

- **USDC**: `0xf817257fed379853cDe0fa4F97AB987181B1E5Ea`
- **WMON**: `0x760AfE86e5de5fa0Ee542fc7B7B713e1c5425701`
- **USDT**: `0x88b8E2161DEDC77EF4ab7585569D2415a1C1055D`

## How It Works

### 1. Token Approval (Permit2)
For ERC20 tokens like USDC, the component first approves the Permit2 contract to spend tokens on behalf of the user. This is a one-time action per token.

### 2. Quote Fetching
When a user enters an amount, the component fetches a quote from 0x API showing:
- Estimated output amount
- Exchange rate
- Transaction details

### 3. Swap Execution
The swap process involves:
1. Signing a Permit2 message (off-chain signature)
2. Executing the swap transaction on-chain
3. Receiving the swapped tokens

## Usage

### Basic Usage

```tsx
import { CurvanceSwap } from "@/components/curvance/curvance";

function MyPage() {
  return (
    <div>
      <CurvanceSwap />
    </div>
  );
}
```

### With Custom Styling

```tsx
import { CurvanceSwap } from "@/components/curvance/curvance";

function MyPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <CurvanceSwap />
    </div>
  );
}
```

## Features

- **Real-time Quotes**: Fetches live quotes from 0x API
- **Token Switching**: Easy token selection with dropdown menus
- **Amount Switching**: Quick swap between input and output amounts
- **Error Handling**: Comprehensive error messages and validation
- **Loading States**: Visual feedback during transactions
- **Transaction Confirmation**: Toast notifications for successful operations

## Error Handling

The component handles various error scenarios:

- **API Key Missing**: Shows error if 0x API key is not configured
- **Network Errors**: Handles network connectivity issues
- **Transaction Failures**: Shows specific error messages for failed transactions
- **Insufficient Balance**: Validates user balance before transactions

## Security Considerations

1. **API Key**: Keep your 0x API key secure and never expose it in client-side code
2. **Transaction Signing**: All transactions require user approval through their wallet
3. **Permit2**: Uses Permit2 for gasless approvals and better UX

## Troubleshooting

### Common Issues

1. **"0x API key not configured"**
   - Ensure `NEXT_PUBLIC_0X_API_KEY` is set in your environment variables
   - Restart your development server after adding the environment variable

2. **"Failed to get quote"**
   - Check your internet connection
   - Verify the 0x API key is valid
   - Ensure the token addresses are correct for Monad testnet

3. **"Transaction failed"**
   - Check if user has sufficient balance
   - Ensure user has enough gas for the transaction
   - Verify the user is connected to Monad testnet

### Debug Mode

To enable debug logging, add this to your component:

```tsx
// Add this before the return statement in CurvanceSwap
console.log('Debug info:', {
  fromToken,
  toToken,
  fromAmount,
  quote,
  isApproved
});
```

## API Reference

### CurvanceSwap Props

The component doesn't accept any props currently, but you can customize it by modifying the component directly.

### Supported Networks

Currently configured for:
- **Monad Testnet**: Chain ID 10143

To add support for other networks, update the `CHAIN_ID` constant and token addresses in the component.

## Contributing

To extend the component:

1. Add new tokens to the `TOKENS` array
2. Update the chain ID for different networks
3. Modify the UI components as needed
4. Add additional error handling for specific scenarios

## License

This component is part of the cross-chain frontend project and follows the same license terms. 