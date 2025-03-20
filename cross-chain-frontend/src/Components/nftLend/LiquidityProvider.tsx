'use client'

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useContract, useAddress } from '@thirdweb-dev/react';
import { USDT_CONTRACT, LIQUIDITY_POOL_CONTRACT } from '@/thirdweb/thirdwebConfig';
import { USDTLiquidityPoolABI } from '@/contracts/interfaces/USDTLiquidityPool';

// Add this utility function at the top
const formatUSDT = (value: string | number): string => {
    try {
        // If value is in wei, convert to ether first
        const etherValue = typeof value === 'string' && value.includes('e')
            ? ethers.utils.formatEther(value)
            : value.toString();

        // Round to 2 decimal places
        const rounded = Number(etherValue).toFixed(2);
        return `${rounded} USDT`;
    } catch (error) {
        console.error("Error formatting USDT:", error);
        return "0.00 USDT";
    }
};

export function LiquidityProvider() {
    const [amount, setAmount] = useState<string>('');
    const [IsLoadiing, setIsLoadiing] = useState(false);
    const [error, setError] = useState<string>('');
    const [status, setStatus] = useState<string>('');
    const [usdtBalance, setUsdtBalance] = useState<string>('0');
    const [poolBalance, setPoolBalance] = useState<string>('0');

    // Add auto-dismiss effect
  useEffect(() => {
    if (status || error) {
      const timer = setTimeout(() => {
        setStatus('');
        setError('')
      }, 5000); // 5 seconds

      return () => clearTimeout(timer);
    }
  }, [status]);

    const address = useAddress();
    const { contract: usdt } = useContract(USDT_CONTRACT);
    const { contract: liquidityPool } = useContract(LIQUIDITY_POOL_CONTRACT, USDTLiquidityPoolABI.abi);

    useEffect(() => {
        if (address && usdt) {
            fetchUSDTBalance();
            fetchPoolBalance();
        }
    }, [address, usdt]);

    const fetchUSDTBalance = async () => {
        if (!usdt || !address) return;
        try {
            const balance = await usdt.call(
                "balanceOf",
                [address]
            );
            setUsdtBalance(ethers.utils.formatEther(balance));
        } catch (error) {
            console.error("Error fetching USDT balance:", error);
        }
    };

    const fetchPoolBalance = async () => {
        // console.log(' usdt mock Liquidity Pool contract: ', liquidityPool);
        if (!liquidityPool) return;
        try {
            const totalLiquidity = await liquidityPool.call(
                "getTotalLiquidity",
                []
            );
            setPoolBalance(ethers.utils.formatEther(totalLiquidity));
        } catch (error) {
            console.error("Error fetching pool balance:", error);
        }
    };

    // Add this to ensure balances are refreshed regularly
    useEffect(() => {
        const fetchBalances = async () => {
            await fetchUSDTBalance();
            await fetchPoolBalance();
        };

        if (address && usdt && liquidityPool) {
            fetchBalances();
            // Refresh every 10 seconds
            const interval = setInterval(fetchBalances, 10000);
            return () => clearInterval(interval);
        }
    }, [address, usdt, liquidityPool]);

    const handleMintUSDT = async () => {
        // if (!usdt || !address || !amount) return;
        if (!usdt || !address ) return;

        setIsLoadiing(true);
        setError('');
        setStatus('Minting USDT...');

        try {
            const mintTx = await usdt.call(
                // "mint",
                // [address, ethers.utils.parseEther(amount)]
                "mintTokens",
                []
            );
            console.log("Mint transaction:", mintTx);
            setStatus('Successfully minted USDT! 🎉');
            await fetchUSDTBalance();
        } catch (error: any) {
            setStatus('')
            if (error.message.includes) {
                console.log('USDT MINTING Error: ', error.message)
            }
            else if(error.message.includes('You have no tokens to mint')){
                setError( 'You have Already minted!!')
            }
            else if (error.message.includes('owner')) {
                setError('Only Owner Is Allowed To Mint USDT !! ');
            }
            else if (error.message.includes('data')) {
                setError('You Are Not Allowed To Mint!!, Mint an NFT to be whitelisted for minting 2000 mUSDT');
            }
        } finally {
            setIsLoadiing(false);
            setStatus('')
        }
    };

    const handleRemoveLiquidity = async () => {
        if (!usdt || !liquidityPool || !address || !amount) return;

        setIsLoadiing(true);
        setError('');
        setStatus('Processing...');

        try {
            // 1. Check user's liquidity in the pool
            const userLiquidity = await liquidityPool.call(
                "getUserDeposit",
                [address]
            );
            const amountToWithdraw = ethers.utils.parseEther(amount);

            if (userLiquidity.lt(amountToWithdraw)) {
                setError(`Insufficient liquidity. You have ${ethers.utils.formatEther(userLiquidity)} USDT in the pool`);
                return;
            }

            // 2. Withdraw liquidity from pool
            setStatus('Withdrawing liquidity...');
            const withdrawTx = await liquidityPool.call(
                "removeLiquidity",
                [amountToWithdraw]
            );
            console.log("Withdraw transaction:", withdrawTx);

            setStatus('Successfully withdrawn liquidity! 🎉');
            setAmount('');
            await fetchUSDTBalance();
            await fetchPoolBalance();
        } catch (error: any) {
            setStatus('')
            console.error('Error:', error);
            if (error.message.includes('User denied transaction signature.')) {
                setError('User denied transaction signature.')
            } else if (error.message.includes('Insufficient liquidity')) {
                setError('Insufficient liquidity in the pool')
            }
            // setError(error.message || 'Failed to withdraw liquidity');
        } finally {
            setIsLoadiing(false);
        }
    };

    const handleAddLiquidity = async () => {
        if (!usdt || !liquidityPool || !address || !amount) return;

        setIsLoadiing(true);
        setError('');
        setStatus('Processing...');

        try {
            // 1. Check USDT balance
            const balance = await usdt.call("balanceOf", [address]);
            const amountToAdd = ethers.utils.parseEther(amount);

            if (balance.lt(amountToAdd)) {
                setError(`Insufficient USDT balance. You have ${ethers.utils.formatEther(balance)} USDT`);
                return;
            }

            // 2. Approve USDT for Liquidity Pool
            setStatus('Approving USDT transfer...');
            const approveTx = await usdt.call(
                "approve",
                [LIQUIDITY_POOL_CONTRACT, amountToAdd]
            );
            console.log("Approve transaction:", approveTx);

            // 3. Add liquidity to pool
            setStatus('Adding liquidity...');
            const addLiquidityTx = await liquidityPool.call(
                "addLiquidity",
                [amountToAdd]
            );
            console.log("Add liquidity transaction:", addLiquidityTx);

            setStatus('Successfully added liquidity! 🎉');
            setAmount('');
            await fetchUSDTBalance();
            await fetchPoolBalance();
        } catch (error: any) {
            setStatus('')
            console.error('Error:', error);
            if (error.message.includes('user cancel')) {
                setError('User Cancelled the tx')
                setStatus('')
            }
            // setError(error.message || 'Transaction failed');
        } finally {
            setIsLoadiing(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-[#131A2A] rounded-[20px] p-6">
                <h3 className="text-xl font-medium text-[#F5F6FC] mb-4">USDT Liquidity Management</h3>

                <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                        <span className="text-[#98A1C0]">Your USDT Balance</span>
                        <span className="text-[#F5F6FC] font-medium">
                            {formatUSDT(usdtBalance)}
                        </span>
                    </div>

                    <div className="flex justify-between text-sm">
                        <span className="text-[#98A1C0]">Total Pool Liquidity</span>
                        <span className="text-[#F5F6FC] font-medium">
                            {formatUSDT(poolBalance)}
                        </span>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm text-[#98A1C0]">Amount of USDT</label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full px-4 py-3 bg-[#0D111C] border border-[#1C2839] rounded-[20px]
                                     text-[#F5F6FC] placeholder-[#5D6785] focus:outline-none focus:border-[#98A1C0]
                                     transition-colors"
                            placeholder="Enter amount of USDT"
                            disabled={IsLoadiing }
                        />
                    </div>

                    {error && (
                        <div className="fixed bottom-4 right-4 max-w-md bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700 animate-fade-in-out"
                        style={{
                            animation: 'fadInOut 20s ease-in-out'
                        }}
                        >
                      <p className='text-sm text-red'>{error}</p>
                      </div>
                    )}

                      {/* Status Messages */}
                      {status && (
                      <div className="fixed bottom-4 right-4 max-w-md bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700 animate-fade-in-out"
                          style={{
                          animation: 'fadeInOut 20s ease-in-out'
                                }}
                        >
                         <p className="text-sm text-[#F5F6FC]">{status}</p>
                       </div>
                      )}

                    <div className="grid grid-cols-3 gap-3">
                        <button
                            onClick={handleMintUSDT}
                            disabled={IsLoadiing  }
                            className={`px-4 py-3 bg-[#131A2A] border border-[#1C2839] rounded-[20px]
                                         text-[#F5F6FC] hover:border-[#98A1C0] transition-colors`}
                        >
                            {IsLoadiing  ? 'Processing...' : 'Mint USDT'}
                        </button>
                        <button
                            onClick={handleAddLiquidity}
                            disabled={IsLoadiing  || !amount}
                            className={`px-4 py-3 bg-gradient-to-r from-[#8B5CF6] to-[#6366F1]
                                         rounded-[20px] text-white font-medium hover:opacity-90 transition-opacity`}
                        >
                            {IsLoadiing  ? 'Processing...' : 'Add Liquidity'}
                        </button>
                        <button
                            onClick={handleRemoveLiquidity}
                            disabled={IsLoadiing || !amount}
                            className={`px-4 py-3 bg-[#131A2A] border border-[#1C2839] rounded-[20px]
                                         text-[#F5F6FC] hover:border-[#98A1C0] transition-colors`}
                        >
                            {IsLoadiing ? 'Processing...' : 'Withdraw'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
} 