// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract NFTLendHub2 is Ownable, ReentrancyGuard {
    uint256 public constant PLATFORM_FEE = 2; // 2% Fee
    uint256 public constant GRACE_PERIOD = 7 days; // Grace period after loan due date

    address public immutable MON;
    address public immutable USDT;
    address public immutable ETH;
    address public platformWallet;

    struct Loan {
        address nftOwner;
        address nftAddress;
        uint256 nftId;
        address lender;
        uint256 loanAmount;
        uint256 interestRate;
        uint256 loanDuration;
        uint256 startTime;
        bool repaid;
        address loanToken;
        bool active;
        bool completed;
        // bool isFunded;
    }

    Loan[] public allLoans;
    Loan[] public activeLoans;
    Loan[] public completedLoans;

    mapping(address => Loan[]) public userLoans;
    mapping(address => Loan[]) public lenderLoans;
    mapping(address => mapping(uint256 => Loan)) public loans;

    event NFTListed(
        address indexed nftOwner,
        address indexed nftAddress,
        uint256 indexed nftId,
        uint256 loanAmount,
        uint256 interestRate,
        uint256 duration,
        address loanToken
    );
    event LoanFunded(
        address indexed lender,
        address indexed nftAddress,
        uint256 indexed nftId,
        uint256 amount
    );
    event LoanClaimed(
        address indexed borrower,
        address indexed nftAddress,
        uint256 indexed nftId
    );
    event LoanRepaid(
        address indexed borrower,
        address indexed nftAddress,
        uint256 indexed nftId,
        uint256 amount
    );
    event RepaymentClaimed(
        address indexed borrower,
        address indexed nftAddress,
        uint256 indexed nftId,
        uint256 amount
    );
    event NFTClaimedByLender(
        address indexed lender,
        address indexed nftAddress,
        uint256 indexed nftId
    );

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

    modifier onlyNFTLister(address _nftAddress, uint256 _nftId) {
        require(
            msg.sender == loans[_nftAddress][_nftId].nftOwner,
            "Not NFT Owner"
        );
        _;
    }

    modifier onlyLender(address _nftAddress, uint256 _nftId) {
        require(msg.sender == loans[_nftAddress][_nftId].lender, "Not Lender");
        _;
    }

    modifier loanExists(address _nftAddress, uint256 _nftId) {
        require(
            loans[_nftAddress][_nftId].nftOwner != address(0),
            "Loan does not exist"
        );
        _;
    }

    modifier loanNotFunded(address _nftAddress, uint256 _nftId) {
        require(
            loans[_nftAddress][_nftId].lender == address(0),
            "Loan already funded"
        );
        _;
    }

    modifier loanFunded(address _nftAddress, uint256 _nftId) {
        require(
            loans[_nftAddress][_nftId].lender != address(0),
            "Loan not funded"
        );
        _;
    }

    modifier notRepaid(address _nftAddress, uint256 _nftId) {
        require(!loans[_nftAddress][_nftId].repaid, "Loan already repaid");
        _;
    }

    modifier withinRepaymentPeriod(address _nftAddress, uint256 _nftId) {
        require(
            block.timestamp <=
                loans[_nftAddress][_nftId].startTime +
                    loans[_nftAddress][_nftId].loanDuration,
            "Loan overdue"
        );
        _;
    }

    modifier afterGracePeriod(address _nftAddress, uint256 _nftId) {
        require(
            block.timestamp >
                loans[_nftAddress][_nftId].startTime +
                    loans[_nftAddress][_nftId].loanDuration +
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

        Loan memory newLoan = Loan({
            nftOwner: msg.sender,
            nftAddress: _nftAddress,
            nftId: _nftId,
            lender: address(0),
            loanAmount: _loanAmount,
            interestRate: _interestRate,
            loanDuration: _loanDuration,
            startTime: 0,
            repaid: false,
            loanToken: _loanToken,
            active: false,
            completed: false
            // isFunded: false
        });

        loans[_nftAddress][_nftId] = newLoan;
        allLoans.push(newLoan);
        userLoans[msg.sender].push(newLoan);

        emit NFTListed(
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
        address _nftAddress,
        uint256 _nftId
    )
        external
        loanExists(_nftAddress, _nftId)
        loanNotFunded(_nftAddress, _nftId)
    {
        Loan storage loan = loans[_nftAddress][_nftId];

        IERC20(loan.loanToken).transferFrom(
            msg.sender,
            address(this),
            loan.loanAmount
        );

        loan.lender = msg.sender;
        loan.startTime = block.timestamp;
        loan.active = true;
        // loan.isFunded = true;

        lenderLoans[msg.sender].push(loan);

        // ✅ Update the user's loan status to reflect funding
        Loan[] storage userLoanList = userLoans[loan.nftOwner];
        for (uint256 i = 0; i < userLoanList.length; i++) {
            if (
                userLoanList[i].nftAddress == _nftAddress &&
                userLoanList[i].nftId == _nftId
            ) {
                userLoanList[i].lender = msg.sender;
                userLoanList[i].startTime = block.timestamp;
                // userLoanList[i].isFunded = true;
                userLoanList[i].active = true;
                break;
            }
        }

        for (uint256 i = 0; i < allLoans.length; i++) {
            if (
                allLoans[i].nftAddress == _nftAddress &&
                allLoans[i].nftId == _nftId
            ) {
                allLoans[i] = allLoans[allLoans.length - 1];
                allLoans.pop();
                break;
            }
        }
        activeLoans.push(loan);

        emit LoanFunded(msg.sender, _nftAddress, _nftId, loan.loanAmount);
    }

    function claimLoan(
        address _nftAddress,
        uint256 _nftId
    )
        external
        onlyNFTLister(_nftAddress, _nftId)
        loanFunded(_nftAddress, _nftId)
        nonReentrant
    {
        Loan storage loan = loans[_nftAddress][_nftId];

        uint256 platformFee = (loan.loanAmount * PLATFORM_FEE) / 100;
        uint256 loanPayout = loan.loanAmount - platformFee;

        IERC20(loan.loanToken).transfer(platformWallet, platformFee);
        IERC20(loan.loanToken).transfer(msg.sender, loanPayout);

        emit LoanClaimed(msg.sender, _nftAddress, _nftId);
    }

    function repayLoan(
        address _nftAddress,
        uint256 _nftId
    )
        external
        nonReentrant
        onlyNFTLister(_nftAddress, _nftId)
        loanFunded(_nftAddress, _nftId)
        withinRepaymentPeriod(_nftAddress, _nftId)
        notRepaid(_nftAddress, _nftId)
    {
        Loan storage loan = loans[_nftAddress][_nftId];

        uint256 interest = (loan.loanAmount * loan.interestRate) / 100;
        uint256 repaymentAmount = loan.loanAmount + interest;

        require(
            IERC20(loan.loanToken).transferFrom(
                msg.sender,
                address(this),
                repaymentAmount
            ),
            "Repayment failed"
        );

        loan.repaid = true;
        loan.completed = true;
        // ✅ Manually create a copy and push instead of referencing mapping
        Loan memory completedLoan = Loan({
            nftOwner: loan.nftOwner,
            nftAddress: loan.nftAddress,
            nftId: loan.nftId,
            lender: loan.lender,
            loanAmount: loan.loanAmount,
            interestRate: loan.interestRate,
            loanDuration: loan.loanDuration,
            startTime: loan.startTime,
            repaid: loan.repaid,
            loanToken: loan.loanToken,
            active: loan.active,
            completed: true // ✅ Mark as completed
            // isFunded: true
        });

        completedLoans.push(completedLoan);

        // ✅ NFT is returned to the borrower after repayment
        IERC721(loan.nftAddress).safeTransferFrom(
            address(this),
            msg.sender,
            loan.nftId
        );

        emit LoanRepaid(msg.sender, _nftAddress, _nftId, repaymentAmount);
    }

    function claimRepayment(
        address _nftAddress,
        uint256 _nftId
    ) external onlyLender(_nftAddress, _nftId) nonReentrant {
        Loan storage loan = loans[_nftAddress][_nftId];
        require(msg.sender == loan.lender, "Not lender");
        require(loan.repaid, "Loan not repaid yet");

        uint256 repaymentAmount = loan.loanAmount +
            (loan.loanAmount * loan.interestRate) /
            100;

        IERC20(loan.loanToken).transfer(msg.sender, repaymentAmount);
        loan.completed = true;

        emit RepaymentClaimed(msg.sender, _nftAddress, _nftId, repaymentAmount);
    }

    function claimNFT(
        address _nftAddress,
        uint256 _nftId
    )
        external
        onlyLender(_nftAddress, _nftId)
        loanFunded(_nftAddress, _nftId)
        afterGracePeriod(_nftAddress, _nftId)
        nonReentrant
    {
        Loan storage loan = loans[_nftAddress][_nftId];
        require(!loan.repaid, "Loan already repaid, cannot claim NFT");

        // IERC721(loan.nftAddress).transfer(msg.sender, loan.nftId);
        IERC721(loan.nftAddress).safeTransferFrom(
            address(this),
            msg.sender,
            loan.nftId
        );

        emit NFTClaimedByLender(msg.sender, _nftAddress, _nftId);
    }

    function getAllLoans() external view returns (Loan[] memory) {
        return allLoans;
    }

    function getCompletedLoans() external view returns (Loan[] memory) {
        return completedLoans;
    }

    function getUserLoans(address user) external view returns (Loan[] memory) {
        return userLoans[user];
    }

    function getLenderLoans(
        address lender
    ) external view returns (Loan[] memory) {
        return lenderLoans[lender];
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
}
