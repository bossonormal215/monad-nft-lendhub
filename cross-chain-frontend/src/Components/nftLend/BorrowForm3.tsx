// import { useEffect, useState } from "react";
// import { useAccount, useWriteContract, useReadContract } from "wagmi";
// import { parseUnits, formatUnits, erc20Abi } from "viem";
// import { LoanManagerABI2 } from "@/contracts/interfaces/LoanManager2";
// import { LOAN_MANAGER_CONTRACT } from "@/contracts/contracts2";
// import { SupportedToken, TOKENS } from "./config/tokens";
// import { useToast } from "@/Components/privy/ui/use-toast";

// interface BorrowFormProps {
//   collateralId: number;
//   maxLoanAmount: string;
// }

// export function BorrowForm({ collateralId, maxLoanAmount }: BorrowFormProps) {
//   const { address } = useAccount();
//   const { toast } = useToast();

//   const [selectedToken, setSelectedToken] = useState<SupportedToken>("USDT");
//   const [amount, setAmount] = useState<string>("");
//   const [duration, setDuration] = useState<number>(0);
//   const [status, setStatus] = useState<string>("");
//   const [error, setError] = useState<string>("");
//   const [isLoading, setIsLoading] = useState<boolean>(false);

//   const tokenInfo = TOKENS[selectedToken];

//   const { writeContractAsync: approveToken } = useWriteContract();
//   const { writeContractAsync: borrow } = useWriteContract();

//   const handleBorrow = async () => {
//     if (!collateralId || !amount || !duration || !tokenInfo || !address) return;
//     setIsLoading(true);
//     setError("");
//     setStatus("Checking allowance...");

//     try {
//       const parsedAmount = parseUnits(amount, tokenInfo.decimals);

//       await approveToken({
//         address: tokenInfo.address,
//         abi: erc20Abi,
//         functionName: "approve",
//         args: [LOAN_MANAGER_CONTRACT, parsedAmount],
//       });

//       setStatus("Borrowing against NFT...");
//       await new Promise((res) => setTimeout(res, 1500));

//       await borrow({
//         address: LOAN_MANAGER_CONTRACT,
//         abi: LoanManagerABI2.abi,
//         functionName: "issueLoan",
//         args: [collateralId, tokenInfo.address, parsedAmount, duration],
//       });

//       toast({ title: "Loan issued", description: `You borrowed ${amount} ${tokenInfo.symbol}` });
//       setAmount("");
//       setDuration(0);
//       setStatus("Loan successful 🎉");
//     } catch (err: any) {
//       setError("Transaction failed");
//       console.error(err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="space-y-4 bg-[#131A2A] p-6 rounded-xl">
//       <h2 className="text-xl text-white font-bold">Borrow Against NFT</h2>

//       <div className="space-y-2">
//         <label className="text-sm text-gray-300">Select Token</label>
//         <select
//           value={selectedToken}
//           onChange={(e) => setSelectedToken(e.target.value as SupportedToken)}
//           className="w-full px-4 py-2 rounded bg-gray-800 text-white"
//         >
//           {Object.entries(TOKENS).map(([symbol, token]) => (
//             <option key={token.address} value={symbol}>
//               {token.symbol}
//             </option>
//           ))}
//         </select>
//       </div>

//       <div className="space-y-2">
//         <label className="text-sm text-gray-300">Loan Amount (max {maxLoanAmount} {tokenInfo.symbol})</label>
//         <input
//           type="number"
//           value={amount}
//           onChange={(e) => setAmount(e.target.value)}
//           placeholder="Enter amount"
//           className="w-full px-4 py-2 rounded bg-gray-800 text-white"
//         />
//       </div>

//       <div className="space-y-2">
//         <label className="text-sm text-gray-300">Loan Duration (in seconds)</label>
//         <input
//           type="number"
//           value={duration}
//           onChange={(e) => setDuration(Number(e.target.value))}
//           placeholder="Enter duration (e.g., 604800 for 7 days)"
//           className="w-full px-4 py-2 rounded bg-gray-800 text-white"
//         />
//       </div>

