// types/envio.ts
export type NftListed = {
    id: string;
    loanId: string;
    nftOwner: string;
    nftAddress: string;
    nftId: string;
    loanAmount: string;
    interestRate: string;
    duration: string;
    loanToken: string;
    _blockNumber: number;
    _timestamp: number;
  };
  
  export type LoanFunded = {
    id: string;
    loanId: string;
    lender: string;
    borrower: string;
    _blockNumber: number;
    _timestamp: number;
  };

  export type LoanClaimed = {
    id: string;
    loanId: string;
    borrower: string;
    _blockNumber: number;
    _timestamp: number;
  };

  export type LoanRepaid = {
    id: string;
    loanId: string;
    borrower: string;
    lender: string;
    _blockNumber: number;
    _timestamp: number;
  };

  export type RepaymentClaimed = {
    id: string;
    loanId: string;
    lender: string;
    _blockNumber: number;
    _timestamp: number;
  };

  export type NFTClaimedByLender = {
    id: string;
    loanId: string;
    lender: string;
    borrower: string;
    _blockNumber: number;
    _timestamp: number;
  };

  export type NFTWithdrawn = {
    id: string;
    loanId: string;
    owner: string;
    _blockNumber: number;
    _timestamp: number;
  };

  export type LoanRepayment = {
    id: string;
    loanId: string;
    borrower: string;
    _blockNumber: number;
    _timestamp: number;
  };

  
  // ...add types for other events as needed