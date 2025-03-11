// "use client"

// import { useState, useEffect } from "react"
// import { useBalance } from "@thirdweb-dev/react"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/privy/ui/select"

// interface TokenSelectorProps {
//   selectedToken: string
//   onTokenChange: (token: string) => void
//   sourceChain: string
// }

// // Token addresses by chain
// const TOKENS = {
//   sepolia: [
//     {
//       symbol: "ETH",
//       name: "Ethereum",
//       address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
//       decimals: 18,
//       logo: "/eth-logo.svg",
//     },
//     {
//       symbol: "WETH",
//       name: "Wrapped Ethereum",
//       address: "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9",
//       decimals: 18,
//       logo: "/weth-logo.svg",
//     },
//     {
//       symbol: "USDT",
//       name: "Tether USD",
//       address: "0x876A207aD9f6f0fA2C58A7902B2E7568a41c299f",
//       decimals: 6,
//       logo: "/usdt-logo.svg",
//     },
//   ],
//   monad: [
//     {
//       symbol: "ETH",
//       name: "Ethereum",
//       address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
//       decimals: 18,
//       logo: "/eth-logo.svg",
//     },
//     {
//       symbol: "WETH",
//       name: "Wrapped Ethereum",
//       address: "0x4200000000000000000000000000000000000006",
//       decimals: 18,
//       logo: "/weth-logo.svg",
//     },
//     {
//       symbol: "USDT",
//       name: "Tether USD",
//       address: "0x4200000000000000000000000000000000000007",
//       decimals: 6,
//       logo: "/usdt-logo.svg",
//     },
//   ],
// }

// export function TokenSelector({ selectedToken, onTokenChange, sourceChain }: TokenSelectorProps) {
//   const [tokenAddress, setTokenAddress] = useState<string>("")
//   const { data: balance } = useBalance(tokenAddress)

//   // Update token address when selected token or source chain changes
//   useEffect(() => {
//     const tokens = TOKENS[sourceChain as keyof typeof TOKENS] || []
//     const token = tokens.find((t) => t.symbol === selectedToken)
//     if (token) {
//       setTokenAddress(token.address)
//     }
//   }, [selectedToken, sourceChain])

//   return (
//     <div className="space-y-2">
//       <div className="flex justify-between items-center">
//         <label className="text-sm text-gray-400">Select Token</label>
//         {balance && (
//           <span className="text-sm text-gray-400">
//             Balance: {Number.parseFloat(balance.displayValue).toFixed(6)} {balance.symbol}
//           </span>
//         )}
//       </div>

//       <Select value={selectedToken} onValueChange={onTokenChange}>
//         <SelectTrigger className="bg-gray-900 border-gray-700">
//           <SelectValue placeholder="Select Token" />
//         </SelectTrigger>
//         <SelectContent className="bg-gray-900 border-gray-700">
//           {(TOKENS[sourceChain as keyof typeof TOKENS] || []).map((token) => (
//             <SelectItem key={token.symbol} value={token.symbol} className="hover:bg-gray-800">
//               <div className="flex items-center">
//                 <span className="mr-2">{token.symbol}</span>
//                 <span className="text-gray-400 text-xs">({token.name})</span>
//               </div>
//             </SelectItem>
//           ))}
//         </SelectContent>
//       </Select>
//     </div>
//   )
// }

