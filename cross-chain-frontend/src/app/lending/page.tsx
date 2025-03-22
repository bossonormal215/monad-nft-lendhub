"use client"

import { useState, useEffect } from "react"
import { formatUnits, parseUnits } from "viem"
import { useAccount, useReadContract, useWriteContract, useSimulateContract } from "wagmi"
import { WhitelistedNFTs } from "@/Components/nftLend/WhitelistedNFTs2"
import { LiquidityProvider } from "@/Components/nftLend/LiquidityProvider2"
import { DMON_NFT_CONTRACT } from "@/contracts/interfaces/dmonNftAbi"
import { AdminPanel } from "@/Components/nftLend/AdminPanel2"
import { CollateralList } from "@/Components/nftLend/CollateralList2"
import { ConnectWallet } from "@/Components/privy/ConnectWallet"
import { usePrivy } from "@privy-io/react-auth"
import { useAddress } from "@/Components/privy/hooks/useWallet"
import { useToast } from "@/Components/privy/ui/use-toast"
import { NFTCollateralVaultABI } from "@/contracts/interfaces/NFTCollateralVault"
import { MockUsdtABI } from "@/contracts/interfaces/mocUsdt"
import { LoanManagerABI } from "@/contracts/interfaces/LoanManager"

import { NFT_VAULT_CONTRACT } from "@/contracts/contracts"
import { USDT_CONTRACT, LOAN_MANAGER_CONTRACT } from "@/contracts/contracts"

// Move App component here
function App() {
  return <Main />
}

function MintDMONPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>("")
  const [status, setStatus] = useState<string>("")
  const [mintQuantity, setMintQuantity] = useState<number>(1)
  const [mintPrice, setMintPrice] = useState<string>("0")
  const [maxSupply, setMaxSupply] = useState<number>(0)
  const [totalSupply, setTotalSupply] = useState<number>(0)
  const [isPresaleActive, setIsPrivateSale] = useState<boolean>(false)
  const [isPublicSale, setIsPublicSale] = useState<boolean>(false)
  const { toast } = useToast()

  // const address = useAddress()
  
  const { address } = useAccount()
  const adminAddress = "0xED42844Cd35d734fec3B65dF486158C443896b41"
  const isAdmin = address === adminAddress

  // Add auto-dismiss effect
  useEffect(() => {
    if (status || error) {
      const timer = setTimeout(() => {
        setStatus("")
        setError("")
      }, 5000) // 5 seconds

      return () => clearTimeout(timer)
    }
  }, [status])

  // Read contract data
  const privateSalePriceQuery = useReadContract({
    address: DMON_NFT_CONTRACT.address as `0x${string}`,
    abi: DMON_NFT_CONTRACT.abi,
    functionName: "WhitelistMintPrice",
    query: {
      enabled: !!address,
    },
  })

  const maxSupplyValueQuery = useReadContract({
    address: DMON_NFT_CONTRACT.address as `0x${string}`,
    abi: DMON_NFT_CONTRACT.abi,
    functionName: "MAX_SUPPLY",
    query: {
      enabled: !!address,
    },
  })

  const currentSupplyQuery = useReadContract({
    address: DMON_NFT_CONTRACT.address as `0x${string}`,
    abi: DMON_NFT_CONTRACT.abi,
    functionName: "totalSupply",
    query: {
      enabled: !!address,
    },
  })

  const privateSaleStateQuery = useReadContract({
    address: DMON_NFT_CONTRACT.address as `0x${string}`,
    abi: DMON_NFT_CONTRACT.abi,
    functionName: "isPresaleActive",
    query: {
      enabled: !!address,
    },
  })

  const { data: privateSalePrice } = privateSalePriceQuery
  const { data: maxSupplyValue } = maxSupplyValueQuery
  const { data: currentSupply } = currentSupplyQuery
  const { data: privateSaleState } = privateSaleStateQuery

  // Update state when data changes
  useEffect(() => {
    if (privateSalePrice) {
      setMintPrice(formatUnits(privateSalePrice as bigint, 18))
    }
    if (maxSupplyValue) {
      setMaxSupply(Number(maxSupplyValue))
    }
    if (currentSupply) {
      setTotalSupply(Number(currentSupply))
    }
    if (privateSaleState !== undefined) {
      setIsPrivateSale(privateSaleState as boolean)
    }
  }, [privateSalePrice, maxSupplyValue, currentSupply, privateSaleState])

  // Simulate mint transaction
  const totalPrice = mintPrice ? parseUnits((Number(mintPrice) * mintQuantity).toString(), 18) : BigInt(0)
  const { data: mintSimData } = useSimulateContract({
    address: DMON_NFT_CONTRACT.address as `0x${string}`,
    abi: DMON_NFT_CONTRACT.abi,
    // functionName: "whitelistMint",
    functionName: "mint",
    args: [mintQuantity],
    value: totalPrice,
    query: {
      enabled: !!address && isPresaleActive,
    },
  })

  // Write contract hooks
  const { writeContractAsync: mintNFT, isPending: isMintLoading } = useWriteContract()
  const { writeContractAsync: addToWhitelist, isPending: isWhitelistLoading } = useWriteContract()
  const { writeContractAsync: togglePublicSale, isPending: isToggleSaleLoading } = useWriteContract()

  // Simulate whitelist transaction
  const { data: whitelistSimData, refetch: refetchWhitelistSim } = useSimulateContract({
    address: DMON_NFT_CONTRACT.address as `0x${string}`,
    abi: DMON_NFT_CONTRACT.abi,
    functionName: "addToWhitelist",
    args: [[]] as any, // Will be updated when calling
    query: {
      enabled: false, // Disabled by default, will be enabled when calling
    },
  })

  // Simulate toggle public sale transaction
  const { data: toggleSaleSimData } = useSimulateContract({
    address: DMON_NFT_CONTRACT.address as `0x${string}`,
    abi: DMON_NFT_CONTRACT.abi,
    functionName: "togglePublicSale",
    query: {
      enabled: !!address && isAdmin,
    },
  })

  const handleMint = async () => {
    if (!address) {
      setError("Please connect your wallet")
      return
    }

    if (!isPresaleActive) {
      setError("Private sale is not active")
      return
    }

    setIsLoading(true)
    setError("")
    setStatus("Processing mint...")

    try {
      if (isPresaleActive) {
        // const tx = await mintNFT(mintSimData.request)
        console.log('mint process starts')
        const tx = await mintNFT({
          address: DMON_NFT_CONTRACT.address as `0x${string}`,
          abi: DMON_NFT_CONTRACT.abi,
          functionName: "whitelistMint",
          // functionName: "mint",
          args: [mintQuantity],
          value: totalPrice,
        })
        setStatus(`Successfully minted ${mintQuantity} DMON NFT${mintQuantity > 1 ? "s" : ""}! 🎉`)
        toast({
          title: "Success",
          description: `Successfully minted ${mintQuantity} DMON NFT${mintQuantity > 1 ? "s" : ""}!`,
        })

        // Wait for transaction confirmation
        await new Promise((resolve) => setTimeout(resolve, 6000))

        // Refresh total supply
        const newSupplyQuery = useReadContract({
          address: DMON_NFT_CONTRACT.address as `0x${string}`,
          abi: DMON_NFT_CONTRACT.abi,
          functionName: "totalSupply",
        })
        const { data: newSupply } = newSupplyQuery

        if (newSupply) {
          setTotalSupply(Number(newSupply))
        }
      }
    } catch (error: any) {
      if (error.message?.includes("You are not whitelisted to mint an NFT")) {
        setError("Not whitelisted for the presale mint. reach out to bossonormal1 on discord to WL your address!!")
      } else if (error.message?.includes("You have already minted an NFT")) {
        setError("You Have Already minted!!!")
      } else {
        setError("Mint failed")
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Admin Functions
  const handleAddToWhitelist = async (addressToWhitelist: string) => {
    if (!isAdmin) return

    setIsLoading(true)
    setError("")
    setStatus("Processing...")

    try {
      // Simulate with the specific address
      // const { data: simData } = await useSimulateContract({
      //   address: DMON_NFT_CONTRACT.address as `0x${string}`,
      //   abi: DMON_NFT_CONTRACT.abi,
      //   functionName: "addToWhitelist",
      //   args: [[addressToWhitelist]],
      // })

      if (addressToWhitelist) {
        // const tx = await addToWhitelist(simData.request)
        const tx = await addToWhitelist({
          address: DMON_NFT_CONTRACT.address as `0x${string}`,
          abi: DMON_NFT_CONTRACT.abi,
          functionName: "addToWhitelist",
          args: [[addressToWhitelist]],
        })
        setStatus("Address added to whitelist successfully")
        toast({
          title: "Success",
          description: "Address added to whitelist successfully",
        })

        // Wait for transaction confirmation
        await new Promise((resolve) => setTimeout(resolve, 6000))
      }
    } catch (error: any) {
      setStatus("")
      console.error("Whitelist error:", error)
      setError("Failed to add address to whitelist")
    } finally {
      setIsLoading(false)
    }
  }

  const handleTogglePublicSale = async () => {
    if (!isAdmin) return

    setIsLoading(true)
    setError("")
    setStatus("Processing...")

    try {
      if (toggleSaleSimData?.request) {
        // const tx = await togglePublicSale(toggleSaleSimData.request)
        const tx = await togglePublicSale({
          address: DMON_NFT_CONTRACT.address as `0x${string}`,
          abi: DMON_NFT_CONTRACT.abi,
          functionName: "togglePublicSale",
        })
        setStatus(`${isPublicSale ? "Disabled" : "Enabled"} public sale`)
        toast({
          title: "Success",
          description: `${isPublicSale ? "Disabled" : "Enabled"} public sale`,
        })

        // Wait for transaction confirmation
        await new Promise((resolve) => setTimeout(resolve, 6000))

        setIsPublicSale(!isPublicSale)
      }
    } catch (error: any) {
      setStatus("")
      console.error("Toggle sale error:", error)
      setError("Failed to toggle sale status")
    } finally {
      setIsLoading(false)
    }
  }

  // Determine if any operation is loading
  const isAnyLoading = isLoading || isMintLoading || isWhitelistLoading || isToggleSaleLoading

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Admin Panel */}
        {isAdmin && (
          <AdminPanel
            isAdmin={isAdmin}
            onAddWhitelist={handleAddToWhitelist}
            onTogglePublicSale={handleTogglePublicSale}
          />
        )}

        {/* {NFT MINT SECTION} */}
        <div className="bg-gray-800 rounded-lg shadow-xl p-6 space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-2">MINT DMON NFT</h1>
            <p className="text-gray-400">
              {totalSupply} / {maxSupply} Minted
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-gray-300">Price per NFT:</p>
              <p className="text-white font-medium">{mintPrice} MON</p>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-gray-300">Quantity:</p>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setMintQuantity(Math.max(1, mintQuantity - 1))}
                  className="px-3 py-1 bg-gray-700 rounded-lg hover:bg-gray-600 text-white"
                >
                  -
                </button>
                <span className="text-white font-medium">{mintQuantity}</span>
                <button
                  onClick={() => setMintQuantity(Math.min(5, mintQuantity + 1))}
                  className="px-3 py-1 bg-gray-700 rounded-lg hover:bg-gray-600 text-white"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-gray-300">Total Price:</p>
              <p className="text-white font-medium">{(Number(mintPrice) * mintQuantity).toFixed(3)} MON</p>
            </div>

            <button
              onClick={handleMint}
              disabled={isAnyLoading || !isPresaleActive}
              className={`w-full py-3 px-6 rounded-lg text-lg font-medium ${
                isAnyLoading || !isPresaleActive ? "bg-gray-600 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
              } text-white transition-colors`}
            >
              {isAnyLoading ? "Processing..." : !isPresaleActive ? "Sale Not Active" : "Mint DMON NFT"}
            </button>

            {error && !status && <p className="text-red-500 text-sm text-center">{error}</p>}
            {status && !error && <p className="text-green-500 text-sm text-center">{status}</p>}
          </div>
        </div>
      </div>
    </div>
  )
}

