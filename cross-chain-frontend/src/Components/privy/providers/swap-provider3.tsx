"use client";

import { createContext, useContext, useState, type ReactNode, useCallback } from "react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { ethers } from "ethers";
import { Hex } from "viem";

// Define token interface
export interface Token {
  address: string;
  symbol: string;
  decimals: number;
  name: string;
}

// Define context interface
interface SwapContextType {
  tokens: Token[];
  fromToken: Token | null;
  toToken: Token | null;
  fromAmount: number;
  toAmount: number;
  swapQuote: any | null; // Use 'any' or define a more specific type
  swapping: boolean;
  error: string | null;
  setFromToken: (token: Token) => void;
  setToToken: (token: Token) => void;
  setFromAmount: (amount: number) => void;
  getQuote: () => Promise<void>;
  executeSwap: () => Promise<void>;
  switchTokens: () => void;
}

const SwapContext = createContext<SwapContextType | undefined>(undefined);

// Update token addresses with actual Monad testnet addresses
const MONAD_TESTNET_TOKENS: Token[] = [
  {
    address: "0x88b8E2161DEDC77EF4ab7585569D2415a1C1055D",
    symbol: "USDT",
    decimals: 6,
    name: "Tether USD",
  },
  {
    address: "0xf817257fed379853cDe0fa4F97AB987181B1E5Ea",
    symbol: "USDC",
    decimals: 6,
    name: "USDC",
  },
  {
    address: "0x760AfE86e5de5fa0Ee542fc7B7B713e1c5425701",
    symbol: "WMON",
    decimals: 18,
    name: "Wrapped MON",
  },
  {
    address: "0x5D876D73f4441D5f2438B1A3e2A51771B337F27A",
    symbol: "cUSDC",
    decimals: 6,
    name: "CURVANCE USDC",
  },
];

export function SwapProvider({ children }: { children: ReactNode }) {
  const [fromToken, setFromToken] = useState<Token | null>(MONAD_TESTNET_TOKENS[2]);
  const [toToken, setToToken] = useState<Token | null>(MONAD_TESTNET_TOKENS[0]);
  const [fromAmount, setFromAmount] = useState<number>(0);
  const [toAmount, setToAmount] = useState<number>(0);
  const [swapQuote, setSwapQuote] = useState<any | null>(null); // Use 'any' or define a more specific type
  const [swapping, setSwapping] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { user } = usePrivy();
  const { wallets } = useWallets();

  const getQuote = useCallback(async () => {
    if (!fromToken || !toToken || fromAmount <= 0 || !user?.wallet?.address) {
      setSwapQuote(null);
      return;
    }

    try {
      setError(null);

      const params = new URLSearchParams({
        chainId: "10143",
        sellToken: fromToken.address,
        buyToken: toToken.address,
        sellAmount: ethers.utils.parseUnits(fromAmount.toString(), fromToken.decimals).toString(),
        taker: user.wallet.address,
        skipValidation: "true",
        enableSlippageProtection: "true",
      });

      const response = await fetch(`/api/quote?${params.toString()}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const quoteData = await response.json();
      console.log("Quote data:", quoteData);
      setSwapQuote(quoteData);

      if (quoteData.error) {
        throw new Error(quoteData.error);
      }

      setToAmount(Number.parseFloat(ethers.utils.formatUnits(quoteData.buyAmount, toToken.decimals)));
    } catch (err: any) {
      console.error("Error getting quote:", err);
      setError(err.message || "Failed to get swap quote. Please try again.");
      setSwapQuote(null);
    }
  }, [fromToken, toToken, fromAmount, user]);

  const executeSwap = useCallback(async () => {
    if (!fromToken || !toToken || !swapQuote || !user?.wallet?.address) {
      return;
    }

    try {
      setSwapping(true);
      setError(null);

      const activeWallet = wallets.find((wallet) => wallet.address === user.wallet?.address);
      if (!activeWallet) {
        throw new Error("No active wallet found");
      }

      const provider = await activeWallet.getEthereumProvider();
      const ethersProvider = new ethers.providers.Web3Provider(provider);
      const signer = ethersProvider.getSigner();

      if (fromToken.address !== ethers.constants.AddressZero) {
        if (swapQuote.permit2Data) {
          const permit2Contract = new ethers.Contract(
            "0x000000000022D473030F116dDEE9F6B43aC78BA3",
            [
              "function allowance(address owner, address spender) view returns (uint256)",
              "function approve(address spender, uint256 amount) returns (bool)",
              "function symbol() view returns (string)",
              "function permitTransferFrom(tuple(address token, uint256 amount, uint256 nonce, uint256 deadline) permit, tuple(address from, address to, uint256 amount) transferDetails, address owner, bytes signature)",
            ],
            signer,
          );

          const deadline = Math.floor(Date.now() / 1000) + 3600;

          const currentAllowance = await permit2Contract.allowance(user.wallet.address, swapQuote.allowanceTarget);
          const requiredAllowance = ethers.BigNumber.from(swapQuote.sellAmount);

          console.log(`Checking ${fromToken.symbol} allowance:`, {
            current: ethers.utils.formatUnits(currentAllowance, fromToken.decimals),
            required: ethers.utils.formatUnits(requiredAllowance, fromToken.decimals),
          });

          if (currentAllowance.lt(requiredAllowance)) {
            console.log(`Approving ${fromToken.symbol}...`);
            const approveTx = await permit2Contract.approve(fromToken.address, swapQuote.allowanceTarget, ethers.constants.MaxUint256, deadline);
            await approveTx.wait();
            console.log(`${fromToken.symbol} approved`);
          }
        } else {
          const tokenContract = new ethers.Contract(
            fromToken.address,
            ["function approve(address spender, uint256 amount) public returns (bool)"],
            signer,
          );

          const approveTx = await tokenContract.approve(swapQuote.allowanceTarget, ethers.constants.MaxUint256);
          await approveTx.wait();
        }
      }

      const tx = await signer.sendTransaction({
        to: swapQuote.to,
        data: swapQuote.data,
        value: swapQuote.value,
        gasLimit: ethers.BigNumber.from(swapQuote.gas || "500000"),
      });

      const receipt = await tx.wait();
      console.log("Swap transaction confirmed:", receipt);

      if (receipt.status === 1) {
        setFromAmount(0);
        setToAmount(0);
        setSwapQuote(null);
        console.log("Swap executed successfully!");
      } else {
        throw new Error("Transaction failed");
      }
    } catch (err: any) {
      console.error("Error executing swap:", err);
      setError(err.message || "Failed to execute swap. Please try again.");
    } finally {
      setSwapping(false);
    }
  }, [fromToken, toToken, swapQuote, user, wallets]);

  // Switch from and to tokens
  const switchTokens = () => {
    if (!fromToken || !toToken) return

    const tempToken = fromToken
    const tempAmount = fromAmount

    setFromToken(toToken)
    setToToken(tempToken)

    if (swapQuote) {
      setFromAmount(toAmount)
      setToAmount(tempAmount)
      setTimeout(() => getQuote(), 0)
    }
  }

  return (
    <SwapContext.Provider
      value={{
        tokens: MONAD_TESTNET_TOKENS,
        fromToken,
        toToken,
        fromAmount,
        toAmount,
        swapQuote,
        swapping,
        error,
        setFromToken,
        setToToken,
        setFromAmount,
        getQuote,
        executeSwap,
        switchTokens,
      }}
    >
      {children}
    </SwapContext.Provider>
  )
}

export function useSwap() {
  const context = useContext(SwapContext)
  if (context === undefined) {
    throw new Error("useSwap must be used within a SwapProvider")
  }
  return context
}

