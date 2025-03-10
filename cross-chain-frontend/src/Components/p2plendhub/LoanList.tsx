"use client";

import { useEffect, useState } from "react";
import { useReadContract } from "wagmi";
import { NFT_LENDHUB } from "./contracts/nftLendHub";

// Loan Type
interface Loan {
  nftOwner: string;
  nftAddress: string;
  nftId: number;
  lender: string;
  loanAmount: bigint;
  interestRate: bigint;
  loanDuration: bigint;
}

export default function LoanList() {
  const [loanedNFTs, setLoanedNFTs] = useState<Loan[]>([]);
  const nftAddresses = ["0xCC133Be7950d9c00B78BCbFa470A8E63c3DD7BfC"]; // Replace with actual NFT contracts

  useEffect(() => {
    const fetchLoans = async () => {
      const fetchedLoans: Loan[] = [];

      for (const nftAddress of nftAddresses) {
        for (let nftId = 0; nftId < 500; nftId++) {
          try {
            const data: any = await useReadContract({
              abi: NFT_LENDHUB.abi,
              address: NFT_LENDHUB.address as `0x${string}`,
              functionName: "loans",
              args: [nftAddress, nftId],
            });

            if (data && data.lender !== "0x0000000000000000000000000000000000000000") {
              fetchedLoans.push({ nftAddress, nftId, ...data });
            }
          } catch (error) {
            console.error(`Error fetching loan for NFT ${nftId}:`, error);
          }
        }
      }

      setLoanedNFTs(fetchedLoans);
    };

    fetchLoans();
  }, []);

  return (
    <div className="p-8 bg-monadDark text-monadLight">
      <h2 className="text-2xl font-bold text-monadBlue">Active Loans</h2>

      {loanedNFTs.length === 0 ? (
        <p className="text-monadGray">No active loans found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {loanedNFTs.map((loan, index) => (
            <div key={index} className="border border-monadGray p-4 rounded-lg">
              <h3 className="text-lg font-bold">{loan.nftAddress}</h3>
              <p className="text-monadGray">NFT ID: {loan.nftId}</p>
              <p className="text-monadGray">Loan Amount: {loan.loanAmount.toString()} MON</p>
              <p className="text-monadGray">Interest Rate: {loan.interestRate.toString()}%</p>
              <p className="text-monadGray">Duration: {loan.loanDuration.toString()} sec</p>
              <button className="mt-4 px-4 py-2 bg-monadPurple text-white rounded-lg">
                View Details
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
    );
  }