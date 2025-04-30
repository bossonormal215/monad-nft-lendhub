// // SPDX-License-Identifier: MIT
// pragma solidity ^0.8.27;

// import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
// import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
// import "@openzeppelin/contracts/access/Ownable.sol";
// import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
// import "@openzeppelin/contracts/utils/introspection/IERC165.sol";

// /** 🔵 ILockable Interface */
// interface ILockable is IERC165 {
//     function lock(
//         uint256 tokenId,
//         address manager,
//         uint256 durationInSeconds
//     ) external;

//     function unlock(uint256 tokenId) external;

//     function emergencyUnlock(uint256 tokenId) external;

//     function isLocked(uint256 tokenId) external view returns (bool);

//     function getLockInfo(
//         uint256 tokenId
//     )
//         external
//         view
//         returns (
//             bool locked,
//             address manager,
//             uint256 lockTimestamp,
//             uint256 duration
//         );

//     function unlockAndTransfer(address to, uint256 tokenId) external;
// }

// contract NFTLendHub5 is Ownable, ReentrancyGuard {
//     uint256 public constant PLATFORM_FEE = 2; // 2% fee
//     uint256 public constant GRACE_PERIOD = 7 days;

//     address public immutable MON;
//     address public immutable USDT;
//     address public immutable ETH;
//     address public platformWallet;

//     uint256 public loanCounter;
//     uint256[] public allLoanIds;

//     struct Loan {
//         uint256 loanId;
//         address nftOwner;
//         address nftAddress;
//         uint256 nftId;
//         address lender;
//         uint256 loanAmount;
//         uint256 interestRate;
//         uint256 loanDuration;
//         uint256 startTime;
//         address loanToken;
//         bool isLockable;
//         bool loanClaimed;
//         bool repaid;
//         bool active;
//         bool completed;
//         bool cancelled;
//     }

//     Loan[] public allLoans;
//     mapping(uint256 => Loan) public loans;
//     mapping(address => uint256[]) public userLoanIds;
//     mapping(address => uint256[]) public lenderLoanIds;
//     uint256[] public completedLoanIds;
//     uint256[] public cancelledLoanIds;

//     event NFTListed(
//         uint256 indexed loanId,
//         address indexed nftOwner,
//         address indexed nftAddress,
//         uint256 nftId,
//         uint256 loanAmount,
//         uint256 interestRate,
//         uint256 duration,
//         address loanToken
//     );
//     event LoanFunded(uint256 indexed loanId, address indexed lender);
//     event LoanClaimed(uint256 indexed loanId, address indexed borrower);
//     event LoanRepaid(uint256 indexed loanId, address indexed borrower);
//     event RepaymentClaimed(uint256 indexed loanId, address indexed lender);
//     event NFTClaimedByLender(uint256 indexed loanId, address indexed lender);
//     event NFTWithdrawn(uint256 indexed loanId, address indexed owner);

//     constructor(
//         address _MON,
//         address _USDT,
//         address _ETH,
//         address _platformWallet
//     ) {
//         MON = _MON;
//         USDT = _USDT;
//         ETH = _ETH;
//         platformWallet = _platformWallet;
//     }

//     /** --- Modifiers --- */
//     modifier onlyNFTLister(uint256 loanId) {
//         require(msg.sender == loans[loanId].nftOwner, "Not NFT Owner");
//         _;
//     }

//     modifier onlyLender(uint256 loanId) {
//         require(msg.sender == loans[loanId].lender, "Not Lender");
//         _;
//     }

//     modifier loanExists(uint256 loanId) {
//         require(loans[loanId].nftOwner != address(0), "Loan does not exist");
//         _;
//     }

//     modifier loanNotFunded(uint256 loanId) {
//         require(loans[loanId].lender == address(0), "Loan already funded");
//         _;
//     }

//     modifier loanFunded(uint256 loanId) {
//         require(loans[loanId].lender != address(0), "Loan not funded yet");
//         _;
//     }

