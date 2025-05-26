// export const NFT_LENDHUB_ADDRESS = '0x4F672C822d9a4B9cE92D247C8FC3bf1C471E2f39';
// export const NFT_LENDHUB_ADDRESS = '0x7c4d115891d401888dd54a7a7f27ff4bB5DD25cF';
// export const NFT_LENDHUB_ADDRESS = '0xa7507707FD388989fa794372677b89494517f75C'; // contract 4
export const NFT_LENDHUB_ADDRESS = '0xC0743c3C22801204245A884faaF65E3bFAD341Ca'; // contract 5
// export const NFT_LENDHUB_ADDRESS_V2 ='0x756272Db280D974652243e86050129f9B2A57833'; // version 2 contract 1
// export const NFT_LENDHUB_ADDRESS_V2 = '0x801fe0fFAb9eAB0003ba4b3BeB3230C26107CAEf'; // version 2 contract 2
// export const NFT_LENDHUB_ADDRESS_V2 ='0x4794aED85DbD87bc7AF67e163d4c27e5b63F40cc'; // version 2 contract 3
// export const NFT_LENDHUB_ADDRESS_V2 ='0x47a00eE030c4200431995b7C7c2c6926F2DCA1C1'; // version 2 contract 4
// export const NFT_LENDHUB_ADDRESS_V2 = '0xe176d225433d1eb258Ed7f25C2e3133a15d26631'; // version 2 contract 5
// export const NFT_LENDHUB_ADDRESS_V2 ='0x7D572e92aE7b7B903aeDFEa1ddCe65B411067A51'; // version 2 contract 6
export const NFT_LENDHUB_ADDRESS_V2 =
  '0x9578f8b8885eDB70A9905f57186f7A1585903b1a'; // version 2 contract 7
// '0x90F6FE7691306C0a03b98a8dE553A70aa86f3808'; // version 2 contract 8
// export const NFT_LENDHUB_ADDRESS = '0xAaa13C99Cd25b782C46930a72BCCD26654479e76'; // contract 6
// address: '0x7c4d115891d401888dd54a7a7f27ff4bB5DD25cF',
export const LENDING_POOL_ADDRESS =
  '0xCCec83c2e4758f0cD8C1baD23Cc66F53b1C37Fb0';
export const LOAN_GOVERNANCE_ADDRESS =
  '0x34f08447ac38AD7ED5f2D3ac0f007f70B8B897D6';
export const NFT_ADDRESS = '0xCC133Be7950d9c00B78BCbFa470A8E63c3DD7BfC';
export const WMON_ADDRESS = '0x760AfE86e5de5fa0Ee542fc7B7B713e1c5425701';
export const USDT_ADDRESS = '0x88b8E2161DEDC77EF4ab7585569D2415a1C1055D';
export const ETH_ADDRESS = '0xf817257fed379853cDe0fa4F97AB987181B1E5Ea';

//
// export const ILockAddress = '0xC840DA9957d641684Fc05565A9756df872879889';
export const ILockAddress = '0x92B6222e22C114fA11985F1173a423b8Ab0059E6'; // with new unlock and transfer function

