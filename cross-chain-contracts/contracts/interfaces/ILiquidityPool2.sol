// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface ILiquidityPool {
    function addLiquidity(address token, uint256 amount) external;

    function removeLiquidity(address token, uint256 amount) external;

    function borrow(address token, address borrower, uint256 amount) external;

    function getAvailableLiquidity(
        address token
    ) external view returns (uint256);

    function getTotalDeposits(address token) external view returns (uint256);

    function getUserDeposit(
        address user,
        address token
    ) external view returns (uint256);
}
