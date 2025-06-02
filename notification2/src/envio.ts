import { GraphQLClient } from 'graphql-request';

// Initialize GraphQL client
const client = new GraphQLClient(process.env.ENVIO_GRAPHQL_URL || 'https://api.envio.dev/graphql');

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

export interface EnvioEvent {
  id: string;
  loanId: string;
  _blockNumber: number;
  _timestamp: number;
}

export interface NFTListedEvent extends EnvioEvent {
  nftOwner: string;
  nftAddress: string;
  nftId: string;
  loanAmount: string;
  interestRate: string;
  duration: string;
  loanToken: string;
}

export interface LoanFundedEvent extends EnvioEvent {
  lender: string;
  borrower: string;
  loanAmount: string;
}

export interface LoanClaimedEvent extends EnvioEvent {
  borrower: string;
  loanAmount: string;
}

export interface LoanRepaidEvent extends EnvioEvent {
  borrower: string;
  lender: string;
  loanAmount: string;
}

export interface RepaymentClaimedEvent extends EnvioEvent {
  lender: string;
  loanAmount: string;
}

export interface NFTClaimedByLenderEvent extends EnvioEvent {
  lender: string;
  borrower: string;
}

export interface NFTWithdrawnEvent extends EnvioEvent {
  owner: string;
}

export interface LoanCancelledEvent extends EnvioEvent {
  owner: string;
}

export interface LoanDetails {
  id: string;
  nftOwner: string;
  lender: string;
  nftId: string;
  loanAmount: string;
  interestRate: string;
  loanDuration: string;
  active: boolean;
  repaid: boolean;
  completed: boolean;
  milestones: {
    startTime: string;
    fundedAt: string;
    repaidAt: string;
    completedAt: string;
  };
}

export interface EnvioResponse {
  Nftlendhub_NFTListed: NFTListedEvent[];
  Nftlendhub_LoanFunded: LoanFundedEvent[];
  Nftlendhub_LoanClaimed: LoanClaimedEvent[];
  Nftlendhub_LoanRepaid: LoanRepaidEvent[];
  Nftlendhub_RepaymentClaimed: RepaymentClaimedEvent[];
  Nftlendhub_NFTClaimedByLender: NFTClaimedByLenderEvent[];
  Nftlendhub_NFTWithdrawn: NFTWithdrawnEvent[];
  Nftlendhub_LoanCancelled: LoanCancelledEvent[];
}

interface LoanDetailsResponse {
  loan: LoanDetails;
}

export const fetchRecentEvents = async (lastProcessedBlock: number): Promise<EnvioResponse> => {
  try {
    const response = await client.request<EnvioResponse>(GET_RECENT_EVENTS, {
      lastProcessedBlock,
    });
    return response;
  } catch (error) {
    console.error('Error fetching events from Envio:', error);
    throw error;
  }
};

export const fetchLoanDetails = async (loanId: string): Promise<LoanDetails> => {
  try {
    const response = await client.request<LoanDetailsResponse>(GET_LOAN_DETAILS, {
      loanId,
    });
    return response.loan;
  } catch (error) {
    console.error('Error fetching loan details from Envio:', error);
    throw error;
  }
};

interface LatestBlockResponse {
  Nftlendhub_NFTListed: { _blockNumber: string }[];
  Nftlendhub_LoanFunded: { _blockNumber: string }[];
  Nftlendhub_LoanClaimed: { _blockNumber: string }[];
  Nftlendhub_LoanRepaid: { _blockNumber: string }[];
  Nftlendhub_LoanCancelled: { _blockNumber: string }[];
  Nftlendhub_RepaymentClaimed: { _blockNumber: string }[];
  Nftlendhub_NFTClaimedByLender: { _blockNumber: string }[];
  Nftlendhub_NFTWithdrawn: { _blockNumber: string }[];
}

export async function getLatestBlock(): Promise<number> {
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
    const response = await client.request<LatestBlockResponse>(query);
    
    // Find the highest block number across all event types
    let highestBlock = 0;
    
    for (const eventType in response) {
      if (response[eventType as keyof LatestBlockResponse]?.length > 0) {
        const blockNumber = parseInt(response[eventType as keyof LatestBlockResponse][0]._blockNumber, 10);
        if (!isNaN(blockNumber)) {
          highestBlock = Math.max(highestBlock, blockNumber);
        }
      }
    }

    if (highestBlock === 0) {
      console.warn('No events found to determine latest block. Starting from block 0.');
    } else {
      console.log(`Latest block found: ${highestBlock}`);
    }

    return highestBlock;
  } catch (error) {
    console.error('Error fetching latest block:', error);
    throw error;
  }
} 