export const NFT_LENDHUB_ABI_V2 = [
  {
    inputs: [
      {
        internalType: 'address',
        name: '_MON',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_USDT',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_ETH',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_platformWallet',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'loanId',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'borrower',
        type: 'address',
      },
    ],
    name: 'LoanClaimed',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'loanId',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'lender',
        type: 'address',
      },
    ],
    name: 'LoanFunded',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'loanId',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'borrower',
        type: 'address',
      },
    ],
    name: 'LoanRepaid',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'loanId',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'lender',
        type: 'address',
      },
    ],
    name: 'NFTClaimedByLender',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'loanId',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'nftOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'nftAddress',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'nftId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'loanAmount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'interestRate',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'duration',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'loanToken',
        type: 'address',
      },
    ],
    name: 'NFTListed',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'loanId',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
    ],
    name: 'NFTWithdrawn',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'loanId',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'lender',
        type: 'address',
      },
    ],
    name: 'RepaymentClaimed',
    type: 'event',
  },
  {
    inputs: [],
    name: 'ETH',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'GRACE_PERIOD',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'MON',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'PLATFORM_FEE',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'USDT',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'allLoanIds',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'allLoans',
    outputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'nftOwner',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'nftAddress',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'lender',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'loanToken',
            type: 'address',
          },
        ],
        internalType: 'struct NFTLendHub5_v2.LoanDAddressDetails',
        name: 'loanAddDetails',
        type: 'tuple',
      },
      {
        internalType: 'uint256',
        name: 'loanId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'nftId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'loanAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'interestRate',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'loanDuration',
        type: 'uint256',
      },
      {
        internalType: 'bool',
        name: 'isLockable',
        type: 'bool',
      },
      {
        internalType: 'bool',
        name: 'loanClaimed',
        type: 'bool',
      },
      {
        internalType: 'bool',
        name: 'repaid',
        type: 'bool',
      },
      {
        internalType: 'bool',
        name: 'active',
        type: 'bool',
      },
      {
        internalType: 'bool',
        name: 'completed',
        type: 'bool',
      },
      {
        internalType: 'bool',
        name: 'cancelled',
        type: 'bool',
      },
      {
        components: [
          {
            internalType: 'uint256',
            name: 'startTime',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'claimedAt',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'fundedAt',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'repaidAt',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'completedAt',
            type: 'uint256',
          },
        ],
        internalType: 'struct NFTLendHub5_v2.Milestone',
        name: 'milestones',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'loanId',
        type: 'uint256',
      },
    ],
    name: 'cancelLoanAndWithdrawNFT',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'cancelledLoanIds',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'loanId',
        type: 'uint256',
      },
    ],
    name: 'claimLoan',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'loanId',
        type: 'uint256',
      },
    ],
    name: 'claimNFT',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'loanId',
        type: 'uint256',
      },
    ],
    name: 'claimRepayment',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'completedLoanIds',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'loanId',
        type: 'uint256',
      },
    ],
    name: 'fundLoan',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getAllLoans',
    outputs: [
      {
        components: [
          {
            components: [
              {
                internalType: 'address',
                name: 'nftOwner',
                type: 'address',
              },
              {
                internalType: 'address',
                name: 'nftAddress',
                type: 'address',
              },
              {
                internalType: 'address',
                name: 'lender',
                type: 'address',
              },
              {
                internalType: 'address',
                name: 'loanToken',
                type: 'address',
              },
            ],
            internalType: 'struct NFTLendHub5_v2.LoanDAddressDetails',
            name: 'loanAddDetails',
            type: 'tuple',
          },
          {
            internalType: 'uint256',
            name: 'loanId',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'nftId',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'loanAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'interestRate',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'loanDuration',
            type: 'uint256',
          },
          {
            internalType: 'bool',
            name: 'isLockable',
            type: 'bool',
          },
          {
            internalType: 'bool',
            name: 'loanClaimed',
            type: 'bool',
          },
          {
            internalType: 'bool',
            name: 'repaid',
            type: 'bool',
          },
          {
            internalType: 'bool',
            name: 'active',
            type: 'bool',
          },
          {
            internalType: 'bool',
            name: 'completed',
            type: 'bool',
          },
          {
            internalType: 'bool',
            name: 'cancelled',
            type: 'bool',
          },
          {
            components: [
              {
                internalType: 'uint256',
                name: 'startTime',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'claimedAt',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'fundedAt',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'repaidAt',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'completedAt',
                type: 'uint256',
              },
            ],
            internalType: 'struct NFTLendHub5_v2.Milestone',
            name: 'milestones',
            type: 'tuple',
          },
        ],
        internalType: 'struct NFTLendHub5_v2.Loan[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getCompletedLoans',
    outputs: [
      {
        components: [
          {
            components: [
              {
                internalType: 'address',
                name: 'nftOwner',
                type: 'address',
              },
              {
                internalType: 'address',
                name: 'nftAddress',
                type: 'address',
              },
              {
                internalType: 'address',
                name: 'lender',
                type: 'address',
              },
              {
                internalType: 'address',
                name: 'loanToken',
                type: 'address',
              },
            ],
            internalType: 'struct NFTLendHub5_v2.LoanDAddressDetails',
            name: 'loanAddDetails',
            type: 'tuple',
          },
          {
            internalType: 'uint256',
            name: 'loanId',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'nftId',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'loanAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'interestRate',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'loanDuration',
            type: 'uint256',
          },
          {
            internalType: 'bool',
            name: 'isLockable',
            type: 'bool',
          },
          {
            internalType: 'bool',
            name: 'loanClaimed',
            type: 'bool',
          },
          {
            internalType: 'bool',
            name: 'repaid',
            type: 'bool',
          },
          {
            internalType: 'bool',
            name: 'active',
            type: 'bool',
          },
          {
            internalType: 'bool',
            name: 'completed',
            type: 'bool',
          },
          {
            internalType: 'bool',
            name: 'cancelled',
            type: 'bool',
          },
          {
            components: [
              {
                internalType: 'uint256',
                name: 'startTime',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'claimedAt',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'fundedAt',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'repaidAt',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'completedAt',
                type: 'uint256',
              },
            ],
            internalType: 'struct NFTLendHub5_v2.Milestone',
            name: 'milestones',
            type: 'tuple',
          },
        ],
        internalType: 'struct NFTLendHub5_v2.Loan[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'lender',
        type: 'address',
      },
    ],
    name: 'getLenderLoans',
    outputs: [
      {
        components: [
          {
            components: [
              {
                internalType: 'address',
                name: 'nftOwner',
                type: 'address',
              },
              {
                internalType: 'address',
                name: 'nftAddress',
                type: 'address',
              },
              {
                internalType: 'address',
                name: 'lender',
                type: 'address',
              },
              {
                internalType: 'address',
                name: 'loanToken',
                type: 'address',
              },
            ],
            internalType: 'struct NFTLendHub5_v2.LoanDAddressDetails',
            name: 'loanAddDetails',
            type: 'tuple',
          },
          {
            internalType: 'uint256',
            name: 'loanId',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'nftId',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'loanAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'interestRate',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'loanDuration',
            type: 'uint256',
          },
          {
            internalType: 'bool',
            name: 'isLockable',
            type: 'bool',
          },
          {
            internalType: 'bool',
            name: 'loanClaimed',
            type: 'bool',
          },
          {
            internalType: 'bool',
            name: 'repaid',
            type: 'bool',
          },
          {
            internalType: 'bool',
            name: 'active',
            type: 'bool',
          },
          {
            internalType: 'bool',
            name: 'completed',
            type: 'bool',
          },
          {
            internalType: 'bool',
            name: 'cancelled',
            type: 'bool',
          },
          {
            components: [
              {
                internalType: 'uint256',
                name: 'startTime',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'claimedAt',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'fundedAt',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'repaidAt',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'completedAt',
                type: 'uint256',
              },
            ],
            internalType: 'struct NFTLendHub5_v2.Milestone',
            name: 'milestones',
            type: 'tuple',
          },
        ],
        internalType: 'struct NFTLendHub5_v2.Loan[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getUnfundedLoans',
    outputs: [
      {
        components: [
          {
            components: [
              {
                internalType: 'address',
                name: 'nftOwner',
                type: 'address',
              },
              {
                internalType: 'address',
                name: 'nftAddress',
                type: 'address',
              },
              {
                internalType: 'address',
                name: 'lender',
                type: 'address',
              },
              {
                internalType: 'address',
                name: 'loanToken',
                type: 'address',
              },
            ],
            internalType: 'struct NFTLendHub5_v2.LoanDAddressDetails',
            name: 'loanAddDetails',
            type: 'tuple',
          },
          {
            internalType: 'uint256',
            name: 'loanId',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'nftId',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'loanAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'interestRate',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'loanDuration',
            type: 'uint256',
          },
          {
            internalType: 'bool',
            name: 'isLockable',
            type: 'bool',
          },
          {
            internalType: 'bool',
            name: 'loanClaimed',
            type: 'bool',
          },
          {
            internalType: 'bool',
            name: 'repaid',
            type: 'bool',
          },
          {
            internalType: 'bool',
            name: 'active',
            type: 'bool',
          },
          {
            internalType: 'bool',
            name: 'completed',
            type: 'bool',
          },
          {
            internalType: 'bool',
            name: 'cancelled',
            type: 'bool',
          },
          {
            components: [
              {
                internalType: 'uint256',
                name: 'startTime',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'claimedAt',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'fundedAt',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'repaidAt',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'completedAt',
                type: 'uint256',
              },
            ],
            internalType: 'struct NFTLendHub5_v2.Milestone',
            name: 'milestones',
            type: 'tuple',
          },
        ],
        internalType: 'struct NFTLendHub5_v2.Loan[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
    ],
    name: 'getUserLoans',
    outputs: [
      {
        components: [
          {
            components: [
              {
                internalType: 'address',
                name: 'nftOwner',
                type: 'address',
              },
              {
                internalType: 'address',
                name: 'nftAddress',
                type: 'address',
              },
              {
                internalType: 'address',
                name: 'lender',
                type: 'address',
              },
              {
                internalType: 'address',
                name: 'loanToken',
                type: 'address',
              },
            ],
            internalType: 'struct NFTLendHub5_v2.LoanDAddressDetails',
            name: 'loanAddDetails',
            type: 'tuple',
          },
          {
            internalType: 'uint256',
            name: 'loanId',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'nftId',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'loanAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'interestRate',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'loanDuration',
            type: 'uint256',
          },
          {
            internalType: 'bool',
            name: 'isLockable',
            type: 'bool',
          },
          {
            internalType: 'bool',
            name: 'loanClaimed',
            type: 'bool',
          },
          {
            internalType: 'bool',
            name: 'repaid',
            type: 'bool',
          },
          {
            internalType: 'bool',
            name: 'active',
            type: 'bool',
          },
          {
            internalType: 'bool',
            name: 'completed',
            type: 'bool',
          },
          {
            internalType: 'bool',
            name: 'cancelled',
            type: 'bool',
          },
          {
            components: [
              {
                internalType: 'uint256',
                name: 'startTime',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'claimedAt',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'fundedAt',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'repaidAt',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'completedAt',
                type: 'uint256',
              },
            ],
            internalType: 'struct NFTLendHub5_v2.Milestone',
            name: 'milestones',
            type: 'tuple',
          },
        ],
        internalType: 'struct NFTLendHub5_v2.Loan[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'isNFTListed',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'lenderLoanIds',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_nftAddress',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_nftId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_loanAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_interestRate',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_loanDuration',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: '_loanToken',
        type: 'address',
      },
    ],
    name: 'listNFTForLoan',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'loanCounter',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'loans',
    outputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'nftOwner',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'nftAddress',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'lender',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'loanToken',
            type: 'address',
          },
        ],
        internalType: 'struct NFTLendHub5_v2.LoanDAddressDetails',
        name: 'loanAddDetails',
        type: 'tuple',
      },
      {
        internalType: 'uint256',
        name: 'loanId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'nftId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'loanAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'interestRate',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'loanDuration',
        type: 'uint256',
      },
      {
        internalType: 'bool',
        name: 'isLockable',
        type: 'bool',
      },
      {
        internalType: 'bool',
        name: 'loanClaimed',
        type: 'bool',
      },
      {
        internalType: 'bool',
        name: 'repaid',
        type: 'bool',
      },
      {
        internalType: 'bool',
        name: 'active',
        type: 'bool',
      },
      {
        internalType: 'bool',
        name: 'completed',
        type: 'bool',
      },
      {
        internalType: 'bool',
        name: 'cancelled',
        type: 'bool',
      },
      {
        components: [
          {
            internalType: 'uint256',
            name: 'startTime',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'claimedAt',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'fundedAt',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'repaidAt',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'completedAt',
            type: 'uint256',
          },
        ],
        internalType: 'struct NFTLendHub5_v2.Milestone',
        name: 'milestones',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'platformWallet',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'loanId',
        type: 'uint256',
      },
    ],
    name: 'repayLoan',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalLoanVolume',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'userLoanIds',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'withdraw',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'tokenAddress',
        type: 'address',
      },
    ],
    name: 'withdrawERC20',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];

