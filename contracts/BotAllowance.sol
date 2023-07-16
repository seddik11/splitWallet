// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract BotAllowance {
    address public owner;
    IERC20 public token;
    mapping(address => bool) public bots;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    constructor(address _token) {
        owner = msg.sender;
        token = IERC20(_token);
    }

    function addBot(address bot) public onlyOwner {
        bots[bot] = true;
    }
}