//     modifier notRepaid(uint256 loanId) {
//         require(!loans[loanId].repaid, "Loan already repaid");
//         _;
//     }

//     modifier loanRepaid(uint256 loanId) {
//         require(loans[loanId].repaid, "Loan Not Yet repaid");
//         _;
//     }

//     modifier withinRepaymentPeriod(uint256 loanId) {
//         require(
//             block.timestamp <=
//                 loans[loanId].startTime + loans[loanId].loanDuration,
//             "Loan overdue"
//         );
//         _;
//     }

//     modifier afterGracePeriod(uint256 loanId) {
//         require(
//             block.timestamp >
//                 loans[loanId].startTime +
//                     loans[loanId].loanDuration +
//                     GRACE_PERIOD,
//             "Grace period not over"
//         );
//         _;
//     }

//     /** --- Main Functions --- */

//     function listNFTForLoan(
//         address _nftAddress,
//         uint256 _nftId,
//         uint256 _loanAmount,
//         uint256 _interestRate,
//         uint256 _loanDuration,
//         address _loanToken
//     ) external {
//         require(
//             _loanToken == MON || _loanToken == USDT || _loanToken == ETH,
//             "Invalid loan token"
//         );

//         // IERC721(_nftAddress).transferFrom(msg.sender, address(this), _nftId); // THE NFT ALREADY TRANSFERED TO THIS CONTRACT WITH THIS CODE( BUT IT SHOULDNT I THINK, AS WE'RE WORKING ON RETAINING OWNERSHIP FOR OWNERS)

//         bool _isLockable = IERC165(_nftAddress).supportsInterface(
//             type(ILockable).interfaceId
//         );

//         if (!_isLockable) {
//             IERC721(_nftAddress).transferFrom(
//                 msg.sender,
//                 address(this),
//                 _nftId
//             );
//         }

//         loanCounter++;
//         uint256 loanId = loanCounter;

//         Loan memory newLoan = Loan({
//             loanId: loanId,
//             nftOwner: msg.sender,
//             nftAddress: _nftAddress,
//             nftId: _nftId,
//             lender: address(0),
//             loanAmount: _loanAmount,
//             interestRate: _interestRate,
//             loanDuration: _loanDuration,
//             startTime: 0,
//             loanToken: _loanToken,
//             isLockable: _isLockable,
//             loanClaimed: false,
//             repaid: false,
//             active: false,
//             completed: false,
//             cancelled: false
//         });

//         loans[loanId] = newLoan;
//         allLoans.push(newLoan);
//         allLoanIds.push(loanId);
//         userLoanIds[msg.sender].push(loanId);

//         emit NFTListed(
//             loanId,
//             msg.sender,
//             _nftAddress,
//             _nftId,
//             _loanAmount,
//             _interestRate,
//             _loanDuration,
//             _loanToken
//         );
//     }

//     function fundLoan(
//         uint256 loanId
//     ) external loanExists(loanId) loanNotFunded(loanId) nonReentrant {
//         Loan storage loan = loans[loanId];

//         IERC20(loan.loanToken).transferFrom(
//             msg.sender,
//             address(this),
//             loan.loanAmount
//         );

//         loan.lender = msg.sender;
//         loan.startTime = block.timestamp;
//         loan.active = true;

//         lenderLoanIds[msg.sender].push(loanId);

//         // ✅ If NFT is Lockable, lock it now
//         if (loan.isLockable) {
//             ILockable lockableNFT = ILockable(loan.nftAddress);
//             lockableNFT.lock(
//                 loan.nftId,
//                 address(this),
//                 loan.loanDuration + GRACE_PERIOD
//             );
//         }

//         emit LoanFunded(loanId, msg.sender);
//     }

//     function claimLoan(
//         uint256 loanId
//     ) external onlyNFTLister(loanId) loanFunded(loanId) nonReentrant {
//         Loan storage loan = loans[loanId];

