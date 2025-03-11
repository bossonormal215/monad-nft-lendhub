// "use client";

// import { useState } from "react";
// import { useWriteContract } from "wagmi";
// import { NFT_LENDHUB } from "./contracts/nftLendHub";

// export default function ListNFT() {
//   const [nftAddress, setNftAddress] = useState("");
//   const [nftId, setNftId] = useState("");
//   const [loanAmount, setLoanAmount] = useState("");
//   const [interestRate, setInterestRate] = useState("");
//   const [loanDuration, setLoanDuration] = useState("");
//   const [loanToken, setLoanToken] = useState("0x760AfE86e5de5fa0Ee542fc7B7B713e1c5425701"); // MON

//   const { writeContract, isLoading } = useWriteContract();

//   const listNFT = async () => {
//     try {
//       await writeContract({
//         address: NFT_LENDHUB.address as `0x${string}`,
//         abi: NFT_LENDHUB.abi,
//         functionName: "listNFTForLoan",
//         args: [nftAddress, nftId, loanAmount, interestRate, loanDuration, loanToken],
//       });
//     } catch (error) {
//       console.error("Error listing NFT:", error);
//     }
//   };

//   return (
//     <div className="p-8 bg-monadDark text-monadLight">
//       <h2 className="text-2xl font-bold text-monadBlue">List Your NFT for a Loan</h2>
//       <div className="mt-4 space-y-4">
//         <input
//           type="text"
//           placeholder="NFT Contract Address"
//           className="w-full p-2 bg-monadGray rounded-lg"
//           onChange={(e) => setNftAddress(e.target.value)}
//         />
//         <input
//           type="text"
//           placeholder="NFT ID"
//           className="w-full p-2 bg-monadGray rounded-lg"
//           onChange={(e) => setNftId(e.target.value)}
//         />
//         <input
//           type="text"
//           placeholder="Loan Amount"
//           className="w-full p-2 bg-monadGray rounded-lg"
//           onChange={(e) => setLoanAmount(e.target.value)}
//         />
//         <input
//           type="text"
//           placeholder="Interest Rate (%)"
//           className="w-full p-2 bg-monadGray rounded-lg"
//           onChange={(e) => setInterestRate(e.target.value)}
//         />
//         <input
//           type="text"
//           placeholder="Loan Duration (sec)"
//           className="w-full p-2 bg-monadGray rounded-lg"
//           onChange={(e) => setLoanDuration(e.target.value)}
//         />
//         <button
//           onClick={listNFT}
//           disabled={isLoading}
//           className="w-full px-4 py-2 bg-monadBlue text-white rounded-lg"
//         >
//           {isLoading ? "Listing..." : "List NFT"}
//         </button>
//       </div>
//     </div>
//   );
// }