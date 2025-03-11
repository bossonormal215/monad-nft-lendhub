// "use client"

// import { useState, useEffect } from "react"
// import { useAddress, useBalance, useSDK, useSigner } from "@thirdweb-dev/react"
// import { Button } from "@/Components/privy/ui/button"
// import { Input } from "@/Components/privy/ui/input"
// import { Label } from "@/Components/privy/ui/label"
// import { ArrowRight, Loader2 } from "lucide-react"
// import { initializeWormhole, transferNativeToken, transferERC20Token } from "@/Components/privy/lib/wormhole"

// interface TransferFormProps {
//   sourceChain: string
//   destinationChain: string
//   selectedToken: string
//   onTransferStart: () => void
//   onTransferSuccess: (hash: string) => void
//   onTransferError: () => void
// }

// // Token addresses by chain
// const TOKENS = {
//   sepolia: {
//     ETH: { address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", decimals: 18 },
//     WETH: { address: "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9", decimals: 18 },
//     USDT: { address: "0x876A207aD9f6f0fA2C58A7902B2E7568a41c299f", decimals: 6 },
//   },
//   monad: {
//     ETH: { address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", decimals: 18 },
//     WETH: { address: "0x4200000000000000000000000000000000000006", decimals: 18 },
//     USDT: { address: "0x4200000000000000000000000000000000000007", decimals: 6 },
//   },
// }

// export function TransferForm({
//   sourceChain,
//   destinationChain,
//   selectedToken,
//   onTransferStart,
//   onTransferSuccess,
//   onTransferError,
// }: TransferFormProps) {
//   const address = useAddress()
//   const signer  = useSigner()
//   const sdk = useSDK()
//   const [amount, setAmount] = useState<string>("")
//   const [isLoading, setIsLoading] = useState<boolean>(false)
//   const [estimatedGas, setEstimatedGas] = useState<string>("0")
//   const [recipientAddress, setRecipientAddress] = useState<string>("")

//   // Get token balance
//   const tokenAddress =
//     TOKENS[sourceChain as keyof typeof TOKENS]?.[selectedToken as keyof typeof TOKENS.sepolia]?.address || ""
//   const { data: balance } = useBalance(tokenAddress)

//   // Set recipient address to connected wallet by default
//   useEffect(() => {
//     if (address) {
//       setRecipientAddress(address)
//     }
//   }, [address])

//   // Handle max button click
//   const handleMaxClick = () => {
//     if (balance) {
//       // Set to 95% of balance to account for gas
//       const maxAmount = Number.parseFloat(balance.displayValue) * 0.95
//       setAmount(maxAmount.toString())
//     }
//   }

//   // Estimate gas fees
//   useEffect(() => {
//     if (amount && Number.parseFloat(amount) > 0) {
//       // This would be replaced with actual gas estimation logic
//       setEstimatedGas("0.001")
//     } else {
//       setEstimatedGas("0")
//     }
//   }, [amount])

//   // Handle transfer
//   const handleTransfer = async () => {
//     if (!address || !amount || Number.parseFloat(amount) <= 0 || !recipientAddress) return

//     try {
//       setIsLoading(true)
//       onTransferStart()

//       // Initialize Wormhole SDK
//       const wormhole = await initializeWormhole()

//       // Perform the transfer based on token type
//       let txHash

//       if (selectedToken === "ETH") {
//         // Native token transfer
//         txHash = await transferNativeToken(wormhole, sourceChain, destinationChain, recipientAddress, amount)
//       } else {
//         // ERC20 token transfer
//         const tokenInfo = TOKENS[sourceChain as keyof typeof TOKENS]?.[selectedToken as keyof typeof TOKENS.sepolia]
//         if (!tokenInfo) throw new Error("Token not supported")

//         txHash = await transferERC20Token(
//           wormhole,
//           sourceChain,
//           destinationChain,
//           tokenInfo.address,
//           recipientAddress,
//           amount,
//           tokenInfo.decimals,
//         )
//       }

//       onTransferSuccess(txHash)
//     } catch (error) {
//       console.error("Transfer error:", error)
//       onTransferError()
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   return (
//     <div className="space-y-4">
//       <div className="space-y-2">
//         <div className="flex justify-between">
//           <Label htmlFor="amount" className="text-sm text-gray-400">
//             Amount
//           </Label>
//           {balance && (
//             <button onClick={handleMaxClick} className="text-xs text-blue-400 hover:text-blue-300">
//               MAX
//             </button>
//           )}
//         </div>
//         <Input
//           id="amount"
//           type="number"
//           placeholder="0.0"
//           value={amount}
//           onChange={(e) => setAmount(e.target.value)}
//           className="bg-gray-900 border-gray-700"
//         />
//       </div>

//       <div className="space-y-2">
//         <Label htmlFor="recipient" className="text-sm text-gray-400">
//           Recipient Address
//         </Label>
//         <Input
//           id="recipient"
//           type="text"
//           placeholder="0x..."
//           value={recipientAddress}
//           onChange={(e) => setRecipientAddress(e.target.value)}
//           className="bg-gray-900 border-gray-700"
//         />
//       </div>

//       <div className="flex justify-between text-sm text-gray-400 px-1">
//         <span>Estimated Gas Fee:</span>
//         <span>{estimatedGas} ETH</span>
//       </div>

//       <Button
//         onClick={handleTransfer}
//         disabled={isLoading || !amount || Number.parseFloat(amount) <= 0 || !recipientAddress}
//         className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
//       >
//         {isLoading ? (
//           <>
//             <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//             Transferring...
//           </>
//         ) : (
//           <>
//             Transfer <ArrowRight className="ml-2 h-4 w-4" />
//           </>
//         )}
//       </Button>
//     </div>
//   )
// }

