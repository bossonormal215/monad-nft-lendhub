// "use client";

// import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/Components/privy/ui/dialog";
// import { Button } from "@/Components/privy/ui/button";
// import { useAccount } from "wagmi";
// import { useEffect, useState } from "react";
// import Image from "next/image";
// import { fetchWalletNFTs } from "../lib/fetch-nfts";

// export interface NFT {
//   tokenId: string;
//   contractAddress: string;
//   image: string;
//   name: string;
// }

// interface SelectNFTModalProps {
//   onSelect: (nft: NFT) => void;
// }


// export function SelectNFTModal({ onSelect }: SelectNFTModalProps) {
//   const { address } = useAccount();
//   const [nfts, setNfts] = useState<NFT[]>([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (!address) return;

//     const fetchNFTs = async () => {
//       setLoading(true);
//       try {
//         const res = await fetch("/api/zora", {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//               query: `
//                 query GetUserNFTs {
//                   tokens(where: { ownerAddresses: ["${address}"] }) {
//                     nodes {
//                       tokenId
//                       name
//                       image {
//                         url
//                       }
//                       collectionAddress
//                     }
//                   }
//                 }
//               `,
//             }),
//           });
          

//         const json = await res.json();
//         const tokens = json.data.tokens.nodes;

//         const parsed: NFT[] = tokens.map((t: any) => ({
//           tokenId: t.tokenId,
//           name: t.name || `Token #${t.tokenId}`,
//           contractAddress: t.collectionAddress,
//           image: t.image?.url || "/placeholder.svg",
//         }));

//         setNfts(parsed);
//       } catch (e) {
//         console.error("Error fetching NFTs:", e);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchNFTs();
//   }, [address]);

//   return (
//     <Dialog>
//       <DialogTrigger asChild>
//         <Button variant="outline" className="h-8 text-sm w-full">
//           Select NFT from Wallet
//         </Button>
//       </DialogTrigger>
//       <DialogContent className="max-h-[80vh] overflow-y-auto">
//         <DialogTitle className="mb-4">Your NFTs</DialogTitle>
//         {loading ? (
//           <p>Loading NFTs...</p>
//         ) : (
//           <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
//             {nfts.map((nft) => (
//               <div
//                 key={`${nft.contractAddress}-${nft.tokenId}`}
//                 onClick={() => onSelect(nft)}
//                 className="cursor-pointer hover:ring-2 ring-monad-500 rounded-md p-2 border bg-muted"
//               >
//                 <div className="relative w-full h-24">
//                   <Image
//                     src={nft.image}
//                     alt={nft.name}
//                     fill
//                     className="object-cover rounded"
//                   />
//                 </div>
//                 <div className="text-xs mt-1 truncate">{nft.name}</div>
//                 <div className="text-[10px] text-muted-foreground truncate">ID: {nft.tokenId}</div>
//               </div>
//             ))}
//           </div>
//         )}
//       </DialogContent>
//     </Dialog>
//   );
// }





import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/Components/privy/ui/dialog";
import { Button } from "@/Components/privy/ui/button";
import { useAccount } from "wagmi";
import Image from "next/image";
import { fetchWalletNFTs } from "./lib/fetch-nfts";
import { fetchUserNFTs } from "./lib/fetchUserNfts";

export interface NFT {
  tokenId: string;
  contractAddress: string;
  imageUrl: string;
  name: string;
}

interface SelectNFTModalProps {
  onSelect: (nft: NFT) => void;
}

export function SelectNFTModal({ onSelect }: SelectNFTModalProps) {
  const { address } = useAccount();
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // <- ✅ Modal state

 /* useEffect(() => {
    if (!address) return;
    setLoading(true);
    fetchWalletNFTs(address)
      .then(setNfts)
      .finally(() => setLoading(false));
  }, [address]);
*/

useEffect(() => {
  if (!address) return;

  const getNFTs = async () => {
    setLoading(true);
    const data = await fetchUserNFTs(address);
    console.log('nft data: ', data)
    setNfts(data);
    setLoading(false);
  };

  getNFTs();
}, [address, isOpen]);

const handleSelect = (nft: NFT) => {
  onSelect(nft);      // ✅ Pass selected NFT back to parent
  setIsOpen(false);   // ✅ Close modal
};


  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full text-sm h-8">Select NFT from Wallet</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogTitle>Select Your NFT</DialogTitle>
        {loading ? (
          <p className="text-sm">Loading NFTs...</p>
        ) : nfts.length === 0 ? (
          <p className="text-muted-foreground text-sm">No NFTs found in wallet.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {nfts.map((nft) => (
              <div
                key={`${nft.contractAddress}-${nft.tokenId}`}
                // onClick={() => onSelect(nft)}
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
                <div className="text-[10px] text-muted-foreground truncate">ID: {nft.tokenId}</div>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
