import { useEffect, useState } from "react";
import { useAccount, useWriteContract, useReadContract } from "wagmi";
import { parseUnits, formatUnits, erc20Abi } from "viem";
import { LIQUIDITY_POOL_CONTRACT } from "@/contracts/contracts2";
import { TOKENS, SupportedToken, TokenInfo } from "./config/tokens";
import { useToast } from "@/Components/privy/ui/use-toast";

export function LiquidityProvider() {
  const { address } = useAccount();
  const { toast } = useToast();

  const [amount, setAmount] = useState<string>("");
  const [selectedToken, setSelectedToken] = useState<SupportedToken>("USDT");
  const [userBalance, setUserBalance] = useState<string>("0");
  const [poolLiquidity, setPoolLiquidity] = useState<string>("0");
  const [userDeposit, setUserDeposit] = useState<string>("0");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<string>("");
  const [error, setError] = useState<string>("");

  const tokenInfo: TokenInfo = TOKENS[selectedToken];

  const fetchBalances = async () => {
    if (!address || !tokenInfo) return;
    try {
      const balanceResult = await useReadContract({
        address: tokenInfo.address,
        abi: erc20Abi,
        functionName: "balanceOf",
        args: [address],
      });

      const liquidityResult = await useReadContract({
        address: LIQUIDITY_POOL_CONTRACT,
        abi: [
          {
            name: "getAvailableLiquidity",
            type: "function",
            stateMutability: "view",
            inputs: [{ name: "token", type: "address" }],
            outputs: [{ name: "", type: "uint256" }],
          },
        ],
        functionName: "getAvailableLiquidity",
        args: [tokenInfo.address],
      });

      const depositResult = await useReadContract({
        address: LIQUIDITY_POOL_CONTRACT,
        abi: [
          {
            name: "getUserDeposit",
            type: "function",
            stateMutability: "view",
            inputs: [
              { name: "user", type: "address" },
              { name: "token", type: "address" },
            ],
            outputs: [{ name: "", type: "uint256" }],
          },
        ],
        functionName: "getUserDeposit",
        args: [address, tokenInfo.address],
      });

      setUserBalance(formatUnits(balanceResult.data as bigint, tokenInfo.decimals));
      setPoolLiquidity(formatUnits(liquidityResult.data as bigint, tokenInfo.decimals));
      setUserDeposit(formatUnits(depositResult.data as bigint, tokenInfo.decimals));
    } catch (err) {
      console.error("Error fetching balances:", err);
    }
  };

  useEffect(() => {
    fetchBalances();
  }, [selectedToken, address]);

  const { writeContractAsync: approveToken } = useWriteContract();
  const { writeContractAsync: addLiquidity } = useWriteContract();
  const { writeContractAsync: removeLiquidity } = useWriteContract();

  const handleApproveAndDeposit = async () => {
    if (!tokenInfo || !amount || !address) return;
    setIsLoading(true);
    setStatus("Approving token...");

    try {
      await approveToken({
        address: tokenInfo.address,
        abi: erc20Abi,
        functionName: "approve",
        args: [LIQUIDITY_POOL_CONTRACT, parseUnits(amount, tokenInfo.decimals)],
      });

      setStatus("Token approved. Adding liquidity...");
      await new Promise(resolve => setTimeout(resolve, 2000));

      await addLiquidity({
        address: LIQUIDITY_POOL_CONTRACT,
        abi: [
          {
            name: "addLiquidity",
            type: "function",
            stateMutability: "nonpayable",
            inputs: [
              { name: "token", type: "address" },
              { name: "amount", type: "uint256" },
            ],
            outputs: [],
          },
        ],
        functionName: "addLiquidity",
        args: [tokenInfo.address, parseUnits(amount, tokenInfo.decimals)],
      });

      setStatus("Liquidity added successfully! 🎉");
      toast({ title: "Success", description: "Liquidity added!" });
      setAmount("");
      fetchBalances();
    } catch (err) {
      console.error(err);
      setError("Transaction failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!tokenInfo || !amount || !address) return;
    setIsLoading(true);
    setStatus("Processing withdrawal...");

    try {
      await removeLiquidity({
        address: LIQUIDITY_POOL_CONTRACT,
        abi: [
          {
            name: "removeLiquidity",
            type: "function",
            stateMutability: "nonpayable",
            inputs: [
              { name: "token", type: "address" },
              { name: "amount", type: "uint256" },
            ],
            outputs: [],
          },
        ],
        functionName: "removeLiquidity",
        args: [tokenInfo.address, parseUnits(amount, tokenInfo.decimals)],
      });

      setStatus("Withdrawal successful! 🎉");
      toast({ title: "Success", description: "Liquidity withdrawn!" });
      setAmount("");
      fetchBalances();
    } catch (err) {
      console.error(err);
      setError("Failed to withdraw liquidity");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 bg-[#131A2A] p-6 rounded-xl">
      <h2 className="text-2xl font-bold text-white">Liquidity Pool</h2>

      <div className="space-y-2">
        <label className="text-sm text-gray-300">Select Token</label>
        <select
          value={selectedToken}
          onChange={(e) => setSelectedToken(e.target.value as SupportedToken)}
          className="w-full px-4 py-2 rounded bg-gray-800 text-white"
        >
          {Object.entries(TOKENS).map(([symbol, token]) => (
            <option key={token.address} value={symbol}>
              {token.symbol}
            </option>
          ))}
        </select>
      </div>

      <div className="text-gray-300 space-y-1">
        <p>Your Balance: <span className="text-white font-medium">{userBalance} {tokenInfo.symbol}</span></p>
        <p>Your Deposit: <span className="text-white font-medium">{userDeposit} {tokenInfo.symbol}</span></p>
        <p>Pool Liquidity: <span className="text-white font-medium">{poolLiquidity} {tokenInfo.symbol}</span></p>
      </div>

      <div className="space-y-2">
        <label className="text-sm text-gray-300">Amount</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full px-4 py-2 rounded bg-gray-800 text-white"
          placeholder={`Enter amount in ${tokenInfo.symbol}`}
          disabled={isLoading}
        />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}
      {status && <p className="text-green-500 text-sm">{status}</p>}

      <div className="flex gap-4">
        <button
          onClick={handleApproveAndDeposit}
          disabled={isLoading || !amount}
          className="flex-1 py-2 bg-green-600 hover:bg-green-700 rounded text-white font-semibold"
        >
          {isLoading ? "Processing..." : "Add Liquidity"}
        </button>

        <button
          onClick={handleWithdraw}
          disabled={isLoading || !amount}
          className="flex-1 py-2 bg-red-600 hover:bg-red-700 rounded text-white font-semibold"
        >
          {isLoading ? "Processing..." : "Withdraw"}
        </button>
      </div>
    </div>
  );
}
