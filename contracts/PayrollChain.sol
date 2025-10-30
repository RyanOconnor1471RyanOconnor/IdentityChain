// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title KYC registry (owner-managed)
contract KycRegistry {
    address public owner;
    mapping(address => bool) public isKyc;

    event SetKyc(address indexed user, bool allowed);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "NotOwner");
        _;
    }

    function setKyc(address user, bool allowed) external onlyOwner {
        isKyc[user] = allowed;
        emit SetKyc(user, allowed);
    }
}
