"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { ethers } from "ethers";
import { ILockABI } from "@/components/lib/constants";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/Components/privy/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/privy/ui/select";
import { Button } from "@/Components/privy/ui/button";
import * as Dialog from "@radix-ui/react-dialog";
import { Badge } from "@/Components/privy/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/Components/privy/ui/card";
import { Input } from "@/Components/privy/ui/input";
import {
  Clock,
  Lock,
  Unlock,
  Send,
  AlertTriangle,
  Info,
  Plus,
  RefreshCw,
} from "lucide-react";

// Custom Separator component
const Separator = ({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={`h-[1px] w-full bg-gray-700 my-2 ${className}`}
      {...props}
    />
  );
};

// ✅ Hardcoded Collections
const SUPPORTED_LOCKABLE_COLLECTIONS = [
  //   {
  //     name: "Lockable Collection TEST 1",
  //     address: "0xC840DA9957d641684Fc05565A9756df872879889",
  //   },
  {
    name: "Lockable Collection TEST 2",
    address: "0xC114c0C1738BA3aF77CA2a2eb1e9AE666dbC21B1",
    image: "/placeholder.svg?height=300&width=300",
    description:
      "A collection of lockable NFTs with unique properties and features. Lock your NFTs to prevent transfers and secure your digital assets.",
  },
];

