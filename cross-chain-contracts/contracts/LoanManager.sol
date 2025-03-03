/* pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./NFTCollateralVault.sol";
import "./USDTLiquidityPool.sol";

contract LoanManager {
    IERC20 public usdt;
    NFTCollateralVault public vault;
    USDTLiquidityPool public liquidityPool;
    uint256 public interestRate = 10; // 10% interest

    struct Loan {
        address borrower;
        uint256 collateralId;
        uint256 amount;
        uint256 interest;
        bool isActive;
    }

    mapping(uint256 => Loan) public loans;
    uint256 public loanCounter;

    event LoanIssued(address indexed borrower, uint256 indexed collateralId, uint256 amount, uint256 interest);
    event LoanRepaid(address indexed borrower, uint256 indexed collateralId);

    constructor(address _usdt, address _vault, address _liquidityPool) {
        usdt = IERC20(_usdt);
        vault = NFTCollateralVault(_vault);
        liquidityPool = USDTLiquidityPool(_liquidityPool);
    }

    function issueLoan(uint256 collateralId, uint256 amount) external {
        require(liquidityPool.getUserDeposit(address(this)) >= amount, "Insufficient liquidity");
        
        vault.depositNFT(msg.sender, collateralId, amount);
        uint256 interest = (amount * interestRate) / 100;
        loanCounter++;

        loans[loanCounter] = Loan({
            borrower: msg.sender,
            collateralId: collateralId,
            amount: amount,
            interest: interest,
            isActive: true
        });

        liquidityPool.withdraw(amount);
        usdt.transfer(msg.sender, amount);

        emit LoanIssued(msg.sender, collateralId, amount, interest);
    }

    function repayLoan(uint256 loanId) external {
        require(loans[loanId].borrower == msg.sender, "Not loan owner");
        require(loans[loanId].isActive, "Loan inactive");

        uint256 totalOwed = loans[loanId].amount + loans[loanId].interest;
        usdt.transferFrom(msg.sender, address(this), totalOwed);
        vault.withdrawNFT(loans[loanId].collateralId);

        loans[loanId].isActive = false;
        liquidityPool.deposit(totalOwed); // Repay to pool

        emit LoanRepaid(msg.sender, loans[loanId].collateralId);
    }
}
*/
///////////////////////////////////////////
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./interfaces/INFTCollateralVault.sol";
import "./interfaces/IUSDTLiquidityPool.sol";

contract LoanManager is Ownable {
    struct Loan {
        uint256 collateralId;
        uint256 amount;
        uint256 timestamp;
        bool isActive;
        uint256 interestRate; // Annual interest rate in basis points (1% = 100)
        uint256 duration; // Loan duration in seconds
    }

    mapping(uint256 => Loan) public loans;
    mapping(address => uint256[]) public userLoans;

    IERC20 public usdt;
    INFTCollateralVault public nftVault;
    IUSDTLiquidityPool public liquidityPool;

    uint256 public constant INTEREST_RATE = 1000; // 10% annual interest
    uint256 public constant LOAN_DURATION = 30 days;
    uint256 public constant LIQUIDATION_THRESHOLD = 8500; // 85%

    event LoanIssued(
        address indexed borrower,
        uint256 indexed collateralId,
        uint256 amount,
        uint256 timestamp
    );
    event LoanRepaid(
        address indexed borrower,
        uint256 indexed collateralId,
        uint256 amount,
        uint256 interest
    );

    constructor(address _usdt, address _nftVault, address _liquidityPool) {
        usdt = IERC20(_usdt);
        nftVault = INFTCollateralVault(_nftVault);
        liquidityPool = IUSDTLiquidityPool(_liquidityPool);
    }

    function issueLoan(uint256 collateralId, uint256 amount) external {
        // Get collateral details
        (
            address nftAddress,
            uint256 tokenId,
            address owner,
            uint256 maxLoanAmount,
            uint256 currentLoanAmount,
            bool isActive
        ) = nftVault.getCollateralDetails(collateralId);

        require(owner == msg.sender, "Not collateral owner");
        require(isActive, "Collateral not active");
        require(amount <= maxLoanAmount, "Amount exceeds max loan");
        require(currentLoanAmount == 0, "Loan already exists");
        require(
            amount <= liquidityPool.getTotalLiquidity(),
            "Insufficient liquidity"
        );

        // Create loan
        loans[collateralId] = Loan({
            collateralId: collateralId,
            amount: amount,
            timestamp: block.timestamp,
            isActive: true,
            interestRate: INTEREST_RATE,
            duration: LOAN_DURATION
        });

        // Update user loans
        userLoans[msg.sender].push(collateralId);

        // Update vault
        nftVault.updateLoanAmount(collateralId, amount);

        // Transfer USDT to borrower
        liquidityPool.borrowUSDT(msg.sender, amount);

        emit LoanIssued(msg.sender, collateralId, amount, block.timestamp);
    }

    function repayLoan(uint256 collateralId) external {
        Loan storage loan = loans[collateralId];
        require(loan.isActive, "Loan not active");

        // Calculate repayment amount with interest
        uint256 interest = calculateInterest(loan.amount, loan.timestamp);
        uint256 totalRepayment = loan.amount + interest;

        // Transfer USDT from user
        require(
            usdt.transferFrom(
                msg.sender,
                address(liquidityPool),
                totalRepayment
            ),
            "USDT transfer failed"
        );

        // Update loan status
        loan.isActive = false;
        nftVault.updateLoanAmount(collateralId, 0);

        emit LoanRepaid(msg.sender, collateralId, loan.amount, interest);
    }

    function calculateInterest(
        uint256 amount,
        uint256 startTime
    ) public view returns (uint256) {
        uint256 timeElapsed = block.timestamp - startTime;
        return (amount * INTEREST_RATE * timeElapsed) / (365 days * 10000);
    }

    function getUserLoans(
        address user
    )
        external
        view
        returns (
            uint256[] memory collateralIds,
            uint256[] memory amounts,
            uint256[] memory timestamps,
            bool[] memory activeStates,
            uint256[] memory interestAmounts
        )
    {
        uint256[] storage userLoanIds = userLoans[user];
        uint256 length = userLoanIds.length;

        collateralIds = new uint256[](length);
        amounts = new uint256[](length);
        timestamps = new uint256[](length);
        activeStates = new bool[](length);
        interestAmounts = new uint256[](length);

        for (uint256 i = 0; i < length; i++) {
            uint256 loanId = userLoanIds[i];
            Loan storage loan = loans[loanId];

            collateralIds[i] = loan.collateralId;
            amounts[i] = loan.amount;
            timestamps[i] = loan.timestamp;
            activeStates[i] = loan.isActive;
            interestAmounts[i] = loan.isActive
                ? calculateInterest(loan.amount, loan.timestamp)
                : 0;
        }
    }

    function isLoanLiquidatable(
        uint256 collateralId
    ) public view returns (bool) {
        Loan storage loan = loans[collateralId];
        if (!loan.isActive) return false;

        uint256 interest = calculateInterest(loan.amount, loan.timestamp);
        uint256 totalDebt = loan.amount + interest;

        (, , , uint256 maxLoanAmount, , ) = nftVault.getCollateralDetails(
            collateralId
        );

        return (totalDebt * 10000) / maxLoanAmount >= LIQUIDATION_THRESHOLD;
    }
}
