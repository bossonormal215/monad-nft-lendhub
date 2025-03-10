"use client"

import type, { useEffect, useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/Components/privy/ui/card"
import { Button } from "@/Components/privy/ui/button"
import { Input } from "@/Components/privy/ui/input"
import { Label } from "@/Components/privy/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/privy/ui/select"
import { ArrowDownIcon, RefreshCw, AlertCircle } from "lucide-react"
import { useSwap } from "@/Components/privy/hooks/use-swap"
import { usePrivy, useWallets } from "@privy-io/react-auth"
import { Alert, AlertDescription } from "@/Components/privy/ui/alert"
import { ethers } from "ethers"

// Import necessary types and variables
import type { User } from "../../types/user"
import type { Token } from "../../types/token"
import type { Wallet } from "../../types/wallet"




// Monad color scheme
const colors = {
  primary: "#6366F1", // Monad primary color
  background: "#0A0B0D", // Dark background
  foreground: "#FFFFFF",
  border: "#27272A",
  input: "#18181B",
  buttonHover: "#4F46E5",
}

export function SwapInterface() {
  const { user, ready, login } = usePrivy()
  const { tokens, swapQuote, executeSwap, swapping, error, getQuote, fromAmount, setFromAmount } = useSwap()
  const [fromToken, setFromToken] = useState<Token | null>(tokens[0] || null)
  const [toToken, setToToken] = useState<Token | null>(tokens[1] || null)
  // const [fromAmount, setFromAmount] = useState<number | null>(null)
  const [toAmount, setToAmount] = useState<number | null>(null)
  const [fromBalance, setFromBalance] = useState("0")
  const [toBalance, setToBalance] = useState("0")

  useEffect(() => {
    async function fetchBalances() {
      if (!user?.wallet?.address || !fromToken || !toToken) return

      try {
        const provider = await window.ethereum
        const ethersProvider = new ethers.providers.Web3Provider(provider)

        const fetchTokenBalance = async (token: typeof fromToken) => {
          try {
            const address = user.wallet?.address
            if (!address) throw new Error("Wallet address is undefined")

            if (token.address === ethers.constants.AddressZero) {
              const balance = await ethersProvider.getBalance(address)
              return ethers.utils.formatEther(balance)
            } else {
              // Use a more detailed ERC20 ABI for better error handling
              const tokenContract = new ethers.Contract(
                token.address,
                [
                  "function balanceOf(address) view returns (uint256)",
                  "function decimals() view returns (uint8)",
                  "function symbol() view returns (string)",
                ],
                ethersProvider,
              )

              try {
                // First check if the contract is deployed and responding
                await tokenContract.symbol()
                const balance = await tokenContract.balanceOf(address)
                return ethers.utils.formatUnits(balance, token.decimals)
              } catch (err) {
                console.error(`Contract interaction failed for token ${token.symbol}:`, err)
                return "0"
              }
            }
          } catch (err) {
            console.error(`Error fetching balance for token ${token.symbol}:`, err)
            return "0"
          }
        }

        // Fetch balances in parallel with proper error handling
        const [fromBalanceResult, toBalanceResult] = await Promise.allSettled([
          fetchTokenBalance(fromToken),
          fetchTokenBalance(toToken),
        ])

        setFromBalance(fromBalanceResult.status === "fulfilled" ? fromBalanceResult.value : "0")
        setToBalance(toBalanceResult.status === "fulfilled" ? toBalanceResult.value : "0")
      } catch (err) {
        console.error("Error fetching balances:", err)
        setFromBalance("0")
        setToBalance("0")
      }
    }

    fetchBalances()
  }, [user, fromToken, toToken])

  useEffect(() => {
    async function fetchQuote() {
      if (fromToken && toToken && fromAmount) {
        try {
          await getQuote()
        } catch (error) {
          console.error("Failed to fetch quote:", error)
        }
      }
    }

    fetchQuote()
  }, [fromToken, toToken, fromAmount, getQuote])

  useEffect(() => {
    if (swapQuote) {
      setToAmount(swapQuote.toAmount)
    }
  }, [swapQuote])

  const switchTokens = () => {
    setFromToken(toToken)
    setToToken(fromToken)
  }

  return (
    
    <div className="min-h-screen bg-[#0A0B0D] text-white p-4">
      {ready ? (
      <Card className="w-full max-w-md mx-auto bg-[#18181B] border-[#27272A]">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-white">Swap Tokens on Monad Testnet</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {error && (
            <Alert variant="destructive" className="bg-red-900/50 border-red-700">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="fromToken" className="text-gray-300">
              From
            </Label>
            <div className="flex space-x-2">
              <Select
                value={fromToken?.address || ""}
                onValueChange={(value) => {
                  const token = tokens.find((t) => t.address === value)
                  if (token) setFromToken(token)
                }}
              >
                <SelectTrigger className="w-[140px] bg-[#27272A] border-[#3F3F46] text-white">
                  <SelectValue placeholder="Select token" />
                </SelectTrigger>
                <SelectContent className="bg-[#27272A] border-[#3F3F46]">
                  {tokens.map((token) => (
                    <SelectItem key={token.address} value={token.address} className="text-white hover:bg-[#3F3F46]">
                      {token.symbol}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                id="fromAmount"
                type="number"
                placeholder="0.0"
                value={fromAmount || ""}
                onChange={(e) => setFromAmount(Number.parseFloat(e.target.value) || 0)}
                className="flex-1 bg-[#27272A] border-[#3F3F46] text-white placeholder-gray-500"
              />
            </div>
            <p className="text-sm text-gray-400">
              Balance: {fromBalance} {fromToken?.symbol}
            </p>
          </div>

          <div className="flex justify-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={switchTokens}
              className="rounded-full hover:bg-[#3F3F46] text-white"
            >
              <ArrowDownIcon className="h-6 w-6" />
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="toToken" className="text-gray-300">
              To
            </Label>
            <div className="flex space-x-2">
              <Select
                value={toToken?.address || ""}
                onValueChange={(value) => {
                  const token = tokens.find((t) => t.address === value)
                  if (token) setToToken(token)
                }}
              >
                <SelectTrigger className="w-[140px] bg-[#27272A] border-[#3F3F46] text-white">
                  <SelectValue placeholder="Select token" />
                </SelectTrigger>
                <SelectContent className="bg-[#27272A] border-[#3F3F46]">
                  {tokens.map((token) => (
                    <SelectItem key={token.address} value={token.address} className="text-white hover:bg-[#3F3F46]">
                      {token.symbol}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                id="toAmount"
                type="number"
                placeholder="0.0"
                value={toAmount || ""}
                readOnly
                className="flex-1 bg-[#27272A] border-[#3F3F46] text-white placeholder-gray-500"
              />
            </div>
            <p className="text-sm text-gray-400">
              Balance: {toBalance} {toToken?.symbol}
            </p>
          </div>

          {swapQuote && (
            <div className="text-sm text-gray-400 space-y-1 bg-[#27272A] p-3 rounded-lg">
              <p>
                Price: 1 {fromToken?.symbol} = {swapQuote?.price.toFixed(3)} {toToken?.symbol}
              </p>
              <p>Estimated Gas: {swapQuote.estimatedGas} MON</p>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button
            className="w-full bg-[#6366F1] hover:bg-[#4F46E5] text-white font-semibold py-3"
            disabled={!swapQuote || swapping || fromAmount <= 0}
            onClick={executeSwap}
          >
            {swapping ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Swapping...
              </>
            ) : (
              "Swap"
            )}
          </Button>
        </CardFooter>
      </Card>
      ) : 
      (
        <CardHeader>
        <CardTitle className="text-2xl font-bold text-center text-white">Swap Tokens on Monad Testnet</CardTitle>
        <CardContent className="space-y-6">
          <Button className="w-full lg" 
          onClick={login}>
                Connect Wallet
          </Button>
        </CardContent>
      </CardHeader>
      )}
    </div>
  )
}
