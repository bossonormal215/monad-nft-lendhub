# NFTLendhub Indexer

This indexer tracks all events from the NFTLendhub contract for the notification bot.

## Contract Configuration

```yaml
contracts:
  - name: NFTLendhub
    address: "0x90F6FE7691306C0a03b98a8dE553A70aa86f3808"
    abi: "./lendhub_abi.json"
    startBlock: 19119642
```

## Event Handlers

```typescript
import { NFTLendhub } from "./types";

export function handleNFTListed(event: NFTLendhub.NFTListedEvent) {
  const { loanId, nftOwner, nftAddress, nftId, loanAmount, interestRate, duration, loanToken } = event.args;
  
  // Store the listed NFT
  NFTListing.create({
    id: loanId.toString(),
    nftOwner,
    nftAddress,
    nftId: nftId.toString(),
    loanAmount: loanAmount.toString(),
    interestRate: interestRate.toString(),
    duration: duration.toString(),
    loanToken,
    timestamp: event.block.timestamp
  });
}

export function handleLoanFunded(event: NFTLendhub.LoanFundedEvent) {
  const { loanId, loanAmount, lender, borrower } = event.args;
  
  // Update the loan status
  Loan.update({
    id: loanId.toString(),
    lender,
    borrower,
    status: "FUNDED",
    fundedAt: event.block.timestamp
  });
}

export function handleLoanClaimed(event: NFTLendhub.LoanClaimedEvent) {
  const { loanId, borrower, loanAmount } = event.args;
  
  // Update the loan status
  Loan.update({
    id: loanId.toString(),
    status: "CLAIMED",
    claimedAt: event.block.timestamp
  });
}

export function handleLoanRepaid(event: NFTLendhub.LoanRepaidEvent) {
  const { loanId, borrower, lender, loanAmount } = event.args;
  
  // Update the loan status
  Loan.update({
    id: loanId.toString(),
    status: "REPAID",
    repaidAt: event.block.timestamp
  });
}

export function handleRepaymentClaimed(event: NFTLendhub.RepaymentClaimedEvent) {
  const { loanId, lender, loanAmount } = event.args;
  
  // Update the loan status
  Loan.update({
    id: loanId.toString(),
    status: "COMPLETED",
    completedAt: event.block.timestamp
  });
}

export function handleNFTClaimedByLender(event: NFTLendhub.NFTClaimedByLenderEvent) {
  const { loanId, lender, borrower } = event.args;
  
  // Update the loan status
  Loan.update({
    id: loanId.toString(),
    status: "DEFAULTED",
    defaultedAt: event.block.timestamp
  });
}

export function handleNFTWithdrawn(event: NFTLendhub.NFTWithdrawnEvent) {
  const { loanId, owner } = event.args;
  
  // Update the loan status
  Loan.update({
    id: loanId.toString(),
    status: "WITHDRAWN",
    withdrawnAt: event.block.timestamp
  });
}

export function handleLoanCancelled(event: NFTLendhub.LoanCancelledEvent) {
  const { loanId, owner } = event.args;
  
  // Update the loan status
  Loan.update({
    id: loanId.toString(),
    status: "CANCELLED",
    cancelledAt: event.block.timestamp
  });
}
```

## Schema

```graphql
type NFTListing @entity {
  id: ID!
  nftOwner: String!
  nftAddress: String!
  nftId: String!
  loanAmount: String!
  interestRate: String!
  duration: String!
  loanToken: String!
  timestamp: BigInt!
}

type Loan @entity {
  id: ID!
  nftOwner: String!
  nftAddress: String!
  nftId: String!
  loanAmount: String!
  interestRate: String!
  duration: String!
  loanToken: String!
  lender: String
  borrower: String
  status: String!
  fundedAt: BigInt
  claimedAt: BigInt
  repaidAt: BigInt
  completedAt: BigInt
  defaultedAt: BigInt
  withdrawnAt: BigInt
  cancelledAt: BigInt
  timestamp: BigInt!
}
```
