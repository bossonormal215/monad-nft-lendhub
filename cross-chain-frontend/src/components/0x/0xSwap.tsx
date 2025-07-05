"use client";

import { useState, useEffect, useCallback } from "react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/privy/ui/card";
import { Button } from "@/Components/privy/ui/button";
import { Input } from "@/Components/privy/ui/input";
import { Label } from "@/Components/privy/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/privy/ui/select";
import { ArrowDownIcon, Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/Components/privy/ui/alert";
import { useToast } from "@/Components/privy/ui/use-toast";
import { ethers } from 'ethers';

// Permit2 and token addresses for Monad testnet
const PERMIT2_ADDRESS = '0x000000000022D473030F116dDEE9F6B43aC78BA3';
const USDC_ADDRESS = '0xf817257fed379853cDe0fa4F97AB987181B1E5Ea';
const WMON_ADDRESS = '0x760AfE86e5de5fa0Ee542fc7B7B713e1c5425701';
const MON_ADDRESS = '0x0000000000000000000000000000000000000000';
const MONAD_ADDRESS = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';
const USDT_ADDRESS = '0x5D876D73f4441D5f2438B1A3e2A51771B337F27A';
const CHAIN_ID = 10143; // Monad testnet chain ID

const TOKENS = [
    {
        address: MONAD_ADDRESS,
        symbol: "MON",
        decimals: 18,
        name: "Monad",
        isNative: true,
    },
    {
        address: USDT_ADDRESS,
        symbol: "USDT",
        decimals: 6,
        name: "USDT",
        isNative: false,
    },

    {
        address: USDC_ADDRESS,
        symbol: "USDC",
        decimals: 6,
        name: "USDC",
        isNative: false,
    },
    {
        address: WMON_ADDRESS,
        symbol: "WMON",
        decimals: 18,
        name: "Wrapped MON",
        isNative: false,
    },
];

interface Token {
    address: string;
    symbol: string;
    decimals: number;
    name: string;
    isNative: boolean;
}

interface QuoteResult {
    permit2?: {
        eip712: {
            domain: any;
            types: any;
            message: any;
        };
    };
    transaction: {
        to: string;
        data: string;
        gas?: string;
        value?: string;
    };
    buyAmount: string;
    sellAmount?: string;
    issues?: {
        allowance?: {
            spender: string;
        };
        balance?: boolean;
    };
    minBuyAmount?: string;
    route?: {
        fills: {
            source: string;
            from: string;
            to: string;
        }[];
    };
    fees?: {
        zeroExFee?: {
            amount: string;
            token: string;
        };
        integratorFee?: {
            amount: string;
            token: string;
        };
    };
}

export function ZeroXSwap() {
    // All hooks at the top
    const { user, authenticated } = usePrivy();
    const { wallets } = useWallets();
    const { toast } = useToast();
    const [fromToken, setFromToken] = useState<Token>(TOKENS[0]); // USDC
    const [toToken, setToToken] = useState<Token>(TOKENS[1]); // WMON
    const [fromAmount, setFromAmount] = useState<string>("");
    const [toAmount, setToAmount] = useState<string>("");
    const [quote, setQuote] = useState<QuoteResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSwapping, setIsSwapping] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isApproved, setIsApproved] = useState(false);
    const [fromBalance, setFromBalance] = useState<string>("-");
    const [toBalance, setToBalance] = useState<string>("-");

    const activeWallet = wallets[0];
    const notConnected = !authenticated || !activeWallet;

    // Get quote from 0x Permit2 API
    const getQuote = useCallback(async () => {
        if (!fromAmount || !fromToken || !toToken || !activeWallet) return;

        setIsLoading(true);
        setError(null);

        try {
            const formattedAmount = ethers.utils.parseUnits(fromAmount || "0", fromToken.decimals).toString();
            const url = `/api/0x/quote?chainId=${CHAIN_ID}&sellToken=${fromToken.address}&buyToken=${toToken.address}&sellAmount=${formattedAmount}&taker=${activeWallet.address}`;
            const response = await fetch(url); // No custom headers needed
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.reason || errorData.error || 'Failed to get quote');
            }
            const quoteData = await response.json();
            setQuote(quoteData);
            // Calculate estimated output amount
            const estimatedOutput = parseFloat(quoteData.buyAmount) / Math.pow(10, toToken.decimals);
            setToAmount(estimatedOutput.toFixed(6));
        } catch (err: any) {
            setError(err.message || 'Failed to get quote. Please try again.');
            console.error('Quote error:', err);
        } finally {
            setIsLoading(false);
        }
    }, [fromAmount, fromToken, toToken, activeWallet]);

    // Approve AllowanceHolder contract (spender from quote) for only the required sellAmount
    const approveAllowanceHolder = async () => {
        if (!activeWallet || !quote?.issues?.allowance?.spender) return;
        setIsLoading(true);
        setError(null);
        try {
            const provider = await activeWallet.getEthereumProvider();
            const ethersProvider = new ethers.providers.Web3Provider(provider);
            const signer = ethersProvider.getSigner();
            // Approve only the required sellAmount
            const tokenContract = new ethers.Contract(
                fromToken.address,
                ["function approve(address spender, uint256 amount) public returns (bool)"],
                signer
            );
            const amount = quote.sellAmount ? ethers.BigNumber.from(quote.sellAmount) : ethers.constants.MaxUint256;
            const tx = await tokenContract.approve(quote.issues.allowance.spender, amount);
            await tx.wait();
            toast({
                title: "Approval Successful",
                description: "You can now swap tokens.",
            });
            setIsApproved(true);
        } catch (err) {
            setError('Failed to approve token. Please try again.');
            console.error('Approval error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    // Execute swap (AllowanceHolder: just send the transaction)
    const executeSwap = async () => {
        if (!quote || !activeWallet) return;
        setIsSwapping(true);
        setError(null);
        try {
            const provider = await activeWallet.getEthereumProvider();
            const ethersProvider = new ethers.providers.Web3Provider(provider);
            const signer = ethersProvider.getSigner();
            // Send the transaction as provided by the quote
            const tx = await signer.sendTransaction({
                to: quote.transaction.to,
                data: quote.transaction.data,
                gasLimit: quote.transaction.gas || "500000",
                value: quote.transaction.value ? ethers.BigNumber.from(quote.transaction.value) : undefined,
            });
            const receipt = await tx.wait();
            if (receipt.status === 1) {
                toast({
                    title: "Swap Successful",
                    description: (
                        <span>
                            Successfully swapped {fromAmount} {fromToken.symbol} for {toAmount} {toToken.symbol}.<br />
                            <a href={`https://testnet.monadexplorer.com/tx/${tx.hash}`} target="_blank" rel="noopener noreferrer" style={{ color: '#6366F1', textDecoration: 'underline' }}>
                                View on Monad Explorer
                            </a>
                        </span>
                    ),
                });
                // Reset form
                setFromAmount("");
                setToAmount("");
                setQuote(null);
                setIsApproved(false);
            } else {
                throw new Error("Transaction failed");
            }
        } catch (err) {
            setError('Failed to execute swap. Please try again.');
            console.error('Swap error:', err);
        } finally {
            setIsSwapping(false);
        }
    };

    // Switch tokens
    const switchTokens = () => {
        setFromToken(toToken);
        setToToken(fromToken);
        setFromAmount(toAmount);
        setToAmount(fromAmount);
        setQuote(null);
        setIsApproved(false);
    };

    // Get quote when amount changes
    useEffect(() => {
        if (fromAmount && parseFloat(fromAmount) > 0) {
            const timeoutId = setTimeout(getQuote, 500);
            return () => clearTimeout(timeoutId);
        } else {
            setToAmount("");
            setQuote(null);
        }
    }, [fromAmount, fromToken, toToken, getQuote]);

    // Fetch balances for fromToken and toToken (handle native MON)
    useEffect(() => {
        async function fetchBalances() {
            if (!activeWallet) {
                setFromBalance("-");
                setToBalance("-");
                return;
            }
            try {
                const provider = new ethers.providers.Web3Provider(await activeWallet.getEthereumProvider());
                const address = activeWallet.address;
                const erc20Abi = [
                    "function balanceOf(address owner) view returns (uint256)",
                    "function decimals() view returns (uint8)"
                ];
                async function getBalance(token: Token) {
                    if (!token || !token.address) return "-";
                    if (token.isNative) {
                        // Native MON
                        const bal = await provider.getBalance(address);
                        return ethers.utils.formatUnits(bal, token.decimals);
                    }
                    try {
                        const contract = new ethers.Contract(token.address, erc20Abi, provider);
                        const bal = await contract.balanceOf(address);
                        return ethers.utils.formatUnits(bal, token.decimals);
                    } catch {
                        return "-";
                    }
                }
                setFromBalance(await getBalance(fromToken));
                setToBalance(await getBalance(toToken));
            } catch {
                setFromBalance("-");
                setToBalance("-");
            }
        }
        fetchBalances();
    }, [activeWallet, fromToken, toToken, isApproved, isSwapping]);

    // Dynamic swap button label
    let swapButtonLabel = "Swap";
    if (fromToken.symbol === "MON" && toToken.symbol === "WMON") swapButtonLabel = "Wrap MON";
    else if (fromToken.symbol === "WMON" && toToken.symbol === "MON") swapButtonLabel = "Unwrap MON";

    // Parse quote issues and details
    const allowanceIssue = quote?.issues?.allowance;
    const balanceIssue = quote?.issues?.balance;
    const minBuyAmount = quote?.minBuyAmount;
    const route = quote?.route;
    const fees = quote?.fees;
    const platformFee = fees?.integratorFee;
    const spender = allowanceIssue?.spender;

    // Calculate estimated net receive after all fees (in toToken)
    let estimatedReceive = "-";
    if (quote?.buyAmount) {
        let net = ethers.BigNumber.from(quote.buyAmount);
        if (quote.fees) {
            if (quote.fees.integratorFee && quote.fees.integratorFee.token?.toLowerCase() === toToken.address.toLowerCase()) {
                net = net.sub(ethers.BigNumber.from(quote.fees.integratorFee.amount));
            }
            if (quote.fees.zeroExFee && quote.fees.zeroExFee.token?.toLowerCase() === toToken.address.toLowerCase()) {
                net = net.sub(ethers.BigNumber.from(quote.fees.zeroExFee.amount));
            }
        }
        estimatedReceive = ethers.utils.formatUnits(net, toToken.decimals);
    }

    // Render
    return (
        <Card className="w-full max-w-md mx-auto">
            {notConnected ? (
                <>
                    <CardHeader>
                        <CardTitle className="text-center">Connect Wallet</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-center text-muted-foreground mb-4">
                            Please connect your wallet to start swapping tokens.
                        </p>
                    </CardContent>
                </>
            ) : (
                <CardContent className="space-y-4">
                    {error && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {/* Show allowance or balance issues from quote */}
                    {allowanceIssue && (
                        <Alert variant="default">
                            <AlertDescription>
                                You need to approve <b>{spender}</b> to spend your {fromToken.symbol}.
                            </AlertDescription>
                        </Alert>
                    )}
                    {balanceIssue && (
                        <Alert variant="destructive">
                            <AlertDescription>
                                Insufficient balance to perform this swap.
                            </AlertDescription>
                        </Alert>
                    )}

                    {/* From Token */}
                    <div className="space-y-2">
                        <Label htmlFor="fromToken">From</Label>
                        <div className="flex space-x-2">
                            <Select value={fromToken.address} onValueChange={(value) => {
                                const token = TOKENS.find(t => t.address === value);
                                if (token) setFromToken(token);
                            }}>
                                <SelectTrigger className="w-[140px]">
                                    <SelectValue placeholder="Select token" />
                                </SelectTrigger>
                                <SelectContent>
                                    {TOKENS.map((token) => (
                                        <SelectItem key={token.address} value={token.address}>
                                            {token.symbol}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Input
                                id="fromAmount"
                                type="number"
                                placeholder="0.0"
                                value={fromAmount}
                                onChange={(e) => setFromAmount(e.target.value)}
                                className="flex-1"
                            />
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Balance: {fromBalance} {fromToken.symbol}
                        </p>
                    </div>

                    {/* Switch Button */}
                    <div className="flex justify-center">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={switchTokens}
                            className="rounded-full"
                        >
                            <ArrowDownIcon className="h-6 w-6" />
                        </Button>
                    </div>

                    {/* To Token */}
                    <div className="space-y-2">
                        <Label htmlFor="toToken">To</Label>
                        <div className="flex space-x-2">
                            <Select value={toToken.address} onValueChange={(value) => {
                                const token = TOKENS.find(t => t.address === value);
                                if (token) setToToken(token);
                            }}>
                                <SelectTrigger className="w-[140px]">
                                    <SelectValue placeholder="Select token" />
                                </SelectTrigger>
                                <SelectContent>
                                    {TOKENS.map((token) => (
                                        <SelectItem key={token.address} value={token.address}>
                                            {token.symbol}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Input
                                id="toAmount"
                                type="number"
                                placeholder="0.0"
                                value={toAmount}
                                readOnly
                                className="flex-1"
                            />
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Balance: {toBalance} {toToken.symbol}
                        </p>
                    </div>

                    {/* Quote Details */}
                    {minBuyAmount && (
                        <p className="text-xs text-muted-foreground">
                            Minimum buy amount: {ethers.utils.formatUnits(minBuyAmount, toToken.decimals)} {toToken.symbol}
                        </p>
                    )}
                    {platformFee && (
                        <p className="text-xs text-muted-foreground">
                            Platform Fee: {(() => {
                                const feeToken = TOKENS.find(t => t.address.toLowerCase() === platformFee.token.toLowerCase());
                                const feeDecimals = feeToken ? feeToken.decimals : 18;
                                return ethers.utils.formatUnits(platformFee.amount, feeDecimals) + ' ' + (feeToken ? feeToken.symbol : '');
                            })()}
                        </p>
                    )}
                    {fees?.zeroExFee && (
                        <p className="text-xs text-muted-foreground">
                            0x Fee: {ethers.utils.formatUnits(fees.zeroExFee.amount, toToken.decimals)} {toToken.symbol}
                        </p>
                    )}
                    {route && (
                        <div>
                            <p className="text-xs text-muted-foreground">Route:</p>
                            {route.fills.map((fill, idx) => (
                                <p key={idx} className="text-xs text-muted-foreground">
                                    {fill.source}: {fill.from} → {fill.to}
                                </p>
                            ))}
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="space-y-2">
                        {/* Only show approve if allowance issue exists */}
                        {allowanceIssue && (
                            <Button
                                onClick={approveAllowanceHolder}
                                disabled={isLoading || !fromAmount}
                                className="w-full"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Approving...
                                    </>
                                ) : (
                                    `Approve ${fromToken.symbol}`
                                )}
                            </Button>
                        )}
                        {/* Only enable swap if no issues */}
                        <Button
                            onClick={executeSwap}
                            disabled={isSwapping || !quote || !fromAmount || !!allowanceIssue || !!balanceIssue}
                            className="w-full"
                        >
                            {isSwapping ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    {swapButtonLabel}...
                                </>
                            ) : (
                                swapButtonLabel
                            )}
                        </Button>
                    </div>

                    {/* Quote Info */}
                    {quote && (
                        <div className="text-sm text-muted-foreground">
                            <p>Estimated receive: {estimatedReceive} {toToken.symbol}</p>
                            <p>Estimated output: {toAmount} {toToken.symbol}</p>
                            <p>Rate: 1 {fromToken.symbol} ≈ {(parseFloat(toAmount) / parseFloat(fromAmount)).toFixed(6)} {toToken.symbol}</p>
                        </div>
                    )}
                </CardContent>
            )}
        </Card>
    );
}
