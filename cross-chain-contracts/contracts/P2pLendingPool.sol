// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract LendingPool {
    address public MON;
    address public USDT;
    address public ETH;

    struct Pool {
        uint256 totalDeposits;
        uint256 totalLoans;
    }

    mapping(address => mapping(address => uint256)) public userDeposits; // user => token => amount
    mapping(address => Pool) public liquidityPools; // token => Pool data

    event Deposited(address indexed user, address indexed token, uint256 amount);
    event Withdrawn(address indexed user, address indexed token, uint256 amount);
    event LoanIssued(address indexed borrower, address indexed token, uint256 amount);

    constructor(address _MON, address _USDT, address _ETH) {
        MON = _MON;
        USDT = _USDT;
        ETH = _ETH;
    }

    function deposit(address _token, uint256 _amount) external {
        require(_token == MON || _token == USDT || _token == ETH, "Unsupported token");

        IERC20(_token).transferFrom(msg.sender, address(this), _amount);

        userDeposits[msg.sender][_token] += _amount;
        liquidityPools[_token].totalDeposits += _amount;

        emit Deposited(msg.sender, _token, _amount);
    }

    function withdraw(address _token, uint256 _amount) external {
        require(userDeposits[msg.sender][_token] >= _amount, "Insufficient balance");

        userDeposits[msg.sender][_token] -= _amount;
        liquidityPools[_token].totalDeposits -= _amount;

        IERC20(_token).transfer(msg.sender, _amount);

        emit Withdrawn(msg.sender, _token, _amount);
    }

    function issueLoan(address borrower, address _token, uint256 _amount) external {
        require(liquidityPools[_token].totalDeposits >= _amount, "Not enough liquidity");

        liquidityPools[_token].totalDeposits -= _amount;
        liquidityPools[_token].totalLoans += _amount;

        IERC20(_token).transfer(borrower, _amount);

        emit LoanIssued(borrower, _token, _amount);
    }
}
