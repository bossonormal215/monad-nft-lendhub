"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchLoanDetails = exports.fetchRecentEvents = void 0;
exports.getLatestBlock = getLatestBlock;
const graphql_request_1 = require("graphql-request");
// Initialize GraphQL client
const client = new graphql_request_1.GraphQLClient(process.env.LOCAL_ENVIO_GRAPHQL_URL || 'https://api.envio.dev/graphql');
// Query to fetch recent events
const GET_RECENT_EVENTS = `
  query GetRecentEvents($lastProcessedBlock: numeric!) {
    Nftlendhub_NFTListed(
      where: { _blockNumber: { _gt: $lastProcessedBlock } }
      order_by: { _blockNumber: asc }
      limit: 1000000
    ) {
      id
      loanId
      nftOwner
      nftAddress
      nftId
      loanAmount
      interestRate
      duration
      loanToken
      _blockNumber
      _timestamp
    }
    Nftlendhub_LoanFunded(
      where: { _blockNumber: { _gt: $lastProcessedBlock } }
      order_by: { _blockNumber: asc }
      limit: 1000000
    ) {
      id
      loanId
      lender
      borrower
      loanAmount
      _blockNumber
      _timestamp
    }
    Nftlendhub_LoanClaimed(
      where: { _blockNumber: { _gt: $lastProcessedBlock } }
      order_by: { _blockNumber: asc }
      limit: 10000000
    ) {
      id
      loanId
      borrower
      loanAmount
      _blockNumber
      _timestamp
    }
    Nftlendhub_LoanRepaid(
      where: { _blockNumber: { _gt: $lastProcessedBlock } }
      order_by: { _blockNumber: asc }
      limit: 10000000
    ) {
      id
      loanId
      borrower
      lender
      loanAmount
      _blockNumber
      _timestamp
    }
    Nftlendhub_LoanCancelled(
      where: { _blockNumber: { _gt: $lastProcessedBlock } }
      order_by: { _blockNumber: asc }
      limit: 10000000
    ) {
      id
      loanId
      owner
      _blockNumber
      _timestamp
    }
    Nftlendhub_RepaymentClaimed(
      where: { _blockNumber: { _gt: $lastProcessedBlock } }
      order_by: { _blockNumber: asc }
      limit: 10000000
    ) {
      id
      loanId
      lender
      loanAmount
      _blockNumber
      _timestamp
    }
    Nftlendhub_NFTClaimedByLender(
      where: { _blockNumber: { _gt: $lastProcessedBlock } }
      order_by: { _blockNumber: asc }
      limit: 10000000
    ) {
      id
      loanId
      lender
      borrower
      _blockNumber
      _timestamp
    }
    Nftlendhub_NFTWithdrawn(
      where: { _blockNumber: { _gt: $lastProcessedBlock } }
      order_by: { _blockNumber: asc }
      limit: 10000000
    ) {
      id
      loanId
      owner
      _blockNumber
      _timestamp
    }
    
  }
`;
// Query to fetch loan details
const GET_LOAN_DETAILS = `
  query GetLoanDetails($loanId: String!) {
    loan(id: $loanId) {
      id
      nftOwner
      lender
      nftId
      loanAmount
      interestRate
      loanDuration
      active
      repaid
      completed
      milestones {
        startTime
        fundedAt
        repaidAt
        completedAt
      }
    }
  }
`;
const fetchRecentEvents = async (lastProcessedBlock) => {
    try {
        const response = await client.request(GET_RECENT_EVENTS, {
            lastProcessedBlock,
        });
        return response;
    }
    catch (error) {
        console.error('Error fetching events from Envio:', error);
        throw error;
    }
};
exports.fetchRecentEvents = fetchRecentEvents;
const fetchLoanDetails = async (loanId) => {
    try {
        const response = await client.request(GET_LOAN_DETAILS, {
            loanId,
        });
        return response.loan;
    }
    catch (error) {
        console.error('Error fetching loan details from Envio:', error);
        throw error;
    }
};
exports.fetchLoanDetails = fetchLoanDetails;
async function getLatestBlock() {
    const query = `
    query {
      Nftlendhub_NFTListed(
        order_by: { _blockNumber: desc }
        limit: 1
      ) {
        _blockNumber
      }
      Nftlendhub_LoanFunded(
        order_by: { _blockNumber: desc }
        limit: 1
      ) {
        _blockNumber
      }
      Nftlendhub_LoanClaimed(
        order_by: { _blockNumber: desc }
        limit: 1
      ) {
        _blockNumber
      }
      Nftlendhub_LoanRepaid(
        order_by: { _blockNumber: desc }
        limit: 1
      ) {
        _blockNumber
      }
      Nftlendhub_LoanCancelled(
        order_by: { _blockNumber: desc }
        limit: 1
      ) {
        _blockNumber
      }
      Nftlendhub_RepaymentClaimed(
        order_by: { _blockNumber: desc }
        limit: 1
      ) {
        _blockNumber
      }
      Nftlendhub_NFTClaimedByLender(
        order_by: { _blockNumber: desc }
        limit: 1
      ) {
        _blockNumber
      }
      Nftlendhub_NFTWithdrawn(
        order_by: { _blockNumber: desc }
        limit: 1
      ) {
        _blockNumber
      }
    }
  `;
    try {
        const response = await client.request(query);
        // Find the highest block number across all event types
        let highestBlock = 0;
        for (const eventType in response) {
            if (response[eventType]?.length > 0) {
                const blockNumber = parseInt(response[eventType][0]._blockNumber, 10);
                if (!isNaN(blockNumber)) {
                    highestBlock = Math.max(highestBlock, blockNumber);
                }
            }
        }
        if (highestBlock === 0) {
            console.warn('No events found to determine latest block. Starting from block 0.');
        }
        else {
            console.log(`Latest block found: ${highestBlock}`);
        }
        return highestBlock;
    }
    catch (error) {
        console.error('Error fetching latest block:', error);
        throw error;
    }
}
