// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/introspection/IERC165.sol";

/** 🔵 ILockable Interface */
interface ILockable is IERC165 {
    function lock(
        uint256 tokenId,
        address manager,
        uint256 durationInSeconds
    ) external;

    function unlock(uint256 tokenId) external;

    function emergencyUnlock(uint256 tokenId) external;

    function isLocked(uint256 tokenId) external view returns (bool);

    function getLockInfo(
        uint256 tokenId
    )
        external
        view
        returns (
            bool locked,
            address manager,
            uint256 lockTimestamp,
            uint256 duration
        );

    function unlockAndTransfer(address to, uint256 tokenId) external;
}

// Add interface for point system
interface ILendHubPointSystem {
    function awardPointsForListing(address user) external;

    function awardPointsForFunding(address user) external;

    function awardPointsForRepayment(address user) external;

    function awardPointsForCompletion(address user) external;

    function deductPointsForCancellation(address user) external;
}

contract LendHub_v2 is Ownable, ReentrancyGuard {
    uint256 public constant PLATFORM_FEE = 2; // 2%
    uint256 public constant GRACE_PERIOD = 7 days;

    address public immutable MON;
    address public immutable USDT;
    address public immutable ETH;
    address public platformWallet;
    address public pointSystem; // Add point system contract address

    uint256 public loanCounter;
    uint256[] public allLoanIds;
    uint256 public totalLoanVolume;

    struct Milestone {
        uint256 startTime; // When the loan was started
        uint256 claimedAt; // When the loan was claimed
        uint256 fundedAt; // When the loan was funded
        uint256 repaidAt; // When the loan was repaid
        uint256 completedAt; // When the loan was completed
    }

    struct LoanDAddressDetails {
        address nftOwner;
        address nftAddress;
        address lender;
        address loanToken;
    }

    struct Loan {
        LoanDAddressDetails loanAddDetails;
        uint256 loanId;
        uint256 nftId;
        uint256 loanAmount;
        uint256 interestRate;
        uint256 loanDuration;
        bool isLockable;
        // milestone flags
        bool loanClaimed;
        bool repaid;
        bool active;
        bool completed;
        bool cancelled;
        Milestone milestones;
    }

    Loan[] public allLoans;
    /// Tracks active listings to prevent re-listing the same NFT
    mapping(address => mapping(uint256 => bool)) public isNFTListed;

    mapping(uint256 => Loan) public loans;
    mapping(address => uint256[]) public userLoanIds;
    mapping(address => uint256[]) public lenderLoanIds;
    uint256[] public completedLoanIds;
    uint256[] public cancelledLoanIds;

    /** 🔥 Events */
    event NFTListed(
        uint256 indexed loanId,
        address indexed nftOwner,
        address indexed nftAddress,
        uint256 nftId,
        uint256 loanAmount,
        uint256 interestRate,
        uint256 duration,
        address loanToken
    );
    event LoanFunded(
        uint256 indexed loanId,
        address indexed lender,
        address indexed borrower,
        uint256 loanAmount
    );
    event LoanClaimed(
        uint256 indexed loanId,
        address indexed borrower,
        uint256 indexed loanAmount
    );
    event LoanRepaid(
        uint256 indexed loanId,
        address indexed borrower,
        address indexed lender,
        uint256 loanAmount
    );
    event RepaymentClaimed(
        uint256 indexed loanId,
        address indexed lender,
        uint256 indexed loanAmount
    );
    event NFTClaimedByLender(
        uint256 indexed loanId,
        address indexed lender,
        address indexed borrower
    );
    event NFTWithdrawn(uint256 indexed loanId, address indexed owner);
    event LoanCancelled(uint256 indexed loanId, address indexed owner);

    constructor(
        address _MON,
        address _USDT,
        address _ETH,
        address _platformWallet,
        address _pointSystem
    ) {
        MON = _MON;
        USDT = _USDT;
        ETH = _ETH;
        platformWallet = _platformWallet;
        pointSystem = _pointSystem;
    }

    /** --- Modifiers --- */
    modifier onlyNFTLister(uint256 loanId) {
        require(
            msg.sender == loans[loanId].loanAddDetails.nftOwner,
            "Not NFT Owner"
        );
        _;
    }

    modifier onlyLender(uint256 loanId) {
        require(
            msg.sender == loans[loanId].loanAddDetails.lender,
            "Not Lender"
        );
        _;
    }

    modifier loanExists(uint256 loanId) {
        require(
            loans[loanId].loanAddDetails.nftOwner != address(0),
            "Loan does not exist"
        );
        _;
    }

    modifier loanNotFunded(uint256 loanId) {
        require(
            loans[loanId].loanAddDetails.lender == address(0) &&
                !loans[loanId].active,
            " Loan Already funded"
        );
        _;
    }

    modifier loanFunded(uint256 loanId) {
        require(
            loans[loanId].loanAddDetails.lender != address(0),
            "Loan not funded"
        );
        _;
    }

    modifier notRepaid(uint256 loanId) {
        require(!loans[loanId].repaid, "Loan already repaid");
        _;
    }

    modifier loanRepaid(uint256 loanId) {
        require(loans[loanId].repaid, "Loan already repaid");
        _;
    }

    modifier withinRepaymentPeriod(uint256 loanId) {
        require(
            block.timestamp <=
                loans[loanId].milestones.startTime +
                    loans[loanId].loanDuration +
                    GRACE_PERIOD,
            "Loan overdue"
        );
        _;
    }

    modifier afterGracePeriod(uint256 loanId) {
        require(
            block.timestamp >
                loans[loanId].milestones.startTime +
                    loans[loanId].loanDuration +
                    GRACE_PERIOD,
            "Grace period active"
        );
        _;
    }

    /** --- Core Logic --- */

    function listNFTForLoan(
        address _nftAddress,
        uint256 _nftId,
        uint256 _loanAmount,
        uint256 _interestRate,
        uint256 _loanDuration,
        address _loanToken
    ) external {
        require(
            _loanToken == MON || _loanToken == USDT || _loanToken == ETH,
            "Invalid token"
        );

        require(!isNFTListed[_nftAddress][_nftId], "NFT already listed");

        require(
            IERC721(_nftAddress).ownerOf(_nftId) == msg.sender,
            "Not NFT owner"
        );

        require(
            _loanAmount > 0 && _interestRate > 0 && _loanDuration > 0,
            "Invalid parameters"
        );
        require(
            _interestRate <= 100,
            "Interest rate must be less than or equal to 100"
        );

        // Determine if the NFT contract supports ILockable
        bool isLockable = false;
        try
            IERC165(_nftAddress).supportsInterface(type(ILockable).interfaceId)
        returns (bool supported) {
            isLockable = supported;
        } catch {
            isLockable = false; // If supportsInterface fails, assume the NFT is not Lockable
        }

        loanCounter++;
        uint256 loanId = loanCounter;

        Loan memory newLoan = Loan({
            loanId: loanId,
            loanAddDetails: LoanDAddressDetails({
                nftOwner: msg.sender,
                nftAddress: _nftAddress,
                lender: address(0),
                loanToken: _loanToken
            }),
            nftId: _nftId,
            loanAmount: _loanAmount,
            interestRate: _interestRate,
            loanDuration: _loanDuration,
            isLockable: isLockable,
            active: false,
            completed: false,
            cancelled: false,
            repaid: false,
            loanClaimed: false,
            milestones: Milestone({
                startTime: 0,
                claimedAt: 0,
                fundedAt: 0,
                repaidAt: 0,
                completedAt: 0
            })
        });

        loans[loanId] = newLoan;
        allLoans.push(newLoan);
        allLoanIds.push(loanId);
        userLoanIds[msg.sender].push(loanId);

        isNFTListed[_nftAddress][_nftId] = true;

        // Award points for listing
        ILendHubPointSystem(pointSystem).awardPointsForListing(msg.sender);

        emit NFTListed(
            loanId,
            msg.sender,
            _nftAddress,
            _nftId,
            _loanAmount,
            _interestRate,
            _loanDuration,
            _loanToken
        );
    }

    function fundLoan(
        uint256 loanId
    ) external loanExists(loanId) loanNotFunded(loanId) nonReentrant {
        Loan storage loan = loans[loanId];

        require(
            loan.loanAddDetails.nftOwner != msg.sender,
            "You cannot fund your own loan"
        );

        require(!loan.cancelled, "Loan was cancelled");

        require(
            IERC721(loan.loanAddDetails.nftAddress).ownerOf(loan.nftId) ==
                loan.loanAddDetails.nftOwner,
            "Borrower no longer owns the NFT"
        );

        // Check if NFT is lockable and handle accordingly
        try ILockable(loan.loanAddDetails.nftAddress).isLocked(loan.nftId) {
            require(
                ILockable(loan.loanAddDetails.nftAddress).isLocked(
                    loan.nftId
                ) == false,
                "NFT already locked"
            );
            loan.isLockable = true;
        } catch {
            loan.isLockable = false;
        }

        // Check approval before transfer
        require(
            IERC721(loan.loanAddDetails.nftAddress).getApproved(loan.nftId) ==
                address(this) ||
                IERC721(loan.loanAddDetails.nftAddress).isApprovedForAll(
                    msg.sender,
                    address(this)
                ),
            "Contract not approved to transfer NFT"
        );

        require(
            IERC20(loan.loanAddDetails.loanToken).allowance(
                msg.sender,
                address(this)
            ) >= loan.loanAmount,
            "Insufficient allowance"
        );
        require(
            IERC20(loan.loanAddDetails.loanToken).balanceOf(msg.sender) >=
                loan.loanAmount,
            "Insufficient balance"
        );
        require(
            loan.loanAddDetails.loanToken == MON ||
                loan.loanAddDetails.loanToken == USDT ||
                loan.loanAddDetails.loanToken == ETH,
            "Invalid token"
        );

        IERC20(loan.loanAddDetails.loanToken).transferFrom(
            msg.sender,
            address(this),
            loan.loanAmount
        );

        // Update total loan volume
        totalLoanVolume += loan.loanAmount;

        loan.loanAddDetails.lender = msg.sender;
        loan.active = true;
        loan.milestones.startTime = block.timestamp;
        loan.milestones.fundedAt = block.timestamp;

        lenderLoanIds[msg.sender].push(loanId);

        // Handle NFT locking/transfer based on type
        if (loan.isLockable) {
            ILockable(loan.loanAddDetails.nftAddress).lock(
                loan.nftId,
                address(this),
                loan.loanDuration + GRACE_PERIOD
            );
        } else {
            IERC721(loan.loanAddDetails.nftAddress).transferFrom(
                loan.loanAddDetails.nftOwner,
                address(this),
                loan.nftId
            );
        }

        // Update allLoans array
        _updateAllLoans(loanId, loan);

        // Award points for funding
        ILendHubPointSystem(pointSystem).awardPointsForFunding(msg.sender);

        emit LoanFunded(
            loanId,
            msg.sender,
            loan.loanAddDetails.nftOwner,
            loan.loanAmount
        );
    }

    // Helper function to update allLoans array
    function _updateAllLoans(uint256 loanId, Loan memory updatedLoan) internal {
        for (uint256 i = 0; i < allLoans.length; i++) {
            if (allLoans[i].loanId == loanId) {
                allLoans[i] = updatedLoan;
                break; // Exit the loop once found and updated
            }
        }
    }

    function claimLoan(
        uint256 loanId
    ) external onlyNFTLister(loanId) loanFunded(loanId) nonReentrant {
        Loan storage loan = loans[loanId];

        require(!loan.loanClaimed, "Loan already claimed");

        uint256 platformFee = (loan.loanAmount * PLATFORM_FEE) / 100;
        uint256 payout = loan.loanAmount - platformFee;

        IERC20(loan.loanAddDetails.loanToken).transfer(
            platformWallet,
            platformFee
        );
        IERC20(loan.loanAddDetails.loanToken).transfer(msg.sender, payout);
        loan.loanClaimed = true;
        loan.milestones.claimedAt = block.timestamp;
        // Update allLoans array
        _updateAllLoans(loanId, loan);

        // Award points for claiming loan
        ILendHubPointSystem(pointSystem).awardPointsForRepayment(msg.sender);

        emit LoanClaimed(loanId, msg.sender, payout);
    }

    function repayLoan(
        uint256 loanId
    )
        external
        onlyNFTLister(loanId)
        loanFunded(loanId)
        notRepaid(loanId)
        withinRepaymentPeriod(loanId)
        nonReentrant
    {
        Loan storage loan = loans[loanId];

        uint256 interest = (loan.loanAmount * loan.interestRate) / 100;
        uint256 repayment = loan.loanAmount + interest;

        IERC20(loan.loanAddDetails.loanToken).transferFrom(
            msg.sender,
            address(this),
            repayment
        );

        if (loan.isLockable) {
            ILockable(loan.loanAddDetails.nftAddress).unlock(loan.nftId);
        } else {
            IERC721(loan.loanAddDetails.nftAddress).safeTransferFrom(
                address(this),
                loan.loanAddDetails.nftOwner,
                loan.nftId
            );
        }

        loan.repaid = true;
        loan.milestones.repaidAt = block.timestamp;
        // Update allLoans array
        _updateAllLoans(loanId, loan);

        // Award points for repayment
        ILendHubPointSystem(pointSystem).awardPointsForRepayment(msg.sender);

        isNFTListed[loan.loanAddDetails.nftAddress][loan.nftId] = false;

        emit LoanRepaid(
            loanId,
            msg.sender,
            loan.loanAddDetails.lender,
            repayment
        );
    }

    function claimRepayment(
        uint256 loanId
    ) external onlyLender(loanId) loanRepaid(loanId) nonReentrant {
        Loan storage loan = loans[loanId];

        require(loan.repaid, "Loan not yet repaid");
        require(!loan.completed, "Already completed");
        uint256 platformFee = (loan.loanAmount * PLATFORM_FEE) / 100;

        uint256 repaymentAmount = loan.loanAmount +
            (loan.loanAmount * loan.interestRate) /
            100;

        uint256 fRepaymentAmount = repaymentAmount - platformFee; // final repayment amount after platform fee

        IERC20(loan.loanAddDetails.loanToken).transfer(
            msg.sender,
            fRepaymentAmount
        );

        loan.completed = true;
        loan.active = false;
        loan.milestones.completedAt = block.timestamp;
        completedLoanIds.push(loanId);
        // Update allLoans array
        _updateAllLoans(loanId, loan);

        // Award points for completion
        ILendHubPointSystem(pointSystem).awardPointsForCompletion(msg.sender);

        emit RepaymentClaimed(loanId, msg.sender, fRepaymentAmount);
    }

    function claimNFT(
        uint256 loanId
    )
        external
        onlyLender(loanId)
        loanFunded(loanId)
        afterGracePeriod(loanId)
        nonReentrant
    {
        Loan storage loan = loans[loanId];
        require(!loan.cancelled, "Loan was cancelled");
        require(!loan.repaid, "Loan was repaid");
        require(!loan.completed, "Already completed");

        require(!loan.repaid, "Loan was repaid");
        require(!loan.completed, "Already completed");

        if (loan.isLockable) {
            ILockable(loan.loanAddDetails.nftAddress).unlockAndTransfer(
                msg.sender,
                loan.nftId
            );
        } else {
            IERC721(loan.loanAddDetails.nftAddress).safeTransferFrom(
                address(this),
                msg.sender,
                loan.nftId
            );
        }

        loan.completed = true;
        loan.active = false;
        loan.milestones.completedAt = block.timestamp;

        completedLoanIds.push(loanId);
        // Update allLoans array
        _updateAllLoans(loanId, loan);
        isNFTListed[loan.loanAddDetails.nftAddress][loan.nftId] = false;

        // Award points for completion
        ILendHubPointSystem(pointSystem).awardPointsForCompletion(msg.sender);

        emit NFTClaimedByLender(
            loanId,
            msg.sender,
            loan.loanAddDetails.nftOwner
        );
    }

    function cancelLoanAndWithdrawNFT(
        uint256 loanId
    )
        external
        onlyNFTLister(loanId)
        loanExists(loanId)
        loanNotFunded(loanId)
        nonReentrant
    {
        Loan storage loan = loans[loanId];
        require(!loan.active, "Loan already active");
        require(!loan.completed, "Loan already completed");
        require(!loan.cancelled, "Loan already cancelled");

        // Mark as cancelled
        loan.cancelled = true;
        loan.active = false;
        isNFTListed[loan.loanAddDetails.nftAddress][loan.nftId] = false;
        cancelledLoanIds.push(loanId);

        // Update allLoans array
        _updateAllLoans(loanId, loan);

        // Deduct points for cancellation
        ILendHubPointSystem(pointSystem).deductPointsForCancellation(
            msg.sender
        );

        emit LoanCancelled(loanId, loan.loanAddDetails.nftOwner);
    }

    /** --- View Functions --- */

    function getAllLoans() external view returns (Loan[] memory) {
        return allLoans;
    }

    function getActiveLoans() external view returns (Loan[] memory) {
        uint256 count;
        for (uint256 i = 0; i < allLoanIds.length; i++) {
            if (
                loans[allLoanIds[i]].loanAddDetails.lender != address(0) &&
                loans[allLoanIds[i]].active == true &&
                loans[allLoanIds[i]].completed == false &&
                loans[allLoanIds[i]].cancelled == false
            ) {
                count++;
            }
        }
        Loan[] memory result = new Loan[](count);
        uint256 index;
        for (uint256 i = 0; i < allLoanIds.length; i++) {
            if (
                loans[allLoanIds[i]].loanAddDetails.lender != address(0) &&
                loans[allLoanIds[i]].active == true &&
                loans[allLoanIds[i]].completed == false &&
                loans[allLoanIds[i]].cancelled == false
            ) {
                result[index++] = loans[allLoanIds[i]];
            }
        }
        return result;
    }

    function getUnfundedLoans() external view returns (Loan[] memory) {
        uint256 count;
        for (uint256 i = 0; i < allLoanIds.length; i++) {
            if (
                loans[allLoanIds[i]].loanAddDetails.lender == address(0) &&
                loans[allLoanIds[i]].active == false &&
                loans[allLoanIds[i]].completed == false &&
                loans[allLoanIds[i]].cancelled == false
            ) {
                count++;
            }
        }
        Loan[] memory result = new Loan[](count);
        uint256 index;
        for (uint256 i = 0; i < allLoanIds.length; i++) {
            if (
                loans[allLoanIds[i]].loanAddDetails.lender == address(0) &&
                loans[allLoanIds[i]].active == false &&
                loans[allLoanIds[i]].completed == false &&
                loans[allLoanIds[i]].cancelled == false
            ) {
                result[index++] = loans[allLoanIds[i]];
            }
        }
        return result;
    }

    function getUserLoans(address user) external view returns (Loan[] memory) {
        uint256[] storage loanIds = userLoanIds[user];
        Loan[] memory result = new Loan[](loanIds.length);
        for (uint256 i = 0; i < loanIds.length; i++) {
            result[i] = loans[loanIds[i]];
        }
        return result;
    }

    function getLenderLoans(
        address lender
    ) external view returns (Loan[] memory) {
        uint256[] storage loanIds = lenderLoanIds[lender];
        Loan[] memory result = new Loan[](loanIds.length);
        for (uint256 i = 0; i < loanIds.length; i++) {
            result[i] = loans[loanIds[i]];
        }
        return result;
    }

    // Get all completed loans
    function getCompletedLoans() external view returns (Loan[] memory) {
        Loan[] memory result = new Loan[](completedLoanIds.length);
        for (uint256 i = 0; i < completedLoanIds.length; i++) {
            result[i] = loans[completedLoanIds[i]];
        }
        return result;
    }

    function withdrawERC20(address tokenAddress) external onlyOwner {
        uint256 balance = IERC20(tokenAddress).balanceOf(address(this));
        require(balance > 0, "No balance");
        IERC20(tokenAddress).transfer(owner(), balance);
    }

    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No ETH");
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Withdraw failed");
    }
}