//         uint256 platformFee = (loan.loanAmount * PLATFORM_FEE) / 100;
//         uint256 payout = loan.loanAmount - platformFee;

//         IERC20(loan.loanToken).transfer(platformWallet, platformFee);
//         IERC20(loan.loanToken).transfer(msg.sender, payout);

//         loan.loanClaimed = true;

//         emit LoanClaimed(loanId, msg.sender);
//     }

//     function repayLoan(
//         uint256 loanId
//     )
//         external
//         onlyNFTLister(loanId)
//         loanFunded(loanId)
//         notRepaid(loanId)
//         withinRepaymentPeriod(loanId)
//         nonReentrant
//     {
//         Loan storage loan = loans[loanId];

//         uint256 interest = (loan.loanAmount * loan.interestRate) / 100;
//         uint256 repaymentAmount = loan.loanAmount + interest;

//         IERC20(loan.loanToken).transferFrom(
//             msg.sender,
//             address(this),
//             repaymentAmount
//         );

//         loan.repaid = true;
//         loan.active = false;

//         // ✅ Update Borrower's `userLoanIds` to reflect their perspective
//         uint256[] storage loanIds = userLoanIds[msg.sender];
//         for (uint256 i = 0; i < loanIds.length; i++) {
//             if (loanIds[i] == loanId) {
//                 loanIds[i] = loanId; // Ensuring status updates correctly
//             }
//         }

//         // ✅ Update Lender's `lenderLoanIds` so the lender knows the loan is repaid
//         uint256[] storage lenderLoans = lenderLoanIds[loan.lender];
//         for (uint256 i = 0; i < lenderLoans.length; i++) {
//             if (lenderLoans[i] == loanId) {
//                 lenderLoans[i] = loanId;
//             }
//         }

//         // if (loan.isLockable) {
//         //     ILockable(loan.nftAddress).unlock(loan.nftId);
//         // }
//         // NFT is unlock if its lockable NFT collection and returned if it is not lockable
//         if (loan.isLockable) {
//             ILockable(loan.nftAddress).unlock(loan.nftId);
//         } else {
//             IERC721(loan.nftAddress).safeTransferFrom(
//                 address(this),
//                 loan.nftOwner,
//                 loan.nftId
//             );
//         }

//         // IS THIS NOT GOING TO FAIL? DUE TO BEING FIRST UNLOCK AND THEN TRYING TO TRANSFER THE NFT BACK TO BORROWER!!!
//         // IERC721(loan.nftAddress).safeTransferFrom(
//         //     address(this),
//         //     msg.sender,
//         //     loan.nftId
//         // );

//         emit LoanRepaid(loanId, msg.sender);
//     }

//     function claimRepayment(
//         uint256 loanId
//     ) external onlyLender(loanId) nonReentrant loanRepaid(loanId) {
//         Loan storage loan = loans[loanId];

//         require(loan.repaid, "Loan not yet repaid");

//         uint256 repaymentAmount = loan.loanAmount +
//             (loan.loanAmount * loan.interestRate) /
//             100;
//         IERC20(loan.loanToken).transfer(msg.sender, repaymentAmount);

//         loan.completed = true;
//         loan.active = false; // ✅ NOW mark the loan as inactive!
//         loan.cancelled = false;

//         // ✅ Updating Lender's `lenderLoanIds`
//         uint256[] storage loanIds = lenderLoanIds[msg.sender];
//         for (uint256 i = 0; i < loanIds.length; i++) {
//             if (loanIds[i] == loanId) {
//                 loanIds[i] = loanId; // Ensuring lender sees the correct status
//             }
//         }

//         completedLoanIds.push(loanId);

//         emit RepaymentClaimed(loanId, msg.sender);
//     }

//     function claimNFT(
//         uint256 loanId
//     )
//         external
//         onlyLender(loanId)
//         loanFunded(loanId)
//         afterGracePeriod(loanId)
//         nonReentrant
//     {
//         Loan storage loan = loans[loanId];

//         require(!loan.repaid, "Already repaid");

