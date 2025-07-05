"use client";

import React, { useState, useEffect } from "react";
import { MISSION5NFT_ABI } from "./ABI";
import { Button } from "@/Components/privy/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/privy/ui/card";
import { Badge } from "@/Components/privy/ui/badge";
import { Input } from "@/Components/privy/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/privy/ui/select";
import { Lock, Unlock, Zap, Shield, Star, Users, TrendingUp, Award, AlertTriangle, Info, RefreshCw, Send, Clock } from "lucide-react";
import { useAccount, useWriteContract } from "wagmi";
import { useToast } from "@/Components/privy/ui/use-toast";
import { createPublicClient, http } from "viem";
import { monadTestnet } from "viem/chains";



// Contract addresses
const MISSION5NFT_ADDRESS = "0x52Bf1d00c3c57Dd048e8e28Bf8B58f3C9632bD7e";

interface MonanimalNFT {
    tokenId: number;
    isLocked: boolean;
    lockTimestamp?: number;
    duration?: number;
    name: string;
    symbol: string;
    image?: string; // SVG data URI
}

const publicClient = createPublicClient({
    chain: monadTestnet,
    transport: http("https://testnet-rpc.monad.xyz"),
});

export default function Mission5NFTMonanimals() {
    const { toast } = useToast();
    const { address, isConnected } = useAccount();
    const { writeContractAsync } = useWriteContract();

    const [minting, setMinting] = useState(false);
    const [totalSupply, setTotalSupply] = useState(0);
    const [userMonanimals, setUserMonanimals] = useState<MonanimalNFT[]>([]);
    const [mintPrice] = useState("0"); // Free mint for Mission5NFT
    const [loading, setLoading] = useState(false);
    const [lockDurations, setLockDurations] = useState<Record<number, string>>({});
    const [managerAddresses, setManagerAddresses] = useState<Record<number, string>>({});
    const [transferAddresses, setTransferAddresses] = useState<Record<number, string>>({});
    const [contractName, setContractName] = useState("");
    const [contractSymbol, setContractSymbol] = useState("");

    // Helper function to show toast notifications
    const showToast = (message: string, isError = false) => {
        const isSuccess = message.includes("✅");
        const isInfo = !isSuccess && !isError;

        toast({
            variant: isError ? "destructive" : "default",
            title: isError ? "Error" : isSuccess ? "Success" : "Information",
            description: message,
            duration: 5000,
        });
    };

    // Fetch user's monanimals
    const fetchUserMonanimals = async () => {
        if (!address) {
            console.log("🚫 No address available, skipping fetchUserMonanimals");
            return;
        }
        try {
            console.log("🔍 Fetching monanimals for address:", address);
            setLoading(true);

            const balance = await publicClient.readContract({
                address: MISSION5NFT_ADDRESS,
                abi: MISSION5NFT_ABI,
                functionName: "balanceOf",
                args: [address],
            });
            console.log("📊 User balance returned:", balance, "Type:", typeof balance);

            const monanimals: MonanimalNFT[] = [];
            const balanceNumber = Number(balance);
            console.log("🔄 Processing", balanceNumber, "monanimals...");

            for (let i = 0; i < balanceNumber; i++) {
                console.log(`  Processing monanimal ${i + 1}/${balanceNumber}`);

                const tokenId = await publicClient.readContract({
                    address: MISSION5NFT_ADDRESS,
                    abi: MISSION5NFT_ABI,
                    functionName: "tokenOfOwnerByIndex",
                    args: [address, BigInt(i)],
                }) as bigint | number;
                console.log(`    Token ID:`, tokenId, "Type:", typeof tokenId);

                const isLocked = await publicClient.readContract({
                    address: MISSION5NFT_ADDRESS,
                    abi: MISSION5NFT_ABI,
                    functionName: "isLocked",
                    args: [tokenId],
                }) as boolean;
                console.log(`    Is Locked:`, isLocked, "Type:", typeof isLocked);

                let image: string | undefined = undefined;
                try {
                    const tokenUri = await publicClient.readContract({
                        address: MISSION5NFT_ADDRESS,
                        abi: MISSION5NFT_ABI,
                        functionName: "tokenURI",
                        args: [tokenId],
                    }) as string;
                    console.log(`    Token URI:`, tokenUri.substring(0, 100) + "...");

                    const base64Json = tokenUri.replace(/^data:application\/json;base64,/, '');
                    const jsonStr = typeof window !== 'undefined'
                        ? window.atob(base64Json)
                        : Buffer.from(base64Json, 'base64').toString('utf-8');
                    const metadata = JSON.parse(jsonStr);
                    image = metadata.image;
                    console.log(`    Image extracted:`, image ? "Yes" : "No");
                } catch (e) {
                    console.log(`    Error getting token URI:`, e);
                    image = undefined;
                }

                const monanimal = {
                    tokenId: Number(tokenId),
                    isLocked: isLocked,
                    name: contractName,
                    symbol: contractSymbol,
                    image: image
                };
                console.log(`    Created monanimal object:`, monanimal);
                monanimals.push(monanimal);
            }

            console.log("✅ Final monanimals array:", monanimals);
            setUserMonanimals(monanimals);
        } catch (error: any) {
            console.error("❌ Error fetching monanimals:", error);
            console.error("Error details:", {
                message: error?.message,
                reason: error?.reason,
                code: error?.code,
                stack: error?.stack
            });
            showToast("Failed to fetch monanimals", true);
        } finally {
            setLoading(false);
        }
    };

    // Fetch total supply and contract info
    const fetchContractInfo = async () => {
        try {
            console.log("🔍 Fetching contract info from:", MISSION5NFT_ADDRESS);

            const supply = await publicClient.readContract({
                address: MISSION5NFT_ADDRESS,
                abi: MISSION5NFT_ABI,
                functionName: "totalSupply",
            });
            console.log("📊 totalSupply returned:", supply, "Type:", typeof supply);

            const name = await publicClient.readContract({
                address: MISSION5NFT_ADDRESS,
                abi: MISSION5NFT_ABI,
                functionName: "name",
            });
            console.log("📝 name returned:", name, "Type:", typeof name);

            const symbol = await publicClient.readContract({
                address: MISSION5NFT_ADDRESS,
                abi: MISSION5NFT_ABI,
                functionName: "symbol",
            });
            console.log("🏷️ symbol returned:", symbol, "Type:", typeof symbol);

            const convertedSupply = Number(supply);
            const convertedName = name as string;
            const convertedSymbol = symbol as string;

            console.log("🔄 Setting state values:");
            console.log("  - totalSupply:", convertedSupply);
            console.log("  - contractName:", convertedName);
            console.log("  - contractSymbol:", convertedSymbol);

            setTotalSupply(convertedSupply);
            setContractName(convertedName);
            setContractSymbol(convertedSymbol);

            console.log("✅ Contract info fetch completed successfully");
        } catch (error: any) {
            console.error("❌ Error fetching contract info:", error);
            console.error("Error details:", {
                message: error?.message,
                reason: error?.reason,
                code: error?.code,
                stack: error?.stack
            });
        }
    };

    // Mint a new monanimal
    async function mintMonanimal() {
        if (!address) {
            showToast("Please connect your wallet first", true);
            return;
        }
        setMinting(true);
        try {
            showToast("Minting Monanimal...");
            await writeContractAsync({
                address: MISSION5NFT_ADDRESS,
                abi: MISSION5NFT_ABI,
                functionName: "mint",
                args: [address],
            });
            showToast("✅ Monanimal minted successfully!");
            await fetchContractInfo();
            await fetchUserMonanimals();
        } catch (error: any) {
            console.error("Minting failed:", error);
            const errorString = error?.error?.message || error?.reason || error?.message || "Unknown error";
            showToast(`❌ Minting failed: ${errorString}`, true);
        } finally {
            setMinting(false);
        }
    }

    // Approve NFT for locking
    async function approveMonanimal(tokenId: number) {
        try {
            showToast(`Approving Monanimal ${tokenId}...`);
            await writeContractAsync({
                address: MISSION5NFT_ADDRESS,
                abi: MISSION5NFT_ABI,
                functionName: "approve",
                args: [MISSION5NFT_ADDRESS, tokenId],
            });
            showToast(`✅ Approved Monanimal ${tokenId}`);
        } catch (error: any) {
            console.error("Approval failed:", error);
            const errorString = error?.error?.message || error?.reason || error?.message || "Unknown error";
            showToast(`❌ Approval failed: ${errorString}`, true);
        }
    }

    // Lock monanimal
    async function lockMonanimal(tokenId: number, selectedMinutes?: number, manager?: string) {
        try {
            showToast(`Preparing to lock Monanimal ${tokenId}...`);
            const durationInSeconds = (selectedMinutes || 2) * 60;
            const managerAddress = manager || address;
            // Check if the user is the owner
            const owner = await publicClient.readContract({
                address: MISSION5NFT_ADDRESS,
                abi: MISSION5NFT_ABI,
                functionName: "ownerOf",
                args: [tokenId],
            });
            if ((owner as string).toLowerCase() !== address?.toLowerCase()) {
                showToast("You are not the owner of this NFT. Only the owner can lock it.", true);
                return;
            }
            /*
            // Check if contract is already approved for this token
            const approvedAddress = await publicClient.readContract({
                address: MISSION5NFT_ADDRESS,
                abi: MISSION5NFT_ABI,
                functionName: "getApproved",
                args: [tokenId],
            });
            if ((approvedAddress as string).toLowerCase() !== MISSION5NFT_ADDRESS.toLowerCase()) {
                showToast(`Approving contract to lock Monanimal ${tokenId}...`);
                await writeContractAsync({
                    address: MISSION5NFT_ADDRESS,
                    abi: MISSION5NFT_ABI,
                    functionName: "approve",
                    args: [MISSION5NFT_ADDRESS, tokenId],
                });
                showToast(`✅ Approved contract for Monanimal ${tokenId}`);
            }
            */
            showToast(`Locking Monanimal ${tokenId}...`);
            await writeContractAsync({
                address: MISSION5NFT_ADDRESS,
                abi: MISSION5NFT_ABI,
                functionName: "lock",
                args: [tokenId, managerAddress, durationInSeconds],
            });
            showToast(`✅ Locked Monanimal ${tokenId}`);
            await fetchUserMonanimals();
        } catch (error: any) {
            console.error("Locking failed:", error);
            const errorString = error?.error?.message || error?.reason || error?.message || "Unknown error";
            showToast(`❌ Locking failed: ${errorString}`, true);
        }
    }

    // Unlock monanimal
    async function unlockMonanimal(tokenId: number) {
        try {
            showToast(`Unlocking Monanimal ${tokenId}...`);
            await writeContractAsync({
                address: MISSION5NFT_ADDRESS,
                abi: MISSION5NFT_ABI,
                functionName: "unlock",
                args: [tokenId],
            });
            showToast(`✅ Unlocked Monanimal ${tokenId}`);
            await fetchUserMonanimals();
        } catch (error: any) {
            console.error("Unlocking failed:", error);
            const errorString = error?.error?.message || error?.reason || error?.message || "Unknown error";
            if (errorString.includes("Not authorized manager")) {
                showToast("❌ You are not the authorized manager for this Monanimal", true);
            } else {
                showToast(`❌ Unlocking failed: ${errorString}`);
            }
        }
    }

    // Transfer monanimal
    async function transferMonanimal(tokenId: number, to: string) {
        try {
            showToast(`Transferring Monanimal ${tokenId}...`);
            await writeContractAsync({
                address: MISSION5NFT_ADDRESS,
                abi: MISSION5NFT_ABI,
                functionName: "transferFrom",
                args: [address, to, tokenId],
            });
            showToast(`✅ Transferred Monanimal ${tokenId}`);
            await fetchUserMonanimals();
        } catch (error: any) {
            console.error("Transfer failed:", error);
            const errorString = error?.error?.message || error?.reason || error?.message || "Unknown error";
            if (errorString.includes("NFT is locked")) {
                showToast("❌ Monanimal is locked, transfer is disabled", true);
            } else {
                showToast(`❌ Transfer failed: ${errorString}`);
            }
        }
    }

    // Load data on component mount
    useEffect(() => {

        if (address || isConnected) {
            console.log("✅ User connected, fetching data...");
            fetchContractInfo();
            fetchUserMonanimals();
        } else {
            console.log("❌ User not connected, skipping data fetch");
        }
    }, [isConnected, address]);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-2 mb-4">
                    <Shield className="h-8 w-8 text-yellow-400" />
                    <h1 className="text-4xl font-bold text-white">Monad Monanimals</h1>
                </div>
                <p className="text-xl text-gray-300 mb-6">
                    Dynamic, lockable NFTs with Monad lore and parallel processing themes
                </p>
                <div className="flex justify-center items-center gap-4 mb-6 flex-wrap">
                    <Badge variant="outline" className="text-lg bg-white/10 border-white/20 text-white">
                        Total Supply: {totalSupply}/1111
                    </Badge>
                    <Badge variant="outline" className="text-lg bg-white/10 border-white/20 text-white">
                        Your Monanimals: {userMonanimals.length}
                    </Badge>
                    <Badge variant="outline" className="text-lg bg-green-500/20 border-green-500/30 text-green-400">
                        <Award className="h-4 w-4 mr-1" />
                        Live on Monad Testnet
                    </Badge>
                </div>
                <Button
                    onClick={mintMonanimal}
                    disabled={minting || !address || !isConnected}
                    className="text-lg px-8 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white border-0"
                >
                    {minting ? "Minting..." : `Mint Monanimal (Free)`}
                </Button>
            </div>

            {/* Monanimal Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <Card className="bg-white/10 border-white/20 text-white">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                            <Users className="h-5 w-5 text-blue-400" />
                            <span className="text-sm">Total Monanimals</span>
                        </div>
                        <p className="text-2xl font-bold mt-2">{totalSupply}</p>
                    </CardContent>
                </Card>
                <Card className="bg-white/10 border-white/20 text-white">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                            <Lock className="h-5 w-5 text-red-400" />
                            <span className="text-sm">Your Locked NFTs</span>
                        </div>
                        <p className="text-2xl font-bold mt-2">{userMonanimals.filter(m => m.isLocked).length}</p>
                    </CardContent>
                </Card>
                <Card className="bg-white/10 border-white/20 text-white">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-green-400" />
                            <span className="text-sm">Collection</span>
                        </div>
                        <p className="text-2xl font-bold mt-2">{contractName}</p>
                    </CardContent>
                </Card>
                <Card className="bg-white/10 border-white/20 text-white">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                            <Star className="h-5 w-5 text-yellow-400" />
                            <span className="text-sm">Symbol</span>
                        </div>
                        <p className="text-2xl font-bold mt-2">{contractSymbol}</p>
                    </CardContent>
                </Card>
            </div>

            {/* User's Monanimals */}
            {isConnected && (
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-white">Your Monanimals</h2>
                        <Button
                            onClick={fetchUserMonanimals}
                            variant="outline"
                            size="sm"
                            disabled={loading}
                        >
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        </Button>
                    </div>

                    {loading && (
                        <div className="flex justify-center items-center p-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
                        </div>
                    )}

                    {!loading && userMonanimals.length === 0 && (
                        <div className="text-center py-16 bg-white/5 rounded-xl border border-white/10">
                            <h3 className="text-xl font-medium mb-2 text-white">No Monanimals Found</h3>
                            <p className="text-gray-300 mb-6">
                                You don't have any Monad Monanimals yet.
                            </p>
                            <Button
                                onClick={mintMonanimal}
                                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                            >
                                Mint Your First Monanimal
                            </Button>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {userMonanimals.map((monanimal) => (
                            <Card
                                key={monanimal.tokenId}
                                className="bg-white/10 border-white/20 text-white overflow-hidden"
                            >
                                <div className="aspect-square w-full overflow-hidden bg-gradient-to-br from-purple-900 to-blue-900 relative">
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        {monanimal.image ? (
                                            <img src={monanimal.image} alt={`Monanimal #${monanimal.tokenId}`} className="h-80 w-80 object-contain" />
                                        ) : (
                                            <Shield className="h-24 w-24 text-yellow-400" />
                                        )}
                                    </div>
                                    <div className="absolute top-2 right-2">
                                        <Badge variant="outline" className="bg-black/50 border-yellow-500/50 text-yellow-400">
                                            #{monanimal.tokenId}
                                        </Badge>
                                    </div>
                                </div>

                                <CardHeader className="pb-2">
                                    <div className="flex justify-between items-start">
                                        <CardTitle className="text-xl text-white">
                                            Monanimal #{monanimal.tokenId}
                                        </CardTitle>
                                        <Badge
                                            variant={monanimal.isLocked ? "destructive" : "default"}
                                            className="ml-2"
                                        >
                                            {monanimal.isLocked ? (
                                                <>
                                                    <Lock className="w-3 h-3 mr-1" /> Locked
                                                </>
                                            ) : (
                                                <>
                                                    <Unlock className="w-3 h-3 mr-1" /> Unlocked
                                                </>
                                            )}
                                        </Badge>
                                    </div>
                                </CardHeader>

                                <CardContent className="pb-2">
                                    <div className="space-y-3">
                                        {!monanimal.isLocked && (
                                            <>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div className="col-span-2">
                                                        <Select
                                                            value={lockDurations[monanimal.tokenId]?.toString() || ""}
                                                            onValueChange={(val) =>
                                                                setLockDurations((prev) => ({
                                                                    ...prev,
                                                                    [monanimal.tokenId]: val,
                                                                }))
                                                            }
                                                        >
                                                            <SelectTrigger className="bg-white/10 border-white/20 text-white">
                                                                <SelectValue placeholder="Lock duration" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="2">2 minutes</SelectItem>
                                                                <SelectItem value="5">5 minutes</SelectItem>
                                                                <SelectItem value="15">15 minutes</SelectItem>
                                                                <SelectItem value="60">1 hour</SelectItem>
                                                                <SelectItem value="1440">1 day</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <Input
                                                        value={managerAddresses[monanimal.tokenId] || ""}
                                                        placeholder="Manager Address (optional)"
                                                        className="bg-white/10 border-white/20 text-white text-sm col-span-2"
                                                        onChange={(e) =>
                                                            setManagerAddresses((prev) => ({
                                                                ...prev,
                                                                [monanimal.tokenId]: e.target.value,
                                                            }))
                                                        }
                                                    />
                                                </div>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <Button
                                                        onClick={() =>
                                                            lockMonanimal(
                                                                monanimal.tokenId,
                                                                Number(lockDurations[monanimal.tokenId]),
                                                                managerAddresses[monanimal.tokenId]
                                                            )
                                                        }
                                                        className="bg-purple-600 hover:bg-purple-700"
                                                    >
                                                        <Lock className="w-4 h-4 mr-1" /> Lock
                                                    </Button>
                                                    <Button
                                                        onClick={() => approveMonanimal(monanimal.tokenId)}
                                                        variant="outline"
                                                    >
                                                        Approve
                                                    </Button>
                                                </div>
                                            </>
                                        )}

                                        {monanimal.isLocked && (
                                            <div className="grid grid-cols-2 gap-2">
                                                <Button
                                                    onClick={() => unlockMonanimal(monanimal.tokenId)}
                                                    className="bg-purple-600 hover:bg-purple-700"
                                                >
                                                    <Unlock className="w-4 h-4 mr-1" /> Unlock
                                                </Button>
                                            </div>
                                        )}

                                        <div className="border-t border-white/20 pt-3">
                                            <div className="grid grid-cols-2 gap-2">
                                                <Input
                                                    value={transferAddresses[monanimal.tokenId] || ""}
                                                    placeholder="Transfer to address"
                                                    className="bg-white/10 border-white/20 text-white text-sm col-span-2"
                                                    onChange={(e) =>
                                                        setTransferAddresses((prev) => ({
                                                            ...prev,
                                                            [monanimal.tokenId]: e.target.value,
                                                        }))
                                                    }
                                                />
                                                <Button
                                                    disabled={monanimal.isLocked}
                                                    onClick={() => {
                                                        const toAddress = transferAddresses[monanimal.tokenId];
                                                        if (!toAddress) {
                                                            showToast("Please enter a transfer address", true);
                                                            return;
                                                        }
                                                        transferMonanimal(monanimal.tokenId, toAddress);
                                                    }}
                                                    variant="outline"
                                                    className="col-span-2"
                                                >
                                                    <Send className="w-4 h-4 mr-1" /> Transfer
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-white/10 border-white/20 text-white hover:bg-white/15 transition-colors">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-white">
                            <Zap className="h-5 w-5 text-yellow-400" />
                            Dynamic States
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-gray-300">
                            Monanimals change appearance based on lock status with dynamic SVG generation.
                            Each lock/unlock cycle updates the visual representation on-chain.
                        </p>
                    </CardContent>
                </Card>
                <Card className="bg-white/10 border-white/20 text-white hover:bg-white/15 transition-colors">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-white">
                            <Star className="h-5 w-5 text-yellow-400" />
                            ILockable Standard
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-gray-300">
                            Full ILockable standard implementation for seamless lending integration
                            with the broader Monad ecosystem and lending platforms.
                        </p>
                    </CardContent>
                </Card>
                <Card className="bg-white/10 border-white/20 text-white hover:bg-white/15 transition-colors">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-white">
                            <Shield className="h-5 w-5 text-yellow-400" />
                            Monad Lore Integration
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-gray-300">
                            Built with Monad lore integration featuring monanimals theme and
                            parallel processing concepts throughout the collection.
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Contract Info */}
            <div className="mt-8 bg-white/5 rounded-lg p-6 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4">Contract Information</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                        <span className="text-gray-400">Mission5NFT:</span>
                        <p className="text-white font-mono">{MISSION5NFT_ADDRESS}</p>
                    </div>
                    <div>
                        <span className="text-gray-400">Collection:</span>
                        <p className="text-white font-mono">{contractName} ({contractSymbol})</p>
                    </div>
                </div>
            </div>
        </div>
    );
} 