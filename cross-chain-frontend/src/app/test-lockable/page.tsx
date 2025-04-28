"use client";

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

// ✅ Hardcoded Collections
const SUPPORTED_LOCKABLE_COLLECTIONS = [
  //   {
  //     name: "Lockable Collection TEST 1",
  //     address: "0xC840DA9957d641684Fc05565A9756df872879889",
  //   },
  {
    name: "Lockable Collection TEST 2",
    address: "0x92B6222e22C114fA11985F1173a423b8Ab0059E6",
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

  return (
    <div className="min-h-screen p-8 bg-black-100">
      <Tabs defaultValue="nfts" className="w-full">
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="nfts">My NFTs</TabsTrigger>
          <TabsTrigger value="mint">Mint NFTs</TabsTrigger>
        </TabsList>

        {/* 🖼 My NFTs Tab */}
        <TabsContent value="nfts">
          <h1 className="text-3xl font-bold mb-6">My Lockable NFTs</h1>

          <div className="flex gap-3 mb-4">
            <Button
              onClick={() => setFilter("all")}
              variant={filter === "all" ? "default" : "outline"}
            >
              All
            </Button>
            <Button
              onClick={() => setFilter("locked")}
              variant={filter === "locked" ? "default" : "outline"}
            >
              Locked
            </Button>
            <Button
              onClick={() => setFilter("unlocked")}
              variant={filter === "unlocked" ? "default" : "outline"}
            >
              Unlocked
            </Button>
          </div>

          {loading && <p>Loading NFTs...</p>}
          {message && <p className="text-blue-500 font-semibold">{message}</p>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {nfts
              .filter((nft) => {
                if (filter === "locked") return nft.isLocked;
                if (filter === "unlocked") return !nft.isLocked;
                return true;
              })
              .map((nft) => {
                const unlockAt = nft.lockTimestamp + nft.duration;
                return (
                  <div
                    key={`${nft.collectionAddress}-${nft.tokenId}`}
                    className="bg-black shadow-md rounded-lg p-6"
                  >
                    <h2 className="text-xl font-bold">
                      Token ID: {nft.tokenId}
                    </h2>
                    <p className="text-sm text-gray-600 mb-2">
                      {nft.collectionName}
                    </p>
                    <p>Status: {nft.isLocked ? "🔒 Locked" : "✅ Unlocked"}</p>
                    {nft.isLocked && (
                      <p className="text-xs mt-2 text-gray-500">
                        ⏳ Unlocks in: {getCountdown(unlockAt)}
                      </p>
                    )}

                    <div className="mt-4 flex flex-col gap-2">
                      <Button
                        onClick={() =>
                          approveNFT(nft.collectionAddress, nft.tokenId)
                        }
                        disabled={nft.isLocked}
                      >
                        Approve
                      </Button>

                      {!nft.isLocked && (
                        <div className="space-y-2">
                          <Select
                            value={lockDurations[nft.tokenId]?.toString() || ""}
                            onValueChange={(val) =>
                              setLockDurations((prev) => ({
                                ...prev,
                                [nft.tokenId]: val,
                              }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select lock duration" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="2">2 minutes</SelectItem>
                              <SelectItem value="5">5 minutes</SelectItem>
                              <SelectItem value="15">15 minutes</SelectItem>
                              <SelectItem value="60">1 hour</SelectItem>
                              <SelectItem value="1440">1 day</SelectItem>
                            </SelectContent>
                          </Select>

                          <input
                            value={managerAddresses[nft.tokenId]}
                            placeholder="Manager Address (optional)"
                            className="w-full border p-2 rounded text-xs bg-white text-black"
                            onChange={(e) =>
                              setManagerAddresses((prev) => ({
                                ...prev,
                                [nft.tokenId]: e.target.value,
                              }))
                            }
                          />

                          <Button
                            onClick={() =>
                              lockNFT(
                                nft.collectionAddress,
                                nft.tokenId,
                                Number(lockDurations[nft.tokenId]),
                                managerAddresses[nft.tokenId]
                              )
                            }
                          >
                            Lock
                          </Button>
                        </div>
                      )}

                      {nft.isLocked && (
                        <>
                          <Button
                            onClick={() =>
                              unlockNFT(nft.collectionAddress, nft.tokenId)
                            }
                          >
                            Unlock
                          </Button>
                          <Button
                            onClick={() =>
                              emergencyUnlockNFT(
                                nft.collectionAddress,
                                nft.tokenId
                              )
                            }
                          >
                            Emergency Unlock
                          </Button>
                        </>
                      )}

                      {/* Transfer */}
                      <input
                        value={transferAddresses[nft.tokenId]}
                        placeholder="Transfer to address"
                        className="w-full border p-2 rounded text-xs bg-white text-black"
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
                          const toAddress = transferAddresses[nft.tokenId];
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
                      >
                        Transfer
                      </Button>

                      {/* Unlock and Transfer */}
                      <input
                        placeholder="Unlock & Transfer to Address"
                        className="w-full border p-2 rounded text-xs bg-white text-black"
                        value={transferAddresses[nft.tokenId] || ""}
                        onChange={(e) =>
                          setTransferAddresses((prev) => ({
                            ...prev,
                            [nft.tokenId]: e.target.value,
                          }))
                        }
                      />
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
                            const provider = new ethers.providers.Web3Provider(
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

                            setMessage(`❌ Transaction failed: ${errorString}`);
                          }
                        }}
                      >
                        Unlock & Transfer
                      </Button>

                      {/* Lock Info Modal */}
                      <LockInfoModal
                        contractAddress={nft.collectionAddress}
                        tokenId={nft.tokenId}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </TabsContent>

        {/* 🛠 Mint NFTs Tab */}
        <TabsContent value="mint">
          <h1 className="text-3xl font-bold mb-6">Mint Lockable NFTs</h1>

          <div className="max-w-md space-y-4">
            <Select
              value={selectedCollection}
              onValueChange={setSelectedCollection}
            >
              <SelectTrigger>
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

            <Button onClick={mintNFT}>Mint NFT</Button>
            {message && (
              <p className="text-blue-500 mt-4 font-semibold">{message}</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ✅ LockInfoModal Component (same from before, paste below)
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
        <Button variant="outline" className="w-full">
          View Lock Info
        </Button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/30 fixed inset-0" />
        <Dialog.Content className="fixed top-1/2 left-1/2 w-[90%] max-w-md bg-white p-6 rounded-lg shadow-lg -translate-x-1/2 -translate-y-1/2">
          <Dialog.Title className="text-xl font-bold mb-4">
            Lock Info for Token {tokenId}
          </Dialog.Title>

          {lockData ? (
            <div className="space-y-2 text-sm text-gray-700">
              <p>
                <strong>Status:</strong>{" "}
                {lockData.locked ? "🔒 Locked" : "✅ Unlocked"}
              </p>
              <p>
                <strong>Manager:</strong> {lockData.manager}
              </p>
              <p>
                <strong>Lock Timestamp:</strong>{" "}
                {new Date(lockData.lockTimestamp * 1000).toLocaleString()}
              </p>
              <p>
                <strong>Duration:</strong> {Math.floor(lockData.duration / 60)}{" "}
                mins ({(lockData.duration / 86400).toFixed(2)} days)
              </p>
              <p>
                <strong>Unlocks At:</strong>{" "}
                {new Date(
                  (lockData.lockTimestamp + lockData.duration) * 1000
                ).toLocaleString()}
              </p>
            </div>
          ) : (
            <p className="text-gray-500">Click fetch info.</p>
          )}

          <div className="flex justify-end mt-4 gap-2">
            <Button onClick={fetchLockInfo}>Fetch Info</Button>
            <Dialog.Close asChild>
              <Button variant="outline">Close</Button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

//////////////////////////////////////////////////////////////////////////
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

// // Hardcoded supported LockableNFT collections
// const SUPPORTED_LOCKABLE_COLLECTIONS = [
//   {
//     name: "Lockable Collection TEST 1",
//     address: "0xC840DA9957d641684Fc05565A9756df872879889",
//   },
//   {
//     name: "Lockable Collection TEST 2",
//     address: "0x6d8aE7ab4Ac095a00eAd172991dCb63bCb0C9176",
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
//   const [lockDurations, setLockDurations] = useState<Record<number, number>>(
//     {}
//   ); // new!

//   useEffect(() => {
//     if (authenticated && ready) {
//       fetchAllNFTs();
//     }
//   }, [authenticated, user]);

//   async function fetchAllNFTs() {
//     if (!user?.wallet?.address) return;
//     try {
//       setLoading(true);
//       setMessage("");

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
//             const isLocked = await contract.isLocked(tokenId);

//             allNFTs.push({
//               collectionName: collection.name,
//               collectionAddress: collection.address,
//               tokenId: Number(tokenId),
//               isLocked: isLocked,
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
//     } catch (error) {
//       console.error(error);
//       setMessage(`❌ Failed to approve token ${tokenId}`);
//     }
//   }

//   async function lockNFT(
//     contractAddress: string,
//     tokenId: number,
//     selectedMinutes?: number
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

//       const minutes = selectedMinutes || 2; // fallback to 2 minutes
//       const durationInSeconds = minutes * 60;

//       const tx = await lockableNFT.lock(
//         tokenId,
//         await signer.getAddress(),
//         durationInSeconds
//       );
//       await tx.wait();
//       setMessage(`✅ Locked token ${tokenId}`);
//       await fetchAllNFTs(); // Refresh NFTs after lock
//     } catch (error) {
//       console.error(error);
//       setMessage(`❌ Failed to lock token ${tokenId}`);
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
//     } catch (error) {
//       console.error(error);
//       setMessage(`❌ Failed to unlock token ${tokenId}`);
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
//     } catch (error) {
//       console.error(error);
//       setMessage(`❌ Failed emergency unlock for token ${tokenId}`);
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

//           {loading && <p>Loading NFTs...</p>}
//           {message && <p className="text-blue-500 font-semibold">{message}</p>}

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {nfts.map((nft) => (
//               <div
//                 key={`${nft.collectionAddress}-${nft.tokenId}`}
//                 className="bg-monad shadow-md rounded-lg p-6"
//               >
//                 <h2 className="text-xl font-bold">Token ID: {nft.tokenId}</h2>
//                 <p className="text-sm text-gray-600 mb-2">
//                   {nft.collectionName}
//                 </p>
//                 <p>Status: {nft.isLocked ? "🔒 Locked" : "✅ Unlocked"}</p>

//                 <div className="mt-4 flex flex-col gap-2">
//                   <Button
//                     onClick={() =>
//                       approveNFT(nft.collectionAddress, nft.tokenId)
//                     }
//                     disabled={nft.isLocked}
//                   >
//                     Approve
//                   </Button>

//                   {!nft.isLocked && (
//                     <div className="space-y-2">
//                       <Select
//                         value={lockDurations[nft.tokenId]?.toString() || ""}
//                         onValueChange={(val) =>
//                           setLockDurations((prev) => ({
//                             ...prev,
//                             [nft.tokenId]: Number(val),
//                           }))
//                         }
//                       >
//                         <SelectTrigger>
//                           <SelectValue placeholder="Select lock duration" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           <SelectItem value="2">2 minutes</SelectItem>
//                           <SelectItem value="5">5 minutes</SelectItem>
//                           <SelectItem value="15">15 minutes</SelectItem>
//                           <SelectItem value="60">1 hour</SelectItem>
//                           <SelectItem value="1440">1 day</SelectItem>
//                         </SelectContent>
//                       </Select>

//                       <Button
//                         onClick={() =>
//                           lockNFT(
//                             nft.collectionAddress,
//                             nft.tokenId,
//                             lockDurations[nft.tokenId]
//                           )
//                         }
//                       >
//                         Lock
//                       </Button>
//                     </div>
//                   )}

//                   {nft.isLocked && (
//                     <>
//                       <Button
//                         onClick={() =>
//                           unlockNFT(nft.collectionAddress, nft.tokenId)
//                         }
//                       >
//                         Unlock
//                       </Button>
//                       <Button
//                         onClick={() =>
//                           emergencyUnlockNFT(nft.collectionAddress, nft.tokenId)
//                         }
//                       >
//                         Emergency Unlock
//                       </Button>
//                     </>
//                   )}
//                 </div>
//               </div>
//             ))}
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

// ///////////////////////////////////////////////////////////////////////////////////////
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
// import { Input } from "@/Components/privy/ui/input";

// // ✅ Hardcoded supported LockableNFT collections
// const SUPPORTED_LOCKABLE_COLLECTIONS = [
//   {
//     name: "Lockable Collection TEST 1",
//     address: "0xC840DA9957d641684Fc05565A9756df872879889",
//   },
//   {
//     name: "Lockable Collection TEST 2",
//     address: "0x6d8aE7ab4Ac095a00eAd172991dCb63bCb0C9176",
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
//   const [lockDurations, setLockDurations] = useState<Record<number, number>>(
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
//       setMessage("");

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
//             const isLocked = await contract.isLocked(tokenId);

//             allNFTs.push({
//               collectionName: collection.name,
//               collectionAddress: collection.address,
//               tokenId: Number(tokenId),
//               isLocked: isLocked,
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
//     } catch (error) {
//       console.error(error);
//       setMessage(`❌ Failed to approve token ${tokenId}`);
//     }
//   }

//   async function lockNFT(contractAddress: string, tokenId: number) {
//     try {
//       const manager =
//         managerAddresses[tokenId] ||
//         (await new ethers.providers.Web3Provider(window.ethereum)
//           .getSigner()
//           .getAddress());
//       const minutes = lockDurations[tokenId] || 2; // fallback 2 mins
//       const durationInSeconds = minutes * 60;

//       setMessage(`Locking token ${tokenId}...`);
//       const provider = new ethers.providers.Web3Provider(window.ethereum);
//       const signer = provider.getSigner();
//       const lockableNFT = new ethers.Contract(
//         contractAddress,
//         ILockABI,
//         signer
//       );

//       const tx = await lockableNFT.lock(tokenId, manager, durationInSeconds);
//       await tx.wait();
//       setMessage(`✅ Locked token ${tokenId}`);
//       await fetchAllNFTs();
//     } catch (error) {
//       console.error(error);
//       setMessage(`❌ Failed to lock token ${tokenId}`);
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
//     } catch (error) {
//       console.error(error);
//       setMessage(`❌ Failed to unlock token ${tokenId}`);
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
//     } catch (error) {
//       console.error(error);
//       setMessage(`❌ Failed emergency unlock for token ${tokenId}`);
//     }
//   }

//   async function transferNFT(contractAddress: string, tokenId: number) {
//     try {
//       const recipient = transferAddresses[tokenId];
//       if (!recipient) {
//         setMessage("❌ Please enter recipient address first.");
//         return;
//       }

//       setMessage(`Transferring token ${tokenId} to ${recipient}...`);
//       const provider = new ethers.providers.Web3Provider(window.ethereum);
//       const signer = provider.getSigner();
//       const lockableNFT = new ethers.Contract(
//         contractAddress,
//         ILockABI,
//         signer
//       );

//       const tx = await lockableNFT.transferFrom(
//         await signer.getAddress(),
//         recipient,
//         tokenId
//       );
//       await tx.wait();
//       setMessage(`✅ Transferred token ${tokenId} to ${recipient}`);
//       await fetchAllNFTs();
//     } catch (error) {
//       console.error(error);
//       setMessage(`❌ Failed to transfer token ${tokenId}`);
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

//           {loading && <p>Loading NFTs...</p>}
//           {message && <p className="text-blue-500 font-semibold">{message}</p>}

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {nfts.map((nft) => (
//               <div
//                 key={`${nft.collectionAddress}-${nft.tokenId}`}
//                 className="bg-monad shadow-md rounded-lg p-6 space-y-3"
//               >
//                 <h2 className="text-xl font-bold">Token ID: {nft.tokenId}</h2>
//                 <p className="text-sm text-gray-600 mb-2">
//                   {nft.collectionName}
//                 </p>
//                 <p>Status: {nft.isLocked ? "🔒 Locked" : "✅ Unlocked"}</p>

//                 <div className="flex flex-col gap-2">
//                   <Button
//                     onClick={() =>
//                       approveNFT(nft.collectionAddress, nft.tokenId)
//                     }
//                     disabled={nft.isLocked}
//                   >
//                     Approve
//                   </Button>

//                   {!nft.isLocked && (
//                     <>
//                       <Input
//                         placeholder="Manager address (optional)"
//                         value={managerAddresses[nft.tokenId] || ""}
//                         onChange={(e) =>
//                           setManagerAddresses((prev) => ({
//                             ...prev,
//                             [nft.tokenId]: e.target.value,
//                           }))
//                         }
//                       />
//                       <Select
//                         value={lockDurations[nft.tokenId]?.toString() || ""}
//                         onValueChange={(val) =>
//                           setLockDurations((prev) => ({
//                             ...prev,
//                             [nft.tokenId]: Number(val),
//                           }))
//                         }
//                       >
//                         <SelectTrigger>
//                           <SelectValue placeholder="Select lock duration" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           <SelectItem value="2">2 minutes</SelectItem>
//                           <SelectItem value="5">5 minutes</SelectItem>
//                           <SelectItem value="15">15 minutes</SelectItem>
//                           <SelectItem value="60">1 hour</SelectItem>
//                           <SelectItem value="1440">1 day</SelectItem>
//                         </SelectContent>
//                       </Select>

//                       <Button
//                         onClick={() =>
//                           lockNFT(nft.collectionAddress, nft.tokenId)
//                         }
//                       >
//                         Lock
//                       </Button>

//                       <Input
//                         placeholder="Recipient wallet address"
//                         value={transferAddresses[nft.tokenId] || ""}
//                         onChange={(e) =>
//                           setTransferAddresses((prev) => ({
//                             ...prev,
//                             [nft.tokenId]: e.target.value,
//                           }))
//                         }
//                       />
//                       <Button
//                         onClick={() =>
//                           transferNFT(nft.collectionAddress, nft.tokenId)
//                         }
//                       >
//                         Transfer
//                       </Button>
//                     </>
//                   )}

//                   {nft.isLocked && (
//                     <>
//                       <Button
//                         onClick={() =>
//                           unlockNFT(nft.collectionAddress, nft.tokenId)
//                         }
//                       >
//                         Unlock
//                       </Button>

//                       {/* <LockInfoModal contractAddress={nft.collectionAddress} tokenId={nft.tokenId} /> */}

//                       <Button
//                         onClick={() =>
//                           emergencyUnlockNFT(nft.collectionAddress, nft.tokenId)
//                         }
//                       >
//                         Emergency Unlock
//                       </Button>
//                     </>
//                   )}
//                 </div>
//               </div>
//             ))}
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

///////////////////////////////////////////////////////////////////////
