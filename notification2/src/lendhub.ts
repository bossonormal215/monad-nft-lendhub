export const LENDHUB_CONTRACT_ADDRESS = '0x90F6FE7691306C0a03b98a8dE553A70aa86f3808';

export const LENDHUB_ABI =  [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_MON",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_USDT",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_ETH",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_platformWallet",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "loanId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "LoanCancelled",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "loanId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "borrower",
          "type": "address"
        }
      ],
      "name": "LoanClaimed",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "loanId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "lender",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "borrower",
          "type": "address"
        }
      ],
      "name": "LoanFunded",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "loanId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "borrower",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "lender",
          "type": "address"
        }
      ],
      "name": "LoanRepaid",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "loanId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "lender",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "borrower",
          "type": "address"
        }
      ],
      "name": "NFTClaimedByLender",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "loanId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "nftOwner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "nftAddress",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "nftId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "loanAmount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "interestRate",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "duration",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "loanToken",
          "type": "address"
        }
      ],
      "name": "NFTListed",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "loanId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "NFTWithdrawn",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "previousOwner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "OwnershipTransferred",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "loanId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "lender",
          "type": "address"
        }
      ],
      "name": "RepaymentClaimed",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "ETH",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "GRACE_PERIOD",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "MON",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "PLATFORM_FEE",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "USDT",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "allLoanIds",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "allLoans",
      "outputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "nftOwner",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "nftAddress",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "lender",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "loanToken",
              "type": "address"
            }
          ],
          "internalType": "struct NFTLendHub5_v2.LoanDAddressDetails",
          "name": "loanAddDetails",
          "type": "tuple"
        },
        {
          "internalType": "uint256",
          "name": "loanId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "nftId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "loanAmount",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "interestRate",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "loanDuration",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "isLockable",
          "type": "bool"
        },
        {
          "internalType": "bool",
          "name": "loanClaimed",
          "type": "bool"
        },
        {
          "internalType": "bool",
          "name": "repaid",
          "type": "bool"
        },
        {
          "internalType": "bool",
          "name": "active",
          "type": "bool"
        },
        {
          "internalType": "bool",
          "name": "completed",
          "type": "bool"
        },
        {
          "internalType": "bool",
          "name": "cancelled",
          "type": "bool"
        },
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "startTime",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "claimedAt",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "fundedAt",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "repaidAt",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "completedAt",
              "type": "uint256"
            }
          ],
          "internalType": "struct NFTLendHub5_v2.Milestone",
          "name": "milestones",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "loanId",
          "type": "uint256"
        }
      ],
      "name": "cancelLoanAndWithdrawNFT",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "cancelledLoanIds",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "loanId",
          "type": "uint256"
        }
      ],
      "name": "claimLoan",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "loanId",
          "type": "uint256"
        }
      ],
      "name": "claimNFT",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "loanId",
          "type": "uint256"
        }
      ],
      "name": "claimRepayment",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "completedLoanIds",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "loanId",
          "type": "uint256"
        }
      ],
      "name": "fundLoan",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getAllLoans",
      "outputs": [
        {
          "components": [
            {
              "components": [
                {
                  "internalType": "address",
                  "name": "nftOwner",
                  "type": "address"
                },
                {
                  "internalType": "address",
                  "name": "nftAddress",
                  "type": "address"
                },
                {
                  "internalType": "address",
                  "name": "lender",
                  "type": "address"
                },
                {
                  "internalType": "address",
                  "name": "loanToken",
                  "type": "address"
                }
              ],
              "internalType": "struct NFTLendHub5_v2.LoanDAddressDetails",
              "name": "loanAddDetails",
              "type": "tuple"
            },
            {
              "internalType": "uint256",
              "name": "loanId",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "nftId",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "loanAmount",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "interestRate",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "loanDuration",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "isLockable",
              "type": "bool"
            },
            {
              "internalType": "bool",
              "name": "loanClaimed",
              "type": "bool"
            },
            {
              "internalType": "bool",
              "name": "repaid",
              "type": "bool"
            },
            {
              "internalType": "bool",
              "name": "active",
              "type": "bool"
            },
            {
              "internalType": "bool",
              "name": "completed",
              "type": "bool"
            },
            {
              "internalType": "bool",
              "name": "cancelled",
              "type": "bool"
            },
            {
              "components": [
                {
                  "internalType": "uint256",
                  "name": "startTime",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "claimedAt",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "fundedAt",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "repaidAt",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "completedAt",
                  "type": "uint256"
                }
              ],
              "internalType": "struct NFTLendHub5_v2.Milestone",
              "name": "milestones",
              "type": "tuple"
            }
          ],
          "internalType": "struct NFTLendHub5_v2.Loan[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getCompletedLoans",
      "outputs": [
        {
          "components": [
            {
              "components": [
                {
                  "internalType": "address",
                  "name": "nftOwner",
                  "type": "address"
                },
                {
                  "internalType": "address",
                  "name": "nftAddress",
                  "type": "address"
                },
                {
                  "internalType": "address",
                  "name": "lender",
                  "type": "address"
                },
                {
                  "internalType": "address",
                  "name": "loanToken",
                  "type": "address"
                }
              ],
              "internalType": "struct NFTLendHub5_v2.LoanDAddressDetails",
              "name": "loanAddDetails",
              "type": "tuple"
            },
            {
              "internalType": "uint256",
              "name": "loanId",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "nftId",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "loanAmount",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "interestRate",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "loanDuration",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "isLockable",
              "type": "bool"
            },
            {
              "internalType": "bool",
              "name": "loanClaimed",
              "type": "bool"
            },
            {
              "internalType": "bool",
              "name": "repaid",
              "type": "bool"
            },
            {
              "internalType": "bool",
              "name": "active",
              "type": "bool"
            },
            {
              "internalType": "bool",
              "name": "completed",
              "type": "bool"
            },
            {
              "internalType": "bool",
              "name": "cancelled",
              "type": "bool"
            },
            {
              "components": [
                {
                  "internalType": "uint256",
                  "name": "startTime",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "claimedAt",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "fundedAt",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "repaidAt",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "completedAt",
                  "type": "uint256"
                }
              ],
              "internalType": "struct NFTLendHub5_v2.Milestone",
              "name": "milestones",
              "type": "tuple"
            }
          ],
          "internalType": "struct NFTLendHub5_v2.Loan[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "lender",
          "type": "address"
        }
      ],
      "name": "getLenderLoans",
      "outputs": [
        {
          "components": [
            {
              "components": [
                {
                  "internalType": "address",
                  "name": "nftOwner",
                  "type": "address"
                },
                {
                  "internalType": "address",
                  "name": "nftAddress",
                  "type": "address"
                },
                {
                  "internalType": "address",
                  "name": "lender",
                  "type": "address"
                },
                {
                  "internalType": "address",
                  "name": "loanToken",
                  "type": "address"
                }
              ],
              "internalType": "struct NFTLendHub5_v2.LoanDAddressDetails",
              "name": "loanAddDetails",
              "type": "tuple"
            },
            {
              "internalType": "uint256",
              "name": "loanId",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "nftId",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "loanAmount",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "interestRate",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "loanDuration",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "isLockable",
              "type": "bool"
            },
            {
              "internalType": "bool",
              "name": "loanClaimed",
              "type": "bool"
            },
            {
              "internalType": "bool",
              "name": "repaid",
              "type": "bool"
            },
            {
              "internalType": "bool",
              "name": "active",
              "type": "bool"
            },
            {
              "internalType": "bool",
              "name": "completed",
              "type": "bool"
            },
            {
              "internalType": "bool",
              "name": "cancelled",
              "type": "bool"
            },
            {
              "components": [
                {
                  "internalType": "uint256",
                  "name": "startTime",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "claimedAt",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "fundedAt",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "repaidAt",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "completedAt",
                  "type": "uint256"
                }
              ],
              "internalType": "struct NFTLendHub5_v2.Milestone",
              "name": "milestones",
              "type": "tuple"
            }
          ],
          "internalType": "struct NFTLendHub5_v2.Loan[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getUnfundedLoans",
      "outputs": [
        {
          "components": [
            {
              "components": [
                {
                  "internalType": "address",
                  "name": "nftOwner",
                  "type": "address"
                },
                {
                  "internalType": "address",
                  "name": "nftAddress",
                  "type": "address"
                },
                {
                  "internalType": "address",
                  "name": "lender",
                  "type": "address"
                },
                {
                  "internalType": "address",
                  "name": "loanToken",
                  "type": "address"
                }
              ],
              "internalType": "struct NFTLendHub5_v2.LoanDAddressDetails",
              "name": "loanAddDetails",
              "type": "tuple"
            },
            {
              "internalType": "uint256",
              "name": "loanId",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "nftId",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "loanAmount",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "interestRate",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "loanDuration",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "isLockable",
              "type": "bool"
            },
            {
              "internalType": "bool",
              "name": "loanClaimed",
              "type": "bool"
            },
            {
              "internalType": "bool",
              "name": "repaid",
              "type": "bool"
            },
            {
              "internalType": "bool",
              "name": "active",
              "type": "bool"
            },
            {
              "internalType": "bool",
              "name": "completed",
              "type": "bool"
            },
            {
              "internalType": "bool",
              "name": "cancelled",
              "type": "bool"
            },
            {
              "components": [
                {
                  "internalType": "uint256",
                  "name": "startTime",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "claimedAt",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "fundedAt",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "repaidAt",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "completedAt",
                  "type": "uint256"
                }
              ],
              "internalType": "struct NFTLendHub5_v2.Milestone",
              "name": "milestones",
              "type": "tuple"
            }
          ],
          "internalType": "struct NFTLendHub5_v2.Loan[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "user",
          "type": "address"
        }
      ],
      "name": "getUserLoans",
      "outputs": [
        {
          "components": [
            {
              "components": [
                {
                  "internalType": "address",
                  "name": "nftOwner",
                  "type": "address"
                },
                {
                  "internalType": "address",
                  "name": "nftAddress",
                  "type": "address"
                },
                {
                  "internalType": "address",
                  "name": "lender",
                  "type": "address"
                },
                {
                  "internalType": "address",
                  "name": "loanToken",
                  "type": "address"
                }
              ],
              "internalType": "struct NFTLendHub5_v2.LoanDAddressDetails",
              "name": "loanAddDetails",
              "type": "tuple"
            },
            {
              "internalType": "uint256",
              "name": "loanId",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "nftId",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "loanAmount",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "interestRate",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "loanDuration",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "isLockable",
              "type": "bool"
            },
            {
              "internalType": "bool",
              "name": "loanClaimed",
              "type": "bool"
            },
            {
              "internalType": "bool",
              "name": "repaid",
              "type": "bool"
            },
            {
              "internalType": "bool",
              "name": "active",
              "type": "bool"
            },
            {
              "internalType": "bool",
              "name": "completed",
              "type": "bool"
            },
            {
              "internalType": "bool",
              "name": "cancelled",
              "type": "bool"
            },
            {
              "components": [
                {
                  "internalType": "uint256",
                  "name": "startTime",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "claimedAt",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "fundedAt",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "repaidAt",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "completedAt",
                  "type": "uint256"
                }
              ],
              "internalType": "struct NFTLendHub5_v2.Milestone",
              "name": "milestones",
              "type": "tuple"
            }
          ],
          "internalType": "struct NFTLendHub5_v2.Loan[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "isNFTListed",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "lenderLoanIds",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_nftAddress",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_nftId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_loanAmount",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_interestRate",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_loanDuration",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "_loanToken",
          "type": "address"
        }
      ],
      "name": "listNFTForLoan",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "loanCounter",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "loans",
      "outputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "nftOwner",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "nftAddress",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "lender",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "loanToken",
              "type": "address"
            }
          ],
          "internalType": "struct NFTLendHub5_v2.LoanDAddressDetails",
          "name": "loanAddDetails",
          "type": "tuple"
        },
        {
          "internalType": "uint256",
          "name": "loanId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "nftId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "loanAmount",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "interestRate",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "loanDuration",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "isLockable",
          "type": "bool"
        },
        {
          "internalType": "bool",
          "name": "loanClaimed",
          "type": "bool"
        },
        {
          "internalType": "bool",
          "name": "repaid",
          "type": "bool"
        },
        {
          "internalType": "bool",
          "name": "active",
          "type": "bool"
        },
        {
          "internalType": "bool",
          "name": "completed",
          "type": "bool"
        },
        {
          "internalType": "bool",
          "name": "cancelled",
          "type": "bool"
        },
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "startTime",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "claimedAt",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "fundedAt",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "repaidAt",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "completedAt",
              "type": "uint256"
            }
          ],
          "internalType": "struct NFTLendHub5_v2.Milestone",
          "name": "milestones",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "platformWallet",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "renounceOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "loanId",
          "type": "uint256"
        }
      ],
      "name": "repayLoan",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "totalLoanVolume",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "userLoanIds",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "withdraw",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "tokenAddress",
          "type": "address"
        }
      ],
      "name": "withdrawERC20",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]