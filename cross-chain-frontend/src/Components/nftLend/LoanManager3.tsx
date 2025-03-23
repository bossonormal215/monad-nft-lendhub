// import { useEffect, useState } from "react";
// import { useAccount, useWriteContract, useReadContract } from "wagmi";
// import { parseUnits, formatUnits, erc20Abi } from "viem";
// import { LIQUIDITY_POOL_CONTRACT } from "@/contracts/contracts2";
// import { TOKENS, SupportedToken, TokenInfo } from "./config/tokens";
// import { useToast } from "@/Components/privy/ui/use-toast";


// export function LoanManager() {
//     const { address } = useAccount();
//     const { toast } = useToast();
  
//     const [amount, setAmount] = useState<string>("");
//     const [selectedToken, setSelectedToken] = useState<SupportedToken>("USDT");
//     const [userBalance, setUserBalance] = useState<string>("0");
//     const [repayStatus, setRepayStatus] = useState<string>("");
//     const [error, setError] = useState<string>("");
//     const [isLoading, setIsLoading] = useState<boolean>(false);
  
//     const tokenInfo: TokenInfo = TOKENS[selectedToken];
  
//     const fetchUserBalance = async () => {
//       if (!address || !tokenInfo) return;
//       try {
//         const balanceResult = await useReadContract({
//           address: tokenInfo.address,
//           abi: erc20Abi,
//           functionName: "balanceOf",
//           args: [address],
//         });
//         setUserBalance(formatUnits(balanceResult.data as bigint, tokenInfo.decimals));
//       } catch (err) {
//         console.error("Error fetching balance:", err);
//       }
//     };
  
//     useEffect(() => {
//       fetchUserBalance();
//     }, [selectedToken, address]);
  
//     const { writeContractAsync: approveToken } = useWriteContract();
//     const { writeContractAsync: repayLoan } = useWriteContract();
  
//     const handleRepay = async () => {
//       if (!amount || !address || !tokenInfo) return;
//       setIsLoading(true);
//       setRepayStatus("Approving token...");
  
//       try {
//         await approveToken({
//           address: tokenInfo.address,
//           abi: erc20Abi,
//           functionName: "approve",
//           args: [LIQUIDITY_POOL_CONTRACT, parseUnits(amount, tokenInfo.decimals)],
//         });
  
//         setRepayStatus("Approved. Repaying loan...");
//         await new Promise(resolve => setTimeout(resolve, 2000));
  
//         await repayLoan({
//           address: LIQUIDITY_POOL_CONTRACT,
//           abi: [
//             {
//               name: "repayLoan",
//               type: "function",
//               stateMutability: "nonpayable",
//               inputs: [
//                 { name: "token", type: "address" },
//                 { name: "amount", type: "uint256" },
//               ],
//               outputs: [],
//             },
//           ],
//           functionName: "repayLoan",
//           args: [tokenInfo.address, parseUnits(amount, tokenInfo.decimals)],
//         });
  
//         setRepayStatus("Loan repaid successfully! 🎉");
//         toast({ title: "Success", description: "Loan repaid!" });
//         setAmount("");
//         fetchUserBalance();
//       } catch (err) {
//         console.error(err);
//         setError("Transaction failed");
//       } finally {
//         setIsLoading(false);
//       }
//     };
  
//     return (
//       <div className="space-y-6 bg-[#0F172A] p-6 rounded-xl">
//         <h2 className="text-2xl font-bold text-white">Manage Loan</h2>
  
//         <div className="space-y-2">
//           <label className="text-sm text-gray-300">Select Token</label>
//           <select
//             value={selectedToken}
//             onChange={(e) => setSelectedToken(e.target.value as SupportedToken)}
//             className="w-full px-4 py-2 rounded bg-gray-800 text-white"
//           >
//             {Object.entries(TOKENS).map(([symbol, token]) => (
//               <option key={token.address} value={symbol}>
//                 {token.symbol}
//               </option>
//             ))}
//           </select>
//         </div>
  
//         <div className="text-gray-300">
//           Your Balance: <span className="text-white font-medium">{userBalance} {tokenInfo.symbol}</span>
//         </div>
  
//         <div className="space-y-2">
//           <label className="text-sm text-gray-300">Repayment Amount</label>
//           <input
//             type="number"
//             value={amount}
//             onChange={(e) => setAmount(e.target.value)}
//             className="w-full px-4 py-2 rounded bg-gray-800 text-white"
//             placeholder={`Enter amount in ${tokenInfo.symbol}`}
//             disabled={isLoading}
//           />
//         </div>
  
