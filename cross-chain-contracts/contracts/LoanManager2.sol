// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./interfaces/INFTCollateralVault.sol";
import "./interfaces/ILiquidityPool2.sol";

contract LoanManager2 is Ownable {
    struct Loan {
        uint256 collateralId;
        uint256 amount;
        uint256 timestamp;
        uint256 interestRate;
        uint256 duration;
        address token;
        bool isActive;
        bool isLiquidated;
    }

    mapping(address => mapping(uint256 => Loan)) public loansByToken;
    mapping(address => uint256[]) public userLoans;

    INFTCollateralVault public nftVault;
    ILiquidityPool public liquidityPool;

    uint256 public constant INTEREST_RATE = 1000;
    uint256 public constant MIN_LOAN_DURATION = 5 minutes;
    uint256 public constant MAX_LOAN_DURATION = 30 days;

    event LoanIssued(
        address indexed borrower,
        address token,
        uint256 indexed collateralId,
        uint256 amount,
        uint256 duration,
        uint256 timestamp
    );
    event LoanRepaid(
        address indexed borrower,
        address token,
        uint256 indexed collateralId,
        uint256 amount,
        uint256 interest
    );
    event LoanLiquidated(
        address indexed borrower,
        address token,
        uint256 indexed collateralId,
        address newOwner
    );

    constructor(address _nftVault, address _liquidityPool) {
        nftVault = INFTCollateralVault(_nftVault);
        liquidityPool = ILiquidityPool(_liquidityPool);
    }

    function issueLoan(
        address token,
        uint256 collateralId,
        uint256 amount,
        uint256 duration
    ) external {
        require(
            duration >= MIN_LOAN_DURATION && duration <= MAX_LOAN_DURATION,
            "Invalid loan duration"
        );

        (
            ,
            ,
            address owner,
            uint256 maxLoanAmount,
            uint256 currentLoanAmount,
            bool isActive
        ) = nftVault.getCollateralDetails(collateralId);

        require(owner == msg.sender, "Not collateral owner");
        require(isActive, "Collateral not active");
        require(amount <= maxLoanAmount, "Exceeds max loan");
        require(currentLoanAmount == 0, "Loan exists");
        require(
            amount <= liquidityPool.getAvailableLiquidity(token),
            "Insufficient liquidity"
        );

        loansByToken[token][collateralId] = Loan({
            collateralId: collateralId,
            amount: amount,
            timestamp: block.timestamp,
            interestRate: INTEREST_RATE,
            duration: duration,
            token: token,
            isActive: true,
            isLiquidated: false
        });

        userLoans[msg.sender].push(collateralId);
        nftVault.updateLoanAmount(collateralId, amount);
        liquidityPool.borrow(token, msg.sender, amount);

        emit LoanIssued(
            msg.sender,
            token,
            collateralId,
            amount,
            duration,
            block.timestamp
        );
    }

    function repayLoan(address token, uint256 collateralId) external {
        Loan storage loan = loansByToken[token][collateralId];
        require(loan.isActive, "Inactive loan");
        require(
            block.timestamp <= loan.timestamp + loan.duration,
            "Loan expired"
        );

        uint256 interest = calculateInterest(loan.amount, loan.timestamp);
        uint256 totalRepayment = loan.amount + interest;

        require(
            IERC20(token).transferFrom(
                msg.sender,
                address(liquidityPool),
                totalRepayment
            ),
            "Transfer failed"
        );

        loan.isActive = false;
        nftVault.updateLoanAmount(collateralId, 0);

        emit LoanRepaid(msg.sender, token, collateralId, loan.amount, interest);
    }

    function liquidateOverdueLoan(
        address token,
        uint256 collateralId
    ) external {
        Loan storage loan = loansByToken[token][collateralId];
        require(loan.isActive, "Loan not active");
        require(
            block.timestamp > loan.timestamp + loan.duration,
            "Loan not overdue"
        );

        loan.isActive = false;
        loan.isLiquidated = true;

        nftVault.transferCollateral(collateralId, owner());

        emit LoanLiquidated(msg.sender, token, collateralId, owner());
    }

    function calculateInterest(
        uint256 amount,
        uint256 startTime
    ) public view returns (uint256) {
        uint256 timeElapsed = block.timestamp - startTime;
        return (amount * INTEREST_RATE * timeElapsed) / (30 days * 10000);
    }
}