/* export const NFT_LENDHUB_ABI = [
  {
    inputs: [
      {
        internalType: 'address',
        name: '_MON',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_USDT',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_ETH',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_platformWallet',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'loanId',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'borrower',
        type: 'address',
      },
    ],
    name: 'LoanClaimed',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'loanId',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'lender',
        type: 'address',
      },
    ],
    name: 'LoanFunded',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'loanId',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'borrower',
        type: 'address',
      },
    ],
    name: 'LoanRepaid',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'loanId',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'lender',
        type: 'address',
      },
    ],
    name: 'NFTClaimedByLender',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'loanId',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'nftOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'nftAddress',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'nftId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'loanAmount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'interestRate',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'duration',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'loanToken',
        type: 'address',
      },
    ],
    name: 'NFTListed',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'loanId',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
    ],
    name: 'NFTWithdrawn',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'loanId',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'lender',
        type: 'address',
      },
    ],
    name: 'RepaymentClaimed',
    type: 'event',
  },
  {
    inputs: [],
    name: 'ETH',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'GRACE_PERIOD',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'MON',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'PLATFORM_FEE',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'USDT',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'allLoanIds',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'allLoans',
    outputs: [
      {
        internalType: 'uint256',
        name: 'loanId',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'nftOwner',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'nftAddress',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'nftId',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'lender',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'loanAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'interestRate',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'loanDuration',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'startTime',
        type: 'uint256',
      },
      {
        internalType: 'bool',
        name: 'loanClaimed',
        type: 'bool',
      },
      {
        internalType: 'bool',
        name: 'repaid',
        type: 'bool',
      },
      {
        internalType: 'address',
        name: 'loanToken',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: 'active',
        type: 'bool',
      },
      {
        internalType: 'bool',
        name: 'completed',
        type: 'bool',
      },
      {
        internalType: 'bool',
        name: 'cancelled',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'loanId',
        type: 'uint256',
      },
    ],
    name: 'cancelLoanAndWithdrawNFT',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'cancelledLoanIds',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'loanId',
        type: 'uint256',
      },
    ],
    name: 'claimLoan',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'loanId',
        type: 'uint256',
      },
    ],
    name: 'claimNFT',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'loanId',
        type: 'uint256',
      },
    ],
    name: 'claimRepayment',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'completedLoanIds',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'loanId',
        type: 'uint256',
      },
    ],
    name: 'fundLoan',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getAllLoans',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'loanId',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'nftOwner',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'nftAddress',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'nftId',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'lender',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'loanAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'interestRate',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'loanDuration',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'startTime',
            type: 'uint256',
          },
          {
            internalType: 'bool',
            name: 'loanClaimed',
            type: 'bool',
          },
          {
            internalType: 'bool',
            name: 'repaid',
            type: 'bool',
          },
          {
            internalType: 'address',
            name: 'loanToken',
            type: 'address',
          },
          {
            internalType: 'bool',
            name: 'active',
            type: 'bool',
          },
          {
            internalType: 'bool',
            name: 'completed',
            type: 'bool',
          },
          {
            internalType: 'bool',
            name: 'cancelled',
            type: 'bool',
          },
        ],
        internalType: 'struct NFTLendHub4.Loan[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getCompletedLoans',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'loanId',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'nftOwner',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'nftAddress',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'nftId',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'lender',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'loanAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'interestRate',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'loanDuration',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'startTime',
            type: 'uint256',
          },
          {
            internalType: 'bool',
            name: 'loanClaimed',
            type: 'bool',
          },
          {
            internalType: 'bool',
            name: 'repaid',
            type: 'bool',
          },
          {
            internalType: 'address',
            name: 'loanToken',
            type: 'address',
          },
          {
            internalType: 'bool',
            name: 'active',
            type: 'bool',
          },
          {
            internalType: 'bool',
            name: 'completed',
            type: 'bool',
          },
          {
            internalType: 'bool',
            name: 'cancelled',
            type: 'bool',
          },
        ],
        internalType: 'struct NFTLendHub4.Loan[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'lender',
        type: 'address',
      },
    ],
    name: 'getLenderLoans',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'loanId',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'nftOwner',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'nftAddress',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'nftId',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'lender',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'loanAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'interestRate',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'loanDuration',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'startTime',
            type: 'uint256',
          },
          {
            internalType: 'bool',
            name: 'loanClaimed',
            type: 'bool',
          },
          {
            internalType: 'bool',
            name: 'repaid',
            type: 'bool',
          },
          {
            internalType: 'address',
            name: 'loanToken',
            type: 'address',
          },
          {
            internalType: 'bool',
            name: 'active',
            type: 'bool',
          },
          {
            internalType: 'bool',
            name: 'completed',
            type: 'bool',
          },
          {
            internalType: 'bool',
            name: 'cancelled',
            type: 'bool',
          },
        ],
        internalType: 'struct NFTLendHub4.Loan[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getUnfundedLoans',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'loanId',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'nftOwner',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'nftAddress',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'nftId',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'lender',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'loanAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'interestRate',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'loanDuration',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'startTime',
            type: 'uint256',
          },
          {
            internalType: 'bool',
            name: 'loanClaimed',
            type: 'bool',
          },
          {
            internalType: 'bool',
            name: 'repaid',
            type: 'bool',
          },
          {
            internalType: 'address',
            name: 'loanToken',
            type: 'address',
          },
          {
            internalType: 'bool',
            name: 'active',
            type: 'bool',
          },
          {
            internalType: 'bool',
            name: 'completed',
            type: 'bool',
          },
          {
            internalType: 'bool',
            name: 'cancelled',
            type: 'bool',
          },
        ],
        internalType: 'struct NFTLendHub4.Loan[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
    ],
    name: 'getUserLoans',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'loanId',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'nftOwner',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'nftAddress',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'nftId',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'lender',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'loanAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'interestRate',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'loanDuration',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'startTime',
            type: 'uint256',
          },
          {
            internalType: 'bool',
            name: 'loanClaimed',
            type: 'bool',
          },
          {
            internalType: 'bool',
            name: 'repaid',
            type: 'bool',
          },
          {
            internalType: 'address',
            name: 'loanToken',
            type: 'address',
          },
          {
            internalType: 'bool',
            name: 'active',
            type: 'bool',
          },
          {
            internalType: 'bool',
            name: 'completed',
            type: 'bool',
          },
          {
            internalType: 'bool',
            name: 'cancelled',
            type: 'bool',
          },
        ],
        internalType: 'struct NFTLendHub4.Loan[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'lenderLoanIds',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_nftAddress',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_nftId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_loanAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_interestRate',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_loanDuration',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: '_loanToken',
        type: 'address',
      },
    ],
    name: 'listNFTForLoan',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'loanCounter',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'loans',
    outputs: [
      {
        internalType: 'uint256',
        name: 'loanId',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'nftOwner',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'nftAddress',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'nftId',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'lender',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'loanAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'interestRate',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'loanDuration',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'startTime',
        type: 'uint256',
      },
      {
        internalType: 'bool',
        name: 'loanClaimed',
        type: 'bool',
      },
      {
        internalType: 'bool',
        name: 'repaid',
        type: 'bool',
      },
      {
        internalType: 'address',
        name: 'loanToken',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: 'active',
        type: 'bool',
      },
      {
        internalType: 'bool',
        name: 'completed',
        type: 'bool',
      },
      {
        internalType: 'bool',
        name: 'cancelled',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'platformWallet',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'loanId',
        type: 'uint256',
      },
    ],
    name: 'repayLoan',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'userLoanIds',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'withdraw',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_tokenAddress',
        type: 'address',
      },
    ],
    name: 'withdrawERC20',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
]; */

