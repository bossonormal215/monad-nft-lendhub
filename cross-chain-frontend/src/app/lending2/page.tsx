// "use client"

import Web3Wrapper from "@/Components/Web3Wrapper";

// import { useState, useEffect } from "react"
// import { formatEther, parseEther } from "viem"
// import { useAccount, useReadContract, useWriteContract, useChain, useSwitchChain } from "wagmi"
// import { usePrivy } from "@privy-io/react-auth"
// import { WhitelistedNFTs } from "@/Components/nftLend/WhitelistedNFTs"
// import { LiquidityProvider } from "@/Components/nftLend/LiquidityProvider"
// import { DMON_NFT_CONTRACT } from "@/contracts/interfaces/dmonNftAbi"
// import Web3Wrapper from "@/Components/Web3Wrapper"
// import { AdminPanel } from "@/Components/nftLend/AdminPanel"
// import { CollateralList } from "@/Components/nftLend/CollateralList"
// import { NFT_VAULT_CONTRACT } from "@/thirdweb/thirdwebConfig";
// import { useContracts } from "@/thirdweb/usecontracts"
// import { monadTestnet } from "viem/chains"
// import { createPublicClient, http } from 'viem';
// import { useWaitForTransaction } from "wagmi"
// import { NFTCollateralVaultABI } from "@/contracts/interfaces/NFTCollateralVault"

// const publicClient = createPublicClient({
//   chain: monadTestnet,
//   transport: http('https://testnet-rpc.monad.xyz'),
// });

function App() {
  return (
    <Web3Wrapper>
      {/* <Main /> */}
      <div>
        BUILDING
      </div>
    </Web3Wrapper>
  )
}

// function MintDMONPage() {
//   const [isLoading, setIsLoading] = useState(false)
//   const [error, setError] = useState<string>("")
//   const [status, setStatus] = useState<string>("")
//   const [mintQuantity, setMintQuantity] = useState<number>(1)
//   const [mintPrice, setMintPrice] = useState<string>("0")
//   const [maxSupply, setMaxSupply] = useState<number>(0)
//   const [totalSupply, setTotalSupply] = useState<number>(0)
//   const [isPresaleActive, setIsPrivateSale] = useState<boolean>(false)
//   const [whitelistAddress, setWhitelistAddress] = useState<string>("")
//   const [isPublicSale, setIsPublicSale] = useState<boolean>(false)
//   const [adminError, setAdminError] = useState<string>("")
//   const [adminStatus, setAdminStatus] = useState<string>("")

//   const { address } = useAccount()
//   const adminAddress = "0xED42844Cd35d734fec3B65dF486158C443896b41"
//   const isAdmin = address === adminAddress

//   const { data: privateSalePrice } = useReadContract({
//     address: DMON_NFT_CONTRACT.address as `0x${string}`,
//     abi: DMON_NFT_CONTRACT.abi,
//     functionName: "WhitelistMintPrice",
//   })

//   const { data: maxSupplyValue } = useReadContract({
//     address: DMON_NFT_CONTRACT.address as `0x${string}`,
//     abi: DMON_NFT_CONTRACT.abi,
//     functionName: "MAX_SUPPLY",
//   })

//   const { data: currentSupply } = useReadContract({
//     address: DMON_NFT_CONTRACT.address as `0x${string}`,
//     abi: DMON_NFT_CONTRACT.abi,
//     functionName: "totalSupply",
//   })

//   const { data: privateSaleState } = useReadContract({
//     address: DMON_NFT_CONTRACT.address as `0x${string}`,
//     abi: DMON_NFT_CONTRACT.abi,
//     functionName: "isPresaleActive",
//   })

//   const { writeContract: whitelistMint, isLoading: isMintLoading } = useWriteContract()

//   const { writeContract: addToWhitelist, isLoading: isWhitelistLoading } = useWriteContract()

//   const { writeContract: togglePublicSale, isLoading: isToggleLoading } = useWriteContract()

//   useEffect(() => {
//     if (status || error) {
//       const timer = setTimeout(() => {
//         setStatus("")
//         setError("")
//       }, 5000)
//       return () => clearTimeout(timer)
//     }
//   }, [status, error])