//         {error && <p className="text-red-500 text-sm">{error}</p>}
//         {repayStatus && <p className="text-green-500 text-sm">{repayStatus}</p>}
  
//         <button
//           onClick={handleRepay}
//           disabled={isLoading || !amount}
//           className="w-full py-2 bg-yellow-600 hover:bg-yellow-700 rounded text-white font-semibold"
//         >
//           {isLoading ? "Processing..." : `Repay with ${tokenInfo.symbol}`}
//         </button>
//       </div>
//     );
//   }
  
////////////////////////////////////////-------------------------////////////////////////////////
// LoanManager3.tsx
import { useEffect, useState } from "react";
import { useAccount, useWriteContract, useReadContract } from "wagmi";
import { parseUnits, formatUnits, erc20Abi } from "viem";
import { LIQUIDITY_POOL_CONTRACT } from "@/contracts/contracts2";
import { TOKENS, SupportedToken, TokenInfo } from "./config/tokens";
import { useToast } from "@/Components/privy/ui/use-toast";

interface LoanManagerProps {
  collateralId: number;
  maxLoanAmount: string;
  tokenSymbol: SupportedToken;
  onNFTWithdrawn: (collateralId: number) => Promise<void>;
}

export function LoanManager({ collateralId, maxLoanAmount, tokenSymbol, onNFTWithdrawn }: LoanManagerProps) {
  const { address } = useAccount();
  const { toast } = useToast();

  const [amount, setAmount] = useState<string>("");
  const [userBalance, setUserBalance] = useState<string>("0");
  const [repayStatus, setRepayStatus] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const tokenInfo: TokenInfo = TOKENS[tokenSymbol];

  const fetchUserBalance = async () => {
    if (!address || !tokenInfo) return;
    try {
      const balanceResult = await useReadContract({
        address: tokenInfo.address,
        abi: erc20Abi,
        functionName: "balanceOf",
        args: [address],
      });
      setUserBalance(formatUnits(balanceResult.data as bigint, tokenInfo.decimals));
    } catch (err) {
      console.error("Error fetching balance:", err);
    }
  };

  useEffect(() => {
    fetchUserBalance();
  }, [tokenSymbol, address]);

  const { writeContractAsync: approveToken } = useWriteContract();
  const { writeContractAsync: repayLoan } = useWriteContract();

  const handleRepay = async () => {
    if (!amount || !address || !tokenInfo) return;
    setIsLoading(true);
    setRepayStatus("Approving token...");

    try {
      await approveToken({
        address: tokenInfo.address,
        abi: erc20Abi,
        functionName: "approve",
        args: [LIQUIDITY_POOL_CONTRACT, parseUnits(amount, tokenInfo.decimals)],
      });

      setRepayStatus("Approved. Repaying loan...");
      await new Promise(resolve => setTimeout(resolve, 2000));

      await repayLoan({
        address: LIQUIDITY_POOL_CONTRACT,
        abi: [
          {
            name: "repayLoan",
            type: "function",
            stateMutability: "nonpayable",
            inputs: [
              { name: "token", type: "address" },
              { name: "amount", type: "uint256" },
            ],
            outputs: [],
          },
        ],
        functionName: "repayLoan",
        args: [tokenInfo.address, parseUnits(amount, tokenInfo.decimals)],
      });

      setRepayStatus("Loan repaid successfully! 🎉");
      toast({ title: "Success", description: "Loan repaid!" });
      setAmount("");
      fetchUserBalance();
    } catch (err) {
      console.error(err);
      setError("Transaction failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 bg-[#0F172A] p-6 rounded-xl">
      <h2 className="text-2xl font-bold text-white">Manage Loan</h2>

      <div className="text-gray-300">
        Your Balance: <span className="text-white font-medium">{userBalance} {tokenInfo.symbol}</span>
      </div>

      <div className="space-y-2">
        <label className="text-sm text-gray-300">Repayment Amount</label>
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
      {repayStatus && <p className="text-green-500 text-sm">{repayStatus}</p>}

      <button
        onClick={handleRepay}
        disabled={isLoading || !amount}
        className="w-full py-2 bg-yellow-600 hover:bg-yellow-700 rounded text-white font-semibold"
      >
        {isLoading ? "Processing..." : `Repay with ${tokenInfo.symbol}`}
      </button>

      <button
        onClick={() => onNFTWithdrawn(collateralId)}
        disabled={isLoading}
        className="w-full py-2 mt-2 bg-red-600 hover:bg-red-700 rounded text-white font-semibold"
      >
        Withdraw NFT
      </button>
    </div>
  );
}
