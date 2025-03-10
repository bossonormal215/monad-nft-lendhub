// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract LoanGovernance {
    mapping(address => uint256) public lenderReputation;
    mapping(address => uint256) public platformFeesCollected;
    
    event ReputationUpdated(address indexed lender, uint256 newScore);
    event FeeDistributed(address indexed lender, uint256 amount);

    function updateReputation(address lender, bool successfulLoan) external {
        if (successfulLoan) {
            lenderReputation[lender] += 10;
        } else {
            lenderReputation[lender] -= 20;
        }
        emit ReputationUpdated(lender, lenderReputation[lender]);
    }

    function distributeFees(address lender, uint256 feeAmount) external {
        require(platformFeesCollected[msg.sender] >= feeAmount, "Insufficient fees");
        platformFeesCollected[msg.sender] -= feeAmount;
        
        payable(lender).transfer(feeAmount);
        
        emit FeeDistributed(lender, feeAmount);
    }
}
