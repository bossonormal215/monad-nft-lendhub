/*
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract USDTLiquidityPool is Ownable {
    IERC20 public usdt;
    uint256 public totalDeposits;
    
    struct Deposit {
        uint256 amount;
        uint256 points; // Reward points for depositors
    }
    
    mapping(address => Deposit) public deposits;
    mapping(address => uint256) public rewards; // Track user rewards

    event Deposited(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event RewardClaimed(address indexed user, uint256 points);

    constructor(address _usdt) {
        usdt = IERC20(_usdt);
    }

    function deposit(uint256 amount) external {
        require(amount > 0, "Cannot deposit zero USDT");
        usdt.transferFrom(msg.sender, address(this), amount);
        
        deposits[msg.sender].amount += amount;
        deposits[msg.sender].points += amount / 10; // Example: 1 point per 10 USDT
        totalDeposits += amount;

        emit Deposited(msg.sender, amount);
    }

    function withdraw(uint256 amount) external {
        require(deposits[msg.sender].amount >= amount, "Insufficient balance");
        
        deposits[msg.sender].amount -= amount;
        totalDeposits -= amount;
        usdt.transfer(msg.sender, amount);

        emit Withdrawn(msg.sender, amount);
    }

    function claimRewards() external {
        uint256 rewardPoints = deposits[msg.sender].points;
        require(rewardPoints > 0, "No rewards to claim");

        rewards[msg.sender] += rewardPoints;
        deposits[msg.sender].points = 0; // Reset points

        emit RewardClaimed(msg.sender, rewardPoints);
    }

    function getUserDeposit(address user) external view returns (uint256) {
        return deposits[user].amount;
    }

    function getUserPoints(address user) external view returns (uint256) {
        return deposits[user].points;
    }
}
*/
////////////////////////////////////////////////
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract USDTLiquidityPool is Ownable {
    IERC20 public usdt;

    mapping(address => uint256) public deposits;
    uint256 public totalDeposits;

    event LiquidityAdded(address indexed provider, uint256 amount);
    event LiquidityRemoved(address indexed provider, uint256 amount);
    event USDTBorrowed(address indexed borrower, uint256 amount);
    event USDTRepaid(address indexed borrower, uint256 amount);

    constructor(address _usdt) {
        usdt = IERC20(_usdt);
    }

    function addLiquidity(uint256 amount) external {
        require(amount > 0, "Amount must be greater than 0");
        require(
            usdt.transferFrom(msg.sender, address(this), amount),
            "USDT transfer failed"
        );

        deposits[msg.sender] += amount;
        totalDeposits += amount;

        emit LiquidityAdded(msg.sender, amount);
    }

    function removeLiquidity(uint256 amount) external {
        require(amount > 0, "Amount must be greater than 0");
        require(deposits[msg.sender] >= amount, "Insufficient balance");
        require(
            totalDeposits - amount >= getTotalBorrowed(),
            "Insufficient liquidity"
        );

        deposits[msg.sender] -= amount;
        totalDeposits -= amount;

        require(usdt.transfer(msg.sender, amount), "USDT transfer failed");

        emit LiquidityRemoved(msg.sender, amount);
    }

    function borrowUSDT(address borrower, uint256 amount) external {
        // Only LoanManager can call this
        require(msg.sender == owner(), "Unauthorized");
        require(amount <= getAvailableLiquidity(), "Insufficient liquidity");

        require(usdt.transfer(borrower, amount), "USDT transfer failed");

        emit USDTBorrowed(borrower, amount);
    }

    function getTotalLiquidity() external view returns (uint256) {
        return totalDeposits;
    }

    function getAvailableLiquidity() public view returns (uint256) {
        return usdt.balanceOf(address(this));
    }

    function getTotalBorrowed() public view returns (uint256) {
        return totalDeposits - getAvailableLiquidity();
    }

    function getUserDeposit(address user) external view returns (uint256) {
        return deposits[user];
    }
}
