import { ethers } from "ethers";
import fs from "fs";
import path from "path";
import hre from "hardhat";

// Contract ABI - only the functions we need
const ABI = [
    "function getCompletedLoans() view returns (tuple(tuple(address nftOwner, address nftAddress, address lender, address loanToken) loanAddDetails, uint256 loanId, uint256 nftId, uint256 loanAmount, uint256 interestRate, uint256 loanDuration, bool isLockable, bool loanClaimed, bool repaid, bool active, bool completed, bool cancelled, tuple(uint256 startTime, uint256 claimedAt, uint256 fundedAt, uint256 repaidAt, uint256 completedAt) milestones)[])",
];

interface NetworkError extends Error {
    code?: string;
}

async function main() {
    try {
        // Get the network configuration from hardhat
        const network = hre.network;
        console.log(`Running on network: ${network.name}`);
        
        // Get the signer
        const [signer] = await hre.ethers.getSigners();
        console.log(`Using signer: ${signer.address}`);
        
        // Contract address
        const contractAddress = '0x9578f8b8885eDB70A9905f57186f7A1585903b1a';
        
        // Create contract instance
        const contract = new ethers.Contract(contractAddress, ABI, signer);
        
        console.log('Fetching completed loans...');
        const completedLoans = await contract.getCompletedLoans();
        
        // Count loans per user (as borrower and lender)
        const borrowerLoanCounts = new Map<string, number>();
        const lenderLoanCounts = new Map<string, number>();
        
        completedLoans.forEach((loan: any) => {
            // Count as borrower (nftOwner)
            const borrowerAddress = loan.loanAddDetails.nftOwner;
            borrowerLoanCounts.set(borrowerAddress, (borrowerLoanCounts.get(borrowerAddress) || 0) + 1);
            
            // Count as lender
            const lenderAddress = loan.loanAddDetails.lender;
            lenderLoanCounts.set(lenderAddress, (lenderLoanCounts.get(lenderAddress) || 0) + 1);
        });
        
        // Combine borrower and lender data
        const allAddresses = new Set([
            ...borrowerLoanCounts.keys(),
            ...lenderLoanCounts.keys()
        ]);
        
        const userStats = Array.from(allAddresses).map(address => ({
            address,
            lendings: lenderLoanCounts.get(address) || 0,
            borrowings: borrowerLoanCounts.get(address) || 0,
            totalCompletedLoans: (lenderLoanCounts.get(address) || 0) + (borrowerLoanCounts.get(address) || 0)
        }))
        .filter(user => user.totalCompletedLoans >= 2)
        .sort((a, b) => b.totalCompletedLoans - a.totalCompletedLoans);
        
        // Create CSV content
        const csvContent = [
            'Address,Lendings,Borrowings,Total Completed Loans',
            ...userStats.map(user => `${user.address},${user.lendings},${user.borrowings},${user.totalCompletedLoans}`)
        ].join('\n');
        
        // Save to file
        const outputPath = path.join(__dirname, 'users_with_five_plus_loans.csv');
        fs.writeFileSync(outputPath, csvContent);
        
        console.log(`Found ${userStats.length} users with 2+ total completed loans`);
        
        // Display results in a table
        console.log('\nDetailed Results:');
        console.table(userStats);
        
        console.log(`\nData saved to ${outputPath}`);
    } catch (error) {
        const networkError = error as NetworkError;
        console.error('Error details:', networkError);
        if (networkError.code === 'EAI_AGAIN') {
            console.error('\nDNS resolution failed. Please check your internet connection and try again.');
        } else if (networkError.code === 'NETWORK_ERROR') {
            console.error('\nNetwork error. Please check if the RPC endpoint is accessible.');
        }
        process.exit(1);
    }
}

main().catch((error) => {
    console.error('Error:', error);
    process.exit(1);
});