//       {error && <p className="text-sm text-red-500">{error}</p>}
//       {status && <p className="text-sm text-green-500">{status}</p>}

//       <button
//         onClick={handleBorrow}
//         disabled={isLoading}
//         className="w-full py-3 bg-blue-600 text-white font-bold rounded hover:bg-blue-700"
//       >
//         {isLoading ? "Processing..." : `Borrow ${tokenInfo.symbol}`}
//       </button>
//     </div>
//   );
// }
////////////////////////////////--------------------------------//////////////////////////////////////
// BorrowForm3.tsx
import { useEffect, useState } from "react";
import { useAccount, useWriteContract } from "wagmi";
import { parseUnits, erc20Abi } from "viem";
import { LoanManagerABI2 } from "@/contracts/interfaces/LoanManager2";
import { LOAN_MANAGER_CONTRACT } from "@/contracts/contracts2";
import { SupportedToken, TOKENS } from "./config/tokens";
import { useToast } from "@/Components/privy/ui/use-toast";

interface BorrowFormProps {
  collateralId: number;
  maxLoanAmount: string;
  tokenSymbol: SupportedToken;
  onBorrow: (collateralId: number, amount: string, durationInSeconds: number) => Promise<void>;
}

export function BorrowForm({ collateralId, maxLoanAmount, tokenSymbol, onBorrow }: BorrowFormProps) {
  const { address } = useAccount();
  const { toast } = useToast();

  const [amount, setAmount] = useState<string>("");
  const [duration, setDuration] = useState<number>(0);
  const [status, setStatus] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const tokenInfo = TOKENS[tokenSymbol];

  const { writeContractAsync: approveToken } = useWriteContract();
  const { writeContractAsync: borrow } = useWriteContract();

  const handleBorrow = async () => {
    if (!collateralId || !amount || !duration || !tokenInfo || !address) return;
    setIsLoading(true);
    setError("");
    setStatus("Approving token...");

    try {
      const parsedAmount = parseUnits(amount, tokenInfo.decimals);

      await approveToken({
        address: tokenInfo.address,
        abi: erc20Abi,
        functionName: "approve",
        args: [LOAN_MANAGER_CONTRACT, parsedAmount],
      });

      setStatus("Borrowing against NFT...");
      await new Promise((res) => setTimeout(res, 1500));

      await borrow({
        address: LOAN_MANAGER_CONTRACT,
        abi: LoanManagerABI2.abi,
        functionName: "issueLoan",
        args: [collateralId, tokenInfo.address, parsedAmount, duration],
      });

      toast({ title: "Loan issued", description: `You borrowed ${amount} ${tokenInfo.symbol}` });
      setAmount("");
      setDuration(0);
      setStatus("Loan successful 🎉");
      onBorrow(collateralId, amount, duration);
    } catch (err: any) {
      setError("Transaction failed");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4 bg-[#131A2A] p-6 rounded-xl">
      <h2 className="text-xl text-white font-bold">Borrow Against NFT</h2>

      <div className="space-y-2">
        <label className="text-sm text-gray-300">Loan Amount (max {maxLoanAmount} {tokenInfo?.symbol})</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          className="w-full px-4 py-2 rounded bg-gray-800 text-white"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm text-gray-300">Loan Duration (in seconds)</label>
        <input
          type="number"
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          placeholder="Enter duration (e.g., 604800 for 7 days)"
          className="w-full px-4 py-2 rounded bg-gray-800 text-white"
        />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
      {status && <p className="text-sm text-green-500">{status}</p>}

      <button
        onClick={handleBorrow}
        disabled={isLoading}
        className="w-full py-3 bg-blue-600 text-white font-bold rounded hover:bg-blue-700"
      >
        {isLoading ? "Processing..." : `Borrow `}
      </button>
    </div>
  );
}