export default function TestLockablePage() {
  const { authenticated, ready, user } = usePrivy();
  const [nfts, setNfts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedCollection, setSelectedCollection] = useState(
    SUPPORTED_LOCKABLE_COLLECTIONS[0].address
  );
  const [filter, setFilter] = useState<"all" | "locked" | "unlocked">("all");
  const [lockDurations, setLockDurations] = useState<Record<number, string>>(
    {}
  );
  const [managerAddresses, setManagerAddresses] = useState<
    Record<number, string>
  >({});
  const [transferAddresses, setTransferAddresses] = useState<
    Record<number, string>
  >({});

  useEffect(() => {
    if (authenticated && ready) {
      fetchAllNFTs();
    }
  }, [authenticated, user]);

  async function fetchAllNFTs() {
    if (!user?.wallet?.address) return;
    try {
      setLoading(true);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const allNFTs: any[] = [];

      for (const collection of SUPPORTED_LOCKABLE_COLLECTIONS) {
        const contract = new ethers.Contract(
          collection.address,
          ILockABI,
          signer
        );
        try {
          const balance = await contract.balanceOf(user.wallet.address);
          for (let i = 0; i < balance; i++) {
            const tokenId = await contract.tokenOfOwnerByIndex(
              user.wallet.address,
              i
            );
            const lockInfo = await contract.getLockInfo(tokenId);
            allNFTs.push({
              collectionName: collection.name,
              collectionAddress: collection.address,
              tokenId: Number(tokenId),
              isLocked: lockInfo[0],
              lockTimestamp: Number(lockInfo[2]),
              duration: Number(lockInfo[3]),
              image:
                collection.image || "/placeholder.svg?height=300&width=300",
            });
          }
        } catch (err) {
          console.warn(`Could not fetch from ${collection.name}`, err);
        }
      }

      setNfts(allNFTs);
    } catch (error) {
      console.error(error);
      setMessage("Failed to fetch NFTs");
    } finally {
      setLoading(false);
    }
  }

  async function approveNFT(contractAddress: string, tokenId: number) {
    try {
      setMessage(`Approving token ${tokenId}...`);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const lockableNFT = new ethers.Contract(
        contractAddress,
        ILockABI,
        signer
      );
      const tx = await lockableNFT.approve(
        "0x000000000000000000000000000000000000dead",
        tokenId
      );
      await tx.wait();
      setMessage(`✅ Approved token ${tokenId}`);
    } catch (error: any) {
      console.error(error);

      const errorString =
        error?.error?.message ||
        error?.reason ||
        error?.message ||
        "Unknown error";

      if (errorString.includes("User rejected the request")) {
        setMessage("User rejected the request");
      } else {
        setMessage(`❌ Transaction failed: ${errorString}`);
      }
    }
  }

  async function lockNFT(
    contractAddress: string,
    tokenId: number,
    selectedMinutes?: number,
    manager?: string
  ) {
    try {
      setMessage(`Locking token ${tokenId}...`);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const lockableNFT = new ethers.Contract(
        contractAddress,
        ILockABI,
        signer
      );

      const durationInSeconds = (selectedMinutes || 2) * 60;
      const tx = await lockableNFT.lock(
        tokenId,
        manager || (await signer.getAddress()),
        durationInSeconds
      );
      await tx.wait();
      setMessage(`✅ Locked token ${tokenId}`);
      await fetchAllNFTs();
    } catch (error: any) {
      console.error(error);

      const errorString =
        error?.error?.message ||
        error?.reason ||
        error?.message ||
        "Unknown error";

      if (errorString.includes("User rejected the request")) {
        setMessage("User rejected the request");
      } else {
        setMessage(`❌ Transaction failed: ${errorString}`);
      }
    }
  }

  async function unlockNFT(contractAddress: string, tokenId: number) {
    try {
      setMessage(`Unlocking token ${tokenId}...`);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const lockableNFT = new ethers.Contract(
        contractAddress,
        ILockABI,
        signer
      );
      const tx = await lockableNFT.unlock(tokenId);
      await tx.wait();
      setMessage(`✅ Unlocked token ${tokenId}`);
      await fetchAllNFTs();
    } catch (error: any) {
      console.error(error);

      const errorString =
        error?.error?.message ||
        error?.reason ||
        error?.message ||
        "Unknown error";

      if (errorString.includes("Not authorized manager")) {
        setMessage(
          "❌ You Are Not An Authorized Manager, Can Only Be Unlocked By An Authorized Manager."
        );
      } else if (errorString.includes("User rejected the request")) {
        setMessage("User rejected the request");
      } else {
        setMessage(`❌ Transaction failed: ${errorString}`);
      }
    }
  }

  async function transferNFT(
    contractAddress: string,
    tokenId: number,
    to: string
  ) {
    try {
      setMessage(`Transferring token ${tokenId}...`);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const lockableNFT = new ethers.Contract(
        contractAddress,
        ILockABI,
        signer
      );
      const tx = await lockableNFT.transferFrom(
        await signer.getAddress(),
        to,
        tokenId
      );
      await tx.wait();
      setMessage(`✅ Transferred token ${tokenId}`);
      await fetchAllNFTs();
    } catch (error: any) {
      console.error(error);

      const errorString =
        error?.error?.message ||
        error?.reason ||
        error?.message ||
        "Unknown error";

      if (errorString.includes("NFT is locked")) {
        setMessage("❌ NFT is locked, Transfer is Disabled.");
      } else if (errorString.includes("User rejected the request")) {
        setMessage("User rejected the request");
      } else {
        setMessage(`❌ Transaction failed: ${errorString}`);
      }
    }
  }

  async function emergencyUnlockNFT(contractAddress: string, tokenId: number) {
    try {
      setMessage(`Emergency unlocking token ${tokenId}...`);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const lockableNFT = new ethers.Contract(
        contractAddress,
        ILockABI,
        signer
      );
      const tx = await lockableNFT.emergencyUnlock(tokenId);
      await tx.wait();
      setMessage(`✅ Emergency unlocked token ${tokenId}`);
      await fetchAllNFTs();
    } catch (error: any) {
      console.error(error);

      const errorString =
        error?.error?.message ||
        error?.reason ||
        error?.message ||
        "Unknown error";

      if (errorString.includes("Emergency unlock not allowed yet")) {
        setMessage(
          "❌ Emergency unlock is not allowed yet, wait until unlock time."
        );
      } else if (errorString.includes("User rejected the request")) {
        setMessage("User rejected the request");
      } else {
        setMessage(`❌ Transaction failed: ${errorString}`);
      }
    }
  }

  async function mintNFT() {
    try {
      setMessage("Minting NFT...");
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const lockableNFT = new ethers.Contract(
        selectedCollection,
        ILockABI,
        signer
      );
      const tx = await lockableNFT.mint(await signer.getAddress());
      await tx.wait();
      setMessage("✅ Minted new NFT!");
      await fetchAllNFTs();
    } catch (error) {
      console.error(error);
      setMessage("❌ Mint failed");
    }
  }

  // 🛠 Countdown Utility
  function getCountdown(unlockTimestamp: number) {
    const now = Math.floor(Date.now() / 1000);
    const diff = unlockTimestamp - now;
    if (diff <= 0) return "⏳ Unlockable now";
    const days = Math.floor(diff / 86400);
    const hours = Math.floor((diff % 86400) / 3600);
    const minutes = Math.floor((diff % 3600) / 60);
    const seconds = diff % 60;
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  }

  // Get collection details by address
  const getCollectionByAddress = (address: string) => {
    return (
      SUPPORTED_LOCKABLE_COLLECTIONS.find((c) => c.address === address) ||
      SUPPORTED_LOCKABLE_COLLECTIONS[0]
    );
  };

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          Lockable NFT Dashboard
        </h1>

        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.includes("❌")
                ? "bg-red-900/30 border border-red-700"
                : message.includes("✅")
                ? "bg-green-900/30 border border-green-700"
                : "bg-blue-900/30 border border-blue-700"
            }`}
          >
            <p className="font-medium">{message}</p>
          </div>
        )}

        <Tabs defaultValue="nfts" className="w-full">
          <TabsList className="grid grid-cols-2 mb-8 bg-gray-800 p-1 rounded-lg">
            <TabsTrigger
              value="nfts"
              className="data-[state=active]:bg-gray-700 rounded-md"
            >
              My NFTs
            </TabsTrigger>
            <TabsTrigger
              value="mint"
              className="data-[state=active]:bg-gray-700 rounded-md"
            >
              Mint NFTs
            </TabsTrigger>
          </TabsList>

          {/* 🖼 My NFTs Tab */}
          <TabsContent value="nfts">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <h2 className="text-2xl font-bold">My Lockable NFTs</h2>

              <div className="flex gap-2">
                <Button
                  onClick={() => setFilter("all")}
                  variant={filter === "all" ? "default" : "outline"}
                  size="sm"
                  className={
                    filter === "all" ? "bg-purple-600 hover:bg-purple-700" : ""
                  }
                >
                  All
                </Button>
                <Button
                  onClick={() => setFilter("locked")}
                  variant={filter === "locked" ? "default" : "outline"}
                  size="sm"
                  className={
                    filter === "locked"
                      ? "bg-purple-600 hover:bg-purple-700"
                      : ""
                  }
                >
                  <Lock className="w-4 h-4 mr-1" /> Locked
                </Button>
                <Button
                  onClick={() => setFilter("unlocked")}
                  variant={filter === "unlocked" ? "default" : "outline"}
                  size="sm"
                  className={
                    filter === "unlocked"
                      ? "bg-purple-600 hover:bg-purple-700"
                      : ""
                  }
                >
                  <Unlock className="w-4 h-4 mr-1" /> Unlocked
                </Button>
                <Button
                  onClick={fetchAllNFTs}
                  variant="outline"
                  size="sm"
                  className="ml-2"
                >
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {loading && (
              <div className="flex justify-center items-center p-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
              </div>
            )}

            {!loading && nfts.length === 0 && (
              <div className="text-center py-16 bg-gray-800/50 rounded-xl">
                <h3 className="text-xl font-medium mb-2">No NFTs Found</h3>
                <p className="text-gray-400 mb-6">
                  You don't have any lockable NFTs yet.
                </p>
                <Button
                  onClick={() => {
                    const element = document.querySelector(
                      '[data-state="inactive"][value="mint"]'
                    ) as HTMLElement;
                    if (element) element.click();
                  }}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Mint Your First NFT
                </Button>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {nfts
                .filter((nft) => {
                  if (filter === "locked") return nft.isLocked;
                  if (filter === "unlocked") return !nft.isLocked;
                  return true;
                })
                .map((nft) => {
                  const unlockAt = nft.lockTimestamp + nft.duration;
                  return (
                    <Card
                      key={`${nft.collectionAddress}-${nft.tokenId}`}
                      className="bg-gray-800 border-gray-700 overflow-hidden"
                    >
                      <div className="aspect-square w-full overflow-hidden bg-gray-900">
                        <img
                          src={nft.image || "/placeholder.svg"}
                          alt={`NFT #${nft.tokenId}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-xl">
                            {nft.collectionName} #{nft.tokenId}
                          </CardTitle>
                          <Badge
                            variant={nft.isLocked ? "destructive" : "success"}
                            className="ml-2"
                          >
                            {nft.isLocked ? (
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
                        {nft.isLocked && (
                          <div className="flex items-center text-amber-400 text-sm mt-2">
                            <Clock className="w-4 h-4 mr-1" />
                            <span>{getCountdown(unlockAt)}</span>
                          </div>
                        )}
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="space-y-3">
                          {!nft.isLocked && (
                            <>
                              <div className="grid grid-cols-2 gap-2">
                                <div className="col-span-2">
                                  <Select
                                    value={
                                      lockDurations[nft.tokenId]?.toString() ||
                                      ""
                                    }
                                    onValueChange={(val) =>
                                      setLockDurations((prev) => ({
                                        ...prev,
                                        [nft.tokenId]: val,
                                      }))
                                    }
                                  >
                                    <SelectTrigger className="bg-gray-700 border-gray-600">
                                      <SelectValue placeholder="Lock duration" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="2">
                                        2 minutes
                                      </SelectItem>
                                      <SelectItem value="5">
                                        5 minutes
                                      </SelectItem>
                                      <SelectItem value="15">
                                        15 minutes
                                      </SelectItem>
                                      <SelectItem value="60">1 hour</SelectItem>
                                      <SelectItem value="1440">
                                        1 day
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <Input
                                  value={managerAddresses[nft.tokenId] || ""}
                                  placeholder="Manager Address (optional)"
                                  className="bg-gray-700 border-gray-600 text-sm col-span-2"
                                  onChange={(e) =>
                                    setManagerAddresses((prev) => ({
                                      ...prev,
                                      [nft.tokenId]: e.target.value,
                                    }))
                                  }
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <Button
                                  onClick={() =>
                                    lockNFT(
                                      nft.collectionAddress,
                                      nft.tokenId,
                                      Number(lockDurations[nft.tokenId]),
                                      managerAddresses[nft.tokenId]
                                    )
                                  }
                                  className="bg-purple-600 hover:bg-purple-700"
                                >
                                  <Lock className="w-4 h-4 mr-1" /> Lock
                                </Button>
                                <Button
                                  onClick={() =>
                                    approveNFT(
                                      nft.collectionAddress,
                                      nft.tokenId
                                    )
                                  }
                                  variant="outline"
                                >
                                  Approve
                                </Button>
                              </div>
                            </>
                          )}

                          {nft.isLocked && (
                            <div className="grid grid-cols-2 gap-2">
                              <Button
                                onClick={() =>
                                  unlockNFT(nft.collectionAddress, nft.tokenId)
                                }
                                className="bg-purple-600 hover:bg-purple-700"
                              >
                                <Unlock className="w-4 h-4 mr-1" /> Unlock
                              </Button>
                              <Button
                                onClick={() =>
                                  emergencyUnlockNFT(
                                    nft.collectionAddress,
                                    nft.tokenId
                                  )
                                }
                                variant="destructive"
                              >
                                <AlertTriangle className="w-4 h-4 mr-1" />{" "}
                                Emergency
                              </Button>
                            </div>
                          )}

                          <Separator />

                          <div className="grid grid-cols-2 gap-2">
                            <Input
                              value={transferAddresses[nft.tokenId] || ""}
                              placeholder="Transfer to address"
                              className="bg-gray-700 border-gray-600 text-sm col-span-2"
                              onChange={(e) =>
                                setTransferAddresses((prev) => ({
                                  ...prev,
                                  [nft.tokenId]: e.target.value,
                                }))
                              }
                            />
                            <Button
                              disabled={nft.isLocked}
                              onClick={() => {
                                const toAddress =
                                  transferAddresses[nft.tokenId];
                                if (!toAddress) {
                                  alert("Please enter a transfer address");
                                  return;
                                }
                                transferNFT(
                                  nft.collectionAddress,
                                  nft.tokenId,
                                  toAddress
                                );
                              }}
                              variant="outline"
                              className="col-span-2"
                            >
                              <Send className="w-4 h-4 mr-1" /> Transfer
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between pt-2">
                        <Button
                          onClick={async () => {
                            const to = transferAddresses[nft.tokenId];
                            if (!to) {
                              alert("Please enter a destination address");
                              return;
                            }

                            try {
                              setMessage(
                                `Unlocking and transferring token ${nft.tokenId}...`
                              );
                              const provider =
                                new ethers.providers.Web3Provider(
                                  window.ethereum
                                );
                              const signer = provider.getSigner();
                              const lockableNFT = new ethers.Contract(
                                nft.collectionAddress,
                                ILockABI,
                                signer
                              );
                              const tx = await lockableNFT.unlockAndTransfer(
                                to,
                                nft.tokenId
                              );
                              await tx.wait();
                              setMessage(
                                `✅ Unlocked and Transferred token ${nft.tokenId}`
                              );
                              await fetchAllNFTs();
                            } catch (error: any) {
                              console.error(error);
                              const errorString =
                                error?.error?.message ||
                                error?.reason ||
                                error?.message ||
                                "Unknown error";

                              setMessage(
                                `❌ Transaction failed: ${errorString}`
                              );
                            }
                          }}
                          variant="outline"
                          size="sm"
                        >
                          Unlock & Transfer
                        </Button>
                        <LockInfoModal
                          contractAddress={nft.collectionAddress}
                          tokenId={nft.tokenId}
                        />
                      </CardFooter>
                    </Card>
                  );
                })}
            </div>
          </TabsContent>

          {/* 🛠 Mint NFTs Tab */}
          <TabsContent value="mint">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gray-800 rounded-xl p-6 order-2 md:order-1">
                <h2 className="text-2xl font-bold mb-6">Mint a New NFT</h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Select Collection
                    </label>
                    <Select
                      value={selectedCollection}
                      onValueChange={setSelectedCollection}
                    >
                      <SelectTrigger className="bg-gray-700 border-gray-600">
                        <SelectValue placeholder="Select Collection" />
                      </SelectTrigger>
                      <SelectContent>
                        {SUPPORTED_LOCKABLE_COLLECTIONS.map((collection) => (
                          <SelectItem
                            key={collection.address}
                            value={collection.address}
                          >
                            {collection.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="bg-gray-700/50 rounded-lg p-4">
                    <h3 className="font-medium mb-2">Collection Details</h3>
                    <p className="text-sm text-gray-300 mb-4">
                      {getCollectionByAddress(selectedCollection).description}
                    </p>
                    <div className="text-xs text-gray-400 font-mono break-all">
                      Contract: {selectedCollection}
                    </div>
                  </div>

                  <Button
                    onClick={mintNFT}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    size="lg"
                  >
                    <Plus className="w-5 h-5 mr-2" /> Mint New NFT
                  </Button>
                </div>
              </div>

              <div className="order-1 md:order-2">
                <div className="bg-gray-800 rounded-xl overflow-hidden">
                  <div className="aspect-square w-full overflow-hidden relative">
                    <img
                      src={
                        getCollectionByAddress(selectedCollection).image ||
                        "/placeholder.svg"
                      }
                      alt="NFT Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-70"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-2xl font-bold mb-2">
                        {getCollectionByAddress(selectedCollection).name}
                      </h3>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-gray-800/80">
                          Lockable
                        </Badge>
                        <Badge variant="outline" className="bg-gray-800/80">
                          Transferable
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-lg font-medium mb-4">Features</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <div className="bg-purple-500/20 p-2 rounded-full mr-3 mt-0.5">
                          <Lock className="w-4 h-4 text-purple-400" />
                        </div>
                        <div>
                          <span className="font-medium">Lockable</span>
                          <p className="text-sm text-gray-400">
                            Secure your NFT by locking it for a specific
                            duration
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <div className="bg-purple-500/20 p-2 rounded-full mr-3 mt-0.5">
                          <Send className="w-4 h-4 text-purple-400" />
                        </div>
                        <div>
                          <span className="font-medium">Transferable</span>
                          <p className="text-sm text-gray-400">
                            Transfer your NFT to another wallet when unlocked
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <div className="bg-purple-500/20 p-2 rounded-full mr-3 mt-0.5">
                          <Info className="w-4 h-4 text-purple-400" />
                        </div>
                        <div>
                          <span className="font-medium">Metadata</span>
                          <p className="text-sm text-gray-400">
                            View detailed information about your NFT's lock
                            status
                          </p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// ✅ LockInfoModal Component
function LockInfoModal({
  contractAddress,
  tokenId,
}: {
  contractAddress: string;
  tokenId: number;
}) {
  const [open, setOpen] = useState(false);
  const [lockData, setLockData] = useState<any>(null);

  async function fetchLockInfo() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const lockableNFT = new ethers.Contract(contractAddress, ILockABI, signer);

    const [locked, manager, lockTimestamp, duration] =
      await lockableNFT.getLockInfo(tokenId);
    setLockData({
      locked,
      manager,
      lockTimestamp: Number(lockTimestamp),
      duration: Number(duration),
    });
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button variant="outline" size="sm">
          <Info className="w-4 h-4 mr-1" /> Info
        </Button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/60 fixed inset-0 backdrop-blur-sm" />
        <Dialog.Content className="fixed top-1/2 left-1/2 w-[90%] max-w-md bg-gray-800 p-6 rounded-lg shadow-lg -translate-x-1/2 -translate-y-1/2 border border-gray-700">
          <Dialog.Title className="text-xl font-bold mb-4 flex items-center">
            <Info className="w-5 h-5 mr-2 text-purple-400" />
            Lock Info for Token {tokenId}
          </Dialog.Title>

          {lockData ? (
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center p-3 bg-gray-700/50 rounded-lg">
                <span className="font-medium">Status:</span>
                <Badge variant={lockData.locked ? "destructive" : "success"}>
                  {lockData.locked ? (
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

              <div className="p-3 bg-gray-700/50 rounded-lg">
                <p className="font-medium mb-1">Manager:</p>
                <p className="text-xs font-mono break-all text-gray-300">
                  {lockData.manager}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-gray-700/50 rounded-lg">
                  <p className="font-medium mb-1">Lock Time:</p>
                  <p className="text-gray-300">
                    {new Date(lockData.lockTimestamp * 1000).toLocaleString()}
                  </p>
                </div>

                <div className="p-3 bg-gray-700/50 rounded-lg">
                  <p className="font-medium mb-1">Duration:</p>
                  <p className="text-gray-300">
                    {Math.floor(lockData.duration / 60)} mins
                    <span className="block text-xs text-gray-400">
                      ({(lockData.duration / 86400).toFixed(2)} days)
                    </span>
                  </p>
                </div>
              </div>

              <div className="p-3 bg-gray-700/50 rounded-lg">
                <p className="font-medium mb-1">Unlocks At:</p>
                <p className="text-gray-300 flex items-center">
                  <Clock className="w-4 h-4 mr-1 text-amber-400" />
                  {new Date(
                    (lockData.lockTimestamp + lockData.duration) * 1000
                  ).toLocaleString()}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8">
              <p className="text-gray-400 mb-4">
                Click fetch to view lock information
              </p>
              <Button
                onClick={fetchLockInfo}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <RefreshCw className="w-4 h-4 mr-1" /> Fetch Lock Info
              </Button>
            </div>
          )}

          <div className="flex justify-end mt-6 gap-2">
            <Dialog.Close asChild>
              <Button variant="outline">Close</Button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

//////////////////////////////////////////////-----------------------------------------------------//////////////////////////////
// "use client";

// import { useEffect, useState } from "react";
// import { usePrivy } from "@privy-io/react-auth";
// import { ethers } from "ethers";
// import { ILockABI } from "@/components/lib/constants";
// import {
//   Tabs,
//   TabsContent,
//   TabsList,
//   TabsTrigger,
// } from "@/Components/privy/ui/tabs";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/Components/privy/ui/select";
// import { Button } from "@/Components/privy/ui/button";
// import * as Dialog from "@radix-ui/react-dialog";

// // ✅ Hardcoded Collections
// const SUPPORTED_LOCKABLE_COLLECTIONS = [
//   //   {
//   //     name: "Lockable Collection TEST 1",
//   //     address: "0xC840DA9957d641684Fc05565A9756df872879889",
//   //   },
//   {
//     name: "Lockable Collection TEST 2",
//     address: "0x0A68A67EfD430e7cD8192BAdC464039Ebad6D4e8",
//   },
// ];

// export default function TestLockablePage() {
//   const { authenticated, ready, user } = usePrivy();
//   const [nfts, setNfts] = useState<any[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");
//   const [selectedCollection, setSelectedCollection] = useState(
//     SUPPORTED_LOCKABLE_COLLECTIONS[0].address
//   );
//   const [filter, setFilter] = useState<"all" | "locked" | "unlocked">("all");
//   const [lockDurations, setLockDurations] = useState<Record<number, string>>(
//     {}
//   );
//   const [managerAddresses, setManagerAddresses] = useState<
//     Record<number, string>
//   >({});
//   const [transferAddresses, setTransferAddresses] = useState<
//     Record<number, string>
//   >({});

//   useEffect(() => {
//     if (authenticated && ready) {
//       fetchAllNFTs();
//     }
//   }, [authenticated, user]);

//   async function fetchAllNFTs() {
//     if (!user?.wallet?.address) return;
//     try {
//       setLoading(true);
//       const provider = new ethers.providers.Web3Provider(window.ethereum);
//       const signer = provider.getSigner();
//       const allNFTs: any[] = [];

//       for (const collection of SUPPORTED_LOCKABLE_COLLECTIONS) {
//         const contract = new ethers.Contract(
//           collection.address,
//           ILockABI,
//           signer
//         );
//         try {
//           const balance = await contract.balanceOf(user.wallet.address);
//           for (let i = 0; i < balance; i++) {
//             const tokenId = await contract.tokenOfOwnerByIndex(
//               user.wallet.address,
//               i
//             );
//             const lockInfo = await contract.getLockInfo(tokenId);
//             allNFTs.push({
//               collectionName: collection.name,
//               collectionAddress: collection.address,
//               tokenId: Number(tokenId),
//               isLocked: lockInfo[0],
//               lockTimestamp: Number(lockInfo[2]),
//               duration: Number(lockInfo[3]),
//             });
//           }
//         } catch (err) {
//           console.warn(`Could not fetch from ${collection.name}`, err);
//         }
//       }

//       setNfts(allNFTs);
//     } catch (error) {
//       console.error(error);
//       setMessage("Failed to fetch NFTs");
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function approveNFT(contractAddress: string, tokenId: number) {
//     try {
//       setMessage(`Approving token ${tokenId}...`);
//       const provider = new ethers.providers.Web3Provider(window.ethereum);
//       const signer = provider.getSigner();
//       const lockableNFT = new ethers.Contract(
//         contractAddress,
//         ILockABI,
//         signer
//       );
//       const tx = await lockableNFT.approve(
//         "0x000000000000000000000000000000000000dead",
//         tokenId
//       );
//       await tx.wait();
//       setMessage(`✅ Approved token ${tokenId}`);
//     } catch (error: any) {
//       console.error(error);

//       const errorString =
//         error?.error?.message ||
//         error?.reason ||
//         error?.message ||
//         "Unknown error";

//       if (errorString.includes("User rejected the request")) {
//         setMessage("User rejected the request");
//       } else {
//         setMessage(`❌ Transaction failed: ${errorString}`);
//       }
//     }
//   }

//   async function lockNFT(
//     contractAddress: string,
//     tokenId: number,
//     selectedMinutes?: number,
//     manager?: string
//   ) {
//     try {
//       setMessage(`Locking token ${tokenId}...`);
//       const provider = new ethers.providers.Web3Provider(window.ethereum);
//       const signer = provider.getSigner();
//       const lockableNFT = new ethers.Contract(
//         contractAddress,
//         ILockABI,
//         signer
//       );

//       const durationInSeconds = (selectedMinutes || 2) * 60;
//       const tx = await lockableNFT.lock(
//         tokenId,
//         manager || (await signer.getAddress()),
//         durationInSeconds
//       );
//       await tx.wait();
//       setMessage(`✅ Locked token ${tokenId}`);
//       await fetchAllNFTs();
//     } catch (error: any) {
//       console.error(error);

//       const errorString =
//         error?.error?.message ||
//         error?.reason ||
//         error?.message ||
//         "Unknown error";

//       if (errorString.includes("User rejected the request")) {
//         setMessage("User rejected the request");
//       } else {
//         setMessage(`❌ Transaction failed: ${errorString}`);
//       }
//     }
//   }

//   async function unlockNFT(contractAddress: string, tokenId: number) {
//     try {
//       setMessage(`Unlocking token ${tokenId}...`);
//       const provider = new ethers.providers.Web3Provider(window.ethereum);
//       const signer = provider.getSigner();
//       const lockableNFT = new ethers.Contract(
//         contractAddress,
//         ILockABI,
//         signer
//       );
//       const tx = await lockableNFT.unlock(tokenId);
//       await tx.wait();
//       setMessage(`✅ Unlocked token ${tokenId}`);
//       await fetchAllNFTs();
//     } catch (error: any) {
//       console.error(error);

//       const errorString =
//         error?.error?.message ||
//         error?.reason ||
//         error?.message ||
//         "Unknown error";

//       if (errorString.includes("Not authorized manager")) {
//         setMessage(
//           "❌ You Are Not An Authorized Manager, Can Only Be Unlocked By An Authorized Manager."
//         );
//       } else if (errorString.includes("User rejected the request")) {
//         setMessage("User rejected the request");
//       } else {
//         setMessage(`❌ Transaction failed: ${errorString}`);
//       }
//     }
//   }

//   async function transferNFT(
//     contractAddress: string,
//     tokenId: number,
//     to: string
//   ) {
//     try {
//       setMessage(`Transferring token ${tokenId}...`);
//       const provider = new ethers.providers.Web3Provider(window.ethereum);
//       const signer = provider.getSigner();
//       const lockableNFT = new ethers.Contract(
//         contractAddress,
//         ILockABI,
//         signer
//       );
//       const tx = await lockableNFT.transferFrom(
//         await signer.getAddress(),
//         to,
//         tokenId
//       );
//       await tx.wait();
//       setMessage(`✅ Transferred token ${tokenId}`);
//       await fetchAllNFTs();
//     } catch (error: any) {
//       console.error(error);

//       const errorString =
//         error?.error?.message ||
//         error?.reason ||
//         error?.message ||
//         "Unknown error";

//       if (errorString.includes("NFT is locked")) {
//         setMessage("❌ NFT is locked, Transfer is Disabled.");
//       } else if (errorString.includes("User rejected the request")) {
//         setMessage("User rejected the request");
//       } else {
//         setMessage(`❌ Transaction failed: ${errorString}`);
//       }
//     }
//   }

//   async function emergencyUnlockNFT(contractAddress: string, tokenId: number) {
//     try {
//       setMessage(`Emergency unlocking token ${tokenId}...`);
//       const provider = new ethers.providers.Web3Provider(window.ethereum);
//       const signer = provider.getSigner();
//       const lockableNFT = new ethers.Contract(
//         contractAddress,
//         ILockABI,
//         signer
//       );
//       const tx = await lockableNFT.emergencyUnlock(tokenId);
//       await tx.wait();
//       setMessage(`✅ Emergency unlocked token ${tokenId}`);
//       await fetchAllNFTs();
//     } catch (error: any) {
//       console.error(error);

//       const errorString =
//         error?.error?.message ||
//         error?.reason ||
//         error?.message ||
//         "Unknown error";

//       if (errorString.includes("Emergency unlock not allowed yet")) {
//         setMessage(
//           "❌ Emergency unlock is not allowed yet, wait until unlock time."
//         );
//       } else if (errorString.includes("User rejected the request")) {
//         setMessage("User rejected the request");
//       } else {
//         setMessage(`❌ Transaction failed: ${errorString}`);
//       }
//     }
//   }

//   async function mintNFT() {
//     try {
//       setMessage("Minting NFT...");
//       const provider = new ethers.providers.Web3Provider(window.ethereum);
//       const signer = provider.getSigner();
//       const lockableNFT = new ethers.Contract(
//         selectedCollection,
//         ILockABI,
//         signer
//       );
//       const tx = await lockableNFT.mint(await signer.getAddress());
//       await tx.wait();
//       setMessage("✅ Minted new NFT!");
//       await fetchAllNFTs();
//     } catch (error) {
//       console.error(error);
//       setMessage("❌ Mint failed");
//     }
//   }

//   // 🛠 Countdown Utility
//   function getCountdown(unlockTimestamp: number) {
//     const now = Math.floor(Date.now() / 1000);
//     const diff = unlockTimestamp - now;
//     if (diff <= 0) return "⏳ Unlockable now";
//     const days = Math.floor(diff / 86400);
//     const hours = Math.floor((diff % 86400) / 3600);
//     const minutes = Math.floor((diff % 3600) / 60);
//     const seconds = diff % 60;
//     return `${days}d ${hours}h ${minutes}m ${seconds}s`;
//   }

//   return (
//     <div className="min-h-screen p-8 bg-black-100">
//       <Tabs defaultValue="nfts" className="w-full">
//         <TabsList className="grid grid-cols-2 mb-6">
//           <TabsTrigger value="nfts">My NFTs</TabsTrigger>
//           <TabsTrigger value="mint">Mint NFTs</TabsTrigger>
//         </TabsList>

//         {/* 🖼 My NFTs Tab */}
//         <TabsContent value="nfts">
//           <h1 className="text-3xl font-bold mb-6">My Lockable NFTs</h1>

//           <div className="flex gap-3 mb-4">
//             <Button
//               onClick={() => setFilter("all")}
//               variant={filter === "all" ? "default" : "outline"}
//             >
//               All
//             </Button>
//             <Button
//               onClick={() => setFilter("locked")}
//               variant={filter === "locked" ? "default" : "outline"}
//             >
//               Locked
//             </Button>
//             <Button
//               onClick={() => setFilter("unlocked")}
//               variant={filter === "unlocked" ? "default" : "outline"}
//             >
//               Unlocked
//             </Button>
//           </div>

//           {loading && <p>Loading NFTs...</p>}
//           {message && <p className="text-blue-500 font-semibold">{message}</p>}

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {nfts
//               .filter((nft) => {
//                 if (filter === "locked") return nft.isLocked;
//                 if (filter === "unlocked") return !nft.isLocked;
//                 return true;
//               })
//               .map((nft) => {
//                 const unlockAt = nft.lockTimestamp + nft.duration;
//                 return (
//                   <div
//                     key={`${nft.collectionAddress}-${nft.tokenId}`}
//                     className="bg-black shadow-md rounded-lg p-6"
//                   >
//                     <h2 className="text-xl font-bold">
//                       Token ID: {nft.tokenId}
//                     </h2>
//                     <p className="text-sm text-gray-600 mb-2">
//                       {nft.collectionName}
//                     </p>
//                     <p>Status: {nft.isLocked ? "🔒 Locked" : "✅ Unlocked"}</p>
//                     {nft.isLocked && (
//                       <p className="text-xs mt-2 text-gray-500">
//                         ⏳ Unlocks in: {getCountdown(unlockAt)}
//                       </p>
//                     )}

//                     <div className="mt-4 flex flex-col gap-2">
//                       <Button
//                         onClick={() =>
//                           approveNFT(nft.collectionAddress, nft.tokenId)
//                         }
//                         disabled={nft.isLocked}
//                       >
//                         Approve
//                       </Button>

//                       {!nft.isLocked && (
//                         <div className="space-y-2">
//                           <Select
//                             value={lockDurations[nft.tokenId]?.toString() || ""}
//                             onValueChange={(val) =>
//                               setLockDurations((prev) => ({
//                                 ...prev,
//                                 [nft.tokenId]: val,
//                               }))
//                             }
//                           >
//                             <SelectTrigger>
//                               <SelectValue placeholder="Select lock duration" />
//                             </SelectTrigger>
//                             <SelectContent>
//                               <SelectItem value="2">2 minutes</SelectItem>
//                               <SelectItem value="5">5 minutes</SelectItem>
//                               <SelectItem value="15">15 minutes</SelectItem>
//                               <SelectItem value="60">1 hour</SelectItem>
//                               <SelectItem value="1440">1 day</SelectItem>
//                             </SelectContent>
//                           </Select>

//                           <input
//                             value={managerAddresses[nft.tokenId]}
//                             placeholder="Manager Address (optional)"
//                             className="w-full border p-2 rounded text-xs bg-white text-black"
//                             onChange={(e) =>
//                               setManagerAddresses((prev) => ({
//                                 ...prev,
//                                 [nft.tokenId]: e.target.value,
//                               }))
//                             }
//                           />

//                           <Button
//                             onClick={() =>
//                               lockNFT(
//                                 nft.collectionAddress,
//                                 nft.tokenId,
//                                 Number(lockDurations[nft.tokenId]),
//                                 managerAddresses[nft.tokenId]
//                               )
//                             }
//                           >
//                             Lock
//                           </Button>
//                         </div>
//                       )}

//                       {nft.isLocked && (
//                         <>
//                           <Button
//                             onClick={() =>
//                               unlockNFT(nft.collectionAddress, nft.tokenId)
//                             }
//                           >
//                             Unlock
//                           </Button>
//                           <Button
//                             onClick={() =>
//                               emergencyUnlockNFT(
//                                 nft.collectionAddress,
//                                 nft.tokenId
//                               )
//                             }
//                           >
//                             Emergency Unlock
//                           </Button>
//                         </>
//                       )}

//                       {/* Transfer */}
//                       <input
//                         value={transferAddresses[nft.tokenId]}
//                         placeholder="Transfer to address"
//                         className="w-full border p-2 rounded text-xs bg-white text-black"
//                         onChange={(e) =>
//                           setTransferAddresses((prev) => ({
//                             ...prev,
//                             [nft.tokenId]: e.target.value,
//                           }))
//                         }
//                       />
//                       <Button
//                         disabled={nft.isLocked}
//                         onClick={() => {
//                           const toAddress = transferAddresses[nft.tokenId];
//                           if (!toAddress) {
//                             alert("Please enter a transfer address");
//                             return;
//                           }
//                           transferNFT(
//                             nft.collectionAddress,
//                             nft.tokenId,
//                             toAddress
//                           );
//                         }}
//                       >
//                         Transfer
//                       </Button>

//                       {/* Unlock and Transfer */}
//                       <input
//                         placeholder="Unlock & Transfer to Address"
//                         className="w-full border p-2 rounded text-xs bg-white text-black"
//                         value={transferAddresses[nft.tokenId] || ""}
//                         onChange={(e) =>
//                           setTransferAddresses((prev) => ({
//                             ...prev,
//                             [nft.tokenId]: e.target.value,
//                           }))
//                         }
//                       />
//                       <Button
//                         onClick={async () => {
//                           const to = transferAddresses[nft.tokenId];
//                           if (!to) {
//                             alert("Please enter a destination address");
//                             return;
//                           }

//                           try {
//                             setMessage(
//                               `Unlocking and transferring token ${nft.tokenId}...`
//                             );
//                             const provider = new ethers.providers.Web3Provider(
//                               window.ethereum
//                             );
//                             const signer = provider.getSigner();
//                             const lockableNFT = new ethers.Contract(
//                               nft.collectionAddress,
//                               ILockABI,
//                               signer
//                             );
//                             const tx = await lockableNFT.unlockAndTransfer(
//                               to,
//                               nft.tokenId
//                             );
//                             await tx.wait();
//                             setMessage(
//                               `✅ Unlocked and Transferred token ${nft.tokenId}`
//                             );
//                             await fetchAllNFTs();
//                           } catch (error: any) {
//                             console.error(error);
//                             const errorString =
//                               error?.error?.message ||
//                               error?.reason ||
//                               error?.message ||
//                               "Unknown error";

//                             setMessage(`❌ Transaction failed: ${errorString}`);
//                           }
//                         }}
//                       >
//                         Unlock & Transfer
//                       </Button>

//                       {/* Lock Info Modal */}
//                       <LockInfoModal
//                         contractAddress={nft.collectionAddress}
//                         tokenId={nft.tokenId}
//                       />
//                     </div>
//                   </div>
//                 );
//               })}
//           </div>
//         </TabsContent>

//         {/* 🛠 Mint NFTs Tab */}
//         <TabsContent value="mint">
//           <h1 className="text-3xl font-bold mb-6">Mint Lockable NFTs</h1>

//           <div className="max-w-md space-y-4">
//             <Select
//               value={selectedCollection}
//               onValueChange={setSelectedCollection}
//             >
//               <SelectTrigger>
//                 <SelectValue placeholder="Select Collection" />
//               </SelectTrigger>
//               <SelectContent>
//                 {SUPPORTED_LOCKABLE_COLLECTIONS.map((collection) => (
//                   <SelectItem
//                     key={collection.address}
//                     value={collection.address}
//                   >
//                     {collection.name}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>

//             <Button onClick={mintNFT}>Mint NFT</Button>
//             {message && (
//               <p className="text-blue-500 mt-4 font-semibold">{message}</p>
//             )}
//           </div>
//         </TabsContent>
//       </Tabs>
//     </div>
//   );
// }

// // ✅ LockInfoModal Component (same from before, paste below)
// function LockInfoModal({
//   contractAddress,
//   tokenId,
// }: {
//   contractAddress: string;
//   tokenId: number;
// }) {
//   const [open, setOpen] = useState(false);
//   const [lockData, setLockData] = useState<any>(null);

//   async function fetchLockInfo() {
//     const provider = new ethers.providers.Web3Provider(window.ethereum);
//     const signer = provider.getSigner();
//     const lockableNFT = new ethers.Contract(contractAddress, ILockABI, signer);

//     const [locked, manager, lockTimestamp, duration] =
//       await lockableNFT.getLockInfo(tokenId);
//     setLockData({
//       locked,
//       manager,
//       lockTimestamp: Number(lockTimestamp),
//       duration: Number(duration),
//     });
//   }

//   return (
//     <Dialog.Root open={open} onOpenChange={setOpen}>
//       <Dialog.Trigger asChild>
//         <Button variant="outline" className="w-full">
//           View Lock Info
//         </Button>
//       </Dialog.Trigger>

//       <Dialog.Portal>
//         <Dialog.Overlay className="bg-black/30 fixed inset-0" />
//         <Dialog.Content className="fixed top-1/2 left-1/2 w-[90%] max-w-md bg-white p-6 rounded-lg shadow-lg -translate-x-1/2 -translate-y-1/2">
//           <Dialog.Title className="text-xl font-bold mb-4">
//             Lock Info for Token {tokenId}
//           </Dialog.Title>

//           {lockData ? (
//             <div className="space-y-2 text-sm text-gray-700">
//               <p>
//                 <strong>Status:</strong>{" "}
//                 {lockData.locked ? "🔒 Locked" : "✅ Unlocked"}
//               </p>
//               <p>
//                 <strong>Manager:</strong> {lockData.manager}
//               </p>
//               <p>
//                 <strong>Lock Timestamp:</strong>{" "}
//                 {new Date(lockData.lockTimestamp * 1000).toLocaleString()}
//               </p>
//               <p>
//                 <strong>Duration:</strong> {Math.floor(lockData.duration / 60)}{" "}
//                 mins ({(lockData.duration / 86400).toFixed(2)} days)
//               </p>
//               <p>
//                 <strong>Unlocks At:</strong>{" "}
//                 {new Date(
//                   (lockData.lockTimestamp + lockData.duration) * 1000
//                 ).toLocaleString()}
//               </p>
//             </div>
//           ) : (
//             <p className="text-gray-500">Click fetch info.</p>
//           )}

//           <div className="flex justify-end mt-4 gap-2">
//             <Button onClick={fetchLockInfo}>Fetch Info</Button>
//             <Dialog.Close asChild>
//               <Button variant="outline">Close</Button>
//             </Dialog.Close>
//           </div>
//         </Dialog.Content>
//       </Dialog.Portal>
//     </Dialog.Root>
//   );
// }
