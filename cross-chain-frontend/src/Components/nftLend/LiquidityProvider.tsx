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
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>('');
    const [status, setStatus] = useState<string>('');
    const [usdtBalance, setUsdtBalance] = useState<string>('0');
    const [poolBalance, setPoolBalance] = useState<string>('0');

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
                "totalDeposits",
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
        if (!usdt || !address || !amount) return;

        setIsLoading(true);
        setError('');
        setStatus('Minting USDT...');

        try {
            const mintTx = await usdt.call(
                "mint",
                [address, ethers.utils.parseEther(amount)]
            );
            console.log("Mint transaction:", mintTx);
            setStatus('Successfully minted USDT! 🎉');
            await fetchUSDTBalance();
        } catch (error: any) {
            if (error.message.includes) {
                console.log('USDT MINTING Error: ', error.message)
            }
            if (error.message.includes('owner')) {
                setError('Only Owner Is Allowed To Mint USDT !! ');
            }
            if (error.message.includes('data')) {
                setError('Missing revert Data, You Are Not Allowed To Mint!!');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemoveLiquidity = async () => {
        if (!usdt || !liquidityPool || !address || !amount) return;

        setIsLoading(true);
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
            console.error('Error:', error);
            if (error.message.includes('User denied transaction signature.')){
                setError('User denied transaction signature.')
            } else if (error.message.includes('Insufficient liquidity')){
                setError('Insufficient liquidity in the pool')
            }
            // setError(error.message || 'Failed to withdraw liquidity');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddLiquidity = async () => {
        if (!usdt || !liquidityPool || !address || !amount) return;

        setIsLoading(true);
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
            console.error('Error:', error);
            if (error.message.includes('user cancel')){
                setError('User Cancelled the tx')
                setStatus('')
            }
            // setError(error.message || 'Transaction failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="mt-4 p-4 border rounded-lg bg-gray-800 border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">USDT Liquidity Management</h3>

            <div className="mb-4 p-3 bg-gray-700 rounded-lg">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-sm text-gray-400">Your USDT Balance</p>
                        <p className="text-lg font-semibold text-green-400">
                            {formatUSDT(usdtBalance)}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-400">Total Pool Liquidity</p>
                        <p className="text-lg font-semibold text-blue-400">
                            {formatUSDT(poolBalance)}
                        </p>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Amount of USDT
                    </label>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full p-2 border rounded bg-gray-700 text-green-400 border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Enter amount of USDT"
                        disabled={isLoading}
                    />
                </div>

                {error && (
                    <p className="text-sm text-red-500">{error}</p>
                )}

                {status && !error && (
                    <p className="text-sm text-blue-400">{status}</p>
                )}

                <div className="flex gap-4">
                    <button
                        onClick={handleMintUSDT}
                        disabled={isLoading || !amount}
                        className={`flex-1 py-2 px-4 rounded ${isLoading || !amount
                            ? 'bg-gray-600 cursor-not-allowed'
                            : 'bg-purple-500 hover:bg-purple-600'
                            } text-white font-medium transition-colors`}
                    >
                        {isLoading ? 'Processing...' : 'Mint USDT'}
                    </button>

                    <button
                        onClick={handleAddLiquidity}
                        disabled={isLoading || !amount}
                        className={`flex-1 py-2 px-4 rounded ${isLoading || !amount
                            ? 'bg-gray-600 cursor-not-allowed'
                            : 'bg-blue-500 hover:bg-blue-600'
                            } text-white font-medium transition-colors`}
                    >
                        {isLoading ? 'Processing...' : 'Add Liquidity'}
                    </button>

                    <button
                        onClick={handleRemoveLiquidity}
                        disabled={isLoading || !amount}
                        className={`flex-1 py-2 px-4 rounded ${isLoading || !amount
                            ? 'bg-gray-600 cursor-not-allowed'
                            : 'bg-red-500 hover:bg-red-600'
                            } text-white font-medium transition-colors`}
                    >
                        {isLoading ? 'Processing...' : 'withdraw '}
                    </button>
                </div>
            </div>
        </div>
    );
} 