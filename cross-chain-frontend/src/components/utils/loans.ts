// src/utils/loans.ts

import { LoanNFT } from '@/types/LoanNFT';

export async function fetchLoansForCollection(
  contractAddress: string
): Promise<LoanNFT[]> {
  // Placeholder — simulate 1 fake listing
  return [
    {
      loanId: BigInt(1),
      nftId: 101,
      nftAddress: contractAddress,
      nftOwner: '0xabc...',
      loanAmount: BigInt('1000000000000000000'),
      interestRate: 10,
      loanDuration: 86400 * 7,
      startTime: Math.floor(Date.now() / 1000),
      repaid: false,
      lender: '0xdef...',
      loanToken: '0xwmon...',
    },
  ];
}