//         if (loan.isLockable) {
//             ILockable(loan.nftAddress).unlockAndTransfer(
//                 msg.sender,
//                 loan.nftId
//             );
//         } else {
//             IERC721(loan.nftAddress).safeTransferFrom(
//                 address(this),
//                 msg.sender,
//                 loan.nftId
//             );
//         }

//         loan.completed = true;
//         loan.active = false;

//         completedLoanIds.push(loanId);

//         emit NFTClaimedByLender(loanId, msg.sender);
//     }

//     function cancelLoanAndWithdrawNFT(
//         uint256 loanId
//     )
//         external
//         onlyNFTLister(loanId)
//         loanExists(loanId)
//         loanNotFunded(loanId)
//         nonReentrant
//     {
//         Loan storage loan = loans[loanId];
//         require(!loan.completed, "Loan already completed");

//         if (loan.isLockable) {
//             ILockable(loan.nftAddress).unlock(loan.nftId);
//         } else {
//             IERC721(loan.nftAddress).safeTransferFrom(
//                 address(this),
//                 loan.nftOwner,
//                 loan.nftId
//             );
//         }

//         loan.cancelled = true;
//         loan.active = false;

//         cancelledLoanIds.push(loanId);

//         emit NFTWithdrawn(loanId, loan.nftOwner);
//     }

//     /** --- VIEW FUNCTIONS --- */

//     function getAllLoans() external view returns (Loan[] memory) {
//         return allLoans;
//     }

//     function getUnfundedLoans() external view returns (Loan[] memory) {
//         uint256 count = 0;
//         for (uint256 i = 0; i < allLoanIds.length; i++) {
//             Loan storage loan = loans[allLoanIds[i]];
//             if (
//                 loan.lender == address(0) && !loan.completed && !loan.cancelled
//             ) {
//                 count++;
//             }
//         }

//         Loan[] memory unfundedLoans = new Loan[](count);
//         uint256 index = 0;
//         for (uint256 i = 0; i < allLoanIds.length; i++) {
//             Loan storage loan = loans[allLoanIds[i]];
//             if (
//                 loan.lender == address(0) && !loan.completed && !loan.cancelled
//             ) {
//                 unfundedLoans[index] = loan;
//                 index++;
//             }
//         }
//         return unfundedLoans;
//     }

//     function getUserLoans(address user) external view returns (Loan[] memory) {
//         uint256[] storage loanIds = userLoanIds[user];
//         Loan[] memory result = new Loan[](loanIds.length);
//         for (uint256 i = 0; i < loanIds.length; i++) {
//             result[i] = loans[loanIds[i]];
//         }
//         return result;
//     }

//     function getLenderLoans(
//         address lender
//     ) external view returns (Loan[] memory) {
//         uint256[] storage loanIds = lenderLoanIds[lender];
//         Loan[] memory result = new Loan[](loanIds.length);
//         for (uint256 i = 0; i < loanIds.length; i++) {
//             result[i] = loans[loanIds[i]];
//         }
//         return result;
//     }

//     // Get all completed loans
//     function getCompletedLoans() external view returns (Loan[] memory) {
//         Loan[] memory result = new Loan[](completedLoanIds.length);
//         for (uint256 i = 0; i < completedLoanIds.length; i++) {
//             result[i] = loans[completedLoanIds[i]];
//         }
//         return result;
//     }

//     /** --- Admin Withdrawals --- */

//     function withdrawERC20(address tokenAddress) external onlyOwner {
//         uint256 balance = IERC20(tokenAddress).balanceOf(address(this));
//         require(balance > 0, "No tokens to withdraw");
//         IERC20(tokenAddress).transfer(owner(), balance);
//     }

//     function withdraw() external onlyOwner {
//         uint256 balance = address(this).balance;
//         require(balance > 0, "No ETH to withdraw");
//         (bool success, ) = payable(owner()).call{value: balance}("");
//         require(success, "Withdraw failed");
//     }
// }
