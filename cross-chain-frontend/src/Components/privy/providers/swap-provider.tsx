"use client"

import { createContext, useContext, useState, type ReactNode, useCallback } from "react"
import { usePrivy, useWallets } from "@privy-io/react-auth"
import { ethers } from "ethers"

// Define token interface
export interface Token {
  address: string
  symbol: string
  decimals: number
  name: string
}

// Define context interface
interface SwapContextType {
  tokens: Token[]
  fromToken: Token | null
  toToken: Token | null
  fromAmount: number
  toAmount: number
  swapQuote: any | null // Using any for now since we want the raw API response
  swapping: boolean
  error: string | null
  setFromToken: (token: Token) => void
  setToToken: (token: Token) => void
  setFromAmount: (amount: number) => void
  getQuote: () => Promise<void>
  executeSwap: () => Promise<void>
  switchTokens: () => void
}

const SwapContext = createContext<SwapContextType | undefined>(undefined)

// Token list remains the same
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
]

export function SwapProvider({ children }: { children: ReactNode }) {
  const [fromToken, setFromToken] = useState<Token | null>(MONAD_TESTNET_TOKENS[2])
  const [toToken, setToToken] = useState<Token | null>(MONAD_TESTNET_TOKENS[0])
  const [fromAmount, setFromAmount] = useState<number>(0)
  const [toAmount, setToAmount] = useState<number>(0)
  const [swapQuote, setSwapQuote] = useState<any | null>(null)
  const [swapping, setSwapping] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const { user } = usePrivy()
  const { wallets } = useWallets()

  // Get quote from 0x API v2
  const getQuote = useCallback(async () => {
    if (!fromToken || !toToken || fromAmount <= 0 || !user?.wallet?.address) {
      setSwapQuote(null)
      return
    }

    try {
      setError(null)

      const params = new URLSearchParams({
        chainId: "10143",
        sellToken: fromToken.address,
        buyToken: toToken.address,
        sellAmount: ethers.utils.parseUnits(fromAmount.toString(), fromToken.decimals).toString(),
        takerAddress: user.wallet.address,
        skipValidation: "true",
        enableSlippageProtection: "true",
      })

      console.log("Fetching quote with params:", params.toString())
      const response = await fetch(`/api/quote?${params.toString()}`)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      const quoteData = await response.json()
      console.log("Quote data:", quoteData)

      // Store the raw quote data
      setSwapQuote(quoteData)

      // Update toAmount if buyAmount is available
      if (quoteData.buyAmount) {
        setToAmount(Number(ethers.utils.formatUnits(quoteData.buyAmount, toToken.decimals)))
      }
    } catch (err: any) {
      console.error("Error getting quote:", err)
      setError(err.message || "Failed to get swap quote. Please try again.")
      setSwapQuote(null)
    }
  }, [fromToken, toToken, fromAmount, user])

  // Execute swap transaction
  const executeSwap = useCallback(async () => {
    if (!fromToken || !toToken || !swapQuote || !user?.wallet?.address) {
      return
    }

    try {
      setSwapping(true)
      setError(null)

      const activeWallet = wallets.find((wallet) => wallet.address === user.wallet?.address)
      if (!activeWallet) {
        throw new Error("No active wallet found")
      }

      const provider = await activeWallet.getEthereumProvider()
      const ethersProvider = new ethers.providers.Web3Provider(provider)
      const signer = ethersProvider.getSigner()

      // Check if allowance is needed
      if (swapQuote.issues?.allowance && fromToken.address !== ethers.constants.AddressZero) {
        console.log("Handling allowance...")
        const tokenContract = new ethers.Contract(
          fromToken.address,
          ["function approve(address spender, uint256 amount) public returns (bool)"],
          signer,
        )

        const approveTx = await tokenContract.approve(swapQuote.issues.allowance.spender, ethers.constants.MaxUint256)
        await approveTx.wait()
        console.log("Allowance approved")
      }

      // Handle Permit2 signature if needed
      let signature
      if (swapQuote.permit2?.eip712) {
        console.log("Signing Permit2 message...")
        try {
          signature = await signer._signTypedData(
            swapQuote.permit2.eip712.domain,
            swapQuote.permit2.eip712.types,
            swapQuote.permit2.eip712.message,
          )
          console.log("Permit2 message signed")

          // Append signature to transaction data if needed
          if (signature && swapQuote.transaction?.data) {
            const sigLength = ethers.utils.hexZeroPad(ethers.utils.hexlify(signature.length / 2 + 1), 32)
            swapQuote.transaction.data = ethers.utils.hexConcat([swapQuote.transaction.data, sigLength, signature])
          }
        } catch (error) {
          console.error("Error signing Permit2 message:", error)
          throw new Error("Failed to sign Permit2 message")
        }
      }

      // Execute the swap transaction
      const tx = await signer.sendTransaction({
        to: swapQuote.transaction.to,
        data: swapQuote.transaction.data,
        value: swapQuote.transaction.value || "0",
        gasLimit: swapQuote.transaction.gas || "500000",
      })

      const receipt = await tx.wait()
      console.log("Swap transaction confirmed:", receipt)

      if (receipt.status === 1) {
        setFromAmount(0)
        setToAmount(0)
        setSwapQuote(null)
        console.log("Swap executed successfully!")
      } else {
        throw new Error("Transaction failed")
      }
    } catch (err: any) {
      console.error("Error executing swap:", err)
      setError(err.message || "Failed to execute swap. Please try again.")
    } finally {
      setSwapping(false)
    }
  }, [fromToken, toToken, swapQuote, user, wallets])

  // Switch tokens function remains the same
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




///////////////////////////////////////////////////////////////////////////
// "use client"

// import { createContext, useContext, useState, type ReactNode, useCallback } from "react"
// import { usePrivy, useWallets } from "@privy-io/react-auth"
// import { ethers } from "ethers"
// import { Hex } from "viem"

// // Define token interface
// export interface Token {
//   address: string
//   symbol: string
//   decimals: number
//   name: string
// }

// // Define quote interface
// export interface SwapQuote {
//   price: number
//   toAmount: number
//   estimatedGas: number
//   blockNumber: string
//   buyAmount: string
//   buyToken: string
//   transaction: {
//     to: string
//     data: string
//     value: string
//     gas: string
//   }
// }

// // Define context interface
// interface SwapContextType {
//   tokens: Token[]
//   fromToken: Token | null
//   toToken: Token | null
//   fromAmount: number
//   toAmount: number
//   swapQuote: SwapQuote | null
//   swapping: boolean
//   error: string | null
//   setFromToken: (token: Token) => void
//   setToToken: (token: Token) => void
//   setFromAmount: (amount: number) => void
//   getQuote: () => Promise<void>
//   executeSwap: () => Promise<void>
//   switchTokens: () => void
// }

// // Create context
// const SwapContext = createContext<SwapContextType | undefined>(undefined)

// // Update token addresses with actual Monad testnet addresses
// const MONAD_TESTNET_TOKENS: Token[] = [
//   {
//     address: "0x88b8E2161DEDC77EF4ab7585569D2415a1C1055D",
//     symbol: "USDT",
//     decimals: 6,
//     name: "Tether USD",
//   },
//   {
//     address: "0xf817257fed379853cDe0fa4F97AB987181B1E5Ea",
//     symbol: "USDC",
//     decimals: 6,
//     name: "USDC",
//   },
//   {
//     address: "0x760AfE86e5de5fa0Ee542fc7B7B713e1c5425701",
//     symbol: "WMON",
//     decimals: 18,
//     name: "Wrapped MON",
//   },
//   {
//     address: "0x5D876D73f4441D5f2438B1A3e2A51771B337F27A",
//     symbol: "cUSDC",
//     decimals: 6,
//     name: "CURVANCE USDC",
//   },
// ]

// export function SwapProvider({ children }: { children: ReactNode }) {
//   const [fromToken, setFromToken] = useState<Token | null>(MONAD_TESTNET_TOKENS[0])
//   const [toToken, setToToken] = useState<Token | null>(MONAD_TESTNET_TOKENS[1])
//   const [fromAmount, setFromAmount] = useState<number>(0)
//   const [toAmount, setToAmount] = useState<number>(0)
//   const [swapQuote, setSwapQuote] = useState<SwapQuote | null>(null)
//   const [swapping, setSwapping] = useState<boolean>(false)
//   const [error, setError] = useState<string | null>(null)

//   const { user } = usePrivy()
//   const { wallets } = useWallets()

//   // Get quote from 0x API v2
//   const getQuote = useCallback(async () => {
//     if (!fromToken || !toToken || fromAmount <= 0 || !user?.wallet?.address) {
//       setSwapQuote(null)
//       return
//     }

//     try {
//       setError(null)

//       const params = new URLSearchParams({
//         chainId: "10143",
//         sellToken: fromToken.address as string,
//         buyToken: toToken.address as string,
//         sellAmount: ethers.utils.parseUnits(fromAmount.toString(), fromToken.decimals).toString(),
//         taker: user.wallet.address as string,
//         swapFeeRecipient: '0xED42844Cd35d734fec3B65dF486158C443896b41',
//         swapFeeBps: '1000',
//         swapFeeToken: fromToken.address as string,
//         skipValidation: "true",
//         enableSlippageProtection: "true",
//       })

//       const response = await fetch(`/api/quote?${params.toString()}`)
//       if (!response.ok) throw new Error("Failed to fetch quote")

//       const quoteData = await response.json()
//       console.log("Quote data:", quoteData)

//       // Calculate price based on amounts and decimals
//       const sellAmountInDecimals = ethers.utils.formatUnits(quoteData.sellAmount || "0", fromToken.decimals)
//       const buyAmountInDecimals = ethers.utils.formatUnits(quoteData.buyAmount || "0", toToken.decimals)
//       const price = Number(buyAmountInDecimals) / Number(sellAmountInDecimals)

//       setSwapQuote({
//         ...quoteData,
//         price,
//         toAmount: Number(buyAmountInDecimals),
//         estimatedGas: Number(ethers.utils.formatEther(quoteData.transaction.gas || "0")),
//       })

//       setToAmount(Number(buyAmountInDecimals))
//     } catch (err: any) {
//       console.error("Error getting quote:", err)
//       setError(err.message || "Failed to get swap quote. Please try again.")
//       setSwapQuote(null)
//     }
//   }, [fromToken, toToken, fromAmount, user])

//   // Execute swap transaction
//   const executeSwap = useCallback(async () => {
//     if (!fromToken || !toToken || !swapQuote || !user?.wallet?.address) {
//       return
//     }

//     try {
//       setSwapping(true)
//       setError(null)

//       const activeWallet = wallets.find((wallet) => wallet.address === user.wallet?.address)
//       if (!activeWallet) throw new Error("No active wallet found")

//       const provider = await activeWallet.getEthereumProvider()
//       const ethersProvider = new ethers.providers.Web3Provider(provider)
//       const signer = ethersProvider.getSigner()

//       // Check and handle token approvals for non-native tokens
//       if (fromToken.address !== ethers.constants.AddressZero) {
//         const tokenContract = new ethers.Contract(
//           fromToken.address,
//           [
//             "function allowance(address,address) view returns (uint256)",
//             "function approve(address,uint256) returns (bool)",
//           ],
//           signer,
//         )

//         // Use the transaction.to address as the spender
//         const spender = swapQuote.transaction.to
//         const currentAllowance = await tokenContract.allowance(user.wallet.address, spender)

//         const requiredAmount = ethers.BigNumber.from(swapQuote.buyAmount || fromAmount)

//         if (currentAllowance.lt(requiredAmount)) {
//           console.log(`Approving ${fromToken.symbol}...`)
//           const approveTx = await tokenContract.approve(
//             spender,
//             ethers.constants.MaxUint256, // Approve maximum amount
//           )
//           await approveTx.wait()
//           console.log(`${fromToken.symbol} approved`)
//         }
//       }

//       // Execute the swap using the transaction data from the quote
//       const tx = await signer.sendTransaction({
//         to: swapQuote.transaction.to,
//         data: swapQuote.transaction.data as Hex, // use raw transaction
//         value: swapQuote.transaction.value,
//         gasLimit: ethers.BigNumber.from(swapQuote.transaction.gas).mul(120).div(100), // Add 20% to estimated gas
//         chainId: 10143
//       })

//       console.log("Swap transaction sent:", tx.hash)
//       const receipt = await tx.wait()
//       console.log("Swap confirmed:", receipt)

//       if (receipt.status === 1) {
//         setFromAmount(0)
//         setToAmount(0)
//         setSwapQuote(null)
//         console.log("Swap executed successfully!")
//       } else {
//         throw new Error("Transaction failed")
//       }
//     } catch (err: any) {
//       console.log("Error executing swap:", err)
//       setError("Failed to execute swap. Please try again.")
//     } finally {
//       setSwapping(false)
//     }
//   }, [fromToken, toToken, swapQuote, user, wallets, fromAmount])

//   // Switch from and to tokens
//   const switchTokens = () => {
//     if (!fromToken || !toToken) return

//     const tempToken = fromToken
//     const tempAmount = fromAmount

//     setFromToken(toToken)
//     setToToken(tempToken)

//     if (swapQuote) {
//       setFromAmount(toAmount)
//       setToAmount(tempAmount)
//       setTimeout(() => getQuote(), 0)
//     }
//   }

//   return (
//     <SwapContext.Provider
//       value={{
//         tokens: MONAD_TESTNET_TOKENS,
//         fromToken,
//         toToken,
//         fromAmount,
//         toAmount,
//         swapQuote,
//         swapping,
//         error,
//         setFromToken,
//         setToToken,
//         setFromAmount,
//         getQuote,
//         executeSwap,
//         switchTokens,
//       }}
//     >
//       {children}
//     </SwapContext.Provider>
//   )
// }

// export function useSwap() {
//   const context = useContext(SwapContext)
//   if (context === undefined) {
//     throw new Error("useSwap must be used within a SwapProvider")
//   }
//   return context
// }


///////////////////////////////////////////////////////////////////////////////////////////////////////////////

// "use client"

// import { createContext, useContext, useState, type ReactNode, useCallback } from "react"
// import { usePrivy, useWallets } from "@privy-io/react-auth"
// import { ethers } from "ethers"

// // Define token interface
// export interface Token {
//   address: string
//   symbol: string
//   decimals: number
//   name: string
// }

// // Define quote interface
// export interface SwapQuote {
//   price: number;
//   toAmount: number;
//   estimatedGas: number;
//   blockNumber: string;
//   buyAmount: string;
//   buyToken: string;
//   fees: {
//     gasFee: null;
//     integratorFee: null;
//     zeroExFee: {
//       amount: string;
//       token: string;
//       type: string;
//     };
//   };
//   issues: {
//     allowance: {
//       actual: string;
//       spender: string;
//     };
//     balance: {
//       actual: string;
//       expected: string;
//       token: string;
//     };
//   };
//   sellAmount: string;
//   sellToken: string;
//   transaction: {
//     data: string;
//     gas: string;
//     gasPrice: string;
//     to: string;
//     value: string;
//   };
// }

// // Define context interface
// interface SwapContextType {
//   tokens: Token[]
//   fromToken: Token | null
//   toToken: Token | null
//   fromAmount: number
//   toAmount: number
//   swapQuote: SwapQuote | null
//   swapping: boolean
//   error: string | null
//   setFromToken: (token: Token) => void
//   setToToken: (token: Token) => void
//   setFromAmount: (amount: number) => void
//   getQuote: () => Promise<void>
//   executeSwap: () => Promise<void>
//   switchTokens: () => void
// }

// // Create context
// const SwapContext = createContext<SwapContextType | undefined>(undefined)

// // Update token addresses with actual Monad testnet addresses
// const MONAD_TESTNET_TOKENS: Token[] = [
//   // {
//   //   address: "0x0000000000000000000000000000000000000000",
//   //   symbol: "MON",
//   //   decimals: 18,
//   //   name: "Monad",
//   // },
//   {
//     address: '0x760AfE86e5de5fa0Ee542fc7B7B713e1c5425701',
//     symbol: 'WMON',
//     decimals: 18,
//     name: 'Wrapped MON'
//   },
//   {
//     address: "0x88b8E2161DEDC77EF4ab7585569D2415a1C1055D",
//     symbol: "USDT",
//     decimals: 6,
//     name: "Tether USD",
//   },
//   {
//     address: "0xf817257fed379853cDe0fa4F97AB987181B1E5Ea",
//     symbol: "USDC",
//     decimals: 6,
//     name: "USDC",
//   },
//   {
//     address: "0x5D876D73f4441D5f2438B1A3e2A51771B337F27A",
//     symbol: "cUSDC",
//     decimals: 6,
//     name: "CURVANCE USDC",
//   },
// ]

// export function SwapProvider({ children }: { children: ReactNode }) {
//   const [fromToken, setFromToken] = useState<Token | null>(MONAD_TESTNET_TOKENS[0])
//   const [toToken, setToToken] = useState<Token | null>(MONAD_TESTNET_TOKENS[1])
//   const [fromAmount, setFromAmount] = useState<number>(0)
//   const [toAmount, setToAmount] = useState<number>(0)
//   const [swapQuote, setSwapQuote] = useState<SwapQuote | null>(null)
//   const [swapping, setSwapping] = useState<boolean>(false)
//   const [error, setError] = useState<string | null>(null)

//   const { user } = usePrivy()
//   const { wallets } = useWallets()
//   const activeWallet = wallets.find((wallet) => wallet.address === user?.wallet?.address);

//   // Get price estimate first
//   const getPrice = useCallback(async () => {
//     if (!fromToken || !toToken || fromAmount <= 0 || !user?.wallet?.address) {
//       return null
//     }

//     const params = new URLSearchParams({
//       chainId: "10143",
//       sellToken: fromToken.address,
//       buyToken: toToken.address,
//       sellAmount: ethers.utils.parseUnits(fromAmount.toString(), fromToken.decimals).toString(),
//       taker: user.wallet.address,
//       swapFeeRecipient: user.wallet.address as string,
//       swapFeeBps: '1000',
//       swapFeeToken: fromToken.address as string,
//     })

//     try {
//       const response = await fetch(`/api/price?${params.toString()}`)
//       if (!response.ok) throw new Error("Failed to fetch price")
//       return await response.json()
//     } catch (err) {
//       console.error("Error fetching price:", err)
//       return null
//     }
//   }, [fromToken, toToken, fromAmount, user])

//   // Get quote and execute swap
//   const getQuote = useCallback(async () => {
//     if (!fromToken || !toToken || fromAmount <= 0 || !user?.wallet?.address) {
//       setSwapQuote(null);
//       return;
//     }

//     try {
//       setError(null);

//       const params = new URLSearchParams({
//         chainId: "10143",
//         sellToken: fromToken.address,
//         buyToken: toToken.address,
//         sellAmount: ethers.utils.parseUnits(fromAmount.toString(), fromToken.decimals).toString(),
//         taker: user.wallet.address, 
//         swapFeeRecipient: '0xED42844Cd35d734fec3B65dF486158C443896b41',
//         swapFeeBps: '1000',
//         swapFeeToken: fromToken.address,
//         skipValidation: "true",
//         enableSlippageProtection: "true",
//       });

//       const response = await fetch(`/api/quote?${params.toString()}`);
//       if (!response.ok) throw new Error("Failed to fetch quote");

//       const quoteData = await response.json();
//       console.log("Quote data:", quoteData);

//       // Calculate price based on amounts and decimals
//       const sellAmountInDecimals = ethers.utils.formatUnits(quoteData.sellAmount, fromToken.decimals);
//       const buyAmountInDecimals = ethers.utils.formatUnits(quoteData.buyAmount, toToken.decimals);
//       const price = Number(buyAmountInDecimals) / Number(sellAmountInDecimals);

//       setSwapQuote({
//         ...quoteData,
//         price,
//         toAmount: Number(buyAmountInDecimals),
//         estimatedGas: Number(ethers.utils.formatEther(quoteData.transaction.gas || "0")),
//       });

//       setToAmount(Number(buyAmountInDecimals));
//     } catch (err: any) {
//       console.error("Error getting quote:", err);
//       setError(err.message || "Failed to get swap quote. Please try again.");
//       setSwapQuote(null);
//     }
//   }, [fromToken, toToken, fromAmount, user]);

//   // Execute swap transaction
//   const executeSwap = useCallback(async () => {
//     if (!fromToken || !toToken || !swapQuote || !user?.wallet?.address) {
//       return;
//     }

//     try {
//       setSwapping(true);
//       setError(null);
//       console.log('swap quote: ', swapQuote)

//       // const activeWallet = wallets.find((wallet) => wallet.address === user.wallet?.address);
//       if (!activeWallet) throw new Error("No active wallet found");

//       const provider = await activeWallet.getEthereumProvider();
//       const ethersProvider = new ethers.providers.Web3Provider(provider);
//       const signer = ethersProvider.getSigner();

//       // Check and handle token approvals
//       if (fromToken.address !== ethers.constants.AddressZero) {
//         const tokenContract = new ethers.Contract(
//           fromToken.address,
//           ["function allowance(address,address) view returns (uint256)",
//             "function approve(address,uint256) returns (bool)"],
//           signer
//         );
//         console.log('swap quote: ', swapQuote)

//         const currentAllowance = await tokenContract.allowance(
//           user.wallet.address,
//           swapQuote.issues.allowance.spender
//         );

//         const requiredAmount = ethers.BigNumber.from(swapQuote.sellAmount);

//         if (currentAllowance.lt(requiredAmount)) {
//           console.log(`Approving ${fromToken.symbol}...`);
//           const approveTx = await tokenContract.approve(
//             swapQuote.issues.allowance.spender,
//             requiredAmount.mul(2) // Approve for 2x the amount needed
//           );
//           await approveTx.wait();
//           console.log(`${fromToken.symbol} approved`);
//         }
//       }

//       // Execute the swap
//       const tx = await signer.sendTransaction({
//         to: swapQuote.transaction.to,
//         data: swapQuote.transaction.data,
//         value: swapQuote.transaction.value,
//         gasLimit: ethers.BigNumber.from(swapQuote.transaction.gas).mul(120).div(100), // Add 20% to estimated gas
//       });

//       console.log("Swap transaction sent:", tx.hash);
//       const receipt = await tx.wait();
//       console.log("Swap confirmed:", receipt);

//       if (receipt.status === 1) {
//         setFromAmount(0);
//         setToAmount(0);
//         setSwapQuote(null);
//         console.log("Swap executed successfully!");
//       } else {
//         throw new Error("Transaction failed");
//       }
//     } catch (err: any) {
//       console.error("Error executing swap:", err);
//       setError(err.message || "Failed to execute swap. Please try again.");
//     } finally {
//       setSwapping(false);
//     }
//   }, [fromToken, toToken, swapQuote, user, wallets]);

//   // Switch from and to tokens
//   const switchTokens = () => {
//     if (!fromToken || !toToken) return

//     const tempToken = fromToken
//     const tempAmount = fromAmount

//     setFromToken(toToken)
//     setToToken(tempToken)

//     if (swapQuote) {
//       setFromAmount(toAmount)
//       setToAmount(tempAmount)
//       setTimeout(() => getQuote(), 0)
//     }
//   }

//   return (
//     <SwapContext.Provider
//       value={{
//         tokens: MONAD_TESTNET_TOKENS,
//         fromToken,
//         toToken,
//         fromAmount,
//         toAmount,
//         swapQuote,
//         swapping,
//         error,
//         setFromToken,
//         setToToken,
//         setFromAmount,
//         getQuote,
//         executeSwap,
//         switchTokens,
//       }}
//     >
//       {children}
//     </SwapContext.Provider>
//   )
// }

// export function useSwap() {
//   const context = useContext(SwapContext)
//   if (context === undefined) {
//     throw new Error("useSwap must be used within a SwapProvider")
//   }
//   return context
// }





////////////////////////////////////////////working properly with qoute---------------///////////////////
// "use client"

// import { createContext, useContext, useState, type ReactNode, useCallback } from "react"
// import { usePrivy, useWallets } from "@privy-io/react-auth"
// import { ethers } from "ethers"

// // Define token interface
// export interface Token {
//   address: string
//   symbol: string
//   decimals: number
//   name: string
// }

// // Define quote interface
// export interface SwapQuote {
//   price: number
//   toAmount: number
//   estimatedGas: number
//   data: string
//   allowanceTarget: string
//   permit2Data?: {
//     token: string
//     amount: string
//     nonce: string
//     deadline: string
//   }
// }

// // Define context interface
// interface SwapContextType {
//   tokens: Token[]
//   fromToken: Token | null
//   toToken: Token | null
//   fromAmount: number
//   toAmount: number
//   swapQuote: SwapQuote | null
//   swapping: boolean
//   error: string | null
//   setFromToken: (token: Token) => void
//   setToToken: (token: Token) => void
//   setFromAmount: (amount: number) => void
//   getQuote: () => Promise<void>
//   executeSwap: () => Promise<void>
//   switchTokens: () => void
// }

// // Create context
// const SwapContext = createContext<SwapContextType | undefined>(undefined)

// // Update token addresses with actual Monad testnet addresses
// const MONAD_TESTNET_TOKENS: Token[] = [
//   // {
//   //   address: "0x0000000000000000000000000000000000000000",
//   //   symbol: "MON",
//   //   decimals: 18,
//   //   name: "Monad",
//   // },
//   {
//     address: "0x88b8E2161DEDC77EF4ab7585569D2415a1C1055D",
//     symbol: "USDT",
//     decimals: 6,
//     name: "Tether USD",
//   },
//   {
//     address: "0xf817257fed379853cDe0fa4F97AB987181B1E5Ea",
//     symbol: "USDC",
//     decimals: 6,
//     name: "USDC",
//   },
//   {
//     address: '0x760AfE86e5de5fa0Ee542fc7B7B713e1c5425701',
//     symbol: 'WMON',
//     decimals: 18,
//     name: 'Wrapped MON'
//   },
//   {
//     address: "0x5D876D73f4441D5f2438B1A3e2A51771B337F27A",
//     symbol: "cUSDC",
//     decimals: 6,
//     name: "CURVANCE USDC",
//   },
// ]

// export function SwapProvider({ children }: { children: ReactNode }) {
//   const [fromToken, setFromToken] = useState<Token | null>(MONAD_TESTNET_TOKENS[0])
//   const [toToken, setToToken] = useState<Token | null>(MONAD_TESTNET_TOKENS[1])
//   const [fromAmount, setFromAmount] = useState<number>(0)
//   const [toAmount, setToAmount] = useState<number>(0)
//   const [swapQuote, setSwapQuote] = useState<SwapQuote | null>(null)
//   const [swapping, setSwapping] = useState<boolean>(false)
//   const [error, setError] = useState<string | null>(null)

//   const { user } = usePrivy()
//   const { wallets } = useWallets()

//   // Get quote from 0x API v2
//   const getQuote = useCallback(async () => {
//     if (!fromToken || !toToken || fromAmount <= 0 || !user?.wallet?.address) {
//       setSwapQuote(null)
//       return
//     }

//     try {
//       setError(null)

//       const params = new URLSearchParams({
//         chainId: '10143',
//         sellToken: fromToken.address as string,
//         buyToken: toToken.address as string,
//         sellAmount: ethers.utils.parseUnits(fromAmount.toString(), fromToken.decimals).toString(),
//         taker: user.wallet.address,
//         swapFeeRecipient: user.wallet.address as string,
//         swapFeeBps: '1000',
//         swapFeeToken: fromToken.address as string,
//       })

//       // Add error handling for the fetch request
//       const response = await fetch(`/api/quote?${params.toString()}`)
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`)
//       }

//       const quoteData = await response.json()
//       if (quoteData.error) {
//         throw new Error(quoteData.error)
//       }

//       console.log('qoute data: ',quoteData)

//       setToAmount(Number.parseFloat(ethers.utils.formatUnits(quoteData.buyAmount, toToken.decimals)))
//       setSwapQuote({
//         price: Number.parseFloat(quoteData.price),
//         toAmount: Number.parseFloat(ethers.utils.formatUnits(quoteData.buyAmount, toToken.decimals)),
//         estimatedGas: Number.parseFloat(ethers.utils.formatEther(quoteData.estimatedGas || "0")),
//         data: quoteData.data,
//         allowanceTarget: quoteData.issues.allowance.spender,
//         permit2Data: quoteData.permit2Data,
//       })
//     } catch (err: any) {
//       console.error("Error getting quote:", err)
//       setError(err.message || "Failed to get swap quote. Please try again.")
//       setSwapQuote(null)
//     }
//   }, [fromToken, toToken, fromAmount, user])

//   // Execute swap transaction
//   const executeSwap = useCallback(async () => {
//     if (!fromToken || !toToken || !swapQuote || !user?.wallet?.address) {
//       return
//     }

//     try {
//       setSwapping(true)
//       setError(null)

//       const activeWallet = wallets.find((wallet) => wallet.address === user.wallet?.address)
//       if (!activeWallet) {
//         throw new Error("No active wallet found")
//       }

//       const provider = await activeWallet.getEthereumProvider()
//       const ethersProvider = new ethers.providers.Web3Provider(provider)
//       const signer = ethersProvider.getSigner()

//       // Handle token approvals
//       if (fromToken.address !== ethers.constants.AddressZero) {
//         if (swapQuote.permit2Data) {
//           // Handle Permit2 approval
//           const permit2Contract = new ethers.Contract(
//             "0x000000000022D473030F116dDEE9F6B43aC78BA3", // Permit2 contract address
//             [
//               "function approve(address token, address spender, uint256 amount, uint256 deadline)",
//               "function permitTransferFrom(tuple(address token, uint256 amount, uint256 nonce, uint256 deadline) permit, tuple(address from, address to, uint256 amount) transferDetails, address owner, bytes signature)",
//             ],
//             signer,
//           )

//           const deadline = Math.floor(Date.now() / 1000) + 3600 // 1 hour from now
//           const approveTx = await permit2Contract.approve(
//             fromToken.address,
//             swapQuote.allowanceTarget,
//             ethers.constants.MaxUint256,
//             deadline,
//           )
//           await approveTx.wait()
//         } else {
//           // Regular ERC20 approval
//           const tokenContract = new ethers.Contract(
//             fromToken.address,
//             ["function approve(address spender, uint256 amount) public returns (bool)"],
//             signer,
//           )

//           const approveTx = await tokenContract.approve(swapQuote.allowanceTarget, ethers.constants.MaxUint256)
//           await approveTx.wait()
//         }
//       }

//       // Execute the swap
//       const tx = await signer.sendTransaction({
//         to: swapQuote.allowanceTarget,
//         data: swapQuote.data,
//         value:
//           fromToken.address === ethers.constants.AddressZero ? ethers.utils.parseEther(fromAmount.toString()) : "0",
//         gasLimit: 300000,
//       })

//       await tx.wait()

//       // Reset state after successful swap
//       setFromAmount(0)
//       setToAmount(0)
//       setSwapQuote(null)

//       console.log("Swap executed successfully!")
//     } catch (err) {
//       console.error("Error executing swap:", err)
//       setError("Failed to execute swap. Please try again.")
//     } finally {
//       setSwapping(false)
//     }
//   }, [fromToken, toToken, swapQuote, user, wallets, fromAmount])

//   // Switch from and to tokens
//   const switchTokens = () => {
//     if (!fromToken || !toToken) return

//     const tempToken = fromToken
//     const tempAmount = fromAmount

//     setFromToken(toToken)
//     setToToken(tempToken)

//     if (swapQuote) {
//       setFromAmount(toAmount)
//       setToAmount(tempAmount)
//       setTimeout(() => getQuote(), 0)
//     }
//   }

//   return (
//     <SwapContext.Provider
//       value={{
//         tokens: MONAD_TESTNET_TOKENS,
//         fromToken,
//         toToken,
//         fromAmount,
//         toAmount,
//         swapQuote,
//         swapping,
//         error,
//         setFromToken,
//         setToToken,
//         setFromAmount,
//         getQuote,
//         executeSwap,
//         switchTokens,
//       }}
//     >
//       {children}
//     </SwapContext.Provider>
//   )
// }

// export function useSwap() {
//   const context = useContext(SwapContext)
//   if (context === undefined) {
//     throw new Error("useSwap must be used within a SwapProvider")
//   }
//   return context
// }


/////////////////////////////////////////////////////////////////////////////////////////

// "use client"

// import { createContext, useContext, useState, type ReactNode, useCallback } from "react"
// import { usePrivy, useWallets } from "@privy-io/react-auth"
// import { ethers } from "ethers"

// // Define token interface
// export interface Token {
//   address: string
//   symbol: string
//   decimals: number
//   name: string
// }

// // Define quote interface
// export interface SwapQuote {
//   price: number
//   toAmount: number
//   estimatedGas: number
//   data: string
//   allowanceTarget: string
//   permit2Data?: {
//     token: string
//     amount: string
//     nonce: string
//     deadline: string
//   }
// }

// // Define context interface
// interface SwapContextType {
//   tokens: Token[]
//   fromToken: Token | null
//   toToken: Token | null
//   fromAmount: number
//   toAmount: number
//   swapQuote: SwapQuote | null
//   swapping: boolean
//   error: string | null
//   setFromToken: (token: Token) => void
//   setToToken: (token: Token) => void
//   setFromAmount: (amount: number) => void
//   getQuote: () => Promise<void>
//   executeSwap: () => Promise<void>
//   switchTokens: () => void
// }

// // Create context
// const SwapContext = createContext<SwapContextType | undefined>(undefined)

// // Update the API base URL and add API configuration
// const ZRX_API_BASE_URL = "https://api.0x.org"
// const API_CONFIG = {
//   headers: {
//     "Content-Type": "application/json",
//     "0x-api-key": process.env.NEXT_PUBLIC_ZEROX_API_KEY as string,
//     // Add CORS headers
//     "Access-Control-Allow-Origin": "*",
//     "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
//     "Access-Control-Allow-Headers": "Content-Type, Authorization",
//     "0x-version": "v2",
//   },
// }

// // Update token addresses with actual Monad testnet addresses
// const MONAD_TESTNET_TOKENS: Token[] = [
//   {
//     address: "0x0000000000000000000000000000000000000000",
//     symbol: "MON",
//     decimals: 18,
//     name: "Monad",
//   },
//   {
//     address: "0x88b8E2161DEDC77EF4ab7585569D2415a1C1055D", // Replace with actual USDT address
//     symbol: "USDT",
//     decimals: 6,
//     name: "Tether USD",
//   },
//   {
//     address: "0xf817257fed379853cDe0fa4F97AB987181B1E5Ea", 
//     symbol: "USDC",
//     decimals: 6,
//     name: "USDC",
//   },
//   {
//     address: "0x5D876D73f4441D5f2438B1A3e2A51771B337F27A", // CURVANCE USDC
//     symbol: "cUSDC",
//     decimals: 6,
//     name: "CURVANCE USDC",
//   },
// ]

// // Define the 0x API base URL for Monad testnet

// export function SwapProvider({ children }: { children: ReactNode }) {
//   const [fromToken, setFromToken] = useState<Token | null>(MONAD_TESTNET_TOKENS[0])
//   const [toToken, setToToken] = useState<Token | null>(MONAD_TESTNET_TOKENS[1])
//   const [fromAmount, setFromAmount] = useState<number>(0)
//   const [toAmount, setToAmount] = useState<number>(0)
//   const [swapQuote, setSwapQuote] = useState<SwapQuote | null>(null)
//   const [swapping, setSwapping] = useState<boolean>(false)
//   const [error, setError] = useState<string | null>(null)

//   const { user } = usePrivy()
//   const { wallets } = useWallets()

//   // Get quote from 0x API v2
//   const getQuote = useCallback(async () => {
//     if (!fromToken || !toToken || fromAmount <= 0 || !user?.wallet?.address) {
//       setSwapQuote(null)
//       return
//     }

//     try {
//       setError(null)

//       // Create the API URL with all necessary parameters
//       // const params = new URLSearchParams({
//       //   chainId: '10143',
//       //   sellToken: fromToken.address,
//       //   buyToken: toToken.address,
//       //   sellAmount: ethers.utils.parseUnits(fromAmount.toString(), fromToken.decimals).toString(),
//       //   taker: user.wallet.address,
//       //   swapFeeRecipient: '0xED42844Cd35d734fec3B65dF486158C443896b41',
//       //   swapFeeToken: fromToken.address,
//       //   tradeSurplusRecipient: "0xED42844Cd35d734fec3B65dF486158C443896b41",
//       // })

//       const params = new URLSearchParams({
//         // chainId: '10143',
//         sellToken: fromToken.address,
//         buyToken: toToken.address,
//         sellAmount: ethers.utils.parseUnits(fromAmount.toString(), fromToken.decimals).toString(),
//         taker: user.wallet.address,
//         swapFeeRecipient: '0xED42844Cd35d734fec3B65dF486158C443896b41',
//         swapFeeToken: fromToken.address,
//         tradeSurplusRecipient: "0xED42844Cd35d734fec3B65dF486158C443896b41",
//       })

//       // Use the fetch API with proper headers and error handling
//       // const response = await fetch(`${ZRX_API_BASE_URL}/swap/permit2/quote?${params}`, {
//       //   method: "GET",
//       //   headers: API_CONFIG.headers,
//       // })
//        const response = await fetch(`/api/quote?${params.toString()}`);

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}))
//         throw new Error(errorData.reason || "Failed to fetch quote from 0x API")
//       }

//       const quoteData = await response.json()

//       setToAmount(Number.parseFloat(ethers.utils.formatUnits(quoteData.buyAmount, toToken.decimals)))
//       setSwapQuote({
//         price: Number.parseFloat(quoteData.price),
//         toAmount: Number.parseFloat(ethers.utils.formatUnits(quoteData.buyAmount, toToken.decimals)),
//         estimatedGas: Number.parseFloat(ethers.utils.formatEther(quoteData.estimatedGas)),
//         data: quoteData.data,
//         allowanceTarget: quoteData.allowanceTarget,
//         permit2Data: quoteData.permit2Data,
//       })
//     } catch (err) {
//       console.error("Error getting quote:", err)
//       setError("Failed to get swap quote. Please try again.")
//       setSwapQuote(null)
//     }
//   }, [fromToken, toToken, fromAmount, user])

//   // Execute swap transaction
//   const executeSwap = useCallback(async () => {
//     if (!fromToken || !toToken || !swapQuote || !user?.wallet?.address) {
//       return
//     }

//     try {
//       setSwapping(true)
//       setError(null)

//       const activeWallet = wallets.find((wallet) => wallet.address === user.wallet?.address)
//       if (!activeWallet) {
//         throw new Error("No active wallet found")
//       }

//       const provider = await activeWallet.getEthereumProvider()
//       const ethersProvider = new ethers.providers.Web3Provider(provider)
//       const signer = ethersProvider.getSigner()

//       // Handle token approvals
//       if (fromToken.address !== ethers.constants.AddressZero) {
//         if (swapQuote.permit2Data) {
//           // Handle Permit2 approval
//           const permit2Contract = new ethers.Contract(
//             "0x000000000022D473030F116dDEE9F6B43aC78BA3", // Permit2 contract address
//             [
//               "function approve(address token, address spender, uint256 amount, uint256 deadline)",
//               "function permitTransferFrom(tuple(address token, uint256 amount, uint256 nonce, uint256 deadline) permit, tuple(address from, address to, uint256 amount) transferDetails, address owner, bytes signature)",
//             ],
//             signer,
//           )

//           const deadline = Math.floor(Date.now() / 1000) + 3600 // 1 hour from now
//           const approveTx = await permit2Contract.approve(
//             fromToken.address,
//             swapQuote.allowanceTarget,
//             ethers.constants.MaxUint256,
//             deadline,
//           )
//           await approveTx.wait()
//         } else {
//           // Regular ERC20 approval
//           const tokenContract = new ethers.Contract(
//             fromToken.address,
//             ["function approve(address spender, uint256 amount) public returns (bool)"],
//             signer,
//           )

//           const approveTx = await tokenContract.approve(swapQuote.allowanceTarget, ethers.constants.MaxUint256)
//           await approveTx.wait()
//         }
//       }

//       // Execute the swap
//       const tx = await signer.sendTransaction({
//         to: swapQuote.allowanceTarget,
//         data: swapQuote.data,
//         value:
//           fromToken.address === ethers.constants.AddressZero ? ethers.utils.parseEther(fromAmount.toString()) : "0",
//         gasLimit: 300000,
//       })

//       await tx.wait()

//       // Reset state after successful swap
//       setFromAmount(0)
//       setToAmount(0)
//       setSwapQuote(null)

//       console.log("Swap executed successfully!")
//     } catch (err) {
//       console.error("Error executing swap:", err)
//       setError("Failed to execute swap. Please try again.")
//     } finally {
//       setSwapping(false)
//     }
//   }, [fromToken, toToken, swapQuote, user, wallets, fromAmount])

//   // Switch from and to tokens
//   const switchTokens = () => {
//     if (!fromToken || !toToken) return

//     const tempToken = fromToken
//     const tempAmount = fromAmount

//     setFromToken(toToken)
//     setToToken(tempToken)

//     if (swapQuote) {
//       setFromAmount(toAmount)
//       setToAmount(tempAmount)
//       setTimeout(() => getQuote(), 0)
//     }
//   }

//   return (
//     <SwapContext.Provider
//       value={{
//         tokens: MONAD_TESTNET_TOKENS,
//         fromToken,
//         toToken,
//         fromAmount,
//         toAmount,
//         swapQuote,
//         swapping,
//         error,
//         setFromToken,
//         setToToken,
//         setFromAmount,
//         getQuote,
//         executeSwap,
//         switchTokens,
//       }}
//     >
//       {children}
//     </SwapContext.Provider>
//   )
// }

// export function useSwap() {
//   const context = useContext(SwapContext)
//   if (context === undefined) {
//     throw new Error("useSwap must be used within a SwapProvider")
//   }
//   return context
// }

