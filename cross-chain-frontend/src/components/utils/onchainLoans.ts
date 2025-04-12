import { getPendingListings, type LoanData } from '../lib/contract-utils';

export interface OnchainLoan {
  loanId: bigint;
  nftId: number;
  nftAddress: string;
  nftOwner: string;
  loanAmount: bigint;
  interestRate: number;
  loanDuration: number;
  startTime: number;
  repaid: boolean;
  lender: string;
  loanToken: string;
}

export async function fetchLoansForCollectionOnchain(
  contractAddress: string
): Promise<OnchainLoan[]> {
  // TODO: Replace with actual onchain logic
  return [];
}