function Main() {
  // const address = useAddress()
  const { address } = useAccount()
  const { ready, authenticated } = usePrivy()
  const { toast } = useToast()
  const [status, setStatus] = useState<string>("")
  const [error, setError] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [selectedCollateralId, setSelectedCollateralId] = useState<number | null>(null)
  const [maxLoanAmount, setMaxLoanAmount] = useState<string>("")
  const [userCollaterals, setUserCollaterals] = useState<any[]>([])
  const [userUsdtBalance, setUserUsdtBalance] = useState<string>("0")
  const [activeLoan, setActiveLoan] = useState<any>(null)
  const { address: wagmiAddress } = useAccount()

  const adminAddress = "0xED42844Cd35d734fec3B65dF486158C443896b41"

  // Write contract hooks
  const { writeContractAsync: approveNFT, isPending: isApproveLoading } = useWriteContract()
  const { writeContractAsync: depositNFT, isPending: isDepositLoading } = useWriteContract()
  const { writeContractAsync: borrowLoan, isPending: isBorrowLoading } = useWriteContract()

  // Fetch user collaterals
  const collateralsDataQuery = useReadContract({
    address: NFT_VAULT_CONTRACT as `0x${string}`,
    abi: NFTCollateralVaultABI.abi,
    functionName: "getUserCollaterals",
    args: [address || "0x0"],
    query: {
      enabled: !!address,
    },
  })

  const { data: collateralsData, refetch: refetchCollaterals } = collateralsDataQuery

  // Process collaterals data
  useEffect(() => {
    if (collateralsData && Array.isArray(collateralsData) && collateralsData.length >= 6) {
      const [collateralIds, nftAddresses, tokenIds, maxLoanAmounts, currentLoanAmounts, activeStates] = collateralsData

      const formattedCollaterals = collateralIds.map((id: any, index: number) => ({
        id: Number(id),
        nftAddress: nftAddresses[index],
        tokenId: Number(tokenIds[index]),
        maxLoanAmount: maxLoanAmounts[index].toString(),
        currentLoanAmount: currentLoanAmounts[index].toString(),
        isActive: activeStates[index],
      }))

      console.log("Formatted collaterals:", formattedCollaterals)
      setUserCollaterals(formattedCollaterals)

      if (formattedCollaterals.length > 0) {
        const activeCollateral = formattedCollaterals[0]
        setSelectedCollateralId(activeCollateral.id)
        setMaxLoanAmount(formatUnits(BigInt(activeCollateral.maxLoanAmount), 18))
      }
    }
  }, [collateralsData])

  // Fetch USDT balance
  const balanceDataQuery = useReadContract({
    address: USDT_CONTRACT as `0x${string}`,
    abi: MockUsdtABI.abi,
    functionName: "balanceOf",
    args: [address || "0x0"],
    query: {
      enabled: !!address,
    },
  })

  const { data: balanceData, refetch: refetchBalance } = balanceDataQuery

  // Update USDT balance
  useEffect(() => {
    if (balanceData) {
      setUserUsdtBalance(formatUnits(balanceData as bigint, 18))
    }
  }, [balanceData])

  const handleNFTDeposit = async (nftAddress: string, tokenId: string, maxAmount: number) => {
    if (!address) {
      setStatus("Please connect your wallet")
      return
    }

    setIsLoading(true)
    setStatus("Processing...")

    try {
      // First simulate approve NFT transfer
      console.log('nft address: ', nftAddress)
      // const { data: approveSimData } = await useSimulateContract({
      //   address: nftAddress as `0x${string}`,
      //   abi: DMON_NFT_CONTRACT.abi,
      //   functionName: "setApprovalForAll",
      //   args: [NFT_VAULT_CONTRACT, true],
      // })

      // if (approveSimData?.request) {
      if(nftAddress){
        // const approveTx = await approveNFT(approveSimData.request)
        const approveTx = await approveNFT({
          address: nftAddress as `0x${string}`,
          abi: DMON_NFT_CONTRACT.abi,
          functionName: "setApprovalForAll",
          args: [NFT_VAULT_CONTRACT, true]
        })
        setStatus("NFT transfer approved, depositing...")

        // Wait for transaction confirmation
        await new Promise((resolve) => setTimeout(resolve, 6000))

        // Then simulate deposit NFT
        // const { data: depositSimData } = await useSimulateContract({
        //   address: NFT_VAULT_CONTRACT as `0x${string}`,
        //   abi: NFTCollateralVaultABI.abi,
        //   functionName: "depositNFT",
        //   args: [nftAddress, Number(tokenId), parseUnits(maxAmount.toString(), 18)],
        // })

        // if (depositSimData?.request) {
        if (nftAddress && tokenId) {
          // const depositTx = await depositNFT(depositSimData.request)
          const depositTx = await depositNFT({
            address: NFT_VAULT_CONTRACT as `0x${string}`,
            abi: NFTCollateralVaultABI.abi,
            functionName: "depositNFT",
            args: [nftAddress, Number(tokenId), parseUnits(maxAmount.toString(), 18)],
          })
          setStatus("NFT successfully deposited! 🎉")
          toast({
            title: "Success",
            description: "NFT successfully deposited!",
          })

          // Wait for transaction confirmation
          await new Promise((resolve) => setTimeout(resolve, 6000))

          refetchCollaterals()
        }
      }
    } catch (error: any) {
      console.error("Error:", error)
      setStatus("")
      if (error.message?.includes(" invalid token ID")) {
        setError("Invalid TokenID Entered")
      } else if (error.message?.includes("transfer from incorrect owner")) {
        setError("You Are Not The Owner of the tokenId")
      } else if (error.message?.includes("NFT not whitelisted")) {
        setError("NFT not whitelisted")
      } else if (error.message.includes('NFT not whitelisted')){
        setError('NFT Not Yet Whitelisted In Contract..')
      }
      else {
        setError("Transaction failed")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleBorrow = async (collateralId: number, amount: string, durationInSeconds: number) => {
    if (!address) {
      setStatus("Please connect your wallet")
      return
    }

    setIsLoading(true)
    setStatus("Processing borrow request...")

    try {
      // Simulate borrow transaction
      const { data: borrowSimData } = await useSimulateContract({
        address: LOAN_MANAGER_CONTRACT as `0x${string}`,
        abi: LoanManagerABI.abi,
        functionName: "issueLoan",
        args: [BigInt(collateralId), parseUnits(amount, 18), BigInt(durationInSeconds)],
      }) 

      // if (borrowSimData?.request) {
      if (borrowSimData?.request) {
        // const tx = await borrowLoan(borrowSimData.request)
        const tx = await borrowLoan({
          address: LOAN_MANAGER_CONTRACT as `0x${string}`,
          abi: LoanManagerABI.abi,
          functionName: "issueLoan",
          args: [BigInt(collateralId), parseUnits(amount, 18), BigInt(durationInSeconds)]
        })
        setStatus("Loan successfully issued! 🎉")
        toast({
          title: "Success",
          description: "Loan successfully issued!",
        })

        // Wait for transaction confirmation
        await new Promise((resolve) => setTimeout(resolve, 6000))

        refetchCollaterals()
      }
    } catch (error: any) {
      console.error("Borrow failed:", error)
      setStatus("")
      setError("Transaction failed")
    } finally {
      setIsLoading(false)
    }
  }

  const handleNFTWithdrawn = async (collateralId: number) => {
    // Refresh user's collaterals
    await refetchCollaterals()
    // Reset selected collateral
    setSelectedCollateralId(null)
    setMaxLoanAmount("0")
  }

  // Determine if any operation is loading
  const isAnyLoading = isLoading || isApproveLoading || isDepositLoading || isBorrowLoading

  return (
    <div className="min-h-screen bg-[#0D111C] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#131A2A]/80 backdrop-blur-sm p-4 border-b border-[#1C2839]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold">Monad NFT Lending</h1>
          <ConnectWallet modalTitle="Connect Your Wallet" modalSize="wide" />
        </div>
      </header>

      {!ready || !authenticated || !address ? (
        // Show connect wallet message when no wallet is connected
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
          <div className="text-center space-y-6 max-w-lg">
            <p className="text-[#98A1C0] text-lg">
              Connect your wallet to start borrowing against your NFTs or providing liquidity to the platform.
            </p>
            <div className="inline-block">
              <ConnectWallet
                modalTitle="Connect Your Wallet"
                modalSize="wide"
                className="!bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] !text-white hover:opacity-90 transition-opacity"
              />
            </div>
          </div>
        </div>
      ) : (
        // Main content when wallet is connected
        <main className="container mx-auto px-4 py-6 space-y-8">
          {/* Add Mint Section at the top */}
          <section className="bg-[#131A2A] rounded-[20px] p-6">
            <MintDMONPage />
          </section>

          {/* Main Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Liquidity Section */}
            <section className="bg-[#131A2A] rounded-[20px] p-6">
              <h2 className="text-xl font-semibold mb-4 text-[#F5F6FC]">Liquidity Pool</h2>
              <LiquidityProvider />
            </section>

            {/* NFT Collateral Section */}
            <section className="bg-[#131A2A] rounded-[20px] p-6">
              <h2 className="text-xl font-semibold mb-4 text-[#F5F6FC]">NFT Collateral</h2>
              <WhitelistedNFTs onNFTDeposit={handleNFTDeposit} isLoading={isAnyLoading} />
            </section>
          </div>

          {/* Collateral Grid */}
          {userCollaterals.length > 0 && (
            <CollateralList
              collaterals={userCollaterals}
              onSelect={(collateral) => {
                setSelectedCollateralId(collateral.id)
              }}
              onNFTWithdrawn={handleNFTWithdrawn}
              onBorrow={handleBorrow}
            />
          )}

          {/* Status Messages */}
          {status && (
            <div
              className="fixed bottom-4 right-4 max-w-md bg-gray-800 p-4 rounded-lg 
                                  shadow-lg border border-gray-700 animate-fade-in-out"
              style={{
                animation: "fadeInOut 20s ease-in-out",
              }}
            >
              <p className="text-sm text-[#F5F6FC]">{status}</p>
            </div>
          )}

          {error && (
            <div
              className="fixed bottom-4 right-4 max-w-md bg-gray-800 p-4 rounded-lg 
                                  shadow-lg border border-gray-700 animate-fade-in-out"
              style={{
                animation: "fadeInOut 20s ease-in-out",
              }}
            >
              <p className="text-sm text-red-500">{error}</p>
            </div>
          )}
        </main>
      )}
    </div>
  )
}

export default App

