// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IUSDTLiquidityPool {
    function addLiquidity(uint256 amount) external;

    function removeLiquidity(uint256 amount) external;

    function borrowUSDT(address borrower, uint256 amount) external;

    function getTotalLiquidity() external view returns (uint256);

    function getAvailableLiquidity() external view returns (uint256);

    function getTotalBorrowed() external view returns (uint256);

    function getUserDeposit(address user) external view returns (uint256);
}
