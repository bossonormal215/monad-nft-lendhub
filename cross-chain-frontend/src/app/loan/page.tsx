"use client";

import { useParams } from "next/navigation";
import { useReadContract } from "wagmi";
import { NFT_LENDHUB } from "@/Components/p2plendhub/contracts/nftLendHub";
import { WagmiProvider } from "wagmi";
import PrivyWrapper from "@/Components/PrivyWrapper";
import { wagmiConfig } from "@/utils/wagmi";

// Loan Type
interface Loan {
  nftOwner: string;
  nftAddress: string;
  nftId: number;
  lender: string;
  loanAmount: bigint;
  interestRate: bigint;
  loanDuration: bigint;
  startTime: bigint;
  repaid: boolean;
  loanToken: string;
}

export default function LoanDetailsPage() {
  const { nftAddress, nftId } = useParams();

  const { data, isLoading } = useReadContract({
    address: NFT_LENDHUB.address as `0x${string}`,
    abi: NFT_LENDHUB.abi,
    functionName: "loans",
    args: [nftAddress, Number(nftId)],
  });

  const loan: Loan = {
    nftOwner: data[0] as string,
    nftAddress: data[1] as string,
    nftId: Number(data[2]),
    lender: data[3] as string,
    loanAmount: BigInt(data[4]),
    interestRate: BigInt(data[5]),
    loanDuration: BigInt(data[6]),
    startTime: BigInt(data[7]),
    repaid: Boolean(data[8]),
    loanToken: data[9] as string,
  };

  if (isLoading) return <p className="text-monadGray">Loading loan details...</p>;
  if (!loan || !loan.lender) return <p className="text-red-500">Loan not found.</p>;

  return (
    <div className="min-h-screen bg-monadDark text-monadLight p-8">
      <WagmiProvider config={wagmiConfig}>
             <PrivyWrapper>
      <h1 className="text-3xl font-bold text-monadBlue">Loan Details</h1>
      <p><strong>Loan Amount:</strong> {loan.loanAmount.toString()} MON</p>
      </PrivyWrapper>
      </WagmiProvider>
    </div>
  );
}