//   useEffect(() => {
//     if (privateSalePrice) setMintPrice(formatEther(privateSalePrice as bigint))
//     if (maxSupplyValue) setMaxSupply(Number(maxSupplyValue))
//     if (currentSupply) setTotalSupply(Number(currentSupply))
//     if (privateSaleState !== undefined) setIsPrivateSale(privateSaleState as boolean)
//   }, [privateSalePrice, maxSupplyValue, currentSupply, privateSaleState])

//   const handleMint = async () => {
//     if (!address) {
//       setError("Please connect your wallet")
//       return
//     }

//     if (!isPresaleActive) {
//       setError("Private sale is not active")
//       return
//     }

//     setIsLoading(true)
//     setError("")
//     setStatus("Processing mint...")

//     try {
//       const price = parseEther(mintPrice)
//       const totalPrice = price * BigInt(mintQuantity)

//       await whitelistMint({
//         address: DMON_NFT_CONTRACT.address as `0x${string}`,
//         abi: DMON_NFT_CONTRACT.abi,
//         functionName: "whitelistMint",
//         args: [BigInt(mintQuantity)],
//         value: totalPrice,
//       })

//       setStatus(`Successfully minted ${mintQuantity} DMON NFT${mintQuantity > 1 ? "s" : ""}! 🎉`)
//     } catch (error: any) {
//       console.error("Mint failed:", error)
//       if (error.message?.includes("whitelist")) {
//         setError("Not whitelisted for the presale mint. reach out to bossonormal1 on discord to WL your address!!")
//       } else {
//         setError("Failed to mint NFT")
//       }
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const handleAddToWhitelist = async (address: string) => {
//     if (!isAdmin) return

//     setIsLoading(true)
//     setAdminError("")
//     setAdminStatus("Processing...")

//     try {
//       await addToWhitelist({
//         address: DMON_NFT_CONTRACT.address as `0x${string}`,
//         abi: DMON_NFT_CONTRACT.abi,
//         functionName: "addToWhitelist",
//         args: [[address]],
//       })

//       setAdminStatus(`Added ${address} to whitelist`)
//       setWhitelistAddress("")
//     } catch (error: any) {
//       console.error("Whitelist error:", error)
//       setAdminError(
//         error.message?.includes("user rejected")
//           ? "Transaction was rejected by user"
//           : "Failed to add address to whitelist",
//       )
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const handleTogglePublicSale = async () => {
//     if (!isAdmin) return

//     setIsLoading(true)
//     setAdminError("")
//     setAdminStatus("Processing...")

//     try {
//       await togglePublicSale({
//         address: DMON_NFT_CONTRACT.address as `0x${string}`,
//         abi: DMON_NFT_CONTRACT.abi,
//         functionName: "togglePublicSale",
//       })
//       setIsPublicSale(!isPublicSale)
//       setAdminStatus(`${isPublicSale ? "Disabled" : "Enabled"} public sale`)
//     } catch (error: any) {
//       console.error("Toggle sale error:", error)
//       setAdminError(
//         error.message?.includes("user denied transaction signature")
//           ? "User Rejected The TX"
//           : "Failed to toggle sale status",
//       )
//     } finally {
//       setIsLoading(false)
//       setAdminStatus("")
//     }
//   }

//   return (
//     <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-3xl mx-auto">
//         {isAdmin && (
//           <AdminPanel
//             isAdmin={isAdmin}
//             onAddWhitelist={handleAddToWhitelist}
//             onTogglePublicSale={handleTogglePublicSale}
//           />
//         )}

//         <div className="bg-gray-800 rounded-lg shadow-xl p-6 space-y-6">
//           <div className="text-center">
//             <h1 className="text-3xl font-bold text-white mb-2">MINT DMON NFT</h1>
//             <p className="text-gray-400">
//               {totalSupply} / {maxSupply} Minted
//             </p>
//           </div>

//           <div className="space-y-4">
//             <div className="flex items-center justify-between">
//               <p className="text-gray-300">Price per NFT:</p>
//               <p className="text-white font-medium">{mintPrice} MON</p>
//             </div>

//             <div className="flex items-center justify-between">
//               <p className="text-gray-300">Quantity:</p>
//               <div className="flex items-center space-x-3">
//                 <button
//                   onClick={() => setMintQuantity(Math.max(1, mintQuantity - 1))}
//                   className="px-3 py-1 bg-gray-700 rounded-lg hover:bg-gray-600 text-white"
//                 >
//                   -
//                 </button>
//                 <span className="text-white font-medium">{mintQuantity}</span>
//                 <button
//                   onClick={() => setMintQuantity(Math.min(5, mintQuantity + 1))}
//                   className="px-3 py-1 bg-gray-700 rounded-lg hover:bg-gray-600 text-white"
//                 >
//                   +
//                 </button>
//               </div>
//             </div>

//             <div className="flex items-center justify-between">
//               <p className="text-gray-300">Total Price:</p>
//               <p className="text-white font-medium">{(Number(mintPrice) * mintQuantity).toFixed(3)} MON</p>
//             </div>

//             <button
//               onClick={handleMint}
//               disabled={isMintLoading || !isPresaleActive || isLoading}
//               className={`w-full py-3 px-6 rounded-lg text-lg font-medium ${
//                 isMintLoading || !isPresaleActive || isLoading
//                   ? "bg-gray-600 cursor-not-allowed"
//                   : "bg-blue-500 hover:bg-blue-600"
//               } text-white transition-colors`}
//             >
//               {isMintLoading || isLoading ? "Processing..." : !isPresaleActive ? "Sale Not Active" : "Mint DMON NFT"}
//             </button>

//             {error && <p className="text-red-500 text-sm text-center">{error}</p>}
//             {status && !error && <p className="text-green-500 text-sm text-center">{status}</p>}
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// function Main() {
//   const [status, setStatus] = useState<string>("")
//   const [isLoading, setIsLoading] = useState(false)
//   const [selectedCollateralId, setSelectedCollateralId] = useState<number | null>(null)
//   const [maxLoanAmount, setMaxLoanAmount] = useState<string>("")
//   const [userCollaterals, setUserCollaterals] = useState<any[]>([])
//   const [userUsdtBalance, setUserUsdtBalance] = useState<string>("0")
//   const [activeLoan, setActiveLoan] = useState<any>(null)
//   const [isApproved, setIsApproved] = useState(false)

//   const { address } = useAccount()
//   const chain = useChain()
//   const { switchChain } = useSwitchChain()
//   const { user, authenticated, login } = usePrivy()
//   const { usdt, nftVault, loanManager, liquidationManager } = useContracts()

//   const adminAddress = "0xED42844Cd35d734fec3B65dF486158C443896b41"

//   const nftContract = {
//     address: "" as `0x${string}`, // Initialize with an empty address
//     abi: [
//       {
//         inputs: [
//           { name: "owner", type: "address" },
//           { name: "operator", type: "address" },
//         ],
//         name: "isApprovedForAll",
//         outputs: [{ name: "", type: "bool" }],
//         stateMutability: "view",
//         type: "function",
//       },
//       {
//         inputs: [
//           { name: "operator", type: "address" },
//           { name: "approved", type: "bool" },
//         ],
//         name: "setApprovalForAll",
//         outputs: [],
//         stateMutability: "nonpayable",
//         type: "function",
//       },
//     ],
//   }

//   const { writeContract } = useWriteContract()

//   useEffect(() => {
//     if (address && chain?.id !== monadTestnet.id) {
//       alert("Please switch your wallet to Monad TestNet.")
//       switchChain({ chainId: monadTestnet.id })
//     }
//   }, [address, chain?.id, switchChain])

//   useEffect(() => {
//     if (address && nftVault) {
//       fetchUserCollaterals()
//     }
//   }, [address, nftVault])

//   useEffect(() => {
//     if (address && usdt) {
//       fetchUserUsdtBalance()
//     }
//   }, [address, usdt])

//   const fetchUserCollaterals = async () => {
//     if (!nftVault || !address) return

//     try {
//       console.log("Fetching collaterals for address:", address)

//       const collateralsData = (await publicClient.readContract({
//             address: NFTCollateralVaultABI.address as `0x${string}`,
//             abi: NFTCollateralVaultABI.abi,
//             functionName: 'getUserCollaterals',
//             args: [address]
//           }))
//       console.log("Raw collaterals data:", collateralsData)

//       if (collateralsData) {
//         const [collateralIds, nftAddresses, tokenIds, maxLoanAmounts, currentLoanAmounts, activeStates] =
//           collateralsData

//         const formattedCollaterals = collateralIds.map((id: bigint, index: number) => ({
//           id: Number(id),
//           nftAddress: nftAddresses[index],
//           tokenId: Number(tokenIds[index]),
//           maxLoanAmount: maxLoanAmounts[index],
//           currentLoanAmount: currentLoanAmounts[index],
//           isActive: activeStates[index],
//         }))

//         console.log("Formatted collaterals:", formattedCollaterals)
//         setUserCollaterals(formattedCollaterals)

//         if (formattedCollaterals.length > 0) {
//           const activeCollateral = formattedCollaterals[0]
//           setSelectedCollateralId(activeCollateral.id)
//           setMaxLoanAmount(formatEther(activeCollateral.maxLoanAmount))
//         }
//       }
//     } catch (error) {
//       console.error("Error fetching user collaterals:", error)
//     }
//   }

//   const fetchUserUsdtBalance = async () => {
//     if (!usdt || !address) return

//     try {
//       const balance = await usdt.read.balanceOf([address as `0x${string}`])
//       setUserUsdtBalance(formatEther(balance))
//     } catch (error) {
//       console.error("Error fetching USDT balance:", error)
//     }
//   }

//   const handleNFTDeposit = async (nftAddress: string, tokenId: string, maxAmount: number) => {
//     if (!nftVault || !address) {
//       setStatus("Please connect your wallet")
//       return
//     }

//     setIsLoading(true)
//     setStatus("Processing...")

//     try {
//       nftContract.address = nftAddress as `0x${string}`

//       const isApprovedForAll = await nftVault.read.isApprovedForAll([address, NFT_VAULT_CONTRACT])
//       setIsApproved(isApprovedForAll)

//       if (!isApprovedForAll) {
//         setStatus("Approving NFT transfer...")
//         await writeContract({
//           ...nftContract,
//           functionName: "setApprovalForAll",
//           args: [NFT_VAULT_CONTRACT, true],
//         })
//         setStatus("NFT transfer approved!")
//       }

//       setStatus("Depositing NFT...")
//       const { hash } = await writeContract({
//         address: nftVault.address,
//         abi: nftVault.abi,
//         functionName: "depositNFT",
//         args: [nftAddress as `0x${string}`, BigInt(tokenId), parseEther(maxAmount.toString())],
//       })

//       // Wait for transaction confirmation
//       const { waitForTransactionReceipt } = useWaitForTransaction()
//       const receipt = await waitForTransactionReceipt({ hash })
//       console.log("Full transaction receipt:", receipt)

//       let collateralId

//       try {
//         collateralId = await nftVault.read.getLatestCollateralId()
//         console.log("Latest Collateral ID:", collateralId)
//       } catch (error) {
//         console.error("Error getting latest collateral ID:", error)
//       }

//       if (collateralId) {
//         setSelectedCollateralId(Number(collateralId))
//         setMaxLoanAmount(maxAmount.toString())
//         setStatus("NFT successfully deposited! 🎉")
//       } else {
//         throw new Error("Failed to get collateral ID")
//       }

//       await fetchUserCollaterals()
//     } catch (depositError: any) {
//       console.error("Deposit failed:", depositError)
//       if (depositError.message?.includes("invalid token ID")) {
//         setStatus("Invalid TokenID Entered")
//       } else if (depositError.message?.includes("transfer from incorrect owner")) {
//         setStatus("You Are Not The Owner of the tokenId")
//       } else if (depositError.message?.includes("NFT not whitelisted")) {
//         setStatus("NFT not whitelisted")
//       } else {
//         setStatus("Deposit Failed")
//       }
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const handleBorrow = async (collateralId: number, amount: string) => {
//     if (!loanManager || !address) {
//       setStatus("Please connect your wallet")
//       return
//     }

//     setIsLoading(true)

//     try {
//       const { hash } = await writeContract({
//         address: loanManager.address,
//         abi: loanManager.abi,
//         functionName: "issueLoan",
//         args: [BigInt(collateralId), parseEther(amount)],
//       })

//       // Wait for transaction confirmation
//       const { waitForTransactionReceipt } = useWaitForTransaction()
//       await waitForTransactionReceipt({ hash })
//       setStatus("Loan successfully issued! 🎉")
//     } catch (error: any) {
//       console.error("Borrow failed:", error)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const handleNFTWithdrawn = async (collateralId: number) => {
//     await fetchUserCollaterals()
//     setSelectedCollateralId(null)
//     setMaxLoanAmount("0")
//   }

//   const fetchLoanDetails = async (collateralId: number) => {
//     if (!loanManager || !address) return

//     try {
//       const loanDetails = await loanManager.read.loans([BigInt(collateralId)])
//       setActiveLoan(loanDetails)
//     } catch (error) {
//       console.error("Error fetching loan details:", error)
//     }
//   }

//   const handleLogin = async () => {
//     try {
//       await login()
//     } catch (error) {
//       console.error("Login failed:", error)
//     }
//   }

//   return (
//     <div className="min-h-screen bg-[#0D111C] text-white">
//       <header className="sticky top-0 z-50 bg-[#131A2A]/80 backdrop-blur-sm p-4 border-b border-[#1C2839]">
//         <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
//           <h1 className="text-2xl sm:text-3xl font-bold">Monad NFT Lending</h1>
//           {!authenticated ? (
//             <button onClick={handleLogin} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium">
//               Connect Wallet
//             </button>
//           ) : (
//             <div className="flex items-center gap-2 px-4 py-2 bg-[#1C2839] rounded-lg">
//               <div className="w-2 h-2 bg-green-500 rounded-full"></div>
//               <span className="text-sm font-medium truncate max-w-[150px]">
//                 {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Connected"}
//               </span>
//             </div>
//           )}
//         </div>
//       </header>

//       {!authenticated ? (
//         <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
//           <div className="text-center space-y-6 max-w-lg">
//             <p className="text-[#98A1C0] text-lg">
//               Connect your wallet to start borrowing against your NFTs or providing liquidity to the platform.
//             </p>
//             <button
//               onClick={handleLogin}
//               className="px-6 py-3 bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
//             >
//               Connect Wallet
//             </button>
//           </div>
//         </div>
//       ) : (
//         <main className="container mx-auto px-4 py-6 space-y-8">
//           <section className="bg-[#131A2A] rounded-[20px] p-6">
//             <MintDMONPage />
//           </section>

//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//             <section className="bg-[#131A2A] rounded-[20px] p-6">
//               <h2 className="text-xl font-semibold mb-4 text-[#F5F6FC]">Liquidity Pool</h2>
//               <LiquidityProvider />
//             </section>

//             <section className="bg-[#131A2A] rounded-[20px] p-6">
//               <h2 className="text-xl font-semibold mb-4 text-[#F5F6FC]">NFT Collateral</h2>
//               <WhitelistedNFTs onNFTDeposit={handleNFTDeposit} isLoading={isLoading} />
//             </section>
//           </div>

//           {userCollaterals.length > 0 && (
//             <CollateralList
//               collaterals={userCollaterals}
//               onSelect={(collateral) => {
//                 setSelectedCollateralId(collateral.id)
//                 fetchLoanDetails(collateral.id)
//               }}
//               onNFTWithdrawn={handleNFTWithdrawn}
//               onBorrow={handleBorrow}
//             />
//           )}

//           {status && (
//             <div
//               className="fixed bottom-4 right-4 max-w-md bg-gray-800 p-4 rounded-lg 
//                             shadow-lg border border-gray-700 animate-fade-in-out"
//               style={{
//                 animation: "fadeInOut 20s ease-in-out",
//               }}
//             >
//               <p className="text-sm text-[#F5F6FC]">{status}</p>
//             </div>
//           )}
//         </main>
//       )}
//     </div>
//   )
// }

export default App

