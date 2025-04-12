import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/Components/privy/ui/dialog";
import { Button } from "@/Components/privy/ui/button";
import { useAccount } from "wagmi";
import Image from "next/image";
import { fetchUserNFTs } from "./lib/fetchUserNfts";
import axios from "axios";

export interface NFT {
  tokenId: string;
  contractAddress: string;
  metadata?: any;
  name: string;
  imageUrl: string;
  collectionName?: string;
  verified?: boolean;
  floorPrice?: number;
}

// export interface NFT {
//   tokenId: string;
//   contractAddress: string;
//   imageUrl: string;
//   name: string;
// }

interface SelectNFTModalProps {
  onSelect: (nft: NFT) => void;
}

export function SelectNFTModal({ onSelect }: SelectNFTModalProps) {
  const { address } = useAccount();
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // <- ✅ Modal state

  useEffect(() => {
    if (!address) return;

    const getNFTs = async () => {
      setLoading(true);
      const data = await fetchUserNFTs(address);
      console.log("nft data: ", data);
      setNfts(data);
      setLoading(false);
    };

    getNFTs();
  }, [address, isOpen]);

  const handleSelect = async (nft: NFT) => {
    // Determine the collection address
    const collectionAddress = nft.contractAddress?.toLowerCase();

    if (collectionAddress) {
      try {
        const response = await axios.get(
          `https://api-mainnet.magiceden.dev/v3/rtp/monad-testnet/collections/v7`,
          {
            params: {
              id: collectionAddress,
              includeMintStages: false,
              includeSecurityConfigs: false,
              normalizeRoyalties: false,
              useNonFlaggedFloorAsk: false,
              sortBy: "allTimeVolume",
              limit: 1,
            },
          }
        );

        const floorPrice =
          response.data.collections?.[0]?.floorAsk?.price?.amount?.decimal || 0;

        nft.floorPrice = floorPrice;
      } catch (error) {
        console.error("Error fetching floor price:", error);
        nft.floorPrice = 0;
      }
    }

    onSelect(nft); // ✅ Passing selected NFT back to parent
    setIsOpen(false); // ✅ Close modal
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full text-sm h-8">
          Select NFT from Wallet
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogTitle>Select Your NFT</DialogTitle>
        {loading ? (
          <p className="text-sm">Loading NFTs...</p>
        ) : nfts.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No NFTs found in wallet.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {nfts.map((nft) => (
              <div
                key={`${nft.contractAddress}-${nft.tokenId}`}
                onClick={() => handleSelect(nft)}
                className="cursor-pointer hover:ring-2 ring-monad-500 rounded-md p-2 border bg-muted"
              >
                <div className="relative w-full h-24">
                  <Image
                    src={nft.imageUrl}
                    alt={nft.name}
                    fill
                    className="object-cover rounded"
                  />
                </div>
                <div className="text-xs mt-1 truncate">{nft.name}</div>
                <div className="text-[10px] text-muted-foreground truncate">
                  ID: {nft.tokenId}
                </div>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
