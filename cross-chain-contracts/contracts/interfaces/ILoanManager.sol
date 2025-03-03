// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface ILoanManager {
    struct Loan {
        uint256 collateralId;
        uint256 amount;
        uint256 timestamp;
        bool isActive;
        uint256 interestRate;
        uint256 duration;
    }

    function loans(uint256 collateralId) external view returns (Loan memory);

    function issueLoan(uint256 collateralId, uint256 amount) external;

    function repayLoan(uint256 collateralId) external;

    function isLoanLiquidatable(
        uint256 collateralId
    ) external view returns (bool);

    function calculateInterest(
        uint256 amount,
        uint256 startTime
    ) external view returns (uint256);
}
