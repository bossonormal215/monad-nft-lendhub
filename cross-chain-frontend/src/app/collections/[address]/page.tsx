"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  getPendingListings,
  type LoanData,
} from "@/components/lib/contract-utils";
import { fetchSupportedCollections } from "@/components/utils/collections";
import { NFTCard } from "@/components/nft-card";
import { Loader2 } from "lucide-react";
import { Card } from "@/Components/privy/ui/card";
import { useAccount, useWriteContract } from "wagmi";
import { useToast } from "@/Components/privy/ui/use-toast";
import { usePrivy } from "@privy-io/react-auth";
import {
  ERC20_ABI,
  NFT_LENDHUB_ABI,
  NFT_LENDHUB_ADDRESS,
} from "@/components/lib/constants";
import { SelectNFTModal, NFT } from "@/components/SelectNFTModal";
import { Button } from "@/Components/privy/ui/button";
import { Label } from "@/Components/privy/ui/label";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/Components/privy/ui/tabs";
import { createPublicClient, formatEther, http } from "viem";
import { readContract } from "viem/actions";
import { monadTestnet } from "viem/chains";
import Image from "next/image";
import router from "next/router";
import { LoanDetailsModal } from "@/components/LoanDetailsModal";

export default function CollectionDetailPage() {
  const { address } = useParams();
  const collectionAddress = address as string;

  const { address: userAddress } = useAccount();
  const { authenticated, login } = usePrivy();
  const { toast } = useToast();

  const [collection, setCollection] = useState<any>(null);
  const [loans, setLoans] = useState<LoanData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLoanIndex, setSelectedLoanIndex] = useState<number | null>(
    null
  );
  const [isFunding, setIsFunding] = useState(false);
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);
  const [userNFTs, setUserNFTs] = useState<NFT[]>([]);
  const [tab, setTab] = useState("listed");
  const [modalLoan, setModalLoan] = useState<LoanData | null>(null);
  const [isBorrowing, setIsBorrowing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const { writeContractAsync: approveToken } = useWriteContract();
  const { writeContractAsync: fundLoan } = useWriteContract();

  const client = createPublicClient({
    chain: monadTestnet,
    transport: http(
      process.env.NEXT_PUBLIC_MONAD_TESTNET_RPC ||
        "https://testnet-rpc.monad.xyz"
    ),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const collections = await fetchSupportedCollections();
        const target = collections.find(
          (col) =>
            col.contractAddress.toLowerCase() ===
            collectionAddress.toLowerCase()
        );
        setCollection(target || null);

        const allLoans = await getPendingListings();
        const matchingLoans = allLoans.filter(
          (loan) =>
            loan.nftAddress.toLowerCase() === collectionAddress.toLowerCase()
        );
        setLoans(matchingLoans);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [collectionAddress]);

  useEffect(() => {
    if (!userAddress) return;
    const fetchWalletNFTs = async () => {
      try {
        const res = await fetch(`/api/nfts?wallet=${userAddress}`);
        const allNFTs = await res.json();
        const filtered = allNFTs.filter(
          (nft: NFT) =>
            nft.contractAddress.toLowerCase() ===
            collectionAddress.toLowerCase()
        );
        setUserNFTs(filtered);
      } catch (e) {
        console.error("Failed to fetch wallet NFTs");
      }
    };

    fetchWalletNFTs();
  }, [userAddress, collectionAddress]);

  const handleFund = async (loan: LoanData, index: number) => {
    if (!authenticated) await login();
    if (!userAddress)
      return toast({ title: "Wallet not connected", variant: "destructive" });

    try {
      setIsFunding(true);
      setSelectedLoanIndex(index);

      const rawBalance = await readContract(client, {
        address: loan.loanToken as `0x${string}`,
        abi: ERC20_ABI,
        functionName: "balanceOf",
        args: [userAddress],
      });

      const userBalance = rawBalance as bigint;
      if (userBalance < loan.loanAmount) {
        const balanceFormatted = Number(formatEther(userBalance)).toFixed(2);
        const neededFormatted = Number(formatEther(loan.loanAmount)).toFixed(2);
        toast({
          title: "Insufficient Balance",
          description: `You have ${balanceFormatted} wMON but need ${neededFormatted} wMON`,
          variant: "destructive",
        });
        return;
      }

      await approveToken({
        address: loan.loanToken as `0x${string}`,
        abi: ERC20_ABI,
        functionName: "approve",
        args: [NFT_LENDHUB_ADDRESS, loan.loanAmount],
      });

      await fundLoan({
        address: NFT_LENDHUB_ADDRESS,
        abi: NFT_LENDHUB_ABI,
        functionName: "fundLoan",
        args: [loan.loanId],
      });

      toast({ title: "Success", description: "Loan funded!" });
      setLoans((prev) => prev.filter((_, i) => i !== index));
    } catch (error: any) {
      console.error("Funding failed:", error);
      toast({
        title: "Error",
        description: error.message || "Funding failed",
        variant: "destructive",
      });
    } finally {
      setIsFunding(false);
      setSelectedLoanIndex(null);
    }
  };

  const handleNFTSelect = (nft: NFT) => {
    setSelectedNFT(nft);
    toast({
      title: "NFT selected",
      description: `NFT #${nft.tokenId} ready to be listed`,
    });
    // redirect to borrow
    window.location.href = `/borrow?nft=${nft.contractAddress}:${nft.tokenId}`;
  };

  const handleModalAction = async (action: string) => {
    if (!modalLoan) return;

    if (action === "fundLoan") {
      const index = loans.findIndex((l) => l.loanId === modalLoan.loanId);
      if (index !== -1) {
        await handleFund(modalLoan, index);
      }
    } else {
      toast({
        title: "Not Available",
        description: `Action "${action}" is not supported here.`,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container py-8">
      {collection ? (
        <>
          <h1 className="text-3xl font-bold mb-2">{collection.name}</h1>
          <p className="text-muted-foreground mb-4">
            Floor Price: {collection.floorPrice} wMON{" "}
            {collection.verified && (
              <span className="text-green-500 ml-2">✔ Verified</span>
            )}
          </p>
        </>
      ) : (
        <p className="text-foreground mb-4">Collection not found.</p>
      )}

      <Tabs defaultValue="listed" onValueChange={setTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="listed">Listed NFTs</TabsTrigger>
          <TabsTrigger value="wallet">Your Holdings</TabsTrigger>
        </TabsList>

        <TabsContent value="listed">
          {loading ? (
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="h-48 animate-pulse bg-muted" />
              ))}
            </div>
          ) : loans.length === 0 ? (
            <p className="text-muted-foreground">
              No NFTs listed for loan from this collection.
            </p>
          ) : (
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
              {loans.map((loan, i) => (
                <NFTCard
                  key={loan.loanId.toString()}
                  loanId={loan.loanId}
                  nftId={Number(loan.nftId)}
                  nftAddress={loan.nftAddress}
                  nftOwner={loan.nftOwner}
                  loanAmount={loan.loanAmount}
                  interestRate={Number(loan.interestRate)}
                  loanDuration={Number(loan.loanDuration)}
                  startTime={Number(loan.startTime)}
                  repaid={loan.repaid}
                  lender={loan.lender}
                  loanToken={loan.loanToken}
                  active={loan.active}
                  completed={loan.completed}
                  onAction={() => handleFund(loan, i)}
                  actionText="Fund Loan"
                  actionDisabled={false}
                  isProcessing={isFunding && selectedLoanIndex === i}
                  onClick={() => {
                    setModalLoan(loan);
                    setIsBorrowing(false);
                  }}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="wallet">
          {/* <div className="space-y-2 mb-4">
            <Label className="text-sm text-muted-foreground">
              Select NFT from Wallet
            </Label>
            <SelectNFTModal onSelect={handleNFTSelect} />
          </div> */}

          {userNFTs.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No NFTs owned from this collection.
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {userNFTs.map((nft) => (
                <div
                  key={nft.tokenId}
                  className="border bg-muted rounded overflow-hidden cursor-pointer hover:ring-2 ring-monad-500"
                  onClick={() => handleNFTSelect(nft)}
                >
                  <div className="relative w-full h-24">
                    <Image
                      src={nft.imageUrl}
                      alt={nft.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-2 text-xs">
                    <p className="font-medium truncate">{nft.name}</p>
                    <p className="text-muted-foreground text-[10px] truncate">
                      ID: {nft.tokenId}
                    </p>

                    <Button
                      variant="outline"
                      className="text-xs w-full mt-2"
                      onClick={() =>
                        router.push(
                          `/borrow?nft=${nft.contractAddress}:${nft.tokenId}`
                        )
                      }
                    >
                      List for Loan
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {modalLoan && (
        <LoanDetailsModal
          isOpen={!!modalLoan}
          onClose={() => setModalLoan(null)}
          loan={modalLoan}
          onAction={handleModalAction}
          isProcessing={isFunding}
          isBorrowing={isBorrowing}
        />
      )}
    </div>
  );
}

//////////////////////////////////////---------------------------------------------/////////////////
// "use client"

// import { useEffect, useState } from "react"
// import { useParams } from "next/navigation"
// import { getPendingListings, type LoanData } from "@/components/lib/contract-utils"
// import { fetchSupportedCollections } from "@/components/utils/collections"
// import { NFTCard } from "@/components/nft-card"
// import { Loader2 } from "lucide-react"
// import { Card, CardContent } from "@/Components/privy/ui/card"
// import { useAccount, useWriteContract, useReadContract } from "wagmi"
// import { useToast } from "@/Components/privy/ui/use-toast"
// import { usePrivy } from "@privy-io/react-auth"
// import { ERC20_ABI, NFT_LENDHUB_ABI, NFT_LENDHUB_ADDRESS } from "@/components/lib/constants"
// import { SelectNFTModal, NFT } from "@/components/SelectNFTModal"
// import { Button } from "@/Components/privy/ui/button"
// import { Label } from "@/Components/privy/ui/label"
// import { useConnect } from "wagmi"
// import { createPublicClient, formatEther, formatUnits, http } from 'viem';
// import { readContract } from "viem/actions"
// import { mainnet, monadTestnet } from "viem/chains"

// export default function CollectionDetailPage() {
//   const { address } = useParams()
//   const collectionAddress = address as string

//   const { address: userAddress } = useAccount()
//   const { authenticated, login } = usePrivy()
//   const { connectAsync, connectors } = useConnect()
//   const { toast } = useToast()

//   const [collection, setCollection] = useState<any>(null)
//   const [loans, setLoans] = useState<LoanData[]>([])
//   const [loading, setLoading] = useState(true)
//   const [selectedLoanIndex, setSelectedLoanIndex] = useState<number | null>(null)
//   const [isFunding, setIsFunding] = useState(false)

//   const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null)

//   const { writeContractAsync: approveToken } = useWriteContract()
//   const { writeContractAsync: fundLoan } = useWriteContract()

//   const client = createPublicClient({
//     chain: monadTestnet,
//     transport: http(
//       process.env.NEXT_PUBLIC_MONAD_TESTNET_RPC ||
//         'https://testnet-rpc.monad.xyz'
//     ),
//   })

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const collections = await fetchSupportedCollections()
//         const target = collections.find((col) => col.contractAddress.toLowerCase() === collectionAddress.toLowerCase())
//         setCollection(target || null)

//         const allLoans = await getPendingListings()
//         const matchingLoans = allLoans.filter((loan) => loan.nftAddress.toLowerCase() === collectionAddress.toLowerCase())
//         setLoans(matchingLoans)
//       } catch (err) {
//         console.error(err)
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchData()
//   }, [collectionAddress])

//   const handleFund = async (loan: LoanData, index: number) => {
//     if (!authenticated) {
//       login()
//       // return
//     }

//     if (!userAddress) {
//       const connector = connectors[0]
//       await connectAsync({ connector })
//     }

//     try {
//       setIsFunding(true)
//       setSelectedLoanIndex(index)

//       // ✅ Get user's balance dynamically
//     const rawBalance = await readContract(client, {
//       address: loan.loanToken as `0x${string}`,
//       abi: ERC20_ABI,
//       functionName: "balanceOf",
//       args: [userAddress],
//     })

//     const userBalance = rawBalance as bigint

//       if (userBalance < loan.loanAmount) {
//         const balanceFormatted = Number(formatEther(userBalance)).toFixed(2)
//         const neededFormatted = Number(formatEther(loan.loanAmount)).toFixed(2)
//         toast({
//           title: "Insufficient Balance",
//           description: `You have ${balanceFormatted} wMON but need ${neededFormatted} wMON`,
//           variant: "destructive",
//         })
//         return
//       }

//       await approveToken({
//         address: loan.loanToken as `0x${string}`,
//         abi: ERC20_ABI,
//         functionName: "approve",
//         args: [NFT_LENDHUB_ADDRESS, loan.loanAmount],
//       })

//       toast({ title: "Token approved", description: "Proceeding to fund..." })
//       console.log('loan ID: ', loan.loanId)

//       await fundLoan({
//         address: NFT_LENDHUB_ADDRESS,
//         abi: NFT_LENDHUB_ABI,
//         functionName: "fundLoan",
//         args: [loan.loanId],
//       })

//       toast({ title: "Success", description: "Loan funded!" })

//       // Refresh
//       setLoans((prev) => prev.filter((_, i) => i !== index))
//     } catch (error: any) {
//       console.error("Funding failed:", error)
//       if (error.message.includes('Connector not connected')){
//         toast({ title: "Error", description: "Wallet Not Connected", variant: "destructive" })
//       }
//       toast({ title: "Error", description: "Funding failed", variant: "destructive" })
//     } finally {
//       setIsFunding(false)
//       setSelectedLoanIndex(null)
//     }
//   }

//   const handleNFTSelect = (nft: NFT) => {
//     setSelectedNFT(nft)
//     toast({ title: "NFT selected", description: `NFT #${nft.tokenId} ready to be listed` })
//     // You could redirect to /borrow with prefilled data or show a listing modal
//   }

//   return (
//     <div className="container py-8">
//       {collection ? (
//         <>
//           <h1 className="text-3xl font-bold mb-2">{collection.name}</h1>
//           <p className="text-muted-foreground mb-4">
//             Floor Price: {collection.floorPrice} wMON {collection.verified && <span className="text-green-500 ml-2">✔ Verified</span>}
//           </p>
//         </>
//       ) : (
//         <p className="text-foreground mb-4">Collection not found.</p>
//       )}

//       <h2 className="text-xl font-semibold mb-2">Listed NFTs</h2>

//       {loading ? (
//         <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
//           {[...Array(6)].map((_, i) => (
//             <Card key={i} className="h-48 animate-pulse bg-muted" />
//           ))}
//         </div>
//       ) : loans.length === 0 ? (
//         <p className="text-muted-foreground">No NFTs listed for loan from this collection.</p>
//       ) : (
//         <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
//           {loans.map((loan, i) => (
//             <NFTCard
//               key={loan.loanId.toString()}
//               loanId={loan.loanId}
//               nftId={Number(loan.nftId)}
//               nftAddress={loan.nftAddress}
//               nftOwner={loan.nftOwner}
//               loanAmount={loan.loanAmount}
//               interestRate={Number(loan.interestRate)}
//               loanDuration={Number(loan.loanDuration)}
//               startTime={Number(loan.startTime)}
//               repaid={loan.repaid}
//               lender={loan.lender}
//               loanToken={loan.loanToken}
//               active={loan.active}
//               completed={loan.completed}
//               onAction={() => handleFund(loan, i)}
//               actionText="Fund Loan"
//               actionDisabled={false}
//               isProcessing={isFunding && selectedLoanIndex === i}
//             />
//           ))}
//         </div>
//       )}

//       <div className="mt-10">
//         <h2 className="text-xl font-semibold mb-2">List Your NFT from This Collection</h2>
//         <div className="space-y-2">
//           <Label className="text-sm text-muted-foreground">Select To List NFT from Wallet</Label>
//           <SelectNFTModal onSelect={handleNFTSelect} />
//         </div>

//         {selectedNFT && (
//           <Card className="mt-4 border border-monad-border p-4 bg-muted">
//             <p className="text-xs text-foreground">Selected NFT: #{selectedNFT.tokenId}</p>
//             <p className="text-xs text-muted-foreground break-all">Contract: {selectedNFT.contractAddress}</p>
//             <Button className="mt-2 h-8 text-xs" onClick={() => window.location.href = "/borrow"}>
//               Go List for Loan
//             </Button>
//           </Card>
//         )}
//       </div>
//     </div>
//   )
// }

/////////////////////////////---------------------------------////////////////////////////

// import { NFTCard } from "@/components/nft-card"
// import { fetchSupportedCollections } from "@/components/utils/collections"
// import { OnchainLoan, fetchLoansForCollectionOnchain } from "@/components/utils/onchainLoans"

// interface PageProps {
//   params: {
//     address: string
//   }
// }

// export default async function CollectionPage({ params }: PageProps) {
//   const collectionAddress = params.address.toLowerCase()

//   // fetch metadata for the collection
//   const collections = await fetchSupportedCollections()
//   const collection = collections.find(
//     (col) => col.contractAddress.toLowerCase() === collectionAddress
//   )

//   if (!collection) return <p>Collection not supported on LendHub yet.</p>

//   const listedNfts = await fetchLoansForCollectionOnchain(collectionAddress)

//   return (
//     <div className="container">
//       <h1 className="text-3xl font-bold mb-2">{collection.name}</h1>
//       <p className="mb-4">
//         Floor Price: {collection.floorPrice} wMON{" "}
//         {collection.verified && <span className="text-green-500 ml-2">✔ Verified</span>}
//       </p>

//       <h2 className="text-xl font-semibold mb-2">Listed NFTs</h2>
//       {listedNfts.length === 0 ? (
//         <p>No NFTs listed for loan from this collection.</p>
//       ) : (
//         <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
//           {listedNfts.map((nft: OnchainLoan) => (
//             <NFTCard key={nft.loanId.toString()} {...nft} actionText="Fund Loan" />
//           ))}
//         </div>
//       )}
//     </div>
//   )
// }

///////////////////////////////////////////////////////////////////////////////////////////
// 'use client'

// import { notFound } from "next/navigation"
// import { getPendingListings, type LoanData } from "@/components/lib/contract-utils"
// import { fetchSupportedCollections } from "@/components/utils/collections"
// import { NFTCard } from "@/components/nft-card"

// interface CollectionPageProps {
//   params: {
//     address: string
//   }
// }

// export default async function CollectionPage({ params }: CollectionPageProps) {
//   const collectionAddress = params.address.toLowerCase()

//   // Fetch all supported collections from Magic Eden
//   const collections = await fetchSupportedCollections()
//   const collection = collections.find(
//     (c) => c.contractAddress.toLowerCase() === collectionAddress
//   )

//   if (!collection) {
//     notFound()
//   }

//   // Fetch on-chain pending loans
//   const allPendingLoans: LoanData[] = await getPendingListings()
//   const filteredLoans = allPendingLoans.filter(
//     (loan) => loan.nftAddress.toLowerCase() === collectionAddress
//   )

//   return (
//     <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//       <div className="mb-6">
//         <h1 className="text-3xl font-bold text-foreground">{collection.name}</h1>
//         <p className="text-muted-foreground mt-1 text-sm">
//           Floor Price: <span className="text-foreground font-medium">{collection.floorPrice} wMON</span>
//           {collection.verified && (
//             <span className="ml-2 text-green-500 font-semibold">✓ Verified</span>
//           )}
//         </p>
//       </div>

//       <h2 className="text-xl font-semibold text-foreground mb-3">Listed NFTs</h2>

//       {filteredLoans.length === 0 ? (
//         <p className="text-muted-foreground text-sm">
//           No NFTs listed for loan from this collection.
//         </p>
//       ) : (
//         <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
//           {filteredLoans.map((loan) => (
//             <NFTCard
//               key={`${loan.nftAddress}-${loan.nftId.toString()}`}
//               loanId={loan.loanId}
//               nftId={Number(loan.nftId)}
//               nftAddress={loan.nftAddress}
//               nftOwner={loan.nftOwner}
//               loanAmount={loan.loanAmount}
//               interestRate={Number(loan.interestRate)}
//               loanDuration={Number(loan.loanDuration)}
//               startTime={Number(loan.startTime)}
//               repaid={loan.repaid}
//               lender={loan.lender}
//               loanToken={loan.loanToken}
//               active={loan.active}
//               completed={loan.completed}
//               actionText="Fund Loan"
//               onAction={() => {}}
//               actionDisabled
//               showLender={false}
//             />
//           ))}
//         </div>
//       )}
//     </main>
//   )
// }

////////////////////////////////---------------------------------------------////////////////////////////////
