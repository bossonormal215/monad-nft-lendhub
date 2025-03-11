// import { type ClassValue, clsx } from 'clsx';
// import { twMerge } from 'tailwind-merge';
// import { formatUnits, parseUnits } from 'viem';

// export function cn(...inputs: ClassValue[]) {
//   return twMerge(clsx(inputs));
// }

// export function formatAddress(address: string): string {
//   return `${address.slice(0, 6)}...${address.slice(-4)}`;
// }

// export function formatAmount(amount: bigint, decimals: number = 18): string {
//   return parseFloat(formatUnits(amount, decimals)).toFixed(4);
// }

// export function parseAmount(amount: string, decimals: number = 18): bigint {
//   return parseUnits(amount, decimals);
// }

// export function calculateRepaymentAmount(
//   loanAmount: bigint,
//   interestRate: number
// ): bigint {
//   const interest = (loanAmount * BigInt(interestRate)) / BigInt(100);
//   return loanAmount + interest;
// }

// export function formatDuration(seconds: number): string {
//   const days = Math.floor(seconds / 86400);
//   const hours = Math.floor((seconds % 86400) / 3600);

//   if (days > 0) {
//     return `${days} day${days > 1 ? 's' : ''}${
//       hours > 0 ? ` ${hours} hr${hours > 1 ? 's' : ''}` : ''
//     }`;
//   }

//   if (hours > 0) {
//     return `${hours} hour${hours > 1 ? 's' : ''}`;
//   }

//   const minutes = Math.floor((seconds % 3600) / 60);
//   return `${minutes} minute${minutes > 1 ? 's' : ''}`;
// }

// export function getLoanStatus(loan: any): {
//   status: 'Listed' | 'Active' | 'Repaid' | 'Defaulted' | 'Grace Period';
//   color: string;
// } {
//   if (!loan) return { status: 'Listed', color: 'bg-yellow-500' };

//   if (loan.repaid) {
//     return { status: 'Repaid', color: 'bg-green-500' };
//   }

//   if (loan.lender === '0x0000000000000000000000000000000000000000') {
//     return { status: 'Listed', color: 'bg-yellow-500' };
//   }

//   const now = Math.floor(Date.now() / 1000);
//   const loanEnd = Number(loan.startTime) + Number(loan.loanDuration);
//   const gracePeriodEnd = loanEnd + 7 * 86400; // 7 days grace period

//   if (now > gracePeriodEnd) {
//     return { status: 'Defaulted', color: 'bg-red-500' };
//   }

//   if (now > loanEnd) {
//     return { status: 'Grace Period', color: 'bg-orange-500' };
//   }

//   return { status: 'Active', color: 'bg-monad-500' };
// }

// export function getRemainingTime(loan: any): string {
//   if (!loan || !loan.startTime || loan.startTime === '0') return 'Not started';
//   if (loan.repaid) return 'Repaid';

//   const now = Math.floor(Date.now() / 1000);
//   const loanEnd = Number(loan.startTime) + Number(loan.loanDuration);
//   const gracePeriodEnd = loanEnd + 7 * 86400; // 7 days grace period

//   if (now > gracePeriodEnd) {
//     return 'Defaulted';
//   }

//   if (now > loanEnd) {
//     const remaining = gracePeriodEnd - now;
//     return `Grace: ${formatDuration(remaining)}`;
//   }

//   const remaining = loanEnd - now;
//   return formatDuration(remaining);
// }
