// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Tipping {
    mapping(address => uint256) public balances;

    event Tipped(
        address indexed sender,
        address indexed receiver,
        uint256 amount
    );

    function tip(address recipient) public payable {
        require(msg.value > 0, "Must send ETH");
        balances[recipient] += msg.value;
        emit Tipped(msg.sender, recipient, msg.value);
    }

    function withdraw() public {
        uint256 amount = balances[msg.sender];
        require(amount > 0, "No funds to withdraw");
        balances[msg.sender] = 0;
        payable(msg.sender).transfer(amount);
    }
}
