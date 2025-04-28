//////////////////////////////////--------------------------------////////////////

import { NFT_LENDHUB_ADDRESS, NFT_LENDHUB_ABI } from './constants';
import { createPublicClient, http } from 'viem';
import { monadTestnet } from 'viem/chains';
import { erc721Abi } from 'viem';

// Define the loan data structure to match the contract's enhanced structure
export interface LoanData {
  loanId: bigint;
  nftOwner: string;
  nftAddress: string;
  nftId: bigint;
  lender: string;
  loanAmount: bigint;
  interestRate: bigint;
  loanDuration: bigint;
  startTime: bigint;
  loanClaimed: boolean;
  repaid: boolean;
  loanToken: string;
  active: boolean;
  completed: boolean;
  cancelled: boolean;
  imageUrl?: string;
}

// Create a public client for reading from the Monad testnet
const publicClient = createPublicClient({
  chain: monadTestnet,
  transport: http('https://testnet-rpc.monad.xyz'),
  cacheTime: 60,
  batch: { multicall: false },
  pollingInterval: 5000,
});

// Get all pending loan listings (loans that haven't been funded yet)
export async function getPendingListings(): Promise<LoanData[]> {
  try {
    console.log('Fetching pending listings');
    const allLoans = (await publicClient.readContract({
      address: NFT_LENDHUB_ADDRESS,
      abi: NFT_LENDHUB_ABI,
      functionName: 'getUnfundedLoans',
    })) as LoanData[];

    console.log(`Found ${allLoans.length} pending listings`);
    // return allLoans;

    const enriched: LoanData[] = [];
    for (const loan of allLoans.filter((l) => !l.active)) {
      const enrichedLoan = await enrichLoanWithImage(loan);
      enriched.push(enrichedLoan);
    }
    return enriched;
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
      functionName: 'getAllLoans',
    })) as LoanData[];

    console.log(`Found ${activeLoans.length} active loans`);
    console.log(`Found ${activeLoans} active loans`);
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

// Get details for a specific loan using loanId
export async function getLoanDetails(loanId: bigint): Promise<LoanData | null> {
  try {
    console.log(`Fetching loan details for Loan ID ${loanId}`);
    const loanData = (await publicClient.readContract({
      address: NFT_LENDHUB_ADDRESS,
      abi: NFT_LENDHUB_ABI,
      functionName: 'loans',
      args: [loanId],
    })) as LoanData;

    return loanData;
  } catch (error) {
    console.error(`Error fetching loan details for Loan ID ${loanId}:`, error);
    return null;
  }
}

// Check if a loan exists for a specific loanId
export async function loanExists(loanId: bigint): Promise<boolean> {
  try {
    console.log(`Checking if loan exists for Loan ID ${loanId}`);
    const loanData = await getLoanDetails(loanId);
    return (
      loanData !== null &&
      loanData.nftOwner !== '0x0000000000000000000000000000000000000000'
    );
  } catch (error) {
    console.error(
      `Error checking if loan exists for Loan ID ${loanId}:`,
      error
    );
    return false;
  }
}

// Get all loans for a user (both as borrower and lender)
/*export async function getAllUserLoans(
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
}*/

// fetch nft image
export async function getTokenImage(
  nftAddress: string,
  nftId: bigint
): Promise<string | null> {
  try {
    const tokenURI = await publicClient.readContract({
      address: nftAddress as `0x${string}`,
      abi: erc721Abi,
      functionName: 'tokenURI',
      args: [nftId],
    });

    let uri = tokenURI as string;
    if (uri.startsWith('ipfs://')) {
      uri = uri.replace('ipfs://', 'https://ipfs.io/ipfs/');
    }

    const res = await fetch(uri);
    const metadata = await res.json();

    let imageUrl = metadata.image;
    if (imageUrl.startsWith('ipfs://')) {
      imageUrl = imageUrl.replace('ipfs://', 'https://ipfs.io/ipfs/');
    }

    return imageUrl;
  } catch (error) {
    console.error(`Error fetching image for ${nftAddress} #${nftId}:`, error);
    return null;
  }
}

