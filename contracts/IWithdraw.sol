// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @dev Interface for withdraw from SplitWallet
 */
interface IWithdraw {

    /**
     * @dev withdraw funds to the wallet owners based on their allocations
     */
    function withdraw(address token) external;

    /**
     * @dev Returns the amount of bounty
     */
    function getBounty() external view returns (uint256);
}