export const NFT_LENDHUB_ABI = [
  {
    inputs: [
      {
        internalType: 'address',
        name: '_MON',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_USDT',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_ETH',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_platformWallet',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'loanId',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'borrower',
        type: 'address',
      },
    ],
    name: 'LoanClaimed',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'loanId',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'lender',
        type: 'address',
      },
    ],
    name: 'LoanFunded',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'loanId',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'borrower',
        type: 'address',
      },
    ],
    name: 'LoanRepaid',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'loanId',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'lender',
        type: 'address',
      },
    ],
    name: 'NFTClaimedByLender',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'loanId',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'nftOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'nftAddress',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'nftId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'loanAmount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'interestRate',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'duration',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'loanToken',
        type: 'address',
      },
    ],
    name: 'NFTListed',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'loanId',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'lender',
        type: 'address',
      },
    ],
    name: 'RepaymentClaimed',
    type: 'event',
  },
  {
    inputs: [],
    name: 'ETH',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'GRACE_PERIOD',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'MON',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'PLATFORM_FEE',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'USDT',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'allLoanIds',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'allLoans',
    outputs: [
      {
        internalType: 'uint256',
        name: 'loanId',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'nftOwner',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'nftAddress',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'nftId',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'lender',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'loanAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'interestRate',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'loanDuration',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'startTime',
        type: 'uint256',
      },
      {
        internalType: 'bool',
        name: 'loanClaimed',
        type: 'bool',
      },
      {
        internalType: 'bool',
        name: 'repaid',
        type: 'bool',
      },
      {
        internalType: 'address',
        name: 'loanToken',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: 'active',
        type: 'bool',
      },
      {
        internalType: 'bool',
        name: 'completed',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'loanId',
        type: 'uint256',
      },
    ],
    name: 'claimLoan',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'loanId',
        type: 'uint256',
      },
    ],
    name: 'claimNFT',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'loanId',
        type: 'uint256',
      },
    ],
    name: 'claimRepayment',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'completedLoanIds',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'loanId',
        type: 'uint256',
      },
    ],
    name: 'fundLoan',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getAllLoans',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'loanId',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'nftOwner',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'nftAddress',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'nftId',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'lender',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'loanAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'interestRate',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'loanDuration',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'startTime',
            type: 'uint256',
          },
          {
            internalType: 'bool',
            name: 'loanClaimed',
            type: 'bool',
          },
          {
            internalType: 'bool',
            name: 'repaid',
            type: 'bool',
          },
          {
            internalType: 'address',
            name: 'loanToken',
            type: 'address',
          },
          {
            internalType: 'bool',
            name: 'active',
            type: 'bool',
          },
          {
            internalType: 'bool',
            name: 'completed',
            type: 'bool',
          },
        ],
        internalType: 'struct NFTLendHub4.Loan[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getCompletedLoans',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'loanId',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'nftOwner',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'nftAddress',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'nftId',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'lender',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'loanAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'interestRate',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'loanDuration',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'startTime',
            type: 'uint256',
          },
          {
            internalType: 'bool',
            name: 'loanClaimed',
            type: 'bool',
          },
          {
            internalType: 'bool',
            name: 'repaid',
            type: 'bool',
          },
          {
            internalType: 'address',
            name: 'loanToken',
            type: 'address',
          },
          {
            internalType: 'bool',
            name: 'active',
            type: 'bool',
          },
          {
            internalType: 'bool',
            name: 'completed',
            type: 'bool',
          },
        ],
        internalType: 'struct NFTLendHub4.Loan[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'lender',
        type: 'address',
      },
    ],
    name: 'getLenderLoans',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'loanId',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'nftOwner',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'nftAddress',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'nftId',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'lender',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'loanAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'interestRate',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'loanDuration',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'startTime',
            type: 'uint256',
          },
          {
            internalType: 'bool',
            name: 'loanClaimed',
            type: 'bool',
          },
          {
            internalType: 'bool',
            name: 'repaid',
            type: 'bool',
          },
          {
            internalType: 'address',
            name: 'loanToken',
            type: 'address',
          },
          {
            internalType: 'bool',
            name: 'active',
            type: 'bool',
          },
          {
            internalType: 'bool',
            name: 'completed',
            type: 'bool',
          },
        ],
        internalType: 'struct NFTLendHub4.Loan[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getUnfundedLoans',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'loanId',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'nftOwner',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'nftAddress',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'nftId',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'lender',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'loanAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'interestRate',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'loanDuration',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'startTime',
            type: 'uint256',
          },
          {
            internalType: 'bool',
            name: 'loanClaimed',
            type: 'bool',
          },
          {
            internalType: 'bool',
            name: 'repaid',
            type: 'bool',
          },
          {
            internalType: 'address',
            name: 'loanToken',
            type: 'address',
          },
          {
            internalType: 'bool',
            name: 'active',
            type: 'bool',
          },
          {
            internalType: 'bool',
            name: 'completed',
            type: 'bool',
          },
        ],
        internalType: 'struct NFTLendHub4.Loan[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
    ],
    name: 'getUserLoans',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'loanId',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'nftOwner',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'nftAddress',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'nftId',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'lender',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'loanAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'interestRate',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'loanDuration',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'startTime',
            type: 'uint256',
          },
          {
            internalType: 'bool',
            name: 'loanClaimed',
            type: 'bool',
          },
          {
            internalType: 'bool',
            name: 'repaid',
            type: 'bool',
          },
          {
            internalType: 'address',
            name: 'loanToken',
            type: 'address',
          },
          {
            internalType: 'bool',
            name: 'active',
            type: 'bool',
          },
          {
            internalType: 'bool',
            name: 'completed',
            type: 'bool',
          },
        ],
        internalType: 'struct NFTLendHub4.Loan[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'lenderLoanIds',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_nftAddress',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_nftId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_loanAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_interestRate',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_loanDuration',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: '_loanToken',
        type: 'address',
      },
    ],
    name: 'listNFTForLoan',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'loanCounter',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'loans',
    outputs: [
      {
        internalType: 'uint256',
        name: 'loanId',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'nftOwner',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'nftAddress',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'nftId',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'lender',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'loanAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'interestRate',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'loanDuration',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'startTime',
        type: 'uint256',
      },
      {
        internalType: 'bool',
        name: 'loanClaimed',
        type: 'bool',
      },
      {
        internalType: 'bool',
        name: 'repaid',
        type: 'bool',
      },
      {
        internalType: 'address',
        name: 'loanToken',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: 'active',
        type: 'bool',
      },
      {
        internalType: 'bool',
        name: 'completed',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'platformWallet',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'loanId',
        type: 'uint256',
      },
    ],
    name: 'repayLoan',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'userLoanIds',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'withdraw',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_tokenAddress',
        type: 'address',
      },
    ],
    name: 'withdrawERC20',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];