export async function getAllUserLoans(
  userAddress: string
): Promise<{ borrowings: LoanData[]; lendings: LoanData[] }> {
  try {
    const borrowings = (await publicClient.readContract({
      address: NFT_LENDHUB_ADDRESS,
      abi: NFT_LENDHUB_ABI,
      functionName: 'getUserLoans',
      args: [userAddress],
    })) as LoanData[];

    const lendings = (await publicClient.readContract({
      address: NFT_LENDHUB_ADDRESS,
      abi: NFT_LENDHUB_ABI,
      functionName: 'getLenderLoans',
      args: [userAddress],
    })) as LoanData[];

    const enrichedBorrowings = await Promise.all(
      borrowings.map(enrichLoanWithImage)
    );
    const enrichedLendings = await Promise.all(
      lendings.map(enrichLoanWithImage)
    );

    return { borrowings: enrichedBorrowings, lendings: enrichedLendings };
  } catch (error) {
    console.error(`Error fetching all loans for user ${userAddress}:`, error);
    return { borrowings: [], lendings: [] };
  }
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function enrichLoanWithImage(
  loan: LoanData,
  delayMs = 250
): Promise<LoanData> {
  // Delay before calling to respect rate limit (250ms = max 4/sec)
  await delay(delayMs);
  const rawImageUrl = await getTokenImage(loan.nftAddress, loan.nftId);
  const imageUrl = rawImageUrl ?? undefined;
  return { ...loan, imageUrl };
}

/*export async function getPendingListings(): Promise<LoanData[]> {
  try {
    const allLoans = (await publicClient.readContract({
      address: NFT_LENDHUB_ADDRESS,
      abi: NFT_LENDHUB_ABI,
      functionName: 'getAllLoans',
    })) as LoanData[];

    const enriched = await Promise.all(allLoans.filter(l => !l.active).map(enrichLoanWithImage));
    return enriched;
  } catch (error) {
    console.error('Error fetching pending listings:', error);
    return [];
  }
}
*/

// import { NFT_LENDHUB_ADDRESS, NFT_LENDHUB_ABI } from './constants';
// import { createPublicClient, http } from 'viem';
// import { monadTestnet } from 'viem/chains';

// // Define the loan data structure to match the contract's enhanced structure
// export interface LoanData {
//   nftOwner: string;
//   nftAddress: string;
//   nftId: bigint;
//   lender: string;
//   loanAmount: bigint;
//   interestRate: bigint;
//   loanDuration: bigint;
//   startTime: bigint;
//   repaid: boolean;
//   loanToken: string;
//   active: boolean;
//   completed: boolean;
//   // UI-specific properties
//   claimed?: boolean;
//   repaymentClaimed?: boolean;
//   nftClaimed?: boolean;
// }

// // Create a public client for reading from the Monad testnet
// const publicClient = createPublicClient({
//   chain: monadTestnet,
//   transport: http('https://testnet-rpc.monad.xyz'),
//   cacheTime: 0,
//   batch: { multicall: false },
//   pollingInterval: 5000,
// });

// // Get all pending loan listings (loans that haven't been funded yet)
// export async function getPendingListings(): Promise<LoanData[]> {
//   try {
//     console.log('Fetching pending listings');
//     const allLoans = (await publicClient.readContract({
//       address: NFT_LENDHUB_ADDRESS,
//       abi: NFT_LENDHUB_ABI,
//       functionName: 'getAllLoans',
//     })) as LoanData[];

//     console.log(`Found ${allLoans.length} pending listings`);
//     return allLoans;
//   } catch (error) {
//     console.error('Error fetching pending listings:', error);
//     return [];
//   }
// }

// // Get all active loans (loans that have been funded but not completed)
// export async function getActiveLoans(): Promise<LoanData[]> {
//   try {
//     console.log('Fetching active loans');
//     const activeLoans = (await publicClient.readContract({
//       address: NFT_LENDHUB_ADDRESS,
//       abi: NFT_LENDHUB_ABI,
//       functionName: 'activeLoans',
//       args: [],
//     })) as LoanData[];

//     console.log(`Found ${activeLoans.length} active loans`);
//     return activeLoans;
//   } catch (error) {
//     console.error('Error fetching active loans:', error);
//     return [];
//   }
// }

// // Get all completed loans
// export async function getCompletedLoans(): Promise<LoanData[]> {
//   try {
//     console.log('Fetching completed loans');
//     const completedLoans = (await publicClient.readContract({
//       address: NFT_LENDHUB_ADDRESS,
//       abi: NFT_LENDHUB_ABI,
//       functionName: 'getCompletedLoans',
//     })) as LoanData[];

//     console.log(`Found ${completedLoans.length} completed loans`);
//     return completedLoans;
//   } catch (error) {
//     console.error('Error fetching completed loans:', error);
//     return [];
//   }
// }

// // Get all loans for a specific user (as borrower)
// export async function getUserLoans(userAddress: string): Promise<LoanData[]> {
//   try {
//     console.log(`Fetching loans for user ${userAddress}`);
//     const userLoans = (await publicClient.readContract({
//       address: NFT_LENDHUB_ADDRESS,
//       abi: NFT_LENDHUB_ABI,
//       functionName: 'getUserLoans',
//       args: [userAddress],
//     })) as LoanData[];

//     console.log(`Found ${userLoans.length} loans for user ${userAddress}`);
//     console.log(`Found ${userLoans} loans for user ${userAddress}`);
//     return userLoans;
//   } catch (error) {
//     console.error(`Error fetching loans for user ${userAddress}:`, error);
//     return [];
//   }
// }

// // Get all loans for a specific lender
// export async function getLenderLoans(
//   lenderAddress: string
// ): Promise<LoanData[]> {
//   try {
//     console.log(`Fetching loans for lender ${lenderAddress}`);
//     const lenderLoans = (await publicClient.readContract({
//       address: NFT_LENDHUB_ADDRESS,
//       abi: NFT_LENDHUB_ABI,
//       functionName: 'getLenderLoans',
//       args: [lenderAddress],
//     })) as LoanData[];

//     console.log(
//       `Found ${lenderLoans.length} loans for lender ${lenderAddress}`
//     );
//     console.log(`Found ${lenderLoans} loans for lender ${lenderAddress}`);
//     return lenderLoans;
//   } catch (error) {
//     console.error(`Error fetching loans for lender ${lenderAddress}:`, error);
//     return [];
//   }
// }

// // Get details for a specific loan
// export async function getLoanDetails(
//   nftAddress: string,
//   nftId: bigint
// ): Promise<LoanData | null> {
//   try {
//     console.log(`Fetching loan details for NFT ${nftAddress} ID ${nftId}`);

//     // Fetch raw array data from the contract
//     const loanData = (await publicClient.readContract({
//       address: NFT_LENDHUB_ADDRESS,
//       abi: NFT_LENDHUB_ABI,
//       functionName: 'loans',
//       args: [nftAddress, nftId],
//     })) as unknown as any[];

//     if (!loanData || loanData.length < 12) {
//       console.error('❌ Error: Unexpected loan data format');
//       return null;
//     }

//     // ✅ Properly map array to LoanData structure
//     return {
//       nftOwner: loanData[0] as string,
//       nftAddress: loanData[1] as string,
//       nftId: BigInt(loanData[2]),
//       lender: loanData[3] as string,
//       loanAmount: BigInt(loanData[4]),
//       interestRate: BigInt(loanData[5]),
//       loanDuration: BigInt(loanData[6]),
//       startTime: BigInt(loanData[7]),
//       repaid: Boolean(loanData[8]),
//       loanToken: loanData[9] as string,
//       active: Boolean(loanData[10]),
//       completed: Boolean(loanData[11]),
//     };
//   } catch (error) {
//     console.error(
//       `❌ Error fetching loan details for NFT ${nftAddress} ID ${nftId}:`,
//       error
//     );
//     return null;
//   }
// }

// /*
// export async function getLoanDetails(
//   nftAddress: string,
//   nftId: bigint
// ): Promise<LoanData | null> {
//   try {
//     console.log(`Fetching loan details for NFT ${nftAddress} ID ${nftId}`);
//     const loanData = (await publicClient.readContract({
//       address: NFT_LENDHUB_ADDRESS,
//       abi: NFT_LENDHUB_ABI,
//       functionName: 'loans',
//       args: [nftAddress, nftId],
//     })) as LoanData;

//     return loanData;
//   } catch (error) {
//     console.error(
//       `Error fetching loan details for NFT ${nftAddress} ID ${nftId}:`,
//       error
//     );
//     return null;
//   }
// }
// */

// // Check if a loan exists for a specific NFT
// export async function loanExists(
//   nftAddress: string,
//   nftId: bigint
// ): Promise<boolean> {
//   try {
//     console.log(`Checking if loan exists for NFT ${nftAddress} ID ${nftId}`);
//     const loanData = await getLoanDetails(nftAddress, nftId);

//     // If the loan exists, the nftOwner in the returned data should not be the zero address
//     return (
//       loanData !== null &&
//       loanData.nftOwner !== '0x0000000000000000000000000000000000000000'
//     );
//   } catch (error) {
//     console.error(
//       `Error checking if loan exists for NFT ${nftAddress} ID ${nftId}:`,
//       error
//     );
//     return false;
//   }
// }

// // Get all loans for a user (both as borrower and lender)

// export async function getAllUserLoans(
//   userAddress: string
// ): Promise<{ borrowings: LoanData[]; lendings: LoanData[] }> {
//   try {
//     const borrowings = await getUserLoans(userAddress);
//     const lendings = await getLenderLoans(userAddress);

//     return { borrowings, lendings };
//   } catch (error) {
//     console.error(`Error fetching all loans for user ${userAddress}:`, error);
//     return { borrowings: [], lendings: [] };
//   }
// }

// /*
// export async function getAllUserLoans(userAddress: string) {
//   try {
//     console.log("Fetching fresh loans for:", userAddress);

//     const userLoans = await getUserLoans(userAddress);
//     const lenderLoans = await getLenderLoans(userAddress);

//     // 🔥 Re-fetch each loan to ensure updated data
//     const updatedUserLoans = await Promise.all(userLoans.map(loan =>
//       getLoanDetails(loan.nftAddress, loan.nftId)
//     ));
//     const updatedLenderLoans = await Promise.all(lenderLoans.map(loan =>
//       getLoanDetails(loan.nftAddress, loan.nftId)
//     ));

//     return { borrowings: updatedUserLoans, lendings: updatedLenderLoans };
//   } catch (error) {
//     console.error("Error fetching updated loans:", error);
//     return { borrowings: [], lendings: [] };
//   }
// }
//   */

///////////////////////--------------------------------------/////////////////////////////////////////////
