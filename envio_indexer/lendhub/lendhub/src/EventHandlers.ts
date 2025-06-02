/*
 * Please refer to https://docs.envio.dev for a thorough guide on all Envio indexer features
 */

/* To be added to the new deployed contract*/
/* schema.graphql
type Nftlend_LoanCancelled {
  id: ID!
  loanId: BigInt!
  borrower: String!
  lender: String!
  _blockNumber: BigInt!      # <-- added this
  _timestamp: BigInt!        # <-- added this
}
  */
import {
  Nftlendhub,
  Nftlendhub_LoanClaimed,
  Nftlendhub_LoanFunded,
  Nftlendhub_LoanRepaid,
  Nftlendhub_NFTClaimedByLender,
  Nftlendhub_NFTListed,
  Nftlendhub_NFTWithdrawn,
  Nftlendhub_OwnershipTransferred,
  Nftlendhub_RepaymentClaimed,
  Nftlendhub_LoanCancelled,
} from 'generated';

Nftlendhub.LoanClaimed.handler(async ({ event, context }) => {
  const entity: Nftlendhub_LoanClaimed = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    loanId: event.params.loanId,
    borrower: event.params.borrower,
    loanAmount: event.params.loanAmount,
    _blockNumber: BigInt(event.block.number),
    _timestamp: BigInt(event.block.timestamp),
  };

  context.Nftlendhub_LoanClaimed.set(entity);
});

Nftlendhub.LoanFunded.handler(async ({ event, context }) => {
  const entity: Nftlendhub_LoanFunded = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    loanId: event.params.loanId,
    lender: event.params.lender,
    borrower: event.params.borrower,
    loanAmount: event.params.loanAmount,
    _blockNumber: BigInt(event.block.number),
    _timestamp: BigInt(event.block.timestamp),
  };

  context.Nftlendhub_LoanFunded.set(entity);
});

Nftlendhub.LoanRepaid.handler(async ({ event, context }) => {
  const entity: Nftlendhub_LoanRepaid = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    loanId: event.params.loanId,
    borrower: event.params.borrower,
    lender: event.params.lender,
    loanAmount: event.params.loanAmount,
    _blockNumber: BigInt(event.block.number),
    _timestamp: BigInt(event.block.timestamp),
  };

  context.Nftlendhub_LoanRepaid.set(entity);
});

Nftlendhub.NFTClaimedByLender.handler(async ({ event, context }) => {
  const entity: Nftlendhub_NFTClaimedByLender = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    loanId: event.params.loanId,
    lender: event.params.lender,
    borrower: event.params.borrower,
    _blockNumber: BigInt(event.block.number),
    _timestamp: BigInt(event.block.timestamp),
  };

  context.Nftlendhub_NFTClaimedByLender.set(entity);
});

Nftlendhub.NFTListed.handler(async ({ event, context }) => {
  const entity: Nftlendhub_NFTListed = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    loanId: event.params.loanId,
    nftOwner: event.params.nftOwner,
    nftAddress: event.params.nftAddress,
    nftId: event.params.nftId,
    loanAmount: event.params.loanAmount,
    interestRate: event.params.interestRate,
    duration: event.params.duration,
    loanToken: event.params.loanToken,
    _blockNumber: BigInt(event.block.number),
    _timestamp: BigInt(event.block.timestamp),
  };

  context.Nftlendhub_NFTListed.set(entity);
});



Nftlendhub.NFTWithdrawn.handler(async ({ event, context }) => {
  const entity: Nftlendhub_NFTWithdrawn = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    loanId: event.params.loanId,
    owner: event.params.owner,
    _blockNumber: BigInt(event.block.number),
    _timestamp: BigInt(event.block.timestamp),
  };

  context.Nftlendhub_NFTWithdrawn.set(entity);
});

Nftlendhub.OwnershipTransferred.handler(async ({ event, context }) => {
  const entity: Nftlendhub_OwnershipTransferred = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    previousOwner: event.params.previousOwner,
    newOwner: event.params.newOwner,
    _blockNumber: BigInt(event.block.number),
    _timestamp: BigInt(event.block.timestamp),
  };

  context.Nftlendhub_OwnershipTransferred.set(entity);
});

Nftlendhub.RepaymentClaimed.handler(async ({ event, context }) => {
  const entity: Nftlendhub_RepaymentClaimed = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    loanId: event.params.loanId,
    lender: event.params.lender,
    loanAmount: event.params.loanAmount,
    _blockNumber: BigInt(event.block.number),
    _timestamp: BigInt(event.block.timestamp),
  };

  context.Nftlendhub_RepaymentClaimed.set(entity);
});

 Nftlendhub.LoanCancelled.handler(async ({ event, context }) => {
  const entity: Nftlendhub_LoanCancelled = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    loanId: event.params.loanId,
    owner: event.params.owner,
    _blockNumber: BigInt(event.block.number),      
    _timestamp: BigInt(event.block.timestamp), 
  };

  context.Nftlendhub_LoanCancelled.set(entity);
}); 
