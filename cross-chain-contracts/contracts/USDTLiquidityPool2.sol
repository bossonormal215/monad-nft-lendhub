// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract LiquidityPool2 is Ownable {
    // user => token => deposit amount
    mapping(address => mapping(address => uint256)) public deposits;
    // token => total deposits
    mapping(address => uint256) public totalTokenDeposits;

    event LiquidityAdded(
        address indexed provider,
        address indexed token,
        uint256 amount
    );
    event LiquidityRemoved(
        address indexed provider,
        address indexed token,
        uint256 amount
    );
    event TokenBorrowed(
        address indexed borrower,
        address indexed token,
        uint256 amount
    );

    function addLiquidity(address token, uint256 amount) external {
        require(amount > 0, "Invalid amount");
        require(
            IERC20(token).transferFrom(msg.sender, address(this), amount),
            "Transfer failed"
        );

        deposits[msg.sender][token] += amount;
        totalTokenDeposits[token] += amount;

        emit LiquidityAdded(msg.sender, token, amount);
    }

    function removeLiquidity(address token, uint256 amount) external {
        require(amount > 0, "Invalid amount");
        require(deposits[msg.sender][token] >= amount, "Insufficient deposit");

        deposits[msg.sender][token] -= amount;
        totalTokenDeposits[token] -= amount;

        require(IERC20(token).transfer(msg.sender, amount), "Transfer failed");

        emit LiquidityRemoved(msg.sender, token, amount);
    }

    function borrow(
        address token,
        address borrower,
        uint256 amount
    ) external onlyOwner {
        require(
            amount <= getAvailableLiquidity(token),
            "Insufficient liquidity"
        );
        require(IERC20(token).transfer(borrower, amount), "Transfer failed");

        emit TokenBorrowed(borrower, token, amount);
    }

    function getAvailableLiquidity(
        address token
    ) public view returns (uint256) {
        return IERC20(token).balanceOf(address(this));
    }

    function getTotalDeposits(address token) external view returns (uint256) {
        return totalTokenDeposits[token];
    }

    function getUserDeposit(
        address user,
        address token
    ) external view returns (uint256) {
        return deposits[user][token];
    }
}
