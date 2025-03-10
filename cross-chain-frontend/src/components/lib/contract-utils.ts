import { NFT_LENDHUB_ADDRESS, NFT_LENDHUB_ABI } from './constants';
import { createPublicClient, http } from 'viem';
import { monadTestnet } from 'viem/chains';

// Define the loan data structure to match the contract's enhanced structure
export interface LoanData {
  nftOwner: string;
  nftAddress: string;
  nftId: bigint;
  lender: string;
  loanAmount: bigint;
  interestRate: bigint;
  loanDuration: bigint;
  startTime: bigint;
  repaid: boolean;
  loanToken: string;
  active: boolean;
  completed: boolean;
  // UI-specific properties
  claimed?: boolean;
  repaymentClaimed?: boolean;
  nftClaimed?: boolean;
}

// Create a public client for reading from the Monad testnet
const publicClient = createPublicClient({
  chain: monadTestnet,
  transport: http('https://testnet-rpc.monad.xyz'),
});

// Get all pending loan listings (loans that haven't been funded yet)
export async function getPendingListings(): Promise<LoanData[]> {
  try {
    console.log('Fetching pending listings');
    const allLoans = (await publicClient.readContract({
      address: NFT_LENDHUB_ADDRESS,
      abi: NFT_LENDHUB_ABI,
      functionName: 'getAllLoans',
    })) as LoanData[];

    console.log(`Found ${allLoans.length} pending listings`);
    return allLoans;
  } catch (error) {
    console.error('Error fetching pending listings:', error);
    return [];
  }
}

// Get all active loans (loans that have been funded but not completed)
export async function getActiveLoans(): Promise<LoanData[]> {
  try {
    console.log('Fetching active loans');
    const activeLoans = (await publicClient.readContract({
      address: NFT_LENDHUB_ADDRESS,
      abi: NFT_LENDHUB_ABI,
      functionName: 'activeLoans',
      args: [],
    })) as LoanData[];

    console.log(`Found ${activeLoans.length} active loans`);
    return activeLoans;
  } catch (error) {
    console.error('Error fetching active loans:', error);
    return [];
  }
}

// Get all completed loans
export async function getCompletedLoans(): Promise<LoanData[]> {
  try {
    console.log('Fetching completed loans');
    const completedLoans = (await publicClient.readContract({
      address: NFT_LENDHUB_ADDRESS,
      abi: NFT_LENDHUB_ABI,
      functionName: 'getCompletedLoans',
    })) as LoanData[];

    console.log(`Found ${completedLoans.length} completed loans`);
    return completedLoans;
  } catch (error) {
    console.error('Error fetching completed loans:', error);
    return [];
  }
}

// Get all loans for a specific user (as borrower)
export async function getUserLoans(userAddress: string): Promise<LoanData[]> {
  try {
    console.log(`Fetching loans for user ${userAddress}`);
    const userLoans = (await publicClient.readContract({
      address: NFT_LENDHUB_ADDRESS,
      abi: NFT_LENDHUB_ABI,
      functionName: 'getUserLoans',
      args: [userAddress],
    })) as LoanData[];

    console.log(`Found ${userLoans.length} loans for user ${userAddress}`);
    return userLoans;
  } catch (error) {
    console.error(`Error fetching loans for user ${userAddress}:`, error);
    return [];
  }
}

// Get all loans for a specific lender
export async function getLenderLoans(
  lenderAddress: string
): Promise<LoanData[]> {
  try {
    console.log(`Fetching loans for lender ${lenderAddress}`);
    const lenderLoans = (await publicClient.readContract({
      address: NFT_LENDHUB_ADDRESS,
      abi: NFT_LENDHUB_ABI,
      functionName: 'getLenderLoans',
      args: [lenderAddress],
    })) as LoanData[];

    console.log(
      `Found ${lenderLoans.length} loans for lender ${lenderAddress}`
    );
    return lenderLoans;
  } catch (error) {
    console.error(`Error fetching loans for lender ${lenderAddress}:`, error);
    return [];
  }
}

// Get details for a specific loan
export async function getLoanDetails(
  nftAddress: string,
  nftId: bigint
): Promise<LoanData | null> {
  try {
    console.log(`Fetching loan details for NFT ${nftAddress} ID ${nftId}`);
    const loanData = (await publicClient.readContract({
      address: NFT_LENDHUB_ADDRESS,
      abi: NFT_LENDHUB_ABI,
      functionName: 'loans',
      args: [nftAddress, nftId],
    })) as LoanData;

    return loanData;
  } catch (error) {
    console.error(
      `Error fetching loan details for NFT ${nftAddress} ID ${nftId}:`,
      error
    );
    return null;
  }
}

// Check if a loan exists for a specific NFT
export async function loanExists(
  nftAddress: string,
  nftId: bigint
): Promise<boolean> {
  try {
    console.log(`Checking if loan exists for NFT ${nftAddress} ID ${nftId}`);
    const loanData = await getLoanDetails(nftAddress, nftId);

    // If the loan exists, the nftOwner in the returned data should not be the zero address
    return (
      loanData !== null &&
      loanData.nftOwner !== '0x0000000000000000000000000000000000000000'
    );
  } catch (error) {
    console.error(
      `Error checking if loan exists for NFT ${nftAddress} ID ${nftId}:`,
      error
    );
    return false;
  }
}

// Get all loans for a user (both as borrower and lender)
export async function getAllUserLoans(
  userAddress: string
): Promise<{ borrowings: LoanData[]; lendings: LoanData[] }> {
  try {
    const borrowings = await getUserLoans(userAddress);
    const lendings = await getLenderLoans(userAddress);

    return { borrowings, lendings };
  } catch (error) {
    console.error(`Error fetching all loans for user ${userAddress}:`, error);
    return { borrowings: [], lendings: [] };
  }
}
