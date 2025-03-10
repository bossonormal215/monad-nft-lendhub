export const NFT_LENDHUB = {
  address: '0x6675d33ed0A81a45F6FD138bf85e91f050539cCb',
  abi: [
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
          internalType: 'address',
          name: 'borrower',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'nftAddress',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'uint256',
          name: 'nftId',
          type: 'uint256',
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
          internalType: 'address',
          name: 'lender',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'nftAddress',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'uint256',
          name: 'nftId',
          type: 'uint256',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'amount',
          type: 'uint256',
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
          internalType: 'address',
          name: 'borrower',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'nftAddress',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'uint256',
          name: 'nftId',
          type: 'uint256',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'amount',
          type: 'uint256',
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
          internalType: 'address',
          name: 'lender',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'nftAddress',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'uint256',
          name: 'nftId',
          type: 'uint256',
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
          indexed: true,
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
          internalType: 'address',
          name: 'borrower',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'nftAddress',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'uint256',
          name: 'nftId',
          type: 'uint256',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'amount',
          type: 'uint256',
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
          internalType: 'address',
          name: '_nftAddress',
          type: 'address',
        },
        {
          internalType: 'uint256',
          name: '_nftId',
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
          internalType: 'address',
          name: '_nftAddress',
          type: 'address',
        },
        {
          internalType: 'uint256',
          name: '_nftId',
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
          internalType: 'address',
          name: '_nftAddress',
          type: 'address',
        },
        {
          internalType: 'uint256',
          name: '_nftId',
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
          internalType: 'address',
          name: '_nftAddress',
          type: 'address',
        },
        {
          internalType: 'uint256',
          name: '_nftId',
          type: 'uint256',
        },
      ],
      name: 'fundLoan',
      outputs: [],
      stateMutability: 'nonpayable',
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
      name: 'loans',
      outputs: [
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
          name: 'repaid',
          type: 'bool',
        },
        {
          internalType: 'address',
          name: 'loanToken',
          type: 'address',
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
          internalType: 'address',
          name: '_nftAddress',
          type: 'address',
        },
        {
          internalType: 'uint256',
          name: '_nftId',
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
  ],
};