export const ERC20_ABI = [
  {
    inputs: [
      { internalType: 'address', name: 'spender', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'decimals',
    outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'symbol',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
];

export const ILockABI = [
  {
    inputs: [
      {
        internalType: 'string',
        name: '_name',
        type: 'string',
      },
      {
        internalType: 'string',
        name: '_symbol',
        type: 'string',
      },
      {
        internalType: 'string',
        name: '_TokenURI',
        type: 'string',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [],
    name: 'ERC721EnumerableForbiddenBatchMint',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
    ],
    name: 'ERC721IncorrectOwner',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'operator',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'ERC721InsufficientApproval',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'approver',
        type: 'address',
      },
    ],
    name: 'ERC721InvalidApprover',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'operator',
        type: 'address',
      },
    ],
    name: 'ERC721InvalidOperator',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
    ],
    name: 'ERC721InvalidOwner',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'receiver',
        type: 'address',
      },
    ],
    name: 'ERC721InvalidReceiver',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
    ],
    name: 'ERC721InvalidSender',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'ERC721NonexistentToken',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'index',
        type: 'uint256',
      },
    ],
    name: 'ERC721OutOfBoundsIndex',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
    ],
    name: 'OwnableInvalidOwner',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'OwnableUnauthorizedAccount',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'approved',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'Approval',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'operator',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'bool',
        name: 'approved',
        type: 'bool',
      },
    ],
    name: 'ApprovalForAll',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: '_fromTokenId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: '_toTokenId',
        type: 'uint256',
      },
    ],
    name: 'BatchMetadataUpdate',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'triggeredBy',
        type: 'address',
      },
    ],
    name: 'EmergencyUnlocked',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'manager',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'duration',
        type: 'uint256',
      },
    ],
    name: 'Locked',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: '_tokenId',
        type: 'uint256',
      },
    ],
    name: 'MetadataUpdate',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'Transfer',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'Unlocked',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'borrower',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'lender',
        type: 'address',
      },
    ],
    name: 'UnlockedAndTransfered',
    type: 'event',
  },
  {
    inputs: [],
    name: 'MAX_SUPPLY',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: '_tokenURI',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'approve',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
    ],
    name: 'balanceOf',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'emergencyUnlock',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'getApproved',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'getLockInfo',
    outputs: [
      {
        internalType: 'bool',
        name: 'locked',
        type: 'bool',
      },
      {
        internalType: 'address',
        name: 'manager',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'lockTimestamp',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'duration',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'operator',
        type: 'address',
      },
    ],
    name: 'isApprovedForAll',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'isLocked',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'manager',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'durationInSeconds',
        type: 'uint256',
      },
    ],
    name: 'lock',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
    ],
    name: 'mint',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'name',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'nextTokenId',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'ownerOf',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
      {
        internalType: 'bytes',
        name: 'data',
        type: 'bytes',
      },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'operator',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: 'approved',
        type: 'bool',
      },
    ],
    name: 'setApprovalForAll',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes4',
        name: 'interfaceId',
        type: 'bytes4',
      },
    ],
    name: 'supportsInterface',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'symbol',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'index',
        type: 'uint256',
      },
    ],
    name: 'tokenByIndex',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'index',
        type: 'uint256',
      },
    ],
    name: 'tokenOfOwnerByIndex',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'tokenURI',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalSupply',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'transferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'unlock',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'unlockAndTransfer',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];

export const ERC721_ABI = [
  {
    inputs: [
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
    name: 'ownerOf',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
    name: 'tokenURI',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
];
