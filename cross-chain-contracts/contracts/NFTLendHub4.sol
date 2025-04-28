// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract NFTLendHub4 is Ownable, ReentrancyGuard {
    uint256 public constant PLATFORM_FEE = 2; // 2% Fee
    uint256 public constant GRACE_PERIOD = 7 days; // Grace period after loan due date

    address public immutable MON;
    address public immutable USDT;
    address public immutable ETH;
    address public platformWallet;

    uint256 public loanCounter; // Unique loan ID counter
    uint256[] public allLoanIds; // Store all loan IDs

    // struct loanTimeStamps {
    //     uint256 startTime;
    //     uint256 fundedAt;
    //     uint256 claimedAt;
    //     uint256 repaidAt;
    //     uint256 completedAt;
    // }

    struct Loan {
        uint256 loanId;
        address nftOwner;
        address nftAddress;
        uint256 nftId;
        address lender;
        uint256 loanAmount;
        uint256 interestRate;
        uint256 loanDuration;
        uint256 startTime;
        // loanTimeStamps loanTime;
        bool loanClaimed;
        bool repaid;
        address loanToken;
        bool active;
        bool completed;
        bool cancelled;
    }

    Loan[] public allLoans;
    mapping(uint256 => Loan) public loans;
    mapping(address => uint256[]) public userLoanIds;
    mapping(address => uint256[]) public lenderLoanIds;
    uint256[] public completedLoanIds;
    uint256[] public cancelledLoanIds;

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

    // modifiers
    modifier onlyNFTLister(uint256 loanId) {
        require(msg.sender == loans[loanId].nftOwner, "Not NFT Owner");
        _;
    }

    modifier onlyLender(uint256 loanId) {
        require(msg.sender == loans[loanId].lender, "Not Lender");
        _;
    }

    modifier loanExists(uint256 loanId) {
        require(loans[loanId].nftOwner != address(0), "Loan does not exist");
        _;
    }

    modifier loanNotFunded(uint256 loanId) {
        require(loans[loanId].lender == address(0), "Loan already funded");
        _;
    }

    modifier loanFunded(uint256 loanId) {
        require(loans[loanId].lender != address(0), "Loan not funded");
        _;
    }

    modifier notRepaid(uint256 loanId) {
        require(!loans[loanId].repaid, "Loan already repaid");
        _;
    }

    modifier loanRepaid(uint256 loanId) {
        require(loans[loanId].repaid, "Loan Not Yet repaid");
        _;
    }

    modifier withinRepaymentPeriod(uint256 loanId) {
        require(
            block.timestamp <=
                loans[loanId].startTime + loans[loanId].loanDuration,
            "Loan overdue"
        );
        _;
    }

    modifier afterGracePeriod(uint256 loanId) {
        require(
            block.timestamp >
                loans[loanId].startTime +
                    loans[loanId].loanDuration +
                    GRACE_PERIOD,
            "Grace period active"
        );
        _;
    }

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
            "Invalid loan token"
        );

        IERC721(_nftAddress).transferFrom(msg.sender, address(this), _nftId);

        loanCounter++;
        uint256 loanId = loanCounter;

        Loan memory newLoan = Loan({
            loanId: loanId,
            nftOwner: msg.sender,
            nftAddress: _nftAddress,
            nftId: _nftId,
            lender: address(0),
            loanAmount: _loanAmount,
            interestRate: _interestRate,
            loanDuration: _loanDuration,
            startTime: 0,
            // loanTime: loanTimeStamps({
            //     startTime: block.timestamp,
            //     fundedAt: 0,
            //     claimedAt: 0,
            //     repaidAt: 0,
            //     completedAt: 0
            // }),
            loanClaimed: false,
            repaid: false,
            loanToken: _loanToken,
            active: false,
            completed: false,
            cancelled: false
        });

        loans[loanId] = newLoan;
        allLoans.push(newLoan);
        allLoanIds.push(loanId);
        userLoanIds[msg.sender].push(loanId);

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
    ) external loanExists(loanId) loanNotFunded(loanId) {
        Loan storage loan = loans[loanId];

        IERC20(loan.loanToken).transferFrom(
            msg.sender,
            address(this),
            loan.loanAmount
        );

        loan.lender = msg.sender;
        // loan.loanTime.fundedAt = block.timestamp;
        loan.active = true;

        lenderLoanIds[msg.sender].push(loanId);

        emit LoanFunded(loanId, msg.sender);
    }

    function claimLoan(
        uint256 loanId
    ) external onlyNFTLister(loanId) loanFunded(loanId) nonReentrant {
        Loan storage loan = loans[loanId];

        uint256 platformFee = (loan.loanAmount * PLATFORM_FEE) / 100;
        uint256 loanPayout = loan.loanAmount - platformFee;

        IERC20(loan.loanToken).transfer(platformWallet, platformFee);
        IERC20(loan.loanToken).transfer(msg.sender, loanPayout);
        loan.loanClaimed = true;
        // loan.loanTime.claimedAt = block.timestamp;

        emit LoanClaimed(loanId, msg.sender);
    }

    function repayLoan(
        uint256 loanId
    )
        external
        onlyNFTLister(loanId)
        loanFunded(loanId)
        withinRepaymentPeriod(loanId)
        notRepaid(loanId)
        nonReentrant
    {
        Loan storage loan = loans[loanId];

        uint256 interest = (loan.loanAmount * loan.interestRate) / 100;
        uint256 repaymentAmount = loan.loanAmount + interest;

        IERC20(loan.loanToken).transferFrom(
            msg.sender,
            address(this),
            repaymentAmount
        );

        // ✅ Update Borrower's Loan Status Only
        loan.repaid = true; // Borrower has repaid
        loan.active = true;
        // loan.loanTime.repaidAt = block.timestamp;

        // ✅ Update Borrower's `userLoanIds` to reflect their perspective
        uint256[] storage loanIds = userLoanIds[msg.sender];
        for (uint256 i = 0; i < loanIds.length; i++) {
            if (loanIds[i] == loanId) {
                loanIds[i] = loanId; // Ensuring status updates correctly
            }
        }

        // ✅ Update Lender's `lenderLoanIds` so the lender knows the loan is repaid
        uint256[] storage lenderLoans = lenderLoanIds[loan.lender];
        for (uint256 i = 0; i < lenderLoans.length; i++) {
            if (lenderLoans[i] == loanId) {
                lenderLoans[i] = loanId;
            }
        }

        // ✅ NFT is returned to the borrower after repayment
        IERC721(loan.nftAddress).safeTransferFrom(
            address(this),
            msg.sender,
            loan.nftId
        );

        emit LoanRepaid(loanId, msg.sender);
    }

    function claimRepayment(
        uint256 loanId
    ) external onlyLender(loanId) nonReentrant loanRepaid(loanId) {
        Loan storage loan = loans[loanId];

        uint256 repaymentAmount = loan.loanAmount +
            (loan.loanAmount * loan.interestRate) /
            100;
        IERC20(loan.loanToken).transfer(msg.sender, repaymentAmount);

        // ✅ Now mark loan as COMPLETED from the Lender's Perspective
        loan.completed = true;
        // loan.loanTime.completedAt = block.timestamp;
        loan.active = false; // ✅ NOW mark the loan as inactive!
        loan.cancelled = false;

        // ✅ Updating Lender's `lenderLoanIds`
        uint256[] storage loanIds = lenderLoanIds[msg.sender];
        for (uint256 i = 0; i < loanIds.length; i++) {
            if (loanIds[i] == loanId) {
                loanIds[i] = loanId; // Ensuring lender sees the correct status
            }
        }

        // ✅ Add to completedLoanIds since it's fully settled
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
        require(!loan.repaid, "Loan already repaid, cannot claim NFT");

        IERC721(loan.nftAddress).safeTransferFrom(
            address(this),
            msg.sender,
            loan.nftId
        );

        loan.completed = true;
        loan.active = false;
        // loan.loanTime.completedAt = block.timestamp;
        completedLoanIds.push(loanId);

        emit NFTClaimedByLender(loanId, msg.sender);
    }

    /** 🔍 VIEW FUNCTIONS */

    // Get all active loans
    function getAllLoans() external view returns (Loan[] memory) {
        return allLoans;
    }

    function getUnfundedLoans() external view returns (Loan[] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < allLoanIds.length; i++) {
            Loan storage loan = loans[allLoanIds[i]];
            if (
                loan.lender == address(0) && !loan.completed && !loan.cancelled
            ) {
                count++;
            }
        }

        Loan[] memory unfundedLoans = new Loan[](count);
        uint256 index = 0;
        for (uint256 i = 0; i < allLoanIds.length; i++) {
            Loan storage loan = loans[allLoanIds[i]];
            if (
                loan.lender == address(0) && !loan.completed && !loan.cancelled
            ) {
                unfundedLoans[index] = loan;
                index++;
            }
        }
        return unfundedLoans;
    }

    // Get all loans by a specific user
    function getUserLoans(address user) external view returns (Loan[] memory) {
        uint256[] storage loanIds = userLoanIds[user];
        Loan[] memory result = new Loan[](loanIds.length);
        for (uint256 i = 0; i < loanIds.length; i++) {
            result[i] = loans[loanIds[i]];
        }
        return result;
    }

    // Get all loans by a specific lender
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

    // Withdrawal function

    function withdrawERC20(address _tokenAddress) external onlyOwner {
        uint256 balance = IERC20(_tokenAddress).balanceOf(address(this));
        require(balance > 0, "No funds to withdraw");
        IERC20(_tokenAddress).transfer(owner(), balance);
    }

    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        if (balance > 0) {
            (bool success, ) = payable(owner()).call{value: balance}("");
            require(success, "Withdraw failed");
        }
    }

    function cancelLoanAndWithdrawNFT(
        uint256 loanId
    )
        external
        loanExists(loanId)
        onlyNFTLister(loanId)
        loanNotFunded(loanId)
        nonReentrant
    {
        Loan storage loan = loans[loanId];

        require(!loan.completed, "Loan already completed");

        // Transfer NFT back to the owner
        IERC721(loan.nftAddress).safeTransferFrom(
            address(this),
            loan.nftOwner,
            loan.nftId
        );

        loan.cancelled = true;
        loan.active = false;

        cancelledLoanIds.push(loanId);

        emit NFTWithdrawn(loanId, loan.nftOwner);
    }
}
