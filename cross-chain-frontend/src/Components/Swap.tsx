"use client";

import { useState, useEffect } from "react";
import { getSwapQuote } from "@/utils/0xSwap";
import { usePrivy } from "@privy-io/react-auth";
import { SUPPORTED_TOKENS } from "../utils/0xTokens";

export default function Swap() {
  const { user, authenticated, login } = usePrivy();
  const [fromToken, setFromToken] = useState(SUPPORTED_TOKENS[0]);
  const [toToken, setToToken] = useState(SUPPORTED_TOKENS[1]);
  const [amount, setAmount] = useState("");
  const [quote, setQuote] = useState<any>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [isSwappable, setIsSwappable] = useState(false);

  // Fetch quote when the user enters an amount
  useEffect(() => {
    if (amount && Number(amount) > 0) fetchQuote();
  }, [amount]);

  async function fetchQuote() {
    if (!authenticated) return alert("Please log in with Privy first!");

    setIsFetching(true);
    setIsSwappable(false);

    try {
      const takerAddress = user?.wallet?.address;
      if (!takerAddress) throw new Error("No wallet address found");

      const swapQuote = await getSwapQuote(
        fromToken.address,
        toToken.address,
        amount,
        takerAddress
      );

      setQuote(swapQuote);
      if (swapQuote) setIsSwappable(true);
    } catch (error) {
      console.error("Error fetching quote:", error);
      alert("❌ Failed to fetch swap quote");
    }

    setIsFetching(false);
  }

  return (
    <div className="w-full max-w-[464px] mx-auto p-4 bg-[#0D111C] rounded-[20px] border border-[#1C2839]">
      {/* Header */}
      {/* <div className="flex justify-between items-center mb-3 px-1">
        <h2 className="text-[20px] font-medium text-[#F5F6FC]">Swap</h2>
        <button className="p-2 hover:bg-[#1C2839] rounded-xl transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#98A1C0" strokeWidth="2">
            <path d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
      </div> */}

      {/* Sell Section */}
      <div className="p-4 bg-[#131A2A] rounded-[20px] mb-1">
        <div className="flex justify-between mb-1">
          <span className="text-sm text-[#98A1C0]">You pay</span>
          <span className="text-sm text-[#98A1C0]">Balance: 0</span>
        </div>
        <div className="flex justify-between items-center">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            // className="text-[36px] font-medium bg-transparent outline-none text-[#F5F6FC] w-[200px] placeholder-[#5D6785]"
            className="w-full px-4 py-3 bg-[#131A2A] border border-[#1C2839] rounded-[20px]
                             text-[#F5F6FC] placeholder-[#5D6785] focus:outline-none focus:border-[#98A1C0]
                             transition-colors"
          />
          <select
            value={fromToken.symbol}
            onChange={(e) => setFromToken(SUPPORTED_TOKENS.find(t => t.symbol === e.target.value)!)}
            className="bg-[#222C3B] text-[#F5F6FC] px-4 py-2 h-[40px] rounded-[20px] outline-none cursor-pointer hover:bg-[#2C3545] transition-colors"
          >
            {SUPPORTED_TOKENS.map((token) => (
              <option key={token.symbol} value={token.symbol}>{token.symbol}</option>
            ))}
          </select>
        </div>
        <div className="text-sm text-right text-[#5D6785]">$0.00</div>
      </div>

      {/* Swap Direction Button */}
      <div className="flex justify-center -my-2.5 relative z-10">
        <button className="w-8 h-8 bg-[#131A2A] rounded-lg border border-[#1C2839] flex items-center justify-center hover:border-[#98A1C0] transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#98A1C0" strokeWidth="2">
            <path d="M12 5l0 14M5 12l7 7 7-7" />
          </svg>
        </button>
      </div>

      {/* Buy Section */}
      <div className="p-4 bg-[#131A2A] rounded-[20px]">
        <div className="flex justify-between mb-1">
          <span className="text-sm text-[#98A1C0]">You receive</span>
          <span className="text-sm text-[#98A1C0]">Balance: 0</span>
        </div>
        <div className="flex justify-between items-center">
          <input
            type="number"
            value={quote?.minBuyAmount || "0"}
            readOnly
            placeholder="0"
            // className="text-[36px] font-medium bg-transparent outline-none text-[#F5F6FC] w-[200px] placeholder-[#5D6785]"
            className="w-full px-4 py-3 bg-[#131A2A] border border-[#1C2839] rounded-[20px]
                             text-[#F5F6FC] placeholder-[#5D6785] focus:outline-none focus:border-[#98A1C0]
                             transition-colors"
          />
          <select
            value={toToken.symbol}
            onChange={(e) => setToToken(SUPPORTED_TOKENS.find(t => t.symbol === e.target.value)!)}
            className="bg-[#222C3B] text-[#F5F6FC] px-4 py-2 h-[40px] rounded-[20px] outline-none cursor-pointer hover:bg-[#2C3545] transition-colors"
          >
            {SUPPORTED_TOKENS.map((token) => (
              <option key={token.symbol} value={token.symbol}>{token.symbol}</option>
            ))}
          </select>
        </div>
        <div className="text-sm text-right text-[#5D6785]">$0.00</div>
      </div>

      {/* Quote Info */}
      {quote && (
        <div className="mt-3 p-3 bg-[#131A2A] rounded-2xl">
          <div className="flex justify-between text-sm text-[#98A1C0]">
            <span>Rate</span>
            <span>1 {fromToken.symbol} = {quote.price} {toToken.symbol}</span>
          </div>
          <div className="flex justify-between text-sm text-[#98A1C0] mt-1">
            <span>Network Fee</span>
            <span>{quote.gas} MONAD</span>
          </div>
        </div>
      )}

      {/* Action Button */}
      <button
        className={`w-full mt-3 py-4 rounded-[20px] font-semibold text-[16px] transition-colors
                   ${!authenticated
            ? 'bg-[#4C82FB] text-[#F5F6FC] hover:bg-[#4573DE]'
            : isSwappable
              ? 'bg-[#4C82FB] text-[#F5F6FC] hover:bg-[#4573DE]'
              : 'bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] text-white hover:opacity-90 cursor-not-allowed'}`}
        disabled={!isSwappable && authenticated}
        onClick={authenticated ? undefined : login}
      >
        {!authenticated
          ? 'Login via Privy'
          : isFetching
            ? 'Fetching Quote...'
            : (isSwappable ? 'Swap' : 'Enter an amount')}
      </button>
    </div>
  );
}

