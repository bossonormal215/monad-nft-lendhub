export interface LoanNFT {
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
