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

contract NFTLendHub5_v2 is Ownable, ReentrancyGuard {
    uint256 public constant PLATFORM_FEE = 2; // 2%
    uint256 public constant GRACE_PERIOD = 7 days;

    address public immutable MON;
    address public immutable USDT;
    address public immutable ETH;
    address public platformWallet;

    uint256 public loanCounter;
    uint256[] public allLoanIds;

    /** 🔵 Loan Status Mapping */
    // enum LoanStatus {
    //     Pending,
    //     Active,
    //     Repaid,
    //     Completed,
    //     Cancelled,
    //     Defaulted
    // }

    // struct Loan {
    //     uint256 loanId;
    //     address nftOwner;
    //     address nftAddress;
    //     uint256 nftId;
    //     address lender;
    //     uint256 loanAmount;
    //     uint256 interestRate;
    //     uint256 loanDuration;
    //     uint256 startTime;
    //     address loanToken;
    //     bool isLockable;
    //     LoanStatus status;
    // }

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
    event LoanFunded(uint256 indexed loanId, address indexed lender);
    event LoanClaimed(uint256 indexed loanId, address indexed borrower);
    event LoanRepaid(uint256 indexed loanId, address indexed borrower);
    event RepaymentClaimed(uint256 indexed loanId, address indexed lender);
    event NFTClaimedByLender(uint256 indexed loanId, address indexed lender);
    event NFTWithdrawn(uint256 indexed loanId, address indexed owner);

    constructor(
        address _MON,
        address _USDT,
        address _ETH,
        address _platformWallet
    ) {
        MON = _MON;
        USDT = _USDT;
        ETH = _ETH;
        platformWallet = _platformWallet;
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
        // require(loans[loanId].lender == address(0), "Loan already funded");
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
        // require(loans[loanId].status != LoanStatus.Repaid, "Already repaid");
        require(!loans[loanId].repaid, "Loan already repaid");
        _;
    }

    modifier loanRepaid(uint256 loanId) {
        // require(loans[loanId].status == LoanStatus.Repaid,"Loan Not Yet repaid");
        require(loans[loanId].repaid, "Loan already repaid");
        _;
    }

    modifier withinRepaymentPeriod(uint256 loanId) {
        require(
            block.timestamp <=
                loans[loanId].milestones.startTime + loans[loanId].loanDuration,
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
            // nftOwner: msg.sender,
            // nftAddress: _nftAddress,
            nftId: _nftId,
            // lender: address(0),
            loanAmount: _loanAmount,
            interestRate: _interestRate,
            loanDuration: _loanDuration,
            // loanToken: _loanToken,
            isLockable: false,
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

        require(!loan.cancelled, "Loan was cancelled");

        require(
            IERC721(loan.loanAddDetails.nftAddress).ownerOf(loan.nftId) ==
                loan.loanAddDetails.nftOwner,
            "Borrower no longer owns the NFT"
        );

        require(
            ILockable(loan.loanAddDetails.nftAddress).isLocked(loan.nftId) ==
                false,
            "NFT already locked"
        );

        require(
            IERC721(loan.loanAddDetails.nftAddress).getApproved(loan.nftId) ==
                address(this),
            "Loan contract is not approved"
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

        loan.loanAddDetails.lender = msg.sender;
        // loan.status = LoanStatus.Active;
        loan.active = true;
        loan.milestones.startTime = block.timestamp;
        loan.milestones.fundedAt = block.timestamp;

        lenderLoanIds[msg.sender].push(loanId);

        // 🔥 Now dynamically detect Lockable at funding
        try
            ILockable(loan.loanAddDetails.nftAddress).lock(
                loan.nftId,
                address(this),
                loan.loanDuration + GRACE_PERIOD
            )
        {
            loan.isLockable = true;
        } catch {
            // ❗If lock() fails, manually transfer NFT to contract
            IERC721(loan.loanAddDetails.nftAddress).transferFrom(
                loan.loanAddDetails.nftOwner,
                address(this),
                loan.nftId
            );
            loan.isLockable = false;
        }

        emit LoanFunded(loanId, msg.sender);
    }

    /*function fundLoan(
        uint256 loanId
    ) external loanExists(loanId) loanNotFunded(loanId) nonReentrant {
        Loan storage loan = loans[loanId];

        IERC20(loan.loanToken).transferFrom(
            msg.sender,
            address(this),
            loan.loanAmount
        );
        loan.lender = msg.sender;
        loan.startTime = block.timestamp;
        loan.status = LoanStatus.Active;

        lenderLoanIds[msg.sender].push(loanId);

        if (loan.isLockable) {
            ILockable(loan.nftAddress).lock(
                loan.nftId,
                address(this),
                loan.loanDuration + GRACE_PERIOD
            );
        }

        emit LoanFunded(loanId, msg.sender);
    }
    */

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

        emit LoanClaimed(loanId, msg.sender);
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

        // loan.status = LoanStatus.Repaid;
        loan.repaid = true;
        loan.milestones.repaidAt = block.timestamp;

        isNFTListed[loan.loanAddDetails.nftAddress][loan.nftId] = false;

        emit LoanRepaid(loanId, msg.sender);
    }

    function claimRepayment(
        uint256 loanId
    ) external onlyLender(loanId) loanRepaid(loanId) nonReentrant {
        Loan storage loan = loans[loanId];

        require(loan.repaid, "Loan not yet repaid");
        require(!loan.completed, "Already completed");

        uint256 repaymentAmount = loan.loanAmount +
            (loan.loanAmount * loan.interestRate) /
            100;

        IERC20(loan.loanAddDetails.loanToken).transfer(
            msg.sender,
            repaymentAmount
        );

        // loan.status = LoanStatus.Completed;
        loan.completed = true;
        loan.milestones.completedAt = block.timestamp;
        completedLoanIds.push(loanId);

        emit RepaymentClaimed(loanId, msg.sender);
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
        // require(loan.status != LoanStatus.Repaid, "Already repaid");
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

        // loan.status = LoanStatus.Completed;
        loan.completed = true;
        loan.milestones.completedAt = block.timestamp;

        completedLoanIds.push(loanId);
        isNFTListed[loan.loanAddDetails.nftAddress][loan.nftId] = false;

        emit NFTClaimedByLender(loanId, msg.sender);
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
        // require(loan.status == LoanStatus.Pending, "Already active");
        require(loan.active == false, "Loan already active");

        require(!loan.completed, "Loan already active");
        require(!loan.cancelled, "Loan already cancelled");

        if (loan.isLockable) {
            ILockable(loan.loanAddDetails.nftAddress).unlock(loan.nftId);
        } else {
            IERC721(loan.loanAddDetails.nftAddress).safeTransferFrom(
                address(this),
                loan.loanAddDetails.nftOwner,
                loan.nftId
            );
        }

        // loan.status = LoanStatus.Cancelled;
        loan.cancelled = true;

        isNFTListed[loan.loanAddDetails.nftAddress][loan.nftId] = false;
        cancelledLoanIds.push(loanId);

        emit NFTWithdrawn(loanId, loan.loanAddDetails.nftOwner);
    }

    /** --- View Functions --- */

    function getAllLoans() external view returns (Loan[] memory) {
        return allLoans;
    }

    function getUnfundedLoans() external view returns (Loan[] memory) {
        uint256 count;
        for (uint256 i = 0; i < allLoanIds.length; i++) {
            if (
                loans[allLoanIds[i]].loanAddDetails.lender == address(0) &&
                // loans[allLoanIds[i]].status == LoanStatus.Pending
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
                // loans[allLoanIds[i]].status == LoanStatus.Pending
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
